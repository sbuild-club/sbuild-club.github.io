"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Beaver } from "@/components/art/Beaver";
import { Burst } from "@/components/art/Burst";
import { Keycap } from "@/components/art/Keycap";
import { Wordmark } from "@/components/art/Wordmark";
import { toPointsAttr, wordmarkPaths, type WordmarkFill } from "@/components/art/wordmarkPaths";
import { Plaque } from "@/components/ui/Plaque";
import { site } from "@/content/site";
import { endIntro, getIntroState, getServerIntroState, subscribeIntroState } from "./introState";
import { startIntro } from "./timeline";

// Static class names so Tailwind can see them.
const FILLS: Record<WordmarkFill, string> = {
  navy: "fill-navy",
  steel: "fill-steel",
};

/**
 * First-visit intro overlay: a cream desk, keycaps that drop and flip into the wordmark (the cap
 * lands on the S), the tagline plaque drops under it and the beaver pops up; then the wordmark
 * lands on the hero's #wordmark while the sheet peels away. The server renders it hidden
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
            {/* Mirrored, so the dash pattern starts at the screen edge like the top row's does. */}
            <g className="origin-center -scale-x-100 [transform-box:view-box]">
              <line x1="3" y1="3" x2="100%" y2="3" className="stitch-stroke stroke-sage-soft" />
              <line x1="3" y1="19" x2="100%" y2="19" className="stitch-stroke stroke-sage-soft" />
            </g>
          </svg>
          <div data-part="burst" className="absolute top-0 left-0 opacity-0">
            <Burst className="h-auto w-full" />
          </div>
          {/* Step 4 extras: they stay on the sheet and leave with it, uncovering the hero's own. */}
          <div data-part="plaque" className="absolute inset-x-0 top-0 flex justify-center px-4 opacity-0">
            <Plaque as="span">{site.tagline}</Plaque>
          </div>
          <div data-part="beaver" className="absolute right-[3%] bottom-0 opacity-0">
            <Beaver blink={false} className="h-auto w-[clamp(6rem,15vw,17.5rem)]" />
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
          {/* The cap: the hero's own <Wordmark cap /> drawing, with its letters hidden by ./timeline
              (they are the polygons above), so the landed mark matches the hero exactly. */}
          <g data-part="cap" className="opacity-0 [transform-box:view-box]">
            <Wordmark cap />
          </g>
        </svg>
      </div>
      <button
        type="button"
        data-part="skip"
        onClick={endIntro}
        className="group absolute top-14 right-2 inline-flex min-h-11 min-w-11 items-center justify-center p-1 sm:top-16 sm:right-6"
      >
        <span className="cut-tag-a bg-teal px-5 py-2.5 font-label text-[17px] leading-[1.2] font-semibold tracking-[0.06em] text-cream group-hover:bg-navy group-active:translate-y-px sm:px-6 sm:py-3 sm:text-lg">
          skip <span aria-hidden="true">↵</span>
        </span>
      </button>
    </div>
  );
}
