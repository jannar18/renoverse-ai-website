# Renoverse Design System

<!--
  This file is the canonical source of truth for Renoverse's visual identity
  and design intent. Both humans and agents read it. The YAML frontmatter
  below holds machine-readable tokens; the markdown body holds the rationale.

  Format: https://github.com/google-labs-code/design.md (alpha)

  Renoverse-specific extensions (spec-safe under "preserve unknown content"):
    - `gradients:`        top-level block — DESIGN.md has no native gradient slot
    - `fontSizeFluid:`    inside typography entries — preserves CSS clamp() ranges
                          alongside the static `fontSize` upper bound
    - `effects:`          top-level block — surface treatments (dither, grain,
                          halftone bloom) the brand depends on; no native slot

  How to evolve this file:
    1. Edit DESIGN.md (this file) first.
    2. Run `bun run tokens:build` to regenerate `shared/tokens.css`.
    3. Commit both files together. PR review catches drift.
-->

---
version: alpha
name: Renoverse
description: >
  Editorial-meets-engineering identity for the Renoverse renovation platform.
  Calm, professional, content-first; built on a fixed kit of layered surface
  treatments (paper gradient + grain on every section) so flat color and
  clean type read as a printed editorial piece, not a generic SaaS page.

# ───────────────────────────────────────────────────────────────────────
# COLORS
# Two layers: literal Renoverse names (canonical, used everywhere in the
# codebase) plus semantic roles (primary/secondary/tertiary/neutral) as
# references for spec tooling. Edit the literal hex; the semantic role
# follows automatically via the {colors.literal} reference.
# ───────────────────────────────────────────────────────────────────────
colors:
  # ── ink: text color tier (flat softening, never opacity) ──
  ink:                  "#0a0a0a"   # headings, eyebrows, bold emphasis, button fills
  ink-soft:             "#3a3a3a"   # paragraph copy, hero subtitles, captions, small text

  # ── neutrals / paper surfaces ──
  white:                "#FFFFFF"   # default page background; cards, sheets, anywhere wanting clean white
  beige:                "#FAFAF7"   # warm off-white surface (NOT default page bg — that's white)
  cream:                "#F2EBD8"   # warm-paper accent surface
  ice:                  "#E5F4F1"   # cool-paper accent surface

  # ── aqua / teal ramp (primary accent, light → dark) ──
  sky-blue:             "#7FE3CB"   # light aqua tint
  aqua:                 "#5EC9B7"   # mid aqua — gradients, hairlines, ticks, links on light surfaces (NEVER text)
  teal:                 "#2D6F75"   # deep teal — emphasis + primary CTA fill (~5.5:1 white text, AA)

  # ── blue ramp (secondary accent, light → dark) ──
  cool-blue:            "#5BA7C9"   # gradient start / accent
  azure:                "#5D6FB8"   # indigo accent — gradient stop only
  oxford-blue:          "#022E41"   # deep blue brand color (very dark navy)
  dark-oxford-blue:     "#0B1A2B"   # top stop in vertical "dark-oxford-blue → ___" gradients

  # ── utility ──
  line:                 "#1a1a1a1a" # rgba(0,0,0,.10) — single hairline tier (8-digit hex form)

  # ── semantic roles (for DESIGN.md tooling; literal names remain canonical) ──
  primary:              "{colors.ink}"
  secondary:            "{colors.ink-soft}"
  tertiary:             "{colors.teal}"
  neutral:              "{colors.beige}"
  surface:              "{colors.white}"
  on-surface:           "{colors.ink}"
  accent:               "{colors.aqua}"
  accent-cool:          "{colors.cool-blue}"
  accent-deep:          "{colors.oxford-blue}"

# ───────────────────────────────────────────────────────────────────────
# TYPOGRAPHY
# Six roles. H1+H2 are Cormorant italic (editorial voice — hero + big
# moments). H3 is Poppins (utility voice — section headers). Eyebrow is
# JetBrains Mono uppercase (only above H3, never on heroes). Body + Small
# are Poppins (paragraph + fine print). The fontSize values below are the
# UPPER BOUND of each fluid range; fontSizeFluid carries the actual CSS
# clamp() that the build script emits.
# ───────────────────────────────────────────────────────────────────────
typography:
  h1:
    fontFamily:     Cormorant Garamond
    fontStyle:      italic
    fontWeight:     600
    fontSize:       96px
    fontSizeFluid:  clamp(48px, 7vw, 96px)
    lineHeight:     1.10
    letterSpacing:  -0.01em

  h2:
    fontFamily:     Cormorant Garamond
    fontStyle:      italic
    fontWeight:     500
    fontSize:       52px
    fontSizeFluid:  clamp(32px, 4vw, 52px)
    lineHeight:     1.10
    letterSpacing:  -0.01em

  h3:
    fontFamily:     Poppins
    fontWeight:     500
    fontSize:       28px
    fontSizeFluid:  clamp(20px, 2vw, 28px)
    lineHeight:     1.30
    letterSpacing:  -0.01em

  eyebrow:
    fontFamily:     JetBrains Mono
    fontWeight:     500
    fontSize:       13px
    fontSizeFluid:  clamp(11px, 0.9vw, 13px)
    lineHeight:     1.20
    letterSpacing:  0.32em
    textTransform:  uppercase

  body:
    fontFamily:     Poppins
    fontWeight:     400
    fontSize:       16px
    lineHeight:     1.55

  small:
    fontFamily:     Poppins
    fontWeight:     400
    fontSize:       12.5px
    lineHeight:     1.50

# ───────────────────────────────────────────────────────────────────────
# FONT FAMILIES (Renoverse extension)
# Each family has a primary (the named brand font) and a system-font
# fallback stack. tokens.css emits both joined: `--font-sans: 'Poppins',
# -apple-system, ...;`. The primary alone is what populates the spec's
# `typography.{role}.fontFamily` field above.
# ───────────────────────────────────────────────────────────────────────
fontFamilies:
  serif:
    primary:           Cormorant Garamond
    fallback:          "Georgia, 'Times New Roman', serif"
  sans:
    primary:           Poppins
    fallback:          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  mono:
    primary:           JetBrains Mono
    fallback:          "ui-monospace, SFMono-Regular, Menlo, monospace"

# ───────────────────────────────────────────────────────────────────────
# LETTER-SPACING — standalone utility tokens
# Reused independently of any typography role (e.g. buttons borrow `wide`,
# eyebrows borrow `xwide`). These exist as utility tokens for places that
# need to tighten or widen text without inheriting a full typography
# composite.
# ───────────────────────────────────────────────────────────────────────
letterSpacing:
  tight:               0.02em
  wide:                0.18em       # buttons (UI controls)
  xwide:               0.32em       # eyebrows (label above content)
  display:             -0.01em      # H1/H2/H3 display tightening

# ───────────────────────────────────────────────────────────────────────
# LAYOUT / SPACING
# All values are fluid (clamp) where breathing-room scales with viewport.
# Static base spacing is an 8px grid (with a 4px half-step for micro adj.).
# ───────────────────────────────────────────────────────────────────────
spacing:
  # 8px grid (static)
  xs:                4px
  sm:                8px
  md:                16px
  lg:                32px
  xl:                64px

  # Layout (fluid)
  container:         1240px                            # max content width
  gutter:            56px                              # static upper bound
  gutter-fluid:      clamp(20px, 4vw, 56px)            # page side-padding
  section-y:         112px
  section-y-fluid:   clamp(72px, 9vw, 112px)           # default vertical section padding
  section-y-tight:   80px
  section-y-tight-fluid: clamp(48px, 6vw, 80px)        # condensed sections (intro, stats)
  nav-height:        72px                              # sticky-nav offset

# ───────────────────────────────────────────────────────────────────────
# ROUNDED — corner radii
# Architectural sharpness: most surfaces are square. The 14px radius is
# reserved for editorial cards (typology, testimonial); 8px for inputs.
# ───────────────────────────────────────────────────────────────────────
rounded:
  none:              0px
  sm:                4px
  md:                8px       # inputs, demo-form fields
  lg:                14px      # editorial cards (typology, testimonial-card)
  full:              9999px

