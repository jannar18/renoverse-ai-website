/* Renoverse — Team section.
   Mounts an "our story / meet the team" block into every [data-team-section]
   on the page. Eyebrow + heading + body paragraph + optional names/role on
   the left, portrait (or labeled placeholder if no image is supplied) on the
   right.

   All copy and the image are configurable via data-attributes so the same
   component can ship across pages with different framings:

     <div data-team-section
          data-eyebrow="Our story"
          data-heading="Renoverse started inside a renovation that made the problem obvious."
          data-body="Our founder lived it as a client first…"
          data-names=""
          data-role="Founder, Renoverse"
          data-image="assets/founder.jpg"
          data-image-alt="Renoverse founder"
          data-link-href="about.html"
          data-link-label="Learn more"></div>

   Empty data-names suppresses the names line. Omit data-image and the slot
   renders a labeled placeholder. Both data-link-href and data-link-label must
   be set together for the optional CTA to render.

   The CTA reuses the .btn primitive from shared/button.css with the same
   markup as the ICP carousel CTA (4x .tk corner ticks + teal arrow puck),
   variant .btn--white (white fill + teal text) for the paper variant.
   Swap to .btn--frosted on dark surfaces.
*/
(function () {
  const MOUNT = '[data-team-section]';

  const DEFAULTS = {
    eyebrow: '',
    heading: 'Built by a team who understands.',
    body: 'Renoverse was inspired by its founder going through their own renovation chaos and realizing they wanted to create the solution.',
    names: 'Nola Solamon',
    role: 'Founder of Renoverse',
    image: '',
    imageAlt: 'Nola Solamon, founder of Renoverse',
    linkHref: '',
    linkLabel: ''
  };

  /* Same chevron used by the product-feature-primary CTAs —
     keeps arrow language consistent across components. (ICP carousel was
     cut in PR #21.) */
  const ARROW_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path d="M3 8h9M8 4l4 4-4 4"/></svg>`;

  function escape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function readAttr(host, name, fallback) {
    const v = host.getAttribute(name);
    return v === null ? fallback : v;
  }

  function readConfig(host) {
    return {
      eyebrow: readAttr(host, 'data-eyebrow', DEFAULTS.eyebrow),
      heading: readAttr(host, 'data-heading', DEFAULTS.heading),
      body: readAttr(host, 'data-body', DEFAULTS.body),
      names: readAttr(host, 'data-names', DEFAULTS.names),
      role: readAttr(host, 'data-role', DEFAULTS.role),
      image: readAttr(host, 'data-image', DEFAULTS.image),
      imageAlt: readAttr(host, 'data-image-alt', DEFAULTS.imageAlt),
      linkHref: readAttr(host, 'data-link-href', DEFAULTS.linkHref),
      linkLabel: readAttr(host, 'data-link-label', DEFAULTS.linkLabel)
    };
  }

  function buildMedia(cfg) {
    if (cfg.image) {
      return `<img src="${escape(cfg.image)}" alt="${escape(cfg.imageAlt)}" />`;
    }
    return `
      <div class="team-section__media-ph">
        <div>
          <span class="tag">Image placeholder</span>
          <small>Founder portrait</small>
        </div>
      </div>`;
  }

  function buildMarkup(cfg, theme) {
    const eyebrow = cfg.eyebrow
      ? `<p class="team-section__eyebrow">${escape(cfg.eyebrow)}</p>` : '';
    const heading = cfg.heading
      ? `<h2 class="team-section__heading">${escape(cfg.heading)}</h2>` : '';
    const body = cfg.body
      ? `<p class="team-section__body">${escape(cfg.body)}</p>` : '';
    const names = cfg.names
      ? `<p class="team-section__names">${escape(cfg.names)}</p>` : '';
    const role = cfg.role
      ? `<p class="team-section__role">${escape(cfg.role)}</p>` : '';
    const attribution = (names || role)
      ? `<div class="team-section__attribution">${names}${role}</div>` : '';
    /* Reuses the .btn primitive (4x .tk corner ticks + teal arrow puck) from
       the ICP carousel CTA, but swaps to .btn--white for the paper variant:
       white fill, teal text/border/ticks. */
    const link = (cfg.linkHref && cfg.linkLabel)
      ? `<a class="btn btn--white team-section__cta" href="${escape(cfg.linkHref)}">
           <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
           ${escape(cfg.linkLabel)}
           <span class="team-section__cta-arrow">${ARROW_SVG}</span>
         </a>`
      : '';
    const themeClass = theme === 'paper' ? ' team-section--paper' : '';

    return `
      <section class="team-section${themeClass}">
        <div class="team-section__wrap">
          <div class="team-section__row">
            <div class="team-section__copy">
              ${eyebrow}
              ${heading}
              ${body}
              ${attribution}
              ${link}
            </div>
            <div class="team-section__media">
              ${buildMedia(cfg)}
            </div>
          </div>
        </div>
      </section>`;
  }

  function mount(host) {
    if (host.dataset.tsMounted === '1') return;
    host.dataset.tsMounted = '1';
    const theme = host.getAttribute('data-theme') || '';
    host.innerHTML = buildMarkup(readConfig(host), theme);
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
