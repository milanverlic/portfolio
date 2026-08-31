'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { SectionDivider } from './SectionDivider';
import { useLanguage } from '@/context/LanguageContext';
import { SCROLL_SPRING, useScrollMotion } from '@/lib/scroll';

/**
 * A numbered index rather than icon cards. Rows separated by hairlines read as
 * a documented process; four boxes with icons read as a template.
 *
 * Client component only because the copy comes from the language context. The
 * markup and motion are otherwise identical to the server version it replaced.
 */
export function Process() {
  const { t } = useLanguage();
  const scrollMotion = useScrollMotion();
  const listRef = useRef<HTMLOListElement>(null);

  // Progress across the step list only — not the whole section — so the line is
  // empty at the first step and full at the last, rather than already half
  // drawn by the time the heading has scrolled past.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  });
  const fillProgress = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <section id="process" className="relative scroll-mt-24 py-section lg:py-section-lg">
      <SectionDivider />
      <div className="mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <SectionHeading
          index="02"
          eyebrow={t.process.eyebrow}
          title={
            <>
              {t.process.titleLead}
              <br className="hidden sm:block" /> {t.process.titleMid}{' '}
              <span className="text-accent">{t.process.titleAccent}</span>
            </>
          }
          lead={t.process.lead}
        />

        {/* The rail sits in the gutter left of the index column, so it reads as
            a timeline running alongside the steps rather than a border on them.
            Hidden below md, where there is no gutter to put it in. */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-6 top-0 hidden h-full w-px bg-line md:block lg:-left-8"
          >
            <motion.div
              className="h-full w-full origin-top bg-accent shadow-[0_0_12px_var(--accent)]"
              style={{ scaleY: scrollMotion ? fillProgress : 1 }}
            />
          </div>

          <ol ref={listRef} className="border-t border-line">
            {t.process.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.06}>
              <div className="group relative grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-line py-8 md:py-10">
                {/* An accent rule draws along the row's own baseline instead of
                    the row tinting its background. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[-1px] h-px origin-right scale-x-0 bg-accent transition-transform duration-[600ms] ease-crisp group-hover:origin-left group-hover:scale-x-100"
                />

                <span className="tnum col-span-2 font-display text-eyebrow md:col-span-1">
                  <span className="roll">
                    <span className="text-dim">0{i + 1}</span>
                    <span className="text-accent">0{i + 1}</span>
                  </span>
                </span>

                <h3 className="col-span-10 font-display text-h3 font-bold uppercase text-fg md:col-span-4">
                  <span className="inline-block transition-transform duration-[600ms] ease-crisp group-hover:translate-x-1.5">
                    {step.title}
                  </span>
                </h3>

                <p className="col-span-12 max-w-measure text-[0.9375rem] leading-relaxed text-muted transition-colors duration-500 ease-crisp group-hover:text-fg md:col-span-5">
                  {step.body}
                </p>

                <span className="col-span-12 text-eyebrow uppercase text-dim md:col-span-2 md:text-right">
                  {step.meta}
                </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
