'use strict';
/**
 * Writes v1-assets/data/press-data.json for mp/press.html (mp-press.js).
 *
 * Sources (admin export JSON):
 *   - data.rg_press — required (non-empty array after normalize; at least one visible item)
 *   - data.rg_press_meta — optional; merges translatedNote per lang onto defaults
 *   - data.rg_ui_en … data.rg_ui_fr — optional; first non-empty reviewsIntro wins
 *   - data.rg_epk_photos — optional; EPK photo cards (array)
 *   - data.rg_public_pdfs — optional; dossier / artistSheet slots (EN…FR)
 *
 * Defaults: v1-assets/build/press-defaults.json (reviewsIntro + pressMeta baseline).
 *
 * Usage:
 *   npm run build:press -- path/to/rg_admin_export.json
 *   node scripts/build-press.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'press-data.json');
var pressDefaultsPath = path.join(root, 'v1-assets', 'build', 'press-defaults.json');
var filter = require('./lib/public-field-filter');
var exportLoader = require('./lib/load-admin-export');

var LANGS = ['en', 'de', 'es', 'it', 'fr'];
var PDF_LANGS = ['EN', 'DE', 'ES', 'IT', 'FR'];

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-press: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function normalizePress(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(filter.filterPressItem);
}

function validPressItem(p) {
  if (!p || typeof p !== 'object') return false;
  return !!(String(p.source || '').trim() && String(p.quote || '').trim());
}

function visiblePressCount(list) {
  var n = 0;
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (p && p.visible !== false) n++;
  }
  return n;
}

function pickReviewsIntro(data) {
  for (var i = 0; i < LANGS.length; i++) {
    var key = 'rg_ui_' + LANGS[i];
    var ui = data[key];
    if (ui && typeof ui === 'object' && ui.reviewsIntro != null) {
      var s = String(ui.reviewsIntro).trim();
      if (s) return s;
    }
  }
  return '';
}

/** Per-language intro lines for mp/press: export rg_ui_<lang>.reviewsIntro overrides defaults.reviewsIntroByLang. */
function buildReviewsIntroByLang(data, defaultsMap) {
  var out = {};
  LANGS.forEach(function (lang) {
    var fromExport = '';
    var ui = data['rg_ui_' + lang];
    if (ui && typeof ui === 'object' && ui.reviewsIntro != null) {
      fromExport = String(ui.reviewsIntro).trim();
    }
    var fromDefault =
      defaultsMap && typeof defaultsMap === 'object' && defaultsMap[lang]
        ? String(defaultsMap[lang]).trim()
        : '';
    var fb = defaultsMap && defaultsMap.en ? String(defaultsMap.en).trim() : '';
    out[lang] = fromExport || fromDefault || fb || '';
  });
  return out;
}

function mergePressMeta(base, raw) {
  var out = deepClone(base);
  if (!raw || typeof raw !== 'object') return out;
  LANGS.forEach(function (l) {
    if (raw[l] && typeof raw[l] === 'object' && raw[l].translatedNote != null) {
      if (!out[l]) out[l] = {};
      out[l].translatedNote = String(raw[l].translatedNote);
    }
  });
  return out;
}

function publicPdfsTemplate() {
  var z = {};
  PDF_LANGS.forEach(function (L) {
    z[L] = { url: '' };
  });
  return { dossier: deepClone(z), artistSheet: deepClone(z) };
}

function mergePublicPdfs(base, raw) {
  var out = deepClone(base);
  if (!raw || typeof raw !== 'object') return out;
  ['dossier', 'artistSheet'].forEach(function (kind) {
    var src = raw[kind];
    if (!src || typeof src !== 'object') return;
    PDF_LANGS.forEach(function (L) {
      var v = src[L];
      if (typeof v === 'string') {
        if (/^data:application\/pdf/i.test(v.trim())) out[kind][L].data = v.trim();
        else out[kind][L].url = v.trim();
        return;
      }
      if (v && typeof v === 'object') {
        if (typeof v.url === 'string') out[kind][L].url = v.url.trim();
        if (typeof v.data === 'string') out[kind][L].data = v.data.trim();
      }
    });
  });
  return out;
}

function normalizeEpkPhotos(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(filter.filterEpkPhoto).filter(function (ph) {
    return ph && typeof ph === 'object' && ph.url && String(ph.url).trim();
  });
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-press.js <rg_admin_export.json>');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = exportLoader.loadAdminExportSource(absExport, 'build-press');
var data = payload && payload.source ? payload.source : null;
if (!data || typeof data !== 'object') {
  console.error('build-press: export missing usable source payload');
  process.exit(1);
}

var press = normalizePress(data.rg_press);
if (!press.length) {
  console.error('build-press: data.rg_press is empty or not an array — refusing to write');
  process.exit(1);
}
for (var j = 0; j < press.length; j++) {
  if (!validPressItem(press[j])) {
    console.error('build-press: invalid press item at index', j, '(need non-empty source and quote)');
    process.exit(1);
  }
}
if (!visiblePressCount(press)) {
  console.error('build-press: no visible press items (visible !== false)');
  process.exit(1);
}

var defaults = readJson(pressDefaultsPath);
var reviewsIntroByLang = buildReviewsIntroByLang(data, defaults.reviewsIntroByLang || null);
var reviewsIntro =
  pickReviewsIntro(data) ||
  (reviewsIntroByLang.en && String(reviewsIntroByLang.en).trim()) ||
  defaults.reviewsIntro ||
  '';
if (!String(reviewsIntro).trim()) {
  console.error('build-press: reviewsIntro is empty (set rg_ui_*.reviewsIntro or press-defaults.json)');
  process.exit(1);
}

var pressMeta = mergePressMeta(defaults.pressMeta || {}, data.rg_press_meta || null);
var epkPhotos = normalizeEpkPhotos(data.rg_epk_photos || []);
var publicPdfs = mergePublicPdfs(publicPdfsTemplate(), data.rg_public_pdfs || null);

var output = {
  reviewsIntro: String(reviewsIntro).trim(),
  reviewsIntroByLang: reviewsIntroByLang,
  press: press,
  pressMeta: pressMeta,
  epkPhotos: epkPhotos,
  publicPdfs: publicPdfs
};

// Security validation: ensure no internal fields leaked
try {
  filter.validatePublicPayload(output, 'press-data.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile, '(' + press.length + ' press items, ' + epkPhotos.length + ' photos)');
