import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg } from '../api/axios';

const stored = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const makeThunk = (name, url) =>
  createAsyncThunk(`auth/${name}`, async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post(url, body);
      return data;
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  });

export const login = makeThunk('login', '/auth/login');
export const register = makeThunk('register', '/auth/register');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: stored(), loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    [login, register].forEach((thunk) =>
      builder
        .addCase(thunk.pending, (s) => {
          s.loading = true;
          s.error = null;
        })
        .addCase(thunk.fulfilled, (s, { payload }) => {
          s.loading = false;
          s.user = payload;
          localStorage.setItem('user', JSON.stringify(payload));
        })
        .addCase(thunk.rejected, (s, { payload }) => {
          s.loading = false;
          s.error = payload;
        })
    );
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
