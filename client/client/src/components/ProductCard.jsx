import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { money } from '../utils/config';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const out = product.stock === 0;

  return (
    <div className="panel group flex h-full flex-col overflow-hidden transition hover:border-ink-900/40">
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-white p-3">
        <ProductImage product={product} className="aspect-square w-full rounded-lg transition duration-300 group-hover:scale-[1.03]" />
      </Link>
      <div className="flex flex-1 flex-col p-4 pt-1">
        <p className="text-xs text-ink-500">{product.category}</p>
        <Link to={`/products/${product._id}`} className="mt-0.5 line-clamp-2 font-semibold leading-snug hover:underline">
          {product.name}
        </Link>
        <p className="mt-2 text-xl font-bold">{money(product.price)}</p>
        <p className={`text-xs ${out ? 'text-red-600' : product.stock <= 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
          {out ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
        </p>
        <button
          disabled={out}
          onClick={() => dispatch(addToCart({ product }))}
          className="btn-gold mt-auto w-full !py-2"
          style={{ marginTop: '0.9rem' }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
