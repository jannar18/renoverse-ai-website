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

- **Section height** — `.stack-section { height: 300vh }` controls how much
  scroll the pinned timeline consumes. ScrollTrigger's `end: '+=300%'` is
  matched to this; change them together if you want a longer/shorter beat.
- **Caption copy** — bottom of the markup template in `index.js`
  (`<h1>One workspace.<br/><span class="muted">Every detail.</span></h1>`).
- **Background** — `.stack-section { background: #fff }`.

## Root class

`.stack-section` — every selector in `index.css` is scoped under this root,
so the component is safe to drop into any host page without collisions.
