# Admin/Editability Audit for Recent Public Page Changes

**Date:** 2026-04-29  
**Scope:** Audit of admin editability for recent visual/content changes across public pages

---

## Summary Table by Page

| Page | Admin-Editable Text | Locale-File Text | Hardcoded Text | CSS-Only Visuals | Build Overwrite Risk | Manual Code Edit Required |
|------|-------------------|------------------|----------------|------------------|---------------------|-------------------------|
| **Home** | Hero text (via Firestore `public_hero_*`), intro copy (via `public_rg_editorial_*`) | Hero CTAs, navigation, footer | Hero name markup structure | Hero image crop, intro portrait crop | Hero config rebuild (`hero-config.json`) | Hero name HTML structure |
| **Biography** | Title, paragraphs, intro line, CTAs, portrait (via `biography-data.json` + Firestore `public_rg_biography_*`) | Navigation, footer, CTAs fallback | **Section subtitles** (Profil, Ausbildung, etc.) | Portrait crop, section layout | Biography rebuild (`biography-data.json`) | Subtitle editability, section assignment logic |
| **Repertoire** | Programs, categories, CTAs (via `repertoire-data.json` + Firestore `public_rg_repertoire`) | Navigation, footer, CTAs fallback | - | Card layout, spacing | Repertoire rebuild (`repertoire-data.json`) | - |
| **Media** | Videos, audio, categories (via `media-data.json` + Firestore `public_rg_media`) | Navigation, footer, media labels | - | Grid layout, player styling | Media rebuild (`media-data.json`) | - |
| **Photos** | Photos, categories (via `media-data.json` + Firestore `public_rg_media`) | Navigation, footer, photo labels | - | Grid layout, lightbox | Media rebuild (`media-data.json`) | - |
| **Calendar** | Events, dates, venues, CTAs (via `calendar-data.json` + Firestore `public_rg_perfs`) | Navigation, footer, calendar labels | - | Event card layout, modal styling | Calendar rebuild (`calendar-data.json`) | Private event control logic |
| **Dossier** | Press items, photos, bios, PDFs (via `press-data.json` + Firestore `public_rg_press`, `public_rg_epk_*`) | Navigation, footer, dossier labels | - | Card layout, tab styling | Press rebuild (`press-data.json`) | - |
| **Contact** | Title, subtitle, email, CTAs (via `contact-data.json` + Firestore `public_rg_contact_*`) | Navigation, footer, form labels, direct email label | - | Form padding, spacing, onward band spacing | Contact rebuild (`contact-data.json`) | - |

---

## High-Risk Hardcoded Content

### 1. Biography Section Subtitles (CRITICAL)

**Location:** `v1-assets/js/mp-biography.js:346-356`

```javascript
function bioSectionLabelsForLang(lang) {
  var L = normalizeLangCode(lang) || 'en';
  var map = {
    en: ['Profile', 'Training & artistic development', 'Stage & concert', 'Repertoire & programmes'],
    de: ['Profil', 'Ausbildung & künstlerische Entwicklung', 'Bühne & Konzert', 'Repertoire & Programme'],
    es: ['Perfil', 'Formación y desarrollo artístico', 'Escena y concierto', 'Repertorio y programas'],
    it: ['Profilo', 'Formazione e sviluppo artistico', 'Palcoscenico e concerto', 'Repertorio e programmi'],
    fr: ['Profil', 'Formation et développement artistique', 'Scène et concert', 'Répertoire et programmes']
  };
  return map[L] || map.en;
}
```

**Risk:** 
- Subtitles are hardcoded in JavaScript, not in locale JSON or admin
- Cannot be edited from admin without code changes
- Changes require manual code edit and rebuild

**Impact:** 
- Current visual structure depends on these 4 fixed sections
- If subtitle text needs updating, it requires JS modification

### 2. Biography Section Assignment Logic

**Location:** `v1-assets/js/mp-biography.js:370-396`

The `buildBioSections()` function uses a fixed algorithm to split paragraphs into 4 sections:
- Paragraph 0 → Section 0 (Profile)
- Paragraphs 1-2 → Section 1 (Training)
- Paragraph 3 → Split between Sections 1, 2, 3
- Paragraphs 4+ → Section 3 (Repertoire)

**Risk:**
- Not real content blocks — it's visual splitting logic
- If admin edits biography, the section assignment follows this fixed algorithm
- Cannot control which paragraph goes to which section from admin

