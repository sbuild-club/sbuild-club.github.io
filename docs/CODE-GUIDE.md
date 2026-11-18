# SBUILD code guide

How the site's code is organised, the conventions every file follows, and recipes for common changes. Read it before changing or adding code.

- How the site looks (colours, type sizes, shapes, motion): [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).
- Commands, deployment and Node version: the root `README.md`.
- Last checked against the code: 2026-11-17.

## 1. Stack

Next.js 16 App Router as a static export (`output: "export"`), React 19, TypeScript, Tailwind CSS v4 (configured in CSS, there is no `tailwind.config`), ESLint 9 with `eslint-config-next`. The only runtime dependencies are `react`, `react-dom` and `next`: all illustration and animation is handwritten (inline SVG, the Web Animations API), so solve new needs the same way rather than adding packages.

Every push to `main` runs `.github/workflows/deploy.yml`: lint, type check, build, then publish `out/` to GitHub Pages. A failing check blocks the deploy and the live site stays as it was.

## 2. Where things live

```
src/
  app/
    layout.tsx           html shell: fonts, the intro gate script, <Intro />, metadata, themeColor
    page.tsx             home page: <Nav />, <main> with the sections in order, <Footer />
    not-found.tsx        404 page (exported as out/404.html)
    globals.css          ALL design tokens, the Tailwind theme, cut/stitch utilities, intro variants, base styles
    icon.svg             favicon (static file, literal hex)
    opengraph-image.png  link-preview image (+ .alt.txt)
  content/site.ts        ALL copy and links, typed
  lib/fonts.ts           the three font families (next/font/google)
  components/
    ui/                  shared paper primitives: Button, PaperCard, Plaque, SectionHeading, Sticker, StitchLine, Tag, cx
    art/                 SVG illustration (see DESIGN-SYSTEM.md §5); wordmarkPaths.ts and wordmarkArc.ts hold the traced letter geometry
    nav/                 Nav (server), NavToggle (client: the phone menu), rootHref
    hero/                Hero, BannerArt (the scattered banner pieces)
    footer/              Footer
    sections/<name>/     Manifesto, Programs, Projects, Events, Team, Join — one folder each
    intro/               first-visit intro (§7)
docs/                    this guide, DESIGN-SYSTEM.md, reference art and mockups, historical overhaul docs
public/                  copied into out/ as-is (.nojekyll)
```

Which file to open:

| To change… | Open |
|---|---|
| Any visible text or link | `src/content/site.ts` |
| A colour, cut shape, stitch size, focus ring | `src/app/globals.css` |
| A font | `src/lib/fonts.ts` and `globals.css` (recipe in §9) |
| How every button / card / tag / heading looks | the matching file in `components/ui/` |
| One section's layout | `components/sections/<name>/<Name>.tsx` (Hero, Nav, Footer have their own folders) |
| Section order | `src/app/page.tsx` |
| The intro's timing | constants at the top of `components/intro/timeline.ts` |

## 3. Content: `src/content/site.ts`

- Every visible string comes from the `site` object. Components hold no copy of their own beyond these fixed strings: `skip`, `back to top`, aria-labels (`primary`, `manifesto`, `menu`), wordless glyphs (→ ↵ ↑), and the wordmark letters inside art.
- The `Site` type fixes list lengths with tuples: 4 nav links, 3 hero pillars, 4 manifesto statements, 3 programs, 4 team members, 4 socials. Changing a count means editing the type and checking the component that renders it.
- Values in `[BRACKETS]` are placeholders and render as-is until real copy replaces them. Fill in only real club facts.
- Empty lists switch sections automatically: `projects: []` shows one tile with `projectsNote`; `events: []` shows the open-role slip (`openRole`) instead of event slips. Adding the first project or event switches the section over.
- **Section headings come from the nav labels**, looked up by href: Programs ← the `#programs` link, Projects ← `#projects` ("cohort program"), Events ← `#events` ("open role"), Team ← `#team`. Renaming a label renames both the nav link and the heading. Changing a link's `href` leaves that section with an empty heading, so change the section's lookup at the same time.
- Keep in-page links as bare hashes (`"#programs"`) in content. Nav and Footer wrap them with `rootHref()` so they also work from the 404 page.

