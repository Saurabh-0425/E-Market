import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import { Empty, ErrorBox, Spinner, StatusBadge } from '../components/ui';
import { dateStr, money } from '../utils/config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/mine')
      .then(({ data }) => setOrders(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl">Your orders</h1>
      <ErrorBox message={error} />
      {loading ? (
        <Spinner />
      ) : orders.length === 0 && !error ? (
        <Empty title="No orders yet" text="When you place an order it will appear here." to="/products" cta="Start shopping" />
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o._id} className="panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/10 bg-mist px-5 py-3 text-sm">
                <div className="flex gap-8">
                  <div><p className="text-ink-500">Placed</p><p className="font-semibold">{dateStr(o.createdAt)}</p></div>
                  <div><p className="text-ink-500">Total</p><p className="font-semibold">{money(o.totalPrice)}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status} />
                  <Link to={`/orders/${o._id}`} className="font-semibold text-sky-800 hover:underline">View order</Link>
                </div>
              </div>
              <ul className="px-5 py-3 text-sm">
                {o.items.map((i) => (
                  <li key={i.product} className="py-1">{i.name} <span className="text-ink-500">x {i.qty}</span></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