### 3. Calendar Private Event Control Logic

**Location:** `v1-assets/js/mp-calendar.js:1190-1220`

The `perfIsPrivateEvent()` function has hardcoded logic checking multiple fields:
- `private`, `isPrivate`
- `visibility`, `publicVisibility`, `public_visibility`
- `privacy`, `calendarVisibility`, `calendar_visibility`
- `status`, `type`
- Text pattern matching in `detail`, `title`

**Risk:**
- No admin control over private event visibility behavior
- Cannot configure "show as placeholder" vs "hide completely" from admin
- Changes to private event logic require code changes

---

## Calendar Private Event Control Diagnosis

### A) Are private events completely hidden from the public Calendar page now?

**No.** Private events are filtered out by the `perfIsPrivateEvent()` function, but there is a complex system for showing them as placeholders with customizable presentation.

### B) Which function or filter hides them?

**Primary function:** `perfIsPrivateEvent(p, lang)` in `mp-calendar.js:1190-1220`

This function checks:
1. Explicit `private` flag
2. `isPrivate` field
3. Multiple visibility fields (`visibility`, `publicVisibility`, `public_visibility`, `privacy`, `calendarVisibility`, `calendar_visibility`)
4. `status` field
5. `type` field (e.g., `houseconcert`, `private`)
6. Text pattern matching in detail/title fields

**Filter application:**
- Upcoming events: filtered during rendering (implicit)
- Past events: explicitly filtered in `normalizePastPublicList()` at line 720: `.filter(function (p) { return !p.private; })`

### C) Can this behavior currently be controlled from admin?

**No.** The private event detection logic is hardcoded in JavaScript. There is no admin UI or configuration option to control:
- Whether private events are hidden or shown as placeholders
- What fields are checked for privacy
- The threshold for "private" detection

### D) Is there currently a distinction between fully public, private-but-visible-as-placeholder, and fully internal?

**Yes, but not admin-controllable.** The system has placeholder display logic (`resolvePublicPrivateEventView()` at line 1263) that can show private events with customizable presentation, but this is controlled by individual event fields like:
- `privatePublicTitleMode` (generic/custom/real)
- `privatePublicTitleEnabled`
- `privatePublicVenueEnabled`
- `privatePublicLocationEnabled`
- `privatePublicMoreInfo`
- `privatePublicTicket`

These fields exist per event but there's no global admin setting to enable/disable this behavior.

### E) Are private events excluded only from print/PDF, or also from the public webpage?

**Both.** Private events are excluded from:
1. Public webpage rendering (via `perfIsPrivateEvent()` filter)
2. Print/PDF generation (same filter applies)

### F) Which event fields currently control this?

| Field | Purpose | Checked By |
|-------|---------|------------|
| `private` | Boolean flag | `perfIsPrivateEvent()` |
| `isPrivate` | Boolean flag | `perfIsPrivateEvent()` |
| `visibility` | String (e.g., "private") | `perfIsPrivateEvent()` |
| `publicVisibility` | String | `perfIsPrivateEvent()` |
| `public_visibility` | String (snake_case variant) | `perfIsPrivateEvent()` |
| `privacy` | String | `perfIsPrivateEvent()` |
| `calendarVisibility` | String | `perfIsPrivateEvent()` |
| `calendar_visibility` | String (snake_case variant) | `perfIsPrivateEvent()` |
| `status` | String (e.g., "hidden", "draft") | `perfIsPrivateEvent()` |
| `type` | String (e.g., "houseconcert", "private") | `perfIsPrivateEvent()` |
| `detail`, `title` | Text pattern matching | `perfIsPrivateEvent()` |

---

## Calendar CTA Label Diagnosis

### A) Are these labels hardcoded?

**No.** CTA labels are determined by the `resolvePerfCtaLabel()` function at line 963.

### B) Are they localized through mp-locales or another i18n file?

**Yes.** The function uses:
- `uiTable(lang)` which pulls from `MP_PERF_UI_EN` locale table in `mp-calendar.js`
- Falls back to `perfGenericTicketInfoLabel()` which has hardcoded language-specific labels

### C) Can I edit the button label per event in admin?

**Yes.** The field `eventLinkLabel` (and language variants `eventLinkLabel_en`, `eventLinkLabel_de`, etc.) is available per event and can be edited in admin.

