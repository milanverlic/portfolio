'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  LOCALES,
  LOCALE_TAGS,
  type Dictionary,
  type Locale,
  interpolate,
  translations,
} from '@/content/translations';

const STORAGE_KEY = 'portfolio.locale';

type LanguageValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggle: () => void;
  /** The full dictionary for the active locale. */
  t: Dictionary;
  /** Interpolating helper: fill('{count} items', { count: 3 }). */
  fill: (template: string, vars: Record<string, string | number>) => string;
  /** False until the stored preference has been read, for hydration-safe UI. */
  ready: boolean;
};

const LanguageContext = createContext<LanguageValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value);
}

/**
 * Holds the active language and persists it to localStorage.
 *
 * State starts at 'en' on both the server and the first client render, then the
 * stored preference is applied in an effect. Reading localStorage during render
 * instead would produce different markup on each side, and React refuses to
 * patch a text mismatch — the same class of bug that broke the reduced-motion
 * branches earlier in this codebase.
 *
 * The cost of doing it correctly is one frame of English for a returning
 * Serbian visitor. `ready` is exposed so UI that would rather not flash (the
 * switcher itself) can wait for it. Eliminating the flash entirely means
 * server-rendering the choice, which needs a cookie rather than localStorage —
 * see the note in README.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady] = useState(false);

  // Apply the stored preference, falling back to the browser's language.
  useEffect(() => {
    let next: Locale = 'en';
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) {
        next = stored;
      } else if (navigator.language?.toLowerCase().startsWith('sr')) {
        next = 'sr';
      }
    } catch {
      // Private mode or storage disabled — English is a fine default.
    }
    setLocaleState(next);
    setReady(true);
  }, []);

  // Keep <html lang> honest. Screen readers switch voice on this attribute, so
  // leaving it as "en" while rendering Serbian would be actively harmful.
  useEffect(() => {
    document.documentElement.lang = LOCALE_TAGS[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is a nicety; the switch still works for this session.
    }
  }, []);

  const toggle = useCallback(() => {
    setLocaleState((current) => {
      const next: Locale = current === 'en' ? 'sr' : 'en';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({
      locale,
      setLocale,
      toggle,
      t: translations[locale],
      fill: interpolate,
      ready,
    }),
    [locale, setLocale, toggle, ready]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>.');
  }
  return ctx;
}
