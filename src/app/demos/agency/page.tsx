'use client';

import { useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

const PROJECTS = [
  { year: '2025', client: 'Meridian Bank', discipline: 'Identity, Motion', tint: '#FF4D00' },
  { year: '2025', client: 'Halo Records', discipline: 'Art Direction, Web', tint: '#00E0FF' },
  { year: '2024', client: 'Verso Publishing', discipline: 'Editorial, Type', tint: '#FFD447' },
  { year: '2024', client: 'Nord Athletics', discipline: 'Campaign, Film', tint: '#B4FF39' },
  { year: '2023', client: 'Atelier Ruz', discipline: 'Identity, Packaging', tint: '#FF6EC7' },
];

const CAPABILITIES = [
  { title: 'Brand identity', items: ['Naming', 'Logotype', 'Design systems', 'Guidelines'] },
  { title: 'Digital', items: ['Art direction', 'Web design', 'Prototyping', 'Build'] },
  { title: 'Motion', items: ['Title sequences', 'Product film', 'Social cutdowns', 'Sound'] },
];

const AWARDS = ['D&AD Wood Pencil', 'Awwwards SOTD ×3', 'Type Directors Club', 'FWA of the Day'];

export default function AgencyDemo() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="min-h-dvh bg-[#0A0A0A] font-display text-[#FAFAFA] [color-scheme:dark]">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0A0A0A]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Studio Kern</span>
          <nav className="hidden gap-8 text-sm uppercase tracking-[0.12em] text-white/50 md:flex">
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#capabilities" className="hover:text-white">Capabilities</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a
            href="#contact"
            className="flex min-h-[40px] items-center border border-white/25 px-4 text-sm uppercase tracking-[0.12em] transition-colors hover:border-[#FF4D00] hover:text-[#FF4D00]"
          >
            Enquire
          </a>
        </div>
      </header>

      {/* Hero — exaggerated minimalism */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-36">
          <p className="mb-10 text-xs uppercase tracking-[0.3em] text-white/40">
            Independent design studio — Est. 2016
          </p>
          <h1
            className="font-semibold uppercase leading-[0.86] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(3rem, 12vw, 11rem)' }}
          >
            We make
            <br />
            <span className="text-[#FF4D00]">brands</span> that
            <br />
            refuse to
            <br />
            blend in
          </h1>
          <div className="mt-14 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
            <p className="max-w-[40ch] text-white/60 md:col-span-2">
              A twelve-person studio working across identity, digital and motion. We take on six
              projects a year so that each one gets the whole room.
            </p>
            <p className="text-sm uppercase tracking-[0.12em] text-white/40 md:text-right">
              Ljubljana / London
            </p>
          </div>
        </div>
      </section>

      {/* Project index — hover reveal */}
      <section id="work" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mb-12 text-xs uppercase tracking-[0.3em] text-white/40">
            Selected work — 2023 / 2025
          </h2>
          <ul>
            {PROJECTS.map((p, i) => (
              <li key={p.client}>
                <a
                  href="#work"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className="group grid grid-cols-12 items-center gap-4 border-t border-white/10 py-7 transition-colors last:border-b hover:bg-white/[0.03]"
                >
                  <span className="col-span-2 text-sm tabular-nums text-white/40 md:col-span-1">
                    {p.year}
                  </span>
                  <span
                    className="col-span-8 text-2xl font-semibold uppercase tracking-tight transition-colors md:col-span-6 md:text-4xl"
                    style={{ color: hovered === i ? p.tint : undefined }}
                  >
                    {p.client}
                  </span>
                  <span className="col-span-12 text-sm uppercase tracking-[0.1em] text-white/45 md:col-span-4 md:text-right">
                    {p.discipline}
                  </span>
                  <span className="col-span-2 flex justify-end md:col-span-1">
                    <ArrowUpRight
                      size={22}
                      aria-hidden="true"
                      className="text-white/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title}>
              <h3 className="text-xs uppercase tracking-[0.24em] text-[#FF4D00]">{cap.title}</h3>
              <ul className="mt-6 space-y-3">
                {cap.items.map((item) => (
                  <li key={item} className="border-b border-white/10 pb-3 text-lg text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="border-b border-white/10 py-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-5 px-6">
          {AWARDS.map((award) => (
            <span key={award} className="text-sm uppercase tracking-[0.14em] text-white/35">
              {award}
            </span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <h2
            className="font-semibold uppercase leading-[0.9] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
          >
            Got something
            <br />
            worth making?
          </h2>
          <a
            href="#contact"
            className="mt-12 inline-flex min-h-[56px] items-center gap-3 bg-[#FF4D00] px-8 text-base font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] transition-colors hover:bg-white"
          >
            Start a conversation
            <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
          </a>
          <p className="mt-10 text-white/40">
            hello@studiokern.com — we reply to everything within two days.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs uppercase tracking-[0.14em] text-white/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Studio Kern — a demo build</p>
          <p>Designed &amp; built by Milan Verlić</p>
        </div>
      </footer>
    </div>
  );
}
