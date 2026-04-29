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
var exportLoader = require('./lib/load-admin-export');

var LANGS = ['en', 'de', 'es', 'it', 'fr'];
var BIO_SOURCE_FIELDS = [
  'introLine',
  'h2',
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'paragraphs',
  'sections',
  'portraitAlt',
  'portraitImage',
  'portraitFit',
  'portraitFocus',
  'continueSectionTag',
  'continueSub',
  'ctaRepertoire',
  'ctaMedia',
  'ctaContact',
  'ctaHomeIntro'
];

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

function pickBioSourceFields(raw) {
  var out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  BIO_SOURCE_FIELDS.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(raw, key) && raw[key] !== undefined) {
      out[key] = raw[key];
    }
  });
  return out;
}

function normalizeParagraphs(raw) {
  if (!raw || typeof raw !== 'object') return [];
  if (Array.isArray(raw.paragraphs) && raw.paragraphs.length) {
    return raw.paragraphs
      .map(function (x) {
        return String(x == null ? '' : x).trim();
      })
      .filter(Boolean);
  }
  var out = [];
  ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(function (key) {
    if (nonEmptyStr(raw[key])) out.push(String(raw[key]).trim());
  });
  return out;
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
  var ex = pickBioSourceFields(rawExport);
  ['h2', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(function (k) {
    if (nonEmptyStr(ex[k])) o[k] = String(ex[k]).trim();
  });
  var paras = normalizeParagraphs(ex);
  if (paras.length) o.paragraphs = paras.slice();
  if (ex.sections && typeof ex.sections === 'object') {
    o.sections = {};
    ['profile', 'training', 'stage', 'repertoire'].forEach(function (k) {
      if (nonEmptyStr(ex.sections[k])) o.sections[k] = String(ex.sections[k]).trim();
    });
  }
  [
    'introLine',
    'portraitAlt',
    'portraitImage',
    'portraitFit',
    'portraitFocus',
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
  var explicit = normalizeParagraphs(merged);
  if (explicit.length >= 2) return explicit;
  var four = splitBioFour(merged.p1, merged.p2, lang);
  if (four) return four;
  if (nonEmptyStr(merged.p1) && nonEmptyStr(merged.p2)) return [String(merged.p1).trim(), String(merged.p2).trim()];
  return null;
}

function resolvePortraitDefault(defaults, outLocales) {
  var fromDe = outLocales && outLocales.de && nonEmptyStr(outLocales.de.portraitImage)
    ? String(outLocales.de.portraitImage).trim()
    : '';
  if (fromDe) return fromDe;
  var fromEn = outLocales && outLocales.en && nonEmptyStr(outLocales.en.portraitImage)
    ? String(outLocales.en.portraitImage).trim()
    : '';
  if (fromEn) return fromEn;
  return defaults.portraitImage != null ? String(defaults.portraitImage).trim() : '';
}

var defaults = readJson(defaultsPath);

var exportPath = process.argv[2];
var exportData = null;
if (exportPath) {
  var abs = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
  var payload = exportLoader.loadAdminExportSource(abs, 'build-biography');
  exportData = payload && payload.source ? payload.source : null;
  if (!exportData) {
    console.error('build-biography: export missing usable source payload');
    process.exit(1);
  }
}

var outLocales = {};

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
  if (nonEmptyStr(merged.portraitImage)) outLocales[lang].portraitImage = String(merged.portraitImage).trim();
  if (nonEmptyStr(merged.portraitFit)) outLocales[lang].portraitFit = String(merged.portraitFit).trim();
  if (nonEmptyStr(merged.portraitFocus)) outLocales[lang].portraitFocus = String(merged.portraitFocus).trim();
  if (merged.sections && typeof merged.sections === 'object') {
    outLocales[lang].sections = {};
    ['profile', 'training', 'stage', 'repertoire'].forEach(function (k) {
      if (nonEmptyStr(merged.sections[k])) outLocales[lang].sections[k] = String(merged.sections[k]).trim();
    });
  }
});

var portraitImage = resolvePortraitDefault(defaults, outLocales);
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
