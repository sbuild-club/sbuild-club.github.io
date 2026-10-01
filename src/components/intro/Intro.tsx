"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { BOOT_LINES } from "./bootLines";
import { endIntro, getIntroState, getServerIntroState, subscribeIntroState } from "./introState";
import { startIntro } from "./timeline";

/**
 * First-visit intro overlay. The server renders it hidden unless html[data-intro="pending"],
 * so it is visible from the first paint with zero layout shift; the timeline lives in
 * ./timeline and only starts from the effect below.
 */
export function Intro() {
  const state = useSyncExternalStore(subscribeIntroState, getIntroState, getServerIntroState);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (state !== "pending" || !root) return;
    return startIntro(root);
  }, [state]);

  if (state === "done") return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-(--z-intro) hidden bg-ink intro-pending:block">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-part="scan" className="scanlines absolute inset-0" />
        <div
          data-part="terminal"
          className="absolute left-4 top-4 font-mono text-sm leading-relaxed text-phosphor sm:left-8 sm:top-8 sm:text-base"
        >
          {BOOT_LINES.map((_, i) => (
            <p key={i} className="whitespace-pre">
              <span data-part="line" />
              <span data-part="cursor" hidden className="motion-safe:animate-blink">
                █
              </span>
            </p>
          ))}
        </div>
        <canvas data-part="blocks" className="absolute inset-0 h-full w-full" />
        <canvas data-part="wipe" className="absolute inset-0 h-full w-full opacity-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            data-part="word"
            aria-hidden
            className="whitespace-nowrap font-display text-[length:clamp(3.5rem,20vw,13rem)] font-bold leading-none tracking-tight text-paper lowercase opacity-0"
          >
            {site.name}
          </span>
        </div>
        <div data-part="beam" className="absolute inset-0 bg-paper opacity-0" />
      </div>
      <button
        type="button"
        data-part="skip"
        onClick={endIntro}
        className="absolute bottom-4 right-4 min-h-11 border-2 border-paper bg-ink px-4 font-pixel text-xs lowercase text-paper hover:bg-paper hover:text-ink sm:bottom-8 sm:right-8"
      >
        skip ↵
      </button>
    </div>
  );
}
