/* Renoverse — Demo request form (Tailwind edition).
   Mounts a two-column "Get a demo" form into every [data-demo-form]
   element on the page. Built with Tailwind utility classes — the
   host page must load Tailwind (Play CDN or a build) for the
   utilities to resolve. The component auto-injects the Play CDN
   if it doesn't detect Tailwind on the page, so it stays drop-in.

   Accessibility:
     - Every input has a real <label for>.
     - Required fields use the native `required` attribute.
     - Errors are surfaced with aria-invalid + aria-describedby
       pointing at a polite live-region hint <p>.
     - The success message is role="status" + aria-live="polite".

   Submit handler is a stub — it preventDefaults, swaps the card
   for a thank-you state, and dispatches a `demo-form:submit`
   custom event with `{detail: {values}}` so a host page can wire
   its own backend.

   Optional copy overrides via data attributes on the mount node:
     data-eyebrow   small uppercase eyebrow over the title
     data-title     headline html
     data-lead      sub-headline copy
     data-cta       button label
*/
(function () {
  const MOUNT = '[data-demo-form]';

  const ROLES = [
    'Architect',
    'General Contractor',
    'Interior Designer',
  ];

  const STATES = [
    ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],
    ['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],
    ['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],
    ['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
    ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],
    ['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
    ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],
    ['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],
    ['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
    ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],
    ['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],
    ['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],
    ['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ];

  // intl-tel-input — pulled from CDN. Provides accessible country
  // dropdown (search, flags), as-you-type formatting, and validation
  // against libphonenumber.
  const ITI_VERSION = '24.6.0';
  const ITI_CSS   = `https://cdn.jsdelivr.net/npm/intl-tel-input@${ITI_VERSION}/build/css/intlTelInput.css`;
  const ITI_JS    = `https://cdn.jsdelivr.net/npm/intl-tel-input@${ITI_VERSION}/build/js/intlTelInput.min.js`;
  const ITI_UTILS = `https://cdn.jsdelivr.net/npm/intl-tel-input@${ITI_VERSION}/build/js/utils.js`;

  // Tailwind Play CDN with the official Forms plugin + the Renoverse
  // theme tokens mapped onto Tailwind's color palette. Auto-injected
  // if the host page hasn't already loaded Tailwind.
  const TW_CDN = 'https://cdn.tailwindcss.com?plugins=forms';
  const TW_CONFIG = {
    theme: {
      extend: {
        colors: {
          ink:        '#0B1A2B',
          paper:      '#FAFAF7',
          surface:    '#FFFFFF',
          cream:      '#F2EBD8',
          ice:        '#E5F4F1',
          azure:      '#7FE3CB',
          aqua:       '#5EC9B7',
          teal:       '#2D6F75',
          oxford:     '#5D6FB8',
          'brand-blue': '#5BA7C9',
          line:       'rgba(11,26,43,.14)',
          'line-soft':'rgba(11,26,43,.08)',
          muted:      'rgba(11,26,43,.55)',
        },
        fontFamily: {
          sans: ['Poppins', 'system-ui', 'sans-serif'],
        },
        boxShadow: {
          card: '0 30px 60px -30px rgba(11,26,43,.18), 0 8px 20px -10px rgba(11,26,43,.08)',
        },
      },
    },
  };

  // ---------- Icons ----------
  const CHECK = `<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
  const CHECK_LG = `<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
  const CHEVRON = `<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 text-muted" aria-hidden="true"><path fill-rule="evenodd" d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06z" clip-rule="evenodd"/></svg>`;

  // ---------- Tailwind class building blocks ----------
  // Centralized so input/select look identical and so error styling
  // is a single aria-[invalid=true] modifier per element.
  const INPUT_CLS = [
    'block w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-[15px] text-ink',
    'shadow-sm ring-1 ring-inset ring-line',
    'placeholder:text-ink/35',
    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal',
    'aria-[invalid=true]:ring-rose-500 aria-[invalid=true]:focus:ring-rose-500',
    'transition-shadow',
  ].join(' ');

  const SELECT_CLS = [
    'block w-full rounded-lg border-0 bg-white py-2.5 pl-3.5 pr-9 text-[15px] text-ink',
    'shadow-sm ring-1 ring-inset ring-line',
    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal',
    'aria-[invalid=true]:ring-rose-500 aria-[invalid=true]:focus:ring-rose-500',
    'transition-shadow appearance-none cursor-pointer',
  ].join(' ');

  const LABEL_CLS = 'block text-sm font-medium text-ink';
  const HINT_CLS  = 'mt-1.5 text-xs leading-snug text-muted data-[error=true]:text-rose-600';
  const FIELD_CLS = 'min-w-0';

  // ---------- Loaders ----------
  function ensureFonts() {
    const HREF = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@1,400;1,600;1,700&family=JetBrains+Mono:wght@400;500&display=swap';
    if (document.querySelector(`link[href="${HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = HREF;
    document.head.appendChild(link);
  }

  function ensureTailwind() {
    if (window.tailwind) {
      window.tailwind.config = window.tailwind.config || {};
      // Merge our theme on top of any existing host config.
      const ext = (window.tailwind.config.theme && window.tailwind.config.theme.extend) || {};
      window.tailwind.config.theme = Object.assign({}, window.tailwind.config.theme, {
        extend: Object.assign({}, ext, TW_CONFIG.theme.extend, {
          colors:     Object.assign({}, ext.colors,     TW_CONFIG.theme.extend.colors),
          fontFamily: Object.assign({}, ext.fontFamily, TW_CONFIG.theme.extend.fontFamily),
          boxShadow:  Object.assign({}, ext.boxShadow,  TW_CONFIG.theme.extend.boxShadow),
        }),
      });
      return;
    }
    if (document.querySelector('script[src^="https://cdn.tailwindcss.com"]')) return;
    const cfg = document.createElement('script');
    cfg.textContent = `window.tailwind = window.tailwind || {}; window.tailwind.config = ${JSON.stringify(TW_CONFIG)};`;
    document.head.appendChild(cfg);
    const s = document.createElement('script');
    s.src = TW_CDN;
    document.head.appendChild(s);
  }

  function ensureItiCss() {
    if (document.querySelector(`link[href="${ITI_CSS}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = ITI_CSS;
    document.head.appendChild(link);
  }

  let itiPromise = null;
  function ensureItiJs() {
    if (window.intlTelInput) return Promise.resolve(window.intlTelInput);
    if (itiPromise) return itiPromise;
    itiPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = ITI_JS;
      s.async = true;
      s.onload = () => resolve(window.intlTelInput);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return itiPromise;
  }

  // ---------- Field builders ----------
  function reqMark() {
    return `<span class="text-teal" aria-hidden="true">*</span>`;
  }

  function field({ name, label, type = 'text', required = false, autocomplete, placeholder = '', span = 1, inputmode, pattern, maxLength }) {
    const id = `df-${name}`;
    const hintId = `${id}-hint`;
    const colSpan = span === 2 ? 'sm:col-span-2' : 'sm:col-span-1';
    return `
      <div class="${FIELD_CLS} col-span-2 ${colSpan}" data-label="${label}">
        <label for="${id}" class="${LABEL_CLS}">${label}${required ? ' ' + reqMark() : ''}</label>
        <div class="mt-1.5">
          <input id="${id}" name="${name}" type="${type}"
                 ${required ? 'required aria-required="true"' : ''}
                 aria-invalid="false"
                 aria-describedby="${hintId}"
                 ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
                 ${inputmode ? `inputmode="${inputmode}"` : ''}
                 ${pattern ? `pattern="${pattern}"` : ''}
                 ${maxLength ? `maxlength="${maxLength}"` : ''}
                 ${placeholder ? `placeholder="${placeholder}"` : ''}
                 class="${INPUT_CLS}" />
        </div>
        <p id="${hintId}" class="${HINT_CLS}" hidden aria-live="polite"></p>
      </div>`;
  }

  function selectField({ name, label, options, required = false, span = 1, placeholder = 'Select…' }) {
    const id = `df-${name}`;
    const hintId = `${id}-hint`;
    const colSpan = span === 2 ? 'sm:col-span-2' : 'sm:col-span-1';
    const opts = options.map(o => {
      const [v, l] = Array.isArray(o) ? o : [o, o];
      return `<option value="${v}">${l}</option>`;
    }).join('');
    return `
      <div class="${FIELD_CLS} col-span-2 ${colSpan}" data-label="${label}">
        <label for="${id}" class="${LABEL_CLS}">${label}${required ? ' ' + reqMark() : ''}</label>
        <div class="relative mt-1.5">
          <select id="${id}" name="${name}"
                  ${required ? 'required aria-required="true"' : ''}
                  aria-invalid="false"
                  aria-describedby="${hintId}"
                  class="${SELECT_CLS}">
            <option value="" disabled selected>${placeholder}</option>
            ${opts}
          </select>
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">${CHEVRON}</span>
        </div>
        <p id="${hintId}" class="${HINT_CLS}" hidden aria-live="polite"></p>
      </div>`;
  }

  function emailField() {
    return field({
      name: 'email',
      label: 'Work email',
      type: 'email',
      required: true,
      autocomplete: 'email',
      inputmode: 'email',
      placeholder: 'you@firm.com',
      pattern: '^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$',
      span: 2,
    });
  }

  function phoneField() {
    const id = 'df-phone';
    const hintId = `${id}-hint`;
    return `
      <div class="${FIELD_CLS} col-span-2" data-label="Phone number">
        <label for="${id}" class="${LABEL_CLS}">Phone number</label>
        <div class="mt-1.5">
          <input id="${id}" name="phone" type="tel"
                 aria-invalid="false"
                 aria-describedby="${hintId}"
                 autocomplete="tel"
                 inputmode="tel"
                 maxlength="20"
                 placeholder="(555) 555-1234"
                 class="${INPUT_CLS}" />
        </div>
        <p id="${hintId}" class="${HINT_CLS}" hidden aria-live="polite"></p>
      </div>`;
  }

  // ---------- Markup ----------
  function buildMarkup(opts) {
    const eyebrow = opts.eyebrow || 'Book a demo';
    const title   = opts.title   || 'Explore Renoverse';
    const lead    = opts.lead    || 'Walk through the studio with us. We\'ll tailor the demo to your firm — bring a current set of drawings and we\'ll show you how mark-ups, RFIs, and revisions live on a single sheet.';
    const cta     = opts.cta     || 'Get demo';

    const fields = [
      field({ name: 'firstName', label: 'First name', required: true, autocomplete: 'given-name' }),
      field({ name: 'lastName',  label: 'Last name',  required: true, autocomplete: 'family-name' }),
      emailField(),
      phoneField(),
      selectField({ name: 'role', label: 'Role', required: true, options: ROLES, span: 2 }),
      field({ name: 'firmName',  label: 'Firm name', required: true, autocomplete: 'organization', span: 2 }),
    ].join('');

    const addressFields = [
      field({ name: 'address1', label: 'Address 1', required: true, autocomplete: 'address-line1', span: 2 }),
      field({ name: 'address2', label: 'Address 2', autocomplete: 'address-line2', span: 2 }),
      field({ name: 'city',     label: 'City', required: true, autocomplete: 'address-level2' }),
      selectField({ name: 'state', label: 'State', required: true, options: STATES, placeholder: 'State' }),
      field({
        name: 'zip',
        label: 'Zip',
        required: true,
        autocomplete: 'postal-code',
        inputmode: 'numeric',
        pattern: '^\\d{5}(-\\d{4})?$',
        maxLength: 10,
        placeholder: '94107',
      }),
    ].join('');

    return `
      <div class="demo-form__bg pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div class="demo-form__bg-halftone"></div>
        <div class="demo-form__bg-grain"></div>
        <div class="demo-form__bg-glow demo-form__bg-glow--a"></div>
        <div class="demo-form__bg-glow demo-form__bg-glow--b"></div>
      </div>

      <div class="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <aside class="space-y-5 lg:col-span-5 lg:sticky lg:top-24">
          <p class="uppercase tracking-[0.32em] text-teal" style="font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:clamp(13px,1vw,15px);">${eyebrow}</p>
          <h2 class="text-ink" style="font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:clamp(44px,5.6vw,76px);line-height:1.02;letter-spacing:-.01em;">${title}</h2>
          <p class="max-w-[46ch] text-[clamp(15px,1.1vw,17px)] leading-relaxed text-ink/[0.78]">${lead}</p>
          <ul role="list" class="mt-2 space-y-3.5">
            ${[
              '30-minute walk-through, tailored to your stack.',
              'Bring a real drawing — we\'ll mark it up live.',
              'Pricing &amp; rollout plan in your inbox after.',
            ].map(t => `
              <li class="flex items-center gap-3 text-sm leading-snug text-ink">
                <span class="inline-grid h-6 w-6 flex-none place-items-center rounded-full bg-aqua text-white">${CHECK}</span>
                <span>${t}</span>
              </li>`).join('')}
          </ul>
        </aside>

        <section class="relative lg:col-span-7" aria-label="Demo request form">
          <div class="rounded-3xl bg-white p-6 ring-1 ring-line-soft shadow-card sm:p-10">
            <div data-form-notice
                 role="alert"
                 hidden
                 class="mb-2 flex items-start gap-3 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
              <svg viewBox="0 0 20 20" fill="currentColor" class="mt-0.5 h-5 w-5 flex-none text-rose-500" aria-hidden="true"><path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V7a.75.75 0 01.75-.75zM10 14a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
              <span data-notice-text>Please fix the highlighted fields.</span>
            </div>
            <form class="grid gap-7" novalidate>
              <fieldset class="contents">
                <legend class="sr-only">About you</legend>
                <div class="grid grid-cols-2 gap-x-4 gap-y-4">${fields}</div>
              </fieldset>

              <fieldset class="contents">
                <legend class="text-[11px] font-medium uppercase tracking-[0.32em] text-teal">Firm address</legend>
                <div class="-mt-3 grid grid-cols-2 gap-x-4 gap-y-4">${addressFields}</div>
              </fieldset>

              <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button type="submit"
                        class="inline-flex items-center justify-center border border-aqua bg-aqua px-[22px] py-[9px] text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white hover:text-aqua focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/40"
                        style="font-family:'JetBrains Mono',ui-monospace,monospace;">
                  ${cta}
                </button>
                <p class="ml-auto max-w-[260px] text-right text-xs text-muted">
                  By submitting, you agree to our <a href="#" class="text-teal underline underline-offset-2">privacy policy</a>.
                </p>
              </div>
            </form>

            <div class="grid justify-items-start gap-3 px-1 py-2" role="status" aria-live="polite" data-success hidden>
              <span class="inline-grid h-11 w-11 place-items-center rounded-full bg-aqua text-white">${CHECK_LG}</span>
              <h3 class="text-[clamp(22px,2.2vw,30px)] text-ink" style="font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;line-height:1.1;letter-spacing:-.005em;">Thanks — we'll be in touch.</h3>
              <p class="max-w-[48ch] text-[15px] leading-relaxed text-muted">A Renoverse partner will reach out within one business day to schedule your walk-through.</p>
            </div>
          </div>
        </section>
      </div>`;
  }

  // ---------- Validation ----------
  function setHint(el, msg, isError) {
    const hintId = el.getAttribute('aria-describedby');
    const hint = hintId ? document.getElementById(hintId) : null;
    if (!hint) return;
    if (msg) {
      hint.textContent = msg;
      hint.hidden = false;
      hint.dataset.error = isError ? 'true' : 'false';
    } else {
      hint.textContent = '';
      hint.hidden = true;
      hint.dataset.error = 'false';
    }
  }

  function setInvalid(el, invalid) {
    el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  }

  const FREE_EMAIL = new Set([
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'aol.com', 'live.com', 'me.com', 'proton.me', 'protonmail.com',
  ]);

  function validateEmail(input) {
    if (!input.value) return { msg: input.required ? 'Email is required.' : '', hard: !!input.required };
    if (!input.checkValidity()) return { msg: 'Enter a valid email address.', hard: true };
    const dom = input.value.split('@')[1]?.toLowerCase();
    if (dom && FREE_EMAIL.has(dom)) return { msg: 'Tip: a work email speeds up demo prep.', hard: false };
    return { msg: '', hard: false };
  }

  function attachPhone(root) {
    const input = root.querySelector('#df-phone');
    if (!input) return { validate: () => ({ msg: '', hard: false }), readValue: () => '', readCountry: () => '' };

    ensureItiCss();
    let iti = null;
    ensureItiJs().then((factory) => {
      if (!factory) return;
      iti = factory(input, {
        initialCountry: 'us',
        preferredCountries: ['us', 'ca', 'gb', 'au'],
        separateDialCode: true,
        nationalMode: true,
        formatAsYouType: true,
        loadUtilsOnInit: ITI_UTILS,
      });
      input.addEventListener('countrychange', () => {
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }).catch(() => { /* graceful degrade — plain tel input */ });

    return {
      validate() {
        if (!input.value) return { msg: '', hard: false };
        if (iti && typeof iti.isValidNumber === 'function' && !iti.isValidNumber()) {
          return { msg: 'Enter a valid phone number.', hard: true };
        }
        return { msg: '', hard: false };
      },
      readValue() {
        if (iti && typeof iti.getNumber === 'function') return iti.getNumber() || input.value;
        return input.value;
      },
      readCountry() {
        if (iti && typeof iti.getSelectedCountryData === 'function') {
          const c = iti.getSelectedCountryData();
          return c?.iso2 ? c.iso2.toUpperCase() : '';
        }
        return '';
      },
    };
  }

  // ---------- Wiring ----------
  function fieldLabel(el) {
    const wrap = el.closest('[data-label]');
    return wrap?.dataset.label || el.name || 'This field';
  }

  function defaultMsg(el) {
    if (el.validity.valueMissing)  return `${fieldLabel(el)} is required.`;
    if (el.validity.typeMismatch)  return `Enter a valid ${el.type}.`;
    if (el.validity.patternMismatch) {
      if (el.id === 'df-zip') return 'Enter a 5-digit ZIP (or ZIP+4).';
      return `Enter a valid ${fieldLabel(el).toLowerCase()}.`;
    }
    if (el.validity.tooShort)      return `${fieldLabel(el)} is too short.`;
    if (el.validity.tooLong)       return `${fieldLabel(el)} is too long.`;
    return 'Please check this field.';
  }

  function bindForm(root) {
    const form    = root.querySelector('form');
    const success = root.querySelector('[data-success]');
    const notice  = root.querySelector('[data-form-notice]');
    const noticeText = root.querySelector('[data-notice-text]');
    if (!form) return;

    const phone = attachPhone(root);
    const email = root.querySelector('#df-email');

    function check(el) {
      if (el === email) {
        const { msg, hard } = validateEmail(el);
        setInvalid(el, hard);
        setHint(el, msg, hard);
        return !hard;
      }
      if (el.id === 'df-phone') {
        const { msg, hard } = phone.validate();
        setInvalid(el, hard);
        setHint(el, msg, hard);
        return !hard;
      }
      const ok = el.checkValidity();
      setInvalid(el, !ok);
      setHint(el, ok ? '' : defaultMsg(el), !ok);
      return ok;
    }

    // Block letters at the keystroke layer for numeric-only fields so
    // they never appear (covers normal typing; paste/drop are still
    // sanitized by the input-event filter below).
    const numericish = (allow) => (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return; // arrows, backspace, tab, etc.
      if (!allow.test(e.key)) e.preventDefault();
    };
    const zipEl = root.querySelector('#df-zip');
    const phoneEl = root.querySelector('#df-phone');
    if (zipEl)   zipEl.addEventListener('keydown', numericish(/[\d-]/));
    if (phoneEl) phoneEl.addEventListener('keydown', numericish(/[\d+()\-\s]/));

    form.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('blur', () => check(el));
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') {
          setInvalid(el, false);
          setHint(el, '', false);
        }
        // Live filter: digits + optional dash for ZIP.
        if (el.id === 'df-zip') {
          const cleaned = el.value.replace(/[^\d-]/g, '').slice(0, 10);
          if (cleaned !== el.value) el.value = cleaned;
        }
        // Live filter: digits + phone formatting punctuation only.
        // intl-tel-input writes back its formatted value here too, so we
        // strip anything that isn't a digit or one of `+ ( ) - space`.
        if (el.id === 'df-phone') {
          const cleaned = el.value.replace(/[^\d+()\-\s]/g, '');
          if (cleaned !== el.value) {
            const pos = el.selectionStart;
            el.value = cleaned;
            try { el.setSelectionRange(pos - 1, pos - 1); } catch (_) {}
          }
        }
      });
      el.addEventListener('change', () => {
        if (el.getAttribute('aria-invalid') === 'true') setInvalid(el, false);
      });
    });

    function showNotice(text) {
      if (!notice) return;
      noticeText.textContent = text;
      notice.hidden = false;
    }
    function hideNotice() {
      if (!notice) return;
      notice.hidden = true;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      hideNotice();

      let firstInvalid = null;
      let invalidCount = 0;
      form.querySelectorAll('input, select').forEach(el => {
        const ok = check(el);
        if (!ok) {
          invalidCount += 1;
          if (!firstInvalid) firstInvalid = el;
        }
      });

      if (firstInvalid) {
        showNotice(`Please fix the ${invalidCount === 1 ? 'highlighted field' : `${invalidCount} highlighted fields`} below.`);
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.warn('[demo-form] submit blocked — invalid fields:', invalidCount);
        return;
      }

      const values = Object.fromEntries(new FormData(form).entries());
      values.phone = phone.readValue();
      values.phoneCountry = phone.readCountry();

      root.dispatchEvent(new CustomEvent('demo-form:submit', {
        detail: { values },
        bubbles: true,
      }));
      console.log('[demo-form] submitted', values);

      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function readOpts(target) {
    return {
      eyebrow: target.dataset.eyebrow,
      title:   target.dataset.title,
      lead:    target.dataset.lead,
      cta:     target.dataset.cta,
    };
  }

  function mount(target) {
    if (target.dataset.demoFormMounted) return;
    target.dataset.demoFormMounted = '1';
    target.classList.add('demo-form');
    target.setAttribute('aria-label', target.getAttribute('aria-label') || 'Request a Renoverse demo');
    target.innerHTML = buildMarkup(readOpts(target));
    bindForm(target);
  }

  function init() {
    ensureFonts();
    ensureTailwind();
    document.querySelectorAll(MOUNT).forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
