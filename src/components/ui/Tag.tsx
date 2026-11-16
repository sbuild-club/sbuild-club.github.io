import type { ReactNode } from "react";
import { cx } from "./cx";

type Tone = "teal" | "navy" | "sage-soft" | "cream";
type Cut = "a" | "b";

type TagProps = {
  children: ReactNode;
  tone?: Tone;
  cut?: Cut;
  className?: string;
};

// Static class names so Tailwind can see them.
const tones: Record<Tone, string> = {
  teal: "bg-teal text-cream",
  navy: "bg-navy text-cream",
  "sage-soft": "bg-sage-soft text-navy",
  cream: "bg-cream text-navy",
};

const cuts: Record<Cut, string> = {
  a: "cut-tag-a",
  b: "cut-tag-b",
};

/**
 * Small cut-paper label (label-tag style). Not interactive. Alternate `cut` between neighbours.
 * Pick a tone that differs from the ground it sits on: cream or sage-soft tags on a cream card would vanish.
 */
export function Tag({ children, tone = "teal", cut = "a", className }: TagProps) {
  return (
    <span
      className={cx(
        "inline-flex max-w-full items-center px-3 py-[5px] font-label text-[13px] leading-[1.2] font-semibold tracking-[0.06em] wrap-anywhere",
        tones[tone],
        cuts[cut],
        className,
      )}
    >
      {children}
    </span>
  );
}
