# Renoverse Website — Revisions & Next Steps

**Read this first every session.** This is the live priority list for the Renoverse marketing site. Items at the top are the active priority; older phase work sits below.

References every session must respect:
- **`STYLE_GUIDE.md`** — colors, fonts, gradients, typography, button recipes, alignment rules. All styling decisions trace back here.
- **`shared/components/`** — the component library. Every component ships `index.css` + `index.js` + `README.md` + `test.html` and mounts via `data-*` hooks.
- **`AGENTS.md`** — session start/end protocol. Read it.

---

## Active priority — Round 3 revisions (Julianna feedback)

10 outstanding items from the most recent feedback round. Tackle in any order; mark done with PR reference when shipped.

### Homepage

- [x] **2. "Built for firms managing complex processes and workflows." H2 centered in the capabilities section.** (PR #28)

- [x] **5. Testimonial card scalable layout — works with photo, logo, or name-only.** (PR #29) Extracted to `shared/components/testimonial-card/` (full contract). Card keeps the canonical dark-oxford-blue → teal → cream gradient + warm grain (per operator: layout only; background and colors unchanged). Layout per wireframe: chunky Cormorant open-quote glyph upper-left, italic quote spans most of card width, bottom-right cluster (slot → divider → Name/Role/Company stack). Three modes via `data-image` / `data-logo` / neither; divider always present so the attribution column doesn't shift.

- [x] **7. Footer text + newsletter field — color contrast fix to meet WCAG AA (≥ 4.5:1).** (PR #26)
- [x] **8. Footer logo — smaller on desktop; never deforms / squashes on resize.** (PR #26)

### Solutions

- [x] **9. Center the hero in space.** (PR #25)
- [x] **10. H1 → "Design more. Chase less."** (PR #25)
- [x] **11. Hero supporting copy → "Goodbye, hundreds of email threads, decision gaps, and endless admin. Reclaim your billable time and sanity on residential projects."** (PR #25)
- [x] **12. Image always right, copy always left across all four deep-dive features (drop the alternating layout).** (PR #25)
- [x] **13. Add "Control" eyebrow to the 4th feature (Controlled Stakeholder Access) so all four features share the same `eyebrow → title → bullets` shape.** (PR #25)

### About

- [x] **14. Center the story section so it reads as a story (h2 → content → h2 → content, single column).** (PR #30) Backstory section converted from a 2-column grid to a single centered 60ch column; each block stacks H2 (centered, italic Cormorant — sanctioned single-editorial-sentence centered-H2 exception) above its body copy (left-aligned, per "no centered multi-line body copy outside a hero"). About page hero also centered to match the Solutions hero pattern (Round 3 #9): `.page-hero .wrap` is now `text-align:center`, H1 and subtitle share the center axis with `margin:0 auto` / `margin:24px auto 0`.

---

## Outstanding from final-pass plan (lower priority — pick up after Round 3)

### F1.5 — Component library tail (loudest violators already cleared)

- [ ] README + `test.html` backfill for: `features-alternating`, `halftone-video`, `site-footer`, `site-nav` (the four still missing the contract).
- [ ] Test fixtures should import `tokens.css` / `button.css` / `effects.css` so token-correctness is verifiable in isolation.
- [ ] Mount-guard naming inconsistency (`data-fa-mounted` / `data-fh-mounted` / `data-fe-mounted` etc.) — flag-only per memory rule; operator picks the replacement.

### F2 — ARIA + WCAG 2.1 AA compliance

Standards: WCAG 2.1 AA + WAI-ARIA 1.2 + APG patterns. SR matrix: VoiceOver (macOS + iOS), NVDA (Windows), TalkBack (Android). Tools: axe-core CLI, Lighthouse a11y ≥ 95, Pa11y, WAVE.

Coverage:
- Landmarks per page (`<header> <nav> <main id="main"> <footer>`); one `<h1>`; heading order monotonic.
- Skip-link + `:focus-visible` on every interactive.
- `<img>` alts; halftone overlays + hero video `aria-hidden`.
- Forms (demo + footer newsletter): real or `sr-only` labels; `aria-required`; `aria-live` for errors.
- Mobile menu: hamburger `aria-expanded` + `aria-controls`; sheet `role="dialog"` + `aria-modal="true"` + focus trap + Esc + return focus.
- Stack animation: `prefers-reduced-motion` honored.
- Color contrast ≥ 4.5:1 (3:1 for ≥18pt). Frosted nav over hero is the usual offender.
- Tab order matches visual; no `tabindex > 0`.

Known named blockers:
- `demo.html` `<h1>` promotion.
- Stack-animation `prefers-reduced-motion`.
- Halftone-video `prefers-reduced-motion`.

### F3 — Mobile polish

Walk every page top-to-bottom at the standard breakpoint set: **1440 / 1280 / 1024 / 820 / 768 portrait + 1024×768 landscape / 430 / 390 / 360**. Fix in component CSS (never page CSS). Every fix names its breakpoint.

Confirmed issues (from `notes/team-review-main-20260506-123533.md` + `notes/CR-RENOVERSE-MobileVideo-20260506-131237.md`):

- Stack-animation has no responsive rules; popups overflow at phone width.
- Footer wordmark sized ~100% of viewport width; squashes the logo on mobile (overlaps with #8 above).
- Demo page: insufficient padding above the form; nav covers the third checkmark bullet during scroll.
- Frosted-nav contrast over hero video varies frame-to-frame.
- Components disagree on the "tablet → mobile" breakpoint by 20–100px (860 / 880 / 960). Pick one and propagate.
- Page-level mobile rules in `index.html`, `solutions.html`, `about.html` should move into the relevant components.

### F4 — Style finalization

- `STYLE_GUIDE.md` updated for any drift introduced in Round 3 / F2 / F3.
- Type-scale clamps confirmed across all four pages.
- Token-only check: no hex/rgb anywhere outside `tokens.css` (allowable exception: opaque overlays inside a single component).
- Add missing tokens for anything that had to be inlined.
- **Reconcile the "Add a footer" section.** Still describes the pre-PR-#21 light/dark footer variants ("ink text" or "white text on `#0a0a0a`"); live footer is the wave-gradient variant with `--oxford-blue` text (post PR #26). Rewrite that section to document the current footer.

### F5 — Authoring docs (audience: non-technical teammates pasting into Claude.ai)

1. **`EDITING.md`** — recipe book of common edits ("change a homepage headline", "swap a feature image", "add a person to the team", "change footer links"). Each recipe = file to point Claude at + copy-pasteable prompt template + what to look for in the preview to confirm. No engineer jargon.
2. **`README.md` rewrite** — short. What the site is + pointer to `EDITING.md` for editors and `AGENTS.md` for AI.
3. **Per-component `README.md` audit** — overlaps with F1.5 README backfill.

(`AGENTS.md` already exists at the repo root — house rules + session protocol — and is the universal AI agent doc convention.)

---

## Deferred (post-launch)

### F6 — Hosting + domain cutover (gated on demo form backend)

Will not happen until the demo form has a real backend. Until then, the site stays on GitHub Pages.

- Stand up Cloudflare Pages preview deploy. Get every page green at `*.pages.dev`.
- Add `_headers` / `_redirects` for security headers + cache rules.
- Custom domain (`renoverse.com` or `renoverse.ai` — tbd), DNS, TLS, `www`/apex redirects, HSTS after smoke-test.
- **Update absolute URLs in every page `<head>`** — `canonical`, `og:url`, `og:image`, `twitter:image` — from `https://jannar18.github.io/renoverse-ai-website/...` to the new domain. Marker comment in each head: `<!-- F6 cutover: replace absolute URLs ... -->`. Also `assets/og-card.html` and `assets/favicon/site.webmanifest`.
- Decommission GitHub Pages.

---

## Completed (history)

Build-out (PRs #1–#19):
- Phases 0–17 — style guide, sticky nav, stack animation, feature merges, header cleanup, ICP carousel rebuild, accessibility primitives, team→about link, demo form button refresh, page stubs + nav, mobile menu, homepage section reorder, homepage 2×2 grid, Solutions deep-dive build-out, About backstory + team, deploy preview.

Final-pass round (PRs #20–#22 + intermediate cleanup commits):
- F1 — code review / token drift / dead code / brand alignment.
- F1.5 (loudest violators) — ICP carousel cut (PR #21), `features-editorial` replaced by `product-features-cards-2x2` + `product-features-card-3x1` (PR #22), footer simplified to gradient-only (PR #21), head hygiene (PR #20).

Round 3 revisions shipped:
- 1. Homepage "Stop wasting…" copy reordered into the animation section.
- 3. Homepage 4-blocker (2×2) compacted, modeled after Solutions 3-up.
- 4. ICP carousel cut (PR #21).
- 6. Footer direction picked — gradient-only (PR #21).
- 7. Footer contrast → text moved to `--oxford-blue` for WCAG AA on the wave gradient (PR #26).
- 8. Footer logo aspect-ratio + smaller-on-desktop, fixed via width-driven sizing (PR #26).
- 9–13. Solutions hero rewrite + uniform image-right + Control eyebrow + 3x1 polish (PR #25).
- 5. Testimonial card extracted to `shared/components/testimonial-card/` with scalable layout for photo / logo / name-only modes (PR #29).
- 14. About backstory → single centered 60ch column (h2 → content → h2 → content); About hero also centered to match the Solutions hero pattern (PR #30).

Token-system rename shipped alongside #7/#8 (PR #26): `--blue` → `--cool-blue`, `--dark-oxford` → `--dark-oxford-blue`, all gradient tokens / `.fx-*` classes / Tailwind aliases / style-guide tables updated in lockstep.

Capabilities section padding tightening shipped alongside #5 (PR #29): removed `min-height:100vh + justify-content:center` from `product-features-cards-2x2` and reduced its top padding so the H2 sits behind the frosted nav at the natural cards-fill-screen scroll position.
