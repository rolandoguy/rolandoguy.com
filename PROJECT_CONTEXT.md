# Project context — rolandoguy-site_1

Facts below are taken from **this directory** as of the last doc refresh. If something disagrees with production, **needs manual confirmation**.

## Repository facts

- **Git:** This folder is **not** a git repository in the environment used to generate these docs (**needs manual confirmation** whether your real deploy uses git elsewhere).
- **Package name:** `rolandoguy-site_1` (`package.json`).
- **Runtime dependency:** `pdfmake` (for PDF generation scripts).
- **Node:** A vendored **`node-v20.11.1-darwin-arm64/`** tree exists at repo root (unusual weight; see `REPO_KEEP_ARCHIVE_DELETE.md`).

## Public site structure

| Page | Typical `data-mp-page` / role |
|------|------------------------------|
| `index.html` | Home / hero |
| `biography.html` | Bio |
| `repertoire.html` | Repertoire + embedded Programs section |
| `media.html` | Video + photos |
| `calendar.html` | Performances / agenda |
| `press.html` | Press / EPK-style materials |
| `contact.html` | Contact |
| `reviews.html` | Reviews (verify linkage in nav if unused) |

Shared UI: **`mp-shell.js`** (nav, lang, i18n table load, Firestore UI overrides). Locales: **`v1-assets/data/mp-locales.json`** (built from admin export via `scripts/build-mp-locales.js`).

**Languages:** `en`, `de`, `es`, `it`, `fr` — enforced in shell (`MP_LANG_LIST`) and mirrored in HTML lang buttons.

## Stylesheets

- **`v1-assets/css/v1-main.css`:** primary design system (CSS variables, layout, calendar, modals, admin-adjacent rules embedded for preview).
- **`mp-home.css`:** home-specific additions (linked from multipage templates including `calendar.html`).

## Data generation (`v1-assets/data/`)

Produced by `npm run build:*` scripts; **full deploy build** expects an admin export path:

- `biography-data.json` — `build-biography.js`
- `repertoire-data.json` — `build-repertoire.js`
- `programs-data.json` — public Programs section baseline consumed by `mp-programs.js`
- `calendar-data.json` — `build-calendar.js`
- `media-data.json` — `build-media.js`
- `press-data.json` — `build-press.js`
- `contact-data.json` — `build-contact.js`
- `hero-config.json` — `build-hero-config.js`
- `mp-locales.json` — `build-mp-locales.js`
- `epk-bios.json` — `build-epk-bios.js`

Defaults / merge inputs live under **`v1-assets/build/`** (e.g. `calendar-perf-defaults-en.json`).

## Orchestration

- **`npm run build`** → `scripts/build-public-safe.js` → runs each `build:*` with the same export argument, then **`build:prerender-public`**.
- **`npm run build:public:quick`** → prerender only (no regeneration from export).

## Static assets

- **`img/`** — image assets.
- **`docs/`** — press PDFs (artist sheet, dossier, per locale).
- **`print/`** — printable collateral (e.g. business card HTML/SVG).

## SEO / hosting files

- `robots.txt`, `sitemap.xml`, `site.webmanifest`, favicon set, `_redirects`.

## Admin

- **`admin.html`** — very large single HTML file (inline or bundled behavior; used for content management in the architecture described in `CONTENT_ARCHITECTURE_AND_DEPLOY.md` for the classic stack).
- **`admin-v2.*`** — editorial source of truth for the current multipage public site. It still relies on legacy admin for parts of the auth/bridge flow, but content operations should be understood through `admin-v2`.

## Legacy fallback seams to remember

- **Auth / bridge:** `admin-v2` is editorially canonical, but it still depends on `admin.html` for the working auth/bridge path.
- **Media videos:** canonical data is `rg_vid`; legacy `rg_vid_en` remains as a read fallback seam.
- **Programs:** canonical per-language data is `rg_programs_<lang>`; legacy EN `rg_programs` still exists as a fallback seam.
