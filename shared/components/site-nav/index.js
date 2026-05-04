/* Renoverse — site-nav.
   Mounts the shared top navigation into every [data-site-nav] element.
   The component owns its markup so any link/CTA change propagates to
   every page that includes it.

   The host page is expected to live in renoverse/ (or a sibling
   prototype directory that mirrors that structure) so the relative
   asset path "assets/logo-black.png" and the "index.html"/"demo.html"
   targets resolve correctly against the host document URL.

   Optional override on the mount element:
     data-logo-src   path to the brand logo (default: assets/logo-black.png)
*/
(function () {
  const MOUNT = '[data-site-nav]';

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

  function mount(target) {
    if (target.dataset.siteNavMounted) return;
    target.dataset.siteNavMounted = '1';
    target.classList.add('site-nav');
    target.innerHTML = template({ logoSrc: target.dataset.logoSrc });
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
