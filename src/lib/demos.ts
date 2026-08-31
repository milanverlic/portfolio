export type DemoSlug = 'saas' | 'restaurant' | 'ecommerce' | 'agency';

/** Palette a card preview paints itself in — mirrors the demo's own system. */
export type PreviewTheme = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  onAccent: string;
  /** Serif for the hospitality demo, sans everywhere else. */
  serif?: boolean;
};

export type Demo = {
  slug: DemoSlug;
  title: string;
  tagline: string;
  /** Shown in the overlay chrome, not on the card. */
  summary: string;
  sector: string;
  /** Shown in the browser chrome on the card preview and in the overlay frame. */
  displayUrl: string;
  stack: string[];
  highlights: string[];
  /** Card hover glow. */
  glow: string;
  /** Drives the miniature interface reproduction on the card. */
  preview: PreviewTheme;
  /**
   * Optional real capture. Drop a file in /public/previews and set this — the
   * card renders it instead of the reproduction, no component change needed.
   * See README "Swapping in real screenshots".
   */
  previewImage?: string;
};

export const DEMOS: Demo[] = [
  {
    slug: 'saas',
    title: 'Northwind',
    tagline: 'SaaS product landing',
    summary:
      'Conversion-shaped landing page: value prop, feature grid, three-tier pricing with an annual toggle, and social proof.',
    sector: 'B2B SaaS',
    displayUrl: 'northwind.app',
    preview: { bg: '#F8FAFC', surface: '#FFFFFF', ink: '#0F172A', muted: '#94A3B8', accent: '#6366F1', onAccent: '#FFFFFF' },
    stack: ['Pricing toggle', 'Feature grid', 'Testimonials', 'FAQ'],
    highlights: [
      'Interactive monthly / annual pricing switch',
      'Comparison-ready three-tier layout',
      'Trust strip with logos and metrics',
    ],
    glow: '#818CF8',
  },
  {
    slug: 'restaurant',
    title: 'Olive & Ember',
    tagline: 'Restaurant & reservations',
    summary:
      'Warm, image-led hospitality site with a filterable menu, hours, location, and a working reservation form.',
    sector: 'Hospitality',
    displayUrl: 'oliveandember.si',
    preview: { bg: '#1A120B', surface: '#241810', ink: '#FDF6EC', muted: '#A98C6B', accent: '#D97706', onAccent: '#1A120B', serif: true },
    stack: ['Menu filter', 'Reservation form', 'Hours', 'Gallery'],
    highlights: [
      'Category-filtered menu with live counts',
      'Reservation form with party size and time',
      'Editorial serif treatment, warm palette',
    ],
    glow: '#F59E0B',
  },
  {
    slug: 'ecommerce',
    title: 'Form Supply',
    tagline: 'E-commerce storefront',
    summary:
      'Product grid with working filters and sort, plus a slide-over cart that tracks quantity and subtotal in real time.',
    sector: 'Retail',
    displayUrl: 'formsupply.co',
    preview: { bg: '#F9FAFB', surface: '#FFFFFF', ink: '#064E3B', muted: '#9CA3AF', accent: '#10B981', onAccent: '#FFFFFF' },
    stack: ['Filters', 'Sort', 'Cart drawer', 'Subtotal'],
    highlights: [
      'Client-side category filter and price sort',
      'Add-to-cart with live quantity and subtotal',
      'Empty, loading, and populated cart states',
    ],
    glow: '#34D399',
  },
  {
    slug: 'agency',
    title: 'Studio Kern',
    tagline: 'Creative studio',
    summary:
      'High-contrast editorial layout: oversized type, a project index with hover detail, capabilities, and an awards strip.',
    sector: 'Creative',
    displayUrl: 'studiokern.com',
    preview: { bg: '#0A0A0A', surface: '#141414', ink: '#FAFAFA', muted: '#6B6B6B', accent: '#FF4D00', onAccent: '#0A0A0A' },
    stack: ['Editorial grid', 'Project index', 'Capabilities', 'Awards'],
    highlights: [
      'Oversized clamp() display typography',
      'Row-based project index with hover reveal',
      'Deliberately stark counterpoint to this site',
    ],
    glow: '#FF6B2C',
  },
];

export const DEMO_SLUGS = DEMOS.map((d) => d.slug);

export function getDemo(slug: string): Demo | undefined {
  return DEMOS.find((d) => d.slug === slug);
}

export const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: 1280, height: 800 },
  { id: 'tablet', label: 'Tablet', width: 768, height: 1024 },
  { id: 'mobile', label: 'Mobile', width: 375, height: 812 },
] as const;

export type DeviceId = (typeof DEVICES)[number]['id'];
