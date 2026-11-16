import type { ReactNode } from "react";
import { cx } from "./cx";

type Cut = "a" | "b" | "c";
type Tone = "cream" | "teal" | "sage-soft";

type PaperCardProps = {
  cut: Cut;
  tone?: Tone;
  /** Adds the flat navy second layer, offset down and right by --layer-offset. */
  layer?: boolean;
  as?: "div" | "li" | "article";
  className?: string;
  children: ReactNode;
};

// Static class names so Tailwind can see them.
const cuts: Record<Cut, string> = {
  a: "cut-a",
  b: "cut-b",
  c: "cut-c",
};

const tones: Record<Tone, string> = {
  cream: "bg-cream text-navy",
  teal: "bg-teal text-cream",
  "sage-soft": "bg-sage-soft text-navy",
};

/**
 * A sheet of cut paper. The root is unclipped and carries `className` (layout only: grid/flex
 * placement, margin, width, self-alignment). Inside it, an optional navy layer and the clipped
 * face, which holds the children in a column with padding. With `layer`, the root reserves
 * --layer-offset on the right and bottom so the layer never overflows. The root sets
 * data-surface, so focus rings and numerals inside pick the right colour for the face.
 * Do not put a focusable element directly on the clipped edge: keep links inside the padding.
 */
export function PaperCard({ cut, tone = "cream", layer = false, as: Root = "div", className, children }: PaperCardProps) {
  return (
    <Root
      data-surface={tone === "teal" ? "dark" : "light"}
      className={cx("relative flex min-w-0 flex-col", layer && "pr-(--layer-offset) pb-(--layer-offset)", className)}
    >
      {layer ? (
        <span
          aria-hidden="true"
          className={cx("absolute top-(--layer-offset) left-(--layer-offset) right-0 bottom-0 bg-navy", cuts[cut])}
        />
      ) : null}
      <div className={cx("relative flex flex-1 flex-col gap-3 px-6 pt-8 pb-9 sm:px-7", cuts[cut], tones[tone])}>
        {children}
      </div>
    </Root>
  );
}
