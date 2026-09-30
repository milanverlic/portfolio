'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  SECTION_VIEWPORT,
  fadeInitial,
  fadeTarget,
  makeFadeTransition,
  type FadeDirection,
} from '@/lib/motion';

type Props = {
  children: ReactNode;
  /** Seconds before this element starts. Used to stagger siblings. */
  delay?: number;
  /** Direction of travel. 'up' (default) starts 40px below and rises. */
  direction?: FadeDirection;
  className?: string;
  /**
   * Rendered element. Needed because several call sites reveal list items and
   * articles — wrapping an <li> in a <div> would break the list semantics that
   * screen readers rely on to announce "list, 4 items".
   */
  as?: 'div' | 'section' | 'li' | 'article';
};

/**
 * Scroll reveal: fades and slides in once, when the element enters view.
 *
 * The single reveal primitive for the site. Everything that arrives on scroll
 * goes through here, so the page has one rhythm rather than each section
 * inventing its own timing.
 *
 * On reduced motion the markup is identical and only the duration drops to 0,
 * so the element appears instantly in its final state. Branching the markup
 * instead would emit different HTML on server and client, and React refuses to
 * patch that mismatch — leaving content stranded at opacity: 0. The long note
 * at the top of lib/motion.ts has the full story.
 */
export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
  as = 'div',
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={fadeInitial(direction)}
      whileInView={fadeTarget}
      viewport={SECTION_VIEWPORT}
      transition={makeFadeTransition(reduced, delay)}
    >
      {children}
    </MotionTag>
  );
}
