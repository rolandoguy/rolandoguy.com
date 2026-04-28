/**
 * Public-safe programs section for mp/repertoire.html.
 * Source: bundled public JSON with explicit public-safe Firestore docs layered on top.
 * Internal/admin docs must never be read directly here.
 */
(function () {
  'use strict';

  var MP_PROGRAMS = null;
  var currentLang = 'en';
  var PROGRAMS_DOCS = {};
  var PROGRAMS_DOC_PROMISES = {};
  var EDITORIAL_DOCS = {};
  var EDITORIAL_DOC_PROMISES = {};
  var PROGRAMS_SCROLL_RAF = 0;

  var UI = {
    en: { sectionTag: 'Programs', formations: 'Format', duration: 'Duration', idealFor: 'Ideal for' },
    de: { sectionTag: 'Programme', formations: 'Besetzung', duration: 'Dauer', idealFor: 'Geeignet für' },
    es: { sectionTag: 'Programas', formations: 'Formato', duration: 'Duración', idealFor: 'Ideal para' },
    it: { sectionTag: 'Programmi', formations: 'Formazione', duration: 'Durata', idealFor: 'Ideale per' },
    fr: { sectionTag: 'Programmes', formations: 'Format', duration: 'Durée', idealFor: 'Idéal pour' }
  };

  var DURATION_WORDS = {
    en: { or: 'or', to: 'to', minutes: 'minutes' },
    de: { or: 'oder', to: 'bis', minutes: 'Minuten' },
    es: { or: 'o', to: 'a', minutes: 'minutos' },
    it: { or: 'o', to: 'a', minutes: 'minuti' },
    fr: { or: 'ou', to: 'à', minutes: 'minutes' }
  };

  var PROGRAMS_EXPLORE_DEFAULTS = {
    en: 'Discover concert programmes and artistic projects',
    de: 'Entdecken Sie Konzertprogramme und künstlerische Projekte',
    es: 'Descubra programas de concierto y proyectos artísticos',
    it: 'Scopra programmi da concerto e progetti artistici',
    fr: 'Découvrez les programmes de concert et les projets artistiques'
  };

  function t(lang) {
    return UI[lang] || UI.en;
  }

  function lp(lang, key, fb) {
    var p = window.pickMpLocaleString;
    if (p) {
      var v = p(lang, key);
      if (v != null && String(v).trim() !== '') return String(v);
    }
    return fb;
  }

  function safeString(v) {
    return typeof v === 'string' ? v : (v == null ? '' : String(v));
  }

  function durationWords(lang) {
    return DURATION_WORDS[lang] || DURATION_WORDS.en;
  }

  function hasLocalizedDurationWords(raw, lang) {
    var s = safeString(raw).trim().toLowerCase();
    var nums = parseDurationNumbers(s);
    if (!s) return false;
    if (nums.length <= 1) {
      if (lang === 'de') return /\bminuten\b/.test(s);
      if (lang === 'en') return /\bminutes?\b/.test(s);
      if (lang === 'es') return /\bminutos?\b/.test(s);
      if (lang === 'it') return /\bminuti?\b/.test(s);
      if (lang === 'fr') return /\bminutes?\b/.test(s);
    }
    if (lang === 'de') return /\b(oder|bis)\b/.test(s);
    if (lang === 'en') return /\b(or|to)\b/.test(s);
    if (lang === 'es') return /\b(o|a)\b/.test(s);
    if (lang === 'it') return /\b(o|a)\b/.test(s);
    if (lang === 'fr') return /\b(ou|à|a)\b/.test(s);
    return false;
  }

  function formatDurationList(values, lang) {
    var nums = values
      .map(function (n) { return Number(n); })
      .filter(function (n) { return Number.isFinite(n) && n > 0; });
    if (!nums.length) return '';
    var words = durationWords(lang);
    if (nums.length === 1) return String(nums[0]) + ' ' + words.minutes;
    if (nums.length === 2) return String(nums[0]) + ' ' + words.to + ' ' + String(nums[1]) + ' ' + words.minutes;
    return nums.slice(0, -1).join(', ') + ' ' + words.or + ' ' + nums[nums.length - 1] + ' ' + words.minutes;
  }

  function parseDurationNumbers(raw) {
    var matches = safeString(raw).match(/\d+/g) || [];
    return matches.map(function (n) { return Number(n); }).filter(function (n) { return Number.isFinite(n) && n > 0; });
  }

  function resolveStructuredDuration(program, lang) {
    if (!isObject(program)) return '';
    var options = Array.isArray(program.durationOptions)
      ? program.durationOptions
      : Array.isArray(program.durations)
        ? program.durations
        : null;
    if (options && options.length) return formatDurationList(options, lang);
    var min = Number(program.durationMin || program.minDuration || program.durationFrom || 0);
    var max = Number(program.durationMax || program.maxDuration || program.durationTo || 0);
    if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0 && min !== max) {
      return formatDurationList([min, max], lang);
    }
    var single = Number(program.durationMinutes || program.durationMinute || 0);
    if (Number.isFinite(single) && single > 0) return formatDurationList([single], lang);
    return '';
  }

  function resolveDuration(program, lang) {
    var L = /^(en|de|es|it|fr)$/.test(lang) ? lang : 'en';
    var raw = safeString(program && program.duration).trim();
    var structured = resolveStructuredDuration(program, L);
    if (structured && !raw) return structured;
    if (raw && hasLocalizedDurationWords(raw, L)) return raw;
    if (structured) return structured;
    var nums = parseDurationNumbers(raw);
    if (nums.length) return formatDurationList(nums, L);
    return raw;
  }

  function isLikelyGermanProgramsText(raw) {
    var s = safeString(raw).trim().toLowerCase();
    return /\b(entdecken|konzertprogramme|künstlerische|kuenstlerische|und)\b/.test(s);
  }

  function isLegacyProgramsExploreText(raw) {
    var s = safeString(raw).trim().toLowerCase();
    return (
      isLikelyGermanProgramsText(s) ||
      s === 'explore concert programmes and artistic collaborations' ||
      s === 'explora formatos de concierto y colaboraciones artísticas' ||
      s === 'esplora programmi da concerto e collaborazioni artistiche' ||
      s === 'découvrez des programmes de concert et des collaborations artistiques' ||
      s === 'découvrir les programmes de concert et collaborations artistiques'
    );
  }

  function isObject(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function mergeProgramVisualFields(items, sources) {
    if (!Array.isArray(items) || !items.length || !Array.isArray(sources) || !sources.length) return items;
    function keyFor(item, index) {
      if (!item || typeof item !== 'object') return '';
      if (item.id != null && String(item.id).trim() !== '') return 'id:' + String(item.id).trim();
      if (item.order != null && String(item.order).trim() !== '') return 'order:' + String(item.order).trim();
      return 'index:' + index;
    }
    var visuals = {};
    sources.forEach(function (sourceItems) {
      if (!Array.isArray(sourceItems)) return;
      sourceItems.forEach(function (item, index) {
        if (!item || typeof item !== 'object' || !safeString(item.imageUrl).trim()) return;
        var key = keyFor(item, index);
        if (key && !visuals[key]) visuals[key] = item;
      });
    });
    items.forEach(function (item, index) {
      if (!item || typeof item !== 'object' || safeString(item.imageUrl).trim()) return;
      var source = visuals[keyFor(item, index)] || null;
      if (!source && item.order != null) source = visuals['order:' + String(item.order).trim()] || null;
      if (!source && item.id != null) source = visuals['id:' + String(item.id).trim()] || null;
      if (!source) source = visuals['index:' + index] || null;
      if (!source) return;
      ['imageUrl', 'imageFit', 'imagePosition', 'imagePositionManual'].forEach(function (key) {
        if (safeString(item[key]).trim() === '' && safeString(source[key]).trim() !== '') item[key] = source[key];
      });
    });
    return items;
  }

  function readLegacyJson(key) {
    return null;
  }
  function readLocalUnsyncedJson(key) {
    return null;
  }
  function asBooleanFlag(v) {
    if (typeof v === 'boolean') return v;
    if (v == null) return false;
    var s = String(v).trim().toLowerCase();
    if (!s) return false;
    if (s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 'on') return true;
    if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === 'off') return false;
    return !!v;
  }

  function fetchFirestoreDocJson(key) {
    if (typeof window.fetchMpPublicFirestoreDoc !== 'function') return Promise.resolve(null);
    return window.fetchMpPublicFirestoreDoc('public_' + key);
  }

  function ensureDocCached(cache, promises, key) {
    if (!key) return Promise.resolve(null);
    if (Object.prototype.hasOwnProperty.call(cache, key)) return Promise.resolve(cache[key]);
    if (promises[key]) return promises[key];
    promises[key] = fetchFirestoreDocJson(key)
      .then(function (doc) {
        cache[key] = doc && doc.data !== undefined ? doc.data : null;
        return cache[key];
      })
      .catch(function () {
        cache[key] = null;
        return null;
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
    var keys = ['rg_programs_' + L];
    if (L !== 'en') keys.push('rg_programs_en');
    return Promise.all(keys.map(ensureProgramsDoc));
  }

  function loadEditorialOverrides(lang) {
    var L = String(lang || 'en').toLowerCase();
    var keys = ['rg_editorial_' + L, 'rg_editorial_en'];
    keys.forEach(function (key) {
      delete EDITORIAL_DOCS[key];
      delete EDITORIAL_DOC_PROMISES[key];
    });
    return Promise.all(keys.map(ensureEditorialDoc));
  }

  function getProgramsPayloadInfo(lang) {
    var l = (lang || 'en').toLowerCase();
    var baseLang = MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales[l] ? clone(MP_PROGRAMS.locales[l]) : null;
    var base = baseLang;
    if (!base) {
      var baseEn = MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales.en ? clone(MP_PROGRAMS.locales.en) : null;
      base = baseEn;
    }
    if (!base) return { data: null, source: 'none', fallback: true };

    function liveItems(doc) {
      if (!isObject(doc)) return null;
      if (Array.isArray(doc.items)) return doc.items;
      if (Array.isArray(doc.programs)) return doc.programs;
      return null;
    }

    var byLangKey = 'rg_programs_' + l;
    var byEnKey = 'rg_programs_en';
    var langDoc = PROGRAMS_DOCS[byLangKey];
    var enDoc = PROGRAMS_DOCS[byEnKey];
    var enBaseItems = MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales.en && Array.isArray(MP_PROGRAMS.locales.en.items)
      ? MP_PROGRAMS.locales.en.items
      : [];

    var pick = null;
    var source = '';
    var fallback = false;
    if (isObject(langDoc) && liveItems(langDoc) && liveItems(langDoc).length) {
      pick = langDoc;
      source = byLangKey;
    } else if (isObject(enDoc) && liveItems(enDoc) && liveItems(enDoc).length) {
      pick = enDoc;
      source = byEnKey;
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
      if (safeString(pick.profileBridge).trim()) out.profileBridge = safeString(pick.profileBridge);
      if (safeString(pick.linkLabel).trim()) out.linkLabel = safeString(pick.linkLabel);
      if (liveItems(pick)) {
        out.items = clone(liveItems(pick));
        mergeProgramVisualFields(out.items, [liveItems(enDoc), baseLang && baseLang.items, enBaseItems]);
      }
    } else if (Array.isArray(out.items)) {
      mergeProgramVisualFields(out.items, [liveItems(enDoc), enBaseItems]);
    }
    return { data: out, source: source, fallback: fallback };
  }

  function getEditorialProgramsLink(lang) {
    var l = (lang || 'en').toLowerCase();
    var fallback = lp(l, 'rep.programsExplore', PROGRAMS_EXPLORE_DEFAULTS[l] || PROGRAMS_EXPLORE_DEFAULTS.en);
    var byLang = EDITORIAL_DOCS['rg_editorial_' + l];
    if (isObject(byLang) && safeString(byLang.repProgramsLink).trim()) {
      var localLabel = safeString(byLang.repProgramsLink).trim();
      return isLegacyProgramsExploreText(localLabel) ? fallback : localLabel;
    }
    var en = EDITORIAL_DOCS['rg_editorial_en'];
    if (l === 'en' && isObject(en) && safeString(en.repProgramsLink).trim()) {
      var enLabel = safeString(en.repProgramsLink).trim();
      return isLegacyProgramsExploreText(enLabel) ? fallback : enLabel;
    }
    return fallback;
  }

  function isProgramsSectionHidden(lang) {
    var l = (lang || 'en').toLowerCase();
    var byLang = EDITORIAL_DOCS['rg_editorial_' + l];
    var en = EDITORIAL_DOCS['rg_editorial_en'];
    var localFlag = isObject(byLang) && Object.prototype.hasOwnProperty.call(byLang, 'hideProgramsSection')
      ? asBooleanFlag(byLang.hideProgramsSection)
      : false;
    var globalFlag = isObject(en) && Object.prototype.hasOwnProperty.call(en, 'hideProgramsSection')
      ? asBooleanFlag(en.hideProgramsSection)
      : false;
    return !!(localFlag || globalFlag);
  }

  function applyProgramsVisibility() {
    var hide = isProgramsSectionHidden(currentLang);
    var section = document.getElementById('programs');
    if (section) section.hidden = !!hide;
    var repLink = document.getElementById('repProgramsLink');
    var repLinkWrap = repLink && repLink.closest ? repLink.closest('.rep-top-jump') : null;
    if (repLinkWrap) repLinkWrap.hidden = !!hide;
    else if (repLink) repLink.hidden = !!hide;
  }

  function getProgramsAnchorOffset() {
    var offset = 12;
    var nav = document.getElementById('nav');
    var langBar = document.querySelector('.lang-bar');
    if (langBar) offset += Math.ceil(langBar.getBoundingClientRect().height || 0);
    if (nav) offset += Math.ceil(nav.getBoundingClientRect().height || 0);
    return offset;
  }

  function isProgramsHash(hash) {
    var h = String(hash || window.location.hash || '').toLowerCase();
    return h === '#programs' || h === '#programstop';
  }

  function getProgramsScrollTarget() {
    return document.getElementById('programsTop') || document.getElementById('programs');
  }

  function scrollProgramsToTop(force) {
    if (!force && !isProgramsHash()) return;
    var section = document.getElementById('programs');
    if (!section || section.hidden) return;
    var target = getProgramsScrollTarget() || section;
    var top = window.pageYOffset + target.getBoundingClientRect().top - getProgramsAnchorOffset();
    window.scrollTo({
      top: Math.max(0, Math.round(top)),
      behavior: 'auto'
    });
  }

  function scheduleProgramsScroll(force) {
    if (!force && !isProgramsHash()) return;
    if (PROGRAMS_SCROLL_RAF) return;
    PROGRAMS_SCROLL_RAF = window.requestAnimationFrame(function () {
      PROGRAMS_SCROLL_RAF = window.requestAnimationFrame(function () {
        PROGRAMS_SCROLL_RAF = 0;
        scrollProgramsToTop(force);
      });
    });
  }


  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }

  function resolveImageObjectFit(value) {
    return window.RGImageCrop ? window.RGImageCrop.normalizeImageFit(value) : (safeString(value).trim().toLowerCase() === 'contain' ? 'contain' : 'cover');
  }

  function normalizeImageObjectPosition(value) {
    if (window.RGImageCrop) return window.RGImageCrop.normalizeImagePosition(value);
    return safeString(value).trim().replace(/\s+/g, ' ') || 'center center';
  }

  function resolveImageObjectPosition(manual, preset) {
    return window.RGImageCrop ? window.RGImageCrop.resolveImagePosition(manual, preset, 'center center') : (normalizeImageObjectPosition(manual) || normalizeImageObjectPosition(preset) || 'center center');
  }

  function applyImageCrop(el, fit, manualPosition, presetPosition) {
    if (!el) return;
    if (window.RGImageCrop) {
      var crop = window.RGImageCrop.applyObjectImageCrop(el, fit, manualPosition, presetPosition, 'center center');
      if (el.parentNode && el.parentNode.style) {
        el.parentNode.style.setProperty('--program-image-fit', crop.fit);
        el.parentNode.style.setProperty('--program-image-position', crop.position);
      }
      return;
    }
    var resolvedFit = resolveImageObjectFit(fit);
    var resolvedPosition = resolveImageObjectPosition(manualPosition, presetPosition);
    el.style.setProperty('object-fit', resolvedFit, 'important');
    el.style.setProperty('object-position', resolvedPosition, 'important');
    if (el.parentNode && el.parentNode.style) {
      el.parentNode.style.setProperty('--program-image-fit', resolvedFit);
      el.parentNode.style.setProperty('--program-image-position', resolvedPosition);
    }
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

    applyProgramsVisibility();
    if (sectionTag) sectionTag.textContent = lp(currentLang, 'programs.sectionTag', ui.sectionTag);
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
      if (repLinkOverride) {
        repLink.textContent = String(repLinkOverride);
      }
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
      grid.innerHTML =
        '<div class="rep-empty" role="status">' +
        esc(lp(currentLang, 'programs.gridEmpty', 'No programmes available.')) +
        '</div>';
      return;
    }

    grid.innerHTML = visible
      .map(function (p) {
        var forms = Array.isArray(p.formations) ? p.formations : [];
        var ideal = Array.isArray(p.idealFor) ? p.idealFor : [];
        var duration = resolveDuration(p, currentLang);
        var imageUrl = safeString(p.imageUrl).trim();
        var imageHtml = imageUrl
          ? '<figure class="program-card-image"><img src="' + escAttr(imageUrl) + '" alt="' + escAttr(p.imageAlt || p.title || '') + '" data-image-fit="' + escAttr(resolveImageObjectFit(p.imageFit)) + '" data-image-position="' + escAttr(p.imagePosition || '') + '" data-image-position-manual="' + escAttr(p.imagePositionManual || '') + '"></figure>'
          : '';
        return (
          '<article class="program-card' + (imageUrl ? ' program-card--has-image' : '') + ' reveal visible">' +
          '<h3 class="program-card-title">' + esc(p.title) + '</h3>' +
          imageHtml +
          '<p class="program-card-desc">' + esc(p.description) + '</p>' +
          '<div class="program-meta">' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.formations) + '</div><div class="program-meta-value"><ul>' +
          forms.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') +
          '</ul></div></div>' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.duration) + '</div><div class="program-meta-value">' + esc(duration) + '</div></div>' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.idealFor) + '</div><div class="program-meta-value"><ul>' +
          ideal.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') +
          '</ul></div></div>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');
    grid.querySelectorAll('.program-card-image img').forEach(function (img) {
      applyImageCrop(
        img,
        img.getAttribute('data-image-fit'),
        img.getAttribute('data-image-position-manual'),
        img.getAttribute('data-image-position')
      );
    });

    scheduleProgramsScroll();
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
      return Promise.all([loadLiveProgramsOverrides(currentLang), loadEditorialOverrides(currentLang)]).finally(function () {
        renderPrograms();
      });
    })
    .catch(function () {});

  if (isProgramsHash() && 'scrollRestoration' in window.history) {
    try {
      window.history.scrollRestoration = 'manual';
    } catch (e) {}
  }

  window.addEventListener('load', function () {
    scheduleProgramsScroll();
  });

  window.addEventListener('hashchange', function () {
    scheduleProgramsScroll();
  });
})();
