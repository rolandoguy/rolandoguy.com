# Prompt: Calendar — build-calendar / event fields

Use when upcoming/past lists or modal fields are wrong **in generated JSON** or merge logic.

**Context to paste for the agent:**

> `scripts/build-calendar.js` writes `v1-assets/data/calendar-data.json` from admin export (`rg_perfs`, optional locale perf blobs — see script header). `v1-assets/js/mp-calendar.js` merges Firestore `rg_perfs` / `rg_past_perfs` at runtime.
>
> **Task:** [e.g. fix event type label for locale DE; fix missing field in export mapping]
>
> **Constraints:**
> - Do not change admin schema in Firestore console from code — code should match existing export shape unless owner approves migration.
> - Keep `stripAdminNote` / admin-only fields behavior intact unless requested.
>
> **Deliver:** identify whether fix belongs in **build script**, **mp-calendar.js**, or **defaults JSON** under `v1-assets/build/`; list files changed.
