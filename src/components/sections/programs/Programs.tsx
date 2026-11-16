import { PaperCard } from "@/components/ui/PaperCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";

type Cut = "a" | "b" | "c";

// One card per program, cut a / b / c so neighbours never share an outline. The middle card is
// teal paper and drops a little below the others in the three-column layout (top and bottom
// margin cancel, so the cards keep equal heights). Every card sits on the flat navy layer.
const cards: ReadonlyArray<{ cut: Cut; tone: "cream" | "teal"; place: string }> = [
  { cut: "a", tone: "cream", place: "" },
  { cut: "b", tone: "teal", place: "lg:mt-6 lg:-mb-6" },
  { cut: "c", tone: "cream", place: "" },
];

export function Programs() {
  const title = site.nav.links.find((l) => l.href === "#programs")?.label ?? "";

  return (
    <section id="programs" className="bg-sage py-4 text-navy sm:py-5">
      <StitchLine tone="cream" />
      <div className="mx-auto max-w-7xl px-4 py-11 sm:px-10 sm:py-[76px]">
        <SectionHeading title={title} tilt={-1} className="mb-7 sm:mb-10" />
        <ul className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {site.programs.map((program, i) => {
            const card = cards[i % cards.length];
            return (
              <PaperCard key={i} as="li" cut={card.cut} tone={card.tone} layer className={card.place}>
                <SectionHeading as="h3" number={program.number} title={program.name} />
                <p className="wrap-break-word">{program.description}</p>
              </PaperCard>
            );
          })}
        </ul>
      </div>
      <StitchLine tone="cream" />
    </section>
  );
}
