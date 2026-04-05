# Current state & next steps

## Current state (verified from workspace files)

- **Multipage public site** with shared **`mp-shell.js`**, per-page **`mp-*.js`**, **`v1-main.css`**, optional **`mp-home.css`**.
- **i18n:** five languages; strings from **`v1-assets/data/mp-locales.json`** + optional Firestore `rg_ui_<lang>`.
- **Locale completeness:** `de`, `es`, `it`, and `fr` are structurally complete against `en` in `mp-locales.json`.
- **Calendar:** **`mp-calendar.js`** renders list from **`calendar-data.json`** with live merge from Firestore; cards expose **More info** when `allowModalButton`; mobile description clamp depends on **`perf-item--more` / `perf-item--nomore`**.
- **Build:** Full pipeline requires **admin export JSON**; ends with **HTML prerender** for SEO/AI parsers.
- **Redirects:** **`_redirects`** configured for apex host and legacy `/mp/*` paths.
- **Parallel admin surfaces:** **`admin.html`** and **`admin-v2.*`** both present.
- **Static head baseline:** corrected public pages now use an `en`-coherent static `<head>` baseline where explicitly asserted by the smoke check.
- **Smoke check:** `scripts/check-public-smoke.js` now covers baseline public structure, locale completeness, and selected static-head coherence assertions.

## Stable invariants (do not break casually)

- **`data-i18n` attributes** and element ids relied on by **`mp-shell.js`** / prerender script.
- **Firestore document shape** `{ fields.value.stringValue }` as JSON string parsed by clients.
- **Generated data filenames** under `v1-assets/data/` expected by runtime fetch URLs.

## Suggested next steps (prioritize with owner)

1. **Reconcile documentation:** Update or supersede **`CONTENT_ARCHITECTURE_AND_DEPLOY.md`** with a **v1 multipage + REST + build** section, or add a clear “legacy vs current” banner. **needs manual confirmation** on desired single source of truth.
2. **Admin consolidation:** Decide whether **`admin-v2`** replaces **`admin.html`** or document when to use which.
3. **Repo cleanup:** Remove or gitignore **`node-v20.11.1-darwin-arm64/`**, **`.DS_Store`**, and confirm whether **`node_modules`** should be committed.
4. **v2 export path:** If **`v2/data/site-en.json`** is still used, add **`v2/`** to repo or fix **`README-export.md`** to match reality.
5. **Tests:** `package.json` **`test`** runs the public smoke check. If stronger coverage is needed, extend it incrementally (for example with additional structural assertions) instead of replacing it with a large framework by default.
6. **Accessibility audit:** Custom cursor, reduced motion, modal focus — optional pass for WCAG goals.

## Immediate verification after any calendar change

- Narrow viewport (≤600px): cards **with** More info show **3** lines of detail; **without** show **5**.
- Desktop width: no unintended clamp on `.perf-info-detail` from those mobile rules.
