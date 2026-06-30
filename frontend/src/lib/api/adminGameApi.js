import { authRequest } from '@/lib/api/authRequest';
import { buildQueryString } from '@/lib/api/request';

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
