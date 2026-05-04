/* Renoverse — Halftone video shader.
   Mounts a WebGL2 hex-grid halftone-dots shader onto a <video> source,
   inside every [data-halftone-video] element on the page.

   Approximates the Paper @paper-design/shaders-react HalftoneDots look
   used in the "Hero - Teal" frame:
     hex grid, classic dots, originalColors=false,
     colorFront teal on transparent background, slight grain overlay.

   Configurable via data attributes:
     data-src       video URL (required)
     data-front     dot color hex (default #2C6F75; ignored when data-original is on)
     data-back      gap color hex behind dots (default #ffffff)
     data-original  "1" to use the video's own colors for dots (default "0")
     data-invert    "1" to flip lum→size (dark = big dots, like ink-on-paper) (default "0")
     data-cell      cell pitch as fraction of min(width,height) (default 0.012)
     data-radius    dot radius coefficient — >1 allows overlap (default 1.2)
     data-contrast  luminance contrast boost 0..1 (default 0.4)
     data-grain     animated film-grain overlay 0..1 (default 0.2)
*/
(function () {
  const MOUNT = '[data-halftone-video]';

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

uniform sampler2D u_video;
uniform vec2  u_resolution;
uniform vec2  u_videoSize;
uniform float u_cell;
uniform float u_radius;
uniform float u_contrast;
uniform float u_grain;
uniform vec3  u_colorFront;
uniform vec3  u_colorBack;
uniform float u_originalColors;
uniform float u_invert;
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

  // hex-units coords
  vec2 hu = px / cellPx;
  vec2 c  = hexCenter(hu);

  // Sample the video at the hex cell center (cover-fit)
  vec2 cuv = (c * cellPx) / res;
  vec2 tuv = coverUV(cuv, res, u_videoSize);
  vec3 src = texture(u_video, tuv).rgb;
  float lum = dot(src, vec3(0.2126, 0.7152, 0.0722));

  // Contrast around 0.5 mid (slope = 1 + 4*contrast)
  lum = clamp((lum - 0.5) * (1.0 + 4.0 * u_contrast) + 0.5, 0.0, 1.0);

  // Optional inversion: flip so dark video areas produce big dots.
  lum = mix(lum, 1.0 - lum, u_invert);

  // Dot radius:
  //   - originalColors off → halftone style: radius scales with luminance
  //   - originalColors on  → constant radius, brightness carried by src color
  float lumR = lum * u_radius * 0.5;
  float fixR = u_radius * 0.5;
  float r = mix(lumR, fixR, u_originalColors);
  float d = length(hu - c);
  float feather = 1.0 / cellPx;
  float a = 1.0 - smoothstep(r - feather, r + feather, d);

  vec3 dotCol = mix(u_colorFront, src, u_originalColors);
  vec3 final  = mix(u_colorBack, dotCol, a);

  // Static film-grain overlay (luminance noise, like Paper's grainOverlay)
  float n = hash(floor(px));
  final = clamp(final + (n - 0.5) * u_grain, 0.0, 1.0);

  outColor = vec4(final, 1.0);
}`;

  function compile(gl, type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
      console.error('halftone: shader compile failed', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function hexToRgb(h){
    const n = parseInt(h.replace('#',''), 16);
    return [((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255];
  }

  function mount(host){
    if(host.dataset.halftoneMounted) return;
    host.dataset.halftoneMounted = '1';

    const src      = host.dataset.src;
    const front    = host.dataset.front    || '#2C6F75';
    const back     = host.dataset.back     || '#ffffff';
    const original = host.dataset.original === '1' ? 1 : 0;
    const invert   = host.dataset.invert   === '1' ? 1 : 0;
    const cell     = parseFloat(host.dataset.cell     || '0.012');
    const radius   = parseFloat(host.dataset.radius   || '1.2');
    const contrast = parseFloat(host.dataset.contrast || '0.4');
    const grain    = parseFloat(host.dataset.grain    || '0.2');
    if(!src){ console.warn('halftone: missing data-src'); return; }

    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.preload = 'auto';
    host.appendChild(video);

    const canvas = document.createElement('canvas');
    canvas.className = 'halftone-canvas';
    host.appendChild(canvas);

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      desynchronized: true,
    });
    if(!gl){
      console.warn('halftone: WebGL2 unavailable; leaving host empty.');
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if(!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
      console.error('halftone: link failed', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1, -1, 1,
      -1, 1,  1,-1,  1, 1,
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

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uVideo     = u('u_video');
    const uRes       = u('u_resolution');
    const uVideoSize = u('u_videoSize');
    const uCell      = u('u_cell');
    const uRadius    = u('u_radius');
    const uContrast  = u('u_contrast');
    const uGrain     = u('u_grain');
    const uColor     = u('u_colorFront');
    const uBack      = u('u_colorBack');
    const uOriginal  = u('u_originalColors');
    const uInvert    = u('u_invert');
    const uTime      = u('u_time');

    gl.uniform1i(uVideo, 0);
    gl.uniform1f(uCell, cell);
    gl.uniform1f(uRadius, radius);
    gl.uniform1f(uContrast, contrast);
    gl.uniform1f(uGrain, grain);
    gl.uniform3fv(uColor, hexToRgb(front));
    gl.uniform3fv(uBack, hexToRgb(back));
    gl.uniform1f(uOriginal, original);
    gl.uniform1f(uInvert, invert);
    gl.uniform2f(uVideoSize, 1920, 1080); // updated on metadata

    function resize(){
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if(canvas.width !== w || canvas.height !== h){
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    }

    let metaReady = false;
    video.addEventListener('loadedmetadata', () => {
      metaReady = true;
      gl.uniform2f(uVideoSize, video.videoWidth || 1920, video.videoHeight || 1080);
    });
    const startPlayback = () => video.play().catch(() => {});
    startPlayback();
    // Some browsers require a user gesture; resume on first interaction.
    document.addEventListener('pointerdown', startPlayback, { once: true });
    document.addEventListener('visibilitychange', () => {
      if(document.visibilityState === 'visible') startPlayback();
    });

    if(typeof ResizeObserver !== 'undefined'){
      new ResizeObserver(resize).observe(host);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    const t0 = performance.now();
    function tick(){
      resize();
      if(metaReady && video.readyState >= 2){
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      }
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init(){ document.querySelectorAll(MOUNT).forEach(mount); }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
