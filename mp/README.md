# Multi-page preview (`mp/`)

This directory is a **parallel** rollout path for the v1 visual system and multi-page structure. The live site entrypoint at the repo root (`index.html`) is **not** modified by work in `mp/`.

## Pages

| File | Role |
|------|------|
| `index.html` | Short **Home**: hero (`hero-config.json` + locale strings from `mp-locales.json`; regenerate with `npm run build:mp-home -- <export.json>`), intro, explore, footer |
| `biography.html` | Full biography (long-form v1 `bio_<lang>` via `biography-data.json`; `npm run build:biography -- [export.json]`), portrait + onward links |
| `repertoire.html` | Full v1 repertoire UI (tabs, status filters, sortable tables, Lied groupings; data in `repertoire-data.json`, generated from admin `rg_rep_cards` + optional `rep_en` via `scripts/build-repertoire.js`) |
| `media.html` | Full v1 **videos + photos** (`#videos` … `#photos` …; `media-data.json` via `npm run build:media -- <export.json>`) |
| `calendar.html` | Full v1 performances / calendar (`#performances`: year groups, archive toggle, print, event modal; data in `calendar-data.json`, generated from admin `rg_perfs` + optional `perf_en` via `scripts/build-calendar.js`) |
| `reviews.html` | Press quotes (stub) |
| `press.html` | Full v1 **press quotes** (`#press`) + **EPK** (`#epk`: bio tabs, copy, hi-res cards, PDF buttons; `press-data.json` from `npm run build:press -- <export.json>`; bios in `v1-assets/data/epk-bios.json` via `npm run build:epk-bios -- <export.json>`) |
| `contact.html` | Full v1 **contact** (…; `contact-data.json` via `npm run build:contact -- <export.json>`) |

Shared behavior: `../v1-assets/js/mp-shell.js` (nav, cursor, mobile menu, reveal, scroll). Home-only hero: `../v1-assets/js/mp-hero.js`.

## Layout

- **`mp/`** — HTML pages and `mp-home.css` (Home-only section wrappers and small utilities; v1 tokens only).
- **`v1-assets/css/`** — Shared v1 stylesheet extracted from the live site (`v1-main.css`); do not hand-edit for “design passes” unless intentionally updating the shared v1 token layer.
- **`v1-assets/data/`** — Site data consumed by `mp/` pages (e.g. `hero-config.json`, `mp-locales.json`, `biography-data.json`, `repertoire-data.json`, `calendar-data.json`, `media-data.json`, `press-data.json`, `contact-data.json`).
- **`v1-assets/js/`** — Shared scripts for the multi-page path (`mp-press.js`, `mp-biography.js`, `mp-contact.js`, etc.).
- **`v1-assets/build/`** — Defaults / overrides for **generated** `v1-assets/data/*`: `ui-bundle-defaults.json`, **`mp-home-locale-defaults.json`**, **`biography-defaults.json`**, `mp-locale-overrides.json`, `hero-config-defaults.json`, plus repertoire / calendar / press / media / contact defaults. Scripts: `build-mp-locales.js`, `build-hero-config.js`, `build-mp-home.js`, **`build-biography.js`**, … Optional stubs under `samples/` (e.g. `rg_export.biography-stub.json`).

From a file inside `mp/`, asset references are typically:

- Stylesheet: `../v1-assets/css/v1-main.css`, `mp-home.css`
- Config: `../v1-assets/data/hero-config.json`, `calendar-data.json`, etc.
- Images at repo root (shared with the live site): `../img/…`

**Calendar data:** `calendar-data.json` is generated from admin export keys `rg_perfs` and optional `perf_en`, merged with `v1-assets/build/calendar-perf-defaults-en.json` (EN `perf` block). Regenerate with `node scripts/build-calendar.js <export.json>`. Same event shape as v1. Optional `venuePhoto` triggers `.perf-venue-bg` (paths usually `../img/…` from `mp/`).

