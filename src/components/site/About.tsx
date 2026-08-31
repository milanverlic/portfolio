'use client';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { SectionDivider } from './SectionDivider';
import { SITE } from '@/lib/constants';
import { TraitCard } from './TraitCard';
import { useLanguage } from '@/context/LanguageContext';

/**
 * The code block's property values stay in English on purpose — they are
 * literal source, and translating identifiers inside a code sample would make
 * it fiction. Only the comment above them is localised.
 */
const CODE_PROPS: [string, string][] = [
  ['  lighthouse', "'90+ across the board',"],
  ['  contrast', "'WCAG AA, measured',"],
  ['  keyboard', "'every control reachable',"],
  ['  motion', "'honours prefers-reduced-motion',"],
  ['  responsive', "'375px to 4K',"],
];

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative scroll-mt-24 py-section lg:py-section-lg">
      <SectionDivider />
      <div className="mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <SectionHeading
          index="03"
          eyebrow={t.about.eyebrow}
          title={
            <>
              {t.about.titleLead}
              <br className="hidden sm:block" /> {t.about.titleMid}{' '}
              <span className="text-accent">{t.about.titleAccent}</span> {t.about.titleTail}
            </>
          }
          lead={t.about.lead}
        />

        <div className="grid gap-4 md:grid-cols-12">
          {/* Statement — the section's anchor, no portrait needed. */}
          <Reveal className="md:col-span-7">
            <div className="bento flex h-full flex-col justify-between p-7 md:p-10">
              <p className="max-w-measure text-balance font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-fg">
                {t.about.statement}
              </p>
              <p className="mt-8 max-w-measure text-[0.9375rem] leading-relaxed text-muted">
                {t.about.body1}
              </p>
              <p className="mt-5 max-w-measure text-[0.9375rem] leading-relaxed text-muted">
                {SITE.name} — {t.about.body2}
              </p>
            </div>
          </Reveal>

          {/* Code block */}
          <Reveal delay={0.06} className="md:col-span-5">
            <div className="bento h-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="font-mono text-eyebrow uppercase text-dim">baseline.ts</span>
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[0.75rem] leading-[2]">
                <code>
                  <span className="block text-dim">{t.about.codeComment}</span>
                  <span className="block">
                    <span className="text-muted">export const</span>
                    <span className="text-fg"> baseline </span>
                    <span className="text-dim">= {'{'}</span>
                  </span>
                  {CODE_PROPS.map(([key, value]) => (
                    <span key={key} className="block">
                      <span className="text-muted">{key}</span>
                      <span className="text-dim">: </span>
                      <span className="text-accent">{value}</span>
                    </span>
                  ))}
                  <span className="block text-dim">{'};'}</span>
                </code>
              </pre>
            </div>
          </Reveal>

          {t.about.traits.map((trait, i) => (
            <Reveal key={trait.label} delay={0.12 + i * 0.06} className="md:col-span-4">
              <TraitCard n={`0${i + 1}`} label={trait.label} value={trait.value} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