### D) Can I edit the button label per language in admin?

**Yes.** Language-specific fields exist:
- `eventLinkLabel_en`
- `eventLinkLabel_de`
- `eventLinkLabel_es`
- `eventLinkLabel_it`
- `eventLinkLabel_fr`

### E) What exact fields determine the button label?

**Logic in `resolvePerfCtaLabel()` (line 963-974):**

1. **Custom label:** If `eventLinkLabel` (or language variant) has a value:
   - If it's a generic "Tickets & Info" label → use localized generic
   - Otherwise → use the custom value

2. **Ticket URL exists:** If `eventLink` has a value AND has price info OR URL contains ticket/booking keywords → use "Tickets & Info" (localized)

3. **Fallback:** Use "More info" (localized via `perf.moreInfo`)

**Fields checked:**
- `eventLinkLabel`, `eventLinkLabel_en`, `eventLinkLabel_de`, etc.
- `eventLink`, `eventLink_en`, `eventLink_de`, etc.
- `ticketPrice`, `ticketPrice_en`, etc.

### F) Did the recent changes alter this behavior?

**No.** The CTA label logic was not changed in the recent visual polish work. The CSS-only changes to Contact page and Dossier page did not affect Calendar CTA behavior.

---

## Biography Subtitle/Editability Diagnosis

### A) Are these subtitles hardcoded in HTML?

**No.** They are not in HTML. They are generated dynamically by JavaScript.

### B) Are they in locale JSON?

**No.** They are hardcoded in `mp-biography.js` in the `bioSectionLabelsForLang()` function (line 346-356).

### C) Are they coming from admin/Firestore/public data?

**No.** They are not stored in any data file or database. They are hardcoded JavaScript arrays.

### D) Can I edit them from admin now?

**No.** There is no admin interface to edit these subtitles. Changes require code modification.

### E) Can I edit the text under each subtitle from admin now?

**Yes.** The paragraph content under each subtitle comes from `biography-data.json` (or Firestore `public_rg_biography_*`), which is admin-editable. However, you cannot control which paragraph goes to which section — that's determined by the fixed algorithm in `buildBioSections()`.

### F) Are the subtitles available in EN/DE/ES/IT/FR?

**Yes.** The hardcoded arrays include all 5 languages:
- en: Profile, Training & artistic development, Stage & concert, Repertoire & programmes
- de: Profil, Ausbildung & künstlerische Entwicklung, Bühne & Konzert, Repertoire & Programme
- es: Perfil, Formación y desarrollo artístico, Escena y concierto, Repertorio y programas
- it: Profilo, Formazione e sviluppo artistico, Palcoscenico e concerto, Repertorio e programmi
- fr: Profil, Formation et développement artistique, Scène et concert, Répertoire et programmes

### G) If I edit the biography in admin, will the new section structure survive or be overwritten?

**The section structure will survive, but the paragraph-to-section assignment is fixed.**

The `buildBioSections()` function always applies the same algorithm:
- Paragraph 0 → Section 0
- Paragraphs 1-2 → Section 1
- Paragraph 3 → Split between sections 1, 2, 3
- Paragraphs 4+ → Section 3

If you add/remove paragraphs in admin, the algorithm will reassign them according to this fixed pattern. You cannot control which paragraph goes to which section.

### H) Is the current biography text split into real content blocks, or is it just visually split in code?

**Just visually split in code.** The biography is stored as a simple array of paragraphs in `biography-data.json`. The section structure is created programmatically at runtime by `buildBioSections()`. There are no real "content blocks" in the data — it's just paragraphs with visual section headers added by JavaScript.

---

## Recommended Next Implementation Plan

### Phase 1: Biography Subtitle Editability (Low Risk)

**Smallest safe next step:**

1. Move subtitle labels from hardcoded JS to `mp-locales.json`:
   - Add keys: `bio.section0`, `bio.section1`, `bio.section2`, `bio.section3`
   - Provide EN/DE/ES/IT/FR translations

2. Update `bioSectionLabelsForLang()` to use `mpPick(lang, 'bio.section0', 'default')` instead of hardcoded arrays

3. Benefit: Subtitles become locale-file driven, can be edited without code changes

**Risk:** Low — purely data change, no logic change

### Phase 2: Calendar Private Event Control (Medium Risk)

**Proposed model (not implementing yet):**

