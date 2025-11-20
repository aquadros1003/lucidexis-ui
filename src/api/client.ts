import { API_V1 } from '../config';

export type ApiRequestInit = RequestInit & { skipBase?: boolean };

export const getAuthToken = (): string | null => {
  const tokenRaw = localStorage.getItem('access_token');
  if (!tokenRaw) return null;
  try {
    return JSON.parse(tokenRaw);
  } catch {
    return tokenRaw;
  }
};

export const fetchWithHeaders = async (path: string, init: ApiRequestInit = {}) => {
  const url = path.startsWith('http') ? path : `${API_V1}${path.startsWith('/') ? '' : '/'}${path}`;

  const token = getAuthToken();

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  if (init.body && !(init.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...(init.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, { ...init, headers: mergedHeaders });

  if (!response.ok) {
    const errorText = await response.text();
    let errorPayload;
    try {
      errorPayload = errorText ? JSON.parse(errorText) : { detail: `Request failed with status ${response.status}` };
    } catch {
      errorPayload = {
        detail: errorText || `Request failed with status ${response.status}`,
      };
    }
    throw new Error(errorPayload.detail || 'API request failed');
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const text = await response.text();
    if (!text || text.trim() === '') return undefined;
    return JSON.parse(text);
  }

  return response.text();
};
