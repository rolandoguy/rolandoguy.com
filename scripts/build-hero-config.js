'use strict';
/**
 * Writes v1-assets/data/hero-config.json for mp/ (mp-hero.js background + crop + alt baseline).
 * Public runtime fetch URL (site root): /v1-assets/data/hero-config.json — same path as this file in the deployed tree.
 *
 * Sources (admin export JSON):
 *   - data.hero_en — required when an export path is passed: object with optional bgImage
 *
 * Image paths: admin often uses img/… (site root); mp pages resolve ../img/…
 *
 * Baseline: v1-assets/build/hero-config-defaults.json (image, crop, focal, alt).
 *
 * Usage:
 *   npm run build:hero-config -- path/to/rg_admin_export.json
 *   node scripts/build-hero-config.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');
var filter = require('./lib/public-field-filter');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'hero-config.json');
var defaultsPath = path.join(root, 'v1-assets', 'build', 'hero-config-defaults.json');

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-hero-config: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

/** mp/ pages: repo-root images as ../img/… */
function normalizeHeroImage(u) {
  var s = String(u == null ? '' : u).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s) || s.indexOf('data:') === 0) return s;
  if (s.indexOf('../') === 0) return s;
  if (s.indexOf('img/') === 0) return '../' + s;
  if (s.charAt(0) === '/' && s.indexOf('/img/') === 0) return '..' + s;
  return s;
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-hero-config.js <rg_admin_export.json>');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = readJson(absExport);
var data = payload && payload.data ? payload.data : null;
if (!data || typeof data !== 'object') {
  console.error('build-hero-config: export missing data object');
  process.exit(1);
}

var rawHero = data.hero_en;
if (!rawHero || typeof rawHero !== 'object' || Array.isArray(rawHero)) {
  console.error('build-hero-config: data.hero_en missing or invalid');
  process.exit(1);
}

var defaults = readJson(defaultsPath);
var out = deepClone(defaults);
var MP_HERO_IMAGE = '../img/hero-portrait.webp';

var bg = rawHero.bgImage != null ? String(rawHero.bgImage).trim() : '';
if (bg) {
  out.image = normalizeHeroImage(bg);
}
/* mp requirement: keep hero image pinned to canonical portrait asset. */
out.image = MP_HERO_IMAGE;
if (!String(out.image || '').trim()) {
  console.error('build-hero-config: resolved image URL is empty');
  process.exit(1);
}

// Security validation: ensure no internal fields leaked
try {
  filter.validatePublicPayload(out, 'hero-config.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile);
