# Renoverse Website — Agent Protocol

You are working on the Renoverse marketing site. Read the following docs in this order at the start of every session:

1. **`REVISIONS.md`** — current priority list. Top of the doc is the active work.
2. **`DESIGN.md`** — the canonical design system. Tokens (YAML frontmatter), brand rationale, section signatures, common requests, do's and don'ts, reference compositions. All styling decisions trace back here.
3. **`shared/components/`** — the component library. Most components ship the full contract — `index.css` + `index.js` + `README.md` + `test.html` — and mount via `data-*` hooks. Three components ship `index.css` + `index.js` only by operator decision (`halftone-video`, `site-footer`, `site-nav`); see the end-of-session "Component changes" rule below for when this waiver applies.

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

## DESIGN.md propagation rule

`DESIGN.md` is the source of truth for tokens. `shared/tokens.css` is a regenerated mirror — it exists because browsers don't read markdown.

**Every edit to a token in `DESIGN.md` MUST be mirrored to `shared/tokens.css` in the same session.** This is non-negotiable. The propagation is done in-context by the editing agent (you), using the deterministic mapping rules in `DESIGN.md` § Maintenance.

Workflow when editing tokens:
1. Edit the token in `DESIGN.md` YAML frontmatter.
2. Look up the corresponding `--token` in `DESIGN.md` § Maintenance → "Mapping rules — YAML → tokens.css".
3. Update `shared/tokens.css` to match.
4. Commit both files together. Never commit a `DESIGN.md` token change without the matching `tokens.css` update.

If you spot drift (a `tokens.css` value that disagrees with `DESIGN.md`), fix it: `DESIGN.md` is canonical.

This works in every Claude surface — Claude Code, Claude Desktop, claude.ai web — because all of them can read and write files. No build script is required.

---

## End-of-session protocol

Before wrapping any session that touched the site, run through this checklist:

### 1. Component changes
If any component was created or edited:
- The change must end the session inside `shared/components/<component>/`.
- Confirm the contract is intact: `index.css` + `index.js` + `README.md` + `test.html`. Backfill anything missing for components you touched.
- **Waiver**: `halftone-video`, `site-footer`, and `site-nav` ship `index.css` + `index.js` only (operator decision, PR #31). Don't add a `README.md` / `test.html` to those three on a touch. New components default to the full contract.
- New behavior that doesn't fit the existing component → create a new component (with the full contract) rather than scattering page-local CSS / JS.

### 2. DESIGN.md conformance
Every code change is checked against `DESIGN.md`.
- **Default: conform the change.** If a value drifts from `DESIGN.md`, fix the change to match.
- Updating `DESIGN.md` *instead of* the change requires **explicit operator approval**. Surface it clearly: *"This change diverges from `DESIGN.md`. I recommend updating [section] to reflect [X] — approve?"*
- Never silently update `DESIGN.md`. Every change must be flagged in the session.
- If the change is a token value: edit `DESIGN.md` YAML first, then propagate to `shared/tokens.css` per the mapping rules. Both files committed together.

### 3. Task closeout
- Each shipped item in `REVISIONS.md` is checked off (`- [x]`) with its **PR reference** (e.g. `(PR #23)`). Never leave a checked-off item without a PR ref — ambiguity breaks the audit trail.
- If status changed but the item didn't ship, update the description so the next session can pick up cleanly.
- If new follow-ups surfaced during the session, add them to `REVISIONS.md` under the right priority bucket before ending.

---

## Legacy references to STYLE_GUIDE.md

`STYLE_GUIDE.md` was deleted on 2026-05-09; its content was translated into `DESIGN.md`. Some component CSS / JS comments and HTML page comments still reference "STYLE_GUIDE Part X" or "per STYLE_GUIDE" — section mapping for when you encounter them:

- **STYLE_GUIDE Part I** ("Section anatomy & common requests") → `DESIGN.md` § Section Anatomy + § Common Requests
- **STYLE_GUIDE Part II** ("Reference layer" — type scale, color tokens, gradient tokens, effects kit, button variants, layout tokens, a11y primitives) → `DESIGN.md` § Colors / Typography / Layout / Components
- **STYLE_GUIDE Part III** ("Things Claude pushes back on") → `DESIGN.md` § Do's and Don'ts
- **STYLE_GUIDE Part IV** ("Reference compositions") → `DESIGN.md` § Reference Compositions

When you touch a file with a legacy `STYLE_GUIDE` reference, update it to point at `DESIGN.md` opportunistically. Don't do a global rewrite session unless the operator asks for one.
