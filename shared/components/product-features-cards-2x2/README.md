# product-features-cards-2x2

Homepage core-capabilities grid: 4 cream-surfaced cards in a 2×2 layout with a flat 3:1 image strip at the bottom of each card. All four cards fit in one desktop viewport.

## Mount

```html
<div data-product-features-cards-2x2
     data-cta-href="solutions.html"
     data-cta-label="See all features"
     data-items='[
       {
         "title": "Email Triage & Auto-Capture",
         "body": "Body copy describing the capability.",
         "image": "assets/feature-email-triage.png",
         "alt": "Triage inbox screenshot"
       },
       {
         "title": "Controlled Stakeholder Access",
         "body": "Body copy describing the capability.",
         "placeholder": true,
         "placeholderTag": "Image placeholder",
         "placeholderLabel": "Stakeholder access view"
       }
     ]'></div>
```

## Configuration

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `data-items` | JSON array | `[]` | Card content. See **Item shape** below. |
| `data-cta-href` | URL | none | Renders a `.btn--filled` CTA below the grid. Both href and label must be set; otherwise CTA is omitted. |
| `data-cta-label` | string | none | CTA label text. |

## Item shape

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Bold body title (Poppins 600, --fs-body, full --ink). |
| `body` | string | yes | Small-role subtitle (Poppins 400, --fs-small, --ink-soft). |
| `image` | URL | yes (unless `placeholder`) | Path to product screenshot. Rendered raw. |
| `alt` | string | yes (unless `placeholder`) | Alt text. |
| `placeholder` | boolean | no | When `true`, renders the hatch placeholder instead of an image. |
| `placeholderTag` | string | no | Default `"Image placeholder"`. |
| `placeholderLabel` | string | no | Bolder label under the tag. |

## Dependencies

- `shared/tokens.css`
- `shared/button.css` — for the optional CTA.
- GSAP + ScrollTrigger — entrance animation. Cards render in their final state if absent.

## Notes

- Section is transparent — the host page's surface (warm-paper on the homepage) shows through.
- Targets ~100vh on desktop (≥1024px) so all four cards land in one viewport scroll. Drops the min-height on tablet/phone where content drives height.
- Honors `prefers-reduced-motion: reduce`.
- 3-up Solutions sibling is `product-features-card-3x1` (different proportions: 5:2 image, full body text).
