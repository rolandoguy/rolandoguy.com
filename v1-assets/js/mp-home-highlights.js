(function () {
  'use strict';

  var HOMEPAGE_HIGHLIGHTS_MAX_ITEMS = 2;

  function escHtml(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pickText(lang, key, fallback) {
    if (typeof window.pickMpLocaleString === 'function') {
      var value = window.pickMpLocaleString(lang, key);
      if (value != null && String(value).trim()) return String(value);
    }
    return fallback;
  }

  function itemTitle(item) {
    var payload = item && item.payload ? item.payload : {};
    if (item && item.kind === 'video') return String(payload.title || payload.tag || '').trim();
    if (item && item.kind === 'audio') return String(payload.title || payload.tag || '').trim();
    if (item && item.kind === 'event') return String(payload.title || payload.name || '').trim();
    return '';
  }

  function itemSub(item) {
    var payload = item && item.payload ? item.payload : {};
    if (item && item.kind === 'video') return String(payload.composer || payload.sub || '').trim();
    if (item && item.kind === 'audio') return String(payload.composer || payload.subline || '').trim();
    if (item && item.kind === 'event') {
      var venue = String(payload.venue || '').trim();
      var city = String(payload.city || '').trim();
      return (venue && city) ? (venue + ' · ' + city) : (venue || city);
    }
    return '';
  }

  function safeAttr(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function normalizeVideoId(raw) {
    var id = String(raw || '').trim();
    if (!id) return '';
    var m = id.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    if (m && m[1]) return m[1];
    m = id.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    if (m && m[1]) return m[1];
    m = id.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
    if (m && m[1]) return m[1];
    return /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : '';
  }

  function isSafeEmbedUrl(url) {
    var raw = String(url || '').trim();
    return /^https:\/\/[^\s]+$/i.test(raw);
  }

  function toSoundCloudEmbedUrl(url) {
    var raw = String(url || '').trim();
    if (!raw || !isSafeEmbedUrl(raw)) return '';
    if (/^https:\/\/w\.soundcloud\.com\/player\//i.test(raw)) return raw;
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

  function resolveAudioEmbedUrl(item) {
    var payload = item && item.payload ? item.payload : {};
    var provider = String(payload.provider || '').trim().toLowerCase();
    var raw = String(payload.embedUrl || '').trim();
    if (!raw) return '';
    if (provider === 'soundcloud') return toSoundCloudEmbedUrl(raw);
    return raw;
  }

  function resolveVideoIdFromItem(item) {
    var payload = item && item.payload ? item.payload : {};
    return normalizeVideoId(payload.id || payload.youtubeId || payload.url || payload.link || '');
  }

  function videoThumbSources(item, videoId) {
    var payload = item && item.payload ? item.payload : {};
    var custom = String(payload.customThumb || '').trim();
    var thumbSrc = custom || (videoId ? ('https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg') : '');
    var hqFallback = videoId ? ('https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg') : '';
    return {
      thumbSrc: thumbSrc,
      hqFallback: hqFallback
    };
  }

  function playHomeVideoFromPreview(preview) {
    if (!preview || preview.getAttribute('data-playing') === '1') return;
    var videoId = String(preview.getAttribute('data-home-video-id') || '').trim();
    if (!videoId) return;
    var title = String(preview.getAttribute('data-home-video-title') || '').trim();
    preview.setAttribute('data-playing', '1');
    preview.classList.add('is-playing');
    preview.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + safeAttr(videoId) + '?autoplay=1&rel=0&modestbranding=1" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="' + safeAttr(title) + '"></iframe>';
  }

  var homeVideoInteractionsBound = false;
  function bindHomeVideoInteractions() {
    if (homeVideoInteractionsBound) return;
    homeVideoInteractionsBound = true;

    document.addEventListener('click', function (ev) {
      var trigger = ev.target && ev.target.closest ? ev.target.closest('.home-video-play-btn') : null;
      if (!trigger) return;
      ev.preventDefault();
      var preview = trigger.closest('.home-video-preview');
      playHomeVideoFromPreview(preview);
    });

    document.addEventListener('keydown', function (ev) {
      var trigger = ev.target && ev.target.closest ? ev.target.closest('.home-video-play-btn') : null;
      if (!trigger) return;
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      var preview = trigger.closest('.home-video-preview');
      playHomeVideoFromPreview(preview);
    });
  }

  function pickDirectPair(items) {
    var arr = Array.isArray(items) ? items.slice() : [];
    var video = null;
    var audio = null;
    arr.forEach(function (item) {
      if (!item || !item.kind) return;
      if (!video && item.kind === 'video' && resolveVideoIdFromItem(item)) video = item;
      if (!audio && item.kind === 'audio' && isSafeEmbedUrl(resolveAudioEmbedUrl(item))) audio = item;
    });
    var out = [];
    if (video) out.push(video);
    if (audio) out.push(audio);
    if (out.length < HOMEPAGE_HIGHLIGHTS_MAX_ITEMS) {
      arr.forEach(function (item) {
        if (!item || out.length >= HOMEPAGE_HIGHLIGHTS_MAX_ITEMS) return;
        if (out.indexOf(item) >= 0) return;
        if (item.kind === 'event') return;
        out.push(item);
      });
    }
    return out.slice(0, HOMEPAGE_HIGHLIGHTS_MAX_ITEMS);
  }

  function renderVideoCard(lang, item, featuredLabel) {
    var videoId = resolveVideoIdFromItem(item);
    if (!videoId) return '';
    var title = itemTitle(item) || featuredLabel;
    var sub = itemSub(item);
    var mediaLabel = pickText(lang, 'nav.media', '');
    var playLabel = pickText(lang, 'ui.playVideo', 'Play video');
    var thumbs = videoThumbSources(item, videoId);
    var imgHtml = thumbs.thumbSrc
      ? ('<img class="home-video-thumb" src="' + safeAttr(thumbs.thumbSrc) + '" alt="" loading="lazy" decoding="async"' +
          (thumbs.hqFallback
            ? (' onerror="if(this.dataset._vfb!==\'1\'){this.dataset._vfb=\'1\';this.src=\'' + safeAttr(thumbs.hqFallback) + '\';}else{this.style.visibility=\'hidden\';}"')
            : '') +
          '>')
      : '';
    return (
      '<article class="home-highlight-item home-highlight-item--video">' +
        '<div class="home-highlight-media home-highlight-media--video">' +
          '<div class="home-video-preview" data-home-video-id="' + safeAttr(videoId) + '" data-home-video-title="' + safeAttr(title) + '">' +
            imgHtml +
            '<div class="home-video-scrim" aria-hidden="true"></div>' +
            '<button type="button" class="home-video-play-btn" aria-label="' + safeAttr(playLabel) + '">' +
              '<span class="play-circle" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<p class="home-highlight-kicker">' + escHtml(mediaLabel) + '</p>' +
        '<h3 class="home-highlight-name">' + escHtml(title) + '</h3>' +
        (sub ? ('<p class="home-highlight-sub">' + escHtml(sub) + '</p>') : '') +
      '</article>'
    );
  }

  function renderAudioCard(lang, item, featuredLabel) {
    var embedUrl = resolveAudioEmbedUrl(item);
    if (!isSafeEmbedUrl(embedUrl)) return '';
    var title = itemTitle(item) || featuredLabel;
    var sub = itemSub(item);
    var mediaLabel = pickText(lang, 'nav.media', '');
    return (
      '<article class="home-highlight-item home-highlight-item--audio">' +
        '<div class="home-highlight-media home-highlight-media--audio">' +
          '<iframe src="' + safeAttr(embedUrl) + '" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" title="' + safeAttr(title) + '"></iframe>' +
        '</div>' +
        '<p class="home-highlight-kicker">' + escHtml(mediaLabel) + '</p>' +
        '<h3 class="home-highlight-name">' + escHtml(title) + '</h3>' +
        (sub ? ('<p class="home-highlight-sub">' + escHtml(sub) + '</p>') : '') +
      '</article>'
    );
  }

  function renderHighlights() {
    var section = document.getElementById('home-highlights');
    var list = document.getElementById('home-highlights-list');
    if (!section || !list) return;

    var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
    var featuredLabel = pickText(lang, 'ui.featured', '');

    if (typeof window.getMpEditorialHighlights !== 'function') {
      section.hidden = true;
      list.innerHTML = '';
      return;
    }

    var items = window.getMpEditorialHighlights({
      context: 'homepage',
      maxItems: HOMEPAGE_HIGHLIGHTS_MAX_ITEMS,
      maxVideo: 2,
      maxAudio: 2,
      includeMedia: true,
      includeCalendar: true
    }) || [];

    if (!Array.isArray(items) || !items.length) {
      section.hidden = true;
      list.innerHTML = '';
      return;
    }

    var paired = pickDirectPair(items);
    var videoItem = null;
    var audioItem = null;
    paired.forEach(function (item) {
      if (!videoItem && item && item.kind === 'video') videoItem = item;
      if (!audioItem && item && item.kind === 'audio') audioItem = item;
    });
    if (!videoItem || !audioItem) {
      section.hidden = true;
      list.innerHTML = '';
      return;
    }

    var videoHtml = renderVideoCard(lang, videoItem, featuredLabel);
    var audioHtml = renderAudioCard(lang, audioItem, featuredLabel);
    if (!videoHtml || !audioHtml) {
      section.hidden = true;
      list.innerHTML = '';
      return;
    }

    section.hidden = false;
    list.innerHTML = videoHtml + audioHtml;
    bindHomeVideoInteractions();
  }

  window.addEventListener('mp:localesready', renderHighlights);
  window.addEventListener('mp:langchange', renderHighlights);
  window.addEventListener('mp:highlightsready', renderHighlights);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHighlights);
  } else {
    renderHighlights();
  }
})();
