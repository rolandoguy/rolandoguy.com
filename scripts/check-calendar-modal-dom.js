#!/usr/bin/env node
'use strict';

var fs = require('fs');
var http = require('http');
var path = require('path');
var childProcess = require('child_process');

var root = path.resolve(__dirname, '..');
var calendarDataPath = path.join(root, 'v1-assets/data/calendar-data.json');
var calendarJsPath = path.join(root, 'v1-assets/js/mp-calendar.js');
var cssPath = path.join(root, 'v1-assets/css/v1-main.css');
var calendarData = JSON.parse(fs.readFileSync(calendarDataPath, 'utf8'));
var tango = (calendarData.perfs || []).find(function (event) {
  return event && (event.id === 'perf-11' || /tango tenors/i.test(event.title || ''));
});

if (!tango) {
  console.error('[calendar-modal-dom] Tango Tenors event not found in calendar-data.json');
  process.exit(1);
}

var fixture = {
  perf: {
    eventTypes: { concert: 'Konzert', tango: 'Tango' },
    calendarEmpty: 'Leer',
    pastDividerSelected: 'Vergangene Auftritte',
    printSubtitle: 'Kalender'
  },
  perfs: [
    tango,
    Object.assign({}, tango, {
      id: 'editorial-test',
      moreInfoDisplayMode: 'editorial-template',
      moreInfoTemplate: 'solo'
    }),
    {
      id: 'private-test',
      day: '01',
      month: 'JAN',
      time: '20:00',
      title: 'Private Test',
      type: 'private',
      private: true,
      venue: 'Secret Venue',
      city: 'Berlin',
      address: 'Hidden Street 1',
      ticketPrice: '99',
      eventLink: 'https://example.com/private',
      eventLinkLabel: 'Private Tickets',
      mapsUrl: 'https://maps.example/private'
    }
  ],
  pastPerfs: []
};

function htmlEscapeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

var html = '<!doctype html><html lang="de"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<link rel="stylesheet" href="/v1-assets/css/v1-main.css">' +
  '<script>window.__CAL_FIXTURE__=' + htmlEscapeScriptJson(fixture) + ';' +
  'window.getMpSiteLang=function(){return "de"};' +
  'window.pickMpLocaleString=function(lang,key){var d={"perf.maps":"Karte / Route","perf.moreInfo":"Mehr Info","perf.modalTicketsLead":"Tickets:","perf.privateEventType":"Private Veranstaltung","perf.privateDetail":"Private Veranstaltung"};return d[key]||""};' +
  'window.fetchMpPublicFirestoreDoc=function(key){if(key==="public_rg_perfs")return Promise.resolve({data:window.__CAL_FIXTURE__.perfs});if(key==="public_rg_past_perfs")return Promise.resolve({data:[]});if(/^public_perf_/.test(key))return Promise.resolve({data:window.__CAL_FIXTURE__.perf});return Promise.resolve(null)};' +
  'window.fetch=function(url){if(String(url).indexOf("/v1-assets/data/calendar-data.json")>=0)return Promise.resolve({ok:true,json:function(){return Promise.resolve(window.__CAL_FIXTURE__)}});return Promise.reject(new Error("unexpected fetch "+url))};' +
  '</script></head><body data-mp-page="calendar">' +
  '<div id="perfList"></div><button id="pastPerfCollapseBtn"></button><div id="pastPerfListWrap"></div><div id="pastPerfList"></div><div id="pastPerformancesSection"></div><script id="eventSchemaJson" type="application/ld+json"></script>' +
  '<div id="eventModal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="emTitle" style="display:none;position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.92);overflow-y:auto;cursor:default">' +
  '<div id="eventModalShell" class="event-modal-shell" style="max-width:640px;margin:60px auto;padding:40px 32px;position:relative">' +
  '<button id="eventModalClose" type="button">&times;</button><div id="emVenueImg" style="display:none"></div><div id="emType"></div><h3 id="emTitle"></h3><div id="emDate"></div><div id="emVenue"></div><div id="emAddress" style="display:none"></div><div id="emEditorial" class="event-modal-editorial" style="display:none"></div><div id="emDetail"></div><div id="emExtDesc" style="display:none"></div><img id="emFlyerImg" style="display:none"><div id="emPrice" style="display:none"><span>Tickets:</span><span id="emPriceVal"></span></div><div id="emActions" style="display:flex;gap:12px;flex-wrap:wrap"><a id="emEventLink" href="#" target="_blank" rel="noopener" class="btn-primary" style="display:none">Tickets & Info</a><a id="emMapsLink" href="#" target="_blank" rel="noopener" class="btn-secondary" style="display:none"><span aria-hidden="true">Pin </span><span id="emMapsText">Maps</span></a></div>' +
  '</div></div><pre id="result">pending</pre><script src="/v1-assets/js/mp-calendar.js"></script><script>' +
  'function visible(id){var el=document.getElementById(id);if(!el)return false;var cs=getComputedStyle(el);return cs.display!=="none"&&cs.visibility!=="hidden"&&cs.opacity!=="0"}' +
  'function collect(){return{venueVisible:visible("emVenue"),venueText:document.getElementById("emVenue").textContent.trim(),venueMarginBottom:document.getElementById("emVenue").style.marginBottom,descriptionVisible:visible("emDetail"),descriptionText:document.getElementById("emDetail").textContent.trim(),priceVisible:visible("emPrice"),priceDisplay:getComputedStyle(document.getElementById("emPrice")).display,priceText:document.getElementById("emPriceVal").textContent.trim(),primaryCtaVisible:visible("emEventLink"),primaryCtaDisplay:getComputedStyle(document.getElementById("emEventLink")).display,primaryCtaText:document.getElementById("emEventLink").textContent.trim(),primaryCtaHref:document.getElementById("emEventLink").href,mapCtaVisible:visible("emMapsLink"),mapCtaDisplay:getComputedStyle(document.getElementById("emMapsLink")).display,mapCtaText:document.getElementById("emMapsText").textContent.trim(),addressVisible:visible("emAddress"),addressText:document.getElementById("emAddress").textContent.trim(),addressMargin:document.getElementById("emAddress").style.margin}}' +
  'setTimeout(function(){window.openEventModal("perf-11");var publicResult=collect();window.openEventModal("editorial-test");var editorialResult=collect();window.openEventModal("private-test");var privateResult=collect();document.getElementById("result").textContent="RESULT_JSON:"+JSON.stringify({publicResult:publicResult,editorialResult:editorialResult,privateResult:privateResult},null,2)},1200);' +
  '</script></body></html>';

