// The idea bulb from the banner: a crooked cut-paper bulb with a raised fist cut out of it in
// cream, three base stripes, and an optional burst of long thin rays pointing in at it.
// Props and root element are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type LightbulbProps = {
  /** Draws the ray burst around the bulb. The viewBox widens to 200×120 when on (80×96 when off). */
  rays?: boolean;
  /** mint = emphasis art (default); steel = quiet icon use on sage-soft or cream. */
  tone?: "mint" | "steel";
  /** Rendered width in px; height follows the viewBox. Default 200 with rays, 80 without. */
  size?: number;
  /** Accessible name. Without it the svg is aria-hidden. */
  title?: string;
  /** Layout, size and transform classes only. */
  className?: string;
};

// Static class names so Tailwind can see them.
const tones = {
  mint: "fill-mint",
  steel: "fill-steel",
} as const;

// Long thin wedges, wide at the outside, tips aimed at the bulb (uneven lengths, as cut by hand).
const rays = [
  "70,50 4,40 6,56",
  "72,32 26,4 18,14",
  "70,68 14,86 20,98",
  "88,18 74,0 86,0",
  "132,48 196,34 198,50",
  "128,28 164,2 174,10",
  "132,66 184,92 178,104",
];

export function Lightbulb({ rays: withRays = false, tone = "mint", size, title, className }: LightbulbProps) {
  const box = withRays ? { x: 0, y: 0, w: 200, h: 120 } : { x: 60, y: 14, w: 80, h: 96 };
  const width = size ?? box.w;
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      width={width}
      height={(width * box.h) / box.w}
      focusable="false"
      className={cx("block", className)}
      {...a11y}
    >
      <g className={tones[tone]}>
        {withRays ? rays.map((points, i) => <polygon key={i} points={points} />) : null}
        {/* bulb: a crooked octagon that narrows into the neck */}
        <polygon points="85,19 113,17 129,31 131,51 120,64 115,75 89,77 85,66 73,55 71,34" />
        {/* base: three stripes, each shorter, all tipped the same way */}
        <polygon points="87,81 116,79 117,85 88,87" />
        <polygon points="89,90 114,88 115,94 90,96" />
        <polygon points="93,99 110,98 110,104 94,105" />
      </g>
      {/* raised fist, cut out of the bulb: knuckles, fist, thumb fold, forearm */}
      <path
        d="M88 34 L91 29 L95 29 L96.5 31 L98 27.5 L102 27.5 L103 30 L104.5 27.5 L108.5 28 L109.5 31 L112 30.5 L114.5 33 L115 41 L112.5 48 L107.5 51.5 L107 68 L96 68.5 L95.5 52 L90 48.5 L87.5 41 Z M91 40.5 L106 39.5 L106.5 43.5 L91.5 44.5 Z"
        fillRule="evenodd"
        className="fill-cream"
      />
    </svg>
  );
}
