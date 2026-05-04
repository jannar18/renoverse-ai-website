# Feature highlights

Text-only feature teaser grid with the halftone-paper background treatment, capped by a single CTA.

This is the canonical "homepage text feature section" described in `NOTES.md` (Site architecture #2): four titled one-liners that bridge the homepage tease into the `/product` deep-dive.

## Usage

```html
<link rel="stylesheet" href="../shared/button.css">
<link rel="stylesheet" href="../shared/components/feature-highlights/index.css">

<div data-feature-highlights></div>

<script src="../shared/components/feature-highlights/index.js"></script>
```

The component renders a `<section class="feature-highlights">` into the mount element. Defaults to the four canonical highlights and a "See the product" CTA pointing at `#`.

## Overrides (optional)

```html
<div data-feature-highlights
     data-cta-label="Learn more"
     data-cta-href="/product"
     data-items='[
       {"title":"Frictionless collaboration","copy":"…"},
       {"title":"Version control","copy":"…"}
     ]'></div>
```

- `data-items` — JSON array of `{ title, copy }`. Invalid JSON falls back to defaults.
- `data-cta-label` — button text.
- `data-cta-href` — button target.

## Dependencies

- `shared/button.css` for the `.btn .btn--filled` styling and tick-corner spans.
- Poppins font family (already loaded site-wide).
