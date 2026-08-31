'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { SECTION_VIEWPORT, ease } from '@/lib/motion';
import { MASK_DURATION, MASK_EASE, useScrollMotion } from '@/lib/scroll';
import { Crosshair } from './SectionDivider';

type Props = {
  /** Two-digit section index, e.g. "01". Sits opposite the eyebrow on the rule. */
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  id?: string;
};

/**
 * Editorial section header: a numbered rule that draws itself in, then an
 * oversized title that rises out of a clipping mask.
 *
 * The mask is the point. Fading a heading in is the default everyone ships;
 * clipping it and sliding it up from its own baseline reads as typesetting,
 * because the letters appear to be revealed by the rule above rather than
 * simply becoming visible.
 *
 * Two details make it work rather than look broken:
 *
 *  - `pb-[0.14em] -mb-[0.14em]` on the mask. `overflow: hidden` clips at the
 *    line box, which cuts the descenders off "g", "y" and "p" — the padding
 *    gives them room and the negative margin takes the space back out of the
 *    layout so the rhythm below is unchanged.
 *  - No manual `will-change`. Framer applies and removes it around the
 *    animation itself; setting it permanently would hold a compositor layer
 *    for every heading on the page long after the reveal has finished.
 */
export function SectionHeading({ index, eyebrow, title, lead, id }: Props) {
  const reduced = useReducedMotion() ?? false;
  const maskMotion = useScrollMotion();

  return (
    <header className="mb-16 md:mb-24">
      <Reveal>
        <div className="relative flex items-center justify-between pb-4 text-eyebrow uppercase">
          <span className="text-muted">{eyebrow}</span>
          <span className="tnum text-dim">{index}</span>

          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: reduced ? 0 : 0.9, ease }}
          />

          {/* Crosshairs pin the rule to the column edges. They fade in with the
              rule rather than sitting there while it draws, so the header
              assembles as one gesture instead of two. */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.5, ease }}
          >
            <Crosshair className="left-0" />
            <Crosshair className="right-0" />
          </motion.span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          {/* Clipping mask — the heading rises through it. */}
          <div className="overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <motion.h2
              id={id}
              className="text-balance font-display text-h2 font-bold uppercase text-fg"
              initial={{ y: maskMotion ? '100%' : '0%' }}
              whileInView={{ y: '0%' }}
              viewport={SECTION_VIEWPORT}
              transition={{ duration: maskMotion ? MASK_DURATION : 0, ease: MASK_EASE }}
            >
              {title}
            </motion.h2>
          </div>
        </div>

        {lead && (
          <Reveal delay={0.12} className="md:col-span-5 md:pt-2">
            <p className="max-w-measure text-body leading-relaxed text-muted">{lead}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
