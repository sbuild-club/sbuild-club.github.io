type PixelAvatarProps = {
  initials: string;
  size?: number;
};

// Stub: the pixel lane replaces this.
export function PixelAvatar({ initials, size = 64 }: PixelAvatarProps) {
  return (
    <span
      className="inline-block border-2 border-dashed border-paper/40 font-mono text-xs text-paper/70"
      style={{ width: size, height: size }}
    >
      PixelAvatar {initials}
    </span>
  );
}
