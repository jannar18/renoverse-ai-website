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

### Phase 8 — Demo form button refresh ✅ DONE

- `shared/components/demo-form/index.js`: gradient pill replaced with the `.btn .btn--filled` recipe rendered via Tailwind utilities (azure rect, white text, JetBrains Mono uppercase, square corners, no ticks). The component stays drop-in (no `button.css` dependency) since the form auto-loads Tailwind into hosts that may not include the site stylesheet.
- Removed dead `ARROW` SVG and the now-unused `shadow-cta` token from `demo-form/index.js`, `demo-form/test.html`, and `demo.html`.

### Phase 9 — Page stubs + nav link updates ✅ DONE

Stubs shipped, nav links updated. See Phases 9b + 10 for the build-out passes.

### Phase 9b — Build out `product.html` ⚠️ SUPERSEDED by Round-2 feedback

See **Phase 13** below — `product.html` becomes `solutions.html` (URL + nav label change), and the spine is now Capture/Track/Connect (deep-dive) → Controlled Stakeholder Access → 3 minor features (Frictionless Collab / Version Control / AI Assistant). The earlier plan to reuse the alternating spine still holds; the content sources and structure have been re-specced.

### Phase 10 — Build out `about.html` ⚠️ SUPERSEDED by Round-2 feedback

See **Phase 14** below — same intent (real backstory + team), but the new homepage structure adds an "About the company" teaser block on the homepage that links here, so About becomes the destination for that link as well as a standalone page.

---

## Round 2 feedback (2026-05-05) — manager review

Direct notes from Julianna's manager. These changes take priority over earlier remaining-phase scope. The agreed final IA:

- **Homepage** — Hero → One workspace (animation + sales copy) → Core capabilities (2×2 teaser) → Testimonials → Team / About-the-company beat → Footer
- **Solutions** (was Product, URL flips to `solutions.html`) — Hero → Core capabilities deep dive → Additional capabilities → Footer
- **About** — Hero → Backstory → Meet the team → Footer

> Note on the homepage "About the company" beat: the existing `[data-team-section]` shared component already plays this role today (team grid inside the paper-zone). Treat it as the home-page about-the-company beat — *no separate teaser block needed* — and keep the team component as-is. The standalone About page (Phase 16) is the deeper destination.

### Phase 11 — Nav rework + mobile menu ✅ DONE

- Nav links now read **Home · Solutions · About · [Book A Demo]** (`shared/components/site-nav/index.js`).
- `product.html` renamed → `solutions.html`. References updated in `shared/components/site-nav/index.js`, `shared/components/features-alternating/index.js` (DEFAULT_CTA), `shared/components/feature-highlights/index.js` (DEFAULT_CTA), `demo.html` footer column, `index.html` comments, `STYLE_GUIDE.md`.
- Mobile (≤880px): inline links + Book-a-demo CTA hide; a hamburger toggle takes their place. Tap opens a full-screen frosted sheet (cream tint at 0.88 opacity + 24px backdrop-blur) with Home / Solutions / About links (Cormorant italic, scaled) + a Book-a-demo CTA. Sheet closes on link-tap, Esc, or viewport resize past 880px. Body scroll locks while open. Bar's frosted state is forced on so the X stays legible above the sheet; dark-tone is suppressed while open.

### Phase 12 — Stack animation fixes ("One workspace" section)

- **Sequencing bug** (confirmed by Julianna 2026-05-05): the animation never fully completes — the other screens layer back on top before the popups appear, which makes it look broken *and* extends total length. Re-tune the GSAP timeline in `shared/components/stack-animation/index.js` so the morph completes cleanly into the popup beat without re-stacking the prior screens. Diagnose: check (a) whether earlier-screen opacity/translate is being reset late in the timeline, (b) whether the popup-in tween is fighting an unfinished screen-in tween, (c) whether the bug is scroll-speed sensitive (scrub vs. catch-up). Memory note: the sticky-nav vs stack-pin conflict is a known hazard — verify both still play together.
- **Caption typography**: "One workspace. Every detail." currently mixes sans + serif. Conform to the **H2 style** used elsewhere (Cormorant italic 500, per STYLE_GUIDE) — single voice, not mixed.

### Phase 13 — Homepage section ordering + layout fixes ✅ DONE

Below the stack animation section, re-flowed the page:

