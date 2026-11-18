type ArrowUpRightProps = {
  /** Rendered width and height in px. Default 20. */
  size?: number;
  /** Colour (e.g. "text-teal") and layout; the arrow strokes in currentColor. */
  className?: string;
};

/** A thick, round-capped up-right arrow marking links that leave the site. Static. */
export function ArrowUpRight({ size = 20, className }: ArrowUpRightProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
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
  );
}
