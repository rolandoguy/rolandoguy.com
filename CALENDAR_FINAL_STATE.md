# Calendar Final State

## Current calendar layout structure

The public calendar renders each event row as one `.perf-item` with:

- one `.perf-date-box`
- one `.perf-item-stack`
- optional venue background media
- optional `More info` button inside the text stack

Within the date box, the internal order is:

1. `.perf-day`
2. `.perf-month`
3. `.perf-year`
4. `.perf-time`

Desktop and tablet use a structure-driven row layout where the date box and text stack share a vertical centerline. Mobile keeps the same content structure but uses tighter spacing and mobile-only text clamp rules.

## Key CSS and JS files involved

- `calendar.html`
- `v1-assets/js/mp-calendar.js`
- `v1-assets/css/v1-main.css`
- `v1-assets/data/calendar-data.json`

## Important rules

- Date box structure must remain consistent: day, month, year, time.
- The `More info` button must stay inside `.perf-item-stack`, after the main text content.
- Every rendered public row should receive either `perf-item--more` or `perf-item--nomore`.
- Mobile clamp rules must remain:
  - `.perf-item--more .perf-info-detail` = 3 lines
  - `.perf-item--nomore .perf-info-detail` = 5 lines
- Event-type labels must follow the active UI language.
- English must not accidentally fall back to German event-type labels.
- Month names and event-type labels are part of the calendar i18n merge behavior and should be treated as sensitive.

## Do not casually change

- the `.perf-item` / `.perf-date-box` / `.perf-item-stack` row structure
- the date box internal ordering
- the `More info` button placement
- the `perf-item--more` / `perf-item--nomore` class logic
- mobile clamp behavior
- event-type and month-name multilingual merge behavior
- the current desktop/tablet centering logic unless a specific regression is confirmed

## Stability note

The current public calendar behavior is considered closed and stable for modern browsers. Future changes should be small, targeted, and regression-checked across wide desktop, intermediate desktop widths including modern Safari, and mobile.
