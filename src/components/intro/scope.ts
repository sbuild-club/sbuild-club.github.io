// One cancellable run of the intro: timers, frames, animations and listeners.
// After cancel() every pending promise stays pending forever, so the async
// timeline simply stops at its next await and is garbage-collected.

export type Scope = {
  readonly cancelled: boolean;
  sleep(ms: number): Promise<void>;
  frame(): Promise<number>;
  settle<T>(promise: Promise<T>): Promise<T>;
  animate(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions): Promise<void>;
  listen(
    target: EventTarget,
    type: string,
    handler: (event: Event) => void,
    options?: AddEventListenerOptions,
  ): void;
  cancel(): void;
};

function never<T>(): Promise<T> {
  return new Promise<T>(() => undefined);
}

export function createScope(): Scope {
  let cancelled = false;
  const timeouts = new Set<number>();
  const frames = new Set<number>();
  const animations = new Set<Animation>();
  const disposers: Array<() => void> = [];

  function settle<T>(promise: Promise<T>): Promise<T> {
    if (cancelled) return never<T>();
    return new Promise<T>((resolve, reject) => {
      promise.then(
        (value) => {
          if (!cancelled) resolve(value);
        },
        (error: unknown) => {
          if (!cancelled) reject(error);
        },
      );
    });
  }

  return {
    get cancelled() {
      return cancelled;
    },

    sleep(ms) {
      if (cancelled) return never<void>();
      return new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timeouts.delete(id);
          resolve();
        }, ms);
        timeouts.add(id);
      });
    },

    frame() {
      if (cancelled) return never<number>();
      return new Promise<number>((resolve) => {
        const id = window.requestAnimationFrame((now) => {
          frames.delete(id);
          resolve(now);
        });
        frames.add(id);
      });
    },

    settle,

    animate(el, keyframes, options) {
      if (cancelled) return never<void>();
      const animation = el.animate(keyframes, options);
      animations.add(animation);
      return settle(animation.finished).then(() => undefined);
    },

    listen(target, type, handler, options) {
      if (cancelled) return;
      target.addEventListener(type, handler, options);
      disposers.push(() => target.removeEventListener(type, handler, options));
    },

    cancel() {
      if (cancelled) return;
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
      animations.forEach((animation) => animation.cancel());
      disposers.forEach((dispose) => dispose());
      timeouts.clear();
      frames.clear();
      animations.clear();
      disposers.length = 0;
    },
  };
}
