# CODEX Operating Rules

## Project summary

This project is a multipage public artist site with pages such as `index.html`, `biography.html`, `repertoire.html`, `media.html`, `calendar.html`, `press.html`, `contact.html`, and `reviews.html`.

Shared runtime behavior lives in `v1-assets/js/mp-shell.js`, page-specific behavior in `v1-assets/js/mp-*.js`, and the primary design system in `v1-assets/css/v1-main.css` plus `mp-home.css` where used.

Public content is largely generated into `v1-assets/data/*.json` by scripts in `scripts/`. The full build runs through `scripts/build-public-safe.js`, requires an admin export JSON, and ends with prerendering. `admin-v2` is the editorial source of truth.

## Sensitive areas

- Build and deploy flow, especially `scripts/build-public-safe.js`, prerender behavior, and required export-path usage
- Multilingual behavior across `en`, `de`, `es`, `it`, and `fr`
- Merge logic between generated JSON, locales, and optional Firestore UI/content overrides
- Firestore read behavior, key usage, and expected document shape
- Calendar rendering and mobile clamp logic tied to `perf-item--more` and `perf-item--nomore`
- Generated filenames and runtime fetch expectations under `v1-assets/data/`
- Premium editorial styling and established visual language

## Operating rules

1. Never redesign the site unless explicitly asked.
2. Never change build or deploy flow unless explicitly asked.
3. Never change multilingual merge logic casually.
4. Prefer small, targeted fixes over broad refactors.
5. Before changing anything non-trivial, state:
   - which files would be touched
   - the risk level
   - what could break
6. If documentation conflicts with code, trust the current code and call out the conflict.
7. Treat `admin-v2` as the editorial source of truth.
8. Preserve the premium editorial visual style.

## Do not break

- `data-i18n` attributes, element ids, and shell hooks relied on by `mp-shell.js` and prerendering
- The current build pipeline contract requiring an admin export for full regeneration
- Generated data filenames under `v1-assets/data/`
- Firestore REST read expectations and document parsing shape
- Multilingual behavior and locale fallback/override behavior
- Calendar card behavior, especially the verified mobile More info clamp rules
- Existing premium editorial presentation and typography-driven feel
