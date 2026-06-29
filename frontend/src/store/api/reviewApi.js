import { apiRequest, buildQueryString } from '@/lib/api/request';
import { authRequest } from '@/lib/api/authRequest';

export async function getGameReviews(slug, params = {}) {
  return apiRequest(`/reviews/game/${slug}${buildQueryString(params)}`);
}

export async function createReview(slug, body) {
  return authRequest(`/reviews/game/${slug}`, { method: 'POST', body });
}

export async function updateReview(reviewId, body) {
  return authRequest(`/reviews/${reviewId}`, { method: 'PUT', body });
}

export async function deleteReview(reviewId) {
  return authRequest(`/reviews/${reviewId}`, { method: 'DELETE' });
}
