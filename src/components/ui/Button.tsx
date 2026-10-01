import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ghost";

type Common = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof Common | "href">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof Common>;

const base =
  "inline-flex items-center justify-center gap-2 border-2 px-5 py-3 font-mono text-sm font-medium lowercase leading-none tracking-tight motion-safe:transition-transform motion-safe:hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary: "border-signal bg-signal text-ink hover:border-amber hover:bg-amber",
  ghost: "border-current bg-transparent text-current hover:border-amber hover:bg-amber hover:text-ink",
};

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = [base, variants[variant], className].filter(Boolean).join(" ");

  if (rest.href !== undefined) {
    return (
      <a {...(rest as Omit<LinkProps, keyof Common>)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...(rest as Omit<ButtonProps, keyof Common>)} className={classes}>
      {children}
    </button>
  );
}
