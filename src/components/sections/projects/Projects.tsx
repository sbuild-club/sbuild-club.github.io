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

// While `site.projects` is empty the section shows one layered tile with `site.projectsNote`.
// Three columns only from xl: below 1280px a third of the row is too narrow for a long single
// word in a title (a 16-letter word in the display face needs about 270px at 24px).
export function Projects() {
  const title = site.nav.links.find((l) => l.href === "#projects")?.label ?? "";

  return (
    <section id="projects" className="relative px-4 py-16 sm:px-10 sm:py-24">
      <StarBurst className="absolute top-10 right-4 h-auto w-16 rotate-6 sm:top-14 sm:right-[6%] sm:w-24" />
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:gap-5">
          {/* The right padding keeps the heading clear of the star burst. */}
          <div className="pr-20 sm:pr-32">
            <SectionHeading title={title} tone="steel" />
          </div>
          {/* Lead in the label face, like the hero pillars: the key fact bold, at most about 50
              characters a line, no lone last word. */}
          <p className="max-w-[40rem] font-label text-xl leading-[1.35] font-medium text-pretty text-navy sm:text-2xl">
            <strong className="font-bold">{site.projectsIntro.highlight}</strong> {site.projectsIntro.text}
          </p>
        </div>
        {site.projects.length === 0 ? (
          <PaperCard cut="a" tone="sage-soft" layer className="max-w-xl">
            <ProjectIcon name="wrench" size={64} className="block shrink-0 text-steel" />
            <p className="font-display text-[length:clamp(1.75rem,5vw,2.75rem)] leading-[1.1] wrap-break-word uppercase">
              {site.projectsNote}
            </p>
          </PaperCard>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
            {site.projects.map((project, i) => (
              <PaperCard key={i} as="li" cut={tileCuts[i % tileCuts.length]} tone="sage-soft">
                <ProjectIcon name={project.icon} size={64} className="block shrink-0 text-steel" />
                {/* display-card at the mockup's 24px for tile titles. */}
                <h3 className="font-display text-2xl leading-[1.15] font-normal wrap-break-word uppercase">{project.name}</h3>
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
        )}
      </div>
    </section>
  );
}
