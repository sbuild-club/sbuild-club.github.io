// Lays the wordmark letters along an upward arc (the round badge's curved wordmark). Pure maths on
// wordmarkPaths, evaluated once at module load, so it is the same on server and client and keeps
// working whatever values the traced geometry holds.
import { wordmarkPaths, type WordmarkPoint } from "./wordmarkPaths";

/** 2D affine matrix [a, b, c, d, e, f], as in SVG `matrix(a b c d e f)`. */
export type Matrix = readonly [number, number, number, number, number, number];

const { width: W, height: H } = wordmarkPaths.viewBox;

function bounds(points: readonly WordmarkPoint[]) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of points) {
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1 };
}

const all = bounds(wordmarkPaths.letters.flatMap((l) => l.points));
const midX = (all.x0 + all.x1) / 2;
const midY = (all.y0 + all.y1) / 2;

function apply(m: Matrix, [x, y]: WordmarkPoint): WordmarkPoint {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

function multiply(p: Matrix, q: Matrix): Matrix {
  return [
    p[0] * q[0] + p[2] * q[1],
    p[1] * q[0] + p[3] * q[1],
    p[0] * q[2] + p[2] * q[3],
    p[1] * q[2] + p[3] * q[3],
    p[0] * q[4] + p[2] * q[5] + p[4],
    p[1] * q[4] + p[3] * q[5] + p[5],
  ];
}

/**
 * One matrix per letter that bends the straight wordmark around a circle centred (cx, cy).
 * `radius` is where the word's vertical middle runs; `scale` shrinks the letters. Arc length
 * along the circle equals the scaled horizontal distance from the word's centre, so spacing and
 * each letter's own tilt and height are kept.
 */
export function arcMatrices(cx: number, cy: number, radius: number, scale: number): Matrix[] {
  return wordmarkPaths.letters.map((letter) => {
    const b = bounds(letter.points);
    const lx = (b.x0 + b.x1) / 2;
    const phi = ((lx - midX) * scale) / radius;
    const cos = Math.cos(phi);
    const sin = Math.sin(phi);
    const px = cx + radius * sin;
    const py = cy - radius * cos;
    // translate(px, py) · rotate(phi) · scale(scale) · translate(-lx, -midY)
    const a = scale * cos;
    const bb = scale * sin;
    const c = -scale * sin;
    const d = scale * cos;
    return [a, bb, c, d, px - a * lx - c * midY, py - bb * lx - d * midY] as const;
  });
}

/** SVG transform attribute for a matrix (rounded to keep the markup short). */
export function matrixAttr(m: Matrix): string {
  return `matrix(${m.map((v) => Math.round(v * 10000) / 10000).join(" ")})`;
}

/**
 * The arced variant inside the wordmark's own viewBox: a 40-degree arc, then fitted (uniform
 * scale, centred) so every letter stays inside the viewBox with a small margin.
 */
function fittedArc(): Matrix[] {
  const raw = arcMatrices(0, 0, (all.x1 - all.x0) / ((40 * Math.PI) / 180), 1);
  const pts = wordmarkPaths.letters.flatMap((l, i) => l.points.map((p) => apply(raw[i], p)));
  const b = bounds(pts);
  const margin = 6;
  const k = Math.min((W - 2 * margin) / (b.x1 - b.x0), (H - 2 * margin) / (b.y1 - b.y0));
  const fit: Matrix = [k, 0, 0, k, W / 2 - (k * (b.x0 + b.x1)) / 2, H / 2 - (k * (b.y0 + b.y1)) / 2];
  return raw.map((m) => multiply(fit, m));
}

export const arcedWordmark: readonly Matrix[] = fittedArc();
