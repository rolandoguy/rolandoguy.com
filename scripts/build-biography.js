'use strict';
/**
 * Writes v1-assets/data/biography-data.json for mp/biography.html (mp-biography.js).
 *
 * Sources:
 *   - data.bio_<lang> from optional admin export (h2, p1, p2 — same shape as v1)
 *   - v1-assets/build/biography-defaults.json — per-lang baseline (chrome + bio copy)
 *
 * EN long-form body is split into four <p> blocks to match the existing mp layout (reading rhythm).
 * Other languages use the same split when language-specific anchors match; otherwise [p1, p2].
 *
 * Usage:
 *   npm run build:biography -- [path/to/rg_admin_export.json]
 *   node scripts/build-biography.js
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'biography-data.json');
var defaultsPath = path.join(root, 'v1-assets', 'build', 'biography-defaults.json');
var filter = require('./lib/public-field-filter');

var LANGS = ['en', 'de', 'es', 'it', 'fr'];

/** First sentence end marker, then end of “… Marcelo Ayub.” block inside p1 (same structure as v1 copy). */
var SPLIT_MARKERS = {
  en: { a: 'National Conservatory of Music.', b: 'Marcelo Ayub.' },
  de: { a: 'Nationalen Konservatorium studierte.', b: 'Marcelo Ayub.' },
  es: { a: 'Conservatorio Nacional de Música.', b: 'Marcelo Ayub.' },
  fr: { a: 'Conservatoire National de Musique.', b: 'Marcelo Ayub.' },
  it: { a: 'Conservatorio Nazionale di Musica.', b: 'Marcelo Ayub.' }
};

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-biography: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function nonEmptyStr(v) {
  return v != null && String(v).trim() !== '';
}

/** @returns {string[]|null} four segments, or null */
function splitBioFour(p1, p2, lang) {
  var m = SPLIT_MARKERS[lang];
  if (!m || !nonEmptyStr(p1) || !nonEmptyStr(p2)) return null;
  var t1 = String(p1).trim();
  var t2 = String(p2).trim();
  var idxA = t1.indexOf(m.a);
  if (idxA === -1) return null;
  var part1 = t1.slice(0, idxA + m.a.length).trim();
  var rest = t1.slice(idxA + m.a.length).trim();
  var idxB = rest.indexOf(m.b);
  if (idxB === -1) return null;
  var part2 = rest.slice(0, idxB + m.b.length).trim();
  var part3 = rest.slice(idxB + m.b.length).trim();
  if (!part3 || !t2) return null;
  return [part1, part2, part3, t2];
}

function mergeBioLayer(base, rawExport) {
  var o = Object.assign({}, base);
  if (!rawExport || typeof rawExport !== 'object') return o;
  var ex = filter.filterBiography(rawExport);
  ['h2', 'p1', 'p2'].forEach(function (k) {
    if (nonEmptyStr(ex[k])) o[k] = String(ex[k]).trim();
  });
  [
    'introLine',
    'portraitAlt',
    'continueSectionTag',
    'continueSub',
    'ctaRepertoire',
    'ctaMedia',
    'ctaContact',
    'ctaHomeIntro'
  ].forEach(function (k) {
    if (nonEmptyStr(ex[k])) o[k] = String(ex[k]).trim();
  });
  return o;
}

function paragraphsForLang(merged, lang) {
  var four = splitBioFour(merged.p1, merged.p2, lang);
  if (four) return four;
  if (nonEmptyStr(merged.p1) && nonEmptyStr(merged.p2)) return [String(merged.p1).trim(), String(merged.p2).trim()];
  return null;
}

var defaults = readJson(defaultsPath);

var exportPath = process.argv[2];
var exportData = null;
if (exportPath) {
  var abs = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
  var payload = readJson(abs);
  exportData = payload && payload.data ? payload.data : null;
  if (!exportData) {
    console.error('build-biography: export missing top-level data object');
    process.exit(1);
  }
}

var outLocales = {};
var portraitImage = defaults.portraitImage != null ? String(defaults.portraitImage).trim() : '';

LANGS.forEach(function (lang) {
  var base = (defaults.locales && defaults.locales[lang]) || {};
  var rawEx = exportData && exportData['bio_' + lang] ? exportData['bio_' + lang] : null;
  var merged = mergeBioLayer(base, rawEx);

  if (!nonEmptyStr(merged.h2)) {
    console.error('build-biography: missing bio h2 for', lang);
    process.exit(1);
  }
  if (!nonEmptyStr(merged.introLine)) {
    console.error('build-biography: missing introLine for', lang);
    process.exit(1);
  }
  if (!nonEmptyStr(merged.portraitAlt)) {
    console.error('build-biography: missing portraitAlt for', lang);
    process.exit(1);
  }

  var paras = paragraphsForLang(merged, lang);
  if (!paras || paras.length < 2) {
    console.error('build-biography: could not build paragraphs for', lang);
    process.exit(1);
  }
  if (lang === 'en' && paras.length !== 4) {
    console.error(
      'build-biography: EN biography must split into 4 paragraphs (check p1 markers / copy)'
    );
    process.exit(1);
  }

  ['continueSectionTag', 'continueSub', 'ctaRepertoire', 'ctaMedia', 'ctaContact', 'ctaHomeIntro'].forEach(
    function (k) {
      if (!nonEmptyStr(merged[k])) {
        console.error('build-biography: missing', k, 'for', lang);
        process.exit(1);
      }
    }
  );

  outLocales[lang] = {
    introLine: String(merged.introLine).trim(),
    h2: String(merged.h2).trim(),
    paragraphs: paras,
    portraitAlt: String(merged.portraitAlt).trim(),
    continueSectionTag: String(merged.continueSectionTag).trim(),
    continueSub: String(merged.continueSub).trim(),
    ctaRepertoire: String(merged.ctaRepertoire).trim(),
    ctaMedia: String(merged.ctaMedia).trim(),
    ctaContact: String(merged.ctaContact).trim(),
    ctaHomeIntro: String(merged.ctaHomeIntro).trim()
  };
});

if (!portraitImage) {
  console.error('build-biography: defaults portraitImage empty');
  process.exit(1);
}

var output = {
  portraitImage: portraitImage,
  locales: outLocales
};

// Security validation: ensure no internal fields leaked
try {
  filter.validatePublicPayload(output, 'biography-data.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Wrote', outFile);
