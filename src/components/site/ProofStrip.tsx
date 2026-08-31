'use client';

import { Reveal } from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';

const STATS = [
  { value: '04', label: 'Live interactive demos' },
  { value: '100', suffix: '%', label: 'Keyboard navigable' },
  { value: 'AA', label: 'WCAG contrast, measured' },
  { value: '24', suffix: 'h', label: 'Typical reply time' },
];

const CAPABILITIES = [
  'Next.js',
  'TypeScript',
  'Design systems',
  'Motion',
  'Accessibility',
  'Performance',
  'React',
  'Tailwind',
];

export function ProofStrip() {
  const { t } = useLanguage();
  return (
    <section aria-label={t.proof.heading} className="border-y border-line">
      {/* Stats — divided by hairlines, no fills. */}
      <div className="mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal
              key={t.proof.stats[i]}
              delay={i * 0.06}
              className={`border-line py-10 md:py-14 ${
                i % 2 === 0 ? 'md:border-r' : 'md:border-r'
              } ${i < 2 ? 'border-b md:border-b-0' : ''} ${i % 2 === 0 ? 'border-r' : ''} ${
                i === 3 ? 'md:border-r-0' : ''
              } ${i === 0 ? 'md:pl-0' : 'md:pl-8'}`}
            >
              <dd className="tnum font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-[-0.04em] text-fg">
                {stat.value}
                {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
              </dd>
              <dt className="mt-4 max-w-[22ch] text-[0.8125rem] leading-snug text-muted">
                {t.proof.stats[i]}
              </dt>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* Capability ticker — pauses on hover, static under reduced motion. */}
      <div className="marquee overflow-hidden border-t border-line py-5">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
              {CAPABILITIES.map((cap) => (
                <span
                  key={cap}
                  className="flex items-center gap-10 text-eyebrow uppercase text-muted"
                >
                  {cap}
                  <span className="h-1 w-1 shrink-0 bg-accent" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
