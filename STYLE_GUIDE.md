# Renoverse Style Guide

This guide is written for **Claude**, to be referenced whenever someone asks for new work on the Renoverse site. The audience speaking to Claude is non-technical — they'll say "make a new section like the carousel" or "I need a testimonial" or "add a button" — and this guide is how Claude translates those requests into the right tokens, utility classes, and components so every new piece matches the rest of the site automatically.

**Source-of-truth files:**
- [`shared/tokens.css`](./shared/tokens.css) — all colors, type, spacing, gradients
- [`shared/effects.css`](./shared/effects.css) — surface treatments (grain, dither, halftone bloom, gradients) as utility classes
- [`shared/button.css`](./shared/button.css) — button variants
- [`shared/components/icp-carousel/`](./shared/components/icp-carousel/) — **the reference composition** for the brand's full effect stack

**About "Phase X" references:** this guide and `tokens.css` mention things like "Phase 1," "Phase 4," "Phase 8." Those refer to the phased work plan in [`PLAN.md`](./PLAN.md) — the 9-phase roadmap for cleaning up the site against this guide. When a recipe says "Phase 4 target" or "in-card variant is Phase 8," it means *the rule is correct now but the cleanup hasn't shipped yet*. Don't propagate the live page's pre-cleanup state forward.

---

## Quick navigation

**For a non-technical reader briefing Claude:** jump to the request that matches what you want to add. If your request isn't listed here, the closest one will route you to the right pattern.

