'use strict';
/**
 * Writes v1-assets/data/epk-bios.json from an admin Export JSON (admExportJSON).
 *
 * Usage:
 *   node scripts/build-epk-bios.js path/to/rg_admin_export_YYYY-MM-DD.json
 *
 * Requires payload.data.rg_epk_bios (Firestore shape: per-lang objects with
 * b50, b150, b300p1..b300p4). Missing fields become "" after normalize.
 */
var fs = require('fs');
var path = require('path');

var LANGS = ['en', 'de', 'es', 'it', 'fr'];
var FIELDS = ['b50', 'b150', 'b300p1', 'b300p2', 'b300p3', 'b300p4'];

function normalizeEpkBios(raw) {
  var out = {};
  LANGS.forEach(function (lang) {
    var src = raw && typeof raw === 'object' ? raw[lang] : null;
    var o = {};
    FIELDS.forEach(function (f) {
      o[f] = src && typeof src[f] === 'string' ? src[f] : '';
    });
    out[lang] = o;
  });
  return out;
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-epk-bios.js <rg_admin_export.json>');
  console.error('  Reads data.rg_epk_bios and writes v1-assets/data/epk-bios.json');
  process.exit(1);
}

var root = path.join(__dirname, '..');
var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var outFile = path.join(root, 'v1-assets', 'data', 'epk-bios.json');

var payload = JSON.parse(fs.readFileSync(absExport, 'utf8'));
var bios = payload.data && payload.data.rg_epk_bios;
if (!bios || typeof bios !== 'object') {
  console.error('build-epk-bios: missing or invalid data.rg_epk_bios in export');
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(normalizeEpkBios(bios), null, 2) + '\n', 'utf8');
console.log('Wrote', outFile);
