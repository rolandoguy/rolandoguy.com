'use strict';
/**
 * Writes v1-assets/data/media-data.json for mp/media.html (mp-media.js).
 *
 * Sources (admin export JSON):
 *   - data.rg_vid — required: { h2?, videos: Video[] }; videos non-empty after normalize
 *   - data.rg_vid_en — optional legacy alias: used only if rg_vid is missing/invalid (same shape as rg_vid)
 *   - data.rg_photos — required: { s, t, b } URL arrays (paths normalized for mp/pages)
 *   - data.rg_photo_captions — optional; lightbox keys s_0, t_1, … → { caption, photographer }
 *   - data.rg_ui_en — optional; string keys photos.h2, photos.sub, photos.studio, photos.stage,
 *     photos.backstage, photos.backstageEmpty, vid.h2 (EN chrome for static mp media page)
 *
 * Defaults: v1-assets/build/media-defaults.json (vid.h2 + photos section chrome).
 *
 * Usage:
 *   npm run build:media -- path/to/rg_admin_export.json
 *   node scripts/build-media.js path/to/rg_admin_export.json
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'v1-assets', 'data', 'media-data.json');
var mediaDefaultsPath = path.join(root, 'v1-assets', 'build', 'media-defaults.json');
var filter = require('./lib/public-field-filter');
var exportLoader = require('./lib/load-admin-export');

var enTable = null;

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-media: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function safeString(v) {
  return typeof v === 'string' ? v : (v == null ? '' : String(v));
}

function normalizeVideos(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(filter.filterMediaVideo);
}

function safeMediaAudio(audio) {
  if (!audio || typeof audio !== 'object') return { h2: '', sub: '', items: [] };
  return {
    h2: String(audio.h2 || '').trim(),
    sub: String(audio.sub || '').trim(),
    items: Array.isArray(audio.items) ? audio.items.map(filter.filterMediaAudioItem) : []
  };
}

function resolveEffectiveAudioHeadingFields(audioData) {
  var uiEn = data.rg_ui_en && typeof data.rg_ui_en === 'object' ? data.rg_ui_en : null;
  var safeAudio = safeMediaAudio(audioData || {});
  return {
    h2:
      safeString(safeAudio.h2).trim() ||
      safeString(uiEn && uiEn['mp.audio.h2']).trim() ||
      safeString(enTable && enTable['mp.audio.h2']).trim(),
    sub:
      safeString(safeAudio.sub).trim() ||
      safeString(uiEn && uiEn['mp.audio.sub']).trim() ||
      safeString(enTable && enTable['mp.audio.sub']).trim()
  };
}

function validVideo(v) {
  if (!v || typeof v !== 'object') return false;
  // Hidden/draft videos are allowed to be incomplete - they won't be shown publicly
  if (v.hidden === true || v.hidden === 'true') return true;
  var id = String(v.id || '').trim();
  if (!id) return false;
  if (!String(v.title || '').trim()) return false;
  if (!String(v.tag || '').trim()) return false;
  return true;
}

/** Paths for mp/media.html (sibling of v1-assets): repo-root img/ → ../img/… */
function normalizePhotoUrl(u) {
  var s = String(u == null ? '' : u).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf('//') === 0) return s;
  if (s.indexOf('data:') === 0) return s;
  if (s.indexOf('../') === 0) return s;
  if (s.indexOf('img/') === 0) return '../' + s;
  if (s.charAt(0) === '/' && s.indexOf('/img/') === 0) return '..' + s;
  return s;
}

function normalizePhotoEntry(entry) {
  if (entry == null) return '';
  if (typeof entry === 'string') return normalizePhotoUrl(entry);
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    var o = filter.filterMediaPhoto(entry);
    if (typeof o.url !== 'string') return '';
    var nu = normalizePhotoUrl(o.url);
    if (!String(nu).trim()) return '';
    return Object.assign({}, o, { url: nu });
  }
  return '';
}

function normalizePhotoList(arr) {
  if (!Array.isArray(arr)) return [];
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var x = normalizePhotoEntry(arr[i]);
    if (x === '' || x == null) continue;
    if (typeof x === 'string') {
      out.push(x);
      continue;
    }
    if (x && typeof x === 'object' && typeof x.url === 'string' && String(x.url).trim()) {
      out.push(x);
    }
  }
  return out;
}

