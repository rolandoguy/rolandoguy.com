/**
 * Public-safe repertoire module for mp/repertoire.html.
 * This page renders from bundled public JSON with explicit public-safe Firestore docs layered on top.
 * Internal/admin docs must never be read directly here.
 */
(function () {
  'use strict';

  var MP_REP = null;
  var LIVE_REP_DOCS = {};
  var LIVE_REP_CARDS = null;

  function readLegacyJson(key) {
    return null;
  }
  function readLocalUnsyncedJson(key) {
    return null;
  }

  function fetchFirestoreDocJson(key) {
    if (typeof window.fetchMpPublicFirestoreDoc !== 'function') return Promise.resolve(null);
    return window.fetchMpPublicFirestoreDoc('public_' + key);
  }

  function ensureLiveRepDoc(key) {
    if (!key) return Promise.resolve(null);
    if (Object.prototype.hasOwnProperty.call(LIVE_REP_DOCS, key)) return Promise.resolve(LIVE_REP_DOCS[key]);
    return fetchFirestoreDocJson(key)
      .then(function (doc) {
        LIVE_REP_DOCS[key] = doc && doc.data && typeof doc.data === 'object' ? doc.data : null;
        return LIVE_REP_DOCS[key];
      })
      .catch(function () {
        LIVE_REP_DOCS[key] = null;
        return null;
      });
  }

  function ensureLiveRepertoireHeader(lang) {
    var L = String(lang || 'en').trim().toLowerCase();
    return ensureLiveRepDoc('rep_' + (/^(en|de|es|it|fr)$/.test(L) ? L : 'en'));
  }

  function ensureLiveRepertoireCards() {
    if (LIVE_REP_CARDS !== null) return Promise.resolve(LIVE_REP_CARDS);
    return fetchFirestoreDocJson('rg_rep_cards')
      .then(function (doc) {
        LIVE_REP_CARDS = doc && Array.isArray(doc.data) ? doc.data : null;
        return LIVE_REP_CARDS;
      })
      .catch(function () {
        LIVE_REP_CARDS = null;
        return null;
      });
  }

  function loadLiveRepertoireOverrides(lang) {
    var L = String(lang || 'en').trim().toLowerCase();
    var keys = ['rep_' + (/^(en|de|es|it|fr)$/.test(L) ? L : 'en')];
    if (L !== 'en') keys.push('rep_en');
    return Promise.all(keys.map(ensureLiveRepDoc).concat([ensureLiveRepertoireCards()]));
  }

  function mpPick(lang, key, fb) {
    var p = window.pickMpLocaleString;
    if (p) {
      var v = p(lang, key);
      if (v != null && String(v).trim() !== '') return v;
    }
    return fb;
  }

  function mpUiTable(lang, defaults) {
    var t = {};
    for (var k in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, k)) t[k] = mpPick(lang, k, defaults[k]);
    }
    return t;
  }

  /* EN fallbacks; localized via mp-locales.json */
  var MP_REP_UI_EN = {
    'rep.thRole': 'Role',
    'rep.thOpera': 'Opera / Work',
    'rep.thWork': 'Work',
    'rep.thWorkLied': 'Work',
    'rep.thComposer': 'Composer',
    'rep.status.all': 'All',
    'rep.status.performed': 'Performed',
    'rep.status.prepared': 'Prepared',
    'rep.status.studying': 'Studying',
    'rep.statusRow.performed': 'Performed',
    'rep.statusRow.prepared': 'Prepared',
    'rep.statusRow.studying': 'Studying',
    'rep.empty': 'No repertoire has been added yet for this category.',
    'rep.loadError': 'Repertoire data could not be loaded.',
    'rep.performanceHistory': 'Production history',
    'rep.performanceMoreInfo': 'More info',
    'rep.introLine': 'A selected overview of repertoire for stage, recital, and concert performance.',
    'rep.descOpera': 'Selected tenor roles from the operatic repertoire.',
    'rep.descArias': 'A curated selection of arias for concerts, gala programs, and auditions.',
    'rep.descOperetta': 'Representative works from the operetta repertoire, combining elegance, clarity, and theatrical style.',
    'rep.descLied': 'Recital repertoire for voice and piano from the German, French, and international song tradition.',
    'rep.descTango': 'Argentine tango repertoire performed with lyrical style, expressive depth and strong musical identity.'
  };

  var currentLang = 'en';
  var currentRepCategory = 'opera';
  var repSortBy = 'composer';
  var repSortDir = 'asc';
  var repStatusFilter = 'all';

  function uiTable() {
    return mpUiTable(currentLang, MP_REP_UI_EN);
  }

  function getEditorial(t) {
    t = t || uiTable();
    return {
      repIntroLine: t['rep.introLine'],
      repDescOpera: t['rep.descOpera'],
      repDescArias: t['rep.descArias'],
      repDescOperetta: t['rep.descOperetta'],
      repDescOperettaRoles: '',
      repDescLied: t['rep.descLied'],
      repDescTango: t['rep.descTango']
    };
  }

  function repEscapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function normalizeImagePlacement(value) {
    var v = String(value || '').trim();
    return /^(header_accent|between_intro_tabs|programme_offers_accent)$/.test(v) ? v : 'between_intro_tabs';
  }

  function applyRepImageFields(target, source) {
    if (!target || !source || typeof source !== 'object') return;
    [
      'repertoireImageEnabled',
      'repertoireImageUrl',
      'repertoireImageAlt',
      'repertoireImagePlacement',
      'repertoireImageAspect',
      'repertoireImageFit',
      'repertoireImagePosition',
      'repertoireImagePositionManual'
    ].forEach(function (key) {
      if (source[key] != null && String(source[key]).trim() !== '') target[key] = source[key];
      if (key === 'repertoireImageEnabled' && typeof source[key] === 'boolean') target[key] = source[key];
    });
  }

  function getRep() {
    var lang = currentLang || 'en';
    var base = MP_REP && MP_REP.rep ? MP_REP.rep : { h2: '', intro: '' };
    var liveRepCurrent = LIVE_REP_DOCS['rep_' + lang];
    var liveRepEn = lang !== 'en' ? LIVE_REP_DOCS.rep_en : null;
    if (liveRepCurrent && typeof liveRepCurrent === 'object') {
      if (liveRepCurrent.h2 != null && String(liveRepCurrent.h2).trim() !== '') {
        base.h2 = String(liveRepCurrent.h2);
      }
      if (liveRepCurrent.intro != null) base.intro = liveRepCurrent.intro;
      applyRepImageFields(base, liveRepCurrent);
    } else if (liveRepEn && typeof liveRepEn === 'object') {
      if (liveRepEn.h2 != null && String(liveRepEn.h2).trim() !== '') base.h2 = String(liveRepEn.h2);
      if (liveRepEn.intro != null) base.intro = liveRepEn.intro;
      applyRepImageFields(base, liveRepEn);
    }
    var langData = {
      h2: base.h2 != null ? String(base.h2) : '',
      intro: base.intro != null ? base.intro : ''
    };
    applyRepImageFields(langData, base);
    var hadLocH2 = false;
    if (
      MP_REP &&
      MP_REP.repLocales &&
      typeof MP_REP.repLocales[lang] === 'object' &&
      MP_REP.repLocales[lang]
    ) {
      var loc = MP_REP.repLocales[lang];
      if (loc.h2 != null && String(loc.h2).trim() !== '') {
        langData.h2 = String(loc.h2);
        hadLocH2 = true;
      }
      if (loc.intro != null) langData.intro = loc.intro;
      applyRepImageFields(langData, loc);
    }
    if (!hadLocH2) {
      var bundleH2 = mpPick(lang, 'rep.pageH2', '');
      if (bundleH2 != null && String(bundleH2).trim() !== '') langData.h2 = bundleH2;
    }
    var liveCards = Array.isArray(LIVE_REP_CARDS) ? LIVE_REP_CARDS : null;
    var legacyCards = readLegacyJson('rg_rep_cards');
    var rawCards = Array.isArray(liveCards)
      ? liveCards
      : Array.isArray(legacyCards)
      ? legacyCards
      : MP_REP && Array.isArray(MP_REP.cards)
        ? MP_REP.cards
        : [];
    var cards = rawCards.map(function (c) {
      var cat =
        c.cat === 'arias' ||
        c.cat === 'operetta' ||
        c.cat === 'operetta_roles' ||
        c.cat === 'lied' ||
        c.cat === 'tango'
          ? c.cat
          : 'opera';
      var category = cat === 'lied' ? c.category || 'Deutsches Lied' : c.category;
      var o = {};
      for (var k in c) {
        if (Object.prototype.hasOwnProperty.call(c, k)) o[k] = c[k];
      }
      o.cat = cat;
      o.category = category;
      return o;
    });
    return {
      h2: langData.h2,
      intro: langData.intro,
      repertoireImageEnabled: langData.repertoireImageEnabled === true,
      repertoireImageUrl: String(langData.repertoireImageUrl || '').trim(),
      repertoireImageAlt: String(langData.repertoireImageAlt || '').trim(),
      repertoireImagePlacement: normalizeImagePlacement(langData.repertoireImagePlacement),
      repertoireImageAspect: String(langData.repertoireImageAspect || 'landscape_16_9').trim(),
      repertoireImageFit: String(langData.repertoireImageFit || 'cover').trim() === 'contain' ? 'contain' : 'cover',
      repertoireImagePosition: String(langData.repertoireImagePosition || 'center center').trim(),
      repertoireImagePositionManual: String(langData.repertoireImagePositionManual || '').trim(),
      cards: cards
    };
  }

  function resolveImageObjectFit(value) {
    return String(value || '').trim().toLowerCase() === 'contain' ? 'contain' : 'cover';
  }

  function normalizeImageObjectPosition(value) {
    var raw = String(value || '').trim().replace(/\s+/g, ' ');
    if (!raw) return '';
    var lower = raw.toLowerCase();
    if (/^(center|left|right)\s+(center|top|bottom)$/.test(lower)) return lower;
    if (/^(top|bottom)\s+(center|left|right)$/.test(lower)) return lower;
    if (/^-?\d{1,3}(?:\.\d+)?%\s+-?\d{1,3}(?:\.\d+)?%$/.test(raw)) return raw;
    if (/^-?\d+(?:\.\d+)?(?:px|rem|em|vw|vh)\s+-?\d+(?:\.\d+)?(?:px|rem|em|vw|vh)$/.test(lower)) return lower;
    return '';
  }

  function resolveImageObjectPosition(manual, preset) {
    return normalizeImageObjectPosition(manual) || normalizeImageObjectPosition(preset) || 'center center';
  }

  function applyImageCrop(el, fit, manualPosition, presetPosition, variablePrefix) {
    if (!el) return;
    var resolvedFit = resolveImageObjectFit(fit);
    var resolvedPosition = resolveImageObjectPosition(manualPosition, presetPosition);
    el.style.setProperty('object-fit', resolvedFit, 'important');
    el.style.setProperty('object-position', resolvedPosition, 'important');
    if (el.parentNode && el.parentNode.style && variablePrefix) {
      el.parentNode.style.setProperty('--' + variablePrefix + '-image-fit', resolvedFit);
      el.parentNode.style.setProperty('--' + variablePrefix + '-image-position', resolvedPosition);
    }
  }

  function renderRepertoireImage(d) {
    var old = document.getElementById('repEditorialImage');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    if (!d || d.repertoireImageEnabled !== true || !d.repertoireImageUrl) return;
    var fig = document.createElement('figure');
    fig.id = 'repEditorialImage';
    fig.className = 'rep-editorial-image rep-editorial-image--' + d.repertoireImagePlacement;
    fig.setAttribute('data-image-aspect', d.repertoireImageAspect || 'landscape_16_9');
    var img = document.createElement('img');
    img.src = d.repertoireImageUrl;
    img.alt = d.repertoireImageAlt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    applyImageCrop(img, d.repertoireImageFit, d.repertoireImagePositionManual, d.repertoireImagePosition, 'rep');
    fig.appendChild(img);
    var placement = d.repertoireImagePlacement;
    var target = placement === 'programme_offers_accent'
      ? document.getElementById('programsGrid')
      : placement === 'header_accent'
        ? document.getElementById('rep-top-jump')
        : document.getElementById('repStatusFilters') || document.getElementById('operaGrid');
    if (target && target.parentNode) target.parentNode.insertBefore(fig, target);
  }

  function repCreditEntryHasContent(pc) {
    if (!pc || typeof pc !== 'object') return false;
    return ['year', 'venue', 'city', 'country', 'production', 'conductor', 'stageDirector', 'note', 'link'].some(function (k) {
      var v = pc[k];
      return v != null && String(v).trim() !== '';
    });
  }

  function repNormalizePerformanceCredits(card) {
    var raw = Array.isArray(card.performanceCredits) ? card.performanceCredits : [];
    return raw
      .filter(repCreditEntryHasContent)
      .map(function (pc) {
        return {
          year: String(pc.year || '').trim(),
          venue: String(pc.venue || '').trim(),
          city: String(pc.city || '').trim(),
          country: String(pc.country || '').trim(),
          production: String(pc.production || '').trim(),
          conductor: String(pc.conductor || '').trim(),
          stageDirector: String(pc.stageDirector || '').trim(),
          note: String(pc.note || '').trim(),
          link: String(pc.link || '').trim(),
          linkLabel: String(pc.linkLabel || '').trim()
        };
      })
      .filter(repCreditEntryHasContent);
  }

  function repSafeCreditHref(url) {
    var u = String(url || '').trim();
    if (!u) return '';
    var low = u.toLowerCase();
    if (low.indexOf('javascript:') === 0 || low.indexOf('data:') === 0 || low.indexOf('vbscript:') === 0) return '';
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u.replace(/^\/+/, '');
    return u;
  }

  function repAttrEscape(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function repFormatPerformanceCreditsBlock(card, t) {
    var list = repNormalizePerformanceCredits(card);
    if (!list.length) return '';
    var esc = function (s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    var historyLbl = esc(t['rep.performanceHistory'] || 'Production history');
    var moreInfo = esc(t['rep.performanceMoreInfo'] || 'More info');
    var body = list
      .map(function (pc) {
        var placeBits = [pc.year, pc.venue, pc.city, pc.country].filter(Boolean);
        var linePlace = placeBits.length
          ? '<div class="rep-pc-line rep-pc-place">' + esc(placeBits.join(' · ')) + '</div>'
          : '';
        var lineProd = pc.production ? '<div class="rep-pc-line">' + esc(pc.production) + '</div>' : '';
        var lineCond = pc.conductor ? '<div class="rep-pc-line rep-pc-muted">' + esc(pc.conductor) + '</div>' : '';
        var lineDir = pc.stageDirector ? '<div class="rep-pc-line rep-pc-muted">' + esc(pc.stageDirector) + '</div>' : '';
        var lineNote = pc.note ? '<div class="rep-pc-line rep-pc-note">' + esc(pc.note) + '</div>' : '';
        var linkH = repSafeCreditHref(pc.link);
        var linkHtml = '';
        if (linkH) {
          var lbl = pc.linkLabel ? esc(pc.linkLabel) : moreInfo;
          linkHtml =
            '<div class="rep-pc-line"><a class="rep-pc-link" href="' +
            repAttrEscape(linkH) +
            '" target="_blank" rel="noopener noreferrer">' +
            lbl +
            '</a></div>';
        }
        return '<div class="rep-pc-item">' + linePlace + lineProd + lineCond + lineDir + lineNote + linkHtml + '</div>';
      })
      .join('');
    return (
      '<details class="rep-pc-details"><summary class="rep-pc-summary">' +
      historyLbl +
      '</summary><div class="rep-pc-body">' +
      body +
      '</div></details>'
    );
  }

  function repObserveGridReveals() {
    var g = document.getElementById('operaGrid');
    if (!g) return;
    var repObs = new IntersectionObserver(
      function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    g.querySelectorAll('.reveal').forEach(function (el) {
      repObs.observe(el);
    });
  }

  function renderRep() {
    var d = getRep();
    renderRepertoireImage(d);
    var cat = currentRepCategory || 'opera';
    if (cat === 'operetta_roles') {
      currentRepCategory = 'opera';
      cat = 'opera';
    }
    var t = uiTable();
    var ed = getEditorial(t);
    var titleStackEl = document.getElementById('repTitleStack');
    var adjEl = document.getElementById('repTitleAdj');
    var mainEl = document.getElementById('repTitleMain');
    var titleAdj = mpPick(currentLang || 'en', 'rep.titlePrefix', 'Selected');
    var titleNoun = mpPick(currentLang || 'en', 'nav.rep', 'Repertoire');
    var isPostpositiveTitle = /^(es|it|fr)$/i.test(currentLang || 'en');
    if (titleStackEl) titleStackEl.classList.toggle('rep-title-stack--post', isPostpositiveTitle);
    if (adjEl && mainEl) {
      adjEl.textContent = titleAdj;
      mainEl.textContent = titleNoun;
    }
    var repIntroLineEl = document.getElementById('repIntroLine');
    if (repIntroLineEl) repIntroLineEl.textContent = ed.repIntroLine || '';
    var descMap = {
      opera: ed.repDescOpera,
      arias: ed.repDescArias,
      operetta: ed.repDescOperetta,
      operetta_roles: ed.repDescOperettaRoles || ed.repDescOperetta,
      lied: ed.repDescLied,
      tango: ed.repDescTango
    };
    var repIntroEl = document.getElementById('repIntro');
    if (repIntroEl) repIntroEl.textContent = descMap[cat] || '';
    var grid = document.getElementById('operaGrid');
    if (!grid) return;
    grid.innerHTML = '';

    var allCards = d.cards || [];
    var catCards = allCards
      .filter(function (c) {
        var hasContent =
          (c.composer && c.composer.trim()) || (c.opera && c.opera.trim()) || (c.role && c.role.trim());
        return hasContent && (c.cat || 'opera') === cat;
      })
      .slice();

    var isRoleRepTable = cat === 'opera' || cat === 'operetta_roles';
    if (isRoleRepTable && repStatusFilter !== 'all') {
      var wanted = repStatusFilter;
      catCards = catCards.filter(function (c) {
        return (c.status || '').toLowerCase() === wanted;
      });
    }

    catCards = catCards.sort(function (a, b) {
      var dir = repSortDir === 'asc' ? 1 : -1;
      function getStatusOrder(c) {
        var s = String(c.status || '').toLowerCase();
        if (s === 'performed') return 0;
        if (s === 'prepared') return 1;
        if (s === 'studying') return 2;
        return 3;
      }
      if (isRoleRepTable && repStatusFilter === 'all') {
        var sa = getStatusOrder(a);
        var sb = getStatusOrder(b);
        if (sa !== sb) return sa - sb;
      }
      var va = '';
      var vb = '';
      if (repSortBy === 'composer') {
        va = (a.composer || '').toLowerCase();
        vb = (b.composer || '').toLowerCase();
      } else if (repSortBy === 'opera') {
        va = (a.opera || '').toLowerCase();
        vb = (b.opera || '').toLowerCase();
      } else {
        va = (a.role || '').toLowerCase();
        vb = (b.role || '').toLowerCase();
      }
      if (va < vb) return -dir;
      if (va > vb) return dir;
      var ac = (a.composer || '').toLowerCase();
      var bc = (b.composer || '').toLowerCase();
      if (ac < bc) return -dir;
      if (ac > bc) return dir;
      var ao = (a.opera || '').toLowerCase();
      var bo = (b.opera || '').toLowerCase();
      if (ao < bo) return -dir;
      if (ao > bo) return dir;
      return 0;
    });

    if (!catCards.length) {
      var emptyMsg = t['rep.empty'] || 'No repertoire has been added yet for this category.';
      grid.innerHTML =
        '<div class="rep-empty" role="status">' +
        emptyMsg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
        '</div>';
      return;
    }

    var isOpera = isRoleRepTable;
    var filtersEl = document.getElementById('repStatusFilters');
    if (filtersEl) {
      filtersEl.style.display = isOpera ? 'flex' : 'none';
      var existingStudyingBtn = filtersEl.querySelector('[data-filter="studying"]');
      var hasStudyingInCat = catCards.some(function (c) {
        return String(c.status || '').toLowerCase() === 'studying';
      });
      if (hasStudyingInCat) {
        if (!existingStudyingBtn) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'rep-status-filter-btn';
          btn.setAttribute('data-filter', 'studying');
          btn.textContent = t['rep.status.studying'] || 'Studying';
          btn.onclick = function () {
            setRepStatusFilter('studying');
          };
          filtersEl.appendChild(btn);
        }
      } else if (existingStudyingBtn) {
        existingStudyingBtn.remove();
      }
      document.querySelectorAll('.rep-status-filter-btn').forEach(function (btn) {
        var val = btn.getAttribute('data-filter');
        btn.classList.toggle('active', val === repStatusFilter);
      });
    }

    var thWork =
      cat === 'lied'
        ? t['rep.thWorkLied'] || t['rep.thWork'] || 'Work'
        : isOpera
          ? t['rep.thOpera'] || 'Opera'
          : t['rep.thWork'] || 'Work';
    var sortRole = (t['rep.sortByRole'] || 'Sort by role').replace(/"/g, '&quot;');
    var sortWork = (t['rep.sortByWork'] || 'Sort by work').replace(/"/g, '&quot;');
    var sortComposer = (t['rep.sortByComposer'] || 'Sort by composer').replace(/"/g, '&quot;');
    var tableHead = isOpera
      ? '<thead><tr>' +
        '<th class="rep-th-sort" onclick="setRepSort(\'role\')" title="' +
        sortRole +
        '">' +
        (t['rep.thRole'] || 'Role') +
        '</th>' +
        '<th class="rep-th-sort" onclick="setRepSort(\'opera\')" title="' +
        sortWork +
        '">' +
        thWork +
        '</th>' +
        '<th class="rep-th-sort" onclick="setRepSort(\'composer\')" title="' +
        sortComposer +
        '">' +
        (t['rep.thComposer'] || 'Composer') +
        '</th>' +
        '</tr></thead>'
      : '<thead><tr>' +
        '<th class="rep-th-sort" onclick="setRepSort(\'opera\')" title="' +
        sortWork +
        '">' +
        thWork +
        '</th>' +
        '<th class="rep-th-sort" onclick="setRepSort(\'composer\')" title="' +
        sortComposer +
        '">' +
        (t['rep.thComposer'] || 'Composer') +
        '</th>' +
        '</tr></thead>';

    var esc = function (s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    var statusBadge = function (card) {
      var s = String(card.status || '').toLowerCase();
      if (s === 'performed')
        return (
          '<span class="rep-status rep-status-performed">' +
          (t['rep.statusRow.performed'] || t['rep.status.performed'] || 'Performed') +
          '</span>'
        );
      if (s === 'prepared')
        return (
          '<span class="rep-status rep-status-prepared">' +
          (t['rep.statusRow.prepared'] || t['rep.status.prepared'] || 'Prepared') +
          '</span>'
        );
      if (s === 'studying')
        return (
          '<span class="rep-status rep-status-studying">' +
          (t['rep.statusRow.studying'] || t['rep.status.studying'] || 'Studying') +
          '</span>'
        );
      return '';
    };
    var row = function (card) {
      var pcBlock = repFormatPerformanceCreditsBlock(card, t);
      return isOpera
        ? '<tr><td class="rep-cell-role">' +
            esc(card.role) +
            ' ' +
            statusBadge(card) +
            pcBlock +
            '</td><td class="rep-cell-work">' +
            esc(card.opera) +
            '</td><td class="rep-cell-composer">' +
            esc(card.composer) +
            '</td></tr>'
        : '<tr><td class="rep-cell-work">' +
            esc(card.opera) +
            pcBlock +
            '</td><td class="rep-cell-composer">' +
            esc(card.composer) +
            '</td></tr>';
    };

    if (cat === 'lied') {
      var categoryOrder = [
        'Deutsches Lied',
        'Italian Art Song & Canzone',
        'Canción de Arte Argentina',
        'Russian Art Song',
        'English Art Song'
      ];
      var groups = {};
      catCards.forEach(function (card) {
        var key = card.category || 'Deutsches Lied';
        if (!groups[key]) groups[key] = [];
        groups[key].push(card);
      });
      var html = '<div class="rep-category">';
      categoryOrder.forEach(function (catName) {
        var list = groups[catName];
        if (!list || !list.length) return;
        html +=
          '<h3 class="rep-category-subtitle">' +
          esc(catName) +
          '</h3><table class="rep-table">' +
          tableHead +
          '<tbody>' +
          list.map(row).join('') +
          '</tbody></table>';
      });
      html += '</div>';
      grid.innerHTML = html;
    } else {
      grid.innerHTML =
        '<div class="rep-category"><table class="rep-table">' +
        tableHead +
        '<tbody>' +
        catCards.map(row).join('') +
        '</tbody></table></div>';
    }

    repObserveGridReveals();
  }

  function setRepCategory(cat) {
    currentRepCategory = cat;
    document.querySelectorAll('.rep-tab').forEach(function (btn) {
      if (!btn.id) return;
      var id = btn.id;
      var isActive =
        (cat === 'opera' && id === 'repTabOpera') ||
        (cat === 'arias' && id === 'repTabArias') ||
        (cat === 'operetta' && id === 'repTabOperetta') ||
        (cat === 'operetta_roles' && id === 'repTabOperettaRoles') ||
        (cat === 'lied' && id === 'repTabLied');
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (cat !== 'opera' && cat !== 'operetta_roles') repStatusFilter = 'all';
    var buttons = document.querySelectorAll('.rep-status-filter-btn');
    buttons.forEach(function (btn) {
      var val = btn.getAttribute('data-filter');
      btn.classList.toggle('active', val === repStatusFilter);
    });
    renderRep();
  }

  function setRepSort(col) {
    if (repSortBy === col) repSortDir = repSortDir === 'asc' ? 'desc' : 'asc';
    else {
      repSortBy = col;
      repSortDir = 'asc';
    }
    renderRep();
  }

  function setRepStatusFilter(filter) {
    repStatusFilter = filter || 'all';
    document.querySelectorAll('.rep-status-filter-btn').forEach(function (btn) {
      var val = btn.getAttribute('data-filter');
      btn.classList.toggle('active', val === repStatusFilter);
    });
    renderRep();
  }

  window.setRepCategory = setRepCategory;
  window.setRepSort = setRepSort;
  window.setRepStatusFilter = setRepStatusFilter;

  window.addEventListener('mp:langchange', function (e) {
    currentLang = (e.detail && e.detail.lang) || 'en';
    loadLiveRepertoireOverrides(currentLang).finally(function () {
      if (MP_REP) renderRep();
    });
  });

  window.addEventListener('mp:localesready', function () {
    if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
    loadLiveRepertoireOverrides(currentLang).finally(function () {
      if (MP_REP) renderRep();
    });
  });

  fetch('/v1-assets/data/repertoire-data.json', { cache: 'no-store' })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      MP_REP = data;
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      return loadLiveRepertoireOverrides(currentLang).finally(function () {
        renderRep();
      });
    })
    .catch(function () {
      MP_REP = { rep: {}, cards: [] };
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      if (Array.isArray(LIVE_REP_CARDS) && LIVE_REP_CARDS.length) {
        renderRep();
        return;
      }
      var grid = document.getElementById('operaGrid');
      var msg = mpPick(currentLang || 'en', 'rep.loadError', 'Repertoire data could not be loaded.');
      if (grid) {
        grid.innerHTML =
          '<div class="rep-empty" role="status">' +
          msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
          '</div>';
      }
    });
})();
