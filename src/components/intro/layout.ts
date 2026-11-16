// Where everything sits during the intro, computed once per run from the overlay's box and
// wordmarkPaths. Plain module: call from effects only. Works for any wordmarkPaths values of
// the contracted shape (any viewBox aspect, any polygons).

import type { WordmarkGeometry, WordmarkPoint } from "@/components/art/wordmarkPaths";

export type Box = { left: number; top: number; width: number; height: number };

/** One keycap: its home is the centre of its letter; the offsets are relative to that home. */
export type KeyPlan = {
  /** Top-left of the key element (its home), in overlay px. */
  left: number;
  top: number;
  /** Where the key lands after the drop, relative to its home. */
  dx: number;
  dy: number;
  /** Start of the fall, relative to its home (above the top edge). */
  fromY: number;
  /** Resting tilt after the drop and the extra spin it falls with, in degrees. */
  tilt: number;
  spin: number;
};

export type IntroLayout = {
  /** viewBox width / height. */
  aspect: number;
  /** The assembled name, in overlay px (same aspect as the viewBox). */
  stage: Box;
  /** Keycap width in px (height is 0.8 of it, the Keycap's 120×96 viewBox). */
  key: number;
  keys: KeyPlan[];
  /** The mint burst: a square behind the last letter's top-right corner. */
  burst: Box;
  /** Top of the tagline plaque's row, just under the name, in overlay px. */
  plaqueTop: number;
  /** Pivot the cap lands around: top centre of the first letter, in viewBox units. */
  capPivot: { x: number; y: number };
};

const KEY_ASPECT = 96 / 120;

// Hand-placed scatter, so every visit drops the keys the same way. Key i lands in slot SLOT[i]
// (spread across the screen) and slides home from there; Y is in key widths from the name's
// centre line. Tilts and spins alternate so neighbours never match.
const SLOT = [1, 0, 3, 5, 2, 4] as const;
const SCATTER_Y = [0.95, -0.7, 0.55, -0.9, 0.8, -0.45] as const;
const TILT = [-14, 11, -7, 16, -11, 6] as const;
const SPIN = [-190, 150, -120, 210, -160, 130] as const;

/** viewBox width / height, or null when the geometry can't be drawn. */
export function viewBoxAspect(geometry: WordmarkGeometry): number | null {
  const { width, height } = geometry.viewBox;
  const aspect = width / height;
  return width > 0 && height > 0 && Number.isFinite(aspect) ? aspect : null;
}

function bounds(points: readonly WordmarkPoint[]): Box | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX + minY + maxX + maxY)) return null;
  return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
}

function clamp(value: number, min: number, max: number): number {
  return min > max ? (min + max) / 2 : Math.min(max, Math.max(min, value));
}

/** The largest box of the given aspect, centred in `outer`. Equals `outer` when the aspects match. */
export function fitBox(outer: Box, aspect: number): Box {
  const width = Math.min(outer.width, outer.height * aspect);
  const height = width / aspect;
  return {
    left: outer.left + (outer.width - width) / 2,
    top: outer.top + (outer.height - height) / 2,
    width,
    height,
  };
}

export function isFullyInViewport(rect: DOMRect): boolean {
  const slack = 1;
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left >= -slack &&
    rect.top >= -slack &&
    rect.right <= window.innerWidth + slack &&
    rect.bottom <= window.innerHeight + slack
  );
}

/** Plans the run for an overlay `frame` (in viewport px), or returns null if nothing fits. */
export function planIntro(frame: Box, geometry: WordmarkGeometry): IntroLayout | null {
  const aspect = viewBoxAspect(geometry);
  if (!aspect || frame.width <= 0 || frame.height <= 0) return null;

  // The name is assembled a little above the middle of the desk.
  const stageWidth = Math.min(frame.width * 0.84, 980, frame.height * 0.36 * aspect);
  const stage: Box = {
    left: frame.left + (frame.width - stageWidth) / 2,
    top: frame.top + frame.height * 0.47 - stageWidth / aspect / 2,
    width: stageWidth,
    height: stageWidth / aspect,
  };
  const unit = stage.width / geometry.viewBox.width;
  const count = geometry.letters.length;
  // About one letter slot wide, never much taller than the name, and big enough to read on a phone.
  const key = clamp(Math.min(stage.width / count, stage.height * 1.2) * 0.95, 52, 132);
  const keyHeight = key * KEY_ASPECT;

  const margin = 8;
  const keys: KeyPlan[] = [];
  let lastLetter: Box | null = null;
  let capPivot = { x: 0, y: 0 };
  for (let i = 0; i < count; i++) {
    const box = bounds(geometry.letters[i].points);
    if (!box) return null;
    if (i === 0) capPivot = { x: box.left + box.width / 2, y: box.top };
    const letter: Box = {
      left: stage.left + box.left * unit,
      top: stage.top + box.top * unit,
      width: box.width * unit,
      height: box.height * unit,
    };
    lastLetter = letter;
    const homeX = letter.left + letter.width / 2;
    const homeY = letter.top + letter.height / 2;
    const slotX = frame.left + frame.width * (0.1 + (0.8 * ((SLOT[i] ?? i) + 0.5)) / count);
    const landX = clamp(slotX, frame.left + key / 2 + margin, frame.left + frame.width - key / 2 - margin);
    const landY = clamp(
      stage.top + stage.height / 2 + (SCATTER_Y[i] ?? 0) * key,
      frame.top + keyHeight,
      frame.top + frame.height - keyHeight,
    );
    keys.push({
      left: homeX - key / 2,
      top: homeY - keyHeight / 2,
      dx: landX - homeX,
      dy: landY - homeY,
      // Centre just far enough above the top edge that no rotated corner shows.
      fromY: frame.top - homeY - key * 0.66,
      tilt: TILT[i] ?? 0,
      spin: SPIN[i] ?? 180,
    });
  }
  if (!lastLetter) return null;

  const burstSize = Math.max(56, stage.height * 0.8);
  const burst: Box = {
    left: lastLetter.left + lastLetter.width - burstSize * 0.35,
    top: lastLetter.top - burstSize * 0.65,
    width: burstSize,
    height: burstSize,
  };

  const plaqueTop = stage.top + stage.height + clamp(stage.height * 0.12, 14, 28);

  return { aspect, stage, key, keys, burst, plaqueTop, capPivot };
}
