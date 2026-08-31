'use client';

import { useEffect, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { SITE } from '@/lib/constants';
import { LinkButton } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { handleSectionClick } from '@/lib/scroll';

export function Nav() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Labels come from the dictionary; hrefs are anchors and never translate.
  const links = [
    { href: '#work', label: t.nav.work },
    { href: '#process', label: t.nav.process },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-nav border-b transition-colors duration-300 ease-crisp ${
        scrolled ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent'
      }`}
      style={{ height: 'var(--nav-h)' }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-wide items-center justify-between px-6 md:px-10 lg:px-16"
      >
        <a
          href="#top"
          onClick={(e) => handleSectionClick(e, '#top')}
          className="font-display text-[0.9375rem] font-bold uppercase tracking-[-0.02em] text-fg"
        >
          {SITE.name}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="draw-line group inline-flex min-h-[44px] items-center gap-2 text-eyebrow uppercase text-muted transition-colors duration-300 ease-crisp hover:text-accent"
              >
                <span className="tnum text-dim transition-colors duration-300 ease-crisp group-hover:text-accent">
                  0{i + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <LinkButton
            href="#contact"
            variant="secondary"
            arrow={false}
            className="!min-h-[42px] !px-5 !text-[0.6875rem]"
          >
            {t.nav.cta}
          </LinkButton>
        </div>

        {/* Phone: the switcher stays in the bar rather than hiding in the sheet —
            language is the one control a visitor may need before anything else. */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="-mr-2 grid h-11 w-11 place-items-center text-fg"
          >
            {open ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-bg md:hidden">
          <ul className="px-6 py-2">
            {links.map((link, i) => (
              <li key={link.href} className="border-b border-line last:border-0">
                <a
                  href={link.href}
                  onClick={(e) => {
                    handleSectionClick(e, link.href);
                    setOpen(false);
                  }}
                  className="flex min-h-[56px] items-center gap-3 font-display text-lg font-bold uppercase tracking-tight text-fg"
                >
                  <span className="tnum text-eyebrow text-dim">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6 pb-6 pt-3">
            <LinkButton href="#contact" className="w-full">
              {t.nav.cta}
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
