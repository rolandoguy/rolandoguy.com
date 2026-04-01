/**
 * Biography page: visible editorial copy merges admin `bio_<lang>` first, then bundled
 * `v1-assets/data/biography-data.json` (build artifact) as fallback. Portrait resolution unchanged.
 */
(function () {
  'use strict';

  var MP_BIO = null;
  var MP_FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var BIO_DOC_CACHE = {};
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

  function getBioPortraitOverride() {
    var lang = currentLang();
    var shortLang = String(lang || 'en').split('-')[0];
    var byLang = readLegacyJson('bio_' + lang);
    if (byLang && typeof byLang.portraitImage === 'string' && byLang.portraitImage.trim()) return byLang.portraitImage.trim();
    if (shortLang && shortLang !== lang) {
      var byShort = readLegacyJson('bio_' + shortLang);
      if (byShort && typeof byShort.portraitImage === 'string' && byShort.portraitImage.trim()) return byShort.portraitImage.trim();
    }
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

  function currentLang() {
    return (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
  }

  function pickLocale() {
    var lang = currentLang();
    var L = MP_BIO && MP_BIO.locales;
    if (!L) return null;
    return L[lang] || L.en || null;
  }

  function firstNonEmpty() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v != null && String(v).trim() !== '') return String(v);
    }
    return '';
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

  function mergeBioDisplay(bundleLocale, adminDoc) {
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
    var paras = adminParas.length ? adminParas : bundleParas;
    return {
      introLine: firstNonEmpty(a.introLine, b.introLine),
      h2: firstNonEmpty(a.h2, b.h2),
      paragraphs: paras,
      portraitAlt: firstNonEmpty(a.portraitAlt, b.portraitAlt),
      continueSectionTag: firstNonEmpty(a.continueSectionTag, b.continueSectionTag),
      continueSub: firstNonEmpty(a.continueSub, b.continueSub),
      ctaRepertoire: firstNonEmpty(a.ctaRepertoire, b.ctaRepertoire),
      ctaMedia: firstNonEmpty(a.ctaMedia, b.ctaMedia),
      ctaContact: firstNonEmpty(a.ctaContact, b.ctaContact),
      ctaHomeIntro: firstNonEmpty(a.ctaHomeIntro, b.ctaHomeIntro)
    };
  }

  function hasAnyBioBody(merged) {
    return !!(merged.introLine || merged.h2 || (merged.paragraphs && merged.paragraphs.length));
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
    var ctaHome = document.getElementById('bioCtaHomeIntro');
    var lang = currentLang();
    var pick = typeof window.pickMpLocaleString === 'function' ? window.pickMpLocaleString : null;

    if (img) {
      img.style.opacity = '0';
      img.src = PORTRAIT_PLACEHOLDER;
      delete img.dataset.currentSrc;
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
      for (var i = 0; i < ps.length; i++) {
        var p = document.createElement('p');
        p.className = 'reveal rd' + (i + 1);
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
    if (ctaRep) ctaRep.textContent = merged.ctaRepertoire || '';
    if (ctaMed) ctaMed.textContent = merged.ctaMedia || '';
    if (ctaCon) {
      if (merged.ctaContact) ctaCon.textContent = merged.ctaContact;
      else if (pick) {
        var nb = pick(lang, 'nav.book');
        if (nb != null && String(nb).trim() !== '') ctaCon.textContent = String(nb);
      }
    }
    if (ctaHome) {
      if (merged.ctaHomeIntro) ctaHome.textContent = merged.ctaHomeIntro;
      else if (pick) {
        var nh = pick(lang, 'nav.home');
        if (nh != null && String(nh).trim() !== '') ctaHome.textContent = String(nh);
      }
    }

    var homeWrap = document.getElementById('bioCtaHomeWrap');
    if (homeWrap) {
      var showHome = !!(merged.ctaHomeIntro || (pick && pick(lang, 'nav.home')));
      homeWrap.style.display = showHome ? '' : 'none';
    }

    if (typeof window.applyPageHeadFromRgUi === 'function') {
      window.applyPageHeadFromRgUi(lang);
    }
  }

  function renderBioContent() {
    var bundle = pickLocale();
    var lang = currentLang();
    getBioDocWithFallback(lang).then(function (docWrap) {
      var adminDoc = docWrap && docWrap.data && typeof docWrap.data === 'object' ? docWrap.data : {};
      var merged = mergeBioDisplay(bundle, adminDoc);
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
