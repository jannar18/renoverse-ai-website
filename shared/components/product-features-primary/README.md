# product-features-primary

The site's primary product-feature section: an N-row alternating layout with a horizontally split background — text on the white half, image on a `cream → aqua → teal` gradient panel that bleeds to the viewport edge. The dark/right side carries the canonical halftone signature (CSS dot-mask + WebGL shader, same recipe as the carousel) and the row's image floats on top in a white-card frame.

Currently mounted only on the Solutions deep-dive (4 rows, bullets mode, CTAs suppressed). The homepage uses `product-features-cards-2x2` instead. The component still ships a 3-row body+CTA default in `index.js` (Email Triage / Decision Log / Intelligence Layer) so a no-args mount renders something sensible — that path is dead in production today, exercised only by the test fixture's "Mode 1" panel.

## Mount

```html
<div data-product-features-primary
     data-cta-href="solutions.html"
     data-cta-label="See solutions"
     data-items='[
       {
         "eyebrow": "Capture",
         "title": "Email Triage & Auto-Capture",
         "body": "Body copy describing the capability.",
         "image": "assets/feature-email-triage.png",
         "alt": "Triage inbox screenshot",
         "side": "image-right"
       }
     ]'></div>
```

## Configuration

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `data-items` | JSON array | 3-row homepage default (Email Triage, Decision Log, Intelligence Layer) | Row content. See **Item shape** below. |
| `data-cta-href` | URL | `solutions.html` | Per-row CTA href. Applied to every body-mode row that doesn't suppress CTAs. |
| `data-cta-label` | string | `See solutions` | Per-row CTA label. |
| `data-cta-hidden` | `"1"` | unset | When set, suppresses per-row CTAs globally — even on body-mode rows. Used by Solutions (the page IS the deep dive, so CTAs would self-loop). |

## Item shape

| Key | Type | Required | Notes |
|---|---|---|---|
| `eyebrow` | string | no | Mono-uppercase eyebrow above the title (Poppins Mono, `--fs-eyebrow`, `--teal`). |
| `title` | string | yes | Cormorant italic 500 H2, full `--ink`. |
| `body` | string | yes (unless `bullets` set) | Body paragraph in `--ink-soft`. Replaced by the bullet list when `bullets` is non-empty. |
| `image` | URL | yes (unless `placeholder`) | Path to product screenshot. Rendered raw, max-height clamps 380–640px. |
| `alt` | string | yes (unless `placeholder`) | Alt text for the image. |
| `side` | `"image-left"` \| `"image-right"` | `"image-left"` | Which column the image occupies. Side flips per row to drive rhythm; Solutions forces `image-right` everywhere for contrast reasons. |
| `bullets` | array of `{label, body}` | no | When non-empty, replaces the body paragraph + per-row CTA with a 3-bullet list (Solutions deep-dive mode). |
| `placeholder` | boolean | no | When `true`, renders the diagonal-stripe hash (matching `team-section`'s media-ph) instead of an image. |
| `placeholderTag` | string | `"Image placeholder"` | Small tag inside the placeholder. |
| `placeholderLabel` | string | none | Bolder label under the tag. |
| `halftoneImage` | URL | `assets/feature-halftone-source.avif` | Source image for the section-level halftone. The first item's value wins (the halftone is one continuous treatment across all rows, not per-row). Per-asset re-tuning is discouraged — see [feedback-halftone-shader-default.md](../../../.claude/projects/-Users-fractalos-Dev-renoverse-ai-website/memory/feedback-halftone-shader-default.md). |

## Dependencies

- `shared/tokens.css` — colors, type scale, spacing, fonts, `--grad-cream-aqua-teal`.
- `shared/button.css` — `.btn` + `.btn--white` for the per-row CTA's bracket-corner shell.
- `shared/effects.css` — currently unused at the row level (an earlier `fx-grain--ink` was removed because it was tinting the white side grey); kept here so the test fixture matches the component-contract import set.
- GSAP + ScrollTrigger — entrance animation (media slide + blurb fade). Component renders in its final state if absent.
- WebGL — the halftone shader on the right-half canvas. Falls back to `display:none` if the context can't be created or the source image fails to load; the CSS dot-mask halftone underneath still reads.

## Mount guard

`data-product-features-primary-mounted="1"` is set on the host element after the first mount to make the boot idempotent. Per the project rule on unabbreviated identifiers, this matches the directory name literally instead of using a short prefix.

## Notes

- **Background layers live at the section level**, not per row, so the gradient strip + CSS halftone + WebGL shader read as one continuous treatment from the top of row 1 through the bottom of the last row. Rows render only their content.
- **`min-height: calc(100vh - var(--nav-height, 72px))` per row** — when a row pins to the top of the viewport, the gradient + halftone + shader fill the visible region without overflowing below the fold.
- **Mobile (≤860px):** rows collapse to single column with image above blurb regardless of `side`. The right-half background layers (`__panel-strip`, `__halftone`, `__shader`) hide on mobile since the desktop right-50% positioning doesn't translate to a single-column stack. Rows get a simpler white treatment.
- Honors `prefers-reduced-motion: reduce` — entrance animation is skipped and the GSAP-set hidden state is overridden via `!important` so the row reveals immediately.
- The bullet list (Solutions mode) intentionally has no glyphs/markers — the bold label is the visual anchor.
