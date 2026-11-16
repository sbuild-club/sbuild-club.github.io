// STUB (foundation). Replaced by the art lane: lightbulb with a raised fist inside, optional ray
// burst. Props and root element are frozen (docs/CONTRACT.md §2).
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

export function Lightbulb({ rays = false, tone = "mint", size, title, className }: LightbulbProps) {
  const box = rays ? { x: 0, y: 0, w: 200, h: 120 } : { x: 60, y: 14, w: 80, h: 96 };
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
        {rays ? (
          <>
            <polygon points="66,52 8,44 6,60" />
            <polygon points="70,34 30,6 22,18" />
            <polygon points="70,68 20,92 28,102" />
            <polygon points="136,50 194,40 196,56" />
            <polygon points="132,32 170,2 178,12" />
            <polygon points="134,66 182,88 176,98" />
          </>
        ) : null}
        <polygon points="86,22 114,20 128,38 124,62 112,72 90,72 76,60 74,38" />
        <rect x="88" y="78" width="26" height="6" transform="rotate(-10 101 81)" />
        <rect x="90" y="88" width="22" height="6" transform="rotate(-10 101 91)" />
        <rect x="93" y="98" width="16" height="6" transform="rotate(-10 101 101)" />
      </g>
      <path
        d="M92 34 v14 M99 32 v16 M106 34 v14 M112 40 v10 M92 48 h20 v8 h-14 v10"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-cream"
      />
    </svg>
  );
}
