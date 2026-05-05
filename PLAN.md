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

The heading hierarchy reads by voice rather than depth: **H1 + H2 are Cormorant italic** (editorial — hero, big editorial moments, closers); **H3 is Poppins** (utility — section headers). The ICP carousel is the size reference: H1 mirrors `.icp-carousel__title-slide`; H3 mirrors `.icp-carousel__lead`. H2 sits between them at clamp(32–52px) for the editorial-moment register.

| Role | Font | Alignment | Use |
|---|---|---|---|
| **H1** | Cormorant Garamond italic, ~48–96px, weight 600 | left or centered (per page) | Hero headlines, page-defining moments. Mirrors the ICP carousel title-slide. |
| **H2** | Cormorant Garamond italic, ~32–52px, weight 500 | left (or centered for a single editorial sentence) | Editorial moments — final-CTA closer, typology heading, page-section moments that aren't quite hero-scale. |
| **H3** | Poppins 500, ~24–36px | left | Section headers. Mirrors the ICP carousel lead. |
| **Eyebrow** | JetBrains Mono, uppercase, wide letter-spacing | left | Section index/label above an H3 (section header). **Not used on heroes.** |
| **Lead** | Poppins, ~17–20px, weight 400, softened ink | left in sections; centered when used as a hero subtitle (matches its H1) | Intro paragraph under an H3 (one per section max), or the subtitle under a hero H1. |
| **Body** | Poppins, 16px | left | Default paragraph copy |
| **Small** | Poppins, ~12–13px, muted color | left | Fine print, captions, footer legal, helper text |

### Anatomies

- **Hero** = H1 + Lead. Centered as a block (homepage default) or left-aligned (per-page choice). No eyebrow.
- **Section (typical)** = optional Eyebrow → H3 → optional Lead → Body. H2 lives between or alongside sections as a standalone editorial moment (closer, typology heading) — it's not part of the typical section anatomy.

### Alignment

- All body copy and H3 **left-aligned**. Centered text is hard to read across multiple lines.
- **H1 alignment is contextual** — picked per page. Heroes are the only composition that authorizes centered multi-line copy (because H1 + Lead read as one unit).
- **H2 may be centered** when used as a single editorial sentence (typology head, italic closer, final-CTA closer).
- **Lead** is centered when it's the hero subtitle (matches the H1 axis); left otherwise.
- Eyebrows always left-aligned.

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

### Phase 0 — Style guide + token audit ✅ DONE

### Phase 1 — Sticky nav + accessibility primitives ✅ DONE

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

### Phase 2 — Stack animation header re-order ✅ DONE

Currently the caption "One workspace. Every detail." animates in *after* the morph completes. Storyboard from Julianna shows it should be in the viewport with the animation while scroll is locked, grounding the concept.

- In `shared/components/stack-animation/index.js` (lines ~1018, ~1148-1154): set `#caption` to `opacity:1, y:0` from the start. Caption stays visible throughout the pinned scroll.
- Re-tune the GSAP timeline so the morph plays *underneath/below* the visible caption.
- Test together with Phase 1 (both touch the pinned scroll region).

### Phase 3 — Merge feature sections ✅ DONE (PR #5)

Two sections currently list features differently:
- 4-up `data-feature-highlights` strip (Frictionless collaboration / Version control / AI assistant / Accountability trail)
- 3-card `.typology` section (Centralized Project Intelligence / Automated Admin / Accountability)

**Merge into one** features section with:
- A consistent H2 (per style guide).
- More space per feature (stacked rows or 2-up max — not a 3-or-4-card strip).
- Richer copy from Nola's docs (**need content from Julianna/Nola**).
- "See all features →" CTA → `product.html`.

`product.html` becomes the canonical "all features" page; homepage holds a condensed teaser.

### Phase 4 — Headers + alignment cleanup ✅ DONE

- Audit every `<h1>/<h2>/<h3>/<h4>` in `index.html`, `demo.html`, all components → conform to style guide.
- Convert centered copy to left-aligned: `.intro`, `.typology .head`, `.feature-highlights__grid` text-align, etc.
- Re-check for any leftover one-off font sizes/weights.

### Phase 5 — For Architects carousel (revised 2026-05-05 — copy + controls only, no Paper redesign)

Repurpose `shared/components/icp-carousel` for three Architect sub-personas. **Reuse the existing SVG visuals + tints** for v1 — Paper redesign is deferred. Drop the Clients panel.

**Panel content (final, locked):**

1. **For Principal Architects** *(reuse Architects visual + tint)*
   - Lead: "Reclaim time to take on more projects and grow your business."
   - Quote (body copy, italic blockquote treatment): *"I feel like I'm putting out fires all day and don't have any time to design anymore."*
   - CTA: "Learn more" → `product.html`

2. **For Project Managers** *(reuse Contractors visual + tint)*
   - Lead: "Reclaim time to do more of the work you want to do — not the work you have to do."
   - Quote: *"I miss the days when I used to be drafting and doing redlines. Now I'm constantly in meetings and reading 100 emails every day."*
   - CTA: "Learn more" → `product.html`

