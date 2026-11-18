# SBUILD design system

The current, complete record of how the SBUILD site looks: colours, type, shapes, illustration, motion and layout. Read it before designing anything new for SBUILD: a page, a section, a component, or off-site material (slides, flyers, social posts) that should match the site.

- How the code is organised and how to change it: [`CODE-GUIDE.md`](CODE-GUIDE.md).
- Source of truth order: the code (`src/app/globals.css`, `src/components/ui/`) → this file → the older docs listed at the end. If this file and the code disagree, the code wins; fix this file.
- Last checked against the code: 2026-11-17.

## 1. The idea: cut paper on a cream desk

Every element is a piece of coloured **paper**, cut by hand with scissors and laid on a cream desk: flat, slightly crooked, friendly, obviously handmade. Each rule below follows from that:

- **Solid fills.** Every shape is one flat token colour. Paper has no gradients, transparency, blur or outlines.
- **Cut outlines.** Cards, buttons, plaques, tags and slips are irregular polygons (`clip-path`), never rounded rectangles. Neighbours get different cuts.
- **Depth is a second sheet.** A darker copy of the same cut shape sits 6px down and right behind the face, never a drop shadow.
- **Stitches.** Sections are edged with a pair of dashed "stitch" rows. Round things (badge, avatars) carry a dashed stitch ring.
- **A little crooked.** Headings, stickers, avatars and art tilt 1 to 5 degrees. Body copy stays straight.
- **Physical motion.** Things drop, tilt and settle like paper, briefly.

Reference art: `docs/reference/sbuild-banner.png` (the logo banner the whole look is drawn from) and the approved mockups in `docs/reference/mockup/*.html`.

## 2. Colour

Eleven colours exist, and only these. Tailwind's default palette is removed, so `bg-red-500` or `text-gray-700` do not compile to anything. Each token works as `bg-*`, `text-*`, `fill-*`, `stroke-*` and as `var(--name)`.

| Token | Hex | Role | As text |
|---|---|---|---|
| `cream` | `#f8efd6` | Page ground (the desk). Faces of light cards, slips, inverse buttons. | On teal (7.0:1) and navy (9.6:1). |
| `sage` | `#b8d7ae` | Full-width bands (Programs, Join), side panels, secondary button face. | Only on navy (7.0:1): the footer's "back to top". |
| `sage-soft` | `#d2e0bf` | Second panel layer over sage, project tiles, stitch lines on cream. | Never. |
| `mint` | `#87c896` | Decoration: ray bursts, exclamation marks, lightbulb, keycap letters, numerals on dark cards. | Never. (Navy text *on* a mint sticker is fine, 5.6:1.) |
| `steel` | `#4c7e94` | The BUILD letters of the wordmark, keycap tops, pixel clusters, large display type, the hero slogan. | Only at 24px and up, only on cream (3.9:1). |
| `teal-mid` | `#396275` | The lighter side face of a keycap. Shading only. | Never. |
| `teal` | `#2f5565` | Dark bands (Events), plaques, primary buttons, secondary text. | On cream 7.0, sage 5.1, sage-soft 5.8. |
| `navy` | `#2a3d5a` | Body text, the S of the wordmark, the beaver's cap, star bursts, card second layers, focus ring, footer band. | On cream 9.6, sage-soft 7.9, sage 7.0, mint 5.6. |
| `bark` | `#625045` | Beaver body. | Never. Mascot only. |
| `bark-deep` | `#382e27` | Beaver ears, eyes, nose, mouth. | Never. Mascot only. |
| `blush` | `#deb39e` | Beaver teeth. At most one tiny warm accent per screen. | Never. |

Body text needs at least 4.5:1. Steel (3.9:1 on cream) passes only as large display type; that is why every steel text on the site is 24px or bigger.

### Surfaces

A **surface** is the ground a block sits on. Dark surfaces carry `data-surface="dark"`, which flips the focus ring to cream and decorative numerals to mint. A light sheet nested inside a dark band sets `data-surface="light"` to flip them back.

