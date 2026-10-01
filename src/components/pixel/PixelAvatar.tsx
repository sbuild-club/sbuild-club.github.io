import { avatarPattern } from "./avatarPattern";
import { gridToRects } from "./grid";

type PixelAvatarProps = {
  initials: string;
  size?: number;
};

// Silkscreen is drawn on an 8px grid: keep the label at a multiple of 8px.
function labelSize(size: number): number {
  return Math.max(8, Math.floor(size / 32) * 8);
}

// Decorative: Team renders the member's name next to it, so the tile is aria-hidden.
export function PixelAvatar({ initials, size = 64 }: PixelAvatarProps) {
  const { rows, tones } = avatarPattern(initials);
  const rects = gridToRects(rows);

  return (
    <span
      aria-hidden="true"
      className="relative m-0 inline-block shrink-0 overflow-hidden bg-ink align-middle"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 8 8"
        shapeRendering="crispEdges"
        focusable="false"
        className="absolute inset-0 block h-full w-full"
      >
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} className={tones[r.tone]} />
        ))}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="bg-ink px-1 py-0.5 font-pixel leading-none whitespace-nowrap text-paper"
          style={{ fontSize: labelSize(size) }}
        >
          {initials}
        </span>
      </span>
    </span>
  );
}
