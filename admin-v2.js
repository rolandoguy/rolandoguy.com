(function () {
  'use strict';

  var LANGS = ['en', 'de', 'es', 'it', 'fr'];
  var ADMIN_ALLOWLIST_EMAILS = ['rolandoguy@gmail.com'];
  var firebaseAuth = null;
  var SAFE_IMPORT_KEY_RE = /^(hero|bio|rep|perf|contact|rg_ui|rg_editorial)_(en|de|es|it|fr)$|^(rg_rep_cards|rg_perfs|rg_press|rg_press_meta|rg_vid|rg_epk_bios|rg_epk_photos|rg_epk_cvs|rg_public_pdfs|rg_photos|rg_photo_captions|rg_programs|rg_programs_en|rg_programs_de|rg_programs_es|rg_programs_it|rg_programs_fr|programs_en|programs_de|programs_es|programs_it|programs_fr)$/;
  var state = {
    lang: 'en',
    section: 'home',
    dirty: false,
    api: null,
    repCards: [],
    repIndex: -1,
    perfs: [],
    perfIndex: -1,
    programsDoc: { title: '', subtitle: '', intro: '', closingNote: '', programs: [] },
    programsIndex: -1,
    pressTab: 'quotes',
    press: [],
    pressIndex: -1,
    publicPdfs: { dossier: {}, artistSheet: {} },
    epkBios: {},
    epkPhotos: [],
    epkPhotoIndex: -1,
    epkCvs: {},
    epkCvsTemp: {},
    mediaTab: 'videos',
    vidData: { h2: '', videos: [] },
    vidIndex: -1,
    photosData: { s: [], t: [], b: [] },
    photoCaptions: {},
    photoType: 's',
    photoIndex: -1,
    ready: false,
    bioPortraitDefault: '',
    bioLoadNonce: 0,
    homeIntroDefault: '',
    homeLoadNonce: 0,
    homeLoadCallCount: 0
  };

  function $(id) { return document.getElementById(id); }
  function isMobileSafari() {
    var ua = String((window.navigator && window.navigator.userAgent) || '');
    var isIOS = /iP(hone|ad|od)/i.test(ua);
    var isWebKit = /WebKit/i.test(ua);
    var isSafari = /Safari/i.test(ua);
    var excluded = /(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
    return isIOS && isWebKit && isSafari && !excluded;
  }
  function shouldUseRedirectAuth() {
    return isMobileSafari();
  }
  function setAuthError(message, err) {
    var code = safeString(err && err.code).trim();
    var msg = safeString(err && err.message).trim();
    var full = safeString(message);
    if (code) full += ' [' + code + ']';
    if (msg) full += ' ' + msg;
    setAuthGate(false, firebaseAuth ? firebaseAuth.currentUser : null, full);
  }
  function isAdminUser(user) {
    if (!user) return false;
    var email = safeString(user.email).toLowerCase();
    return ADMIN_ALLOWLIST_EMAILS.map(function (x) { return safeString(x).toLowerCase(); }).indexOf(email) >= 0;
  }
  function setAuthGate(unlocked, user, msgText) {
    var gate = $('adm2LockWrap');
    var app = $('adm2App');
    if (gate) gate.style.display = unlocked ? 'none' : '';
    if (app) app.style.display = unlocked ? 'flex' : 'none';
    if ($('adm2UserEmail')) $('adm2UserEmail').textContent = user && user.email ? user.email : '—';
    if ($('adm2SignInBtn')) $('adm2SignInBtn').style.display = user ? 'none' : '';
    if ($('adm2SignOutBtn')) $('adm2SignOutBtn').style.display = user ? '' : 'none';
    if ($('adm2TopSignOutBtn')) $('adm2TopSignOutBtn').style.display = unlocked && user ? '' : 'none';
    if ($('adm2AuthMsg')) $('adm2AuthMsg').textContent = msgText || '';
  }
  function initAuth() {
    if (typeof firebase === 'undefined') {
      setAuthError('Authentication is unavailable (Firebase failed to load).');
      return;
    }
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp({
          apiKey: "AIzaSyCW9fCKrUcmFxc91KmgXhQF4kRYCiZH9Y0",
          authDomain: "rolandoguy-57d63.firebaseapp.com",
          projectId: "rolandoguy-57d63",
          storageBucket: "rolandoguy-57d63.firebasestorage.app",
          messagingSenderId: "276077748266",
          appId: "1:276077748266:web:f38a687ab3b526f0262353"
        });
      }
      firebaseAuth = firebase.auth();
    } catch (e) {
      setAuthError('Authentication is unavailable (Firebase init failed).', e);
    }
  }
  function signInGoogle() {
    if (!firebaseAuth || typeof firebase === 'undefined') {
      setAuthError('Authentication is unavailable.');
      return false;
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    if (shouldUseRedirectAuth()) {
      setAuthGate(false, firebaseAuth.currentUser || null, 'Opening Google sign-in with redirect…');
      firebaseAuth.signInWithRedirect(provider).catch(function (err) {
        setAuthError('Redirect sign-in failed.', err);
      });
      return false;
    }
    firebaseAuth.signInWithPopup(provider).catch(function (err) {
      if (err && err.code === 'auth/popup-blocked') {
        setAuthGate(false, firebaseAuth.currentUser || null, 'Popup blocked. Switching to redirect sign-in…');
        firebaseAuth.signInWithRedirect(provider).catch(function (err2) {
          setAuthError('Could not sign in with Google after popup fallback to redirect.', err2);
        });
        return;
      }
      setAuthError('Could not sign in with Google. Check Firebase Authentication domain settings or popup blocking.', err);
    });
    return false;
  }
  function handleRedirectResult() {
    if (!firebaseAuth || typeof firebaseAuth.getRedirectResult !== 'function') return Promise.resolve();
    return firebaseAuth.getRedirectResult().then(function (res) {
      if (res && res.user) {
        setAuthGate(false, res.user, 'Redirect sign-in completed. Verifying access…');
      }
    }).catch(function (err) {
      setAuthError('Redirect sign-in failed on return.', err);
    });
  }
  function signOut() {
    if (!firebaseAuth) return;
    firebaseAuth.signOut().catch(function (err) {
      setAuthError('Sign out failed.', err);
    });
    return false;
  }
  function awaitAuthorizedUser() {
    return new Promise(function (resolve, reject) {
      if (!firebaseAuth) return reject(new Error('Firebase auth unavailable.'));
      firebaseAuth.onAuthStateChanged(function (user) {
        var ok = isAdminUser(user);
        if (!user) {
          setAuthGate(false, null, 'Sign in with Google to continue.');
          return;
        }
        if (!ok) {
          setAuthGate(false, user, 'This account is not authorized for this admin panel.');
          return;
        }
        setAuthGate(true, user, 'Signed in.');
        resolve(user);
      }, function () {
        reject(new Error('Auth state listener failed.'));
      });
    });
  }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function setStatus(text, kind) {
    var el = $('saveState');
    el.textContent = text;
    el.classList.remove('ok', 'warn', 'err');
    if (kind) el.classList.add(kind);
  }
  function updateLangBadge() {
    $('langBadge').textContent = String(state.lang || 'en').toUpperCase();
  }
  function markDirty(flag, hint) {
    state.dirty = flag;
    if (flag) setStatus(hint || 'Cambios sin guardar', 'warn');
    else setStatus(hint || 'Guardado', 'ok');
  }
  function ensureReady() {
    if (!state.ready || !state.api) throw new Error('Bridge no disponible');
  }
  function safeString(v) {
    return typeof v === 'string' ? v : (v == null ? '' : String(v));
  }
  function asBoolean(v, fb) {
    if (typeof v === 'boolean') return v;
    if (v === 'true') return true;
    if (v === 'false') return false;
    return fb;
  }
  function isObject(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }
  function hasOwn(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }
  function pickStoredOrFallback(stored, fallback, key) {
    if (isObject(stored) && hasOwn(stored, key)) return safeString(stored[key]);
    return safeString(fallback && fallback[key]);
  }
  function getLegacySection(section) {
    try {
      if (typeof state.api.get === 'function') {
        var d = state.api.get(section);
        if (isObject(d)) return d;
      }
    } catch (e) {}
    return {};
  }
  function hasUnsavedChangesPrompt(nextAction) {
    if (!state.dirty) return true;
    return window.confirm(nextAction + '\n\nHay cambios sin guardar. ¿Continuar igualmente?');
  }

  function waitForLegacyApi() {
    var frame = $('legacyBridge');
    return new Promise(function (resolve, reject) {
      var tries = 0;
      var done = false;
      function finish(err, api) {
        if (done) return;
        done = true;
        if (err) reject(err);
        else resolve(api);
      }
      function check() {
        if (done) return;
        tries++;
        var w = frame && frame.contentWindow;
        if (w && typeof w.load === 'function' && typeof w.save === 'function') {
          if (typeof w.setLang !== 'function') {
            return finish(new Error('Legacy sin setLang(); recarga admin.html e intenta de nuevo.'));
          }
          return finish(null, w);
        }
        if (tries > 220) return finish(new Error('Timeout esperando API legacy (admin.html).'));
        setTimeout(check, 50);
      }
      frame.addEventListener('load', check, { once: true });
      check();
    });
  }

  function validateKeyValue(key, val) {
    if (val === undefined) throw new Error('No se puede guardar undefined (' + key + ')');
    if (typeof val === 'function') throw new Error('No se puede guardar function (' + key + ')');
    if (key === 'rg_rep_cards' || key === 'rg_perfs' || key === 'rg_press') {
      if (!Array.isArray(val)) throw new Error(key + ' debe ser array');
    }
    if (key === 'rg_vid') {
      if (!isObject(val)) throw new Error('rg_vid debe ser objeto');
      if (!Array.isArray(val.videos)) throw new Error('rg_vid.videos debe ser array');
    }
    if (key === 'rg_photos') {
      if (!isObject(val)) throw new Error('rg_photos debe ser objeto');
      ['s', 't', 'b'].forEach(function (k) {
        if (!Array.isArray(val[k])) throw new Error('rg_photos.' + k + ' debe ser array');
      });
    }
    if (key === 'rg_photo_captions' && !isObject(val)) throw new Error('rg_photo_captions debe ser objeto');
    if (key === 'rg_epk_photos' && !Array.isArray(val)) throw new Error('rg_epk_photos debe ser array');
    if (key === 'rg_epk_bios' && !isObject(val)) throw new Error('rg_epk_bios debe ser objeto');
    if (key === 'rg_epk_cvs') {
      if (!isObject(val)) throw new Error('rg_epk_cvs debe ser objeto');
      Object.keys(val).forEach(function (k) {
        if (typeof val[k] !== 'string') throw new Error('rg_epk_cvs.' + k + ' debe ser string base64');
      });
    }
    if (key === 'rg_public_pdfs' && !isObject(val)) throw new Error('rg_public_pdfs debe ser objeto');
    if (
      key.indexOf('hero_') === 0 || key.indexOf('bio_') === 0 || key.indexOf('rep_') === 0 ||
      key.indexOf('perf_') === 0 || key.indexOf('contact_') === 0 || key.indexOf('rg_ui_') === 0
    ) {
      if (!isObject(val)) throw new Error(key + ' debe ser objeto');
    }
    if (key === 'rg_press_meta' && !isObject(val)) throw new Error('rg_press_meta debe ser objeto');
    if (key.indexOf('rg_programs_') === 0) {
      if (!isObject(val)) throw new Error(key + ' debe ser objeto');
      if (!Array.isArray(val.programs)) throw new Error(key + '.programs debe ser array');
    }
    if (key.indexOf('rg_editorial_') === 0 && !isObject(val)) throw new Error(key + ' debe ser objeto');
  }

  function loadDoc(key, fb) {
    ensureReady();
    var v = state.api.load(key);
    if (v == null) return clone(fb);
    if (Array.isArray(fb) && !Array.isArray(v)) {
      setStatus('Dato inválido en ' + key + ': se usa fallback', 'warn');
      return clone(fb);
    }
    if (isObject(fb) && !isObject(v)) {
      setStatus('Dato inválido en ' + key + ': se usa fallback', 'warn');
      return clone(fb);
    }
    return clone(v);
  }
  function saveDoc(key, val) {
    ensureReady();
    validateKeyValue(key, val);
    state.api.save(key, clone(val));
    markDirty(false, 'Guardado: ' + key);
  }

  function openSection(id) {
    if (!hasUnsavedChangesPrompt('Cambiar de sección')) return;
    state.section = id;
    document.querySelectorAll('.section').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
    $('section-' + id).classList.add('active');
    document.querySelector('.nav-item[data-section="' + id + '"]').classList.add('active');
    $('currentSectionLabel').textContent = document.querySelector('.nav-item[data-section="' + id + '"]').textContent;
    if (window.innerWidth <= 860) $('sidebar').classList.remove('open');
    refreshCurrentSection();
  }

  function refreshCurrentSection() {
    if (state.section === 'home') loadHome();
    else if (state.section === 'bio') loadBio();
    else if (state.section === 'rep') loadRep();
    else if (state.section === 'programs') loadPrograms();
    else if (state.section === 'calendar') loadCalendar();
    else if (state.section === 'media') loadMedia();
    else if (state.section === 'press') loadPress();
    else if (state.section === 'contact') loadContact();
    else if (state.section === 'ui') loadUiJson();
  }

  function loadHome() {
    var nonce = ++state.homeLoadNonce;
    state.homeLoadCallCount += 1;
    var stored = loadDoc('hero_' + state.lang, null);
    var fallback = getLegacySection('hero');
    $('hero-eyebrow').value = pickStoredOrFallback(stored, fallback, 'eyebrow');
    $('hero-subtitle').value = pickStoredOrFallback(stored, fallback, 'subtitle');
    $('hero-cta1').value = pickStoredOrFallback(stored, fallback, 'cta1');
    $('hero-cta2').value = pickStoredOrFallback(stored, fallback, 'cta2');
    $('hero-bgImage').value = pickStoredOrFallback(stored, fallback, 'bgImage');
    // Keep preview blank until final source is resolved (no stale first paint).
    $('hero-introImage').value = '';
    updateHomeIntroPreview();
    resolveHomeIntroFinal().then(function (resolved) {
      if (nonce !== state.homeLoadNonce) return;
      $('hero-introImage').value = safeString(resolved && resolved.url).trim();
      updateHomeIntroPreview();
    });
  }
  function readHomeIntroFromBridge() {
    var stored = loadDoc('hero_' + state.lang, null);
    if (isObject(stored) && safeString(stored.introImage).trim()) {
      return {
        source: 'bridge:hero_' + state.lang + '.introImage',
        url: normalizeHomeIntroImagePath(safeString(stored.introImage).trim())
      };
    }
    var storedEn = loadDoc('hero_en', null);
    if (isObject(storedEn) && safeString(storedEn.introImage).trim()) {
      return {
        source: 'bridge:hero_en.introImage',
        url: normalizeHomeIntroImagePath(safeString(storedEn.introImage).trim())
      };
    }
    return null;
  }
  function fetchFirestoreDocJson(key) {
    var url = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/' + encodeURIComponent(key);
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
  function readHomeIntroFromFirestore(doc, keyLabel) {
    if (!isObject(doc)) return null;
    var s = safeString(doc.introImage).trim();
    if (!s) return null;
    return { source: 'firestore:' + keyLabel + '.introImage', url: normalizeHomeIntroImagePath(s) };
  }
  async function resolveHomeIntroFinal() {
    var langKey = 'hero_' + state.lang;
    var bridgeCandidate = readHomeIntroFromBridge();
    var fsLangPromise = fetchFirestoreDocJson(langKey);
    var fsEnPromise = fetchFirestoreDocJson('hero_en');
    var defaultPromise = loadHomeIntroDefault();

    var fsLang = await fsLangPromise;
    var fsLangCandidate = readHomeIntroFromFirestore(fsLang, langKey);
    if (fsLangCandidate) return fsLangCandidate;

    var fsEn = await fsEnPromise;
    var fsEnCandidate = readHomeIntroFromFirestore(fsEn, 'hero_en');
    if (fsEnCandidate) return fsEnCandidate;

    if (bridgeCandidate && bridgeCandidate.url) return bridgeCandidate;

    var def = safeString(await defaultPromise).trim();
    return { source: 'default:hero-config.image', url: def };
  }
  function saveHome() {
    var applyAll = !!($('home-images-all-langs') && $('home-images-all-langs').checked);
    var payload = {
      eyebrow: safeString($('hero-eyebrow').value),
      subtitle: safeString($('hero-subtitle').value),
      cta1: safeString($('hero-cta1').value),
      cta2: safeString($('hero-cta2').value),
      bgImage: safeString($('hero-bgImage').value),
      introImage: normalizeHomeIntroImagePath(safeString($('hero-introImage').value).trim())
    };
    saveDoc('hero_' + state.lang, payload);
    try {
      localStorage.setItem('hero_' + state.lang, JSON.stringify(payload));
    } catch (e) {}
    if (applyAll) {
      LANGS.forEach(function (lang) {
        if (lang === state.lang) return;
        var key = 'hero_' + lang;
        var prev = loadDoc(key, {});
        if (!isObject(prev)) prev = {};
        prev.bgImage = payload.bgImage;
        prev.introImage = payload.introImage;
        saveDoc(key, prev);
        try {
          localStorage.setItem(key, JSON.stringify(prev));
        } catch (e) {}
      });
    }
  }

  function loadHomeIntroDefault() {
    if (state.homeIntroDefault) return Promise.resolve(state.homeIntroDefault);
    return fetch('v1-assets/data/hero-config.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status || 'hero config load failed'));
        return r.json();
      })
      .then(function (data) {
        var src = normalizeHomeIntroImagePath(safeString(data && data.image).trim());
        state.homeIntroDefault = src;
        return src;
      })
      .catch(function () {
        return '';
      });
  }
  function updateHomeIntroPreview() {
    var src = normalizeHomeIntroImagePath(safeString($('hero-introImage').value).trim());
    if ($('hero-introImage').value !== src) $('hero-introImage').value = src;
    var previewSrc = src;
    if (previewSrc && !/^(data:|https?:\/\/|\/\/|\/)/i.test(previewSrc)) {
      try {
        previewSrc = new URL(previewSrc, window.location.origin + '/mp/').toString();
      } catch (e) {}
    }
    $('hero-introPreview').src = previewSrc;
  }
  function normalizeHomeIntroImagePath(raw) {
    var s = safeString(raw).trim();
    if (!s) return '';
    if (/^(data:|https?:\/\/|\/\/|\/|\.\.\/)/i.test(s)) return s;
    if (/^\.\//.test(s)) s = s.slice(2);
    if (/^img\//i.test(s)) return '../' + s;
    return '../' + s;
  }

  function loadBioPortraitDefault() {
    if (state.bioPortraitDefault) return Promise.resolve(state.bioPortraitDefault);
    return fetch('v1-assets/data/biography-data.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status || 'bio json load failed'));
        return r.json();
      })
      .then(function (data) {
        var src = safeString(data && data.portraitImage).trim();
        state.bioPortraitDefault = src;
        return src;
      })
      .catch(function () {
        return '';
      });
  }
  function updateBioPortraitPreview() {
    var src = safeString($('bio-portraitImage').value).trim();
    var previewSrc = src;
    // Biography portrait paths are resolved by mp/biography.html, not admin-v2.html.
    // Resolve relative paths against /mp/ to keep admin preview aligned with public rendering.
    if (previewSrc && !/^(data:|https?:\/\/|\/\/|\/)/i.test(previewSrc)) {
      try {
        previewSrc = new URL(previewSrc, window.location.origin + '/mp/').toString();
      } catch (e) {}
    }
    $('bio-portraitPreview').src = previewSrc;
  }

  function resolveEffectiveBioPortrait(storedCurrent, storedEn, defaultPortrait) {
    var current = isObject(storedCurrent) ? safeString(storedCurrent.portraitImage).trim() : '';
    if (current) return current;
    var en = isObject(storedEn) ? safeString(storedEn.portraitImage).trim() : '';
    if (en) return en;
    return safeString(defaultPortrait).trim();
  }

  function loadBio() {
    var nonce = ++state.bioLoadNonce;
    var stored = loadDoc('bio_' + state.lang, null);
    var storedEn = loadDoc('bio_en', null);
    var fallback = getLegacySection('bio');
    $('bio-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('bio-p1').value = pickStoredOrFallback(stored, fallback, 'p1');
    $('bio-p2').value = pickStoredOrFallback(stored, fallback, 'p2');
    $('bio-quote').value = pickStoredOrFallback(stored, fallback, 'quote');
    $('bio-cite').value = pickStoredOrFallback(stored, fallback, 'cite');
    var immediate = resolveEffectiveBioPortrait(stored, storedEn, state.bioPortraitDefault);
    if (immediate) {
      $('bio-portraitImage').value = immediate;
      updateBioPortraitPreview();
    }
    loadBioPortraitDefault().then(function (src) {
      if (nonce !== state.bioLoadNonce) return;
      $('bio-portraitImage').value = resolveEffectiveBioPortrait(stored, storedEn, src);
      updateBioPortraitPreview();
    });
  }
  function saveBio() {
    var applyAll = !!($('bio-image-all-langs') && $('bio-image-all-langs').checked);
    var payload = {
      h2: safeString($('bio-h2').value),
      p1: safeString($('bio-p1').value),
      p2: safeString($('bio-p2').value),
      quote: safeString($('bio-quote').value),
      cite: safeString($('bio-cite').value),
      portraitImage: safeString($('bio-portraitImage').value).trim()
    };
    saveDoc('bio_' + state.lang, payload);
    // Compatibility mirror for mp/biography runtime override resolution.
    try {
      localStorage.setItem('bio_' + state.lang, JSON.stringify(payload));
    } catch (e) {}
    if (applyAll) {
      LANGS.forEach(function (lang) {
        if (lang === state.lang) return;
        var key = 'bio_' + lang;
        var prev = loadDoc(key, {});
        if (!isObject(prev)) prev = {};
        prev.portraitImage = payload.portraitImage;
        saveDoc(key, prev);
        try {
          localStorage.setItem(key, JSON.stringify(prev));
        } catch (e) {}
      });
    }
  }

  function repFiltered() {
    var cat = $('rep-cat-filter').value;
    var out = [];
    state.repCards.forEach(function (c, i) {
      if (cat === 'all' || (c.cat || 'opera') === cat) out.push({ i: i, c: c });
    });
    return out;
  }
  function renderRepList() {
    var box = $('rep-list');
    var rows = repFiltered();
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay items en esta categoría. Crea uno con "+ Nuevo".</div>';
      state.repIndex = -1;
      renderRepEditor();
      return;
    }
    box.innerHTML = rows.map(function (r) {
      var title = (r.c.role ? r.c.role + ' — ' : '') + (r.c.opera || '(sin título)');
      var cls = r.i === state.repIndex ? 'item active' : 'item';
      return '<div class="' + cls + '" data-idx="' + r.i + '">' + title + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.repIndex = Number(el.getAttribute('data-idx'));
        renderRepList();
        renderRepEditor();
      });
    });
    if (state.repIndex < 0 && rows.length) {
      state.repIndex = rows[0].i;
      renderRepList();
      renderRepEditor();
    }
  }
  function renderRepEditor() {
    var c = state.repCards[state.repIndex] || {};
    $('rep-composer').value = safeString(c.composer);
    $('rep-opera').value = safeString(c.opera);
    $('rep-role').value = safeString(c.role);
    $('rep-cat').value = safeString(c.cat || 'opera');
    $('rep-status').value = safeString(c.status);
    $('rep-lang').value = safeString(c.lang);
    $('rep-category').value = safeString(c.category);
  }
  function persistRepEditor() {
    if (state.repIndex < 0) return;
    var c = state.repCards[state.repIndex] || {};
    c.composer = $('rep-composer').value;
    c.opera = $('rep-opera').value;
    c.role = $('rep-role').value;
    c.cat = $('rep-cat').value || 'opera';
    c.status = $('rep-status').value;
    c.lang = $('rep-lang').value;
    c.category = $('rep-category').value;
    state.repCards[state.repIndex] = c;
    renderRepList();
    markDirty(true);
  }
  function loadRep() {
    var stored = loadDoc('rep_' + state.lang, null);
    var fallback = getLegacySection('rep');
    $('rep-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('rep-intro').value = pickStoredOrFallback(stored, fallback, 'intro');
    state.repCards = loadDoc('rg_rep_cards', []);
    state.repIndex = -1;
    renderRepList();
  }
  function saveRepHeader() { saveDoc('rep_' + state.lang, { h2: safeString($('rep-h2').value), intro: safeString($('rep-intro').value) }); }
  function saveRepCards() {
    state.repCards = state.repCards.filter(function (c) { return isObject(c); });
    saveDoc('rg_rep_cards', state.repCards);
  }

  function safeProgramsDoc(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    if (!Array.isArray(d.programs)) d.programs = [];
    d.title = safeString(d.title);
    d.subtitle = safeString(d.subtitle);
    d.intro = safeString(d.intro);
    d.closingNote = safeString(d.closingNote);
    d.programs = d.programs.filter(function (p) { return isObject(p); }).map(function (p, i) {
      var formations = Array.isArray(p.formations) ? p.formations : (typeof p.formations === 'string' ? p.formations.split('\n') : []);
      var idealFor = Array.isArray(p.idealFor) ? p.idealFor : (typeof p.idealFor === 'string' ? p.idealFor.split('\n') : []);
      return {
        id: p.id != null ? Number(p.id) || (i + 1) : (i + 1),
        order: p.order != null ? Number(p.order) || i : i,
        published: p.published !== false,
        title: safeString(p.title),
        description: safeString(p.description),
        formations: formations.map(function (x) { return safeString(x).trim(); }).filter(Boolean),
        duration: safeString(p.duration),
        idealFor: idealFor.map(function (x) { return safeString(x).trim(); }).filter(Boolean)
      };
    });
    return d;
  }
  function normalizeProgramOrders() {
    state.programsDoc.programs.forEach(function (p, i) {
      p.order = i;
      if (!Number.isFinite(Number(p.id)) || Number(p.id) <= 0) p.id = i + 1;
    });
  }
  function loadProgramsCanonicalForLang(lang) {
    var byLang = loadDoc('rg_programs_' + lang, null);
    if (isObject(byLang) && Array.isArray(byLang.programs)) return safeProgramsDoc(byLang);
    try {
      if (typeof state.api.getPrograms === 'function') {
        var effective = state.api.getPrograms();
        if (isObject(effective) && Array.isArray(effective.programs)) return safeProgramsDoc(effective);
      }
    } catch (e) {}
    if (lang === 'en') {
      var legacy = loadDoc('rg_programs', null);
      if (isObject(legacy) && Array.isArray(legacy.programs)) return safeProgramsDoc(legacy);
    }
    return safeProgramsDoc({ title: '', subtitle: '', intro: '', closingNote: '', programs: [] });
  }
  function renderProgramsList() {
    var box = $('programs-list');
    var arr = state.programsDoc.programs;
    if (!arr.length) {
      box.innerHTML = '<div class="empty-state">No hay programas. Crea uno con "+ Nuevo".</div>';
      state.programsIndex = -1;
      renderProgramsEditor();
      return;
    }
    box.innerHTML = arr.map(function (p, i) {
      var cls = i === state.programsIndex ? 'item active' : 'item';
      var status = p.published ? 'published' : 'hidden';
      var title = safeString(p.title) || '(sin título)';
      return '<div class="' + cls + '" data-idx="' + i + '">' + title + ' · ' + status + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.programsIndex = Number(el.getAttribute('data-idx'));
        renderProgramsList();
        renderProgramsEditor();
      });
    });
    if (state.programsIndex < 0) {
      state.programsIndex = 0;
      renderProgramsList();
      renderProgramsEditor();
    }
  }
  function renderProgramsEditor() {
    var p = state.programsDoc.programs[state.programsIndex] || {};
    $('programs-item-title').value = safeString(p.title);
    $('programs-item-description').value = safeString(p.description);
    $('programs-item-formations').value = Array.isArray(p.formations) ? p.formations.join('\n') : '';
    $('programs-item-duration').value = safeString(p.duration);
    $('programs-item-idealFor').value = Array.isArray(p.idealFor) ? p.idealFor.join('\n') : '';
    $('programs-item-published').value = p.published === false ? 'false' : 'true';
  }
  function persistProgramsEditor() {
    if (state.programsIndex < 0) return;
    var p = state.programsDoc.programs[state.programsIndex] || {};
    p.title = safeString($('programs-item-title').value);
    p.description = safeString($('programs-item-description').value);
    p.formations = safeString($('programs-item-formations').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    p.duration = safeString($('programs-item-duration').value);
    p.idealFor = safeString($('programs-item-idealFor').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    p.published = $('programs-item-published').value !== 'false';
    state.programsDoc.programs[state.programsIndex] = p;
    normalizeProgramOrders();
    renderProgramsList();
    markDirty(true, 'Programa editado');
  }
  function loadPrograms() {
    state.programsDoc = loadProgramsCanonicalForLang(state.lang);
    var edStored = loadDoc('rg_editorial_' + state.lang, null);
    var edFallback = {};
    try {
      if (typeof state.api.getEditorial === 'function') {
        var legacyEd = state.api.getEditorial();
        if (isObject(legacyEd)) edFallback = legacyEd;
      }
    } catch (e) {}
    $('programs-title').value = safeString(state.programsDoc.title);
    $('programs-subtitle').value = safeString(state.programsDoc.subtitle);
    $('programs-intro').value = safeString(state.programsDoc.intro);
    $('programs-closingNote').value = safeString(state.programsDoc.closingNote);
    $('programs-repLink').value = pickStoredOrFallback(edStored, edFallback, 'repProgramsLink');
    $('programs-epkLink').value = pickStoredOrFallback(edStored, edFallback, 'epkProgramsLink');
    state.programsIndex = -1;
    renderProgramsList();
  }
  function savePrograms() {
    state.programsDoc.title = safeString($('programs-title').value);
    state.programsDoc.subtitle = safeString($('programs-subtitle').value);
    state.programsDoc.intro = safeString($('programs-intro').value);
    state.programsDoc.closingNote = safeString($('programs-closingNote').value);
    state.programsDoc = safeProgramsDoc(state.programsDoc);
    normalizeProgramOrders();
    saveDoc('rg_programs_' + state.lang, state.programsDoc);
    var prevEd = loadDoc('rg_editorial_' + state.lang, {});
    prevEd.repProgramsLink = safeString($('programs-repLink').value).trim();
    prevEd.epkProgramsLink = safeString($('programs-epkLink').value).trim();
    saveDoc('rg_editorial_' + state.lang, prevEd);
  }

  function renderPerfList() {
    var box = $('perf-list');
    if (!state.perfs.length) {
      box.innerHTML = '<div class="empty-state">No hay eventos. Crea uno con "+ Nuevo evento".</div>';
      state.perfIndex = -1;
      renderPerfEditor();
      return;
    }
    box.innerHTML = state.perfs.map(function (e, i) {
      var t = (e.day || '') + ' ' + (e.month || '') + ' · ' + (e.title || '(sin título)');
      var cls = i === state.perfIndex ? 'item active' : 'item';
      return '<div class="' + cls + '" data-idx="' + i + '">' + t + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.perfIndex = Number(el.getAttribute('data-idx'));
        renderPerfList();
        renderPerfEditor();
      });
    });
    if (state.perfIndex < 0 && state.perfs.length) {
      state.perfIndex = 0;
      renderPerfList();
      renderPerfEditor();
    }
  }
  function renderPerfEditor() {
    var e = state.perfs[state.perfIndex] || {};
    $('perf-title').value = safeString(e.title);
    $('perf-detail').value = safeString(e.detail);
    $('perf-day').value = safeString(e.day);
    $('perf-month').value = safeString(e.month);
    $('perf-time').value = safeString(e.time);
    $('perf-venue').value = safeString(e.venue);
    $('perf-city').value = safeString(e.city);
    $('perf-venuePhoto').value = safeString(e.venuePhoto);
    var op = Number(e.venueOpacity);
    if (!Number.isFinite(op)) op = 50;
    if (op < 30) op = 30;
    if (op > 100) op = 100;
    $('perf-venueOpacity').value = String(op);
    $('perf-venueOpacityValue').value = String(op) + '%';
    $('perf-venuePreview').src = safeString(e.venuePhoto);
    $('perf-venuePreview').style.opacity = String(op / 100);
    $('perf-status').value = safeString(e.status);
    $('perf-type').value = safeString(e.type);
    $('perf-sortDate').value = safeString(e.sortDate);
  }
  function persistPerfEditor() {
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex] || {};
    e.title = $('perf-title').value;
    e.detail = $('perf-detail').value;
    e.day = $('perf-day').value;
    e.month = $('perf-month').value;
    e.time = safeString($('perf-time').value).trim();
    e.venue = $('perf-venue').value;
    e.city = $('perf-city').value;
    e.venuePhoto = safeString($('perf-venuePhoto').value).trim();
    var op = parseInt($('perf-venueOpacity').value, 10);
    if (!Number.isFinite(op)) op = 50;
    if (op < 30) op = 30;
    if (op > 100) op = 100;
    e.venueOpacity = op;
    $('perf-venueOpacityValue').value = String(op) + '%';
    $('perf-venuePreview').src = e.venuePhoto;
    $('perf-venuePreview').style.opacity = String(op / 100);
    e.status = $('perf-status').value;
    e.type = $('perf-type').value;
    e.sortDate = $('perf-sortDate').value;
    state.perfs[state.perfIndex] = e;
    renderPerfList();
    markDirty(true);
  }
  function loadCalendar() {
    var stored = loadDoc('perf_' + state.lang, null);
    var fallback = getLegacySection('perf');
    $('perf-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('perf-intro').value = pickStoredOrFallback(stored, fallback, 'intro');
    state.perfs = loadDoc('rg_perfs', []);
    state.perfIndex = -1;
    renderPerfList();
  }
  function savePerfHeader() { saveDoc('perf_' + state.lang, { h2: safeString($('perf-h2').value), intro: safeString($('perf-intro').value) }); }
  function savePerfEvents() {
    state.perfs = state.perfs.filter(function (e) { return isObject(e); });
    saveDoc('rg_perfs', state.perfs);
  }

  function getPhotoCaption(type, idx) {
    if (idx < 0) return { caption: '', photographer: '' };
    return state.photoCaptions[type + '_' + idx] || { caption: '', photographer: '' };
  }
  function setPhotoCaption(type, idx, caption, photographer) {
    state.photoCaptions[type + '_' + idx] = { caption: safeString(caption), photographer: safeString(photographer) };
  }
  function shiftPhotoCaptionsAfterDelete(type, deletedIndex) {
    var next = {};
    Object.keys(state.photoCaptions).forEach(function (k) {
      if (k.indexOf(type + '_') !== 0) { next[k] = state.photoCaptions[k]; return; }
      var i = Number(k.split('_')[1]);
      if (!Number.isFinite(i)) return;
      if (i < deletedIndex) next[k] = state.photoCaptions[k];
      else if (i > deletedIndex) next[type + '_' + (i - 1)] = state.photoCaptions[k];
    });
    state.photoCaptions = next;
  }
  function safeMediaVideos(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    if (!Array.isArray(d.videos)) d.videos = [];
    d.h2 = safeString(d.h2);
    d.videos = d.videos.filter(function (v) { return isObject(v); }).map(function (v) {
      return {
        id: safeString(v.id),
        tag: safeString(v.tag),
        title: safeString(v.title),
        sub: safeString(v.sub),
        composer: safeString(v.composer),
        repertoireCat: safeString(v.repertoireCat),
        hidden: !!v.hidden,
        group: safeString(v.group || 'opera_lied'),
        featured: !!v.featured,
        customThumb: safeString(v.customThumb)
      };
    });
    return d;
  }
  function safePhotos(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    ['s', 't', 'b'].forEach(function (k) {
      if (!Array.isArray(d[k])) d[k] = [];
      d[k] = d[k].map(function (x) { return safeString(isObject(x) ? x.url : x); }).filter(Boolean);
    });
    return d;
  }
  function mediaSummaryVideo(v) {
    var t = safeString(v.title) || '(sin title)';
    var g = safeString(v.group || 'opera_lied');
    var flags = [];
    if (v.featured) flags.push('featured');
    if (v.hidden) flags.push('hidden');
    return t + ' · ' + g + (flags.length ? ' · ' + flags.join(', ') : '');
  }
  function mediaSummaryPhoto(src, i) {
    var shortSrc = safeString(src);
    if (shortSrc.length > 36) shortSrc = shortSrc.slice(0, 33) + '...';
    var cap = getPhotoCaption(state.photoType, i).caption;
    return (cap ? cap + ' · ' : '') + shortSrc;
  }
  function loadMedia() {
    state.vidData = safeMediaVideos(loadDoc('rg_vid', { h2: '', videos: [] }));
    state.vidIndex = -1;
    state.photosData = safePhotos(loadDoc('rg_photos', { s: [], t: [], b: [] }));
    state.photoCaptions = loadDoc('rg_photo_captions', {});
    if (!isObject(state.photoCaptions)) state.photoCaptions = {};
    state.photoIndex = -1;
    $('media-vid-h2').value = state.vidData.h2;
    renderMediaVideosList();
    renderMediaPhotosList();
    toggleMediaTab(state.mediaTab || 'videos');
  }
  function toggleMediaTab(tab) {
    state.mediaTab = tab;
    $('mediaTabVideos').classList.toggle('active', tab === 'videos');
    $('mediaTabPhotos').classList.toggle('active', tab === 'photos');
    $('mediaVideosPanel').style.display = tab === 'videos' ? '' : 'none';
    $('mediaPhotosPanel').style.display = tab === 'photos' ? '' : 'none';
  }
  function renderMediaVideosList() {
    var box = $('media-vid-list');
    var arr = state.vidData.videos;
    if (!arr.length) {
      box.innerHTML = '<div class="empty-state">No hay videos. Crea uno con "+ Nuevo video".</div>';
      state.vidIndex = -1;
      renderMediaVideoEditor();
      return;
    }
    box.innerHTML = arr.map(function (v, i) {
      var cls = i === state.vidIndex ? 'item active' : 'item';
      return '<div class="' + cls + '" data-idx="' + i + '">' + mediaSummaryVideo(v) + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.vidIndex = Number(el.getAttribute('data-idx'));
        renderMediaVideosList();
        renderMediaVideoEditor();
      });
    });
    if (state.vidIndex < 0) {
      state.vidIndex = 0;
      renderMediaVideosList();
      renderMediaVideoEditor();
    }
  }
  function renderMediaVideoEditor() {
    var v = state.vidData.videos[state.vidIndex] || {};
    $('media-vid-id').value = safeString(v.id);
    $('media-vid-title').value = safeString(v.title);
    $('media-vid-sub').value = safeString(v.sub);
    $('media-vid-tag').value = safeString(v.tag);
    $('media-vid-composer').value = safeString(v.composer);
    $('media-vid-group').value = safeString(v.group || 'opera_lied');
    $('media-vid-repertoireCat').value = safeString(v.repertoireCat);
    $('media-vid-customThumb').value = safeString(v.customThumb);
    $('media-vid-featured').value = v.featured ? 'true' : 'false';
    $('media-vid-hidden').value = v.hidden ? 'true' : 'false';
  }
  function persistMediaVideoEditor() {
    if (state.vidIndex < 0) return;
    var v = state.vidData.videos[state.vidIndex] || {};
    v.id = safeString($('media-vid-id').value);
    v.title = safeString($('media-vid-title').value);
    v.sub = safeString($('media-vid-sub').value);
    v.tag = safeString($('media-vid-tag').value);
    v.composer = safeString($('media-vid-composer').value);
    v.group = safeString($('media-vid-group').value || 'opera_lied');
    v.repertoireCat = safeString($('media-vid-repertoireCat').value);
    v.customThumb = safeString($('media-vid-customThumb').value);
    v.featured = $('media-vid-featured').value === 'true';
    v.hidden = $('media-vid-hidden').value === 'true';
    state.vidData.videos[state.vidIndex] = v;
    renderMediaVideosList();
    markDirty(true, 'Video editado');
  }
  function saveMediaVideos() {
    state.vidData.h2 = safeString($('media-vid-h2').value);
    state.vidData = safeMediaVideos(state.vidData);
    saveDoc('rg_vid', state.vidData);
  }

  function setPhotoType(type) {
    state.photoType = type;
    state.photoIndex = -1;
    ['s', 't', 'b'].forEach(function (x) { $('media-photo-filter-' + x).classList.toggle('active', x === type); });
    renderMediaPhotosList();
  }
  function renderMediaPhotosList() {
    var box = $('media-photo-list');
    var arr = state.photosData[state.photoType] || [];
    if (!arr.length) {
      box.innerHTML = '<div class="empty-state">No hay fotos en este grupo. Usa "+ Agregar por URL" o "+ Subir foto".</div>';
      state.photoIndex = -1;
      renderMediaPhotoEditor();
      return;
    }
    box.innerHTML = arr.map(function (src, i) {
      var cls = i === state.photoIndex ? 'item active' : 'item';
      return '<div class="' + cls + '" data-idx="' + i + '">' + mediaSummaryPhoto(src, i) + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.photoIndex = Number(el.getAttribute('data-idx'));
        renderMediaPhotosList();
        renderMediaPhotoEditor();
      });
    });
    if (state.photoIndex < 0) {
      state.photoIndex = 0;
      renderMediaPhotosList();
      renderMediaPhotoEditor();
    }
  }
  function renderMediaPhotoEditor() {
    var arr = state.photosData[state.photoType] || [];
    var src = arr[state.photoIndex] || '';
    var c = getPhotoCaption(state.photoType, state.photoIndex);
    $('media-photo-url').value = safeString(src);
    $('media-photo-caption').value = safeString(c.caption);
    $('media-photo-photographer').value = safeString(c.photographer);
    $('media-photo-preview').src = safeString(src);
  }
  function persistMediaPhotoEditor() {
    if (state.photoIndex < 0) return;
    var arr = state.photosData[state.photoType] || [];
    arr[state.photoIndex] = safeString($('media-photo-url').value);
    setPhotoCaption(state.photoType, state.photoIndex, $('media-photo-caption').value, $('media-photo-photographer').value);
    state.photosData[state.photoType] = arr;
    renderMediaPhotosList();
    renderMediaPhotoEditor();
    markDirty(true, 'Foto editada');
  }
  function saveMediaPhotos() {
    state.photosData = safePhotos(state.photosData);
    saveDoc('rg_photos', state.photosData);
    saveDoc('rg_photo_captions', state.photoCaptions);
  }

  function safePublicPdfs(raw) {
    var out = { dossier: {}, artistSheet: {} };
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    var src = isObject(raw) ? raw : {};
    ['dossier', 'artistSheet'].forEach(function (kind) {
      var block = isObject(src[kind]) ? src[kind] : {};
      out[kind] = {};
      langs.forEach(function (L) {
        var v = block[L];
        if (typeof v === 'string') out[kind][L] = { url: safeString(v).trim(), data: '' };
        else if (isObject(v)) out[kind][L] = { url: safeString(v.url).trim(), data: safeString(v.data).trim() };
        else out[kind][L] = { url: '', data: '' };
      });
    });
    return out;
  }
  function safeEpkBios(raw) {
    var src = isObject(raw) ? raw : {};
    var out = {};
    LANGS.forEach(function (lang) {
      var b = isObject(src[lang]) ? src[lang] : {};
      out[lang] = {
        b50: safeString(b.b50),
        b150: safeString(b.b150),
        b300p1: safeString(b.b300p1),
        b300p2: safeString(b.b300p2),
        b300p3: safeString(b.b300p3),
        b300p4: safeString(b.b300p4)
      };
    });
    return out;
  }
  function safeEpkPhotos(raw) {
    var src = raw;
    if (!Array.isArray(src) && isObject(src) && Array.isArray(src.value)) src = src.value;
    var arr = Array.isArray(src) ? src : [];
    return arr.filter(function (p) { return isObject(p) || typeof p === 'string'; }).map(function (p) {
      if (typeof p === 'string') return { url: safeString(p), label: '', credit: '' };
      return { url: safeString(p.url).trim(), label: safeString(p.label), credit: safeString(p.credit) };
    });
  }
  function togglePressTab(tab) {
    state.pressTab = tab;
    ['Quotes', 'Pdfs', 'Bios', 'Photos', 'Cvs'].forEach(function (name) {
      var id = 'pressTab' + name;
      var panel = 'press' + name + 'Panel';
      var active = name.toLowerCase() === tab;
      if ($(id)) $(id).classList.toggle('active', active);
      if ($(panel)) $(panel).style.display = active ? '' : 'none';
    });
  }
  function loadPressPdfsIntoUi() {
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    langs.forEach(function (L) {
      $('pdf-dossier-' + L).value = safeString(state.publicPdfs.dossier[L] && state.publicPdfs.dossier[L].url);
      $('pdf-artist-' + L).value = safeString(state.publicPdfs.artistSheet[L] && state.publicPdfs.artistSheet[L].url);
    });
  }
  function persistPressPdfsFromUi() {
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    langs.forEach(function (L) {
      if (!state.publicPdfs.dossier[L]) state.publicPdfs.dossier[L] = { url: '', data: '' };
      if (!state.publicPdfs.artistSheet[L]) state.publicPdfs.artistSheet[L] = { url: '', data: '' };
      state.publicPdfs.dossier[L].url = safeString($('pdf-dossier-' + L).value).trim();
      state.publicPdfs.artistSheet[L].url = safeString($('pdf-artist-' + L).value).trim();
    });
  }
  function loadEpkBiosIntoUi() {
    var b = state.epkBios[state.lang] || { b50: '', b150: '', b300p1: '', b300p2: '', b300p3: '', b300p4: '' };
    $('epk-bio-b50').value = b.b50;
    $('epk-bio-b150').value = b.b150;
    $('epk-bio-b300p1').value = b.b300p1;
    $('epk-bio-b300p2').value = b.b300p2;
    $('epk-bio-b300p3').value = b.b300p3;
    $('epk-bio-b300p4').value = b.b300p4;
  }
  function persistEpkBiosFromUi() {
    if (!state.epkBios[state.lang]) state.epkBios[state.lang] = {};
    state.epkBios[state.lang].b50 = safeString($('epk-bio-b50').value);
    state.epkBios[state.lang].b150 = safeString($('epk-bio-b150').value);
    state.epkBios[state.lang].b300p1 = safeString($('epk-bio-b300p1').value);
    state.epkBios[state.lang].b300p2 = safeString($('epk-bio-b300p2').value);
    state.epkBios[state.lang].b300p3 = safeString($('epk-bio-b300p3').value);
    state.epkBios[state.lang].b300p4 = safeString($('epk-bio-b300p4').value);
  }
  function renderEpkPhotoList() {
    var box = $('epk-photo-list');
    if (!state.epkPhotos.length) {
      box.innerHTML = '<div class="empty-state">No hay EPK photos. Agrega una por URL o subida.</div>';
      state.epkPhotoIndex = -1;
      renderEpkPhotoEditor();
      return;
    }
    box.innerHTML = state.epkPhotos.map(function (p, i) {
      var cls = i === state.epkPhotoIndex ? 'item active' : 'item';
      var label = safeString(p.label) || ('Photo ' + (i + 1));
      var credit = safeString(p.credit);
      return '<div class="' + cls + '" data-idx="' + i + '">' + label + (credit ? ' · ' + credit : '') + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.epkPhotoIndex = Number(el.getAttribute('data-idx'));
        renderEpkPhotoList();
        renderEpkPhotoEditor();
      });
    });
    if (state.epkPhotoIndex < 0) {
      state.epkPhotoIndex = 0;
      renderEpkPhotoList();
      renderEpkPhotoEditor();
    }
  }
  function renderEpkPhotoEditor() {
    var p = state.epkPhotos[state.epkPhotoIndex] || { url: '', label: '', credit: '' };
    $('epk-photo-url').value = safeString(p.url);
    $('epk-photo-label').value = safeString(p.label);
    $('epk-photo-credit').value = safeString(p.credit);
    $('epk-photo-preview').src = safeString(p.url);
  }
  function persistEpkPhotoEditor() {
    if (state.epkPhotoIndex < 0) return;
    var p = state.epkPhotos[state.epkPhotoIndex] || {};
    p.url = safeString($('epk-photo-url').value).trim();
    p.label = safeString($('epk-photo-label').value);
    p.credit = safeString($('epk-photo-credit').value);
    state.epkPhotos[state.epkPhotoIndex] = p;
    renderEpkPhotoList();
    renderEpkPhotoEditor();
    markDirty(true, 'EPK photo editada');
  }
  function safeEpkCvs(raw) {
    var src = isObject(raw) ? raw : {};
    var out = {};
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      if (typeof src[L] === 'string' && src[L].trim()) out[L] = src[L].trim();
    });
    return out;
  }
  function renderEpkCvsUi() {
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      var status = 'using default CV';
      if (state.epkCvsTemp[L]) status = 'new file ready to save';
      else if (state.epkCvs[L]) status = 'custom CV saved';
      $('epk-cv-status-' + L).value = status;
    });
  }
  function saveEpkCvs() {
    var next = clone(state.epkCvs);
    Object.keys(state.epkCvsTemp).forEach(function (L) {
      if (state.epkCvsTemp[L]) next[L] = state.epkCvsTemp[L];
    });
    state.epkCvs = safeEpkCvs(next);
    state.epkCvsTemp = {};
    saveDoc('rg_epk_cvs', state.epkCvs);
    renderEpkCvsUi();
  }

  function renderPressList() {
    var box = $('press-list');
    if (!state.press.length) {
      box.innerHTML = '<div class="empty-state">No hay quotes. Crea una con "+ Nueva quote".</div>';
      state.pressIndex = -1;
      renderPressEditor();
      return;
    }
    box.innerHTML = state.press.map(function (p, i) {
      var t = (p.source || '(sin source)') + ' · ' + (p.production || '');
      var cls = i === state.pressIndex ? 'item active' : 'item';
      return '<div class="' + cls + '" data-idx="' + i + '">' + t + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.pressIndex = Number(el.getAttribute('data-idx'));
        renderPressList();
        renderPressEditor();
      });
    });
    if (state.pressIndex < 0 && state.press.length) {
      state.pressIndex = 0;
      renderPressList();
      renderPressEditor();
    }
  }
  function renderPressEditor() {
    var p = state.press[state.pressIndex] || {};
    $('press-source').value = safeString(p.source);
    var qi = isObject(p.quotes_i18n) ? p.quotes_i18n : {};
    var pi = isObject(p.production_i18n) ? p.production_i18n : {};
    $('press-quote').value = safeString(qi[state.lang] != null ? qi[state.lang] : p.quote);
    $('press-production').value = safeString(pi[state.lang] != null ? pi[state.lang] : p.production);
    $('press-url').value = safeString(p.url);
    $('press-visible').value = p.visible === false ? 'false' : 'true';
  }
  function persistPressEditor() {
    if (state.pressIndex < 0) return;
    var p = state.press[state.pressIndex] || {};
    p.source = $('press-source').value;
    if (!isObject(p.quotes_i18n)) p.quotes_i18n = {};
    if (!isObject(p.production_i18n)) p.production_i18n = {};
    p.quotes_i18n[state.lang] = safeString($('press-quote').value);
    p.production_i18n[state.lang] = safeString($('press-production').value);
    if (state.lang === 'en') {
      p.quote = p.quotes_i18n.en;
      p.production = p.production_i18n.en;
    } else {
      p.quote = safeString(p.quote || p.quotes_i18n.en || p.quotes_i18n[state.lang]);
      p.production = safeString(p.production || p.production_i18n.en || p.production_i18n[state.lang]);
    }
    p.url = $('press-url').value;
    p.visible = asBoolean($('press-visible').value, true);
    if (!p.id) p.id = Date.now();
    state.press[state.pressIndex] = p;
    renderPressList();
    markDirty(true);
  }
  function loadPress() {
    var pressBase = loadDoc('rg_press', null);
    if (!Array.isArray(pressBase)) {
      try {
        if (typeof state.api.getPress === 'function') pressBase = state.api.getPress();
      } catch (e) {}
    }
    if (!Array.isArray(pressBase)) pressBase = [];
    state.press = pressBase.map(function (p) {
      var item = isObject(p) ? clone(p) : {};
      if (!isObject(item.quotes_i18n)) item.quotes_i18n = {};
      if (!isObject(item.production_i18n)) item.production_i18n = {};
      return item;
    });
    state.pressIndex = -1;
    renderPressList();
    var meta = loadDoc('rg_press_meta', null);
    if (!isObject(meta)) {
      try {
        if (typeof state.api.getPressMeta === 'function') meta = state.api.getPressMeta();
      } catch (e) {}
    }
    if (!isObject(meta)) meta = {};
    $('press-translatedNote').value = safeString(meta[state.lang] && meta[state.lang].translatedNote);
    $('press-showReviewsSection').value = meta.showReviewsSection === false ? 'false' : 'true';
    var uiStored = loadDoc('rg_ui_' + state.lang, null);
    var uiFallback = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(state.lang);
        if (isObject(t)) uiFallback = t;
      }
    } catch (e) {}
    $('press-reviewsIntro').value = pickStoredOrFallback(uiStored, uiFallback, 'reviewsIntro');
    state.publicPdfs = safePublicPdfs(loadDoc('rg_public_pdfs', {}));
    loadPressPdfsIntoUi();
    state.epkBios = safeEpkBios(loadDoc('rg_epk_bios', {}));
    loadEpkBiosIntoUi();
    state.epkPhotos = safeEpkPhotos(loadDoc('rg_epk_photos', []));
    state.epkPhotoIndex = -1;
    renderEpkPhotoList();
    state.epkCvs = safeEpkCvs(loadDoc('rg_epk_cvs', {}));
    state.epkCvsTemp = {};
    renderEpkCvsUi();
    togglePressTab(state.pressTab || 'quotes');
  }
  function savePressMeta() {
    var meta = loadDoc('rg_press_meta', {});
    if (!meta[state.lang]) meta[state.lang] = {};
    meta[state.lang].translatedNote = safeString($('press-translatedNote').value);
    meta.showReviewsSection = $('press-showReviewsSection').value !== 'false';
    saveDoc('rg_press_meta', meta);
    try {
      localStorage.setItem('rg_press_meta', JSON.stringify(meta));
      localStorage.setItem('rg_local_rg_press_meta', JSON.stringify({ ts: Date.now(), value: meta }));
    } catch (e) {}
    var ui = loadDoc('rg_ui_' + state.lang, {});
    ui.reviewsIntro = safeString($('press-reviewsIntro').value);
    saveDoc('rg_ui_' + state.lang, ui);
  }
  function savePressQuotes() {
    state.press = state.press.filter(function (p) { return isObject(p); });
    saveDoc('rg_press', state.press);
    try {
      localStorage.setItem('rg_press', JSON.stringify(state.press));
      localStorage.setItem('rg_local_rg_press', JSON.stringify({ ts: Date.now(), value: state.press }));
    } catch (e) {}
  }
  function savePressPdfs() {
    persistPressPdfsFromUi();
    saveDoc('rg_public_pdfs', state.publicPdfs);
    // Compatibility mirror for public pages that read plain localStorage key directly.
    try {
      localStorage.setItem('rg_public_pdfs', JSON.stringify(state.publicPdfs));
    } catch (e) {}
  }
  function saveEpkBios() {
    persistEpkBiosFromUi();
    saveDoc('rg_epk_bios', state.epkBios);
  }
  function saveEpkPhotos() {
    state.epkPhotos = safeEpkPhotos(state.epkPhotos);
    saveDoc('rg_epk_photos', state.epkPhotos);
    try {
      localStorage.setItem('rg_epk_photos', JSON.stringify(state.epkPhotos));
      localStorage.setItem('rg_local_rg_epk_photos', JSON.stringify({ ts: Date.now(), value: state.epkPhotos }));
    } catch (e) {}
  }

  function loadContact() {
    var stored = loadDoc('contact_' + state.lang, null);
    var fallback = getLegacySection('contact');
    $('contact-title').value = pickStoredOrFallback(stored, fallback, 'title');
    $('contact-sub').value = pickStoredOrFallback(stored, fallback, 'sub');
    $('contact-email').value = pickStoredOrFallback(stored, fallback, 'email');
    $('contact-emailBtn').value = pickStoredOrFallback(stored, fallback, 'emailBtn');
    $('contact-webBtn').value = pickStoredOrFallback(stored, fallback, 'webBtn');
  }
  function saveContact() {
    saveDoc('contact_' + state.lang, {
      title: safeString($('contact-title').value),
      sub: safeString($('contact-sub').value),
      email: safeString($('contact-email').value),
      emailBtn: safeString($('contact-emailBtn').value),
      webBtn: safeString($('contact-webBtn').value)
    });
  }

  function loadUiJson() {
    var d = loadDoc('rg_ui_' + state.lang, null);
    if (!isObject(d)) {
      try {
        if (typeof state.api.uiTable === 'function') {
          var t = state.api.uiTable(state.lang);
          if (isObject(t)) d = t;
        }
      } catch (e) {}
    }
    if (!isObject(d)) d = {};
    $('ui-json').value = JSON.stringify(d, null, 2);
  }
  function saveUiJson() {
    try {
      var parsed = JSON.parse($('ui-json').value || '{}');
      if (!isObject(parsed)) throw new Error('El JSON debe ser un objeto');
      saveDoc('rg_ui_' + state.lang, parsed);
    } catch (e) {
      setStatus('JSON inválido: ' + e.message, 'err');
      alert('JSON inválido: ' + e.message);
    }
  }

  function bindInputsDirty(ids, handler) {
    ids.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('input', function () {
        if (handler) handler();
        else markDirty(true);
      });
    });
  }

  function buildExportPayload() {
    var keys = [
      'rg_rep_cards','rg_vid','rg_perfs','rg_press','rg_press_meta','rg_epk_bios','rg_epk_photos','rg_epk_cvs','rg_public_pdfs','rg_photos','rg_photo_captions',
      'rg_programs','rg_programs_en','rg_programs_de','rg_programs_es','rg_programs_it','rg_programs_fr',
      'rg_editorial_en','rg_editorial_de','rg_editorial_es','rg_editorial_it','rg_editorial_fr',
      'hero_en','hero_de','hero_es','hero_it','hero_fr',
      'bio_en','bio_de','bio_es','bio_it','bio_fr',
      'rep_en','rep_de','rep_es','rep_it','rep_fr',
      'perf_en','perf_de','perf_es','perf_it','perf_fr',
      'contact_en','contact_de','contact_es','contact_it','contact_fr',
      'rg_ui_en','rg_ui_de','rg_ui_es','rg_ui_it','rg_ui_fr'
    ];
    var data = {};
    keys.forEach(function (k) {
      var v = state.api.load(k);
      if (v != null) data[k] = v;
    });
    return { exportedAt: new Date().toISOString(), origin: 'admin-v2', keys: Object.keys(data), data: data };
  }

  function downloadJson(filename, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  function setupEvents() {
    $('import-preview').value = [
      'System / Tools panel',
      '',
      'Purpose:',
      '- Import diagnostics and compatibility preview',
      '- Maintenance actions (restore current section / open legacy admin)',
      '- Export guidance (use topbar Export JSON)',
      '',
      'When you choose a JSON file in topbar Import:',
      '- this panel shows compatible keys and count',
      '- then asks confirmation before writing any data'
    ].join('\n');

    $('menuBtn').addEventListener('click', function () { $('sidebar').classList.toggle('open'); });
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () { openSection(btn.getAttribute('data-section')); });
    });
    $('langSelect').addEventListener('change', function () {
      if (!hasUnsavedChangesPrompt('Cambiar de idioma')) {
        $('langSelect').value = state.lang;
        return;
      }
      state.lang = $('langSelect').value;
      if (typeof state.api.setLang === 'function') state.api.setLang(state.lang, { persist: false });
      updateLangBadge();
      refreshCurrentSection();
      markDirty(false, 'Idioma activo: ' + state.lang.toUpperCase());
    });

    $('saveHeroBtn').addEventListener('click', saveHome);
    $('saveBioBtn').addEventListener('click', saveBio);
    $('saveRepHeaderBtn').addEventListener('click', saveRepHeader);
    $('saveRepCardsBtn').addEventListener('click', saveRepCards);
    $('programs-save').addEventListener('click', savePrograms);
    $('savePerfHeaderBtn').addEventListener('click', savePerfHeader);
    $('savePerfEventsBtn').addEventListener('click', savePerfEvents);
    $('mediaTabVideos').addEventListener('click', function () { toggleMediaTab('videos'); });
    $('mediaTabPhotos').addEventListener('click', function () { toggleMediaTab('photos'); });
    $('media-vid-save').addEventListener('click', saveMediaVideos);
    $('media-photo-save').addEventListener('click', saveMediaPhotos);
    $('pressTabQuotes').addEventListener('click', function () { togglePressTab('quotes'); });
    $('pressTabPdfs').addEventListener('click', function () { togglePressTab('pdfs'); });
    $('pressTabBios').addEventListener('click', function () { togglePressTab('bios'); });
    $('pressTabPhotos').addEventListener('click', function () { togglePressTab('photos'); });
    $('pressTabCvs').addEventListener('click', function () { togglePressTab('cvs'); });
    $('savePressMetaBtn').addEventListener('click', savePressMeta);
    $('savePressQuotesBtn').addEventListener('click', savePressQuotes);
    $('savePressPdfsBtn').addEventListener('click', savePressPdfs);
    $('savePressBiosBtn').addEventListener('click', saveEpkBios);
    $('savePressPhotosBtn').addEventListener('click', saveEpkPhotos);
    $('savePressCvsBtn').addEventListener('click', saveEpkCvs);
    $('saveContactBtn').addEventListener('click', saveContact);
    $('reloadUiBtn').addEventListener('click', loadUiJson);
    $('saveUiBtn').addEventListener('click', saveUiJson);

    $('rep-cat-filter').addEventListener('change', renderRepList);
    $('rep-add').addEventListener('click', function () {
      state.repCards.push({ composer: '', opera: '', role: '', cat: 'opera', lang: 'IT' });
      state.repIndex = state.repCards.length - 1;
      renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-dup').addEventListener('click', function () {
      if (state.repIndex < 0) return;
      state.repCards.splice(state.repIndex + 1, 0, clone(state.repCards[state.repIndex]));
      state.repIndex += 1; renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-del').addEventListener('click', function () {
      if (state.repIndex < 0) return;
      if (!window.confirm('¿Borrar item de Repertoire seleccionado?')) return;
      state.repCards.splice(state.repIndex, 1);
      state.repIndex = Math.max(0, state.repIndex - 1); renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-up').addEventListener('click', function () {
      var i = state.repIndex; if (i <= 0) return;
      var t = state.repCards[i - 1]; state.repCards[i - 1] = state.repCards[i]; state.repCards[i] = t;
      state.repIndex = i - 1; renderRepList(); markDirty(true);
    });
    $('rep-down').addEventListener('click', function () {
      var i = state.repIndex; if (i < 0 || i >= state.repCards.length - 1) return;
      var t = state.repCards[i + 1]; state.repCards[i + 1] = state.repCards[i]; state.repCards[i] = t;
      state.repIndex = i + 1; renderRepList(); markDirty(true);
    });

    $('programs-add').addEventListener('click', function () {
      var arr = state.programsDoc.programs;
      var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
      arr.push({ id: maxId + 1, order: arr.length, published: true, title: '', description: '', formations: [], duration: '', idealFor: [] });
      state.programsIndex = arr.length - 1;
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Programa creado');
    });
    $('programs-dup').addEventListener('click', function () {
      if (state.programsIndex < 0) return;
      var arr = state.programsDoc.programs;
      var src = clone(arr[state.programsIndex]);
      var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
      src.id = maxId + 1;
      arr.splice(state.programsIndex + 1, 0, src);
      state.programsIndex += 1;
      normalizeProgramOrders();
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Programa duplicado');
    });
    $('programs-del').addEventListener('click', function () {
      if (state.programsIndex < 0) return;
      if (!window.confirm('¿Borrar programa seleccionado?')) return;
      state.programsDoc.programs.splice(state.programsIndex, 1);
      state.programsIndex = Math.max(0, state.programsIndex - 1);
      normalizeProgramOrders();
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Programa borrado');
    });
    $('programs-up').addEventListener('click', function () {
      var i = state.programsIndex; if (i <= 0) return;
      var arr = state.programsDoc.programs;
      var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
      state.programsIndex = i - 1;
      normalizeProgramOrders();
      renderProgramsList(); markDirty(true, 'Orden programs actualizado');
    });
    $('programs-down').addEventListener('click', function () {
      var i = state.programsIndex;
      var arr = state.programsDoc.programs;
      if (i < 0 || i >= arr.length - 1) return;
      var t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
      state.programsIndex = i + 1;
      normalizeProgramOrders();
      renderProgramsList(); markDirty(true, 'Orden programs actualizado');
    });

    $('perf-add').addEventListener('click', function () {
      state.perfs.push({ title: '', detail: '', day: '', month: '', time: '', venue: '', city: '', status: 'upcoming', type: 'concert', sortDate: '' });
      state.perfIndex = state.perfs.length - 1; renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-dup').addEventListener('click', function () {
      if (state.perfIndex < 0) return;
      state.perfs.splice(state.perfIndex + 1, 0, clone(state.perfs[state.perfIndex]));
      state.perfIndex += 1; renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-del').addEventListener('click', function () {
      if (state.perfIndex < 0) return;
      if (!window.confirm('¿Borrar evento seleccionado?')) return;
      state.perfs.splice(state.perfIndex, 1);
      state.perfIndex = Math.max(0, state.perfIndex - 1); renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-up').addEventListener('click', function () {
      var i = state.perfIndex; if (i <= 0) return;
      var t = state.perfs[i - 1]; state.perfs[i - 1] = state.perfs[i]; state.perfs[i] = t;
      state.perfIndex = i - 1; renderPerfList(); markDirty(true);
    });
    $('perf-down').addEventListener('click', function () {
      var i = state.perfIndex; if (i < 0 || i >= state.perfs.length - 1) return;
      var t = state.perfs[i + 1]; state.perfs[i + 1] = state.perfs[i]; state.perfs[i] = t;
      state.perfIndex = i + 1; renderPerfList(); markDirty(true);
    });

    $('press-add').addEventListener('click', function () {
      state.press.push({ id: Date.now(), source: '', quote: '', production: '', url: '', visible: true, order: state.press.length });
      state.pressIndex = state.press.length - 1; renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-dup').addEventListener('click', function () {
      if (state.pressIndex < 0) return;
      var n = clone(state.press[state.pressIndex]); n.id = Date.now();
      state.press.splice(state.pressIndex + 1, 0, n); state.pressIndex += 1; renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-del').addEventListener('click', function () {
      if (state.pressIndex < 0) return;
      if (!window.confirm('¿Borrar quote seleccionada?')) return;
      state.press.splice(state.pressIndex, 1); state.pressIndex = Math.max(0, state.pressIndex - 1); renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-up').addEventListener('click', function () {
      var i = state.pressIndex; if (i <= 0) return;
      var t = state.press[i - 1]; state.press[i - 1] = state.press[i]; state.press[i] = t;
      state.pressIndex = i - 1; renderPressList(); markDirty(true);
    });
    $('press-down').addEventListener('click', function () {
      var i = state.pressIndex; if (i < 0 || i >= state.press.length - 1) return;
      var t = state.press[i + 1]; state.press[i + 1] = state.press[i]; state.press[i] = t;
      state.pressIndex = i + 1; renderPressList(); markDirty(true);
    });
    $('epk-photo-add-url').addEventListener('click', function () {
      var url = window.prompt('URL de foto EPK');
      if (!url) return;
      var clean = safeString(url).trim();
      if (!clean) return;
      state.epkPhotos.push({ url: clean, label: '', credit: '' });
      state.epkPhotoIndex = state.epkPhotos.length - 1;
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo agregada');
    });
    $('epk-photo-add-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.epkPhotos.push({ url: safeString(ev.target.result), label: '', credit: '' });
        state.epkPhotoIndex = state.epkPhotos.length - 1;
        renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo subida');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('epk-photo-replace-file').addEventListener('change', function (e) {
      if (state.epkPhotoIndex < 0) return;
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.epkPhotos[state.epkPhotoIndex].url = safeString(ev.target.result);
        renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo reemplazada');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('epk-photo-dup').addEventListener('click', function () {
      if (state.epkPhotoIndex < 0) return;
      state.epkPhotos.splice(state.epkPhotoIndex + 1, 0, clone(state.epkPhotos[state.epkPhotoIndex]));
      state.epkPhotoIndex += 1;
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo duplicada');
    });
    $('epk-photo-del').addEventListener('click', function () {
      if (state.epkPhotoIndex < 0) return;
      if (!window.confirm('¿Borrar EPK photo seleccionada?')) return;
      state.epkPhotos.splice(state.epkPhotoIndex, 1);
      state.epkPhotoIndex = Math.max(0, state.epkPhotoIndex - 1);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo borrada');
    });
    $('epk-photo-up').addEventListener('click', function () {
      var i = state.epkPhotoIndex; if (i <= 0) return;
      var t = state.epkPhotos[i - 1]; state.epkPhotos[i - 1] = state.epkPhotos[i]; state.epkPhotos[i] = t;
      state.epkPhotoIndex = i - 1;
      renderEpkPhotoList(); markDirty(true, 'Orden EPK photos actualizado');
    });
    $('epk-photo-down').addEventListener('click', function () {
      var i = state.epkPhotoIndex; if (i < 0 || i >= state.epkPhotos.length - 1) return;
      var t = state.epkPhotos[i + 1]; state.epkPhotos[i + 1] = state.epkPhotos[i]; state.epkPhotos[i] = t;
      state.epkPhotoIndex = i + 1;
      renderEpkPhotoList(); markDirty(true, 'Orden EPK photos actualizado');
    });

    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      $('epk-cv-file-' + L).addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!/\.pdf$/i.test(file.name || '') && file.type !== 'application/pdf') {
          alert('Only PDF files are allowed.');
          e.target.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('File is too large (max 5MB).');
          e.target.value = '';
          return;
        }
        var reader = new FileReader();
        reader.onload = function (ev) {
          var raw = safeString(ev.target.result);
          var b64 = raw.split(',')[1] || '';
          if (!b64) {
            alert('Invalid PDF payload.');
            return;
          }
          state.epkCvsTemp[L] = b64;
          renderEpkCvsUi();
          markDirty(true, 'CV ' + L + ' cargado');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
      $('epk-cv-clear-' + L).addEventListener('click', function () {
        if (!window.confirm('Remove custom CV for ' + L + '?')) return;
        delete state.epkCvsTemp[L];
        delete state.epkCvs[L];
        renderEpkCvsUi();
        markDirty(true, 'CV ' + L + ' marcado para eliminar');
      });
    });

    $('media-vid-add').addEventListener('click', function () {
      state.vidData.videos.push({ id: '', tag: '', title: '', sub: '', composer: '', repertoireCat: '', hidden: false, group: 'opera_lied', featured: false, customThumb: '' });
      state.vidIndex = state.vidData.videos.length - 1;
      renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video creado');
    });
    $('media-vid-dup').addEventListener('click', function () {
      if (state.vidIndex < 0) return;
      state.vidData.videos.splice(state.vidIndex + 1, 0, clone(state.vidData.videos[state.vidIndex]));
      state.vidIndex += 1; renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video duplicado');
    });
    $('media-vid-del').addEventListener('click', function () {
      if (state.vidIndex < 0) return;
      if (!window.confirm('¿Borrar video seleccionado?')) return;
      state.vidData.videos.splice(state.vidIndex, 1);
      state.vidIndex = Math.max(0, state.vidIndex - 1); renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video borrado');
    });
    $('media-vid-up').addEventListener('click', function () {
      var i = state.vidIndex; if (i <= 0) return;
      var t = state.vidData.videos[i - 1]; state.vidData.videos[i - 1] = state.vidData.videos[i]; state.vidData.videos[i] = t;
      state.vidIndex = i - 1; renderMediaVideosList(); markDirty(true, 'Orden videos actualizado');
    });
    $('media-vid-down').addEventListener('click', function () {
      var i = state.vidIndex; if (i < 0 || i >= state.vidData.videos.length - 1) return;
      var t = state.vidData.videos[i + 1]; state.vidData.videos[i + 1] = state.vidData.videos[i]; state.vidData.videos[i] = t;
      state.vidIndex = i + 1; renderMediaVideosList(); markDirty(true, 'Orden videos actualizado');
    });

    ['s', 't', 'b'].forEach(function (type) {
      $('media-photo-filter-' + type).addEventListener('click', function () { setPhotoType(type); });
    });
    $('media-photo-add-url').addEventListener('click', function () {
      var url = window.prompt('URL de imagen');
      if (!url) return;
      var clean = safeString(url).trim();
      if (!clean) return;
      state.photosData[state.photoType].push(clean);
      state.photoIndex = state.photosData[state.photoType].length - 1;
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto agregada');
    });
    $('media-photo-add-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.photosData[state.photoType].push(safeString(ev.target.result));
        state.photoIndex = state.photosData[state.photoType].length - 1;
        renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto subida');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('media-photo-replace-file').addEventListener('change', function (e) {
      if (state.photoIndex < 0) return;
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.photosData[state.photoType][state.photoIndex] = safeString(ev.target.result);
        renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto reemplazada');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('media-photo-dup').addEventListener('click', function () {
      if (state.photoIndex < 0) return;
      var arr = state.photosData[state.photoType];
      arr.splice(state.photoIndex + 1, 0, arr[state.photoIndex]);
      var cap = clone(getPhotoCaption(state.photoType, state.photoIndex));
      state.photoIndex += 1;
      setPhotoCaption(state.photoType, state.photoIndex, cap.caption, cap.photographer);
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto duplicada');
    });
    $('media-photo-del').addEventListener('click', function () {
      if (state.photoIndex < 0) return;
      if (!window.confirm('¿Borrar foto seleccionada?')) return;
      state.photosData[state.photoType].splice(state.photoIndex, 1);
      shiftPhotoCaptionsAfterDelete(state.photoType, state.photoIndex);
      state.photoIndex = Math.max(0, state.photoIndex - 1);
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto borrada');
    });
    $('media-photo-up').addEventListener('click', function () {
      var i = state.photoIndex; if (i <= 0) return;
      var arr = state.photosData[state.photoType];
      var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
      var cA = clone(getPhotoCaption(state.photoType, i - 1));
      var cB = clone(getPhotoCaption(state.photoType, i));
      setPhotoCaption(state.photoType, i - 1, cB.caption, cB.photographer);
      setPhotoCaption(state.photoType, i, cA.caption, cA.photographer);
      state.photoIndex = i - 1;
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Orden fotos actualizado');
    });
    $('media-photo-down').addEventListener('click', function () {
      var i = state.photoIndex; var arr = state.photosData[state.photoType];
      if (i < 0 || i >= arr.length - 1) return;
      var t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
      var cA = clone(getPhotoCaption(state.photoType, i));
      var cB = clone(getPhotoCaption(state.photoType, i + 1));
      setPhotoCaption(state.photoType, i, cB.caption, cB.photographer);
      setPhotoCaption(state.photoType, i + 1, cA.caption, cA.photographer);
      state.photoIndex = i + 1;
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Orden fotos actualizado');
    });

    bindInputsDirty(['rep-composer','rep-opera','rep-role','rep-cat','rep-status','rep-lang','rep-category'], persistRepEditor);
    bindInputsDirty(['programs-item-title','programs-item-description','programs-item-formations','programs-item-duration','programs-item-idealFor','programs-item-published'], persistProgramsEditor);
    bindInputsDirty(['perf-title','perf-detail','perf-day','perf-month','perf-time','perf-venue','perf-city','perf-venuePhoto','perf-venueOpacity','perf-status','perf-type','perf-sortDate'], persistPerfEditor);
    bindInputsDirty(['press-source','press-quote','press-production','press-url','press-visible'], persistPressEditor);
    bindInputsDirty(['pdf-dossier-EN','pdf-artist-EN','pdf-dossier-DE','pdf-artist-DE','pdf-dossier-ES','pdf-artist-ES','pdf-dossier-IT','pdf-artist-IT','pdf-dossier-FR','pdf-artist-FR'], function () { persistPressPdfsFromUi(); markDirty(true, 'Public PDFs editados'); });
    bindInputsDirty(['epk-bio-b50','epk-bio-b150','epk-bio-b300p1','epk-bio-b300p2','epk-bio-b300p3','epk-bio-b300p4'], function () { persistEpkBiosFromUi(); markDirty(true, 'EPK bios editadas'); });
    bindInputsDirty(['epk-photo-url','epk-photo-label','epk-photo-credit'], persistEpkPhotoEditor);
    bindInputsDirty(['media-vid-id','media-vid-title','media-vid-sub','media-vid-tag','media-vid-composer','media-vid-group','media-vid-repertoireCat','media-vid-customThumb','media-vid-featured','media-vid-hidden'], persistMediaVideoEditor);
    bindInputsDirty(['media-vid-h2']);
    bindInputsDirty(['media-photo-url','media-photo-caption','media-photo-photographer'], persistMediaPhotoEditor);

    bindInputsDirty(['hero-eyebrow','hero-subtitle','hero-cta1','hero-cta2','hero-bgImage','hero-introImage'], function () {
      updateHomeIntroPreview();
      markDirty(true);
    });
    bindInputsDirty(['bio-h2','bio-p1','bio-p2','bio-quote','bio-cite','bio-portraitImage'], function () {
      updateBioPortraitPreview();
      markDirty(true);
    });
    bindInputsDirty(['rep-h2','rep-intro','programs-title','programs-subtitle','programs-intro','programs-closingNote','programs-repLink','programs-epkLink','perf-h2','perf-intro','press-translatedNote','press-reviewsIntro','press-showReviewsSection','contact-title','contact-sub','contact-email','contact-emailBtn','contact-webBtn','ui-json']);

    $('bio-portraitUpload').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        $('bio-portraitImage').value = safeString(ev.target.result);
        updateBioPortraitPreview();
        markDirty(true, 'Imagen de Biography actualizada');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('hero-introUpload').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        $('hero-introImage').value = safeString(ev.target.result);
        updateHomeIntroPreview();
        markDirty(true, 'Imagen Home intro actualizada');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    $('exportBtn').addEventListener('click', function () {
      downloadJson('rg_admin_export_v2.json', buildExportPayload());
      setStatus('Export completado', 'ok');
    });
    $('openPublicBtn').addEventListener('click', function () { window.open('index.html', '_blank', 'noopener'); });
    $('openLegacyBtn').addEventListener('click', function () { window.open('admin.html', '_blank', 'noopener'); });
    $('restoreCurrentBtn').addEventListener('click', function () {
      if (typeof state.api.restoreDefaults !== 'function') return alert('restoreDefaults no disponible');
      var map = { home: 'hero', bio: 'bio', rep: 'repertoire', programs: 'programs', calendar: 'calendar', media: 'videos', press: 'press', contact: 'contact', ui: 'site-ui' };
      var s = map[state.section];
      if (!s) return;
      if (!confirm('¿Restaurar defaults de la sección actual?\nEsta acción puede sobreescribir datos guardados.')) return;
      state.api.restoreDefaults(s);
      refreshCurrentSection();
      markDirty(false, 'Defaults restaurados');
    });

    $('importInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var payload = JSON.parse(String(r.result || '{}'));
          var data = payload.data || {};
          if (!isObject(data)) throw new Error('data debe ser objeto');
          var keys = Object.keys(data).filter(function (k) { return SAFE_IMPORT_KEY_RE.test(k); });
          $('import-preview').value = JSON.stringify({ keys: keys, count: keys.length }, null, 2);
          if (!keys.length) throw new Error('No se encontraron keys compatibles');
          if (!window.confirm('Importar ' + keys.length + ' keys compatibles. ¿Continuar?')) return;
          keys.forEach(function (k) {
            validateKeyValue(k, data[k]);
            state.api.save(k, data[k]);
          });
          refreshCurrentSection();
          markDirty(false, 'Import aplicado');
          alert('Import aplicado: ' + keys.length + ' keys');
        } catch (err) {
          setStatus('Import inválido: ' + err.message, 'err');
          alert('Import inválido: ' + err.message);
        }
      };
      r.readAsText(f);
    });

    window.addEventListener('beforeunload', function (evt) {
      if (!state.dirty) return;
      evt.preventDefault();
      evt.returnValue = '';
    });
  }

  async function init() {
    try {
      window.adm2SignInGoogle = signInGoogle;
      window.adm2SignOut = signOut;
      initAuth();
      await handleRedirectResult();
      if ($('adm2SignInBtn')) {
        $('adm2SignInBtn').addEventListener('click', signInGoogle);
      }
      if ($('adm2SignOutBtn')) $('adm2SignOutBtn').addEventListener('click', signOut);
      if ($('adm2TopSignOutBtn')) $('adm2TopSignOutBtn').addEventListener('click', signOut);
      await awaitAuthorizedUser();
      setStatus('Conectando bridge…', 'warn');
      state.api = await waitForLegacyApi();
      var lang = (state.api.currentLang && LANGS.indexOf(state.api.currentLang) >= 0) ? state.api.currentLang : 'en';
      state.lang = lang;
      $('langSelect').value = lang;
      updateLangBadge();
      state.ready = true;
      setStatus('Bridge listo · ' + lang.toUpperCase(), 'ok');
      setupEvents();
      refreshCurrentSection();
    } catch (e) {
      setStatus('Error bridge', 'err');
      setAuthError('No se pudo iniciar admin-v2: ' + e.message, e);
    }
  }

  init();
})();
