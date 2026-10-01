import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

const title = site.nav.links.find((l) => l.href === "#events")?.label ?? "";
const lastIndex = site.events.length - 1;

export function Events() {
  return (
    <section id="events" className="px-4 py-20 sm:px-8 md:py-28 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading cursor title={title} />

        {/* Terminal window: offset right on wide screens to break the grid. */}
        <div className="mt-10 border-2 border-paper shadow-[6px_6px_0_var(--amber)] md:mt-14 lg:ml-[12%]">
          <div aria-hidden="true" className="flex items-center gap-3 border-b-2 border-paper px-4 py-2">
            <span className="flex gap-1.5">
              <span className="block size-2.5 bg-signal" />
              <span className="block size-2.5 bg-amber" />
              <span className="block size-2.5 bg-paper" />
            </span>
            <span className="min-w-0 truncate font-mono text-xs text-paper/60 lowercase">
              $ {site.name} {title}
            </span>
          </div>

          <ol className="flex flex-col gap-5 bg-ink px-4 py-6 font-mono text-sm text-phosphor lowercase sm:px-6 md:gap-4 md:py-8 md:text-base lg:text-lg">
            {site.events.map((event, i) => (
              <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 wrap-anywhere">
                <span aria-hidden="true">&gt; </span>
                <span className="flex flex-col gap-1 md:grid md:grid-cols-[minmax(0,14ch)_minmax(0,1fr)_minmax(0,18ch)] md:gap-x-6">
                  <span>
                    {event.date}
                    <span className="sr-only">, </span>
                  </span>
                  <span>
                    {event.name}
                    <span className="sr-only">, </span>
                  </span>
                  <span className="text-phosphor/70">
                    {event.location}
                    {i === lastIndex ? (
                      <span aria-hidden="true" className="ml-2 inline-block text-phosphor intro-done:motion-safe:animate-blink">
                        █
                      </span>
                    ) : null}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
