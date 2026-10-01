import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center border border-current px-2 py-1 font-pixel text-xs leading-none wrap-anywhere lowercase",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
