import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-accent">404</p>
        <h1 className="mt-4 font-display text-h2 font-bold uppercase">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-body text-muted">
          The link may be out of date. Everything lives on the home page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[52px] items-center bg-accent px-7 font-display text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-on-accent"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
