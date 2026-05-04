# demo-form

Two-column "Get a demo" form. Left column: pitch (eyebrow, title,
lead, three checkmark bullets, sign-off). Right column: a card with
the request form — first/last name, work email, phone (with country
prefix), role, firm name, and firm address (street 1, street 2,
city, state, zip).

Background is a layered halftone-paper treatment (cream→ice
gradient, dot-halftone with a soft mask, faint film grain, two
large radial brand glows). Calmer than the hero — it's a form.

Submit uses HTML5 validation. On a valid submit the card swaps to a
thank-you state and the component dispatches a bubbling
`demo-form:submit` `CustomEvent` whose `detail.values` is the form
values, so the host page can wire its own backend.

## Mount

In the host page `<head>`:

```html
<link rel="stylesheet" href="../shared/components/demo-form/index.css">
```

In the host page `<body>`:

```html
<div data-demo-form></div>
```

Before `</body>`:

```html
<script src="../shared/components/demo-form/index.js"></script>
```

## Optional copy overrides

```html
<div data-demo-form
     data-eyebrow="Book a demo"
     data-title="See Renoverse<br/>on your project."
     data-lead="Walk through the studio with us…"
     data-cta="Get demo"></div>
```

## Hook the submit

```js
document.addEventListener('demo-form:submit', (e) => {
  // e.detail.values = { firstName, lastName, email, phoneCode, phone,
  //                     role, firmName, address1, address2,
  //                     city, state, zip }
  fetch('/api/demo', { method: 'POST', body: JSON.stringify(e.detail.values) });
});
```

## Standalone preview

Open `test.html` directly — it loads `shared/tokens.css` and the
component, mounts an empty `[data-demo-form]`, and logs submits to
the console.

## Root class

`.demo-form` — the script adds this class to the mount element, and
every selector in `index.css` is scoped under it. The component
declares its own scoped `--df-*` tokens that fall back to the
`shared/tokens.css` brand tokens (`--ink`, `--aqua`, `--teal`, etc.)
when the host loads them.
