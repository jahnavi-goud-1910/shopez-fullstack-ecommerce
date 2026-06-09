import { createSlice } from '@reduxjs/toolkit';
const save = (items) => localStorage.setItem('shopezCart', JSON.stringify(items));
const cartFromStorage = localStorage.getItem('shopezCart') ? JSON.parse(localStorage.getItem('shopezCart')) : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartItems: cartFromStorage },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cartItems.find(x => x._id === action.payload._id);
      if (existing) existing.qty += 1;
      else state.cartItems.push({ ...action.payload, qty: 1 });
      save(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload);
      save(state.cartItems);
    },
    increaseQty: (state, action) => {
      const item = state.cartItems.find(x => x._id === action.payload);
      if (item) item.qty += 1;
      save(state.cartItems);
    },
    decreaseQty: (state, action) => {
      const item = state.cartItems.find(x => x._id === action.payload);
      if (item) { item.qty -= 1; if (item.qty === 0) state.cartItems = state.cartItems.filter(x => x._id !== action.payload); }
      save(state.cartItems);
    },
    clearCart: (state) => { state.cartItems = []; localStorage.removeItem('shopezCart'); },
  },
});
export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
