type SectionHeadingProps = {
  title: string;
  number?: string;
  as?: "h2" | "h3";
  cursor?: boolean;
  className?: string;
};

export function SectionHeading({ title, number, as: Heading = "h2", cursor = false, className }: SectionHeadingProps) {
  const size = Heading === "h2" ? "text-4xl sm:text-6xl" : "text-2xl sm:text-3xl";

  return (
    <Heading className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      {number ? <span className="font-pixel text-sm leading-none">{number}</span> : null}
      <span className={`font-display leading-none font-bold tracking-tighter lowercase ${size}`}>
        {title}
        {cursor ? (
          <span aria-hidden="true" className="ml-1 inline-block intro-done:motion-safe:animate-blink">
            █
          </span>
        ) : null}
      </span>
    </Heading>
  );
}
