/**
 * mp/biography.html — long-form bio from v1-assets/data/biography-data.json
 * (npm run build:biography -- [export.json]; defaults in v1-assets/build/biography-defaults.json).
 */
(function () {
  'use strict';

  var MP_BIO = null;

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

  function currentLang() {
    return (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
  }

  function pickLocale() {
    var lang = currentLang();
    var L = MP_BIO && MP_BIO.locales;
    if (!L) return null;
    return L[lang] || L.en || null;
  }

  function renderBioContent() {
    var d = pickLocale();
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
    if (!d) return;
    if (intro) intro.textContent = d.introLine || '';
    if (h2) h2.innerHTML = d.h2 || '';
    if (parasEl) {
      parasEl.innerHTML = '';
      var ps = Array.isArray(d.paragraphs) ? d.paragraphs : [];
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
    var portrait = getBioPortraitOverride() || (MP_BIO && MP_BIO.portraitImage ? MP_BIO.portraitImage : '');
    if (img && portrait) img.src = portrait;
    if (img && d.portraitAlt) img.setAttribute('alt', d.portraitAlt);
    if (ctag) ctag.textContent = d.continueSectionTag || '';
    if (csub) csub.textContent = d.continueSub || '';
    if (ctaRep) ctaRep.textContent = d.ctaRepertoire || '';
    if (ctaMed) ctaMed.textContent = d.ctaMedia || '';
    if (ctaCon) ctaCon.textContent = d.ctaContact || '';
    if (ctaHome) ctaHome.textContent = d.ctaHomeIntro || '';
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
        var intro = document.getElementById('bioIntroLine');
        if (intro) {
          var lang = currentLang();
          var msg =
            typeof window.pickMpLocaleString === 'function'
              ? window.pickMpLocaleString(lang, 'bio.loadError')
              : null;
          intro.textContent = msg || 'Biography content could not be loaded.';
        }
      });
  }

  window.addEventListener('mp:langchange', function () {
    if (MP_BIO) renderBioContent();
  });

  if (window.MP_LOCALE_TABLE) {
    boot();
  } else {
    window.addEventListener('mp:localesready', boot, { once: true });
  }
})();
