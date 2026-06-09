import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/products';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (search = '', thunkAPI) => {
  try {
    const { data } = await axios.get(`${API}?search=${search}`);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, thunkAPI) => {
  try {
    const { data } = await axios.get(`${API}/${id}`);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Product not found');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], selectedProduct: null, loading: false, error: null },
  reducers: {
    clearSelectedProduct: (state) => { state.selectedProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,      (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled,    (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected,     (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProductById.pending,   (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductById.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
