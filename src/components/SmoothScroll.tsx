'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { setLenis } from '@/lib/lenis';

/**
 * Global smooth scrolling for mouse wheel, via Lenis.
 *
 * Wheel only, deliberately:
 *
 *  - `syncTouch: false` leaves touch on the platform's own scrolling. Phone and
 *    trackpad scrolling is already tuned by the OS, with rubber-banding and
 *    momentum people recognise; re-implementing it in JS makes it feel worse,
 *    not better, and costs a frame of latency on every drag.
 *  - Keyboard is untouched. Lenis never binds key handlers, and because it
 *    drives the real window scroll position (rather than transforming a
 *    wrapper), Space / PageDown / arrows / Home / End and sequential focus
 *    scrolling all behave exactly as the browser intends.
 *
 * Nothing renders here — children pass through untouched — so there is no
 * wrapper element to interfere with layout, `position: fixed`, or scroll
 * containers.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    // Hijacking the wheel is itself motion. Someone who asked the OS for less
    // of it gets the browser's native scrolling, untouched.
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      // Expo-out. Matches the [0.16, 1, 0.3, 1] curve the reveals use, so a
      // wheel flick and a section fade decelerate with the same character.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      // We drive the loop ourselves below rather than letting Lenis own it.
      autoRaf: false,
    });

    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
