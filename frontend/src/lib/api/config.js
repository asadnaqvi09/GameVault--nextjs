const DEFAULT_API_ORIGIN = 'http://localhost:5000';

function normalizeOrigin(value) {
  return value.trim().replace(/\/+$/, '');
}

/**
 * Accepts either the server origin (https://api.example.com) or a full API base
 * that already ends with /api/v1. Always returns .../api/v1 with no trailing slash.
 */
export function resolveApiBase(url = process.env.NEXT_PUBLIC_API_URL) {
  const raw = normalizeOrigin(url || DEFAULT_API_ORIGIN);
  if (raw.endsWith('/api/v1')) return raw;
  return `${raw}/api/v1`;
}

export const API_BASE = resolveApiBase();

export function apiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
