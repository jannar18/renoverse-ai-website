# testimonial-card

Single customer-quote card. Spotlight signature: dark-oxford-blue → teal → cream gradient at 160° + warm grain (white text on dark surface). Layout per Round 3 #5 wireframe — chunky open-quote glyph upper-left, italic Cormorant quote spanning the card width, bottom-right attribution cluster with optional photo/logo slot, hairline divider, and a Name/Role/Company stack.

Scales across three modes: **photo**, **logo**, **name-only**. The hairline divider is always present so the attribution column doesn't shift between modes.

## Mount

```html
<div data-testimonial-card
     data-quote="Renoverse has proven to be an invaluable organizational tool…"
     data-name="Sabrina Vogel"
     data-role="Owner & Principal"
     data-company="SLC Architect"
     data-logo="assets/slc-logo.webp"
     data-logo-alt="SLC Architect"></div>
```

## Configuration

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `data-quote` | string | yes | Quote body. Rendered in Cormorant italic, no surrounding quote marks (the open-quote glyph in the corner is the visual mark). |
| `data-name` | string | yes | Attribution name. Poppins 600 at `--fs-body`. |
| `data-role` | string | no | E.g. "Owner & Principal". Poppins 400 at `--fs-small`. |
| `data-company` | string | no | E.g. "SLC Architect". Poppins 400 at `--fs-small`. |
| `data-image` | URL | no | Square photo slot (e.g. headshot). Wins over `data-logo` when both are set. Rendered `object-fit: cover` with a small radius. |
| `data-image-alt` | string | no | Alt text for the photo. Falls back to `data-name`. |
| `data-logo` | URL | no | Square logo slot (e.g. company logo). Rendered `object-fit: contain`, `brightness(0) invert(1)` so it sits white-on-dark against the gradient. |
| `data-logo-alt` | string | no | Alt text for the logo. Falls back to `data-company`. |

### Modes

| Mode | Triggered by | Slot rendered |
|---|---|---|
| Photo | `data-image` set | `<div class="testimonial-card__slot--image">` |
| Logo | `data-logo` set (and no `data-image`) | `<div class="testimonial-card__slot--logo">` |
| Name-only | neither set | none — divider sits on its own to the left of the attribution stack |

## Dependencies

- `shared/tokens.css` — colors, type scale, spacing, fonts.
- `shared/effects.css` — `.fx-grain--warm` overlay.

No GSAP. No JS animation — the card is a static spotlight surface.

## Notes

- Sets `data-nav-tone="dark"` on the card surface so the sticky nav reads against the gradient.
- Slot sizing differs by type: photos render square (clamp 72–96px); logos render at a fixed display height (clamp 72–96px) with auto width up to clamp 180–280px so wide brand marks read at full size instead of being letterboxed inside a square.
- Logo filter (`brightness(0) invert(1)`) assumes a dark-on-transparent source artwork. Provide white-on-transparent SVGs if you need a different treatment and override per-instance.
- Mobile: collapses to a single column at ≤820px (open-quote glyph stacks above the quote). Credit cluster left-aligns at ≤430px.
