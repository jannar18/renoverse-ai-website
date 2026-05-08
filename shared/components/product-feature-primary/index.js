/* Renoverse — Product Feature (primary).
   Mounts an N-row alternating product-feature section into every
   [data-product-feature-primary] on the page.

   Hybrid of STYLE_GUIDE Variation 4 (alternating blurb + product highlight)
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
  const MOUNT = '[data-product-feature-primary]';

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

  /* WebGL halftone shader tint — matches the ICP carousel's "builders" panel
     (the teal panel uses this exact tint). vec3 RGB in 0..1 range. The
     shader emits dots in this color, blended over the gradient via
     mix-blend-mode: overlay (set in CSS). */
  const SHADER_TINT = [0.227, 0.122, 0.071];

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
      <ul class="product-feature-primary__bullets">
        ${bullets.map((b) => `
          <li class="product-feature-primary__bullet">
            <p class="product-feature-primary__bullet-label">${escape(b.label || '')}</p>
            <p class="product-feature-primary__bullet-body">${escape(b.body || '')}</p>
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
      : `<p class="product-feature-primary__body">${escape(item.body || '')}</p>`;
    const ctaMarkup = showCta
      ? `<a class="btn btn--white product-feature-primary__cta" href="${escape(cta.href)}">
           <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
           ${escape(cta.label)}
           <span class="product-feature-primary__cta-arrow">${ARROW_SVG}</span>
         </a>`
      : '';
    return `
      <div class="product-feature-primary__blurb">
        ${item.eyebrow ? `<p class="product-feature-primary__eyebrow">${escape(item.eyebrow)}</p>` : ''}
        <h2 class="product-feature-primary__title">${escape(item.title)}</h2>
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
        <div class="product-feature-primary__media">
          <div class="product-feature-primary__media-frame product-feature-primary__media-frame--ph">
            <div class="product-feature-primary__media-ph">
              <div>
                <span class="tag">${tag}</span>
                ${label ? `<small>${label}</small>` : ''}
              </div>
            </div>
          </div>
        </div>`;
    }
    return `
      <div class="product-feature-primary__media">
        <div class="product-feature-primary__media-frame">
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
      <div class="product-feature-primary__row" data-row-side="${side}">
        ${first}
        ${second}
      </div>`;
  }

  /* ===== WebGL halftone shader =====
     Per-cell sampling of the source image, dot radius scales with darkness,
     tinted, composited via mix-blend-mode: overlay (set in CSS). Lifted
     from the ICP carousel and stripped down — no tint animation since each
     row uses one static tint. */
  function setupHalftoneShader(canvas, sourceUrl) {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true })
            || canvas.getContext('experimental-webgl');
    if (!gl) { canvas.style.display = 'none'; return; }

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('product-feature-primary shader compile error:', gl.getShaderInfoLog(s));
      }
      return s;
    }

    const vert = compile(gl.VERTEX_SHADER, `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = vec2(a_pos.x * 0.5 + 0.5, 1.0 - (a_pos.y * 0.5 + 0.5));
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `);

    const frag = compile(gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform sampler2D u_tex;
      uniform vec2 u_resolution;
      uniform vec2 u_imgSize;
      uniform float u_cell;
      uniform vec3 u_tint;
      varying vec2 v_uv;

      vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
        float sR = res.x / res.y;
        float iR = img.x / img.y;
        vec2 scale = (sR < iR) ? vec2(iR / sR, 1.0) : vec2(1.0, sR / iR);
        return (uv - 0.5) / scale + 0.5;
      }

      void main() {
        vec2 px = v_uv * u_resolution;
        vec2 cellOrigin = floor(px / u_cell) * u_cell;
        vec2 cellCenterPx = cellOrigin + vec2(u_cell * 0.5);
        vec2 sampleUV = coverUV(cellCenterPx / u_resolution, u_resolution, u_imgSize);
        sampleUV = clamp(sampleUV, 0.0, 1.0);
        vec4 col = texture2D(u_tex, sampleUV);
        float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));
        float maxR = u_cell * 0.55;
        float r = (1.0 - lum) * maxR;
        float dist = length(px - cellCenterPx);
        float t = smoothstep(r + 0.7, r - 0.7, dist);
        gl_FragColor = vec4(u_tint, t);
      }
    `);

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('product-feature-primary shader link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex  = gl.getUniformLocation(prog, 'u_tex');
    const uRes  = gl.getUniformLocation(prog, 'u_resolution');
    const uImg  = gl.getUniformLocation(prog, 'u_imgSize');
    const uCell = gl.getUniformLocation(prog, 'u_cell');
    const uTint = gl.getUniformLocation(prog, 'u_tint');

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([128, 128, 128, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let imgW = 1, imgH = 1, ready = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      ready = true;
      render();
    };
    img.onerror = () => { canvas.style.display = 'none'; };
    img.src = sourceUrl;

    function render() {
      if (!ready) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uTex, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uImg, imgW, imgH);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      gl.uniform1f(uCell, 7.0 * dpr);
      gl.uniform3f(uTint, SHADER_TINT[0], SHADER_TINT[1], SHADER_TINT[2]);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
      }
      render();
    }

    window.addEventListener('resize', resize);
    resize();
  }

  function buildMarkup(items, cta, ctaHidden) {
    /* All three background layers — gradient strip, CSS halftone, WebGL
       shader — live at the section level so they share the same vertical
       extent: one continuous gradient AND one continuous halftone AND one
       continuous shader spanning the top of row 1 through the bottom of
       the last row. Matches the carousel's signature exactly, just scaled
       across the whole section instead of per-panel. */
    const halftoneSrc = items[0].halftoneImage || DEFAULT_HALFTONE;
    return `
      <section class="product-feature-primary">
        <span class="product-feature-primary__panel-strip" aria-hidden="true"></span>
        <span class="product-feature-primary__halftone" aria-hidden="true" style="background-image:url('${escape(halftoneSrc)}')"></span>
        <canvas class="product-feature-primary__shader" aria-hidden="true" data-halftone-src="${escape(halftoneSrc)}"></canvas>
        ${items.map((item) => buildRow(item, cta, ctaHidden)).join('')}
      </section>`;
  }

  function animate(host) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    host.querySelectorAll('.product-feature-primary__row').forEach((row) => {
      const side = row.getAttribute('data-row-side');
      const media = row.querySelector('.product-feature-primary__media');
      const blurb = row.querySelector('.product-feature-primary__blurb');
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
    if (host.dataset.productFeaturePrimaryMounted === '1') return;
    host.dataset.productFeaturePrimaryMounted = '1';
    host.innerHTML = buildMarkup(readItems(host), readCta(host), readCtaHidden(host));
    /* Boot the WebGL halftone shader on each row's canvas. Source URL is
       carried via data-halftone-src so each row can use its own image. */
    host.querySelectorAll('.product-feature-primary__shader').forEach((canvas) => {
      const src = canvas.getAttribute('data-halftone-src');
      if (src) setupHalftoneShader(canvas, src);
    });
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
