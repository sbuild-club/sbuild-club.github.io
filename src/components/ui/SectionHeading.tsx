import { cx } from "./cx";

type Tilt = -2 | -1 | 1 | 2;
type Tone = "inherit" | "steel" | "teal";

type SectionHeadingProps = {
  title: string;
  number?: string;
  as?: "h2" | "h3";
  tilt?: Tilt;
  tone?: Tone;
  className?: string;
};

// Static class names so Tailwind can see them.
const sizes = {
  h2: "text-4xl leading-[1.05] sm:text-5xl",
  h3: "text-2xl leading-[1.15] sm:text-[26px]",
} as const;

const tilts: Record<Tilt, string> = {
  [-2]: "-rotate-2",
  [-1]: "-rotate-1",
  1: "rotate-1",
  2: "rotate-2",
};

// Steel is display-only colour: every size here is 24px or larger, and it is for light grounds only.
const tones: Record<Tone, string> = {
  inherit: "",
  steel: "text-steel",
  teal: "text-teal",
};

/**
 * Display heading in capitals (Bungee). h2 = display-section (36px → 48px), h3 = display-card
 * (24px → 26px). `number` is a decorative numeral above the title, coloured by the surface
 * (steel on light, mint inside data-surface="dark"). `className` is for layout only
 * (margin, width, alignment; centre with "items-center text-center").
 */
export function SectionHeading({
  title,
  number,
  as: Heading = "h2",
  tilt,
  tone = "inherit",
  className,
}: SectionHeadingProps) {
  return (
    <Heading className={cx("flex flex-col gap-2.5", tones[tone], className)}>
      {number ? (
        <span aria-hidden="true" className="font-display text-[44px] leading-none text-(color:--numeral) sm:text-[56px]">
          {number}
        </span>
      ) : null}
      <span
        className={cx(
          "w-fit max-w-full font-display font-normal uppercase wrap-break-word",
          sizes[Heading],
          tilt ? "origin-left" : "",
          tilt ? tilts[tilt] : "",
        )}
      >
        {title}
      </span>
    </Heading>
  );
}
