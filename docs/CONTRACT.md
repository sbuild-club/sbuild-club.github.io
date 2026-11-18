# sbuild — build contract (v2, paper-cut overhaul)

> **Status (2026-11-17): historical.** This was the contract for the six-lane overhaul build, which is merged. Its lane, worktree and frozen-file rules (§1, §5, §6) no longer apply. For current work use [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) (the look) and [`CODE-GUIDE.md`](CODE-GUIDE.md) (the code); where they differ from this file, they win.

Six lanes re-skin this site at the same time, each in its own git worktree, all branched from the foundation commit. Folder ownership keeps them from colliding; the interfaces below let every lane code against the foundation stubs before the real art exists. Read this file and `docs/BRIEF.md` in full before touching anything.

`docs/reference/` is the visual source of truth (banner, brand rules, tokens, approved mockup); see the brief. `.claude/prompts/sbuild-website.md` is the round-zero prompt for a static HTML build. It is **superseded** by `docs/BRIEF.md` and this contract; it stays in the repo for history only. Do not follow it and do not edit it.

Stack (fixed): Next.js 16 App Router (static export) · React 19 · TypeScript · Tailwind CSS v4 (CSS-first, no tailwind.config) · ESLint 9 flat config (eslint-config-next). No other dependency exists or may be added.

## 1. Ownership

A lane may create, edit, rename or delete files ONLY inside its folders.

| lane | owns |
|---|---|
| art | `src/components/art/**` |
| shell | `src/components/nav/**`, `src/components/hero/**`, `src/components/footer/**` |
| sections-a | `src/components/sections/manifesto/**`, `src/components/sections/programs/**`, `src/components/sections/projects/**` |
| sections-b | `src/components/sections/events/**`, `src/components/sections/team/**`, `src/components/sections/join/**` |
| intro | `src/components/intro/**` |
| deploy | `.github/**`, `public/**`, `src/app/icon.svg`, `src/app/opengraph-image.*`, `README.md` |

Everything else is frozen (integrator only): `src/app/**` (except the two deploy files above), `src/content/**`, `src/lib/**`, `src/components/ui/**`, `docs/**` (including `docs/reference/**`), all config files (`package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`), `.claude/**`. A lane that needs a frozen file changed does not edit it: it codes against the current version and reports the request under "Notes for integrator".

Inside your folders you may add sub-components, plain `.ts` helpers and `*.module.css` files. Never rename, move or delete the entry files listed in §2, and never turn them into default exports.

## 2. Interfaces

Every component is a named export matching its file name. Paths are relative to `src/components/`; import them as `@/components/...`. All components are Server Components unless §4 says otherwise.

### 2.1 Shared primitives (`ui/`, frozen)

`className` on every ui primitive is for layout only: position, margin, width, flex/grid placement, alignment. Never pass colour, background, border, padding, font, size or rotate classes; use the props.

| file | export | props | root element |
|---|---|---|---|
| `ui/Button.tsx` | `Button` | `{ href?: string; variant?: "primary" \| "secondary" \| "inverse" \| "accent"; size?: "sm" \| "md" \| "lg"; cut?: "a" \| "b" \| "c"; className?: string; children: ReactNode }` plus all `<a>` (with `href`) or `<button>` (without) props | `<a>` when `href` is set, else `<button type="button">`; `inline-flex`, unclipped, carries the focus ring |
| `ui/Tag.tsx` | `Tag` | `{ tone?: "teal" \| "navy" \| "sage-soft" \| "cream"; cut?: "a" \| "b"; className?: string; children: ReactNode }` | inline-flex `<span>` |
| `ui/Sticker.tsx` | `Sticker` | `{ tilt?: -4 \| -3 \| -2 \| 2 \| 3 \| 4; tone?: "teal" \| "sage" \| "cream" \| "mint"; className?: string; children: ReactNode }` | inline-flex `<span>`, rotated |
| `ui/SectionHeading.tsx` | `SectionHeading` | `{ title: string; number?: string; as?: "h2" \| "h3"; tilt?: -2 \| -1 \| 1 \| 2; tone?: "inherit" \| "steel" \| "teal"; className?: string }` | `<h2>` or `<h3>`, `flex flex-col` |
| `ui/PaperCard.tsx` | `PaperCard` | `{ cut: "a" \| "b" \| "c"; tone?: "cream" \| "teal" \| "sage-soft"; layer?: boolean; as?: "div" \| "li" \| "article"; className?: string; children: ReactNode }` | `<div>`/`<li>`/`<article>`, `relative flex flex-col`, with `data-surface` |
| `ui/Plaque.tsx` | `Plaque` | `{ as?: "p" \| "div" \| "span"; className?: string; children: ReactNode }` | `<p>` by default, `inline-block`, `data-surface="dark"` |
| `ui/StitchLine.tsx` | `StitchLine` | `{ tone?: "sage-soft" \| "cream" \| "steel"; className?: string }` | block `<svg>`, `w-full h-[22px]`, aria-hidden |
| `ui/cx.ts` | `cx` | `(...classes: Array<string \| false \| null \| undefined>) => string` | joins static class strings |

