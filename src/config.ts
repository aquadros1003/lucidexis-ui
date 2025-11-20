export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost').replace(/\/$/, '');

export const API_V1 = `${API_BASE}/api/v1`;