/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

/**
 * Content-Security-Policy.
 *
 * Every asset this site loads is same-origin: `next/font` downloads Geist and
 * Plus Jakarta Sans at build time and serves them from /_next, so there are no
 * Google Fonts hosts to allow. The single outbound destination is Formspree,
 * which the contact form posts to directly from the browser.
 *
 * On 'unsafe-inline' in script-src: Next.js emits inline bootstrap and
 * hydration scripts. Replacing this with a nonce means generating one per
 * request, which requires middleware — and middleware makes every route
 * dynamic, giving up the fully static build. For a site with no auth, no
 * session and no user input rendered back to the page, that trade is not worth
 * it. Revisit if this ever renders untrusted content.
 *
 * style-src needs 'unsafe-inline' regardless: Framer Motion animates via inline
 * style attributes (172 of them on the home page alone).
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // 'self', not 'none': the demo launcher frames /demos/* on the same origin.
  // This supersedes X-Frame-Options in every browser that supports it.
  "frame-ancestors 'self'",
  "frame-src 'self'",
  "form-action 'self' https://formspree.io",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // ws: and the dev origin keep Turbopack's HMR socket alive locally.
  `connect-src 'self' https://formspree.io${isProd ? '' : ' ws: http://localhost:3000'}`,
  "manifest-src 'self'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // Referrer is sent in full to our own origin, origin-only cross-origin over
  // HTTPS, and never downgraded to an insecure destination.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Redundant next to frame-ancestors, kept for older browsers. SAMEORIGIN
  // rather than DENY so the demo iframe keeps working.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Nothing here uses these; deny them outright.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
];

// HSTS is ignored over plain HTTP, so it is pointless on localhost and only
// shipped in production. Deliberately no `preload`: submitting to the preload
// list is effectively irreversible and should be a conscious decision made on a
// domain you intend to keep, not a default.
if (isProd) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  });
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
