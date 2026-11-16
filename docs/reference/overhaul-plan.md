# SBUILD site overhaul: paper-cut theme from the new logo

## Context

The site today is a single-page Next.js 16 / React 19 / Tailwind v4 static export with a dark retro-terminal look (CRT boot intro, pixel-art bot, scanlines, orange/amber/phosphor palette). The club now has a logo banner in a completely different style: cream background, sage greens, steel/teal/navy blues, hand-cut paper shapes, isometric blocks and a beaver mascot. The overhaul re-skins the whole site to that style. The club concept, page sections and copy structure stay as they are.

Decisions already made with the user:
- Replace all retro visuals; keep the intro as a feature but redraw it in the new style.
- Art source is PNG only: the wide banner and the round badge logo, both attached in this conversation. Everything is redrawn as inline SVG.
- Fix deployment as part of this round.
- Fable manages: writes the design spec, briefs agents, reviews, merges. Opus agents write all site code, each in its own git worktree.

## Design direction (extracted from the logo)

**Palette, sampled from the PNG.** These replace the five old tokens.

| Token | Hex | Role |
|---|---|---|
| `cream` | `#f8efd6` | Page background, text on dark bands |
| `sage` | `#b8d7ae` | Section bands, side panels |
| `sage-soft` | `#d2e0bf` | Overlapping panel layer, stitch dashes |
| `mint` | `#87c896` | Decorative bursts, exclamation marks, bulb (never text) |
| `steel` | `#4c7e94` | Wordmark letters, large display type, block tops (3.9:1 on cream, large text only) |
| `teal-mid` | `#396275` | Block side face |
| `teal` | `#2f5565` | Plaques, dark bands, secondary text (7.0:1 on cream) |
| `navy` | `#2a3d5a` | Body text, the "S", the cap (9.5:1 on cream) |
| `bark` / `bark-deep` | `#625045` / `#382e27` | Beaver only |
| `blush` | `#deb39e` | Beaver tooth, tiny warm accent |

**Style features to mimic**
- Flat paper cut-outs: solid fills, no gradients, no blur, no outlines.
- Irregular hand-cut polygons with slightly off-square edges (the letters, the tagline plaque). On the site these become cards, buttons and plaques via shared `clip-path` shapes.
- Large angled sage panels layered at the page edges, in two overlapping tints.
- Double rows of dashed "stitch" lines as section dividers.
- Isometric keycaps in three blue tones with a thin cream edge highlight; the round logo shows them lettered S, B, U in mint. Small pixel-square clusters.
- Mint ray bursts and exclamation marks as emphasis marks; navy spiky star bursts (round logo) as a second accent shape.
- Concentric dashed stitch rings on round elements (badge, avatars), matching the straight stitch lines on bands.
- The round logo is the compact mark: nav badge, favicon, share image, footer. The banner is the hero composition.
- Beaver in a navy cap as the mascot (replaces the CRT bot); lightbulb with a raised fist as the "idea" icon.
- Chunky rounded lettering in cream on a teal plaque for labels and taglines.

**Other design calls**
- Light-first (`color-scheme: light`). Surfaces become `cream` (default), `sage`, and `teal` (dark band, cream text).
- Fonts drop from four families to three: display (chunky, angular), label (rounded, like the tagline), body (plain and readable). Candidates are compared side by side in the mockup and the user picks. Mono and pixel fonts go.
- The intro becomes: blocks tumble in, assemble the SBUILD wordmark, beaver pops up, stitch-line wipe to the page. About 3 s, skippable, once per session, off under reduced motion (same rules as today).
- `site.tagline = "SBU's First Tech Entrepreneurship Club"` is added as real copy, since it is in the logo. All other copy stays as placeholders; no invented facts.

## Phase 0: design mockup and sign-off (Fable)

The "design feature" is the Claude Design artifact type; it is available on this account and no design system exists yet.

1. Copy both reference PNGs into `docs/reference/`.
2. Create a **Design System** artifact, "SBUILD", holding the palette, type, shapes, and components above.
3. Create a **Design** canvas with: homepage at 1440 and 375, a component sheet (button, card, plaque, tag, heading, stitch divider), the illustration set, font candidates, and intro storyboard frames.
4. **Gate: user approves the mockup** (and picks fonts) before any code is written.

## Phase 1: foundation (1 Opus agent, own worktree)

Integration branch `overhaul/papercut` is cut from `main`. The foundation agent works on `overhaul/foundation` and Fable merges it into the integration branch before any lane starts, so every lane worktree branches from it.

