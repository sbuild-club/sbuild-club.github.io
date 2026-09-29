## Objective
You are a senior front-end engineer and web designer. You hand-code fast static sites with a strong visual identity.

Build the first version of the sbuild club website in this repo. It is a single page. The first time someone visits, a short intro animation plays. After that the page loads fast and is easy to scan.

The club is doing something new, so the site MUST read like a tech startup's launch page, not a student-org template. It should feel retro-futuristic, confident and nonconformist.

## Context
- Repo `sbuild-club.github.io` is a GitHub Pages user site, served as static files from the root of `main`. Right now it only has `README.md` and a `.claude/` folder. Nothing has been built yet.
- sbuild is a student club for building projects and tech entrepreneurship.
- Audience: students of any major and any experience level who are deciding whether to show up.

### Club facts (use exactly)
Anything still in [BRACKETS] stays on the page as a visible placeholder. NEVER invent facts: no member counts, sponsor logos, alumni companies, dates, testimonials or school names.
- School / city: [UNIVERSITY, CITY]
- Mission (one line): [MISSION]
- Programs: [PROGRAM_1], [PROGRAM_2], [PROGRAM_3]
- Meetings: [DAY, TIME, ROOM]
- Recruiting status: [SEMESTER]
- Join form: [JOIN_URL] · Email: [EMAIL]
- Instagram: [URL] · LinkedIn: [URL] · GitHub: [URL]

## Target State
- The files listed in Scope exist, and the site works when served as static files with no build step.
- The first load in a browser session shows an intro of ≤ 2.8 s, then the page. Every later load in that session shows the page right away.
- All 9 sections listed under "Page sections" are present, readable with JS turned off, and usable at 375px and 1440px.
- You have delivered the final report described in Steps.

## Scope
- Create only: `index.html`, `assets/css/style.css`, `assets/js/intro.js`, `assets/js/main.js`, `assets/img/favicon.svg`, `.nojekyll`.
- Do NOT touch: `README.md`, anything in `.claude/`, git config, or anything outside this repo.

## Constraints
- MUST be plain HTML + CSS + vanilla JS. No build step, no `package.json`, no frameworks (React, Tailwind, Astro), no animation libraries (GSAP, Lenis, three.js, WebGL).
- The only external requests allowed are Google Fonts: at most 3 families, only the weights you use, `display=swap`, with `preconnect`.
- All content MUST be real HTML in `index.html` and readable with JavaScript turned off. The intro is an extra layer on top and NEVER blocks the content.
- Size limits: total JS ≤ 25 KB and total CSS ≤ 40 KB (unminified). No photos and no AI-generated images. Image slots are styled placeholder frames labelled `[PHOTO: what goes here]`.
- After the intro, animate only `transform` and `opacity`. Scroll reveals use IntersectionObserver. No scroll event listeners, no scroll-jacking, native scrolling only.
- `prefers-reduced-motion: reduce` MUST turn off the intro animation, the marquee and the reveals.
- No horizontal scroll at 375px. Body text contrast ≥ 4.5:1. Use semantic landmarks, exactly one `<h1>`, visible `:focus-visible` styles, and everything must work by keyboard.
- Only make changes directly requested. Do not add extra pages, a CMS, analytics, a blog, a dark-mode toggle, or abstractions beyond what is listed here.

## Design Spec

### Look and feel
Mood: a startup that boots up like a 1983 terminal but ships like 2026. Get the retro-futurism from pixels, monospace type and HUD (heads-up display) details. NOT neon cyberpunk, NOT purple gradients, NOT glassmorphism.

Default palette (change it only if you give a reason in the design brief):
- `--ink #0C0C0A` (near-black), `--paper #EDEAE1` (warm off-white), `--muted #6E6B63` (small secondary text on paper), `--signal #B8FF2C` (phosphor lime, the only accent colour).
- Pixel ramp for stepped transitions, with hard edges and no blending: `#0C0C0A → #1B3A12 → #3E7A1C → #7CCB26 → #B8FF2C`.
- NEVER put `--signal` text on `--paper` (the contrast is too low). Use ink text on signal, or signal text on ink.

Type: at most 3 families.
- One display face with strong character, such as a wide or extended grotesk.
- One readable body face.
- One monospace for the "system voice": nav, labels, buttons, small secondary text and code-comment annotations.
- NEVER use Inter, Roboto, Arial, system-ui, Orbitron or Audiowide as the display face.

Wordmark: draw "sbuild" from a hand-made pixel grid for each letter (for example 5×7) in JS/SVG, not from a font. Use the same grid for the nav logo, the intro and the SVG favicon.

Pick 3–4 of these motifs, not all of them:
- `// 01 —` code-comment section labels
- a tiny HUD readout (local time or cursor x/y in mono)
- a blinking block cursor
- visible grid lines or crosshair registration marks
- an oversized headline that runs off the edge of the screen
- a pixel-dither hover effect on cards
- a CSS-only grain or scanline overlay at ≤ 4% opacity

### Reference sites: take the idea, never the assets
Do not copy their logos, text, colours or images. Everything you need from them is summarised here, so you do not need to fetch them.
- cseed.co (a student builder club, the closest peer): warm paper background with one loud accent colour, monospace labels, a scrolling marquee strip, fade-up reveals, welcoming copy ("come as you are"), and programs shown as three clear entry points.
- caavadesign.com: editorial contrast between a high-contrast display serif and a clean sans, a services list ("Our Formula"), and a work grid with cards that reveal more on hover.
- mistral.ai: a pixel-art identity, with a pixelated logo and hard-edged stepped colour bands used as section dividers and in the footer.

