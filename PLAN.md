# Renoverse Website — Implementation Plan

Captures the feedback from Julianna (2026-05-04) and the agreed plan for executing it. Read this top-to-bottom before starting work.

---

## Site structure (v1)

Three pages live in v1:

- `index.html` — homepage
- `product.html` — **new**, full product/features page (canonical "all features")
- `about.html` — **new** stub for the company About page
- `demo.html` — existing

**Solutions / ICP pages are deferred to v2.** When more ICPs ship, "Solutions" returns to the nav as a dropdown with one page per ICP.

---

## Style guide (Phase 0 — do first, governs everything else)

Lock the type system before any other UI work so we don't drift later.

### Type roles

The ICP carousel is the size reference for H1 + H2: H1 mirrors `.icp-carousel__title-slide` (Cormorant italic, centered, hero-sized); H2 mirrors `.icp-carousel__lead` (Poppins 500). H3 is the same family as H1, dropped a step below H2.

| Role | Font | Alignment | Use |
|---|---|---|---|
| **H1** | Cormorant Garamond italic | **centered** | Hero headlines, page-defining moments. Mirrors the ICP carousel title-slide. |
| **H2** | Poppins, ~24–36px, weight 500 | left | Section headers. Mirrors the ICP carousel lead. |
| **H3** | Cormorant Garamond italic, slightly smaller than H2 | left (or centered for a short editorial sentence) | Sub-header role — the typology heading, editorial closers, the italic kicker line ("Every detail.") under the stack-animation H2. |
| **Eyebrow** | JetBrains Mono, uppercase, wide letter-spacing | left | Section index/label above a heading |
| **Lead** | Poppins, ~18–20px, line-height ~1.5, softer color | left | Intro paragraph under a heading; one per section max |
| **Body** | Poppins, 16px | left | Default paragraph copy |
| **Small** | Poppins, ~12–13px, muted color | left | Fine print, captions, footer legal, helper text |

### Alignment

- All body copy **left-aligned**. Centered text is hard to read across multiple lines.
- **H1 is the deliberate exception** — centered as part of its role definition.
- H3 may be centered when used as a short editorial sentence (typology head, italic closer, the kicker under the stack-animation H2).
- H2 + eyebrows default left-aligned.

### Color / spacing / tokens

- Already defined in `shared/tokens.css`. Audit: nothing should be hard-coded outside.
- Document section padding, gutter, max-width values explicitly.

### Buttons

- Canonical CTA: `.btn .btn--filled` (azure rectangle with corner ticks).
- Demo form submit: same azure rectangle, **no ticks** (smaller, in-card variant).
- Document where each variant lives.

### Accessibility checklist

- Skip-nav link on every page.
- Every input has an associated `<label for>` (or sr-only label).
- `:focus-visible` rings on all interactive elements.
- Tab order matches visual order.

**Deliverable:** `STYLE_GUIDE.md` at repo root, plus any token additions to `shared/tokens.css`.

---

## Phases

### Phase 1 — Sticky nav + accessibility primitives

⚠️ **Risk**: Sticky nav has historically conflicted with the stack-animation pin (see `~/.claude/projects/-Users-fractalos-Dev-renoverse-ai-website/memory/sticky-nav-stack-animation-conflict.md`). Test together with Phase 2.

- `shared/components/site-nav/index.css`: change `position:absolute` → `position:sticky; top:0`. Add backdrop-blur or solid-bg state so it reads cleanly over hero + pinned sections.
- Add hidden "Skip to main content" link as the very first focusable element on every page (`index.html`, `demo.html`, `product.html`, `about.html`).
- Add `id="main"` on the main content target of each page.
- Add `:focus-visible` styles to nav links + CTA.

**Verify before sign-off**:
1. Stack-animation pin still triggers correctly with sticky nav.
2. Nav stays visible (not overlapped) during pinned scroll.
3. ScrollTrigger end calculation isn't thrown off.
4. Stack caption sits *below* sticky nav, not behind it.

**Likely fixes if it breaks**:
- Add `--nav-height` token; offset `ScrollTrigger.start: 'top top+=NAV_HEIGHT'`.
- Z-index nav above `.stack-stage`.
- Backdrop-blur nav during animation.
- Last resort: `position:fixed` with manual offsets, or hide nav specifically during the pinned section.

### Phase 2 — Stack animation header re-order

Currently the caption "One workspace. Every detail." animates in *after* the morph completes. Storyboard from Julianna shows it should be in the viewport with the animation while scroll is locked, grounding the concept.

- In `shared/components/stack-animation/index.js` (lines ~1018, ~1148-1154): set `#caption` to `opacity:1, y:0` from the start. Caption stays visible throughout the pinned scroll.
- Re-tune the GSAP timeline so the morph plays *underneath/below* the visible caption.
- Test together with Phase 1 (both touch the pinned scroll region).

### Phase 3 — Merge feature sections

