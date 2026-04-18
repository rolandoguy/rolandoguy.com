/**
 * Public-safe videos + photos module for mp/media.html.
 * Data comes only from /v1-assets/data/media-data.json, which is the public-safe export layer.
 * Legacy admin docs, Firestore reads, and local draft fallbacks are disabled on the public site.
 */
(function () {
  'use strict';

  var MP_MEDIA = null;
  var currentLang = 'en';
  var photoSectionObserverBound = false;
  var videoSectionObserverBound = false;
  var mediaSectionObserverBound = false;
  var photoManualTabUntil = 0;
  var photoManualTarget = '';

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

  var MP_MEDIA_UI_EN = {
    'vid.brand': 'Rolando Guy · Lyric Tenor',
    'vid.cat.opera_operetta': 'Opera · Operetta',
    'vid.cat.recital_lied': 'Recital · Lied',
    'vid.cat.sacred_oratorio': 'Sacred / Oratorio',
    'vid.cat.tango': 'Tango',
    'vid.repCat.opera': 'Opera',
    'vid.repCat.operetta': 'Operetta',
    'vid.repCat.lied': 'Lied & art song',
    'vid.repCat.concert_sacred': 'Concert & sacred',
    'vid.repCat.tango': 'Tango',
    'vid.repCat.crossover': 'Crossover',
    'vid.showMore': '+ Show More Videos',
    'vid.showLess': '\u2212 Show Less',
    'vid.embedUnavailable': 'Video player unavailable',
    'vid.openYoutube': 'Open on YouTube',
    'aud.embedUnavailable': 'Audio player unavailable',
    'aud.openExternal': 'Open listening link',
    'ui.featured': 'Featured',
    'ui.close': 'Close \u2715',
    'ui.closeEmbed': '\u00d7 Close',
    'ui.closeVideoAria': 'Close video'
  };

  function uiTable(lang) {
    var L = lang || currentLang || 'en';
    return mpUiTable(L, MP_MEDIA_UI_EN);
  }

  function effectiveUiText(lang, key) {
    var L = lang || currentLang || 'en';
    return mpPick(L, key, MP_MEDIA_UI_EN[key]);
  }

  function formatSectionTitleIfAmpersand(html, i18nKey) {
    var s = String(html || '');
    if (i18nKey === 'programs.sectionTag') return s;
    if (!s || /class=["']title-amp-stack["']/.test(s)) return s;
    var splitIdx = s.indexOf('&amp;');
    var ampLen = 5;
    if (splitIdx === -1) {
      var m = s.match(/&(?!amp;|#?[0-9a-z]+;)/i);
      if (!m || m.index == null) return s;
      splitIdx = m.index;
      ampLen = 1;
    }
    var left = s.slice(0, splitIdx);
    var right = s.slice(splitIdx + ampLen);
    left = left.replace(/<br\s*\/?>(\s*)/gi, ' ').replace(/&nbsp;/gi, ' ').trim();
    right = right.replace(/^(\s|<br\s*\/?>|&nbsp;)+/i, '').trim();
    var leftText = left.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    var esc = function (t) {
      return String(t)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };
    return (
      '<span class="title-amp-stack"><span class="title-line1">' +
      esc(leftText) +
      '</span><span class="title-line2"><span class="title-amp">&amp;</span> ' +
      right +
      '</span></span>'
    );
  }

  function withTitleEmphasisVid(vidH2) {
    var raw = String(vidH2 || '').trim();
    return formatSectionTitleIfAmpersand(raw);
  }

  function getVid() {
    return MP_MEDIA && MP_MEDIA.vid && typeof MP_MEDIA.vid === 'object'
      ? MP_MEDIA.vid
      : { h2: '', videos: [] };
  }
  function getAudio() {
    return MP_MEDIA && MP_MEDIA.audio && typeof MP_MEDIA.audio === 'object'
      ? MP_MEDIA.audio
      : { h2: '', sub: '', items: [] };
  }
  function parseLocalJson(key) {
    return null;
  }
  function readLocalUnsyncedJson(key) {
    var wrapped = parseLocalJson('rg_local_' + key);
    if (wrapped && typeof wrapped === 'object' && wrapped.value != null && typeof wrapped.value === 'object') {
      return wrapped.value;
    }
    return null;
  }
  function readLegacyJson(key) {
    var direct = parseLocalJson(key);
    if (direct && typeof direct === 'object') {
      if (direct.value != null && typeof direct.value === 'object') return direct.value;
      return direct;
    }
    var wrapped = readLocalUnsyncedJson(key);
    return wrapped && typeof wrapped === 'object' ? wrapped : null;
  }
  function pickLiveDocWithLocalPriority(key, firestoreDoc) {
    var localUnsynced = readLocalUnsyncedJson(key);
    if (localUnsynced && typeof localUnsynced === 'object') return localUnsynced;
    if (firestoreDoc && typeof firestoreDoc === 'object') return firestoreDoc;
    var legacy = readLegacyJson(key);
    return legacy && typeof legacy === 'object' ? legacy : null;
  }

  function resolvePhotoSrc(x) {
    if (x == null) return '';
    if (typeof x === 'string') return x;
    if (typeof x === 'object' && x.url != null) return String(x.url);
    return '';
  }
  function normalizePhotoEntry(x) {
    if (x == null) return null;
    var url = resolvePhotoSrc(x).trim();
    if (!url) return null;
    var orientation = '';
    var focus = '';
    if (typeof x === 'object') {
      orientation = String(x.orientation != null ? x.orientation : '').trim().toLowerCase();
      if (orientation !== 'portrait' && orientation !== 'landscape') orientation = '';
      focus = String(x.focus != null ? x.focus : x.objectPosition != null ? x.objectPosition : '').trim();
    }
    return { url: url, orientation: orientation, focus: focus };
  }
  function getPhotoEntries() {
    if (!MP_MEDIA || !MP_MEDIA.photos) return { s: [], t: [], b: [] };
    var p = MP_MEDIA.photos;
    function list(arr) {
      return (Array.isArray(arr) ? arr : []).map(normalizePhotoEntry).filter(Boolean);
    }
    return { s: list(p.s), t: list(p.t), b: list(p.b) };
  }

  function getPhotoPaths() {
    var entries = getPhotoEntries();
    return {
      s: entries.s.map(function (x) { return x.url; }),
      t: entries.t.map(function (x) { return x.url; }),
      b: entries.b.map(function (x) { return x.url; })
    };
  }

  function fetchFirestoreRgDoc(key) {
    return Promise.resolve(null);
  }

  function normalizeLivePhotosBlock(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var s = Array.isArray(raw.s) ? raw.s.map(normalizePhotoEntry).filter(Boolean) : [];
    var t = Array.isArray(raw.t) ? raw.t.map(normalizePhotoEntry).filter(Boolean) : [];
    var b = Array.isArray(raw.b) ? raw.b.map(normalizePhotoEntry).filter(Boolean) : [];
    if (!s.length && !t.length && !b.length) return null;
    return { s: s, t: t, b: b };
  }

  function normalizeLiveCaptions(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var out = {};
    for (var k in raw) {
      if (!Object.prototype.hasOwnProperty.call(raw, k)) continue;
      var v = raw[k];
      if (typeof v === 'string') {
        out[k] = { caption: v, alt: '', photographer: '' };
        continue;
      }
      if (v && typeof v === 'object') {
        out[k] = {
          caption: String(v.caption != null ? v.caption : ''),
          alt: String(v.alt != null ? v.alt : ''),
          photographer: String(v.photographer != null ? v.photographer : '')
        };
      }
    }
    return Object.keys(out).length ? out : null;
  }

  /** Same field shape as admin-v2 safeMediaVideos; returns null if no usable videos (keeps static JSON). */
  function normalizeLiveVidBlock(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var h2 = String(raw.h2 != null ? raw.h2 : '').trim();
    var arr = Array.isArray(raw.videos) ? raw.videos : [];
    var videos = arr
      .filter(function (v) {
        return v && typeof v === 'object' && !Array.isArray(v);
      })
      .map(function (v) {
        var group = String(v.group != null ? v.group : '').trim();
        var featuredVisual = typeof v.featured_visual === 'boolean' ? v.featured_visual : !!v.featured;
        var featuredLayout = typeof v.featured_layout === 'boolean' ? v.featured_layout : !!v.featured;
        var homepagePriority = Number(v.homepage_priority);
        return {
          id: String(v.id != null ? v.id : '').trim(),
          tag: String(v.tag != null ? v.tag : '').trim(),
          title: String(v.title != null ? v.title : '').trim(),
          sub: String(v.sub != null ? v.sub : '').trim(),
          composer: String(v.composer != null ? v.composer : '').trim(),
          repertoireCat: String(v.repertoireCat != null ? v.repertoireCat : '').trim(),
          hidden: !!v.hidden,
          group: group || 'opera_operetta',
          featured_visual: featuredVisual,
          featured_layout: featuredLayout,
          featured: featuredVisual,
          featured_contexts: normalizeFeaturedContexts(v.featured_contexts, {
            media: featuredVisual,
            homepage: featuredVisual,
            calendar: false
          }),
          homepage_priority: Number.isFinite(homepagePriority) && homepagePriority >= 0 ? Math.floor(homepagePriority) : null,
          customThumb: String(v.customThumb != null ? v.customThumb : '').trim(),
          editorialStatus: String(
            v.editorialStatus != null ? v.editorialStatus : v.hidden ? 'hidden' : 'draft'
          )
        };
      });
    if (!videos.length) return null;
    return { h2: h2, videos: videos };
  }
  function normalizeLiveAudioBlock(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var h2 = String(raw.h2 != null ? raw.h2 : '').trim();
    var sub = String(raw.sub != null ? raw.sub : '').trim();
    function firstNonBlank() {
      for (var i = 0; i < arguments.length; i += 1) {
        var v = String(arguments[i] != null ? arguments[i] : '').trim();
        if (v) return v;
      }
      return '';
    }
    var arr = Array.isArray(raw.items) ? raw.items : [];
    var items = arr
      .filter(function (v) {
        return v && typeof v === 'object' && !Array.isArray(v);
      })
      .map(function (v) {
        var sharedSub = firstNonBlank(v.subline, v.sub, v.sub_en, v.sub_de, v.sub_es, v.sub_it, v.sub_fr);
        var featuredVisual = typeof v.featured_visual === 'boolean' ? v.featured_visual : !!v.featured;
        var featuredLayout = typeof v.featured_layout === 'boolean' ? v.featured_layout : !!v.featured;
        var homepagePriority = Number(v.homepage_priority);
        return {
          provider: String(v.provider != null ? v.provider : 'soundcloud').trim() || 'soundcloud',
          embedUrl: String(v.embedUrl != null ? v.embedUrl : '').trim(),
          externalUrl: String(v.externalUrl != null ? v.externalUrl : '').trim(),
          coverImage: String(v.coverImage != null ? v.coverImage : '').trim(),
          title: String(v.title != null ? v.title : '').trim(),
          title_en: String(v.title_en != null ? v.title_en : '').trim(),
          title_de: String(v.title_de != null ? v.title_de : '').trim(),
          title_es: String(v.title_es != null ? v.title_es : '').trim(),
          title_it: String(v.title_it != null ? v.title_it : '').trim(),
          title_fr: String(v.title_fr != null ? v.title_fr : '').trim(),
          subline: sharedSub,
          sub_en: String(v.sub_en != null ? v.sub_en : '').trim(),
          sub_de: String(v.sub_de != null ? v.sub_de : '').trim(),
          sub_es: String(v.sub_es != null ? v.sub_es : '').trim(),
          sub_it: String(v.sub_it != null ? v.sub_it : '').trim(),
          sub_fr: String(v.sub_fr != null ? v.sub_fr : '').trim(),
          tag: String(v.tag != null ? v.tag : '').trim(),
          tag_en: String(v.tag_en != null ? v.tag_en : '').trim(),
          tag_de: String(v.tag_de != null ? v.tag_de : '').trim(),
          tag_es: String(v.tag_es != null ? v.tag_es : '').trim(),
          tag_it: String(v.tag_it != null ? v.tag_it : '').trim(),
          tag_fr: String(v.tag_fr != null ? v.tag_fr : '').trim(),
          composer: String(v.composer != null ? v.composer : '').trim(),
          composer_en: String(v.composer_en != null ? v.composer_en : '').trim(),
          composer_de: String(v.composer_de != null ? v.composer_de : '').trim(),
          composer_es: String(v.composer_es != null ? v.composer_es : '').trim(),
          composer_it: String(v.composer_it != null ? v.composer_it : '').trim(),
          composer_fr: String(v.composer_fr != null ? v.composer_fr : '').trim(),
          repertoireCat: String(v.repertoireCat != null ? v.repertoireCat : '').trim(),
          hidden: !!v.hidden,
          group: String(v.group != null ? v.group : '').trim() || 'opera_operetta',
          featured_visual: featuredVisual,
          featured_layout: featuredLayout,
          featured: featuredVisual,
          featured_contexts: normalizeFeaturedContexts(v.featured_contexts, {
            media: featuredVisual,
            homepage: featuredVisual,
            calendar: false
          }),
          homepage_priority: Number.isFinite(homepagePriority) && homepagePriority >= 0 ? Math.floor(homepagePriority) : null,
          editorialStatus: String(v.editorialStatus != null ? v.editorialStatus : v.hidden ? 'hidden' : 'draft').trim()
        };
      });
    if (!items.length && !h2 && !sub) return null;
    return { h2: h2, sub: sub, items: items };
  }

  /** Canonical rg_vid; if empty, legacy rg_vid_en (matches admin-v2 mergeRgVidRead). */
  function mergeLiveVidFromFirestore(primaryRaw, legacyEnRaw) {
    var primary = normalizeLiveVidBlock(primaryRaw);
    if (primary) return primary;
    return normalizeLiveVidBlock(legacyEnRaw);
  }

  function applyLiveMediaOverridesFromFirestore() {
    return Promise.resolve();
  }

  function getCaptions() {
    return (MP_MEDIA && MP_MEDIA.photos && MP_MEDIA.photos.captions) || {};
  }

  function getCaption(type, idx) {
    var caps = getCaptions();
    var raw = caps[type + '_' + idx];
    if (typeof raw === 'string') return { caption: raw, alt: '', photographer: '' };
    if (!raw || typeof raw !== 'object') return { caption: '', alt: '', photographer: '' };
    return {
      caption: String(raw.caption || ''),
      alt: String(raw.alt || ''),
      photographer: String(raw.photographer || '')
    };
  }

  var VIDEO_REP_CATS = ['opera', 'operetta', 'lied', 'concert_sacred', 'tango', 'crossover'];
  var VIDEO_SECTION_KEYS = ['opera_operetta', 'recital_lied', 'tango'];
  var AUDIO_SECTION_KEYS = ['opera_operetta', 'recital_lied', 'sacred_oratorio', 'tango'];
  function videoBlobLower(v) {
    return [v.tag, v.title, v.sub, v.subline, v.composer]
      .map(function (x) {
        return String(x || '');
      })
      .join(' ')
      .toLowerCase();
  }
  function inferTangoFromBlob(blob) {
    return /\btango\b|milonga|bandoneon|bandoneón|tango argentin|tango argentino|tangos\b|tango-loft|tango loft/.test(
      blob
    );
  }
  function inferOperettaFromBlob(blob) {
    return /\boperetta\b|\boperete\b|\bopereta\b|fledermaus|lustige witwe|land des lächelns|csardas|csárdás|zarewitsch|bajadere|weisses rössl/.test(
      blob
    );
  }
  function resolveVideoRepertoireCat(v) {
    var raw = String(v.repertoireCat || '').trim();
    if (raw === 'tango_crossover') {
      var bb = videoBlobLower(v);
      raw = inferTangoFromBlob(bb) ? 'tango' : 'crossover';
    }
    if (VIDEO_REP_CATS.indexOf(raw) !== -1) return raw;
    var blob = videoBlobLower(v);
    if (v.group === 'tango') return 'tango';
    if (inferTangoFromBlob(blob)) return 'tango';
    if (inferOperettaFromBlob(blob)) return 'operetta';
    if (
      /\blied\b|kunstlied|art song|lorelei|schubert|schumann|wolf|liederabend|mélodie|melodie|canción de arte|kunstlie/.test(
        blob
      )
    )
      return 'lied';
    if (
      /sacred|oratorio|requiem|\bmass\b|bach|motet|passion|stabat|kirche|kirch|church|cathedral|\bmesse\b|geistlich|sacro|sacrée|sacra/.test(
        blob
      )
    )
      return 'concert_sacred';
    return 'opera';
  }
  function normalizeVideoGroup(v) {
    var raw = String(v.group || '').trim();
    if (VIDEO_SECTION_KEYS.indexOf(raw) !== -1) return raw;
    var rep = resolveVideoRepertoireCat(v);
    if (raw === 'tango') return 'tango';
    if (raw === 'sacred_oratorio') return 'sacred_oratorio';
    if (raw === 'opera_lied') {
      if (rep === 'tango') return 'tango';
      if (rep === 'lied' || rep === 'concert_sacred' || rep === 'crossover') return 'recital_lied';
      return 'opera_operetta';
    }
    if (raw === 'gala_crossover') {
      if (rep === 'tango') return 'tango';
      if (rep === 'opera' || rep === 'operetta') return 'opera_operetta';
      return 'recital_lied';
    }
    if (rep === 'tango') return 'tango';
    if (rep === 'lied' || rep === 'concert_sacred' || rep === 'crossover') return 'recital_lied';
    return 'opera_operetta';
  }
  function hasFeaturedVisual(item) {
    if (item && typeof item.featured_visual === 'boolean') return item.featured_visual;
    return !!(item && item.featured);
  }
  function hasFeaturedLayout(item) {
    if (item && typeof item.featured_layout === 'boolean') return item.featured_layout;
    return !!(item && item.featured);
  }
  function normalizeFeaturedContexts(raw, defaults) {
    var src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    var base = defaults && typeof defaults === 'object' && !Array.isArray(defaults) ? defaults : {};
    return {
      media: typeof src.media === 'boolean' ? src.media : !!base.media,
      homepage: typeof src.homepage === 'boolean' ? src.homepage : !!base.homepage,
      calendar: typeof src.calendar === 'boolean' ? src.calendar : !!base.calendar
    };
  }
  function hasFeaturedInContext(item, context, flavor) {
    var ctx = normalizeFeaturedContexts(item && item.featured_contexts, {
      media: hasFeaturedVisual(item),
      homepage: hasFeaturedVisual(item),
      calendar: false
    });
    var contextEnabled = !!ctx[String(context || '').trim().toLowerCase()];
    if (!contextEnabled) return false;
    if (flavor === 'layout') return hasFeaturedLayout(item);
    if (flavor === 'visual') return hasFeaturedVisual(item);
    return hasFeaturedVisual(item) || hasFeaturedLayout(item);
  }
  function homepagePriorityValue(item) {
    var n = Number(item && item.homepage_priority);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.floor(n);
  }

  function escVideoHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function escVideoAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function renderVideos() {
    var d = getVid();
    var t = uiTable(currentLang);
    var locH2 = mpPick(currentLang, 'mp.videos.h2', '');
    var vidH2 =
      locH2 && String(locH2).trim()
        ? locH2
        : d && typeof d.h2 === 'string' && d.h2.trim()
          ? d.h2
          : '';
    var vidH2el = document.getElementById('vidH2');
    if (vidH2el) vidH2el.innerHTML = withTitleEmphasisVid(vidH2);
    var vidSubEl = document.getElementById('vidSub');
    if (vidSubEl) {
      vidSubEl.textContent = mpPick(
        currentLang,
        'mp.videos.sub',
        'Selected performance videos and listening highlights from stage, concert and recital work.'
      );
    }
    var vids = Array.isArray(d.videos) ? d.videos.slice() : [];
    var grid = document.getElementById('videoGrid');
    var nav = document.getElementById('videoSectionNav');
    var more = document.getElementById('videoMore');
    if (!grid || !more) return;

    function mkCard(v, i, hidden) {
      var baseCls = 'video-card reveal' + (i > 0 ? ' rd' + i : '');
      var visualFeatured = hasFeaturedVisual(v);
      var layoutFeatured = hasFeaturedLayout(v);
      var cls =
        baseCls +
        (visualFeatured ? ' video-card-featured' : '') +
        (layoutFeatured ? ' video-card-layout-featured' : '');
      var st = hidden ? ' style="display:none;max-width:500px;margin:4px auto 0"' : '';
      var brandRaw = t['vid.brand'] || 'Rolando Guy · Lyric Tenor';
      var brand = escVideoHtml(brandRaw);
      var repCat = resolveVideoRepertoireCat(v);
      var catKey = 'vid.repCat.' + repCat;
      var catLabelRaw = t[catKey] || repCat.replace(/_/g, ' ');
      var featuredTextRaw = effectiveUiText(currentLang, 'ui.featured') || 'Featured';
      var badgeTextRaw = visualFeatured ? (featuredTextRaw + ' · ' + catLabelRaw) : catLabelRaw;
      var catLabel = escVideoHtml(badgeTextRaw);
      var vidId = String(v.id || '').trim();
      var custom = v.customThumb && String(v.customThumb).trim() ? String(v.customThumb).trim() : '';
      var thumbSrc = custom || (vidId ? 'https://i.ytimg.com/vi/' + vidId + '/maxresdefault.jpg' : '');
      var hqFallback = vidId ? 'https://i.ytimg.com/vi/' + vidId + '/hqdefault.jpg' : '';
      var imgHtml = thumbSrc
        ? '<img class="video-thumb-media" src="' +
          escVideoAttr(thumbSrc) +
          '" alt="" loading="lazy" decoding="async"' +
          (hqFallback
            ? ' onerror="if(this.dataset._vfb!==\'1\'){this.dataset._vfb=\'1\';this.src=\'' +
              escVideoAttr(hqFallback) +
              '\';}else{this.style.visibility=\'hidden\';}"'
            : '') +
          '>'
        : '';
      var hasCustom = !!custom;
      var title = escVideoHtml(v.title);
      var composer = v.composer && String(v.composer).trim() ? escVideoHtml(String(v.composer).trim()) : '';
      var sub = v.sub && String(v.sub).trim() ? escVideoHtml(String(v.sub).trim()) : '';
      var wrapCls = 'video-thumb-wrap video-cat-' + repCat + (hasCustom ? ' video-has-custom' : '');
      return (
        '<div class="' +
        cls +
        '" ' +
        st +
        '>' +
        '<div class="' +
        wrapCls +
        '" id="vwrap-' +
        escVideoAttr(vidId) +
        '">' +
        imgHtml +
        '<div class="video-thumb-scrim" aria-hidden="true"></div>' +
        '<span class="video-cat-pill' + (visualFeatured ? ' video-cat-pill-featured' : '') + '">' +
        catLabel +
        '</span>' +
        '<div class="video-thumb-overlay">' +
        '<div class="video-brand">' +
        brand +
        '</div>' +
        '<div class="video-meta-title">' +
        title +
        '</div>' +
        (composer ? '<div class="video-meta-composer">' + composer + '</div>' : '') +
        (sub ? '<div class="video-meta-sub">' + sub + '</div>' : '') +
        '</div>' +
        '<div class="video-play-btn" onclick="playVideo(\'' +
        escVideoAttr(vidId) +
        '\', event)" style="cursor:pointer;position:absolute;inset:0;display:flex;align-items:center;justify-content:center">' +
        '<div class="play-circle">' +
        '<svg width="14" height="16" viewBox="0 0 16 18"><path d="M0 0L16 9L0 18V0Z" fill="currentColor"/></svg>' +
        '</div></div></div>' +
        '<div class="video-info-bar">' +
        '<div class="video-tag">' +
        escVideoHtml(v.tag) +
        '</div>' +
        '<div class="video-title">' +
        title +
        '</div>' +
        '<div class="video-sub">' +
        sub +
        '</div>' +
        '</div></div>'
      );
    }

    var normalised = vids.map(function (v) {
      var o = {};
      for (var k in v) {
        if (Object.prototype.hasOwnProperty.call(v, k)) o[k] = v[k];
      }
      o.group = normalizeVideoGroup(v);
      return o;
    });

    var groups = [
      { key: 'opera_operetta', label: t['vid.cat.opera_operetta'] || 'Opera · Operetta' },
      { key: 'recital_lied', label: t['vid.cat.recital_lied'] || 'Recital · Lied' },
      { key: 'tango', label: t['vid.cat.tango'] || 'Tango' }
    ];
    var visibleGroups = [];

    var htmlVisible = '';
    var htmlHidden = '';

    function orderVideoGroupEntries(entries) {
      return entries.slice().sort(function (a, b) {
        var va = hasFeaturedVisual(a.v) ? 1 : 0;
        var vb = hasFeaturedVisual(b.v) ? 1 : 0;
        var la = hasFeaturedLayout(a.v) ? 1 : 0;
        var lb = hasFeaturedLayout(b.v) ? 1 : 0;
        var pa = va + la;
        var pb = vb + lb;
        if (pa !== pb) return pb - pa;
        if (va !== vb) return vb - va;
        if (la !== lb) return lb - la;
        return a.idx - b.idx;
      });
    }

    groups.forEach(function (gconf) {
      var entries = normalised
        .map(function (v, idx) {
          return { v: v, idx: idx };
        })
        .filter(function (e) {
          return normalizeVideoGroup(e.v) === gconf.key;
        });
      if (!entries.length) return;

      var ordered = orderVideoGroupEntries(entries).map(function (e) {
        return e.v;
      });
      var vis = ordered.filter(function (v) {
        return !v.hidden;
      });
      var hid = ordered.filter(function (v) {
        return v.hidden;
      });

      var secTitle = String(gconf.label || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      var secId = 'video-cat-' + gconf.key;
      if (vis.length) {
        visibleGroups.push(gconf);
        htmlVisible +=
          '<div class="video-category" id="' +
          secId +
          '">' +
          '<h3 class="video-category-title" id="' +
          secId +
          '-title">' +
          secTitle +
          '</h3>' +
          vis
            .map(function (v, i) {
              return mkCard(v, i, false);
            })
            .join('') +
          '</div>';
      }
      if (hid.length) {
        htmlHidden +=
          '<div class="video-category">' +
          '<h3 class="video-category-title">' +
          secTitle +
          '</h3>' +
          hid
            .map(function (v, i) {
              return mkCard(v, i, true);
            })
            .join('') +
          '</div>';
      }
    });

    grid.innerHTML = htmlVisible;
    if (nav) {
      nav.classList.toggle('has-tabs', visibleGroups.length > 0);
      nav.style.display = visibleGroups.length ? '' : 'none';
      nav.style.setProperty('--video-tab-count', String(Math.max(visibleGroups.length, 1)));
      nav.innerHTML = visibleGroups
        .map(function (gconf, idx) {
          var label = String(gconf.label || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return '<a href="#video-cat-' + gconf.key + '-title" class="video-tab' + (idx === 0 ? ' active' : '') + '" id="tab-video-cat-' + gconf.key + '">' + label + '</a>';
        })
        .join('');
    }

    if (htmlHidden) {
      var showMoreTxt = t['vid.showMore'] || '+ Show More Videos';
      more.innerHTML =
        htmlHidden +
        '<div style="text-align:center;margin-top:20px">' +
        '<button type="button" class="btn-secondary" id="moreBtn" onclick="toggleMore()">' +
        showMoreTxt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
        '</button>' +
        '</div>';
    } else {
      more.innerHTML = '';
    }

    document.querySelectorAll('#videoGrid .reveal, #videoMore .reveal').forEach(function (el) {
      var ob = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('visible');
              ob.unobserve(en.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
      );
      ob.observe(el);
    });
  }

  function bindVideoSectionObserver() {
    if (videoSectionObserverBound) return;
    var sections = VIDEO_SECTION_KEYS
      .map(function (name) {
        return {
          name: name,
          el: document.getElementById('video-cat-' + name),
          titleEl: document.getElementById('video-cat-' + name + '-title')
        };
      })
      .filter(function (entry) {
        return !!entry.el && !!entry.titleEl;
      });
    if (!sections.length) return;
    videoSectionObserverBound = true;
    function setActive(name) {
      sections.forEach(function (entry) {
        var tab = document.getElementById('tab-video-cat-' + entry.name);
        if (tab) tab.classList.toggle('active', entry.name === name);
      });
    }
    sections.forEach(function (entry) {
      var tab = document.getElementById('tab-video-cat-' + entry.name);
      if (!tab) return;
      tab.addEventListener('click', function () {
        setActive(entry.name);
      });
    });
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          var visible = entries
            .filter(function (entry) {
              return entry.isIntersecting;
            })
            .sort(function (a, b) {
              return b.intersectionRatio - a.intersectionRatio;
            });
          if (!visible.length) return;
          var found = sections.find(function (entry) {
            return entry.titleEl === visible[0].target;
          });
          if (found) setActive(found.name);
        },
        {
          rootMargin: '-18% 0px -68% 0px',
          threshold: [0.15, 0.35, 0.55, 0.75]
        }
      );
      sections.forEach(function (entry) {
        observer.observe(entry.titleEl);
      });
      return;
    }
    function updateActiveFromScroll() {
      var active = sections[0].name;
      sections.forEach(function (entry) {
        if (entry.titleEl.getBoundingClientRect().top <= 160) active = entry.name;
      });
      setActive(active);
    }
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);
    updateActiveFromScroll();
  }

  function renderAudio() {
    var d = getAudio();
    var t = uiTable(currentLang);
    var section = document.getElementById('audio');
    var h2El = document.getElementById('audioH2');
    var subEl = document.getElementById('audioSub');
    var grid = document.getElementById('audioGrid');
    var nav = document.getElementById('audioSectionNav');
    if (!section || !h2El || !subEl || !grid || !nav) return;

    var h2 = mpPick(currentLang, 'mp.audio.h2', String(d.h2 || '').trim() || 'Selected <em>Audio</em> &amp; Listening');
    var sub = mpPick(currentLang, 'mp.audio.sub', String(d.sub || '').trim() || 'Selected embedded recordings and listening excerpts.');
    h2El.innerHTML = formatSectionTitleIfAmpersand(String(h2 || ''));
    subEl.textContent = String(sub || '');

    function normalizeAudioGroup(v) {
      var raw = String(v && v.group ? v.group : '').trim();
      if (AUDIO_SECTION_KEYS.indexOf(raw) !== -1) return raw;
      var rep = resolveVideoRepertoireCat(v || {});
      if (rep === 'tango') return 'tango';
      if (rep === 'concert_sacred') return 'sacred_oratorio';
      if (rep === 'lied' || rep === 'crossover') return 'recital_lied';
      return 'opera_operetta';
    }

    var items = Array.isArray(d.items) ? d.items.slice() : [];
    /*
      Public audio localization rules:
      1) Per-item localized field for active language (e.g. sub_de)
      2) Shared base field (e.g. subline)
      3) Legacy fallback field (e.g. sub)
      4) Any localized value in EN/DE/ES/IT/FR order
      This keeps backward compatibility with older entries while allowing language-specific editorial copy.
    */
    function pickLocalizedAudioField(item, baseKey, legacyKey) {
      var lang = String(currentLang || 'en').toLowerCase();
      var locKey = baseKey + '_' + lang;
      var value = String(item && item[locKey] != null ? item[locKey] : '').trim();
      if (value) return value;
      value = String(item && item[baseKey] != null ? item[baseKey] : '').trim();
      if (value) return value;
      if (legacyKey) {
        value = String(item && item[legacyKey] != null ? item[legacyKey] : '').trim();
        if (value) return value;
      }
      var langs = ['en', 'de', 'es', 'it', 'fr'];
      for (var i = 0; i < langs.length; i += 1) {
        value = String(item && item[baseKey + '_' + langs[i]] != null ? item[baseKey + '_' + langs[i]] : '').trim();
        if (value) return value;
      }
      return '';
    }
    var normalised = items.map(function (a) {
      var o = {};
      for (var k in a) {
        if (Object.prototype.hasOwnProperty.call(a, k)) o[k] = a[k];
      }
      o.title = pickLocalizedAudioField(o, 'title', 'title');
      o.subline = pickLocalizedAudioField(o, 'sub', 'subline');
      o.tag = pickLocalizedAudioField(o, 'tag', 'tag');
      o.composer = pickLocalizedAudioField(o, 'composer', 'composer');
      o.group = normalizeAudioGroup(o);
      o.repertoireCat = resolveVideoRepertoireCat(o);
      return o;
    });
    function isSafeEmbed(url) {
      var raw = String(url || '').trim();
      return /^https:\/\/[^\s]+$/i.test(raw);
    }
    function hasExternalAudioLink(url) {
      var raw = String(url || '').trim();
      return /^https:\/\/[^\s]+$/i.test(raw);
    }
    function toSoundCloudEmbedUrl(url) {
      var raw = String(url || '').trim();
      if (!raw) return '';
      if (!/^https:\/\/[^\s]+$/i.test(raw)) return '';
      if (/^https:\/\/w\.soundcloud\.com\/player\//i.test(raw)) {
        return raw;
      }
      try {
        var parsed = new URL(raw);
        var host = String(parsed.hostname || '').toLowerCase();
        if (host === 'soundcloud.com' || host === 'www.soundcloud.com') {
          parsed.search = '';
          parsed.hash = '';
          raw = parsed.toString();
        }
      } catch (e) {}
      if (/^https:\/\/(?:www\.)?soundcloud\.com\//i.test(raw) || /^https:\/\/on\.soundcloud\.com\//i.test(raw)) {
        return 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(raw) + '&auto_play=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&download=false&sharing=false&color=%23d4a843';
      }
      return raw;
    }
    function resolveAudioEmbedUrl(a) {
      var provider = String(a && a.provider != null ? a.provider : '').trim().toLowerCase();
      var raw = String(a && a.embedUrl != null ? a.embedUrl : '').trim();
      if (!raw) return '';
      if (provider === 'soundcloud') return toSoundCloudEmbedUrl(raw);
      return raw;
    }
    function hasPublicAudioSource(a) {
      return isSafeEmbed(a && a.embedUrl) || hasExternalAudioLink(a && a.externalUrl);
    }
    function mkAudioCard(a) {
      var visualFeatured = hasFeaturedVisual(a);
      var layoutFeatured = hasFeaturedLayout(a);
      var title = escVideoHtml(a.title || '');
      var subline = escVideoHtml(a.subline || '');
      var composer = escVideoHtml(a.composer || '');
      var groupKey = String(a.group || '').trim();
      var repKey = String(a.repertoireCat || '').trim();
      if (groupKey === 'sacred_oratorio' && (repKey === '' || repKey === 'opera')) repKey = 'concert_sacred';
      if (!repKey) {
        if (groupKey === 'sacred_oratorio') repKey = 'concert_sacred';
        else if (groupKey === 'recital_lied') repKey = 'lied';
        else if (groupKey === 'tango') repKey = 'tango';
        else repKey = 'opera';
      }
      var catKey = 'vid.repCat.' + repKey;
      var catLabelRaw = t[catKey] || repKey.replace(/_/g, ' ');
      var featuredTextRaw = effectiveUiText(currentLang, 'ui.featured') || 'Featured';
      var badgeTextRaw = visualFeatured ? (featuredTextRaw + ' · ' + catLabelRaw) : catLabelRaw;
      var catLabel = escVideoHtml(badgeTextRaw);
      var openText = escVideoHtml(effectiveUiText(currentLang, 'aud.openExternal') || 'Open listening link');
      var unavailableText = escVideoHtml(effectiveUiText(currentLang, 'aud.embedUnavailable') || 'Audio player unavailable');
      var linkOnlyText = escVideoHtml(effectiveUiText(currentLang, 'aud.linkOnly') || 'Listening link available below');
      var embedUrl = resolveAudioEmbedUrl(a);
      var isSoundCloud = String(a.provider || '').trim().toLowerCase() === 'soundcloud';
      var embed = isSafeEmbed(embedUrl)
        ? '<iframe src="' + escVideoAttr(embedUrl) + '" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
        : '<div class="audio-embed-fallback' + (hasExternalAudioLink(a.externalUrl) ? ' audio-embed-linkonly' : '') + '">' + (hasExternalAudioLink(a.externalUrl) ? linkOnlyText : unavailableText) + '</div>';
      return (
        '<article class="audio-card' + (visualFeatured ? ' audio-card-featured' : '') + (layoutFeatured ? ' audio-card-layout-featured' : '') + '">' +
        '<div class="audio-title-wrap">' +
        '<h3 class="audio-title">' + title + '</h3>' +
        (composer ? '<p class="audio-composer">' + composer + '</p>' : '') +
        (subline ? '<p class="audio-subline">' + subline + '</p>' : '') +
        '</div>' +
        '<div class="audio-embed' + (isSoundCloud ? ' audio-embed--soundcloud' : '') + '">' + embed + '</div>' +
        (catLabel ? '<div class="audio-rep-pill' + (visualFeatured ? ' audio-rep-pill-featured' : '') + '">' + catLabel + '</div>' : '') +
        (a.externalUrl ? '<div class="audio-links"><a href="' + escVideoAttr(a.externalUrl) + '" target="_blank" rel="noopener" class="audio-open-link">' + openText + '</a></div>' : '') +
        '</article>'
      );
    }

    var groups = [
      { key: 'opera_operetta', label: t['vid.cat.opera_operetta'] || 'Opera · Operetta' },
      { key: 'recital_lied', label: t['vid.cat.recital_lied'] || 'Recital · Lied' },
      { key: 'sacred_oratorio', label: t['vid.cat.sacred_oratorio'] || 'Sacred / Oratorio' },
      { key: 'tango', label: t['vid.cat.tango'] || 'Tango' }
    ];
    var visibleGroups = [];
    var html = '';
    groups.forEach(function (gconf) {
      var vis = normalised.filter(function (a) {
        return !a.hidden && a.group === gconf.key && hasPublicAudioSource(a);
      }).map(function (a, idx) {
        return { a: a, idx: idx };
      }).sort(function (left, right) {
        var lv = hasFeaturedVisual(left.a) ? 1 : 0;
        var rv = hasFeaturedVisual(right.a) ? 1 : 0;
        var ll = hasFeaturedLayout(left.a) ? 1 : 0;
        var rl = hasFeaturedLayout(right.a) ? 1 : 0;
        var lp = lv + ll;
        var rp = rv + rl;
        if (lp !== rp) return rp - lp;
        if (lv !== rv) return rv - lv;
        if (ll !== rl) return rl - ll;
        return left.idx - right.idx;
      });
      if (!vis.length) return;
      visibleGroups.push(gconf);
      html += vis.map(function (row) { return mkAudioCard(row.a); }).join('');
    });

    section.hidden = !visibleGroups.length;
    section.setAttribute('data-has-items', visibleGroups.length ? 'true' : 'false');
    grid.innerHTML = html;
    nav.style.display = 'none';
  }

  function bindAudioSectionObserver() {
    return;
  }

  function toggleMore() {
    var more = document.getElementById('videoMore');
    var btn = document.getElementById('moreBtn');
    if (!more) return;
    var cards = more.querySelectorAll('.video-card');
    var isHidden = cards[0] && cards[0].style.display === 'none';
    cards.forEach(function (el) {
      el.style.display = isHidden ? '' : 'none';
      if (isHidden) el.classList.add('visible');
    });
    var t = uiTable(currentLang);
    if (btn)
      btn.textContent = isHidden
        ? t['vid.showLess'] || '\u2212 Show Less'
        : t['vid.showMore'] || '+ Show More Videos';
  }

  function playVideo(videoId, ev) {
    var wrap = document.getElementById('vwrap-' + videoId);
    if (!wrap) return;
    var youtubeUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(videoId);

    if (window.innerWidth < 768) {
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
      if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
      openVideoModal(videoId);
      return;
    }

    if (location.protocol === 'file:') {
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    document.querySelectorAll('.video-thumb-wrap[data-playing="1"]').forEach(function (el) {
      var openId = el.id && el.id.indexOf('vwrap-') === 0 ? el.id.slice(6) : null;
      if (openId && openId !== videoId) {
        stopVideo(openId);
      }
    });
    if (wrap.dataset.playing === '1') return;

    wrap.style.cursor = 'default';
    if (!wrap.dataset.original) {
      wrap.dataset.original = wrap.innerHTML;
    }
    wrap.dataset.playing = '1';
    var L = currentLang || 'en';
    var _closeEmbed = String(effectiveUiText(L, 'ui.closeEmbed') || '\u00d7 Close')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
    var _closeVideoAria = String(effectiveUiText(L, 'ui.closeVideoAria') || 'Close video')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
    var _vfbOp = String(effectiveUiText(L, 'vid.embedUnavailable') || 'Video player unavailable')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
    var _vfbYt = String(effectiveUiText(L, 'vid.openYoutube') || 'Open on YouTube')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
    wrap.innerHTML =
      '<div class="video-embed-shell" style="position:absolute;inset:0;width:100%;height:100%;">' +
      '<iframe src="https://www.youtube.com/embed/' +
      videoId +
      '?autoplay=1&rel=0&modestbranding=1"' +
      ' frameborder="0"' +
      ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
      ' allowfullscreen' +
      ' style="position:absolute;inset:0;width:100%;height:100%"></iframe>' +
      '<button type="button" class="video-embed-close" onclick="stopVideo(\'' +
      videoId +
      '\')" aria-label="' +
      _closeVideoAria +
      '">' +
      _closeEmbed +
      '</button>' +
      '<div class="video-embed-fallback" data-yt-id="' +
      videoId +
      '" style="display:none">' +
      '<span class="vfb-op">' +
      _vfbOp +
      '</span>' +
      '<button type="button" class="btn-secondary" style="margin-top:6px" onclick="window.open(\'' +
      youtubeUrl +
      '\',\'_blank\',\'noopener\')">' +
      _vfbYt +
      '</button>' +
      '</div>' +
      '</div>';

    try {
      var iframe = wrap.querySelector('iframe');
      var fb = wrap.querySelector('.video-embed-fallback');
      if (!iframe || !fb) return;

      var markLoaded = function () {
        iframe.dataset.loaded = '1';
      };
      iframe.addEventListener('load', markLoaded);
      iframe.addEventListener('error', function () {
        iframe.remove();
        fb.style.display = 'flex';
      });

      setTimeout(function () {
        if (!iframe.dataset.loaded) {
          try {
            iframe.remove();
          } catch (e) {}
          fb.style.display = 'flex';
        }
      }, 6000);
    } catch (e) {
      var fb2 = wrap.querySelector('.video-embed-fallback');
      if (fb2) {
        var ifr = wrap.querySelector('iframe');
        if (ifr)
          try {
            ifr.remove();
          } catch (_) {}
        fb2.style.display = 'flex';
      }
    }
  }

  function openVideoModal(videoId) {
    var modal = document.getElementById('videoModal');
    var frame = document.getElementById('videoModalFrame');
    if (!modal || !frame) return;
    var youtubeUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(videoId);

    var L = currentLang || 'en';
    var _vfbOp = String(effectiveUiText(L, 'vid.embedUnavailable') || 'Video player unavailable')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
    var _vfbYt = String(effectiveUiText(L, 'vid.openYoutube') || 'Open on YouTube')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');

    var embedBase = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId);
    var embedQs = 'autoplay=1&playsinline=1&rel=0&modestbranding=1';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    frame.innerHTML =
      '<iframe src="' +
      embedBase +
      '?' +
      embedQs +
      '"' +
      ' title="YouTube video"' +
      ' frameborder="0"' +
      ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"' +
      ' allowfullscreen' +
      ' style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>' +
      '<div class="video-embed-fallback" data-yt-id="' +
      videoId +
      '" style="display:none;position:absolute;inset:0;">' +
      '<span class="vfb-op">' +
      _vfbOp +
      '</span>' +
      '<button type="button" class="btn-secondary" style="margin-top:6px" onclick="window.open(\'' +
      youtubeUrl +
      '\',\'_blank\',\'noopener\')">' +
      _vfbYt +
      '</button>' +
      '</div>';

    try {
      var iframe = frame.querySelector('iframe');
      var fb = frame.querySelector('.video-embed-fallback');
      if (!iframe || !fb) return;

      iframe.addEventListener('error', function () {
        try {
          iframe.remove();
        } catch (_) {}
        fb.style.display = 'flex';
      });
    } catch (e) {
      var fb3 = frame.querySelector('.video-embed-fallback');
      if (fb3) {
        var ifr2 = frame.querySelector('iframe');
        if (ifr2)
          try {
            ifr2.remove();
          } catch (_) {}
        fb3.style.display = 'flex';
      }
    }
  }

  function closeVideoModal() {
    var modal = document.getElementById('videoModal');
    var frame = document.getElementById('videoModalFrame');
    if (frame) frame.innerHTML = '';
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function stopVideo(videoId) {
    var wrap = document.getElementById('vwrap-' + videoId);
    if (!wrap) return;
    var original = wrap.dataset.original;
    if (original) {
      wrap.innerHTML = original;
    }
    wrap.dataset.playing = '0';
    wrap.style.cursor = '';
  }

  function setActivePhotoTab(n) {
    ['studio', 'stage', 'backstage'].forEach(function (x) {
      var tab = document.getElementById('tab-' + x);
      if (tab) tab.classList.toggle('active', x === n);
    });
  }

  function getActivePhotoTab() {
    var active = document.querySelector('.photo-tab.active');
    if (active && active.id) return active.id.replace('tab-', '');
    return 'studio';
  }

  function getPhotoPanelRefs(panelName) {
    if (panelName === 'stage') {
      return {
        panel: document.getElementById('panel-stage'),
        grid: document.querySelector('#panel-stage .photo-grid-3'),
        type: 't',
        itemClass: 'photo-item-s'
      };
    }
    if (panelName === 'backstage') {
      return {
        panel: document.getElementById('panel-backstage'),
        grid: document.getElementById('backstageGrid'),
        empty: document.getElementById('backstageEmpty'),
        type: 'b',
        itemClass: 'photo-item-s'
      };
    }
    return {
      panel: document.getElementById('panel-studio'),
      grid: document.querySelector('#panel-studio .photo-grid-4'),
      type: 's',
      itemClass: 'photo-item-p'
    };
  }

  var lbSet = 's';
  var lbIdx = 0;

  function lbArr(s) {
    var ph = getPhotoPaths();
    if (s === 's') return ph.s;
    if (s === 't') return ph.t;
    return ph.b;
  }

  function updateLbCaption() {
    var cap = getCaption(lbSet, lbIdx);
    var t = document.getElementById('lbCapText');
    var p = document.getElementById('lbCapPhotog');
    if (t) {
      var caption = String(cap.caption || '').trim();
      t.textContent = caption;
      t.style.display = caption ? '' : 'none';
    }
    if (p) {
      var credit = String(cap.photographer || '').trim();
      p.textContent = credit ? '\u00a9 ' + credit : '';
      p.style.display = credit ? '' : 'none';
    }
  }

  function openLb(set, idx) {
    lbSet = set;
    lbIdx = idx;
    var arr = lbArr(set);
    if (!arr || !arr.length || arr[idx] == null) return;
    var img = document.getElementById('lbImg');
    var lb = document.getElementById('lightbox');
    var ctr = document.getElementById('lbCtr');
    if (!img || !lb || !ctr) return;
    img.src = arr[idx];
    var openCap = getCaption(lbSet, lbIdx);
    var openAlt = String(openCap.alt || '').trim();
    img.alt = openAlt || 'Photo';
    ctr.textContent = idx + 1 + ' / ' + arr.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLbCaption();
  }

  function closeLb() {
    var lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeLbOnBg(e) {
    if (e.target.id === 'lightbox') closeLb();
  }

  function navLb(d) {
    var arr = lbArr(lbSet);
    if (!arr.length) return;
    lbIdx = (lbIdx + d + arr.length) % arr.length;
    var img = document.getElementById('lbImg');
    var ctr = document.getElementById('lbCtr');
    if (img) img.src = arr[lbIdx];
    if (img) {
      var navCap = getCaption(lbSet, lbIdx);
      img.alt = String(navCap.alt || '').trim() || 'Photo';
    }
    if (ctr) ctr.textContent = lbIdx + 1 + ' / ' + lbArr(lbSet).length;
    updateLbCaption();
  }

  function applyPhotosChrome() {
    if (!MP_MEDIA || !MP_MEDIA.photos) return;
    var p = MP_MEDIA.photos;
    var lang = currentLang || 'en';
    var ph2 = mpPick(lang, 'mp.photos.h2', '');
    var psub = mpPick(lang, 'mp.photos.sub', '');
    var pst = mpPick(lang, 'mp.photos.studioTab', '');
    var ptt = mpPick(lang, 'mp.photos.stageTab', '');
    var pbt = mpPick(lang, 'mp.photos.backstageTab', '');
    var pbe = mpPick(lang, 'mp.photos.backstageEmpty', '');
    var h2 = document.getElementById('photosH2');
    var sub = document.getElementById('photosSub');
    if (h2) {
      var rawH2 = ph2.trim() ? ph2 : p.h2 || '';
      if (rawH2) h2.innerHTML = formatSectionTitleIfAmpersand(rawH2);
    }
    if (sub) sub.textContent = psub.trim() ? psub : p.sub != null ? p.sub : '';
    var ts = document.getElementById('tab-studio');
    var tt = document.getElementById('tab-stage');
    var tb = document.getElementById('tab-backstage');
    if (ts) ts.textContent = pst.trim() ? pst : p.studioTab || '';
    if (tt) tt.textContent = ptt.trim() ? ptt : p.stageTab || '';
    if (tb) tb.textContent = pbt.trim() ? pbt : p.backstageTab || '';
    var bem = document.getElementById('backstageEmpty');
    if (bem) bem.textContent = pbe.trim() ? pbe : p.backstageEmpty || '';
  }

  function renderPhotoGallery() {
    var ph = getPhotoEntries();
    var lang = currentLang || 'en';
    var altStudioFb = mpPick(lang, 'mp.photos.studioTab', 'Rolando Guy');
    var altStageFb = mpPick(lang, 'mp.photos.stageTab', 'On Stage');
    var altBackFb = mpPick(lang, 'mp.photos.backstageTab', 'Backstage');
    var sRefs = getPhotoPanelRefs('studio');
    var tRefs = getPhotoPanelRefs('stage');
    var bRefs = getPhotoPanelRefs('backstage');

    function maxPhotoCols(itemClass) {
      var w = window.innerWidth || document.documentElement.clientWidth || 1280;
      if (w <= 600) return itemClass === 'photo-item-p' ? 2 : 1;
      if (w <= 1000) return 2;
      return itemClass === 'photo-item-p' ? 4 : 3;
    }

    function balancedRowSizes(count, maxCols, refs) {
      if (count <= 0) return [];
      var w = window.innerWidth || document.documentElement.clientWidth || 1280;
      if (w > 1000) {
        if (refs.type === 't' || refs.type === 'b') {
          if (count >= 5) {
            return [2].concat(balancedRowSizes(count - 2, 3, { type: refs.type, itemClass: refs.itemClass }));
          }
          if (count === 4) return [2, 2];
        }
        if (refs.type === 's') {
          if (count >= 7) {
            return [3].concat(balancedRowSizes(count - 3, 4, { type: refs.type, itemClass: refs.itemClass }));
          }
          if (count === 6) return [3, 3];
          if (count === 5) return [3, 2];
        }
      }
      var rows = Math.ceil(count / maxCols);
      var base = Math.floor(count / rows);
      var extra = count % rows;
      var sizes = [];
      for (var i = 0; i < rows; i++) {
        sizes.push(base + (i < extra ? 1 : 0));
      }
      return sizes;
    }

    function renderPhotoItem(refs, entry, i, altFallback) {
      var imgSrc = resolvePhotoSrc(entry);
      var cap = getCaption(refs.type, i);
      var alt = String(cap.alt || '').trim() || altFallback;
      var caption = String(cap.caption || '').trim();
      var photographer = String(cap.photographer || '').trim();
      var orientation = String(entry && entry.orientation || '').trim().toLowerCase();
      var mismatchContain =
        (refs.type === 's' && orientation === 'landscape') ||
        ((refs.type === 't' || refs.type === 'b') && orientation === 'portrait');
      var focusStyle = entry && entry.focus
        ? ' style="object-position:' + String(entry.focus).replace(/"/g, '&quot;') + '"'
        : '';
      var metaHtml = '';
      if (caption || photographer) {
        metaHtml =
          '<div class="photo-item-meta">' +
          (caption ? '<p class="photo-item-caption">' + caption.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</p>' : '') +
          (photographer ? '<p class="photo-item-credit">&copy; ' + photographer.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</p>' : '') +
          '</div>';
      }
      return (
        '<div class="photo-item ' +
        refs.itemClass +
        (mismatchContain ? ' photo-item-fit-contain' : '') +
        ' reveal rd' +
        i % 4 +
        '" onclick="openLb(\'' +
        refs.type +
        '\',' +
        i +
        ')"><img src="' +
        imgSrc +
        '" alt="' +
        alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') +
        '" loading="lazy" decoding="async"' +
        focusStyle +
        '>' +
        metaHtml +
        '</div>'
      );
    }

    function renderItems(refs, items, altFallback) {
      if (!refs || !refs.grid) return;
      var count = Array.isArray(items) ? items.length : 0;
      var cols = maxPhotoCols(refs.itemClass);
      var rows = balancedRowSizes(count, cols, refs);
      var cursor = 0;
      refs.grid.innerHTML = rows
        .map(function (rowSize) {
          var rowItems = (items || []).slice(cursor, cursor + rowSize);
          var start = cursor;
          cursor += rowSize;
          return (
            '<div class="photo-grid-row" style="grid-template-columns:repeat(' +
            rowSize +
            ', minmax(0,1fr))">' +
            rowItems
              .map(function (entry, rowIdx) {
                return renderPhotoItem(refs, entry, start + rowIdx, altFallback);
              })
              .join('') +
            '</div>'
          );
        })
        .join('');
    }

    renderItems(sRefs, ph.s, altStudioFb);
    renderItems(tRefs, ph.t, altStageFb);
    renderItems(bRefs, ph.b, altBackFb);
    if (bRefs && bRefs.empty) bRefs.empty.style.display = ph.b && ph.b.length ? 'none' : '';

    try {
      document.querySelectorAll('#photos .reveal:not(.visible)').forEach(function (el) {
        var ob = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                en.target.classList.add('visible');
                ob.unobserve(en.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        );
        ob.observe(el);
      });
    } catch (e) {}
  }

  function switchPhotoTab(nextTab) {
    var next = nextTab || 'studio';
    photoManualTarget = next;
    photoManualTabUntil = Date.now() + 2200;
    if (window.event && typeof window.event.preventDefault === 'function') {
      window.event.preventDefault();
    }
    setActivePhotoTab(next);
    var head = document.getElementById('photo-head-' + next);
    if (head) {
      var isMobile = window.matchMedia && window.matchMedia('(max-width: 1000px)').matches;
      var offset = isMobile ? 142 : 118;
      var top = Math.max(0, window.scrollY + head.getBoundingClientRect().top - offset);
      try {
        window.scrollTo({ top: top, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, top);
      }
    }
  }

  function bindPhotoSectionObserver() {
    if (photoSectionObserverBound) return;
    var panels = ['studio', 'stage', 'backstage']
      .map(function (name) {
        return {
          name: name,
          el: document.getElementById('panel-' + name),
          headEl: document.getElementById('photo-head-' + name)
        };
      })
      .filter(function (entry) {
        return !!entry.el && !!entry.headEl;
      });
    if (!panels.length || !('IntersectionObserver' in window)) return;
    photoSectionObserverBound = true;
    var observer = new IntersectionObserver(
      function (entries) {
        if (Date.now() < photoManualTabUntil) {
          if (photoManualTarget) {
            setActivePhotoTab(photoManualTarget);
            var targetEl = document.getElementById('photo-head-' + photoManualTarget);
            var targetEntry = entries.find(function (entry) {
              return entry.target === targetEl;
            });
            if (targetEntry && targetEntry.isIntersecting) {
              setActivePhotoTab(photoManualTarget);
              photoManualTabUntil = 0;
              photoManualTarget = '';
            }
          }
          return;
        }
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
          });
        if (!visible.length) return;
        var found = panels.find(function (entry) {
          return entry.headEl === visible[0].target;
        });
        if (found) setActivePhotoTab(found.name);
      },
      {
        rootMargin: '-16% 0px -72% 0px',
        threshold: [0, 0.15, 0.35, 0.55]
      }
    );
    panels.forEach(function (entry) {
      observer.observe(entry.headEl);
    });
  }

  function bindMediaSectionObserver() {
    var audioSection = document.getElementById('audio');
    var hasAudio = !!(audioSection && !audioSection.hidden && audioSection.getAttribute('data-has-items') === 'true');
    document.querySelectorAll('[data-audio-jump]').forEach(function (el) {
      el.hidden = !hasAudio;
    });
  }

  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox');
    var vm = document.getElementById('videoModal');
    if (e.key === 'Escape') {
      if (lb && lb.classList.contains('open')) {
        closeLb();
        return;
      }
      if (vm && vm.classList.contains('open')) {
        closeVideoModal();
      }
      return;
    }
    if (lb && lb.classList.contains('open')) {
      if (e.key === 'ArrowLeft') navLb(-1);
      if (e.key === 'ArrowRight') navLb(1);
    }
  });

  window.toggleMore = toggleMore;
  window.playVideo = playVideo;
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;
  window.stopVideo = stopVideo;
  window.showTab = switchPhotoTab;
  window.openLb = openLb;
  window.closeLb = closeLb;
  window.closeLbOnBg = closeLbOnBg;
  window.navLb = navLb;
  window.getMpCuratedHighlights = function (opts) {
    opts = opts || {};
    var context = String(opts.context || 'media').trim().toLowerCase() || 'media';
    var maxVideo = Number(opts.maxVideo);
    var maxAudio = Number(opts.maxAudio);
    if (!Number.isFinite(maxVideo) || maxVideo < 0) maxVideo = 1;
    if (!Number.isFinite(maxAudio) || maxAudio < 0) maxAudio = 1;
    function rank(item) {
      var v = hasFeaturedVisual(item) ? 1 : 0;
      var l = hasFeaturedLayout(item) ? 1 : 0;
      return v + l;
    }
    function pick(list, max, type) {
      return (Array.isArray(list) ? list : []).filter(function (item) {
        if (!item || item.hidden) return false;
        return hasFeaturedInContext(item, context);
      }).slice().sort(function (a, b) {
        if (context === 'homepage') {
          var ap = homepagePriorityValue(a);
          var bp = homepagePriorityValue(b);
          var ah = ap != null;
          var bh = bp != null;
          if (ah && bh && ap !== bp) return ap - bp;
          if (ah !== bh) return ah ? -1 : 1;
        }
        var ra = rank(a);
        var rb = rank(b);
        if (ra !== rb) return rb - ra;
        if (hasFeaturedVisual(a) !== hasFeaturedVisual(b)) return hasFeaturedVisual(b) ? 1 : -1;
        if (hasFeaturedLayout(a) !== hasFeaturedLayout(b)) return hasFeaturedLayout(b) ? 1 : -1;
        return 0;
      }).slice(0, max).map(function (item) {
        return {
          type: type,
          featured_visual: hasFeaturedVisual(item),
          featured_layout: hasFeaturedLayout(item),
          homepage_priority: homepagePriorityValue(item),
          featured_contexts: normalizeFeaturedContexts(item && item.featured_contexts, { media: true, homepage: true, calendar: false }),
          payload: item
        };
      });
    }
    var data = MP_MEDIA || {};
    var videos = pick(data.vid && data.vid.videos, maxVideo, 'video');
    var audios = pick(data.audio && data.audio.items, maxAudio, 'audio');
    return { videos: videos, audios: audios, context: context };
  };

  window.addEventListener('mp:langchange', function (e) {
    currentLang = (e.detail && e.detail.lang) || 'en';
    if (!MP_MEDIA) return;
    applyPhotosChrome();
    renderVideos();
    renderAudio();
    setActivePhotoTab(getActivePhotoTab());
    renderPhotoGallery();
    bindAudioSectionObserver();
    bindMediaSectionObserver();
  });

  window.addEventListener('mp:localesready', function () {
    if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
    if (!MP_MEDIA) return;
    applyPhotosChrome();
    renderVideos();
    renderAudio();
    setActivePhotoTab(getActivePhotoTab());
    renderPhotoGallery();
    bindAudioSectionObserver();
    bindMediaSectionObserver();
  });

  fetch('/v1-assets/data/media-data.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(function (data) {
      MP_MEDIA = data;
      return applyLiveMediaOverridesFromFirestore();
    })
    .then(function () {
      if (typeof window.getMpSiteLang === 'function') currentLang = window.getMpSiteLang();
      applyPhotosChrome();
      renderVideos();
      renderAudio();
      bindVideoSectionObserver();
      bindAudioSectionObserver();
      setActivePhotoTab(getActivePhotoTab());
      renderPhotoGallery();
      bindPhotoSectionObserver();
      bindMediaSectionObserver();
    })
    .catch(function () {
      var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
      MP_MEDIA = {
        vid: {
          h2:
            mpPick(lang, 'mp.videos.h2', 'Stage, Concert &amp; <em>Recital Highlights</em>'),
          videos: []
        },
        audio: {
          h2: mpPick(lang, 'mp.audio.h2', 'Selected <em>Audio</em> &amp; Listening'),
          sub: mpPick(lang, 'mp.audio.sub', 'Selected embedded recordings and listening excerpts.'),
          items: []
        },
        photos: {
          h2: mpPick(lang, 'mp.photos.h2', 'Portraits, Stage &amp; <em>Backstage</em>'),
          sub: mpPick(lang, 'mp.mediaLoadError', 'Media data could not be loaded.'),
          studioTab: mpPick(lang, 'mp.photos.studioTab', 'Studio Portraits'),
          stageTab: mpPick(lang, 'mp.photos.stageTab', 'On Stage'),
          backstageTab: mpPick(lang, 'mp.photos.backstageTab', 'Backstage'),
          backstageEmpty: mpPick(lang, 'mp.photos.backstageEmpty', 'No photos yet.'),
          s: [],
          t: [],
          b: [],
          captions: {}
        }
      };
      applyPhotosChrome();
      renderVideos();
      renderAudio();
      bindVideoSectionObserver();
      bindAudioSectionObserver();
      setActivePhotoTab(getActivePhotoTab());
      renderPhotoGallery();
      bindPhotoSectionObserver();
      bindMediaSectionObserver();
    });
})();
