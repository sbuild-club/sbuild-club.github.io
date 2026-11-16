// Mint cut-paper exclamation marks, as beside the banner's wordmark: long wedges that taper to the
// bottom, leaning a little, each with a crooked pentagon dot. Props and root element are frozen
// (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type ExclaimProps = {
  /** One or two marks. Default 2. The viewBox is 70×110 for two, 40×110 for one. */
  count?: 1 | 2;
  /** Rendered width in px; height follows the viewBox. Default 52 for two, 30 for one. */
  size?: number;
  /** Layout, size and transform classes only. */
  className?: string;
};

export function Exclaim({ count = 2, size, className }: ExclaimProps) {
  const boxWidth = count === 2 ? 70 : 40;
  const width = size ?? (count === 2 ? 52 : 30);

  return (
    <svg
      viewBox={`0 0 ${boxWidth} 110`}
      width={width}
      height={(width * 110) / boxWidth}
      aria-hidden="true"
      focusable="false"
      className={cx("block", className)}
    >
      <g className="fill-mint">
        {count === 2 ? (
          <>
            {/* shorter mark, leaning left */}
            <polygon points="3,26 19,14 32,80 25,84" />
            <polygon points="22,92 29,87 35,93 31,102 24,102" />
            {/* taller mark, nearly upright */}
            <polygon points="36,1 56,3 61,70 50,71" />
            <polygon points="47,80 56,76 63,82 59,90 50,89" />
          </>
        ) : (
          <>
            <polygon points="8,2 30,4 26,80 15,81" />
            <polygon points="11,91 20,86 28,92 24,102 15,101" />
          </>
        )}
      </g>
    </svg>
  );
}
