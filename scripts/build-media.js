'use strict';
/**
 * Writes v1-assets/data/media-data.json for mp/media.html (mp-media.js).
 *
 * Sources (admin export JSON):
 *   - data.rg_vid — required: { h2?, videos: Video[] }; videos non-empty after normalize
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

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error('build-media: missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
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

function normalizeVideos(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(stripAdminNote);
}

function validVideo(v) {
  if (!v || typeof v !== 'object') return false;
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
    var o = stripAdminNote(entry);
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
  var o = stripAdminNote(raw);
  return {
    s: normalizePhotoList(o.s),
    t: normalizePhotoList(o.t),
    b: normalizePhotoList(o.b || [])
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
    if (!v || typeof v !== 'object') continue;
    out[k] = {
      caption: v.caption != null ? String(v.caption) : '',
      photographer: v.photographer != null ? String(v.photographer) : ''
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
var payload = readJson(absExport);
var data = payload && payload.data ? payload.data : null;
if (!data || typeof data !== 'object') {
  console.error('build-media: export missing data object');
  process.exit(1);
}

var rawVid = data.rg_vid;
if (!rawVid || typeof rawVid !== 'object' || Array.isArray(rawVid)) {
  console.error('build-media: data.rg_vid missing or invalid');
  process.exit(1);
}

var videos = normalizeVideos(rawVid.videos);
if (!videos.length) {
  console.error('build-media: data.rg_vid.videos is empty or not an array — refusing to write');
  process.exit(1);
}
for (var j = 0; j < videos.length; j++) {
  if (!validVideo(videos[j])) {
    console.error(
      'build-media: invalid video at index',
      j,
      '(need non-empty id, title, and tag)'
    );
    process.exit(1);
  }
}

if (data.rg_photos == null || typeof data.rg_photos !== 'object' || Array.isArray(data.rg_photos)) {
  console.error('build-media: data.rg_photos missing or invalid');
  process.exit(1);
}

var photosBlock = normalizePhotosBlock(data.rg_photos);
if (!totalPhotoCount(photosBlock)) {
  console.error('build-media: no photo URLs in rg_photos (s/t/b) — refusing to write');
  process.exit(1);
}

var defaults = readJson(mediaDefaultsPath);
var uiEn = data.rg_ui_en && typeof data.rg_ui_en === 'object' ? data.rg_ui_en : null;

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
    videos: videos
  },
  photos: Object.assign({}, chrome, {
    s: photosBlock.s,
    t: photosBlock.t,
    b: photosBlock.b,
    captions: captions
  })
};

fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(
  'Wrote',
  outFile,
  '(' + videos.length + ' videos,',
  photosBlock.s.length +
    '+' +
    photosBlock.t.length +
    '+' +
    photosBlock.b.length,
  'photos)'
);
