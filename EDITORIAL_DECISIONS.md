# Editorial & design decisions (code-backed)

This document records **observable** choices in CSS/HTML/JS — not marketing copy approvals. For content storage and deploy safety, see `CONTENT_ARCHITECTURE_AND_DEPLOY.md` (with caveats in `KNOWN_RISKS_AND_GOTCHAS.md`).

## Visual system (`v1-assets/css/v1-main.css` `:root`)

- **Background / surfaces:** `--bg: #0D0D12`, `--surface` / `--surface2` dark violets.
- **Accent:** `--gold: #D4A843`, `--gold-dim`, `--copper` for hover/secondary warmth.
- **Text:** `--text` warm off-white; `--text-dim` and `--text-faint` for hierarchy.
- **Typography:**
  - **Titles / quotes:** `Cormorant Garamond` (`--ff-title`)
  - **Caps / labels / nav:** `Cinzel` (`--ff-caps`)
  - **Body:** `Lato` (`--ff-body`), light weight default on `body`
- **Motion:** `--ease-premium` and `--ease-soft` cubic bezels used for transitions site-wide.
- **Texture:** Subtle noise overlay on `body::before` (low opacity SVG filter).

## Chrome behavior

- **Fixed `site-chrome`:** Comment in CSS states intent: stable Android Chrome when browser UI shows/hides.
- **Custom cursor:** `cursor: none` on `body` with `.cursor` / `.cursor-ring` (reduced-motion rules disable some animations).
- **Language:** Persisted `localStorage` key `mp_site_lang`; initial `html` class `mp-lang-pending` until shell marks ready.

## Calendar / performances (public)

- **Card layout:** Grid/flex hybrid; date column + `.perf-item-stack` for type, title, detail, venue link, optional **More info**.
- **Past / archive:** `.perf-item--archive`, `.perf-item-past`, print-only repertoire block — distinct typographic and contrast rules vs upcoming.
- **Venue imagery:** `.perf-venue-bg` with gradient mask; text shadows on small viewports when photos are present (see `@media (max-width: 700px)` block).

## Mobile-only description clamp (verified)

**Rationale:** Truncation is acceptable when the user can open **More info**; without it, show more lines on-card.

| Class on `.perf-item` | Condition (JS) | `-webkit-line-clamp` (≤600px and ≤480px) |
|----------------------|----------------|------------------------------------------|
| `perf-item--more` | `allowModalButton` true (extended desc, ticket price, `http(s)` link, flyer/modal image; not `modalEnabled === false`) | **3** lines |
| `perf-item--nomore` | otherwise | **5** lines |

Implemented in **`v1-assets/js/mp-calendar.js`** (`moreRouteClass`) and **`v1-assets/css/v1-main.css`** (mobile media queries only; desktop stack unchanged).

## Multilingual UI

- User-facing strings for MP pages are driven by **`mp-locales.json`** + optional Firestore `rg_ui_<lang>` overrides (see `mp-shell.js`).
- Calendar event type labels and month names merge from **`calendar-data.json`** / perf locale fields in **`mp-calendar.js`** — exact merge order is in source (`getPerfMerged`, `rowHtml`, etc.).

## What we are not codifying here

- **Final approval** of wording in any language (owner/editorial).
- **Firestore document contents** (live data).
