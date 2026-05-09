/* Renoverse — Product features cards (2x2 grid).
   Mounts the homepage core-capabilities 2x2 card grid into every
   [data-product-features-cards-2x2] on the page.

     <div data-product-features-cards-2x2
          data-cta-href="solutions.html"
          data-cta-label="See all features"
          data-items='[
            { "title": "...", "body": "...", "image": "...", "alt": "..." },
            { "title": "...", "body": "...", "placeholder": true,
              "placeholderTag": "Image placeholder",
              "placeholderLabel": "Stakeholder access view" }
          ]'></div>

   Each item:
     { title, body, image, alt,
       placeholder?: boolean,
       placeholderLabel?: string,
       placeholderTag?: string       // default "Image placeholder"
     }
*/
(function () {
  const MOUNT = '[data-product-features-cards-2x2]';

  const ARROW_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M3 8h9M8 4l4 4-4 4"/></svg>`;

  function escape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function readItems(host) {
    const raw = host.getAttribute('data-items');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) { /* fall through */ }
    return [];
  }

  function readCta(host) {
    const href = host.getAttribute('data-cta-href');
    const label = host.getAttribute('data-cta-label');
    if (!href || !label) return null;
    return { href, label };
  }

  function buildImage(item) {
    if (item.placeholder) {
      const tag = escape(item.placeholderTag || 'Image placeholder');
      const label = escape(item.placeholderLabel || '');
      return `
        <div class="product-features-cards-2x2__card-image product-features-cards-2x2__card-image--ph">
          <div>
            <span class="tag">${tag}</span>
            ${label ? `<small>${label}</small>` : ''}
          </div>
        </div>`;
    }
    return `
      <div class="product-features-cards-2x2__card-image">
        <img src="${escape(item.image || '')}" alt="${escape(item.alt || '')}" loading="lazy" />
      </div>`;
  }

  function buildCard(item) {
    return `
      <article class="product-features-cards-2x2__card">
        <div class="product-features-cards-2x2__card-copy">
          <h3 class="product-features-cards-2x2__card-title">${escape(item.title || '')}</h3>
          <p class="product-features-cards-2x2__card-body">${escape(item.body || '')}</p>
        </div>
        ${buildImage(item)}
      </article>`;
  }

  function buildCta(cta) {
    if (!cta) return '';
    return `
      <div class="product-features-cards-2x2__cta-row">
        <a class="btn btn--filled" href="${escape(cta.href)}">
          <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
          ${escape(cta.label)}
          <span class="product-features-cards-2x2__cta-arrow">${ARROW_SVG}</span>
        </a>
      </div>`;
  }

  function buildMarkup(items, cta) {
    return `
      <section class="product-features-cards-2x2">
        <div class="product-features-cards-2x2__wrap">
          <div class="product-features-cards-2x2__grid">
            ${items.map(buildCard).join('')}
          </div>
          ${buildCta(cta)}
        </div>
      </section>`;
  }

  function animate(host) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    const cards = host.querySelectorAll('.product-features-cards-2x2__card');
    if (!cards.length) return;

    window.gsap.set(cards, { opacity: 0, y: 24 });
    window.gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: host,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  function mount(host) {
    if (host.dataset.productFeaturesCards2x2Mounted === '1') return;
    host.dataset.productFeaturesCards2x2Mounted = '1';
    host.innerHTML = buildMarkup(readItems(host), readCta(host));
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
