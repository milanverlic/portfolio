'use client';

import type Lenis from 'lenis';

/**
 * Module-level handle on the single Lenis instance.
 *
 * Lenis takes over the wheel, so anything that scrolls programmatically has to
 * go through it rather than around it. `scrollIntoView({ behavior: 'smooth' })`
 * and `lenis.scrollTo()` both animate the same scroll position, and running
 * them together produces a visible tug-of-war. The registry exists so
 * lib/scroll.ts and the overlay's scroll lock can reach the instance without
 * importing the provider component (which would drag React into a plain
 * module, and risk a cycle).
 *
 * Every helper degrades to native behaviour when there is no instance — which
 * is the normal case for reduced-motion users, where Lenis is never started.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scrolls to an element through Lenis when it is running, otherwise natively.
 * Returns false when Lenis is not handling it, so the caller can fall back.
 */
export function lenisScrollTo(target: HTMLElement, offset = 0): boolean {
  if (!instance) return false;
  instance.scrollTo(target, { offset });
  return true;
}

/**
 * Pauses/resumes Lenis. Used with the overlay's body-scroll lock: `overflow:
 * hidden` stops the browser scrolling, but Lenis keeps running its own loop
 * against a page that can no longer move, so the position it thinks it is at
 * drifts from reality and the page jumps when the overlay closes.
 */
export function setLenisActive(active: boolean) {
  if (!instance) return;
  if (active) instance.start();
  else instance.stop();
}
