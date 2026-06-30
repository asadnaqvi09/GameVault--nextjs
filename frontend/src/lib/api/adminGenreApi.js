import { authRequest } from '@/lib/api/authRequest';
import { apiRequest } from '@/lib/api/request';

export async function fetchGenres() {
  return apiRequest('/genre/get-all-genre');
}

export async function createGenre(body) {
  return authRequest('/genre/add-genre', { method: 'POST', body });
}

export async function updateGenre(id, body) {
  return authRequest(`/genre/update-genre/${id}`, { method: 'PUT', body });
}

export async function deleteGenre(id) {
  return authRequest(`/genre/delete-genre/${id}`, { method: 'DELETE' });
}
