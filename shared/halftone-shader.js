/* Renoverse — shared WebGL2 halftone shader primitive.

   Single source of truth for the brand halftone effect across the
   site. Both halftone-video (homepage hero) and product-features-primary
   (Solutions feature rows) consume this module. Per AGENTS.md
   "match X = same primitive parameterized" rule and the canonical
   Paper Hero-Teal preset (Cover, Hex, Inverted Off, 1%/120%/40%,
   #2C6F75, 20% grain).

   Outputs:
     window.HalftoneShader.attach(canvas, options) → handle
     window.HalftoneShader.CANONICAL                   ← Paper preset
     window.HalftoneShader.GLSL                        ← shared GLSL

   options:
     source: { type:'video', src }
           | { type:'video', element }   (use an existing <video>)
           | { type:'image', src }
     front:           dot color hex                       (#2C6F75)
     back:            bg color hex (composite mode only)  (#ffffff)
     cell:            cell pitch as fraction of min(w,h)  (0.012 = 1%)
     radius:          dot radius coefficient              (1.2)
     contrast:        luminance contrast boost -1..1      (0.4)
     grain:           static-noise overlay 0..1           (0.2)
     invert:          dark areas → big dots               (false)
     originalColors:  use src colors for dots vs tint     (false)
     mode:            'composite' | 'overlay'             ('composite')
                        composite → solid back + tinted dots
                        overlay   → alpha-only tinted dots
                                    (transparent bg, blend via CSS)
     animated:        RAF render loop                     (auto by source.type)
     reducedMotion:   'auto' | true | false               ('auto')

   Returned handle:
     { destroy, render, resize, video?, image? }

   The handle's `video` is exposed so consumers can wire up their
   own play/pause logic if they need to (the module already handles
   autoplay + first-pointerdown gesture + visibilitychange).
*/
(function () {

  // -------- Canonical brand preset (Paper Hero-Teal) --------
  const CANONICAL = Object.freeze({
    front: '#2C6F75',
    back: '#ffffff',
    cell: 0.012,        // 1% of min(width,height) per Paper canon
    radius: 1.2,        // 120% radius coefficient per Paper canon
    contrast: 0.4,      // 40% luminance boost per Paper canon
    grain: 0.2,         // 20% grain overlay per Paper canon
    invert: false,
    originalColors: false,
    mode: 'composite',
  });

  // -------- Shared GLSL (referenced by FRAG below; also exported) --------

  const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

  const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_tex;
uniform vec2  u_resolution;
uniform vec2  u_texSize;
uniform float u_cell;
uniform float u_radius;
uniform float u_contrast;
uniform float u_grain;
uniform vec3  u_colorFront;
uniform vec3  u_colorBack;
uniform float u_originalColors;
uniform float u_invert;
uniform float u_mode;          // 0 = composite, 1 = overlay
uniform float u_time;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Returns the nearest hex-lattice center for a point in hex-units
// (cell pitch = 1.0 horizontally, sqrt(3) vertically with half-row stagger).
vec2 hexCenter(vec2 p){
  vec2 r = vec2(1.0, sqrt(3.0));
  vec2 h = r * 0.5;
  vec2 a = mod(p, r) - h;
  vec2 b = mod(p + h, r) - h;
  vec2 d = dot(a, a) < dot(b, b) ? a : b;
  return p - d;
}

// Cover-fit UV mapping (preserves source aspect, fills resolution).
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

  float cellPx = max(u_cell * min(res.x, res.y), 2.0);

  vec2 hu = px / cellPx;
  vec2 c  = hexCenter(hu);

  vec2 cuv = (c * cellPx) / res;
  vec2 tuv = coverUV(cuv, res, u_texSize);
  vec3 src = texture(u_tex, tuv).rgb;
  float lum = dot(src, vec3(0.2126, 0.7152, 0.0722));

  lum = clamp((lum - 0.5) * (1.0 + 4.0 * u_contrast) + 0.5, 0.0, 1.0);
  lum = mix(lum, 1.0 - lum, u_invert);

  float lumR = lum * u_radius * 0.5;
  float fixR = u_radius * 0.5;
  float r = mix(lumR, fixR, u_originalColors);
  float d = length(hu - c);
  float feather = 1.0 / cellPx;
  float a = 1.0 - smoothstep(r - feather, r + feather, d);

  vec3 dotCol = mix(u_colorFront, src, u_originalColors);

  if (u_mode > 0.5) {
    // Overlay mode: tinted dots only, transparent elsewhere.
    // Consumer composites this on top of CSS gradient/image via
    // mix-blend-mode (typically overlay) or plain alpha layering.
    outColor = vec4(dotCol, a);
  } else {
    // Composite mode: solid back + tinted dots + animated grain.
    vec3 final = mix(u_colorBack, dotCol, a);
    float n = hash(floor(px));
    final = clamp(final + (n - 0.5) * u_grain, 0.0, 1.0);
    outColor = vec4(final, 1.0);
  }
}`;

  // -------- Helpers --------

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('halftone-shader: compile failed', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function hexToRgb(h) {
    const n = parseInt(String(h).replace('#', ''), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // -------- attach(canvas, options) --------

  function attach(canvas, options) {
    const opts = Object.assign({}, CANONICAL, options || {});
    const reducedMotion = opts.reducedMotion === 'auto' || opts.reducedMotion == null
      ? prefersReducedMotion()
      : !!opts.reducedMotion;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      desynchronized: true,
    });
    if (!gl) {
      console.warn('halftone-shader: WebGL2 unavailable; canvas hidden.');
      canvas.style.display = 'none';
      return null;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('halftone-shader: link failed', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    // Quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1, 1,
      -1,  1,  1, -1,  1, 1,
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Texture
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Uniforms
    const u = (n) => gl.getUniformLocation(prog, n);
    const uTex       = u('u_tex');
    const uRes       = u('u_resolution');
    const uTexSize   = u('u_texSize');
    const uCell      = u('u_cell');
    const uRadius    = u('u_radius');
    const uContrast  = u('u_contrast');
    const uGrain     = u('u_grain');
    const uColorF    = u('u_colorFront');
    const uColorB    = u('u_colorBack');
    const uOriginal  = u('u_originalColors');
    const uInvert    = u('u_invert');
    const uMode      = u('u_mode');
    const uTime      = u('u_time');

    gl.uniform1i(uTex, 0);
    gl.uniform1f(uCell,     opts.cell);
    gl.uniform1f(uRadius,   opts.radius);
    gl.uniform1f(uContrast, opts.contrast);
    gl.uniform1f(uGrain,    opts.grain);
    gl.uniform3fv(uColorF,  hexToRgb(opts.front));
    gl.uniform3fv(uColorB,  hexToRgb(opts.back));
    gl.uniform1f(uOriginal, opts.originalColors ? 1 : 0);
    gl.uniform1f(uInvert,   opts.invert ? 1 : 0);
    gl.uniform1f(uMode,     opts.mode === 'overlay' ? 1 : 0);
    gl.uniform2f(uTexSize,  1, 1); // updated when source loads

    // Source acquisition
    const src = opts.source || {};
    let video = null, image = null, sourceReady = false;
    let metaW = 1, metaH = 1;

    if (src.type === 'video') {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      video = src.element || document.createElement('video');
      if (!src.element) {
        video.muted = true;
        video.loop = true;
        video.autoplay = !reducedMotion;
        video.playsInline = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.preload = 'auto';
      }
      video.addEventListener('loadedmetadata', () => {
        metaW = video.videoWidth || 1920;
        metaH = video.videoHeight || 1080;
        gl.uniform2f(uTexSize, metaW, metaH);
        sourceReady = true;
      });
      if (!src.element && src.src) video.src = src.src;
    } else if (src.type === 'image') {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        metaW = image.naturalWidth || 1;
        metaH = image.naturalHeight || 1;
        gl.uniform2f(uTexSize, metaW, metaH);
        sourceReady = true;
        render();
      };
      image.onerror = () => { canvas.style.display = 'none'; };
      if (src.src) image.src = src.src;
    } else {
      console.warn('halftone-shader: source.type must be "video" or "image".');
      return null;
    }

    function uploadFrame() {
      if (!sourceReady) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (video) {
        if (video.readyState >= 2) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        }
      }
      // For image: already uploaded once on load — no per-frame re-upload.
    }

    const t0 = performance.now();
    function render() {
      uploadFrame();
      gl.uniform1f(uTime, reducedMotion ? 0 : (performance.now() - t0) / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Resize: drives canvas dpr scaling + uResolution.
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    }
    resize();

    // Resize observer (re-renders the static path on size change).
    const animatedDefault = src.type === 'video';
    const animated = opts.animated == null ? animatedDefault : !!opts.animated;
    const willLoop = animated && !reducedMotion;

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => { resize(); if (!willLoop) render(); }).observe(canvas);
    } else {
      window.addEventListener('resize', () => { resize(); if (!willLoop) render(); });
    }

    // Video-specific: handle autoplay + gesture + visibility.
    if (video && !src.element) {
      const startPlayback = () => video.play().catch(() => {});
      if (!reducedMotion) {
        startPlayback();
        document.addEventListener('pointerdown', startPlayback, { once: true });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') startPlayback();
        });
      } else {
        // Render the halftone of the first frame once and stop.
        video.addEventListener('loadeddata', render, { once: true });
      }
    }

    // Animated path: RAF loop.
    if (willLoop) {
      (function tick() {
        resize();
        render();
        requestAnimationFrame(tick);
      })();
    }

    return {
      render,
      resize,
      video,
      image,
      destroy() {
        try { gl.deleteProgram(prog); } catch (_) {}
        try { gl.deleteBuffer(buf); } catch (_) {}
        try { gl.deleteTexture(tex); } catch (_) {}
      },
    };
  }

  // -------- Export --------
  window.HalftoneShader = {
    attach,
    CANONICAL,
    GLSL: { VERT, FRAG },
  };
})();
