'use strict';
/**
 * Writes v1-assets/data/contact-data.json for mp/contact.html (mp-contact.js).
 *
 * Sources (admin export JSON):
 *   - data.contact_en — required: v1 contact object (title, sub, email, emailBtn; optional quote, webBtn)
 *   - data.formspreeId or data.rg_formspree_id — optional Formspree form id (else defaults)
 *
 * Optional per language: data.contact_de, contact_es, contact_it, contact_fr — merged into output.contactLocales for mp-contact.js (title/sub/emailBtn/quote overlay).
 *
 * Defaults: v1-assets/build/contact-defaults.json (formspreeId + optional webBtn fallback).
 *
 * Usage:
 *   npm run build:contact -- path/to/rg_admin_export.json
 *   node scripts/build-contact.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'contact-data.json');
var contactDefaultsPath = path.join(root, 'v1-assets', 'build', 'contact-defaults.json');
var filter = require('./lib/public-field-filter');
var exportLoader = require('./lib/load-admin-export');

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-contact: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function pickFormspreeId(data, defaults) {
  var raw = data.formspreeId != null ? data.formspreeId : data.rg_formspree_id;
  if (raw != null && String(raw).trim()) return String(raw).trim();
  if (defaults.formspreeId != null && String(defaults.formspreeId).trim()) {
    return String(defaults.formspreeId).trim();
  }
  return '';
}

function looksLikeEmail(s) {
  var t = String(s || '').trim();
  if (t.length < 3) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-contact.js <rg_admin_export.json>');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = exportLoader.loadAdminExportSource(absExport, 'build-contact');
var data = payload && payload.source ? payload.source : null;
if (!data || typeof data !== 'object') {
  console.error('build-contact: export missing usable source payload');
  process.exit(1);
}

var raw = data.contact_en;
if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
  console.error('build-contact: data.contact_en missing or not an object — refusing to write');
  process.exit(1);
}

var src = filter.filterContact(raw);

var title = src.title != null ? String(src.title).trim() : '';
var sub = src.sub != null ? String(src.sub).trim() : '';
var email = src.email != null ? String(src.email).trim() : '';
var emailBtn = src.emailBtn != null ? String(src.emailBtn).trim() : '';
var quote = src.quote != null ? String(src.quote) : '';
var webBtnFromSrc = src.webBtn != null ? String(src.webBtn).trim() : '';

if (!title) {
  console.error('build-contact: contact_en.title is empty');
  process.exit(1);
}
if (!sub) {
  console.error('build-contact: contact_en.sub is empty');
  process.exit(1);
}
if (!looksLikeEmail(email)) {
  console.error('build-contact: contact_en.email is missing or not a valid email');
  process.exit(1);
}
if (!emailBtn) {
  console.error('build-contact: contact_en.emailBtn is empty');
  process.exit(1);
}

var defaults = readJson(contactDefaultsPath);
var dfb = (defaults.contact && typeof defaults.contact === 'object') ? defaults.contact : {};
var webBtn = webBtnFromSrc || (dfb.webBtn != null ? String(dfb.webBtn).trim() : '');
if (!webBtn) {
  console.error('build-contact: webBtn would be empty (set contact_en.webBtn or contact-defaults.json)');
  process.exit(1);
}

var formspreeId = pickFormspreeId(data, defaults);
if (!formspreeId) {
  console.error('build-contact: formspreeId is empty (export or contact-defaults.json)');
  process.exit(1);
}

var output = {
  contact: {
    title: title,
    sub: sub,
    email: email,
    emailBtn: emailBtn,
    webBtn: webBtn,
    quote: quote.trim() ? quote.trim() : ''
  },
  formspreeId: formspreeId
};

var contactLocales = {};
['de', 'es', 'it', 'fr'].forEach(function (lang) {
  var key = 'contact_' + lang;
  var raw = data[key];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
  var sx = filter.filterContactLocale(raw);
  var o = {};
  if (sx.title != null && String(sx.title).trim()) o.title = String(sx.title).trim();
  if (sx.sub != null && String(sx.sub).trim()) o.sub = String(sx.sub).trim();
  if (sx.emailBtn != null && String(sx.emailBtn).trim()) o.emailBtn = String(sx.emailBtn).trim();
  if (sx.quote != null && String(sx.quote).trim()) o.quote = String(sx.quote).trim();
  if (Object.keys(o).length) contactLocales[lang] = o;
});
if (Object.keys(contactLocales).length) output.contactLocales = contactLocales;

// Security validation: ensure no internal fields leaked
try {
  filter.validatePublicPayload(output, 'contact-data.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile);
