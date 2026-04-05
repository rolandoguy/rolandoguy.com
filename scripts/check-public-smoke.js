'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');

var requiredHtmlPages = [
  {
    file: 'index.html',
    pageId: 'index',
    hooks: ['data-i18n=', 'class="mp-home-hero-asset"']
  },
  {
    file: 'biography.html',
    pageId: 'biography',
    hooks: ['data-i18n=', 'id="bioParagraphs"', 'id="bioIntroLine"']
  },
  {
    file: 'repertoire.html',
    pageId: 'repertoire',
    hooks: ['data-i18n=', 'id="operaGrid"', 'id="programsGrid"', 'id="programsSectionTag"']
  },
  {
    file: 'media.html',
    pageId: 'media',
    hooks: ['data-i18n=', 'id="videoGrid"', 'id="videoMore"', 'id="videoModal"', 'id="photos"']
  },
  {
    file: 'calendar.html',
    pageId: 'calendar',
    hooks: ['data-i18n=', 'id="perfList"', 'id="eventModal"']
  },
  {
    file: 'press.html',
    pageId: 'press',
    hooks: ['data-i18n=', 'id="pressGrid"', 'id="epkPhotosGrid"']
  },
  {
    file: 'contact.html',
    pageId: 'contact',
    hooks: ['data-i18n=', 'id="contactEmailBtn"', 'id="cf-message"', 'id="formOk"']
  },
  {
    file: 'reviews.html',
    pageId: 'reviews',
    hooks: ['data-i18n=', 'data-i18n-html="mp.reviewsStub.html"', 'meta name="robots" content="noindex,follow"']
  }
];

var requiredDataFiles = [
  'v1-assets/data/mp-locales.json',
  'v1-assets/data/hero-config.json',
  'v1-assets/data/biography-data.json',
  'v1-assets/data/repertoire-data.json',
  'v1-assets/data/programs-data.json',
  'v1-assets/data/calendar-data.json',
  'v1-assets/data/media-data.json',
  'v1-assets/data/press-data.json',
  'v1-assets/data/contact-data.json',
  'v1-assets/data/epk-bios.json'
];

var jsDataPathChecks = [
  { file: 'v1-assets/js/mp-shell.js', expected: "/v1-assets/data/mp-locales.json" },
  { file: 'v1-assets/js/mp-hero.js', expected: "/v1-assets/data/hero-config.json" },
  { file: 'v1-assets/js/mp-biography.js', expected: "/v1-assets/data/biography-data.json" },
  { file: 'v1-assets/js/mp-repertoire.js', expected: "/v1-assets/data/repertoire-data.json" },
  { file: 'v1-assets/js/mp-programs.js', expected: "/v1-assets/data/programs-data.json" },
  { file: 'v1-assets/js/mp-calendar.js', expected: "/v1-assets/data/calendar-data.json" },
  { file: 'v1-assets/js/mp-media.js', expected: "/v1-assets/data/media-data.json" },
  { file: 'v1-assets/js/mp-press.js', expected: "/v1-assets/data/press-data.json" },
  { file: 'v1-assets/js/mp-contact.js', expected: "/v1-assets/data/contact-data.json" }
];

var failures = [];
var checksRun = 0;

function abs(relPath) {
  return path.join(root, relPath);
}

function read(relPath) {
  return fs.readFileSync(abs(relPath), 'utf8');
}

function exists(relPath) {
  return fs.existsSync(abs(relPath));
}

function check(condition, message) {
  checksRun += 1;
  if (!condition) failures.push(message);
}

function includes(text, snippet) {
  return text.indexOf(snippet) !== -1;
}

