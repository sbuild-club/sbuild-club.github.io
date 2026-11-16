// An isometric keycap as in the banner: steel top, teal-mid front skirt, teal side, thin cream
// edges, and an optional mint letter lying on the top face in perspective. The letter is the
// wordmark's own traced glyph, so keys and logo share one hand. Props and root element are
// frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";
import { matrixAttr, type Matrix } from "./wordmarkArc";
import { toPointsAttr, wordmarkPaths, type WordmarkChar } from "./wordmarkPaths";

type KeycapProps = {
  /** Mint letter on the top face. Omit for a blank key. */
  letter?: WordmarkChar;
  /** Rendered width in px; height follows the 120×96 viewBox. Default 120. */
  size?: number;
  /** Layout, size and transform classes only (e.g. a static rotate class). */
  className?: string;
};

// Top face corners (traced from the banner's big key): left, back, right; the front corner is
// 81,51 (see the polygons below).
const L = [21, 30] as const;
const BK = [58, 3] as const;
const R = [107, 21] as const;

// Letter space: u runs along the front edge (back→right), v runs from the back edge toward the
// viewer (back→left). A glyph fitted into the middle of the unit square maps onto the face.
const face: Matrix = [R[0] - BK[0], R[1] - BK[1], L[0] - BK[0], L[1] - BK[1], BK[0], BK[1]];
const uLen = Math.hypot(face[0], face[1]);
const vLen = Math.hypot(face[2], face[3]);

function glyphTransform(char: WordmarkChar): { points: string; transform: string } {
  const letter = wordmarkPaths.letters.find((l) => l.char === char) ?? wordmarkPaths.letters[0];
  const xs = letter.points.map((p) => p[0]);
  const ys = letter.points.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0;
  const h = Math.max(...ys) - y0;
  // Glyph height = 72% of the face depth; width keeps the glyph's true proportions on the face.
  const sv = 0.72 / h;
  const su = (sv * vLen) / uLen;
  const u0 = 0.5 - (w * su) / 2;
  const v0 = 0.5 - (h * sv) / 2;
  const fit: Matrix = [su, 0, 0, sv, u0 - x0 * su, v0 - y0 * sv];
  const m: Matrix = [
    face[0] * fit[0] + face[2] * fit[1],
    face[1] * fit[0] + face[3] * fit[1],
    face[0] * fit[2] + face[2] * fit[3],
    face[1] * fit[2] + face[3] * fit[3],
    face[0] * fit[4] + face[2] * fit[5] + face[4],
    face[1] * fit[4] + face[3] * fit[5] + face[5],
  ];
  return { points: toPointsAttr(letter.points), transform: matrixAttr(m) };
}

const glyphs = new Map(wordmarkPaths.letters.map((l) => [l.char, glyphTransform(l.char)]));

export function Keycap({ letter, size = 120, className }: KeycapProps) {
  const glyph = letter ? glyphs.get(letter) : undefined;

  return (
    <svg
      viewBox="0 0 120 96"
      width={size}
      height={(size * 96) / 120}
      aria-hidden="true"
      focusable="false"
      className={cx("block", className)}
    >
      {/* front skirt, side, top */}
      <polygon points="21,30 81,51 78,93 3,65" className="fill-teal-mid" />
      <polygon points="81,51 107,21 118,48 78,93" className="fill-teal" />
      <polygon points="21,30 58,3 107,21 81,51" className="fill-steel" />
      <path
        d="M21 30 L81 51 L107 21 M81 51 L78 93"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-cream"
      />
      {glyph ? <polygon points={glyph.points} transform={glyph.transform} fillRule="evenodd" className="fill-mint" /> : null}
    </svg>
  );
}
