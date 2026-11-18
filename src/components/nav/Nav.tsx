import { Badge } from "@/components/art/Badge";
import { Button } from "@/components/ui/Button";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";
import { NavToggle } from "./NavToggle";
import { rootHref } from "./rootHref";

/**
 * Sticky cream header (64px on phones, 76px from md). Brand link (round badge plus the brand line,
 * site.nav.brand, in the label face) on the left; the section links sit in a panel that collapses
 * behind the cut-key menu button below xl (toggled by the client NavToggle); the signup button (opens the newsletter
 * form in a new tab) stays visible at every width, with its short label below lg (the full label
 * remains its accessible name).
 * DOM order matches visual order: brand, menu button, links, signup.
 * During the first-visit intro the header waits above the viewport, so the intro's peeling sheet
 * never uncovers it mid-peel; it drops in once html[data-intro] flips to "done" (finish or skip).
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-cream intro-pending:-translate-y-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out">
      <nav
        aria-label="primary"
        className="relative mx-auto flex h-16 max-w-7xl items-center gap-1.5 px-4 sm:gap-4 sm:px-6 md:h-[76px] lg:gap-6 lg:px-10"
      >
        <a href={rootHref("#top")} className="group mr-auto flex min-h-11 min-w-0 items-center gap-1.5 sm:gap-3">
          <Badge size={52} className="h-auto w-9 shrink-0 sm:w-11 md:w-[52px]" />
          {/* Phones stack the name over the descriptor (which wraps to two lines); from sm it reads as one
              line, "name: descriptor". The links stay in the menu below xl so this line has room. */}
          <span className="flex min-w-0 flex-col font-label text-sm leading-[1.2] max-[375px]:text-xs sm:block sm:text-[17px] md:text-lg lg:text-xl xl:text-2xl">
            <span className="font-bold text-navy group-hover:text-teal">
              {site.nav.brand.name}
              <span className="max-sm:hidden">:</span>
            </span>{" "}
            <span className="font-semibold text-teal">{site.nav.brand.descriptor}</span>
          </span>
        </a>

        <NavToggle>
          <ul className="flex flex-col xl:flex-row xl:items-center xl:gap-4">
            {site.nav.links.map((link, i) => (
              <li key={i}>
                <a
                  href={rootHref(link.href)}
                  className="flex min-h-12 items-center font-label text-xl leading-[1.2] font-semibold tracking-[0.04em] text-navy hover:text-teal xl:min-h-11 xl:px-2 xl:text-xl"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <StitchLine className="mt-3 xl:hidden" />
        </NavToggle>

        <Button
          href={rootHref(site.nav.cta.href)}
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <span aria-hidden="true" className="lg:hidden">
            {site.nav.cta.shortLabel}
          </span>
          <span className="max-lg:sr-only">{site.nav.cta.label}</span>
        </Button>
      </nav>
    </header>
  );
}
