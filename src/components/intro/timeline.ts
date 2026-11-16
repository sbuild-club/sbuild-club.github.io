// The intro storyboard (docs/BRIEF.md "Intro sequence", docs/reference/mockup/Intro.html), about 3.2 s:
//   1. desk (0.0 s): stitch lines sew in from opposite sides
//   2. keys drop (0.34 s): six keycaps tumble in, each with its own spin, and bounce once
//   3. keys build the name (1.24 s): they slide home and flip into the letters (the cap lands on
//      the S right after it turns); a mint burst pops with the last letter
//   4. plaque and beaver (1.97 s): the tagline plaque drops under the name, the beaver pops up
//   5. land (2.41 s): the name FLIPs onto #wordmark while the cream sheet, carrying the stitches,
//      burst, plaque and beaver, peels away and uncovers the hero's own
// startIntro() is called from Intro's effect only when html[data-intro] is "pending".
// Everything is DOM/SVG animated with the Web Animations API (transform and opacity only).

import { toPointsAttr, wordmarkPaths } from "@/components/art/wordmarkPaths";
import {
  endIntro,
  getIntroState,
  hasSeenIntro,
  markIntroDone,
  prefersReducedMotion,
  rememberIntro,
  watchReducedMotion,
} from "./introState";
import { fitBox, isFullyInViewport, planIntro, type Box, type IntroLayout } from "./layout";
import { createScope, type Scope } from "./scope";

const TARGET = "#wordmark[data-intro-target]";

// Timings in ms. Phases run back to back; the comments give the nominal start times.
const STITCH_MS = 420; // 0.00 s, bottom row 90 ms later
const STITCH_STAGGER_MS = 90;
const DROP_AT_MS = 340; // 0.34 s: first key starts falling (later if fonts are slow, capped)
const FONTS_CAP_MS = 700;
const DROP_STAGGER_MS = 50;
const FALL_MS = 450;
const BOUNCE_MS = 200; // last key settles at about 1.24 s
const SLIDE_STAGGER_MS = 30; // 1.24 s: keys start sliding home
const SLIDE_MS = 300;
const FLIP_OUT_MS = 110;
const FLIP_IN_MS = 170; // last letter lands at about 1.97 s, with the burst
const CAP_MS = 260; // right after the S has turned, about 1.82 s
const BURST_MS = 280;
const PLAQUE_MS = 280; // 1.97 s
const BEAVER_DELAY_MS = 100;
const BEAVER_MS = 300; // ends about 2.37 s
const LAND_HOLD_MS = 40; // 2.41 s: the name moves onto #wordmark
const MOVE_MS = 620;
const PEEL_DELAY_MS = 280; // 2.69 s: the sheet starts peeling, gone at about 3.17 s
const PEEL_MS = 480;
const SKIP_FADE_MS = 160;
const FADE_MS = 320;
const LATE_START_MS = 4000;

const FADE_OUT: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];

// The cream sheet lifts from its top-left corner: up, tilting away like a page being pulled off.
const PEEL: Keyframe[] = [
  { transform: "translate(0px, 0px) rotate(0deg)", easing: "cubic-bezier(0.5, 0, 0.9, 0.6)" },
  { transform: "translate(0%, -118%) rotate(-7deg)" },
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
  sheet: HTMLElement;
  stitches: HTMLElement[];
  keys: HTMLElement[];
  mark: SVGSVGElement;
  letters: SVGGElement[];
  cap: SVGGElement;
  burst: HTMLElement;
  plaque: HTMLElement;
  beaver: HTMLElement;
  skip: HTMLElement;
};

