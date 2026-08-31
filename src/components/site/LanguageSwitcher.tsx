'use client';

import { LOCALES, LOCALE_LABELS } from '@/content/translations';
import { useLanguage } from '@/context/LanguageContext';

/**
 * EN | SR segmented control.
 *
 * Two real buttons rather than one toggle, so the current language is announced
 * via `aria-pressed` and either option can be reached directly — a toggle would
 * force a screen reader user to guess what it switches to.
 *
 * The active state is a sliding accent block behind the labels: `transform`
 * only, so it composites and never reflows the nav.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const activeIndex = LOCALES.indexOf(locale);

  return (
    <div
      role="group"
      aria-label={t.nav.switchLanguage}
      className={`relative inline-flex items-center border border-line ${className}`}
    >
      {/* Sliding indicator, sized to one half of the control. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 bg-accent transition-transform duration-[420ms] ease-crisp"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            lang={code}
            className={`relative z-10 flex min-h-[36px] min-w-[42px] items-center justify-center px-2 font-display text-eyebrow uppercase transition-colors duration-300 ease-crisp ${
              active ? 'text-on-accent' : 'text-muted hover:text-accent'
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
