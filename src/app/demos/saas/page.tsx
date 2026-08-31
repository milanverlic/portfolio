'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChartLineUp,
  CaretDown,
  Lightning,
  Lock,
  Users,
} from '@phosphor-icons/react';

const FEATURES = [
  { icon: ChartLineUp, title: 'Live forecasting', body: 'Revenue projections that update as deals move, not once a month.' },
  { icon: Users, title: 'Shared pipelines', body: 'Everyone sees the same numbers. No more reconciling three spreadsheets.' },
  { icon: Lightning, title: 'Instant sync', body: 'Connects to your existing stack in minutes. No migration project.' },
  { icon: Lock, title: 'SOC 2 Type II', body: 'Audited annually. Your data stays yours, encrypted at rest and in transit.' },
];

const TIERS = [
  {
    name: 'Starter',
    monthly: 29,
    blurb: 'For small teams finding their footing.',
    features: ['Up to 5 seats', '3 pipelines', 'Email support', '30-day history'],
  },
  {
    name: 'Growth',
    monthly: 79,
    blurb: 'For teams that have outgrown spreadsheets.',
    features: [
      'Up to 25 seats',
      'Unlimited pipelines',
      'Priority support',
      'Full history',
      'Custom fields',
      'API access',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    monthly: 199,
    blurb: 'For organisations with real compliance needs.',
    features: [
      'Unlimited seats',
      'SSO / SAML',
      'Dedicated manager',
      'Audit logs',
      'SLA guarantee',
      'Custom contracts',
    ],
  },
];

const FAQS = [
  {
    q: 'How long does setup take?',
    a: 'Most teams are running the same afternoon. Connect your data source, pick your pipeline stages, invite the team. There is no implementation fee and no mandatory onboarding call.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Any time, in both directions. Upgrades apply immediately and we prorate the difference. Downgrades take effect at your next billing date so you keep what you paid for.',
  },
  {
    q: 'What happens to my data if I leave?',
    a: 'You export everything as CSV or JSON from the settings page, whenever you want, including after cancelling. We keep backups for 30 days and then delete permanently.',
  },
  {
    q: 'Do you offer a discount for non-profits?',
    a: 'Yes — 50% off any plan. Email us from your organisation domain and we will apply it to your account the same day.',
  },
];

export default function SaasDemo() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const price = (monthly: number) => (annual ? Math.round(monthly * 0.8) : monthly);

  return (
    <div className="bg-white font-body text-neutral-900">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-600" />
            <span className="font-display text-lg font-semibold tracking-tight">Northwind</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
            <a href="#features" className="hover:text-neutral-900">Features</a>
            <a href="#pricing" className="hover:text-neutral-900">Pricing</a>
            <a href="#faq" className="hover:text-neutral-900">FAQ</a>
          </nav>
          <button className="min-h-[40px] rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            Start free
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Now with live forecasting
          </p>
          <h1 className="mx-auto max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Revenue clarity for teams that hate spreadsheets
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-neutral-600">
            Northwind turns your pipeline into a forecast you can actually trust — updated the
            moment anything changes.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="flex min-h-[48px] items-center gap-2 rounded-lg bg-indigo-600 px-6 font-semibold text-white transition-colors hover:bg-indigo-700">
              Start free trial
              <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </button>
            <button className="min-h-[48px] rounded-lg border border-neutral-300 px-6 font-medium transition-colors hover:border-neutral-400">
              Book a demo
            </button>
          </div>
          <p className="mt-5 text-sm text-neutral-500">
            14 days free · No card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Logos */}
      <section className="border-b border-neutral-200 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs uppercase tracking-[0.16em] text-neutral-400">
            Trusted by teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 opacity-50">
            {['Vertex', 'Lumen', 'Kestrel', 'Northpoint', 'Aperture'].map((name) => (
              <span key={name} className="font-display text-lg font-semibold text-neutral-700">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-neutral-200 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-[46ch]">
            <p className="text-sm font-semibold text-indigo-600">Features</p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-neutral-200 p-7 transition-shadow hover:shadow-lg"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                  <f.icon size={21} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-neutral-200 bg-neutral-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600">Pricing</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Simple, honest pricing
            </h2>

            {/* Interactive billing toggle */}
            <div className="mt-8 inline-flex items-center gap-3">
              <span className={`text-sm ${!annual ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>
                Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                aria-label="Bill annually and save 20 percent"
                onClick={() => setAnnual((v) => !v)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  annual ? 'bg-indigo-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200 ${
                    annual ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${annual ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>
                Annual
                <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border bg-white p-7 ${
                  tier.featured
                    ? 'border-indigo-600 shadow-xl lg:-mt-4 lg:mb-[-1rem]'
                    : 'border-neutral-200'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1.5 text-sm text-neutral-600">{tier.blurb}</p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-semibold tabular-nums tracking-tight">
                    €{price(tier.monthly)}
                  </span>
                  <span className="text-sm text-neutral-500">/user/mo</span>
                </p>
                {annual && (
                  <p className="mt-1 text-xs text-neutral-500">
                    billed annually · €{price(tier.monthly) * 12}/yr
                  </p>
                )}
                <button
                  className={`mt-6 min-h-[46px] w-full rounded-lg font-semibold transition-colors ${
                    tier.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  Get started
                </button>
                <ul className="mt-7 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={17}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span className="text-neutral-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-b border-neutral-200 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <blockquote className="text-balance font-display text-2xl font-medium leading-snug md:text-3xl">
            “We replaced four spreadsheets and a weekly meeting with one dashboard. The forecast is
            finally something we argue about less.”
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              RM
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Rosa Marín</p>
              <p className="text-sm text-neutral-500">VP Revenue, Kestrel</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — interactive accordion */}
      <section id="faq" className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      className="flex min-h-[64px] w-full items-center justify-between gap-4 py-5 text-left font-medium"
                    >
                      {faq.q}
                      <CaretDown
                        size={18}
                        aria-hidden="true"
                        className={`shrink-0 text-neutral-400 transition-transform duration-200 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {open && (
                    <div id={`faq-panel-${i}`} className="pb-6 pr-8">
                      <p className="leading-relaxed text-neutral-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Stop guessing at your numbers
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-indigo-100">
            Fourteen days, full access, no card. Most teams know within a week.
          </p>
          <button className="mt-8 min-h-[48px] rounded-lg bg-white px-7 font-semibold text-indigo-700 transition-colors hover:bg-indigo-50">
            Start free trial
          </button>
        </div>
      </section>

      <footer className="border-t border-neutral-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Northwind — a demo build.</p>
          <p>Designed &amp; built by Milan Verlić</p>
        </div>
      </footer>
    </div>
  );
}
