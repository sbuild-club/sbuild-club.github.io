// STUB (foundation). Replaced by the art lane: a mint ray burst (cut-paper rays around an empty
// centre), used for emphasis. Props and root element are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type BurstProps = {
  /** Rendered width and height in px (square 100×100 viewBox). Default 100. */
  size?: number;
  /** Layout, size and transform classes only. */
  className?: string;
};

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
        <polygon points="46,30 50,0 56,30" />
        <polygon points="70,46 100,44 70,54" />
        <polygon points="54,70 52,100 44,70" />
        <polygon points="30,54 0,52 30,46" />
        <polygon points="64,34 88,10 70,40" />
        <polygon points="36,66 12,90 30,60" />
      </g>
    </svg>
  );
}
