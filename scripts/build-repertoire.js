'use strict';
/**
 * Writes v1-assets/data/repertoire-data.json for mp/repertoire.html (mp-repertoire.js).
 *
 * Sources (admin export JSON, same envelope as admExportJSON):
 *   - data.rg_rep_cards — required (array or { cards|items|value|data: array })
 *   - data.rep_en — optional Firestore doc; overrides h2/intro vs bundled EN defaults
 *
 * Defaults: v1-assets/build/repertoire-rep-defaults-en.json (LANG_CONTENT.en.rep equivalent).
 *
 * Usage:
 *   node scripts/build-repertoire.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'repertoire-data.json');
var repDefaultsPath = path.join(root, 'v1-assets', 'build', 'repertoire-rep-defaults-en.json');

var PREFERRED_ARRAY_KEYS = ['cards', 'items', 'value', 'data'];

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-repertoire: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function stripAdminNote(card) {
  if (!card || typeof card !== 'object' || Array.isArray(card)) return card;
  var o = {};
  for (var k in card) {
    if (!Object.prototype.hasOwnProperty.call(card, k)) continue;
    if (k === 'adminNote') continue;
    o[k] = card[k];
  }
  return o;
}

function normalizeCards(raw) {
  if (Array.isArray(raw)) return raw.map(stripAdminNote);
  if (raw && typeof raw === 'object') {
    for (var i = 0; i < PREFERRED_ARRAY_KEYS.length; i++) {
      var key = PREFERRED_ARRAY_KEYS[i];
      if (Array.isArray(raw[key])) return raw[key].map(stripAdminNote);
    }
  }
  return [];
}

function mergeRepEn(defaults, repEn) {
  var rep = {
    h2: defaults.h2 != null ? String(defaults.h2) : '',
    intro: defaults.intro != null ? String(defaults.intro) : ''
  };
  if (!repEn || typeof repEn !== 'object') return rep;
  if (repEn.h2 != null && String(repEn.h2).trim() !== '') rep.h2 = String(repEn.h2);
  if (repEn.intro != null) rep.intro = String(repEn.intro);
  return rep;
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-repertoire.js <rg_admin_export.json>');
  console.error('  Requires data.rg_rep_cards; optional data.rep_en');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = readJson(absExport);
var data = payload && payload.data ? payload.data : null;
if (!data || typeof data !== 'object') {
  console.error('build-repertoire: export missing data object');
  process.exit(1);
}

var cards = normalizeCards(data.rg_rep_cards);
if (!cards.length) {
  console.error('build-repertoire: data.rg_rep_cards normalized to empty array — refusing to write');
  process.exit(1);
}

var enDefaults = readJson(repDefaultsPath);
var rep = mergeRepEn(enDefaults, data.rep_en || null);

function mergeRepOverlay(base, overlay) {
  var out = {
    h2: base.h2 != null ? String(base.h2) : '',
    intro: base.intro != null ? String(base.intro) : ''
  };
  if (!overlay || typeof overlay !== 'object') return out;
  if (overlay.h2 != null && String(overlay.h2).trim() !== '') out.h2 = String(overlay.h2);
  if (overlay.intro != null) out.intro = String(overlay.intro);
  return out;
}

var repLocales = {};
['de', 'es', 'it', 'fr'].forEach(function (lang) {
  var key = 'rep_' + lang;
  var st = data[key];
  if (st && typeof st === 'object' && Object.keys(st).length) {
    repLocales[lang] = mergeRepOverlay(rep, st);
  }
});

var output = {
  rep: rep,
  cards: cards
};
if (Object.keys(repLocales).length) output.repLocales = repLocales;

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile, '(' + cards.length + ' cards)');
