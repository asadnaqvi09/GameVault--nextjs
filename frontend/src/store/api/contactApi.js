import { apiRequest } from '@/lib/api/request';

export async function submitContact(body) {
  return apiRequest('/contact', { method: 'POST', body });
}
