/* Shared chrome for mp/* pages — load mp-locales.json (npm run build:mp-locales -- [export.json]; npm run build:mp-home -- export.json for hero config + locales). */
(function () {
  'use strict';

  document.documentElement.classList.add('mp-site');

  var MP_LANG_STORAGE = 'mp_site_lang';
  var MP_LANG_LIST = ['en', 'de', 'es', 'it', 'fr'];
  var MP_LOCALES_URL = '/v1-assets/data/mp-locales.json';
  var MP_FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var MP_UI_OVERRIDES = {};
  var MP_UI_PROMISES = {};
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
    var d = MP_UI_OVERRIDES[L];
    if (d && typeof d[key] === 'string' && d[key].trim()) return d[key];
    if (L !== 'en') {
      var en = MP_UI_OVERRIDES.en;
      if (en && typeof en[key] === 'string' && en[key].trim()) return en[key];
    }
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
    if (!window.MP_LOCALE_TABLE) return;
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
    ensureUiOverrideFor(lang).finally(function () {
      applyChromeI18n(lang);
      dispatchLang(lang);
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
    Promise.all([ensureUiOverrideFor('en'), ensureUiOverrideFor(lang)]).finally(function () {
      applyChromeI18n(lang);
      window.dispatchEvent(
        new CustomEvent('mp:localesready', { detail: { lang: lang } })
      );
      dispatchLang(lang);
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
  hb.classList.toggle('open');
  mm.classList.toggle('open');
  document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  var hb = document.getElementById('hamburger');
  var mm = document.getElementById('mobileMenu');
  if (hb) hb.classList.remove('open');
  if (mm) mm.classList.remove('open');
  document.body.style.overflow = '';
}

(function () {
  var cur = document.getElementById('cursor');
  var ring = document.getElementById('cursorRing');
  if (!cur || !ring) return;
  var mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.photo-item,.video-card,.mp-soc').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cur.style.width = '20px';
      cur.style.height = '20px';
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(212,168,67,.8)';
    });
    el.addEventListener('mouseleave', function () {
      cur.style.cssText = '';
      ring.style.cssText = '';
    });
  });
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
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

window.addEventListener('scroll', function () {
  var bg = document.getElementById('heroBg');
  if (!bg) return;
  if (window.scrollY < window.innerHeight) {
    bg.style.transform = 'translateY(' + window.scrollY * 0.3 + 'px)';
  }
}, { passive: true });
