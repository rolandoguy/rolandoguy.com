'use strict';
/**
 * Writes v1-assets/data/mp-locales.json (shape expected by mp-shell.js).
 *
 * Merge order per language (later layers overwrite empty strings only where noted):
 *   1) v1-assets/build/ui-bundle-defaults.json — Ti-aligned chrome (nav.rep, footer, …)
 *   2) v1-assets/build/mp-module-locale-defaults.json — Repertoire/calendar/media/press/contact UI strings (all langs)
 *   3) v1-assets/build/mp-home-locale-defaults.json — Home hero + intro + explore (EN baseline)
 *   4) v1-assets/build/mp-locale-overrides.json locales[lang] — partial DE/ES/IT/FR + MP tweaks
 *   5) data['rg_ui_<lang>'] from optional admin export
 *   6) data['hero_<lang>'] + data['bio_<lang>'].h2 from export — live hero copy + intro headline
 *
 * EN: after merge, fails if required Home/Hero keys are empty (see EN_REQUIRED_HOME).
 *
 * Usage:
 *   node scripts/build-mp-locales.js [rg_admin_export.json]
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'mp-locales.json');
var defaultsPath = path.join(root, 'v1-assets', 'build', 'ui-bundle-defaults.json');
var moduleDefaultsPath = path.join(root, 'v1-assets', 'build', 'mp-module-locale-defaults.json');
var homeDefaultsPath = path.join(root, 'v1-assets', 'build', 'mp-home-locale-defaults.json');
var overridesPath = path.join(root, 'v1-assets', 'build', 'mp-locale-overrides.json');

var LANGS = ['en', 'de', 'es', 'it', 'fr'];

var EN_REQUIRED_HOME = [
  'hero.scroll',
  'hero.scrollAria',
  'hero.eyebrow',
  'hero.subtitle',
  'hero.cta1',
  'hero.cta2',
  'hero.nameHtml',
  'home.intro.photoAlt',
  'home.intro.h2',
  'home.intro.p1',
  'home.intro.p2',
  'home.intro.ctaBio',
  'home.intro.ctaMedia',
  'home.explore.tag',
  'home.explore.sub',
  'home.explore.btnBookings'
];

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-mp-locales: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function nonEmptyStr(v) {
  return v != null && String(v).trim() !== '';
}

function stripAdminNote(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  var out = {};
  for (var k in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
    if (k === 'adminNote') continue;
    out[k] = obj[k];
  }
  return out;
}

/** Copy non-empty string values from `from` into `into`. */
function mergeStrings(into, from) {
  if (!from || typeof from !== 'object') return;
  for (var k in from) {
    if (!Object.prototype.hasOwnProperty.call(from, k)) continue;
    if (nonEmptyStr(from[k])) into[k] = String(from[k]);
  }
}

function applyHeroBioFromExport(into, lang, exportData) {
  if (!exportData || typeof exportData !== 'object') return;
  var hk = 'hero_' + lang;
  var h = exportData[hk];
  if (h && typeof h === 'object' && !Array.isArray(h)) {
    h = stripAdminNote(h);
    if (nonEmptyStr(h.eyebrow)) into['hero.eyebrow'] = String(h.eyebrow).trim();
    if (nonEmptyStr(h.subtitle)) into['hero.subtitle'] = String(h.subtitle).trim();
    if (nonEmptyStr(h.cta1)) into['hero.cta1'] = String(h.cta1).trim();
    if (nonEmptyStr(h.cta2)) into['hero.cta2'] = String(h.cta2).trim();
  }
  var bk = 'bio_' + lang;
  var b = exportData[bk];
  if (b && typeof b === 'object' && !Array.isArray(b)) {
    b = stripAdminNote(b);
    if (nonEmptyStr(b.h2)) into['home.intro.h2'] = String(b.h2).trim();
  }
}

var uiDefaults = readJson(defaultsPath);
var moduleDefaults = fs.existsSync(moduleDefaultsPath) ? readJson(moduleDefaultsPath) : {};
var homeDefaults = readJson(homeDefaultsPath);
var overrides = readJson(overridesPath);

var exportPath = process.argv[2];
var exportData = null;
if (exportPath) {
  var abs = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
  var payload = readJson(abs);
  exportData = payload && payload.data ? payload.data : null;
  if (!exportData) {
    console.error('build-mp-locales: export missing top-level data object');
    process.exit(1);
  }
}

var locales = {};
LANGS.forEach(function (lang) {
  var loc = {};
  var base = (uiDefaults && uiDefaults[lang]) || {};
  var homeBase = (homeDefaults && homeDefaults[lang]) || {};
  var modBase = (moduleDefaults && moduleDefaults[lang]) || {};
  var mpO =
    overrides.locales && overrides.locales[lang] ? overrides.locales[lang] : null;
  var rgKey = 'rg_ui_' + lang;
  var rgUi = exportData && exportData[rgKey] ? exportData[rgKey] : null;

  mergeStrings(loc, base);
  mergeStrings(loc, modBase);
  mergeStrings(loc, homeBase);
  mergeStrings(loc, mpO);
  mergeStrings(loc, rgUi);
  applyHeroBioFromExport(loc, lang, exportData);

  locales[lang] = loc;
});

var enLoc = locales.en || {};
for (var i = 0; i < EN_REQUIRED_HOME.length; i++) {
  var key = EN_REQUIRED_HOME[i];
  if (!nonEmptyStr(enLoc[key])) {
    console.error('build-mp-locales: EN locale missing required key:', key);
    process.exit(1);
  }
}

var output = {
  locales: locales
};

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile);
