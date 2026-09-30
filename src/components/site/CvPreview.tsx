'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowsOut, DownloadSimple, X } from '@phosphor-icons/react';
import { useLanguage } from '@/context/LanguageContext';
import { useFocusTrap, useScrollLock } from '@/lib/useFocusTrap';
import { MASK_EASE } from '@/lib/scroll';

const CV_IMAGE = '/cv/cv.webp';
const CV_THUMB = '/cv/cv-thumb.webp';
const CV_PDF = '/cv/Milan-Verlic-CV.pdf';

/** A4. Thumbnail and full view share it, so the morph never distorts. */
const RATIO = 1 / 1.414;
const THUMB_W = 132;
const THUMB_H = Math.round(THUMB_W / RATIO);

/**
 * The CV, as a page you can actually look at rather than a link you have to
 * trust. Click opens it full screen.
 *
 * The open/close is a shared-element transition: the thumbnail and the full
 * view carry the same `layoutId`, so Framer interpolates the real card between
 * the two positions instead of cross-fading two separate elements. Both are A4,
 * so the morph is a pure translate + scale with no aspect distortion.
 *
 * `layoutId` is only attached while closed. Two live elements sharing one id
 * makes Framer pick a winner arbitrarily, and the morph starts from the wrong
 * rectangle.
 */
export function CvPreview() {
  const { t } = useLanguage();
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Duration, never "no animation". A disabled exit never fires
  // AnimatePresence's completion callback and the overlay stays mounted
  // forever — see the note at the top of lib/motion.ts.
  const d = reduced ? 0 : 0.45;
  const morph = { duration: d, ease: MASK_EASE };

  return (
    <>
      <div className="mt-8">
        <p className="mb-3 text-eyebrow uppercase tracking-[0.18em] text-dim">
          {t.footer.cvLabel}
        </p>

        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.footer.cvView}
          aria-haspopup="dialog"
          {...(open ? {} : { layoutId: 'cv-card' })}
          className="group relative block overflow-hidden border border-line bg-white/5 transition-colors duration-300 ease-crisp hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          style={{ width: THUMB_W, height: THUMB_H }}
        >
          <Image
            src={CV_THUMB}
            alt={t.footer.cvAlt}
            width={THUMB_W}
            height={THUMB_H}
            // No `sizes`: the box is a fixed 132px, so letting Next emit a
            // plain 1x/2x srcset beats the 15-candidate responsive set that
            // `sizes` generates for a picture that never changes size.
            quality={90}
            // Dimmed at rest so a white page does not shout inside a near-black
            // footer; full brightness is the reward for pointing at it.
            className="h-full w-full object-cover object-top opacity-60 transition-[opacity,transform] duration-500 ease-crisp group-hover:scale-[1.03] group-hover:opacity-100"
          />

          {/* Scrim + affordance. Fades out on hover so the page underneath
              becomes legible. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-bg via-bg/40 to-transparent p-2 transition-opacity duration-300 ease-crisp group-hover:opacity-0"
          >
            <span className="flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.14em] text-fg">
              <ArrowsOut size={11} weight="bold" />
              {t.footer.cvView}
            </span>
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: d }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.footer.cvClose}
              className="absolute inset-0 cursor-zoom-out bg-bg/90 backdrop-blur-sm"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.footer.cvLabel}
              layoutId="cv-card"
              transition={morph}
              className="relative max-h-full w-auto border border-line-strong shadow-2xl"
              style={{ aspectRatio: '1 / 1.414', height: 'min(92vh, 1100px)' }}
            >
              <Image
                src={CV_IMAGE}
                alt={t.footer.cvAlt}
                fill
                sizes="(max-width: 640px) 92vw, 65vh"
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Controls sit outside the morphing card so they do not scale
                with it during the transition. */}
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: d, delay: reduced ? 0 : 0.15 }}
              className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6"
            >
              <a
                href={CV_PDF}
                download
                className="flex min-h-[44px] items-center gap-2 border border-line bg-bg/80 px-3.5 text-[0.6875rem] uppercase tracking-[0.14em] text-fg backdrop-blur transition-colors duration-300 ease-crisp hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <DownloadSimple size={14} weight="bold" aria-hidden="true" />
                {t.footer.cvDownload}
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.footer.cvClose}
                className="flex h-11 w-11 items-center justify-center border border-line bg-bg/80 text-fg backdrop-blur transition-colors duration-300 ease-crisp hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X size={16} weight="bold" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
