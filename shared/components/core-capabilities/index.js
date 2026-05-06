/* Renoverse — Core capabilities (2x2 grid).
   Mounts a 2x2 card grid of the four core platform capabilities into every
   [data-core-capabilities] on the page, capped by a "See all product features"
   CTA below the grid.

   Each card: image (rendered with white-paper backdrop) → H3 title (Poppins 500)
   → body. No eyebrow per Phase 14. The alternating-features component is kept
   and reused on solutions.html for the deep-dive variant; this is the homepage
   teaser.

   Hosts can override items + CTA via data-attributes:

     <div data-core-capabilities
          data-cta-label="See all product features →"
          data-cta-href="solutions.html"
          data-items='[{"title":"...","body":"...","image":"...","alt":"..."}, ...]'></div>

   `data-items` must be a JSON array. Invalid JSON falls back to defaults.
*/
(function () {
  const MOUNT = '[data-core-capabilities]';

  const DEFAULT_ITEMS = [
    {
      title: 'Email Triage & Auto-Capture',
      body: "The decisions buried in a 40-message chain don't disappear. Ella AI automatically surfaces what matters — organized by project, ready to act on, with the information provenance one click away.",
      image: 'assets/feature-email-triage.png',
      alt: 'Renoverse Ella AI triage inbox surfacing decisions, questions, and action items extracted from project emails'
    },
    {
      title: 'Decision Log & Audit Trail',
      body: 'Know who decided what, when, and why — without anyone having to write it down. Every decision is captured, timestamped, and traceable back to its source from first log through final approval.',
      image: 'assets/feature-decision-log.png',
      alt: 'Renoverse decision log with timestamped audit trail tracing a backsplash tile selection from first log to final approval'
    },
    {
      title: 'Intelligence Layer on Existing Stack',
      body: 'Nothing gets replaced. Renoverse connects to Microsoft 365 tools and acts as the intelligent coordination layer on top so information flows between systems seamlessly.',
      image: 'assets/feature-intelligence-layer.png',
      alt: 'Renoverse Connectors page showing Gmail, Outlook, and other communication and storage integrations'
    },
    {
      title: 'Controlled Stakeholder Access',
      body: 'Control visibility with three access tiers: internal team, professional collaborators, and client — so private work stays private, and stakeholders and clients see exactly what they need, nothing more.',
      image: '',
      alt: ''
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
    if (item.image) {
      return `
        <div class="core-capabilities__media">
          <img src="${escape(item.image)}" alt="${escape(item.alt || '')}" loading="lazy" />
        </div>`;
    }
    /* Placeholder voice mirrors team-section's: striped 45deg fill + Eyebrow-style
       label so missing-asset cards still read as intentional placeholders. */
    return `
      <div class="core-capabilities__media core-capabilities__media--ph">
        <div>
          <span class="tag">Image placeholder</span>
          <small>Stakeholder access</small>
        </div>
      </div>`;
  }

  function buildCard(item) {
    return `
      <article class="core-capabilities__card">
        ${buildMedia(item)}
        <div class="core-capabilities__copy">
          <h3 class="core-capabilities__title">${escape(item.title)}</h3>
          <p class="core-capabilities__body">${escape(item.body)}</p>
        </div>
      </article>`;
  }

  function buildMarkup(items, cta) {
    return `
      <section class="core-capabilities">
        <div class="core-capabilities__wrap">
          <div class="core-capabilities__grid">
            ${items.map(buildCard).join('')}
          </div>
          <div class="core-capabilities__cta-row">
            <a class="btn btn--filled" href="${escape(cta.href)}">
              <span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>
              ${escape(cta.label)}
            </a>
          </div>
        </div>
      </section>`;
  }

  function animate(host) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    const cards = host.querySelectorAll('.core-capabilities__card');
    if (!cards.length) return;

    /* Brand baseline per STYLE_GUIDE: 24-32px slide from below + opacity 0 → 1,
       600ms ease-out, 80ms stagger between cards. Trigger when grid top crosses
       80% of viewport. */
    window.gsap.set(cards, { opacity: 0, y: 28 });
    window.gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: host.querySelector('.core-capabilities__grid'),
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  function mount(host) {
    if (host.dataset.ccMounted === '1') return;
    host.dataset.ccMounted = '1';
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