| Surface | Background | `data-surface` | Body text | Secondary text | Headings | Stitch line | Focus ring | Used by |
|---|---|---|---|---|---|---|---|---|
| Cream (default) | `bg-cream` | (light) | navy | teal | navy, teal or steel | `sage-soft` | navy | Hero, Projects, Team, 404 |
| Sage band | `bg-sage` | (light) | navy | teal | navy | `cream` | navy | Mission (Manifesto), Programs, Join |
| Sage-soft tile | `PaperCard tone="sage-soft"` | light | navy | teal | navy | — | navy | Project tiles |
| Teal band or card | `bg-teal` | dark | cream | — | cream | `cream` | cream | Events, middle Programs card |
| Navy band | `bg-navy` | dark | cream | sage | cream | `steel` | cream | Footer |

Page rhythm, top to bottom: Nav (cream) → Hero (cream) → Mission (sage; the Manifesto component) → Programs (sage, hidden for now) → Projects (cream) → Events (teal) → Team (cream) → Join (sage) → Footer (navy). Coloured bands alternate with cream so no two bands touch.

### Colour pairs for paper sheets

When a face sits on a second sheet, the sheet is a darker partner colour:

| Face | Text | Second sheet |
|---|---|---|
| teal | cream | navy |
| sage | navy | steel |
| cream | navy | navy |
| mint | navy | teal |

Hover and press change colour by swapping one token for another (navy → teal on nav links, cream → sage on footer links, teal → navy on the menu and skip buttons), never by fading to a tint.

## 3. Type

Three families, loaded from Google Fonts with `next/font` in `src/lib/fonts.ts`:

| Family | Token / class | Weights used | Role | Fallback |
|---|---|---|---|---|
| **Bungee** | `font-display` | 400 only (it has no bold) | Chunky display capitals: section headings, card titles, manifesto, callouts, the footer email. Always `uppercase`. | Arial Black |
| **Fredoka** (variable) | `font-label` | 600 (semibold), 700 (bold) for the nav brand name, the hero pillar labels and slogan | Rounded labels with wide tracking: the nav brand line, plaque, buttons, nav links, tags, stickers, the hero pillars and slogan, member names. | Trebuchet MS |
| **Nunito** (variable) | `font-body` | 400 body, 500 (medium) for lead and small text | Everything else: paragraphs, roles, locations. Set on `<body>`. | Segoe UI |

The SBUILD wordmark is traced artwork (`Wordmark` SVG), never typeset. Write the name in display type as **SBUILD** and in running copy as `sbuild`.

### Type scale

Sizes read phone → wide. Breakpoints are Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. 1rem = 16px.

**Reusable styles**

