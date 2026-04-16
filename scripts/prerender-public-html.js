'use strict';
/**
 * Build-time English static content injection for public pages.
 *
 * Goal:
 * - Ship meaningful EN HTML in initial documents for crawlability/AI parsers/no-JS contexts.
 * - Preserve runtime i18n (data-i18n attributes remain; JS still enhances/replaces after load).
 *
 * Usage:
 *   node scripts/prerender-public-html.js
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');

function readJson(rel) {
  var abs = path.join(root, rel);
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function readText(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function writeText(rel, s) {
  fs.writeFileSync(path.join(root, rel), s, 'utf8');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceById(html, id, newInnerHtml) {
  var re = new RegExp('(<([a-zA-Z0-9]+)[^>]*\\bid="' + id + '"[^>]*>)([\\s\\S]*?)(</\\2>)');
  return html.replace(re, function (_m, open, _tag, _old, close) {
    return open + newInnerHtml + close;
  });
}

function ensureOneLine(s) {
  return String(s == null ? '' : s).trim();
}

var locales = readJson('v1-assets/data/mp-locales.json').locales || {};
var enLocale = locales.en || {};
var bioData = readJson('v1-assets/data/biography-data.json');
var repData = readJson('v1-assets/data/repertoire-data.json');
var calData = readJson('v1-assets/data/calendar-data.json');
var pressData = readJson('v1-assets/data/press-data.json');
var contactData = readJson('v1-assets/data/contact-data.json');
var mediaData = readJson('v1-assets/data/media-data.json');

// index.html
var indexHtml = readText('index.html');
indexHtml = replaceById(indexHtml, 'heroEyebrow', ensureOneLine(enLocale['hero.eyebrow'] || 'Lyric Tenor · Opera · Recital · Concert'));
indexHtml = replaceById(indexHtml, 'heroName', ensureOneLine(enLocale['hero.nameHtml'] || 'Rolando<br><em>Guy</em>'));
indexHtml = replaceById(indexHtml, 'heroSubtitle', ensureOneLine(enLocale['hero.subtitle'] || 'Argentine-Italian tenor based in Berlin'));
indexHtml = replaceById(indexHtml, 'heroCta1', escapeHtml(ensureOneLine(enLocale['hero.cta1'] || 'Watch & Listen')));
indexHtml = replaceById(indexHtml, 'heroCta2', escapeHtml(ensureOneLine(enLocale['hero.cta2'] || 'Bookings')));
indexHtml = replaceById(indexHtml, 'homeIntroCtaBio', escapeHtml(ensureOneLine(enLocale['home.intro.ctaBio'] || 'Read the full biography')));
indexHtml = replaceById(indexHtml, 'homeIntroCtaMedia', escapeHtml(ensureOneLine(enLocale['home.intro.ctaMedia'] || 'Watch & listen')));
indexHtml = replaceById(indexHtml, 'homeIntroCtaPress', escapeHtml(ensureOneLine(enLocale['nav.epk'] || 'Press & materials')));
writeText('index.html', indexHtml);

// biography.html
var bioHtml = readText('biography.html');
var bioEn = (bioData.locales && bioData.locales.en) || {};
bioHtml = replaceById(bioHtml, 'bioIntroLine', escapeHtml(ensureOneLine(bioEn.introLine || 'Argentine-Italian lyric tenor based in Berlin.')));
bioHtml = replaceById(bioHtml, 'bio-heading', ensureOneLine(bioEn.h2 || 'Biography'));
var paras = Array.isArray(bioEn.paragraphs) ? bioEn.paragraphs : [];
var parasHtml = paras
  .map(function (p) { return '<p>' + escapeHtml(ensureOneLine(p)) + '</p>'; })
  .join('');
if (parasHtml) bioHtml = replaceById(bioHtml, 'bioParagraphs', parasHtml);
writeText('biography.html', bioHtml);

// repertoire.html
var repHtml = readText('repertoire.html');
var rep = repData.rep || {};
repHtml = replaceById(repHtml, 'repH2', ensureOneLine(rep.h2 || 'Selected <em>Repertoire</em>'));
repHtml = replaceById(repHtml, 'repIntro', escapeHtml(ensureOneLine(rep.intro || 'Selected stage and concert repertoire.')));
writeText('repertoire.html', repHtml);

// calendar.html
var calHtml = readText('calendar.html');
var perf = calData.perf || {};
calHtml = replaceById(calHtml, 'perfH2', ensureOneLine(perf.h2 || 'Engagements &amp; <em>Concerts</em>'));
calHtml = replaceById(
  calHtml,
  'perfIntro',
  escapeHtml(
    ensureOneLine(
      perf.intro || 'Upcoming performances and selected past engagements.'
    )
  )
);
calHtml = replaceById(
  calHtml,
  'perfList',
  '<p class="perf-empty">Upcoming engagements are listed here. If events do not load in your browser, please use the contact page for current booking information.</p>'
);
writeText('calendar.html', calHtml);

// press.html
var pressHtml = readText('press.html');
var enPressIntro =
  (pressData.reviewsIntroByLang && ensureOneLine(pressData.reviewsIntroByLang.en)) ||
  ensureOneLine(pressData.reviewsIntro) ||
  'Selected press responses to recent productions and performances.';
pressHtml = replaceById(pressHtml, 'reviewsIntro', escapeHtml(enPressIntro));
pressHtml = replaceById(
  pressHtml,
  'epkDocsIntro',
  escapeHtml(
    ensureOneLine(
      enLocale['epk.docsIntro'] ||
      'Download ready-to-share files for programming, season planning, presenter packs, and press coverage.'
    )
  )
);
writeText('press.html', pressHtml);

// contact.html
var contactHtml = readText('contact.html');
var c = contactData.contact || {};
// contact.html keeps empty #contactTitle / #contactSub in source to avoid a pre-JS English flash; prerender fills EN for crawlers/no-JS.
contactHtml = replaceById(contactHtml, 'contactTitle', ensureOneLine(c.title || 'Bookings &amp; <em>Artistic Enquiries</em>'));
contactHtml = replaceById(contactHtml, 'contactSub', escapeHtml(ensureOneLine(c.sub || 'For bookings and artistic enquiries, please get in touch directly.')));
contactHtml = replaceById(
  contactHtml,
  'contactEmailBtn',
  escapeHtml(ensureOneLine(c.emailBtn || 'Send Email'))
);
contactHtml = replaceById(
  contactHtml,
  'contactWebBtn',
  escapeHtml(ensureOneLine(c.webBtn || 'Official Website'))
);
contactHtml = replaceById(
  contactHtml,
  'contactSectionTag',
  escapeHtml(ensureOneLine(enLocale['nav.contact'] || 'Contact'))
);
writeText('contact.html', contactHtml);

// media.html
var mediaHtml = readText('media.html');
var mediaVideos = mediaData.videos || {};
var mediaPhotos = mediaData.photos || {};
mediaHtml = replaceById(mediaHtml, 'vidH2', ensureOneLine(mediaVideos.h2 || 'Stage, Concert &amp; Recital Highlights'));
mediaHtml = replaceById(mediaHtml, 'photosH2', ensureOneLine(mediaPhotos.h2 || 'Portraits, Stage &amp; <em>Backstage</em>'));
mediaHtml = replaceById(
  mediaHtml,
  'photosSub',
  escapeHtml(
    ensureOneLine(
      mediaPhotos.sub ||
      'Selected portrait, stage and backstage photography. Click any image to view full size.'
    )
  )
);
writeText('media.html', mediaHtml);

console.log('Prerendered EN static content into public HTML templates.');
