# sbuild — brief

## Design direction
Retro-futurism means 1980s terminals and arcade hardware reimagined as a 2026 startup. Nonconformism means deliberate rule-breaking inside a strict system: asymmetric layouts, elements that break the grid, sticker labels rotated 2–4°, raw 1–2px borders instead of soft shadows.
- ink: main background. paper: text and light sections. signal: primary accent for large text and fills ONLY, never small body text on paper. amber: secondary accent and gradients. phosphor: terminal text ONLY.
- Gradients are stepped bands with hard stops. NEVER smooth blurry gradients.
- Type: Unbounded lowercase display (hero wordmark up to ~12vw, tight tracking); IBM Plex Sans body; IBM Plex Mono terminal; Silkscreen for small labels only.
- Texture: scanline overlay ≤6% opacity, faint perspective grid floor in the hero, blinking block cursor on key headings.
- Illustrations: hand-built pixel-art SVGs (rects on a grid). No stock photos, no emoji.
- Voice: all lowercase, short, direct, slightly defiant.

## Intro sequence (3–4 s total)
1. CRT power-on: black screen, a thin horizontal line flashes and expands vertically to fill the viewport (~300 ms).
2. 3–4 terminal boot lines type in phosphor mono with a blinking cursor ("> booting sbuild…", "> loading builders… ok", "> mode: unconventional").
3. Pixel blocks fly in and snap together into the "sbuild" wordmark.
4. The wordmark moves onto the hero's #wordmark position while the overlay dissolves in a stepped pixel-grid wipe.
Rules: the page is server-rendered underneath from the first byte and the intro is a fixed overlay, so zero layout shift. Plays once per session (sessionStorage). A visible, keyboard-focusable "skip ↵" button, any click, or any key skips. NEVER runs with prefers-reduced-motion. CSS + vanilla JS or a small canvas; no animation libraries. Post-intro motion is ambient only.

## Page structure (single page, in order)
1. Nav: wordmark; links programs / projects / events / team; "join" as primary button; sticky, compact, mobile menu.
2. Hero: giant broken-line headline, one-line mission, two CTAs, pixel illustration, grid floor.
3. Manifesto: 3–5 short lowercase statements set large.
4. Programs: numbered cards 01 / 02 / 03.
5. Projects: grid of 6 tiles with PixelIcon, name, tags.
6. Events: terminal-log-style list of date / event / location.
7. Team: grid with PixelAvatar, name, role.
8. Join: large CTA block on a stepped gradient.
9. Footer: socials, email, "back to top".

## Performance and accessibility
- Home route statically prerendered, no runtime data fetching. Fonts via next/font, visuals inline SVG, no external image hosts.
- Mobile-first: works at 375px, 768px, 1440px with no horizontal scroll.
- Semantic landmarks, visible focus styles, body text contrast ≥ 4.5:1, intro skip reachable by keyboard.
