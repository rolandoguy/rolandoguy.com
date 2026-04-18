'use strict';

var fs = require('fs');
var https = require('https');
var path = require('path');
var filter = require('./lib/public-field-filter');

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
  { file: 'v1-assets/js/mp-shell.js', expected: '/v1-assets/data/mp-locales.json' },
  { file: 'v1-assets/js/mp-hero.js', expected: '/v1-assets/data/hero-config.json' },
  { file: 'v1-assets/js/mp-biography.js', expected: '/v1-assets/data/biography-data.json' },
  { file: 'v1-assets/js/mp-repertoire.js', expected: '/v1-assets/data/repertoire-data.json' },
  { file: 'v1-assets/js/mp-programs.js', expected: '/v1-assets/data/programs-data.json' },
  { file: 'v1-assets/js/mp-calendar.js', expected: '/v1-assets/data/calendar-data.json' },
  { file: 'v1-assets/js/mp-media.js', expected: '/v1-assets/data/media-data.json' },
  { file: 'v1-assets/js/mp-press.js', expected: '/v1-assets/data/press-data.json' },
  { file: 'v1-assets/js/mp-contact.js', expected: '/v1-assets/data/contact-data.json' }
];

var failures = [];
var warnings = [];
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

function checkMetadata(condition, message) {
  checksRun += 1;
  if (!condition) warnings.push(message);
}

function includes(text, snippet) {
  return text.indexOf(snippet) !== -1;
}

function shouldCheckLiveUiOverrides() {
  return /^(1|true|yes)$/i.test(String(process.env.PUBLIC_SMOKE_FIRESTORE_UI_DRIFT || '').trim());
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

function fetchJson(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function checkLiveUiOverrideParity(locales) {
  var langs = ['de', 'es', 'it', 'fr'];
  for (var i = 0; i < langs.length; i += 1) {
    var lang = langs[i];
    var url = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/' + encodeURIComponent('rg_ui_' + lang);
    try {
      var doc = await fetchJson(url);
      var raw = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
      if (!raw) continue;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') continue;
      if (typeof parsed['nav.media'] === 'string' && parsed['nav.media'].trim()) {
        check(
          parsed['nav.media'].trim() === locales[lang]['nav.media'],
          'live rg_ui_' + lang + ': nav.media differs from bundled locale value'
        );
      }
    } catch (err) {
      check(false, 'live Firestore UI check failed for rg_ui_' + lang + ': ' + err.message);
    }
  }
}

async function main() {
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
      titleKey: 'page.media.title',
      descriptionKey: 'page.media.metaDescription'
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
    checkMetadata(getTitle(html) === expectedTitle, item.file + ': <title> does not match locales.en.' + item.titleKey);
    checkMetadata(
      getMetaContent(html, 'property', 'og:title') === expectedTitle,
      item.file + ': og:title does not match locales.en.' + item.titleKey
    );
    checkMetadata(
      getMetaContent(html, 'name', 'twitter:title') === expectedTitle,
      item.file + ': twitter:title does not match locales.en.' + item.titleKey
    );

    if (item.descriptionKey) {
      var expectedDescription = locales.en[item.descriptionKey];
      checkMetadata(
        getMetaContent(html, 'name', 'description') === expectedDescription,
        item.file + ': meta description does not match locales.en.' + item.descriptionKey
      );
      checkMetadata(
        getMetaContent(html, 'property', 'og:description') === expectedDescription,
        item.file + ': og:description does not match locales.en.' + item.descriptionKey
      );
      checkMetadata(
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

  if (shouldCheckLiveUiOverrides()) {
    await checkLiveUiOverrideParity(locales);
  }

  // Security validation: check public JSON files for internal field leakage
  var publicJsonFiles = [
    'v1-assets/data/biography-data.json',
    'v1-assets/data/calendar-data.json',
    'v1-assets/data/contact-data.json',
    'v1-assets/data/media-data.json',
    'v1-assets/data/press-data.json',
    'v1-assets/data/repertoire-data.json',
    'v1-assets/data/programs-data.json'
  ];

  publicJsonFiles.forEach(function (relPath) {
    if (!exists(relPath)) return;
    try {
      var raw = read(relPath);
      var payload = JSON.parse(raw);
      var violations = filter.detectInternalFields(payload, relPath);
      if (violations.length > 0) {
        failures.push('SECURITY: ' + relPath + ' contains internal fields: ' + violations.join(', '));
      }
    } catch (err) {
      failures.push('SECURITY: failed to validate ' + relPath + ': ' + err.message);
    }
  });

  if (failures.length) {
    console.error('[public-smoke] FAIL');
    failures.forEach(function (msg) {
      console.error(' - ' + msg);
    });
    console.error('[public-smoke] ' + failures.length + ' blocking failure(s) across ' + checksRun + ' check(s).');
    if (warnings.length) {
      console.warn('[public-smoke] ' + warnings.length + ' metadata warning(s) also present:');
      warnings.forEach(function (msg) {
        console.warn(' - ' + msg);
      });
    }
    process.exit(1);
  }

  console.log('[public-smoke] OK');
  console.log('[public-smoke] ' + checksRun + ' checks.');
  if (warnings.length) {
    console.warn('[public-smoke] ' + warnings.length + ' metadata warning(s) (non-blocking):');
    warnings.forEach(function (msg) {
      console.warn(' - ' + msg);
    });
  }
}

main().catch(function (err) {
  console.error('[public-smoke] FAIL');
  console.error(' - ' + (err && err.message ? err.message : String(err)));
  process.exit(1);
});
