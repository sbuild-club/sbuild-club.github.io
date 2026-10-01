// Pixel-art helpers shared by the pixel components.
// Sprites are authored as rows of characters: "." is empty, any other character is a
// filled pixel whose meaning (colour class, opacity) the caller maps.

export type PixelRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: string;
};

/**
 * Turns a character grid into as few rects as practical: horizontal runs of the same
 * character become one rect, and identical runs on consecutive rows are stacked into
 * a taller rect. Pure and deterministic.
 */
export function gridToRects(rows: readonly string[]): PixelRect[] {
  const rects: PixelRect[] = [];
  let open = new Map<string, PixelRect>();

  rows.forEach((row, y) => {
    const next = new Map<string, PixelRect>();
    let x = 0;
    while (x < row.length) {
      const tone = row[x];
      if (tone === ".") {
        x += 1;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === tone) end += 1;
      const w = end - x;
      const key = `${x}:${w}:${tone}`;
      const above = open.get(key);
      if (above && above.y + above.h === y) {
        above.h += 1;
        next.set(key, above);
      } else {
        const rect: PixelRect = { x, y, w, h: 1, tone };
        rects.push(rect);
        next.set(key, rect);
      }
      x = end;
    }
    open = next;
  });

  return rects;
}