function normalizePhotosBlock(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { s: [], t: [], b: [] };
  }
  // Extract photo arrays directly before filtering chrome metadata
  // (filterMediaChrome only allows h2, sub, studioTab, stageTab, backstageTab, backstageEmpty)
  var sArr = Array.isArray(raw.s) ? raw.s : [];
  var tArr = Array.isArray(raw.t) ? raw.t : [];
  var bArr = Array.isArray(raw.b) ? raw.b : [];
  var chrome = filter.filterMediaChrome(raw);
  return {
    s: normalizePhotoList(sArr),
    t: normalizePhotoList(tArr),
    b: normalizePhotoList(bArr)
  };
}

function totalPhotoCount(block) {
  return (block.s && block.s.length) + (block.t && block.t.length) + (block.b && block.b.length);
}

function normalizeCaptions(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  var out = {};
  for (var k in raw) {
    if (!Object.prototype.hasOwnProperty.call(raw, k)) continue;
    var v = raw[k];
    if (typeof v === 'string') {
      out[k] = { caption: String(v), alt: '', photographer: '' };
      continue;
    }
    if (!v || typeof v !== 'object') continue;
    var filtered = filter.filterMediaCaption(v);
    out[k] = {
      caption: filtered.caption != null ? String(filtered.caption) : '',
      alt: filtered.alt != null ? String(filtered.alt) : '',
      photographer: filtered.photographer != null ? String(filtered.photographer) : ''
    };
  }
  return out;
}

function pickUiString(ui, key) {
  if (!ui || typeof ui !== 'object') return '';
  if (ui[key] == null) return '';
  var s = String(ui[key]).trim();
  return s;
}

function mergePhotosChrome(defaultsPhotos, uiEn) {
  var d = defaultsPhotos || {};
  function pick(keyUi, keyOut) {
    var fromUi = pickUiString(uiEn, keyUi);
    if (fromUi) return fromUi;
    var fb = d[keyOut];
    return fb != null ? String(fb) : '';
  }
  return {
    h2: pick('photos.h2', 'h2'),
    sub: pick('photos.sub', 'sub'),
    studioTab: pick('photos.studio', 'studioTab'),
    stageTab: pick('photos.stage', 'stageTab'),
    backstageTab: pick('photos.backstage', 'backstageTab'),
    backstageEmpty: pick('photos.backstageEmpty', 'backstageEmpty')
  };
}

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-media.js <rg_admin_export.json>');
  process.exit(1);
}

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
var payload = exportLoader.loadAdminExportSource(absExport, 'build-media');
var data = payload && payload.source ? payload.source : null;
if (!data || typeof data !== 'object') {
  console.error('build-media: export missing usable source payload');
  process.exit(1);
}

var rawVid = data.rg_vid;
if (!rawVid || typeof rawVid !== 'object' || Array.isArray(rawVid)) {
  rawVid = data.rg_vid_en;
}
if (!rawVid || typeof rawVid !== 'object' || Array.isArray(rawVid)) {
  console.error('build-media: data.rg_vid (or legacy data.rg_vid_en) missing or invalid');
  process.exit(1);
}

var videos = normalizeVideos(rawVid.videos);
if (!videos.length) {
  console.error('build-media: data.rg_vid.videos is empty or not an array — refusing to write');
  process.exit(1);
}
var invalidVideos = [];
for (var j = 0; j < videos.length; j++) {
  if (!validVideo(videos[j])) {
    var v = videos[j];
    var isHidden = v && (v.hidden === true || v.hidden === 'true');
    console.warn(
      'build-media: skipping incomplete video at index',
      j,
      '(id:',
      String(v && v.id || '(missing)').slice(0, 30),
      ', title:',
      String(v && v.title || '(missing)').slice(0, 30),
      ', hidden:',
      isHidden,
      ')'
    );
    if (!isHidden) {
      invalidVideos.push({ index: j, video: v });
    }
  }
}
if (invalidVideos.length > 0) {
  console.error(
    'build-media:',
    invalidVideos.length,
    'non-hidden video(s) are invalid (need non-empty id, title, and tag). First invalid at index:',
    invalidVideos[0].index
  );
  process.exit(1);
}
var validVideos = videos.filter(function(v, idx) {
  return validVideo(v);
});