### Intro sequence (first impression)
Total length ≤ 2.8 s. Default storyboard (you may improve it in the design brief):
1. 0–0.6 s: ink screen. A mono boot log quickly types 3–4 lines, e.g. `> sbuild.sys v0.1` / `> mounting /ideas ...... ok` / `> loading builders ... ok` / `> ready_`.
2. 0.6–1.6 s: a canvas grid of pixel squares fills in, in random order, until it forms the large pixel wordmark in `--signal`.
3. 1.6–2.2 s: one brief glitch (1–2 frames of offset). Then the pixels disappear in reverse random order to reveal the hero.
4. 2.2–2.8 s: the wordmark glides into the nav logo position (a FLIP animation) while the hero headline appears line by line.

Behaviour:
- Plays once per browser session. Use a `sessionStorage` flag and wrap every storage read and write in try/catch.
- Can be skipped at any moment by click/tap, Esc, Enter, Space, or a visible "skip ›" button.
- A tiny inline `<head>` script (≤ 1 KB) adds `html.intro` before the first paint, only when the intro will play, so content never flashes before the intro. A 4 s safety timeout removes the class if anything goes wrong.
- The overlay is `aria-hidden="true"`. The skip button can receive keyboard focus.
- Use Canvas 2D only. Scale it with `devicePixelRatio` and stop it cleanly on skip.

### Page sections (single page, in this order)
Alternate ink and paper sections, and use the stepped pixel ramp as the divider between some of them.
1. Header: pixel wordmark, mono nav (About, Programs, Projects, Events, Join), a status pill with a pulsing dot ("● recruiting [SEMESTER]"), and a "Join" button. It stays fixed while scrolling. On mobile, a menu button opens a full-screen menu (vanilla JS, with `aria-expanded`).
2. Hero (ink): a huge headline, a mono line under it written like a code comment, a main button "join the build →" and a second button "see what we ship".
3. Ticker (signal background, ink text): a CSS marquee with the next meetup, demo day, "open to every major" and similar lines. It pauses on hover.
4. About / manifesto (paper): 3–5 short numbered principles.
5. Programs (paper): a list numbered 01–03, one item per program. Details appear on hover or tap.
6. Projects "/shipped" (ink): a grid of 6 placeholder cards using [PROJECT_NAME] and similar fields. Each card has a one-liner, mono tech-stack tags, a status (idea / building / shipped), and a pixel-pattern thumbnail made in CSS or SVG (no images).
7. Events "/changelog" (paper): styled like a software release log, e.g. `v0.3 · [DATE] · [EVENT]`.
8. Join (signal or ink): a big call to action, three steps (show up → join a team → ship), and the links from Club facts.
9. Footer (ink): a pixel ramp band, a large wordmark, social links, © 2026 sbuild.

### Copy voice
Short, lowercase is fine, direct, a little defiant but welcoming to beginners. NEVER use: innovative, cutting-edge, synergy, revolutionize, leverage, empower. Example of the tone (draft only): "build it before you're ready." Put an HTML comment `<!-- DRAFT COPY -->` next to every line of copy you write so it can be reviewed.

## Steps
1. Load the frontend-design skill. List the repo root and read `README.md`.
2. Write a DESIGN BRIEF (≤ 250 words). Include: the final palette as hex values, the font families you picked and why, which 3–4 motifs you picked, the intro storyboard with timings, and one sentence on why the page reads as a tech startup and not a student club. Then STOP and wait for me to reply "go" or send changes.
3. Build the files listed in Scope.
4. Verify. Start `python3 -m http.server 8000` in the background and stop it when you finish. If you have a browser or screenshot tool, check: 375px and 1440px widths, first load versus reload in the same session, every skip control, reduced motion, and JS turned off. Measure the JS and CSS file sizes. If you cannot verify something, say so. Do not claim it works.
5. Fix any failures, in at most 2 rounds. Then write the final report and stop.

Final report format:
- Each file created, with its size.
- Each Acceptance Criteria item marked pass / fail / not verified.
- Every [PLACEHOLDER] and `DRAFT COPY` line that I need to fill in or review.

## Acceptance Criteria
- [ ] The intro plays on first load and finishes in ≤ 2.8 s.
- [ ] The intro can be skipped by click/tap, Esc, Enter, Space and the skip button.
- [ ] The intro does not replay on reload in the same session, and it is turned off under reduced motion.
- [ ] With JS turned off, every section is visible and the intro never appears.
- [ ] No horizontal scroll at 375px, and the nav works by keyboard and on mobile.
- [ ] JS ≤ 25 KB, CSS ≤ 40 KB, and no network requests besides Google Fonts.
- [ ] No invented facts. Every unknown value is a [BRACKETED] placeholder.
- [ ] The final report has been delivered in the format above.

## Stop Conditions
Stop and ask before:
- adding any dependency or CDN script other than Google Fonts
- creating any file not listed in Scope
- deleting any file
- touching anything outside Scope
- running `git commit` or `git push`

Do not commit. I will review first. Stop completely after the final report: no extra polish passes.

## Progress
After each completed step: ✅ [what was done] — [file(s) affected]

## Session Strategy
New session: open Claude Code at the repo root and start fresh. If a browser or screenshot tool is available, run step 4 in a subagent so the screenshots stay out of the main context.