function findParts(root: HTMLElement): Parts | null {
  const one = <T extends Element>(name: string) => root.querySelector<T>(`[data-part="${name}"]`);
  const all = <T extends Element>(name: string) => Array.from(root.querySelectorAll<T>(`[data-part="${name}"]`));
  const sheet = one<HTMLElement>("sheet");
  const mark = one<SVGSVGElement>("mark");
  const burst = one<HTMLElement>("burst");
  const cap = one<SVGGElement>("cap");
  const plaque = one<HTMLElement>("plaque");
  const beaver = one<HTMLElement>("beaver");
  const skip = one<HTMLElement>("skip");
  const stitches = all<HTMLElement>("stitch");
  const keys = all<HTMLElement>("key");
  const letters = all<SVGGElement>("letter");
  const count = wordmarkPaths.letters.length;
  if (!sheet || !mark || !cap || !burst || !plaque || !beaver || !skip) return null;
  if (keys.length !== count || letters.length !== count) return null;
  return { root, sheet, stitches, keys, mark, letters, cap, burst, plaque, beaver, skip };
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
  // Hydration came late: the visitor has already looked at a blank desk, and the gate's
  // 8 s failsafe would cut a full run short. Leave cleanly instead.
  if (performance.now() > LATE_START_MS) {
    await fadeOut(parts, scope);
    return;
  }
  const frame = parts.root.getBoundingClientRect();
  const layout = planIntro(frame, wordmarkPaths);
  if (!layout) {
    await fadeOut(parts, scope);
    return;
  }
  place(parts, layout, frame);

  await desk(parts, scope);
  await drop(parts, layout, scope);
  await build(parts, layout, scope);
  await present(parts, scope);
  await scope.sleep(LAND_HOLD_MS);
  await land(parts, layout, frame, scope);
}

/** Puts the overlay back to its server-rendered look (Strict Mode re-runs the effect). */
function reset(parts: Parts): void {
  if (typeof parts.root.getAnimations === "function") {
    parts.root.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  }
  delete parts.root.dataset.exit;
  const styled: Array<HTMLElement | SVGElement> = [
    parts.root,
    parts.sheet,
    parts.mark,
    parts.cap,
    parts.burst,
    parts.plaque,
    parts.beaver,
    parts.skip,
    ...parts.keys,
  ];
  styled.forEach((el) => el.removeAttribute("style"));
}

function px(el: HTMLElement | SVGElement, box: Box, frame: Box): void {
  el.style.left = `${box.left - frame.left}px`;
  el.style.top = `${box.top - frame.top}px`;
  el.style.width = `${box.width}px`;
  el.style.height = `${box.height}px`;
}

/** Sizes and positions the parts. They stay invisible (opacity-0) until their animations run. */
function place(parts: Parts, layout: IntroLayout, frame: Box): void {
  px(parts.mark, layout.stage, frame);
  px(parts.burst, layout.burst, frame);
  parts.plaque.style.top = `${layout.plaqueTop - frame.top}px`;
  // The cap tips around the top of the S (viewBox units; the cap layer uses transform-box view-box).
  parts.cap.style.transformOrigin = `${layout.capPivot.x}px ${layout.capPivot.y}px`;
  hideCapLetters(parts.cap);
  parts.keys.forEach((key, i) => {
    const plan = layout.keys[i];
    key.style.left = `${plan.left - frame.left}px`;
    key.style.top = `${plan.top - frame.top}px`;
    key.style.width = `${layout.key}px`;
  });
}

/**
 * The cap layer is the hero's own <Wordmark cap />. Its letter polygons duplicate the flipping
 * letters, so hide them and keep everything else (the cap). Matched by their points, so this
 * holds however the Wordmark groups its drawing.
 */
function hideCapLetters(cap: SVGGElement): void {
  const letters = new Set(wordmarkPaths.letters.map((letter) => toPointsAttr(letter.points)));
  cap.querySelectorAll("polygon").forEach((polygon) => {
    if (letters.has(polygon.getAttribute("points") ?? "")) polygon.style.visibility = "hidden";
  });
}

function fontsReady(scope: Scope): Promise<unknown> {
  const ready: Promise<unknown> = "fonts" in document ? document.fonts.ready : Promise.resolve();
  return Promise.race([scope.settle(ready), scope.sleep(FONTS_CAP_MS)]);
}

