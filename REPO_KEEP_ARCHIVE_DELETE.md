# Repo: keep, archive, or delete

Actionable guidance for **this checkout**. **needs manual confirmation** where ownership or deploy workflow is unknown.

## Keep (required for public site + build)

- **Public HTML:** `index.html`, `biography.html`, `repertoire.html`, `media.html`, `calendar.html`, `press.html`, `contact.html`, `reviews.html`
- **`v1-assets/`** — `css/`, `js/`, `data/`, `build/`
- **`scripts/`** — all build and export tooling
- **`package.json`**, **`package-lock.json`**
- **`mp-home.css`**
- **`_redirects`**, **`robots.txt`**, **`sitemap.xml`**, **`site.webmanifest`**
- **Favicons / `apple-touch-icon.png`**
- **`img/`** (site imagery)
- **`docs/`** (press PDFs linked from site)
- **`print/`** (print collateral)
- **`CONTENT_ARCHITECTURE_AND_DEPLOY.md`** (historical + operational context; reconcile with v1 MP)
- **Handoff docs added with this batch** (`HANDOFF_TO_CODEX.md`, `PROJECT_CONTEXT.md`, etc.)

## Keep if you use them (confirm before deleting)

- **`admin.html`** — primary admin for Firestore-backed content in many workflows.
- **`admin-v2.html`**, **`admin-v2.js`**, **`admin-v2.css`** — parallel admin; **needs manual confirmation** if obsolete or if both are still in use.
- **`node_modules/`** — required locally for `npm run build`; normally **not** committed in a clean repo (if yours is committed, fix `.gitignore` for deploy hygiene).

## Archive or remove (strong candidates)

| Path | Reason |
|------|--------|
| **`node-v20.11.1-darwin-arm64/`** | Full Node distribution inside project; large, platform-specific; prefer system/nvm Node + documented version in README. |
| **`.DS_Store`** (any) | macOS metadata; should not ship; add to `.gitignore`. |
| **`.pdf-verify/`** | Purpose not documented in these handoff files — **inspect before delete**; may be local QA only. |

## Do not delete without a replacement plan

- **`v1-assets/data/*.json`** — can be regenerated **only** if you have the **admin export JSON** and run the build chain.
- **Firestore** — not in repo; deleting docs in console is irreversible.

## needs manual confirmation

- Whether **`reviews.html`** is still linked from production nav and should stay in sitemap.
- Whether **`v2/`** or **`v2/data/site-en.json`** exists in another branch or repo (see `scripts/README-export.md`).
