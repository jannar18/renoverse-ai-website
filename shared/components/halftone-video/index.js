/* Renoverse — Halftone video host.
   Wires a halftone shader (shared primitive: shared/halftone-shader.js)
   onto a <video> source for every [data-halftone-video] element on the
   page. The shader algorithm, defaults, and WebGL machinery live in the
   shared module — this file only handles host-element setup, data-
   attribute parsing, and the a11y wrapper.

   Configurable via data attributes:
     data-src       video URL (required)
     data-front     dot color hex (default = canonical #2C6F75)
     data-back      gap color hex behind dots (default = canonical #ffffff)
     data-original  "1" to use the video's own colors for dots (default "0")
     data-invert    "1" to flip lum→size (dark = big dots) (default "0")
     data-cell      cell pitch as fraction of min(w,h) (default = canonical 0.012)
     data-radius    dot radius coefficient (default = canonical 1.2)
     data-contrast  luminance contrast boost (default = canonical 0.4)
     data-grain     grain overlay (default = canonical 0.2)
*/
(function () {
  const MOUNT = '[data-halftone-video]';

  function num(v, fallback) {
    if (v == null || v === '') return fallback;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function mount(host) {
    if (host.dataset.halftoneMounted) return;
    host.dataset.halftoneMounted = '1';

    /* Decorative brand visual — the H1/H2 next to it carries the page meaning,
       and the WebGL canvas would otherwise be announced by SR as "image". */
    host.setAttribute('aria-hidden', 'true');

    const src = host.dataset.src;
    if (!src) { console.warn('halftone-video: missing data-src'); return; }

    if (!window.HalftoneShader) {
      console.error('halftone-video: shared/halftone-shader.js not loaded');
      return;
    }
    const C = window.HalftoneShader.CANONICAL;

    // Create the underlying video + canvas as host children. The shared
    // module handles the WebGL plumbing once we hand it the canvas + video.
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.src = src;
    host.appendChild(video);

    const canvas = document.createElement('canvas');
    canvas.className = 'halftone-canvas';
    host.appendChild(canvas);

    const handle = window.HalftoneShader.attach(canvas, {
      source: { type: 'video', element: video, src },
      mode: 'composite',
      front:          host.dataset.front || C.front,
      back:           host.dataset.back  || C.back,
      cell:           num(host.dataset.cell,     C.cell),
      radius:         num(host.dataset.radius,   C.radius),
      contrast:       num(host.dataset.contrast, C.contrast),
      grain:          num(host.dataset.grain,    C.grain),
      invert:         host.dataset.invert   === '1',
      originalColors: host.dataset.original === '1',
      animated: true,
    });

    /* WebGL2-unavailable fallback. When the shared shader can't get a
       WebGL2 context (older Safari, locked-down enterprise browsers,
       WebGL disabled, hardware-accel off), it returns null and hides
       its canvas. Without an override, the hero would render as bare
       white — H1 + subtitle still legible but the brand visual is
       gone. Promote the raw video to take the canvas's place: the
       video already exists in the DOM (created above), is autoplay-
       muted-loop, just sized 1×1 + opacity 0 by default. The
       `halftone-video--fallback` class swaps it to fill the host
       (CSS in index.css). The user gets the video without the
       brand halftone overlay — a meaningful degrade rather than a
       blank surface. */
    if (!handle) {
      host.classList.add('halftone-video--fallback');
    }

    /* The shared module's source.element branch doesn't drive playback
       (we passed in our own <video>), so kick it off here. Same shape
       as the previous pre-extraction implementation: autoplay where
       allowed, resume on first pointerdown, resume on visibility. Runs
       regardless of shader success — the video plays whether it's
       being sampled by the shader or shown raw as fallback. */
    const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!reduced) {
      const startPlayback = () => video.play().catch(() => {});
      startPlayback();
      document.addEventListener('pointerdown', startPlayback, { once: true });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') startPlayback();
      });
    } else {
      video.autoplay = false;
      /* Reduced-motion + WebGL2 fallback: pause on the first frame so
         users with reduce-motion don't get autoplaying video either. */
      if (!handle) {
        video.addEventListener('loadeddata', () => {
          try { video.pause(); } catch (_) {}
        }, { once: true });
      }
    }
  }

  function init() { document.querySelectorAll(MOUNT).forEach(mount); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
