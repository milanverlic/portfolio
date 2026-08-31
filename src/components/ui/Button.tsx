'use client';

import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { externalLinkProps } from '@/lib/constants';
import { handleSectionClick } from '@/lib/scroll';

type Variant = 'primary' | 'secondary' | 'ghost';

/**
 * Sharp-cornered, hairline-bordered controls.
 *
 * The tactile part is a wipe: a background layer scales in from the left on
 * hover while the label inverts. It animates `transform` and `color` only, so
 * it composites cleanly and never shifts layout — the button's box is
 * identical in every state.
 */
const base =
  'group relative inline-flex min-h-[52px] items-center justify-center gap-2.5 overflow-hidden ' +
  'px-7 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] font-display ' +
  'transition-colors duration-300 ease-crisp active:translate-y-px ' +
  'disabled:opacity-40 disabled:pointer-events-none';

const variants: Record<Variant, { shell: string; wipe: string; label: string }> = {
  primary: {
    shell: 'bg-accent text-on-accent border border-accent hover:text-accent',
    wipe: 'bg-bg',
    label: '',
  },
  secondary: {
    shell: 'border border-line text-fg hover:border-fg hover:text-on-accent',
    wipe: 'bg-fg',
    label: '',
  },
  ghost: {
    shell: 'text-muted hover:text-fg !px-3 !min-h-[44px]',
    wipe: 'bg-transparent',
    label: '',
  },
};

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      {variant !== 'ghost' && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-crisp group-hover:scale-x-100 ${variants[variant].wipe}`}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </>
  );
}

type ButtonProps = { variant?: Variant; children: ReactNode } & ComponentPropsWithoutRef<'button'>;

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant].shell} ${className}`} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

type LinkButtonProps = {
  variant?: Variant;
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  /** Adds a diagonal arrow that translates on hover. */
  arrow?: boolean;
};

export function LinkButton({
  variant = 'primary',
  href,
  children,
  external,
  className = '',
  arrow = true,
}: LinkButtonProps) {
  const cls = `${base} ${variants[variant].shell} ${className}`;
  const content = (
    <Inner variant={variant}>
      {children}
      {arrow && (
        <ArrowUpRight
          size={15}
          weight="bold"
          aria-hidden="true"
          className="transition-transform duration-300 ease-crisp group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      )}
    </Inner>
  );

  // `external` opts out of the Next router, which a `mailto:`/`tel:` also needs
  // — but only an http(s) destination should open in a new tab. Passing
  // `external` with a mailto used to mean both, which would leave an empty tab
  // behind once the mail client took over.
  if (external) {
    return (
      <a href={href} {...externalLinkProps(href)} className={cls}>
        {content}
      </a>
    );
  }

  // In-page anchors get a plain <a> and an explicit scroll, never a Next
  // <Link>. A hash href is resolved against the current path, and this page is
  // served at /work/<slug> as well as /, where `#contact` becomes a route
  // navigation instead of a scroll. Staying an anchor (rather than a <button>)
  // keeps link semantics, middle-click, and a working target without JS.
  if (href.startsWith('#')) {
    return (
      <a href={href} onClick={(e) => handleSectionClick(e, href)} className={cls}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
