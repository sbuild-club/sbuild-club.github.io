import { SidePanels } from "@/components/art/SidePanels";
import { Wordmark } from "@/components/art/Wordmark";
import { Button } from "@/components/ui/Button";
import { Plaque } from "@/components/ui/Plaque";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";
import { BannerArt } from "./BannerArt";

/**
 * Hero (#top). Two parts:
 *
 * 1. The banner, recomposed from live parts so it scales and the intro can land on it: sage side
 *    panels, stitch lines top and bottom, the wordmark h1 (the intro's landing box), the tagline
 *    plaque, scattered keycaps, pixel clusters, exclamation marks, the lightbulb burst and the
 *    beaver peeking up at the bottom right.
 * 2. One centred column, as in the middle of the print flyer: the three pillars (Build /
 *    Community / Founding) in navy, the steel slogan below them, and the three CTAs centred under it.
 *
 * Intro handoff (CONTRACT §2.6): `h1#wordmark[data-intro-target]` holds only the Wordmark svg and
 * the sr-only name; its box is the svg's box. Nothing on it or its ancestors is transformed,
 * clipped, filtered or faded. The top padding of the banner leaves room for the cap, which may
 * rise above the svg by up to a quarter of its height.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate">
      <div className="relative isolate overflow-hidden px-4 pt-14 pb-24 sm:px-6 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-16">
        <SidePanels className="hidden sm:block" />
        <StitchLine className="absolute inset-x-0 top-3" />
        <StitchLine className="absolute inset-x-0 bottom-3" />
        <BannerArt />

        <div className="relative flex flex-col items-center gap-5 sm:gap-6">
          <h1 id="wordmark" data-intro-target className="w-[92%] max-w-[52rem] sm:w-[68%] lg:w-[54%]">
            <Wordmark cap />
            <span className="sr-only">{site.name}</span>
          </h1>
          <Plaque>{site.tagline}</Plaque>
        </div>
      </div>

      {/* The column is a size container: the pillars and slogan scale with its width (cqi). Fredoka
          widths: the longest pillar ("Build: Turn your ideas into real projects.") is about 18.1em,
          the slogan about 11.2em at bold. 4.4cqi keeps the pillar at 80% of the column, so it stays
          on one row wherever the size is not clamped; at the 22px floor it needs ~400px and wraps
          to two rows below that. The slogan's 28px floor keeps steel text above 24px (contrast). */}
      <div className="@container mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 pt-10 pb-14 text-center sm:gap-8 sm:px-6 md:pt-16 md:pb-22 lg:px-10">
        <ul className="flex flex-col gap-[0.6em] font-label text-[length:clamp(1.375rem,4.4cqi,2.25rem)] leading-[1.2] font-semibold text-balance text-navy">
          {site.hero.pillars.map((p, i) => (
            <li key={i}>
              <strong className="font-bold">{p.label}:</strong> {p.text}
            </li>
          ))}
        </ul>
        <p className="font-label text-[length:clamp(1.75rem,6.6cqi,3.5rem)] leading-[1.1] font-bold text-balance text-steel">
          {site.hero.mission}
        </p>
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
          <Button href={site.hero.primaryCta.href} className="w-full sm:w-auto">
            {site.hero.primaryCta.label}
          </Button>
          <Button href={site.hero.secondaryCta.href} variant="secondary" className="w-full sm:w-auto">
            {site.hero.secondaryCta.label}
          </Button>
          <Button href={site.hero.socialsCta.href} variant="accent" className="w-full sm:w-auto">
            {site.hero.socialsCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