Add these fields to event schema:
- `showOnPublicCalendar` (boolean): If false, event is completely hidden from public calendar
- `isPrivate` (boolean): Legacy field, kept for compatibility
- `showPrivatePlaceholder` (boolean): If true and `isPrivate=true`, show as placeholder
- `includeInPublicPrint` (boolean): If false, exclude from print/PDF even if shown on webpage

**Implementation approach:**
1. Add fields to Firestore schema
2. Update `perfIsPrivateEvent()` to check `showOnPublicCalendar` first
3. Update print logic to check `includeInPublicPrint`
4. Update admin UI to expose these controls

**Risk:** Medium — requires schema changes and logic updates

### Phase 3: Biography Content Blocks (High Risk)

**Long-term goal:** Real content blocks with:
- Block title (editable per language)
- Block body (editable per language)
- Language field
- Order field
- Visible true/false

**Implementation approach:**
1. Change biography data structure from `paragraphs: []` to `blocks: [{ title, body, lang, order, visible }]`
2. Update `buildBioSections()` to render blocks directly instead of splitting paragraphs
3. Update admin UI to manage blocks instead of paragraphs
4. Migration script to convert existing paragraph arrays to blocks

**Risk:** High — requires data migration, admin UI changes, and logic updates

---

## Data Architecture Summary

### Public Data Files (Generated by Build Scripts)

| File | Purpose | Admin Source |
|------|---------|--------------|
| `hero-config.json` | Hero image config | Admin hero settings |
| `biography-data.json` | Biography content | Admin biography editor |
| `calendar-data.json` | Calendar events | Admin calendar editor |
| `media-data.json` | Media/photos | Admin media editor |
| `repertoire-data.json` | Repertoire | Admin repertoire editor |
| `press-data.json` | Press/EPK content | Admin press editor |
| `contact-data.json` | Contact form | Admin contact settings |
| `programs-data.json` | Programs | Admin programs editor |
| `mp-locales.json` | UI strings | Locale file (manual) |

### Firestore Public Docs (Optional Overrides)

| Doc | Purpose | Can Override |
|-----|---------|-------------|
| `public_hero_*` | Hero text/image | Hero config |
| `public_rg_editorial_*` | Home intro copy | Hardcoded fallback |
| `public_rg_biography_*` | Biography content | Biography data |
| `public_rg_perfs` | Calendar events | Calendar data |
| `public_rg_past_perfs` | Past events | Calendar data |
| `public_rg_media` | Media/photos | Media data |
| `public_rg_repertoire` | Repertoire | Repertoire data |
| `public_rg_press` | Press items | Press data |
| `public_rg_epk_photos` | EPK photos | Press data |
| `public_rg_epk_bios` | EPK bios | Press data |
| `public_rg_public_pdfs` | PDF downloads | Press data |
| `public_rg_contact_*` | Contact content | Contact data |

---

## Recent Changes Impact Assessment

### Dossier Page Title Correction (Prompt 2)

**Changes made:**
- CSS: Added `.press-page-header h1` to shared page-title system
- JS: Added defensive override for `epk.pageEyebrow` in `mp-shell.js`

**Editability impact:**
- Title content: Still admin-editable via `contact-data.json` + Firestore
- Eyebrow label: Now forced to "Dossier" via JS override (prevents Firestore override)
- **Risk:** If you want to allow admin to change eyebrow label, remove the JS override

### Contact Page Desktop Polish (Prompt 3)

**Changes made:**
- CSS: Reduced form padding, tightened direct email spacing, reduced onward band padding

**Editability impact:**
- No content changes
- All visual, CSS-only
- No admin impact

---

## Conclusion

### Critical Findings

1. **Biography subtitles are hardcoded** — highest priority for making admin-editable
2. **Calendar private event logic is not admin-controllable** — medium priority for adding configuration
3. **Most content is already admin-editable** via data files + Firestore overrides
4. **Recent visual changes were CSS-only** — no content editability impact

### Recommended Action Order

1. **Immediate:** Move biography subtitles to `mp-locales.json` (low risk, high value)
2. **Short-term:** Add admin controls for calendar private event visibility (medium risk)
3. **Long-term:** Implement real content blocks for biography (high risk, requires planning)

### Build/Deploy Notes

- All data files are generated by build scripts from admin exports
- Firestore public docs provide optional runtime overrides
- CSS changes do not require rebuilds
- Content changes require rebuild of respective data file
