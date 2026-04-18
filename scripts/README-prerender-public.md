# Public HTML Pre-render Layer

This project keeps the current runtime JS/i18n system, but now also supports build-time English static content injection for key public pages.

## Why

- Improve crawlability and AI parser readability from initial HTML.
- Avoid near-empty JS shells for key pages.
- Keep runtime language switching and Firestore/admin enhancements intact.

## Safe build commands

Run from repo root:

```bash
npm run build -- --export path/to/rg_admin_export.json
```

The default build is now a guarded chain:

- `scripts/build-public-safe.js` orchestrates:
  - all `build:*` data generators with the same admin export input
  - `check:public-smoke` after regeneration
  - `build:prerender-public` at the end
  - fail-fast behavior if export path is missing

Equivalent explicit commands:

```bash
npm run build:public -- --export path/to/rg_admin_export.json
# or
RG_ADMIN_EXPORT=path/to/rg_admin_export.json npm run deploy:prepare
```

Prerender-only (advanced/manual use):

```bash
npm run build:public:quick
```

Default build hook:

- `npm run build` now runs `build:public`.
- This prevents "data regenerated but prerender forgotten" and "prerender run on stale data" mistakes.

## Source of truth used by the pre-render step

The script pulls content from the same generated data files already used by runtime pages:

- `v1-assets/data/mp-locales.json` (EN labels/copy keys)
- `v1-assets/data/biography-data.json`
- `v1-assets/data/repertoire-data.json`
- `v1-assets/data/calendar-data.json`
- `v1-assets/data/press-data.json`
- `v1-assets/data/contact-data.json`
- `v1-assets/data/media-data.json`

Important:

- Admin changes do not reach the public site immediately.
- The public site updates only after this sequence: admin export -> rebuild bundled public JSON -> deploy.
- Bundled `v1-assets/data/*.json` files are now the source of truth for the public website.
- Public pages should not be expected to reflect admin edits until that rebuild-and-deploy flow has completed.

## Pages injected

- `index.html`
- `biography.html`
- `repertoire.html`
- `calendar.html`
- `press.html`
- `contact.html`
- `media.html`

## Runtime interaction

- Runtime JS still owns final language rendering (`setLang`, locale switching, Firestore overrides).
- Pre-render only sets meaningful EN baseline HTML.
- `data-i18n`/DOM ids are preserved, so runtime enhancement behavior stays unchanged.

## Recommended deploy flow

1. Export latest admin data to `rg_admin_export.json`.
2. Run:
   - `npm run build -- --export path/to/rg_admin_export.json` (recommended single command)
3. Deploy generated site files.

If you only changed already-generated local data files and intentionally do not need a fresh admin export, use `npm run build:public:quick`. Deploy-safe default remains the full build command above.
