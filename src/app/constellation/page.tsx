import type { Metadata } from 'next';
import ConstellationGrid from '@/components/ui/constellation-grid';

export const metadata: Metadata = {
  title: 'Constellation Grid',
  description: 'Interactive canvas mesh — component preview.',
  // A component preview, not a portfolio page. Keep it out of search results.
  robots: { index: false, follow: false },
};

// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO
export default function DemoOne() {
  return <ConstellationGrid />;
}