| Style | Family, weight | Size | Line height | Tracking | How to get it | Used for |
|---|---|---|---|---|---|---|
| display-section | Bungee, caps | 36 → 48px (`sm`) | 1.05 | — | `<SectionHeading title=… />` | Section titles |
| display-card | Bungee, caps | 24 → 26px (`sm`) | 1.15 | — | `<SectionHeading as="h3" …/>` or `font-display uppercase text-2xl leading-[1.15] sm:text-[26px]` | Card titles, project names, event names |
| numeral | Bungee | 44 → 56px (`sm`) | 1 | — | `SectionHeading number="01"` | Program numbers; steel on light, mint on dark |
| display-statement | Bungee, caps | `clamp(1.625rem, 3.6vw, 3.25rem)` = 26 → 52px | 1.1 | — | `font-display uppercase leading-[1.1] text-[clamp(1.625rem,3.6vw,3.25rem)]` | Manifesto statements |
| display-callout | Bungee, caps | `clamp(1.75rem, 5vw, 2.75rem)` = 28 → 44px | 1.1 | — | `font-display uppercase leading-[1.1] text-[length:clamp(1.75rem,5vw,2.75rem)]` | Open-role title, "coming soon..." note |
| label-plaque | Fredoka 600 | 18 → 24px (`sm`) | 1.2 | 0.06em | `<Plaque>` | The tagline |
| label-button | Fredoka 600 | `sm` 16 → 17px · `md` 18px · `lg` 18 → 20px | 1.2 | 0.04em | `<Button size=…>` | Buttons |
| label-nav | Fredoka 600 | 20px in the menu → 17px inline from `xl` | 1.2 | 0.04em | `font-label font-semibold text-xl xl:text-[17px] leading-[1.2] tracking-[0.04em]` | Nav links; footer links are 17px |
| label-sticker | Fredoka 600 | 15px | 1.2 | 0.06em | `<Sticker>` | Stickers |
| label-tag | Fredoka 600 | 13px | 1.2 | 0.06em | `<Tag>` | Tags, event dates |
| body-lead | Nunito 500 | 18 → 20px (`sm`) | 1.5 | — | `text-lg font-medium leading-normal sm:text-xl` | Section intros (Join body) |
| body | Nunito 400 | 17px | 1.6 | — | default (on `<body>`) | Paragraphs, card descriptions |
| body-small | Nunito 500 | 14px | 1.5 | — | `text-sm font-medium leading-normal text-teal` | Member roles, event locations |

**One-off sizes** (each used in one place)

| Element | Family, weight | Size | Line height | Colour | File |
|---|---|---|---|---|---|
| Hero wordmark | SVG art | width 92% → 68% (`sm`) → 54% (`lg`), max 52rem | — | navy S, steel BUILD | `hero/Hero.tsx` |
| Hero pillars ("Label: text") | Fredoka 600, label word 700 | `clamp(1.375rem, 4.4cqi, 2.25rem)` = 22 → 36px | 1.2 | navy | `hero/Hero.tsx` |
| Hero slogan ("Dream it. …") | Fredoka 700 | `clamp(1.75rem, 6.6cqi, 3.5rem)` = 28 → 56px | 1.1 | steel | `hero/Hero.tsx` |
| Cohort program lead ("**A 6–8 week program** to develop…") | Fredoka 500, highlight 700 | 20 → 24px (`sm`), max width 40rem | 1.35 | navy | `sections/projects/Projects.tsx` |
| Nav brand line ("Sbuild: Innovators & Founders Community") | Fredoka; name 700 navy (teal on hover), descriptor 600 teal; both always the same size | 13px on phones (12px below 375px) → 17px (`sm`) → 20px (`xl`) | 1.2 | navy + teal | `nav/Nav.tsx` |
| Footer email | Bungee | `clamp(1.125rem, 6.2vw, 1.625rem)` → from `sm` `clamp(1.625rem, 3.4vw, 2.875rem)` = 18 → 46px | 1.1 | cream, sage on hover | `footer/Footer.tsx` |
| Team member name | Fredoka 600 | 18px | 1.2 | navy, tracking 0.03em | `sections/team/Team.tsx` |
| Avatar initials | Bungee | 27% of the avatar (Team: 150px → 41px, 196px from `sm` → 53px) | 1 | navy on sage/sage-soft, cream on steel/teal/navy | `art/Avatar.tsx` |
| Intro skip button | Fredoka 600 | 17 → 18px (`sm`) | 1.2 | cream on teal, tracking 0.06em | `intro/Intro.tsx` |
| 404 code | Bungee | `clamp(6rem, 24vw, 12rem)` = 96 → 192px | 0.9 | steel, tilted −2° | `app/not-found.tsx` |
| 404 heading | Bungee, caps | 24 → 36px (`sm`) | 1.1 | navy | `app/not-found.tsx` |

The hero pillars and slogan use container query units (`cqi`, relative to the width of the centred column, which is an `@container`), so the longest pillar stays on one line wherever its size is not clamped. The slogan's 28px floor keeps steel text above the 24px contrast limit.

### Type rules

