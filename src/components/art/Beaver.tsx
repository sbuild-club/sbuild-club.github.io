// STUB (foundation). Replaced by the art lane with the finished mascot (bark body, navy cap with
// steel brim, blush teeth). Props and root element are frozen (docs/CONTRACT.md §2).
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
      <circle cx="54" cy="62" r="24" className="fill-bark-deep" />
      <circle cx="186" cy="62" r="24" className="fill-bark-deep" />
      <path d="M18 200 L32 100 Q38 66 76 50 L98 38 Q120 30 142 38 L164 50 Q202 66 208 100 L222 200 Z" className="fill-bark" />
      <polygon points="120,34 196,40 182,54 100,48" className="fill-steel" />
      <polygon points="86,44 92,14 126,4 156,14 160,40" className="fill-navy" />
      <circle cx="98" cy="92" r="7" className={cx("fill-bark-deep", styles.eye)} />
      <circle cx="142" cy="92" r="7" className={cx("fill-bark-deep", styles.eye)} />
      <rect x="104" y="104" width="32" height="26" rx="8" className="fill-bark-deep" />
      <path
        d="M120 128 V148 M84 150 Q120 143 156 150"
        strokeWidth="5"
        strokeLinecap="round"
        className="fill-none stroke-bark-deep"
      />
      <rect x="107" y="150" width="12" height="18" rx="3" className="fill-blush" />
      <rect x="121" y="150" width="12" height="18" rx="3" className="fill-blush" />
    </svg>
  );
}
