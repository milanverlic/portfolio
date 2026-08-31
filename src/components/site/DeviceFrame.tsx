'use client';

import { useEffect, useRef, useState } from 'react';
import { DEVICES, type DeviceId } from '@/lib/demos';
import { BrowserChrome } from './BrowserChrome';

/** Chrome is drawn at natural size above the scaled viewport, so its height is
 *  a constant that must come out of the space available for the demo itself. */
const CHROME_H = 41;

/**
 * Renders the demo iframe at its true device width (1280 / 768 / 375) and
 * scales the whole frame to fit, wrapped in browser chrome so it reads as an
 * embedded product rather than a bare rectangle.
 *
 * Scaling beats resizing the iframe: the demo's own media queries see a real
 * 375px viewport, so what you preview is genuinely what a phone renders.
 *
 * Two-box structure, and it matters. The OUTER box is sized to the *scaled*
 * dimensions plus the chrome; the INNER box keeps its true pixel size, scales
 * from `top left`, and is absolutely positioned.
 *
 * The inner box is out of flow on purpose. In normal flow its unscaled 1280px
 * width becomes the container's max-content size: the wrap's track resolved to
 * 1280px, the explicit width here was ignored (style said 894px, computed
 * resolved to 1280px), and the frame rendered off-screen on a phone — measured
 * at left 467 / right 815 inside a 375px viewport.
 *
 * The iframe is never re-keyed on device change, so switching does not reload
 * the demo or lose its state.
 */
export function DeviceFrame({
  device,
  src,
  title,
  url,
  onLoad,
  loaded,
}: {
  device: DeviceId;
  src: string;
  title: string;
  url: string;
  onLoad: () => void;
  loaded: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const spec = DEVICES.find((d) => d.id === device)!;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      // Chrome occupies real height that the demo cannot use.
      setScale(Math.min(1, width / spec.width, (height - CHROME_H) / spec.height));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [spec.width, spec.height]);

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="relative flex shrink-0 flex-col overflow-hidden border border-line bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] transition-[width,height] duration-[400ms] ease-crisp"
        style={{ width: spec.width * scale, height: spec.height * scale + CHROME_H }}
      >
        <BrowserChrome url={url} />

        <div className="relative min-h-0 flex-1">
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: spec.width, height: spec.height, transform: `scale(${scale})` }}
          >
            {!loaded && (
              <div
                className="shimmer absolute inset-0 z-10 overflow-hidden bg-elevated"
                role="status"
                aria-live="polite"
              >
                <span className="sr-only">Loading {title} demo…</span>
                <div className="space-y-4 p-8">
                  <div className="h-8 w-1/3 bg-white/5" />
                  <div className="h-4 w-2/3 bg-white/5" />
                  <div className="h-4 w-1/2 bg-white/5" />
                  <div className="mt-8 h-40 w-full bg-white/5" />
                </div>
              </div>
            )}
            <iframe
              src={src}
              title={`${title} — live demo`}
              onLoad={onLoad}
              loading="lazy"
              className="h-full w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
