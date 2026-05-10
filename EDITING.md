# Editing the Renoverse site

The sitemap and recipe reference for content edits. Use this when you know the workflow and just need to find which file holds which copy.

**First time editing the site?** Start with [`HANDOFF.md`](./HANDOFF.md) — it walks you through installing Claude Desktop, getting repo access, and shipping your first edit end-to-end. Come back here once you're set up.

For developers and AI agents working in the repo, see [`AGENTS.md`](./AGENTS.md) and [`DESIGN.md`](./DESIGN.md).

---

## Does this doc cover your change?

**Yes — this doc covers it** if you're:
- Replacing existing copy (a headline, paragraph, label, bullet, button text, alt text, SEO title)
- Swapping an existing asset (an image, the hero video, the social-share preview)
- Updating data on an existing section (testimonial attribution, founder name/role, nav link labels, footer copyright)

**No — ping a developer** if you're:
- Adding a section, component, or page that doesn't exist on the site yet
- Removing or reordering existing sections
- Changing layout, column counts, or which side an image sits on
- Changing brand colors, fonts, or spacing tokens
- Connecting a form to a different backend (currently HubSpot)
- Setting up A/B tests

When unsure, paste your request into Claude.ai with the whole repo attached and ask: *"Is this a content edit I can do, or do I need a developer?"* Claude will tell you.

---

## The general workflow

Any content edit on this site follows the same shape. Once you've done it once, every other edit is the same loop.

