import { ProjectIcon } from "@/components/art/ProjectIcon";
import { StarBurst } from "@/components/art/StarBurst";
import { PaperCard } from "@/components/ui/PaperCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/content/site";

type Cut = "a" | "b" | "c";

// Tiles cycle the three card cuts so neighbours never share an outline.
const tileCuts: readonly Cut[] = ["a", "b", "c"];

// Tags alternate tone and cut. Both tones differ from the sage-soft tile they sit on.
const tagStyles = [
  { tone: "teal", cut: "a" },
  { tone: "cream", cut: "b" },
] as const;

export function Projects() {
  const title = site.nav.links.find((l) => l.href === "#projects")?.label ?? "";

  return (
    <section id="projects" className="relative px-4 py-16 sm:px-10 sm:py-24">
      <StarBurst className="absolute top-10 right-4 h-auto w-16 rotate-6 sm:top-14 sm:right-[6%] sm:w-24" />
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading title={title} tone="steel" className="mb-8 pr-20 sm:mb-10 sm:pr-32" />
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {site.projects.map((project, i) => (
            <PaperCard key={i} as="li" cut={tileCuts[i % tileCuts.length]} tone="sage-soft">
              <ProjectIcon name={project.icon} size={64} className="block shrink-0 text-steel" />
              <SectionHeading as="h3" title={project.name} />
              <ul className="mt-auto flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag, j) => {
                  const style = tagStyles[(i + j) % tagStyles.length];
                  return (
                    <li key={j} className="flex max-w-full">
                      <Tag tone={style.tone} cut={style.cut}>
                        {tag}
                      </Tag>
                    </li>
                  );
                })}
              </ul>
            </PaperCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