- Display (Bungee) is always uppercase and never bold.
- Labels (Fredoka) are semibold with 0.03 to 0.06em tracking; the smaller the text, the wider the tracking.
- Tilt single display words or short headings by 1 to 2 degrees (`SectionHeading tilt`). Body copy stays level.
- Copy voice: short, direct, welcoming to beginners; lowercase is fine in running copy. No emoji: emphasis comes from the paper marks (bursts, exclamation marks, stars).

## 4. Shape, depth and stitches

### Cut outlines

Each cut is a `clip-path` polygon, defined once as a CSS variable in `globals.css` and used through a `cut-*` utility class.

| Utility | Polygon | Used for |
|---|---|---|
| `cut-a` | `polygon(1% 5%, 99% 0%, 100% 94%, 2% 100%)` | Cards and buttons (primary button default) |
| `cut-b` | `polygon(0% 2%, 97% 4%, 100% 98%, 3% 95%)` | Cards and buttons (secondary button default) |
| `cut-c` | `polygon(2% 0%, 100% 6%, 98% 100%, 0% 93%)` | Cards and buttons (inverse button default) |
| `cut-plaque` | 15-point jagged outline (see `globals.css`) | The tagline plaque only |
| `cut-tag-a` | `polygon(2% 8%, 98% 0%, 100% 90%, 0% 100%)` | Tags, stickers, the intro skip button |
| `cut-tag-b` | `polygon(0% 0%, 97% 10%, 100% 100%, 3% 88%)` | Tags (alternate) |
| `cut-slip-a` | `polygon(0% 6%, 100% 0%, 99% 92%, 1% 100%)` | Event slips, open-role slip |
| `cut-slip-b` | `polygon(1% 0%, 99% 8%, 100% 100%, 0% 90%)` | Event slips (alternate) |
| `cut-key` | `polygon(4% 8%, 98% 0%, 100% 92%, 0% 100%)` | Small square controls (the phone menu button) |

Cycle cuts through a list so neighbours differ: `["a", "b", "c"][i % 3]`, as Programs and Projects do.

`clip-path` also clips an element's focus outline, so the cut goes on a non-focusable child (the face) and the focusable element stays unclipped. Every `ui/` primitive is built this way.

### The second sheet (depth)

The structure behind every layered piece (`Button`, `PaperCard layer`, `Sticker`):

```tsx
<Root className="relative pr-(--layer-offset) pb-(--layer-offset)">   {/* reserves 6px right and bottom */}
  <span aria-hidden="true" className="absolute top-(--layer-offset) left-(--layer-offset) right-0 bottom-0 cut-a bg-navy" />
  <span className="relative cut-a bg-teal text-cream">…face…</span>
</Root>
```

`--layer-offset` is 6px. Hover moves the face 4px toward the sheet; press lands it exactly on the sheet.

### Stitch lines

Two dashed rows, always as a pair: dash 30px, gap 14px, weight 6px with rounded ends, 10px between rows (22px tall in total). Use `<StitchLine tone=… />`: `sage-soft` on cream, `cream` on sage or teal, `steel` on navy. Programs and Events open and close with one (`py-4 sm:py-5` on the band, a StitchLine just inside its top and bottom edges); Join opens with one and lets the beaver rise out of its bottom edge. For a custom SVG stroke, the `stitch-stroke` utility applies the dash pattern; colour it with `stroke-*`.

Stitch rings on round pieces (Avatar): radius 44 of 100 (46 on a photo avatar, where the photo fills to radius 42), dash `6.5 4.5`, width 2.6, cream (steel on a navy disc).

### Round shapes and tilt

- `rounded-full` belongs to round pieces only (the badge and avatars). Everything else has square-cut corners from its polygon.
- Tilts in use: headings ±1–2°, manifesto lines 1.5° and −1°, stickers ±2–4°, avatars −4°, 3°, −2°, 5°, art up to 12°. Tilt from the left edge (`origin-left`) for headings.
- Let one or two pieces per section break the grid (the star burst over Projects, the beaver rising out of Join, the dropped middle Programs card). Keep everything else aligned.