function readLocales() {
  var raw = read('v1-assets/data/mp-locales.json');
  return JSON.parse(raw).locales;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTitle(html) {
  var match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function getMetaContent(html, attrName, attrValue) {
  var pattern = new RegExp(
    '<meta\\s+[^>]*' + attrName + '=["\']' + escapeRegExp(attrValue) + '["\'][^>]*content=["\']([^"\']*)["\']',
    'i'
  );
  var direct = html.match(pattern);
  if (direct) return direct[1].trim();

  var reversePattern = new RegExp(
    '<meta\\s+[^>]*content=["\']([^"\']*)["\'][^>]*' + attrName + '=["\']' + escapeRegExp(attrValue) + '["\']',
    'i'
  );
  var reverse = html.match(reversePattern);
  return reverse ? reverse[1].trim() : '';
}

requiredHtmlPages.forEach(function (page) {
  check(exists(page.file), 'Missing public HTML file: ' + page.file);
  if (!exists(page.file)) return;

  var html = read(page.file);
  check(/<title>[\s\S]*?<\/title>/i.test(html), page.file + ': missing <title>');
  check(/<meta\s+name=["']description["'][^>]*content=["'][^"']+/i.test(html), page.file + ': missing meta description');
  check(/<link\s+rel=["']canonical["'][^>]*href=["'][^"']+/i.test(html), page.file + ': missing canonical link');
  check(/<meta\s+property=["']og:title["'][^>]*content=["'][^"']+/i.test(html), page.file + ': missing og:title');
  check(/<meta\s+property=["']og:description["'][^>]*content=["'][^"']+/i.test(html), page.file + ': missing og:description');
  check(/<meta\s+name=["']twitter:title["'][^>]*content=["'][^"']+/i.test(html), page.file + ': missing twitter:title');
  check(/<meta\s+name=["']twitter:description["'][^>]*content=["'][^"']+/i.test(html), page.file + ': missing twitter:description');
  check(
    new RegExp('<body[^>]*data-mp-page=["\']' + page.pageId + '["\']', 'i').test(html),
    page.file + ': missing expected data-mp-page="' + page.pageId + '"'
  );
  check(includes(html, 'v1-assets/css/v1-main.css'), page.file + ': missing v1-main.css reference');
  check(includes(html, 'v1-assets/js/mp-shell.js'), page.file + ': missing mp-shell.js reference');

  page.hooks.forEach(function (hook) {
    check(includes(html, hook), page.file + ': missing critical hook ' + hook);
  });
});

requiredDataFiles.forEach(function (relPath) {
  check(exists(relPath), 'Missing generated data file: ' + relPath);
});

jsDataPathChecks.forEach(function (item) {
  check(exists(item.file), 'Missing JS runtime file: ' + item.file);
  if (!exists(item.file)) return;
  check(includes(read(item.file), item.expected), item.file + ': missing expected data path ' + item.expected);
});

var locales = readLocales();
var baselineKeys = Object.keys(locales.en || {});
['de', 'es', 'it', 'fr'].forEach(function (lang) {
  check(!!locales[lang], 'mp-locales.json: missing locale block ' + lang);
  if (!locales[lang]) return;

  baselineKeys.forEach(function (key) {
    check(
      Object.prototype.hasOwnProperty.call(locales[lang], key),
      'mp-locales.json: locale ' + lang + ' missing key ' + key
    );
  });
});

var staticHeadExpectations = [
  {
    file: 'index.html',
    titleKey: 'page.index.title'
  },
  {
    file: 'biography.html',
    titleKey: 'page.biography.title'
  },
  {
    file: 'repertoire.html',
    titleKey: 'page.repertoire.title'
  },
  {
    file: 'media.html',
    titleKey: 'page.media.title'
  },
  {
    file: 'reviews.html',
    titleKey: 'page.reviews.title',
    descriptionKey: 'page.reviews.metaDescription'
  }
];

staticHeadExpectations.forEach(function (item) {
  if (!exists(item.file)) return;
  var html = read(item.file);
  var expectedTitle = locales.en[item.titleKey];
  check(getTitle(html) === expectedTitle, item.file + ': <title> does not match locales.en.' + item.titleKey);
  check(
    getMetaContent(html, 'property', 'og:title') === expectedTitle,
    item.file + ': og:title does not match locales.en.' + item.titleKey
  );
  check(
    getMetaContent(html, 'name', 'twitter:title') === expectedTitle,
    item.file + ': twitter:title does not match locales.en.' + item.titleKey
  );

  if (item.descriptionKey) {
    var expectedDescription = locales.en[item.descriptionKey];
    check(
      getMetaContent(html, 'name', 'description') === expectedDescription,
      item.file + ': meta description does not match locales.en.' + item.descriptionKey
    );
    check(
      getMetaContent(html, 'property', 'og:description') === expectedDescription,
      item.file + ': og:description does not match locales.en.' + item.descriptionKey
    );
    check(
      getMetaContent(html, 'name', 'twitter:description') === expectedDescription,
      item.file + ': twitter:description does not match locales.en.' + item.descriptionKey
    );
  }
});

check(exists('robots.txt'), 'Missing robots.txt');
check(exists('sitemap.xml'), 'Missing sitemap.xml');

if (exists('robots.txt')) {
  var robots = read('robots.txt');
  check(includes(robots, 'Sitemap: https://rolandoguy.com/sitemap.xml'), 'robots.txt: missing sitemap reference');
}

if (exists('sitemap.xml')) {
  var sitemap = read('sitemap.xml');
  requiredHtmlPages.forEach(function (page) {
    if (page.file === 'reviews.html') return;
    var urlPath = page.file === 'index.html' ? 'https://rolandoguy.com/' : 'https://rolandoguy.com/' + page.file.replace(/\.html$/, '');
    check(includes(sitemap, '<loc>' + urlPath + '</loc>'), 'sitemap.xml: missing URL ' + urlPath);
  });
  check(!includes(sitemap, '<loc>https://rolandoguy.com/reviews</loc>'), 'sitemap.xml: reviews should stay out while reviews.html is intentionally noindex.');
}

if (failures.length) {
  console.error('[public-smoke] FAIL');
  failures.forEach(function (msg) {
    console.error(' - ' + msg);
  });
  console.error('[public-smoke] ' + failures.length + ' failure(s) across ' + checksRun + ' check(s).');
  process.exit(1);
}

console.log('[public-smoke] OK');
console.log('[public-smoke] ' + checksRun + ' checks passed.');
