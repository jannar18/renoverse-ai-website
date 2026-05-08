/* Renoverse — site-footer.
   Mounts the canonical Renoverse footer onto every [data-site-footer]
   element. The shader background is a wave GrainGradient (Paper
   @paper-design/shaders-react), resolved via an importmap that each host
   page declares before this script runs. The brand-trio gradient
   (lavender / mint / cream) is the visual closer for the page — the only
   place on the site where all three brand colors appear as a saturated
   block.

   Layout: logo enlarged at bottom-left, the rest stacked at bottom-right.
   `prefers-reduced-motion: reduce` snaps the gradient to a static frame
   (speed: 0). */

import React from "react";
import { createRoot } from "react-dom/client";
import { GrainGradient } from "@paper-design/shaders-react";

const h = React.createElement;

/* Brand SVGs — same paths used in the previous footer so the icon
   silhouettes stay identical. */
const ICON_LINKEDIN =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V24H.22V8.02zM8.34 8.02h4.37v2.18h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-7.55c0-1.8-.03-4.12-2.51-4.12-2.52 0-2.9 1.96-2.9 3.99V24H8.34V8.02z"/>' +
  '</svg>';
const ICON_INSTAGRAM =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
  '<rect x="3" y="3" width="18" height="18" rx="5" ry="5"/>' +
  '<circle cx="12" cy="12" r="4"/>' +
  '<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>' +
  '</svg>';
/* Canonical brand arrow — same path used by the team section and the
   product-features-primary CTA arrow pucks. (ICP carousel was cut in PR #21.) */
const ICON_ARROW =
  '<svg viewBox="0 0 16 16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true">' +
  '<path d="M3 8h9M8 4l4 4-4 4"/>' +
  '</svg>';

function FooterShader() {
  /* Snap the gradient to a static frame for users with
     `prefers-reduced-motion: reduce`. */
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return h(
    "div",
    { className: "site-footer__gradient", "aria-hidden": "true" },
    h(GrainGradient, {
      speed: reduceMotion ? 0 : 1,
      scale: 1,
      rotation: 0,
      offsetX: -0.13,
      offsetY: -0.1,
      softness: 0.7,
      /* Lower intensity = flatter wave (less amplitude). 0.15 was bending
         the wave deep into the lower half of the footer; 0.08 keeps the
         wave shape but evens out the height variance. */
      intensity: 0.08,
      noise: 0.35,
      shape: "wave",
      colors: ["#777EDD", "#5CC1AB", "#D5FFFA"],
      colorBack: "#00000000",
    })
  );
}

function buildCopy() {
  const wrap = document.createElement("div");
  wrap.className = "site-footer__copy";
  wrap.innerHTML = `
    <div class="site-footer__top-row">
      <div class="site-footer__socials">
        <a href="https://www.linkedin.com/company/renoverse-ai/" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON_LINKEDIN}</a>
        <a href="https://www.instagram.com/renoverse.ai" target="_blank" rel="noopener" aria-label="Instagram">${ICON_INSTAGRAM}</a>
      </div>
      <div class="site-footer__newsletter">
        <p class="site-footer__newsletter-label">Join our newsletter for updates</p>
        <form data-newsletter-signup novalidate>
          <label for="newsletter-email" class="sr-only">Email address</label>
          <input id="newsletter-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
          <button type="submit" aria-label="Subscribe">${ICON_ARROW}</button>
        </form>
        <div class="site-footer__nl-status" data-nl-status aria-live="polite"></div>
        <p class="site-footer__nl-fineprint">By subscribing, you agree to our <a href="assets/legal/privacy-policy.pdf" target="_blank" rel="noopener">privacy policy</a> and to receive email updates from us.</p>
      </div>
    </div>
    <div class="site-footer__legal">
      <a href="assets/legal/privacy-policy.pdf" target="_blank" rel="noopener">Privacy Policy</a>
      <a href="assets/legal/cookie-policy.pdf" target="_blank" rel="noopener">Cookie Policy</a>
      <a href="assets/legal/terms-conditions.pdf" target="_blank" rel="noopener">Terms &amp; Conditions</a>
    </div>
    <div class="site-footer__bottom">
      <a class="site-footer__brand" href="index.html" aria-label="Renoverse — Home">
        <img src="assets/logo-mark.png" alt="Renoverse" />
      </a>
      <div class="site-footer__copyright">© 2026 Renoverse AI</div>
    </div>
  `;
  return wrap;
}

/* POSTs to HubSpot's Forms Submissions API. The endpoint is public and
   no-auth — portal/form IDs are the identifiers, the same way HubSpot's
   own embed snippet exposes them. The form is single-field (just email,
   on the Contact object) per the live HubSpot config. */
const HS_NEWSLETTER_URL =
  "https://api.hsforms.com/submissions/v3/integration/submit/46833024/c2ccee79-4704-4c56-91a9-de2fa946ab7c";

function readHutk() {
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return m ? m[1] : undefined;
}

function attachNewsletterHandler(host) {
  const form = host.querySelector("[data-newsletter-signup]");
  if (!form) return;
  const status = host.querySelector("[data-nl-status]");
  const input = form.querySelector('input[type="email"]');

  /* Off-screen honeypot — bots auto-fill every field including hidden
     ones; real users never see or focus this. */
  const hp = document.createElement("input");
  hp.type = "text";
  hp.name = "company_website";
  hp.tabIndex = -1;
  hp.autocomplete = "off";
  hp.setAttribute("aria-hidden", "true");
  hp.style.cssText =
    "position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
  form.appendChild(hp);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (hp.value) {
      /* Drop silently but mimic success so the bot has no signal. */
      if (status) status.textContent = "Thanks — we’ll be in touch.";
      form.reset();
      return;
    }

    const email = (input.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (status) status.textContent = "Please enter a valid email.";
      return;
    }

    if (status) status.textContent = "Subscribing…";

    const body = {
      fields: [{ objectTypeId: "0-1", name: "email", value: email }],
      context: { pageUri: location.href, pageName: document.title },
    };
    const hutk = readHutk();
    if (hutk) body.context.hutk = hutk;

    fetch(HS_NEWSLETTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (res.ok) {
          if (status) status.textContent = "Thanks — we’ll be in touch.";
          form.reset();
          return;
        }
        const txt = await res.text().catch(() => "");
        console.error("[newsletter] HubSpot rejected", res.status, txt);
        if (status) status.textContent = "Something went wrong — try again in a moment.";
      })
      .catch((err) => {
        console.error("[newsletter] network error", err);
        if (status) status.textContent = "Network error — please try again.";
      });
  });
}

function mount(host) {
  if (host.dataset.siteFooterMounted) return;
  host.dataset.siteFooterMounted = "1";

  const shaderRoot = document.createElement("div");
  shaderRoot.className = "site-footer__shaders";
  host.appendChild(shaderRoot);

  /* Paper-grain overlay over the WebGL gradient — same SVG turbulence
     recipe as `.fx-grain--ink` (canonical brand fingerprint), grounding
     the wave in the same tactile cream surface used by the team-section
     paper variant on the homepage + about page. */
  const grain = document.createElement("div");
  grain.className = "fx-grain fx-grain--ink site-footer__grain";
  host.appendChild(grain);

  host.appendChild(buildCopy());

  createRoot(shaderRoot).render(h(FooterShader));

  attachNewsletterHandler(host);
}

function init() {
  document.querySelectorAll("[data-site-footer]").forEach(mount);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
