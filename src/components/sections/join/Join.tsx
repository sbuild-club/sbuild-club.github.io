import { Beaver } from "@/components/art/Beaver";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";

/**
 * Sage band: headline, body and a large CTA, with the beaver rising out of the bottom edge
 * (right on wide screens, centred under the text on phones). The section clips its overflow,
 * so the beaver's lowest part is cut off by the band's edge.
 */
export function Join() {
  return (
    <section id="join" className="relative overflow-hidden bg-sage pt-4 text-navy sm:pt-5">
      <StitchLine tone="cream" />

      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 pt-11 sm:px-8 md:pt-[76px] lg:flex-row lg:items-end lg:px-10">
        <div className="flex min-w-0 flex-col items-start gap-5 sm:gap-6 lg:flex-1 lg:pb-[88px]">
          <SectionHeading title={site.join.headline} className="max-w-full" />
          <p className="max-w-[520px] text-lg leading-normal font-medium wrap-anywhere sm:text-xl">{site.join.body}</p>
          <Button
            href={site.join.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            cut="c"
            className="mt-1 w-full sm:w-auto"
          >
            {site.join.ctaLabel}
          </Button>
        </div>

        <Beaver className="h-auto w-[288px] shrink-0 translate-y-[8%] self-center sm:w-[340px] sm:self-end lg:w-[380px]" />
      </div>
    </section>
  );
}
