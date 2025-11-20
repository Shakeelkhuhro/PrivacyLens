import Constants from 'expo-constants';

function getDefaultBackend() {
  try {
    // 1) Explicit override via env or expo extra
    if (typeof process !== 'undefined' && process.env && process.env.BACKEND_URL) {
      return process.env.BACKEND_URL;
    }

    // Expo: allow setting BACKEND_URL via app config `extra` (app.json / app.config.js)
    const manifest = (Constants && (Constants.manifest || Constants.manifest2)) || null;
    const expoConfig = Constants && (Constants.expoConfig || null);
    const extraBackendFromManifest = manifest && manifest.extra && manifest.extra.BACKEND_URL;
    const extraBackendFromExpoConfig = expoConfig && expoConfig.extra && expoConfig.extra.BACKEND_URL;
    if (extraBackendFromManifest && typeof extraBackendFromManifest === 'string') {
      return extraBackendFromManifest;
    }
    if (extraBackendFromExpoConfig && typeof extraBackendFromExpoConfig === 'string') {
      return extraBackendFromExpoConfig;
    }

    // 2) Web (browser) — use same host as page
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const host = window.location.hostname;
      return `http://${host}:4002`;
    }

    // 3) Expo (development) — read host from various manifest fields supplied by the dev server
    // Examples: manifest.debuggerHost = '192.168.0.10:19000' or expoConfig.extra.debuggerHost
    const candidates = [];
    if (manifest) {
      candidates.push(manifest.debuggerHost, manifest.hostUri);
    }
    if (expoConfig) {
      candidates.push(expoConfig.extra && expoConfig.extra.debuggerHost, expoConfig.hostUri);
    }
    // Some SDKs expose manifest2 or other shapes — include any string-looking values
    const found = candidates.find(c => c && typeof c === 'string');
    if (found) {
      const ip = found.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return `http://${ip}:4002`;
      }
    }

    // 4) Android emulator (classic AVD) uses 10.0.2.2 to reach host machine
    if (Constants && Constants.platform && Constants.platform.android) {
      return 'http://10.0.2.2:4002';
    }
  } catch (e) {
    // ignore and fall through to default below
  }

  // Default fallback — return localhost but log guidance for physical devices
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('[config] Using fallback backend URL http://localhost:4002.\n' +
      'If you are testing on a physical device, set BACKEND_URL in app.json (extra) or run expo with tunnel/host and ensure the backend is reachable from your phone.');
  }

  return 'http://localhost:4002';
}

export const API_BASE = getDefaultBackend();

export default { API_BASE };
