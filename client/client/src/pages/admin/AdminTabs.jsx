import { NavLink } from 'react-router-dom';

export default function AdminTabs() {
  const cls = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-ink-900 text-white' : 'bg-white text-ink-900 hover:bg-ink-900/5'}`;
  return (
    <div className="mb-6 flex items-center gap-2">
      <h1 className="mr-4 font-serif text-3xl">Admin</h1>
      <NavLink to="/admin/products" className={cls}>Products</NavLink>
      <NavLink to="/admin/orders" className={cls}>Orders</NavLink>
    </div>
  );
}