var rawAudio = data.rg_audio;
if (!rawAudio || typeof rawAudio !== 'object' || Array.isArray(rawAudio)) {
  rawAudio = { h2: '', sub: '', items: [] };
}
var audioData = safeMediaAudio(rawAudio);
var effectiveAudio = resolveEffectiveAudioHeadingFields(audioData);

if (data.rg_photos == null || typeof data.rg_photos !== 'object' || Array.isArray(data.rg_photos)) {
  console.error('build-media: data.rg_photos missing or invalid');
  process.exit(1);
}

console.log('build-media: rg_photos shape:', JSON.stringify({
  s: Array.isArray(data.rg_photos.s) ? data.rg_photos.s.length : 'not array',
  t: Array.isArray(data.rg_photos.t) ? data.rg_photos.t.length : 'not array',
  b: Array.isArray(data.rg_photos.b) ? data.rg_photos.b.length : 'not array',
  sSample: data.rg_photos.s && data.rg_photos.s[0] ? typeof data.rg_photos.s[0] : 'none',
  tSample: data.rg_photos.t && data.rg_photos.t[0] ? typeof data.rg_photos.t[0] : 'none',
  bSample: data.rg_photos.b && data.rg_photos.b[0] ? typeof data.rg_photos.b[0] : 'none'
}));

var photosBlock = normalizePhotosBlock(data.rg_photos);
console.log('build-media: after normalization - s:', photosBlock.s.length, 't:', photosBlock.t.length, 'b:', photosBlock.b.length);
if (!totalPhotoCount(photosBlock)) {
  console.error('build-media: no photo URLs in rg_photos (s/t/b) — refusing to write');
  process.exit(1);
}

var defaults = readJson(mediaDefaultsPath);
var uiEn = data.rg_ui_en && typeof data.rg_ui_en === 'object' ? data.rg_ui_en : null;
try {
  if (typeof uiEn === 'function') {
    enTable = uiEn('en') || null;
  } else if (uiEn && typeof uiEn === 'object') {
    enTable = uiEn;
  }
} catch (e) {
  enTable = null;
}

var vidH2 =
  (typeof rawVid.h2 === 'string' && rawVid.h2.trim() ? String(rawVid.h2).trim() : '') ||
  pickUiString(uiEn, 'vid.h2') ||
  (defaults.vid && defaults.vid.h2 ? String(defaults.vid.h2) : '');
if (!vidH2) {
  console.error('build-media: vid h2 is empty (set rg_vid.h2, rg_ui_en.vid.h2, or media-defaults.json)');
  process.exit(1);
}

var chrome = mergePhotosChrome(defaults.photos || {}, uiEn);
if (!String(chrome.h2 || '').trim()) {
  console.error('build-media: photos.h2 is empty (rg_ui_en or media-defaults.json)');
  process.exit(1);
}
if (!String(chrome.sub || '').trim()) {
  console.error('build-media: photos.sub is empty (rg_ui_en or media-defaults.json)');
  process.exit(1);
}

var captions = normalizeCaptions(data.rg_photo_captions || null);

var output = {
  vid: {
    h2: vidH2,
    videos: validVideos
  },
  audio: effectiveAudio,
  photos: Object.assign({}, chrome, {
    s: photosBlock.s,
    t: photosBlock.t,
    b: photosBlock.b,
    captions: captions
  })
};

// Security validation: ensure no internal fields leaked
try {
  filter.validatePublicPayload(output, 'media-data.json');
} catch (e) {
  console.error('[SECURITY] Validation failed:', e.message);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(
  'Wrote',
  outFile,
  '(' + validVideos.length + ' valid videos (skipped ' + (videos.length - validVideos.length) + ' incomplete hidden/draft),',
  (output.audio && output.audio.items ? output.audio.items.length : 0) + ' audio,',
  photosBlock.s.length +
    '+' +
    photosBlock.t.length +
    '+' +
    photosBlock.b.length,
  'photos)'
);
