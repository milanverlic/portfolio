'use client';

import type { ReactNode } from 'react';
import { useSpotlight } from '@/lib/useSpotlight';

/**
 * Generic bento surface with pointer-tracked lighting. Keeps the sections that
 * use it server-rendered — only this wrapper ships as client code.
 */
export function SpotlightPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, spotlightProps } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      {...spotlightProps}
      className={`bento spotlight group relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
