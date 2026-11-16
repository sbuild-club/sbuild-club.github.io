import type { ReactNode } from "react";
import { cx } from "./cx";

type Tilt = -4 | -3 | -2 | 2 | 3 | 4;
type Tone = "teal" | "sage" | "cream" | "mint";

type StickerProps = {
  children: ReactNode;
  tilt?: Tilt;
  tone?: Tone;
  className?: string;
};

// Static class names so Tailwind can see them.
const tilts: Record<Tilt, string> = {
  [-4]: "-rotate-4",
  [-3]: "-rotate-3",
  [-2]: "-rotate-2",
  2: "rotate-2",
  3: "rotate-3",
  4: "rotate-4",
};

const faces: Record<Tone, string> = {
  teal: "bg-teal text-cream",
  sage: "bg-sage text-navy",
  cream: "bg-cream text-navy",
  mint: "bg-mint text-navy",
};

const layers: Record<Tone, string> = {
  teal: "bg-navy",
  sage: "bg-steel",
  cream: "bg-navy",
  mint: "bg-teal",
};

/**
 * A slapped-on paper slip: tilted, cut outline, flat second layer. Not interactive by itself;
 * wrap it in a link when it should act as one. `className` is for layout only.
 */
export function Sticker({ children, tilt = 3, tone = "teal", className }: StickerProps) {
  return (
    <span
      className={cx(
        "relative inline-flex max-w-full pr-(--layer-offset) pb-(--layer-offset) align-middle",
        tilts[tilt],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx("absolute top-(--layer-offset) left-(--layer-offset) right-0 bottom-0 cut-tag-a", layers[tone])}
      />
      <span
        className={cx(
          "relative inline-flex items-center gap-1.5 px-4 py-2 font-label text-[15px] leading-[1.2] font-semibold tracking-[0.06em] cut-tag-a",
          faces[tone],
        )}
      >
        {children}
      </span>
    </span>
  );
}
