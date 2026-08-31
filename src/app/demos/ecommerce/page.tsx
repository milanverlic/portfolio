'use client';

import { useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash, X } from '@phosphor-icons/react';

type Product = {
  id: string;
  name: string;
  cat: 'Desk' | 'Light' | 'Storage';
  price: number;
  tone: string;
  accent: string;
};

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Halden Desk Mat', cat: 'Desk', price: 64, tone: '#1F3A34', accent: '#8FBFAF' },
  { id: 'p2', name: 'Orbit Task Lamp', cat: 'Light', price: 129, tone: '#26332F', accent: '#E4D8B4' },
  { id: 'p3', name: 'Field Tray', cat: 'Storage', price: 38, tone: '#0F2B24', accent: '#6EE7B7' },
  { id: 'p4', name: 'Column Riser', cat: 'Desk', price: 92, tone: '#213A31', accent: '#A7D8C4' },
  { id: 'p5', name: 'Arc Pendant', cat: 'Light', price: 218, tone: '#14241F', accent: '#D6E9DF' },
  { id: 'p6', name: 'Stack Boxes, set of 3', cat: 'Storage', price: 74, tone: '#1B3129', accent: '#34D399' },
];

const CATEGORIES = ['All', 'Desk', 'Light', 'Storage'] as const;
const SORTS = { featured: 'Featured', asc: 'Price: low to high', desc: 'Price: high to low' } as const;

export default function EcommerceDemo() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const [sort, setSort] = useState<keyof typeof SORTS>('featured');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  const shown = useMemo(() => {
    const list = cat === 'All' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.cat === cat);
    if (sort === 'asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
        .filter((l) => l.product),
    [cart]
  );

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const next = (c[id] ?? 0) - 1;
      if (next <= 0) {
        const { [id]: _removed, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: next };
    });
  const remove = (id: string) =>
    setCart((c) => {
      const { [id]: _removed, ...rest } = c;
      return rest;
    });

  return (
    <div className="min-h-dvh bg-[#F9FAFB] font-body text-neutral-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-semibold tracking-tight">FORM SUPPLY</span>
          <nav className="hidden gap-8 text-sm text-neutral-600 md:flex">
            <a href="#shop" className="hover:text-neutral-900">Shop</a>
            <a href="#shop" className="hover:text-neutral-900">About</a>
            <a href="#shop" className="hover:text-neutral-900">Journal</a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex min-h-[44px] items-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-medium transition-colors hover:border-neutral-400"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            Cart
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-xs font-semibold tabular-nums text-white">
                {count}
              </span>
            )}
            <span className="sr-only">
              {count === 0 ? 'Cart is empty' : `${count} items in cart, €${subtotal}`}
            </span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-[#064E3B] py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
            Autumn release · Shipping worldwide
          </p>
          <h1 className="mt-5 max-w-[15ch] text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Objects for a desk you actually want to sit at
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-emerald-50/75">
            Made in small runs from solid materials. Built to outlast whatever you are replacing.
          </p>
        </div>
      </section>

      {/* Controls + grid */}
      <section id="shop" className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`min-h-[44px] rounded-lg border px-4 text-sm transition-colors ${
                    cat === c
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <label htmlFor="sort" className="text-sm text-neutral-600">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
                className="min-h-[44px] rounded-lg border border-neutral-300 bg-white px-3 text-sm"
              >
                {Object.entries(SORTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p aria-live="polite" className="mt-5 text-sm text-neutral-500">
            {shown.length} {shown.length === 1 ? 'product' : 'products'}
            {cat !== 'All' && ` in ${cat}`}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <article
                key={p.id}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-white"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  style={{ background: p.tone }}
                  aria-hidden="true"
                >
                  <div
                    className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-md transition-transform duration-500 group-hover:scale-125"
                    style={{ background: p.accent }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                    style={{ background: `linear-gradient(transparent, ${p.tone})` }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{p.cat}</p>
                  <h3 className="mt-1.5 font-display text-base font-semibold">{p.name}</h3>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-semibold tabular-nums">€{p.price}</span>
                    <button
                      type="button"
                      onClick={() => add(p.id)}
                      className="min-h-[44px] rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      Add to cart
                      <span className="sr-only"> — {p.name}, €{p.price}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cart drawer */}
      {open && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/40"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="font-display text-lg font-semibold">
                Your cart {count > 0 && <span className="tabular-nums text-neutral-400">({count})</span>}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="grid h-11 w-11 place-items-center rounded-lg hover:bg-neutral-100"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag size={44} className="text-neutral-300" aria-hidden="true" />
                <p className="mt-4 font-display text-lg font-semibold">Nothing here yet</p>
                <p className="mt-1.5 max-w-[32ch] text-sm text-neutral-500">
                  Add something from the shop and it will show up here.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 min-h-[44px] rounded-lg border border-neutral-300 px-5 text-sm font-medium"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-neutral-200 overflow-y-auto px-6">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-4 py-5">
                      <div
                        aria-hidden="true"
                        className="h-16 w-16 shrink-0 rounded-lg"
                        style={{ background: product.tone }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold">{product.name}</h3>
                        <p className="mt-0.5 text-sm tabular-nums text-neutral-500">
                          €{product.price} each
                        </p>
                        <div className="mt-2.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => dec(product.id)}
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="grid h-9 w-9 place-items-center rounded-md border border-neutral-300 hover:bg-neutral-50"
                          >
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <span className="w-9 text-center text-sm tabular-nums" aria-live="polite">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => add(product.id)}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="grid h-9 w-9 place-items-center rounded-md border border-neutral-300 hover:bg-neutral-50"
                          >
                            <Plus size={14} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(product.id)}
                            aria-label={`Remove ${product.name} from cart`}
                            className="ml-2 grid h-9 w-9 place-items-center rounded-md text-neutral-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <span className="font-display text-sm font-semibold tabular-nums">
                        €{product.price * qty}
                      </span>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-neutral-200 px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-display text-xl font-semibold tabular-nums">€{subtotal}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button className="mt-4 min-h-[50px] w-full rounded-lg bg-emerald-700 font-semibold text-white transition-colors hover:bg-emerald-800">
                    Checkout
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}

      <footer className="border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Form Supply — a demo build.</p>
          <p>Designed &amp; built by Milan Verlić</p>
        </div>
      </footer>
    </div>
  );
}
