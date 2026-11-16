// The SBUILD wordmark, traced from docs/reference/sbuild-banner.png (letter outlines followed on
// the pixel grid, then simplified to their cut corners). The TYPES in this file are frozen:
// Wordmark (art lane) draws from this data and the intro lane animates keycaps into these polygons.
//
// Units: 1 viewBox unit = 1 banner pixel; the banner's letters span x 447–1470, y 83–290, shifted
// here by (-437, -75). Every letter keeps its own tilt, height and baseline wobble from the banner.

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

export const wordmarkPaths: WordmarkGeometry = {
  viewBox: { width: 1044, height: 224 },
  letters: [
    {
      char: "S",
      fill: "navy",
      points: [
        [42, 43], [122, 14], [152, 18], [181, 56], [138, 87], [113, 66], [106, 62], [115, 90], [167, 119],
        [183, 159], [170, 172], [141, 199], [85, 204], [39, 187], [10, 139], [56, 113], [81, 150], [116, 137],
        [69, 117], [27, 72],
      ],
    },
    {
      char: "B",
      fill: "steel",
      points: [
        [243, 16], [316, 13], [352, 28], [368, 70], [363, 81], [360, 91], [391, 127], [389, 154], [340, 201],
        [287, 212], [227, 200], [237, 157], [249, 158], [234, 124],
        // lower counter
        [299, 121], [305, 158], [312, 161], [324, 153], [299, 121],
        [234, 124], [228, 77],
        // upper counter
        [288, 68], [290, 80], [308, 70], [288, 68],
        [228, 77], [222, 77], [197, 44],
      ],
    },
    {
      char: "U",
      fill: "steel",
      points: [
        [414, 8], [471, 8], [468, 81], [505, 95], [509, 77], [504, 8], [563, 8], [563, 84], [545, 163],
        [517, 194], [439, 186], [414, 140], [409, 82],
      ],
    },
    {
      char: "I",
      fill: "steel",
      points: [
        [612, 12], [697, 14], [701, 49], [682, 67], [688, 159], [696, 161], [693, 199], [614, 195], [607, 178],
        [605, 159], [622, 150], [626, 57], [613, 57],
      ],
    },
    {
      char: "L",
      fill: "steel",
      points: [
        [747, 10], [804, 25], [792, 138], [800, 163], [842, 154], [859, 196], [845, 211], [779, 215], [740, 179],
        [733, 120],
      ],
    },
    {
      char: "D",
      fill: "steel",
      points: [
        [960, 13], [1033, 69], [1025, 154], [1019, 162], [972, 204], [932, 212], [873, 189], [896, 154],
        [907, 159], [905, 123], [893, 78],
        // counter
        [957, 66], [961, 141], [963, 148], [983, 85], [957, 66],
        [893, 78], [888, 77], [864, 33], [887, 20],
      ],
    },
  ],
};

/** `points` as an SVG `points` attribute string. */
export function toPointsAttr(points: readonly WordmarkPoint[]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}
