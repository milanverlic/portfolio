'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowSquareOut, DesktopTower, DeviceMobile, DeviceTablet, X } from '@phosphor-icons/react';
import { DEVICES, type DeviceId, type Demo } from '@/lib/demos';
import { makeOverlayExitTransition, makeOverlayTransition } from '@/lib/motion';
import { useFocusTrap, useScrollLock } from '@/lib/useFocusTrap';
import { DeviceFrame } from './DeviceFrame';

const ICONS = {
  desktop: DesktopTower,
  tablet: DeviceTablet,
  mobile: DeviceMobile,
} as const;

/** Opening a 1280px desktop frame on a 375px screen scales it to ~28% — legible
 *  to nobody. Phones start on the phone frame and can switch up from there. */
function defaultDeviceFor(width: number): DeviceId {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function DemoOverlay({ demo, onClose }: { demo: Demo | null; onClose: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<DeviceId>('desktop');
  const [loaded, setLoaded] = useState(false);
  const titleId = useId();
  const open = demo !== null;

  useFocusTrap(panelRef, open);
  useScrollLock(open);

  // Reset per-demo view state, picking the frame that suits the viewport.
  useEffect(() => {
    if (demo) {
      setDevice(defaultDeviceFor(window.innerWidth));
      setLoaded(false);
    }
  }, [demo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Animations always run — under reduced motion their duration is 0 rather
  // than being disabled. A disabled exit never fires AnimatePresence's
  // completion callback, which would leave this dialog mounted after close.
  return (
    <AnimatePresence>
      {demo && (
        <motion.div
          className="fixed inset-0 z-overlay flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: makeOverlayExitTransition(reduced) }}
          transition={makeOverlayTransition(reduced)}
        >
          <button
            type="button"
            aria-label="Close demo"
            onClick={onClose}
            className="absolute inset-0 -z-10 cursor-default bg-[rgba(5,5,5,0.94)]"
            tabIndex={-1}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex h-full flex-col"
            initial={{ y: 24, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.99, transition: makeOverlayExitTransition(reduced) }}
            transition={makeOverlayTransition(reduced)}
          >
            {/* ---- Chrome ----
                Phone: two rows — identity + close, then a full-width segmented
                device control. Desktop: one row. Nothing is dropped for width. */}
            <header className="shrink-0 border-b border-line bg-bg">
              <div className="flex items-center gap-4 px-4 py-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <h2
                    id={titleId}
                    className="truncate font-display text-[0.9375rem] font-bold uppercase tracking-[-0.02em] text-fg"
                  >
                    {demo.title}
                  </h2>
                  <p className="truncate text-eyebrow uppercase text-dim">{demo.tagline}</p>
                </div>

                {/* Desktop-width device control sits inline. */}
                <div
                  role="group"
                  aria-label="Preview at device size"
                  className="hidden items-center border border-line sm:flex"
                >
                  {DEVICES.map((d) => {
                    const Icon = ICONS[d.id];
                    const active = device === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDevice(d.id)}
                        aria-pressed={active}
                        title={`${d.label} — ${d.width}px`}
                        className={`flex min-h-[40px] items-center gap-2 border-r border-line px-3.5 text-eyebrow uppercase transition-colors duration-300 ease-crisp last:border-r-0 ${
                          active ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
                        }`}
                      >
                        <Icon size={15} aria-hidden="true" />
                        <span className="hidden md:inline">{d.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/demos/${demo.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open demo in a new tab"
                    className="grid h-11 w-11 place-items-center border border-line text-muted transition-colors duration-300 ease-crisp hover:border-accent hover:text-accent sm:w-auto sm:gap-2 sm:px-3.5 sm:text-eyebrow sm:uppercase"
                  >
                    <ArrowSquareOut size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">New tab</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    data-autofocus
                    aria-label="Close demo"
                    className="grid h-11 w-11 place-items-center border border-line text-fg transition-colors duration-300 ease-crisp hover:border-danger hover:text-danger"
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Phone device control: full-width segmented row, 48px targets. */}
              <div
                role="group"
                aria-label="Preview at device size"
                className="grid grid-cols-3 border-t border-line sm:hidden"
              >
                {DEVICES.map((d) => {
                  const Icon = ICONS[d.id];
                  const active = device === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDevice(d.id)}
                      aria-pressed={active}
                      className={`flex min-h-[48px] items-center justify-center gap-2 border-r border-line text-eyebrow uppercase transition-colors duration-300 ease-crisp last:border-r-0 ${
                        active ? 'bg-accent text-on-accent' : 'text-muted'
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" />
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* ---- Live demo ---- */}
            <div className="min-h-0 flex-1 p-2 sm:p-6">
              <DeviceFrame
                device={device}
                src={`/demos/${demo.slug}`}
                title={demo.title}
                url={demo.displayUrl}
                loaded={loaded}
                onLoad={() => setLoaded(true)}
              />
            </div>

            <p className="shrink-0 border-t border-line px-4 py-2.5 text-center text-eyebrow uppercase text-dim sm:px-6 sm:py-3">
              <span className="sm:hidden">Real site — tap and scroll inside it</span>
              <span className="hidden sm:inline">
                This is the real site running in a frame — click, scroll and type in it. Press Esc
                to close.
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
