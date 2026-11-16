import { Keycap } from "@/components/art/Keycap";
import { Lightbulb } from "@/components/art/Lightbulb";

/**
 * The small keycap and bulb cluster beside the headline and CTAs, as in the desktop mockup.
 * Decorative. Shown only from xl, where it takes at most 18rem and still leaves the headline
 * column about 860px; below xl it drops out so the headline keeps the full width.
 */
export function CtaArt() {
  return (
    <div
      aria-hidden="true"
      className="hidden min-w-0 flex-[0_1_18rem] flex-wrap items-center justify-center gap-x-6 gap-y-3 xl:flex"
    >
      <Keycap letter="S" size={128} className="h-auto w-32 -rotate-10" />
      <Lightbulb rays size={176} className="h-auto w-44" />
      <Keycap letter="B" size={104} className="h-auto w-26 rotate-14" />
      <Keycap letter="U" size={88} className="h-auto w-22 -rotate-22" />
    </div>
  );
}
