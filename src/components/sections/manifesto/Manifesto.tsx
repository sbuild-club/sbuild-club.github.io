import { SectionHeading } from "@/components/ui/SectionHeading";
import { StitchLine } from "@/components/ui/StitchLine";
import { cx } from "@/components/ui/cx";
import { site } from "@/content/site";

/**
 * Mission band straight under the hero's CTAs, dressed like Programs: sage band with a cream
 * stitch line inside its top and bottom edges. The display heading sits over short body-lead
 * paragraphs, centred to continue the hero's centred column: the bold lead runs into the first,
 * and the last (when there is more than one) is a teal Fredoka call-out.
 */
export function Manifesto() {
  const { heading, lead, paragraphs } = site.manifesto;
  const last = paragraphs.length - 1;

  return (
    <section className="bg-sage py-4 text-navy sm:py-5">
      <StitchLine tone="cream" />
      <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-5 px-4 py-11 text-center sm:gap-6 sm:px-10 sm:py-[76px]">
        <SectionHeading title={heading} className="items-center text-center" />
        <div className="flex flex-col gap-4 text-lg leading-normal font-medium text-pretty sm:gap-5 sm:text-xl">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              className={cx(i > 0 && i === last && "font-label leading-[1.3] font-semibold tracking-[0.02em] text-teal")}
            >
              {i === 0 ? (
                <>
                  <strong className="font-extrabold">{lead}</strong> {text}
                </>
              ) : (
                text
              )}
            </p>
          ))}
        </div>
      </div>
      <StitchLine tone="cream" />
    </section>
  );
}
