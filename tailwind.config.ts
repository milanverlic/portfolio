import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // Small-phone breakpoint so 320-375px devices get their own decisions
      // instead of inheriting the tablet layout.
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Declared as rgb(channels / <alpha-value>) so opacity modifiers work.
        // `bg-accent/5` on a hex-valued token compiles to rgba(0,0,0,0) — that
        // is how the section dividers ended up invisible. Channel vars live
        // alongside the hex vars in globals.css; keep the two in sync.
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated-rgb) / <alpha-value>)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        fg: 'rgb(var(--fg-rgb) / <alpha-value>)',
        muted: 'rgb(var(--fg-muted-rgb) / <alpha-value>)',
        dim: 'rgb(var(--fg-dim-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'on-accent': 'rgb(var(--on-accent-rgb) / <alpha-value>)',
        danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
        success: 'rgb(var(--success-rgb) / <alpha-value>)',
      },
      fontFamily: {
        // Syne for display — geometric, slightly eccentric, unmistakably editorial.
        display: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        body: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Oversized and tight, but sized to the copy rather than to a round
        // number. `mega` is the md-and-up size.
        //
        // Re-measured for Geist. "High-Performance" renders at 10.33 × font-size
        // here versus 17.885 in Syne — 42% narrower for the same string, which
        // is precisely why the old headline read as stretched. The h1 column is
        // 1137px at 1265px, so the ceiling moved from ~63px to ~110px.
        // 8vw uses that headroom and still keeps every line whole from 768px up.
        mega: ['clamp(2rem, 8vw, 7rem)', { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        // Phone hero, also re-measured for Geist. Its longest lines ("Web Apps",
        // "Built to") run 4.94 × font-size, so the 327px column now tolerates
        // ~66px instead of the ~34px Syne allowed. 15vw takes most of that.
        'hero-sm': ['clamp(2rem, 15vw, 4rem)', { lineHeight: '0.96', letterSpacing: '-0.02em' }],
        display: ['clamp(2.5rem, 7vw, 6.5rem)', { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        h2: ['clamp(2.15rem, 4.6vw, 4rem)', { lineHeight: '0.98', letterSpacing: '-0.022em' }],
        h3: ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
        body: ['1rem', { lineHeight: '1.6' }],
        lead: ['clamp(1.0625rem, 1.4vw, 1.25rem)', { lineHeight: '1.55' }],
      },
      borderRadius: { DEFAULT: '0px', none: '0px', sm: '0px' },
      maxWidth: { measure: '62ch', wide: '1440px' },
      spacing: {
        section: '7rem',
        // Was 13rem. That is the section's own top padding, and after a nav-link
        // jump it is the thing standing between the divider and the heading —
        // it put titles 371px down a 720px viewport. 10rem keeps the rhythm
        // generous while bringing headings meaningfully higher on arrival.
        'section-lg': '10rem',
      },
      zIndex: { sticky: '10', nav: '20', scrim: '40', overlay: '50', toast: '100' },
      transitionTimingFunction: {
        crisp: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
