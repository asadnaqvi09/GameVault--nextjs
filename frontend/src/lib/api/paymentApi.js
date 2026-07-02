import { apiUrl } from './config';
import { refreshTokenAPI } from '@/store/api/authApi';
import { setAuthToken } from './authRequest';

async function submitWithAuth(path, formData, token) {
  const url = apiUrl(path);
  console.log('[checkout]', 'POST', url);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('[checkout]', 'payment_failed', {
      status: res.status,
      message: data.message,
      error: data.error,
      debug: data.debug,
    });
    const err = new Error(data.message ?? 'Request failed');
    err.response = { ...data, status: res.status };
    throw err;
  }
  console.log('[checkout]', 'payment_success', {
    status: res.status,
    orderNumber: data.data?.orderNumber,
  });
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
