// Central API config — change API_BASE when your backend port or host changes
export const API_BASE = typeof process !== 'undefined' && process.env && process.env.BACKEND_URL
  ? process.env.BACKEND_URL
  : 'http://localhost:4002';

// For environments that don't set process.env (Expo web), you can set global.__BACKEND_URL
// e.g. in a dev shell: $env:BACKEND_URL='http://localhost:4002'
export default { API_BASE };
