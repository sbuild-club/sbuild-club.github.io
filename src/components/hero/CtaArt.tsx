import { Keycap } from "@/components/art/Keycap";
import { Lightbulb } from "@/components/art/Lightbulb";

/**
 * The small keycap and bulb cluster beside the headline and CTAs on wide screens (lg and up),
 * as in the desktop mockup. Decorative; hidden below lg.
 */
export function CtaArt() {
  return (
    <div
      aria-hidden="true"
      className="hidden min-w-0 flex-[1_1_22rem] flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:flex"
    >
      <Keycap letter="S" size={152} className="h-auto w-[9.5rem] -rotate-10" />
      <Lightbulb rays size={200} className="h-auto w-[12.5rem]" />
      <Keycap letter="B" size={120} className="h-auto w-[7.5rem] rotate-14" />
      <Keycap letter="U" size={100} className="h-auto w-[6.25rem] -rotate-22" />
    </div>
  );
}