1. **Decide what you want to change.** A specific headline, a sentence, a card, a logo — something concrete you can name.
2. **Find the section in the [Sitemap](#sitemap--where-every-piece-of-copy-lives) below.** Note the file path it points to. Some sections live on the page (`.html`); others live in a shared component (`.js`).
3. **Open [Claude.ai](https://claude.ai)** in your browser and start a new chat.
4. **Drag the file into the chat.** From your Finder/Explorer, drop the file referenced in the sitemap. (Drag-drop is the most reliable way; pasting works for short files but can get truncated.)
5. **Paste the [Quick Start prompt](#quick-start-prompt-template) below**, fill in your change in plain words, and send.
6. **Read Claude's response.** It should give you back the full file with your change applied. If it gives only a snippet, reply *"Show me the full updated file."*
7. **Copy the updated file content** out of Claude's response and **overwrite the original file** in the repo. Replace the entire file — don't try to merge by hand.
8. **Preview it.** For pages that don't load shared components (most static pages work), double-click the `.html` file to open it in your browser. For pages with components, run `python3 -m http.server 8000` from the repo root and visit `localhost:8000`. Hard-refresh (Cmd-Shift-R / Ctrl-Shift-R) to bypass cache.
9. **Confirm the change reads right.** Does the new text appear where you expected? Does the rest of the page look unchanged?
10. **Commit and push** (or hand the updated file to a developer to commit). Until you commit, the change only exists on your computer.

If step 9 fails, go back to step 5 and tell Claude what's wrong — usually one round of correction is enough.

---

## Quick Start prompt template

When in doubt, this works for any content edit on the site:

> I want to update the Renoverse site. The change I want is: **[describe the change in plain words — e.g. "change the homepage subhead to 'Renoverse keeps the project moving when the inbox can't.'"]**.
>
> The relevant file is attached. Make only this change — don't touch anything else. Show me the full updated file.

For changes that span multiple files (rare — see the [Sitemap](#sitemap--where-every-piece-of-copy-lives) for which sections need this), attach all relevant files and tell Claude what each one is.

The [Example patterns](#example-patterns) section below shows variations of this template for the most common shapes of edit.

---

## Sitemap — where every piece of copy lives

Every section of every page is listed here with its file pointer and a snippet of the current copy. Find the section you want to change → note the file → use the Quick Start template above with that file attached.

> **Note on shared components.** Some sections are rendered by shared components (`shared/components/...`). When the *copy* lives on the page (passed in via `data-*` attributes), edit the page. When the copy lives inside the component file itself (defaults), edit the component. Each entry below tells you which.

### Homepage (`index.html`)

- **Hero** — `<section class="hero">` in `index.html`
  - h1: *"Drawings, decisions, and your team — all in one place."*
  - subhead: *"AI-native communication platform for architecture project collaboration."*
  - background: hero video (see [Asset swaps](#asset-swaps) to replace)

- **Animation caption** — between hero and 2x2 grid; copy lives in `shared/components/product-features-animation/index.js`
  - h2: *"One workspace. Every detail."*
  - *This is in a `.js` file, not the page. In Claude.ai, drag the `.js` file in.*

- **Stack-tail intro** — `<section class="stack-tail-intro">` in `index.html`
  - 2 paragraphs of body copy directly above the 2x2 grid.

- **Product feature highlights 2x2** — `<div data-product-features-cards data-cols="2">` in `index.html`
  - h2 (above the grid): *"Built for firms managing complex processes and workflows."*
  - 4 cards in `data-items='[...]'`:
    1. *Email Triage & Auto-Capture*
    2. *Decision Log & Audit Trail*
    3. *Intelligence Layer on Existing Stack*
    4. *Controlled Stakeholder Access*
  - CTA below the grid: *"See all features"* → `solutions.html`

- **Testimonial** — `<div data-testimonial-card>` in `index.html`
  - Currently: Sabrina Vogel, Owner & Principal, SLC Architect.
  - Edit `data-quote`, `data-name`, `data-role`, `data-company`, `data-logo`.

- **Team teaser** — `<div data-team-section>` in `index.html`
  - Component reads `data-names`, `data-role`, `data-image` from the page (default to empty / suppressed when absent).
  - Has `data-link-href="about.html"` + `data-link-label="Learn more"` so this teaser links to the About page.

### Solutions page (`solutions.html`)

- **Page hero** — `<section class="page-hero">` in `solutions.html`
  - h1: *"Design more.<br>Chase less."*
  - subhead: *"Goodbye, hundreds of email threads, decision gaps, and endless admin..."*

- **Product features primary (4 deep-dive rows)** — `<div data-product-features-primary>` in `solutions.html`
  - 4 rows in `data-items='[...]'`, each with eyebrow + title + 3 bullets (label + body):
    1. *Capture* — Email Triage & Auto-Capture
    2. *Track* — Decision Log & Audit Trail
    3. *Connect* — Intelligence Layer on Existing Stack
    4. *Control* — Controlled Stakeholder Access
  - Each row's `image` field points to an asset in `assets/`.

- **Product feature highlights 3x1** — `<div data-product-features-cards data-cols="3">` in `solutions.html`
  - Heading: *"And the rest comes built-in."*
  - 3 cards in `data-items='[...]'`: Frictionless collaboration, Version control, AI assistant.

### About page (`about.html`)

- **Page hero** — `<section class="page-hero">` in `about.html`
  - h1: *"Coordinating Complexity.<br>Capturing Accountability."*
  - subhead: *"Renoverse gives you a single source of truth..."*

- **Backstory** — `<section class="backstory">` in `about.html`
  - 2 blocks, each with an `<h2>` label and 1–2 `<p>` paragraphs:
    1. *"Our approach"* — body is currently lorem ipsum (replace before launch)
    2. *"Our values"* — body is currently lorem ipsum (replace before launch)

- **Meet the team** — `<div data-team-section>` in `about.html`
  - Component reads `data-eyebrow`, `data-names`, `data-role`, `data-image`.
  - Currently `<div data-team-section data-theme="paper" data-eyebrow="Meet the team">` — `data-names` and `data-role` are not yet set, so the names line is suppressed. Add them when ready.

### Demo page (`demo.html`)

- **Demo form** — `<div data-demo-form>` in `demo.html`
  - Page mount carries no overrides, so the rendered copy comes from the **defaults** inside `shared/components/demo-form/index.js`.
  - Defaults (edit these to change what users see):
    - eyebrow: *"Book a demo"*
    - title: *"Book a Demo"*
    - lead: *"Walk through the studio with us..."*
    - 3 checklist bullets: *"30-minute walk-through..."*, *"Bring a real drawing..."*, *"Pricing & rollout plan..."*
  - The form fields and submit logic are wired to HubSpot — copy is editable, plumbing isn't.

### Site-wide (every page)

- **Top navigation** — `<nav data-site-nav>` mount; copy in `shared/components/site-nav/index.js`
  - 3 links + 1 CTA. **Two blocks to keep in sync:** `.nav-links` (desktop) and `.nav-sheet__links` (mobile menu) — both have the same 3 links and must match.
  - Currently: Home → `index.html`, Solutions → `solutions.html`, About → `about.html`. CTA: *"Book a demo"* → `demo.html`.

- **Footer** — `<footer data-site-footer>` mount; copy in `shared/components/site-footer/index.js`
  - Currently: brand mark + *"© 2026 Renoverse AI"*.

- **SEO + social metadata** — `<head>` of each page (`index.html`, `solutions.html`, `about.html`, `demo.html`)
  - Per page: `<title>`, `<meta name="description">`, plus matching `og:title`, `og:description`, `twitter:title`, `twitter:description`.
  - **Don't edit:** `og:url`, `og:image`, `twitter:image` — those are absolute URLs we'll update once at domain cutover.

---

## Example patterns

Concrete examples of the most common shapes of edit. Each shows the prompt to paste into Claude.ai and what to look for in the preview to confirm. Adapt the wording to your change.

### Pattern A — Replace a single piece of copy

The simplest case: one headline, one paragraph, one label.

> In `index.html`, change the `<h1>` inside `<section class="hero">` to: **"[your new headline]"**. Keep the `<br>` if your headline is two lines; remove it if it's one line.

**Verify:** Refresh the homepage. The big italic Cormorant headline at the top should read your new text.

### Pattern B — Edit one entry inside a JSON-array data attribute

When a section has multiple cards/rows in a single `data-items` attribute (product-feature cards, deep-dive feature rows). You count entries from the top.

> In `index.html`, find `<div data-product-features-cards data-cols="2" ...>`. The `data-items='[...]'` attribute is a JSON array, one entry per card. Update **card #2's** `title` and `body` to:
> - title: **"[new title]"**
> - body: **"[new body, 1–2 sentences]"**
>
> Leave the other cards and the image/alt fields untouched.

**Verify:** Refresh the homepage and scroll to the warm-paper 2x2 grid. Card #2 (top-right) should show your new title and body.

### Pattern C — Edit copy that lives inside a `.js` component file

Some copy isn't in the page — it's in a shared component. The animation caption, the demo form defaults, the nav links, the footer copyright. Drag the `.js` file into Claude.ai instead of the `.html` page.

> In `shared/components/site-footer/index.js`, change the copyright line to: **"© 2026 [your text]"**.

**Verify:** Refresh any page and scroll to the bottom. The footer should show your new line.

### Pattern D — Edit something that lives in two places at once

Some edits need matching changes in two spots — the SEO metadata (title appears in `<title>`, `og:title`, and `twitter:title`) and the nav links (desktop and mobile menus). Tell Claude both up front so it doesn't update one and miss the other.

> In `index.html`, update the SEO metadata. **Update all four matching tags:** `<title>`, `og:title`, `twitter:title` (these should match each other), and `<meta name="description">`, `og:description`, `twitter:description` (these should match each other).
> - title: **"[new title]"**
> - description: **"[new description, around 155 characters]"**
>
> Don't change `og:image`, `twitter:image`, or `og:url` — those are absolute URLs we update at domain cutover.

> In `shared/components/site-nav/index.js`, find the nav-link entries. **Update both blocks** — `.nav-links` (the desktop menu) and `.nav-sheet__links` (the mobile menu) — so they match. Change them to: **"[Label 1]" → "[href 1]"**, **"[Label 2]" → "[href 2]"**, **"[Label 3]" → "[href 3]"**.

**Verify:** For SEO — refresh the page; check the browser tab title. Social-share previews need a staging push to test. For nav — refresh any page and confirm both the top nav and the mobile hamburger menu show the new links.

### Pattern E — Asset swap (image / video / social-share preview)

Replacing an asset is half-Claude, half-file-system: you put the new file in `assets/` and either point the data attribute at it (most cases) or replace the existing file by name.

**Replace a feature image** (e.g. one of the product-feature cards):
1. Place your new image (PNG / AVIF / WebP) in `assets/`.
2. In Claude.ai, attach the relevant page (e.g. `index.html`) and prompt: *"In the `data-items` JSON for `<div data-product-features-cards data-cols="2">`, change card #2's `image` field to `assets/[your-new-filename]`."*
3. Refresh the page.

**Replace the homepage hero video** (`assets/hero.mp4`):
1. Place your new MP4 in `assets/` (~1080p, no audio, ≤30 seconds, looped-friendly).
2. In `index.html`, find `<div data-halftone-video data-src="assets/hero.mp4" ...>` and change `data-src` to your new file.
3. Refresh the homepage. *Note: the video plays through the brand's halftone shader — the dotted-teal look is automatic; you don't need to render it yourself.*

**Replace the social-share preview** (`assets/og-card.png`):
1. Render a new 1200×630 PNG. The current source is `assets/og-card.html` — open it in a browser, screenshot at 1200×630.
2. Save it as `assets/og-card.png`, replacing the existing file.
3. No code changes needed — every page already references this filename.

---

## Troubleshooting

**"Claude returned a snippet, not the full file."**
Reply: *"Show me the full updated file."* For long files, you may need: *"Output the complete file in chunks of 200 lines, and I'll paste them together."*

**"I don't see my change in the browser."**
Hard-refresh (Cmd-Shift-R / Ctrl-Shift-R). Confirm you saved the file and that you're previewing the right page. If you used `python3 -m http.server`, restart it.

**"The recipe references something that isn't in my file."**
The doc may be stale. Tell Claude: *"The sitemap says I should find `[X]` but my file shows `[what you actually see]`. What changed?"* Claude will figure out the difference. After you ship, ping a developer to update the sitemap.

**"My change spans more than one place — I'm not sure I got them all."**
Re-attach the file(s) and ask: *"Did this change land everywhere it needed to? Are there any other places in this file that reference the old text?"*

**"Claude changed something I didn't ask it to."**
Hit reset. Reply: *"Undo that. Make only the original change, don't modify anything else."* Or close the chat, start a new one, and re-attach a fresh copy of the file.

**"I want to preview but the page looks broken when I open the `.html` file directly."**
Most pages work via double-click, but pages that load shared components need a real server. Run `python3 -m http.server 8000` from the repo root, then open `localhost:8000` in your browser.

---

## When to ask a developer

Some changes need engineering. Don't try these via Claude.ai content edits — message a developer instead:

- **New page** (e.g. `pricing.html`) — needs nav wiring, layout decisions, SEO scaffolding.
- **New section that doesn't exist anywhere on the site yet** — needs a new component.
- **Removing or reordering sections** — affects the page's narrative structure.
- **Layout changes** — column counts, image side switching, section width — these are design decisions.
- **Brand changes** — palette, fonts, spacing — these are tokens in `shared/tokens.css`. Changing them ripples across every page.
- **Form backend** — the demo form and newsletter both post to HubSpot. Wiring a different provider is a developer task.
- **A/B testing** — the site has no A/B framework today.

If unsure, paste your request to Claude.ai with the whole repo attached and ask *"is this a content edit I can do, or do I need a developer?"* Claude will tell you.
