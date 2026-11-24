import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type StatusState = {
  api: string;
  performance: string;
  loading: boolean;
};

const initialState: StatusState = {
  api: '—',
  performance: '—',
  loading: true,
};

export const fetchStatus = createAsyncThunk('status/fetch', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  return { api: 'OK', performance: '99.4%' };
});

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.api = action.payload.api;
        state.performance = action.payload.performance;
      })
      .addCase(fetchStatus.rejected, (state) => {
        state.loading = false;
        state.api = 'ERR';
        state.performance = '—';
      });
  },
});

export const statusReducer = statusSlice.reducer;