- **"Stop wasting hours..." copy** — `.intro` flipped to `text-align: right`, max-width 60ch with `margin-left: auto`.
- **"Built for firms..."** H2 — moved up into a new `<section class="capabilities-section">` wrapper that also contains `[data-features-alternating]`. The "Book a demo" CTA was dropped.
- **Section background** — `.capabilities-section { background: var(--paper-warm); }` carries edge-to-edge across the H2 + the alternating rows; the inner `[data-features-alternating]` is overridden to `transparent` *only inside `.capabilities-section`* so the component's #fff default still applies on `solutions.html`.
- **ICP carousel** rebuilt to the **Phase 5 spec** — three Architect sub-personas (Principal Architects / Project Managers / Junior Designers), reusing the existing SVG visuals + tints (compass / tools / sketch). Clients panel + floorplan SVG dropped. The `copy` field is now a `quote` rendered as italic Cormorant blockquote with a centered open-quote glyph. CTAs all point to `solutions.html`. Added visible frosted prev/next nav buttons (`.icp-carousel__nav`, recipe matched to `.btn--frosted` per memory rule) and full-height invisible side tap zones (`.icp-carousel__tap-zone`, capped width so the centered body+CTA stay click-through). Keyboard ←/→ and touch swipe still work; `tabindex="-1"` on tap zones keeps them out of the keyboard tab order.
- **"Bring order into complexity" final CTA** — section deleted entirely.
- **Footer** — lifted out of `.paper-zone` and given a dark slab (`#0a0a0a` bg, white text, azure accents, white-inverted logo, dark newsletter input) to mirror demo.html's treatment so the footer reads as its own region. Solutions/About will follow this treatment in Phase 15/16.

### Phase 14 — Homepage core capabilities 2×2 grid

Replace the current `[data-features-alternating]` row stack on the homepage with a **2×2 card grid** (4 cards, equal weight):

1. **Email Triage & Auto-Capture**
2. **Decision Log & Audit Trail**
3. **Intelligence Layer on Existing Stack**
4. **Controlled Stakeholder Access** *(new — copy source: page 8 of the Renoverse AI platform doc)*

**Body copy (locked — Renoverse AI Platform Overview, page 4):**

| Card | Body |
|---|---|
| Email Triage & Auto-Capture | The decisions buried in a 40-message chain don't disappear. Ella AI automatically surfaces what matters — organized by project, ready to act on, with the information provenance one click away. |
| Decision Log & Audit Trail | Know who decided what, when, and why — without anyone having to write it down. Every decision is captured, timestamped, and traceable back to its source from first log through final approval. |
| Intelligence Layer on Existing Stack | Nothing gets replaced. Renoverse connects to Microsoft 365 tools and acts as the intelligent coordination layer on top so information flows between systems seamlessly. |
| Controlled Stakeholder Access | Control visibility with three access tiers: internal team, professional collaborators, and client — so private work stays private, and stakeholders and clients see exactly what they need, nothing more. |

**Rules:**
- **No eyebrow** on cards (drop "Capture / Track / Connect" — those stay on Solutions only).
- Card headers use **H3** (Poppins 500 per style guide). H2 is reserved for the section header above the grid.
- Reuse the existing feature images (`assets/feature-email-triage.png`, `assets/feature-decision-log.png`, `assets/feature-intelligence-layer.png`) + a placeholder for Controlled Stakeholder Access.
- Below the grid: **"See all product features →"** CTA → `solutions.html`.

This replaces `data-features-alternating` on `index.html` only — the alternating component is *kept* and reused on the Solutions page (Phase 15).

### Phase 15 — Build out Solutions page (was Phase 9b)

`solutions.html` (renamed from `product.html` in Phase 11). New structure:

1. **Hero** (existing — keep H1 + Lead).
2. **Core capabilities deep dive** — duplicate the homepage's Capture/Track/Connect alternating-features section *as designed*. Each row replaces today's body copy + "See product" CTA with three sub-bullets per feature (label + body) from the platform doc. Eyebrows ("Capture / Track / Connect") **stay** on this page only.

   **Locked copy (Renoverse AI Platform Overview, pages 5–7):**

   - **Email Triage & Auto-Capture** *(pg 5)*
     - **Automated Information Capture** — Connect email to automatically surface decisions, action items, and open questions — organized by project and prepped for human review.
     - **Human-in-the-Loop Controls** — You stay in control of what gets logged — review the triage queue and approve, edit, or skip anything Ella AI surfaces.
     - **Comprehensive Organization** — Ensure essential information is organized and easily accessible, preventing valuable insights from being lost amidst the clutter of fragmented communications.

   - **Decision Log & Audit Trail** *(pg 6)*
     - **Tracked Approvals** — Every decision made within Renoverse is meticulously tracked, ensuring all approvals are logged and easily accessible for review, enhancing transparency among team members.
     - **Timestamped Decisions** — With each decision timestamped, users can effortlessly identify when decisions were made, providing an accurate historical record that supports accountability and informed decision-making.
     - **Comprehensive Audit Trail** — The digital audit trail captures all changes, creating a detailed history of project decisions that helps teams understand the context and reasoning behind each action taken.

   - **Intelligence Layer on Existing Stack** *(pg 7)*
     - **Existing Stack** — Renoverse integrates with your current software tools, ensuring minimal lift to improved project coordination without overhauling existing workflows.
     - **Microsoft Integrations** — Integrates natively with Microsoft email & tools, so critical information is captured automatically, ensuring project context doesn't slip through the cracks.
     - **Coordination Layer** — Enhances your existing infrastructure with a smart coordination layer, promoting collaborative projects while centralizing decision tracking and communication across various teams and tools.

