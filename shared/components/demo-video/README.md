# demo-video

Single product-demo video as a centered card on a white surface. Designed for the homepage moment between the product-feature stack animation and the capabilities section — a deliberate "watch it work" pause in the page rhythm. The white surface intentionally continues the `.stack-tail-intro` band so the editorial intro and the video read as one moment before the capabilities gradient takes over.

The video plays unfiltered (no halftone / dither). Per the STYLE_GUIDE Variation 4 footnote, product UI is sanctioned to bypass the dot-mask pass — the brand's halftone treatment is for the hero shader and supporting imagery, not for product walkthroughs the viewer has to read.

## Mount

```html
<div data-demo-video
     data-src="assets/demo-cran.mp4"
     data-poster="assets/demo-cran-poster.jpg"
     data-mime="video/mp4"
     data-label="Renoverse product demo"></div>
```

## Configuration

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `data-src` | URL | yes | Path to the video file. Relative to the page that mounts the component. |
| `data-poster` | URL | no | Frame shown before play. Strongly recommended — without it, browsers paint a black box over the card until the user clicks. |
| `data-mime` | string | no | MIME type for the `<source>`. Defaults to `video/mp4`. |
| `data-label` | string | no | `aria-label` on the `<video>` element. Defaults to "Product demo video". Use the actual subject (e.g. "Renoverse CRAN demo") so screen readers announce something meaningful. |

## Behavior

- Native HTML5 controls (`controls` attribute). Scrub bar, volume, fullscreen — all browser-native.
- `preload="metadata"` so the page fetches duration / dimensions only on initial load; the video bytes themselves don't download until the user presses play.
- `playsinline` — iOS Safari plays inline in the card instead of forcing the OS-level fullscreen player on first tap.
- No autoplay. The source is intended to be watched; ambient autoplay-loop is the wrong treatment.
- No JS-driven entrance animation — the brand's motion vocabulary is for content, not media chrome.

## Layout & surface

- **Surface:** `var(--white)`. Matches the `.stack-tail-intro` that precedes the video on the homepage so the two read as one continuous white band before the sky-blue-ice capabilities reveal. If a future page wants this on a different surface, override `.demo-video-section { background: ... }` per host.
- **Width:** `--container` (1240px) — same column as the capabilities grid below, so the video aligns to the page's main reading axis.
- **Frame:** 14px radius, soft drop shadow — matches `.ty-card` recipe so the video reads as a deliberate brand artifact rather than a generic embed.
- **Aspect ratio:** locked at 16:9 to match the source (1920×1080). Replace via a per-host CSS override if the source has a different ratio.

## Dependencies

- `shared/tokens.css` — colors, type scale, spacing, fonts, gradient tokens (`--grad-ice-cream-beige`).
- (Optional) `shared/effects.css` — only if you opt into adding `.fx-grain--ink` over the section.

No GSAP. No external JS.

## Notes

- Mount guard uses `data-demo-video-mounted="1"` (full unabbreviated name per the project's component-identifier rule).
- The component does not handle multiple `<source>` formats. If you need a WebM fallback, add it to `buildMarkup` in `index.js` — typical pattern is `data-src-webm` alongside `data-src`.
- Reduced motion: not applicable. Video does not autoplay; only the user clicking the play button starts motion.
- Mobile: the 16:9 frame fills the available width minus `--gutter`. At ≤430px the corner radius drops from 14px → 10px so the rounding doesn't read as chunky on small screens.
