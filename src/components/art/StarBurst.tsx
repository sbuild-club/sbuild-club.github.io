// STUB (foundation). Replaced by the art lane: a navy spiky, uneven star burst (second accent
// shape, from the round logo). Props and root element are frozen (docs/CONTRACT.md §2).
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
        points="50,0 58,34 92,18 68,46 100,60 64,64 72,100 48,72 18,94 32,60 0,48 34,42 20,8 46,30"
        className="fill-navy"
      />
    </svg>
  );
}
