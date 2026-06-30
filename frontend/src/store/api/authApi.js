import { API_BASE } from '@/lib/api/config';

const BASE = `${API_BASE}/auth`;

let _token = null;
export const setToken  = (t) => { _token = t; };
export const clearToken = () => { _token = null; };

async function req(path, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.auth && _token ? { Authorization: `Bearer ${_token}` } : {}),
  };
  const res = await fetch(`${BASE}${path}`, {
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

export async function authReq(path, opts = {}) {
  try {
    return await req(path, { ...opts, auth: true });
  } catch (e) {
    if (e.response?.status === 401 && path !== '/refresh-token') {
      try {
        const r = await refreshTokenAPI();
        setToken(r.accessToken);
        return req(path, { ...opts, auth: true });
      } catch (refreshErr) {
        clearToken();
        throw refreshErr;
      }
    }
    throw e;
  }
}

export const registerAPI     = (b) => req('/register',       { method: 'POST', body: b });
export const loginAPI         = (b) => req('/login',          { method: 'POST', body: b });
export const refreshTokenAPI  = ()  => req('/refresh-token',  { method: 'POST' });
export const resetPasswordAPI = (b) => req('/reset-password', { method: 'POST', body: b });
export const logoutAPI        = ()  => req('/logout',         { method: 'POST', auth: true });
export const getMeAPI         = ()  => req('/me',             { auth: true });