3. **For Junior Designers** *(reuse Interior visual + tint)*
   - Lead: "Reclaim time and energy to jump into new projects — without long onboarding or waiting on your manager's calendar."
   - Quote: *"Seniors are directly notified of design changes from clients, but they're usually so slammed they forget to tell me — so I often spend extra days drafting against an old design intent."*
   - CTA: "Learn more" → `product.html`

**Drop:** the Clients panel (id, tint, SVG, panel order).

**Controls to add:**
- Prev/next arrow buttons (frosted style — match `.btn--frosted` per memory: copy color, opacity, blur, saturate, border, shadow).
- Left/right full-height tap zones for slide toggle. Position behind text/CTA so clicks on copy still work.
- Verify existing ←/→ keyboard nav still works after the reduction from 4 → 3 panels.

**Body-copy treatment:** render the quote as a styled blockquote (italic, with an open-quote glyph or left rule) so it reads as a voice from the role rather than marketing copy. Pick the register that matches the panel's existing visual weight.

**Implementation notes:**
- File: `shared/components/icp-carousel/index.js` — `PANELS` array, `TINTS` map, `PANEL_ORDER` array. Drop the `clients` entry from all three.
- The current panel `copy` field becomes the quote body. Add a `quote: true` flag (or similar) so the renderer knows to wrap it in `<blockquote>`.
- All CTAs point to `product.html` (was `for-architects.html` / `demo.html`).

**Paper redesign deferred to v2** when more ICPs ship.

### Phase 6 — Accessibility audit ✅ DONE

### Phase 7 — Team → About link ✅ DONE

- `shared/components/team-section/index.js`: optional `data-link-href` + `data-link-label` attrs render a `.btn .btn--white` CTA reusing the ICP carousel CTA recipe (4x .tk corner ticks + aqua arrow puck). Variant is `.btn--white` (azure text on white) rather than `.btn--frosted` because the team block sits on the paper-zone backdrop where white-on-cream wouldn't read.
- `index.html` sets `data-link-href="about.html"` + `data-link-label="Learn more"`.

### Phase 8 — Demo form button refresh

- `shared/components/demo-form/index.js` (lines 346-350): replace gradient pill button with `.btn .btn--filled` style (azure rectangle, white text). **No corner ticks** (in-card variant per style guide).
- Strip Tailwind `rounded-full bg-gradient-to-br` classes; align with site button system.

### Phase 9 — Page stubs + nav link updates ✅ DONE

Stubs shipped, nav links updated. See Phases 9b + 10 for the build-out passes.

### Phase 9b — Build out `product.html` (revised 2026-05-05)

`product.html` currently exists as a stub. This phase builds it into the canonical "all features" page.

**Content + structure:**
- Reuse the **alternating-features** component pattern from the homepage (the one shipped in PR #5) as the spine of the page.
- Each feature gets a fuller treatment than the homepage teaser — longer copy, more breathing room, supporting visual.
- Hero per the style guide (H1 + Lead, no eyebrow). Pick alignment per page.
- Editorial closer (H2) at the bottom mirroring the homepage closer pattern, into a final CTA.

**Open content questions:**
- Real long-form copy for each feature — pull from Nola's docs or draft from the homepage teasers and have Julianna edit.
- Do we need any product-page-only sections (security, integrations, pricing teaser) or is the alternating-features spine enough for v1?

**Re-point existing references to `product.html`** (most done in Phase 9; verify these still resolve):
- Nav "Product" link
- Feature highlights "See the product" CTA (`shared/components/feature-highlights/index.js:38`)
- ICP carousel sub-persona panel CTAs (Phase 5 — three panels)
- Footer "Product · Overview" in `demo.html:118`

### Phase 10 — Build out `about.html` (added 2026-05-05)

`about.html` currently exists as a stub. This phase replaces the placeholder hero/copy with real content.

**Open content questions:**
- Real about copy — mission, team backgrounds, founding story. Need from Julianna.
- Team photos / founder photos — do we have brand-treatment-ready imagery, or use silhouettes/initials for v1?
- Press / investor section — in scope for v1 or defer?

**Treatment notes:**
- Hero per style guide (Cormorant H1 + Lead).
- Use the paper-zone pattern at the bottom (team + closer + footer) per `STYLE_GUIDE.md:458` for visual continuity with the homepage.
- Editorial H2 closer mirroring homepage register.

---

## Execution order

**Done:** Phase 0, 1, 2, 3, 4, 6, 7, 9 (stubs + nav).

**Remaining (any order, recommend the order below):**
1. **Phase 8** — Demo form button refresh
2. **Phase 9b** — Build out `product.html` (depends on long-form feature copy)
3. **Phase 10** — Build out `about.html` (depends on about copy)
4. **Phase 5** — ICP carousel rework (copy + arrows + tap zones; content fully locked, see above)

---

## Open questions

- [ ] Long-form feature copy for `product.html` (Phase 9b).
- [ ] About copy + team imagery for `about.html` (Phase 10).
- [ ] Demo form CTA — confirmed: azure rectangle, **no** corner ticks.
- [ ] Phase 5 Paper redesign — deferred to v2 (v1 reuses existing visuals).

---

## Side notes (do not forget)

- Newsletter signup currently has no backend (see `index.html:539` TODO). Out of scope for this round but flag separately.
- Demo form submit handler is also a stub (`demo.html:142-147`). Same — flag separately.
