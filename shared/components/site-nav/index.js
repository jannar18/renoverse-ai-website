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

  function template(opts) {
    const logoSrc = opts.logoSrc || 'assets/logo-black.png';
    return `
      <div class="nav-inner">
        <a class="nav-brand" href="index.html"><img src="${logoSrc}" alt="Renoverse" /></a>
        <div class="nav-right">
          <div class="nav-links">
            <a href="index.html#features">Product</a>
            <div class="dropdown" tabindex="0">
              <span class="dt">Solutions</span>
              <div class="dropdown-menu">
                <a href="index.html#typology">For Architects</a>
              </div>
            </div>
          </div>
          <a class="btn btn--filled" href="demo.html"><span class="tk tl"></span><span class="tk tr"></span><span class="tk br"></span><span class="tk bl"></span>Book a demo</a>
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
      target.classList.toggle('is-dark', detectDarkTone(target));
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
  }

  function mount(target) {
    if (target.dataset.siteNavMounted) return;
    target.dataset.siteNavMounted = '1';
    target.classList.add('site-nav');
    target.innerHTML = template({ logoSrc: target.dataset.logoSrc });
    attachScrollState(target);
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