## 5. Illustration

All art is flat inline SVG in the palette, drawn as cut paper, in `src/components/art/`. Each piece is decorative (`aria-hidden`) unless it gets a `title`.

| Component | What it is | Colours | Where it appears |
|---|---|---|---|
| `Wordmark` | The traced SBUILD letters; `cap` adds the navy cap with steel brim on the S; `variant="arced"` bends it for the badge | navy S, steel BUILD | Hero h1, intro |
| `Badge` | The round logo: arced wordmark over the beaver inside a stitch ring | full palette | Nav brand (36px phones → 44px `sm` → 52px `md`) |
| `Beaver` | Mascot in a navy cap, rising from a bottom edge; idle blink after the intro | bark, bark-deep, blush, navy, steel | Hero banner, Join, intro. At most one per screen. |
| `Keycap` | Isometric key with a mint letter (S B U I L D or blank) | steel top, teal and teal-mid sides, cream edge, mint letter | Hero banner, intro, 404 |
| `Lightbulb` | Bulb with a raised fist, optional ray burst | mint (or steel) | Hero banner (with rays) |
| `Burst` | Mint ray burst | mint | Intro |
| `StarBurst` | Eleven-point spiky star | navy | Projects corner |
| `Exclaim` | One or two exclamation marks | mint | Hero banner, Manifesto |
| `PixelCluster` | Small chip clusters: `tee`, `plus`, `row` | steel | Hero banner |
| `SidePanels` | Large angled sage and sage-soft panels at band edges | sage, sage-soft | Hero (both, from `sm`), Team (left, from `lg`) |
| `ProjectIcon` | Eight icons: rocket, wrench, lightbulb, chip, terminal, satellite, flag, bolt | `currentColor` (steel on tiles) | Project tiles |
| `ArrowUpRight` | Thick round-capped ↗ for links that leave the site (static) | `currentColor` (teal) | Team member links |
| `Avatar` | Round disc with a stitch ring and initials, or a member photo set into the disc | sage, sage-soft, steel, teal or navy disc | Team |

Size art with a width class plus `h-auto` (`className="h-auto w-[clamp(6rem,15vw,17.5rem)]"`). The `size` prop is the fallback width.

### Logo use

- The **banner** (wordmark + plaque + keycaps + beaver, `docs/reference/sbuild-banner.png`) is the hero composition and the link-preview image (`src/app/opengraph-image.png`, 1200×630).
- The **round badge** is the compact mark: the nav brand. The favicon (`src/app/icon.svg`) is its 32px simplification: sage disc, cream stitch ring, navy S. Being a static file, the favicon carries literal hex values; keep them in step with the tokens.
- Keep one keycap width of clear space around either mark. Show the marks as drawn, in their own colours.

## 6. Motion

Motion is short and physical, animates only `transform` and `opacity`, and stops entirely under `prefers-reduced-motion: reduce` (wrap transitions in `motion-safe:`).

| Motion | Spec | Where |
|---|---|---|
| Button hover / press | Face moves 4px toward the sheet on hover, lands on it (6px) on press; 150ms ease-out | `ui/Button.tsx` |
| Menu icon press | Icon drops 2px | `nav/NavToggle.tsx` |
| Nav drop-in | Header waits above the viewport during the intro, slides down 300ms ease-out when it ends | `nav/Nav.tsx` |
| Beaver blink | Eyes squash shut twice, every 5.6s; only after the intro and with motion allowed | `art/Beaver.module.css` |
| Smooth scroll | In-page anchors scroll smoothly when motion is allowed | `globals.css` |
| First-visit intro | About 3.2s, below | `intro/` |

**The intro**, once per browser tab session, skippable by the button, any click or any key:

