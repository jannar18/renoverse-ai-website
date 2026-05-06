/* Renoverse — Features (editorial strips).
   Mounts an N-row alternating capability section into every
   [data-features-editorial] on the page.

   Each row: title + short body on one side, a thin cropped image strip on
   the other (~200px tall via object-fit: cover). No per-row CTAs, no
   eyebrows — homepage teaser cadence; the deep-dive lives on solutions.html
   via features-alternating.

   Hosts can override items + CTA via data-attributes:

     <div data-features-editorial
          data-cta-label="See all product features →"
          data-cta-href="solutions.html"
          data-items='[{"title":"...","body":"...","image":"...","alt":"...","side":"image-right"}, ...]'></div>

   Each item:
     { title, body, image, alt, side: 'image-left' | 'image-right',
       placeholder?: boolean,        // render diagonal-stripe ph instead of image
       placeholderLabel?: string,    // small label inside placeholder
       placeholderTag?: string       // tag above the label (default "Image placeholder")
     }
*/
(function () {
  const MOUNT = '[data-features-editorial]';

  /* Defaults are the four homepage capabilities so the host can mount with
     no data-items. Sides alternate so row 1 is image-right, row 2
     image-left, etc. Each item carries a `tint` (hex) used as the dither
     shader's foreground (and as the placeholder strip's fill); rotating
     across brand colors so the four dot patterns read as a series rather
     than a flat teal repeat. The 4th item has no real asset yet and
     renders the placeholder strip. */
  const DEFAULT_ITEMS = [
    {
      title: 'Email Triage & Auto-Capture',
      body: "The decisions buried in a 40-message chain don't disappear. Ella AI automatically surfaces what matters — organized by project, ready to act on.",
      image: 'assets/feature-email-triage.png',
      alt: 'Renoverse Ella AI triage inbox surfacing decisions, questions, and action items extracted from project emails',
      side: 'image-right',
      tint: '#2D6F75'  /* --teal */
    },
    {
      title: 'Decision Log & Audit Trail',
      body: 'Know who decided what, when, and why — without anyone having to write it down. Every decision is captured, timestamped, and traceable from first log through final approval.',
      image: 'assets/feature-decision-log.png',
      alt: 'Renoverse decision log with timestamped audit trail tracing a backsplash tile selection from first log to final approval',
      side: 'image-left',
      tint: '#5D6FB8'  /* --oxford */
    },
    {
      title: 'Intelligence Layer on Existing Stack',
      body: 'Nothing gets replaced. Renoverse connects to Microsoft 365 tools and acts as the intelligent coordination layer on top so information flows between systems seamlessly.',
      image: 'assets/feature-intelligence-layer.png',
      alt: 'Renoverse Connectors page showing Gmail, Outlook, and other communication and storage integrations',
      side: 'image-right',
      tint: '#5BA7C9'  /* --blue */
    },
    {
      title: 'Controlled Stakeholder Access',
      body: 'Three access tiers — internal team, professional collaborators, and client — so private work stays private and stakeholders see exactly what they need.',
      placeholder: true,
      placeholderLabel: 'Stakeholder access',
      side: 'image-left',
      tint: '#0B1A2B'  /* --ink */
    }
  ];

  const DEFAULT_CTA = { label: 'See all product features →', href: 'solutions.html' };

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

  function buildMedia(item) {
    /* Per-item tint cycles brand colors across the strip series. Falls
       back to teal so older items / hosts that don't set tint keep working.
       Strip backgrounds stay cream site-wide; only the foreground
       dots / placeholder fill vary per item. */
    const tint = item.tint || '#2D6F75';
    if (item.placeholder) {
      const tag = escape(item.placeholderTag || 'Image placeholder');
      const label = escape(item.placeholderLabel || '');
      return `
        <div class="features-editorial__media features-editorial__media--ph" style="--ph-tint:${escape(tint)}">
          <div>
            <span class="tag">${tag}</span>
            ${label ? `<small>${label}</small>` : ''}
          </div>
        </div>`;
    }
    /* Strip renders the screenshot as an ordered-dither via the canvas
       shader. The hidden img preserves alt text for assistive tech and
       acts as a no-JS / no-WebGL fallback. */
    return `
      <div class="features-editorial__media">
        <canvas class="features-editorial__shader" data-img-src="${escape(item.image)}" data-tint="${escape(tint)}" aria-label="${escape(item.alt || '')}"></canvas>
        <img class="features-editorial__sr-only" src="${escape(item.image)}" alt="${escape(item.alt || '')}" loading="lazy" />
      </div>`;
  }

  function buildRow(item) {
    const side = item.side === 'image-left' ? 'image-left' : 'image-right';
    return `
      <div class="features-editorial__row" data-side="${side}">
        <div class="features-editorial__copy">
          <h3 class="features-editorial__title">${escape(item.title)}</h3>
          <p class="features-editorial__body">${escape(item.body)}</p>
        </div>
        ${buildMedia(item)}
      </div>`;
  }

  function buildMarkup(items, cta) {
    return `
      <section class="features-editorial">
        <div class="features-editorial__wrap">
          ${items.map(buildRow).join('')}
          <div class="features-editorial__cta-row">
            <a class="btn btn--filled" href="${escape(cta.href)}">
              <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
              ${escape(cta.label)}
            </a>
          </div>
        </div>
      </section>`;
  }

  /* ===== Ordered-dither shader (8x8 Bayer matrix) =====
     Same recipe as Paper's "Image Dithering" preset (Type 8x8, Cover fit,
     Original colors Off, Inverted Off, Dither size 1, Color steps 7).
     Each output pixel samples the source, computes luminance, then quantizes
     it to N levels using a Bayer threshold lookup so detail is preserved
     even at low color counts. Matches the screenshot the user mocked up. */

  const SHADER_VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

  const SHADER_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_img;
uniform vec2  u_resolution;
uniform vec2  u_imgSize;
uniform float u_ditherSize;
uniform float u_colorSteps;
uniform float u_contrast;
uniform vec3  u_colorFront;
uniform vec3  u_colorBack;
uniform float u_invert;

/* Standard 8x8 Bayer ordered-dither matrix (values 0..63). Lookup is
   normalized to [0..1] in the shader. Don't reorder these — the recursive
   Bayer construction defines the spatial-frequency response that gives the
   classic risograph/8-bit dither look. */
const float bayer8x8[64] = float[64](
   0.0, 32.0,  8.0, 40.0,  2.0, 34.0, 10.0, 42.0,
  48.0, 16.0, 56.0, 24.0, 50.0, 18.0, 58.0, 26.0,
  12.0, 44.0,  4.0, 36.0, 14.0, 46.0,  6.0, 38.0,
  60.0, 28.0, 52.0, 20.0, 62.0, 30.0, 54.0, 22.0,
   3.0, 35.0, 11.0, 43.0,  1.0, 33.0,  9.0, 41.0,
  51.0, 19.0, 59.0, 27.0, 49.0, 17.0, 57.0, 25.0,
  15.0, 47.0,  7.0, 39.0, 13.0, 45.0,  5.0, 37.0,
  63.0, 31.0, 55.0, 23.0, 61.0, 29.0, 53.0, 21.0
);

/* Cover-fit: scale the image so its smaller dimension matches the canvas;
   the longer dimension overflows. */
vec2 coverUV(vec2 uv, vec2 res, vec2 tex){
  float ra = res.x / res.y;
  float ta = tex.x / tex.y;
  vec2 s = vec2(1.0);
  vec2 o = vec2(0.0);
  if(ra > ta){
    s.y = ta / ra;
    o.y = (1.0 - s.y) * 0.5;
  } else {
    s.x = ra / ta;
    o.x = (1.0 - s.x) * 0.5;
  }
  return uv * s + o;
}

void main(){
  vec2 res = u_resolution;
  vec2 px  = v_uv * res;

  vec2 tuv = coverUV(v_uv, res, u_imgSize);
  vec3 src = texture(u_img, tuv).rgb;
  float lum = dot(src, vec3(0.2126, 0.7152, 0.0722));
  lum = clamp((lum - 0.5) * (1.0 + 4.0 * u_contrast) + 0.5, 0.0, 1.0);
  lum = mix(lum, 1.0 - lum, u_invert);

  /* Bayer threshold lookup. u_ditherSize controls how many screen pixels
     each Bayer cell occupies — at 1.0, finest possible pattern; at 2+,
     chunkier risograph look. */
  float ds = max(u_ditherSize, 1.0);
  vec2 cellCoord = floor(px / ds);
  int xi = int(mod(cellCoord.x, 8.0));
  int yi = int(mod(cellCoord.y, 8.0));
  float threshold = bayer8x8[yi * 8 + xi] / 64.0;

  /* Ordered-dither quantization: shift lum by the per-pixel threshold
     (centred at 0.5) scaled by 1/steps, then quantize. The shift makes the
     dithered output average back to the original luminance, which is what
     gives ordered dithering its smooth-but-pixelated character. */
  float steps = max(u_colorSteps, 1.0);
  float shifted = lum + (threshold - 0.5) / steps;
  float q = floor(shifted * steps) / max(steps - 1.0, 1.0);
  q = clamp(q, 0.0, 1.0);

  vec3 final = mix(u_colorBack, u_colorFront, q);
  outColor = vec4(final, 1.0);
}`;

  function compileShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('features-editorial shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function hexToRgb(h) {
    const n = parseInt(String(h).replace('#', ''), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /* Sets up the ordered-dither shader on a canvas + still-image source.
     Foreground tint per item (brand color rotation), background cream
     #F2EBD8 (the strip's panel color), invert=1 (Paper's "Inverted Off" —
     dark UI elements become tint). */
  function setupOrderedDither(canvas, imageUrl, tintHex) {
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      premultipliedAlpha: true,
      antialias: false
    });
    if (!gl) {
      canvas.style.display = 'none';
      const fallback = canvas.parentNode && canvas.parentNode.querySelector('img.features-editorial__sr-only');
      if (fallback) {
        fallback.classList.remove('features-editorial__sr-only');
        fallback.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block';
      }
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, SHADER_VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, SHADER_FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('features-editorial shader link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    /* 1x1 cream pixel as initial texture — matches the strip's bg
       so there's no flash before the screenshot loads. */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([245, 241, 236, 255]));

    const u = (n) => gl.getUniformLocation(prog, n);
    const uImg = u('u_img');
    const uRes = u('u_resolution');
    const uImgSize = u('u_imgSize');
    const uDitherSize = u('u_ditherSize');
    const uColorSteps = u('u_colorSteps');
    const uContrast = u('u_contrast');
    const uColorFront = u('u_colorFront');
    const uColorBack = u('u_colorBack');
    const uInvert = u('u_invert');

    gl.uniform1i(uImg, 0);
    /* Paper "Image Dithering" preset values:
         Type 8x8, Fit Cover, Original colors Off, Inverted Off (= invert 1
         → dark UI elements become teal), Dither size 1, Color steps 7.
         Foreground teal #2C6F75; background ice #E5F4F1 so the strip stands
         out against the section's cream bg without per-strip tinting. */
    gl.uniform1f(uDitherSize, 1.0);
    gl.uniform1f(uColorSteps, 7.0);
    gl.uniform1f(uContrast, 0.0);
    gl.uniform3fv(uColorFront, hexToRgb(tintHex || '#2C6F75')); // brand-tint dots
    gl.uniform3fv(uColorBack,  hexToRgb('#F2EBD8'));            // cream panel
    gl.uniform1f(uInvert, 1.0);
    gl.uniform2f(uImgSize, 1, 1);

    let imgReady = false;

    function render() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(242 / 255, 235 / 255, 216 / 255, 1); // cream
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      render();
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(uImgSize, img.naturalWidth || 1, img.naturalHeight || 1);
      imgReady = true;
      render();
    };
    img.onerror = () => {
      canvas.style.display = 'none';
    };
    img.src = imageUrl;

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();
  }

  function animate(host) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    host.querySelectorAll('.features-editorial__row').forEach((row) => {
      const side = row.getAttribute('data-side');
      const media = row.querySelector('.features-editorial__media');
      const copy = row.querySelector('.features-editorial__copy');
      if (!media || !copy) return;

      /* Edge-in slide for the strip (from outside the layout) + below-fade
         for the copy. Same easing/timing as features-alternating so both
         components feel like one family. */
      const mediaXFrom = side === 'image-left' ? -32 : 32;

      window.gsap.set(media, { opacity: 0, x: mediaXFrom });
      window.gsap.set(copy, { opacity: 0, y: 28 });

      window.gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      })
        .to(media, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
        .to(copy, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    });
  }

  function mount(host) {
    if (host.dataset.feMounted === '1') return;
    host.dataset.feMounted = '1';
    host.innerHTML = buildMarkup(readItems(host), readCta(host));
    /* Boot one ordered-dither shader per non-placeholder strip. Source URL
       is carried via data-img-src on the canvas. */
    host.querySelectorAll('canvas.features-editorial__shader').forEach((canvas) => {
      const src = canvas.getAttribute('data-img-src');
      const tint = canvas.getAttribute('data-tint') || '#2C6F75';
      if (src) setupOrderedDither(canvas, src, tint);
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
