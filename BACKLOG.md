# Backlog — site-wide changes to make

Notes captured from the user. Each item names the location, the issue, and the intended fix so it can be picked up later without re-asking.

---

## 1. Demo page — typography audit

**Location:** `demo.html`.

**Issue:** the body copy on the demo page looks off — possibly a different body font, possibly a different ink color. It does not match the rest of the site.

**Fix:** audit `demo.html` against `STYLE_GUIDE.md` Part II (type scale + color tokens). Confirm body uses Poppins at the right size/weight and the ink color pulls from the canonical token, not an inline override.

---

## 2. Footer — currently inconsistent across pages, new design coming

**Locations:** `index.html`, `demo.html`, `solutions.html`, `about.html`.

**Issue:** the homepage footer differs from the footer used on Book a Demo and Product/Solutions pages. The pages are not sharing one footer.

**Fix:** the user is designing a new unified footer. Once that design lands, implement it once (likely as a shared component under `shared/components/`) and use it on **every** page — home, demo, solutions, about. Don't ship the new footer to a subset.

---

## 3. Demo page — checkmarks should match the site button language

**Location:** `demo.html` — wherever the checklist/feature checks render.

**Issue:** the checkmarks on the demo page don't share visual language with the rest of the site's button/marker treatment.

**Fix:** match the formatting used on the existing buttons (e.g. `.btn--frosted` in the ICP carousel, the homepage CTAs) — same shape/treatment/corner-tick recipe — but swap the arrow glyph for a **checkmark** glyph. The check is the only thing that changes; everything else (fill, border, ticks, sizing, color) is reused from the existing button primitive.
