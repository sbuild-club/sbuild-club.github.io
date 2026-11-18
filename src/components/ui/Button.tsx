import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "inverse" | "accent";
type Size = "sm" | "md" | "lg";
type Cut = "a" | "b" | "c";

type Common = {
  variant?: Variant;
  size?: Size;
  cut?: Cut;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof Common | "href">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof Common>;

// Static class names so Tailwind can see them.
// The root is the focusable element and is never clipped, so the focus ring stays whole. It reserves
// --layer-offset on the right and bottom, so the flat second layer never overflows the box.
const root =
  "group relative inline-flex max-w-full pr-(--layer-offset) pb-(--layer-offset) align-middle no-underline select-none";

const layerBase = "absolute top-(--layer-offset) left-(--layer-offset) right-0 bottom-0";

// Hover moves the face toward its layer, press lands it on the layer.
const faceBase =
  "relative flex min-h-11 flex-1 items-center justify-center gap-2 text-center font-label font-semibold leading-[1.2] tracking-[0.04em] group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-(--layer-offset) group-active:translate-y-(--layer-offset) motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out";

const faces: Record<Variant, string> = {
  primary: "bg-teal text-cream",
  secondary: "bg-sage text-navy",
  inverse: "bg-cream text-navy",
  // The one warm face: the hero's "follow socials". Navy on gold is 5.6:1.
  accent: "bg-gold text-navy",
};

const layers: Record<Variant, string> = {
  primary: "bg-navy",
  secondary: "bg-steel",
  inverse: "bg-navy",
  accent: "bg-navy",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-3 text-base sm:px-6 sm:text-[17px]",
  md: "px-[30px] py-4 text-lg",
  lg: "px-9 py-[18px] text-lg sm:text-xl",
};

const cuts: Record<Cut, string> = {
  a: "cut-a",
  b: "cut-b",
  c: "cut-c",
};

const defaultCut: Record<Variant, Cut> = {
  primary: "a",
  secondary: "b",
  inverse: "c",
  accent: "c",
};

/**
 * Cut-paper button: a clipped face over a flat second layer offset by --layer-offset.
 * With `href` it renders `<a>`, without it `<button type="button">`; other props pass through.
 * Touch target is at least 44px tall. `className` is for layout only (margin, width, alignment).
 */
export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", cut, className, children, ...rest } = props;
  const shape = cuts[cut ?? defaultCut[variant]];

  const inner = (
    <>
      <span aria-hidden="true" className={cx(layerBase, shape, layers[variant])} />
      <span className={cx(faceBase, shape, faces[variant], sizes[size])}>{children}</span>
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a {...(rest as Omit<LinkProps, keyof Common>)} className={cx(root, className)}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...(rest as Omit<ButtonProps, keyof Common>)}
      className={cx(root, "cursor-pointer", className)}
    >
      {inner}
    </button>
  );
}