function fadeOut(parts: Parts, scope: Scope): Promise<void> {
  return scope.animate(parts.root, FADE_OUT, { duration: FADE_MS, easing: "ease-out", fill: "forwards" });
}

const pose = (x: number, y: number, deg: number) => `translate(${x}px, ${y}px) rotate(${deg}deg)`;

// Step 1: two stitch rows sew in from opposite edges. The keys wait for the Keycap face
// (fonts) but never longer than FONTS_CAP_MS.
async function desk(parts: Parts, scope: Scope): Promise<void> {
  parts.stitches.forEach((stitch, i) => {
    const from = i % 2 === 0 ? "-105%" : "105%";
    void scope.animate(
      stitch,
      [
        { opacity: 1, transform: `translateX(${from})` },
        { opacity: 1, transform: "translateX(0%)" },
      ],
      { duration: STITCH_MS, delay: i * STITCH_STAGGER_MS, easing: "cubic-bezier(0.2, 0.6, 0.3, 1)", fill: "both" },
    );
  });
  await Promise.all([scope.sleep(DROP_AT_MS), fontsReady(scope)]);
}

// Step 2: each key falls with its own spin, lands tilted, hops once and settles.
function drop(parts: Parts, layout: IntroLayout, scope: Scope): Promise<void> {
  const hop = layout.key * 0.22;
  const fallShare = FALL_MS / (FALL_MS + BOUNCE_MS);
  const runs = parts.keys.map((key, i) => {
    const { dx, dy, fromY, tilt, spin } = layout.keys[i];
    return scope.animate(
      key,
      [
        { opacity: 1, transform: pose(dx, fromY, tilt + spin), easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
        { opacity: 1, transform: pose(dx, dy, tilt - 5), offset: fallShare, easing: "cubic-bezier(0, 0.55, 0.45, 1)" },
        { opacity: 1, transform: pose(dx, dy - hop, tilt + 3), offset: fallShare + (1 - fallShare) * 0.45, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
        { opacity: 1, transform: pose(dx, dy, tilt) },
      ],
      { duration: FALL_MS + BOUNCE_MS, delay: i * DROP_STAGGER_MS, fill: "both" },
    );
  });
  return Promise.all(runs).then(() => undefined);
}

// Step 3: keys slide home (the centre of their letter) and flip edge-on; the letter flips in
// behind them. The cap drops onto the S once it has turned; the burst pops with the last letter.
function build(parts: Parts, layout: IntroLayout, scope: Scope): Promise<void> {
  const last = parts.keys.length - 1;
  const runs = parts.keys.map(async (key, i) => {
    const { dx, dy, tilt } = layout.keys[i];
    await scope.animate(
      key,
      [
        { opacity: 1, transform: pose(dx, dy, tilt) },
        { opacity: 1, transform: pose(0, 0, 0) },
      ],
      { duration: SLIDE_MS, delay: i * SLIDE_STAGGER_MS, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "forwards" },
    );
    await scope.animate(
      key,
      [
        { opacity: 1, transform: "translate(0px, 0px) scale(1, 1)" },
        { opacity: 1, transform: "translate(0px, 0px) scale(0, 1)" },
      ],
      { duration: FLIP_OUT_MS, easing: "ease-in", fill: "forwards" },
    );
    if (i === last) void popBurst(parts, scope);
    await scope.animate(
      parts.letters[i],
      [
        { opacity: 1, transform: "scale(0, 1)" },
        { opacity: 1, transform: "scale(1.08, 1)", offset: 0.7 },
        { opacity: 1, transform: "scale(1, 1)" },
      ],
      { duration: FLIP_IN_MS, easing: "ease-out", fill: "forwards" },
    );
    if (i === 0) void dropCap(parts, scope);
  });
  return Promise.all(runs).then(() => undefined);
}

// The cap falls a little way onto the S, tipped back, and rocks once as it settles.
function dropCap(parts: Parts, scope: Scope): Promise<void> {
  return scope.animate(
    parts.cap,
    [
      { opacity: 1, transform: "translate(0px, -44px) rotate(-16deg)", easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
      { opacity: 1, transform: "translate(0px, 0px) rotate(4deg)", offset: 0.65, easing: "ease-out" },
      { opacity: 1, transform: "translate(0px, 0px) rotate(0deg)" },
    ],
    { duration: CAP_MS, fill: "forwards" },
  );
}

function popBurst(parts: Parts, scope: Scope): Promise<void> {
  return scope.animate(
    parts.burst,
    [
      { opacity: 1, transform: "scale(0) rotate(-24deg)" },
      { opacity: 1, transform: "scale(1.15) rotate(4deg)", offset: 0.6 },
      { opacity: 1, transform: "scale(1) rotate(0deg)" },
    ],
    { duration: BURST_MS, easing: "ease-out", fill: "forwards" },
  );
}

// Step 4: the tagline plaque drops onto the desk under the name (from a little above the paper,
// so it shrinks into place and tilts flat), then the beaver pops up from the bottom edge.
function present(parts: Parts, scope: Scope): Promise<void> {
  const plaque = scope.animate(
    parts.plaque,
    [
      // Solid from the first frame (no see-through paper): only the scale and tilt carry the drop.
      { opacity: 1, transform: "scale(1.3) rotate(-7deg)", easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
      { opacity: 1, transform: "scale(1) rotate(1.5deg)", offset: 0.6, easing: "ease-out" },
      { opacity: 1, transform: "scale(1) rotate(0deg)" },
    ],
    { duration: PLAQUE_MS, fill: "forwards" },
  );
  const beaver = scope.animate(
    parts.beaver,
    [
      { opacity: 1, transform: "translateY(100%)", easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
      { opacity: 1, transform: "translateY(-7%)", offset: 0.65, easing: "ease-in-out" },
      { opacity: 1, transform: "translateY(0%)" },
    ],
    { duration: BEAVER_MS, delay: BEAVER_DELAY_MS, fill: "both" },
  );
  return Promise.all([plaque, beaver]).then(() => undefined);
}

// Step 5: FLIP the name onto #wordmark (translate plus one uniform scale), then peel the sheet
// away from under it. With no usable target the overlay just fades.
async function land(parts: Parts, layout: IntroLayout, frame: Box, scope: Scope): Promise<void> {
  const rect = document.querySelector(TARGET)?.getBoundingClientRect();
  if (!rect || !isFullyInViewport(rect)) {
    await fadeOut(parts, scope);
    return;
  }
  // Same aspect by contract, so this is the target rect itself; centred if a stub disagrees.
  const to = fitBox(rect, layout.aspect);
  const from = layout.stage;
  const scale = from.width / to.width;
  if (!Number.isFinite(scale) || scale <= 0) {
    await fadeOut(parts, scope);
    return;
  }

  // Last: lay the svg out on the target. Invert: put it back where it was. Play: to identity.
  const inverted = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scale})`;
  px(parts.mark, to, frame);
  parts.mark.style.transform = inverted;
  const move = scope.animate(parts.mark, [{ transform: inverted }, { transform: "translate(0px, 0px) scale(1)" }], {
    duration: MOVE_MS,
    easing: "cubic-bezier(0.65, 0, 0.25, 1)",
    fill: "forwards",
  });
  void scope.animate(parts.skip, FADE_OUT, { duration: SKIP_FADE_MS, fill: "forwards" });

  await scope.sleep(PEEL_DELAY_MS);
  // The root drops its cream (data-exit) in the same frame the sheet starts to move, so the
  // sheet alone covers the page and peeling it uncovers the page.
  parts.root.dataset.exit = "";
  const peel = scope.animate(parts.sheet, PEEL, { duration: PEEL_MS, fill: "forwards" });
  await Promise.all([move, peel]);
}
