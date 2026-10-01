// The intro storyboard (docs/BRIEF.md, "Intro sequence"), about 3.3 s:
//   1. CRT power-on   2. boot lines   3. blocks assemble the wordmark
//   4. FLIP onto #wordmark while the overlay dissolves in a pixel-grid wipe
// startIntro() is called from Intro's effect only when html[data-intro] is "pending".

import { BOOT_LINES } from "./bootLines";
import { flyIn, sampleWordmark } from "./blocks";
import { copyTypography, isFullyInViewport, matchTypeface, readToken, textBox } from "./dom";
import {
  endIntro,
  getIntroState,
  hasSeenIntro,
  markIntroDone,
  prefersReducedMotion,
  rememberIntro,
  watchReducedMotion,
} from "./introState";
import { createScope, type Scope } from "./scope";
import { createWipe } from "./wipe";

const TARGET = "#wordmark[data-intro-target]";

const BEAM_MS = 300;
const CHAR_MS = 14;
const ELLIPSIS_MS = 100;
const LINE_MS = 70;
const HOLD_MS = 100;
const SWAP_MS = 200;
const MOVE_MS = 680;
const WIPE_DELAY_MS = 80;
const WIPE_STEP_MS = 64;
const FADE_MS = 360;
const FONTS_TIMEOUT_MS = 1000;
const LATE_START_MS = 4000;

const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const FADE_OUT: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
// A thin line flashes across, then expands vertically to fill the screen and fades.
const BEAM: Keyframe[] = [
  { opacity: 1, transform: "scale(0, 0.004)" },
  { opacity: 1, transform: "scale(1, 0.004)", offset: 0.3 },
  { opacity: 0.35, transform: "scale(1, 1)", offset: 0.72 },
  { opacity: 0, transform: "scale(1, 1)" },
];

// Bare modifiers don't skip, so OS shortcuts (screenshots, app switching) still work.
const MODIFIER_KEYS = new Set([
  "Alt",
  "AltGraph",
  "CapsLock",
  "Control",
  "Fn",
  "FnLock",
  "Hyper",
  "Meta",
  "NumLock",
  "OS",
  "ScrollLock",
  "Shift",
  "Super",
]);
// Keys whose default would scroll the page or move focus right after the overlay goes.
const PAGE_KEYS = new Set([" ", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "End", "Enter", "Home", "PageDown", "PageUp", "Tab"]);

type Parts = {
  root: HTMLElement;
  scan: HTMLElement;
  terminal: HTMLElement;
  lines: HTMLElement[];
  cursors: HTMLElement[];
  blocks: HTMLCanvasElement;
  wipe: HTMLCanvasElement;
  word: HTMLElement;
  beam: HTMLElement;
  skip: HTMLElement;
};

function findParts(root: HTMLElement): Parts | null {
  const one = <T extends Element>(name: string) => root.querySelector<T>(`[data-part="${name}"]`);
  const all = (name: string) => Array.from(root.querySelectorAll<HTMLElement>(`[data-part="${name}"]`));
  const scan = one<HTMLElement>("scan");
  const terminal = one<HTMLElement>("terminal");
  const blocks = one<HTMLCanvasElement>("blocks");
  const wipe = one<HTMLCanvasElement>("wipe");
  const word = one<HTMLElement>("word");
  const beam = one<HTMLElement>("beam");
  const skip = one<HTMLElement>("skip");
  if (!scan || !terminal || !blocks || !wipe || !word || !beam || !skip) return null;
  return { root, scan, terminal, lines: all("line"), cursors: all("cursor"), blocks, wipe, word, beam, skip };
}

/** Starts the intro on the server-rendered overlay; returns the effect cleanup. */
export function startIntro(root: HTMLElement): () => void {
  if (hasSeenIntro() || prefersReducedMotion()) {
    rememberIntro();
    markIntroDone();
    return () => undefined;
  }

  const scope = createScope();
  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    endIntro();
    scope.cancel();
  };

  try {
    const parts = findParts(root);
    if (!parts || document.hidden) {
      finish();
    } else {
      scope.listen(window, "keydown", (event) => onKey(event as KeyboardEvent, finish), { capture: true });
      scope.listen(window, "click", finish, { capture: true });
      scope.listen(document, "visibilitychange", () => {
        if (document.hidden) finish();
      });
      const motion = watchReducedMotion();
      if (motion) {
        scope.listen(motion, "change", () => {
          if (motion.matches) finish();
        });
      }
      playIntro(parts, scope).then(finish, finish);
    }
  } catch {
    finish();
  }

  return () => {
    scope.cancel();
    // The gate's 8 s failsafe (or any other exit) flipped the state: the intro is over.
    if (getIntroState() === "done") rememberIntro();
  };
}