Details:

- **Button.** `<Button href={site.nav.cta.href} size="sm">{site.nav.cta.label}</Button>`. Variants follow `mockup/Components.html`: `primary` = teal face, cream text, navy layer (default cut a); `secondary` = sage face, navy text, steel layer (default cut b); `inverse` = cream face, navy text, navy layer, for teal and navy bands (default cut c). Sizes: `sm` nav (17px, 18px from `sm:`, 20px from `xl:`), `md` default (18px), `lg` join CTA (20px from `sm:`). Face is at least 44px tall. Hover moves the face 4px toward its layer, press lands it on the layer. The root reserves `--layer-offset` on its right and bottom, so the layer never overflows; `className="w-full"` makes a full-width phone CTA. Children may include an aria-hidden glyph (`→`).
- **Tag.** label-tag style (Fredoka 600, 13px, 0.06em). Default teal on cut a. Alternate `cut` (and tone) between neighbours; pick a tone that differs from the ground (cream or teal tags on a sage-soft tile, as in the mockup).
- **Sticker.** A tilted paper slip (cut-tag-a) with a flat layer: teal/cream text/navy layer (default), sage/navy/steel, cream/navy/navy, mint/navy/teal. Not interactive; wrap it in a link to make it one. Default tilt 3.
- **SectionHeading.** Bungee in capitals (`uppercase`), never bold. h2 = display-section (36px, 48px from `sm:`, line-height 1.05); h3 = display-card (24px, 26px from `sm:`, line-height 1.15). `tilt` rotates the title only (from its left edge). `tone` defaults to inherit; `steel` only on cream. `number` renders above the title as an aria-hidden decorative numeral (44px, 56px from `sm:`), coloured by surface through `--numeral` (steel on light, mint inside `data-surface="dark"`). Centre with `className="items-center text-center"`.
- **PaperCard.** The root is unclipped and carries `className` and `data-surface` (`dark` for teal, `light` otherwise). Inside: the optional navy layer (`layer`) and the clipped face, which holds `children` in a flex column (`gap-3`; padding 32px top, 36px bottom, 24px sides, 28px sides from `sm:`). With `layer`, the root reserves `--layer-offset` right and bottom. Use `as="li"` inside lists. Keep focusable children inside the padding so the cut edge never clips their focus ring.
- **Plaque.** `<Plaque>{site.tagline}</Plaque>`: jagged teal `cut-plaque`, cream label-plaque text (18px, 24px from `sm:`), centred. No layer.
- **StitchLine.** Two dashed rows from the stitch tokens (dash 30, gap 14, weight 6, row gap 10). Tone: `sage-soft` on cream (default), `cream` on sage or teal, `steel` on navy.
- **cx.** Only joins literals; never build class names from parts.

### 2.2 Art components (`art/`, owned by the art lane, stubbed by foundation)

Every art entry file below exists now as a stub with its final props and root element; the art lane replaces the drawing, never the interface. Rules for all of them:

- Root is a `block` `<svg>` with `focusable="false"` unless the table says otherwise. It is `aria-hidden="true"`, except that a component with a `title`/`label` prop gets `role="img"` and `aria-label` when that prop is passed.
- `size` is the rendered **width** in px (height follows the viewBox aspect) and is written as the svg `width`/`height` attributes. A Tailwind `w-*` class in `className` overrides it (add `h-auto` with it).
- `className` may carry layout, size and transform classes (position, margin, `w-*`, `h-auto`, `rotate-*`, `-scale-x-100`, translate). Never colour classes, except on `ProjectIcon`, which fills with `currentColor` and takes a `text-*` colour.
- Inside art, colour only with token classes (`fill-steel`, `stroke-cream`, `text-navy`…) or `currentColor`. Never hex, never `fill="var(--x)"`.

