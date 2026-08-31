import type { Metadata } from 'next';

export const metadata: Metadata = {
  // These exist to be framed by the launcher, not to compete with the portfolio
  // in search results.
  robots: { index: false, follow: false },
};

/**
 * Demo shell. Each demo runs its own colour system, so this deliberately resets
 * away from the Aurora Dark tokens the portfolio uses — the point of the demos
 * is to show range, not to repeat one look four times.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-white text-neutral-900 [color-scheme:light]">{children}</div>;
}
