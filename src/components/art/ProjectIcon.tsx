// The eight project icons as single-colour cut-paper shapes. Each is one or a few crooked pieces
// filled with currentColor; windows and slots are real holes (fill-rule evenodd), so the tile
// colour shows through whatever the ground is. Drawn bold enough to read at 48–64px.
// The name union, props and root element are frozen (docs/CONTRACT.md §2); src/content/site.ts
// imports ProjectIconName.

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

// Each piece is its own path (pieces may overlap); holes live inside a piece's own path.
type Shape = { pieces: readonly string[]; transform?: string };

const shapes: Record<ProjectIconName, Shape> = {
  // Upright rocket with fins, a porthole and a separate flame.
  rocket: {
    pieces: [
      "M32 2 L44 13 L47 35 L56 46 L55 58 L45 51 L19 52 L9 59 L8 47 L17 35 L20 14 Z M27.5 21 L36.5 20.5 L39.5 27 L36.5 33.5 L27.5 34 L24.5 27 Z",
      "M24 55 L40 54.5 L36.5 63.5 L32 59.5 L27.5 64 Z",
    ],
  },
  // Open-ended spanner, drawn level and turned on the diagonal.
  wrench: {
    pieces: ["M3 27 L35 26 L37 21 L42 17.5 L50 17 L57 20 L62 27 L50 28 L50 36.5 L62 37 L57.5 44 L50 47 L42 46 L37.5 42.5 L35 38 L3 38.5 Z"],
    transform: "rotate(-42 32 32)",
  },
  // Bulb with a zig-zag filament cut out, and three base stripes.
  lightbulb: {
    pieces: [
      "M20 4 L43 3 L55 15 L56 30 L47 40 L45 46 L21 47 L18 40 L9 30 L8 15 Z M21 22 L27 16 L32 23 L37 16 L43 22 L40 25 L37 22 L32 29 L27 22 L24 25 Z",
      "M20 50 L45 49 L45.5 54 L20.5 55 Z",
      "M23 57.5 L42 57 L41.5 62 L24 62.5 Z",
    ],
  },
  // Chip with a window and pins on all four sides.
  chip: {
    pieces: [
      "M13 12 L51 11 L52.5 52 L12 53 Z M22 21 L42 20.5 L43 42 L21 43 Z",
      "M18 3 L23 3 L23 11 L18 11 Z M29.5 3 L34.5 3 L34.5 11 L29.5 11 Z M41 3.5 L46 3 L46 11 L41 11 Z",
      "M18 53 L23 53 L23 61 L18 61.5 Z M29.5 53 L34.5 53 L34.5 61 L29.5 61 Z M41 52.5 L46 52.5 L46 61 L41 61 Z",
      "M3 18 L13 18 L13 23 L3 23 Z M3 29.5 L12.5 29.5 L12.5 34.5 L3 34.5 Z M3 41 L12.5 41 L12.5 46 L3.5 46 Z",
      "M52 18 L61 18 L61 23 L52 23 Z M52 29.5 L61 29.5 L61 34.5 L52 34.5 Z M52.5 41 L61 41 L61 46 L52.5 46 Z",
    ],
  },
  // Window with a title bar; prompt chevron and cursor sit in the cut-out screen.
  terminal: {
    pieces: [
      "M5 9 L59 6 L60.5 53 L4 56 Z M10 18 L54 15.5 L55 47.5 L9.5 50.5 Z",
      "M15 25 L29 31.5 L15.5 39.5 L15 34 L22 31.5 L15 29.5 Z",
      "M31 38 L47 37 L47 42 L31.5 43 Z",
    ],
  },
  // Satellite: body, dish and antenna, two slatted solar panels on short arms; tipped over.
  satellite: {
    pieces: [
      "M24 21 L40 20.5 L41 43 L25 43.5 Z",
      "M23 18.5 L41 18 L38 11 L32 8.5 L26 11 Z",
      "M31 1 L34 1 L34.5 9.5 L30.5 9.5 Z",
      "M0 17 L21 18 L20.5 46 L1 45 Z M9 22 L12.5 22 L12.5 41 L9 41 Z",
      "M19.5 29 L25.5 29 L25.5 35 L19.5 35 Z",
      "M43.5 18.5 L64 18 L63.5 46 L44 46.5 Z M52 22 L55.5 22 L55.5 41 L52 41 Z",
      "M39.5 29 L45 29 L45 35 L39.5 35 Z",
    ],
    transform: "translate(32 32) rotate(-24) scale(0.88) translate(-32 -32)",
  },
  // Pole on a foot, with a swallow-tailed pennant.
  flag: {
    pieces: [
      "M10 5 L16.5 4 L18 58 L11.5 58.5 Z",
      "M5 57 L24 56 L25 62 L4 62.5 Z",
      "M17 7 L57 11 L45 23 L58 35.5 L17.5 33 Z",
    ],
  },
  // Lightning bolt.
  bolt: {
    pieces: ["M38 2 L11 37 L28.5 35.5 L20 62 L54 23.5 L35.5 25 L47 3 Z"],
  },
};

export function ProjectIcon({ name, size, className, label }: ProjectIconProps) {
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };
  const shape = shapes[name];

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="currentColor" focusable="false" className={className} {...a11y}>
      <g transform={shape.transform}>
        {shape.pieces.map((d, i) => (
          <path key={i} d={d} fillRule="evenodd" />
        ))}
      </g>
    </svg>
  );
}