## 4. Component conventions

- **Exports.** One component per file, a named export matching the file name (`export function Programs`), imported through the `@/` alias.
- **Server first.** Components are Server Components. Only `intro/Intro.tsx` and `nav/NavToggle.tsx` are `"use client"`. Add interactivity as a small client island that wraps server-rendered children, as `NavToggle` wraps the nav's link list.
- **Props map to static class strings.** Tailwind generates CSS only for class names it finds written out in full in the source, so a class built from fragments (`` `bg-${tone}` ``) silently produces nothing. Map every prop value to a complete literal and join with `cx()`:

  ```ts
  const faces: Record<Variant, string> = {
    primary: "bg-teal text-cream",
    secondary: "bg-sage text-navy",
    inverse: "bg-cream text-navy",
  };
  <span className={cx(faceBase, shape, faces[variant])} />
  ```

- **`className` is for layout** on `ui/` primitives: position, margin, width, grid/flex placement, alignment. Visual changes go through props (`variant`, `tone`, `cut`, `size`, `tilt`). Art components also accept size and transform classes (`h-auto w-24 rotate-6`).
- **Cycling.** Neighbour variety (cuts, tones, tilts) comes from small arrays indexed with `i % array.length`. Lists are keyed by index (`key={i}`) because placeholder values repeat.
- **Colours through tokens only**: `bg-teal`, `text-navy`, `fill-steel`, `stroke-cream`, or `var(--token)`. Literal hex exists in exactly three files: `globals.css` (the tokens themselves), `layout.tsx` (`themeColor`, the cream value, because metadata cannot read CSS variables) and `app/icon.svg` (a static file). Font names appear only in `lib/fonts.ts` and the fallback stacks in `globals.css`.
- **Solid paper.** Use full-strength token colours: teal is the secondary text colour, a second sheet is the depth. The design has no opacity modifiers (`text-navy/70`), `color-mix()`, `box-shadow`, gradients or borders around shapes.
- **Inline `style`** carries only numbers computed from props or data (Avatar's font size, the intro's geometry), never colours or fonts.
- **CSS modules** (`*.module.css`) are plain CSS that reads `var(--token)`. Keep `@keyframes` in the same module as the `animation` that uses it (module keyframe names are hashed). Gate ambient loops on `:global(html[data-intro="done"])` inside `@media (prefers-reduced-motion: no-preference)`, as `Beaver.module.css` does.
- **Motion** uses `motion-safe:` on every transition and animates only `transform` and `opacity`.

### The primitives

| Component | Use it for | Key props |
|---|---|---|
| `Button` | Every button and button-styled link (`<a>` when `href` is set) | `variant` primary / secondary / inverse, `size` sm (nav) / md / lg, `cut` a/b/c |
| `PaperCard` | Cards and tiles | `cut` (required), `tone` cream / teal / sage-soft, `layer` (navy second sheet), `as` div / li / article |
| `SectionHeading` | All section (`h2`) and card (`h3`) headings | `title`, `as`, `number`, `tilt` ±1/±2, `tone` inherit / steel / teal |
| `Plaque` | The tagline | `as` |
| `Tag` | Small labels, dates | `tone` teal / navy / sage-soft / cream, `cut` a/b |
| `Sticker` | A tilted slip with a second sheet (available, currently unused) | `tone`, `tilt` |
| `StitchLine` | Section dividers | `tone` sage-soft / cream / steel |
| `cx` | Joining class strings | — |

Read the component file for the full prop types; each has a doc comment.

## 5. Tailwind v4 setup (`src/app/globals.css`)

