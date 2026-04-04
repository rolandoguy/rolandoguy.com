# Changelog — Cursor / agent phases (workspace-verified)

This file does **not** claim a full git history (this workspace was **not** a git repo at doc generation time). Entries are either **verified in files** or marked **needs manual confirmation**.

---

## Phase A — Build & prerender pipeline (verified)

**Evidence:** `package.json`, `scripts/build-public-safe.js`, `scripts/README-prerender-public.md`

- `npm run build` runs `build-public-safe.js`, which requires `--export path/to/rg_admin_export.json` or `RG_ADMIN_EXPORT`.
- Chain runs: `build:epk-bios`, `build:mp-locales`, `build:hero-config`, `build:mp-home`, `build:biography`, `build:repertoire`, `build:calendar`, `build:press`, `build:media`, `build:contact`, then `build:prerender-public`.
- Prerender injects English baseline HTML into listed public pages while preserving `data-i18n` and runtime JS behavior.

---

## Phase B — Calendar data & MP module (verified, partial)

**Evidence:** `scripts/build-calendar.js`, `v1-assets/js/mp-calendar.js`, `v1-assets/data/calendar-data.json`

- Calendar JSON is generated from admin export (`rg_perfs`, optional `perf_en` / locale perf blobs per script header).
- Runtime merges Firestore `rg_perfs` / `rg_past_perfs` with bundled data when available.

**needs manual confirmation:** Full history of i18n fixes (e.g. event-type labels, `perfLocales`) mentioned in prior chat summaries — only the **current** `mp-calendar.js` / `build-calendar.js` state is authoritative in repo.

---

## Phase C — Mobile calendar card description UX (verified)

**Evidence:** `v1-assets/js/mp-calendar.js` (lines around `moreRouteClass`, `perf-item--more` / `perf-item--nomore`), `v1-assets/css/v1-main.css` (`@media (max-width: 600px)` and `480px` rules for `.perf-item--more .perf-info-detail` / `.perf-item--nomore .perf-info-detail`)

- **Before (inferred from CSS prior to this change):** all `.perf-item .perf-info-detail` on small screens used **2-line** clamp.
- **After:** rows with **More info** → **3** lines; rows without → **5** lines; logic tied to `allowModalButton` in `rowHtml`.

---

## Phase D — Documentation in repo (this drop)

**Evidence:** presence of `HANDOFF_TO_CODEX.md`, `PROJECT_CONTEXT.md`, `EDITORIAL_DECISIONS.md`, `CHANGELOG_CURSOR_PHASES.md`, `REPO_KEEP_ARCHIVE_DELETE.md`, `KNOWN_RISKS_AND_GOTCHAS.md`, `CURRENT_STATE_AND_NEXT_STEPS.md`, `handoff/prompts/*`

- Adds handoff and prompt templates; no runtime behavior change.

---

## Older work referenced elsewhere

- **`CONTENT_ARCHITECTURE_AND_DEPLOY.md`** — dated internal audit (Firestore collection `rg`, `index.html`-centric admin). **Cross-check** against current `admin.html` / `admin-v2` / multipage `mp-*.js` before relying on file path statements.
