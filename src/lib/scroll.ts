'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion, type SpringOptions } from 'framer-motion';
import { lenisScrollTo } from './lenis';

/**
 * Shared configuration for scroll-linked motion.
 *
 * Every scroll-driven transform in the site runs through these, so the whole
 * page decelerates with one feel rather than each section inventing its own.
 */

/**
 * stiffness 100 / damping 20 is critically damped — the damping ratio works out
 * to exactly 1.0, so the value settles onto its target without overshooting.
 * That matters here: an underdamped spring on a scale transform would push a
 * card past 1.0 and visibly bounce, which reads as a bug rather than as inertia.
 */
export const SCROLL_SPRING: SpringOptions = { stiffness: 100, damping: 20, restDelta: 0.001 };

/** Expo-out. Fast departure, long tail — the mask reveal ease. */
export const MASK_EASE = [0.16, 1, 0.3, 1] as const;
export const MASK_DURATION = 0.9;

/**
 * Scrolls to an in-page section by id.
 *
 * Exists because a bare `#contact` is resolved against the *current path*, and
 * this page does not always live at `/` — opening a demo pushes `/work/<slug>`.
 * There, `#contact` becomes `/work/saas#contact`, which through a Next `<Link>`
 * is a route navigation rather than a scroll, and lands you back in the demo
 * route. `getElementById` does not care what the URL is.
 *
 * Notes on the details:
 *  - `block: 'start'` honours the target's `scroll-margin-top`, so the existing
 *    `scroll-mt-24` on each section still clears the fixed header. Nothing about
 *    the offset work is bypassed here.
 *  - Focus moves to the target so keyboard and screen-reader users end up where
 *    sighted users do; `preventScroll` stops the focus call from jumping
 *    instantly and cancelling the smooth scroll it was meant to accompany.
 *  - `replaceState` keeps the address bar honest without invoking the router.
 *
 * Returns false when the section is not on the page, so callers can fall back
 * to default anchor behaviour rather than swallowing the click.
 */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lenis owns the scroll position when it is running, so a native smooth
  // scroll here would animate the same value from two places at once and
  // visibly fight. lenisScrollTo returns false when Lenis is absent (reduced
  // motion, or before mount), and the native path takes over unchanged.
  //
  // scrollIntoView honours scroll-margin-top; Lenis does not, so the existing
  // scroll-mt-24 on each section is passed explicitly as a negative offset to
  // keep both paths landing in the same place under the fixed header.
  const marginTop = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  if (!lenisScrollTo(el, -marginTop)) {
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  }

  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  (el as HTMLElement).focus({ preventScroll: true });

  window.history.replaceState(null, '', `${window.location.pathname}#${id}`);
  return true;
}

/** Click handler for an in-page anchor. Falls through if the target is absent. */
export function handleSectionClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  // Respect the browser's own affordances: modified clicks should still open
  // a new tab or window rather than being hijacked into a scroll.
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
    return;
  }
  if (!href.startsWith('#')) return;
  if (scrollToSection(href.slice(1))) e.preventDefault();
}

/**
 * Whether scroll-linked motion should be applied.
 *
 * Returns `false` on the server AND on the first client render, then settles to
 * `!prefersReducedMotion` after mount. Both halves of that matter:
 *
 *  - Scroll-linked motion is "Animation from Interactions" (WCAG 2.3.3), and
 *    parallax is a documented nausea trigger, so it has to be genuinely off for
 *    users who ask — not merely faster.
 *  - `useReducedMotion()` alone is not enough to gate it. It reports `false`
 *    during SSR and `true` on a client that wants reduced motion, so branching
 *    styles directly on it emits `scale(0.92)` and `translateY(100%)` from the
 *    server and nothing from the client. React refuses to patch that mismatch
 *    ("this won't be patched up") and elements are left in a mixed state —
 *    which is exactly how the masked headings ended up clipped.
 *
 * Delaying to after mount costs nothing visually: the page is at scroll 0 when
 * it loads, which is where every scroll-linked value starts anyway.
 */
export function useScrollMotion(): boolean {
  const reduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduced;
}
