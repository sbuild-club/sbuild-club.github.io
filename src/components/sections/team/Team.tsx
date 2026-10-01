import { PixelAvatar } from "@/components/pixel/PixelAvatar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

const title = site.nav.links.find((l) => l.href === "#team")?.label ?? "";

export function Team() {
  return (
    <section id="team" data-surface="light" className="bg-paper px-4 py-20 text-ink sm:px-8 md:py-28 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading cursor title={title} />

        {/* 2 cols at 375, 3 at 768, 6 at 1440; even cards drop down for a staggered, off-grid rhythm. */}
        <ul className="mt-10 grid grid-cols-2 items-start gap-x-4 gap-y-6 sm:gap-x-6 md:mt-14 md:grid-cols-3 md:gap-y-8 xl:grid-cols-6">
          {site.team.map((member, i) => (
            <li
              key={i}
              className="relative flex flex-col items-start gap-4 border-2 border-ink p-3 shadow-[4px_4px_0_var(--ink)] wrap-anywhere even:mt-6 sm:p-4 md:even:mt-10"
            >
              <span aria-hidden="true" className="absolute top-2 right-2 font-pixel text-xs leading-none text-ink/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <PixelAvatar initials={member.initials} size={96} />
              <div className="flex flex-col gap-1.5">
                <p className="font-display text-base leading-tight font-bold tracking-tight lowercase sm:text-lg">
                  {member.name}
                </p>
                <p className="font-mono text-sm leading-snug text-ink/70 lowercase">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
