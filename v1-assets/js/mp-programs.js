/**
 * Programs section for mp/repertoire.html.
 * Source: /v1-assets/data/programs-data.json (derived from v1 LANG_CONTENT/DEFAULTS programs payload).
 */
(function () {
  'use strict';

  var MP_PROGRAMS = null;
  var currentLang = 'en';
  var FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var PROGRAMS_DOCS = {};
  var PROGRAMS_DOC_PROMISES = {};
  var EDITORIAL_DOCS = {};
  var EDITORIAL_DOC_PROMISES = {};

  var UI = {
    en: { sectionTag: 'Programs', formations: 'Format', duration: 'Duration', idealFor: 'Ideal for' },
    de: { sectionTag: 'Programme', formations: 'Besetzung', duration: 'Dauer', idealFor: 'Geeignet für' },
    es: { sectionTag: 'Programas', formations: 'Formato', duration: 'Duración', idealFor: 'Ideal para' },
    it: { sectionTag: 'Programmi', formations: 'Formazione', duration: 'Durata', idealFor: 'Ideale per' },
    fr: { sectionTag: 'Programmes', formations: 'Format', duration: 'Durée', idealFor: 'Idéal pour' }
  };

  function t(lang) {
    return UI[lang] || UI.en;
  }

  function safeString(v) {
    return typeof v === 'string' ? v : (v == null ? '' : String(v));
  }

  function isObject(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
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
    var url = 'https://firestore.googleapis.com/v1/projects/' + FIRESTORE_PROJECT_ID + '/databases/(default)/documents/rg/' + encodeURIComponent(key);
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

  function ensureDocCached(cache, promises, key) {
    if (cache[key]) return Promise.resolve(cache[key]);
    if (promises[key]) return promises[key];
    promises[key] = fetchFirestoreDocJson(key)
      .then(function (doc) {
        var best = (doc && typeof doc === 'object') ? doc : readLegacyJson(key);
        cache[key] = (best && typeof best === 'object') ? best : null;
        return cache[key];
      })
      .catch(function () {
        var best = readLegacyJson(key);
        cache[key] = (best && typeof best === 'object') ? best : null;
        return cache[key];
      })
      .finally(function () {
        delete promises[key];
      });
    return promises[key];
  }

  function ensureProgramsDoc(key) {
    return ensureDocCached(PROGRAMS_DOCS, PROGRAMS_DOC_PROMISES, key);
  }

  function ensureEditorialDoc(key) {
    return ensureDocCached(EDITORIAL_DOCS, EDITORIAL_DOC_PROMISES, key);
  }

  function loadLiveProgramsOverrides(lang) {
    var L = String(lang || 'en').toLowerCase();
    var keys = ['rg_programs_' + L, 'rg_programs_en'];
    if (L === 'en') keys.push('rg_programs');
    return Promise.all(keys.map(ensureProgramsDoc));
  }

  function loadEditorialOverrides(lang) {
    var L = String(lang || 'en').toLowerCase();
    return Promise.all(['rg_editorial_' + L, 'rg_editorial_en'].map(ensureEditorialDoc));
  }

  function getProgramsPayloadInfo(lang) {
    var l = (lang || 'en').toLowerCase();
    var baseLang = MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales[l] ? clone(MP_PROGRAMS.locales[l]) : null;
    var baseEn = MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales.en ? clone(MP_PROGRAMS.locales.en) : null;
    var base = baseLang || baseEn;
    if (!base) return { data: null, source: 'none', fallback: true };

    var byLangKey = 'rg_programs_' + l;
    var byEnKey = 'rg_programs_en';
    var byLegacyEnKey = 'rg_programs';
    var langDoc = PROGRAMS_DOCS[byLangKey];
    var enDoc = PROGRAMS_DOCS[byEnKey];
    var legacyEnDoc = PROGRAMS_DOCS[byLegacyEnKey];

    var pick = null;
    var source = '';
    var fallback = false;
    if (isObject(langDoc) && Array.isArray(langDoc.programs) && langDoc.programs.length) {
      pick = langDoc;
      source = byLangKey;
    } else if (isObject(enDoc) && Array.isArray(enDoc.programs) && enDoc.programs.length) {
      pick = enDoc;
      source = byEnKey;
      fallback = true;
    } else if (isObject(legacyEnDoc) && Array.isArray(legacyEnDoc.programs) && legacyEnDoc.programs.length) {
      pick = legacyEnDoc;
      source = byLegacyEnKey;
      fallback = true;
    } else if (baseLang) {
      source = 'programs-data.json:' + l;
    } else {
      source = 'programs-data.json:en';
      fallback = l !== 'en';
    }

    var out = clone(base);
    if (pick) {
      if (safeString(pick.title).trim()) out.title = safeString(pick.title);
      if (safeString(pick.subtitle).trim()) out.subtitle = safeString(pick.subtitle);
      if (safeString(pick.intro).trim()) out.intro = safeString(pick.intro);
      if (safeString(pick.closingNote).trim()) out.closingNote = safeString(pick.closingNote);
      if (Array.isArray(pick.programs)) out.items = clone(pick.programs);
    }
    return { data: out, source: source, fallback: fallback };
  }

  function getEditorialProgramsLink(lang) {
    var l = (lang || 'en').toLowerCase();
    var byLang = EDITORIAL_DOCS['rg_editorial_' + l];
    if (isObject(byLang) && safeString(byLang.repProgramsLink).trim()) return safeString(byLang.repProgramsLink);
    var en = EDITORIAL_DOCS['rg_editorial_en'];
    if (isObject(en) && safeString(en.repProgramsLink).trim()) return safeString(en.repProgramsLink);
    return '';
  }


  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderPrograms() {
    var info = getProgramsPayloadInfo(currentLang);
    var data = info && info.data;
    if (!data) return;
    var ui = t(currentLang);

    var sectionTag = document.getElementById('programsSectionTag');
    var h2 = document.getElementById('programsH2');
    var subtitle = document.getElementById('programsSubtitle');
    var bridge = document.getElementById('programsProfileBridge');
    var intro = document.getElementById('programsIntro');
    var grid = document.getElementById('programsGrid');
    var closing = document.getElementById('programsClosing');
    var repLink = document.getElementById('repProgramsLink');

    if (sectionTag) sectionTag.textContent = ui.sectionTag;
    if (h2) h2.innerHTML = String(data.title || '');
    if (subtitle) subtitle.textContent = String(data.subtitle || '');
    if (bridge) {
      var b = String(data.profileBridge || '').trim();
      bridge.textContent = b;
      bridge.hidden = !b;
    }
    if (intro) intro.textContent = String(data.intro || '');
    if (closing) closing.textContent = String(data.closingNote || '');
    if (repLink) {
      var repLinkOverride = getEditorialProgramsLink(currentLang);
      repLink.textContent = String(repLinkOverride || data.linkLabel || repLink.textContent || '');
    }

    if (!grid) return;
    var programs = Array.isArray(data.items) ? data.items : [];
    if (!programs.length) {
      var enInfo = getProgramsPayloadInfo('en');
      var en = enInfo && enInfo.data;
      programs = en && Array.isArray(en.items) ? en.items : [];
      if (info && info.source && info.source.indexOf('rg_programs_') === 0 && !info.fallback) {
        info.fallback = true;
      }
    }
    var visible = programs
      .filter(function (p) { return p && p.published !== false; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    if (!visible.length) {
      grid.innerHTML = '<div class="rep-empty" role="status">No programmes available.</div>';
      return;
    }

    grid.innerHTML = visible
      .map(function (p) {
        var forms = Array.isArray(p.formations) ? p.formations : [];
        var ideal = Array.isArray(p.idealFor) ? p.idealFor : [];
        return (
          '<article class="program-card reveal visible">' +
          '<h3 class="program-card-title">' + esc(p.title) + '</h3>' +
          '<p class="program-card-desc">' + esc(p.description) + '</p>' +
          '<div class="program-meta">' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.formations) + '</div><div class="program-meta-value"><ul>' +
          forms.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') +
          '</ul></div></div>' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.duration) + '</div><div class="program-meta-value">' + esc(p.duration || '') + '</div></div>' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.idealFor) + '</div><div class="program-meta-value"><ul>' +
          ideal.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') +
          '</ul></div></div>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');
  }

  window.addEventListener('mp:langchange', function (e) {
    currentLang = (e.detail && e.detail.lang) || 'en';
    Promise.all([loadLiveProgramsOverrides(currentLang), loadEditorialOverrides(currentLang)]).finally(function () {
      if (MP_PROGRAMS) renderPrograms();
    });
  });

  window.addEventListener('mp:localesready', function () {
    if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
    Promise.all([loadLiveProgramsOverrides(currentLang), loadEditorialOverrides(currentLang)]).finally(function () {
      if (MP_PROGRAMS) renderPrograms();
    });
  });

  fetch('/v1-assets/data/programs-data.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(function (data) {
      MP_PROGRAMS = data;
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      Promise.all([loadLiveProgramsOverrides(currentLang), loadEditorialOverrides(currentLang)]).finally(function () {
        renderPrograms();
      });
    })
    .catch(function () {});
})();
