// Full-viewport CRT scanline overlay. The `scanlines` utility (globals.css) keeps it ≤6% opacity.
export function Scanlines() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] scanlines" />;
}
