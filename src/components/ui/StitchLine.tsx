import { cx } from "./cx";

type Tone = "sage-soft" | "cream" | "steel";

type StitchLineProps = {
  /** sage-soft on cream, cream on sage or teal, steel on navy. */
  tone?: Tone;
  className?: string;
};

// Static class names so Tailwind can see them.
const tones: Record<Tone, string> = {
  "sage-soft": "stroke-sage-soft",
  cream: "stroke-cream",
  steel: "stroke-steel",
};

/**
 * A pair of dashed stitch rows (dash 30, gap 14, weight 6, row gap 10: the stitch tokens).
 * Block SVG, full width of its container, 22px tall, decorative. The rows start half a weight in,
 * so the first rounded dash end is not cut off. `className` is for layout only (margin, width).
 */
export function StitchLine({ tone = "sage-soft", className }: StitchLineProps) {
  return (
    <svg aria-hidden="true" focusable="false" className={cx("block h-[22px] w-full shrink-0", className)}>
      <line x1="3" y1="3" x2="100%" y2="3" className={cx("stitch-stroke", tones[tone])} />
      <line x1="3" y1="19" x2="100%" y2="19" className={cx("stitch-stroke", tones[tone])} />
    </svg>
  );
}
