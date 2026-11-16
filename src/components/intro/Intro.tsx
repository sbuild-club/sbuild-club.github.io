"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Burst } from "@/components/art/Burst";
import { Keycap } from "@/components/art/Keycap";
import { toPointsAttr, wordmarkPaths, type WordmarkFill } from "@/components/art/wordmarkPaths";
import { endIntro, getIntroState, getServerIntroState, subscribeIntroState } from "./introState";
import { startIntro } from "./timeline";

// Static class names so Tailwind can see them.
const FILLS: Record<WordmarkFill, string> = {
  navy: "fill-navy",
  steel: "fill-steel",
};

/**
 * First-visit intro overlay: a cream desk, keycaps that drop and flip into the wordmark, which
 * then lands on the hero's #wordmark while the sheet peels away. The server renders it hidden
 * unless html[data-intro="pending"], so it is visible from the first paint with zero layout
 * shift. Every moving part starts invisible (opacity-0) and is sized and placed by ./timeline,
 * which only starts from the effect below.
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

  const { width, height } = wordmarkPaths.viewBox;

  return (
    <div ref={rootRef} className="fixed inset-0 z-(--z-intro) hidden bg-cream intro-pending:block data-exit:bg-transparent">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {/* The desk: one cream sheet carrying the stitches and the burst; it peels away at the end. */}
        <div data-part="sheet" className="absolute inset-0 origin-top-left bg-cream">
          <svg data-part="stitch" focusable="false" className="absolute top-5 left-0 block h-[22px] w-[72%] opacity-0 sm:top-7">
            <line x1="3" y1="3" x2="100%" y2="3" className="stitch-stroke stroke-sage-soft" />
            <line x1="3" y1="19" x2="100%" y2="19" className="stitch-stroke stroke-sage-soft" />
          </svg>
          <svg data-part="stitch" focusable="false" className="absolute right-0 bottom-5 block h-[22px] w-[72%] opacity-0 sm:bottom-7">
            <line x1="3" y1="3" x2="100%" y2="3" className="stitch-stroke stroke-sage-soft" />
            <line x1="3" y1="19" x2="100%" y2="19" className="stitch-stroke stroke-sage-soft" />
          </svg>
          <div data-part="burst" className="absolute top-0 left-0 opacity-0">
            <Burst className="h-auto w-full" />
          </div>
        </div>
        {wordmarkPaths.letters.map((letter, i) => (
          <div key={i} data-part="key" className="absolute top-0 left-0 opacity-0">
            <Keycap letter={letter.char} className="h-auto w-full" />
          </div>
        ))}
        {/* The landing wordmark: same viewBox as the hero's, its own polygons so each letter can flip. */}
        <svg
          data-part="mark"
          viewBox={`0 0 ${width} ${height}`}
          overflow="visible"
          focusable="false"
          className="absolute top-0 left-0 block origin-top-left"
        >
          {wordmarkPaths.letters.map((letter, i) => (
            <g key={i} data-part="letter" className="origin-center opacity-0 [transform-box:fill-box]">
              <polygon points={toPointsAttr(letter.points)} fillRule="evenodd" className={FILLS[letter.fill]} />
            </g>
          ))}
        </svg>
      </div>
      <button
        type="button"
        data-part="skip"
        onClick={endIntro}
        className="group absolute top-14 right-2 inline-flex min-h-11 min-w-11 items-center justify-center p-1 sm:top-16 sm:right-6"
      >
        <span className="cut-tag-a bg-teal px-4 py-2 font-label text-[15px] leading-[1.2] font-semibold tracking-[0.06em] text-cream group-hover:bg-navy group-active:translate-y-px">
          skip <span aria-hidden="true">↵</span>
        </span>
      </button>
    </div>
  );
}
