import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { DEMO_SLUGS } from '@/lib/demos';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, priority: 1 },
    ...DEMO_SLUGS.map((slug) => ({
      url: `${SITE.url}/work/${slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...DEMO_SLUGS.map((slug) => ({
      url: `${SITE.url}/demos/${slug}`,
      lastModified: now,
      priority: 0.5,
    })),
  ];
}
