'use client';

import { useSpotlight } from '@/lib/useSpotlight';

/**
 * Bento tile that catches light from the cursor.
 *
 * Client component purely because pointer tracking needs a listener — the
 * surrounding About section stays server-rendered. The numeral rolls on hover
 * using the same `.roll` mechanism as the process index, so the two sections
 * feel like they were built by the same hand.
 */
export function TraitCard({ n, label, value }: { n: string; label: string; value: string }) {
  const { ref, spotlightProps } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      {...spotlightProps}
      className="bento bento-interactive spotlight group h-full overflow-hidden p-7"
    >
      <span className="tnum block font-display text-eyebrow">
        <span className="roll">
          <span className="text-dim">{n}</span>
          <span className="text-accent">{n}</span>
        </span>
      </span>

      <h3 className="mt-6 font-display text-[1.0625rem] font-bold uppercase tracking-[-0.01em] text-fg">
        {label}
      </h3>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-muted transition-colors duration-500 ease-crisp group-hover:text-fg">
        {value}
      </p>

      {/* Corner tick that extends on hover — a small mechanical detail that
          rewards looking closely without asking for attention. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-accent opacity-0 transition-all duration-[500ms] ease-crisp group-hover:h-8 group-hover:w-8 group-hover:opacity-60"
      />
    </div>
  );
}
