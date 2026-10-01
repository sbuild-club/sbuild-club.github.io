# sbuild — build contract

Five lanes build this site at the same time in one checkout. Folder ownership is what keeps them from colliding. Read this file and docs/BRIEF.md in full before touching anything.

Stack (fixed): Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 (CSS-first, no tailwind.config) · ESLint 9 flat config (eslint-config-next). No other dependency exists or may be added.

## 1. Ownership

A lane may create or edit files ONLY inside its folders.

| lane | owns |
|---|---|
| pixel | `src/components/pixel/**` |
| shell | `src/components/nav/**`, `src/components/hero/**`, `src/components/footer/**` |
| sections-a | `src/components/sections/manifesto/**`, `src/components/sections/programs/**`, `src/components/sections/projects/**` |
| sections-b | `src/components/sections/events/**`, `src/components/sections/team/**`, `src/components/sections/join/**` |
| intro | `src/components/intro/**` |

Frozen (integrator only): `src/app/**`, `src/content/**`, `src/lib/**`, `src/components/ui/**`, `docs/**`, all config files (`package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`), `README.md`, `.claude/**`. Anything not owned by a lane is frozen.

Inside your folders you may add sub-components, plain `.ts` helpers and `*.module.css` files. Never rename, move or delete the entry files listed in §2, and never turn them into default exports.

## 2. Interfaces

### Entry files

Every component is a named export matching its file name. Paths are relative to `src/components/`; import them as `@/components/...`.

