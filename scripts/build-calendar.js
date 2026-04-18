'use strict';
/**
 * Writes v1-assets/data/calendar-data.json for mp/calendar.html (mp-calendar.js).
 *
 * Sources (admin export JSON):
 *   - data.rg_perfs — required (array or { perfs|items|value|data: array })
 *   - data.perf_en — optional; overrides / extends bundled EN perf (h2, intro, eventTypes, monthNames, …)
 *
 * Defaults: v1-assets/build/calendar-perf-defaults-en.json — EN perf baseline for MP (aligned with
 * effective live EN calendar chrome, including eventTypes such as operetta).
 *
 * Usage:
 *   node scripts/build-calendar.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'calendar-data.json');
var perfDefaultsPath = path.join(root, 'v1-assets', 'build', 'calendar-perf-defaults-en.json');
var filter = require('./lib/public-field-filter');
var eventSchemas = require('./lib/event-schemas');

var PREFERRED_ARRAY_KEYS = ['perfs', 'items', 'value', 'data'];

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-calendar: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function normalizePerfs(raw) {
  if (Array.isArray(raw)) return raw.map(eventSchemas.sanitizePublicEvent);
  if (raw && typeof raw === 'object') {
    for (var i = 0; i < PREFERRED_ARRAY_KEYS.length; i++) {
      var key = PREFERRED_ARRAY_KEYS[i];
      if (Array.isArray(raw[key])) return raw[key].map(eventSchemas.sanitizePublicEvent);
    }
  }
  return [];
}

function normalizePastPerfs(raw) {
  if (Array.isArray(raw)) return raw.map(eventSchemas.sanitizePublicPastEvent);
  if (raw && typeof raw === 'object') {
    for (var i = 0; i < PREFERRED_ARRAY_KEYS.length; i++) {
      var key = PREFERRED_ARRAY_KEYS[i];
      if (Array.isArray(raw[key])) return raw[key].map(eventSchemas.sanitizePublicPastEvent);
    }
  }
  return [];
}

/**
 * Merge perf_en onto EN defaults (same idea as live getPerfMerged for lang en: base then stored).
 * @param {object} defaults
 * @param {object|null} stored
 */
function mergePerfEn(defaults, stored) {
  var out = eventSchemas.sanitizePublicCalendarChrome(defaults);
  if (!stored || typeof stored !== 'object') return out;
  var safeStored = eventSchemas.sanitizePublicCalendarChrome(stored);

  if (safeStored.h2 != null && String(safeStored.h2).trim() !== '') out.h2 = String(safeStored.h2);
  if (safeStored.intro != null) out.intro = String(safeStored.intro);

  if (safeStored.eventTypes && typeof safeStored.eventTypes === 'object') {
    out.eventTypes = out.eventTypes && typeof out.eventTypes === 'object' ? out.eventTypes : {};
    for (var ek in safeStored.eventTypes) {
      if (Object.prototype.hasOwnProperty.call(safeStored.eventTypes, ek)) {
        out.eventTypes[ek] = safeStored.eventTypes[ek];
      }
    }
  }

  if (safeStored.monthNames && typeof safeStored.monthNames === 'object') {
    out.monthNames = deepClone(safeStored.monthNames);
  }

  return out;
}

function validatePerf(perf) {
  if (!perf || typeof perf !== 'object') return false;
  if (typeof perf.h2 !== 'string' || !String(perf.h2).trim()) return false;
  if (!perf.eventTypes || typeof perf.eventTypes !== 'object') return false;
  return true;
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-calendar.js <rg_admin_export.json>');
  console.error('  Requires data.rg_perfs; optional data.perf_en');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = readJson(absExport);
var data = payload && payload.data ? payload.data : null;
if (!data || typeof data !== 'object') {
  console.error('build-calendar: export missing data object');
  process.exit(1);
}

var perfs = normalizePerfs(data.rg_perfs);
var pastPerfs = normalizePastPerfs(data.rg_past_perfs);
if (!perfs.length) {
  console.error('build-calendar: data.rg_perfs normalized to empty — refusing to write');
  process.exit(1);
}
for (var i = 0; i < perfs.length; i++) {
  var row = perfs[i];
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    console.error('build-calendar: invalid event at index', i);
    process.exit(1);
  }
}

var enDefaults = readJson(perfDefaultsPath);
var perf = mergePerfEn(enDefaults, data.perf_en || null);
if (!validatePerf(perf)) {
  console.error('build-calendar: merged perf invalid (need h2 and eventTypes)');
  process.exit(1);
}

var perfLocales = { en: deepClone(perf) };
['de', 'es', 'it', 'fr'].forEach(function (lang) {
  var key = 'perf_' + lang;
  var st = data[key];
  if (st && typeof st === 'object' && Object.keys(st).length) {
    perfLocales[lang] = mergePerfEn(deepClone(perf), st);
  }
});

var output = {
  perf: perf,
  perfs: perfs
};
if (pastPerfs.length) output.pastPerfs = pastPerfs;
output.perfLocales = perfLocales;

// Security validation: ensure no internal fields leaked
try {
  filter.validatePublicPayload(output, 'calendar-data.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile, '(' + perfs.length + ' events)');
