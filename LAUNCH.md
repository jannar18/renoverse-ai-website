# Renoverse Launch Plan

A pre-launch checklist + cutover runbook for moving the Renoverse marketing site from its current GitHub Pages staging URL to the production domain.

**Audience:** the founder, plus anyone helping with the cutover. One-time read; archive once cutover is complete.

This file is a snapshot. Anything not yet decided is marked **Decision needed**. Recommendations are starting points — overwrite them with the actual choice once decided.

---

## Where the site is now

A snapshot of the site's current production-readiness as of the latest commit on `main`:

| Aspect | State | Notes |
|---|---|---|
| Repo | `github.com/jannar18/renoverse-ai-website` | GitHub Pages (free hosting). Fine for staging; not the launch URL. |
| Live URL | `https://jannar18.github.io/renoverse-ai-website/` | Will move to a custom domain at cutover. |
| Domain | None registered yet | See decision 1. |
| Hosting | GitHub Pages | Will move to Cloudflare Pages at cutover (see decision 2). |
| Demo + newsletter forms | Wired to HubSpot (PR #41) | HubSpot account ownership / list setup needs confirmation (see decision 4). |
| Analytics | None installed | See decision 3. |
| Privacy / cookie / terms | PDFs in `assets/legal/`, linked from the footer + demo form | Pre-launch ready. |
| `sitemap.xml` + `robots.txt` | At repo root | Pre-launch ready. URLs reference `https://renoverse.ai/` (see decision 1 if domain choice changes). |
| Search Console / GSC | Not set up — requires the live domain | Step in the cutover runbook. |

---

## Decisions to lock before cutover

Each section: **what's needed**, **the recommendation**, **how to do it**. Fill in the actual choice once you've decided.

### 1. Domain — apex vs www, and where the apex points

**Decision needed:**
- Confirm the domain. Per the brand, this is `renoverse.ai`.
- Pick the canonical form: `renoverse.ai` (apex) or `www.renoverse.ai` (www subdomain). The other form should redirect to the canonical one.
- Confirm who owns the domain registration and where it's registered.

**Recommendation:**
- Use **apex** (`renoverse.ai`) as the canonical URL. It's shorter, reads better in marketing copy, and matches modern convention. Set `www.renoverse.ai` to 301-redirect to the apex.
- If `renoverse.ai` isn't registered yet, register it through **Cloudflare Registrar** if possible — at-cost pricing, no upsells, and DNS is automatic since you'll use Cloudflare for everything else. Otherwise Namecheap or Porkbun.

**How to do it:**
1. Register the domain (if not already).
2. Move DNS to Cloudflare (transfer registrar, or change the registrar's NS records to Cloudflare's).
3. The Cloudflare Pages setup in decision 2 will handle the apex + www records automatically.

> If the canonical form changes (e.g. you decide on `www.renoverse.ai` instead of apex), update `sitemap.xml` and `robots.txt` at the repo root before launch — both files currently use `https://renoverse.ai/`.

---

### 2. Hosting — Cloudflare Pages

**Decision needed:**
- Confirm Cloudflare Pages as the host (the F6 plan in `REVISIONS.md` already names this — confirm or revisit).
- Confirm who owns the Cloudflare account that will host this. Should be the company, not a personal account.

**Recommendation:**
- **Cloudflare Pages** is the right choice. Free tier covers a marketing site (unlimited requests, generous bandwidth), pairs cleanly with Cloudflare Registrar + DNS + Web Analytics + WAF, deploys automatically from GitHub on every push to `main`.
- Use the company's Cloudflare account, not a personal one. If no company Cloudflare account exists, create one with a generic ops email (e.g. `ops@renoverse.ai`).

**How to do it:**
1. Sign in to Cloudflare with the company account.
2. **Workers & Pages → Create → Pages → Connect to Git** → authorize GitHub → select the `renoverse-ai-website` repo.
3. Build settings: **none required**. Build command: blank. Build output directory: `/` (or leave blank). This is a static site with no build step.
4. Branch: `main`. Cloudflare will auto-deploy on every push.
5. After the first deploy succeeds at `<project-name>.pages.dev`, smoke-test all four pages there before moving the domain.
6. **Custom domain:** Pages project → Custom domains → add `renoverse.ai` and `www.renoverse.ai`. Cloudflare will configure DNS automatically (since DNS is also on Cloudflare). Wait for SSL certificate to provision (a few minutes).
7. Set the redirect: in Cloudflare Pages → Domains, mark `renoverse.ai` as primary; `www.renoverse.ai` will redirect to it.
8. Once verified, decommission GitHub Pages: repo → Settings → Pages → set Source to "None."

**Optional but recommended:**
- Add a `_headers` file at the repo root for security headers (CSP, X-Frame-Options, Referrer-Policy, Strict-Transport-Security). A freelance dev can write this in 30 minutes.
- Add a `_redirects` file if you want any path-level redirects (e.g. legacy URLs from before launch, if any).

---

### 3. Analytics

**Decision needed:**
- Whether to install analytics at all (recommended: yes — you'll want to see traffic).
- Which provider.

**Recommendation:**
- **Cloudflare Web Analytics** — free, included with Cloudflare Pages, **privacy-respecting (no cookies)**, no GDPR/cookie-consent banner needed, gives you pageviews + referrer + country + device. Sufficient for a Series-A-stage marketing site.
- Skip GA4 for the initial launch. GA4 is free but heavy, sets cookies (triggering consent-banner requirements in the EU), and the dashboard is overbuilt for what you'd actually use it for. You can add it later if a marketing hire wants funnel analytics.
- Skip Plausible/Fathom unless someone on the team specifically wants them — Cloudflare Web Analytics covers the same surface for free.

**How to do it:**
1. Cloudflare dashboard → Analytics → Web Analytics → **Add a site**.
2. Pick "Automatic setup" if the site is already on Cloudflare Pages — no script tag needed.
3. Verify within 24 hours that data is flowing in the Web Analytics dashboard.

---

### 4. HubSpot — account, forms, mailing list

**Status:** Demo form and newsletter form are both wired to HubSpot per PR #41.

**Decision needed:**
- Confirm the HubSpot account is owned by the company, not a personal/throwaway account.
- Confirm the form IDs in the code point to **production forms**, not test forms.
- Confirm the newsletter list exists in HubSpot and the founder has access.
- Confirm GDPR settings on the HubSpot side (consent checkboxes, retention).

**Recommendation:**
- Owner of the HubSpot account should be the founder (or whoever will read the leads). Don't let it sit on a personal email of a contractor or former teammate.
- Test by submitting both forms with a real email and verifying the lead lands in HubSpot.

**How to do it:**
1. Founder logs into HubSpot. Confirms account ownership and access to forms + lists.
2. Submit the demo form on the staging site. Confirm a record appears in HubSpot Contacts within ~30 seconds.
3. Submit the newsletter form. Confirm.
4. Open both form definitions in HubSpot → check GDPR settings → enable consent if targeting EU.

---

### 5. SEO — absolute-URL swap at cutover

**Status:** Each page's `<head>` has four absolute URLs that hardcode the staging URL:
- `<link rel="canonical">`
- `<meta property="og:url">`
- `<meta property="og:image">`
- `<meta name="twitter:image">`

All four currently point at `https://jannar18.github.io/renoverse-ai-website/...`. There's a marker comment in each page's `<head>` calling this out: *"F6 cutover: replace absolute URLs ... with the new domain."*

These have to be absolute (not relative) for SEO crawlers and social-share previewers, and they can't be updated until the production domain is live (otherwise the social-share image URL would 404). That's why this is a cutover step, not a pre-launch step.

**Decision needed:** None — this is execution.

**How to do it (Cowork-friendly prompt):**
> *"In `index.html`, `solutions.html`, `about.html`, and `demo.html`, replace every absolute URL of the form `https://jannar18.github.io/renoverse-ai-website/` with `https://renoverse.ai/` in the four head tags: canonical, og:url, og:image, twitter:image. Show me the diff before committing."*

**Also check:**
- `assets/og-card.html` — the source HTML for the OG card image. If it embeds the staging URL anywhere, update it too.
- `assets/favicon/site.webmanifest` — already uses relative paths (`start_url: "/"`), no change needed.
- After updating, regenerate `assets/og-card.png` if anything visible on the card references the old URL: open `assets/og-card.html` in a browser, screenshot at 1200×630, save over the existing `og-card.png`.

---

## Cutover runbook

Once decisions 1–4 are locked, run through these in order. Plan ~2 hours of focused time.

1. **Backup.** From `main`, create a git tag: `git tag pre-cutover-2026-MM-DD && git push --tags`. This is your "if anything goes wrong, here's the known-good state" anchor.
2. **Update absolute URLs in all four pages' `<head>`** (decision 5).
3. **Stand up the Cloudflare Pages preview deploy** (decision 2). Connect the repo. Confirm `<project>.pages.dev` renders all four pages correctly.
4. **Smoke-test on the preview deploy** — every page, every form, every interactive component. Walk the standard breakpoint set if you have time (1440 / 1024 / 768 / 430). Submit both forms with real test emails; confirm they land in HubSpot.
5. **Add the custom domain** to Cloudflare Pages (decision 2). Wait for SSL provisioning. Confirm `https://renoverse.ai` returns the site.
6. **Confirm `www.renoverse.ai` redirects to the apex.**
7. **Enable Cloudflare Web Analytics** (decision 3). Confirm a beacon fires within ~5 minutes by reloading the live site.
8. **Submit `sitemap.xml` to Google Search Console:**
   - Sign in at [search.google.com/search-console](https://search.google.com/search-console).
   - Add property: domain property `renoverse.ai`.
   - Verify via DNS TXT record (Cloudflare DNS → add the record GSC gives you).
   - Submit `https://renoverse.ai/sitemap.xml`.
   - Repeat for Bing Webmaster Tools if relevant.
9. **Decommission the GitHub Pages source** (Settings → Pages → Source → None) once you've verified Cloudflare is serving traffic correctly.

---

## Post-launch checklist

Things to verify **after** cutover, in the first week:

- [ ] Live site loads at `https://renoverse.ai/` with valid SSL (look for the lock icon).
- [ ] `https://www.renoverse.ai/` redirects to apex.
- [ ] All four pages render correctly: `/`, `/solutions.html`, `/about.html`, `/demo.html`.
- [ ] Demo form submission lands in HubSpot Contacts.
- [ ] Newsletter form submission lands in the HubSpot list.
- [ ] Footer privacy / cookie / terms links open the PDFs in a new tab.
- [ ] Demo form's privacy-policy link opens the privacy PDF in a new tab.
- [ ] Cloudflare Web Analytics shows pageview data within 24 hours.
- [ ] Lighthouse score on all four pages: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- [ ] Open the homepage in an incognito window and check the social-share preview by pasting the URL into Slack / Twitter / LinkedIn previewer ([opengraph.xyz](https://www.opengraph.xyz/)) — confirms the og:image renders correctly.
- [ ] Search Console verification successful; sitemap submitted.
- [ ] No console errors in browser DevTools on any page.

---

## Deferred — pick up post-launch

These are nice-to-haves that don't block launch but should land within the first month or two of being live:

- **Security headers** via `_headers` file in Cloudflare Pages (CSP, HSTS, Referrer-Policy, X-Frame-Options). 30-minute task.
- **Subresource Integrity (SRI)** on CDN scripts (per `notes/CR-RENOVERSE-Claude-Critical-overall-20260509-1806.md`). Deferred from F5.5 because it's not worth the maintenance overhead until launch.
- **404 page.** Currently no custom 404 — Cloudflare Pages serves a generic one. A branded `404.html` is a 30-minute job.
- **Open Graph card refinement.** Current `og-card.png` is fine; consider commissioning a designer for a polished one once you have launch budget.
- **Structured data (JSON-LD).** Add `Organization` + `WebSite` schema in the homepage `<head>`. Helps Google show the site nicely in search results.
- **Page-load performance baseline.** Run Lighthouse / WebPageTest against production and capture a baseline. Re-run quarterly.

---

## Once cutover is done

This file's job is over. Move it to `notes/launch-2026-MM-DD.md` (or wherever you keep historical artifacts) and remove the entry from `README.md`'s "Where to start" table. The post-launch checklist above lives on as a reference for the first month, then it's archive material too.
