/**
 * Public-safe home hero runtime.
 * The public site must render from bundled locale strings and /v1-assets/data/hero-config.json,
 * with optional explicit public-safe Firestore overrides.
 * Legacy admin/local overrides remain intentionally disabled here.
 */
(function () {
  /** Avoid loading bundled intro portrait before admin/config resolution runs. */
  var INTRO_PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  /** Hero background: /v1-assets/data/hero-config.json (npm run build:hero-config -- <export.json>). */
  var HERO_EN_FALLBACK = {
    'hero.eyebrow': 'LYRIC TENOR · OPERA · RECITAL · CONCERT',
    'hero.subtitle': 'Argentine-Italian lyric tenor based in Berlin',
    'hero.cta1': 'WATCH & LISTEN',
    'hero.ctaBio': 'BIOGRAPHY',
    'hero.cta2': 'CALENDAR',
    'hero.cta3': 'BOOK NOW',
    'hero.nameHtml': 'Rolando<br><em>Guy</em>'
  };
  var LAST_HERO_IMAGE = '';
  var HERO_SOURCE_LOGGED = false;
  var HOME_BIO_DATA = null;
  var HOME_BIO_LOAD_ATTEMPTED = false;
  var HOME_BIO_LOAD_PROMISE = null;
  var HOME_BIO_DEFAULTS = null;
  var HOME_BIO_RENDER_SEQ = 0;
  function normalizeLangCode(v) {
    var s = String(v || '').trim().toLowerCase();
    return /^(en|de|es|it|fr)$/.test(s) ? s : '';
  }
  function resolveHeroLang(preferred) {
    var fromArg = normalizeLangCode(preferred);
    var fromDoc = normalizeLangCode(document && document.documentElement ? document.documentElement.lang : '');
    var fromShell = (window.getMpSiteLang && normalizeLangCode(window.getMpSiteLang())) || '';
    return fromArg || fromDoc || fromShell || 'en';
  }
  function getHomeBiographyEls() {
    var root = document.getElementById('intro');
    if (!root) return null;
    return {
      h2: root.querySelector('[data-i18n-html="home.intro.h2"]'),
      p1: root.querySelector('[data-i18n-html="home.intro.p1"]'),
      p2: root.querySelector('[data-i18n-html="home.intro.p2"]')
    };
  }
  function getHomeBiographyDefaults() {
    if (HOME_BIO_DEFAULTS) return HOME_BIO_DEFAULTS;
    var els = getHomeBiographyEls();
    HOME_BIO_DEFAULTS = {
      h2: els && els.h2 ? els.h2.innerHTML : '',
      p1: els && els.p1 ? els.p1.textContent : '',
      p2: els && els.p2 ? els.p2.textContent : ''
    };
    return HOME_BIO_DEFAULTS;
  }
  function ensureHomeBiographyData() {
    if (HOME_BIO_LOAD_ATTEMPTED) return Promise.resolve(HOME_BIO_DATA);
    if (HOME_BIO_LOAD_PROMISE) return HOME_BIO_LOAD_PROMISE;
    HOME_BIO_LOAD_PROMISE = fetch('/v1-assets/data/biography-data.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (data) {
        HOME_BIO_LOAD_ATTEMPTED = true;
        HOME_BIO_DATA = data && data.locales && typeof data.locales === 'object' ? data : null;
        return HOME_BIO_DATA;
      })
      .catch(function () {
        HOME_BIO_LOAD_ATTEMPTED = true;
        HOME_BIO_DATA = null;
        return null;
      })
      .finally(function () {
        HOME_BIO_LOAD_PROMISE = null;
      });
    return HOME_BIO_LOAD_PROMISE;
  }
  function normalizeBiographyParagraphs(doc) {
    if (!doc || !Array.isArray(doc.paragraphs)) return [];
    return doc.paragraphs
      .map(function (value) {
        return String(value == null ? '' : value).trim();
      })
      .filter(Boolean);
  }
  function isUsableHomeBiographyLocale(doc) {
    return !!(doc && typeof doc === 'object' && String(doc.h2 || '').trim() && normalizeBiographyParagraphs(doc).length >= 2);
  }
  function resolveHomeBiographyLocale(currentLang) {
    var locales = HOME_BIO_DATA && HOME_BIO_DATA.locales;
    if (!locales || typeof locales !== 'object') return { resolvedLang: '', doc: null };
    var lang = resolveHeroLang(currentLang);
    if (isUsableHomeBiographyLocale(locales[lang])) return { resolvedLang: lang, doc: locales[lang] };
    if (isUsableHomeBiographyLocale(locales.en)) return { resolvedLang: 'en', doc: locales.en };
    return { resolvedLang: '', doc: null };
  }
  function applyHomeBiographyPreview(lang) {
    var els = getHomeBiographyEls();
    if (!els) return Promise.resolve();
    var defaults = getHomeBiographyDefaults();
    var currentLang = resolveHeroLang(lang);
    var renderSeq = ++HOME_BIO_RENDER_SEQ;
    return ensureHomeBiographyData().then(function () {
      if (renderSeq !== HOME_BIO_RENDER_SEQ) return;
      var resolved = resolveHomeBiographyLocale(currentLang);
      var resolvedLang = resolved.resolvedLang || '';
      var doc = resolved.doc;
      console.log('[home biography]', currentLang, resolvedLang);
      if (!doc) {
        if (els.h2) els.h2.innerHTML = defaults.h2;
        if (els.p1) els.p1.textContent = defaults.p1;
        if (els.p2) els.p2.textContent = defaults.p2;
        return;
      }
      var paragraphs = normalizeBiographyParagraphs(doc);
      if (els.h2) els.h2.innerHTML = String(doc.h2 || '');
      if (els.p1) els.p1.textContent = paragraphs[0] || '';
      if (els.p2) els.p2.textContent = paragraphs[1] || '';
    });
  }
  var LIVE_HERO_DOCS = {};
  var LAST_PROGRAMS_CTA_VISIBILITY_LANG = '';

  function escUrl(u) {
    return String(u).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  function readLegacyRecord(key) {
    return null;
  }
  function readLegacyJson(key) {
    var rec = readLegacyRecord(key);
    return rec ? rec.value : null;
  }
  function readLiveHeroRecord(key) {
    var local = readLegacyRecord(key);
    if (local && local.value && typeof local.value === 'object') return local;
    var v = LIVE_HERO_DOCS[key];
    if (!v || typeof v !== 'object') return null;
    if (v.data && typeof v.data === 'object') return { value: v.data, ts: v.updateTime || 0 };
    return { value: v, ts: 0 };
  }
  function fetchFirestoreDocJson(key) {
    if (typeof window.fetchMpPublicFirestoreDoc !== 'function') return Promise.resolve(null);
    return window.fetchMpPublicFirestoreDoc('public_' + key);
  }
  function ensureLiveHeroDoc(key) {
    if (!key) return Promise.resolve(null);
    if (Object.prototype.hasOwnProperty.call(LIVE_HERO_DOCS, key)) return Promise.resolve(LIVE_HERO_DOCS[key]);
    return fetchFirestoreDocJson(key)
      .then(function (doc) {
        LIVE_HERO_DOCS[key] = doc || null;
        return LIVE_HERO_DOCS[key];
      })
      .catch(function () {
        LIVE_HERO_DOCS[key] = null;
        return null;
      });
  }
  function loadLiveHeroOverrides(lang) {
    var rawLang = String(lang || 'en');
    var shortLang = rawLang.split('-')[0];
    var keys = ['hero_' + rawLang, 'hero_en'];
    if (shortLang && shortLang !== rawLang) keys.push('hero_' + shortLang);
    return Promise.all(keys.map(ensureLiveHeroDoc))
      .then(function () { return true; })
      .catch(function () { return false; });
  }
  function withCacheBuster(url, ts) {
    var s = String(url || '').trim();
    var n = Number(ts) || 0;
    if (!s || !n) return s;
    if (/^(data:|blob:)/i.test(s)) return s;
    if (/[?&]v=\d+/.test(s)) return s;
    return s + (s.indexOf('?') >= 0 ? '&' : '?') + 'v=' + n;
  }
  function getIntroImageOverrideInfo() {
    var rawLang = (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    var shortLang = String(rawLang || 'en').split('-')[0];
    var liveByLangRec = readLiveHeroRecord('hero_' + rawLang);
    var liveByLang = liveByLangRec && liveByLangRec.value;
    if (liveByLang && typeof liveByLang.introImage === 'string' && liveByLang.introImage.trim()) {
      return {
        source: 'firestore:hero_' + rawLang + '.introImage',
        lang: rawLang,
        url: withCacheBuster(normalizeIntroImagePath(liveByLang.introImage), liveByLangRec.ts)
      };
    }
    if (shortLang && shortLang !== rawLang) {
      var liveByShortRec = readLiveHeroRecord('hero_' + shortLang);
      var liveByShort = liveByShortRec && liveByShortRec.value;
      if (liveByShort && typeof liveByShort.introImage === 'string' && liveByShort.introImage.trim()) {
        return {
          source: 'firestore:hero_' + shortLang + '.introImage',
          lang: rawLang,
          url: withCacheBuster(normalizeIntroImagePath(liveByShort.introImage), liveByShortRec.ts)
        };
      }
    }
    var liveByEnRec = readLiveHeroRecord('hero_en');
    var liveByEn = liveByEnRec && liveByEnRec.value;
    if (liveByEn && typeof liveByEn.introImage === 'string' && liveByEn.introImage.trim()) {
      return {
        source: 'firestore:hero_en.introImage',
        lang: rawLang,
        url: withCacheBuster(normalizeIntroImagePath(liveByEn.introImage), liveByEnRec.ts)
      };
    }
    var byLangRec = readLegacyRecord('hero_' + rawLang);
    var byLang = byLangRec && byLangRec.value;
    if (byLang && typeof byLang.introImage === 'string' && byLang.introImage.trim()) {
      return {
        source: 'hero_' + rawLang + '.introImage',
        lang: rawLang,
        url: withCacheBuster(normalizeIntroImagePath(byLang.introImage), byLangRec.ts)
      };
    }
    if (shortLang && shortLang !== rawLang) {
      var byShortRec = readLegacyRecord('hero_' + shortLang);
      var byShort = byShortRec && byShortRec.value;
      if (byShort && typeof byShort.introImage === 'string' && byShort.introImage.trim()) {
        return {
          source: 'hero_' + shortLang + '.introImage',
          lang: rawLang,
          url: withCacheBuster(normalizeIntroImagePath(byShort.introImage), byShortRec.ts)
        };
      }
    }
    var byEnRec = readLegacyRecord('hero_en');
    var byEn = byEnRec && byEnRec.value;
    if (byEn && typeof byEn.introImage === 'string' && byEn.introImage.trim()) {
      return {
        source: 'hero_en.introImage',
        lang: rawLang,
        url: withCacheBuster(normalizeIntroImagePath(byEn.introImage), byEnRec.ts)
      };
    }
    return null;
  }
  function resolveIntroImage(cfgImageOrFallback) {
    var override = getIntroImageOverrideInfo();
    if (override && override.url) {
      return override.url;
    }
    return normalizeIntroImagePath(cfgImageOrFallback);
  }
  function applyIntroPhotoSource(introPhoto, cfgImageOrFallback, options) {
    if (!introPhoto) return;
    options = options || {};
    var onlyOverride = !!options.onlyOverride;
    if (!introPhoto.dataset.baseSrcset) {
      introPhoto.dataset.baseSrcset =
        introPhoto.getAttribute('data-intro-srcset') || introPhoto.getAttribute('srcset') || '';
    }
    if (!introPhoto.dataset.baseSizes) {
      introPhoto.dataset.baseSizes =
        introPhoto.getAttribute('data-intro-sizes') || introPhoto.getAttribute('sizes') || '';
    }
    var override = getIntroImageOverrideInfo();
    if (override && override.url) {
      // If a language-specific intro portrait exists, force that exact file.
      // Keeping srcset would make browsers keep using hero responsive candidates.
      introPhoto.removeAttribute('srcset');
      introPhoto.removeAttribute('sizes');
      introPhoto.src = override.url;
      return;
    }
    if (onlyOverride) return;
    var fallback = normalizeIntroImagePath(cfgImageOrFallback);
    if (introPhoto.dataset.baseSrcset) introPhoto.setAttribute('srcset', introPhoto.dataset.baseSrcset);
    else introPhoto.removeAttribute('srcset');
    if (introPhoto.dataset.baseSizes) introPhoto.setAttribute('sizes', introPhoto.dataset.baseSizes);
    else introPhoto.removeAttribute('sizes');
    if (fallback) introPhoto.src = fallback;
  }
  function normalizeIntroImagePath(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (/^(data:|https?:\/\/|\/\/|\/|\.\.\/)/i.test(s)) return s;
    if (/^\.\//.test(s)) s = s.slice(2);
    if (/^img\//i.test(s)) return '../' + s;
    return '../' + s;
  }
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function applyHeroNameMarkup(heroName, rawHtml) {
    if (!heroName) return;
    var source = String(rawHtml || '').trim();
    if (!source) return;
    var temp = document.createElement('div');
    temp.innerHTML = source;
    var lastEl = temp.querySelector('em');
    var last = lastEl ? String(lastEl.textContent || '').trim() : '';
    if (lastEl) lastEl.remove();
    var first = String(temp.textContent || '').replace(/\s+/g, ' ').trim();
    if (!first && !last) return;
    if (!last) {
      heroName.textContent = first;
      return;
    }
    heroName.innerHTML =
      '<span class="hero-name-first">' + escapeHtml(first) + '</span>' +
      '<span class="hero-name-last">' + escapeHtml(last) + '</span>';
  }
  function readHeroFieldFromRecord(record, field) {
    var doc = record && record.value;
    var v = doc && doc[field];
    if (typeof v !== 'string') return '';
    v = v.trim();
    return v || '';
  }
  function getHeroTextOverride(field, lang) {
    var info = getHeroTextOverrideInfo(field, lang);
    return info ? info.value : '';
  }
  function getHeroTextOverrideInfo(field, lang) {
    var rawLang = String(lang || 'en');
    var shortLang = rawLang.split('-')[0];
    var liveLang = readHeroFieldFromRecord(readLiveHeroRecord('hero_' + rawLang), field);
    if (liveLang) return { value: liveLang, source: 'firestore:hero_' + rawLang + '.' + field, lang: rawLang };
    if (shortLang && shortLang !== rawLang) {
      var liveShort = readHeroFieldFromRecord(readLiveHeroRecord('hero_' + shortLang), field);
      if (liveShort) return { value: liveShort, source: 'firestore:hero_' + shortLang + '.' + field, lang: rawLang };
    }
    var liveEn = readHeroFieldFromRecord(readLiveHeroRecord('hero_en'), field);
    if (liveEn) return { value: liveEn, source: 'firestore:hero_en.' + field, lang: rawLang };

    var localLang = readHeroFieldFromRecord(readLegacyRecord('hero_' + rawLang), field);
    if (localLang) return { value: localLang, source: 'local:hero_' + rawLang + '.' + field, lang: rawLang };
    if (shortLang && shortLang !== rawLang) {
      var localShort = readHeroFieldFromRecord(readLegacyRecord('hero_' + shortLang), field);
      if (localShort) return { value: localShort, source: 'local:hero_' + shortLang + '.' + field, lang: rawLang };
    }
    var localEn = readHeroFieldFromRecord(readLegacyRecord('hero_en'), field);
    if (localEn) return { value: localEn, source: 'local:hero_en.' + field, lang: rawLang };
    return null;
  }
  function getHeroTextOverrideInfoWithoutEn(field, lang) {
    var rawLang = String(lang || 'en');
    var shortLang = rawLang.split('-')[0];
    var liveLang = readHeroFieldFromRecord(readLiveHeroRecord('hero_' + rawLang), field);
    if (liveLang) return { value: liveLang, source: 'firestore:hero_' + rawLang + '.' + field, lang: rawLang };
    if (shortLang && shortLang !== rawLang) {
      var liveShort = readHeroFieldFromRecord(readLiveHeroRecord('hero_' + shortLang), field);
      if (liveShort) return { value: liveShort, source: 'firestore:hero_' + shortLang + '.' + field, lang: rawLang };
    }
    var localLang = readHeroFieldFromRecord(readLegacyRecord('hero_' + rawLang), field);
    if (localLang) return { value: localLang, source: 'local:hero_' + rawLang + '.' + field, lang: rawLang };
    if (shortLang && shortLang !== rawLang) {
      var localShort = readHeroFieldFromRecord(readLegacyRecord('hero_' + shortLang), field);
      if (localShort) return { value: localShort, source: 'local:hero_' + shortLang + '.' + field, lang: rawLang };
    }
    return null;
  }
  function applyProgramsEntryPointVisibility(lang) {
    var target = document.getElementById('homeIntroCtaPress');
    if (!target) return;
    var L = resolveHeroLang(lang);
    LAST_PROGRAMS_CTA_VISIBILITY_LANG = L;
    if (typeof window.getMpProgramsVisibility !== 'function') {
      target.hidden = false;
      return;
    }
    window.getMpProgramsVisibility(L)
      .then(function (prefs) {
        if (LAST_PROGRAMS_CTA_VISIBILITY_LANG !== L || !target) return;
        target.hidden = !!(prefs && prefs.hideProgramsEntryPoints);
      })
      .catch(function () {
        if (LAST_PROGRAMS_CTA_VISIBILITY_LANG !== L || !target) return;
        target.hidden = false;
      });
  }

  function applyHeroCopy(lang) {
    var pick =
      typeof window.pickMpLocaleString === 'function' ? window.pickMpLocaleString : null;
    var L = resolveHeroLang(lang);
    function val(key) {
      var map = {
        'hero.eyebrow': 'eyebrow',
        'hero.subtitle': 'subtitle',
        'hero.cta1': 'cta1',
        'hero.cta2': 'cta2',
        'hero.cta3': 'cta3'
      };
      var field = map[key];
      var v = pick ? pick(L, key) : null;
      if (v != null && v !== '') return { value: v, source: 'locale:' + key };
      // Fallback to same-language hero_* text only when locale table has no value.
      if (field) {
        var info = getHeroTextOverrideInfoWithoutEn(field, L);
        if (info && info.value) return { value: info.value, source: info.source };
      }
      v = HERO_EN_FALLBACK[key];
      return { value: (v != null ? v : null), source: 'fallback:' + key };
    }
    var eyebrow = document.getElementById('heroEyebrow');
    var heroSubtitle = document.getElementById('heroSubtitle');
    var heroCta1 = document.getElementById('heroCta1');
    var heroCta2 = document.getElementById('heroCta2');
    var heroQuickBio = document.getElementById('heroQuickBio');
    var heroQuickCal = document.getElementById('heroQuickCal');
    var heroCta3 = document.getElementById('heroCta3');
    var homeIntroCtaBio = document.getElementById('homeIntroCtaBio');
    var homeIntroCtaMedia = document.getElementById('homeIntroCtaMedia');
    var homeIntroCtaPress = document.getElementById('homeIntroCtaPress');
    var heroName = document.getElementById('heroName');
    var v;
    var vEyebrow = val('hero.eyebrow');
    if (eyebrow && vEyebrow && vEyebrow.value != null) eyebrow.textContent = vEyebrow.value;
    var vSubtitle = val('hero.subtitle');
    if (heroSubtitle && vSubtitle && vSubtitle.value != null) heroSubtitle.textContent = vSubtitle.value;
    var vCta1 = val('hero.cta1');
    if (heroCta1 && vCta1 && vCta1.value != null) heroCta1.textContent = vCta1.value;
    var vCta2 = val('hero.cta2');
    if (heroCta2 && vCta2 && vCta2.value != null) heroCta2.textContent = vCta2.value;
    var vCta3 = val('hero.cta3');
    if (heroCta3 && vCta3 && vCta3.value != null) heroCta3.textContent = vCta3.value;
    var quickBioInfo = getHeroTextOverrideInfo('quickBioLabel', L);
    if (heroQuickBio) {
      var quickBioFallback = pick ? pick(L, 'hero.ctaBio') : null;
      if (quickBioFallback != null && quickBioFallback !== '') heroQuickBio.textContent = quickBioFallback;
      else if (quickBioInfo && quickBioInfo.value) heroQuickBio.textContent = quickBioInfo.value;
    }
    var quickCalInfo = getHeroTextOverrideInfo('quickCalLabel', L);
    if (heroQuickCal) {
      var quickCalFallback = pick ? pick(L, 'nav.cal') : null;
      if (quickCalFallback != null && quickCalFallback !== '') heroQuickCal.textContent = quickCalFallback;
      else if (quickCalInfo && quickCalInfo.value) heroQuickCal.textContent = quickCalInfo.value;
    }
    var vName = val('hero.nameHtml');
    if (heroName && vName && vName.value != null) applyHeroNameMarkup(heroName, vName.value);
    // Avoid cross-language leak: do not use hero_en override for localized intro CTA labels.
    var introBioInfo = getHeroTextOverrideInfoWithoutEn('introCtaBio', L);
    if (homeIntroCtaBio) {
      var introBioFallback = pick ? pick(L, 'home.intro.ctaBio') : null;
      if (introBioFallback != null && introBioFallback !== '') homeIntroCtaBio.textContent = introBioFallback;
      else if (introBioInfo && introBioInfo.value) homeIntroCtaBio.textContent = introBioInfo.value;
    }
    // Avoid cross-language leak: do not use hero_en override for localized intro CTA labels.
    var introMediaInfo = getHeroTextOverrideInfoWithoutEn('introCtaMedia', L);
    if (homeIntroCtaMedia) {
      var introMediaFallback = pick ? pick(L, 'home.intro.ctaMedia') : null;
      if (introMediaFallback != null && introMediaFallback !== '') homeIntroCtaMedia.textContent = introMediaFallback;
      else if (introMediaInfo && introMediaInfo.value) homeIntroCtaMedia.textContent = introMediaInfo.value;
    }
    var introPressInfo = getHeroTextOverrideInfoWithoutEn('introCtaPress', L);
    if (homeIntroCtaPress) {
      var introPressFallback = pick ? pick(L, 'home.intro.ctaPress') : null;
      if (introPressFallback != null && introPressFallback !== '') homeIntroCtaPress.textContent = introPressFallback;
      else if (introPressInfo && introPressInfo.value) homeIntroCtaPress.textContent = introPressInfo.value;
    }
    applyProgramsEntryPointVisibility(L);
    if (!HERO_SOURCE_LOGGED) {
      HERO_SOURCE_LOGGED = true;
      console.log('[Hero] Runtime source trace', {
        langUsed: L,
        eyebrow: vEyebrow && vEyebrow.source,
        subtitle: vSubtitle && vSubtitle.source,
        cta1: vCta1 && vCta1.source,
        cta2: vCta2 && vCta2.source,
        cta3: vCta3 && vCta3.source,
        quickBio: heroQuickBio ? heroQuickBio.textContent : '',
        quickCal: heroQuickCal ? heroQuickCal.textContent : ''
      });
    }
  }

  function applyHeroConfig(cfg) {
    var hb = document.getElementById('heroBg');
    var hero = document.getElementById('hero');
    var introPhoto = document.querySelector('img.mp-home-hero-asset');
    if (!hb || !cfg) return;
    var img = String(cfg.image || '').trim();
    if (img) {
      LAST_HERO_IMAGE = img;
      if (img === '../img/hero-portrait.webp') {
        hb.style.backgroundImage = "image-set(url('../img/hero-portrait-1280.webp') 1x, url('../img/hero-portrait-1920.webp') 2x, url('../img/hero-portrait.webp') 3x)";
      } else {
        hb.style.backgroundImage = "url('" + escUrl(img) + "')";
      }
      applyIntroPhotoSource(introPhoto, img);
    }
    var cropRaw = String(cfg.cropMode != null ? cfg.cropMode : 'cover').toLowerCase();
    var crop = cropRaw === 'contain' ? 'contain' : 'cover';
    hb.style.backgroundSize = crop;
    hb.setAttribute('data-crop', crop);
    if (hero) hero.setAttribute('data-crop', crop);
    var mq = window.matchMedia('(max-width: 700px)');
    function focal() {
      var f = mq.matches ? cfg.focalMobile : cfg.focalDesktop;
      var pos = f != null && String(f).trim() ? String(f).trim() : '';
      if (pos) {
        hb.style.backgroundPosition = pos;
        if (introPhoto) introPhoto.style.objectPosition = pos;
      }
    }
    focal();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', focal);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(focal);
    }
    var alt = String(cfg.alt || '').trim();
    if (alt) {
      hb.setAttribute('role', 'img');
      hb.setAttribute('aria-label', alt);
    } else {
      hb.removeAttribute('role');
      hb.removeAttribute('aria-label');
    }
  }

  if (!document.getElementById('heroBg')) return;

  function bootHero() {
    var lang = (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    var introPhoto = document.querySelector('img.mp-home-hero-asset');
    if (introPhoto) {
      introPhoto.src = INTRO_PLACEHOLDER_SRC;
      introPhoto.removeAttribute('srcset');
      introPhoto.removeAttribute('sizes');
    }
    loadLiveHeroOverrides(lang).finally(function () {
      applyHeroCopy(lang);
      applyHomeBiographyPreview(lang);
      if (introPhoto) applyIntroPhotoSource(introPhoto, '', { onlyOverride: true });
      fetch('/v1-assets/data/hero-config.json', { cache: 'no-store' })
      .then(function (r) {
        return r.json();
      })
      .then(applyHeroConfig)
      .catch(function () {
        var hb = document.getElementById('heroBg');
        var fallback = '../img/hero-portrait.webp';
        if (hb) hb.style.backgroundImage = "image-set(url('../img/hero-portrait-1280.webp') 1x, url('../img/hero-portrait-1920.webp') 2x, url('../img/hero-portrait.webp') 3x)";
        var introEl = document.querySelector('img.mp-home-hero-asset');
        applyIntroPhotoSource(introEl, fallback);
      });
    });
  }

  window.addEventListener('mp:langchange', function (e) {
    var lang = (e.detail && e.detail.lang) || (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    var introPhoto = document.querySelector('img.mp-home-hero-asset');
    if (introPhoto) {
      introPhoto.src = INTRO_PLACEHOLDER_SRC;
      introPhoto.removeAttribute('srcset');
      introPhoto.removeAttribute('sizes');
    }
    loadLiveHeroOverrides(lang).finally(function () {
      applyHeroCopy(lang);
      applyHomeBiographyPreview(lang);
      if (introPhoto) {
        applyIntroPhotoSource(introPhoto, LAST_HERO_IMAGE || '../img/hero-portrait.webp');
      }
    });
  });

  if (window.MP_LOCALE_TABLE) {
    bootHero();
  } else {
    window.addEventListener('mp:localesready', bootHero, { once: true });
  }

})();
