'use client';

import type { DemoSlug } from '@/lib/demos';
import { useLanguage } from '@/context/LanguageContext';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { ProofStrip } from './ProofStrip';
import { DemoShowcase } from './DemoShowcase';
import { Process } from './Process';
import { About } from './About';
import { Contact } from './Contact';
import { Footer } from './Footer';

/**
 * Shared by `/` and `/work/[slug]`. Both render the identical page — the only
 * difference is whether the demo overlay opens on arrival, which keeps deep
 * links shareable without duplicating the layout.
 */
export function HomePage({ initialSlug }: { initialSlug?: DemoSlug }) {
  const { t } = useLanguage();
  return (
    <>
      <a href="#main" className="skip-link">
        {t.a11y.skipToContent}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <ProofStrip />
        <DemoShowcase initialSlug={initialSlug} />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
