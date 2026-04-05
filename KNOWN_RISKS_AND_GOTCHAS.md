# Known risks & gotchas

## Build / deploy

1. **`npm run build` fails without export path**  
   `scripts/build-public-safe.js` exits with usage text if neither `--export` nor `RG_ADMIN_EXPORT` is set. This is intentional to avoid deploying stale generated JSON.

2. **Prerender vs data drift**  
   `npm run build:public:quick` only runs prerender. If `v1-assets/data/*.json` is old, public content can still drift until a full build runs, even though locale key completeness and selected static-head baseline assertions are now covered by the smoke check.

3. **Calendar script path comment**  
   `scripts/build-calendar.js` header says “mp/calendar.html”; the repo uses **`calendar.html`** at root. Behavior is correct; comment is misleading.

## Architecture documentation drift

4. **`CONTENT_ARCHITECTURE_AND_DEPLOY.md` vs multipage v1**  
   The audit centers on **`index.html`** embedding Firebase SDK and `DB` object. The **public multipage** stack uses **`mp-shell.js`** Firestore **REST** reads and **`v1-assets/data/*.json`**. Both may coexist (e.g. legacy home vs MP pages) — **reconcile before using that doc as sole truth for “where is Firestore read?”**

5. **Exporter README vs workspace**  
   `scripts/README-export.md` describes output to **`v2/data/site-en.json`**. This workspace has **no `v2/` directory** — exporter may not have been run here, or v2 lives elsewhere. **needs manual confirmation.**

## Content / Firestore quirks (from architecture doc — verify in current admin)

6. **Video reorder key mismatch**  
   `CONTENT_ARCHITECTURE_AND_DEPLOY.md` warns: reorder may write `rg_vid_<lang>` while the main read path uses `rg_vid`. Confirm current `admin.html` / `mp-media.js` before changing save logic.

7. **Firestore rules and CORS**  
   Public site uses unauthenticated REST reads to `firestore.googleapis.com` for documented keys. If rules tighten, sections can go empty without JS errors surfacing clearly.

## UI / CSS

8. **Custom cursor + `cursor: none`**  
   Touch devices and accessibility: ensure critical controls remain usable (focus outlines exist for many controls in `v1-main.css`).

9. **Calendar row classes**  
   Every rendered `.perf-item` from `rowHtml` should include **`perf-item--more` or `perf-item--nomore`**. If a third code path renders cards without these classes, mobile clamp rules may not apply (currently only these modifiers set `-webkit-line-clamp` in mobile blocks).

## Repo hygiene

10. **Vendored Node**  
    `node-v20.11.1-darwin-arm64/` increases archive size and confuses CI. Prefer documenting Node 18+ requirement (see `scripts/README-export.md`).

11. **Not a git repo (in this environment)**  
    No `git log` available here — **needs manual confirmation** for branch strategy and what is actually deployed to Netlify (or other host).

## Recently reduced risks

12. **Locale key gaps (reduced)**  
    `mp-locales.json` is currently structurally complete for `de`, `es`, `it`, and `fr` against `en`. Future regressions should now be caught by `scripts/check-public-smoke.js`.

13. **Static head mismatch on key public pages (reduced)**  
    The static base `<head>` on corrected public pages is now aligned with `locales.en`, and selected mismatches are guarded by the smoke check.
