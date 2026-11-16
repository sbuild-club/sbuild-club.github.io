// STUB (foundation). The art lane replaces the placeholder polygons below with letter shapes
// traced from docs/reference/sbuild-banner.png. The TYPES in this file are frozen: Wordmark
// (art lane) draws from this data and the intro lane animates keycaps into these polygons.

/** The six letters of the wordmark, in order. */
export type WordmarkChar = "S" | "B" | "U" | "I" | "L" | "D";

/** Colour token for a letter: the S is navy, the rest are steel (as in the banner). */
export type WordmarkFill = "navy" | "steel";

/** One vertex, in viewBox units: [x, y]. */
export type WordmarkPoint = readonly [number, number];

export type WordmarkLetter = {
  char: WordmarkChar;
  fill: WordmarkFill;
  /**
   * One closed polygon, in viewBox units, listed in drawing order. Draw with fill-rule="evenodd".
   * Counters (the holes in B and D) are traced into the same list through a zero-width bridge
   * (go in, trace the hole, come back out the same way), so every letter stays one polygon.
   */
  points: readonly WordmarkPoint[];
};

export type WordmarkGeometry = {
  /** viewBox is `0 0 width height`. Every point lies inside it. */
  viewBox: { readonly width: number; readonly height: number };
  /** Exactly six entries, in reading order: S, B, U, I, L, D. */
  letters: readonly [WordmarkLetter, WordmarkLetter, WordmarkLetter, WordmarkLetter, WordmarkLetter, WordmarkLetter];
};

// Placeholder: six 150×220 blocks, 20 units apart, starting at x = 10.
function block(char: WordmarkChar, fill: WordmarkFill, index: number): WordmarkLetter {
  const x = 10 + index * 170;
  return {
    char,
    fill,
    points: [
      [x, 10],
      [x + 150, 10],
      [x + 150, 230],
      [x, 230],
    ],
  };
}

export const wordmarkPaths: WordmarkGeometry = {
  viewBox: { width: 1030, height: 240 },
  letters: [
    block("S", "navy", 0),
    block("B", "steel", 1),
    block("U", "steel", 2),
    block("I", "steel", 3),
    block("L", "steel", 4),
    block("D", "steel", 5),
  ],
};

/** `points` as an SVG `points` attribute string. */
export function toPointsAttr(points: readonly WordmarkPoint[]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}
