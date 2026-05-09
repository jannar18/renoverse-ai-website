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

- [x] README + `test.html` backfill for `features-alternating` (renamed to `product-feature-primary`; new `README.md` + `test.html` shipped). Operator confirmed `halftone-video`, `site-footer`, `site-nav` are good as-is and don't need the contract files. (PR #31)
- [x] Mount-guard naming convention set: full unabbreviated component name (e.g. `data-product-features-primary-mounted`), no two-letter prefixes. Saved as a feedback memory; future components follow this. Existing `data-fh-mounted` / `data-fe-mounted` / etc. on components we're keeping as-is stay until their next touch — not worth churn. (PR #31)
- [x] **Test fixtures import `tokens.css` / `effects.css` / `button.css`** so token-correctness is verifiable in isolation. (PR #43) Final state: `product-features-animation` and `team-section` had only `index.css`; now both import tokens + effects (and team-section adds button.css since it renders `.btn--white`). `demo-form` had tokens only; now adds effects.css (no button.css — submit uses Tailwind, not the `.btn` primitive). `testimonial-card` and `product-features-card-3x1` already had tokens + effects and confirmed correct without button.css (neither renders `.btn`). `product-features-primary` and `product-features-cards-2x2` already had the full kit.
- [x] **Shader-DRY follow-up.** (PR #45) Extracted the WebGL halftone shader into `shared/halftone-shader.js` — single source of truth for the brand halftone effect. Both `halftone-video` (homepage hero) and `product-features-primary` (Solutions deep-dive features) call `HalftoneShader.attach(canvas, options)` with their per-instance overrides. The shared module bakes the canonical Paper Hero-Teal preset (Cover, Hex, Inverted Off, 1%/120%/40%, #2C6F75, 20% grain) as defaults; consumers swap only what differs (front color, source type video/image, mode composite/overlay). `product-features-primary` is upgraded from a square-grid WebGL1 implementation (no grain, no contrast) to the canonical hex-grid WebGL2 algorithm — brings it onto Paper canon. Net: ~140 lines of shader code removed from each consumer; `STYLE_GUIDE.md` shader follow-up resolved.

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
- [x] `demo.html` `<h1>` promotion. (PR #33) Promoted the demo-form's existing title `<h2>` to `<h1>` inside `shared/components/demo-form/index.js` rather than adding a separate page-level H1 — the form's title IS the page's primary heading.
- [x] Stack-animation `prefers-reduced-motion`. (PR #33) `mount()` checks `matchMedia('(prefers-reduced-motion: reduce)')` and skips `setupTimeline()` (no GSAP, no ScrollTrigger pin, no scrub). CSS `@media reduce` rules collapse the 200vh pin window to a single static stage and hide the source panels so the Renoverse destination panel + callouts read as a static composition.
- [x] Halftone-video `prefers-reduced-motion`. (PR #33) `mount()` reads reduced-motion at the top, sets `video.autoplay = !reducedMotion`, skips the playback handlers + RAF tick loop, and renders the halftone effect once on `loadeddata` so the user sees a static halftone of the video's first frame — brand visual preserved without motion.

F2 #3 — heading-level audit on rendered pages:
- [x] Audited rendered heading outline on all 4 pages (page HTML + component-injected headings). Found one violation: demo-form's thank-you state used `<h3>` while the page `<h1>` "Book a Demo" stayed in the DOM after submit, making it a h1→h3 skip. Fixed in `shared/components/demo-form/index.js:358` (h3 → h2).

F2 #4 — empty-alt sweep:
- [x] Swept every `<img>` across HTML pages + component JS templates + test.html. **Clean** — every rendered `<img>` has descriptive non-empty alt text. Placeholder rows (e.g. card 4 of `product-features-cards-2x2`, row 4 of `product-feature-primary`) render a placeholder `<div>`, no `<img>`.

F2 #5 — automated audit (axe / Lighthouse / Pa11y):
- [x] Ran `pa11y@9.1.1 --standard WCAG2AA --threshold 0` on all 4 pages via local server. Raw output + summary in `notes/f2-audit/`. Findings collapsed to two AA-real issues (white-on-aqua text in `.btn--filled` + same Tailwind pattern in demo-form submit; aqua-on-white text in `.btn--white`) and 75 mock-UI false-positives inside the stack-animation scene.

F2 #7 — screen reader spot-check:
- [x] Operator-run VoiceOver walkthrough on macOS Safari, all four pages. Three findings, all fixed:
  - **Halftone hero video announced as "image".** The WebGL canvas was being picked up by VO. Fixed by setting `aria-hidden="true"` on the host element inside `halftone-video/index.js` `mount()` so every consumer is silent automatically.
  - **Stack-animation had no description for AT.** `aria-hidden` on the mock-UI scene left only the H2 "One workspace. Every detail." for SR users — they missed the "from many tools to one" narrative the animation conveys. Fixed by adding an `.sr-only` paragraph in the caption div with a description of what the animation depicts.
  - **Hero had no description for AT.** Same shape as above — H1 alone didn't convey the brand-visual context. Fixed by adding an `.sr-only` paragraph in `index.html` describing the top-down collaboration scene.
- Safari tab-order quirk surfaced (Safari excludes plain `<a>` from Tab unless `Settings → Advanced → "Press Tab to highlight each item"` is enabled). Not a markup bug — known browser default; SR users navigate via VO arrows + rotor anyway, and sighted-keyboard-only Safari users either know `Option+Tab` or have the setting on.

F2 #6 — fixes from #5 punch list:
- [x] `.btn--filled` rest+hover use `--ink` text on aqua / white (~9:1 / ~21:1). `.btn--white` rest uses `--teal` text on white (~5.1:1); hover swaps to teal-bg + white text (~5.5:1). `shared/button.css` updated; STYLE_GUIDE.md button-variant table updated to match.
- [x] Demo-form submit + decorative checkmark pucks went `text-white` → `text-ink` in `shared/components/demo-form/index.js`.
- [x] Stack-animation `#stackScene` and `#callouts` now `aria-hidden="true"`. The `<h2>` caption is a sibling of the scene (in `.caption`), so it stays accessible.
- [x] 36 mock-UI labels under 3:1 bumped to AA in `shared/components/stack-animation/index.css` + 3× inline-styled chevrons in `shared/components/stack-animation/index.js`. Labels already ≥3:1 left as-is to preserve mock-UI fidelity (option A).
- [x] **Re-verified.** Pa11y post-fix: solutions/about/demo = 0 findings; index = 40 (down from 76), all between 3.03:1 and 4.48:1, all inside the `aria-hidden` mock UI. Documented as a known pa11y false-positive (static analyzer doesn't honor aria-hidden) in `notes/f2-audit/SUMMARY.md`.

### F3 — Mobile polish

Walk every page top-to-bottom at the standard breakpoint set: **1440 / 1280 / 1024 / 820 / 768 portrait + 1024×768 landscape / 430 / 390 / 360**. Fix in component CSS (never page CSS). Every fix names its breakpoint.

Confirmed issues (from `notes/team-review-main-20260506-123533.md` + `notes/CR-RENOVERSE-MobileVideo-20260506-131237.md`):

- [x] **Stack-animation responsive rules.** (PR #42) `product-features-animation` (renamed from stack-animation) now hides orbital callouts and shortens the section to 130vh at the mobile breakpoint; the 5→1 source-panel converge animation still plays.
- [x] **Footer wordmark mobile aspect-ratio.** (PR #26) Footer logo width-driven sizing fixes the squash; covered alongside Round 3 #8.
- [x] **Demo page top-padding clearance.** (PR #44) `demo-form` top padding floors at 96px (= `--nav-height` 72px + ~24px breathing room) instead of 56px, so the eyebrow / H1 / third checklist bullet sit cleanly below the fixed nav at all widths. Form bottom padding unchanged (no nav clearance needed).
- [x] **Frosted-nav contrast over hero halftone-video.** (PR #44) `.site-nav.is-scrolled .nav-inner` and `.is-menu-open .nav-inner` background opacity bumped from `.08` → `.16` (matching `.btn--frosted:hover`). Same cream-tinted-glass recipe; the nav is always-engaged so it sits at the engaged-state opacity. Restores reliable 4.5:1 contrast independent of frame brightness.
- [x] **Breakpoint reconciliation to 820.** (PR #44) Every off-grid `860px` and `880px` `@media` rule normalized to `820px` (the canonical portrait-tablet boundary from the standard set): `product-features-animation`, `product-features-cards-2x2`, `product-features-card-3x1`, `product-features-primary`, `team-section`, `site-nav`, `site-footer`. `testimonial-card` was already at 820. Also `index.html` page-level `.stack-tail-intro` rule moved 860→820.
- [x] **Page-level mobile rules cleanup.** (PR #44) `index.html` had two off-grid page-level `@media` rules: `.stack-tail-intro` at 860 (now 820) and `.hero h1{font-size:48px}` at 960 (removed — `--fs-h1: clamp(48px, 7vw, 96px)` already floors at 48px and provides smoother fluid scaling without flattening the type scale at 820/768/430/390/360). `solutions.html` / `about.html` / `demo.html` had no page-level `@media` rules. The remaining `.stack-tail-intro` rule is small and homepage-specific; future polish could extract that bridge element to a component, but a pure-data layout flip at one breakpoint isn't worth a new component contract.

### F4 — Style finalization

- [x] **`STYLE_GUIDE.md` "Add a footer" section reconciled.** (PR #46) Old text described retired light/dark variants ("ink text" or "white text on `#0a0a0a`"); rewritten to document the actual single canonical footer — wave-gradient WebGL shader on `var(--beige)` paper backdrop with `var(--oxford-blue)` text site-wide, bottom-anchored 100vh stack, three-row content composition (newsletter / utility / brand). Explicit "don't reintroduce variants" guidance added.
- [x] **Token-only sweep across components.** (PR #46) Replaced literal `#fff`/`#FFFFFF` → `var(--white)` and `#222` → `var(--ink)` in `site-nav`, `site-footer`, `team-section`, `product-features-primary`, `product-features-cards-2x2`, `product-features-card-3x1`, `testimonial-card`. Fixed wrong scoped fallback hexes (`var(--ink, #0B1A2B)` → `var(--ink, #0a0a0a)` matching the actual token value; the stale `#0B1A2B` fallback was `--dark-oxford-blue`'s hex, not `--ink`'s — left over from before the brand-Phase-1 token rename) in `site-nav` and `demo-form`. Replaced literal `#5EC9B7` (in dropdown hover) → `var(--aqua)`. Sanctioned exceptions retained: rgba overlays for frosted glass / box-shadows / mask blacks, `#ece7e1` placeholder stripe textures, and the entire `product-features-animation` mock-UI palette (Excel green `#107c41`, AutoCAD dark `#2b2b2f`, etc. — these are intentionally faking real software UIs, not brand surfaces).
- [x] **Type-scale clamp audit.** (PR #46) Walked every component CSS + page CSS for `font-size` literals. All real headings/body copy use `--fs-h1` / `--fs-h2` / `--fs-h3` / `--fs-eyebrow` / `--fs-body` / `--fs-small` from `tokens.css`. Remaining inlined `font-size` values are scoped exceptions: `demo-form` 14px form-field text (Tailwind-driven form sizing; no `--fs-form` token added since it's a single use site), `product-features-card-3x1` 10px placeholder tag, and the `product-features-animation` mock-UI scale (7–13px deliberately small to read as miniature app chrome).
- [x] **Missing tokens audit.** (PR #46) No new tokens needed. All non-token color drift was either (a) replaceable with an existing token, or (b) a sanctioned single-component exception. The token list in `tokens.css` covers the brand surface area without gaps.

### F5 — Authoring docs (audience: non-technical teammates pasting into Claude.ai)

- [x] **`EDITING.md` — content-edit playbook.** (PR #47) Structured as: (1) decision tree at top — does the edit fit copy-only or escalate to a developer; (2) general workflow — 10-step lived loop from "find the section" to "commit the change"; (3) Quick Start prompt template — promoted to be the primary pattern, works for any open-ended edit; (4) sitemap — every page → section → file pointer + a 1-line snippet of the current copy, including which sections live on the page (`.html`) vs in a shared component (`.js`); (5) five example patterns — single-copy swap, JSON-array entry edit, JS-component-default edit, multi-place edit (SEO + nav), asset swap; (6) troubleshooting (snippet-not-full-file, stale sitemap, etc.) and "when to ask a developer". Reshape from a 14-recipe catalog (closed by definition) to a sitemap + workflow + few examples (covers any edit) was driven by F5 prompt-test results showing the catalog format misled teammates whose edits didn't fit a recipe.
- [x] **`README.md` rewrite.** (PR #47) Was stale (referenced deleted `feature-highlights` and `icp-carousel`, missing 4 of 10 components). Now a short pointer doc: editors → `EDITING.md`, developers/AI → `AGENTS.md`, brand questions → `STYLE_GUIDE.md`, priority list → `REVISIONS.md`. Includes the current 4-page list and 10-component map.
- [x] **Per-component `README.md` audit.** (PR #47) 7 components ship a `README.md` (`demo-form`, `product-features-animation`, `product-features-card-3x1`, `product-features-cards-2x2`, `product-features-primary`, `team-section`, `testimonial-card`); 3 don't by operator decision (`halftone-video`, `site-footer`, `site-nav` — confirmed at PR #31 close as "good as-is, don't need contract files"). Stale items fixed: `product-features-animation/README.md` (300vh → 200vh section height + caption tag from `<h1>...<span class="muted">` to `<h2>` per F2 a11y), `product-features-primary/README.md` (≤860px → ≤820px breakpoint per PR #44 + WebGL shader description updated to reference the shared `shared/halftone-shader.js` primitive per PR #45).

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
