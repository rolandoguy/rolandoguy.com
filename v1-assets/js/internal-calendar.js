(function () {
  'use strict';

  var FIRESTORE_PROJECT_ID = 'rolandoguy-57d63';
  var STORAGE_FILTER = 'ic_calendar_filter';
  var STORAGE_COLLAPSED = 'ic_calendar_collapsed';
  var AGENDA_LANG_KEY = 'ic_calendar_lang';
  var SITE_LANG_KEY = 'mp_site_lang';
  var STORAGE_SCOPE = 'ic_calendar_scope';
  var PUBLIC_EDITORIAL = {
    published: 1,
    public: 1,
    live: 1,
    ready: 1,
    reviewed: 1,
    translated: 1
  };
  var IC_COPY = {
    en: {
      pageTitle: 'Internal Calendar — Rolando Guy',
      kicker: 'Internal calendar',
      title: 'Agenda',
      lead: 'Private working timeline for concerts, shows, and other events, grouped month by month.',
      agendaLanguage: 'Agenda language',
      scopeLabel: 'Scope',
      scopeYearLabel: 'Year',
      scopeFromLabel: 'From month',
      scopeToLabel: 'To month',
      scopeUpcoming: 'Upcoming only',
      scopeThisMonth: 'This month',
      scopeNext3Months: 'Next 3 months',
      scopeNext6Months: 'Next 6 months',
      scopeThisYear: 'This year',
      scopeCustomMonths: 'Custom months',
      scopeSelectUpcoming: 'Upcoming only',
      scopeSelectThisMonth: 'This month',
      scopeSelectNext3Months: 'Next 3 months',
      scopeSelectNext6Months: 'Next 6 months',
      scopeSelectThisYear: 'This year',
      scopeSelectCustomYear: 'Custom year',
      scopeSelectCustomMonths: 'Custom months',
      presetUpcoming: 'Upcoming only',
      presetThisYear: 'This year',
      presetSeason: '{year} season',
      presetPublicOnly: 'Public only',
      presetPrivatePlanning: 'Private planning',
      filterAll: 'All',
      filterPublic: 'Public',
      filterPrivate: 'Private',
      collapseAll: 'Collapse all',
      expandAll: 'Expand all',
      printAgenda: 'Print agenda',
      backToAdmin: 'Back to admin',
      overviewLabel: 'Overview',
      totalEvents: 'Total events',
      publicEvents: 'Public events',
      privateEvents: 'Private events',
      monthsShown: 'Months shown',
      monthIndexLabel: 'Month index',
      nextEvent: 'Next event',
      noUpcoming: 'No upcoming event',
      summaryTemplate: '{events} events across {months} months',
      loading: 'Loading calendar…',
      error: 'Calendar could not be loaded.',
      noResults: 'No events match the current filter.',
      monthExpand: 'Expand month',
      monthCollapse: 'Collapse month',
      printNote: 'If the print preview appears blank, wait a moment and try File > Print again.',
      printPreparing: 'Preparing print view…',
      printReady: 'Agenda ready. If Safari does not open the print dialog, use File > Print or Cmd+P.',
      eventWord: 'event',
      eventsWord: 'events',
      monthWord: 'month',
      monthsWord: 'months'
    },
    de: {
      pageTitle: 'Interner Kalender — Rolando Guy',
      kicker: 'Interner Kalender',
      title: 'Agenda',
      lead: 'Privater Arbeitsplan für Konzerte, Shows und andere Termine, monatsweise gruppiert.',
      agendaLanguage: 'Agenda-Sprache',
      scopeLabel: 'Umfang',
      scopeYearLabel: 'Jahr',
      scopeFromLabel: 'Ab Monat',
      scopeToLabel: 'Bis Monat',
      scopeUpcoming: 'Nur kommende',
      scopeThisMonth: 'Dieser Monat',
      scopeNext3Months: 'Nächste 3 Monate',
      scopeNext6Months: 'Nächste 6 Monate',
      scopeThisYear: 'Dieses Jahr',
      scopeCustomMonths: 'Eigene Monate',
      scopeSelectUpcoming: 'Nur kommende',
      scopeSelectThisMonth: 'Dieser Monat',
      scopeSelectNext3Months: 'Nächste 3 Monate',
      scopeSelectNext6Months: 'Nächste 6 Monate',
      scopeSelectThisYear: 'Dieses Jahr',
      scopeSelectCustomYear: 'Eigenes Jahr',
      scopeSelectCustomMonths: 'Eigene Monate',
      presetUpcoming: 'Nur kommende',
      presetThisYear: 'Dieses Jahr',
      presetSeason: '{year} Saison',
      presetPublicOnly: 'Nur öffentlich',
      presetPrivatePlanning: 'Private Planung',
      filterAll: 'Alle',
      filterPublic: 'Öffentlich',
      filterPrivate: 'Privat',
      collapseAll: 'Alle einklappen',
      expandAll: 'Alle ausklappen',
      printAgenda: 'Agenda drucken',
      backToAdmin: 'Zurück zum Admin',
      overviewLabel: 'Überblick',
      totalEvents: 'Termine gesamt',
      publicEvents: 'Öffentliche Termine',
      privateEvents: 'Private Termine',
      monthsShown: 'Monate angezeigt',
      monthIndexLabel: 'Monatsindex',
      nextEvent: 'Nächster Termin',
      noUpcoming: 'Kein kommender Termin',
      summaryTemplate: '{events} Termine in {months} Monaten',
      loading: 'Kalender wird geladen…',
      error: 'Der Kalender konnte nicht geladen werden.',
      noResults: 'Keine Termine entsprechen dem aktuellen Filter.',
      monthExpand: 'Monat ausklappen',
      monthCollapse: 'Monat einklappen',
      printNote: 'Falls die Druckvorschau leer erscheint, einen Moment warten und erneut über Datei > Drucken öffnen.',
      printPreparing: 'Druckansicht wird vorbereitet…',
      printReady: 'Agenda bereit. Falls Safari den Druckdialog nicht öffnet, Datei > Drucken oder Cmd+P verwenden.',
      eventWord: 'Termin',
      eventsWord: 'Termine',
      monthWord: 'Monat',
      monthsWord: 'Monate'
    },
    es: {
      pageTitle: 'Calendario interno — Rolando Guy',
      kicker: 'Calendario interno',
      title: 'Agenda',
      lead: 'Cronología privada de trabajo para conciertos, espectáculos y otros eventos, ordenada mes por mes.',
      agendaLanguage: 'Idioma de agenda',
      scopeLabel: 'Alcance',
      scopeYearLabel: 'Año',
      scopeFromLabel: 'Mes desde',
      scopeToLabel: 'Mes hasta',
      scopeUpcoming: 'Solo próximos',
      scopeThisMonth: 'Este mes',
      scopeNext3Months: 'Próximos 3 meses',
      scopeNext6Months: 'Próximos 6 meses',
      scopeThisYear: 'Este año',
      scopeCustomMonths: 'Meses personalizados',
      scopeSelectUpcoming: 'Solo próximos',
      scopeSelectThisMonth: 'Este mes',
      scopeSelectNext3Months: 'Próximos 3 meses',
      scopeSelectNext6Months: 'Próximos 6 meses',
      scopeSelectThisYear: 'Este año',
      scopeSelectCustomYear: 'Año personalizado',
      scopeSelectCustomMonths: 'Meses personalizados',
      presetUpcoming: 'Solo próximos',
      presetThisYear: 'Este año',
      presetSeason: 'Temporada {year}',
      presetPublicOnly: 'Solo públicos',
      presetPrivatePlanning: 'Planificación privada',
      filterAll: 'Todos',
      filterPublic: 'Públicos',
      filterPrivate: 'Privados',
      collapseAll: 'Contraer todo',
      expandAll: 'Expandir todo',
      printAgenda: 'Imprimir agenda',
      backToAdmin: 'Volver al admin',
      overviewLabel: 'Resumen',
      totalEvents: 'Eventos totales',
      publicEvents: 'Eventos públicos',
      privateEvents: 'Eventos privados',
      monthsShown: 'Meses mostrados',
      monthIndexLabel: 'Índice de meses',
      nextEvent: 'Próximo evento',
      noUpcoming: 'No hay próximo evento',
      summaryTemplate: '{events} eventos en {months} meses',
      loading: 'Cargando calendario…',
      error: 'No se pudo cargar el calendario.',
      noResults: 'No hay eventos para el filtro actual.',
      monthExpand: 'Expandir mes',
      monthCollapse: 'Contraer mes',
      printNote: 'Si la vista previa sale en blanco, espera un momento y vuelve a usar Archivo > Imprimir.',
      printPreparing: 'Preparando la vista de impresión…',
      printReady: 'Agenda lista. Si Safari no abre el diálogo de impresión, usa Archivo > Imprimir o Cmd+P.',
      eventWord: 'evento',
      eventsWord: 'eventos',
      monthWord: 'mes',
      monthsWord: 'meses'
    },
    it: {
      pageTitle: 'Calendario interno — Rolando Guy',
      kicker: 'Calendario interno',
      title: 'Agenda',
      lead: 'Cronologia privata di lavoro per concerti, spettacoli e altri eventi, organizzata mese per mese.',
      agendaLanguage: 'Lingua agenda',
      scopeLabel: 'Ambito',
      scopeYearLabel: 'Anno',
      scopeFromLabel: 'Mese iniziale',
      scopeToLabel: 'Mese finale',
      scopeUpcoming: 'Solo prossimi',
      scopeThisMonth: 'Questo mese',
      scopeNext3Months: 'Prossimi 3 mesi',
      scopeNext6Months: 'Prossimi 6 mesi',
      scopeThisYear: 'Quest’anno',
      scopeCustomMonths: 'Mesi personalizzati',
      scopeSelectUpcoming: 'Solo prossimi',
      scopeSelectThisMonth: 'Questo mese',
      scopeSelectNext3Months: 'Prossimi 3 mesi',
      scopeSelectNext6Months: 'Prossimi 6 mesi',
      scopeSelectThisYear: 'Quest’anno',
      scopeSelectCustomYear: 'Anno personalizzato',
      scopeSelectCustomMonths: 'Mesi personalizzati',
      presetUpcoming: 'Solo prossimi',
      presetThisYear: 'Quest’anno',
      presetSeason: 'Stagione {year}',
      presetPublicOnly: 'Solo pubblici',
      presetPrivatePlanning: 'Pianificazione privata',
      filterAll: 'Tutti',
      filterPublic: 'Pubblici',
      filterPrivate: 'Privati',
      collapseAll: 'Comprimi tutto',
      expandAll: 'Espandi tutto',
      printAgenda: 'Stampa agenda',
      backToAdmin: 'Torna all’admin',
      overviewLabel: 'Riepilogo',
      totalEvents: 'Eventi totali',
      publicEvents: 'Eventi pubblici',
      privateEvents: 'Eventi privati',
      monthsShown: 'Mesi mostrati',
      monthIndexLabel: 'Indice mesi',
      nextEvent: 'Prossimo evento',
      noUpcoming: 'Nessun evento imminente',
      summaryTemplate: '{events} eventi in {months} mesi',
      loading: 'Caricamento calendario…',
      error: 'Impossibile caricare il calendario.',
      noResults: 'Nessun evento corrisponde al filtro attuale.',
      monthExpand: 'Espandi mese',
      monthCollapse: 'Comprimi mese',
      printNote: 'Se l’anteprima di stampa appare vuota, attendi un momento e riprova con File > Stampa.',
      printPreparing: 'Preparazione della stampa…',
      printReady: 'Agenda pronta. Se Safari non apre la finestra di stampa, usa File > Stampa o Cmd+P.',
      eventWord: 'evento',
      eventsWord: 'eventi',
      monthWord: 'mese',
      monthsWord: 'mesi'
    },
    fr: {
      pageTitle: 'Calendrier interne — Rolando Guy',
      kicker: 'Calendrier interne',
      title: 'Agenda',
      lead: 'Calendrier de travail privé pour concerts, spectacles et autres événements, organisé mois par mois.',
      agendaLanguage: 'Langue de l’agenda',
      scopeLabel: 'Périmètre',
      scopeYearLabel: 'Année',
      scopeFromLabel: 'Mois de départ',
      scopeToLabel: 'Mois de fin',
      scopeUpcoming: 'À venir',
      scopeThisMonth: 'Ce mois-ci',
      scopeNext3Months: '3 prochains mois',
      scopeNext6Months: '6 prochains mois',
      scopeThisYear: 'Cette année',
      scopeCustomMonths: 'Mois personnalisés',
      scopeSelectUpcoming: 'À venir',
      scopeSelectThisMonth: 'Ce mois-ci',
      scopeSelectNext3Months: '3 prochains mois',
      scopeSelectNext6Months: '6 prochains mois',
      scopeSelectThisYear: 'Cette année',
      scopeSelectCustomYear: 'Année personnalisée',
      scopeSelectCustomMonths: 'Mois personnalisés',
      presetUpcoming: 'À venir',
      presetThisYear: 'Cette année',
      presetSeason: 'Saison {year}',
      presetPublicOnly: 'Publics seulement',
      presetPrivatePlanning: 'Planification privée',
      filterAll: 'Tous',
      filterPublic: 'Publics',
      filterPrivate: 'Privés',
      collapseAll: 'Tout replier',
      expandAll: 'Tout déplier',
      printAgenda: 'Imprimer l’agenda',
      backToAdmin: 'Retour à l’admin',
      overviewLabel: 'Aperçu',
      totalEvents: 'Événements totaux',
      publicEvents: 'Événements publics',
      privateEvents: 'Événements privés',
      monthsShown: 'Mois affichés',
      monthIndexLabel: 'Index des mois',
      nextEvent: 'Prochain événement',
      noUpcoming: 'Aucun événement à venir',
      summaryTemplate: '{events} événements sur {months} mois',
      loading: 'Chargement du calendrier…',
      error: 'Le calendrier n’a pas pu être chargé.',
      noResults: 'Aucun événement ne correspond au filtre actuel.',
      monthExpand: 'Déplier le mois',
      monthCollapse: 'Replier le mois',
      printNote: 'Si l’aperçu d’impression est vide, attendez un instant et réessayez via Fichier > Imprimer.',
      printPreparing: 'Préparation de l’impression…',
      printReady: 'Agenda prêt. Si Safari n’ouvre pas la boîte de dialogue d’impression, utilisez Fichier > Imprimer ou Cmd+P.',
      eventWord: 'événement',
      eventsWord: 'événements',
      monthWord: 'mois',
      monthsWord: 'mois'
    }
  };

  var state = {
    lang: getLang(),
    scope: readStoredScope(),
    visibility: readStoredFilter(),
    collapsed: readStoredCollapsed(),
    events: [],
    loading: true,
    error: '',
    pendingPrint: false,
    printMessage: ''
  };

  function qs(id) {
    return document.getElementById(id);
  }
  function safeString(v) {
    return String(v == null ? '' : v);
  }
  function normalizeLang(code) {
    var s = safeString(code).trim().toLowerCase().slice(0, 2);
    return /^(en|de|es|it|fr)$/.test(s) ? s : 'en';
  }
  function getLang() {
    try {
      var stored = localStorage.getItem(AGENDA_LANG_KEY);
      if (stored) return normalizeLang(stored);
    } catch (e) {}
    try {
      var siteStored = localStorage.getItem(SITE_LANG_KEY);
      if (siteStored) return normalizeLang(siteStored);
    } catch (eSite) {}
    try {
      if (document.documentElement.lang) return normalizeLang(document.documentElement.lang);
    } catch (e2) {}
    try {
      if (navigator.language) return normalizeLang(navigator.language);
    } catch (e3) {}
    return 'en';
  }
  function localeForLang(lang) {
    var map = { en: 'en-US', de: 'de-DE', es: 'es-ES', it: 'it-IT', fr: 'fr-FR' };
    return map[normalizeLang(lang)] || 'en-US';
  }
  function getMonthFormatter() {
    return new Intl.DateTimeFormat(localeForLang(state.lang), { month: 'long', year: 'numeric' });
  }
  function getDayFormatter() {
    return new Intl.DateTimeFormat(localeForLang(state.lang), { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function getTimeFormatter() {
    return function (t) {
      if (!t) return '';
      var clean = safeString(t).replace(/\s*(uhr|h)\s*$/i, '').trim();
      var fmts = {
        en: function (x) { return x; },
        de: function (x) { return x + ' Uhr'; },
        es: function (x) { return x + ' h'; },
        it: function (x) { return 'ore ' + x; },
        fr: function (x) { return x.replace(':', 'h'); }
      };
      return (fmts[state.lang] || fmts.en)(clean);
    };
  }
  function readStoredFilter() {
    try {
      var v = localStorage.getItem(STORAGE_FILTER);
      return /^(all|public|private)$/.test(v) ? v : 'all';
    } catch (e) {
      return 'all';
    }
  }
  function readStoredCollapsed() {
    try {
      var raw = localStorage.getItem(STORAGE_COLLAPSED);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }
  function persistFilter() {
    try { localStorage.setItem(STORAGE_FILTER, state.visibility); } catch (e) {}
  }
  function persistCollapsed() {
    try { localStorage.setItem(STORAGE_COLLAPSED, JSON.stringify(state.collapsed || {})); } catch (e) {}
  }
  function defaultAgendaScope() {
    var now = new Date();
    var to = new Date(now.getFullYear(), now.getMonth() + 5, 1);
    return {
      mode: 'upcoming',
      year: now.getFullYear(),
      fromMonth: String(now.getFullYear()) + '-' + String(now.getMonth() + 1).padStart(2, '0'),
      toMonth: String(to.getFullYear()) + '-' + String(to.getMonth() + 1).padStart(2, '0')
    };
  }
  function readStoredScope() {
    var fallback = defaultAgendaScope();
    try {
      var raw = localStorage.getItem(STORAGE_SCOPE);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return fallback;
      var scope = normalizeAgendaScope(parsed);
      return scope || fallback;
    } catch (e) {
      return fallback;
    }
  }
  function persistScope() {
    try { localStorage.setItem(STORAGE_SCOPE, JSON.stringify(state.scope || defaultAgendaScope())); } catch (e) {}
  }
  function setAgendaLanguage(lang) {
    var next = normalizeLang(lang);
    if (next === state.lang) return;
    state.lang = next;
    try { localStorage.setItem(AGENDA_LANG_KEY, next); } catch (e) {}
    try { document.documentElement.lang = next; } catch (e2) {}
    safeRender();
  }
  function normalizeMonthValue(raw) {
    var s = safeString(raw).trim();
    if (!/^\d{4}-\d{2}$/.test(s)) return '';
    var parts = s.split('-');
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    if (!Number.isFinite(year) || year < 2000 || year > 2099) return '';
    if (!Number.isFinite(month) || month < 1 || month > 12) return '';
    return String(year) + '-' + String(month).padStart(2, '0');
  }
  function normalizeAgendaScope(raw) {
    var now = new Date();
    var scope = raw && typeof raw === 'object' ? raw : {};
    var mode = safeString(scope.mode || 'upcoming').trim().toLowerCase();
    if (['upcoming', 'month', 'next_3m', 'next_6m', 'year', 'custom_year', 'custom_months'].indexOf(mode) < 0) mode = 'upcoming';
    var year = Number(scope.year);
    if (!Number.isFinite(year) || year < 2000 || year > 2099) year = now.getFullYear();
    var fromMonth = normalizeMonthValue(scope.fromMonth || scope.from || '');
    var toMonth = normalizeMonthValue(scope.toMonth || scope.to || '');
    if (!fromMonth) fromMonth = String(now.getFullYear()) + '-' + String(now.getMonth() + 1).padStart(2, '0');
    if (!toMonth) toMonth = String(now.getFullYear()) + '-' + String(now.getMonth() + 6).padStart(2, '0');
    return { mode: mode, year: year, fromMonth: fromMonth, toMonth: toMonth };
  }
  function setScope(next) {
    state.scope = normalizeAgendaScope(Object.assign({}, state.scope || defaultAgendaScope(), next || {}));
    persistScope();
    safeRender();
  }
  function scopeOptionText(value) {
    var copy = icCopy();
    var map = {
      upcoming: copy.scopeSelectUpcoming || copy.scopeUpcoming,
      month: copy.scopeSelectThisMonth || copy.scopeThisMonth,
      next_3m: copy.scopeSelectNext3Months || copy.scopeNext3Months,
      next_6m: copy.scopeSelectNext6Months || copy.scopeNext6Months,
      year: copy.scopeSelectThisYear || copy.scopeThisYear,
      custom_year: copy.scopeSelectCustomYear || copy.scopeYearLabel,
      custom_months: copy.scopeSelectCustomMonths || copy.scopeCustomMonths
    };
    return map[value] || value;
  }
  function syncScopeControls() {
    var copy = icCopy();
    var scope = normalizeAgendaScope(state.scope || defaultAgendaScope());
    var select = qs('icScopeSelect');
    if (select && select.value !== scope.mode) select.value = scope.mode;
    if (select) {
      Array.prototype.forEach.call(select.options || [], function (opt) {
        if (opt && opt.value) opt.textContent = scopeOptionText(opt.value);
      });
    }
    var yearWrap = qs('icScopeYearWrap');
    var fromWrap = qs('icScopeFromWrap');
    var toWrap = qs('icScopeToWrap');
    var yearInput = qs('icScopeYear');
    var fromInput = qs('icScopeFrom');
    var toInput = qs('icScopeTo');
    if (yearInput) yearInput.value = String(scope.year || new Date().getFullYear());
    if (fromInput) fromInput.value = scope.fromMonth || '';
    if (toInput) toInput.value = scope.toMonth || '';
    if (yearWrap) yearWrap.hidden = scope.mode !== 'custom_year';
    if (fromWrap) fromWrap.hidden = scope.mode !== 'custom_months';
    if (toWrap) toWrap.hidden = scope.mode !== 'custom_months';
    var presetSeason = qs('icPresetSeasonBtn');
    if (presetSeason && copy.presetSeason) presetSeason.textContent = copy.presetSeason.replace('{year}', String(new Date().getFullYear()));
  }
  function readLegacyJson(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) raw = localStorage.getItem('rg_local_' + key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.value != null) return parsed.value;
      return parsed;
    } catch (e) {
      return null;
    }
  }
  function extractArrayLike(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.perfs)) return raw.perfs;
      if (Array.isArray(raw.items)) return raw.items;
      if (Array.isArray(raw.value)) return raw.value;
      if (Array.isArray(raw.data)) return raw.data;
    }
    return null;
  }
  function fetchFirestoreDocJson(key) {
    var url = 'https://firestore.googleapis.com/v1/projects/' + FIRESTORE_PROJECT_ID + '/databases/(default)/documents/rg/' + encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (doc) {
        var v = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
        if (!v || typeof v !== 'string') return null;
        try { return JSON.parse(v); } catch (e) { return null; }
      })
      .catch(function () { return null; });
  }
  function fetchBundledCalendar() {
    return fetch('/v1-assets/data/calendar-data.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }
  function logCalendar(level, message, data) {
    var fn = (console && console[level]) ? console[level] : console.log;
    try {
      if (typeof data !== 'undefined') fn.call(console, '[InternalCalendar] ' + message, data);
      else fn.call(console, '[InternalCalendar] ' + message);
    } catch (e) {}
  }
  function loadSource(label, loader) {
    logCalendar('info', 'Attempting ' + label);
    return Promise.resolve()
      .then(loader)
      .then(function (value) {
        var ok = value != null;
        var count = 0;
        if (Array.isArray(value)) count = value.length;
        else if (value && typeof value === 'object') {
          var arr = extractArrayLike(value);
          if (arr) count = arr.length;
          else if (Array.isArray(value.perfs)) count = value.perfs.length;
        }
        if (ok) logCalendar('info', 'Loaded ' + label + ' (' + count + ' items)');
        else logCalendar('warn', 'Loaded empty result from ' + label);
        return { label: label, ok: ok, value: value, count: count };
      })
      .catch(function (err) {
        logCalendar('warn', 'Failed ' + label, err && err.message ? err.message : err);
        return { label: label, ok: false, value: null, count: 0, error: err };
      });
  }
  function safeHtml(s) {
    return safeString(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function icCopy() {
    return IC_COPY[normalizeLang(state.lang)] || IC_COPY.en;
  }
  function pluralize(count, singular, plural) {
    return Number(count) === 1 ? singular : plural;
  }
  function isTruthyFlag(v) {
    if (v === true) return true;
    var s = safeString(v).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'on';
  }
  function parseMaybeDate(raw) {
    var s = safeString(raw).trim();
    if (!s) return null;
    var d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    return null;
  }
  function parseTextDate(day, month) {
    var d = safeString(day).trim();
    var m = safeString(month).trim();
    if (!d && !m) return null;
    var raw = (d && d !== 'TBA' ? d + ' ' : '1 ') + (m || 'Jan 2099');
    var dt = new Date(raw);
    return isNaN(dt.getTime()) ? null : dt;
  }
  function normalizeLocalizedTitle(raw, lang) {
    var o = raw && typeof raw === 'object' ? raw : {};
    return safeString(o['title_' + lang] || o.title || o.name || '');
  }
  function normalizeLocalizedNote(raw, lang) {
    var o = raw && typeof raw === 'object' ? raw : {};
    var text = safeString(
      o['detail_' + lang] ||
      o.detail ||
      o['extDesc_' + lang] ||
      o.extDesc ||
      o['description_' + lang] ||
      o.description ||
      ''
    ).trim();
    if (!text) return '';
    var firstParagraph = text.split(/\n\s*\n/)[0].trim();
    if (firstParagraph.length > 220) {
      firstParagraph = firstParagraph.slice(0, 217).replace(/\s+\S*$/, '') + '…';
    }
    return firstParagraph;
  }
  function shouldShowPublic(item) {
    if (!item || typeof item !== 'object') return false;
    if (item.private === true) return false;
    if (item.source === 'archive') return !item.private;
    var st = safeString(item.status).trim().toLowerCase();
    var es = safeString(item.editorialStatus).trim().toLowerCase();
    if (st === 'hidden' || st === 'draft') return false;
    if (es === 'hidden' || es === 'draft' || es === 'needs_translation') return false;
    if (es && !PUBLIC_EDITORIAL[es]) return false;
    return true;
  }
  function normalizeCurrentEvent(raw, idx) {
    var o = raw && typeof raw === 'object' ? raw : {};
    var date = safeString(o.sortDate || o.date || '').trim();
    var dt = parseMaybeDate(date) || parseTextDate(o.day, o.month);
    var title = normalizeLocalizedTitle(o, state.lang);
    var note = normalizeLocalizedNote(o, state.lang);
    return {
      id: o.id != null ? String(o.id) : ('perf-' + (idx + 1)),
      source: 'current',
      sourceOrder: 1,
      title: title,
      note: note,
      venue: safeString(o.venue || o.place || '').trim(),
      city: safeString(o.city || '').trim(),
      time: safeString(o.time || '').trim(),
      status: safeString(o.status || 'upcoming').trim().toLowerCase(),
      editorialStatus: safeString(o.editorialStatus || '').trim().toLowerCase(),
      private: false,
      date: dt,
      original: o
    };
  }
  function normalizeArchiveEvent(raw, idx) {
    var o = raw && typeof raw === 'object' ? raw : {};
    var dt = parseMaybeDate(o.date);
    var title = normalizeLocalizedTitle(o, state.lang);
    var note = normalizeLocalizedNote(o, state.lang);
    if (!note) note = safeString(o.description || '').trim();
    return {
      id: o.id != null ? String(o.id) : ('past-' + (idx + 1)),
      source: 'archive',
      sourceOrder: 0,
      title: title,
      note: note,
      venue: safeString(o.place || o.venue || '').trim(),
      city: safeString(o.city || '').trim(),
      address: safeString(o.address || '').trim(),
      time: safeString(o.time || '').trim(),
      status: 'past',
      editorialStatus: '',
      private: !!o.private,
      date: dt,
      original: o
    };
  }
  function normalizeEventsSafely(list, normalizer, sourceLabel) {
    var out = [];
    (list || []).forEach(function (item, idx) {
      try {
        var normalized = normalizer(item, idx);
        if (normalized) out.push(normalized);
      } catch (err) {
        logCalendar('warn', 'Skipping bad item in ' + sourceLabel + ' #' + (idx + 1), err && err.message ? err.message : err);
      }
    });
    return out;
  }
  function eventKey(e) {
    var d = e.date ? e.date.toISOString().slice(0, 10) : 'nodate';
    return [d, e.title, e.venue, e.city, e.time].map(function (s) {
      return safeString(s).trim().toLowerCase();
    }).join('|');
  }
  function mergeEvent(existing, next) {
    var out = Object.assign({}, existing);
    if (!out.title && next.title) out.title = next.title;
    if (!out.note && next.note) out.note = next.note;
    if (!out.venue && next.venue) out.venue = next.venue;
    if (!out.city && next.city) out.city = next.city;
    if (!out.time && next.time) out.time = next.time;
    if (!out.date && next.date) out.date = next.date;
    if (!out.private && next.private) out.private = true;
    if (next.sourceOrder > out.sourceOrder) {
      out.source = next.source;
      out.sourceOrder = next.sourceOrder;
      out.status = next.status || out.status;
      out.editorialStatus = next.editorialStatus || out.editorialStatus;
    }
    return out;
  }
  function dedupeEvents(events) {
    var map = {};
    events.forEach(function (e) {
      var key = eventKey(e);
      if (!map[key]) {
        map[key] = e;
      } else {
        map[key] = mergeEvent(map[key], e);
      }
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }
  function monthKeyForDate(dt) {
    if (!dt) return '9999-12';
    var y = dt.getFullYear();
    var m = String(dt.getMonth() + 1).padStart(2, '0');
    if (y > 2090) return '9999-12';
    return String(y) + '-' + m;
  }
  function monthLabelForDate(dt) {
    if (!dt) return 'TBA';
    return new Intl.DateTimeFormat(localeForLang(state.lang), { month: 'long', year: 'numeric' }).format(dt);
  }
  function dateLabelForEvent(e) {
    if (!e.date) return safeString(e.time || '').trim() || 'TBA';
    var d = new Intl.DateTimeFormat(localeForLang(state.lang), { day: 'numeric', month: 'short', year: 'numeric' }).format(e.date);
    var t = safeString(e.time).trim();
    if (t) {
      var clean = t.replace(/\s*(uhr|h)\s*$/i, '').trim();
      var fmts = {
        en: function (x) { return x; },
        de: function (x) { return x + ' Uhr'; },
        es: function (x) { return x + ' h'; },
        it: function (x) { return 'ore ' + x; },
        fr: function (x) { return x.replace(':', 'h'); }
      };
      t = (fmts[state.lang] || fmts.en)(clean);
      return d + ' · ' + t;
    }
    return d;
  }
  function visibilityLabelFor(e) {
    var copy = icCopy();
    return shouldShowPublic(e) ? copy.filterPublic : copy.filterPrivate;
  }
  function visibilityClassFor(e) {
    return shouldShowPublic(e) ? 'ic-pill--public' : 'ic-pill--private';
  }
  function agendaScopeStartOfMonth(dt) {
    return new Date(dt.getFullYear(), dt.getMonth(), 1);
  }
  function agendaScopeEndOfMonth(dt) {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0, 23, 59, 59, 999);
  }
  function agendaScopeAddMonths(dt, months) {
    return new Date(dt.getFullYear(), dt.getMonth() + months, 1);
  }
  function parseMonthValue(value) {
    var s = normalizeMonthValue(value);
    if (!s) return null;
    var parts = s.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  }
  function agendaScopeLabel() {
    var copy = icCopy();
    var scope = normalizeAgendaScope(state.scope || defaultAgendaScope());
    var now = new Date();
    if (scope.mode === 'month') return copy.scopeThisMonth;
    if (scope.mode === 'next_3m') return copy.scopeNext3Months;
    if (scope.mode === 'next_6m') return copy.scopeNext6Months;
    if (scope.mode === 'year') return copy.scopeThisYear;
    if (scope.mode === 'custom_year') return String(scope.year);
    if (scope.mode === 'custom_months') {
      var from = parseMonthValue(scope.fromMonth);
      var to = parseMonthValue(scope.toMonth);
      var fmt = new Intl.DateTimeFormat(localeForLang(state.lang), { month: 'short', year: 'numeric' });
      if (from && to) return fmt.format(from) + ' – ' + fmt.format(to);
      return copy.scopeCustomMonths;
    }
    if (scope.mode === 'upcoming') return copy.scopeUpcoming;
    return copy.scopeUpcoming;
  }
  function scopeMatchesEvent(e) {
    var scope = normalizeAgendaScope(state.scope || defaultAgendaScope());
    var dt = e && e.date ? e.date : null;
    if (!dt) return true;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var monthStart = agendaScopeStartOfMonth(now);
    if (scope.mode === 'upcoming') return dt.getTime() >= today.getTime();
    if (scope.mode === 'month') return dt >= monthStart && dt <= agendaScopeEndOfMonth(now);
    if (scope.mode === 'next_3m') return dt >= monthStart && dt <= agendaScopeEndOfMonth(agendaScopeAddMonths(monthStart, 2));
    if (scope.mode === 'next_6m') return dt >= monthStart && dt <= agendaScopeEndOfMonth(agendaScopeAddMonths(monthStart, 5));
    if (scope.mode === 'year') return dt.getFullYear() === now.getFullYear();
    if (scope.mode === 'custom_year') return dt.getFullYear() === Number(scope.year);
    if (scope.mode === 'custom_months') {
      var from = parseMonthValue(scope.fromMonth);
      var to = parseMonthValue(scope.toMonth);
      if (!from || !to) return true;
      if (to < from) {
        var swap = from;
        from = to;
        to = swap;
      }
      return dt >= agendaScopeStartOfMonth(from) && dt <= agendaScopeEndOfMonth(to);
    }
    return true;
  }
  function applyInterfaceCopy() {
    var copy = icCopy();
    var nodes = [
      ['icKicker', copy.kicker],
      ['icTitle', copy.title],
      ['icLead', copy.lead],
      ['icAgendaLangLabel', copy.agendaLanguage],
      ['icScopeLabel', copy.scopeLabel],
      ['icScopeYearLabel', copy.scopeYearLabel],
      ['icScopeFromLabel', copy.scopeFromLabel],
      ['icScopeToLabel', copy.scopeToLabel],
      ['icFilterAll', copy.filterAll],
      ['icFilterPublic', copy.filterPublic],
      ['icFilterPrivate', copy.filterPrivate],
      ['icCollapseAllBtn', copy.collapseAll],
      ['icExpandAllBtn', copy.expandAll],
      ['icPrintBtn', copy.printAgenda],
      ['icBackAdminBtn', copy.backToAdmin],
      ['icPresetUpcomingBtn', copy.presetUpcoming],
      ['icPresetThisYearBtn', copy.presetThisYear],
      ['icPresetSeasonBtn', copy.presetSeason.replace('{year}', String(new Date().getFullYear()))],
      ['icPresetPublicOnlyBtn', copy.presetPublicOnly],
      ['icPresetPrivatePlanningBtn', copy.presetPrivatePlanning],
      ['icLoading', copy.loading],
      ['icSummary', copy.loading]
    ];
    nodes.forEach(function (pair) {
      var node = qs(pair[0]);
      if (node && pair[1]) node.textContent = pair[1];
    });
    var monthIndex = qs('icMonthIndex');
    if (monthIndex && copy.monthIndexLabel) monthIndex.setAttribute('aria-label', copy.monthIndexLabel);
    var overview = qs('icOverview');
    if (overview && copy.overviewLabel) overview.setAttribute('aria-label', copy.overviewLabel);
    if (document.title) document.title = copy.pageTitle || document.title;
    var printNote = qs('icPrintNote');
    if (printNote) printNote.textContent = copy.printNote;
    syncScopeControls();
  }
  function renderOverview() {
    var el = qs('icOverview');
    if (!el) return;
    var copy = icCopy();
    if (state.loading) {
      el.innerHTML = '<div class="ic-overview__label">' + safeHtml(copy.overviewLabel) + '</div>' +
        '<div class="ic-overview__grid">' +
          '<div class="ic-stat ic-stat--placeholder"></div>' +
          '<div class="ic-stat ic-stat--placeholder"></div>' +
          '<div class="ic-stat ic-stat--placeholder"></div>' +
          '<div class="ic-stat ic-stat--placeholder"></div>' +
          '<div class="ic-stat ic-stat--placeholder"></div>' +
        '</div>';
      return;
    }
    if (state.error) {
      el.innerHTML = '<div class="ic-overview__label">' + safeHtml(copy.overviewLabel) + '</div>' +
      '<div class="ic-overview__grid"><div class="ic-stat ic-stat--error">' + safeHtml(state.error) + '</div></div>';
      return;
    }
    var filtered = filteredEvents();
    var groups = groupEvents(filtered);
    var publicCount = filtered.filter(function (e) { return shouldShowPublic(e); }).length;
    var privateCount = filtered.length - publicCount;
    var next = filtered.filter(function (e) { return e.date && e.date.getTime() >= new Date().setHours(0, 0, 0, 0); })[0] || null;
    var nextLabel = next ? [dateLabelForEvent(next), next.title].filter(Boolean).join(' · ') : copy.noUpcoming;
    el.innerHTML = '<div class="ic-overview__label">' + safeHtml(copy.overviewLabel) + '</div>' +
      '<div class="ic-overview__grid">' +
        '<div class="ic-stat"><strong>' + safeHtml(String(filtered.length)) + '</strong><span>' + safeHtml(copy.totalEvents) + '</span></div>' +
        '<div class="ic-stat"><strong>' + safeHtml(String(publicCount)) + '</strong><span>' + safeHtml(copy.publicEvents) + '</span></div>' +
        '<div class="ic-stat"><strong>' + safeHtml(String(privateCount)) + '</strong><span>' + safeHtml(copy.privateEvents) + '</span></div>' +
        '<div class="ic-stat"><strong>' + safeHtml(String(groups.length)) + '</strong><span>' + safeHtml(copy.monthsShown) + '</span></div>' +
        '<div class="ic-stat ic-stat--wide"><strong>' + safeHtml(next ? copy.nextEvent : copy.nextEvent) + '</strong><span>' + safeHtml(nextLabel) + '</span></div>' +
      '</div>';
  }
  function loadEvents() {
    state.loading = true;
    state.error = '';
    state.pendingPrint = false;
    updateSummary();
    var legacyCurrent = readLegacyJson('rg_perfs');
    var legacyArchive = readLegacyJson('rg_past_perfs');
    return Promise.all([
      loadSource('Firestore rg_perfs', function () { return fetchFirestoreDocJson('rg_perfs'); }),
      loadSource('Firestore rg_past_perfs', function () { return fetchFirestoreDocJson('rg_past_perfs'); }),
      loadSource('Bundled calendar-data.json', function () { return fetchBundledCalendar(); }),
      loadSource('localStorage rg_perfs', function () { return legacyCurrent; }),
      loadSource('localStorage rg_past_perfs', function () { return legacyArchive; })
    ]).then(function (results) {
      var byLabel = {};
      results.forEach(function (r) {
        byLabel[r.label] = r;
      });
      var bundle = byLabel['Bundled calendar-data.json'] && byLabel['Bundled calendar-data.json'].value;
      var current = extractArrayLike(byLabel['Firestore rg_perfs'] && byLabel['Firestore rg_perfs'].value) ||
        extractArrayLike(byLabel['localStorage rg_perfs'] && byLabel['localStorage rg_perfs'].value) ||
        extractArrayLike(bundle) || extractArrayLike(bundle && bundle.perfs) || [];
      var archive = extractArrayLike(byLabel['Firestore rg_past_perfs'] && byLabel['Firestore rg_past_perfs'].value) ||
        extractArrayLike(byLabel['localStorage rg_past_perfs'] && byLabel['localStorage rg_past_perfs'].value) ||
        extractArrayLike(bundle && bundle.pastPerfs) ||
        extractArrayLike(bundle && bundle.archive) || [];
      var anySourceSucceeded = results.some(function (r) { return r && r.ok; });
      logCalendar('info', 'Resolved calendar sources', {
        current: current.length,
        archive: archive.length,
        sourceStatus: results.map(function (r) { return { label: r.label, ok: r.ok, count: r.count }; })
      });
      if (!anySourceSucceeded) {
        state.loading = false;
        state.pendingPrint = false;
        state.error = icCopy().error;
        logCalendar('warn', 'All calendar sources failed; showing global error');
        safeRender();
        return;
      }
      var normalized = []
        .concat(normalizeEventsSafely(current, normalizeCurrentEvent, 'current'))
        .concat(normalizeEventsSafely(archive, normalizeArchiveEvent, 'archive'));
      state.events = dedupeEvents(normalized)
        .filter(function (e) { return e.title || e.note || e.venue || e.city; })
        .sort(function (a, b) {
          var ta = a.date ? a.date.getTime() : 9999999999999;
          var tb = b.date ? b.date.getTime() : 9999999999999;
          if (ta !== tb) return ta - tb;
          return safeString(a.title).localeCompare(safeString(b.title));
        });
      state.loading = false;
      state.error = '';
      logCalendar('info', 'Agenda loaded', {
        sources: results.map(function (r) { return { label: r.label, ok: r.ok, count: r.count }; }),
        events: state.events.length
      });
      safeRender();
    }).catch(function (err) {
      state.loading = false;
      state.pendingPrint = false;
      state.error = icCopy().error;
      logCalendar('warn', 'Unexpected calendar loader failure', err && err.message ? err.message : err);
      safeRender();
    });
  }
  function filteredEvents() {
    var list = state.events.slice();
    list = list.filter(scopeMatchesEvent);
    if (state.visibility === 'public') list = list.filter(function (e) { return shouldShowPublic(e); });
    if (state.visibility === 'private') list = list.filter(function (e) { return !shouldShowPublic(e); });
    return list;
  }
  function groupEvents(list) {
    var groups = {};
    list.forEach(function (e) {
      var key = monthKeyForDate(e.date);
      if (!groups[key]) groups[key] = { key: key, date: e.date, label: monthLabelForDate(e.date), items: [] };
      groups[key].items.push(e);
    });
    return Object.keys(groups).sort().map(function (k) { return groups[k]; });
  }
  function setActiveFilter(next) {
    state.visibility = next;
    persistFilter();
    safeRender();
  }
  function setScopeMode(mode) {
    var now = new Date();
    var current = normalizeAgendaScope(state.scope || defaultAgendaScope());
    var next = Object.assign({}, current, { mode: mode });
    if (mode === 'year') next.year = now.getFullYear();
    if (mode === 'custom_year' && !next.year) next.year = now.getFullYear();
    if (mode === 'custom_months') {
      if (!next.fromMonth || !next.toMonth) {
        var fallback = defaultAgendaScope();
        next.fromMonth = next.fromMonth || fallback.fromMonth;
        next.toMonth = next.toMonth || fallback.toMonth;
      }
    }
    setScope(next);
  }
  function setCollapsed(key, collapsed) {
    if (collapsed) state.collapsed[key] = 1;
    else delete state.collapsed[key];
    persistCollapsed();
    safeRender();
  }
  function setAllCollapsed(collapsed) {
    var next = {};
    if (collapsed) {
      groupEvents(filteredEvents()).forEach(function (g) { next[g.key] = 1; });
    }
    state.collapsed = next;
    persistCollapsed();
    safeRender();
  }
  function renderEmpty(message) {
    var monthIndex = qs('icMonthIndex');
    var months = qs('icMonths');
    if (monthIndex) monthIndex.innerHTML = '';
    if (months) months.innerHTML = '<div class="ic-empty">' + safeHtml(message) + '</div>';
  }
  function updateSummary() {
    var copy = icCopy();
    var summary = qs('icSummary');
    if (!summary) return;
    try {
      var filtered = filteredEvents();
      var months = groupEvents(filtered).length;
      if (state.loading) {
        summary.textContent = copy.loading;
      } else if (state.error) {
        summary.textContent = state.error;
      } else {
        var vis = state.visibility === 'all' ? '' : (' · ' + (state.visibility === 'public' ? copy.filterPublic : copy.filterPrivate));
        var scope = agendaScopeLabel();
        summary.textContent = copy.summaryTemplate.replace('{events}', String(filtered.length)).replace('{months}', String(months)) + vis + (scope ? (' · ' + scope) : '');
      }
    } catch (err) {
      logCalendar('warn', 'Summary render failed', err && err.message ? err.message : err);
      summary.textContent = '';
    }
  }
  function renderMonthIndex(groups) {
    var index = qs('icMonthIndex');
    if (!index) return;
    var copy = icCopy();
    if (!groups.length) {
      index.innerHTML = '';
      return;
    }
    var html = [];
    var years = {};
    groups.forEach(function (g) {
      var y = g.date ? g.date.getFullYear() : null;
      if (y != null && !years[y]) years[y] = g.key;
    });
    Object.keys(years).sort().forEach(function (year) {
      html.push('<a class="ic-month-chip ic-month-chip--year" href="#month-' + safeHtml(years[year]) + '">' + safeHtml(year) + '</a>');
    });
    html.push(groups.map(function (g) {
      return '<a class="ic-month-chip" href="#month-' + safeHtml(g.key) + '">' + safeHtml(g.label) + '</a>';
    }).join(''));
    index.innerHTML = html.join('');
  }
  function renderEventMarkup(e, copy) {
    var visibility = visibilityLabelFor(e);
    var venueBits = [];
    if (e.venue) venueBits.push(e.venue);
    if (e.city) venueBits.push(e.city);
    if (e.address) venueBits.push(e.address);
    var venueLine = venueBits.join(' · ');
    return '<article class="ic-event ic-event--' + (shouldShowPublic(e) ? 'public' : 'private') + '">' +
      '<div class="ic-event__date">' +
        '<strong>' + safeHtml(e.date ? new Intl.DateTimeFormat(localeForLang(state.lang), { day: 'numeric' }).format(e.date) : 'TBA') + '</strong>' +
        (e.date ? '<span class="ic-event__date-sub">' + safeHtml(new Intl.DateTimeFormat(localeForLang(state.lang), { month: 'short', year: 'numeric' }).format(e.date)) + '</span>' : '') +
      '</div>' +
      '<div class="ic-event__body">' +
        '<div class="ic-event__meta">' +
          '<span class="ic-pill ' + visibilityClassFor(e) + '">' + safeHtml(visibility) + '</span>' +
          (e.time ? '<span class="ic-event__time">' + safeHtml(getTimeFormatter()(e.time)) + '</span>' : '') +
        '</div>' +
        (e.title ? '<h3 class="ic-event__title">' + safeHtml(e.title) + '</h3>' : '') +
        (venueLine ? '<div class="ic-event__venue">' + safeHtml(venueLine) + '</div>' : '') +
        (e.note ? '<div class="ic-event__note">' + safeHtml(e.note) + '</div>' : '') +
      '</div>' +
    '</article>';
  }
  function renderMonthMarkup(g, copy) {
    var collapsed = !!state.collapsed[g.key];
    var monthCount = g.items.length;
    var publicCount = g.items.filter(function (e) { return shouldShowPublic(e); }).length;
    var privateCount = monthCount - publicCount;
    var itemsHtml = g.items.map(function (e) {
      try {
        return renderEventMarkup(e, copy);
      } catch (err) {
        logCalendar('warn', 'Skipping event render for ' + g.key, err && err.message ? err.message : err);
        return '';
      }
    }).join('');
    return '<section class="ic-month' + (collapsed ? ' is-collapsed' : '') + '" id="month-' + safeHtml(g.key) + '" data-month-key="' + safeHtml(g.key) + '">' +
      '<div class="ic-month__head">' +
        '<div class="ic-month__title">' +
          '<button type="button" class="ic-month__toggle" data-month-toggle="' + safeHtml(g.key) + '" aria-expanded="' + (collapsed ? 'false' : 'true') + '">' + safeHtml(g.label) + '</button>' +
        '</div>' +
        '<div class="ic-month__meta">' +
          '<span class="ic-pill ic-pill--count">' + safeHtml(String(monthCount) + ' ' + pluralize(monthCount, copy.eventWord, copy.eventsWord)) + '</span>' +
          (publicCount ? '<span class="ic-pill ic-pill--public">' + safeHtml(String(publicCount) + ' ' + copy.filterPublic.toLowerCase()) + '</span>' : '') +
          (privateCount ? '<span class="ic-pill ic-pill--private">' + safeHtml(String(privateCount) + ' ' + copy.filterPrivate.toLowerCase()) + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="ic-month__body">' + itemsHtml + '</div>' +
      '<div class="ic-month__footer">' +
        '<button type="button" data-month-toggle="' + safeHtml(g.key) + '">' + safeHtml(collapsed ? copy.monthExpand : copy.monthCollapse) + '</button>' +
      '</div>' +
    '</section>';
  }
  function safeRender() {
    try { applyInterfaceCopy(); } catch (err) { logCalendar('warn', 'Interface copy update failed', err && err.message ? err.message : err); }
    try { updateSummary(); } catch (err2) { logCalendar('warn', 'Summary update failed', err2 && err2.message ? err2.message : err2); }
    try { renderOverview(); } catch (err3) {
      logCalendar('warn', 'Overview render failed', err3 && err3.message ? err3.message : err3);
      var overview = qs('icOverview');
      if (overview) overview.innerHTML = '';
    }
    var loading = qs('icLoading');
    var monthsEl = qs('icMonths');
    if (!monthsEl) return;
    if (loading) loading.style.display = state.loading ? '' : 'none';
    try {
      var events = filteredEvents();
      if (state.loading) {
        monthsEl.innerHTML = '';
        renderMonthIndex([]);
        return;
      }
      if (state.error) {
        renderEmpty(state.error);
        renderMonthIndex([]);
        return;
      }
      if (!events.length) {
        renderEmpty(icCopy().noResults);
        renderMonthIndex([]);
        return;
      }
      var groups = groupEvents(events);
      renderMonthIndex(groups);
      monthsEl.innerHTML = groups.map(function (g) {
        try {
          return renderMonthMarkup(g, icCopy());
        } catch (err) {
          logCalendar('warn', 'Month render failed for ' + g.key, err && err.message ? err.message : err);
          return '';
        }
      }).join('');
      monthsEl.querySelectorAll('[data-month-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.getAttribute('data-month-toggle');
          var current = !!state.collapsed[key];
          setCollapsed(key, !current);
        });
      });
      monthsEl.querySelectorAll('.ic-month-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var target = document.querySelector(chip.getAttribute('href'));
          if (target) {
            setTimeout(function () { target.classList.add('ic-month--flash'); }, 0);
            setTimeout(function () { target.classList.remove('ic-month--flash'); }, 1100);
          }
        });
      });
      document.querySelectorAll('[data-ic-filter]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-ic-filter') === state.visibility ? 'true' : 'false');
      });
      if (state.pendingPrint && !state.loading && !state.error) {
        state.pendingPrint = false;
        scheduleAgendaPrint();
      }
    } catch (err4) {
      logCalendar('warn', 'Timeline render failed', err4 && err4.message ? err4.message : err4);
      renderEmpty(icCopy().error);
      renderMonthIndex([]);
    }
  }
  function setPrintNote(text, show) {
    var note = qs('icPrintNote');
    if (!note) return;
    if (!text) {
      note.hidden = true;
      note.textContent = '';
      return;
    }
    note.textContent = text;
    note.hidden = show === false ? true : false;
  }
  function waitForAgendaPaint() {
    var waits = [];
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      waits.push(Promise.race([
        document.fonts.ready.catch(function () {}),
        new Promise(function (resolve) { setTimeout(resolve, 800); })
      ]));
    }
    waits.push(new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTimeout(resolve, 120);
        });
      });
    }));
    return Promise.all(waits);
  }
  function scheduleAgendaPrint() {
    var copy = icCopy();
    setPrintNote(copy.printReady, true);
    waitForAgendaPaint().then(function () {
      try {
        window.print();
      } catch (e) {
        setPrintNote(copy.printNote, true);
      }
    });
  }
  function requestAgendaPrint() {
    var copy = icCopy();
    if (state.loading) {
      state.pendingPrint = true;
      setPrintNote(copy.printNote, true);
      updateSummary();
      return;
    }
    if (state.error) {
      state.pendingPrint = false;
      setPrintNote(copy.error, true);
      return;
    }
    var monthsEl = qs('icMonths');
    if (!monthsEl || !monthsEl.querySelector('.ic-month')) {
      setPrintNote(copy.noResults || copy.printNote, true);
      return;
    }
    scheduleAgendaPrint();
  }
  function wireControls() {
    var langSelect = qs('icLangSelect');
    if (langSelect) {
      langSelect.addEventListener('change', function () {
        setAgendaLanguage(langSelect.value);
      });
    }
    var scopeSelect = qs('icScopeSelect');
    if (scopeSelect) {
      scopeSelect.addEventListener('change', function () {
        setScopeMode(scopeSelect.value);
      });
    }
    var scopeYear = qs('icScopeYear');
    if (scopeYear) {
      scopeYear.addEventListener('change', function () {
        setScope(Object.assign({}, state.scope || defaultAgendaScope(), { year: Number(scopeYear.value) || (new Date()).getFullYear() }));
      });
    }
    var scopeFrom = qs('icScopeFrom');
    if (scopeFrom) {
      scopeFrom.addEventListener('change', function () {
        setScope(Object.assign({}, state.scope || defaultAgendaScope(), { fromMonth: normalizeMonthValue(scopeFrom.value) || (state.scope && state.scope.fromMonth) || defaultAgendaScope().fromMonth }));
      });
    }
    var scopeTo = qs('icScopeTo');
    if (scopeTo) {
      scopeTo.addEventListener('change', function () {
        setScope(Object.assign({}, state.scope || defaultAgendaScope(), { toMonth: normalizeMonthValue(scopeTo.value) || (state.scope && state.scope.toMonth) || defaultAgendaScope().toMonth }));
      });
    }
    document.querySelectorAll('[data-ic-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActiveFilter(btn.getAttribute('data-ic-filter'));
      });
    });
    var collapse = qs('icCollapseAllBtn');
    var expand = qs('icExpandAllBtn');
    var printBtn = qs('icPrintBtn');
    var presetUpcoming = qs('icPresetUpcomingBtn');
    var presetThisYear = qs('icPresetThisYearBtn');
    var presetSeason = qs('icPresetSeasonBtn');
    var presetPublicOnly = qs('icPresetPublicOnlyBtn');
    var presetPrivatePlanning = qs('icPresetPrivatePlanningBtn');
    if (collapse) collapse.addEventListener('click', function () { setAllCollapsed(true); });
    if (expand) expand.addEventListener('click', function () { setAllCollapsed(false); });
    if (printBtn) printBtn.addEventListener('click', function () { requestAgendaPrint(); });
    if (presetUpcoming) presetUpcoming.addEventListener('click', function () {
      setScope(Object.assign({}, defaultAgendaScope(), { mode: 'upcoming' }));
      setActiveFilter('all');
    });
    if (presetThisYear) presetThisYear.addEventListener('click', function () {
      setScope(Object.assign({}, defaultAgendaScope(), { mode: 'year', year: (new Date()).getFullYear() }));
      setActiveFilter('all');
    });
    if (presetSeason) presetSeason.addEventListener('click', function () {
      setScope(Object.assign({}, defaultAgendaScope(), { mode: 'year', year: (new Date()).getFullYear() }));
      setActiveFilter('all');
    });
    if (presetPublicOnly) presetPublicOnly.addEventListener('click', function () {
      setActiveFilter('public');
      setScope(Object.assign({}, defaultAgendaScope(), { mode: 'upcoming' }));
    });
    if (presetPrivatePlanning) presetPrivatePlanning.addEventListener('click', function () {
      setActiveFilter('private');
      setScope(Object.assign({}, defaultAgendaScope(), { mode: 'upcoming' }));
    });
    if (!state.afterPrintBound) {
      state.afterPrintBound = true;
      window.addEventListener('afterprint', function () {
        setPrintNote('', false);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.lang = state.lang;
    applyInterfaceCopy();
    wireControls();
    loadEvents();
  });
})();
