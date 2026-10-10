import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api, { errMsg } from '../api/axios';
import { clearCart, selectCartTotal } from '../store/cartSlice';
import { ErrorBox } from '../components/ui';
import { money } from '../utils/config';

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: form,
      });
      dispatch(clearCart());
      navigate(`/orders/${data._id}`, { replace: true, state: { placed: true } });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ['address', 'Street address'],
    ['city', 'City'],
    ['postalCode', 'Postal code'],
    ['country', 'Country'],
  ];

  return (
    <form onSubmit={placeOrder} className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="panel p-6">
          <h1 className="font-serif text-3xl">Checkout</h1>
          <h2 className="mt-6 font-bold">Delivery address</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {fields.map(([k, label]) => (
              <label key={k} className={k === 'address' ? 'sm:col-span-2' : ''}>
                <span className="label">{label}</span>
                <input required value={form[k]} onChange={set(k)} className="input" />
              </label>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="font-bold">Payment</h2>
          <p className="mt-2 text-sm text-ink-500">
            Online payment isn't connected in this version. Your order is saved as pending and you pay on delivery.
          </p>
        </section>

        <section className="panel p-6">
          <h2 className="font-bold">Review items</h2>
          <ul className="mt-3 divide-y divide-ink-900/10 text-sm">
            {items.map((i) => (
              <li key={i.product} className="flex justify-between py-2">
                <span>{i.name} <span className="text-ink-500">x {i.qty}</span></span>
                <span className="font-semibold">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="panel h-fit space-y-3 p-6 lg:sticky lg:top-32">
        <div className="flex justify-between text-sm"><span>Items</span><span>{money(total)}</span></div>
        <div className="flex justify-between text-sm"><span>Delivery</span><span className="text-emerald-700">Free</span></div>
        <div className="flex justify-between border-t border-ink-900/10 pt-3 text-lg font-bold"><span>Order total</span><span>{money(total)}</span></div>
        <ErrorBox message={error} />
        <button disabled={loading} className="btn-gold w-full">{loading ? 'Placing order...' : 'Place order'}</button>
      </aside>
    </form>
  );
}
