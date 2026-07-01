import { authRequest } from '@/lib/api/authRequest';
import { buildQueryString } from '@/lib/api/request';
import { apiUrl } from './config';
import { refreshTokenAPI } from '@/store/api/authApi';
import { setAuthToken } from './authRequest';

export async function fetchAdminGames(params = {}) {
  return authRequest(`/games/admin/list${buildQueryString(params)}`);
}

export async function fetchAdminGame(slug) {
  return authRequest(`/games/admin/${slug}`);
}

export async function createGame(body) {
  return authRequest('/games', { method: 'POST', body });
}

export async function updateGame(slug, body) {
  return authRequest(`/games/${slug}`, { method: 'PUT', body });
}

export async function patchGame(slug, body) {
  return authRequest(`/games/${slug}`, { method: 'PATCH', body });
}

export async function deleteGame(slug) {
  return authRequest(`/games/${slug}`, { method: 'DELETE' });
}

async function postForm(path, formData, token) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message ?? 'Request failed');
    err.response = { ...data, status: res.status };
    throw err;
  }
  return data;
}

export async function uploadGameImage(file, slug, token) {
  const formData = new FormData();
  formData.append('image', file);
  if (slug) formData.append('slug', slug);
  try {
    return await postForm('/games/admin/upload-image', formData, token);
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshed = await refreshTokenAPI();
      setAuthToken(refreshed.accessToken);
      return postForm('/games/admin/upload-image', formData, refreshed.accessToken);
    }
    throw error;
  }
}
