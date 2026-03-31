# Content Architecture & Deployment — rolandoguy.com

Technical audit of content persistence: where content lives, what deploy does, and what is at risk.

---

## 1. Current content architecture

### Storage model (single source of remote data)

- **Firebase Firestore** is the only remote/content store.
  - **Collection:** `rg`
  - **Document ID** = content key (e.g. `hero_en`, `rg_programs`, `rg_press`).
  - **Document shape:** `{ value: "<JSON string>" }`. The app does `JSON.parse(doc.data().value)` and stores the result in an in-memory object `DB`.
- **No other DB/CMS:** No separate database, no locale JSON files on the server, no CMS API. All admin-edited content is written to Firestore via `save(key, val)` from the browser.
- **Deploy does not touch Firestore.** Deploy replaces static assets (e.g. `index.html`, `img/`, `docs/`). Firestore is a separate Google Cloud resource; updating the site files does not run migrations, seeds, or any code that writes to Firestore.

### How content is resolved (read path)

- **On page load:** `loadFromFirestore()` fetches every document in `rg` and sets `DB[doc.id] = JSON.parse(doc.data().value)`. After that, all reads use the in-memory `DB`; there is no automatic re-fetch on deploy.
- **`load(key)`** returns `DB[key]` or `null`. It never writes. So: **if a key exists in Firestore, it is still there after deploy; the new code will read it as long as it still asks for that key.**
- **Fallback chain:** For each content area the code uses a chain like: **Firestore (via `load(key)`) → LANG_CONTENT (in code) → DEFAULTS (in code)**. Stored data is always preferred when present. Code defaults are used only when `load(key)` returns `null`.

### Where each part of the site gets its content

| Area | Source (order) | Firestore keys | In code |
|------|----------------|----------------|---------|
| **Hero** | Stored → LANG_CONTENT → DEFAULTS | `hero_en`, `hero_de`, `hero_es`, `hero_it`, `hero_fr` | `get('hero')` → `load('hero_'+currentLang)` then LANG_CONTENT |
| **Bio** | Stored → LANG_CONTENT | `bio_en`, … | `get('bio')` |
| **Repertoire** (headings) | Stored → LANG_CONTENT | `rep_en`, … | `get('rep')` for h2, intro |
| **Repertoire** (cards) | Stored → DEFAULTS | `rg_rep_cards` (single list, all langs) | `load('rg_rep_cards')` |
| **Programs** (section + list) | See below | `rg_programs`, `rg_programs_en`, `rg_programs_de`, … | `getPrograms()` |
| **Videos** | Stored → DEFAULTS | `rg_vid` | `load('rg_vid')` |
| **Performances** | Stored → DEFAULTS | `rg_perfs` | `load('rg_perfs')` |
| **Performances** (headings) | Stored → LANG_CONTENT | `perf_en`, … | `get('perf')` |
| **Press** | Stored → DEFAULT_PRESS | `rg_press` | `load('rg_press')` |
| **Contact** | Stored → LANG_CONTENT | `contact_en`, … | `get('contact')` |
| **EPK** (bios, CVs, photos) | Stored / in code | `rg_epk_bios`, `rg_epk_cvs`, `rg_epk_photos` | merge with EPK_BIOS etc. |
| **Photos** (gallery) | Stored | `rg_photos`, `rg_photo_captions` | `load('rg_photos')` |
| **Nav / UI labels** | Code only | — | `Ti` (dictionary in code) |

**Programs resolution (current logic):**

- **Section-level (title, subtitle, intro, closingNote):**  
  `rawByLang` (e.g. `rg_programs_de`) → `langPrograms` (LANG_CONTENT for current lang) → `raw` (legacy `rg_programs`) → DEFAULTS.
- **Program list:**  
  `rg_programs_<currentLang>` (if has programs) → for EN only: legacy `rg_programs` → LANG_CONTENT current lang `.programs.items` → for non-EN: EN items fallback → `raw.programs` → DEFAULTS.

So: **Admin content lives in Firestore under the keys above. Local code only adds fallbacks and resolution order; it does not overwrite or delete Firestore data on deploy.**

---

## 2. What is safe

- **Deploy never writes to Firestore.** There is no startup script or build step that calls `save()`. Only user actions in the admin panel trigger `save()`.
- **Stored data is always preferred when present.** Every content path does `load(key)` (or equivalent) first and uses code/LANG_CONTENT/DEFAULTS only when the result is null or missing.
- **No overwrite by “defaults” or “seeds” on deploy.** Defaults and LANG_CONTENT are used only when `load(key)` returns null. They do not replace existing documents.
- **No schema migrations or renames in this project.** Performance, press, programs, etc. still use the same field names (e.g. `id`, `order`, `published`, `title`, `description`, `formations`, `duration`, `idealFor` for programs; `day`, `month`, `title`, `detail`, `status`, `type`, etc. for perfs). Existing admin-entered content remains valid.
- **Programs (recent work):**  
  - EN: If you had custom programs in `rg_programs`, the new code still uses them (legacy fallback for EN).  
  - Other languages: Use `rg_programs_<lang>` if present, else LANG_CONTENT. No code deletes or overwrites `rg_programs` or `rg_programs_<lang>` on deploy.
- **Hero, bio, contact, repertoire headings, perf headings:** Still read `hero_<lang>`, `bio_<lang>`, `contact_<lang>`, `rep_<lang>`, `perf_<lang>`. No key renames.

---

## 3. What is at risk

