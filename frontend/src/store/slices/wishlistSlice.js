import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const initialState = {
  items: getInitialWishlist(),
  selectedIds: []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);
      
      if (exists) {
        state.items = state.items.filter(item => item.id !== product.id);
        state.selectedIds = state.selectedIds.filter(id => id !== product.id);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeOne: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      state.selectedIds = state.selectedIds.filter(itemId => itemId !== id);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    toggleSelect: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(itemId => itemId !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelected: (state) => {
      state.items = state.items.filter(item => !state.selectedIds.includes(item.id));
      state.selectedIds = [];
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearAll: (state) => {
      state.items = [];
      state.selectedIds = [];
      localStorage.removeItem('wishlist');
    }
  }
});

export const { toggleWishlist, removeOne, toggleSelect, clearSelected, clearAll } = wishlistSlice.actions;
const wishlistReducer = wishlistSlice.reducer;
export default wishlistReducer;