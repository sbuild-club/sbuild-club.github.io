import { Button } from "@/components/ui/Button";
import { StitchLine } from "@/components/ui/StitchLine";
import { rootHref } from "@/components/nav/rootHref";
import { site } from "@/content/site";

/**
 * Navy footer band: the club email set large in the display face beside the newsletter sign-up
 * button (opens the form in a new tab), a steel stitch line, the social links and "back to top"
 * (sage on navy). Hover swaps cream for sage.
 */
export function Footer() {
  return (
    <footer data-surface="dark" className="bg-navy px-4 py-11 text-cream sm:px-10 sm:py-16">
      <div className="mx-auto flex max-w-[75rem] flex-col gap-6 sm:gap-8">
        {/* #newsletter is the target of the hero's primary CTA. */}
        <div
          id="newsletter"
          className="flex scroll-mt-20 flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8"
        >
          <a
            href={`mailto:${site.footer.email}`}
            className="inline-flex min-h-11 items-center self-start font-display text-[clamp(1.125rem,6.2vw,1.625rem)] leading-[1.1] wrap-anywhere text-cream hover:text-sage sm:self-auto sm:text-[clamp(1.625rem,3.4vw,2.875rem)]"
          >
            {site.footer.email}
          </a>
          <Button
            href={site.footer.newsletter.href}
            variant="inverse"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            {site.footer.newsletter.label}
            <span aria-hidden="true">→</span>
          </Button>
        </div>

        <StitchLine tone="steel" />

        <div className="flex flex-col gap-x-7 font-label text-[17px] leading-[1.2] font-semibold tracking-[0.04em] sm:flex-row sm:flex-wrap sm:items-center">
          <ul className="flex flex-wrap gap-x-6 sm:gap-x-7">
            {site.footer.socials.map((social, i) => (
              <li key={i}>
                {/* Social profiles live on other sites: open them in a new tab so the page stays put. */}
                <a
                  href={rootHref(social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center text-cream hover:text-sage"
                >
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