- **Programs — non‑EN languages:**  
  If you never saved “Programs” in the admin for DE/ES/IT/FR, there are no `rg_programs_de` (etc.) documents. The site will show LANG_CONTENT for those languages (translated programs from code). That is by design.  
  If you *did* save programs for a non‑EN language, that is stored in `rg_programs_<lang>` and is still read first. No risk of it being overwritten by deploy.

- **Videos — reorder in admin:**  
  When you reorder videos in the admin (drag-and-drop), the code saves to `rg_vid_<currentLang>` (e.g. `rg_vid_en`). But the main site reads only `rg_vid` in `getVid()`. So a reorder-only save writes to a key the front-end does not use. The “Save” button in the Vid panel correctly saves to `rg_vid`, so normal edits are fine. Only reorder-without-save can create a “ghost” per-lang key that is not displayed. This is a pre-existing quirk, not introduced by recent changes.

- **Orphaned keys:**  
  If in the future we stop reading a key (e.g. removed `rg_programs` from the fallback), any data only in that key would no longer appear. Currently we still read `rg_programs` for EN program list fallback, so nothing is orphaned by the recent Programs work.

- **Firestore rules / auth:**  
  If Firestore security rules or Firebase config (e.g. domain allowlist) change, admin login or read/write could break. That is outside the scope of “content persistence from code deploy.”

---

## 4. What could break on deploy (without data being deleted)

- **JavaScript errors:** If new code has a bug (e.g. wrong key, missing null check), the page or a section might not render. Firestore data would still be there; the next fix deploy would restore behavior.
- **Key no longer read:** If we removed a `load(key)` or changed the key name in code, that document would be ignored. Current code still uses all keys listed above; no key was removed in the recent Programs/i18n work.
- **Changed resolution order:** If we preferred LANG_CONTENT over stored data for a key, then admin-edited content for that key would be hidden until we fix the order. We did the opposite for Programs (prefer `rawByLang` for section-level), so admin edits are respected.
- **Schema expectations:** If new code expected a new required field (e.g. `programs[].newField`) and did not handle its absence, rendering could break for old stored items. Current code does not require any new fields; it uses the same program/perf/press shapes as before.

Nothing in the current deploy flow deletes or overwrites Firestore documents.

---

## 5. What you should verify before publishing

1. **Firestore keys you care about** (optional check in Firebase Console → Firestore → `rg`):  
   `hero_en`, `bio_en`, `contact_en`, `rep_en`, `perf_en` (and _de, _es, _it, _fr if you use them), `rg_programs`, `rg_programs_en` (and other langs if you saved programs there), `rg_rep_cards`, `rg_vid`, `rg_perfs`, `rg_press`, `rg_epk_bios`, `rg_epk_photos`, `rg_photos`, `rg_photo_captions`.  
   You do not need to change them before deploy; just confirm the ones you edited exist and have the expected structure.

2. **English programs:**  
   If you had custom programs in the admin and only ever saved to the single “Programs” blob, that is stored as `rg_programs`. The new code still uses `rg_programs` for the EN program list when no `rg_programs_en` exists. So EN should still show your edited list after deploy.

3. **Other languages (Programs):**  
   After deploy, switching the site to DE/ES/IT/FR will show either: (a) LANG_CONTENT translated programs, or (b) your admin programs if you had previously saved Programs for that language (stored in `rg_programs_de`, etc.). No data is lost; only the resolution order is defined in code.

4. **One-time check after deploy:**  
   Open the live site, switch languages, open Programs & Collaborations, and confirm section title, program titles, and descriptions match what you expect. If something is wrong, it will be a read-path or fallback-order issue, not data loss.

---

## 6. Exact files and config that define this behavior

- **Single file that contains all content logic and storage usage:**  
  `index.html`

- **Firestore usage (all in index.html):**
  - Init: `const DB = {};`, `fsdb = firebase.firestore();`
  - Load: `loadFromFirestore()` — `fsdb.collection('rg').get()`, then `DB[doc.id] = JSON.parse(doc.data().value)`
  - Read: `load(key)` — returns `DB[key]` or `null`
  - Write: `save(key, val)` — `DB[key] = val` then `fsdb.collection('rg').doc(key).set({ value: JSON.stringify(val) })`

- **Content keys (all used in index.html):**
  - Per-lang (get/save): `hero_<lang>`, `bio_<lang>`, `rep_<lang>`, `contact_<lang>`, `perf_<lang>`, `rg_programs_<lang>`
  - Single keys: `rg_programs`, `rg_rep_cards`, `rg_vid`, `rg_perfs`, `rg_press`, `rg_epk_bios`, `rg_epk_cvs`, `rg_epk_photos`, `rg_photos`, `rg_photo_captions`
  - `get(key)` uses `key + '_' + currentLang` (e.g. `programs_en`) — but programs section does not store under `programs_en`; it uses `rg_programs_en` and LANG_CONTENT for `programs` (from `get('programs')` = LANG_CONTENT only unless you add a doc `programs_en`).

- **No separate config files** for content or DB. Firebase config is inline in `index.html`. There are no locale JSON files or env-based content sources in this project.

- **Deploy:** Whatever you deploy (e.g. upload `index.html` + assets) is the new app. Firestore is unchanged by that act. No build step or server-side code runs against Firestore.

---

**Summary:** Content is either in Firestore (admin-edited) or in code (LANG_CONTENT, DEFAULTS, Ti). Deploy only updates the code and assets; it does not modify or delete Firestore. Existing admin content remains and is still read by the new code. The main thing to verify after deploy is that Programs (and any other recently changed section) still resolve in the order you expect for each language.
