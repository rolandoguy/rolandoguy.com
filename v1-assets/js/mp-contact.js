/**
 * Public-safe contact section for mp/contact.html.
 * This runtime consumes bundled public JSON plus explicit public-safe Firestore docs.
 * Contact copy may come from live public docs, while Formspree configuration remains
 * bundle-owned until there is an explicit public-safe live config path for it.
 * Internal/admin drafts and legacy fallback payloads must never reach this page.
 */
(function () {
  'use strict';

  var MP_CONTACT = null;
  var CONTACT_DOC_CACHE = {};

  function normalizeLang(lang) {
    var raw = String(lang || 'en').trim().toLowerCase();
    return /^(en|de|es|it|fr)$/.test(raw) ? raw : 'en';
  }

  function firstNonEmpty() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v != null && String(v).trim() !== '') return String(v).trim();
    }
    return '';
  }

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

  function ensureContactDoc(key) {
    if (Object.prototype.hasOwnProperty.call(CONTACT_DOC_CACHE, key)) {
      return Promise.resolve(CONTACT_DOC_CACHE[key]);
    }
    return fetchFirestoreDocJson(key)
      .then(function (doc) {
        CONTACT_DOC_CACHE[key] = doc && doc.data && typeof doc.data === 'object' ? doc.data : null;
        return CONTACT_DOC_CACHE[key];
      })
      .catch(function () {
        CONTACT_DOC_CACHE[key] = null;
        return null;
      });
  }

  function loadLiveContactDocs(lang) {
    var L = normalizeLang(lang);
    var keys = ['contact_' + L];
    if (L !== 'en') keys.push('contact_en');
    return Promise.all(keys.map(ensureContactDoc));
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

  var MP_CONTACT_UI_EN = {
    'nav.contact': 'Contact',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.subject': 'Subject',
    'form.message': 'Message',
    'form.send': 'Send Message',
    'form.success': 'Thank you! Your message has been sent.',
    'form.namePh': 'Your name',
    'form.emailPh': 'your@email.com',
    'form.subjectPh': 'Booking inquiry',
    'form.messagePh': 'Tell me about your project...',
    'form.sending': 'Sending...',
    'form.errorSend': 'Error sending. Please email rolandoguy@gmail.com directly.'
  };

  function uiTable() {
    var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
    return mpUiTable(lang, MP_CONTACT_UI_EN);
  }

  function formatSectionTitleIfAmpersand(html) {
    var s = String(html || '');
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

  function getContactDoc() {
    var lang = normalizeLang((typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en');
    var liveCurrent = CONTACT_DOC_CACHE['contact_' + lang];
    var liveEn = CONTACT_DOC_CACHE.contact_en;
    var base =
      MP_CONTACT && MP_CONTACT.contact && typeof MP_CONTACT.contact === 'object'
        ? MP_CONTACT.contact
        : {
            title: '',
            sub: '',
            email: 'rolandoguy@gmail.com',
            emailBtn: 'Send Email',
            webBtn: 'Official Website',
            quote: ''
          };
    var loc =
      lang !== 'en' &&
      MP_CONTACT &&
      MP_CONTACT.contactLocales &&
      typeof MP_CONTACT.contactLocales[lang] === 'object'
        ? MP_CONTACT.contactLocales[lang]
        : null;
    var title = firstNonEmpty(
      liveCurrent && liveCurrent.title,
      loc && loc.title,
      lang !== 'en' ? mpPick(lang, 'contact.title', '') : '',
      liveEn && liveEn.title,
      base.title
    );
    var sub = firstNonEmpty(
      liveCurrent && liveCurrent.sub,
      loc && loc.sub,
      lang !== 'en' ? mpPick(lang, 'contact.sub', '') : '',
      liveEn && liveEn.sub,
      base.sub
    );
    var emailBtn = firstNonEmpty(
      liveCurrent && liveCurrent.emailBtn,
      loc && loc.emailBtn,
      lang !== 'en' ? mpPick(lang, 'contact.emailBtn', '') : '',
      liveEn && liveEn.emailBtn,
      base.emailBtn
    );
    var quote =
      loc && loc.quote != null && String(loc.quote).trim() !== ''
        ? String(loc.quote).trim()
        : base.quote;
    var webBtn = firstNonEmpty(
      liveCurrent && liveCurrent.webBtn,
      loc && loc.webBtn,
      mpPick(lang, 'contact.webBtn', ''),
      liveEn && liveEn.webBtn,
      base.webBtn
    );
    return {
      title: title,
      sub: sub,
      email: firstNonEmpty(liveCurrent && liveCurrent.email, liveEn && liveEn.email, base.email, 'rolandoguy@gmail.com'),
      emailBtn: emailBtn,
      webBtn: webBtn,
      webUrl: firstNonEmpty(liveCurrent && liveCurrent.webUrl, liveEn && liveEn.webUrl, base.webUrl),
      phone: firstNonEmpty(liveCurrent && liveCurrent.phone, liveEn && liveEn.phone),
      quote: quote
    };
  }

  function applyFormChrome() {
    var t = uiTable();
    var map = [
      ['cf-name', 'form.name', 'form.namePh'],
      ['cf-email', 'form.email', 'form.emailPh'],
      ['cf-subject', 'form.subject', 'form.subjectPh'],
      ['cf-message', 'form.message', 'form.messagePh']
    ];
    map.forEach(function (row) {
      var id = row[0];
      var lk = row[1];
      var pk = row[2];
      var input = document.getElementById(id);
      var label = document.querySelector('label[for="' + id + '"]');
      if (label && t[lk]) label.textContent = t[lk];
      if (input && t[pk]) input.setAttribute('placeholder', t[pk]);
    });
    var sendSpan = document.querySelector('.form-submit span');
    if (sendSpan && t['form.send']) sendSpan.textContent = t['form.send'];
    var ok = document.getElementById('formOk');
    if (ok && t['form.success']) ok.textContent = t['form.success'];
  }

  function renderContact() {
    var d = getContactDoc();
    var contactTitle = document.getElementById('contactTitle');
    var contactSub = document.getElementById('contactSub');
    if (contactTitle) {
      var rawTitle = d.title || '';
      contactTitle.innerHTML = rawTitle.trim() ? formatSectionTitleIfAmpersand(rawTitle) : '';
    }
    if (contactSub) contactSub.textContent = d.sub || '';
    var cqEl = document.getElementById('contactQuoteText');
    var cqWrap = document.getElementById('contactQuoteWrap');
    if (cqEl && cqWrap) {
      if (d.quote && String(d.quote).trim()) {
        cqEl.textContent = d.quote;
        cqWrap.style.display = '';
      } else {
        cqWrap.style.display = 'none';
      }
    }

    var eb = document.getElementById('contactEmailBtn');
    if (eb) {
      eb.textContent = d.emailBtn || '';
      var email = d.email && String(d.email).trim() ? String(d.email).trim() : 'rolandoguy@gmail.com';
      eb.href = 'mailto:' + email;
    }
    var wb = document.getElementById('contactWebBtn');
    if (wb) {
      if (d.webBtn && String(d.webBtn).trim()) wb.textContent = String(d.webBtn).trim();
      wb.style.display = 'none';
    }

    var tag = document.getElementById('contactSectionTag');
    var tnav = uiTable();
    if (tag && tnav['nav.contact']) tag.textContent = tnav['nav.contact'];
  }

  function getFormspreeId() {
    // Canonical source: bundled contact-data.json. Live public contact docs are copy-only.
    if (MP_CONTACT && MP_CONTACT.formspreeId && String(MP_CONTACT.formspreeId).trim()) {
      return String(MP_CONTACT.formspreeId).trim();
    }
    return 'xqedvoqw';
  }

  async function submitForm() {
    var nameEl = document.getElementById('cf-name');
    var emailEl = document.getElementById('cf-email');
    var subjectEl = document.getElementById('cf-subject');
    var msgEl = document.getElementById('cf-message');
    var inputs = [nameEl, emailEl, subjectEl, msgEl].filter(Boolean);
    var ok = true;
    inputs.forEach(function (i) {
      i.style.borderColor = '';
      if (!i.value.trim()) {
        i.style.borderColor = 'rgba(184,115,51,.7)';
        ok = false;
      }
    });
    if (!ok) return;
    var btn = document.querySelector('.form-submit');
    var t = uiTable();
    if (!btn) return;
    btn.disabled = true;
    btn.style.opacity = '.5';
    var span = btn.querySelector('span');
    if (span) span.textContent = t['form.sending'] || 'Sending...';
    try {
      var res = await fetch('https://formspree.io/f/' + getFormspreeId(), {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameEl.value,
          email: emailEl.value,
          subject: subjectEl.value,
          message: msgEl.value
        })
      });
      if (res.ok) {
        var formOk = document.getElementById('formOk');
        if (formOk) formOk.style.display = 'block';
        inputs.forEach(function (i) {
          i.value = '';
        });
        setTimeout(function () {
          if (formOk) formOk.style.display = 'none';
        }, 5000);
      } else {
        alert(t['form.errorSend'] || 'Error sending. Please email rolandoguy@gmail.com directly.');
      }
    } catch (e) {
      alert(t['form.errorSend'] || 'Error sending. Please email rolandoguy@gmail.com directly.');
    } finally {
      btn.disabled = false;
      btn.style.opacity = '';
      if (span) span.textContent = t['form.send'] || 'Send Message';
    }
  }

  window.submitForm = submitForm;

  window.addEventListener('mp:langchange', function () {
    var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
    loadLiveContactDocs(lang).finally(function () {
      if (!MP_CONTACT) return;
      applyFormChrome();
      renderContact();
    });
  });

  window.addEventListener('mp:localesready', function () {
    var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
    loadLiveContactDocs(lang).finally(function () {
      applyFormChrome();
      if (!MP_CONTACT) return;
      renderContact();
    });
  });

  fetch('/v1-assets/data/contact-data.json')
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(function (data) {
      MP_CONTACT = data;
      var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
      loadLiveContactDocs(lang).finally(function () {
        applyFormChrome();
        renderContact();
      });
    })
    .catch(function () {
      var lang = (typeof window.getMpSiteLang === 'function' && window.getMpSiteLang()) || 'en';
      MP_CONTACT = {
        contact: {
          title: mpPick(lang, 'contact.title', 'Bookings &amp; <em>Artistic Enquiries</em>'),
          sub: mpPick(
            lang,
            'contact.dataLoadError',
            'Contact content could not be loaded. Please write to rolandoguy@gmail.com.'
          ),
          email: 'rolandoguy@gmail.com',
          emailBtn: mpPick(lang, 'contact.emailBtn', 'Send Email'),
          webBtn: mpPick(lang, 'contact.webBtn', 'Official website'),
          quote: ''
        },
        formspreeId: 'xqedvoqw'
      };
      loadLiveContactDocs(lang).finally(function () {
        applyFormChrome();
        renderContact();
      });
    });
})();
