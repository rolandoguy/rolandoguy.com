# Prompt: Full public build from admin export

Use before deploy when data or prerender must match Firestore export.

**Context to paste for the agent:**

> This repo’s deploy-safe build is `npm run build` → `scripts/build-public-safe.js`. It **requires** `--export path/to/rg_admin_export.json` or env `RG_ADMIN_EXPORT`. It runs all `build:*` scripts then `build:prerender-public`. See `scripts/README-prerender-public.md`.
>
> **Task:** [e.g. Run the build with export at `PATH`; fix any script error; do not commit secrets]
>
> **Constraints:**
> - Do not skip the export argument for a “full” deploy.
> - If only HTML injection changed and data is already fresh, `npm run build:public:quick` may be enough — confirm with owner.
>
> **Deliver:** command used; confirmation that `v1-assets/data/*.json` and prerendered HTML updated; report failures verbatim.
