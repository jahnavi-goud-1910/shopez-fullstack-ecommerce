import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/orders';

const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const createOrder = createAsyncThunk('orders/create', async (orderData, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const { data } = await axios.post(API, orderData, getConfig(user.token));
    return data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Order failed'); }
});

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const { data } = await axios.get(`${API}/myorders`, getConfig(user.token));
    return data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchAllOrders = createAsyncThunk('orders/allOrders', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const { data } = await axios.get(API, getConfig(user.token));
    return data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const { data } = await axios.put(`${API}/${id}/status`, { status }, getConfig(user.token));
    return data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], allOrders: [], createdOrder: null, loading: false, error: null, success: false },
  reducers: { resetOrderSuccess: (state) => { state.success = false; state.createdOrder = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,       (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled,     (state, action) => { state.loading = false; state.success = true; state.createdOrder = action.payload; })
      .addCase(createOrder.rejected,      (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending,     (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled,   (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected,    (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllOrders.pending,    (state) => { state.loading = true; })
      .addCase(fetchAllOrders.fulfilled,  (state, action) => { state.loading = false; state.allOrders = action.payload; })
      .addCase(updateOrderStatus.fulfilled,(state, action) => {
        const idx = state.allOrders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.allOrders[idx] = action.payload;
      });
  },
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
