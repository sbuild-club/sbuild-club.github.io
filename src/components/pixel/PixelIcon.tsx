export type PixelIconName = "rocket" | "wrench" | "lightbulb" | "chip" | "terminal" | "satellite" | "flag" | "bolt";

type PixelIconProps = {
  name: PixelIconName;
  size: number;
  className?: string;
  label?: string;
};

// Stub: the pixel lane replaces this with the 16×16 SVG icon set.
export function PixelIcon({ name, size, className, label }: PixelIconProps) {
  return (
    <span
      className={["inline-block border-2 border-dashed border-paper/40 p-2 font-mono text-xs text-paper/70", className]
        .filter(Boolean)
        .join(" ")}
      style={{ minWidth: size, minHeight: size }}
    >
      PixelIcon {name} {label}
    </span>
  );
}
