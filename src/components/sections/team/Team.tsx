import { Avatar, type AvatarTone } from "@/components/art/Avatar";
import { SidePanels } from "@/components/art/SidePanels";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/components/ui/cx";
import { site } from "@/content/site";

const title = site.nav.links.find((l) => l.href === "#team")?.label ?? "";

// A deliberate mix of disc colours and tilts, so the row looks laid down by hand (mockup order).
const tones: readonly AvatarTone[] = ["sage", "steel", "teal", "sage-soft", "navy", "sage"];
const tilts = ["-rotate-4", "rotate-3", "-rotate-2", "rotate-5", "-rotate-3", "rotate-2"] as const;

/** Cream section with left side panels: round stitched avatars, each with a name and a role. */
export function Team() {
  return (
    <section id="team" className="relative isolate px-4 py-20 sm:px-8 md:py-24 lg:px-10">
      <SidePanels side="left" className="hidden lg:block" />

      <div className="mx-auto max-w-[1200px]">
        <SectionHeading title={title} className="mb-10 items-center text-center" />

        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-9 sm:gap-x-7">
          {site.team.map((member, i) => (
            <li key={i} className="flex w-[148px] min-w-0 flex-col items-center gap-1.5 text-center sm:w-[168px]">
              <span className={cx("flex", tilts[i % tilts.length])}>
                <Avatar initials={member.initials} tone={tones[i % tones.length]} />
              </span>
              <p className="mt-2 max-w-full font-label text-lg leading-[1.2] font-semibold tracking-[0.03em] wrap-anywhere">
                {member.name}
              </p>
              <p className="max-w-full text-sm leading-normal font-medium text-teal wrap-anywhere">{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
