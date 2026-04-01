/**
 * v1 performances module for mp/calendar.html — same rendering logic as live index
 * (upcoming by year, past archive by category, modal, print).
 * Data: v1-assets/data/calendar-data.json (generate: node scripts/build-calendar.js <export.json>).
 */
(function () {
  'use strict';

  var MP_CAL = null;
  var pastPublicExpanded = false;
  var currentLang = 'en';
  var MP_PAST_PERFS = [];
  var MP_FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var titleChoiceLogged = false;
  var modalLocaleChoiceLogged = false;
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
  function readLegacyJson(key) {
    try {
      if (!window.localStorage) return null;
      var parseMaybe = function (raw) {
        if (!raw) return null;
        try { return JSON.parse(raw); } catch (e) { return null; }
      };
      var direct = parseMaybe(window.localStorage.getItem(key));
      if (direct != null) {
        if (direct && typeof direct === 'object' && direct.value != null) return direct.value;
        return direct;
      }
      var wrapped = parseMaybe(window.localStorage.getItem('rg_local_' + key));
      if (wrapped && typeof wrapped === 'object' && wrapped.value != null) return wrapped.value;
      return null;
    } catch (e) {
      return null;
    }
  }
  function fetchFirestoreDocJson(key) {
    var url = 'https://firestore.googleapis.com/v1/projects/' + MP_FIRESTORE_PROJECT_ID + '/databases/(default)/documents/rg/' + encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (doc) {
        var v = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
        if (!v || typeof v !== 'string') return null;
        try { return JSON.parse(v); } catch (e) { return null; }
      })
      .catch(function () { return null; });
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
    'perf.maps': 'Maps',
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
    'perf.ticketsInfo': 'Tickets & Info'
  };

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
        other: 'Event'
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
    if (
      lang !== 'en' &&
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
    if (!hadLocH2) {
      var ph2 = mpPick(lang, 'perf.pageH2', '');
      if (ph2 != null && String(ph2).trim() !== '') out.h2 = ph2;
    }
    if (!hadLocIntro) {
      var pint = mpPick(lang, 'perf.pageIntro', '');
      if (pint != null && String(pint).trim() !== '') out.intro = pint;
    }
    return out;
  }

  function getPerfs() {
    return MP_CAL && Array.isArray(MP_CAL.perfs) ? MP_CAL.perfs : [];
  }
  function normalizedEditorialStatus(v) {
    return String(v || '').trim().toLowerCase();
  }
  function isTruthyFlag(v) {
    if (v === true) return true;
    var s = String(v == null ? '' : v).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'on';
  }
  function normalizeRgPerfsItem(raw, idx) {
    var o = raw && typeof raw === 'object' ? raw : {};
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
        if (!month) month = parsed.toLocaleString('en', { month: 'short' }).toUpperCase();
      }
    }
    return {
      id: o.id != null ? o.id : ('perf-' + (idx + 1)),
      title: title,
      detail: detail,
      venue: venue,
      city: city,
      day: day,
      month: month,
      time: time,
      sortDate: sortDate,
      status: status || 'upcoming',
      editorialStatus: editorialStatus,
      type: String(o.type || 'concert').trim().toLowerCase() || 'concert',
      venuePhoto: String(o.venuePhoto || o.image || '').trim(),
      venueOpacity: o.venueOpacity,
      ticketPrice: String(o.ticketPrice || '').trim(),
      eventLink: String(o.eventLink || o.link || '').trim(),
      eventLinkLabel: String(o.eventLinkLabel || o.linkText || '').trim(),
      extDesc: String(o.extDesc || '').trim(),
      modalImg: String(o.modalImg || '').trim(),
      modalImgHide: isTruthyFlag(o.modalImgHide),
      modalEnabled:
        (o.modalEnabled === true || o.modalEnabled === false)
          ? o.modalEnabled
          : (String(o.modalEnabled).trim() === 'true' ? true : (String(o.modalEnabled).trim() === 'false' ? false : null)),
      flyerImg: String(o.flyerImg || '').trim(),
      title_en: o.title_en,
      title_de: o.title_de,
      title_es: o.title_es,
      title_it: o.title_it,
      title_fr: o.title_fr,
      detail_en: o.detail_en,
      detail_de: o.detail_de,
      detail_es: o.detail_es,
      detail_it: o.detail_it,
      detail_fr: o.detail_fr,
      extDesc_en: o.extDesc_en,
      extDesc_de: o.extDesc_de,
      extDesc_es: o.extDesc_es,
      extDesc_it: o.extDesc_it,
      extDesc_fr: o.extDesc_fr,
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
    return fetchFirestoreDocJson('rg_past_perfs')
      .then(function (doc) {
        var best = Array.isArray(doc) ? doc : readLegacyJson('rg_past_perfs');
        MP_PAST_PERFS = normalizePastPublicList(best);
      })
      .catch(function () {
        MP_PAST_PERFS = normalizePastPublicList(readLegacyJson('rg_past_perfs'));
      });
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
      var month = d ? d.toLocaleString('en', { month: 'short' }).toUpperCase() : '';
      var showTime = isGoodPastTimeLabel(p.time);
      var when = day || month
        ? '<div class="perf-date-box"><div class="perf-day">' + escHtml(day) + '</div><div class="perf-month">' + escHtml(month) + '</div>' + (showTime ? '<div class="perf-time">' + escHtml(p.time) + '</div>' : '') + '</div>'
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
      html += when + '<div><div class="perf-badge perf-badge-past">' + (t['perf.pastStamp'] || 'Past') + '</div><div class="perf-info-title">' + escHtml(p.title) + '</div>';
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
    var result = monthStr;
    [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
      'Spring',
      'Summer',
      'Autumn',
      'Fall',
      'Winter'
    ].forEach(function (eng) {
      if (mn[eng]) result = result.replace(new RegExp(eng, 'g'), mn[eng]);
    });
    return result;
  }

  function perfLocaleField(p, base, lang) {
    if (!p) return '';
    var locKey = base + '_' + lang;
    var loc = p[locKey];
    if (loc != null && String(loc).trim() !== '') return String(loc).trim();
    var g = p[base];
    return g != null && String(g).trim() !== '' ? String(g).trim() : '';
  }
  function resolveEventTitle(p, lang) {
    var title = p && p.title != null ? String(p.title).trim() : '';
    var name = p && p.name != null ? String(p.name).trim() : '';
    var localeTitle = p && p['title_' + lang] != null ? String(p['title_' + lang]).trim() : '';
    // Multilingual strategy: keep artistic/project title stable across locales.
    // Localized title fields are only fallback for legacy items missing canonical title.
    var chosen = title || name || localeTitle || '';
    var source = title ? 'title(canonical)' : (name ? 'name(legacy)' : (localeTitle ? 'title_' + lang + '(fallback)' : 'empty'));
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
  function updateUpcomingEventSchema(upcomingList) {
    var prev = document.getElementById('calendar-events-jsonld');
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    if (!Array.isArray(upcomingList) || !upcomingList.length) return;
    var items = [];
    upcomingList.forEach(function (p) {
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
      var ev = {
        '@type': 'MusicEvent',
        name: title,
        startDate: startDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        url: 'https://rolandoguy.com/calendar'
      };
      var venueName = String(p.venue || '').trim();
      var city = String(p.city || '').trim();
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
      if (p.venuePhoto) {
        ev.image = [String(p.venuePhoto).trim()];
      } else {
        ev.image = ['https://rolandoguy.com/og-image.jpg'];
      }
      var ticketUrl = perfLocaleField(p, 'eventLink', currentLang);
      if (ticketUrl && /^https?:\/\//i.test(String(ticketUrl).trim())) {
        ev.offers = {
          '@type': 'Offer',
          url: String(ticketUrl).trim(),
          availability: 'https://schema.org/InStock'
        };
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
      return sortDate(a) - sortDate(b);
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
      var typeLabel = types[p.type] || p.type || types.concert;
      var badge =
        p.status === 'current' && !isPastSection
          ? '<div class="perf-badge">' + typeLabel + '</div>'
          : isPastSection || p.status === 'past' || isArchive
            ? '<div class="perf-badge perf-badge-past">' + typeLabel + '</div>'
            : '<div class="perf-type">' + typeLabel + '</div>';
      var timeHtml = (function () {
        if (!p.time) return '';
        var cleanTime = p.time.replace(/\s*(uhr|h)\s*$/i, '').trim();
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
        return (
          '<div class="perf-time">' +
          (timeFmts[currentLang] || timeFmts.en)(cleanTime) +
          '</div>'
        );
      })();
      var venueShort = compactVenueForCard(p.venue);
      var venueCity = (venueShort || p.city)
        ? '<a href="https://maps.google.com/?q=' +
          encodeURIComponent(p.venue + (p.city ? ' ' + p.city : '')) +
          '" target="_blank" rel="noopener" class="perf-venue-link"><span class="perf-venue-emoji">\ud83d\udccd </span>' +
          venueShort +
          (p.city ? ((venueShort ? ' · ' : '') + p.city) : '') +
          ' <span class="perf-maps-hint">\u2192 ' +
          mapsWord +
          '</span></a>'
        : '';
      var detail = p['detail_' + currentLang] || p.detail || '';
      if (!supportingLocaleChoiceLogged) {
        supportingLocaleChoiceLogged = true;
        var subtitleSource = String(p['detail_' + currentLang] || '').trim() ? ('detail_' + currentLang) : 'detail';
        console.log('[Calendar] Supporting i18n resolution sample', {
          lang: currentLang,
          eventTitle: resolveEventTitle(p, currentLang),
          detail: {
            base: p.detail || '',
            localized: p['detail_' + currentLang] || '',
            chosenCard: detail || '',
            source: subtitleSource
          },
          extDesc: {
            base: p.extDesc || '',
            localized: p['extDesc_' + currentLang] || '',
            chosenModal: perfLocaleField(p, 'extDesc', currentLang) || '',
            source: String(p['extDesc_' + currentLang] || '').trim() ? ('extDesc_' + currentLang) : 'extDesc'
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
      var pastClass = isPastSection || p.status === 'past' ? ' perf-item-past' : '';
      var archiveClass = isArchive ? ' perf-item--archive' : '';
      var venuePhotoResolved = normalizeVenuePhotoUrl(p.venuePhoto);
      var hasVenuePhoto = !!venuePhotoResolved;
      var photoClass = hasVenuePhoto ? ' perf-item-has-photo' : ' perf-item-no-photo';
      var h =
        '<div class="perf-item reveal' +
        (i > 0 ? ' rd' + ((i % 4) + 1) : '') +
        pastClass +
        archiveClass +
        photoClass +
        '">';
      if (isPastSection || p.status === 'past')
        h += '<div class="perf-past-stamp">' + (tPerf['perf.pastStamp'] || 'Past') + '</div>';
      if (hasVenuePhoto) {
        var op = (p.venueOpacity || 50) / 100;
        h +=
          '<div class="perf-venue-bg" style="opacity:' +
          op +
          ';background-image:url(&quot;' +
          String(venuePhotoResolved)
            .replace(/&/g, '&amp;')
            .replace(/\"/g, '&quot;')
            .replace(/</g, '&lt;') +
          '&quot;)"></div>';
      }
      h +=
        '<div class="perf-date-box"><div class="perf-day">' +
        p.day +
        '</div><div class="perf-month">' +
        translateMonth(p.month) +
        '</div>' +
        timeHtml +
        '</div>';
      var listTitle = resolveEventTitle(p, currentLang);
      h +=
        '<div>' +
        badge +
        '<div class="perf-info-title">' +
        listTitle +
        '</div>' +
        (detail ? ('<div class="perf-info-detail">' + detail + '</div>') : '') +
        venueCity +
        '</div>';
      var repLabel = tPerf['perf.repertoireLabel'] || 'Repertoire';
      var printExt = perfLocaleField(p, 'extDesc', currentLang);
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
      var linkForModal = perfLocaleField(p, 'eventLink', currentLang);
      var hasExtra =
        !!printExt ||
        (p.ticketPrice && p.ticketPrice.trim()) ||
        (linkForModal && /^https?:\/\//i.test(String(linkForModal).trim())) ||
        (p.flyerImg && p.flyerImg.trim()) ||
        (p.modalImg && p.modalImg.trim());
      var allowModalButton = (p.modalEnabled === false) ? false : hasExtra;
      if (allowModalButton)
        h +=
          '<button class="perf-more-btn no-print" onclick="event.stopPropagation();openEventModal(' +
          p.id +
          ')">' +
          (tPerf['perf.moreInfo'] || 'More Info') +
          ' \u2192</button>';
      h += '</div>';
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
      html += '<div class="perf-year-label">' + yr + '</div>';
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
          body += '<h2 class="year">' + esc(yr) + '</h2>';
          groups[yr].forEach(function (p) {
            var typeLabel = types[p.type] || p.type || types.other || 'Event';
            var monthStr = monthOut(p.month);
            var yearStr = sortDate(p).getFullYear() > 2090 ? '' : ' ' + String(sortDate(p).getFullYear());
            var dateStr =
              p.day && p.day !== 'TBA'
                ? esc(p.day) + ' ' + esc(monthStr) + esc(yearStr)
                : esc(monthStr + yearStr).trim() || 'TBA';
            var tStr = timeFmt(p.time);
            var when = tStr ? dateStr + ' · ' + esc(tStr) : dateStr;
            var title = resolveEventTitle(p, lang);
            var detail = ((p['detail_' + lang] || p.detail) || '').trim();
            var venueBits = [];
            if ((p.venue || '').trim()) venueBits.push(String(p.venue).trim());
            if ((p.city || '').trim()) venueBits.push(String(p.city).trim());
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
              (moreInfo
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

  function openEventModal(perfId) {
    resolveActiveLang('openEventModal');
    var perfs = getPerfs();
    var p = null;
    for (var i = 0; i < perfs.length; i++) {
      if (perfs[i].id === perfId) {
        p = perfs[i];
        break;
      }
    }
    if (!p) return;
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
    var typeLabel = types[p.type] || p.type || '';
    var detail = p['detail_' + currentLang] || p.detail || '';
    var modalTitle = resolveEventTitle(p, currentLang);
    var venueCity = [p.venue, p.city].filter(Boolean).join(' · ');
    var timeStr = p.time ? ' · ' + p.time : '';

    document.getElementById('emType').textContent = typeLabel;
    document.getElementById('emTitle').textContent = modalTitle;
    document.getElementById('emDate').textContent =
      (p.day || '') + ' ' + (translateMonth(p.month) || '') + timeStr;
    document.getElementById('emVenue').textContent = venueCity;
    var extBody = perfLocaleField(p, 'extDesc', currentLang);
    // Modal body should be language-exclusive, not additive:
    // prefer localized extended text, then shared extended text, then short detail fallback.
    var modalBody = extBody || detail || '';
    document.getElementById('emDetail').textContent = modalBody;

    var imgEl = document.getElementById('emVenueImg');
    var hideModalHero = isTruthyFlag(p.modalImgHide);
    if (hideModalHero) {
      imgEl.style.display = 'none';
    } else {
      var modalSrc =
        p.modalImg && p.modalImg.trim()
          ? p.modalImg
          : p.venuePhoto && p.venuePhoto.trim()
            ? p.venuePhoto
            : '';
      if (modalSrc) {
        imgEl.style.backgroundImage = 'url(' + modalSrc + ')';
        imgEl.style.display = '';
      } else {
        imgEl.style.display = 'none';
      }
    }

    var extEl = document.getElementById('emExtDesc');
    // Keep second paragraph hidden to avoid mixed-language duplicate body blocks.
    extEl.style.display = 'none';

    var priceWrap = document.getElementById('emPrice');
    if (p.ticketPrice && p.ticketPrice.trim()) {
      document.getElementById('emPriceVal').textContent = p.ticketPrice;
      priceWrap.style.display = '';
    } else {
      priceWrap.style.display = 'none';
    }

    var linkEl = document.getElementById('emEventLink');
    var ticketUrl = perfLocaleField(p, 'eventLink', currentLang);
    if (ticketUrl && /^https?:\/\//i.test(String(ticketUrl).trim())) {
      linkEl.href = ticketUrl;
      var t = uiTable(currentLang);
      var legacyEnglish = 'Tickets & Info';
      var storedLabel = perfLocaleField(p, 'eventLinkLabel', currentLang);
      linkEl.textContent =
        storedLabel && storedLabel !== legacyEnglish
          ? storedLabel
          : t['perf.ticketsInfo'] || legacyEnglish;
      linkEl.style.display = '';
    } else {
      linkEl.style.display = 'none';
    }
    if (!modalLocaleChoiceLogged) {
      modalLocaleChoiceLogged = true;
      var detailSource = String(p['detail_' + currentLang] || '').trim() ? ('detail_' + currentLang) : 'detail';
      var extSource = String(p['extDesc_' + currentLang] || '').trim() ? ('extDesc_' + currentLang) : 'extDesc';
      console.log('[Calendar] Modal i18n resolution sample', {
        lang: currentLang,
        eventTitle: modalTitle,
        detail: {
          base: p.detail || '',
          localized: p['detail_' + currentLang] || '',
          chosen: detail || '',
          source: detailSource
        },
        extDesc: {
          base: p.extDesc || '',
          localized: p['extDesc_' + currentLang] || '',
          chosen: modalBody || '',
          source: extSource
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
          chosen: linkEl && linkEl.style.display !== 'none' ? (linkEl.textContent || '') : '',
          source: String(p['eventLinkLabel_' + currentLang] || '').trim() ? ('eventLinkLabel_' + currentLang) : 'eventLinkLabel'
        }
      });
    }

    var flyerEl = document.getElementById('emFlyerImg');
    if (p.flyerImg && p.flyerImg.trim()) {
      flyerEl.src = p.flyerImg;
      flyerEl.alt = modalTitle + ' flyer';
      // When hero image is intentionally hidden, let flyer lead as main visual in content.
      flyerEl.style.maxWidth = hideModalHero ? '100%' : '480px';
      flyerEl.style.display = '';
    } else {
      flyerEl.style.display = 'none';
    }

    var mapsEl = document.getElementById('emMapsLink');
    var destination = String((p.venue || '') + (p.city ? (' ' + p.city) : '')).trim();
    if (destination) {
      mapsEl.href =
        'https://maps.google.com/?q=' +
        encodeURIComponent(destination);
      var t2 = uiTable(currentLang);
      var mapsLabel =
        t2['perf.maps'] ||
        ({ en: 'Maps', de: 'Karten', es: 'Mapas', it: 'Mappa', fr: 'Cartes' }[currentLang] ||
          'Maps');
      mapsEl.innerHTML = '\ud83d\udccd ' + mapsLabel;
      mapsEl.style.display = '';
    } else {
      mapsEl.style.display = 'none';
    }

    document.getElementById('eventModal').style.display = '';
    document.body.style.overflow = 'hidden';
  }

  function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    document.body.style.overflow = '';
  }

  function applyPerfHeader() {
    var perfM = getPerfMerged();
    var perfH2 = document.getElementById('perfH2');
    var perfIntro = document.getElementById('perfIntro');
    if (perfH2) perfH2.innerHTML = formatSectionTitleIfAmpersand(perfM.h2 || '');
    if (perfIntro) perfIntro.textContent = perfM.intro || '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var em = document.getElementById('eventModal');
    if (em && em.style.display !== 'none') closeEventModal();
  });

  window.togglePastPerfs = function () {};
  window.openEventModal = openEventModal;
  window.closeEventModal = closeEventModal;
  window.printAgenda = printAgenda;
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('pastPerfCollapseBtn');
    if (btn) btn.addEventListener('click', togglePastPublicList);
  });

  window.addEventListener('mp:langchange', function (e) {
    currentLang = (e.detail && e.detail.lang) || 'en';
    console.log('[Calendar] mp:langchange received', { lang: currentLang });
    resolveActiveLang('mp:langchange');
    if (MP_CAL) {
      applyPerfHeader();
      renderPerfs();
    }
  });

  window.addEventListener('mp:localesready', function () {
    if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
    resolveActiveLang('mp:localesready');
    if (MP_CAL) {
      applyPerfHeader();
      renderPerfs();
    }
  });

  var dataUrl = '/v1-assets/data/calendar-data.json';
  Promise.all([
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
          perfs: []
        };
      }),
    loadPastPerfs(),
    fetchFirestoreDocJson('rg_perfs')
  ])
    .then(function (parts) {
      MP_CAL = parts[0];
      var rgPerfsLive = parts[2];
      if (Array.isArray(rgPerfsLive)) {
        MP_CAL.perfs = normalizeRgPerfsList(rgPerfsLive);
        console.log('[Calendar] Using live rg_perfs from Firestore:', MP_CAL.perfs.length);
      } else {
        var legacyLocal = readLegacyJson('rg_perfs');
        if (Array.isArray(legacyLocal)) {
          MP_CAL.perfs = normalizeRgPerfsList(legacyLocal);
          console.log('[Calendar] Using local rg_perfs fallback:', MP_CAL.perfs.length);
        } else {
          MP_CAL.perfs = normalizeRgPerfsList(MP_CAL.perfs);
          console.log('[Calendar] Using bundled calendar fallback:', MP_CAL.perfs.length);
        }
      }
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      resolveActiveLang('initial-load');
      applyPerfHeader();
      renderPerfs();
    });
})();
