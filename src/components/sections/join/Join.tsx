import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";
import { site } from "@/content/site";

export function Join() {
  return (
    <section
      id="join"
      data-surface="light"
      className="stepped-gradient relative border-y-2 border-ink px-4 pt-24 pb-28 text-ink sm:px-8 md:pt-32 md:pb-40 lg:px-16"
    >
      {/* Decorative: straddles the section's top edge, breaking the grid. */}
      <span aria-hidden="true" className="absolute -top-4 right-4 sm:right-12 lg:right-[18%]">
        <Sticker tilt={-3} tone="amber">
          {site.name}
        </Sticker>
      </span>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div className="flex max-w-3xl flex-col gap-6 wrap-anywhere">
          <SectionHeading cursor title={site.join.headline} />
          <p className="max-w-xl text-lg leading-relaxed lowercase sm:text-xl">{site.join.body}</p>
        </div>

        <div className="lg:pb-2">
          <span className="inline-flex shadow-[4px_4px_0_var(--ink)]">
            <Button href={site.join.ctaHref}>
              {site.join.ctaLabel}
              <span aria-hidden="true">→</span>
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
}
