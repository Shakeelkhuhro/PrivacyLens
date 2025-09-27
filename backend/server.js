// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

const app = express();
const port = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 3600 });

app.use(cors());
app.use(express.json());
app.set('json spaces', 2);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});
app.use(limiter);

// ---------- helpers ----------
function absoluteUrl(href, base = 'https://play.google.com') {
  if (!href) return null;
  try {
    if (/^https?:\/\//i.test(href)) return href;
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function preferDeveloperPrivacyLink(candidates) {
  if (!candidates.length) return null;
  // Prefer non-Google domains (developer's own site), then any privacy link.
  const nonGoogle = candidates.find(u => !/google\.com/i.test(u));
  return nonGoogle || candidates[0];
}

function extractDownloadsFromHtml($) {
  const candidates = [];

  $('div,span').each((_, el) => {
    const t = $(el).text().trim();
    if (!t) return;
    const m = t.match(/([0-9][0-9.,]*\s*[kKmMbB]?\+?)\s*downloads/i);
    if (m) candidates.push(`${m[1].replace(/\s+/g, '')} downloads`);
  });

  const seen = new Set();
  for (const c of candidates) {
    const key = c.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      return c;
    }
  }
  return null;
}

function extractDeveloperContacts($) {
  const website = $('a[href^="http"]').filter((i, el) => {
    const txt = $(el).text().toLowerCase();
    return txt.includes('visit') && txt.includes('website');
  }).first().attr('href') || null;

  const email = ($('a[href^="mailto:"]').first().attr('href') || '')
    .replace(/^mailto:/i, '') || null;

  return { developerWebsite: website || null, developerEmail: email || null };
}

// ---------- Privacy Score Calculation ----------
function calculatePrivacyScore(metadata, privacyData) {
  let score = 100; // Start with perfect score
  
  // 1. Privacy Policy Presence (-30 if missing)
  if (!metadata.privacyPolicyUrl) {
    score -= 30;
  }
  
  // 2. Data Collection (-20 if data is collected)
  if (privacyData.dataCollected && privacyData.dataCollected.length > 0) {
    score -= 20;
  }
  
  // 3. Data Sharing (-25 if data is shared)
  if (privacyData.dataShared && privacyData.dataShared.length > 0) {
    score -= 25;
  }
  
  // 4. Developer Reputation (adjust based on known data-hungry developers)
  const dataHungryDevelopers = [
    'meta', 'facebook', 'instagram', 'whatsapp', 
    'google', 'alphabet', 'tiktok', 'bytedance',
    'amazon', 'microsoft', 'twitter', 'snap'
  ];
  
  const developerLower = metadata.developer?.toLowerCase() || '';
  if (dataHungryDevelopers.some(dev => developerLower.includes(dev))) {
    score -= 15;
  }
  
  // 5. App Category Risk (social/media apps are higher risk)
  const highRiskCategories = ['social', 'communication', 'entertainment', 'dating'];
  const categoryLower = metadata.category?.toLowerCase() || '';
  if (highRiskCategories.some(cat => categoryLower.includes(cat))) {
    score -= 10;
  }
  
  // 6. Security Practices (+10 if good security)
  if (privacyData.securityPractices) {
    const practices = privacyData.securityPractices;
    if (practices.encryptedInTransit && practices.secureConnection) {
      score += 10;
    }
    if (practices.userDataDeletionRequest && practices.developerDataDeletionMechanism) {
      score += 5;
    }
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

// ---------- name -> packageId ----------
async function resolveAppId(query) {
  if (query.includes('.')) return query;

  const searchUrl = `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps&hl=en&gl=US`;
  try {
    const { data } = await axios.get(searchUrl, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const $ = cheerio.load(data);
    const href = $('a[href*="/store/apps/details?id="]').first().attr('href');
    if (!href) return null;
    const m = href.match(/id=([a-zA-Z0-9._]+)/);
    return m ? m[1] : null;
  } catch (e) {
    console.error('App search failed:', e.message);
    return null;
  }
}

// ---------- scrape app details ----------
async function scrapeGooglePlay(appId) {
  const url = `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=US`;
  try {
    const { data } = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(data);

    // JSON-LD (base metadata)
    let appJson = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'SoftwareApplication') appJson = json;
      } catch {}
    });

    // Fallbacks if JSON-LD missing
    const appName = appJson?.name || $('h1 span').first().text().trim() || null;
    const developer = appJson?.author?.name || $('div.Vbfug.auoIOc span a, a.hrTbp').first().text().trim() || null;
    const category = appJson?.applicationCategory || null;
    const ratingValue = appJson?.aggregateRating?.ratingValue || $('div.TT9eCd').first().text().trim() || null;
    const ratingCount = appJson?.aggregateRating?.ratingCount || null;
    const contentRating = appJson?.contentRating || null;
    const icon = appJson?.image || $('img.T75of').first().attr('src') || null;

    // Downloads
    const downloads = extractDownloadsFromHtml($);

    // Privacy Policy
    let privacyCandidates = $('div.viuTPb a.GO2pB[href]')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter(Boolean);

    if (!privacyCandidates.length) {
      privacyCandidates = $('div.viuTPb a[href]')
        .filter((_, el) => $(el).text().toLowerCase().includes('privacy'))
        .map((_, el) => $(el).attr('href'))
        .get();
    }

    if (!privacyCandidates.length) {
      privacyCandidates = $('a[href*="privacy"]')
        .map((_, el) => $(el).attr('href'))
        .get();
    }

    privacyCandidates = privacyCandidates.map(href => absoluteUrl(href));
    const privacyPolicyUrl = preferDeveloperPrivacyLink(privacyCandidates) || null;

    // Developer contacts
    const { developerWebsite, developerEmail } = extractDeveloperContacts($);

    return {
      appName,
      developer,
      packageId: appId,
      category,
      downloads,
      ratingValue,
      ratingCount,
      contentRating,
      icon,
      privacyPolicyUrl,
      developerWebsite,
      developerEmail,
      storeUrl: url
    };
  } catch (error) {
    console.error('Scraping failed for', appId, ':', error.message);
    return null;
  }
}

// ---------- scrape privacy policy (enhanced for privacy score) ----------
async function scrapePrivacyPolicy(url) {
  if (!url || !/^https?:\/\//i.test(url)) return { 
    text: null, 
    dataShared: [], 
    dataCollected: [],
    securityPractices: {
      encryptedInTransit: false,
      secureConnection: false,
      userDataDeletionRequest: false,
      developerDataDeletionMechanism: false
    }
  };

  try {
    const { data } = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const $ = cheerio.load(data);
    $('script, style, nav, footer, header, iframe').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    const lower = text.toLowerCase();

    // Enhanced data detection
    const dataShared = [];
    const dataCollected = [];
    
    // Detect specific data types being collected
    const dataTypes = [
      'location', 'email', 'phone', 'contact', 'photo', 'camera', 'microphone',
      'payment', 'credit card', 'bank', 'address', 'birthday', 'age', 'gender',
      'message', 'sms', 'call', 'browser history', 'search history', 'device id'
    ];
    
    dataTypes.forEach(type => {
      if (lower.includes(type)) {
        dataCollected.push({ type: type.charAt(0).toUpperCase() + type.slice(1), purpose: 'App functionality' });
      }
    });

    // Detect data sharing
    if (lower.includes('share') || lower.includes('third party') || lower.includes('partner')) {
      dataShared.push({ type: 'User data', purpose: 'Third-party services / analytics' });
    }

    // Detect security practices
    const securityPractices = {
      encryptedInTransit: lower.includes('encrypt') || lower.includes('ssl') || lower.includes('tls'),
      secureConnection: lower.includes('secure connection') || lower.includes('https'),
      userDataDeletionRequest: lower.includes('delete') || lower.includes('remove data'),
      developerDataDeletionMechanism: lower.includes('contact') && lower.includes('privacy')
    };

    return { 
      text: text ? text.slice(0, 3000) : null, 
      dataShared, 
      dataCollected,
      securityPractices 
    };
  } catch (err) {
    console.error('Privacy scraping failed:', err.message);
    return { 
      text: null, 
      dataShared: [], 
      dataCollected: [],
      securityPractices: {
        encryptedInTransit: false,
        secureConnection: false,
        userDataDeletionRequest: false,
        developerDataDeletionMechanism: false
      }
    };
  }
}

// ---------- API ----------
app.get('/api/app/:query', async (req, res) => {
  const query = req.params.query.trim();

  // cache by query (name or id)
  const cached = cache.get(query.toLowerCase());
  if (cached) return res.json(cached);

  const appId = await resolveAppId(query);
  if (!appId) return res.status(404).json({ error: 'App not found' });

  const metadata = await scrapeGooglePlay(appId);
  if (!metadata) return res.status(500).json({ error: 'Failed to fetch metadata' });

  const privacyData = await scrapePrivacyPolicy(metadata.privacyPolicyUrl);
  
  // Calculate privacy score
  const privacyScore = calculatePrivacyScore(metadata, privacyData);
  
  // Add privacy score to metadata
  metadata.privacyScore = privacyScore;

  const result = {
    metadata,
    dataSafety: {
      dataShared: privacyData.dataShared.length ? privacyData.dataShared : null,
      dataCollected: privacyData.dataCollected.length ? privacyData.dataCollected : null,
      securityPractices: privacyData.securityPractices
    },
    notes: metadata.privacyPolicyUrl
      ? 'App has a developer privacy policy link on Play Store.'
      : 'No developer privacy policy link found on Play Store section.'
  };

  console.log(`📊 Privacy Score for ${metadata.appName}: ${privacyScore}/100`);
  
  cache.set(query.toLowerCase(), result);
  res.json(result);
});

// ---------- root & health ----------
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PrivacyLens API',
    usage: '/api/app/:packageIdOrName',
    example1: '/api/app/com.instagram.android',
    example2: '/api/app/facebook',
    features: 'Now includes real privacy score calculation (0-100)'
  });
});

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.listen(port, () => console.log(`✅ PrivacyLens backend running at http://localhost:${port}`));