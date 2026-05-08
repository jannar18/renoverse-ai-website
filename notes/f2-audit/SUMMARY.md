# F2 #5 — pa11y audit (WCAG2AA, all 4 pages)

Tool: `npx pa11y@latest --standard WCAG2AA --threshold 0`
Date: 2026-05-08, branch `main` @ 253878d
Server: local Python http.server, headless Chromium via Puppeteer.

Raw outputs: `pa11y-{index,solutions,about,demo}.json`.

---

## Headline

| Page | findings | real | mock-UI (stack-animation) |
|---|---|---|---|
| `index.html` | 76 | 1 | **75** |
| `solutions.html` | 1 | 1 | 0 |
| `about.html` | 1 | 1 | 0 |
| `demo.html` | 2 | 2 | 0 |

**All findings are WCAG 1.4.3 (color contrast).** No landmark, alt, label, or ARIA findings. (F2 #3 separately caught a heading-skip in the demo-form thank-you state — pa11y missed it because pa11y sees the static initial DOM only.)

---

## Real findings — 2 root issues, 5 occurrences

### 1. `.btn--filled.nav-cta` "Book a Demo" — 2.0:1, fails AA (need 4.5:1) and AA-large (need 3:1)

Site-wide: every page's nav has the filled aqua → white-text "Book a Demo" CTA.
Source: `shared/button.css:111-115` — `background: var(--aqua, #5EC9B7); color: #fff`.

White (#FFF) on `--aqua` (#5EC9B7) ≈ **2.0:1**. Pa11y suggests `#1a8573`.

Same root issue hits the demo-form submit button on `demo.html` (Tailwind `bg-aqua text-white`, line 359 in demo-form/index.js).

**Fix options:**
- (A) Swap `.btn--filled` background from `--aqua` to `--teal` (#2D6F75) → ~5.5:1 with white. Single token change in `shared/button.css`. Demo-form submit button needs the same swap (`bg-aqua` → custom class or inline style using `--teal`).
- (B) Introduce a new `--aqua-dark` token at ~#1a8573 (pa11y's recommendation) and re-point `.btn--filled` to it — preserves the "aqua" brand language without breaking contrast.
- (C) Keep aqua as a hover state, fill with teal at rest. Visually the most distinct from current.

**Operator decision required** — this changes the resting color of the most prominent CTA on the site.

### 2. (subsumed by #1 — demo-form submit is the same root cause)

---

## Mock-UI findings — `stack-animation` (75 of index.html's 76)

Every finding is inside `#stackScene` or `#callouts` — the animated stack of stylized HTML mock-ups depicting the product UI (Outlook inbox, RFI tracking sheet, Brookline decision log, version history, AI compose). Pa11y treats these as real UI text and flags every low-contrast label.

Distribution:
- `.label` ×13 @ 3.77:1
- `.star` ×10 @ **1.37:1** ← worst
- `.status-pill` ×8 @ 3.45:1
- `.v` ×4 @ 3.54:1
- `.priority` ×3 @ 2.03:1
- `.sheet-tab`, `.zoom`, `.vt`, `.group`, `.reply-line`, `.ai-arrow` ×3 each (range 1.92–4.48)
- `.formula`, `.ac-cmdline`, `.search-mini`, `.compose-at`, `.compose-input`, `.upload-pill`, `.respond-btn` etc. ×1 each

**Recommended fix path:**

1. **`aria-hidden="true"` on the stack-animation mock-UI scene.** The mock screens convey meaning ("here's what an inbox in our app looks like") via the H2 caption "One workspace. Every detail.", which already exists. Hiding the scene from AT is the right call — they're stylized graphics, not real interfaces.
2. **Bump the legitimately-illegible labels (<3:1) to ≥3:1.** Sighted low-vision users don't benefit from `aria-hidden`; the worst offenders (.star 1.37, .upload-pill / .reply-line / .respond-btn 1.92, .priority 2.03, .compose-* 2.04, .ai-arrow 2.1) read as noise. Anything already ≥3:1 stays as-is to preserve the "real product UI chrome" visual language.

Pa11y will still flag the 3:1–4.5:1 range after this — that's the visual-fidelity tradeoff the operator has historically accepted (mock UI looks real). Treat as known exclusion.

---

## F2 #6 — fixes applied

- [x] **A11y-real fix.** Resolved `.btn--filled` white-on-aqua 2:1. Operator picked: keep aqua fill, change text to `--ink`. Applied to:
  - `shared/button.css` — `.btn--filled` rest+hover use `--ink` text (~9:1 / ~21:1).
  - `shared/button.css` — `.btn--white` rest uses `--teal` text on white (~5.1:1); hover swaps to teal-bg + white text (~5.5:1). Same root issue (aqua-on-white was 2:1).
  - `shared/components/demo-form/index.js` — submit button `text-white` → `text-ink`, `hover:text-aqua` → `hover:text-ink`. Two decorative aqua-bg checkmark pucks also went `text-white` → `text-ink` for consistency.
- [x] **Mock-UI screen-reader fix.** Added `aria-hidden="true"` to `#stackScene` and `#callouts` in `shared/components/stack-animation/index.js`. The `<h2>` caption "One workspace. Every detail." sits in `.caption` (sibling, not descendant) and stays accessible to AT.
- [x] **Mock-UI worst-offender contrast bumps.** Bumped 36 labels from <3:1 to AA-compliant (pa11y's recommended values, kept inside the existing color hue). Files: `shared/components/stack-animation/index.css` (.star, .label, .priority.exp, .reply-line, .compose-at, .compose-input, .upload-pill, .respond-btn, .ai-arrow) + `shared/components/stack-animation/index.js` (3× inline `style="color:#fbbc04"` → `#977000`). Labels already ≥3:1 stayed as-is per option A.
- [x] **Heading-skip fix.** demo-form thank-you state `<h3>` → `<h2>` (`shared/components/demo-form/index.js:358`). Pre-fix, after submit, h1 ("Book a Demo") in the aside skipped to h3 in the success card.

## Post-fix pa11y re-run (`notes/f2-audit/post-fix/`)

| Page | before | after |
|---|---|---|
| `index.html` | 76 | **40** |
| `solutions.html` | 1 | **0** |
| `about.html` | 1 | **0** |
| `demo.html` | 2 | **0** |

The 40 remaining `index.html` findings are **all between 3.03:1 and 4.48:1** — exclusively inside `aria-hidden="true"` mock-UI in stack-animation. Per option A, labels already ≥3:1 stay as-is to preserve the "real product UI chrome" look.

**Documented exception.** The stack-animation mock UI is a stylized graphic depicting product screens. It is `aria-hidden="true"` so screen readers skip it; sighted-low-vision users get ≥3:1 on every label (WCAG 1.4.11 Non-text Contrast). Pa11y will continue to flag the 40 mock-UI labels because static analyzers don't honor aria-hidden when checking text contrast — known false-positive for this site.

## STYLE_GUIDE.md updates

- Button-variant table + "I need a new button" recipe re-described with the new color pairings.
- Added a "WCAG 2.1 AA pairings" line documenting why white-on-aqua and aqua-on-white can't be used and what the compliant pairings (`--ink` on `--aqua`, `--teal` on white) are.
