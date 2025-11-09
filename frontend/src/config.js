
export const API_BASE = typeof process !== 'undefined' && process.env && process.env.BACKEND_URL
  ? process.env.BACKEND_URL
  : 'http://localhost:4002';



export default { API_BASE };
