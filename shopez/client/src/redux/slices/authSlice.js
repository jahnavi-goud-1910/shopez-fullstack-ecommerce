import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

const userFromStorage = localStorage.getItem('shopezUser')
  ? JSON.parse(localStorage.getItem('shopezUser'))
  : null;

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${API}/register`, userData);
    localStorage.setItem('shopezUser', JSON.stringify(data));
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const { data } = await axios.post(`${API}/login`, credentials);
    localStorage.setItem('shopezUser', JSON.stringify(data));
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: userFromStorage, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('shopezUser');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(registerUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loginUser.pending,      (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled,    (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected,     (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
