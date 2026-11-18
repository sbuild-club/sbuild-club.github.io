# sbuild — brief (v2, paper-cut overhaul)

> **Status (2026-11-17): historical.** This was the brief for the overhaul build, which is merged. For current work use [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) (the look) and [`CODE-GUIDE.md`](CODE-GUIDE.md) (the code); where they differ from this file, they win.

v2 replaces the round-one retro-terminal brief. The sections, page structure and copy stay the same; the whole site is re-skinned to the paper-cut look of the club's new logo. Read this file and `docs/CONTRACT.md` in full before touching anything.

## Visual source of truth

Everything visual comes from `docs/reference/` (read-only for every lane):

- `sbuild-banner.png`: the logo banner. Hero composition, wordmark letter shapes, keycaps, plaque, beaver.
- `design-system.md`: brand rules (content, colour, type, shape, illustration, logo, states and motion).
- `design-tokens.json`: exact token values (colours, type styles, spacing, cut shapes, stitch).
- `mockup/Main.html` (1440 wide), `mockup/Mobile.html` (390 wide), `mockup/Components.html`, `mockup/Illustrations.html`, `mockup/Intro.html`: the approved mockup. These are static design files in a canvas format. Read them for layout, colours, shapes and SVG drawings; do not import or copy their markup wholesale, and never copy their hex values (use tokens).
- `overhaul-plan.md`: the approved plan and lane split.

Where this brief, the contract and the mockup disagree, the contract wins for interfaces and rules, and the mockup wins for looks.

## Design direction

Everything looks cut from coloured paper with scissors and laid on a cream desk: flat, slightly crooked, friendly, obviously made by hand.

- **Ground and bands.** The page is `cream`. Full-width `sage` bands, `teal` (and one `navy`) dark bands with `cream` text. Large angled `sage` / `sage-soft` side panels at the page edges.
- **Cut shapes.** Cards, buttons, plaques, tags and slips are hand-cut polygons (`clip-path`). Neighbours never share an outline. Depth is a second flat paper layer offset down and right by `--layer-offset` (6px), never a blurred shadow.
- **Stitch lines.** Sections are divided by a pair of dashed rows (`StitchLine`). Round elements (badge, avatars) carry a dashed stitch ring.
- **Fills.** Solid colour only. No gradients, transparency effects, blur or outlines around shapes.
- **Type.** Bungee (display, capitals) for the hero line, section headings and card titles; Fredoka 600 with wide tracking (label) for the plaque, buttons, nav and tags; Nunito (body) for everything else. Tilt single display words 1 to 3 degrees; never tilt body copy. The SBUILD wordmark is artwork (traced SVG), never typeset.
- **Illustration.** Flat inline SVG in the palette: the beaver mascot in a navy cap (replaces the pixel bot), isometric keycaps lettered S, B, U in mint, a mint lightbulb with a raised fist, mint ray bursts and exclamation marks, navy spiky star bursts, small steel pixel-square clusters. No stock photos, no emoji.
- **Voice.** Short, direct, welcoming to beginners. Lowercase is fine in running copy. The tagline is real copy: "SBU's First Tech Entrepreneurship Club" (`site.tagline`). Everything else stays a visible `[PLACEHOLDER]`; never invent facts.

Removed from round one: dark theme, scanlines, CRT boot, terminal log, pixel-art sprites, perspective grid floor, blinking block cursors, stepped gradients, mono and pixel fonts.

## Intro sequence (about 3 s, see `mockup/Intro.html`)

1. **Desk (0.0 s).** Cream fills the screen. Two stitch lines sew in from opposite sides. The skip button is there from the first frame.
2. **Keys drop (0.4 s).** Keycaps tumble in from the top, each with its own spin, and bounce once like dropped paper.
3. **Keys build the name (1.4 s).** The keys slide together and flip over to become the six letters of the wordmark (geometry from `src/components/art/wordmarkPaths.ts`). A mint burst pops as the last one lands.
4. **Beaver, then the page (2.2 s).** The plaque drops under the name and the beaver pops up. The wordmark settles onto the hero's `#wordmark` box and the rest of the page is uncovered.

Rules: the page is server-rendered underneath from the first byte and the intro is a fixed overlay, so zero layout shift. Plays once per session (sessionStorage). A visible, keyboard-focusable skip button, any click or any key skips. Never runs under `prefers-reduced-motion`. CSS and plain JS (SVG or a small canvas); no animation libraries. After the intro, motion is ambient only (the beaver's blink, small settles).

## Page structure (single page, in order)

Surfaces follow `mockup/Main.html`; see the contract's surface table for the exact attribute rules.

1. **Nav** (cream): round badge plus name, links programs / cohort program (`#projects`) / open role (`#events`, "events" once events exist) / team, "interest signup" as a primary button ("signup" below `lg`); sticky, compact, mobile menu.
2. **Hero** (cream, side panels): the banner recomposed in SVG: wordmark (the page's one `<h1>`), tagline plaque, scattered keycaps, exclamation marks, lightbulb burst, pixel clusters, beaver; then, centred, the three pillars (Build / Community / Founding), the slogan, three CTAs.
3. **Manifesto** (cream): four short statements set large in display type, offset and tilted, with a mint exclamation mark.
4. **Programs** (sage band, stitch lines top and bottom): numbered cards 01 / 02 / 03 on cut paper with a navy layer; one card teal.
5. **Projects** (cream, one navy star burst): grid of sage-soft cut tiles with a project icon, name and tags; until projects exist, a single "coming soon..." tile.
6. **Events** (teal band, stitch lines): a paper notice board of cream slips (date tag, event name, location), alternating outlines and indents; until events exist, one slip with the open role (Chief of Marketing) and an apply button, under the nav label "open role".
7. **Team** (cream, side panel): round stitched avatars with initials, name, role (4 e-board members).
8. **Join** (sage band, stitch line on top): large headline, body, CTA, and the beaver peeking up from the bottom edge.
9. **Footer** (navy band): email set large with the newsletter sign-up button beside it, steel stitch line, socials, "back to top".

## Performance and accessibility

- Home route statically prerendered (`output: "export"`), no runtime data fetching. Fonts via `next/font`, visuals inline SVG, no external image hosts, no `next/image`.
- Mobile-first: works at 375px, 768px and 1440px with no horizontal scroll.
- Semantic landmarks, exactly one `<h1>`, visible focus (3px navy ring, cream on dark surfaces), body text contrast at least 4.5:1, touch targets at least 44px, intro skip reachable by keyboard, everything readable with JS disabled.
