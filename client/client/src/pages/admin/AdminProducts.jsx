import { useEffect, useState } from 'react';
import api, { errMsg } from '../../api/axios';
import { ErrorBox, Spinner } from '../../components/ui';
import { CATEGORIES, money } from '../../utils/config';
import AdminTabs from './AdminTabs';

const empty = { name: '', description: '', price: '', image: '', category: CATEGORIES[0], stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api
      .get('/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.products))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editId) await api.put(`/products/${editId}`, body);
      else await api.post('/products', body);
      setForm(empty);
      setEditId(null);
      await load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const edit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, image: p.image || '', category: p.category, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      setProducts((list) => list.filter((x) => x._id !== p._id));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminTabs />
      <ErrorBox message={error} />

      <form onSubmit={submit} className="panel mt-4 grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="font-bold sm:col-span-2 lg:col-span-4">{editId ? 'Edit product' : 'Add a product'}</h2>
        <label className="lg:col-span-2"><span className="label">Name</span><input required value={form.name} onChange={set('name')} className="input" /></label>
        <label>
          <span className="label">Category</span>
          <select value={form.category} onChange={set('category')} className="input">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label><span className="label">Image URL</span><input value={form.image} onChange={set('image')} placeholder="https://..." className="input" /></label>
        <label><span className="label">Price</span><input required type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className="input" /></label>
        <label><span className="label">Stock</span><input required type="number" min="0" step="1" value={form.stock} onChange={set('stock')} className="input" /></label>
        <label className="sm:col-span-2"><span className="label">Description</span><textarea required rows={2} value={form.description} onChange={set('description')} className="input" /></label>
        <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
          <button disabled={saving} className="btn-gold">{saving ? 'Saving...' : editId ? 'Save changes' : 'Add product'}</button>
          {editId && <button type="button" className="btn-outline" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      {loading ? (
        <Spinner />
      ) : (
        <div className="panel mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-ink-500">
              <tr><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3" /></tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{money(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="space-x-3 whitespace-nowrap p-3 text-right">
                    <button onClick={() => edit(p)} className="font-semibold text-sky-800 hover:underline">Edit</button>
                    <button onClick={() => remove(p)} className="font-semibold text-red-700 hover:underline">Delete</button>
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
