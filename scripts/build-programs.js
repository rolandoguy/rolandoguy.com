'use strict';
/**
 * Writes v1-assets/data/programs-data.json for mp/repertoire.html (mp-programs.js).
 *
 * Sources (admin export JSON):
 *   - data.rg_programs_en or legacy data.rg_programs — required EN source
 *   - data.rg_programs_de / _es / _it / _fr — optional localized program docs
 *   - data.rg_editorial_<lang> / data.rg_editorial_en — optional repProgramsLink override
 *
 * Usage:
 *   node scripts/build-programs.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'programs-data.json');
var localesPath = path.join(root, 'v1-assets', 'data', 'mp-locales.json');
var filter = require('./lib/public-field-filter');
var exportLoader = require('./lib/load-admin-export');

var LANGS = ['en', 'de', 'es', 'it', 'fr'];

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-programs: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function safeString(v) {
  return v == null ? '' : String(v);
}

function isObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function splitList(v) {
  if (Array.isArray(v)) return v.map(function (item) { return safeString(item).trim(); }).filter(Boolean);
  if (typeof v === 'string') return v.split('\n').map(function (item) { return item.trim(); }).filter(Boolean);
  return [];
}

function normalizeProgramsDoc(raw) {
  var doc = isObject(raw) ? clone(raw) : {};
  var items = Array.isArray(doc.programs) ? doc.programs : [];
  return {
    title: safeString(doc.title),
    subtitle: safeString(doc.subtitle),
    profileBridge: safeString(doc.profileBridge),
    intro: safeString(doc.intro),
    closingNote: safeString(doc.closingNote),
    linkLabel: safeString(doc.linkLabel),
    items: items.filter(isObject).map(function (item, index) {
      return filter.filterProgramsItem({
        id: item.id != null ? Number(item.id) || index + 1 : index + 1,
        order: item.order != null ? Number(item.order) || index : index,
        published: item.published !== false,
        title: safeString(item.title),
        description: safeString(item.description),
        formations: splitList(item.formations),
        duration: safeString(item.duration),
        idealFor: splitList(item.idealFor)
      });
    })
  };
}

function getProgramsDoc(data, lang) {
  var key = 'rg_programs_' + lang;
  var byLang = data[key];
  if (isObject(byLang) && Array.isArray(byLang.programs)) return normalizeProgramsDoc(byLang);
  if (lang === 'en') {
    var legacy = data.rg_programs;
    if (isObject(legacy) && Array.isArray(legacy.programs)) return normalizeProgramsDoc(legacy);
  }
  return null;
}

function getEditorialLinkLabel(data, lang, localeFallback) {
  var byLang = data['rg_editorial_' + lang];
  if (isObject(byLang) && safeString(byLang.repProgramsLink).trim()) return safeString(byLang.repProgramsLink).trim();
  var en = data.rg_editorial_en;
  if (isObject(en) && safeString(en.repProgramsLink).trim()) return safeString(en.repProgramsLink).trim();
  return safeString(localeFallback).trim();
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-programs.js <rg_admin_export.json>');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = exportLoader.loadAdminExportSource(absExport, 'build-programs');
var data = payload && payload.source ? payload.source : null;
if (!data || typeof data !== 'object') {
  console.error('build-programs: export missing usable source payload');
  process.exit(1);
}

var localeBundle = readJson(localesPath);
var localeTable = localeBundle && localeBundle.locales ? localeBundle.locales : {};
var enDoc = getProgramsDoc(data, 'en');
if (!enDoc || !enDoc.items.length) {
  console.error('build-programs: missing usable EN programs source (need rg_programs_en or rg_programs)');
  process.exit(1);
}

var locales = {};
LANGS.forEach(function (lang) {
  var doc = getProgramsDoc(data, lang) || clone(enDoc);
  var localeStrings = isObject(localeTable[lang]) ? localeTable[lang] : {};
  var enLocaleStrings = isObject(localeTable.en) ? localeTable.en : {};
  var fallbackLink = localeStrings['rep.programsExplore'] || enLocaleStrings['rep.programsExplore'] || '';
  doc.linkLabel = getEditorialLinkLabel(data, lang, doc.linkLabel || fallbackLink);
  locales[lang] = filter.filterProgramsChrome(doc);
  locales[lang].items = doc.items;
});

var output = { locales: locales };

try {
  filter.validatePublicPayload(output, 'programs-data.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile);
