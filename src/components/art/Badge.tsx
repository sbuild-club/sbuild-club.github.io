// STUB (foundation). Replaced by the art lane with the real round logo (arced wordmark over the
// beaver, inside a stitch ring). Props and root element are frozen (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

type BadgeProps = {
  /** Rendered width and height in px. Default 52. */
  size?: number;
  /** Accessible name. Without it the svg is aria-hidden. */
  title?: string;
  /** Layout, size and transform classes only. */
  className?: string;
};

export function Badge({ size = 52, title, className }: BadgeProps) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" className={cx("block", className)} {...a11y}>
      <circle cx="50" cy="50" r="50" className="fill-sage" />
      <circle
        cx="50"
        cy="50"
        r="43"
        strokeWidth="3"
        strokeDasharray="7 5"
        strokeLinecap="round"
        className="fill-none stroke-cream"
      />
      <circle cx="31" cy="55" r="9" className="fill-bark-deep" />
      <circle cx="69" cy="55" r="9" className="fill-bark-deep" />
      <path d="M22 100 L27 68 Q30 54 42 49 Q50 45 58 49 Q70 54 73 68 L78 100 Z" className="fill-bark" />
      <polygon points="38,48 41,36 54,33 63,38 64,48" className="fill-navy" />
      <circle cx="43" cy="64" r="3" className="fill-bark-deep" />
      <circle cx="57" cy="64" r="3" className="fill-bark-deep" />
      <rect x="44" y="69" width="12" height="9" rx="3" className="fill-bark-deep" />
      <rect x="45" y="83" width="4.5" height="7" rx="1" className="fill-blush" />
      <rect x="50.5" y="83" width="4.5" height="7" rx="1" className="fill-blush" />
    </svg>
  );
}
