# Milan Verlić — Portfolio

Minimalist high-end portfolio with four fully interactive demo sites you can launch in one click.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind · Framer Motion · Phosphor Icons
**Look:** monolithic near-black (#050505), hairline structure, Syne + Plus Jakarta Sans, one electric-cyan accent

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

---

## Before you deploy — three things

### 1. Your links

```bash
cp .env.local.example .env.local
```

Then fill in:

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG tags, sitemap. Currently the placeholder `https://my-portfolio.vercel.app`. |
| `NEXT_PUBLIC_GITHUB_URL` | Your GitHub profile |
| `NEXT_PUBLIC_LINKEDIN_URL` | Your LinkedIn profile |

Without these the social links fall back to `github.com` / `linkedin.com` bare
domains, so set them before you share the site.

### 2. Contact form delivery (already connected)

The form POSTs straight from the browser to Formspree — no API route, no server
hop. The endpoint is `FORMSPREE_ENDPOINT` in `src/lib/constants.ts`. A Formspree
form id is public by design, so there is no credential to configure and nothing
to set on Vercel.

Each enquiry arrives with Name, Email, Project, Budget and Timeline as discrete
labelled fields plus a formatted summary, and with the sender as reply-to.

Spam is handled by Formspree via the `_gotcha` honeypot: the form ships a hidden
field, and anything that fills it is accepted with a 200 and silently discarded.

Because there is no API route, every page is static or SSG — the site runs on
any static host, with no Node runtime required.

If a send fails, the form surfaces Formspree's own error text (an unconfirmed
form, say, or a monthly limit) and offers a direct email link, rather than
showing a false success.

### 2b. Swapping in real screenshots

The project cards render miniature reproductions of each demo's interface,
built in DOM so they cost no image bytes and never go stale. To use real
captures instead: drop a file in `public/previews/` and set `previewImage` on
that demo in `src/lib/demos.ts`. The card renders the image instead, with no
component change.


### 3. Deploy

Push to GitHub, import at [vercel.com/new](https://vercel.com/new), add the env
vars above. Every route is static or SSG, so it will work on any static-capable
host — there is no server-side runtime to provide.

---

## How the demo launcher works

The centrepiece. Four complete mini-sites live at `/demos/<slug>`, each with its
own colour system to show range.

- Clicking a card opens a full-screen overlay and pushes `/work/<slug>`. That is
  a **real, shareable URL** — send someone `/work/restaurant` and it opens with
  that demo running.
- The iframe mounts **only when the overlay opens** and unmounts on close, so
  the demos cost nothing on first load.
- The device switcher renders the demo at its true width (1280 / 768 / 375) and
  scales the frame to fit, so the demo's own media queries see a real phone
  viewport. Switching does not reload or reset the demo.
- Esc, the close button, the scrim, and browser Back all close it. Focus is
  trapped while open and returns to the card you came from.

### Editing the demos

| Slug | Name | Sector |
|---|---|---|
| `saas` | Northwind | B2B SaaS — pricing toggle, FAQ accordion |
| `restaurant` | Olive & Ember | Hospitality — menu filter, reservation form |
| `ecommerce` | Form Supply | Retail — filters, sort, cart drawer |
| `agency` | Studio Kern | Creative — editorial grid, project index |

Card copy, preview palettes and overlay detail all come from `src/lib/demos.ts` —
edit that one file and the grid, overlay and sitemap all follow. To swap a demo
for real client work later, point the slug at a new route in the same file.

---

## Structure

```
src/
├── app/
│   ├── page.tsx              home
│   ├── work/[slug]/          deep links — renders home with the overlay open
│   ├── demos/<slug>/         the four demo sites
│   └── layout.tsx            fonts, metadata, no-JS fallback
├── components/
│   ├── site/                 page sections + the demo launcher
│   └── ui/                   Reveal, Button, SectionHeading
└── lib/
    ├── demos.ts              demo content — single source of truth
    ├── motion.ts             motion tokens (read the header comment)
    ├── constants.ts          name, email, socials
    └── useFocusTrap.ts       dialog focus trap + scroll lock
```

The design system — colour tokens with verified contrast ratios, type scale,
motion rules and the reasoning behind them — is in
`../design-system/aurora-portfolio/MASTER.md`.

---

## Three things to know before you change the code

All three cost real debugging time. They're documented at length in
`src/lib/motion.ts` and `tailwind.config.ts`, but briefly:

**Reduced motion changes duration, never markup.** `useReducedMotion()` is
`false` on the server and `true` on a client that asks for it, so branching on
it (`reduced ? undefined : {...}`) breaks hydration. And a *disabled* exit
animation never completes, which leaves modals mounted on screen forever. Always
keep the animation; set its duration to `0`.

**The overlay's open state is local, mirrored to the URL.** `usePathname()` does
not re-render on a manual `pushState`, so deriving the open demo from the
pathname means it never closes.

**The hero is two heroes, and both are measured.** Desktop and phone use
different copy, not one headline shrunk: "High-Performance" renders at 17.885 x
font-size in Syne Extrabold, which caps a 375px screen at ~23px. The phone
headline is written so no line exceeds 8 characters, which lifts it to ~34px.
Those ratios set the `mega` / `hero-sm` clamps in `tailwind.config.ts` — change
the headline copy and you must re-measure the longest line, or it wraps.

---

## Accessibility

Verified on the running site, not assumed:

- Every colour pair meets WCAG AA (ratios in `MASTER.md` §2)
- No pointer target under 24×24 CSS px; form controls are 44px+
- Full keyboard path; focus trapped in the overlay and restored on close
- Form errors appear inline **and** in a focusable summary linked to each field
- `prefers-reduced-motion` honoured — durations collapse to 0, animations are never disabled
- Background texture is fully static: nothing animating to pause, no compositing cost
- One `h1`, sequential headings, skip link, decorative icons hidden from AT
