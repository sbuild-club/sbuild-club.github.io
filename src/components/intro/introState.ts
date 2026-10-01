// html[data-intro] state and the once-per-session flag (docs/CONTRACT.md, "Intro states").
// Plain module: every function touches the DOM, so call them only from effects,
// event handlers or useSyncExternalStore.

const FLAG_KEY = "sbuild:intro";
const FLAG_VALUE = "1";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function subscribeIntroState(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
  return () => observer.disconnect();
}

export function getIntroState(): string {
  return document.documentElement.getAttribute("data-intro") ?? "";
}

export function getServerIntroState(): string {
  return "";
}

export function hasSeenIntro(): boolean {
  try {
    return Boolean(window.sessionStorage.getItem(FLAG_KEY));
  } catch {
    return false;
  }
}

export function rememberIntro(): void {
  try {
    window.sessionStorage.setItem(FLAG_KEY, FLAG_VALUE);
  } catch {
    // Storage blocked: the intro may replay on reload, which is harmless.
  }
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia(REDUCED_MOTION).matches;
  } catch {
    return false;
  }
}

export function watchReducedMotion(): MediaQueryList | null {
  try {
    return window.matchMedia(REDUCED_MOTION);
  } catch {
    return null;
  }
}

export function markIntroDone(): void {
  document.documentElement.dataset.intro = "done";
}

/** Every exit path: write the flag, then flip the state (CSS hides the overlay at once, React unmounts it). */
export function endIntro(): void {
  rememberIntro();
  markIntroDone();
}
