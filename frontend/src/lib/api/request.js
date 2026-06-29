import { API_BASE } from './config';

export async function apiRequest(path, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(opts.auth && opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...opts,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = res.status !== 204 ? await res.json() : {};
  if (!res.ok) {
    const err = new Error(data.message ?? 'Request failed');
    err.response = { ...data, status: res.status };
    throw err;
  }
  return data;
}

export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
