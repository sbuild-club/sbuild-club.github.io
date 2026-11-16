SBUILD is Stony Brook University's first tech entrepreneurship club. Everything looks like it was cut from coloured paper with scissors and laid on a cream desk: flat, slightly crooked, friendly, and obviously made by hand.

## Content

- Write the name as **SBUILD** in display type and as `sbuild` in running copy.
- The tagline is "SBU's First Tech Entrepreneurship Club". Use it exactly.
- Keep copy short, direct and welcoming to beginners. Lowercase is fine in running copy.
- Never use: innovative, cutting-edge, synergy, revolutionize, leverage, empower.
- Never invent facts: no member counts, sponsors, dates or testimonials. Unknown copy stays a visible placeholder.
- No emoji. Emphasis comes from the cut-paper marks (bursts, exclamation marks, stars).

## Colour

- Lay every page on `cream`. Use `sage` for full-width bands and the angled side panels, with `sage-soft` as the overlapping second layer.
- Use `teal` for dark bands and plaques, with `cream` text.
- Set body text in `navy`. Use `teal` for secondary text.
- Use `steel` for the wordmark and for display type at 24px and up. Never set small text in `steel`.
- `mint` is decoration only: bursts, exclamation marks, the bulb, keycap letters. Never text on a light ground.
- `bark`, `bark-deep` and `blush` belong to the beaver. Do not use them for UI.
- Fills are always solid. No gradients, no transparency effects, no blur, no outlines around shapes.

## Type

- `display-*` styles (Bungee) are for the hero line, section headings and card titles, in capitals. Tilt single words by 1 to 3 degrees; never tilt body copy.
- `label-*` styles (Fredoka, weight 600, wide tracking) are for the tagline plaque, buttons, nav and tags.
- `body-*` styles (Nunito) are for everything else.
- The SBUILD wordmark is artwork, not type. Never typeset it in the display face where the logo should be.

## Shape

- Cards, buttons and plaques are cut polygons. Give each one of `cut-a`, `cut-b` or `cut-c`, and alternate so neighbours differ. The tagline sits on `cut-plaque`.
- Depth is a second flat paper layer: the same outline in a darker solid colour, offset down and right by `layer-offset`. Never a blurred shadow.
- Divide sections with a pair of dashed stitch lines built from the `stitch-*` tokens: `sage-soft` on cream, `cream` on sage or teal.
- Round elements (the badge, avatars) use `radius-badge` and carry a stitch ring just inside the edge.
- Let one or two elements per section break the grid or overlap a band edge. Keep the rest aligned.

## Illustration

All illustration is flat inline SVG in the palette, drawn as cut paper.

- **Beaver:** the mascot. Bark body, navy cap with a steel brim, two blush teeth. It peeks up from the bottom edge of a band; show it at most once per screen.
- **Keycaps:** isometric keys with a `steel` top, `teal` and `teal-mid` sides, a thin `cream` edge, and a `mint` letter on top (S, B, U). Scatter them at different angles.
- **Lightbulb with a raised fist:** `mint`, with ray bursts. It marks ideas and projects.
- **Marks:** mint ray bursts and exclamation marks; navy spiky stars; small clusters of `steel` pixel squares.
- **Side panels:** large angled `sage` and `sage-soft` polygons at the page edges.

## Logo

- `docs/reference/sbuild-banner.png` is the wide banner: wordmark, tagline plaque, keycaps, beaver. Use it for hero compositions and share images.
- The round badge (arced wordmark over the beaver, inside a stitch ring) is the compact mark for the header, favicon and footer.
- Keep clear space of one keycap width around either mark. Do not recolour, outline or add shadows to them.

## States and motion

- Hover and press move an element by a few pixels toward or onto its second layer. Colour changes are a swap between palette colours, never a fade to a tint.
- Focus is a solid 3px `navy` ring on light grounds and a `cream` ring on teal, offset by 3px.
- Motion is short and physical: things drop, tilt and settle like paper. All motion stops under reduced-motion settings.
