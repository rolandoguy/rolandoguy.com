# AGENTS.md

## Project Summary

- This repo is the current **multipage public site** for Rolando Guy.
- Public pages include `index.html`, `biography.html`, `repertoire.html`, `media.html`, `calendar.html`, `press.html`, `contact.html`, and `reviews.html`.
- Shared runtime lives in `v1-assets/js/mp-shell.js`; page behavior lives in `v1-assets/js/mp-*.js`; core styling lives in `v1-assets/css/v1-main.css`.
- Public content is generated into `v1-assets/data/*.json` by scripts in `scripts/`.

## Source Of Truth

- Treat **current code** as the primary truth if docs and code disagree.
- Treat **`admin-v2`** as the editorial source of truth for day-to-day content work.
- Treat `admin.html` as legacy, though it still participates in parts of the auth/bridge flow.
- Treat the active public architecture as the **multipage v1 stack**, not the legacy single-file `index.html` architecture.

## Sensitive Areas

- Multilingual behavior across `en`, `de`, `es`, `it`, and `fr`
- Build/deploy flow, especially `scripts/build-public-safe.js`, prerendering, and required export-path usage
- Firestore REST read behavior and expected document shape
- Generated filenames and fetch paths under `v1-assets/data/`
- Calendar rendering, button/class logic, and mobile clamp behavior
- Premium editorial visual style and typography-driven presentation

## Do Not Break

- `data-i18n` hooks, IDs, and shell/runtime assumptions used by `mp-shell.js` and prerender
- Current build contract: full regeneration requires admin export input
- Multilingual merge/fallback behavior
- Firestore document parsing shape `{ fields.value.stringValue }`
- Calendar `perf-item--more` / `perf-item--nomore` logic
- Existing premium editorial design language

## How To Approach Changes

- Prefer **small, targeted fixes** over refactors.
- **Do not redesign** the site unless explicitly asked.
- **Do not change build/deploy flow** unless explicitly asked.
- **Do not casually change multilingual merge logic**.
- Before any non-trivial change, state:
  - files to modify
  - risk level
  - what could break
  - how the result will be verified
- If docs conflict with code, follow code and call out the conflict clearly.

## Verification Expectations

- Verify the exact page/section changed.
- Check desktop and mobile when relevant.
- Check all affected languages when i18n is involved.
- After calendar changes, explicitly verify the current mobile clamp rules and desktop non-regression.
- After content/build-related changes, verify generated data paths and prerender assumptions still line up.

## Special Notes

- **Multilingual:** `mp-shell.js` enforces `en`, `de`, `es`, `it`, `fr`. Do not introduce casual fallback changes.
- **Build/export:** `npm run build` goes through `scripts/build-public-safe.js` and requires `--export` or `RG_ADMIN_EXPORT`. `build:public:quick` is prerender-only.
- **Calendar:** treat the current public calendar as sensitive. Preserve date-box structure, `More info` placement, event-type i18n behavior, and mobile 3-line/5-line clamp behavior.
