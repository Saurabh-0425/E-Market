export const STORE_NAME = 'E Market';
export const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];
export const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: import.meta.env.VITE_CURRENCY || 'INR',
});
export const money = (n) => fmt.format(Number(n) || 0);
export const dateStr = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