**Media data:** `media-data.json` is generated with `npm run build:media -- <export.json>` (`node scripts/build-media.js`). **Required:** `data.rg_vid` (non-empty `videos`, each with `id`, `title`, `tag`); `data.rg_photos` with at least one URL across `s` / `t` / `b` (paths like `img/…` from admin are rewritten to `../img/…` for `mp/`). **Optional:** `data.rg_photo_captions`; **`data.rg_ui_en`** strings `photos.h2`, `photos.sub`, tab labels, `photos.backstageEmpty`, `vid.h2` (otherwise **`v1-assets/build/media-defaults.json`**). Output shape matches v1 / `mp-media.js`: **`vid`** + **`photos`** (same keys as before). Stub: `v1-assets/build/samples/rg_export.media-stub.json`.

**Press / EPK:** `press-data.json` is generated with `npm run build:press -- <export.json>` (`node scripts/build-press.js`), merging admin **`rg_press`** (required: non-empty array, each item needs **source** and **quote**, at least one with `visible !== false`) with optional **`rg_press_meta`**, **`rg_epk_photos`**, **`rg_public_pdfs`**, and the first non-empty **`reviewsIntro`** among **`rg_ui_en`…`rg_ui_fr`**; baseline **`reviewsIntro`** / **`pressMeta`** come from **`v1-assets/build/press-defaults.json`** when absent from the export. Output shape: **`press`**, **`pressMeta`**, **`reviewsIntro`**, **`epkPhotos`**, **`publicPdfs`**. Multilingual **EPK bios** stay in **`v1-assets/data/epk-bios.json`** (`npm run build:epk-bios -- <export.json>` / `data.rg_epk_bios`); optional **`epkBiosOverrides`** in `press-data.json` are not produced by the press build. `mp-press.js` fetches `press-data.json` and `epk-bios.json` at runtime.

**Contact:** `contact-data.json` is generated with `npm run build:contact -- <export.json>` (`node scripts/build-contact.js`). **Required:** `data.contact_en` with non-empty **`title`**, **`sub`**, **`emailBtn`**, and a valid **`email`**; optional **`quote`**. **`webBtn`** may come from the export or **`v1-assets/build/contact-defaults.json`** (v1 still stores it; `mp-contact.js` hides the website button). **`formspreeId`** from export keys **`formspreeId`** or **`rg_formspree_id`** if present, else **`contact-defaults.json`** (live form id). Other `contact_de` … keys are reserved for later mp i18n. Stub: `v1-assets/build/samples/rg_export.contact-stub.json`.

**Biography:** `biography-data.json` is generated with `npm run build:biography -- [export.json]` (`node scripts/build-biography.js`). Merges **`bio_en` … `bio_fr`** from the export into **`v1-assets/build/biography-defaults.json`** (v1-aligned `h2`, `p1`, `p2` plus MP-only chrome: intro line, portrait alt, “Continue” block, CTAs). EN **`p1`/`p2`** are split into **four** paragraphs to match the existing mp layout; other languages use the same split when language-specific anchors match, otherwise **two** paragraphs. **`portraitImage`** is repo-relative for `mp/` (default **`../img/hero-bg.webp`**). Build **fails** if any locale is missing required fields after merge or if EN would not yield four paragraphs.

## Hero configuration

`v1-assets/data/hero-config.json` is generated with **`npm run build:hero-config -- <export.json>`** from **`data.hero_en.bgImage`**, merged with **`v1-assets/build/hero-config-defaults.json`** (crop, focal, `alt`). Paths like `img/hero-bg.webp` are rewritten to **`../img/…`** for `mp/`.

**Home copy (hero text + intro + explore)** lives in **`mp-locales.json`**: layers are `ui-bundle-defaults.json` → **`mp-home-locale-defaults.json`** (EN teaser paragraphs, CTA labels, `hero.nameHtml`, explore copy) → `mp-locale-overrides.json` (partial DE/ES/IT/FR) → export **`rg_ui_<lang>`** → export **`hero_<lang>`** (eyebrow, subtitle, cta1, cta2) and **`bio_<lang>.h2`** → **`home.intro.h2`**. One-shot: **`npm run build:mp-home -- <export.json>`** refreshes hero-config and mp-locales. **EN** build fails if any required Home/Hero key would be empty.

Opening `mp/index.html` via `file://` may block `fetch()` for JSON in some browsers; use a local static server from the repo root if needed.
