# Renoverse Website — Agent Protocol

You are working on the Renoverse marketing site. Read the following docs in this order at the start of every session:

1. **`REVISIONS.md`** — current priority list. Top of the doc is the active work.
2. **`STYLE_GUIDE.md`** — colors, fonts, gradients, typography, button recipes, alignment rules. All styling decisions trace back here.
3. **`shared/components/`** — the component library. Every component ships `index.css` + `index.js` + `README.md` + `test.html` and mounts via `data-*` hooks.

---

## Sync discipline

- **Start of session:** `git fetch && git status` to confirm local `main` is in sync with `origin/main`. If behind, `git pull` before doing anything else. A stale working tree is the most common cause of "this used to work" bugs (e.g. tokens that exist on remote main but not locally).
- **After a PR merges:** immediately `git checkout main && git pull` so the next change starts from the merged state. Don't continue working on the merged feature branch.
- **Exception:** if the operator explicitly says "don't merge yet" (or the PR is intentionally open), stay on the branch and skip the post-merge pull.

## House rules

- **Tokens only.** No hex / rgb / font / spacing values outside `shared/tokens.css`. Single-component opaque-overlay exceptions are tolerated; flag any you have to introduce.
- **Components live in `shared/components/`.** Edits to existing components go in the component, not the page. New behavior → either extend the existing component or create a new one with the full contract.
- **"Match X" = same primitive parameterized**, not copy-paste. Two components doing the same thing with slightly different presets should be one component with props.
- **Operator picks names.** Flag bad/opaque/inconsistent names; don't rename unilaterally.
- **Breakpoint set:** `1440 / 1280 / 1024 / 820 / 768 portrait + 1024×768 landscape / 430 / 390 / 360`. Mobile fixes belong in component CSS, never page CSS. Every fix names its breakpoint.
- **Halftone shader canonical preset** (Paper Hero–Teal): Cover, Hex, Inverted Off, 1% / 120% / 40%, `#2C6F75`, 20% grain. Don't re-tune per asset.

---

## End-of-session protocol

Before wrapping any session that touched the site, run through this checklist:

### 1. Component changes
If any component was created or edited:
- The change must end the session inside `shared/components/<component>/`.
- Confirm the contract is intact: `index.css` + `index.js` + `README.md` + `test.html`. Backfill anything missing for components you touched.
- New behavior that doesn't fit the existing component → create a new component (with the full contract) rather than scattering page-local CSS / JS.

### 2. Style-guide conformance
Every code change is checked against `STYLE_GUIDE.md`.
- **Default: conform the change.** If a value drifts from the style guide, fix the change to match the guide.
- Updating the style guide *instead of* the change requires **explicit operator approval**. Surface it clearly: *"This change diverges from the style guide. I recommend updating STYLE_GUIDE.md to reflect [X] — approve?"*
- Never silently update `STYLE_GUIDE.md`. Every guide change must be flagged in the session.

### 3. Task closeout
- Each shipped item in `REVISIONS.md` is checked off (`- [x]`) with its **PR reference** (e.g. `(PR #23)`). Never leave a checked-off item without a PR ref — ambiguity breaks the audit trail.
- If status changed but the item didn't ship, update the description so the next session can pick up cleanly.
- If new follow-ups surfaced during the session, add them to `REVISIONS.md` under the right priority bucket before ending.
