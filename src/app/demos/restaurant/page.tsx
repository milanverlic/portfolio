import { Playfair_Display } from 'next/font/google';
import { RestaurantClient } from './RestaurantClient';

// Loaded only on this route, so the portfolio's own bundle never pays for it.
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

/**
 * Server Component wrapper. The font is resolved here and the interactive parts
 * stay in the client child — "push Client Components down" from the Next.js
 * stack guidance.
 */
export default function RestaurantDemo() {
  return (
    <div className={playfair.className} style={{ ['--font-serif' as string]: playfair.style.fontFamily }}>
      <style>{`.font-serif { font-family: ${playfair.style.fontFamily}, Georgia, serif; }`}</style>
      <RestaurantClient />
    </div>
  );
}
