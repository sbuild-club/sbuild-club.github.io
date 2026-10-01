// Step 4: the overlay dissolves in a stepped pixel-grid wipe (ordered dither plus a
// little noise). Cells under the landing wordmark (the "plate") stay ink until the
// overlay unmounts, so the hero's own #wordmark is never seen twice.

import { fitCanvas, seeded } from "./dom";

export type Wipe = { steps: number; step(index: number): void };

const STEPS = 8;
const SPARK_SHARE = 0.3;
const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function createWipe(
  canvas: HTMLCanvasElement,
  frame: DOMRect,
  plate: DOMRect,
  ink: string,
  spark: string,
): Wipe | null {
  if (!ink) return null;
  const ctx = fitCanvas(canvas, frame);
  if (!ctx) return null;

  const { width, height } = frame;
  const cell = Math.max(20, Math.round(Math.max(width, height) / 36));
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const rand = seeded(0x1d8);

  const pad = cell / 2;
  const plateLeft = plate.left - frame.left - pad;
  const plateTop = plate.top - frame.top - pad;
  const plateRight = plate.right - frame.left + pad;
  const plateBottom = plate.bottom - frame.top + pad;

  // order[i] in [0, 1): the step fraction at which cell i clears. Infinity = plate.
  const order = new Float32Array(cols * rows);
  // A sparse third of cells spark just before clearing; all of them would read as a lattice.
  const sparks = new Uint8Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cell;
      const y = row * cell;
      const onPlate = x < plateRight && x + cell > plateLeft && y < plateBottom && y + cell > plateTop;
      const dither = (BAYER_4[(row % 4) * 4 + (col % 4)] + 0.5) / 16;
      order[row * cols + col] = onPlate ? Infinity : dither * 0.75 + rand() * 0.25;
      sparks[row * cols + col] = rand() < SPARK_SHARE ? 1 : 0;
    }
  }

  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, width, height);

  const inset = Math.round(cell * 0.3);
  return {
    steps: STEPS,
    step(index) {
      const cleared = index / STEPS;
      const now = (index + 1) / STEPS;
      const next = (index + 2) / STEPS;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const t = order[row * cols + col];
          if (t < cleared) continue;
          const x = col * cell;
          const y = row * cell;
          if (t < now) {
            ctx.clearRect(x, y, cell, cell);
          } else if (t < next && spark && sparks[row * cols + col]) {
            // One-step spark on cells that clear next: the wipe's leading edge.
            ctx.fillStyle = spark;
            ctx.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
          }
        }
      }
    },
  };
}
