
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { ErrorBox, Spinner } from '../components/ui';
import { CATEGORIES, money } from '../utils/config';

function MiniRow({ product, index = 0 }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className={`group flex items-center gap-4 p-3 transition duration-300 hover:bg-[#EDF0E6] ${
        index % 2 === 0 ? 'rounded-2xl' : 'rounded-lg'
      }`}
    >
      <ProductImage
        product={product}
        className={`h-16 w-16 shrink-0 ${
          index % 2 === 0 ? 'rounded-xl' : 'rounded-md'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-medium text-[#343D32] transition group-hover:text-[#71845D]">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-[#777D70]">{product.category}</p>
      </div>
      <p className="shrink-0 font-semibold text-[#343D32]">
        {money(product.price)}
      </p>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products', { params: { limit: 60, sort: 'newest' } })
      .then(({ data }) => setProducts(data.products))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  const featured = products[0];
  const pair = products.slice(1, 3);

  const shelves = useMemo(() => {
    const map = {};
    products.forEach((p) => (map[p.category] ||= []).push(p));

    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 4);
  }, [products]);

  const cheapest = useMemo(
    () => [...products].sort((a, b) => a.price - b.price).slice(0, 4),
    [products]
  );

  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#343D32]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero section */}
        <section className="grid gap-5 md:grid-cols-12">
          <div
            className={`relative flex min-h-[430px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#E4E8DA] p-7 sm:p-10 md:row-span-2 md:p-12 ${
              featured ? 'md:col-span-7' : 'md:col-span-12'
            }`}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#A3B18A]/50 sm:h-72 sm:w-72" />
            <div className="pointer-events-none absolute -right-5 -top-5 h-40 w-40 rounded-full border border-[#A3B18A]/40 sm:h-52 sm:w-52" />

            <div className="relative z-10">
              <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#71845D]">
                <span className="h-2 w-2 rounded-full bg-[#71845D]" />
                Thoughtfully chosen, everyday essentials
              </p>

              <h1 className="max-w-xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#343D32] sm:text-6xl md:text-7xl">
                Good things.
                <br />
                Better living.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-[#626B5B] sm:text-lg">
                From everyday technology to personal style and home comforts,
                discover things worth bringing into your life.
              </p>
            </div>

            <div className="relative z-10 mt-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#626B5B]">
                Find your kind of good
              </p>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    to={`/products?category=${c}`}
                    className="rounded-full border border-[#A3B18A]/60 bg-[#F5F4EE]/70 px-4 py-2 text-sm font-medium text-[#343D32] transition duration-200 hover:border-[#343D32] hover:bg-[#343D32] hover:text-white"
                  >
                    {c}
                  </Link>
                ))}
              </div>

              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#343D32] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#52634A]"
              >
                Explore the collection
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          {featured && (
            <Link
              to={`/products/${featured._id}`}
              className="group relative overflow-hidden rounded-[2rem] border border-[#E4E3D9] bg-white p-4 transition duration-300 hover:border-[#A3B18A] md:col-span-5"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#71845D]">
                  Fresh find
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDF0E6] text-[#343D32] transition group-hover:bg-[#343D32] group-hover:text-white">
                  ↗
                </span>
              </div>

              <ProductImage
                product={featured}
                className="aspect-[5/4] w-full rounded-[1.5rem] bg-[#F5F4EE] transition duration-500 group-hover:scale-[1.015]"
              />

              <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-5">
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-[#777D70]">
                    {featured.category}
                  </p>
                  <p className="line-clamp-2 font-serif text-xl leading-snug text-[#343D32] group-hover:underline sm:text-2xl">
                    {featured.name}
                  </p>
                </div>
                <p className="shrink-0 text-lg font-semibold text-[#343D32] sm:text-xl">
                  {money(featured.price)}
                </p>
              </div>
            </Link>
          )}

          {pair.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:col-span-5">
              {pair.map((p, index) => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className={`group border border-[#E4E3D9] bg-white p-3 transition duration-300 hover:border-[#A3B18A] ${
                    index === 0
                      ? 'rounded-[1.75rem]'
                      : 'rounded-xl sm:rounded-[1.75rem]'
                  }`}
                >
                  <ProductImage
                    product={p}
                    className={`aspect-square w-full bg-[#F5F4EE] ${
                      index === 0 ? 'rounded-[1.25rem]' : 'rounded-lg sm:rounded-[1.25rem]'
                    }`}
                  />

                  <div className="px-1 pb-1 pt-3">
                    <p className="mb-1 text-[11px] uppercase tracking-wider text-[#777D70]">
                      {p.category}
                    </p>
                    <p className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#343D32] group-hover:underline">
                      {p.name}
                    </p>
                    <p className="mt-2 font-semibold text-[#343D32]">
                      {money(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <ErrorBox message={error} />
        {loading && <Spinner />}

        {!loading && !error && products.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-[#E4E3D9] bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E4E8DA] text-2xl text-[#52634A]">
              ✳
            </div>
            <h2 className="mt-5 font-serif text-3xl text-[#343D32]">
              A little space for something good.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777D70]">
              There are no products to show just yet. Run{' '}
              <code className="rounded bg-[#EDF0E6] px-1.5 py-1 text-[#343D32]">
                npm run seed
              </code>{' '}
              in the server folder, or add products from the admin panel.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-[#343D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#52634A]"
            >
              Explore products
            </Link>
          </div>
        )}

        {/* Category shelves */}
        <div className="mt-10">
          {shelves.map(([cat, items], index) => (
            <section
              key={cat}
              className="grid gap-5 border-t border-[#DADDD1] py-9 sm:py-11 md:grid-cols-[190px_1fr] md:gap-8 lg:grid-cols-[220px_1fr]"
            >
              <div className="h-fit md:sticky md:top-28">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#71845D]">
                  Collection 0{index + 1}
                </p>

                <h2 className="font-serif text-3xl font-medium tracking-tight text-[#343D32] sm:text-4xl">
                  {cat}
                </h2>

                <p className="mt-2 text-sm text-[#777D70]">
                  {items.length} {items.length === 1 ? 'find' : 'finds'} to explore
                </p>

                <Link
                  to={`/products?category=${cat}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#C9CEBE] px-5 py-2.5 text-sm font-medium text-[#343D32] transition hover:border-[#343D32] hover:bg-[#343D32] hover:text-white"
                >
                  Shop collection
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>

              <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
                {items.slice(0, 8).map((p, cardIndex) => (
                  <div
                    key={p._id}
                    className={`w-52 shrink-0 snap-start sm:w-56 ${
                      cardIndex % 3 === 1 ? 'pt-4' : ''
                    }`}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Product lists */}
        {products.length > 0 && (
          <section className="grid gap-5 border-t border-[#DADDD1] py-10 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#E4E3D9] bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-end justify-between gap-3 px-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#71845D]">
                    New to the store
                  </p>
                  <h2 className="font-serif text-2xl text-[#343D32] sm:text-3xl">
                    Just added
                  </h2>
                </div>

                <Link
                  to="/products?sort=newest"
                  className="shrink-0 text-sm font-medium text-[#71845D] transition hover:text-[#343D32] hover:underline"
                >
                  View all ↗
                </Link>
              </div>

              <div className="divide-y divide-[#ECEDE6]">
                {products.slice(0, 4).map((p, index) => (
                  <MiniRow key={p._id} product={p} index={index} />
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E4E3D9] bg-[#E9EDE3] p-4 sm:p-5">
              <div className="mb-4 flex items-end justify-between gap-3 px-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#71845D]">
                    Good finds, fair prices
                  </p>
                  <h2 className="font-serif text-2xl text-[#343D32] sm:text-3xl">
                    Lowest prices
                  </h2>
                </div>

                <Link
                  to="/products?sort=price-asc"
                  className="shrink-0 text-sm font-medium text-[#71845D] transition hover:text-[#343D32] hover:underline"
                >
                  View all ↗
                </Link>
              </div>

              <div className="divide-y divide-[#D9DFD1]">
                {cheapest.map((p, index) => (
                  <MiniRow key={p._id} product={p} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Store assurances */}
        <section className="mt-4 overflow-hidden rounded-[2rem] bg-[#343D32] text-white">
          <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              {
                symbol: '↗',
                title: 'Delivery, on us',
                description: 'No shipping charge on any order.',
              },
              {
                symbol: '✓',
                title: 'Your trust matters',
                description: 'Passwords are hashed, never stored in plain text.',
              },
              {
                symbol: '◷',
                title: 'Stock that stays current',
                description: 'Inventory updates as orders are placed.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 sm:p-7">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg text-[#C7D2B7]">
                  {item.symbol}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#D1D8CB]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-2 py-7 text-xs text-[#858B7D] sm:flex-row sm:items-center sm:justify-between">
          <p>Thoughtful finds for everyday living.</p>
          <Link to="/products" className="font-medium text-[#52634A] transition hover:text-[#343D32] hover:underline">
            Explore all products ↗
          </Link>
        </footer>
      </div>
    </div>
  );
}