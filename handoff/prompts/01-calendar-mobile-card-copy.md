# Prompt: Calendar — mobile card copy / clamp

Use when adjusting how performance **descriptions** behave on small screens.

**Context to paste for the agent:**

> The public calendar is rendered by `v1-assets/js/mp-calendar.js` into `.perf-item` rows. Mobile clamp rules live in `v1-assets/css/v1-main.css` inside `@media (max-width: 600px)` and `@media (max-width: 480px)`. Rows use classes `perf-item--more` or `perf-item--nomore` from the same logic as the **More info** button (`allowModalButton` in `rowHtml`).
>
> **Task:** [describe change — e.g. adjust line counts, add fade mask, fix edge case when detail is empty]
>
> **Constraints:**
> - Do not change desktop layout (`min-width: 601px` stack) unless explicitly requested.
> - Do not change Firestore schema or admin.
> - Do not redesign cards; preserve editorial typography.
>
> **Deliver:** list files changed; summarize old vs new behavior; note any **needs manual confirmation** if you could not verify in browser.