- **What kind of section is this?** → [Section signatures](#section-signatures-the-primary-mental-model) (Quiet, Imagery, Spotlight, Editorial)
- **Common things to add:**
  - [Make a new highlight section like the ICP carousel](#make-a-new-section-like-the-icp-carousel--add-a-new-highlight-section)
  - [Add a button](#i-need-a-new-button)
  - [Add a testimonial / customer quote](#add-a-testimonial--customer-quote)
  - [Add a hero (with video)](#add-a-hero-video-to-a-new-page--add-a-hero-like-the-homepage)
  - [Add a new page](#add-a-new-page)
  - [Add a features section (six variations)](#add-a-feature-highlights-section--add-a-features-section--six-variations)
  - [Add a photo or SVG illustration](#add-a-photo-or-svg-illustration)
  - [Add a stats strip / proof section](#add-a-stats-strip--show-our-numbers--add-a-proof-section)
  - [Add a final CTA before the footer](#add-a-final-cta-before-the-footer--add-a-closing-call-to-action)
  - [Add an editorial closer (italic line at end of section)](#add-an-editorial-closer--add-a-closing-italic-line-at-the-end-of-a-section)
  - [Add typology cards (3-up editorial cards with photos)](#add-typology-cards--add-a-3-up-editorial-card-grid-with-photos)
  - [Add a frosted-glass caption](#add-a-frosted-glass-caption--add-a-caption-over-a-photo)
  - [Wrap the bottom of a page in one warm zone](#wrap-multiple-sections-in-one-shared-paper-backdrop--make-the-bottom-of-the-page-feel-like-one-warm-zone)
  - [Add a footer (light or dark)](#add-a-footer--add-the-page-footer)
  - [Add a newsletter signup form](#add-a-newsletter-signup--add-an-inline-email-signup)
  - [Add a product-feature scroll moment](#add-a-product-feature-scroll-moment--add-something-like-the-stack-animation)
  - [Add navigation](#add-navigation--change-the-nav)
- **Style requests:**
  - [Use a specific gradient (dark teal, light azure, paper, etc.)](#use-the-dark-teal-gradient--use-the-light-azure-gradient--use-the-paper-gradient--etc)
  - [Use a new color](#use-a-new-color--add-a-new-accent)
  - [Change a heading size](#make-this-heading-bigger--smaller--different)
  - [Center copy in a section](#make-this-section-centered--center-the-copy)
- **Reference (when implementing):** [Part II — Reference layer](#part-ii--reference-layer) (type scale, color tokens, gradient table, effects kit, button variants, layout tokens, a11y primitives)
- **What Claude pushes back on:** [Part III](#part-iii--things-claude-pushes-back-on)
- **Mirror examples (when in doubt, copy these):** [Part IV — Reference compositions](#part-iv--reference-compositions)
- **Known drift (cleanup work, Phase 4):** [Drift list](#known-drift-to-clean-up-later-phase-4)

---

## Important: current state vs. intended state

This guide describes the **intended end-state** of the site — the rules new work should follow. Some rules are not yet reflected on the live `index.html` and `demo.html` because the relevant cleanup is queued in [`PLAN.md`](./PLAN.md). When you see a recipe or rule, treat it as authoritative — *don't* copy patterns from the live pages that contradict it. Specifically:

| Rule (intended state) | Live-page state today | Cleanup phase |
|---|---|---|
| Every page has a `skip-link` as the first focusable element + `id="main"` on the main content target | Neither page has either | Phase 1 |
| Sticky nav with backdrop blur over hero + pinned scrolls | Currently absolute-positioned | Phase 1 |
| Body copy is left-aligned; centered multi-line copy is push-back-worthy | `.intro` and `.typology .head` in `index.html` are still centered | Phase 4 |
| Components reference `--fs-*` and `--ink` tokens, not local copies | `index.html`/`demo.html` `:root` redeclare `--ink` as `#0a0a0a`; hero `h1`/`h2` hand-author sizes; `feature-highlights` and `demo-form` use local `--fh-*` / `--df-*` namespaces | Phase 4 |

**Rule of thumb:** when a non-technical user asks for new work, this guide is the source of truth. When the live pages disagree with the guide, the live pages are drift, not precedent. Don't propagate drift forward.

---

## Part I — Section anatomy & common requests

### Section signatures (the primary mental model)

Every section on the Renoverse site is built from a small, fixed kit of layers. **Every section has a paper background (a gradient) and grain.** That's the baseline — non-negotiable. The brand reads as a coherent printed editorial because every surface, no matter where, has those two layers.

On top of the baseline, there are two **optional layers**: a dithered SVG/photo, and a halftone-dot bloom. The combinations of those optional layers form four **section signatures** — named compositions that you reach for as one named thing. When someone describes the *feeling* they want, map it to a signature first; the gradient choice (which dark/light variant) is then a separate axis of color lean.

| Signature | Gradient | Grain | Dithered art | Halftone bloom | When to reach for it |
|---|---|---|---|---|---|
| **Quiet** | ✓ | ✓ | — | — | Most sections default here. Feature rows, intros, demo form, footer. Calm, content-density-first. |
| **Imagery** | ✓ | ✓ | ✓ | — | The section has supporting visuals (a project photo, an architectural illustration). The dither is what makes those visuals brand-consistent. |
| **Spotlight** | ✓ | ✓ | — | ✓ | "This is a moment." Atmospheric weight without imagery — the bloom under a heading or CTA. Great for text-only testimonials, important callouts. |
| **Editorial** | ✓ | ✓ | ✓ | ✓ | The full carousel signature. Used when a section is *both* a moment and has imagery. The most weighted, most visually loud signature — use sparingly. |

**How to use this:**

1. Pick the signature based on what the section is (see "When to reach for it" above).
2. Pick a gradient — dark for weighted/editorial sections, light for breathable ones (see the gradient request mapping below).
3. Pick a grain tint — `.fx-grain--warm` over dark gradients, `.fx-grain--ink` over light gradients.
4. Add the optional layers if the signature calls for them — `.fx-dither.fx-dither--photo` on imagery, `.fx-halftone-bloom` for spotlight, both for editorial.
5. Wrap the host in `position: relative; isolation: isolate; overflow: hidden;` so the layers stay scoped.

**Reference compositions for each signature:**

| Signature | Where it lives in the codebase today |
|---|---|
| Quiet | feature-highlights row, intro section *(demo-form is intended Quiet but currently bypasses the kit — see drift list)* |
| Imagery | (no live mirror yet — see code skeleton below) |
| Spotlight | the homepage `.testimonial-section` (gradient + grain) |
| Editorial | the ICP carousel panels |

If someone asks for a section type that doesn't fit one of these signatures, **push back** and ask which signature they're imagining. Don't invent a fifth — the constraint is what keeps the brand coherent.

#### Imagery signature — code skeleton

Until a live mirror exists, build Imagery sections from this skeleton. It's the Editorial signature minus the halftone bloom — Editorial without the atmospheric weight.

```html
<section class="imagery-section">
  <div class="imagery-photo" style="background-image: url(...);"></div>
  <div class="imagery-grain"></div>
  <div class="imagery-content">
    <p class="eyebrow">Eyebrow</p>
    <h2>Section heading.</h2>
    <p>Body paragraph that introduces the section.</p>
    <p>Body copy continues here, left-aligned.</p>
  </div>
</section>
```

```css
.imagery-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--grad-dark-oxford-blue-teal-cream); /* or any other vertical gradient */
  padding: var(--section-y) 0;
  color: #fff;
}
.imagery-photo {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  /* dither + carousel pre-mask filter */
  filter: contrast(1.05) brightness(0.95) saturate(0.3);
  -webkit-mask-image: radial-gradient(circle, #000 0.5px, transparent 1.6px);
          mask-image: radial-gradient(circle, #000 0.5px, transparent 1.6px);
  -webkit-mask-size: 4px 4px;
          mask-size: 4px 4px;
  -webkit-mask-repeat: repeat;
          mask-repeat: repeat;
  mix-blend-mode: multiply;
  opacity: 0.05; /* tune up to ~0.18 over flat color */
}
.imagery-grain { /* same as .fx-grain--warm — drop in via class instead */ }
.imagery-content {
  position: relative; z-index: 1;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

In practice, replace the inline mask CSS with `.fx-dither.fx-dither--photo` on the photo element and `.fx-grain--warm` on the grain element. The skeleton spells it out so you can see the layer order; the kit utilities are the canonical implementation.

---

### Common requests, translated

For each request below: what the human probably means, which signature it is, and what to mirror.

### "Make a new section like the ICP carousel" / "Add a new highlight section"

This is the **Editorial signature** — the full layer stack. The carousel is the reference. Mirror its layer stack:

1. **Host element** — `position: relative; isolation: isolate; overflow: hidden;` so blends and masks don't leak.
2. **Base gradient** — one of the three **dark vertical gradients** (`.fx-grad-dark-oxford-blue-teal-cream`, `.fx-grad-dark-oxford-blue-azure-ice`, `.fx-grad-dark-oxford-blue-cool-blue-cream`). All three go dark-oxford-blue → accent → tint, top-down — that vertical movement is what makes panels feel like one family.
3. **Dithered photo** — positioned `<div>` with the photo as `background-image`, classes `.fx-dither.fx-dither--photo`. Tune opacity per surface (~0.05 over saturated gradients, up to ~0.18 over flat color).
4. **Halftone bloom** — `.fx-halftone-bloom` as a positioned child to draw the eye to the heading or CTA. Override `--fx-bloom-mask` to move the focal point if needed.
5. **Paper grain** — `.fx-grain--warm` as a positioned child (warm tint pairs with dark/saturated surfaces).
6. **Content** — JetBrains Mono eyebrow above, **Poppins H3** (section header), optional Cormorant italic H2 above or beside it for an editorial moment, Poppins body, `.btn .btn--filled` CTA.

Don't re-derive the gradient stops, dither parameters, or grain SVG. The kit *is* those values.

If the request is for a "highlight section" without imagery, drop layer 3 — that's the **Spotlight signature** instead.

### "I need a new button"

Default to `.btn .btn--filled` — azure rectangle, white text, four corner ticks. This is the brand's primary CTA voice (homepage final CTA, hero CTA, footer Subscribe).

| Where it sits | Variant | Notes |
|---|---|---|
| Primary CTA on any light surface | `.btn .btn--filled` | Default. Always include the four `<span class="tk tl/tr/br/bl">` corner ticks. Reserve 24px clearance around it (the ticks animate outward on hover). |
| Over a photo / dark surface (e.g. nav over hero, ICP carousel CTA) | `.btn .btn--frosted` | Frosted glass + grain. Used on the carousel CTAs and the nav button over the hero video — anywhere the background is dark or media. |
| Secondary action on a light/paper surface | `.btn .btn--white` | Azure outline + text on white fill, hover swaps to filled azure. |
| Inside a card or form | `.btn .btn--filled` without `.tk` corner spans | The in-card variant — same azure fill, white text, mono uppercase, square corners, just no ticks. The demo-form (`shared/components/demo-form/`) ships this as Tailwind utilities (the form auto-loads Tailwind into hosts that may not include `button.css`); the visual recipe matches `.btn--filled` exactly. |

Never invent a new button silhouette. If a request implies one, push back and ask which existing variant fits.

### "Add a testimonial / customer quote"

A testimonial is most often the **Spotlight signature** — gradient + grain + halftone bloom — when it's text-only. If the testimonial has a supporting project photo from the customer, upgrade it to **Editorial** (add the dithered photo layer). Either way, it's the same vocabulary as the carousel; pick the signature based on whether you have imagery.

Mirror `.testimonial-section` in `index.html`. The recipe:

**Card host** — `position: relative; isolation: isolate; overflow: hidden;` with rounded corners (~14px).

**Layers, bottom → top:**
1. **Base gradient** — any of the three **dark vertical gradients** (`.fx-grad-dark-oxford-blue-teal-cream` is the conventional default; pick the variant that matches the page's color lean). Don't introduce a new gradient just for the testimonial.
2. **Dithered photo (Editorial only)** — if the testimonial has imagery, positioned `<div>` with the photo as `background-image`, using `.fx-dither.fx-dither--photo`. Keep opacity low (~0.05–0.10).
3. **Halftone bloom** — `.fx-halftone-bloom`, faded around the heading or attribution.
4. **Paper grain** — `.fx-grain--warm`.
5. **Content** — left-aligned, on top of all overlays:
   - Customer logo top-left (filtered to white if needed), max ~48px tall.
   - Blockquote in Poppins regular at Body size, white, max-width ~42ch.
   - Attribution at the bottom: name in Poppins 600 white, role/company in Poppins 400 white at Small size (~13px). Hierarchy from size + weight, not opacity.

### "Add a hero video to a new page" / "Add a hero like the homepage"

The homepage hero uses the WebGL halftone-video shader. **Reuse its exact configuration** — only the video source changes:

```html
<header class="hero">
  <div data-halftone-video
       data-src="assets/your-video.mp4"
       data-front="#2C6F75"        <!-- essentially --teal; match exactly -->
       data-invert="1"
       data-cell="0.0028"
       data-radius="0.8"
       data-contrast="-0.15"
       data-grain="0.15"></div>
  <div class="scrim"></div>
  <div class="hero-inner">
    <h1>…</h1>
    <p>…</p>
  </div>
</header>
```

Don't drift `data-cell`, `data-radius`, `data-contrast`, or `data-grain` — those are the shader's brand fingerprint. Only sanctioned exception: change `data-front` to a different brand hex if the page leads with a different brand color (e.g. an ICP-themed page on `--azure` or `--cool-blue`).

**The `.scrim` element** is required — it's a top + bottom white-gradient overlay (~45% opacity at the very top and bottom, transparent through the middle) that ensures the H1 and sub-copy remain legible regardless of what frame of the video is currently rendering. Don't omit it; the halftone-video luminance varies frame-to-frame and bare text on top of it fails contrast in some frames.

**One halftone-video per page, max.** It's heavy and visually loud.

#### Hero anatomy — the rules

Heroes are a fixed two-element composition. **H1 + Body subtitle. Nothing else.**

- **No eyebrow.** Eyebrows are the JetBrains Mono uppercase label that sits above an H3 *section header* — they mark sections, not heroes. A hero is the page-defining moment; it identifies itself through the H1, not through a label above it. If a non-technical user asks for "a tagline above the headline" or "a kicker," push back: that's an eyebrow, and it doesn't belong on a hero.
- **H1** — Cormorant Garamond italic, weight 600, `--fs-h1`. Alignment is contextual (left or centered per page); not a defining property of the role. The homepage hero is centered; future ICP-themed heroes may be left-aligned to suit the composition. Mirror the ICP carousel title-slide for size.
- **Subtitle** — a plain `<p>` in Body register: Poppins 400 at `--fs-body` (16px), `--lh-body` line-height, full `--ink`. **In a hero**, alignment matches the H1 (centered when the H1 is centered, left when left). Max-width ~60ch on multi-line copy. The H1's massive Cormorant italic above (≥48px) is what carries the hierarchy; the subtitle is just paragraph copy.
- **Both elements share the same horizontal axis** — they're one composition. When the H1 is centered, this is the only place on the site where multi-line centered body copy is sanctioned. Outside the hero, multi-line centered copy is push-back-worthy.

This composition applies to **every** hero variant — halftone-video heroes (homepage), paper heroes without media (`solutions.html`, `about.html`), and any future ICP-themed hero. The variant chooses the *background treatment*; the H1 + Body-subtitle rules are invariant.

### "Add a new page"

Required scaffolding for any new HTML page:

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+Garamond:ital,wght@1,400;1,600;1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared/tokens.css">
  <link rel="stylesheet" href="shared/effects.css">
  <link rel="stylesheet" href="shared/button.css">
  <link rel="stylesheet" href="shared/components/site-nav/index.css">
  <!-- + any component CSS the page uses -->
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <nav data-site-nav></nav>
  <main id="main"> … </main>
  <footer class="site"> … </footer>
  <script src="shared/components/site-nav/index.js"></script>
</body>
```

Lift the footer markup from `index.html` (light/paper) or `demo.html` (dark) — match whichever the page's last section pairs with.

### "Add a feature highlights section" / "Add a features section" — six variations

Feature highlights are a **family** of patterns. Pick the variation by density (how scannable vs. how detailed) and by visual weight (Quiet for content-density, Spotlight/Editorial for product moments). Each variation below maps to a specific request shape; if a non-technical user just says "add features" without specifying density, ask whether they want it scannable (strip), editorial (cards), or product-moment (alternating / full-screen).

Two are already built; four are **proposed patterns** the system supports but no live reference exists yet — when one of these is requested, build it from the recipe and update the reference table.

#### Variation 1 — Strip (4-up icons) *— exists*

**Use when:** the user wants a *scannable* summary of 3–4 short features in a single row. Dense, fast to read, low visual weight.

- Reuse the `feature-highlights` component (`shared/components/feature-highlights/`) — don't hand-build.
- Each feature: small icon + H3 in Poppins + 1–2 line body. No imagery.
- Surface: `.fx-grad-ice-cream-beige` + `.fx-grain--ink`. **Quiet signature.**
- Animation *(intended state — not yet wired into the existing component; Phase 4 target)*: subtle staggered fade-in + 24px slide-up on enter (~600ms ease-out, GSAP ScrollTrigger), one stagger step ~80ms apart. The current `feature-highlights` component renders items statically with no entrance animation; matching the brand baseline (see "Animation rules" below) is queued for the cleanup pass.

> **Don't widen to a 5+ card strip.** The brand reads card families as 3 or 4, max. If more features are requested, propose a stacked or alternating variation instead.

#### Variation 2 — Cards (3-up with photo) *— exists*

**Use when:** features need editorial weight backed by imagery — solution pillars, product capabilities with screenshots, value props with photos.

- Mirror `.ty-card` (the typology cards) in `index.html`. See "Add typology cards" recipe below for the full layer recipe.
- Each card: photo top + frosted-glass caption with H4 + body. **Quiet signature** with a frosted caption layer.
- Animation *(intended state — Phase 4 target)*: same staggered fade-in + slide-up as the strip; no per-card hover animations (the photo and caption are already doing the work). The live typology cards currently render without entrance animation.

#### Variation 3 — Stacked rows *— proposed, no mirror yet*

**Use when:** each feature needs more space and a richer description than a card can hold — feature deep-dives, product page detail.

- Vertical stack of full-width rows. Each row: small photo/screenshot left (or right), eyebrow + H3 + 2–4 line body + optional inline link on the other side. No alternating — every row reads the same way.
- Surface: `.fx-grad-ice-cream-beige` + `.fx-grain--ink`. **Quiet signature.**
- Row spacing: `--section-y-tight` between rows so the section doesn't sprawl.
- Photo: aspect-ratio 16/10 or similar wide; photo passes through `.fx-dither.fx-dither--photo` if it's stock imagery, or stays unfiltered for product UI screenshots.
- Animation: each row fades in + slides up 24px as it enters the viewport. No alternating direction (keeps the rhythm steady).

#### Variation 4 — Alternating blurb + product highlight *— proposed, no mirror yet*

**Use when:** the user wants a "feature spotlight" rhythm — full-width product moments where each feature gets its own visual centerpiece, alternating left/right to create scroll-driven movement.

- Each feature is a near-full-vw row: blurb on one side (~40% width) + product highlight on the other (~60% width — large screenshot, illustration, or short looping video). Alternate which side the blurb sits on per row.
- Blurb: eyebrow (JetBrains Mono) + H3 (Poppins section header) + optional H2 (Cormorant italic editorial moment) + lead paragraph + optional `.btn .btn--filled` or `.btn .btn--white` CTA.
- Product highlight: large media block, dithered if photo (`.fx-dither.fx-dither--photo`), unfiltered if product UI. Can include a short autoplay-loop muted video for animated UI demos.
- Surface: alternates per row between `.fx-grad-ice-cream-beige` (Quiet, blurb-only side) and a dark vertical gradient (`.fx-grad-dark-oxford-blue-teal-cream` or `.fx-grad-dark-oxford-blue-azure-ice` — pick one and stick with it for the whole section). The alternation between paper and dark gives the rhythm. Each *dark* row is the **Imagery signature** (gradient + grain + dithered media — the product highlight is the dithered art). Each *paper* row is **Quiet**. So per the four-signature taxonomy: **Quiet ↔ Imagery, alternating per row.** Don't add halftone bloom on top — that would push it to Editorial and overwhelm the alternation rhythm.
- Spacing: each row is min `80vh` so each gets its own scroll moment without being pinned.
- Animation: as each row enters the viewport, the *side that's currently coming in from off-screen* slides 32px from its outside edge with fade-in (600ms, ease-out). Don't pin-scroll these — the stack-animation already owns that slot.
- Don't apply this to more than 3–4 features in one section. If the page needs more, switch to Variation 3 (stacked rows).

#### Variation 5 — Full-screen single product highlight *— proposed, no mirror yet*

**Use when:** *one* feature deserves its own moment — a flagship capability, the product's headline differentiator, an editorial hero-after-hero placement.

- One section, `min-height: 100vh`. Full-bleed media (image, looped video, or animated UI screen) with copy overlaid in a corner or beside it.
- Surface: dark vertical gradient (`.fx-grad-dark-oxford-blue-azure-ice` or similar) under the media. **Editorial signature** — gradient + grain + dithered photo + halftone bloom. Full stack.
- Copy block: eyebrow + Cormorant H1 (yes, H1-sized — this is a moment) + lead + CTA.
- Animation options:
  - *Static* — no animation, just the media holding the viewport.
  - *Parallax* — media scrolls at 0.6× the page rate so it feels weightier than its container.
  - *Pinned scroll* — only if the stack-animation isn't already on the page. Same rule: one pinned moment per page, max.

#### Variation 6 — 2-up split *— proposed, no mirror yet*

**Use when:** two features need equal visual weight and they're parallel/contrasting (e.g. "before / after," "you / your client," "what we do / what we don't do").

- Two columns, equal width, ~`60vh` tall each. Each column: eyebrow + H3 + body + optional small image. Alternate the surface per column — one column on `.fx-grad-ice-cream-beige`, the other on `.fx-grad-dark-oxford-blue-teal-cream` (or any other dark vertical gradient). The contrast between paper and dark *is* the message.
- The optional small image, if used, passes through `.fx-dither.fx-dither--photo` — making the imagery-bearing column **Imagery**. Without an image, the dark column is **Quiet** on a saturated gradient. So per the four-signature taxonomy: **Quiet ↔ Quiet (text-only)** or **Quiet ↔ Imagery (with photos)**, depending on whether the columns include media.
- Animation: both columns fade in together as the section enters viewport.

---

#### Atomic primitive: feature blurb

A reusable text block used inside *any* of the above variations:

```
[eyebrow]                 ← JetBrains Mono uppercase, --xwide letter-spacing
H3 / Poppins 500           ← section header (utility); reach for H2 (Cormorant italic) when the line is an editorial moment, not a label
2–4 line body in Poppins  ← --fs-body
optional [link →] or .btn ← inline link in --aqua, or full button for CTAs
```

When a non-technical user says "add a feature blurb" or "add a quick description block," that's this — reach for it as a building block, don't restyle it per location.

---

#### Animation rules (for all feature-highlights variations)

The brand's motion vocabulary is *quiet, deliberate, scroll-driven*. Don't add hover-bounce, micro-interactions, or auto-playing carousels.

- **Default entrance:** 24–32px slide from below + opacity 0 → 1, 600ms, ease-out.
- **Trigger:** GSAP ScrollTrigger, fire when the row's top hits ~80% of viewport.
- **Stagger** (for multi-item rows like the strip and cards): 80ms between items.
- **One pinned-scroll moment per page, max.** Stack-animation currently claims that slot on the homepage — see "Add a product feature scroll moment" below. Adding a second pinned section to the same page is a push-back.
- **Reduced-motion:** wrap all entrance animations in a `prefers-reduced-motion: no-preference` media query. Users with reduced motion get the section's final state immediately, no animation.

---

#### Picking the right variation — quick reference

| User says… | Variation | Signature | Status |
|---|---|---|---|
| "Quick scannable feature row," "summary of features" | 1. Strip | Quiet | ✓ exists |
| "Solution pillars with photos," "feature cards with imagery" | 2. Cards | Quiet + frosted caption | ✓ exists |
| "Feature deep-dives," "more space per feature" | 3. Stacked rows | Quiet | proposed — build from recipe |
| "Product spotlight rhythm," "alternating sections," "feature pages with motion" | 4. Alternating blurb + highlight | Alternates Quiet ↔ Imagery | proposed — build from recipe |
| "Big flagship feature," "hero-after-hero" | 5. Full-screen single | Editorial | proposed — build from recipe |
| "Two features side-by-side," "compare these two things" | 6. 2-up split | Quiet ↔ Quiet (text-only) or Quiet ↔ Imagery (with photos) | proposed — build from recipe |

**When a "proposed" variation is first built, update Part IV's reference compositions table to point at the new file.**

### "Add a photo or SVG illustration"

Every photo or SVG illustration on the site must pass through the **dither dot-mask** (`.fx-dither`). Photos additionally take the `.fx-dither--photo` modifier (matches the carousel's pre-mask filter recipe).

Rules:
- Don't bake the dot pattern into the SVG file itself — apply `.fx-dither` on a wrapper or directly on the element so the dither is consistent across zoom levels.
- Export SVGs at 2× the rendered size so the dither sampling has detail to bite into.
- Don't drift the dither parameters (4×4 cell, 0.5px solid dot, 1.6px fade) — they're set canonically in the kit.

### "Add a stats strip" / "Show our numbers" / "Add a proof section"

This is the **Quiet signature**. A two-column layout that pairs a short label sentence on the left with a table-of-numbers on the right, divided by horizontal rules.

> **No live mirror.** When this pattern is first requested, build it from the recipe below.

**Layout:** `display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px;` — label left, table right. Stack to one column at ≤960px.

**Left column:** one short body-size sentence (Poppins 16px), `--ink` text, max ~24ch.

**Right column:** a stack of rows. Each row is `display: grid; grid-template-columns: 1fr auto;` with the stat name (Poppins 14px) on the left and a big number on the right. Number uses `--fs-h2` (clamp 32–52px), weight 600, letter-spacing -0.02em, white-space: nowrap so commas don't break. `border-top: 1px solid var(--line)` between rows; the last row also gets `border-bottom`. ~22px vertical padding per row.

**Surface:** `.fx-grad-ice-cream-beige` is the default. Add `.fx-grain--ink` for grain.

### "Add a final CTA before the footer" / "Add a closing call-to-action"

The brand's go-to "and now do this" moment. Mirror `.cta` in `index.html`.

**Layout:** `display: flex; align-items: center; justify-content: space-between; gap: 24px;` — italic Cormorant H3 on the left, `.btn .btn--filled` on the right. Stack to column at ≤540px.

**Heading:** **H2** — Cormorant Garamond italic, weight 500, `--fs-h2` size (32–52px), max ~30ch. Examples: *"Bring order into complexity."* — short, declarative, sits as a sentence rather than a label. Don't load it down with sub-copy. (H2 is the right role here because the closer is an editorial moment — bigger than a section header, italic in voice.)

**Button:** always `.btn .btn--filled` (primary), pointing at `demo.html` or whatever the primary conversion goal is.

**Vertical padding:** `padding: clamp(72px, 9vw, 112px) 0 clamp(48px, 6vw, 72px);` — generous on top, slightly less on bottom so the section settles into whatever follows (typically the dark footer slab).

### "Add an editorial closer" / "Add a closing italic line at the end of a section"

A small but recognizable brand pattern: a single italic Cormorant line at the bottom of a section, centered, in `--teal`. Used as a one-line sign-off after a list of cards or a section's main content. Mirror `.typology .closer` in `index.html` ("More than tools — a single source of truth.").

**Recipe:** **H2** styling (Cormorant Garamond italic, weight 500, `--fs-h2`, `--lh-h2`, `--ls-display`), with two overrides specific to this pattern: `color: var(--teal)` (the editorial accent color, not `--ink`) and `text-align: center`, max ~60ch, `margin: clamp(56px, 7vw, 88px) auto 0` to give it air above. The closer is the canonical "H2 used as a centered editorial sentence" — see the H2 alignment rule.

This is one of the **rare exceptions to "no centered copy"** (see Part III) — it's a single line, deliberately, for editorial weight. Multi-line centered closers are not allowed.

### "Add typology cards" / "Add a 3-up editorial card grid with photos"

Three cards in a row, each with a photo on top and a frosted-glass caption below. Mirror `.ty-card` in `index.html`.

**Card host:** `display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; isolation: isolate; background: var(--cream); box-shadow: 0 1px 0 rgba(11,26,43,.06), 0 18px 40px -22px rgba(11,26,43,.22);`

**Photo (top):** `position: relative; aspect-ratio: 1280/832;` containing an `<img>` that fills via `position:absolute; inset:0; width:100%; height:100%; object-fit:cover;`. Photo content should match brand imagery rules — pass through `.fx-dither.fx-dither--photo` if it's a stock or reference photo (architectural product screens are usually ok unfiltered).

**Caption (bottom):** see "frosted-glass caption" below — that's the `.meta` pattern.

**Grid:** `display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(20px, 2.4vw, 32px); align-items: stretch;` — collapse to 1-column at ≤960px.

**Heading above the grid:** **H2** (Cormorant italic, `--fs-h2`), centered, max ~60ch. (Centered is the **deliberate exception** for these cards — the section's centered editorial framing is part of the pattern. H2 is the right role here because the heading is an editorial moment, italic in voice — not a section-header label. If the section also needs a Poppins H3 above it, add the eyebrow + H3 + H2 stack per the section anatomy.)

### "Add a frosted-glass caption" / "Add a caption over a photo"

The atomic pattern that lives inside typology cards but is reusable wherever a caption sits over or under media:

```css
.caption {
  position: relative;
  padding: 24px 22px 26px;
  text-align: center;
  color: var(--ink);
  background: rgba(255, 255, 255, .55);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border-top: 1px solid rgba(255, 255, 255, .6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .4);
}
```

Heading (H4) inside: Poppins 17px / 600 / `--ink`. Body: Poppins 14px / line-height 1.55 / `rgba(11,26,43,.78)`.

**Don't drift `blur(18px)` or `saturate(140%)`** — those are the canonical values used for caption-over-photo throughout the brand. (The site's other frosted-glass call-sites use lighter blurs: `.btn` defaults to `blur(14px)`, and `.btn--frosted` and the stack-animation overlay both use `blur(6px)`. Captions are the heaviest tier — that's deliberate, so the caption reads as one weight even when the photo behind it is busy.)

### "Wrap multiple sections in one shared paper backdrop" / "Make the bottom of the page feel like one warm zone"

This is the **paper-zone** architectural pattern: a single host that wraps two or more adjacent sections so they share one continuous warm-paper surface (gradient + grain) instead of each section painting its own. **No live mirror today** — when the homepage and About were redesigned, the only paper-backed section left was the team-section, so the team component absorbed the paper surface itself (see `data-theme="paper"` on `[data-team-section]`). The recipe below is how to bring the pattern back if a future page needs 2+ sections inside one warm zone.

**Host:** `position: relative; isolation: isolate; overflow: hidden;` with `.fx-grad-ice-cream-beige` on it, `.fx-grain--ink` as a positioned child, and optionally `.fx-halftone-bloom` (override `--fx-bloom-mask` to target a CTA or moment under the wrapped sections).

**Children:** the inner sections must use `position: relative; z-index: 1;` so they render above the host's grain/bloom layers — the host applies `.paper-zone > :not([class*="fx-"]) { position: relative; z-index: 1; }` automatically.

**When to use paper-zone vs. per-section gradients vs. component-owned theming:**
- **Component-owned** (default for single sections that need a paper surface) — let the component carry its own `data-theme="paper"` styling. The team-section is the canonical example.
- **Paper-zone wrapper** — when 2+ adjacent sections should feel like one zone (e.g. team → testimonial → CTA closer all on one warm sweep).
- **Per-section gradients** — when each section is its own moment with its own color identity.

**Don't put a paper-zone wrapper around a single section** — it adds nothing over the component-owned approach or just applying `.fx-grad-ice-cream-beige` directly.

### "Add a footer" / "Add the page footer"

Two variants exist; pick by what the page's last content section is:

- **Light footer** (transparent background, ink text) — when the last section is on a paper / cream / light surface. Two-column layout: brand block (logo, tagline, socials, legal links, copyright) on the left; newsletter inline form on the right. Border-top hairline at `var(--line)`. (No live mirror — the current site uses the dark footer everywhere.)
- **Dark footer** (`#0a0a0a` background, white text) — current default across all four pages. Mirror `footer.site` in `index.html` / `demo.html`. Four-column layout: brand left, then three columns of links.

Don't mix the two on the same page. The footer is always paired with the last section's color temperature.

### "Add a newsletter signup" / "Add an inline email signup"

This is the small inline-form pattern — distinct from the demo-form's full card form. Mirror the newsletter form in `index.html` footer.

**Layout:** vertical stack inside a max ~360px column. Heading (eyebrow style — JetBrains Mono 11px uppercase, letter-spacing 0.22em, muted color), one short paragraph (Poppins 13px, 70% ink), `<input type="email">`, `.btn .btn--filled` Subscribe button, status message line, fine-print legal.

**Input:** `padding: 10px 14px; font-size: 14px; background: rgba(255,255,255,.6); border: 1px solid rgba(11,26,43,.18); border-radius: 8px;` — focus state border-color `var(--aqua)` and `background: #fff`.

**Button:** override clearance — `--btn-clearance: 0; margin: 18px 0 0 9px;` — to inset the corner-tick column with the input/heading edge, with 18px gap so the hover ticks clear the input.

**Required label (a11y):** add `<label for="newsletter-email" class="sr-only">Email address</label>` before the input. The current `index.html:542` input is missing this — Phase 6 cleanup target.

**Status message:** `aria-live="polite"` for screen readers; placeholder for "Thanks — we'll be in touch."

### "Add a product feature scroll moment" / "Add something like the stack animation"

The site already has one big pinned-scroll product moment — the **stack-animation** component (`shared/components/stack-animation/`). It's a 200vh tall sticky-pinned section with a 3D stack of five legacy app panels (Excel, AutoCAD, Bluebeam, Finder, Gmail) collapsing into a single Renoverse panel.

**Use sparingly — one per page, max.** Pinned scrolls dominate the page rhythm; two on one page exhausts the reader.

**Don't restyle without testing the sticky-nav interaction.** There's a documented historical conflict: the sticky nav's `top:0` competes with the stack-animation's pinned `top:0`, and ScrollTrigger's start calculation can land in the wrong place. See the memory note "sticky-nav-stack-animation-conflict" — Phase 1 + Phase 2 in `PLAN.md` are the two cleanup phases for this. If a request asks for the stack animation on a new page or with a sticky nav above it, raise the conflict and reach for the `--nav-height` token to offset ScrollTrigger.

**To use:** drop in `<div data-stack-animation></div>` on the page, plus the GSAP + ScrollTrigger CDN scripts and the component's CSS/JS. The component is self-contained — don't try to integrate page-level styles into it.

### "Use a new color" / "Add a new accent"

**Push back.** The palette is closed — see `tokens.css`. If a new color is genuinely needed (e.g. a future ICP-themed page leading with a fresh tint), add it to `tokens.css` with a semantic name first, *then* use it. Don't hand-paste hex values into a section.

### "Use a brand gradient"

The brand has a **closed list of 7 gradients**: 5 vertical, 1 horizontal signature, 1 radial paper backdrop. Each token name describes its actual color stops in declared order.

#### Vertical gradients (oklab interpolation, top → bottom)

| Stops | Where it's used | Token | Class |
|---|---|---|---|
| `sky-blue → ice` | Capabilities section header backdrop (homepage) | `--grad-sky-blue-ice` | `.fx-grad-sky-blue-ice` |
| `dark-oxford-blue → teal → cream` | Testimonial card; ICP project-managers panel | `--grad-dark-oxford-blue-teal-cream` | `.fx-grad-dark-oxford-blue-teal-cream` |
| `dark-oxford-blue → azure → ice` | ICP principal-architects panel | `--grad-dark-oxford-blue-azure-ice` | `.fx-grad-dark-oxford-blue-azure-ice` |
| `dark-oxford-blue → cool-blue → cream` | ICP junior-designers panel | `--grad-dark-oxford-blue-cool-blue-cream` | `.fx-grad-dark-oxford-blue-cool-blue-cream` |
| `cream → aqua → teal` | features-alternating row backdrop | `--grad-cream-aqua-teal` | `.fx-grad-cream-aqua-teal` |

#### Radial paper backdrop

| Stops | Where it's used | Token | Class |
|---|---|---|---|
| Radial: `ice → cream → beige` (origin top-center) | About hero, Solutions hero, team-section paper variant | `--grad-ice-cream-beige` | `.fx-grad-ice-cream-beige` |

#### Signature (horizontal — accent line, not a section fill)

| Stops | Where it's used | Token | Class |
|---|---|---|---|
| `blue → aqua → teal` (90deg) | Brand-mark gradient, hairlines, eyebrow underlines, the Renoverse logo | `--grad` | `.fx-grad` |

**If a request asks for a gradient that isn't on this list** — "pink gradient," "sunset gradient," "dark blue gradient" — the brand doesn't have one. **Push back**: ask which existing gradient is closest, or propose adding a new gradient (with operator approval) by extending `tokens.css` and `effects.css`. Don't hand-paste new stops into a section.

### "Make this heading bigger / smaller / different"

Type sizes come from the scale tokens (`--fs-h1` … `--fs-small`). Don't hand-author a new size. The role determines the family + alignment:

- Hero / page-defining moment (H1) → Cormorant Garamond italic, ~48–96px, alignment per page
- Editorial moment / closer (H2) → Cormorant Garamond italic, ~32–52px (left, or centered for a single-sentence editorial moment)
- Section header (H3) → Poppins 500, left, ~20–28px
- Eyebrow above a section header → JetBrains Mono uppercase, `letter-spacing: var(--xwide)`, only above an H3
- Body → Poppins 16px, left. Section intro paragraphs and hero subtitles are also Body (no separate `.lead` class — hierarchy carried by H1/H2 above).
- Small → Poppins ~12.5px, left. Fine print, captions, role-under-name, footer legal.

### "Make this section centered" / "Center the copy"

**Push back on body and H3.** Body copy and H3 section headers are left-aligned, always. The exceptions are baked into specific roles, not granted ad-hoc:

- **H1 alignment is contextual** — left or centered, picked per page. The hero is the only composition that authorizes centered multi-line copy, because H1 + subtitle read as a single unit. Outside heroes, an H1 stays in whatever alignment its surrounding composition uses.
- **H2 may be centered** when used as a single editorial sentence — the final-CTA closer, an italic Cormorant closer line.
- **Hero subtitle** (Body register under the H1) is centered when the H1 is centered (matches the H1 axis). In a section, Body paragraphs are left-aligned.
- Everything else stays left-aligned. Multi-line centered body copy outside a hero doesn't belong on this site.

### "Add navigation / change the nav"

Use the `data-site-nav` component (`shared/components/site-nav/`). Don't hand-build nav markup on a page — the component owns layout, dropdowns, and (after Phase 1) sticky behavior.

---

## Part II — Reference layer

When implementing, these are the canonical specs.

### Type scale

Six roles. Hierarchy comes from **type** (family / size / weight / italic). The H1 + H2 sizes are anchored to the ICP carousel — H1 mirrors `.icp-carousel__title-slide` (hero/page-defining), H2 mirrors `.icp-carousel__lead` (section header). H3 is the sub-header role: same family as H1 but smaller than H2.

| Role | Family | Style | Size token | Line-height | Letter-spacing | Alignment | Color |
|---|---|---|---|---|---|---|---|
| H1 | Cormorant Garamond | italic 600 | `--fs-h1` (48–96px) | `--lh-h1` (1.10) | `--ls-display` | left or centered (per page) | `--ink` |
| H2 | Cormorant Garamond | italic 500 | `--fs-h2` (32–52px) | `--lh-h2` (1.10) | `--ls-display` | left (centered ok for a single editorial sentence) | `--ink` |
| H3 | Poppins | 500 | `--fs-h3` (20–28px) | `--lh-h3` (1.30) | `--ls-display` | left | `--ink` |
| Eyebrow | JetBrains Mono | 500 uppercase | `--fs-eyebrow` | `--lh-eyebrow` | `--xwide` | left. Above an H3 (section header) only — not on heroes. | `--ink` (or `--teal` when ornamental) |
| Body | Poppins | 400 | `--fs-body` | `--lh-body` | normal | left in sections; centered when used as a hero subtitle (matches its H1) | `--ink-soft` |
| Small | Poppins | 400 | `--fs-small` | `--lh-small` | normal | left | `--ink-soft` |

**Heading hierarchy reads by voice, not just depth:** H1 + H2 share the editorial Cormorant italic family (hero + page-defining moments + closers); H3 is the utility Poppins family (functional section header). Eyebrows label section headers, so they sit above H3.

**Color rule:** headings + emphasis at full `--ink` (`#0a0a0a`); paragraph copy and small text at the slightly softened `--ink-soft` (`#3a3a3a`). The softer ink is what makes long-form copy easier to read against the headings. Bold-emphasized body (e.g. attribution name, bullet label) stays at full `--ink` — the weight + color together mark it as the heading-adjacent peak inside the paragraph block. **Color softening is flat, never opacity** — only the two solid `--ink` / `--ink-soft` tokens are sanctioned for ink-tier text.

### Color tokens

Two ink shades on light surfaces (`--ink` for headings + emphasis, `--ink-soft` for paragraph copy), pure white on dark surfaces, plus the aqua/teal and blue accent ramps. **All ink softening is flat color, never opacity.**

**Brand neutrals:**

| Token | What it's for |
|---|---|
| `--ink` `#0a0a0a` | Headings (H1/H2/H3), eyebrows, bold-emphasized body (attribution names, bullet labels), buttons. |
| `--ink-soft` `#3a3a3a` | All paragraph copy: hero subtitles, section intros, body paragraphs, captions, small text. |
| `--beige` `#FAFAF7` | Warm off-white surface — used as a section background where you want a warmer-than-white feel. **Not** the default page bg. |
| `--white` `#FFFFFF` | Default page background. Cards, sheets, anywhere wanting clean white. |
| `--cream` `#F2EBD8` | Warm-paper accent surface. |
| `--ice` `#E5F4F1` | Cool-paper accent surface. |
| (literal `#fff`) | All text on dark surfaces. |

**Aqua / teal ramp** (primary accent — light → dark):

| Token | What it's for |
|---|---|
| `--sky-blue` `#7FE3CB` | Light aqua tint. |
| `--aqua` `#5EC9B7` | Mid aqua — primary CTA fill, button ticks, links on light surfaces. |
| `--teal` `#2D6F75` | Deep teal — editorial italic accents (closers, link emphasis). |

**Blue ramp** (secondary accent — light → dark):

| Token | What it's for |
|---|---|
| `--cool-blue` `#5BA7C9` | Cool blue — gradient start; rarely on its own. |
| `--azure` `#5D6FB8` | Indigo accent — gradient stop only. |
| `--oxford-blue` `#022E41` | Deep blue — for any "deep blue surface" need. |
| `--dark-oxford-blue` `#0B1A2B` | Dark navy — top stop in the vertical `dark-oxford-blue → ___` gradients. |

**Utility:**

| Token | What it's for |
|---|---|
| `--line` `rgba(0,0,0,.10)` | Hairline dividers. Single tier. |

Reach order when picking: `--ink-soft` for paragraph copy (default) → `--ink` for headings + bold emphasis → `--aqua` for action → `--teal` for editorial emphasis or links.

### Gradient tokens & utilities

Closed list of 7. Token names mirror the actual color stops in declared order — see Part I for the request-driven mapping.

**Vertical (oklab interpolation, top → bottom):**

| Token / class | Stops |
|---|---|
| `--grad-sky-blue-ice` / `.fx-grad-sky-blue-ice` | sky-blue → ice |
| `--grad-dark-oxford-blue-teal-cream` / `.fx-grad-dark-oxford-blue-teal-cream` | dark-oxford-blue → teal → cream |
| `--grad-dark-oxford-blue-azure-ice` / `.fx-grad-dark-oxford-blue-azure-ice` | dark-oxford-blue → azure → ice |
| `--grad-dark-oxford-blue-cool-blue-cream` / `.fx-grad-dark-oxford-blue-cool-blue-cream` | dark-oxford-blue → cool-blue → cream |
| `--grad-cream-aqua-teal` / `.fx-grad-cream-aqua-teal` | cream → aqua → teal |

**Radial paper backdrop:**

| Token / class | Stops |
|---|---|
| `--grad-ice-cream-beige` / `.fx-grad-ice-cream-beige` *(radial, origin top-center)* | ice → cream → beige |

**Signature (the only horizontal gradient — accent line, not a section fill):**

| Token / class | Use |
|---|---|
| `--grad` / `.fx-grad` | Horizontal blue → aqua → teal — hairlines, accent rules, eyebrow underlines, the Renoverse logo. Not a section background. |

**Direction rules:** the 5 vertical tokens default to `180deg` top-down with stops in declared order — never reversed. The signature is `90deg` horizontal. Paper is a soft radial from top center.

**Orientation variations are sanctioned.** The canonical 7 define **stop colors**; per-call-site CSS may apply those same stops at a different angle (diagonal) or geometry (radial) when the composition calls for it — the stops never change, only the orientation. *Live example:* the testimonial card on `index.html` uses the canonical `dark-oxford-blue → teal → cream` stops at a `160deg` diagonal instead of `180deg` vertical, for editorial-card lean. **Drift = changing the stop colors. Re-orienting is not drift.**

### Effects kit (`shared/effects.css`)

The brand fingerprint: **every surface on the site is touched by some form of halftone or grain.** That's what makes flat color and clean type read as a printed editorial piece instead of a generic SaaS landing page.

| Class | What it does | When to apply |
|---|---|---|
| `.fx-dither` | Halftone dot-mask (4×4 cell, 0.5px dot) | **Required** on any new photo or SVG illustration on the site |
| `.fx-dither--photo` | Adds the carousel's pre-mask filter (contrast/brightness/saturate, multiply blend, low opacity) | Pair with `.fx-dither` on photographs |
| `.fx-halftone-bloom` | Soft, decorative dot-grid faded around a focal point | Under headings or CTAs that need atmosphere. Override `--fx-bloom-mask` to move the focal point |
| `.fx-grain--warm` | Warm-cream paper grain (overlay blend) | Over dark / saturated surfaces |
| `.fx-grain--ink` | Dark paper grain (multiply blend) | Over light / paper surfaces |
| `.fx-grad-*` | Brand gradient applied as `background` | Section bases — see gradient table above |

**Composition order (bottom → top):** base gradient → dithered photo → halftone bloom → paper grain → content.

**Host requirement:** `position: relative; isolation: isolate; overflow: hidden;` so blends and masks stay scoped.

The **WebGL halftone-video shader** ([`shared/components/halftone-video/`](./shared/components/halftone-video/)) is the moving cousin of `.fx-dither`. It's a JS component, not a utility — used only as a hero, one per page, configured exactly like the homepage hero (see Part I).

### Button variants (`shared/button.css`)

| Class | Look | Use |
|---|---|---|
| `.btn .btn--filled` | Azure rect, white text, corner ticks | **Default CTA on light surfaces.** Hero, final-CTA, footer subscribe |
| `.btn .btn--frosted` | Frosted glass + grain | **CTA on dark / photo surfaces.** ICP carousel CTAs, nav button over hero video |
| `.btn .btn--white` | White fill, azure outline + text | Secondary action on light surfaces |
| `.btn .btn--filled` (no `.tk` spans) | Same azure fill, no corner ticks | In-card variant for forms. Used by the demo-form (rendered via Tailwind utilities so the drop-in component doesn't depend on `button.css`). |

Every `.btn` reserves 24px clearance around itself for the hover-state ticks. Two side-by-side need ≥ 36px gap.

### Layout tokens

| Token | Meaning |
|---|---|
| `--container` | Max content width (1240px) |
| `--gutter` | Page side-padding (clamp 20–56px) |
| `--section-y` | Default vertical section padding |
| `--section-y-tight` | Condensed sections — intros, stats |
| `--nav-height` | Reserved offset for sticky nav (Phase 1) |

Standard section pattern: `<section style="padding: var(--section-y) 0;"><div class="wrap"> … </div></section>` where `.wrap` is `max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter);`.

### Accessibility primitives (non-negotiable)

- Skip-to-main link as the first focusable element on every page.
- `id="main"` on the main content target.
- Every input has a `<label for>` (visible or `class="sr-only"`).
- `:focus-visible` rings on all interactive elements — `2px solid var(--aqua)`, offset 2px.
- Tab order matches visual order; no `tabindex > 0` without rationale.
- WCAG AA contrast on body text against every background it appears on.

---

## Part III — Things Claude pushes back on

These are the brand non-negotiables. When a request implies one of these, raise it before implementing.

- **New colors not in `tokens.css`.** Palette is closed.
- **New gradients not in the named-gradient list.** Add a token first or reuse an existing one.
- **Opacity-softened ink (e.g. `rgba(11,26,43,.78)`) for secondary text.** Color softening is allowed *only* via the flat `--ink-soft` token (the Lead tier — `#555555`). Never translucent ink, never an arbitrary new shade.
- **Centered body copy.** Left-aligned only, except a single-line editorial closer.
- **Multiple hero videos on the same page.** One per page, max.
- **Hand-tuned shader, dither, grain, or halftone parameters.** These are the brand fingerprint — drift breaks the visual system. The kit's values are canonical.
- **A section without any halftone or grain treatment.** The brand depends on this vocabulary; raise it if a request implies a "flat" section with no surface texture.
- **A button without corner ticks.** Unless explicitly the in-card variant.
- **Re-deriving a gradient, dither mask, or grain SVG** when the kit already has it.

---

## Part IV — Reference compositions

When in doubt, mirror these working examples:

| Request shape | Mirror |
|---|---|
| Branded section with full effect stack | `shared/components/icp-carousel/` |
| Editorial card with photo + caption (typology cards) | `.ty-card` in `index.html` |
| Frosted-glass caption over media | `.ty-card .meta` in `index.html` |
| Customer testimonial / quote card | `.testimonial-section` in `index.html` |
| Hero with video | `<header class="hero">` in `index.html` |
| Stats / proof strip | `.stats` in `index.html` |
| Editorial closer (italic teal sign-off line) | `.typology .closer` in `index.html` |
| Final CTA before footer | `.cta` in `index.html` |
| Paper-backed section | `[data-team-section][data-theme="paper"]` (component-owned paper surface; no separate wrapper) |
| Footer (light/paper) | `footer.site` in `index.html` |
| Footer (dark) | `footer.site` in `demo.html` |
| Inline newsletter signup | `footer.site .newsletter` in `index.html` |
| Demo / contact form (full card) | `shared/components/demo-form/` |
| Team / about block | `shared/components/team-section/` |
| Feature highlights row | `shared/components/feature-highlights/` |
| Pinned-scroll product feature | `shared/components/stack-animation/` |

---

## Known drift to clean up later

The big drift list (homepage `:root` token redeclarations, Phase-13 dead CSS, `.paper-zone` + `.testimonial` inlined recipes, paper-warm canonicalization, `--muted` / `--line-soft` removal, `.lead` consolidation) was cleared in the 2026-05-06 pre-launch cleanup PR. Open follow-ups below.

**Token / type:**
- ICP carousel still inlines its dither mask and grain SVG. Lift each to the kit utilities (`.fx-dither.fx-dither--photo`, `.fx-grain--warm`). Don't change visual values; if the kit's defaults differ from the carousel, fix the kit. (Panel gradients are already canonical-token-driven post-Phase-2.) **(F1.5 component-library audit territory.)**
- The four shader implementations (`halftone-video`, `icp-carousel`, `features-alternating`, `features-editorial`) are not yet a shared primitive. The "match X = same primitive, parameterized" rule says they should be. **(F1.5.)**

**Other:**
- Newsletter input is missing a `<label for>`. **(F2 a11y PR.)**
- `.page-hero` is duplicated verbatim across `solutions.html` and `about.html` (same min-height, padding, gradient, layout — only the H1 max-width differs). Extract to a shared `data-page-hero` component or a single `.page-hero` rule in a shared stylesheet so adding a new paper-hero page is one mount, not a copy. **(F1.5.)**

---

*Last updated 2026-05-06.*
