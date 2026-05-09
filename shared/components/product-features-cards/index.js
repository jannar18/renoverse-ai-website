/* Renoverse — Product features cards.
   Unified parameterized cards grid. Mounts into every
   [data-product-features-cards] element on the page.

     <div data-product-features-cards
          data-cols="2"
          data-cta-href="solutions.html"
          data-cta-label="See all features"
          data-items='[
            { "title": "...", "body": "...", "image": "...", "alt": "..." },
            { "title": "...", "body": "...", "placeholder": true,
              "placeholderTag": "Image placeholder",
              "placeholderLabel": "Stakeholder access view" }
          ]'></div>

   Required attributes:
     data-cols   "2" | "3" — grid column count + visual preset.
                            cols=2 is the homepage "compact" preset (Small-
                            body register, 3:1 cropped image strip, flat-
                            paper card with subtle drop shadow). cols=3 is
                            the Solutions "breathing" preset (full Body
                            register, natural-aspect image well, flat
                            cream card, full section padding + min-100vh
                            centered at ≥1024px).
     data-items  JSON array of card items.

   Optional attributes:
     data-heading       centered Cormorant italic H2 above the grid
                        (Solutions "And the rest comes built-in.")
     data-cta-href      bracket-corner button href below the grid
     data-cta-label     bracket-corner button label below the grid
                        (homepage "See all features" → solutions.html)

   Each item:
     { title, body, image, alt,
       placeholder?: boolean,
       placeholderLabel?: string,
       placeholderTag?: string       // default "Image placeholder"
     }

   Replaces the deprecated product-features-cards-2x2 and
   product-features-card-3x1 components — same primitive, parameterized
   per AGENTS.md house rule "match X = same primitive parameterized".
*/
(function () {
  const MOUNT = '[data-product-features-cards]';

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

  function readCols(host) {
    const v = host.getAttribute('data-cols');
    return v === '3' ? '3' : '2';
  }

  function readHeading(host) {
    return host.getAttribute('data-heading') || '';
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
        <div class="product-features-cards__card-image product-features-cards__card-image--ph">
          <div>
            <span class="tag">${tag}</span>
            ${label ? `<small>${label}</small>` : ''}
          </div>
        </div>`;
    }
    return `
      <div class="product-features-cards__card-image">
        <img src="${escape(item.image || '')}" alt="${escape(item.alt || '')}" loading="lazy" />
      </div>`;
  }

  function buildCard(item) {
    return `
      <article class="product-features-cards__card">
        <div class="product-features-cards__card-copy">
          <h3 class="product-features-cards__card-title">${escape(item.title || '')}</h3>
          <p class="product-features-cards__card-body">${escape(item.body || '')}</p>
        </div>
        ${buildImage(item)}
      </article>`;
  }

  function buildHeading(heading) {
    if (!heading) return '';
    return `<h2 class="product-features-cards__heading">${escape(heading)}</h2>`;
  }

  function buildCta(cta) {
    if (!cta) return '';
    return `
      <div class="product-features-cards__cta-row">
        <a class="btn btn--filled" href="${escape(cta.href)}">
          <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
          ${escape(cta.label)}
          <span class="product-features-cards__cta-arrow">${ARROW_SVG}</span>
        </a>
      </div>`;
  }

  function buildMarkup(items, cols, heading, cta) {
    return `
      <section class="product-features-cards" data-cols="${cols}">
        <div class="product-features-cards__wrap">
          ${buildHeading(heading)}
          <div class="product-features-cards__grid">
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

    const cards = host.querySelectorAll('.product-features-cards__card');
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
    if (host.dataset.productFeaturesCardsMounted === '1') return;
    host.dataset.productFeaturesCardsMounted = '1';
    host.innerHTML = buildMarkup(
      readItems(host),
      readCols(host),
      readHeading(host),
      readCta(host)
    );
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
