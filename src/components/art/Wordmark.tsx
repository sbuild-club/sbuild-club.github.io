// STUB (foundation). Replaced by the art lane: traced letters, the arced variant and the cap.
// Props and root element are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";
import { toPointsAttr, wordmarkPaths, type WordmarkFill } from "./wordmarkPaths";

type WordmarkProps = {
  /** straight = banner wordmark; arced = the curved wordmark of the round badge. Default straight. */
  variant?: "straight" | "arced";
  /** Draws the navy cap on the S. It may extend above the viewBox (the svg has overflow visible). */
  cap?: boolean;
  /** Accessible name. Without it the svg is aria-hidden (the hero h1 supplies visually hidden text). */
  title?: string;
  /** Layout, size and transform classes only. */
  className?: string;
};

// Static class names so Tailwind can see them.
const fills: Record<WordmarkFill, string> = {
  navy: "fill-navy",
  steel: "fill-steel",
};

export function Wordmark({ variant = "straight", cap = false, title, className }: WordmarkProps) {
  const { width, height } = wordmarkPaths.viewBox;
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      focusable="false"
      data-variant={variant}
      className={cx("block h-auto w-full", className)}
      {...a11y}
    >
      {wordmarkPaths.letters.map((letter, i) => (
        <polygon key={i} points={toPointsAttr(letter.points)} fillRule="evenodd" className={fills[letter.fill]} />
      ))}
      {cap ? <polygon points="20,10 60,-40 130,-30 160,10" className="fill-navy" /> : null}
    </svg>
  );
}
