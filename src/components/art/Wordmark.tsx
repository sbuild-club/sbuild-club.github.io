// The SBUILD wordmark: six cut-paper letters traced from the banner (navy S, steel BUILD), with
// an optional navy cap on the S and an arced variant for the round badge. Props and root element
// are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";
import { arcedWordmark, matrixAttr } from "./wordmarkArc";
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

// The cap, in wordmark units, traced from the banner: the steel brim sticks out to the left over
// the S's shoulder and the navy crown sits on top of it. Its crown reaches 17 units (7.6% of the
// viewBox height) above the top edge.
const capBrim = "18,28 43,17 103,19 46,42 18,39";
const capCrown = "49,-5 70,-17 94,-16 106,-8 112,13 106,20 81,25 55,25 43,21 42,14";

const letterPoints = wordmarkPaths.letters.map((letter) => toPointsAttr(letter.points));
const arcTransforms = arcedWordmark.map(matrixAttr);

export function Wordmark({ variant = "straight", cap = false, title, className }: WordmarkProps) {
  const { width, height } = wordmarkPaths.viewBox;
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  const arced = variant === "arced";

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
        <g key={i} transform={arced ? arcTransforms[i] : undefined}>
          <polygon points={letterPoints[i]} fillRule="evenodd" className={fills[letter.fill]} />
          {cap && i === 0 ? (
            <>
              <polygon points={capBrim} className="fill-steel" />
              <polygon points={capCrown} className="fill-navy" />
            </>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
