import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { errMsg } from '../api/axios';
import { addToCart } from '../store/cartSlice';
import ProductImage from '../components/ProductImage';
import { Empty, ErrorBox, Spinner } from '../components/ui';
import { money } from '../utils/config';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setQty(1);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error || !product)
    return (
      <div className="px-4 py-16">
        <Empty title="Product not found" text={error} to="/products" cta="Back to products" />
      </div>
    );

  const out = product.stock === 0;
  const add = () => {
    dispatch(addToCart({ product, qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-5 text-sm text-ink-500">
        <Link to="/products" className="hover:underline">Products</Link> /{' '}
        <Link to={`/products?category=${product.category}`} className="hover:underline">{product.category}</Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_300px]">
        <div className="panel p-4">
          <ProductImage product={product} className="aspect-square w-full rounded-lg" />
        </div>

        <div>
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-ink-500">{product.category}</p>
          <p className="mt-5 border-t border-ink-900/10 pt-5 text-3xl font-bold">{money(product.price)}</p>
          <p className="mt-1 text-sm text-ink-500">Free delivery on this order.</p>
          <h2 className="mt-6 font-bold">About this item</h2>
          <p className="mt-2 max-w-prose whitespace-pre-line leading-relaxed text-ink-700">{product.description}</p>
        </div>

        {/* Buy box */}
        <aside className="panel h-fit space-y-4 p-5 lg:sticky lg:top-32">
          <p className="text-2xl font-bold">{money(product.price)}</p>
          <p className={`font-semibold ${out ? 'text-red-600' : product.stock <= 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {out ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
          </p>
          {!out && (
            <>
              <label className="block text-sm">
                <span className="label">Quantity</span>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="input">
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <button onClick={add} className="btn-gold w-full">{added ? 'Added to cart' : 'Add to cart'}</button>
              <button
                onClick={() => {
                  dispatch(addToCart({ product, qty }));
                  navigate('/checkout');
                }}
                className="btn-ink w-full"
              >
                Buy now
              </button>
            </>
          )}
          <p className="text-xs text-ink-500">Secure checkout. You can review your order before placing it.</p>
        </aside>
      </div>
    </div>
  );
}
