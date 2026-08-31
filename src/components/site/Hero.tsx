'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { Backdrop } from './Backdrop';
import { LinkButton } from '@/components/ui/Button';
import { SITE } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { makeHeroTransition, STAGGER_STEP } from '@/lib/motion';
import { handleSectionClick, useScrollMotion } from '@/lib/scroll';

/**
 * Two purpose-built heroes, not one hero shrunk.
 *
 * The desktop headline's longest token, "High-Performance", measures 17.885 ×
 * font-size. On a 375px screen that caps the type at ~23px — a display line so
 * small it stops being a display line. Phones therefore get their own copy,
 * whose longest token is "Perform" (7 chars), which fits the same column at
 * ~39px. Same promise, written for the width it has to live in.
 *
 * The full sentence is carried by the visually-hidden <h1>, so assistive tech
 * gets the complete headline regardless of which variant is painted.
 */


/**
 * One line of the headline, tinting only the FINAL WORD of the final line.
 *
 * Word, not line: the English desktop headline ends "Web Applications", and
 * colouring both words would put a two-word block of accent at the bottom of
 * the hero. Splitting on the last space keeps the emphasis on "Applications"
 * while the single-word endings in the other three variants ("Perform",
 * "performansi", "sajtovi") fall out of the same code path.
 *
 * This replaced a cyan "/" prefix, which read as a separator cutting into the
 * word rather than as punctuation.
 */
function HeadlineLine({ line, isLast }: { line: string; isLast: boolean }) {
  if (!isLast) return <>{line}</>;

  const words = line.trim().split(/\s+/);
  const last = words.pop() ?? line;
  const head = words.join(' ');

  return (
    <>
      {head && (
        <>
          {head}
          {' '}
        </>
      )}
      <span className="text-accent">{last}</span>
    </>
  );
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLanguage();
  // Both arrays are length-sensitive: the hero clamps in tailwind.config.ts are
  // measured against their longest token. See the note in content/translations.
  const desktopLines = t.hero.linesDesktop;
  const mobileLines = t.hero.linesMobile;

  const scrollMotion = useScrollMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Scroll progress across the hero's own height: 0 at rest, 1 once the section
   * has fully left the top of the viewport.
   *
   * Hooks cannot be conditional, so these always run; the values are swapped
   * for constants under reduced motion further down. Parallax is a documented
   * nausea trigger and scroll-linked movement falls under WCAG 2.3.3, so it has
   * to be genuinely off rather than merely faster.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Driven straight off scroll position, deliberately un-sprung. A spring here
  // would keep animating after the scroll stops, so the headline and the grid
  // would drift a beat behind the finger — parallax that "swims". Springs are
  // right for the cards, where the value is a discrete target to settle onto;
  // they are wrong for a value the user is scrubbing directly.
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  // The grid travels slower than the content, which is what reads as depth.
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const item = (i: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: makeHeroTransition(reduced, i * STAGGER_STEP),
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Oversized so translating it down cannot expose an empty strip at the
          top of the section. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[15%] h-[130%]"
        style={{ y: scrollMotion ? backdropY : 0 }}
      >
        <Backdrop fade="radial" />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-wide flex-1 flex-col justify-center px-6 py-12 sm:py-20 md:px-10 lg:px-16">
        {/* ---- Status meta -------------------------------------------------
            Phone: two stacked rows so nothing has to be dropped for width.
            Desktop: a single rule-bordered row. */}
        <motion.div
          {...item(0)}
          className="mb-8 flex flex-col gap-2 border-b border-line pb-4 text-eyebrow uppercase text-muted sm:mb-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3 sm:pb-5"
        >
          <span className="flex items-center gap-2.5 text-fg">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
            {t.hero.available}
          </span>
          <span className="flex items-center gap-x-6">
            <span>{t.hero.location}</span>
            <span className="sm:ml-auto">
              {new Date().getFullYear()} — {t.hero.independent}
            </span>
          </span>
        </motion.div>

        {/* ---- Headline ----------------------------------------------------
            Scales down and fades as the hero leaves, so the work grid arrives
            over a receding headline rather than colliding with a static one.
            `transformOrigin: left` keeps the lines anchored to the gutter
            instead of drifting inward as they shrink. */}
        <motion.h1
          className="font-display font-bold uppercase [overflow-wrap:break-word]"
          style={{
            scale: scrollMotion ? headlineScale : 1,
            opacity: scrollMotion ? headlineOpacity : 1,
            transformOrigin: 'left top',
          }}
        >
          <span className="sr-only">
            {SITE.name} — {t.hero.headline}
          </span>

          {/* Phone headline */}
          <span aria-hidden="true" className="block text-hero-sm sm:hidden">
            {mobileLines.map((line, i) => (
              <motion.span key={line} {...item(i + 1)} className="block">
                <HeadlineLine line={line} isLast={i === mobileLines.length - 1} />
              </motion.span>
            ))}
          </span>

          {/* Desktop headline */}
          <span aria-hidden="true" className="hidden text-mega sm:block">
            {desktopLines.map((line, i) => (
              <motion.span key={line} {...item(i + 1)} className="block">
                <HeadlineLine line={line} isLast={i === desktopLines.length - 1} />
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* ---- Lead + CTAs -------------------------------------------------
            Phone: shorter lead, full-width stacked buttons sized for thumbs.
            Desktop: measure-capped lead beside right-aligned buttons. */}
        <div className="mt-10 grid gap-7 border-t border-line pt-7 sm:mt-14 sm:gap-10 sm:pt-8 md:grid-cols-12">
          <motion.p
            {...item(5)}
            className="max-w-measure text-[0.95rem] leading-relaxed text-muted sm:text-lead md:col-span-7"
          >
            <span className="sm:hidden">{t.hero.leadMobile}</span>
            <span className="hidden sm:inline">{t.hero.leadDesktop}</span>
          </motion.p>

          <motion.div
            {...item(6)}
            className="flex flex-col gap-2.5 sm:flex-row md:col-span-5 md:justify-end"
          >
            <LinkButton href="#work" className="w-full sm:w-auto">
              {t.hero.ctaPrimary}
            </LinkButton>
            <LinkButton href="#contact" variant="secondary" className="w-full sm:w-auto">
              {t.hero.ctaSecondary}
            </LinkButton>
          </motion.div>
        </div>
      </div>

      <motion.div {...item(7)} className="relative border-t border-line">
        <div className="mx-auto flex max-w-wide items-center justify-between px-6 py-4 text-eyebrow uppercase text-muted sm:py-5 md:px-10 lg:px-16">
          <span>{t.hero.buildsCount}</span>
          <a
            href="#work"
            onClick={(e) => handleSectionClick(e, '#work')}
            className="group inline-flex min-h-[44px] items-center gap-2.5 text-fg transition-colors duration-300 ease-crisp hover:text-accent"
          >
            <span className="hidden xs:inline">{t.hero.scrollToWork}</span>
            <span className="xs:hidden">{t.hero.scrollShort}</span>
            <ArrowRight
              size={13}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 ease-crisp group-hover:translate-x-1"
            />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
