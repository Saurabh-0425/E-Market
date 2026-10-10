import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';
import { CATEGORIES, STORE_NAME } from '../utils/config';

export default function Navbar() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const count = useSelector(selectCartCount);

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('search', q.trim());
    if (cat) p.set('category', cat);
    navigate(`/products?${p}`);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
            {STORE_NAME}
            <span className="text-gold-400">.</span>
          </Link>

          <form onSubmit={submit} className="order-last flex w-full flex-1 overflow-hidden rounded-lg bg-white md:order-none md:w-auto" role="search">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              aria-label="Search category"
              className="hidden border-r border-ink-900/10 bg-mist px-3 text-sm text-ink-900 outline-none sm:block"
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="min-w-0 flex-1 px-4 py-2.5 text-sm text-ink-900 outline-none"
            />
            <button className="bg-gold-400 px-4 text-ink-900 hover:bg-gold-500" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </form>

          <div className="ml-auto flex items-center gap-5 md:ml-0">
            <div className="group relative">
              <Link to={user ? '/orders' : '/login'} className="block text-xs leading-tight text-ink-300">
                Hello, {user ? user.name.split(' ')[0] : 'sign in'}
                <span className="block text-sm font-semibold text-white">Account</span>
              </Link>
              {user && (
                <div className="invisible absolute right-0 top-full z-50 w-48 pt-2 group-focus-within:visible group-hover:visible">
                  <div className="rounded-lg bg-white p-2 text-sm text-ink-900 shadow-xl">
                    <Link className="block rounded px-3 py-2 hover:bg-mist" to="/orders">Your orders</Link>
                    {user.role === 'admin' && (
                      <Link className="block rounded px-3 py-2 hover:bg-mist" to="/admin/products">Admin panel</Link>
                    )}
                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate('/');
                      }}
                      className="block w-full rounded px-3 py-2 text-left hover:bg-mist"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/orders" className="hidden text-xs leading-tight text-ink-300 sm:block">
              Returns
              <span className="block text-sm font-semibold text-white">& Orders</span>
            </Link>

            <Link to="/cart" className="relative flex items-center gap-2" aria-label={`Cart, ${count} items`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" />
                <circle cx="9.5" cy="20" r="1.2" />
                <circle cx="17" cy="20" r="1.2" />
              </svg>
              <span className="absolute -top-1.5 left-4 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-xs font-bold text-ink-900">
                {count}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-ink-800 text-sm text-white" aria-label="Categories">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          <Link to="/products" className="whitespace-nowrap px-3 py-2 font-semibold hover:bg-white/10">All products</Link>
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/products?category=${c}`} className="whitespace-nowrap px-3 py-2 text-ink-300 hover:bg-white/10 hover:text-white">
              {c}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin/products" className="ml-auto whitespace-nowrap px-3 py-2 font-semibold text-gold-400 hover:bg-white/10">
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
