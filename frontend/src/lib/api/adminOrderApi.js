import { authRequest } from '@/lib/api/authRequest';
import { buildQueryString } from '@/lib/api/request';

export async function fetchAdminOrders(params = {}) {
  return authRequest(`/orders/admin/list${buildQueryString(params)}`);
}

export async function fetchAdminOrderById(id) {
  return authRequest(`/orders/admin/${id}`);
}

export async function approveAdminOrder(id) {
  return authRequest(`/orders/admin/${id}/approve`, { method: 'PATCH' });
}

export async function rejectAdminOrder(id, reason) {
  return authRequest(`/orders/admin/${id}/reject`, {
    method: 'PATCH',
    body: { reason },
  });
}

export async function confirmCodAdminOrder(id) {
  return authRequest(`/orders/admin/${id}/confirm-cod`, { method: 'PATCH' });
}

export async function fulfillAdminOrder(id, body) {
  return authRequest(`/orders/admin/${id}/fulfill`, {
    method: 'PATCH',
    body,
  });
}

export async function cancelAdminOrder(id) {
  return authRequest(`/orders/admin/${id}/cancel`, { method: 'PATCH' });
}
