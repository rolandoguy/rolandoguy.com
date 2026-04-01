(function () {
  'use strict';

  var LANGS = ['en', 'de', 'es', 'it', 'fr'];
  var ADMIN_ALLOWLIST_EMAILS = ['rolandoguy@gmail.com'];
  var AUTH_REDIRECT_PENDING_KEY = 'adm2_redirect_pending';
  var AUTH_REDIRECT_PENDING_TS_KEY = 'adm2_redirect_pending_ts';
  var AUTH_SAFARI_RESTORE_FAILED_KEY = 'adm2_safari_restore_failed';
  var AUTH_REDIRECT_GRACE_MS = 8000;
  var AUTH_REDIRECT_PENDING_TTL_MS = 15 * 60 * 1000;
  var firebaseAuth = null;
  var authDebugState = {
    browserClass: 'non-safari',
    authMode: 'popup',
    redirectProcessed: 'no',
    persistenceSet: 'no',
    persistenceType: 'unknown',
    redirectPending: 'no',
    authState: 'pending',
    currentUserPresent: 'no',
    email: '—',
    allowlist: 'no',
    gate: 'locked',
    failure: ''
  };
  var SAFE_IMPORT_KEY_RE = /^(hero|bio|rep|perf|contact|rg_ui|rg_editorial)_(en|de|es|it|fr)$|^(rg_rep_cards|rg_perfs|rg_past_perfs|rg_press|rg_press_meta|rg_vid|rg_epk_bios|rg_epk_photos|rg_epk_cvs|rg_public_pdfs|rg_photos|rg_photo_captions|rg_programs|rg_programs_en|rg_programs_de|rg_programs_es|rg_programs_it|rg_programs_fr|programs_en|programs_de|programs_es|programs_it|programs_fr)$/;
  var PRESS_IMPORT_KEYS = { rg_press: true, rg_press_meta: true, rg_epk_bios: true, rg_epk_photos: true, rg_epk_cvs: true, rg_public_pdfs: true };
  var activityLog = [];
  var state = {
    lang: 'en',
    section: 'home',
    dirty: false,
    api: null,
    repCards: [],
    repIndex: -1,
    perfs: [],
    perfIndex: -1,
    pastPerfs: [],
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
    repSearch: '',
    repStatusFilter: 'all',
    repSelected: {},
    mediaVidSearch: '',
    mediaVidFilter: 'all',
    mediaVidSelected: {},
    mediaPhotoSearch: '',
    pressSearch: '',
    pressVisibleFilter: 'all',
    pressSelected: {},
    perfStatusFilter: 'all',
    perfSelected: {},
    epkPhotoSearch: '',
    sectionUndo: {},
    sectionDraftCache: {},
    focusMode: false,
    ready: false,
    bioPortraitDefault: '',
    bioLoadNonce: 0,
    homeIntroDefault: '',
    homeLoadNonce: 0,
    siteHealthSnapshot: null,
    siteHealthEffectiveLang: 'en',
    siteHealthRenderToken: 0,
    bridgeReadyAt: 0,
    translationMissingOnly: false,
    programsWorkflowFilter: 'all',
    programsSelected: {},
    pressWorkflowFilter: 'all',
    mediaVidWorkflowFilter: 'all',
    perfWorkflowFilter: 'all',
    repWorkflowFilter: 'all',
    pastPerfsSelected: {}
  };

  function $(id) { return document.getElementById(id); }
  function isSafariBrowser() {
    var ua = String((window.navigator && window.navigator.userAgent) || '');
    var isWebKit = /WebKit/i.test(ua);
    var isSafari = /Safari/i.test(ua);
    var excluded = /(CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Chromium|Android)/i.test(ua);
    return isWebKit && isSafari && !excluded;
  }
  function shouldUseRedirectAuth() {
    // Legacy admin uses popup as canonical flow.
    // Keep redirect only as fallback when popup is blocked.
    return false;
  }
  function buildLegacySignInUrl() {
    var returnTo = 'admin-v2.html';
    try {
      returnTo = window.location.pathname.split('/').pop() || 'admin-v2.html';
    } catch (e) {}
    return 'admin.html?return=' + encodeURIComponent(returnTo);
  }
  function setAuthError(message, err) {
    var code = safeString(err && err.code).trim();
    var msg = safeString(err && err.message).trim();
    var full = safeString(message);
    if (code) full += ' [' + code + ']';
    if (msg) full += ' ' + msg;
    setAuthDebug({ failure: code || msg || 'unknown-error' });
    setAuthGate(false, firebaseAuth ? firebaseAuth.currentUser : null, full);
  }
  function getRedirectPending() {
    try {
      if (sessionStorage.getItem(AUTH_REDIRECT_PENDING_KEY) === '1') return true;
      var tsRaw = localStorage.getItem(AUTH_REDIRECT_PENDING_TS_KEY);
      var ts = Number(tsRaw || 0);
      if (!Number.isFinite(ts) || ts <= 0) return false;
      return (Date.now() - ts) < AUTH_REDIRECT_PENDING_TTL_MS;
    } catch (e) {
      return false;
    }
  }
  function setRedirectPending(flag) {
    try {
      if (flag) {
        sessionStorage.setItem(AUTH_REDIRECT_PENDING_KEY, '1');
        localStorage.setItem(AUTH_REDIRECT_PENDING_TS_KEY, String(Date.now()));
      } else {
        sessionStorage.removeItem(AUTH_REDIRECT_PENDING_KEY);
        localStorage.removeItem(AUTH_REDIRECT_PENDING_TS_KEY);
      }
    } catch (e) {}
    setAuthDebug({ redirectPending: getRedirectPending() ? 'yes' : 'no' });
  }
  function markSafariRestoreFailed(flag) {
    try {
      if (flag) localStorage.setItem(AUTH_SAFARI_RESTORE_FAILED_KEY, '1');
      else localStorage.removeItem(AUTH_SAFARI_RESTORE_FAILED_KEY);
    } catch (e) {}
  }
  function hasSafariRestoreFailed() {
    try {
      return localStorage.getItem(AUTH_SAFARI_RESTORE_FAILED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }
  function refreshAuthRuntimeDebug(user) {
    setAuthDebug({
      redirectPending: getRedirectPending() ? 'yes' : 'no',
      currentUserPresent: user ? 'yes' : 'no'
    });
  }
  function renderAuthDebug() {
    var card = document.querySelector('.auth-card');
    if (!card) return;
    var el = $('adm2AuthDebug');
    if (!el) {
      el = document.createElement('p');
      el.id = 'adm2AuthDebug';
      el.className = 'muted';
      el.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      el.style.fontSize = '12px';
      el.style.lineHeight = '1.4';
      var anchor = $('adm2AuthMsg');
      if (anchor && anchor.parentNode) anchor.insertAdjacentElement('afterend', el);
      else card.appendChild(el);
    }
    el.textContent =
      'AUTH debug: browserClass=' + safeString(authDebugState.browserClass) +
      ' authMode=' + safeString(authDebugState.authMode) +
      ' persistenceType=' + safeString(authDebugState.persistenceType) +
      ' redirectProcessed=' + safeString(authDebugState.redirectProcessed) +
      ' authState=' + safeString(authDebugState.authState) +
      ' currentUserPresent=' + safeString(authDebugState.currentUserPresent) +
      ' allowlist=' + safeString(authDebugState.allowlist) +
      ' gate=' + safeString(authDebugState.gate) +
      (authDebugState.failure ? ' reason=' + safeString(authDebugState.failure) : '');
  }
  function setAuthDebug(patch) {
    if (patch && typeof patch === 'object') {
      Object.keys(patch).forEach(function (k) {
        authDebugState[k] = patch[k];
      });
    }
    renderAuthDebug();
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
    refreshAuthRuntimeDebug(user || (firebaseAuth ? firebaseAuth.currentUser : null));
    setAuthDebug({
      email: user && user.email ? user.email : '—',
      allowlist: isAdminUser(user) ? 'yes' : 'no',
      gate: unlocked ? 'unlocked' : 'locked'
    });
  }
  function setBestAuthPersistence() {
    if (!firebaseAuth || !firebase.auth || !firebase.auth.Auth || !firebase.auth.Auth.Persistence) {
      setAuthDebug({ persistenceSet: 'no', persistenceType: 'unavailable' });
      return Promise.resolve(false);
    }
    var P = firebase.auth.Auth.Persistence;
    // Match legacy: prefer LOCAL persistence, then fallback.
    var candidates = [
      { id: P.LOCAL, label: 'local' },
      { id: P.SESSION, label: 'session' },
      { id: P.NONE, label: 'none' }
    ];
    var i = 0;
    function next() {
      if (i >= candidates.length) {
        setAuthDebug({ persistenceSet: 'no', persistenceType: 'failed' });
        return Promise.resolve(false);
      }
      var c = candidates[i++];
      return firebaseAuth.setPersistence(c.id).then(function () {
        setAuthDebug({ persistenceSet: 'yes', persistenceType: c.label });
        return true;
      }).catch(function () {
        return next();
      });
    }
    return next();
  }
  function initAuth() {
    if (typeof firebase === 'undefined') {
      setAuthError('Authentication is unavailable (Firebase failed to load).');
      return Promise.resolve(false);
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
      return setBestAuthPersistence();
    } catch (e) {
      setAuthError('Authentication is unavailable (Firebase init failed).', e);
      return Promise.resolve(false);
    }
  }
  function signInGoogle() {
    setAuthDebug({ authMode: 'legacy-gateway', failure: '' });
    setAuthGate(false, firebaseAuth ? firebaseAuth.currentUser : null, 'Opening legacy admin sign-in…');
    window.location.href = buildLegacySignInUrl();
    return false;
  }
  function handleRedirectResult() {
    if (!firebaseAuth || typeof firebaseAuth.getRedirectResult !== 'function') {
      setAuthDebug({ redirectProcessed: 'no', failure: 'redirect-api-unavailable' });
      return Promise.resolve();
    }
    if (!getRedirectPending()) {
      setAuthDebug({ redirectProcessed: 'n/a' });
      return Promise.resolve();
    }
    setAuthDebug({ authMode: 'redirect', redirectProcessed: 'no', authState: 'pending', failure: '' });
    return firebaseAuth.getRedirectResult().then(function (res) {
      setAuthDebug({ redirectProcessed: 'yes', authState: res && res.user ? 'signed-in' : 'signed-out' });
      refreshAuthRuntimeDebug((res && res.user) || (firebaseAuth ? firebaseAuth.currentUser : null));
      if (res && res.user) {
        setRedirectPending(false);
        setAuthGate(false, res.user, 'Redirect sign-in completed. Verifying access…');
      }
    }).catch(function (err) {
      setAuthError('Redirect sign-in failed on return.', err);
    });
  }
  function signOut() {
    if (!firebaseAuth) return;
    setRedirectPending(false);
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
        refreshAuthRuntimeDebug(user);
        setAuthDebug({
          authState: user ? 'signed-in' : 'signed-out',
          email: user && user.email ? user.email : '—',
          allowlist: ok ? 'yes' : 'no'
        });
        if (!user) {
          setAuthGate(false, null, 'Login is handled via legacy admin. Use "Sign in via legacy admin".');
          return;
        }
        setRedirectPending(false);
        if (!ok) {
          setAuthDebug({ failure: 'allowlist-denied' });
          setAuthGate(false, user, 'This account is not authorized for this admin panel.');
          return;
        }
        setAuthDebug({ failure: '' });
        setAuthGate(true, user, 'Signed in.');
        resolve(user);
      }, function () {
        setAuthDebug({ failure: 'auth-state-listener-failed' });
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
    if (flag) setStatus(hint || 'Unsaved changes', 'warn');
    else setStatus(hint || 'Saved', 'ok');
    if (flag) saveLocalDraftForCurrentSection();
    else clearLocalDraftForCurrentSection();
  }
  function ensureReady() {
    if (!state.ready || !state.api) throw new Error('Admin data bridge is not ready.');
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
    return window.confirm(nextAction + '\n\nYou have unsaved changes. Continue anyway?');
  }
  var ADM2_CLOSEOUT_KEY = 'adm2_closeout_v1';
  var ADM2_CLOSEOUT_CHECKBOX_IDS = ['closeout-backup', 'closeout-health', 'closeout-publishing', 'closeout-pdfs', 'closeout-spotcheck'];
  function readCloseoutState() {
    try {
      var raw = sessionStorage.getItem(ADM2_CLOSEOUT_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
    } catch (e) {
      return {};
    }
  }
  function writeCloseoutState(obj) {
    try {
      sessionStorage.setItem(ADM2_CLOSEOUT_KEY, JSON.stringify(obj || {}));
    } catch (e) {}
  }
  function syncCloseoutCheckbox(id, on) {
    var el = $(id);
    if (el) el.checked = !!on;
  }
  function touchCloseoutStep(stepKey) {
    var id = 'closeout-' + stepKey;
    if (!$(id)) return;
    syncCloseoutCheckbox(id, true);
    var d = readCloseoutState();
    d[id] = true;
    writeCloseoutState(d);
  }
  function wireCloseoutChecklist() {
    var stored = readCloseoutState();
    ADM2_CLOSEOUT_CHECKBOX_IDS.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.checked = !!stored[id];
      el.addEventListener('change', function () {
        var d = readCloseoutState();
        d[id] = !!el.checked;
        writeCloseoutState(d);
      });
    });
    if ($('closeout-reset')) {
      $('closeout-reset').addEventListener('click', function () {
        try { sessionStorage.removeItem(ADM2_CLOSEOUT_KEY); } catch (e) {}
        ADM2_CLOSEOUT_CHECKBOX_IDS.forEach(function (nid) { syncCloseoutCheckbox(nid, false); });
      });
    }
  }
  function isBlank(v) {
    return !safeString(v).trim();
  }
  function isValidEmail(v) {
    var s = safeString(v).trim();
    if (!s) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }
  function isValidHttpUrl(v) {
    var s = safeString(v).trim();
    if (!s) return true;
    return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(s);
  }
  function setPillStatus(id, kind, text) {
    var el = $(id);
    if (!el) return;
    el.classList.remove('ok', 'warn', 'err');
    if (kind) el.classList.add(kind);
    el.textContent = text;
  }
  function setValidationText(id, ok, text) {
    var el = $(id);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('ok', !!ok);
    el.classList.toggle('err', !ok);
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
            return finish(new Error('Legacy admin is missing setLang(). Reload admin.html and try again.'));
          }
          return finish(null, w);
        }
        if (tries > 220) return finish(new Error('Timed out waiting for legacy admin (admin.html).'));
        setTimeout(check, 50);
      }
      frame.addEventListener('load', check, { once: true });
      check();
    });
  }

  function validateKeyValue(key, val) {
    if (val === undefined) throw new Error('Cannot save undefined (' + key + ')');
    if (typeof val === 'function') throw new Error('Cannot save a function (' + key + ')');
    if (key === 'rg_rep_cards' || key === 'rg_perfs' || key === 'rg_past_perfs' || key === 'rg_press') {
      if (!Array.isArray(val)) throw new Error(key + ' must be an array');
    }
    if (key === 'rg_vid') {
      if (!isObject(val)) throw new Error('rg_vid must be an object');
      if (!Array.isArray(val.videos)) throw new Error('rg_vid.videos must be an array');
    }
    if (key === 'rg_photos') {
      if (!isObject(val)) throw new Error('rg_photos must be an object');
      ['s', 't', 'b'].forEach(function (k) {
        if (!Array.isArray(val[k])) throw new Error('rg_photos.' + k + ' must be an array');
      });
    }
    if (key === 'rg_photo_captions' && !isObject(val)) throw new Error('rg_photo_captions must be an object');
    if (key === 'rg_epk_photos' && !Array.isArray(val)) throw new Error('rg_epk_photos must be an array');
    if (key === 'rg_epk_bios' && !isObject(val)) throw new Error('rg_epk_bios must be an object');
    if (key === 'rg_epk_cvs') {
      if (!isObject(val)) throw new Error('rg_epk_cvs must be an object');
      Object.keys(val).forEach(function (k) {
        if (typeof val[k] !== 'string') throw new Error('rg_epk_cvs.' + k + ' must be a base64 string');
      });
    }
    if (key === 'rg_public_pdfs' && !isObject(val)) throw new Error('rg_public_pdfs must be an object');
    if (
      key.indexOf('hero_') === 0 || key.indexOf('bio_') === 0 || key.indexOf('rep_') === 0 ||
      key.indexOf('perf_') === 0 || key.indexOf('contact_') === 0 || key.indexOf('rg_ui_') === 0
    ) {
      if (!isObject(val)) throw new Error(key + ' must be an object');
    }
    if (key === 'rg_press_meta' && !isObject(val)) throw new Error('rg_press_meta must be an object');
    if (key.indexOf('rg_programs_') === 0) {
      if (!isObject(val)) throw new Error(key + ' must be an object');
      if (!Array.isArray(val.programs)) throw new Error(key + '.programs must be an array');
    }
    if (key.indexOf('rg_editorial_') === 0 && !isObject(val)) throw new Error(key + ' must be an object');
  }

  function loadDoc(key, fb) {
    ensureReady();
    var v = state.api.load(key);
    if (v == null) return clone(fb);
    if (Array.isArray(fb) && !Array.isArray(v)) {
      setStatus('Unexpected shape for ' + key + ' — using safe default', 'warn');
      return clone(fb);
    }
    if (isObject(fb) && !isObject(v)) {
      setStatus('Unexpected shape for ' + key + ' — using safe default', 'warn');
      return clone(fb);
    }
    return clone(v);
  }
  function humanStorageKeyLine(key) {
    var k = safeString(key);
    if (/^hero_/.test(k)) return 'Home / Hero (' + k.replace(/^hero_/, '').toUpperCase() + ')';
    if (/^bio_/.test(k)) return 'Biography (' + k.replace(/^bio_/, '').toUpperCase() + ')';
    if (/^rep_/.test(k)) return 'Repertoire intro (' + k.replace(/^rep_/, '').toUpperCase() + ')';
    if (k === 'rg_rep_cards') return 'Repertoire cards (shared list)';
    if (/^programs_/.test(k)) return 'Programs (legacy slot · ' + k + ')';
    if (/^rg_programs/.test(k)) {
      var rest = k.replace(/^rg_programs/, '').replace(/^_/, '');
      return 'Programs (' + (rest ? rest.toUpperCase() : 'default') + ')';
    }
    if (/^rg_editorial_/.test(k)) return 'Programs · context links (' + k.replace(/^rg_editorial_/, '').toUpperCase() + ')';
    if (/^perf_/.test(k)) return 'Calendar intro (' + k.replace(/^perf_/, '').toUpperCase() + ')';
    if (k === 'rg_perfs') return 'Calendar events';
    if (k === 'rg_past_perfs') return 'Past performances (public list)';
    if (k === 'rg_vid') return 'Media · videos';
    if (k === 'rg_photos') return 'Media · photos';
    if (k === 'rg_photo_captions') return 'Media · photo captions';
    if (k === 'rg_press') return 'Press · quotes';
    if (k === 'rg_press_meta') return 'Press · section notes';
    if (k === 'rg_epk_bios') return 'EPK bios';
    if (k === 'rg_epk_photos') return 'EPK photos';
    if (k === 'rg_epk_cvs') return 'EPK CVs';
    if (k === 'rg_public_pdfs') return 'Public PDF links';
    if (/^contact_/.test(k)) return 'Contact (' + k.replace(/^contact_/, '').toUpperCase() + ')';
    if (/^rg_ui_/.test(k)) return 'UI / translations (' + k.replace(/^rg_ui_/, '').toUpperCase() + ')';
    return k;
  }
  function pushActivitySummary(title, lines) {
    activityLog.unshift({ t: Date.now(), title: safeString(title), lines: lines || [] });
    if (activityLog.length > 5) activityLog.pop();
    var el = $('activitySummary');
    if (!el) return;
    el.textContent = activityLog.map(function (e) {
      var ts = new Date(e.t).toLocaleString();
      return e.title + ' · ' + ts + (e.lines && e.lines.length ? '\n' + e.lines.join('\n') : '');
    }).join('\n\n');
  }
  function getImportScopeValue() {
    return $('importScope') ? safeString($('importScope').value).trim() || 'all' : 'all';
  }
  function getImportScopeLabel() {
    var sel = $('importScope');
    if (!sel || sel.selectedIndex < 0) return 'All compatible content';
    return safeString(sel.options[sel.selectedIndex].textContent) || sel.value;
  }
  function escapeHtml(v) {
    return safeString(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function getStoredDocRaw(key, fallback) {
    try {
      if (!state.api || typeof state.api.load !== 'function') return clone(fallback);
      var v = state.api.load(key);
      if (v == null) return clone(fallback);
      return clone(v);
    } catch (e) {
      return clone(fallback);
    }
  }
  function siteHealthKeyList() {
    return [
      'hero_en','hero_de','hero_es','hero_it','hero_fr',
      'bio_en','bio_de','bio_es','bio_it','bio_fr',
      'contact_en','contact_de','contact_es','contact_it','contact_fr',
      'rg_ui_en','rg_ui_de','rg_ui_es','rg_ui_it','rg_ui_fr',
      'rg_programs','rg_programs_en','rg_programs_de','rg_programs_es','rg_programs_it','rg_programs_fr',
      'rg_perfs','rg_vid','rg_photos','rg_press','rg_public_pdfs'
    ];
  }
  function buildSiteHealthSnapshot() {
    var out = {};
    siteHealthKeyList().forEach(function (k) {
      out[k] = getStoredDocRaw(k, null);
    });
    return out;
  }
  function getSiteHealthDoc(snapshot, key, fallback) {
    if (!snapshot || !hasOwn(snapshot, key) || snapshot[key] == null) return clone(fallback);
    return clone(snapshot[key]);
  }
  /** Same resolution order as the Programs editor: rg_programs_<lang>, then legacy getPrograms(), then EN rg_programs. Use snapshot for rg_* reads in Site Health; pass null to read live storage (editor). */
  function resolveProgramsDocForLang(lang, snapshot) {
    var byLang = snapshot
      ? getSiteHealthDoc(snapshot, 'rg_programs_' + lang, null)
      : loadDoc('rg_programs_' + lang, null);
    if (isObject(byLang) && Array.isArray(byLang.programs)) return safeProgramsDoc(byLang);
    try {
      if (typeof state.api.getPrograms === 'function') {
        var effective = state.api.getPrograms();
        if (isObject(effective) && Array.isArray(effective.programs)) return safeProgramsDoc(effective);
      }
    } catch (e) {}
    if (lang === 'en') {
      var legacy = snapshot
        ? getSiteHealthDoc(snapshot, 'rg_programs', null)
        : loadDoc('rg_programs', null);
      if (isObject(legacy) && Array.isArray(legacy.programs)) return safeProgramsDoc(legacy);
    }
    return safeProgramsDoc({ title: '', subtitle: '', intro: '', closingNote: '', programs: [] });
  }
  function getProgramsForHealth(snapshot, lang) {
    return resolveProgramsDocForLang(lang, snapshot);
  }
  function waitMs(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }
  function stableJsonStringify(val) {
    if (val === null || typeof val !== 'object') return JSON.stringify(val);
    if (Array.isArray(val)) return '[' + val.map(function (x) { return stableJsonStringify(x); }).join(',') + ']';
    var keys = Object.keys(val).sort();
    return '{' + keys.map(function (k) {
      return JSON.stringify(k) + ':' + stableJsonStringify(val[k]);
    }).join(',') + '}';
  }
  function snapshotHash(snapshot) {
    try { return stableJsonStringify(snapshot || {}); } catch (e) { return ''; }
  }
  function siteHealthSnapshotLooksUnhydrated(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return true;
    var nonNull = 0;
    siteHealthKeyList().forEach(function (k) {
      if (snapshot[k] != null) nonNull += 1;
    });
    return nonNull === 0;
  }
  async function ensureSiteHealthHydratedStable() {
    var bridgeAt = state.bridgeReadyAt || Date.now();
    await waitMs(Math.max(0, 4000 - (Date.now() - bridgeAt)));
    var phase1Start = Date.now();
    var phase1MaxMs = 25000;
    while (Date.now() - phase1Start < phase1MaxMs) {
      var probe = buildSiteHealthSnapshot();
      if (!siteHealthSnapshotLooksUnhydrated(probe)) break;
      await waitMs(250);
    }
    var consecutiveSame = 0;
    var lastHash = '';
    var lastSnap = null;
    var phase2Start = Date.now();
    var phase2MaxMs = 15000;
    while (Date.now() - phase2Start < phase2MaxMs) {
      var cur = buildSiteHealthSnapshot();
      var h = snapshotHash(cur);
      if (h === lastHash) {
        consecutiveSame += 1;
        lastSnap = cur;
        if (consecutiveSame >= 3) {
          state.siteHealthSnapshot = cur;
          return;
        }
      } else {
        lastHash = h;
        lastSnap = cur;
        consecutiveSame = 1;
      }
      await waitMs(200);
    }
    state.siteHealthSnapshot = lastSnap || buildSiteHealthSnapshot();
  }
  function showSiteHealthPlaceholder() {
    state.siteHealthSnapshot = null;
    var overall = $('sitehealth-overall');
    if (overall) {
      overall.classList.remove('ok', 'err', 'info');
      overall.classList.add('warn');
      overall.textContent = 'Click Run checks now';
    }
    var sb = $('sitehealth-section-status');
    if (sb) sb.innerHTML = '<p class="muted">Checks use saved content only and run when you click the button (not automatically on open).</p>';
    var mb = $('sitehealth-lang-matrix');
    if (mb) mb.innerHTML = '';
    var ib = $('sitehealth-issues');
    if (ib) ib.innerHTML = '<div class="empty-state">No check run yet.</div>';
  }
  function scoreStatus(missingCount, hardFail) {
    if (hardFail) return 'err';
    if (missingCount > 0) return 'warn';
    return 'ok';
  }
  function issuesCountByKind(list, kind) {
    return (list || []).filter(function (x) { return x && x.kind === kind; }).length;
  }
  function statusBadgeHtml(status, label) {
    return '<span class="pill ' + status + '">' + escapeHtml(label) + '</span>';
  }
  function languageSectionStatus(lang, snapshot) {
    var hero = getSiteHealthDoc(snapshot, 'hero_' + lang, {});
    var bio = getSiteHealthDoc(snapshot, 'bio_' + lang, {});
    var contact = getSiteHealthDoc(snapshot, 'contact_' + lang, {});
    var ui = getSiteHealthDoc(snapshot, 'rg_ui_' + lang, {});
    var programs = getProgramsForHealth(snapshot, lang);
    var out = {};
    var homeMissing = ['cta1', 'cta2'].filter(function (k) { return isBlank(hero[k]); }).length;
    out.home = scoreStatus(homeMissing, false);
    var bioMissing = ['h2', 'p1', 'p2'].filter(function (k) { return isBlank(bio[k]); }).length;
    out.bio = scoreStatus(bioMissing, false);
    var enPrograms = getProgramsForHealth(snapshot, 'en');
    var hasLocalPrograms = Array.isArray(programs.programs) && programs.programs.length > 0;
    var hasEnPrograms = Array.isArray(enPrograms.programs) && enPrograms.programs.length > 0;
    var programsMissing = isBlank(programs.title) ? 1 : 0;
    out.programs = lang === 'en'
      ? scoreStatus(programsMissing, !hasLocalPrograms)
      : (!hasLocalPrograms && !hasEnPrograms ? 'err' : scoreStatus(programsMissing, false));
    var contactMissing = ['title', 'sub', 'email'].filter(function (k) { return isBlank(contact[k]); }).length;
    out.contact = scoreStatus(contactMissing, (!isBlank(contact.email) && !isValidEmail(contact.email)));
    var navKeys = ['nav.home', 'nav.bio', 'nav.rep', 'nav.media', 'nav.cal', 'nav.epk', 'nav.book'];
    var uiMissing = navKeys.filter(function (k) { return isBlank(ui[k]); }).length;
    out.ui = uiMissing >= 3 ? 'warn' : (uiMissing > 0 ? 'ok' : 'ok');
    return out;
  }
  function applyHealthActionFromButton(btn) {
    if (!btn) return;
    if (!hasUnsavedChangesPrompt('Open issue location')) return;
    var lang = safeString(btn.getAttribute('data-lang')).trim();
    var section = safeString(btn.getAttribute('data-section')).trim();
    var pressTab = safeString(btn.getAttribute('data-press-tab')).trim();
    var mediaTab = safeString(btn.getAttribute('data-media-tab')).trim();
    var pressFilter = safeString(btn.getAttribute('data-press-filter')).trim();
    if (lang && LANGS.indexOf(lang) >= 0) {
      state.lang = lang;
      if ($('langSelect')) $('langSelect').value = lang;
      if (typeof state.api.setLang === 'function') state.api.setLang(lang, { persist: false });
      updateLangBadge();
    }
    if (section) openSection(section);
    if (section === 'press' && pressTab) togglePressTab(pressTab);
    if (section === 'media' && mediaTab) toggleMediaTab(mediaTab);
    if (section === 'press' && pressFilter && $('press-visible-filter')) {
      $('press-visible-filter').value = pressFilter;
      state.pressVisibleFilter = pressFilter;
      renderPressList();
    }
  }
  async function renderSiteHealth() {
    if (!state.ready || !state.api) return;
    var token = ++state.siteHealthRenderToken;
    var selLang = $('langSelect') ? safeString($('langSelect').value).trim().toLowerCase() : '';
    if (selLang && LANGS.indexOf(selLang) >= 0) {
      state.lang = selLang;
      state.siteHealthEffectiveLang = selLang;
      if (typeof state.api.setLang === 'function') state.api.setLang(selLang, { persist: false });
      updateLangBadge();
    } else {
      state.siteHealthEffectiveLang = safeString(state.lang || 'en');
    }
    await ensureSiteHealthHydratedStable();
    if (token !== state.siteHealthRenderToken) return;
    var snapshot = state.siteHealthSnapshot ? clone(state.siteHealthSnapshot) : {};
    var effectiveLang = safeString(state.siteHealthEffectiveLang || state.lang || 'en');
    var issues = [];
    var sectionStatus = {};
    var langs = LANGS.slice();
    var matrix = {};
    langs.forEach(function (lang) {
      matrix[lang] = languageSectionStatus(lang, snapshot);
    });
    var current = matrix[effectiveLang] || languageSectionStatus(effectiveLang, snapshot);
    sectionStatus['Home / Hero'] = current.home;
    sectionStatus['Biography'] = current.bio;
    sectionStatus['Programs'] = current.programs;
    sectionStatus['Contact'] = current.contact;
    sectionStatus['UI / labels'] = current.ui;
    var perfs = getSiteHealthDoc(snapshot, 'rg_perfs', []);
    if (!Array.isArray(perfs)) perfs = [];
    var perfUpcomingVisible = perfs.filter(function (e) { var s = safeString(e && e.status || 'upcoming'); return s !== 'past' && s !== 'hidden'; });
    var perfMissingCritical = perfUpcomingVisible.filter(function (e) { return isBlank(e && e.sortDate) || isBlank(e && e.time) || isBlank(e && e.venue); }).length;
    var perfPastMissing = perfs.filter(function (e) { return safeString(e && e.status) === 'past' && (isBlank(e && e.sortDate) || isBlank(e && e.time) || isBlank(e && e.venue)); }).length;
    var perfHidden = perfs.filter(function (e) { return safeString(e && e.status) === 'hidden'; }).length;
    sectionStatus['Calendar'] = perfMissingCritical > 0 ? 'err' : (perfPastMissing > 0 ? 'warn' : 'ok');
    if (perfMissingCritical) issues.push({ kind: 'err', text: perfMissingCritical + ' upcoming calendar events are missing date/time/venue.', action: { section: 'calendar' } });
    if (perfPastMissing) issues.push({ kind: 'info', text: perfPastMissing + ' past events are missing some details (optional cleanup).', action: { section: 'calendar' } });
    if (perfHidden) issues.push({ kind: 'info', text: perfHidden + ' calendar events are hidden intentionally.', action: { section: 'calendar', filter: 'hidden' } });
    var vid = safeMediaVideos(getSiteHealthDoc(snapshot, 'rg_vid', {}));
    var videos = Array.isArray(vid.videos) ? vid.videos : [];
    var vidsMissing = videos.filter(function (v) { return isBlank(v && v.id) || isBlank(v && v.title); }).length;
    var vidsHidden = videos.filter(function (v) { return !!(v && v.hidden); }).length;
    var photos = safePhotos(getSiteHealthDoc(snapshot, 'rg_photos', {}));
    var photoCount = (photos.s || []).length + (photos.t || []).length + (photos.b || []).length;
    sectionStatus['Media'] = vidsMissing ? 'warn' : (photoCount ? 'ok' : 'warn');
    if (vidsMissing) issues.push({ kind: 'warn', text: vidsMissing + ' videos are missing title or video ID.', action: { section: 'media', mediaTab: 'videos' } });
    if (!photoCount) issues.push({ kind: 'err', text: 'No media photos found.', action: { section: 'media', mediaTab: 'photos' } });
    if (vidsHidden) issues.push({ kind: 'info', text: vidsHidden + ' videos are currently hidden.', action: { section: 'media', mediaTab: 'videos' } });
    var press = getSiteHealthDoc(snapshot, 'rg_press', []);
    if (!Array.isArray(press)) press = [];
    var missingSource = 0;
    var missingTranslation = 0;
    var hiddenQuotes = 0;
    press.forEach(function (p) {
      var visible = !(p && p.visible === false);
      if (visible && isBlank(p && p.source)) missingSource += 1;
      var q = isObject(p && p.quotes_i18n) ? p.quotes_i18n[effectiveLang] : p && p.quote;
      if (visible && isBlank(q)) missingTranslation += 1;
      if (p && p.visible === false) hiddenQuotes += 1;
    });
    var pdfs = safePublicPdfs(getSiteHealthDoc(snapshot, 'rg_public_pdfs', {}));
    var invalidPdfs = [];
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      var d = safeString(pdfs.dossier[L] && pdfs.dossier[L].url).trim();
      var a = safeString(pdfs.artistSheet[L] && pdfs.artistSheet[L].url).trim();
      if (d && !isValidHttpUrl(d)) invalidPdfs.push('Dossier ' + L);
      if (a && !isValidHttpUrl(a)) invalidPdfs.push('Artist Sheet ' + L);
    });
    sectionStatus['Press / EPK'] = invalidPdfs.length ? 'err' : (missingSource + missingTranslation > 0 ? 'warn' : 'ok');
    if (missingSource) issues.push({ kind: 'warn', text: missingSource + ' visible press quotes are missing a source.', action: { section: 'press', pressTab: 'quotes' } });
    if (missingTranslation) issues.push({ kind: 'warn', text: missingTranslation + ' visible press quotes are missing ' + effectiveLang.toUpperCase() + ' text.', action: { section: 'press', pressTab: 'quotes' } });
    if (hiddenQuotes) issues.push({ kind: 'info', text: hiddenQuotes + ' press quotes are hidden intentionally.', action: { section: 'press', pressTab: 'quotes', pressFilter: 'hidden' } });
    if (invalidPdfs.length) issues.push({ kind: 'err', text: 'Invalid PDF URLs: ' + invalidPdfs.join(', ') + '.', action: { section: 'press', pressTab: 'pdfs' } });
    var homeCurrent = getSiteHealthDoc(snapshot, 'hero_' + effectiveLang, {});
    var homePrimaryMissing = ['cta1', 'cta2'].filter(function (k) { return isBlank(homeCurrent[k]); }).length;
    var homeIntroMissing = ['introCtaBio', 'introCtaMedia'].filter(function (k) { return isBlank(homeCurrent[k]); }).length;
    if (homePrimaryMissing) issues.push({ kind: 'warn', text: homePrimaryMissing + ' Home primary button label(s) are missing in ' + effectiveLang.toUpperCase() + '.', action: { section: 'home', lang: effectiveLang } });
    if (homeIntroMissing) issues.push({ kind: 'info', text: homeIntroMissing + ' Home intro CTA label(s) are missing in ' + effectiveLang.toUpperCase() + ' (optional but recommended).', action: { section: 'home', lang: effectiveLang } });
    var bioCurrent = getSiteHealthDoc(snapshot, 'bio_' + effectiveLang, {});
    var bioMissingCore = ['h2', 'p1', 'p2'].filter(function (k) { return isBlank(bioCurrent[k]); }).length;
    if (bioMissingCore) issues.push({ kind: 'warn', text: 'Biography is missing ' + bioMissingCore + ' core field(s) in ' + effectiveLang.toUpperCase() + '.', action: { section: 'bio', lang: effectiveLang } });
    var contactCurrent = getSiteHealthDoc(snapshot, 'contact_' + effectiveLang, {});
    if (!isBlank(contactCurrent.email) && !isValidEmail(contactCurrent.email)) issues.push({ kind: 'err', text: 'Contact email format looks invalid for ' + effectiveLang.toUpperCase() + '.', action: { section: 'contact', lang: effectiveLang } });
    var contactWebForHealth = safeString(contactCurrent.webUrl || contactCurrent.webBtn).trim();
    if (!isBlank(contactWebForHealth) && !isValidHttpUrl(contactWebForHealth)) issues.push({ kind: 'warn', text: 'Contact website URL format looks invalid for ' + effectiveLang.toUpperCase() + '.', action: { section: 'contact', lang: effectiveLang } });
    langs.forEach(function (lang) {
      var pdoc = getProgramsForHealth(snapshot, lang);
      var enDoc = getProgramsForHealth(snapshot, 'en');
      var hasLocal = Array.isArray(pdoc.programs) && pdoc.programs.length;
      var hasEn = Array.isArray(enDoc.programs) && enDoc.programs.length;
      if (!hasLocal) {
        issues.push({
          kind: lang === 'en' || !hasEn ? 'err' : 'warn',
          text: lang.toUpperCase() + ' programs list is empty' + (lang !== 'en' && hasEn ? ' (EN fallback may still show content).' : '.'),
          action: { section: 'programs', lang: lang }
        });
      }
    });
    if (effectiveLang !== 'en') {
      var heroEn = getSiteHealthDoc(snapshot, 'hero_en', {});
      var heroLocal = getSiteHealthDoc(snapshot, 'hero_' + effectiveLang, {});
      ['cta1', 'cta2', 'quickBioLabel', 'quickCalLabel'].forEach(function (k) {
        if (!isBlank(heroEn && heroEn[k]) && isBlank(heroLocal && heroLocal[k])) {
          issues.push({ kind: 'warn', text: 'EN has Home label "' + k + '" but ' + effectiveLang.toUpperCase() + ' is missing it.', action: { section: 'home', lang: effectiveLang } });
        }
      });
      var bioEn = getSiteHealthDoc(snapshot, 'bio_en', {});
      var bioLocal = getSiteHealthDoc(snapshot, 'bio_' + effectiveLang, {});
      ['h2', 'p1', 'p2'].forEach(function (k) {
        if (!isBlank(bioEn && bioEn[k]) && isBlank(bioLocal && bioLocal[k])) {
          issues.push({ kind: 'warn', text: 'EN biography has "' + k + '" but ' + effectiveLang.toUpperCase() + ' is missing it.', action: { section: 'bio', lang: effectiveLang } });
        }
      });
    }
    var langsUpper = ['EN', 'DE', 'ES', 'IT', 'FR'];
    langsUpper.forEach(function (L) {
      var d = safeString(pdfs.dossier[L] && pdfs.dossier[L].url).trim();
      var a = safeString(pdfs.artistSheet[L] && pdfs.artistSheet[L].url).trim();
      if ((!!d) !== (!!a)) {
        issues.push({ kind: 'info', text: 'PDF set is partial in ' + L + ' (one of Dossier / Artist Sheet is missing).', action: { section: 'press', pressTab: 'pdfs', lang: L.toLowerCase() } });
      }
    });
    var sectionOrder = ['Home / Hero', 'Biography', 'Programs', 'Calendar', 'Media', 'Press / EPK', 'Contact', 'UI / labels'];
    var sectionBox = $('sitehealth-section-status');
    if (sectionBox) {
      sectionBox.className = 'health-list';
      sectionBox.innerHTML = sectionOrder.map(function (name) {
        var st = sectionStatus[name] || 'ok';
        var label = st === 'ok' ? 'Complete' : (st === 'warn' ? 'Needs review' : 'Action needed');
        return '<div class="health-row"><span class="label">' + escapeHtml(name) + '</span>' + statusBadgeHtml(st, label) + '</div>';
      }).join('');
    }
    var matrixBox = $('sitehealth-lang-matrix');
    if (matrixBox) {
      var cols = ['home', 'bio', 'programs', 'contact', 'ui'];
      var colLabel = { home: 'Home', bio: 'Bio', programs: 'Programs', contact: 'Contact', ui: 'UI' };
      matrixBox.innerHTML = '<table class="health-matrix"><thead><tr><th>Language</th>' + cols.map(function (c) { return '<th>' + colLabel[c] + '</th>'; }).join('') + '</tr></thead><tbody>' +
        langs.map(function (lang) {
          return '<tr><th>' + lang.toUpperCase() + '</th>' + cols.map(function (c) {
            var st = matrix[lang][c];
            var dot = st === 'ok' ? '●' : (st === 'warn' ? '▲' : '■');
            var cls = st === 'ok' ? 'ok' : (st === 'warn' ? 'warn' : 'err');
            return '<td><span class="health-dot ' + cls + '">' + dot + '</span></td>';
          }).join('') + '</tr>';
        }).join('') +
        '</tbody></table>';
    }
    var normalizedIssues = issues.map(function (it) {
      var kind = safeString(it && it.kind).trim();
      if (kind !== 'err' && kind !== 'warn' && kind !== 'info') kind = 'warn';
      return { kind: kind, text: safeString(it && it.text), action: (it && it.action) || {} };
    });
    var issueBox = $('sitehealth-issues');
    if (issueBox) {
      if (!normalizedIssues.length) {
        issueBox.innerHTML = '<div class="empty-state">No issues detected right now.</div>';
      } else {
        issueBox.className = 'health-issues';
        issueBox.innerHTML = normalizedIssues.map(function (it, idx) {
          var action = it.action || {};
          return '<div class="health-issue ' + escapeHtml(it.kind || 'warn') + '"><span class="text">' + escapeHtml(it.text) + '</span><div class="actions"><button type="button" data-health-action="1" data-action-idx="' + idx + '"' +
            (action.section ? ' data-section="' + escapeHtml(action.section) + '"' : '') +
            (action.lang ? ' data-lang="' + escapeHtml(action.lang) + '"' : '') +
            (action.pressTab ? ' data-press-tab="' + escapeHtml(action.pressTab) + '"' : '') +
            (action.mediaTab ? ' data-media-tab="' + escapeHtml(action.mediaTab) + '"' : '') +
            (action.pressFilter ? ' data-press-filter="' + escapeHtml(action.pressFilter) + '"' : '') +
            '>Open</button></div></div>';
        }).join('');
      }
    }
    var errCount = issuesCountByKind(normalizedIssues, 'err');
    var warnCount = issuesCountByKind(normalizedIssues, 'warn');
    var infoCount = issuesCountByKind(normalizedIssues, 'info');
    var overall = $('sitehealth-overall');
    if (overall) {
      overall.classList.remove('ok', 'warn', 'err', 'info');
      if (errCount) {
        overall.classList.add('err');
        overall.textContent = errCount + ' high-risk issue(s) · ' + warnCount + ' warning(s)';
      } else if (warnCount) {
        overall.classList.add('warn');
        overall.textContent = warnCount + ' warning(s) · ' + infoCount + ' info item(s)';
      } else if (infoCount) {
        overall.classList.add('info');
        overall.textContent = infoCount + ' informational note(s)';
      } else {
        overall.classList.add('ok');
        overall.textContent = 'Healthy';
      }
    }
  }
  function importKeyMatchesScope(key, scope) {
    if (!scope || scope === 'all') return true;
    if (scope === 'home') return /^hero_/.test(key);
    if (scope === 'bio') return /^bio_/.test(key);
    if (scope === 'rep') return /^rep_/.test(key) || key === 'rg_rep_cards';
    if (scope === 'programs') return /^rg_programs/.test(key) || /^programs_/.test(key) || /^rg_editorial_/.test(key);
    if (scope === 'calendar') return /^perf_/.test(key) || key === 'rg_perfs' || key === 'rg_past_perfs';
    if (scope === 'media') return key === 'rg_vid' || key === 'rg_photos' || key === 'rg_photo_captions';
    if (scope === 'press') return !!PRESS_IMPORT_KEYS[key];
    if (scope === 'contact') return /^contact_/.test(key);
    if (scope === 'ui') return /^rg_ui_/.test(key);
    return false;
  }
  function filterImportKeys(keys, scope) {
    return keys.filter(function (k) { return importKeyMatchesScope(k, scope); });
  }
  function formatBackupFilename() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return 'rg-site-backup-' + d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '.json';
  }
  function createBackupNow() {
    ensureReady();
    var payload = buildExportPayload();
    var fname = formatBackupFilename();
    downloadJson(fname, payload);
    var ts = new Date(payload.exportedAt || Date.now()).toLocaleString();
    var lines = [
      'File: ' + fname,
      'Areas included: ' + payload.keys.length,
      'Languages, pages, programs, media, press, and other admin-managed content.'
    ];
    if ($('backupSummary')) $('backupSummary').textContent = 'Last backup: ' + ts + ' · ' + payload.keys.length + ' areas · saved to your Downloads folder.';
    setStatus('Backup downloaded', 'ok');
    pushActivitySummary('Backup created', lines);
  }
  function saveDoc(key, val) {
    ensureReady();
    validateKeyValue(key, val);
    state.api.save(key, clone(val));
    markDirty(false, 'Saved: ' + key);
    pushActivitySummary('Saved', [humanStorageKeyLine(key), 'Update sent to storage.']);
  }
  function getAuthIdToken() {
    if (!firebaseAuth || !firebaseAuth.currentUser || typeof firebaseAuth.currentUser.getIdToken !== 'function') {
      return Promise.resolve('');
    }
    return firebaseAuth.currentUser.getIdToken(true).catch(function () { return ''; });
  }
  function buildFirestoreHeroDocPayload(payload) {
    return {
      fields: {
        value: {
          stringValue: JSON.stringify(payload)
        }
      }
    };
  }
  function writeHeroDocToFirestore(key, payload) {
    var base = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/';
    var url = base + encodeURIComponent(key);
    return getAuthIdToken().then(function (token) {
      if (!token) return { ok: false, status: 0, reason: 'missing-id-token' };
      return fetch(url, {
        method: 'PATCH',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(buildFirestoreHeroDocPayload(payload))
      }).then(function (r) {
        return { ok: !!r.ok, status: Number(r.status || 0), reason: r.ok ? '' : 'http-' + String(r.status || 0) };
      }).catch(function () {
        return { ok: false, status: 0, reason: 'network-error' };
      });
    });
  }
  function readHeroDocFromFirestore(key) {
    var url = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/' + encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (doc) {
        var raw = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
        if (!raw || typeof raw !== 'string') return null;
        try { return JSON.parse(raw); } catch (e) { return null; }
      })
      .catch(function () { return null; });
  }

  function openSection(id) {
    if (!hasUnsavedChangesPrompt('Leave this section?')) return;
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
    else if (state.section === 'pastperfs') loadPastPerfsSection();
    else if (state.section === 'press') loadPress();
    else if (state.section === 'contact') loadContact();
    else if (state.section === 'ui') loadUiJson();
    else if (state.section === 'translation') {
      wireTranslationWorkspaceActions();
      refreshTranslationWorkspace();
    } else if (state.section === 'publishing') refreshPublishingDashboard();
    else if (state.section === 'sitehealth') showSiteHealthPlaceholder();
    if (state.section !== 'sitehealth' && state.section !== 'tools' && state.section !== 'translation' && state.section !== 'publishing' && state.section !== 'pastperfs') {
      maybeRestoreDraftForCurrentSection();
    }
    applyTranslationMissingOnlyMask();
  }

  function loadHome() {
    var nonce = ++state.homeLoadNonce;
    var stored = loadDoc('hero_' + state.lang, null);
    var fallback = getLegacySection('hero');
    var uiStored = loadDoc('rg_ui_' + state.lang, null);
    var uiFallback = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(state.lang);
        if (isObject(t)) uiFallback = t;
      }
    } catch (e) {}
    $('hero-eyebrow').value = pickStoredOrFallback(stored, fallback, 'eyebrow');
    $('hero-subtitle').value = pickStoredOrFallback(stored, fallback, 'subtitle');
    $('hero-cta1').value = pickStoredOrFallback(stored, fallback, 'cta1');
    $('hero-cta2').value = pickStoredOrFallback(stored, fallback, 'cta2');
    $('hero-quickBioLabel').value = pickStoredOrFallback(stored, fallback, 'quickBioLabel');
    $('hero-quickCalLabel').value = pickStoredOrFallback(stored, fallback, 'quickCalLabel');
    $('hero-introCtaBio').value = (isObject(stored) && safeString(stored.introCtaBio).trim()) ? safeString(stored.introCtaBio) : pickStoredOrFallback(uiStored, uiFallback, 'home.intro.ctaBio');
    $('hero-introCtaMedia').value = (isObject(stored) && safeString(stored.introCtaMedia).trim()) ? safeString(stored.introCtaMedia) : pickStoredOrFallback(uiStored, uiFallback, 'home.intro.ctaMedia');
    $('hero-bgImage').value = pickStoredOrFallback(stored, fallback, 'bgImage');
    // Keep preview blank until final source is resolved (no stale first paint).
    $('hero-introImage').value = '';
    updateHomeIntroPreview();
    updateHomeMiniPreviews();
    resolveHomeIntroFinal().then(function (resolved) {
      if (nonce !== state.homeLoadNonce) return;
      $('hero-introImage').value = safeString(resolved && resolved.url).trim();
      updateHomeIntroPreview();
      updateHomeMiniPreviews();
      updateCompletenessIndicators();
    });
    updateCompletenessIndicators();
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
  async function saveHome() {
    var applyAll = !!($('home-images-all-langs') && $('home-images-all-langs').checked);
    var heroKey = 'hero_' + state.lang;
    var payload = {
      eyebrow: safeString($('hero-eyebrow').value),
      subtitle: safeString($('hero-subtitle').value),
      cta1: safeString($('hero-cta1').value),
      cta2: safeString($('hero-cta2').value),
      quickBioLabel: safeString($('hero-quickBioLabel').value),
      quickCalLabel: safeString($('hero-quickCalLabel').value),
      introCtaBio: safeString($('hero-introCtaBio').value),
      introCtaMedia: safeString($('hero-introCtaMedia').value),
      bgImage: safeString($('hero-bgImage').value),
      introImage: normalizeHomeIntroImagePath(safeString($('hero-introImage').value).trim())
    };
    saveDoc(heroKey, payload);
    try {
      localStorage.setItem(heroKey, JSON.stringify(payload));
    } catch (e) {}
    var fsWrite = await writeHeroDocToFirestore(heroKey, payload);
    var fsReadBack = await readHeroDocFromFirestore(heroKey);
    var fsCta1 = safeString(fsReadBack && fsReadBack.cta1);
    var fsCta2 = safeString(fsReadBack && fsReadBack.cta2);
    void fsWrite;
    void fsCta1;
    void fsCta2;
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
    updateBioMiniPreview();
    loadBioPortraitDefault().then(function (src) {
      if (nonce !== state.bioLoadNonce) return;
      $('bio-portraitImage').value = resolveEffectiveBioPortrait(stored, storedEn, src);
      updateBioPortraitPreview();
      updateBioMiniPreview();
      updateCompletenessIndicators();
    });
    updateCompletenessIndicators();
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
    var statusFilter = state.repStatusFilter || 'all';
    var q = safeString(state.repSearch).toLowerCase().trim();
    var out = [];
    var wfRep = state.repWorkflowFilter || 'all';
    state.repCards.forEach(function (c, i) {
      if (!(cat === 'all' || (c.cat || 'opera') === cat)) return;
      var rowStatus = safeString(c.status).trim();
      if (statusFilter === 'none' && rowStatus) return;
      if (statusFilter !== 'all' && statusFilter !== 'none' && rowStatus !== statusFilter) return;
      if (q) {
        var hay = [c.composer, c.opera, c.role, c.lang].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
        if (hay.indexOf(q) < 0) return;
      }
      if (wfRep !== 'all') {
        var br = workflowBucketRep(c);
        if (wfRep === 'ready') {
          if (!repCardReadyCheck(c).ok || br === 'hidden') return;
        } else if (!passesWorkflowFilter(br, wfRep)) return;
      }
      out.push({ i: i, c: c });
    });
    return out;
  }
  function renderRepList() {
    var box = $('rep-list');
    var rows = repFiltered();
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No items match these filters. Add one with <strong>+ New</strong> or adjust filters.</div>';
      state.repIndex = -1;
      setSelectionCount('rep-selection-count', state.repSelected);
      renderRepEditor();
      return;
    }
    box.innerHTML = rows.map(function (r) {
      var title = (r.c.role ? r.c.role + ' — ' : '') + (r.c.opera || '(untitled)');
      var cls = r.i === state.repIndex ? 'item active' : 'item';
      var badges = [];
      if (isBlank(r.c.role) || isBlank(r.c.opera)) badges.push({ kind: 'warn', label: 'missing title' });
      if (safeString(r.c.editorialStatus)) badges.push({ kind: 'warn', label: safeString(r.c.editorialStatus) });
      var checked = state.repSelected[r.i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + r.i + '"><div class="item-row"><input class="row-select" data-idx="' + r.i + '" type="checkbox"' + checked + '><div class="item-main">' + title + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('rep-selection-count', state.repSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.repSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('rep-selection-count', state.repSelected);
      });
    });
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
    setSelectWithCustomValue('rep-cat', safeString(c.cat || 'opera'), 'opera');
    setSelectWithCustomValue('rep-status', safeString(c.status), '');
    $('rep-lang').value = safeString(c.lang);
    setSelectWithCustomValue('rep-category', safeString(c.category), '');
    setSelectWithCustomValue('rep-editorialStatus', safeString(c.editorialStatus || 'draft'), 'draft');
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
    c.editorialStatus = safeString($('rep-editorialStatus').value || 'draft');
    state.repCards[state.repIndex] = c;
    renderRepList();
    markDirty(true);
  }
  function loadRep() {
    var stored = loadDoc('rep_' + state.lang, null);
    var fallback = getLegacySection('rep');
    $('rep-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('rep-intro').value = pickStoredOrFallback(stored, fallback, 'intro');
    if ($('rep-cat-filter')) $('rep-cat-filter').value = $('rep-cat-filter').value || 'all';
    if ($('rep-status-filter')) $('rep-status-filter').value = state.repStatusFilter || 'all';
    if ($('rep-workflow-filter')) $('rep-workflow-filter').value = state.repWorkflowFilter || 'all';
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
        editorialStatus: safeString(p.editorialStatus || (p.published === false ? 'hidden' : 'draft')),
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
    return resolveProgramsDocForLang(lang, null);
  }
  function renderProgramsList() {
    var box = $('programs-list');
    var arr = state.programsDoc.programs;
    if (!arr.length) {
      box.innerHTML = '<div class="empty-state">No hay programas. Crea uno con "+ Nuevo".</div>';
      state.programsIndex = -1;
      setSelectionCount('programs-selection-count', state.programsSelected);
      renderProgramsEditor();
      return;
    }
    var listed = programsListedIndices();
    if (!listed.length) {
      box.innerHTML = '<div class="empty-state">No programs match this workflow filter.</div>';
      state.programsIndex = -1;
      setSelectionCount('programs-selection-count', state.programsSelected);
      renderProgramsEditor();
      return;
    }
    box.innerHTML = listed.map(function (i) {
      var p = arr[i];
      var cls = i === state.programsIndex ? 'item active' : 'item';
      var status = p.published ? 'published' : 'hidden';
      var title = safeString(p.title) || '(untitled)';
      var badges = [];
      if (isBlank(p.title)) badges.push({ kind: 'warn', label: 'missing title' });
      if (isBlank(p.description)) badges.push({ kind: 'warn', label: 'missing text' });
      if (!p.published) badges.push({ kind: 'err', label: 'hidden' });
      var wb = workflowBucketProgram(p);
      badges.push({ kind: 'warn', label: wb });
      if (state.programsWorkflowFilter === 'ready' && !programReadyCheck(p).ok) {
        badges.push({ kind: 'warn', label: 'not ready' });
      }
      var checked = state.programsSelected[i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + i + '"><div class="item-row"><input class="row-select" data-idx="' + i + '" type="checkbox"' + checked + '><div class="item-main">' + title + ' · ' + status + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('programs-selection-count', state.programsSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.programsSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('programs-selection-count', state.programsSelected);
      });
    });
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.programsIndex = Number(el.getAttribute('data-idx'));
        renderProgramsList();
        renderProgramsEditor();
      });
    });
    if (state.programsIndex < 0 || listed.indexOf(state.programsIndex) < 0) {
      state.programsIndex = listed[0];
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
    setSelectWithCustomValue('programs-item-editorialStatus', safeString(p.editorialStatus || 'draft'), 'draft');
    updateProgramsMiniPreview();
    applyTranslationMissingOnlyMask();
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
    p.editorialStatus = safeString($('programs-item-editorialStatus').value || 'draft');
    state.programsDoc.programs[state.programsIndex] = p;
    normalizeProgramOrders();
    renderProgramsList();
    updateProgramsMiniPreview();
    markDirty(true, 'Program updated');
  }
  function loadPrograms() {
    state.programsDoc = loadProgramsCanonicalForLang(state.lang);
    clearSelected(state.programsSelected);
    if ($('programs-workflow-filter')) $('programs-workflow-filter').value = state.programsWorkflowFilter || 'all';
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
    updateCompletenessIndicators();
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
    var filter = state.perfStatusFilter || 'all';
    var wfPerf = state.perfWorkflowFilter || 'all';
    var rows = state.perfs.map(function (e, i) { return { e: e, i: i }; }).filter(function (row) {
      if (filter === 'all') return true;
      return safeString(row.e.status || 'upcoming') === filter;
    }).filter(function (row) {
      if (wfPerf === 'all') return true;
      var b = workflowBucketPerf(row.e);
      if (wfPerf === 'ready') return perfReadyCheck(row.e).ok && safeString(row.e.status) !== 'hidden';
      return passesWorkflowFilter(b, wfPerf);
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay eventos. Crea uno con "+ Nuevo evento".</div>';
      state.perfIndex = -1;
      setSelectionCount('perf-selection-count', state.perfSelected);
      renderPerfEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var e = row.e;
      var i = row.i;
      var t = (e.day || '') + ' ' + (e.month || '') + ' · ' + (e.title || '(untitled)');
      var cls = i === state.perfIndex ? 'item active' : 'item';
      var checked = state.perfSelected[i] ? ' checked' : '';
      var st = safeString(e.editorialStatus || '');
      var badge = st ? badgesHtml([{ kind: 'warn', label: st }]) : '';
      return '<div class="' + cls + '" data-idx="' + i + '"><div class="item-row"><input class="row-select" data-idx="' + i + '" type="checkbox"' + checked + '><div class="item-main">' + t + badge + '</div></div></div>';
    }).join('');
    setSelectionCount('perf-selection-count', state.perfSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.perfSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('perf-selection-count', state.perfSelected);
      });
    });
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
    function localeFirst(base) {
      var lk = base + '_' + state.lang;
      var loc = safeString(e[lk]).trim();
      return loc || safeString(e[base]);
    }
    $('perf-title').value = safeString(e.title);
    $('perf-detail').value = localeFirst('detail');
    $('perf-day').value = safeString(e.day);
    $('perf-month').value = safeString(e.month);
    $('perf-dateDisplay').value = normalizeSortDateForInput(e.sortDate);
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
    setSelectWithCustomValue('perf-status', safeString(e.status), 'upcoming');
    setSelectWithCustomValue('perf-type', safeString(e.type), 'concert');
    setSelectWithCustomValue('perf-editorialStatus', safeString(e.editorialStatus || (safeString(e.status) === 'hidden' ? 'hidden' : 'draft')), 'draft');
    if ($('perf-modal-title')) $('perf-modal-title').value = safeString(e.title);
    if ($('perf-modal-type')) setSelectWithCustomValue('perf-modal-type', safeString(e.type), 'concert');
    if ($('perf-modal-venue')) $('perf-modal-venue').value = safeString(e.venue);
    if ($('perf-modal-city')) $('perf-modal-city').value = safeString(e.city);
    if ($('perf-modal-longdesc')) $('perf-modal-longdesc').value = localeFirst('extDesc');
    if ($('perf-modal-link')) $('perf-modal-link').value = localeFirst('eventLink');
    if ($('perf-modal-link-label')) $('perf-modal-link-label').value = localeFirst('eventLinkLabel');
    if ($('perf-modal-ticketPrice')) $('perf-modal-ticketPrice').value = safeString(e.ticketPrice);
    if ($('perf-modal-image')) $('perf-modal-image').value = safeString(e.modalImg);
    if ($('perf-modal-image-hide')) $('perf-modal-image-hide').value = e.modalImgHide ? 'true' : 'false';
    if ($('perf-modal-enabled')) {
      if (e.modalEnabled === true) $('perf-modal-enabled').value = 'true';
      else if (e.modalEnabled === false) $('perf-modal-enabled').value = 'false';
      else $('perf-modal-enabled').value = '';
    }
    if ($('perf-modal-flyerImg')) $('perf-modal-flyerImg').value = safeString(e.flyerImg);
    if ($('perf-modal-maps-link')) {
      var q = encodeURIComponent((safeString(e.venue).trim() || '') + (safeString(e.city).trim() ? (' ' + safeString(e.city).trim()) : ''));
      $('perf-modal-maps-link').value = q ? ('https://maps.google.com/?q=' + q) : '';
    }
    $('perf-sortDate').value = safeString(e.sortDate);
    updatePerfCardPreview();
    updatePerfPublicVisibilitySummary();
    updatePerfTranslationWarnings();
    syncPerfTxPicker();
  }
  function setSelectWithCustomValue(id, rawValue, fallback) {
    var el = $(id);
    if (!el) return;
    var v = safeString(rawValue).trim();
    if (!v) v = fallback;
    var has = false;
    Array.prototype.forEach.call(el.options || [], function (opt) {
      if (safeString(opt.value) === v) has = true;
    });
    if (!has) {
      var customOpt = document.createElement('option');
      customOpt.value = v;
      customOpt.textContent = v + ' (custom)';
      customOpt.setAttribute('data-custom', 'true');
      el.appendChild(customOpt);
    }
    el.value = v;
  }
  function normalizeSortDateForInput(raw) {
    var s = safeString(raw).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
  }
  function perfPreviewDateLabel() {
    var day = safeString($('perf-day').value).trim();
    var month = safeString($('perf-month').value).trim();
    if (day || month) return (day + ' ' + month).trim();
    var sort = normalizeSortDateForInput($('perf-sortDate').value);
    if (!sort) return 'Date';
    var parts = sort.split('-');
    return parts[2] + ' ' + parts[1];
  }
  function updatePerfCardPreview() {
    var title = safeString($('perf-title').value).trim();
    var detail = safeString($('perf-detail').value).trim();
    var venue = safeString($('perf-venue').value).trim();
    var city = safeString($('perf-city').value).trim();
    var bg = safeString($('perf-venuePhoto').value).trim();
    var op = parseInt($('perf-venueOpacity').value, 10);
    if (!Number.isFinite(op)) op = 50;
    if (op < 30) op = 30;
    if (op > 100) op = 100;
    $('perf-preview-date').textContent = perfPreviewDateLabel();
    $('perf-preview-title').textContent = title || 'Event title';
    $('perf-preview-detail').textContent = detail || 'Event detail';
    $('perf-preview-venue').textContent = ((venue || 'Venue') + ' · ' + (city || 'City'));
    $('perf-cardPreviewBg').style.backgroundImage = bg ? 'url("' + bg.replace(/"/g, '\\"') + '")' : 'none';
    $('perf-cardPreviewBg').style.opacity = String(op / 100);
  }
  function updatePerfPublicVisibilitySummary() {
    var box = $('perf-public-visibility');
    if (!box) return;
    var st = safeString($('perf-status') && $('perf-status').value).trim().toLowerCase();
    var es = safeString($('perf-editorialStatus') && $('perf-editorialStatus').value).trim().toLowerCase();
    var hiddenByStatus = st === 'hidden';
    var hiddenByEditorial = es === 'hidden' || es === 'draft' || es === 'needs_translation' || es === 'needs translation';
    if (hiddenByStatus || hiddenByEditorial) {
      box.textContent = 'Hidden from website';
      box.classList.remove('ok');
      box.classList.add('warn');
    } else {
      box.textContent = 'Visible on website';
      box.classList.remove('warn');
      box.classList.add('ok');
    }
  }
  function updatePerfTranslationWarnings() {
    var summary = $('perf-translation-status');
    var warnDetail = $('perf-detail-translation-warn');
    var warnExt = $('perf-modal-longdesc-translation-warn');
    var warnCtaLabel = $('perf-modal-link-label-translation-warn');
    var warnCtaUrl = $('perf-modal-link-translation-warn');
    if (!summary) return;
    var e = state.perfs[state.perfIndex] || {};
    var lang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var LANG_LABELS = { en: 'EN', de: 'DE', es: 'ES', it: 'IT', fr: 'FR' };
    var langLabel = LANG_LABELS[lang] || lang.toUpperCase();
    function setWarn(el, text) {
      if (!el) return;
      if (text) {
        el.textContent = text;
        el.style.display = '';
      } else {
        el.textContent = '';
        el.style.display = 'none';
      }
    }
    if (lang === 'en') {
      summary.className = 'translation-qa';
      summary.textContent = 'Translation status: EN baseline. Switch language to review localized event content.';
      summary.style.display = '';
      setWarn(warnDetail, '');
      setWarn(warnExt, '');
      setWarn(warnCtaLabel, '');
      setWarn(warnCtaUrl, '');
      return;
    }
    var detailLoc = safeString(e['detail_' + lang]).trim();
    var extLoc = safeString(e['extDesc_' + lang]).trim();
    var linkBase = safeString(e.eventLink).trim();
    var linkLoc = safeString(e['eventLink_' + lang]).trim();
    var labelLoc = safeString(e['eventLinkLabel_' + lang]).trim();
    var missing = [];
    if (!detailLoc) missing.push('Missing ' + langLabel + ' subtitle');
    if (!extLoc) missing.push('Missing ' + langLabel + ' modal text');
    if (linkBase && !labelLoc) missing.push('Missing ' + langLabel + ' CTA label');
    if (linkBase && !linkLoc) missing.push('Missing ' + langLabel + ' CTA URL');
    setWarn(warnDetail, !detailLoc ? ('Missing ' + langLabel + ' subtitle (detail_' + lang + ')') : '');
    setWarn(warnExt, !extLoc ? ('Missing ' + langLabel + ' modal text (extDesc_' + lang + ')') : '');
    setWarn(warnCtaLabel, (linkBase && !labelLoc) ? ('Missing ' + langLabel + ' CTA label (eventLinkLabel_' + lang + ')') : '');
    setWarn(warnCtaUrl, (linkBase && !linkLoc) ? ('Missing ' + langLabel + ' CTA URL (eventLink_' + lang + ')') : '');
    if (!missing.length) {
      summary.className = 'translation-qa muted ok';
      summary.textContent = 'Translation status: complete for ' + langLabel + '.';
    } else {
      summary.className = 'translation-qa';
      summary.innerHTML = '<strong>Translation status for this event (' + langLabel + '):</strong><ul><li>' + missing.join('</li><li>') + '</li></ul>';
    }
    summary.style.display = '';
  }
  function setPerfTxResult(text, kind) {
    var el = $('perf-tx-result');
    if (!el) return;
    el.className = 'muted' + (kind ? (' ' + kind) : '');
    el.textContent = safeString(text);
  }
  function syncPerfTxPicker() {
    var src = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    LANGS.forEach(function (L) {
      var box = $('perf-tx-lang-' + L);
      if (!box) return;
      box.disabled = (L === src);
      if (L === src) box.checked = false;
      else if (box.dataset.init !== '1') box.checked = true;
      box.dataset.init = '1';
    });
  }
  function getPerfTxSelectedTargets(sourceLang) {
    return LANGS.filter(function (L) {
      if (L === sourceLang) return false;
      var box = $('perf-tx-lang-' + L);
      return !!(box && box.checked);
    });
  }
  function collectPerfTxSource(e, sourceLang) {
    function pick(base) {
      var lk = base + '_' + sourceLang;
      var loc = safeString(e[lk]).trim();
      if (loc) return loc;
      return safeString(e[base]).trim();
    }
    return {
      detail: pick('detail'),
      extDesc: pick('extDesc'),
      eventLinkLabel: pick('eventLinkLabel'),
      eventLink: pick('eventLink')
    };
  }
  function applyPerfTxCopy(targetLangs, opts) {
    opts = opts || {};
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex] || {};
    var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var source = collectPerfTxSource(e, sourceLang);
    var includeUrl = !!opts.includeUrl;
    var fields = ['detail', 'extDesc', 'eventLinkLabel'].concat(includeUrl ? ['eventLink'] : []);
    var overwriteHits = [];
    targetLangs.forEach(function (L) {
      fields.forEach(function (base) {
        var tk = base + '_' + L;
        var incoming = safeString(source[base]).trim();
        var existing = safeString(e[tk]).trim();
        if (incoming && existing && existing !== incoming) overwriteHits.push(L.toUpperCase() + ':' + tk);
      });
    });
    if (overwriteHits.length) {
      var msg = 'This will overwrite ' + overwriteHits.length + ' non-empty localized field(s).\n\nContinue?\n\n' + overwriteHits.slice(0, 10).join(', ') + (overwriteHits.length > 10 ? '…' : '');
      if (!window.confirm(msg)) {
        setPerfTxResult('Copy cancelled.', 'warn');
        return;
      }
    }
    targetLangs.forEach(function (L) {
      fields.forEach(function (base) {
        e[base + '_' + L] = safeString(source[base]).trim();
      });
    });
    state.perfs[state.perfIndex] = e;
    renderPerfEditor();
    renderPerfList();
    markDirty(true, 'Calendar translation copy applied');
    updatePerfTranslationWarnings();
    setPerfTxResult(
      'Copied from ' + sourceLang.toUpperCase() + ' to: ' + targetLangs.map(function (L) { return L.toUpperCase(); }).join(', ') +
      (includeUrl ? ' (including URLs).' : ' (without URLs).'),
      'ok'
    );
  }
  function runPerfCopyCurrentToTargets(targetLangs) {
    if (state.perfIndex < 0) return;
    if (!targetLangs.length) {
      setPerfTxResult('No target languages selected.', 'warn');
      return;
    }
    persistPerfEditor();
    var e = state.perfs[state.perfIndex] || {};
    var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var source = collectPerfTxSource(e, sourceLang);
    var includeUrl = false;
    if (source.eventLink) {
      includeUrl = window.confirm('Copy localized CTA URLs as well?\n\nSelect "Cancel" to keep target URLs unchanged.');
    }
    applyPerfTxCopy(targetLangs, { includeUrl: includeUrl });
  }
  function copyPerfBaseToCurrentLang() {
    if (state.perfIndex < 0) return;
    var lang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var e = state.perfs[state.perfIndex] || {};
    var incoming = {
      detail: safeString(e.detail).trim(),
      extDesc: safeString(e.extDesc).trim(),
      eventLinkLabel: safeString(e.eventLinkLabel).trim(),
      eventLink: safeString(e.eventLink).trim()
    };
    var overwriteHits = [];
    Object.keys(incoming).forEach(function (base) {
      var tk = base + '_' + lang;
      var existing = safeString(e[tk]).trim();
      if (incoming[base] && existing && existing !== incoming[base]) overwriteHits.push(tk);
    });
    if (overwriteHits.length) {
      if (!window.confirm('Overwrite existing localized fields for ' + lang.toUpperCase() + '?\n\n' + overwriteHits.join(', '))) {
        setPerfTxResult('Copy cancelled.', 'warn');
        return;
      }
    }
    Object.keys(incoming).forEach(function (base) {
      e[base + '_' + lang] = incoming[base];
    });
    state.perfs[state.perfIndex] = e;
    renderPerfEditor();
    renderPerfList();
    markDirty(true, 'Copied base fields to current language');
    updatePerfTranslationWarnings();
    setPerfTxResult('Base fields copied to ' + lang.toUpperCase() + '.', 'ok');
  }
  function autoTranslatePerfFromCurrentLang() {
    if (state.perfIndex < 0) return;
    persistPerfEditor();
    var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var targetLangs = LANGS.filter(function (L) { return L !== sourceLang; });
    var translateFn = state.api && typeof state.api.translateText === 'function' ? state.api.translateText : null;
    if (!translateFn) {
      setPerfTxResult('Auto-translate helper is not available in this environment. UI is ready for future integration.', 'warn');
      return;
    }
    var e = state.perfs[state.perfIndex] || {};
    var src = collectPerfTxSource(e, sourceLang);
    var jobs = [];
    targetLangs.forEach(function (L) {
      ['detail', 'extDesc', 'eventLinkLabel'].forEach(function (base) {
        if (!safeString(src[base]).trim()) return;
        jobs.push(
          Promise.resolve(translateFn(src[base], sourceLang, L)).then(function (out) {
            e[base + '_' + L] = safeString(out).trim();
          })
        );
      });
    });
    Promise.all(jobs)
      .then(function () {
        state.perfs[state.perfIndex] = e;
        renderPerfEditor();
        renderPerfList();
        markDirty(true, 'Auto-translation drafts generated');
        updatePerfTranslationWarnings();
        setPerfTxResult('Draft translations generated for review. Save all event changes when ready.', 'warn');
      })
      .catch(function (err) {
        setPerfTxResult('Auto-translate failed: ' + safeString(err && err.message), 'err');
      });
  }
  function persistPerfEditor() {
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex] || {};
    var activeId = document.activeElement && document.activeElement.id ? document.activeElement.id : '';
    function readVal(id) { return safeString($(id) && $(id).value).trim(); }
    function syncPairedValue(mainId, modalId) {
      var mainVal = readVal(mainId);
      var modalVal = readVal(modalId);
      // Reusable guard: the actively edited field wins in this cycle.
      if (activeId === modalId) return modalVal || mainVal;
      return mainVal || modalVal;
    }
    function writeIfInactive(id, value) {
      var el = $(id);
      if (!el || activeId === id) return;
      el.value = safeString(value);
    }
    var modalTitle = readVal('perf-modal-title');
    var cardTitle = safeString($('perf-title') && $('perf-title').value).trim();
    // Prevent input overwrite loop: when editing card title, it is the source of truth.
    // Allow modal-title edits to drive title only while that field is actively edited.
    if (activeId === 'perf-modal-title') e.title = modalTitle || cardTitle;
    else e.title = cardTitle || modalTitle;
    e.detail = $('perf-detail').value;
    e.day = $('perf-day').value;
    e.month = $('perf-month').value;
    e.time = safeString($('perf-time').value).trim();
    e.venue = syncPairedValue('perf-venue', 'perf-modal-venue');
    e.city = syncPairedValue('perf-city', 'perf-modal-city');
    e.venuePhoto = safeString($('perf-venuePhoto').value).trim();
    var dateDisplay = normalizeSortDateForInput($('perf-dateDisplay').value);
    if (dateDisplay) $('perf-sortDate').value = dateDisplay;
    var op = parseInt($('perf-venueOpacity').value, 10);
    if (!Number.isFinite(op)) op = 50;
    if (op < 30) op = 30;
    if (op > 100) op = 100;
    e.venueOpacity = op;
    $('perf-venueOpacityValue').value = String(op) + '%';
    $('perf-venuePreview').src = e.venuePhoto;
    $('perf-venuePreview').style.opacity = String(op / 100);
    e.status = $('perf-status').value;
    e.type = syncPairedValue('perf-type', 'perf-modal-type');
    e.editorialStatus = safeString($('perf-editorialStatus').value || (safeString(e.status) === 'hidden' ? 'hidden' : 'draft'));
    e.extDesc = safeString($('perf-modal-longdesc') && $('perf-modal-longdesc').value).trim();
    e.ticketPrice = safeString($('perf-modal-ticketPrice') && $('perf-modal-ticketPrice').value).trim();
    e.eventLink = safeString($('perf-modal-link') && $('perf-modal-link').value).trim();
    e.eventLinkLabel = safeString($('perf-modal-link-label') && $('perf-modal-link-label').value).trim();
    e.modalImg = safeString($('perf-modal-image') && $('perf-modal-image').value).trim();
    e.modalImgHide = safeString($('perf-modal-image-hide') && $('perf-modal-image-hide').value).trim() === 'true';
    if ($('perf-modal-enabled')) {
      var modalEnabledRaw = safeString($('perf-modal-enabled').value).trim().toLowerCase();
      if (modalEnabledRaw === 'true') e.modalEnabled = true;
      else if (modalEnabledRaw === 'false') e.modalEnabled = false;
      else delete e.modalEnabled;
    }
    e.flyerImg = safeString($('perf-modal-flyerImg') && $('perf-modal-flyerImg').value).trim();
    // Keep locale-specific supporting fields in sync for active language.
    e['detail_' + state.lang] = safeString(e.detail).trim();
    e['extDesc_' + state.lang] = e.extDesc;
    e['eventLink_' + state.lang] = e.eventLink;
    e['eventLinkLabel_' + state.lang] = e.eventLinkLabel;
    e.sortDate = $('perf-sortDate').value;
    writeIfInactive('perf-title', e.title);
    writeIfInactive('perf-modal-title', e.title);
    writeIfInactive('perf-venue', e.venue);
    writeIfInactive('perf-modal-venue', e.venue);
    writeIfInactive('perf-city', e.city);
    writeIfInactive('perf-modal-city', e.city);
    writeIfInactive('perf-type', e.type || 'concert');
    writeIfInactive('perf-modal-type', e.type || 'concert');
    state.perfs[state.perfIndex] = e;
    updatePerfCardPreview();
    updatePerfPublicVisibilitySummary();
    updatePerfTranslationWarnings();
    renderPerfList();
    markDirty(true);
  }
  function loadCalendar() {
    var stored = loadDoc('perf_' + state.lang, null);
    var fallback = getLegacySection('perf');
    $('perf-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('perf-intro').value = pickStoredOrFallback(stored, fallback, 'intro');
    if ($('perf-status-filter')) $('perf-status-filter').value = state.perfStatusFilter || 'all';
    if ($('perf-workflow-filter')) $('perf-workflow-filter').value = state.perfWorkflowFilter || 'all';
    state.perfs = loadDoc('rg_perfs', []);
    state.perfIndex = -1;
    renderPerfList();
    updateCompletenessIndicators();
  }
  function savePerfHeader() { saveDoc('perf_' + state.lang, { h2: safeString($('perf-h2').value), intro: safeString($('perf-intro').value) }); }
  function savePerfEvents() {
    state.perfs = state.perfs.filter(function (e) { return isObject(e); });
    saveDoc('rg_perfs', state.perfs);
    setPerfTxResult('Saved event list. Translation tool changes are now persisted.', 'ok');
  }
  function normalizePastPerfImportItem(raw, idx) {
    var o = isObject(raw) ? raw : {};
    var idSeed = safeString(o.id).trim();
    var date = safeString(o.date).trim();
    var time = safeString(o.time).trim();
    var title = safeString(o.title).trim();
    var place = safeString(o.place != null ? o.place : o.venue).trim();
    var city = safeString(o.city).trim();
    var address = safeString(o.address).trim();
    var description = safeString(o.description).trim();
    var linkText = safeString(o.linkText != null ? o.linkText : o.buttonText).trim();
    var link = safeString(o.link != null ? o.link : o.buttonLink).trim();
    var image = safeString(o.image != null ? o.image : o.image_url).trim();
    return {
      id: idSeed || ('past-' + (idx + 1)),
      date: date,
      time: time,
      title: title,
      place: place,
      city: city,
      address: address,
      description: description,
      linkText: linkText,
      link: link,
      image: image,
      status: 'past',
      private: !!o.private
    };
  }
  function normalizePastPerfImportArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function (item, idx) {
      return normalizePastPerfImportItem(item, idx);
    });
  }
  function parseDateSafe(s) {
    var raw = safeString(s).trim();
    if (!raw) return null;
    var d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    return d;
  }
  function validatePastPerfItem(item, idx) {
    var errors = [];
    if (!isObject(item)) {
      errors.push('Item #' + (idx + 1) + ' is not an object.');
      return errors;
    }
    var rawDate = safeString(item.date).trim();
    if (!rawDate) errors.push('Item #' + (idx + 1) + ' is missing date.');
    else if (!parseDateSafe(rawDate)) errors.push('Item #' + (idx + 1) + ' has invalid date: ' + rawDate);
    return errors;
  }
  function savePastPerfsToStorage() {
    var allErrors = [];
    state.pastPerfs = normalizePastPerfImportArray(state.pastPerfs);
    state.pastPerfs.forEach(function (item, idx) {
      item.status = 'past';
      validatePastPerfItem(item, idx).forEach(function (e) { allErrors.push(e); });
    });
    if (allErrors.length) {
      if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Save failed: ' + allErrors[0];
      alert('Save failed:\n- ' + allErrors.slice(0, 12).join('\n- ') + (allErrors.length > 12 ? '\n- ... and ' + (allErrors.length - 12) + ' more' : ''));
      return false;
    }
    saveDoc('rg_past_perfs', state.pastPerfs);
    if ($('pastperfs-summary')) $('pastperfs-summary').textContent = state.pastPerfs.length ? ('Saved past events: ' + state.pastPerfs.length) : 'No past events saved yet.';
    if ($('pastperfs-preview')) $('pastperfs-preview').value = JSON.stringify(state.pastPerfs.slice(0, 40), null, 2);
    setStatus('Past events saved', 'ok');
    return true;
  }
  function renderPastPerfsEditorList() {
    var box = $('pastperfs-editor-list');
    if (!box) return;
    var arr = Array.isArray(state.pastPerfs) ? state.pastPerfs : [];
    if (!arr.length) {
      box.innerHTML = '<div class="item">No past events saved.</div>';
      return;
    }
    box.innerHTML = arr.map(function (p, idx) {
      var checked = !!state.pastPerfsSelected[idx];
      var title = safeString(p.title).trim() || '(untitled)';
      return '' +
        '<div class="item" data-past-idx="' + idx + '">' +
          '<div class="item-row">' +
            '<input type="checkbox" data-past-select="' + idx + '"' + (checked ? ' checked' : '') + '>' +
            '<div class="item-main">' +
              '<strong>#' + (idx + 1) + ' · ' + escapeHtml(title) + '</strong>' +
            '</div>' +
          '</div>' +
          '<div class="grid two">' +
            '<label>Date<input data-past-field="date" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.date)) + '"></label>' +
            '<label>Time<input data-past-field="time" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.time)) + '"></label>' +
            '<label>Title<input data-past-field="title" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.title)) + '"></label>' +
            '<label>Place<input data-past-field="place" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.place)) + '"></label>' +
            '<label>City<input data-past-field="city" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.city)) + '"></label>' +
            '<label>Address<input data-past-field="address" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.address)) + '"></label>' +
            '<label>Link text<input data-past-field="linkText" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.linkText)) + '"></label>' +
            '<label>Link<input data-past-field="link" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.link)) + '"></label>' +
            '<label>Image<input data-past-field="image" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.image)) + '"></label>' +
            '<label>Private<select data-past-field="private" data-past-idx="' + idx + '"><option value="false"' + (!p.private ? ' selected' : '') + '>false</option><option value="true"' + (p.private ? ' selected' : '') + '>true</option></select></label>' +
          '</div>' +
          '<label>Description<textarea rows="3" data-past-field="description" data-past-idx="' + idx + '">' + escapeHtml(safeString(p.description)) + '</textarea></label>' +
          '<div class="toolbar">' +
            '<button type="button" data-past-action="save" data-past-idx="' + idx + '">Save item changes</button>' +
            '<button type="button" data-past-action="up" data-past-idx="' + idx + '">Move up</button>' +
            '<button type="button" data-past-action="down" data-past-idx="' + idx + '">Move down</button>' +
            '<button type="button" class="danger" data-past-action="delete" data-past-idx="' + idx + '">Delete item</button>' +
          '</div>' +
        '</div>';
    }).join('');
  }
  function collectPastPerfItemFromUi(idx) {
    function v(field) {
      var el = document.querySelector('[data-past-field="' + field + '"][data-past-idx="' + idx + '"]');
      return el ? safeString(el.value) : '';
    }
    return {
      id: safeString(state.pastPerfs[idx] && state.pastPerfs[idx].id).trim() || ('past-' + (idx + 1)),
      date: v('date').trim(),
      time: v('time').trim(),
      title: v('title').trim(),
      place: v('place').trim(),
      city: v('city').trim(),
      address: v('address').trim(),
      description: v('description').trim(),
      linkText: v('linkText').trim(),
      link: v('link').trim(),
      image: v('image').trim(),
      status: 'past',
      private: v('private') === 'true'
    };
  }
  function savePastPerfItemAt(idx) {
    if (idx < 0 || idx >= state.pastPerfs.length) return;
    var next = collectPastPerfItemFromUi(idx);
    var errors = validatePastPerfItem(next, idx);
    if (errors.length) {
      if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Save failed: ' + errors[0];
      alert(errors.join('\n'));
      return;
    }
    state.pastPerfs[idx] = next;
    if (savePastPerfsToStorage()) {
      if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Item #' + (idx + 1) + ' saved.';
      renderPastPerfsEditorList();
    }
  }
  function selectedPastPerfIndices() {
    return Object.keys(state.pastPerfsSelected || {}).filter(function (k) { return !!state.pastPerfsSelected[k]; }).map(function (k) { return Number(k); }).filter(function (n) { return Number.isFinite(n); }).sort(function (a, b) { return a - b; });
  }
  function validatePastPerfsImportArray(arr) {
    var errors = [];
    if (!Array.isArray(arr)) {
      errors.push('Root JSON must be an array.');
      return errors;
    }
    arr.forEach(function (item, idx) {
      if (!isObject(item)) {
        errors.push('Item #' + (idx + 1) + ' is not an object.');
        return;
      }
      var rawDate = safeString(item.date).trim();
      if (!rawDate) {
        errors.push('Item #' + (idx + 1) + ' is missing date.');
      } else {
        var d = new Date(rawDate);
        if (isNaN(d.getTime())) errors.push('Item #' + (idx + 1) + ' has invalid date: ' + rawDate);
      }
    });
    return errors;
  }
  function loadPastPerfsSection() {
    state.pastPerfs = loadDoc('rg_past_perfs', []);
    if (!Array.isArray(state.pastPerfs)) state.pastPerfs = [];
    state.pastPerfs = normalizePastPerfImportArray(state.pastPerfs);
    clearSelected(state.pastPerfsSelected);
    if ($('pastperfs-import-file')) $('pastperfs-import-file').value = '';
    if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = '';
    if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = '';
    if ($('pastperfs-skipped-note')) {
      $('pastperfs-skipped-note').textContent = '';
      $('pastperfs-skipped-note').style.display = 'none';
    }
    if ($('pastperfs-summary')) {
      $('pastperfs-summary').textContent = state.pastPerfs.length
        ? ('Saved past events: ' + state.pastPerfs.length)
        : 'No past events saved yet.';
    }
    if ($('pastperfs-preview')) {
      $('pastperfs-preview').value = JSON.stringify(state.pastPerfs.slice(0, 40), null, 2);
    }
    renderPastPerfsEditorList();
  }
  function clearPastPerfsDataset() {
    if (!window.confirm('Clear all past events? This replaces rg_past_perfs with an empty list.')) return;
    saveDoc('rg_past_perfs', []);
    state.pastPerfs = [];
    if ($('pastperfs-summary')) $('pastperfs-summary').textContent = 'No past events saved yet.';
    if ($('pastperfs-preview')) $('pastperfs-preview').value = '[]';
    if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = 'Imported: 0 · Skipped: 0 · Total processed: 0';
    if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Past events cleared.';
    if ($('pastperfs-skipped-note')) {
      $('pastperfs-skipped-note').textContent = '';
      $('pastperfs-skipped-note').style.display = 'none';
    }
    clearSelected(state.pastPerfsSelected);
    renderPastPerfsEditorList();
    setStatus('Past events cleared', 'ok');
    pushActivitySummary('Past events cleared', ['rg_past_perfs replaced with an empty array.']);
  }
  function importPastPerfsJson() {
    var input = $('pastperfs-import-file');
    if (!input || !input.files || !input.files[0]) {
      alert('Choose a JSON file first.');
      return;
    }
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result || '[]'));
        var validationErrors = validatePastPerfsImportArray(parsed);
        if (validationErrors.length) {
          throw new Error('Validation failed:\n- ' + validationErrors.slice(0, 12).join('\n- ') + (validationErrors.length > 12 ? '\n- ... and ' + (validationErrors.length - 12) + ' more' : ''));
        }
        if (!window.confirm('Import will REPLACE the full rg_past_perfs dataset.\n\nContinue?')) return;
        var total = parsed.length;
        var normalized = normalizePastPerfImportArray(parsed);
        var imported = normalized.length;
        var skipped = Math.max(0, total - imported);
        saveDoc('rg_past_perfs', normalized);
        state.pastPerfs = normalized;
        if ($('pastperfs-summary')) $('pastperfs-summary').textContent = 'Saved past events: ' + normalized.length;
        if ($('pastperfs-preview')) $('pastperfs-preview').value = JSON.stringify(normalized.slice(0, 40), null, 2);
        if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = 'Imported: ' + imported + ' · Skipped: ' + skipped + ' · Total processed: ' + total;
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Import complete: ' + normalized.length + ' past event(s) saved (full dataset replaced).';
        if ($('pastperfs-skipped-note')) {
          if (skipped > 0) {
            $('pastperfs-skipped-note').textContent = skipped + ' item(s) were skipped during import.';
            $('pastperfs-skipped-note').style.display = '';
          } else {
            $('pastperfs-skipped-note').textContent = '';
            $('pastperfs-skipped-note').style.display = 'none';
          }
        }
        setStatus('Past events imported', 'ok');
        pushActivitySummary('Past events imported', [normalized.length + ' item(s) saved to rg_past_perfs.']);
        clearSelected(state.pastPerfsSelected);
        renderPastPerfsEditorList();
        alert('Import complete. ' + normalized.length + ' past event(s) imported.');
      } catch (err) {
        if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = '';
        if ($('pastperfs-skipped-note')) {
          $('pastperfs-skipped-note').textContent = '';
          $('pastperfs-skipped-note').style.display = 'none';
        }
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Import failed: ' + safeString(err.message);
        setStatus('Past events import failed', 'err');
        alert('Import failed: ' + safeString(err.message));
      }
    };
    reader.readAsText(file);
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
        customThumb: safeString(v.customThumb),
        editorialStatus: safeString(v.editorialStatus || (v.hidden ? 'hidden' : 'draft'))
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
    var t = safeString(v.title) || '(untitled)';
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
    if ($('media-vid-filter')) $('media-vid-filter').value = state.mediaVidFilter || 'all';
    if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').value = state.mediaVidWorkflowFilter || 'all';
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
    var q = safeString(state.mediaVidSearch).toLowerCase().trim();
    var filter = state.mediaVidFilter || 'all';
    var rows = arr.map(function (v, i) { return { v: v, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.v.title, row.v.composer, row.v.tag, row.v.id].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    }).filter(function (row) {
      if (filter === 'all') return true;
      if (filter === 'visible') return !row.v.hidden;
      if (filter === 'hidden') return !!row.v.hidden;
      if (filter === 'featured') return !!row.v.featured;
      return true;
    }).filter(function (row) {
      var wf = state.mediaVidWorkflowFilter || 'all';
      if (wf === 'all') return true;
      var b = workflowBucketVideo(row.v);
      if (wf === 'ready') return videoReadyCheck(row.v).ok && b !== 'hidden';
      return passesWorkflowFilter(b, wf);
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay videos. Crea uno con "+ Nuevo video".</div>';
      state.vidIndex = -1;
      setSelectionCount('media-vid-selection-count', state.mediaVidSelected);
      renderMediaVideoEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.vidIndex ? 'item active' : 'item';
      var badges = [];
      if (isBlank(row.v.title)) badges.push({ kind: 'warn', label: 'missing title' });
      if (isBlank(row.v.id)) badges.push({ kind: 'warn', label: 'missing video id' });
      if (row.v.hidden) badges.push({ kind: 'err', label: 'hidden' });
      badges.push({ kind: 'warn', label: workflowBucketVideo(row.v) });
      var checked = state.mediaVidSelected[row.i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + row.i + '"><div class="item-row"><input class="row-select" data-idx="' + row.i + '" type="checkbox"' + checked + '><div class="item-main">' + mediaSummaryVideo(row.v) + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('media-vid-selection-count', state.mediaVidSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.mediaVidSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('media-vid-selection-count', state.mediaVidSelected);
      });
    });
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
    setSelectWithCustomValue('media-vid-editorialStatus', safeString(v.editorialStatus || (v.hidden ? 'hidden' : 'draft')), 'draft');
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
    v.editorialStatus = safeString($('media-vid-editorialStatus').value || (v.hidden ? 'hidden' : 'draft'));
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
    var q = safeString(state.mediaPhotoSearch).toLowerCase().trim();
    var rows = arr.map(function (src, i) { return { src: src, i: i }; }).filter(function (row) {
      if (!q) return true;
      var c = getPhotoCaption(state.photoType, row.i);
      var hay = [row.src, c.caption, c.photographer].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay fotos en este grupo. Usa "+ Agregar por URL" o "+ Subir foto".</div>';
      state.photoIndex = -1;
      renderMediaPhotoEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.photoIndex ? 'item active' : 'item';
      var c = getPhotoCaption(state.photoType, row.i);
      var badges = [];
      if (isBlank(row.src)) badges.push({ kind: 'warn', label: 'missing image' });
      if (isBlank(c.caption)) badges.push({ kind: 'warn', label: 'missing caption' });
      return '<div class="' + cls + '" data-idx="' + row.i + '">' + mediaSummaryPhoto(row.src, row.i) + badgesHtml(badges) + '</div>';
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
    applyTranslationMissingOnlyMask();
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
    var q = safeString(state.epkPhotoSearch).toLowerCase().trim();
    var rows = state.epkPhotos.map(function (p, i) { return { p: p, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.p.label, row.p.credit, row.p.url].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay EPK photos. Agrega una por URL o subida.</div>';
      state.epkPhotoIndex = -1;
      renderEpkPhotoEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.epkPhotoIndex ? 'item active' : 'item';
      var label = safeString(row.p.label) || ('Photo ' + (row.i + 1));
      var credit = safeString(row.p.credit);
      var badges = [];
      if (isBlank(row.p.url)) badges.push({ kind: 'warn', label: 'missing image' });
      if (isBlank(row.p.label)) badges.push({ kind: 'warn', label: 'missing label' });
      return '<div class="' + cls + '" data-idx="' + row.i + '">' + label + (credit ? ' · ' + credit : '') + badgesHtml(badges) + '</div>';
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
    var q = safeString(state.pressSearch).toLowerCase().trim();
    var filter = state.pressVisibleFilter || 'all';
    var rows = state.press.map(function (p, i) { return { p: p, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.p.source, row.p.quote, row.p.production, row.p.url].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    }).filter(function (row) {
      if (filter === 'all') return true;
      if (filter === 'visible') return row.p.visible !== false;
      if (filter === 'hidden') return row.p.visible === false;
      return true;
    }).filter(function (row) {
      var wf = state.pressWorkflowFilter || 'all';
      if (wf === 'all') return true;
      var b = workflowBucketPress(row.p);
      if (wf === 'ready') return pressQuoteReadyCheck(row.p).ok && b !== 'hidden';
      return passesWorkflowFilter(b, wf);
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay quotes. Crea una con "+ Nueva quote".</div>';
      state.pressIndex = -1;
      setSelectionCount('press-selection-count', state.pressSelected);
      renderPressEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var t = (row.p.source || '(no source)') + ' · ' + (row.p.production || '');
      var cls = row.i === state.pressIndex ? 'item active' : 'item';
      var quoteValue = isObject(row.p.quotes_i18n) ? row.p.quotes_i18n[state.lang] : row.p.quote;
      var badges = [];
      if (isBlank(row.p.source)) badges.push({ kind: 'warn', label: 'missing source' });
      if (isBlank(quoteValue)) badges.push({ kind: 'warn', label: 'missing translation' });
      if (row.p.visible === false) badges.push({ kind: 'err', label: 'hidden' });
      if (safeString(row.p.editorialStatus)) badges.push({ kind: 'warn', label: safeString(row.p.editorialStatus) });
      var checked = state.pressSelected[row.i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + row.i + '"><div class="item-row"><input class="row-select" data-idx="' + row.i + '" type="checkbox"' + checked + '><div class="item-main">' + t + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('press-selection-count', state.pressSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.pressSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('press-selection-count', state.pressSelected);
      });
    });
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
    setSelectWithCustomValue('press-editorialStatus', safeString(p.editorialStatus || (p.visible === false ? 'hidden' : 'draft')), 'draft');
    updatePressMiniPreview();
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
    p.editorialStatus = safeString($('press-editorialStatus').value || (p.visible === false ? 'hidden' : 'draft'));
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
    if ($('press-visible-filter')) $('press-visible-filter').value = state.pressVisibleFilter || 'all';
    if ($('press-workflow-filter')) $('press-workflow-filter').value = state.pressWorkflowFilter || 'all';
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
    updatePdfValidation();
    updateCompletenessIndicators();
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
    var webBtnRaw = pickStoredOrFallback(stored, fallback, 'webBtn');
    var webUrlRaw = pickStoredOrFallback(stored, fallback, 'webUrl');
    var inferredWebUrl = safeString(webUrlRaw).trim();
    if (!inferredWebUrl && isValidHttpUrl(webBtnRaw)) inferredWebUrl = safeString(webBtnRaw).trim();
    var inferredWebBtn = safeString(webBtnRaw).trim();
    if (isValidHttpUrl(inferredWebBtn)) inferredWebBtn = '';
    $('contact-title').value = pickStoredOrFallback(stored, fallback, 'title');
    $('contact-sub').value = pickStoredOrFallback(stored, fallback, 'sub');
    $('contact-email').value = pickStoredOrFallback(stored, fallback, 'email');
    $('contact-emailBtn').value = pickStoredOrFallback(stored, fallback, 'emailBtn');
    $('contact-webBtn').value = inferredWebBtn;
    if ($('contact-webUrl')) $('contact-webUrl').value = inferredWebUrl;
    updateContactValidation();
    updateContactMiniPreview();
    updateCompletenessIndicators();
  }
  function saveContact() {
    saveDoc('contact_' + state.lang, {
      title: safeString($('contact-title').value),
      sub: safeString($('contact-sub').value),
      email: safeString($('contact-email').value),
      emailBtn: safeString($('contact-emailBtn').value),
      webBtn: safeString($('contact-webBtn').value),
      webUrl: safeString($('contact-webUrl') && $('contact-webUrl').value).trim()
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
    loadUiNavFieldsFromDoc(d);
    updateCompletenessIndicators();
  }
  function loadUiNavFieldsFromDoc(d) {
    var doc = isObject(d) ? d : {};
    $('ui-nav-home').value = safeString(doc['nav.home']);
    $('ui-nav-bio').value = safeString(doc['nav.bio']);
    $('ui-nav-rep').value = safeString(doc['nav.rep']);
    $('ui-nav-media').value = safeString(doc['nav.media']);
    $('ui-nav-cal').value = safeString(doc['nav.cal']);
    $('ui-nav-epk').value = safeString(doc['nav.epk']);
    $('ui-nav-book').value = safeString(doc['nav.book']);
  }
  function saveUiNav() {
    var d = loadDoc('rg_ui_' + state.lang, null);
    if (!isObject(d)) d = {};
    d['nav.home'] = safeString($('ui-nav-home').value);
    d['nav.bio'] = safeString($('ui-nav-bio').value);
    d['nav.rep'] = safeString($('ui-nav-rep').value);
    d['nav.media'] = safeString($('ui-nav-media').value);
    d['nav.cal'] = safeString($('ui-nav-cal').value);
    d['nav.epk'] = safeString($('ui-nav-epk').value);
    d['nav.book'] = safeString($('ui-nav-book').value);
    saveDoc('rg_ui_' + state.lang, d);
    $('ui-json').value = JSON.stringify(d, null, 2);
  }
  function mergeMissingStrings(target, source, keys) {
    keys.forEach(function (k) {
      if (isBlank(target[k]) && !isBlank(source[k])) target[k] = safeString(source[k]);
    });
    return target;
  }
  function copyHomeFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    if (!window.confirm('Copy Home/Hero text fields from EN for this language? Image fields are not overwritten.')) return;
    var en = loadDoc('hero_en', {});
    if (!isObject(en)) en = {};
    ['eyebrow','subtitle','cta1','cta2','quickBioLabel','quickCalLabel','introCtaBio','introCtaMedia'].forEach(function (k) {
      $('hero-' + (k === 'quickBioLabel' ? 'quickBioLabel' : k === 'quickCalLabel' ? 'quickCalLabel' : k)).value = safeString(en[k]);
    });
    $('hero-eyebrow').value = safeString(en.eyebrow);
    $('hero-subtitle').value = safeString(en.subtitle);
    $('hero-cta1').value = safeString(en.cta1);
    $('hero-cta2').value = safeString(en.cta2);
    $('hero-quickBioLabel').value = safeString(en.quickBioLabel);
    $('hero-quickCalLabel').value = safeString(en.quickCalLabel);
    $('hero-introCtaBio').value = safeString(en.introCtaBio);
    $('hero-introCtaMedia').value = safeString(en.introCtaMedia);
    updateCompletenessIndicators();
    markDirty(true, 'Home copied from EN (text only)');
  }
  function copyBioFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    if (!window.confirm('Copy Biography text fields from EN for this language? Portrait image is not overwritten.')) return;
    var en = loadDoc('bio_en', {});
    if (!isObject(en)) en = {};
    $('bio-h2').value = safeString(en.h2);
    $('bio-p1').value = safeString(en.p1);
    $('bio-p2').value = safeString(en.p2);
    $('bio-quote').value = safeString(en.quote);
    $('bio-cite').value = safeString(en.cite);
    updateCompletenessIndicators();
    markDirty(true, 'Biography copied from EN (text only)');
  }
  function copyProgramsFromEn(onlyMissing) {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var label = onlyMissing ? 'Copy missing program fields from EN?' : 'Overwrite this language Programs content from EN?';
    if (!window.confirm(label)) return;
    var enDoc = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    if (onlyMissing) {
      mergeMissingStrings(state.programsDoc, enDoc, ['title', 'subtitle', 'intro', 'closingNote']);
      var max = Math.max(state.programsDoc.programs.length, enDoc.programs.length);
      var merged = [];
      for (var i = 0; i < max; i += 1) {
        var cur = safeProgramsDoc({ programs: [state.programsDoc.programs[i] || {}] }).programs[0] || {};
        var en = safeProgramsDoc({ programs: [enDoc.programs[i] || {}] }).programs[0] || {};
        merged.push(mergeMissingStrings(cur, en, ['title', 'description', 'duration']));
      }
      state.programsDoc.programs = merged.filter(function (p) { return isObject(p); });
    } else {
      state.programsDoc = enDoc;
    }
    normalizeProgramOrders();
    renderProgramsList();
    renderProgramsEditor();
    updateCompletenessIndicators();
    markDirty(true, onlyMissing ? 'Programs missing fields copied from EN' : 'Programs copied from EN');
  }
  function copyContactFromEn(onlyMissing) {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var label = onlyMissing ? 'Copy only missing Contact fields from EN?' : 'Overwrite Contact fields from EN for this language?';
    if (!window.confirm(label)) return;
    var en = loadDoc('contact_en', {});
    if (!isObject(en)) en = {};
    var keys = [
      { id: 'contact-title', key: 'title' },
      { id: 'contact-sub', key: 'sub' },
      { id: 'contact-email', key: 'email' },
      { id: 'contact-emailBtn', key: 'emailBtn' },
      { id: 'contact-webBtn', key: 'webBtn' },
      { id: 'contact-webUrl', key: 'webUrl' }
    ];
    keys.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      if (!onlyMissing || isBlank(el.value)) el.value = safeString(en[row.key]);
    });
    updateContactValidation();
    updateCompletenessIndicators();
    markDirty(true, onlyMissing ? 'Contact missing fields copied from EN' : 'Contact copied from EN');
  }
  function copyUiNavFromEn(onlyMissing) {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var label = onlyMissing ? 'Copy only missing navigation labels from EN?' : 'Overwrite navigation labels from EN?';
    if (!window.confirm(label)) return;
    var en = loadDoc('rg_ui_en', {});
    if (!isObject(en)) en = {};
    var rows = [
      { id: 'ui-nav-home', key: 'nav.home' },
      { id: 'ui-nav-bio', key: 'nav.bio' },
      { id: 'ui-nav-rep', key: 'nav.rep' },
      { id: 'ui-nav-media', key: 'nav.media' },
      { id: 'ui-nav-cal', key: 'nav.cal' },
      { id: 'ui-nav-epk', key: 'nav.epk' },
      { id: 'ui-nav-book', key: 'nav.book' }
    ];
    rows.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      if (!onlyMissing || isBlank(el.value)) el.value = safeString(en[row.key]);
    });
    updateCompletenessIndicators();
    markDirty(true, onlyMissing ? 'Missing nav labels copied from EN' : 'Nav labels copied from EN');
  }
  function copyPressBiosMissingFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    if (!window.confirm('Copy only missing EPK bio fields from EN? Existing translated text will be kept.')) return;
    if (!state.epkBios[state.lang]) state.epkBios[state.lang] = {};
    var en = state.epkBios.en || {};
    var local = state.epkBios[state.lang];
    ['b50','b150','b300p1','b300p2','b300p3','b300p4'].forEach(function (k) {
      if (isBlank(local[k]) && !isBlank(en[k])) local[k] = safeString(en[k]);
    });
    loadEpkBiosIntoUi();
    updateCompletenessIndicators();
    markDirty(true, 'EPK bios missing fields copied from EN');
  }
  function copyHomeMissingFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var en = loadDoc('hero_en', {});
    if (!isObject(en)) en = {};
    var map = [
      { id: 'hero-eyebrow', key: 'eyebrow' },
      { id: 'hero-subtitle', key: 'subtitle' },
      { id: 'hero-cta1', key: 'cta1' },
      { id: 'hero-cta2', key: 'cta2' },
      { id: 'hero-quickBioLabel', key: 'quickBioLabel' },
      { id: 'hero-quickCalLabel', key: 'quickCalLabel' },
      { id: 'hero-introCtaBio', key: 'introCtaBio' },
      { id: 'hero-introCtaMedia', key: 'introCtaMedia' }
    ];
    map.forEach(function (m) { if (isBlank($(m.id).value)) $(m.id).value = safeString(en[m.key]); });
    updateHomeMiniPreviews();
    updateCompletenessIndicators();
    markDirty(true, 'Home missing fields copied from EN');
  }
  function copyBioMissingFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var en = loadDoc('bio_en', {});
    if (!isObject(en)) en = {};
    var map = [
      { id: 'bio-h2', key: 'h2' }, { id: 'bio-p1', key: 'p1' }, { id: 'bio-p2', key: 'p2' }, { id: 'bio-quote', key: 'quote' }, { id: 'bio-cite', key: 'cite' }
    ];
    map.forEach(function (m) { if (isBlank($(m.id).value)) $(m.id).value = safeString(en[m.key]); });
    updateBioMiniPreview();
    updateCompletenessIndicators();
    markDirty(true, 'Biography missing fields copied from EN');
  }
  function getEditorialMeta(lang) {
    var d = getStoredDocRaw('rg_editorial_' + lang, {});
    return isObject(d) ? d : {};
  }
  function setSectionEditorialReview(sectionKey, value) {
    var d = getEditorialMeta(state.lang);
    d['reviewState_' + sectionKey] = safeString(value);
    saveDoc('rg_editorial_' + state.lang, d);
    pushActivitySummary('Editorial status', [sectionKey + ' · ' + state.lang.toUpperCase() + ' → ' + value]);
    if (state.section === 'translation') refreshTranslationWorkspace();
  }
  function classifyTxRow(enV, curV) {
    var en = safeString(enV).trim();
    var cur = safeString(curV).trim();
    if (!en && !cur) return 'same';
    if (!cur && en) return 'missing';
    if (cur && en && cur === en) return state.lang === 'en' ? 'same' : 'verify';
    if (cur && en && cur !== en) return 'different';
    if (cur && !en) return 'local_only';
    return 'same';
  }
  function clipTx(s, n) {
    s = safeString(s);
    if (s.length <= n) return s;
    return s.slice(0, n - 1) + '…';
  }
  function showLangComparePanel(title, rows) {
    var panel = $('lang-compare-panel');
    if (!panel) return;
    var label = {
      missing: 'Missing',
      different: 'Different',
      same: 'Same',
      verify: 'Same as EN · review',
      local_only: 'Local only'
    };
    var rowCls = {
      missing: 'tx-cmp-missing',
      different: 'tx-cmp-different',
      same: 'tx-cmp-same',
      verify: 'tx-cmp-verify',
      local_only: 'tx-cmp-local_only'
    };
    if (!rows || !rows.length) {
      panel.innerHTML = '';
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    panel.innerHTML =
      '<h4 class="tx-cmp-title">' + escapeHtml(title) + ' · ' + state.lang.toUpperCase() + ' vs EN</h4>' +
      '<table class="tx-cmp-table"><thead><tr><th>Field</th><th>Status</th><th>EN</th><th>Current</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var k = safeString(r && r.kind);
        if (!rowCls[k]) k = 'same';
        return (
          '<tr class="' + rowCls[k] + '"><td class="tx-cmp-k">' + escapeHtml(safeString(r.key)) + '</td><td><span class="tx-cmp-tag">' +
          escapeHtml(label[k] || k) + '</span></td><td class="tx-cmp-en">' + escapeHtml(clipTx(r.en, 120)) +
          '</td><td class="tx-cmp-cur">' + escapeHtml(clipTx(r.cur, 120)) + '</td></tr>'
        );
      }).join('') +
      '</tbody></table>';
  }
  function compareFieldsWithEn(sectionTitle, fieldsCurrent, fieldsEn) {
    var keySet = {};
    [fieldsCurrent, fieldsEn].forEach(function (obj) {
      if (!obj || typeof obj !== 'object') return;
      Object.keys(obj).forEach(function (k) { keySet[k] = true; });
    });
    var keys = Object.keys(keySet).sort();
    var missing = [];
    var different = [];
    var verify = [];
    var rows = keys.map(function (k) {
      var cur = fieldsCurrent && hasOwn(fieldsCurrent, k) ? fieldsCurrent[k] : '';
      var en = fieldsEn && hasOwn(fieldsEn, k) ? fieldsEn[k] : '';
      var kind = classifyTxRow(en, cur);
      if (kind === 'missing') missing.push(k);
      else if (kind === 'different') different.push(k);
      else if (kind === 'verify') verify.push(k);
      return { key: k, cur: cur, en: en, kind: kind };
    });
    var lines = [
      sectionTitle + ' · ' + state.lang.toUpperCase() + ' vs EN',
      'Missing: ' + (missing.length ? missing.join(', ') : 'none'),
      'Different: ' + (different.length ? different.join(', ') : 'none'),
      'Same as EN (verify): ' + (verify.length ? verify.join(', ') : 'none')
    ];
    if ($('langCompareSummary')) $('langCompareSummary').textContent = lines.join(' · ');
    pushActivitySummary('EN comparison', lines);
    showLangComparePanel(sectionTitle, rows);
  }
  function compareHomeWithEn() {
    var cur = loadDoc('hero_' + state.lang, {}) || {};
    var en = loadDoc('hero_en', {}) || {};
    compareFieldsWithEn('Home / Hero', {
      eyebrow: cur.eyebrow,
      subtitle: cur.subtitle,
      cta1: cur.cta1,
      cta2: cur.cta2,
      quickBioLabel: cur.quickBioLabel,
      quickCalLabel: cur.quickCalLabel,
      introCtaBio: cur.introCtaBio,
      introCtaMedia: cur.introCtaMedia
    }, {
      eyebrow: en.eyebrow,
      subtitle: en.subtitle,
      cta1: en.cta1,
      cta2: en.cta2,
      quickBioLabel: en.quickBioLabel,
      quickCalLabel: en.quickCalLabel,
      introCtaBio: en.introCtaBio,
      introCtaMedia: en.introCtaMedia
    });
  }
  function compareBioWithEn() {
    var cur = loadDoc('bio_' + state.lang, {}) || {};
    var en = loadDoc('bio_en', {}) || {};
    compareFieldsWithEn('Biography', { h2: cur.h2, p1: cur.p1, p2: cur.p2, quote: cur.quote, cite: cur.cite }, { h2: en.h2, p1: en.p1, p2: en.p2, quote: en.quote, cite: en.cite });
  }
  function compareProgramsWithEn() {
    var cur = safeProgramsDoc(loadProgramsCanonicalForLang(state.lang));
    var en = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    compareFieldsWithEn('Programs header', { title: cur.title, subtitle: cur.subtitle, intro: cur.intro, closingNote: cur.closingNote }, { title: en.title, subtitle: en.subtitle, intro: en.intro, closingNote: en.closingNote });
  }
  function compareContactWithEn() {
    var cur = loadDoc('contact_' + state.lang, {}) || {};
    var en = loadDoc('contact_en', {}) || {};
    compareFieldsWithEn('Contact', {
      title: cur.title,
      sub: cur.sub,
      email: cur.email,
      emailBtn: cur.emailBtn,
      webBtn: cur.webBtn,
      webUrl: cur.webUrl
    }, {
      title: en.title,
      sub: en.sub,
      email: en.email,
      emailBtn: en.emailBtn,
      webBtn: en.webBtn,
      webUrl: en.webUrl
    });
  }
  function compareUiWithEn() {
    var cur = loadDoc('rg_ui_' + state.lang, {}) || {};
    var en = loadDoc('rg_ui_en', {}) || {};
    compareFieldsWithEn('UI labels', { home: cur['nav.home'], bio: cur['nav.bio'], rep: cur['nav.rep'], media: cur['nav.media'], cal: cur['nav.cal'], epk: cur['nav.epk'], book: cur['nav.book'] }, { home: en['nav.home'], bio: en['nav.bio'], rep: en['nav.rep'], media: en['nav.media'], cal: en['nav.cal'], epk: en['nav.epk'], book: en['nav.book'] });
  }
  function comparePressBiosWithEn() {
    var bios = safeEpkBios(loadDoc('rg_epk_bios', {}));
    var cur = bios[state.lang] || {};
    var en = bios.en || {};
    compareFieldsWithEn('EPK bios', cur, en);
  }

  function translationReviewBadgeClass(st) {
    var s = safeString(st);
    if (s === 'needs_translation') return 'tx-badge-needs-translation';
    if (s === 'translated') return 'tx-badge-translated';
    if (s === 'reviewed') return 'tx-badge-reviewed';
    return 'tx-badge-muted';
  }
  function txCell(val) {
    var s = clipTx(safeString(val), 180);
    return s || '—';
  }
  function refreshTranslationWorkspace() {
    var box = $('translation-workspace');
    var hint = $('translation-mode-hint');
    if (!box) return;
    var L = state.lang;
    if (hint) {
      hint.textContent = state.translationMissingOnly
        ? 'Editors: only rows that still need translation work are shown (saved content vs EN).'
        : 'Editors: full fields shown. Toggle “Missing / incomplete only” to focus.';
    }
    if (L === 'en') {
      box.innerHTML =
        '<p class="muted">Select a non-EN language above. English stays the reference; this workspace compares that language to EN.</p>';
      if ($('translation-qa')) $('translation-qa').innerHTML = '<p class="muted">Switch language to run checks.</p>';
      return;
    }
    var ed = getEditorialMeta(L);
    var he = loadDoc('hero_en', {}) || {};
    var hc = loadDoc('hero_' + L, {}) || {};
    var be = loadDoc('bio_en', {}) || {};
    var bc = loadDoc('bio_' + L, {}) || {};
    var ce = loadDoc('contact_en', {}) || {};
    var cc = loadDoc('contact_' + L, {}) || {};
    var ue = loadDoc('rg_ui_en', {}) || {};
    var uc = loadDoc('rg_ui_' + L, {}) || {};
    var pe = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    var pc = safeProgramsDoc(loadProgramsCanonicalForLang(L));
    var ek = safeEpkBios(loadDoc('rg_epk_bios', {}));
    var ee = ek.en || {};
    var el = ek[L] || {};

    function card(title, sectionKey, rows, actions) {
      var st = safeString(ed['reviewState_' + sectionKey]);
      var badge =
        '<span class="tx-badge ' + translationReviewBadgeClass(st) + '">' + escapeHtml(st || 'no status') + '</span>';
      var grid =
        '<div class="tx-grid"><span class="tx-grid-h">Field</span><span class="tx-grid-h">EN</span><span class="tx-grid-h">' +
        L.toUpperCase() +
        '</span>';
      rows.forEach(function (r) {
        grid +=
          '<span class="muted">' +
          escapeHtml(r.label) +
          '</span><span class="tx-cell-en">' +
          escapeHtml(txCell(r.en)) +
          '</span><span class="tx-cell-cur">' +
          escapeHtml(txCell(r.cur)) +
          '</span>';
      });
      grid += '</div>';
      var act = actions || '';
      return (
        '<div class="tx-card" data-tx-card="' +
        escapeHtml(sectionKey) +
        '"><h3>' +
        escapeHtml(title) +
        '</h3><div class="tx-card-meta">' +
        badge +
        '</div>' +
        grid +
        '<div class="tx-actions">' +
        act +
        '</div></div>'
      );
    }

    var homeRows = [
      { label: 'Eyebrow', en: he.eyebrow, cur: hc.eyebrow },
      { label: 'Subtitle', en: he.subtitle, cur: hc.subtitle },
      { label: 'CTA 1 / 2', en: (he.cta1 || '') + ' / ' + (he.cta2 || ''), cur: (hc.cta1 || '') + ' / ' + (hc.cta2 || '') },
      { label: 'Intro CTAs', en: (he.introCtaBio || '') + ' · ' + (he.introCtaMedia || ''), cur: (hc.introCtaBio || '') + ' · ' + (hc.introCtaMedia || '') }
    ];
    var homeAct =
      '<button type="button" data-tx-action="open" data-tx-target="home">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="home">Copy missing from EN</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="home">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="home">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="home">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="home">Reviewed</button>';

    var bioRows = [
      { label: 'Title', en: be.h2, cur: bc.h2 },
      { label: '§1', en: be.p1, cur: bc.p1 },
      { label: '§2', en: be.p2, cur: bc.p2 },
      { label: 'Quote', en: be.quote, cur: bc.quote }
    ];
    var bioAct =
      '<button type="button" data-tx-action="open" data-tx-target="bio">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="bio">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="bio">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="bio">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="bio">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="bio">Reviewed</button>';

    var contactRows = [
      { label: 'Title', en: ce.title, cur: cc.title },
      { label: 'Subtitle', en: ce.sub, cur: cc.sub },
      { label: 'Email', en: ce.email, cur: cc.email },
      { label: 'Web URL', en: ce.webUrl, cur: cc.webUrl }
    ];
    var contactAct =
      '<button type="button" data-tx-action="open" data-tx-target="contact">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="contact">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="contact">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="contact">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="contact">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="contact">Reviewed</button>';

    var uiRows = [
      { label: 'Nav home', en: ue['nav.home'], cur: uc['nav.home'] },
      { label: 'Nav bio', en: ue['nav.bio'], cur: uc['nav.bio'] },
      { label: 'Nav rep', en: ue['nav.rep'], cur: uc['nav.rep'] },
      { label: 'Nav media', en: ue['nav.media'], cur: uc['nav.media'] },
      { label: 'Nav cal', en: ue['nav.cal'], cur: uc['nav.cal'] },
      { label: 'Nav EPK', en: ue['nav.epk'], cur: uc['nav.epk'] },
      { label: 'Nav book', en: ue['nav.book'], cur: uc['nav.book'] }
    ];
    var uiAct =
      '<button type="button" data-tx-action="open" data-tx-target="ui">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="ui">Copy missing nav</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="ui">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="ui">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="ui">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="ui">Reviewed</button>';

    var progRows = [
      { label: 'Title / sub', en: (pe.title || '') + ' · ' + (pe.subtitle || ''), cur: (pc.title || '') + ' · ' + (pc.subtitle || '') },
      { label: 'Intro', en: pe.intro, cur: pc.intro },
      { label: 'Programs #', en: String((pe.programs || []).length), cur: String((pc.programs || []).length) }
    ];
    var progAct =
      '<button type="button" data-tx-action="open" data-tx-target="programs">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="programs">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="programs">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="programs">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="programs">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="programs">Reviewed</button>';

    var epkRows = [
      { label: 'Bio 50', en: ee.b50, cur: el.b50 },
      { label: 'Bio 150', en: ee.b150, cur: el.b150 },
      { label: 'Long §1', en: ee.b300p1, cur: el.b300p1 }
    ];
    var epkAct =
      '<button type="button" data-tx-action="open-press-bios">Open EPK bios</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="press_bios">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="press_bios">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="press_bios">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="press_bios">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="press_bios">Reviewed</button>';

    box.innerHTML =
      card('Home / Hero', 'home', homeRows, homeAct) +
      card('Biography', 'bio', bioRows, bioAct) +
      card('Contact', 'contact', contactRows, contactAct) +
      card('UI labels', 'ui', uiRows, uiAct) +
      card('Programs (copy)', 'programs', progRows, progAct) +
      card('Press · EPK bios', 'press_bios', epkRows, epkAct);

    runTranslationConsistencyQa(true);
    applyTranslationMissingOnlyMask();
  }

  function runTranslationConsistencyQa(silent) {
    var elQ = $('translation-qa');
    if (!elQ) return;
    var L = state.lang;
    if (L === 'en') return;
    var issues = [];
    var he = loadDoc('hero_en', {}) || {};
    var hc = loadDoc('hero_' + L, {}) || {};
    [['cta1', 'Home CTA 1'], ['cta2', 'Home CTA 2'], ['introCtaBio', 'Home intro CTA bio'], ['introCtaMedia', 'Home intro CTA media']].forEach(function (pair) {
      if (!isBlank(he[pair[0]]) && isBlank(hc[pair[0]])) issues.push(pair[1] + ' empty while EN has text.');
    });
    var be = loadDoc('bio_en', {}) || {};
    var bc = loadDoc('bio_' + L, {}) || {};
    ['h2', 'p1', 'p2'].forEach(function (k) {
      if (!isBlank(be[k]) && isBlank(bc[k])) issues.push('Biography field "' + k + '" empty while EN has text.');
      var et = safeString(be[k]).trim();
      var ct = safeString(bc[k]).trim();
      if (et.length > 40 && ct === et) issues.push('Biography "' + k + '" still identical to EN (may be untranslated).');
    });
    var ue = loadDoc('rg_ui_en', {}) || {};
    var uc = loadDoc('rg_ui_' + L, {}) || {};
    ['nav.home', 'nav.bio', 'nav.cal', 'nav.book'].forEach(function (k) {
      if (!isBlank(ue[k]) && isBlank(uc[k])) issues.push('UI label ' + k + ' missing while EN has text.');
    });
    var pd = safePublicPdfs(loadDoc('rg_public_pdfs', {}));
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (code) {
      var enD = safeString(pd.dossier.EN && pd.dossier.EN.url).trim();
      var enA = safeString(pd.artistSheet.EN && pd.artistSheet.EN.url).trim();
      var d = safeString(pd.dossier[code] && pd.dossier[code].url).trim();
      var a = safeString(pd.artistSheet[code] && pd.artistSheet[code].url).trim();
      if (code === 'EN') return;
      if ((enD || enA) && !d && enD) issues.push('Public PDF: Dossier ' + code + ' missing while EN dossier is set.');
      if ((enD || enA) && !a && enA) issues.push('Public PDF: Artist sheet ' + code + ' missing while EN sheet is set.');
    });
    var pe = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    var pc = safeProgramsDoc(loadProgramsCanonicalForLang(L));
    if ((pe.programs || []).length > 0 && (pc.programs || []).length === 0) issues.push('Programs list empty for ' + L.toUpperCase() + ' while EN has programs.');
    if (!isBlank(pe.title) && isBlank(pc.title)) issues.push('Programs section title missing for ' + L.toUpperCase() + ' while EN has one.');

    if (!issues.length) elQ.innerHTML = '<p class="muted ok">No obvious consistency gaps for ' + L.toUpperCase() + ' vs EN.</p>';
    else elQ.innerHTML = '<ul>' + issues.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul>';
    if (!silent && issues.length) setStatus('Consistency: ' + issues.length + ' note(s)', 'warn');
  }

  function batchCopyMissingFromEnForCurrentLang() {
    if (state.lang === 'en') return setStatus('Switch to a non-EN language first.', 'warn');
    var msg =
      'Copy missing fields from EN into the current language for:\n' +
      'Home, Biography, Contact, UI nav, Programs (saved docs), and EPK bios.\n\n' +
      'This updates the editor only until you save each section. Continue?';
    if (!window.confirm(msg)) return;
    copyHomeMissingFromEn();
    copyBioMissingFromEn();
    copyContactFromEn(true);
    copyUiNavFromEn(true);
    state.epkBios = safeEpkBios(loadDoc('rg_epk_bios', {}));
    copyPressBiosMissingFromEn();
    state.programsDoc = safeProgramsDoc(loadProgramsCanonicalForLang(state.lang));
    copyProgramsFromEn(true);
    refreshTranslationWorkspace();
    markDirty(true, 'Batch: missing fields from EN applied in editor');
    pushActivitySummary('Batch copy from EN', ['Home, Bio, Contact, UI nav, Programs, EPK bios — review and save per section.']);
    setStatus('Batch copy applied in editor — save each section as needed.', 'ok');
  }

  function txLabelWrapForInput(inputId) {
    var el = $(inputId);
    if (!el || !el.parentElement) return null;
    var p = el.parentElement;
    return p.tagName === 'LABEL' ? p : null;
  }
  function txFieldNeedsAttention(enVal, curVal) {
    var en = safeString(enVal).trim();
    var cur = safeString(curVal).trim();
    if (!en && !cur) return false;
    if (!cur && en) return true;
    if (en && cur && cur !== en) return true;
    if (state.lang !== 'en' && en && cur && cur === en && en.length > 12) return true;
    return false;
  }
  function applyTranslationMissingOnlyMask() {
    var app = $('adm2App');
    if (!app) return;
    var on = !!(state.translationMissingOnly && state.lang !== 'en');
    app.classList.toggle('adm2-tx-missing-only', on);
    document.querySelectorAll('.tx-missing-only-hide').forEach(function (node) { node.classList.remove('tx-missing-only-hide'); });
    if (!on) return;
    var sec = state.section;
    var L = state.lang;
    function hideIf(id, enV, curV) {
      var lab = txLabelWrapForInput(id);
      if (!lab) return;
      if (!txFieldNeedsAttention(enV, curV)) lab.classList.add('tx-missing-only-hide');
    }
    if (sec === 'home') {
      var he = loadDoc('hero_en', {}) || {};
      hideIf('hero-eyebrow', he.eyebrow, $('hero-eyebrow').value);
      hideIf('hero-subtitle', he.subtitle, $('hero-subtitle').value);
      hideIf('hero-cta1', he.cta1, $('hero-cta1').value);
      hideIf('hero-cta2', he.cta2, $('hero-cta2').value);
      hideIf('hero-quickBioLabel', he.quickBioLabel, $('hero-quickBioLabel').value);
      hideIf('hero-quickCalLabel', he.quickCalLabel, $('hero-quickCalLabel').value);
      hideIf('hero-introCtaBio', he.introCtaBio, $('hero-introCtaBio').value);
      hideIf('hero-introCtaMedia', he.introCtaMedia, $('hero-introCtaMedia').value);
    } else if (sec === 'bio') {
      var be = loadDoc('bio_en', {}) || {};
      hideIf('bio-h2', be.h2, $('bio-h2').value);
      hideIf('bio-p1', be.p1, $('bio-p1').value);
      hideIf('bio-p2', be.p2, $('bio-p2').value);
      hideIf('bio-quote', be.quote, $('bio-quote').value);
      hideIf('bio-cite', be.cite, $('bio-cite').value);
    } else if (sec === 'contact') {
      var ce = loadDoc('contact_en', {}) || {};
      hideIf('contact-title', ce.title, $('contact-title').value);
      hideIf('contact-sub', ce.sub, $('contact-sub').value);
      hideIf('contact-email', ce.email, $('contact-email').value);
      hideIf('contact-emailBtn', ce.emailBtn, $('contact-emailBtn').value);
      hideIf('contact-webBtn', ce.webBtn, $('contact-webBtn').value);
      hideIf('contact-webUrl', ce.webUrl, $('contact-webUrl').value);
    } else if (sec === 'ui') {
      var ue = loadDoc('rg_ui_en', {}) || {};
      hideIf('ui-nav-home', ue['nav.home'], $('ui-nav-home').value);
      hideIf('ui-nav-bio', ue['nav.bio'], $('ui-nav-bio').value);
      hideIf('ui-nav-rep', ue['nav.rep'], $('ui-nav-rep').value);
      hideIf('ui-nav-media', ue['nav.media'], $('ui-nav-media').value);
      hideIf('ui-nav-cal', ue['nav.cal'], $('ui-nav-cal').value);
      hideIf('ui-nav-epk', ue['nav.epk'], $('ui-nav-epk').value);
      hideIf('ui-nav-book', ue['nav.book'], $('ui-nav-book').value);
    } else if (sec === 'programs') {
      var enP = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
      var curP = state.programsDoc;
      hideIf('programs-title', enP.title, $('programs-title').value);
      hideIf('programs-subtitle', enP.subtitle, $('programs-subtitle').value);
      hideIf('programs-intro', enP.intro, $('programs-intro').value);
      hideIf('programs-closingNote', enP.closingNote, $('programs-closingNote').value);
      var ei = enP.programs[state.programsIndex] || {};
      var ci = curP.programs[state.programsIndex] || {};
      hideIf('programs-item-title', ei.title, $('programs-item-title').value);
      hideIf('programs-item-description', ei.description, $('programs-item-description').value);
      hideIf('programs-item-duration', ei.duration, $('programs-item-duration').value);
    } else if (sec === 'press' && state.pressTab === 'bios') {
      var eb = (safeEpkBios(loadDoc('rg_epk_bios', {})).en) || {};
      var lb = (safeEpkBios(loadDoc('rg_epk_bios', {}))[L]) || {};
      hideIf('epk-bio-b50', eb.b50, $('epk-bio-b50').value);
      hideIf('epk-bio-b150', eb.b150, $('epk-bio-b150').value);
      hideIf('epk-bio-b300p1', eb.b300p1, $('epk-bio-b300p1').value);
      hideIf('epk-bio-b300p2', eb.b300p2, $('epk-bio-b300p2').value);
      hideIf('epk-bio-b300p3', eb.b300p3, $('epk-bio-b300p3').value);
      hideIf('epk-bio-b300p4', eb.b300p4, $('epk-bio-b300p4').value);
    }
  }

  function wireTranslationWorkspaceActions() {
    var box = $('translation-workspace');
    if (!box || box.dataset.txWired === '1') return;
    box.dataset.txWired = '1';
    box.addEventListener('click', function (evt) {
      var btn = evt.target && evt.target.closest ? evt.target.closest('[data-tx-action]') : null;
      if (!btn) return;
      var action = safeString(btn.getAttribute('data-tx-action'));
      var target = safeString(btn.getAttribute('data-tx-target'));
      var mark = safeString(btn.getAttribute('data-tx-mark'));
      if (action === 'open' && target) openSection(target);
      else if (action === 'open-press-bios') {
        openSection('press');
        togglePressTab('bios');
      } else if (action === 'copy-missing') {
        if (target === 'home') copyHomeMissingFromEn();
        else if (target === 'bio') copyBioMissingFromEn();
        else if (target === 'contact') copyContactFromEn(true);
        else if (target === 'ui') copyUiNavFromEn(true);
        else if (target === 'programs') {
          state.programsDoc = safeProgramsDoc(loadProgramsCanonicalForLang(state.lang));
          copyProgramsFromEn(true);
        } else if (target === 'press_bios') {
          state.epkBios = safeEpkBios(loadDoc('rg_epk_bios', {}));
          copyPressBiosMissingFromEn();
        }
        refreshTranslationWorkspace();
      } else if (action === 'compare') {
        if (target === 'home') compareHomeWithEn();
        else if (target === 'bio') compareBioWithEn();
        else if (target === 'contact') compareContactWithEn();
        else if (target === 'ui') compareUiWithEn();
        else if (target === 'programs') compareProgramsWithEn();
        else if (target === 'press_bios') comparePressBiosWithEn();
      } else if (action === 'mark' && target && mark) setSectionEditorialReview(target, mark);
    });
  }

  function normEditorial(s) {
    return safeString(s).trim().toLowerCase();
  }
  function workflowBucketProgram(p) {
    if (!p || !isObject(p)) return 'draft';
    var es = normEditorial(p.editorialStatus);
    if (p.published === false || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketPress(p) {
    if (!p || !isObject(p)) return 'draft';
    var es = normEditorial(p.editorialStatus);
    if (p.visible === false || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketVideo(v) {
    if (!v || !isObject(v)) return 'draft';
    var es = normEditorial(v.editorialStatus);
    if (v.hidden || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketPerf(e) {
    if (!e || !isObject(e)) return 'draft';
    var st = safeString(e.status || 'upcoming');
    var es = normEditorial(e.editorialStatus);
    if (st === 'hidden' || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketRep(c) {
    if (!c || !isObject(c)) return 'draft';
    var es = normEditorial(c.editorialStatus);
    if (es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function programReadyCheck(p) {
    var issues = [];
    if (isBlank(p.title)) issues.push('Title missing');
    if (isBlank(p.description)) issues.push('Description missing');
    if (p.published === false) issues.push('Unpublished (hidden from listings)');
    var es = normEditorial(p.editorialStatus);
    if (es === 'hidden' || es === 'draft' || es === 'needs_translation' || es === 'needs translation') {
      issues.push('Editorial state: ' + (es || 'draft'));
    }
    return { ok: issues.length === 0, issues: issues };
  }
  function pressQuoteReadyCheck(p) {
    var issues = [];
    if (p.visible === false) issues.push('Hidden');
    if (isBlank(p.source)) issues.push('Source missing');
    var qv = isObject(p.quotes_i18n) ? p.quotes_i18n[state.lang] : p.quote;
    if (isBlank(qv)) issues.push('Quote text missing for ' + state.lang.toUpperCase());
    var url = safeString(p.url).trim();
    if (url && !isValidHttpUrl(url)) issues.push('Press URL looks invalid');
    var es = normEditorial(p.editorialStatus);
    if (es === 'draft' || es === 'needs_translation') issues.push('Editorial: ' + (es || 'draft'));
    return { ok: issues.length === 0, issues: issues };
  }
  function videoReadyCheck(v) {
    var issues = [];
    if (v.hidden) issues.push('Hidden');
    if (isBlank(v.id)) issues.push('Video ID missing');
    if (isBlank(v.title)) issues.push('Title missing');
    var th = safeString(v.customThumb).trim();
    if (th && !isValidHttpUrl(th)) issues.push('Thumbnail URL looks invalid');
    return { ok: issues.length === 0, issues: issues };
  }
  function perfReadyCheck(e) {
    var issues = [];
    if (safeString(e.status) === 'hidden') issues.push('Status hidden');
    if (isBlank(e.sortDate)) issues.push('Sort date missing');
    if (isBlank(e.time)) issues.push('Time missing');
    if (isBlank(e.venue)) issues.push('Venue missing');
    return { ok: issues.length === 0, issues: issues };
  }
  function repCardReadyCheck(c) {
    var issues = [];
    if (isBlank(c.composer)) issues.push('Composer missing');
    if (isBlank(c.opera)) issues.push('Work missing');
    if (isBlank(c.role)) issues.push('Role missing');
    return { ok: issues.length === 0, issues: issues };
  }
  function passesWorkflowFilter(bucket, filter) {
    var f = filter || 'all';
    if (f === 'all') return true;
    if (f === 'ready') return false;
    return bucket === f;
  }
  function programsListedIndices() {
    var arr = state.programsDoc.programs;
    var f = state.programsWorkflowFilter || 'all';
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      var b = workflowBucketProgram(p);
      if (f === 'ready') {
        if (programReadyCheck(p).ok && b !== 'hidden') out.push(i);
      } else if (passesWorkflowFilter(b, f)) out.push(i);
    }
    return out;
  }
  function publishingCountsForBucket(counts, bucket) {
    var o = counts[bucket];
    return typeof o === 'number' ? o : 0;
  }
  function refreshPublishingDashboard() {
    var summary = $('publishing-summary');
    var readyBox = $('publishing-ready');
    if (!summary) return;
    var lang = state.lang;
    var prog = safeProgramsDoc(loadProgramsCanonicalForLang(lang));
    var press = loadDoc('rg_press', []);
    if (!Array.isArray(press)) press = [];
    var perfs = loadDoc('rg_perfs', []);
    if (!Array.isArray(perfs)) perfs = [];
    var vidData = safeMediaVideos(loadDoc('rg_vid', {}));
    var rep = loadDoc('rg_rep_cards', []);
    if (!Array.isArray(rep)) rep = [];

    var buckets = ['draft', 'needs_translation', 'translated', 'reviewed', 'published', 'hidden', 'ready'];
    function z() {
      var o = {};
      buckets.forEach(function (b) { o[b] = 0; });
      return o;
    }
    var C = {
      programs: z(),
      press: z(),
      media: z(),
      calendar: z(),
      rep: z()
    };

    prog.programs.forEach(function (p) {
      var b = workflowBucketProgram(p);
      C.programs[b] += 1;
      if (programReadyCheck(p).ok && b !== 'hidden') C.programs.ready += 1;
    });
    press.forEach(function (p) {
      var b = workflowBucketPress(p);
      C.press[b] += 1;
      if (pressQuoteReadyCheck(p).ok && b !== 'hidden') C.press.ready += 1;
    });
    vidData.videos.forEach(function (v) {
      var b = workflowBucketVideo(v);
      C.media[b] += 1;
      if (videoReadyCheck(v).ok && b !== 'hidden') C.media.ready += 1;
    });
    perfs.forEach(function (e) {
      var b = workflowBucketPerf(e);
      C.calendar[b] += 1;
      if (perfReadyCheck(e).ok && safeString(e.status) !== 'hidden') C.calendar.ready += 1;
    });
    rep.forEach(function (c) {
      var b = workflowBucketRep(c);
      C.rep[b] += 1;
      if (repCardReadyCheck(c).ok && b !== 'hidden') C.rep.ready += 1;
    });

    function rowLabel(key) {
      if (key === 'needs_translation') return 'Needs translation';
      if (key === 'ready') return 'Ready to publish';
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
    function tableFor(title, counts) {
      var head = buckets.map(function (b) { return '<th>' + escapeHtml(rowLabel(b)) + '</th>'; }).join('');
      var cells = buckets.map(function (b) { return '<td>' + publishingCountsForBucket(counts, b) + '</td>'; }).join('');
      return '<h3 class="tools-subheading">' + escapeHtml(title) + '</h3><table class="pub-sum-table"><thead><tr><th>Area</th>' + head + '</tr></thead><tbody><tr><th>' + escapeHtml(title) + '</th>' + cells + '</tr></tbody></table>';
    }

    summary.innerHTML =
      '<p class="muted">Language for Programs is <strong>' + lang.toUpperCase() + '</strong>; Press, Media, Calendar, and Repertoire are shared lists.</p>' +
      tableFor('Programs (' + lang.toUpperCase() + ')', C.programs) +
      tableFor('Press quotes', C.press) +
      tableFor('Media videos', C.media) +
      tableFor('Calendar events', C.calendar) +
      tableFor('Repertoire cards', C.rep) +
      '<div class="toolbar pub-jump-tools">' +
      '<button type="button" data-pub-jump="programs:draft">Programs · drafts</button>' +
      '<button type="button" data-pub-jump="programs:ready">Programs · ready</button>' +
      '<button type="button" data-pub-jump="press:needs_translation">Press · needs translation</button>' +
      '<button type="button" data-pub-jump="media:draft">Media · drafts</button>' +
      '<button type="button" data-pub-jump="calendar:published">Calendar · published</button>' +
      '<button type="button" data-pub-jump="rep:reviewed">Repertoire · reviewed</button>' +
      '</div>';

    if (readyBox) {
      var lines = [];
      prog.programs.forEach(function (p, i) {
        var pr = programReadyCheck(p);
        if (!pr.ok && workflowBucketProgram(p) !== 'hidden') {
          lines.push('Program #' + (i + 1) + ' · ' + safeString(p.title).slice(0, 40) + ' — ' + pr.issues.join('; '));
        }
      });
      press.forEach(function (p, i) {
        var pr = pressQuoteReadyCheck(p);
        if (!pr.ok && workflowBucketPress(p) !== 'hidden') {
          lines.push('Press #' + (i + 1) + ' — ' + pr.issues.join('; '));
        }
      });
      vidData.videos.forEach(function (v, i) {
        var pr = videoReadyCheck(v);
        if (!pr.ok && workflowBucketVideo(v) !== 'hidden') lines.push('Video #' + (i + 1) + ' — ' + pr.issues.join('; '));
      });
      perfs.forEach(function (e, i) {
        var pr = perfReadyCheck(e);
        if (!pr.ok && safeString(e.status) !== 'hidden') lines.push('Event #' + (i + 1) + ' — ' + pr.issues.join('; '));
      });
      if (!lines.length) readyBox.innerHTML = '<p class="muted ok">No blocked items found for usual publish checks (in non-hidden entries).</p>';
      else {
        readyBox.innerHTML =
          '<p class="muted">Items that may still need work before publishing (first pass):</p><ul>' +
          lines.slice(0, 35).map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') +
          (lines.length > 35 ? '<li>… ' + (lines.length - 35) + ' more</li>' : '') +
          '</ul>';
      }
    }
  }
  function publishingJumpTo(section, filter) {
    if (!filter) filter = 'all';
    if (section === 'programs') {
      state.programsWorkflowFilter = filter;
      if ($('programs-workflow-filter')) $('programs-workflow-filter').value = filter;
      openSection('programs');
    } else if (section === 'press') {
      state.pressWorkflowFilter = filter;
      if ($('press-workflow-filter')) $('press-workflow-filter').value = filter;
      openSection('press');
    } else if (section === 'media') {
      state.mediaVidWorkflowFilter = filter;
      if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').value = filter;
      openSection('media');
    } else if (section === 'calendar') {
      state.perfWorkflowFilter = filter;
      if ($('perf-workflow-filter')) $('perf-workflow-filter').value = filter;
      openSection('calendar');
    } else if (section === 'rep') {
      state.repWorkflowFilter = filter;
      if ($('rep-workflow-filter')) $('rep-workflow-filter').value = filter;
      openSection('rep');
    }
  }
  function programReviewAndPublishCurrent() {
    if (state.programsIndex < 0) return alert('Select a program in the list.');
    var p = state.programsDoc.programs[state.programsIndex];
    if (!p) return;
    p.editorialStatus = 'published';
    p.published = true;
    renderProgramsList();
    renderProgramsEditor();
    markDirty(true, 'Program marked reviewed + published');
    setStatus('Published workflow: editorial set to published and card is visible.', 'ok');
  }
  function pressHideCurrentQuote() {
    if (state.pressIndex < 0) return;
    var p = state.press[state.pressIndex];
    if (!p) return;
    p.visible = false;
    p.editorialStatus = 'hidden';
    renderPressList();
    renderPressEditor();
    markDirty(true, 'Quote hidden');
  }
  function perfArchiveCurrentEvent() {
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex];
    if (!e) return;
    e.status = 'past';
    renderPerfList();
    renderPerfEditor();
    markDirty(true, 'Event marked past');
  }
  function applyProgramsBulkEditorial() {
    var ids = selectedIndices(state.programsSelected);
    var action = safeString($('programs-bulk-editorial') && $('programs-bulk-editorial').value).trim();
    if (!ids.length) return alert('No programs selected.');
    if (!action) return alert('Choose a bulk editorial action.');
    if (!window.confirm('Apply editorial action to ' + ids.length + ' program card(s)?')) return;
    ids.forEach(function (i) {
      var p = state.programsDoc.programs[i];
      if (!p) return;
      if (action === 'publish') {
        p.editorialStatus = 'published';
        p.published = true;
      } else if (action === 'reviewed_only') {
        p.editorialStatus = 'reviewed';
      } else if (action === 'draft') {
        p.editorialStatus = 'draft';
        p.published = false;
      } else if (action === 'unpublish') {
        p.editorialStatus = 'draft';
        p.published = true;
      } else if (action === 'hide') {
        p.editorialStatus = 'hidden';
        p.published = false;
      } else if (action === 'unhide') {
        p.published = true;
        if (normEditorial(p.editorialStatus) === 'hidden') p.editorialStatus = 'draft';
      } else if (action === 'needs_translation') {
        p.editorialStatus = 'needs_translation';
      } else if (action === 'translated') {
        p.editorialStatus = 'translated';
      }
    });
    clearSelected(state.programsSelected);
    renderProgramsList();
    renderProgramsEditor();
    setSelectionCount('programs-selection-count', state.programsSelected);
    markDirty(true, 'Programs bulk editorial applied');
  }

  function addProgramFromTemplate() {
    var arr = state.programsDoc.programs;
    var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
    arr.push({ id: maxId + 1, order: arr.length, published: false, editorialStatus: 'draft', title: 'New program title', description: 'Program description', formations: [], duration: '', idealFor: [] });
    state.programsIndex = arr.length - 1;
    renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program template created');
  }
  function duplicateCurrentProgramToLanguage() {
    if (state.programsIndex < 0) return alert('Select a program first.');
    var target = safeString(window.prompt('Target language (en, de, es, it, fr):', state.lang)).trim().toLowerCase();
    if (!target || LANGS.indexOf(target) < 0) return;
    if (target === state.lang) return alert('Target language is current language.');
    var item = clone(state.programsDoc.programs[state.programsIndex] || {});
    if (!isObject(item)) return;
    var targetDoc = safeProgramsDoc(loadProgramsCanonicalForLang(target));
    targetDoc.programs.push(item);
    targetDoc = safeProgramsDoc(targetDoc);
    targetDoc.programs.forEach(function (p, i) { p.order = i; if (!p.id) p.id = i + 1; });
    saveDoc('rg_programs_' + target, targetDoc);
    pushActivitySummary('Program duplicated to language', ['From ' + state.lang.toUpperCase() + ' to ' + target.toUpperCase()]);
    setStatus('Program duplicated to ' + target.toUpperCase() + '.', 'ok');
  }
  function addQuoteFromTemplate() {
    state.press.push({ id: Date.now(), source: 'Publication', quote: 'Quote text', production: '', url: '', visible: true, editorialStatus: 'draft', order: state.press.length, quotes_i18n: {}, production_i18n: {} });
    state.pressIndex = state.press.length - 1;
    renderPressList(); renderPressEditor(); markDirty(true, 'Quote template created');
  }
  function addEventFromTemplate() {
    state.perfs.push({ title: 'Event title', detail: '', day: '', month: '', time: '20:00', venue: '', city: '', status: 'upcoming', type: 'concert', editorialStatus: 'draft', sortDate: '' });
    state.perfIndex = state.perfs.length - 1;
    renderPerfList(); renderPerfEditor(); markDirty(true, 'Event template created');
  }
  function visibleIndicesFromList(listId) {
    var box = $(listId);
    if (!box) return [];
    return Array.prototype.map.call(box.querySelectorAll('.item[data-idx]'), function (el) {
      return Number(el.getAttribute('data-idx'));
    }).filter(function (n) { return Number.isFinite(n) && n >= 0; });
  }
  function selectVisibleInto(map, listId) {
    clearSelected(map);
    visibleIndicesFromList(listId).forEach(function (idx) { map[idx] = true; });
  }
  function selectedIndices(map) {
    return Object.keys(map || {}).filter(function (k) { return !!map[k]; }).map(function (k) { return Number(k); }).filter(function (n) { return Number.isFinite(n); });
  }
  function applyRepBulk() {
    var ids = selectedIndices(state.repSelected);
    if (!ids.length) return alert('No Repertoire items selected.');
    var nextStatus = safeString($('rep-bulk-status').value).trim();
    var nextCat = safeString($('rep-bulk-cat').value).trim();
    if (!nextStatus && !nextCat) return alert('Choose at least one bulk value (status or category).');
    if (!window.confirm('Apply Repertoire bulk update to ' + ids.length + ' selected item(s)?')) return;
    ids.forEach(function (i) {
      var c = state.repCards[i];
      if (!c) return;
      if (nextStatus) c.status = nextStatus;
      if (nextCat) c.cat = nextCat;
    });
    renderRepList();
    renderRepEditor();
    markDirty(true, 'Repertoire bulk update applied to ' + ids.length + ' item(s)');
  }
  function applyPerfBulk() {
    var ids = selectedIndices(state.perfSelected);
    var status = safeString($('perf-bulk-status').value).trim();
    if (!ids.length) return alert('No Calendar events selected.');
    if (!status) return alert('Choose a bulk status.');
    if (!window.confirm('Set status "' + status + '" for ' + ids.length + ' selected event(s)?')) return;
    ids.forEach(function (i) {
      var e = state.perfs[i];
      if (!e) return;
      e.status = status;
    });
    renderPerfList();
    renderPerfEditor();
    markDirty(true, 'Calendar bulk status updated for ' + ids.length + ' event(s)');
  }
  function applyMediaVidBulk() {
    var ids = selectedIndices(state.mediaVidSelected);
    var action = safeString($('media-vid-bulk-action').value).trim();
    if (!ids.length) return alert('No videos selected.');
    if (!action) return alert('Choose a bulk action.');
    if (!window.confirm('Apply "' + action + '" to ' + ids.length + ' selected video(s)?')) return;
    ids.forEach(function (i) {
      var v = state.vidData.videos[i];
      if (!v) return;
      if (action === 'visible') v.hidden = false;
      else if (action === 'hidden') v.hidden = true;
      else if (action === 'featured') v.featured = true;
      else if (action === 'not_featured') v.featured = false;
      else if (action === 'publish_video') {
        v.hidden = false;
        v.editorialStatus = 'published';
      } else if (action === 'draft_video') {
        v.editorialStatus = 'draft';
        v.hidden = false;
      } else if (action === 'hide_editorial') {
        v.hidden = true;
        v.editorialStatus = 'hidden';
      } else if (action === 'review_video') {
        v.editorialStatus = 'reviewed';
      }
    });
    renderMediaVideosList();
    renderMediaVideoEditor();
    markDirty(true, 'Media videos bulk action applied to ' + ids.length + ' item(s)');
  }
  function applyPressEditorialBulk() {
    var ids = selectedIndices(state.pressSelected);
    var action = safeString($('press-bulk-editorial') && $('press-bulk-editorial').value).trim();
    if (!ids.length) return alert('No quotes selected.');
    if (!action) return alert('Choose an editorial action.');
    if (!window.confirm('Apply editorial change to ' + ids.length + ' quote(s)?')) return;
    ids.forEach(function (i) {
      var p = state.press[i];
      if (!p) return;
      if (action === 'publish_quote') {
        p.visible = true;
        p.editorialStatus = 'published';
      } else if (action === 'draft_quote') {
        p.visible = true;
        p.editorialStatus = 'draft';
      } else if (action === 'hide_quote') {
        p.visible = false;
        p.editorialStatus = 'hidden';
      } else if (action === 'needs_translation') {
        p.editorialStatus = 'needs_translation';
        p.visible = true;
      } else if (action === 'reviewed_quote') {
        p.editorialStatus = 'reviewed';
        p.visible = true;
      }
    });
    clearSelected(state.pressSelected);
    renderPressList();
    renderPressEditor();
    markDirty(true, 'Press quotes editorial bulk applied');
  }
  function applyPerfEditorialBulk() {
    var ids = selectedIndices(state.perfSelected);
    var action = safeString($('perf-bulk-editorial') && $('perf-bulk-editorial').value).trim();
    if (!ids.length) return alert('No events selected.');
    if (!action) return alert('Choose an editorial action.');
    if (!window.confirm('Apply editorial change to ' + ids.length + ' event(s)?')) return;
    ids.forEach(function (i) {
      var e = state.perfs[i];
      if (!e) return;
      if (action === 'publish_event') e.editorialStatus = 'published';
      else if (action === 'draft_event') e.editorialStatus = 'draft';
      else if (action === 'reviewed_event') e.editorialStatus = 'reviewed';
      else if (action === 'hide_event') {
        e.editorialStatus = 'hidden';
        e.status = 'hidden';
      } else if (action === 'unhide_event') {
        if (safeString(e.status) === 'hidden') e.status = 'upcoming';
        if (normEditorial(e.editorialStatus) === 'hidden') e.editorialStatus = 'draft';
      }
    });
    clearSelected(state.perfSelected);
    renderPerfList();
    renderPerfEditor();
    markDirty(true, 'Calendar editorial bulk applied');
  }
  function applyRepEditorialBulk() {
    var ids = selectedIndices(state.repSelected);
    var action = safeString($('rep-bulk-editorial') && $('rep-bulk-editorial').value).trim();
    if (!ids.length) return alert('No repertoire items selected.');
    if (!action) return alert('Choose an editorial action.');
    if (!window.confirm('Apply editorial change to ' + ids.length + ' card(s)?')) return;
    ids.forEach(function (i) {
      var c = state.repCards[i];
      if (!c) return;
      if (action === 'publish_rep') c.editorialStatus = 'published';
      else if (action === 'draft_rep') c.editorialStatus = 'draft';
      else if (action === 'reviewed_rep') c.editorialStatus = 'reviewed';
      else if (action === 'hide_rep') c.editorialStatus = 'hidden';
    });
    clearSelected(state.repSelected);
    renderRepList();
    renderRepEditor();
    markDirty(true, 'Repertoire editorial bulk applied');
  }
  function applyPressBulk() {
    var ids = selectedIndices(state.pressSelected);
    var action = safeString($('press-bulk-visible').value).trim();
    if (!ids.length) return alert('No quotes selected.');
    if (!action) return alert('Choose a bulk visibility action.');
    if (!window.confirm('Apply visibility update to ' + ids.length + ' selected quote(s)?')) return;
    ids.forEach(function (i) {
      var p = state.press[i];
      if (!p) return;
      p.visible = action === 'visible';
    });
    renderPressList();
    renderPressEditor();
    markDirty(true, 'Press bulk visibility updated for ' + ids.length + ' quote(s)');
  }
  function moveArrayIndex(arr, fromIdx, toIdx) {
    if (!Array.isArray(arr)) return false;
    var from = Number(fromIdx);
    var to = Number(toIdx);
    if (!Number.isFinite(from) || !Number.isFinite(to)) return false;
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length || from === to) return false;
    var item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    return true;
  }
  function applyMoveToPosition(section, inputId) {
    var pos = Number($(inputId) && $(inputId).value) - 1;
    if (!Number.isFinite(pos) || pos < 0) return alert('Enter a valid target position.');
    if (section === 'rep') {
      if (state.repIndex < 0) return;
      if (!moveArrayIndex(state.repCards, state.repIndex, Math.min(pos, state.repCards.length - 1))) return;
      state.repIndex = Math.min(pos, state.repCards.length - 1);
      clearSelected(state.repSelected); renderRepList(); renderRepEditor(); markDirty(true, 'Repertoire item moved');
    } else if (section === 'programs') {
      if (state.programsIndex < 0) return;
      if (!moveArrayIndex(state.programsDoc.programs, state.programsIndex, Math.min(pos, state.programsDoc.programs.length - 1))) return;
      state.programsIndex = Math.min(pos, state.programsDoc.programs.length - 1);
      normalizeProgramOrders(); renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program moved');
    } else if (section === 'media-vid') {
      if (state.vidIndex < 0) return;
      if (!moveArrayIndex(state.vidData.videos, state.vidIndex, Math.min(pos, state.vidData.videos.length - 1))) return;
      state.vidIndex = Math.min(pos, state.vidData.videos.length - 1);
      clearSelected(state.mediaVidSelected); renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video moved');
    } else if (section === 'press') {
      if (state.pressIndex < 0) return;
      if (!moveArrayIndex(state.press, state.pressIndex, Math.min(pos, state.press.length - 1))) return;
      state.pressIndex = Math.min(pos, state.press.length - 1);
      clearSelected(state.pressSelected); renderPressList(); renderPressEditor(); markDirty(true, 'Press quote moved');
    } else if (section === 'epk-photo') {
      if (state.epkPhotoIndex < 0) return;
      if (!moveArrayIndex(state.epkPhotos, state.epkPhotoIndex, Math.min(pos, state.epkPhotos.length - 1))) return;
      state.epkPhotoIndex = Math.min(pos, state.epkPhotos.length - 1);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo moved');
    } else if (section === 'perf') {
      if (state.perfIndex < 0) return;
      if (!moveArrayIndex(state.perfs, state.perfIndex, Math.min(pos, state.perfs.length - 1))) return;
      state.perfIndex = Math.min(pos, state.perfs.length - 1);
      clearSelected(state.perfSelected); renderPerfList(); renderPerfEditor(); markDirty(true, 'Calendar event moved');
    }
  }
  function goPrevNext(section, dir) {
    if (section === 'rep') { if (state.repIndex < 0) return; state.repIndex = Math.max(0, Math.min(state.repCards.length - 1, state.repIndex + dir)); renderRepList(); renderRepEditor(); return; }
    if (section === 'programs') { if (state.programsIndex < 0) return; state.programsIndex = Math.max(0, Math.min(state.programsDoc.programs.length - 1, state.programsIndex + dir)); renderProgramsList(); renderProgramsEditor(); return; }
    if (section === 'media-vid') { if (state.vidIndex < 0) return; state.vidIndex = Math.max(0, Math.min(state.vidData.videos.length - 1, state.vidIndex + dir)); renderMediaVideosList(); renderMediaVideoEditor(); return; }
    if (section === 'press') { if (state.pressIndex < 0) return; state.pressIndex = Math.max(0, Math.min(state.press.length - 1, state.pressIndex + dir)); renderPressList(); renderPressEditor(); return; }
    if (section === 'epk-photo') { if (state.epkPhotoIndex < 0) return; state.epkPhotoIndex = Math.max(0, Math.min(state.epkPhotos.length - 1, state.epkPhotoIndex + dir)); renderEpkPhotoList(); renderEpkPhotoEditor(); return; }
    if (section === 'perf') { if (state.perfIndex < 0) return; state.perfIndex = Math.max(0, Math.min(state.perfs.length - 1, state.perfIndex + dir)); renderPerfList(); renderPerfEditor(); return; }
  }
  function revertCurrentItemToSaved(section) {
    if (section === 'rep' && state.repIndex >= 0) {
      var repSaved = getStoredDocRaw('rg_rep_cards', []);
      if (Array.isArray(repSaved) && repSaved[state.repIndex]) state.repCards[state.repIndex] = clone(repSaved[state.repIndex]);
      renderRepList(); renderRepEditor(); markDirty(true, 'Reverted current repertoire item');
    } else if (section === 'programs' && state.programsIndex >= 0) {
      var progSaved = safeProgramsDoc(getStoredDocRaw('rg_programs_' + state.lang, {}));
      if (Array.isArray(progSaved.programs) && progSaved.programs[state.programsIndex]) state.programsDoc.programs[state.programsIndex] = clone(progSaved.programs[state.programsIndex]);
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Reverted current program item');
    } else if (section === 'media-vid' && state.vidIndex >= 0) {
      var vidSaved = safeMediaVideos(getStoredDocRaw('rg_vid', {}));
      if (Array.isArray(vidSaved.videos) && vidSaved.videos[state.vidIndex]) state.vidData.videos[state.vidIndex] = clone(vidSaved.videos[state.vidIndex]);
      renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Reverted current video');
    } else if (section === 'press' && state.pressIndex >= 0) {
      var pressSaved = getStoredDocRaw('rg_press', []);
      if (Array.isArray(pressSaved) && pressSaved[state.pressIndex]) state.press[state.pressIndex] = clone(pressSaved[state.pressIndex]);
      renderPressList(); renderPressEditor(); markDirty(true, 'Reverted current quote');
    } else if (section === 'epk-photo' && state.epkPhotoIndex >= 0) {
      var photoSaved = safeEpkPhotos(getStoredDocRaw('rg_epk_photos', []));
      if (Array.isArray(photoSaved) && photoSaved[state.epkPhotoIndex]) state.epkPhotos[state.epkPhotoIndex] = clone(photoSaved[state.epkPhotoIndex]);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'Reverted current EPK photo');
    } else if (section === 'perf' && state.perfIndex >= 0) {
      var perfSaved = getStoredDocRaw('rg_perfs', []);
      if (Array.isArray(perfSaved) && perfSaved[state.perfIndex]) state.perfs[state.perfIndex] = clone(perfSaved[state.perfIndex]);
      renderPerfList(); renderPerfEditor(); markDirty(true, 'Reverted current event');
    }
  }
  function publicUrlForCurrentSection() {
    var base = window.location.origin + '/';
    var map = {
      home: 'index.html',
      bio: 'biography.html',
      rep: 'repertoire.html',
      programs: 'programs.html',
      calendar: 'calendar.html',
      media: 'media.html',
      press: 'presskit.html',
      contact: 'contact.html'
    };
    return base + (map[state.section] || 'index.html');
  }
  function copyCurrentPublicUrl() {
    var url = publicUrlForCurrentSection();
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(url).then(function () {
        setStatus('Public URL copied', 'ok');
        pushActivitySummary('Shortcut', ['Copied public URL for ' + state.section]);
      }).catch(function () { window.prompt('Copy public URL:', url); });
    } else {
      window.prompt('Copy public URL:', url);
    }
  }
  function toggleFocusMode() {
    state.focusMode = !state.focusMode;
    document.body.classList.toggle('focus-mode', state.focusMode);
    if ($('focusModeBtn')) $('focusModeBtn').textContent = state.focusMode ? 'Exit focus mode' : 'Focus mode';
  }
  function saveUiJson() {
    try {
      var parsed = JSON.parse($('ui-json').value || '{}');
      if (!isObject(parsed)) throw new Error('JSON must be an object');
      saveDoc('rg_ui_' + state.lang, parsed);
    } catch (e) {
      setStatus('Invalid JSON: ' + e.message, 'err');
      alert('Invalid JSON: ' + e.message);
    }
  }

  function updateContactValidation() {
    var email = safeString($('contact-email') && $('contact-email').value).trim();
    var web = safeString($('contact-webUrl') && $('contact-webUrl').value).trim();
    setValidationText('contact-email-validation', isValidEmail(email), email ? (isValidEmail(email) ? 'Email format looks valid.' : 'Invalid email format.') : 'Email is empty.');
    if (!web) setValidationText('contact-web-validation', false, 'Website URL is missing.');
    else setValidationText('contact-web-validation', isValidHttpUrl(web), isValidHttpUrl(web) ? 'Website URL looks valid.' : 'Website URL should start with http:// or https://');
  }
  function updatePdfValidation() {
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    var invalid = [];
    langs.forEach(function (L) {
      var d = safeString($('pdf-dossier-' + L) && $('pdf-dossier-' + L).value).trim();
      var a = safeString($('pdf-artist-' + L) && $('pdf-artist-' + L).value).trim();
      if (d && !isValidHttpUrl(d)) invalid.push('Dossier ' + L);
      if (a && !isValidHttpUrl(a)) invalid.push('Artist Sheet ' + L);
    });
    var el = $('pdf-validation');
    if (!el) return;
    if (!invalid.length) {
      el.textContent = 'All entered PDF URLs look valid.';
      el.classList.remove('err');
      el.classList.add('ok');
    } else {
      el.textContent = 'Invalid URL format: ' + invalid.join(', ');
      el.classList.remove('ok');
      el.classList.add('err');
    }
  }
  function updateCompletenessIndicators() {
    var homeMissing = 0;
    ['hero-eyebrow', 'hero-subtitle', 'hero-cta1', 'hero-cta2', 'hero-introCtaBio', 'hero-introCtaMedia'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) homeMissing += 1;
    });
    setPillStatus('home-completeness', homeMissing ? 'warn' : 'ok', homeMissing ? ('Missing fields: ' + homeMissing) : 'Complete');

    var bioMissing = 0;
    ['bio-h2', 'bio-p1', 'bio-p2', 'bio-quote'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) bioMissing += 1;
    });
    setPillStatus('bio-completeness', bioMissing ? 'warn' : 'ok', bioMissing ? ('Missing fields: ' + bioMissing) : 'Complete');

    var programMissing = 0;
    if (isBlank($('programs-title').value)) programMissing += 1;
    var hasPrograms = Array.isArray(state.programsDoc && state.programsDoc.programs) && state.programsDoc.programs.length > 0;
    if (!hasPrograms) programMissing += 1;
    setPillStatus('programs-completeness', programMissing ? 'warn' : 'ok', programMissing ? (hasPrograms ? 'Missing header text' : 'No program cards') : 'Complete');

    var contactMissing = 0;
    ['contact-title', 'contact-sub', 'contact-email'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) contactMissing += 1;
    });
    setPillStatus('contact-completeness', contactMissing ? 'warn' : 'ok', contactMissing ? ('Missing fields: ' + contactMissing) : 'Complete');

    var pressMissing = 0;
    var b = state.epkBios[state.lang] || {};
    ['b50', 'b150', 'b300p1'].forEach(function (k) {
      if (isBlank(b[k])) pressMissing += 1;
    });
    var hasAnyPdf = ['EN', 'DE', 'ES', 'IT', 'FR'].some(function (L) {
      return !isBlank($('pdf-dossier-' + L).value) || !isBlank($('pdf-artist-' + L).value);
    });
    if (!hasAnyPdf) pressMissing += 1;
    setPillStatus('press-completeness', pressMissing ? 'warn' : 'ok', pressMissing ? 'Missing bios/PDF fields' : 'Complete');

    var calendarMissing = 0;
    ['perf-h2', 'perf-intro'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) calendarMissing += 1;
    });
    setPillStatus('calendar-completeness', calendarMissing ? 'warn' : 'ok', calendarMissing ? 'Section text incomplete' : 'Section text complete');

    var uiMissing = 0;
    ['ui-nav-home', 'ui-nav-bio', 'ui-nav-rep', 'ui-nav-media', 'ui-nav-cal', 'ui-nav-epk', 'ui-nav-book'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) uiMissing += 1;
    });
    setPillStatus('ui-completeness', uiMissing ? 'warn' : 'ok', uiMissing ? ('Missing labels: ' + uiMissing) : 'Complete');
  }
  function clipText(v, max) {
    var s = safeString(v).trim();
    if (!s) return '';
    return s.length > max ? (s.slice(0, max - 1) + '…') : s;
  }
  function updateHomeMiniPreviews() {
    if (!$('home-preview-eyebrow')) return;
    $('home-preview-eyebrow').textContent = clipText($('hero-eyebrow').value, 48) || 'Eyebrow';
    $('home-preview-subtitle').textContent = clipText($('hero-subtitle').value, 120) || 'Subtitle';
    $('home-preview-cta1').textContent = clipText($('hero-cta1').value, 28) || 'CTA 1';
    $('home-preview-cta2').textContent = clipText($('hero-cta2').value, 28) || 'CTA 2';
    $('home-preview-quickBio').textContent = clipText($('hero-quickBioLabel').value, 22) || 'Biography';
    $('home-preview-quickCal').textContent = clipText($('hero-quickCalLabel').value, 22) || 'Calendar';
    $('home-preview-introBio').textContent = clipText($('hero-introCtaBio').value, 34) || 'Read biography';
    $('home-preview-introMedia').textContent = clipText($('hero-introCtaMedia').value, 34) || 'Watch & listen';
  }
  function updateBioMiniPreview() {
    if (!$('bio-preview-title')) return;
    $('bio-preview-title').textContent = clipText($('bio-h2').value, 80) || 'Biography';
    $('bio-preview-p1').textContent = clipText($('bio-p1').value, 180) || 'Paragraph 1';
    $('bio-preview-p2').textContent = clipText($('bio-p2').value, 180) || 'Paragraph 2';
    $('bio-preview-quote').textContent = clipText($('bio-quote').value, 130) || 'Quote';
  }
  function updateProgramsMiniPreview() {
    if (!$('programs-preview-title')) return;
    $('programs-preview-title').textContent = clipText($('programs-item-title').value, 70) || 'Program title';
    $('programs-preview-description').textContent = clipText($('programs-item-description').value, 180) || 'Program description';
    $('programs-preview-duration').textContent = clipText($('programs-item-duration').value, 36) || 'Duration';
  }
  function updatePressMiniPreview() {
    if (!$('press-preview-quote')) return;
    $('press-preview-quote').textContent = clipText($('press-quote').value, 180) || 'Quote text';
    $('press-preview-source').textContent = clipText($('press-source').value, 80) || 'Source';
  }
  function updateContactMiniPreview() {
    if (!$('contact-preview-title')) return;
    var titleHtml = safeString($('contact-title').value).trim();
    $('contact-preview-title').innerHTML = titleHtml || 'Contact title';
    $('contact-preview-sub').textContent = clipText($('contact-sub').value, 180) || 'Contact subtitle';
    $('contact-preview-emailBtn').textContent = clipText($('contact-emailBtn').value, 30) || 'Email button';
    $('contact-preview-webBtn').textContent = clipText($('contact-webBtn').value, 30) || 'Website button';
  }
  function badgesHtml(items) {
    if (!items || !items.length) return '';
    return '<span class="item-badges">' + items.map(function (b) {
      return '<span class="item-badge ' + safeString(b.kind || 'warn') + '">' + safeString(b.label) + '</span>';
    }).join('') + '</span>';
  }
  function setSelectionCount(id, selectedMap) {
    var el = $(id);
    if (!el) return;
    var count = Object.keys(selectedMap || {}).filter(function (k) { return !!selectedMap[k]; }).length;
    el.textContent = 'Selected: ' + count;
  }
  function toggleSelected(map, idx, checked) {
    if (!map) return;
    if (checked) map[idx] = true;
    else delete map[idx];
  }
  function clearSelected(map) {
    Object.keys(map || {}).forEach(function (k) { delete map[k]; });
  }
  function currentDraftKey() {
    return 'adm2_draft_' + safeString(state.section) + '_' + safeString(state.lang);
  }
  function serializeCurrentSectionDraft() {
    var s = state.section;
    if (s === 'home') return {
      eyebrow: $('hero-eyebrow').value, subtitle: $('hero-subtitle').value, cta1: $('hero-cta1').value, cta2: $('hero-cta2').value,
      quickBioLabel: $('hero-quickBioLabel').value, quickCalLabel: $('hero-quickCalLabel').value, introCtaBio: $('hero-introCtaBio').value,
      introCtaMedia: $('hero-introCtaMedia').value, bgImage: $('hero-bgImage').value, introImage: $('hero-introImage').value
    };
    if (s === 'bio') return {
      h2: $('bio-h2').value, p1: $('bio-p1').value, p2: $('bio-p2').value, quote: $('bio-quote').value, cite: $('bio-cite').value, portraitImage: $('bio-portraitImage').value
    };
    if (s === 'rep') return { h2: $('rep-h2').value, intro: $('rep-intro').value, repCards: clone(state.repCards), repIndex: state.repIndex };
    if (s === 'programs') return { programsDoc: clone(state.programsDoc), programsIndex: state.programsIndex };
    if (s === 'calendar') return { h2: $('perf-h2').value, intro: $('perf-intro').value, perfs: clone(state.perfs), perfIndex: state.perfIndex };
    if (s === 'media') return { vidData: clone(state.vidData), vidIndex: state.vidIndex, photosData: clone(state.photosData), photoCaptions: clone(state.photoCaptions), photoType: state.photoType, photoIndex: state.photoIndex };
    if (s === 'press') return { press: clone(state.press), pressIndex: state.pressIndex, publicPdfs: clone(state.publicPdfs), epkBios: clone(state.epkBios), epkPhotos: clone(state.epkPhotos), epkPhotoIndex: state.epkPhotoIndex };
    if (s === 'contact') return { title: $('contact-title').value, sub: $('contact-sub').value, email: $('contact-email').value, emailBtn: $('contact-emailBtn').value, webBtn: $('contact-webBtn').value, webUrl: $('contact-webUrl') ? $('contact-webUrl').value : '' };
    if (s === 'ui') return { nav: { home: $('ui-nav-home').value, bio: $('ui-nav-bio').value, rep: $('ui-nav-rep').value, media: $('ui-nav-media').value, cal: $('ui-nav-cal').value, epk: $('ui-nav-epk').value, book: $('ui-nav-book').value }, json: $('ui-json').value };
    return null;
  }
  function applySectionDraftObject(s, d) {
    if (!d) return;
    if (s === 'home') {
      $('hero-eyebrow').value = safeString(d.eyebrow); $('hero-subtitle').value = safeString(d.subtitle); $('hero-cta1').value = safeString(d.cta1); $('hero-cta2').value = safeString(d.cta2);
      $('hero-quickBioLabel').value = safeString(d.quickBioLabel); $('hero-quickCalLabel').value = safeString(d.quickCalLabel); $('hero-introCtaBio').value = safeString(d.introCtaBio);
      $('hero-introCtaMedia').value = safeString(d.introCtaMedia); $('hero-bgImage').value = safeString(d.bgImage); $('hero-introImage').value = safeString(d.introImage);
      updateHomeIntroPreview(); updateHomeMiniPreviews();
    } else if (s === 'bio') {
      $('bio-h2').value = safeString(d.h2); $('bio-p1').value = safeString(d.p1); $('bio-p2').value = safeString(d.p2); $('bio-quote').value = safeString(d.quote); $('bio-cite').value = safeString(d.cite); $('bio-portraitImage').value = safeString(d.portraitImage);
      updateBioPortraitPreview(); updateBioMiniPreview();
    } else if (s === 'rep') {
      state.repCards = Array.isArray(d.repCards) ? clone(d.repCards) : [];
      state.repIndex = Number.isFinite(Number(d.repIndex)) ? Number(d.repIndex) : -1;
      $('rep-h2').value = safeString(d.h2); $('rep-intro').value = safeString(d.intro);
      renderRepList(); renderRepEditor();
    } else if (s === 'programs') {
      state.programsDoc = safeProgramsDoc(d.programsDoc || {});
      state.programsIndex = Number.isFinite(Number(d.programsIndex)) ? Number(d.programsIndex) : -1;
      renderProgramsList(); renderProgramsEditor();
    } else if (s === 'calendar') {
      state.perfs = Array.isArray(d.perfs) ? clone(d.perfs) : [];
      state.perfIndex = Number.isFinite(Number(d.perfIndex)) ? Number(d.perfIndex) : -1;
      $('perf-h2').value = safeString(d.h2); $('perf-intro').value = safeString(d.intro);
      renderPerfList(); renderPerfEditor();
    } else if (s === 'media') {
      state.vidData = safeMediaVideos(d.vidData || {});
      state.vidIndex = Number.isFinite(Number(d.vidIndex)) ? Number(d.vidIndex) : -1;
      state.photosData = safePhotos(d.photosData || {});
      state.photoCaptions = isObject(d.photoCaptions) ? clone(d.photoCaptions) : {};
      state.photoType = safeString(d.photoType || 's');
      state.photoIndex = Number.isFinite(Number(d.photoIndex)) ? Number(d.photoIndex) : -1;
      $('media-vid-h2').value = safeString(state.vidData.h2);
      renderMediaVideosList(); renderMediaVideoEditor(); renderMediaPhotosList(); renderMediaPhotoEditor();
    } else if (s === 'press') {
      state.press = Array.isArray(d.press) ? clone(d.press) : [];
      state.pressIndex = Number.isFinite(Number(d.pressIndex)) ? Number(d.pressIndex) : -1;
      state.publicPdfs = safePublicPdfs(d.publicPdfs || {});
      state.epkBios = safeEpkBios(d.epkBios || {});
      state.epkPhotos = safeEpkPhotos(d.epkPhotos || []);
      state.epkPhotoIndex = Number.isFinite(Number(d.epkPhotoIndex)) ? Number(d.epkPhotoIndex) : -1;
      loadPressPdfsIntoUi(); loadEpkBiosIntoUi(); renderPressList(); renderPressEditor(); renderEpkPhotoList(); renderEpkPhotoEditor();
    } else if (s === 'contact') {
      $('contact-title').value = safeString(d.title); $('contact-sub').value = safeString(d.sub); $('contact-email').value = safeString(d.email); $('contact-emailBtn').value = safeString(d.emailBtn); $('contact-webBtn').value = safeString(d.webBtn); if ($('contact-webUrl')) $('contact-webUrl').value = safeString(d.webUrl);
      updateContactValidation(); updateContactMiniPreview();
    } else if (s === 'ui') {
      var nav = isObject(d.nav) ? d.nav : {};
      $('ui-nav-home').value = safeString(nav.home); $('ui-nav-bio').value = safeString(nav.bio); $('ui-nav-rep').value = safeString(nav.rep); $('ui-nav-media').value = safeString(nav.media);
      $('ui-nav-cal').value = safeString(nav.cal); $('ui-nav-epk').value = safeString(nav.epk); $('ui-nav-book').value = safeString(nav.book); $('ui-json').value = safeString(d.json);
    }
    updateCompletenessIndicators();
  }
  function saveLocalDraftForCurrentSection() {
    if (!state.ready || !state.section) return;
    var draft = serializeCurrentSectionDraft();
    if (!draft) return;
    var key = currentDraftKey();
    try {
      var prevRaw = localStorage.getItem(key);
      var nextRaw = JSON.stringify({ ts: Date.now(), section: state.section, lang: state.lang, data: draft });
      if (prevRaw && prevRaw !== nextRaw) state.sectionUndo[key] = prevRaw;
      localStorage.setItem(key, nextRaw);
    } catch (e) {}
  }
  function clearLocalDraftForCurrentSection() {
    try { localStorage.removeItem(currentDraftKey()); } catch (e) {}
  }
  function maybeRestoreDraftForCurrentSection() {
    var key = currentDraftKey();
    if (state.sectionDraftCache[key]) return;
    state.sectionDraftCache[key] = true;
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.data) return;
      if (!window.confirm('A local unsaved draft exists for this section/language. Restore it now?')) return;
      applySectionDraftObject(state.section, parsed.data);
      markDirty(true, 'Local draft restored');
      pushActivitySummary('Draft restored', [state.section + ' · ' + state.lang.toUpperCase()]);
    } catch (e) {}
  }
  function discardCurrentSectionChanges() {
    if (!window.confirm('Discard all local unsaved changes in this section and reload saved content?')) return;
    clearLocalDraftForCurrentSection();
    refreshCurrentSection();
    markDirty(false, 'Section changes discarded');
    pushActivitySummary('Section discarded', [state.section + ' reloaded from saved content']);
  }
  function undoLastSectionEdit() {
    var key = currentDraftKey();
    var prevRaw = state.sectionUndo[key];
    if (!prevRaw) {
      alert('No local undo step available for this section.');
      return;
    }
    try {
      localStorage.setItem(key, prevRaw);
      var parsed = JSON.parse(prevRaw);
      applySectionDraftObject(state.section, parsed && parsed.data);
      markDirty(true, 'Undo applied');
      pushActivitySummary('Undo', [state.section + ' local draft step reverted']);
    } catch (e) {}
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
      'rg_rep_cards','rg_vid','rg_perfs','rg_past_perfs','rg_press','rg_press_meta','rg_epk_bios','rg_epk_photos','rg_epk_cvs','rg_public_pdfs','rg_photos','rg_photo_captions',
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
    if (document.body) {
      if (document.body.dataset.adm2EventsWired === '1') return;
      document.body.dataset.adm2EventsWired = '1';
    }
    $('import-preview').value = [
      'Import preview',
      '',
      '1. Optionally narrow "Import scope" in the top bar.',
      '2. Choose a JSON file with top bar "Import JSON".',
      '3. This panel fills with what will change; you confirm before anything is saved.',
      '',
      'Tip: run System / Tools → Create backup now first.'
    ].join('\n');

    $('menuBtn').addEventListener('click', function () { $('sidebar').classList.toggle('open'); });
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () { openSection(btn.getAttribute('data-section')); });
    });
    $('langSelect').addEventListener('change', function () {
      if (!hasUnsavedChangesPrompt('Switch language?')) {
        $('langSelect').value = state.lang;
        return;
      }
      state.lang = $('langSelect').value;
      if (typeof state.api.setLang === 'function') state.api.setLang(state.lang, { persist: false });
      updateLangBadge();
      refreshCurrentSection();
      markDirty(false, 'Language: ' + state.lang.toUpperCase());
    });

    $('saveHeroBtn').addEventListener('click', saveHome);
    if ($('copyHomeFromEnBtn')) $('copyHomeFromEnBtn').addEventListener('click', copyHomeFromEn);
    if ($('copyHomeMissingFromEnBtn')) $('copyHomeMissingFromEnBtn').addEventListener('click', copyHomeMissingFromEn);
    if ($('compareHomeWithEnBtn')) $('compareHomeWithEnBtn').addEventListener('click', compareHomeWithEn);
    if ($('markHomeNeedsTranslationBtn')) $('markHomeNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('home', 'needs_translation'); });
    if ($('markHomeReviewedBtn')) $('markHomeReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('home', 'reviewed'); });
    $('saveBioBtn').addEventListener('click', saveBio);
    if ($('copyBioFromEnBtn')) $('copyBioFromEnBtn').addEventListener('click', copyBioFromEn);
    if ($('copyBioMissingFromEnBtn')) $('copyBioMissingFromEnBtn').addEventListener('click', copyBioMissingFromEn);
    if ($('compareBioWithEnBtn')) $('compareBioWithEnBtn').addEventListener('click', compareBioWithEn);
    if ($('markBioNeedsTranslationBtn')) $('markBioNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('bio', 'needs_translation'); });
    if ($('markBioReviewedBtn')) $('markBioReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('bio', 'reviewed'); });
    $('saveRepHeaderBtn').addEventListener('click', saveRepHeader);
    $('saveRepCardsBtn').addEventListener('click', saveRepCards);
    $('programs-save').addEventListener('click', savePrograms);
    if ($('copyProgramsFromEnBtn')) $('copyProgramsFromEnBtn').addEventListener('click', function () { copyProgramsFromEn(false); });
    if ($('copyProgramsMissingFromEnBtn')) $('copyProgramsMissingFromEnBtn').addEventListener('click', function () { copyProgramsFromEn(true); });
    if ($('compareProgramsWithEnBtn')) $('compareProgramsWithEnBtn').addEventListener('click', compareProgramsWithEn);
    if ($('markProgramsNeedsTranslationBtn')) $('markProgramsNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('programs', 'needs_translation'); });
    if ($('markProgramsReviewedBtn')) $('markProgramsReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('programs', 'reviewed'); });
    if ($('programs-workflow-filter')) $('programs-workflow-filter').addEventListener('change', function () {
      state.programsWorkflowFilter = $('programs-workflow-filter').value;
      renderProgramsList();
    });
    if ($('programs-select-listed')) $('programs-select-listed').addEventListener('click', function () {
      clearSelected(state.programsSelected);
      programsListedIndices().forEach(function (i) { state.programsSelected[i] = true; });
      renderProgramsList();
    });
    if ($('programs-clear-selection')) $('programs-clear-selection').addEventListener('click', function () {
      clearSelected(state.programsSelected);
      renderProgramsList();
      setSelectionCount('programs-selection-count', state.programsSelected);
    });
    if ($('programs-apply-editorial-bulk')) $('programs-apply-editorial-bulk').addEventListener('click', applyProgramsBulkEditorial);
    if ($('programs-review-publish-btn')) $('programs-review-publish-btn').addEventListener('click', programReviewAndPublishCurrent);
    if ($('programs-add-template')) $('programs-add-template').addEventListener('click', addProgramFromTemplate);
    if ($('programs-duplicate-to-lang')) $('programs-duplicate-to-lang').addEventListener('click', duplicateCurrentProgramToLanguage);
    $('savePerfHeaderBtn').addEventListener('click', savePerfHeader);
    $('savePerfEventsBtn').addEventListener('click', savePerfEvents);
    if ($('perf-tx-copy-all-btn')) $('perf-tx-copy-all-btn').addEventListener('click', function () {
      var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
      var targets = LANGS.filter(function (L) { return L !== sourceLang; });
      runPerfCopyCurrentToTargets(targets);
    });
    if ($('perf-tx-copy-selected-btn')) $('perf-tx-copy-selected-btn').addEventListener('click', function () {
      var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
      runPerfCopyCurrentToTargets(getPerfTxSelectedTargets(sourceLang));
    });
    if ($('perf-tx-copy-base-to-current-btn')) $('perf-tx-copy-base-to-current-btn').addEventListener('click', copyPerfBaseToCurrentLang);
    if ($('perf-tx-autotranslate-btn')) $('perf-tx-autotranslate-btn').addEventListener('click', autoTranslatePerfFromCurrentLang);
    if ($('pastperfs-import-btn')) $('pastperfs-import-btn').addEventListener('click', importPastPerfsJson);
    if ($('pastperfs-clear-btn')) $('pastperfs-clear-btn').addEventListener('click', clearPastPerfsDataset);
    if ($('pastperfs-save-all-btn')) $('pastperfs-save-all-btn').addEventListener('click', function () {
      var list = state.pastPerfs.map(function (_, idx) { return collectPastPerfItemFromUi(idx); });
      state.pastPerfs = normalizePastPerfImportArray(list);
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'All past events saved.';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-select-all-btn')) $('pastperfs-select-all-btn').addEventListener('click', function () {
      clearSelected(state.pastPerfsSelected);
      state.pastPerfs.forEach(function (_, idx) { state.pastPerfsSelected[idx] = true; });
      renderPastPerfsEditorList();
    });
    if ($('pastperfs-clear-selection-btn')) $('pastperfs-clear-selection-btn').addEventListener('click', function () {
      clearSelected(state.pastPerfsSelected);
      renderPastPerfsEditorList();
    });
    if ($('pastperfs-clear-times-btn')) $('pastperfs-clear-times-btn').addEventListener('click', function () {
      var ids = selectedPastPerfIndices();
      if (!ids.length) return alert('Select at least one item.');
      ids.forEach(function (i) { if (state.pastPerfs[i]) state.pastPerfs[i].time = ''; });
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Cleared times for ' + ids.length + ' item(s).';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-mark-private-btn')) $('pastperfs-mark-private-btn').addEventListener('click', function () {
      var ids = selectedPastPerfIndices();
      if (!ids.length) return alert('Select at least one item.');
      ids.forEach(function (i) { if (state.pastPerfs[i]) state.pastPerfs[i].private = true; });
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Marked private: ' + ids.length + ' item(s).';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-delete-selected-btn')) $('pastperfs-delete-selected-btn').addEventListener('click', function () {
      var ids = selectedPastPerfIndices();
      if (!ids.length) return alert('Select at least one item.');
      if (!window.confirm('Delete ' + ids.length + ' selected item(s)?')) return;
      state.pastPerfs = state.pastPerfs.filter(function (_, idx) { return ids.indexOf(idx) < 0; });
      clearSelected(state.pastPerfsSelected);
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Deleted ' + ids.length + ' selected item(s).';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-editor-list')) $('pastperfs-editor-list').addEventListener('click', function (evt) {
      var btn = evt.target && evt.target.closest ? evt.target.closest('[data-past-action]') : null;
      if (!btn) return;
      var idx = Number(btn.getAttribute('data-past-idx'));
      if (!Number.isFinite(idx) || idx < 0 || idx >= state.pastPerfs.length) return;
      var action = safeString(btn.getAttribute('data-past-action'));
      if (action === 'save') {
        savePastPerfItemAt(idx);
      } else if (action === 'delete') {
        if (!window.confirm('Delete this item?')) return;
        state.pastPerfs.splice(idx, 1);
        clearSelected(state.pastPerfsSelected);
        if (savePastPerfsToStorage()) {
          if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Item deleted.';
          renderPastPerfsEditorList();
        }
      } else if (action === 'up') {
        if (idx <= 0) return;
        var t = state.pastPerfs[idx - 1];
        state.pastPerfs[idx - 1] = state.pastPerfs[idx];
        state.pastPerfs[idx] = t;
        clearSelected(state.pastPerfsSelected);
        renderPastPerfsEditorList();
      } else if (action === 'down') {
        if (idx >= state.pastPerfs.length - 1) return;
        var t2 = state.pastPerfs[idx + 1];
        state.pastPerfs[idx + 1] = state.pastPerfs[idx];
        state.pastPerfs[idx] = t2;
        clearSelected(state.pastPerfsSelected);
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-editor-list')) $('pastperfs-editor-list').addEventListener('change', function (evt) {
      var cb = evt.target && evt.target.closest ? evt.target.closest('[data-past-select]') : null;
      if (!cb) return;
      var idx = Number(cb.getAttribute('data-past-select'));
      if (!Number.isFinite(idx)) return;
      toggleSelected(state.pastPerfsSelected, idx, !!cb.checked);
    });
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
    if ($('copyContactFromEnBtn')) $('copyContactFromEnBtn').addEventListener('click', function () { copyContactFromEn(false); });
    if ($('copyContactMissingFromEnBtn')) $('copyContactMissingFromEnBtn').addEventListener('click', function () { copyContactFromEn(true); });
    if ($('compareContactWithEnBtn')) $('compareContactWithEnBtn').addEventListener('click', compareContactWithEn);
    if ($('markContactNeedsTranslationBtn')) $('markContactNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('contact', 'needs_translation'); });
    if ($('markContactReviewedBtn')) $('markContactReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('contact', 'reviewed'); });
    $('reloadUiBtn').addEventListener('click', loadUiJson);
    $('saveUiBtn').addEventListener('click', saveUiJson);
    $('saveUiNavBtn').addEventListener('click', saveUiNav);
    if ($('copyUiNavFromEnBtn')) $('copyUiNavFromEnBtn').addEventListener('click', function () { copyUiNavFromEn(false); });
    if ($('copyUiNavMissingFromEnBtn')) $('copyUiNavMissingFromEnBtn').addEventListener('click', function () { copyUiNavFromEn(true); });
    if ($('compareUiWithEnBtn')) $('compareUiWithEnBtn').addEventListener('click', compareUiWithEn);
    if ($('markUiNeedsTranslationBtn')) $('markUiNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('ui', 'needs_translation'); });
    if ($('markUiReviewedBtn')) $('markUiReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('ui', 'reviewed'); });
    if ($('markHomeTranslatedBtn')) $('markHomeTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('home', 'translated'); });
    if ($('markBioTranslatedBtn')) $('markBioTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('bio', 'translated'); });
    if ($('markProgramsTranslatedBtn')) $('markProgramsTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('programs', 'translated'); });
    if ($('markContactTranslatedBtn')) $('markContactTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('contact', 'translated'); });
    if ($('markUiTranslatedBtn')) $('markUiTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('ui', 'translated'); });
    if ($('markPressBiosTranslatedBtn')) $('markPressBiosTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('press_bios', 'translated'); });
    if ($('translationRefreshBtn')) $('translationRefreshBtn').addEventListener('click', refreshTranslationWorkspace);
    if ($('translationRunQaBtn')) $('translationRunQaBtn').addEventListener('click', function () { runTranslationConsistencyQa(false); });
    if ($('translationBatchMissingBtn')) $('translationBatchMissingBtn').addEventListener('click', batchCopyMissingFromEnForCurrentLang);
    if ($('translationMissingOnlyToggle')) {
      $('translationMissingOnlyToggle').addEventListener('click', function () {
        state.translationMissingOnly = !state.translationMissingOnly;
        $('translationMissingOnlyToggle').classList.toggle('active', state.translationMissingOnly);
        if (state.section === 'translation') refreshTranslationWorkspace();
        else applyTranslationMissingOnlyMask();
      });
    }
    wireTranslationWorkspaceActions();
    if ($('section-publishing')) {
      $('section-publishing').addEventListener('click', function (evt) {
        var j = evt.target && evt.target.closest ? evt.target.closest('[data-pub-jump]') : null;
        if (!j || !$('section-publishing').contains(j)) return;
        evt.preventDefault();
        var raw = safeString(j.getAttribute('data-pub-jump'));
        var parts = raw.split(':');
        publishingJumpTo(parts[0], parts[1] || 'all');
      });
    }
    if ($('publishing-refresh')) {
      $('publishing-refresh').addEventListener('click', function () {
        refreshPublishingDashboard();
        touchCloseoutStep('publishing');
      });
    }

    $('rep-cat-filter').addEventListener('change', renderRepList);
    if ($('rep-status-filter')) $('rep-status-filter').addEventListener('change', function () { state.repStatusFilter = $('rep-status-filter').value; renderRepList(); });
    if ($('rep-search')) $('rep-search').addEventListener('input', function () { state.repSearch = $('rep-search').value; renderRepList(); });
    if ($('rep-reset-filters')) $('rep-reset-filters').addEventListener('click', function () {
      $('rep-cat-filter').value = 'all';
      if ($('rep-status-filter')) $('rep-status-filter').value = 'all';
      if ($('rep-search')) $('rep-search').value = '';
      if ($('rep-workflow-filter')) $('rep-workflow-filter').value = 'all';
      state.repStatusFilter = 'all';
      state.repSearch = '';
      state.repWorkflowFilter = 'all';
      renderRepList();
    });
    if ($('rep-select-visible')) $('rep-select-visible').addEventListener('click', function () { selectVisibleInto(state.repSelected, 'rep-list'); renderRepList(); });
    if ($('rep-clear-selection')) $('rep-clear-selection').addEventListener('click', function () { clearSelected(state.repSelected); renderRepList(); });
    if ($('rep-apply-bulk')) $('rep-apply-bulk').addEventListener('click', applyRepBulk);
    if ($('rep-workflow-filter')) $('rep-workflow-filter').addEventListener('change', function () {
      state.repWorkflowFilter = $('rep-workflow-filter').value;
      renderRepList();
    });
    if ($('rep-apply-editorial-bulk')) $('rep-apply-editorial-bulk').addEventListener('click', applyRepEditorialBulk);
    if ($('media-vid-search')) $('media-vid-search').addEventListener('input', function () { state.mediaVidSearch = $('media-vid-search').value; renderMediaVideosList(); });
    if ($('media-vid-filter')) $('media-vid-filter').addEventListener('change', function () { state.mediaVidFilter = $('media-vid-filter').value; renderMediaVideosList(); });
    if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').addEventListener('change', function () {
      state.mediaVidWorkflowFilter = $('media-vid-workflow-filter').value;
      renderMediaVideosList();
    });
    if ($('media-vid-reset-filters')) $('media-vid-reset-filters').addEventListener('click', function () {
      if ($('media-vid-search')) $('media-vid-search').value = '';
      if ($('media-vid-filter')) $('media-vid-filter').value = 'all';
      if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').value = 'all';
      state.mediaVidSearch = '';
      state.mediaVidFilter = 'all';
      state.mediaVidWorkflowFilter = 'all';
      renderMediaVideosList();
    });
    if ($('media-vid-select-visible')) $('media-vid-select-visible').addEventListener('click', function () { selectVisibleInto(state.mediaVidSelected, 'media-vid-list'); renderMediaVideosList(); });
    if ($('media-vid-clear-selection')) $('media-vid-clear-selection').addEventListener('click', function () { clearSelected(state.mediaVidSelected); renderMediaVideosList(); });
    if ($('media-vid-apply-bulk')) $('media-vid-apply-bulk').addEventListener('click', applyMediaVidBulk);
    if ($('media-photo-search')) $('media-photo-search').addEventListener('input', function () { state.mediaPhotoSearch = $('media-photo-search').value; renderMediaPhotosList(); });
    if ($('press-search')) $('press-search').addEventListener('input', function () { state.pressSearch = $('press-search').value; renderPressList(); });
    if ($('press-visible-filter')) $('press-visible-filter').addEventListener('change', function () { state.pressVisibleFilter = $('press-visible-filter').value; renderPressList(); });
    if ($('press-reset-filters')) $('press-reset-filters').addEventListener('click', function () {
      if ($('press-search')) $('press-search').value = '';
      if ($('press-visible-filter')) $('press-visible-filter').value = 'all';
      if ($('press-workflow-filter')) $('press-workflow-filter').value = 'all';
      state.pressSearch = '';
      state.pressVisibleFilter = 'all';
      state.pressWorkflowFilter = 'all';
      renderPressList();
    });
    if ($('press-select-visible')) $('press-select-visible').addEventListener('click', function () { selectVisibleInto(state.pressSelected, 'press-list'); renderPressList(); });
    if ($('press-clear-selection')) $('press-clear-selection').addEventListener('click', function () { clearSelected(state.pressSelected); renderPressList(); });
    if ($('press-apply-bulk')) $('press-apply-bulk').addEventListener('click', applyPressBulk);
    if ($('press-workflow-filter')) $('press-workflow-filter').addEventListener('change', function () {
      state.pressWorkflowFilter = $('press-workflow-filter').value;
      renderPressList();
    });
    if ($('press-apply-editorial-bulk')) $('press-apply-editorial-bulk').addEventListener('click', applyPressEditorialBulk);
    if ($('press-hide-outdated-btn')) $('press-hide-outdated-btn').addEventListener('click', pressHideCurrentQuote);
    if ($('perf-status-filter')) $('perf-status-filter').addEventListener('change', function () { state.perfStatusFilter = $('perf-status-filter').value; renderPerfList(); });
    if ($('perf-workflow-filter')) $('perf-workflow-filter').addEventListener('change', function () {
      state.perfWorkflowFilter = $('perf-workflow-filter').value;
      renderPerfList();
    });
    if ($('perf-reset-filters')) $('perf-reset-filters').addEventListener('click', function () {
      if ($('perf-status-filter')) $('perf-status-filter').value = 'all';
      if ($('perf-workflow-filter')) $('perf-workflow-filter').value = 'all';
      state.perfStatusFilter = 'all';
      state.perfWorkflowFilter = 'all';
      renderPerfList();
    });
    if ($('perf-select-visible')) $('perf-select-visible').addEventListener('click', function () { selectVisibleInto(state.perfSelected, 'perf-list'); renderPerfList(); });
    if ($('perf-clear-selection')) $('perf-clear-selection').addEventListener('click', function () { clearSelected(state.perfSelected); renderPerfList(); });
    if ($('perf-apply-bulk')) $('perf-apply-bulk').addEventListener('click', applyPerfBulk);
    if ($('perf-apply-editorial-bulk')) $('perf-apply-editorial-bulk').addEventListener('click', applyPerfEditorialBulk);
    if ($('perf-archive-current-btn')) $('perf-archive-current-btn').addEventListener('click', perfArchiveCurrentEvent);
    if ($('copyPressBiosMissingFromEnBtn')) $('copyPressBiosMissingFromEnBtn').addEventListener('click', copyPressBiosMissingFromEn);
    if ($('comparePressBiosWithEnBtn')) $('comparePressBiosWithEnBtn').addEventListener('click', comparePressBiosWithEn);
    if ($('markPressBiosNeedsTranslationBtn')) $('markPressBiosNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('press_bios', 'needs_translation'); });
    if ($('markPressBiosReviewedBtn')) $('markPressBiosReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('press_bios', 'reviewed'); });
    if ($('perf-add-template')) $('perf-add-template').addEventListener('click', addEventFromTemplate);
    if ($('press-add-template')) $('press-add-template').addEventListener('click', addQuoteFromTemplate);
    if ($('epk-photo-search')) $('epk-photo-search').addEventListener('input', function () { state.epkPhotoSearch = $('epk-photo-search').value; renderEpkPhotoList(); });
    $('rep-add').addEventListener('click', function () {
      clearSelected(state.repSelected);
      state.repCards.push({ composer: '', opera: '', role: '', cat: 'opera', lang: 'IT', editorialStatus: 'draft' });
      state.repIndex = state.repCards.length - 1;
      renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-dup').addEventListener('click', function () {
      if (state.repIndex < 0) return;
      clearSelected(state.repSelected);
      state.repCards.splice(state.repIndex + 1, 0, clone(state.repCards[state.repIndex]));
      state.repIndex += 1; renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-del').addEventListener('click', function () {
      if (state.repIndex < 0) return;
      if (!window.confirm('Delete the selected repertoire item?')) return;
      clearSelected(state.repSelected);
      state.repCards.splice(state.repIndex, 1);
      state.repIndex = Math.max(0, state.repIndex - 1); renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-up').addEventListener('click', function () {
      var i = state.repIndex; if (i <= 0) return;
      clearSelected(state.repSelected);
      var t = state.repCards[i - 1]; state.repCards[i - 1] = state.repCards[i]; state.repCards[i] = t;
      state.repIndex = i - 1; renderRepList(); markDirty(true);
    });
    $('rep-down').addEventListener('click', function () {
      var i = state.repIndex; if (i < 0 || i >= state.repCards.length - 1) return;
      clearSelected(state.repSelected);
      var t = state.repCards[i + 1]; state.repCards[i + 1] = state.repCards[i]; state.repCards[i] = t;
      state.repIndex = i + 1; renderRepList(); markDirty(true);
    });
    if ($('rep-prev-item')) $('rep-prev-item').addEventListener('click', function () { goPrevNext('rep', -1); });
    if ($('rep-next-item')) $('rep-next-item').addEventListener('click', function () { goPrevNext('rep', 1); });
    if ($('rep-move-apply')) $('rep-move-apply').addEventListener('click', function () { applyMoveToPosition('rep', 'rep-move-pos'); });
    if ($('rep-revert-item')) $('rep-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('rep'); });

    $('programs-add').addEventListener('click', function () {
      var arr = state.programsDoc.programs;
      var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
      arr.push({ id: maxId + 1, order: arr.length, published: true, editorialStatus: 'draft', title: '', description: '', formations: [], duration: '', idealFor: [] });
      state.programsIndex = arr.length - 1;
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program added');
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
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program duplicated');
    });
    $('programs-del').addEventListener('click', function () {
      if (state.programsIndex < 0) return;
      if (!window.confirm('Delete the selected program?')) return;
      state.programsDoc.programs.splice(state.programsIndex, 1);
      state.programsIndex = Math.max(0, state.programsIndex - 1);
      normalizeProgramOrders();
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program deleted');
    });
    $('programs-up').addEventListener('click', function () {
      var i = state.programsIndex; if (i <= 0) return;
      var arr = state.programsDoc.programs;
      var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
      state.programsIndex = i - 1;
      normalizeProgramOrders();
      renderProgramsList(); markDirty(true, 'Program order updated');
    });
    $('programs-down').addEventListener('click', function () {
      var i = state.programsIndex;
      var arr = state.programsDoc.programs;
      if (i < 0 || i >= arr.length - 1) return;
      var t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
      state.programsIndex = i + 1;
      normalizeProgramOrders();
      renderProgramsList(); markDirty(true, 'Program order updated');
    });
    if ($('programs-prev-item')) $('programs-prev-item').addEventListener('click', function () { goPrevNext('programs', -1); });
    if ($('programs-next-item')) $('programs-next-item').addEventListener('click', function () { goPrevNext('programs', 1); });
    if ($('programs-move-apply')) $('programs-move-apply').addEventListener('click', function () { applyMoveToPosition('programs', 'programs-move-pos'); });
    if ($('programs-revert-item')) $('programs-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('programs'); });

    $('perf-add').addEventListener('click', function () {
      clearSelected(state.perfSelected);
      state.perfs.push({ title: '', detail: '', day: '', month: '', time: '', venue: '', city: '', status: 'upcoming', type: 'concert', editorialStatus: 'draft', sortDate: '' });
      state.perfIndex = state.perfs.length - 1; renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-dup').addEventListener('click', function () {
      if (state.perfIndex < 0) return;
      clearSelected(state.perfSelected);
      state.perfs.splice(state.perfIndex + 1, 0, clone(state.perfs[state.perfIndex]));
      state.perfIndex += 1; renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-del').addEventListener('click', function () {
      if (state.perfIndex < 0) return;
      if (!window.confirm('Delete the selected calendar event?')) return;
      clearSelected(state.perfSelected);
      state.perfs.splice(state.perfIndex, 1);
      state.perfIndex = Math.max(0, state.perfIndex - 1); renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-up').addEventListener('click', function () {
      var i = state.perfIndex; if (i <= 0) return;
      clearSelected(state.perfSelected);
      var t = state.perfs[i - 1]; state.perfs[i - 1] = state.perfs[i]; state.perfs[i] = t;
      state.perfIndex = i - 1; renderPerfList(); markDirty(true);
    });
    $('perf-down').addEventListener('click', function () {
      var i = state.perfIndex; if (i < 0 || i >= state.perfs.length - 1) return;
      clearSelected(state.perfSelected);
      var t = state.perfs[i + 1]; state.perfs[i + 1] = state.perfs[i]; state.perfs[i] = t;
      state.perfIndex = i + 1; renderPerfList(); markDirty(true);
    });
    if ($('perf-prev-item')) $('perf-prev-item').addEventListener('click', function () { goPrevNext('perf', -1); });
    if ($('perf-next-item')) $('perf-next-item').addEventListener('click', function () { goPrevNext('perf', 1); });
    if ($('perf-move-apply')) $('perf-move-apply').addEventListener('click', function () { applyMoveToPosition('perf', 'perf-move-pos'); });
    if ($('perf-revert-item')) $('perf-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('perf'); });

    $('press-add').addEventListener('click', function () {
      clearSelected(state.pressSelected);
      state.press.push({ id: Date.now(), source: '', quote: '', production: '', url: '', visible: true, editorialStatus: 'draft', order: state.press.length });
      state.pressIndex = state.press.length - 1; renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-dup').addEventListener('click', function () {
      if (state.pressIndex < 0) return;
      clearSelected(state.pressSelected);
      var n = clone(state.press[state.pressIndex]); n.id = Date.now();
      state.press.splice(state.pressIndex + 1, 0, n); state.pressIndex += 1; renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-del').addEventListener('click', function () {
      if (state.pressIndex < 0) return;
      if (!window.confirm('Delete the selected press quote?')) return;
      clearSelected(state.pressSelected);
      state.press.splice(state.pressIndex, 1); state.pressIndex = Math.max(0, state.pressIndex - 1); renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-up').addEventListener('click', function () {
      var i = state.pressIndex; if (i <= 0) return;
      clearSelected(state.pressSelected);
      var t = state.press[i - 1]; state.press[i - 1] = state.press[i]; state.press[i] = t;
      state.pressIndex = i - 1; renderPressList(); markDirty(true);
    });
    $('press-down').addEventListener('click', function () {
      var i = state.pressIndex; if (i < 0 || i >= state.press.length - 1) return;
      clearSelected(state.pressSelected);
      var t = state.press[i + 1]; state.press[i + 1] = state.press[i]; state.press[i] = t;
      state.pressIndex = i + 1; renderPressList(); markDirty(true);
    });
    if ($('press-prev-item')) $('press-prev-item').addEventListener('click', function () { goPrevNext('press', -1); });
    if ($('press-next-item')) $('press-next-item').addEventListener('click', function () { goPrevNext('press', 1); });
    if ($('press-move-apply')) $('press-move-apply').addEventListener('click', function () { applyMoveToPosition('press', 'press-move-pos'); });
    if ($('press-revert-item')) $('press-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('press'); });
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
      if (!window.confirm('Delete the selected EPK photo?')) return;
      state.epkPhotos.splice(state.epkPhotoIndex, 1);
      state.epkPhotoIndex = Math.max(0, state.epkPhotoIndex - 1);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo borrada');
    });
    $('epk-photo-up').addEventListener('click', function () {
      var i = state.epkPhotoIndex; if (i <= 0) return;
      var t = state.epkPhotos[i - 1]; state.epkPhotos[i - 1] = state.epkPhotos[i]; state.epkPhotos[i] = t;
      state.epkPhotoIndex = i - 1;
      renderEpkPhotoList(); markDirty(true, 'EPK photo order updated');
    });
    $('epk-photo-down').addEventListener('click', function () {
      var i = state.epkPhotoIndex; if (i < 0 || i >= state.epkPhotos.length - 1) return;
      var t = state.epkPhotos[i + 1]; state.epkPhotos[i + 1] = state.epkPhotos[i]; state.epkPhotos[i] = t;
      state.epkPhotoIndex = i + 1;
      renderEpkPhotoList(); markDirty(true, 'EPK photo order updated');
    });
    if ($('epk-photo-prev-item')) $('epk-photo-prev-item').addEventListener('click', function () { goPrevNext('epk-photo', -1); });
    if ($('epk-photo-next-item')) $('epk-photo-next-item').addEventListener('click', function () { goPrevNext('epk-photo', 1); });
    if ($('epk-photo-move-apply')) $('epk-photo-move-apply').addEventListener('click', function () { applyMoveToPosition('epk-photo', 'epk-photo-move-pos'); });
    if ($('epk-photo-revert-item')) $('epk-photo-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('epk-photo'); });

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
      clearSelected(state.mediaVidSelected);
      state.vidData.videos.push({ id: '', tag: '', title: '', sub: '', composer: '', repertoireCat: '', hidden: false, group: 'opera_lied', featured: false, editorialStatus: 'draft', customThumb: '' });
      state.vidIndex = state.vidData.videos.length - 1;
      renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video creado');
    });
    $('media-vid-dup').addEventListener('click', function () {
      if (state.vidIndex < 0) return;
      clearSelected(state.mediaVidSelected);
      state.vidData.videos.splice(state.vidIndex + 1, 0, clone(state.vidData.videos[state.vidIndex]));
      state.vidIndex += 1; renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video duplicado');
    });
    $('media-vid-del').addEventListener('click', function () {
      if (state.vidIndex < 0) return;
      if (!window.confirm('Delete the selected video?')) return;
      clearSelected(state.mediaVidSelected);
      state.vidData.videos.splice(state.vidIndex, 1);
      state.vidIndex = Math.max(0, state.vidIndex - 1); renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video borrado');
    });
    $('media-vid-up').addEventListener('click', function () {
      var i = state.vidIndex; if (i <= 0) return;
      clearSelected(state.mediaVidSelected);
      var t = state.vidData.videos[i - 1]; state.vidData.videos[i - 1] = state.vidData.videos[i]; state.vidData.videos[i] = t;
      state.vidIndex = i - 1; renderMediaVideosList(); markDirty(true, 'Video order updated');
    });
    $('media-vid-down').addEventListener('click', function () {
      var i = state.vidIndex; if (i < 0 || i >= state.vidData.videos.length - 1) return;
      clearSelected(state.mediaVidSelected);
      var t = state.vidData.videos[i + 1]; state.vidData.videos[i + 1] = state.vidData.videos[i]; state.vidData.videos[i] = t;
      state.vidIndex = i + 1; renderMediaVideosList(); markDirty(true, 'Video order updated');
    });
    if ($('media-vid-prev-item')) $('media-vid-prev-item').addEventListener('click', function () { goPrevNext('media-vid', -1); });
    if ($('media-vid-next-item')) $('media-vid-next-item').addEventListener('click', function () { goPrevNext('media-vid', 1); });
    if ($('media-vid-move-apply')) $('media-vid-move-apply').addEventListener('click', function () { applyMoveToPosition('media-vid', 'media-vid-move-pos'); });
    if ($('media-vid-revert-item')) $('media-vid-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('media-vid'); });

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
      if (!window.confirm('Delete the selected photo?')) return;
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
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Photo order updated');
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
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Photo order updated');
    });

    bindInputsDirty(['rep-composer','rep-opera','rep-role','rep-cat','rep-status','rep-lang','rep-category','rep-editorialStatus'], persistRepEditor);
    bindInputsDirty(['programs-item-title','programs-item-description','programs-item-formations','programs-item-duration','programs-item-idealFor','programs-item-published','programs-item-editorialStatus'], persistProgramsEditor);
    bindInputsDirty(['perf-title','perf-detail','perf-day','perf-month','perf-dateDisplay','perf-time','perf-venue','perf-city','perf-venuePhoto','perf-venueOpacity','perf-status','perf-type','perf-sortDate','perf-editorialStatus','perf-modal-title','perf-modal-type','perf-modal-venue','perf-modal-city','perf-modal-longdesc','perf-modal-link','perf-modal-link-label','perf-modal-ticketPrice','perf-modal-image','perf-modal-image-hide','perf-modal-enabled','perf-modal-flyerImg'], persistPerfEditor);
    bindInputsDirty(['press-source','press-quote','press-production','press-url','press-visible','press-editorialStatus'], persistPressEditor);
    bindInputsDirty(['pdf-dossier-EN','pdf-artist-EN','pdf-dossier-DE','pdf-artist-DE','pdf-dossier-ES','pdf-artist-ES','pdf-dossier-IT','pdf-artist-IT','pdf-dossier-FR','pdf-artist-FR'], function () {
      persistPressPdfsFromUi();
      updatePdfValidation();
      updateCompletenessIndicators();
      markDirty(true, 'Public PDFs editados');
    });
    bindInputsDirty(['epk-bio-b50','epk-bio-b150','epk-bio-b300p1','epk-bio-b300p2','epk-bio-b300p3','epk-bio-b300p4'], function () { persistEpkBiosFromUi(); markDirty(true, 'EPK bios editadas'); });
    bindInputsDirty(['epk-photo-url','epk-photo-label','epk-photo-credit'], persistEpkPhotoEditor);
    bindInputsDirty(['media-vid-id','media-vid-title','media-vid-sub','media-vid-tag','media-vid-composer','media-vid-group','media-vid-repertoireCat','media-vid-customThumb','media-vid-featured','media-vid-hidden','media-vid-editorialStatus'], persistMediaVideoEditor);
    bindInputsDirty(['media-vid-h2']);
    bindInputsDirty(['media-photo-url','media-photo-caption','media-photo-photographer'], persistMediaPhotoEditor);

    bindInputsDirty(['hero-eyebrow','hero-subtitle','hero-cta1','hero-cta2','hero-quickBioLabel','hero-quickCalLabel','hero-introCtaBio','hero-introCtaMedia','hero-bgImage','hero-introImage'], function () {
      updateHomeIntroPreview();
      updateHomeMiniPreviews();
      updateCompletenessIndicators();
      markDirty(true);
    });
    bindInputsDirty(['bio-h2','bio-p1','bio-p2','bio-quote','bio-cite','bio-portraitImage'], function () {
      updateBioPortraitPreview();
      updateBioMiniPreview();
      updateCompletenessIndicators();
      markDirty(true);
    });
    bindInputsDirty(['programs-item-title','programs-item-description','programs-item-duration'], updateProgramsMiniPreview);
    bindInputsDirty(['press-source','press-quote'], updatePressMiniPreview);
    bindInputsDirty(['contact-title','contact-sub','contact-emailBtn','contact-webBtn'], updateContactMiniPreview);
    bindInputsDirty(['rep-h2','rep-intro','programs-title','programs-subtitle','programs-intro','programs-closingNote','programs-repLink','programs-epkLink','perf-h2','perf-intro','press-translatedNote','press-reviewsIntro','press-showReviewsSection','contact-title','contact-sub','contact-email','contact-emailBtn','contact-webBtn','contact-webUrl','ui-json','ui-nav-home','ui-nav-bio','ui-nav-rep','ui-nav-media','ui-nav-cal','ui-nav-epk','ui-nav-book'], function () {
      updateContactValidation();
      updateContactMiniPreview();
      updateCompletenessIndicators();
      markDirty(true);
    });

    $('exportBtn').addEventListener('click', function () {
      var payload = buildExportPayload();
      downloadJson('rg_admin_export_v2.json', payload);
      setStatus('Export finished', 'ok');
      pushActivitySummary('Exported JSON', [payload.keys.length + ' areas · same kind of bundle as a backup.', 'Check your downloads folder.']);
    });
    if ($('createBackupBtn')) $('createBackupBtn').addEventListener('click', function () {
      createBackupNow();
      touchCloseoutStep('backup');
    });
    if ($('runHealthChecksBtn')) $('runHealthChecksBtn').addEventListener('click', function () {
      renderSiteHealth();
      touchCloseoutStep('health');
      pushActivitySummary('Site health check', ['Dashboard checks refreshed.']);
    });
    $('openPublicBtn').addEventListener('click', function () {
      touchCloseoutStep('spotcheck');
      window.open('index.html', '_blank', 'noopener');
    });
    if ($('copyPublicUrlBtn')) $('copyPublicUrlBtn').addEventListener('click', copyCurrentPublicUrl);
    if ($('undoSectionBtn')) $('undoSectionBtn').addEventListener('click', undoLastSectionEdit);
    if ($('discardSectionBtn')) $('discardSectionBtn').addEventListener('click', discardCurrentSectionChanges);
    if ($('focusModeBtn')) $('focusModeBtn').addEventListener('click', toggleFocusMode);
    $('openLegacyBtn').addEventListener('click', function () { window.open('admin.html', '_blank', 'noopener'); });
    $('openPressPdfsToolBtn').addEventListener('click', function () {
      touchCloseoutStep('pdfs');
      openSection('press');
      togglePressTab('pdfs');
    });
    $('openPressBiosToolBtn').addEventListener('click', function () {
      openSection('press');
      togglePressTab('bios');
    });
    $('restoreCurrentBtn').addEventListener('click', function () {
      if (typeof state.api.restoreDefaults !== 'function') return alert('Restore is not available in this session.');
      var map = { home: 'hero', bio: 'bio', rep: 'repertoire', programs: 'programs', calendar: 'calendar', media: 'videos', press: 'press', contact: 'contact', ui: 'site-ui' };
      var labels = { home: 'Home / Hero', bio: 'Biography', rep: 'Repertoire', programs: 'Programs', calendar: 'Calendar', media: 'Media', press: 'Press / EPK', contact: 'Contact', ui: 'UI / Translations' };
      var s = map[state.section];
      if (!s) return;
      if (!confirm('Reset this section to built-in defaults?\nThis can overwrite saved content for the section.')) return;
      state.api.restoreDefaults(s);
      refreshCurrentSection();
      markDirty(false, 'Defaults restored');
      pushActivitySummary('Defaults restored', [labels[state.section] || state.section, 'Built-in defaults were reapplied for this section.']);
    });

    $('importInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var payload = JSON.parse(String(r.result || '{}'));
          var data = payload.data || {};
          if (!isObject(data)) throw new Error('The file needs a "data" object with content keys.');
          var scope = getImportScopeValue();
          var keysAll = Object.keys(data).filter(function (k) { return SAFE_IMPORT_KEY_RE.test(k); });
          var keys = filterImportKeys(keysAll, scope);
          var previewLines = [
            'File: ' + safeString(f.name),
            'Import scope: ' + getImportScopeLabel(),
            'Compatible in file: ' + keysAll.length,
            'Will import now: ' + keys.length,
            '',
            'Areas to update:',
            keys.slice(0, 40).map(function (k) { return '• ' + humanStorageKeyLine(k); }).join('\n') + (keys.length > 40 ? '\n• … and ' + (keys.length - 40) + ' more' : '')
          ];
          $('import-preview').value = previewLines.join('\n');
          if (!keysAll.length) throw new Error('No compatible content found in this file.');
          if (!keys.length) {
            throw new Error('Nothing matches the current import scope. Widen scope to "All compatible content" or pick a different file.');
          }
          var warn = [
            'Import will overwrite matching content in the admin.',
            '',
            'Strongly recommended: create a backup first (System / Tools → Create backup now).',
            '',
            'Scope: ' + getImportScopeLabel(),
            'Number of areas to write: ' + keys.length,
            '',
            'Proceed with import?'
          ].join('\n');
          if (!window.confirm(warn)) {
            setStatus('Import cancelled', 'warn');
            pushActivitySummary('Import cancelled', ['No changes were saved.']);
            return;
          }
          keys.forEach(function (k) {
            validateKeyValue(k, data[k]);
            state.api.save(k, clone(data[k]));
          });
          refreshCurrentSection();
          markDirty(false, 'Import saved');
          setStatus('Import complete', 'ok');
          pushActivitySummary('Import finished', [
            keys.length + ' area(s) updated.',
            'Scope was: ' + getImportScopeLabel() + '.',
            'Reload sections if something looks stale.'
          ]);
        } catch (err) {
          setStatus('Import failed: ' + err.message, 'err');
          alert('Import failed: ' + err.message);
          pushActivitySummary('Import failed', [safeString(err.message)]);
        } finally {
          e.target.value = '';
        }
      };
      r.readAsText(f);
    });
    if ($('sitehealth-issues')) {
      $('sitehealth-issues').addEventListener('click', function (evt) {
        var btn = evt.target && evt.target.closest ? evt.target.closest('[data-health-action="1"]') : null;
        if (!btn) return;
        applyHealthActionFromButton(btn);
      });
    }

    wireCloseoutChecklist();

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
      var safari = isSafariBrowser();
      setAuthDebug({
        browserClass: safari ? 'safari' : 'non-safari',
        authMode: 'legacy-gateway',
        redirectProcessed: getRedirectPending() ? 'pending' : 'n/a',
        persistenceSet: 'no',
        persistenceType: 'pending',
        redirectPending: getRedirectPending() ? 'yes' : 'no',
        authState: 'pending',
        currentUserPresent: 'no',
        failure: ''
      });
      setAuthGate(false, null, 'Checking authentication status…');
      await initAuth();
      await handleRedirectResult();
      if ($('adm2SignInBtn')) $('adm2SignInBtn').addEventListener('click', signInGoogle);
      if ($('adm2SignOutBtn')) $('adm2SignOutBtn').addEventListener('click', signOut);
      if ($('adm2TopSignOutBtn')) $('adm2TopSignOutBtn').addEventListener('click', signOut);
      await awaitAuthorizedUser();
      setStatus('Connecting to data bridge…', 'warn');
      state.api = await waitForLegacyApi();
      var lang = (state.api.currentLang && LANGS.indexOf(state.api.currentLang) >= 0) ? state.api.currentLang : 'en';
      state.lang = lang;
      $('langSelect').value = lang;
      updateLangBadge();
      state.ready = true;
      state.bridgeReadyAt = Date.now();
      setStatus('Ready · ' + lang.toUpperCase(), 'ok');
      setupEvents();
      refreshCurrentSection();
    } catch (e) {
      setStatus('Could not start admin', 'err');
      setAuthError('Admin could not finish starting: ' + e.message, e);
    }
  }

  init();
})();
