/* Renoverse — Feature highlights (text-only).
   Mounts a four-up grid of titled feature teasers + a single CTA into every
   [data-feature-highlights] on the page.

   Defaults to the canonical homepage 4 highlights (Frictionless collaboration,
   Version control, AI assistant, Accountability trail) and a "See solutions"
   CTA. Hosts can override either via data-attributes:

     <div data-feature-highlights
          data-cta-label="Learn more"
          data-cta-href="/solutions"
          data-items='[{"title":"...","copy":"..."}, ...]'></div>

   `data-items` must be a JSON array. Invalid JSON falls back to defaults.
*/
(function () {
  const MOUNT = '[data-feature-highlights]';

  const DEFAULT_ITEMS = [
    {
      title: 'Frictionless collaboration',
      copy: 'Consolidate communication in one unified workspace—so nothing gets lost across emails and texts.'
    },
    {
      title: 'Version control',
      copy: 'Manage design plan revisions so all stakeholders collaborate on the correct set.'
    },
    {
      title: 'AI assistant',
      copy: 'Automate repetitive admin, query project info & town documents, and field homeowner questions.'
    },
    {
      title: 'Accountability trail',
      copy: 'Track every decision, approval, and change timestamped in one transparent source of truth.'
    }
  ];

  const DEFAULT_CTA = { label: 'See solutions', href: 'solutions.html' };

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

  function buildItem(item) {
    return `
      <div class="feature-highlights__item">
        <h3>${escape(item.title)}</h3>
        <p>${escape(item.copy)}</p>
      </div>`;
  }

  function buildMarkup(items, cta) {
    return `
      <section class="feature-highlights">
        <div class="feature-highlights__wrap">
          <div class="feature-highlights__grid">
            ${items.map(buildItem).join('')}
          </div>
          <div class="feature-highlights__cta-row">
            <a class="btn btn--filled" href="${escape(cta.href)}">
              <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
              ${escape(cta.label)}
            </a>
          </div>
        </div>
      </section>`;
  }

  function mount(host) {
    if (host.dataset.fhMounted === '1') return;
    host.dataset.fhMounted = '1';
    host.innerHTML = buildMarkup(readItems(host), readCta(host));
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
