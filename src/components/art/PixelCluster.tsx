// A small cluster of steel pixel squares (quiet filler for empty corners), as at the banner's left
// edge: square paper chips on a loose grid, each a hair off square. Props and root element are
// frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

export type PixelClusterPattern = "tee" | "plus" | "row";

type PixelClusterProps = {
  /** tee = three over one (banner, left); plus = five in a cross; row = three in a line. Default tee. */
  pattern?: PixelClusterPattern;
  /** Rendered width in px; height follows the viewBox (62 wide: tee 40, plus 62, row 18 tall). Default 64. */
  size?: number;
  /** Layout, size and transform classes only. */
  className?: string;
};

// 18-unit squares on a 22-unit pitch.
const cells: Record<PixelClusterPattern, ReadonlyArray<readonly [number, number]>> = {
  tee: [
    [0, 0],
    [22, 0],
    [44, 0],
    [22, 22],
  ],
  plus: [
    [22, 0],
    [0, 22],
    [22, 22],
    [44, 22],
    [22, 44],
  ],
  row: [
    [0, 0],
    [22, 0],
    [44, 0],
  ],
};

// Per-chip corner nudges (in units, kept inside the 18-unit cell) so no two chips are identical.
const nudges: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.4, 0, 0, 0.6],
  [0, 0.5, 0.6, 0],
  [0.5, 0.3, 0, 0],
  [0, 0, 0.5, 0.5],
  [0.3, 0.6, 0.2, 0],
];

function chip(x: number, y: number, i: number): string {
  const [a, b, c, d] = nudges[i % nudges.length];
  return `${x + a},${y} ${x + 18},${y + b} ${x + 18 - c},${y + 18} ${x},${y + 18 - d}`;
}

const heights: Record<PixelClusterPattern, number> = { tee: 40, plus: 62, row: 18 };

export function PixelCluster({ pattern = "tee", size = 64, className }: PixelClusterProps) {
  const boxHeight = heights[pattern];

  return (
    <svg
      viewBox={`0 0 62 ${boxHeight}`}
      width={size}
      height={(size * boxHeight) / 62}
      aria-hidden="true"
      focusable="false"
      className={cx("block", className)}
    >
      <g className="fill-steel">
        {cells[pattern].map(([x, y], i) => (
          <polygon key={i} points={chip(x, y, i)} />
        ))}
      </g>
    </svg>
  );
}
