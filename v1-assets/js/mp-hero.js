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
  var HOME_SAFE_EN = {
    introH2: 'A voice <em>shaped</em><br>by tradition',
    introP1:
      'Argentine-Italian lyric tenor <strong>Rolando Guy</strong> is <strong>Berlin-based</strong> and appears in <strong>opera, concert, recital, operetta, and tango programmes</strong> across Germany and Europe. His profile combines the Italian vocal line, Lied sensitivity, and theatrical clarity for presenter-focused programming contexts.',
    introP2:
      'He collaborates with theatres, orchestras, festivals, and artistic directors for principal roles, gala formats, curated recital evenings, and chamber-scale projects where language, style, and musical reliability are central.',
    introProof:
      'Selected performances, press excerpts, high-resolution photos and downloadable presenter materials are available across Calendar, Media, and Press & materials.',
    presenterTag: 'Selected materials',
    presenterP1: 'Opera, recital, concert, tango, and chamber work.',
    presenterP2: 'Biography, media, and programme materials are available below.',
    presenterP3: 'Enquiries are welcome.',
    introCtaBio: 'Read the full biography',
    introCtaMedia: 'Watch & listen',
    introCtaPress: 'View programmes'
  };
  var GERMAN_LEAK_TOKENS = ['lyrischer', 'argentinisch', 'ansaessig', 'ansässig', 'eine stimme', 'gepraegt', 'geprägt', 'veranstalter'];
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
  function normalizeComparableText(v) {
    return String(v == null ? '' : v)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-z0-9#]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  function hasGermanLeakToken(value) {
    var normalized = normalizeComparableText(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return GERMAN_LEAK_TOKENS.some(function (token) {
      return normalized.indexOf(token) >= 0;
    });
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
  function pickHomeLocaleStringExact(lang, key) {
    if (typeof window.pickMpLocaleString !== 'function') return '';
    var value = window.pickMpLocaleString(lang, key);
    return value == null ? '' : String(value);
  }
  function pickHomeBundledLocaleString(lang, key) {
    var table = window.MP_LOCALE_TABLE;
    var L = normalizeLangCode(lang);
    if (!table || !L || !table[L]) return '';
    var value = table[L][key];
    return value == null ? '' : String(value);
  }
  function pickHomeUiOverrideString(lang, key) {
    if (typeof window.getMpUiOverrideString !== 'function') return '';
    return String(window.getMpUiOverrideString(lang, key) || '');
  }
  function isGermanLeakForEnglish(key, value) {
    var current = normalizeComparableText(value);
    if (!current) return false;
    if (hasGermanLeakToken(value)) return true;
    var deValue = '';
    if (key === 'home.intro.h2') deValue = '<span class="rep-title-stack"><span class="rep-title-line1">Eine Stimme,</span><span class="rep-title-line2">von <em>Tradition geprägt</em></span></span>';
    else deValue = pickHomeLocaleStringExact('de', key);
    var deNorm = normalizeComparableText(deValue);
    return !!(deNorm && current === deNorm);
  }
  function resolveHomeUiString(currentLang, key, safeEnValue) {
    var lang = resolveHeroLang(currentLang);
    var localOverride = pickHomeUiOverrideString(lang, key);
    if (localOverride && normalizeComparableText(localOverride)) {
      return { value: localOverride, resolvedLang: lang, source: 'rg_ui_' + lang };
    }
    var localBundled = pickHomeBundledLocaleString(lang, key);
    if (lang !== 'en' && localBundled && normalizeComparableText(localBundled)) {
      return { value: localBundled, resolvedLang: lang, source: 'mp-locales.json:' + lang };
    }
    if (lang === 'en' && localBundled && !isGermanLeakForEnglish(key, localBundled)) {
      return { value: localBundled, resolvedLang: 'en', source: 'mp-locales.json:en' };
    }
    var enOverride = pickHomeUiOverrideString('en', key);
    if (enOverride && normalizeComparableText(enOverride)) {
      return { value: enOverride, resolvedLang: 'en', source: 'rg_ui_en' };
    }
    var enBundled = pickHomeBundledLocaleString('en', key);
    if (enBundled && !isGermanLeakForEnglish(key, enBundled)) {
      return { value: enBundled, resolvedLang: 'en', source: 'mp-locales.json:en' };
    }
    return { value: String(safeEnValue || ''), resolvedLang: 'en', source: 'safe-en-fallback' };
  }
  function applyHomeIntroCopy(lang) {
    var L = resolveHeroLang(lang);
    var bioEls = getHomeBiographyEls();
    var proof = document.querySelector('[data-i18n="home.intro.proof"]');
    var presenterTag = document.querySelector('[data-i18n="home.presenter.tag"]');
    var presenter1 = document.querySelector('[data-i18n="home.presenter.p1"]');
    var presenter2 = document.querySelector('[data-i18n="home.presenter.p2"]');
    var presenter3 = document.querySelector('[data-i18n="home.presenter.p3"]');
    var introCtaBio = document.getElementById('homeIntroCtaBio');
    var introCtaMedia = document.getElementById('homeIntroCtaMedia');
    var introCtaPress = document.getElementById('homeIntroCtaPress');
    var map = [
      { el: bioEls && bioEls.h2, key: 'home.intro.h2', safe: HOME_SAFE_EN.introH2, html: true },
      { el: bioEls && bioEls.p1, key: 'home.intro.p1', safe: HOME_SAFE_EN.introP1, html: true },
      { el: bioEls && bioEls.p2, key: 'home.intro.p2', safe: HOME_SAFE_EN.introP2, html: false },
      { el: proof, key: 'home.intro.proof', safe: HOME_SAFE_EN.introProof },
      { el: presenterTag, key: 'home.presenter.tag', safe: HOME_SAFE_EN.presenterTag },
      { el: presenter1, key: 'home.presenter.p1', safe: HOME_SAFE_EN.presenterP1 },
      { el: presenter2, key: 'home.presenter.p2', safe: HOME_SAFE_EN.presenterP2 },
      { el: presenter3, key: 'home.presenter.p3', safe: HOME_SAFE_EN.presenterP3 },
      { el: introCtaBio, key: 'home.intro.ctaBio', safe: HOME_SAFE_EN.introCtaBio },
      { el: introCtaMedia, key: 'home.intro.ctaMedia', safe: HOME_SAFE_EN.introCtaMedia },
      { el: introCtaPress, key: 'home.intro.ctaPress', safe: HOME_SAFE_EN.introCtaPress }
    ];
    var introLangUsed = L;
    map.forEach(function (item) {
      if (!item.el) return;
      var resolved = resolveHomeUiString(L, item.key, item.safe);
      introLangUsed = introLangUsed === 'en' || resolved.resolvedLang === L ? resolved.resolvedLang : introLangUsed;
      if (item.html) item.el.innerHTML = resolved.value;
      else item.el.textContent = resolved.value;
      console.log('[home intro field]', item.key, L, resolved.resolvedLang, resolved.source);
    });
    console.log('[home intro]', L, introLangUsed || 'en', 'rg_ui/mp-locales/safe-en-fallback');
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
  function normalizeIntroLayout(raw) {
    var s = String(raw || '').trim().toLowerCase();
    return /^(portrait|landscape|wide)$/.test(s) ? s : '';
  }
  function normalizeIntroFit(raw) {
    var s = String(raw || '').trim().toLowerCase();
    return /^(cover|contain)$/.test(s) ? s : '';
  }
  function normalizeIntroPosition(raw) {
    return String(raw || '').trim().replace(/\s+/g, ' ');
  }
  function getIntroImageSettingsOverrideInfo() {
    var rawLang = (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    var shortLang = String(rawLang || 'en').split('-')[0];
    var docs = [
      readLiveHeroRecord('hero_' + rawLang),
      shortLang && shortLang !== rawLang ? readLiveHeroRecord('hero_' + shortLang) : null,
      readLiveHeroRecord('hero_en'),
      readLegacyRecord('hero_' + rawLang),
      shortLang && shortLang !== rawLang ? readLegacyRecord('hero_' + shortLang) : null,
      readLegacyRecord('hero_en')
    ];
    for (var i = 0; i < docs.length; i += 1) {
      var doc = docs[i] && docs[i].value;
      if (!doc || typeof doc !== 'object') continue;
      var layout = normalizeIntroLayout(doc.homeIntroImageLayout);
      var fit = normalizeIntroFit(doc.homeIntroImageFit);
      var position = normalizeIntroPosition(doc.homeIntroImagePosition);
      if (layout || fit || position) {
        return { layout: layout, fit: fit, position: position };
      }
    }
    return null;
  }
  function applyIntroImageSettings(introPhoto) {
    if (!introPhoto) return;
    var settings = getIntroImageSettingsOverrideInfo();
    var photoBox = introPhoto.closest ? introPhoto.closest('.about-photo') : null;
    var wrap = introPhoto.closest ? introPhoto.closest('.about-photo-wrap') : null;
    [introPhoto, photoBox, wrap].forEach(function (el) {
      if (!el || !el.classList) return;
      el.classList.remove('home-intro-image--portrait', 'home-intro-image--landscape', 'home-intro-image--wide');
    });
    if (!settings) {
      introPhoto.style.removeProperty('object-fit');
      introPhoto.style.removeProperty('object-position');
      return;
    }
    if (settings.layout) {
      [introPhoto, photoBox, wrap].forEach(function (el) {
        if (el && el.classList) el.classList.add('home-intro-image--' + settings.layout);
      });
    }
    if (settings.fit) introPhoto.style.setProperty('object-fit', settings.fit, 'important');
    else introPhoto.style.removeProperty('object-fit');
    if (settings.position) introPhoto.style.setProperty('object-position', settings.position, 'important');
    else introPhoto.style.removeProperty('object-position');
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
    applyIntroImageSettings(introPhoto);
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
    console.log('[home lang]', resolveHeroLang(lang), L);
    function val(key) {
      var map = {
        'hero.eyebrow': 'eyebrow',
        'hero.subtitle': 'subtitle',
        'hero.cta1': 'cta1',
        'hero.cta2': 'cta2',
        'hero.cta3': 'cta3'
      };
      var field = map[key];
      var safe = HERO_EN_FALLBACK[key];
      if (field) {
        var currentInfo = getHeroTextOverrideInfoWithoutEn(field, L);
        if (currentInfo && currentInfo.value && (L !== 'en' || !isGermanLeakForEnglish(key, currentInfo.value))) {
          return { value: currentInfo.value, source: currentInfo.source, langUsed: L };
        }
      }
      var currentLocale = pick ? pick(L, key) : null;
      if (currentLocale != null && currentLocale !== '' && (L !== 'en' || !isGermanLeakForEnglish(key, currentLocale))) {
        return { value: currentLocale, source: 'locale:' + key, langUsed: L };
      }
      if (field) {
        var enInfo = getHeroTextOverrideInfoWithoutEn(field, 'en');
        if (enInfo && enInfo.value && !isGermanLeakForEnglish(key, enInfo.value)) {
          return { value: enInfo.value, source: enInfo.source, langUsed: 'en' };
        }
      }
      var enLocale = pick ? pick('en', key) : null;
      if (enLocale != null && enLocale !== '' && !isGermanLeakForEnglish(key, enLocale)) {
        return { value: enLocale, source: 'locale:en:' + key, langUsed: 'en' };
      }
      return { value: (safe != null ? safe : null), source: 'fallback:' + key, langUsed: 'en' };
    }
    var eyebrow = document.getElementById('heroEyebrow');
    var heroSubtitle = document.getElementById('heroSubtitle');
    var heroCta1 = document.getElementById('heroCta1');
    var heroCta2 = document.getElementById('heroCta2');
    var heroQuickBio = document.getElementById('heroQuickBio');
    var heroCta3 = document.getElementById('heroCta3');
    var heroName = document.getElementById('heroName');
    var v;
    var vEyebrow = val('hero.eyebrow');
    if (eyebrow && vEyebrow && vEyebrow.value != null) eyebrow.textContent = vEyebrow.value;
    var vSubtitle = val('hero.subtitle');
    if (heroSubtitle && vSubtitle && vSubtitle.value != null) heroSubtitle.textContent = vSubtitle.value;
    var vCta1 = val('hero.cta1');
    if (heroCta1 && vCta1 && vCta1.value != null) heroCta1.textContent = vCta1.value;
    var vCta3 = val('hero.cta2');
    if (L === 'fr') {
      console.log('[FR DEBUG] vCta3 (using hero.cta2):', vCta3);
    }
    if (heroCta3 && vCta3 && vCta3.value != null) heroCta3.textContent = vCta3.value;
    if (L === 'fr') {
      console.log('[FR DEBUG] heroCta3 final text:', heroCta3 ? heroCta3.textContent : '');
    }
    var quickBioInfo = getHeroTextOverrideInfo('quickBioLabel', L);
    if (heroQuickBio) {
      if (quickBioInfo && quickBioInfo.value) heroQuickBio.textContent = quickBioInfo.value;
      else {
        var quickBioFallback = pick ? pick(L, 'hero.ctaBio') : null;
        if (quickBioFallback != null && quickBioFallback !== '') heroQuickBio.textContent = quickBioFallback;
      }
    }
    var quickCalInfo = getHeroTextOverrideInfo('quickCalLabel', L);
    if (heroCta2) {
      if (L === 'fr') {
        console.log('[FR DEBUG] quickCalInfo:', quickCalInfo);
        console.log('[FR DEBUG] quickCalFallback (nav.cal):', pick ? pick(L, 'nav.cal') : null);
      }
      if (quickCalInfo && quickCalInfo.value) heroCta2.textContent = quickCalInfo.value;
      else {
        var quickCalFallback = pick ? pick(L, 'nav.cal') : null;
        if (quickCalFallback != null && quickCalFallback !== '') heroCta2.textContent = quickCalFallback;
      }
      if (L === 'fr') {
        console.log('[FR DEBUG] heroCta2 final text:', heroCta2.textContent);
      }
    }
    var vName = val('hero.nameHtml');
    if (heroName && vName && vName.value != null) applyHeroNameMarkup(heroName, vName.value);
    applyProgramsEntryPointVisibility(L);
    console.log('[home hero]', L, vSubtitle && vSubtitle.langUsed ? vSubtitle.langUsed : L, {
      eyebrow: vEyebrow && vEyebrow.source,
      subtitle: vSubtitle && vSubtitle.source,
      cta1: vCta1 && vCta1.source,
      cta2: quickCalInfo && quickCalInfo.source,
      cta3: vCta3 && vCta3.source,
      quickBioLabel: quickBioInfo && quickBioInfo.value,
      quickCalLabel: quickCalInfo && quickCalInfo.value,
      heroQuickBio: heroQuickBio ? heroQuickBio.textContent : '',
      heroCta2: heroCta2 ? heroCta2.textContent : ''
    });
    if (!HERO_SOURCE_LOGGED) {
      HERO_SOURCE_LOGGED = true;
      console.log('[Hero] Runtime source trace', {
        langUsed: L,
        eyebrow: vEyebrow && vEyebrow.source,
        subtitle: vSubtitle && vSubtitle.source,
        cta1: vCta1 && vCta1.source,
        cta2: quickCalInfo && quickCalInfo.source,
        cta3: vCta3 && vCta3.source,
        quickBio: heroQuickBio ? heroQuickBio.textContent : '',
        quickCal: heroCta2 ? heroCta2.textContent : ''
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
        if (introPhoto && !(getIntroImageSettingsOverrideInfo() && getIntroImageSettingsOverrideInfo().position)) introPhoto.style.objectPosition = pos;
      }
      applyIntroImageSettings(introPhoto);
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
      applyHomeIntroCopy(lang);
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
      applyHomeIntroCopy(lang);
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
