import Image from 'next/image';
import type { Demo, PreviewTheme } from '@/lib/demos';
import { BrowserChrome } from './BrowserChrome';

/**
 * Miniature reproduction of each demo's actual interface.
 *
 * These are not abstract shapes — each one mirrors the real layout of the demo
 * it represents: Northwind's nav + centred hero + three pricing tiers, Olive &
 * Ember's serif hero + dotted-leader menu rows, Form Supply's filter chips +
 * product tiles, Studio Kern's oversized index rows. A visitor reads them as
 * "four different websites" before opening any of them.
 *
 * They are vector/DOM rather than raster, so they cost zero image bytes, stay
 * crisp at any DPR, and never go stale against the demo they depict.
 *
 * To swap in real captures: put a file in /public/previews and set
 * `previewImage` on the demo in lib/demos.ts. This component renders it
 * instead, with no other change required.
 */

/** Demos whose own palette is light, so the chrome above them should be too. */
const LIGHT_PREVIEWS = new Set(['saas', 'ecommerce']);

function Bar({ w, h = 4, c, r = 1 }: { w: string; h?: number; c: string; r?: number }) {
  return <span style={{ width: w, height: h, background: c, borderRadius: r, display: 'block' }} />;
}

function SaasPreview({ t }: { t: PreviewTheme }) {
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg }}>
      {/* nav */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: t.surface, borderBottom: `1px solid ${t.muted}33` }}
      >
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: t.accent }} />
          <span className="text-[7px] font-bold" style={{ color: t.ink }}>
            Northwind
          </span>
        </div>
        <div className="flex items-center gap-2">
          {['Features', 'Pricing', 'FAQ'].map((l) => (
            <span key={l} className="text-[5.5px]" style={{ color: t.muted }}>
              {l}
            </span>
          ))}
          <span
            className="rounded-[2px] px-1.5 py-0.5 text-[5.5px] font-semibold"
            style={{ background: t.accent, color: t.onAccent }}
          >
            Start free
          </span>
        </div>
      </div>

      {/* hero */}
      <div className="flex flex-col items-center gap-1 px-4 pb-2 pt-3 text-center">
        <span
          className="rounded-full px-1.5 py-[1px] text-[5px]"
          style={{ background: `${t.accent}1F`, color: t.accent }}
        >
          Now with live forecasting
        </span>
        <p
          className="mt-0.5 text-[11px] font-bold leading-[1.1] tracking-tight"
          style={{ color: t.ink }}
        >
          Revenue clarity for
          <br />
          teams that hate spreadsheets
        </p>
        <div className="mt-1 flex gap-1">
          <span
            className="rounded-[2px] px-2 py-0.5 text-[5.5px] font-semibold"
            style={{ background: t.accent, color: t.onAccent }}
          >
            Start free trial
          </span>
          <span
            className="rounded-[2px] px-2 py-0.5 text-[5.5px]"
            style={{ border: `1px solid ${t.muted}66`, color: t.ink }}
          >
            Book a demo
          </span>
        </div>
      </div>

      {/* pricing tiers */}
      <div className="mt-auto grid grid-cols-3 gap-1.5 px-3 pb-3">
        {[
          { n: 'Starter', p: '€23', hi: false },
          { n: 'Growth', p: '€63', hi: true },
          { n: 'Scale', p: '€159', hi: false },
        ].map((tier) => (
          <div
            key={tier.n}
            className="flex flex-col gap-1 rounded-[3px] p-1.5"
            style={{
              background: t.surface,
              border: `1px solid ${tier.hi ? t.accent : `${t.muted}44`}`,
            }}
          >
            <span className="text-[5px]" style={{ color: t.muted }}>
              {tier.n}
            </span>
            <span className="text-[9px] font-bold leading-none" style={{ color: t.ink }}>
              {tier.p}
            </span>
            <div className="mt-0.5 flex flex-col gap-[3px]">
              <Bar w="80%" h={2} c={`${t.muted}55`} />
              <Bar w="60%" h={2} c={`${t.muted}55`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RestaurantPreview({ t }: { t: PreviewTheme }) {
  const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg }}>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${t.muted}33` }}
      >
        <span className="text-[7.5px]" style={{ ...serif, color: t.ink }}>
          Olive &amp; Ember
        </span>
        <div className="flex items-center gap-2">
          {['Menu', 'Visit'].map((l) => (
            <span key={l} className="text-[5.5px]" style={{ color: t.muted }}>
              {l}
            </span>
          ))}
          <span
            className="rounded-full px-1.5 py-0.5 text-[5.5px]"
            style={{ background: t.accent, color: t.onAccent }}
          >
            Book a table
          </span>
        </div>
      </div>

      <div className="px-3 pb-2 pt-3">
        <p className="text-[5px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
          Wood fire · Seasonal
        </p>
        <p className="mt-1 text-[13px] leading-[1.05]" style={{ ...serif, color: t.ink }}>
          Cooked over embers,
          <br />
          served without ceremony
        </p>
      </div>

      {/* menu rows with dotted leaders */}
      <div className="mt-auto flex flex-col gap-1 px-3 pb-3">
        {[
          ['Charred leeks, hazelnut', '€11'],
          ['Beef short rib', '€29'],
          ['Burnt basque cheesecake', '€10'],
        ].map(([name, price]) => (
          <div key={name} className="flex items-baseline gap-1.5">
            <span className="text-[6px]" style={{ ...serif, color: t.ink }}>
              {name}
            </span>
            <span
              className="h-px flex-1"
              style={{ borderBottom: `1px dotted ${t.muted}88` }}
            />
            <span className="text-[6px]" style={{ ...serif, color: t.ink }}>
              {price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcommercePreview({ t }: { t: PreviewTheme }) {
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg }}>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: t.surface, borderBottom: `1px solid ${t.muted}33` }}
      >
        <span className="text-[7px] font-bold tracking-tight" style={{ color: t.ink }}>
          FORM SUPPLY
        </span>
        <span
          className="flex items-center gap-1 rounded-[2px] px-1.5 py-0.5 text-[5.5px]"
          style={{ border: `1px solid ${t.muted}66`, color: t.ink }}
        >
          Cart
          <span
            className="rounded-full px-1 text-[5px] font-bold"
            style={{ background: t.accent, color: t.onAccent }}
          >
            3
          </span>
        </span>
      </div>

      {/* filter chips */}
      <div className="flex gap-1 px-3 pb-1.5 pt-2">
        {['All', 'Desk', 'Light', 'Storage'].map((c, i) => (
          <span
            key={c}
            className="rounded-[2px] px-1.5 py-0.5 text-[5px]"
            style={
              i === 0
                ? { background: t.ink, color: t.bg }
                : { border: `1px solid ${t.muted}55`, color: t.muted }
            }
          >
            {c}
          </span>
        ))}
      </div>

      {/* product grid */}
      <div className="mt-auto grid grid-cols-3 gap-1.5 px-3 pb-3">
        {[
          { n: 'Halden Mat', p: '€64', c: '#1F3A34' },
          { n: 'Orbit Lamp', p: '€129', c: '#26332F' },
          { n: 'Field Tray', p: '€38', c: '#0F2B24' },
        ].map((prod) => (
          <div
            key={prod.n}
            className="overflow-hidden rounded-[3px]"
            style={{ background: t.surface, border: `1px solid ${t.muted}44` }}
          >
            <div className="relative h-8" style={{ background: prod.c }}>
              <span
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: t.accent, opacity: 0.55 }}
              />
            </div>
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-[5px]" style={{ color: t.ink }}>
                {prod.n}
              </span>
              <span className="text-[5.5px] font-bold" style={{ color: t.ink }}>
                {prod.p}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgencyPreview({ t }: { t: PreviewTheme }) {
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg }}>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${t.muted}44` }}
      >
        <span
          className="text-[5.5px] font-bold uppercase tracking-[0.2em]"
          style={{ color: t.ink }}
        >
          Studio Kern
        </span>
        <span className="text-[5px] uppercase tracking-[0.15em]" style={{ color: t.muted }}>
          Work · Contact
        </span>
      </div>

      <div className="px-3 pb-1.5 pt-3">
        <p
          className="text-[15px] font-black uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ color: t.ink }}
        >
          We make
          <br />
          <span style={{ color: t.accent }}>brands</span> that
          <br />
          refuse to blend in
        </p>
      </div>

      {/* project index rows */}
      <div className="mt-auto flex flex-col px-3 pb-3">
        {[
          ['2025', 'Meridian Bank'],
          ['2025', 'Halo Records'],
          ['2024', 'Nord Athletics'],
        ].map(([year, name]) => (
          <div
            key={name}
            className="flex items-center justify-between py-[3px]"
            style={{ borderTop: `1px solid ${t.muted}44` }}
          >
            <span className="text-[5px]" style={{ color: t.muted }}>
              {year}
            </span>
            <span
              className="flex-1 pl-2 text-[7px] font-bold uppercase tracking-tight"
              style={{ color: t.ink }}
            >
              {name}
            </span>
            <span className="text-[6px]" style={{ color: t.muted }}>
              ↗
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PREVIEWS = {
  saas: SaasPreview,
  restaurant: RestaurantPreview,
  ecommerce: EcommercePreview,
  agency: AgencyPreview,
} as const;

export function DemoPreview({ demo }: { demo: Demo }) {
  const Inner = PREVIEWS[demo.slug];

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/10] w-full overflow-hidden border-b border-line"
    >
      {demo.previewImage ? (
        <Image
          src={demo.previewImage}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col">
          <BrowserChrome url={demo.displayUrl} tone={LIGHT_PREVIEWS.has(demo.slug) ? 'light' : 'dark'} compact />
          <div className="min-h-0 flex-1">
            <Inner t={demo.preview} />
          </div>
        </div>
      )}
    </div>
  );
}
