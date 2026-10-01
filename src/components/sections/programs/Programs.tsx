import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

// One card deliberately breaks the grid: pushed right when stacked, dropped down in the
// three-column layout, filled signal with a hard offset shadow. Static literals for Tailwind.
const cards = [
  "bg-paper sm:mr-16 lg:mr-0",
  "bg-signal ml-8 shadow-[6px_6px_0_var(--ink)] sm:ml-16 lg:ml-0 lg:mt-24",
  "bg-paper sm:mr-16 lg:mr-0",
] as const;

export function Programs() {
  const title = site.nav.links.find((l) => l.href === "#programs")?.label ?? "";
  const count = String(site.programs.length).padStart(2, "0");

  return (
    <section id="programs" data-surface="light" className="bg-paper px-4 py-24 text-ink sm:px-8 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6 border-b-2 border-ink pb-6">
          <SectionHeading cursor title={title} />
          <span aria-hidden="true" className="shrink-0 font-pixel text-sm leading-none">
            [{count}]
          </span>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-3 lg:items-start lg:gap-8">
          {site.programs.map((program, i) => (
            <li
              key={i}
              className={`flex flex-col gap-12 min-w-0 border-2 border-ink p-6 wrap-anywhere sm:p-8 lg:min-h-[22rem] ${cards[i % cards.length]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <SectionHeading as="h3" number={program.number} title={program.name} className="min-w-0" />
                <span aria-hidden="true" className="flex shrink-0 gap-1">
                  <span className="size-2 bg-current" />
                  <span className="size-2 bg-current" />
                  <span className="size-2 border border-current" />
                </span>
              </div>
              <p className="mt-auto border-t-2 border-current pt-4 text-base leading-relaxed lowercase">{program.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
