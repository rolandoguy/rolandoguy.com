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

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODULE
// ─────────────────────────────────────────────────────────────────────────────

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
      return ensureAuthResolved().then(function () { return true; });
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
    return ensureAuthResolved().then(function () { return true; });
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

    // Set up auth observer
    var unsubscribe = firebaseAuth.onAuthStateChanged(function (user) {
      authStateResolved = true;
      authObserverUnsubscribe = unsubscribe;
      resolve(true);
    }, function (error) {
      console.error('[admin-v3-auth] Auth observer error:', error);
      authStateResolved = true;
      resolve(false);
    });
  });

  return authStatePromise;
}

function getCurrentUser() {
  if (!initialized || !firebaseAuth) return null;
  return firebaseAuth.currentUser;
}

function checkAuth() {
  return ensureAuthResolved().then(function (resolved) {
    if (!resolved || !initialized || !firebaseAuth) {
      return { authenticated: false, reason: 'Auth not initialized' };
    }

    var user = firebaseAuth.currentUser;
    if (!user) {
      return { authenticated: false, reason: 'No user session' };
    }

    if (!user.email) {
      return { authenticated: false, reason: 'User has no email' };
    }

    // Check allowlist
    var email = user.email.toLowerCase();
    var allowed = ADMIN_V3_AUTH_CONFIG.adminAllowlist.map(function (e) { return e.toLowerCase(); }).indexOf(email) >= 0;

    if (!allowed) {
      return { authenticated: false, reason: 'Not in admin allowlist' };
    }

    return { authenticated: true, user: user };
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
  authStateResolved = false;
  authStatePromise = null;
  authStateResolve = null;
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
    config: ADMIN_V3_AUTH_CONFIG
  };
}