3. **Controlled Stakeholder Access** — new alternating row, placeholder image, three sub-bullets from the platform doc:

   **Locked copy (page 8):**
   - **Private Workspace** — Protect sensitive information with a dedicated team space, ensuring only authorized members can access critical project details and discussions pertinent to their roles.
   - **Professional Layer (Pro-to-Pro)** — Collaborators can engage with relevant project information, allowing for streamlined interactions without overwhelming them with unnecessary data or access to restricted content.
   - **Client-Facing View (Client)** — Share tailored insights with clients, offering them visibility into the project's progress while maintaining control over the sensitive internal discussions and decisions made by the team.

4. **Additional capabilities** — replace the older `feature-highlights` 4-up strip with a more visual representation of the **3** minor features (same sub-copy as today, supporting imagery from existing site):
   - Frictionless Collaboration
   - Version Control
   - AI Assistant

   Composition: 3 cards / rows with more visual weight than today's strip but less than the 4 major capabilities above. Goal — clear "4 main, 3 additional" hierarchy.
5. **Footer** (no editorial closer / final CTA on this page per the new IA).

### Phase 16 — Build out About page ✅ DONE

Final structure (locked by Derek): **Hero → Backstory → Meet the team → Footer**. No editorial closer / final CTA.

- **Hero** — kept the existing H1 + Lead (style-guide-conformant from Phase 9).
- **Backstory** — new `.backstory` section: H2 standalone editorial sentence ("Renoverse started inside a renovation that made the problem obvious.") + 4-paragraph stack inside a 64ch readable column. Copy is **lorem ipsum placeholder** per the locked open-question — replace when Julianna/Nola hand off the founding story.
- **Meet the team** — `[data-team-section]` mounted with `data-theme="paper"` + `data-eyebrow="Meet the team"` and *no* `data-link-href` (the homepage teaser carries the "Learn more →" link; this page is the destination, so the CTA is intentionally suppressed). Wrapped in a `.paper-zone` (paper grain + warm gradient) mirroring the homepage's team treatment.
- **Footer** — flipped from the previous light footer to the dark `#0a0a0a` slab per the Phase 13 treatment (markup unchanged; only CSS swapped). Final-CTA section dropped per the locked IA.

### Phase 17 — Deploy preview + content handoff

Once Phases 11–16 land:
- Deploy a preview build.
- Send the updated site to **Julianna + Nola** for final content / copy review against the new structure.

---

## Execution order (revised)

**Done:** Phase 0, 1, 2, 3, 4, 5 (rolled into 13), 6, 7, 8, 9 (stubs + nav), 11, 12, 13, 16.

**Remaining — recommended order:**
1. **Phase 14** — Homepage 2×2 core-capabilities grid.
2. **Phase 15** — Solutions page build-out (depends on platform-doc copy).
3. **Phase 17** — Deploy preview + send to Julianna + Nola.

**Deferred / changed status:**
- **Phase 5** (ICP carousel rework) — **back in v1**. Julianna's call: keep the section on the homepage, do one more pass at the Architects sub-personas idea with working prev/next arrows + tap zones (per the original Phase 5 spec). Slot after Phase 13.
- **Phase 9b / Phase 10** — superseded by Phase 15 / Phase 16 (same intent, new spec).

---

## Open questions / blockers

- [x] **Renoverse AI platform doc** — received 2026-05-05. Pages 4–8 copy locked into Phase 14 / Phase 15.
- [x] **ICP carousel decision** — keep + retry Architects spec (see Phase 5).
- [x] **Mobile menu pattern** — hamburger → frosted full-screen sheet (Phase 11).
- [x] **Solutions URL** — rename `product.html` → `solutions.html`.
- [x] **About page structure** — locked by Derek: Hero → Backstory → Meet the team → Footer.
- [x] **Homepage "About the company" beat** — covered by the existing team-section component; no new teaser block needed.
- [x] **Stack animation bug** — confirmed by Julianna; not a one-off. Phase 12 includes a deeper diagnostic pass (timeline order, screen-fade-in vs popup-in beats, scroll-speed sensitivity).
- [x] **Backstory copy** for Phase 16 — use **lorem ipsum placeholder** for v1; replace when real copy lands.
- [x] **Controlled Stakeholder Access image** — use the **same placeholder hash** as the team-section photo placeholder for v1. Drop the platform-doc 3-avatar idea.

---

## Side notes (do not forget)

- Newsletter signup currently has no backend (see `index.html:539` TODO). Out of scope for this round but flag separately.
- Demo form submit handler is also a stub (`demo.html:142-147`). Same — flag separately.
