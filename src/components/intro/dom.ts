// DOM measuring, styling and canvas helpers for the intro. Plain module: call from effects only.

/** Bounding box of an element's text (not its block box), in viewport px. */
export function textBox(el: Element): DOMRect | null {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rect = range.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? rect : null;
}

export type Glyph = { char: string; rect: DOMRect };

/** One rect per character of an element whose only child is a text node. */
export function glyphBoxes(el: Element): Glyph[] {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return [];
  const range = document.createRange();
  const glyphs: Glyph[] = [];
  let offset = 0;
  for (const char of node.textContent ?? "") {
    range.setStart(node, offset);
    offset += char.length;
    range.setEnd(node, offset);
    glyphs.push({ char, rect: range.getBoundingClientRect() });
  }
  return glyphs;
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

const TYPE_PROPS = [
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "font-variation-settings",
  "letter-spacing",
  "line-height",
  "color",
] as const;

/** Final handoff: the span takes the target's exact computed typography. */
export function copyTypography(from: Element, to: HTMLElement): void {
  const style = getComputedStyle(from);
  for (const prop of TYPE_PROPS) to.style.setProperty(prop, style.getPropertyValue(prop));
}

/**
 * Early match: same face, weight, colour and tracking (as em) but the span keeps
 * its own size, so the later FLIP is exactly one uniform scale.
 */
export function matchTypeface(from: Element, to: HTMLElement): void {
  const style = getComputedStyle(from);
  for (const prop of ["font-family", "font-weight", "font-style", "font-variation-settings", "color"]) {
    to.style.setProperty(prop, style.getPropertyValue(prop));
  }
  const size = parseFloat(style.fontSize);
  const spacing = parseFloat(style.letterSpacing);
  to.style.letterSpacing = size > 0 && Number.isFinite(spacing) ? `${spacing / size}em` : "normal";
}

/** A colour token from globals.css, e.g. readToken("--ink"). */
export function readToken(name: `--${string}`): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Sizes a canvas bitmap to `frame` (capped at 2x DPR) and returns a context drawing in CSS px. */
export function fitCanvas(canvas: HTMLCanvasElement, frame: DOMRect): CanvasRenderingContext2D | null {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.round(frame.width * dpr));
  canvas.height = Math.max(1, Math.round(frame.height * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/** Deterministic PRNG (mulberry32), so every visit draws the same swarm. */
export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
