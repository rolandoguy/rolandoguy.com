# Prompt: CSS — small editorial / layout tweak (v1-main)

Use for typography, spacing, breakpoints — **not** full redesigns.

**Context to paste for the agent:**

> Global styles: `v1-assets/css/v1-main.css`. Design tokens are in `:root` (gold palette, Cormorant/Cinzel/Lato, easing). Page-specific extras: `mp-home.css`.
>
> **Task:** [e.g. adjust `.perf-header` spacing at 768px; fix contrast on `.perf-badge-past`]
>
> **Constraints:**
> - Prefer minimal diffs; match existing variable usage (`var(--gold)`, etc.).
> - Respect `prefers-reduced-motion` where animations exist.
> - State which breakpoints you touched; avoid regressions on calendar print styles (`.print-only`).
>
> **Deliver:** selectors changed; before/after in one sentence; screenshot **needs manual confirmation** if not run in browser here.
