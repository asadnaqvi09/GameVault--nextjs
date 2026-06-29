'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login, register, logout,
  resetPassword, refreshAccessToken,
  clearErrors, clearMessage,
} from '../store/slices/authSlice';
import { setToken, clearToken } from '../store/api/authApi';
import { setAuthToken } from '../lib/api/authRequest';

export function useAuth() {
  const dispatch = useDispatch();
  const { user,accessToken, isLoading, errors, message } = useSelector((s) => s.auth);
  useEffect(() => {
    if (accessToken) {
      setToken(accessToken);
      setAuthToken(accessToken);
    } else {
      clearToken();
      setAuthToken(null);
    }
  }, [accessToken]);
  useEffect(() => {
    const wasExplicitLogout = sessionStorage.getItem('explicit_logout');
    if (!accessToken && !wasExplicitLogout) {
      dispatch(refreshAccessToken()).unwrap().catch(() => { });
    }
  }, []);

  return {
    isAuthenticated: !!accessToken,
    user,
    role: user?.role || null,
    isLoading,
    errors,
    message,
    register: (d) => dispatch(register(d)),
    login: (d) => dispatch(login(d)),
    logout: () => {
      sessionStorage.setItem('explicit_logout', 'true');
      return dispatch(logout());
    },
    resetPassword: (d) => dispatch(resetPassword(d)),
    clearErrors: () => dispatch(clearErrors()),
    clearMessage: () => dispatch(clearMessage()),
  };
}