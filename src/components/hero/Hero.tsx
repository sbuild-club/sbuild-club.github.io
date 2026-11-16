import { SidePanels } from "@/components/art/SidePanels";
import { Wordmark } from "@/components/art/Wordmark";
import { Button } from "@/components/ui/Button";
import { Plaque } from "@/components/ui/Plaque";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";
import { BannerArt } from "./BannerArt";
import { CtaArt } from "./CtaArt";

// One static class string per headline line (Tailwind scans literals). The middle line is steel
// and tilted from its left edge, as in the mockup.
const LINE_CLASSES = ["block", "block origin-left -rotate-[1.5deg] text-steel", "block"] as const;

/**
 * Hero (#top). Two parts:
 *
 * 1. The banner, recomposed from live parts so it scales and the intro can land on it: sage side
 *    panels, stitch lines top and bottom, the wordmark h1 (the intro's landing box), the tagline
 *    plaque, scattered keycaps, pixel clusters, exclamation marks, the lightbulb burst and the
 *    beaver peeking up at the bottom right.
 * 2. The three-line headline, the mission and the two CTAs, with a keycap cluster on wide screens.
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

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-4 pt-10 pb-14 sm:px-6 md:pt-16 md:pb-22 lg:px-10">
        <div className="flex min-w-0 flex-[999_1_32rem] flex-col gap-5 sm:gap-7">
          <p className="font-display text-[clamp(2.125rem,5.4vw,4.75rem)] leading-[1.02] tracking-[0.01em] wrap-anywhere text-navy uppercase">
            {site.hero.headlineLines.map((line, i) => (
              <span key={i} className={LINE_CLASSES[i]}>
                {line}
              </span>
            ))}
          </p>
          <p className="max-w-[35rem] text-lg leading-normal font-medium sm:text-xl">{site.hero.mission}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
            <Button href={site.hero.primaryCta.href} className="w-full sm:w-auto">
              {site.hero.primaryCta.label}
            </Button>
            <Button href={site.hero.secondaryCta.href} variant="secondary" className="w-full sm:w-auto">
              {site.hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        <CtaArt />
      </div>
    </section>
  );
}
