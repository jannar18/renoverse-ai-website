# product-features-card-3x1

Solutions "rest comes built-in" beat: 3 cream-surfaced cards in a single row with a 5:2 image strip. Sibling component to `product-features-cards-2x2` — same primitive ingredients, different proportions.

## Mount

```html
<div data-product-features-card-3x1
     data-heading="And the rest comes built-in."
     data-items='[
       {
         "title": "Frictionless collaboration",
         "body": "Body copy describing the capability.",
         "image": "assets/pillar-collaborators.png",
         "alt": "Project collaborators panel"
       }
     ]'></div>
```

## Configuration

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `data-items` | JSON array | `[]` | Card content. See **Item shape** below. |
| `data-heading` | string | none | Optional centered Cormorant italic H2 above the grid. |

## Item shape

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Bold body title (Poppins 600, --fs-body, full --ink). |
| `body` | string | yes | Body-role copy (Poppins 400, --fs-body, --ink-soft). |
| `image` | URL | yes (unless `placeholder`) | Path to product screenshot. Rendered raw. |
| `alt` | string | yes (unless `placeholder`) | Alt text. |
| `placeholder` | boolean | no | When `true`, renders the hatch placeholder instead of an image. |
| `placeholderTag` | string | no | Default `"Image placeholder"`. |
| `placeholderLabel` | string | no | Bolder label under the tag. |

## Dependencies

- `shared/tokens.css`
- GSAP + ScrollTrigger — entrance animation. Cards render in their final state if absent.

## Notes

- Section is transparent — the host page's surface (page white on Solutions) shows through.
- 5:2 image (taller than the 2x2's 3:1) gives the 3-up cards more portrait-leaning weight at narrower per-card widths.
- Honors `prefers-reduced-motion: reduce`.
- 2x2 homepage sibling is `product-features-cards-2x2` (different proportions: 3:1 image, Small body text).
