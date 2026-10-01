import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import { NavToggle } from "./NavToggle";

/**
 * Sticky, compact primary nav (64px incl. its 2px rule). Wordmark left; section links in a panel
 * that collapses below md (toggled by the client NavToggle); "join" stays visible at every width.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b-2 border-paper bg-ink">
      <nav aria-label="primary" className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
        <a href="#top" className="mr-auto font-display text-xl leading-none font-bold tracking-tighter lowercase hover:text-amber">
          {site.name}
        </a>

        <NavToggle>
          <ul className="flex flex-col md:flex-row md:items-center">
            {site.nav.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="flex items-baseline gap-4 border-b border-paper/20 py-4 font-display text-3xl leading-none font-bold tracking-tighter lowercase hover:text-amber md:gap-0.5 md:border-0 md:px-3 md:py-2 md:font-mono md:text-sm md:font-normal md:tracking-normal"
                >
                  <span aria-hidden="true" className="font-pixel text-xs font-normal tracking-normal text-paper/60 md:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="hidden text-paper/60 md:inline">
                    /
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </NavToggle>

        <Button href={site.nav.cta.href} className="shrink-0">
          {site.nav.cta.label}
        </Button>
      </nav>
    </header>
  );
}