1. 0.00s, desk: cream fills the screen; two stitch rows sew in from opposite sides.
2. 0.34s, keys drop: six keycaps tumble in with their own spins and bounce once.
3. 1.24s, keys build the name: they slide home and flip into the wordmark letters; the cap drops onto the S; a mint burst pops with the last letter.
4. 1.97s, plaque and beaver: the tagline plaque drops under the name, the beaver pops up.
5. 2.41s, land: the wordmark flies onto the hero's wordmark (620ms) while the cream sheet peels up and away (from 2.69s, 480ms).
6. When the sheet is fully gone, the nav drops in.

Exact timings live as constants at the top of `src/components/intro/timeline.ts`.

## 7. Layout and spacing

Mobile-first, checked at 375, 768 and 1440px with no horizontal scroll. Tailwind's default spacing scale (4px steps) is in use.

| Thing | Value |
|---|---|
| Page gutter | 16px on phones (`px-4`), 24–40px from `sm` (`sm:px-6` … `sm:px-10`, `lg:px-10`) |
| Content widths | Nav and Programs `max-w-7xl` (1280px); Projects, Team, Join 1200px; Manifesto 1120px; Events 1040px; Footer 75rem (1200px); hero text column `max-w-5xl` (1024px) |
| Nav | 64px tall, 76px from `md`; sticky, `z-50`. Brand lockup: on phones the name sits over the descriptor (which wraps to two lines); from `sm` one line, "Sbuild: Innovators & Founders Community". Section links stay in the menu below `xl` so the brand line has room. |
| Band padding | Band: `py-4 sm:py-5` around the stitch lines; inside: `py-11` (44px) → `sm:py-[76px]` |
| Cream section padding | `py-16 sm:py-24` (Projects), `py-20 md:py-24` (Team) |
| Heading → content | `mb-7` (28px) → `sm:mb-10` (40px) |
| Card grid gap | `gap-6` (24px) → `sm:gap-8` (32px); 3 columns only from `xl` |
| Card padding | 24px sides (28px from `sm`), 32px top, 36px bottom |
| Touch targets | At least 44px (`min-h-11`); the menu button is 44px on phones, 48px from `sm` |
| Z-index | Intro overlay 100 · Nav 50 · everything else ≤ 10 · side panels `-z-10` inside an `isolate` parent |

Focus: a solid 3px ring in `--focus-ring` (navy, cream on dark surfaces), offset 3px. Text selection: navy highlight with cream text, inverted on dark surfaces.

## 8. Using this look outside the site

For slides, flyers, social posts or a new design tool (Claude Design, Figma, Canva):

- Fonts: **Bungee**, **Fredoka** (SemiBold 600) and **Nunito**, all free on Google Fonts.
- Colours: the hex values in §2, with the same text rules (navy or teal text on light grounds, cream on teal or navy, steel only for big display text).
- Shapes: draw boxes as slightly skewed quadrilaterals (the `cut-*` percentages in §4 work as polygon points in any tool), add a navy copy 6px down-right for depth, and edge sections with two dashed lines.
- Art: `docs/reference/sbuild-banner.png`, or screenshot the SVG components from the live site.

## 9. Related documents

| File | What it is | Status |
|---|---|---|
| [`CODE-GUIDE.md`](CODE-GUIDE.md) | How the code is organised; recipes for changes | Current |
| `reference/design-tokens.json` | The token spec written before the build | Original spec. Colours, stitch and the a/b/c/plaque cuts match `globals.css`; it lacks the tag, slip and key cuts, lists desktop type sizes only (see §3 for phone sizes), and its `display-hero` style is unused (the hero uses the SVG wordmark). |
| `reference/design-system.md` | The brand rules written before the build | Original spec, still accurate in spirit; this file supersedes it. |
| `reference/mockup/*.html` | Approved mockups (Main 1440, Mobile 390, Components, Illustrations, Intro) | Visual reference |
| `BRIEF.md`, `CONTRACT.md` | Brief and build contract for the 2026 paper-cut overhaul | Historical: their lane, worktree and frozen-file rules no longer apply |
| `reference/overhaul-plan.md` | The overhaul plan | Historical |
