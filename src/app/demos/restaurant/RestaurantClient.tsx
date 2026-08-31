'use client';

import { useMemo, useState } from 'react';
import { CheckCircle, Clock, MapPin, Phone } from '@phosphor-icons/react';

type Category = 'All' | 'Small plates' | 'Mains' | 'Desserts' | 'Wine';

const MENU: { name: string; desc: string; price: number; cat: Exclude<Category, 'All'>; v?: boolean }[] =
  [
    { name: 'Charred leeks, hazelnut', desc: 'Burnt butter, aged sheep cheese, chervil', price: 11, cat: 'Small plates', v: true },
    { name: 'Cured trout', desc: 'Fennel, buttermilk, dill oil, rye crisp', price: 14, cat: 'Small plates' },
    { name: 'Wood-fired flatbread', desc: 'Confit garlic, thyme, cultured butter', price: 9, cat: 'Small plates', v: true },
    { name: 'Beef short rib', desc: 'Braised eight hours, smoked marrow, watercress', price: 29, cat: 'Mains' },
    { name: 'Whole plaice', desc: 'Brown shrimp, capers, sea herbs, lemon', price: 27, cat: 'Mains' },
    { name: 'Celeriac shawarma', desc: 'Ember-roasted, tahini, pickled chilli, flatbread', price: 21, cat: 'Mains', v: true },
    { name: 'Burnt basque cheesecake', desc: 'Poached quince, crème fraîche', price: 10, cat: 'Desserts', v: true },
    { name: 'Chocolate & olive oil', desc: 'Sea salt, sourdough crumb', price: 9, cat: 'Desserts', v: true },
    { name: 'Etna Rosso 2019', desc: 'Nerello Mascalese — red cherry, ash, bright', price: 48, cat: 'Wine' },
    { name: 'Muscadet sur Lie', desc: 'Melon de Bourgogne — saline, taut, coastal', price: 36, cat: 'Wine' },
  ];

