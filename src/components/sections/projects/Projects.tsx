import { PixelIcon } from "@/components/pixel/PixelIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/content/site";

export function Projects() {
  const title = site.nav.links.find((l) => l.href === "#projects")?.label ?? "";
  const count = `${String(site.projects.length).padStart(2, "0")} ×`;

  return (
    <section id="projects" className="px-4 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading cursor title={title} />

        <div className="relative mt-12 sm:mt-16">
          {/* Breaks the grid: straddles the top edge, rotated. */}
          <span aria-hidden="true" className="absolute -top-4 right-4 z-10 sm:right-10">
            <Sticker tilt={-3} tone="signal">
              {count}
            </Sticker>
          </span>

          {/* The 2px gaps reveal the background, drawing a raw 2px rule between every tile at any column count. */}
          <ul className="grid grid-cols-1 gap-0.5 border-2 border-paper/30 bg-paper/30 md:grid-cols-2 lg:grid-cols-3">
            {site.projects.map((project, i) => (
              <li key={i} className="flex min-h-64 flex-col gap-10 bg-ink p-6 wrap-break-word sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-amber">
                    <PixelIcon name={project.icon} size={48} />
                  </span>
                  <span aria-hidden="true" className="font-pixel text-xs leading-none text-paper/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-auto flex flex-col gap-4">
                  <h3 className="font-display text-xl leading-tight font-bold tracking-tight lowercase sm:text-2xl">
                    {project.name}
                  </h3>
                  <ul className="flex flex-wrap gap-2 text-paper/80">
                    {project.tags.map((tag, j) => (
                      <li key={j}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
