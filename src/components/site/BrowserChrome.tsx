/**
 * macOS-style browser chrome.
 *
 * Shared by the card previews and the overlay frame so a demo is framed the
 * same way whether you are scanning the grid or running it full-screen. The
 * traffic lights are deliberately desaturated — full-saturation red/amber/green
 * fights the single-accent palette and is the tell of a stock mockup.
 */
export function BrowserChrome({
  url,
  tone = 'dark',
  compact = false,
}: {
  url: string;
  /** `light` for the two light-themed demo previews. */
  tone?: 'dark' | 'light';
  compact?: boolean;
}) {
  const isLight = tone === 'light';
  const bar = isLight ? '#EFEFF2' : '#141418';
  const edge = isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.08)';
  const field = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const text = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.42)';
  const dot = isLight ? ['#E36B62', '#E0AE4A', '#63BB5B'] : ['#8C4B47', '#8A6A34', '#3F7040'];

  return (
    <div
      className={`flex shrink-0 items-center gap-2 ${compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2.5'}`}
      style={{ background: bar, borderBottom: `1px solid ${edge}` }}
    >
      <div className={`flex ${compact ? 'gap-1' : 'gap-1.5'}`}>
        {dot.map((c) => (
          <span
            key={c}
            className={`rounded-full ${compact ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5'}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <span
        className={`ml-1 flex-1 truncate rounded-[3px] text-center ${
          compact ? 'px-1.5 py-0.5 text-[6px]' : 'px-3 py-1 text-[11px]'
        }`}
        style={{ background: field, color: text }}
      >
        {url}
      </span>
    </div>
  );
}
