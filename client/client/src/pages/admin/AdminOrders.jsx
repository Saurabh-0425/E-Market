import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api/axios';
import { ErrorBox, Spinner } from '../../components/ui';
import { ORDER_STATUSES, dateStr, money } from '../../utils/config';
import AdminTabs from './AdminTabs';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => setOrders(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id, status) => {
    setError('');
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrders((list) => list.map((o) => (o._id === id ? { ...o, status: data.status } : o)));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminTabs />
      <ErrorBox message={error} />
      {loading ? (
        <Spinner />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-ink-500">
              <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {orders.length === 0 && (
                <tr><td colSpan="5" className="p-6 text-center text-ink-500">No orders yet.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="p-3"><Link to={`/orders/${o._id}`} className="font-mono text-xs text-sky-800 hover:underline">{o._id.slice(-8)}</Link></td>
                  <td className="p-3">{o.user?.name || 'Deleted user'}<span className="block text-xs text-ink-500">{o.user?.email}</span></td>
                  <td className="p-3">{dateStr(o.createdAt)}</td>
                  <td className="p-3 font-semibold">{money(o.totalPrice)}</td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => changeStatus(o._id, e.target.value)} aria-label="Order status" className="input !w-auto !py-1.5 capitalize">
                      {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
