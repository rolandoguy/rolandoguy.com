# Handoff to Codex (or any coding agent)

This file orients an autonomous assistant on **this checkout** of the Rolando Guy public site tooling. Read **`PROJECT_CONTEXT.md`** next, then **`KNOWN_RISKS_AND_GOTCHAS.md`** before changing behavior that touches deploy or Firestore.

## What this repo is

- **Public multipage site (v1 “MP”):** `index.html`, `biography.html`, `repertoire.html`, `media.html`, `calendar.html`, `press.html`, `contact.html`, `reviews.html` — each loads shared chrome via `v1-assets/js/mp-shell.js`, section scripts under `v1-assets/js/mp-*.js`, styles `v1-assets/css/v1-main.css` + `mp-home.css` where linked.
- **Admin:** **`admin-v2.html` / `admin-v2.js` / `admin-v2.css`** is the editorial source of truth for day-to-day content work. `admin.html` remains in the repo as a legacy surface and still participates in auth/bridge behavior for `admin-v2`.
- **Build pipeline:** Node scripts in `scripts/` regenerate `v1-assets/data/*.json` from an **admin export JSON**; `scripts/build-public-safe.js` orchestrates the full chain and fails without `--export` / `RG_ADMIN_EXPORT`. See `package.json` scripts and `scripts/README-prerender-public.md`.

## Firestore (read path on public pages)

- **Project ID (hardcoded):** `rolandoguy-57d63` in `v1-assets/js/mp-shell.js` (REST `firestore.googleapis.com/.../documents/rg/{key}`).
- Module-specific keys are documented in each `mp-*.js` (e.g. calendar: `rg_perfs`, `rg_past_perfs`; press: `rg_press`, etc.).

## Do not assume

- **`CONTENT_ARCHITECTURE_AND_DEPLOY.md`** describes an older **single-file `index.html` SDK** pattern. The **multipage v1** stack uses **REST reads** and **generated JSON**; treat that doc as **partially historical** unless reconciled (see `KNOWN_RISKS_AND_GOTCHAS.md`).
- **`scripts/README-export.md`** refers to **`v2/data/site-en.json`**. In this workspace, **`v2/` is not present** — exporter output may live elsewhere or the folder was never added here. **needs manual confirmation.**

## Legacy compatibility seams still active

- **Admin auth / bridge:** `admin-v2` is the editorial surface, but it still depends on `admin.html` for the auth/bridge flow. Do not assume `admin-v2` is fully standalone.
- **Media fallback:** canonical videos live in `rg_vid`, but admin/public code still falls back to legacy **`rg_vid_en`** when `rg_vid` is empty. Treat `rg_vid_en` as compatibility data, not the preferred write target.
- **Programs fallback:** current per-language programs live in `rg_programs_<lang>`, but EN can still fall back to legacy **`rg_programs`**. Treat that as a compatibility seam when reasoning about “effective public output.”

## Recently verified implementation detail (calendar, mobile)

- **`v1-assets/js/mp-calendar.js`:** each row gets `perf-item--more` or `perf-item--nomore` from the same logic as the **More info** button (`allowModalButton`).
- **`v1-assets/css/v1-main.css`:** under `max-width: 600px` and `480px`, `.perf-item--more .perf-info-detail` uses **3** line clamp; `.perf-item--nomore` uses **5**. Desktop (`min-width: 601px`) card copy is unchanged.

## Deploy hints

- **Netlify-style redirects:** root `_redirects` (www → apex, legacy `/mp/*` paths).
- **Prerender:** `npm run build:prerender-public` mutates listed HTML files per `scripts/README-prerender-public.md`.

## Companion docs in this repo

| File | Purpose |
|------|---------|
| `PROJECT_CONTEXT.md` | Layout, tech stack, data files |
| `EDITORIAL_DECISIONS.md` | Visual/language product choices reflected in code |
| `CHANGELOG_CURSOR_PHASES.md` | What changed (workspace-verified + gaps) |
| `REPO_KEEP_ARCHIVE_DELETE.md` | What to keep vs reconsider |
| `KNOWN_RISKS_AND_GOTCHAS.md` | Pitfalls |
| `CURRENT_STATE_AND_NEXT_STEPS.md` | Suggested follow-ups |
| `handoff/prompts/` | Copy-paste task prompts |
