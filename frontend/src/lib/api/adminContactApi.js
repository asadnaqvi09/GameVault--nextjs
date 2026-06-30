import { authRequest } from '@/lib/api/authRequest';
import { buildQueryString } from '@/lib/api/request';

export async function fetchAdminContacts(params = {}) {
  return authRequest(`/contact/admin/list${buildQueryString(params)}`);
}

export async function updateContactStatus(id, status) {
  return authRequest(`/contact/admin/${id}`, {
    method: 'PATCH',
    body: { status },
  });
}
