import type { ReactNode } from "react";

type Tilt = -4 | -3 | -2 | 2 | 3 | 4;
type Tone = "amber" | "signal" | "paper";

type StickerProps = {
  children: ReactNode;
  tilt?: Tilt;
  tone?: Tone;
  className?: string;
};

// Static class names so Tailwind can see them.
const tilts: Record<Tilt, string> = {
  [-4]: "-rotate-4",
  [-3]: "-rotate-3",
  [-2]: "-rotate-2",
  2: "rotate-2",
  3: "rotate-3",
  4: "rotate-4",
};

const tones: Record<Tone, string> = {
  amber: "bg-amber",
  signal: "bg-signal",
  paper: "bg-paper",
};

export function Sticker({ children, tilt = 3, tone = "amber", className }: StickerProps) {
  return (
    <span
      className={[
        "inline-block border-2 border-ink px-3 py-1.5 font-pixel text-xs leading-none text-ink lowercase shadow-[3px_3px_0_var(--ink)]",
        tilts[tilt],
        tones[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
