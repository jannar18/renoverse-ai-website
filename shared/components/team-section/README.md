# Team section

"Our story / meet the team" block on the canonical Renoverse ink background. Eyebrow + heading + body paragraph + optional attribution (name / role) on the left, founder portrait on the right.

This is the **Team section** described in `NOTES.md` (Homepage roadmap). The default copy tells the founder-as-renovation-client origin story without naming the founder, so it can ship before the team page is finalized; swap any line via data-attributes when content lands.

## Usage

```html
<link rel="stylesheet" href="../shared/components/team-section/index.css">

<div data-team-section></div>

<script src="../shared/components/team-section/index.js"></script>
```

The component renders a `<section class="team-section">` into the mount element. With no overrides it shows the default origin-story copy and a labeled image placeholder.

## Overrides (optional)

```html
<div data-team-section
     data-eyebrow="Our story"
     data-heading="Renoverse started inside a renovation that made the problem obvious."
     data-body="Our founder lived it as a client first…"
     data-names=""
     data-role="Founder, Renoverse"
     data-image="assets/founder.jpg"
     data-image-alt="Renoverse founder"></div>
```

- `data-eyebrow` — small uppercase label above the heading. Empty string suppresses it.
- `data-heading` — the lead statement.
- `data-body` — paragraph beneath the heading. Empty string suppresses it.
- `data-names` — optional name (or comma-separated names) above the role. Empty string suppresses it.
- `data-role` — small uppercase role / affiliation. Empty string suppresses it.
- `data-image` — portrait src. Omit to render the labeled placeholder.
- `data-image-alt` — alt text for the portrait.

If both `data-names` and `data-role` are empty, the attribution divider is suppressed too.

## Dependencies

- Poppins font family (already loaded site-wide).