const CATEGORIES: Category[] = ['All', 'Small plates', 'Mains', 'Desserts', 'Wine'];
const TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export function RestaurantClient() {
  const [cat, setCat] = useState<Category>('All');
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({ date: '', time: '19:00', party: '2', name: '', phone: '' });

  const filtered = useMemo(() => (cat === 'All' ? MENU : MENU.filter((m) => m.cat === cat)), [cat]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: MENU.length };
    for (const item of MENU) map[item.cat] = (map[item.cat] ?? 0) + 1;
    return map;
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="bg-[#FDF6EC] font-body text-[#1A120B]">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-[#1A120B]/10 bg-[#FDF6EC]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-serif text-xl tracking-tight">Olive &amp; Ember</span>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#menu" className="hover:text-amber-700">Menu</a>
            <a href="#visit" className="hover:text-amber-700">Visit</a>
            <a href="#book" className="hover:text-amber-700">Reserve</a>
          </nav>
          <a
            href="#book"
            className="flex min-h-[40px] items-center rounded-full bg-[#1A120B] px-5 text-sm font-medium text-[#FDF6EC] transition-colors hover:bg-amber-800"
          >
            Book a table
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A1B0E] via-[#1A120B] to-[#3A2410]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 25% 30%, #D97706 0%, transparent 45%), radial-gradient(circle at 75% 70%, #92400E 0%, transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 text-[#FDF6EC] md:py-40">
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-amber-400">
            Wood fire · Seasonal · Ljubljana
          </p>
          <h1 className="max-w-[14ch] text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
            Cooked over embers, served without ceremony
          </h1>
          <p className="mt-7 max-w-[50ch] text-lg leading-relaxed text-[#FDF6EC]/75">
            A short menu that changes with what the growers bring us. One fire, twelve tables, no
            tasting menu.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#book"
              className="flex min-h-[48px] items-center justify-center rounded-full bg-amber-600 px-7 font-medium text-white transition-colors hover:bg-amber-500"
            >
              Reserve a table
            </a>
            <a
              href="#menu"
              className="flex min-h-[48px] items-center justify-center rounded-full border border-[#FDF6EC]/30 px-7 font-medium transition-colors hover:border-[#FDF6EC]"
            >
              See the menu
            </a>
          </div>
        </div>
      </section>

      {/* Menu with working filter */}
      <section id="menu" className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-4xl md:text-5xl">The menu</h2>
          <p className="mt-3 text-[#1A120B]/60">
            Changes every few weeks. Dishes marked <span className="text-green-700">●</span> are
            vegetarian.
          </p>

          <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Filter menu by course">
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={active}
                  className={`flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                    active
                      ? 'border-[#1A120B] bg-[#1A120B] text-[#FDF6EC]'
                      : 'border-[#1A120B]/20 hover:border-[#1A120B]/50'
                  }`}
                >
                  {c}
                  <span className={`tabular-nums text-xs ${active ? 'text-amber-400' : 'text-[#1A120B]/40'}`}>
                    {counts[c] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="sr-only">
            Showing {filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} in {cat}.
          </p>

          <ul className="mt-10 divide-y divide-[#1A120B]/10 border-y border-[#1A120B]/10">
            {filtered.map((item) => (
              <li key={item.name} className="flex items-baseline gap-5 py-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg">
                    {item.name}
                    {item.v && (
                      <span className="ml-2 text-sm text-green-700" title="Vegetarian" aria-label="Vegetarian">
                        ●
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-[#1A120B]/60">{item.desc}</p>
                </div>
                <span aria-hidden="true" className="h-px flex-1 border-b border-dotted border-[#1A120B]/25" />
                <span className="font-serif text-lg tabular-nums">€{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="border-y border-[#1A120B]/10 bg-[#F6EBDB] py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-3">
          {[
            { icon: MapPin, title: 'Find us', lines: ['Trubarjeva cesta 42', '1000 Ljubljana'] },
            { icon: Clock, title: 'Hours', lines: ['Wed – Sat · 17:00 – 23:00', 'Sunday · 12:00 – 16:00'] },
            { icon: Phone, title: 'Call', lines: ['+386 1 234 5678', 'hello@oliveandember.si'] },
          ].map((block) => (
            <div key={block.title}>
              <block.icon size={24} className="text-amber-700" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl">{block.title}</h3>
              {block.lines.map((line) => (
                <p key={line} className="mt-1 text-[#1A120B]/65">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Reservation */}
      <section id="book" className="py-20 md:py-28">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-center font-serif text-4xl md:text-5xl">Reserve a table</h2>
          <p className="mt-3 text-center text-[#1A120B]/60">
            Tables held for 15 minutes. For six or more, please call.
          </p>

          {booked ? (
            <div className="mt-10 rounded-2xl border border-green-700/30 bg-green-50 p-8 text-center">
              <CheckCircle size={40} weight="fill" className="mx-auto text-green-700" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-2xl">Table requested</h3>
              <p className="mt-2 text-[#1A120B]/70">
                {form.party} guests on {form.date || 'your chosen date'} at {form.time}. We&apos;ll
                text {form.phone || 'you'} to confirm.
              </p>
              <button
                onClick={() => setBooked(false)}
                className="mt-6 min-h-[44px] rounded-full border border-[#1A120B]/25 px-5 text-sm"
              >
                Change booking
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBooked(true);
              }}
              className="mt-10 space-y-5 rounded-2xl border border-[#1A120B]/12 bg-white p-7"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="r-date" className="mb-1.5 block text-sm font-medium">
                    Date
                  </label>
                  <input
                    id="r-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={set('date')}
                    className="min-h-[48px] w-full rounded-lg border border-[#1A120B]/20 px-3.5 focus:border-amber-600"
                  />
                </div>
                <div>
                  <label htmlFor="r-time" className="mb-1.5 block text-sm font-medium">
                    Time
                  </label>
                  <select
                    id="r-time"
                    value={form.time}
                    onChange={set('time')}
                    className="min-h-[48px] w-full rounded-lg border border-[#1A120B]/20 bg-white px-3.5 focus:border-amber-600"
                  >
                    {TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="r-party" className="mb-1.5 block text-sm font-medium">
                  Party size
                </label>
                <select
                  id="r-party"
                  value={form.party}
                  onChange={set('party')}
                  className="min-h-[48px] w-full rounded-lg border border-[#1A120B]/20 bg-white px-3.5 focus:border-amber-600"
                >
                  {['1', '2', '3', '4', '5'].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === '1' ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="r-name" className="mb-1.5 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="r-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={set('name')}
                    className="min-h-[48px] w-full rounded-lg border border-[#1A120B]/20 px-3.5 focus:border-amber-600"
                  />
                </div>
                <div>
                  <label htmlFor="r-phone" className="mb-1.5 block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="r-phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    className="min-h-[48px] w-full rounded-lg border border-[#1A120B]/20 px-3.5 focus:border-amber-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="min-h-[50px] w-full rounded-full bg-[#1A120B] font-medium text-[#FDF6EC] transition-colors hover:bg-amber-800"
              >
                Request table
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-[#1A120B]/10 py-10 text-center text-sm text-[#1A120B]/50">
        <p>© {new Date().getFullYear()} Olive &amp; Ember — a demo build.</p>
        <p className="mt-1">Designed &amp; built by Milan Verlić</p>
      </footer>
    </div>
  );
}
