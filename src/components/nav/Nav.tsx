import { Badge } from "@/components/art/Badge";
import { Button } from "@/components/ui/Button";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";
import { NavToggle } from "./NavToggle";
import { rootHref } from "./rootHref";

/**
 * Sticky cream header (64px on phones, 76px from md). Brand link (round badge plus the name in the
 * display face) on the left; the section links sit in a panel that collapses behind the cut-key
 * menu button below md (toggled by the client NavToggle); the signup button stays visible at every
 * width, with its short label below lg (the full label remains its accessible name).
 * DOM order matches visual order: brand, menu button, links, signup.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-cream">
      <nav
        aria-label="primary"
        className="relative mx-auto flex h-16 max-w-7xl items-center gap-2.5 px-4 sm:gap-4 sm:px-6 md:h-[76px] lg:gap-6 lg:px-10"
      >
        <a href={rootHref("#top")} className="group mr-auto flex min-h-11 shrink-0 items-center gap-2.5 sm:gap-3">
          <Badge size={52} className="h-auto w-11 shrink-0 md:w-[52px]" />
          <span className="font-display text-[22px] leading-none text-navy uppercase group-hover:text-teal sm:text-2xl">
            {site.name}
          </span>
        </a>

        <NavToggle>
          <ul className="flex flex-col md:flex-row md:items-center md:gap-1 lg:gap-4">
            {site.nav.links.map((link, i) => (
              <li key={i}>
                <a
                  href={rootHref(link.href)}
                  className="flex min-h-12 items-center font-label text-xl leading-[1.2] font-semibold tracking-[0.04em] text-navy hover:text-teal md:min-h-11 md:px-2 md:text-[17px]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <StitchLine className="mt-3 md:hidden" />
        </NavToggle>

        <Button href={rootHref(site.nav.cta.href)} size="sm" className="shrink-0">
          <span aria-hidden="true" className="lg:hidden">
            {site.nav.cta.shortLabel}
          </span>
          <span className="max-lg:sr-only">{site.nav.cta.label}</span>
        </Button>
      </nav>
    </header>
  );
}
