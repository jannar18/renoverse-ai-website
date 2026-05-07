/* Renoverse — Product features card (3x1 row).
   Mounts the Solutions "rest comes built-in" 3-up row into every
   [data-product-features-card-3x1] on the page.

     <div data-product-features-card-3x1
          data-heading="And the rest comes built-in."
          data-items='[
            { "title": "...", "body": "...", "image": "...", "alt": "..." }
          ]'></div>

   Each item:
     { title, body, image, alt,
       placeholder?: boolean,
       placeholderLabel?: string,
       placeholderTag?: string       // default "Image placeholder"
     }
*/
(function () {
  const MOUNT = '[data-product-features-card-3x1]';

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

  function readHeading(host) {
    return host.getAttribute('data-heading') || '';
  }

  function buildImage(item) {
    if (item.placeholder) {
      const tag = escape(item.placeholderTag || 'Image placeholder');
      const label = escape(item.placeholderLabel || '');
      return `
        <div class="product-features-card-3x1__card-image product-features-card-3x1__card-image--ph">
          <div>
            <span class="tag">${tag}</span>
            ${label ? `<small>${label}</small>` : ''}
          </div>
        </div>`;
    }
    return `
      <div class="product-features-card-3x1__card-image">
        <img src="${escape(item.image || '')}" alt="${escape(item.alt || '')}" loading="lazy" />
      </div>`;
  }

  function buildCard(item) {
    return `
      <article class="product-features-card-3x1__card">
        <div class="product-features-card-3x1__card-copy">
          <h3 class="product-features-card-3x1__card-title">${escape(item.title || '')}</h3>
          <p class="product-features-card-3x1__card-body">${escape(item.body || '')}</p>
        </div>
        ${buildImage(item)}
      </article>`;
  }

  function buildHeading(heading) {
    if (!heading) return '';
    return `<h2 class="product-features-card-3x1__heading">${escape(heading)}</h2>`;
  }

  function buildMarkup(items, heading) {
    return `
      <section class="product-features-card-3x1">
        <div class="product-features-card-3x1__wrap">
          ${buildHeading(heading)}
          <div class="product-features-card-3x1__grid">
            ${items.map(buildCard).join('')}
          </div>
        </div>
      </section>`;
  }

  function animate(host) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    const cards = host.querySelectorAll('.product-features-card-3x1__card');
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
    if (host.dataset.mounted === '1') return;
    host.dataset.mounted = '1';
    host.innerHTML = buildMarkup(readItems(host), readHeading(host));
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
