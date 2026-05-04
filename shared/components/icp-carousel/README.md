# icp-carousel

A four-panel "for whom" carousel: For Architects / For Builders /
For Interior Designers / For Clients. Each panel layers a per-audience
gradient, a dithered architectural object SVG, a CSS halftone overlay
of `halftone-source.png`, and a WebGL halftone shader composited via
`mix-blend-mode: overlay`. The header runs a horizontal title carousel
that drives panel selection; arrow keys, touch swipe, and click on a
title also navigate.

## Mount

In the host page `<head>`:

```html
<link rel="stylesheet" href="../shared/components/icp-carousel/index.css">
```

In the host page `<body>`, where the section should render:

```html
<div data-icp-carousel></div>
```

Before `</body>`:

```html
<script src="../shared/components/icp-carousel/index.js"></script>
```

The script auto-injects the Google Fonts `<link>` (Poppins, Cormorant
Garamond, JetBrains Mono) if the host page does not already include
that exact href, and resolves `halftone-source.png` relative to the
script URL — the component is portable across host paths.

## Knobs

Direct edits to `index.js` / `index.css`:

- **Panel content** — `PANELS` array near the top of `index.js`:
  `id`, `title`, `lead`, `copy`, `cta`, plus an `object` (or `objects`)
  with a `cls` and `svg`. The `id` must be one of
  `architects | builders | interior | clients` because the per-panel
  gradient and shader tint are matched by that key.
- **Section height** — `.icp-carousel { height: 100vh; min-height: 720px }`.
- **Per-panel gradient** — `.icp-carousel__panel[data-id="..."]` rules.
- **Shader tint** — `TINTS` map in `index.js` (RGB 0..1 per panel id).
- **Halftone density** — `mask-size: 4px 4px` on `.icp-carousel__halftone`.

## Root class

`.icp-carousel` — the script adds this class to the mount element, and
every selector in `index.css` is scoped under it. The component declares
its own `--ink`, `--teal`, `--paper` (etc.) inside that scope, so it
will not bleed into or fight with the host page's tokens.
