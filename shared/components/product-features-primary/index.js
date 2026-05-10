/* Renoverse — Product Feature (primary).
   Mounts an N-row alternating product-feature section into every
   [data-product-features-primary] on the page.

   Hybrid of DESIGN.md feature-section Variation 4 (alternating blurb + product highlight)
   and Variation 6 (2-up split): each row is split horizontally — text on
   white, image side on a dark-teal gradient panel that bleeds to the
   viewport edge. Side alternates per row to drive the rhythm.
   Animation: outside-edge media slide + below-fade blurb on enter.

   Defaults to the canonical homepage 3 features (Email Triage, Decision Log,
   Intelligence Layer). Hosts can override items and CTA via data-attributes —
   items takes a JSON array of items, each:
     { eyebrow, title, body, image, alt, side: 'image-left' | 'image-right',
       bullets?: [{ label, body }, ...],
       placeholder?: boolean,        // render diagonal-stripe ph instead of image
       placeholderLabel?: string,    // small label inside placeholder
       placeholderTag?: string       // tag above the label (default "Image placeholder")
     }
   When `bullets` is non-empty, the row renders the bullet list instead of
   `body` + the per-row CTA. Use `data-cta-hidden="1"` on the host to suppress
   per-row CTAs globally even on items without bullets.
*/
(function () {
  const MOUNT = '[data-product-features-primary]';

  /* Default halftone source — the canonical brand halftone PNG (architectural
     render, lifted from the ICP carousel). Has strong tonal range, so reads
     visibly through the dot mask. Per-item `halftoneImage` overrides this
     when a specific source is wanted; if none is set, every row uses this
     default rather than the foreground product screenshot (which is mostly
     white and produces only a sparse halftone). */
  const DEFAULT_HALFTONE = 'assets/feature-halftone-source.avif';

  const DEFAULT_ITEMS = [
    {
      eyebrow: 'Capture',
      title: 'Email Triage & Auto-Capture',
      body: "The decisions buried in a 40-message chain don't disappear. Ella AI automatically surfaces what matters — organized by project, ready to act on, with the information provenance one click away.",
      image: 'assets/feature-email-triage.png',
      alt: 'Renoverse Ella AI triage inbox surfacing decisions, questions, and action items extracted from project emails',
      side: 'image-right'
    },
    {
      eyebrow: 'Track',
      title: 'Decision Log & Audit Trail',
      body: 'Know who decided what, when, and why — without anyone having to write it down. Every decision is captured, timestamped, and traceable back to its source from first log through final approval.',
      image: 'assets/feature-decision-log.png',
      alt: 'Renoverse decision log with timestamped audit trail tracing a backsplash tile selection from first log to final approval',
      side: 'image-right'
    },
    {
      eyebrow: 'Connect',
      title: 'Intelligence Layer on Existing Stack',
      body: 'Nothing gets replaced. Renoverse connects to Microsoft 365 tools and acts as the intelligent coordination layer on top so information flows between systems seamlessly.',
      image: 'assets/feature-intelligence-layer.png',
      alt: 'Renoverse Connectors page showing Gmail, Outlook, and other communication and storage integrations',
      side: 'image-right'
    }
  ];

  const DEFAULT_CTA = { label: 'See solutions', href: 'solutions.html' };

  /* Same arrow used by the ICP carousel CTA — keeps the puck visually
     identical across the two components. */
  const ARROW_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path d="M3 8h9M8 4l4 4-4 4"/></svg>`;

  /* WebGL halftone tint — passed to the shared halftone shader as the
     dot front color. CSS blends the canvas via mix-blend-mode: overlay
     at .15 opacity (see index.css), so this hex is the pre-blend tint
     that renders teal-ish over the warm-paper gradient strip. */
  const SHADER_TINT = '#3A1F12';

  function escape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function readItems(host) {
    const raw = host.getAttribute('data-items');
    if (!raw) return DEFAULT_ITEMS;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (_) { /* fall through */ }
    return DEFAULT_ITEMS;
  }

  function readCta(host) {
    return {
      label: host.getAttribute('data-cta-label') || DEFAULT_CTA.label,
      href: host.getAttribute('data-cta-href') || DEFAULT_CTA.href
    };
  }

  function readCtaHidden(host) {
    return host.getAttribute('data-cta-hidden') === '1';
  }

  function buildBullets(bullets) {
    return `
      <ul class="product-features-primary__bullets">
        ${bullets.map((b) => `
          <li class="product-features-primary__bullet">
            <p class="product-features-primary__bullet-label">${escape(b.label || '')}</p>
            <p class="product-features-primary__bullet-body">${escape(b.body || '')}</p>
          </li>`).join('')}
      </ul>`;
  }

  function buildBlurb(item, cta, ctaHidden) {
    /* Per-row CTA mirrors the ICP carousel CTA: bracket-corner button + aqua
       arrow puck. All blurbs sit on white now (text-on-white side of the
       split row), so a single .btn--white variant reads consistently.

       When `bullets` is provided, the row swaps body+CTA for a 3-bullet list
       (Solutions page deep-dive). Otherwise the homepage's body+CTA pattern
       is preserved. `ctaHidden` (host-level) suppresses the CTA even for
       body-mode items. */
    const hasBullets = Array.isArray(item.bullets) && item.bullets.length > 0;
    const showCta = !hasBullets && !ctaHidden;
    const bodyOrBullets = hasBullets
      ? buildBullets(item.bullets)
      : `<p class="product-features-primary__body">${escape(item.body || '')}</p>`;
    const ctaMarkup = showCta
      ? `<a class="btn btn--white product-features-primary__cta" href="${escape(cta.href)}">
           <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
           ${escape(cta.label)}
           <span class="product-features-primary__cta-arrow">${ARROW_SVG}</span>
         </a>`
      : '';
    return `
      <div class="product-features-primary__blurb">
        ${item.eyebrow ? `<p class="product-features-primary__eyebrow">${escape(item.eyebrow)}</p>` : ''}
        <h2 class="product-features-primary__title">${escape(item.title)}</h2>
        ${bodyOrBullets}
        ${ctaMarkup}
      </div>`;
  }

  function buildMedia(item) {
    /* Placeholder mode mirrors the team-section media-ph hash (diagonal
       stripe pattern + small mono-uppercase label). Used when copy is
       locked but the visual hasn't been designed yet (Controlled
       Stakeholder Access on solutions.html, per Phase 15 spec). */
    if (item.placeholder) {
      const tag = escape(item.placeholderTag || 'Image placeholder');
      const label = escape(item.placeholderLabel || '');
      return `
        <div class="product-features-primary__media">
          <div class="product-features-primary__media-frame product-features-primary__media-frame--ph">
            <div class="product-features-primary__media-ph">
              <div>
                <span class="tag">${tag}</span>
                ${label ? `<small>${label}</small>` : ''}
              </div>
            </div>
          </div>
        </div>`;
    }
    return `
      <div class="product-features-primary__media">
        <div class="product-features-primary__media-frame">
          <img src="${escape(item.image)}" alt="${escape(item.alt || '')}" loading="lazy" />
        </div>
      </div>`;
  }

  function buildRow(item, cta, ctaHidden) {
    const side = item.side === 'image-right' ? 'image-right' : 'image-left';

    const blurb = buildBlurb(item, cta, ctaHidden);
    const media = buildMedia(item);
    const first = side === 'image-left' ? media : blurb;
    const second = side === 'image-left' ? blurb : media;

    /* Row holds only content. Halftone + shader live at the section level
       (see buildMarkup) as one unified overlay matching the gradient strip.
       No grain on the row — grain (fx-grain--ink, multiply blend) was tinting
       the white-side of every row grey; the user wants pure white there. */
    return `
      <div class="product-features-primary__row" data-row-side="${side}">
        ${first}
        ${second}
      </div>`;
  }

  /* WebGL halftone shader is the shared primitive at shared/halftone-shader.js.
     This component used to inline its own square-grid WebGL1 implementation;
     now it consumes the same hex-grid Paper Hero-Teal canon as halftone-video.
     The `mode: 'overlay'` branch outputs vec4(tint, alpha) with a transparent
     background — index.css's mix-blend-mode: overlay + opacity .15 then
     blends those tinted dots onto the underlying gradient strip + halftone
     PNG layers. Page must load shared/halftone-shader.js before this file. */

  function buildMarkup(items, cta, ctaHidden) {
    /* All three background layers — gradient strip, CSS halftone, WebGL
       shader — live at the section level so they share the same vertical
       extent: one continuous gradient AND one continuous halftone AND one
       continuous shader spanning the top of row 1 through the bottom of
       the last row. Matches the carousel's signature exactly, just scaled
       across the whole section instead of per-panel. */
    const halftoneSrc = items[0].halftoneImage || DEFAULT_HALFTONE;
    return `
      <section class="product-features-primary">
        <span class="product-features-primary__panel-strip" aria-hidden="true"></span>
        <span class="product-features-primary__halftone" aria-hidden="true" style="background-image:url('${escape(halftoneSrc)}')"></span>
        <canvas class="product-features-primary__shader" aria-hidden="true" data-halftone-src="${escape(halftoneSrc)}"></canvas>
        ${items.map((item) => buildRow(item, cta, ctaHidden)).join('')}
      </section>`;
  }

  function animate(host) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    host.querySelectorAll('.product-features-primary__row').forEach((row) => {
      const side = row.getAttribute('data-row-side');
      const media = row.querySelector('.product-features-primary__media');
      const blurb = row.querySelector('.product-features-primary__blurb');
      if (!media || !blurb) return;

      const mediaXFrom = side === 'image-left' ? -32 : 32;

      window.gsap.set(media, { opacity: 0, x: mediaXFrom });
      window.gsap.set(blurb, { opacity: 0, y: 32 });

      window.gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      })
        .to(media, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
        .to(blurb, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.52');
    });
  }

  function mount(host) {
    if (host.dataset.productFeaturesPrimaryMounted === '1') return;
    host.dataset.productFeaturesPrimaryMounted = '1';
    host.innerHTML = buildMarkup(readItems(host), readCta(host), readCtaHidden(host));
    /* Boot the shared halftone shader on each row's canvas. Source URL is
       carried via data-halftone-src so each row can use its own image. */
    if (!window.HalftoneShader) {
      console.error('product-features-primary: shared/halftone-shader.js not loaded');
    } else {
      host.querySelectorAll('.product-features-primary__shader').forEach((canvas) => {
        const src = canvas.getAttribute('data-halftone-src');
        if (!src) return;
        window.HalftoneShader.attach(canvas, {
          source: { type: 'image', src },
          mode: 'overlay',
          front: SHADER_TINT,
          /* cell/radius/contrast/grain default to the canonical Paper
             Hero-Teal preset — no per-instance overrides needed. */
        });
      });
    }
    animate(host);
  }

  function init() {
    document.querySelectorAll(MOUNT).forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
