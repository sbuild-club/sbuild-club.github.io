// Deterministic 8×8 mirrored pixel pattern for PixelAvatar.
// A pure function of the initials: same input, same pattern, on server and client.

// Static class names so Tailwind can see them. [primary, secondary]
const palettes = [
  ["fill-signal", "fill-amber"],
  ["fill-amber", "fill-signal"],
  ["fill-signal", "fill-paper"],
] as const;

export type AvatarPattern = {
  /** 8 rows of 8 characters: "." empty, "1" primary tone, "2" secondary tone. */
  rows: string[];
  tones: Record<string, string>;
};

// FNV-1a, 32-bit.
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: tiny seeded PRNG, returns a function yielding [0, 1).
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function avatarPattern(initials: string): AvatarPattern {
  const seed = hash(initials.trim().toLowerCase());
  const next = seeded(seed);
  const [primary, secondary] = palettes[seed % palettes.length];

  const rows: string[] = [];
  let filled = 0;
  for (let y = 0; y < 8; y += 1) {
    let half = "";
    for (let x = 0; x < 4; x += 1) {
      const r = next();
      const cell = r < 0.42 ? "1" : r < 0.56 ? "2" : ".";
      if (cell !== ".") filled += 1;
      half += cell;
    }
    rows.push(half + half.split("").reverse().join(""));
  }

  // Never render a blank tile: fall back to a corner frame.
  if (filled === 0) {
    rows[0] = "11....11";
    rows[7] = "11....11";
  }

  return { rows, tones: { "1": primary, "2": secondary } };
}
