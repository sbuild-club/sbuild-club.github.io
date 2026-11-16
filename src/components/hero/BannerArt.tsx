import { Beaver } from "@/components/art/Beaver";
import { Exclaim } from "@/components/art/Exclaim";
import { Keycap } from "@/components/art/Keycap";
import { Lightbulb } from "@/components/art/Lightbulb";
import { PixelCluster } from "@/components/art/PixelCluster";

/**
 * The banner's scattered paper pieces, laid over the banner box (absolute, inset 0) behind the
 * wordmark and plaque. Positions are percentages of the banner and sizes scale with the viewport
 * (clamped), so the composition keeps the banner's proportions from tablet to wide desktop.
 * Phones keep a reduced set: one keycap and a pixel row bottom left, the beaver bottom right.
 *
 * Every piece sets its width with a `w-*` class plus `h-auto` (the art `size` is only the
 * no-CSS fallback), so the final drawings' aspect ratios are respected whatever they are.
 */
export function BannerArt() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Left: keycaps, pixel clusters and the exclamation marks, as in the banner. */}
      <Keycap
        letter="S"
        size={88}
        className="absolute top-[12%] left-[3%] hidden h-auto w-[clamp(2.75rem,4.6vw,5.5rem)] -rotate-6 sm:block"
      />
      <Keycap
        letter="B"
        size={160}
        className="absolute top-[34%] left-[4%] hidden h-auto w-[clamp(4.25rem,8.4vw,10rem)] -rotate-3 md:block"
      />
      <PixelCluster
        pattern="tee"
        size={80}
        className="absolute top-[58%] left-[1.75%] hidden h-auto w-[clamp(2rem,4.2vw,5rem)] lg:block"
      />
      <Keycap
        letter="U"
        size={136}
        className="absolute bottom-[9%] left-[4%] h-auto w-[clamp(3.25rem,7vw,8.5rem)] rotate-3"
      />
      <Keycap
        size={96}
        className="absolute top-[57%] left-[12%] hidden h-auto w-[clamp(3rem,4.8vw,6rem)] -rotate-6 lg:block"
      />
      <PixelCluster
        pattern="row"
        size={72}
        className="absolute bottom-[10%] left-[22%] h-auto w-[clamp(1.75rem,4vw,4.5rem)] sm:left-[14%] lg:bottom-[9%] lg:left-[13%]"
      />
      <Keycap
        size={84}
        className="absolute bottom-[16%] left-[19.5%] hidden h-auto w-[clamp(2.5rem,4.2vw,5.25rem)] rotate-12 xl:block"
      />
      <Exclaim
        className="absolute top-[11%] left-[11%] hidden h-auto w-[clamp(2.25rem,5.4vw,6.5rem)] -rotate-6 md:block lg:left-[14%]"
      />

      {/* Right: the lightbulb burst high up, the beaver peeking up from the bottom edge. */}
      <Lightbulb
        rays
        size={240}
        className="absolute top-[8%] right-[1%] hidden h-auto w-[clamp(7rem,16.5vw,19.5rem)] md:block"
      />
      <Beaver
        size={260}
        className="absolute right-[3%] bottom-0 h-auto w-[clamp(6rem,15vw,17.5rem)] md:right-[1.5%] lg:right-[3%] lg:w-[clamp(6rem,17vw,17.5rem)]"
      />
    </div>
  );
}
