// A mint ray burst: long thin cut-paper wedges around an empty centre, wide at the outside and
// pointed at the middle, of uneven length (as around the banner's bulb). Props and root element
// are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type BurstProps = {
  /** Rendered width and height in px (square 100×100 viewBox). Default 100. */
  size?: number;
  /** Layout, size and transform classes only. */
  className?: string;
};

const rays = [
  "49,30 44,1 56,2",
  "61,34 80,8 88,15",
  "68,46 98,36 99,48",
  "67,58 96,72 90,82",
  "56,68 66,98 54,99",
  "43,67 26,94 17,87",
  "33,56 2,64 1,51",
  "34,42 6,22 13,13",
];

export function Burst({ size = 100, className }: BurstProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cx("block", className)}
    >
      <g className="fill-mint">
        {rays.map((points, i) => (
          <polygon key={i} points={points} />
        ))}
      </g>
    </svg>
  );
}