- `:root` holds the raw tokens (colours, fonts, `--layer-offset`, stitch sizes, cut polygons, `--z-intro`).
- `@theme inline` exposes them to Tailwind. It starts with `--color-*: initial` and `--font-*: initial`, which delete Tailwind's default palette and font stacks, so only the 11 tokens plus `transparent` and `current` exist as colours. Spacing, font sizes, breakpoints and rotations are Tailwind's defaults.
- `@utility` defines `cut-a` … `cut-key` (clip-paths) and `stitch-stroke` (SVG dash pattern).
- `@custom-variant` defines `intro-pending:` and `intro-done:` (they match `html[data-intro]`).
- The base layer sets: cream html with navy text; scroll locked while the intro is pending; body 17px / 1.6 with `overflow-x: clip`; `section[id] { scroll-margin-top: 5rem }` so anchors land below the sticky nav; the focus ring; per-surface `--focus-ring` and `--numeral`; selection colours; smooth scroll when motion is allowed.
- Arbitrary values are fine for non-colour sizes: `text-[13px]`, `tracking-[0.06em]`, `pr-(--layer-offset)`, `text-(color:--numeral)`. Give a clamped font size the `length:` hint (`text-[length:clamp(1.75rem,5vw,2.75rem)]`) so Tailwind reads it as a size.

## 6. Surfaces and accessibility

- A dark band (teal, navy) carries `data-surface="dark"`; a light sheet inside it carries `data-surface="light"`. That switches the focus ring and numeral colours. `PaperCard` and `Plaque` set it themselves.
- One `<h1>` per page: the hero's `#wordmark` (the 404 page has its own). Sections use `SectionHeading` (h2), cards use `as="h3"`.
- Decorative art is `aria-hidden`. Art that carries meaning gets a `title` from `site` (e.g. `<Badge title={site.name} />`).
- Keep focusable elements unclipped: the `cut-*` goes on a child, and links inside a card stay within its padding.
- Touch targets are at least 44px (`min-h-11`).
- The page works without JavaScript: the gate never runs, so `data-intro` is absent, the overlay stays hidden and the nav is visible; the phone menu stays collapsed.

## 7. The intro

| File | Job |
|---|---|
| `app/layout.tsx` (gate script) | Before first paint, sets `html[data-intro]`: `pending` on the first visit in a tab, `done` if already seen this session or reduced motion is on. Flips to `done` after 8s as a failsafe. |
| `intro/introState.ts` | Reads and writes that attribute and the sessionStorage flag `sbuild:intro`. `endIntro()` is the single exit: write the flag, set `done`. |
| `intro/Intro.tsx` | The overlay markup (client component, server-rendered). Every moving part starts invisible. |
| `intro/timeline.ts` | The storyboard: one async function per step using the Web Animations API. Timing constants at the top. |
| `intro/layout.ts` | Geometry: where keys, the wordmark stage and the plaque go for the current viewport. |
| `intro/scope.ts` | One cancellable run: every timer, frame, animation and listener, cancelled together on skip, unmount or Strict Mode re-run. |

The `html[data-intro]` state drives CSS elsewhere through the variants: the overlay is `hidden intro-pending:block`, scrolling is locked while pending, the nav waits off-screen (`intro-pending:-translate-y-full`) and drops in on `done`, and the beaver blinks only under `done`. To make anything else wait for the intro, give it an `intro-pending:` class.

**The handoff.** The intro's wordmark flies onto `h1#wordmark[data-intro-target]` in `Hero.tsx`. For it to land exactly:

- The h1 holds only `<Wordmark cap />` and the sr-only name, with no padding or border, so its box is the SVG's box.
- The h1 sits fully inside the first viewport at 375×667 and larger.
- The h1 and its ancestors stay free of transforms, clipping, filters and opacity.

If `#wordmark` is missing or off-screen, the intro fades out instead of landing.

To replay the intro while developing, open the site in a new tab, or run `sessionStorage.removeItem("sbuild:intro")` in the console and reload.

## 8. Checks and lint

Run all three before committing; CI runs the same:

