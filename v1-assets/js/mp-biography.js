/**
 * Public-safe biography page.
 * This runtime resolves copy and portrait hints from bundled public JSON
 * plus explicit public-safe live docs only.
 * Internal/admin biography drafts must not be read by the public site.
 */
(function () {
  'use strict';

  var MP_BIO = null;
  var BIO_DOC_CACHE = {};
  var BIO_RENDER_SEQ = 0;
  /** Invisible placeholder so the browser never paints bundled/HTML default portrait before JS resolves the real URL. */
  var PORTRAIT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function readLegacyJson(key) {
    return null;
  }
  function readLocalUnsyncedJson(key) {
    return null;
  }

  function getBioPortraitOverride() {
    return '';
  }
  function fetchFirestoreDocJsonWithMeta(key) {
    if (typeof window.fetchMpPublicFirestoreDoc !== 'function') return Promise.resolve(null);
    return window.fetchMpPublicFirestoreDoc('public_' + key);
  }
  function getBioDocWithFallback(lang) {
    var key = 'bio_' + lang;
    if (Object.prototype.hasOwnProperty.call(BIO_DOC_CACHE, key)) return Promise.resolve(BIO_DOC_CACHE[key]);
    var code = normalizeLangCode(lang) || 'en';
    var bundled = MP_BIO && MP_BIO.locales && MP_BIO.locales[code];
    return fetchFirestoreDocJsonWithMeta(key)
      .then(function (doc) {
        if (doc && doc.data && typeof doc.data === 'object') {
          BIO_DOC_CACHE[key] = {
            data: doc.data,
            updateTime: doc.updateTime || ''
          };
          return BIO_DOC_CACHE[key];
        }
        BIO_DOC_CACHE[key] = bundled && typeof bundled === 'object'
          ? { data: bundled, updateTime: '' }
          : null;
        return BIO_DOC_CACHE[key];
      })
      .catch(function () {
        BIO_DOC_CACHE[key] = bundled && typeof bundled === 'object'
          ? { data: bundled, updateTime: '' }
          : null;
        return BIO_DOC_CACHE[key];
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
  function safeString(v) {
    return String(v == null ? '' : v);
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
    if (L === 'de' || L === 'en' || !doc || typeof doc !== 'object' || !MP_BIO || !MP_BIO.locales) return false;
    var deLocale = MP_BIO.locales.de || MP_BIO.locales.en || null;
    var enLocale = MP_BIO.locales.en || null;
    if (!deLocale || !enLocale) return false;
    var matchedLocale = detectBiographyLocaleMatch(doc);
    if (matchedLocale && matchedLocale !== L) return true;
    var deScore = bioLocaleSimilarityScore(doc, deLocale);
    var englishScore = bioLocaleSimilarityScore(doc, enLocale);
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

  function defaultDossierCtaForLang(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var map = {
      en: 'View dossier',
      de: 'Dossier ansehen',
      es: 'Ver dossier',
      it: 'Vedi dossier',
      fr: 'Voir le dossier'
    };
    return map[L] || map.en;
  }

  function bioSectionLabelsForLang(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var fallbackMap = {
      en: ['Profile', 'Training & artistic development', 'Stage & concert', 'Repertoire & programmes'],
      de: ['Profil', 'Ausbildung & künstlerische Entwicklung', 'Bühne & Konzert', 'Repertoire & Programme'],
      es: ['Perfil', 'Formación y desarrollo artístico', 'Escena y concierto', 'Repertorio y programas'],
      it: ['Profilo', 'Formazione e sviluppo artistico', 'Palcoscenico e concerto', 'Repertorio e programmi'],
      fr: ['Profil', 'Formation et développement artistique', 'Scène et concert', 'Répertoire et programmes']
    };
    var pick = typeof window.pickMpLocaleString === 'function' ? window.pickMpLocaleString : function () { return null; };
    var labels = [
      pick(L, 'bio.section0') || fallbackMap[L][0] || fallbackMap.en[0],
      pick(L, 'bio.section1') || fallbackMap[L][1] || fallbackMap.en[1],
      pick(L, 'bio.section2') || fallbackMap[L][2] || fallbackMap.en[2],
      pick(L, 'bio.section3') || fallbackMap[L][3] || fallbackMap.en[3]
    ];
    return labels;
  }

  function splitBioSentences(text) {
    var raw = safeString(text).trim();
    if (!raw) return [];
    var protectedText = raw.replace(/z\.B\./g, 'z<BIO_DOT>B<BIO_DOT>');
    var parts = protectedText.match(/[^.!?]+(?:[.!?]+|$)(?:["“”»«])?/g) || [protectedText];
    return parts
      .map(function (part) {
        return part.replace(/<BIO_DOT>/g, '.').trim();
      })
      .filter(Boolean);
  }

  function buildBioSections(paragraphs, lang, sectionsObj) {
    var labels = bioSectionLabelsForLang(lang);
    if (sectionsObj && typeof sectionsObj === 'object') {
      var profile = safeString(sectionsObj.profile || '').trim();
      var training = safeString(sectionsObj.training || '').trim();
      var stage = safeString(sectionsObj.stage || '').trim();
      var repertoire = safeString(sectionsObj.repertoire || '').trim();
      if (profile || training || stage || repertoire) {
        var out = [];
        if (profile) out.push({ title: labels[0], paragraphs: [profile] });
        if (training) out.push({ title: labels[1], paragraphs: [training] });
        if (stage) out.push({ title: labels[2], paragraphs: [stage] });
        if (repertoire) out.push({ title: labels[3], paragraphs: [repertoire] });
        return out;
      }
    }
    var ps = (paragraphs || [])
      .map(function (p) { return safeString(p).trim(); })
      .filter(Boolean);
    var sections = [
      { title: labels[0], paragraphs: [] },
      { title: labels[1], paragraphs: [] },
      { title: labels[2], paragraphs: [] },
      { title: labels[3], paragraphs: [] }
    ];
    if (ps[0]) sections[0].paragraphs.push(ps[0]);
    if (ps[1]) sections[1].paragraphs.push(ps[1]);
    if (ps[2]) sections[1].paragraphs.push(ps[2]);
    if (ps[3]) {
      var tail = splitBioSentences(ps[3]);
      if (tail.length) sections[1].paragraphs.push(tail.shift());
      if (tail.length) {
        var finalSentence = tail.pop();
        if (tail.length) sections[2].paragraphs.push(tail.join(' '));
        if (finalSentence) sections[3].paragraphs.push(finalSentence);
      }
    }
    for (var i = 4; i < ps.length; i++) sections[3].paragraphs.push(ps[i]);
    return sections.filter(function (section) {
      return section.paragraphs.length;
    });
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
      if (window.RGImageCrop) {
        window.RGImageCrop.applyObjectImageCrop(img, merged.portraitFit, merged.portraitFocus, '', 'top center');
      } else {
        img.style.objectPosition = String(merged.portraitFocus || '').trim() || '';
      }
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
      var sections = buildBioSections(ps, lang, merged.sections);
      var paragraphIndex = 0;
      sections.forEach(function (section, sectionIndex) {
        var sectionEl = document.createElement('section');
        sectionEl.className = 'bio-copy-section reveal rd' + (sectionIndex + 1);
        var title = document.createElement('h3');
        title.className = 'bio-copy-section-title';
        title.textContent = section.title;
        sectionEl.appendChild(title);
        section.paragraphs.forEach(function (copy) {
          var p = document.createElement('p');
          paragraphIndex += 1;
          p.className = 'bio-copy-paragraph';
          if (paragraphIndex === 2) p.className += ' bio-feather-anchor';
          p.textContent = copy;
          sectionEl.appendChild(p);
        });
        parasEl.appendChild(sectionEl);
      });
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
      ctaMed.textContent = defaultDossierCtaForLang(lang);
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
      var adminDocForDisplay = adminDoc;
      if (shouldSuppressBiographyAdminDoc(lang, adminDoc)) {
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
