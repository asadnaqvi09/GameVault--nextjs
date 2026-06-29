import { API_BASE } from './config';
import { setToken, clearToken, refreshTokenAPI } from '@/store/api/authApi';

let _token = null;

export const setAuthToken = (token) => {
  _token = token;
  if (token) {
    setToken(token);
  } else {
    clearToken();
  }
};

async function fetchWithToken(path, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.auth && _token ? { Authorization: `Bearer ${_token}` } : {}),
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

export async function authRequest(path, opts = {}) {
  try {
    return await fetchWithToken(path, { ...opts, auth: true });
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const refreshed = await refreshTokenAPI();
        setAuthToken(refreshed.accessToken);
        return fetchWithToken(path, { ...opts, auth: true });
      } catch (refreshError) {
        clearToken();
        _token = null;
        throw refreshError;
      }
    }
    throw error;
  }
}