```sh
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

Then look at the page at 375, 768 and 1440px wide: no horizontal scroll, focus rings visible, nothing overlapping.

`eslint-config-next` 16 enforces the React Compiler rules as errors:

- Call `setState` from event, timer or animation-frame callbacks, never synchronously in an effect body. For outside state, use `useSyncExternalStore` (as the intro does).
- Read `ref.current` only in effects and handlers.
- Keep render pure: `Math.random()`, `Date.now()` and `performance.now()` belong in effects (Avatar picks its tone from a pure function of the initials).
- Fix lint and type errors at the source rather than with `eslint-disable`, `@ts-ignore` or `@ts-expect-error`.

Strict Mode runs effects twice in development (mount → cleanup → mount), so every cleanup cancels all its timers, frames and listeners.

## 9. Recipes

### Add a section

1. **Content.** Add a typed field to `Site` and its values in `site.ts`.
2. **Component.** Create `src/components/sections/<name>/<Name>.tsx` with a named export.
3. **Surface.** Pick one that keeps the page rhythm (coloured bands alternate with cream; see DESIGN-SYSTEM.md §2) and start from the matching skeleton.

   Sage or teal band:

   ```tsx
   <section id="name" className="bg-sage py-4 text-navy sm:py-5">
     {/* teal: data-surface="dark" className="bg-teal py-4 text-cream sm:py-5" */}
     <StitchLine tone="cream" />
     <div className="mx-auto max-w-7xl px-4 py-11 sm:px-10 sm:py-[76px]">
       <SectionHeading title={title} tilt={-1} className="mb-7 sm:mb-10" />
       {/* content */}
     </div>
     <StitchLine tone="cream" />
   </section>
   ```

   Cream section:

   ```tsx
   <section id="name" className="px-4 py-16 sm:px-10 sm:py-24">
     <div className="mx-auto max-w-[1200px]">
       <SectionHeading title={title} className="mb-8 sm:mb-10" />
       {/* content */}
     </div>
   </section>
   ```

4. **Build** from the primitives (`PaperCard`, `Button`, `Tag`, `SectionHeading`) and art, cycling cuts so neighbours differ.
5. **Mount** it in `src/app/page.tsx` in the right order. To put it in the nav, add a link to `site.nav.links` (widen the tuple type) and look the heading up by its href.

Done when: the three checks pass; the section has no horizontal scroll at 375, 768 and 1440px; every link shows its focus ring; all text meets the contrast rules in DESIGN-SYSTEM.md §2.

### Change or add a colour

1. Edit the value in `:root` in `globals.css`. For a new colour, also add `--color-<name>: var(--<name>);` to `@theme inline`.
2. If you changed `cream`, also update `viewport.themeColor` in `layout.tsx`. If you changed sage, cream or navy, update the hex in `app/icon.svg`.
3. Recheck contrast for every text pairing that uses it, and update the tables in DESIGN-SYSTEM.md §2.

### Change a font

1. In `src/lib/fonts.ts`, import the new family from `next/font/google` with its own `variable` name.
2. Point the matching `--font-display`, `--font-label` or `--font-body` at it in both `:root` and `@theme inline` in `globals.css`.
3. Recheck the hero pillars: their `cqi` sizes were tuned to Fredoka's widths so the longest pillar fits on one line (see the comment in `Hero.tsx`).
4. Update DESIGN-SYSTEM.md §3.

### Add a primitive or an art piece

- Paper pieces that hold text or take clicks go in `components/ui/`; drawings go in `components/art/`.
- Follow §4: props map to static class literals, `className` stays layout-only (art may also take size and transform classes), colour comes from token classes.
- Art roots are `<svg focusable="false" aria-hidden="true">` with a `viewBox`; `size` sets the width and a `w-*` class plus `h-auto` overrides it.
- A layered piece copies the second-sheet structure in DESIGN-SYSTEM.md §4.

### Change copy, links or team members

Edit `src/content/site.ts` only; the dev server updates as soon as you save.
