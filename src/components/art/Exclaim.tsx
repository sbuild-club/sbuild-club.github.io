// STUB (foundation). Replaced by the art lane: mint cut-paper exclamation marks for emphasis
// beside a line of text. Props and root element are frozen (docs/CONTRACT.md §2).
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
        <polygon points="8,2 30,0 28,78 18,80" />
        <polygon points="16,90 28,86 34,98 22,106" />
        {count === 2 ? (
          <>
            <polygon points="40,14 58,10 54,74 46,76" />
            <polygon points="46,84 56,80 62,90 52,98" />
          </>
        ) : null}
      </g>
    </svg>
  );
}
