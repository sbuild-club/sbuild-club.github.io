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
          {site.team.map((member, i) => {
            const avatar = (
              <span
                className={cx(
                  "relative flex",
                  tilts[i % tilts.length],
                  member.href && "motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-105",
                )}
              >
                <Avatar
                  initials={member.initials}
                  photo={member.photo}
                  tone={tones[i % tones.length]}
                  className="size-[150px] sm:size-[196px]"
                />
                {member.href ? (
                  // The "this goes somewhere" sticker on the avatar's lower right, ringed in cream so it
                  // reads as a separate piece laid on the disc.
                  <span
                    aria-hidden="true"
                    className="absolute right-1 bottom-1 flex size-10 items-center justify-center rounded-full bg-navy font-label text-xl leading-none text-cream ring-4 ring-cream group-hover:bg-teal sm:right-2 sm:bottom-2 sm:size-11"
                  >
                    ↗
                  </span>
                ) : null}
              </span>
            );
            const nameClass =
              "mt-2 max-w-full font-label text-lg leading-[1.2] font-semibold tracking-[0.03em] wrap-anywhere";

            return (
              <li key={i} className="flex w-[156px] min-w-0 flex-col items-center gap-1.5 text-center sm:w-[208px]">
                {member.href ? (
                  // Photo and name are one link, so either is a target; the name carries a dashed
                  // teal underline (the stitch motif) and turns teal on hover.
                  <a
                    href={member.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex max-w-full flex-col items-center gap-1.5"
                  >
                    {avatar}
                    <span
                      className={cx(
                        nameClass,
                        "underline decoration-teal decoration-dashed decoration-2 underline-offset-[5px] group-hover:text-teal",
                      )}
                    >
                      {member.name}
                    </span>
                  </a>
                ) : (
                  <>
                    {avatar}
                    <p className={nameClass}>{member.name}</p>
                  </>
                )}
                <p className="max-w-full text-sm leading-normal font-medium text-teal wrap-anywhere">{member.role}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
