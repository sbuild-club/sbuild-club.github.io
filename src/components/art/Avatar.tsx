// A team avatar: a round paper disc with a dashed stitch ring sewn just inside its edge (as on the
// badge) and either the initials centred in the display face or, when `photo` is set, the member's
// photo set into the disc with the stitch ring running round it on a coloured rim.
import Image from "next/image";
import { cx } from "@/components/ui/cx";

export type AvatarTone = "sage" | "sage-soft" | "steel" | "teal" | "navy";

type AvatarProps = {
  initials: string;
  /** Rendered width and height in px. Default 124. Ignored when `className` sets the size. */
  size?: number;
  /** Size classes (e.g. "size-40 sm:size-48") for a responsive avatar; they replace `size`. */
  className?: string;
  /** Disc colour. Omitted: picked from the initials by a pure function (same on server and client). */
  tone?: AvatarTone;
  /** A square photo under public/, e.g. "/team/jane-doe.jpg". Replaces the initials. */
  photo?: string;
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

/**
 * Decorative: Team renders the member's name next to it, so the whole avatar is aria-hidden.
 * The root is a size container, so the initials (27% of the width) scale with any size.
 * With a photo, the photo fills the disc out to radius 42 of 100 and the stitch ring moves out to
 * radius 46, onto the coloured rim, so it never crosses the face.
 */
export function Avatar({ initials, size = 124, className, tone, photo }: AvatarProps) {
  const t = tone ?? toneFor(initials);

  return (
    <span
      aria-hidden="true"
      className={cx("@container relative m-0 inline-block shrink-0 align-middle", className)}
      style={className ? undefined : { width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" focusable="false" className="absolute inset-0 block h-full w-full">
        <circle cx="50" cy="50" r="50" className={discs[t]} />
        <circle
          cx="50"
          cy="50"
          r={photo ? 46 : 44}
          strokeWidth="2.6"
          strokeDasharray="6.5 4.5"
          strokeLinecap="round"
          className={cx("fill-none", rings[t])}
        />
      </svg>
      {photo ? (
        <span className="absolute inset-[8%] overflow-hidden rounded-full">
          <Image src={photo} alt="" fill unoptimized className="object-cover" />
        </span>
      ) : (
        <span
          className={cx(
            "absolute inset-0 flex items-center justify-center font-display text-[length:27cqi] leading-none",
            inks[t],
          )}
        >
          {initials}
        </span>
      )}
    </span>
  );
}
