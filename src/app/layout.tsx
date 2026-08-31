import type { Metadata, Viewport } from 'next';
import { Geist, Plus_Jakarta_Sans } from 'next/font/google';
import { SITE } from '@/lib/constants';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

// Geist carries the display weight. Syne was here first and is the reason the
// headlines read as stretched — it is a wide geometric face, so at display size
// every line sprawls and scanning it costs effort. Geist is a normal-width
// grotesque: same impact at weight 700+, far less horizontal travel per word.
//
// Clash Display was the other candidate but ships from Fontshare, not Google,
// so next/font cannot self-host it without vendoring the files.
//
// Variable font, so no weight array — the whole range is available.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.headline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.name} — ${SITE.headline}`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.headline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${jakarta.variable}`}>
      <head>
        {/*
          Framer Motion server-renders its `initial` state as inline styles, so
          every reveal ships as opacity:0. With JS disabled or failing that
          content stays invisible forever. This override only applies when
          scripts are off, so it cannot affect the animated experience.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: '[style*="opacity:0"]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
