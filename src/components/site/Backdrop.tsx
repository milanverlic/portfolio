/**
 * Static texture layer: a fine 1px grid plus film grain.
 *
 * Replaces the blurred colour mesh. Both layers are static — no animation, no
 * blur, no compositing cost — so there is nothing to pause on tab-hide and
 * nothing that can drop frames on a mid-range phone. The grid is masked so it
 * dissolves rather than stopping at a hard edge.
 *
 * Server Component: it holds no state and never needs to hydrate.
 */
export function Backdrop({
  className = '',
  fade = 'radial',
}: {
  className?: string;
  fade?: 'radial' | 'bottom' | 'none';
}) {
  const maskClass =
    fade === 'radial' ? 'mask-fade-radial' : fade === 'bottom' ? 'mask-fade-b' : '';

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className={`bg-grid absolute inset-0 ${maskClass}`} />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
