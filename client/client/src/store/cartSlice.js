import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: load() },
  reducers: {
    addToCart(state, { payload: { product, qty = 1 } }) {
      const found = state.items.find((i) => i.product === product._id);
      if (found) {
        found.qty = Math.min(found.qty + qty, product.stock);
        found.stock = product.stock;
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          qty: Math.min(qty, product.stock),
        });
      }
    },
    setQty(state, { payload: { id, qty } }) {
      const item = state.items.find((i) => i.product === id);
      if (item) item.qty = Math.max(1, Math.min(qty, item.stock));
    },
    removeFromCart(state, { payload: id }) {
      state.items = state.items.filter((i) => i.product !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setQty, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartTotal = (s) => s.cart.items.reduce((n, i) => n + i.qty * i.price, 0);
export default cartSlice.reducer;
