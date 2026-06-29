import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as gameAPI from '../api/gameApi';

export const fetchTopSellers = createAsyncThunk(
  'games/fetchTopSellers',
  async (limit, { rejectWithValue }) => {
    try {
      return await gameAPI.getTopSellers(limit);
    } catch (error) {
      return rejectWithValue(error.response ?? error.message);
    }
  }
);

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (params, { rejectWithValue }) => {
    try {
      return await gameAPI.getGames(params);
    } catch (error) {
      return rejectWithValue(error.response ?? error.message);
    }
  }
);

const initialState = {
  topSellers: [],
  catalogue: [],
  meta: null,
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearGameError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSellers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topSellers = action.payload.data || [];
      })
      .addCase(fetchTopSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.catalogue = action.payload.data || [];
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGameError } = gameSlice.actions;
export default gameSlice.reducer;