function findChrome() {
  var candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome',
    'chromium',
    'chromium-browser'
  ].filter(Boolean);
  for (var i = 0; i < candidates.length; i++) {
    var candidate = candidates[i];
    if (candidate.indexOf('/') >= 0 && fs.existsSync(candidate)) return candidate;
    if (candidate.indexOf('/') < 0) {
      var probe = childProcess.spawnSync('sh', ['-lc', 'command -v ' + candidate], { encoding: 'utf8' });
      if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
    }
  }
  return '';
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

var server = http.createServer(function (req, res) {
  if (req.url === '/modal-computed-test.html') {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(html);
    return;
  }
  if (req.url === '/v1-assets/js/mp-calendar.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });
    res.end(fs.readFileSync(calendarJsPath));
    return;
  }
  if (req.url === '/v1-assets/css/v1-main.css') {
    res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
    res.end(fs.readFileSync(cssPath));
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(0, '127.0.0.1', function () {
  var chrome = findChrome();
  if (!chrome) {
    server.close();
    console.error('[calendar-modal-dom] Chrome/Chromium not found; set CHROME_BIN to run this check.');
    process.exit(1);
  }
  var port = server.address().port;
  var child = childProcess.spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-sync',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/rg-calendar-modal-dom',
    '--virtual-time-budget=5000',
    '--dump-dom',
    'http://127.0.0.1:' + port + '/modal-computed-test.html'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  var stdout = '';
  var stderr = '';
  var settled = false;
  child.stdout.on('data', function (chunk) { stdout += chunk.toString(); });
  child.stderr.on('data', function (chunk) { stderr += chunk.toString(); });

  function finish() {
    if (settled) return;
    settled = true;
    server.close();
    var match = String(stdout || '').match(/RESULT_JSON:(\{[\s\S]*?\})\s*<\/pre>/);
    try {
      assert(match, 'Headless modal result was not found in dumped DOM' + (stderr ? '\n' + stderr : ''));
      var payload = JSON.parse(match[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
      var publicResult = payload.publicResult;
      var editorialResult = payload.editorialResult;
      var privateResult = payload.privateResult;

      assert(publicResult.venueVisible, 'Tango Tenors venue is not visible');
      assert(publicResult.venueText === 'Cl\u00e4rchens \u00b7 Berlin', 'Tango Tenors venue text is wrong');
      assert(publicResult.descriptionVisible, 'Tango Tenors description is not visibly rendered');
      assert(publicResult.descriptionText.indexOf('Tango Tenors is a concert programme') >= 0, 'Tango Tenors description text is wrong');
      assert(publicResult.priceVisible, 'Tango Tenors price is not visibly rendered');
      assert(publicResult.priceText === '20\u20ac / 15\u20ac reduced', 'Tango Tenors price text is wrong');
      assert(publicResult.primaryCtaVisible, 'Tango Tenors primary CTA is not visible');
      assert(publicResult.primaryCtaText === 'Tickets & Info', 'Tango Tenors primary CTA label is wrong');
      assert(publicResult.primaryCtaHref === 'https://claerchensball.haus/programm/', 'Tango Tenors primary CTA URL is wrong');
      assert(publicResult.mapCtaVisible, 'Tango Tenors map CTA is not visible');
      assert(publicResult.mapCtaText === 'Karte / Route', 'Tango Tenors map CTA label is wrong');
      assert(publicResult.addressVisible, 'Tango Tenors address is not visible');
      assert(publicResult.addressText === 'Auguststra\u00dfe 24, 10117 Berlin', 'Tango Tenors address text is wrong');
      assert(publicResult.venueMarginBottom === '6px', 'Tango Tenors venue/address spacing is wrong');
      assert(publicResult.addressMargin === '-14px 0px 24px', 'Tango Tenors address margin is wrong');
      assert(editorialResult.venueVisible, 'Editorial public event venue is not visible');
      assert(editorialResult.venueText === 'Cl\u00e4rchens \u00b7 Berlin', 'Editorial public event venue text is wrong');
      assert(editorialResult.addressVisible, 'Editorial public event address is not visible');
      assert(editorialResult.addressText === 'Auguststra\u00dfe 24, 10117 Berlin', 'Editorial public event address text is wrong');
      assert(editorialResult.venueMarginBottom === '6px', 'Editorial public event venue/address spacing is wrong');
      assert(editorialResult.addressMargin === '-14px 0px 24px', 'Editorial public event address margin is wrong');
      assert(!privateResult.addressVisible, 'Private event address is visible');
      assert(!privateResult.priceVisible, 'Private event price is visible');
      assert(!privateResult.primaryCtaVisible, 'Private event primary CTA is visible');
      assert(!privateResult.mapCtaVisible, 'Private event map CTA is visible');

      console.log('[calendar-modal-dom] OK');
      console.log(JSON.stringify({
        venueVisible: publicResult.venueVisible,
        venueText: publicResult.venueText,
        descriptionVisible: publicResult.descriptionVisible,
        priceVisible: publicResult.priceVisible,
        priceDisplay: publicResult.priceDisplay,
        priceText: publicResult.priceText,
        primaryCtaVisible: publicResult.primaryCtaVisible,
        primaryCtaDisplay: publicResult.primaryCtaDisplay,
        primaryCtaText: publicResult.primaryCtaText,
        primaryCtaHref: publicResult.primaryCtaHref,
        mapCtaVisible: publicResult.mapCtaVisible,
        mapCtaDisplay: publicResult.mapCtaDisplay,
        mapCtaText: publicResult.mapCtaText,
        addressVisible: publicResult.addressVisible,
        addressText: publicResult.addressText,
        venueMarginBottom: publicResult.venueMarginBottom,
        addressMargin: publicResult.addressMargin,
        editorialVenueVisible: editorialResult.venueVisible,
        editorialAddressVisible: editorialResult.addressVisible,
        editorialVenueMarginBottom: editorialResult.venueMarginBottom,
        editorialAddressMargin: editorialResult.addressMargin,
        privateAddressVisible: privateResult.addressVisible,
        privatePriceVisible: privateResult.priceVisible,
        privatePrimaryCtaVisible: privateResult.primaryCtaVisible,
        privateMapCtaVisible: privateResult.mapCtaVisible
      }, null, 2));
    } catch (err) {
      console.error('[calendar-modal-dom] FAIL');
      console.error(err && err.message ? err.message : err);
      process.exitCode = 1;
    }
  }

  child.on('error', function (err) {
    server.close();
    throw err;
  });
  child.on('close', finish);
  setTimeout(function () {
    if (!settled) {
      try {
        child.kill('SIGTERM');
      } catch (e) {}
      setTimeout(finish, 500);
    }
  }, 8000);
});
