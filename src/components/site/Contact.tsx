'use client';

import { FadeIn } from '@/components/FadeIn';
import { SectionHeading } from './SectionHeading';
import { SectionDivider } from './SectionDivider';
import { ContactForm } from './ContactForm';
import { GMAIL_COMPOSE, SITE, SOCIALS, externalLinkProps } from '@/lib/constants';
import { SpotlightPanel } from '@/components/ui/SpotlightPanel';
import { useLanguage } from '@/context/LanguageContext';

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative scroll-mt-24 py-section lg:py-section-lg">
      <SectionDivider />
      <div className="mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <SectionHeading
          index="04"
          eyebrow={t.contact.eyebrow}
          title={
            <>
              {t.contact.titleLead}
              <br className="hidden sm:block" /> {t.contact.titleMid}{' '}
              <span className="text-accent">{t.contact.titleAccent}</span>
            </>
          }
          lead={t.contact.lead}
        />

        <div className="grid gap-4 lg:grid-cols-12">
          <FadeIn className="lg:col-span-7">
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-5">
            <div className="grid h-full gap-4">
              <SpotlightPanel className="p-7">
                <span className="text-eyebrow uppercase text-dim">{t.contact.directLabel}</span>
                <a
                  href={GMAIL_COMPOSE}
                  {...externalLinkProps(GMAIL_COMPOSE)}
                  className="draw-line mt-5 inline-flex min-h-[44px] items-center break-all font-display text-[clamp(1rem,1.6vw,1.35rem)] font-bold uppercase tracking-[-0.02em] text-fg transition-colors duration-300 ease-crisp hover:text-accent"
                >
                  {SITE.email}
                </a>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {t.contact.directBody}
                </p>
              </SpotlightPanel>

              <SpotlightPanel className="p-7">
                <span className="text-eyebrow uppercase text-dim">{t.contact.nextLabel}</span>
                <ol className="mt-5 border-t border-line">
                  {t.contact.nextSteps.map((item, i) => (
                    <li
                      key={item}
                      className="flex gap-5 border-b border-line py-4 text-[0.9375rem] leading-relaxed text-muted last:border-0"
                    >
                      <span aria-hidden="true" className="tnum shrink-0 text-eyebrow text-dim">
                        0{i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </SpotlightPanel>

              <SpotlightPanel className="p-7">
                <span className="text-eyebrow uppercase text-dim">{t.contact.elsewhereLabel}</span>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-1">
                  {/* Named group: the panel is also a `group`, so an unnamed
                      group-hover would fire anywhere inside the panel. */}
                  {SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...externalLinkProps(social.href)}
                        className="group/link inline-flex min-h-[44px] items-center gap-2.5 font-display text-eyebrow uppercase text-fg transition-colors duration-300 ease-crisp hover:text-accent"
                      >
                        {social.label}
                        <span
                          aria-hidden="true"
                          className="h-px w-4 bg-current transition-[width] duration-[420ms] ease-crisp group-hover/link:w-7"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </SpotlightPanel>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
