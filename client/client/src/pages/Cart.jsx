import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, selectCartCount, selectCartTotal, setQty } from '../store/cartSlice';
import ProductImage from '../components/ProductImage';
import { Empty } from '../components/ui';
import { money } from '../utils/config';

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="px-4 py-16">
        <Empty title="Your cart is empty" text="Add something you like and it will show up here." to="/products" cta="Start shopping" />
      </div>
    );

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <section className="panel p-6">
        <h1 className="border-b border-ink-900/10 pb-4 font-serif text-3xl">Shopping cart</h1>
        <ul className="divide-y divide-ink-900/10">
          {items.map((i) => (
            <li key={i.product} className="flex gap-4 py-5">
              <Link to={`/products/${i.product}`} className="w-24 shrink-0 sm:w-32">
                <ProductImage product={i} className="aspect-square w-full rounded-lg" />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <Link to={`/products/${i.product}`} className="font-semibold hover:underline">{i.name}</Link>
                  <p className="font-bold">{money(i.price * i.qty)}</p>
                </div>
                <p className="text-sm text-ink-500">{money(i.price)} each</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    Qty
                    <select
                      value={i.qty}
                      onChange={(e) => dispatch(setQty({ id: i.product, qty: Number(e.target.value) }))}
                      className="input !w-auto !py-1.5"
                    >
                      {Array.from({ length: Math.min(i.stock, 10) }, (_, n) => n + 1).map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <button onClick={() => dispatch(removeFromCart(i.product))} className="font-semibold text-sky-800 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="panel h-fit space-y-4 p-6 lg:sticky lg:top-32">
        <p className="text-sm text-emerald-700">Your order qualifies for free delivery.</p>
        <p className="text-lg">
          Subtotal ({count} {count === 1 ? 'item' : 'items'}): <span className="font-bold">{money(total)}</span>
        </p>
        <button onClick={() => navigate('/checkout')} className="btn-gold w-full">Proceed to checkout</button>
        <Link to="/products" className="block text-center text-sm font-semibold text-sky-800 hover:underline">Continue shopping</Link>
      </aside>
    </div>
  );
}
