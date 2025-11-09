const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const { analyzePolicyTextWithLLM, isConfigured: isAzureConfigured } = require('./azureOpenAI');

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

function calculatePrivacyScore(metadata, privacyData) {
  let score = 100;

  if (!metadata.privacyPolicyUrl) score -= 30;
  if (privacyData.dataCollected && privacyData.dataCollected.length > 0) score -= 20;
  if (privacyData.dataShared && privacyData.dataShared.length > 0) score -= 25;

  const dataHungryDevelopers = ['meta','facebook','instagram','whatsapp','google','alphabet','tiktok','bytedance','amazon','microsoft','twitter','snap'];
  const developerLower = metadata.developer?.toLowerCase() || '';
  if (dataHungryDevelopers.some(dev => developerLower.includes(dev))) score -= 15;

  const highRiskCategories = ['social','communication','entertainment','dating'];
  const categoryLower = metadata.category?.toLowerCase() || '';
  if (highRiskCategories.some(cat => categoryLower.includes(cat))) score -= 10;

  if (privacyData.securityPractices) {
    const p = privacyData.securityPractices;
    if (p.encryptedInTransit && p.secureConnection) score += 10;
    if (p.userDataDeletionRequest && p.developerDataDeletionMechanism) score += 5;
  }

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

  // store page text (fallback if privacy policy fetch blocked)
  const pageText = $('body').text().replace(/\s+/g, ' ').trim();

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
      storeText: pageText,
      storeUrl: url
    };
  } catch (error) {
    console.error('Scraping failed for', appId, ':', error.message);
    return null;
  }
}

