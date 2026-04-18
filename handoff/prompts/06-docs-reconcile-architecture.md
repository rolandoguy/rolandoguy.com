# Prompt: Reconcile CONTENT_ARCHITECTURE with multipage v1

Use when onboarding or before large refactors.

**Context to paste for the agent:**

> `CONTENT_ARCHITECTURE_AND_DEPLOY.md` describes Firestore collection `rg` and an `index.html`-centric admin/loader. The repo also has **multipage** templates, **`mp-shell.js`** (Firestore REST, project id `rolandoguy-57d63`), and **build-generated** `v1-assets/data/*.json`.
>
> **Task:** Read both patterns in the repo; produce a short **addendum** or **section list** that explains which doc applies to which surface; mark unknowns as **needs manual confirmation**.
>
> **Constraints:**
> - Do not delete historical facts from `CONTENT_ARCHITECTURE_AND_DEPLOY.md` without owner approval; prefer additive clarification.
> - Cite real file paths only.
>
> **Deliver:** proposed markdown patch or new doc filename; list of contradictions found.
