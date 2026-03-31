/**
 * Programs section for mp/repertoire.html.
 * Source: /v1-assets/data/programs-data.json (derived from v1 LANG_CONTENT/DEFAULTS programs payload).
 */
(function () {
  'use strict';

  var MP_PROGRAMS = null;
  var currentLang = 'en';

  var UI = {
    en: { sectionTag: 'Programs', formations: 'Format', duration: 'Duration', idealFor: 'Ideal for' },
    de: { sectionTag: 'Programme', formations: 'Besetzung', duration: 'Dauer', idealFor: 'Geeignet für' },
    es: { sectionTag: 'Programas', formations: 'Formato', duration: 'Duración', idealFor: 'Ideal para' },
    it: { sectionTag: 'Programmi', formations: 'Formazione', duration: 'Durata', idealFor: 'Ideale per' },
    fr: { sectionTag: 'Programmes', formations: 'Format', duration: 'Durée', idealFor: 'Idéal pour' }
  };

  function t(lang) {
    return UI[lang] || UI.en;
  }

  function getProgramsPayload(lang) {
    var l = (lang || 'en').toLowerCase();
    if (MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales[l]) return MP_PROGRAMS.locales[l];
    if (MP_PROGRAMS && MP_PROGRAMS.locales && MP_PROGRAMS.locales.en) return MP_PROGRAMS.locales.en;
    return null;
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderPrograms() {
    var data = getProgramsPayload(currentLang);
    if (!data) return;
    var ui = t(currentLang);

    var sectionTag = document.getElementById('programsSectionTag');
    var h2 = document.getElementById('programsH2');
    var subtitle = document.getElementById('programsSubtitle');
    var bridge = document.getElementById('programsProfileBridge');
    var intro = document.getElementById('programsIntro');
    var grid = document.getElementById('programsGrid');
    var closing = document.getElementById('programsClosing');
    var repLink = document.getElementById('repProgramsLink');

    if (sectionTag) sectionTag.textContent = ui.sectionTag;
    if (h2) h2.innerHTML = String(data.title || '');
    if (subtitle) subtitle.textContent = String(data.subtitle || '');
    if (bridge) {
      var b = String(data.profileBridge || '').trim();
      bridge.textContent = b;
      bridge.hidden = !b;
    }
    if (intro) intro.textContent = String(data.intro || '');
    if (closing) closing.textContent = String(data.closingNote || '');
    if (repLink) repLink.textContent = String(data.linkLabel || repLink.textContent || '');

    if (!grid) return;
    var programs = Array.isArray(data.items) ? data.items : [];
    if (!programs.length) {
      var en = getProgramsPayload('en');
      programs = en && Array.isArray(en.items) ? en.items : [];
    }
    var visible = programs
      .filter(function (p) { return p && p.published !== false; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    if (!visible.length) {
      grid.innerHTML = '<div class="rep-empty" role="status">No programmes available.</div>';
      return;
    }

    grid.innerHTML = visible
      .map(function (p) {
        var forms = Array.isArray(p.formations) ? p.formations : [];
        var ideal = Array.isArray(p.idealFor) ? p.idealFor : [];
        return (
          '<article class="program-card reveal visible">' +
          '<h3 class="program-card-title">' + esc(p.title) + '</h3>' +
          '<p class="program-card-desc">' + esc(p.description) + '</p>' +
          '<div class="program-meta">' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.formations) + '</div><div class="program-meta-value"><ul>' +
          forms.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') +
          '</ul></div></div>' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.duration) + '</div><div class="program-meta-value">' + esc(p.duration || '') + '</div></div>' +
          '<div class="program-meta-block"><div class="program-meta-label">' + esc(ui.idealFor) + '</div><div class="program-meta-value"><ul>' +
          ideal.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') +
          '</ul></div></div>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');
  }

  window.addEventListener('mp:langchange', function (e) {
    currentLang = (e.detail && e.detail.lang) || 'en';
    if (MP_PROGRAMS) renderPrograms();
  });

  window.addEventListener('mp:localesready', function () {
    if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
    if (MP_PROGRAMS) renderPrograms();
  });

  fetch('/v1-assets/data/programs-data.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(function (data) {
      MP_PROGRAMS = data;
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      renderPrograms();
    })
    .catch(function () {});
})();
