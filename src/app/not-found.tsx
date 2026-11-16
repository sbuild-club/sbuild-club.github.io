import { Keycap } from "@/components/art/Keycap";
import { Footer } from "@/components/footer/Footer";
import { Nav } from "@/components/nav/Nav";
import { Button } from "@/components/ui/Button";
import { StitchLine } from "@/components/ui/StitchLine";
import { site } from "@/content/site";

/**
 * 404 (exported as out/404.html). Cream ground, a large tilted "404" with a dropped keycap,
 * the heading as this page's one h1, and a button back home. Copy comes from site.notFound.
 */
export default function NotFound() {
  const { code, heading, ctaLabel, ctaHref } = site.notFound;

  return (
    <>
      <Nav />
      <main className="overflow-x-clip px-4 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-8">
          <div className="relative">
            <p aria-hidden="true" className="-rotate-2 font-display text-[clamp(6rem,24vw,12rem)] leading-[0.9] text-steel">
              {code}
            </p>
            <Keycap letter="S" size={96} className="absolute -top-8 -right-8 h-auto w-16 rotate-12 sm:-right-14 sm:w-24" />
          </div>
          <h1 className="font-display text-2xl leading-[1.1] uppercase sm:text-4xl">{heading}</h1>
          <StitchLine className="max-w-xs" />
          <Button href={ctaHref} cut="b">
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
