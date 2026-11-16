// The round SBUILD logo: a cream disc with two sage-soft stitch rings, the arced wordmark across
// the top, a mint idea bulb in the middle, lettered keycaps, navy stars and steel pixel chips
// scattered round it, a diagonal sage-soft band behind, and the beaver filling the bottom.
// Below 96px the finest details (bulb rays, pixel chips, keycap letters, the inner ring) are left
// out, and below 64px also the bulb, keycaps and stars, so the header mark stays clean: word,
// beaver, ring. Props and root element are frozen (docs/CONTRACT.md §2).
import { useId } from "react";
import { cx } from "@/components/ui/cx";
import { Beaver } from "./Beaver";
import { Keycap } from "./Keycap";
import { Lightbulb } from "./Lightbulb";
import { PixelCluster } from "./PixelCluster";
import { StarBurst } from "./StarBurst";
import { arcMatrices, matrixAttr } from "./wordmarkArc";
import { toPointsAttr, wordmarkPaths, type WordmarkFill } from "./wordmarkPaths";

type BadgeProps = {
  /** Rendered width and height in px. Default 52. */
  size?: number;
  /** Accessible name. Without it the svg is aria-hidden. */
  title?: string;
  /** Layout, size and transform classes only. */
  className?: string;
};

// Static class names so Tailwind can see them.
const fills: Record<WordmarkFill, string> = {
  navy: "fill-navy",
  steel: "fill-steel",
};

/** Sizes (px) from which the finer details are drawn. */
const FULL_FROM = 96;
const MEDIUM_FROM = 64;

// The wordmark bent round the top of the disc. Full and medium: its middle runs on a radius of
// 30.5 and the word spans about 110 degrees. Small: bigger letters on a slightly wider arc, since
// nothing else sits under them.
const arcFull = arcMatrices(50, 50, 30.5, 0.057).map(matrixAttr);
const arcSmall = arcMatrices(50, 51, 29, 0.066).map(matrixAttr);
const letterPoints = wordmarkPaths.letters.map((letter) => toPointsAttr(letter.points));

export function Badge({ size = 52, title, className }: BadgeProps) {
  const id = useId();
  const discClip = `${id}-disc`;
  const bandClip = `${id}-band`;
  const full = size >= FULL_FROM;
  const medium = size >= MEDIUM_FROM;
  const arc = medium ? arcFull : arcSmall;
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" className={cx("block", className)} {...a11y}>
      <defs>
        <clipPath id={discClip}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <clipPath id={bandClip}>
          <circle cx="50" cy="50" r="45" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="50" className="fill-cream" />
      {/* diagonal band behind everything, rising to the right */}
      <polygon points="-4,78 104,32 104,54 -4,99" clipPath={`url(#${bandClip})`} className="fill-sage-soft" />

      {/* idea bulb in the middle, under the word */}
      {full ? (
        <g transform="translate(36 32)">
          <Lightbulb rays size={28} />
        </g>
      ) : medium ? (
        <g transform="translate(45 34)">
          <Lightbulb size={10} />
        </g>
      ) : null}

      {medium ? (
        <>
          {/* keycaps: S and B on the left, U on the right */}
          <g transform="translate(8 47) rotate(-14 8 6.5)">
            <Keycap letter={full ? "S" : undefined} size={16} />
          </g>
          <g transform="translate(15 63) rotate(10 6 5)">
            <Keycap letter={full ? "B" : undefined} size={12} />
          </g>
          <g transform="translate(76 50) rotate(16 8 6.5)">
            <Keycap letter={full ? "U" : undefined} size={16} />
          </g>
          {/* navy stars: right, and lower left */}
          <g transform="translate(79 33) rotate(12 5 5)">
            <StarBurst size={10} />
          </g>
          <g transform="translate(8 62) rotate(-18 3.5 3.5)">
            <StarBurst size={7} />
          </g>
        </>
      ) : null}

      {/* steel pixel chips */}
      {full ? (
        <>
          <g transform="translate(17 40)">
            <PixelCluster pattern="tee" size={6} />
          </g>
          <g transform="translate(79 69)">
            <PixelCluster pattern="row" size={7} />
          </g>
        </>
      ) : null}

      {/* the beaver fills the bottom; its body runs on to the disc's edge */}
      <g clipPath={`url(#${discClip})`}>
        {medium ? (
          <>
            <rect x="26.5" y="92" width="47.5" height="10" className="fill-bark" />
            <g transform="translate(26 55)">
              <Beaver size={48} blink={false} />
            </g>
          </>
        ) : (
          <>
            <rect x="22" y="94" width="56" height="8" className="fill-bark" />
            <g transform="translate(22 49)">
              <Beaver size={56} blink={false} />
            </g>
          </>
        )}
      </g>

      {/* arced wordmark across the top */}
      {wordmarkPaths.letters.map((letter, i) => (
        <polygon
          key={i}
          points={letterPoints[i]}
          transform={arc[i]}
          fillRule="evenodd"
          className={fills[letter.fill]}
        />
      ))}

      {/* stitch rings just inside the edge */}
      <circle
        cx="50"
        cy="50"
        r="47"
        strokeWidth={full ? 1.6 : 2.4}
        strokeDasharray={full ? "4.6 3" : "5.5 3.6"}
        strokeLinecap="round"
        className="fill-none stroke-sage-soft"
      />
      {full ? (
        <circle
          cx="50"
          cy="50"
          r="43.6"
          strokeWidth="1.6"
          strokeDasharray="4.6 3"
          strokeLinecap="round"
          className="fill-none stroke-sage-soft"
        />
      ) : null}
    </svg>
  );
}
