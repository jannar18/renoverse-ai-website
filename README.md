# Renoverse AI — Marketing Site

Static marketing site for Renoverse AI. Plain HTML/CSS/JS, no build step.

## Structure

```
.
├── index.html              Landing page
├── demo.html               Book-a-demo page
├── assets/                 Page-specific media (hero, logos, pillars, legal PDFs)
└── shared/
    ├── tokens.css          Brand tokens (color, type, spacing)
    ├── button.css          Canonical .btn styles
    └── components/
        ├── site-nav/
        ├── halftone-video/
        ├── stack-animation/
        ├── feature-highlights/
        ├── icp-carousel/
        ├── team-section/
        └── demo-form/
```

Each component is self-contained: `index.css`, `index.js`, optional `test.html`, `README.md`. Pages mount components via `data-*` hooks (e.g. `<nav data-site-nav></nav>`).

## Run locally

Any static server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Brand system

Locked — see `shared/tokens.css`. Type: Poppins + Cormorant Garamond italic.
