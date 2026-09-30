'use client';

import { setLenisActive } from './lenis';
import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Traps Tab inside `ref` while `active`, and restores focus to whatever was
 * focused before the dialog opened (escape-routes / focus-management).
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const target =
        node.querySelector<HTMLElement>('[data-autofocus]') ??
        node.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    };
    // Wait a frame so the element is painted and focusable.
    const raf = requestAnimationFrame(focusFirst);
    // Belt and braces: if the first attempt lands mid-transition, retry once.
    const retry = window.setTimeout(() => {
      if (!node.contains(document.activeElement)) focusFirst();
    }, 80);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el.tagName === 'IFRAME'
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(retry);
      node.removeEventListener('keydown', onKeyDown);
      // Only pull focus back if it is still inside the trap. Without this guard
      // React's dev-mode effect double-invoke (mount → cleanup → mount) yanks
      // focus to the body before the real mount can place it, and in production
      // it would steal focus the user had already moved somewhere else.
      if (node.contains(document.activeElement)) {
        previouslyFocused?.focus?.();
      }
    };
  }, [ref, active]);
}

/** Locks body scroll without the layout jump from a disappearing scrollbar. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    // Lenis keeps animating against a page that can no longer move, so its
    // internal position drifts from the real one and the page jumps when the
    // lock lifts. Pausing keeps the two in agreement.
    setLenisActive(false);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      setLenisActive(true);
    };
  }, [active]);
}
