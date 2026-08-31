'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Pointer-tracked lighting for a surface.
 *
 * Writes the cursor position into `--mx` / `--my` on the element; the visual
 * lives in the `.spotlight` class in globals.css. The effect is that a card
 * appears to catch light as the cursor crosses it, which is the single clearest
 * "this was built, not generated" signal available for the cost.
 *
 * Deliberately narrow:
 *  - Only binds on devices with a real pointer. A touch device has no hover
 *    state to light, and binding pointermove there is wasted work.
 *  - Coalesces to one rAF per frame, so a fast sweep across a grid of cards
 *    schedules one style write per frame rather than one per event.
 *  - Writes a custom property rather than animating a layer, so it never
 *    triggers layout and stays on the compositor.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const next = useRef({ x: 0, y: 0 });

  const flush = useCallback(() => {
    frame.current = 0;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', `${next.current.x}px`);
    el.style.setProperty('--my', `${next.current.y}px`);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      next.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Coarse pointers get the ref but no listener.
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  return {
    ref,
    spotlightProps: fine ? { onPointerMove } : {},
  };
}
