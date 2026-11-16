import { Exclaim } from "@/components/art/Exclaim";
import { cx } from "@/components/ui/cx";
import { site } from "@/content/site";

// Staggered placement as in the mockup: left, right (tilted), left with the exclamation
// marks, centre (tilted the other way). Colours alternate navy / teal / steel; steel is
// fine here because the display size never drops below 26px. Static literals for Tailwind.
const placements = [
  "self-start text-navy",
  "self-end text-right text-teal rotate-[1.5deg]",
  "self-start text-steel",
  "self-center text-center text-navy -rotate-1",
] as const;

// The statement that gets the mint exclamation marks beside it.
const EXCLAIM_AT = 2;

export function Manifesto() {
  const { statements } = site.manifesto;

  return (
    <section aria-label="manifesto" className="px-4 pt-2 pb-14 sm:px-10 sm:pt-6 sm:pb-24">
      <ul className="mx-auto flex max-w-[1120px] flex-col gap-5 font-display text-[clamp(1.625rem,3.6vw,3.25rem)] leading-[1.1] uppercase sm:gap-7">
        {statements.map((statement, i) => (
          <li
            key={i}
            className={cx(
              "max-w-full wrap-break-word sm:max-w-[85%]",
              i === EXCLAIM_AT && "flex items-center gap-3 sm:gap-5",
              placements[i % placements.length],
            )}
          >
            {i === EXCLAIM_AT ? (
              <>
                <Exclaim className="h-auto w-9 shrink-0 sm:w-[52px]" />
                <span className="min-w-0">{statement}</span>
              </>
            ) : (
              statement
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
