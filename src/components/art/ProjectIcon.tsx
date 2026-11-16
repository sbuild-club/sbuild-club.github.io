// STUB (foundation). Replaced by the art lane with the eight finished cut-paper project icons.
// The name union, props and root element are frozen (docs/CONTRACT.md §2); src/content/site.ts
// imports ProjectIconName.
import type { ReactNode } from "react";

export type ProjectIconName = "rocket" | "wrench" | "lightbulb" | "chip" | "terminal" | "satellite" | "flag" | "bolt";

type ProjectIconProps = {
  name: ProjectIconName;
  /** Rendered width and height in px (square 64×64 viewBox). */
  size: number;
  /** Layout, size and colour-by-text classes (e.g. text-steel): the shape fills with currentColor. */
  className?: string;
  /** Accessible name. Without it the svg is aria-hidden. */
  label?: string;
};

// Single-colour shapes in currentColor; "holes" are cut in cream, the paper colour.
const shapes: Record<ProjectIconName, ReactNode> = {
  rocket: (
    <>
      <polygon points="30,2 44,6 50,26 42,40 46,62 30,54 16,62 20,40 12,26 18,6" />
      <polygon points="26,16 38,16 40,28 24,28" className="fill-cream" />
    </>
  ),
  wrench: (
    <>
      <polygon points="40,4 58,8 60,24 50,30 22,60 6,56 4,44 34,16" />
      <polygon points="46,12 54,14 54,22 46,20" className="fill-cream" />
    </>
  ),
  lightbulb: (
    <>
      <polygon points="20,4 44,3 56,20 52,38 42,46 22,46 12,38 8,20" />
      <rect x="20" y="50" width="24" height="5" transform="rotate(-6 32 52)" />
      <rect x="23" y="58" width="18" height="5" transform="rotate(-6 32 60)" />
    </>
  ),
  chip: (
    <>
      <polygon points="12,12 52,10 54,52 10,54" />
      <polygon points="22,22 42,21 43,42 21,43" className="fill-cream" />
      <rect x="18" y="2" width="5" height="8" />
      <rect x="30" y="2" width="5" height="8" />
      <rect x="42" y="2" width="5" height="8" />
      <rect x="18" y="56" width="5" height="7" />
      <rect x="30" y="56" width="5" height="7" />
      <rect x="42" y="56" width="5" height="7" />
    </>
  ),
  terminal: (
    <>
      <polygon points="6,10 58,6 60,48 4,52" />
      <polygon points="12,16 52,13 53,42 11,45" className="fill-cream" />
      <polygon points="16,22 28,29 16,36" />
      <polygon points="30,34 46,33 46,38 30,39" />
    </>
  ),
  satellite: (
    <>
      <polygon points="24,22 40,20 42,38 26,40" />
      <polygon points="2,18 20,16 22,40 4,42" />
      <polygon points="44,16 62,14 62,38 46,40" />
      <polygon points="32,40 36,40 38,60 30,60" />
    </>
  ),
  flag: (
    <>
      <polygon points="10,4 18,2 20,62 12,62" />
      <polygon points="20,6 58,12 44,24 56,38 20,36" />
    </>
  ),
  bolt: <polygon points="36,2 12,36 30,36 22,62 52,24 34,24 44,2" />,
};

export function ProjectIcon({ name, size, className, label }: ProjectIconProps) {
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="currentColor" focusable="false" className={className} {...a11y}>
      {shapes[name]}
    </svg>
  );
}
