import { site } from "@/content/site";

/**
 * Footer: oversized mailto link, pixel-font social links and "back to top", raw 1–2px borders,
 * closed by a hard-stop stepped band (signal → amber → paper).
 */
export function Footer() {
  return (
    <footer className="border-t-2 border-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-14 pb-12 sm:px-6 md:gap-14 md:pt-20 md:pb-16 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <a
            href={`mailto:${site.footer.email}`}
            className="min-w-0 font-display text-[clamp(1.75rem,7vw,5rem)] leading-none font-bold tracking-tighter wrap-anywhere lowercase hover:text-amber"
          >
            {site.footer.email}
            <span aria-hidden="true" className="ml-[0.2em] inline-block text-signal">
              →
            </span>
          </a>

          <a
            href="#top"
            className="inline-flex shrink-0 items-center gap-2 self-start border-2 border-paper px-3 py-2 font-pixel text-xs leading-none lowercase hover:border-amber hover:bg-amber hover:text-ink md:self-auto"
          >
            back to top
            <span aria-hidden="true">↑</span>
          </a>
        </div>

        <ul className="flex flex-wrap gap-2 border-t border-paper/30 pt-6 sm:gap-3">
          {site.footer.socials.map((social, i) => (
            <li key={i}>
              <a
                href={social.href}
                className="inline-flex items-center gap-1 border border-paper px-3 py-2 font-pixel text-xs leading-none lowercase hover:border-amber hover:bg-amber hover:text-ink"
              >
                <span aria-hidden="true" className="opacity-60">
                  /
                </span>
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div aria-hidden="true" className="grid h-2 grid-cols-5">
        <span className="bg-signal" />
        <span className="[background-color:color-mix(in_srgb,var(--signal)_50%,var(--amber))]" />
        <span className="bg-amber" />
        <span className="[background-color:color-mix(in_srgb,var(--amber)_50%,var(--paper))]" />
        <span className="bg-paper" />
      </div>
    </footer>
  );
}
