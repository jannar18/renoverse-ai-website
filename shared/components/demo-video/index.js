/* Renoverse — Demo video.
   Mounts a single demo-video section into every [data-demo-video]
   on the page. Renders an HTML5 <video> with native controls inside
   a card frame on the warm-paper section surface.

   Mount:
     <div data-demo-video
          data-src="assets/demo-cran.mp4"
          data-poster="assets/demo-cran-poster.jpg"
          data-mime="video/mp4"
          data-label="Renoverse product demo"></div>

   The video element gets `controls`, `preload="metadata"`,
   `playsinline`, and the supplied poster. No autoplay — playback is
   user-initiated (the source is a 68-second narrated walkthrough,
   not ambient UI).
*/
(function () {
  const MOUNT = '[data-demo-video]';

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

  function buildMarkup(host) {
    const src = attr(host, 'data-src');
    const poster = attr(host, 'data-poster');
    const mime = attr(host, 'data-mime') || 'video/mp4';
    const label = attr(host, 'data-label') || 'Product demo video';

    const posterAttr = poster ? ` poster="${escape(poster)}"` : '';

    return `
      <section class="demo-video-section">
        <div class="demo-video-section__wrap">
          <div class="demo-video-section__frame">
            <video
              class="demo-video-section__player"
              controls
              preload="metadata"
              playsinline
              aria-label="${escape(label)}"${posterAttr}>
              <source src="${escape(src)}" type="${escape(mime)}" />
            </video>
          </div>
        </div>
      </section>`;
  }

  function mount(host) {
    if (host.dataset.demoVideoMounted === '1') return;
    host.dataset.demoVideoMounted = '1';
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
