import { authRequest } from '@/lib/api/authRequest';
import { buildQueryString } from '@/lib/api/request';

export async function fetchAdminReviews(params = {}) {
  return authRequest(`/reviews/admin/list${buildQueryString(params)}`);
}

export async function moderateReview(reviewId, isApproved) {
  return authRequest(`/reviews/${reviewId}`, {
    method: 'PATCH',
    body: { isApproved },
  });
}

export async function hardDeleteReview(reviewId) {
  return authRequest(`/reviews/${reviewId}/hard`, { method: 'DELETE' });
}
