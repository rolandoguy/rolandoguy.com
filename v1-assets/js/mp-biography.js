/**
 * Biography page: visible editorial copy merges the editorial DE source first, then the
 * language bundle, then saved admin overrides. Portrait resolution follows the same DE-first chain.
 */
(function () {
  'use strict';

  var MP_BIO = null;
  var MP_FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var BIO_DOC_CACHE = {};
  var BIO_RENDER_SEQ = 0;
  /** Invisible placeholder so the browser never paints bundled/HTML default portrait before JS resolves the real URL. */
  var PORTRAIT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function readLegacyJson(key) {
    try {
      if (!window.localStorage) return null;
      var parseMaybe = function (raw) {
        if (!raw) return null;
        try {
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
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
  function readLocalUnsyncedJson(key) {
    try {
      if (!window.localStorage) return null;
      var raw = window.localStorage.getItem('rg_local_' + key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.value != null && typeof parsed.value === 'object') {
        return parsed.value;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function getBioPortraitOverride() {
    var lang = currentLang();
    var shortLang = String(lang || 'en').split('-')[0];
    var byLang = readLegacyJson('bio_' + lang);
    if (byLang && typeof byLang.portraitImage === 'string' && byLang.portraitImage.trim()) return byLang.portraitImage.trim();
    if (shortLang && shortLang !== lang) {
      var byShort = readLegacyJson('bio_' + shortLang);
      if (byShort && typeof byShort.portraitImage === 'string' && byShort.portraitImage.trim()) return byShort.portraitImage.trim();
    }
    var de = readLegacyJson('bio_de');
    if (de && typeof de.portraitImage === 'string' && de.portraitImage.trim()) return de.portraitImage.trim();
    var en = readLegacyJson('bio_en');
    if (en && typeof en.portraitImage === 'string' && en.portraitImage.trim()) return en.portraitImage.trim();
    return '';
  }
  function fetchFirestoreDocJsonWithMeta(key) {
    var url =
      'https://firestore.googleapis.com/v1/projects/' +
      MP_FIRESTORE_PROJECT_ID +
      '/databases/(default)/documents/rg/' +
      encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (doc) {
        var v = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
        if (!v || typeof v !== 'string') return null;
        var parsed = null;
        try {
          parsed = JSON.parse(v);
        } catch (e) {
          parsed = null;
        }
        if (!parsed || typeof parsed !== 'object') return null;
        return {
          data: parsed,
          updateTime: String(doc.updateTime || '').trim()
        };
      })
      .catch(function () {
        return null;
      });
  }
  function getBioDocWithFallback(lang) {
    var key = 'bio_' + lang;
    if (BIO_DOC_CACHE[key]) return Promise.resolve(BIO_DOC_CACHE[key]);
    return fetchFirestoreDocJsonWithMeta(key).then(function (live) {
      var localUnsynced = readLocalUnsyncedJson(key);
      if (localUnsynced && typeof localUnsynced === 'object') {
        BIO_DOC_CACHE[key] = { data: localUnsynced, updateTime: '' };
        return BIO_DOC_CACHE[key];
      }
      if (live && live.data) {
        BIO_DOC_CACHE[key] = live;
        return live;
      }
      var local = readLegacyJson(key);
      if (local && typeof local === 'object') {
        BIO_DOC_CACHE[key] = { data: local, updateTime: '' };
        return BIO_DOC_CACHE[key];
      }
      BIO_DOC_CACHE[key] = null;
      return null;
    });
  }
  function appendVersionIfSafe(src, token) {
    var raw = String(src || '').trim();
    if (!raw || !token) return raw;
    if (/^data:/i.test(raw)) return raw;
    try {
      var u = new URL(raw, window.location.href);
      if (u.origin !== window.location.origin) return raw;
      u.searchParams.set('mpv', token);
      return u.toString();
    } catch (e) {
      return raw;
    }
  }
  function normalizePortraitPath(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (/^data:/i.test(s)) return s;
    try {
      return new URL(s, window.location.href).toString();
    } catch (e) {
      return s;
    }
  }
  function resolvePortraitSource() {
    var lang = currentLang();
    var shortLang = String(lang || 'en').split('-')[0];
    var chain = [lang];
    if (shortLang && shortLang !== lang) chain.push(shortLang);
    if (chain.indexOf('de') < 0) chain.push('de');
    if (chain.indexOf('en') < 0) chain.push('en');
    var idx = 0;
    function next() {
      if (idx >= chain.length) return Promise.resolve(null);
      var L = chain[idx++];
      return getBioDocWithFallback(L).then(function (doc) {
        var src = doc && doc.data && typeof doc.data.portraitImage === 'string' ? doc.data.portraitImage.trim() : '';
        if (src) return { src: normalizePortraitPath(src), token: doc.updateTime || '' };
        return next();
      });
    }
    return next().then(function (found) {
      if (found && found.src) return found;
      var bundled = MP_BIO && MP_BIO.portraitImage ? String(MP_BIO.portraitImage).trim() : '';
      if (bundled) return { src: normalizePortraitPath(bundled), token: '' };
      var local = getBioPortraitOverride();
      if (local) return { src: normalizePortraitPath(local), token: '' };
      return { src: '', token: '' };
    });
  }
  function applyPortraitImage(img, rawSrc, token) {
    if (!img) return;
    var nextSrc = appendVersionIfSafe(rawSrc, token);
    if (!nextSrc) {
      img.style.opacity = '1';
      return;
    }
    if (img.dataset.currentSrc === nextSrc) {
      img.style.opacity = '1';
      return;
    }
    img.style.opacity = '0';
    img.addEventListener(
      'load',
      function onLoad() {
        img.style.opacity = '1';
        img.removeEventListener('load', onLoad);
      },
      { once: true }
    );
    img.src = nextSrc;
    img.dataset.currentSrc = nextSrc;
  }

  function normalizeLangCode(v) {
    var s = String(v || '').trim().toLowerCase().slice(0, 2);
    return /^(en|de|es|it|fr)$/.test(s) ? s : '';
  }

  function activeLangFromUi() {
    var btn = document.querySelector('.lang-bar .lang-btn.active[id^="btn-"]');
    if (btn && btn.id) {
      var m = btn.id.match(/^btn-(en|de|es|it|fr)$/);
      if (m) return m[1];
    }
    return '';
  }

  function currentLang() {
    var fromUi = normalizeLangCode(activeLangFromUi());
    var fromDoc = normalizeLangCode(document && document.documentElement ? document.documentElement.lang : '');
    var fromShell = normalizeLangCode(typeof window.getMpSiteLang === 'function' && window.getMpSiteLang());
    return fromUi || fromDoc || fromShell || 'en';
  }

  function pickLocale() {
    var lang = currentLang();
    var L = MP_BIO && MP_BIO.locales;
    if (!L) return null;
    return L[lang] || L.de || L.en || null;
  }

  function firstNonEmpty() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v != null && String(v).trim() !== '') return String(v);
    }
    return '';
  }
  function normalizeComparableText(v) {
    return String(v == null ? '' : v)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-z0-9#]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  function bioSignature(doc) {
    if (!doc || typeof doc !== 'object') return '';
    var parts = [];
    ['introLine', 'h2', 'continueSectionTag', 'continueSub', 'ctaRepertoire', 'ctaMedia', 'ctaContact', 'ctaHomeIntro', 'portraitAlt'].forEach(function (k) {
      if (doc[k] != null && String(doc[k]).trim() !== '') parts.push(normalizeComparableText(doc[k]));
    });
    if (Array.isArray(doc.paragraphs) && doc.paragraphs.length) {
      doc.paragraphs.forEach(function (p) {
        if (p != null && String(p).trim() !== '') parts.push(normalizeComparableText(p));
      });
    } else {
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(function (k) {
        if (doc[k] != null && String(doc[k]).trim() !== '') parts.push(normalizeComparableText(doc[k]));
      });
    }
    return parts.join('|');
  }
  var BIO_COMPARE_KEYS = ['introLine', 'h2', 'continueSectionTag', 'continueSub', 'ctaRepertoire', 'ctaMedia', 'ctaContact', 'ctaHomeIntro', 'portraitAlt', 'quote', 'cite'];
  function bioLocaleSimilarityScore(doc, ref) {
    if (!doc || !ref || typeof doc !== 'object' || typeof ref !== 'object') return 0;
    var score = 0;
    BIO_COMPARE_KEYS.forEach(function (k) {
      var a = normalizeComparableText(doc[k]);
      var b = normalizeComparableText(ref[k]);
      if (a && b && a === b) score += 1;
    });
    var docParas = normalizeParagraphsFromDoc(doc);
    var refParas = normalizeParagraphsFromDoc(ref);
    var max = Math.max(docParas.length, refParas.length);
    for (var i = 0; i < max; i += 1) {
      var pa = normalizeComparableText(docParas[i]);
      var pb = normalizeComparableText(refParas[i]);
      if (pa && pb && pa === pb) score += 1;
    }
    return score;
  }
  function detectBiographyLocaleMatch(doc) {
    var sig = bioSignature(doc);
    if (!sig || !MP_BIO || !MP_BIO.locales) return '';
    var out = '';
    Object.keys(MP_BIO.locales).some(function (lang) {
      var candidate = MP_BIO.locales[lang];
      if (!candidate || typeof candidate !== 'object') return false;
      if (bioSignature(candidate) === sig) {
        out = lang;
        return true;
      }
      return false;
    });
    return out;
  }
  function shouldSuppressBiographyAdminDoc(lang, doc) {
    var L = String(lang || 'en').toLowerCase();
    if (L === 'de' || !doc || typeof doc !== 'object' || !MP_BIO || !MP_BIO.locales) return false;
    var deLocale = MP_BIO.locales.de || MP_BIO.locales.en || null;
    var enLocale = MP_BIO.locales.en || null;
    if (!deLocale || !enLocale) return false;
    var matchedLocale = detectBiographyLocaleMatch(doc);
    if (matchedLocale && matchedLocale !== L) return true;
    var deScore = bioLocaleSimilarityScore(doc, deLocale);
    var englishScore = bioLocaleSimilarityScore(doc, enLocale);
    if (L === 'en') return deScore >= 4 && deScore > englishScore + 1;
    return englishScore >= 4 && englishScore > deScore + 1;
  }

  function normalizeParagraphsFromDoc(doc) {
    if (!doc || typeof doc !== 'object') return [];
    if (Array.isArray(doc.paragraphs) && doc.paragraphs.length) {
      return doc.paragraphs
        .map(function (x) {
          return String(x == null ? '' : x).trim();
        })
        .filter(Boolean);
    }
    var out = [];
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(function (k) {
      var s = doc[k];
      if (s != null && String(s).trim() !== '') out.push(String(s).trim());
    });
    return out;
  }

  function mergeBioDisplay(canonicalLocale, bundleLocale, adminDoc) {
    var c = canonicalLocale && typeof canonicalLocale === 'object' ? canonicalLocale : {};
    var b = bundleLocale && typeof bundleLocale === 'object' ? bundleLocale : {};
    var a = adminDoc && typeof adminDoc === 'object' ? adminDoc : {};
    var adminParas = normalizeParagraphsFromDoc(a);
    var bundleParas = Array.isArray(b.paragraphs)
      ? b.paragraphs
          .map(function (x) {
            return String(x == null ? '' : x).trim();
          })
          .filter(Boolean)
      : [];
    var canonicalParas = Array.isArray(c.paragraphs)
      ? c.paragraphs
          .map(function (x) {
            return String(x == null ? '' : x).trim();
          })
          .filter(Boolean)
      : [];
    var paras = adminParas.length ? adminParas : (bundleParas.length ? bundleParas : canonicalParas);
    return {
      introLine: firstNonEmpty(a.introLine, b.introLine, c.introLine),
      h2: firstNonEmpty(a.h2, b.h2, c.h2),
      paragraphs: paras,
      portraitAlt: firstNonEmpty(a.portraitAlt, b.portraitAlt, c.portraitAlt),
      portraitFit: firstNonEmpty(a.portraitFit, b.portraitFit, c.portraitFit),
      portraitFocus: firstNonEmpty(a.portraitFocus, b.portraitFocus, c.portraitFocus),
      continueSectionTag: firstNonEmpty(a.continueSectionTag, b.continueSectionTag, c.continueSectionTag),
      continueSub: firstNonEmpty(a.continueSub, b.continueSub, c.continueSub),
      ctaRepertoire: firstNonEmpty(a.ctaRepertoire, b.ctaRepertoire, c.ctaRepertoire),
      ctaMedia: firstNonEmpty(a.ctaMedia, b.ctaMedia, c.ctaMedia),
      ctaContact: firstNonEmpty(a.ctaContact, b.ctaContact, c.ctaContact),
      ctaHomeIntro: firstNonEmpty(a.ctaHomeIntro, b.ctaHomeIntro, c.ctaHomeIntro)
    };
  }

  function hasAnyBioBody(merged) {
    return !!(merged.introLine || merged.h2 || (merged.paragraphs && merged.paragraphs.length));
  }

  function normalizeLegacyProgramsCta(value, lang, pick) {
    var raw = safeString(value).trim();
    if (!raw) return '';
    var lower = raw.toLowerCase();
    var legacy = [
      'home',
      'home — introduction',
      'home — einführung',
      'inicio — introducción',
      'home — introduzione',
      'accueil — introduction'
    ];
    if (legacy.indexOf(lower) >= 0) return '';
    var englishBundle = safeString(MP_BIO && MP_BIO.locales && MP_BIO.locales.en && MP_BIO.locales.en.ctaHomeIntro).trim().toLowerCase();
    var localizedBundle = safeString(MP_BIO && MP_BIO.locales && MP_BIO.locales[lang] && MP_BIO.locales[lang].ctaHomeIntro).trim().toLowerCase();
    if (lang !== 'en' && englishBundle && lower === englishBundle && localizedBundle && localizedBundle !== englishBundle) return '';
    if (pick) {
      var navHome = safeString(pick(lang, 'nav.home')).trim().toLowerCase();
      if (navHome && lower === navHome) return '';
      var englishPrograms = safeString(pick('en', 'home.intro.ctaPress')).trim().toLowerCase();
      var localizedPrograms = safeString(pick(lang, 'home.intro.ctaPress')).trim().toLowerCase();
      if (lang !== 'en' && englishPrograms && lower === englishPrograms && localizedPrograms && localizedPrograms !== englishPrograms) return '';
    }
    return raw;
  }

  function defaultProgramsCtaForLang(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var map = {
      en: 'View programmes',
      de: 'Programme ansehen',
      es: 'Ver programas',
      it: 'Vedi i programmi',
      fr: 'Voir les programmes'
    };
    return map[L] || map.en;
  }

  function resolveProgramsCtaLang(explicitLang) {
    var fromArg = normalizeLangCode(explicitLang);
    var fromUi = normalizeLangCode(activeLangFromUi());
    var fromDoc = normalizeLangCode(document && document.documentElement ? document.documentElement.lang : '');
    var fromShell = normalizeLangCode(typeof window.getMpSiteLang === 'function' && window.getMpSiteLang());
    return fromArg || fromUi || fromDoc || fromShell || 'en';
  }

  function applyProgramsEntryPointVisibility(lang, localVisible) {
    var wrap = document.getElementById('bioCtaHomeWrap');
    if (!wrap) return;
    if (!localVisible) {
      wrap.style.display = 'none';
      return;
    }
    if (typeof window.getMpProgramsVisibility !== 'function') {
      wrap.style.display = '';
      return;
    }
    window.getMpProgramsVisibility(lang)
      .then(function (prefs) {
        wrap.style.display = prefs && prefs.hideProgramsEntryPoints ? 'none' : '';
      })
      .catch(function () {
        wrap.style.display = '';
      });
  }

  function applyMergedBioToDom(merged, portraitHint) {
    var intro = document.getElementById('bioIntroLine');
    var h2 = document.getElementById('bio-heading');
    var parasEl = document.getElementById('bioParagraphs');
    var img = document.querySelector('.mp-bio-hero-asset');
    var ctag = document.getElementById('bioContinueTag');
    var csub = document.getElementById('bioContinueSub');
    var ctaRep = document.getElementById('bioCtaRepertoire');
    var ctaMed = document.getElementById('bioCtaMedia');
    var ctaCon = document.getElementById('bioCtaContact');
    var ctaPrograms = document.getElementById('bioCtaHomeIntro');
    var lang = currentLang();
    var pick = typeof window.pickMpLocaleString === 'function' ? window.pickMpLocaleString : null;

    if (img) {
      img.style.opacity = '0';
      img.src = PORTRAIT_PLACEHOLDER;
      delete img.dataset.currentSrc;
      img.dataset.fit = String(merged.portraitFit || '').trim() || 'cover';
      img.style.objectPosition = String(merged.portraitFocus || '').trim() || '';
    }

    if (!hasAnyBioBody(merged)) {
      if (intro) {
        var msg = pick ? pick(lang, 'bio.loadError') : null;
        intro.textContent = msg || 'Biography content could not be loaded.';
      }
      if (h2) h2.innerHTML = '';
      if (parasEl) parasEl.innerHTML = '';
      return;
    }

    if (intro) intro.textContent = merged.introLine || '';
    if (h2) h2.innerHTML = merged.h2 || '';
    if (parasEl) {
      parasEl.innerHTML = '';
      var ps = merged.paragraphs || [];
      var featherIndex = ps.length > 1 ? 1 : (ps.length ? 0 : -1);
      for (var i = 0; i < ps.length; i++) {
        var p = document.createElement('p');
        p.className = 'reveal rd' + (i + 1);
        if (i === featherIndex) p.className += ' bio-feather-anchor';
        p.textContent = ps[i];
        parasEl.appendChild(p);
      }
      try {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) e.target.classList.add('visible');
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        );
        parasEl.querySelectorAll('.reveal').forEach(function (el) {
          obs.observe(el);
        });
      } catch (e) {}
    }

    if (portraitHint && portraitHint.src && img) {
      applyPortraitImage(img, portraitHint.src, portraitHint.token || '');
    }
    resolvePortraitSource().then(function (resolved) {
      var portrait = resolved && resolved.src ? resolved.src : '';
      if (img && portrait) applyPortraitImage(img, portrait, resolved.token || '');
      else if (img && !portrait) img.style.opacity = '1';
    });

    if (typeof window.applyMpChromeI18n === 'function') {
      window.applyMpChromeI18n(lang);
    }
    if (img && merged.portraitAlt) img.setAttribute('alt', merged.portraitAlt);

    if (ctag) ctag.textContent = merged.continueSectionTag || '';
    if (csub) csub.textContent = merged.continueSub || '';
    if (ctaRep) {
      if (merged.ctaRepertoire) ctaRep.textContent = merged.ctaRepertoire;
      else if (pick) {
        var nr = pick(lang, 'nav.rep');
        if (nr != null && String(nr).trim() !== '') ctaRep.textContent = String(nr);
      }
    }
    if (ctaMed) {
      if (merged.ctaMedia) ctaMed.textContent = merged.ctaMedia;
      else if (pick) {
        var nm = pick(lang, 'nav.media');
        if (nm != null && String(nm).trim() !== '') ctaMed.textContent = String(nm);
      }
    }
    if (ctaCon) {
      if (merged.ctaContact) ctaCon.textContent = merged.ctaContact;
      else if (pick) {
        var nb = pick(lang, 'nav.book');
        if (nb != null && String(nb).trim() !== '') ctaCon.textContent = String(nb);
      }
    }
    var labelLang = resolveProgramsCtaLang(lang);
    if (ctaPrograms) {
      ctaPrograms.textContent = defaultProgramsCtaForLang(labelLang);
    }

    var programsWrap = document.getElementById('bioCtaHomeWrap');
    var showPrograms = !!defaultProgramsCtaForLang(labelLang);
    if (programsWrap) {
      programsWrap.style.display = showPrograms ? '' : 'none';
    }
    applyProgramsEntryPointVisibility(labelLang, showPrograms);

    if (typeof window.applyPageHeadFromRgUi === 'function') {
      window.applyPageHeadFromRgUi(lang);
    }
  }

  function renderBioContent() {
    var canonical = MP_BIO && MP_BIO.locales ? MP_BIO.locales.de || MP_BIO.locales.en || null : null;
    var bundle = pickLocale();
    var lang = currentLang();
    var renderSeq = ++BIO_RENDER_SEQ;
    Promise.all([
      getBioDocWithFallback(lang),
      lang === 'de' ? Promise.resolve(null) : getBioDocWithFallback('de')
    ]).then(function (pair) {
      if (renderSeq !== BIO_RENDER_SEQ) return;
      var docWrap = pair[0];
      var deWrap = pair[1];
      var adminDoc = docWrap && docWrap.data && typeof docWrap.data === 'object' ? docWrap.data : {};
      var deDoc = deWrap && deWrap.data && typeof deWrap.data === 'object' ? deWrap.data : {};
      var adminLocaleMatch = detectBiographyLocaleMatch(adminDoc);
      var adminDocForDisplay = adminDoc;
      if ((lang === 'en' && adminLocaleMatch && adminLocaleMatch !== 'en') || shouldSuppressBiographyAdminDoc(lang, adminDoc)) {
        adminDocForDisplay = {};
      }
      var merged = mergeBioDisplay(canonical, bundle, adminDocForDisplay);
      merged.portraitFit = firstNonEmpty(adminDoc.portraitFit, deDoc.portraitFit, merged.portraitFit);
      merged.portraitFocus = firstNonEmpty(adminDoc.portraitFocus, deDoc.portraitFocus, merged.portraitFocus);
      var portraitHint = null;
      var rawPi = adminDoc && typeof adminDoc.portraitImage === 'string' ? adminDoc.portraitImage.trim() : '';
      if (rawPi) {
        portraitHint = {
          src: normalizePortraitPath(rawPi),
          token: docWrap && docWrap.updateTime ? String(docWrap.updateTime).trim() : ''
        };
      }
      applyMergedBioToDom(merged, portraitHint);
    });
  }

  function boot() {
    fetch('/v1-assets/data/biography-data.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(function (data) {
        MP_BIO = data;
        renderBioContent();
      })
      .catch(function () {
        MP_BIO = null;
        renderBioContent();
      });
  }

  window.addEventListener('mp:langchange', function () {
    BIO_DOC_CACHE = {};
    renderBioContent();
  });

  if (window.MP_LOCALE_TABLE) {
    boot();
  } else {
    window.addEventListener('mp:localesready', boot, { once: true });
  }
})();
