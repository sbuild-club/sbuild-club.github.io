// Step 3: pixel blocks fly in from off-screen and snap into the wordmark's shape.
// The shape is sampled from the intro span itself, so the blocks line up with the
// real glyphs and the cross-fade into the span reads as one image resolving.

import { fitCanvas, glyphBoxes, seeded, textBox } from "./dom";
import type { Scope } from "./scope";

export type WordShape = { cell: number; cells: Array<{ x: number; y: number }> };

export type BlockPalette = { flight: string[]; landed: string };

const COVERAGE = 0.5;
const SWEEP_MS = 220;
const JITTER_MS = 120;
const FLIGHT_MS = 360;
const FLIGHT_JITTER_MS = 140;

/** Rasterises the span's text and returns the grid cells it covers (viewport px), or null. */
export function sampleWordmark(word: HTMLElement): WordShape | null {
  const box = textBox(word);
  const glyphs = glyphBoxes(word);
  if (!box || glyphs.length === 0) return null;

  const style = getComputedStyle(word);
  const fontSize = parseFloat(style.fontSize);
  if (!(fontSize > 0)) return null;

  const cell = Math.max(4, Math.round(fontSize / 14));
  const left = Math.floor(box.left) - cell;
  const top = Math.floor(box.top) - cell;
  const width = Math.ceil(box.width) + cell * 3;
  const height = Math.ceil(box.height) + cell * 3;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = style.color;
  const metrics = ctx.measureText(word.textContent ?? "");
  // The canvas rejected the font string (it keeps its 10px default): no reliable shape.
  if (!(metrics.width > box.width * 0.6)) return null;
  const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent || fontSize * 0.8;
  const lower = style.textTransform === "lowercase";
  // One glyph at a time at the DOM's own x positions: kerning and tracking come for free.
  for (const { char, rect } of glyphs) {
    ctx.fillText(lower ? char.toLowerCase() : char, rect.left - left, rect.top - top + ascent);
  }

  const alpha = ctx.getImageData(0, 0, width, height).data;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const probe = Math.max(1, Math.floor(cell / 4));
  const cells: WordShape["cells"] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let hits = 0;
      let samples = 0;
      for (let y = row * cell + (probe >> 1); y < (row + 1) * cell; y += probe) {
        for (let x = col * cell + (probe >> 1); x < (col + 1) * cell; x += probe) {
          samples++;
          if (alpha[(y * width + x) * 4 + 3] > 127) hits++;
        }
      }
      if (samples > 0 && hits / samples >= COVERAGE) cells.push({ x: left + col * cell, y: top + row * cell });
    }
  }

  // A blank or noise-filled readback (privacy modes) gives no usable shape.
  if (cells.length === 0 || cells.length > rows * cols * 0.8) return null;
  return { cell, cells };
}

type Flight = { tx: number; ty: number; sx: number; sy: number; delay: number; duration: number; colour: string };

/** Animates the swarm on `canvas` (covering `frame`) and leaves the assembled wordmark drawn. */
export async function flyIn(
  canvas: HTMLCanvasElement,
  frame: DOMRect,
  shape: WordShape,
  palette: BlockPalette,
  scope: Scope,
): Promise<void> {
  const ctx = fitCanvas(canvas, frame);
  if (!ctx) return;

  const { cell, cells } = shape;
  const rand = seeded(0x5b11d);
  const centreX = frame.width / 2;
  const centreY = frame.height / 2;
  // Start every block beyond the viewport's half-diagonal, so they all fly in from outside.
  const reach = Math.hypot(frame.width, frame.height) / 2 + cell * 2;

  let minX = Infinity;
  let maxX = -Infinity;
  for (const { x } of cells) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  }
  const spread = Math.max(1, maxX - minX);

  let total = 0;
  const flights: Flight[] = cells.map(({ x, y }) => {
    const angle = rand() * Math.PI * 2;
    const distance = reach * (1 + rand() * 0.5);
    const flight: Flight = {
      tx: x - frame.left,
      ty: y - frame.top,
      sx: centreX + Math.cos(angle) * distance,
      sy: centreY + Math.sin(angle) * distance,
      delay: ((x - minX) / spread) * SWEEP_MS + rand() * JITTER_MS,
      duration: FLIGHT_MS + rand() * FLIGHT_JITTER_MS,
      colour: palette.flight[Math.floor(rand() * palette.flight.length)] ?? palette.landed,
    };
    total = Math.max(total, flight.delay + flight.duration);
    return flight;
  });

  const size = cell - Math.max(1, Math.round(cell / 8));
  const draw = (elapsed: number) => {
    ctx.clearRect(0, 0, frame.width, frame.height);
    for (const f of flights) {
      const t = Math.min(1, Math.max(0, (elapsed - f.delay) / f.duration));
      const eased = 1 - (1 - t) ** 3;
      // Grid-locked motion: blocks hop cell by cell and land exactly on their slot.
      const x = f.tx + Math.round(((f.sx - f.tx) * (1 - eased)) / cell) * cell;
      const y = f.ty + Math.round(((f.sy - f.ty) * (1 - eased)) / cell) * cell;
      ctx.fillStyle = t >= 1 ? palette.landed : f.colour;
      ctx.fillRect(x, y, size, size);
    }
  };

  const start = await scope.frame();
  let now = start;
  for (;;) {
    const elapsed = now - start;
    draw(elapsed);
    if (elapsed >= total) return;
    now = await scope.frame();
  }
}