function onKey(event: KeyboardEvent, finish: () => void): void {
  if (event.isComposing || MODIFIER_KEYS.has(event.key)) return;
  if (PAGE_KEYS.has(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) event.preventDefault();
  finish();
}

async function playIntro(parts: Parts, scope: Scope): Promise<void> {
  reset(parts);
  // Hydration came late: the visitor has already watched a black screen, and the
  // gate's 8 s failsafe would cut a full run short. Leave cleanly instead.
  if (performance.now() > LATE_START_MS) {
    await fadeOut(parts, scope);
    return;
  }
  await powerOn(parts, scope);
  await bootUp(parts, scope);
  await assemble(parts, scope);
  await land(parts, scope);
}

/** Puts the overlay back to its server-rendered look (Strict Mode re-runs the effect). */
function reset(parts: Parts): void {
  if (typeof parts.root.getAnimations === "function") {
    parts.root.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  }
  for (const el of [parts.root, parts.word, parts.wipe, parts.skip]) el.removeAttribute("style");
  for (const canvas of [parts.blocks, parts.wipe]) {
    canvas.width = 0;
    canvas.height = 0;
  }
  parts.lines.forEach((line) => {
    line.textContent = "";
  });
  parts.cursors.forEach((cursor) => {
    cursor.hidden = true;
  });
}

function fontsReady(scope: Scope): Promise<unknown> {
  const ready: Promise<unknown> = "fonts" in document ? document.fonts.ready : Promise.resolve();
  return Promise.race([scope.settle(ready), scope.sleep(FONTS_TIMEOUT_MS)]);
}

function fadeOut(parts: Parts, scope: Scope): Promise<void> {
  return scope.animate(parts.root, FADE_OUT, { duration: FADE_MS, easing: "steps(6, end)", fill: "forwards" });
}

// Step 1: CRT power-on.
function powerOn(parts: Parts, scope: Scope): Promise<void> {
  return scope.animate(parts.beam, BEAM, { duration: BEAM_MS, easing: "ease-out", fill: "forwards" });
}

// Step 2: boot lines type in with a block cursor on the active line.
async function bootUp(parts: Parts, scope: Scope): Promise<void> {
  for (let i = 0; i < parts.lines.length; i++) {
    parts.cursors.forEach((cursor, j) => {
      cursor.hidden = j !== i;
    });
    let typed = "";
    for (const char of BOOT_LINES[i] ?? "") {
      typed += char;
      parts.lines[i].textContent = typed;
      await scope.sleep(char === "…" ? ELLIPSIS_MS : CHAR_MS);
    }
    await scope.sleep(LINE_MS);
  }
}

// Step 3: blocks fly in and snap into the wordmark.
async function assemble(parts: Parts, scope: Scope): Promise<void> {
  await fontsReady(scope);
  const target = document.querySelector(TARGET);
  if (target) matchTypeface(target, parts.word);
  const shape = sampleWordmark(parts.word);
  if (!shape) return;
  const landed = getComputedStyle(parts.word).color;
  const flight = [readToken("--signal"), readToken("--amber")].filter(Boolean);
  await flyIn(parts.blocks, parts.root.getBoundingClientRect(), shape, { flight, landed }, scope);
  await scope.sleep(HOLD_MS);
}

// Step 4: blocks cross-fade into the span, which FLIPs onto #wordmark while the overlay wipes away.
async function land(parts: Parts, scope: Scope): Promise<void> {
  await fontsReady(scope);
  const { word } = parts;
  const target = document.querySelector<HTMLElement>(TARGET);
  const bounds = target?.getBoundingClientRect();
  const to = target ? textBox(target) : null;
  if (!target || !bounds || !to || !isFullyInViewport(bounds) || !textBox(word)) {
    await fadeOut(parts, scope);
    return;
  }

  word.style.color = getComputedStyle(target).color;
  const swap: KeyframeAnimationOptions = { duration: SWAP_MS, easing: "steps(4, end)", fill: "forwards" };
  await Promise.all([
    scope.animate(word, FADE_IN, swap),
    scope.animate(parts.blocks, FADE_OUT, swap),
    scope.animate(parts.terminal, FADE_OUT, swap),
    scope.animate(parts.scan, FADE_OUT, swap),
  ]);

  // First: where the span is now.
  const first = textBox(word);
  // Last: the target's exact typography, positioned so its text box sits on the target's.
  copyTypography(target, word);
  word.style.position = "absolute";
  word.style.left = "0px";
  word.style.top = "0px";
  word.style.margin = "0px";
  word.style.transform = "none";
  const probe = textBox(word);
  if (!first || !probe) {
    await fadeOut(parts, scope);
    return;
  }
  word.style.left = `${to.left - probe.left}px`;
  word.style.top = `${to.top - probe.top}px`;
  const last = textBox(word) ?? to;
  const box = word.getBoundingClientRect();
  const scale = first.width / last.width;
  if (!Number.isFinite(scale) || scale <= 0) {
    await fadeOut(parts, scope);
    return;
  }

  // Invert (translate plus one uniform scale about the box's top-left), then play to identity.
  const dx = first.left - box.left - scale * (last.left - box.left);
  const dy = first.top - box.top - scale * (last.top - box.top);
  const inverted = `translate(${dx}px, ${dy}px) scale(${scale})`;
  word.style.transformOrigin = "0 0";
  word.style.transform = inverted;

  const frame = parts.root.getBoundingClientRect();
  const wipe = createWipe(parts.wipe, frame, last, readToken("--ink"), readToken("--amber"));
  if (wipe) {
    // Same frame: the ink canvas replaces the root's ink background, so nothing visibly changes yet.
    parts.wipe.style.opacity = "1";
    parts.root.style.backgroundColor = "transparent";
  }

  const move = scope.animate(word, [{ transform: inverted }, { transform: "translate(0px, 0px) scale(1)" }], {
    duration: MOVE_MS,
    easing: "cubic-bezier(0.7, 0, 0.2, 1)",
    fill: "forwards",
  });
  void scope.animate(parts.skip, FADE_OUT, swap);

  if (wipe) {
    await scope.sleep(WIPE_DELAY_MS);
    for (let i = 0; i < wipe.steps; i++) {
      wipe.step(i);
      await scope.sleep(WIPE_STEP_MS);
    }
  }
  await move;
  if (!wipe) await fadeOut(parts, scope);
}