// ---------- scrape privacy policy (enhanced for privacy score) ----------
async function scrapePrivacyPolicy(url, fallbackPageText = null, developerWebsite = null) {
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

    // If Azure OpenAI is configured, call the LLM to enhance extraction (cached)
    try {
      if (isAzureConfigured() && url) {
        const cacheKey = `llm:${url}`;
        let llmResult = cache.get(cacheKey);
        if (!llmResult) {
          llmResult = await analyzePolicyTextWithLLM(text);
          if (llmResult) {
            // Cache LLM result for 24 hours
            cache.set(cacheKey, llmResult, 24 * 3600);
          }
        }

        if (llmResult) {
          // Merge/override heuristics with LLM outputs when present
          if (Array.isArray(llmResult.dataCollected) && llmResult.dataCollected.length) {
            // normalize into objects like heuristics use
            const normalized = llmResult.dataCollected.map(d => ({ type: d, purpose: 'policy (LLM)' }));
            // prefer LLM result but keep heuristics if nothing
            dataCollected.length = 0;
            dataCollected.push(...normalized);
          }
          if (Array.isArray(llmResult.dataShared) && llmResult.dataShared.length) {
            const normalized = llmResult.dataShared.map(d => ({ type: d, purpose: 'policy (LLM)' }));
            dataShared.length = 0;
            dataShared.push(...normalized);
          }
          if (llmResult.securityPractices && typeof llmResult.securityPractices === 'object') {
            // overlay booleans
            Object.assign(securityPractices, llmResult.securityPractices);
          }
          // attach and normalize summary if present
          if (llmResult.summary) {
            try {
              // If LLM returned an array already, use it and trim each entry
              if (Array.isArray(llmResult.summary)) {
                const arr = llmResult.summary.map(s => ('' + s).trim()).filter(Boolean).slice(0, 4);
                // If fewer than 4 items, pad by repeating last item (keeps UI stable)
                while (arr.length < 4) arr.push(arr[arr.length - 1] || '');
                securityPractices.__llmSummary = arr;
              } else if (typeof llmResult.summary === 'string') {
                // Try to parse JSON in case the model returned a JSON string
                let parsed = null;
                try { parsed = JSON.parse(llmResult.summary); } catch (e) { parsed = null; }
                if (Array.isArray(parsed)) {
                  const arr = parsed.map(s => ('' + s).trim()).filter(Boolean).slice(0, 4);
                  while (arr.length < 4) arr.push(arr[arr.length - 1] || '');
                  securityPractices.__llmSummary = arr;
                } else {
                  // Fallback: split by newlines or sentences then build 4 items
                  let lines = llmResult.summary.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
                  if (lines.length === 0) {
                    lines = llmResult.summary.split(/(?<=\.|\?|!)\s+/).map(s => s.trim()).filter(Boolean);
                  }
                  // If too many short items, join into 4 buckets
                  if (lines.length >= 4) {
                    securityPractices.__llmSummary = lines.slice(0,4);
                  } else {
                    // Attempt to split longer text into 4 roughly-equal parts by sentence boundaries
                    const sentences = llmResult.summary.replace(/\s+/g,' ').trim().split(/(?<=\.|\?|!)\s+/).map(s=>s.trim()).filter(Boolean);
                    const buckets = [[],[],[],[]];
                    for (let i=0;i<sentences.length;i++) {
                      buckets[i % 4].push(sentences[i]);
                    }
                    const arr = buckets.map(b => b.join(' ').trim()).map(s => s || '');
                    while (arr.length < 4) arr.push('');
                    securityPractices.__llmSummary = arr.slice(0,4);
                  }
                }
              }
            } catch (e) {
              // As a last resort, store the raw string as a single item and pad
              const raw = ('' + llmResult.summary).trim();
              const arr = [raw].slice(0,1);
              while (arr.length < 4) arr.push('');
              securityPractices.__llmSummary = arr;
            }
          }
        }
      }
    } catch (e) {
      console.error('LLM enhancement failed:', e.message || e);
    }

    return { 
      text: text ? text.slice(0, 3000) : null, 
      dataShared, 
      dataCollected,
      securityPractices 
    };
  } catch (err) {
    console.error('Privacy scraping failed:', err.message);

    // Fallback strategy when direct privacy policy fetch is blocked (403) or fails:
    // 1) Try the developer website if provided
    // 2) Use the Play Store page text (fallbackPageText) and ask the LLM to extract privacy details
    try {
      // Try developer website first
      if (developerWebsite) {
        try {
          const { data: devData } = await axios.get(developerWebsite, {
            timeout: 12000,
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept-Language': 'en-US,en;q=0.9'
            }
          });
          const $dev = cheerio.load(devData);
          const devText = $dev('body').text().replace(/\s+/g, ' ').trim();
          const llm = await analyzePolicyTextWithLLM(devText);
          if (llm) {
            return {
              text: devText ? devText.slice(0, 3000) : null,
              dataShared: Array.isArray(llm.dataShared) ? llm.dataShared.map(d => ({ type: d, purpose: 'policy (LLM)' })) : [],
              dataCollected: Array.isArray(llm.dataCollected) ? llm.dataCollected.map(d => ({ type: d, purpose: 'policy (LLM)' })) : [],
              securityPractices: Object.assign({
                encryptedInTransit: false,
                secureConnection: false,
                userDataDeletionRequest: false,
                developerDataDeletionMechanism: false
              }, llm.securityPractices || {}, llm.summary ? { __llmSummary: llm.summary } : {})
            };
          }
        } catch (e) {
          console.error('Developer site fallback failed:', e.message || e);
        }
      }

      // Next, try Play Store page text (if provided)
      if (fallbackPageText) {
        const llm2 = await analyzePolicyTextWithLLM(fallbackPageText);
        if (llm2) {
          return {
            text: fallbackPageText ? fallbackPageText.slice(0, 3000) : null,
            dataShared: Array.isArray(llm2.dataShared) ? llm2.dataShared.map(d => ({ type: d, purpose: 'policy (LLM:store)' })) : [],
            dataCollected: Array.isArray(llm2.dataCollected) ? llm2.dataCollected.map(d => ({ type: d, purpose: 'policy (LLM:store)' })) : [],
            securityPractices: Object.assign({
              encryptedInTransit: false,
              secureConnection: false,
              userDataDeletionRequest: false,
              developerDataDeletionMechanism: false
            }, llm2.securityPractices || {}, llm2.summary ? { __llmSummary: llm2.summary } : {})
          };
        }
      }
    } catch (fallbackErr) {
      console.error('Fallback privacy extraction failed:', fallbackErr.message || fallbackErr);
    }

    // Final fallback: return empty/default structure with an error flag
    return { 
      text: null, 
      dataShared: [], 
      dataCollected: [],
      securityPractices: {
        encryptedInTransit: false,
        secureConnection: false,
        userDataDeletionRequest: false,
        developerDataDeletionMechanism: false,
        __error: err && err.message ? err.message : 'fetch_failed'
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

  const privacyData = await scrapePrivacyPolicy(metadata.privacyPolicyUrl, metadata.storeText, metadata.developerWebsite);
  
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