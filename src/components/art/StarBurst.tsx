// A navy spiky star burst: eleven uneven points cut in one piece, as on the round logo.
// Props and root element are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type StarBurstProps = {
  /** Rendered width and height in px (square 100×100 viewBox). Default 96. */
  size?: number;
  /** Layout, size and transform classes only. */
  className?: string;
};

export function StarBurst({ size = 96, className }: StarBurstProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cx("block", className)}
    >
      <polygon
        points="47,1 57,30 78,8 72,36 99,30 76,50 97,68 68,64 74,97 54,72 36,95 36,68 6,82 25,56 1,44 30,38 14,12 41,27"
        className="fill-navy"
      />
    </svg>
  );
}
