export const SITE = {
  name: 'Milan Verlić',
  role: 'Web Developer',
  headline: 'Crafting Modern High-Performance Web Applications',
  email: 'verlicmilan786@gmail.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://my-portfolio.vercel.app',
  description:
    'Milan Verlić builds fast, accessible, modern web applications. Explore four fully interactive live demos — no signup, one click.',
} as const;

/** Drop your real URLs into .env.local; these are the fallbacks. */
export const SOCIALS = [
  { label: 'GitHub', href: process.env.NEXT_PUBLIC_GITHUB_URL ?? 'https://github.com' },
  { label: 'LinkedIn', href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://linkedin.com' },
] as const;

/**
 * Gmail's compose view, pre-addressed to SITE.email.
 *
 * Built from SITE.email rather than hardcoded so the address lives in exactly
 * one place. The value is percent-encoded: `@` becomes `%40`, which Gmail reads
 * identically, and it keeps the link correct if the address ever gains a `+`
 * tag — a raw `+` in a query string is decoded as a space.
 *
 * Note this is a web link, not a protocol handler: it opens Gmail in the
 * browser rather than handing off to whatever mail client the visitor uses.
 */
/**
 * Formspree endpoint. Called straight from the browser — that is Formspree's
 * primary documented pattern, and a form id is public by design (it ships in
 * the HTML of every Formspree form). Nothing secret is exposed by this.
 */
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maeyqkqa';

export const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  SITE.email
)}`;

/**
 * True only for links that leave the site over http(s).
 *
 * `target="_blank"` belongs on those and nowhere else. A `mailto:` (or `tel:`)
 * opened in a new tab leaves an empty browser tab behind after the handler
 * fires — and on a machine where Windows routes `mailto:` back to the browser
 * itself, that empty tab is *all* you get.
 *
 * Encoded as a predicate rather than trusted to reviewers: the anchors that
 * matter today are already correct, so the only real risk is a future `mailto:`
 * being dropped into SOCIALS or passed to LinkButton and silently inheriting
 * the wrong attributes.
 */
export function isExternalHttpLink(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

/** Spreadable anchor props: new-tab attributes for http(s), nothing otherwise. */
export function externalLinkProps(href: string) {
  return isExternalHttpLink(href)
    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
    : {};
}

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;
