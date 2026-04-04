# Export: `v2/data/site-en.json`

## Legacy scope note

This README documents a **legacy / separate v2 export path**. It is **not part of the active multipage public workflow** for the current site in this workspace.

If you are working on the current public site, the active path is the multipage v1 stack with generated `v1-assets/data/*.json`, `scripts/build-public-safe.js`, and `scripts/prerender-public-html.js`.

Generates the English v2 bundle from **committed** literals in **`index.html`** (the same offline defaults v1 uses when Firestore is empty). **No Firestore** and **no v1 runtime changes**.

## Run (pick one)

**Node.js 18+** (no extra packages), from repo root:

```bash
node scripts/export-site-en.mjs
```

**Python 3.9+** if Node is not installed (needs one dependency):

```bash
python3 -m pip install --user hjson
python3 scripts/export-site-en.py
```

The `.mjs` and `.py` exporters apply the **same mapping**; if you change rules, update **both** files so they stay aligned.

Output: **`v2/data/site-en.json`** (overwrites). Commit when you intend to publish that snapshot.

## What is read from `index.html`

| v2 section | Source |
|------------|--------|
| `repertoire.cards` | `DEFAULTS.rep.cards` (field order normalized to `role`, `opera`, …) |
| `calendar` | `DEFAULTS.perfs` (upcoming vs past using `sortDate` / same idea as v1) |
| `media.featured` / `moreVideos` | `DEFAULTS.vid.videos` (entries with `hidden: true` omitted) |
| `press.quotes` | `DEFAULT_PRESS` (EN quote + production + URL) |
| `press.quotesNote` | `DEFAULT_PRESS_META.en.translatedNote` |
| `press.bios` | `EPK_BIOS.en` (`b50`; `b150` split into v2 chunk array for work titles) |
| CV row in `press.assets` | `EPK_CVS.EN` (`b64` → `../docs/…`, `filename`) |

## Pinned in the exporter (not in those constants)

These stay in **`export-site-en.mjs`** / **`export-site-en.py`** so v2 layout stays stable:

- **Media:** Featured **iframe title**, **composer display** (Francesco Cilea), **context** line, **YouTube channel URL**, **second-line** copy for select “more videos” (`subRest` overrides), **photo list** (paths, alts, captions).
- **Press:** **Materials lede** and non-CV **asset** rows (dossier, artist sheet, photography link).
- **Calendar:** **Past venue** strings for a few rows where v1 `detail`/`venue` need the same formatting as the current v2 page (`PAST_VENUE_BY_ID`).
- **Past archive:** Italic title detection via **`ITALIC_PAST_TITLES`** (today: *Der Vetter aus Dingsda*). Add titles when you add similar archive lines.

## Temporary vs final

- **Final for repo/offline truth:** Anything whose canonical form lives in **`DEFAULTS`**, **`DEFAULT_PRESS`**, **`DEFAULT_PRESS_META`**, **`EPK_BIOS`**, **`EPK_CVS`** inside `index.html`.
- **Temporary / curated until a Firestore/CMS export step exists:** Pinned media copy, photo manifest, some calendar venue formatting, press materials lede and non-CV assets.

## Contract note: `press.quotesNote`

The hand-maintained bundle previously used different wording than **`DEFAULT_PRESS_META.en.translatedNote`**. The export now follows **`index.html`** (“Translated from the original German review.”). Update `DEFAULT_PRESS_META` in `index.html` if that line should change for v2.

## Pipeline status

After you run an exporter and commit **`v2/data/site-en.json`**, v2 pages load that file as the **export-based** content path (still static JSON over HTTP, not Firestore in the browser).