| file | export | props | root element |
|---|---|---|---|
| `pixel/PixelIcon.tsx` | `PixelIcon`, `type PixelIconName` | `{ name: PixelIconName; size: number; className?: string; label?: string }` | `<svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" fill="currentColor">`; `className` goes on the svg |
| `pixel/PixelAvatar.tsx` | `PixelAvatar` | `{ initials: string; size?: number }` | inline-block `<span>`, exactly size×size px (default 64), no margin, initials centred |
| `pixel/Mascot.tsx` | `Mascot` | none | block `<svg>`, 64×64 px, aria-hidden, no margin |
| `pixel/Scanlines.tsx` | `Scanlines` | none | `fixed inset-0 z-[90] pointer-events-none scanlines`, aria-hidden |
| `pixel/GridFloor.tsx` | `GridFloor` | none | `<div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 -z-10 overflow-hidden">`; its parent (Hero's section) is `relative isolate overflow-hidden` |
| `intro/Intro.tsx` | `Intro` | none | see "Intro states" |
| `nav/Nav.tsx` · `hero/Hero.tsx` · `footer/Footer.tsx` | `Nav` · `Hero` · `Footer` | none | see table below |
| `sections/manifesto/Manifesto.tsx` · `programs/Programs.tsx` · `projects/Projects.tsx` · `events/Events.tsx` · `team/Team.tsx` · `join/Join.tsx` | `Manifesto` `Programs` `Projects` `Events` `Team` `Join` | none | see table below |

- `PixelIconName = 'rocket' | 'wrench' | 'lightbulb' | 'chip' | 'terminal' | 'satellite' | 'flag' | 'bolt'`, exactly these. `src/content/site.ts` imports this type.
- `PixelIcon` is aria-hidden unless `label` is passed (then `role="img"` and `aria-label={label}`). `size` is required and is CSS px (multiples of 16 stay crisp). Where a lane brief writes `<PixelIcon />` or `<PixelIcon name={project.icon} />`, it means e.g. `<PixelIcon name={project.icon} size={48} />`.
- Inside pixel SVGs, colour with `currentColor` or the classes `fill-ink` `fill-paper` `fill-signal` `fill-amber` `fill-phosphor`. Never hex, never `fill="var(--x)"`.

### Mount points

- `layout.tsx`: `<html lang="en" className={fonts} suppressHydrationWarning>` → `<head>` holds the intro gate script (see "Intro states") → `<body className="bg-ink text-paper font-body">` → `<Intro />` first → `{children}` → `<Scanlines />`.
- `page.tsx`: `<Nav />`, then `<main>` holding Hero, Manifesto, Programs, Projects, Events, Team, Join, then `<Footer />`.
- Hero places `<GridFloor />`, one `<PixelIcon />` and `<Mascot />`; together they are the hero's pixel illustration. Projects places one `PixelIcon` per project. Team places one `PixelAvatar` per member.

### Sections, surfaces, headings

Each id sits on the component's outermost `<section>` and appears exactly once in the page.

| component | outer element | id | surface | headings |
|---|---|---|---|---|
| Nav | `<header>` > `<nav aria-label="primary">` | — | ink | none; the wordmark is `<a href="#top">{site.name}</a>` |
| Hero | `<section>` | `top` | ink | `h1#wordmark`; the headline is one `<p>` with a `<span className="block">` per `headlineLines` item; mission is a `<p>` |
| Manifesto | `<section aria-label="manifesto">` | — | ink | none; statements in a `<ul>` |
| Programs | `<section>` | `programs` | light | h2 = programs nav label; each card `<SectionHeading as="h3" number={p.number} title={p.name} />` |
| Projects | `<section>` | `projects` | ink | h2 = projects nav label; project names are h3 |
| Events | `<section>` | `events` | ink | h2 = events nav label; rows are not headings; no header row |
| Team | `<section>` | `team` | light | h2 = team nav label; names and roles are not headings |
| Join | `<section>` | `join` | gradient | h2 = `site.join.headline` |
| Footer | `<footer>` | — | ink | none |

- Nav-label h2: `<SectionHeading cursor title={site.nav.links.find((l) => l.href === "#programs")?.label ?? ""} />` (no number).
- Exactly one `<h1>` on the page: Hero's `#wordmark`.
- Surfaces. **ink**: inherit body (`text-paper`), amber focus ring. **light**: `bg-paper text-ink` plus `data-surface="light"` on the outer section. **gradient**: `stepped-gradient text-ink` plus `data-surface="light"`. `data-surface="light"` switches the focus ring to ink automatically. On light and gradient surfaces: no signal, amber or phosphor text; Sticker tone amber or signal, never paper.
- Text opacity modifiers are ≥ /60 on every surface (`text-paper/60` is the minimum).
- Nav: sticky header ≤ 64px tall (sections have `scroll-margin-top: 5rem`). Links come from `site.nav.links` (`#programs`, `#projects`, `#events`, `#team`) plus `site.nav.cta` (`#join`). The "join" Button stays visible outside the collapsible panel at every width. The link panel is server-rendered (links always in the DOM) and toggled by the client `NavToggle` (`<button aria-expanded aria-controls>`; closes on link click and on Escape). With JS off a collapsed mobile panel is acceptable.
- Footer: socials from `site.footer.socials`, email from `site.footer.email` (as `mailto:`), "back to top" → `#top`.

### Intro states (`html[data-intro]`)

An inline script in `layout.tsx` (frozen) sets the state before first paint:

- **absent**: JS disabled. No overlay, no ambient motion; the page is fully visible and usable.
- **`pending`**: first visit in this tab, motion allowed. The overlay is visible from the first paint. `globals.css` locks scroll (`html[data-intro="pending"] { overflow: hidden }`); Intro never touches html/body overflow.
- **`done`**: returning visit in this tab, reduced motion, finished, skipped, or the gate's 8 s failsafe. No overlay; ambient motion runs.
- Flag: `sessionStorage` key `sbuild:intro`, value `"1"`. The gate reads it; Intro writes it on finish or skip, never at start. Wrap every storage access in try/catch.
- Tailwind variants: `intro-pending:` and `intro-done:` (e.g. `hidden intro-pending:block`, `intro-done:motion-safe:animate-blink`). CSS Module equivalent: `:global(html[data-intro="done"]) .x { … }`.

### Intro ↔ Hero handoff

- Hero renders `<h1 id="wordmark" data-intro-target>{site.name}</h1>` (text "sbuild", `font-display`) inside `<section id="top">`. Its only child is that text. It sits fully inside the first viewport at scrollY 0 for viewports 375×667 and larger, below the 64px header. No transform, rotation or background-clip on it or on its Hero ancestors. Stickers, rotations and the blinking cursor are siblings, never children.
- Intro's root renders on the server: `fixed inset-0 z-(--z-intro) bg-ink hidden intro-pending:block`. DOM: root `<div>` (no aria-hidden) > [`<div aria-hidden="true">` with all visuals, `<button type="button">skip ↵</button>`]. Never put aria-hidden on an ancestor of the skip button.
- Intro's first client render matches its server render: never read sessionStorage, matchMedia, window or the html attribute in render or in useState initialisers. Read the state with `useSyncExternalStore` (subscribe with a MutationObserver on `<html>`; server snapshot `""`). Render the overlay unless the state is `"done"`; start the timeline in an effect only when the state is `"pending"`.
- Intro's landing element is a non-heading `<span aria-hidden className="font-display lowercase">{site.name}</span>`. Intro never uses `id="wordmark"`, `data-intro-target` or h1–h6.
- At step 4 Intro awaits `document.fonts.ready`, reads `document.querySelector('#wordmark[data-intro-target]')?.getBoundingClientRect()`, copies font-size, weight, letter-spacing, line-height and colour from its computed style, and moves its span onto the rect with a FLIP transform (translate plus ONE uniform scale). The step-3 pixel blocks cross-fade into this span before the move. If `#wordmark` is missing or not fully inside the viewport, skip the move and fade out; never throw.
- Every exit path ends with `data-intro="done"`, the flag written and the overlay unmounted: finish; skip by button, click or any key; missing or off-screen `#wordmark`; a caught error; the failsafe having already flipped the state.
- Intro NEVER imports Hero; Hero NEVER imports Intro. They share only the DOM (`#wordmark`, `html[data-intro]`).
- In canvas or JS, read colours with `getComputedStyle(document.documentElement).getPropertyValue("--phosphor")` and fonts from the computed `fontFamily` of a `.font-mono` or `.font-display` element. Never type a hex value or a font name.

### Content

- All copy comes from `import { site } from "@/content/site"`. Every value is a `[PLACEHOLDER]`; render it as-is (CSS `lowercase` is fine). NEVER invent or hard-code names, dates, stats, sponsors, schools or other copy.
- Allowed hard-coded strings, exactly these: `skip ↵`; the BRIEF's intro boot lines (at most one more in the same voice); the `> ` log prefix; `back to top`; aria-labels (`primary`, `manifesto`, `menu`, `close`); wordless glyphs (→ ↵ ↑ █ _ / [ ] $ # ★ ×); numbers derived from content (e.g. `String(site.projects.length).padStart(2, "0")`). No column headers, eyebrows, "learn more", "new" or similar.
- Sticker text reuses site values: Hero → `site.nav.cta.label`; Projects → `` `${String(site.projects.length).padStart(2, "0")} ×` `` or a project tag; Join → `site.name`.
- Footer labels are only `site.footer.socials[i].label` and `site.footer.email`.
- Key list items by index (`key={i}`); values may repeat once real copy lands.
- `site` shape: `name`; `nav {links[4] {label,href}, cta {label,href}}`; `hero {headlineLines[3], mission, primaryCta {label,href}, secondaryCta {label,href}}`; `manifesto {statements[4]}`; `programs[3] {number,name,description}`; `projects[6] {name, tags: string[], icon: PixelIconName}`; `events[4] {date,name,location}`; `team[6] {name,role,initials}`; `join {headline, body, ctaLabel, ctaHref}`; `footer {socials[4] {label,href}, email}`.

### Tokens (`src/app/globals.css`)

| CSS var | value | Tailwind | use |
|---|---|---|---|
| `--ink` | #0E0E10 | `ink` | page background |
| `--paper` | #F2EEE6 | `paper` | text on ink, light sections |
| `--signal` | #FF5B1F | `signal` | large text and fills ONLY; never small text on paper |
| `--amber` | #FFAF00 | `amber` | secondary accent, gradients |
| `--phosphor` | #7CFF6B | `phosphor` | terminal text ONLY |
| `--font-display` | Unbounded (variable) | `font-display` | lowercase display |
| `--font-body` | IBM Plex Sans (variable) | `font-body` | body (already on `<body>`) |
| `--font-mono` | IBM Plex Mono (400/500 only) | `font-mono` | terminal |
| `--font-pixel` | Silkscreen (400 only) | `font-pixel` | small labels only |
| `--z-intro` | 100 | `z-(--z-intro)` | intro overlay only |

- Tailwind's default palette and font stacks are removed. Only these colours (`bg-ink`, `text-paper/70`, `border-signal`, `fill-amber`…), `transparent` and `current` exist. Don't bold Plex Mono or Silkscreen.
- Utilities: `scanlines` (repeating-linear-gradient, ≤6% opacity), `stepped-gradient` (hard-stop bands signal→amber→paper), `animate-blink` (steps(1) opacity blink for block cursors).
- Variants: `intro-pending:`, `intro-done:`.
- Base: `:focus-visible` = 2px amber outline, 3px offset (ink inside `[data-surface="light"]`). `body` has `overflow-x: clip` as a safety net; don't rely on it. `section[id]` has `scroll-margin-top: 5rem`.
- Z-index: Intro `z-(--z-intro)` (100) · Scanlines 90 · Nav 50 · everything else ≤ 10.

### Shared primitives (`src/components/ui/`, frozen)

- `Button`: `<Button href={site.nav.cta.href}>{site.nav.cta.label}</Button>`; `variant?: "primary" | "ghost"` (default primary). With `href` it renders `<a>`, without it `<button type="button">`; other props pass through. primary = signal fill, ink text, 2px border; ghost = 2px currentColor border, transparent fill.
- `Tag`: `<Tag>{tag}</Tag>`; Silkscreen, 1px currentColor border.
- `Sticker`: `<Sticker tilt={-3} tone="amber">{site.name}</Sticker>`; `tilt?: -4 | -3 | -2 | 2 | 3 | 4` (default 3); `tone?: "amber" | "signal" | "paper"` (default amber); ink text, 2px ink border.
- `SectionHeading`: `<SectionHeading as="h3" number={p.number} title={p.name} />`; `title`; `number?` (Silkscreen, omitted when absent); `as?: "h2" | "h3"` (default h2); `cursor?: boolean` (appends an aria-hidden blinking block cursor); inherits text colour.
- `className` on these four is for layout only (position, margin, width, alignment). Never pass colour, border, padding, font or rotate classes; use variant, tone or tilt.

### Rendering, styling, motion, lint

- Server Components by default. `"use client"` ONLY in `src/components/intro/Intro.tsx` and the Nav toggle `src/components/nav/NavToggle.tsx`. Intro helpers are plain modules.
- No data fetching, no `next/image`, no external URLs. Visuals are inline SVG (or a canvas inside Intro).
- Tokens only: no hex/rgb/hsl literals, no named colours (except `transparent`/`currentColor`), no font-family names. Opacity modifiers and `color-mix()` of tokens are fine.
- Tailwind classes first. Class strings are static literals; Tailwind scans the source, so never build class names from strings.
- `*.module.css` files are plain CSS. Never use `@apply`, `@reference`, `@theme`, `@utility`, `@custom-variant` or `theme()` in them: they break `next build`, which you cannot run. Use `var(--token)`. Module keyframe names are hashed, so declare `animation` in the same module as its `@keyframes`, never through Tailwind `animate-[…]`. No global CSS imports from lane folders.
- Raw 1–2px borders; hard offset shadows at most; no blur, no soft shadows, no smooth gradients.
- Motion: every animation and transition stops under `prefers-reduced-motion: reduce` (`motion-safe:`, `motion-reduce:` or a media query). Ambient loops (cursor blink, grid drift, mascot idle) run only under `intro-done:` AND `motion-safe:`. Animate `transform` and `opacity` only.
- Blinking block cursor on key headings: the last line of the Hero headline (shell, a sibling `<span aria-hidden className="intro-done:motion-safe:animate-blink">█</span>`), and the h2 of Programs, Projects, Events, Team and Join (`<SectionHeading cursor … />`). Never inside `#wordmark`.
- Mobile-first; no horizontal overflow at 375, 768 and 1440px.
- Contrast ≥ 4.5:1 for text. Safe pairs: paper on ink, ink on paper, ink on signal, ink on amber, amber on ink, phosphor on ink; signal on ink for large text. Never signal or amber text on paper or on the gradient.
- Lint is eslint-config-next 16, which treats the React Compiler hook rules as errors. Never call setState synchronously in an effect body: call it from timer, rAF or event callbacks, or derive state with `useSyncExternalStore`. Never read or write `ref.current` during render. No `Math.random()`, `Date.now()` or `performance.now()` during render (PixelAvatar's pattern is a pure function of the initials). Don't reassign module-level variables or mutate props during render. Never add `eslint-disable`, `@ts-ignore` or `@ts-expect-error`.
- Strict Mode is on in dev, so effects run mount → cleanup → mount. Cleanups cancel every timer, rAF and listener; no module-level "started" flags.

### Design references (visual cues ONLY)

mistral.ai (pixel-art icons, stepped warm gradients, pixel mascot) · caavadesign.com (oversized broken-line display type, bold project grid with tags) · cseed.co (all-lowercase voice, 01/02/03 program cards, simple nav, clear "join" CTA). NEVER copy their text, images, logos or code, and don't fetch them.

### Not violations (for reviewers)

- Hex values, font loader names and the generic fallbacks `sans-serif`/`monospace` in `src/app/globals.css` and `src/lib/fonts.ts`: these ARE the tokens.
- `color-mix()` of tokens, opacity modifiers, `transparent`, `currentColor`, `inherit`.
- Arbitrary non-colour values: `z-[90]`, `shadow-[4px_4px_0_var(--ink)]`, `text-[12vw]`, `clamp()`.
- The intro gate `<script>` and `suppressHydrationWarning` in `layout.tsx`.
- `[PLACEHOLDER]` strings and placeholder hrefs rendered as-is.
- The allowed hard-coded strings and content-derived numbers listed under "Content".
- Manifesto's section has no id, by design.
- Contrast of aria-hidden decorative visuals (grid floor, scanlines, mascot, borders).
- Intro reading colours and fonts from computed style.

## 3. Lane rules

1. Read docs/BRIEF.md and docs/CONTRACT.md in full before doing anything.
2. Write only inside your folders (§1). If the contract lacks something, build it inside your folders and report it under "Notes for integrator". Never edit a frozen or foreign file.
3. Keep every interface in §2 exactly: paths, export names, props, ids, root elements.
4. Copy only from `@/content/site`; tokens only. NEVER hard-code colours or fonts.
5. Verify with `npx tsc --noEmit --incremental false` and `npx eslint <your folders>`. tsc checks the whole project, and if ANY file has a syntax error (TS1xxx) it skips type-checking everywhere, so a run showing another lane's TS1xxx errors proves nothing about your files: keep working and re-run later, up to 5 times. Errors in files outside your folders belong to lanes still working; ignore them and never touch those files. If your file errors because of another lane's component, code against the §2 signature. If you never get a run free of foreign syntax errors, write "tsc unverified" in Notes for integrator instead of claiming clean.
6. NEVER run git, npm install, npm run build or npm run dev; never start a server or run any other `next` or `npx` command. Never pass `--cache` to eslint.
7. NEVER add dependencies or import packages other than `react` and `next`.
8. You run unattended and nobody will reply. Write your plan as text alongside your first tool call and keep working until your lane brief is fully done. End with ✅ summary · files changed · Notes for integrator, returned in your final structured result (`summary`, `files_changed` as repo-relative paths, `notes_for_integrator`).