Two sections currently list features differently:
- 4-up `data-feature-highlights` strip (Frictionless collaboration / Version control / AI assistant / Accountability trail)
- 3-card `.typology` section (Centralized Project Intelligence / Automated Admin / Accountability)

**Merge into one** features section with:
- A consistent H2 (per style guide).
- More space per feature (stacked rows or 2-up max — not a 3-or-4-card strip).
- Richer copy from Nola's docs (**need content from Julianna/Nola**).
- "See all features →" CTA → `product.html`.

`product.html` becomes the canonical "all features" page; homepage holds a condensed teaser.

### Phase 4 — Headers + alignment cleanup

- Audit every `<h1>/<h2>/<h3>/<h4>` in `index.html`, `demo.html`, all components → conform to style guide.
- Convert centered copy to left-aligned: `.intro`, `.typology .head`, `.feature-highlights__grid` text-align, etc.
- Re-check for any leftover one-off font sizes/weights.

### Phase 5 — For Architects carousel (deferred — design in Paper first)

Repurpose `shared/components/icp-carousel` for three Architect sub-personas:

- **Principal** — firm-wide oversight, accountability trail, client confidence
- **Project Manager** — RFI tracking, decision logging, version control, fewer escalations
- **Junior / Associate** — faster onboarding, AI assistant for context, no chasing decisions

**Don't reuse existing SVG objects.** Design net-new visuals in Paper specific to each sub-persona's tools/workflows. Use Paper's `code-to-design` skill (Renoverse tokens as context), then drop SVGs into the carousel.

**Implementation steps**:
1. Comment out the four current ICP panels in `shared/components/icp-carousel/index.js` (preserve for v2).
2. Design three new panels in Paper.
3. Drop SVGs into the carousel as new panels.
4. Each panel CTA → `product.html`.

**Phase 5 lands later this week** — design dependency.

### Phase 6 — Accessibility audit

- Skip-nav link (covered in Phase 1).
- Tab-order audit: open every page, tab through, fix out-of-order focus traps. Likely culprits: ICP carousel, dropdown nav.
- Newsletter input: add `<label for="newsletter-email" class="sr-only">Email address</label>` in `index.html` footer (`index.html:541`).
- `:focus-visible` rings everywhere interactive (currently inconsistent).
- Verify demo form labels exist (they do — `shared/components/demo-form/index.js:189`).

### Phase 7 — Team → About link

- `shared/components/team-section/index.js`: add optional `data-link-href` + `data-link-label` attrs.
- In `index.html`, set `data-link-href="about.html"` with label like "Learn about Renoverse →".

### Phase 8 — Demo form button refresh

- `shared/components/demo-form/index.js` (lines 346-350): replace gradient pill button with `.btn .btn--filled` style (azure rectangle, white text). **No corner ticks** (in-card variant per style guide).
- Strip Tailwind `rounded-full bg-gradient-to-br` classes; align with site button system.

### Phase 9 — Page stubs + nav link updates

**Nav** (`shared/components/site-nav/index.js`):
- Product → `product.html`
- ~~Solutions ▾~~ (remove for v1)
- **About** → `about.html` (new link)
- Book a demo (CTA — keep)

**Stub pages**:
- `product.html` — shared nav + footer + features section (lifted from Phase 3 merged section).
- `about.html` — shared nav + footer + placeholder hero/copy. Real content TBD.

**Re-point existing references** away from `index.html#features`:
- Nav "Product" link
- Feature highlights "See the product" CTA (`shared/components/feature-highlights/index.js:38`)
- ICP carousel sub-persona panel CTAs (Phase 5)
- Footer "Product · Overview" in `demo.html:118`

---

## Execution order for today

Phase 0 first (style guide governs the rest). Then Phase 1 + Phase 2 together (touching the same scroll region). Then Phase 9 (stub pages + nav). Then 3, 4, 6, 7, 8 in any order.

Phase 5 deferred to later this week pending Paper designs.

1. **Phase 0** — Style guide + token audit
2. **Phase 1 + Phase 2** — Sticky nav + skip-nav + stack-animation header (tested together)
3. **Phase 9** — `product.html`, `about.html` stubs + nav link updates
4. **Phase 3** — Merge features (depends on Nola's content)
5. **Phase 4** — Header + alignment cleanup
6. **Phase 7** — Team About link
7. **Phase 8** — Demo form button
8. **Phase 6** — Accessibility audit / final pass

---

## Open questions

- [ ] Content from Nola for merged features section (Phase 3) and product page features detail (Phase 9 / `product.html`).
- [ ] About page copy (Phase 9 / `about.html`) — stub for now or real content available?
- [ ] Demo form CTA — confirmed: azure rectangle, **no** corner ticks.
- [ ] Phase 5 visuals — Paper design timeline.

---

## Side notes (do not forget)

- Newsletter signup currently has no backend (see `index.html:539` TODO). Out of scope for this round but flag separately.
- Demo form submit handler is also a stub (`demo.html:142-147`). Same — flag separately.