| file | export | props | root element |
|---|---|---|---|
| `art/Wordmark.tsx` | `Wordmark` | `{ variant?: "straight" \| "arced"; cap?: boolean; title?: string; className?: string }` | `<svg viewBox="0 0 W H" overflow="visible" className="block h-auto w-full …">` with W×H from `wordmarkPaths.viewBox`; fills its container's width |
| `art/wordmarkPaths.ts` | `wordmarkPaths`, `toPointsAttr`, types `WordmarkGeometry`, `WordmarkLetter`, `WordmarkChar`, `WordmarkFill`, `WordmarkPoint` | data, see below | — |
| `art/Badge.tsx` | `Badge` | `{ size?: number /* 52 */; title?: string; className?: string }` | `<svg viewBox="0 0 100 100">`, square |
| `art/Beaver.tsx` | `Beaver` | `{ size?: number /* 240 */; blink?: boolean /* true */; className?: string }` | `<svg viewBox="0 0 240 200">`, aria-hidden |
| `art/Keycap.tsx` | `Keycap` | `{ letter?: WordmarkChar; size?: number /* 120 */; className?: string }` | `<svg viewBox="0 0 120 96">`, aria-hidden |
| `art/Lightbulb.tsx` | `Lightbulb` | `{ rays?: boolean /* false */; tone?: "mint" \| "steel" /* mint */; size?: number /* 200 with rays, 80 without */; title?: string; className?: string }` | `<svg>`, viewBox `0 0 200 120` with rays, `60 14 80 96` without |
| `art/Burst.tsx` | `Burst` | `{ size?: number /* 100 */; className?: string }` | `<svg viewBox="0 0 100 100">`, mint rays, aria-hidden |
| `art/StarBurst.tsx` | `StarBurst` | `{ size?: number /* 96 */; className?: string }` | `<svg viewBox="0 0 100 100">`, navy, aria-hidden |
| `art/Exclaim.tsx` | `Exclaim` | `{ count?: 1 \| 2 /* 2 */; size?: number /* 52 for two, 30 for one */; className?: string }` | `<svg>`, viewBox `0 0 70 110` (two) or `0 0 40 110` (one), mint, aria-hidden |
| `art/PixelCluster.tsx` | `PixelCluster`, type `PixelClusterPattern` | `{ pattern?: "tee" \| "plus" \| "row" /* tee */; size?: number /* 64 */; className?: string }` | `<svg>`, viewBox 62 wide (tee 40, plus 62, row 18 tall), steel, aria-hidden |
| `art/SidePanels.tsx` | `SidePanels` | `{ side?: "left" \| "right" \| "both" /* both */; className?: string }` | `<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">`; the parent must be `relative isolate`. `className` here is layout only (e.g. `hidden md:block`) |
| `art/ProjectIcon.tsx` | `ProjectIcon`, type `ProjectIconName` | `{ name: ProjectIconName; size: number; className?: string; label?: string }` | `<svg viewBox="0 0 64 64" width={size} height={size} fill="currentColor">`; `className` goes on the svg |
| `art/Avatar.tsx` | `Avatar`, type `AvatarTone` | `{ initials: string; size?: number /* 124 */; className?: string /* size classes, replace size */; tone?: "sage" \| "sage-soft" \| "steel" \| "teal" \| "navy"; photo?: string /* "/team/x.jpg" */ }` | inline-block `<span aria-hidden="true">`, size×size px (or sized by `className`), no margin; round disc, stitch ring, initials centred, or with `photo` the photo inset to radius 42 and the ring on the rim at radius 46 |

