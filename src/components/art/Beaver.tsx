// The beaver mascot, redrawn from the banner: a broad bark body rising from the bottom edge,
// bark-deep ears, eyes, nose and mouth, two blush teeth, and a navy cap with its steel brim
// pointing right. Props and root element are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";
import styles from "./Beaver.module.css";

type BeaverProps = {
  /** Rendered width in px; height follows the 240×200 viewBox. Default 240. */
  size?: number;
  /** Idle blink (only after the intro, only with motion allowed). Default true. */
  blink?: boolean;
  /** Layout, size and transform classes only. */
  className?: string;
};

export function Beaver({ size = 240, blink = true, className }: BeaverProps) {
  return (
    <svg
      viewBox="0 0 240 200"
      width={size}
      height={(size * 200) / 240}
      aria-hidden="true"
      focusable="false"
      className={cx("block", blink && styles.blink, className)}
    >
      {/* Everything above the shoulders sits 14 units higher than in the banner, so a beaver
          whose box is cut off a little at the bottom still shows its teeth. */}
      {/* ears, tucked behind the head */}
      <g transform="translate(0 -14)">
        <path d="M20 112 Q18 80 44 76 Q66 74 70 98 Z" className="fill-bark-deep" />
        <path d="M168 76 Q170 56 192 56 Q214 58 214 86 Z" className="fill-bark-deep" />
      </g>
      {/* head and body: one cut piece with rounded shoulders, high under the cap */}
      <path
        d="M0 200 L1 186 L4 128 Q6 104 25 94 L88 49 L122 42 L170 50 Q208 58 223 86 Q228 96 229 110 L240 186 L240 200 Z"
        className="fill-bark"
      />
      <g transform="translate(0 -14)">
        {/* cap: steel brim to the right, navy crown over it */}
        <polygon points="104,64 121,48 166,49 171,60 154,71" className="fill-steel" />
        <polygon
          points="84.6,39.6 94.2,28.4 110.4,21.8 133.2,26.4 145.2,44.9 143.4,51.5 130.2,56.1 112.2,61.4 91.2,64.7 84.6,61.4"
          className="fill-navy"
        />
        {/* face */}
        <circle cx="97" cy="93" r="6.6" className={cx("fill-bark-deep", styles.eye)} />
        <circle cx="140.5" cy="93" r="6.6" className={cx("fill-bark-deep", styles.eye)} />
        <rect x="100" y="103.5" width="37" height="29" rx="6" className="fill-bark-deep" />
        <rect x="116.2" y="130" width="4.4" height="25" className="fill-bark-deep" />
        <path d="M85 155.5 Q90 171 104 171.5 L134 171.5 Q148 171 152.5 155.5 Z" className="fill-bark-deep" />
        {/* two teeth cut as one piece, notched between them */}
        <path
          d="M103 157 L134 157 L134 175.5 Q134 180.5 129 180.5 L124.5 180.5 Q120.5 180.5 118.5 176 Q116.5 180.5 112.5 180.5 L108 180.5 Q103 180.5 103 175.5 Z"
          className="fill-blush"
        />
        <path
          d="M79 153 L118.5 157.5 L158.5 153"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-none stroke-bark-deep"
        />
      </g>
    </svg>
  );
}
