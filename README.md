# Renoverse AI — Marketing Site

Static marketing site for Renoverse AI. Plain HTML/CSS/JS, no build step.

**Pages:** `index.html` (homepage), `solutions.html`, `about.html`, `demo.html`.

## Where to start

- **Editing site copy or swapping assets?** → [`EDITING.md`](./EDITING.md). Recipe book for non-technical teammates pasting into Claude.ai.
- **Working in the code (developer or AI agent)?** → [`AGENTS.md`](./AGENTS.md). Session protocol, house rules, sync discipline.
- **Looking up brand tokens / type / signatures?** → [`STYLE_GUIDE.md`](./STYLE_GUIDE.md). Color tokens, type scale, gradients, button variants, section signatures.
- **Want the active priority list / open follow-ups?** → [`REVISIONS.md`](./REVISIONS.md). What's shipped and what's next.

## Run locally

Any static server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

No `npm install`, no build, no watcher. Refresh the browser to see edits.

## Structure

```
.
├── index.html              Homepage
├── solutions.html          Product features deep-dive
├── about.html              Backstory + team
├── demo.html               Book-a-demo page
├── assets/                 Images, video, favicons, OG card, legal PDFs
└── shared/
    ├── tokens.css          Brand tokens (color, type, spacing, gradients)
    ├── effects.css         Surface treatments (grain, dither, halftone bloom)
    ├── button.css          Canonical .btn variants
    ├── halftone-shader.js  Shared WebGL halftone primitive
    └── components/
        ├── site-nav/                       (top navigation)
        ├── site-footer/                    (wave-gradient footer)
        ├── halftone-video/                 (homepage hero shader)
        ├── product-features-animation/     (homepage scroll-and-converge)
        ├── product-features-cards-2x2/     (homepage 2×2 capabilities grid)
        ├── product-features-card-3x1/      (Solutions "rest comes built-in")
        ├── product-features-primary/       (Solutions deep-dive feature rows)
        ├── testimonial-card/               (homepage spotlight quote)
        ├── team-section/                   (about-page team block)
        └── demo-form/                      (book-a-demo form)
```

Each component is self-contained: `index.css`, `index.js`, and (for most) `README.md` + `test.html`. Pages mount components via `data-*` hooks (e.g. `<nav data-site-nav></nav>`).

## Brand system

Locked. Type: Poppins (sans) + Cormorant Garamond italic (editorial headings). Colors and gradients live in `shared/tokens.css` — never hand-paste hex values.
