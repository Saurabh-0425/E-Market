import { Link } from 'react-router-dom';
import { CATEGORIES, STORE_NAME } from '../utils/config';

export default function Footer() {
  return (
    <footer className="mt-16 text-sm text-ink-300">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-ink-700 py-3 font-semibold text-white hover:bg-ink-500"
      >
        Back to top
      </button>
      <div className="bg-ink-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-2xl text-white">{STORE_NAME}<span className="text-gold-400">.</span></p>
            <p className="mt-3 max-w-xs">Everyday goods across electronics, fashion and home, with clear prices and simple checkout.</p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Shop</p>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c}><Link className="hover:text-white" to={`/products?category=${c}`}>{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">Your account</p>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" to="/orders">Orders</Link></li>
              <li><Link className="hover:text-white" to="/cart">Cart</Link></li>
              <li><Link className="hover:text-white" to="/login">Sign in</Link></li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} {STORE_NAME}. Student project.</p>
      </div>
    </footer>
  );
}
