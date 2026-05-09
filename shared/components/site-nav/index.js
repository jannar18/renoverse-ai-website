/* Renoverse — site-nav.
   Mounts the shared top navigation into every [data-site-nav] element.
   The component owns its markup so any link/CTA change propagates to
   every page that includes it.

   The host page is expected to live in renoverse/ (or a sibling
   prototype directory that mirrors that structure) so the relative
   asset path "assets/logo-black.png" and the "index.html"/"demo.html"
   targets resolve correctly against the host document URL.

   Optional overrides on the mount element:
     data-logo-src    path to the brand logo (default: assets/logo-black.png)
     data-mode        "hero" (default) — starts transparent, fades to a
                      frosted slim bar after the user scrolls past the
                      threshold. "solid" — always frosted (use on pages
                      that have no hero behind the nav, e.g. demo.html).
*/
(function () {
  const MOUNT = '[data-site-nav]';
  // Px the user must scroll before the nav transitions from transparent
  // to the frosted state. Small enough that the change registers as
  // soon as they leave the hero landing position.
  const SCROLL_THRESHOLD = 50;
  // Mobile breakpoint — mirrors the CSS @media (max-width: 820px) rule
  // that hides .nav-links and shows the hamburger toggle.
  const MOBILE_MAX = 820;

  const TICKS = '<span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>';

  function template(opts) {
    const logoSrc = opts.logoSrc || 'assets/logo-black.png';
    return `
      <div class="nav-inner">
        <a class="nav-brand" href="index.html"><img src="${logoSrc}" alt="Renoverse" /></a>
        <div class="nav-right">
          <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="solutions.html">Solutions</a>
            <a href="about.html">About</a>
          </div>
          <a class="btn btn--filled nav-cta" href="demo.html">${TICKS}Book a demo</a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-sheet" aria-label="Open menu">
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
          </button>
        </div>
      </div>
      <div class="nav-sheet" id="nav-sheet" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden="true">
        <div class="nav-sheet__inner">
          <nav class="nav-sheet__links" aria-label="Mobile menu">
            <a href="index.html">Home</a>
            <a href="solutions.html">Solutions</a>
            <a href="about.html">About</a>
          </nav>
          <a class="btn btn--filled" href="demo.html">${TICKS}Book a demo</a>
        </div>
      </div>`;
  }

  // The vertical band at the top of the viewport that the nav occupies.
  // Used by tone detection to decide whether the section currently
  // behind the bar is light or dark. Generous so the swap fires
  // slightly before the section visually meets the nav.
  const NAV_BAND_PX = 96;

  function detectDarkTone(target) {
    const darkSections = document.querySelectorAll('[data-nav-tone="dark"]');
    if (!darkSections.length) return false;
    for (let i = 0; i < darkSections.length; i++) {
      const rect = darkSections[i].getBoundingClientRect();
      // Section overlaps the nav band if its top is above the band's
      // bottom edge AND its bottom is below the viewport's top edge.
      if (rect.top < NAV_BAND_PX && rect.bottom > 0) return true;
    }
    return false;
  }

  function attachScrollState(target) {
    const isSolid = (target.dataset.mode || 'hero') === 'solid';
    if (isSolid) target.classList.add('is-scrolled');

    let ticking = false;
    const update = () => {
      ticking = false;
      if (!isSolid) {
        const scrolled = (window.scrollY || window.pageYOffset || 0) > SCROLL_THRESHOLD;
        target.classList.toggle('is-scrolled', scrolled);
      }
      // Skip dark-tone detection while the mobile sheet is open — the
      // sheet's cream backdrop is what's behind the bar then, not the
      // page sections.
      if (target.classList.contains('is-menu-open')) {
        target.classList.remove('is-dark');
      } else {
        target.classList.toggle('is-dark', detectDarkTone(target));
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Initial sync — handles the case where the page loads scrolled
    // (e.g. anchor link, refresh mid-page).
    update();
    // Expose so the menu controller can re-sync the dark-tone class
    // when the sheet closes.
    target._navResync = update;
  }

  function attachMobileMenu(target) {
    const toggle = target.querySelector('.nav-toggle');
    const sheet = target.querySelector('.nav-sheet');
    if (!toggle || !sheet) return;

    let lastFocused = null;

    function open() {
      target.classList.add('is-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      sheet.setAttribute('aria-hidden', 'false');
      // Lock scroll behind the sheet.
      document.body.style.overflow = 'hidden';
      lastFocused = document.activeElement;
      const first = sheet.querySelector('a');
      if (first) requestAnimationFrame(() => first.focus());
      if (typeof target._navResync === 'function') target._navResync();
    }

    function close() {
      target.classList.remove('is-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      sheet.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      } else {
        toggle.focus();
      }
      if (typeof target._navResync === 'function') target._navResync();
    }

    toggle.addEventListener('click', () => {
      if (target.classList.contains('is-menu-open')) close();
      else open();
    });

    // Tapping a link inside the sheet should close the menu — same-page
    // anchor links wouldn't navigate away, so the user would otherwise
    // be stuck behind a still-open sheet.
    sheet.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });

    // Keyboard handling while the sheet is open: Escape closes, and Tab is
    // trapped to cycle through the sheet's focusables so a keyboard user
    // can't accidentally land on the skip-link or page chrome behind the
    // (visually-covering) sheet.
    const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
    document.addEventListener('keydown', (e) => {
      if (!target.classList.contains('is-menu-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const focusables = sheet.querySelectorAll(FOCUSABLE_SELECTOR);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (!sheet.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Auto-close when viewport widens past the mobile breakpoint so the
    // user doesn't end up with a stuck full-screen sheet on resize.
    const mq = window.matchMedia('(min-width: ' + (MOBILE_MAX + 1) + 'px)');
    const handleMQ = (e) => {
      if (e.matches && target.classList.contains('is-menu-open')) close();
    };
    if (mq.addEventListener) mq.addEventListener('change', handleMQ);
    else mq.addListener(handleMQ);
  }

  function mount(target) {
    if (target.dataset.siteNavMounted) return;
    target.dataset.siteNavMounted = '1';
    target.classList.add('site-nav');
    // Disambiguate the outer nav landmark — when the mobile sheet is open,
    // the page has two <nav> elements (outer site-nav + inner sheet menu).
    // The inner one is "Mobile menu"; this one is "Primary".
    if (!target.hasAttribute('aria-label')) {
      target.setAttribute('aria-label', 'Primary');
    }
    target.innerHTML = template({ logoSrc: target.dataset.logoSrc });
    attachScrollState(target);
    attachMobileMenu(target);
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