- `ProjectIconName = "rocket" | "wrench" | "lightbulb" | "chip" | "terminal" | "satellite" | "flag" | "bolt"`, exactly these (unchanged from v1's `PixelIconName`). `src/content/site.ts` imports this type. `size` is required: `<ProjectIcon name={project.icon} size={64} className="text-steel" />`.
- `Avatar` without `tone` picks one from the initials with a pure function (same on server and client). Team may pass `tone` per index for a deliberate mix. Initials are navy on sage/sage-soft and cream on steel/teal/navy (large display text, so cream on steel's 3.9:1 is allowed there).
- `Keycap` letters are the six wordmark characters; the banner uses S, B, U.
- `Beaver` blinks only under `intro-done:` and `motion-safe` (CSS module). Show it at most once per screen.
- `Wordmark`: `straight` is the banner wordmark (navy S, steel BUILD); `arced` is the curved one from the round badge. `cap` draws the navy cap with steel brim on the S; the cap may extend above the svg's top edge (overflow visible, at most 25% of the viewBox height), so leave room above. The letters themselves always stay inside the viewBox.

**`wordmarkPaths` (frozen shape, art lane fills the values).**

```ts
type WordmarkChar = "S" | "B" | "U" | "I" | "L" | "D";
type WordmarkFill = "navy" | "steel";               // token names
type WordmarkPoint = readonly [number, number];     // [x, y] in viewBox units
type WordmarkLetter = { char: WordmarkChar; fill: WordmarkFill; points: readonly WordmarkPoint[] };
type WordmarkGeometry = {
  viewBox: { width: number; height: number };       // viewBox is `0 0 width height`
  letters: readonly [WordmarkLetter × 6];           // S, B, U, I, L, D in reading order
};
export const wordmarkPaths: WordmarkGeometry;
export function toPointsAttr(points: readonly WordmarkPoint[]): string; // "x,y x,y …"
```

Each letter is ONE closed polygon drawn with `fill-rule="evenodd"`; counters (B, D) are traced into the same list through a zero-width bridge. The foundation values are placeholder rectangles (viewBox 1030×240); the art lane replaces `viewBox` and `points` with shapes traced from the banner and may change the numbers freely, but never the types, the letter order or the fills (S navy, the rest steel). The intro lane reads this data and must work for any values of that shape.

### 2.3 Section and shell entry files

| file | export | props |
|---|---|---|
| `intro/Intro.tsx` | `Intro` | none (see §2.6) |
| `nav/Nav.tsx` · `hero/Hero.tsx` · `footer/Footer.tsx` | `Nav` · `Hero` · `Footer` | none |
| `sections/manifesto/Manifesto.tsx` · `programs/Programs.tsx` · `projects/Projects.tsx` · `events/Events.tsx` · `team/Team.tsx` · `join/Join.tsx` | `Manifesto` `Programs` `Projects` `Events` `Team` `Join` | none |

### 2.4 Mount points (frozen)

- `layout.tsx`: `<html lang="en" className={fontVariables} suppressHydrationWarning>` → `<head>` holds the intro gate script (§2.6) → `<body className="bg-cream font-body text-navy antialiased">` → `<Intro />` first → `{children}`. Metadata: `metadataBase` `https://sbuild-club.github.io`, `title` = `site.name`, `description` = `site.tagline`, `openGraph` `{ type: "website", url: "/", siteName: site.name }` (the deploy lane's `opengraph-image.*` supplies the image); `viewport.themeColor` is the cream value. There is no scanline overlay any more.
- `page.tsx`: `<Nav />`, then `<main>` holding Hero, Manifesto, Programs, Projects, Events, Team, Join, then `<Footer />`.
- `not-found.tsx` (exported as `out/404.html`, which GitHub Pages serves for unknown paths): `<Nav />`, a `<main>` on cream holding a large aria-hidden `site.notFound.code` in the display face with a tilted `Keycap`, the page's one `<h1>` (`site.notFound.heading`), a `StitchLine` and a `Button` to `site.notFound.ctaHref`, then `<Footer />`. All copy from `site.notFound`. There is no `#wordmark` there, so a first-visit intro skips its landing move and fades out (§2.6). Nav and footer links are in-page hashes (`#programs`, `#top`), so on the 404 page only the button and the external links lead away.

### 2.5 Sections, surfaces, headings

Each id sits on the component's outermost element and appears exactly once in the page. Surfaces follow `mockup/Main.html`.

| component | outer element | id | surface | headings and structure |
|---|---|---|---|---|
| Nav | `<header>` > `<nav aria-label="primary">` | — | cream | none. Brand link `<a href="#top">` holding `<Badge />` and the name (`site.name`, display face, uppercase, as in the mockup). Never a second `#wordmark` or `<h1>`. |
| Hero | `<section>` | `top` | cream | the page's only `<h1>` (§2.6 handoff); `<Plaque>{site.tagline}</Plaque>` as a sibling; below the banner one centred column: the pillars are a `<ul>` with one `<li>` per `hero.pillars` item (bold label + text, navy, label face); then the slogan, a `<p>` with `site.hero.mission` in steel label type at 24px or larger; CTAs are `Button`s, centred |
| Manifesto | `<section>` | — | sage band, cream StitchLine top and bottom (as Programs) | h2 = `site.manifesto.heading` ("Mission"), centred over body-lead `<p>`s from `site.manifesto.paragraphs`: the bold `lead` runs into the first, the last is a teal Fredoka call-out |
| Programs | `<section>` | `programs` | sage | h2 = programs nav label; each program a `<PaperCard>` (cuts a, b, c; one `tone="teal"`) holding `<SectionHeading as="h3" number={p.number} title={p.name} />` and a `<p>` |
| Projects | `<section>` | `projects` | cream | h2 = projects nav label; project names are h3; tiles are sage-soft cut paper; while `site.projects` is empty, one layered sage-soft tile with `site.projectsNote` in display type instead of the grid |
| Events | `<section data-surface="dark">` | `events` | teal | h2 = events nav label; rows are not headings; cream slips (`cut-slip-a` / `cut-slip-b`) with `data-surface="light"`; while `site.events` is empty, one slip with `site.openRole.title` in display type and a primary `Button` to `site.openRole.cta` (new tab), and the nav label for `#events` reads "open role" |
| Team | `<section>` | `team` | cream | h2 = team nav label; names and roles are not headings |
| Join | `<section>` | `join` | sage | h2 = `site.join.headline` |
| Footer | `<footer data-surface="dark">` | — | navy | none |

- Nav-label h2: `<SectionHeading title={site.nav.links.find((l) => l.href === "#programs")?.label ?? ""} />` (CSS uppercases it).
- Exactly one `<h1>` on the home page: Hero's `#wordmark`. (The 404 page has its own single h1.)
- **Surfaces.** `cream`: the default, no attribute. `sage` band: `bg-sage`, navy text, no attribute needed. `teal` or `navy` dark band: `bg-teal`/`bg-navy text-cream` plus `data-surface="dark"` on the outer element. A light element inside a dark band (event slips, cream cards) sets `data-surface="light"`; `PaperCard` and `Plaque` set theirs automatically. `data-surface` switches the focus ring, the selection colours and the `--numeral` colour.
- Bands are divided by `StitchLine` pairs as in the mockup (cream stitches on sage and teal, sage-soft on cream, steel on navy).
- Nav: sticky header at most 76px tall (sections have `scroll-margin-top: 5rem`). Links come from `site.nav.links` (`#programs`, `#projects`, `#events`, `#team`) plus `site.nav.cta` (the newsletter form, the same URL as `site.footer.newsletter`, opened in a new tab). The "interest signup" Button stays visible outside the collapsible panel at every width; below `lg` it shows `site.nav.cta.shortLabel` ("signup") so the header fits at 375px and the links stay on one line at 768px, and the full label stays its accessible name. The link panel is server-rendered (links always in the DOM) and toggled by the client `NavToggle` (`<button aria-expanded aria-controls>`, at least 44×44px; closes on link click and on Escape). With JS off a collapsed mobile panel is acceptable.
- Footer: socials from `site.footer.socials`, email from `site.footer.email` (as `mailto:`), the newsletter sign-up as an inverse `Button` to `site.footer.newsletter` (new tab) in a row with `id="newsletter"` (the hero's primary CTA jumps to it), "back to top" → `#top`.

### 2.6 Intro states and the intro/hero handoff

**`html[data-intro]` states (unchanged from v1).** An inline script in `layout.tsx` (frozen) sets the state before first paint:

- **absent**: JS disabled. No overlay, no ambient motion; the page is fully visible and usable.
- **`pending`**: first visit in this tab, motion allowed. The overlay is visible from the first paint. `globals.css` locks scroll (`html[data-intro="pending"] { overflow: hidden }`) and swaps the scrollbar gutter for padding of the same width (`--scrollbar-width`, measured by the gate), so the overlay covers the whole window while the page keeps its final width; Intro never touches html/body overflow.
- **`done`**: returning visit in this tab, reduced motion, finished, skipped, or the gate's 8 s failsafe. No overlay; ambient motion runs.
- **`html[data-intro-shown]`**: the `performance.now()` ms at which the page was first visible. A page Chrome prerenders (it does for sites typed into the address bar) or one opened in a background tab runs the gate unseen; the gate sets this on `visibilitychange` / `prerenderingchange`, and both the timeline and the 8 s failsafe start from it.
- Flag: `sessionStorage` key `sbuild:intro`, value `"1"`. The gate reads it; Intro writes it on finish or skip, never at start. Wrap every storage access in try/catch.
- Tailwind variants: `intro-pending:` and `intro-done:` (e.g. `hidden intro-pending:block`, `intro-done:motion-safe:…`). CSS Module equivalent: `:global(html[data-intro="done"]) .x { … }`.

**Hero side (shell lane).** Hero renders exactly this inside `<section id="top">`:

```tsx
<h1 id="wordmark" data-intro-target className="{layout only: width, max-width, margin}">
  <Wordmark />                                  {/* or <Wordmark cap /> */}
  <span className="sr-only">{site.name}</span>
</h1>
```

- The h1 has no padding, border, background or text styling that adds size; its box is exactly the Wordmark svg's box (block, full h1 width, height from the viewBox), so the h1 rect has the viewBox's aspect ratio.
- It sits fully inside the first viewport at scrollY 0 for viewports 375×667 and larger, below the header. No transform, rotation, filter, clip-path or opacity on it or on its Hero ancestors. Plaque, keycaps, beaver, bursts and stickers are siblings (they may overlap it visually), never children.

**Intro side (intro lane).**

- Root renders on the server: `fixed inset-0 z-(--z-intro) bg-cream hidden intro-pending:block`. DOM: root `<div>` (no aria-hidden) > [`<div aria-hidden="true">` with all visuals, `<button type="button">` skip]. Never put aria-hidden on an ancestor of the skip button. The skip button is at least 44px tall.
- First client render matches the server render: never read sessionStorage, matchMedia, window or the html attribute in render or in useState initialisers. Read the state with `useSyncExternalStore` (subscribe with a MutationObserver on `<html>`; server snapshot `""`). Render the overlay unless the state is `"done"`; start the timeline in an effect only when the state is `"pending"`, and let it play only once `data-intro-shown` is set.
- The landing element is an aria-hidden `<svg>` with the same viewBox as `wordmarkPaths` (it may render `<Wordmark />` without `title`, or its own polygons from `wordmarkPaths`). Intro never uses `id="wordmark"`, `data-intro-target` or h1–h6.
- Step 3: keycaps assemble into the letters, using `wordmarkPaths.letters[i].points` mapped from viewBox units onto the landing svg's on-screen box.
- Step 4: read `document.querySelector('#wordmark[data-intro-target]')?.getBoundingClientRect()` and move the landing svg onto that rect with a FLIP transform (translate plus ONE uniform scale; the aspect ratios match by construction). If `#wordmark` is missing or not fully inside the viewport, skip the move and fade out; never throw.
- Every exit path ends with `data-intro="done"`, the flag written and the overlay unmounted: finish; skip by button, click or any key; missing or off-screen `#wordmark`; a caught error; the failsafe having already flipped the state.
- Intro NEVER imports Hero; Hero NEVER imports Intro. They share only the DOM (`#wordmark`, `html[data-intro]`). Intro may import from `@/components/art/*` (art components are server-safe and work inside the client Intro) and `@/content/site`.
- In SVG or DOM use token classes. In canvas or JS read colours with `getComputedStyle(document.documentElement).getPropertyValue("--steel")` (any token name from §3) and fonts from the computed `fontFamily` of a `.font-display` / `.font-label` element. Never type a hex value or a font name. The old names (`--ink`, `--paper`, `--signal`, `--amber`, `--phosphor`) no longer exist.

### 2.7 Content

- All copy comes from `import { site } from "@/content/site"`. Values in `[BRACKETS]` are placeholders; render them as-is (CSS `uppercase`/`lowercase` is fine). NEVER invent or hard-code names, dates, stats, sponsors, schools or other copy.
- `site.tagline` = "SBU's First Tech Entrepreneurship Club" is real copy from the logo; render it exactly, in the Plaque.
- Allowed hard-coded strings, exactly these: the intro button label `skip` (optionally with `↵`); `back to top`; aria-labels (`primary`, `menu`, `close`); the wordmark letters S B U I L D inside aria-hidden art (keycaps); wordless glyphs (→ ↵ ↑ ×); numbers derived from content (e.g. `String(site.projects.length).padStart(2, "0")`). No column headers, eyebrows, "learn more", "new" or similar. The round-one boot lines and `> ` prefix are gone.
- Accessible names on art come from content: `<Badge title={site.name} />` where a name is needed.
- Sticker text reuses site values: Hero → `site.nav.cta.label`; Projects → `` `${String(site.projects.length).padStart(2, "0")} ×` `` or a project tag; Join → `site.name`.
- Footer labels are only `site.footer.newsletter.label`, `site.footer.socials[i].label`, `site.footer.email` and `back to top`.
- Key list items by index (`key={i}`); values may repeat once real copy lands.
- `site` shape: `name`; `tagline`; `nav {links[4] {label,href}, cta {label,href}}`; `hero {pillars[3] {label,text}, mission, primaryCta {label,href}, secondaryCta {label,href}, socialsCta {label,href}}`; `manifesto {heading, lead, paragraphs[1+]}`; `programs[3] {number,name,description}`; `projects[] {name, tags: string[], icon: ProjectIconName}` (may be empty); `projectsNote`; `events[] {date,name,location}` (may be empty); `team[] {name,role,initials,photo?,href?}`; `openRole {title, cta {label,href}}`; `join {headline, body?, ctaLabel, ctaHref}` (no body → no paragraph); `footer {newsletter {label,href}, socials[4] {label,href}, email}`; `notFound {code, heading, ctaLabel, ctaHref}`.
- `site.notFound` is generic interface copy for the 404 page, not club facts: `code` "404", `heading` "page not found", `ctaLabel` "back to the homepage", `ctaHref` "/".

## 3. Tokens (`src/app/globals.css`, frozen)

Values from `docs/reference/design-tokens.json`. Tailwind's default palette and font stacks are removed: only these colours (`bg-cream`, `text-navy`, `fill-steel`, `stroke-sage-soft`…), `transparent` and `current` exist.

| CSS var | value | Tailwind | use |
|---|---|---|---|
| `--cream` | #f8efd6 | `cream` | page background; text on teal and navy |
| `--sage` | #b8d7ae | `sage` | section bands, side panels |
| `--sage-soft` | #d2e0bf | `sage-soft` | second panel layer, project tiles, stitch lines on cream |
| `--mint` | #87c896 | `mint` | decoration only: bursts, exclamation marks, bulb, keycap letters |
| `--steel` | #4c7e94 | `steel` | wordmark, keycap tops, pixel clusters, display type and the hero slogan ≥ 24px on cream |
| `--teal-mid` | #396275 | `teal-mid` | keycap side face; shading only |
| `--teal` | #2f5565 | `teal` | plaques, dark bands, primary buttons, secondary text |
| `--navy` | #2a3d5a | `navy` | body text, the S, the cap, star bursts, card layers, focus ring, footer band |
| `--bark` / `--bark-deep` | #625045 / #382e27 | `bark` / `bark-deep` | beaver only |
| `--blush` | #deb39e | `blush` | beaver teeth; at most one tiny accent per screen |
| `--gold` | #dcb35c | `gold` | the `accent` button face only (hero "follow socials"); navy text on it 5.6:1 |
| `--font-display` | Bungee 400 | `font-display` | hero line, section headings, card titles, in capitals; never bold |
| `--font-label` | Fredoka (variable; use 600) | `font-label` | plaque, buttons, nav, tags |
| `--font-body` | Nunito (variable) | `font-body` | everything else (already on `<body>`, 17px / 1.6) |
| `--layer-offset` | 6px | `*-(--layer-offset)` | offset of the flat second paper layer |
| `--stitch-dash` / `--stitch-gap` / `--stitch-weight` / `--stitch-row-gap` | 30 / 14 / 6 / 10px | `stitch-stroke` | stitch lines |
| `--cut-a` … `--cut-key` | polygons | `cut-*` | cut outlines (below) |
| `--focus-ring`, `--numeral` | navy, steel (cream, mint on dark) | `text-(color:--numeral)` | set per surface by `[data-surface]` |
| `--z-intro` | 100 | `z-(--z-intro)` | intro overlay only |

**Type styles** (design-tokens.json) as Tailwind classes:

| style | classes |
|---|---|
| display-hero (96px) | `font-display uppercase leading-[0.95] tracking-[0.01em]` with a fluid size, e.g. `text-[clamp(2.125rem,5.4vw,4.75rem)]` as in the mockup |
| display-section (48px) | `SectionHeading` h2 |
| display-card (26px) | `SectionHeading as="h3"`, or `font-display uppercase text-2xl leading-[1.15] sm:text-[26px]` |
| label-plaque (24px) | `Plaque` |
| label-button (17px) | `font-label font-semibold text-[17px] leading-[1.2] tracking-[0.04em]` (nav links; `Button` has it built in) |
| label-tag (13px) | `Tag`, or `font-label font-semibold text-[13px] leading-[1.2] tracking-[0.06em]` |
| body-lead (20px) | `text-lg font-medium leading-normal sm:text-xl` |
| body (17px) | default |
| body-small (14px) | `text-sm font-medium leading-normal` (teal on cream, navy on sage) |

**Utilities.**

- Cut shapes (`clip-path`): `cut-a`, `cut-b`, `cut-c` (cards and buttons; alternate so neighbours differ), `cut-plaque` (the jagged plaque), `cut-tag-a`, `cut-tag-b` (tags, date labels, stickers), `cut-slip-a`, `cut-slip-b` (event slips), `cut-key` (small square controls such as the menu button). clip-path also clips the element's outline, so never put a cut on the focusable element itself: clip a child (as `Button` does) or keep the focusable element inside the padding.
- `stitch-stroke`: dash pattern for SVG strokes (`<line>`, `<circle>`, `<path>`); colour with `stroke-*`. `StitchLine` is the normal way to draw a divider.
- Variants: `intro-pending:`, `intro-done:`.
- Removed: `scanlines`, `stepped-gradient`, `animate-blink` and the mono and pixel fonts.

**Base.** `html` is cream with navy text, `color-scheme: light`. `body` has `overflow-x: clip` as a safety net; don't rely on it. `section[id]` has `scroll-margin-top: 5rem`. `:focus-visible` = solid 3px `var(--focus-ring)` outline, 3px offset (navy; cream inside `data-surface="dark"`). `::selection` = navy on cream, inverted inside dark surfaces.

**Z-index.** Intro `z-(--z-intro)` (100) · Nav 50 · everything else ≤ 10. `SidePanels` is `-z-10` inside an `isolate` parent.

## 4. Rendering, styling, motion, lint

- Server Components by default. `"use client"` ONLY in `src/components/intro/Intro.tsx` and `src/components/nav/NavToggle.tsx`. Intro helpers are plain modules.
- No data fetching, no `next/image`, no external URLs (the only exception is `metadataBase` in the frozen layout). Visuals are inline SVG (or SVG/canvas inside Intro).
- Tokens only: no hex/rgb/hsl literals, no named colours (except `transparent`/`currentColor`), no font-family names in components. No opacity modifiers on colours (`text-navy/70`) and no `color-mix()` tints: the design has no transparency effects; use `teal` for secondary text.
- Tailwind classes first. Class strings are static literals; Tailwind scans the source, so never build class names from strings (map props to literals as `ui/` does). Inline `style` only for numeric sizes or positions computed from props or data, never colours or fonts.
- `*.module.css` files are plain CSS. Never use `@apply`, `@reference`, `@theme`, `@utility`, `@custom-variant` or `theme()` in them. Use `var(--token)`. Module keyframe names are hashed, so declare `animation` in the same module as its `@keyframes`, never through Tailwind `animate-[…]`. No global CSS imports from lane folders.
- Paper rules: depth is a flat second layer (the `ui/` primitives, or the same structure: an aria-hidden layer element behind a clipped face), never `box-shadow`, never blur. No borders or outlines around shapes, no gradients. Radius only on round elements (badge, avatars: `rounded-full`) and inside illustrations.
- Motion is short and physical: things drop, tilt and settle like paper. Every animation and transition stops under `prefers-reduced-motion: reduce` (`motion-safe:`, `motion-reduce:` or a media query). Ambient loops (the beaver's blink, any idle wobble) run only under `intro-done:` AND `motion-safe`. Animate `transform` and `opacity` only. Hover/press: move by a few pixels toward or onto the layer; colour changes are swaps between palette colours, never fades to a tint.
- Mobile-first; no horizontal overflow at 375, 768 and 1440px. Touch targets at least 44px.
- **Contrast.** Body text is navy (9.6:1 on cream, 7.0 on sage, 7.9 on sage-soft). Secondary text is teal (7.0:1 on cream, 5.1 on sage, 5.8 on sage-soft). On teal and navy, text is cream (7.0 / 9.6:1); sage text on navy is allowed (7.0:1, the footer's "back to top"). Navy text on a mint fill is allowed (5.6:1, sticker), and on the gold accent button (5.6:1). Steel is text only at 24px and larger, and only on cream (3.9:1; on sage it is 2.8:1, never). Mint, bark, bark-deep, blush and gold are never text (aria-hidden decorative numerals and keycap letters are art, not text).
- Lint is eslint-config-next 16, which treats the React Compiler hook rules as errors. Never call setState synchronously in an effect body: call it from timer, rAF or event callbacks, or derive state with `useSyncExternalStore`. Never read or write `ref.current` during render. No `Math.random()`, `Date.now()` or `performance.now()` during render (Avatar's tone is a pure function of the initials). Don't reassign module-level variables or mutate props during render. Never add `eslint-disable`, `@ts-ignore` or `@ts-expect-error`.
- Strict Mode is on in dev, so effects run mount → cleanup → mount. Cleanups cancel every timer, rAF and listener; no module-level "started" flags.

### Not violations (for reviewers)

- Hex values, font loader names and the fallback stacks in `src/app/globals.css` and `src/lib/fonts.ts`: these ARE the tokens.
- `metadataBase: new URL("https://sbuild-club.github.io")` in `layout.tsx`.
- `viewport.themeColor: "#f8efd6"` in `layout.tsx`: it is the cream token's value, typed literally because metadata cannot read CSS variables. Keep it in step with `--cream`.
- The intro gate `<script>` and `suppressHydrationWarning` in `layout.tsx`.
- Arbitrary non-colour values: `z-[90]`, `text-[clamp(…)]`, `pr-(--layer-offset)`, `text-[13px]`, `tracking-[0.06em]`.
- Numeric inline `style` sizes in art (e.g. Avatar's width, height and font size).
- `[PLACEHOLDER]` strings and placeholder hrefs rendered as-is.
- The allowed hard-coded strings and content-derived numbers listed in §2.7.
- Manifesto's section has no id, by design.
- Contrast of aria-hidden decorative visuals (side panels, bursts, keycap letters, mint numerals on teal cards).
- Intro reading colours and fonts from computed style.

## 5. Lane rules (worktrees)

1. Read `docs/BRIEF.md` and `docs/CONTRACT.md` in full, then the parts of `docs/reference/` that cover your lane, before doing anything.
2. You work alone in your own git worktree. First confirm with `git log --oneline -5` that it contains the foundation commit(s) (messages starting `foundation:`). If not, stop and report it.
3. Run `npm ci` once in your worktree. Never `npm install <pkg>`; never add or import packages other than `react` and `next`.
4. Write only inside your folders (§1). If the contract lacks something, build it inside your folders and report it under "Notes for integrator". Never edit a frozen or foreign file, not even to fix a typo.
5. Keep every interface in §2 exactly: paths, export names, props, ids, root elements. Code against the §2 signatures, not against the current stub drawings: other lanes' stubs will be replaced.
6. Copy only from `@/content/site`; tokens only. NEVER hard-code colours or fonts.
7. Verify with `npx tsc --noEmit --incremental false`, `npx eslint <your folders>` and `npm run build`. All three must pass in your worktree before you finish. Never pass `--cache` to eslint. Do not start dev or preview servers.
8. Git: commit only to the branch your worktree is on, with messages prefixed by your lane name (e.g. `art: trace wordmark`). Never push, merge, rebase, reset or check out other branches, never touch other worktrees, and never use bare `git stash`.
9. You run unattended and nobody will reply: decide, keep working until your lane brief is fully done, and note your decisions. End with: summary · files changed (repo-relative paths) · Notes for integrator · the output tail of the three checks · your commit hash(es).

## 6. Foundation state (what lanes start from)

- `src/components/pixel/` is now `src/components/art/`. `Scanlines`, `GridFloor`, the pixel sprite helpers and `PixelIcon`/`PixelAvatar`/`Mascot` are gone (replaced by `ProjectIcon`, `Avatar`, `Beaver`).
- To keep the build green, foundation touched other lanes' files only mechanically: imports moved to `@/components/art/*`, `<GridFloor />` removed from Hero, `SectionHeading`'s removed `cursor` prop dropped from its call sites, and old `Sticker` tones / the `ghost` Button variant mapped to new names. Those components still use the old token classes (`bg-ink`, `text-paper`, `font-mono`…), which no longer exist, so they look broken until their lane rewrites them. That is expected.
- Intro still runs its round-one timeline with old token names; the intro lane replaces it.
