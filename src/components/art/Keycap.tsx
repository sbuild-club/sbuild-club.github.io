// STUB (foundation). Replaced by the art lane: isometric keycap with a steel top, teal and
// teal-mid sides, a thin cream edge and an optional mint letter. Props and root element are
// frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";
import type { WordmarkChar } from "./wordmarkPaths";

type KeycapProps = {
  /** Mint letter on the top face. Omit for a blank key. */
  letter?: WordmarkChar;
  /** Rendered width in px; height follows the 120×96 viewBox. Default 120. */
  size?: number;
  /** Layout, size and transform classes only (e.g. a static rotate class). */
  className?: string;
};

export function Keycap({ letter, size = 120, className }: KeycapProps) {
  return (
    <svg
      viewBox="0 0 120 96"
      width={size}
      height={(size * 96) / 120}
      aria-hidden="true"
      focusable="false"
      className={cx("block", className)}
    >
      <polygon points="24,8 92,18 104,44 32,36" className="fill-steel" />
      <polygon points="32,36 104,44 110,86 22,74" className="fill-teal-mid" />
      <polygon points="24,8 32,36 22,74 6,40" className="fill-teal" />
      <path d="M24 8 L32 36 L104 44 M32 36 L22 74" strokeWidth="1.5" className="fill-none stroke-cream" />
      {letter ? (
        <text x="64" y="35" textAnchor="middle" fontSize="18" transform="rotate(8 64 30)" className="fill-mint font-display">
          {letter}
        </text>
      ) : null}
    </svg>
  );
}
