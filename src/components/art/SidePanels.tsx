// Large angled sage and sage-soft paper panels at the left and/or right edge of a band, as at the
// banner's sides: two overlapping tints, each edge cut with a slight kink. Props and root element
// are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type SidePanelsProps = {
  /** Which edges get panels. Default both. */
  side?: "left" | "right" | "both";
  /** Layout classes only (e.g. a breakpoint `hidden md:block`); the root's own classes stay. */
  className?: string;
};

/**
 * Root: `<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">`.
 * The parent must be `relative isolate`, so -z-10 sits behind its content and above its background.
 */
export function SidePanels({ side = "both", className }: SidePanelsProps) {
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {side !== "right" ? (
        <svg
          viewBox="0 0 300 600"
          preserveAspectRatio="none"
          focusable="false"
          className="absolute inset-y-0 left-0 block h-full w-[16%]"
        >
          {/* soft outer panel: leans in toward the bottom, then kicks back out */}
          <polygon points="0,0 236,0 150,372 214,600 0,600" className="fill-sage-soft" />
          {/* sage inner strip */}
          <polygon points="0,0 132,0 74,318 92,600 0,600" className="fill-sage" />
        </svg>
      ) : null}
      {side !== "left" ? (
        <svg
          viewBox="0 0 300 600"
          preserveAspectRatio="none"
          focusable="false"
          className="absolute inset-y-0 right-0 block h-full w-[16%]"
        >
          <polygon points="300,0 52,0 140,300 108,600 300,600" className="fill-sage-soft" />
          <polygon points="300,0 176,0 238,170 214,600 300,600" className="fill-sage" />
        </svg>
      ) : null}
    </div>
  );
}
