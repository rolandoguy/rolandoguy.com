# Prompt: i18n — mp-locales or UI strings

Use for nav labels, button text, section chrome — **not** for long editorial body copy unless that copy is in locale JSON.

**Context to paste for the agent:**

> Public MP pages load `v1-assets/data/mp-locales.json`, built by `scripts/build-mp-locales.js` from the admin export. Runtime applies Firestore `rg_ui_<lang>` overrides per `v1-assets/js/mp-shell.js`.
>
> **Task:** [add key `…` for languages …; or fix missing translation for `data-i18n="…"` on page X]
>
> **Constraints:**
> - Preserve key naming used by `mp-shell.js` / HTML `data-i18n` attributes.
> - Rebuild `mp-locales.json` via the documented script + export when appropriate.
> - Do not break English fallback behavior.
>
> **Deliver:** files touched; if build required, exact `npm run` command; flag **needs manual confirmation** for anything only verifiable on live Firestore.
