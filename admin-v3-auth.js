'use strict';
/**
 * Admin v3 - Isolated Auth Module
 *
 * Purpose: Provide Firebase auth for admin-v3 without depending on admin-v2's
 * UI state machine or gate logic. Reuses Firebase project and auth session where safe.
 *
 * Strategy:
 * - Check if admin-v2's Firebase app exists, reuse if available
 * - Otherwise, initialize own Firebase app instance with same config
 * - Implement own allowlist check (same email list as admin-v2)
 * - Provide explicit small methods only
 * - No UI gate logic, no state machine
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

var ADMIN_V3_AUTH_CONFIG = {
  firebaseConfig: {
    apiKey: "AIzaSyCW9fCKrUcmFxc91KmgXhQF4kRYCiZH9Y0",
    authDomain: "auth.rolandoguy.com",
    projectId: "rolandoguy-57d63",
    storageBucket: "rolandoguy-57d63.firebasestorage.app",
    messagingSenderId: "276077748266",
    appId: "1:276077748266:web:f38a687ab3b526f0262353"
  },
  adminAllowlist: ['rolandoguy@gmail.com']
};

var AUTH_REDIRECT_ORIGIN_KEY = 'adm2_redirect_origin';
var AUTH_REDIRECT_HOST_KEY = 'adm2_redirect_host';
var AUTH_REDIRECT_HREF_KEY = 'adm2_redirect_href';

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────

var firebaseApp = null;
var firebaseAuth = null;
var initialized = false;
var authStateResolved = false;
var authObserverUnsubscribe = null;
var authStatePromise = null;
var authStateResolve = null;
var authStateTimer = null;
var authObserverFired = false;
var authObserverLatestUser = null;
var AUTH_SETTLE_MS = 1200;

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODULE
// ─────────────────────────────────────────────────────────────────────────────

function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function getWindowLocation() {
  if (typeof window === 'undefined' || !window.location) {
    return { origin: '', host: '', href: '', hostname: '' };
  }
  return {
    origin: safeString(window.location.origin),
    host: safeString(window.location.host),
    href: safeString(window.location.href),
    hostname: safeString(window.location.hostname)
  };
}

function isLocalDevHost(hostname) {
  var host = safeString(hostname).toLowerCase();
  if (!host) return false;
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^10\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  return /\.local$/.test(host);
}

function getRedirectTelemetry() {
  try {
    return {
      origin: safeString(localStorage.getItem(AUTH_REDIRECT_ORIGIN_KEY)),
      host: safeString(localStorage.getItem(AUTH_REDIRECT_HOST_KEY)),
      href: safeString(localStorage.getItem(AUTH_REDIRECT_HREF_KEY))
    };
  } catch (e) {
    return { origin: '', host: '', href: '' };
  }
}

function setBestAuthPersistence() {
  if (!firebaseAuth || !firebase.auth || !firebase.auth.Auth || !firebase.auth.Auth.Persistence) {
    return Promise.resolve(false);
  }
  var P = firebase.auth.Auth.Persistence;
  var location = getWindowLocation();
  var candidates = isLocalDevHost(location.hostname)
    ? [P.LOCAL, P.SESSION, P.NONE]
    : [P.LOCAL, P.SESSION, P.NONE];
  var i = 0;
  function next() {
    if (i >= candidates.length) return Promise.resolve(false);
    var candidate = candidates[i++];
    return firebaseAuth.setPersistence(candidate).then(function () {
      return true;
    }).catch(function () {
      return next();
    });
  }
  return next();
}

function buildAuthDiagnostics(user) {
  var location = getWindowLocation();
  var redirectTelemetry = getRedirectTelemetry();
  return {
    origin: location.origin,
    host: location.host,
    href: location.href,
    hostname: location.hostname,
    isLocalDevHost: isLocalDevHost(location.hostname),
    firebaseCurrentUserPresent: !!user,
    redirectOrigin: redirectTelemetry.origin,
    redirectHost: redirectTelemetry.host,
    redirectHref: redirectTelemetry.href,
    originMismatch: !!(redirectTelemetry.origin && location.origin && redirectTelemetry.origin !== location.origin),
    hostMismatch: !!(redirectTelemetry.host && location.host && redirectTelemetry.host !== location.host)
  };
}

function renderAccessDeniedHtml(result) {
  var diagnostics = result && result.diagnostics ? result.diagnostics : buildAuthDiagnostics(null);
  var reason = safeString(result && result.reason).trim();
  var body = '<p>Access denied.</p>';

  if (reason === 'No user session') {
    if (diagnostics.originMismatch || diagnostics.hostMismatch) {
      body += '<p>No Firebase admin session is available on this origin.</p>' +
        '<p>You may already be signed in on a different local/dev host. Current origin: <code>' + diagnostics.origin + '</code>.</p>' +
        '<p>Last admin-v2 auth started from: <code>' + (diagnostics.redirectOrigin || diagnostics.redirectHost || 'unknown') + '</code>.</p>';
    } else {
      body += '<p>No authenticated Firebase admin session was restored for this origin.</p>';
    }
  } else if (reason === 'Not in admin allowlist') {
    body += '<p>You are signed in, but this account is not in the admin allowlist.</p>';
  } else if (reason === 'Auth not initialized') {
    body += '<p>Admin-v3 could not initialize Firebase auth on this page.</p>';
  } else {
    body += '<p>' + reason + '</p>';
  }

  if (diagnostics.isLocalDevHost) {
    body += '<p>Local/dev note: Firebase auth is origin-scoped. <code>localhost</code>, <code>127.0.0.1</code>, and <code>192.168.*</code> do not share the same persisted session.</p>';
  }

  body += '<p>If needed, open <a href="admin-v2.html" target="_blank">Admin v2</a> on this exact origin, confirm you are signed in there, then return and retry.</p>' +
    '<p><button id="retryAuthBtn">Retry</button></p>';
  return body;
}

function init() {
  if (initialized) {
    return ensureAuthResolved().then(function () { return true; });
  }

  // Try to reuse admin-v2's Firebase app if available
  if (typeof window !== 'undefined' && window.firebase && window.firebase.apps && window.firebase.apps.length > 0) {
    try {
      firebaseApp = window.firebase.app();
      firebaseAuth = firebaseApp.auth();
      initialized = true;
      return setBestAuthPersistence().then(function () {
        return ensureAuthResolved();
      }).then(function () { return true; });
    } catch (e) {
      console.warn('[admin-v3-auth] Failed to reuse admin-v2 Firebase app:', e);
    }
  }

  // Otherwise, initialize own Firebase app
  if (typeof firebase === 'undefined') {
    console.error('[admin-v3-auth] Firebase SDK not loaded');
    return Promise.resolve(false);
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebaseApp = firebase.initializeApp(ADMIN_V3_AUTH_CONFIG.firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    firebaseAuth = firebaseApp.auth();
    initialized = true;
    return setBestAuthPersistence().then(function () {
      return ensureAuthResolved();
    }).then(function () { return true; });
  } catch (e) {
    console.error('[admin-v3-auth] Firebase init failed:', e);
    return Promise.resolve(false);
  }
}

function ensureAuthResolved() {
  if (authStateResolved) {
    return Promise.resolve(true);
  }

  if (authStatePromise) {
    return authStatePromise;
  }

  authStatePromise = new Promise(function (resolve) {
    authStateResolve = resolve;

    if (!firebaseAuth) {
      console.error('[admin-v3-auth] Firebase auth not initialized');
      authStateResolved = true;
      resolve(false);
      return;
    }

    function finish(result) {
      if (authStateResolved) return;
      authStateResolved = true;
      if (authStateTimer) {
        clearTimeout(authStateTimer);
        authStateTimer = null;
      }
      resolve(result);
    }

    authStateTimer = setTimeout(function () {
      finish(true);
    }, AUTH_SETTLE_MS);

    var unsubscribe = firebaseAuth.onAuthStateChanged(function (user) {
      authObserverUnsubscribe = unsubscribe;
      authObserverFired = true;
      authObserverLatestUser = user || null;
      if (user) {
        finish(true);
      }
    }, function (error) {
      console.error('[admin-v3-auth] Auth observer error:', error);
      finish(false);
    });
  });

  return authStatePromise.then(function () {
    if (firebaseAuth && firebaseAuth.currentUser) return true;
    if (authObserverLatestUser) return true;
    return true;
  });
}

function getCurrentUser() {
  if (!initialized || !firebaseAuth) return null;
  return firebaseAuth.currentUser;
}

function checkAuth() {
  return ensureAuthResolved().then(function (resolved) {
    if (!resolved || !initialized || !firebaseAuth) {
      return { authenticated: false, reason: 'Auth not initialized', diagnostics: buildAuthDiagnostics(null) };
    }

    var user = firebaseAuth.currentUser || authObserverLatestUser || null;
    var diagnostics = buildAuthDiagnostics(user);
    if (!user) {
      return { authenticated: false, reason: 'No user session', diagnostics: diagnostics };
    }

    if (!user.email) {
      return { authenticated: false, reason: 'User has no email', diagnostics: diagnostics };
    }

    var email = user.email.toLowerCase();
    var allowed = ADMIN_V3_AUTH_CONFIG.adminAllowlist.map(function (e) { return e.toLowerCase(); }).indexOf(email) >= 0;

    if (!allowed) {
      return { authenticated: false, reason: 'Not in admin allowlist', user: user, diagnostics: diagnostics };
    }

    return { authenticated: true, user: user, diagnostics: diagnostics };
  });
}

function getIdToken() {
  return ensureAuthResolved().then(function (resolved) {
    if (!resolved || !initialized || !firebaseAuth || !firebaseAuth.currentUser) {
      return '';
    }

    return firebaseAuth.currentUser.getIdToken(true).catch(function () {
      return '';
    });
  });
}

function signOut() {
  if (!initialized || !firebaseAuth) {
    return Promise.resolve(false);
  }

  return firebaseAuth.signOut().then(function () {
    return true;
  }).catch(function (e) {
    console.error('[admin-v3-auth] Sign out failed:', e);
    return false;
  });
}

function cleanup() {
  if (authObserverUnsubscribe && typeof authObserverUnsubscribe === 'function') {
    authObserverUnsubscribe();
    authObserverUnsubscribe = null;
  }
  if (authStateTimer) {
    clearTimeout(authStateTimer);
    authStateTimer = null;
  }
  authStateResolved = false;
  authStatePromise = null;
  authStateResolve = null;
  authObserverFired = false;
  authObserverLatestUser = null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.adminV3Auth = {
    init: init,
    getCurrentUser: getCurrentUser,
    checkAuth: checkAuth,
    getIdToken: getIdToken,
    signOut: signOut,
    ensureAuthResolved: ensureAuthResolved,
    cleanup: cleanup,
    renderAccessDeniedHtml: renderAccessDeniedHtml,
    config: ADMIN_V3_AUTH_CONFIG
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init: init,
    getCurrentUser: getCurrentUser,
    checkAuth: checkAuth,
    getIdToken: getIdToken,
    signOut: signOut,
    ensureAuthResolved: ensureAuthResolved,
    cleanup: cleanup,
    renderAccessDeniedHtml: renderAccessDeniedHtml,
    config: ADMIN_V3_AUTH_CONFIG
  };
}
