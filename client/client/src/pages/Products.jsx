import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Empty, ErrorBox, Spinner } from '../components/ui';
import { CATEGORIES } from '../utils/config';

export default function Products() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ products: [], pages: 1, total: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const key = sp.toString();
  const category = sp.get('category') || '';
  const search = sp.get('search') || '';
  const sort = sp.get('sort') || '';
  const page = Number(sp.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    setError('');
    setMin(sp.get('minPrice') || '');
    setMax(sp.get('maxPrice') || '');
    api
      .get('/products', { params: Object.fromEntries(sp) })
      .then(({ data }) => setData(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setParam = (k, v) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    if (k !== 'page') n.delete('page');
    setSp(n);
  };

  const applyPrice = (e) => {
    e.preventDefault();
    const n = new URLSearchParams(sp);
    min ? n.set('minPrice', min) : n.delete('minPrice');
    max ? n.set('maxPrice', max) : n.delete('maxPrice');
    n.delete('page');
    setSp(n);
  };

  const title = search ? `Results for "${search}"` : category || 'All products';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">{title}</h1>
          {!loading && <p className="text-sm text-ink-500">{data.total} {data.total === 1 ? 'product' : 'products'}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm">
          Sort by
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="input !w-auto !py-2">
            <option value="">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className="space-y-6 text-sm">
          <div>
            <p className="mb-2 font-bold">Category</p>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setParam('category', '')} className={!category ? 'font-bold' : 'text-ink-500 hover:text-ink-900'}>
                  All categories
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button onClick={() => setParam('category', c)} className={category === c ? 'font-bold' : 'text-ink-500 hover:text-ink-900'}>
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={applyPrice}>
            <p className="mb-2 font-bold">Price</p>
            <div className="flex items-center gap-2">
              <input type="number" min="0" value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min" aria-label="Minimum price" className="input !px-2 !py-2" />
              <span>-</span>
              <input type="number" min="0" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max" aria-label="Maximum price" className="input !px-2 !py-2" />
            </div>
            <button className="btn-outline mt-3 w-full !py-2">Apply</button>
          </form>
          {key && (
            <button onClick={() => setSp({})} className="font-semibold text-sky-800 hover:underline">
              Clear all filters
            </button>
          )}
        </aside>

        {/* Results */}
        <div>
          <ErrorBox message={error} />
          {loading ? (
            <Spinner />
          ) : data.products.length === 0 && !error ? (
            <Empty title="No products found" text="Try a different search or clear your filters." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {data.products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button className="btn-outline" disabled={page <= 1} onClick={() => setParam('page', page - 1)}>Previous</button>
              <span className="text-sm text-ink-500">Page {data.page} of {data.pages}</span>
              <button className="btn-outline" disabled={page >= data.pages} onClick={() => setParam('page', page + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
