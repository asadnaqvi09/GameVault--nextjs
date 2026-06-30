import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from '../api/authApi';
import { setToken, clearToken } from '../api/authApi';
import { setAuthToken } from '../../lib/api/authRequest';

const syncSession = async (accessToken) => {
  setToken(accessToken);
  setAuthToken(accessToken);
  const me = await authAPI.getMeAPI();
  return { accessToken, user: me.user };
};

export const register = createAsyncThunk(
  'auth/register',
  async (body, { rejectWithValue }) => {
    try {
      const data = await authAPI.registerAPI(body);
      const session = await syncSession(data.accessToken);
      return { ...session, message: data.message };
    }
    catch (e) { return rejectWithValue(e.response ?? e.message); }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      const data = await authAPI.loginAPI(body);
      return await syncSession(data.accessToken);
    }
    catch (e) { return rejectWithValue(e.response ?? e.message); }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authAPI.refreshTokenAPI();
      return await syncSession(data.accessToken);
    }
    catch (e) { return rejectWithValue(e.response ?? e.message); }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (body, { rejectWithValue }) => {
    try { return await authAPI.resetPasswordAPI(body); }
    catch (e) { return rejectWithValue(e.response ?? e.message); }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try { return await authAPI.logoutAPI(); }
    catch (e) { return rejectWithValue(e.response ?? e.message); }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  isLoading:   false,
  errors:      null,
  message:     null,
};

const applySession = (state, payload) => {
  state.accessToken = payload.accessToken;
  state.user = payload.user;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (s) => { s.errors = null; },
    clearMessage: (s) => { s.message = null; },
    setAuthData: (s, a) => {
      s.accessToken = a.payload.accessToken;
      s.user = a.payload.user;
    },
  },
  extraReducers: (builder) => {
    const pending = (s) => { s.isLoading = true; s.errors = null; };
    const rejected = (s, a) => { s.isLoading = false; s.errors = a.payload; };
    builder
      .addCase(register.pending, pending)
      .addCase(register.rejected, rejected)
      .addCase(register.fulfilled, (s, a) => {
        s.isLoading = false;
        applySession(s, a.payload);
        s.message = a.payload.message;
      })
      .addCase(login.pending, pending)
      .addCase(login.rejected, rejected)
      .addCase(login.fulfilled, (s, a) => {
        s.isLoading = false;
        applySession(s, a.payload);
      })
      .addCase(refreshAccessToken.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (s, a) => {
        s.isLoading = false;
        applySession(s, a.payload);
      })
      .addCase(refreshAccessToken.rejected, (s) => {
        s.isLoading = false;
        s.accessToken = null;
        s.user = null;
        clearToken();
        setAuthToken(null);
      })
      .addCase(resetPassword.pending, pending)
      .addCase(resetPassword.rejected, rejected)
      .addCase(resetPassword.fulfilled, (s, a) => {
        s.isLoading = false;
        s.message = a.payload.message;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  }
});

export const { clearErrors, clearMessage, setAuthData } = authSlice.actions;
export default authSlice.reducer;
