# product-features-cards

Unified parameterized cards grid. Two visual presets keyed off `data-cols`:

| Preset | Used by | Visual |
|---|---|---|
| `data-cols="2"` | Homepage core capabilities | Compact: 2×2 grid, Small-body register, 3:1 cropped image strip, subtle drop shadow, tight section padding (host page provides the H2 + paper-zone background). |
| `data-cols="3"` | Solutions "rest comes built-in" | Breathing: 3-up row, full Body register, natural-aspect image well, flat cream cards, full section padding + min-height:100vh centered at ≥1024px, component owns its centered Cormorant H2. |

Replaces the deprecated `product-features-cards-2x2` and `product-features-card-3x1` — same primitive, parameterized per AGENTS.md house rule "match X = same primitive parameterized".

## Mount

```html
<!-- 2-col compact preset (homepage). Optional CTA below the grid. -->
<div data-product-features-cards
     data-cols="2"
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

<!-- 3-col breathing preset (Solutions). Optional centered H2 above. -->
<div data-product-features-cards
     data-cols="3"
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
| `data-cols` | `"2"` \| `"3"` | `"2"` | Grid column count + visual preset (see table above). |
| `data-items` | JSON array | `[]` | Card content. See **Item shape** below. |
| `data-heading` | string | none | Optional centered Cormorant italic H2 above the grid. Used by Solutions's "And the rest comes built-in." |
| `data-cta-href` | URL | none | Renders a `.btn--filled` CTA below the grid. Both href and label must be set; otherwise CTA is omitted. |
| `data-cta-label` | string | none | CTA label text. |

## Item shape

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Bold body title (Poppins 600, `--fs-body`, full `--ink`). |
| `body` | string | yes | Body copy. Register varies by preset: Small-role at `data-cols="2"`, Body-role at `data-cols="3"`. |
| `image` | URL | yes (unless `placeholder`) | Path to product screenshot. Rendered raw; the compact preset crops to 3:1, the breathing preset uses natural aspect. |
| `alt` | string | yes (unless `placeholder`) | Alt text. |
| `placeholder` | boolean | no | When `true`, renders the hatch placeholder instead of an image. |
| `placeholderTag` | string | no | Default `"Image placeholder"`. |
| `placeholderLabel` | string | no | Bolder label under the tag. |

## Dependencies

- `shared/tokens.css`
- `shared/button.css` — for the optional CTA.
- GSAP + ScrollTrigger — entrance animation (24px slide-up + fade-in, 80ms stagger). Cards render in their final state if absent.

## Notes

- Section is transparent — the host page's surface (warm-paper on the homepage, page white on Solutions) shows through.
- Both presets collapse to 1 column at ≤820px with a 560px max-width center column.
- Honors `prefers-reduced-motion: reduce` — no entrance animation, cards render in their final state.
