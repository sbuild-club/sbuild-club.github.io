import type { ReactNode } from "react";
import { cx } from "./cx";

type PlaqueProps = {
  children: ReactNode;
  as?: "p" | "div" | "span";
  className?: string;
};

/**
 * The jagged teal tagline plaque (cut-plaque) with cream label-plaque text, as under the
 * banner wordmark. Not interactive. `className` is for layout only (margin, width, alignment).
 */
export function Plaque({ children, as: Root = "p", className }: PlaqueProps) {
  return (
    <Root
      data-surface="dark"
      className={cx(
        "inline-block max-w-full bg-teal px-7 py-6 text-center font-label text-lg leading-[1.2] font-semibold tracking-[0.06em] text-cream cut-plaque sm:px-[34px] sm:py-[30px] sm:text-2xl",
        className,
      )}
    >
      {children}
    </Root>
  );
}
