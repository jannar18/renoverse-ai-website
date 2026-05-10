# Renoverse AI — Marketing Site

Static marketing site for Renoverse AI. Plain HTML/CSS/JS, no build step.

**Pages:** `index.html` (homepage), `solutions.html`, `about.html`, `demo.html`.

## Where to start

- **First-time setup for a non-technical teammate?** → [`HANDOFF.md`](./HANDOFF.md). Step-by-step guide for the founder (or anyone non-technical) to install Claude Desktop, get repo access, and ship their first edit. Walks through the whole loop end-to-end with screenshots.
- **Already set up, just need to find which file holds which copy?** → [`EDITING.md`](./EDITING.md). Sitemap of every page → section → file, plus prompt patterns for common edit shapes.
- **Pre-launch: moving the site from staging to a real domain?** → [`LAUNCH.md`](./LAUNCH.md). Decisions to lock, cutover runbook, post-launch checklist. One-time read; archive after launch.
- **Working in the code (developer or AI agent)?** → [`AGENTS.md`](./AGENTS.md). Session protocol, house rules, sync discipline.
- **Looking up brand tokens / type / signatures?** → [`DESIGN.md`](./DESIGN.md). Color tokens, type scale, gradients, button variants, section signatures, common requests, do's and don'ts.
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

Locked. Type: Poppins (sans) + Cormorant Garamond italic (editorial headings). The canonical brand system lives in [`DESIGN.md`](./DESIGN.md); `shared/tokens.css` is the regenerated runtime mirror — edit `DESIGN.md` first and propagate per its mapping rules. Never hand-paste hex values.
