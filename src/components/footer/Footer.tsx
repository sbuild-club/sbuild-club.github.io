import { StitchLine } from "@/components/ui/StitchLine";
import { rootHref } from "@/components/nav/rootHref";
import { site } from "@/content/site";

/**
 * Navy footer band: the club email set large in the display face, a steel stitch line, the social
 * links and "back to top" (sage on navy). Hover swaps cream for sage.
 */
export function Footer() {
  return (
    <footer data-surface="dark" className="bg-navy px-4 py-11 text-cream sm:px-10 sm:py-16">
      <div className="mx-auto flex max-w-[75rem] flex-col gap-6 sm:gap-8">
        <a
          href={`mailto:${site.footer.email}`}
          className="inline-flex min-h-11 items-center self-start font-display text-[clamp(1.625rem,3.4vw,2.875rem)] leading-[1.1] wrap-anywhere text-cream hover:text-sage"
        >
          {site.footer.email}
        </a>

        <StitchLine tone="steel" />

        <div className="flex flex-col gap-x-7 font-label text-[17px] leading-[1.2] font-semibold tracking-[0.04em] sm:flex-row sm:flex-wrap sm:items-center">
          <ul className="flex flex-wrap gap-x-6 sm:gap-x-7">
            {site.footer.socials.map((social, i) => (
              <li key={i}>
                <a href={rootHref(social.href)} className="flex min-h-11 items-center text-cream hover:text-sage">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={rootHref("#top")} className="flex min-h-11 items-center gap-2 self-start text-sage hover:text-cream sm:ml-auto sm:self-auto">
            back to top
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
