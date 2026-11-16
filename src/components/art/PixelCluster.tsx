// STUB (foundation). Replaced by the art lane: a small cluster of steel pixel squares, quiet
// filler for empty corners. Props and root element are frozen (docs/CONTRACT.md §2).
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
          <rect key={i} x={x} y={y} width="18" height="18" />
        ))}
      </g>
    </svg>
  );
}
