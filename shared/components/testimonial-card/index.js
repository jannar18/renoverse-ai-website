/* Renoverse — Testimonial card.
   Mounts a single customer-quote card into every [data-testimonial-card]
   on the page. Layout per wireframe (REVISIONS Round 3 #5):
     - chunky open-quote glyph upper-left
     - Cormorant italic quote dominating the card width
     - bottom-right cluster: optional square slot → hairline divider →
       attribution stack (Name 600 / Role / Company)

   Three modes via data attributes — image OR logo OR neither (name-only).
   Divider always present so the attribution sits in the same column
   regardless of mode.

     <div data-testimonial-card
          data-quote="Renoverse has proven to be an invaluable…"
          data-name="Sabrina Vogel"
          data-role="Owner & Principal"
          data-company="SLC Architect"
          data-logo="assets/slc-logo.webp"
          data-logo-alt="SLC Architect"></div>

   Slot precedence: data-image wins over data-logo. Omit both for
   name-only.
*/
(function () {
  const MOUNT = '[data-testimonial-card]';

  function escape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function attr(host, key) {
    const v = host.getAttribute(key);
    return v == null ? '' : v;
  }

  function buildSlot(host) {
    const image = attr(host, 'data-image');
    if (image) {
      const alt = attr(host, 'data-image-alt') || attr(host, 'data-name') || '';
      return `
        <div class="testimonial-card__slot testimonial-card__slot--image">
          <img src="${escape(image)}" alt="${escape(alt)}" loading="lazy" />
        </div>`;
    }
    const logo = attr(host, 'data-logo');
    if (logo) {
      const alt = attr(host, 'data-logo-alt') || attr(host, 'data-company') || '';
      return `
        <div class="testimonial-card__slot testimonial-card__slot--logo">
          <img src="${escape(logo)}" alt="${escape(alt)}" loading="lazy" />
        </div>`;
    }
    return '';
  }

  function buildAttrib(host) {
    const name = attr(host, 'data-name');
    const role = attr(host, 'data-role');
    const company = attr(host, 'data-company');
    return `
      <div class="testimonial-card__attrib">
        ${name ? `<p class="testimonial-card__name">${escape(name)}</p>` : ''}
        ${role ? `<p class="testimonial-card__meta">${escape(role)}</p>` : ''}
        ${company ? `<p class="testimonial-card__meta">${escape(company)}</p>` : ''}
      </div>`;
  }

  function buildMarkup(host) {
    const quote = attr(host, 'data-quote');
    return `
      <section class="testimonial-card-section">
        <div class="testimonial-card-section__wrap">
          <article class="testimonial-card" data-nav-tone="dark">
            <div class="fx-grain fx-grain--warm"></div>
            <div class="testimonial-card__inner">
              <span class="testimonial-card__mark" aria-hidden="true">&ldquo;</span>
              <blockquote class="testimonial-card__quote">${escape(quote)}</blockquote>
              <footer class="testimonial-card__credit">
                ${buildSlot(host)}
                <span class="testimonial-card__divider" aria-hidden="true"></span>
                ${buildAttrib(host)}
              </footer>
            </div>
          </article>
        </div>
      </section>`;
  }

  function mount(host) {
    if (host.dataset.mounted === '1') return;
    host.dataset.mounted = '1';
    host.innerHTML = buildMarkup(host);
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
