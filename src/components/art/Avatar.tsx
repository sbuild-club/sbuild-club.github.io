// A team avatar: a round paper disc with a dashed stitch ring sewn just inside its edge (as on the
// badge) and the initials centred in the display face. Props and root element are frozen
// (docs/CONTRACT.md §2).
import { cx } from "@/components/ui/cx";

export type AvatarTone = "sage" | "sage-soft" | "steel" | "teal" | "navy";

type AvatarProps = {
  initials: string;
  /** Rendered width and height in px. Default 124. */
  size?: number;
  /** Disc colour. Omitted: picked from the initials by a pure function (same on server and client). */
  tone?: AvatarTone;
};

const order: readonly AvatarTone[] = ["sage", "steel", "teal", "sage-soft", "navy"];

// Static class names so Tailwind can see them. Initials: navy on the light discs, cream on the dark.
const discs: Record<AvatarTone, string> = {
  sage: "fill-sage",
  "sage-soft": "fill-sage-soft",
  steel: "fill-steel",
  teal: "fill-teal",
  navy: "fill-navy",
};

const inks: Record<AvatarTone, string> = {
  sage: "text-navy",
  "sage-soft": "text-navy",
  steel: "text-cream",
  teal: "text-cream",
  navy: "text-cream",
};

const rings: Record<AvatarTone, string> = {
  sage: "stroke-cream",
  "sage-soft": "stroke-cream",
  steel: "stroke-cream",
  teal: "stroke-cream",
  navy: "stroke-steel",
};

function toneFor(initials: string): AvatarTone {
  let sum = 0;
  for (let i = 0; i < initials.length; i += 1) sum += initials.charCodeAt(i);
  return order[sum % order.length];
}

/** Decorative: Team renders the member's name next to it, so the whole avatar is aria-hidden. */
export function Avatar({ initials, size = 124, tone }: AvatarProps) {
  const t = tone ?? toneFor(initials);

  return (
    <span
      aria-hidden="true"
      className="relative m-0 inline-block shrink-0 align-middle"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" focusable="false" className="absolute inset-0 block h-full w-full">
        <circle cx="50" cy="50" r="50" className={discs[t]} />
        <circle
          cx="50"
          cy="50"
          r="44"
          strokeWidth="2.6"
          strokeDasharray="6.5 4.5"
          strokeLinecap="round"
          className={cx("fill-none", rings[t])}
        />
      </svg>
      <span
        className={cx("absolute inset-0 flex items-center justify-center font-display leading-none", inks[t])}
        style={{ fontSize: Math.round(size * 0.27) }}
      >
        {initials}
      </span>
    </span>
  );
}