Foundation delivers a building, lint-clean site with stubs:
- `docs/BRIEF.md` and `docs/CONTRACT.md` rewritten as v2 from the approved mockup. The stale `.claude/prompts/sbuild-website.md` is marked superseded in the contract, not deleted.
- `src/app/globals.css`: new tokens, `@theme` mapping, shared cut-shape utilities, stitch-line utility; `scanlines` and `stepped-gradient` removed.
- `src/lib/fonts.ts`: the three chosen families.
- `src/components/ui/`: `Button`, `Tag`, `SectionHeading`, `Sticker` restyled; new `PaperCard` and `Plaque` primitives that own the clip-path shape and the flat offset layer (box-shadow is clipped by clip-path, so this must be solved once, centrally).
- `src/components/pixel/` renamed to `src/components/art/`; `Scanlines` and `GridFloor` removed; stub entry files with fixed props for every new art component.
- `src/components/art/wordmarkPaths.ts`: fixed data shape for the wordmark letter polygons (placeholder rectangles), shared by the art and intro lanes.
- `src/app/layout.tsx`: light scheme, `metadataBase`, Scanlines mount removed.
- `src/content/site.ts`: `tagline` added, icon name union updated.
- Contract v2 redefines the intro/hero handoff: `h1#wordmark[data-intro-target]` now wraps the SVG wordmark plus screen-reader text.

Rules kept from round one: folder ownership, named exports matching file names, tokens only (no hex in components), static class strings, plain CSS modules, copy only from `@/content/site`, `"use client"` only in `Intro.tsx` and `NavToggle.tsx`, no new dependencies.

Rules changed for worktrees: each agent runs `npm ci` in its own worktree, may run `tsc`, `eslint` and `npm run build`, and commits to its own branch only. No push, no touching other branches.

## Phase 2: six lanes in parallel (Opus agents, one worktree each)

Launched in one message with `isolation: "worktree"`, `model: "opus"`. Each agent first confirms its worktree contains the foundation commit.

| Lane / branch | Owns | Builds |
|---|---|---|
| `art` | `src/components/art/**` | Traced SBUILD wordmark (straight and arced), round badge logo, beaver (idle blink), lettered keycaps, lightbulb, mint bursts, navy star bursts, exclamation marks, pixel clusters, side panels, the 8 project icons, paper-cut avatars |
| `shell` | `nav/**`, `hero/**`, `footer/**` | Header, hero composed like the banner, footer with stitch lines |
| `sections-a` | `sections/{manifesto,programs,projects}/**` | Three sections on the new surfaces |
| `sections-b` | `sections/{events,team,join}/**` | Events (terminal window becomes a paper notice board), team, join CTA |
| `intro` | `src/components/intro/**` | Block-assembly intro; `blocks.ts` reads `wordmarkPaths` instead of sampling font text; `readToken()` strings updated to the new token names |
| `deploy` | `.github/**`, `public/**`, `src/app/icon.svg`, `src/app/opengraph-image.*`, `README.md` | GitHub Pages workflow (build and publish `out/` on push to `main`), `.nojekyll`, favicon, share image, pinned Node version |

Everything else is frozen. A lane that needs a frozen file changed reports it under "Notes for integrator" instead of editing it. Each lane ends with: summary, files changed, notes for integrator, and the output of `tsc`, `eslint` and `npm run build`.

## Phase 3: integrate and QA (Fable manages)

1. Merge lane branches into `overhaul/papercut` in order: art, shell, sections-a, sections-b, intro, deploy. Folders are disjoint, so conflicts should only appear if a lane broke ownership.
2. Run `npx tsc --noEmit --incremental false`, `npx eslint`, `npm run build` on the integration branch.
3. One fresh Opus review agent audits the built site against the contract and mockup. It is given the code and the mockup, not Fable's opinion.
4. Defects go back to the owning lane agent (its worktree and context are still live); Fable does not patch site code directly.
5. User previews the built site locally. Push and PR to `main` happen only on the user's explicit go-ahead, since merging to `main` now triggers a live deploy.

## Verification

- `tsc`, `eslint`, `next build` all clean on `overhaul/papercut`.
- `grep` finds no hex/rgb literals outside `globals.css`, and no references to the old tokens (`signal`, `amber`, `phosphor`, `ink`, `paper`) or old fonts.
- Built page checked at 375, 768 and 1440 px: no horizontal scroll, one `<h1>`, visible focus, body text contrast at least 4.5:1 (steel and mint never used for small text).
- Intro: plays once per session, skip works by click, key and button, does not run under reduced motion, page is fully visible with JS disabled.
- Side-by-side comparison of the built hero against the banner PNG and the approved mockup.
- After merge: the Pages workflow run is green and the live URL serves the site rather than the README.

## Notes

- Both PNGs arrived as chat attachments. Phase 0 step 1 copies them from the session image folder into `docs/reference/`; if the round logo is not on disk there, the user drops it into the repo.
