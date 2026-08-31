'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SECTION_VIEWPORT, makeRevealTransition, revealInitial, revealTarget } from '@/lib/motion';

type Props = {
  children: ReactNode;
  /** Seconds. Keep cumulative delay small — see MAX_STAGGER_CHILDREN. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
};

/**
 * Scroll reveal, motion.csv #5 (Standard): opacity + y, 400-600ms, power2.out,
 * fires as the element enters the viewport.
 *
 * Markup is identical whether or not reduced motion is on — only the duration
 * changes, dropping to 0 so the final state appears immediately. Branching the
 * markup instead would break hydration; see the note in lib/motion.ts.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: Props) {
  const reduced = useReducedMotion() ?? false;
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={revealInitial}
      whileInView={revealTarget}
      viewport={SECTION_VIEWPORT}
      transition={makeRevealTransition(reduced, delay)}
    >
      {children}
    </MotionTag>
  );
}
