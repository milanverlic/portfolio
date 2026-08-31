import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HomePage } from '@/components/site/HomePage';
import { DEMO_SLUGS, getDemo, type DemoSlug } from '@/lib/demos';
import { SITE } from '@/lib/constants';

export function generateStaticParams() {
  return DEMO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) return {};

  const title = `${demo.title} — ${demo.tagline}`;
  return {
    title,
    description: demo.summary,
    alternates: { canonical: `${SITE.url}/work/${demo.slug}` },
    openGraph: { title, description: demo.summary, url: `${SITE.url}/work/${demo.slug}` },
  };
}

/**
 * Deep link into a demo. Renders the identical home page with the overlay
 * already open, so a shared link lands somewhere real rather than on a
 * stranded fragment.
 */
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getDemo(slug)) notFound();
  return <HomePage initialSlug={slug as DemoSlug} />;
}
