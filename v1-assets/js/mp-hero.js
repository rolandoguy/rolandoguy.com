(function () {
  /** Hero background: /v1-assets/data/hero-config.json (npm run build:hero-config -- <export.json>). */
  var HERO_EN_FALLBACK = {
    'hero.eyebrow': 'Lyric Tenor · Opera · Concert · Recital',
    'hero.subtitle': 'Argentine-Italian lyric tenor based in Berlin',
    'hero.cta1': 'Watch & Listen',
    'hero.cta2': 'Book Now',
    'hero.nameHtml': 'Rolando<br><em>Guy</em>'
  };
  var LAST_HERO_IMAGE = '';

  function escUrl(u) {
    return String(u).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  function readLegacyRecord(key) {
    try {
      if (!window.localStorage) return null;
      var parseMaybe = function (raw) {
        if (!raw) return null;
        try { return JSON.parse(raw); } catch (e) { return null; }
      };
      var direct = parseMaybe(window.localStorage.getItem(key));
      if (direct != null) {
        if (direct && typeof direct === 'object' && direct.value != null) {
          return { value: direct.value, ts: Number(direct.ts) || 0 };
        }
        return { value: direct, ts: 0 };
      }
      var wrapped = parseMaybe(window.localStorage.getItem('rg_local_' + key));
      if (wrapped && typeof wrapped === 'object' && wrapped.value != null) {
        return { value: wrapped.value, ts: Number(wrapped.ts) || 0 };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  function readLegacyJson(key) {
    var rec = readLegacyRecord(key);
    return rec ? rec.value : null;
  }
  function withCacheBuster(url, ts) {
    var s = String(url || '').trim();
    var n = Number(ts) || 0;
    if (!s || !n) return s;
    if (/^(data:|blob:)/i.test(s)) return s;
    if (/[?&]v=\d+/.test(s)) return s;
    return s + (s.indexOf('?') >= 0 ? '&' : '?') + 'v=' + n;
  }
  function getIntroImageOverride() {
    var rawLang = (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    var shortLang = String(rawLang || 'en').split('-')[0];
    var byLangRec = readLegacyRecord('hero_' + rawLang);
    var byLang = byLangRec && byLangRec.value;
    if (byLang && typeof byLang.introImage === 'string' && byLang.introImage.trim()) {
      return withCacheBuster(normalizeIntroImagePath(byLang.introImage), byLangRec.ts);
    }
    if (shortLang && shortLang !== rawLang) {
      var byShortRec = readLegacyRecord('hero_' + shortLang);
      var byShort = byShortRec && byShortRec.value;
      if (byShort && typeof byShort.introImage === 'string' && byShort.introImage.trim()) {
        return withCacheBuster(normalizeIntroImagePath(byShort.introImage), byShortRec.ts);
      }
    }
    var byEnRec = readLegacyRecord('hero_en');
    var byEn = byEnRec && byEnRec.value;
    if (byEn && typeof byEn.introImage === 'string' && byEn.introImage.trim()) {
      return withCacheBuster(normalizeIntroImagePath(byEn.introImage), byEnRec.ts);
    }
    return '';
  }
  function normalizeIntroImagePath(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (/^(data:|https?:\/\/|\/\/|\/|\.\.\/)/i.test(s)) return s;
    if (/^\.\//.test(s)) s = s.slice(2);
    if (/^img\//i.test(s)) return '../' + s;
    return '../' + s;
  }

  function applyHeroCopy(lang) {
    var pick =
      typeof window.pickMpLocaleString === 'function' ? window.pickMpLocaleString : null;
    var L = lang || (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    function val(key) {
      var v = pick ? pick(L, key) : null;
      if (v != null && v !== '') return v;
      v = HERO_EN_FALLBACK[key];
      return v != null ? v : null;
    }
    var eyebrow = document.getElementById('heroEyebrow');
    var heroSubtitle = document.getElementById('heroSubtitle');
    var heroCta1 = document.getElementById('heroCta1');
    var heroCta2 = document.getElementById('heroCta2');
    var heroName = document.getElementById('heroName');
    var v;
    v = val('hero.eyebrow');
    if (eyebrow && v != null) eyebrow.textContent = v;
    v = val('hero.subtitle');
    if (heroSubtitle && v != null) heroSubtitle.textContent = v;
    v = val('hero.cta1');
    if (heroCta1 && v != null) heroCta1.textContent = v;
    v = val('hero.cta2');
    if (heroCta2 && v != null) heroCta2.textContent = v;
    v = val('hero.nameHtml');
    if (heroName && v != null) heroName.innerHTML = v;
  }

  function applyHeroConfig(cfg) {
    var hb = document.getElementById('heroBg');
    var hero = document.getElementById('hero');
    var introPhoto = document.querySelector('img.mp-home-hero-asset');
    if (!hb || !cfg) return;
    var img = String(cfg.image || '').trim();
    if (img) {
      LAST_HERO_IMAGE = img;
      hb.style.backgroundImage = "url('" + escUrl(img) + "')";
      if (introPhoto) introPhoto.src = getIntroImageOverride() || normalizeIntroImagePath(img);
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
    applyHeroCopy(lang);
    fetch('/v1-assets/data/hero-config.json', { cache: 'no-store' })
      .then(function (r) {
        return r.json();
      })
      .then(applyHeroConfig)
      .catch(function () {
        var hb = document.getElementById('heroBg');
        var fallback = '../img/hero-portrait.webp';
        if (hb) hb.style.backgroundImage = "url('" + escUrl(fallback) + "')";
        var introPhoto = document.querySelector('img.mp-home-hero-asset');
        if (introPhoto) introPhoto.src = getIntroImageOverride() || normalizeIntroImagePath(fallback);
      });
  }

  window.addEventListener('mp:langchange', function (e) {
    var lang = (e.detail && e.detail.lang) || (window.getMpSiteLang && window.getMpSiteLang()) || 'en';
    applyHeroCopy(lang);
    var introPhoto = document.querySelector('img.mp-home-hero-asset');
    if (introPhoto) introPhoto.src = getIntroImageOverride() || normalizeIntroImagePath(LAST_HERO_IMAGE) || introPhoto.src;
  });

  if (window.MP_LOCALE_TABLE) {
    bootHero();
  } else {
    window.addEventListener('mp:localesready', bootHero, { once: true });
  }
})();
