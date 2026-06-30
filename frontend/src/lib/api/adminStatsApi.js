import { authRequest } from '@/lib/api/authRequest';

export async function fetchDashboardStats() {
  return authRequest('/admin/dashboard/stats');
}
