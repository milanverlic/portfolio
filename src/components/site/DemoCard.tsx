'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { Demo } from '@/lib/demos';
import { makeStaggerChild } from '@/lib/motion';
import { SCROLL_SPRING, useScrollMotion } from '@/lib/scroll';
import { DemoPreview } from './DemoPreview';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Card text is deliberately four things: sector, title, tagline, CTA. The
 * detail lives in the overlay, where there is room for it.
 *
 * Two separate motion systems here, on two separate elements, on purpose:
 *
 *  - The OUTER element owns scroll-linked scale. As the card climbs toward the
 *    viewport centre it settles from 0.92 to 1.0 through a critically damped
 *    spring, so a fast scroll carries a little inertia without overshooting.
 *  - The INNER button keeps `.bento-interactive`, which owns the hover lift and
 *    border in CSS.
 *
 * They are split because both would otherwise write `transform`, and a Framer
 * inline style beats a class — putting the scroll scale on the button would
 * silently kill the shared hover contract. The scroll-driven border colour is
 * handed over as a CSS custom property rather than `borderColor` for the same
 * reason: a `:hover` rule can still override a variable, but never an inline
 * style.
 */
export function DemoCard({
  demo,
  index,
  onOpen,
  className = '',
}: {
  demo: Demo;
  index: number;
  onOpen: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t, fill } = useLanguage();
  const copy = t.demos[demo.slug];

  const scrollMotion = useScrollMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // 0 when the card's top touches the bottom of the viewport, 1 once its centre
  // reaches the centre of the viewport — so a card is "resolved" exactly when
  // it is the thing you are looking at.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const smooth = useSpring(scrollYProgress, SCROLL_SPRING);
  const scale = useTransform(smooth, [0, 1], [0.92, 1]);
  const borderColor = useTransform(
    smooth,
    [0, 1],
    ['rgba(255,255,255,0.08)', 'rgba(0,240,255,0.4)']
  );

  return (
    <motion.article
      ref={cardRef}
      variants={makeStaggerChild(reduced)}
      className={className}
      style={{ scale: scrollMotion ? scale : 1 }}
    >
      <motion.div
        className="h-full"
        style={{ ['--card-border' as string]: scrollMotion ? borderColor : 'var(--line)' }}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label={fill(t.work.launchAria, { title: demo.title, tagline: copy.tagline })}
          className="bento bento-interactive group flex h-full w-full flex-col overflow-hidden text-left"
        >
          <DemoPreview demo={demo} />

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-center justify-between text-eyebrow uppercase">
              <span className="text-muted">{copy.sector}</span>
              <span className="tnum text-dim">0{index + 1}</span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-h3 font-bold uppercase text-fg">{demo.title}</h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{copy.tagline}</p>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-dim transition-transform duration-300 ease-crisp group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
              >
                <ArrowUpRight size={24} weight="bold" />
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2.5 border-t border-line pt-4 text-eyebrow uppercase text-fg transition-colors duration-300 ease-crisp group-hover:text-accent">
              {t.work.launch}
              <span
                aria-hidden="true"
                className="h-px w-6 bg-current transition-[width] duration-300 ease-crisp group-hover:w-10"
              />
            </div>
          </div>
        </button>
      </motion.div>
    </motion.article>
  );
}
