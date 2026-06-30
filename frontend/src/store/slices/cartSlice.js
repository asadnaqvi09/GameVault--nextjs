import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  total: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const { items, itemCount, subtotal, total } = action.payload;
      state.items = items || [];
      state.itemCount = itemCount || 0;
      state.subtotal = subtotal || 0;
      state.total = total || 0;
      state.isLoading = false;
    },
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.total = 0;
      state.isLoading = false;
    },
  },
});

export const { setCart, setCartLoading, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
