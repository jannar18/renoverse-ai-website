# product-features-animation

Scroll-driven "stack and converge" sequence: five legacy tool dashboards
(Excel, AutoCAD, Bluebeam, Finder, Gmail) start exploded around the viewport,
converge toward center, and dissolve as a single Renoverse app emerges with
floating feature callouts.

## Mount

In the host page `<head>`:

```html
<link rel="stylesheet" href="../shared/components/product-features-animation/index.css">
```

In the host page `<body>`, where the section should render:

```html
<div data-product-features-animation></div>
```

Before `</body>`, after GSAP + ScrollTrigger:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="../shared/components/product-features-animation/index.js"></script>
```

## Knobs

Direct edits to `index.css` / `index.js`:

- **Section height** — `.stack-section { height: 200vh }` (desktop) controls
  how much scroll the pinned timeline consumes; the mobile override at
  `@media (max-width: 820px)` shortens it to `130vh` since the orbital
  callouts are hidden at that width. ScrollTrigger's `end` is wired to the
  section height — change them together if you want a longer/shorter beat.
- **Caption copy** — bottom of the markup template in `index.js`
  (`<h2>One workspace. Every detail.</h2>` inside `.caption`). Promoted from
  `<h1>` to `<h2>` per F2 a11y — the page H1 lives elsewhere.
- **Background** — `.stack-section { background: var(--white) }`.

## Root class

`.stack-section` — every selector in `index.css` is scoped under this root,
so the component is safe to drop into any host page without collisions.
