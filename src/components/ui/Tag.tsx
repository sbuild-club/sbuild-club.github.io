import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center border border-current px-2 py-1 font-pixel text-xs leading-none lowercase",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
