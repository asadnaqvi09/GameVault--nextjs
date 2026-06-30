import { authRequest } from '@/lib/api/authRequest';

export async function fetchCart() {
  return authRequest('/cart');
}

export async function addCartItem(body) {
  return authRequest('/cart/items', { method: 'POST', body });
}

export async function updateCartItem(itemId, body) {
  return authRequest(`/cart/items/${itemId}`, { method: 'PATCH', body });
}

export async function removeCartItem(itemId) {
  return authRequest(`/cart/items/${itemId}`, { method: 'DELETE' });
}

export async function clearCartApi() {
  return authRequest('/cart', { method: 'DELETE' });
}
