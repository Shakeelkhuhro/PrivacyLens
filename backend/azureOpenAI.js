const axios = require('axios');

const endpointRaw = process.env.AZURE_OPENAI_ENDPOINT || '';
const endpoint = endpointRaw.replace(/\/$/, '');
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || '';
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2023-10-01-preview';
const apiKey = process.env.AZURE_OPENAI_KEY || '';

function isConfigured() {
  return !!(endpoint && deployment && apiKey);
}

async function callChat(messages = [], temperature = 0.2, maxTokens = 800) {
  if (!isConfigured()) {
    throw new Error('Azure OpenAI not configured (missing endpoint/deployment/key)');
  }

  const url = `${endpoint}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${apiVersion}`;

  const payload = {
    messages,
    temperature,
    max_tokens: maxTokens
  };

  const resp = await axios.post(url, payload, {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  return resp.data;
}

// Analyze policy text via Azure OpenAI and return parsed JSON (dataCollected, dataShared, securityPractices).
// Returns null when Azure isn't configured or on failure.
async function analyzePolicyTextWithLLM(text) {
  if (!isConfigured() || !text) return null;

  const safeText = text.slice(0, 25000); // trim to reasonable size

  const system = `You are a privacy policy analyzer. Extract what user data the policy says is collected and whether the policy mentions third-party sharing, partners, analytics, and security/deletion practices. Respond with STRICT JSON ONLY, with the following keys:
  - dataCollected: array of short strings (e.g. ["email", "location"]).
  - dataShared: array of short strings (e.g. ["ads partners"]).
  - securityPractices: object with boolean keys: encryptedInTransit, secureConnection, userDataDeletionRequest, developerDataDeletionMechanism.
  - summary: an ARRAY of EXACTLY 4 short strings. Each array element should be one concise bullet-point style privacy highlight (1–2 short lines each). Example:
    {
      "summary": [
        "Collects email and phone for account creation.",
        "Shares data with advertising partners for personalization.",
        "Uses encrypted transit and secure connections.",
        "Provides account data deletion requests via privacy portal."
      ]
    }
  Return only valid JSON and nothing else. Do not add any explanatory text or wrapper.
`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: `Privacy policy text:\n\n${safeText}` }
  ];

  try {
    const resp = await callChat(messages, 0.0, 800);
    const content = resp?.choices?.[0]?.message?.content || resp?.choices?.[0]?.text || '';

    // Try to parse JSON directly
    try {
      return JSON.parse(content);
    } catch (e) {
      // Attempt to find a JSON block inside the response
      const m = content.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]);
        } catch (e2) {
          return { raw: content };
        }
      }
      return { raw: content };
    }
  } catch (err) {
    console.error('Azure OpenAI call failed:', err.message || err);
    return null;
  }
}

module.exports = { analyzePolicyTextWithLLM, isConfigured };
