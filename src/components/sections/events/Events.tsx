import { StitchLine } from "@/components/ui/StitchLine";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { cx } from "@/components/ui/cx";
import { site } from "@/content/site";

const title = site.nav.links.find((l) => l.href === "#events")?.label ?? "";

// Neighbouring slips never share an outline; every other one steps in a little on wide screens.
const slips = ["cut-slip-a", "cut-slip-b md:ml-[4%]"] as const;
const tagCuts = ["a", "b"] as const;

/** Teal notice board: cream paper slips with a navy date label, the event name and its location. */
export function Events() {
  return (
    <section id="events" data-surface="dark" className="bg-teal py-4 text-cream sm:py-5">
      <StitchLine tone="cream" />

      <div className="mx-auto max-w-[1040px] px-4 pt-11 pb-12 sm:px-8 md:py-[76px] lg:px-10">
        <SectionHeading title={title} tilt={1} className="mb-7 md:mb-10" />

        <ol className="flex flex-col gap-[18px]">
          {site.events.map((event, i) => (
            <li
              key={i}
              data-surface="light"
              className={cx(
                "flex min-w-0 flex-col items-start gap-2 bg-cream px-5 pt-[18px] pb-5 text-navy sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2.5 sm:px-[26px] sm:pb-[18px]",
                slips[i % slips.length],
              )}
            >
              <Tag tone="navy" cut={tagCuts[i % tagCuts.length]} className="shrink-0">
                {event.date}
              </Tag>
              <p className="max-w-full min-w-0 font-display text-2xl leading-[1.15] uppercase wrap-break-word sm:flex-[1_1_240px] sm:text-[26px]">
                {event.name}
              </p>
              <p className="max-w-full min-w-0 text-sm leading-normal font-medium text-teal wrap-anywhere">
                {event.location}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <StitchLine tone="cream" />
    </section>
  );
}
