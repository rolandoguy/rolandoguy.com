/* Shared chrome for mp/* pages — load mp-locales.json (npm run build:mp-locales -- [export.json]; npm run build:mp-home -- export.json for hero config + locales). */
(function () {
  'use strict';

  document.documentElement.classList.add('mp-site');
  function markLangReady() {
    document.documentElement.classList.remove('mp-lang-pending');
    document.documentElement.classList.add('mp-lang-ready');
  }

  var MP_LANG_STORAGE = 'mp_site_lang';
  var MP_LANG_LIST = ['en', 'de', 'es', 'it', 'fr'];
  var MP_LOCALES_URL = '/v1-assets/data/mp-locales.json';
  var MP_FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var MP_UI_OVERRIDES = {};
  var MP_UI_PROMISES = {};
  var MP_PRESS_NAV_STATE = { resolved: false, hasQuotes: false };
  var MP_PRESS_NAV_PROMISE = null;
  var MP_LANG_DEBUG = { detected: 'en', source: 'fallback', applied: 'en', persisted: 'no' };

  function normalizeLang(code) {
    var c = String(code || 'en')
      .toLowerCase()
      .slice(0, 2);
    if (MP_LANG_LIST.indexOf(c) === -1) return 'en';
    return c;
  }

  function getStoredMpSiteLang() {
    try {
      var s = localStorage.getItem(MP_LANG_STORAGE);
      if (!s) return '';
      var n = normalizeLang(s);
      return MP_LANG_LIST.indexOf(n) >= 0 ? n : '';
    } catch (e) {
      return '';
    }
  }
  function detectNavigatorLang() {
    var picked = '';
    function consider(raw) {
      if (picked) return;
      var n = normalizeLang(raw);
      if (MP_LANG_LIST.indexOf(n) >= 0) picked = n;
    }
    try {
      if (window.navigator && Array.isArray(window.navigator.languages) && window.navigator.languages.length) {
        window.navigator.languages.forEach(consider);
      }
      if (!picked && window.navigator && window.navigator.language) consider(window.navigator.language);
    } catch (e) {}
    return picked || 'en';
  }
  function resolveInitialLang() {
    var stored = getStoredMpSiteLang();
    if (stored) {
      MP_LANG_DEBUG = { detected: stored, source: 'stored', applied: stored, persisted: 'yes' };
      return { lang: stored, source: 'stored', persisted: true };
    }
    var detected = detectNavigatorLang();
    var source = detected === 'en' ? 'fallback' : 'navigator.languages';
    MP_LANG_DEBUG = { detected: detected, source: source, applied: detected, persisted: 'no' };
    return { lang: detected, source: source, persisted: false };
  }
  function getMpSiteLang() {
    return resolveInitialLang().lang;
  }

  function storeMpSiteLang(code) {
    var lang = normalizeLang(code);
    try {
      localStorage.setItem(MP_LANG_STORAGE, lang);
    } catch (e) {}
    return lang;
  }

  window.getMpSiteLang = getMpSiteLang;
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
  function asVisibleFlag(raw, fb) {
    if (raw === false || raw === 'false' || raw === 0 || raw === '0' || raw === '' || raw == null) return false;
    if (raw === true || raw === 'true' || raw === 1 || raw === '1') return true;
    return fb;
  }
  function normalizePressItemsForNav(raw) {
    var src = raw;
    if (src && typeof src === 'object' && src.value != null) src = src.value;
    if (typeof src === 'string') {
      try { src = JSON.parse(src); } catch (e) { src = null; }
      if (src && typeof src === 'object' && src.value != null) src = src.value;
    }
    if (Array.isArray(src)) return src;
    if (src && typeof src === 'object' && Array.isArray(src.items)) return src.items;
    if (src && typeof src === 'object') {
      var numericKeys = Object.keys(src).filter(function (k) { return /^\d+$/.test(k); }).sort(function (a, b) { return Number(a) - Number(b); });
      if (numericKeys.length) return numericKeys.map(function (k) { return src[k]; });
    }
    return [];
  }
  function computePressNavHasQuotes(pressRaw, metaRaw) {
    var meta = metaRaw && typeof metaRaw === 'object' ? metaRaw : {};
    var showReviews = asVisibleFlag(meta.showReviewsSection, true);
    var items = normalizePressItemsForNav(pressRaw);
    var visibleQuotes = items.filter(function (p) { return asVisibleFlag(p && p.visible, true); });
    return !!(showReviews && visibleQuotes.length > 0);
  }
  function resolveNavEpkLabel(lang) {
    if (!MP_PRESS_NAV_STATE.hasQuotes) return 'Dossier';
    var L = normalizeLang(lang);
    var byLang = {
      en: 'Press & Dossier',
      de: 'Presse & Dossier',
      es: 'Prensa y dossier',
      it: 'Stampa e dossier',
      fr: 'Presse & dossier'
    };
    return byLang[L] || byLang.en;
  }
  function ensurePressNavState() {
    if (MP_PRESS_NAV_STATE.resolved) return Promise.resolve(MP_PRESS_NAV_STATE);
    if (MP_PRESS_NAV_PROMISE) return MP_PRESS_NAV_PROMISE;
    MP_PRESS_NAV_PROMISE = Promise.all([
      fetchFirestoreDocJson('rg_press'),
      fetchFirestoreDocJson('rg_press_meta')
    ])
      .then(function (vals) {
        var press = (vals[0] && typeof vals[0] === 'object') ? vals[0] : readLegacyJson('rg_press');
        var meta = (vals[1] && typeof vals[1] === 'object') ? vals[1] : readLegacyJson('rg_press_meta');
        MP_PRESS_NAV_STATE = {
          resolved: true,
          hasQuotes: computePressNavHasQuotes(press, meta)
        };
        return MP_PRESS_NAV_STATE;
      })
      .catch(function () {
        MP_PRESS_NAV_STATE = {
          resolved: true,
          hasQuotes: computePressNavHasQuotes(readLegacyJson('rg_press'), readLegacyJson('rg_press_meta'))
        };
        return MP_PRESS_NAV_STATE;
      })
      .finally(function () {
        MP_PRESS_NAV_PROMISE = null;
      });
    return MP_PRESS_NAV_PROMISE;
  }
  function ensureUiOverrideFor(lang) {
    var L = normalizeLang(lang);
    if (MP_UI_OVERRIDES[L]) return Promise.resolve(MP_UI_OVERRIDES[L]);
    if (MP_UI_PROMISES[L]) return MP_UI_PROMISES[L];
    var key = 'rg_ui_' + L;
    MP_UI_PROMISES[L] = fetchFirestoreDocJson(key)
      .then(function (doc) {
        var best = (doc && typeof doc === 'object') ? doc : readLegacyJson(key);
        MP_UI_OVERRIDES[L] = (best && typeof best === 'object') ? best : {};
        return MP_UI_OVERRIDES[L];
      })
      .catch(function () {
        var best = readLegacyJson(key);
        MP_UI_OVERRIDES[L] = (best && typeof best === 'object') ? best : {};
        return MP_UI_OVERRIDES[L];
      })
      .finally(function () {
        delete MP_UI_PROMISES[L];
      });
    return MP_UI_PROMISES[L];
  }
  function getUiOverrideString(lang, key) {
    var L = normalizeLang(lang);
    if (key === 'nav.epk') return resolveNavEpkLabel(L);
    var d = MP_UI_OVERRIDES[L];
    if (d && typeof d[key] === 'string' && d[key].trim()) {
      var raw = String(d[key]).trim();
      if (L === 'it' && key === 'nav.media' && raw.toLowerCase() === 'video') return 'Media';
      return raw;
    }
    // Important: do not fall back to EN runtime overrides for non-EN pages.
    // Otherwise localized bundled strings can be shadowed by English snippets.
    return null;
  }

  /**
   * @param {string} lang
   * @param {string} key
   * @returns {string|null}
   */
  function pickLocaleString(lang, key) {
    var ov = getUiOverrideString(lang, key);
    if (ov != null && ov !== '') return String(ov);
    var L = window.MP_LOCALE_TABLE;
    if (!L || !key) return null;
    var t = L[lang] || L.en;
    var t0 = L.en;
    if (!t0) return null;
    var v = t[key];
    if (v != null && v !== '') return String(v);
    v = t0[key];
    if (v != null && v !== '') return String(v);
    return null;
  }

  window.pickMpLocaleString = pickLocaleString;

  function applyChromeI18n(lang) {
    if (window.MP_LOCALE_TABLE) {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (!key) return;
        var val = pickLocaleString(lang, key);
        if (val != null) el.textContent = val;
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        if (!key) return;
        var val = pickLocaleString(lang, key);
        if (val != null) el.innerHTML = val;
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-alt');
        if (!key) return;
        var val = pickLocaleString(lang, key);
        if (val != null) el.setAttribute('alt', val);
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-aria');
        if (!key) return;
        var val = pickLocaleString(lang, key);
        if (val != null) el.setAttribute('aria-label', val);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (!key) return;
        var val = pickLocaleString(lang, key);
        if (val != null) el.setAttribute('placeholder', val);
      });
    }
    applyNavLogoFromRgUi(lang);
    applyPresenterLabelStyle(lang);
    applyPageHeadFromRgUi(lang);
  }

  function applyPresenterLabelStyle(lang) {
    var style = pickLocaleString(lang, 'home.presenter.style');
    var styleKey = String(style || '').trim().toLowerCase();
    var styleClass = '';
    if (styleKey === 'spaced') styleClass = 'presenter-tag-style-spaced';
    else if (styleKey === 'bold') styleClass = 'presenter-tag-style-bold';
    else if (styleKey === 'bold_spaced') styleClass = 'presenter-tag-style-bold-spaced';
    document.querySelectorAll('.presenter-micro-tag').forEach(function (el) {
      el.classList.remove('presenter-tag-style-spaced', 'presenter-tag-style-bold', 'presenter-tag-style-bold-spaced');
      if (styleClass) el.classList.add(styleClass);
    });
  }

  /** Re-apply [data-i18n*] after async page modules finish rendering (e.g. biography body). */
  window.applyMpChromeI18n = function (lang) {
    applyChromeI18n(lang || (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en');
  };

  function applyNavLogoFromRgUi(lang) {
    var v = pickLocaleString(lang, 'nav.logo');
    document.querySelectorAll('a.nav-logo').forEach(function (a) {
      var raw = v != null && String(v).trim() !== '' ? String(v) : a.textContent;
      applyBrandMarkup(a, raw);
    });
    var footerBrand = pickLocaleString(lang, 'footer.brandLine');
    document.querySelectorAll('.footer-logo').forEach(function (el) {
      var raw = footerBrand != null && String(footerBrand).trim() !== '' ? String(footerBrand) : el.textContent;
      applyBrandMarkup(el, raw);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function applyBrandMarkup(el, raw) {
    if (!el) return;
    var text = String(raw || '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    var parts = text.split('·');
    var namePart = String(parts[0] || '').trim();
    var suffixPart = parts.length > 1 ? parts.slice(1).join('·').trim() : '';
    var nameWords = namePart.split(' ').filter(Boolean);
    if (nameWords.length < 2) {
      el.textContent = text;
      return;
    }
    var first = nameWords.slice(0, -1).join(' ');
    var last = nameWords[nameWords.length - 1];
    var html =
      '<span class="brand-first">' + escapeHtml(first) + '</span>' +
      '<span class="brand-last">' + escapeHtml(last) + '</span>';
    if (suffixPart) {
      html += '<span class="brand-suffix">· ' + escapeHtml(suffixPart) + '</span>';
    }
    el.innerHTML = html;
  }

  function pickFirstLocaleString(lang, keys) {
    for (var i = 0; i < keys.length; i++) {
      var v = pickLocaleString(lang, keys[i]);
      if (v != null && String(v).trim() !== '') return String(v).trim();
    }
    return '';
  }

  /** Optional `<head>` / JSON-LD overrides via `rg_ui_*` + bundle (`page.<id>.*` keys). */
  window.applyPageHeadFromRgUi = function (lang) {
    var L = lang || (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
    var page = document.body && document.body.getAttribute('data-mp-page');
    if (!page) return;
    var pfx = 'page.' + page + '.';
    var title = pickFirstLocaleString(L, [pfx + 'title']);
    if (title) document.title = title;
    var desc = pickFirstLocaleString(L, [pfx + 'metaDescription']);
    function setMetaByName(name, content) {
      if (!content) return;
      var el = document.querySelector('meta[name="' + name.replace(/"/g, '') + '"]');
      if (el) el.setAttribute('content', content);
    }
    function setMetaByProp(prop, content) {
      if (!content) return;
      var el = document.querySelector('meta[property="' + prop.replace(/"/g, '') + '"]');
      if (el) el.setAttribute('content', content);
    }
    setMetaByName('description', desc);
    var ogTitle = pickFirstLocaleString(L, [pfx + 'ogTitle', pfx + 'title']);
    var ogDesc = pickFirstLocaleString(L, [pfx + 'ogDescription', pfx + 'metaDescription']);
    setMetaByProp('og:title', ogTitle);
    setMetaByProp('og:description', ogDesc);
    var twTitle = pickFirstLocaleString(L, [pfx + 'twitterTitle', pfx + 'title']);
    var twDesc = pickFirstLocaleString(L, [pfx + 'twitterDescription', pfx + 'metaDescription']);
    setMetaByName('twitter:title', twTitle);
    setMetaByName('twitter:description', twDesc);
    if (page === 'biography') {
      var scripts = document.querySelectorAll('script[type="application/ld+json"][data-mp-person-ld]');
      if (scripts.length) {
        try {
          var raw = scripts[0].textContent || '';
          var j = JSON.parse(raw);
          if (j && typeof j === 'object') {
            var jd = pickFirstLocaleString(L, ['page.biography.jsonLdDescription']);
            var jt = pickFirstLocaleString(L, ['page.biography.jsonLdJobTitle']);
            var jl = pickFirstLocaleString(L, ['page.biography.jsonLdHomeLocation']);
            if (jd) j.description = jd;
            if (jt) j.jobTitle = jt;
            if (jl && j.homeLocation && typeof j.homeLocation === 'object') j.homeLocation.name = jl;
            scripts[0].textContent = JSON.stringify(j);
          }
        } catch (e) {}
      }
    }
  };

  function syncLangButtons(active) {
    var order = MP_LANG_LIST;
    var barBtns = document.querySelectorAll('.site-chrome .lang-bar .lang-btn');
    barBtns.forEach(function (btn, i) {
      var code = order[i];
      if (code) btn.classList.toggle('active', code === active);
    });
    var mobBtns = document.querySelectorAll('.mobile-menu .lang-row button');
    mobBtns.forEach(function (btn, i) {
      var code = order[i];
      if (code) btn.classList.toggle('active', code === active);
    });
    document.querySelectorAll('#btn-en, #btn-de, #btn-es, #btn-it, #btn-fr').forEach(function (btn) {
      var m = btn.id && btn.id.match(/^btn-(en|de|es|it|fr)$/);
      if (m) btn.classList.toggle('active', m[1] === active);
    });
    document.querySelectorAll('#mob-btn-en, #mob-btn-de, #mob-btn-es, #mob-btn-it, #mob-btn-fr').forEach(function (btn) {
      var m = btn.id && btn.id.match(/^mob-btn-(en|de|es|it|fr)$/);
      if (m) btn.classList.toggle('active', m[1] === active);
    });
  }

  function dispatchLang(lang) {
    window.dispatchEvent(new CustomEvent('mp:langchange', { detail: { lang: lang } }));
  }

  window.setLang = function (code, opts) {
    var persist = !opts || opts.persist !== false;
    var lang = persist ? storeMpSiteLang(code) : normalizeLang(code);
    document.documentElement.lang = lang;
    MP_LANG_DEBUG.applied = lang;
    if (persist) {
      MP_LANG_DEBUG.detected = lang;
      MP_LANG_DEBUG.source = 'stored';
      MP_LANG_DEBUG.persisted = 'yes';
    }
    syncLangButtons(lang);
    Promise.all([ensureUiOverrideFor(lang), ensurePressNavState()]).finally(function () {
      applyChromeI18n(lang);
      dispatchLang(lang);
      markLangReady();
    });
  };

  function applyLoadedLocales(data, lang) {
    if (data && data.locales) {
      window.MP_LOCALE_TABLE = data.locales;
    } else {
      window.MP_LOCALE_TABLE = null;
      console.warn('mp-locales.json: missing "locales" object');
    }
    document.documentElement.lang = lang;
    MP_LANG_DEBUG.applied = normalizeLang(lang);
    syncLangButtons(lang);
    Promise.all([ensureUiOverrideFor('en'), ensureUiOverrideFor(lang), ensurePressNavState()]).finally(function () {
      applyChromeI18n(lang);
      window.dispatchEvent(
        new CustomEvent('mp:localesready', { detail: { lang: lang } })
      );
      dispatchLang(lang);
      markLangReady();
    });
  }

  function mpInitLanguage() {
    var initial = resolveInitialLang();
    fetch(MP_LOCALES_URL, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(function (data) {
        applyLoadedLocales(data, initial.lang);
      })
      .catch(function (err) {
        console.warn('mp-locales load failed', err);
        window.MP_LOCALE_TABLE = null;
        var lang = initial.lang;
        document.documentElement.lang = lang;
        MP_LANG_DEBUG.applied = normalizeLang(lang);
        syncLangButtons(lang);
        window.dispatchEvent(
          new CustomEvent('mp:localesready', { detail: { lang: lang, error: true } })
        );
        dispatchLang(lang);
        markLangReady();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mpInitLanguage);
  } else {
    mpInitLanguage();
  }
})();

function toggleMenu() {
  var hb = document.getElementById('hamburger');
  var mm = document.getElementById('mobileMenu');
  if (!hb || !mm) return;
  if (mm.classList.contains('open')) {
    closeMenu();
    return;
  }
  window.__mpLastMenuFocus = document.activeElement;
  hb.classList.add('open');
  hb.setAttribute('aria-expanded', 'true');
  hb.setAttribute('aria-controls', 'mobileMenu');
  mm.classList.add('open');
  mm.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  var first = mm.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
  var shouldAutoFocus = true;
  try {
    shouldAutoFocus = !(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  } catch (e) {}
  if (first && shouldAutoFocus) {
    setTimeout(function () { first.focus(); }, 0);
  }
}

function closeMenu() {
  var hb = document.getElementById('hamburger');
  var mm = document.getElementById('mobileMenu');
  if (hb) hb.classList.remove('open');
  if (hb) hb.setAttribute('aria-expanded', 'false');
  if (hb) hb.setAttribute('aria-controls', 'mobileMenu');
  if (mm) mm.classList.remove('open');
  if (mm) mm.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  var prior = window.__mpLastMenuFocus;
  if (prior && typeof prior.focus === 'function' && document.contains(prior)) {
    prior.focus();
  } else if (hb) {
    hb.focus();
  }
}

(function () {
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
  function syncMobileMenuA11y() {
    var hb = document.getElementById('hamburger');
    var mm = document.getElementById('mobileMenu');
    if (!hb || !mm) return;
    hb.setAttribute('aria-expanded', mm.classList.contains('open') ? 'true' : 'false');
    hb.setAttribute('aria-controls', 'mobileMenu');
    mm.setAttribute('aria-hidden', mm.classList.contains('open') ? 'false' : 'true');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncMobileMenuA11y);
  } else {
    syncMobileMenuA11y();
  }
  document.addEventListener('keydown', function (e) {
    var mm = document.getElementById('mobileMenu');
    var hb = document.getElementById('hamburger');
    if (!mm || !hb || !mm.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    var focusables = getFocusable(mm);
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
})();

function mpPrefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {
    return false;
  }
}

(function () {
  var body = document.body;
  if (!body || !body.hasAttribute('data-mp-page')) return;
  var mediaQuery = null;
  try {
    mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  } catch (e) {
    return;
  }
  if (!mediaQuery) return;

  var dotEl = null;
  var ringEl = null;
  var rafId = 0;
  var enabled = false;
  var targetX = -100;
  var targetY = -100;
  var lastMouseX = -100;
  var lastMouseY = -100;
  var ringX = -100;
  var ringY = -100;
  var ringEasing = mpPrefersReducedMotion() ? 1 : 0.28;
  var interactiveSelector =
    'a, button, .lang-btn, [role="button"], .photo-item, .perf-item, .calendar-event, .mp-soc, .rep-table tbody tr';

  function ensureCursor() {
    if (dotEl && ringEl) return;
    dotEl = document.createElement('div');
    dotEl.className = 'mp-cursor-dot';
    dotEl.setAttribute('aria-hidden', 'true');
    ringEl = document.createElement('div');
    ringEl.className = 'mp-cursor-ring';
    ringEl.setAttribute('aria-hidden', 'true');
    body.appendChild(ringEl);
    body.appendChild(dotEl);
  }

  function isInteractiveTarget(node) {
    return !!(node && node.closest && node.closest(interactiveSelector));
  }

  function syncActiveState(node) {
    body.classList.toggle('mp-cursor-active', isInteractiveTarget(node));
    if (ringEl) ringEl.classList.toggle('mp-cursor-ring-active', isInteractiveTarget(node));
  }

  function renderCursor() {
    rafId = 0;
    if (!dotEl || !ringEl) return;
    ringX += (targetX - ringX) * ringEasing;
    ringY += (targetY - ringY) * ringEasing;
    dotEl.style.setProperty('--mp-cursor-x', targetX + 'px');
    dotEl.style.setProperty('--mp-cursor-y', targetY + 'px');
    ringEl.style.setProperty('--mp-cursor-x', ringX + 'px');
    ringEl.style.setProperty('--mp-cursor-y', ringY + 'px');
    if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
      rafId = window.requestAnimationFrame(renderCursor);
    }
  }

  function queueRender() {
    if (!rafId) rafId = window.requestAnimationFrame(renderCursor);
  }

  function enableCursor() {
    if (enabled || !mediaQuery.matches) return;
    ensureCursor();
    enabled = true;
    body.classList.add('mp-cursor-enabled');
  }

  function disableCursor() {
    enabled = false;
    body.classList.remove('mp-cursor-enabled');
    body.classList.remove('mp-cursor-active');
    if (dotEl && ringEl) {
      dotEl.classList.remove('is-visible');
      ringEl.classList.remove('is-visible');
      ringEl.classList.remove('mp-cursor-ring-active');
      dotEl.style.setProperty('--mp-cursor-x', '-100px');
      dotEl.style.setProperty('--mp-cursor-y', '-100px');
      ringEl.style.setProperty('--mp-cursor-x', '-100px');
      ringEl.style.setProperty('--mp-cursor-y', '-100px');
    }
    targetX = -100;
    targetY = -100;
    lastMouseX = -100;
    lastMouseY = -100;
    ringX = -100;
    ringY = -100;
  }

  document.addEventListener(
    'mousemove',
    function (e) {
      if (!mediaQuery.matches) return;
      enableCursor();
      targetX = e.clientX;
      targetY = e.clientY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      syncActiveState(e.target);
      dotEl.classList.add('is-visible');
      ringEl.classList.add('is-visible');
      queueRender();
    },
    { passive: true }
  );

  document.addEventListener(
    'mouseover',
    function (e) {
      if (!enabled || !dotEl || !ringEl) return;
      syncActiveState(e.target);
    },
    { passive: true }
  );

  document.addEventListener('mouseout', function (e) {
    if (!enabled || !dotEl || !ringEl) return;
    if (e.relatedTarget) return;
    dotEl.classList.remove('is-visible');
    ringEl.classList.remove('is-visible');
    ringEl.classList.remove('mp-cursor-ring-active');
    body.classList.remove('mp-cursor-active');
  });

  window.addEventListener('blur', function () {
    if (!dotEl || !ringEl) return;
    dotEl.classList.remove('is-visible');
    ringEl.classList.remove('is-visible');
    ringEl.classList.remove('mp-cursor-ring-active');
    body.classList.remove('mp-cursor-active');
  });

  var handleModeChange = function () {
    ringEasing = mpPrefersReducedMotion() ? 1 : 0.15;
    if (!mediaQuery.matches) disableCursor();
  };
  if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', handleModeChange);
  else if (typeof mediaQuery.addListener === 'function') mediaQuery.addListener(handleModeChange);

  if ('IntersectionObserver' in window) {
    var featherObserver = new IntersectionObserver(
      function (entries, observer) {
        if (mediaQuery.matches) return;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
          entry.target.classList.remove('is-breathe-mobile');
          void entry.target.offsetWidth;
          entry.target.classList.add('is-breathe-mobile');
          observer.unobserve(entry.target);
        });
      },
      { threshold: [0.5] }
    );

    document.querySelectorAll('.footer-ornament, .footer-feather-sello').forEach(function (ornament) {
      featherObserver.observe(ornament);
    });
  }
})();

(function () {
  var navEl = document.getElementById('nav');
  if (navEl) {
    window.addEventListener(
      'scroll',
      function () {
        navEl.classList.toggle('scrolled', window.scrollY > 60);
      },
      { passive: true }
    );
  }
})();

(function () {
  var obs = new IntersectionObserver(
    function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    obs.observe(el);
  });
})();

document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var sel = a.getAttribute('href');
    if (sel === '#' || sel === '') return;
    var t = document.querySelector(sel);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: mpPrefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  });
});

(function () {
  var btn = document.getElementById('backToTop');
  var target = document.getElementById('hero') || document.getElementById('top');
  if (!btn || !target) return;
  function threshold() {
    return Math.max(320, Math.round(window.innerHeight * 0.35));
  }
  function sync() {
    btn.classList.toggle('is-visible', window.scrollY > threshold());
  }
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  btn.addEventListener('click', function () {
    target.scrollIntoView({ behavior: mpPrefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });
})();

window.addEventListener('scroll', function () {
  var bg = document.getElementById('heroBg');
  if (!bg) return;
  if (window.scrollY < window.innerHeight) {
    bg.style.transform = 'translateY(' + window.scrollY * 0.3 + 'px)';
  }
}, { passive: true });
