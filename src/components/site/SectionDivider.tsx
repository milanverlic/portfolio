/**
 * Section boundary treatment: a gradient hairline, a pair of technical
 * crosshairs, and an ambient light leak.
 *
 * Replaces `border-t border-line`. A flat 1px border reads as a CSS default;
 * a line that fades in from nothing, is pinned by engineering marks at the
 * content edges, and sits under a faint bloom reads as drawn on purpose.
 *
 * Server component — no state, no listeners, nothing to hydrate. Everything is
 * static paint, so it costs nothing per frame and there is no motion to gate
 * behind `prefers-reduced-motion`.
 */
export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 ${className}`}>
      {/*
        Ambient leak. Centred on the boundary and pulled half above it so the
        bloom straddles the seam rather than sitting under one side. Kept at
        5% accent — enough to break the flat black, faint enough that it never
        competes with content or shifts text contrast.
      */}
      <div className="absolute left-1/2 top-0 h-32 w-96 max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />

      {/* The line itself: transparent at the edges, accent through the middle. */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Crosshairs sit on the content gutter, so they line up with the grid
          the rest of the page is built on rather than floating at the viewport
          edge. */}
      <div className="relative mx-auto max-w-wide px-6 md:px-10 lg:px-16">
        <Crosshair className="left-6 md:left-10 lg:left-16" />
        <Crosshair className="right-6 md:right-10 lg:right-16" />
      </div>
    </div>
  );
}

/** A small technical '+' marking a structural intersection. */
export function Crosshair({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-0 block h-[9px] w-[9px] -translate-y-1/2 ${className}`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent/50" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent/50" />
    </span>
  );
}