# ───────────────────────────────────────────────────────────────────────
# GRADIENTS (Renoverse extension)
# Closed list of 7. Five vertical + 1 horizontal signature + 1 radial
# paper backdrop. New gradients earn an addition only if they can't be
# served by one of these. Token names mirror the actual color stops in
# declared order. Direction defaults: 180deg vertical, 90deg signature,
# radial top-center for paper. Per-call-site re-orientation (e.g. 160deg
# diagonal) is sanctioned; changing the stop colors is drift.
# ───────────────────────────────────────────────────────────────────────
gradients:
  # Signature — horizontal, accent line (NOT a section fill)
  signature:                              "linear-gradient(90deg, {colors.cool-blue} 0%, {colors.aqua} 50%, {colors.teal} 100%)"

  # Vertical (oklab interpolation, top → bottom)
  sky-blue-ice:                           "linear-gradient(in oklab 180deg, {colors.sky-blue} 0%, {colors.ice} 100%)"
  dark-oxford-blue-teal-cream:            "linear-gradient(in oklab 180deg, {colors.dark-oxford-blue} 0%, {colors.teal} 70%, {colors.cream} 100%)"
  dark-oxford-blue-azure-ice:             "linear-gradient(in oklab 180deg, {colors.dark-oxford-blue} 0%, {colors.azure} 72%, {colors.ice} 100%)"
  dark-oxford-blue-cool-blue-cream:       "linear-gradient(in oklab 180deg, {colors.dark-oxford-blue} 0%, {colors.cool-blue} 70%, {colors.cream} 100%)"
  cream-aqua-teal:                        "linear-gradient(in oklab 180deg, {colors.cream} 0%, {colors.aqua} 55%, {colors.teal} 100%)"

  # Radial paper backdrop (origin top-center)
  ice-cream-beige:                        "radial-gradient(120% 80% at 50% 0%, {colors.ice} 0%, {colors.cream} 45%, {colors.beige} 100%)"

# ───────────────────────────────────────────────────────────────────────
# EFFECTS (Renoverse extension)
# The brand fingerprint. Every section has a paper gradient AND grain —
# non-negotiable. Two optional layers (dither + halftone bloom) compose
# with the base into the four section signatures. Don't drift any
# parameter here; that's how flat color reads as a printed editorial.
# ───────────────────────────────────────────────────────────────────────
effects:
  dither:
    description:     "Halftone dot-mask applied to photos and SVGs (REQUIRED on every visual asset)"
    cellSize:        4px              # 4×4 grid
    dotSize:         0.5px            # solid dot radius
    fadeRadius:      1.6px            # soft fade radius
  ditherPhoto:
    description:     "Pre-mask filter for photographs (pair with dither)"
    filter:          "contrast(1.05) brightness(0.95) saturate(0.3)"
    blendMode:       multiply
    opacityRange:    [0.05, 0.18]     # tune up over flat color, down over saturated gradient
  halftoneBloom:
    description:     "Decorative dot-grid faded around a focal point — atmosphere under headings/CTAs"
    cellSize:        14px
    dotColor:        "rgba(11,26,43,0.16)"
    dotCoverage:     "22%"
    blendMode:       multiply
    opacity:         0.25
    defaultMask:     "radial-gradient(60% 40% at 50% 78%, #000 0%, transparent 70%)"
  grain:
    description:     "Tiled 320×320 SVG fractalNoise — the brand fingerprint. Two tints."
    tileSize:        320px
    baseFrequency:   0.9
    octaves:         2
    seed:            7
    opacity:         0.35
    warm:
      colorMatrix:   "0.96 0.93 0.85 alpha 0.9"   # cream tint
      blendMode:     overlay                       # use over dark/saturated surfaces
    ink:
      colorMatrix:   "0.18 0.16 0.12 alpha 0.55"   # dark tint
      blendMode:     multiply                      # use over light/paper surfaces
  halftoneShader:
    description:     "WebGL halftone shader (Paper Hero–Teal preset). Single canonical primitive."
    source:          "shared/halftone-shader.js"
    preset:          "Cover, Hex, Inverted Off, 1%/120%/40%, #2C6F75, 20% grain"

# ───────────────────────────────────────────────────────────────────────
# COMPONENTS — atomic primitives
# The reusable lego bricks. Section-level components (testimonial-card,
# demo-form, product-features-*, site-nav, site-footer, team-section)
# are documented in prose under "Reference Compositions" — they're
# layout-coupled and don't fit the {backgroundColor, textColor, ...}
# shape cleanly.
# ───────────────────────────────────────────────────────────────────────
components:
  # ─ Buttons (the canonical CTA atom; corner-tick silhouette is mandatory) ─
  button-base:
    typography:        "{typography.eyebrow}"        # JetBrains Mono uppercase, but ls-wide (.18em) NOT ls-xwide
    letterSpacing:     0.18em                        # buttons are UI controls — wide, not extra-wide
    padding:           9px 22px
    border:            "1px solid rgba(0,0,0,0.55)"
    rounded:           "{rounded.none}"              # square corners, ticks instead of radii
    margin:            24px                          # mandatory clearance for hover-state ticks
    tickLength:        9px                           # tick rest length
    tickClearance:     18px                          # tick hover-state outward reach

  button-primary:
    extends:           button-base
    backgroundColor:   "{colors.teal}"
    textColor:         "{colors.white}"
    borderColor:       "{colors.teal}"
    tickColor:         "{colors.teal}"
  button-primary-hover:
    backgroundColor:   "{colors.white}"
    textColor:         "{colors.teal}"
    borderColor:       "{colors.teal}"

  button-secondary:                                  # = .btn--white (light surfaces, secondary action)
    extends:           button-base
    backgroundColor:   "{colors.white}"
    textColor:         "{colors.teal}"
    borderColor:       "{colors.teal}"
    tickColor:         "{colors.teal}"
  button-secondary-hover:
    backgroundColor:   "{colors.teal}"
    textColor:         "{colors.white}"

  button-frosted:                                    # for dark / photo / video surfaces
    extends:           button-base
    backgroundColor:   "rgba(242,234,216,0.08)"      # cream-tinted glass
    textColor:         "{colors.white}"
    borderColor:       "{colors.aqua}"
    tickColor:         "{colors.aqua}"
    backdropFilter:    "blur(6px)"
  button-frosted-hover:
    backgroundColor:   "rgba(242,234,216,0.16)"

  # ─ Eyebrow (label above an H3 section header — never on a hero) ─
  eyebrow:
    typography:        "{typography.eyebrow}"
    textColor:         "{colors.ink}"                # or {colors.teal} when ornamental
    underline:         "{gradients.signature}"      # the brand signature gradient as accent rule

  # ─ Hairline rule (utility divider) ─
  hairline-rule:
    backgroundColor:   "{colors.line}"
    height:            1px
  # ─ Hairline rule, accent variant ─
  hairline-accent:
    background:        "{gradients.signature}"
    height:            1px

  # ─ Link on light surface ─
  link-on-light:
    textColor:         "{colors.aqua}"
    textDecoration:    "underline"

  # ─ Frosted-glass caption (overlaid on or below media — the heaviest blur tier) ─
  frosted-caption:
    backgroundColor:   "rgba(255,255,255,0.55)"
    backdropFilter:    "blur(18px) saturate(140%)"
    textColor:         "{colors.ink}"
    padding:           24px 22px 26px
    borderTop:         "1px solid rgba(255,255,255,0.6)"

  # ─ Input field (text/email/select; demo-form's recipe) ─
  input-text:
    backgroundColor:   "{colors.white}"
    textColor:         "{colors.ink}"
    rounded:           "{rounded.md}"
    padding:           10px 14px
    fontSize:          15px
    lineHeight:        1.4
    borderInset:       "inset 0 0 0 1px {colors.line}"
  input-text-focus:
    borderInset:       "inset 0 0 0 2px {colors.teal}"

  # ─ Skip-to-main link (accessibility primitive — first focusable on every page) ─
  skip-link:
    backgroundColor:   "{colors.ink}"
    textColor:         "{colors.white}"
    rounded:           "{rounded.md}"
    padding:           8px 14px

  # ─ Focus ring (every interactive element) ─
  focus-ring:
    outline:           "2px solid {colors.aqua}"
    outlineOffset:     2px
---

## Overview

Renoverse is a renovation platform; this site is its marketing surface. The brand voice is **Architectural Editorial** — calm, content-dense, deliberately printed-feeling, never SaaS-loud. The defining choices:

