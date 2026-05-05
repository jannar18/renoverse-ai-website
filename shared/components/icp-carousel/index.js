/* Renoverse — ICP feature carousel.
   Mounts a three-panel carousel into every [data-icp-carousel] on the page.

   Phase 13 update: panels are now three Architect sub-personas (Principal
   Architects / Project Managers / Junior Designers). The existing SVG visuals
   + tints from the original four-ICP set (architects / builders / interior)
   are reused as-is — Paper redesign deferred to v2 when more ICPs ship.

   The halftone PNG is loaded relative to this script file, so the component
   can be dropped into any host page regardless of where the host is served.

   Optional fonts: Cormorant Garamond, JetBrains Mono. If the host page does
   not include them, this script will inject the Google Fonts <link>. */
(function () {
  const MOUNT = '[data-icp-carousel]';
  const SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
  const HALFTONE_URL = SCRIPT_SRC
    ? new URL('halftone-source.png', SCRIPT_SRC).href
    : 'halftone-source.png';

  const SOLUTIONS_HREF = 'solutions.html';

  const PANELS = [
    {
      id: 'principal-architects',
      title: 'For Principal Architects',
      lead: 'Reclaim time to take on more projects and grow your business.',
      quote: 'I feel like I’m putting out fires all day and don’t have any time to design anymore.',
      cta: 'Learn more',
      href: SOLUTIONS_HREF,
      object: { cls: 'obj--compass', svg: `
        <svg viewBox="0 0 1080 880" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="d-arch-a" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="currentColor"/><rect x="4" y="4" width="4" height="4" fill="currentColor"/></pattern>
            <pattern id="d-arch-b" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="currentColor"/></pattern>
            <linearGradient id="d-arch-fade" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
            <mask id="m-arch"><rect width="1080" height="880" fill="url(#d-arch-fade)"/></mask>
          </defs>
          <g mask="url(#m-arch)">
            <polygon points="540,90 240,860 320,860" fill="url(#d-arch-a)"/>
            <polygon points="540,90 840,860 760,860" fill="url(#d-arch-a)"/>
            <circle cx="540" cy="90" r="42" fill="url(#d-arch-b)"/>
            <rect x="492" y="180" width="96" height="16" fill="url(#d-arch-a)"/>
            <polygon points="350,520 410,520 405,548 354,548" fill="url(#d-arch-b)"/>
            <polygon points="670,520 730,520 726,548 674,548" fill="url(#d-arch-b)"/>
            <polygon points="240,860 320,860 312,890 248,890" fill="url(#d-arch-a)"/>
            <polygon points="760,860 840,860 832,890 768,890" fill="url(#d-arch-a)"/>
          </g>
        </svg>` }
    },
    {
      id: 'project-managers',
      title: 'For Project Managers',
      lead: 'Reclaim time to do more of the work you want to do — not the work you have to do.',
      quote: 'I miss the days when I used to be drafting and doing redlines. Now I’m constantly in meetings and reading 100 emails every day.',
      cta: 'Learn more',
      href: SOLUTIONS_HREF,
      objects: [
        { cls: 'obj--tools-l', svg: `
          <svg viewBox="0 0 760 760" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="d-build-a" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="currentColor"/><rect x="4" y="4" width="4" height="4" fill="currentColor"/></pattern>
              <linearGradient id="d-build-fade" x1="0" y1="0.2" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></linearGradient>
              <mask id="m-build-l"><rect width="760" height="760" fill="url(#d-build-fade)"/></mask>
            </defs>
            <g mask="url(#m-build-l)">
              <polygon points="180,300 540,300 360,640" fill="none" stroke="url(#d-build-a)" stroke-width="22"/>
            </g>
          </svg>` },
        { cls: 'obj--tools-r', svg: `
          <svg viewBox="0 0 720 760" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="d-build-c" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="currentColor"/><rect x="4" y="4" width="4" height="4" fill="currentColor"/></pattern>
              <linearGradient id="d-build-fade-r" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".4" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient>
              <mask id="m-build-r"><rect width="720" height="760" fill="url(#d-build-fade-r)"/></mask>
            </defs>
            <g mask="url(#m-build-r)">
              <polygon points="120,80 600,80 600,560" fill="none" stroke="url(#d-build-c)" stroke-width="20"/>
              <g stroke="currentColor" stroke-width="2" opacity=".55">
                <line x1="160" y1="120" x2="560" y2="120"/>
                <line x1="200" y1="160" x2="560" y2="160"/>
                <line x1="240" y1="200" x2="560" y2="200"/>
                <line x1="280" y1="240" x2="560" y2="240"/>
                <line x1="320" y1="280" x2="560" y2="280"/>
                <line x1="360" y1="320" x2="560" y2="320"/>
                <line x1="400" y1="360" x2="560" y2="360"/>
                <line x1="440" y1="400" x2="560" y2="400"/>
                <line x1="480" y1="440" x2="560" y2="440"/>
              </g>
            </g>
          </svg>` }
      ]
    },
    {
      id: 'junior-designers',
      title: 'For Junior Designers',
      lead: 'Reclaim time and energy to jump into new projects — without long onboarding or waiting on your manager’s calendar.',
      quote: 'Seniors are directly notified of design changes from clients, but they’re usually so slammed they forget to tell me — so I often spend extra days drafting against an old design intent.',
      cta: 'Learn more',
      href: SOLUTIONS_HREF,
      object: { cls: 'obj--sketch', svg: `
        <svg viewBox="0 0 1080 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="d-int-a" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="currentColor"/><rect x="4" y="4" width="4" height="4" fill="currentColor"/></pattern>
            <pattern id="d-int-b" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="currentColor"/></pattern>
            <pattern id="d-int-p1" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#B45230"/></pattern>
            <pattern id="d-int-p2" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#1B3A6E"/></pattern>
            <pattern id="d-int-p3" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#6B5F50"/></pattern>
            <linearGradient id="d-int-fade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient>
            <mask id="m-int"><rect width="1080" height="800" fill="url(#d-int-fade)"/></mask>
          </defs>
          <g mask="url(#m-int)">
            <rect x="180" y="180" width="720" height="500" fill="url(#d-int-a)"/>
            <rect x="180" y="180" width="40" height="500" fill="url(#d-int-b)"/>
            <line x1="220" y1="220" x2="220" y2="660" stroke="#1F1C18" stroke-width="2" stroke-dasharray="6 8"/>
            <g stroke="currentColor" stroke-width="2" opacity=".55">
              <line x1="280" y1="280" x2="820" y2="280"/>
              <line x1="280" y1="340" x2="780" y2="340"/>
              <line x1="280" y1="400" x2="820" y2="400"/>
              <line x1="280" y1="460" x2="700" y2="460"/>
              <line x1="280" y1="520" x2="780" y2="520"/>
              <line x1="280" y1="580" x2="640" y2="580"/>
            </g>
            <rect x="540" y="440" width="240" height="22" fill="url(#d-int-p1)" transform="rotate(-12 660 451)"/>
            <rect x="500" y="490" width="240" height="22" fill="url(#d-int-p2)" transform="rotate(-8 620 501)"/>
            <rect x="540" y="540" width="240" height="22" fill="url(#d-int-p3)" transform="rotate(-3 660 551)"/>
          </g>
        </svg>` }
    },
  ];

  const ARROW_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path d="M3 8h9M8 4l4 4-4 4"/></svg>`;
  /* Nav-button arrows are larger than the CTA puck (24x24) so they read as
     primary controls — same chevron geometry, drawn at 24px stroke for the
     bigger frame. */
  const NAV_ARROW_LEFT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`;
  const NAV_ARROW_RIGHT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

  /* ===== WebGL halftone shader =====
     Samples the source PNG per dot-cell, computes luminance, emits a dark
     dot whose radius scales with darkness — classic halftone print.
     Composited over the gradient via mix-blend-mode: overlay. */
  /* Tints reuse the original four-ICP palette: principal-architects keeps
     the "architects" oxford tint, project-managers keeps the "builders"
     warm teal tint, junior-designers keeps the "interior" oxford tint. */
  const TINTS = {
    'principal-architects': [0.043, 0.102, 0.169],
    'project-managers':     [0.227, 0.122, 0.071],
    'junior-designers':     [0.106, 0.122, 0.306]
  };
  const PANEL_ORDER = ['principal-architects', 'project-managers', 'junior-designers'];

  function setupShader(canvas) {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true })
            || canvas.getContext('experimental-webgl');
    if (!gl) { canvas.style.display = 'none'; return null; }

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('icp-carousel shader compile error:', gl.getShaderInfoLog(s));
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
    gl.attachShader(prog, vert); gl.attachShader(prog, frag); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('icp-carousel shader link error:', gl.getProgramInfoLog(prog));
      return null;
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

    let curTint    = TINTS[PANEL_ORDER[0]].slice();
    let startTint  = curTint.slice();
    let targetTint = curTint.slice();
    let tintT = 1, tintStart = 0;
    const TINT_DUR = 700;

    function tintStep(now) {
      if (!tintStart) tintStart = now;
      tintT = Math.min(1, (now - tintStart) / TINT_DUR);
      const e = tintT < 0.5 ? 2*tintT*tintT : 1 - Math.pow(-2*tintT + 2, 2)/2;
      for (let k = 0; k < 3; k++) curTint[k] = startTint[k] + (targetTint[k] - startTint[k]) * e;
      render();
      if (tintT < 1) requestAnimationFrame(tintStep);
    }

    function setTint(panelIndex) {
      const id = PANEL_ORDER[panelIndex];
      const next = TINTS[id];
      if (!next) return;
      if (next[0] === targetTint[0] && next[1] === targetTint[1] && next[2] === targetTint[2]) return;
      startTint = curTint.slice();
      targetTint = next.slice();
      tintStart = 0;
      requestAnimationFrame(tintStep);
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([128, 128, 128, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    let imgW = 1, imgH = 1, ready = false;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      imgW = img.naturalWidth; imgH = img.naturalHeight;
      ready = true;
      render();
    };
    img.onerror = () => { canvas.style.display = 'none'; };
    img.src = HALFTONE_URL;

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
      gl.uniform3f(uTint, curTint[0], curTint[1], curTint[2]);
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

    return { setTint };
  }

  function setupCarousel(root, shader) {
    const TRANSITION = 'transform 700ms cubic-bezier(.7,0,.2,1)';
    const bgTrack = root.querySelector('.icp-carousel__track');
    const titlesTrack = root.querySelector('.icp-carousel__titles-track');
    const realPanels = Array.from(bgTrack.children);
    const N = realPanels.length;

    bgTrack.appendChild(realPanels[0].cloneNode(true));
    bgTrack.insertBefore(realPanels[N - 1].cloneNode(true), bgTrack.firstChild);
    const titles = Array.from(titlesTrack.children);

    let trackI = 1;
    let animating = false;

    function logical() { return (trackI - 1 + N) % N; }

    function applyTransform(animate) {
      const t = animate ? TRANSITION : 'none';
      titlesTrack.style.transition = t;
      bgTrack.style.transition = t;
      const slide = titles[trackI];
      if (slide) {
        const center = slide.offsetLeft + slide.offsetWidth / 2;
        const viewportCenter = root.clientWidth / 2;
        titlesTrack.style.transform = `translate(${viewportCenter - center}px, -50%)`;
      }
      bgTrack.style.transform = `translateX(-${trackI * 100}%)`;
    }

    function setAria() {
      titles.forEach((t, idx) => {
        if (idx === trackI) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
      if (shader && shader.setTint) shader.setTint(logical());
    }

    function snapIfClone() {
      if (trackI === 0) trackI = N;
      else if (trackI === N + 1) trackI = 1;
      else return;
      applyTransform(false);
      void titlesTrack.offsetHeight;
      void bgTrack.offsetHeight;
      setAria();
    }

    function endAnim() {
      if (!animating) return;
      if (trackI === 0 || trackI === N + 1) snapIfClone();
      animating = false;
    }

    titlesTrack.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') endAnim();
    });

    function go(delta) {
      if (animating) return;
      trackI += delta;
      animating = true;
      setAria();
      applyTransform(true);
      setTimeout(endAnim, 760);
    }

    function goTo(target) {
      if (animating) return;
      const current = logical();
      if (target === current) return;
      let delta = target - current;
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      go(delta);
    }

    titlesTrack.addEventListener('click', (e) => {
      const slide = e.target.closest('.icp-carousel__title-slide');
      if (!slide) return;
      if (slide.dataset.clone === 'end') return go(-1);
      if (slide.dataset.clone === 'start') return go(1);
      goTo(Number(slide.dataset.i));
    });

    /* Visible prev/next nav buttons + invisible side tap zones — both routed
       through the same `go()` step so the title carousel, the panel slide,
       the tint, and the keyboard nav stay in sync. */
    const navPrev = root.querySelector('.icp-carousel__nav--prev');
    const navNext = root.querySelector('.icp-carousel__nav--next');
    const tapPrev = root.querySelector('.icp-carousel__tap-zone--prev');
    const tapNext = root.querySelector('.icp-carousel__tap-zone--next');
    if (navPrev) navPrev.addEventListener('click', () => go(-1));
    if (navNext) navNext.addEventListener('click', () => go(1));
    if (tapPrev) tapPrev.addEventListener('click', () => go(-1));
    if (tapNext) tapNext.addEventListener('click', () => go(1));

    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
    });

    let startX = null;
    root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      startX = null;
    });

    setAria();
    applyTransform(false);
    window.addEventListener('resize', () => applyTransform(false));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => applyTransform(false));
    }
    requestAnimationFrame(() => applyTransform(false));
  }

  function ensureFonts() {
    const HREF = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&family=Cormorant+Garamond:ital,wght@1,400&family=JetBrains+Mono:wght@400;500&display=swap';
    if (document.querySelector(`link[href="${HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = HREF;
    document.head.appendChild(link);
  }

  function buildPanel(p) {
    const objects = p.objects || (p.object ? [p.object] : []);
    const objHTML = objects.map(o => `
      <div class="icp-carousel__object ${o.cls}" aria-hidden="true">${o.svg}</div>
    `).join('');
    /* Phase 13: panels render the in-role voice as a styled italic blockquote
       (left-rule + italic) so it reads as the persona speaking, not marketing
       copy. Older `copy` field is still accepted as a fallback for any host
       page that hasn't migrated. */
    const bodyHTML = p.quote
      ? `<blockquote class="icp-carousel__quote">${p.quote}</blockquote>`
      : `<p class="icp-carousel__copy">${p.copy}</p>`;
    return `
      <article class="icp-carousel__panel" data-id="${p.id}">
        ${objHTML}
        <div class="icp-carousel__halftone" style="background-image: url('${HALFTONE_URL}')"></div>
        <div class="icp-carousel__grain"></div>
        <div class="icp-carousel__content">
          <div class="icp-carousel__body">
            <p class="icp-carousel__lead">${p.lead}</p>
            ${bodyHTML}
          </div>
          <a href="${p.href || '#'}" class="btn btn--frosted icp-carousel__cta">
            <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
            ${p.cta}
            <span class="icp-carousel__cta-arrow">${ARROW_SVG}</span>
          </a>
        </div>
      </article>`;
  }

  function buildMarkup() {
    const panels = PANELS.map(buildPanel).join('');
    const lastTitle = PANELS[PANELS.length - 1];
    const firstTitle = PANELS[0];
    const titleSlides = [
      `<button type="button" class="icp-carousel__title-slide" data-i="${PANELS.length - 1}" data-clone="end">${lastTitle.title}</button>`,
      ...PANELS.map((p, i) =>
        `<button type="button" class="icp-carousel__title-slide" data-i="${i}"${i === 0 ? ' aria-current="true"' : ''}>${p.title}</button>`),
      `<button type="button" class="icp-carousel__title-slide" data-i="0" data-clone="start">${firstTitle.title}</button>`
    ].join('');

    return `
      <canvas class="icp-carousel__shader" aria-hidden="true"></canvas>
      <div class="icp-carousel__viewport">
        <div class="icp-carousel__track">${panels}</div>
      </div>
      <button type="button" class="icp-carousel__tap-zone icp-carousel__tap-zone--prev" tabindex="-1" aria-hidden="true"></button>
      <button type="button" class="icp-carousel__tap-zone icp-carousel__tap-zone--next" tabindex="-1" aria-hidden="true"></button>
      <button type="button" class="icp-carousel__nav icp-carousel__nav--prev" aria-label="Previous slide">
        ${NAV_ARROW_LEFT_SVG}
      </button>
      <button type="button" class="icp-carousel__nav icp-carousel__nav--next" aria-label="Next slide">
        ${NAV_ARROW_RIGHT_SVG}
      </button>
      <div class="icp-carousel__heading">
        <div class="icp-carousel__overline">One Space</div>
        <div class="icp-carousel__titles">
          <div class="icp-carousel__titles-track">${titleSlides}</div>
        </div>
      </div>`;
  }

  function mount(target) {
    target.classList.add('icp-carousel');
    target.setAttribute('aria-label', target.getAttribute('aria-label') || 'Our Promise');
    target.innerHTML = buildMarkup();
    const canvas = target.querySelector('.icp-carousel__shader');
    const shader = canvas ? setupShader(canvas) : null;
    setupCarousel(target, shader);
  }

  function init() {
    ensureFonts();
    document.querySelectorAll(MOUNT).forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
