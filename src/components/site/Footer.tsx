'use client';

import { ArrowUp } from '@phosphor-icons/react';
import { useLanguage } from '@/context/LanguageContext';
import { GMAIL_COMPOSE, SITE, SOCIALS, externalLinkProps } from '@/lib/constants';
import { handleSectionClick } from '@/lib/scroll';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6">
            <p className="font-display text-[clamp(1.1rem,1.8vw,1.5rem)] font-bold uppercase tracking-[-0.03em] text-fg">
              {SITE.name}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-muted">{t.hero.headline}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-6 md:justify-self-end">
            <ul className="flex flex-wrap gap-x-10 gap-y-1">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...externalLinkProps(social.href)}
                    className="draw-line inline-flex min-h-[44px] items-center text-eyebrow uppercase text-muted transition-colors duration-300 ease-crisp hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={GMAIL_COMPOSE}
                  {...externalLinkProps(GMAIL_COMPOSE)}
                  className="draw-line inline-flex min-h-[44px] items-center text-eyebrow uppercase text-muted transition-colors duration-300 ease-crisp hover:text-accent"
                >
                  {t.footer.email}
                </a>
              </li>
              <li>
                <a
                  href="#top"
                  onClick={(e) => handleSectionClick(e, '#top')}
                  className="group inline-flex min-h-[44px] items-center gap-2.5 text-eyebrow uppercase text-muted transition-colors duration-300 ease-crisp hover:text-accent"
                >
                  <ArrowUp
                    size={13}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-crisp group-hover:-translate-y-1"
                  />
                  {t.footer.backToTop}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-7 text-eyebrow uppercase text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <p>{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