- **Type carries the voice.** Cormorant Garamond italic for editorial weight (heroes, closers, big moments), Poppins for utility (section headers, body, UI), JetBrains Mono uppercase for technical labels (eyebrows, buttons). Hierarchy is read by family + style, not just size.
- **Paper as substrate.** Every section has a base gradient + paper grain — non-negotiable. Two optional layers (dithered photo, halftone bloom) compose with the base into four named **section signatures**: Quiet, Imagery, Spotlight, Editorial. Pick a signature first; pick a gradient second.
- **Closed kits.** 13 colors. 7 gradients. 6 type roles. 3 button silhouettes. New entries earn their place by extending `DESIGN.md`, not by hand-pasting hex into a section. The constraint is what keeps the brand coherent.
- **Editorial restraint.** Centered body copy is push-back-worthy outside heroes. New colors are push-back-worthy. Hand-tuned shader/dither/grain values are push-back-worthy. The kit's values are the brand fingerprint.
- **Accessibility-first.** WCAG 2.1 AA on every text-bearing surface. `--aqua` (#5EC9B7) is too light to carry text — it's a surface color (gradients, hairlines, ticks, body links *as decoration on light*). Text-bearing CTAs use `--teal` (#2D6F75) at ~5.5:1.

The reader experience target: feels like a high-end broadsheet or contemporary architecture monograph that happens to be on the web.

## Colors

The palette is rooted in a deep ink for type, soft warm/cool papers for surfaces, an aqua/teal accent ramp (primary), and a blue ramp (secondary). Two ink shades on light surfaces handle the heading-vs-paragraph register; pure white handles type on dark surfaces. **All ink softening is flat color, never opacity.**

### Ink tier — type colors
- **Ink** (`#0a0a0a`): headings (H1/H2/H3), eyebrows, bold-emphasized body (attribution names, bullet labels), button fills.
- **Ink-soft** (`#3a3a3a`): all paragraph copy — hero subtitles, section intros, body paragraphs, captions, small text. The slight softening is what makes long-form copy read comfortably next to the heading-tier ink.
- **White** (`#FFFFFF`): default page background; cards, sheets; *and* all text on dark surfaces.

### Paper surfaces
- **Beige** (`#FAFAF7`): warm off-white surface — used as a *section* background where a warmer-than-white feel is wanted. Not the default page background.
- **Cream** (`#F2EBD8`): warm-paper accent surface; appears as a stop in dark vertical gradients and as the bottom of the paper backdrop.
- **Ice** (`#E5F4F1`): cool-paper accent surface; gradient stop and section background pair for the sky-blue family.

### Aqua / teal ramp — primary accent (light → dark)
- **Sky-blue** (`#7FE3CB`): light aqua tint; gradient stops only.
- **Aqua** (`#5EC9B7`): mid aqua — gradients, hairlines, button corner ticks, links on light surfaces. **Never under or over text** (~2:1 against white, AA fail).
- **Teal** (`#2D6F75`): deep teal — editorial italic accents (closers, link emphasis) **and** primary CTA fill (white text on teal, ~5.5:1, AA).

### Blue ramp — secondary accent (light → dark)
- **Cool-blue** (`#5BA7C9`): gradient start; rarely on its own.
- **Azure** (`#5D6FB8`): indigo accent — gradient stop only.
- **Oxford-blue** (`#022E41`): deep blue brand color; footer text color (meets AA against the wave gradient at every frame).
- **Dark-oxford-blue** (`#0B1A2B`): top stop in vertical `dark-oxford-blue → ___` gradients (the legacy ink color the gradients still want even after text `--ink` shifted).

### Utility
- **Line** (`rgba(0,0,0,0.10)`): hairline dividers — single tier. For accent rules, use the signature gradient instead.

### Reach order when picking
1. `ink-soft` for paragraph copy (default).
2. `ink` for headings + bold emphasis.
3. `teal` for action / CTAs (text-bearing) and editorial emphasis.
4. `aqua` for surface-only accents (gradients, ticks, hairlines, body links on light).

### Push-back: new colors
The palette is closed. If a future ICP-themed page genuinely needs a fresh tint, add it to `DESIGN.md` with a semantic name first, then use it. Don't hand-paste hex values into a section.

## Typography

Six roles. Family is chosen by *voice*, not depth: H1 + H2 share the editorial Cormorant italic (hero + page-defining moments + closers); H3 is the utility Poppins (section header). The eyebrow labels section headers, so it sits above H3 — never on heroes.

| Role | Family | Style | Size (fluid) | Line-height | Alignment | Color |
|---|---|---|---|---|---|---|
| **H1** | Cormorant Garamond | italic 600 | clamp(48px, 7vw, 96px) | 1.10 | left or centered (per page) | ink |
| **H2** | Cormorant Garamond | italic 500 | clamp(32px, 4vw, 52px) | 1.10 | left (centered ok for a single editorial sentence) | ink |
| **H3** | Poppins | 500 | clamp(20px, 2vw, 28px) | 1.30 | left | ink |
| **Eyebrow** | JetBrains Mono | 500 uppercase | clamp(11px, 0.9vw, 13px) | 1.20 | left, above H3 only | ink (or teal when ornamental) |
| **Body** | Poppins | 400 | 16px | 1.55 | left in sections; centered as hero subtitle (matches its H1) | ink-soft |
| **Small** | Poppins | 400 | 12.5px | 1.50 | left | ink-soft |

**Letter-spacing tokens:**
- `--tight` (`0.02em`) — generic tightening.
- `--wide` (`0.18em`) — buttons (UI controls).
- `--xwide` (`0.32em`) — eyebrows (label above content).
- `--ls-display` (`-0.01em`) — H1, H2, H3 (display tightening).

**Heading hierarchy reads by voice:** Cormorant italic = editorial, Poppins = utility. Section intros and hero subtitles are Body, not a separate "lead" class — the H1 / H2 above is what carries the hierarchy.

**Bold-emphasized body** (e.g. attribution name, bullet label) stays at full `ink`. The weight + color together mark it as the heading-adjacent peak inside the paragraph block. Color softening is flat: only `ink` and `ink-soft` are sanctioned for ink-tier text. **Never translucent ink.**

## Layout

**Fixed-max-width grid** (1240px container) with **fluid gutters and section padding**. The site uses one max width and lets the gutter grow with viewport — there's no second desktop breakpoint where the container changes.

- **Container**: 1240px (max content width).
- **Gutter**: `clamp(20px, 4vw, 56px)` (page side-padding).
- **Section vertical padding**: `clamp(72px, 9vw, 112px)` default; `clamp(48px, 6vw, 80px)` for condensed sections (intros, stats).
- **Nav offset**: 72px sticky-nav. Pages that mount `[data-site-nav]` should pad their first section by `calc(--nav-height + breathing-room)` so content clears the floating bar.
- **Spacing scale**: 8px grid (4px half-step for micro-adjustments). xs=4, sm=8, md=16, lg=32, xl=64.

**Standard section pattern:**

```html
<section style="padding: var(--section-y) 0;">
  <div class="wrap"> … </div>
</section>
```

`.wrap` = `max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter);`

**Breakpoint set** for mobile/tablet adjustments: `1440 / 1280 / 1024 / 820 / 768 portrait + 1024×768 landscape / 430 / 390 / 360`. Mobile fixes belong in component CSS, never page CSS. Every visual finding names its breakpoint.

## Elevation & Depth

Depth is conveyed through **tonal layers**, not heavy shadows. Most surfaces sit at the same z; hierarchy comes from gradient direction (top-down dark → light) and from the optional halftone-bloom focal point.

The exceptions where shadows ARE used:
- **Editorial cards** (typology pattern, frosted-caption cards) carry a subtle drop-shadow:
  `0 1px 0 rgba(11,26,43,0.06), 0 18px 40px -22px rgba(11,26,43,0.22)`
- **Demo-form card** carries a slightly deeper recipe:
  `0 30px 60px -30px rgba(11,26,43,0.18), 0 8px 20px -10px rgba(11,26,43,0.08)`

Both are paper-card shadows — soft, inkwash, never elevation-ladder values.

For section-to-section hierarchy, depth is achieved through **section signatures** (see Section Anatomy below) — Quiet feels recessed, Editorial feels weighted, without a single shadow declared at the section level.

## Shapes

**Architectural restraint** — most surfaces are square. Three radii in the closed kit:

- **None** (0) — buttons (square, with corner ticks instead of radii), most section dividers.
- **Md** (8px) — inputs, demo-form fields.
- **Lg** (14px) — editorial cards (typology, testimonial-card), product-features-cards.

**Don't** mix rounded and sharp corners in the same composition. The brand reads square-with-ticks for action surfaces, soft-radius for editorial cards.

The **corner-tick silhouette** is a Renoverse-specific shape primitive: every `.btn` carries four absolutely-positioned tick spans (`tk.tl/tr/br/bl`) that animate outward 18px on hover. It's the brand's signature interaction shape — never replace it with a generic radius treatment.

## Components

This section covers the **atomic primitives** — the reusable lego bricks. Section-level components (testimonial-card, demo-form, product-features-*, site-nav, site-footer, team-section) live under "Reference Compositions" because they're layout-coupled.

### Buttons

The brand has three button variants — pick by surface, not by hierarchy.

| Variant | Look | Use |
|---|---|---|
| **`button-primary`** (`.btn .btn--filled`) | Teal fill, white text, teal corner ticks | Default CTA on light surfaces. Hero, final-CTA, footer subscribe. |
| **`button-frosted`** (`.btn .btn--frosted`) | Frosted glass (cream tint, blur 6), aqua border + tick, white text | CTA on dark / photo / video surfaces. Nav over hero, ICP carousel CTAs. |
| **`button-secondary`** (`.btn .btn--white`) | White fill, teal outline + text + tick; hover swaps to filled teal | Secondary action on light surfaces. Per-row CTAs in product-features-primary. |

**Required markup** (corner ticks are mandatory — the brand's interaction shape):

```html
<a class="btn btn--filled" href="#">
  <span class="tk tl"></span>
  <span class="tk tr"></span>
  <span class="tk br"></span>
  <span class="tk bl"></span>
  Label
</a>
```

**Spacing rule:** every `.btn` reserves 24px clearance around itself for the hover-state ticks (which extend outward 18px). Two side-by-side need ≥ 36px gap.

**In-card variant** (forms, cards): same teal fill + white text + mono uppercase, no corner tick spans. The demo-form (`.demo-form__submit`) ships this recipe as plain CSS so the form is self-contained.

**Don't:**
- Don't invent a new button silhouette. If a request implies one, push back and ask which existing variant fits.
- Don't drift the corner-tick parameters (rest length 9px, hover reach 18px).
- Don't put white text on aqua or aqua text on white (~2:1, AA fail) — use teal.

### Eyebrow

The JetBrains Mono uppercase label that sits above an H3 section header. Spacing letters are `--xwide` (0.32em). The eyebrow often carries an underline accent — the brand signature gradient (`--grad`) as a thin rule.

**Eyebrows mark sections, not heroes.** A hero is the page-defining moment; it identifies itself through the H1, not a label above it. If a request asks for "a tagline above the headline" or "a kicker" on a hero, push back: that's an eyebrow, and it doesn't belong on a hero.

### Hairline rule

Two tiers:
- **Utility** — `1px solid var(--line)` (rgba(0,0,0,.10)). For dividers between rows in stats strips, footer utility row separators.
- **Accent** — `1px` filled with the signature gradient (`--grad`). For decorative accent rules under eyebrows, brand-mark hairlines.

Don't introduce a third tier; if a divider needs more weight, switch to a section break instead.

### Link on light surface

Color: `aqua` (#5EC9B7). Underlined.

Aqua is normally a surface-only color (it can't carry text at AA), but as a body link on a light page background, the underline + the limited surface area of inline text are sufficient to read the link as decoration rather than carrying text.

### Frosted-glass caption

The atomic pattern that lives inside typology cards — reusable wherever a caption sits over or below media:

```css
.caption {
  position: relative;
  padding: 24px 22px 26px;
  text-align: center;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
```

Heading inside: Poppins 17px / 600 / `ink`. Body: Poppins 14px / line-height 1.55 / `rgba(11,26,43,0.78)`.

**Don't drift `blur(18px)` or `saturate(140%)`.** Captions are the brand's heaviest blur tier — that's deliberate, so the caption reads as one weight even when the photo behind it is busy. The other frosted call-sites are lighter: `.btn` defaults to `blur(14px)`; `.btn--frosted` and the product-features-animation overlay use `blur(6px)`.

### Input field

Text / email / select. The demo-form's recipe:

- Background: `white`
- Padding: `10px 14px`
- Rounded: `8px`
- Font: inherit (Poppins) at `15px / 1.4`
- Border: inset `1px solid var(--line)` (no outer border — uses inset box-shadow)
- Focus: inset `2px solid teal`
- Invalid: inset `1px solid` rose-500; on focus, inset `2px solid` rose-500

Every input has a `<label for>` (visible or `class="sr-only"`). Required inputs use `aria-required="true"`; status messages use `aria-live="polite"`.

### Accessibility primitives (non-negotiable)

- Skip-to-main link as the first focusable element on every page.
- `id="main"` on the main content target.
- Every input has a `<label for>` (visible or `sr-only`).
- `:focus-visible` rings on all interactive elements — `2px solid var(--aqua)`, offset 2px.
- Tab order matches visual order; no `tabindex > 0` without rationale.
- WCAG AA contrast on body text against every background it appears on.

## Do's and Don'ts

### Do

- **Do** start every section with paper gradient + grain. That baseline is what makes the brand cohere.
- **Do** pick a section signature (Quiet / Imagery / Spotlight / Editorial) before picking colors.
- **Do** use `button-primary` (teal-filled) as the default CTA on light surfaces.
- **Do** use full `ink` for headings + bold emphasis, `ink-soft` for paragraph copy. Color softening is flat, never opacity.
- **Do** pass photos and SVG illustrations through `.fx-dither` — no exceptions.
- **Do** mount existing components (`testimonial-card`, `site-footer`, `site-nav`, etc.) rather than hand-building. The components already implement the recipes.
- **Do** maintain WCAG AA contrast on every text-bearing surface.
- **Do** pad first sections by `calc(--nav-height + breathing-room)` on pages with sticky nav.

### Don't

- **Don't** introduce new colors outside the palette. If genuinely needed, add to `DESIGN.md` first.
- **Don't** introduce new gradients outside the closed list of 7. Re-orientation is fine; new stop colors is drift.
- **Don't** soften ink with opacity. `rgba(11,26,43,0.78)` is push-back-worthy — use `ink-soft` instead.
- **Don't** center body copy. Left-aligned, always — except for a single-line editorial closer or the hero subtitle (which matches its H1).
- **Don't** put two halftone-video heroes on the same page. One per page, max.
- **Don't** hand-tune shader, dither, grain, or halftone parameters. The kit's values are the brand fingerprint.
- **Don't** ship a section without halftone or grain treatment. The brand depends on this vocabulary.
- **Don't** ship a `.btn` without corner ticks (unless explicitly the in-card variant).
- **Don't** re-derive a gradient, dither mask, or grain SVG when the kit already has it.
- **Don't** mix rounded and sharp corners in the same view.
- **Don't** add an eyebrow above a hero H1. Eyebrows mark sections (above H3), not page-defining moments.
- **Don't** use more than one pinned-scroll moment per page.

## Section Anatomy

Every section on the Renoverse site is built from a small, fixed kit of layers. **Every section has a paper background (gradient) and grain** — non-negotiable. On top of that baseline, two optional layers (dithered photo + halftone bloom) compose with the base into four named **section signatures**.

When someone describes the *feeling* of a section, map it to a signature first; the gradient choice (which dark/light variant) is then a separate axis of color lean.

### The four signatures

| Signature | Gradient | Grain | Dithered art | Halftone bloom | When to reach for it |
|---|:-:|:-:|:-:|:-:|---|
| **Quiet** | ✓ | ✓ | — | — | Most sections default here. Feature rows, intros, demo form, footer. Calm, content-density-first. |
| **Imagery** | ✓ | ✓ | ✓ | — | The section has supporting visuals (project photo, architectural illustration). The dither makes those visuals brand-consistent. |
| **Spotlight** | ✓ | ✓ | — | ✓ | "This is a moment." Atmospheric weight without imagery — the bloom under a heading or CTA. Great for text-only testimonials, important callouts. |
| **Editorial** | ✓ | ✓ | ✓ | ✓ | The full carousel signature. Used when a section is *both* a moment and has imagery. Most weighted — use sparingly. |

### How to compose a section

1. Pick the signature based on what the section is.
2. Pick a gradient — dark for weighted/editorial, light for breathable.
3. Pick a grain tint — `.fx-grain--warm` over dark gradients, `.fx-grain--ink` over light gradients.
4. Add the optional layers if the signature calls for them.
5. Wrap the host in `position: relative; isolation: isolate; overflow: hidden;` so layers stay scoped.

### Composition order (bottom → top)

1. Base gradient (`.fx-grad-*`)
2. Dithered photo (`.fx-dither.fx-dither--photo`) — if signature is Imagery or Editorial
3. Halftone bloom (`.fx-halftone-bloom`) — if signature is Spotlight or Editorial
4. Paper grain (`.fx-grain--warm` or `.fx-grain--ink`)
5. Content (z-index: 1)

### Reference composition per signature

| Signature | Lives in the codebase as |
|---|---|
| Quiet | `product-features-cards` (homepage 2×2 + Solutions 3-up), `team-section` paper variant, About backstory section |
| Imagery | No live mirror — see Common Requests "Add a photo or imagery section" |
| Spotlight | `testimonial-card` (homepage; gradient + grain) |
| Editorial | `product-features-primary` (Solutions; full stack — gradient + dithered halftone PNG + WebGL halftone shader + grain) |

If someone asks for a section type that doesn't fit one of these signatures, **push back** and ask which signature they're imagining. Don't invent a fifth.

## Common Requests

Operator-language requests, translated into which signature + which kit pieces to reach for. When the request isn't here, find the closest neighbor and route to that recipe.

### "Make a new highlight section with the brand's full effect stack"

This is the **Editorial signature**. Live reference: `product-features-primary`. Mirror its layer stack:

1. **Host** — `position: relative; isolation: isolate; overflow: hidden;`.
2. **Base gradient** — one of the three dark vertical gradients (`dark-oxford-blue-teal-cream`, `dark-oxford-blue-azure-ice`, `dark-oxford-blue-cool-blue-cream`). All three go dark-oxford → accent → tint, top-down — that vertical movement is what makes panels feel like one family.
3. **Dithered photo** — `<div>` with photo as `background-image`, classes `.fx-dither.fx-dither--photo`. Tune opacity ~0.05 over saturated gradients, up to ~0.18 over flat color.
4. **Halftone bloom** OR **WebGL halftone shader** — `.fx-halftone-bloom` for atmospheric focal moment (override `--fx-bloom-mask` to position). For the brand's animated halftone, mount the shared shader: `HalftoneShader.attach(canvas, { source, mode: 'overlay', front: '#tint' })`. Never re-implement.
5. **Paper grain** — `.fx-grain--warm` (warm tint pairs with dark/saturated surfaces).
6. **Content** — JetBrains Mono eyebrow + Poppins H3 (section header) + optional Cormorant italic H2 (editorial moment) + Poppins body + `.btn .btn--filled` CTA.

For "highlight without imagery" → drop layer 3 → that's the **Spotlight signature**. Mirror `testimonial-card`.

### "I need a new button"

Default to `button-primary` (`.btn .btn--filled`). Decide variant by surface, not hierarchy:

| Surface | Variant |
|---|---|
| Primary CTA on any light surface | `button-primary` |
| Over a photo / dark surface (e.g. nav over hero) | `button-frosted` |
| Secondary action on a light/paper surface | `button-secondary` |
| Inside a card or form | `button-primary` *without* corner-tick spans (the in-card variant) |

Never invent a new button silhouette.

### "Add a testimonial / customer quote"

**Spotlight signature** when text-only; upgrade to **Editorial** if a customer project photo is included.

Mount the live `testimonial-card` component (`shared/components/testimonial-card/`). Three modes via `data-image` / `data-logo` / neither.

Visual recipe:
- **Card host**: `position: relative; isolation: isolate; overflow: hidden;` with `rounded.lg` (~14px).
- **Layers** (bottom → top): dark vertical gradient (`dark-oxford-blue-teal-cream` is the conventional default; can be re-oriented to 160deg diagonal as the live homepage card does), dithered photo (Editorial only, opacity ~0.05–0.10), halftone bloom faded around heading, warm grain, content.
- **Content** (left-aligned, on top of overlays): customer logo top-left (filtered to white if needed, max ~48px), blockquote in Poppins regular at Body, white, max-width ~42ch. Attribution: name in Poppins 600 white, role/company in Poppins 400 white at Small (~13px). Hierarchy from size + weight, not opacity.

### "Add a hero video to a new page" / "Add a hero like the homepage"

Use the WebGL halftone-video shader. **Reuse the homepage's exact configuration** — only the video source changes:

```html
<header class="hero">
  <div data-halftone-video
       data-src="assets/your-video.mp4"
       data-front="#2C6F75"
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

**Don't drift `data-cell`, `data-radius`, `data-contrast`, `data-grain`** — they're the shader's brand fingerprint. Sanctioned exception: change `data-front` to a different brand hex if the page leads with a different brand color (an ICP-themed page on `azure` or `cool-blue`).

The **`.scrim`** element is required — top + bottom white-gradient overlay (~45% opacity at top and bottom, transparent through middle) ensuring H1 + sub-copy remain legible regardless of which video frame is rendering. Don't omit; halftone-video luminance varies frame-to-frame.

**One halftone-video per page, max.**

#### Hero anatomy — the rules

Heroes are a fixed two-element composition: **H1 + Body subtitle. Nothing else.**

- **No eyebrow.** Eyebrows mark sections (above H3), not heroes. If the operator asks for "a tagline above the headline," push back.
- **H1** — Cormorant Garamond italic 600, `--fs-h1`. Alignment is contextual (left or centered per page). Mirror the ICP carousel title-slide for size.
- **Subtitle** — plain `<p>` in Body register: Poppins 400 at `--fs-body` (16px), `--lh-body`, full `--ink`. In a hero, alignment matches the H1. Max-width ~60ch on multi-line copy. The H1's massive Cormorant italic is what carries the hierarchy; the subtitle is just paragraph copy.
- **Both elements share the same horizontal axis** — they're one composition. When the H1 is centered, this is the only place on the site where multi-line centered body copy is sanctioned.

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
  <footer class="site-footer" data-site-footer></footer>
  <script src="shared/components/site-nav/index.js"></script>
</body>
```

### "Add a feature highlights section" / "Add a features section"

Feature highlights are a **family**. Pick the variation by density (scannable vs. detailed) and visual weight (Quiet for content-density, Spotlight/Editorial for product moments). Two are built; four are proposed patterns the system supports.

| User says… | Variation | Signature | Status |
|---|---|---|---|
| "Quick scannable feature grid," "summary of features" | 1. Compact 2×2 cards | Quiet | ✓ `product-features-cards` `data-cols="2"` |
| "Solution pillars with photos," "feature cards with imagery" | 2. Breathing 3-up cards | Quiet | ✓ `product-features-cards` `data-cols="3"` |
| "Feature deep-dives," "more space per feature" | 3. Stacked rows | Quiet | proposed — recipe in REVISIONS.md |
| "Product spotlight rhythm," "alternating feature pages with motion" | 4. Alternating blurb + highlight | Quiet ↔ Imagery | ✓ `product-features-primary` (Solutions) |
| "Big flagship feature," "hero-after-hero" | 5. Full-screen single | Editorial | proposed |
| "Two features side-by-side" | 6. 2-up split | Quiet ↔ Quiet or Quiet ↔ Imagery | proposed |

#### Variation 1 — Compact card grid (4-up, 2×2) — *exists*

**Use when:** scannable summary of 3–4 features. Dense, fits in one viewport, low visual weight.

- Mount `product-features-cards` with `data-cols="2"`.
- Each card: bold-body title + Small-role body + flat 3:1 cropped image strip (or hatch placeholder). Drop-shadow card on cream surface.
- Surface: section is transparent — host page provides the warm-paper backdrop (`.fx-grad-sky-blue-ice` on the homepage). **Quiet signature** with a frosted-card layer.
- Animation: staggered 24px slide-up + fade-in on enter (~600ms ease-out, GSAP ScrollTrigger, 80ms stagger). Pre-wired.

> **Don't widen to a 5+ card grid.** The brand reads card families as 3 or 4, max. If more features are requested, propose a stacked or alternating variation.

#### Variation 2 — Breathing card row (3-up with photo) — *exists*

**Use when:** features need editorial weight backed by imagery — solution pillars, product capabilities with screenshots.

- Mount `product-features-cards` with `data-cols="3"` and (optionally) `data-heading="..."` for a centered Cormorant H2 above. Solutions "And the rest comes built-in." is the live mirror.
- Each card: bold-body title + full Body register copy + natural-aspect image well. Flat cream card, no shadow.
- Surface: transparent; host page provides the surface (white on Solutions). **Quiet signature.**

#### Variation 3 — Stacked rows — *proposed*

**Use when:** each feature needs more space than a card can hold — feature deep-dives, product page detail.

- Vertical stack of full-width rows. Each row: small photo/screenshot left (or right), eyebrow + H3 + 2–4 line body + optional inline link on the other side. No alternating — every row reads the same way.
- Surface: `.fx-grad-ice-cream-beige` + `.fx-grain--ink`. **Quiet signature.**
- Row spacing: `--section-y-tight` between rows.
- Photo: 16/10 or similar; passes through `.fx-dither.fx-dither--photo` if stock imagery, unfiltered for product UI screenshots.
- Animation: each row fades in + slides up 24px on viewport enter.

#### Variation 4 — Alternating blurb + product highlight — *exists* (`product-features-primary`)

**Use when:** "feature spotlight" rhythm — full-width product moments where each feature gets its own visual centerpiece, alternating left/right.

- Each feature is a near-full-vw row: blurb on one side (~40%) + product highlight on the other (~60% — large screenshot, illustration, or short looping video). Alternate per row.
- Blurb: eyebrow + H3 + optional H2 (Cormorant italic editorial moment) + lead paragraph + optional `.btn .btn--filled` or `.btn .btn--white` CTA.
- Product highlight: large media block, dithered if photo, unfiltered if product UI. Can include short autoplay-loop muted video.
- Surface: alternates per row between `.fx-grad-ice-cream-beige` (Quiet) and a dark vertical gradient (Imagery — dark + grain + dithered media). **Quiet ↔ Imagery, alternating per row.** No halftone bloom (would push to Editorial and overwhelm the rhythm).
- Spacing: each row min `80vh`. **Don't pin-scroll** — the product-features-animation owns that slot.
- Animation: as each row enters viewport, the side currently coming in slides 32px from its outside edge with fade-in (600ms, ease-out).

#### Variation 5 — Full-screen single product highlight — *proposed*

**Use when:** *one* feature deserves its own moment — flagship capability, headline differentiator, editorial hero-after-hero.

- One section, `min-height: 100vh`. Full-bleed media (image, looped video, animated UI screen) with copy overlaid in a corner or beside it.
- Surface: dark vertical gradient. **Editorial signature** — full stack.
- Copy: eyebrow + Cormorant H1 (yes, H1-sized — this is a moment) + lead + CTA.
- Animation: static, parallax 0.6×, or pinned scroll (only if product-features-animation isn't on the page — one pinned moment per page max).

#### Variation 6 — 2-up split — *proposed*

**Use when:** two features need equal weight and they're parallel/contrasting ("before / after," "you / your client").

- Two columns, equal width, ~`60vh` tall each. Each column: eyebrow + H3 + body + optional small image. Alternate the surface — one column on `.fx-grad-ice-cream-beige`, the other on `.fx-grad-dark-oxford-blue-teal-cream` (or any other dark vertical). Contrast paper-to-dark *is* the message.
- The optional small image, if used, passes through `.fx-dither.fx-dither--photo` → makes the imagery-bearing column **Imagery**. Without an image, the dark column is **Quiet** on a saturated gradient.
- Animation: both columns fade in together as the section enters viewport.

#### Animation rules (all variations)

The brand's motion vocabulary is *quiet, deliberate, scroll-driven*. **Don't add hover-bounce, micro-interactions, or auto-playing carousels.**

- **Default entrance:** 24–32px slide from below + opacity 0 → 1, 600ms, ease-out.
- **Trigger:** GSAP ScrollTrigger, fire when row's top hits ~80% of viewport.
- **Stagger** (multi-item rows): 80ms between items.
- **One pinned-scroll moment per page, max.** `product-features-animation` claims that slot on the homepage.
- **Reduced-motion:** wrap all entrance animations in `prefers-reduced-motion: no-preference`. Reduced-motion users see the section's final state immediately.

### "Add a photo or SVG illustration"

Every photo or SVG illustration on the site must pass through the **dither dot-mask** (`.fx-dither`). Photos additionally take `.fx-dither--photo` (carousel pre-mask filter recipe).

Rules:
- Don't bake the dot pattern into the SVG itself — apply `.fx-dither` on a wrapper or directly so dither stays consistent across zoom levels.
- Export SVGs at 2× rendered size so dither sampling has detail to bite into.
- Don't drift the dither parameters (4×4 cell, 0.5px solid dot, 1.6px fade). Canonical in `effects:` block above.

### "Add a stats strip" / "Show our numbers" / "Add a proof section"

**Quiet signature.** Two-column layout: short label sentence on the left + table-of-numbers on the right, divided by horizontal rules.

> **No live mirror.** Build from the recipe.

- **Layout:** `display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px;` — label left, table right. Stack to one column at ≤960px.
- **Left column:** one short body-size sentence (Poppins 16px), `--ink`, max ~24ch.
- **Right column:** stack of rows. Each row: `display: grid; grid-template-columns: 1fr auto;` with stat name (Poppins 14px) on the left, big number on the right. Number uses `--fs-h2` (clamp 32–52px), weight 600, letter-spacing -0.02em, white-space: nowrap. `border-top: 1px solid var(--line)` between rows; last row also `border-bottom`. ~22px vertical padding per row.
- **Surface:** `.fx-grad-ice-cream-beige` default. Add `.fx-grain--ink`.

### "Add a final CTA before the footer" / "Add a closing call-to-action"

The brand's go-to "and now do this" moment. **No live mirror today.**

- **Layout:** `display: flex; align-items: center; justify-content: space-between; gap: 24px;` — italic Cormorant H2 on the left, `.btn .btn--filled` on the right. Stack to column at ≤540px.
- **Heading:** **H2** — Cormorant Garamond italic 500, `--fs-h2` (32–52px), max ~30ch. *"Bring order into complexity."* — short, declarative, sentence-shaped not label-shaped. Don't load with sub-copy.
- **Button:** always `.btn .btn--filled`, pointing at `demo.html` or whatever the primary conversion goal is.
- **Vertical padding:** `padding: clamp(72px, 9vw, 112px) 0 clamp(48px, 6vw, 72px);` — generous on top, slightly less on bottom so the section settles into whatever follows (typically the dark footer slab).

### "Add an editorial closer" / "Add a closing italic line at the end of a section"

A small but recognizable brand pattern: a single italic Cormorant line at the bottom of a section, centered, in `--teal`. Used as a one-line sign-off.

> **No live mirror today.**

**Recipe:** H2 styling (Cormorant Garamond italic 500, `--fs-h2`, `--lh-h2`, `--ls-display`) with two overrides: `color: var(--teal)` and `text-align: center`. Max ~60ch, `margin: clamp(56px, 7vw, 88px) auto 0`.

This is one of the **rare exceptions to "no centered copy"** — single line, deliberately, for editorial weight. **Multi-line centered closers are not allowed.**

### "Add typology cards" / "Add a 3-up editorial card grid with photos"

Three cards in a row, each with a photo on top and a frosted-glass caption below.

> **No live mirror today** — homepage typology block was retired; the live 3-up pattern is `product-features-cards` with `data-cols="3"`. When the *frosted-caption* variant is requested specifically, build from recipe.

- **Card host:** `display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; isolation: isolate; background: var(--cream); box-shadow: 0 1px 0 rgba(11,26,43,.06), 0 18px 40px -22px rgba(11,26,43,.22);`
- **Photo (top):** `position: relative; aspect-ratio: 1280/832;` with `<img>` filling via `position:absolute; inset:0; width:100%; height:100%; object-fit:cover;`. Pass through `.fx-dither.fx-dither--photo` for stock photos (architectural product screens usually ok unfiltered).
- **Caption (bottom):** the `frosted-caption` atom (see Components above).
- **Grid:** `display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(20px, 2.4vw, 32px); align-items: stretch;` — collapse to 1-column at ≤960px.
- **Heading above the grid:** H2 (Cormorant italic, `--fs-h2`), centered, max ~60ch. Centered is the **deliberate exception** for these cards.

### "Wrap multiple sections in one shared paper backdrop"

The **paper-zone** architectural pattern: a single host that wraps two or more adjacent sections so they share one continuous warm-paper surface (gradient + grain) instead of each section painting its own.

> **No live mirror today** — the only paper-backed section left after the homepage redesign is `team-section`, which absorbed the paper surface itself (`data-theme="paper"` on `[data-team-section]`). Recipe below if a future page needs 2+ sections inside one warm zone.

- **Host:** `position: relative; isolation: isolate; overflow: hidden;` with `.fx-grad-ice-cream-beige`, `.fx-grain--ink` as a positioned child, optionally `.fx-halftone-bloom` (override `--fx-bloom-mask`).
- **Children:** inner sections use `position: relative; z-index: 1;` so they render above the host's grain/bloom layers.

**When to use paper-zone vs. per-section gradients vs. component-owned theming:**
- **Component-owned** (default for single sections that need a paper surface) — let the component carry its own `data-theme="paper"` styling. team-section is canonical.
- **Paper-zone wrapper** — when 2+ adjacent sections should feel like one zone.
- **Per-section gradients** — when each section is its own moment with its own color identity.

**Don't wrap a single section in paper-zone** — adds nothing over component-owned or `.fx-grad-ice-cream-beige` directly.

### "Add a footer"

There is **one** footer site-wide: `site-footer` (`shared/components/site-footer/`), mounted on every page via `<footer class="site-footer" data-site-footer></footer>`. The dark `#0a0a0a` and "transparent + ink" variants from earlier iterations were retired in PR #21; the wave-gradient footer is now the single canonical footer.

- **Surface:** `var(--beige)` paper backdrop with a full-viewport WebGL wave-gradient shader (Paper's `Wave` component, brand trio: lavender / mint / cream) on top, plus `.fx-grain--ink` paper-grain overlay. Bottom-anchored `min-height: 100vh` (collapses to content-driven height at the 820px breakpoint).
- **Text color:** `var(--oxford-blue)` (`#022E41`) for everything — newsletter labels, legal links, social icons, copyright. Meets WCAG AA against the lavender / mint / cream wave at every frame. **Do not swap to `--ink` or `--white` per-element.**
- **Stack** (top → bottom, anchored to bottom):
  1. **Newsletter** (right-aligned): mono uppercase eyebrow, single-line `<input type="email">`, circular `.btn--white`-style arrow puck submit. `aria-required="true"` on input + `aria-describedby` for status.
  2. **Utility row** (above hairline divider): social icons (left), legal links + copyright (right). Underline-on-hover; focus ring uses `var(--aqua)`.
  3. **Brand wordmark**: large Renoverse logo grounded at bottom-left. Width-driven sizing (height auto) so logo never deforms.

**Don't:** reintroduce dark/light footer variants, change text color per page, add page-level CSS targeting `.site-footer`.

### "Add a newsletter signup" / "Add an inline email signup"

Small inline-form pattern (distinct from the demo-form's full card).

- **Layout:** vertical stack inside max ~360px column. Heading (eyebrow style), one short paragraph (Poppins 13px, 70% ink), `<input type="email">`, `.btn .btn--filled` Subscribe, status message line, fine-print legal.
- **Input:** `padding: 10px 14px; font-size: 14px; background: rgba(255,255,255,.6); border: 1px solid rgba(11,26,43,.18); border-radius: 8px;` — focus border `var(--aqua)`, bg `#fff`.
- **Button:** override clearance — `--btn-clearance: 0; margin: 18px 0 0 9px;` — so the corner-tick column insets with the input edge, with 18px gap so hover ticks clear the input.
- **Required label (a11y):** the live form ships `<label for="newsletter-email" class="sr-only">Email address</label>` before the input. Any new inline-newsletter must include the same.
- **Status:** `aria-live="polite"`; placeholder for "Thanks — we'll be in touch."

### "Add a product-feature scroll moment" / "Add something like the product-features-animation"

The site already has one big pinned-scroll product moment — the `product-features-animation` component (formerly `stack-animation`). 200vh tall sticky-pinned section, 3D stack of five legacy app panels collapsing into a single Renoverse panel.

**Use sparingly — one per page, max.** Pinned scrolls dominate page rhythm.

**Don't restyle without testing the sticky-nav interaction.** Documented historical conflict: sticky nav's `top:0` competes with the pinned `top:0`, ScrollTrigger lands wrong. If a request asks for the product-features-animation on a new page or with a sticky nav above, raise the conflict and reach for `--nav-height` to offset ScrollTrigger.

**To use:** drop in `<div data-product-features-animation></div>` plus GSAP + ScrollTrigger CDN scripts and the component's CSS/JS. Self-contained — don't integrate page-level styles.

### "Use a brand gradient"

The brand has a closed list of 7. Each token name describes its actual color stops in declared order. Direction defaults: 180deg vertical, 90deg horizontal signature, radial top-center for paper.

**Vertical gradients (5):**

| Stops | Where it's used | Token |
|---|---|---|
| sky-blue → ice | Capabilities section header backdrop (homepage) | `--grad-sky-blue-ice` |
| dark-oxford-blue → teal → cream | Testimonial card; ICP project-managers panel | `--grad-dark-oxford-blue-teal-cream` |
| dark-oxford-blue → azure → ice | ICP principal-architects panel | `--grad-dark-oxford-blue-azure-ice` |
| dark-oxford-blue → cool-blue → cream | ICP junior-designers panel | `--grad-dark-oxford-blue-cool-blue-cream` |
| cream → aqua → teal | product-features-primary row backdrop | `--grad-cream-aqua-teal` |

**Radial paper backdrop:**

| Stops | Where it's used | Token |
|---|---|---|
| ice → cream → beige (radial, origin top-center) | About hero, Solutions hero, team-section paper variant, demo-form | `--grad-ice-cream-beige` |

**Signature (horizontal — accent line, NOT a section fill):**

| Stops | Where it's used | Token |
|---|---|---|
| blue → aqua → teal (90deg) | Brand mark, hairlines, accent rules, eyebrow underlines, Renoverse logo | `--grad` |

**Orientation variations are sanctioned.** Same stop colors at different angle (diagonal) or geometry (radial) when composition calls for it. Live example: testimonial card uses canonical `dark-oxford-blue → teal → cream` stops at 160deg diagonal instead of 180deg vertical. **Drift = changing stop colors. Re-orienting is not drift.**

**If a request asks for a gradient that isn't on this list** — "pink gradient," "sunset gradient," "dark blue gradient" — push back: ask which existing gradient is closest, or propose adding to `DESIGN.md` (with operator approval).

### "Make this heading bigger / smaller / different"

Type sizes come from the scale tokens (`--fs-h1` … `--fs-small`). **Don't hand-author a new size.** Role determines family + alignment:

- Hero / page-defining moment (H1) → Cormorant Garamond italic, ~48–96px, alignment per page.
- Editorial moment / closer (H2) → Cormorant Garamond italic, ~32–52px (left, or centered for a single-sentence editorial moment).
- Section header (H3) → Poppins 500, left, ~20–28px.
- Eyebrow above a section header → JetBrains Mono uppercase, `--xwide`, only above an H3.
- Body → Poppins 16px, left. Section intros and hero subtitles are also Body.
- Small → Poppins ~12.5px, left. Fine print, captions, role-under-name, footer legal.

### "Make this section centered" / "Center the copy"

**Push back on body and H3.** Body copy and H3 section headers are left-aligned, always. Exceptions are baked into specific roles, not granted ad-hoc:

- **H1 alignment is contextual** — left or centered, picked per page. The hero is the only composition that authorizes centered multi-line copy (H1 + subtitle read as a single unit).
- **H2 may be centered** when used as a single editorial sentence — final-CTA closer, italic Cormorant closer line.
- **Hero subtitle** (Body register under the H1) is centered when the H1 is centered.
- Everything else stays left-aligned. **Multi-line centered body copy outside a hero doesn't belong on this site.**

### "Add navigation" / "Change the nav"

Use the `data-site-nav` component (`shared/components/site-nav/`). Don't hand-build nav markup — the component owns layout, mobile sheet, and the sticky/frosted scrolled state. Set `data-mode="solid"` on the mount when the page has no hero behind the nav (e.g. `solutions.html`, `about.html`, `demo.html`).

## Reference Compositions

When in doubt, mirror these working examples.

| Request shape | Mirror |
|---|---|
| Branded section with full effect stack (Editorial) | `shared/components/product-features-primary/` (Solutions) — gradient + dithered halftone PNG + WebGL halftone shader + grain |
| Customer testimonial / quote card (Spotlight) | `shared/components/testimonial-card/` (homepage) |
| Hero with video | `<section class="hero">` in `index.html` (mounts `[data-halftone-video]`) |
| Hero on paper (no video) | `<section class="page-hero">` in `solutions.html` and `about.html` |
| Paper-backed section | `[data-team-section][data-theme="paper"]` (component-owned paper surface; no separate wrapper) |
| Single canonical footer (wave-gradient over beige paper) | `shared/components/site-footer/` (every page) |
| Inline newsletter signup | `shared/components/site-footer/index.js` (right column of top row) |
| Demo / contact form (full card) | `shared/components/demo-form/` (plain CSS, no Tailwind) |
| Team / about block | `shared/components/team-section/` |
| Compact 2×2 feature grid (homepage core capabilities) | `shared/components/product-features-cards/` `data-cols="2"` |
| Breathing 3-up feature row (Solutions "rest comes built-in") | `shared/components/product-features-cards/` `data-cols="3"` |
| Pinned-scroll product feature | `shared/components/product-features-animation/` (homepage; one per page max) |
| Editorial card with photo + frosted caption (typology cards) | No live mirror — recipe in Common Requests |
| Frosted-glass caption over media | No live mirror — `frosted-caption` atom + recipe |
| Stats / proof strip | No live mirror — recipe in Common Requests |
| Editorial closer (italic teal sign-off line) | No live mirror — recipe in Common Requests |
| Final CTA before footer | No live mirror — recipe in Common Requests |

## Component contract (operational)

Every component in `shared/components/` ships the full contract:
- `index.css`
- `index.js`
- `README.md`
- `test.html`

Three components ship `index.css` + `index.js` only by operator decision (PR #31): `halftone-video`, `site-footer`, `site-nav`. Don't add `README.md` / `test.html` to those three on a touch. New components default to the full contract.

New behavior that doesn't fit an existing component → create a new component with the full contract, not page-local CSS / JS.

## Maintenance

### The propagation rule

`DESIGN.md` (this file) is the source of truth for tokens and design intent. **`shared/tokens.css` is a regenerated mirror** of the YAML frontmatter — it exists because browsers don't read markdown.

**Every edit to a token in `DESIGN.md` MUST be mirrored to `shared/tokens.css` in the same session.** This is not optional. The propagation is done in-context by the editing agent (Claude Code, Claude Desktop, or any other Claude surface) using the deterministic mapping rules below.

Workflow:
1. Edit the token in `DESIGN.md` YAML frontmatter.
2. Walk the mapping rules below to find the corresponding `--token` in `shared/tokens.css`.
3. Update `shared/tokens.css` to match.
4. Commit both files together. PR review catches drift.

If a token edit lands without the corresponding `tokens.css` update, the next agent session is responsible for catching and fixing it.

**Style-guide conformance:** every code change is checked against this document. If a value drifts, fix the change to match this guide. Updating `DESIGN.md` *instead of* the change requires explicit operator approval — surface the divergence clearly: *"This change diverges from `DESIGN.md`. I recommend updating [section] to reflect [X] — approve?"* Never silently update `DESIGN.md`.

### Mapping rules — YAML → tokens.css

The translation is deterministic. Every CSS variable in `shared/tokens.css` maps to one specific YAML field below. Fields not in this table (e.g., the semantic color aliases, the `effects` block, the `components` block, the `rounded` block, the static `spacing.gutter` / `section-y` companions, the `spacing.xs/sm/md/lg/xl` 8px grid) are **not emitted** to `tokens.css` — they live in YAML for spec tooling, documentation, or future use.

#### Colors → `--<name>: <hex>;`

The literal Renoverse names map 1:1. The semantic aliases (`primary`, `secondary`, `tertiary`, etc.) are **NOT emitted** — they exist in YAML for DESIGN.md spec tooling only.

| YAML field | tokens.css line |
|---|---|
| `colors.ink` | `--ink: #0a0a0a;` |
| `colors.ink-soft` | `--ink-soft: #3a3a3a;` |
| `colors.white` | `--white: #FFFFFF;` |
| `colors.beige` | `--beige: #FAFAF7;` |
| `colors.cream` | `--cream: #F2EBD8;` |
| `colors.ice` | `--ice: #E5F4F1;` |
| `colors.sky-blue` | `--sky-blue: #7FE3CB;` |
| `colors.aqua` | `--aqua: #5EC9B7;` |
| `colors.teal` | `--teal: #2D6F75;` |
| `colors.cool-blue` | `--cool-blue: #5BA7C9;` |
| `colors.azure` | `--azure: #5D6FB8;` |
| `colors.oxford-blue` | `--oxford-blue: #022E41;` |
| `colors.dark-oxford-blue` | `--dark-oxford-blue: #0B1A2B;` |
| `colors.line` (8-digit hex `#1a1a1a1a`) | `--line: rgba(0, 0, 0, 0.10);` *(emit as rgba, not 8-digit hex)* |

#### Font families → `--font-<key>: '<primary>', <fallback>;`

| YAML field | tokens.css line |
|---|---|
| `fontFamilies.serif` | `--font-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;` |
| `fontFamilies.sans` | `--font-sans: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;` |
| `fontFamilies.mono` | `--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;` |

#### Typography → `--fs-<role>` and `--lh-<role>`

For each role (`h1`, `h2`, `h3`, `eyebrow`, `body`, `small`):
- **Font size:** if `fontSizeFluid` is present, use it; otherwise use `fontSize`. Emit as `--fs-<role>: <value>;`.
- **Line-height:** emit as `--lh-<role>: <value>;`.

| YAML field | tokens.css line |
|---|---|
| `typography.h1.fontSizeFluid` | `--fs-h1: clamp(48px, 7vw, 96px);` |
| `typography.h1.lineHeight` | `--lh-h1: 1.10;` |
| `typography.h2.fontSizeFluid` | `--fs-h2: clamp(32px, 4vw, 52px);` |
| `typography.h2.lineHeight` | `--lh-h2: 1.10;` |
| `typography.h3.fontSizeFluid` | `--fs-h3: clamp(20px, 2vw, 28px);` |
| `typography.h3.lineHeight` | `--lh-h3: 1.30;` |
| `typography.eyebrow.fontSizeFluid` | `--fs-eyebrow: clamp(11px, 0.9vw, 13px);` |
| `typography.eyebrow.lineHeight` | `--lh-eyebrow: 1.20;` |
| `typography.body.fontSize` *(no fluid)* | `--fs-body: 16px;` |
| `typography.body.lineHeight` | `--lh-body: 1.55;` |
| `typography.small.fontSize` *(no fluid)* | `--fs-small: 12.5px;` |
| `typography.small.lineHeight` | `--lh-small: 1.5;` |

The per-role `letterSpacing` field inside typography composites (`typography.h1.letterSpacing` etc.) is **not emitted** — it exists for spec tooling. Use the standalone `letterSpacing:` block (below) for tokens.css.

#### Letter-spacing → `--<key>` (note the rename for `display`)

| YAML field | tokens.css line |
|---|---|
| `letterSpacing.tight` | `--tight: 0.02em;` |
| `letterSpacing.wide` | `--wide: 0.18em;` |
| `letterSpacing.xwide` | `--xwide: 0.32em;` |
| `letterSpacing.display` | `--ls-display: -0.01em;` *(note: prefix differs)* |

#### Spacing / layout → `--<key>`

Only the fluid layout tokens and `nav-height` are emitted. The `xs/sm/md/lg/xl` 8px grid and the static `gutter` / `section-y` companions are **not emitted** — they're spec-tooling fallbacks for tools that don't understand `clamp()`.

| YAML field | tokens.css line |
|---|---|
| `spacing.container` | `--container: 1240px;` |
| `spacing.gutter-fluid` | `--gutter: clamp(20px, 4vw, 56px);` |
| `spacing.section-y-fluid` | `--section-y: clamp(72px, 9vw, 112px);` |
| `spacing.section-y-tight-fluid` | `--section-y-tight: clamp(48px, 6vw, 80px);` |
| `spacing.nav-height` | `--nav-height: 72px;` |

#### Gradients → `--grad` and `--grad-<name>`

The `signature` gradient is special-cased to `--grad` (no suffix). All others map to `--grad-<key>`.

**Token reference resolution.** Gradient strings contain `{colors.foo}` references. When emitting to CSS, replace `{colors.foo}` with `var(--foo)`.

| YAML field | tokens.css line |
|---|---|
| `gradients.signature` | `--grad: linear-gradient(90deg, var(--cool-blue) 0%, var(--aqua) 50%, var(--teal) 100%);` |
| `gradients.sky-blue-ice` | `--grad-sky-blue-ice: linear-gradient(in oklab 180deg, var(--sky-blue) 0%, var(--ice) 100%);` |
| `gradients.dark-oxford-blue-teal-cream` | `--grad-dark-oxford-blue-teal-cream: linear-gradient(in oklab 180deg, var(--dark-oxford-blue) 0%, var(--teal) 70%, var(--cream) 100%);` |
| `gradients.dark-oxford-blue-azure-ice` | `--grad-dark-oxford-blue-azure-ice: linear-gradient(in oklab 180deg, var(--dark-oxford-blue) 0%, var(--azure) 72%, var(--ice) 100%);` |
| `gradients.dark-oxford-blue-cool-blue-cream` | `--grad-dark-oxford-blue-cool-blue-cream: linear-gradient(in oklab 180deg, var(--dark-oxford-blue) 0%, var(--cool-blue) 70%, var(--cream) 100%);` |
| `gradients.cream-aqua-teal` | `--grad-cream-aqua-teal: linear-gradient(in oklab 180deg, var(--cream) 0%, var(--aqua) 55%, var(--teal) 100%);` |
| `gradients.ice-cream-beige` | `--grad-ice-cream-beige: radial-gradient(120% 80% at 50% 0%, var(--ice) 0%, var(--cream) 45%, var(--beige) 100%);` |

#### Not emitted to tokens.css

These YAML blocks live for documentation and spec-tooling purposes only. Editing them does **not** require a `tokens.css` change:

- `colors.primary`, `colors.secondary`, `colors.tertiary`, `colors.neutral`, `colors.surface`, `colors.on-surface`, `colors.accent`, `colors.accent-cool`, `colors.accent-deep` (semantic aliases)
- `typography.{role}.fontFamily`, `fontWeight`, `fontStyle`, `letterSpacing`, `textTransform` (spec-tooling fields; consumed by tools that read DESIGN.md, not by `tokens.css`)
- `spacing.xs`, `sm`, `md`, `lg`, `xl`, `gutter` (static), `section-y` (static), `section-y-tight` (static)
- `rounded:` block (entire block — not currently in tokens.css)
- `gradients.*` — already covered above; the static fields like `description` are doc-only
- `effects:` block (documentation of dither/grain/halftone parameters; their CSS lives in `shared/effects.css`)
- `components:` block (atomic primitive descriptions; their CSS lives in `shared/button.css` etc.)

### When in doubt

If you're unsure whether a YAML edit needs a `tokens.css` change, search `tokens.css` for the corresponding `--token` name. If it exists, propagate. If it doesn't, the field is documentation-only.

---

*Last updated 2026-05-09 — initial DESIGN.md authored from STYLE_GUIDE.md, tokens.css, button.css, effects.css, demo-form/index.css.*
