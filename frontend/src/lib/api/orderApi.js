import { authRequest } from '@/lib/api/authRequest';
import { buildQueryString } from '@/lib/api/request';

export async function placeCodOrder(body) {
  return authRequest('/orders/cod', { method: 'POST', body });
}

export async function fetchMyOrders(params = {}) {
  return authRequest(`/orders${buildQueryString(params)}`);
}

export async function fetchMyOrderById(id) {
  return authRequest(`/orders/${id}`);
}

export async function cancelMyOrder(id) {
  return authRequest(`/orders/${id}/cancel`, { method: 'PATCH' });
}
