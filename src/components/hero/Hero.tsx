import { GridFloor } from "@/components/pixel/GridFloor";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { site } from "@/content/site";
import { HeroArt } from "./HeroArt";

// One static class string per headline line (Tailwind scans literals). Offsets give the broken-line stack.
const LINE_CLASSES = ["block", "block pl-[10%] text-amber md:pl-[24%]", "block pl-[4%] md:pl-[10%]"] as const;

const GUIDE_COLUMNS = 12;

/**
 * Hero (#top). Keeps the intro handoff contract: `h1#wordmark[data-intro-target]` holds only
 * `site.name`, and nothing in it or its ancestors is transformed, rotated or background-clipped.
 * The rotated sticker and the pixel frame (shifted across a column line) break the grid on purpose.
 */
export function Hero() {
  const lastLine = site.hero.headlineLines.length - 1;

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Faint 12-column guides: the system the sticker and the pixel frame break. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mx-auto hidden max-w-7xl grid-cols-12 gap-x-6 px-6 md:grid lg:px-10"
      >
        {Array.from({ length: GUIDE_COLUMNS }, (_, i) => (
          <span key={i} className="border-x border-paper/[6%]" />
        ))}
      </div>

      <GridFloor />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 content-between gap-y-12 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-12 md:gap-x-6 md:pt-14 md:pb-20 lg:px-10">
        <div className="min-w-0 md:col-span-12">
          <div className="flex flex-wrap items-start">
            <h1
              id="wordmark"
              data-intro-target
              className="font-display text-[clamp(2.75rem,12vw,11rem)] leading-[0.85] font-extrabold tracking-tighter text-signal lowercase"
            >
              {site.name}
            </h1>
            {/* Slapped-on sticker: rotated, overlapping the wordmark's corner. */}
            <a
              href={site.nav.cta.href}
              className="relative z-10 -ml-2 shrink-0 self-start sm:-ml-4 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
            >
              <Sticker tilt={-3} tone="amber">
                {site.nav.cta.label}
                <span aria-hidden="true"> →</span>
              </Sticker>
            </a>
          </div>

          <p className="mt-5 font-display text-[clamp(2.25rem,9vw,8rem)] leading-[0.92] font-bold tracking-tighter wrap-anywhere lowercase md:mt-8">
            {site.hero.headlineLines.map((line, i) => (
              <span key={i} className={LINE_CLASSES[i]}>
                {line}
                {i === lastLine ? (
                  <span aria-hidden="true" className="ml-[0.08em] inline-block text-signal intro-done:motion-safe:animate-blink">
                    █
                  </span>
                ) : null}
              </span>
            ))}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-6 self-end md:col-span-6">
          <p className="max-w-[46ch] font-mono text-base leading-relaxed text-paper/80 lowercase sm:text-lg">
            <span aria-hidden="true" className="text-amber">
              {"> "}
            </span>
            {site.hero.mission}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={site.hero.primaryCta.href}>
              {site.hero.primaryCta.label}
              <span aria-hidden="true">→</span>
            </Button>
            <Button href={site.hero.secondaryCta.href} variant="ghost">
              {site.hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Shifted left across the col-8 line. */}
        <div className="min-w-0 self-end pt-6 md:col-span-5 md:col-start-8 md:-ml-10 md:pt-0 lg:-ml-20">
          <HeroArt />
        </div>
      </div>
    </section>
  );
}
