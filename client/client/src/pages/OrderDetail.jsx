import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import { Empty, Spinner, StatusBadge } from '../components/ui';
import { dateStr, money } from '../utils/config';

export default function OrderDetail() {
  const { id } = useParams();
  const placed = useLocation().state?.placed;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order)
    return (
      <div className="px-4 py-16">
        <Empty title="Order not found" text={error} to="/orders" cta="Back to orders" />
      </div>
    );

  const a = order.shippingAddress;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {placed && (
        <div role="status" className="mb-6 rounded-xl bg-emerald-50 p-5 text-emerald-900">
          <p className="font-serif text-2xl">Order placed</p>
          <p className="mt-1 text-sm">Thanks for your order. We've saved it and will update the status as it moves.</p>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl">Order details</h1>
        <StatusBadge status={order.status} />
      </div>
      <div className="panel divide-y divide-ink-900/10">
        <div className="grid gap-4 p-5 text-sm sm:grid-cols-3">
          <div><p className="text-ink-500">Order number</p><p className="break-all font-semibold">{order._id}</p></div>
          <div><p className="text-ink-500">Placed on</p><p className="font-semibold">{dateStr(order.createdAt)}</p></div>
          <div><p className="text-ink-500">Deliver to</p><p className="font-semibold">{a.address}, {a.city} {a.postalCode}, {a.country}</p></div>
        </div>
        <ul className="divide-y divide-ink-900/10 px-5 text-sm">
          {order.items.map((i) => (
            <li key={i.product} className="flex justify-between py-3">
              <Link to={`/products/${i.product}`} className="hover:underline">{i.name} <span className="text-ink-500">x {i.qty}</span></Link>
              <span className="font-semibold">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between p-5 text-lg font-bold"><span>Total</span><span>{money(order.totalPrice)}</span></div>
      </div>
      <Link to="/orders" className="mt-5 inline-block text-sm font-semibold text-sky-800 hover:underline">Back to all orders</Link>
    </div>
  );
}
