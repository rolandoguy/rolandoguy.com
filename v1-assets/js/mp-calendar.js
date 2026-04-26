/**
 * Public-safe calendar runtime for mp/calendar.html.
 *
 * This module reads the bundled public payload from /v1-assets/data/calendar-data.json
 * and may layer in explicit public-safe live Firestore docs only.
 *
 * Do not reintroduce Firestore/localStorage admin fallbacks here. Internal/admin
 * event records must be sanitized at build-time before they ever reach public JS.
 */
(function () {
  'use strict';

  var MP_CAL = null;
  var pastPublicExpanded = false;
  var currentLang = 'en';
  var MP_PAST_PERFS = [];
  var LIVE_PUBLIC_PERFS = null;
  var LIVE_PUBLIC_PAST_PERFS = null;
  var LIVE_PERF_HEADER_DOCS = {};
  var titleChoiceLogged = false;
  var modalLocaleChoiceLogged = false;
  var lastEventModalFocus = null;

  function getFocusable(root) {
    if (!root) return [];
    return Array.prototype.slice.call(
      root.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) {
      return !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true';
    });
  }
  var supportingLocaleChoiceLogged = false;
  function normalizeLangCode(v) {
    var s = String(v || '').trim().toLowerCase();
    return /^(en|de|es|it|fr)$/.test(s) ? s : '';
  }
  function resolveActiveLang(reason) {
    var fromState = normalizeLangCode(currentLang) || 'en';
    var fromDoc = normalizeLangCode(document && document.documentElement ? document.documentElement.lang : '');
    var fromShell = (typeof window.getMpSiteLang === 'function') ? normalizeLangCode(window.getMpSiteLang()) : '';
    var next = fromShell || fromDoc || fromState || 'en';
    if (next !== currentLang) currentLang = next;
    console.log('[Calendar] Active language sync', {
      reason: reason || 'unknown',
      currentLang: currentLang,
      documentLang: fromDoc || '(empty)',
      shellLang: fromShell || '(empty)'
    });
    return currentLang;
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function localeTagForMpLang(lang) {
    var map = { en: 'en-US', de: 'de-DE', es: 'es-ES', it: 'it-IT', fr: 'fr-FR' };
    var k = normalizeLangCode(lang) || 'en';
    return map[k] || 'en-US';
  }
  function fetchPublicCalendarDoc(key) {
    if (typeof window.fetchMpPublicFirestoreDoc !== 'function') return Promise.resolve(null);
    return window.fetchMpPublicFirestoreDoc(key);
  }
  function ensureLivePerfHeader(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var key = 'perf_' + L;
    if (Object.prototype.hasOwnProperty.call(LIVE_PERF_HEADER_DOCS, key)) {
      return Promise.resolve(LIVE_PERF_HEADER_DOCS[key]);
    }
    return fetchPublicCalendarDoc('public_' + key)
      .then(function (doc) {
        var best = doc && doc.data && typeof doc.data === 'object' ? doc.data : null;
        LIVE_PERF_HEADER_DOCS[key] = best;
        return best;
      })
      .catch(function () {
        LIVE_PERF_HEADER_DOCS[key] = null;
        return null;
      });
  }
  function loadLiveCalendarLists() {
    return Promise.all([
      fetchPublicCalendarDoc('public_rg_perfs'),
      fetchPublicCalendarDoc('public_rg_past_perfs')
    ]).then(function (pair) {
      var livePerfs = pair[0] && Array.isArray(pair[0].data) ? normalizeRgPerfsList(pair[0].data) : null;
      var livePast = pair[1] && Array.isArray(pair[1].data) ? normalizePastPublicList(pair[1].data) : null;
      var mergedPerfs = livePerfs && MP_CAL && Array.isArray(MP_CAL.perfs)
        ? mergeLivePerfsWithBundledFallback(livePerfs, MP_CAL.perfs)
        : livePerfs;
      LIVE_PUBLIC_PERFS = mergedPerfs;
      LIVE_PUBLIC_PAST_PERFS = livePast;
      if (MP_CAL && mergedPerfs) MP_CAL.perfs = mergedPerfs;
      if (livePast) MP_PAST_PERFS = livePast;
      return { perfs: mergedPerfs, pastPerfs: livePast };
    }).catch(function () {
      LIVE_PUBLIC_PERFS = null;
      LIVE_PUBLIC_PAST_PERFS = null;
      return { perfs: null, pastPerfs: null };
    });
  }

  function mpPick(lang, key, fb) {
    var p = window.pickMpLocaleString;
    if (p) {
      var v = p(lang, key);
      if (v != null && String(v).trim() !== '') return v;
    }
    return fb;
  }

  function mpUiTable(lang, defaults) {
    var t = {};
    for (var k in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, k)) t[k] = mpPick(lang, k, defaults[k]);
    }
    return t;
  }

  var PAST_PERF_CATEGORY_ORDER = ['stage', 'concert', 'collaboration', 'private'];
  var PAST_PERF_VALID = (function () {
    var s = {};
    PAST_PERF_CATEGORY_ORDER.forEach(function (k) {
      s[k] = 1;
    });
    return s;
  })();

  var MP_CAL_UI_EN = {
    'perf.maps': 'Map / Route',
    'perf.pastStamp': 'Past',
    'perf.pastDivider': 'Past Performances',
    'perf.calendarEmpty': 'Upcoming dates to be announced soon.',
    'perf.emptyUpcoming': 'Upcoming dates to be announced soon.',
    'perf.moreInfo': 'Details',
    'perf.pastShow': 'View past performances',
    'perf.pastHide': '\u2212 Hide Past Performances',
    'perf.pastDividerSelected': 'Selected Past Performances',
    'perf.repertoireLabel': 'Repertoire',
    'perf.pastCat.stage': 'Stage / Operetta',
    'perf.pastCat.concert': 'Concerts & Recitals',
    'perf.pastCat.collaboration': 'Collaborations',
    'perf.pastCat.private': 'Selected Private Engagements',
    'perf.printAgenda': 'Print schedule',
    'perf.printSubtitle': 'Calendar',
    'perf.printHeadline': 'Calendar',
    'perf.printTagline': 'Selected engagements and concerts',
    'perf.printDocTitle': 'Rolando Guy — Calendar',
    'perf.printTitle': 'Rolando Guy',
    'perf.moreInfoPrint': 'Details',
    'perf.ticketsInfo': 'Tickets & Info',
    'perf.privateBadge': 'Invitation only',
    'perf.privateEventType': 'Private event',
    'perf.yearTba': 'TBA',
    'ui.featured': 'Featured'
  };
  var PERF_PRIVATE_UI_TEXT = {
    en: { badge: 'Invitation only', detail: 'Private event - not open to the public' },
    de: { badge: 'Nur auf Einladung', detail: 'Private Veranstaltung - nicht öffentlich zugänglich' },
    es: { badge: 'Solo por invitación', detail: 'Evento privado - no abierto al público' },
    it: { badge: 'Solo su invito', detail: 'Evento privato - non aperto al pubblico' },
    fr: { badge: 'Sur invitation', detail: 'Événement privé - non ouvert au public' }
  };
  var PERF_PRIVATE_DEFAULT_BG_URL = '/img/hero-bg.webp';

  function uiTable(lang) {
    var L = lang || currentLang || 'en';
    return mpUiTable(L, MP_CAL_UI_EN);
  }

  function formatSectionTitleIfAmpersand(html, i18nKey) {
    var s = String(html || '');
    if (i18nKey === 'programs.sectionTag') return s;
    if (!s || /class=["']title-amp-stack["']/.test(s)) return s;
    var splitIdx = s.indexOf('&amp;');
    var ampLen = 5;
    if (splitIdx === -1) {
      var m = s.match(/&(?!amp;|#?[0-9a-z]+;)/i);
      if (!m || m.index == null) return s;
      splitIdx = m.index;
      ampLen = 1;
    }
    var left = s.slice(0, splitIdx);
    var right = s.slice(splitIdx + ampLen);
    left = left.replace(/<br\s*\/?>(\s*)/gi, ' ').replace(/&nbsp;/gi, ' ').trim();
    right = right.replace(/^(\s|<br\s*\/?>|&nbsp;)+/i, '').trim();
    var leftText = left.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    var esc = function (t) {
      return String(t)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };
    return (
      '<span class="title-amp-stack"><span class="title-line1">' +
      esc(leftText) +
      '</span><span class="title-line2"><span class="title-amp">&amp;</span> ' +
      right +
      '</span></span>'
    );
  }

  function getPerfMerged() {
    var lang = currentLang || 'en';
    var liveHeader = LIVE_PERF_HEADER_DOCS['perf_' + lang];
    var base =
      MP_CAL && MP_CAL.perf && typeof MP_CAL.perf === 'object'
        ? MP_CAL.perf
        : {};
    var enFallback = {
      eventTypes: {
        opera: 'Opera',
        concert: 'Concert',
        recital: 'Recital',
        show: 'Show',
        gala: 'Gala',
        collaboration: 'Collaboration',
        houseconcert: 'House Concert',
        tango: 'Tango Night',
        other: 'Event',
        operetta: 'Operetta'
      }
    };
    var out = {};
    var k;
    for (k in enFallback) {
      if (Object.prototype.hasOwnProperty.call(enFallback, k)) out[k] = enFallback[k];
    }
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    }
    var hadLocH2 = false;
    var hadLocIntro = false;
    /* Apply perfLocales for every UI language (including en). Primary MP_CAL.perf can be authoring-locale-specific; labels must follow currentLang. */
    if (
      MP_CAL &&
      MP_CAL.perfLocales &&
      typeof MP_CAL.perfLocales[lang] === 'object' &&
      MP_CAL.perfLocales[lang]
    ) {
      var pl = MP_CAL.perfLocales[lang];
      if (pl.h2 != null && String(pl.h2).trim() !== '') {
        out.h2 = String(pl.h2);
        hadLocH2 = true;
      }
      if (pl.intro != null && String(pl.intro).trim() !== '') {
        out.intro = String(pl.intro);
        hadLocIntro = true;
      }
      if (pl.monthNames && typeof pl.monthNames === 'object') {
        out.monthNames = Object.assign({}, out.monthNames && typeof out.monthNames === 'object' ? out.monthNames : {}, pl.monthNames);
      }
      if (pl.eventTypes && typeof pl.eventTypes === 'object') {
        out.eventTypes = out.eventTypes && typeof out.eventTypes === 'object' ? out.eventTypes : {};
        for (var ek in pl.eventTypes) {
          if (Object.prototype.hasOwnProperty.call(pl.eventTypes, ek)) {
            out.eventTypes[ek] = pl.eventTypes[ek];
          }
        }
      }
    }
    /* Live sync / bad export: primary perf.eventTypes may match German pack while UI is EN — restore English type labels. */
    if (lang === 'en') {
      var hasEnPack = !!(MP_CAL && MP_CAL.perfLocales && MP_CAL.perfLocales.en);
      var deTypes = MP_CAL && MP_CAL.perfLocales && MP_CAL.perfLocales.de && MP_CAL.perfLocales.de.eventTypes;
      var curTypes = out.eventTypes;
      if (!hasEnPack && deTypes && curTypes && typeof curTypes === 'object') {
        var pCon = String(curTypes.concert != null ? curTypes.concert : '').trim();
        var dCon = String(deTypes.concert != null ? deTypes.concert : '').trim();
        if (pCon && dCon && pCon === dCon) {
          out.eventTypes = Object.assign({}, enFallback.eventTypes);
          var baseEt = base.eventTypes;
          if (baseEt && typeof baseEt === 'object') {
            for (var xk in baseEt) {
              if (
                Object.prototype.hasOwnProperty.call(baseEt, xk) &&
                !Object.prototype.hasOwnProperty.call(enFallback.eventTypes, xk)
              ) {
                out.eventTypes[xk] = baseEt[xk];
              }
            }
          }
        }
      }
    }
    if (!hadLocH2) {
      var ph2 = mpPick(lang, 'perf.pageH2', '');
      if (ph2 != null && String(ph2).trim() !== '') out.h2 = ph2;
    }
    if (!hadLocIntro) {
      var pint = mpPick(lang, 'perf.pageIntro', '');
      if (pint != null && String(pint).trim() !== '') out.intro = pint;
    }
    if (liveHeader && typeof liveHeader === 'object') {
      if (liveHeader.h2 != null && String(liveHeader.h2).trim() !== '') out.h2 = String(liveHeader.h2).trim();
      if (liveHeader.intro != null && String(liveHeader.intro).trim() !== '') out.intro = String(liveHeader.intro).trim();
    }
    return out;
  }

  function getPerfs() {
    if (Array.isArray(LIVE_PUBLIC_PERFS)) return LIVE_PUBLIC_PERFS;
    return MP_CAL && Array.isArray(MP_CAL.perfs) ? MP_CAL.perfs : [];
  }
  function normalizedEditorialStatus(v) {
    return String(v || '').trim().toLowerCase();
  }
  function mergeLivePerfsWithBundledFallback(livePerfs, bundledPerfs) {
    var fallbackById = {};
    (bundledPerfs || []).forEach(function (item) {
      if (item && item.id != null) fallbackById[String(item.id)] = item;
    });
    return (livePerfs || []).map(function (live) {
      if (!live || live.id == null) return live;
      var fallback = fallbackById[String(live.id)];
      if (!fallback) return live;
      var out = Object.assign({}, live);
      Object.keys(fallback).forEach(function (key) {
        var liveValue = out[key];
        var fallbackValue = fallback[key];
        var liveBlank = liveValue == null || (typeof liveValue === 'string' && liveValue.trim() === '');
        var fallbackHasValue = fallbackValue != null && !(typeof fallbackValue === 'string' && fallbackValue.trim() === '');
        if (liveBlank && fallbackHasValue) out[key] = fallbackValue;
      });
      return out;
    });
  }
  function isTruthyFlag(v) {
    if (v === true) return true;
    var s = String(v == null ? '' : v).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'on';
  }
  function normalizeFeaturedContexts(raw, defaults) {
    var src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    var base = defaults && typeof defaults === 'object' && !Array.isArray(defaults) ? defaults : {};
    return {
      media: typeof src.media === 'boolean' ? src.media : !!base.media,
      homepage: typeof src.homepage === 'boolean' ? src.homepage : !!base.homepage,
      calendar: typeof src.calendar === 'boolean' ? src.calendar : !!base.calendar
    };
  }
  function perfFeaturedVisual(item) {
    if (item && typeof item.featured_visual === 'boolean') return item.featured_visual;
    return !!(item && item.featured);
  }
  function perfFeaturedLayout(item) {
    if (item && typeof item.featured_layout === 'boolean') return item.featured_layout;
    return !!(item && item.featured);
  }
  function normalizeRgPerfsItem(raw, idx) {
    var o = raw && typeof raw === 'object' ? raw : {};
    function firstNonEmpty(keys) {
      for (var i = 0; i < keys.length; i++) {
        var value = o[keys[i]];
        if (value != null && String(value).trim() !== '') return String(value).trim();
      }
      return '';
    }
    var title = String(o.title || o.name || '').trim();
    var detail = String(o.detail || o.description || '').trim();
    var venue = String(o.venue || o.place || '').trim();
    var city = String(o.city || '').trim();
    var status = String(o.status || '').trim().toLowerCase();
    var editorialStatus = normalizedEditorialStatus(o.editorialStatus);
    var sortDate = String(o.sortDate || o.date || '').trim();
    var day = String(o.day || '').trim();
    var month = String(o.month || '').trim();
    var time = String(o.time || '').trim();
    if (!day || !month) {
      var parsed = sortDate ? new Date(sortDate) : null;
      if (parsed && !isNaN(parsed.getTime())) {
        if (!day) day = String(parsed.getDate());
        if (!month) month = parsed.toLocaleString('en', { month: 'long' });
      }
    }
    var featuredVisual = typeof o.featured_visual === 'boolean' ? o.featured_visual : !!o.featured;
    var featuredLayout = typeof o.featured_layout === 'boolean' ? o.featured_layout : !!o.featured;
    var homepagePriority = Number(o.homepage_priority);
    var featuredContexts = normalizeFeaturedContexts(o.featured_contexts, {
      media: false,
      homepage: featuredVisual,
      calendar: featuredVisual
    });
    var out = {
      id: o.id != null ? o.id : ('perf-' + (idx + 1)),
      title: title,
      detail: detail,
      venue: venue,
      city: city,
      address: firstNonEmpty(['address', 'venueAddress', 'modalAddress', 'streetAddress']),
      mapsUrl: firstNonEmpty(['mapsUrl', 'mapUrl', 'mapsLink', 'modalMapsLink', 'locationUrl', 'directionsUrl']),
      day: day,
      month: month,
      time: time,
      sortDate: sortDate,
      status: status || 'upcoming',
      editorialStatus: editorialStatus,
      featured_visual: featuredVisual,
      featured_layout: featuredLayout,
      featured: featuredVisual,
      featured_contexts: featuredContexts,
      homepage_priority: Number.isFinite(homepagePriority) && homepagePriority >= 0 ? Math.floor(homepagePriority) : null,
      type: String(o.type || 'concert').trim().toLowerCase() || 'concert',
      venuePhoto: String(o.venuePhoto || o.image || '').trim(),
      venuePhotoFocus: String(o.venuePhotoFocus || o.imageFocus || '').trim(),
      venueOpacity: o.venueOpacity,
      ticketPrice: firstNonEmpty(['ticketPrice', 'priceInfo', 'modalPrice', 'modalTicketPrice', 'price', 'ticketInfo']),
      eventLink: String(o.eventLink || o.link || '').trim(),
      eventLinkLabel: String(o.eventLinkLabel || o.linkText || '').trim(),
      extDesc: firstNonEmpty(['extDesc', 'modalText', 'description', 'longDescription', 'modalLongDesc']),
      modalImg: String(o.modalImg || '').trim(),
      modalImgHide: isTruthyFlag(o.modalImgHide),
      moreInfoDisplayMode: String(o.moreInfoDisplayMode || '').trim(),
      moreInfoTemplate: String(o.moreInfoTemplate || '').trim(),
      moreInfoTitle: String(o.moreInfoTitle || '').trim(),
      moreInfoSubtitle: String(o.moreInfoSubtitle || '').trim(),
      moreInfoArtists: String(o.moreInfoArtists || '').trim(),
      moreInfoAddress: String(o.moreInfoAddress || '').trim(),
      moreInfoDescription: String(o.moreInfoDescription || '').trim(),
      moreInfoExtra: String(o.moreInfoExtra || '').trim(),
      moreInfoImage1: String(o.moreInfoImage1 || '').trim(),
      moreInfoImage1Focus: String(o.moreInfoImage1Focus || '').trim(),
      moreInfoImage2: String(o.moreInfoImage2 || '').trim(),
      moreInfoImage2Focus: String(o.moreInfoImage2Focus || '').trim(),
      moreInfoImage3: String(o.moreInfoImage3 || '').trim(),
      moreInfoImage3Focus: String(o.moreInfoImage3Focus || '').trim(),
      moreInfoImage4: String(o.moreInfoImage4 || '').trim(),
      moreInfoImage4Focus: String(o.moreInfoImage4Focus || '').trim(),
      moreInfoImage5: String(o.moreInfoImage5 || '').trim(),
      moreInfoImage5Focus: String(o.moreInfoImage5Focus || '').trim(),
      hidePrivateBadge: isTruthyFlag(o.hidePrivateBadge),
      hidePrivateDetailLine: isTruthyFlag(o.hidePrivateDetailLine),
      modalEnabled:
        (o.modalEnabled === true || o.modalEnabled === false)
          ? o.modalEnabled
          : (String(o.modalEnabled).trim() === 'true' ? true : (String(o.modalEnabled).trim() === 'false' ? false : null)),
      flyerImg: String(o.flyerImg || '').trim(),
      privateBadgeText: o.privateBadgeText,
      privateDetailText: o.privateDetailText,
      title_en: o.title_en,
      title_de: o.title_de,
      title_es: o.title_es,
      title_it: o.title_it,
      title_fr: o.title_fr,
      venue_en: o.venue_en,
      venue_de: o.venue_de,
      venue_es: o.venue_es,
      venue_it: o.venue_it,
      venue_fr: o.venue_fr,
      city_en: o.city_en,
      city_de: o.city_de,
      city_es: o.city_es,
      city_it: o.city_it,
      city_fr: o.city_fr,
      address_en: firstNonEmpty(['address_en', 'venueAddress_en', 'modalAddress_en', 'streetAddress_en']),
      address_de: firstNonEmpty(['address_de', 'venueAddress_de', 'modalAddress_de', 'streetAddress_de']),
      address_es: firstNonEmpty(['address_es', 'venueAddress_es', 'modalAddress_es', 'streetAddress_es']),
      address_it: firstNonEmpty(['address_it', 'venueAddress_it', 'modalAddress_it', 'streetAddress_it']),
      address_fr: firstNonEmpty(['address_fr', 'venueAddress_fr', 'modalAddress_fr', 'streetAddress_fr']),
      time_en: o.time_en,
      time_de: o.time_de,
      time_es: o.time_es,
      time_it: o.time_it,
      time_fr: o.time_fr,
      month_en: o.month_en,
      month_de: o.month_de,
      month_es: o.month_es,
      month_it: o.month_it,
      month_fr: o.month_fr,
      detail_en: o.detail_en,
      detail_de: o.detail_de,
      detail_es: o.detail_es,
      detail_it: o.detail_it,
      detail_fr: o.detail_fr,
      extDesc_en: firstNonEmpty(['extDesc_en', 'modalText_en', 'description_en', 'longDescription_en', 'modalLongDesc_en']),
      extDesc_de: firstNonEmpty(['extDesc_de', 'modalText_de', 'description_de', 'longDescription_de', 'modalLongDesc_de']),
      extDesc_es: firstNonEmpty(['extDesc_es', 'modalText_es', 'description_es', 'longDescription_es', 'modalLongDesc_es']),
      extDesc_it: firstNonEmpty(['extDesc_it', 'modalText_it', 'description_it', 'longDescription_it', 'modalLongDesc_it']),
      extDesc_fr: firstNonEmpty(['extDesc_fr', 'modalText_fr', 'description_fr', 'longDescription_fr', 'modalLongDesc_fr']),
      privateBadgeText_en: o.privateBadgeText_en,
      privateBadgeText_de: o.privateBadgeText_de,
      privateBadgeText_es: o.privateBadgeText_es,
      privateBadgeText_it: o.privateBadgeText_it,
      privateBadgeText_fr: o.privateBadgeText_fr,
      privateDetailText_en: o.privateDetailText_en,
      privateDetailText_de: o.privateDetailText_de,
      privateDetailText_es: o.privateDetailText_es,
      privateDetailText_it: o.privateDetailText_it,
      privateDetailText_fr: o.privateDetailText_fr,
      eventLink_en: o.eventLink_en,
      eventLink_de: o.eventLink_de,
      eventLink_es: o.eventLink_es,
      eventLink_it: o.eventLink_it,
      eventLink_fr: o.eventLink_fr,
      eventLinkLabel_en: o.eventLinkLabel_en,
      eventLinkLabel_de: o.eventLinkLabel_de,
      eventLinkLabel_es: o.eventLinkLabel_es,
      eventLinkLabel_it: o.eventLinkLabel_it,
      eventLinkLabel_fr: o.eventLinkLabel_fr
    };
    if (Object.prototype.hasOwnProperty.call(o, 'private')) out.private = isTruthyFlag(o.private);
    return out;
  }
  function normalizeRgPerfsList(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function (item, idx) { return normalizeRgPerfsItem(item, idx); });
  }
  function shouldRenderPublicEvent(item, idx) {
    var es = normalizedEditorialStatus(item.editorialStatus);
    var st = String(item.status || '').trim().toLowerCase();
    var title = String((item && item.title) || '').trim() || ('#' + (idx + 1));
    var allowedPublicEditorial = { published: 1, public: 1, live: 1, ready: 1, reviewed: 1, translated: 1 };
    var excludedEditorial = { hidden: 1, draft: 1, needs_translation: 1, 'needs translation': 1 };
    var excludedStatus = { hidden: 1, draft: 1 };
    var include = true;
    var reason = 'included';

    if (excludedStatus[st]) {
      include = false;
      reason = 'status=' + st;
    }
    if (include && excludedEditorial[es]) {
      include = false;
      reason = 'editorialStatus=' + es;
    }
    // If editorialStatus is present, allow several publish-like values used by workflows.
    if (include && es && !allowedPublicEditorial[es]) {
      include = false;
      reason = 'editorialStatus not public-like: ' + es;
    }

    if (!String(item.title || '').trim()) console.warn('[Calendar] Event missing title', idx, item);
    if (!String(item.day || '').trim() && !String(item.sortDate || '').trim()) console.warn('[Calendar] Event missing date/day fields', idx, item);

    if (!include) {
      console.warn('[Calendar] Excluded event', {
        idx: idx,
        title: title,
        status: st || '(empty)',
        editorialStatus: es || '(empty)',
        reason: reason
      });
      return false;
    }

    console.log('[Calendar] Included event', {
      idx: idx,
      title: title,
      status: st || '(empty)',
      editorialStatus: es || '(empty)'
    });
    return true;
  }
  function parseIsoDateMaybe(s) {
    var raw = String(s || '').trim();
    if (!raw) return null;
    var d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
    return null;
  }
  function normalizePastPublicItem(raw, idx) {
    var o = raw && typeof raw === 'object' ? raw : {};
    return {
      id: String(o.id || ('past-' + (idx + 1))),
      date: String(o.date || '').trim(),
      time: String(o.time || '').trim(),
      title: String(o.title || '').trim(),
      place: String(o.place || '').trim(),
      city: String(o.city || '').trim(),
      address: String(o.address || '').trim(),
      description: String(o.description || '').trim(),
      linkText: String(o.linkText || '').trim(),
      link: String(o.link || '').trim(),
      image: String(o.image || '').trim(),
      status: 'past',
      private: !!o.private
    };
  }
  function normalizePastPublicList(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function (item, idx) {
      return normalizePastPublicItem(item, idx);
    });
  }
  function isGoodPastTimeLabel(raw) {
    var s = String(raw || '').trim();
    if (!s) return false;
    var m = s.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (!m) return false;
    var mins = Number(m[2]);
    if (!Number.isFinite(mins)) return false;
    return mins % 5 === 0;
  }
  function validPastPublicItem(item, idx) {
    if (!item || typeof item !== 'object') {
      console.warn('[Past Performances] Skipping non-object item at index', idx);
      return false;
    }
    var dateRaw = String(item.date || '').trim();
    if (!dateRaw) {
      console.warn('[Past Performances] Skipping item with missing date at index', idx);
      return false;
    }
    var d = parseIsoDateMaybe(dateRaw);
    if (!d) {
      console.warn('[Past Performances] Skipping item with invalid date at index', idx, dateRaw);
      return false;
    }
    return true;
  }
  function loadPastPerfs() {
    MP_PAST_PERFS = Array.isArray(LIVE_PUBLIC_PAST_PERFS)
      ? normalizePastPublicList(LIVE_PUBLIC_PAST_PERFS)
      : normalizePastPublicList(MP_CAL && MP_CAL.pastPerfs);
    return Promise.resolve(MP_PAST_PERFS);
  }
  function renderPastPerformancesPublic() {
    var section = document.getElementById('pastPerformancesSection');
    var list = document.getElementById('pastPerfList');
    var wrap = document.getElementById('pastPerfListWrap');
    var toggleBtn = document.getElementById('pastPerfCollapseBtn');
    var divider = document.getElementById('pastPerfDivider');
    if (!section || !list || !wrap || !toggleBtn) return;
    var t = uiTable(currentLang);
    var mapsWord = t['perf.maps'] || 'Maps';
    if (divider) divider.textContent = t['perf.pastDividerSelected'] || ((currentLang === 'en') ? 'Selected Past Performances' : (t['perf.pastDivider'] || 'Past Performances'));
    var items = normalizePastPublicList(MP_PAST_PERFS)
      .filter(function (p, idx) { return validPastPublicItem(p, idx); })
      .filter(function (p) { return !p.private; })
      .sort(function (a, b) {
        var da = parseIsoDateMaybe(a.date);
        var db = parseIsoDateMaybe(b.date);
        var ta = da ? da.getTime() : 0;
        var tb = db ? db.getTime() : 0;
        return tb - ta;
      });
    if (!items.length) {
      section.style.display = 'none';
      list.innerHTML = '';
      wrap.style.maxHeight = '0px';
      wrap.style.opacity = '0';
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = t['perf.pastShow'] || 'View past performances';
      return;
    }
    section.style.display = '';
    var html = '';
    items.forEach(function (p, i) {
      var d = parseIsoDateMaybe(p.date);
      var day = d ? String(d.getDate()) : '';
      var month = d
        ? d.toLocaleString(localeTagForMpLang(currentLang), { month: 'short' }).toUpperCase()
        : '';
      var year = d ? String(d.getFullYear()) : '';
      var showTime = isGoodPastTimeLabel(p.time);
      var when = day || month
        ? '<div class="perf-date-box"><div class="perf-day">' +
          escHtml(day) +
          '</div><div class="perf-month">' +
          escHtml(month) +
          '</div><div class="perf-year">' +
          (year ? escHtml(year) : '\u00a0') +
          '</div>' +
          (showTime ? '<div class="perf-time">' + escHtml(p.time) + '</div>' : '') +
          '</div>'
        : '';
      var venueCity = (p.place || p.city)
        ? '<a href="https://maps.google.com/?q=' + encodeURIComponent((p.address || p.place || '') + (p.city ? ' ' + p.city : '')) + '" target="_blank" rel="noopener" class="perf-venue-link"><span class="perf-venue-emoji">📍 </span>' + escHtml(p.place || '') + (p.city ? ' · ' + escHtml(p.city) : '') + ' <span class="perf-maps-hint">→ ' + escHtml(mapsWord) + '</span></a>'
        : '';
      var link = (p.link && /^https?:\/\//i.test(p.link))
        ? '<a href="' + escHtml(p.link) + '" target="_blank" rel="noopener" class="perf-venue-link">' + escHtml(p.linkText || (t['perf.moreInfo'] || 'More Info')) + '</a>'
        : '';
      html += '<div class="perf-item reveal perf-item-past' + (i > 0 ? ' rd' + ((i % 4) + 1) : '') + '">';
      if (p.image) {
        html += '<div class="perf-venue-bg" style="opacity:.45;background-image:url(&quot;' + escHtml(p.image) + '&quot;)"></div>';
      }
      html +=
        when +
        '<div class="perf-item-stack"><div class="perf-badge perf-badge-past">' +
        (t['perf.pastStamp'] || 'Past') +
        '</div><div class="perf-info-title">' +
        escHtml(p.title) +
        '</div>';
      if (p.description) html += '<div class="perf-info-detail past-desc">' + escHtml(p.description) + '</div>';
      html += venueCity;
      if (link) html += '<div class="perf-info-detail">' + link + '</div>';
      html += '</div></div>';
    });
    list.innerHTML = html;
    if (pastPublicExpanded) {
      toggleBtn.textContent = t['perf.pastHide'] || '\u2212 Hide Past Performances';
      toggleBtn.setAttribute('aria-expanded', 'true');
      wrap.style.maxHeight = wrap.scrollHeight + 'px';
      wrap.style.opacity = '1';
    } else {
      toggleBtn.textContent = t['perf.pastShow'] || 'View past performances';
      toggleBtn.setAttribute('aria-expanded', 'false');
      wrap.style.maxHeight = '0px';
      wrap.style.opacity = '0';
    }
  }

  function inferPastCategoryFromType(type) {
    var t = String(type || '').toLowerCase();
    if (t === 'collaboration') return 'collaboration';
    if (t === 'houseconcert') return 'private';
    if (t === 'concert' || t === 'recital') return 'concert';
    return 'stage';
  }

  function normalizePastPerfCategory(p) {
    if (!p) return 'stage';
    var c = p.category;
    if (c && PAST_PERF_VALID[c]) return c;
    return inferPastCategoryFromType(p.type);
  }

  function translateMonth(monthStr) {
    if (!monthStr) return '';
    var mn = getPerfMerged().monthNames || {};
    var result = String(monthStr || '');
    var aliases = {
      January: ['January', 'Jan'],
      February: ['February', 'Feb'],
      March: ['March', 'Mar'],
      April: ['April', 'Apr'],
      May: ['May'],
      June: ['June', 'Jun'],
      July: ['July', 'Jul'],
      August: ['August', 'Aug'],
      September: ['September', 'Sep', 'Sept'],
      October: ['October', 'Oct'],
      November: ['November', 'Nov'],
      December: ['December', 'Dec'],
      Spring: ['Spring'],
      Summer: ['Summer'],
      Autumn: ['Autumn', 'Fall'],
      Winter: ['Winter']
    };
    Object.keys(aliases).forEach(function (eng) {
      var localized = mn[eng];
      if (!localized) return;
      aliases[eng].forEach(function (variant) {
        result = result.replace(new RegExp('\\b' + variant + '\\b', 'gi'), localized);
      });
    });
    return result;
  }

  /** Split "May 2026" / "Mai 2026" into separate card lines after translateMonth (data stays one string). */
  function splitMonthLineAndYear(translatedMonthStr) {
    var s = String(translatedMonthStr || '').trim();
    if (!s) return { month: '', year: '' };
    var m = s.match(/^(.+?)\s+(\d{4})\s*$/);
    if (m) return { month: m[1].trim(), year: m[2] };
    return { month: s, year: '' };
  }

  /* Public event text resolves localized values first, then shared/admin base
   * values, then EN values. Older payloads may only have shared modal text,
   * so non-EN pages must not hide the modal body just because extDesc_<lang>
   * is empty.
   */
  function perfLocaleFieldResolve(p, base, lang) {
    if (!p) return { value: '', source: '' };
    var L = normalizeLangCode(lang) || 'en';
    var locKey = base + '_' + L;
    var loc = p[locKey];
    if (loc != null && String(loc).trim() !== '') {
      return {
        value: perfNormalizeSupportingText(String(loc).trim(), base, L),
        source: locKey
      };
    }
    if (base === 'eventLinkLabel') {
      var enKeyLabel = base + '_en';
      var enLabel = p[enKeyLabel];
      if (L !== 'en' && enLabel != null && String(enLabel).trim() !== '') {
        return {
          value: String(enLabel).trim(),
          source: enKeyLabel
        };
      }
      var sharedLabel = p[base];
      if (sharedLabel != null && String(sharedLabel).trim() !== '') {
        return {
          value: String(sharedLabel).trim(),
          source: base
        };
      }
      return { value: '', source: '' };
    }
    if (base === 'detail' || base === 'extDesc') {
      var sharedDetail = p[base];
      if (sharedDetail != null && String(sharedDetail).trim() !== '') {
        return {
          value: perfNormalizeSupportingText(String(sharedDetail).trim(), base, L),
          source: base
        };
      }
      var enKeyDetail = base + '_en';
      var enDetail = p[enKeyDetail];
      if (L !== 'en' && enDetail != null && String(enDetail).trim() !== '') {
        return {
          value: perfNormalizeSupportingText(String(enDetail).trim(), base, L),
          source: enKeyDetail
        };
      }
      return { value: '', source: '' };
    }
    var enKey2 = base + '_en';
    var enLoc2 = p[enKey2];
    if (L !== 'en' && enLoc2 != null && String(enLoc2).trim() !== '') {
      return {
        value: perfNormalizeSupportingText(String(enLoc2).trim(), base, L),
        source: enKey2
      };
    }
    var g = p[base];
    if (g != null && String(g).trim() !== '') {
      return {
        value: perfNormalizeSupportingText(String(g).trim(), base, L),
        source: base
      };
    }
    return { value: '', source: '' };
  }
  function perfLocaleField(p, base, lang) {
    return perfLocaleFieldResolve(p, base, lang).value;
  }
  function resolvePerfCtaLabel(p, lang) {
    var chosenLabel = perfLocaleField(p, 'eventLinkLabel', lang);
    if (chosenLabel) return chosenLabel;
    var t = uiTable(lang);
    var ticketUrl = perfLocaleField(p, 'eventLink', lang);
    var hasPrice = p && p.ticketPrice && String(p.ticketPrice).trim() !== '';
    var isSalesLike =
      ticketUrl && /ticket|booking|reserv|kaufen|billet|entrada|biglietto|billet/i.test(String(ticketUrl));
    if (hasPrice || isSalesLike) return t['perf.ticketsInfo'] || 'Tickets & Info';
    return t['perf.moreInfo'] || 'More info';
  }
  function isValidPerfCtaUrl(raw) {
    var url = String(raw || '').trim();
    if (!url) return false;
    if (!/^https?:\/\//i.test(url)) return false;
    if (/^https?:\/\/\.{3,}(?:\/.*)?$/i.test(url)) return false;
    if (/placeholder|example\.com\/?\.\.\.|todo|coming[-_\s]?soon/i.test(url)) return false;
    return true;
  }
  function calendarModalEventSnapshot(p, lang) {
    if (!p || typeof p !== 'object') return {};
    return {
      id: p.id,
      idType: typeof p.id,
      title: resolveEventTitle(p, lang),
      type: p.type || '',
      status: p.status || '',
      modalEnabled: p.modalEnabled,
      private: perfIsPrivateEvent(p, lang),
      detail: perfLocaleField(p, 'detail', lang) || '',
      extDesc: perfLocaleField(p, 'extDesc', lang) || '',
      eventLink: perfLocaleField(p, 'eventLink', lang) || '',
      eventLinkLabel: perfLocaleField(p, 'eventLinkLabel', lang) || '',
      modalImg: String(p.modalImg || '').trim(),
      flyerImg: String(p.flyerImg || '').trim(),
      venue: perfLocalizedField(p, 'venue', lang, 'place') || '',
      city: perfLocalizedField(p, 'city', lang, 'place') || '',
      address: perfModalAddress(p, lang),
      mapsUrl: String(p.mapsUrl || '').trim(),
      ticketPrice: String(p.ticketPrice || '').trim(),
      sortDate: String(p.sortDate || '').trim(),
      time: perfLocaleField(p, 'time', lang) || ''
    };
  }
  function calendarModalDebug(label, payload) {
    try {
      console.log('[Calendar modal]', label, payload || {});
    } catch (e) {}
  }
  function calendarModalOptionalStep(label, snapshot, fn) {
    try {
      return fn();
    } catch (err) {
      calendarModalDebug(label + ' failed', {
        error: err && err.message ? err.message : String(err || 'unknown'),
        snapshot: snapshot || {}
      });
      return null;
    }
  }
  function setModalText(id, value) {
    var el = document.getElementById(id);
    if (!el) return null;
    el.textContent = value == null ? '' : String(value);
    return el;
  }
  function setModalHtml(id, value) {
    var el = document.getElementById(id);
    if (!el) return null;
    el.innerHTML = value == null ? '' : String(value);
    return el;
  }
  var PERF_PLACEHOLDER_TRANSLATIONS = {
    en: 'To be announced',
    de: 'Wird noch angekündigt',
    es: 'Por anunciar',
    it: 'Da annunciare',
    fr: 'À annoncer'
  };
  var PERF_PLACEHOLDER_PATTERNS = [
    /^tba\.?$/i,
    /^to be announced\.?$/i,
    /^to be confirmed\.?$/i,
    /^coming soon\.?$/i,
    /^upcoming dates to be announced soon\.?$/i
  ];
  var PERF_SUPPORTING_TEXT_TRANSLATIONS = {
    private_engagement: {
      en: 'Private engagement',
      de: 'Private Veranstaltung',
      es: 'Evento privado',
      it: 'Evento privato',
      fr: 'Événement privé'
    },
    private_event: {
      en: 'Private event',
      de: 'Private Veranstaltung',
      es: 'Evento privado',
      it: 'Evento privato',
      fr: 'Événement privé'
    },
    by_invitation_only: {
      en: 'By invitation only',
      de: 'Nur auf Einladung',
      es: 'Solo por invitación',
      it: 'Solo su invito',
      fr: 'Sur invitation uniquement'
    },
    closed_event: {
      en: 'Closed event',
      de: 'Geschlossene Veranstaltung',
      es: 'Evento cerrado',
      it: 'Evento chiuso',
      fr: 'Événement fermé'
    }
  };
  function perfSupportingTextKey(raw) {
    var s = String(raw || '')
      .trim()
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/\u2019/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!s) return '';
    if (s === 'private_engagements') return 'private_engagement';
    if (s === 'private_events') return 'private_event';
    return s;
  }
  function perfNormalizeSupportingText(raw, base, lang) {
    var text = String(raw || '').trim();
    if (!text) return '';
    if (!(base === 'detail' || base === 'extDesc')) return text;
    var key = perfSupportingTextKey(text);
    if (!key) return text;
    var row = PERF_SUPPORTING_TEXT_TRANSLATIONS[key];
    if (!row) return text;
    return row[lang] || row.en || text;
  }
  function perfPrivateUiText(lang, key) {
    var localeKey = key === 'badge' ? 'perf.privateBadge' : 'perf.privateDetail';
    var table = PERF_PRIVATE_UI_TEXT[lang] || PERF_PRIVATE_UI_TEXT.en;
    var fallback =
      (table && table[key]) || (PERF_PRIVATE_UI_TEXT.en && PERF_PRIVATE_UI_TEXT.en[key]) || '';
    return mpPick(lang, localeKey, fallback);
  }
  function perfIsPrivateDescriptorText(raw) {
    var s = String(raw || '').trim();
    if (!s) return false;
    var key = perfSupportingTextKey(s);
    if (key && (key === 'private_event' || key === 'private_engagement' || key === 'by_invitation_only' || key === 'closed_event')) return true;
    var low = s.toLowerCase();
    return /private|invitation only|nur auf einladung|evento privado|evento privato|evenement prive|sur invitation/.test(low);
  }
  function perfHasExplicitPrivateFlag(p) {
    return !!(p && Object.prototype.hasOwnProperty.call(p, 'private'));
  }
  function perfExplicitPrivateValue(p) {
    return !!(perfHasExplicitPrivateFlag(p) && isTruthyFlag(p.private));
  }
  function perfIsPrivateEvent(p, lang) {
    if (!p) return false;
    if (perfHasExplicitPrivateFlag(p)) return perfExplicitPrivateValue(p);
    var type = String(p.type || '').trim().toLowerCase();
    if (type === 'houseconcert' || type === 'private' || type === 'private_event' || type === 'invitation_only') return true;
    var detailCandidates = [
      p['detail_' + lang],
      p.detail,
      p.detail_en,
      p.extDesc,
      p['extDesc_' + lang],
      p.extDesc_en
    ];
    if (detailCandidates.some(perfIsPrivateDescriptorText)) return true;
    var titleCandidates = [p.title, p.name, p['title_' + lang], p.title_en];
    return titleCandidates.some(function (v) {
      var key = perfSupportingTextKey(v);
      return key === 'private_event' || key === 'private_engagement';
    });
  }
  function perfPrivateDetailText(p, lang, fallbackDetail) {
    if (p && isTruthyFlag(p.hidePrivateDetailLine)) return '';
    var override = String(perfLocaleField(p, 'privateDetailText', lang) || '').trim();
    if (override) return override;
    var detail = String(fallbackDetail || '').trim();
    if (!detail) return perfPrivateUiText(lang, 'detail');
    return perfIsPrivateDescriptorText(detail) ? perfPrivateUiText(lang, 'detail') : detail;
  }
  function perfPrivateBackgroundUrl(p, lang) {
    var explicit = String(p && p.venuePhoto || '').trim();
    if (explicit) return explicit;
    return perfIsPrivateEvent(p, lang) ? PERF_PRIVATE_DEFAULT_BG_URL : '';
  }
  function normalizePerfBackgroundFocus(raw) {
    var value = String(raw || '').trim().toLowerCase().replace(/\s+/g, ' ');
    var allowed = {
      'top left': 1,
      'top center': 1,
      'top right': 1,
      'center left': 1,
      'center center': 1,
      'center right': 1,
      'bottom left': 1,
      'bottom center': 1,
      'bottom right': 1
    };
    return allowed[value] ? value : 'center center';
  }
  function moreInfoUsesEditorialTemplate(p) {
    return String((p && p.moreInfoDisplayMode) || '').trim().toLowerCase() === 'editorial-template';
  }
  function moreInfoTemplateClass(raw) {
    var value = String(raw || '').trim().toLowerCase();
    if (value === 'duo') return 'rg-ed--duo-a';
    if (value === 'trio') return 'rg-ed--trio-a';
    if (value === 'quartet') return 'rg-ed--quartet-a';
    if (value === 'ensemble') return 'rg-ed--ensemble-a';
    return 'rg-ed--solo-a';
  }
  function moreInfoImageSlotsForTemplate(raw) {
    var value = String(raw || '').trim().toLowerCase();
    if (value === 'duo') return ['primary', 'secondary'];
    if (value === 'trio') return ['primary', 'secondary', 'tertiary'];
    if (value === 'quartet') return ['q1', 'q2', 'q3', 'q4'];
    if (value === 'ensemble') return ['hero', 'e1', 'e2', 'e3', 'e4'];
    return ['hero'];
  }
  function moreInfoImageData(p, idx) {
    var n = String(idx);
    return {
      url: String((p && p['moreInfoImage' + n]) || '').trim(),
      focus: normalizePerfBackgroundFocus(p && p['moreInfoImage' + n + 'Focus'])
    };
  }
  function moreInfoAllImages(p, fallbackUrl) {
    var out = [];
    var i;
    for (i = 1; i <= 5; i++) {
      var item = moreInfoImageData(p, i);
      if (item.url) out.push(item);
    }
    if (!out.length && fallbackUrl) out.push({ url: fallbackUrl, focus: 'center center' });
    return out;
  }
  function moreInfoImageAt(images, idx) {
    if (!images.length) return { url: '', focus: 'center center' };
    return images[idx] || images[images.length - 1] || images[0];
  }
  function moreInfoFigureHtml(slot, item) {
    var focusClass = 'is-focus-' + normalizePerfBackgroundFocus(item && item.focus).replace(/\s+/g, '-');
    var bg = item && item.url ? ' style="--rg-ed-image:url(\'' + escHtml(String(item.url).replace(/'/g, '%27')) + '\');"' : '';
    return '<figure class="rg-ed__image rg-ed__image--' + slot + ' ' + focusClass + '"' + bg + '></figure>';
  }
  function moreInfoArtworkHtml(p, fallbackUrl, title, subtitle, meta1, meta2, body) {
    var template = String((p && p.moreInfoTemplate) || 'solo').trim().toLowerCase() || 'solo';
    var cls = moreInfoTemplateClass(template);
    var images = moreInfoAllImages(p, fallbackUrl);
    var media = '';
    if (template === 'duo') {
      media = '<div class="rg-ed__media rg-ed__media--split-8-4">' +
        moreInfoFigureHtml('primary', moreInfoImageAt(images, 0)) +
        moreInfoFigureHtml('secondary', moreInfoImageAt(images, 1)) +
        '</div><div class="rg-ed__overlay rg-ed__overlay--horizontal"></div>';
    } else if (template === 'trio') {
      media = '<div class="rg-ed__media rg-ed__media--trio">' +
        moreInfoFigureHtml('primary', moreInfoImageAt(images, 0)) +
        '<div class="rg-ed__stack">' +
        moreInfoFigureHtml('secondary', moreInfoImageAt(images, 1)) +
        moreInfoFigureHtml('tertiary', moreInfoImageAt(images, 2)) +
        '</div></div><div class="rg-ed__overlay rg-ed__overlay--vertical"></div>';
    } else if (template === 'quartet') {
      media = '<div class="rg-ed__media rg-ed__media--grid-2x2">' +
        moreInfoFigureHtml('q1', moreInfoImageAt(images, 0)) +
        moreInfoFigureHtml('q2', moreInfoImageAt(images, 1)) +
        moreInfoFigureHtml('q3', moreInfoImageAt(images, 2)) +
        moreInfoFigureHtml('q4', moreInfoImageAt(images, 3)) +
        '</div><div class="rg-ed__panel rg-ed__panel--text"></div>';
    } else if (template === 'ensemble') {
      media = '<div class="rg-ed__media rg-ed__media--ensemble">' +
        moreInfoFigureHtml('hero', moreInfoImageAt(images, 0)) +
        '<div class="rg-ed__row rg-ed__row--four">' +
        moreInfoFigureHtml('e1', moreInfoImageAt(images, 1)) +
        moreInfoFigureHtml('e2', moreInfoImageAt(images, 2)) +
        moreInfoFigureHtml('e3', moreInfoImageAt(images, 3)) +
        moreInfoFigureHtml('e4', moreInfoImageAt(images, 4)) +
        '</div></div><div class="rg-ed__overlay rg-ed__overlay--vertical"></div>';
    } else {
      media = '<div class="rg-ed__media">' +
        moreInfoFigureHtml('hero', moreInfoImageAt(images, 0)) +
        '</div><div class="rg-ed__overlay rg-ed__overlay--vertical"></div>';
    }
    return '<article class="rg-ed rg-ed--45 ' + cls + '">' +
      media +
      '<div class="' + (template === 'quartet' ? 'rg-ed__text rg-ed__text--panel-left' : 'rg-ed__text rg-ed__text--bottom-left') + '">' +
      '<div class="rg-ed__label">' + escHtml((template === 'ensemble' ? 'SMALL ENSEMBLE' : template).toUpperCase()) + '</div>' +
      '<h1 class="rg-ed__title">' + escHtml(title) + '</h1>' +
      (subtitle ? '<div class="rg-ed__subtitle">' + escHtml(subtitle) + '</div>' : '') +
      '<div class="rg-ed__meta"><div class="rg-ed__meta-line">' + escHtml(meta1) + '</div><div class="rg-ed__meta-line">' + escHtml(meta2) + '</div></div>' +
      (body ? '<div class="rg-ed__body">' + escHtml(body) + '</div>' : '') +
      '</div></article>';
  }
  function renderEditorialMoreInfo(p, isPrivate, modalTitle, typeLabel, venueCity, modalBody, fallbackUrl) {
    var editorial = document.getElementById('emEditorial');
    var shell = document.getElementById('eventModalShell');
    if (!editorial || !shell) return false;
    if (!moreInfoUsesEditorialTemplate(p)) {
      editorial.style.display = 'none';
      editorial.innerHTML = '';
      shell.classList.remove('is-editorial');
      return false;
    }
    var title = String(p.moreInfoTitle || '').trim() || modalTitle;
    var subtitle = String(p.moreInfoSubtitle || '').trim();
    var artists = String(p.moreInfoArtists || '').trim();
    var address = String(p.moreInfoAddress || '').trim() || perfModalAddress(p, currentLang);
    var description = String(p.moreInfoDescription || '').trim() || modalBody;
    var extra = String(p.moreInfoExtra || '').trim();
    var meta1 = perfDateLine(p, currentLang);
    var meta2 = venueCity;
    var t = uiTable(currentLang);
    var labelArtists = t['perf.editorialArtists'] || 'Artists';
    var labelDetails = t['perf.editorialDetails'] || 'Event details';
    var labelType = t['perf.editorialType'] || 'Type';
    var labelDate = t['perf.editorialDate'] || 'Date & time';
    var labelVenue = t['perf.editorialVenue'] || 'Venue';
    var labelAddress = t['perf.editorialAddress'] || 'Address';
    var labelTicket = t['perf.editorialTicket'] || 'Ticket price';
    var labelAbout = t['perf.editorialAbout'] || 'About this event';
    var labelExtra = t['perf.editorialExtra'] || 'Additional information';
    var template = String((p && p.moreInfoTemplate) || 'solo').trim().toLowerCase() || 'solo';
    var cls = moreInfoTemplateClass(template);
    var images = moreInfoAllImages(p, fallbackUrl);
    var heroImg = moreInfoImageAt(images, 0);
    var heroHtml = heroImg.url ? '<div class="event-modal-editorial__hero" style="--rg-ed-image:url(\'' + escHtml(String(heroImg.url).replace(/'/g, '%27')) + '\'); --rg-ed-focus:' + normalizePerfBackgroundFocus(heroImg.focus) + ';"></div>' : '';
    var customLabel = String(p.moreInfoLabel || '').trim();
    var labelFallbacks = {
      solo: t['perf.editorialLabelSolo'] || 'Solo',
      duo: t['perf.editorialLabelDuo'] || 'Duo',
      trio: t['perf.editorialLabelTrio'] || 'Trio',
      quartet: t['perf.editorialLabelQuartet'] || 'Quartet',
      ensemble: t['perf.editorialLabelEnsemble'] || 'Ensemble'
    };
    var displayLabel = customLabel || (labelFallbacks[template] || template.charAt(0).toUpperCase() + template.slice(1));
    var contentHtml = '<div class="event-modal-editorial__content">';
    contentHtml += '<div class="event-modal-editorial__header">';
    contentHtml += '<div class="event-modal-editorial__label">' + escHtml(displayLabel) + '</div>';
    contentHtml += '<h2 class="event-modal-editorial__title">' + escHtml(title) + '</h2>';
    if (subtitle) contentHtml += '<div class="event-modal-editorial__subtitle">' + escHtml(subtitle) + '</div>';
    if (artists) contentHtml += '<div class="event-modal-editorial__artists">' + escHtml(artists) + '</div>';
    contentHtml += '</div>';
    contentHtml += '<div class="event-modal-editorial__meta">';
    contentHtml += '<div class="event-modal-editorial__meta-item"><span class="event-modal-editorial__meta-label">' + escHtml(labelType) + '</span> <span class="event-modal-editorial__meta-value">' + escHtml(typeLabel || '') + '</span></div>';
    contentHtml += '<div class="event-modal-editorial__meta-item"><span class="event-modal-editorial__meta-label">' + escHtml(labelDate) + '</span> <span class="event-modal-editorial__meta-value">' + escHtml(meta1) + '</span></div>';
    contentHtml += '<div class="event-modal-editorial__meta-item"><span class="event-modal-editorial__meta-label">' + escHtml(labelVenue) + '</span> <span class="event-modal-editorial__meta-value">' + escHtml(meta2) + '</span></div>';
    if (address) contentHtml += '<div class="event-modal-editorial__meta-item"><span class="event-modal-editorial__meta-label">' + escHtml(labelAddress) + '</span> <span class="event-modal-editorial__meta-value">' + escHtml(address) + '</span></div>';
    if (!isPrivate && p.ticketPrice && p.ticketPrice.trim()) contentHtml += '<div class="event-modal-editorial__meta-item"><span class="event-modal-editorial__meta-label">' + escHtml(labelTicket) + '</span> <span class="event-modal-editorial__meta-value">' + escHtml(p.ticketPrice) + '</span></div>';
    contentHtml += '</div>';
    if (description) contentHtml += '<div class="event-modal-editorial__body"><p>' + escHtml(description).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p></div>';
    var flyerUrl = String(p.flyerImg || '').trim();
    if (flyerUrl) {
      contentHtml += '<div class="event-modal-editorial__flyer"><img src="' + escHtml(flyerUrl) + '" alt="' + escHtml(title) + ' flyer" loading="lazy"></div>';
    }
    if (extra) contentHtml += '<div class="event-modal-editorial__extra"><div class="event-modal-editorial__extra-label">' + escHtml(labelExtra) + '</div><p>' + escHtml(extra).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p></div>';
    contentHtml += '</div>';
    editorial.innerHTML = '<div class="event-modal-editorial__inner ' + cls + '">' + heroHtml + contentHtml + '</div>';
    editorial.style.display = '';
    shell.classList.add('is-editorial');
    return true;
  }
  var PERF_COUNTRY_NAME_TO_CODE = {
    germany: 'DE',
    deutschland: 'DE',
    alemania: 'DE',
    allemagne: 'DE',
    germania: 'DE',
    italy: 'IT',
    italia: 'IT',
    france: 'FR',
    francia: 'FR',
    frankreich: 'FR',
    argentina: 'AR',
    argentine: 'AR',
    argentinien: 'AR',
    spain: 'ES',
    espana: 'ES',
    españa: 'ES',
    spanien: 'ES',
    austria: 'AT',
    österreich: 'AT',
    suisse: 'CH',
    switzerland: 'CH',
    schweiz: 'CH'
  };
  function perfLocalizedPlaceholder(raw, lang) {
    var text = String(raw || '').trim();
    if (!text) return '';
    var isPlaceholder = PERF_PLACEHOLDER_PATTERNS.some(function (rx) { return rx.test(text); });
    return isPlaceholder ? (PERF_PLACEHOLDER_TRANSLATIONS[lang] || PERF_PLACEHOLDER_TRANSLATIONS.en) : text;
  }
  function perfLocalizedCountryToken(token, lang) {
    var text = String(token || '').trim();
    if (!text) return '';
    var code = PERF_COUNTRY_NAME_TO_CODE[text.toLowerCase()];
    if (!code) return text;
    try {
      var display = new Intl.DisplayNames([localeTagForMpLang(lang)], { type: 'region' });
      return display.of(code) || text;
    } catch (e) {
      return text;
    }
  }
  function perfLocalizedPlaceText(raw, lang) {
    var text = perfLocalizedPlaceholder(raw, lang);
    if (!text) return '';
    return text
      .split(',')
      .map(function (part) { return perfLocalizedCountryToken(part, lang); })
      .join(', ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function perfLocalizedField(p, base, lang, kind) {
    var value = perfLocaleField(p, base, lang);
    if (!value) return '';
    if (kind === 'place') return perfLocalizedPlaceText(value, lang);
    return perfLocalizedPlaceholder(value, lang);
  }
  function perfModalAddress(p, lang) {
    if (!p) return '';
    return (
      perfLocalizedField(p, 'address', lang, 'place') ||
      perfLocalizedPlaceText(p.moreInfoAddress, lang)
    );
  }
  function perfMapsLabel(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var labels = {
      en: 'Map / Route',
      de: 'Karte / Route',
      es: 'Mapa / ruta',
      it: 'Mappa / percorso',
      fr: 'Carte / itinéraire'
    };
    var t = uiTable(L);
    var fromLocale = String(t['perf.maps'] || '').trim();
    if (fromLocale && fromLocale.indexOf('/') >= 0) return fromLocale;
    return labels[L] || labels.en;
  }
  function perfMapsHref(p, lang) {
    if (!p) return '';
    var explicit = String(p.mapsUrl || '').trim();
    if (isValidPerfCtaUrl(explicit)) return explicit;
    var address = perfModalAddress(p, lang);
    var venue = perfLocalizedField(p, 'venue', lang, 'place') || '';
    var city = perfLocalizedField(p, 'city', lang, 'place') || '';
    var destination = address || [venue, city].filter(Boolean).join(' ');
    return destination ? ('https://maps.google.com/?q=' + encodeURIComponent(destination)) : '';
  }
  function perfModalBodyText(p, lang, isPrivate) {
    var detail = perfLocalizedField(p, 'detail', lang);
    if (isPrivate) detail = perfPrivateDetailText(p, lang, detail);
    var extBody = perfLocalizedField(p, 'extDesc', lang);
    return extBody || detail || '';
  }
  function perfFormatTime(raw, lang) {
    if (!raw) return '';
    var cleanTime = String(raw).replace(/\s*(uhr|h)\s*$/i, '').trim();
    var timeFmts = {
      en: function (t) {
        return t;
      },
      de: function (t) {
        return t + ' Uhr';
      },
      es: function (t) {
        return t + ' h';
      },
      it: function (t) {
        return 'ore ' + t;
      },
      fr: function (t) {
        return t.replace(':', 'h');
      }
    };
    return (timeFmts[lang] || timeFmts.en)(cleanTime);
  }
  function perfDateParts(p, lang) {
    var sort = String((p && p.sortDate) || '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(sort)) {
      var parsed = new Date(sort + 'T00:00:00');
      if (!isNaN(parsed.getTime())) {
        var year = parsed.getFullYear();
        return {
          day: String((p && p.day) || parsed.getDate()),
          month: parsed.toLocaleString(localeTagForMpLang(lang), { month: 'long' }),
          year: year > 2090 ? '' : String(year)
        };
      }
    }
    var translatedMonth = translateMonth(perfLocaleField(p, 'month', lang));
    var parts = splitMonthLineAndYear(translatedMonth);
    return {
      day: String((p && p.day) || ''),
      month: parts.month,
      year: parts.year
    };
  }
  function perfDateLine(p, lang) {
    var parts = perfDateParts(p, lang);
    var chunks = [];
    var day = String(parts.day || '').trim();
    var month = String(parts.month || '').trim();
    var year = String(parts.year || '').trim();
    if (day && day !== 'TBA') chunks.push(day);
    if (month) chunks.push(month);
    if (year) chunks.push(year);
    if (!chunks.length) chunks.push(uiTable(lang)['perf.yearTba'] || 'TBA');
    var timeText = perfFormatTime(perfLocaleField(p, 'time', lang), lang);
    return timeText ? (chunks.join(' ') + ' · ' + timeText) : chunks.join(' ');
  }
  function resolveEventTitle(p, lang) {
    var title = p && p.title != null ? String(p.title).trim() : '';
    var name = p && p.name != null ? String(p.name).trim() : '';
    var localeTitle = p && p['title_' + lang] != null ? String(p['title_' + lang]).trim() : '';
    // Multilingual strategy: keep artistic/project title stable across locales.
    // Localized title fields are only fallback for legacy items missing canonical title.
    var chosen;
    var source;
    if (perfIsPrivateEvent(p, lang) && localeTitle) {
      chosen = localeTitle;
      source = 'title_' + lang + '(private preferred)';
    } else {
      chosen = title || name || localeTitle || '';
      source = title ? 'title(canonical)' : (name ? 'name(legacy)' : (localeTitle ? 'title_' + lang + '(fallback)' : 'empty'));
    }
    if (!titleChoiceLogged) {
      titleChoiceLogged = true;
      console.log('[Calendar] Title field resolution sample', {
        lang: lang,
        raw_title: title,
        raw_name: name,
        raw_title_locale: localeTitle,
        chosen: chosen,
        source: source
      });
    }
    return chosen;
  }

  function sortDate(p) {
    if (p.sortDate) return new Date(p.sortDate);
    var str = (p.day && p.day !== 'TBA' ? p.day + ' ' : '1 ') + (p.month || 'Jan 2099');
    var d = new Date(str);
    return isNaN(d.getTime()) ? new Date('2099-01-01') : d;
  }
  function toAbsolutePublicUrl(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    try {
      return new URL(s, window.location.origin).toString();
    } catch (e) {
      return '';
    }
  }
  function parseOfferPrice(raw) {
    var s = String(raw || '').trim();
    if (!s) return null;
    var out = { isFree: false, price: null, priceCurrency: null };
    var low = s.toLowerCase();
    if (/(^|\b)(free|gratis|libre|gratuito|gratuita|kostenlos|gratuit)\b/.test(low)) {
      out.isFree = true;
      return out;
    }
    var m = s.replace(',', '.').match(/(\d+(?:\.\d{1,2})?)/);
    if (!m) return out;
    var n = Number(m[1]);
    if (!Number.isFinite(n)) return out;
    out.price = n.toFixed(2);
    if (/€|eur/i.test(s)) out.priceCurrency = 'EUR';
    else if (/\$|usd/i.test(s)) out.priceCurrency = 'USD';
    else if (/£|gbp/i.test(s)) out.priceCurrency = 'GBP';
    return out;
  }
  function updateUpcomingEventSchema(upcomingList) {
    var prev = document.getElementById('calendar-events-jsonld');
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    if (!Array.isArray(upcomingList) || !upcomingList.length) return;
    var items = [];
    upcomingList.forEach(function (p) {
      var isPrivate = perfIsPrivateEvent(p, currentLang);
      var dateRaw = String(p.sortDate || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) return;
      var title = resolveEventTitle(p, currentLang);
      if (!title) return;
      var startDate = dateRaw;
      var time = String(p.time || '').trim();
      if (/^\d{1,2}:\d{2}$/.test(time)) {
        var hhmm = time.split(':');
        var hh = hhmm[0].padStart(2, '0');
        startDate = dateRaw + 'T' + hh + ':' + hhmm[1] + ':00';
      }
      var eventAnchor = String(p.id || '').trim() ? ('#event-' + safeDomToken(p.id, '')) : '';
      var eventUrl = 'https://rolandoguy.com/calendar' + eventAnchor;
      var ev = {
        '@type': 'MusicEvent',
        name: title,
        startDate: startDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        url: eventUrl,
        mainEntityOfPage: eventUrl,
        performer: {
          '@type': 'Person',
          name: 'Rolando Guy',
          url: 'https://rolandoguy.com/'
        },
        organizer: {
          '@type': 'Organization',
          name: 'Rolando Guy',
          url: 'https://rolandoguy.com/'
        }
      };
      if (String(p.id || '').trim()) ev.identifier = String(p.id).trim();
      var detail = perfLocalizedField(p, 'detail', currentLang);
      if (isPrivate) detail = perfPrivateDetailText(p, currentLang, detail);
      if (detail) ev.description = detail;
      var venueName = perfLocalizedField(p, 'venue', currentLang, 'place');
      var city = perfLocalizedField(p, 'city', currentLang, 'place');
      if (venueName || city) {
        ev.location = {
          '@type': 'Place',
          name: venueName || city
        };
        if (city) {
          ev.location.address = {
            '@type': 'PostalAddress',
            addressLocality: city
          };
        }
      }
      var venueImgAbs = toAbsolutePublicUrl(perfPrivateBackgroundUrl(p, currentLang));
      ev.image = [venueImgAbs || 'https://rolandoguy.com/og-image.jpg'];
      var ticketUrl = perfLocaleField(p, 'eventLink', currentLang);
      if (!isPrivate && ticketUrl && /^https?:\/\//i.test(String(ticketUrl).trim())) {
        var offerParsed = parseOfferPrice(p.ticketPrice);
        ev.offers = {
          '@type': 'Offer',
          url: String(ticketUrl).trim(),
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString()
        };
        if (offerParsed && offerParsed.isFree) {
          ev.isAccessibleForFree = true;
        }
        if (offerParsed && offerParsed.price != null && offerParsed.priceCurrency) {
          ev.offers.price = offerParsed.price;
          ev.offers.priceCurrency = offerParsed.priceCurrency;
        }
      }
      items.push(ev);
    });
    if (!items.length) return;
    var script = document.createElement('script');
    script.id = 'calendar-events-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': items
    });
    document.head.appendChild(script);
  }

  /** Resolve venue image paths for pages under mp/ (admin may emit img/... without ../). */
  function normalizeVenuePhotoUrl(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s) || s.indexOf('data:') === 0 || s.indexOf('/') === 0) return s;
    if (s.indexOf('../') === 0 || s.indexOf('./') === 0) return s;
    if (s.indexOf('img/') === 0) return '../' + s;
    return s;
  }
  function compactVenueForCard(rawVenue) {
    var v = String(rawVenue || '').trim();
    if (!v) return '';
    // Prefer venue name on cards; avoid long street-address tails.
    if (v.indexOf(',') > -1) v = v.split(',')[0].trim();
    if (v.length > 64) v = v.slice(0, 61).trim() + '...';
    return v;
  }
  function safeDomToken(raw, fb) {
    var s = String(raw == null ? '' : raw).trim();
    if (!s) s = String(fb || '');
    s = s.replace(/[^A-Za-z0-9\-_:.]/g, '-');
    s = s.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    return s || String(fb || 'item');
  }

  function renderPerfs() {
    resolveActiveLang('renderPerfs');
    var list = document.getElementById('perfList');
    if (!list) return;
    list.innerHTML = '';
    var perfs = getPublicPerfs();
    console.log('[Calendar] rg_perfs loaded:', getPerfs().length, 'public after filter:', perfs.length);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var upcoming = [];
    perfs.forEach(function (p) {
      var d = sortDate(p);
      if (d >= today) upcoming.push(p);
    });
    upcoming.sort(function (a, b) {
      var ad = sortDate(a);
      var bd = sortDate(b);
      var diff = ad - bd;
      if (diff) return diff;
      var av = perfFeaturedVisual(a) ? 1 : 0;
      var bv = perfFeaturedVisual(b) ? 1 : 0;
      var al = perfFeaturedLayout(a) ? 1 : 0;
      var bl = perfFeaturedLayout(b) ? 1 : 0;
      var ap = av + al;
      var bp = bv + bl;
      if (ap !== bp) return bp - ap;
      if (av !== bv) return bv - av;
      if (al !== bl) return bl - al;
      return 0;
    });
    updateUpcomingEventSchema(upcoming);
    var perfLang = getPerfMerged();
    var types =
      perfLang.eventTypes || {
        opera: 'Opera',
        concert: 'Concert',
        recital: 'Recital',
        show: 'Show',
        gala: 'Gala',
        collaboration: 'Collaboration',
        houseconcert: 'House Concert',
        tango: 'Tango Night',
        other: 'Event'
      };
    var tPerf = uiTable(currentLang);
    var mapsWord = tPerf['perf.maps'] || 'Maps';
    function rowHtml(p, i, isPastSection) {
      var isArchive = sortDate(p) < today;
      var isEffectivePast = !!(isPastSection || isArchive || p.status === 'past');
      var isPrivate = perfIsPrivateEvent(p, currentLang);
      var isFeaturedVisual = perfFeaturedVisual(p);
      var isFeaturedLayout = perfFeaturedLayout(p);
      var typeLabel = isPrivate ? (tPerf['perf.privateEventType'] || 'Private event') : (types[p.type] || p.type || types.concert);
      var featuredLabel = tPerf['ui.featured'] || 'Featured';
      var badge =
        p.status === 'current' && !isPastSection
          ? '<div class="perf-badge">' + typeLabel + '</div>'
          : isEffectivePast
            ? '<div class="perf-badge perf-badge-past">' + typeLabel + '</div>'
            : '<div class="perf-type">' + typeLabel + '</div>';
      var featuredBadge =
        isFeaturedVisual && !isEffectivePast
          ? '<div class="perf-badge perf-badge-featured">' + featuredLabel + '</div>'
          : '';
      var privateBadgeText = String(perfLocaleField(p, 'privateBadgeText', currentLang) || '').trim();
      var privateBadge =
        isPrivate && !isTruthyFlag(p.hidePrivateBadge)
          ? '<div class="perf-badge perf-badge-private">' + (privateBadgeText || perfPrivateUiText(currentLang, 'badge')) + '</div>'
          : '';
      var localizedTime = perfFormatTime(perfLocaleField(p, 'time', currentLang), currentLang);
      var timeHtml = localizedTime ? ('<div class="perf-time">' + localizedTime + '</div>') : '';
      var venueText = perfLocalizedField(p, 'venue', currentLang, 'place');
      var cityText = perfLocalizedField(p, 'city', currentLang, 'place');
      var venueShort = compactVenueForCard(venueText);
      var venueCity = '';
      if (venueShort || cityText) {
        var venueLine = venueShort + (cityText ? ((venueShort ? ' · ' : '') + cityText) : '');
        if (isPrivate) {
          venueCity = '<div class="perf-venue-link perf-venue-link--private"><span class="perf-venue-emoji">\ud83d\udccd </span>' + venueLine + '</div>';
        } else {
          venueCity =
            '<a href="https://maps.google.com/?q=' +
            encodeURIComponent((venueText || '') + (cityText ? ' ' + cityText : '')) +
            '" target="_blank" rel="noopener" class="perf-venue-link"><span class="perf-venue-emoji">\ud83d\udccd </span>' +
            venueLine +
            ' <span class="perf-maps-hint">' +
            mapsWord +
            '</span></a>';
        }
      }
      var detail = perfLocalizedField(p, 'detail', currentLang);
      if (isPrivate) detail = perfPrivateDetailText(p, currentLang, detail);
      if (!supportingLocaleChoiceLogged) {
        supportingLocaleChoiceLogged = true;
        var detailResolve = perfLocaleFieldResolve(p, 'detail', currentLang);
        var extResolve = perfLocaleFieldResolve(p, 'extDesc', currentLang);
        console.log('[Calendar] Supporting i18n resolution sample', {
          lang: currentLang,
          eventTitle: resolveEventTitle(p, currentLang),
          detail: {
            base: p.detail || '',
            localized: p['detail_' + currentLang] || '',
            chosenCard: detail || '',
            source: detailResolve.source
          },
          extDesc: {
            base: p.extDesc || '',
            localized: p['extDesc_' + currentLang] || '',
            chosenModal: perfLocaleField(p, 'extDesc', currentLang) || '',
            source: extResolve.source
          },
          eventLinkLabel: {
            base: p.eventLinkLabel || '',
            localized: p['eventLinkLabel_' + currentLang] || '',
            chosenModal: perfLocaleField(p, 'eventLinkLabel', currentLang) || '',
            source: String(p['eventLinkLabel_' + currentLang] || '').trim() ? ('eventLinkLabel_' + currentLang) : 'eventLinkLabel'
          },
          eventLink: {
            base: p.eventLink || '',
            localized: p['eventLink_' + currentLang] || '',
            chosenModal: perfLocaleField(p, 'eventLink', currentLang) || '',
            source: String(p['eventLink_' + currentLang] || '').trim() ? ('eventLink_' + currentLang) : 'eventLink'
          }
        });
      }
      var modalBodyPreview = perfModalBodyText(p, currentLang, isPrivate);
      var linkForModal = perfLocaleField(p, 'eventLink', currentLang);
      var hasExtra =
        !!modalBodyPreview ||
        (p.ticketPrice && p.ticketPrice.trim()) ||
        isValidPerfCtaUrl(linkForModal) ||
        (p.flyerImg && p.flyerImg.trim()) ||
        (p.modalImg && p.modalImg.trim()) ||
        moreInfoUsesEditorialTemplate(p);
      var allowModalButton = isPrivate ? false : (p.modalEnabled === false ? false : (p.modalEnabled === true ? true : hasExtra));
      var moreRouteClass = allowModalButton ? ' perf-item--more' : ' perf-item--nomore';
      var pastClass = isEffectivePast ? ' perf-item-past' : '';
      var archiveClass = isArchive ? ' perf-item--archive' : '';
      var privateClass = isPrivate ? ' perf-item--private' : '';
      var featuredVisualClass = isFeaturedVisual && !isEffectivePast ? ' perf-item-featured' : '';
      var featuredLayoutClass = isFeaturedLayout && !isEffectivePast ? ' perf-item-featured-layout' : '';
      var venuePhotoResolved = normalizeVenuePhotoUrl(perfPrivateBackgroundUrl(p, currentLang));
      var venuePhotoFocus = normalizePerfBackgroundFocus(p.venuePhotoFocus);
      var hasVenuePhoto = !!venuePhotoResolved;
      var photoClass = hasVenuePhoto ? ' perf-item-has-photo' : ' perf-item-no-photo';
      var itemId = 'event-' + safeDomToken(p.id, i + 1);
      var h =
        '<div class="perf-item reveal' +
        (i > 0 ? ' rd' + ((i % 4) + 1) : '') +
        pastClass +
        archiveClass +
        privateClass +
        featuredVisualClass +
        featuredLayoutClass +
        photoClass +
        moreRouteClass +
        '" id="' +
        itemId +
        '">';
      if (isEffectivePast)
        h += '<div class="perf-past-stamp">' + (tPerf['perf.pastStamp'] || 'Past') + '</div>';
      if (hasVenuePhoto) {
        var op = (p.venueOpacity || 50) / 100;
        var brightness = Number(p.venueBrightness);
        if (!Number.isFinite(brightness)) brightness = 100;
        if (brightness < 40) brightness = 40;
        if (brightness > 140) brightness = 140;
        var contrast = Number(p.venueContrast);
        if (!Number.isFinite(contrast)) contrast = 100;
        if (contrast < 40) contrast = 40;
        if (contrast > 140) contrast = 140;
        h +=
          '<div class="perf-venue-bg" style="opacity:' +
          op +
          ';filter:brightness(' +
          brightness +
          '%) contrast(' +
          contrast +
          '%)' +
          ';background-image:url(&quot;' +
          String(venuePhotoResolved)
            .replace(/&/g, '&amp;')
            .replace(/\"/g, '&quot;')
            .replace(/</g, '&lt;') +
          '&quot;);background-position:' +
          String(venuePhotoFocus)
            .replace(/&/g, '&amp;')
            .replace(/\"/g, '&quot;')
            .replace(/</g, '&lt;') +
          '"></div>';
      }
      var monthYearParts = perfDateParts(p, currentLang);
      h +=
        '<div class="perf-date-box"><div class="perf-day">' +
        escHtml(String(monthYearParts.day != null ? monthYearParts.day : '')) +
        '</div><div class="perf-month">' +
        escHtml(monthYearParts.month || '') +
        '</div><div class="perf-year">' +
        (monthYearParts.year ? escHtml(monthYearParts.year) : '\u00a0') +
        '</div>' +
        timeHtml +
        '</div>';
      var listTitle = resolveEventTitle(p, currentLang);
      h += '<div class="perf-item-stack">';
      h +=
        featuredBadge +
        badge +
        privateBadge +
        '<div class="perf-info-title">' +
        listTitle +
        '</div>' +
        (detail ? ('<div class="perf-info-detail">' + detail + '</div>') : '') +
        venueCity;
      var printExt = perfLocaleField(p, 'extDesc', currentLang);
      var repLabel = tPerf['perf.repertoireLabel'] || 'Repertoire';
      if (printExt)
        h +=
          '<div class="perf-print-repertoire print-only"><strong>' +
          repLabel +
          ':</strong> ' +
          printExt
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>') +
          '</div>';
      var moreInfoLabel = resolvePerfCtaLabel(p, currentLang);
      if (allowModalButton)
        h +=
          '<button class="perf-more-btn no-print" data-perf-id="' +
          escHtml(String(p.id)) +
          '">' +
          moreInfoLabel +
          '</button>';
      h += '</div></div>';
      return h;
    }
    var upcomingByYear = {};
    upcoming.forEach(function (p) {
      var sd = sortDate(p);
      var kr = sd.getFullYear() > 2090 ? 'TBA' : String(sd.getFullYear());
      if (!upcomingByYear[kr]) upcomingByYear[kr] = [];
      upcomingByYear[kr].push(p);
    });
    var yearKeys = Object.keys(upcomingByYear).sort(function (a, b) {
      if (a === 'TBA') return 1;
      if (b === 'TBA') return -1;
      return Number(a) - Number(b);
    });
    var html = '';
    yearKeys.forEach(function (yr) {
      var bucket = upcomingByYear[yr]
        .slice()
        .sort(function (a, b) {
          return sortDate(a) - sortDate(b);
        });
      html += '<div class="perf-year-group">';
      var yrShown = yr === 'TBA' ? tPerf['perf.yearTba'] || 'TBA' : yr;
      html += '<div class="perf-year-label">' + escHtml(yrShown) + '</div>';
      bucket.forEach(function (p, i) {
        html += rowHtml(p, i, false);
      });
      html += '</div>';
    });
    if (!upcoming.length) {
      var msg = tPerf['perf.calendarEmpty'] || tPerf['perf.emptyUpcoming'] || 'Upcoming dates to be announced soon.';
      list.innerHTML = '<div class="perf-empty" role="status">' + msg + '</div>';
      var btn0 = document.getElementById('pastToggleBtn');
      if (btn0) btn0.style.display = 'none';
      renderPastPerformancesPublic();
      return;
    }

    list.innerHTML = html;
    var btn2 = document.getElementById('pastToggleBtn');
    if (btn2) btn2.style.display = 'none';
    var t = uiTable(currentLang);
    var printBtnText = document.getElementById('perfPrintBtnText');
    if (printBtnText) printBtnText.textContent = t['perf.printAgenda'] || 'Print calendar';
    var printSub = document.getElementById('perfPrintSubtitle');
    if (printSub) printSub.textContent = t['perf.printSubtitle'] || 'Calendar';
    document.querySelectorAll('#perfList .reveal:not(.visible)').forEach(function (el) {
      var ob = new IntersectionObserver(
        function (e) {
          e.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('visible');
              ob.unobserve(en.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      ob.observe(el);
    });
    renderPastPerformancesPublic();
  }

  function togglePastPublicList() {
    var wrap = document.getElementById('pastPerfListWrap');
    var toggleBtn = document.getElementById('pastPerfCollapseBtn');
    if (!wrap || !toggleBtn) return;
    var t = uiTable(currentLang);
    pastPublicExpanded = !pastPublicExpanded;
    if (pastPublicExpanded) {
      toggleBtn.textContent = t['perf.pastHide'] || '\u2212 Hide Past Performances';
      toggleBtn.setAttribute('aria-expanded', 'true');
      wrap.style.maxHeight = wrap.scrollHeight + 'px';
      wrap.style.opacity = '1';
    } else {
      toggleBtn.textContent = t['perf.pastShow'] || 'View past performances';
      toggleBtn.setAttribute('aria-expanded', 'false');
      wrap.style.maxHeight = '0px';
      wrap.style.opacity = '0';
    }
  }

  function getPublicPerfs() {
    return getPerfs().filter(function (p, idx) {
      return shouldRenderPublicEvent(p, idx);
    });
  }

  function printAgenda() {
    var lang = currentLang || 'en';
    var tPrint = uiTable(lang);
    // Print must mirror the same public visibility rules as live calendar rendering.
    var perfs = getPublicPerfs();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var upcoming = (Array.isArray(perfs) ? perfs : [])
      .filter(function (p) {
        return sortDate(p) >= today;
      })
      .sort(function (a, b) {
        return sortDate(a) - sortDate(b);
      });

    var esc = function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    var perfLang = getPerfMerged();
    var types =
      perfLang.eventTypes || {
        opera: 'Opera',
        concert: 'Concert',
        recital: 'Recital',
        show: 'Show',
        gala: 'Gala',
        collaboration: 'Collaboration',
        houseconcert: 'House Concert',
        tango: 'Tango Night',
        other: 'Event'
      };

    var timeFmt = function (t) {
      if (!t) return '';
      var clean = String(t).replace(/\s*(uhr|h)\s*$/i, '').trim();
      var fmts = {
        en: function (x) {
          return x;
        },
        de: function (x) {
          return x + ' Uhr';
        },
        es: function (x) {
          return x + ' h';
        },
        it: function (x) {
          return 'ore ' + x;
        },
        fr: function (x) {
          return x.replace(':', 'h');
        }
      };
      return (fmts[lang] || fmts.en)(clean);
    };

    var monthOut = function (m) {
      return translateMonth(m) || m || '';
    };

    var printHead = tPrint['perf.printHeadline'] || tPrint['perf.printSubtitle'] || 'Calendar';
    var printTag = tPrint['perf.printTagline'] || '';
    var docTitle = esc(
      tPrint['perf.printDocTitle'] ||
        ((tPrint['perf.printTitle'] || 'Rolando Guy') + ' — ' + printHead)
    );

    var body = '';
    if (!upcoming.length) {
      body =
        '<p class="empty">' +
        esc(tPrint['perf.emptyUpcoming'] || 'Upcoming dates to be announced soon.') +
        '</p>';
    } else {
      var groups = {};
      upcoming.forEach(function (p) {
        var sd = sortDate(p);
        var yr = sd.getFullYear() > 2090 ? 'TBA' : String(sd.getFullYear());
        if (!groups[yr]) groups[yr] = [];
        groups[yr].push(p);
      });
      Object.keys(groups)
        .sort()
        .forEach(function (yr) {
          var yrShown = yr === 'TBA' ? tPrint['perf.yearTba'] || 'TBA' : yr;
          body += '<h2 class="year">' + esc(yrShown) + '</h2>';
          groups[yr].forEach(function (p) {
            var isPrivate = perfIsPrivateEvent(p, lang);
            var typeLabel = isPrivate ? (tPrint['perf.privateEventType'] || 'Private event') : (types[p.type] || p.type || types.other || 'Event');
            var parts = perfDateParts(p, lang);
            var monthStr = parts.month || monthOut(p.month);
            var yearStr = parts.year ? (' ' + parts.year) : '';
            var tbaWord = tPrint['perf.yearTba'] || 'TBA';
            var dateStr =
              parts.day && parts.day !== 'TBA'
                ? esc(parts.day) + ' ' + esc(monthStr) + esc(yearStr)
                : esc(monthStr + yearStr).trim() || esc(tbaWord);
            var tStr = perfFormatTime(perfLocaleField(p, 'time', lang), lang);
            var when = tStr ? dateStr + ' · ' + esc(tStr) : dateStr;
            var title = resolveEventTitle(p, lang);
            var detail = perfLocalizedField(p, 'detail', lang);
            if (isPrivate) detail = perfPrivateDetailText(p, lang, detail);
            var venueBits = [];
            if (perfLocalizedField(p, 'venue', lang, 'place')) venueBits.push(perfLocalizedField(p, 'venue', lang, 'place'));
            if (perfLocalizedField(p, 'city', lang, 'place')) venueBits.push(perfLocalizedField(p, 'city', lang, 'place'));
            var venueLine = venueBits.join(' · ');
            var moreInfo = perfLocaleField(p, 'eventLink', lang);
            body +=
              '<article class="event">' +
              '<div class="meta">' +
              '<div class="when">' +
              esc(when) +
              '</div>' +
              '<div class="type">' +
              esc(typeLabel) +
              '</div>' +
              '</div>' +
              (title ? '<div class="title">' + esc(title) + '</div>' : '') +
              (detail ? '<div class="detail">' + esc(detail) + '</div>' : '') +
              (venueLine ? '<div class="venue">' + esc(venueLine) + '</div>' : '') +
              (!isPrivate && moreInfo
                ? '<div class="more"><a href="' +
                  esc(moreInfo) +
                  '">' +
                  esc(tPrint['perf.moreInfoPrint'] || 'More info') +
                  '</a></div>'
                : '') +
              '</article>';
          });
        });
    }

    var css =
      '@page{ size:A4 portrait; margin:18mm 18mm 16mm; }' +
      'html,body{ height:auto; margin:0; padding:0; background:#fff; color:#111; }' +
      'body{ font-family: ui-serif, Georgia, "Times New Roman", Times, serif; font-size:11pt; line-height:1.45; }' +
      '*{ box-sizing:border-box; }' +
      '.wrap{ max-width: 180mm; margin:0 auto; }' +
      'header{ text-align:center; padding: 0 0 10mm; border-bottom:1px solid #d7d7d7; margin-bottom:8mm; }' +
      '.name{ font-size:18pt; letter-spacing:.06em; font-weight:500; margin:0; }' +
      '.h1{ font-size:13pt; font-weight:600; letter-spacing:.12em; text-transform:uppercase; margin:4mm 0 0; }' +
      '.sub{ font-size:9.5pt; color:#444; margin:2mm 0 0; }' +
      '.year{ font-size:9.5pt; letter-spacing:.16em; text-transform:uppercase; color:#444; margin:7mm 0 3mm; padding-top:4mm; border-top:1px solid #ececec; }' +
      '.event{ padding: 4mm 0; border-bottom:1px solid #ededed; break-inside:avoid; page-break-inside:avoid; }' +
      '.event:last-child{ border-bottom:0; }' +
      '.meta{ display:flex; justify-content:space-between; gap:8mm; align-items:baseline; }' +
      '.when{ font-size:10.5pt; color:#111; }' +
      '.type{ font-size:8.5pt; letter-spacing:.14em; text-transform:uppercase; color:#555; white-space:nowrap; }' +
      '.title{ margin-top:1.5mm; font-size:12pt; font-style:italic; color:#111; }' +
      '.detail{ margin-top:1.5mm; color:#333; }' +
      '.venue{ margin-top:1.5mm; color:#444; }' +
      '.more{ margin-top:2mm; font-size:9pt; }' +
      'a{ color:#111; text-decoration:none; border-bottom:1px solid #bbb; }' +
      '.empty{ color:#555; font-style:italic; margin:10mm 0 0; text-align:center; }';

    var htmlOut =
      '<!doctype html><html lang="' +
      esc(lang) +
      '"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' +
      docTitle +
      '</title><style>' +
      css +
      '</style></head><body><div class="wrap"><header>' +
      '<h1 class="name">Rolando Guy</h1>' +
      '<div class="h1">' +
      esc(printHead) +
      '</div>' +
      '<div class="sub">' +
      esc(printTag) +
      '</div></header>' +
      body +
      '</div><script>' +
      "window.addEventListener('load',function(){try{window.focus();}catch(e){}" +
      'setTimeout(function(){try{window.print();}catch(e){}},50);});' +
      "window.addEventListener('afterprint',function(){try{window.close();}catch(e){}});" +
      '<\/script></body></html>';

    var blob = new Blob([htmlOut], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) {
      URL.revokeObjectURL(url);
      return;
    }
    w.addEventListener('load', function () {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    });
  }

  function debugOpenEventModal(evt, perfId) {
    if (evt && typeof evt.stopPropagation === 'function') evt.stopPropagation();
    calendarModalDebug('button click', {
      perfId: perfId,
      perfIdType: typeof perfId
    });
    return openEventModal(perfId);
  }

  function resolvePerfIdFromButtonValue(rawId) {
    var target = String(rawId == null ? '' : rawId);
    var perfs = getPerfs();
    for (var i = 0; i < perfs.length; i++) {
      if (String(perfs[i].id) === target) return perfs[i].id;
    }
    return target;
  }

  function openEventModal(perfId) {
    resolveActiveLang('openEventModal');
    lastEventModalFocus = document.activeElement;
    var perfs = getPerfs();
    var p = null;
    for (var i = 0; i < perfs.length; i++) {
      if (perfs[i].id === perfId) {
        p = perfs[i];
        break;
      }
    }
    if (!p) {
      calendarModalDebug('open abort: event not found', {
        perfId: perfId,
        perfIdType: typeof perfId
      });
      return;
    }
    var snapshot = calendarModalEventSnapshot(p, currentLang);
    calendarModalDebug('open start', snapshot);
    var perfLang = getPerfMerged();
    var types =
      perfLang.eventTypes || {
        opera: 'Opera',
        concert: 'Concert',
        recital: 'Recital',
        show: 'Show',
        gala: 'Gala',
        collaboration: 'Collaboration',
        houseconcert: 'House Concert',
        tango: 'Tango Night',
        other: 'Event'
      };
    var isPrivate = perfIsPrivateEvent(p, currentLang);
    var typeLabel = isPrivate ? ((uiTable(currentLang)['perf.privateEventType']) || 'Private event') : (types[p.type] || p.type || '');
    var modalTitle = resolveEventTitle(p, currentLang);
    var venueCity = [perfLocalizedField(p, 'venue', currentLang, 'place'), perfLocalizedField(p, 'city', currentLang, 'place')].filter(Boolean).join(' · ');
    var modalAddress = perfModalAddress(p, currentLang);
    var modalBody = perfModalBodyText(p, currentLang, isPrivate);
    var escapedBody = String(modalBody || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var bodyWithBreaks = escapedBody.replace(/\n/g, '<br>');
    var modalFallbackImg =
      p.modalImg && p.modalImg.trim()
        ? p.modalImg
        : p.venuePhoto && p.venuePhoto.trim()
          ? p.venuePhoto
          : '';
    var ticketUrl = perfLocaleField(p, 'eventLink', currentLang);
    var hideModalHero = isTruthyFlag(p.modalImgHide);
    var editorialActive = false;

    setModalText('emType', typeLabel);
    setModalText('emTitle', modalTitle);
    setModalText('emDate', perfDateLine(p, currentLang));
    setModalText('emVenue', venueCity);
    setModalText('emAddress', modalAddress);
    setModalHtml('emDetail', bodyWithBreaks);

    calendarModalOptionalStep('renderEditorialMoreInfo', snapshot, function () {
      editorialActive = !!renderEditorialMoreInfo(p, isPrivate, modalTitle, typeLabel, venueCity, modalBody, modalFallbackImg);
    });
    calendarModalOptionalStep('toggle core fields', snapshot, function () {
      var showAddress = !!(modalAddress && !isPrivate);
      var showVenue = !!(!isPrivate && venueCity);
      ['emType', 'emTitle', 'emDate', 'emDetail'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.display = editorialActive ? 'none' : '';
      });
      var venueEl = document.getElementById('emVenue');
      var addressEl = document.getElementById('emAddress');
      if (venueEl) {
        venueEl.style.display = showVenue ? '' : (editorialActive ? 'none' : '');
        venueEl.style.marginBottom = (showVenue && showAddress) ? '6px' : '24px';
      }
      if (addressEl) {
        addressEl.style.display = showAddress ? '' : 'none';
        addressEl.style.margin = (showVenue && showAddress) ? '-14px 0 24px' : '0 0 24px';
      }
    });
    calendarModalOptionalStep('hero image', snapshot, function () {
      var imgEl = document.getElementById('emVenueImg');
      if (!imgEl) return;
      if (editorialActive || hideModalHero) {
        imgEl.style.display = 'none';
        return;
      }
      if (modalFallbackImg) {
        imgEl.style.backgroundImage = 'url(' + modalFallbackImg + ')';
        imgEl.style.display = '';
      } else {
        imgEl.style.display = 'none';
      }
    });
    calendarModalOptionalStep('ext desc block', snapshot, function () {
      var extEl = document.getElementById('emExtDesc');
      if (extEl) extEl.style.display = 'none';
    });
    calendarModalOptionalStep('price block', snapshot, function () {
      var priceWrap = document.getElementById('emPrice');
      if (!priceWrap) return;
      if (!isPrivate && p.ticketPrice && p.ticketPrice.trim()) {
        setModalText('emPriceVal', p.ticketPrice);
        priceWrap.style.display = 'block';
      } else {
        priceWrap.style.display = 'none';
      }
    });
    calendarModalOptionalStep('cta link', snapshot, function () {
      var linkEl = document.getElementById('emEventLink');
      if (!linkEl) return;
      if (!isPrivate && isValidPerfCtaUrl(ticketUrl)) {
        linkEl.href = ticketUrl;
        linkEl.textContent = resolvePerfCtaLabel(p, currentLang);
        linkEl.style.display = 'inline-flex';
      } else {
        linkEl.removeAttribute('href');
        linkEl.style.display = 'none';
      }
    });
    if (!modalLocaleChoiceLogged) {
      modalLocaleChoiceLogged = true;
      var modalDetailResolve = perfLocaleFieldResolve(p, 'detail', currentLang);
      var modalExtResolve = perfLocaleFieldResolve(p, 'extDesc', currentLang);
      console.log('[Calendar] Modal i18n resolution sample', {
        lang: currentLang,
        eventTitle: modalTitle,
        detail: {
          base: p.detail || '',
          localized: p['detail_' + currentLang] || '',
          chosen: modalDetailResolve.value || '',
          source: modalDetailResolve.source
        },
        extDesc: {
          base: p.extDesc || '',
          localized: p['extDesc_' + currentLang] || '',
          chosen: modalBody || '',
          source: modalExtResolve.source
        },
        eventLink: {
          base: p.eventLink || '',
          localized: p['eventLink_' + currentLang] || '',
          chosen: ticketUrl || '',
          source: String(p['eventLink_' + currentLang] || '').trim() ? ('eventLink_' + currentLang) : 'eventLink'
        },
        eventLinkLabel: {
          base: p.eventLinkLabel || '',
          localized: p['eventLinkLabel_' + currentLang] || '',
          chosen: perfLocaleField(p, 'eventLinkLabel', currentLang) || '',
          source: String(p['eventLinkLabel_' + currentLang] || '').trim() ? ('eventLinkLabel_' + currentLang) : 'eventLinkLabel'
        }
      });
    }
    calendarModalOptionalStep('flyer', snapshot, function () {
      var flyerEl = document.getElementById('emFlyerImg');
      if (!flyerEl) return;
      if (!editorialActive && p.flyerImg && p.flyerImg.trim()) {
        flyerEl.src = p.flyerImg;
        var tFly = uiTable(currentLang);
        var flyTail = String(tFly['perf.flyerAltTail'] || '').trim();
        flyerEl.alt = flyTail ? modalTitle + ' — ' + flyTail : modalTitle;
        flyerEl.style.maxWidth = hideModalHero ? '100%' : '480px';
        flyerEl.style.display = '';
      } else {
        flyerEl.removeAttribute('src');
        flyerEl.style.display = 'none';
      }
    });
    calendarModalOptionalStep('maps link', snapshot, function () {
      var mapsEl = document.getElementById('emMapsLink');
      if (!mapsEl) return;
      var mapsTextEl = document.getElementById('emMapsText');
      var mapsHref = perfMapsHref(p, currentLang);
      if (mapsHref && !isPrivate) {
        mapsEl.href = mapsHref;
        var mapsLabel = perfMapsLabel(currentLang);
        if (mapsTextEl) mapsTextEl.textContent = mapsLabel;
        else mapsEl.textContent = '\ud83d\udccd ' + mapsLabel;
        mapsEl.style.display = 'inline-flex';
      } else {
        mapsEl.removeAttribute('href');
        mapsEl.style.display = 'none';
      }
    });

    var modal = document.getElementById('eventModal');
    if (!modal) {
      calendarModalDebug('open abort: missing modal shell', snapshot);
      return;
    }
    modal.style.display = '';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    calendarModalDebug('open complete', snapshot);
    setTimeout(function () {
      var closeBtn = document.getElementById('eventModalClose');
      if (closeBtn) closeBtn.focus();
    }, 0);
  }

  function closeEventModal() {
    var modal = document.getElementById('eventModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastEventModalFocus && typeof lastEventModalFocus.focus === 'function' && document.contains(lastEventModalFocus)) {
      setTimeout(function () {
        lastEventModalFocus.focus();
      }, 0);
    }
    lastEventModalFocus = null;
  }

  function applyPerfHeader() {
    var perfM = getPerfMerged();
    var perfH2 = document.getElementById('perfH2');
    var perfIntro = document.getElementById('perfIntro');
    if (perfH2) perfH2.innerHTML = formatSectionTitleIfAmpersand(perfM.h2 || '');
    if (perfIntro) perfIntro.textContent = perfM.intro || '';
  }

  document.addEventListener('keydown', function (e) {
    var em = document.getElementById('eventModal');
    if (!em || em.style.display === 'none') return;
    if (e.key === 'Escape') {
      closeEventModal();
      return;
    }
    if (e.key !== 'Tab') return;
    var focusables = getFocusable(em);
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  window.togglePastPerfs = function () {};
  window.debugOpenEventModal = debugOpenEventModal;
  window.openEventModal = openEventModal;
  window.closeEventModal = closeEventModal;
  window.printAgenda = printAgenda;
  window.getMpCalendarHighlights = function () {
    var perfs = getPublicPerfs().slice();
    return perfs.filter(function (p) {
      return perfFeaturedVisual(p) || perfFeaturedLayout(p);
    }).map(function (p) {
      return {
        id: String(p.id || ''),
        type: 'event',
        featured_visual: perfFeaturedVisual(p),
        featured_layout: perfFeaturedLayout(p),
        homepage_priority: Number.isFinite(Number(p && p.homepage_priority)) && Number(p.homepage_priority) >= 0 ? Math.floor(Number(p.homepage_priority)) : null,
        featured_contexts: normalizeFeaturedContexts(p.featured_contexts, { media: false, homepage: false, calendar: perfFeaturedVisual(p) }),
        title: resolveEventTitle(p, currentLang),
        sortDate: String(p.sortDate || ''),
        status: String(p.status || '')
      };
    });
  };
  document.addEventListener('DOMContentLoaded', function () {
    var perfList = document.getElementById('perfList');
    if (perfList) {
      perfList.addEventListener('click', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('.perf-more-btn[data-perf-id]') : null;
        if (!btn || !perfList.contains(btn)) return;
        e.preventDefault();
        debugOpenEventModal(e, resolvePerfIdFromButtonValue(btn.getAttribute('data-perf-id')));
      });
    }
    var btn = document.getElementById('pastPerfCollapseBtn');
    if (btn) btn.addEventListener('click', togglePastPublicList);
  });

  window.addEventListener('mp:langchange', function (e) {
    currentLang = (e.detail && e.detail.lang) || 'en';
    console.log('[Calendar] mp:langchange received', { lang: currentLang });
    resolveActiveLang('mp:langchange');
    if (!MP_CAL) return;
    applyPerfHeader();
    renderPerfs();
    ensureLivePerfHeader(currentLang).finally(function () {
      applyPerfHeader();
      renderPerfs();
    });
  });

  window.addEventListener('mp:localesready', function () {
    if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
    resolveActiveLang('mp:localesready');
    if (!MP_CAL) return;
    applyPerfHeader();
    renderPerfs();
    ensureLivePerfHeader(currentLang).finally(function () {
      applyPerfHeader();
      renderPerfs();
    });
  });

  var dataUrl = '/v1-assets/data/calendar-data.json';
  fetch(dataUrl)
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .catch(function () {
      var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
      return {
        perf: {
          h2: mpPick(lang, 'perf.loadFallbackH2', 'Engagements &amp; <em>Concerts</em>'),
          intro: mpPick(lang, 'perf.dataLoadError', 'Calendar data could not be loaded.'),
          eventTypes: {
            opera: 'Opera',
            concert: 'Concert',
            recital: 'Recital',
            show: 'Show',
            gala: 'Gala',
            collaboration: 'Collaboration',
            houseconcert: 'House Concert',
            tango: 'Tango Night',
            other: 'Event',
            operetta: 'Operetta'
          }
        },
        perfs: [],
        pastPerfs: []
      };
    })
    .then(function (payload) {
      MP_CAL = payload;
      MP_CAL.perfs = normalizeRgPerfsList(MP_CAL.perfs);
      loadPastPerfs();
      console.log('[Calendar] Using bundled public calendar payload:', MP_CAL.perfs.length);
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      resolveActiveLang('initial-load');
      applyPerfHeader();
      renderPerfs();
      Promise.all([ensureLivePerfHeader(currentLang), loadLiveCalendarLists()]).finally(function () {
        loadPastPerfs();
        applyPerfHeader();
        renderPerfs();
        renderPastPerformancesPublic();
      });
    });
})();
