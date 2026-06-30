import { API_BASE } from './config';
import { refreshTokenAPI } from '@/store/api/authApi';
import { setAuthToken } from './authRequest';

async function submitWithAuth(path, formData, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message ?? 'Request failed');
    err.response = { ...data, status: res.status };
    throw err;
  }
  return data;
}

export async function submitManualPayment(formData, token) {
  try {
    return await submitWithAuth('/payments/manual/submit', formData, token);
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshed = await refreshTokenAPI();
      setAuthToken(refreshed.accessToken);
      return submitWithAuth('/payments/manual/submit', formData, refreshed.accessToken);
    }
    throw error;
  }
}
