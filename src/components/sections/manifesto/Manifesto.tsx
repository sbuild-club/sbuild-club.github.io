import { site } from "@/content/site";

// Staggered, asymmetric placement: left, right, indented left (signal), pushed right.
// Static literals so Tailwind can see every class.
const placements = [
  "self-start",
  "self-end text-right sm:mr-[4%]",
  "self-start pl-6 text-signal sm:pl-0 sm:ml-[14%]",
  "self-end pr-4 text-right sm:pr-0 sm:mr-[18%]",
] as const;

export function Manifesto() {
  const { statements } = site.manifesto;

  return (
    <section aria-label="manifesto" className="border-t-2 border-paper/15 px-4 py-24 sm:px-8 sm:py-32 lg:px-16 lg:py-40">
      <ul className="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-16 lg:gap-20">
        {statements.map((statement, i) => (
          <li
            key={i}
            className={`max-w-full font-display text-[clamp(1.75rem,5.5vw,5.25rem)] leading-[0.95] font-bold tracking-tighter wrap-anywhere lowercase sm:max-w-[16ch] ${placements[i % placements.length]}`}
          >
            {statement}
          </li>
        ))}
      </ul>
    </section>
  );
}
