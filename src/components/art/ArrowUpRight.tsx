import { cx } from "@/components/ui/cx";

type ArrowUpRightProps = {
  /** Rendered width and height in px. Default 20. */
  size?: number;
  /** Colour (e.g. "text-teal") and layout; the arrow strokes in currentColor. */
  className?: string;
};

/**
 * A thick, round-capped up-right arrow for links that leave the site. Inside a `group` link it
 * flies out of its box to the top right and back in from the bottom left on hover or keyboard
 * focus (motion-safe only; the `arrow-fly` keyframes live in globals.css). The box clips it.
 */
export function ArrowUpRight({ size = 20, className }: ArrowUpRightProps) {
  return (
    <span aria-hidden="true" className={cx("inline-flex shrink-0 overflow-hidden", className)}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        focusable="false"
        className="block motion-safe:group-hover:animate-arrow-fly motion-safe:group-focus-visible:animate-arrow-fly"
      >
        <path
          d="M5 19 19 5M8 5h11v11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
