import type { Transition, Variants } from 'framer-motion';

/**
 * Motion tokens ported from the ui-ux-pro-max motion.csv "Standard" tier.
 * GSAP easings mapped to their cubic-bezier equivalents for Framer Motion.
 *
 * IMPORTANT — how reduced motion is handled here.
 *
 * These are all `make*(reduced)` factories rather than plain constants, and
 * every component feeds them `useReducedMotion()` instead of branching on it.
 * That is deliberate, and it fixes two real bugs:
 *
 *  1. Hydration. useReducedMotion() is false during SSR and true on a client
 *     that asks for reduced motion. Branching on it (`reduced ? <a/> : <b/>`)
 *     emits different markup on each side, and React refuses to patch the
 *     mismatch — leaving elements stuck at their server-rendered opacity: 0.
 *
 *  2. Unmounting. When an exit animation is disabled outright, AnimatePresence
 *     never receives its completion callback and the element never unmounts.
 *     A modal closed that way stays on screen forever.
 *
 * So the markup and the animation are always identical; only the duration
 * changes. At zero duration the element snaps straight to its final state,
 * which is exactly what the reduced-motion guidance asks for.
 */
export const ease = [0.22, 1, 0.36, 1] as const; // ~power2.out
export const easeInOut = [0.65, 0, 0.35, 1] as const; // ~power2.inOut

export const dur = {
  hover: 0.25, // motion.csv #2  — 200-300ms
  reveal: 0.5, // motion.csv #5  — 400-600ms
  stagger: 0.4, // motion.csv #8  — 300-450ms
  overlay: 0.5, // motion.csv #11 — 400-600ms
} as const;

/** motion.csv #5 "Don't": never stagger more than ~8 children. */
export const MAX_STAGGER_CHILDREN = 8;
export const STAGGER_STEP = 0.06;

/** exit-faster-than-enter: exits run at ~65% of the enter duration. */
export const exitFactor = 0.65;

/* ---- Standardised scroll reveal ----------------------------------------
 * One variant for every section, heading, bento tile and demo card, so the
 * whole page arrives with a single rhythm instead of each component inventing
 * its own. Used by <Reveal>, the section wrappers and the card grids.
 */
export const SECTION_EASE = [0.21, 0.47, 0.32, 0.98] as const;
export const SECTION_DURATION = 0.5;
export const SECTION_VIEWPORT = { once: true, margin: '-80px' } as const;

export const revealInitial = { opacity: 0, y: 30 } as const;
export const revealTarget = { opacity: 1, y: 0 } as const;

export function makeRevealTransition(reduced: boolean, delay = 0): Transition {
  return {
    duration: reduced ? 0 : SECTION_DURATION,
    delay: reduced ? 0 : delay,
    ease: SECTION_EASE,
  };
}

/** Spread onto any motion element to opt into the standard reveal. */
export function sectionReveal(reduced: boolean, delay = 0) {
  return {
    initial: revealInitial,
    whileInView: revealTarget,
    viewport: SECTION_VIEWPORT,
    transition: makeRevealTransition(reduced, delay),
  };
}

/** Parent for staggered lists — process steps, stat rows, card grids. */
export function makeStaggerParent(reduced: boolean, step = STAGGER_STEP): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : step } },
  };
}

/** Child of makeStaggerParent. Matches the standard reveal exactly. */
export function makeStaggerChild(reduced: boolean): Variants {
  return {
    hidden: revealInitial,
    visible: {
      ...revealTarget,
      transition: { duration: reduced ? 0 : SECTION_DURATION, ease: SECTION_EASE },
    },
  };
}

export function makeHeroTransition(reduced: boolean, delay = 0): Transition {
  return {
    duration: reduced ? 0 : dur.reveal,
    delay: reduced ? 0 : delay,
    ease,
  };
}

export function makeCardVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? 0 : dur.stagger, ease },
    },
  };
}

export function makeStaggerContainer(reduced: boolean, step: number = STAGGER_STEP): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : step } },
  };
}

export function makeOverlayTransition(reduced: boolean): Transition {
  return { duration: reduced ? 0 : dur.overlay, ease: easeInOut };
}

export function makeOverlayExitTransition(reduced: boolean): Transition {
  return { duration: reduced ? 0 : dur.overlay * exitFactor, ease: easeInOut };
}
