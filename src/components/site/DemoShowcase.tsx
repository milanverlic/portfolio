'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DEMOS, getDemo, type DemoSlug } from '@/lib/demos';
import { SITE } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { SECTION_VIEWPORT, makeStaggerParent } from '@/lib/motion';
import { SectionHeading } from './SectionHeading';
import { SectionDivider } from './SectionDivider';
import { DemoCard } from './DemoCard';
import { DemoOverlay } from './DemoOverlay';

/** Reads a demo slug out of a pathname, or null if it isn't a demo route. */
function slugFromPath(pathname: string): DemoSlug | null {
  const match = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (!match) return null;
  return getDemo(match[1]) ? (match[1] as DemoSlug) : null;
}

/**
 * Owns the demo launcher.
 *
 * Local state drives the overlay and `history.pushState` mirrors it into the
 * address bar, so /work/<slug> stays shareable without a navigation — no server
 * round trip, no remount, scroll position preserved.
 *
 * Deriving the open demo from usePathname() instead looks tidier but does not
 * work: usePathname does not re-render on a manual pushState, so the overlay
 * never closes. State first, URL second.
 */
export function DemoShowcase({ initialSlug }: { initialSlug?: DemoSlug }) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLanguage();
  const [activeSlug, setActiveSlug] = useState<DemoSlug | null>(initialSlug ?? null);

  // True when the visitor landed straight on /work/<slug>.
  const landedDeep = useRef(Boolean(initialSlug));

  const activeDemo = activeSlug ? (getDemo(activeSlug) ?? null) : null;

  const open = useCallback((next: DemoSlug) => {
    setActiveSlug(next);
    window.history.pushState({ demo: next }, '', `/work/${next}`);
  }, []);

  const close = useCallback(() => {
    setActiveSlug(null);
    window.history.pushState({ demo: null }, '', '/');
    // A visitor who arrived on a deep link has never seen the page behind the
    // overlay. Drop them at the work grid rather than the top of the document.
    if (landedDeep.current) {
      landedDeep.current = false;
      requestAnimationFrame(() => {
        document.getElementById('work')?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    }
  }, [reduced]);

  // Back / forward reopens or closes the overlay to match the URL.
  useEffect(() => {
    const onPopState = () => setActiveSlug(slugFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keep the document title meaningful while an overlay is open, and put the
  // site title back on close. Restoring a captured `document.title` instead
  // would be wrong on a deep link, where the captured value is already the
  // demo's own metadata title.
  useEffect(() => {
    if (!activeDemo) return;
    document.title = `${activeDemo.title} — ${activeDemo.tagline} — ${SITE.name}`;
    return () => {
      document.title = `${SITE.name} — ${SITE.headline}`;
    };
  }, [activeDemo]);

  return (
    <section id="work" className="relative scroll-mt-24 py-section lg:py-section-lg">
      <SectionDivider />
      <div className="mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <SectionHeading
          index="01"
          eyebrow={t.work.eyebrow}
          title={
            <>
              {t.work.titleLead}
              <br className="hidden sm:block" /> {t.work.titleMid}{' '}
              <span className="text-accent">{t.work.titleAccent}</span>
            </>
          }
          lead={t.work.lead}
        />

        <motion.div
          variants={makeStaggerParent(reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={SECTION_VIEWPORT}
          className="grid grid-cols-1 gap-4 md:grid-cols-12"
        >
          {DEMOS.map((demo, i) => (
            <DemoCard
              key={demo.slug}
              demo={demo}
              index={i}
              onOpen={() => open(demo.slug)}
              // Asymmetric bento: 7/5 then 5/7 so the grid never reads as a table.
              className={i % 4 === 0 || i % 4 === 3 ? 'md:col-span-7' : 'md:col-span-5'}
            />
          ))}
        </motion.div>
      </div>

      <DemoOverlay demo={activeDemo} onClose={close} />
    </section>
  );
}
