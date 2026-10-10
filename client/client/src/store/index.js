import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import cart from './cartSlice';

const store = configureStore({ reducer: { auth, cart } });

// Keep the cart across page reloads
store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart.items));
});

export default store;
