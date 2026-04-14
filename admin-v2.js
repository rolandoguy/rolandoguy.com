(function () {
  'use strict';

  var LANGS = ['en', 'de', 'es', 'it', 'fr'];
  /** Stored in rg_ui_<lang> — Home intro copy + presenter block (also shown on Biography). */
  var HOME_RG_UI_COPY_FIELDS = [
    { id: 'hero-homeIntroH2', key: 'home.intro.h2' },
    { id: 'hero-homeIntroP1', key: 'home.intro.p1' },
    { id: 'hero-homeIntroP2', key: 'home.intro.p2' },
    { id: 'hero-homeIntroProof', key: 'home.intro.proof' },
    { id: 'hero-presenterTag', key: 'home.presenter.tag' },
    { id: 'hero-presenterStyle', key: 'home.presenter.style' },
    { id: 'hero-presenterP1', key: 'home.presenter.p1' },
    { id: 'hero-presenterP2', key: 'home.presenter.p2' },
    { id: 'hero-presenterP3', key: 'home.presenter.p3' }
  ];
  /** Public UI strings in rg_ui_<lang> (beyond nav + home intro block). Built on first open of UI section. */
  function unpackPublicUiCopyGroups(packed) {
    return packed.map(function (g) {
      return {
        title: g[0],
        fields: g[1].map(function (r) {
          return { key: r[0], label: r[1], multi: !!r[2], rows: r[3] || 3 };
        })
      };
    });
  }
  var PUBLIC_RG_UI_COPY_GROUPS = unpackPublicUiCopyGroups([
    ['Global chrome & hero', [
      ['ui.skipMain', 'Skip to main link'],
      ['ui.menu', 'Hamburger · aria-label (Menu)'],
      ['ui.backToTop', 'Back to top · aria-label'],
      ['ui.close', 'Close (chrome)'],
      ['ui.closeEmbed', 'Close embed'],
      ['ui.closeVideoAria', 'Close video · aria-label'],
      ['ui.copied', 'Copied toast'],
      ['hero.scroll', 'Hero scroll hint text'],
      ['hero.scrollAria', 'Hero scroll · aria-label'],
      ['hero.nameHtml', 'Hero name (HTML)', 1, 4]
    ]],
    ['Nav logo (header)', [['nav.logo', 'Nav wordmark text']]],
    ['SEO · Home (`index`)', [
      ['page.index.title', 'Document <title>'],
      ['page.index.metaDescription', 'Meta description', 1, 2],
      ['page.index.ogTitle', 'Open Graph title (optional)', 0],
      ['page.index.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.index.twitterTitle', 'Twitter title (optional)', 0],
      ['page.index.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Calendar', [
      ['page.calendar.title', 'Document <title>'],
      ['page.calendar.metaDescription', 'Meta description', 1, 2],
      ['page.calendar.ogTitle', 'Open Graph title (optional)', 0],
      ['page.calendar.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.calendar.twitterTitle', 'Twitter title (optional)', 0],
      ['page.calendar.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Media', [
      ['page.media.title', 'Document <title>'],
      ['page.media.metaDescription', 'Meta description', 1, 2],
      ['page.media.ogTitle', 'Open Graph title (optional)', 0],
      ['page.media.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.media.twitterTitle', 'Twitter title (optional)', 0],
      ['page.media.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Press', [
      ['page.press.title', 'Document <title>'],
      ['page.press.metaDescription', 'Meta description', 1, 2],
      ['page.press.ogTitle', 'Open Graph title (optional)', 0],
      ['page.press.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.press.twitterTitle', 'Twitter title (optional)', 0],
      ['page.press.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Repertoire', [
      ['page.repertoire.title', 'Document <title>'],
      ['page.repertoire.metaDescription', 'Meta description', 1, 2],
      ['page.repertoire.ogTitle', 'Open Graph title (optional)', 0],
      ['page.repertoire.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.repertoire.twitterTitle', 'Twitter title (optional)', 0],
      ['page.repertoire.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Contact', [
      ['page.contact.title', 'Document <title>'],
      ['page.contact.metaDescription', 'Meta description', 1, 2],
      ['page.contact.ogTitle', 'Open Graph title (optional)', 0],
      ['page.contact.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.contact.twitterTitle', 'Twitter title (optional)', 0],
      ['page.contact.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Reviews', [
      ['page.reviews.title', 'Document <title>'],
      ['page.reviews.metaDescription', 'Meta description', 1, 2],
      ['page.reviews.ogTitle', 'Open Graph title (optional)', 0],
      ['page.reviews.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.reviews.twitterTitle', 'Twitter title (optional)', 0],
      ['page.reviews.twitterDescription', 'Twitter description (optional)', 1, 2]
    ]],
    ['SEO · Biography + JSON-LD', [
      ['page.biography.title', 'Document <title>'],
      ['page.biography.metaDescription', 'Meta description', 1, 2],
      ['page.biography.ogTitle', 'Open Graph title (optional)', 0],
      ['page.biography.ogDescription', 'Open Graph description (optional)', 1, 2],
      ['page.biography.twitterTitle', 'Twitter title (optional)', 0],
      ['page.biography.twitterDescription', 'Twitter description (optional)', 1, 2],
      ['page.biography.jsonLdDescription', 'JSON-LD · Person description', 1, 3],
      ['page.biography.jsonLdJobTitle', 'JSON-LD · jobTitle'],
      ['page.biography.jsonLdHomeLocation', 'JSON-LD · homeLocation.name']
    ]],
    ['Footer', [
      ['footer.brandLine', 'Footer brand line'],
      ['footer.tagline', 'Footer tagline'],
      ['footer.rights', 'Footer rights line'],
      ['footer.socialInstagram', 'Footer · Instagram link label'],
      ['footer.socialYoutube', 'Footer · YouTube link label'],
      ['footer.socialFacebook', 'Footer · Facebook link label'],
      ['footer.copyrightLead', 'Footer · copyright / name line (before rights)'],
      ['footer.locationLine', 'Footer · cities / location line'],
      ['footer.ornament', 'Footer · center ornament (e.g. ✦)']
    ]],
    ['Shared / biography', [
      ['about.photoLabel', 'Photo label (home about)'],
      ['bio.heroImageAlt', 'Biography hero image alt'],
      ['bio.loadError', 'Biography load error']
    ]],
    ['Home supporting', [
      ['home.intro.photoAlt', 'Home intro image alt'],
      ['home.explore.tag', 'Explore block tag'],
      ['home.explore.sub', 'Explore block subtitle', 1],
      ['home.explore.btnBookings', 'Explore · bookings button']
    ]],
    ['Repertoire (tabs & table)', [
      ['rep.tabOpera', 'Tab · Opera roles'],
      ['rep.tabArias', 'Tab · Opera arias'],
      ['rep.tabOperetta', 'Tab · Operetta'],
      ['rep.tabOperettaRoles', 'Tab · Operetta roles'],
      ['rep.tabLied', 'Tab · Lied'],
      ['rep.pageH2', 'Page title (HTML)', 1, 3],
      ['rep.thRole', 'Table · Role'],
      ['rep.thOpera', 'Table · Opera / work'],
      ['rep.thWork', 'Table · Work'],
      ['rep.thWorkLied', 'Table · Work (Lied)'],
      ['rep.thComposer', 'Table · Composer'],
      ['rep.status.all', 'Filter · All'],
      ['rep.status.performed', 'Filter · Performed'],
      ['rep.status.prepared', 'Filter · Prepared'],
      ['rep.status.studying', 'Filter · Studying'],
      ['rep.statusRow.performed', 'Row badge · Performed'],
      ['rep.statusRow.prepared', 'Row badge · Prepared'],
      ['rep.statusRow.studying', 'Row badge · Studying'],
      ['rep.empty', 'Empty state'],
      ['rep.loadError', 'Load error'],
      ['rep.performanceHistory', 'Production history heading'],
      ['rep.performanceMoreInfo', 'More info (repertoire modal)'],
      ['rep.introLine', 'Intro line', 1],
      ['rep.descOpera', 'Description · Opera', 1],
      ['rep.descArias', 'Description · Arias', 1],
      ['rep.descOperetta', 'Description · Operetta', 1],
      ['rep.descLied', 'Description · Lied', 1],
      ['rep.descTango', 'Description · Tango', 1],
      ['rep.moreTag', 'More block tag'],
      ['rep.moreSub', 'More block subtitle', 1]
    ]],
    ['Calendar / performances', [
      ['perf.maps', 'Maps'],
      ['perf.pastStamp', 'Past stamp'],
      ['perf.pastDivider', 'Past performances divider'],
      ['perf.pastDividerSelected', 'Selected past performances divider'],
      ['perf.calendarEmpty', 'Calendar empty'],
      ['perf.emptyUpcoming', 'Empty upcoming'],
      ['perf.moreInfo', 'More info (card)'],
      ['perf.pastShow', 'Show past performances'],
      ['perf.pastHide', 'Hide past performances'],
      ['perf.repertoireLabel', 'Repertoire label'],
      ['perf.pastCat.stage', 'Past category · Stage'],
      ['perf.pastCat.concert', 'Past category · Concert'],
      ['perf.pastCat.collaboration', 'Past category · Collaboration'],
      ['perf.pastCat.private', 'Past category · Private'],
      ['perf.printAgenda', 'Print · agenda'],
      ['perf.printSubtitle', 'Print · subtitle'],
      ['perf.printHeadline', 'Print · headline'],
      ['perf.printTagline', 'Print · tagline'],
      ['perf.printDocTitle', 'Print · document title'],
      ['perf.printTitle', 'Print · title'],
      ['perf.moreInfoPrint', 'Print · more info'],
      ['perf.ticketsInfo', 'Tickets & info'],
      ['perf.dataLoadError', 'Data load error'],
      ['perf.loadFallbackH2', 'Fallback page H2 (HTML)', 1, 3],
      ['perf.pageH2', 'Page H2 (HTML)', 1, 3],
      ['perf.pageIntro', 'Page intro', 1, 4]
    ]],
    ['Media (videos & photos)', [
      ['vid.brand', 'Video brand line'],
      ['vid.cat.opera_operetta', 'Video category · Opera · operetta'],
      ['vid.cat.recital_lied', 'Video category · Recital · Lied'],
      ['vid.cat.tango', 'Video category · Tango'],
      ['vid.repCat.opera', 'Video rep filter · Opera'],
      ['vid.repCat.operetta', 'Video rep filter · Operetta'],
      ['vid.repCat.lied', 'Video rep filter · Lied'],
      ['vid.repCat.concert_sacred', 'Video rep filter · Concert'],
      ['vid.repCat.tango', 'Video rep filter · Tango'],
      ['vid.repCat.crossover', 'Video rep filter · Crossover'],
      ['vid.showMore', 'Show more videos'],
      ['vid.showLess', 'Show less'],
      ['vid.embedUnavailable', 'Embed unavailable'],
      ['vid.openYoutube', 'Open on YouTube'],
      ['mp.videos.h2', 'Videos section H2 (HTML)', 1, 3],
      ['mp.section.videos', 'Section label · Videos'],
      ['mp.section.photos', 'Section label · Photos'],
      ['mp.section.audio', 'Section label · Audio'],
      ['mp.jumpToAudio', 'Jump link · Audio'],
      ['mp.photos.h2', 'Photos H2 (HTML)', 1, 3],
      ['mp.photos.sub', 'Photos subtitle', 1],
      ['mp.audio.h2', 'Audio H2 (HTML)', 1, 3],
      ['mp.audio.sub', 'Audio subtitle', 1],
      ['mp.photos.studioTab', 'Photos tab · Studio'],
      ['mp.photos.stageTab', 'Photos tab · Stage'],
      ['mp.photos.backstageTab', 'Photos tab · Backstage'],
      ['mp.photos.backstageEmpty', 'Backstage empty'],
      ['aud.embedUnavailable', 'Audio embed unavailable'],
      ['aud.openExternal', 'Audio · open listening link'],
      ['mp.mediaLoadError', 'Media load error'],
      ['mp.mediaBottomNote', 'Media page footnote', 1],
      ['mp.mediaBottomPress', 'Media · press downloads link']
    ]],
    ['Press & presenter (EPK chrome)', [
      ['press.tag', 'Press section tag'],
      ['press.empty', 'Press quotes empty'],
      ['press.readMore', 'Read article'],
      ['press.dataLoadError', 'Press load error'],
      ['press.intro', 'Press intro', 1, 4],
      ['epk.tag', 'EPK section tag'],
      ['epk.title', 'EPK dossier title'],
      ['epk.bio50lbl', 'Bio 50 label'],
      ['epk.bio150lbl', 'Bio 150 label'],
      ['epk.bio300lbl', 'Bio full label'],
      ['epk.copyBio', 'Copy biography button'],
      ['epk.photos', 'High-res photos heading'],
      ['epk.photosIntro', 'EPK photos intro', 1],
      ['epk.photoCredit', 'EPK photo credit', 1],
      ['epk.docs', 'Documents heading'],
      ['epk.docsIntro', 'Documents intro', 1],
      ['epk.downloadDossier', 'Download dossier'],
      ['epk.downloadArtistSheet', 'Download artist sheet'],
      ['epk.programsLink', 'Programs link'],
      ['epk.downloadPhoto', 'Download hi-res'],
      ['epk.preview', 'Preview'],
      ['epk.pdfSoon', 'PDF soon'],
      ['mp.pressCoverage', 'Media page · press coverage heading'],
      ['mp.presenterMaterials', 'Media page · presenter materials heading'],
      ['mp.pressFooterNote', 'Press page footnote', 1]
    ]],
    ['Contact & form', [
      ['form.name', 'Form · Name label'],
      ['form.email', 'Form · Email label'],
      ['form.subject', 'Form · Subject label'],
      ['form.message', 'Form · Message label'],
      ['form.send', 'Form · Send button'],
      ['form.success', 'Form · Success message', 1],
      ['form.namePh', 'Placeholder · Name'],
      ['form.emailPh', 'Placeholder · Email'],
      ['form.subjectPh', 'Placeholder · Subject'],
      ['form.messagePh', 'Placeholder · Message', 1],
      ['form.sending', 'Form · Sending'],
      ['form.errorSend', 'Form · Send error', 1],
      ['contact.materialsHint', 'Contact materials hint', 1],
      ['contact.dataLoadError', 'Contact load error', 1],
      ['contact.title', 'Contact title fallback (HTML)', 1, 3],
      ['mp.contactBottomNote', 'Contact onward note', 1]
    ]],
    ['Reviews stub & calendar note', [
      ['mp.reviewsStub.tag', 'Reviews stub tag'],
      ['mp.reviewsStub.h2', 'Reviews stub H2'],
      ['mp.reviewsStub.html', 'Reviews stub body (HTML)', 1, 5],
      ['mp.calFooterNote', 'Calendar page footnote', 1]
    ]]
  ]);
  function fieldDomIdForUiKey(key) {
    return 'ui-str-' + String(key || '').replace(/\./g, '-');
  }
  function flatPublicRgUiCopyFields() {
    var out = [];
    PUBLIC_RG_UI_COPY_GROUPS.forEach(function (g) {
      (g.fields || []).forEach(function (f) {
        out.push(f);
      });
    });
    return out;
  }
  var ADMIN_ALLOWLIST_EMAILS = ['rolandoguy@gmail.com'];
  var AUTH_REDIRECT_PENDING_KEY = 'adm2_redirect_pending';
  var AUTH_REDIRECT_PENDING_TS_KEY = 'adm2_redirect_pending_ts';
  var AUTH_SAFARI_RESTORE_FAILED_KEY = 'adm2_safari_restore_failed';
  var AUTH_REDIRECT_GRACE_MS = 8000;
  var AUTH_REDIRECT_PENDING_TTL_MS = 15 * 60 * 1000;
  var firebaseAuth = null;
  var authDebugState = {
    browserClass: 'non-safari',
    authMode: 'popup',
    redirectProcessed: 'no',
    persistenceSet: 'no',
    persistenceType: 'unknown',
    redirectPending: 'no',
    authState: 'pending',
    currentUserPresent: 'no',
    email: '—',
    allowlist: 'no',
    gate: 'locked',
    failure: ''
  };
  var SAFE_IMPORT_KEY_RE = /^(hero|bio|rep|perf|contact|rg_ui|rg_editorial)_(en|de|es|it|fr)$|^(rg_rep_cards|rg_perfs|rg_past_perfs|rg_press|rg_press_meta|rg_vid|rg_vid_en|rg_audio|rg_epk_bios|rg_epk_photos|rg_epk_cvs|rg_public_pdfs|rg_photos|rg_photo_captions|rg_programs|rg_programs_en|rg_programs_de|rg_programs_es|rg_programs_it|rg_programs_fr|programs_en|programs_de|programs_es|programs_it|programs_fr|rg_repertoire_planner|rg_program_blueprints|rg_concert_history|rg_repertoire_discovery|rg_outreach_tracker)$/;
  var PRESS_IMPORT_KEYS = { rg_press: true, rg_press_meta: true, rg_epk_bios: true, rg_epk_photos: true, rg_epk_cvs: true, rg_public_pdfs: true };
  var mediaPhotoDragIndex = -1;
  var bulkUrlSubmitHandler = null;
  var activityLog = [];
  var PROGRAM_BUILDER_FAMILIES = ['gala', 'italian', 'tango', 'borders'];
  var PROGRAM_BUILDER_DURATIONS = [30, 45, 60];
  var PROGRAM_BUILDER_BLUEPRINT_KEYS = ['gala_30','gala_45','gala_60','italian_30','italian_45','italian_60','tango_30','tango_45','tango_60','borders_30','borders_45','borders_60'];
  var PROGRAM_BUILDER_HISTORY_IMPORT_VERSION = 3;
  var PROGRAM_BUILDER_TAG_HINTS = {
    gala: ['gala'],
    italian: ['italian'],
    tango: ['tango'],
    borders: ['borders', 'multilingual', 'cross-border']
  };
  var PROGRAM_BUILDER_VOICE_ORDER = ['tenor', 'soprano', 'mezzo', 'baritone'];
  var PROGRAM_BUILDER_VOICE_CATEGORY_LABELS = {
    tenor_aria: 'Tenor aria',
    soprano_aria: 'Soprano aria',
    mezzo_aria: 'Mezzo aria',
    baritone_aria: 'Baritone aria',
    tenor_soprano_duet: 'Tenor-Soprano duet',
    tenor_mezzo_duet: 'Tenor-Mezzo duet',
    tenor_baritone_duet: 'Tenor-Baritone duet',
    soprano_mezzo_duet: 'Soprano-Mezzo duet',
    soprano_baritone_duet: 'Soprano-Baritone duet',
    mezzo_baritone_duet: 'Mezzo-Baritone duet',
    tenor_soprano_mezzo_trio: 'Tenor-Soprano-Mezzo trio',
    tenor_soprano_baritone_trio: 'Tenor-Soprano-Baritone trio',
    tenor_mezzo_baritone_trio: 'Tenor-Mezzo-Baritone trio',
    soprano_mezzo_baritone_trio: 'Soprano-Mezzo-Baritone trio',
    quartet: 'Quartet',
    ensemble: 'Ensemble',
    piano_solo: 'Piano solo',
    chamber_song: 'Chamber song',
    tango: 'Argentine tango'
  };
  var PROGRAM_BUILDER_SELECTOR_FILTER_LABELS = {
    all: 'All combinations',
    tenor_arias: 'Tenor arias',
    soprano_arias: 'Soprano arias',
    mezzo_arias: 'Mezzo arias',
    baritone_arias: 'Baritone arias',
    tenor_soprano_duets: 'Tenor-Soprano duets',
    tenor_mezzo_duets: 'Tenor-Mezzo duets',
    tenor_baritone_duets: 'Tenor-Baritone duets',
    other_duets: 'Other duets',
    trios: 'Trios',
    quartets_ensembles: 'Quartets / Ensembles',
    piano_solo: 'Piano solo',
    chamber_song: 'Chamber songs with piano',
    tango: 'Argentine tango'
  };
  var PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS = {
    opener: 'Opening',
    development: 'Development',
    lyrical_center: 'Lyrical center',
    contrast: 'Contrast',
    climax: 'Climax',
    finale: 'Finale',
    encore: 'Encore'
  };
  var PROGRAM_BUILDER_DRAMATIC_ROLE_ORDER = ['opener','development','lyrical_center','contrast','climax','finale','encore'];
  var PROGRAM_BUILDER_ARC_TEMPLATES = {
    30: [
      { id: 'opening', label: 'Opening', hint: 'Start with presence and clarity.' },
      { id: 'development', label: 'Development', hint: 'Set the tone and broaden the palette.' },
      { id: 'lyrical_center', label: 'Lyrical center', hint: 'Give the programme its inward moment.' },
      { id: 'finale', label: 'Finale', hint: 'End with real profile and arrival.' }
    ],
    45: [
      { id: 'opening', label: 'Opening', hint: 'Start with presence and clarity.' },
      { id: 'early_contrast', label: 'Early contrast', hint: 'Introduce a different colour early.' },
      { id: 'development', label: 'Development', hint: 'Let the programme grow in profile.' },
      { id: 'lyrical_center', label: 'Lyrical center', hint: 'Create intimacy or inward focus.' },
      { id: 'climax', label: 'Climax', hint: 'Reserve a strong emotional or vocal summit.' },
      { id: 'finale', label: 'Finale', hint: 'Finish with confidence and projection.' }
    ],
    60: [
      { id: 'opening', label: 'Opening', hint: 'Set the artistic profile immediately.' },
      { id: 'first_development', label: 'First development', hint: 'Expand the first line of the recital.' },
      { id: 'contrast', label: 'Contrast', hint: 'Shift language, mood, or texture.' },
      { id: 'lyrical_center', label: 'Lyrical center', hint: 'Hold the emotional centre of the programme.' },
      { id: 'build_up', label: 'Build-up', hint: 'Prepare the final ascent.' },
      { id: 'climax', label: 'Climax', hint: 'Place the strongest peak here.' },
      { id: 'resolution_finale', label: 'Resolution / finale', hint: 'Land the programme with conviction.' }
    ]
  };
  var PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER = [
    'Lyric tenor arias',
    'Tenor–Soprano duets',
    'Tenor–Mezzo duets',
    'Tenor–Baritone duets',
    'Trios with tenor',
    'Quartets / ensembles',
    'Piano solo',
    'Chamber songs with piano · German',
    'Chamber songs with piano · Italian',
    'Chamber songs with piano · French',
    'Chamber songs with piano · English',
    'Chamber songs with piano · Spanish',
    'Argentine tango'
  ];
  var REPERTOIRE_DISCOVERY_STATE_OPTIONS = [
    { value: 'bookmarked', label: 'Bookmarked' },
    { value: 'interesting', label: 'Interesting' },
    { value: 'worth_studying', label: 'Worth studying' },
    { value: 'maybe_later', label: 'Maybe later' },
    { value: 'imported_to_repertoire_library', label: 'Imported to repertoire library' },
    { value: 'dismissed', label: 'Dismissed' }
  ];
  var OUTREACH_STATUS_OPTIONS = [
    { value: 'idea', label: 'Idea' },
    { value: 'to_contact', label: 'To contact' },
    { value: 'sent', label: 'Sent' },
    { value: 'replied', label: 'Replied' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'declined', label: 'Declined' },
    { value: 'archived', label: 'Archived' }
  ];
  var OUTREACH_HISTORY_EVENT_OPTIONS = [
    { value: 'created', label: 'Created' },
    { value: 'first_contact_sent', label: 'First contact sent' },
    { value: 'replied', label: 'Replied' },
    { value: 'follow_up_made', label: 'Follow-up made' },
    { value: 'negotiation_note', label: 'Negotiation note' },
    { value: 'tentative_date_discussed', label: 'Tentative date discussed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'declined', label: 'Declined' },
    { value: 'archived', label: 'Archived' }
  ];
  var PROGRAM_BUILDER_TEXT = {
    en: {
      families: { gala: 'Gala', italian: 'Italian', tango: 'Tango', borders: 'Borders' },
      durationTarget: 'Target',
      durationCurrent: 'Current selection',
      durationEncore: 'Encore total',
      durationPossible: 'Possible total',
      currentSelectedTotalLabel: 'Current total',
      durationMinutes: 'min',
      statusShort: 'Too short',
      statusOk: 'Within range',
      statusSlightlyOver: 'Slightly over',
      statusLong: 'Too long',
      durationProgressExact: 'On target',
      durationProgressShort: 'About {n} min short',
      durationProgressOver: 'About {n} min over',
      previewHeading: 'Programme Sheet',
      repertoireLabel: 'Selected repertoire',
      repertoireHeadingModes: {
        suggested: 'Suggested repertoire',
        agreed: 'Agreed repertoire',
        possible: 'Possible repertoire'
      },
      flexibilityLabel: 'Programme flexibility',
      contactLabel: 'Contact',
      websiteLabel: 'Website',
      emailLabel: 'Email',
      phoneLabel: 'Mobile',
      formationLabel: 'Formation',
      durationLabel: 'Duration',
      focusLabel: 'Focus',
      currentSelectionLabel: 'Current selection',
      encoreOptionsLabel: 'Optional encores',
      encoreIncludeLabel: 'Include encore options in Programme Sheet',
      encoreEmpty: 'Keep 1–3 encore options here if you want to have bis choices ready without mixing them into the main programme.',
      encoreNoteLabel: 'Encore note',
      approximateDurationLabel: 'Total duration',
      artistSubtitle: 'Argentine-Italian Lyric Tenor based in Berlin',
      noPieces: 'Select repertoire to build this programme sheet.',
      summaryFallback: 'A curated recital proposal designed for presenters, adaptable in pacing and repertoire balance.',
      flexibleNote: 'Programme length, language balance, and repertoire order may be adjusted in consultation with the presenter and collaborating musicians.',
      emailLead: 'Thank you for your interest.',
      emailCloser: 'I would be happy to adapt duration, pacing, and repertoire balance for the occasion.',
      exportMissingRepertoire: 'Select at least one repertoire item before exporting this Programme Sheet.',
      exportLanguageMismatch: 'The main programme note still reads in English. Reset it to the language default before exporting.',
      exportPlaceholderText: 'Remove placeholder text before exporting this Programme Sheet.',
      exportNotReadyTitle: 'Programme Sheet not ready',
      exportNotReadyLead: 'This offer cannot be exported yet.'
    },
    de: {
      families: { gala: 'Gala', italian: 'Italienisch', tango: 'Tango', borders: 'Grenzen' },
      durationTarget: 'Ziel',
      durationCurrent: 'Aktuelle Auswahl',
      durationEncore: 'Zugaben gesamt',
      durationPossible: 'Mögliche Gesamtdauer',
      currentSelectedTotalLabel: 'Aktuelle Summe',
      durationMinutes: 'Min.',
      statusShort: 'Zu kurz',
      statusOk: 'Passend',
      statusSlightlyOver: 'Leicht darüber',
      statusLong: 'Zu lang',
      durationProgressExact: 'Im Ziel',
      durationProgressShort: 'Etwa {n} Min. zu kurz',
      durationProgressOver: 'Etwa {n} Min. darüber',
      previewHeading: 'Programmblatt',
      repertoireLabel: 'Ausgewähltes Repertoire',
      repertoireHeadingModes: {
        suggested: 'Vorgeschlagenes Repertoire',
        agreed: 'Vereinbartes Repertoire',
        possible: 'Mögliches Repertoire'
      },
      flexibilityLabel: 'Flexibler Rahmen',
      contactLabel: 'Kontakt',
      websiteLabel: 'Website',
      emailLabel: 'E-Mail',
      phoneLabel: 'Mobil',
      formationLabel: 'Besetzung',
      durationLabel: 'Dauer',
      focusLabel: 'Programmtyp',
      currentSelectionLabel: 'Aktuelle Auswahl',
      encoreOptionsLabel: 'Optionale Zugaben',
      encoreIncludeLabel: 'Zugaben im Programmblatt zeigen',
      encoreEmpty: 'Halten Sie hier 1–3 Zugaben bereit, ohne sie mit dem Hauptprogramm zu vermischen.',
      encoreNoteLabel: 'Notiz zur Zugabe',
      approximateDurationLabel: 'Gesamtdauer',
      artistSubtitle: 'Argentinisch-italienischer lyrischer Tenor mit Basis in Berlin',
      noPieces: 'Wählen Sie Repertoirestücke für diese Version aus.',
      summaryFallback: 'Ein kuratiertes Konzertangebot für Veranstalter, flexibel an Dramaturgie und Repertoiregewicht anpassbar.',
      flexibleNote: 'Dauer, Sprachgewicht und Repertoirefolge können in Absprache mit Veranstalter und Mitwirkenden angepasst werden.',
      emailLead: 'Vielen Dank für Ihr Interesse.',
      emailCloser: 'Gerne passe ich Dauer, Dramaturgie und Repertoiregewicht an den Anlass an.',
      exportMissingRepertoire: 'Wählen Sie mindestens ein Repertoirestück, bevor Sie dieses Programmblatt exportieren.',
      exportLanguageMismatch: 'Die Hauptbeschreibung ist noch auf Englisch. Setzen Sie sie vor dem Export auf den Sprach-Standard zurück.',
      exportPlaceholderText: 'Entfernen Sie Platzhaltertext, bevor Sie dieses Programmblatt exportieren.'
    },
    es: {
      families: { gala: 'Gala', italian: 'Italiano', tango: 'Tango', borders: 'Sin fronteras' },
      durationTarget: 'Objetivo',
      durationCurrent: 'Selección actual',
      durationEncore: 'Total de bises',
      durationPossible: 'Duración posible total',
      currentSelectedTotalLabel: 'Total actual',
      durationMinutes: 'min',
      statusShort: 'Demasiado corto',
      statusOk: 'En rango',
      statusSlightlyOver: 'Ligeramente por encima',
      statusLong: 'Demasiado largo',
      durationProgressExact: 'En objetivo',
      durationProgressShort: 'Unos {n} min por debajo',
      durationProgressOver: 'Unos {n} min por encima',
      previewHeading: 'Hoja de programa',
      repertoireLabel: 'Repertorio seleccionado',
      repertoireHeadingModes: {
        suggested: 'Repertorio sugerido',
        agreed: 'Repertorio acordado',
        possible: 'Repertorio posible'
      },
      flexibilityLabel: 'Flexibilidad del programa',
      contactLabel: 'Contacto',
      websiteLabel: 'Web',
      emailLabel: 'Correo',
      phoneLabel: 'Móvil',
      formationLabel: 'Formación',
      durationLabel: 'Duración',
      focusLabel: 'Enfoque',
      currentSelectionLabel: 'Selección actual',
      encoreOptionsLabel: 'Bises opcionales',
      encoreIncludeLabel: 'Incluir bises en la hoja del programa',
      encoreEmpty: 'Guarda aquí 1–3 opciones de bis sin mezclarlas con el programa principal.',
      encoreNoteLabel: 'Nota del bis',
      approximateDurationLabel: 'Duración total',
      artistSubtitle: 'Tenor lírico argentino-italiano con base en Berlín',
      noPieces: 'Selecciona repertorio para esta versión concreta.',
      summaryFallback: 'Una propuesta de recital curada para programadores, adaptable en ritmo y equilibrio de repertorio.',
      flexibleNote: 'La duración, el equilibrio idiomático y el orden del repertorio pueden ajustarse en diálogo con el programador y los colaboradores artísticos.',
      emailLead: 'Muchas gracias por su interés.',
      emailCloser: 'Con gusto puedo ajustar duración, ritmo y selección de repertorio según la ocasión.',
      exportMissingRepertoire: 'Seleccione al menos un repertorio antes de exportar esta hoja de programa.',
      exportLanguageMismatch: 'El texto principal del programa sigue en inglés. Restablézcalo al idioma seleccionado antes de exportar.',
      exportPlaceholderText: 'Elimine el texto de marcador antes de exportar esta hoja de programa.'
    },
    it: {
      families: { gala: 'Gala', italian: 'Italiano', tango: 'Tango', borders: 'Senza frontiere' },
      durationTarget: 'Obiettivo',
      durationCurrent: 'Selezione attuale',
      durationEncore: 'Totale bis',
      durationPossible: 'Durata totale possibile',
      currentSelectedTotalLabel: 'Totale attuale',
      durationMinutes: 'min',
      statusShort: 'Troppo corto',
      statusOk: 'Equilibrato',
      statusSlightlyOver: 'Leggermente oltre',
      statusLong: 'Troppo lungo',
      durationProgressExact: 'In linea con l’obiettivo',
      durationProgressShort: 'Circa {n} min in meno',
      durationProgressOver: 'Circa {n} min in più',
      previewHeading: 'Scheda del programma',
      repertoireLabel: 'Repertorio selezionato',
      repertoireHeadingModes: {
        suggested: 'Repertorio suggerito',
        agreed: 'Repertorio concordato',
        possible: 'Repertorio possibile'
      },
      flexibilityLabel: 'Flessibilità del programma',
      contactLabel: 'Contatto',
      websiteLabel: 'Sito',
      emailLabel: 'Email',
      phoneLabel: 'Cellulare',
      formationLabel: 'Formazione',
      durationLabel: 'Durata',
      focusLabel: 'Profilo',
      currentSelectionLabel: 'Selezione attuale',
      encoreOptionsLabel: 'Bis opzionali',
      encoreIncludeLabel: 'Includi i bis nella scheda del programma',
      encoreEmpty: 'Tieni qui 1–3 opzioni di bis senza mescolarle al programma principale.',
      encoreNoteLabel: 'Nota del bis',
      approximateDurationLabel: 'Durata totale',
      artistSubtitle: 'Tenore lirico argentino-italiano con base a Berlino',
      noPieces: 'Seleziona i brani per questa versione concreta.',
      summaryFallback: 'Una proposta di recital curata per organizzatori, adattabile nel ritmo e nel bilanciamento del repertorio.',
      flexibleNote: "Durata, equilibrio linguistico e ordine del repertorio possono essere adattati in dialogo con l'organizzatore e i collaboratori artistici.",
      emailLead: "Grazie per l'interesse.",
      emailCloser: 'Sarò lieto di adattare durata, ritmo e repertorio al contesto.',
      exportMissingRepertoire: 'Seleziona almeno un brano prima di esportare questa scheda del programma.',
      exportLanguageMismatch: 'Il testo principale del programma è ancora in inglese. Ripristinalo alla lingua selezionata prima di esportare.',
      exportPlaceholderText: 'Rimuovi il testo segnaposto prima di esportare questa scheda del programma.'
    },
    fr: {
      families: { gala: 'Gala', italian: 'Italien', tango: 'Tango', borders: 'Sans frontières' },
      durationTarget: 'Objectif',
      durationCurrent: 'Sélection actuelle',
      durationEncore: 'Total des bis',
      durationPossible: 'Durée totale possible',
      currentSelectedTotalLabel: 'Total actuel',
      durationMinutes: 'min',
      statusShort: 'Trop court',
      statusOk: 'Équilibré',
      statusSlightlyOver: 'Légèrement au-dessus',
      statusLong: 'Trop long',
      durationProgressExact: 'Dans l’objectif',
      durationProgressShort: 'Environ {n} min de moins',
      durationProgressOver: 'Environ {n} min de plus',
      previewHeading: 'Feuille de programme',
      repertoireLabel: 'Répertoire sélectionné',
      repertoireHeadingModes: {
        suggested: 'Répertoire suggéré',
        agreed: 'Répertoire convenu',
        possible: 'Répertoire possible'
      },
      flexibilityLabel: 'Souplesse du programme',
      contactLabel: 'Contact',
      websiteLabel: 'Site',
      emailLabel: 'E-mail',
      phoneLabel: 'Mobile',
      formationLabel: 'Formation',
      durationLabel: 'Durée',
      focusLabel: 'Axe',
      currentSelectionLabel: 'Sélection actuelle',
      encoreOptionsLabel: 'Bis optionnels',
      encoreIncludeLabel: 'Inclure les bis dans la feuille de programme',
      encoreEmpty: 'Gardez ici 1 à 3 options de bis sans les mélanger au programme principal.',
      encoreNoteLabel: 'Note sur le bis',
      approximateDurationLabel: 'Durée totale',
      artistSubtitle: 'Ténor lyrique italo-argentin basé à Berlin',
      noPieces: 'Sélectionnez le répertoire pour cette version.',
      summaryFallback: 'Une proposition de récital conçue avec soin pour les programmateurs, adaptable dans son rythme et son équilibre.',
      flexibleNote: "La durée, l'équilibre des langues et l'ordre du répertoire peuvent être ajustés en concertation avec le programmateur et les artistes partenaires.",
      emailLead: "Merci beaucoup pour votre intérêt.",
      emailCloser: "Je peux naturellement ajuster la durée, le rythme et le choix du répertoire selon l'occasion.",
      exportMissingRepertoire: "Sélectionnez au moins un morceau avant d'exporter cette feuille de programme.",
      exportLanguageMismatch: "Le texte principal du programme est encore en anglais. Réinitialisez-le à la langue sélectionnée avant l'export.",
      exportPlaceholderText: "Retirez le texte indicatif avant d'exporter cette feuille de programme."
    }
  };
  var PROGRAMME_FEE_PRESETS = {
    berlin_local: { label: 'Berlin local', eventType: 'cultural', rehearsalCount: 0, rehearsalFeePerArtist: 0, travelCost: 0, hotelCost: 0, localTransportCost: 20, adminBuffer: 25, artistFeeMultiplier: 1 },
    germany_regional: { label: 'Germany regional', eventType: 'cultural', rehearsalCount: 1, rehearsalFeePerArtist: 45, travelCost: 90, hotelCost: 0, localTransportCost: 30, adminBuffer: 55, artistFeeMultiplier: 1.08 },
    germany_overnight: { label: 'Germany overnight', eventType: 'festival', rehearsalCount: 1, rehearsalFeePerArtist: 55, travelCost: 150, hotelCost: 160, localTransportCost: 35, adminBuffer: 80, artistFeeMultiplier: 1.16 },
    embassy_institutional: { label: 'Embassy / institutional', eventType: 'embassy', rehearsalCount: 1, rehearsalFeePerArtist: 65, travelCost: 120, hotelCost: 180, localTransportCost: 40, adminBuffer: 110, artistFeeMultiplier: 1.3 },
    church_budget: { label: 'Church budget', eventType: 'church', rehearsalCount: 0, rehearsalFeePerArtist: 0, travelCost: 25, hotelCost: 0, localTransportCost: 15, adminBuffer: 20, artistFeeMultiplier: 0.92 },
    private_premium: { label: 'Private premium', eventType: 'private', rehearsalCount: 1, rehearsalFeePerArtist: 65, travelCost: 80, hotelCost: 180, localTransportCost: 40, adminBuffer: 140, artistFeeMultiplier: 1.38 }
  };
  var PROGRAMME_FEE_COPY = {
    en: {
      currency: 'EUR',
      summaryTitle: 'Internal fee estimate',
      artisticSubtotal: 'Artistic subtotal',
      logisticsSubtotal: 'Logistics subtotal',
      lowBudget: 'Low-budget reality',
      recommended: 'Fair / recommended',
      benchmark: 'Public-funded benchmark',
      premium: 'Premium / private',
      formation: 'Formation',
      duration: 'Duration',
      eventType: 'Event type',
      participants: 'Artists',
      rehearsals: 'Rehearsals',
      notesLabel: 'Notes',
      benchmarkSource: 'Benchmark source',
      benchmarkReviewed: 'Benchmark last reviewed',
      emailLead: 'For this programme offer, my current internal quote frame would be:',
      emailRecommended: 'fair / recommended',
      emailLowBudget: 'low-budget reality',
      emailBenchmark: 'public-funded benchmark reference',
      emailPremium: 'premium / private context',
      emailCloser: 'This can be adjusted depending on travel, rehearsal scope, and the final venue context.'
    },
    de: {
      currency: 'EUR',
      summaryTitle: 'Interne Honorarabschätzung',
      artisticSubtotal: 'Künstlerische Summe',
      logisticsSubtotal: 'Logistik',
      lowBudget: 'Marktrealität / Low-Budget',
      recommended: 'Fair / empfohlen',
      benchmark: 'Öffentlicher Benchmark',
      premium: 'Premium / privat',
      formation: 'Besetzung',
      duration: 'Dauer',
      eventType: 'Veranstaltungstyp',
      participants: 'Mitwirkende',
      rehearsals: 'Proben',
      notesLabel: 'Notizen',
      benchmarkSource: 'Benchmark-Quelle',
      benchmarkReviewed: 'Benchmark zuletzt geprüft',
      emailLead: 'Für dieses Konzertangebot liegt mein aktueller interner Honorarrahmen bei:',
      emailRecommended: 'fair / empfohlen',
      emailLowBudget: 'Marktrealität / Low-Budget',
      emailBenchmark: 'öffentliche Benchmark-Referenz',
      emailPremium: 'Premium- / Privat-Kontext',
      emailCloser: 'Je nach Reise, Probenumfang und endgültigem Veranstaltungsrahmen kann dies angepasst werden.',
      exportNotReadyTitle: 'Programmblatt noch nicht bereit',
      exportNotReadyLead: 'Dieses Angebot kann noch nicht exportiert werden.'
    },
    es: {
      currency: 'EUR',
      summaryTitle: 'Estimación interna de honorarios',
      artisticSubtotal: 'Subtotal artístico',
      logisticsSubtotal: 'Subtotal logístico',
      lowBudget: 'Realidad low-budget',
      recommended: 'Justo / recomendado',
      benchmark: 'Benchmark público',
      premium: 'Premium / privado',
      formation: 'Formación',
      duration: 'Duración',
      eventType: 'Tipo de evento',
      participants: 'Artistas',
      rehearsals: 'Ensayos',
      notesLabel: 'Notas',
      benchmarkSource: 'Fuente del benchmark',
      benchmarkReviewed: 'Benchmark revisado',
      emailLead: 'Para esta propuesta de programa, mi marco interno actual de honorarios sería:',
      emailRecommended: 'justo / recomendado',
      emailLowBudget: 'realidad low-budget',
      emailBenchmark: 'referencia de benchmark público',
      emailPremium: 'premium / privado',
      emailCloser: 'Esto puede ajustarse según viaje, ensayos y el contexto final de la sala.',
      exportNotReadyTitle: 'Hoja de programa no lista',
      exportNotReadyLead: 'Esta propuesta todavía no puede exportarse.'
    },
    it: {
      currency: 'EUR',
      summaryTitle: 'Stima interna del cachet',
      artisticSubtotal: 'Subtotale artistico',
      logisticsSubtotal: 'Subtotale logistico',
      lowBudget: 'Realtà low-budget',
      recommended: 'Equo / consigliato',
      benchmark: 'Benchmark pubblico',
      premium: 'Premium / privato',
      formation: 'Formazione',
      duration: 'Durata',
      eventType: 'Tipo di evento',
      participants: 'Artisti',
      rehearsals: 'Prove',
      notesLabel: 'Note',
      benchmarkSource: 'Fonte benchmark',
      benchmarkReviewed: 'Benchmark rivisto',
      emailLead: 'Per questa proposta di programma, il mio attuale quadro interno dei compensi sarebbe:',
      emailRecommended: 'equo / consigliato',
      emailLowBudget: 'realtà low-budget',
      emailBenchmark: 'riferimento benchmark pubblico',
      emailPremium: 'premium / privato',
      emailCloser: 'Questo può essere adattato in base a viaggio, prove e contesto finale della sede.',
      exportNotReadyTitle: 'Scheda del programma non pronta',
      exportNotReadyLead: 'Questa proposta non può ancora essere esportata.'
    },
    fr: {
      currency: 'EUR',
      summaryTitle: 'Estimation interne des honoraires',
      artisticSubtotal: 'Sous-total artistique',
      logisticsSubtotal: 'Sous-total logistique',
      lowBudget: 'Réalité low-budget',
      recommended: 'Équitable / recommandé',
      benchmark: 'Benchmark public',
      premium: 'Premium / privé',
      formation: 'Formation',
      duration: 'Durée',
      eventType: "Type d'événement",
      participants: 'Artistes',
      rehearsals: 'Répétitions',
      notesLabel: 'Notes',
      benchmarkSource: 'Source benchmark',
      benchmarkReviewed: 'Benchmark révisé',
      emailLead: 'Pour cette proposition de programme, mon cadre interne actuel de devis serait le suivant :',
      emailRecommended: 'équitable / recommandé',
      emailLowBudget: 'réalité low-budget',
      emailBenchmark: 'référence benchmark public',
      emailPremium: 'premium / privé',
      emailCloser: 'Cela peut être ajusté selon le voyage, les répétitions et le contexte final du lieu.',
      exportNotReadyTitle: 'Feuille de programme non prête',
      exportNotReadyLead: "Cette proposition ne peut pas encore être exportée."
    }
  };
  var PROGRAMME_OFFER_USE_CASES = ['embassy', 'church', 'chamber', 'private', 'festival', 'other'];
  var PROGRAMME_OFFER_STATUS_VALUES = ['draft', 'active', 'sent', 'archived'];
  var state = {
    lang: 'en',
    section: 'home',
    dirty: false,
    api: null,
    repCards: [],
    repIndex: -1,
    perfs: [],
    perfIndex: -1,
    pastPerfs: [],
    programsDoc: { title: '', subtitle: '', intro: '', closingNote: '', programs: [] },
    programsIndex: -1,
    pressTab: 'quotes',
    press: [],
    pressIndex: -1,
    publicPdfs: { dossier: {}, artistSheet: {} },
    epkBios: {},
    epkPhotos: [],
    epkPhotoIndex: -1,
    epkCvs: {},
    epkCvsTemp: {},
    mediaTab: 'videos',
    vidData: { h2: '', videos: [] },
    vidIndex: -1,
    audioData: { h2: '', sub: '', items: [] },
    audIndex: -1,
    photosData: { s: [], t: [], b: [] },
    photoCaptions: {},
    photoType: 's',
    photoIndex: -1,
    repSearch: '',
    repStatusFilter: 'all',
    repSelected: {},
    mediaVidSearch: '',
    mediaVidFilter: 'all',
    mediaVidSelected: {},
    mediaAudSearch: '',
    mediaAudFilter: 'all',
    mediaPhotoSearch: '',
    mediaPhotoQuickFilter: 'all',
    pressSearch: '',
    pressVisibleFilter: 'all',
    pressSelected: {},
    perfStatusFilter: 'all',
    incomeEventScope: 'upcoming',
    incomeStatusFilter: 'all',
    incomeCompletenessFilter: 'all',
    incomeMonthFilter: 'all',
    perfSelected: {},
    epkPhotoSearch: '',
    sectionUndo: {},
    sectionDraftCache: {},
    draftRestoreBannerKey: '',
    draftRestoreBannerTs: 0,
    focusMode: false,
    ready: false,
    bioPortraitDefault: '',
    bioBundle: null,
    bioBundlePromise: null,
    bioBundleFailed: false,
    bioBundleLiveLoaded: false,
    bioLoadNonce: 0,
    homeIntroDefault: '',
    homeLoadNonce: 0,
    siteHealthSnapshot: null,
    siteHealthEffectiveLang: 'en',
    siteHealthRenderToken: 0,
    bridgeReadyAt: 0,
    translationMissingOnly: false,
    programsWorkflowFilter: 'all',
    programsSelected: {},
    pressWorkflowFilter: 'all',
    mediaVidWorkflowFilter: 'all',
    mediaAudWorkflowFilter: 'all',
    perfWorkflowFilter: 'all',
    perfRevenueFilter: 'all',
    repWorkflowFilter: 'all',
    plannerDoc: { items: [] },
    plannerIndex: -1,
    plannerSearch: '',
    plannerTypeFilter: 'all',
    plannerLangFilter: '',
    plannerReadinessFilter: 'all',
    plannerTagFilter: '',
    plannerSort: 'sortOrder',
    plannerOfferStatusFilter: 'all',
    plannerOfferTypeFilter: 'all',
    plannerOfferCategoryFilter: 'all',
    plannerOfferTagFilter: '',
    plannerOfferLangFilter: '',
    plannerOfferMatchingOnly: true,
    plannerOfferFormationOnly: false,
    plannerOfferShowWithoutTenor: false,
    blueprintDoc: { blueprints: {} },
    blueprintFamily: 'gala',
    blueprintDuration: '30',
    blueprintPieceIndex: -1,
    blueprintOutputLang: 'en',
    quickAddTargetType: 'main',
    quickAddTargetSlotId: '',
    quickAddTargetEncoreIndex: -1,
    programmeOfferSavePhase: '',
    savedOfferId: '',
    savedOfferSearch: '',
    savedOfferTypeFilter: 'all',
    savedOfferFamilyFilter: 'all',
    savedOfferDurationFilter: 'all',
    savedOfferLangFilter: 'all',
    savedOfferFormationFilter: '',
    savedOfferStatusFilter: 'all',
    concertHistoryDoc: { concerts: [] },
    concertHistoryIndex: -1,
    concertHistorySearch: '',
    programmeDraftHistory: {},
    programmeDiscoveryCandidates: {},
    discoveryDoc: { records: [] },
    discoverySelectedId: '',
    discoverySearch: '',
    discoveryProfileFilter: 'all',
    discoveryFamilyFilter: 'all',
    discoveryLanguageFilter: '',
    discoveryComposerFilter: '',
    discoveryWorkFilter: '',
    discoveryTypeFilter: 'all',
    discoveryCombinationFilter: 'all',
    discoveryRoleFilter: 'all',
    discoveryDurationMinFilter: '',
    discoveryDurationMaxFilter: '',
    discoveryReadinessFilter: 'all',
    discoveryStateFilter: 'all',
    discoveryResultLimit: 24,
    outreachDoc: { records: [] },
    outreachSelectedId: '',
    outreachSearch: '',
    outreachViewMode: 'cards',
    outreachStatusFilter: 'all',
    outreachFollowupFilter: 'all',
    outreachQuickFilter: 'all',
    legacySaveHooksInstalled: false,
    pendingLegacySaves: {},
    paperPreview: true,
    pastPerfsSelected: {}
  };
  var PAPER_PREVIEW_STORAGE_KEY = 'rg_admin_v2_paper_preview';
  var DRAFT_RESTORE_NOTICE_STORAGE_KEY = 'adm2_draft_notice_v1';
  var MOBILE_NAV_PRIMARY_STORAGE_KEY = 'rg_admin_v2_mobile_nav_primary_v1';
  var NAV_ORDER_STORAGE_KEY = 'rg_admin_v2_nav_order_v2';
  var MOBILE_NAV_SECTION_ORDER = ['rep', 'programs', 'programbuilder', 'programbuilder_fee', 'discovery', 'media', 'pastperfs', 'outreach', 'calendar', 'income', 'bio', 'home', 'press', 'contact', 'ui', 'publishing', 'translation', 'sitehealth', 'tools'];
  var MOBILE_NAV_PRIMARY_DEFAULT = ['rep', 'programs', 'programbuilder', 'programbuilder_fee', 'discovery', 'media', 'pastperfs', 'outreach', 'calendar', 'income'];

  function $(id) { return document.getElementById(id); }
  function readMobileNavPrimarySections() {
    try {
      var raw = localStorage.getItem(MOBILE_NAV_PRIMARY_STORAGE_KEY);
      if (!raw) return MOBILE_NAV_PRIMARY_DEFAULT.slice();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return MOBILE_NAV_PRIMARY_DEFAULT.slice();
      var seen = {};
      var cleaned = [];
      parsed.forEach(function (id) {
        var key = safeString(id).trim();
        if (!key || seen[key]) return;
        if (MOBILE_NAV_SECTION_ORDER.indexOf(key) < 0) return;
        seen[key] = true;
        cleaned.push(key);
      });
      return cleaned.length ? cleaned : MOBILE_NAV_PRIMARY_DEFAULT.slice();
    } catch (e) {
      return MOBILE_NAV_PRIMARY_DEFAULT.slice();
    }
  }
  function writeMobileNavPrimarySections(list) {
    try { localStorage.setItem(MOBILE_NAV_PRIMARY_STORAGE_KEY, JSON.stringify(Array.isArray(list) ? list : MOBILE_NAV_PRIMARY_DEFAULT)); } catch (e) {}
  }
  function renderMobileNavConfigItems() {
    var box = $('nav-mobile-config-items');
    if (!box) return;
    var selected = {};
    (state.mobileNavPrimarySections || []).forEach(function (id) { selected[id] = true; });
    box.innerHTML = MOBILE_NAV_SECTION_ORDER.map(function (sectionId) {
      var btn = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
      var label = safeString(btn && btn.textContent).trim() || sectionId;
      var checked = selected[sectionId] ? ' checked' : '';
      return '<label class="nav-mobile-config__item"><input type="checkbox" data-mobile-nav-section="' + escapeAttr(sectionId) + '"' + checked + '><span>' + escapeHtml(label) + '</span></label>';
    }).join('');
  }
  function readCustomNavOrder() {
    try {
      var raw = localStorage.getItem(NAV_ORDER_STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      var seen = {};
      var cleaned = [];
      parsed.forEach(function (id) {
        var key = safeString(id).trim();
        if (!key || seen[key]) return;
        if (MOBILE_NAV_SECTION_ORDER.indexOf(key) < 0) return;
        seen[key] = true;
        cleaned.push(key);
      });
      if (!cleaned.length) return null;
      MOBILE_NAV_SECTION_ORDER.forEach(function (id) {
        if (cleaned.indexOf(id) < 0) cleaned.push(id);
      });
      return cleaned;
    } catch (e) {
      return null;
    }
  }
  function writeCustomNavOrder(order) {
    try {
      if (!Array.isArray(order)) return;
      localStorage.setItem(NAV_ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch (e) {}
  }
  function getEffectiveNavOrder() {
    var custom = readCustomNavOrder();
    return custom || MOBILE_NAV_SECTION_ORDER.slice();
  }
  function renderNavOrderControls() {
    var box = $('nav-order-controls');
    if (!box) return;
    var order = getEffectiveNavOrder();
    box.innerHTML = order.map(function (sectionId, idx) {
      var btn = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
      var label = safeString(btn && btn.textContent).trim() || sectionId;
      var upDisabled = idx === 0 ? ' disabled' : '';
      var downDisabled = idx === order.length - 1 ? ' disabled' : '';
      return '<div class="nav-order-item">' +
        '<label>' + escapeHtml(label) + '</label>' +
        '<button data-nav-up="' + escapeAttr(sectionId) + '"' + upDisabled + '>↑</button>' +
        '<button data-nav-down="' + escapeAttr(sectionId) + '"' + downDisabled + '>↓</button>' +
        '</div>';
    }).join('');
  }
  function moveNavItemUp(sectionId) {
    var order = getEffectiveNavOrder();
    var idx = order.indexOf(sectionId);
    if (idx <= 0) return;
    order.splice(idx - 1, 0, order.splice(idx, 1)[0]);
    writeCustomNavOrder(order);
    renderNavOrderControls();
    syncMobileNavMoreSections(false);
  }
  function moveNavItemDown(sectionId) {
    var order = getEffectiveNavOrder();
    var idx = order.indexOf(sectionId);
    if (idx < 0 || idx >= order.length - 1) return;
    order.splice(idx + 1, 0, order.splice(idx, 1)[0]);
    writeCustomNavOrder(order);
    renderNavOrderControls();
    syncMobileNavMoreSections(false);
  }
  function resetNavOrder() {
    localStorage.removeItem(NAV_ORDER_STORAGE_KEY);
    renderNavOrderControls();
    syncMobileNavMoreSections(false);
  }
  function readPaperPreviewPreference() {
    try {
      var raw = localStorage.getItem(PAPER_PREVIEW_STORAGE_KEY);
      if (raw === '0' || raw === 'false') return false;
      if (raw === '1' || raw === 'true') return true;
    } catch (e) {}
    return true;
  }
  function applyPaperPreviewMode(enabled, persist) {
    state.paperPreview = enabled !== false;
    if (document.body) document.body.classList.toggle('paper-preview-mode', !!state.paperPreview);
    if ($('paperPreviewToggle')) $('paperPreviewToggle').checked = !!state.paperPreview;
    if (persist !== false) {
      try { localStorage.setItem(PAPER_PREVIEW_STORAGE_KEY, state.paperPreview ? '1' : '0'); } catch (e) {}
    }
  }
  function isSafariBrowser() {
    var ua = String((window.navigator && window.navigator.userAgent) || '');
    var isWebKit = /WebKit/i.test(ua);
    var isSafari = /Safari/i.test(ua);
    var excluded = /(CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Chromium|Android)/i.test(ua);
    return isWebKit && isSafari && !excluded;
  }
  function shouldUseRedirectAuth() {
    // Legacy admin uses popup as canonical flow.
    // Keep redirect only as fallback when popup is blocked.
    return false;
  }
  function buildLegacySignInUrl() {
    var returnTo = 'admin-v2.html';
    try {
      returnTo = window.location.pathname.split('/').pop() || 'admin-v2.html';
    } catch (e) {}
    return 'admin.html?return=' + encodeURIComponent(returnTo);
  }
  function setAuthError(message, err) {
    var code = safeString(err && err.code).trim();
    var msg = safeString(err && err.message).trim();
    var full = safeString(message);
    if (code) full += ' [' + code + ']';
    if (msg) full += ' ' + msg;
    setAuthDebug({ failure: code || msg || 'unknown-error' });
    setAuthGate(false, firebaseAuth ? firebaseAuth.currentUser : null, full);
  }
  function getRedirectPending() {
    try {
      if (sessionStorage.getItem(AUTH_REDIRECT_PENDING_KEY) === '1') return true;
      var tsRaw = localStorage.getItem(AUTH_REDIRECT_PENDING_TS_KEY);
      var ts = Number(tsRaw || 0);
      if (!Number.isFinite(ts) || ts <= 0) return false;
      return (Date.now() - ts) < AUTH_REDIRECT_PENDING_TTL_MS;
    } catch (e) {
      return false;
    }
  }
  function setRedirectPending(flag) {
    try {
      if (flag) {
        sessionStorage.setItem(AUTH_REDIRECT_PENDING_KEY, '1');
        localStorage.setItem(AUTH_REDIRECT_PENDING_TS_KEY, String(Date.now()));
      } else {
        sessionStorage.removeItem(AUTH_REDIRECT_PENDING_KEY);
        localStorage.removeItem(AUTH_REDIRECT_PENDING_TS_KEY);
      }
    } catch (e) {}
    setAuthDebug({ redirectPending: getRedirectPending() ? 'yes' : 'no' });
  }
  function markSafariRestoreFailed(flag) {
    try {
      if (flag) localStorage.setItem(AUTH_SAFARI_RESTORE_FAILED_KEY, '1');
      else localStorage.removeItem(AUTH_SAFARI_RESTORE_FAILED_KEY);
    } catch (e) {}
  }
  function hasSafariRestoreFailed() {
    try {
      return localStorage.getItem(AUTH_SAFARI_RESTORE_FAILED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }
  function refreshAuthRuntimeDebug(user) {
    setAuthDebug({
      redirectPending: getRedirectPending() ? 'yes' : 'no',
      currentUserPresent: user ? 'yes' : 'no'
    });
  }
  function renderAuthDebug() {
    var card = document.querySelector('.auth-card');
    if (!card) return;
    var el = $('adm2AuthDebug');
    if (!el) {
      el = document.createElement('p');
      el.id = 'adm2AuthDebug';
      el.className = 'muted';
      el.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      el.style.fontSize = '12px';
      el.style.lineHeight = '1.4';
      var anchor = $('adm2AuthMsg');
      if (anchor && anchor.parentNode) anchor.insertAdjacentElement('afterend', el);
      else card.appendChild(el);
    }
    el.textContent =
      'AUTH debug: browserClass=' + safeString(authDebugState.browserClass) +
      ' authMode=' + safeString(authDebugState.authMode) +
      ' persistenceType=' + safeString(authDebugState.persistenceType) +
      ' redirectProcessed=' + safeString(authDebugState.redirectProcessed) +
      ' authState=' + safeString(authDebugState.authState) +
      ' currentUserPresent=' + safeString(authDebugState.currentUserPresent) +
      ' allowlist=' + safeString(authDebugState.allowlist) +
      ' gate=' + safeString(authDebugState.gate) +
      (authDebugState.failure ? ' reason=' + safeString(authDebugState.failure) : '');
  }
  function setAuthDebug(patch) {
    if (patch && typeof patch === 'object') {
      Object.keys(patch).forEach(function (k) {
        authDebugState[k] = patch[k];
      });
    }
    renderAuthDebug();
  }
  function isAdminUser(user) {
    if (!user) return false;
    var email = safeString(user.email).toLowerCase();
    return ADMIN_ALLOWLIST_EMAILS.map(function (x) { return safeString(x).toLowerCase(); }).indexOf(email) >= 0;
  }
  function setAuthGate(unlocked, user, msgText) {
    var gate = $('adm2LockWrap');
    var app = $('adm2App');
    if (gate) gate.style.display = unlocked ? 'none' : '';
    if (app) app.style.display = unlocked ? 'flex' : 'none';
    if ($('adm2UserEmail')) $('adm2UserEmail').textContent = user && user.email ? user.email : '—';
    if ($('adm2SignInBtn')) $('adm2SignInBtn').style.display = user ? 'none' : '';
    if ($('adm2SignOutBtn')) $('adm2SignOutBtn').style.display = user ? '' : 'none';
    if ($('adm2TopSignOutBtn')) $('adm2TopSignOutBtn').style.display = unlocked && user ? '' : 'none';
    if ($('adm2AuthMsg')) $('adm2AuthMsg').textContent = msgText || '';
    refreshAuthRuntimeDebug(user || (firebaseAuth ? firebaseAuth.currentUser : null));
    setAuthDebug({
      email: user && user.email ? user.email : '—',
      allowlist: isAdminUser(user) ? 'yes' : 'no',
      gate: unlocked ? 'unlocked' : 'locked'
    });
  }
  function setBestAuthPersistence() {
    if (!firebaseAuth || !firebase.auth || !firebase.auth.Auth || !firebase.auth.Auth.Persistence) {
      setAuthDebug({ persistenceSet: 'no', persistenceType: 'unavailable' });
      return Promise.resolve(false);
    }
    var P = firebase.auth.Auth.Persistence;
    // Match legacy: prefer LOCAL persistence, then fallback.
    var candidates = [
      { id: P.LOCAL, label: 'local' },
      { id: P.SESSION, label: 'session' },
      { id: P.NONE, label: 'none' }
    ];
    var i = 0;
    function next() {
      if (i >= candidates.length) {
        setAuthDebug({ persistenceSet: 'no', persistenceType: 'failed' });
        return Promise.resolve(false);
      }
      var c = candidates[i++];
      return firebaseAuth.setPersistence(c.id).then(function () {
        setAuthDebug({ persistenceSet: 'yes', persistenceType: c.label });
        return true;
      }).catch(function () {
        return next();
      });
    }
    return next();
  }
  function initAuth() {
    if (typeof firebase === 'undefined') {
      setAuthError('Authentication is unavailable (Firebase failed to load).');
      return Promise.resolve(false);
    }
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp({
          apiKey: "AIzaSyCW9fCKrUcmFxc91KmgXhQF4kRYCiZH9Y0",
          authDomain: "rolandoguy-57d63.firebaseapp.com",
          projectId: "rolandoguy-57d63",
          storageBucket: "rolandoguy-57d63.firebasestorage.app",
          messagingSenderId: "276077748266",
          appId: "1:276077748266:web:f38a687ab3b526f0262353"
        });
      }
      firebaseAuth = firebase.auth();
      return setBestAuthPersistence();
    } catch (e) {
      setAuthError('Authentication is unavailable (Firebase init failed).', e);
      return Promise.resolve(false);
    }
  }
  function signInGoogle() {
    setAuthDebug({ authMode: 'legacy-gateway', failure: '' });
    setAuthGate(false, firebaseAuth ? firebaseAuth.currentUser : null, 'Opening legacy admin sign-in…');
    window.location.href = buildLegacySignInUrl();
    return false;
  }
  function handleRedirectResult() {
    if (!firebaseAuth || typeof firebaseAuth.getRedirectResult !== 'function') {
      setAuthDebug({ redirectProcessed: 'no', failure: 'redirect-api-unavailable' });
      return Promise.resolve();
    }
    if (!getRedirectPending()) {
      setAuthDebug({ redirectProcessed: 'n/a' });
      return Promise.resolve();
    }
    setAuthDebug({ authMode: 'redirect', redirectProcessed: 'no', authState: 'pending', failure: '' });
    return firebaseAuth.getRedirectResult().then(function (res) {
      setAuthDebug({ redirectProcessed: 'yes', authState: res && res.user ? 'signed-in' : 'signed-out' });
      refreshAuthRuntimeDebug((res && res.user) || (firebaseAuth ? firebaseAuth.currentUser : null));
      if (res && res.user) {
        setRedirectPending(false);
        setAuthGate(false, res.user, 'Redirect sign-in completed. Verifying access…');
      }
    }).catch(function (err) {
      setAuthError('Redirect sign-in failed on return.', err);
    });
  }
  function signOut() {
    if (!firebaseAuth) return;
    setRedirectPending(false);
    firebaseAuth.signOut().catch(function (err) {
      setAuthError('Sign out failed.', err);
    });
    return false;
  }
  function awaitAuthorizedUser() {
    return new Promise(function (resolve, reject) {
      if (!firebaseAuth) return reject(new Error('Firebase auth unavailable.'));
      firebaseAuth.onAuthStateChanged(function (user) {
        var ok = isAdminUser(user);
        refreshAuthRuntimeDebug(user);
        setAuthDebug({
          authState: user ? 'signed-in' : 'signed-out',
          email: user && user.email ? user.email : '—',
          allowlist: ok ? 'yes' : 'no'
        });
        if (!user) {
          setAuthGate(false, null, 'Login is handled via legacy admin. Use "Sign in via legacy admin".');
          return;
        }
        setRedirectPending(false);
        if (!ok) {
          setAuthDebug({ failure: 'allowlist-denied' });
          setAuthGate(false, user, 'This account is not authorized for this admin panel.');
          return;
        }
        setAuthDebug({ failure: '' });
        setAuthGate(true, user, 'Signed in.');
        resolve(user);
      }, function () {
        setAuthDebug({ failure: 'auth-state-listener-failed' });
        reject(new Error('Auth state listener failed.'));
      });
    });
  }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function setStatus(text, kind) {
    var el = $('saveState');
    el.textContent = text;
    el.classList.remove('ok', 'warn', 'err');
    if (kind) el.classList.add(kind);
  }
  function updateLangBadge() {
    $('langBadge').textContent = String(state.lang || 'en').toUpperCase();
  }
  function markDirty(flag, hint) {
    state.dirty = flag;
    if (flag) setStatus(hint || 'Unsaved changes', 'warn');
    else setStatus(hint || 'Saved', 'ok');
    if (flag) saveLocalDraftForCurrentSection();
    else {
      clearLocalDraftForCurrentSection();
      hideDraftRestoreBanner();
    }
    if (state.section === 'programbuilder' && $('pb-status')) renderProgramBuilderStatus();
  }
  function ensureReady() {
    if (!state.ready || !state.api) throw new Error('Admin data bridge is not ready.');
  }
  function safeString(v) {
    return typeof v === 'string' ? v : (v == null ? '' : String(v));
  }
  function normalizeLangCode(lang) {
    var raw = safeString(lang || '').trim().toLowerCase();
    if (!raw) return 'en';
    var primary = raw.split(/[-_]/)[0];
    if (LANGS.indexOf(primary) >= 0) return primary;
    return 'en';
  }
  function localeForLang(lang) {
    var map = { en: 'en-US', de: 'de-DE', es: 'es-ES', it: 'it-IT', fr: 'fr-FR' };
    var s = safeString(lang || state.lang || 'en').trim().toLowerCase().slice(0, 2);
    return map[s] || 'en-US';
  }
  function asBoolean(v, fb) {
    if (typeof v === 'boolean') return v;
    if (v === 'true') return true;
    if (v === 'false') return false;
    return fb;
  }
  function isObject(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }
  function hasOwn(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }
  function pickStoredOrFallback(stored, fallback, key) {
    if (isObject(stored) && hasOwn(stored, key)) return safeString(stored[key]);
    return safeString(fallback && fallback[key]);
  }
  function pickEffectiveWithSource(stored, fallback, key, fallbackLabel) {
    var fbLabel = safeString(fallbackLabel || 'Fallback');
    var hasStored = isObject(stored) && hasOwn(stored, key);
    var storedVal = hasStored ? safeString(stored[key]) : '';
    if (hasStored && storedVal.trim()) return { value: storedVal, source: 'Saved here' };
    var fallbackVal = safeString(fallback && fallback[key]);
    if (fallbackVal.trim()) return { value: fallbackVal, source: fbLabel };
    if (hasStored) return { value: storedVal, source: 'Saved here' };
    return { value: '', source: 'Bundled default' };
  }
  function ensureFieldSourceIndicator(el) {
    if (!el || !el.parentElement) return null;
    var host = el.parentElement.querySelector('.adm-src-indicator');
    if (host) return host;
    host = document.createElement('small');
    host.className = 'muted adm-src-indicator';
    host.style.display = 'block';
    host.style.marginTop = '4px';
    host.style.fontSize = '.66rem';
    host.style.lineHeight = '1.35';
    el.parentElement.appendChild(host);
    return host;
  }
  function setFieldEffectiveValue(el, effective) {
    if (!el) return;
    var e = effective || { value: '', source: '' };
    el.value = safeString(e.value);
    var ind = ensureFieldSourceIndicator(el);
    if (ind) ind.textContent = e.source ? ('Source: ' + e.source) : '';
  }
  function setFieldFromSources(id, stored, fallback, key, fallbackLabel) {
    var el = $(id);
    if (!el) return;
    setFieldEffectiveValue(el, pickEffectiveWithSource(stored, fallback, key, fallbackLabel));
  }
  function friendlyImageSourceLabel(raw) {
    var s = safeString(raw);
    if (!s) return 'Bundled default';
    if (s.indexOf('hero_' + state.lang + '.introImage') >= 0) return 'Saved here';
    if (s.indexOf('hero_en.introImage') >= 0) return 'Inherited (EN)';
    if (s.indexOf('default:') === 0) return 'Bundled default';
    return 'Inherited';
  }
  function fillHomeRgUiCopyFields(uiStored, uiFallback) {
    HOME_RG_UI_COPY_FIELDS.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      setFieldEffectiveValue(el, pickEffectiveWithSource(uiStored, uiFallback, row.key, 'Inherited'));
    });
  }
  function persistHomeRgUiCopyFields(ui) {
    var out = isObject(ui) ? ui : {};
    HOME_RG_UI_COPY_FIELDS.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      out[row.key] = safeString(el.value);
    });
    return out;
  }
  var UI_PUBLIC_COPY_BUILD = '2';
  function ensureUiPublicCopyEditorBuilt() {
    var host = $('ui-public-copy-host');
    if (!host || host.dataset.built === UI_PUBLIC_COPY_BUILD) return;
    host.dataset.built = UI_PUBLIC_COPY_BUILD;
    var html =
      '<h3>Structured public copy</h3><p class="muted" style="margin:0 0 10px">Saved into the Firestore/local <code>rg_ui_*</code> document for the language selected above. Empty fields use the bundled locale fallback. Raw JSON below remains available for advanced edits.</p>';
    PUBLIC_RG_UI_COPY_GROUPS.forEach(function (g) {
      html +=
        '<details class="tools-card details-block" style="margin-top:10px"><summary>' +
        escapeHtml(g.title) +
        '</summary><div style="margin-top:10px">';
      (g.fields || []).forEach(function (f) {
        var id = fieldDomIdForUiKey(f.key);
        html += '<label class="ui-str-field" style="display:block;margin-bottom:14px">' + escapeHtml(f.label);
        html +=
          '<span class="muted" style="display:block;font-size:11px;margin:2px 0 6px">Key: <code>' +
          escapeHtml(f.key) +
          '</code></span>';
        if (f.multi) {
          html +=
            '<textarea id="' +
            id +
            '" class="wide" rows="' +
            (f.rows || 3) +
            '" style="width:100%;box-sizing:border-box"></textarea></label>';
        } else {
          html += '<input type="text" id="' + id + '" class="wide" style="width:100%;box-sizing:border-box"></label>';
        }
      });
      html += '</div></details>';
    });
    host.innerHTML = html;
    bindInputsDirty(
      flatPublicRgUiCopyFields().map(function (f) {
        return fieldDomIdForUiKey(f.key);
      }),
      function () {
        updateCompletenessIndicators();
        markDirty(true, 'UI copy editado');
      }
    );
  }
  function fillPublicRgUiCopyFields(doc) {
    var uiFb = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(state.lang);
        if (isObject(t)) uiFb = t;
      }
    } catch (e) {}
    var d = isObject(doc) ? doc : {};
    flatPublicRgUiCopyFields().forEach(function (f) {
      var el = $(fieldDomIdForUiKey(f.key));
      if (!el) return;
      setFieldEffectiveValue(el, pickEffectiveWithSource(d, uiFb, f.key, 'Inherited'));
    });
  }
  /** Nav inputs + structured public copy only (does not touch Home hero intro fields). */
  function syncUiNavAndPublicCopyFromDoc(d) {
    var doc = isObject(d) ? d : {};
    var uiFb = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(state.lang);
        if (isObject(t)) uiFb = t;
      }
    } catch (e) {}
    setFieldFromSources('ui-nav-home', doc, uiFb, 'nav.home', 'Inherited');
    setFieldFromSources('ui-nav-bio', doc, uiFb, 'nav.bio', 'Inherited');
    setFieldFromSources('ui-nav-rep', doc, uiFb, 'nav.rep', 'Inherited');
    setFieldFromSources('ui-nav-media', doc, uiFb, 'nav.media', 'Inherited');
    setFieldFromSources('ui-nav-cal', doc, uiFb, 'nav.cal', 'Inherited');
    setFieldFromSources('ui-nav-epk', doc, uiFb, 'nav.epk', 'Inherited');
    setFieldFromSources('ui-nav-book', doc, uiFb, 'nav.book', 'Inherited');
    setFieldFromSources('ui-nav-contact', doc, uiFb, 'nav.contact', 'Inherited');
    fillPublicRgUiCopyFields(doc);
  }
  /** Build structured copy DOM and fill nav + public fields from storage (safe on any section). */
  function primeUiPublicCopyFromStorage() {
    if (!state.ready || !state.api) return;
    ensureUiPublicCopyEditorBuilt();
    var d = loadDoc('rg_ui_' + state.lang, null);
    if (!isObject(d)) {
      try {
        if (typeof state.api.uiTable === 'function') {
          var t = state.api.uiTable(state.lang);
          if (isObject(t)) d = t;
        }
      } catch (e) {}
    }
    if (!isObject(d)) d = {};
    syncUiNavAndPublicCopyFromDoc(d);
  }
  function persistPublicRgUiCopyFields(doc) {
    var out = isObject(doc) ? doc : {};
    flatPublicRgUiCopyFields().forEach(function (f) {
      var el = $(fieldDomIdForUiKey(f.key));
      if (!el) return;
      out[f.key] = safeString(el.value);
    });
    return out;
  }
  function normalizeUiLocaleDoc(doc, lang) {
    var out = isObject(doc) ? doc : {};
    var L = safeString(lang || state.lang).toLowerCase();
    if (L === 'it' && safeString(out['nav.media']).trim().toLowerCase() === 'video') {
      out['nav.media'] = 'Media';
    }
    if (safeString(out['nav.epk']).trim()) {
      out['nav.epk'] = 'Dossier';
    }
    return out;
  }
  function collectUiSectionInputsToDoc() {
    var d = {};
    d['nav.home'] = safeString($('ui-nav-home') && $('ui-nav-home').value);
    d['nav.bio'] = safeString($('ui-nav-bio') && $('ui-nav-bio').value);
    d['nav.rep'] = safeString($('ui-nav-rep') && $('ui-nav-rep').value);
    d['nav.media'] = safeString($('ui-nav-media') && $('ui-nav-media').value);
    d['nav.cal'] = safeString($('ui-nav-cal') && $('ui-nav-cal').value);
    d['nav.epk'] = safeString($('ui-nav-epk') && $('ui-nav-epk').value);
    d['nav.book'] = safeString($('ui-nav-book') && $('ui-nav-book').value);
    d['nav.contact'] = safeString($('ui-nav-contact') && $('ui-nav-contact').value);
    d = persistHomeRgUiCopyFields(d);
    d = persistPublicRgUiCopyFields(d);
    return normalizeUiLocaleDoc(d, state.lang);
  }
  function getLegacyBiographyBridgeFallback(langOpt) {
    var L = normalizeLangCode(langOpt || state.lang) || 'en';
    var out = {};
    try {
      if (typeof state.api.admEffectiveSectionField === 'function') {
        ['h2', 'p1', 'p2', 'quote', 'cite'].forEach(function (k) {
          var v = safeString(state.api.admEffectiveSectionField('bio', k)).trim();
          if (v) out[k] = v;
        });
      }
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(L);
        if (isObject(t)) {
          var introLine = safeString(t['home.intro.proof']).trim();
          var continueTag = safeString(t['home.presenter.tag']).trim();
          var continueSub = safeString(t['home.presenter.style']).trim();
          var ctaRep = safeString(t['nav.rep']).trim();
          var ctaMedia = safeString(t['nav.media']).trim();
          var ctaContact = safeString(t['nav.book'] || t['nav.contact']).trim();
          var ctaPrograms = safeString(t['home.intro.ctaPress']).trim();
          if (introLine) out.introLine = introLine;
          if (continueTag) out.continueSectionTag = continueTag;
          if (continueSub) out.continueSub = continueSub;
          if (ctaRep) out.ctaRepertoire = ctaRep;
          if (ctaMedia) out.ctaMedia = ctaMedia;
          if (ctaContact) out.ctaContact = ctaContact;
          if (ctaPrograms) out.ctaHomeIntro = ctaPrograms;
        }
      }
    } catch (e) {}
    return out;
  }
  function getLegacySection(section, langOpt) {
    var L = normalizeLangCode(langOpt || state.lang) || 'en';
    if (section === 'bio') {
      var merged = {};
      try {
        var pool = state.api && state.api.LANG_CONTENT;
        var baseEn = pool && isObject(pool.en) && isObject(pool.en.bio) ? pool.en.bio : null;
        var byLang = pool && isObject(pool[L]) && isObject(pool[L].bio) ? pool[L].bio : null;
        if (isObject(baseEn)) merged = Object.assign(merged, baseEn);
        if (isObject(byLang)) merged = Object.assign(merged, byLang);
      } catch (e) {}
      try {
        if (typeof state.api.get === 'function') {
          var d = state.api.get(section);
          if (isObject(d) && hasBiographyMeaningfulContent(d)) merged = Object.assign(merged, d);
        }
      } catch (e) {}
      merged = Object.assign(merged, getLegacyBiographyBridgeFallback(L));
      if (Object.keys(merged).length) return merged;
      return {};
    }
    try {
      if (typeof state.api.get === 'function') {
        var sec = state.api.get(section);
        if (isObject(sec)) return sec;
      }
    } catch (e) {}
    return {};
  }
  function hasUnsavedChangesPrompt(nextAction) {
    if (!state.dirty) return true;
    return window.confirm(nextAction + '\n\nYou have unsaved changes. Continue anyway?');
  }
  var ADM2_CLOSEOUT_KEY = 'adm2_closeout_v1';
  var ADM2_CLOSEOUT_CHECKBOX_IDS = ['closeout-backup', 'closeout-health', 'closeout-publishing', 'closeout-pdfs', 'closeout-spotcheck'];
  function readCloseoutState() {
    try {
      var raw = sessionStorage.getItem(ADM2_CLOSEOUT_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
    } catch (e) {
      return {};
    }
  }
  function writeCloseoutState(obj) {
    try {
      sessionStorage.setItem(ADM2_CLOSEOUT_KEY, JSON.stringify(obj || {}));
    } catch (e) {}
  }
  function syncCloseoutCheckbox(id, on) {
    var el = $(id);
    if (el) el.checked = !!on;
  }
  function touchCloseoutStep(stepKey) {
    var id = 'closeout-' + stepKey;
    if (!$(id)) return;
    syncCloseoutCheckbox(id, true);
    var d = readCloseoutState();
    d[id] = true;
    writeCloseoutState(d);
  }
  function wireCloseoutChecklist() {
    var stored = readCloseoutState();
    ADM2_CLOSEOUT_CHECKBOX_IDS.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.checked = !!stored[id];
      el.addEventListener('change', function () {
        var d = readCloseoutState();
        d[id] = !!el.checked;
        writeCloseoutState(d);
      });
    });
    if ($('closeout-reset')) {
      $('closeout-reset').addEventListener('click', function () {
        try { sessionStorage.removeItem(ADM2_CLOSEOUT_KEY); } catch (e) {}
        ADM2_CLOSEOUT_CHECKBOX_IDS.forEach(function (nid) { syncCloseoutCheckbox(nid, false); });
      });
    }
  }
  function isBlank(v) {
    return !safeString(v).trim();
  }
  function isValidEmail(v) {
    var s = safeString(v).trim();
    if (!s) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }
  function isValidHttpUrl(v) {
    var s = safeString(v).trim();
    if (!s) return true;
    return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(s);
  }
  var PUBLIC_SEO_PAGES = [
    { id: 'index', label: 'Home' },
    { id: 'biography', label: 'Biography' },
    { id: 'repertoire', label: 'Repertoire' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'media', label: 'Media' },
    { id: 'press', label: 'Press' },
    { id: 'contact', label: 'Contact' },
    { id: 'reviews', label: 'Reviews' }
  ];
  function seoKey(pageId, field) {
    return 'page.' + safeString(pageId).trim() + '.' + safeString(field).trim();
  }
  function shortLabelList(list, maxItems) {
    var arr = Array.isArray(list) ? list.filter(Boolean) : [];
    var max = typeof maxItems === 'number' ? maxItems : 4;
    if (arr.length <= max) return arr.join(', ');
    return arr.slice(0, max).join(', ') + ', +' + (arr.length - max) + ' more';
  }
  function collectPublicOutputIssues(lang, snapshot) {
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var issues = [];
    var ui = getSiteHealthDoc(snapshot, 'rg_ui_' + L, {});
    var uiEn = getSiteHealthDoc(snapshot, 'rg_ui_en', {});
    if (L === 'it' && safeString(ui['nav.media']).trim().toLowerCase() === 'video') {
      issues.push({
        severity: 'recommended',
        section: 'UI / labels',
        text: 'The Italian navigation still uses "Video" for the media label. Save the IT UI once to normalize the live label back to "Media".',
        action: { section: 'ui', lang: 'it' }
      });
    }
    var missingLocalized = [];
    var sameAsEn = [];
    var weakTitles = [];
    var weakDescriptions = [];
    PUBLIC_SEO_PAGES.forEach(function (page) {
      var titleKey = seoKey(page.id, 'title');
      var descKey = seoKey(page.id, 'metaDescription');
      var curTitle = safeString(ui[titleKey]).trim();
      var curDesc = safeString(ui[descKey]).trim();
      var enTitle = safeString(uiEn[titleKey]).trim();
      var enDesc = safeString(uiEn[descKey]).trim();
      if (L !== 'en') {
        if (!curTitle && enTitle) missingLocalized.push(page.label + ' title');
        if (!curDesc && enDesc) missingLocalized.push(page.label + ' description');
        if (curTitle && enTitle && curTitle === enTitle) sameAsEn.push(page.label + ' title');
        if (curDesc && enDesc && curDesc === enDesc) sameAsEn.push(page.label + ' description');
      }
      if (curTitle && (curTitle.length < 18 || curTitle.length > 68)) weakTitles.push(page.label + ' (' + curTitle.length + ' chars)');
      if (curDesc && (curDesc.length < 70 || curDesc.length > 175)) weakDescriptions.push(page.label + ' (' + curDesc.length + ' chars)');
    });
    if (missingLocalized.length) {
      issues.push({
        severity: 'recommended',
        section: 'UI / labels',
        text: 'Some SEO fields are still missing in ' + L.toUpperCase() + ': ' + shortLabelList(missingLocalized, 5) + '. Search snippets may fall back to English/default wording.',
        action: { section: 'ui', lang: L }
      });
    }
    if (sameAsEn.length) {
      issues.push({
        severity: 'structural',
        section: 'UI / labels',
        text: 'Some ' + L.toUpperCase() + ' SEO text still matches EN exactly: ' + shortLabelList(sameAsEn, 5) + '. Search presentation may look untranslated.',
        action: { section: 'ui', lang: L }
      });
    }
    if (weakTitles.length) {
      issues.push({
        severity: 'structural',
        section: 'UI / labels',
        text: 'Some SEO titles are unusually short or long: ' + shortLabelList(weakTitles, 4) + '.',
        action: { section: 'ui', lang: L }
      });
    }
    if (weakDescriptions.length) {
      issues.push({
        severity: 'structural',
        section: 'UI / labels',
        text: 'Some meta descriptions are unusually short or long: ' + shortLabelList(weakDescriptions, 4) + '.',
        action: { section: 'ui', lang: L }
      });
    }
    var perfs = getSiteHealthDoc(snapshot, 'rg_perfs', []);
    if (!Array.isArray(perfs)) perfs = [];
    var invalidEventLinks = 0;
    perfs.forEach(function (e) {
      var status = safeString(e && e.status || 'upcoming');
      if (status === 'hidden' || status === 'past') return;
      var localKey = 'eventLink_' + L;
      var localUrl = safeString(e && e[localKey]).trim();
      var fallbackUrl = safeString(e && e.eventLink).trim();
      var publicUrl = localUrl || fallbackUrl;
      if (publicUrl && !isValidHttpUrl(publicUrl)) invalidEventLinks += 1;
    });
    if (invalidEventLinks) {
      issues.push({
        severity: 'critical',
        section: 'Calendar',
        text: invalidEventLinks + ' visible calendar event link' + (invalidEventLinks === 1 ? ' looks' : 's look') + ' invalid for ' + L.toUpperCase() + '. Public Tickets / Info buttons may fail.',
        action: { section: 'calendar', lang: L }
      });
    }
    return issues;
  }
  function setPillStatus(id, kind, text) {
    var el = $(id);
    if (!el) return;
    el.classList.remove('ok', 'warn', 'err');
    if (kind) el.classList.add(kind);
    el.textContent = text;
  }
  function setValidationText(id, ok, text) {
    var el = $(id);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('ok', !!ok);
    el.classList.toggle('err', !ok);
  }

  function waitForLegacyApi() {
    var frame = $('legacyBridge');
    return new Promise(function (resolve, reject) {
      var tries = 0;
      var done = false;
      function finish(err, api) {
        if (done) return;
        done = true;
        if (err) reject(err);
        else resolve(api);
      }
      function check() {
        if (done) return;
        tries++;
        var w = frame && frame.contentWindow;
        if (w && typeof w.load === 'function' && typeof w.save === 'function') {
          if (typeof w.setLang !== 'function') {
            return finish(new Error('Legacy admin is missing setLang(). Reload admin.html and try again.'));
          }
          return finish(null, w);
        }
        if (tries > 220) return finish(new Error('Timed out waiting for legacy admin (admin.html).'));
        setTimeout(check, 50);
      }
      frame.addEventListener('load', check, { once: true });
      check();
    });
  }

  function pendingLegacySaveList(key) {
    var k = safeString(key);
    if (!k) return [];
    if (!state.pendingLegacySaves[k]) state.pendingLegacySaves[k] = [];
    return state.pendingLegacySaves[k];
  }

  function settleLegacySave(key, ok, err) {
    var k = safeString(key);
    if (!k || !state.pendingLegacySaves[k] || !state.pendingLegacySaves[k].length) return;
    var pending = state.pendingLegacySaves[k].slice();
    delete state.pendingLegacySaves[k];
    pending.forEach(function (entry) {
      try { clearTimeout(entry.timer); } catch (e) {}
      if (ok) entry.resolve({ key: k });
      else entry.reject(err || new Error('Save failed for ' + k));
    });
  }

  function installLegacySaveHooks(api) {
    if (!api || state.legacySaveHooksInstalled) return;
    var origStart = typeof api.rgSaveStart === 'function' ? api.rgSaveStart : null;
    var origOk = typeof api.rgSaveOk === 'function' ? api.rgSaveOk : null;
    var origFailed = typeof api.rgSaveFailed === 'function' ? api.rgSaveFailed : null;

    api.rgSaveStart = function (key) {
      if (origStart) origStart.apply(api, arguments);
      setStatus('Saving · ' + humanStorageKeyLine(key), 'warn');
    };
    api.rgSaveOk = function (key) {
      if (origOk) origOk.apply(api, arguments);
      settleLegacySave(key, true, null);
    };
    api.rgSaveFailed = function (key, err) {
      if (origFailed) origFailed.apply(api, arguments);
      settleLegacySave(key, false, err || new Error('Save failed for ' + key));
    };
    state.legacySaveHooksInstalled = true;
  }

  function waitForLegacySaveResult(key) {
    if (!state.api || !state.legacySaveHooksInstalled) {
      return Promise.resolve({ key: safeString(key), mode: 'optimistic' });
    }
    return new Promise(function (resolve, reject) {
      var entry = {
        resolve: resolve,
        reject: reject,
        timer: setTimeout(function () {
          reject(new Error('Timed out waiting for cloud save: ' + safeString(key)));
        }, 12000)
      };
      pendingLegacySaveList(key).push(entry);
    });
  }

  function validateKeyValue(key, val) {
    if (val === undefined) throw new Error('Cannot save undefined (' + key + ')');
    if (typeof val === 'function') throw new Error('Cannot save a function (' + key + ')');
    if (key === 'rg_rep_cards' || key === 'rg_perfs' || key === 'rg_past_perfs' || key === 'rg_press') {
      if (!Array.isArray(val)) throw new Error(key + ' must be an array');
    }
    if (key === 'rg_vid' || key === 'rg_vid_en') {
      if (!isObject(val)) throw new Error(key + ' must be an object');
      if (!Array.isArray(val.videos)) throw new Error(key + '.videos must be an array');
    }
    if (key === 'rg_audio') {
      if (!isObject(val)) throw new Error('rg_audio must be an object');
      if (!Array.isArray(val.items)) throw new Error('rg_audio.items must be an array');
    }
    if (key === 'rg_photos') {
      if (!isObject(val)) throw new Error('rg_photos must be an object');
      ['s', 't', 'b'].forEach(function (k) {
        if (!Array.isArray(val[k])) throw new Error('rg_photos.' + k + ' must be an array');
      });
    }
    if (key === 'rg_photo_captions' && !isObject(val)) throw new Error('rg_photo_captions must be an object');
    if (key === 'rg_epk_photos' && !Array.isArray(val)) throw new Error('rg_epk_photos must be an array');
    if (key === 'rg_epk_bios' && !isObject(val)) throw new Error('rg_epk_bios must be an object');
    if (key === 'rg_epk_cvs') {
      if (!isObject(val)) throw new Error('rg_epk_cvs must be an object');
      Object.keys(val).forEach(function (k) {
        if (typeof val[k] !== 'string') throw new Error('rg_epk_cvs.' + k + ' must be a base64 string');
      });
    }
    if (key === 'rg_public_pdfs' && !isObject(val)) throw new Error('rg_public_pdfs must be an object');
    if (
      key.indexOf('hero_') === 0 || key.indexOf('bio_') === 0 || key.indexOf('rep_') === 0 ||
      key.indexOf('perf_') === 0 || key.indexOf('contact_') === 0 || key.indexOf('rg_ui_') === 0
    ) {
      if (!isObject(val)) throw new Error(key + ' must be an object');
    }
    if (key === 'rg_press_meta' && !isObject(val)) throw new Error('rg_press_meta must be an object');
    if (key.indexOf('rg_programs_') === 0) {
      if (!isObject(val)) throw new Error(key + ' must be an object');
      if (!Array.isArray(val.programs)) throw new Error(key + '.programs must be an array');
    }
    if (key.indexOf('rg_editorial_') === 0 && !isObject(val)) throw new Error(key + ' must be an object');
    if (key === 'rg_repertoire_planner') {
      if (!isObject(val)) throw new Error('rg_repertoire_planner must be an object');
      if (!Array.isArray(val.items)) throw new Error('rg_repertoire_planner.items must be an array');
    }
    if (key === 'rg_program_blueprints') {
      if (!isObject(val)) throw new Error('rg_program_blueprints must be an object');
      if (!isObject(val.blueprints)) throw new Error('rg_program_blueprints.blueprints must be an object');
    }
    if (key === 'rg_concert_history') {
      if (!isObject(val)) throw new Error('rg_concert_history must be an object');
      if (!Array.isArray(val.concerts)) throw new Error('rg_concert_history.concerts must be an array');
    }
    if (key === 'rg_repertoire_discovery') {
      if (!isObject(val)) throw new Error('rg_repertoire_discovery must be an object');
      if (!Array.isArray(val.records)) throw new Error('rg_repertoire_discovery.records must be an array');
    }
    if (key === 'rg_outreach_tracker') {
      if (!isObject(val)) throw new Error('rg_outreach_tracker must be an object');
      if (!Array.isArray(val.records)) throw new Error('rg_outreach_tracker.records must be an array');
    }
  }

  function loadDoc(key, fb) {
    ensureReady();
    var v = state.api.load(key);
    if (v == null) return clone(fb);
    if (Array.isArray(fb) && !Array.isArray(v)) {
      setStatus('Unexpected shape for ' + key + ' — using safe default', 'warn');
      return clone(fb);
    }
    if (isObject(fb) && !isObject(v)) {
      setStatus('Unexpected shape for ' + key + ' — using safe default', 'warn');
      return clone(fb);
    }
    return clone(v);
  }
  function humanStorageKeyLine(key) {
    var k = safeString(key);
    if (/^hero_/.test(k)) return 'Home / Hero (' + k.replace(/^hero_/, '').toUpperCase() + ')';
    if (/^bio_/.test(k)) return 'Biography (' + k.replace(/^bio_/, '').toUpperCase() + ')';
    if (/^rep_/.test(k)) return 'Repertoire intro (' + k.replace(/^rep_/, '').toUpperCase() + ')';
    if (k === 'rg_rep_cards') return 'Repertoire cards (shared list)';
    if (/^programs_/.test(k)) return 'Programs (legacy slot · ' + k + ')';
    if (/^rg_programs/.test(k)) {
      var rest = k.replace(/^rg_programs/, '').replace(/^_/, '');
      return 'Programs (' + (rest ? rest.toUpperCase() : 'default') + ')';
    }
    if (/^rg_editorial_/.test(k)) return 'Programs · context links (' + k.replace(/^rg_editorial_/, '').toUpperCase() + ')';
    if (/^perf_/.test(k)) return 'Calendar intro (' + k.replace(/^perf_/, '').toUpperCase() + ')';
    if (k === 'rg_perfs') return 'Calendar events';
    if (k === 'rg_past_perfs') return 'Past performances (public list)';
    if (k === 'rg_repertoire_planner') return 'Programme Offers · repertoire library';
    if (k === 'rg_program_blueprints') return 'Programme Offers · saved offers';
    if (k === 'rg_concert_history') return 'Programme Offers · concert history archive';
    if (k === 'rg_repertoire_discovery') return 'Repertoire Discovery';
    if (k === 'rg_outreach_tracker') return 'Venues / Outreach';
    if (k === 'rg_vid') return 'Media · videos';
    if (k === 'rg_vid_en') return 'Media · videos (legacy key · read-only merge)';
    if (k === 'rg_audio') return 'Media · audio';
    if (k === 'rg_photos') return 'Media · photos';
    if (k === 'rg_photo_captions') return 'Media · photo captions';
    if (k === 'rg_press') return 'Press · quotes';
    if (k === 'rg_press_meta') return 'Press · section notes';
    if (k === 'rg_epk_bios') return 'EPK bios';
    if (k === 'rg_epk_photos') return 'EPK photos';
    if (k === 'rg_epk_cvs') return 'EPK CVs';
    if (k === 'rg_public_pdfs') return 'Public PDF links';
    if (/^contact_/.test(k)) return 'Contact (' + k.replace(/^contact_/, '').toUpperCase() + ')';
    if (/^rg_ui_/.test(k)) return 'UI / translations (' + k.replace(/^rg_ui_/, '').toUpperCase() + ')';
    return k;
  }
  function pushActivitySummary(title, lines) {
    activityLog.unshift({ t: Date.now(), title: safeString(title), lines: lines || [] });
    if (activityLog.length > 5) activityLog.pop();
    var el = $('activitySummary');
    if (!el) return;
    el.textContent = activityLog.map(function (e) {
      var ts = new Date(e.t).toLocaleString();
      return e.title + ' · ' + ts + (e.lines && e.lines.length ? '\n' + e.lines.join('\n') : '');
    }).join('\n\n');
  }
  function getImportScopeValue() {
    return $('importScope') ? safeString($('importScope').value).trim() || 'all' : 'all';
  }
  function getImportScopeLabel() {
    var sel = $('importScope');
    if (!sel || sel.selectedIndex < 0) return 'All compatible content';
    return safeString(sel.options[sel.selectedIndex].textContent) || sel.value;
  }
  function syncTopbarToolsDisclosure() {
    var el = $('topbarMoreTools');
    if (!el) return;
    if (state.section === 'programbuilder') {
      el.open = false;
      return;
    }
    el.open = !window.matchMedia('(max-width: 860px)').matches;
  }
  function isProgramBuilderCompactViewport() {
    return !!(window.matchMedia && window.matchMedia('(max-width: 860px)').matches);
  }
  function setProgramBuilderDisclosureOpen(el, open) {
    if (!el) return;
    el.dataset.syncing = '1';
    el.open = !!open;
    window.setTimeout(function () {
      if (el) delete el.dataset.syncing;
    }, 0);
  }
  function syncProgramBuilderSelectionUi(bp) {
    bp = bp || currentBlueprint();
    var count = Array.isArray(bp && bp.items) ? bp.items.length : 0;
    if (document.body) document.body.classList.toggle('pb-programme-has-selection', count > 0);
    if ($('pb-mobile-selected-label')) $('pb-mobile-selected-label').textContent = count ? ('Selected (' + String(count) + ')') : 'Selected';
  }
  function focusProgramBuilderSelection(openEditor, shouldScroll) {
    if ($('pb-step-build')) setProgramBuilderDisclosureOpen($('pb-step-build'), true);
    if ($('pb-step-selected')) setProgramBuilderDisclosureOpen($('pb-step-selected'), true);
    if (openEditor && $('pb-piece-editor-panel')) setProgramBuilderDisclosureOpen($('pb-piece-editor-panel'), true);
    if (shouldScroll !== false && isProgramBuilderCompactViewport()) scrollProgramBuilderAnchor('pb-step-selected');
  }
  function syncProgramBuilderResponsiveUi(forceDefaults) {
    if (state.section !== 'programbuilder') return;
    var compact = isProgramBuilderCompactViewport();
    ['pb-step-setup', 'pb-step-build', 'pb-step-selected'].forEach(function (id) {
      var shell = $(id);
      if (!shell || (!forceDefaults && shell.dataset.userToggled === '1')) return;
      setProgramBuilderDisclosureOpen(shell, true);
    });
    var outputShell = $('pb-output-shell');
    if (outputShell && (forceDefaults || outputShell.dataset.userToggled !== '1')) {
      setProgramBuilderDisclosureOpen(outputShell, true);
    }
    var previewShell = $('pb-preview-shell');
    if (previewShell && (forceDefaults || previewShell.dataset.userToggled !== '1')) {
      setProgramBuilderDisclosureOpen(previewShell, !compact);
    }
    var quickPicksShell = $('pb-quick-picks-shell');
    if (quickPicksShell && (forceDefaults || quickPicksShell.dataset.userToggled !== '1')) {
      setProgramBuilderDisclosureOpen(quickPicksShell, !compact);
    }
    var secondaryHub = $('pb-secondary-hub');
    if (secondaryHub && (forceDefaults || secondaryHub.dataset.userToggled !== '1')) {
      setProgramBuilderDisclosureOpen(secondaryHub, false);
    }
    var pieceEditor = $('pb-piece-editor-panel');
    if (pieceEditor && compact && (forceDefaults || pieceEditor.dataset.userToggled !== '1')) {
      setProgramBuilderDisclosureOpen(pieceEditor, false);
    }
  }
  function scrollProgramBuilderAnchor(id) {
    var target = $(id);
    if (!target) return;
    if (target.tagName === 'DETAILS') target.open = true;
    if (id === 'pb-step-selected' && $('pb-step-build')) $('pb-step-build').open = true;
    if (id === 'pb-step-output' && $('pb-output-shell')) $('pb-output-shell').open = true;
    if (id === 'pb-step-advanced' && $('pb-secondary-hub')) $('pb-secondary-hub').open = true;
    if (id === 'pb-fee-estimate') {
      if ($('pb-secondary-hub')) $('pb-secondary-hub').open = true;
      if (target && target.tagName === 'DETAILS') target.open = true;
    }
    window.setTimeout(function () {
      if (typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }
  function bindProgramBuilderUiChrome() {
    if (document.body && document.body.dataset.pbUiChromeWired === '1') return;
    if (document.body) document.body.dataset.pbUiChromeWired = '1';
    document.querySelectorAll('[data-pb-jump]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        scrollProgramBuilderAnchor(btn.getAttribute('data-pb-jump'));
      });
    });
    document.querySelectorAll('[data-pb-mobile-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-pb-mobile-action');
        if (action === 'generate' && $('pb-generate-draft')) {
          $('pb-generate-draft').click();
          return;
        }
        if (action === 'add' && $('pb-add-piece')) {
          if ($('pb-step-build')) setProgramBuilderDisclosureOpen($('pb-step-build'), true);
          $('pb-add-piece').click();
          return;
        }
        if (action === 'selected') {
          focusProgramBuilderSelection(true, true);
          return;
        }
        if (action === 'save' && $('pb-save-blueprints')) $('pb-save-blueprints').click();
      });
    });
    ['pb-step-setup', 'pb-step-build', 'pb-step-selected', 'pb-output-shell', 'pb-preview-shell', 'pb-quick-picks-shell', 'pb-secondary-hub', 'pb-piece-editor-panel'].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('toggle', function () {
        if (el.dataset.syncing === '1') return;
        el.dataset.userToggled = '1';
      });
    });
  }
  function escapeHtml(v) {
    return safeString(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(v) {
    return escapeHtml(v).replace(/`/g, '&#96;');
  }
  function getStoredDocRaw(key, fallback) {
    try {
      if (!state.api || typeof state.api.load !== 'function') return clone(fallback);
      var v = state.api.load(key);
      if (v == null) return clone(fallback);
      return clone(v);
    } catch (e) {
      return clone(fallback);
    }
  }
  function siteHealthKeyList() {
    return [
      'hero_en','hero_de','hero_es','hero_it','hero_fr',
      'bio_en','bio_de','bio_es','bio_it','bio_fr',
      'contact_en','contact_de','contact_es','contact_it','contact_fr',
      'rg_ui_en','rg_ui_de','rg_ui_es','rg_ui_it','rg_ui_fr',
      'rg_programs','rg_programs_en','rg_programs_de','rg_programs_es','rg_programs_it','rg_programs_fr',
      'rg_perfs','rg_vid','rg_vid_en','rg_audio','rg_photos','rg_press','rg_public_pdfs'
    ];
  }
  function buildSiteHealthSnapshot() {
    var out = {};
    siteHealthKeyList().forEach(function (k) {
      out[k] = getStoredDocRaw(k, null);
    });
    return out;
  }
  function getSiteHealthDoc(snapshot, key, fallback) {
    if (!snapshot || !hasOwn(snapshot, key) || snapshot[key] == null) return clone(fallback);
    return clone(snapshot[key]);
  }
  /** Same resolution order as the Programs editor: rg_programs_<lang>, then legacy getPrograms(), then EN rg_programs. Use snapshot for rg_* reads in Site Health; pass null to read live storage (editor). */
  function resolveProgramsDocForLang(lang, snapshot) {
    var byLang = snapshot
      ? getSiteHealthDoc(snapshot, 'rg_programs_' + lang, null)
      : loadDoc('rg_programs_' + lang, null);
    if (isObject(byLang) && Array.isArray(byLang.programs)) return safeProgramsDoc(byLang);
    try {
      if (typeof state.api.getPrograms === 'function') {
        var effective = state.api.getPrograms();
        if (isObject(effective) && Array.isArray(effective.programs)) return safeProgramsDoc(effective);
      }
    } catch (e) {}
    if (lang === 'en') {
      var legacy = snapshot
        ? getSiteHealthDoc(snapshot, 'rg_programs', null)
        : loadDoc('rg_programs', null);
      if (isObject(legacy) && Array.isArray(legacy.programs)) return safeProgramsDoc(legacy);
    }
    return safeProgramsDoc({ title: '', subtitle: '', intro: '', closingNote: '', programs: [] });
  }
  function getProgramsForHealth(snapshot, lang) {
    return resolveProgramsDocForLang(lang, snapshot);
  }
  function waitMs(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }
  function stableJsonStringify(val) {
    if (val === null || typeof val !== 'object') return JSON.stringify(val);
    if (Array.isArray(val)) return '[' + val.map(function (x) { return stableJsonStringify(x); }).join(',') + ']';
    var keys = Object.keys(val).sort();
    return '{' + keys.map(function (k) {
      return JSON.stringify(k) + ':' + stableJsonStringify(val[k]);
    }).join(',') + '}';
  }
  function snapshotHash(snapshot) {
    try { return stableJsonStringify(snapshot || {}); } catch (e) { return ''; }
  }
  function siteHealthSnapshotLooksUnhydrated(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return true;
    var nonNull = 0;
    siteHealthKeyList().forEach(function (k) {
      if (snapshot[k] != null) nonNull += 1;
    });
    return nonNull === 0;
  }
  async function ensureSiteHealthHydratedStable() {
    var bridgeAt = state.bridgeReadyAt || Date.now();
    await waitMs(Math.max(0, 4000 - (Date.now() - bridgeAt)));
    var phase1Start = Date.now();
    var phase1MaxMs = 25000;
    while (Date.now() - phase1Start < phase1MaxMs) {
      var probe = buildSiteHealthSnapshot();
      if (!siteHealthSnapshotLooksUnhydrated(probe)) break;
      await waitMs(250);
    }
    var consecutiveSame = 0;
    var lastHash = '';
    var lastSnap = null;
    var phase2Start = Date.now();
    var phase2MaxMs = 15000;
    while (Date.now() - phase2Start < phase2MaxMs) {
      var cur = buildSiteHealthSnapshot();
      var h = snapshotHash(cur);
      if (h === lastHash) {
        consecutiveSame += 1;
        lastSnap = cur;
        if (consecutiveSame >= 3) {
          state.siteHealthSnapshot = cur;
          return;
        }
      } else {
        lastHash = h;
        lastSnap = cur;
        consecutiveSame = 1;
      }
      await waitMs(200);
    }
    state.siteHealthSnapshot = lastSnap || buildSiteHealthSnapshot();
  }
  function showSiteHealthPlaceholder() {
    state.siteHealthSnapshot = null;
    var overall = $('sitehealth-overall');
    if (overall) {
      overall.classList.remove('ok', 'err', 'info');
      overall.classList.add('warn');
      overall.textContent = 'Click Run checks now';
    }
    var sb = $('sitehealth-section-status');
    if (sb) sb.innerHTML = '<p class="muted">Checks use saved content plus a few lightweight public-output checks inferred from that content. They run only when you click the button.</p>';
    var mb = $('sitehealth-lang-matrix');
    if (mb) mb.innerHTML = '';
    var ib = $('sitehealth-issues');
    if (ib) ib.innerHTML = '<div class="empty-state">No check run yet.</div>';
  }
  function scoreStatus(missingCount, hardFail) {
    if (hardFail) return 'err';
    if (missingCount > 0) return 'warn';
    return 'ok';
  }
  function normalizeHealthSeverity(issue) {
    var severity = safeString(issue && issue.severity).trim().toLowerCase();
    if (severity === 'critical' || severity === 'recommended' || severity === 'structural') return severity;
    var kind = safeString(issue && issue.kind).trim().toLowerCase();
    if (kind === 'err') return 'critical';
    if (kind === 'info') return 'structural';
    return 'recommended';
  }
  function healthSeverityMeta(severity) {
    if (severity === 'critical') return { tone: 'err', label: 'Critical' };
    if (severity === 'structural') return { tone: 'info', label: 'Structural difference' };
    return { tone: 'warn', label: 'Recommended' };
  }
  function countHealthIssuesBySeverity(list, severity) {
    return (list || []).filter(function (x) { return x && x.severity === severity; }).length;
  }
  function statusBadgeHtml(status, label) {
    return '<span class="pill ' + status + '">' + escapeHtml(label) + '</span>';
  }
  function healthSectionBadge(status) {
    if (status === 'err') return statusBadgeHtml('err', 'Critical');
    if (status === 'warn') return statusBadgeHtml('warn', 'Recommended');
    return statusBadgeHtml('ok', 'Ready');
  }
  function siteHealthActionLabel(action) {
    action = action || {};
    var lang = safeString(action.lang).trim().toUpperCase();
    var suffix = lang ? ' (' + lang + ')' : '';
    if (action.section === 'press' && action.pressTab === 'pdfs') return 'Open PDF links' + suffix;
    if (action.section === 'press' && action.pressTab === 'quotes' && action.pressFilter === 'hidden') return 'Open hidden quotes' + suffix;
    if (action.section === 'press' && action.pressTab === 'quotes') return 'Open quotes' + suffix;
    if (action.section === 'media' && action.mediaTab === 'videos') return 'Open videos' + suffix;
    if (action.section === 'media' && action.mediaTab === 'photos') return 'Open photos' + suffix;
    if (action.section === 'home') return 'Open Home editor' + suffix;
    if (action.section === 'bio') return 'Open Biography editor' + suffix;
    if (action.section === 'programs') return 'Open Programmes editor' + suffix;
    if (action.section === 'calendar') return 'Open Calendar editor' + suffix;
    if (action.section === 'contact') return 'Open Contact editor' + suffix;
    if (action.section === 'ui') return 'Open UI labels' + suffix;
    if (action.section === 'press') return 'Open Press editor' + suffix;
    if (action.section === 'media') return 'Open Media editor' + suffix;
    return 'Open relevant section' + suffix;
  }
  function languageSectionStatus(lang, snapshot) {
    var hero = getSiteHealthDoc(snapshot, 'hero_' + lang, {});
    var bio = getSiteHealthDoc(snapshot, 'bio_' + lang, {});
    var contact = getSiteHealthDoc(snapshot, 'contact_' + lang, {});
    var ui = getSiteHealthDoc(snapshot, 'rg_ui_' + lang, {});
    var programs = getProgramsForHealth(snapshot, lang);
    var out = {};
    var homeMissing = ['cta1', 'cta2'].filter(function (k) { return isBlank(hero[k]); }).length;
    out.home = scoreStatus(homeMissing, false);
    var bioMissing = ['h2', 'p1', 'p2'].filter(function (k) { return isBlank(bio[k]); }).length;
    out.bio = scoreStatus(bioMissing, false);
    var enPrograms = getProgramsForHealth(snapshot, 'en');
    var hasLocalPrograms = Array.isArray(programs.programs) && programs.programs.length > 0;
    var hasEnPrograms = Array.isArray(enPrograms.programs) && enPrograms.programs.length > 0;
    var programsMissing = isBlank(programs.title) ? 1 : 0;
    out.programs = lang === 'en'
      ? scoreStatus(programsMissing, !hasLocalPrograms)
      : (!hasLocalPrograms && !hasEnPrograms ? 'err' : scoreStatus(programsMissing, false));
    var contactMissing = ['title', 'sub', 'email'].filter(function (k) { return isBlank(contact[k]); }).length;
    out.contact = scoreStatus(contactMissing, (!isBlank(contact.email) && !isValidEmail(contact.email)));
    var navKeys = ['nav.home', 'nav.bio', 'nav.rep', 'nav.media', 'nav.cal', 'nav.epk', 'nav.book', 'nav.contact'];
    var uiMissing = navKeys.filter(function (k) { return isBlank(ui[k]); }).length;
    out.ui = uiMissing >= 3 ? 'warn' : (uiMissing > 0 ? 'ok' : 'ok');
    return out;
  }
  function applyHealthActionFromButton(btn) {
    if (!btn) return;
    if (!hasUnsavedChangesPrompt('Open issue location')) return;
    var lang = safeString(btn.getAttribute('data-lang')).trim();
    var section = safeString(btn.getAttribute('data-section')).trim();
    var pressTab = safeString(btn.getAttribute('data-press-tab')).trim();
    var mediaTab = safeString(btn.getAttribute('data-media-tab')).trim();
    var pressFilter = safeString(btn.getAttribute('data-press-filter')).trim();
    if (lang && LANGS.indexOf(lang) >= 0) {
      state.lang = lang;
      if ($('langSelect')) $('langSelect').value = lang;
      if (typeof state.api.setLang === 'function') state.api.setLang(lang, { persist: false });
      updateLangBadge();
    }
    if (section) openSection(section);
    if (section === 'press' && pressTab) togglePressTab(pressTab);
    if (section === 'media' && mediaTab) toggleMediaTab(mediaTab);
    if (section === 'press' && pressFilter && $('press-visible-filter')) {
      $('press-visible-filter').value = pressFilter;
      state.pressVisibleFilter = pressFilter;
      renderPressList();
    }
    if (lang && LANGS.indexOf(lang) >= 0) primeUiPublicCopyFromStorage();
  }
  async function renderSiteHealth() {
    if (!state.ready || !state.api) return;
    var token = ++state.siteHealthRenderToken;
    var selLang = $('langSelect') ? safeString($('langSelect').value).trim().toLowerCase() : '';
    if (selLang && LANGS.indexOf(selLang) >= 0) {
      state.lang = selLang;
      state.siteHealthEffectiveLang = selLang;
      if (typeof state.api.setLang === 'function') state.api.setLang(selLang, { persist: false });
      updateLangBadge();
    } else {
      state.siteHealthEffectiveLang = safeString(state.lang || 'en');
    }
    await ensureSiteHealthHydratedStable();
    if (token !== state.siteHealthRenderToken) return;
    var snapshot = state.siteHealthSnapshot ? clone(state.siteHealthSnapshot) : {};
    var effectiveLang = safeString(state.siteHealthEffectiveLang || state.lang || 'en');
    var issues = [];
    var sectionStatus = {};
    var langs = LANGS.slice();
    var matrix = {};
    langs.forEach(function (lang) {
      matrix[lang] = languageSectionStatus(lang, snapshot);
    });
    var current = matrix[effectiveLang] || languageSectionStatus(effectiveLang, snapshot);
    sectionStatus['Home / Hero'] = current.home;
    sectionStatus['Biography'] = current.bio;
    sectionStatus['Programs'] = current.programs;
    sectionStatus['Contact'] = current.contact;
    sectionStatus['UI / labels'] = current.ui;
    var perfs = getSiteHealthDoc(snapshot, 'rg_perfs', []);
    if (!Array.isArray(perfs)) perfs = [];
    var perfUpcomingVisible = perfs.filter(function (e) { var s = safeString(e && e.status || 'upcoming'); return s !== 'past' && s !== 'hidden'; });
    var perfMissingCritical = perfUpcomingVisible.filter(function (e) { return isBlank(e && e.sortDate) || isBlank(e && e.time) || isBlank(e && e.venue); }).length;
    var perfPastMissing = perfs.filter(function (e) { return safeString(e && e.status) === 'past' && (isBlank(e && e.sortDate) || isBlank(e && e.time) || isBlank(e && e.venue)); }).length;
    var perfHidden = perfs.filter(function (e) { return safeString(e && e.status) === 'hidden'; }).length;
    sectionStatus['Calendar'] = perfMissingCritical > 0 ? 'err' : (perfPastMissing > 0 ? 'warn' : 'ok');
    if (perfMissingCritical) issues.push({ severity: 'critical', section: 'Calendar', text: perfMissingCritical + ' upcoming event' + (perfMissingCritical === 1 ? ' is' : 's are') + ' missing a public date, time, or venue. Visitors would see incomplete listing details.', action: { section: 'calendar' } });
    if (perfPastMissing) issues.push({ severity: 'recommended', section: 'Calendar', text: perfPastMissing + ' past event' + (perfPastMissing === 1 ? ' is' : 's are') + ' missing some archived details. The live calendar still works, but the archive could be tidier.', action: { section: 'calendar' } });
    if (perfHidden) issues.push({ severity: 'structural', section: 'Calendar', text: perfHidden + ' calendar event' + (perfHidden === 1 ? ' is' : 's are') + ' intentionally hidden from the public site.', action: { section: 'calendar' } });
    var vid = mergeRgVidRead(getSiteHealthDoc(snapshot, 'rg_vid', {}), getSiteHealthDoc(snapshot, 'rg_vid_en', null));
    var videos = Array.isArray(vid.videos) ? vid.videos : [];
    var vidsMissing = videos.filter(function (v) { return isBlank(v && v.id) || isBlank(v && v.title); }).length;
    var vidsHidden = videos.filter(function (v) { return !!(v && v.hidden); }).length;
    var photos = safePhotos(getSiteHealthDoc(snapshot, 'rg_photos', {}));
    var photoCount = (photos.s || []).length + (photos.t || []).length + (photos.b || []).length;
    sectionStatus['Media'] = vidsMissing ? 'warn' : (photoCount ? 'ok' : 'warn');
    if (vidsMissing) issues.push({ severity: 'recommended', section: 'Media', text: vidsMissing + ' video entr' + (vidsMissing === 1 ? 'y is' : 'ies are') + ' missing a title or video ID, so that item may not present cleanly.', action: { section: 'media', mediaTab: 'videos' } });
    if (!photoCount) issues.push({ severity: 'critical', section: 'Media', text: 'No media photos are available. The public media section will feel incomplete.', action: { section: 'media', mediaTab: 'photos' } });
    if (vidsHidden) issues.push({ severity: 'structural', section: 'Media', text: vidsHidden + ' video' + (vidsHidden === 1 ? ' is' : 's are') + ' currently hidden by choice.', action: { section: 'media', mediaTab: 'videos' } });
    var press = getSiteHealthDoc(snapshot, 'rg_press', []);
    if (!Array.isArray(press)) press = [];
    var missingSource = 0;
    var missingTranslation = 0;
    var hiddenQuotes = 0;
    var invalidPressUrls = 0;
    press.forEach(function (p) {
      var visible = !(p && p.visible === false);
      if (visible && isBlank(p && p.source)) missingSource += 1;
      var q = isObject(p && p.quotes_i18n) ? p.quotes_i18n[effectiveLang] : p && p.quote;
      if (visible && isBlank(q)) missingTranslation += 1;
      var url = safeString(p && p.url).trim();
      if (visible && url && !isValidHttpUrl(url)) invalidPressUrls += 1;
      if (p && p.visible === false) hiddenQuotes += 1;
    });
    var pdfs = safePublicPdfs(getSiteHealthDoc(snapshot, 'rg_public_pdfs', {}));
    var invalidPdfs = [];
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      var d = safeString(pdfs.dossier[L] && pdfs.dossier[L].url).trim();
      var a = safeString(pdfs.artistSheet[L] && pdfs.artistSheet[L].url).trim();
      if (d && !isValidHttpUrl(d)) invalidPdfs.push('Dossier ' + L);
      if (a && !isValidHttpUrl(a)) invalidPdfs.push('Artist Sheet ' + L);
    });
    var missingAnyEnPdf = !safeString(pdfs.dossier.EN && pdfs.dossier.EN.url).trim() || !safeString(pdfs.artistSheet.EN && pdfs.artistSheet.EN.url).trim();
    sectionStatus['Press / EPK'] = invalidPdfs.length ? 'err' : (missingSource + missingTranslation > 0 || invalidPressUrls > 0 || missingAnyEnPdf ? 'warn' : 'ok');
    if (missingSource) issues.push({ severity: 'recommended', section: 'Press / EPK', text: missingSource + ' visible press quote' + (missingSource === 1 ? ' is' : 's are') + ' missing a publication/source credit.', action: { section: 'press', pressTab: 'quotes' } });
    if (missingTranslation) issues.push({ severity: 'recommended', section: 'Press / EPK', text: missingTranslation + ' visible press quote' + (missingTranslation === 1 ? ' is' : 's are') + ' still missing ' + effectiveLang.toUpperCase() + ' wording, so this language path feels less complete.', action: { section: 'press', pressTab: 'quotes' } });
    if (invalidPressUrls) issues.push({ severity: 'recommended', section: 'Press / EPK', text: invalidPressUrls + ' visible press quote source link' + (invalidPressUrls === 1 ? ' looks' : 's look') + ' invalid.', action: { section: 'press', pressTab: 'quotes' } });
    if (hiddenQuotes) issues.push({ severity: 'structural', section: 'Press / EPK', text: hiddenQuotes + ' press quote' + (hiddenQuotes === 1 ? ' is' : 's are') + ' hidden intentionally.', action: { section: 'press', pressTab: 'quotes', pressFilter: 'hidden' } });
    if (invalidPdfs.length) issues.push({ severity: 'critical', section: 'Press / EPK', text: 'Some public PDF links are invalid: ' + invalidPdfs.join(', ') + '.', action: { section: 'press', pressTab: 'pdfs' } });
    if (missingAnyEnPdf) issues.push({ severity: 'recommended', section: 'Press / EPK', text: 'The EN public PDF set is still incomplete, so the main press page offers fewer downloads than expected.', action: { section: 'press', pressTab: 'pdfs', lang: 'en' } });
    var homeCurrent = getSiteHealthDoc(snapshot, 'hero_' + effectiveLang, {});
    var homePrimaryMissing = ['cta1', 'cta2'].filter(function (k) { return isBlank(homeCurrent[k]); }).length;
    var homeIntroMissing = ['introCtaBio', 'introCtaMedia'].filter(function (k) { return isBlank(homeCurrent[k]); }).length;
    if (homePrimaryMissing) issues.push({ severity: 'recommended', section: 'Home / Hero', text: homePrimaryMissing + ' primary Home button label' + (homePrimaryMissing === 1 ? ' is' : 's are') + ' still empty in ' + effectiveLang.toUpperCase() + '.', action: { section: 'home', lang: effectiveLang } });
    if (homeIntroMissing) issues.push({ severity: 'structural', section: 'Home / Hero', text: homeIntroMissing + ' secondary Home intro label' + (homeIntroMissing === 1 ? ' is' : 's are') + ' still empty in ' + effectiveLang.toUpperCase() + '. The page still works without them.', action: { section: 'home', lang: effectiveLang } });
    var bioCurrent = getSiteHealthDoc(snapshot, 'bio_' + effectiveLang, {});
    var bioMissingCore = ['h2', 'p1', 'p2'].filter(function (k) { return isBlank(bioCurrent[k]); }).length;
    if (bioMissingCore) issues.push({ severity: 'recommended', section: 'Biography', text: 'Biography content in ' + effectiveLang.toUpperCase() + ' is still missing ' + bioMissingCore + ' core text block' + (bioMissingCore === 1 ? '' : 's') + '.', action: { section: 'bio', lang: effectiveLang } });
    var programsCurrent = getProgramsForHealth(snapshot, effectiveLang);
    if (isBlank(programsCurrent.title)) {
      issues.push({ severity: 'recommended', section: 'Programs', text: 'The Programs page title is still empty in ' + effectiveLang.toUpperCase() + '.', action: { section: 'programs', lang: effectiveLang } });
    }
    var contactCurrent = getSiteHealthDoc(snapshot, 'contact_' + effectiveLang, {});
    var contactMissingCore = ['title', 'sub', 'email'].filter(function (k) { return isBlank(contactCurrent[k]); });
    if (contactMissingCore.length) {
      issues.push({
        severity: contactMissingCore.indexOf('email') >= 0 ? 'critical' : 'recommended',
        section: 'Contact',
        text: 'The Contact section in ' + effectiveLang.toUpperCase() + ' is still missing: ' + contactMissingCore.join(', ') + '.',
        action: { section: 'contact', lang: effectiveLang }
      });
    }
    if (!isBlank(contactCurrent.email) && !isValidEmail(contactCurrent.email)) issues.push({ severity: 'critical', section: 'Contact', text: 'The public contact email in ' + effectiveLang.toUpperCase() + ' looks invalid, so replies may fail.', action: { section: 'contact', lang: effectiveLang } });
    var contactWebLabelForHealth = safeString(contactCurrent.webBtn).trim();
    var contactWebForHealth = safeString(contactCurrent.webUrl || contactCurrent.webBtn).trim();
    if (!isBlank(contactWebForHealth) && !isValidHttpUrl(contactWebForHealth)) issues.push({ severity: 'recommended', section: 'Contact', text: 'The saved website link in Contact for ' + effectiveLang.toUpperCase() + ' does not look valid.', action: { section: 'contact', lang: effectiveLang } });
    if (!isBlank(contactWebLabelForHealth) && isBlank(safeString(contactCurrent.webUrl).trim())) issues.push({ severity: 'structural', section: 'Contact', text: 'A website label is saved in Contact for ' + effectiveLang.toUpperCase() + ', but there is no website URL behind it.', action: { section: 'contact', lang: effectiveLang } });
    langs.forEach(function (lang) {
      var pdoc = getProgramsForHealth(snapshot, lang);
      var enDoc = getProgramsForHealth(snapshot, 'en');
      var hasLocal = Array.isArray(pdoc.programs) && pdoc.programs.length;
      var hasEn = Array.isArray(enDoc.programs) && enDoc.programs.length;
      if (!hasLocal) {
        issues.push({
          severity: lang === 'en' || !hasEn ? 'critical' : 'recommended',
          section: 'Programs',
          text: lang.toUpperCase() + ' programme list is empty' + (lang !== 'en' && hasEn ? '. English fallback may still cover the public page, but this language path is not curated yet.' : '.'),
          action: { section: 'programs', lang: lang }
        });
      }
    });
    var uiCurrent = getSiteHealthDoc(snapshot, 'rg_ui_' + effectiveLang, {});
    var navKeys = ['nav.home', 'nav.bio', 'nav.rep', 'nav.media', 'nav.cal', 'nav.epk', 'nav.book', 'nav.contact'];
    var uiMissing = navKeys.filter(function (k) { return isBlank(uiCurrent[k]); });
    if (uiMissing.length) {
      issues.push({
        severity: uiMissing.length >= 3 ? 'recommended' : 'structural',
        section: 'UI / labels',
        text: effectiveLang.toUpperCase() + ' is still missing ' + uiMissing.length + ' navigation label' + (uiMissing.length === 1 ? '' : 's') + '.',
        action: { section: 'ui', lang: effectiveLang }
      });
    }
    if (effectiveLang !== 'en') {
      var heroEn = getSiteHealthDoc(snapshot, 'hero_en', {});
      var heroLocal = getSiteHealthDoc(snapshot, 'hero_' + effectiveLang, {});
      ['cta1', 'cta2', 'quickBioLabel', 'quickCalLabel'].forEach(function (k) {
        if (!isBlank(heroEn && heroEn[k]) && isBlank(heroLocal && heroLocal[k])) {
          issues.push({ severity: 'structural', section: 'Home / Hero', text: 'The ' + effectiveLang.toUpperCase() + ' Home view is still missing the label used for "' + k + '" in EN.', action: { section: 'home', lang: effectiveLang } });
        }
      });
      var bioEn = getSiteHealthDoc(snapshot, 'bio_de', {});
      var bioLocal = getSiteHealthDoc(snapshot, 'bio_' + effectiveLang, {});
      ['h2', 'p1', 'p2'].forEach(function (k) {
        if (!isBlank(bioEn && bioEn[k]) && isBlank(bioLocal && bioLocal[k])) {
          issues.push({ severity: 'structural', section: 'Biography', text: 'The ' + effectiveLang.toUpperCase() + ' biography is still missing one text block that exists in DE.', action: { section: 'bio', lang: effectiveLang } });
        }
      });
    }
    var langsUpper = ['EN', 'DE', 'ES', 'IT', 'FR'];
    langsUpper.forEach(function (L) {
      var d = safeString(pdfs.dossier[L] && pdfs.dossier[L].url).trim();
      var a = safeString(pdfs.artistSheet[L] && pdfs.artistSheet[L].url).trim();
      if ((!!d) !== (!!a)) {
        issues.push({ severity: 'structural', section: 'Press / EPK', text: 'The public PDF set is partial in ' + L + ': one of Dossier or Artist Sheet is still missing.', action: { section: 'press', pressTab: 'pdfs', lang: L.toLowerCase() } });
      }
    });
    issues = issues.concat(collectPublicOutputIssues(effectiveLang, snapshot));
    var normalizedIssues = issues.map(function (it) {
      var severity = normalizeHealthSeverity(it);
      var meta = healthSeverityMeta(severity);
      return {
        severity: severity,
        tone: meta.tone,
        label: meta.label,
        section: safeString(it && it.section).trim(),
        text: safeString(it && it.text),
        action: (it && it.action) || {}
      };
    });
    var severityRank = { critical: 0, recommended: 1, structural: 2 };
    normalizedIssues.sort(function (a, b) {
      var ar = hasOwn(severityRank, a.severity) ? severityRank[a.severity] : 9;
      var br = hasOwn(severityRank, b.severity) ? severityRank[b.severity] : 9;
      if (ar !== br) return ar - br;
      return safeString(a.text).localeCompare(safeString(b.text));
    });
    function sectionHasSeverity(sectionName, severity) {
      return normalizedIssues.some(function (issue) {
        return issue.section === sectionName && issue.severity === severity;
      });
    }
    var sectionOrder = ['Home / Hero', 'Biography', 'Programs', 'Calendar', 'Media', 'Press / EPK', 'Contact', 'UI / labels'];
    sectionOrder.forEach(function (name) {
      if (sectionHasSeverity(name, 'critical')) sectionStatus[name] = 'err';
      else if (sectionHasSeverity(name, 'recommended')) sectionStatus[name] = 'warn';
      else if (!sectionStatus[name]) sectionStatus[name] = 'ok';
      else if (sectionStatus[name] !== 'err' && sectionStatus[name] !== 'warn') sectionStatus[name] = 'ok';
      else if (!sectionHasSeverity(name, 'critical') && !sectionHasSeverity(name, 'recommended')) sectionStatus[name] = 'ok';
    });
    var sectionBox = $('sitehealth-section-status');
    if (sectionBox) {
      sectionBox.className = 'health-list';
      sectionBox.innerHTML = sectionOrder.map(function (name) {
        var st = sectionStatus[name] || 'ok';
        return '<div class="health-row"><span class="label">' + escapeHtml(name) + '</span>' + healthSectionBadge(st) + '</div>';
      }).join('');
    }
    var matrixBox = $('sitehealth-lang-matrix');
    if (matrixBox) {
      var cols = ['home', 'bio', 'programs', 'contact', 'ui'];
      var colLabel = { home: 'Home', bio: 'Bio', programs: 'Programs', contact: 'Contact', ui: 'UI' };
      matrixBox.innerHTML = '<table class="health-matrix"><thead><tr><th>Language</th>' + cols.map(function (c) { return '<th>' + colLabel[c] + '</th>'; }).join('') + '</tr></thead><tbody>' +
        langs.map(function (lang) {
          return '<tr><th>' + lang.toUpperCase() + '</th>' + cols.map(function (c) {
            var st = matrix[lang][c];
            var dot = st === 'ok' ? '●' : (st === 'warn' ? '▲' : '■');
            var cls = st === 'ok' ? 'ok' : (st === 'warn' ? 'warn' : 'err');
            return '<td><span class="health-dot ' + cls + '">' + dot + '</span></td>';
          }).join('') + '</tr>';
        }).join('') +
        '</tbody></table>';
    }
    var issueBox = $('sitehealth-issues');
    if (issueBox) {
      if (!normalizedIssues.length) {
        issueBox.innerHTML = '<div class="empty-state">No critical, recommended, or structural follow-ups were detected right now.</div>';
      } else {
        issueBox.className = 'health-issues';
        issueBox.innerHTML = normalizedIssues.map(function (it, idx) {
          var action = it.action || {};
          return '<div class="health-issue ' + escapeHtml(it.tone || 'warn') + '"><div class="text"><span class="pill ' + escapeHtml(it.tone || 'warn') + '">' + escapeHtml(it.label || 'Recommended') + '</span> ' + escapeHtml(it.text) + '</div><div class="actions"><button type="button" data-health-action="1" data-action-idx="' + idx + '"' +
            (action.section ? ' data-section="' + escapeHtml(action.section) + '"' : '') +
            (action.lang ? ' data-lang="' + escapeHtml(action.lang) + '"' : '') +
            (action.pressTab ? ' data-press-tab="' + escapeHtml(action.pressTab) + '"' : '') +
            (action.mediaTab ? ' data-media-tab="' + escapeHtml(action.mediaTab) + '"' : '') +
            (action.pressFilter ? ' data-press-filter="' + escapeHtml(action.pressFilter) + '"' : '') +
            '>' + escapeHtml(siteHealthActionLabel(action)) + '</button></div></div>';
        }).join('');
      }
    }
    var errCount = countHealthIssuesBySeverity(normalizedIssues, 'critical');
    var warnCount = countHealthIssuesBySeverity(normalizedIssues, 'recommended');
    var infoCount = countHealthIssuesBySeverity(normalizedIssues, 'structural');
    var overall = $('sitehealth-overall');
    if (overall) {
      overall.classList.remove('ok', 'warn', 'err', 'info');
      if (errCount) {
        overall.classList.add('err');
        overall.textContent = errCount + ' critical · ' + warnCount + ' recommended';
      } else if (warnCount) {
        overall.classList.add('warn');
        overall.textContent = warnCount + ' recommended · ' + infoCount + ' structural';
      } else if (infoCount) {
        overall.classList.add('info');
        overall.textContent = infoCount + ' structural difference' + (infoCount === 1 ? '' : 's');
      } else {
        overall.classList.add('ok');
        overall.textContent = 'Ready';
      }
    }
  }
  function importKeyMatchesScope(key, scope) {
    if (!scope || scope === 'all') return true;
    if (scope === 'home') return /^hero_/.test(key);
    if (scope === 'bio') return /^bio_/.test(key);
    if (scope === 'rep') return /^rep_/.test(key) || key === 'rg_rep_cards';
    if (scope === 'programs') return /^rg_programs/.test(key) || /^programs_/.test(key) || /^rg_editorial_/.test(key);
    if (scope === 'programbuilder') return key === 'rg_repertoire_planner' || key === 'rg_program_blueprints' || key === 'rg_concert_history';
    if (scope === 'discovery') return key === 'rg_repertoire_discovery';
    if (scope === 'outreach') return key === 'rg_outreach_tracker';
    if (scope === 'calendar') return /^perf_/.test(key) || key === 'rg_perfs' || key === 'rg_past_perfs';
    if (scope === 'media') return key === 'rg_vid' || key === 'rg_audio' || key === 'rg_photos' || key === 'rg_photo_captions';
    if (scope === 'press') return !!PRESS_IMPORT_KEYS[key];
    if (scope === 'contact') return /^contact_/.test(key);
    if (scope === 'ui') return /^rg_ui_/.test(key);
    return false;
  }
  function filterImportKeys(keys, scope) {
    return keys.filter(function (k) { return importKeyMatchesScope(k, scope); });
  }
  function formatBackupFilename() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return 'rg-site-backup-' + d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '.json';
  }
  function createBackupNow() {
    ensureReady();
    var payload = buildExportPayload();
    var fname = formatBackupFilename();
    downloadJson(fname, payload);
    var ts = new Date(payload.exportedAt || Date.now()).toLocaleString();
    var lines = [
      'File: ' + fname,
      'Areas included: ' + payload.keys.length,
      'Languages, pages, programs, media, press, and other admin-managed content.'
    ];
    if ($('backupSummary')) $('backupSummary').textContent = 'Last backup: ' + ts + ' · ' + payload.keys.length + ' areas · saved to your Downloads folder.';
    setStatus('Backup downloaded', 'ok');
    pushActivitySummary('Backup created', lines);
  }
  function saveDoc(key, val) {
    ensureReady();
    validateKeyValue(key, val);
    var label = humanStorageKeyLine(key);
    var payload = clone(val);
    var pending = waitForLegacySaveResult(key);
    try {
      state.api.save(key, payload);
    } catch (err) {
      settleLegacySave(key, false, err);
      setStatus('Save failed · ' + label, 'err');
      pushActivitySummary('Save failed', [label, safeString(err && err.message ? err.message : err)]);
      return Promise.resolve(false);
    }
    return pending.then(function () {
      markDirty(false, 'Saved: ' + label);
      pushActivitySummary('Saved', [label, 'Saved and synced to the cloud.']);
      return true;
    }).catch(function (err) {
      markDirty(true, 'Unsaved changes');
      setStatus('Cloud save failed · ' + label, 'err');
      pushActivitySummary('Save failed', [
        label,
        safeString(err && err.message ? err.message : 'The edit was not confirmed in the cloud.')
      ]);
      return false;
    });
  }
  function getAuthIdToken() {
    if (!firebaseAuth || !firebaseAuth.currentUser || typeof firebaseAuth.currentUser.getIdToken !== 'function') {
      return Promise.resolve('');
    }
    return firebaseAuth.currentUser.getIdToken(true).catch(function () { return ''; });
  }
  function buildFirestoreHeroDocPayload(payload) {
    return {
      fields: {
        value: {
          stringValue: JSON.stringify(payload)
        }
      }
    };
  }
  function writeHeroDocToFirestore(key, payload) {
    var base = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/';
    var url = base + encodeURIComponent(key);
    return getAuthIdToken().then(function (token) {
      if (!token) return { ok: false, status: 0, reason: 'missing-id-token' };
      return fetch(url, {
        method: 'PATCH',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(buildFirestoreHeroDocPayload(payload))
      }).then(function (r) {
        return { ok: !!r.ok, status: Number(r.status || 0), reason: r.ok ? '' : 'http-' + String(r.status || 0) };
      }).catch(function () {
        return { ok: false, status: 0, reason: 'network-error' };
      });
    });
  }
  function readHeroDocFromFirestore(key) {
    var url = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/' + encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (doc) {
        var raw = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
        if (!raw || typeof raw !== 'string') return null;
        try { return JSON.parse(raw); } catch (e) { return null; }
      })
      .catch(function () { return null; });
  }

  function syncMobileNavMoreSections(forceCollapseOnMobile) {
    var nav = $('nav');
    var more = $('nav-more-sections');
    var moreItems = more && more.querySelector('.nav-more__items');
    var mobileConfig = $('nav-mobile-config');
    if (!nav || !more || !moreItems) return;
    var isMobile = window.innerWidth <= 860;
    var selected = {};
    (state.mobileNavPrimarySections || []).forEach(function (id) { selected[id] = true; });

    var effectiveOrder = getEffectiveNavOrder();
    effectiveOrder.forEach(function (sectionId) {
      var btn = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
      if (!btn) return;
      if (!isMobile) {
        nav.insertBefore(btn, more);
        return;
      }
      if (selected[sectionId]) nav.insertBefore(btn, more);
      else moreItems.appendChild(btn);
    });

    if (!isMobile) {
      more.open = true;
      more.hidden = true;
      if (mobileConfig) mobileConfig.hidden = true;
      return;
    }
    more.hidden = false;
    if (mobileConfig) mobileConfig.hidden = false;
    renderMobileNavConfigItems();
    if (forceCollapseOnMobile) more.open = false;
    if (moreItems.querySelector('.nav-item.active')) more.open = true;
  }

  function openSection(id) {
    if (!hasUnsavedChangesPrompt('Leave this section?')) return;
    var targetId = safeString(id).trim();
    var sectionId = targetId;
    var pbJumpTarget = '';
    if (targetId === 'programbuilder_fee') {
      sectionId = 'programbuilder';
      pbJumpTarget = 'pb-fee-estimate';
    }
    state.section = sectionId;
    if (document.body) document.body.classList.toggle('programbuilder-section', sectionId === 'programbuilder');
    document.querySelectorAll('.section').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
    $('section-' + sectionId).classList.add('active');
    var navBtn = document.querySelector('.nav-item[data-section="' + targetId + '"]') || document.querySelector('.nav-item[data-section="' + sectionId + '"]');
    if (navBtn) {
      navBtn.classList.add('active');
      var navMore = navBtn.closest('.nav-more');
      if (navMore) navMore.open = true;
      $('currentSectionLabel').textContent = navBtn.textContent;
    }
    if (window.innerWidth <= 860) $('sidebar').classList.remove('open');
    syncTopbarToolsDisclosure();
    refreshCurrentSection();
    if (pbJumpTarget) {
      window.setTimeout(function () {
        if (state.section === 'programbuilder') scrollProgramBuilderAnchor(pbJumpTarget);
      }, 80);
    }
  }

  function readAdminDeepLink() {
    try {
      var params = new URLSearchParams(window.location && window.location.search ? window.location.search : '');
      var section = safeString(params.get('section')).trim();
      var perfId = safeString(params.get('perfId')).trim();
      var okSection = section && document.querySelector('.nav-item[data-section="' + section + '"]');
      return { section: okSection ? section : '', perfId: perfId };
    } catch (e) {
      return { section: '', perfId: '' };
    }
  }

  function openCalendarEventById(perfId) {
    var target = safeString(perfId).trim();
    if (!target) return false;
    if (!Array.isArray(state.perfs) || !state.perfs.length) return false;
    var idx = state.perfs.findIndex(function (e) { return safeString(e && e.id).trim() === target; });
    if (idx < 0) return false;
    state.perfIndex = idx;
    renderPerfList();
    renderPerfEditor();
    return true;
  }

  function refreshCurrentSection() {
    if (state.section === 'home') loadHome();
    else if (state.section === 'bio') loadBio();
    else if (state.section === 'rep') loadRep();
    else if (state.section === 'programs') loadPrograms();
    else if (state.section === 'programbuilder') loadProgramBuilder();
    else if (state.section === 'discovery') loadDiscovery();
    else if (state.section === 'outreach') loadOutreach();
    else if (state.section === 'calendar') loadCalendar();
    else if (state.section === 'income') loadIncome();
    else if (state.section === 'media') loadMedia();
    else if (state.section === 'pastperfs') loadPastPerfsSection();
    else if (state.section === 'press') loadPress();
    else if (state.section === 'contact') loadContact();
    else if (state.section === 'ui') loadUiJson();
    else if (state.section === 'translation') {
      wireTranslationWorkspaceActions();
      refreshTranslationWorkspace();
    } else if (state.section === 'publishing') refreshPublishingDashboard();
    else if (state.section === 'sitehealth') showSiteHealthPlaceholder();
    if (state.section !== 'sitehealth' && state.section !== 'tools' && state.section !== 'translation' && state.section !== 'publishing' && state.section !== 'pastperfs') {
      maybeRestoreDraftForCurrentSection();
    }
    applyTranslationMissingOnlyMask();
  }

  function loadHome() {
    var nonce = ++state.homeLoadNonce;
    var stored = loadDoc('hero_' + state.lang, null);
    var fallback = getLegacySection('hero');
    var uiStored = loadDoc('rg_ui_' + state.lang, null);
    var uiFallback = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(state.lang);
        if (isObject(t)) uiFallback = t;
      }
    } catch (e) {}
    setFieldFromSources('hero-eyebrow', stored, fallback, 'eyebrow', 'Bundled default');
    setFieldFromSources('hero-subtitle', stored, fallback, 'subtitle', 'Bundled default');
    setFieldFromSources('hero-cta1', stored, fallback, 'cta1', 'Bundled default');
    setFieldFromSources('hero-cta2', stored, fallback, 'cta2', 'Bundled default');
    setFieldFromSources('hero-quickBioLabel', stored, fallback, 'quickBioLabel', 'Bundled default');
    setFieldFromSources('hero-quickCalLabel', stored, fallback, 'quickCalLabel', 'Bundled default');
    if (isObject(stored) && safeString(stored.introCtaBio).trim()) setFieldEffectiveValue($('hero-introCtaBio'), { value: safeString(stored.introCtaBio), source: 'Saved here' });
    else setFieldEffectiveValue($('hero-introCtaBio'), pickEffectiveWithSource(uiStored, uiFallback, 'home.intro.ctaBio', 'Inherited'));
    if (isObject(stored) && safeString(stored.introCtaMedia).trim()) setFieldEffectiveValue($('hero-introCtaMedia'), { value: safeString(stored.introCtaMedia), source: 'Saved here' });
    else setFieldEffectiveValue($('hero-introCtaMedia'), pickEffectiveWithSource(uiStored, uiFallback, 'home.intro.ctaMedia', 'Inherited'));
    fillHomeRgUiCopyFields(uiStored, uiFallback);
    setFieldFromSources('hero-bgImage', stored, fallback, 'bgImage', 'Bundled default');
    // Keep preview blank until final source is resolved (no stale first paint).
    $('hero-introImage').value = '';
    updateHomeIntroPreview();
    updateHomeMiniPreviews();
    resolveHomeIntroFinal().then(function (resolved) {
      if (nonce !== state.homeLoadNonce) return;
      $('hero-introImage').value = safeString(resolved && resolved.url).trim();
      setFieldEffectiveValue($('hero-introImage'), { value: safeString(resolved && resolved.url).trim(), source: friendlyImageSourceLabel(resolved && resolved.source) });
      updateHomeIntroPreview();
      updateHomeMiniPreviews();
      updateCompletenessIndicators();
    });
    updateCompletenessIndicators();
  }
  function readHomeIntroFromBridge() {
    var stored = loadDoc('hero_' + state.lang, null);
    if (isObject(stored) && safeString(stored.introImage).trim()) {
      return {
        source: 'bridge:hero_' + state.lang + '.introImage',
        url: normalizeHomeIntroImagePath(safeString(stored.introImage).trim())
      };
    }
    var storedEn = loadDoc('hero_en', null);
    if (isObject(storedEn) && safeString(storedEn.introImage).trim()) {
      return {
        source: 'bridge:hero_en.introImage',
        url: normalizeHomeIntroImagePath(safeString(storedEn.introImage).trim())
      };
    }
    return null;
  }
  function fetchFirestoreDocJson(key) {
    var url = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents/rg/' + encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (doc) {
        var v = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
        if (!v || typeof v !== 'string') return null;
        try { return JSON.parse(v); } catch (e) { return null; }
      })
      .catch(function () { return null; });
  }
  function readHomeIntroFromFirestore(doc, keyLabel) {
    if (!isObject(doc)) return null;
    var s = safeString(doc.introImage).trim();
    if (!s) return null;
    return { source: 'firestore:' + keyLabel + '.introImage', url: normalizeHomeIntroImagePath(s) };
  }
  async function resolveHomeIntroFinal() {
    var langKey = 'hero_' + state.lang;
    var bridgeCandidate = readHomeIntroFromBridge();
    var fsLangPromise = fetchFirestoreDocJson(langKey);
    var fsEnPromise = fetchFirestoreDocJson('hero_en');
    var defaultPromise = loadHomeIntroDefault();

    var fsLang = await fsLangPromise;
    var fsLangCandidate = readHomeIntroFromFirestore(fsLang, langKey);
    if (fsLangCandidate) return fsLangCandidate;

    var fsEn = await fsEnPromise;
    var fsEnCandidate = readHomeIntroFromFirestore(fsEn, 'hero_en');
    if (fsEnCandidate) return fsEnCandidate;

    if (bridgeCandidate && bridgeCandidate.url) return bridgeCandidate;

    var def = safeString(await defaultPromise).trim();
    return { source: 'default:hero-config.image', url: def };
  }
  async function saveHome() {
    var applyAll = !!($('home-images-all-langs') && $('home-images-all-langs').checked);
    var heroKey = 'hero_' + state.lang;
    var payload = {
      eyebrow: safeString($('hero-eyebrow').value),
      subtitle: safeString($('hero-subtitle').value),
      cta1: safeString($('hero-cta1').value),
      cta2: safeString($('hero-cta2').value),
      quickBioLabel: safeString($('hero-quickBioLabel').value),
      quickCalLabel: safeString($('hero-quickCalLabel').value),
      introCtaBio: safeString($('hero-introCtaBio').value),
      introCtaMedia: safeString($('hero-introCtaMedia').value),
      bgImage: safeString($('hero-bgImage').value),
      introImage: normalizeHomeIntroImagePath(safeString($('hero-introImage').value).trim())
    };
    var heroSaved = await saveDoc(heroKey, payload);
    try {
      localStorage.setItem(heroKey, JSON.stringify(payload));
    } catch (e) {}
    var uiMerged = loadDoc('rg_ui_' + state.lang, null);
    if (!isObject(uiMerged)) uiMerged = {};
    uiMerged = persistHomeRgUiCopyFields(uiMerged);
    var uiSaved = await saveDoc('rg_ui_' + state.lang, uiMerged);
    if (!heroSaved || !uiSaved) return;
    var fsWrite = await writeHeroDocToFirestore(heroKey, payload);
    var fsReadBack = await readHeroDocFromFirestore(heroKey);
    var fsCta1 = safeString(fsReadBack && fsReadBack.cta1);
    var fsCta2 = safeString(fsReadBack && fsReadBack.cta2);
    void fsWrite;
    void fsCta1;
    void fsCta2;
    if (applyAll) {
      LANGS.forEach(function (lang) {
        if (lang === state.lang) return;
        var key = 'hero_' + lang;
        var prev = loadDoc(key, {});
        if (!isObject(prev)) prev = {};
        prev.bgImage = payload.bgImage;
        prev.introImage = payload.introImage;
        saveDoc(key, prev);
        try {
          localStorage.setItem(key, JSON.stringify(prev));
        } catch (e) {}
      });
    }
  }

  function loadHomeIntroDefault() {
    if (state.homeIntroDefault) return Promise.resolve(state.homeIntroDefault);
    return fetch('/v1-assets/data/hero-config.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status || 'hero config load failed'));
        return r.json();
      })
      .then(function (data) {
        var src = normalizeHomeIntroImagePath(safeString(data && data.image).trim());
        state.homeIntroDefault = src;
        return src;
      })
      .catch(function () {
        return '';
      });
  }
  function updateHomeIntroPreview() {
    var src = normalizeHomeIntroImagePath(safeString($('hero-introImage').value).trim());
    if ($('hero-introImage').value !== src) $('hero-introImage').value = src;
    var previewSrc = src;
    if (previewSrc && !/^(data:|https?:\/\/|\/\/|\/)/i.test(previewSrc)) {
      try {
        previewSrc = new URL(previewSrc, window.location.origin + '/mp/').toString();
      } catch (e) {}
    }
    $('hero-introPreview').src = previewSrc;
  }
  function normalizeHomeIntroImagePath(raw) {
    var s = safeString(raw).trim();
    if (!s) return '';
    if (/^(data:|https?:\/\/|\/\/|\/|\.\.\/)/i.test(s)) return s;
    if (/^\.\//.test(s)) s = s.slice(2);
    if (/^img\//i.test(s)) return '../' + s;
    return '../' + s;
  }

  function bioParagraphFieldIds() {
    return ['bio-p1', 'bio-p2', 'bio-p3', 'bio-p4', 'bio-p5', 'bio-p6'];
  }
  function normalizeParagraphsFromBioStored(stored) {
    if (!stored || typeof stored !== 'object') return [];
    if (Array.isArray(stored.paragraphs) && stored.paragraphs.length) {
      return stored.paragraphs
        .map(function (x) {
          return safeString(x).trim();
        })
        .filter(Boolean);
    }
    var out = [];
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(function (k) {
      var s = safeString(stored[k]).trim();
      if (s) out.push(s);
    });
    return out;
  }
  function paragraphsArrayFromBioInputs() {
    var out = [];
    bioParagraphFieldIds().forEach(function (id) {
      var s = safeString($(id) && $(id).value).trim();
      if (s) out.push(s);
    });
    return out;
  }
  function fillBioParagraphInputsFromStored(stored, fallback) {
    var storedParas = normalizeParagraphsFromBioStored(isObject(stored) ? stored : {});
    var fallbackParas = normalizeParagraphsFromBioStored(isObject(fallback) ? fallback : {});
    var ids = bioParagraphFieldIds();
    for (var i = 0; i < ids.length; i++) {
      var el = $(ids[i]);
      if (!el) continue;
      var v = storedParas[i];
      if (isBlank(v) && !isBlank(fallbackParas[i])) v = fallbackParas[i];
      el.value = safeString(v);
    }
  }
  function isBiographyEditorVisiblyEmpty() {
    var ids = ['bio-introLine', 'bio-h2', 'bio-p1', 'bio-p2', 'bio-continue-tag', 'bio-continue-sub', 'bio-cta-rep', 'bio-cta-media', 'bio-cta-contact', 'bio-cta-home'];
    for (var i = 0; i < ids.length; i += 1) {
      var el = $(ids[i]);
      if (el && safeString(el.value).trim()) return false;
    }
    return true;
  }
  function forceFillBiographyEditorFromDoc(doc, sourceLabel) {
    var src = isObject(doc) ? doc : {};
    setFieldEffectiveValue($('bio-introLine'), { value: safeString(src.introLine), source: sourceLabel });
    setFieldEffectiveValue($('bio-h2'), { value: safeString(src.h2), source: sourceLabel });
    fillBioParagraphInputsFromStored({}, src);
    setFieldEffectiveValue($('bio-continue-tag'), { value: safeString(src.continueSectionTag), source: sourceLabel });
    setFieldEffectiveValue($('bio-continue-sub'), { value: safeString(src.continueSub), source: sourceLabel });
    setFieldEffectiveValue($('bio-cta-rep'), { value: safeString(src.ctaRepertoire), source: sourceLabel });
    setFieldEffectiveValue($('bio-cta-media'), { value: safeString(src.ctaMedia), source: sourceLabel });
    setFieldEffectiveValue($('bio-cta-contact'), { value: safeString(src.ctaContact), source: sourceLabel });
    setFieldEffectiveValue($('bio-cta-home'), { value: normalizeLegacyBioProgramsCta(src.ctaHomeIntro, state.lang), source: sourceLabel });
    setFieldEffectiveValue($('bio-portraitAlt'), { value: safeString(src.portraitAlt), source: sourceLabel });
    setFieldEffectiveValue($('bio-quote'), { value: safeString(src.quote), source: sourceLabel });
    setFieldEffectiveValue($('bio-cite'), { value: safeString(src.cite), source: sourceLabel });
  }
  function loadBioPortraitDefault() {
    if (state.bioPortraitDefault) return Promise.resolve(state.bioPortraitDefault);
    return loadBiographyBundle().then(function () {
      return state.bioPortraitDefault || '';
    });
  }
  function loadBiographyBundleDefaultsSync() {
    if (state.bioBundle && Object.keys(state.bioBundle).length) return state.bioBundle;
    var urls = [
      '/v1-assets/data/biography-data.json',
      '/v1-assets/build/biography-defaults.json',
      'v1-assets/data/biography-data.json',
      'v1-assets/build/biography-defaults.json'
    ];
    for (var i = 0; i < urls.length; i += 1) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', urls[i], false);
        xhr.send(null);
        if (xhr.status >= 200 && xhr.status < 300 && safeString(xhr.responseText).trim()) {
          var data = JSON.parse(xhr.responseText);
          var locales = isObject(data && data.locales) ? data.locales : {};
          if (locales && Object.keys(locales).length) {
            state.bioBundle = locales;
            if (safeString(data && data.portraitImage).trim()) state.bioPortraitDefault = safeString(data.portraitImage).trim();
            bioDebug('bundle:sync-ok', { url: urls[i], locales: Object.keys(locales).join(',') });
            return locales;
          }
        }
      } catch (e) {}
    }
    if (!isObject(state.bioBundle)) state.bioBundle = {};
    bioDebug('bundle:sync-failed', { urls: urls.join(',') });
    return state.bioBundle;
  }
  function loadBiographyBundle() {
    if (state.bioBundlePromise) return state.bioBundlePromise;
    if (state.bioBundleLiveLoaded) return Promise.resolve(state.bioBundle || {});
    state.bioBundleFailed = false;
    var urls = [
      '/v1-assets/data/biography-data.json',
      '/v1-assets/build/biography-defaults.json',
      'v1-assets/data/biography-data.json',
      'v1-assets/build/biography-defaults.json'
    ];
    function tryLoad(idx) {
      if (idx >= urls.length) return Promise.reject(new Error('bio bundle unavailable'));
      var url = urls[idx];
      return fetch(url, { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status || 'bio json load failed'));
          return r.json();
        })
        .then(function (data) {
          var locales = isObject(data && data.locales) ? data.locales : {};
          if (!Object.keys(locales).length) throw new Error('bio locales missing');
          state.bioBundle = Object.assign({}, state.bioBundle || {}, locales);
          var src = safeString(data && data.portraitImage).trim();
          if (src) state.bioPortraitDefault = src;
          state.bioBundleLiveLoaded = true;
          bioDebug('bundle:live-ok', { url: url, locales: Object.keys(locales).join(',') });
          return locales;
        })
        .catch(function () {
          return tryLoad(idx + 1);
        });
    }
    state.bioBundlePromise = tryLoad(0)
      .catch(function () {
        state.bioBundleFailed = true;
        state.bioBundleLiveLoaded = true;
        bioDebug('bundle:live-failed', { lang: state.lang, urls: urls.join(',') });
        return state.bioBundle;
      })
      .then(function (locales) {
        state.bioBundlePromise = null;
        return locales;
      });
    return state.bioBundlePromise;
  }
  loadBiographyBundleDefaultsSync();
  loadBiographyBundle();
  function mergeBiographySourceDoc(bundled, stored) {
    var out = Object.assign({}, isObject(bundled) ? bundled : {});
    if (!isObject(stored)) return out;
    Object.keys(stored).forEach(function (k) {
      if (k === 'paragraphs') {
        var paras = normalizeParagraphsFromBioStored(stored);
        if (paras.length) out.paragraphs = paras.slice();
        return;
      }
      var v = stored[k];
      if (!isBlank(v)) out[k] = v;
    });
    return out;
  }
  function getBiographyStoredDoc(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var doc = loadDoc('bio_' + L, {});
    return isObject(doc) ? doc : {};
  }
  function getBiographyBundleDoc(lang) {
    var L = normalizeLangCode(lang) || 'en';
    return state.bioBundle && isObject(state.bioBundle[L]) ? state.bioBundle[L] : {};
  }
  function getBiographyLocalizedDoc(lang) {
    var L = normalizeLangCode(lang) || 'en';
    return mergeBiographySourceDoc(getBiographyBundleDoc(L), getBiographyStoredDoc(L));
  }
  function getBiographyCanonicalDoc() {
    // German is the editorial source of truth for Biography.
    return getBiographyLocalizedDoc('de');
  }
  function getBiographySafeStoredDoc(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var raw = getBiographyStoredDoc(L);
    if (L === 'de') return raw;
    if (!isObject(raw) || !hasBiographyMeaningfulContent(raw)) return raw;
    var matchedLocale = detectBiographyLocaleMatch(raw, state.bioBundle || {});
    if (matchedLocale && matchedLocale !== L) {
      bioDebug('source:ignore-locale-mismatch', { lang: L, matchedLocale: matchedLocale });
      var safeByMatch = {};
      ['portraitImage', 'portraitFit', 'portraitFocus'].forEach(function (k) {
        if (!isBlank(raw[k])) safeByMatch[k] = safeString(raw[k]);
      });
      return safeByMatch;
    }
    if (!state.bioBundle || !isObject(state.bioBundle.en)) return raw;
    var canonical = getBiographyCanonicalDoc();
    var deScore = bioLocaleSimilarityScore(raw, canonical);
    var englishScore = bioLocaleSimilarityScore(raw, state.bioBundle.en);
    if (englishScore >= 4 && englishScore > deScore + 1) {
      bioDebug('source:ignore-english', { lang: L, englishScore: englishScore, deScore: deScore });
      var safe = {};
      ['portraitImage', 'portraitFit', 'portraitFocus'].forEach(function (k) {
        if (!isBlank(raw[k])) safe[k] = safeString(raw[k]);
      });
      return safe;
    }
    return raw;
  }
  function getBiographyFallbackDoc(lang) {
    var L = normalizeLangCode(lang) || 'en';
    return mergeBiographySourceDoc(getBiographyCanonicalDoc(), getBiographyBundleDoc(L));
  }
  function getBiographyRuntimeFallbackDoc(lang) {
    var fallback = getBiographyFallbackDoc(lang);
    var legacy = getLegacySection('bio', lang);
    return mergeBiographySourceDoc(fallback, legacy);
  }
  function getBiographySourceDoc(lang) {
    var L = normalizeLangCode(lang) || 'en';
    var key = 'bio_' + L;
    var rawStored = getBiographyStoredDoc(L);
    var stored = getBiographySafeStoredDoc(L);
    var canonical = getBiographyCanonicalDoc();
    var localizedFallback = getBiographyFallbackDoc(L);
    var matchedLocale = detectBiographyLocaleMatch(rawStored, state.bioBundle || {});
    if (matchedLocale && matchedLocale !== L) {
      bioDebug('source:locale-mismatch', { lang: L, matchedLocale: matchedLocale, key: key });
    }
    if (L !== 'de' && state.bioBundle && isObject(state.bioBundle.en)) {
      var deScore = bioLocaleSimilarityScore(rawStored, canonical);
      var englishScore = bioLocaleSimilarityScore(rawStored, state.bioBundle.en);
      if (englishScore >= 4 && englishScore > deScore + 1) {
        bioDebug('source:looks-english', { lang: L, englishScore: englishScore, deScore: deScore, key: key });
      }
    }
    bioDebug('source:resolved', {
      lang: L,
      key: key,
      storedKeys: Object.keys(rawStored).length,
      safeStoredKeys: Object.keys(stored).length,
      canonicalKeys: Object.keys(canonical).length,
      localizedFallbackKeys: Object.keys(localizedFallback).length
    });
    return mergeBiographySourceDoc(localizedFallback, stored);
  }
  function normalizeBioComparableText(v) {
    return String(v == null ? '' : v)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-z0-9#]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  function bioDocSignature(doc) {
    if (!isObject(doc)) return '';
    var parts = [];
    ['introLine', 'h2', 'continueSectionTag', 'continueSub', 'ctaRepertoire', 'ctaMedia', 'ctaContact', 'ctaHomeIntro', 'portraitAlt'].forEach(function (k) {
      var v = doc[k];
      if (v != null && String(v).trim() !== '') parts.push(normalizeBioComparableText(v));
    });
    if (Array.isArray(doc.paragraphs) && doc.paragraphs.length) {
      doc.paragraphs.forEach(function (p) {
        if (p != null && String(p).trim() !== '') parts.push(normalizeBioComparableText(p));
      });
    } else {
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(function (k) {
        var v = doc[k];
        if (v != null && String(v).trim() !== '') parts.push(normalizeBioComparableText(v));
      });
    }
    return parts.join('|');
  }
  var BIO_COMPARE_KEYS = ['introLine', 'h2', 'continueSectionTag', 'continueSub', 'ctaRepertoire', 'ctaMedia', 'ctaContact', 'ctaHomeIntro', 'portraitAlt', 'quote', 'cite'];
  function hasBiographyMeaningfulContent(doc) {
    if (!isObject(doc)) return false;
    if (normalizeBioComparableText(bioDocSignature(doc))) return true;
    return false;
  }
  function normalizeLegacyBioProgramsCta(value, lang) {
    var raw = safeString(value).trim();
    if (!raw) return '';
    var lower = raw.toLowerCase();
    var legacy = [
      'home',
      'home — introduction',
      'home — einführung',
      'inicio — introducción',
      'home — introduzione',
      'accueil — introduction'
    ];
    if (legacy.indexOf(lower) >= 0) return '';
    var englishBundle = safeString(getBiographyBundleDoc('en').ctaHomeIntro).trim().toLowerCase();
    var localizedBundle = safeString(getBiographyBundleDoc(lang || state.lang).ctaHomeIntro).trim().toLowerCase();
    if ((lang || state.lang) !== 'en' && englishBundle && lower === englishBundle && localizedBundle && localizedBundle !== englishBundle) return '';
    var navHome = '';
    try {
      if (typeof state.api.uiTable === 'function') {
        var table = state.api.uiTable(lang || state.lang);
        if (isObject(table)) navHome = safeString(table['nav.home']).trim().toLowerCase();
        if (isObject(table)) {
          var localizedPrograms = safeString(table['home.intro.ctaPress']).trim().toLowerCase();
          var englishPrograms = '';
          try {
            var enTable = state.api.uiTable('en');
            if (isObject(enTable)) englishPrograms = safeString(enTable['home.intro.ctaPress']).trim().toLowerCase();
          } catch (ee) {}
          if ((lang || state.lang) !== 'en' && englishPrograms && lower === englishPrograms && localizedPrograms && localizedPrograms !== englishPrograms) return '';
        }
      }
    } catch (e) {}
    if (navHome && lower === navHome) return '';
    return raw;
  }
  function bioDebug(stage, payload) {
    try {
      if (!window.console || typeof console.info !== 'function') return;
      console.info('[admin-v2 biography]', stage, payload || {});
    } catch (e) {}
  }
  function bioLocaleSimilarityScore(doc, ref) {
    if (!isObject(doc) || !isObject(ref)) return 0;
    var score = 0;
    BIO_COMPARE_KEYS.forEach(function (k) {
      var a = normalizeBioComparableText(doc[k]);
      var b = normalizeBioComparableText(ref[k]);
      if (a && b && a === b) score += 1;
    });
    var docParas = normalizeParagraphsFromBioStored(doc);
    var refParas = normalizeParagraphsFromBioStored(ref);
    var max = Math.max(docParas.length, refParas.length);
    for (var i = 0; i < max; i += 1) {
      var pa = normalizeBioComparableText(docParas[i]);
      var pb = normalizeBioComparableText(refParas[i]);
      if (pa && pb && pa === pb) score += 1;
    }
    return score;
  }
  function detectBiographyLocaleMatch(doc, locales) {
    var sig = bioDocSignature(doc);
    if (!sig) return '';
    var out = '';
    Object.keys(locales || {}).forEach(function (lang) {
      if (out) return;
      var candidate = locales[lang];
      if (!isObject(candidate)) return;
      if (bioDocSignature(candidate) === sig) out = lang;
    });
    return out;
  }
  function updateBioPortraitPreview() {
    var src = safeString($('bio-portraitImage').value).trim();
    var previewSrc = src;
    // Match public `normalizePortraitPath`: resolve relative paths against the current document URL
    // (e.g. admin-v2.html at site root → `img/x.jpg` → `/img/x.jpg`, not `/mp/img/x.jpg`).
    if (previewSrc && !/^(data:|https?:\/\/|\/\/|\/)/i.test(previewSrc)) {
      try {
        previewSrc = new URL(previewSrc, window.location.href).toString();
      } catch (e) {}
    }
    $('bio-portraitPreview').src = previewSrc;
    $('bio-portraitPreview').style.objectFit = safeString($('bio-portraitFit').value).trim() || 'cover';
    $('bio-portraitPreview').style.objectPosition = safeString($('bio-portraitFocus').value).trim() || '50% 26%';
    updatePreviewFocusMarker($('bio-portraitPreview-wrap'), $('bio-portraitFocus').value);
  }

  function resolveEffectiveBioPortrait(storedCurrent, storedEn, defaultPortrait) {
    var current = isObject(storedCurrent) ? safeString(storedCurrent.portraitImage).trim() : '';
    if (current) return current;
    var en = isObject(storedEn) ? safeString(storedEn.portraitImage).trim() : '';
    if (en) return en;
    return safeString(defaultPortrait).trim();
  }

  function loadBio() {
    var nonce = ++state.bioLoadNonce;
    var storedRaw = getBiographyStoredDoc(state.lang);
    var storedSafe = getBiographySafeStoredDoc(state.lang);
    var storedDisplay = isObject(storedSafe) ? Object.assign({}, storedSafe) : {};
    if (isObject(storedDisplay)) storedDisplay.ctaHomeIntro = normalizeLegacyBioProgramsCta(storedDisplay.ctaHomeIntro, state.lang);
    var storedDe = getBiographySourceDoc('de');
    var legacyFallback = getLegacySection('bio', state.lang);
    var bioFallback = getBiographyRuntimeFallbackDoc(state.lang);
    var bioFallbackLabel = state.lang === 'de'
      ? 'DE source (bundle/legacy)'
      : 'DE source + localized fallback';
    bioDebug('load:start', {
      lang: state.lang,
      sourceGuess: hasBiographyMeaningfulContent(storedSafe) ? 'saved' : (hasBiographyMeaningfulContent(bioFallback) ? 'fallback' : 'empty'),
      storedKeys: isObject(storedRaw) ? Object.keys(storedRaw).length : 0,
      safeStoredKeys: isObject(storedSafe) ? Object.keys(storedSafe).length : 0,
      canonicalKeys: isObject(storedDe) ? Object.keys(storedDe).length : 0,
      fallbackKeys: isObject(bioFallback) ? Object.keys(bioFallback).length : 0,
      legacyFallbackKeys: isObject(legacyFallback) ? Object.keys(legacyFallback).length : 0,
      bundleFailed: !!state.bioBundleFailed,
      liveLoaded: !!state.bioBundleLiveLoaded,
      draftPresent: !!readCurrentLocalDraftSnapshot()
    });
    setFieldFromSources('bio-introLine', storedDisplay, bioFallback, 'introLine', bioFallbackLabel);
    setFieldFromSources('bio-h2', storedDisplay, bioFallback, 'h2', bioFallbackLabel);
    fillBioParagraphInputsFromStored(storedDisplay, bioFallback);
    setFieldFromSources('bio-continue-tag', storedDisplay, bioFallback, 'continueSectionTag', bioFallbackLabel);
    setFieldFromSources('bio-continue-sub', storedDisplay, bioFallback, 'continueSub', bioFallbackLabel);
    setFieldFromSources('bio-cta-rep', storedDisplay, bioFallback, 'ctaRepertoire', bioFallbackLabel);
    setFieldFromSources('bio-cta-media', storedDisplay, bioFallback, 'ctaMedia', bioFallbackLabel);
    setFieldFromSources('bio-cta-contact', storedDisplay, bioFallback, 'ctaContact', bioFallbackLabel);
    setFieldFromSources('bio-cta-home', storedDisplay, bioFallback, 'ctaHomeIntro', bioFallbackLabel);
    setFieldFromSources('bio-portraitAlt', storedDisplay, bioFallback, 'portraitAlt', bioFallbackLabel);
    setFieldFromSources('bio-quote', storedDisplay, bioFallback, 'quote', bioFallbackLabel);
    setFieldFromSources('bio-cite', storedDisplay, bioFallback, 'cite', bioFallbackLabel);
    setFieldFromSources('bio-portraitFit', storedDisplay, bioFallback, 'portraitFit', 'Default cover');
    setFieldFromSources('bio-portraitFocus', storedDisplay, bioFallback, 'portraitFocus', 'Public default');
    var immediate = resolveEffectiveBioPortrait(storedRaw, storedDe, state.bioPortraitDefault);
    if (immediate) {
      $('bio-portraitImage').value = immediate;
      updateBioPortraitPreview();
    }
    if (isBiographyEditorVisiblyEmpty() && hasBiographyMeaningfulContent(bioFallback)) {
      bioDebug('load:force-fill-initial', { lang: state.lang, source: bioFallbackLabel });
      forceFillBiographyEditorFromDoc(bioFallback, bioFallbackLabel);
    }
    updateBioMiniPreview();
    loadBiographyBundle().then(function () {
      if (nonce !== state.bioLoadNonce) return;
      var liveFallback = getBiographyRuntimeFallbackDoc(state.lang);
      if (!hasBiographyMeaningfulContent(liveFallback)) {
        bioDebug('load:skip-live', {
          lang: state.lang,
          reason: 'live fallback empty',
          storedKeys: isObject(storedRaw) ? Object.keys(storedRaw).length : 0
        });
        return;
      }
      var liveFallbackLabel = state.lang === 'de'
        ? 'DE source (bundle/legacy)'
        : 'DE source + localized fallback';
      bioDebug('load:apply-live', {
        lang: state.lang,
        fallbackKeys: Object.keys(liveFallback || {}).length,
        storedKeys: isObject(storedRaw) ? Object.keys(storedRaw).length : 0
      });
      setFieldFromSources('bio-introLine', storedDisplay, liveFallback, 'introLine', liveFallbackLabel);
      setFieldFromSources('bio-h2', storedDisplay, liveFallback, 'h2', liveFallbackLabel);
      fillBioParagraphInputsFromStored(storedDisplay, liveFallback);
      setFieldFromSources('bio-continue-tag', storedDisplay, liveFallback, 'continueSectionTag', liveFallbackLabel);
      setFieldFromSources('bio-continue-sub', storedDisplay, liveFallback, 'continueSub', liveFallbackLabel);
      setFieldFromSources('bio-cta-rep', storedDisplay, liveFallback, 'ctaRepertoire', liveFallbackLabel);
      setFieldFromSources('bio-cta-media', storedDisplay, liveFallback, 'ctaMedia', liveFallbackLabel);
      setFieldFromSources('bio-cta-contact', storedDisplay, liveFallback, 'ctaContact', liveFallbackLabel);
      setFieldFromSources('bio-cta-home', storedDisplay, liveFallback, 'ctaHomeIntro', liveFallbackLabel);
      setFieldFromSources('bio-portraitAlt', storedDisplay, liveFallback, 'portraitAlt', liveFallbackLabel);
      setFieldFromSources('bio-quote', storedDisplay, liveFallback, 'quote', liveFallbackLabel);
      setFieldFromSources('bio-cite', storedDisplay, liveFallback, 'cite', liveFallbackLabel);
      var effPortrait = resolveEffectiveBioPortrait(storedRaw, storedDe, state.bioPortraitDefault);
      $('bio-portraitImage').value = effPortrait;
      var portraitSource = 'Bundled default';
      if (isObject(storedRaw) && safeString(storedRaw.portraitImage).trim()) portraitSource = 'Saved here';
      else if (isObject(storedDe) && safeString(storedDe.portraitImage).trim()) portraitSource = 'Inherited (DE)';
      setFieldEffectiveValue($('bio-portraitImage'), { value: effPortrait, source: portraitSource });
      updateBioPortraitPreview();
      if (isBiographyEditorVisiblyEmpty() && hasBiographyMeaningfulContent(liveFallback)) {
        bioDebug('load:force-fill-live', { lang: state.lang, source: liveFallbackLabel });
        forceFillBiographyEditorFromDoc(liveFallback, liveFallbackLabel);
      }
      updateBioMiniPreview();
      updateCompletenessIndicators();
    });
    updateCompletenessIndicators();
  }
  function saveBio() {
    var applyAll = !!($('bio-image-all-langs') && $('bio-image-all-langs').checked);
    var paras = paragraphsArrayFromBioInputs();
    var payload = {
      introLine: safeString($('bio-introLine').value),
      h2: safeString($('bio-h2').value),
      p1: paras[0] || '',
      p2: paras[1] || '',
      paragraphs: paras,
      continueSectionTag: safeString($('bio-continue-tag').value),
      continueSub: safeString($('bio-continue-sub').value),
      ctaRepertoire: safeString($('bio-cta-rep').value),
      ctaMedia: safeString($('bio-cta-media').value),
      ctaContact: safeString($('bio-cta-contact').value),
      ctaHomeIntro: safeString($('bio-cta-home').value),
      portraitAlt: safeString($('bio-portraitAlt').value),
      quote: safeString($('bio-quote').value),
      cite: safeString($('bio-cite').value),
      portraitImage: safeString($('bio-portraitImage').value).trim(),
      portraitFit: safeString($('bio-portraitFit').value).trim(),
      portraitFocus: safeString($('bio-portraitFocus').value).trim()
    };
    bioDebug('save', {
      lang: state.lang,
      target: 'bio_' + state.lang,
      paragraphCount: paras.length,
      applyAllPortraits: applyAll
    });
    saveDoc('bio_' + state.lang, payload);
    // Compatibility mirror for mp/biography runtime override resolution.
    try {
      localStorage.setItem('bio_' + state.lang, JSON.stringify(payload));
    } catch (e) {}
    if (applyAll) {
      LANGS.forEach(function (lang) {
        if (lang === state.lang) return;
        var key = 'bio_' + lang;
        var prev = loadDoc(key, {});
        if (!isObject(prev)) prev = {};
        prev.portraitImage = payload.portraitImage;
        prev.portraitFit = payload.portraitFit;
        prev.portraitFocus = payload.portraitFocus;
        saveDoc(key, prev);
        try {
          localStorage.setItem(key, JSON.stringify(prev));
        } catch (e) {}
      });
    }
  }

  function repFiltered() {
    var cat = $('rep-cat-filter').value;
    var statusFilter = state.repStatusFilter || 'all';
    var q = safeString(state.repSearch).toLowerCase().trim();
    var out = [];
    var wfRep = state.repWorkflowFilter || 'all';
    state.repCards.forEach(function (c, i) {
      if (!(cat === 'all' || (c.cat || 'opera') === cat)) return;
      var rowStatus = safeString(c.status).trim();
      if (statusFilter === 'none' && rowStatus) return;
      if (statusFilter !== 'all' && statusFilter !== 'none' && rowStatus !== statusFilter) return;
      if (q) {
        var hay = [c.composer, c.opera, c.role, c.lang].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
        if (hay.indexOf(q) < 0) return;
      }
      if (wfRep !== 'all') {
        var br = workflowBucketRep(c);
        if (wfRep === 'ready') {
          if (!repCardReadyCheck(c).ok || br === 'hidden') return;
        } else if (!passesWorkflowFilter(br, wfRep)) return;
      }
      out.push({ i: i, c: c });
    });
    return out;
  }
  function renderRepList() {
    var box = $('rep-list');
    var rows = repFiltered();
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No items match these filters. Add one with <strong>+ New</strong> or adjust filters.</div>';
      state.repIndex = -1;
      setSelectionCount('rep-selection-count', state.repSelected);
      renderRepEditor();
      return;
    }
    box.innerHTML = rows.map(function (r) {
      var title = (r.c.role ? r.c.role + ' — ' : '') + (r.c.opera || '(untitled)');
      var cls = r.i === state.repIndex ? 'item active' : 'item';
      var badges = [];
      if (isBlank(r.c.role) || isBlank(r.c.opera)) badges.push({ kind: 'warn', label: 'missing title' });
      if (safeString(r.c.editorialStatus)) badges.push({ kind: 'warn', label: safeString(r.c.editorialStatus) });
      var checked = state.repSelected[r.i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + r.i + '"><div class="item-row"><input class="row-select" data-idx="' + r.i + '" type="checkbox"' + checked + '><div class="item-main">' + title + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('rep-selection-count', state.repSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.repSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('rep-selection-count', state.repSelected);
      });
    });
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.repIndex = Number(el.getAttribute('data-idx'));
        renderRepList();
        renderRepEditor();
      });
    });
    if (state.repIndex < 0 && rows.length) {
      state.repIndex = rows[0].i;
      renderRepList();
      renderRepEditor();
    }
  }
  function renderRepEditor() {
    var c = state.repCards[state.repIndex] || {};
    $('rep-composer').value = safeString(c.composer);
    $('rep-opera').value = safeString(c.opera);
    $('rep-role').value = safeString(c.role);
    setSelectWithCustomValue('rep-cat', safeString(c.cat || 'opera'), 'opera');
    setSelectWithCustomValue('rep-status', safeString(c.status), '');
    $('rep-lang').value = safeString(c.lang);
    setSelectWithCustomValue('rep-category', safeString(c.category), '');
    setSelectWithCustomValue('rep-editorialStatus', safeString(c.editorialStatus || 'draft'), 'draft');
  }
  function persistRepEditor() {
    if (state.repIndex < 0) return;
    var c = state.repCards[state.repIndex] || {};
    c.composer = $('rep-composer').value;
    c.opera = $('rep-opera').value;
    c.role = $('rep-role').value;
    c.cat = $('rep-cat').value || 'opera';
    c.status = $('rep-status').value;
    c.lang = $('rep-lang').value;
    c.category = $('rep-category').value;
    c.editorialStatus = safeString($('rep-editorialStatus').value || 'draft');
    state.repCards[state.repIndex] = c;
    renderRepList();
    markDirty(true);
  }
  function loadRep() {
    var stored = loadDoc('rep_' + state.lang, null);
    var fallback = getLegacySection('rep');
    $('rep-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('rep-intro').value = pickStoredOrFallback(stored, fallback, 'intro');
    if ($('rep-cat-filter')) $('rep-cat-filter').value = $('rep-cat-filter').value || 'all';
    if ($('rep-status-filter')) $('rep-status-filter').value = state.repStatusFilter || 'all';
    if ($('rep-workflow-filter')) $('rep-workflow-filter').value = state.repWorkflowFilter || 'all';
    state.repCards = loadDoc('rg_rep_cards', []);
    state.repIndex = -1;
    renderRepList();
  }
  function saveRepHeader() { saveDoc('rep_' + state.lang, { h2: safeString($('rep-h2').value), intro: safeString($('rep-intro').value) }); }
  function saveRepCards() {
    state.repCards = state.repCards.filter(function (c) { return isObject(c); });
    saveDoc('rg_rep_cards', state.repCards);
  }

  function safeProgramsDoc(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    if (!Array.isArray(d.programs)) d.programs = [];
    d.title = safeString(d.title);
    d.subtitle = safeString(d.subtitle);
    d.intro = safeString(d.intro);
    d.closingNote = safeString(d.closingNote);
    d.programs = d.programs.filter(function (p) { return isObject(p); }).map(function (p, i) {
      var formations = Array.isArray(p.formations) ? p.formations : (typeof p.formations === 'string' ? p.formations.split('\n') : []);
      var idealFor = Array.isArray(p.idealFor) ? p.idealFor : (typeof p.idealFor === 'string' ? p.idealFor.split('\n') : []);
      return {
        id: p.id != null ? Number(p.id) || (i + 1) : (i + 1),
        order: p.order != null ? Number(p.order) || i : i,
        published: p.published !== false,
        editorialStatus: safeString(p.editorialStatus || (p.published === false ? 'hidden' : 'draft')),
        title: safeString(p.title),
        description: safeString(p.description),
        formations: formations.map(function (x) { return safeString(x).trim(); }).filter(Boolean),
        duration: safeString(p.duration),
        idealFor: idealFor.map(function (x) { return safeString(x).trim(); }).filter(Boolean)
      };
    });
    return d;
  }
  function normalizeProgramOrders() {
    state.programsDoc.programs.forEach(function (p, i) {
      p.order = i;
      if (!Number.isFinite(Number(p.id)) || Number(p.id) <= 0) p.id = i + 1;
    });
  }
  function loadProgramsCanonicalForLang(lang) {
    return resolveProgramsDocForLang(lang, null);
  }
  function describeProgramsProvenance(lang) {
    var L = safeString(lang || state.lang || 'en').trim().toLowerCase() || 'en';
    var byLang = loadDoc('rg_programs_' + L, null);
    if (isObject(byLang) && Array.isArray(byLang.programs)) {
      return 'Public Programs are currently using the saved ' + L.toUpperCase() + ' programs document.';
    }
    if (L === 'en') {
      var legacyEn = loadDoc('rg_programs', null);
      if (isObject(legacyEn) && Array.isArray(legacyEn.programs) && legacyEn.programs.length) {
        return 'Public Programs are currently falling back to the legacy EN programs document because no canonical EN programs document is saved yet.';
      }
    }
    try {
      if (state.api && typeof state.api.getPrograms === 'function') {
        var effective = state.api.getPrograms();
        if (isObject(effective) && Array.isArray(effective.programs) && effective.programs.length) {
          return 'Public Programs are currently showing fallback content for ' + L.toUpperCase() + '. Save this language to make its canonical source explicit.';
        }
      }
    } catch (e) {}
    return 'No saved Programs list is currently available for ' + L.toUpperCase() + '.';
  }
  function renderProgramsProvenance() {
    var el = $('programs-provenance');
    if (!el) return;
    el.textContent = describeProgramsProvenance(state.lang);
  }
  function renderProgramsList() {
    var box = $('programs-list');
    var arr = state.programsDoc.programs;
    if (!arr.length) {
      box.innerHTML = '<div class="empty-state">No hay programas. Crea uno con "+ Nuevo".</div>';
      state.programsIndex = -1;
      setSelectionCount('programs-selection-count', state.programsSelected);
      renderProgramsEditor();
      return;
    }
    var listed = programsListedIndices();
    if (!listed.length) {
      box.innerHTML = '<div class="empty-state">No programs match this workflow filter.</div>';
      state.programsIndex = -1;
      setSelectionCount('programs-selection-count', state.programsSelected);
      renderProgramsEditor();
      return;
    }
    box.innerHTML = listed.map(function (i) {
      var p = arr[i];
      var cls = i === state.programsIndex ? 'item active' : 'item';
      var status = p.published ? 'published' : 'hidden';
      var title = safeString(p.title) || '(untitled)';
      var badges = [];
      if (isBlank(p.title)) badges.push({ kind: 'warn', label: 'missing title' });
      if (isBlank(p.description)) badges.push({ kind: 'warn', label: 'missing text' });
      if (!p.published) badges.push({ kind: 'err', label: 'hidden' });
      var wb = workflowBucketProgram(p);
      badges.push({ kind: 'warn', label: wb });
      if (state.programsWorkflowFilter === 'ready' && !programReadyCheck(p).ok) {
        badges.push({ kind: 'warn', label: 'not ready' });
      }
      var checked = state.programsSelected[i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + i + '"><div class="item-row"><input class="row-select" data-idx="' + i + '" type="checkbox"' + checked + '><div class="item-main">' + title + ' · ' + status + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('programs-selection-count', state.programsSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.programsSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('programs-selection-count', state.programsSelected);
      });
    });
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.programsIndex = Number(el.getAttribute('data-idx'));
        renderProgramsList();
        renderProgramsEditor();
      });
    });
    if (state.programsIndex < 0 || listed.indexOf(state.programsIndex) < 0) {
      state.programsIndex = listed[0];
      renderProgramsList();
      renderProgramsEditor();
    }
  }
  function renderProgramsEditor() {
    var p = state.programsDoc.programs[state.programsIndex] || {};
    $('programs-item-title').value = safeString(p.title);
    $('programs-item-description').value = safeString(p.description);
    $('programs-item-formations').value = Array.isArray(p.formations) ? p.formations.join('\n') : '';
    $('programs-item-duration').value = safeString(p.duration);
    $('programs-item-idealFor').value = Array.isArray(p.idealFor) ? p.idealFor.join('\n') : '';
    $('programs-item-published').value = p.published === false ? 'false' : 'true';
    setSelectWithCustomValue('programs-item-editorialStatus', safeString(p.editorialStatus || 'draft'), 'draft');
    updateProgramsMiniPreview();
    applyTranslationMissingOnlyMask();
  }
  function persistProgramsEditor() {
    if (state.programsIndex < 0) return;
    var p = state.programsDoc.programs[state.programsIndex] || {};
    p.title = safeString($('programs-item-title').value);
    p.description = safeString($('programs-item-description').value);
    p.formations = safeString($('programs-item-formations').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    p.duration = safeString($('programs-item-duration').value);
    p.idealFor = safeString($('programs-item-idealFor').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    p.published = $('programs-item-published').value !== 'false';
    p.editorialStatus = safeString($('programs-item-editorialStatus').value || 'draft');
    state.programsDoc.programs[state.programsIndex] = p;
    normalizeProgramOrders();
    renderProgramsList();
    updateProgramsMiniPreview();
    markDirty(true, 'Program updated');
  }
  function loadPrograms() {
    state.programsDoc = loadProgramsCanonicalForLang(state.lang);
    clearSelected(state.programsSelected);
    if ($('programs-workflow-filter')) $('programs-workflow-filter').value = state.programsWorkflowFilter || 'all';
    var edStored = loadDoc('rg_editorial_' + state.lang, null);
    var edFallback = {};
    try {
      if (typeof state.api.getEditorial === 'function') {
        var legacyEd = state.api.getEditorial();
        if (isObject(legacyEd)) edFallback = legacyEd;
      }
    } catch (e) {}
    $('programs-title').value = safeString(state.programsDoc.title);
    $('programs-subtitle').value = safeString(state.programsDoc.subtitle);
    $('programs-intro').value = safeString(state.programsDoc.intro);
    $('programs-closingNote').value = safeString(state.programsDoc.closingNote);
    $('programs-repLink').value = pickStoredOrFallback(edStored, edFallback, 'repProgramsLink');
    $('programs-epkLink').value = pickStoredOrFallback(edStored, edFallback, 'epkProgramsLink');
    if ($('programs-hideSection')) {
      var hideProgramsSection = false;
      if (isObject(edStored) && hasOwn(edStored, 'hideProgramsSection')) hideProgramsSection = asBoolean(edStored.hideProgramsSection, false);
      else if (isObject(edFallback) && hasOwn(edFallback, 'hideProgramsSection')) hideProgramsSection = asBoolean(edFallback.hideProgramsSection, false);
      $('programs-hideSection').checked = !!hideProgramsSection;
    }
    renderProgramsProvenance();
    state.programsIndex = -1;
    renderProgramsList();
    updateCompletenessIndicators();
  }
  function savePrograms() {
    state.programsDoc.title = safeString($('programs-title').value);
    state.programsDoc.subtitle = safeString($('programs-subtitle').value);
    state.programsDoc.intro = safeString($('programs-intro').value);
    state.programsDoc.closingNote = safeString($('programs-closingNote').value);
    state.programsDoc = safeProgramsDoc(state.programsDoc);
    normalizeProgramOrders();
    saveDoc('rg_programs_' + state.lang, state.programsDoc);
    var prevEd = loadDoc('rg_editorial_' + state.lang, {});
    prevEd.repProgramsLink = safeString($('programs-repLink').value).trim();
    prevEd.epkProgramsLink = safeString($('programs-epkLink').value).trim();
    prevEd.hideProgramsSection = !!($('programs-hideSection') && $('programs-hideSection').checked);
    if (hasOwn(prevEd, 'hideProgramsEntryPoints')) delete prevEd.hideProgramsEntryPoints;
    saveDoc('rg_editorial_' + state.lang, prevEd);
  }
  async function saveProgramsVisibilityOnly() {
    var prevEd = loadDoc('rg_editorial_' + state.lang, {});
    prevEd.hideProgramsSection = !!($('programs-hideSection') && $('programs-hideSection').checked);
    if (hasOwn(prevEd, 'hideProgramsEntryPoints')) delete prevEd.hideProgramsEntryPoints;
    var ok = await saveDoc('rg_editorial_' + state.lang, prevEd);
    if (!ok) throw new Error('programs-visibility-save-failed');
  }

  function plannerFamilyLabel(family) {
    var f = safeString(family).trim().toLowerCase();
    if (f === 'gala') return 'Gala';
    if (f === 'italian') return 'Italian';
    if (f === 'tango') return 'Tango';
    if (f === 'borders') return 'Borders';
    return f || 'Program';
  }
  function plannerOutputCopy(lang) {
    var key = safeString(lang || 'en').trim().toLowerCase();
    return PROGRAM_BUILDER_TEXT[key] || PROGRAM_BUILDER_TEXT.en;
  }
  function normalizeProgramOfferRepertoireMode(value) {
    var key = safeString(value || 'suggested').trim().toLowerCase();
    return ['suggested', 'agreed', 'possible'].indexOf(key) >= 0 ? key : 'suggested';
  }
  function programOfferRepertoireHeading(copy, mode) {
    mode = normalizeProgramOfferRepertoireMode(mode);
    if (copy && copy.repertoireHeadingModes && copy.repertoireHeadingModes[mode]) return copy.repertoireHeadingModes[mode];
    return (copy && copy.repertoireLabel) || 'Selected repertoire';
  }
  function plannerFamilyLabelForLang(family, lang) {
    var copy = plannerOutputCopy(lang);
    var f = safeString(family).trim().toLowerCase();
    return safeString(copy.families && copy.families[f]) || plannerFamilyLabel(family);
  }
  function normalizeProgramOfferStyleFocus(value) {
    value = safeString(value || '').trim().toLowerCase();
    return ['mixed','baroque','classical','belcanto','romantic','verismo'].indexOf(value) >= 0 ? value : 'mixed';
  }
  function plannerStyleFocusLabel(value) {
    var key = normalizeProgramOfferStyleFocus(value);
    return ({
      mixed: 'Open / Mixed',
      baroque: 'Baroque',
      classical: 'Classical',
      belcanto: 'Belcanto',
      romantic: 'Romantic',
      verismo: 'Verismo'
    })[key] || 'Open / Mixed';
  }
  function programOfferLocalizedFormation(formation, lang) {
    var value = safeString(formation).trim();
    if (!value) return '';
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var replacements = {
      de: [
        [/\bFlexible guest artist format\b/gi, 'Flexibles Gastkünstler-Format'],
        [/\bThree artists \+ Piano\b/gi, 'Drei Künstler + Klavier'],
        [/\bEnsemble with piano\b/gi, 'Ensemble mit Klavier'],
        [/\bTenor\b/gi, 'Tenor'],
        [/\bSoprano\b/gi, 'Sopran'],
        [/\bBaritone\b/gi, 'Bariton'],
        [/\bPiano\b/gi, 'Klavier'],
        [/\bPianist\b/gi, 'Klavier']
      ],
      es: [
        [/\bFlexible guest artist format\b/gi, 'Formato flexible con artista invitado'],
        [/\bThree artists \+ Piano\b/gi, 'Tres artistas + piano'],
        [/\bEnsemble with piano\b/gi, 'Conjunto con piano'],
        [/\bBaritone\b/gi, 'Barítono'],
        [/\bPianist\b/gi, 'Piano']
      ],
      it: [
        [/\bFlexible guest artist format\b/gi, 'Formato flessibile con artista ospite'],
        [/\bThree artists \+ Piano\b/gi, 'Tre artisti + Pianoforte'],
        [/\bEnsemble with piano\b/gi, 'Ensemble con pianoforte'],
        [/\bTenor\b/gi, 'Tenore'],
        [/\bBaritone\b/gi, 'Baritono'],
        [/\bPiano\b/gi, 'Pianoforte'],
        [/\bPianist\b/gi, 'Pianoforte']
      ],
      fr: [
        [/\bFlexible guest artist format\b/gi, 'Format flexible avec artiste invité'],
        [/\bThree artists \+ Piano\b/gi, 'Trois artistes + piano'],
        [/\bEnsemble with piano\b/gi, 'Ensemble avec piano'],
        [/\bTenor\b/gi, 'Ténor'],
        [/\bBaritone\b/gi, 'Baryton'],
        [/\bPiano\b/gi, 'Piano'],
        [/\bPianist\b/gi, 'Piano']
      ]
    };
    var list = replacements[L];
    if (!list || !list.length) return value;
    var result = value;
    list.forEach(function (pair) {
      result = result.replace(pair[0], pair[1]);
    });
    return result;
  }
  function plannerStatusLabel(key, lang) {
    var copy = plannerOutputCopy(lang);
    if (key === 'too short') return copy.statusShort;
    if (key === 'slightly over') return copy.statusSlightlyOver || copy.statusOk;
    if (key === 'too long') return copy.statusLong;
    return copy.statusOk;
  }
  function defaultBlueprintTitle(family, duration, lang) {
    return plannerFamilyLabelForLang(family, lang) + ' · ' + duration + ' min';
  }
  function defaultBlueprintDescription(family, lang) {
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var map = {
      en: {
        gala: 'A polished operatic programme shaped for presenters seeking lyrical contrast, recognisable repertoire, and immediate audience appeal.',
        italian: 'An Italian-centred recital proposal built around vocal line, colour, text, and atmosphere.',
        tango: 'A concentrated programme of tango, song, and narrative intensity for intimate and distinctive concert settings.',
        borders: 'A multilingual recital arc linking languages, styles, and cultural spaces within one coherent evening.'
      },
      de: {
        gala: 'Ein opernhaftes Konzertangebot für Veranstalter, die lyrischen Kontrast, Wiedererkennungswert und klare Dramaturgie suchen.',
        italian: 'Ein italienisch geprägter Rezitalvorschlag, getragen von vokaler Linie, Farbe, Text und Atmosphäre.',
        tango: 'Ein konzentriertes Programm zwischen Tango, Lied und Erzählkraft für intime und charaktervolle Konzertformate.',
        borders: 'Ein mehrsprachiger Rezitalbogen, der Sprachen, Stile und kulturelle Räume in einem schlüssigen Abend verbindet.'
      },
      es: {
        gala: 'Una propuesta operística pensada para programadores que buscan contraste lírico, repertorio reconocible y una dramaturgia clara.',
        italian: 'Una propuesta de recital de impronta italiana, centrada en la línea vocal, el color, el texto y la atmósfera.',
        tango: 'Un programa concentrado entre tango, canción y fuerza narrativa para contextos íntimos y con personalidad.',
        borders: 'Un arco de recital multilingüe que conecta lenguas, estilos y espacios culturales dentro de una velada coherente.'
      },
      it: {
        gala: 'Una proposta operistica pensata per organizzatori che cercano contrasto lirico, repertorio riconoscibile e una drammaturgia chiara.',
        italian: 'Una proposta di recital di impronta italiana, costruita intorno a linea vocale, colore, parola e atmosfera.',
        tango: 'Un programma concentrato tra tango, canto e forza narrativa per contesti intimi e dal forte profilo artistico.',
        borders: 'Un arco di recital multilingue che collega lingue, stili e spazi culturali in una serata coerente.'
      },
      fr: {
        gala: 'Une proposition lyrique pensée pour les programmateurs à la recherche de contraste, de répertoire reconnaissable et de clarté dramaturgique.',
        italian: "Une proposition de récital d'inspiration italienne, centrée sur la ligne vocale, la couleur, le texte et l'atmosphère.",
        tango: 'Un programme concentré entre tango, chant et force narrative pour des contextes intimes et singuliers.',
        borders: 'Un arc de récital multilingue reliant langues, styles et espaces culturels dans une soirée cohérente.'
      }
    };
    return safeString(map[L] && map[L][family]) || plannerOutputCopy(L).summaryFallback;
  }
  function defaultBlueprintFlexibleNote(lang) {
    return plannerOutputCopy(lang).flexibleNote;
  }
  function programOfferFeeCopy(lang) {
    var key = safeString(lang || 'en').trim().toLowerCase() || 'en';
    return PROGRAMME_FEE_COPY[key] || PROGRAMME_FEE_COPY.en;
  }
  function formatEuroAmount(value) {
    var amount = Math.max(0, Number(value) || 0);
    try {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
    } catch (e) {
      return 'EUR ' + String(Math.round(amount));
    }
  }
  function inferArtistCountFromFormation(formation) {
    var text = safeString(formation).trim();
    if (!text) return 1;
    var parts = text.split(/\s*\+\s*/).map(function (x) { return safeString(x).trim(); }).filter(Boolean);
    return Math.max(1, parts.length || 1);
  }
  function formationIncludesPianist(formation) {
    var text = safeString(formation).toLowerCase();
    return text.indexOf('piano') >= 0 || text.indexOf('pianist') >= 0 || text.indexOf('klavier') >= 0 || text.indexOf('pianoforte') >= 0;
  }
  function feeEstimateDurationBucket(duration) {
    var minutes = Math.max(0, Number(duration) || 0);
    if (minutes <= 37) return 30;
    if (minutes <= 52) return 45;
    return 60;
  }
  function roundFeeQuote(value) {
    var amount = Math.max(0, Number(value) || 0);
    return Math.round(amount / 10) * 10;
  }
  function feeEstimateFormationProfile(formation, numberOfArtists, includesPianist) {
    var text = safeString(formation).toLowerCase();
    var artistCount = Math.max(1, Number(numberOfArtists) || inferArtistCountFromFormation(formation));
    var hasPiano = !!includesPianist || formationIncludesPianist(formation);
    var hasSoprano = text.indexOf('soprano') >= 0;
    var hasBaritone = text.indexOf('baritone') >= 0;
    if (hasPiano && artistCount <= 2) return { key: 'tenor_piano', label: 'Tenor + Piano' };
    if (hasPiano && hasSoprano) return { key: 'tenor_soprano_piano', label: 'Tenor + Soprano + Piano' };
    if (hasPiano && hasBaritone) return { key: 'tenor_baritone_piano', label: 'Tenor + Baritone + Piano' };
    if (hasPiano && artistCount === 3) return { key: 'trio_with_piano', label: 'Three artists + Piano' };
    if (hasPiano) return { key: 'ensemble_with_piano', label: 'Ensemble with piano' };
    return { key: 'general', label: safeString(formation).trim() || 'General recital setup' };
  }
  function feeEstimateFormationGuides(profileKey, duration) {
    var bucket = feeEstimateDurationBucket(duration);
    var guides = {
      tenor_piano: {
        30: { low: [350, 500], fair: [700, 1000], base: { lead: 250, collaborator: 0, pianist: 150 } },
        45: { low: [450, 650], fair: [850, 1200], base: { lead: 300, collaborator: 0, pianist: 180 } },
        60: { low: [500, 800], fair: [1000, 1500], base: { lead: 350, collaborator: 0, pianist: 220 } }
      },
      tenor_soprano_piano: {
        30: { low: [500, 800], fair: [1000, 1500], base: { lead: 250, collaborator: 160, pianist: 150 } },
        45: { low: [700, 1000], fair: [1300, 1800], base: { lead: 320, collaborator: 220, pianist: 180 } },
        60: { low: [800, 1200], fair: [1500, 2200], base: { lead: 380, collaborator: 260, pianist: 220 } }
      },
      tenor_baritone_piano: {
        30: { low: [500, 800], fair: [1000, 1500], base: { lead: 250, collaborator: 160, pianist: 150 } },
        45: { low: [700, 1000], fair: [1300, 1800], base: { lead: 320, collaborator: 220, pianist: 180 } },
        60: { low: [800, 1200], fair: [1500, 2200], base: { lead: 380, collaborator: 260, pianist: 220 } }
      },
      trio_with_piano: {
        30: { low: [500, 800], fair: [1000, 1500], base: { lead: 250, collaborator: 160, pianist: 150 } },
        45: { low: [700, 1000], fair: [1300, 1800], base: { lead: 320, collaborator: 220, pianist: 180 } },
        60: { low: [800, 1200], fair: [1500, 2200], base: { lead: 380, collaborator: 260, pianist: 220 } }
      },
      ensemble_with_piano: {
        30: { low: [650, 950], fair: [1300, 1800], base: { lead: 260, collaborator: 170, pianist: 160 } },
        45: { low: [850, 1200], fair: [1600, 2200], base: { lead: 340, collaborator: 230, pianist: 190 } },
        60: { low: [1000, 1500], fair: [1900, 2600], base: { lead: 400, collaborator: 270, pianist: 230 } }
      },
      general: {
        30: { low: [400, 600], fair: [850, 1200], base: { lead: 260, collaborator: 160, pianist: 150 } },
        45: { low: [550, 800], fair: [1100, 1500], base: { lead: 320, collaborator: 220, pianist: 180 } },
        60: { low: [700, 950], fair: [1350, 1800], base: { lead: 380, collaborator: 250, pianist: 220 } }
      }
    };
    var group = guides[profileKey] || guides.general;
    return group[bucket] || group[45];
  }
  function feeEstimateBenchmarkRates(duration) {
    var bucket = feeEstimateDurationBucket(duration);
    var map = {
      30: { lead: 600, collaborator: 425, pianist: 325, rehearsalPerArtist: 90 },
      45: { lead: 650, collaborator: 475, pianist: 350, rehearsalPerArtist: 95 },
      60: { lead: 700, collaborator: 525, pianist: 400, rehearsalPerArtist: 100 }
    };
    return map[bucket] || map[45];
  }
  function feeEstimateEventMultipliers(eventType) {
    var key = safeString(eventType || 'cultural').trim().toLowerCase();
    var map = {
      church: { lowBudgetMultiplier: 1, fairMultiplier: 0.92, benchmarkMultiplier: 0.98, premiumMultiplier: 0.98, label: 'Church / low-budget local' },
      cultural: { lowBudgetMultiplier: 1, fairMultiplier: 1, benchmarkMultiplier: 1, premiumMultiplier: 1.08, label: 'Cultural standard' },
      festival: { lowBudgetMultiplier: 1.02, fairMultiplier: 1.08, benchmarkMultiplier: 1.05, premiumMultiplier: 1.16, label: 'Festival uplift' },
      embassy: { lowBudgetMultiplier: 1.04, fairMultiplier: 1.18, benchmarkMultiplier: 1.12, premiumMultiplier: 1.3, label: 'Embassy / institutional uplift' },
      private: { lowBudgetMultiplier: 1.08, fairMultiplier: 1.28, benchmarkMultiplier: 1.16, premiumMultiplier: 1.45, label: 'Private premium uplift' },
      other: { lowBudgetMultiplier: 1, fairMultiplier: 0.98, benchmarkMultiplier: 1, premiumMultiplier: 1.06, label: 'General context' }
    };
    return map[key] || map.cultural;
  }
  function defaultFeeEstimateForBlueprint(bp) {
    var formation = safeString(bp && bp.formation).trim() || 'Tenor + Piano';
    var duration = Math.max(0, Number((bp && bp.totalDuration) || (bp && bp.targetDuration)) || 30);
    var numberOfArtists = inferArtistCountFromFormation(formation);
    var includesPianist = formationIncludesPianist(formation);
    var profile = feeEstimateFormationProfile(formation, numberOfArtists, includesPianist);
    var guide = feeEstimateFormationGuides(profile.key, duration);
    return {
      preset: 'berlin_local',
      eventType: 'cultural',
      durationMin: duration,
      formation: formation,
      numberOfArtists: numberOfArtists,
      includesPianist: includesPianist,
      rehearsalCount: 0,
      rehearsalFeePerArtist: 0,
      leadArtistFee: guide.base.lead,
      collaboratorFee: guide.base.collaborator,
      pianistFee: guide.base.pianist,
      travelCost: 0,
      hotelCost: 0,
      localTransportCost: 20,
      adminBuffer: 25,
      lowBudgetOverride: 0,
      recommendedOverride: 0,
      benchmarkOverride: 0,
      premiumOverride: 0,
      benchmarkSourceVersion: 'DE/Berlin benchmark v1',
      benchmarkLastReviewed: '2026-04-08',
      notes: ''
    };
  }
  function safeBlueprintFeeEstimate(raw, bp) {
    var seed = defaultFeeEstimateForBlueprint(bp);
    var fee = isObject(raw) ? raw : {};
    var presetKey = safeString(fee.preset || seed.preset).trim().toLowerCase();
    var includesPianist = asBoolean(fee.includesPianist, seed.includesPianist);
    var numberOfArtists = Math.max(includesPianist ? 2 : 1, Number(fee.numberOfArtists) || seed.numberOfArtists);
    return {
      preset: hasOwn(PROGRAMME_FEE_PRESETS, presetKey) ? presetKey : seed.preset,
      eventType: safeString(fee.eventType || seed.eventType).trim().toLowerCase() || seed.eventType,
      durationMin: Math.max(0, Number(fee.durationMin) || seed.durationMin),
      formation: safeString(fee.formation || seed.formation),
      numberOfArtists: numberOfArtists,
      includesPianist: includesPianist,
      rehearsalCount: Math.max(0, Number(fee.rehearsalCount) || 0),
      rehearsalFeePerArtist: Math.max(0, Number(fee.rehearsalFeePerArtist) || 0),
      leadArtistFee: Math.max(0, Number(fee.leadArtistFee) || 0),
      collaboratorFee: Math.max(0, Number(fee.collaboratorFee) || 0),
      pianistFee: Math.max(0, Number(fee.pianistFee) || 0),
      travelCost: Math.max(0, Number(fee.travelCost) || 0),
      hotelCost: Math.max(0, Number(fee.hotelCost) || 0),
      localTransportCost: Math.max(0, Number(fee.localTransportCost) || 0),
      adminBuffer: Math.max(0, Number(fee.adminBuffer) || 0),
      lowBudgetOverride: Math.max(0, Number(fee.lowBudgetOverride) || Number(fee.minimumOverride) || 0),
      recommendedOverride: Math.max(0, Number(fee.recommendedOverride) || 0),
      benchmarkOverride: Math.max(0, Number(fee.benchmarkOverride) || 0),
      premiumOverride: Math.max(0, Number(fee.premiumOverride) || 0),
      benchmarkSourceVersion: safeString(fee.benchmarkSourceVersion || seed.benchmarkSourceVersion),
      benchmarkLastReviewed: safeString(fee.benchmarkLastReviewed || seed.benchmarkLastReviewed),
      notes: safeString(fee.notes)
    };
  }
  function computeBlueprintFeeEstimate(bp) {
    var fee = safeBlueprintFeeEstimate(bp && bp.feeEstimate, bp);
    var lang = safeString(bp && bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
    var copy = programOfferFeeCopy(lang);
    var totalArtists = Math.max(1, Number(fee.numberOfArtists) || 1);
    var pianistCount = fee.includesPianist ? 1 : 0;
    var collaboratorCount = Math.max(0, totalArtists - 1 - pianistCount);
    var rehearsalParticipants = 1 + collaboratorCount + pianistCount;
    var rehearsalSubtotal = fee.rehearsalCount * fee.rehearsalFeePerArtist * rehearsalParticipants;
    var artisticSubtotal = fee.leadArtistFee + (collaboratorCount * fee.collaboratorFee) + (pianistCount * fee.pianistFee) + rehearsalSubtotal;
    var logisticsSubtotal = fee.travelCost + fee.hotelCost + fee.localTransportCost + fee.adminBuffer;
    var realCostBase = artisticSubtotal + logisticsSubtotal;
    var adjustment = feeEstimateEventMultipliers(fee.eventType);
    var profile = feeEstimateFormationProfile(fee.formation, totalArtists, fee.includesPianist);
    var guide = feeEstimateFormationGuides(profile.key, fee.durationMin);
    var benchmarkRates = feeEstimateBenchmarkRates(fee.durationMin);
    var lowGuideFloor = guide.low[0] + logisticsSubtotal;
    var fairGuideMid = ((guide.fair[0] + guide.fair[1]) / 2) + logisticsSubtotal;
    var fairGuideHigh = guide.fair[1] + logisticsSubtotal;
    var benchmarkArtistic = Math.max(fee.leadArtistFee, benchmarkRates.lead) +
      (collaboratorCount * Math.max(fee.collaboratorFee, benchmarkRates.collaborator)) +
      (pianistCount * Math.max(fee.pianistFee, benchmarkRates.pianist)) +
      (fee.rehearsalCount * rehearsalParticipants * Math.max(fee.rehearsalFeePerArtist, benchmarkRates.rehearsalPerArtist));
    var lowBudgetBase = Math.max(realCostBase, lowGuideFloor);
    var recommendedBase = Math.max(realCostBase, fairGuideMid);
    var benchmarkBase = Math.max(realCostBase, benchmarkArtistic + logisticsSubtotal);
    var premiumBase = Math.max(recommendedBase, fairGuideHigh);
    var lowBudget = roundFeeQuote(Math.max(realCostBase, lowBudgetBase * adjustment.lowBudgetMultiplier));
    var recommended = roundFeeQuote(recommendedBase * adjustment.fairMultiplier);
    var benchmark = roundFeeQuote(benchmarkBase * adjustment.benchmarkMultiplier);
    var premium = roundFeeQuote(Math.max(recommended, premiumBase * adjustment.premiumMultiplier));
    var lowBudgetOverrideActive = fee.lowBudgetOverride > 0;
    var recommendedOverrideActive = fee.recommendedOverride > 0;
    var benchmarkOverrideActive = fee.benchmarkOverride > 0;
    var premiumOverrideActive = fee.premiumOverride > 0;
    if (lowBudgetOverrideActive) lowBudget = fee.lowBudgetOverride;
    if (recommendedOverrideActive) recommended = fee.recommendedOverride;
    if (benchmarkOverrideActive) benchmark = fee.benchmarkOverride;
    if (premiumOverrideActive) premium = fee.premiumOverride;
    var logicSummary = [
      'Lead artist ' + formatEuroAmount(fee.leadArtistFee),
      collaboratorCount ? (String(collaboratorCount) + ' collaborator' + (collaboratorCount === 1 ? '' : 's') + ' × ' + formatEuroAmount(fee.collaboratorFee)) : 'No additional singer fee',
      pianistCount ? ('Pianist ' + formatEuroAmount(fee.pianistFee)) : 'No pianist fee',
      fee.rehearsalCount ? (String(fee.rehearsalCount) + ' rehearsal' + (fee.rehearsalCount === 1 ? '' : 's') + ' × ' + String(rehearsalParticipants) + ' artists × ' + formatEuroAmount(fee.rehearsalFeePerArtist)) : 'No rehearsal fee',
      'Market reality stays close to the real floor ' + formatEuroAmount(realCostBase) + ' and the current ' + profile.label + ' local guide (' + formatEuroAmount(guide.low[0]) + '–' + formatEuroAmount(guide.low[1]) + ' before logistics).',
      adjustment.label + ': fair ×' + adjustment.fairMultiplier.toFixed(2) + ', benchmark ×' + adjustment.benchmarkMultiplier.toFixed(2) + ', premium ×' + adjustment.premiumMultiplier.toFixed(2) + '.',
      'Benchmark reference uses ' + formatEuroAmount(benchmarkRates.lead) + ' lead / ' + formatEuroAmount(benchmarkRates.collaborator) + ' collaborator / ' + formatEuroAmount(benchmarkRates.pianist) + ' pianist plus ' + formatEuroAmount(benchmarkRates.rehearsalPerArtist) + ' rehearsal per artist.'
    ].join(' · ');
    var negotiation = [];
    if (fee.eventType === 'church') negotiation.push('For church or low-budget local contexts, use the market-reality layer as the realistic negotiating floor and keep the formation lean.');
    if (fee.eventType === 'embassy' || fee.eventType === 'festival') negotiation.push('Institutional and festival contexts usually justify moving from market reality toward the fair layer, especially once rehearsals or travel become visible.');
    if (fee.eventType === 'private') negotiation.push('Private contexts normally justify the premium / private layer, especially for tailored requests or additional rehearsal time.');
    if ((fee.travelCost + fee.hotelCost) > 0) negotiation.push('Travel and hotel should remain visible as real costs and not be absorbed into the artistic floor.');
    if (fee.rehearsalCount > 1) negotiation.push('Multiple rehearsals make it easier to defend the fair layer over the low-budget reality figure.');
    if (!negotiation.length) negotiation.push('Use market reality as the low negotiating floor, the fair quote as the normal target, and the public benchmark as internal reference rather than small-venue expectation.');
    var adjustmentLine = [
      'Base cost logic: ' + formatEuroAmount(artisticSubtotal) + ' artistic + ' + formatEuroAmount(logisticsSubtotal) + ' logistics = ' + formatEuroAmount(realCostBase) + '.',
      adjustment.label + ': market ×' + adjustment.lowBudgetMultiplier.toFixed(2) + ', fair ×' + adjustment.fairMultiplier.toFixed(2) + ', benchmark ×' + adjustment.benchmarkMultiplier.toFixed(2) + ', premium ×' + adjustment.premiumMultiplier.toFixed(2) + '.',
      'Result: low-budget ' + formatEuroAmount(lowBudget) + (lowBudgetOverrideActive ? ' (manual override)' : '') + ' · fair ' + formatEuroAmount(recommended) + (recommendedOverrideActive ? ' (manual override)' : '') + ' · benchmark ' + formatEuroAmount(benchmark) + (benchmarkOverrideActive ? ' (manual override)' : '') + ' · premium ' + formatEuroAmount(premium) + (premiumOverrideActive ? ' (manual override)' : '') + '.'
    ].join(' ');
    var title = safeString((bp && bp.title) || resolveProgramOfferField(bp || {}, 'title', lang)).trim();
    var summaryText = [
      copy.summaryTitle,
      title,
      copy.formation + ': ' + safeString(fee.formation),
      copy.duration + ': ' + String(fee.durationMin) + ' min',
      copy.eventType + ': ' + safeString(fee.eventType),
      copy.participants + ': ' + String(totalArtists),
      copy.rehearsals + ': ' + String(fee.rehearsalCount),
      '',
      copy.artisticSubtotal + ': ' + formatEuroAmount(artisticSubtotal),
      copy.logisticsSubtotal + ': ' + formatEuroAmount(logisticsSubtotal),
      copy.lowBudget + ': ' + formatEuroAmount(lowBudget),
      copy.recommended + ': ' + formatEuroAmount(recommended),
      copy.benchmark + ': ' + formatEuroAmount(benchmark),
      copy.premium + ': ' + formatEuroAmount(premium),
      copy.benchmarkSource + ': ' + safeString(fee.benchmarkSourceVersion || '—'),
      copy.benchmarkReviewed + ': ' + safeString(fee.benchmarkLastReviewed || '—'),
      'Adjustment: ' + adjustmentLine,
      '',
      logicSummary,
      safeString(fee.notes).trim() ? ('\n' + copy.notesLabel + ':\n' + safeString(fee.notes).trim()) : ''
    ].filter(Boolean).join('\n');
    var emailText = [
      copy.emailLead,
      title + ' · ' + String(fee.durationMin) + ' min · ' + safeString(fee.formation),
      copy.emailRecommended + ': ' + formatEuroAmount(recommended),
      copy.emailLowBudget + ': ' + formatEuroAmount(lowBudget),
      copy.emailBenchmark + ': ' + formatEuroAmount(benchmark),
      copy.emailPremium + ': ' + formatEuroAmount(premium),
      copy.emailCloser
    ].join('\n');
    return {
      fee: fee,
      artisticSubtotal: artisticSubtotal,
      logisticsSubtotal: logisticsSubtotal,
      lowBudget: lowBudget,
      recommended: recommended,
      benchmark: benchmark,
      premium: premium,
      logicSummary: logicSummary,
      negotiationNotes: negotiation.join(' '),
      adjustmentLine: adjustmentLine,
      summaryText: summaryText,
      emailText: emailText
    };
  }
  function applyBlueprintFeePreset(presetKey) {
    var bp = currentBlueprint();
    var current = safeBlueprintFeeEstimate(bp.feeEstimate, bp);
    var preset = PROGRAMME_FEE_PRESETS[safeString(presetKey).trim().toLowerCase()] || PROGRAMME_FEE_PRESETS.berlin_local;
    var profile = feeEstimateFormationProfile(current.formation, current.numberOfArtists, current.includesPianist);
    var guide = feeEstimateFormationGuides(profile.key, current.durationMin);
    var multiplier = Math.max(0.5, Number(preset.artistFeeMultiplier) || 1);
    bp.feeEstimate = safeBlueprintFeeEstimate({
      preset: presetKey,
      eventType: preset.eventType,
      durationMin: current.durationMin,
      formation: current.formation,
      numberOfArtists: current.numberOfArtists,
      includesPianist: current.includesPianist,
      rehearsalCount: preset.rehearsalCount,
      rehearsalFeePerArtist: preset.rehearsalFeePerArtist,
      leadArtistFee: roundFeeQuote(guide.base.lead * multiplier),
      collaboratorFee: roundFeeQuote(guide.base.collaborator * multiplier),
      pianistFee: roundFeeQuote(guide.base.pianist * multiplier),
      travelCost: preset.travelCost,
      hotelCost: preset.hotelCost,
      localTransportCost: preset.localTransportCost,
      adminBuffer: preset.adminBuffer,
      lowBudgetOverride: 0,
      recommendedOverride: 0,
      benchmarkOverride: 0,
      premiumOverride: 0,
      benchmarkSourceVersion: current.benchmarkSourceVersion,
      benchmarkLastReviewed: current.benchmarkLastReviewed,
      notes: current.notes
    }, bp);
    renderBlueprintBuilder();
    markDirty(true, 'Fee preset applied');
    setStatus('Fee preset applied.', 'ok');
  }
  function normalizeProgramOfferUseCase(value) {
    var key = safeString(value || 'other').trim().toLowerCase();
    return PROGRAMME_OFFER_USE_CASES.indexOf(key) >= 0 ? key : 'other';
  }
  function normalizeSavedProgramStatus(value, saveType) {
    var key = safeString(value || '').trim().toLowerCase();
    if (key === 'reusable') key = 'active';
    if (PROGRAMME_OFFER_STATUS_VALUES.indexOf(key) >= 0) return key;
    return saveType === 'master_programme' ? 'active' : 'draft';
  }
  function normalizeSavedProgramType(value) {
    var key = safeString(value).trim().toLowerCase();
    if (key === 'reusable' || key === 'master_programme') return 'master_programme';
    return 'venue_offer';
  }
  function savedProgrammeTypeLabel(saveType) {
    return normalizeSavedProgramType(saveType) === 'master_programme' ? 'Master Programme' : 'Venue Offer';
  }
  function makeProgrammeOfferSavedId(saveType) {
    var stamp = Date.now().toString(36);
    var rand = Math.random().toString(36).slice(2, 8);
    return 'offer_' + (normalizeSavedProgramType(saveType) === 'master_programme' ? 'm' : 'v') + '_' + stamp + '_' + rand;
  }
  function formatProgrammeOfferTimestamp(value) {
    var text = safeString(value).trim();
    if (!text) return 'Not saved yet';
    var date = new Date(text);
    return isNaN(date.getTime()) ? text : date.toLocaleString();
  }
  function defaultSavedOfferLabel(snapshot, saveType) {
    var lang = safeString(snapshot && snapshot.outputLang || 'en').trim().toLowerCase() || 'en';
    var bits = [
      safeString(snapshot && snapshot.title).trim() || defaultBlueprintTitle(snapshot.family, snapshot.targetDuration, lang),
      safeString(snapshot && snapshot.formation).trim()
    ].filter(Boolean);
    if (!bits.length) bits.push('Programme offer');
    return bits.join(' · ');
  }
  function loadProgramOfferSourceDocForLang(lang) {
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var byLang = loadDoc('rg_programs_' + L, null);
    if (isObject(byLang) && Array.isArray(byLang.programs) && byLang.programs.length) return safeProgramsDoc(byLang);
    if (L === 'en') {
      var legacy = loadDoc('rg_programs', null);
      if (isObject(legacy) && Array.isArray(legacy.programs) && legacy.programs.length) return safeProgramsDoc(legacy);
    }
    return null;
  }
  function publicProgramDefaultForFamily(lang, family) {
    var doc = loadProgramOfferSourceDocForLang(lang);
    if (!doc) return null;
    var items = Array.isArray(doc.programs) ? doc.programs : [];
    var familyOrder = { gala: 0, italian: 1, tango: 2, borders: 3 };
    var idx = familyOrder[safeString(family).trim().toLowerCase()];
    var item = Number.isFinite(idx) ? items[idx] : null;
    if (!item) return null;
    return {
      title: safeString(item.title).trim(),
      description: safeString(item.description).trim()
    };
  }
  function normalizeProgramOfferFieldMode(mode) {
    return safeString(mode).trim().toLowerCase() === 'manual' ? 'manual' : 'auto';
  }
  function parseProgramOfferAutoContextKey(value) {
    var parts = safeString(value).trim().split('|');
    if (parts.length !== 3) return null;
    return {
      family: safeString(parts[0] || 'gala').trim().toLowerCase() || 'gala',
      targetDuration: Math.max(0, Number(parts[1]) || 30),
      lang: safeString(parts[2] || 'en').trim().toLowerCase() || 'en'
    };
  }
  function normalizeProgramOfferHeaderImageMode(mode) {
    mode = safeString(mode).trim().toLowerCase();
    if (mode === 'none' || mode === 'custom') return mode;
    return 'default';
  }
  function programOfferAutoContextKey(family, targetDuration, lang) {
    var f = safeString(family || 'gala').trim().toLowerCase() || 'gala';
    var duration = Math.max(0, Number(targetDuration) || 30);
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    return [f, duration, L].join('|');
  }
  function programOfferEnglishTextHeuristic(text, field) {
    var value = safeString(text).trim();
    if (!value) return false;
    if (field === 'title') return false;
    var matches = value.toLowerCase().match(/\b(the|and|with|for|audience|programme|program|recital|offer|designed|presenters|adaptable|balance|proposal|lyrical|contrast|language|music|musical)\b/g);
    return !!matches && matches.length >= 2;
  }
  function programOfferAutoFieldCandidates(field, family, targetDuration, langList) {
    var seen = {};
    var langs = Array.isArray(langList) && langList.length ? langList : LANGS;
    langs.forEach(function (lang) {
      var value = programOfferAutoFieldValue(field, family, targetDuration, lang, true);
      if (value) seen[value] = true;
      var legacyDefault = publicProgramDefaultForFamily(lang, family);
      if (field === 'title' && legacyDefault && legacyDefault.title) seen[safeString(legacyDefault.title).trim()] = true;
      if (field === 'description' && legacyDefault && legacyDefault.description) seen[safeString(legacyDefault.description).trim()] = true;
      var canonicalDoc = safeProgramsDoc(loadProgramsCanonicalForLang(lang));
      var familyOrder = { gala: 0, italian: 1, tango: 2, borders: 3 };
      var idx = familyOrder[safeString(family).trim().toLowerCase()];
      var canonicalItem = Number.isFinite(idx) && canonicalDoc && Array.isArray(canonicalDoc.programs) ? canonicalDoc.programs[idx] : null;
      if (field === 'title' && canonicalItem && canonicalItem.title) seen[safeString(canonicalItem.title).trim()] = true;
      if (field === 'description' && canonicalItem && canonicalItem.description) seen[safeString(canonicalItem.description).trim()] = true;
    });
    return seen;
  }
  function programOfferLooksStaleEnglish(value, field, family, targetDuration, lang) {
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var text = safeString(value).trim();
    if (!text || L === 'en') return false;
    if (programOfferAutoFieldCandidates(field, family, targetDuration, ['en'])[text]) return true;
    return programOfferEnglishTextHeuristic(text, field);
  }
  function programOfferValueIsKnownAuto(value, field, family, targetDuration) {
    var text = safeString(value).trim();
    if (!text) return false;
    return !!programOfferAutoFieldCandidates(field, family, targetDuration)[text];
  }
  function programOfferFieldBehavesAuto(value, field, family, targetDuration, lang) {
    var text = safeString(value).trim();
    if (!text) return true;
    if (programOfferValueIsKnownAuto(text, field, family, targetDuration)) return true;
    return programOfferLooksStaleEnglish(text, field, family, targetDuration, lang);
  }
  function programOfferAutoFieldValue(field, family, targetDuration, lang, skipCrossLangDetection) {
    var L = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var f = safeString(family || 'gala').trim().toLowerCase() || 'gala';
    var duration = Math.max(0, Number(targetDuration) || 30);
    var publicDefault = publicProgramDefaultForFamily(L, f);
    if (field === 'title') {
      var localizedTitleFallback = defaultBlueprintTitle(f, duration, L);
      var localizedTitle = safeString(publicDefault && publicDefault.title).trim();
      if (localizedTitle && L !== 'en' && !skipCrossLangDetection) {
        var englishTitle = safeString(publicProgramDefaultForFamily('en', f) && publicProgramDefaultForFamily('en', f).title).trim() || defaultBlueprintTitle(f, duration, 'en');
        if (localizedTitle === englishTitle || programOfferLooksStaleEnglish(localizedTitle, field, f, duration, L)) localizedTitle = '';
      }
      return localizedTitle || localizedTitleFallback;
    }
    if (field === 'description') {
      var localizedDescriptionFallback = defaultBlueprintDescription(f, L);
      var localizedDescription = safeString(publicDefault && publicDefault.description).trim();
      if (localizedDescription && L !== 'en' && !skipCrossLangDetection) {
        var englishDescription = safeString(publicProgramDefaultForFamily('en', f) && publicProgramDefaultForFamily('en', f).description).trim() || defaultBlueprintDescription(f, 'en');
        if (localizedDescription === englishDescription || programOfferLooksStaleEnglish(localizedDescription, field, f, duration, L)) localizedDescription = '';
      }
      return localizedDescription || localizedDescriptionFallback;
    }
    if (field === 'flexibleNote') return defaultBlueprintFlexibleNote(L);
    return '';
  }
  function inferProgramOfferFieldMode(field, bp, seed) {
    var explicit = safeString(bp[field + 'Mode']).trim().toLowerCase();
    var family = safeString(bp.family || (seed && seed.family) || 'gala').trim().toLowerCase() || 'gala';
    var targetDuration = Math.max(0, Number(bp.targetDuration) || Number(seed && seed.targetDuration) || 30);
    var value = safeString(bp[field]).trim();
    var currentLang = safeString(bp.outputLang || (seed && seed.outputLang) || 'en').trim().toLowerCase() || 'en';
    var autoContext = parseProgramOfferAutoContextKey(bp[field + 'AutoContext']);
    if (!value) return 'auto';
    var matchesKnownAuto = programOfferValueIsKnownAuto(value, field, family, targetDuration);
    var looksAuto = explicit === 'manual'
      ? matchesKnownAuto
      : programOfferFieldBehavesAuto(value, field, family, targetDuration, currentLang);
    if (!looksAuto && autoContext) {
      var previousAuto = programOfferAutoFieldValue(field, autoContext.family, autoContext.targetDuration, autoContext.lang);
      if (value === previousAuto) looksAuto = true;
    }
    if (explicit === 'auto') return 'auto';
    if (explicit === 'manual') return looksAuto ? 'auto' : 'manual';
    return looksAuto ? 'auto' : 'manual';
  }
  function resolveProgramOfferField(bp, field, lang) {
    var family = safeString(bp && bp.family).trim().toLowerCase() || 'gala';
    var targetDuration = Math.max(0, Number(bp && bp.targetDuration) || 30);
    var autoValue = programOfferAutoFieldValue(field, family, targetDuration, lang);
    var stored = safeString(bp && bp[field]).trim();
    if (normalizeProgramOfferFieldMode(bp && bp[field + 'Mode']) === 'manual') {
      return stored;
    }
    if (autoValue) return autoValue;
    if (stored && !programOfferLooksStaleEnglish(stored, field, family, targetDuration, lang)) return stored;
    return '';
  }
  function hydrateProgramOfferAutoFields(bp, lang) {
    ['title','description','flexibleNote'].forEach(function (field) {
      if (normalizeProgramOfferFieldMode(bp[field + 'Mode']) === 'manual') return;
      bp[field] = resolveProgramOfferField(bp, field, lang);
      bp[field + 'AutoContext'] = programOfferAutoContextKey(bp.family, bp.targetDuration, lang);
    });
  }
  function programOfferFieldStateLabel(bp, field, lang) {
    var mode = normalizeProgramOfferFieldMode(bp && bp[field + 'Mode']);
    if (mode === 'manual') return 'Custom text for this offer.';
    return 'Using the ' + safeString(lang || 'en').toUpperCase() + ' language default.';
  }
  function resolveProgramOfferHeaderImage(bp, lang) {
    var mode = normalizeProgramOfferHeaderImageMode(bp && bp.headerImageMode);
    if (mode === 'none') return '';
    if (mode === 'custom') {
      var custom = safeString(bp && bp.headerImageUrl).trim();
      return custom || '';
    }
    return programBuilderPortraitForLang(lang);
  }
  function programBuilderHistoricalSource() {
    return (typeof window !== 'undefined' && isObject(window.PROGRAM_BUILDER_HISTORICAL_IMPORT)) ? window.PROGRAM_BUILDER_HISTORICAL_IMPORT : {};
  }
  function programBuilderNormalizeKey(raw) {
    return safeString(raw)
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
  function programBuilderSlug(raw) {
    return programBuilderNormalizeKey(raw).replace(/\s+/g, '_').slice(0, 80) || 'piece';
  }
  function programBuilderUniqueStrings(list) {
    var out = [];
    (list || []).forEach(function (value) {
      var clean = safeString(value).trim();
      if (!clean) return;
      if (out.indexOf(clean) < 0) out.push(clean);
    });
    return out;
  }
  function programBuilderSplitLines(raw) {
    return safeString(raw).split('\n').map(function (line) { return safeString(line).trim(); }).filter(Boolean);
  }
  function programBuilderSuggestionSource() {
    return (typeof window !== 'undefined' && isObject(window.PROGRAM_BUILDER_OUTSIDE_REPERTOIRE)) ? window.PROGRAM_BUILDER_OUTSIDE_REPERTOIRE : {};
  }
  function repertoireDiscoverySource() {
    return (typeof window !== 'undefined' && isObject(window.REPERTOIRE_DISCOVERY_CURATED)) ? window.REPERTOIRE_DISCOVERY_CURATED : {};
  }
  function discoveryStateLabel(value) {
    var key = safeString(value).trim().toLowerCase();
    var row = REPERTOIRE_DISCOVERY_STATE_OPTIONS.find(function (option) { return option.value === key; });
    return row ? row.label : 'Unreviewed';
  }
  function discoveryProfileLabel(value) {
    return ({
      lyric_tenor: 'Lyric tenor',
      mozart_tenor: 'Mozart / classical tenor',
      belcanto_tenor: 'Belcanto tenor',
      tenor_plus_guest: 'Tenor + guest artist',
      piano_interlude: 'Piano interlude',
      sacred_lyric_tenor: 'Sacred lyric tenor',
      recital_focus: 'Recital focus'
    })[safeString(value).trim().toLowerCase()] || '';
  }
  function normalizeDiscoveryRole(value) {
    value = safeString(value).trim().toLowerCase();
    if (value === 'interlude') return 'interlude';
    return normalizePlannerDramaticRole(value);
  }
  function discoveryCombinationFromOutside(item) {
    var formations = Array.isArray(item && item.formations) ? item.formations : [];
    var normalized = formations.map(function (value) { return normalizeFormationLabel(value); }).filter(Boolean);
    if (normalized.some(function (label) { return label === 'tenor + piano'; })) return 'tenor_piano';
    if (normalized.some(function (label) { return label === 'tenor + soprano + piano'; })) return 'tenor_soprano_piano';
    if (normalized.some(function (label) { return label === 'tenor + mezzo + piano'; })) return 'tenor_mezzo_piano';
    if (normalized.some(function (label) { return label === 'tenor + baritone + piano'; })) return 'tenor_baritone_piano';
    if (normalized.some(function (label) { return label.indexOf('piano solo') >= 0; })) return 'piano_solo';
    if (normalized.some(function (label) { return label.indexOf('tenor') >= 0; })) return 'tenor_ensemble_piano';
    return '';
  }
  function discoveryProgrammeFitFromOutside(item) {
    var raw = programBuilderUniqueStrings(((item && item.fitTags) || []).concat((item && item.tags) || []).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var out = [];
    if (raw.indexOf('gala') >= 0) out.push('gala');
    if (raw.indexOf('tango') >= 0 || safeString(item && item.category).trim().toLowerCase() === 'tango') out.push('tango');
    if (raw.indexOf('sacred') >= 0) out.push('sacred');
    if (raw.indexOf('church') >= 0) out.push('church');
    if (raw.indexOf('borders') >= 0) out.push('borders');
    if (raw.indexOf('crossover') >= 0) out.push('crossover');
    if (safeString(item && item.category).trim().toLowerCase() === 'art_song') out.push('recital', 'chamber');
    if (safeString(item && item.sourceGroup).trim().toLowerCase() === 'liedernet') out.push('recital', 'chamber');
    if (safeString(item && item.sourceGroup).trim().toLowerCase() === 'imslp') out.push('recital', 'chamber');
    return programBuilderUniqueStrings(out);
  }
  function discoveryProfileFromOutside(item) {
    var raw = programBuilderUniqueStrings(((item && item.fitTags) || []).concat((item && item.tags) || []).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var out = [];
    var composer = safeString(item && item.composer).trim().toLowerCase();
    var category = safeString(item && item.category).trim().toLowerCase();
    var combination = discoveryCombinationFromOutside(item);
    if (composer.indexOf('mozart') >= 0 || raw.indexOf('classical') >= 0) out.push('mozart_tenor');
    if (composer.indexOf('bellini') >= 0 || composer.indexOf('donizetti') >= 0 || composer.indexOf('rossini') >= 0 || raw.indexOf('belcanto') >= 0) out.push('belcanto_tenor');
    if (combination === 'tenor_soprano_piano' || combination === 'tenor_mezzo_piano' || combination === 'tenor_baritone_piano' || combination === 'tenor_ensemble_piano') out.push('tenor_plus_guest');
    if (category === 'piano_solo') out.push('piano_interlude');
    if (raw.indexOf('sacred') >= 0) out.push('sacred_lyric_tenor');
    if (category === 'art_song') out.push('recital_focus');
    if (category !== 'piano_solo') out.push('lyric_tenor');
    return programBuilderUniqueStrings(out);
  }
  function discoveryFitNoteFromOutside(item, combination, programmeFit) {
    var source = safeString(item && item.sourceGroup).trim();
    var bits = [];
    if (source === 'Opera-Arias') bits.push('Opera aria or ensemble reference');
    else if (source === 'LiederNet') bits.push('Art-song / lied reference');
    else if (source === 'IMSLP') bits.push('Piano interlude reference');
    else if (source === 'Todo Tango') bits.push('Tango reference');
    if (combination === 'tenor_piano') bits.push('works for tenor + piano');
    else if (combination === 'piano_solo') bits.push('useful as a piano interlude');
    else if (combination) bits.push('guest-artist option');
    if (programmeFit.indexOf('gala') >= 0) bits.push('can support gala planning');
    if (programmeFit.indexOf('recital') >= 0) bits.push('can support recital planning');
    if (programmeFit.indexOf('tango') >= 0) bits.push('fits tango-focused discovery');
    return bits.join(' · ') || 'Curated discovery reference for future repertoire development.';
  }
  function normalizeDiscoveryOutsideRecord(raw) {
    var item = isObject(raw) ? raw : {};
    var tags = programBuilderUniqueStrings(((item.fitTags || []).concat(item.tags || [])).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var combination = discoveryCombinationFromOutside(item);
    var programmeFit = discoveryProgrammeFitFromOutside(item);
    return normalizeDiscoveryRecord({
      id: 'outside_' + programBuilderSlug([item.composer, item.title, item.work].filter(Boolean).join(' ')),
      title: item.title,
      composer: item.composer,
      work: item.work,
      language: item.language,
      type: safeString(item.type).trim().toLowerCase() === 'lied' ? 'song' : safeString(item.type).trim().toLowerCase().replace('piano-solo', 'piano_solo'),
      category: item.category,
      voiceCategory: item.voiceCategory,
      primaryVoice: item.primaryVoice,
      pairedVoices: item.pairedVoices || [],
      formations: item.formations || [],
      vocalCombination: combination,
      profileFocus: discoveryProfileFromOutside(item),
      programmeFit: programmeFit,
      dramaticRole: item.dramaticRole || '',
      approximateDurationMin: item.approximateDurationMin || item.durationMin || 0,
      readinessIntent: safeString(item.readiness).trim().toLowerCase() === 'ready' ? 'worth_studying' : 'ideas_only',
      source: safeString(item.sourceGroup).trim() || 'Curated external-style source',
      sourceNote: safeString(item.suggestionGroup).trim() || 'Imported from the broader discovery source layer.',
      tags: tags,
      fitNote: discoveryFitNoteFromOutside(item, combination, programmeFit),
      cautionNote: safeString(item.notes).trim() || 'Verify key, cut, edition, and practical fit before import.',
      audienceAppeal: safeString(item.audienceAppeal).trim().toLowerCase(),
      styleFamilies: plannerPieceStyleFamilies(normalizePlannerItemRecord(item, 0))
    });
  }
  function discoveryTypeFromPlannerLike(item) {
    var type = safeString(item && item.type).trim().toLowerCase();
    var category = safeString(item && item.category).trim().toLowerCase();
    var tags = []
      .concat(Array.isArray(item && item.tags) ? item.tags : [])
      .concat(Array.isArray(item && item.fitTags) ? item.fitTags : [])
      .map(function (tag) { return safeString(tag).trim().toLowerCase(); })
      .filter(Boolean);
    if (category === 'trio') return 'trio';
    if (category === 'quartet' || category === 'ensemble') return 'quartet';
    if (category === 'duet') return 'duet';
    if (category === 'piano_solo' || type === 'piano-solo') return 'piano_solo';
    if (category === 'tango' || type === 'tango') return 'tango';
    if (type === 'sacred' || tags.indexOf('sacred') >= 0 || tags.indexOf('church') >= 0 || tags.indexOf('christmas') >= 0) return 'sacred';
    if (category === 'art_song' || type === 'lied' || type === 'song' || type === 'canzone' || type === 'operetta') return 'song';
    if (category === 'aria' || type === 'aria') return 'aria';
    return type || category || 'song';
  }
  function discoveryHistoricalSourceLabel(item) {
    if (safeString(item && item.performanceStatus).trim().toLowerCase() === 'performed') return 'Historical concert archive';
    return 'Historical repertoire archive';
  }
  function discoveryFitNoteFromHistorical(item, combination, programmeFit) {
    var bits = ['Historical repertoire reference'];
    if (safeString(item && item.performanceStatus).trim().toLowerCase() === 'performed' && Array.isArray(item && item.performedIn) && item.performedIn.length) {
      bits.push('appears in past concert material');
    }
    if (combination === 'tenor_piano') bits.push('works for tenor + piano');
    else if (combination === 'piano_solo') bits.push('useful as a piano interlude');
    else if (combination) bits.push('guest-artist option');
    if (programmeFit.indexOf('gala') >= 0) bits.push('can support gala planning');
    if (programmeFit.indexOf('recital') >= 0) bits.push('can support recital planning');
    if (programmeFit.indexOf('church') >= 0 || programmeFit.indexOf('sacred') >= 0) bits.push('useful for sacred or church contexts');
    if (programmeFit.indexOf('tango') >= 0) bits.push('fits tango-focused discovery');
    return bits.join(' · ');
  }
  function normalizeDiscoveryHistoricalRecord(raw) {
    var seeded = normalizePlannerItemRecord(raw, 0);
    var combination = discoveryCombinationFromOutside(seeded);
    var programmeFit = discoveryProgrammeFitFromOutside(seeded);
    var historicalTags = programBuilderUniqueStrings((seeded.tags || []).concat(seeded.fitTags || []).concat(['historical_archive']));
    var sourceLabel = discoveryHistoricalSourceLabel(seeded);
    return normalizeDiscoveryRecord({
      id: 'historical_' + programBuilderSlug([seeded.composer, seeded.title, seeded.work].filter(Boolean).join(' ')),
      title: seeded.title,
      composer: seeded.composer,
      work: seeded.work,
      language: seeded.language,
      type: discoveryTypeFromPlannerLike(seeded),
      category: seeded.category,
      voiceCategory: seeded.voiceCategory,
      primaryVoice: seeded.primaryVoice,
      pairedVoices: seeded.pairedVoices || [],
      formations: seeded.formations || [],
      vocalCombination: combination,
      profileFocus: discoveryProfileFromOutside(seeded),
      programmeFit: programmeFit,
      dramaticRole: seeded.dramaticRole,
      approximateDurationMin: seeded.approximateDurationMin || seeded.durationMin || 0,
      readinessIntent: seeded.reviewStatus === 'manual_review' ? 'ideas_only' : (safeString(seeded.readiness).trim().toLowerCase() === 'ready' ? 'worth_studying' : 'good_candidate'),
      source: sourceLabel,
      sourceNote: safeString(seeded.performedIn && seeded.performedIn[0]).trim() || 'Imported from the historical repertoire archive.',
      tags: historicalTags,
      fitNote: discoveryFitNoteFromHistorical(seeded, combination, programmeFit),
      cautionNote: safeString(seeded.notes).trim() || 'Verify edition, key, cut, and current practical fit before import.',
      audienceAppeal: safeString(seeded.audienceAppeal).trim().toLowerCase(),
      styleFamilies: plannerPieceStyleFamilies(seeded)
    });
  }
  function normalizeDiscoveryRecord(raw) {
    var item = isObject(raw) ? raw : {};
    var tags = programBuilderUniqueStrings((Array.isArray(item.tags) ? item.tags : safeString(item.tags).split(',')).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var programmeFit = programBuilderUniqueStrings((Array.isArray(item.programmeFit) ? item.programmeFit : safeString(item.programmeFit).split(',')).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var profileFocus = programBuilderUniqueStrings((Array.isArray(item.profileFocus) ? item.profileFocus : safeString(item.profileFocus).split(',')).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var styleFamilies = programBuilderUniqueStrings((Array.isArray(item.styleFamilies) ? item.styleFamilies : safeString(item.styleFamilies).split(',')).map(function (tag) {
      return normalizeProgramOfferStyleFocus(safeString(tag).trim().toLowerCase());
    }).filter(function (tag) { return tag && tag !== 'mixed'; }));
    return {
      id: safeString(item.id || programBuilderSlug([item.composer, item.title].filter(Boolean).join(' '))).trim(),
      title: safeString(item.title).trim(),
      composer: safeString(item.composer).trim(),
      work: safeString(item.work).trim(),
      language: safeString(item.language).trim().toUpperCase(),
      type: safeString(item.type).trim().toLowerCase(),
      category: safeString(item.category).trim().toLowerCase(),
      voiceCategory: safeString(item.voiceCategory).trim().toLowerCase(),
      primaryVoice: safeString(item.primaryVoice).trim().toLowerCase(),
      pairedVoices: normalizePlannerVoiceList(item.pairedVoices || []),
      formations: (Array.isArray(item.formations) ? item.formations : safeString(item.formations).split('\n')).map(function (value) { return safeString(value).trim(); }).filter(Boolean),
      vocalCombination: safeString(item.vocalCombination).trim().toLowerCase(),
      profileFocus: profileFocus,
      programmeFit: programmeFit,
      dramaticRole: normalizeDiscoveryRole(item.dramaticRole),
      approximateDurationMin: Math.max(0, Number(item.approximateDurationMin) || Number(item.durationMin) || 0),
      readinessIntent: (function (value) {
        value = safeString(value || 'ideas_only').trim().toLowerCase();
        return ['ideas_only', 'good_candidate', 'worth_studying'].indexOf(value) >= 0 ? value : 'ideas_only';
      })(item.readinessIntent),
      source: safeString(item.source).trim(),
      sourceNote: safeString(item.sourceNote).trim(),
      tags: tags,
      fitNote: safeString(item.fitNote).trim(),
      cautionNote: safeString(item.cautionNote).trim(),
      audienceAppeal: safeString(item.audienceAppeal).trim().toLowerCase(),
      styleFamilies: styleFamilies
    };
  }
  function discoveryDatasetItems() {
    var src = repertoireDiscoverySource();
    return (Array.isArray(src.items) ? src.items : []).map(normalizeDiscoveryRecord).filter(function (item) {
      return !!safeString(item.id).trim();
    });
  }
  function discoveryOutsideDatasetItems() {
    var src = programBuilderSuggestionSource();
    return (Array.isArray(src.items) ? src.items : []).map(normalizeDiscoveryOutsideRecord).filter(function (item) {
      return !!safeString(item.id).trim();
    });
  }
  function discoveryHistoricalDatasetItems() {
    return makeHistoricalRepertoireImport().map(normalizeDiscoveryHistoricalRecord).filter(function (item) {
      return !!safeString(item.id).trim();
    });
  }
  function makeDiscoverySeed() {
    return { meta: { datasetVersion: Math.max(0, Number(repertoireDiscoverySource().version) || 1) }, records: [] };
  }
  function safeDiscoveryDoc(raw) {
    var doc = isObject(raw) ? clone(raw) : {};
    doc.meta = isObject(doc.meta) ? doc.meta : {};
    doc.meta.datasetVersion = Math.max(0, Number(doc.meta.datasetVersion) || Math.max(0, Number(repertoireDiscoverySource().version) || 1));
    if (!Array.isArray(doc.records)) doc.records = [];
    doc.records = doc.records.filter(isObject).map(function (row) {
      var stateValue = safeString(row.state).trim().toLowerCase();
      return {
        id: safeString(row.id).trim(),
        state: REPERTOIRE_DISCOVERY_STATE_OPTIONS.some(function (option) { return option.value === stateValue; }) ? stateValue : '',
        editorialNotes: safeString(row.editorialNotes),
        importedItemId: safeString(row.importedItemId).trim(),
        importedAt: safeString(row.importedAt).trim(),
        updatedAt: safeString(row.updatedAt).trim()
      };
    }).filter(function (row) { return !!row.id; });
    return doc;
  }
  function discoveryRecordById(id) {
    id = safeString(id).trim();
    if (!id) return null;
    var records = (state.discoveryDoc && Array.isArray(state.discoveryDoc.records)) ? state.discoveryDoc.records : [];
    return records.find(function (row) { return safeString(row.id).trim() === id; }) || null;
  }
  function ensureDiscoveryRecord(id) {
    state.discoveryDoc = safeDiscoveryDoc(state.discoveryDoc);
    var existing = discoveryRecordById(id);
    if (existing) return existing;
    var row = { id: safeString(id).trim(), state: '', editorialNotes: '', importedItemId: '', importedAt: '', updatedAt: '' };
    state.discoveryDoc.records.push(row);
    return row;
  }
  function discoveryItemsMerged() {
    var allItems = [];
    var seen = {};
    discoveryDatasetItems().concat(discoveryOutsideDatasetItems()).concat(discoveryHistoricalDatasetItems()).forEach(function (item) {
      var key = [programBuilderNormalizeKey(item.title), programBuilderNormalizeKey(item.composer), programBuilderNormalizeKey(item.work)].join('|');
      if (seen[key]) return;
      seen[key] = true;
      allItems.push(item);
    });
    return allItems.map(function (item) {
      var record = discoveryRecordById(item.id) || {};
      return Object.assign({}, item, {
        editorialState: safeString(record.state).trim().toLowerCase(),
        editorialNotes: safeString(record.editorialNotes),
        importedItemId: safeString(record.importedItemId).trim(),
        importedAt: safeString(record.importedAt).trim(),
        stateLabel: discoveryStateLabel(record.state)
      });
    });
  }
  function discoveryStateCounts(items) {
    var counts = { total: (items || []).length, unreviewed: 0 };
    REPERTOIRE_DISCOVERY_STATE_OPTIONS.forEach(function (option) { counts[option.value] = 0; });
    (items || []).forEach(function (item) {
      var key = safeString(item.editorialState).trim().toLowerCase();
      if (key && hasOwn(counts, key)) counts[key] += 1;
      else counts.unreviewed += 1;
    });
    return counts;
  }
  function outreachStatusLabel(value) {
    var key = safeString(value).trim().toLowerCase();
    var row = OUTREACH_STATUS_OPTIONS.find(function (option) { return option.value === key; });
    return row ? row.label : 'Idea';
  }
  function outreachStatusClass(value) {
    return ({
      idea: 'outreach-status--idea',
      to_contact: 'outreach-status--to-contact',
      sent: 'outreach-status--sent',
      replied: 'outreach-status--replied',
      negotiating: 'outreach-status--negotiating',
      confirmed: 'outreach-status--confirmed',
      declined: 'outreach-status--declined',
      archived: 'outreach-status--archived'
    })[safeString(value).trim().toLowerCase()] || 'outreach-status--idea';
  }
  function outreachLanguageLabel(value) {
    var key = safeString(value).trim().toLowerCase();
    return ({ en: 'English', de: 'German', es: 'Spanish', it: 'Italian', fr: 'French' })[key] || 'Flexible';
  }
  function outreachDateValue(raw) {
    var value = safeString(raw).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    var m = value.match(/^(\d{2})[.\/-](\d{2})[.\/-](\d{4})$/);
    if (m) {
      var iso = m[3] + '-' + m[2] + '-' + m[1];
      if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    }
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return value.slice(0, 10);
    return '';
  }
  function outreachFormatLocalYmd(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    var y = String(date.getFullYear());
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }
  function outreachLocalDatePlusDays(days) {
    var base = new Date();
    base.setHours(12, 0, 0, 0);
    base.setDate(base.getDate() + Math.max(0, Number(days) || 0));
    return outreachFormatLocalYmd(base);
  }
  function outreachTodayIso() {
    return outreachFormatLocalYmd(new Date());
  }
  function outreachParseDate(raw) {
    var value = outreachDateValue(raw);
    if (!value) return null;
    var date = new Date(value + 'T00:00:00');
    return Number.isNaN(date.getTime()) ? null : date;
  }
  function outreachDaysUntil(raw) {
    var date = outreachParseDate(raw);
    if (!date) return null;
    var today = outreachParseDate(outreachTodayIso());
    if (!today) return null;
    return Math.round((date.getTime() - today.getTime()) / 86400000);
  }
  function outreachFormatDate(raw) {
    var date = outreachParseDate(raw);
    if (!date) return '';
    try {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (err) {
      return raw;
    }
  }
  function outreachStatusClosed(value) {
    value = safeString(value).trim().toLowerCase();
    return value === 'confirmed' || value === 'declined' || value === 'archived';
  }
  function normalizeOutreachHistoryEntry(raw, idx) {
    var row = isObject(raw) ? clone(raw) : {};
    var type = safeString(row.type || 'follow_up_made').trim().toLowerCase();
    var eventDate = outreachDateValue(row.eventDate || row.date) || outreachDateValue(row.createdAt) || outreachTodayIso();
    return {
      id: safeString(row.id || ('outreach_history_' + String(idx + 1))).trim(),
      type: OUTREACH_HISTORY_EVENT_OPTIONS.some(function (option) { return option.value === type; }) ? type : 'follow_up_made',
      eventDate: eventDate,
      note: safeString(row.note).trim(),
      createdAt: safeString(row.createdAt || '').trim()
    };
  }
  function normalizeOutreachRecord(raw, idx) {
    var row = isObject(raw) ? clone(raw) : {};
    var status = safeString(row.status || 'idea').trim().toLowerCase();
    var fitTags = programBuilderUniqueStrings((Array.isArray(row.fitTags) ? row.fitTags : safeString(row.fitTags).split(',')).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    var linkedOfferIds = programBuilderUniqueStrings((Array.isArray(row.linkedOfferIds) ? row.linkedOfferIds : safeString(row.linkedOfferIds).split(',')).map(function (id) {
      return safeString(id).trim();
    }).filter(Boolean));
    var history = (Array.isArray(row.history) ? row.history : []).map(normalizeOutreachHistoryEntry).sort(function (a, b) {
      var aDate = outreachDateValue(a.eventDate);
      var bDate = outreachDateValue(b.eventDate);
      if (aDate && bDate && aDate !== bDate) return bDate.localeCompare(aDate);
      return safeString(b.createdAt).localeCompare(safeString(a.createdAt));
    });
    var historySeen = {};
    history = history.filter(function (entry) {
      var note = safeString(entry && entry.note).trim();
      if (note) return true;
      var key = [
        safeString(entry && entry.type).trim().toLowerCase(),
        outreachDateValue(entry && entry.eventDate),
        ''
      ].join('|');
      if (historySeen[key]) return false;
      historySeen[key] = true;
      return true;
    });
    var venueName = safeString(row.venueName).trim();
    var city = safeString(row.city).trim();
    var createdAt = safeString(row.createdAt || row.updatedAt).trim();
    if (!history.length && createdAt) {
      history = [normalizeOutreachHistoryEntry({ type: 'created', eventDate: createdAt.slice(0, 10), note: 'Record created.', createdAt: createdAt }, 0)];
    }
    return {
      id: safeString(row.id || ('outreach_' + programBuilderSlug([venueName, city || String(idx + 1)].filter(Boolean).join(' ')))).trim(),
      venueName: venueName,
      city: city,
      country: safeString(row.country).trim(),
      venueType: safeString(row.venueType).trim(),
      contactName: safeString(row.contactName).trim(),
      contactEmail: safeString(row.contactEmail).trim(),
      outreachLanguage: (function (value) {
        value = safeString(value || 'en').trim().toLowerCase();
        return ['en', 'de', 'es', 'it', 'fr'].indexOf(value) >= 0 ? value : 'en';
      })(row.outreachLanguage),
      fitTags: fitTags,
      plannedRepertoire: safeString(row.plannedRepertoire || row.repertoirePlan || ''),
      notes: safeString(row.notes),
      messageSent: safeString(row.messageSent || row.message || row.lastMessage || ''),
      cacheProposed: safeString(row.cacheProposed || row.feeProposed || ''),
      cacheNegotiated: safeString(row.cacheNegotiated || row.feeNegotiated || ''),
      status: OUTREACH_STATUS_OPTIONS.some(function (option) { return option.value === status; }) ? status : 'idea',
      lastContactDate: outreachDateValue(row.lastContactDate),
      nextFollowUpDate: outreachDateValue(row.nextFollowUpDate),
      linkedOfferIds: linkedOfferIds,
      history: history,
      createdAt: createdAt,
      updatedAt: safeString(row.updatedAt || row.createdAt).trim()
    };
  }
  function makeOutreachSeed() {
    return { meta: { version: 1 }, records: [] };
  }
  function safeOutreachDoc(raw) {
    var doc = isObject(raw) ? clone(raw) : {};
    doc.meta = isObject(doc.meta) ? doc.meta : {};
    doc.meta.version = Math.max(1, Number(doc.meta.version) || 1);
    if (!Array.isArray(doc.records)) doc.records = [];
    doc.records = doc.records.filter(isObject).map(normalizeOutreachRecord).filter(function (row) { return !!row.id; });
    return doc;
  }
  function outreachRecordById(id) {
    id = safeString(id).trim();
    if (!id) return null;
    var records = (state.outreachDoc && Array.isArray(state.outreachDoc.records)) ? state.outreachDoc.records : [];
    return records.find(function (row) { return safeString(row.id).trim() === id; }) || null;
  }
  function ensureOutreachRecord(id) {
    state.outreachDoc = safeOutreachDoc(state.outreachDoc);
    var existing = outreachRecordById(id);
    if (existing) return existing;
    var record = normalizeOutreachRecord({ id: id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, state.outreachDoc.records.length);
    state.outreachDoc.records.push(record);
    return record;
  }
  function outreachSavedOfferRows() {
    var offers = (state.blueprintDoc && Array.isArray(state.blueprintDoc.savedOffers)) ? state.blueprintDoc.savedOffers : [];
    var seen = {};
    return offers.filter(function (offer) {
      var id = safeString(offer && offer.id).trim();
      if (!id || seen[id]) return false;
      seen[id] = true;
      return true;
    }).slice().sort(function (a, b) {
      return safeString(savedOfferDisplayLabel(a)).localeCompare(safeString(savedOfferDisplayLabel(b)));
    });
  }
  function outreachLinkedOffers(record) {
    return (Array.isArray(record && record.linkedOfferIds) ? record.linkedOfferIds : []).map(function (id) {
      return findSavedOfferById(id);
    }).filter(Boolean);
  }
  function outreachFollowupState(record) {
    var status = safeString(record && record.status).trim().toLowerCase();
    var nextDate = outreachDateValue(record && record.nextFollowUpDate);
    if (outreachStatusClosed(status)) {
      return { weight: 5, className: 'outreach-followup--calm', label: outreachStatusLabel(status) };
    }
    if (!nextDate) {
      return { weight: 2, className: 'outreach-followup--missing', label: 'Set next follow-up' };
    }
    var days = outreachDaysUntil(nextDate);
    if (days == null) return { weight: 4, className: 'outreach-followup--calm', label: outreachFormatDate(nextDate) };
    if (days < 0) return { weight: 0, className: 'outreach-followup--overdue', label: 'Overdue since ' + outreachFormatDate(nextDate) };
    if (days === 0) return { weight: 1, className: 'outreach-followup--today', label: 'Follow up today' };
    if (days <= 14) return { weight: 3, className: 'outreach-followup--upcoming', label: 'Follow up by ' + outreachFormatDate(nextDate) };
    return { weight: 4, className: 'outreach-followup--calm', label: 'Next follow-up ' + outreachFormatDate(nextDate) };
  }
  function outreachFilteredRecords() {
    var records = (state.outreachDoc && Array.isArray(state.outreachDoc.records)) ? state.outreachDoc.records.slice() : [];
    var search = safeString(state.outreachSearch).trim().toLowerCase();
    var statusFilter = safeString(state.outreachStatusFilter || 'all').trim().toLowerCase() || 'all';
    var followupFilter = safeString(state.outreachFollowupFilter || 'all').trim().toLowerCase() || 'all';
    var quickFilter = safeString(state.outreachQuickFilter || 'all').trim().toLowerCase() || 'all';
    return records.filter(function (record) {
      var follow = outreachFollowupState(record);
      var hay = [
        record.venueName, record.city, record.country, record.venueType, record.contactName, record.contactEmail, record.notes, (record.fitTags || []).join(' ')
      ].join(' ').toLowerCase();
      if (search && hay.indexOf(search) < 0) return false;
      if (statusFilter !== 'all' && safeString(record.status).trim().toLowerCase() !== statusFilter) return false;
      if (followupFilter === 'overdue' && !(follow.weight === 0)) return false;
      if (followupFilter === 'today' && !(follow.weight === 1)) return false;
      if (followupFilter === 'missing' && !(follow.weight === 2)) return false;
      if (followupFilter === 'upcoming' && !(follow.weight === 3)) return false;
      if (followupFilter === 'active' && outreachStatusClosed(record.status)) return false;
      if (followupFilter === 'closed' && !outreachStatusClosed(record.status)) return false;
      if (quickFilter === 'missing-message' && !!safeString(record.messageSent).trim()) return false;
      if (quickFilter === 'missing-repertoire' && !!safeString(record.plannedRepertoire).trim()) return false;
      if (quickFilter === 'no-linked-offer' && outreachLinkedOfferCount(record) > 0) return false;
      return true;
    }).sort(function (a, b) {
      function outreachUrgencySortRank(record) {
        var follow = outreachFollowupState(record);
        if (follow.weight === 0) return 0;
        if (follow.weight === 1) return 1;
        if (follow.weight === 3) return 2;
        if (follow.weight === 2) return 3;
        return 4;
      }
      var rankA = outreachUrgencySortRank(a);
      var rankB = outreachUrgencySortRank(b);
      if (rankA !== rankB) return rankA - rankB;
      var dateA = outreachDateValue(a.nextFollowUpDate);
      var dateB = outreachDateValue(b.nextFollowUpDate);
      if (dateA && dateB && dateA !== dateB) return dateA.localeCompare(dateB);
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;
      var lastA = outreachDateValue(a.lastContactDate);
      var lastB = outreachDateValue(b.lastContactDate);
      if (lastA && lastB && lastA !== lastB) return lastA.localeCompare(lastB);
      if (lastA && !lastB) return -1;
      if (!lastA && lastB) return 1;
      return safeString(a.venueName).localeCompare(safeString(b.venueName));
    });
  }
  function outreachContactSummary(record) {
    var bits = [record.contactName, record.contactEmail, record.contactPhone].filter(Boolean);
    return bits.length ? bits.join(' · ') : 'Add contact details';
  }
  function outreachStatusOpen(value) {
    return !outreachStatusClosed(value);
  }
  function outreachDateShortLabel(raw, fallback) {
    var value = outreachDateValue(raw);
    return value ? outreachFormatDate(value) : (fallback || 'Not set');
  }
  function outreachHistoryEventLabel(value) {
    var key = safeString(value).trim().toLowerCase();
    var row = OUTREACH_HISTORY_EVENT_OPTIONS.find(function (option) { return option.value === key; });
    return row ? row.label : 'Follow-up made';
  }
  function outreachHistoryTypeClass(value) {
    var key = safeString(value).trim().toLowerCase();
    return ({
      created: 'outreach-history__badge--calm',
      first_contact_sent: 'outreach-history__badge--info',
      replied: 'outreach-history__badge--info',
      follow_up_made: 'outreach-history__badge--info',
      negotiation_note: 'outreach-history__badge--gold',
      tentative_date_discussed: 'outreach-history__badge--gold',
      confirmed: 'outreach-history__badge--ok',
      declined: 'outreach-history__badge--err',
      archived: 'outreach-history__badge--calm'
    })[key] || 'outreach-history__badge--info';
  }
  function outreachHistoryQuickButtonLabel(type) {
    return ({
      first_contact_sent: 'Log first send',
      replied: 'Log reply',
      follow_up_made: 'Log follow-up',
      negotiation_note: 'Log negotiation',
      confirmed: 'Log confirmed',
      declined: 'Log declined'
    })[safeString(type).trim().toLowerCase()] || 'Add entry';
  }
  function outreachNextHistoryId(record) {
    var total = Array.isArray(record && record.history) ? record.history.length : 0;
    return 'outreach_history_' + programBuilderSlug([record && record.id, String(total + 1), Date.now()].join(' '));
  }
  function outreachAddHistoryEntry(record, type, eventDate, note) {
    if (!record) return false;
    if (!Array.isArray(record.history)) record.history = [];
    var normalizedType = safeString(type).trim().toLowerCase();
    var normalizedDate = outreachDateValue(eventDate) || outreachTodayIso();
    var normalizedNote = safeString(note).trim();
    var alreadyExists = record.history.some(function (row) {
      return safeString(row && row.type).trim().toLowerCase() === normalizedType &&
        outreachDateValue(row && row.eventDate) === normalizedDate &&
        safeString(row && row.note).trim() === normalizedNote;
    });
    if (alreadyExists) return false;
    var entry = normalizeOutreachHistoryEntry({
      id: outreachNextHistoryId(record),
      type: normalizedType,
      eventDate: normalizedDate,
      note: normalizedNote,
      createdAt: new Date().toISOString()
    }, record.history.length);
    record.history.unshift(entry);
    record.history = record.history.slice().sort(function (a, b) {
      var aDate = outreachDateValue(a.eventDate);
      var bDate = outreachDateValue(b.eventDate);
      if (aDate && bDate && aDate !== bDate) return bDate.localeCompare(aDate);
      return safeString(b.createdAt).localeCompare(safeString(a.createdAt));
    });
    if (entry.type === 'first_contact_sent') {
      record.status = 'sent';
      record.lastContactDate = entry.eventDate;
    } else if (entry.type === 'replied') {
      record.status = 'replied';
      record.lastContactDate = entry.eventDate;
    } else if (entry.type === 'follow_up_made') {
      record.lastContactDate = entry.eventDate;
    } else if (entry.type === 'negotiation_note' || entry.type === 'tentative_date_discussed') {
      record.status = 'negotiating';
      record.lastContactDate = entry.eventDate;
    } else if (entry.type === 'confirmed') {
      record.status = 'confirmed';
      record.lastContactDate = entry.eventDate;
      record.nextFollowUpDate = '';
    } else if (entry.type === 'declined') {
      record.status = 'declined';
      record.lastContactDate = entry.eventDate;
      record.nextFollowUpDate = '';
    } else if (entry.type === 'archived') {
      record.status = 'archived';
      record.nextFollowUpDate = '';
    }
    record.updatedAt = new Date().toISOString();
    return true;
  }
  function outreachHistoryListHtml(record) {
    var items = Array.isArray(record && record.history) ? record.history : [];
    if (!items.length) {
      return '<div class="empty-state">No relationship history yet. Add a quick event to keep the outreach story visible.</div>';
    }
    var latest = items[0];
    var latestSummary = '<div class="outreach-history__latest">' +
      '<strong>Latest: ' + escapeHtml(outreachHistoryEventLabel(latest.type)) + '</strong> ' +
      '<span class="muted">(' + escapeHtml(outreachDateShortLabel(latest.eventDate, 'no date')) + ')</span>' +
      (latest.note ? '<br><span class="muted">' + escapeHtml(latest.note.substring(0, 80)) + (latest.note.length > 80 ? '...' : '') + '</span>' : '') +
      '</div>';
    return '<div class="outreach-history">' + latestSummary + items.map(function (entry, idx) {
      var isLatest = idx === 0;
      return '<div class="outreach-history__item' + (isLatest ? ' outreach-history__item--latest' : '') + '">' +
        '<div class="outreach-history__date">' + escapeHtml(outreachDateShortLabel(entry.eventDate, 'Date not set')) + '</div>' +
        '<div class="outreach-history__body">' +
          '<div class="outreach-history__head"><span class="item-badge ' + escapeAttr(outreachHistoryTypeClass(entry.type)) + '">' + escapeHtml(outreachHistoryEventLabel(entry.type)) + '</span></div>' +
          (entry.note ? '<p>' + escapeHtml(entry.note) + '</p>' : '<p class="muted">No note added.</p>') +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  }
  function outreachFitPreview(record, limit) {
    return (record.fitTags || []).slice(0, Math.max(0, Number(limit) || 0));
  }
  function outreachShortNote(record, limit) {
    var note = safeString(record && record.notes).trim();
    var max = Math.max(0, Number(limit) || 0);
    if (!note || !max) return '';
    return note.length > max ? (note.slice(0, max) + '…') : note;
  }
  function outreachDueThisWeek(record) {
    if (!outreachStatusOpen(record && record.status)) return false;
    var nextDate = outreachDateValue(record && record.nextFollowUpDate);
    if (!nextDate) return true;
    var days = outreachDaysUntil(nextDate);
    return days != null && days <= 7;
  }
  function outreachLinkedOfferCount(record) {
    return Array.isArray(record && record.linkedOfferIds) ? record.linkedOfferIds.length : 0;
  }
  function outreachSummaryTile(label, value, tone, sublabel) {
    return '<div class="outreach-summary-tile outreach-summary-tile--' + escapeAttr(tone || 'default') + '">' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<strong>' + escapeHtml(String(value)) + '</strong>' +
      (sublabel ? '<small>' + escapeHtml(sublabel) + '</small>' : '') +
    '</div>';
  }
  function outreachStatusBadge(record) {
    return '<span class="pill outreach-status-pill ' + escapeAttr(outreachStatusClass(record && record.status)) + '">' + escapeHtml(outreachStatusLabel(record && record.status)) + '</span>';
  }
  function outreachFollowupBadge(record) {
    var follow = outreachFollowupState(record);
    return '<span class="pill info outreach-followup-pill ' + escapeAttr(follow.className) + '">' + escapeHtml(follow.label) + '</span>';
  }
  function outreachDaysSince(raw) {
    var date = outreachParseDate(raw);
    var today = outreachParseDate(outreachTodayIso());
    if (!date || !today) return null;
    return Math.round((today.getTime() - date.getTime()) / 86400000);
  }
  function outreachRecentContactContext(record) {
    var last = outreachDateValue(record && record.lastContactDate);
    if (!last) return 'No recent contact logged';
    var daysSince = outreachDaysSince(last);
    if (daysSince == null) return 'Last contact ' + outreachFormatDate(last);
    if (daysSince <= 0) return 'Last contact today';
    if (daysSince === 1) return 'Last contact yesterday';
    if (daysSince <= 7) return 'Last contact ' + String(daysSince) + ' days ago';
    if (daysSince <= 30) return 'Last contact this month';
    return 'Last contact ' + outreachFormatDate(last);
  }
  function outreachUrgencySummary(record) {
    var follow = outreachFollowupState(record);
    var nextDate = outreachDateValue(record && record.nextFollowUpDate);
    var days = nextDate ? outreachDaysUntil(nextDate) : null;
    if (follow.weight === 0) return { className: 'outreach-urgency--overdue', label: 'Urgent: overdue' };
    if (follow.weight === 1) return { className: 'outreach-urgency--today', label: 'Urgent: today' };
    if (follow.weight === 2) return { className: 'outreach-urgency--missing', label: 'Set follow-up date' };
    if (follow.weight === 3) {
      if (days != null && days <= 7) return { className: 'outreach-urgency--soon', label: 'Due this week' };
      return { className: 'outreach-urgency--soon', label: 'Due soon' };
    }
    return { className: 'outreach-urgency--calm', label: 'No urgent action' };
  }
  function outreachOfferBadge(record) {
    var count = outreachLinkedOfferCount(record);
    return '<span class="item-badge">' + escapeHtml(count ? (String(count) + ' linked offer' + (count === 1 ? '' : 's')) : 'No linked offer yet') + '</span>';
  }
  function outreachSnapshotSignals(record) {
    var messageSent = safeString(record && record.messageSent).trim();
    var hasMessage = !!messageSent;
    var planned = safeString(record && record.plannedRepertoire).trim();
    var hasPlanned = !!planned;
    var linkedCount = outreachLinkedOfferCount(record);
    return [
      '<span class="item-badge outreach-signal ' + (hasMessage ? 'outreach-signal--ok' : 'outreach-signal--warn') + '">' + escapeHtml(hasMessage ? 'Message sent' : 'No message yet') + '</span>',
      '<span class="item-badge outreach-signal ' + (hasPlanned ? 'outreach-signal--ok' : 'outreach-signal--warn') + '">' + escapeHtml(hasPlanned ? 'Repertoire planned' : 'No repertoire') + '</span>',
      '<span class="item-badge outreach-signal ' + (linkedCount ? 'outreach-signal--ok' : 'outreach-signal--calm') + '">' + escapeHtml(linkedCount ? (String(linkedCount) + ' offer' + (linkedCount === 1 ? '' : 's') + ' linked') : 'No offer linked') + '</span>'
    ].join('');
  }
  function outreachStatusFilterLabel(value) {
    var key = safeString(value || 'all').trim().toLowerCase() || 'all';
    if (key === 'all') return 'All statuses';
    return outreachStatusLabel(key);
  }
  function outreachFollowupFilterLabel(value) {
    var key = safeString(value || 'all').trim().toLowerCase() || 'all';
    return ({
      all: 'All records',
      overdue: 'Overdue',
      today: 'Due today',
      missing: 'No follow-up date',
      upcoming: 'Upcoming (within 14 days)',
      active: 'Active only',
      closed: 'Closed only'
    })[key] || 'All records';
  }
  function outreachCurrentFilterContext() {
    var bits = [];
    var search = safeString(state.outreachSearch).trim();
    bits.push('Search: ' + (search || 'Any'));
    bits.push('Status: ' + outreachStatusFilterLabel(state.outreachStatusFilter));
    bits.push('Follow-up: ' + outreachFollowupFilterLabel(state.outreachFollowupFilter));
    return bits;
  }
  function outreachSyncQuickFilterButtons() {
    var quickFilter = safeString(state.outreachQuickFilter || 'all').trim().toLowerCase() || 'all';
    if (!$('outreach-quick-filters')) return;
    var records = (state.outreachDoc && Array.isArray(state.outreachDoc.records)) ? state.outreachDoc.records.slice() : [];
    var search = safeString(state.outreachSearch).trim().toLowerCase();
    var statusFilter = safeString(state.outreachStatusFilter || 'all').trim().toLowerCase() || 'all';
    var followupFilter = safeString(state.outreachFollowupFilter || 'all').trim().toLowerCase() || 'all';
    var scoped = records.filter(function (record) {
      var follow = outreachFollowupState(record);
      var hay = [
        record.venueName, record.city, record.country, record.venueType, record.contactName, record.contactEmail, record.notes, (record.fitTags || []).join(' ')
      ].join(' ').toLowerCase();
      if (search && hay.indexOf(search) < 0) return false;
      if (statusFilter !== 'all' && safeString(record.status).trim().toLowerCase() !== statusFilter) return false;
      if (followupFilter === 'overdue' && !(follow.weight === 0)) return false;
      if (followupFilter === 'today' && !(follow.weight === 1)) return false;
      if (followupFilter === 'missing' && !(follow.weight === 2)) return false;
      if (followupFilter === 'upcoming' && !(follow.weight === 3)) return false;
      if (followupFilter === 'active' && outreachStatusClosed(record.status)) return false;
      if (followupFilter === 'closed' && !outreachStatusClosed(record.status)) return false;
      return true;
    });
    function quickCount(key) {
      if (key === 'missing-message') {
        return scoped.filter(function (record) { return !safeString(record.messageSent).trim(); }).length;
      }
      if (key === 'missing-repertoire') {
        return scoped.filter(function (record) { return !safeString(record.plannedRepertoire).trim(); }).length;
      }
      if (key === 'no-linked-offer') {
        return scoped.filter(function (record) { return outreachLinkedOfferCount(record) < 1; }).length;
      }
      return 0;
    }
    $('outreach-quick-filters').querySelectorAll('[data-outreach-quick-filter]').forEach(function (btn) {
      var key = safeString(btn.getAttribute('data-outreach-quick-filter')).trim().toLowerCase();
      var label = safeString(btn.getAttribute('data-outreach-quick-label')).trim() || btn.textContent;
      var count = quickCount(key);
      btn.classList.toggle('active', key === quickFilter && quickFilter !== 'all');
      btn.innerHTML = '<span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(count)) + '</strong>';
    });
  }
  function outreachReportLinkedOfferText(record) {
    var offers = outreachLinkedOffers(record);
    if (!offers.length) return '0';
    var first = safeString(savedOfferDisplayLabel(offers[0])).trim();
    if (first.length > 26) first = first.slice(0, 25).trim() + '…';
    var more = offers.length > 1 ? (' + ' + String(offers.length - 1)) : '';
    return String(offers.length) + (first ? (' · ' + first + more) : '');
  }
  function outreachReportNoteText(record) {
    var fit = outreachFitPreview(record, 3).join(', ');
    var note = outreachShortNote(record, 90);
    return [fit, note].filter(Boolean).join(' · ') || '—';
  }
  function outreachPrintTimestamp() {
    try {
      return new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return new Date().toISOString();
    }
  }
  function outreachReportDocumentHtml(records) {
    var counts = outreachSummaryCounts(records);
    var filterContext = outreachCurrentFilterContext();
    return '<!doctype html><html><head><meta charset="utf-8">' +
      '<title>Outreach report</title>' +
      '<style>' +
        '@page{size:A4 landscape;margin:10mm;}' +
        'html,body{margin:0;padding:0;background:#fff;color:#121722;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
        'body{padding:0;}' +
        '.report{display:grid;gap:12px;}' +
        '.report__head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:2px solid #d7deea;padding-bottom:10px;}' +
        '.report__head h1{margin:0;font-size:20px;line-height:1.15;color:#121722;}' +
        '.report__head p{margin:4px 0 0;font-size:11px;line-height:1.5;color:#516075;max-width:70ch;}' +
        '.report__meta{text-align:right;font-size:10px;line-height:1.5;color:#516075;white-space:nowrap;}' +
        '.summary{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;}' +
        '.summary__tile{border:1px solid #d7deea;border-radius:10px;padding:8px 10px;background:#f7f9fc;display:grid;gap:4px;}' +
        '.summary__tile span{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#607086;}' +
        '.summary__tile strong{font-size:18px;line-height:1;color:#121722;}' +
        '.summary__tile small{font-size:10px;line-height:1.4;color:#607086;}' +
        '.filters{display:grid;gap:4px;padding:8px 10px;border:1px solid #d7deea;border-radius:10px;background:#fbfcfe;}' +
        '.filters strong{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#607086;}' +
        '.filters__row{font-size:11px;line-height:1.5;color:#243043;}' +
        '.report-table{display:block;}' +
        '.report-cards{display:none;}' +
        'table{width:100%;border-collapse:collapse;font-size:10.5px;table-layout:fixed;}' +
        'thead th{padding:7px 8px;border:1px solid #d7deea;background:#eef3fa;color:#364359;font-size:9px;letter-spacing:.12em;text-transform:uppercase;text-align:left;}' +
        'tbody td{padding:7px 8px;border:1px solid #d7deea;vertical-align:top;color:#162031;line-height:1.4;word-break:normal;overflow-wrap:break-word;}' +
        'tbody tr:nth-child(even){background:#fafbfd;}' +
        '.col-venue strong{word-break:normal;overflow-wrap:normal;hyphens:none;}' +
        '.col-type{word-break:normal;overflow-wrap:normal;}' +
        '.col-email{font-size:10px;line-height:1.35;overflow-wrap:anywhere;word-break:break-word;}' +
        '.col-linked{font-size:9.7px;line-height:1.35;word-break:normal;overflow-wrap:normal;}' +
        '.status{display:inline-block;padding:2px 7px;border-radius:999px;border:1px solid #d7deea;font-size:9px;line-height:1.3;background:#fff;}' +
        '.status--negotiating{background:#fff4da;border-color:#ecd18b;}' +
        '.status--confirmed{background:#e8f8ee;border-color:#b9e2c8;}' +
        '.status--declined,.status--archived{background:#f4f5f7;border-color:#d9dce1;}' +
        '.status--sent,.status--replied,.status--to-contact{background:#eef5ff;border-color:#c8d8f1;}' +
        '.muted{color:#607086;}' +
        '.report-card{border:1px solid #d7deea;border-radius:10px;background:#fbfcfe;padding:10px;display:grid;gap:8px;}' +
        '.report-card__head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}' +
        '.report-card__head h2{margin:0;font-size:13px;line-height:1.3;color:#121722;}' +
        '.report-card__loc{margin:0;font-size:10.5px;line-height:1.4;color:#607086;}' +
        '.report-card__grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin:0;}' +
        '.report-card__grid div{min-width:0;}' +
        '.report-card__grid dt{margin:0 0 2px;font-size:9px;line-height:1.25;letter-spacing:.1em;text-transform:uppercase;color:#607086;}' +
        '.report-card__grid dd{margin:0;font-size:10.5px;line-height:1.35;color:#162031;word-break:normal;overflow-wrap:break-word;}' +
        '.report-card__grid dd.email{overflow-wrap:anywhere;word-break:break-word;}' +
        '@media (max-width:780px){' +
          '.report{gap:10px;}' +
          '.report__head{display:grid;gap:8px;}' +
          '.report__meta{text-align:left;white-space:normal;}' +
          '.summary{grid-template-columns:repeat(2,minmax(0,1fr));}' +
          '.report-table{display:none;}' +
          '.report-cards{display:grid;gap:8px;}' +
          '.report-card__grid{grid-template-columns:1fr;}' +
        '}' +
      '</style></head><body>' +
      '<div class="report">' +
        '<div class="report__head">' +
          '<div><h1>Venues / Outreach report</h1><p>Filtered outreach review with current status, follow-up pressure, and Programme Offer linkage.</p></div>' +
          '<div class="report__meta">Generated ' + escapeHtml(outreachPrintTimestamp()) + '<br>Rolando Guy admin-v2</div>' +
        '</div>' +
        '<div class="summary">' +
          '<div class="summary__tile"><span>In view</span><strong>' + escapeHtml(String(counts.total)) + '</strong><small>Filtered records</small></div>' +
          '<div class="summary__tile"><span>Active venues</span><strong>' + escapeHtml(String(counts.active)) + '</strong><small>Still moving</small></div>' +
          '<div class="summary__tile"><span>Follow-up this week</span><strong>' + escapeHtml(String(counts.dueThisWeek)) + '</strong><small>' + escapeHtml(counts.due ? (String(counts.due) + ' urgent now') : 'Nothing urgent today') + '</small></div>' +
          '<div class="summary__tile"><span>Negotiating</span><strong>' + escapeHtml(String(counts.negotiating)) + '</strong><small>Warm conversations</small></div>' +
          '<div class="summary__tile"><span>Confirmed</span><strong>' + escapeHtml(String(counts.confirmed)) + '</strong><small>Already secured</small></div>' +
          '<div class="summary__tile"><span>No linked offer yet</span><strong>' + escapeHtml(String(counts.noLinkedOffer)) + '</strong><small>Worth pairing</small></div>' +
        '</div>' +
        '<div class="filters"><strong>Current filters</strong>' +
          filterContext.map(function (row) { return '<div class="filters__row">' + escapeHtml(row) + '</div>'; }).join('') +
        '</div>' +
        '<div class="report-table"><table>' +
          '<thead><tr>' +
            '<th class="col-venue" style="width:14%">Venue</th>' +
            '<th style="width:10%">City</th>' +
            '<th class="col-type" style="width:9%">Type</th>' +
            '<th style="width:9%">Contact</th>' +
            '<th class="col-email" style="width:16%">Email</th>' +
            '<th style="width:8%">Status</th>' +
            '<th style="width:8%">Last contact</th>' +
            '<th style="width:10%">Next follow-up</th>' +
            '<th class="col-linked" style="width:6%">Linked offers</th>' +
            '<th style="width:10%">Short notes / fit tags</th>' +
          '</tr></thead>' +
          '<tbody>' + records.map(function (record) {
            var statusKey = safeString(record.status).trim().toLowerCase();
            return '<tr>' +
              '<td class="col-venue"><strong>' + escapeHtml(record.venueName || 'Untitled venue') + '</strong></td>' +
              '<td>' + escapeHtml(record.city || '—') + '<div class="muted">' + escapeHtml(record.country || '') + '</div></td>' +
              '<td class="col-type">' + escapeHtml(record.venueType || '—') + '</td>' +
              '<td>' + escapeHtml(record.contactName || '—') + '</td>' +
              '<td class="col-email">' + escapeHtml(record.contactEmail || '—') + '</td>' +
              '<td><span class="status status--' + escapeAttr(statusKey.replace(/_/g, '-')) + '">' + escapeHtml(outreachStatusLabel(record.status)) + '</span></td>' +
              '<td>' + escapeHtml(outreachDateShortLabel(record.lastContactDate, '—')) + '</td>' +
              '<td>' + escapeHtml(outreachFollowupState(record).label) + '</td>' +
              '<td class="col-linked">' + escapeHtml(outreachReportLinkedOfferText(record)) + '</td>' +
              '<td>' + escapeHtml(outreachReportNoteText(record)) + '</td>' +
            '</tr>';
          }).join('') + '</tbody>' +
        '</table></div>' +
        '<div class="report-cards">' + records.map(function (record) {
          var statusKey = safeString(record.status).trim().toLowerCase();
          return '<article class="report-card">' +
            '<div class="report-card__head"><h2>' + escapeHtml(record.venueName || 'Untitled venue') + '</h2>' +
            '<span class="status status--' + escapeAttr(statusKey.replace(/_/g, '-')) + '">' + escapeHtml(outreachStatusLabel(record.status)) + '</span></div>' +
            '<p class="report-card__loc">' + escapeHtml((record.city || '—') + (record.country ? (', ' + record.country) : '')) + '</p>' +
            '<dl class="report-card__grid">' +
              '<div><dt>Type</dt><dd>' + escapeHtml(record.venueType || '—') + '</dd></div>' +
              '<div><dt>Contact</dt><dd>' + escapeHtml(record.contactName || '—') + '</dd></div>' +
              '<div><dt>Email</dt><dd class="email">' + escapeHtml(record.contactEmail || '—') + '</dd></div>' +
              '<div><dt>Last contact</dt><dd>' + escapeHtml(outreachDateShortLabel(record.lastContactDate, '—')) + '</dd></div>' +
              '<div><dt>Next follow-up</dt><dd>' + escapeHtml(outreachFollowupState(record).label) + '</dd></div>' +
              '<div><dt>Linked offers</dt><dd>' + escapeHtml(outreachReportLinkedOfferText(record)) + '</dd></div>' +
              '<div><dt>Short notes / fit tags</dt><dd>' + escapeHtml(outreachReportNoteText(record)) + '</dd></div>' +
            '</dl>' +
          '</article>';
        }).join('') + '</div>' +
      '</div>' +
      '</body></html>';
  }
  function exportOutreachReportPdf() {
    var records = outreachFilteredRecords();
    if (!records.length) {
      setStatus('No outreach records match the current filters.', 'warn');
      return;
    }
    var popup = window.open('', '_blank', 'width=1480,height=960');
    if (!popup) {
      setStatus('Could not open the outreach report window. Check the popup blocker and try again.', 'err');
      return;
    }
    popup.document.open();
    popup.document.write(outreachReportDocumentHtml(records));
    popup.document.close();
    var printNow = function () {
      try {
        popup.focus();
        popup.print();
        setStatus('Outreach report ready. Use Save as PDF in the print dialog.', 'warn');
      } catch (err) {
        setStatus('Outreach report opened. Use Cmd+P to save it as PDF.', 'warn');
      }
    };
    if (popup.document.readyState === 'complete') {
      setTimeout(printNow, 120);
    } else {
      popup.addEventListener('load', function () { setTimeout(printNow, 120); }, { once: true });
    }
  }
  function renderOutreachCards(records) {
    return records.map(function (record) {
      var isActive = safeString(state.outreachSelectedId).trim() === safeString(record.id).trim();
      var active = isActive ? 'outreach-card active' : 'outreach-card';
      var activeFlag = active.indexOf(' active') >= 0 ? '<span class="outreach-card__active-flag">Selected</span>' : '';
      var location = outreachRecordLocation(record) || 'Add city and country';
      var venueType = record.venueType || 'Add venue type';
      var contact = outreachContactSummary(record);
      var note = outreachShortNote(record, 150);
      var plannedRepertoire = safeString(record.plannedRepertoire).trim();
      var plannedPreview = plannedRepertoire ? (plannedRepertoire.length > 120 ? (plannedRepertoire.slice(0, 119).trim() + '…') : plannedRepertoire) : '';
      var fitTags = outreachFitPreview(record, 3);
      var urgency = outreachUrgencySummary(record);
      var recentContact = outreachRecentContactContext(record);
      var snapshotSignals = outreachSnapshotSignals(record);
      var quickActions = (!isActive || outreachStatusClosed(record.status)) ? '' : '<div class="outreach-card__actions">' +
        '<span class="outreach-card__action" data-outreach-card-id="' + escapeAttr(record.id) + '" data-outreach-card-action="contact-today">Mark contacted today</span>' +
        '<span class="outreach-card__action" data-outreach-card-id="' + escapeAttr(record.id) + '" data-outreach-card-action="followup-7">Follow up in 7 days</span>' +
        '<span class="outreach-card__action" data-outreach-card-id="' + escapeAttr(record.id) + '" data-outreach-card-action="mark-negotiating">Mark negotiating</span>' +
      '</div>';
      return '<button type="button" class="' + active + '" data-outreach-select="' + escapeAttr(record.id) + '">' +
        '<div class="outreach-card__head">' +
          '<div class="outreach-card__identity">' +
            '<strong>' + escapeHtml(record.venueName || '(untitled venue)') + '</strong>' +
            '<div class="outreach-card__meta">' + escapeHtml(location) + '</div>' +
          '</div>' +
          activeFlag +
          outreachStatusBadge(record) +
        '</div>' +
        '<div class="outreach-card__decision">' +
          '<span class="pill outreach-card__urgency ' + escapeAttr(urgency.className) + '">' + escapeHtml(urgency.label) + '</span>' +
          '<span class="outreach-card__recent">' + escapeHtml(recentContact) + '</span>' +
        '</div>' +
        quickActions +
        '<div class="outreach-card__signals">' + snapshotSignals + '</div>' +
        '<div class="outreach-card__grid">' +
          '<div><span class="outreach-card__label">Venue type</span><div class="outreach-card__value">' + escapeHtml(venueType) + '</div></div>' +
          '<div><span class="outreach-card__label">Contact</span><div class="outreach-card__value">' + escapeHtml(contact) + '</div></div>' +
          '<div><span class="outreach-card__label">Last contact</span><div class="outreach-card__value">' + escapeHtml(outreachDateShortLabel(record.lastContactDate, 'Not logged yet')) + '</div></div>' +
          '<div><span class="outreach-card__label">Next follow-up</span><div class="outreach-card__value">' + outreachFollowupBadge(record) + '</div></div>' +
          (record.cacheProposed || record.cacheNegotiated ? '<div><span class="outreach-card__label">Cache</span><div class="outreach-card__value">' + escapeHtml([record.cacheProposed, record.cacheNegotiated].filter(Boolean).join(' / ') || '—') + '</div></div>' : '') +
        '</div>' +
        '<div class="outreach-card__footer">' +
          '<div class="item-badges">' +
            outreachOfferBadge(record) +
            fitTags.map(function (tag) { return '<span class="item-badge">' + escapeHtml(tag) + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
        (plannedPreview ? '<p class="outreach-card__planned"><span>Planned repertoire</span>' + escapeHtml(plannedPreview) + '</p>' : '') +
        (note ? '<p class="outreach-card__note">' + escapeHtml(note) + '</p>' : '') +
      '</button>';
    }).join('');
  }
  function renderOutreachReport(records) {
    return '<div class="outreach-report-wrap"><table class="outreach-report">' +
      '<thead><tr>' +
        '<th>Venue</th>' +
        '<th>Location</th>' +
        '<th>Status</th>' +
        '<th>Contact</th>' +
        '<th>Last contact</th>' +
        '<th>Next follow-up</th>' +
        '<th>Offers</th>' +
        '<th>Fit / note</th>' +
      '</tr></thead><tbody>' +
      records.map(function (record) {
        var fitPreview = outreachFitPreview(record, 2).join(', ');
        var note = outreachShortNote(record, 80);
        var fitCell = [fitPreview, note].filter(Boolean).join(' · ');
        var active = safeString(state.outreachSelectedId).trim() === safeString(record.id).trim() ? ' class="active"' : '';
        return '<tr data-outreach-select="' + escapeAttr(record.id) + '"' + active + '>' +
          '<td><strong>' + escapeHtml(record.venueName || '(untitled venue)') + '</strong><div class="outreach-report__sub">' + escapeHtml(record.venueType || 'Type not set') + '</div></td>' +
          '<td>' + escapeHtml(outreachRecordLocation(record) || 'Add location') + '</td>' +
          '<td><div class="outreach-report__badges">' + outreachStatusBadge(record) + outreachFollowupBadge(record) + '</div></td>' +
          '<td>' + escapeHtml(outreachContactSummary(record)) + '</td>' +
          '<td>' + escapeHtml(outreachDateShortLabel(record.lastContactDate, 'Not logged')) + '</td>' +
          '<td>' + escapeHtml(outreachDateShortLabel(record.nextFollowUpDate, 'Not set')) + '</td>' +
          '<td>' + escapeHtml(String(outreachLinkedOfferCount(record))) + '</td>' +
          '<td>' + escapeHtml(fitCell || 'No fit note yet') + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }
  function discoveryCurrentDuration(item) {
    return Math.max(0, Number(item && item.approximateDurationMin) || 0);
  }
  function discoverySourceLayers(items) {
    var seen = {};
    (items || []).forEach(function (item) {
      var key = safeString(item && item.source).trim();
      if (key) seen[key] = true;
    });
    return Object.keys(seen).sort();
  }
  function resetDiscoveryResultLimit() {
    state.discoveryResultLimit = 24;
  }
  function discoveryCombinationLabel(value) {
    return ({
      tenor_piano: 'Tenor + Piano',
      tenor_soprano_piano: 'Tenor + Soprano + Piano',
      tenor_mezzo_piano: 'Tenor + Mezzo + Piano',
      tenor_baritone_piano: 'Tenor + Baritone + Piano',
      tenor_ensemble_piano: 'Tenor ensemble + Piano',
      piano_solo: 'Piano solo'
    })[safeString(value).trim().toLowerCase()] || '';
  }
  function discoveryReadinessLabel(value) {
    return ({
      ideas_only: 'Ideas only',
      good_candidate: 'Good candidate',
      worth_studying: 'Worth studying'
    })[safeString(value).trim().toLowerCase()] || 'Ideas only';
  }
  function plannerTypeFromDiscovery(item) {
    var type = safeString(item && item.type).trim().toLowerCase();
    if (type === 'aria' || type === 'duet' || type === 'tango' || type === 'sacred') return type;
    if (type === 'piano_solo') return 'piano-solo';
    if (type === 'song') return 'song';
    if (type === 'lied') return 'lied';
    if (type === 'trio' || type === 'quartet') return 'ensemble';
    return 'other';
  }
  function plannerCategoryFromDiscovery(item) {
    var category = safeString(item && item.category).trim().toLowerCase();
    if (category) return category;
    var type = safeString(item && item.type).trim().toLowerCase();
    if (type === 'trio' || type === 'quartet') return type;
    if (type === 'piano_solo') return 'piano_solo';
    if (type === 'song') return 'art_song';
    return '';
  }
  function discoveryImportNotes(item, editorialNotes) {
    var prepSteps = [
      'Confirm formation, duration, and voice classification.',
      'Review key, cut, edition, and partner needs where relevant.',
      'Refine tags, dramatic role, and style metadata for future offers.',
      'Keep excludeFromOffers on until the item is genuinely prepared.',
      'When ready, update readiness / availability and remove manual review.'
    ];
    return [
      'Imported from Repertoire Discovery.',
      item && item.source ? ('Source: ' + item.source + '.') : '',
      item && item.sourceNote ? ('Source note: ' + item.sourceNote) : '',
      item && item.fitNote ? ('Fit note: ' + item.fitNote) : '',
      item && item.cautionNote ? ('Caution: ' + item.cautionNote) : '',
      editorialNotes ? ('Editorial note: ' + editorialNotes) : '',
      'Preparation checklist:',
      prepSteps.map(function (step) { return '- ' + step; }).join('\n')
    ].filter(Boolean).join('\n');
  }
  function discoveryImportStatusPreviewHtml(item) {
    var record = ensureDiscoveryRecord(item.id);
    var imported = !!safeString(record.importedItemId || item.importedItemId).trim();
    var title = imported ? 'Imported library status' : 'Library status after import';
    var lead = imported
      ? 'This discovery item is already in the repertoire library as a review-only record.'
      : 'Import creates a review-only library record, not an offer-ready repertoire entry.';
    var steps = [
      'Confirm formation, category, and voice metadata.',
      'Check source note, caution note, key, cut, and edition.',
      'Refine readiness, practical tags, and dramatic role once the piece is truly prepared.',
      'Remove the Programme Offers block only when the entry is ready for real offer use.'
    ];
    return '<div class="discovery-detail__block">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<p class="muted">' + escapeHtml(lead) + '</p>' +
      '<div class="item-badges">' +
        '<span class="item-badge">idea</span>' +
        '<span class="item-badge warn">manual review</span>' +
        '<span class="item-badge">hidden from Programme Offers</span>' +
      '</div>' +
      '<p class="muted">' + escapeHtml('Next step after import: open the repertoire library record, confirm metadata, then change readiness / availability and remove the offer block only when the piece is genuinely prepared.') + '</p>' +
      '<p class="muted">' + escapeHtml(steps.join(' · ')) + '</p>' +
    '</div>';
  }
  function normalizePlannerCategory(value) {
    var key = safeString(value).trim().toLowerCase();
    return /^(aria|duet|trio|quartet|ensemble|art_song|tango|piano_solo)$/.test(key) ? key : '';
  }
  function normalizePlannerVoiceToken(value) {
    var key = safeString(value).trim().toLowerCase();
    if (!key) return '';
    if (key.indexOf('tenor') >= 0) return 'tenor';
    if (key.indexOf('soprano') >= 0) return 'soprano';
    if (key.indexOf('mezzo') >= 0) return 'mezzo';
    if (key.indexOf('baritone') >= 0 || key.indexOf('baryton') >= 0 || key.indexOf('barytone') >= 0) return 'baritone';
    return '';
  }
  function normalizePlannerVoiceList(list) {
    var out = [];
    (list || []).forEach(function (value) {
      var voice = normalizePlannerVoiceToken(value);
      if (!voice) return;
      if (out.indexOf(voice) < 0) out.push(voice);
    });
    return PROGRAM_BUILDER_VOICE_ORDER.filter(function (voice) { return out.indexOf(voice) >= 0; });
  }
  function normalizePlannerVoiceCategory(value) {
    var key = safeString(value).trim().toLowerCase();
    return hasOwn(PROGRAM_BUILDER_VOICE_CATEGORY_LABELS, key) ? key : '';
  }
  function plannerVoicesFromVoiceCategory(voiceCategory) {
    var key = normalizePlannerVoiceCategory(voiceCategory);
    if (!key) return [];
    if (/_aria$/.test(key)) return [key.split('_')[0]];
    if (key === 'tenor_soprano_duet') return ['tenor', 'soprano'];
    if (key === 'tenor_mezzo_duet') return ['tenor', 'mezzo'];
    if (key === 'tenor_baritone_duet') return ['tenor', 'baritone'];
    if (key === 'soprano_mezzo_duet') return ['soprano', 'mezzo'];
    if (key === 'soprano_baritone_duet') return ['soprano', 'baritone'];
    if (key === 'mezzo_baritone_duet') return ['mezzo', 'baritone'];
    if (key === 'tenor_soprano_mezzo_trio') return ['tenor', 'soprano', 'mezzo'];
    if (key === 'tenor_soprano_baritone_trio') return ['tenor', 'soprano', 'baritone'];
    if (key === 'tenor_mezzo_baritone_trio') return ['tenor', 'mezzo', 'baritone'];
    if (key === 'soprano_mezzo_baritone_trio') return ['soprano', 'mezzo', 'baritone'];
    return [];
  }
  function plannerVoicesFromFormationLabel(raw) {
    var label = normalizeFormationLabel(raw);
    if (!label) return [];
    return normalizePlannerVoiceList([
      label.indexOf('tenor') >= 0 ? 'tenor' : '',
      label.indexOf('soprano') >= 0 ? 'soprano' : '',
      label.indexOf('mezzo') >= 0 ? 'mezzo' : '',
      (label.indexOf('baritone') >= 0 || label.indexOf('baryton') >= 0 || label.indexOf('barytone') >= 0) ? 'baritone' : ''
    ]);
  }
  function plannerVoicesFromItem(item) {
    var voices = normalizePlannerVoiceList([item.primaryVoice].concat(item.pairedVoices || []));
    if (voices.length) return voices;
    (Array.isArray(item.formations) ? item.formations : []).forEach(function (formation) {
      voices = normalizePlannerVoiceList(voices.concat(plannerVoicesFromFormationLabel(formation)));
    });
    if (voices.length) return voices;
    return plannerVoicesFromVoiceCategory(item.voiceCategory);
  }
  function plannerCategoryFromLegacy(item, voices) {
    var explicit = normalizePlannerCategory(item.category);
    if (explicit) return explicit;
    var type = safeString(item.type || 'other').trim().toLowerCase();
    if (type === 'piano-solo') return 'piano_solo';
    if (type === 'tango') return 'tango';
    if (type === 'duet') return 'duet';
    if (type === 'ensemble') {
      if (voices.length === 3) return 'trio';
      if (voices.length === 4) return 'quartet';
      return 'ensemble';
    }
    if (type === 'aria' || type === 'operetta') return 'aria';
    if (type === 'lied' || type === 'song' || type === 'canzone' || type === 'sacred') return 'art_song';
    if (type === 'role') return '';
    if (voices.length === 2) return 'duet';
    if (voices.length === 3) return 'trio';
    if (voices.length === 4) return 'quartet';
    if ((Array.isArray(item.formations) ? item.formations : []).some(function (formation) { return normalizeFormationLabel(formation).indexOf('piano solo') >= 0; })) return 'piano_solo';
    return '';
  }
  function plannerVoiceCategoryFrom(category, voices, explicit) {
    var explicitKey = normalizePlannerVoiceCategory(explicit);
    if (explicitKey) return explicitKey;
    if (category === 'aria') {
      if (voices.indexOf('tenor') >= 0) return 'tenor_aria';
      if (voices.indexOf('soprano') >= 0) return 'soprano_aria';
      if (voices.indexOf('mezzo') >= 0) return 'mezzo_aria';
      if (voices.indexOf('baritone') >= 0) return 'baritone_aria';
      return '';
    }
    if (category === 'duet') {
      if (voices.indexOf('tenor') >= 0 && voices.indexOf('soprano') >= 0) return 'tenor_soprano_duet';
      if (voices.indexOf('tenor') >= 0 && voices.indexOf('mezzo') >= 0) return 'tenor_mezzo_duet';
      if (voices.indexOf('tenor') >= 0 && voices.indexOf('baritone') >= 0) return 'tenor_baritone_duet';
      if (voices.indexOf('soprano') >= 0 && voices.indexOf('mezzo') >= 0) return 'soprano_mezzo_duet';
      if (voices.indexOf('soprano') >= 0 && voices.indexOf('baritone') >= 0) return 'soprano_baritone_duet';
      if (voices.indexOf('mezzo') >= 0 && voices.indexOf('baritone') >= 0) return 'mezzo_baritone_duet';
      return '';
    }
    if (category === 'trio') {
      if (voices.indexOf('tenor') >= 0 && voices.indexOf('soprano') >= 0 && voices.indexOf('mezzo') >= 0) return 'tenor_soprano_mezzo_trio';
      if (voices.indexOf('tenor') >= 0 && voices.indexOf('soprano') >= 0 && voices.indexOf('baritone') >= 0) return 'tenor_soprano_baritone_trio';
      if (voices.indexOf('tenor') >= 0 && voices.indexOf('mezzo') >= 0 && voices.indexOf('baritone') >= 0) return 'tenor_mezzo_baritone_trio';
      if (voices.indexOf('soprano') >= 0 && voices.indexOf('mezzo') >= 0 && voices.indexOf('baritone') >= 0) return 'soprano_mezzo_baritone_trio';
      return '';
    }
    if (category === 'quartet') return 'quartet';
    if (category === 'ensemble') return 'ensemble';
    if (category === 'piano_solo') return 'piano_solo';
    if (category === 'art_song') return 'chamber_song';
    if (category === 'tango') return 'tango';
    return '';
  }
  function plannerPrimaryVoiceFrom(item, category, voices) {
    var explicit = normalizePlannerVoiceToken(item.primaryVoice);
    if (explicit) return explicit;
    if (category === 'piano_solo') return '';
    if (voices.indexOf('tenor') >= 0) return 'tenor';
    return voices[0] || '';
  }
  function plannerKnownMetadataOverride(item) {
    var titleKey = programBuilderSlug(item && item.title);
    if (titleKey === 'in_un_coupe') {
      return {
        composer: 'Giacomo Puccini',
        work: 'La bohème',
        type: 'duet',
        category: 'duet',
        voiceCategory: 'tenor_baritone_duet',
        primaryVoice: 'tenor',
        pairedVoices: ['baritone'],
        formations: ['Tenor + Baritone + Piano'],
        reviewStatus: 'manual_review'
      };
    }
    return null;
  }
  function plannerDisplayVoiceLabel(voice) {
    return ({
      tenor: 'Tenor',
      soprano: 'Soprano',
      mezzo: 'Mezzo',
      baritone: 'Baritone'
    })[safeString(voice).trim().toLowerCase()] || '';
  }
  function plannerDerivedFormationFromVoices(voices, hasPiano) {
    var labels = normalizePlannerVoiceList(voices).map(plannerDisplayVoiceLabel).filter(Boolean);
    if (!labels.length) return hasPiano ? 'Voice(s) + Piano' : '';
    return labels.join(' + ') + (hasPiano ? ' + Piano' : '');
  }
  function plannerPairedVoicesFrom(item, primaryVoice, voices) {
    var explicit = normalizePlannerVoiceList(item.pairedVoices);
    if (explicit.length) return explicit;
    return voices.filter(function (voice) { return voice !== primaryVoice; });
  }
  function plannerAvailabilityStatus(item) {
    var explicit = safeString(item.availabilityStatus).trim().toLowerCase();
    if (/^(performed|working|idea|outside_repertoire|ready)$/.test(explicit)) {
      if (explicit === 'ready') return 'ready';
      return explicit;
    }
    if (safeString(item.performanceStatus).trim().toLowerCase() === 'performed') return 'performed';
    var readiness = safeString(item.readiness).trim().toLowerCase();
    if (/^(ready|working|idea)$/.test(readiness)) return readiness;
    return 'idea';
  }
  function plannerEffectiveDuration(item) {
    var approx = Math.max(0, Number(item.approximateDurationMin) || 0);
    var exactish = Math.max(0, Number(item.durationMin) || 0);
    return exactish || approx || 0;
  }
  function normalizePlannerDramaticRole(value) {
    value = safeString(value).trim().toLowerCase();
    return PROGRAM_BUILDER_DRAMATIC_ROLE_ORDER.indexOf(value) >= 0 ? value : '';
  }
  function normalizePlannerLevel(value, allowed) {
    value = safeString(value).trim().toLowerCase();
    return allowed.indexOf(value) >= 0 ? value : '';
  }
  function inferPlannerMoodTags(item, category, tags, fitTags) {
    var moods = [];
    if (category === 'art_song') moods.push('intimate');
    if (category === 'tango') moods.push('nostalgic', 'seductive');
    if (safeString(item.type) === 'sacred') moods.push('sacred');
    if (safeString(item.type) === 'operetta') moods.push('playful', 'comic');
    if (category === 'aria' || category === 'quartet' || category === 'ensemble' || category === 'trio') moods.push('dramatic');
    if (tags.indexOf('gala') >= 0 || fitTags.indexOf('gala') >= 0) moods.push('celebratory');
    if (fitTags.indexOf('italian') >= 0 && moods.indexOf('luminous') < 0) moods.push('luminous');
    return programBuilderUniqueStrings(moods);
  }
  function inferPlannerDramaticRole(item, category, tags, fitTags) {
    if (tags.indexOf('encore') >= 0 || fitTags.indexOf('encore') >= 0) return 'encore';
    if (category === 'piano_solo') return 'contrast';
    if (category === 'art_song') return 'lyrical_center';
    if (category === 'tango') return 'contrast';
    if (category === 'quartet' || category === 'ensemble' || category === 'trio') return 'finale';
    if (category === 'duet') return 'development';
    if (category === 'aria' && (fitTags.indexOf('gala') >= 0 || fitTags.indexOf('verdi') >= 0)) return 'climax';
    if (category === 'aria') return 'development';
    return '';
  }
  function inferPlannerEnergyLevel(item, category, fitTags) {
    if (category === 'art_song') return 'low';
    if (category === 'piano_solo') return 'medium';
    if (category === 'tango') return 'medium';
    if (category === 'quartet' || category === 'ensemble' || category === 'trio') return 'high';
    if (category === 'aria' && (fitTags.indexOf('gala') >= 0 || fitTags.indexOf('verdi') >= 0 || fitTags.indexOf('bravura') >= 0)) return 'high';
    if (category === 'aria') return 'medium';
    if (category === 'duet') return 'medium';
    return 'medium';
  }
  function inferPlannerTempoProfile(item, category) {
    if (category === 'art_song') return 'slow';
    if (category === 'piano_solo') return 'flowing';
    if (category === 'tango') return 'moderate';
    if (category === 'quartet' || category === 'ensemble') return 'lively';
    if (category === 'trio') return 'flowing';
    if (category === 'aria') return 'moderate';
    if (category === 'duet') return 'flowing';
    return 'moderate';
  }
  function inferPlannerImpactLevel(item, category) {
    if (category === 'piano_solo') return 'light';
    if (category === 'art_song') return 'medium';
    if (category === 'tango') return 'medium';
    if (category === 'duet') return 'medium';
    if (category === 'aria' || category === 'quartet' || category === 'ensemble' || category === 'trio') return 'high';
    return 'medium';
  }
  function inferPlannerAudienceAppeal(item, category, tags, fitTags) {
    if (tags.indexOf('encore') >= 0 || tags.indexOf('audience_favorite') >= 0 || fitTags.indexOf('tango') >= 0) return 'crowd_pleaser';
    if (category === 'art_song') return 'connoisseur';
    return 'balanced';
  }
  function inferPlannerEncoreCandidate(item, category, tags, fitTags) {
    if (item.encoreCandidate === true) return true;
    if (tags.indexOf('encore') >= 0 || tags.indexOf('audience_favorite') >= 0) return true;
    if (category === 'tango') return true;
    return false;
  }
  function inferPlannerPracticalTags(item, category, voices, duration, tags) {
    var out = [];
    if (voices.indexOf('soprano') >= 0) out.push('needs_soprano');
    if (voices.indexOf('mezzo') >= 0) out.push('needs_mezzo');
    if (voices.indexOf('baritone') >= 0) out.push('needs_baritone');
    if (safeString(item.type) === 'sacred') out.push('works_in_church');
    if (category === 'art_song' || category === 'tango') out.push('spoken_intro_possible');
    if (tags.indexOf('encore') >= 0 || tags.indexOf('audience_favorite') >= 0) out.push('audience_favorite');
    if ((category === 'aria' || category === 'ensemble' || category === 'quartet') && duration >= 5) out.push('vocally_heavy');
    if ((category === 'duet' || category === 'ensemble' || category === 'quartet') && tags.indexOf('gala') >= 0) out.push('better_with_orchestra');
    return programBuilderUniqueStrings(out);
  }
  function plannerFitTagsFrom(item, category, voices) {
    var tags = programBuilderUniqueStrings((Array.isArray(item.fitTags) ? item.fitTags : []).concat(item.tags || [])).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean);
    if (category === 'art_song' && tags.indexOf('art_song') < 0) tags.push('art_song');
    if (category === 'piano_solo' && tags.indexOf('piano_solo') < 0) tags.push('piano_solo');
    if (category === 'tango' && tags.indexOf('tango') < 0) tags.push('tango');
    if (voices.indexOf('tenor') >= 0 && tags.indexOf('tenor') < 0) tags.push('tenor');
    return programBuilderUniqueStrings(tags);
  }
  function plannerStoredBoolean(value) {
    if (value === true || value === false) return value;
    var key = safeString(value).trim().toLowerCase();
    if (key === 'true' || key === '1' || key === 'yes') return true;
    if (key === 'false' || key === '0' || key === 'no') return false;
    return null;
  }
  function inferPlannerTexture(category) {
    if (category === 'duet') return 'duet';
    if (category === 'trio') return 'trio';
    if (category === 'quartet' || category === 'ensemble') return 'ensemble';
    if (category === 'piano_solo') return 'piano_solo';
    return 'solo';
  }
  function inferPlannerStyleBucket(item, category, rawType, tags, fitTags) {
    if (rawType === 'operetta' || tags.indexOf('operetta') >= 0 || fitTags.indexOf('operetta') >= 0) return 'operetta';
    if (rawType === 'canzone' || tags.indexOf('canzone') >= 0 || fitTags.indexOf('canzone') >= 0 || fitTags.indexOf('italian_song') >= 0) return 'canzone';
    if (category === 'piano_solo' || tags.indexOf('interlude') >= 0 || tags.indexOf('intermezzo') >= 0 || tags.indexOf('prelude') >= 0 || fitTags.indexOf('interlude') >= 0) return 'intermezzo';
    return 'opera';
  }
  function inferPlannerVocalLoad(category, rawType, durationMin, texture, practicalTags) {
    if (category === 'piano_solo') return 'light';
    if (texture === 'duet' || texture === 'trio' || texture === 'ensemble') return 'medium';
    if (rawType === 'canzone' || category === 'tango' || category === 'art_song') return durationMin >= 5 ? 'medium' : 'light';
    if (category === 'aria') return (durationMin >= 5 || practicalTags.indexOf('vocally_heavy') >= 0) ? 'heavy' : 'medium';
    return 'medium';
  }
  function inferPlannerRecoveryValue(category, texture, interlude, vocalRestSupport) {
    if (category === 'piano_solo' || interlude || vocalRestSupport) return 'strong';
    if (texture === 'duet' || texture === 'trio' || texture === 'ensemble') return 'partial';
    return 'none';
  }
  function inferPlannerGalaRole(category, dramaticRole, styleBucket, interlude, recoveryValue) {
    if (interlude || recoveryValue === 'strong' || category === 'piano_solo') return 'vocal_rest_support';
    if (dramaticRole === 'opener' || dramaticRole === 'contrast' || dramaticRole === 'lyrical_center' || dramaticRole === 'climax' || dramaticRole === 'finale' || dramaticRole === 'encore') return dramaticRole;
    if (styleBucket === 'canzone' || styleBucket === 'operetta') return 'contrast';
    return '';
  }
  function normalizePlannerItemRecord(item, i) {
    item = Object.assign({}, item, plannerKnownMetadataOverride(item) || {});
    var rawType = safeString(item.type || 'other').trim().toLowerCase() || 'other';
    var formations = (Array.isArray(item.formations) ? item.formations : safeString(item.formations).split('\n')).map(function (x) { return safeString(x).trim(); }).filter(Boolean);
    var preliminaryVoices = plannerVoicesFromItem({ formations: formations, primaryVoice: item.primaryVoice, pairedVoices: item.pairedVoices, voiceCategory: item.voiceCategory });
    var category = plannerCategoryFromLegacy(item, preliminaryVoices);
    var voiceCategory = plannerVoiceCategoryFrom(category, preliminaryVoices, item.voiceCategory);
    var voices = preliminaryVoices.length ? preliminaryVoices : plannerVoicesFromVoiceCategory(voiceCategory);
    var primaryVoice = plannerPrimaryVoiceFrom(item, category, voices);
    var pairedVoices = plannerPairedVoicesFrom(item, primaryVoice, voices);
    var isMultiSinger = ['duet','trio','quartet','ensemble'].indexOf(category) >= 0 || pairedVoices.length > 0 || voices.length > 1;
    if (isMultiSinger) {
      formations = formations.filter(function (formation) {
        var label = normalizeFormationLabel(formation);
        if (!label) return false;
        if (label === 'voice + piano' || label === 'voice(s) + piano') return false;
        var formVoices = plannerVoicesFromFormationLabel(label);
        if (!formVoices.length) return false;
        return formVoices.length >= Math.max(2, voices.length || 2);
      });
      if (!formations.length && voices.length >= 2) {
        var derivedFormation = plannerDerivedFormationFromVoices(voices, true);
        if (derivedFormation) formations = [derivedFormation];
      }
      voiceCategory = plannerVoiceCategoryFrom(category, voices, '');
      if (!primaryVoice && voices.length) primaryVoice = voices[0];
      if (!pairedVoices.length && voices.length > 1) pairedVoices = voices.slice(1);
    }
    var availabilityStatus = plannerAvailabilityStatus(item);
    var approximateDurationMin = Math.max(0, Number(item.approximateDurationMin) || Number(item.durationMin) || 0);
    var durationMin = Math.max(0, Number(item.durationMin) || approximateDurationMin || 0);
    var fitTags = plannerFitTagsFrom(item, category, voices);
    var tags = (Array.isArray(item.tags) ? item.tags : safeString(item.tags).split(',')).map(function (x) { return safeString(x).trim().toLowerCase(); }).filter(Boolean);
    var dramaticRole = normalizePlannerDramaticRole(item.dramaticRole) || inferPlannerDramaticRole(item, category, tags, fitTags);
    var energyLevel = normalizePlannerLevel(item.energyLevel, ['low','medium','high']) || inferPlannerEnergyLevel(item, category, fitTags);
    var moodTags = programBuilderUniqueStrings((Array.isArray(item.moodTags) ? item.moodTags : safeString(item.moodTags).split(',')).map(function (x) { return safeString(x).trim().toLowerCase(); }).filter(Boolean));
    if (!moodTags.length) moodTags = inferPlannerMoodTags(item, category, tags, fitTags);
    var tempoProfile = normalizePlannerLevel(item.tempoProfile, ['slow','moderate','flowing','lively','brilliant']) || inferPlannerTempoProfile(item, category);
    var impactLevel = normalizePlannerLevel(item.impactLevel, ['light','medium','high']) || inferPlannerImpactLevel(item, category);
    var audienceAppeal = normalizePlannerLevel(item.audienceAppeal, ['connoisseur','balanced','crowd_pleaser']) || inferPlannerAudienceAppeal(item, category, tags, fitTags);
    var encoreCandidate = item.encoreCandidate === true || inferPlannerEncoreCandidate(item, category, tags, fitTags);
    var practicalTags = programBuilderUniqueStrings((Array.isArray(item.practicalTags) ? item.practicalTags : safeString(item.practicalTags).split(',')).map(function (x) { return safeString(x).trim().toLowerCase(); }).filter(Boolean));
    if (!practicalTags.length) practicalTags = inferPlannerPracticalTags(item, category, voices, durationMin || approximateDurationMin, tags);
    var interludeStored = plannerStoredBoolean(item.interlude);
    var vocalRestSupportStored = plannerStoredBoolean(item.vocalRestSupport);
    var goodBetweenBlocksStored = plannerStoredBoolean(item.goodBetweenBlocks);
    var goodBeforeClimaxStored = plannerStoredBoolean(item.goodBeforeClimax);
    var interlude = interludeStored !== null ? interludeStored : (category === 'piano_solo' || tags.indexOf('interlude') >= 0 || fitTags.indexOf('interlude') >= 0 || practicalTags.indexOf('interlude') >= 0);
    var vocalRestSupport = vocalRestSupportStored !== null ? vocalRestSupportStored : (category === 'piano_solo' || practicalTags.indexOf('vocal_rest_support') >= 0 || practicalTags.indexOf('spoken_intro_possible') >= 0);
    var goodBetweenBlocks = goodBetweenBlocksStored !== null ? goodBetweenBlocksStored : (category === 'piano_solo' || practicalTags.indexOf('good_between_blocks') >= 0 || practicalTags.indexOf('interlude') >= 0);
    var goodBeforeClimax = goodBeforeClimaxStored !== null ? goodBeforeClimaxStored : (practicalTags.indexOf('good_before_climax') >= 0 || tags.indexOf('good_before_climax') >= 0 || fitTags.indexOf('good_before_climax') >= 0);
    var texture = normalizePlannerLevel(item.texture, ['solo','duet','trio','ensemble','piano_solo']) || inferPlannerTexture(category);
    var styleBucket = normalizePlannerLevel(item.styleBucket, ['opera','operetta','canzone','intermezzo']) || inferPlannerStyleBucket(item, category, rawType, tags, fitTags);
    var vocalLoad = normalizePlannerLevel(item.vocalLoad, ['light','medium','heavy']) || inferPlannerVocalLoad(category, rawType, durationMin || approximateDurationMin, texture, practicalTags);
    var recoveryValue = normalizePlannerLevel(item.recoveryValue, ['none','partial','strong']) || inferPlannerRecoveryValue(category, texture, interlude, vocalRestSupport);
    var bestDurationFit = (function (value) {
      value = safeString(value || '').trim().toLowerCase();
      return ['30','45','60','all'].indexOf(value) >= 0 ? value : 'all';
    })(item.bestDurationFit);
    var galaRole = normalizePlannerLevel(item.galaRole, ['opener','contrast','lyrical_center','climax','finale','encore','vocal_rest_support']) || inferPlannerGalaRole(category, dramaticRole, styleBucket, interlude, recoveryValue);
    var reviewStatus = safeString(item.reviewStatus || 'clean').trim().toLowerCase() === 'manual_review' ? 'manual_review' : 'clean';
    var offerOnly = item.offerOnly === true;
    var excludeFromOffers = item.excludeFromOffers === true;
    if (category === 'piano_solo' && reviewStatus !== 'manual_review') excludeFromOffers = false;
    if (availabilityStatus === 'outside_repertoire') excludeFromOffers = false;
    if (offerOnly) excludeFromOffers = true;
    return {
      id: safeString(item.id || ('piece_' + (i + 1))).trim(),
      title: safeString(item.title).trim(),
      composer: safeString(item.composer).trim(),
      work: safeString(item.work).trim(),
      type: rawType,
      category: category,
      voiceCategory: voiceCategory,
      primaryVoice: primaryVoice,
      pairedVoices: pairedVoices,
      includesTenor: item.includesTenor === true || voices.indexOf('tenor') >= 0,
      language: safeString(item.language).trim(),
      approximateDurationMin: approximateDurationMin,
      durationMin: durationMin,
      formations: formations,
      readiness: (function (v) { v = safeString(v || 'idea').trim().toLowerCase(); return /^(ready|working|idea)$/.test(v) ? v : 'idea'; })(item.readiness),
      availabilityStatus: availabilityStatus,
      tags: tags,
      fitTags: fitTags,
      dramaticRole: dramaticRole,
      energyLevel: energyLevel,
      moodTags: moodTags,
      tempoProfile: tempoProfile,
      impactLevel: impactLevel,
      audienceAppeal: audienceAppeal,
      encoreCandidate: encoreCandidate,
      vocalLoad: vocalLoad,
      galaRole: galaRole,
      texture: texture,
      styleBucket: styleBucket,
      recoveryValue: recoveryValue,
      bestDurationFit: bestDurationFit,
      practicalTags: practicalTags,
      interlude: interlude,
      vocalRestSupport: vocalRestSupport,
      goodBetweenBlocks: goodBetweenBlocks,
      goodBeforeClimax: goodBeforeClimax,
      notes: safeString(item.notes),
      publicNotes: safeString(item.publicNotes),
      sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : ((i + 1) * 10),
      performanceStatus: safeString(item.performanceStatus || '').trim().toLowerCase() === 'performed' ? 'performed' : '',
      performedIn: (Array.isArray(item.performedIn) ? item.performedIn : safeString(item.performedIn).split('\n')).map(function (x) { return safeString(x).trim(); }).filter(Boolean),
      reviewStatus: reviewStatus,
      offerOnly: offerOnly,
      excludeFromOffers: excludeFromOffers,
      sourceGroup: safeString(item.sourceGroup).trim(),
      suggestionGroup: safeString(item.suggestionGroup).trim(),
      discoveryIdea: item.discoveryIdea === true,
      discoverySourceId: safeString(item.discoverySourceId).trim(),
      discoveryImportedItemId: safeString(item.discoveryImportedItemId).trim()
    };
  }
  function plannerItemVoiceLabel(item) {
    var explicit = safeString(PROGRAM_BUILDER_VOICE_CATEGORY_LABELS[safeString(item.voiceCategory).trim().toLowerCase()]);
    if (explicit) return explicit;
    var fallback = safeString(item.category || item.type || '').replace(/_/g, ' ').trim();
    return fallback ? fallback.replace(/\b[a-z]/g, function (ch) { return ch.toUpperCase(); }) : 'Repertoire';
  }
  function nextPlannerItemId(seedTitle) {
    var base = programBuilderSlug(seedTitle || 'piece');
    var candidate = base;
    var suffix = 2;
    var items = (state.plannerDoc && Array.isArray(state.plannerDoc.items)) ? state.plannerDoc.items : [];
    while (items.some(function (item) { return safeString(item && item.id).trim() === candidate; })) {
      candidate = base + '_' + suffix;
      suffix += 1;
    }
    return candidate;
  }
  function plannerCategoryFilterMatches(item, filter) {
    var key = safeString(filter || 'all').trim().toLowerCase() || 'all';
    if (key === 'all') return true;
    var voiceCategory = safeString(item.voiceCategory).trim().toLowerCase();
    var category = safeString(item.category).trim().toLowerCase();
    if (key === 'tenor_arias') return voiceCategory === 'tenor_aria';
    if (key === 'soprano_arias') return voiceCategory === 'soprano_aria';
    if (key === 'mezzo_arias') return voiceCategory === 'mezzo_aria';
    if (key === 'baritone_arias') return voiceCategory === 'baritone_aria';
    if (key === 'tenor_soprano_duets') return voiceCategory === 'tenor_soprano_duet';
    if (key === 'tenor_mezzo_duets') return voiceCategory === 'tenor_mezzo_duet';
    if (key === 'tenor_baritone_duets') return voiceCategory === 'tenor_baritone_duet';
    if (key === 'other_duets') return category === 'duet' && ['soprano_mezzo_duet','soprano_baritone_duet','mezzo_baritone_duet'].indexOf(voiceCategory) >= 0;
    if (key === 'trios') return category === 'trio';
    if (key === 'quartets_ensembles') return category === 'quartet' || category === 'ensemble';
    if (key === 'piano_solo') return category === 'piano_solo';
    if (key === 'chamber_song') return voiceCategory === 'chamber_song' || category === 'art_song';
    if (key === 'tango') return category === 'tango' || voiceCategory === 'tango';
    return true;
  }
  function plannerPieceCombinedTags(piece) {
    return programBuilderUniqueStrings((((piece && piece.fitTags) && piece.fitTags.length ? piece.fitTags : []).concat((piece && piece.tags) || []).concat((piece && piece.practicalTags) || [])).map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
  }
  function plannerPieceFlags(piece) {
    var category = safeString(piece && piece.category).trim().toLowerCase();
    var type = safeString(piece && piece.type).trim().toLowerCase();
    var voiceCategory = safeString(piece && piece.voiceCategory).trim().toLowerCase();
    var language = safeString(piece && piece.language).trim().toUpperCase();
    var tags = plannerPieceCombinedTags(piece);
    var textBlob = [
      safeString(piece && piece.title).trim().toLowerCase(),
      safeString(piece && piece.work).trim().toLowerCase(),
      safeString(piece && piece.composer).trim().toLowerCase(),
      safeString(piece && piece.sourceGroup).trim().toLowerCase()
    ].join(' ');
    var isOperatic = ['aria', 'duet', 'trio', 'quartet', 'ensemble'].indexOf(category) >= 0;
    var isPianoSolo = category === 'piano_solo';
    var isOperaticPiano = isPianoSolo && (
      tags.indexOf('gala') >= 0 ||
      tags.indexOf('opera') >= 0 ||
      tags.indexOf('operatic') >= 0 ||
      tags.indexOf('interlude') >= 0 ||
      tags.indexOf('prelude') >= 0 ||
      /intermezzo|prelude|preludio|opera/.test(textBlob)
    );
    var isTango = category === 'tango' || type === 'tango' || voiceCategory === 'tango' || tags.indexOf('tango') >= 0 || tags.indexOf('milonga') >= 0 || tags.indexOf('argentine_tango') >= 0 || tags.indexOf('argentine') >= 0;
    var isArtSong = category === 'art_song' || voiceCategory === 'chamber_song' || type === 'lied' || type === 'song' || type === 'sacred';
    var isCanzone = type === 'canzone' || tags.indexOf('canzone') >= 0 || tags.indexOf('romanza') >= 0 || tags.indexOf('romanza_da_camera') >= 0 || tags.indexOf('italian_song') >= 0;
    var isItalian = language === 'IT' || tags.indexOf('italian') >= 0 || isCanzone;
    var isInterludeSupport = (piece && piece.interlude === true) || tags.indexOf('interlude') >= 0;
    var supportsVocalRest = (piece && piece.vocalRestSupport === true) || tags.indexOf('vocal_rest_support') >= 0;
    var goodBetweenBlocks = (piece && piece.goodBetweenBlocks === true) || tags.indexOf('good_between_blocks') >= 0;
    var goodBeforeClimax = (piece && piece.goodBeforeClimax === true) || tags.indexOf('good_before_climax') >= 0;
    var isSupportivePiano = isPianoSolo && (isInterludeSupport || supportsVocalRest || goodBetweenBlocks || goodBeforeClimax);
    var isTangoCompatiblePiano = isPianoSolo && (isTango || tags.indexOf('tango_compatible') >= 0 || tags.indexOf('tango-compatible') >= 0);
    var energyLevel = normalizePlannerLevel(piece && piece.energyLevel, ['low','medium','high']) || '';
    var impactLevel = normalizePlannerLevel(piece && piece.impactLevel, ['light','medium','high']) || '';
    var audienceAppeal = normalizePlannerLevel(piece && piece.audienceAppeal, ['connoisseur','balanced','crowd_pleaser']) || '';
    var vocalLoad = normalizePlannerLevel(piece && piece.vocalLoad, ['light','medium','heavy']) || inferPlannerVocalLoad(category, type, Math.max(0, Number(piece && piece.durationMin) || Number(piece && piece.approximateDurationMin) || 0), normalizePlannerLevel(piece && piece.texture, ['solo','duet','trio','ensemble','piano_solo']) || inferPlannerTexture(category), (piece && piece.practicalTags) || []);
    var galaRole = normalizePlannerLevel(piece && piece.galaRole, ['opener','contrast','lyrical_center','climax','finale','encore','vocal_rest_support']) || inferPlannerGalaRole(category, safeString(piece && piece.dramaticRole).trim().toLowerCase(), normalizePlannerLevel(piece && piece.styleBucket, ['opera','operetta','canzone','intermezzo']) || inferPlannerStyleBucket(piece, category, type, tags, tags), isInterludeSupport, normalizePlannerLevel(piece && piece.recoveryValue, ['none','partial','strong']) || inferPlannerRecoveryValue(category, normalizePlannerLevel(piece && piece.texture, ['solo','duet','trio','ensemble','piano_solo']) || inferPlannerTexture(category), isInterludeSupport, supportsVocalRest));
    var texture = normalizePlannerLevel(piece && piece.texture, ['solo','duet','trio','ensemble','piano_solo']) || inferPlannerTexture(category);
    var styleBucket = normalizePlannerLevel(piece && piece.styleBucket, ['opera','operetta','canzone','intermezzo']) || inferPlannerStyleBucket(piece, category, type, tags, tags);
    var recoveryValue = normalizePlannerLevel(piece && piece.recoveryValue, ['none','partial','strong']) || inferPlannerRecoveryValue(category, texture, isInterludeSupport, supportsVocalRest);
    var bestDurationFit = (function (value) {
      value = safeString(value || '').trim().toLowerCase();
      return ['30','45','60','all'].indexOf(value) >= 0 ? value : 'all';
    })(piece && piece.bestDurationFit);
    return {
      category: category,
      type: type,
      voiceCategory: voiceCategory,
      language: language,
      tags: tags,
      isOperatic: isOperatic,
      isPianoSolo: isPianoSolo,
      isOperaticPiano: isOperaticPiano,
      isTango: isTango,
      isArtSong: isArtSong,
      isCanzone: isCanzone,
      isItalian: isItalian,
      isInterludeSupport: isInterludeSupport,
      supportsVocalRest: supportsVocalRest,
      goodBetweenBlocks: goodBetweenBlocks,
      goodBeforeClimax: goodBeforeClimax,
      isSupportivePiano: isSupportivePiano,
      isTangoCompatiblePiano: isTangoCompatiblePiano,
      energyLevel: energyLevel,
      impactLevel: impactLevel,
      audienceAppeal: audienceAppeal,
      vocalLoad: vocalLoad,
      galaRole: galaRole,
      texture: texture,
      styleBucket: styleBucket,
      recoveryValue: recoveryValue,
      bestDurationFit: bestDurationFit
    };
  }
  function pieceFamilyFitTier(piece, family) {
    if (!piece) return 0;
    var key = safeString(family || 'gala').trim().toLowerCase() || 'gala';
    var flags = plannerPieceFlags(piece);
    if (key === 'gala') {
      if (flags.isOperatic) return 3;
      if (flags.isOperaticPiano && flags.isSupportivePiano) return 2;
      if (flags.isOperaticPiano) return 1;
      return 0;
    }
    if (key === 'italian') {
      if (flags.isItalian && (flags.isOperatic || flags.isCanzone || flags.isArtSong)) return 3;
      if (flags.isItalian && flags.isPianoSolo && flags.isSupportivePiano) return 2;
      if (flags.isItalian && flags.isPianoSolo) return 1;
      return 0;
    }
    if (key === 'tango') {
      if (flags.isTango && !flags.isPianoSolo) return 3;
      if (flags.isTangoCompatiblePiano) return 2;
      return 0;
    }
    if (key === 'borders') {
      if (flags.isTango) return 3;
      if (flags.isOperatic || flags.isArtSong || flags.isCanzone) return 2;
      if (flags.isPianoSolo && flags.isSupportivePiano) return 2;
      if (flags.isPianoSolo) return 1;
      return 1;
    }
    return 0;
  }
  function galaOptionsForBlueprint(bp) {
    return safeBlueprintGalaOptions(bp && bp.galaOptions, bp && bp.targetDuration);
  }
  function galaBestDurationMatches(piece, targetDuration) {
    var fit = safeString(plannerPieceFlags(piece).bestDurationFit || 'all').trim().toLowerCase();
    return fit === 'all' || fit === String(Math.max(0, Number(targetDuration) || 0));
  }
  function galaProgrammeState(bp) {
    var items = ((bp && bp.items) || []).map(function (it) { return getPlannerItemById(it && it.pieceId); }).filter(Boolean);
    var stateSummary = {
      items: items,
      breathingPoints: 0,
      heavyTenorRun: 0,
      hasContrast: false,
      lastIsStrongEnding: false
    };
    var maxHeavyRun = 0;
    var currentHeavyRun = 0;
    var styleBuckets = {};
    var textures = {};
    items.forEach(function (piece) {
      var flags = plannerPieceFlags(piece);
      if (flags.recoveryValue === 'partial' || flags.recoveryValue === 'strong' || flags.galaRole === 'vocal_rest_support') stateSummary.breathingPoints += 1;
      if (piece.includesTenor === true && flags.texture === 'solo' && flags.vocalLoad === 'heavy') {
        currentHeavyRun += 1;
        if (currentHeavyRun > maxHeavyRun) maxHeavyRun = currentHeavyRun;
      } else {
        currentHeavyRun = 0;
      }
      if (flags.styleBucket) styleBuckets[flags.styleBucket] = true;
      if (flags.texture) textures[flags.texture] = true;
    });
    stateSummary.heavyTenorRun = maxHeavyRun;
    stateSummary.hasContrast = Object.keys(styleBuckets).length >= 2 || Object.keys(textures).length >= 2;
    if (items.length) {
      var finaleFlags = plannerPieceFlags(items[items.length - 1]);
      stateSummary.lastIsStrongEnding = finaleFlags.galaRole === 'finale' || finaleFlags.galaRole === 'climax' || finaleFlags.audienceAppeal === 'crowd_pleaser' || finaleFlags.impactLevel === 'high';
    }
    return stateSummary;
  }
  function galaSupportTarget(targetDuration) {
    var target = Math.max(0, Number(targetDuration) || 30);
    if (target >= 60) return 2;
    if (target >= 45) return 1;
    return 1;
  }
  function galaSupportLimit(targetDuration) {
    var target = Math.max(0, Number(targetDuration) || 30);
    if (target >= 60) return 2;
    return 1;
  }
  function plannerOfferFamilyFitTier(piece, bp, family) {
    var key = safeString(family || (bp && bp.family) || 'gala').trim().toLowerCase() || 'gala';
    if (key !== 'gala') return pieceFamilyFitTier(piece, key);
    var flags = plannerPieceFlags(piece);
    var options = galaOptionsForBlueprint(bp);
    if (flags.isTango || flags.isArtSong) return 0;
    if (flags.isPianoSolo) {
      if (!options.allowPianoInterludes) return 0;
      if (flags.isOperaticPiano || flags.styleBucket === 'intermezzo' || flags.recoveryValue === 'strong' || flags.recoveryValue === 'partial') return 2;
      return 0;
    }
    if (flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone') {
      return options.includeContrast ? 2 : 0;
    }
    if (flags.isOperatic) return 3;
    return 0;
  }
  function plannerOfferVoiceMatch(piece, formation, showWithoutTenor) {
    if (!piece) return false;
    if (showWithoutTenor) return true;
    if (piece.includesTenor === true) return true;
    if (safeString(piece.category).trim().toLowerCase() === 'piano_solo') return true;
    var formationVoices = plannerVoicesFromFormationLabel(formation);
    if (!formationVoices.length) return false;
    var pieceVoices = plannerVoicesFromItem(piece);
    return pieceVoices.some(function (voice) { return formationVoices.indexOf(voice) >= 0; });
  }
  function plannerPieceFormationEligibleForOffer(piece, bp) {
    if (!piece) return false;
    var familyTier = plannerOfferFamilyFitTier(piece, bp, bp && bp.family);
    return plannerPieceStrictFormationMatch(piece, bp && bp.formation, { allowPianoSolo: familyTier > 0 });
  }
  function plannerFamilySelectorPriority(piece, family, formation, bp) {
    if (!piece) return 0;
    var key = safeString(family || 'gala').trim().toLowerCase() || 'gala';
    var flags = plannerPieceFlags(piece);
    var voices = plannerVoicesFromItem(piece);
    var formationVoices = plannerVoicesFromFormationLabel(formation);
    var voiceCategory = safeString(piece.voiceCategory).trim().toLowerCase();
    var score = plannerOfferFamilyFitTier(piece, bp, key) * 100;
    var formationMatch = pieceMatchesFormation(piece, formation);
    var collaboratorCovered = voices.some(function (voice) { return formationVoices.indexOf(voice) >= 0; });
    if (formationMatch) score += 10;
    if (piece.includesTenor === true) score += 8;
    if (collaboratorCovered) score += 4;
    if (key === 'gala' && bp) {
      var options = galaOptionsForBlueprint(bp);
      var summary = galaProgrammeState(bp);
      var supportTarget = galaSupportTarget(bp.targetDuration);
      var supportLimit = galaSupportLimit(bp.targetDuration);
      var supportPiece = flags.recoveryValue === 'partial' || flags.recoveryValue === 'strong' || flags.galaRole === 'vocal_rest_support';
      var contrastPiece = flags.galaRole === 'contrast' || flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone' || flags.texture !== 'solo';
      if (bp.targetDuration <= 30) {
        if (flags.texture === 'solo') score += 12;
        if (flags.galaRole === 'opener' || flags.galaRole === 'finale' || flags.galaRole === 'climax') score += 8;
        if (supportPiece) score += summary.breathingPoints < supportLimit ? 6 : -10;
      } else if (bp.targetDuration <= 45) {
        if (options.preferVocalPacing && supportPiece) score += summary.breathingPoints < supportTarget ? 14 : 4;
        if (!summary.hasContrast && contrastPiece) score += 8;
      } else {
        if (options.preferVocalPacing && supportPiece) score += summary.breathingPoints < supportTarget ? 14 : -2;
        if (!summary.hasContrast && contrastPiece) score += 9;
        if (flags.galaRole === 'finale' || flags.galaRole === 'climax') score += 6;
      }
      if (!galaBestDurationMatches(piece, bp.targetDuration)) score -= 4;
      if (summary.heavyTenorRun >= 2 && piece.includesTenor === true && flags.texture === 'solo' && flags.vocalLoad === 'heavy') score -= 10;
    }
    if (key === 'gala') {
      if (voiceCategory === 'tenor_aria') score += 34;
      else if (/^tenor_.*_duet$/.test(voiceCategory)) score += 30;
      else if ((flags.category === 'trio' || flags.category === 'quartet' || flags.category === 'ensemble') && voices.indexOf('tenor') >= 0) score += 26;
      else if ((voiceCategory === 'soprano_aria' || voiceCategory === 'mezzo_aria' || voiceCategory === 'baritone_aria') && collaboratorCovered) score += 22;
      else if (flags.isOperatic) score += 16;
      else if (flags.isOperaticPiano) score += flags.isSupportivePiano ? 16 : 10;
      if (flags.isPianoSolo && flags.supportsVocalRest) score += 4;
      if (flags.goodBetweenBlocks) score += 4;
      if (flags.goodBeforeClimax) score += 2;
    } else if (key === 'italian') {
      if (voiceCategory === 'tenor_aria' && flags.isItalian) score += 34;
      else if (flags.isItalian && flags.isCanzone) score += 30;
      else if (flags.isItalian && flags.isArtSong) score += 26;
      else if (flags.isItalian && /^tenor_.*_duet$/.test(voiceCategory)) score += 24;
      else if (flags.isItalian && (flags.category === 'trio' || flags.category === 'quartet' || flags.category === 'ensemble')) score += 20;
      else if (flags.isItalian && (voiceCategory === 'soprano_aria' || voiceCategory === 'mezzo_aria' || voiceCategory === 'baritone_aria') && collaboratorCovered) score += 18;
      else if (flags.isItalian && flags.isPianoSolo) score += flags.isSupportivePiano ? 16 : 10;
      if (flags.isItalian && flags.goodBetweenBlocks) score += 4;
      if (flags.isItalian && flags.goodBeforeClimax) score += 2;
    } else if (key === 'tango') {
      if (flags.isTango && piece.includesTenor === true) score += 34;
      else if (flags.isTango && (flags.category === 'duet' || flags.category === 'trio' || flags.category === 'quartet' || flags.category === 'ensemble')) score += 24;
      else if (flags.isTangoCompatiblePiano) score += flags.isSupportivePiano ? 16 : 12;
      else if (flags.isTango) score += 18;
    } else if (key === 'borders') {
      score += plannerBordersVarietyScore(piece, currentBlueprint()) * 6;
      if (flags.language) score += 2;
      if (flags.isArtSong || flags.isCanzone || flags.isTango) score += 3;
      if (flags.isPianoSolo && flags.isSupportivePiano) score += 10;
    }
    score += plannerStyleFocusScore(piece, bp);
    return score;
  }
  function plannerBordersVarietyScore(piece, bp) {
    var flags = plannerPieceFlags(piece);
    var langs = {};
    ((bp && bp.items) || []).forEach(function (it) {
      var selectedPiece = getPlannerItemById(it && it.pieceId);
      var key = safeString(selectedPiece && selectedPiece.language).trim().toUpperCase();
      if (key) langs[key] = true;
    });
    var score = 0;
    var lang = flags.language;
    if (lang && !langs[lang]) score += 3;
    if (flags.tags.indexOf('borders') >= 0 || flags.tags.indexOf('multilingual') >= 0 || flags.tags.indexOf('cross-border') >= 0) score += 2;
    if (flags.category === 'tango' || flags.category === 'art_song') score += 1;
    return score;
  }
  function programBuilderApproxDuration(type, titleKey) {
    var specific = {
      'celeste_aida': 6,
      'e_la_solita_storia_del_pastore_lamento_di_federico': 5,
      'ella_mi_fu_rapita_parmi_veder_le_lagrime': 6,
      'erlkonig': 5,
      'vesennie_vody': 4,
      'dichterliebe_op_48_complete_cycle': 30,
      'tre_sonetti_di_petrarca': 12,
      'cinco_canciones_populares_argentinas': 15
    };
    if (Number.isFinite(Number(specific[titleKey]))) return specific[titleKey];
    if (type === 'piano-solo') return 3;
    if (type === 'duet' || type === 'ensemble') return 5;
    if (type === 'aria' || type === 'operetta') return 5;
    if (type === 'tango' || type === 'lied' || type === 'song' || type === 'canzone' || type === 'sacred') return 4;
    return 4;
  }
  function makeHistoricalConcertLookup() {
    var src = programBuilderHistoricalSource();
    var map = {};
    (Array.isArray(src.concerts) ? src.concerts : []).forEach(function (concert) {
      var cid = safeString(concert.id).trim();
      (Array.isArray(concert.programmeItems) ? concert.programmeItems : []).forEach(function (title) {
        var key = programBuilderNormalizeKey(title);
        if (!key) return;
        if (!Array.isArray(map[key])) map[key] = [];
        if (map[key].indexOf(cid) < 0) map[key].push(cid);
      });
    });
    return map;
  }
  function programBuilderHistoricalOverrides() {
    return {
      composers: {
        'donizetti': 'Gaetano Donizetti',
        'cilea': 'Francesco Cilea',
        'rossini': 'Gioachino Rossini',
        'puccini': 'Giacomo Puccini',
        'verdi': 'Giuseppe Verdi',
        'bizet': 'Georges Bizet',
        'gounod': 'Charles Gounod',
        'massenet': 'Jules Massenet',
        'mozart': 'W. A. Mozart',
        'tosti': 'Francesco Paolo Tosti',
        'gastaldon': 'Stanislao Gastaldon',
        'donaudy': 'Stefano Donaudy',
        'leoncavallo': 'Ruggero Leoncavallo',
        'handel': 'George Frideric Handel',
        'haydn': 'Joseph Haydn',
        'beethoven': 'Ludwig van Beethoven',
        'schubert': 'Franz Schubert',
        'rachmaninov': 'Sergei Rachmaninov',
        'richard strauss': 'Richard Strauss',
        'liszt': 'Franz Liszt',
        'guastavino': 'Carlos Guastavino',
        'ginastera': 'Alberto Ginastera',
        'obradors': 'Fernando Obradors',
        'luzzatti': 'Juan Carlos Rodríguez Luzzatti',
        'carlos gardel': 'Carlos Gardel',
        'mariano mores': 'Mariano Mores',
        'astor piazzolla': 'Astor Piazzolla',
        'sebastian iradier': 'Sebastián Iradier',
        'bernstein': 'Leonard Bernstein',
        'di capua': 'Eduardo di Capua',
        'gershwin': 'George Gershwin',
        'carlos lopez buchardo': 'Carlos López Buchardo'
      },
      duetFormations: {
        'all_idea_di_quel_metallo': ['Tenor + Baritone + Piano'],
        'venti_scudi': ['Tenor + Baritone + Piano'],
        'o_mimi_tu_piu_non_torni': ['Tenor + Baritone + Piano'],
        'dio_che_nell_alma_infondere': ['Tenor + Baritone + Piano'],
        'ashton_tra_queste_mura': ['Tenor + Baritone + Piano'],
        'solenne_in_quest_ora': ['Tenor + Baritone + Piano'],
        'au_fond_du_temple_saint': ['Tenor + Baritone + Piano'],
        'o_soave_fanciulla': ['Tenor + Soprano + Piano'],
        'parigi_o_cara': ['Tenor + Soprano + Piano'],
        'ardir_ha_forse_il_cielo': ['Tenor + Soprano + Piano'],
        'parle_moi_de_ma_mere': ['Tenor + Soprano + Piano'],
        'nous_vivrons_a_paris': ['Tenor + Soprano + Piano'],
        'konstanze_konstanze': ['Tenor + Soprano + Piano'],
        'caro_elisir_sei_mio': ['Tenor + Soprano + Piano'],
        'in_un_coupe': ['Tenor + Baritone + Piano'],
        'toi_vous': ['Tenor + Soprano + Piano'],
        'signor_ne_principe': ['Tenor + Soprano + Piano'],
        'vogliatemi_bene': ['Tenor + Soprano + Piano'],
        'barcarolle': ['Tenor + Soprano + Piano'],
        'tonight_tonight': ['Tenor + Soprano + Piano'],
        'por_una_cabeza': ['Tenor + Baritone + Piano'],
        'come_in_quest_ora_bruna': ['Tenor + Baritone + Piano']
      },
      typeOverrides: {
        'all_idea_di_quel_metallo': 'duet',
        'venti_scudi': 'duet',
        'o_mimi_tu_piu_non_torni': 'duet',
        'dio_che_nell_alma_infondere': 'duet',
        'ashton_tra_queste_mura': 'duet',
        'solenne_in_quest_ora': 'duet',
        'au_fond_du_temple_saint': 'duet',
        'o_soave_fanciulla': 'duet',
        'parigi_o_cara': 'duet',
        'ardir_ha_forse_il_cielo': 'duet',
        'parle_moi_de_ma_mere': 'duet',
        'nous_vivrons_a_paris': 'duet',
        'konstanze_konstanze': 'duet',
        'caro_elisir_sei_mio': 'duet',
        'in_un_coupe': 'duet',
        'fra_gli_amplessi': 'duet',
        'toi_vous': 'duet',
        'signor_ne_principe': 'duet',
        'vogliatemi_bene': 'duet',
        'las_hijas_del_zebedeo': 'operetta',
        'dichterliebe_op_48_complete_cycle': 'lied',
        'tre_sonetti_di_petrarca': 'lied',
        'cinco_canciones_populares_argentinas': 'song'
      },
      workOverrides: {
        'grazie_agli_inganni_tuoi': 'Mozart duet reference',
        'las_hijas_del_zebedeo': 'Zarzuela reference',
        'ideale': 'Romanza da salotto',
        'musica_proibita': 'Romanza da salotto',
        'l_alba_separa_dalla_luce_l_ombra': 'Romanza da salotto',
        'la_danza': 'Les soirées musicales',
        'ombra_mai_fu': 'Serse',
        'dichterliebe_op_48_complete_cycle': 'Dichterliebe, op. 48',
        'tre_sonetti_di_petrarca': 'Tre sonetti di Petrarca',
        'cinco_canciones_populares_argentinas': 'Cinco canciones populares argentinas',
        'you_ll_never_walk_alone': 'Carousel',
        'tonight': 'West Side Story',
        'maria': 'West Side Story',
        'o_holy_night': 'Cantique de Noël',
        'stille_nacht': 'Christmas song'
      },
      composerOverrides: {
        'grazie_agli_inganni_tuoi': 'W. A. Mozart',
        'las_hijas_del_zebedeo': 'Ruperto Chapí',
        'you_ll_never_walk_alone': 'Richard Rodgers',
        'o_holy_night': 'Adolphe Adam',
        'stille_nacht': 'Franz Xaver Gruber'
      },
      manualReview: {
        'grazie_agli_inganni_tuoi': 'Source lacks the full work/context; confirm the exact Mozart excerpt before using publicly.',
        'in_un_coupe': 'Source identifies the excerpt but exact ensemble context should be confirmed.',
        'fra_gli_amplessi': 'Confirm exact dramatic context and preferred formation before offering publicly.',
        'las_hijas_del_zebedeo': 'Source only names the zarzuela reference; confirm exact excerpt and attribution.',
        'dichterliebe_op_48_complete_cycle': 'Cycle reference imported for archive value; split into individual songs if needed for offers.',
        'tre_sonetti_di_petrarca': 'Cycle reference imported for archive value; split into individual sonnets if needed for offers.',
        'cinco_canciones_populares_argentinas': 'Cycle reference imported for archive value; split into individual songs if needed for offers.'
      }
    };
  }
  function inferHistoricalLanguage(sectionKey, title, work, composer) {
    var titleKey = programBuilderSlug(title);
    var workKey = programBuilderNormalizeKey(work);
    var composerKey = programBuilderNormalizeKey(composer);
    var operaFrenchWorks = { 'les pecheurs de perles': true, 'romeo et juliette': true, 'carmen': true, 'manon': true };
    var operaItalianWorks = { 'l elisir d amore': true, 'l arlesiana': true, 'il barbiere di siviglia': true, 'la boheme': true, 'don carlo': true, 'lucia di lammermoor': true, 'la forza del destino': true, 'tosca': true, 'la traviata': true, 'cosi fan tutte': true, 'manon lescaut': true, 'rigoletto': true, 'madama butterfly': true, 'aida': true, 'simon boccanegra': true, 'don giovanni': true };
    if (sectionKey === 'opera') {
      if (operaFrenchWorks[workKey]) return 'FR';
      if (operaItalianWorks[workKey]) return 'IT';
      if (workKey === 'die entfuhrung aus dem serail') return 'DE';
      if (titleKey === 'las_hijas_del_zebedeo') return 'ES';
    }
    if (sectionKey === 'popular') {
      if (titleKey === 'la_paloma') return 'ES';
      if (titleKey === 'o_sole_mio') return 'IT';
      if (titleKey === 'stille_nacht') return 'DE';
      return 'EN';
    }
    if (sectionKey === 'tango') return 'ES';
    if (composerKey.indexOf('tosti') >= 0 || composerKey.indexOf('gastaldon') >= 0 || composerKey.indexOf('donaudy') >= 0 || composerKey.indexOf('leoncavallo') >= 0 || titleKey === 'sole_e_amore' || titleKey === 'la_danza' || titleKey === 'ombra_mai_fu' || titleKey === 'tre_sonetti_di_petrarca') return 'IT';
    if (composerKey.indexOf('haydn') >= 0) return (/o_tuneful_voice|fidelity/.test(titleKey) ? 'EN' : 'DE');
    if (composerKey.indexOf('mozart') >= 0 || composerKey.indexOf('beethoven') >= 0 || composerKey.indexOf('schubert') >= 0 || composerKey.indexOf('richard strauss') >= 0) return 'DE';
    if (composerKey.indexOf('rachmaninov') >= 0) return 'RU';
    if (composerKey.indexOf('guastavino') >= 0 || composerKey.indexOf('ginastera') >= 0 || composerKey.indexOf('obradors') >= 0 || composerKey.indexOf('luzzatti') >= 0 || composerKey.indexOf('buchardo') >= 0) return 'ES';
    return '';
  }
  function inferHistoricalTags(sectionKey, type, language, title) {
    var tags = [];
    if (sectionKey === 'opera') tags.push('gala');
    if (sectionKey === 'tango' || type === 'tango') tags.push('tango');
    if (sectionKey === 'recital') tags.push('recital');
    if (type === 'duet') tags.push('duet');
    if (type === 'ensemble') tags.push('ensemble');
    if (type === 'lied') tags.push('lied');
    if (type === 'sacred') tags.push('sacred');
    if (type === 'operetta') tags.push('operetta');
    if (type === 'piano-solo') tags.push('interlude');
    if (safeString(language).toUpperCase() === 'IT') tags.push('italian');
    if ((safeString(language).toUpperCase() === 'DE' || safeString(language).toUpperCase() === 'EN' || safeString(language).toUpperCase() === 'FR' || safeString(language).toUpperCase() === 'ES' || safeString(language).toUpperCase() === 'RU') && tags.indexOf('tango') < 0 && sectionKey !== 'opera') tags.push('borders');
    if (sectionKey === 'popular') tags.push('popular');
    if (title === "Core 'ngrato" || title === 'Granada' || title === 'O sole mio') tags.push('encore');
    return programBuilderUniqueStrings(tags);
  }
  function parseHistoricalRepertoireLine(sectionKey, rawLine, concertLookup) {
    var overrides = programBuilderHistoricalOverrides();
    var line = safeString(rawLine).trim();
    if (!line) return null;
    var parts = line.split(' — ').map(function (part) { return safeString(part).trim(); }).filter(Boolean);
    var title = '';
    var work = '';
    var composer = '';
    if (/^[“"]/.test(line)) {
      title = safeString(parts[0]).replace(/[“”"]/g, '').trim();
      if (parts.length >= 3) {
        work = parts[1];
        composer = parts[2];
      } else if (parts.length >= 2) {
        composer = parts[1];
      }
    } else {
      composer = parts[0] || '';
      title = parts[1] || '';
      work = parts[2] || '';
    }
    var titleKey = programBuilderSlug(title);
    var composerKey = programBuilderNormalizeKey(composer);
    composer = safeString(overrides.composerOverrides[titleKey] || overrides.composers[composerKey] || composer).trim();
    work = safeString(overrides.workOverrides[titleKey] || work).trim();
    var type = sectionKey === 'opera' ? 'aria' : (sectionKey === 'tango' ? 'tango' : (sectionKey === 'popular' ? 'song' : 'lied'));
    type = safeString(overrides.typeOverrides[titleKey] || type).trim().toLowerCase() || 'other';
    var language = inferHistoricalLanguage(sectionKey, title, work, composer);
    var formations = overrides.duetFormations[titleKey] || (function () {
      if (type === 'duet' || type === 'ensemble') return ['Voice(s) + Piano'];
      if (type === 'piano-solo') return ['Piano Solo'];
      return ['Tenor + Piano'];
    })();
    var reviewNote = safeString(overrides.manualReview[titleKey]).trim();
    return {
      id: titleKey,
      title: title,
      composer: composer,
      work: work,
      type: type,
      language: language,
      durationMin: programBuilderApproxDuration(type, titleKey),
      formations: clone(formations),
      readiness: reviewNote ? 'working' : 'ready',
      tags: inferHistoricalTags(sectionKey, type, language, title),
      notes: programBuilderHistoricalSource().sourceCompilationNote + (reviewNote ? (' Manual review: ' + reviewNote) : ''),
      publicNotes: '',
      sortOrder: 0,
      performanceStatus: 'performed',
      performedIn: clone(concertLookup[programBuilderNormalizeKey(title)] || []),
      reviewStatus: reviewNote ? 'manual_review' : 'clean',
      excludeFromOffers: type === 'piano-solo'
    };
  }
  function makeHistoricalRepertoireImport() {
    var src = programBuilderHistoricalSource();
    var concertLookup = makeHistoricalConcertLookup();
    var out = [];
    [['opera', 'opera'], ['recital', 'recital'], ['tango', 'tango'], ['popular', 'popular']].forEach(function (pair) {
      var sectionKey = pair[0];
      (Array.isArray(src.repertoireSections && src.repertoireSections[sectionKey]) ? src.repertoireSections[sectionKey] : []).forEach(function (line) {
        var parsed = parseHistoricalRepertoireLine(sectionKey, line, concertLookup);
        if (parsed) out.push(parsed);
      });
    });
    (Array.isArray(src.extraPieces) ? src.extraPieces : []).forEach(function (item) {
      var title = safeString(item.title).trim();
      if (!title) return;
      var titleKey = programBuilderSlug(title);
      var reviewNote = safeString(item.reviewNote).trim();
      out.push({
        id: titleKey,
        title: title,
        composer: safeString(item.composer).trim(),
        work: safeString(item.work).trim(),
        type: safeString(item.type || 'other').trim().toLowerCase() || 'other',
        language: safeString(item.language).trim(),
        durationMin: Math.max(0, Number(item.durationMin) || programBuilderApproxDuration(item.type, titleKey)),
        formations: programBuilderUniqueStrings(Array.isArray(item.formations) ? item.formations : [item.formations]),
        readiness: safeString(item.readiness || (reviewNote ? 'working' : 'ready')).trim().toLowerCase() || 'ready',
        tags: programBuilderUniqueStrings(Array.isArray(item.tags) ? item.tags : []).map(function (tag) { return safeString(tag).toLowerCase(); }),
        notes: 'Imported from historical concert programme.' + (reviewNote ? (' Manual review: ' + reviewNote) : ''),
        publicNotes: '',
        sortOrder: 0,
        performanceStatus: 'performed',
        performedIn: clone(concertLookup[programBuilderNormalizeKey(title)] || []),
        reviewStatus: reviewNote ? 'manual_review' : 'clean',
        excludeFromOffers: item.excludeFromOffers === true
      });
    });
    return out;
  }
  function makeOutsideRepertoireImport() {
    var src = programBuilderSuggestionSource();
    return (Array.isArray(src.items) ? src.items : []).map(function (item, idx) {
      var seeded = clone(item);
      if (!safeString(seeded.id).trim()) seeded.id = 'outside_' + programBuilderSlug(seeded.title || ('item_' + (idx + 1)));
      if (!safeString(seeded.readiness).trim()) seeded.readiness = 'idea';
      seeded.performanceStatus = '';
      seeded.performedIn = [];
      seeded.publicNotes = safeString(seeded.publicNotes);
      seeded.sortOrder = Number.isFinite(Number(seeded.sortOrder)) ? Number(seeded.sortOrder) : ((idx + 1) * 10);
      seeded.reviewStatus = safeString(seeded.reviewStatus || 'clean').trim().toLowerCase() === 'manual_review' ? 'manual_review' : 'clean';
      return normalizePlannerItemRecord(seeded, idx);
    });
  }
  function mergeHistoricalRepertoireImport(doc, importedItems) {
    var changed = false;
    var byKey = {};
    (doc.items || []).forEach(function (item) {
      byKey[[programBuilderNormalizeKey(item.title), programBuilderNormalizeKey(item.composer), programBuilderNormalizeKey(item.work)].join('|')] = item;
    });
    importedItems.forEach(function (item) {
      var key = [programBuilderNormalizeKey(item.title), programBuilderNormalizeKey(item.composer), programBuilderNormalizeKey(item.work)].join('|');
      var existing = byKey[key];
      if (!existing) {
        doc.items.push(clone(item));
        byKey[key] = doc.items[doc.items.length - 1];
        changed = true;
        return;
      }
      if (!safeString(existing.id).trim()) { existing.id = item.id; changed = true; }
      if (!safeString(existing.title).trim() && item.title) { existing.title = item.title; changed = true; }
      if (!safeString(existing.composer).trim() && item.composer) { existing.composer = item.composer; changed = true; }
      if (!safeString(existing.work).trim() && item.work) { existing.work = item.work; changed = true; }
      if (!safeString(existing.type).trim() && item.type) { existing.type = item.type; changed = true; }
      if (!safeString(existing.language).trim() && item.language) { existing.language = item.language; changed = true; }
      if (!(Number(existing.durationMin) > 0) && Number(item.durationMin) > 0) { existing.durationMin = item.durationMin; changed = true; }
      var mergedFormations = programBuilderUniqueStrings((existing.formations || []).concat(item.formations || []));
      if (JSON.stringify(mergedFormations) !== JSON.stringify(existing.formations || [])) { existing.formations = mergedFormations; changed = true; }
      var mergedTags = programBuilderUniqueStrings((existing.tags || []).concat(item.tags || []).map(function (tag) { return safeString(tag).toLowerCase(); }));
      if (JSON.stringify(mergedTags) !== JSON.stringify(existing.tags || [])) { existing.tags = mergedTags; changed = true; }
      var mergedPerformedIn = programBuilderUniqueStrings((existing.performedIn || []).concat(item.performedIn || []));
      if (JSON.stringify(mergedPerformedIn) !== JSON.stringify(existing.performedIn || [])) { existing.performedIn = mergedPerformedIn; changed = true; }
      if (safeString(item.performanceStatus) === 'performed' && safeString(existing.performanceStatus) !== 'performed') { existing.performanceStatus = 'performed'; changed = true; }
      if (safeString(item.reviewStatus) === 'manual_review' && safeString(existing.reviewStatus) !== 'manual_review') { existing.reviewStatus = 'manual_review'; changed = true; }
      if (safeString(item.reviewStatus) === 'manual_review' && safeString(existing.readiness) === 'ready') { existing.readiness = 'working'; changed = true; }
      if (item.offerOnly === true && existing.offerOnly !== true) { existing.offerOnly = true; changed = true; }
      if (item.excludeFromOffers === true && existing.excludeFromOffers !== true) { existing.excludeFromOffers = true; changed = true; }
      if (!safeString(existing.notes).trim() && item.notes) { existing.notes = item.notes; changed = true; }
      if (!safeString(existing.readiness).trim() && item.readiness) { existing.readiness = item.readiness; changed = true; }
    });
    return changed;
  }
  function mergeOutsideRepertoireImport(doc, importedItems) {
    var changed = false;
    var byKey = {};
    (doc.items || []).forEach(function (item) {
      byKey[[programBuilderNormalizeKey(item.title), programBuilderNormalizeKey(item.composer), programBuilderNormalizeKey(item.work)].join('|')] = item;
    });
    importedItems.forEach(function (item) {
      var key = [programBuilderNormalizeKey(item.title), programBuilderNormalizeKey(item.composer), programBuilderNormalizeKey(item.work)].join('|');
      var existing = byKey[key];
      if (!existing) {
        doc.items.push(clone(item));
        byKey[key] = doc.items[doc.items.length - 1];
        changed = true;
        return;
      }
      if (!safeString(existing.category).trim() && item.category) { existing.category = item.category; changed = true; }
      if (!safeString(existing.voiceCategory).trim() && item.voiceCategory) { existing.voiceCategory = item.voiceCategory; changed = true; }
      if (!safeString(existing.primaryVoice).trim() && item.primaryVoice) { existing.primaryVoice = item.primaryVoice; changed = true; }
      var mergedPaired = normalizePlannerVoiceList((existing.pairedVoices || []).concat(item.pairedVoices || []));
      if (JSON.stringify(mergedPaired) !== JSON.stringify(existing.pairedVoices || [])) { existing.pairedVoices = mergedPaired; changed = true; }
      if (item.includesTenor === true && existing.includesTenor !== true) { existing.includesTenor = true; changed = true; }
      if (!(Number(existing.approximateDurationMin) > 0) && Number(item.approximateDurationMin) > 0) { existing.approximateDurationMin = item.approximateDurationMin; changed = true; }
      if (!(Number(existing.durationMin) > 0) && Number(item.durationMin) > 0) { existing.durationMin = item.durationMin; changed = true; }
      var mergedFormations = programBuilderUniqueStrings((existing.formations || []).concat(item.formations || []));
      if (JSON.stringify(mergedFormations) !== JSON.stringify(existing.formations || [])) { existing.formations = mergedFormations; changed = true; }
      var mergedFitTags = programBuilderUniqueStrings((existing.fitTags || []).concat(item.fitTags || []).concat(existing.tags || []).concat(item.tags || []).map(function (tag) { return safeString(tag).toLowerCase(); }));
      if (JSON.stringify(mergedFitTags) !== JSON.stringify(existing.fitTags || [])) { existing.fitTags = mergedFitTags; changed = true; }
      if (!safeString(existing.sourceGroup).trim() && item.sourceGroup) { existing.sourceGroup = item.sourceGroup; changed = true; }
      if (!safeString(existing.suggestionGroup).trim() && item.suggestionGroup) { existing.suggestionGroup = item.suggestionGroup; changed = true; }
      if (!safeString(existing.notes).trim() && item.notes) { existing.notes = item.notes; changed = true; }
      if (safeString(existing.availabilityStatus).trim().toLowerCase() === 'outside_repertoire') {
        if (!safeString(existing.readiness).trim() && item.readiness) { existing.readiness = item.readiness; changed = true; }
      }
    });
    return changed;
  }
  function makeConcertHistorySeed() {
    return { meta: { historicalImportVersion: 0 }, concerts: [] };
  }
  function makeHistoricalConcertImport() {
    var src = programBuilderHistoricalSource();
    return (Array.isArray(src.concerts) ? src.concerts : []).map(function (concert) {
      return {
        id: safeString(concert.id).trim(),
        year: Number(concert.year) || 0,
        title: safeString(concert.title).trim(),
        format: safeString(concert.format).trim(),
        collaborators: programBuilderUniqueStrings(concert.collaborators || []),
        programmeItems: programBuilderUniqueStrings(concert.programmeItems || []),
        notes: safeString(concert.notes),
        sourceType: safeString(concert.sourceType || 'historical_manual_import').trim() || 'historical_manual_import'
      };
    });
  }
  function mergeHistoricalConcertImport(doc, importedConcerts) {
    var changed = false;
    var byId = {};
    (doc.concerts || []).forEach(function (concert) { byId[safeString(concert.id).trim()] = concert; });
    importedConcerts.forEach(function (concert) {
      var existing = byId[concert.id];
      if (!existing) {
        doc.concerts.push(clone(concert));
        byId[concert.id] = doc.concerts[doc.concerts.length - 1];
        changed = true;
        return;
      }
      if (!(Number(existing.year) > 0) && Number(concert.year) > 0) { existing.year = concert.year; changed = true; }
      if (!safeString(existing.title).trim() && concert.title) { existing.title = concert.title; changed = true; }
      if (!safeString(existing.format).trim() && concert.format) { existing.format = concert.format; changed = true; }
      var collaborators = programBuilderUniqueStrings((existing.collaborators || []).concat(concert.collaborators || []));
      if (JSON.stringify(collaborators) !== JSON.stringify(existing.collaborators || [])) { existing.collaborators = collaborators; changed = true; }
      var programmeItems = programBuilderUniqueStrings((existing.programmeItems || []).concat(concert.programmeItems || []));
      if (JSON.stringify(programmeItems) !== JSON.stringify(existing.programmeItems || [])) { existing.programmeItems = programmeItems; changed = true; }
      if (!safeString(existing.notes).trim() && concert.notes) { existing.notes = concert.notes; changed = true; }
      if (!safeString(existing.sourceType).trim() && concert.sourceType) { existing.sourceType = concert.sourceType; changed = true; }
    });
    return changed;
  }
  function makePlannerSeed() {
    return {
      meta: { historicalImportVersion: 0 },
      items: [
        { id: 'nemorino_una_furtiva', title: 'Una furtiva lagrima', composer: 'Gaetano Donizetti', work: "L'elisir d'amore", type: 'aria', language: 'IT', durationMin: 5, formations: ['Tenor + Piano'], readiness: 'ready', tags: ['gala', 'italian'], notes: '', publicNotes: '', sortOrder: 10, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false },
        { id: 'rodolfo_che_gelida', title: 'Che gelida manina', composer: 'Giacomo Puccini', work: 'La Bohème', type: 'aria', language: 'IT', durationMin: 5, formations: ['Tenor + Piano'], readiness: 'ready', tags: ['gala', 'italian'], notes: '', publicNotes: '', sortOrder: 20, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false },
        { id: 'tamino_dies_bildnis', title: 'Dies Bildnis ist bezaubernd schön', composer: 'W. A. Mozart', work: 'Die Zauberflöte', type: 'aria', language: 'DE', durationMin: 4, formations: ['Tenor + Piano'], readiness: 'working', tags: ['gala', 'borders'], notes: '', publicNotes: '', sortOrder: 30, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false },
        { id: 'canzone_mamma', title: 'Mamma', composer: 'Cesare Andrea Bixio', work: 'Canzone', type: 'canzone', language: 'IT', durationMin: 4, formations: ['Tenor + Piano'], readiness: 'ready', tags: ['italian'], notes: '', publicNotes: '', sortOrder: 40, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false },
        { id: 'tango_el_dia', title: 'El día que me quieras', composer: 'Carlos Gardel', work: 'Tango', type: 'tango', language: 'ES', durationMin: 4, formations: ['Tenor + Piano'], readiness: 'ready', tags: ['tango'], notes: '', publicNotes: '', sortOrder: 50, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false },
        { id: 'song_border_sogno', title: 'Sogno', composer: 'Francesco Paolo Tosti', work: 'Romanza da salotto', type: 'song', language: 'IT', durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', tags: ['italian', 'borders'], notes: '', publicNotes: '', sortOrder: 60, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false }
      ]
    };
  }
  function defaultBlueprintGalaOptions(targetDuration) {
    var target = Math.max(0, Number(targetDuration) || 30);
    return {
      preferVocalPacing: target >= 45,
      allowPianoInterludes: target >= 45,
      includeContrast: target >= 60,
      buildWithGalaArc: false
    };
  }
  function safeBlueprintGalaOptions(raw, targetDuration) {
    var seed = defaultBlueprintGalaOptions(targetDuration);
    var src = isObject(raw) ? raw : {};
    return {
      preferVocalPacing: src.preferVocalPacing === true || (src.preferVocalPacing !== false && seed.preferVocalPacing),
      allowPianoInterludes: src.allowPianoInterludes === true || (src.allowPianoInterludes !== false && seed.allowPianoInterludes),
      includeContrast: src.includeContrast === true || (src.includeContrast !== false && seed.includeContrast),
      buildWithGalaArc: src.buildWithGalaArc === true
    };
  }
  function makeBlueprintSeed(key) {
    var parts = safeString(key).split('_');
    var family = safeString(parts[0] || 'gala').toLowerCase();
    var target = Number(parts[1]) || 30;
    var autoContext = programOfferAutoContextKey(family, target, 'en');
    return {
      title: defaultBlueprintTitle(family, target, 'en'),
      family: family,
      targetDuration: target,
      formation: 'Tenor + Piano',
      styleFocus: 'mixed',
      buildMode: 'free',
      outputLang: 'en',
      repertoireMode: 'suggested',
      includeDiscoveryIdeas: false,
      galaOptions: safeBlueprintGalaOptions({}, target),
      headerImageMode: 'default',
      headerImageUrl: '',
      contactPhoneOverride: '',
      versionLabel: '',
      titleMode: 'auto',
      titleAutoContext: autoContext,
      description: defaultBlueprintDescription(family, 'en'),
      descriptionMode: 'auto',
      descriptionAutoContext: autoContext,
      flexibleNote: defaultBlueprintFlexibleNote('en'),
      flexibleNoteMode: 'auto',
      flexibleNoteAutoContext: autoContext,
      items: [],
      encoreItems: [],
      includeEncoresInExport: false,
      totalDuration: 0,
      encoreTotalDuration: 0,
      combinedDuration: 0,
      status: 'too short',
      useCase: 'other',
      offerStatus: 'draft',
      sourceMasterId: '',
      sourceMasterLabel: '',
      internalNotes: '',
      createdAt: '',
      updatedAt: '',
      lastSavedAt: '',
      loadedFromSavedOfferId: '',
      feeEstimate: safeBlueprintFeeEstimate({}, { targetDuration: target, formation: 'Tenor + Piano' })
    };
  }
  function makeBlueprintDocSeed() {
    var doc = { blueprints: {}, savedOffers: [] };
    PROGRAM_BUILDER_BLUEPRINT_KEYS.forEach(function (key) {
      doc.blueprints[key] = makeBlueprintSeed(key);
    });
    return doc;
  }
  function normalizeBlueprintRecord(raw, key) {
    var seed = makeBlueprintSeed(key);
    var bp = isObject(raw) ? raw : {};
    var rawItems = (Array.isArray(bp.items) ? bp.items : []).filter(isObject).map(function (it, idx) {
      return {
        pieceId: safeString(it.pieceId).trim(),
        customTitle: safeString(it.customTitle),
        customDuration: Math.max(0, Number(it.customDuration) || 0),
        notes: safeString(it.notes),
        slotId: safeString(it.slotId).trim().toLowerCase(),
        position: Number.isFinite(Number(it.position)) ? Number(it.position) : idx
      };
    });
    var migratedEncoreItems = rawItems.filter(function (it) {
      return /^encore/.test(safeString(it.slotId).trim().toLowerCase());
    }).map(function (it, idx) {
      return {
        pieceId: safeString(it.pieceId).trim(),
        customTitle: safeString(it.customTitle),
        customDuration: Math.max(0, Number(it.customDuration) || 0),
        note: safeString(it.notes),
        position: Number.isFinite(Number(it.position)) ? Number(it.position) : idx
      };
    });
    var normalizedEncoreItems = (Array.isArray(bp.encoreItems) ? bp.encoreItems : []).filter(isObject).map(function (it, idx) {
      return {
        pieceId: safeString(it.pieceId).trim(),
        customTitle: safeString(it.customTitle),
        customDuration: Math.max(0, Number(it.customDuration) || 0),
        note: safeString(it.note || it.notes),
        position: Number.isFinite(Number(it.position)) ? Number(it.position) : idx
      };
    });
    if (!normalizedEncoreItems.length && migratedEncoreItems.length) normalizedEncoreItems = migratedEncoreItems;
    var normalized = {
      title: safeString(bp.title || seed.title),
      family: safeString(bp.family || seed.family).trim().toLowerCase() || seed.family,
      targetDuration: Math.max(0, Number(bp.targetDuration) || seed.targetDuration),
      formation: safeString(bp.formation || seed.formation),
      styleFocus: normalizeProgramOfferStyleFocus(bp.styleFocus || seed.styleFocus),
      buildMode: safeString(bp.buildMode || seed.buildMode).trim().toLowerCase() === 'dramatic_arc' ? 'dramatic_arc' : 'free',
      outputLang: (function (v) {
        v = safeString(v || seed.outputLang || 'en').trim().toLowerCase();
        return LANGS.indexOf(v) >= 0 ? v : 'en';
      })(bp.outputLang),
      repertoireMode: normalizeProgramOfferRepertoireMode(bp.repertoireMode || seed.repertoireMode),
      includeDiscoveryIdeas: bp.includeDiscoveryIdeas === true,
      galaOptions: safeBlueprintGalaOptions(bp.galaOptions || seed.galaOptions, Math.max(0, Number(bp.targetDuration) || seed.targetDuration)),
      headerImageMode: normalizeProgramOfferHeaderImageMode(bp.headerImageMode || seed.headerImageMode),
      headerImageUrl: safeString(bp.headerImageUrl || seed.headerImageUrl),
      contactPhoneOverride: safeString(bp.contactPhoneOverride || seed.contactPhoneOverride || ''),
      versionLabel: safeString(bp.versionLabel),
      titleMode: inferProgramOfferFieldMode('title', bp, seed),
      titleAutoContext: safeString(bp.titleAutoContext || seed.titleAutoContext || ''),
      description: safeString(bp.description || seed.description),
      descriptionMode: inferProgramOfferFieldMode('description', bp, seed),
      descriptionAutoContext: safeString(bp.descriptionAutoContext || seed.descriptionAutoContext || ''),
      flexibleNote: safeString(bp.flexibleNote || seed.flexibleNote),
      flexibleNoteMode: inferProgramOfferFieldMode('flexibleNote', bp, seed),
      flexibleNoteAutoContext: safeString(bp.flexibleNoteAutoContext || seed.flexibleNoteAutoContext || ''),
      items: rawItems.filter(function (it) { return !/^encore/.test(safeString(it.slotId).trim().toLowerCase()); }),
      encoreItems: normalizedEncoreItems.slice(0, 3),
      includeEncoresInExport: bp.includeEncoresInExport === true,
      totalDuration: Math.max(0, Number(bp.totalDuration) || 0),
      encoreTotalDuration: Math.max(0, Number(bp.encoreTotalDuration) || 0),
      combinedDuration: Math.max(0, Number(bp.combinedDuration) || 0),
      status: safeString(bp.status || seed.status),
      useCase: normalizeProgramOfferUseCase(bp.useCase || seed.useCase),
      offerStatus: normalizeSavedProgramStatus(bp.offerStatus || seed.offerStatus, 'venue_offer'),
      sourceMasterId: safeString(bp.sourceMasterId || seed.sourceMasterId || ''),
      sourceMasterLabel: safeString(bp.sourceMasterLabel || seed.sourceMasterLabel || ''),
      internalNotes: safeString(bp.internalNotes),
      createdAt: safeString(bp.createdAt || ''),
      updatedAt: safeString(bp.updatedAt || ''),
      lastSavedAt: safeString(bp.lastSavedAt || bp.updatedAt || ''),
      loadedFromSavedOfferId: safeString(bp.loadedFromSavedOfferId || ''),
      feeEstimate: safeBlueprintFeeEstimate(bp.feeEstimate || seed.feeEstimate, {
        targetDuration: Math.max(0, Number(bp.targetDuration) || seed.targetDuration),
        totalDuration: Math.max(0, Number(bp.totalDuration) || 0),
        formation: safeString(bp.formation || seed.formation)
      })
    };
    if (normalized.family === 'gala') {
      normalized.buildMode = normalized.galaOptions.buildWithGalaArc ? 'dramatic_arc' : 'free';
    }
    normalized.items.sort(function (a, b) { return a.position - b.position; });
    normalized.items.forEach(function (it, idx) { it.position = idx; });
    normalized.encoreItems.sort(function (a, b) { return a.position - b.position; });
    normalized.encoreItems.forEach(function (it, idx) { it.position = idx; });
    return normalized;
  }
  function safeSavedOfferRecord(raw, idx) {
    var family = safeString(raw && raw.family || 'gala').trim().toLowerCase() || 'gala';
    var target = Math.max(0, Number(raw && raw.targetDuration) || 30);
    var saveType = normalizeSavedProgramType(raw && raw.saveType);
    var normalized = normalizeBlueprintRecord(raw, family + '_' + String(target));
    normalized.id = safeString(raw && raw.id || ('saved_offer_' + (idx + 1))).trim();
    normalized.saveType = saveType;
    normalized.status = normalizeSavedProgramStatus(raw && raw.status, saveType);
    normalized.useCase = normalizeProgramOfferUseCase(raw && raw.useCase || normalized.useCase);
    normalized.sourceMasterId = safeString(raw && raw.sourceMasterId || normalized.sourceMasterId || '');
    normalized.sourceMasterLabel = safeString(raw && raw.sourceMasterLabel || normalized.sourceMasterLabel || '');
    normalized.createdAt = safeString(raw && raw.createdAt || normalized.createdAt || '');
    normalized.updatedAt = safeString(raw && raw.updatedAt || normalized.updatedAt || normalized.createdAt || '');
    normalized.lastSavedAt = safeString(raw && raw.lastSavedAt || normalized.updatedAt || normalized.createdAt || '');
    normalized.archivedAt = safeString(raw && raw.archivedAt || '');
    normalized.lastOpenedAt = safeString(raw && raw.lastOpenedAt || '');
    normalized.loadedFromSavedOfferId = '';
    return normalized;
  }
  function safePlannerDoc(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    d.meta = isObject(d.meta) ? d.meta : {};
    d.meta.historicalImportVersion = Math.max(0, Number(d.meta.historicalImportVersion) || 0);
    if (!Array.isArray(d.items)) d.items = [];
    d.items = d.items.filter(isObject).map(normalizePlannerItemRecord);
    return d;
  }
  function safeConcertHistoryDoc(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    d.meta = isObject(d.meta) ? d.meta : {};
    d.meta.historicalImportVersion = Math.max(0, Number(d.meta.historicalImportVersion) || 0);
    if (!Array.isArray(d.concerts)) d.concerts = [];
    d.concerts = d.concerts.filter(isObject).map(function (concert, idx) {
      return {
        id: safeString(concert.id || ('concert_' + (idx + 1))).trim(),
        year: Math.max(0, Number(concert.year) || 0),
        title: safeString(concert.title).trim(),
        format: safeString(concert.format).trim(),
        collaborators: (Array.isArray(concert.collaborators) ? concert.collaborators : safeString(concert.collaborators).split('\n')).map(function (x) { return safeString(x).trim(); }).filter(Boolean),
        programmeItems: (Array.isArray(concert.programmeItems) ? concert.programmeItems : safeString(concert.programmeItems).split('\n')).map(function (x) { return safeString(x).trim(); }).filter(Boolean),
        notes: safeString(concert.notes),
        sourceType: safeString(concert.sourceType || 'historical_manual_import').trim() || 'historical_manual_import'
      };
    });
    d.concerts.sort(function (a, b) {
      if ((Number(b.year) || 0) !== (Number(a.year) || 0)) return (Number(b.year) || 0) - (Number(a.year) || 0);
      return safeString(a.title).localeCompare(safeString(b.title));
    });
    return d;
  }
  function safeBlueprintsDoc(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    if (!isObject(d.blueprints)) d.blueprints = {};
    PROGRAM_BUILDER_BLUEPRINT_KEYS.forEach(function (key) {
      d.blueprints[key] = normalizeBlueprintRecord(d.blueprints[key], key);
    });
    if (!Array.isArray(d.savedOffers)) d.savedOffers = [];
    d.savedOffers = d.savedOffers.filter(isObject).map(safeSavedOfferRecord).sort(function (a, b) {
      var aTime = new Date(safeString(a.updatedAt || a.createdAt || 0)).getTime() || 0;
      var bTime = new Date(safeString(b.updatedAt || b.createdAt || 0)).getTime() || 0;
      return bTime - aTime;
    });
    return d;
  }
  function applyHistoricalProgramBuilderImports() {
    var changed = false;
    if ((state.plannerDoc.meta && Number(state.plannerDoc.meta.historicalImportVersion) || 0) < PROGRAM_BUILDER_HISTORY_IMPORT_VERSION) {
      changed = mergeHistoricalRepertoireImport(state.plannerDoc, makeHistoricalRepertoireImport()) || changed;
      changed = mergeOutsideRepertoireImport(state.plannerDoc, makeOutsideRepertoireImport()) || changed;
      state.plannerDoc.meta.historicalImportVersion = PROGRAM_BUILDER_HISTORY_IMPORT_VERSION;
      changed = true;
    }
    if ((state.concertHistoryDoc.meta && Number(state.concertHistoryDoc.meta.historicalImportVersion) || 0) < PROGRAM_BUILDER_HISTORY_IMPORT_VERSION) {
      changed = mergeHistoricalConcertImport(state.concertHistoryDoc, makeHistoricalConcertImport()) || changed;
      state.concertHistoryDoc.meta.historicalImportVersion = PROGRAM_BUILDER_HISTORY_IMPORT_VERSION;
      changed = true;
    }
    state.plannerDoc = safePlannerDoc(state.plannerDoc);
    state.concertHistoryDoc = safeConcertHistoryDoc(state.concertHistoryDoc);
    return changed;
  }
  function plannerBlueprintKey() {
    return safeString(state.blueprintFamily || 'gala').toLowerCase() + '_' + safeString(state.blueprintDuration || '30');
  }
  function currentBlueprint() {
    var key = plannerBlueprintKey();
    if (!state.blueprintDoc || !isObject(state.blueprintDoc.blueprints)) state.blueprintDoc = makeBlueprintDocSeed();
    if (!isObject(state.blueprintDoc.blueprints[key])) state.blueprintDoc.blueprints[key] = makeBlueprintSeed(key);
    return state.blueprintDoc.blueprints[key];
  }
  function currentSavedOffer() {
    return findSavedOfferById(state.savedOfferId);
  }
  function currentLoadedSavedOffer() {
    var bp = currentBlueprint();
    var loadedId = safeString(bp && bp.loadedFromSavedOfferId).trim();
    return loadedId ? findSavedOfferById(loadedId) : null;
  }
  function activeSavedOfferForMainActions() {
    return currentLoadedSavedOffer();
  }
  function currentSavedOfferIsMaster() {
    var record = currentSavedOffer();
    return !!record && normalizeSavedProgramType(record.saveType) === 'master_programme';
  }
  function closeProgramOfferSaveAsMenu() {
    var menu = $('pb-save-as-menu');
    if (menu) menu.open = false;
  }
  function syncProgramOfferPrimaryActions() {
    var active = activeSavedOfferForMainActions();
    var saving = safeString(state.programmeOfferSavePhase).trim() === 'saving';
    if ($('pb-save-blueprints')) $('pb-save-blueprints').disabled = saving;
    if ($('pb-save-master-primary')) $('pb-save-master-primary').disabled = saving;
    if ($('pb-save-venue-primary')) $('pb-save-venue-primary').disabled = saving;
    if ($('pb-duplicate-current')) $('pb-duplicate-current').disabled = saving || !active;
    if ($('pb-archive-current')) $('pb-archive-current').disabled = saving || !active;
  }
  function updateSavedOfferRecordFromBlueprint(record, bp, now) {
    if (!record || !bp) return null;
    var updated = safeSavedOfferRecord(Object.assign({}, clone(record), clone(bp), {
      id: record.id,
      saveType: normalizeSavedProgramType(record.saveType),
      status: normalizeSavedProgramType(record.saveType) === 'master_programme'
        ? normalizeSavedProgramStatus(record.status || 'active', 'master_programme')
        : normalizeSavedProgramStatus(bp.offerStatus || record.status, 'venue_offer'),
      useCase: normalizeSavedProgramType(record.saveType) === 'master_programme'
        ? 'other'
        : normalizeProgramOfferUseCase(bp.useCase || record.useCase),
      createdAt: safeString(record.createdAt || bp.createdAt || now),
      updatedAt: now,
      lastSavedAt: now,
      archivedAt: safeString(record.archivedAt || ''),
      lastOpenedAt: safeString(record.lastOpenedAt || ''),
      loadedFromSavedOfferId: ''
    }), 0);
    bp.loadedFromSavedOfferId = updated.id;
    bp.updatedAt = now;
    bp.lastSavedAt = now;
    if (!safeString(bp.createdAt).trim()) bp.createdAt = safeString(updated.createdAt);
    return updated;
  }
  function runProgramOfferSaveAction(task) {
    if (safeString(state.programmeOfferSavePhase).trim() === 'saving') return;
    state.programmeOfferSavePhase = 'saving';
    renderProgramOfferSaveState();
    renderProgramBuilderStatus();
    window.setTimeout(function () {
      try {
        task();
      } finally {
        state.programmeOfferSavePhase = '';
        renderProgramOfferSaveState();
        renderProgramBuilderStatus();
      }
    }, 0);
  }
  function findSavedOfferById(id) {
    var offers = (state.blueprintDoc && Array.isArray(state.blueprintDoc.savedOffers)) ? state.blueprintDoc.savedOffers : [];
    var needle = safeString(id).trim();
    if (!needle) return null;
    for (var i = 0; i < offers.length; i += 1) {
      if (safeString(offers[i].id).trim() === needle) return offers[i];
    }
    return null;
  }
  function savedOfferDisplayLabel(offer) {
    if (!offer) return 'Untitled saved version';
    return safeString(offer.versionLabel).trim() || defaultSavedOfferLabel(offer, offer.saveType);
  }
  function renderProgramOfferSaveState() {
    var pill = $('pb-save-state');
    var title = $('pb-save-state-title');
    var detail = $('pb-save-state-detail');
    if (!pill) return;
    var bp = currentBlueprint();
    var loaded = currentLoadedSavedOffer();
    var active = activeSavedOfferForMainActions();
    var phase = safeString(state.programmeOfferSavePhase).trim();
    var stateLabel = '';
    var stateTitle = '';
    var detailBits = [];
    if (phase === 'saving') {
      pill.className = 'pill info';
      stateLabel = 'Saving...';
      stateTitle = 'Saving programme changes';
    } else if (state.dirty) {
      pill.className = 'pill warn';
      stateLabel = 'Unsaved changes';
      stateTitle = loaded ? savedOfferDisplayLabel(loaded) : 'Current programme';
    } else if (loaded || safeString(bp.lastSavedAt).trim()) {
      pill.className = 'pill ok';
      stateLabel = 'Saved';
      stateTitle = loaded ? savedOfferDisplayLabel(loaded) : 'Working draft';
    } else {
      pill.className = 'pill info';
      stateLabel = 'Draft only';
      stateTitle = 'Working draft';
    }
    if (loaded) {
      detailBits.push(savedProgrammeTypeLabel(loaded.saveType) + ' · ' + savedOfferDisplayLabel(loaded));
      if (safeString(loaded.lastSavedAt || loaded.updatedAt).trim()) detailBits.push('Last saved ' + formatProgrammeOfferTimestamp(loaded.lastSavedAt || loaded.updatedAt));
    } else if (safeString(bp.lastSavedAt).trim()) {
      detailBits.push('Working draft · last saved ' + formatProgrammeOfferTimestamp(bp.lastSavedAt));
      detailBits.push('Use Save as... to store it as a Master Programme or Venue Offer');
    } else {
      detailBits.push('This programme is still only a working draft');
      detailBits.push('Use Save as... when you want to reuse it later');
    }
    if (!loaded && safeString(bp.sourceMasterLabel || bp.sourceMasterId).trim()) {
      detailBits.push('Based on ' + safeString(bp.sourceMasterLabel || bp.sourceMasterId).trim());
    } else if (loaded && normalizeSavedProgramType(loaded.saveType) === 'venue_offer' && safeString(loaded.sourceMasterLabel || loaded.sourceMasterId).trim()) {
      detailBits.push('Based on ' + safeString(loaded.sourceMasterLabel || loaded.sourceMasterId).trim());
    } else if (!loaded && active && safeString(active.id).trim() && safeString(bp.loadedFromSavedOfferId).trim() !== safeString(active.id).trim()) {
      detailBits.push('Selected in browser · ' + savedOfferDisplayLabel(active));
    }
    pill.textContent = stateLabel;
    if (title) title.textContent = stateTitle;
    if (detail) detail.textContent = detailBits.filter(Boolean).join(' · ');
    syncProgramOfferPrimaryActions();
  }
  function filteredSavedOffers() {
    var offers = (state.blueprintDoc && Array.isArray(state.blueprintDoc.savedOffers)) ? state.blueprintDoc.savedOffers : [];
    var search = safeString(state.savedOfferSearch).trim().toLowerCase();
    var type = safeString(state.savedOfferTypeFilter || 'all').trim().toLowerCase() || 'all';
    var family = safeString(state.savedOfferFamilyFilter || 'all').trim().toLowerCase() || 'all';
    var duration = safeString(state.savedOfferDurationFilter || 'all').trim().toLowerCase() || 'all';
    var lang = safeString(state.savedOfferLangFilter || 'all').trim().toLowerCase() || 'all';
    var formation = safeString(state.savedOfferFormationFilter).trim().toLowerCase();
    var status = safeString(state.savedOfferStatusFilter || 'all').trim().toLowerCase() || 'all';
    return offers.filter(function (offer) {
      if (type !== 'all' && normalizeSavedProgramType(offer.saveType) !== type) return false;
      if (family !== 'all' && safeString(offer.family).trim().toLowerCase() !== family) return false;
      if (duration !== 'all' && String(offer.targetDuration) !== duration) return false;
      if (lang !== 'all' && safeString(offer.outputLang).trim().toLowerCase() !== lang) return false;
      if (status !== 'all' && safeString(offer.status).trim().toLowerCase() !== status) return false;
      if (formation && safeString(offer.formation).trim().toLowerCase().indexOf(formation) < 0) return false;
      if (!search) return true;
      var hay = [offer.title, offer.versionLabel, offer.family, offer.formation, offer.outputLang, offer.useCase, offer.status, offer.saveType, savedProgrammeTypeLabel(offer.saveType), offer.sourceMasterLabel, offer.internalNotes].join(' ').toLowerCase();
      return hay.indexOf(search) >= 0;
    });
  }
  function openSavedOfferBrowser() {
    var mainHub = $('pb-secondary-hub');
    if (mainHub) mainHub.open = true;
    var hub = $('pb-saved-browser');
    if (!hub) return;
    hub.open = true;
    if (typeof hub.scrollIntoView === 'function') hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function renderSavedOfferBrowser() {
    var list = $('pb-saved-list');
    var summary = $('pb-saved-summary');
    var count = $('pb-saved-count');
    if ($('pb-saved-search')) $('pb-saved-search').value = safeString(state.savedOfferSearch);
    if ($('pb-saved-filter-type')) $('pb-saved-filter-type').value = state.savedOfferTypeFilter || 'all';
    if ($('pb-saved-filter-family')) $('pb-saved-filter-family').value = state.savedOfferFamilyFilter || 'all';
    if ($('pb-saved-filter-duration')) $('pb-saved-filter-duration').value = state.savedOfferDurationFilter || 'all';
    if ($('pb-saved-filter-lang')) $('pb-saved-filter-lang').value = state.savedOfferLangFilter || 'all';
    if ($('pb-saved-filter-formation')) $('pb-saved-filter-formation').value = safeString(state.savedOfferFormationFilter);
    if ($('pb-saved-filter-status')) $('pb-saved-filter-status').value = state.savedOfferStatusFilter || 'all';
    if (!list || !summary) return;
    var offers = filteredSavedOffers();
    if (count) count.textContent = offers.length + (offers.length === 1 ? ' saved programme' : ' saved programmes');
    if (!offers.length) {
      list.innerHTML = '<div class="empty-state">No saved programmes match the current filters yet.</div>';
      summary.innerHTML = '<div class="empty-state">Save a Master Programme or a Venue Offer to build your programme library.</div>';
      state.savedOfferId = '';
      if ($('pb-create-venue-from-master')) $('pb-create-venue-from-master').disabled = true;
      return;
    }
    if (!currentSavedOffer() || offers.every(function (offer) { return safeString(offer.id) !== safeString(state.savedOfferId); })) {
      state.savedOfferId = safeString(offers[0].id);
    }
    list.innerHTML = offers.map(function (offer) {
      var active = safeString(offer.id) === safeString(state.savedOfferId) ? 'item active' : 'item';
      var badges = [
        '<span class="item-badge">' + escapeHtml(savedProgrammeTypeLabel(offer.saveType)) + '</span>',
        '<span class="item-badge">' + escapeHtml(safeString(offer.status) || 'draft') + '</span>',
        '<span class="item-badge">' + escapeHtml(safeString(offer.outputLang).toUpperCase()) + '</span>'
      ];
      if (offer.useCase && offer.useCase !== 'other') badges.push('<span class="item-badge">' + escapeHtml(offer.useCase) + '</span>');
      return '<div class="' + active + '" data-pb-saved-id="' + escapeAttr(offer.id) + '"><div class="item-main"><strong>' + escapeHtml(savedOfferDisplayLabel(offer)) + '</strong><br><span class="muted">' + escapeHtml([plannerFamilyLabelForLang(offer.family, offer.outputLang), String(offer.targetDuration) + ' min', offer.formation].filter(Boolean).join(' · ')) + '</span><div class="item-badges">' + badges.join('') + '</div></div></div>';
    }).join('');
    list.querySelectorAll('[data-pb-saved-id]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.savedOfferId = el.getAttribute('data-pb-saved-id');
        renderSavedOfferBrowser();
      });
    });
    var selected = currentSavedOffer();
    if (!selected) {
      summary.innerHTML = '<div class="empty-state">Select a saved programme to review it here.</div>';
      if ($('pb-create-venue-from-master')) $('pb-create-venue-from-master').disabled = true;
      return;
    }
    if ($('pb-create-venue-from-master')) $('pb-create-venue-from-master').disabled = normalizeSavedProgramType(selected.saveType) !== 'master_programme';
    summary.innerHTML =
      '<div class="pb-saved-summary__head">' +
        '<div class="pb-saved-summary__copy">' +
          '<h4>' + escapeHtml(savedOfferDisplayLabel(selected)) + '</h4>' +
          '<p class="muted">' + escapeHtml(selected.title || defaultBlueprintTitle(selected.family, selected.targetDuration, selected.outputLang)) + '</p>' +
        '</div>' +
        '<div class="pb-saved-summary__meta"><span class="item-badge">' + escapeHtml(savedProgrammeTypeLabel(selected.saveType)) + '</span><span class="item-badge">' + escapeHtml(selected.status) + '</span></div>' +
      '</div>' +
      '<dl class="pb-saved-summary__grid">' +
        '<dt>Type</dt><dd>' + escapeHtml(savedProgrammeTypeLabel(selected.saveType)) + '</dd>' +
        '<dt>Family</dt><dd>' + escapeHtml(plannerFamilyLabelForLang(selected.family, selected.outputLang)) + '</dd>' +
        '<dt>Duration</dt><dd>' + escapeHtml(String(selected.targetDuration) + ' min') + '</dd>' +
        '<dt>Language</dt><dd>' + escapeHtml(String(selected.outputLang).toUpperCase()) + '</dd>' +
        '<dt>Formation</dt><dd>' + escapeHtml(selected.formation || '—') + '</dd>' +
        '<dt>Use case</dt><dd>' + escapeHtml(selected.useCase || 'other') + '</dd>' +
        (normalizeSavedProgramType(selected.saveType) === 'venue_offer' && safeString(selected.sourceMasterLabel || selected.sourceMasterId).trim() ? ('<dt>Source master</dt><dd>' + escapeHtml(selected.sourceMasterLabel || selected.sourceMasterId) + '</dd>') : '') +
        '<dt>Pieces</dt><dd>' + escapeHtml(String((selected.items || []).length)) + '</dd>' +
        '<dt>Created</dt><dd>' + escapeHtml(formatProgrammeOfferTimestamp(selected.createdAt)) + '</dd>' +
        '<dt>Updated</dt><dd>' + escapeHtml(formatProgrammeOfferTimestamp(selected.updatedAt || selected.lastSavedAt)) + '</dd>' +
      '</dl>' +
      '<p class="pb-saved-summary__hint">' + escapeHtml(normalizeSavedProgramType(selected.saveType) === 'master_programme' ? 'Load this Master Programme when you want to reuse it as a strong base or spin off a Venue Offer.' : 'Load this Venue Offer when you want to continue adapting it, export a Programme Sheet, or prepare a new sendable variant.') + '</p>';
  }
  function saveCurrentProgramOffer() {
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var bp = currentBlueprint();
    recomputeBlueprint(bp);
    var now = new Date().toISOString();
    if (!safeString(bp.createdAt).trim()) bp.createdAt = now;
    bp.updatedAt = now;
    bp.lastSavedAt = now;
    var loaded = currentLoadedSavedOffer();
    if (loaded) {
      var updated = updateSavedOfferRecordFromBlueprint(loaded, bp, now);
      if (updated) {
        var offers = state.blueprintDoc.savedOffers || [];
        for (var i = 0; i < offers.length; i += 1) {
          if (safeString(offers[i].id).trim() === safeString(updated.id).trim()) {
            offers[i] = updated;
            break;
          }
        }
        state.savedOfferId = updated.id;
      }
    }
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    saveDoc('rg_program_blueprints', state.blueprintDoc);
    markDirty(false, loaded ? (savedProgrammeTypeLabel(loaded.saveType) + ' saved') : 'Working offer saved');
    renderBlueprintBuilder();
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
    setStatus(loaded ? (savedProgrammeTypeLabel(loaded.saveType) + ' updated.') : 'Working offer saved. Use Save as... if you want a reusable Master Programme or Venue Offer.', 'ok');
  }
  function saveProgramOfferSnapshot(saveType) {
    saveType = normalizeSavedProgramType(saveType);
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var bp = currentBlueprint();
    recomputeBlueprint(bp);
    var now = new Date().toISOString();
    if (!safeString(bp.createdAt).trim()) bp.createdAt = now;
    bp.updatedAt = now;
    bp.lastSavedAt = now;
    var record = safeSavedOfferRecord(Object.assign({}, clone(bp), {
      id: makeProgrammeOfferSavedId(saveType),
      saveType: saveType,
      status: saveType === 'master_programme' ? 'active' : normalizeSavedProgramStatus(bp.offerStatus, saveType),
      useCase: saveType === 'master_programme' ? 'other' : normalizeProgramOfferUseCase(bp.useCase),
      versionLabel: safeString(bp.versionLabel).trim() || defaultSavedOfferLabel(bp, saveType),
      sourceMasterId: saveType === 'venue_offer' ? safeString(bp.sourceMasterId || '').trim() : '',
      sourceMasterLabel: saveType === 'venue_offer' ? safeString(bp.sourceMasterLabel || '').trim() : '',
      createdAt: now,
      updatedAt: now,
      lastSavedAt: now,
      archivedAt: '',
      lastOpenedAt: ''
    }), (state.blueprintDoc.savedOffers || []).length);
    state.blueprintDoc.savedOffers.unshift(record);
    state.savedOfferId = record.id;
    bp.loadedFromSavedOfferId = record.id;
    bp.updatedAt = now;
    bp.lastSavedAt = now;
    if (saveType === 'master_programme') {
      bp.sourceMasterId = '';
      bp.sourceMasterLabel = '';
    }
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    saveDoc('rg_program_blueprints', state.blueprintDoc);
    markDirty(false, saveType === 'master_programme' ? 'Master Programme saved' : 'Venue Offer saved');
    closeProgramOfferSaveAsMenu();
    renderBlueprintBuilder();
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
  }
  function loadSavedOfferIntoEditor() {
    var record = currentSavedOffer();
    if (!record) {
      setStatus('Select a saved programme first.', 'warn');
      return;
    }
    if (state.dirty && !hasUnsavedChangesPrompt('Load this saved version into the editor?')) return;
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var key = safeString(record.family).trim().toLowerCase() + '_' + String(record.targetDuration);
    var loaded = normalizeBlueprintRecord(record, key);
    loaded.loadedFromSavedOfferId = safeString(record.id);
    loaded.sourceMasterId = normalizeSavedProgramType(record.saveType) === 'venue_offer' ? safeString(record.sourceMasterId || '') : '';
    loaded.sourceMasterLabel = normalizeSavedProgramType(record.saveType) === 'venue_offer' ? safeString(record.sourceMasterLabel || '') : '';
    loaded.createdAt = safeString(record.createdAt || loaded.createdAt);
    loaded.updatedAt = safeString(record.updatedAt || loaded.updatedAt);
    loaded.lastSavedAt = safeString(record.lastSavedAt || record.updatedAt || loaded.lastSavedAt);
    state.blueprintDoc.blueprints[key] = loaded;
    state.blueprintFamily = loaded.family;
    state.blueprintDuration = String(loaded.targetDuration);
    state.blueprintOutputLang = loaded.outputLang || 'en';
    record.lastOpenedAt = new Date().toISOString();
    markDirty(false, 'Saved programme loaded');
    renderBlueprintBuilder();
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
    setStatus('Saved programme loaded.', 'ok');
  }
  function createVenueOfferFromMaster() {
    var record = currentSavedOffer();
    if (!record) {
      setStatus('Select a Master Programme first.', 'warn');
      return;
    }
    if (normalizeSavedProgramType(record.saveType) !== 'master_programme') {
      setStatus('Select a Master Programme first.', 'warn');
      return;
    }
    if (state.dirty && !hasUnsavedChangesPrompt('Create a Venue Offer from this Master Programme?')) return;
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var key = safeString(record.family).trim().toLowerCase() + '_' + String(record.targetDuration);
    var loaded = normalizeBlueprintRecord(record, key);
    loaded.loadedFromSavedOfferId = safeString(record.id);
    loaded.sourceMasterId = safeString(record.id);
    loaded.sourceMasterLabel = savedOfferDisplayLabel(record);
    loaded.useCase = 'other';
    loaded.offerStatus = 'draft';
    state.blueprintDoc.blueprints[key] = loaded;
    state.blueprintFamily = loaded.family;
    state.blueprintDuration = String(loaded.targetDuration);
    state.blueprintOutputLang = loaded.outputLang || 'en';
    state.savedOfferId = safeString(record.id);
    markDirty(true, 'Venue Offer created from Master Programme');
    renderBlueprintBuilder();
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
    setStatus('Master Programme loaded as a new working Venue Offer. Adapt it and save when ready.', 'ok');
  }
  function duplicateSavedOffer() {
    var record = currentSavedOffer();
    if (!record) {
      setStatus('Select a saved programme first.', 'warn');
      return;
    }
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var now = new Date().toISOString();
    var copy = safeSavedOfferRecord(Object.assign({}, clone(record), {
      id: makeProgrammeOfferSavedId(record.saveType),
      versionLabel: savedOfferDisplayLabel(record) + ' copy',
      createdAt: now,
      updatedAt: now,
      lastSavedAt: now,
      archivedAt: '',
      lastOpenedAt: ''
    }), (state.blueprintDoc.savedOffers || []).length);
    state.blueprintDoc.savedOffers.unshift(copy);
    state.savedOfferId = copy.id;
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    saveDoc('rg_program_blueprints', state.blueprintDoc);
    markDirty(false, savedProgrammeTypeLabel(record.saveType) + ' duplicated');
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
  }
  function duplicateActiveProgramOffer() {
    var record = activeSavedOfferForMainActions();
    if (!record) {
      setStatus('Save this programme as a Master Programme or Venue Offer first.', 'warn');
      return;
    }
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var bp = currentBlueprint();
    recomputeBlueprint(bp);
    var now = new Date().toISOString();
    var saveType = normalizeSavedProgramType(record.saveType);
    var copy = safeSavedOfferRecord(Object.assign({}, clone(record), clone(bp), {
      id: makeProgrammeOfferSavedId(saveType),
      saveType: saveType,
      versionLabel: savedOfferDisplayLabel(record) + ' copy',
      status: saveType === 'master_programme'
        ? normalizeSavedProgramStatus(record.status || 'active', 'master_programme')
        : normalizeSavedProgramStatus(bp.offerStatus || record.status, 'venue_offer'),
      useCase: saveType === 'master_programme'
        ? 'other'
        : normalizeProgramOfferUseCase(bp.useCase || record.useCase),
      createdAt: now,
      updatedAt: now,
      lastSavedAt: now,
      archivedAt: '',
      lastOpenedAt: ''
    }), (state.blueprintDoc.savedOffers || []).length);
    state.blueprintDoc.savedOffers.unshift(copy);
    bp.loadedFromSavedOfferId = copy.id;
    bp.updatedAt = now;
    bp.lastSavedAt = now;
    state.savedOfferId = copy.id;
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    saveDoc('rg_program_blueprints', state.blueprintDoc);
    markDirty(false, savedProgrammeTypeLabel(saveType) + ' duplicated');
    renderBlueprintBuilder();
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
  }
  function archiveSavedOffer() {
    var record = currentSavedOffer();
    if (!record) {
      setStatus('Select a saved programme first.', 'warn');
      return;
    }
    if (!window.confirm('Archive this saved programme?\n\n' + savedOfferDisplayLabel(record))) return;
    record.status = 'archived';
    record.archivedAt = new Date().toISOString();
    record.updatedAt = record.archivedAt;
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    saveDoc('rg_program_blueprints', state.blueprintDoc);
    markDirty(false, 'Saved version archived');
    renderSavedOfferBrowser();
    renderProgramBuilderStatus();
  }
  function archiveActiveProgramOffer() {
    var record = activeSavedOfferForMainActions();
    if (!record) {
      setStatus('Save this programme as a Master Programme or Venue Offer first.', 'warn');
      return;
    }
    if (state.dirty && !hasUnsavedChangesPrompt('Archive the saved programme linked to this working offer?')) return;
    state.savedOfferId = safeString(record.id);
    archiveSavedOffer();
  }
  function dramaticArcSlotsForDuration(targetDuration) {
    return clone(PROGRAM_BUILDER_ARC_TEMPLATES[Math.max(0, Number(targetDuration) || 30)] || PROGRAM_BUILDER_ARC_TEMPLATES[30]);
  }
  function dramaticArcSlotLabel(slotId, targetDuration) {
    var slots = dramaticArcSlotsForDuration(targetDuration);
    for (var i = 0; i < slots.length; i += 1) {
      if (slots[i].id === slotId) return slots[i].label;
    }
    return '';
  }
  function sortBlueprintItemsForMode(bp) {
    var slots = dramaticArcSlotsForDuration(bp.targetDuration);
    var slotOrder = {};
    slots.forEach(function (slot, idx) { slotOrder[slot.id] = idx; });
    if (bp.buildMode === 'dramatic_arc') {
      (bp.items || []).forEach(function (it) {
        var key = safeString(it.slotId).trim();
        if (key && !hasOwn(slotOrder, key)) it.slotId = '';
      });
    }
    (bp.items || []).sort(function (a, b) {
      if (bp.buildMode === 'dramatic_arc') {
        var aSlotted = !!safeString(a.slotId).trim();
        var bSlotted = !!safeString(b.slotId).trim();
        if (aSlotted && bSlotted) {
          return (Number(slotOrder[safeString(a.slotId).trim()]) || 999) - (Number(slotOrder[safeString(b.slotId).trim()]) || 999);
        }
        if (aSlotted !== bSlotted) return aSlotted ? -1 : 1;
      }
      return (Number(a.position) || 0) - (Number(b.position) || 0);
    });
    (bp.items || []).forEach(function (it, idx) { it.position = idx; });
  }
  function blueprintPieceBySlot(bp, slotId) {
    slotId = safeString(slotId).trim().toLowerCase();
    return (bp.items || []).find(function (it) { return safeString(it.slotId).trim().toLowerCase() === slotId; }) || null;
  }
  function blueprintArcCandidatePool(bp, slotId) {
    var pool = plannerOfferFilteredItems(slotId).slice();
    var seen = {};
    var add = function (piece) {
      var id = safeString(piece && piece.id).trim();
      if (!id || seen[id]) return;
      seen[id] = true;
      pool.push(piece);
    };
    pool.forEach(function (piece) { seen[safeString(piece.id).trim()] = true; });
    (bp.items || []).forEach(function (it) { add(getPlannerItemById(it.pieceId)); });
    return pool.filter(Boolean).sort(function (a, b) {
      var scoreA = plannerArcSlotScore(a, slotId, bp);
      var scoreB = plannerArcSlotScore(b, slotId, bp);
      if (scoreA !== scoreB) return scoreB - scoreA;
      var famA = plannerOfferFamilyFitTier(a, bp, bp.family);
      var famB = plannerOfferFamilyFitTier(b, bp, bp.family);
      if (famA !== famB) return famB - famA;
      return safeString(a.title).localeCompare(safeString(b.title));
    });
  }
  function assignBlueprintArcSlot(slotId, pieceId) {
    var bp = currentBlueprint();
    if (bp.buildMode !== 'dramatic_arc') return;
    slotId = safeString(slotId).trim().toLowerCase();
    pieceId = safeString(pieceId).trim();
    var existingSlotIndex = (bp.items || []).findIndex(function (it) { return safeString(it.slotId).trim().toLowerCase() === slotId; });
    if (!pieceId) {
      if (existingSlotIndex >= 0) bp.items.splice(existingSlotIndex, 1);
      sortBlueprintItemsForMode(bp);
      recomputeBlueprint(bp);
      renderBlueprintBuilder();
      markDirty(true, 'Programme arc updated');
      return;
    }
    var existingPieceIndex = (bp.items || []).findIndex(function (it) { return safeString(it.pieceId).trim() === pieceId; });
    if (existingSlotIndex >= 0 && existingSlotIndex !== existingPieceIndex) bp.items.splice(existingSlotIndex, 1);
    if (existingPieceIndex >= 0) {
      if (existingSlotIndex >= 0 && existingSlotIndex < existingPieceIndex) existingPieceIndex -= 1;
      bp.items[existingPieceIndex].slotId = slotId;
    } else {
      bp.items.push({ pieceId: pieceId, customTitle: '', customDuration: 0, notes: '', slotId: slotId, position: bp.items.length });
    }
    sortBlueprintItemsForMode(bp);
    recomputeBlueprint(bp);
    state.blueprintPieceIndex = (bp.items || []).findIndex(function (it) { return safeString(it.slotId).trim().toLowerCase() === slotId; });
    renderBlueprintBuilder();
    markDirty(true, 'Programme arc updated');
  }
  function getPlannerItemById(id) {
    var needle = safeString(id).trim();
    var items = (state.plannerDoc && Array.isArray(state.plannerDoc.items)) ? state.plannerDoc.items : [];
    for (var i = 0; i < items.length; i += 1) {
      if (safeString(items[i].id).trim() === needle) return items[i];
    }
    if (isObject(state.programmeDiscoveryCandidates) && isObject(state.programmeDiscoveryCandidates[needle])) return state.programmeDiscoveryCandidates[needle];
    return null;
  }
  function ensureProgramBuilderDocs() {
    var plannerRaw = state.api.load('rg_repertoire_planner');
    if (!isObject(plannerRaw) || !Array.isArray(plannerRaw.items)) {
      var plannerSeed = makePlannerSeed();
      validateKeyValue('rg_repertoire_planner', plannerSeed);
      state.api.save('rg_repertoire_planner', clone(plannerSeed));
    }
    var blueprintRaw = state.api.load('rg_program_blueprints');
    if (!isObject(blueprintRaw) || !isObject(blueprintRaw.blueprints)) {
      blueprintRaw = null;
    }
    var historyRaw = state.api.load('rg_concert_history');
    if (!isObject(historyRaw) || !Array.isArray(historyRaw.concerts)) {
      var historySeed = makeConcertHistorySeed();
      validateKeyValue('rg_concert_history', historySeed);
      state.api.save('rg_concert_history', clone(historySeed));
    }
  }
  function ensureDiscoveryDoc() {
    var raw = state.api.load('rg_repertoire_discovery');
    if (!isObject(raw) || !Array.isArray(raw.records)) {
      var seed = makeDiscoverySeed();
      validateKeyValue('rg_repertoire_discovery', seed);
      state.api.save('rg_repertoire_discovery', clone(seed));
    }
  }
  function plannerDiscoveryDraftLimit(bp) {
    if (!(bp && bp.includeDiscoveryIdeas === true)) return 0;
    var target = Math.max(0, Number(bp && bp.targetDuration) || 30);
    if (target >= 60) return 2;
    return 1;
  }
  function plannerVirtualDiscoveryItem(discoveryItem) {
    if (!discoveryItem) return null;
    var id = 'discovery_idea__' + safeString(discoveryItem.id).trim();
    if (isObject(state.programmeDiscoveryCandidates[id])) return state.programmeDiscoveryCandidates[id];
    var raw = {
      id: id,
      title: discoveryItem.title,
      composer: discoveryItem.composer,
      work: discoveryItem.work,
      type: plannerTypeFromDiscovery(discoveryItem),
      category: plannerCategoryFromDiscovery(discoveryItem),
      voiceCategory: safeString(discoveryItem.voiceCategory),
      primaryVoice: safeString(discoveryItem.primaryVoice),
      pairedVoices: clone(discoveryItem.pairedVoices || []),
      language: discoveryItem.language,
      approximateDurationMin: discoveryCurrentDuration(discoveryItem),
      durationMin: discoveryCurrentDuration(discoveryItem),
      formations: clone(discoveryItem.formations || []),
      readiness: 'idea',
      availabilityStatus: 'idea',
      tags: programBuilderUniqueStrings((discoveryItem.tags || []).concat(discoveryItem.programmeFit || []).concat(['discovery_idea'])),
      fitTags: programBuilderUniqueStrings((discoveryItem.programmeFit || []).concat(discoveryItem.profileFocus || []).concat(['discovery_idea'])),
      dramaticRole: safeString(discoveryItem.dramaticRole),
      audienceAppeal: safeString(discoveryItem.audienceAppeal),
      notes: discoveryImportNotes(discoveryItem, ''),
      publicNotes: '',
      sortOrder: 0,
      performanceStatus: '',
      performedIn: [],
      reviewStatus: 'manual_review',
      offerOnly: false,
      excludeFromOffers: false,
      sourceGroup: 'Repertoire Discovery',
      suggestionGroup: safeString(discoveryItem.source || 'Curated discovery source'),
      discoveryIdea: true,
      discoverySourceId: safeString(discoveryItem.id).trim(),
      discoveryImportedItemId: safeString(discoveryItem.importedItemId).trim()
    };
    state.programmeDiscoveryCandidates[id] = normalizePlannerItemRecord(raw, (state.plannerDoc && state.plannerDoc.items || []).length);
    return state.programmeDiscoveryCandidates[id];
  }
  function plannerDiscoveryCandidatesForOffer(bp) {
    if (!(bp && bp.includeDiscoveryIdeas === true)) return [];
    ensureDiscoveryDoc();
    state.discoveryDoc = safeDiscoveryDoc(loadDoc('rg_repertoire_discovery', makeDiscoverySeed()));
    return discoveryItemsMerged().map(plannerVirtualDiscoveryItem).filter(function (item) {
      if (!item) return false;
      if (!plannerPieceFormationEligibleForOffer(item, bp)) return false;
      if (plannerOfferFamilyFitTier(item, bp, bp && bp.family) <= 0) return false;
      return true;
    });
  }
  function plannerDiscoverySourceRow(piece) {
    if (!(piece && piece.discoveryIdea === true)) return null;
    var sourceId = safeString(piece.discoverySourceId).trim();
    if (!sourceId) return null;
    return discoveryItemsMerged().find(function (row) {
      return safeString(row && row.id).trim() === sourceId;
    }) || null;
  }
  function plannerDiscoveryTextBlob(row) {
    if (!row) return '';
    return [
      row.title,
      row.composer,
      row.work,
      row.language,
      row.type,
      row.vocalCombination,
      row.dramaticRole,
      row.readinessIntent,
      row.fitNote,
      row.cautionNote,
      row.source,
      row.sourceNote,
      Array.isArray(row.tags) ? row.tags.join(' ') : '',
      Array.isArray(row.programmeFit) ? row.programmeFit.join(' ') : '',
      Array.isArray(row.profileFocus) ? row.profileFocus.join(' ') : ''
    ].join(' ').toLowerCase();
  }
  function plannerDiscoveryIdeaScore(piece, bp, opts) {
    var row = plannerDiscoverySourceRow(piece);
    if (!row || !bp) return 0;
    opts = opts || {};
    var score = 0;
    var desiredRole = safeString(opts.desiredRole || opts.slotId).trim().toLowerCase();
    var editorialRole = plannerPieceEditorialRole(piece);
    var family = safeString(bp.family).trim().toLowerCase();
    var outputLang = safeString(bp.outputLang || state.lang || 'en').trim().toLowerCase();
    var pieceLang = safeString(row.language || piece.language).trim().toLowerCase();
    var textBlob = plannerDiscoveryTextBlob(row);
    var remaining = Math.max(0, (Number(bp.targetDuration) || 0) - (Number(bp.totalDuration) || 0));
    var duration = Math.max(0, Number(discoveryCurrentDuration(row) || plannerEffectiveDuration(piece)) || 0);
    var profile = Array.isArray(row.profileFocus) ? row.profileFocus.map(function (x) { return safeString(x).trim().toLowerCase(); }) : [];
    var programmeFit = Array.isArray(row.programmeFit) ? row.programmeFit.map(function (x) { return safeString(x).trim().toLowerCase(); }) : [];
    if (programmeFit.indexOf(family) >= 0) score += 30;
    else if (textBlob.indexOf(family) >= 0) score += 10;
    else score -= 20;
    if (profile.indexOf('lyric_tenor') >= 0 || profile.indexOf('tenor') >= 0) score += 18;
    else if (piece.includesTenor === true) score += 8;
    if (outputLang && pieceLang) {
      if (pieceLang === outputLang) score += 7;
      else if (family === 'italian' && pieceLang === 'it') score += 10;
      else if (family === 'tango' && pieceLang === 'es') score += 10;
      else if (family === 'borders' && ['de','fr','en'].indexOf(pieceLang) >= 0) score += 6;
    }
    if (desiredRole) {
      if (editorialRole === desiredRole) score += 22;
      else if ((desiredRole === 'finale' || desiredRole === 'climax') && (editorialRole === 'finale' || editorialRole === 'climax' || piece.impactLevel === 'high')) score += 15;
      else if ((desiredRole === 'contrast' || desiredRole === 'lyrical_center') && (editorialRole === 'contrast' || editorialRole === 'lyrical_center')) score += 14;
      else if (desiredRole === 'support' && (editorialRole === 'support' || editorialRole === 'piano_support' || piece.vocalRestSupport === true || piece.interlude === true)) score += 18;
      else if (desiredRole === 'opener' && (safeString(piece.audienceAppeal).trim().toLowerCase() === 'balanced' || safeString(piece.dramaticRole).trim().toLowerCase() === 'opener')) score += 10;
      else score -= 6;
    }
    if (remaining > 0) {
      var distance = Math.abs(remaining - duration);
      score += Math.max(-10, 14 - (distance * 2));
    }
    if (piece.interlude === true || safeString(piece.dramaticRole).trim().toLowerCase() === 'interlude') {
      if (opts.allowPianoSolo === true || safeString(desiredRole) === 'support') score += 10;
      else score -= 8;
    }
    if (piece.encoreCandidate === true || safeString(piece.dramaticRole).trim().toLowerCase() === 'encore') {
      if (desiredRole === 'finale' || desiredRole === 'encore') score += 10;
    }
    if (safeString(row.readinessIntent).trim().toLowerCase() === 'good_candidate') score += 8;
    else if (safeString(row.readinessIntent).trim().toLowerCase() === 'worth_studying') score += 5;
    else if (safeString(row.readinessIntent).trim().toLowerCase() === 'ideas_only') score -= 6;
    if (/sacred|church/.test(textBlob) && (family === 'gala' || family === 'borders')) score += 4;
    if (/verify key|verify cut|verify edition|approx/.test(textBlob)) score -= 4;
    return score;
  }
  function discoveryFilterStateMatch(item, stateFilter) {
    if (stateFilter === 'unreviewed') return !safeString(item.editorialState).trim();
    if (stateFilter === 'all') return true;
    return safeString(item.editorialState).trim().toLowerCase() === stateFilter;
  }
  function discoverySearchTokens() {
    return programBuilderUniqueStrings(
      safeString(state.discoverySearch).trim().toLowerCase().split(/\s+/)
        .concat(safeString(state.discoveryComposerFilter).trim().toLowerCase().split(/\s+/))
        .concat(safeString(state.discoveryWorkFilter).trim().toLowerCase().split(/\s+/))
        .map(function (token) { return safeString(token).trim(); })
        .filter(Boolean)
    );
  }
  function discoveryScoreItem(item, opts) {
    var options = opts || {};
    var duration = discoveryCurrentDuration(item);
    var score = 0;
    var textBlob = [
      item.title, item.composer, item.work, item.tags.join(' '), item.fitNote, item.source, item.sourceNote, item.cautionNote
    ].join(' ').toLowerCase();
    var profile = safeString(state.discoveryProfileFilter || 'all').trim().toLowerCase() || 'all';
    var family = safeString(state.discoveryFamilyFilter || 'all').trim().toLowerCase() || 'all';
    var language = safeString(state.discoveryLanguageFilter).trim().toLowerCase();
    var composer = safeString(state.discoveryComposerFilter).trim().toLowerCase();
    var work = safeString(state.discoveryWorkFilter).trim().toLowerCase();
    var type = safeString(state.discoveryTypeFilter || 'all').trim().toLowerCase() || 'all';
    var combination = safeString(state.discoveryCombinationFilter || 'all').trim().toLowerCase() || 'all';
    var role = safeString(state.discoveryRoleFilter || 'all').trim().toLowerCase() || 'all';
    var readiness = safeString(state.discoveryReadinessFilter || 'all').trim().toLowerCase() || 'all';
    var minDuration = Math.max(0, Number(state.discoveryDurationMinFilter) || 0);
    var maxDuration = Math.max(0, Number(state.discoveryDurationMaxFilter) || 0);
    if (profile !== 'all') score += item.profileFocus.indexOf(profile) >= 0 ? 22 : (options.relaxed ? -6 : -50);
    if (family !== 'all') score += item.programmeFit.indexOf(family) >= 0 ? 18 : (options.relaxed ? -5 : -40);
    if (language) score += safeString(item.language).trim().toLowerCase().indexOf(language) >= 0 ? 14 : (options.relaxed ? -4 : -40);
    if (composer) {
      if (safeString(item.composer).trim().toLowerCase().indexOf(composer) >= 0) score += 34;
      else if (textBlob.indexOf(composer) >= 0) score += 18;
      else score += options.relaxed ? -8 : -60;
    }
    if (work) {
      if (safeString(item.work).trim().toLowerCase().indexOf(work) >= 0) score += 26;
      else if (textBlob.indexOf(work) >= 0) score += 12;
      else score += options.relaxed ? -6 : -50;
    }
    if (type !== 'all') score += safeString(item.type).trim().toLowerCase() === type ? 16 : (options.relaxed ? -18 : -80);
    if (combination !== 'all') score += safeString(item.vocalCombination).trim().toLowerCase() === combination ? 18 : (options.relaxed ? -18 : -80);
    if (role !== 'all') score += safeString(item.dramaticRole).trim().toLowerCase() === role ? 12 : (options.relaxed ? -4 : -40);
    if (readiness !== 'all') score += safeString(item.readinessIntent).trim().toLowerCase() === readiness ? 10 : (options.relaxed ? -3 : -25);
    discoverySearchTokens().forEach(function (token) {
      if (textBlob.indexOf(token) >= 0) score += 12;
    });
    if (minDuration > 0 || maxDuration > 0) {
      if (minDuration > 0 && duration < minDuration) score -= options.relaxed ? Math.min(16, (minDuration - duration) * 3) : 80;
      if (maxDuration > 0 && duration > maxDuration) score -= options.relaxed ? Math.min(16, (duration - maxDuration) * 3) : 80;
      if ((minDuration > 0 && duration >= minDuration) || (maxDuration > 0 && duration <= maxDuration)) score += 8;
    }
    if (safeString(item.readinessIntent).trim().toLowerCase() === 'worth_studying') score += 6;
    else if (safeString(item.readinessIntent).trim().toLowerCase() === 'good_candidate') score += 4;
    if (item.importedItemId) score -= 3;
    return score;
  }
  function discoveryFilteredItems() {
    var items = discoveryItemsMerged();
    var profile = safeString(state.discoveryProfileFilter || 'all').trim().toLowerCase() || 'all';
    var family = safeString(state.discoveryFamilyFilter || 'all').trim().toLowerCase() || 'all';
    var language = safeString(state.discoveryLanguageFilter).trim().toLowerCase();
    var composer = safeString(state.discoveryComposerFilter).trim().toLowerCase();
    var work = safeString(state.discoveryWorkFilter).trim().toLowerCase();
    var type = safeString(state.discoveryTypeFilter || 'all').trim().toLowerCase() || 'all';
    var combination = safeString(state.discoveryCombinationFilter || 'all').trim().toLowerCase() || 'all';
    var role = safeString(state.discoveryRoleFilter || 'all').trim().toLowerCase() || 'all';
    var readiness = safeString(state.discoveryReadinessFilter || 'all').trim().toLowerCase() || 'all';
    var stateFilter = safeString(state.discoveryStateFilter || 'all').trim().toLowerCase() || 'all';
    var minDuration = Math.max(0, Number(state.discoveryDurationMinFilter) || 0);
    var maxDuration = Math.max(0, Number(state.discoveryDurationMaxFilter) || 0);
    var exact = items.filter(function (item) {
      var duration = discoveryCurrentDuration(item);
      var textBlob = [
        item.title, item.composer, item.work, item.tags.join(' '), item.fitNote, item.source, item.sourceNote, item.cautionNote
      ].join(' ').toLowerCase();
      var search = safeString(state.discoverySearch).trim().toLowerCase();
      if (search && textBlob.indexOf(search) < 0) return false;
      if (profile !== 'all' && item.profileFocus.indexOf(profile) < 0) return false;
      if (family !== 'all' && item.programmeFit.indexOf(family) < 0) return false;
      if (language && safeString(item.language).trim().toLowerCase().indexOf(language) < 0) return false;
      if (composer && safeString(item.composer).trim().toLowerCase().indexOf(composer) < 0) return false;
      if (work && safeString(item.work).trim().toLowerCase().indexOf(work) < 0) return false;
      if (type !== 'all' && safeString(item.type).trim().toLowerCase() !== type) return false;
      if (combination !== 'all' && safeString(item.vocalCombination).trim().toLowerCase() !== combination) return false;
      if (role !== 'all' && safeString(item.dramaticRole).trim().toLowerCase() !== role && !(role === 'interlude' && safeString(item.dramaticRole).trim().toLowerCase() === 'interlude')) return false;
      if (readiness !== 'all' && safeString(item.readinessIntent).trim().toLowerCase() !== readiness) return false;
      if (!discoveryFilterStateMatch(item, stateFilter)) return false;
      if (minDuration > 0 && duration < minDuration) return false;
      if (maxDuration > 0 && duration > maxDuration) return false;
      return true;
    }).sort(function (a, b) {
      return discoveryScoreItem(b, { relaxed: false }) - discoveryScoreItem(a, { relaxed: false }) || safeString(a.title).localeCompare(safeString(b.title));
    });
    if (exact.length) return { items: exact, mode: 'exact', exactCount: exact.length };
    var relaxed = items.filter(function (item) {
      if (!discoveryFilterStateMatch(item, stateFilter)) return false;
      if (type !== 'all' && safeString(item.type).trim().toLowerCase() !== type) return false;
      if (combination !== 'all' && safeString(item.vocalCombination).trim().toLowerCase() !== combination) return false;
      return true;
    }).map(function (item) {
      return { item: item, score: discoveryScoreItem(item, { relaxed: true }) };
    }).filter(function (row) {
      return row.score > -20;
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return safeString(a.item.title).localeCompare(safeString(b.item.title));
    }).slice(0, 24).map(function (row) { return row.item; });
    return { items: relaxed, mode: 'suggested', exactCount: 0 };
  }
  function renderDiscoverySummary(result) {
    var payload = result || { items: [] };
    var items = payload.items || [];
    var box = $('discovery-state-summary');
    var pill = $('discovery-results-pill');
    var matchPill = $('discovery-match-pill');
    var sourcePill = $('discovery-source-pill');
    var allItems = discoveryItemsMerged();
    var layers = discoverySourceLayers(allItems);
    if (pill) pill.textContent = String((items || []).length) + (((items || []).length === 1) ? ' result' : ' results');
    if (matchPill) matchPill.textContent = payload.mode === 'exact' ? 'Exact matches' : 'Suggested results';
    if (sourcePill) sourcePill.textContent = String(layers.length) + ' curated source layers';
    if (!box) return;
    var counts = discoveryStateCounts(items || allItems);
    box.innerHTML = [
      '<span class="pill">' + escapeHtml(String(counts.total) + ' in view') + '</span>',
      '<span class="pill">' + escapeHtml(String(allItems.length) + ' in source pool') + '</span>',
      '<span class="pill info">' + escapeHtml(payload.mode === 'exact' ? 'Filters matched directly' : 'No exact match · showing nearby recommendations') + '</span>',
      '<span class="pill info">' + escapeHtml(String(counts.unreviewed) + ' unreviewed') + '</span>',
      '<span class="pill">' + escapeHtml(String(counts.bookmarked || 0) + ' bookmarked') + '</span>',
      '<span class="pill">' + escapeHtml(String(counts.worth_studying || 0) + ' worth studying') + '</span>',
      '<span class="pill ok">' + escapeHtml(String(counts.imported_to_repertoire_library || 0) + ' imported') + '</span>'
    ].join('');
  }
  function renderDiscoveryTopRecommendations(result) {
    var box = $('discovery-top-recommendations');
    if (!box) return;
    var payload = result || discoveryFilteredItems();
    var items = (payload.items || []).slice(0, 6);
    if (!items.length) {
      box.innerHTML = '<div class="discovery-top-recommendations__empty">Top recommendations appear here once the current filters point to a plausible discovery lane.</div>';
      return;
    }
    box.innerHTML = items.map(function (item) {
      var meta = [item.composer, item.work, item.language, discoveryCurrentDuration(item) ? (String(discoveryCurrentDuration(item)) + ' min') : 'Approx. duration TBD'].filter(Boolean).join(' · ');
      var badges = [];
      if (item.vocalCombination) badges.push('<span class="item-badge">' + escapeHtml(discoveryCombinationLabel(item.vocalCombination) || item.vocalCombination) + '</span>');
      if (item.dramaticRole) badges.push('<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[item.dramaticRole] || item.dramaticRole) + '</span>');
      if (item.styleFamilies && item.styleFamilies.length) badges.push('<span class="item-badge">' + escapeHtml(item.styleFamilies[0]) + '</span>');
      return '<button type="button" class="discovery-top-card" data-discovery-top-select="' + escapeAttr(item.id) + '">' +
        '<strong>' + escapeHtml(item.title || '(untitled)') + '</strong>' +
        '<span class="discovery-top-card__meta">' + escapeHtml(meta) + '</span>' +
        (badges.length ? '<div class="item-badges">' + badges.join('') + '</div>' : '') +
        '<p class="discovery-top-card__fit">' + escapeHtml(item.fitNote || 'No fit note saved yet.') + '</p>' +
        '<span class="discovery-top-card__source">' + escapeHtml(item.source || 'Curated source') + '</span>' +
      '</button>';
    }).join('');
    box.querySelectorAll('[data-discovery-top-select]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.discoverySelectedId = btn.getAttribute('data-discovery-top-select');
        renderDiscoveryWorkspace();
      });
    });
  }
  function renderDiscoveryResults() {
    var box = $('discovery-results');
    var moreWrap = $('discovery-load-more-wrap');
    if (!box) return;
    var result = discoveryFilteredItems();
    var items = result.items || [];
    renderDiscoverySummary(result);
    renderDiscoveryTopRecommendations(result);
    if (!items.length) {
      box.innerHTML = '<div class="empty-state">No discovery items fit the current filters closely enough. Clear one or two filters to widen the recommendation pool.</div>';
      if (moreWrap) moreWrap.hidden = true;
      return;
    }
    var limit = Math.max(24, Number(state.discoveryResultLimit) || 24);
    var visible = items.slice(0, limit);
    box.innerHTML = visible.map(function (item) {
      var active = safeString(state.discoverySelectedId).trim() === safeString(item.id).trim() ? 'discovery-card active' : 'discovery-card';
      var meta = [item.composer, item.work, item.language, discoveryCurrentDuration(item) ? (String(discoveryCurrentDuration(item)) + ' min') : 'Approx. duration TBD'].filter(Boolean).join(' · ');
      var badges = [];
      badges.push('<span class="item-badge">' + escapeHtml(discoveryStateLabel(item.editorialState)) + '</span>');
      if (item.type) badges.push('<span class="item-badge">' + escapeHtml(item.type.replace(/_/g, ' ')) + '</span>');
      if (item.vocalCombination) badges.push('<span class="item-badge">' + escapeHtml(discoveryCombinationLabel(item.vocalCombination) || item.vocalCombination) + '</span>');
      if (item.dramaticRole) badges.push('<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[item.dramaticRole] || (item.dramaticRole === 'interlude' ? 'Interlude' : item.dramaticRole)) + '</span>');
      if (item.styleFamilies && item.styleFamilies.length) badges.push('<span class="item-badge">' + escapeHtml(item.styleFamilies[0]) + '</span>');
      if (item.importedItemId) badges.push('<span class="item-badge ok">Imported</span>');
      return '<button type="button" class="' + active + '" data-discovery-select="' + escapeAttr(item.id) + '">' +
        '<strong>' + escapeHtml(item.title || '(untitled)') + '</strong>' +
        '<span class="discovery-card__meta">' + escapeHtml(meta) + '</span>' +
        '<div class="item-badges">' + badges.join('') + '</div>' +
        '<p class="discovery-card__fit">' + escapeHtml(item.fitNote || 'No fit note saved yet.') + '</p>' +
        '<span class="discovery-card__source">' + escapeHtml(item.source || 'Curated source') + '</span>' +
      '</button>';
    }).join('');
    if (moreWrap) {
      moreWrap.hidden = visible.length >= items.length;
      moreWrap.innerHTML = visible.length < items.length
        ? '<button id="discovery-load-more" type="button">Show more results (' + escapeHtml(String(visible.length)) + ' / ' + escapeHtml(String(items.length)) + ')</button>'
        : '';
      if ($('discovery-load-more')) $('discovery-load-more').addEventListener('click', function () {
        state.discoveryResultLimit = Math.max(24, Number(state.discoveryResultLimit) || 24) + 24;
        renderDiscoveryResults();
      });
    }
    box.querySelectorAll('[data-discovery-select]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.discoverySelectedId = btn.getAttribute('data-discovery-select');
        renderDiscoveryWorkspace();
      });
    });
    if (!state.discoverySelectedId || !items.some(function (item) { return safeString(item.id).trim() === safeString(state.discoverySelectedId).trim(); })) {
      state.discoverySelectedId = safeString(items[0].id).trim();
      renderDiscoveryResults();
      return;
    }
  }
  function renderDiscoveryDetail() {
    var box = $('discovery-detail');
    if (!box) return;
    var item = discoveryItemsMerged().find(function (row) { return safeString(row.id).trim() === safeString(state.discoverySelectedId).trim(); }) || null;
    if (!item) {
      box.innerHTML = '<div class="empty-state">Select a discovery result to review fit, cautions, source details, and import options.</div>';
      return;
    }
    var stateOptions = ['<option value="">Unreviewed</option>'].concat(REPERTOIRE_DISCOVERY_STATE_OPTIONS.map(function (option) {
      var selected = option.value === safeString(item.editorialState).trim().toLowerCase() ? ' selected' : '';
      return '<option value="' + escapeAttr(option.value) + '"' + selected + '>' + escapeHtml(option.label) + '</option>';
    })).join('');
    var tags = (item.tags || []).slice();
    var programmeFit = (item.programmeFit || []).map(function (tag) { return tag.replace(/_/g, ' '); });
    var profileFocus = (item.profileFocus || []).map(discoveryProfileLabel).filter(Boolean);
    var roleLabel = item.dramaticRole ? (PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[item.dramaticRole] || (item.dramaticRole === 'interlude' ? 'Interlude' : item.dramaticRole)) : '';
    box.innerHTML = '<div class="discovery-detail__head">' +
      '<div><h4>' + escapeHtml(item.title) + '</h4><p class="muted">' + escapeHtml([item.composer, item.work].filter(Boolean).join(' · ')) + '</p></div>' +
      '<span class="pill">' + escapeHtml(discoveryStateLabel(item.editorialState)) + '</span>' +
    '</div>' +
    '<div class="grid two">' +
      '<div class="discovery-detail__block"><strong>Why it may fit</strong><p class="muted">' + escapeHtml(item.fitNote || 'No fit note saved yet.') + '</p></div>' +
      '<div class="discovery-detail__block"><strong>Caution</strong><p class="muted">' + escapeHtml(item.cautionNote || 'No caution note saved.') + '</p></div>' +
    '</div>' +
    '<div class="grid two">' +
      '<div class="discovery-detail__block"><strong>Source</strong><p class="muted">' + escapeHtml(item.source || 'Curated source') + (item.sourceNote ? (' · ' + escapeHtml(item.sourceNote)) : '') + '</p></div>' +
      '<div class="discovery-detail__block"><strong>Fit profile</strong><p class="muted">' + escapeHtml(profileFocus.concat(programmeFit).filter(Boolean).join(' · ') || 'General fit') + '</p></div>' +
    '</div>' +
    discoveryImportStatusPreviewHtml(item) +
    '<div class="item-badges">' +
      '<span class="item-badge">' + escapeHtml(item.language || '—') + '</span>' +
      '<span class="item-badge">' + escapeHtml(item.type.replace(/_/g, ' ')) + '</span>' +
      '<span class="item-badge">' + escapeHtml(discoveryCombinationLabel(item.vocalCombination) || item.vocalCombination || 'Combination TBD') + '</span>' +
      (roleLabel ? ('<span class="item-badge">' + escapeHtml(roleLabel) + '</span>') : '') +
      '<span class="item-badge">' + escapeHtml(discoveryReadinessLabel(item.readinessIntent)) + '</span>' +
      '<span class="item-badge">' + escapeHtml((discoveryCurrentDuration(item) || 0) ? (String(discoveryCurrentDuration(item)) + ' min') : 'Approx. duration') + '</span>' +
    '</div>' +
    (tags.length ? ('<p class="muted">Tags: ' + escapeHtml(tags.join(' · ')) + '</p>') : '') +
    '<label>Editorial state<select id="discovery-editorial-state">' + stateOptions + '</select></label>' +
    '<label>Editorial notes<textarea id="discovery-editorial-notes" rows="5" placeholder="Why it fits, partner needs, repertoire questions, or next-step reminders.">' + escapeHtml(item.editorialNotes || '') + '</textarea></label>' +
    '<div class="toolbar">' +
      '<button id="discovery-save-note" type="button">Save review</button>' +
      '<button id="discovery-import" type="button" class="button-primary">' + escapeHtml(item.importedItemId ? 'Open imported repertoire item' : 'Import into repertoire library') + '</button>' +
      (item.importedItemId ? '<span class="pill ok">Imported</span>' : '<span class="pill info">Import stays review-only</span>') +
    '</div>';
    if ($('discovery-editorial-state')) $('discovery-editorial-state').addEventListener('change', function () {
      var record = ensureDiscoveryRecord(item.id);
      record.state = safeString($('discovery-editorial-state').value).trim().toLowerCase();
      record.updatedAt = new Date().toISOString();
      markDirty(true, 'Discovery review updated');
      renderDiscoveryResults();
    });
    if ($('discovery-editorial-notes')) $('discovery-editorial-notes').addEventListener('input', function () {
      var record = ensureDiscoveryRecord(item.id);
      record.editorialNotes = safeString($('discovery-editorial-notes').value);
      record.updatedAt = new Date().toISOString();
      markDirty(true, 'Discovery review updated');
    });
    if ($('discovery-save-note')) $('discovery-save-note').addEventListener('click', saveDiscoveryReview);
    if ($('discovery-import')) $('discovery-import').addEventListener('click', function () { importDiscoveryItem(state.discoverySelectedId); });
  }
  function renderDiscoveryWorkspace() {
    renderDiscoveryResults();
    renderDiscoveryDetail();
  }
  function loadDiscovery() {
    ensureDiscoveryDoc();
    state.discoveryDoc = safeDiscoveryDoc(loadDoc('rg_repertoire_discovery', makeDiscoverySeed()));
    resetDiscoveryResultLimit();
    if ($('discovery-search')) $('discovery-search').value = state.discoverySearch;
    if ($('discovery-filter-profile')) $('discovery-filter-profile').value = state.discoveryProfileFilter;
    if ($('discovery-filter-family')) $('discovery-filter-family').value = state.discoveryFamilyFilter;
    if ($('discovery-filter-language')) $('discovery-filter-language').value = state.discoveryLanguageFilter;
    if ($('discovery-filter-composer')) $('discovery-filter-composer').value = state.discoveryComposerFilter;
    if ($('discovery-filter-work')) $('discovery-filter-work').value = state.discoveryWorkFilter;
    if ($('discovery-filter-type')) $('discovery-filter-type').value = state.discoveryTypeFilter;
    if ($('discovery-filter-combination')) $('discovery-filter-combination').value = state.discoveryCombinationFilter;
    if ($('discovery-filter-role')) $('discovery-filter-role').value = state.discoveryRoleFilter;
    if ($('discovery-filter-duration-min')) $('discovery-filter-duration-min').value = state.discoveryDurationMinFilter;
    if ($('discovery-filter-duration-max')) $('discovery-filter-duration-max').value = state.discoveryDurationMaxFilter;
    if ($('discovery-filter-readiness')) $('discovery-filter-readiness').value = state.discoveryReadinessFilter;
    if ($('discovery-filter-state')) $('discovery-filter-state').value = state.discoveryStateFilter;
    renderDiscoveryWorkspace();
  }
  function saveDiscoveryReview() {
    var item = discoveryItemsMerged().find(function (row) { return safeString(row.id).trim() === safeString(state.discoverySelectedId).trim(); }) || null;
    if (!item) return;
    var record = ensureDiscoveryRecord(item.id);
    record.state = safeString($('discovery-editorial-state') && $('discovery-editorial-state').value).trim().toLowerCase();
    record.editorialNotes = safeString($('discovery-editorial-notes') && $('discovery-editorial-notes').value);
    record.updatedAt = new Date().toISOString();
    state.discoveryDoc = safeDiscoveryDoc(state.discoveryDoc);
    saveDoc('rg_repertoire_discovery', state.discoveryDoc);
    renderDiscoveryWorkspace();
    markDirty(false, 'Discovery review saved');
  }
  function importDiscoveryItem(id) {
    var item = discoveryItemsMerged().find(function (row) { return safeString(row.id).trim() === safeString(id).trim(); }) || null;
    if (!item) return;
    var record = ensureDiscoveryRecord(item.id);
    if (record.importedItemId) {
      var existingIndex = (state.plannerDoc.items || []).findIndex(function (row) { return safeString(row.id).trim() === safeString(record.importedItemId).trim(); });
      if (existingIndex >= 0) {
        openSection('programbuilder');
        state.plannerIndex = existingIndex;
        renderPlannerRepList();
        setStatus('Imported repertoire item opened in the library editor.', 'ok');
        return;
      }
    }
    ensureProgramBuilderDocs();
    state.plannerDoc = safePlannerDoc(loadDoc('rg_repertoire_planner', makePlannerSeed()));
    var discoveryKey = [programBuilderNormalizeKey(item.title), programBuilderNormalizeKey(item.composer), programBuilderNormalizeKey(item.work)].join('|');
    var existingIndexByKey = (state.plannerDoc.items || []).findIndex(function (row) {
      var rowKey = [programBuilderNormalizeKey(row && row.title), programBuilderNormalizeKey(row && row.composer), programBuilderNormalizeKey(row && row.work)].join('|');
      return rowKey === discoveryKey;
    });
    if (existingIndexByKey >= 0) {
      var existing = state.plannerDoc.items[existingIndexByKey];
      record.state = 'imported_to_repertoire_library';
      record.importedItemId = safeString(existing && existing.id).trim();
      record.importedAt = record.importedAt || new Date().toISOString();
      record.updatedAt = new Date().toISOString();
      state.discoveryDoc = safeDiscoveryDoc(state.discoveryDoc);
      saveDoc('rg_repertoire_discovery', state.discoveryDoc);
      renderDiscoveryWorkspace();
      setStatus('That repertoire item already exists in the library, so Discovery linked to the existing record instead of importing a duplicate.', 'ok');
      return;
    }
    var titleSeed = [item.composer, item.title].filter(Boolean).join(' ');
    var raw = {
      id: nextPlannerItemId(titleSeed || item.id),
      title: item.title,
      composer: item.composer,
      work: item.work,
      type: plannerTypeFromDiscovery(item),
      category: plannerCategoryFromDiscovery(item),
      voiceCategory: safeString(item.voiceCategory),
      primaryVoice: safeString(item.primaryVoice),
      pairedVoices: clone(item.pairedVoices || []),
      language: item.language,
      approximateDurationMin: discoveryCurrentDuration(item),
      durationMin: discoveryCurrentDuration(item),
      formations: clone(item.formations || []),
      readiness: 'idea',
      availabilityStatus: 'idea',
      tags: programBuilderUniqueStrings((item.tags || []).concat(item.programmeFit || []).concat(['discovery_import','needs_preparation'])),
      fitTags: programBuilderUniqueStrings((item.programmeFit || []).concat(item.profileFocus || []).concat(['discovery_import'])),
      dramaticRole: safeString(item.dramaticRole),
      audienceAppeal: safeString(item.audienceAppeal),
      notes: discoveryImportNotes(item, record.editorialNotes),
      publicNotes: '',
      sortOrder: ((state.plannerDoc.items || []).length + 1) * 10,
      performanceStatus: '',
      performedIn: [],
      reviewStatus: 'manual_review',
      offerOnly: false,
      excludeFromOffers: true,
      sourceGroup: 'Repertoire Discovery',
      suggestionGroup: item.source || 'Curated source',
      practicalTags: ['discovery_import','manual_preparation']
    };
    var normalized = normalizePlannerItemRecord(raw, (state.plannerDoc.items || []).length);
    state.plannerDoc.items.push(normalized);
    record.state = 'imported_to_repertoire_library';
    record.importedItemId = normalized.id;
    record.importedAt = new Date().toISOString();
    record.updatedAt = record.importedAt;
    state.discoveryDoc = safeDiscoveryDoc(state.discoveryDoc);
    saveDoc('rg_repertoire_planner', state.plannerDoc);
    saveDoc('rg_repertoire_discovery', state.discoveryDoc);
    renderDiscoveryWorkspace();
    setStatus('Discovery item imported as idea / manual review and kept out of Programme Offers until you prepare it.', 'ok');
    markDirty(false, 'Discovery item imported');
  }
  function ensureOutreachDoc() {
    var raw = state.api.load('rg_outreach_tracker');
    if (!isObject(raw) || !Array.isArray(raw.records)) return;
  }
  function outreachSummaryCounts(records) {
    var all = records || [];
    var counts = { total: all.length, active: 0, due: 0, dueThisWeek: 0, confirmed: 0, negotiating: 0, linked: 0, noLinkedOffer: 0 };
    all.forEach(function (record) {
      if (!outreachStatusClosed(record.status)) counts.active += 1;
      if (outreachFollowupState(record).weight <= 2 && !outreachStatusClosed(record.status)) counts.due += 1;
      if (outreachDueThisWeek(record)) counts.dueThisWeek += 1;
      if (safeString(record.status).trim().toLowerCase() === 'confirmed') counts.confirmed += 1;
      if (safeString(record.status).trim().toLowerCase() === 'negotiating') counts.negotiating += 1;
      if (Array.isArray(record.linkedOfferIds) && record.linkedOfferIds.length) counts.linked += 1;
      else if (!outreachStatusClosed(record.status)) counts.noLinkedOffer += 1;
    });
    return counts;
  }
  function renderOutreachSummary(records) {
    var filtered = records || outreachFilteredRecords();
    var visibleCounts = outreachSummaryCounts(filtered);
    var allCounts = outreachSummaryCounts((state.outreachDoc && state.outreachDoc.records) || []);
    var offers = outreachSavedOfferRows();
    var current = outreachRecordById(state.outreachSelectedId) || null;
    outreachSyncQuickFilterButtons();
    if ($('outreach-results-pill')) $('outreach-results-pill').textContent = String(filtered.length) + (filtered.length === 1 ? ' record' : ' records');
    if ($('outreach-summary')) {
      $('outreach-summary').innerHTML = [
        outreachSummaryTile('In view', visibleCounts.total, 'default', state.outreachViewMode === 'report' ? 'Compact report' : 'Overview cards'),
        outreachSummaryTile('Active venues', allCounts.active, 'info', 'Still moving'),
        outreachSummaryTile('Need follow-up this week', allCounts.dueThisWeek, allCounts.dueThisWeek ? 'warn' : 'ok', allCounts.due ? (String(allCounts.due) + ' urgent now') : 'Nothing urgent today'),
        outreachSummaryTile('Negotiating', allCounts.negotiating, allCounts.negotiating ? 'gold' : 'default', 'Warm conversations'),
        outreachSummaryTile('Confirmed', allCounts.confirmed, 'ok', 'Already secured'),
        outreachSummaryTile('No linked offer yet', allCounts.noLinkedOffer, allCounts.noLinkedOffer ? 'warn' : 'ok', 'Worth pairing with a saved offer')
      ].join('');
    }
    if ($('outreach-offer-summary')) {
      var linkedCount = current ? (current.linkedOfferIds || []).length : 0;
      $('outreach-offer-summary').innerHTML = [
        '<span class="pill">' + escapeHtml(String(offers.length) + ' saved offers') + '</span>',
        current ? ('<span class="pill info">' + escapeHtml(String(linkedCount) + ' linked here') + '</span>') : '<span class="pill info">Select a venue</span>'
      ].join('');
    }
  }
  function renderOutreachList() {
    var box = $('outreach-list');
    if (!box) return;
    var records = outreachFilteredRecords();
    renderOutreachSummary(records);
    if (!records.length) {
      box.innerHTML = '<div class="empty-state">No venues match the current filters. Clear the filters or add a new record.</div>';
      return;
    }
    box.innerHTML = state.outreachViewMode === 'report' ? renderOutreachReport(records) : renderOutreachCards(records);
    var selectableNodes = box.querySelectorAll('[data-outreach-select]');
    selectableNodes.forEach(function (node) {
      node.addEventListener('click', function () {
        state.outreachSelectedId = node.getAttribute('data-outreach-select');
        renderOutreachWorkspace();
      });
    });
    box.querySelectorAll('[data-outreach-card-action]').forEach(function (node) {
      node.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var recordId = safeString(node.getAttribute('data-outreach-card-id')).trim();
        var action = safeString(node.getAttribute('data-outreach-card-action')).trim().toLowerCase();
        if (!recordId || !action) return;
        var record = outreachRecordById(recordId);
        if (!record) return;
        var nowIso = new Date().toISOString();
        if (action === 'contact-today') {
          record.lastContactDate = outreachTodayIso();
          if (!record.nextFollowUpDate) {
            record.nextFollowUpDate = outreachLocalDatePlusDays(7);
          }
        } else if (action === 'followup-7') {
          record.nextFollowUpDate = outreachLocalDatePlusDays(7);
        } else if (action === 'mark-negotiating') {
          record.status = 'negotiating';
        } else {
          return;
        }
        record.updatedAt = nowIso;
        if (!record.createdAt) record.createdAt = nowIso;
        markDirty(true, 'Outreach record updated');
        scheduleOutreachAutosave();
        renderOutreachWorkspace();
      });
    });
    var allRecords = (state.outreachDoc && Array.isArray(state.outreachDoc.records)) ? state.outreachDoc.records : [];
    if (!state.outreachSelectedId || !allRecords.some(function (row) { return safeString(row.id).trim() === safeString(state.outreachSelectedId).trim(); })) {
      state.outreachSelectedId = safeString(allRecords[0] && allRecords[0].id).trim();
    }
  }
  function outreachRecordLocation(record) {
    return [record.city, record.country].filter(Boolean).join(', ');
  }
  function renderOutreachEditor() {
    var box = $('outreach-editor');
    if (!box) return;
    var record = outreachRecordById(state.outreachSelectedId) || null;
    if (!record) {
      box.innerHTML = '<div class="empty-state">Select a venue to review contact details, linked offers, and follow-up timing.</div>';
      renderOutreachSummary();
      return;
    }
    var offers = outreachSavedOfferRows();
    var follow = outreachFollowupState(record);
    var historyHtml = outreachHistoryListHtml(record);
    var offerMarkup = offers.length ? offers.map(function (offer) {
      var checked = (record.linkedOfferIds || []).indexOf(safeString(offer.id).trim()) >= 0 ? ' checked' : '';
      var meta = [plannerFamilyLabelForLang(offer.family, offer.outputLang), (String(offer.targetDuration || 0) + ' min'), offer.formation].filter(Boolean).join(' · ');
      return '<label class="outreach-offer-link"><span><input type="checkbox" data-outreach-offer="' + escapeAttr(offer.id) + '"' + checked + '> ' + escapeHtml(savedOfferDisplayLabel(offer)) + '</span><span class="outreach-offer-link__meta">' + escapeHtml(meta) + '</span></label>';
    }).join('') : '<div class="empty-state">Save a Programme Offer first, then link it here when it matches a venue.</div>';
    box.innerHTML = '<div class="outreach-editor__head">' +
      '<div><h4>' + escapeHtml(record.venueName || 'Untitled venue') + '</h4><p class="muted">' + escapeHtml(outreachRecordLocation(record) || 'Add city and country to place the opportunity.') + '</p></div>' +
      '<div class="item-badges"><span class="pill">' + escapeHtml(outreachStatusLabel(record.status)) + '</span><span class="pill info ' + escapeAttr(follow.className) + '">' + escapeHtml(follow.label) + '</span></div>' +
    '</div>' +
    '<div class="grid two">' +
      '<div class="outreach-editor__block outreach-editor__block--venue">' +
        '<strong>Venue</strong>' +
        '<label>Venue name<input id="outreach-venue-name" value="' + escapeAttr(record.venueName) + '" placeholder="Concert hall, festival, church, embassy, salon"></label>' +
        '<label>City<input id="outreach-city" value="' + escapeAttr(record.city) + '" placeholder="Berlin"></label>' +
        '<label>Country<input id="outreach-country" value="' + escapeAttr(record.country) + '" placeholder="Germany"></label>' +
        '<label>Venue type<input id="outreach-venue-type" value="' + escapeAttr(record.venueType) + '" placeholder="Opera house, church, festival, private series"></label>' +
        '<label>Preferred outreach language<select id="outreach-language">' +
          ['en','de','es','it','fr'].map(function (lang) { return '<option value="' + lang + '"' + (record.outreachLanguage === lang ? ' selected' : '') + '>' + outreachLanguageLabel(lang) + '</option>'; }).join('') +
        '</select></label>' +
      '</div>' +
      '<div class="outreach-editor__block outreach-editor__block--contact">' +
        '<strong>Contact and timing</strong>' +
        '<label>Contact name<input id="outreach-contact-name" value="' + escapeAttr(record.contactName) + '" placeholder="Artistic director or presenter"></label>' +
        '<label>Contact email<input id="outreach-contact-email" value="' + escapeAttr(record.contactEmail) + '" placeholder="name@venue.org"></label>' +
        '<label>Status<select id="outreach-status">' +
          OUTREACH_STATUS_OPTIONS.map(function (option) { return '<option value="' + option.value + '"' + (record.status === option.value ? ' selected' : '') + '>' + escapeHtml(option.label) + '</option>'; }).join('') +
        '</select></label>' +
        '<label>Last contact date<input id="outreach-last-contact-date" type="date" value="' + escapeAttr(record.lastContactDate) + '"></label>' +
        '<label>Next follow-up date<input id="outreach-next-followup-date" type="date" value="' + escapeAttr(record.nextFollowUpDate) + '"></label>' +
        '<div class="outreach-editor__actions outreach-editor__actions--contact-quick">' +
          '<button id="outreach-last-contact-today" type="button">Mark contacted today</button>' +
          '<button id="outreach-next-followup-7" type="button">Follow up in 7 days</button>' +
          '<button id="outreach-next-followup-14" type="button">Follow up in 14 days</button>' +
          '<button id="outreach-status-negotiating" type="button">Mark negotiating</button>' +
          '<button id="outreach-status-confirmed" type="button">Mark accepted</button>' +
          '<button id="outreach-status-declined" type="button">Mark rejected</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="outreach-editor__block outreach-editor__block--fit">' +
      '<strong>Programme fit</strong>' +
      '<label>Fit tags<input id="outreach-fit-tags" value="' + escapeAttr((record.fitTags || []).join(', ')) + '" placeholder="gala, recital, church, embassy, tango"></label>' +
      '<label>Planned repertoire<textarea id="outreach-planned-repertoire" rows="4" placeholder="Specific repertoire currently planned for this venue/opportunity.">' + escapeHtml(record.plannedRepertoire || '') + '</textarea></label>' +
      '<label>Notes<textarea id="outreach-notes" rows="6" placeholder="Why this venue may fit, local context, booking windows, collaborators, or next-step reminders.">' + escapeHtml(record.notes || '') + '</textarea></label>' +
    '</div>' +
    '<div class="outreach-editor__block outreach-editor__block--message">' +
      '<strong>Outreach details</strong>' +
      '<label class="outreach-message-label">Message sent<textarea id="outreach-message-sent" rows="4" placeholder="Copy of the message sent to this venue.">' + escapeHtml(record.messageSent || '') + '</textarea></label>' +
      '<label>Cache proposed<input id="outreach-cache-proposed" value="' + escapeAttr(record.cacheProposed) + '" placeholder="e.g. 5000 EUR"></label>' +
      '<label>Cache negotiated<input id="outreach-cache-negotiated" value="' + escapeAttr(record.cacheNegotiated) + '" placeholder="e.g. 4500 EUR"></label>' +
    '</div>' +
    '<div class="outreach-editor__block outreach-editor__block--history">' +
      '<strong>Relationship history</strong>' +
      '<p class="muted">Keep a light contact timeline so the outreach story stays visible: what was sent, how they replied, and where the conversation stands now.</p>' +
      '<div class="outreach-editor__actions outreach-editor__actions--history-quick">' +
        ['first_contact_sent','replied','follow_up_made','negotiation_note','confirmed','declined'].map(function (type) {
          return '<button type="button" data-outreach-history-quick="' + escapeAttr(type) + '">' + escapeHtml(outreachHistoryQuickButtonLabel(type)) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="grid two outreach-history-entry-grid">' +
        '<label>Event type<select id="outreach-history-type">' +
          OUTREACH_HISTORY_EVENT_OPTIONS.map(function (option) { return '<option value="' + option.value + '"' + (option.value === 'follow_up_made' ? ' selected' : '') + '>' + escapeHtml(option.label) + '</option>'; }).join('') +
        '</select></label>' +
        '<label>Date<input id="outreach-history-date" type="date" value="' + escapeAttr(outreachTodayIso()) + '"></label>' +
      '</div>' +
      '<label>Entry note<textarea id="outreach-history-note" rows="3" placeholder="Short context: who replied, what was discussed, timing, next step, or any useful nuance."></textarea></label>' +
      '<div class="outreach-editor__actions outreach-editor__actions--history-add">' +
        '<button id="outreach-history-add" type="button">Add history entry</button>' +
      '</div>' +
      historyHtml +
    '</div>' +
    '<div class="outreach-editor__block outreach-editor__block--offers">' +
      '<strong>Linked Programme Offers</strong>' +
      '<div class="outreach-offer-links">' + offerMarkup + '</div>' +
    '</div>' +
    '<div class="toolbar outreach-editor__footer">' +
      '<button id="outreach-save-record" type="button" class="button-primary">Save record</button>' +
      '<button id="outreach-new-from-current" type="button">Duplicate as new lead</button>' +
    '</div>';
    ['outreach-venue-name','outreach-city','outreach-country','outreach-venue-type','outreach-language','outreach-contact-name','outreach-contact-email','outreach-status','outreach-last-contact-date','outreach-next-followup-date','outreach-fit-tags','outreach-planned-repertoire','outreach-notes','outreach-message-sent','outreach-cache-proposed','outreach-cache-negotiated'].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener(id === 'outreach-notes' || id === 'outreach-message-sent' || id.indexOf('cache') >= 0 || id.indexOf('name') >= 0 || id.indexOf('email') >= 0 || id.indexOf('phone') >= 0 || id.indexOf('city') >= 0 || id.indexOf('country') >= 0 || id.indexOf('type') >= 0 || id.indexOf('tags') >= 0 ? 'input' : 'change', persistOutreachEditor);
      if (id !== 'outreach-notes' && (id.indexOf('name') >= 0 || id.indexOf('email') >= 0 || id.indexOf('phone') >= 0 || id.indexOf('city') >= 0 || id.indexOf('country') >= 0 || id.indexOf('type') >= 0 || id.indexOf('tags') >= 0)) {
        el.addEventListener('change', persistOutreachEditor);
      }
    });
    box.querySelectorAll('[data-outreach-offer]').forEach(function (el) {
      el.addEventListener('change', persistOutreachEditor);
    });
    if ($('outreach-last-contact-today')) $('outreach-last-contact-today').addEventListener('click', function () {
      if ($('outreach-last-contact-date')) $('outreach-last-contact-date').value = outreachTodayIso();
      persistOutreachEditor();
    });
    if ($('outreach-next-followup-7')) $('outreach-next-followup-7').addEventListener('click', function () {
      var today = outreachParseDate(outreachTodayIso());
      if (!today) return;
      today.setDate(today.getDate() + 7);
      var value = today.toISOString().slice(0, 10);
      if ($('outreach-next-followup-date')) $('outreach-next-followup-date').value = value;
      persistOutreachEditor();
    });
    if ($('outreach-next-followup-14')) $('outreach-next-followup-14').addEventListener('click', function () {
      var today = outreachParseDate(outreachTodayIso());
      if (!today) return;
      today.setDate(today.getDate() + 14);
      var value = today.toISOString().slice(0, 10);
      if ($('outreach-next-followup-date')) $('outreach-next-followup-date').value = value;
      persistOutreachEditor();
    });
    if ($('outreach-status-negotiating')) $('outreach-status-negotiating').addEventListener('click', function () {
      if ($('outreach-status')) $('outreach-status').value = 'negotiating';
      persistOutreachEditor();
    });
    if ($('outreach-status-confirmed')) $('outreach-status-confirmed').addEventListener('click', function () {
      if ($('outreach-status')) $('outreach-status').value = 'confirmed';
      persistOutreachEditor();
    });
    if ($('outreach-status-declined')) $('outreach-status-declined').addEventListener('click', function () {
      if ($('outreach-status')) $('outreach-status').value = 'declined';
      persistOutreachEditor();
    });
    if ($('outreach-save-record')) $('outreach-save-record').addEventListener('click', saveOutreachRecord);
    if ($('outreach-new-from-current')) $('outreach-new-from-current').addEventListener('click', function () { createOutreachRecord(record); });
    if ($('outreach-history-add')) $('outreach-history-add').addEventListener('click', function () {
      var activeRecord = outreachRecordById(state.outreachSelectedId);
      if (!activeRecord) return;
      var type = safeString($('outreach-history-type') && $('outreach-history-type').value || 'follow_up_made').trim().toLowerCase() || 'follow_up_made';
      var date = outreachDateValue($('outreach-history-date') && $('outreach-history-date').value) || outreachTodayIso();
      var note = safeString($('outreach-history-note') && $('outreach-history-note').value).trim();
      var added = outreachAddHistoryEntry(activeRecord, type, date, note);
      if (!added) return;
      renderOutreachWorkspace();
      markDirty(true, 'Outreach history updated');
      scheduleOutreachAutosave();
    });
    box.querySelectorAll('[data-outreach-history-quick]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var activeRecord = outreachRecordById(state.outreachSelectedId);
        if (!activeRecord) return;
        var type = safeString(btn.getAttribute('data-outreach-history-quick')).trim().toLowerCase();
        var added = outreachAddHistoryEntry(activeRecord, type, outreachTodayIso(), '');
        if (!added) return;
        renderOutreachWorkspace();
        markDirty(true, 'Outreach history updated');
        scheduleOutreachAutosave();
      });
    });
    renderOutreachSummary();
  }
  function renderOutreachWorkspace() {
    renderOutreachList();
    renderOutreachEditor();
  }
  var outreachAutosaveTimer = 0;
  function scheduleOutreachAutosave() {
    if (outreachAutosaveTimer) {
      clearTimeout(outreachAutosaveTimer);
      outreachAutosaveTimer = 0;
    }
    outreachAutosaveTimer = setTimeout(function () {
      outreachAutosaveTimer = 0;
      state.outreachDoc = safeOutreachDoc(state.outreachDoc);
      saveDoc('rg_outreach_tracker', state.outreachDoc);
    }, 450);
  }
  function persistOutreachEditor() {
    var record = outreachRecordById(state.outreachSelectedId);
    if (!record) return;
    record.venueName = safeString($('outreach-venue-name') && $('outreach-venue-name').value).trim();
    record.city = safeString($('outreach-city') && $('outreach-city').value).trim();
    record.country = safeString($('outreach-country') && $('outreach-country').value).trim();
    record.venueType = safeString($('outreach-venue-type') && $('outreach-venue-type').value).trim();
    record.contactName = safeString($('outreach-contact-name') && $('outreach-contact-name').value).trim();
    record.contactEmail = safeString($('outreach-contact-email') && $('outreach-contact-email').value).trim();
    record.contactPhone = safeString($('outreach-contact-phone') && $('outreach-contact-phone').value).trim();
    record.outreachLanguage = safeString($('outreach-language') && $('outreach-language').value || 'en').trim().toLowerCase() || 'en';
    record.status = safeString($('outreach-status') && $('outreach-status').value || 'idea').trim().toLowerCase() || 'idea';
    record.lastContactDate = outreachDateValue($('outreach-last-contact-date') && $('outreach-last-contact-date').value);
    record.nextFollowUpDate = outreachDateValue($('outreach-next-followup-date') && $('outreach-next-followup-date').value);
    record.fitTags = programBuilderUniqueStrings(safeString($('outreach-fit-tags') && $('outreach-fit-tags').value).split(',').map(function (tag) {
      return safeString(tag).trim().toLowerCase();
    }).filter(Boolean));
    record.plannedRepertoire = safeString($('outreach-planned-repertoire') && $('outreach-planned-repertoire').value);
    record.notes = safeString($('outreach-notes') && $('outreach-notes').value);
    record.messageSent = safeString($('outreach-message-sent') && $('outreach-message-sent').value);
    record.cacheProposed = safeString($('outreach-cache-proposed') && $('outreach-cache-proposed').value);
    record.cacheNegotiated = safeString($('outreach-cache-negotiated') && $('outreach-cache-negotiated').value);
    record.linkedOfferIds = programBuilderUniqueStrings(Array.prototype.slice.call(document.querySelectorAll('[data-outreach-offer]:checked')).map(function (el) {
      return safeString(el.getAttribute('data-outreach-offer')).trim();
    }).filter(Boolean));
    record.updatedAt = new Date().toISOString();
    if (!record.createdAt) record.createdAt = record.updatedAt;
    markDirty(true, 'Outreach record updated');
    renderOutreachSummary();
    scheduleOutreachAutosave();
  }
  function saveOutreachRecord() {
    state.outreachDoc = safeOutreachDoc(state.outreachDoc);
    saveDoc('rg_outreach_tracker', state.outreachDoc);
    renderOutreachWorkspace();
    markDirty(false, 'Outreach record saved');
  }
  function createOutreachRecord(seedRecord) {
    state.outreachDoc = safeOutreachDoc(state.outreachDoc);
    var seed = seedRecord || {};
    var titleSeed = [seed.venueName || 'venue', seed.city || String((state.outreachDoc.records || []).length + 1)].join(' ');
    var idBase = 'outreach_' + programBuilderSlug(titleSeed);
    var id = idBase;
    var counter = 2;
    while (outreachRecordById(id)) {
      id = idBase + '_' + String(counter);
      counter += 1;
    }
    var now = new Date().toISOString();
    var created = normalizeOutreachRecord({
      id: id,
      venueName: seedRecord ? safeString(seedRecord.venueName).trim() : '',
      city: seedRecord ? safeString(seedRecord.city).trim() : '',
      country: seedRecord ? safeString(seedRecord.country).trim() : '',
      venueType: seedRecord ? safeString(seedRecord.venueType).trim() : '',
      contactName: seedRecord ? safeString(seedRecord.contactName).trim() : '',
      contactEmail: seedRecord ? safeString(seedRecord.contactEmail).trim() : '',
      outreachLanguage: seedRecord ? safeString(seedRecord.outreachLanguage || 'en') : 'en',
      fitTags: seedRecord ? clone(seedRecord.fitTags || []) : [],
      notes: '',
      status: 'idea',
      lastContactDate: '',
      nextFollowUpDate: '',
      linkedOfferIds: seedRecord ? clone(seedRecord.linkedOfferIds || []) : [],
      history: [{ type: 'created', eventDate: outreachTodayIso(), note: seedRecord ? 'Duplicated from an existing opportunity.' : 'Record created.' }],
      createdAt: now,
      updatedAt: now
    }, (state.outreachDoc.records || []).length);
    state.outreachDoc.records.unshift(created);
    state.outreachSelectedId = created.id;
    renderOutreachWorkspace();
    markDirty(true, 'New outreach record ready');
    scheduleOutreachAutosave();
  }
  function loadOutreach() {
    ensureProgramBuilderDocs();
    ensureOutreachDoc();
    state.blueprintDoc = safeBlueprintsDoc(loadDoc('rg_program_blueprints', makeBlueprintDocSeed()));
    state.outreachDoc = safeOutreachDoc(loadDoc('rg_outreach_tracker', makeOutreachSeed()));
    if ($('outreach-search')) $('outreach-search').value = state.outreachSearch;
    if ($('outreach-view-mode')) $('outreach-view-mode').value = safeString(state.outreachViewMode || 'cards') || 'cards';
    if ($('outreach-filter-status')) $('outreach-filter-status').value = state.outreachStatusFilter;
    if ($('outreach-filter-followup')) $('outreach-filter-followup').value = state.outreachFollowupFilter;
    state.outreachQuickFilter = safeString(state.outreachQuickFilter || 'all').trim().toLowerCase() || 'all';
    outreachSyncQuickFilterButtons();
    renderOutreachWorkspace();
  }
  function programsDurationTolerance(target) {
    var duration = Math.max(0, Number(target) || 0);
    var acceptable = duration <= 30 ? 3 : duration <= 45 ? 3 : duration <= 60 ? 4 : Math.max(4, Math.round(duration * 0.07));
    return { lower: Math.max(0, duration - acceptable), upper: duration + acceptable, slightOver: acceptable };
  }
  function programsDurationState(total, target) {
    var duration = Math.max(0, Number(target) || 0);
    var value = Math.max(0, Number(total) || 0);
    var bands = programsDurationTolerance(duration);
    if (value < bands.lower) return { key: 'too short', className: 'warn', delta: value - duration, bands: bands };
    if (value <= bands.upper) return { key: 'within range', className: 'ok', delta: value - duration, bands: bands };
    if (value <= bands.upper + bands.slightOver) return { key: 'slightly over', className: 'warn', delta: value - duration, bands: bands };
    return { key: 'too long', className: 'err', delta: value - duration, bands: bands };
  }
  function programsDurationProgressText(total, target, lang) {
    var copy = plannerOutputCopy(lang);
    var value = Math.max(0, Number(total) || 0);
    var duration = Math.max(0, Number(target) || 0);
    var delta = Math.abs(value - duration);
    if (delta === 0) return copy.durationProgressExact || copy.statusOk || 'On target';
    if (safeString(lang || 'en').trim().toLowerCase() === 'de') return value < duration ? ('Etwa ' + String(delta) + ' Min. zu kurz') : ('Etwa ' + String(delta) + ' Min. darüber');
    if (safeString(lang || 'en').trim().toLowerCase() === 'es') return value < duration ? ('Unos ' + String(delta) + ' min por debajo') : ('Unos ' + String(delta) + ' min por encima');
    if (safeString(lang || 'en').trim().toLowerCase() === 'it') return value < duration ? ('Circa ' + String(delta) + ' min in meno') : ('Circa ' + String(delta) + ' min in più');
    if (safeString(lang || 'en').trim().toLowerCase() === 'fr') return value < duration ? ('Environ ' + String(delta) + ' min de moins') : ('Environ ' + String(delta) + ' min de plus');
    return value < duration ? ('About ' + String(delta) + ' min short') : ('About ' + String(delta) + ' min over');
  }
  function programBuilderDurationRangeText(target) {
    var bands = programsDurationTolerance(target);
    return 'Ideal window ' + String(bands.lower) + '–' + String(bands.upper) + ' min';
  }
  function programBuilderDurationGuidanceText(total, target, encoreTotal) {
    var status = programsDurationState(total, target);
    var delta = Math.abs(Number(status.delta) || 0);
    if (!total) return 'Start with a quick draft, then refine the order once a few pieces are in.';
    if (status.key === 'within range') {
      if (encoreTotal > 0) return 'Main programme is in range. Keep encore options separate unless you want them visible in the sheet.';
      return 'Main programme is in range. Focus next on pacing, contrast, and a strong ending.';
    }
    if (status.key === 'too short') return 'Add about ' + String(delta) + ' min to reach the target range.';
    if (status.key === 'slightly over') return 'Slightly long. Trim about ' + String(delta) + ' min or move one item to encore.';
    return 'Too long. Trim about ' + String(delta) + ' min so the main programme reads cleanly.';
  }
  function renderProgramBuilderDurationBoard(bp, lang, copy) {
    var total = Math.max(0, Number(bp && bp.totalDuration) || 0);
    var target = Math.max(0, Number(bp && bp.targetDuration) || 0);
    var encoreTotal = Math.max(0, Number(bp && bp.encoreTotalDuration) || 0);
    var status = programsDurationState(total, target);
    var board = $('pb-duration-board');
    if (board) board.className = 'pb-duration-board ' + status.className;
    if ($('pb-duration-main-focus')) $('pb-duration-main-focus').textContent = String(total) + ' / ' + String(target) + ' ' + copy.durationMinutes;
    if ($('pb-duration-guidance')) $('pb-duration-guidance').textContent = programBuilderDurationGuidanceText(total, target, encoreTotal);
    if ($('pb-duration-range')) $('pb-duration-range').textContent = programBuilderDurationRangeText(target);
    if ($('pb-duration-remaining')) {
      $('pb-duration-remaining').textContent = encoreTotal > 0
        ? ('Encore reserve: ' + String(encoreTotal) + ' ' + copy.durationMinutes)
        : programsDurationProgressText(total, target, lang);
    }
    var fill = $('pb-duration-meter-fill');
    if (fill) {
      var ratio = target > 0 ? Math.min(1, total / target) : 0;
      fill.style.width = String(Math.round(ratio * 100)) + '%';
      fill.className = 'pb-duration-meter__fill ' + status.className;
    }
  }
  function recomputeBlueprint(bp) {
    sortBlueprintItemsForMode(bp);
    var total = 0;
    (bp.items || []).forEach(function (it, idx) {
      it.position = idx;
      var piece = getPlannerItemById(it.pieceId);
      total += Math.max(0, Number(it.customDuration) || (piece ? plannerEffectiveDuration(piece) || 0 : 0));
    });
    var encoreTotal = 0;
    (bp.encoreItems || []).forEach(function (it, idx) {
      it.position = idx;
      var piece = getPlannerItemById(it.pieceId);
      encoreTotal += Math.max(0, Number(it.customDuration) || (piece ? plannerEffectiveDuration(piece) || 0 : 0));
    });
    bp.totalDuration = total;
    bp.encoreTotalDuration = encoreTotal;
    bp.combinedDuration = total + encoreTotal;
    bp.status = programsDurationState(total, bp.targetDuration).key;
    return bp;
  }
  function saveProgramBuilderDocs(withStatus) {
    state.plannerDoc = safePlannerDoc(state.plannerDoc);
    state.concertHistoryDoc = safeConcertHistoryDoc(state.concertHistoryDoc);
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    PROGRAM_BUILDER_BLUEPRINT_KEYS.forEach(function (key) { recomputeBlueprint(state.blueprintDoc.blueprints[key]); });
    saveDoc('rg_repertoire_planner', state.plannerDoc);
    saveDoc('rg_concert_history', state.concertHistoryDoc);
    saveDoc('rg_program_blueprints', state.blueprintDoc);
    if (withStatus !== false) renderProgramBuilderStatus();
  }
  function loadProgramBuilder() {
    ensureProgramBuilderDocs();
    state.plannerDoc = safePlannerDoc(loadDoc('rg_repertoire_planner', makePlannerSeed()));
    state.concertHistoryDoc = safeConcertHistoryDoc(loadDoc('rg_concert_history', makeConcertHistorySeed()));
    state.blueprintDoc = safeBlueprintsDoc(loadDoc('rg_program_blueprints', makeBlueprintDocSeed()));
    if (applyHistoricalProgramBuilderImports()) {
      saveDoc('rg_repertoire_planner', state.plannerDoc);
      saveDoc('rg_concert_history', state.concertHistoryDoc);
    }
    state.blueprintOutputLang = safeString((currentBlueprint() && currentBlueprint().outputLang) || state.lang || 'en').trim().toLowerCase() || 'en';
    state.plannerIndex = -1;
    state.concertHistoryIndex = -1;
    if ($('pb-rep-search')) $('pb-rep-search').value = state.plannerSearch;
    if ($('pb-rep-filter-type')) $('pb-rep-filter-type').value = state.plannerTypeFilter;
    if ($('pb-rep-filter-lang')) $('pb-rep-filter-lang').value = state.plannerLangFilter;
    if ($('pb-rep-filter-readiness')) $('pb-rep-filter-readiness').value = state.plannerReadinessFilter;
    if ($('pb-rep-filter-tag')) $('pb-rep-filter-tag').value = state.plannerTagFilter;
    if ($('pb-rep-sort')) $('pb-rep-sort').value = state.plannerSort;
    if ($('pb-offer-filter-status')) $('pb-offer-filter-status').value = state.plannerOfferStatusFilter;
    if ($('pb-offer-filter-category')) $('pb-offer-filter-category').value = state.plannerOfferCategoryFilter;
    if ($('pb-offer-filter-tag')) $('pb-offer-filter-tag').value = state.plannerOfferTagFilter;
    if ($('pb-offer-filter-lang')) $('pb-offer-filter-lang').value = state.plannerOfferLangFilter;
    if ($('pb-offer-filter-matchingOnly')) $('pb-offer-filter-matchingOnly').checked = state.plannerOfferMatchingOnly !== false;
    if ($('pb-offer-filter-showAll')) $('pb-offer-filter-showAll').checked = state.plannerOfferMatchingOnly === false;
    if ($('pb-offer-filter-formation')) $('pb-offer-filter-formation').checked = !!state.plannerOfferFormationOnly;
    if ($('pb-offer-filter-showWithoutTenor')) $('pb-offer-filter-showWithoutTenor').checked = !!state.plannerOfferShowWithoutTenor;
    if ($('pb-saved-search')) $('pb-saved-search').value = state.savedOfferSearch;
    if ($('pb-saved-filter-type')) $('pb-saved-filter-type').value = state.savedOfferTypeFilter;
    if ($('pb-saved-filter-family')) $('pb-saved-filter-family').value = state.savedOfferFamilyFilter;
    if ($('pb-saved-filter-duration')) $('pb-saved-filter-duration').value = state.savedOfferDurationFilter;
    if ($('pb-saved-filter-lang')) $('pb-saved-filter-lang').value = state.savedOfferLangFilter;
    if ($('pb-saved-filter-formation')) $('pb-saved-filter-formation').value = state.savedOfferFormationFilter;
    if ($('pb-saved-filter-status')) $('pb-saved-filter-status').value = state.savedOfferStatusFilter;
    if ($('pb-history-search')) $('pb-history-search').value = state.concertHistorySearch;
    resetQuickAddManualForm();
    renderPlannerRepList();
    renderBlueprintBuilder();
    renderSavedOfferBrowser();
    renderConcertHistoryList();
    renderOutsideRepertoireSuggestions();
    renderProgramBuilderStatus();
    syncProgramBuilderResponsiveUi(true);
  }
  function renderProgramBuilderStatus() {
    var pill = $('pb-status');
    if (!pill) return;
    var bp = currentBlueprint();
    var total = Number(bp.totalDuration) || 0;
    var encoreTotal = Number(bp.encoreTotalDuration) || 0;
    var status = programsDurationState(total, Number(bp.targetDuration) || 0);
    pill.className = 'pill ' + status.className;
    var slotLabel = plannerFamilyLabelForLang(bp.family, safeString(bp.outputLang || state.lang || 'en').trim().toLowerCase()) + ' / ' + String(bp.targetDuration) + ' min';
    var bits = [
      'Current offer: ' + slotLabel,
      bp.buildMode === 'dramatic_arc' ? (safeString(bp.family).trim().toLowerCase() === 'gala' ? 'gala arc' : 'dramatic arc') : 'free build',
      total + ' min main',
      encoreTotal ? (encoreTotal + ' min encore') : '',
      plannerStatusLabel(status.key, safeString(bp.outputLang || state.lang || 'en').trim().toLowerCase())
    ];
    if (safeString(bp.sourceMasterLabel || bp.sourceMasterId).trim()) bits.push('based on master');
    pill.textContent = bits.join(' · ');
    renderProgramOfferSaveState();
  }
  function plannerListedIndices() {
    var search = safeString(state.plannerSearch).trim().toLowerCase();
    var lang = safeString(state.plannerLangFilter).trim().toLowerCase();
    var tag = safeString(state.plannerTagFilter).trim().toLowerCase();
    var items = (state.plannerDoc && Array.isArray(state.plannerDoc.items)) ? state.plannerDoc.items : [];
    var out = items.map(function (_, i) { return i; }).filter(function (i) {
      var item = items[i];
      if (state.plannerTypeFilter !== 'all' && safeString(item.type) !== state.plannerTypeFilter) return false;
      if (state.plannerReadinessFilter !== 'all' && safeString(item.readiness) !== state.plannerReadinessFilter) return false;
      if (lang && safeString(item.language).trim().toLowerCase().indexOf(lang) < 0) return false;
      if (tag && ((item.fitTags || []).concat(item.tags || []).join(' ').toLowerCase()).indexOf(tag) < 0) return false;
      if (!search) return true;
      var hay = [item.id, item.title, item.composer, item.work, item.notes, item.publicNotes, (item.fitTags || []).join(' '), (item.performedIn || []).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(search) >= 0;
    });
    var sortKey = state.plannerSort || 'sortOrder';
    out.sort(function (a, b) {
      var A = items[a], B = items[b];
      if (sortKey === 'title') return safeString(A.title).localeCompare(safeString(B.title));
      if (sortKey === 'composer') return safeString(A.composer).localeCompare(safeString(B.composer));
      if (sortKey === 'durationMin') return (Number(A.durationMin) || 0) - (Number(B.durationMin) || 0);
      if (sortKey === 'readiness') return safeString(A.readiness).localeCompare(safeString(B.readiness));
      return (Number(A.sortOrder) || 0) - (Number(B.sortOrder) || 0);
    });
    return out;
  }
  function renderPlannerRepList() {
    var box = $('pb-rep-list');
    var count = $('pb-rep-count');
    if (!box) return;
    var items = state.plannerDoc.items || [];
    var listed = plannerListedIndices();
    if (count) count.textContent = listed.length + ' items';
    if (!listed.length) {
      box.innerHTML = '<div class="empty-state">No repertoire items match the current filters. Relax the search or filters to review more of the archive.</div>';
      state.plannerIndex = -1;
      renderPlannerRepEditor();
      renderBlueprintBuilder();
      return;
    }
    box.innerHTML = listed.map(function (idx) {
      var item = items[idx];
      var active = idx === state.plannerIndex ? 'item active' : 'item';
      var extraBadges = [];
      if (safeString(item.performanceStatus) === 'performed') extraBadges.push('<span class="item-badge ok">performed</span>');
      if (safeString(item.reviewStatus) === 'manual_review') extraBadges.push('<span class="item-badge warn">review</span>');
      if (safeString(item.sourceGroup).trim() === 'Repertoire Discovery') extraBadges.push('<span class="item-badge warn">discovery import</span>');
      if (item.offerOnly === true) extraBadges.push('<span class="item-badge">offer only</span>');
      if (item.excludeFromOffers === true) extraBadges.push('<span class="item-badge">hidden from offers</span>');
      return '<div class="' + active + '" data-pb-rep-idx="' + idx + '"><div class="item-main"><strong>' + escapeHtml(item.title || '(untitled)') + '</strong><br><span class="muted">' + escapeHtml([item.composer, item.work].filter(Boolean).join(' · ')) + '</span><div class="item-badges"><span class="item-badge">' + escapeHtml(plannerItemVoiceLabel(item)) + '</span><span class="item-badge">' + escapeHtml(item.availabilityStatus || item.readiness) + '</span><span class="item-badge">' + escapeHtml(String(plannerEffectiveDuration(item) || 0) + ' min') + '</span>' + (item.dramaticRole ? ('<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[item.dramaticRole] || item.dramaticRole) + '</span>') : '') + (item.energyLevel ? ('<span class="item-badge">' + escapeHtml(item.energyLevel) + '</span>') : '') + (item.sourceGroup ? ('<span class="item-badge">' + escapeHtml(item.sourceGroup) + '</span>') : '') + extraBadges.join('') + '</div></div></div>';
    }).join('');
    box.querySelectorAll('[data-pb-rep-idx]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.plannerIndex = Number(el.getAttribute('data-pb-rep-idx'));
        renderPlannerRepList();
        renderPlannerRepEditor();
      });
    });
    if (state.plannerIndex < 0 || listed.indexOf(state.plannerIndex) < 0) {
      state.plannerIndex = listed[0];
      renderPlannerRepList();
      renderPlannerRepEditor();
      return;
    }
    renderPlannerRepEditor();
  }
  function renderPlannerRepEditor() {
    var item = state.plannerDoc.items[state.plannerIndex] || {};
    if ($('pb-rep-id')) $('pb-rep-id').value = safeString(item.id);
    if ($('pb-rep-title')) $('pb-rep-title').value = safeString(item.title);
    if ($('pb-rep-composer')) $('pb-rep-composer').value = safeString(item.composer);
    if ($('pb-rep-work')) $('pb-rep-work').value = safeString(item.work);
    if ($('pb-rep-type')) setSelectWithCustomValue('pb-rep-type', safeString(item.type || 'other'), 'other');
    if ($('pb-rep-language')) $('pb-rep-language').value = safeString(item.language);
    if ($('pb-rep-durationMin')) $('pb-rep-durationMin').value = item.durationMin || '';
    if ($('pb-rep-approximateDurationMin')) $('pb-rep-approximateDurationMin').value = item.approximateDurationMin || '';
    if ($('pb-rep-readiness')) setSelectWithCustomValue('pb-rep-readiness', safeString(item.readiness || 'idea'), 'idea');
    if ($('pb-rep-availabilityStatus')) setSelectWithCustomValue('pb-rep-availabilityStatus', safeString(item.availabilityStatus || item.readiness || 'idea'), 'idea');
    if ($('pb-rep-performanceStatus')) $('pb-rep-performanceStatus').value = safeString(item.performanceStatus);
    if ($('pb-rep-reviewStatus')) $('pb-rep-reviewStatus').value = safeString(item.reviewStatus || 'clean');
    if ($('pb-rep-category')) setSelectWithCustomValue('pb-rep-category', safeString(item.category), '');
    if ($('pb-rep-voiceCategory')) setSelectWithCustomValue('pb-rep-voiceCategory', safeString(item.voiceCategory), '');
    if ($('pb-rep-primaryVoice')) $('pb-rep-primaryVoice').value = safeString(item.primaryVoice);
    if ($('pb-rep-pairedVoices')) $('pb-rep-pairedVoices').value = Array.isArray(item.pairedVoices) ? item.pairedVoices.join(', ') : '';
    if ($('pb-rep-includesTenor')) $('pb-rep-includesTenor').checked = item.includesTenor === true;
    if ($('pb-rep-formations')) $('pb-rep-formations').value = Array.isArray(item.formations) ? item.formations.join('\n') : '';
    if ($('pb-rep-tags')) $('pb-rep-tags').value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    if ($('pb-rep-fitTags')) $('pb-rep-fitTags').value = Array.isArray(item.fitTags) ? item.fitTags.join(', ') : '';
    if ($('pb-rep-performedIn')) $('pb-rep-performedIn').value = Array.isArray(item.performedIn) ? item.performedIn.join('\n') : '';
    if ($('pb-rep-offerOnly')) $('pb-rep-offerOnly').checked = item.offerOnly === true;
    if ($('pb-rep-excludeFromOffers')) $('pb-rep-excludeFromOffers').checked = item.excludeFromOffers === true;
    if ($('pb-rep-sourceGroup')) $('pb-rep-sourceGroup').value = safeString(item.sourceGroup);
    if ($('pb-rep-suggestionGroup')) $('pb-rep-suggestionGroup').value = safeString(item.suggestionGroup);
    if ($('pb-rep-dramaticRole')) setSelectWithCustomValue('pb-rep-dramaticRole', safeString(item.dramaticRole), '');
    if ($('pb-rep-energyLevel')) setSelectWithCustomValue('pb-rep-energyLevel', safeString(item.energyLevel), '');
    if ($('pb-rep-tempoProfile')) setSelectWithCustomValue('pb-rep-tempoProfile', safeString(item.tempoProfile), '');
    if ($('pb-rep-impactLevel')) setSelectWithCustomValue('pb-rep-impactLevel', safeString(item.impactLevel), '');
    if ($('pb-rep-audienceAppeal')) setSelectWithCustomValue('pb-rep-audienceAppeal', safeString(item.audienceAppeal), '');
    if ($('pb-rep-galaRole')) setSelectWithCustomValue('pb-rep-galaRole', safeString(item.galaRole), '');
    if ($('pb-rep-vocalLoad')) setSelectWithCustomValue('pb-rep-vocalLoad', safeString(item.vocalLoad), '');
    if ($('pb-rep-texture')) setSelectWithCustomValue('pb-rep-texture', safeString(item.texture), '');
    if ($('pb-rep-styleBucket')) setSelectWithCustomValue('pb-rep-styleBucket', safeString(item.styleBucket), '');
    if ($('pb-rep-recoveryValue')) setSelectWithCustomValue('pb-rep-recoveryValue', safeString(item.recoveryValue), '');
    if ($('pb-rep-bestDurationFit')) setSelectWithCustomValue('pb-rep-bestDurationFit', safeString(item.bestDurationFit || 'all'), 'all');
    if ($('pb-rep-moodTags')) $('pb-rep-moodTags').value = Array.isArray(item.moodTags) ? item.moodTags.join(', ') : '';
    if ($('pb-rep-practicalTags')) $('pb-rep-practicalTags').value = Array.isArray(item.practicalTags) ? item.practicalTags.join(', ') : '';
    if ($('pb-rep-encoreCandidate')) $('pb-rep-encoreCandidate').checked = item.encoreCandidate === true;
    if ($('pb-rep-interlude')) $('pb-rep-interlude').checked = item.interlude === true;
    if ($('pb-rep-vocalRestSupport')) $('pb-rep-vocalRestSupport').checked = item.vocalRestSupport === true;
    if ($('pb-rep-goodBetweenBlocks')) $('pb-rep-goodBetweenBlocks').checked = item.goodBetweenBlocks === true;
    if ($('pb-rep-goodBeforeClimax')) $('pb-rep-goodBeforeClimax').checked = item.goodBeforeClimax === true;
    if ($('pb-rep-notes')) $('pb-rep-notes').value = safeString(item.notes);
    if ($('pb-rep-publicNotes')) $('pb-rep-publicNotes').value = safeString(item.publicNotes);
    if ($('pb-rep-sortOrder')) $('pb-rep-sortOrder').value = Number.isFinite(Number(item.sortOrder)) ? String(item.sortOrder) : '';
  }
  function persistPlannerRepEditor() {
    if (state.plannerIndex < 0) return;
    var item = state.plannerDoc.items[state.plannerIndex] || {};
    item.id = safeString($('pb-rep-id').value).trim();
    item.title = safeString($('pb-rep-title').value).trim();
    item.composer = safeString($('pb-rep-composer').value).trim();
    item.work = safeString($('pb-rep-work').value).trim();
    item.type = safeString($('pb-rep-type').value || 'other').trim().toLowerCase();
    item.language = safeString($('pb-rep-language').value).trim();
    item.durationMin = Math.max(0, Number($('pb-rep-durationMin').value) || 0);
    item.approximateDurationMin = Math.max(0, Number($('pb-rep-approximateDurationMin').value) || item.durationMin || 0);
    item.readiness = safeString($('pb-rep-readiness').value || 'idea').trim().toLowerCase();
    item.availabilityStatus = safeString($('pb-rep-availabilityStatus').value || item.readiness || 'idea').trim().toLowerCase();
    item.performanceStatus = safeString($('pb-rep-performanceStatus').value || '').trim().toLowerCase();
    item.reviewStatus = safeString($('pb-rep-reviewStatus').value || 'clean').trim().toLowerCase() === 'manual_review' ? 'manual_review' : 'clean';
    item.category = safeString($('pb-rep-category').value).trim().toLowerCase();
    item.voiceCategory = safeString($('pb-rep-voiceCategory').value).trim().toLowerCase();
    item.primaryVoice = safeString($('pb-rep-primaryVoice').value).trim().toLowerCase();
    item.pairedVoices = safeString($('pb-rep-pairedVoices').value).split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    item.includesTenor = !!($('pb-rep-includesTenor') && $('pb-rep-includesTenor').checked);
    item.formations = safeString($('pb-rep-formations').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    item.tags = safeString($('pb-rep-tags').value).split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    item.fitTags = safeString($('pb-rep-fitTags').value).split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    item.performedIn = safeString($('pb-rep-performedIn').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    item.offerOnly = !!($('pb-rep-offerOnly') && $('pb-rep-offerOnly').checked);
    item.excludeFromOffers = !!($('pb-rep-excludeFromOffers') && $('pb-rep-excludeFromOffers').checked);
    item.sourceGroup = safeString($('pb-rep-sourceGroup').value).trim();
    item.suggestionGroup = safeString($('pb-rep-suggestionGroup').value).trim();
    item.dramaticRole = safeString($('pb-rep-dramaticRole').value).trim().toLowerCase();
    item.energyLevel = safeString($('pb-rep-energyLevel').value).trim().toLowerCase();
    item.tempoProfile = safeString($('pb-rep-tempoProfile').value).trim().toLowerCase();
    item.impactLevel = safeString($('pb-rep-impactLevel').value).trim().toLowerCase();
    item.audienceAppeal = safeString($('pb-rep-audienceAppeal').value).trim().toLowerCase();
    item.galaRole = safeString($('pb-rep-galaRole').value).trim().toLowerCase();
    item.vocalLoad = safeString($('pb-rep-vocalLoad').value).trim().toLowerCase();
    item.texture = safeString($('pb-rep-texture').value).trim().toLowerCase();
    item.styleBucket = safeString($('pb-rep-styleBucket').value).trim().toLowerCase();
    item.recoveryValue = safeString($('pb-rep-recoveryValue').value).trim().toLowerCase();
    item.bestDurationFit = safeString($('pb-rep-bestDurationFit').value || 'all').trim().toLowerCase();
    item.moodTags = safeString($('pb-rep-moodTags').value).split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    item.practicalTags = safeString($('pb-rep-practicalTags').value).split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
    item.encoreCandidate = !!($('pb-rep-encoreCandidate') && $('pb-rep-encoreCandidate').checked);
    item.interlude = !!($('pb-rep-interlude') && $('pb-rep-interlude').checked);
    item.vocalRestSupport = !!($('pb-rep-vocalRestSupport') && $('pb-rep-vocalRestSupport').checked);
    item.goodBetweenBlocks = !!($('pb-rep-goodBetweenBlocks') && $('pb-rep-goodBetweenBlocks').checked);
    item.goodBeforeClimax = !!($('pb-rep-goodBeforeClimax') && $('pb-rep-goodBeforeClimax').checked);
    item.notes = safeString($('pb-rep-notes').value);
    item.publicNotes = safeString($('pb-rep-publicNotes').value);
    item.sortOrder = Number($('pb-rep-sortOrder').value) || ((state.plannerIndex + 1) * 10);
    state.plannerDoc.items[state.plannerIndex] = normalizePlannerItemRecord(item, state.plannerIndex);
    renderPlannerRepList();
    renderBlueprintBuilder();
    markDirty(true, 'Repertoire library updated');
  }
  function pieceMatchesFamily(piece, family) {
    return plannerOfferFamilyFitTier(piece, currentBlueprint(), family) > 0;
  }
  function normalizeFormationLabel(raw) {
    return safeString(raw)
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/\s*\+\s*/g, ' + ')
      .trim();
  }
  function plannerFormationProfile(formation) {
    var label = normalizeFormationLabel(formation);
    return {
      label: label,
      voices: plannerVoicesFromFormationLabel(label),
      singerCount: plannerVoicesFromFormationLabel(label).length,
      hasPiano: label.indexOf('piano') >= 0
    };
  }
  function plannerPieceRequiredVoices(piece) {
    if (!piece) return [];
    var voices = plannerVoicesFromItem(piece);
    if (voices.length) return voices;
    var category = safeString(piece.category).trim().toLowerCase();
    if (piece.includesTenor === true && ['aria', 'art_song', 'tango'].indexOf(category) >= 0) return ['tenor'];
    return [];
  }
  function plannerPieceEditorialRole(piece) {
    if (!piece) return '';
    var flags = plannerPieceFlags(piece);
    var dramaticRole = safeString(piece.dramaticRole).trim().toLowerCase();
    if (flags.isPianoSolo) return 'piano_support';
    if (dramaticRole === 'opener' || flags.galaRole === 'opener') return 'opener';
    if (dramaticRole === 'finale' || flags.galaRole === 'finale') return 'finale';
    if (dramaticRole === 'climax' || flags.galaRole === 'climax') return 'climax';
    if (dramaticRole === 'encore' || flags.galaRole === 'encore') return 'encore';
    if (dramaticRole === 'contrast' || flags.galaRole === 'contrast' || flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone') return 'contrast';
    if (dramaticRole === 'lyrical_center' || flags.galaRole === 'lyrical_center' || flags.energyLevel === 'low' || flags.tempoProfile === 'slow') return 'lyrical_center';
    if (flags.recoveryValue === 'partial' || flags.recoveryValue === 'strong' || flags.galaRole === 'vocal_rest_support') return 'support';
    if (flags.impactLevel === 'high' || flags.audienceAppeal === 'crowd_pleaser') return 'climax';
    return 'general';
  }
  function plannerPieceStyleFamilies(piece) {
    if (!piece) return [];
    var values = [];
    var composer = safeString(piece.composer).trim().toLowerCase();
    var work = safeString(piece.work).trim().toLowerCase();
    var title = safeString(piece.title).trim().toLowerCase();
    var tags = []
      .concat(Array.isArray(piece.tags) ? piece.tags : [])
      .concat(Array.isArray(piece.fitTags) ? piece.fitTags : [])
      .concat(Array.isArray(piece.moodTags) ? piece.moodTags : [])
      .map(function (x) { return safeString(x).trim().toLowerCase(); })
      .filter(Boolean);
    function add(key) {
      key = normalizeProgramOfferStyleFocus(key);
      if (key !== 'mixed' && values.indexOf(key) < 0) values.push(key);
    }
    if (tags.some(function (tag) { return /(baroque|handel|händel|vivaldi|purcell|monteverdi|scarlatti)/.test(tag); })) add('baroque');
    if (tags.some(function (tag) { return /(classical|mozart|haydn|gluck|salieri|cimarosa|paisiello)/.test(tag); })) add('classical');
    if (tags.some(function (tag) { return /(belcanto|rossini|donizetti|bellini)/.test(tag); })) add('belcanto');
    if (tags.some(function (tag) { return /(romantic|verdi|gounod|massenet|bizet|offenbach|thomas|schubert|schumann|tchaikovsky|saint-saens|saint-saëns|tosti)/.test(tag); })) add('romantic');
    if (tags.some(function (tag) { return /(verismo|puccini|mascagni|leoncavallo|giordano|cilea|cilèa|catalani)/.test(tag); })) add('verismo');
    if (/(handel|händel|vivaldi|purcell|monteverdi|scarlatti)/.test(composer)) add('baroque');
    if (/(mozart|haydn|gluck|salieri|cimarosa|paisiello)/.test(composer)) add('classical');
    if (/(rossini|donizetti|bellini)/.test(composer)) add('belcanto');
    if (/(puccini|mascagni|leoncavallo|giordano|cilea|cilèa|catalani)/.test(composer)) add('verismo');
    if (/(verdi|gounod|massenet|bizet|offenbach|thomas|schubert|schumann|tchaikovsky|saint-saens|saint-saëns|tosti)/.test(composer)) add('romantic');
    if (!values.length && /(baroque|classical|belcanto|romantic|verismo)/.test(work + ' ' + title)) {
      if (/baroque/.test(work + ' ' + title)) add('baroque');
      if (/classical/.test(work + ' ' + title)) add('classical');
      if (/belcanto/.test(work + ' ' + title)) add('belcanto');
      if (/romantic/.test(work + ' ' + title)) add('romantic');
      if (/verismo/.test(work + ' ' + title)) add('verismo');
    }
    return values;
  }
  function plannerStyleFocusAdjacency(style) {
    return ({
      baroque: ['classical'],
      classical: ['baroque','belcanto'],
      belcanto: ['classical','romantic'],
      romantic: ['belcanto','verismo'],
      verismo: ['romantic']
    })[normalizeProgramOfferStyleFocus(style)] || [];
  }
  function plannerPieceStyleFocusTier(piece, styleFocus) {
    var focus = normalizeProgramOfferStyleFocus(styleFocus);
    if (focus === 'mixed') return 0;
    var styles = plannerPieceStyleFamilies(piece);
    if (!styles.length) return 0;
    if (styles.indexOf(focus) >= 0) return 2;
    var adjacent = plannerStyleFocusAdjacency(focus);
    if (styles.some(function (style) { return adjacent.indexOf(style) >= 0; })) return 1;
    return -1;
  }
  function plannerDraftTargetPieceCount(bp) {
    var target = Math.max(0, Number(bp && bp.targetDuration) || 30);
    if (target <= 30) return 4;
    if (target <= 45) return 6;
    return 7;
  }
  function plannerStyleFocusPoolSummary(bp, pool) {
    var focus = normalizeProgramOfferStyleFocus(bp && bp.styleFocus);
    var summary = { focus: focus, direct: [], adjacent: [], unknown: [], mismatched: [] };
    (Array.isArray(pool) ? pool : []).forEach(function (piece) {
      var tier = plannerPieceStyleFocusTier(piece, focus);
      if (tier >= 2) summary.direct.push(piece);
      else if (tier === 1) summary.adjacent.push(piece);
      else if (tier === 0) summary.unknown.push(piece);
      else summary.mismatched.push(piece);
    });
    return summary;
  }
  function plannerCandidatePoolForStyleFocus(bp, pool) {
    var focus = normalizeProgramOfferStyleFocus(bp && bp.styleFocus);
    var candidates = Array.isArray(pool) ? pool.slice() : [];
    if (focus === 'mixed' || !candidates.length) return candidates;
    var summary = plannerStyleFocusPoolSummary(bp, candidates);
    var targetCount = plannerDraftTargetPieceCount(bp);
    if (summary.direct.length >= Math.max(3, Math.min(targetCount, 5))) return summary.direct.slice();
    if ((summary.direct.length + summary.adjacent.length) >= Math.max(4, targetCount - 1)) return summary.direct.concat(summary.adjacent);
    if (summary.direct.length >= 2) return summary.direct.concat(summary.adjacent).concat(summary.unknown);
    return candidates;
  }
  function plannerPieceStrictFormationMatch(piece, formation, opts) {
    if (!piece) return false;
    opts = opts || {};
    var profile = plannerFormationProfile(formation);
    if (!profile.label) return true;
    var category = safeString(piece.category).trim().toLowerCase();
    var requiredVoices = plannerPieceRequiredVoices(piece);
    var forms = Array.isArray(piece && piece.formations) ? piece.formations.map(normalizeFormationLabel).filter(Boolean) : [];
    var isPianoSolo = category === 'piano_solo';
    var multiVoice = /^(duet|trio|quartet|ensemble)$/.test(category) || requiredVoices.length > 1;
    if (isPianoSolo) return !!opts.allowPianoSolo && profile.hasPiano;
    if (requiredVoices.length) {
      if (!requiredVoices.every(function (voice) { return profile.voices.indexOf(voice) >= 0; })) return false;
      if (multiVoice && profile.singerCount && requiredVoices.length > profile.singerCount) return false;
    } else if (multiVoice) {
      return false;
    }
    if (!forms.length) {
      return requiredVoices.length ? true : !multiVoice;
    }
    return forms.some(function (form) {
      if (form === profile.label) return true;
      if ((form === 'voice + piano' || form === 'voice(s) + piano') && profile.hasPiano) {
        if (!requiredVoices.length) return !multiVoice;
        return requiredVoices.length === 1 && requiredVoices.every(function (voice) { return profile.voices.indexOf(voice) >= 0; });
      }
      var formProfile = plannerFormationProfile(form);
      if (formProfile.hasPiano && !profile.hasPiano) return false;
      if (formProfile.voices.length && !formProfile.voices.every(function (voice) { return profile.voices.indexOf(voice) >= 0; })) return false;
      if (multiVoice && formProfile.singerCount && profile.singerCount && formProfile.singerCount > profile.singerCount) return false;
      if (requiredVoices.length === 1 && formProfile.voices.length === 1) {
        return formProfile.voices[0] === requiredVoices[0];
      }
      if (requiredVoices.length > 1 && formProfile.voices.length) {
        return requiredVoices.every(function (voice) { return formProfile.voices.indexOf(voice) >= 0; });
      }
      return !!formProfile.label && (formProfile.voices.length > 0 || formProfile.hasPiano);
    });
  }
  function pieceMatchesFormation(piece, formation) {
    return plannerPieceStrictFormationMatch(piece, formation, { allowPianoSolo: plannerFormationProfile(formation).hasPiano });
  }
  function plannerReadinessRank(value) {
    var key = safeString(value).trim().toLowerCase();
    if (key === 'ready') return 0;
    if (key === 'working') return 1;
    if (key === 'idea') return 2;
    return 3;
  }
  function plannerAvailabilityRank(value) {
    var key = safeString(value).trim().toLowerCase();
    if (key === 'performed') return 0;
    if (key === 'ready') return 1;
    if (key === 'working') return 2;
    if (key === 'idea') return 3;
    if (key === 'outside_repertoire') return 4;
    return 5;
  }
  function plannerPieceFitSummary(piece, family, formation) {
    if (!piece) return { className: 'muted', text: 'Missing repertoire item.' };
    if (safeString(piece.reviewStatus) === 'manual_review') return { className: 'warn', text: 'Historical item flagged for manual review before public reuse.' };
    if (!pieceMatchesFormation(piece, formation)) return { className: 'warn', text: 'This piece does not match the current formation.' };
    var tier = plannerOfferFamilyFitTier(piece, currentBlueprint(), family);
    var flags = plannerPieceFlags(piece);
    if (flags.isPianoSolo && tier >= 2) return { className: 'ok', text: 'Useful supporting piano interlude for pacing, contrast, or vocal rest in this programme family.' };
    if (tier >= 3) return { className: 'ok', text: 'Strong match for this programme family.' };
    if (tier >= 2) return { className: 'ok', text: 'Good stylistic match for this programme family.' };
    if (tier >= 1) return { className: 'muted', text: 'Usable in this family, though not one of the strongest defaults.' };
    return { className: 'muted', text: 'Usable, but not one of the strongest tagged matches for this family.' };
  }
  function plannerStyleFocusScore(piece, bp, opts) {
    var focus = normalizeProgramOfferStyleFocus(bp && bp.styleFocus);
    if (!piece || focus === 'mixed') return 0;
    var tier = plannerPieceStyleFocusTier(piece, focus);
    var summary = plannerStyleFocusPoolSummary(bp, plannerDraftEligibleItems(bp));
    var directStrong = summary.direct.length >= Math.max(3, Math.min(plannerDraftTargetPieceCount(bp), 5));
    var tierScore = tier >= 2 ? (directStrong ? 42 : 28) : (tier === 1 ? 12 : (tier === -1 ? (directStrong ? -24 : -12) : 0));
    if (opts && opts.desiredRole && (opts.desiredRole === 'contrast' || opts.desiredRole === 'support')) tierScore = Math.round(tierScore * 0.7);
    return tierScore;
  }
  function plannerAssignedArcPieces(bp, excludeSlotId) {
    return ((bp && bp.items) || []).map(function (it) {
      if (excludeSlotId && safeString(it && it.slotId).trim().toLowerCase() === safeString(excludeSlotId).trim().toLowerCase()) return null;
      return getPlannerItemById(it && it.pieceId);
    }).filter(Boolean);
  }
  function plannerArcContrastBonus(piece, bp, slotId) {
    var assigned = plannerAssignedArcPieces(bp, slotId);
    if (!assigned.length) return 0;
    var score = 0;
    var currentLang = safeString(piece && piece.language).trim().toUpperCase();
    var langs = {};
    var categories = {};
    assigned.forEach(function (row) {
      var lang = safeString(row && row.language).trim().toUpperCase();
      var category = safeString(row && row.category).trim().toLowerCase();
      if (lang) langs[lang] = true;
      if (category) categories[category] = true;
    });
    if (currentLang && !langs[currentLang]) score += 4;
    if (piece && piece.category && !categories[safeString(piece.category).trim().toLowerCase()]) score += 2;
    return score;
  }
  function plannerGalaArcSlotBonus(piece, slotId, bp) {
    if (!piece || !bp || safeString(bp.family).trim().toLowerCase() !== 'gala') return 0;
    var flags = plannerPieceFlags(piece);
    var options = galaOptionsForBlueprint(bp);
    var score = 0;
    switch (safeString(slotId).trim().toLowerCase()) {
      case 'opening':
        if (flags.galaRole === 'opener') score += 16;
        if (flags.texture === 'solo') score += 6;
        if (flags.audienceAppeal === 'crowd_pleaser' || flags.audienceAppeal === 'balanced') score += 3;
        break;
      case 'early_contrast':
      case 'contrast':
        if (flags.galaRole === 'contrast') score += 16;
        if (flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone') score += options.includeContrast ? 10 : -8;
        if (flags.texture !== 'solo' || flags.galaRole === 'vocal_rest_support') score += 6;
        break;
      case 'development':
      case 'first_development':
        if (flags.vocalLoad === 'medium') score += 6;
        if (flags.recoveryValue === 'partial') score += 5;
        break;
      case 'lyrical_center':
        if (flags.galaRole === 'lyrical_center') score += 14;
        if (flags.vocalLoad === 'light' || flags.vocalLoad === 'medium') score += 5;
        break;
      case 'build_up':
        if (flags.galaRole === 'contrast') score += 4;
        if (flags.goodBeforeClimax) score += 10;
        if (flags.recoveryValue === 'partial') score += 4;
        break;
      case 'climax':
        if (flags.galaRole === 'climax') score += 18;
        if (flags.vocalLoad === 'heavy') score += 6;
        if (flags.texture === 'solo') score += 3;
        break;
      case 'resolution':
      case 'finale':
        if (flags.galaRole === 'finale') score += 18;
        if (flags.audienceAppeal === 'crowd_pleaser') score += 5;
        if (flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone') score += options.includeContrast ? 4 : -4;
        break;
      default:
        break;
    }
    return score;
  }
  function plannerArcSlotScore(piece, slotId, bp) {
    if (!piece) return -999;
    var role = safeString(piece.dramaticRole).trim().toLowerCase();
    var energy = safeString(piece.energyLevel).trim().toLowerCase();
    var tempo = safeString(piece.tempoProfile).trim().toLowerCase();
    var impact = safeString(piece.impactLevel).trim().toLowerCase();
    var audience = safeString(piece.audienceAppeal).trim().toLowerCase();
    var flags = plannerPieceFlags(piece);
    var score = 0;
    switch (safeString(slotId).trim().toLowerCase()) {
      case 'opening':
        if (role === 'opener') score += 30;
        if (energy === 'high') score += 8;
        else if (energy === 'medium') score += 5;
        if (impact === 'high') score += 5;
        else if (impact === 'medium') score += 3;
        if (audience === 'balanced' || audience === 'crowd_pleaser') score += 2;
        break;
      case 'early_contrast':
      case 'contrast':
        if (role === 'contrast') score += 30;
        score += plannerArcContrastBonus(piece, bp, slotId);
        if (energy === 'medium') score += 3;
        if (tempo === 'flowing' || tempo === 'lively') score += 2;
        if (flags.isPianoSolo && (flags.isInterludeSupport || flags.goodBetweenBlocks)) score += 12;
        break;
      case 'development':
      case 'first_development':
        if (role === 'development') score += 28;
        if (energy === 'medium') score += 5;
        if (tempo === 'flowing' || tempo === 'moderate') score += 4;
        if (flags.isPianoSolo && flags.supportsVocalRest) score += 12;
        if (flags.isPianoSolo && flags.goodBetweenBlocks) score += 6;
        break;
      case 'lyrical_center':
        if (role === 'lyrical_center') score += 30;
        if (energy === 'low' || energy === 'medium') score += 6;
        if (tempo === 'slow' || tempo === 'flowing') score += 5;
        if (impact === 'light' || impact === 'medium') score += 3;
        if (flags.isPianoSolo && flags.supportsVocalRest) score += 7;
        break;
      case 'build_up':
        if (role === 'development') score += 16;
        if (role === 'climax') score += 8;
        if (energy === 'medium' || energy === 'high') score += 5;
        if (tempo === 'flowing' || tempo === 'lively' || tempo === 'brilliant') score += 4;
        if (flags.isPianoSolo && flags.goodBeforeClimax) score += 14;
        else if (flags.isPianoSolo && flags.goodBetweenBlocks) score += 8;
        break;
      case 'climax':
        if (role === 'climax') score += 30;
        if (impact === 'high') score += 8;
        if (energy === 'high') score += 7;
        if (audience === 'crowd_pleaser') score += 3;
        break;
      case 'resolution':
      case 'finale':
        if (role === 'finale') score += 30;
        if (role === 'climax') score += 14;
        if (impact === 'high') score += 6;
        if (energy === 'medium' || energy === 'high') score += 4;
        if (audience === 'crowd_pleaser' || audience === 'balanced') score += 3;
        break;
      case 'encore_1':
      case 'encore_2':
      case 'encore_optional':
        if (piece.encoreCandidate === true) score += 30;
        if (role === 'encore') score += 28;
        if (audience === 'crowd_pleaser') score += 5;
        if (impact === 'medium' || impact === 'high') score += 2;
        break;
      default:
        break;
    }
    score += plannerGalaArcSlotBonus(piece, slotId, bp);
    return score;
  }
  function plannerOfferFilteredItems(slotId) {
    var items = (state.plannerDoc && Array.isArray(state.plannerDoc.items)) ? state.plannerDoc.items : [];
    var needle = safeString($('pb-add-piece-search') && $('pb-add-piece-search').value).trim().toLowerCase();
    var filterStatus = safeString(state.plannerOfferStatusFilter || 'all').trim().toLowerCase() || 'all';
    var filterCategory = safeString(state.plannerOfferCategoryFilter || 'all').trim().toLowerCase() || 'all';
    var filterTag = safeString(state.plannerOfferTagFilter || '').trim().toLowerCase();
    var filterLang = safeString(state.plannerOfferLangFilter || '').trim().toLowerCase();
    var matchingOnly = state.plannerOfferMatchingOnly !== false;
    var formationOnly = !!state.plannerOfferFormationOnly;
    var showWithoutTenor = !!state.plannerOfferShowWithoutTenor;
    var bp = currentBlueprint();
    var currentFormation = safeString(($('pb-blueprint-formation') && $('pb-blueprint-formation').value) || (bp && bp.formation)).trim();
    var currentFamily = safeString((bp && bp.family) || state.blueprintFamily || 'gala').trim().toLowerCase() || 'gala';
    var filtered = items.filter(function (item) {
      var availability = safeString(item.availabilityStatus || '').trim().toLowerCase();
      var effectiveTags = (item.fitTags && item.fitTags.length ? item.fitTags : item.tags) || [];
      var familyTier = plannerOfferFamilyFitTier(item, bp, currentFamily);
      var strictFormationMatch = plannerPieceFormationEligibleForOffer(item, bp);
      if (availability === 'outside_repertoire') return false;
      if (item.excludeFromOffers === true && safeString(item.category) !== 'piano_solo') return false;
      if (item.offerOnly === true) return false;
      if (filterCategory === 'all' && safeString(item.type) === 'role') return false;
      if (!strictFormationMatch) return false;
      if (!showWithoutTenor && !plannerOfferVoiceMatch(item, currentFormation, showWithoutTenor) && safeString(item.category).trim().toLowerCase() !== 'piano_solo') return false;
      if (matchingOnly && familyTier <= 0) return false;
      if (filterStatus === 'performed' && availability !== 'performed' && safeString(item.performanceStatus) !== 'performed') return false;
      if (filterStatus !== 'all' && filterStatus !== 'performed' && availability !== filterStatus && safeString(item.readiness) !== filterStatus) return false;
      if (filterCategory !== 'all' && !plannerCategoryFilterMatches(item, filterCategory)) return false;
      if (filterLang && safeString(item.language).trim().toLowerCase().indexOf(filterLang) < 0) return false;
      if (filterTag && effectiveTags.join(' ').toLowerCase().indexOf(filterTag) < 0) return false;
      if (formationOnly && !strictFormationMatch) return false;
      if (!needle) return true;
      return [item.title, item.composer, item.work, plannerItemVoiceLabel(item), safeString(item.category), safeString(item.sourceGroup), effectiveTags.join(' '), item.notes, item.publicNotes].join(' ').toLowerCase().indexOf(needle) >= 0;
    });
    filtered.sort(function (a, b) {
      var famA = plannerFamilySelectorPriority(a, currentFamily, currentFormation, bp);
      var famB = plannerFamilySelectorPriority(b, currentFamily, currentFormation, bp);
      if (famA !== famB) return famB - famA;
      if (slotId) {
        var slotA = plannerArcSlotScore(a, slotId, bp);
        var slotB = plannerArcSlotScore(b, slotId, bp);
        if (slotA !== slotB) return slotB - slotA;
      }
      var formA = plannerPieceFormationEligibleForOffer(a, bp) ? 1 : 0;
      var formB = plannerPieceFormationEligibleForOffer(b, bp) ? 1 : 0;
      if (formA !== formB) return formB - formA;
      if (currentFamily === 'borders') {
        var varietyA = plannerBordersVarietyScore(a, bp);
        var varietyB = plannerBordersVarietyScore(b, bp);
        if (varietyA !== varietyB) return varietyB - varietyA;
      }
      var availA = plannerAvailabilityRank(a.availabilityStatus || a.performanceStatus || a.readiness);
      var availB = plannerAvailabilityRank(b.availabilityStatus || b.performanceStatus || b.readiness);
      if (availA !== availB) return availA - availB;
      var reviewA = safeString(a.reviewStatus) === 'manual_review' ? 1 : 0;
      var reviewB = safeString(b.reviewStatus) === 'manual_review' ? 1 : 0;
      if (reviewA !== reviewB) return reviewA - reviewB;
      var readyA = plannerReadinessRank(a.readiness);
      var readyB = plannerReadinessRank(b.readiness);
      if (readyA !== readyB) return readyA - readyB;
      var voiceA = plannerItemVoiceLabel(a);
      var voiceB = plannerItemVoiceLabel(b);
      if (voiceA !== voiceB) return safeString(voiceA).localeCompare(safeString(voiceB));
      return safeString(a.title).localeCompare(safeString(b.title));
    });
    return filtered;
  }
  function renderBlueprintPieceOptions() {
    var select = $('pb-add-piece-select');
    var count = $('pb-available-count');
    if (!select) return;
    var filtered = plannerOfferFilteredItems();
    if (count) {
      var family = safeString((currentBlueprint() && currentBlueprint().family) || state.blueprintFamily || 'gala').trim().toLowerCase() || 'gala';
      var familyLabel = ({ gala: 'Gala', italian: 'Italian', tango: 'Tango', borders: 'Borders' })[family] || 'programme';
      count.textContent = filtered.length + (state.plannerOfferMatchingOnly !== false ? (' matching ' + familyLabel.toLowerCase() + ' pieces') : ' pieces in view');
    }
    if (!filtered.length) {
      select.innerHTML = '<option value="">' + (state.plannerOfferMatchingOnly !== false ? 'No matching repertoire item for this programme family — relax the filters or switch to Show all repertoire' : 'No repertoire item matches the current filters') + '</option>';
      return;
    }
    select.innerHTML = filtered.map(function (item) {
      var labels = [item.title, item.composer, plannerItemVoiceLabel(item), String(plannerEffectiveDuration(item) || 0) + ' min'];
      if (item.dramaticRole) labels.push(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[item.dramaticRole] || item.dramaticRole);
      if (item.interlude === true) labels.push('interlude');
      if (item.vocalRestSupport === true) labels.push('rest');
      if (plannerOfferFamilyFitTier(item, currentBlueprint(), safeString((currentBlueprint() && currentBlueprint().family) || state.blueprintFamily || 'gala').trim().toLowerCase()) >= 3) labels.push('fit');
      if (safeString(item.performanceStatus) === 'performed') labels.push('performed');
      if (safeString(item.reviewStatus) === 'manual_review') labels.push('review');
      return '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(labels.filter(Boolean).join(' · ')) + '</option>';
    }).join('');
  }
  function renderConcertHistoryList() {
    var box = $('pb-history-list');
    var count = $('pb-history-count');
    if (!box) return;
    var search = safeString(state.concertHistorySearch).trim().toLowerCase();
    var concerts = (state.concertHistoryDoc && Array.isArray(state.concertHistoryDoc.concerts)) ? state.concertHistoryDoc.concerts : [];
    var listed = concerts.map(function (_, idx) { return idx; }).filter(function (idx) {
      if (!search) return true;
      var concert = concerts[idx];
      return [
        concert.year,
        concert.title,
        concert.format,
        (concert.collaborators || []).join(' '),
        (concert.programmeItems || []).join(' '),
        concert.notes
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
    if (count) count.textContent = listed.length + ' concerts';
    if (!listed.length) {
      box.innerHTML = '<div class="empty-state">No archived concerts match the current search. Try year, title, collaborator, or a programme item.</div>';
      state.concertHistoryIndex = -1;
      renderConcertHistoryEditor();
      return;
    }
    box.innerHTML = listed.map(function (idx) {
      var concert = concerts[idx];
      var active = idx === state.concertHistoryIndex ? 'item active' : 'item';
      return '<div class="' + active + '" data-pb-history-idx="' + idx + '"><div class="item-main"><strong>' + escapeHtml(String(concert.year || '—') + ' · ' + (concert.title || '(untitled)')) + '</strong><br><span class="muted">' + escapeHtml(concert.format || '') + '</span><div class="item-badges"><span class="item-badge">' + escapeHtml(String((concert.programmeItems || []).length) + ' items') + '</span><span class="item-badge">' + escapeHtml(concert.sourceType || 'history') + '</span></div></div></div>';
    }).join('');
    box.querySelectorAll('[data-pb-history-idx]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.concertHistoryIndex = Number(el.getAttribute('data-pb-history-idx'));
        renderConcertHistoryList();
        renderConcertHistoryEditor();
      });
    });
    if (state.concertHistoryIndex < 0 || listed.indexOf(state.concertHistoryIndex) < 0) {
      state.concertHistoryIndex = listed[0];
      renderConcertHistoryList();
      renderConcertHistoryEditor();
      return;
    }
    renderConcertHistoryEditor();
  }
  function renderConcertHistoryEditor() {
    var concert = (state.concertHistoryDoc && state.concertHistoryDoc.concerts && state.concertHistoryDoc.concerts[state.concertHistoryIndex]) || {};
    if ($('pb-history-year')) $('pb-history-year').value = Number(concert.year) || '';
    if ($('pb-history-title')) $('pb-history-title').value = safeString(concert.title);
    if ($('pb-history-format')) $('pb-history-format').value = safeString(concert.format);
    if ($('pb-history-sourceType')) $('pb-history-sourceType').value = safeString(concert.sourceType);
    if ($('pb-history-collaborators')) $('pb-history-collaborators').value = Array.isArray(concert.collaborators) ? concert.collaborators.join('\n') : '';
    if ($('pb-history-programmeItems')) $('pb-history-programmeItems').value = Array.isArray(concert.programmeItems) ? concert.programmeItems.join('\n') : '';
    if ($('pb-history-notes')) $('pb-history-notes').value = safeString(concert.notes);
  }
  function persistConcertHistoryEditor() {
    if (state.concertHistoryIndex < 0) return;
    var concert = state.concertHistoryDoc.concerts[state.concertHistoryIndex] || {};
    concert.year = Math.max(0, Number($('pb-history-year').value) || 0);
    concert.title = safeString($('pb-history-title').value).trim();
    concert.format = safeString($('pb-history-format').value).trim();
    concert.sourceType = safeString($('pb-history-sourceType').value || 'historical_manual_import').trim() || 'historical_manual_import';
    concert.collaborators = safeString($('pb-history-collaborators').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    concert.programmeItems = safeString($('pb-history-programmeItems').value).split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    concert.notes = safeString($('pb-history-notes').value);
    state.concertHistoryDoc.concerts[state.concertHistoryIndex] = concert;
    renderConcertHistoryList();
    markDirty(true, 'Concert history updated');
  }
  function renderBlueprintPieces() {
    var list = $('pb-blueprint-list');
    if (!list) return;
    var bp = currentBlueprint();
    recomputeBlueprint(bp);
    syncProgramBuilderSelectionUi(bp);
    if ($('pb-selected-count')) $('pb-selected-count').textContent = bp.items.length + (bp.items.length === 1 ? ' piece selected' : ' pieces selected');
    if (!bp.items.length) {
      list.innerHTML = '<div class="empty-state">No repertoire selected yet. Add the pieces you want to include in this concrete programme offer.</div>';
      state.blueprintPieceIndex = -1;
      if (isProgramBuilderCompactViewport() && $('pb-piece-editor-panel')) setProgramBuilderDisclosureOpen($('pb-piece-editor-panel'), false);
      renderBlueprintPieceEditor();
      return;
    }
    list.innerHTML = bp.items.map(function (it, idx) {
      var piece = getPlannerItemById(it.pieceId);
      var title = safeString(it.customTitle).trim() || safeString(piece && piece.title);
      var duration = Math.max(0, Number(it.customDuration) || (piece ? plannerEffectiveDuration(piece) || 0 : 0));
      var active = idx === state.blueprintPieceIndex ? 'item active' : 'item';
      var compat = pieceMatchesFamily(piece, bp.family);
      var formationMatch = pieceMatchesFormation(piece, bp.formation);
      var badges = ['<span class="item-badge">' + escapeHtml(String(duration) + ' min') + '</span>'];
      if (bp.buildMode === 'dramatic_arc' && safeString(it.slotId).trim()) badges.push('<span class="item-badge">' + escapeHtml(dramaticArcSlotLabel(it.slotId, bp.targetDuration) || it.slotId) + '</span>');
      if (piece) badges.push('<span class="item-badge">' + escapeHtml(plannerItemVoiceLabel(piece)) + '</span>');
      if (piece && piece.dramaticRole) badges.push('<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[piece.dramaticRole] || piece.dramaticRole) + '</span>');
      if (piece && piece.discoveryIdea === true) badges.push('<span class="item-badge warn">discovery idea</span>');
      if (safeString(piece && piece.performanceStatus) === 'performed') badges.push('<span class="item-badge ok">performed</span>');
      if (safeString(piece && piece.reviewStatus) === 'manual_review') badges.push('<span class="item-badge warn">review</span>');
      else if (compat && formationMatch) badges.push('<span class="item-badge ok">strong fit</span>');
      else if (!formationMatch) badges.push('<span class="item-badge warn">formation</span>');
      else if (!compat) badges.push('<span class="item-badge">related</span>');
      return '<div class="' + active + '" data-pb-piece-idx="' + idx + '"><div class="pb-item-row"><span class="pb-blueprint-list__order">' + escapeHtml(String(idx + 1)) + '</span><div class="item-main"><strong>' + escapeHtml(title || '(missing piece)') + '</strong><br><span class="muted">' + escapeHtml(piece ? [piece.composer, piece.work].filter(Boolean).join(' · ') : 'Missing repertoire item') + '</span><div class="item-badges">' + badges.join('') + '</div></div></div></div>';
    }).join('');
    list.querySelectorAll('[data-pb-piece-idx]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.blueprintPieceIndex = Number(el.getAttribute('data-pb-piece-idx'));
        renderBlueprintPieces();
        renderBlueprintPieceEditor();
        if (isProgramBuilderCompactViewport()) focusProgramBuilderSelection(true, false);
      });
    });
    if (state.blueprintPieceIndex < 0 || state.blueprintPieceIndex >= bp.items.length) {
      state.blueprintPieceIndex = 0;
      renderBlueprintPieces();
      renderBlueprintPieceEditor();
      return;
    }
    renderBlueprintPieceEditor();
  }
  function plannerEncoreCandidatePool(bp) {
    var selectedIds = {};
    (bp.items || []).forEach(function (it) { selectedIds[safeString(it.pieceId).trim()] = true; });
    var pool = plannerOfferFilteredItems().filter(function (piece) {
      var id = safeString(piece && piece.id).trim();
      return id && !selectedIds[id];
    }).slice();
    pool.sort(function (a, b) {
      var encoreA = a.encoreCandidate === true || safeString(a.dramaticRole).trim().toLowerCase() === 'encore' ? 1 : 0;
      var encoreB = b.encoreCandidate === true || safeString(b.dramaticRole).trim().toLowerCase() === 'encore' ? 1 : 0;
      if (encoreA !== encoreB) return encoreB - encoreA;
      var crowdA = safeString(a.audienceAppeal).trim().toLowerCase() === 'crowd_pleaser' ? 1 : 0;
      var crowdB = safeString(b.audienceAppeal).trim().toLowerCase() === 'crowd_pleaser' ? 1 : 0;
      if (crowdA !== crowdB) return crowdB - crowdA;
      return safeString(a.title).localeCompare(safeString(b.title));
    });
    return pool;
  }
  function renderEncoreOptions() {
    var wrap = $('pb-encore-list');
    var toggle = $('pb-encore-export');
    var addBtn = $('pb-encore-add');
    var panel = $('pb-encore-panel');
    if (!wrap) return;
    var bp = currentBlueprint();
    var lang = safeString(bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
    var copy = plannerOutputCopy(lang);
    if (toggle) toggle.checked = bp.includeEncoresInExport === true;
    if (addBtn) addBtn.disabled = (bp.encoreItems || []).length >= 3;
    if (!(bp.encoreItems || []).length) {
      if (panel) {
        panel.hidden = true;
        panel.open = false;
      }
      wrap.innerHTML = '<div class="pb-encore-item__empty">' + escapeHtml(copy.encoreEmpty) + '<br><button type="button" data-pb-encore-quick-add="-1">Quick add manually</button></div>';
      wrap.querySelectorAll('[data-pb-encore-quick-add]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          openQuickAddManual('encore', { encoreIndex: Number(btn.getAttribute('data-pb-encore-quick-add')) });
        });
      });
      return;
    }
    if (panel) {
      if (panel.hidden) panel.open = true;
      panel.hidden = false;
    }
    var pool = plannerEncoreCandidatePool(bp);
    wrap.innerHTML = (bp.encoreItems || []).map(function (entry, idx) {
      var currentId = safeString(entry.pieceId).trim();
      var currentPiece = currentId ? getPlannerItemById(currentId) : null;
      var currentOption = currentPiece ? '<option value="' + escapeAttr(currentId) + '" selected>' + escapeHtml([currentPiece.title, currentPiece.composer, String(plannerEffectiveDuration(currentPiece) || 0) + ' min'].filter(Boolean).join(' · ')) + '</option>' : '';
      var options = ['<option value="">Choose encore…</option>', currentOption].concat(pool.filter(function (piece) {
        return safeString(piece.id) !== currentId;
      }).map(function (piece) {
        var labels = [piece.title, piece.composer, String(plannerEffectiveDuration(piece) || 0) + ' min'];
        if (piece.encoreCandidate === true) labels.push('encore');
        if (safeString(piece.audienceAppeal) === 'crowd_pleaser') labels.push('crowd');
        return '<option value="' + escapeAttr(piece.id) + '">' + escapeHtml(labels.filter(Boolean).join(' · ')) + '</option>';
      })).join('');
      return '<div class="pb-encore-item" data-pb-encore-idx="' + idx + '">' +
        '<div class="pb-encore-item__head"><span class="pb-encore-item__label">Encore ' + escapeHtml(String(idx + 1)) + '</span></div>' +
        '<div class="pb-encore-item__grid">' +
          '<label>Piece<select data-pb-encore-piece="' + idx + '">' + options + '</select></label>' +
          '<label>' + escapeHtml(copy.encoreNoteLabel) + '<input data-pb-encore-note="' + idx + '" value="' + escapeAttr(safeString(entry.note)) + '" placeholder="Optional"></label>' +
          '<div class="button-row"><button type="button" data-pb-encore-up="' + idx + '"' + (idx === 0 ? ' disabled' : '') + '>Move up</button><button type="button" data-pb-encore-down="' + idx + '"' + (idx === (bp.encoreItems.length - 1) ? ' disabled' : '') + '>Move down</button><button type="button" data-pb-encore-quick-add="' + idx + '">Quick add manually</button><button type="button" class="danger" data-pb-encore-remove="' + idx + '">Remove encore</button></div>' +
        '</div>' +
      '</div>';
    }).join('');
    wrap.querySelectorAll('[data-pb-encore-piece]').forEach(function (el) {
      el.addEventListener('change', function () {
        var i = Number(el.getAttribute('data-pb-encore-piece'));
        var target = bp.encoreItems[i];
        if (!target) return;
        target.pieceId = safeString(el.value).trim();
        recomputeBlueprint(bp);
        renderBlueprintBuilder();
        markDirty(true, 'Encore options updated');
      });
    });
    wrap.querySelectorAll('[data-pb-encore-note]').forEach(function (el) {
      el.addEventListener('input', function () {
        var i = Number(el.getAttribute('data-pb-encore-note'));
        var target = bp.encoreItems[i];
        if (!target) return;
        target.note = safeString(el.value);
        markDirty(true, 'Encore note updated');
      });
    });
    wrap.querySelectorAll('[data-pb-encore-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-pb-encore-remove'));
        bp.encoreItems.splice(i, 1);
        recomputeBlueprint(bp);
        renderBlueprintBuilder();
        markDirty(true, 'Encore removed');
      });
    });
    wrap.querySelectorAll('[data-pb-encore-quick-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openQuickAddManual('encore', { encoreIndex: Number(btn.getAttribute('data-pb-encore-quick-add')) });
      });
    });
    wrap.querySelectorAll('[data-pb-encore-up]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-pb-encore-up'));
        if (i <= 0) return;
        var t = bp.encoreItems[i - 1]; bp.encoreItems[i - 1] = bp.encoreItems[i]; bp.encoreItems[i] = t;
        recomputeBlueprint(bp);
        renderBlueprintBuilder();
        markDirty(true, 'Encore order updated');
      });
    });
    wrap.querySelectorAll('[data-pb-encore-down]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-pb-encore-down'));
        if (i < 0 || i >= bp.encoreItems.length - 1) return;
        var t = bp.encoreItems[i + 1]; bp.encoreItems[i + 1] = bp.encoreItems[i]; bp.encoreItems[i] = t;
        recomputeBlueprint(bp);
        renderBlueprintBuilder();
        markDirty(true, 'Encore order updated');
      });
    });
  }
  function addEncoreOption() {
    var bp = currentBlueprint();
    if ((bp.encoreItems || []).length >= 3) {
      setStatus('You can keep up to three encore options here.', 'warn');
      return;
    }
    bp.encoreItems.push({ pieceId: '', customTitle: '', customDuration: 0, note: '', position: bp.encoreItems.length });
    recomputeBlueprint(bp);
    renderBlueprintBuilder();
    markDirty(true, 'Encore option added');
  }
  function plannerDraftEligibleItems(bp) {
    var items = (state.plannerDoc && Array.isArray(state.plannerDoc.items)) ? state.plannerDoc.items : [];
    var baseItems = items.filter(function (item) {
      var availability = safeString(item && item.availabilityStatus).trim().toLowerCase();
      var category = safeString(item && item.category).trim().toLowerCase();
      var familyTier = plannerOfferFamilyFitTier(item, bp, bp && bp.family);
      if (!item) return false;
      if (availability === 'outside_repertoire') return false;
      if (item.offerOnly === true) return false;
      if (item.excludeFromOffers === true && category !== 'piano_solo') return false;
      if (!plannerPieceFormationEligibleForOffer(item, bp)) return false;
      return familyTier > 0;
    });
    if (!(bp && bp.includeDiscoveryIdeas === true)) return baseItems;
    return baseItems.concat(plannerDiscoveryCandidatesForOffer(bp));
  }
  function plannerDraftReliabilityScore(piece, bp) {
    if (!piece) return 0;
    var availability = safeString(piece.availabilityStatus).trim().toLowerCase();
    var readiness = safeString(piece.readiness).trim().toLowerCase();
    var mode = safeString(bp && bp.repertoireMode || 'suggested').trim().toLowerCase();
    var score = 0;
    if (availability === 'performed') score += 30;
    else if (availability === 'ready') score += 22;
    else if (availability === 'working') score += 8;
    else if (availability === 'idea') score -= 10;
    if (readiness === 'ready') score += 10;
    else if (readiness === 'working') score += 2;
    else if (readiness === 'idea') score -= 6;
    if (mode === 'agreed') score += availability === 'performed' ? 12 : (availability === 'ready' ? 8 : -12);
    else if (mode === 'possible') score += availability === 'idea' ? 6 : 0;
    return score;
  }
  function plannerDraftSlotPlan(bp) {
    var target = Math.max(0, Number(bp && bp.targetDuration) || 30);
    var isGala = safeString(bp && bp.family).trim().toLowerCase() === 'gala';
    if (target <= 30) {
      return [
        { role: 'opener', allowPianoSolo: false },
        { role: isGala ? 'contrast' : 'lyrical_center', allowPianoSolo: false },
        { role: 'lyrical_center', allowPianoSolo: false },
        { role: 'finale', allowPianoSolo: false }
      ];
    }
    if (target <= 45) {
      return [
        { role: 'opener', allowPianoSolo: false },
        { role: 'lyrical_center', allowPianoSolo: false },
        { role: 'contrast', allowPianoSolo: false },
        { role: 'support', allowPianoSolo: isGala },
        { role: 'climax', allowPianoSolo: false },
        { role: 'finale', allowPianoSolo: false }
      ];
    }
    return [
      { role: 'opener', allowPianoSolo: false },
      { role: 'lyrical_center', allowPianoSolo: false },
      { role: 'contrast', allowPianoSolo: false },
      { role: 'support', allowPianoSolo: isGala },
      { role: 'lyrical_center', allowPianoSolo: false },
      { role: 'contrast', allowPianoSolo: false },
      { role: 'climax', allowPianoSolo: false },
      { role: 'finale', allowPianoSolo: false }
    ];
  }
  function plannerDraftSummary(bp) {
    var summary = { breathingPoints: 0, hasContrast: false, heavyTenorRun: 0 };
    var languages = {};
    var textures = {};
    var maxHeavyRun = 0;
    var currentHeavyRun = 0;
    ((bp && bp.items) || []).forEach(function (it) {
      var piece = getPlannerItemById(it && it.pieceId);
      if (!piece) return;
      var flags = plannerPieceFlags(piece);
      if (flags.language) languages[flags.language] = true;
      if (flags.texture) textures[flags.texture] = true;
      if (flags.recoveryValue === 'partial' || flags.recoveryValue === 'strong' || flags.galaRole === 'vocal_rest_support') summary.breathingPoints += 1;
      if (piece.includesTenor === true && flags.texture === 'solo' && flags.vocalLoad === 'heavy') {
        currentHeavyRun += 1;
        maxHeavyRun = Math.max(maxHeavyRun, currentHeavyRun);
      } else {
        currentHeavyRun = 0;
      }
    });
    summary.heavyTenorRun = maxHeavyRun;
    summary.hasContrast = Object.keys(languages).length >= 2 || Object.keys(textures).length >= 2;
    return summary;
  }
  function plannerDraftSequencePenalty(piece, bp) {
    var items = (bp && bp.items) || [];
    if (!items.length || !piece) return 0;
    var prevPiece = getPlannerItemById(items[items.length - 1] && items[items.length - 1].pieceId);
    if (!prevPiece) return 0;
    var prevFlags = plannerPieceFlags(prevPiece);
    var flags = plannerPieceFlags(piece);
    var penalty = 0;
    if (prevPiece.includesTenor === true && piece.includesTenor === true && prevFlags.texture === 'solo' && flags.texture === 'solo' && prevFlags.vocalLoad === 'heavy' && flags.vocalLoad === 'heavy') penalty += 140;
    if (prevFlags.energyLevel === 'high' && flags.energyLevel === 'high') penalty += 14;
    if (prevFlags.texture === flags.texture) penalty += 6;
    if (prevFlags.styleBucket && flags.styleBucket && prevFlags.styleBucket === flags.styleBucket) penalty += 4;
    if (prevFlags.language && flags.language && prevFlags.language === flags.language) penalty += 2;
    if (safeString(prevPiece.composer).trim() && safeString(prevPiece.composer).trim() === safeString(piece.composer).trim()) penalty += 4;
    return penalty;
  }
  function plannerDraftContrastBonus(piece, bp) {
    if (!piece) return 0;
    var flags = plannerPieceFlags(piece);
    var summary = safeString(bp && bp.family).trim().toLowerCase() === 'gala' ? galaProgrammeState(bp) : plannerDraftSummary(bp);
    var bonus = 0;
    if (!summary.hasContrast) {
      if (flags.texture !== 'solo') bonus += 8;
      if (flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone' || flags.isArtSong || flags.isTango) bonus += 8;
      if (flags.language) bonus += 2;
    }
    if ((bp && bp.targetDuration) >= 45 && summary.breathingPoints < galaSupportTarget(bp.targetDuration)) {
      if (flags.recoveryValue === 'partial' || flags.recoveryValue === 'strong' || flags.galaRole === 'vocal_rest_support') bonus += 12;
    }
    return bonus;
  }
  function plannerDraftDurationScore(piece, bp, opts) {
    var duration = Math.max(0, Number(plannerEffectiveDuration(piece)) || 0);
    var total = Math.max(0, Number(bp && bp.totalDuration) || 0);
    var target = Math.max(0, Number(bp && bp.targetDuration) || 0);
    var remaining = Math.max(0, target - total);
    var bands = programsDurationTolerance(target);
    var nextTotal = total + duration;
    var score = Math.max(-28, 22 - (Math.abs(remaining - duration) * 3));
    if (nextTotal > bands.upper) score -= (nextTotal - bands.upper) * 12;
    if (remaining <= 8 && duration > remaining + 3) score -= 14;
    if (opts && opts.slotId && duration > remaining + bands.slightOver) score -= 10;
    return score;
  }
  function plannerDraftEditorialSlotBonus(piece, bp, opts) {
    if (!piece) return 0;
    opts = opts || {};
    var flags = plannerPieceFlags(piece);
    var editorialRole = plannerPieceEditorialRole(piece);
    var desiredRole = safeString(opts.desiredRole).trim().toLowerCase();
    var score = 0;
    if (desiredRole) {
      if (editorialRole === desiredRole) score += 24;
      else if ((desiredRole === 'finale' || desiredRole === 'climax') && (editorialRole === 'climax' || editorialRole === 'finale')) score += 18;
      else if ((desiredRole === 'contrast' || desiredRole === 'lyrical_center') && (editorialRole === 'contrast' || editorialRole === 'lyrical_center')) score += 14;
      else if (desiredRole === 'support' && (editorialRole === 'support' || editorialRole === 'piano_support')) score += 18;
      else if (desiredRole === 'support' && flags.recoveryValue === 'strong') score += 10;
      else if (desiredRole === 'opener' && flags.audienceAppeal === 'balanced') score += 8;
      else score -= 8;
    }
    if (opts.allowPianoSolo === false && flags.isPianoSolo) score -= 40;
    if (opts.allowPianoSolo === true && flags.isPianoSolo) score += 8;
    return score;
  }
  function plannerDraftRoleBonus(piece, bp, opts) {
    if (!piece) return 0;
    var flags = plannerPieceFlags(piece);
    var score = 0;
    var idx = Number(opts && opts.index) || 0;
    var total = Math.max(0, Number(bp && bp.totalDuration) || 0);
    var target = Math.max(0, Number(bp && bp.targetDuration) || 0);
    var nearEnding = total >= Math.max(0, target - 12);
    if (idx === 0) {
      if (safeString(piece.dramaticRole) === 'opener' || flags.galaRole === 'opener') score += 18;
      if (flags.audienceAppeal === 'crowd_pleaser' || flags.audienceAppeal === 'balanced') score += 6;
    }
    if (nearEnding) {
      if (safeString(piece.dramaticRole) === 'finale' || flags.galaRole === 'finale') score += 16;
      if (safeString(piece.dramaticRole) === 'climax' || flags.galaRole === 'climax') score += 12;
      if (flags.impactLevel === 'high') score += 10;
    }
    if (opts && opts.slotId) score += plannerArcSlotScore(piece, opts.slotId, bp);
    score += plannerDraftEditorialSlotBonus(piece, bp, opts);
    return score;
  }
  function plannerSuggestedDraftScore(piece, bp, opts) {
    if (!piece) return -9999;
    var score = plannerFamilySelectorPriority(piece, bp && bp.family, bp && bp.formation, bp);
    score += plannerDraftReliabilityScore(piece, bp);
    score += plannerDraftDurationScore(piece, bp, opts);
    score += plannerDraftContrastBonus(piece, bp);
    score += plannerDraftRoleBonus(piece, bp, opts);
    score -= plannerDraftSequencePenalty(piece, bp);
    if (piece.discoveryIdea === true) {
      score -= 24;
      score += plannerDiscoveryIdeaScore(piece, bp, opts);
    }
    if (safeString(piece.reviewStatus).trim().toLowerCase() === 'manual_review') score -= 26;
    return score;
  }
  function plannerDraftSessionKey(bp) {
    return [
      safeString(bp && bp.family).trim().toLowerCase(),
      String(Math.max(0, Number(bp && bp.targetDuration) || 0)),
      safeString(bp && bp.formation).trim().toLowerCase(),
      safeString(bp && bp.outputLang).trim().toLowerCase(),
      safeString(bp && bp.styleFocus || 'mixed').trim().toLowerCase(),
      safeString(bp && bp.buildMode).trim().toLowerCase(),
      safeString(bp && bp.repertoireMode || 'suggested').trim().toLowerCase(),
      bp && bp.includeDiscoveryIdeas === true ? 'with_discovery' : 'internal_only'
    ].join('|');
  }
  function plannerDraftHistoryRows(bp) {
    var key = plannerDraftSessionKey(bp);
    if (!isObject(state.programmeDraftHistory)) state.programmeDraftHistory = {};
    if (!Array.isArray(state.programmeDraftHistory[key])) state.programmeDraftHistory[key] = [];
    return state.programmeDraftHistory[key];
  }
  function plannerDraftSequenceSignature(bp) {
    return ((bp && bp.items) || []).map(function (it) { return safeString(it && it.pieceId).trim(); }).filter(Boolean).join('|');
  }
  function plannerDraftRecentPenalty(piece, bp, opts) {
    if (!piece) return 0;
    var history = plannerDraftHistoryRows(bp).slice(-6);
    var id = safeString(piece.id).trim();
    var slotIndex = Number(opts && opts.index) || 0;
    var penalty = 0;
    history.forEach(function (row, historyIndex) {
      var ids = Array.isArray(row && row.ids) ? row.ids : [];
      var age = history.length - historyIndex;
      var position = ids.indexOf(id);
      if (position < 0) return;
      penalty += Math.max(2, 10 - age);
      if (position === slotIndex) penalty += Math.max(4, 14 - age);
      if (position >= 0 && Math.abs(position - slotIndex) <= 1) penalty += Math.max(1, 6 - age);
    });
    return penalty;
  }
  function plannerDraftCandidateFrontier(candidates, bp, opts) {
    if (!candidates.length) return [];
    var scored = candidates.map(function (piece) {
      return {
        piece: piece,
        score: plannerSuggestedDraftScore(piece, bp, opts) - plannerDraftRecentPenalty(piece, bp, opts)
      };
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return safeString(a.piece.title).localeCompare(safeString(b.piece.title));
    });
    var topScore = scored[0].score;
    var frontier = scored.filter(function (row, idx) {
      if (idx === 0) return true;
      if (idx >= 6) return false;
      return row.score >= topScore - 18;
    });
    return frontier.length ? frontier : scored.slice(0, 1);
  }
  function plannerDraftSelectFromFrontier(frontier, bp, opts) {
    if (!frontier.length) return null;
    var history = plannerDraftHistoryRows(bp);
    var slotIndex = Number(opts && opts.index) || 0;
    var variantSeed = history.length;
    var choiceIndex = Math.abs((variantSeed * 3) + (slotIndex * 2)) % frontier.length;
    return frontier[choiceIndex].piece || frontier[0].piece || null;
  }
  function plannerRememberDraft(bp) {
    var history = plannerDraftHistoryRows(bp);
    history.push({
      ids: ((bp && bp.items) || []).map(function (it) { return safeString(it && it.pieceId).trim(); }).filter(Boolean),
      signature: plannerDraftSequenceSignature(bp),
      at: Date.now()
    });
    if (history.length > 12) history.splice(0, history.length - 12);
  }
  function plannerDraftRecentlyUsed(bp, signature) {
    var history = plannerDraftHistoryRows(bp).slice(-6);
    return history.some(function (row) { return safeString(row && row.signature).trim() === safeString(signature).trim(); });
  }
  function plannerPickSuggestedDraftPiece(bp, usedIds, opts) {
    var candidates = plannerCandidatePoolForStyleFocus(bp, plannerDraftEligibleItems(bp)).filter(function (piece) {
      var id = safeString(piece && piece.id).trim();
      return id && !usedIds[id];
    }).filter(function (piece) {
      var discoveryCount = Number(opts && opts.discoveryCount) || 0;
      var discoveryLimit = Number(opts && opts.discoveryLimit) || 0;
      if (piece.discoveryIdea === true && discoveryCount >= discoveryLimit) return false;
      return true;
    });
    var frontier = plannerDraftCandidateFrontier(candidates, bp, opts);
    return plannerDraftSelectFromFrontier(frontier, bp, opts);
  }
  function applySuggestedDraftSlot(bp, piece, slotId) {
    if (!piece) return;
    bp.items.push({ pieceId: piece.id, customTitle: '', customDuration: 0, notes: '', slotId: safeString(slotId).trim(), position: bp.items.length });
    recomputeBlueprint(bp);
  }
  function buildSuggestedDraftUsingArc(bp) {
    var usedIds = {};
    var discoveryCount = 0;
    var discoveryLimit = plannerDiscoveryDraftLimit(bp);
    var bands = programsDurationTolerance(bp.targetDuration);
    dramaticArcSlotsForDuration(bp.targetDuration).forEach(function (slot) {
      var candidate = plannerPickSuggestedDraftPiece(bp, usedIds, { slotId: slot.id, index: (bp.items || []).length, discoveryCount: discoveryCount, discoveryLimit: discoveryLimit });
      var duration = Math.max(0, Number(candidate && plannerEffectiveDuration(candidate)) || 0);
      if (!candidate) return;
      if (slot.optional && (Number(bp.totalDuration) || 0) >= bands.lower && ((Number(bp.totalDuration) || 0) + duration) > bands.upper) return;
      applySuggestedDraftSlot(bp, candidate, slot.id);
      if (candidate.discoveryIdea === true) discoveryCount += 1;
      usedIds[safeString(candidate.id).trim()] = true;
    });
    while ((Number(bp.totalDuration) || 0) < bands.lower) {
      var filler = plannerPickSuggestedDraftPiece(bp, usedIds, { index: (bp.items || []).length, discoveryCount: discoveryCount, discoveryLimit: discoveryLimit });
      if (!filler) break;
      applySuggestedDraftSlot(bp, filler, '');
      if (filler.discoveryIdea === true) discoveryCount += 1;
      usedIds[safeString(filler.id).trim()] = true;
      if ((Number(bp.totalDuration) || 0) > bands.upper) break;
    }
  }
  function buildSuggestedDraftFree(bp) {
    var usedIds = {};
    var discoveryCount = 0;
    var discoveryLimit = plannerDiscoveryDraftLimit(bp);
    var bands = programsDurationTolerance(bp.targetDuration);
    plannerDraftSlotPlan(bp).forEach(function (slot, slotIndex) {
      if ((Number(bp.totalDuration) || 0) >= bands.upper) return;
      var candidate = plannerPickSuggestedDraftPiece(bp, usedIds, {
        index: (bp.items || []).length,
        desiredRole: slot.role,
        allowPianoSolo: slot.allowPianoSolo,
        discoveryCount: discoveryCount,
        discoveryLimit: discoveryLimit
      });
      var duration = Math.max(0, Number(candidate && plannerEffectiveDuration(candidate)) || 0);
      if (!candidate) return;
      if ((Number(bp.totalDuration) || 0) >= bands.lower && ((Number(bp.totalDuration) || 0) + duration) > bands.upper && slotIndex >= 2) return;
      applySuggestedDraftSlot(bp, candidate, '');
      if (candidate.discoveryIdea === true) discoveryCount += 1;
      usedIds[safeString(candidate.id).trim()] = true;
    });
    var guard = 0;
    while ((Number(bp.totalDuration) || 0) < bands.lower && guard < 12) {
      guard += 1;
      var filler = plannerPickSuggestedDraftPiece(bp, usedIds, {
        index: (bp.items || []).length,
        desiredRole: (Number(bp.totalDuration) || 0) >= Math.max(0, Number(bp.targetDuration) - 10) ? 'finale' : '',
        discoveryCount: discoveryCount,
        discoveryLimit: discoveryLimit
      });
      var fillerDuration = Math.max(0, Number(filler && plannerEffectiveDuration(filler)) || 0);
      if (!filler) break;
      if ((Number(bp.totalDuration) || 0) >= bands.lower && ((Number(bp.totalDuration) || 0) + fillerDuration) > bands.upper) break;
      applySuggestedDraftSlot(bp, filler, '');
      if (filler.discoveryIdea === true) discoveryCount += 1;
      usedIds[safeString(filler.id).trim()] = true;
      if ((Number(bp.totalDuration) || 0) >= bands.upper) break;
    }
    if ((bp.items || []).length >= 2) {
      var lastPiece = getPlannerItemById((bp.items || [])[bp.items.length - 1] && bp.items[bp.items.length - 1].pieceId);
      var penultimatePiece = getPlannerItemById((bp.items || [])[bp.items.length - 2] && bp.items[bp.items.length - 2].pieceId);
      var lastRole = plannerPieceEditorialRole(lastPiece);
      var prevRole = plannerPieceEditorialRole(penultimatePiece);
      if ((lastRole !== 'finale' && lastRole !== 'climax') && (prevRole === 'finale' || prevRole === 'climax')) {
        var swap = bp.items[bp.items.length - 1];
        bp.items[bp.items.length - 1] = bp.items[bp.items.length - 2];
        bp.items[bp.items.length - 2] = swap;
        recomputeBlueprint(bp);
      }
    }
  }
  function generateSuggestedProgrammeDraft() {
    var bp = currentBlueprint();
    var oldItems = clone(bp.items || []);
    var oldPieceIndex = state.blueprintPieceIndex;
    if ((bp.items || []).length && !window.confirm('Replace the current selected repertoire with a suggested draft?\n\nEncore options will stay as they are.')) return;
    var built = false;
    var attempt = 0;
    var originalHistory = clone(plannerDraftHistoryRows(bp));
    while (!built && attempt < 4) {
      state.programmeDraftHistory[plannerDraftSessionKey(bp)] = clone(originalHistory);
      if (attempt > 0) {
        state.programmeDraftHistory[plannerDraftSessionKey(bp)].push({
          ids: [],
          signature: 'variation_probe_' + String(attempt),
          at: Date.now() + attempt
        });
      }
      bp.items = [];
      state.blueprintPieceIndex = -1;
      recomputeBlueprint(bp);
      if (safeString(bp.buildMode).trim().toLowerCase() === 'dramatic_arc') buildSuggestedDraftUsingArc(bp);
      else buildSuggestedDraftFree(bp);
      var signature = plannerDraftSequenceSignature(bp);
      if ((bp.items || []).length && (!plannerDraftRecentlyUsed(bp, signature) || plannerDraftEligibleItems(bp).length <= Math.max(4, (bp.items || []).length + 1))) {
        built = true;
        break;
      }
      attempt += 1;
    }
    state.programmeDraftHistory[plannerDraftSessionKey(bp)] = clone(originalHistory);
    if (!(bp.items || []).length) {
      bp.items = oldItems;
      state.blueprintPieceIndex = oldPieceIndex;
      recomputeBlueprint(bp);
      renderBlueprintBuilder();
      setStatus('No usable draft could be built from the current setup.', 'warn');
      return;
    }
    plannerRememberDraft(bp);
    state.blueprintPieceIndex = 0;
    renderBlueprintBuilder();
    if (isProgramBuilderCompactViewport()) focusProgramBuilderSelection(false, true);
    if ($('pb-smart-draft-note')) {
      $('pb-smart-draft-note').textContent = bp.includeDiscoveryIdeas === true
        ? 'Draft built from the current frame, style focus, and internal repertoire first. A small number of discovery ideas may appear and stay clearly marked for review.'
        : 'Draft built from the current frame, style focus, and internal repertoire signals. Try another draft to explore a different valid route, then swap anything you want.';
    }
    setStatus('Draft built: ' + String((bp.items || []).length) + ' piece(s) · ' + String(bp.totalDuration || 0) + ' min.', 'ok');
    markDirty(true, 'Suggested programme draft built');
  }
  function plannerSimilarAlternatives(bp, itemIndex) {
    var entry = (bp && bp.items && bp.items[itemIndex]) || null;
    var currentPiece = getPlannerItemById(entry && entry.pieceId);
    if (!entry || !currentPiece) return [];
    var currentFlags = plannerPieceFlags(currentPiece);
    var currentDuration = Math.max(0, Number(entry.customDuration) || Number(plannerEffectiveDuration(currentPiece)) || 0);
    var selectedIds = {};
    (bp.items || []).forEach(function (it, idx) {
      if (idx !== itemIndex) selectedIds[safeString(it && it.pieceId).trim()] = true;
    });
    return plannerCandidatePoolForStyleFocus(bp, plannerDraftEligibleItems(bp)).filter(function (piece) {
      var id = safeString(piece && piece.id).trim();
      return id && id !== safeString(entry.pieceId).trim() && !selectedIds[id];
    }).map(function (piece) {
      var flags = plannerPieceFlags(piece);
      var duration = Math.max(0, Number(plannerEffectiveDuration(piece)) || 0);
      var score = plannerFamilySelectorPriority(piece, bp.family, bp.formation, bp);
      var role = plannerPieceEditorialRole(piece);
      var currentRole = plannerPieceEditorialRole(currentPiece);
      if (safeString(piece.voiceCategory) === safeString(currentPiece.voiceCategory)) score += 24;
      if (safeString(piece.category) === safeString(currentPiece.category)) score += 16;
      if (flags.texture === currentFlags.texture) score += 10;
      if (flags.language && flags.language === currentFlags.language) score += 6;
      if (safeString(piece.dramaticRole) === safeString(currentPiece.dramaticRole)) score += 8;
      if (flags.galaRole === currentFlags.galaRole) score += 8;
      if (flags.styleBucket && flags.styleBucket === currentFlags.styleBucket) score += 8;
      if (flags.audienceAppeal && flags.audienceAppeal === currentFlags.audienceAppeal) score += 4;
      score += plannerStyleFocusScore(piece, bp, { desiredRole: currentRole });
      if (role && role === currentRole) score += 18;
      else if ((role === 'finale' || role === 'climax') && (currentRole === 'finale' || currentRole === 'climax')) score += 12;
      else if ((role === 'contrast' || role === 'lyrical_center') && (currentRole === 'contrast' || currentRole === 'lyrical_center')) score += 10;
      score += plannerDraftReliabilityScore(piece, bp);
      score += Math.max(-12, 14 - (Math.abs(currentDuration - duration) * 2));
      if (safeString(entry.slotId).trim()) score += plannerArcSlotScore(piece, safeString(entry.slotId).trim(), bp);
      if (piece.discoveryIdea === true && currentPiece.discoveryIdea !== true) score -= 18;
      if (safeString(piece.reviewStatus).trim().toLowerCase() === 'manual_review' && safeString(currentPiece.reviewStatus).trim().toLowerCase() !== 'manual_review') score -= 20;
      return { piece: piece, score: score };
    }).sort(function (a, b) {
      if (a.score !== b.score) return b.score - a.score;
      return safeString(a.piece.title).localeCompare(safeString(b.piece.title));
    }).slice(0, 4).map(function (row) { return row.piece; });
  }
  function replaceCurrentBlueprintPiece(pieceId) {
    var bp = currentBlueprint();
    var idx = state.blueprintPieceIndex;
    var entry = (bp && bp.items && bp.items[idx]) || null;
    var nextId = safeString(pieceId).trim();
    if (!entry || !nextId) return;
    var prevPiece = getPlannerItemById(entry.pieceId);
    var nextPiece = getPlannerItemById(nextId);
    if (!nextPiece || safeString(entry.pieceId).trim() === nextId) return;
    entry.pieceId = nextId;
    entry.customTitle = '';
    entry.customDuration = 0;
    entry.notes = '';
    recomputeBlueprint(bp);
    renderBlueprintBuilder();
    if (isProgramBuilderCompactViewport()) focusProgramBuilderSelection(true, false);
    setStatus('Replaced ' + safeString(prevPiece && prevPiece.title || 'piece') + ' with ' + safeString(nextPiece.title || 'new piece') + '.', 'ok');
    markDirty(true, 'Programme repertoire replaced');
  }
  function plannerAddPieceToCurrentOffer(pieceId) {
    pieceId = safeString(pieceId).trim();
    if (!pieceId) return;
    var bp = currentBlueprint();
    var existingIndex = (bp.items || []).findIndex(function (it) { return safeString(it.pieceId) === pieceId; });
    if (existingIndex >= 0) {
      state.blueprintPieceIndex = existingIndex;
      renderBlueprintBuilder();
      if (isProgramBuilderCompactViewport()) focusProgramBuilderSelection(true, true);
      setStatus('Piece already included in this offer.', 'warn');
      return;
    }
    bp.items.push({ pieceId: pieceId, customTitle: '', customDuration: 0, notes: '', slotId: '', position: bp.items.length });
    state.blueprintPieceIndex = bp.items.length - 1;
    renderBlueprintBuilder();
    if (isProgramBuilderCompactViewport()) focusProgramBuilderSelection(true, true);
    markDirty(true, 'Programme repertoire added');
  }
  function plannerAddPieceToEncore(pieceId, encoreIndex) {
    pieceId = safeString(pieceId).trim();
    if (!pieceId) return;
    var bp = currentBlueprint();
    var index = Number.isFinite(Number(encoreIndex)) ? Number(encoreIndex) : -1;
    if (index < 0 || index >= (bp.encoreItems || []).length) {
      if ((bp.encoreItems || []).length >= 3) {
        setStatus('You can keep up to three encore options here.', 'warn');
        return;
      }
      bp.encoreItems.push({ pieceId: '', customTitle: '', customDuration: 0, note: '', position: bp.encoreItems.length });
      index = bp.encoreItems.length - 1;
    }
    bp.encoreItems[index].pieceId = pieceId;
    recomputeBlueprint(bp);
    renderBlueprintBuilder();
    markDirty(true, 'Encore options updated');
  }
  function quickAddContextLabel() {
    var type = safeString(state.quickAddTargetType || 'main').trim().toLowerCase() || 'main';
    if (type === 'arc') {
      var bp = currentBlueprint();
      var slotLabel = dramaticArcSlotLabel(state.quickAddTargetSlotId, bp.targetDuration) || 'dramatic arc slot';
      return 'This quick entry will go straight into ' + slotLabel + '.';
    }
    if (type === 'encore') {
      var idx = Number.isFinite(Number(state.quickAddTargetEncoreIndex)) && Number(state.quickAddTargetEncoreIndex) >= 0
        ? ('Encore ' + String(Number(state.quickAddTargetEncoreIndex) + 1))
        : 'the encore options';
      return 'This quick entry will go straight into ' + idx + '.';
    }
    return 'This quick entry will go into the main programme list.';
  }
  function renderQuickAddContext() {
    if ($('pb-quick-add-context')) $('pb-quick-add-context').textContent = quickAddContextLabel();
  }
  function renderQuickAddManualDefaults(force) {
    if (!force && $('pb-quick-formation') && safeString($('pb-quick-formation').value).trim()) return;
    var formation = safeString(($('pb-blueprint-formation') && $('pb-blueprint-formation').value) || (currentBlueprint() && currentBlueprint().formation)).trim();
    if ($('pb-quick-formation')) $('pb-quick-formation').value = formation;
  }
  function openQuickAddManual(targetType, targetMeta) {
    state.quickAddTargetType = safeString(targetType || state.quickAddTargetType || 'main').trim().toLowerCase() || 'main';
    state.quickAddTargetSlotId = safeString(targetMeta && targetMeta.slotId || '').trim().toLowerCase();
    state.quickAddTargetEncoreIndex = Number.isFinite(Number(targetMeta && targetMeta.encoreIndex)) ? Number(targetMeta.encoreIndex) : -1;
    var panel = $('pb-quick-add-panel');
    if (panel) panel.hidden = false;
    document.body.classList.add('programme-offer-modal-active');
    resetQuickAddManualForm();
    setTimeout(function () {
      var titleInput = $('pb-quick-title');
      if (titleInput && typeof titleInput.focus === 'function') {
        titleInput.focus();
        if (typeof titleInput.select === 'function') titleInput.select();
      }
    }, 20);
  }
  function closeQuickAddManual() {
    var panel = $('pb-quick-add-panel');
    if (panel) panel.hidden = true;
    document.body.classList.remove('programme-offer-modal-active');
  }
  function resetQuickAddManualForm() {
    if ($('pb-quick-title')) $('pb-quick-title').value = '';
    if ($('pb-quick-composer')) $('pb-quick-composer').value = '';
    if ($('pb-quick-work')) $('pb-quick-work').value = '';
    if ($('pb-quick-type')) $('pb-quick-type').value = 'aria';
    if ($('pb-quick-language')) $('pb-quick-language').value = '';
    if ($('pb-quick-duration')) $('pb-quick-duration').value = '';
    renderQuickAddManualDefaults(true);
    if ($('pb-quick-saveMode')) $('pb-quick-saveMode').value = 'offer_only';
    if ($('pb-quick-needsReview')) $('pb-quick-needsReview').checked = true;
    if ($('pb-quick-outside')) $('pb-quick-outside').checked = false;
    if ($('pb-quick-add-state')) $('pb-quick-add-state').textContent = 'You can refine quick-added pieces later in the full Repertoire Library editor.';
    renderQuickAddContext();
  }
  function quickAddManualPiece() {
    var title = safeString($('pb-quick-title') && $('pb-quick-title').value).trim();
    if (!title) {
      setStatus('Add at least a title for the quick manual entry.', 'warn');
      if ($('pb-quick-add-state')) $('pb-quick-add-state').textContent = 'Add a title first, then quick-add the piece.';
      return;
    }
    state.plannerDoc = safePlannerDoc(state.plannerDoc);
    var composer = safeString($('pb-quick-composer') && $('pb-quick-composer').value).trim();
    var work = safeString($('pb-quick-work') && $('pb-quick-work').value).trim();
    var type = safeString($('pb-quick-type') && $('pb-quick-type').value || 'other').trim().toLowerCase() || 'other';
    var language = safeString($('pb-quick-language') && $('pb-quick-language').value).trim().toUpperCase();
    var duration = Math.max(0, Number($('pb-quick-duration') && $('pb-quick-duration').value) || 0);
    var formation = safeString($('pb-quick-formation') && $('pb-quick-formation').value).trim() || safeString((currentBlueprint() && currentBlueprint().formation) || '').trim();
    var saveMode = safeString($('pb-quick-saveMode') && $('pb-quick-saveMode').value || 'offer_only').trim().toLowerCase();
    var needsReview = !!($('pb-quick-needsReview') && $('pb-quick-needsReview').checked);
    var outsideSuggestion = !!($('pb-quick-outside') && $('pb-quick-outside').checked);
    var family = safeString((currentBlueprint() && currentBlueprint().family) || state.blueprintFamily || 'gala').trim().toLowerCase() || 'gala';
    var fitTags = [];
    if (family === 'gala') fitTags.push('gala');
    if (family === 'italian' || language === 'IT' || type === 'canzone') fitTags.push('italian');
    if (family === 'tango' || type === 'tango') fitTags.push('tango');
    if (family === 'borders') fitTags.push('borders');
    if (type === 'duet') fitTags.push('duet');
    if (type === 'ensemble') fitTags.push('ensemble');
    if (type === 'lied') fitTags.push('lied');
    if (type === 'sacred') fitTags.push('sacred');
    if (type === 'operetta') fitTags.push('operetta');
    var offerOnly = saveMode === 'offer_only';
    var raw = {
      id: nextPlannerItemId([composer, title].filter(Boolean).join(' ')),
      title: title,
      composer: composer,
      work: work,
      type: type,
      language: language,
      durationMin: duration,
      approximateDurationMin: duration,
      formations: formation ? [formation] : [],
      readiness: outsideSuggestion ? 'idea' : 'working',
      availabilityStatus: outsideSuggestion ? 'outside_repertoire' : 'working',
      tags: programBuilderUniqueStrings(fitTags),
      fitTags: programBuilderUniqueStrings(fitTags),
      notes: offerOnly ? 'Quick manual entry for current offer.' : 'Quick manual entry.',
      publicNotes: '',
      sortOrder: ((state.plannerDoc.items || []).length + 1) * 10,
      performanceStatus: '',
      performedIn: [],
      reviewStatus: needsReview ? 'manual_review' : 'clean',
      offerOnly: offerOnly,
      excludeFromOffers: offerOnly,
      sourceGroup: 'Quick add',
      suggestionGroup: outsideSuggestion ? 'Quick manual suggestions' : ''
    };
    var normalized = normalizePlannerItemRecord(raw, (state.plannerDoc.items || []).length);
    state.plannerDoc.items.push(normalized);
    saveDoc('rg_repertoire_planner', state.plannerDoc);
    state.plannerIndex = state.plannerDoc.items.length - 1;
    if (state.quickAddTargetType === 'arc' && safeString(state.quickAddTargetSlotId).trim()) {
      assignBlueprintArcSlot(state.quickAddTargetSlotId, normalized.id);
    } else if (state.quickAddTargetType === 'encore') {
      plannerAddPieceToEncore(normalized.id, state.quickAddTargetEncoreIndex);
    } else {
      plannerAddPieceToCurrentOffer(normalized.id);
    }
    renderPlannerRepList();
    resetQuickAddManualForm();
    if ($('pb-quick-add-state')) {
      $('pb-quick-add-state').textContent = '"' + normalized.title + '" was added ' + (state.quickAddTargetType === 'arc' ? 'to the dramatic arc slot' : (state.quickAddTargetType === 'encore' ? 'to the encore options' : 'to the current offer')) + (offerOnly ? ' as an offer-only draft' : ' and saved to the repertoire library') + (needsReview ? ', marked for review' : '') + (outsideSuggestion ? ', and tagged as an outside-repertoire suggestion' : '') + '.';
    }
    closeQuickAddManual();
    setStatus('Quick manual repertoire entry added.', 'ok');
  }
  function renderBlueprintQuickPicks() {
    var box = $('pb-quick-picks');
    if (!box) return;
    var bp = currentBlueprint();
    var selectedIds = {};
    (bp.items || []).forEach(function (it) { selectedIds[safeString(it.pieceId)] = true; });
    var suggestions = plannerOfferFilteredItems().filter(function (item) {
      return !selectedIds[safeString(item.id)];
    }).slice(0, 6);
    if (!suggestions.length) {
      box.innerHTML = '<div class="pb-quick-picks__empty">' + (state.plannerOfferMatchingOnly !== false ? 'No quick picks fit this frame cleanly right now. Relax the filters or browse the whole library if you want more options.' : 'No quick picks are available with the current filters. Relax the filters or use the full selector above.') + '</div>';
      return;
    }
    box.innerHTML = suggestions.map(function (item) {
      var badges = [];
      var family = safeString(bp.family || state.blueprintFamily || 'gala').trim().toLowerCase();
      var formation = safeString(bp.formation).trim();
      var familyTier = plannerOfferFamilyFitTier(item, bp, family);
      var flags = plannerPieceFlags(item);
      if (familyTier >= 3 && pieceMatchesFormation(item, formation)) badges.push('<span class="item-badge ok">strong fit</span>');
      else if (familyTier >= 2) badges.push('<span class="item-badge ok">good fit</span>');
      else if (familyTier >= 1) badges.push('<span class="item-badge">broad fit</span>');
      if (safeString(item.performanceStatus) === 'performed') badges.push('<span class="item-badge ok">performed</span>');
      if (safeString(item.reviewStatus) === 'manual_review') badges.push('<span class="item-badge warn">review</span>');
      badges.push('<span class="item-badge">' + escapeHtml(plannerItemVoiceLabel(item)) + '</span>');
      if (item.dramaticRole) badges.push('<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[item.dramaticRole] || item.dramaticRole) + '</span>');
      if (family === 'gala') {
        if (flags.recoveryValue === 'partial' || flags.recoveryValue === 'strong' || flags.galaRole === 'vocal_rest_support') badges.push('<span class="item-badge">breathing point</span>');
        if (flags.styleBucket === 'operetta' || flags.styleBucket === 'canzone' || flags.galaRole === 'contrast') badges.push('<span class="item-badge">contrast</span>');
        if (flags.galaRole === 'finale' || flags.galaRole === 'climax') badges.push('<span class="item-badge ok">strong close</span>');
      }
      var meta = [item.composer, item.work, item.language, String(plannerEffectiveDuration(item) || 0) + ' min'].filter(Boolean).join(' · ');
      return '<div class="pb-quick-picks__item">' +
        '<div class="pb-quick-picks__body">' +
          '<span class="pb-quick-picks__title">' + escapeHtml(item.title || '(untitled)') + '</span>' +
          '<span class="pb-quick-picks__meta">' + escapeHtml(meta) + '</span>' +
          (badges.length ? '<div class="item-badges">' + badges.join('') + '</div>' : '') +
        '</div>' +
        '<button type="button" data-pb-quick-add="' + escapeAttr(item.id) + '">Add</button>' +
      '</div>';
    }).join('');
    box.querySelectorAll('[data-pb-quick-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        plannerAddPieceToCurrentOffer(btn.getAttribute('data-pb-quick-add'));
      });
    });
  }
  function programmeArcHints(bp) {
    if (bp.buildMode !== 'dramatic_arc') return [];
    var slots = dramaticArcSlotsForDuration(bp.targetDuration);
    var ordered = slots.map(function (slot) {
      var entry = blueprintPieceBySlot(bp, slot.id);
      if (!entry) return null;
      var piece = getPlannerItemById(entry.pieceId);
      return piece ? { slot: slot, piece: piece } : null;
    }).filter(Boolean);
    var hints = [];
    if (!ordered.length) {
      return [{ kind: 'warn', text: 'Start with an opening and an ending so the programme has a clear shape.' }];
    }
    var finaleSlot = slots.filter(function (slot) { return slot.id.indexOf('finale') >= 0 || slot.id.indexOf('resolution') >= 0; }).pop();
    var finaleEntry = finaleSlot ? ordered.find(function (row) { return row.slot.id === finaleSlot.id; }) : ordered[ordered.length - 1];
    if (!finaleEntry || ['finale','climax','encore'].indexOf(safeString(finaleEntry.piece.dramaticRole)) < 0 && safeString(finaleEntry.piece.impactLevel) !== 'high') {
      hints.push({ kind: 'warn', text: 'The ending still feels soft. Consider a stronger final piece.' });
    }
    for (var i = 0; i <= ordered.length - 3; i += 1) {
      var slowRun = ordered.slice(i, i + 3).every(function (row) {
        return safeString(row.piece.tempoProfile) === 'slow' || safeString(row.piece.energyLevel) === 'low';
      });
      if (slowRun) {
        hints.push({ kind: 'warn', text: 'Too many slow or inward pieces sit together in the middle of the arc.' });
        break;
      }
    }
    for (var j = 0; j <= ordered.length - 3; j += 1) {
      var highRun = ordered.slice(j, j + 3).every(function (row) {
        return safeString(row.piece.impactLevel) === 'high' || safeString(row.piece.energyLevel) === 'high';
      });
      if (highRun) {
        hints.push({ kind: 'warn', text: 'High-impact pieces are clustering together. The programme may need more breathing room.' });
        break;
      }
    }
    if (!(bp.encoreItems || []).length) {
      var encoreSelected = ordered.some(function (row) { return row.piece.encoreCandidate === true || safeString(row.piece.dramaticRole) === 'encore'; });
      if (!encoreSelected) hints.push({ kind: 'warn', text: 'No encore option is set aside yet. That is fine, but consider keeping one in reserve.' });
    }
    var languages = {};
    ordered.forEach(function (row) {
      var key = safeString(row.piece.language).trim().toUpperCase();
      if (key) languages[key] = true;
    });
    if (ordered.length >= 4 && Object.keys(languages).length <= 1) {
      hints.push({ kind: 'warn', text: 'The language palette is quite narrow. If you want, add a contrast point in another language or style.' });
    }
    if (!hints.length) hints.push({ kind: 'ok', text: 'The dramatic arc reads clearly as a first recital draft.' });
    return hints;
  }
  function programmeGalaHints(bp) {
    if (!bp || safeString(bp.family).trim().toLowerCase() !== 'gala') return [];
    var ordered = ((bp.items || []).map(function (it) {
      var piece = getPlannerItemById(it && it.pieceId);
      return piece ? { entry: it, piece: piece, flags: plannerPieceFlags(piece) } : null;
    }).filter(Boolean));
    var hints = [];
    var options = galaOptionsForBlueprint(bp);
    var summary = galaProgrammeState(bp);
    if (!ordered.length) return [{ kind: 'warn', text: 'Start with a clear opening piece, then shape the rest of the gala around pacing and a strong ending.' }];
    for (var i = 0; i <= ordered.length - 2; i += 1) {
      if (ordered[i].piece.includesTenor === true && ordered[i + 1].piece.includesTenor === true && ordered[i].flags.texture === 'solo' && ordered[i + 1].flags.texture === 'solo' && ordered[i].flags.vocalLoad === 'heavy' && ordered[i + 1].flags.vocalLoad === 'heavy') {
        hints.push({ kind: 'warn', text: 'Heavy sequence: two demanding tenor solos are back to back. Insert a duet, ensemble, piano-led moment, or lighter contrast between them.' });
        break;
      }
    }
    if (!summary.hasContrast && ordered.length >= 3) {
      hints.push({ kind: 'warn', text: 'Contrast is still thin. Add a different colour such as a duet, ensemble, operetta/canzone turn, or a breathing-point interlude.' });
    }
    if (!summary.lastIsStrongEnding) {
      hints.push({ kind: 'warn', text: 'The ending is not convincing yet. Save a clearer finale or stronger closing piece for the end.' });
    }
    if (bp.targetDuration >= 45 && summary.breathingPoints < galaSupportTarget(bp.targetDuration)) {
      hints.push({ kind: 'warn', text: 'Pacing needs more air. A duet, ensemble, or piano interlude would help the middle breathe.' });
    }
    if ((bp.encoreItems || []).length || plannerEncoreCandidatePool(bp).some(function (piece) { return piece.encoreCandidate === true || safeString(piece.galaRole).trim().toLowerCase() === 'encore'; })) {
      hints.push({ kind: 'ok', text: 'An encore candidate is available if you want to keep one in reserve.' });
    }
    if (options.preferVocalPacing) {
      hints.push({ kind: 'ok', text: bp.targetDuration >= 60 ? 'Vocal pacing is active: aim for one or two breathing points before the final climb.' : 'Vocal pacing is active: leave at least one clear breathing point in the gala arc.' });
    }
    if (!hints.length) hints.push({ kind: 'ok', text: 'This Opera Gala reads as a convincing draft with a workable pacing shape.' });
    return hints;
  }
  function renderGalaSetupOptions() {
    var bp = currentBlueprint();
    var isGala = safeString(bp.family).trim().toLowerCase() === 'gala';
    var wrap = $('pb-gala-setup');
    var buildWrap = $('pb-build-mode-wrap');
    var options = galaOptionsForBlueprint(bp);
    if (wrap) wrap.hidden = !isGala;
    if (buildWrap) buildWrap.hidden = isGala;
    if ($('pb-gala-preferPacing')) $('pb-gala-preferPacing').checked = options.preferVocalPacing;
    if ($('pb-gala-allowPianoInterludes')) $('pb-gala-allowPianoInterludes').checked = options.allowPianoInterludes;
    if ($('pb-gala-includeContrast')) $('pb-gala-includeContrast').checked = options.includeContrast;
    if ($('pb-gala-buildArc')) $('pb-gala-buildArc').checked = options.buildWithGalaArc === true;
  }
  function renderGalaHints() {
    var box = $('pb-gala-hints');
    if (!box) return;
    var bp = currentBlueprint();
    if (safeString(bp.family).trim().toLowerCase() !== 'gala') {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    var hints = programmeGalaHints(bp);
    box.hidden = !hints.length;
    box.innerHTML = '<div class="pb-hint-cluster__head"><h4>Editorial checks</h4><p class="muted">Quick shaping notes for pacing, contrast, and finish.</p></div>' + hints.map(function (hint) {
      return '<div class="pb-arc-hint ' + escapeAttr(hint.kind || 'warn') + '">' + escapeHtml(hint.text) + '</div>';
    }).join('');
  }
  function renderDramaticArcBuilder() {
    var wrap = $('pb-arc-builder');
    var slotsBox = $('pb-arc-slots');
    var hintsBox = $('pb-arc-hints');
    var panel = $('pb-arc-panel');
    if (!wrap || !slotsBox || !hintsBox) return;
    var bp = currentBlueprint();
    if (safeString(bp.buildMode || 'free') !== 'dramatic_arc') {
      if (panel) {
        panel.hidden = true;
        panel.open = false;
      }
      wrap.hidden = true;
      slotsBox.innerHTML = '';
      hintsBox.innerHTML = '';
      return;
    }
    if (panel) panel.hidden = false;
    wrap.hidden = false;
    var slots = dramaticArcSlotsForDuration(bp.targetDuration);
    slotsBox.innerHTML = slots.map(function (slot) {
      var pool = blueprintArcCandidatePool(bp, slot.id);
      var entry = blueprintPieceBySlot(bp, slot.id);
      var currentId = safeString(entry && entry.pieceId).trim();
      var currentPiece = currentId ? getPlannerItemById(currentId) : null;
      var options = ['<option value="">Choose piece…</option>'].concat(pool.map(function (piece) {
        var selected = safeString(piece.id) === currentId ? ' selected' : '';
        var labels = [piece.title, piece.composer, plannerItemVoiceLabel(piece), String(plannerEffectiveDuration(piece) || 0) + ' min'];
        if (piece.dramaticRole) labels.push(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[piece.dramaticRole] || piece.dramaticRole);
        if (plannerOfferFamilyFitTier(piece, bp, bp.family) >= 3) labels.push('family fit');
        if (plannerArcSlotScore(piece, slot.id, bp) >= 24) labels.push('slot fit');
        return '<option value="' + escapeAttr(piece.id) + '"' + selected + '>' + escapeHtml(labels.filter(Boolean).join(' · ')) + '</option>';
      })).join('');
      var roleHint = currentPiece && currentPiece.dramaticRole ? '<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[currentPiece.dramaticRole] || currentPiece.dramaticRole) + '</span>' : (slot.optional ? '<span class="item-badge">optional</span>' : '');
      return '<div class="pb-arc-slot">' +
        '<div class="pb-arc-slot__label"><strong>' + escapeHtml(slot.label) + '</strong><span>' + escapeHtml(slot.hint || '') + '</span>' + roleHint + '</div>' +
        '<label><select data-pb-arc-slot="' + escapeAttr(slot.id) + '">' + options + '</select></label>' +
        '<div class="pb-arc-slot__actions"><button type="button" data-pb-arc-quick-add="' + escapeAttr(slot.id) + '">Quick add manually</button><button type="button" data-pb-arc-clear="' + escapeAttr(slot.id) + '">Clear</button></div>' +
      '</div>';
    }).join('');
    slotsBox.querySelectorAll('[data-pb-arc-slot]').forEach(function (select) {
      select.addEventListener('change', function () {
        assignBlueprintArcSlot(select.getAttribute('data-pb-arc-slot'), select.value);
      });
    });
    slotsBox.querySelectorAll('[data-pb-arc-clear]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        assignBlueprintArcSlot(btn.getAttribute('data-pb-arc-clear'), '');
      });
    });
    slotsBox.querySelectorAll('[data-pb-arc-quick-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openQuickAddManual('arc', { slotId: btn.getAttribute('data-pb-arc-quick-add') });
      });
    });
    var hints = programmeArcHints(bp);
    hintsBox.innerHTML = hints.map(function (hint) {
      return '<div class="pb-arc-hint ' + escapeAttr(hint.kind || 'warn') + '">' + escapeHtml(hint.text) + '</div>';
    }).join('');
  }
  function plannerOutsideSuggestions() {
    var items = (state.plannerDoc && Array.isArray(state.plannerDoc.items)) ? state.plannerDoc.items : [];
    return items.filter(function (item) {
      return safeString(item.availabilityStatus).trim().toLowerCase() === 'outside_repertoire';
    }).sort(function (a, b) {
      var groupA = PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER.indexOf(safeString(a.suggestionGroup));
      var groupB = PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER.indexOf(safeString(b.suggestionGroup));
      if (groupA !== groupB) return (groupA < 0 ? 999 : groupA) - (groupB < 0 ? 999 : groupB);
      return safeString(a.title).localeCompare(safeString(b.title));
    });
  }
  function promoteOutsideSuggestion(pieceId) {
    pieceId = safeString(pieceId).trim();
    if (!pieceId) return;
    var idx = (state.plannerDoc.items || []).findIndex(function (item) { return safeString(item.id) === pieceId; });
    if (idx < 0) return;
    var item = clone(state.plannerDoc.items[idx]);
    item.availabilityStatus = 'idea';
    if (!safeString(item.readiness).trim()) item.readiness = 'idea';
    item.excludeFromOffers = false;
    state.plannerDoc.items[idx] = normalizePlannerItemRecord(item, idx);
    state.plannerIndex = idx;
    renderPlannerRepList();
    renderBlueprintBuilder();
    renderOutsideRepertoireSuggestions();
    setStatus('Suggestion moved into the working repertoire library.', 'ok');
    markDirty(true, 'Outside repertoire suggestion adopted');
  }
  function renderOutsideRepertoireSuggestions() {
    var box = $('pb-outside-suggestions');
    if (!box) return;
    var suggestions = plannerOutsideSuggestions();
    if (!suggestions.length) {
      box.innerHTML = '<div class="empty-state">No outside suggestions are currently seeded. Suggestions added here stay separate from the main selector until you move them into the working repertoire.</div>';
      return;
    }
    var grouped = {};
    suggestions.forEach(function (item) {
      var key = safeString(item.suggestionGroup || 'Outside repertoire');
      if (!Array.isArray(grouped[key])) grouped[key] = [];
      grouped[key].push(item);
    });
    var groups = Object.keys(grouped).sort(function (a, b) {
      return (PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER.indexOf(a) < 0 ? 999 : PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER.indexOf(a)) - (PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER.indexOf(b) < 0 ? 999 : PROGRAM_BUILDER_OUTSIDE_GROUP_ORDER.indexOf(b));
    });
    box.innerHTML = groups.map(function (group) {
      return '<div class="pb-suggestion-group">' +
        '<div class="pb-suggestion-group__head"><h4>' + escapeHtml(group) + '</h4><span class="pill">' + escapeHtml(String(grouped[group].length) + ' suggestions') + '</span></div>' +
        '<div class="pb-suggestion-group__list">' + grouped[group].map(function (item) {
          var meta = [item.composer, item.work, item.language, plannerItemVoiceLabel(item), String(plannerEffectiveDuration(item) || 0) + ' min'].filter(Boolean).join(' · ');
          var fitTags = (item.fitTags || []).slice(0, 4);
          return '<div class="pb-suggestion-card">' +
            '<div class="pb-suggestion-card__body">' +
              '<strong>' + escapeHtml(item.title) + '</strong>' +
              '<span class="pb-suggestion-card__meta">' + escapeHtml(meta) + '</span>' +
              (fitTags.length ? '<div class="item-badges">' + fitTags.map(function (tag) { return '<span class="item-badge">' + escapeHtml(tag) + '</span>'; }).join('') + '</div>' : '') +
              '<p class="muted">' + escapeHtml(item.notes || '') + (item.sourceGroup ? (' Source: ' + safeString(item.sourceGroup)) : '') + '</p>' +
            '</div>' +
            '<button type="button" data-pb-suggestion-promote="' + escapeAttr(item.id) + '">Move to repertoire</button>' +
          '</div>';
        }).join('') + '</div>' +
      '</div>';
    }).join('');
    box.querySelectorAll('[data-pb-suggestion-promote]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        promoteOutsideSuggestion(btn.getAttribute('data-pb-suggestion-promote'));
      });
    });
  }
  function renderBlueprintHeader() {
    var bp = currentBlueprint();
    recomputeBlueprint(bp);
    var lang = safeString(bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
    hydrateProgramOfferAutoFields(bp, lang);
    var copy = plannerOutputCopy(lang);
    if ($('pb-blueprint-key')) $('pb-blueprint-key').textContent = 'Working slot · ' + plannerFamilyLabelForLang(bp.family, lang) + ' / ' + String(bp.targetDuration) + ' ' + copy.durationMinutes;
    if ($('pb-family')) $('pb-family').value = bp.family;
    if ($('pb-duration')) $('pb-duration').value = String(bp.targetDuration);
    if ($('pb-blueprint-title')) $('pb-blueprint-title').value = resolveProgramOfferField(bp, 'title', lang);
    if ($('pb-blueprint-formation')) $('pb-blueprint-formation').value = safeString(bp.formation);
    if ($('pb-style-focus')) $('pb-style-focus').value = normalizeProgramOfferStyleFocus(bp.styleFocus);
    if ($('pb-include-discovery-ideas')) $('pb-include-discovery-ideas').checked = bp.includeDiscoveryIdeas === true;
    if ($('pb-setup-summary')) $('pb-setup-summary').textContent = 'Current frame: ' + [plannerFamilyLabelForLang(bp.family, lang), String(bp.targetDuration) + ' ' + copy.durationMinutes, safeString(lang).toUpperCase(), safeString(bp.formation || 'Tenor + Piano'), plannerStyleFocusLabel(bp.styleFocus), bp.includeDiscoveryIdeas === true ? 'Discovery-assisted' : 'Internal only'].filter(Boolean).join(' · ');
    if ($('pb-build-mode')) $('pb-build-mode').value = safeString(bp.buildMode || 'free');
    if ($('pb-output-lang')) $('pb-output-lang').value = lang;
    if ($('pb-repertoire-mode')) $('pb-repertoire-mode').value = normalizeProgramOfferRepertoireMode(bp.repertoireMode || 'suggested');
    if ($('pb-header-image-mode')) $('pb-header-image-mode').value = normalizeProgramOfferHeaderImageMode(bp.headerImageMode);
    if ($('pb-header-image-url')) $('pb-header-image-url').value = safeString(bp.headerImageUrl);
    if ($('pb-header-image-url-wrap')) $('pb-header-image-url-wrap').hidden = normalizeProgramOfferHeaderImageMode(bp.headerImageMode) !== 'custom';
    if ($('pb-contact-phone')) $('pb-contact-phone').value = safeString(bp.contactPhoneOverride || programBuilderContactForLang(lang).phone || '');
    if ($('pb-offer-filter-status')) $('pb-offer-filter-status').value = state.plannerOfferStatusFilter || 'all';
    if ($('pb-offer-filter-category')) $('pb-offer-filter-category').value = state.plannerOfferCategoryFilter || 'all';
    if ($('pb-offer-filter-tag')) $('pb-offer-filter-tag').value = safeString(state.plannerOfferTagFilter);
    if ($('pb-offer-filter-lang')) $('pb-offer-filter-lang').value = safeString(state.plannerOfferLangFilter);
    if ($('pb-offer-filter-matchingOnly')) $('pb-offer-filter-matchingOnly').checked = state.plannerOfferMatchingOnly !== false;
    if ($('pb-offer-filter-showAll')) $('pb-offer-filter-showAll').checked = state.plannerOfferMatchingOnly === false;
    if ($('pb-offer-filter-formation')) $('pb-offer-filter-formation').checked = !!state.plannerOfferFormationOnly;
    if ($('pb-offer-filter-showWithoutTenor')) $('pb-offer-filter-showWithoutTenor').checked = !!state.plannerOfferShowWithoutTenor;
    if ($('pb-version-label')) $('pb-version-label').value = safeString(bp.versionLabel);
    if ($('pb-offer-useCase')) $('pb-offer-useCase').value = normalizeProgramOfferUseCase(bp.useCase || 'other');
    if ($('pb-offer-status')) $('pb-offer-status').value = normalizeSavedProgramStatus(bp.offerStatus || 'draft', 'venue_offer');
    if ($('pb-offer-description')) $('pb-offer-description').value = resolveProgramOfferField(bp, 'description', lang);
    if ($('pb-flexible-note')) $('pb-flexible-note').value = resolveProgramOfferField(bp, 'flexibleNote', lang);
    if ($('pb-encore-export')) $('pb-encore-export').checked = bp.includeEncoresInExport === true;
    if ($('pb-blueprint-title-state')) $('pb-blueprint-title-state').textContent = programOfferFieldStateLabel(bp, 'title', lang);
    if ($('pb-offer-description-state')) $('pb-offer-description-state').textContent = programOfferFieldStateLabel(bp, 'description', lang);
    if ($('pb-flexible-note-state')) $('pb-flexible-note-state').textContent = programOfferFieldStateLabel(bp, 'flexibleNote', lang);
    if ($('pb-blueprint-notes')) $('pb-blueprint-notes').value = safeString(bp.internalNotes);
    if ($('pb-target-duration')) $('pb-target-duration').textContent = copy.durationTarget + ': ' + String(bp.targetDuration) + ' ' + copy.durationMinutes;
    if ($('pb-current-duration')) $('pb-current-duration').textContent = copy.durationCurrent + ': ' + String(bp.totalDuration || 0) + ' ' + copy.durationMinutes;
    if ($('pb-duration-delta')) $('pb-duration-delta').textContent = programsDurationProgressText(bp.totalDuration || 0, bp.targetDuration || 0, lang);
    if ($('pb-encore-duration')) $('pb-encore-duration').textContent = copy.durationEncore + ': ' + String(bp.encoreTotalDuration || 0) + ' ' + copy.durationMinutes;
    if ($('pb-combined-duration')) $('pb-combined-duration').textContent = copy.durationPossible + ': ' + String(bp.combinedDuration || bp.totalDuration || 0) + ' ' + copy.durationMinutes;
    var status = programsDurationState(bp.totalDuration || 0, bp.targetDuration || 0);
    if ($('pb-duration-status')) {
      $('pb-duration-status').className = 'pill ' + status.className;
      $('pb-duration-status').textContent = plannerStatusLabel(status.key, lang);
    }
    if ($('pb-smart-draft-note')) $('pb-smart-draft-note').textContent = bp.includeDiscoveryIdeas === true
      ? 'Use the current frame to build a strong editable draft. Internal repertoire stays first, with only a small number of clearly marked discovery ideas if they fit well.'
      : 'Use the current family, duration, formation, style focus, and repertoire metadata to assemble a strong editable first draft.';
    renderProgramBuilderDurationBoard(bp, lang, copy);
    if ($('pb-selected-count')) $('pb-selected-count').textContent = (bp.items || []).length + (((bp.items || []).length === 1) ? ' piece selected' : ' pieces selected');
    renderQuickAddContext();
    renderProgramOfferSaveState();
  }
  function renderBlueprintPieceAlternatives(bp, itemIndex) {
    var wrap = $('pb-piece-alternatives');
    var replaceBtn = $('pb-piece-replace');
    var entry = (bp && bp.items && bp.items[itemIndex]) || null;
    var piece = getPlannerItemById(entry && entry.pieceId);
    var alternatives = piece ? plannerSimilarAlternatives(bp, itemIndex) : [];
    if (replaceBtn) replaceBtn.disabled = !alternatives.length;
    if (!wrap) return alternatives;
    if (!entry || !piece) {
      wrap.innerHTML = '<div class="pb-piece-alternatives__empty">Select a repertoire line to see quick replacements here.</div>';
      return alternatives;
    }
    if (!alternatives.length) {
      wrap.innerHTML = '<div class="pb-piece-alternatives__empty">No close replacements were found for this line inside the current programme frame.</div>';
      return alternatives;
    }
    wrap.innerHTML = '<div class="pb-piece-alternatives__head"><strong>Replace with similar</strong><span class="muted">Swap this line without rebuilding the whole programme.</span></div>' + alternatives.map(function (candidate) {
      var meta = [candidate.composer, candidate.work, plannerItemVoiceLabel(candidate)];
      var language = safeString(candidate.language).trim().toUpperCase();
      if (language) meta.push(language);
      meta.push(String(plannerEffectiveDuration(candidate) || 0) + ' min');
      var badges = [];
      if (plannerOfferFamilyFitTier(candidate, bp, bp.family) >= 3) badges.push('<span class="item-badge ok">strong fit</span>');
      if (candidate.discoveryIdea === true) badges.push('<span class="item-badge warn">discovery idea</span>');
      if (safeString(candidate.performanceStatus).trim().toLowerCase() === 'performed') badges.push('<span class="item-badge ok">performed</span>');
      if (safeString(candidate.reviewStatus).trim().toLowerCase() === 'manual_review') badges.push('<span class="item-badge warn">review</span>');
      if (safeString(candidate.dramaticRole).trim()) badges.push('<span class="item-badge">' + escapeHtml(PROGRAM_BUILDER_DRAMATIC_ROLE_LABELS[candidate.dramaticRole] || candidate.dramaticRole) + '</span>');
      return '<div class="pb-piece-alternatives__item">' +
        '<div class="pb-piece-alternatives__body">' +
          '<strong>' + escapeHtml(candidate.title || '(untitled piece)') + '</strong>' +
          '<span class="pb-piece-alternatives__meta">' + escapeHtml(meta.filter(Boolean).join(' · ')) + '</span>' +
          (badges.length ? '<div class="item-badges">' + badges.join('') + '</div>' : '') +
        '</div>' +
        '<button type="button" data-pb-replace-candidate="' + escapeAttr(candidate.id) + '">Use this</button>' +
      '</div>';
    }).join('');
    wrap.querySelectorAll('[data-pb-replace-candidate]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        replaceCurrentBlueprintPiece(btn.getAttribute('data-pb-replace-candidate'));
      });
    });
    return alternatives;
  }
  function renderBlueprintPieceEditor() {
    var bp = currentBlueprint();
    var item = bp.items[state.blueprintPieceIndex] || {};
    var piece = getPlannerItemById(item.pieceId);
    var hasSelection = !!piece;
    if ($('pb-piece-customTitle')) {
      $('pb-piece-customTitle').value = safeString(item.customTitle);
      $('pb-piece-customTitle').disabled = !hasSelection;
    }
    if ($('pb-piece-customDuration')) {
      $('pb-piece-customDuration').value = item.customDuration || '';
      $('pb-piece-customDuration').disabled = !hasSelection;
    }
    if ($('pb-piece-notes')) {
      $('pb-piece-notes').value = safeString(item.notes);
      $('pb-piece-notes').disabled = !hasSelection;
    }
    if ($('pb-piece-remove')) $('pb-piece-remove').disabled = !hasSelection;
    if ($('pb-piece-up')) $('pb-piece-up').disabled = !hasSelection || state.blueprintPieceIndex <= 0;
    if ($('pb-piece-down')) $('pb-piece-down').disabled = !hasSelection || state.blueprintPieceIndex >= ((bp.items || []).length - 1);
    var compat = $('pb-piece-compatibility');
    if (compat) {
      if (!hasSelection) {
        compat.className = 'muted';
        compat.textContent = 'Fit note: Select a repertoire line to adjust it here.';
        renderBlueprintPieceAlternatives(bp, state.blueprintPieceIndex);
        return;
      }
      var fit = plannerPieceFitSummary(piece, bp.family, bp.formation);
      compat.className = 'muted ' + fit.className;
      var slotText = (bp.buildMode === 'dramatic_arc' && safeString(item.slotId).trim()) ? (' Assigned to ' + (dramaticArcSlotLabel(item.slotId, bp.targetDuration) || item.slotId) + '.') : '';
      compat.textContent = 'Fit note: ' + fit.text + slotText;
    }
    renderBlueprintPieceAlternatives(bp, state.blueprintPieceIndex);
  }
  function renderBlueprintFeeEstimate() {
    var bp = currentBlueprint();
    var computed = computeBlueprintFeeEstimate(bp);
    var fee = computed.fee;
    var adjustment = feeEstimateEventMultipliers(fee.eventType);
    if ($('pb-fee-preset')) $('pb-fee-preset').value = safeString(fee.preset || 'berlin_local');
    if ($('pb-fee-eventType')) $('pb-fee-eventType').value = safeString(fee.eventType || 'cultural');
    if ($('pb-fee-durationMin')) $('pb-fee-durationMin').value = fee.durationMin || '';
    if ($('pb-fee-formation')) $('pb-fee-formation').value = safeString(fee.formation);
    if ($('pb-fee-numberOfArtists')) $('pb-fee-numberOfArtists').value = fee.numberOfArtists || 1;
    if ($('pb-fee-includesPianist')) $('pb-fee-includesPianist').checked = !!fee.includesPianist;
    if ($('pb-fee-rehearsalCount')) $('pb-fee-rehearsalCount').value = fee.rehearsalCount || 0;
    if ($('pb-fee-rehearsalFeePerArtist')) $('pb-fee-rehearsalFeePerArtist').value = fee.rehearsalFeePerArtist || 0;
    if ($('pb-fee-leadArtistFee')) $('pb-fee-leadArtistFee').value = fee.leadArtistFee || 0;
    if ($('pb-fee-collaboratorFee')) $('pb-fee-collaboratorFee').value = fee.collaboratorFee || 0;
    if ($('pb-fee-pianistFee')) $('pb-fee-pianistFee').value = fee.pianistFee || 0;
    if ($('pb-fee-travelCost')) $('pb-fee-travelCost').value = fee.travelCost || 0;
    if ($('pb-fee-hotelCost')) $('pb-fee-hotelCost').value = fee.hotelCost || 0;
    if ($('pb-fee-localTransportCost')) $('pb-fee-localTransportCost').value = fee.localTransportCost || 0;
    if ($('pb-fee-adminBuffer')) $('pb-fee-adminBuffer').value = fee.adminBuffer || 0;
    if ($('pb-fee-lowBudgetOverride')) $('pb-fee-lowBudgetOverride').value = fee.lowBudgetOverride || '';
    if ($('pb-fee-recommendedOverride')) $('pb-fee-recommendedOverride').value = fee.recommendedOverride || '';
    if ($('pb-fee-benchmarkOverride')) $('pb-fee-benchmarkOverride').value = fee.benchmarkOverride || '';
    if ($('pb-fee-premiumOverride')) $('pb-fee-premiumOverride').value = fee.premiumOverride || '';
    if ($('pb-fee-benchmarkSourceVersion')) $('pb-fee-benchmarkSourceVersion').value = safeString(fee.benchmarkSourceVersion);
    if ($('pb-fee-benchmarkLastReviewed')) $('pb-fee-benchmarkLastReviewed').value = safeString(fee.benchmarkLastReviewed);
    if ($('pb-fee-notes')) $('pb-fee-notes').value = safeString(fee.notes);
    if ($('pb-fee-artisticSubtotal')) $('pb-fee-artisticSubtotal').textContent = formatEuroAmount(computed.artisticSubtotal);
    if ($('pb-fee-logisticsSubtotal')) $('pb-fee-logisticsSubtotal').textContent = formatEuroAmount(computed.logisticsSubtotal);
    if ($('pb-fee-lowBudgetQuote')) $('pb-fee-lowBudgetQuote').textContent = formatEuroAmount(computed.lowBudget);
    if ($('pb-fee-recommendedQuote')) $('pb-fee-recommendedQuote').textContent = formatEuroAmount(computed.recommended);
    if ($('pb-fee-publicBenchmarkQuote')) $('pb-fee-publicBenchmarkQuote').textContent = formatEuroAmount(computed.benchmark);
    if ($('pb-fee-premiumQuote')) $('pb-fee-premiumQuote').textContent = formatEuroAmount(computed.premium);
    if ($('pb-fee-eventtype-help')) $('pb-fee-eventtype-help').textContent = adjustment.label + ': low-budget reality stays close to the real floor, while fair, benchmark, and premium layers are positioned at x' + adjustment.fairMultiplier.toFixed(2) + ', x' + adjustment.benchmarkMultiplier.toFixed(2) + ', and x' + adjustment.premiumMultiplier.toFixed(2) + ' respectively.';
    if ($('pb-fee-adjustment-breakdown')) $('pb-fee-adjustment-breakdown').textContent = computed.adjustmentLine;
    if ($('pb-fee-logic')) $('pb-fee-logic').value = computed.logicSummary;
    if ($('pb-fee-negotiation')) $('pb-fee-negotiation').value = computed.negotiationNotes;
    if ($('pb-fee-summary-output')) $('pb-fee-summary-output').value = computed.summaryText;
    if ($('pb-fee-email-output')) $('pb-fee-email-output').value = computed.emailText;
  }
  function persistBlueprintFeeEstimate() {
    var bp = currentBlueprint();
    bp.feeEstimate = safeBlueprintFeeEstimate({
      preset: $('pb-fee-preset') && $('pb-fee-preset').value,
      eventType: $('pb-fee-eventType') && $('pb-fee-eventType').value,
      durationMin: $('pb-fee-durationMin') && $('pb-fee-durationMin').value,
      formation: $('pb-fee-formation') && $('pb-fee-formation').value,
      numberOfArtists: $('pb-fee-numberOfArtists') && $('pb-fee-numberOfArtists').value,
      includesPianist: !!($('pb-fee-includesPianist') && $('pb-fee-includesPianist').checked),
      rehearsalCount: $('pb-fee-rehearsalCount') && $('pb-fee-rehearsalCount').value,
      rehearsalFeePerArtist: $('pb-fee-rehearsalFeePerArtist') && $('pb-fee-rehearsalFeePerArtist').value,
      leadArtistFee: $('pb-fee-leadArtistFee') && $('pb-fee-leadArtistFee').value,
      collaboratorFee: $('pb-fee-collaboratorFee') && $('pb-fee-collaboratorFee').value,
      pianistFee: $('pb-fee-pianistFee') && $('pb-fee-pianistFee').value,
      travelCost: $('pb-fee-travelCost') && $('pb-fee-travelCost').value,
      hotelCost: $('pb-fee-hotelCost') && $('pb-fee-hotelCost').value,
      localTransportCost: $('pb-fee-localTransportCost') && $('pb-fee-localTransportCost').value,
      adminBuffer: $('pb-fee-adminBuffer') && $('pb-fee-adminBuffer').value,
      lowBudgetOverride: $('pb-fee-lowBudgetOverride') && $('pb-fee-lowBudgetOverride').value,
      recommendedOverride: $('pb-fee-recommendedOverride') && $('pb-fee-recommendedOverride').value,
      benchmarkOverride: $('pb-fee-benchmarkOverride') && $('pb-fee-benchmarkOverride').value,
      premiumOverride: $('pb-fee-premiumOverride') && $('pb-fee-premiumOverride').value,
      benchmarkSourceVersion: $('pb-fee-benchmarkSourceVersion') && $('pb-fee-benchmarkSourceVersion').value,
      benchmarkLastReviewed: $('pb-fee-benchmarkLastReviewed') && $('pb-fee-benchmarkLastReviewed').value,
      notes: $('pb-fee-notes') && $('pb-fee-notes').value
    }, bp);
    renderBlueprintFeeEstimate();
    markDirty(true, 'Fee estimate updated');
  }
  function generateBlueprintOutputs() {
    var bp = currentBlueprint();
    var model = buildProgramOfferPreviewModel();
    var copy = model.copy;
    var pieceLines = model.pieces.map(function (piece, idx) {
      return (idx + 1) + '. ' + piece.title + (programOfferPieceMeta(piece) ? ' — ' + programOfferPieceMeta(piece) : '');
    });
    var highlightLines = model.pieces.slice(0, 5).map(function (piece) { return '• ' + piece.title; });
    var offerDuration = String(Math.max(0, Number(model.targetDuration) || 0)) + ' min';
    var internalText = [
      'Programme offer',
      model.title,
      safeString(bp.versionLabel).trim() ? ('Version: ' + safeString(bp.versionLabel).trim()) : '',
      copy.formationLabel + ': ' + safeString(model.formation),
      copy.durationLabel + ': ' + offerDuration,
      copy.focusLabel + ': ' + model.familyLabel,
      '',
      model.description,
      '',
      model.repertoireHeading + ':',
      pieceLines.length ? pieceLines.join('\n') : copy.noPieces,
      '',
      copy.flexibilityLabel + ':',
      model.flexibleNote,
      safeString(bp.internalNotes).trim() ? ('\nPrivate notes:\n' + safeString(bp.internalNotes).trim()) : ''
    ].filter(Boolean).join('\n');
    var emailBlocks = [
      copy.emailLead,
      model.title + '\n' + offerDuration + ' · ' + safeString(model.formation),
      model.description
    ];
    if (highlightLines.length) emailBlocks.push(model.repertoireHeading + ':\n' + highlightLines.join('\n'));
    emailBlocks.push(model.flexibleNote);
    if (model.contact.webUrl || model.contact.email) {
      emailBlocks.push([
        model.contact.webUrl ? (copy.websiteLabel + ': ' + model.contact.webUrl) : '',
        model.contact.email ? (copy.emailLabel + ': ' + model.contact.email) : ''
      ].filter(Boolean).join('\n'));
    }
    emailBlocks.push(copy.emailCloser + '\nRolando Guy');
    var emailText = emailBlocks.filter(Boolean).join('\n\n');
    var publicText = [
      model.title,
      model.description,
      pieceLines.length ? (model.repertoireHeading + ':\n' + highlightLines.join('\n')) : copy.noPieces,
      copy.approximateDurationLabel + ': ' + offerDuration,
      model.flexibleNote
    ].filter(Boolean).join('\n\n');
    if ($('pb-output-internal')) $('pb-output-internal').value = internalText;
    if ($('pb-output-email')) $('pb-output-email').value = emailText;
    if ($('pb-output-public')) $('pb-output-public').value = publicText;
  }
  function programBuilderContactForLang(lang) {
    var key = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var stored = loadDoc('contact_' + key, null);
    var fallbackStored = key !== 'en' ? loadDoc('contact_en', null) : null;
    var fallback = getLegacySection('contact');
    var email = safeString((stored && stored.email) || (fallbackStored && fallbackStored.email) || (fallback && fallback.email)).trim();
    var phone = safeString((stored && stored.phone) || (fallbackStored && fallbackStored.phone) || (fallback && fallback.phone)).trim();
    var webUrl = safeString((stored && stored.webUrl) || (fallbackStored && fallbackStored.webUrl) || '').trim();
    var webBtn = safeString((stored && stored.webBtn) || (fallbackStored && fallbackStored.webBtn) || (fallback && fallback.webBtn)).trim();
    if (!webUrl && isValidHttpUrl(webBtn)) webUrl = webBtn;
    if (!webUrl) webUrl = 'https://rolandoguy.com';
    return { email: email, phone: phone, webUrl: webUrl };
  }
  function programBuilderPortraitForLang(lang) {
    var key = safeString(lang || 'en').trim().toLowerCase() || 'en';
    var docs = [
      loadDoc('bio_' + key, null),
      key !== 'de' ? loadDoc('bio_de', null) : null,
      key !== 'en' ? loadDoc('bio_en', null) : null,
      getLegacySection('bio', key)
    ];
    for (var i = 0; i < docs.length; i += 1) {
      var src = safeString(docs[i] && docs[i].portraitImage).trim();
      if (src) return src;
    }
    return '';
  }
  function buildProgramOfferPreviewModel() {
    var bp = currentBlueprint();
    var lang = safeString(bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
    var copy = plannerOutputCopy(lang);
    var contact = programBuilderContactForLang(lang);
    var contactPhoneOverride = safeString(bp.contactPhoneOverride).trim();
    if (contactPhoneOverride) contact.phone = contactPhoneOverride;
    var portraitUrl = resolveProgramOfferHeaderImage(bp, lang);
    var publicDefault = publicProgramDefaultForFamily(lang, bp.family);
    var pieces = (bp.items || []).map(function (it) {
      var piece = getPlannerItemById(it.pieceId);
      if (!piece) return null;
      var title = safeString(it.customTitle).trim() || piece.title;
      var duration = Math.max(0, Number(it.customDuration) || plannerEffectiveDuration(piece) || 0);
      return {
        title: title,
        composer: piece.composer,
        work: piece.work,
        duration: duration
      };
    }).filter(Boolean);
    var encores = (bp.encoreItems || []).map(function (it) {
      var piece = getPlannerItemById(it.pieceId);
      if (!piece) return null;
      var title = safeString(it.customTitle).trim() || piece.title;
      var duration = Math.max(0, Number(it.customDuration) || plannerEffectiveDuration(piece) || 0);
      return {
        title: title,
        composer: piece.composer,
        work: piece.work,
        duration: duration,
        note: safeString(it.note)
      };
    }).filter(Boolean);
    return {
      lang: lang,
      copy: copy,
      title: resolveProgramOfferField(bp, 'title', lang) || safeString(publicDefault && publicDefault.title).trim() || defaultBlueprintTitle(bp.family, bp.targetDuration, lang),
      familyLabel: plannerFamilyLabelForLang(bp.family, lang),
      repertoireHeading: programOfferRepertoireHeading(copy, bp.repertoireMode),
      description: resolveProgramOfferField(bp, 'description', lang) || safeString(publicDefault && publicDefault.description).trim() || defaultBlueprintDescription(bp.family, lang),
      flexibleNote: resolveProgramOfferField(bp, 'flexibleNote', lang) || defaultBlueprintFlexibleNote(lang),
      formation: programOfferLocalizedFormation(bp.formation, lang),
      targetDuration: bp.targetDuration,
      totalDuration: bp.totalDuration,
      encoreTotalDuration: bp.encoreTotalDuration,
      combinedDuration: bp.combinedDuration,
      statusLabel: plannerStatusLabel(bp.status, lang),
      pieces: pieces,
      encores: encores,
      includeEncoresInExport: bp.includeEncoresInExport === true,
      contact: contact,
      portraitUrl: portraitUrl
    };
  }
  function programOfferPieceMeta(piece) {
    return [safeString(piece && piece.composer), safeString(piece && piece.work)].filter(Boolean).join(' · ');
  }
  function programOfferPieceListHtml(model, mode) {
    var usePrint = mode === 'print';
    if (!model.pieces.length) return '<p class="' + (usePrint ? 'pb-print-sheet__empty' : 'pb-preview-sheet__empty') + '">' + escapeHtml(model.copy.noPieces) + '</p>';
    return '<ol class="' + (usePrint ? 'pb-print-sheet__list' : 'pb-preview-sheet__list') + '">' + model.pieces.map(function (piece) {
      var meta = programOfferPieceMeta(piece);
      return '<li>' +
        '<span class="' + (usePrint ? 'pb-print-sheet__piece-title' : 'pb-preview-sheet__piece-title') + '">' + escapeHtml(piece.title) + '</span>' +
        (meta ? '<span class="' + (usePrint ? 'pb-print-sheet__piece-meta' : 'pb-preview-sheet__piece-meta') + '">' + escapeHtml(meta) + '</span>' : '') +
      '</li>';
    }).join('') + '</ol>';
  }
  function programOfferEncoreListHtml(model, mode) {
    var usePrint = mode === 'print';
    if (!model.includeEncoresInExport || !model.encores.length) return '';
    return '<ol class="' + (usePrint ? 'pb-print-sheet__list' : 'pb-preview-sheet__list') + '">' + model.encores.map(function (piece) {
      var meta = programOfferPieceMeta(piece);
      var note = safeString(piece.note).trim();
      return '<li>' +
        '<span class="' + (usePrint ? 'pb-print-sheet__piece-title' : 'pb-preview-sheet__piece-title') + '">' + escapeHtml(piece.title) + '</span>' +
        (meta ? '<span class="' + (usePrint ? 'pb-print-sheet__piece-meta' : 'pb-preview-sheet__piece-meta') + '">' + escapeHtml(meta) + '</span>' : '') +
        (note ? '<span class="' + (usePrint ? 'pb-print-sheet__piece-meta' : 'pb-preview-sheet__piece-meta') + '">' + escapeHtml(note) + '</span>' : '') +
      '</li>';
    }).join('') + '</ol>';
  }
  function programOfferHasPlaceholderText(text) {
    var value = safeString(text).trim().toLowerCase();
    if (!value) return false;
    return [
      'wählen sie repertoirestücke',
      'select repertoire to build this programme sheet',
      'select repertoire to build this program sheet',
      'select repertoire',
      'choose piece',
      'choose repertoire',
      'please select repertoire',
      'no pieces selected'
    ].some(function (needle) { return value.indexOf(needle) >= 0; });
  }
  function programOfferExportValidation(model) {
    var bp = currentBlueprint();
    var lang = safeString(model && model.lang || bp.outputLang || 'en').trim().toLowerCase() || 'en';
    var copy = plannerOutputCopy(lang);
    var errors = [];
    var pieces = Array.isArray(model && model.pieces) ? model.pieces : [];
    if (!pieces.length) errors.push(copy.exportMissingRepertoire || copy.noPieces || 'Select at least one repertoire item before exporting this Programme Sheet.');
    if (programOfferHasPlaceholderText(model && model.description) || programOfferHasPlaceholderText(model && model.flexibleNote) || programOfferHasPlaceholderText(model && model.title)) {
      errors.push(copy.exportPlaceholderText || 'Remove placeholder text before exporting this Programme Sheet.');
    }
    if (lang !== 'en' && programOfferLooksStaleEnglish(model && model.description, 'description', bp.family, bp.targetDuration, lang)) {
      errors.push(copy.exportLanguageMismatch || 'The main programme note still reads in English. Reset it to the language default before exporting.');
    }
    if (lang !== 'en' && programOfferLooksStaleEnglish(model && model.flexibleNote, 'flexibleNote', bp.family, bp.targetDuration, lang)) {
      errors.push(copy.exportLanguageMismatch || 'The flexibility note still reads in English. Reset it to the language default before exporting.');
    }
    return { ok: !errors.length, errors: errors };
  }
  function renderProgramOfferPreviewWarning(model, errors) {
    var copy = plannerOutputCopy(model && model.lang);
    return '<div class="pb-preview-sheet__warning">' +
      '<p class="pb-preview-sheet__eyebrow">' + escapeHtml(copy.previewHeading || 'Programme Sheet') + '</p>' +
      '<h3 class="pb-preview-sheet__title">' + escapeHtml(copy.exportNotReadyTitle || 'Programme Sheet not ready') + '</h3>' +
      '<p>' + escapeHtml(copy.exportNotReadyLead || 'This offer cannot be exported yet.') + '</p>' +
      '<div class="pb-preview-sheet__warning-box">' + errors.map(function (err) { return '<p class="pb-preview-sheet__empty">' + escapeHtml(err) + '</p>'; }).join('') + '</div>' +
      '</div>';
  }
  function programOfferDetailsHtml(model, mode) {
    var usePrint = mode === 'print';
    var wrapClass = usePrint ? 'pb-print-sheet__details' : 'pb-preview-sheet__details';
    var rowClass = usePrint ? 'pb-print-sheet__detail' : 'pb-preview-sheet__detail';
    var rows = [
      model.formation ? { label: model.copy.formationLabel, value: model.formation } : null,
      { label: model.copy.durationLabel, value: String(Math.max(0, Number(model.targetDuration) || 0)) + ' min' },
      !usePrint ? { label: model.copy.currentSelectedTotalLabel, value: String(model.totalDuration || 0) + ' min' } : null,
      (!usePrint && model.includeEncoresInExport && model.encores.length) ? { label: model.copy.encoreOptionsLabel, value: String(model.encoreTotalDuration || 0) + ' min' } : null,
      { label: model.copy.focusLabel, value: model.familyLabel }
    ].filter(Boolean);
    return '<div class="' + wrapClass + '">' + rows.map(function (row) {
      return '<div class="' + rowClass + '"><strong>' + escapeHtml(row.label) + '</strong><span>' + escapeHtml(row.value) + '</span></div>';
    }).join('') + '</div>';
  }
  function renderProgramOfferPreview() {
    var box = $('pb-preview-sheet');
    if (!box) return;
    var model = buildProgramOfferPreviewModel();
    var validation = programOfferExportValidation(model);
    if ($('pb-export-pdf')) $('pb-export-pdf').disabled = !validation.ok;
    if (!validation.ok) {
      box.innerHTML = renderProgramOfferPreviewWarning(model, validation.errors);
      setProgramOfferExportHint(validation.errors[0] || 'Programme Sheet not ready.', 'err');
      return;
    }
    var details = programOfferDetailsHtml(model, 'preview');
    var listHtml = programOfferPieceListHtml(model, 'preview');
    var encoreHtml = programOfferEncoreListHtml(model, 'preview');
    var contactBits = [];
    if (model.contact.email) contactBits.push('<span><strong>' + escapeHtml(model.copy.emailLabel) + ':</strong> ' + escapeHtml(model.contact.email) + '</span>');
    if (model.contact.phone) contactBits.push('<span><strong>' + escapeHtml(model.copy.phoneLabel) + ':</strong> ' + escapeHtml(model.contact.phone) + '</span>');
    if (model.contact.webUrl) contactBits.push('<a href="' + escapeAttr(model.contact.webUrl) + '" target="_blank" rel="noopener"><strong>' + escapeHtml(model.copy.websiteLabel) + ':</strong> ' + escapeHtml(model.contact.webUrl) + '</a>');
    box.innerHTML =
      '<div class="pb-preview-sheet__header">' +
        '<div class="pb-preview-sheet__identity">' +
          '<div class="pb-preview-sheet__rule" aria-hidden="true"></div>' +
          '<div>' +
            '<h4 class="pb-preview-sheet__artist">Rolando Guy</h4>' +
            '<p class="pb-preview-sheet__subtitle">' + escapeHtml(model.copy.artistSubtitle) + '</p>' +
          '</div>' +
        '</div>' +
        (model.portraitUrl ? '<img class="pb-preview-sheet__portrait" src="' + escapeAttr(model.portraitUrl) + '" alt="Programme header image">' : '') +
      '</div>' +
      '<div class="pb-preview-sheet__divider"></div>' +
      '<div class="pb-preview-sheet__body">' +
        '<p class="pb-preview-sheet__eyebrow">' + escapeHtml(model.copy.previewHeading) + '</p>' +
        '<h3 class="pb-preview-sheet__title">' + escapeHtml(model.title) + '</h3>' +
        '<p>' + escapeHtml(model.description) + '</p>' +
        details +
      '</div>' +
      '<div class="pb-preview-sheet__section">' +
        '<p class="pb-preview-sheet__section-title">' + escapeHtml(model.repertoireHeading) + '</p>' +
        listHtml +
      '</div>' +
      (encoreHtml ? ('<div class="pb-preview-sheet__section"><p class="pb-preview-sheet__section-title">' + escapeHtml(model.copy.encoreOptionsLabel) + '</p>' + encoreHtml + '</div>') : '') +
      '<div class="pb-preview-sheet__footer">' +
        '<div><p class="pb-preview-sheet__section-title">' + escapeHtml(model.copy.flexibilityLabel) + '</p><p>' + escapeHtml(model.flexibleNote) + '</p></div>' +
        '<div class="pb-preview-sheet__contact"><p class="pb-preview-sheet__section-title">' + escapeHtml(model.copy.contactLabel) + '</p>' + contactBits.join('') + '</div>' +
      '</div>';
    setProgramOfferExportHint('', '');
  }
  function setProgramOfferExportHint(text, kind) {
    var el = $('pb-export-hint');
    if (!el) return;
    el.textContent = safeString(text);
    el.className = 'muted pb-export-hint' + (kind ? (' ' + kind) : '');
  }
  function renderProgramOfferPrintSheet(model) {
    var root = $('pb-print-sheet');
    if (!root) return;
    var details = programOfferDetailsHtml(model, 'print');
    var listHtml = programOfferPieceListHtml(model, 'print');
    var encoreHtml = programOfferEncoreListHtml(model, 'print');
    var contactBits = [];
    if (model.contact.email) contactBits.push('<span>' + escapeHtml(model.copy.emailLabel) + ': ' + escapeHtml(model.contact.email) + '</span>');
    if (model.contact.phone) contactBits.push('<span>' + escapeHtml(model.copy.phoneLabel) + ': ' + escapeHtml(model.contact.phone) + '</span>');
    if (model.contact.webUrl) contactBits.push('<a href="' + escapeAttr(model.contact.webUrl) + '" target="_blank" rel="noopener">' + escapeHtml(model.copy.websiteLabel) + ': ' + escapeHtml(model.contact.webUrl) + '</a>');
    root.innerHTML =
      '<div class="pb-print-sheet__page">' +
        '<div class="pb-print-sheet__header">' +
          '<div class="pb-print-sheet__identity">' +
            '<div class="pb-print-sheet__rule" aria-hidden="true"></div>' +
            '<div>' +
              '<h1 class="pb-print-sheet__artist">Rolando Guy</h1>' +
              '<p class="pb-print-sheet__subtitle">' + escapeHtml(model.copy.artistSubtitle) + '</p>' +
            '</div>' +
          '</div>' +
          (model.portraitUrl ? '<img class="pb-print-sheet__portrait" src="' + escapeAttr(model.portraitUrl) + '" alt="Programme header image">' : '') +
        '</div>' +
        '<div class="pb-print-sheet__divider"></div>' +
        '<div class="pb-print-sheet__body">' +
          '<h2 class="pb-print-sheet__title">' + escapeHtml(model.title) + '</h2>' +
          '<p>' + escapeHtml(model.description) + '</p>' +
          details +
        '</div>' +
        '<div class="pb-print-sheet__section">' +
          '<p class="pb-print-sheet__section-title">' + escapeHtml(model.repertoireHeading) + '</p>' +
          listHtml +
        '</div>' +
        (encoreHtml ? ('<div class="pb-print-sheet__section"><p class="pb-print-sheet__section-title">' + escapeHtml(model.copy.encoreOptionsLabel) + '</p>' + encoreHtml + '</div>') : '') +
        '<div class="pb-print-sheet__footer">' +
          '<p class="pb-print-sheet__section-title">' + escapeHtml(model.copy.flexibilityLabel) + '</p>' +
          '<p>' + escapeHtml(model.flexibleNote) + '</p>' +
          '<div class="pb-print-sheet__contact">' +
            '<p class="pb-print-sheet__section-title">' + escapeHtml(model.copy.contactLabel) + '</p>' +
            contactBits.join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }
  function closeProgramOfferPrintView() {
    var view = $('pb-print-view');
    if (view) view.hidden = true;
    document.body.classList.remove('programme-print-active');
  }
  function ensureProgramOfferPrintPortal() {
    var view = $('pb-print-view');
    if (!view) return null;
    if (view.parentNode !== document.body) {
      document.body.appendChild(view);
    }
    return view;
  }
  function waitForProgramOfferPrintAssets(root) {
    var waits = [];
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      waits.push(Promise.race([
        document.fonts.ready.catch(function () {}),
        new Promise(function (resolve) { setTimeout(resolve, 900); })
      ]));
    }
    Array.prototype.forEach.call(root.querySelectorAll('img'), function (img) {
      waits.push(new Promise(function (resolve) {
        if (img.complete && img.naturalWidth) return resolve();
        var done = function () { resolve(); };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 900);
      }));
    });
    return Promise.all(waits);
  }
  function triggerProgramOfferPrintDialog() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        try {
          window.print();
          setStatus('Programme Sheet ready. If Safari does not open the print dialog, use Cmd+P.', 'warn');
          setProgramOfferExportHint('Programme Sheet ready. If the print dialog does not open automatically, use File > Print or press Cmd+P.', 'warn');
        } catch (err) {
          setStatus('Programme Sheet ready. Use Cmd+P to save as PDF.', 'warn');
          setProgramOfferExportHint('Programme Sheet ready. Use File > Print or press Cmd+P to save it as PDF.', 'warn');
        }
      });
    });
  }
  function exportProgramOfferPdf() {
    var model = buildProgramOfferPreviewModel();
    var validation = programOfferExportValidation(model);
    if (!validation.ok) {
      setStatus(validation.errors[0] || 'Programme Sheet is not ready for export.', 'err');
      setProgramOfferExportHint(validation.errors[0] || 'Programme Sheet is not ready for export.', 'err');
      renderProgramOfferPreview();
      return;
    }
    var view = ensureProgramOfferPrintPortal();
    var root = $('pb-print-sheet');
    if (!view || !root) {
      setStatus('Could not prepare Programme Sheet print view.', 'err');
      setProgramOfferExportHint('Could not prepare the Programme Sheet print view.', 'err');
      return;
    }
    renderProgramOfferPrintSheet(model);
    view.hidden = false;
    document.body.classList.add('programme-print-active');
    setProgramOfferExportHint('Preparing Programme Sheet print view…', 'warn');
    if (!state.programmePrintLifecycleBound) {
      state.programmePrintLifecycleBound = true;
      window.addEventListener('afterprint', function () {
        if (document.body.classList.contains('programme-print-active')) closeProgramOfferPrintView();
      });
    }
    waitForProgramOfferPrintAssets(root).then(function () {
      setTimeout(triggerProgramOfferPrintDialog, 120);
    });
  }
  function programOfferFeeStatusLabel(status) {
    var key = safeString(status || '').trim().toLowerCase();
    if (key === 'active') return 'Active';
    if (key === 'draft') return 'Draft';
    if (key === 'sent') return 'Sent';
    if (key === 'won') return 'Won';
    if (key === 'lost') return 'Lost';
    if (key === 'archived') return 'Archived';
    return key || 'Draft';
  }
  function buildProgramOfferFeeReportContext() {
    state.blueprintDoc = safeBlueprintsDoc(state.blueprintDoc);
    var bp = currentBlueprint();
    recomputeBlueprint(bp);
    var active = activeSavedOfferForMainActions();
    var activeId = safeString(active && active.id).trim();
    var fee = computeBlueprintFeeEstimate(bp);
    var offers = Array.isArray(state.blueprintDoc.savedOffers) ? state.blueprintDoc.savedOffers : [];
    var comparable = offers
      .map(function (offer, idx) { return safeSavedOfferRecord(offer, idx); })
      .filter(function (offer) {
        if (safeString(offer.status).trim().toLowerCase() === 'archived') return false;
        return safeString(offer.family).trim().toLowerCase() === safeString(bp.family).trim().toLowerCase() && Number(offer.targetDuration) === Number(bp.targetDuration);
      })
      .slice(0, 40)
      .map(function (offer) {
        var key = safeString(offer.family).trim().toLowerCase() + '_' + String(offer.targetDuration || 30);
        var normalized = normalizeBlueprintRecord(offer, key);
        var computed = computeBlueprintFeeEstimate(normalized);
        return {
          id: safeString(offer.id),
          isActive: activeId && safeString(offer.id).trim() === activeId,
          label: savedOfferDisplayLabel(offer),
          type: savedProgrammeTypeLabel(offer.saveType),
          status: programOfferFeeStatusLabel(offer.status),
          lang: safeString(offer.outputLang).trim().toUpperCase() || 'EN',
          duration: Number(offer.targetDuration) || Number(bp.targetDuration) || 0,
          formation: safeString(offer.formation || normalized.formation).trim() || '—',
          lowBudget: computed.lowBudget,
          recommended: computed.recommended,
          benchmark: computed.benchmark,
          premium: computed.premium,
          updatedAt: formatProgrammeOfferTimestamp(offer.updatedAt || offer.lastSavedAt || offer.createdAt)
        };
      });
    return {
      generatedAt: new Date(),
      blueprint: bp,
      fee: fee,
      active: active,
      comparable: comparable
    };
  }
  function programOfferFeeReportHtml(ctx) {
    var bp = ctx.blueprint || {};
    var fee = ctx.fee || {};
    var active = ctx.active || null;
    var activeLabel = active ? savedOfferDisplayLabel(active) : 'Working draft';
    var hasMeaningful = (Array.isArray(bp.items) && bp.items.length > 0) || !!active || !!ctx.comparable.length;
    var tableHtml = '';
    if (!ctx.comparable.length) {
      tableHtml = '<div class="empty">No comparable saved offers for this family and duration yet. Save a Master Programme or Venue Offer to build comparisons.</div>';
    } else {
      tableHtml = '<table><thead><tr>' +
        '<th>Offer</th><th>Type</th><th>Status</th><th>Lang</th><th>Duration</th><th>Formation</th><th>Low</th><th>Fair</th><th>Funded</th><th>Target</th><th>Updated</th>' +
      '</tr></thead><tbody>' + ctx.comparable.map(function (row) {
        return '<tr' + (row.isActive ? ' class="is-active"' : '') + '>' +
          '<td><strong>' + escapeHtml(row.label || '(untitled)') + '</strong>' + (row.isActive ? ' <span class="tag">active</span>' : '') + '</td>' +
          '<td>' + escapeHtml(row.type) + '</td>' +
          '<td>' + escapeHtml(row.status) + '</td>' +
          '<td>' + escapeHtml(row.lang) + '</td>' +
          '<td>' + escapeHtml(String(row.duration) + ' min') + '</td>' +
          '<td>' + escapeHtml(row.formation || '—') + '</td>' +
          '<td>' + escapeHtml(formatEuroAmount(row.lowBudget)) + '</td>' +
          '<td>' + escapeHtml(formatEuroAmount(row.recommended)) + '</td>' +
          '<td>' + escapeHtml(formatEuroAmount(row.benchmark)) + '</td>' +
          '<td>' + escapeHtml(formatEuroAmount(row.premium)) + '</td>' +
          '<td>' + escapeHtml(row.updatedAt || '—') + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }
    var emptyState = hasMeaningful ? '' : '<div class="empty">No meaningful Programme Offer / Fee Estimate data is available yet for this context.</div>';
    return '<!doctype html><html><head><meta charset="utf-8"><title>Programme Offers / Fee Estimate Report</title>' +
      '<style>' +
      'body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;padding:24px;color:#1c2430;background:#fff}' +
      '.wrap{max-width:1160px;margin:0 auto}' +
      'h1{font-size:22px;margin:0 0 8px}' +
      '.meta{font-size:13px;color:#586273;margin:2px 0}' +
      '.summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0 16px}' +
      '.card{border:1px solid #d7dde8;border-radius:10px;padding:10px 12px}' +
      '.card span{display:block;color:#5c677a;font-size:12px}' +
      '.card strong{display:block;margin-top:4px;font-size:15px;color:#1c2430}' +
      '.logic{border:1px solid #d7dde8;border-radius:10px;padding:10px 12px;margin:0 0 14px;font-size:12px;line-height:1.45;background:#f8fafe}' +
      'table{width:100%;border-collapse:collapse;font-size:12px}' +
      'th,td{border:1px solid #d7dde8;padding:7px 8px;vertical-align:top;text-align:left}' +
      'th{background:#f4f7fb;font-weight:600}' +
      'tr.is-active{background:#eef5ff}' +
      '.tag{display:inline-block;border:1px solid #9bb6df;border-radius:999px;padding:1px 6px;font-size:10px;color:#2f4d77}' +
      '.empty{border:1px dashed #c7cfdd;border-radius:10px;padding:14px;color:#5c677a;background:#f8fafe}' +
      '@media print{body{padding:12px}.summary{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
      '</style></head><body><div class="wrap">' +
      '<h1>Programme Offers / Fee Estimate Report</h1>' +
      '<p class="meta"><strong>Reporting context:</strong> ' + escapeHtml(activeLabel) + ' · ' + escapeHtml(plannerFamilyLabelForLang(bp.family, bp.outputLang || state.lang || 'en')) + ' · ' + escapeHtml(String(bp.targetDuration || 0) + ' min') + ' · ' + escapeHtml(safeString(bp.outputLang || state.lang || 'en').toUpperCase()) + '</p>' +
      '<p class="meta"><strong>Generated:</strong> ' + escapeHtml(ctx.generatedAt.toLocaleString()) + '</p>' +
      '<div class="summary">' +
        '<div class="card"><span>Compared offers</span><strong>' + escapeHtml(String(ctx.comparable.length)) + '</strong></div>' +
        '<div class="card"><span>Low-budget reality</span><strong>' + escapeHtml(formatEuroAmount(fee.lowBudget || 0)) + '</strong></div>' +
        '<div class="card"><span>Fair quote</span><strong>' + escapeHtml(formatEuroAmount(fee.recommended || 0)) + '</strong></div>' +
        '<div class="card"><span>Funded / target quote</span><strong>' + escapeHtml(formatEuroAmount(fee.benchmark || 0)) + ' / ' + escapeHtml(formatEuroAmount(fee.premium || 0)) + '</strong></div>' +
      '</div>' +
      '<div class="logic"><strong>Active offer details</strong><br>' +
        escapeHtml('Title: ' + (safeString(bp.title).trim() || defaultBlueprintTitle(bp.family, bp.targetDuration, bp.outputLang))) + '<br>' +
        escapeHtml('Formation: ' + safeString((fee.fee && fee.fee.formation) || bp.formation || '—')) + '<br>' +
        escapeHtml('Duration: ' + String((fee.fee && fee.fee.durationMin) || bp.targetDuration || 0) + ' min') + '<br>' +
        escapeHtml('Preset: ' + safeString((fee.fee && fee.fee.preset) || '—')) + '<br>' +
        escapeHtml('Event type: ' + safeString((fee.fee && fee.fee.eventType) || '—')) + '<br>' +
        escapeHtml('Logic: ' + safeString(fee.adjustmentLine || fee.logicSummary || '—')) +
      '</div>' +
      emptyState +
      tableHtml +
      '</div></body></html>';
  }
  function exportProgramOfferFeeReportPdf() {
    var ctx = buildProgramOfferFeeReportContext();
    var popup = window.open('', '_blank', 'width=1320,height=920');
    if (!popup) {
      setStatus('Could not open Programme Offers fee report window. Check popup blocker and try again.', 'err');
      return;
    }
    popup.document.open();
    popup.document.write(programOfferFeeReportHtml(ctx));
    popup.document.close();
    var printNow = function () {
      try {
        popup.focus();
        popup.print();
        setStatus('Programme Offers fee report ready. Use Save as PDF in the print dialog.', 'warn');
      } catch (err) {
        setStatus('Programme Offers fee report opened. Use Cmd+P to save it as PDF.', 'warn');
      }
    };
    if (popup.document.readyState === 'complete') {
      setTimeout(printNow, 120);
    } else {
      popup.addEventListener('load', function () { setTimeout(printNow, 120); }, { once: true });
    }
  }
  function renderBlueprintBuilder() {
    renderQuickAddManualDefaults(false);
    renderBlueprintPieceOptions();
    renderBlueprintHeader();
    renderGalaSetupOptions();
    renderBlueprintQuickPicks();
    renderDramaticArcBuilder();
    renderBlueprintPieces();
    renderGalaHints();
    renderEncoreOptions();
    renderBlueprintFeeEstimate();
    generateBlueprintOutputs();
    renderProgramOfferPreview();
    renderOutsideRepertoireSuggestions();
    renderProgramBuilderStatus();
  }
  function syncProgramOfferEditableField(bp, field, inputValue, autoValue) {
    var modeKey = field + 'Mode';
    var autoContextKey = field + 'AutoContext';
    var value = safeString(inputValue).trim();
    if (!value || value === autoValue) {
      bp[modeKey] = 'auto';
      bp[field] = autoValue;
      bp[autoContextKey] = programOfferAutoContextKey(bp.family, bp.targetDuration, bp.outputLang);
      return;
    }
    bp[modeKey] = 'manual';
    bp[field] = value;
  }
  function syncProgramOfferFieldOnContextChange(bp, field, inputValue, oldAutoValue, newAutoValue) {
    var modeKey = field + 'Mode';
    var autoContextKey = field + 'AutoContext';
    var currentMode = normalizeProgramOfferFieldMode(bp[modeKey]);
    var value = safeString(inputValue).trim();
    var autoContext = parseProgramOfferAutoContextKey(bp[autoContextKey]);
    var previousAutoMatches = false;
    if (autoContext) {
      previousAutoMatches = value === programOfferAutoFieldValue(field, autoContext.family, autoContext.targetDuration, autoContext.lang);
    }
    if (!value || value === oldAutoValue || value === newAutoValue || currentMode !== 'manual' || programOfferValueIsKnownAuto(value, field, bp.family, bp.targetDuration) || previousAutoMatches) {
      bp[modeKey] = 'auto';
      bp[field] = newAutoValue;
      bp[autoContextKey] = programOfferAutoContextKey(bp.family, bp.targetDuration, bp.outputLang);
      return;
    }
    bp[modeKey] = 'manual';
    bp[field] = value;
  }
  function resetProgramOfferFieldToDefault(field) {
    var bp = currentBlueprint();
    var lang = safeString(bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
    var autoValue = programOfferAutoFieldValue(field, bp.family, bp.targetDuration, lang);
    bp[field + 'Mode'] = 'auto';
    bp[field] = autoValue;
    bp[field + 'AutoContext'] = programOfferAutoContextKey(bp.family, bp.targetDuration, lang);
    renderBlueprintBuilder();
    markDirty(true, 'Programme offer text reset');
    setStatus('Reset to ' + String(lang).toUpperCase() + ' language default.', 'ok');
  }
  function revertProgrammeOfferContextControls() {
    var bp = currentBlueprint();
    if ($('pb-family')) $('pb-family').value = safeString(bp.family || 'gala');
    if ($('pb-duration')) $('pb-duration').value = String(bp.targetDuration || 30);
    if ($('pb-output-lang')) $('pb-output-lang').value = safeString(bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
  }
  function canSwitchProgrammeOfferWorkingSlot(nextFamily, nextDuration) {
    var currentKey = plannerBlueprintKey();
    var nextKey = safeString(nextFamily || 'gala').trim().toLowerCase() + '_' + String(Math.max(0, Number(nextDuration) || 30));
    if (currentKey === nextKey) return true;
    return hasUnsavedChangesPrompt('Switch to a different programme working slot?');
  }
  function persistBlueprintHeader(reason) {
    reason = safeString(reason || 'manual').trim().toLowerCase() || 'manual';
    var bp = currentBlueprint();
    var prevFamily = safeString(bp.family || 'gala').trim().toLowerCase();
    var prevTarget = Math.max(0, Number(bp.targetDuration) || 30);
    var prevLang = safeString(bp.outputLang || state.blueprintOutputLang || state.lang || 'en').trim().toLowerCase() || 'en';
    var prevFormation = safeString(bp.formation || 'Tenor + Piano').trim() || 'Tenor + Piano';
    var titleInput = safeString($('pb-blueprint-title').value).trim();
    var descriptionInput = safeString($('pb-offer-description').value).trim();
    var flexibleInput = safeString($('pb-flexible-note').value).trim();
    var nextFamily = safeString($('pb-family').value || 'gala').trim().toLowerCase();
    var nextTarget = Math.max(0, Number($('pb-duration').value) || 30);
    var nextLang = safeString($('pb-output-lang').value || state.lang || 'en').trim().toLowerCase();
    var nextBuildMode = safeString($('pb-build-mode').value || 'free').trim().toLowerCase() === 'dramatic_arc' ? 'dramatic_arc' : 'free';
    bp.family = nextFamily;
    bp.targetDuration = nextTarget;
    bp.styleFocus = normalizeProgramOfferStyleFocus($('pb-style-focus') && $('pb-style-focus').value);
    bp.galaOptions = safeBlueprintGalaOptions(bp.galaOptions, nextTarget);
    if (bp.family === 'gala') {
      bp.galaOptions.preferVocalPacing = !!($('pb-gala-preferPacing') && $('pb-gala-preferPacing').checked);
      bp.galaOptions.allowPianoInterludes = !!($('pb-gala-allowPianoInterludes') && $('pb-gala-allowPianoInterludes').checked);
      bp.galaOptions.includeContrast = !!($('pb-gala-includeContrast') && $('pb-gala-includeContrast').checked);
      bp.galaOptions.buildWithGalaArc = !!($('pb-gala-buildArc') && $('pb-gala-buildArc').checked);
      bp.buildMode = bp.galaOptions.buildWithGalaArc ? 'dramatic_arc' : 'free';
    } else {
      bp.buildMode = nextBuildMode;
    }
    bp.outputLang = nextLang;
    bp.repertoireMode = normalizeProgramOfferRepertoireMode($('pb-repertoire-mode') && $('pb-repertoire-mode').value);
    bp.includeDiscoveryIdeas = !!($('pb-include-discovery-ideas') && $('pb-include-discovery-ideas').checked);
    if (LANGS.indexOf(bp.outputLang) < 0) bp.outputLang = 'en';
    bp.headerImageMode = normalizeProgramOfferHeaderImageMode($('pb-header-image-mode') && $('pb-header-image-mode').value);
    bp.headerImageUrl = safeString($('pb-header-image-url') && $('pb-header-image-url').value).trim();
    bp.contactPhoneOverride = safeString($('pb-contact-phone') && $('pb-contact-phone').value).trim();
    bp.includeEncoresInExport = !!($('pb-encore-export') && $('pb-encore-export').checked);
    var contextChanged = prevFamily !== bp.family || prevTarget !== bp.targetDuration || prevLang !== bp.outputLang;
    var oldDefaultTitle = programOfferAutoFieldValue('title', prevFamily, prevTarget, prevLang);
    var newDefaultTitle = programOfferAutoFieldValue('title', bp.family, bp.targetDuration, bp.outputLang);
    var oldDefaultDescription = programOfferAutoFieldValue('description', prevFamily, prevTarget, prevLang);
    var newDefaultDescription = programOfferAutoFieldValue('description', bp.family, bp.targetDuration, bp.outputLang);
    var oldDefaultFlexible = programOfferAutoFieldValue('flexibleNote', prevFamily, prevTarget, prevLang);
    var newDefaultFlexible = programOfferAutoFieldValue('flexibleNote', bp.family, bp.targetDuration, bp.outputLang);
    if (contextChanged || reason === 'context') {
      syncProgramOfferFieldOnContextChange(bp, 'title', titleInput, oldDefaultTitle, newDefaultTitle);
      syncProgramOfferFieldOnContextChange(bp, 'description', descriptionInput, oldDefaultDescription, newDefaultDescription);
      syncProgramOfferFieldOnContextChange(bp, 'flexibleNote', flexibleInput, oldDefaultFlexible, newDefaultFlexible);
    } else {
      syncProgramOfferEditableField(bp, 'title', titleInput, newDefaultTitle);
      syncProgramOfferEditableField(bp, 'description', descriptionInput, newDefaultDescription);
      syncProgramOfferEditableField(bp, 'flexibleNote', flexibleInput, newDefaultFlexible);
    }
    bp.formation = safeString($('pb-blueprint-formation').value).trim();
    var feeEstimate = safeBlueprintFeeEstimate(bp.feeEstimate, { targetDuration: prevTarget, formation: prevFormation });
    if (!feeEstimate.durationMin || feeEstimate.durationMin === prevTarget) feeEstimate.durationMin = bp.targetDuration;
    if (!safeString(feeEstimate.formation).trim() || safeString(feeEstimate.formation).trim() === prevFormation) feeEstimate.formation = bp.formation;
    if ((Number(feeEstimate.numberOfArtists) || 1) === inferArtistCountFromFormation(prevFormation)) feeEstimate.numberOfArtists = inferArtistCountFromFormation(bp.formation);
    if (!!feeEstimate.includesPianist === formationIncludesPianist(prevFormation)) feeEstimate.includesPianist = formationIncludesPianist(bp.formation);
    bp.feeEstimate = safeBlueprintFeeEstimate(feeEstimate, bp);
    bp.versionLabel = safeString($('pb-version-label').value).trim();
    bp.useCase = normalizeProgramOfferUseCase($('pb-offer-useCase') && $('pb-offer-useCase').value);
    bp.offerStatus = normalizeSavedProgramStatus($('pb-offer-status') && $('pb-offer-status').value, 'venue_offer');
    bp.internalNotes = safeString($('pb-blueprint-notes').value);
    state.blueprintFamily = bp.family;
    state.blueprintDuration = String(bp.targetDuration);
    state.blueprintOutputLang = bp.outputLang;
    recomputeBlueprint(bp);
    renderBlueprintBuilder();
    markDirty(true, 'Programme offer updated');
  }
  function persistBlueprintPieceEditor() {
    var bp = currentBlueprint();
    if (state.blueprintPieceIndex < 0 || state.blueprintPieceIndex >= bp.items.length) return;
    var it = bp.items[state.blueprintPieceIndex];
    it.customTitle = safeString($('pb-piece-customTitle').value);
    it.customDuration = Math.max(0, Number($('pb-piece-customDuration').value) || 0);
    it.notes = safeString($('pb-piece-notes').value);
    recomputeBlueprint(bp);
    renderBlueprintBuilder();
    markDirty(true, 'Programme repertoire updated');
  }
  function copyTextValue(id, label) {
    var el = $(id);
    var text = el ? safeString(el.value) : '';
    if (!text) return;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(function () {
        setStatus(label + ' copied', 'ok');
      }).catch(function () {
        window.prompt('Copy text:', text);
      });
    } else {
      window.prompt('Copy text:', text);
    }
  }

  function renderPerfList() {
    var box = $('perf-list');
    var filter = state.perfStatusFilter || 'all';
    var wfPerf = state.perfWorkflowFilter || 'all';
    var revenueFilter = safeString(state.perfRevenueFilter || 'all').trim().toLowerCase();
    if (revenueFilter !== 'all' && revenueFilter !== 'missing' && revenueFilter !== 'complete') revenueFilter = 'all';
    function perfListSortDate(row) {
      var s = normalizeSortDateForInput(row && row.e && row.e.sortDate);
      if (!s) return null;
      var dt = new Date(s + 'T00:00:00');
      return isNaN(dt.getTime()) ? null : dt;
    }
    function perfListDateLabel(e) {
      var dt = perfListSortDate({ e: e });
      if (dt) {
        return new Intl.DateTimeFormat(localeForLang(state.lang), { day: 'numeric', month: 'long', year: 'numeric' }).format(dt);
      }
      var day = safeString(e && e.day).trim();
      var month = safeString(e && e.month).trim();
      var fallback = [day, month].filter(Boolean).join(' ');
      return fallback || 'Date missing';
    }
    function perfRevenueSummaryLine(e) {
      var amountNum = Number(e && e.revenueAmount);
      var hasAmount = Number.isFinite(amountNum) && amountNum > 0;
      var currency = safeString(e && e.revenueCurrency || 'EUR').trim().toUpperCase() || 'EUR';
      var status = safeString(e && e.revenueStatus || 'unknown').trim().toLowerCase() || 'unknown';
      var hasStatus = status === 'confirmed' || status === 'potential';
      var statusLabel = hasStatus ? status : 'not set';
      if (hasAmount && hasStatus) {
        var amountLabel = amountNum.toLocaleString(undefined, { minimumFractionDigits: amountNum % 1 ? 2 : 0, maximumFractionDigits: 2 });
        return currency + ' ' + amountLabel + ' · ' + statusLabel;
      }
      if (hasAmount && !hasStatus) {
        var onlyAmount = amountNum.toLocaleString(undefined, { minimumFractionDigits: amountNum % 1 ? 2 : 0, maximumFractionDigits: 2 });
        return currency + ' ' + onlyAmount + ' · status not set';
      }
      if (!hasAmount && hasStatus) {
        return 'amount not set · ' + statusLabel;
      }
      return 'revenue not set';
    }
    var rows = state.perfs.map(function (e, i) { return { e: e, i: i }; }).filter(function (row) {
      if (filter === 'all') return true;
      return safeString(row.e.status || 'upcoming') === filter;
    }).filter(function (row) {
      if (wfPerf === 'all') return true;
      var b = workflowBucketPerf(row.e);
      if (wfPerf === 'ready') return perfReadyCheck(row.e).ok && safeString(row.e.status) !== 'hidden';
      return passesWorkflowFilter(b, wfPerf);
    }).filter(function (row) {
      if (revenueFilter === 'all') return true;
      var amountNum = Number(row && row.e && row.e.revenueAmount);
      var hasAmount = Number.isFinite(amountNum) && amountNum > 0;
      var revStatus = safeString(row && row.e && row.e.revenueStatus || 'unknown').trim().toLowerCase() || 'unknown';
      var hasStatus = revStatus === 'confirmed' || revStatus === 'potential';
      var complete = hasAmount && hasStatus;
      if (revenueFilter === 'complete') return complete;
      if (revenueFilter === 'missing') return !complete;
      return true;
    }).sort(function (a, b) {
      var da = perfListSortDate(a);
      var db = perfListSortDate(b);
      if (da && db) {
        var diff = da.getTime() - db.getTime();
        if (diff) return diff;
      } else if (da && !db) {
        return -1;
      } else if (!da && db) {
        return 1;
      }
      var ta = safeString(a.e.day || '') + ' ' + safeString(a.e.month || '');
      var tb = safeString(b.e.day || '') + ' ' + safeString(b.e.month || '');
      if (ta.trim() || tb.trim()) {
        var td = ta.localeCompare(tb);
        if (td) return td;
      }
      return a.i - b.i;
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay eventos. Crea uno con "+ Nuevo evento".</div>';
      state.perfIndex = -1;
      setSelectionCount('perf-selection-count', state.perfSelected);
      renderPerfEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var e = row.e;
      var i = row.i;
      var t = perfListDateLabel(e) + ' · ' + (e.title || '(untitled)');
      var revenueSummary = perfRevenueSummaryLine(e);
      var cls = i === state.perfIndex ? 'item active' : 'item';
      var activeFlag = i === state.perfIndex ? '<span class="calendar-item-active">Active</span>' : '';
      var checked = state.perfSelected[i] ? ' checked' : '';
      var st = safeString(e.editorialStatus || '');
      var badges = [];
      if (st) badges.push({ kind: 'warn', label: st });
      var revenueAmount = Number(e && e.revenueAmount);
      var hasRevenueAmount = Number.isFinite(revenueAmount) && revenueAmount > 0;
      var revenueStatus = safeString(e && e.revenueStatus || 'unknown').trim().toLowerCase();
      var hasRevenueStatus = revenueStatus === 'confirmed' || revenueStatus === 'potential';
      if (!hasRevenueAmount && !hasRevenueStatus) {
        badges.push({ kind: 'err', label: 'rev: missing amount + status' });
      } else if (!hasRevenueAmount) {
        badges.push({ kind: 'warn', label: 'rev: missing amount' });
      } else if (!hasRevenueStatus) {
        badges.push({ kind: 'warn', label: 'rev: missing status' });
      }
      var badge = badgesHtml(badges);
      return '<div class="' + cls + '" data-idx="' + i + '"><div class="item-row"><input class="row-select" data-idx="' + i + '" type="checkbox"' + checked + '><div class="item-main"><div class="calendar-item-line">' + t + activeFlag + '</div><div class="calendar-item-revenue">' + escapeHtml(revenueSummary) + '</div>' + badge + '</div></div></div>';
    }).join('');
    setSelectionCount('perf-selection-count', state.perfSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.perfSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('perf-selection-count', state.perfSelected);
      });
    });
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.perfIndex = Number(el.getAttribute('data-idx'));
        renderPerfList();
        renderPerfEditor();
      });
    });
    var activeRow = box.querySelector('.item.active');
    if (activeRow && typeof activeRow.scrollIntoView === 'function') {
      activeRow.scrollIntoView({ block: 'nearest' });
    }
    if (state.perfIndex < 0 && state.perfs.length) {
      state.perfIndex = 0;
      renderPerfList();
      renderPerfEditor();
    }
  }
  function renderPerfEditor() {
    var e = state.perfs[state.perfIndex] || {};
    function localeFirst(base) {
      var lk = base + '_' + state.lang;
      var loc = safeString(e[lk]).trim();
      return loc || safeString(e[base]);
    }
    function localeFirstTitle() {
      var lang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
      if (lang === 'en') return safeString(e.title).trim() || safeString(e.title_en).trim();
      var loc = safeString(e['title_' + lang]).trim();
      return loc || safeString(e.title);
    }
    $('perf-title').value = localeFirstTitle();
    $('perf-detail').value = localeFirst('detail');
    $('perf-day').value = safeString(e.day);
    $('perf-month').value = safeString(e.month);
    $('perf-dateDisplay').value = normalizeSortDateForInput(e.sortDate);
    $('perf-time').value = safeString(e.time);
    $('perf-venue').value = safeString(e.venue);
    $('perf-city').value = safeString(e.city);
    $('perf-revenue-amount').value = safeString(e.revenueAmount);
    setSelectWithCustomValue('perf-revenue-currency', safeString(e.revenueCurrency || 'EUR').trim().toUpperCase() || 'EUR', 'EUR');
    setSelectWithCustomValue('perf-revenue-status', safeString(e.revenueStatus || 'unknown').trim().toLowerCase() || 'unknown', 'unknown');
    $('perf-revenue-notes').value = safeString(e.revenueNotes);
    $('perf-venuePhoto').value = safeString(e.venuePhoto);
    var op = normalizePerfVenueOpacity(e.venueOpacity);
    $('perf-venueOpacity').value = String(op);
    $('perf-venuePreview').src = safeString(e.venuePhoto);
    $('perf-venuePreview').style.opacity = String(op / 100);
    $('perf-venuePreview').style.filter = 'none';
    setSelectWithCustomValue('perf-status', safeString(e.status), 'upcoming');
    setSelectWithCustomValue('perf-type', safeString(e.type), 'concert');
    setSelectWithCustomValue('perf-editorialStatus', safeString(e.editorialStatus || (safeString(e.status) === 'hidden' ? 'hidden' : 'draft')), 'draft');
    if ($('perf-privateBadge')) $('perf-privateBadge').value = e.hidePrivateBadge ? 'hide' : 'show';
    if ($('perf-privateBadgeText')) $('perf-privateBadgeText').value = localeFirst('privateBadgeText');
    if ($('perf-privateDetailLine')) $('perf-privateDetailLine').value = e.hidePrivateDetailLine ? 'hide' : 'show';
    if ($('perf-privateDetailText')) $('perf-privateDetailText').value = localeFirst('privateDetailText');
    if ($('perf-modal-title')) $('perf-modal-title').value = localeFirstTitle();
    if ($('perf-modal-type')) setSelectWithCustomValue('perf-modal-type', safeString(e.type), 'concert');
    if ($('perf-modal-venue')) $('perf-modal-venue').value = safeString(e.venue);
    if ($('perf-modal-city')) $('perf-modal-city').value = safeString(e.city);
    if ($('perf-modal-longdesc')) $('perf-modal-longdesc').value = localeFirst('extDesc');
    if ($('perf-modal-link')) $('perf-modal-link').value = localeFirst('eventLink');
    if ($('perf-modal-link-label')) $('perf-modal-link-label').value = localeFirst('eventLinkLabel');
    if ($('perf-modal-ticketPrice')) $('perf-modal-ticketPrice').value = safeString(e.ticketPrice);
    if ($('perf-modal-image')) $('perf-modal-image').value = safeString(e.modalImg);
    if ($('perf-modal-image-hide')) $('perf-modal-image-hide').value = e.modalImgHide ? 'true' : 'false';
    if ($('perf-modal-enabled')) {
      if (e.modalEnabled === true) $('perf-modal-enabled').value = 'true';
      else if (e.modalEnabled === false) $('perf-modal-enabled').value = 'false';
      else $('perf-modal-enabled').value = '';
    }
    if ($('perf-modal-flyerImg')) $('perf-modal-flyerImg').value = safeString(e.flyerImg);
    if ($('perf-modal-maps-link')) {
      var q = encodeURIComponent((safeString(e.venue).trim() || '') + (safeString(e.city).trim() ? (' ' + safeString(e.city).trim()) : ''));
      $('perf-modal-maps-link').value = q ? ('https://maps.google.com/?q=' + q) : '';
    }
    $('perf-sortDate').value = safeString(e.sortDate);
    updatePerfCardPreview();
    updatePerfPublicVisibilitySummary();
    updatePerfTranslationWarnings();
    syncPerfTxPicker();
  }
  function setSelectWithCustomValue(id, rawValue, fallback) {
    var el = $(id);
    if (!el) return;
    var v = safeString(rawValue).trim();
    if (!v) v = fallback;
    var has = false;
    Array.prototype.forEach.call(el.options || [], function (opt) {
      if (safeString(opt.value) === v) has = true;
    });
    if (!has) {
      var customOpt = document.createElement('option');
      customOpt.value = v;
      customOpt.textContent = v + ' (custom)';
      customOpt.setAttribute('data-custom', 'true');
      el.appendChild(customOpt);
    }
    el.value = v;
  }
  function normalizeSortDateForInput(raw) {
    var s = safeString(raw).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
  }
  function normalizePerfVenueOpacity(raw) {
    var value = Number(raw);
    if (!Number.isFinite(value)) return 50;
    if (value <= 0) return 0;
    if (value <= 10) return 10;
    if (value <= 20) return 20;
    if (value <= 30) return 30;
    if (value <= 40) return 40;
    return 50;
  }
  function perfPreviewDateLabel() {
    var day = safeString($('perf-day').value).trim();
    var month = safeString($('perf-month').value).trim();
    if (day || month) return (day + ' ' + month).trim();
    var sort = normalizeSortDateForInput($('perf-sortDate').value);
    if (!sort) return 'Date';
    var parts = sort.split('-');
    return parts[2] + ' ' + parts[1];
  }
  function updatePerfCardPreview() {
    var title = safeString($('perf-title').value).trim();
    var detail = safeString($('perf-detail').value).trim();
    var venue = safeString($('perf-venue').value).trim();
    var city = safeString($('perf-city').value).trim();
    var bg = safeString($('perf-venuePhoto').value).trim();
    var op = normalizePerfVenueOpacity($('perf-venueOpacity').value);
    $('perf-preview-date').textContent = perfPreviewDateLabel();
    $('perf-preview-title').textContent = title || 'Event title';
    $('perf-preview-detail').textContent = detail || 'Event detail';
    $('perf-preview-venue').textContent = ((venue || 'Venue') + ' · ' + (city || 'City'));
    $('perf-cardPreviewBg').style.backgroundImage = bg ? 'url("' + bg.replace(/"/g, '\\"') + '")' : 'none';
    $('perf-cardPreviewBg').style.opacity = String(op / 100);
    $('perf-cardPreviewBg').style.filter = 'none';
  }
  function updatePerfPublicVisibilitySummary() {
    var box = $('perf-public-visibility');
    if (!box) return;
    var st = safeString($('perf-status') && $('perf-status').value).trim().toLowerCase();
    var es = safeString($('perf-editorialStatus') && $('perf-editorialStatus').value).trim().toLowerCase();
    var hiddenByStatus = st === 'hidden';
    var hiddenByEditorial = es === 'hidden' || es === 'draft' || es === 'needs_translation' || es === 'needs translation';
    if (hiddenByStatus || hiddenByEditorial) {
      box.textContent = 'Hidden from website';
      box.classList.remove('ok');
      box.classList.add('warn');
    } else {
      box.textContent = 'Visible on website';
      box.classList.remove('warn');
      box.classList.add('ok');
    }
  }
  function updatePerfTranslationWarnings() {
    var summary = $('perf-translation-status');
    var warnDetail = $('perf-detail-translation-warn');
    var warnExt = $('perf-modal-longdesc-translation-warn');
    var warnCtaLabel = $('perf-modal-link-label-translation-warn');
    var warnCtaUrl = $('perf-modal-link-translation-warn');
    if (!summary) return;
    var e = state.perfs[state.perfIndex] || {};
    var lang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var LANG_LABELS = { en: 'EN', de: 'DE', es: 'ES', it: 'IT', fr: 'FR' };
    var langLabel = LANG_LABELS[lang] || lang.toUpperCase();
    function setWarn(el, text) {
      if (!el) return;
      if (text) {
        el.textContent = text;
        el.style.display = '';
      } else {
        el.textContent = '';
        el.style.display = 'none';
      }
    }
    if (lang === 'en') {
      summary.className = 'translation-qa';
      summary.textContent = 'Translation status: EN baseline. Switch language to review localized event content.';
      summary.style.display = '';
      setWarn(warnDetail, '');
      setWarn(warnExt, '');
      setWarn(warnCtaLabel, '');
      setWarn(warnCtaUrl, '');
      return;
    }
    var detailLoc = safeString(e['detail_' + lang]).trim();
    var extLoc = safeString(e['extDesc_' + lang]).trim();
    var linkBase = safeString(e.eventLink).trim();
    var linkLoc = safeString(e['eventLink_' + lang]).trim();
    var labelLoc = safeString(e['eventLinkLabel_' + lang]).trim();
    var missing = [];
    if (!detailLoc) missing.push('Missing ' + langLabel + ' subtitle');
    if (!extLoc) missing.push('Missing ' + langLabel + ' modal text');
    if (linkBase && !labelLoc) missing.push('Missing ' + langLabel + ' CTA label');
    if (linkBase && !linkLoc) missing.push('Missing ' + langLabel + ' CTA URL');
    setWarn(warnDetail, !detailLoc ? ('Missing ' + langLabel + ' subtitle (detail_' + lang + ')') : '');
    setWarn(warnExt, !extLoc ? ('Missing ' + langLabel + ' modal text (extDesc_' + lang + ')') : '');
    setWarn(warnCtaLabel, (linkBase && !labelLoc) ? ('Missing ' + langLabel + ' CTA label (eventLinkLabel_' + lang + ')') : '');
    setWarn(warnCtaUrl, (linkBase && !linkLoc) ? ('Missing ' + langLabel + ' CTA URL (eventLink_' + lang + ')') : '');
    if (!missing.length) {
      summary.className = 'translation-qa muted ok';
      summary.textContent = 'Translation status: complete for ' + langLabel + '.';
    } else {
      summary.className = 'translation-qa';
      summary.innerHTML = '<strong>Translation status for this event (' + langLabel + '):</strong><ul><li>' + missing.join('</li><li>') + '</li></ul>';
    }
    summary.style.display = '';
  }
  function setPerfTxResult(text, kind) {
    var el = $('perf-tx-result');
    if (!el) return;
    el.className = 'muted' + (kind ? (' ' + kind) : '');
    el.textContent = safeString(text);
  }
  function syncPerfTxPicker() {
    var src = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    LANGS.forEach(function (L) {
      var box = $('perf-tx-lang-' + L);
      if (!box) return;
      box.disabled = (L === src);
      if (L === src) box.checked = false;
      else if (box.dataset.init !== '1') box.checked = true;
      box.dataset.init = '1';
    });
  }
  function getPerfTxSelectedTargets(sourceLang) {
    return LANGS.filter(function (L) {
      if (L === sourceLang) return false;
      var box = $('perf-tx-lang-' + L);
      return !!(box && box.checked);
    });
  }
  function collectPerfTxSource(e, sourceLang) {
    function pick(base) {
      var lk = base + '_' + sourceLang;
      var loc = safeString(e[lk]).trim();
      if (loc) return loc;
      return safeString(e[base]).trim();
    }
    return {
      detail: pick('detail'),
      extDesc: pick('extDesc'),
      eventLinkLabel: pick('eventLinkLabel'),
      eventLink: pick('eventLink')
    };
  }
  function applyPerfTxCopy(targetLangs, opts) {
    opts = opts || {};
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex] || {};
    var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var source = collectPerfTxSource(e, sourceLang);
    var includeUrl = !!opts.includeUrl;
    var fields = ['detail', 'extDesc', 'eventLinkLabel'].concat(includeUrl ? ['eventLink'] : []);
    var overwriteHits = [];
    targetLangs.forEach(function (L) {
      fields.forEach(function (base) {
        var tk = base + '_' + L;
        var incoming = safeString(source[base]).trim();
        var existing = safeString(e[tk]).trim();
        if (incoming && existing && existing !== incoming) overwriteHits.push(L.toUpperCase() + ':' + tk);
      });
    });
    if (overwriteHits.length) {
      var msg = 'This will overwrite ' + overwriteHits.length + ' non-empty localized field(s).\n\nContinue?\n\n' + overwriteHits.slice(0, 10).join(', ') + (overwriteHits.length > 10 ? '…' : '');
      if (!window.confirm(msg)) {
        setPerfTxResult('Copy cancelled.', 'warn');
        return;
      }
    }
    targetLangs.forEach(function (L) {
      fields.forEach(function (base) {
        e[base + '_' + L] = safeString(source[base]).trim();
      });
    });
    state.perfs[state.perfIndex] = e;
    renderPerfEditor();
    renderPerfList();
    markDirty(true, 'Calendar translation copy applied');
    updatePerfTranslationWarnings();
    setPerfTxResult(
      'Copied from ' + sourceLang.toUpperCase() + ' to: ' + targetLangs.map(function (L) { return L.toUpperCase(); }).join(', ') +
      (includeUrl ? ' (including URLs).' : ' (without URLs).'),
      'ok'
    );
  }
  function runPerfCopyCurrentToTargets(targetLangs) {
    if (state.perfIndex < 0) return;
    if (!targetLangs.length) {
      setPerfTxResult('No target languages selected.', 'warn');
      return;
    }
    persistPerfEditor();
    var e = state.perfs[state.perfIndex] || {};
    var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var source = collectPerfTxSource(e, sourceLang);
    var includeUrl = false;
    if (source.eventLink) {
      includeUrl = window.confirm('Copy localized CTA URLs as well?\n\nSelect "Cancel" to keep target URLs unchanged.');
    }
    applyPerfTxCopy(targetLangs, { includeUrl: includeUrl });
  }
  function copyPerfBaseToCurrentLang() {
    if (state.perfIndex < 0) return;
    var lang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var e = state.perfs[state.perfIndex] || {};
    var incoming = {
      detail: safeString(e.detail).trim(),
      extDesc: safeString(e.extDesc).trim(),
      eventLinkLabel: safeString(e.eventLinkLabel).trim(),
      eventLink: safeString(e.eventLink).trim()
    };
    var overwriteHits = [];
    Object.keys(incoming).forEach(function (base) {
      var tk = base + '_' + lang;
      var existing = safeString(e[tk]).trim();
      if (incoming[base] && existing && existing !== incoming[base]) overwriteHits.push(tk);
    });
    if (overwriteHits.length) {
      if (!window.confirm('Overwrite existing localized fields for ' + lang.toUpperCase() + '?\n\n' + overwriteHits.join(', '))) {
        setPerfTxResult('Copy cancelled.', 'warn');
        return;
      }
    }
    Object.keys(incoming).forEach(function (base) {
      e[base + '_' + lang] = incoming[base];
    });
    state.perfs[state.perfIndex] = e;
    renderPerfEditor();
    renderPerfList();
    markDirty(true, 'Copied base fields to current language');
    updatePerfTranslationWarnings();
    setPerfTxResult('Base fields copied to ' + lang.toUpperCase() + '.', 'ok');
  }
  function autoTranslatePerfFromCurrentLang() {
    if (state.perfIndex < 0) return;
    persistPerfEditor();
    var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var targetLangs = LANGS.filter(function (L) { return L !== sourceLang; });
    var translateFn = state.api && typeof state.api.translateText === 'function' ? state.api.translateText : null;
    if (!translateFn) {
      setPerfTxResult('Auto-translate helper is not available in this environment. UI is ready for future integration.', 'warn');
      return;
    }
    var e = state.perfs[state.perfIndex] || {};
    var src = collectPerfTxSource(e, sourceLang);
    var jobs = [];
    targetLangs.forEach(function (L) {
      ['detail', 'extDesc', 'eventLinkLabel'].forEach(function (base) {
        if (!safeString(src[base]).trim()) return;
        jobs.push(
          Promise.resolve(translateFn(src[base], sourceLang, L)).then(function (out) {
            e[base + '_' + L] = safeString(out).trim();
          })
        );
      });
    });
    Promise.all(jobs)
      .then(function () {
        state.perfs[state.perfIndex] = e;
        renderPerfEditor();
        renderPerfList();
        markDirty(true, 'Auto-translation drafts generated');
        updatePerfTranslationWarnings();
        setPerfTxResult('Draft translations generated for review. Save all event changes when ready.', 'warn');
      })
      .catch(function (err) {
        setPerfTxResult('Auto-translate failed: ' + safeString(err && err.message), 'err');
      });
  }
  function persistPerfEditor() {
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex] || {};
    var activeLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
    var activeId = document.activeElement && document.activeElement.id ? document.activeElement.id : '';
    function readVal(id) { return safeString($(id) && $(id).value).trim(); }
    function syncPairedValue(mainId, modalId) {
      var mainVal = readVal(mainId);
      var modalVal = readVal(modalId);
      // Reusable guard: the actively edited field wins in this cycle.
      if (activeId === modalId) return modalVal || mainVal;
      return mainVal || modalVal;
    }
    function writeIfInactive(id, value) {
      var el = $(id);
      if (!el || activeId === id) return;
      el.value = safeString(value);
    }
    function persistLocaleBackedField(base, value) {
      e[base + '_' + activeLang] = value;
      if (activeLang === 'en' || safeString(e[base]).trim() === '') e[base] = value;
    }
    var modalTitle = readVal('perf-modal-title');
    var cardTitle = safeString($('perf-title') && $('perf-title').value).trim();
    // Prevent input overwrite loop: when editing card title, it is the source of truth.
    // Allow modal-title edits to drive title only while that field is actively edited.
    var titleMerged = activeId === 'perf-modal-title' ? modalTitle || cardTitle : cardTitle || modalTitle;
    persistLocaleBackedField('title', titleMerged);
    persistLocaleBackedField('detail', safeString($('perf-detail').value));
    e.day = $('perf-day').value;
    e.month = $('perf-month').value;
    e.time = safeString($('perf-time').value).trim();
    e.venue = syncPairedValue('perf-venue', 'perf-modal-venue');
    e.city = syncPairedValue('perf-city', 'perf-modal-city');
    var revenueAmount = Number($('perf-revenue-amount') && $('perf-revenue-amount').value);
    e.revenueAmount = Number.isFinite(revenueAmount) && revenueAmount >= 0 ? revenueAmount : '';
    e.revenueCurrency = safeString($('perf-revenue-currency') && $('perf-revenue-currency').value || 'EUR').trim().toUpperCase() || 'EUR';
    e.revenueStatus = safeString($('perf-revenue-status') && $('perf-revenue-status').value || 'unknown').trim().toLowerCase() || 'unknown';
    e.revenueNotes = safeString($('perf-revenue-notes') && $('perf-revenue-notes').value).trim();
    e.venuePhoto = safeString($('perf-venuePhoto').value).trim();
    var dateDisplay = normalizeSortDateForInput($('perf-dateDisplay').value);
    if (dateDisplay) $('perf-sortDate').value = dateDisplay;
    var op = normalizePerfVenueOpacity($('perf-venueOpacity').value);
    e.venueOpacity = op;
    e.venueBrightness = 100;
    e.venueContrast = 100;
    $('perf-venuePreview').src = e.venuePhoto;
    $('perf-venuePreview').style.opacity = String(op / 100);
    $('perf-venuePreview').style.filter = 'none';
    e.status = $('perf-status').value;
    e.type = syncPairedValue('perf-type', 'perf-modal-type');
    e.editorialStatus = safeString($('perf-editorialStatus').value || (safeString(e.status) === 'hidden' ? 'hidden' : 'draft'));
    e.hidePrivateBadge = safeString($('perf-privateBadge') && $('perf-privateBadge').value).trim() === 'hide';
    persistLocaleBackedField('privateBadgeText', safeString($('perf-privateBadgeText') && $('perf-privateBadgeText').value));
    e.hidePrivateDetailLine = safeString($('perf-privateDetailLine') && $('perf-privateDetailLine').value).trim() === 'hide';
    persistLocaleBackedField('privateDetailText', safeString($('perf-privateDetailText') && $('perf-privateDetailText').value));
    persistLocaleBackedField('extDesc', safeString($('perf-modal-longdesc') && $('perf-modal-longdesc').value));
    e.ticketPrice = safeString($('perf-modal-ticketPrice') && $('perf-modal-ticketPrice').value).trim();
    persistLocaleBackedField('eventLink', safeString($('perf-modal-link') && $('perf-modal-link').value).trim());
    persistLocaleBackedField('eventLinkLabel', safeString($('perf-modal-link-label') && $('perf-modal-link-label').value));
    e.modalImg = safeString($('perf-modal-image') && $('perf-modal-image').value).trim();
    e.modalImgHide = safeString($('perf-modal-image-hide') && $('perf-modal-image-hide').value).trim() === 'true';
    if ($('perf-modal-enabled')) {
      var modalEnabledRaw = safeString($('perf-modal-enabled').value).trim().toLowerCase();
      if (modalEnabledRaw === 'true') e.modalEnabled = true;
      else if (modalEnabledRaw === 'false') e.modalEnabled = false;
      else delete e.modalEnabled;
    }
    e.flyerImg = safeString($('perf-modal-flyerImg') && $('perf-modal-flyerImg').value).trim();
    e.sortDate = $('perf-sortDate').value;
    var titleDisplay =
      activeLang === 'en'
        ? safeString(e.title).trim() || safeString(e.title_en).trim()
        : safeString(e['title_' + activeLang]).trim() || safeString(e.title).trim();
    writeIfInactive('perf-title', titleDisplay);
    writeIfInactive('perf-modal-title', titleDisplay);
    writeIfInactive('perf-venue', e.venue);
    writeIfInactive('perf-modal-venue', e.venue);
    writeIfInactive('perf-city', e.city);
    writeIfInactive('perf-modal-city', e.city);
    writeIfInactive('perf-type', e.type || 'concert');
    writeIfInactive('perf-modal-type', e.type || 'concert');
    state.perfs[state.perfIndex] = e;
    updatePerfCardPreview();
    updatePerfPublicVisibilitySummary();
    updatePerfTranslationWarnings();
    renderPerfList();
    markDirty(true);
  }
  function loadCalendar() {
    var stored = loadDoc('perf_' + state.lang, null);
    var fallback = getLegacySection('perf');
    $('perf-h2').value = pickStoredOrFallback(stored, fallback, 'h2');
    $('perf-intro').value = pickStoredOrFallback(stored, fallback, 'intro');
    if ($('perf-status-filter')) $('perf-status-filter').value = state.perfStatusFilter || 'all';
    if ($('perf-workflow-filter')) $('perf-workflow-filter').value = state.perfWorkflowFilter || 'all';
    if ($('perf-revenue-filter')) $('perf-revenue-filter').value = state.perfRevenueFilter || 'all';
    state.perfs = loadDoc('rg_perfs', []);
    state.perfs.forEach(function (e, idx) {
      if (!e.id || safeString(e.id).trim() === '') {
        e.id = 'perf-' + (idx + 1);
      }
    });
    state.perfIndex = -1;
    renderPerfList();
    updateCompletenessIndicators();
    if (state.deepLinkPerfId) {
      try { openCalendarEventById(state.deepLinkPerfId); } catch (eDeep) {}
      state.deepLinkPerfId = '';
    }
  }
  function incomeEventDateFromPerf(e) {
    var sort = normalizeSortDateForInput(e && e.sortDate);
    if (!sort) return null;
    var dt = new Date(sort + 'T00:00:00');
    return isNaN(dt.getTime()) ? null : dt;
  }
  function incomeTotalsLabel(map) {
    var keys = Object.keys(map || {}).sort();
    if (!keys.length) return '—';
    return keys.map(function (currency) {
      var amount = Number(map[currency]) || 0;
      return currency + ' ' + amount.toLocaleString(undefined, { minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2 });
    }).join(' · ');
  }
  function incomeScopeLabel(scope) {
    if (scope === 'past') return 'past events';
    if (scope === 'all') return 'all events';
    return 'upcoming events';
  }
  function incomeMonthKey(dateObj) {
    if (!dateObj) return 'undated';
    return String(dateObj.getFullYear()) + '-' + String(dateObj.getMonth() + 1).padStart(2, '0');
  }
  function incomeMonthLabel(monthKey) {
    if (monthKey === 'undated') return 'No date set';
    var bits = safeString(monthKey).split('-');
    var y = Number(bits[0]);
    var m = Number(bits[1]);
    if (!Number.isFinite(y) || !Number.isFinite(m)) return monthKey;
    var d = new Date(y, Math.max(0, m - 1), 1);
    if (isNaN(d.getTime())) return monthKey;
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }
  function incomeLocalDateLabel(dateObj) {
    if (!dateObj || isNaN(dateObj.getTime())) return 'Not set';
    var y = dateObj.getFullYear();
    var d = String(dateObj.getDate()).padStart(2, '0');
    var m = String(dateObj.getMonth() + 1).padStart(2, '0');
    return d + '.' + m + '.' + String(y);
  }
  function incomeBuildFilteredRowsContext() {
    var scope = safeString(state.incomeEventScope || 'upcoming').trim().toLowerCase();
    if (scope !== 'upcoming' && scope !== 'past' && scope !== 'all') scope = 'upcoming';
    var statusFilter = safeString(state.incomeStatusFilter || 'all').trim().toLowerCase();
    if (statusFilter !== 'all' && statusFilter !== 'confirmed' && statusFilter !== 'potential' && statusFilter !== 'unknown') statusFilter = 'all';
    var completenessFilter = safeString(state.incomeCompletenessFilter || 'all').trim().toLowerCase();
    if (completenessFilter !== 'all' && completenessFilter !== 'missing-amount' && completenessFilter !== 'missing-status' && completenessFilter !== 'missing-amount-or-status') completenessFilter = 'all';
    var monthFilter = safeString(state.incomeMonthFilter || 'all').trim().toLowerCase() || 'all';
    var all = Array.isArray(state.perfs) ? state.perfs : [];
    var baseRows = all.map(function (e) {
      var dt = incomeEventDateFromPerf(e);
      return {
        event: e,
        date: dt,
        amount: Number(e && e.revenueAmount),
        currency: safeString(e && e.revenueCurrency || 'EUR').trim().toUpperCase() || 'EUR',
        revenueStatus: safeString(e && e.revenueStatus || 'unknown').trim().toLowerCase() || 'unknown',
        notes: safeString(e && e.revenueNotes).trim()
      };
    }).filter(function (row) {
      var perfStatus = safeString(row.event && row.event.status || '').trim().toLowerCase();
      if (perfStatus === 'hidden') return false;
      if (scope === 'upcoming' && perfStatus === 'past') return false;
      if (scope === 'past' && perfStatus !== 'past') return false;
      if (statusFilter !== 'all' && row.revenueStatus !== statusFilter) return false;
      return row.date || (Number.isFinite(row.amount) && row.amount > 0) || row.revenueStatus !== 'unknown' || row.notes;
    });
    var rows = baseRows.filter(function (row) {
      var hasAmount = Number.isFinite(row.amount) && row.amount > 0;
      var hasStatus = row.revenueStatus === 'confirmed' || row.revenueStatus === 'potential';
      if (completenessFilter === 'missing-amount' && hasAmount) return false;
      if (completenessFilter === 'missing-status' && hasStatus) return false;
      if (completenessFilter === 'missing-amount-or-status' && hasAmount && hasStatus) return false;
      return true;
    }).sort(function (a, b) {
      if (a.date && b.date) return a.date.getTime() - b.date.getTime();
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return safeString(a.event && a.event.title).localeCompare(safeString(b.event && b.event.title));
    });
    var tableRows = rows;
    if (monthFilter !== 'all') {
      tableRows = rows.filter(function (row) {
        return incomeMonthKey(row.date) === monthFilter;
      });
    }
    return {
      scope: scope,
      statusFilter: statusFilter,
      completenessFilter: completenessFilter,
      monthFilter: monthFilter,
      rows: rows,
      tableRows: tableRows,
      summaryRows: monthFilter === 'all' ? rows : tableRows
    };
  }
  function incomeReportPeriodLabel(ctx) {
    if (ctx.monthFilter !== 'all') return incomeMonthLabel(ctx.monthFilter);
    var dated = ctx.tableRows.filter(function (row) { return row.date && !isNaN(row.date.getTime()); });
    if (!dated.length) return 'Current filters (' + incomeScopeLabel(ctx.scope) + ')';
    var minDate = dated[0].date;
    var maxDate = dated[dated.length - 1].date;
    var minLabel = incomeLocalDateLabel(minDate);
    var maxLabel = incomeLocalDateLabel(maxDate);
    return minLabel === maxLabel ? minLabel : (minLabel + ' - ' + maxLabel);
  }
  function incomeReportTotals(rows) {
    var confirmed = {};
    var pending = {};
    var overall = {};
    rows.forEach(function (row) {
      if (!Number.isFinite(row.amount) || row.amount <= 0) return;
      var currency = row.currency || 'EUR';
      overall[currency] = (Number(overall[currency]) || 0) + row.amount;
      if (row.revenueStatus === 'confirmed') confirmed[currency] = (Number(confirmed[currency]) || 0) + row.amount;
      if (row.revenueStatus === 'potential') pending[currency] = (Number(pending[currency]) || 0) + row.amount;
    });
    return { confirmed: confirmed, pending: pending, overall: overall };
  }
  function incomeReportDocumentHtml(ctx) {
    var totals = incomeReportTotals(ctx.tableRows);
    var periodLabel = incomeReportPeriodLabel(ctx);
    var statusMap = { confirmed: 'Confirmed', potential: 'Pending / Expected', unknown: 'Not set' };
    var statusLabel = statusMap[ctx.statusFilter] || 'All statuses';
    var completenessMap = {
      all: 'All rows',
      'missing-amount': 'Missing amount',
      'missing-status': 'Missing status',
      'missing-amount-or-status': 'Missing amount or status'
    };
    var tableHtml = '';
    if (!ctx.tableRows.length) {
      tableHtml = '<div class="empty">No income rows match the current filters.</div>';
    } else {
      tableHtml = '<table><thead><tr>' +
        '<th>Date</th><th>Event / Project</th><th>Venue / Client</th><th>Status</th><th>Amount</th><th>Notes</th>' +
      '</tr></thead><tbody>' + ctx.tableRows.map(function (row) {
        var e = row.event || {};
        var eventTitle = safeString(e.title).trim() || '(untitled)';
        var venue = safeString(e.venue).trim() || safeString(e.city).trim() || 'Not set';
        var status = statusMap[row.revenueStatus] || 'Not set';
        var amountText = Number.isFinite(row.amount) && row.amount > 0
          ? ((row.currency || 'EUR') + ' ' + row.amount.toLocaleString(undefined, { minimumFractionDigits: row.amount % 1 ? 2 : 0, maximumFractionDigits: 2 }))
          : 'Not set';
        var note = row.notes ? (row.notes.length > 140 ? row.notes.slice(0, 139).trim() + '…' : row.notes) : '—';
        return '<tr>' +
          '<td>' + escapeHtml(incomeLocalDateLabel(row.date)) + '</td>' +
          '<td>' + escapeHtml(eventTitle) + '</td>' +
          '<td>' + escapeHtml(venue) + '</td>' +
          '<td>' + escapeHtml(status) + '</td>' +
          '<td>' + escapeHtml(amountText) + '</td>' +
          '<td>' + escapeHtml(note) + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }
    return '<!doctype html><html><head><meta charset="utf-8"><title>Income / Earnings Report</title>' +
      '<style>' +
      'body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;padding:24px;color:#1c2430;background:#fff}' +
      '.wrap{max-width:1040px;margin:0 auto}' +
      'h1{font-size:22px;margin:0 0 8px}' +
      '.meta{color:#566173;font-size:13px;margin:2px 0}' +
      '.summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0 16px}' +
      '.card{border:1px solid #d7dde8;border-radius:10px;padding:10px 12px}' +
      '.card span{display:block;color:#5c677a;font-size:12px}' +
      '.card strong{display:block;margin-top:4px;font-size:15px;color:#1c2430}' +
      'table{width:100%;border-collapse:collapse;font-size:12px}' +
      'th,td{border:1px solid #d7dde8;padding:7px 8px;vertical-align:top;text-align:left}' +
      'th{background:#f4f7fb;font-weight:600}' +
      '.empty{border:1px dashed #c7cfdd;border-radius:10px;padding:16px;color:#5c677a;background:#f8fafe}' +
      '@media print{body{padding:12px}.summary{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
      '</style></head><body><div class="wrap">' +
      '<h1>Income / Earnings Report</h1>' +
      '<p class="meta"><strong>Reporting period:</strong> ' + escapeHtml(periodLabel) + '</p>' +
      '<p class="meta"><strong>Filter context:</strong> scope=' + escapeHtml(incomeScopeLabel(ctx.scope)) + ', status=' + escapeHtml(statusLabel) + ', completeness=' + escapeHtml(completenessMap[ctx.completenessFilter] || 'All rows') + ', month=' + escapeHtml(ctx.monthFilter === 'all' ? 'All months' : incomeMonthLabel(ctx.monthFilter)) + '</p>' +
      '<div class="summary">' +
        '<div class="card"><span>Total confirmed</span><strong>' + escapeHtml(incomeTotalsLabel(totals.confirmed)) + '</strong></div>' +
        '<div class="card"><span>Total pending / expected</span><strong>' + escapeHtml(incomeTotalsLabel(totals.pending)) + '</strong></div>' +
        '<div class="card"><span>Total overall</span><strong>' + escapeHtml(incomeTotalsLabel(totals.overall)) + '</strong></div>' +
        '<div class="card"><span>Included entries</span><strong>' + escapeHtml(String(ctx.tableRows.length)) + '</strong></div>' +
      '</div>' +
      tableHtml +
      '</div></body></html>';
  }
  function exportIncomeReportPdf() {
    state.perfs = loadDoc('rg_perfs', []);
    if (!Array.isArray(state.perfs)) state.perfs = [];
    var ctx = incomeBuildFilteredRowsContext();
    var popup = window.open('', '_blank', 'width=1280,height=900');
    if (!popup) {
      setStatus('Could not open Income report window. Check popup blocker and try again.', 'err');
      return;
    }
    popup.document.open();
    popup.document.write(incomeReportDocumentHtml(ctx));
    popup.document.close();
    var printNow = function () {
      try {
        popup.focus();
        popup.print();
        setStatus('Income report ready. Use Save as PDF in the print dialog.', 'warn');
      } catch (err) {
        setStatus('Income report opened. Use Cmd+P to save it as PDF.', 'warn');
      }
    };
    if (popup.document.readyState === 'complete') {
      setTimeout(printNow, 120);
    } else {
      popup.addEventListener('load', function () { setTimeout(printNow, 120); }, { once: true });
    }
  }
  function incomeOpenCalendarEvent(perfId) {
    if (!hasUnsavedChangesPrompt('Open linked calendar event?')) return;
    if (!safeString(perfId).trim()) return;
    state.section = 'calendar';
    document.querySelectorAll('.section').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
    if ($('section-calendar')) $('section-calendar').classList.add('active');
    var navBtn = document.querySelector('.nav-item[data-section="calendar"]');
    if (navBtn) navBtn.classList.add('active');
    if ($('currentSectionLabel') && navBtn) $('currentSectionLabel').textContent = navBtn.textContent;
    loadCalendar();
    openCalendarEventById(perfId);
    syncTopbarToolsDisclosure();
    if (window.innerWidth <= 860 && $('sidebar')) $('sidebar').classList.remove('open');
  }
  function renderIncomeSection() {
    var summaryBox = $('income-summary');
    var tableBody = $('income-table-body');
    var missingSummaryBox = $('income-missing-summary');
    var outlookBox = $('income-month-outlook');
    if (!summaryBox || !tableBody) return;
    var scope = safeString(state.incomeEventScope || 'upcoming').trim().toLowerCase();
    if (scope !== 'upcoming' && scope !== 'past' && scope !== 'all') scope = 'upcoming';
    var statusFilter = safeString(state.incomeStatusFilter || 'all').trim().toLowerCase();
    if (statusFilter !== 'all' && statusFilter !== 'confirmed' && statusFilter !== 'potential' && statusFilter !== 'unknown') statusFilter = 'all';
    var completenessFilter = safeString(state.incomeCompletenessFilter || 'all').trim().toLowerCase();
    if (completenessFilter !== 'all' && completenessFilter !== 'missing-amount' && completenessFilter !== 'missing-status' && completenessFilter !== 'missing-amount-or-status') completenessFilter = 'all';
    var monthFilter = safeString(state.incomeMonthFilter || 'all').trim().toLowerCase() || 'all';
    if ($('income-event-scope')) $('income-event-scope').value = scope;
    if ($('income-status-filter')) $('income-status-filter').value = statusFilter;
    if ($('income-completeness-filter')) $('income-completeness-filter').value = completenessFilter;
    if ($('income-scope-note')) $('income-scope-note').textContent = 'Scope: ' + incomeScopeLabel(scope);
    var all = Array.isArray(state.perfs) ? state.perfs : [];
    var baseRows = all.map(function (e) {
      var dt = incomeEventDateFromPerf(e);
      return {
        event: e,
        date: dt,
        amount: Number(e && e.revenueAmount),
        currency: safeString(e && e.revenueCurrency || 'EUR').trim().toUpperCase() || 'EUR',
        revenueStatus: safeString(e && e.revenueStatus || 'unknown').trim().toLowerCase() || 'unknown',
        notes: safeString(e && e.revenueNotes).trim()
      };
    }).filter(function (row) {
      var perfStatus = safeString(row.event && row.event.status || '').trim().toLowerCase();
      if (perfStatus === 'hidden') return false;
      if (scope === 'upcoming' && perfStatus === 'past') return false;
      if (scope === 'past' && perfStatus !== 'past') return false;
      if (statusFilter !== 'all' && row.revenueStatus !== statusFilter) return false;
      return row.date || (Number.isFinite(row.amount) && row.amount > 0) || row.revenueStatus !== 'unknown' || row.notes;
    });
    if (missingSummaryBox) {
      var missingAmountCount = 0;
      var missingStatusCount = 0;
      var missingEitherCount = 0;
      baseRows.forEach(function (row) {
        var hasAmount = Number.isFinite(row.amount) && row.amount > 0;
        var hasStatus = row.revenueStatus === 'confirmed' || row.revenueStatus === 'potential';
        if (!hasAmount) missingAmountCount += 1;
        if (!hasStatus) missingStatusCount += 1;
        if (!hasAmount || !hasStatus) missingEitherCount += 1;
      });
      var missingCards = [
        { key: 'missing-amount', label: 'Missing amount', count: missingAmountCount },
        { key: 'missing-status', label: 'Missing status', count: missingStatusCount },
        { key: 'missing-amount-or-status', label: 'Missing amount or status', count: missingEitherCount }
      ];
      missingSummaryBox.innerHTML = missingCards.map(function (card) {
        var active = completenessFilter === card.key;
        return '<button type="button" class="income-missing-card' + (active ? ' is-active' : '') + '" data-income-completeness-filter="' + escapeAttr(card.key) + '"><span>' + escapeHtml(card.label) + '</span><strong>' + escapeHtml(String(card.count)) + '</strong></button>';
      }).join('');
      missingSummaryBox.querySelectorAll('[data-income-completeness-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var nextFilter = safeString(btn.getAttribute('data-income-completeness-filter') || 'all').trim().toLowerCase() || 'all';
          var currentFilter = safeString(state.incomeCompletenessFilter || 'all').trim().toLowerCase() || 'all';
          state.incomeCompletenessFilter = currentFilter === nextFilter ? 'all' : nextFilter;
          renderIncomeSection();
        });
      });
    }
    var rows = baseRows.filter(function (row) {
      var hasAmount = Number.isFinite(row.amount) && row.amount > 0;
      var hasStatus = row.revenueStatus === 'confirmed' || row.revenueStatus === 'potential';
      if (completenessFilter === 'missing-amount' && hasAmount) return false;
      if (completenessFilter === 'missing-status' && hasStatus) return false;
      if (completenessFilter === 'missing-amount-or-status' && hasAmount && hasStatus) return false;
      return true;
    }).sort(function (a, b) {
      if (a.date && b.date) return a.date.getTime() - b.date.getTime();
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return safeString(a.event && a.event.title).localeCompare(safeString(b.event && b.event.title));
    });
    var now = new Date();
    var thisMonth = now.getMonth();
    var thisYear = now.getFullYear();
    if (outlookBox) {
      var monthSlots = [];
      var start = new Date(thisYear, thisMonth, 1);
      var slotCount = 6;
      for (var si = 0; si < slotCount; si += 1) {
        monthSlots.push(new Date(start.getFullYear(), start.getMonth() + si, 1));
      }
      var monthTotals = {};
      monthSlots.forEach(function (dt) {
        var key = incomeMonthKey(dt);
        monthTotals[key] = { date: dt, confirmed: {}, potential: {} };
      });
      rows.forEach(function (row) {
        if (!row.date || !Number.isFinite(row.amount) || row.amount <= 0) return;
        var mk = incomeMonthKey(row.date);
        if (!monthTotals[mk]) return;
        if (row.revenueStatus === 'confirmed') {
          monthTotals[mk].confirmed[row.currency] = (Number(monthTotals[mk].confirmed[row.currency]) || 0) + row.amount;
        } else if (row.revenueStatus === 'potential') {
          monthTotals[mk].potential[row.currency] = (Number(monthTotals[mk].potential[row.currency]) || 0) + row.amount;
        }
      });
      var monthKeys = monthSlots.map(function (dt) { return incomeMonthKey(dt); });
      if (monthFilter !== 'all' && monthKeys.indexOf(monthFilter) < 0) {
        monthFilter = 'all';
        state.incomeMonthFilter = 'all';
      }
      var outlookCards = [
        '<button type="button" class="income-outlook-card' + (monthFilter === 'all' ? ' is-active' : '') + '" data-income-month-filter="all">' +
          '<span>All months</span>' +
          '<strong>Show all</strong>' +
          '<small>Clear month filter</small>' +
        '</button>'
      ];
      outlookCards = outlookCards.concat(monthSlots.map(function (dt) {
        var key = incomeMonthKey(dt);
        var slot = monthTotals[key] || { confirmed: {}, potential: {} };
        return '<button type="button" class="income-outlook-card' + (monthFilter === key ? ' is-active' : '') + '" data-income-month-filter="' + escapeAttr(key) + '">' +
          '<span>' + escapeHtml(incomeMonthLabel(key)) + '</span>' +
          '<strong>Confirmed: ' + escapeHtml(incomeTotalsLabel(slot.confirmed)) + '</strong>' +
          '<small>Potential: ' + escapeHtml(incomeTotalsLabel(slot.potential)) + '</small>' +
        '</button>';
      }));
      outlookBox.innerHTML = outlookCards.join('');
      outlookBox.querySelectorAll('[data-income-month-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          state.incomeMonthFilter = safeString(btn.getAttribute('data-income-month-filter') || 'all').trim().toLowerCase() || 'all';
          renderIncomeSection();
        });
      });
    }
    var tableRows = rows;
    if (monthFilter !== 'all') {
      tableRows = rows.filter(function (row) {
        return incomeMonthKey(row.date) === monthFilter;
      });
    }
    if ($('income-record-count')) $('income-record-count').textContent = String(tableRows.length) + (tableRows.length === 1 ? ' event' : ' events');
    var summaryRows = monthFilter === 'all' ? rows : tableRows;
    var summaryYear = thisYear;
    var summaryMonth = thisMonth;
    if (monthFilter !== 'all') {
      var monthBits = safeString(monthFilter).split('-');
      var parsedYear = Number(monthBits[0]);
      var parsedMonth = Number(monthBits[1]);
      if (Number.isFinite(parsedYear) && Number.isFinite(parsedMonth)) {
        summaryYear = parsedYear;
        summaryMonth = Math.max(0, parsedMonth - 1);
      }
    }
    function totalsFor(status, inMonth) {
      var out = {};
      summaryRows.forEach(function (row) {
        if (!row.date || row.revenueStatus !== status) return;
        if (row.date.getFullYear() !== summaryYear) return;
        if (inMonth && row.date.getMonth() !== summaryMonth) return;
        if (!Number.isFinite(row.amount) || row.amount <= 0) return;
        out[row.currency] = (Number(out[row.currency]) || 0) + row.amount;
      });
      return out;
    }
    var confirmedMonth = totalsFor('confirmed', true);
    var potentialMonth = totalsFor('potential', true);
    var confirmedYear = totalsFor('confirmed', false);
    var potentialYear = totalsFor('potential', false);
    var currenciesInScope = {};
    summaryRows.forEach(function (row) {
      if (!row.currency) return;
      currenciesInScope[row.currency] = true;
    });
    var currencyKeys = Object.keys(currenciesInScope).sort();
    var currencyHint = currencyKeys.length ? ('Currencies in scope: ' + currencyKeys.join(', ')) : 'Currencies in scope: —';
    var monthLabel = monthFilter === 'all' ? 'this month' : incomeMonthLabel(monthFilter);
    var yearLabel = monthFilter === 'all' ? 'this year' : 'filtered view';
    summaryBox.innerHTML = [
      '<div class="income-summary-card income-summary-card--ok"><span>Confirmed ' + escapeHtml(monthLabel) + '</span><strong>' + escapeHtml(incomeTotalsLabel(confirmedMonth)) + '</strong><small>' + escapeHtml(currencyHint) + '</small></div>',
      '<div class="income-summary-card income-summary-card--warn"><span>Potential ' + escapeHtml(monthLabel) + '</span><strong>' + escapeHtml(incomeTotalsLabel(potentialMonth)) + '</strong><small>' + escapeHtml(currencyHint) + '</small></div>',
      '<div class="income-summary-card income-summary-card--ok"><span>Confirmed ' + escapeHtml(yearLabel) + '</span><strong>' + escapeHtml(incomeTotalsLabel(confirmedYear)) + '</strong><small>' + escapeHtml(currencyHint) + '</small></div>',
      '<div class="income-summary-card income-summary-card--warn"><span>Potential ' + escapeHtml(yearLabel) + '</span><strong>' + escapeHtml(incomeTotalsLabel(potentialYear)) + '</strong><small>' + escapeHtml(currencyHint) + '</small></div>'
    ].join('');
    if (!tableRows.length) {
      tableBody.innerHTML = '<tr><td colspan="9" class="muted">No revenue rows yet. Add revenue fields in Calendar events to populate this view.</td></tr>';
      return;
    }
    var groups = [];
    var groupMap = {};
    tableRows.forEach(function (row) {
      var key = incomeMonthKey(row.date);
      if (!groupMap[key]) {
        groupMap[key] = {
          key: key,
          label: incomeMonthLabel(key),
          rows: [],
          confirmed: {},
          potential: {}
        };
        groups.push(groupMap[key]);
      }
      groupMap[key].rows.push(row);
      if (Number.isFinite(row.amount) && row.amount > 0) {
        if (row.revenueStatus === 'confirmed') {
          groupMap[key].confirmed[row.currency] = (Number(groupMap[key].confirmed[row.currency]) || 0) + row.amount;
        } else if (row.revenueStatus === 'potential') {
          groupMap[key].potential[row.currency] = (Number(groupMap[key].potential[row.currency]) || 0) + row.amount;
        }
      }
    });
    var tableParts = [];
    groups.forEach(function (group) {
      tableParts.push('<tr class="income-month-row"><td colspan="9"><div class="income-month-row__line"><strong>' + escapeHtml(group.label) + '</strong><span class="income-month-row__count">' + escapeHtml(String(group.rows.length) + (group.rows.length === 1 ? ' event' : ' events')) + '</span></div></td></tr>');
      group.rows.forEach(function (row) {
      var e = row.event || {};
      var dateLabel = incomeLocalDateLabel(row.date);
      var amountLabel = Number.isFinite(row.amount) && row.amount > 0 ? row.amount.toLocaleString(undefined, { minimumFractionDigits: row.amount % 1 ? 2 : 0, maximumFractionDigits: 2 }) : 'Not set';
      var statusClass = row.revenueStatus === 'confirmed' ? 'ok' : (row.revenueStatus === 'potential' ? 'warn' : 'info');
      var statusLabel = row.revenueStatus === 'unknown' ? 'not set' : row.revenueStatus;
      var eventTitle = safeString(e.title).trim() || '(untitled)';
      var eventSub = [safeString(e.type).trim(), safeString(e.status).trim()].filter(Boolean).join(' · ');
      var openId = safeString(e.id).trim();
      var rowClass = row.revenueStatus === 'confirmed' ? 'income-row income-row--confirmed' : (row.revenueStatus === 'potential' ? 'income-row income-row--potential' : 'income-row income-row--unknown');
      tableParts.push('<tr class="' + rowClass + '"' + (openId ? (' data-income-open-calendar-row="' + escapeAttr(openId) + '"') : '') + '>' +
        '<td>' + escapeHtml(dateLabel) + '</td>' +
        '<td><strong>' + escapeHtml(eventTitle) + '</strong>' + (eventSub ? '<div class="income-table__sub">' + escapeHtml(eventSub) + '</div>' : '') + '</td>' +
        '<td>' + escapeHtml(safeString(e.venue).trim() || 'Not set') + '</td>' +
        '<td>' + escapeHtml(safeString(e.city).trim() || 'Not set') + '</td>' +
        '<td>' + escapeHtml(amountLabel) + '</td>' +
        '<td>' + escapeHtml(row.currency || 'Not set') + '</td>' +
        '<td><span class="pill ' + escapeAttr(statusClass) + '">' + escapeHtml(statusLabel) + '</span></td>' +
        '<td>' + escapeHtml(row.notes || 'Not set') + '</td>' +
        '<td>' + (openId ? ('<button type="button" class="income-open-calendar" data-income-open-calendar="' + escapeAttr(openId) + '">Open in Calendar</button>') : 'Not set') + '</td>' +
      '</tr>');
      });
      tableParts.push('<tr class="income-month-subtotal"><td colspan="9"><div class="income-month-subtotal__line"><span><strong>Confirmed subtotal:</strong> ' + escapeHtml(incomeTotalsLabel(group.confirmed)) + '</span><span><strong>Potential subtotal:</strong> ' + escapeHtml(incomeTotalsLabel(group.potential)) + '</span></div></td></tr>');
    });
    tableBody.innerHTML = tableParts.join('');
    tableBody.querySelectorAll('[data-income-open-calendar]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        incomeOpenCalendarEvent(btn.getAttribute('data-income-open-calendar'));
      });
    });
    tableBody.querySelectorAll('[data-income-open-calendar-row]').forEach(function (rowEl) {
      rowEl.addEventListener('click', function (evt) {
        var button = evt.target && evt.target.closest ? evt.target.closest('[data-income-open-calendar]') : null;
        if (button) return;
        incomeOpenCalendarEvent(rowEl.getAttribute('data-income-open-calendar-row'));
      });
    });
  }
  function loadIncome() {
    state.perfs = loadDoc('rg_perfs', []);
    if (!Array.isArray(state.perfs)) state.perfs = [];
    renderIncomeSection();
  }
  function savePerfHeader() { saveDoc('perf_' + state.lang, { h2: safeString($('perf-h2').value), intro: safeString($('perf-intro').value) }); }
  function savePerfEvents() {
    state.perfs = state.perfs.filter(function (e) { return isObject(e); });
    saveDoc('rg_perfs', state.perfs);
    if (state.section === 'income') renderIncomeSection();
    setPerfTxResult('Saved event list. Translation tool changes are now persisted.', 'ok');
  }
  function normalizePastPerfImportItem(raw, idx) {
    var o = isObject(raw) ? raw : {};
    var idSeed = safeString(o.id).trim();
    var date = safeString(o.date).trim();
    var time = safeString(o.time).trim();
    var title = safeString(o.title).trim();
    var place = safeString(o.place != null ? o.place : o.venue).trim();
    var city = safeString(o.city).trim();
    var address = safeString(o.address).trim();
    var description = safeString(o.description).trim();
    var linkText = safeString(o.linkText != null ? o.linkText : o.buttonText).trim();
    var link = safeString(o.link != null ? o.link : o.buttonLink).trim();
    var image = safeString(o.image != null ? o.image : o.image_url).trim();
    return {
      id: idSeed || ('past-' + (idx + 1)),
      date: date,
      time: time,
      title: title,
      place: place,
      city: city,
      address: address,
      description: description,
      linkText: linkText,
      link: link,
      image: image,
      status: 'past',
      private: !!o.private
    };
  }
  function normalizePastPerfImportArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function (item, idx) {
      return normalizePastPerfImportItem(item, idx);
    });
  }
  function parseDateSafe(s) {
    var raw = safeString(s).trim();
    if (!raw) return null;
    var d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    return d;
  }
  function validatePastPerfItem(item, idx) {
    var errors = [];
    if (!isObject(item)) {
      errors.push('Item #' + (idx + 1) + ' is not an object.');
      return errors;
    }
    var rawDate = safeString(item.date).trim();
    if (!rawDate) errors.push('Item #' + (idx + 1) + ' is missing date.');
    else if (!parseDateSafe(rawDate)) errors.push('Item #' + (idx + 1) + ' has invalid date: ' + rawDate);
    return errors;
  }
  function savePastPerfsToStorage() {
    var allErrors = [];
    state.pastPerfs = normalizePastPerfImportArray(state.pastPerfs);
    state.pastPerfs.forEach(function (item, idx) {
      item.status = 'past';
      validatePastPerfItem(item, idx).forEach(function (e) { allErrors.push(e); });
    });
    if (allErrors.length) {
      if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Save failed: ' + allErrors[0];
      alert('Save failed:\n- ' + allErrors.slice(0, 12).join('\n- ') + (allErrors.length > 12 ? '\n- ... and ' + (allErrors.length - 12) + ' more' : ''));
      return false;
    }
    saveDoc('rg_past_perfs', state.pastPerfs);
    if ($('pastperfs-summary')) $('pastperfs-summary').textContent = state.pastPerfs.length ? ('Saved past events: ' + state.pastPerfs.length) : 'No past events saved yet.';
    if ($('pastperfs-preview')) $('pastperfs-preview').value = JSON.stringify(state.pastPerfs.slice(0, 40), null, 2);
    setStatus('Past events saved', 'ok');
    return true;
  }
  function renderPastPerfsEditorList() {
    var box = $('pastperfs-editor-list');
    if (!box) return;
    var arr = Array.isArray(state.pastPerfs) ? state.pastPerfs : [];
    if (!arr.length) {
      box.innerHTML = '<div class="item">No past events saved.</div>';
      return;
    }
    box.innerHTML = arr.map(function (p, idx) {
      var checked = !!state.pastPerfsSelected[idx];
      var title = safeString(p.title).trim() || '(untitled)';
      return '' +
        '<div class="item" data-past-idx="' + idx + '">' +
          '<div class="item-row">' +
            '<input type="checkbox" data-past-select="' + idx + '"' + (checked ? ' checked' : '') + '>' +
            '<div class="item-main">' +
              '<strong>#' + (idx + 1) + ' · ' + escapeHtml(title) + '</strong>' +
            '</div>' +
          '</div>' +
          '<div class="grid two">' +
            '<label>Date<input data-past-field="date" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.date)) + '"></label>' +
            '<label>Time<input data-past-field="time" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.time)) + '"></label>' +
            '<label>Title<input data-past-field="title" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.title)) + '"></label>' +
            '<label>Place<input data-past-field="place" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.place)) + '"></label>' +
            '<label>City<input data-past-field="city" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.city)) + '"></label>' +
            '<label>Address<input data-past-field="address" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.address)) + '"></label>' +
            '<label>Link text<input data-past-field="linkText" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.linkText)) + '"></label>' +
            '<label>Link<input data-past-field="link" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.link)) + '"></label>' +
            '<label>Image<input data-past-field="image" data-past-idx="' + idx + '" value="' + escapeHtml(safeString(p.image)) + '"></label>' +
            '<label>Private<select data-past-field="private" data-past-idx="' + idx + '"><option value="false"' + (!p.private ? ' selected' : '') + '>false</option><option value="true"' + (p.private ? ' selected' : '') + '>true</option></select></label>' +
          '</div>' +
          '<label>Description<textarea rows="3" data-past-field="description" data-past-idx="' + idx + '">' + escapeHtml(safeString(p.description)) + '</textarea></label>' +
          '<div class="toolbar">' +
            '<button type="button" data-past-action="save" data-past-idx="' + idx + '">Save item changes</button>' +
            '<button type="button" data-past-action="up" data-past-idx="' + idx + '">Move up</button>' +
            '<button type="button" data-past-action="down" data-past-idx="' + idx + '">Move down</button>' +
            '<button type="button" class="danger" data-past-action="delete" data-past-idx="' + idx + '">Delete item</button>' +
          '</div>' +
        '</div>';
    }).join('');
  }
  function collectPastPerfItemFromUi(idx) {
    function v(field) {
      var el = document.querySelector('[data-past-field="' + field + '"][data-past-idx="' + idx + '"]');
      return el ? safeString(el.value) : '';
    }
    return {
      id: safeString(state.pastPerfs[idx] && state.pastPerfs[idx].id).trim() || ('past-' + (idx + 1)),
      date: v('date').trim(),
      time: v('time').trim(),
      title: v('title').trim(),
      place: v('place').trim(),
      city: v('city').trim(),
      address: v('address').trim(),
      description: v('description').trim(),
      linkText: v('linkText').trim(),
      link: v('link').trim(),
      image: v('image').trim(),
      status: 'past',
      private: v('private') === 'true'
    };
  }
  function savePastPerfItemAt(idx) {
    if (idx < 0 || idx >= state.pastPerfs.length) return;
    var next = collectPastPerfItemFromUi(idx);
    var errors = validatePastPerfItem(next, idx);
    if (errors.length) {
      if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Save failed: ' + errors[0];
      alert(errors.join('\n'));
      return;
    }
    state.pastPerfs[idx] = next;
    if (savePastPerfsToStorage()) {
      if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Item #' + (idx + 1) + ' saved.';
      renderPastPerfsEditorList();
    }
  }
  function selectedPastPerfIndices() {
    return Object.keys(state.pastPerfsSelected || {}).filter(function (k) { return !!state.pastPerfsSelected[k]; }).map(function (k) { return Number(k); }).filter(function (n) { return Number.isFinite(n); }).sort(function (a, b) { return a - b; });
  }
  function validatePastPerfsImportArray(arr) {
    var errors = [];
    if (!Array.isArray(arr)) {
      errors.push('Root JSON must be an array.');
      return errors;
    }
    arr.forEach(function (item, idx) {
      if (!isObject(item)) {
        errors.push('Item #' + (idx + 1) + ' is not an object.');
        return;
      }
      var rawDate = safeString(item.date).trim();
      if (!rawDate) {
        errors.push('Item #' + (idx + 1) + ' is missing date.');
      } else {
        var d = new Date(rawDate);
        if (isNaN(d.getTime())) errors.push('Item #' + (idx + 1) + ' has invalid date: ' + rawDate);
      }
    });
    return errors;
  }
  function loadPastPerfsSection() {
    state.pastPerfs = loadDoc('rg_past_perfs', []);
    if (!Array.isArray(state.pastPerfs)) state.pastPerfs = [];
    state.pastPerfs = normalizePastPerfImportArray(state.pastPerfs);
    clearSelected(state.pastPerfsSelected);
    if ($('pastperfs-import-file')) $('pastperfs-import-file').value = '';
    if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = '';
    if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = '';
    if ($('pastperfs-skipped-note')) {
      $('pastperfs-skipped-note').textContent = '';
      $('pastperfs-skipped-note').style.display = 'none';
    }
    if ($('pastperfs-summary')) {
      $('pastperfs-summary').textContent = state.pastPerfs.length
        ? ('Saved past events: ' + state.pastPerfs.length)
        : 'No past events saved yet.';
    }
    if ($('pastperfs-preview')) {
      $('pastperfs-preview').value = JSON.stringify(state.pastPerfs.slice(0, 40), null, 2);
    }
    renderPastPerfsEditorList();
  }
  function clearPastPerfsDataset() {
    if (!window.confirm('Clear all past events? This replaces rg_past_perfs with an empty list.')) return;
    saveDoc('rg_past_perfs', []);
    state.pastPerfs = [];
    if ($('pastperfs-summary')) $('pastperfs-summary').textContent = 'No past events saved yet.';
    if ($('pastperfs-preview')) $('pastperfs-preview').value = '[]';
    if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = 'Imported: 0 · Skipped: 0 · Total processed: 0';
    if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Past events cleared.';
    if ($('pastperfs-skipped-note')) {
      $('pastperfs-skipped-note').textContent = '';
      $('pastperfs-skipped-note').style.display = 'none';
    }
    clearSelected(state.pastPerfsSelected);
    renderPastPerfsEditorList();
    setStatus('Past events cleared', 'ok');
    pushActivitySummary('Past events cleared', ['rg_past_perfs replaced with an empty array.']);
  }
  function importPastPerfsJson() {
    var input = $('pastperfs-import-file');
    if (!input || !input.files || !input.files[0]) {
      alert('Choose a JSON file first.');
      return;
    }
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result || '[]'));
        var validationErrors = validatePastPerfsImportArray(parsed);
        if (validationErrors.length) {
          throw new Error('Validation failed:\n- ' + validationErrors.slice(0, 12).join('\n- ') + (validationErrors.length > 12 ? '\n- ... and ' + (validationErrors.length - 12) + ' more' : ''));
        }
        if (!window.confirm('Import will REPLACE the full rg_past_perfs dataset.\n\nContinue?')) return;
        var total = parsed.length;
        var normalized = normalizePastPerfImportArray(parsed);
        var imported = normalized.length;
        var skipped = Math.max(0, total - imported);
        saveDoc('rg_past_perfs', normalized);
        state.pastPerfs = normalized;
        if ($('pastperfs-summary')) $('pastperfs-summary').textContent = 'Saved past events: ' + normalized.length;
        if ($('pastperfs-preview')) $('pastperfs-preview').value = JSON.stringify(normalized.slice(0, 40), null, 2);
        if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = 'Imported: ' + imported + ' · Skipped: ' + skipped + ' · Total processed: ' + total;
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Import complete: ' + normalized.length + ' past event(s) saved (full dataset replaced).';
        if ($('pastperfs-skipped-note')) {
          if (skipped > 0) {
            $('pastperfs-skipped-note').textContent = skipped + ' item(s) were skipped during import.';
            $('pastperfs-skipped-note').style.display = '';
          } else {
            $('pastperfs-skipped-note').textContent = '';
            $('pastperfs-skipped-note').style.display = 'none';
          }
        }
        setStatus('Past events imported', 'ok');
        pushActivitySummary('Past events imported', [normalized.length + ' item(s) saved to rg_past_perfs.']);
        clearSelected(state.pastPerfsSelected);
        renderPastPerfsEditorList();
        alert('Import complete. ' + normalized.length + ' past event(s) imported.');
      } catch (err) {
        if ($('pastperfs-import-summary')) $('pastperfs-import-summary').textContent = '';
        if ($('pastperfs-skipped-note')) {
          $('pastperfs-skipped-note').textContent = '';
          $('pastperfs-skipped-note').style.display = 'none';
        }
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Import failed: ' + safeString(err.message);
        setStatus('Past events import failed', 'err');
        alert('Import failed: ' + safeString(err.message));
      }
    };
    reader.readAsText(file);
  }

  function getPhotoCaption(type, idx) {
    if (idx < 0) return { caption: '', alt: '', photographer: '' };
    var raw = state.photoCaptions[type + '_' + idx];
    if (typeof raw === 'string') return { caption: safeString(raw), alt: '', photographer: '' };
    if (!isObject(raw)) return { caption: '', alt: '', photographer: '' };
    return {
      caption: safeString(raw.caption),
      alt: safeString(raw.alt),
      photographer: safeString(raw.photographer)
    };
  }
  function setPhotoCaption(type, idx, caption, alt, photographer) {
    state.photoCaptions[type + '_' + idx] = {
      caption: safeString(caption),
      alt: safeString(alt),
      photographer: safeString(photographer)
    };
  }
  function shiftPhotoCaptionsAfterDelete(type, deletedIndex) {
    var next = {};
    Object.keys(state.photoCaptions).forEach(function (k) {
      if (k.indexOf(type + '_') !== 0) { next[k] = state.photoCaptions[k]; return; }
      var i = Number(k.split('_')[1]);
      if (!Number.isFinite(i)) return;
      if (i < deletedIndex) next[k] = state.photoCaptions[k];
      else if (i > deletedIndex) next[type + '_' + (i - 1)] = state.photoCaptions[k];
    });
    state.photoCaptions = next;
  }
  /** Before inserting a new photo at insertAt, shift caption keys at indices >= insertAt up by one (keeps captions aligned with URLs). */
  function shiftPhotoCaptionsAfterInsert(type, insertAt) {
    var prefix = type + '_';
    var next = {};
    Object.keys(state.photoCaptions).forEach(function (k) {
      if (k.indexOf(prefix) !== 0) {
        next[k] = state.photoCaptions[k];
        return;
      }
      var i = Number(k.slice(prefix.length));
      if (!Number.isFinite(i)) return;
      if (i >= insertAt) next[prefix + (i + 1)] = state.photoCaptions[k];
      else next[k] = state.photoCaptions[k];
    });
    state.photoCaptions = next;
  }
  function safeMediaVideos(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    if (!Array.isArray(d.videos)) d.videos = [];
    d.h2 = safeString(d.h2);
    function inferRepCat(row) {
      var raw = safeString(row && row.repertoireCat);
      if (raw === 'tango_crossover') raw = '';
      if (raw) return raw;
      var blob = [row && row.tag, row && row.title, row && row.sub].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      if (/\btango\b|milonga|bandoneon|bandoneón|tango argentin|tango argentino|tangos\b|tango-loft|tango loft/.test(blob)) return 'tango';
      if (/\boperetta\b|\boperete\b|\bopereta\b|fledermaus|lustige witwe|land des lächelns|csardas|csárdás|zarewitsch|bajadere|weisses rössl/.test(blob)) return 'operetta';
      if (/\blied\b|kunstlied|art song|lorelei|schubert|schumann|wolf|liederabend|mélodie|melodie|canción de arte|kunstlie/.test(blob)) return 'lied';
      if (/sacred|oratorio|requiem|\bmass\b|bach|motet|passion|stabat|kirche|kirch|church|cathedral|\bmesse\b|geistlich|sacro|sacrée|sacra/.test(blob)) return 'concert_sacred';
      return 'opera';
    }
    function normalizeVideoGroupValue(v, row) {
      var raw = safeString(v);
      var rep = inferRepCat(row);
      if (raw === 'tango' || rep === 'tango') return 'tango';
      if (raw === 'opera_operetta' || raw === 'recital_lied') return raw;
      if (raw === 'gala_crossover') {
        if (rep === 'opera' || rep === 'operetta') return 'opera_operetta';
        return 'recital_lied';
      }
      if (raw === 'opera_lied') {
        if (rep === 'lied' || rep === 'concert_sacred' || rep === 'crossover') return 'recital_lied';
        return 'opera_operetta';
      }
      if (rep === 'lied' || rep === 'concert_sacred' || rep === 'crossover') return 'recital_lied';
      return 'opera_operetta';
    }
    d.videos = d.videos.filter(function (v) { return isObject(v); }).map(function (v) {
      return {
        id: safeString(v.id),
        tag: safeString(v.tag),
        title: safeString(v.title),
        sub: safeString(v.sub),
        composer: safeString(v.composer),
        repertoireCat: safeString(v.repertoireCat),
        hidden: !!v.hidden,
        group: normalizeVideoGroupValue(v.group || 'opera_operetta', v),
        featured: !!v.featured,
        customThumb: safeString(v.customThumb),
        editorialStatus: safeString(v.editorialStatus || (v.hidden ? 'hidden' : 'draft'))
      };
    });
    return d;
  }
  function safeMediaAudio(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    if (!Array.isArray(d.items)) d.items = [];
    d.h2 = safeString(d.h2);
    d.sub = safeString(d.sub);
    function inferRepCat(row) {
      var raw = safeString(row && row.repertoireCat);
      if (raw) return raw;
      var blob = [row && row.tag, row && row.title, row && row.subline, row && row.composer].map(function (x) {
        return safeString(x).toLowerCase();
      }).join(' ');
      if (/\btango\b|milonga|bandoneon|bandoneón|tango argentin|tango argentino|tangos\b/.test(blob)) return 'tango';
      if (/\boperetta\b|\boperete\b|\bopereta\b|fledermaus|lustige witwe|land des lächelns|csardas|csárdás|zarewitsch|bajadere|weisses rössl/.test(blob)) return 'operetta';
      if (/\blied\b|kunstlied|art song|lorelei|schubert|schumann|wolf|liederabend|mélodie|melodie|canción de arte/.test(blob)) return 'lied';
      if (/sacred|oratorio|requiem|\bmass\b|bach|motet|passion|stabat|\bmesse\b|geistlich|sacro|sacrée|sacra/.test(blob)) return 'concert_sacred';
      return 'opera';
    }
    function normalizeAudioGroupValue(v, row) {
      var raw = safeString(v);
      var rep = inferRepCat(row);
      if (raw === 'tango' || rep === 'tango') return 'tango';
      if (raw === 'opera_operetta' || raw === 'recital_lied' || raw === 'sacred_oratorio') return raw;
      if (rep === 'concert_sacred') return 'sacred_oratorio';
      if (rep === 'lied' || rep === 'crossover') return 'recital_lied';
      return 'opera_operetta';
    }
    d.items = d.items.filter(function (v) { return isObject(v); }).map(function (v) {
      return {
        provider: safeString(v.provider || 'soundcloud'),
        embedUrl: safeString(v.embedUrl),
        externalUrl: safeString(v.externalUrl),
        coverImage: safeString(v.coverImage),
        title: safeString(v.title),
        subline: safeString(v.subline != null ? v.subline : v.sub),
        tag: safeString(v.tag),
        composer: safeString(v.composer),
        repertoireCat: safeString(v.repertoireCat),
        hidden: !!v.hidden,
        group: normalizeAudioGroupValue(v.group || 'opera_operetta', v),
        featured: !!v.featured,
        editorialStatus: safeString(v.editorialStatus || (v.hidden ? 'hidden' : 'draft'))
      };
    });
    return d;
  }
  /** Canonical media videos live in rg_vid. If that doc is empty, merge from legacy rg_vid_en (Firestore/import quirk) so admin and exports stay aligned; saves still go to rg_vid only. */
  function mergeRgVidRead(primaryRaw, legacyEnRaw) {
    var primary = safeMediaVideos(primaryRaw || { h2: '', videos: [] });
    if (primary.videos && primary.videos.length) return primary;
    var leg = safeMediaVideos(legacyEnRaw || { h2: '', videos: [] });
    if (leg.videos && leg.videos.length) return leg;
    return primary;
  }
  function describeMediaVideosProvenance() {
    var canonical = safeMediaVideos(loadDoc('rg_vid', { h2: '', videos: [] }));
    if (canonical.videos && canonical.videos.length) {
      return 'Public videos are currently using the canonical saved video list.';
    }
    var legacy = safeMediaVideos(loadDoc('rg_vid_en', null));
    if (legacy.videos && legacy.videos.length) {
      return 'Public videos are currently falling back to the legacy EN video list because the canonical saved video list is empty.';
    }
    return 'No saved public video list is currently available.';
  }
  function renderMediaVideosProvenance() {
    var el = $('media-vid-provenance');
    if (!el) return;
    el.textContent = describeMediaVideosProvenance();
  }
  function safePhotos(raw) {
    var d = isObject(raw) ? clone(raw) : {};
    ['s', 't', 'b'].forEach(function (k) {
      if (!Array.isArray(d[k])) d[k] = [];
      d[k] = d[k].map(function (x) {
        var url = safeString(isObject(x) ? x.url : x).trim();
        if (!url) return null;
        var orientation = safeString(isObject(x) ? x.orientation : '').trim().toLowerCase();
        if (orientation !== 'portrait' && orientation !== 'landscape') orientation = '';
        var focus = safeString(isObject(x) ? (x.focus != null ? x.focus : x.objectPosition) : '').trim();
        return { url: url, orientation: orientation, focus: focus };
      }).filter(Boolean);
    });
    return d;
  }
  function getPhotoEntry(type, idx) {
    var arr = state.photosData[type] || [];
    var raw = arr[idx];
    if (isObject(raw)) {
      return {
        url: safeString(raw.url).trim(),
        orientation: (function (v) {
          v = safeString(v).trim().toLowerCase();
          return v === 'portrait' || v === 'landscape' ? v : '';
        })(raw.orientation),
        focus: safeString(raw.focus != null ? raw.focus : raw.objectPosition).trim()
      };
    }
    return { url: safeString(raw).trim(), orientation: '', focus: '' };
  }
  function setPhotoEntry(type, idx, entry) {
    if (!Array.isArray(state.photosData[type])) state.photosData[type] = [];
    state.photosData[type][idx] = {
      url: safeString(entry && entry.url).trim(),
      orientation: (function (v) {
        v = safeString(v).trim().toLowerCase();
        return v === 'portrait' || v === 'landscape' ? v : '';
      })(entry && entry.orientation),
      focus: safeString(entry && entry.focus).trim()
    };
  }
  function inferPhotoOrientation(width, height) {
    var w = Number(width) || 0;
    var h = Number(height) || 0;
    if (!(w > 0 && h > 0)) return '';
    return w >= h ? 'landscape' : 'portrait';
  }
  function updatePreviewFocusMarker(wrap, focusValue) {
    if (!wrap) return;
    var raw = safeString(focusValue).trim();
    var m = raw.match(/^\s*([0-9.]+)%\s+([0-9.]+)%\s*$/);
    wrap.style.setProperty('--focus-x', m ? m[1] + '%' : '50%');
    wrap.style.setProperty('--focus-y', m ? m[2] + '%' : '50%');
  }
  function applyPreviewFocusFromPointer(wrap, input, previewImg, evt) {
    if (!wrap || !input || !previewImg) return;
    var rect = wrap.getBoundingClientRect();
    if (!(rect.width > 0 && rect.height > 0)) return;
    var x = Math.max(0, Math.min(rect.width, evt.clientX - rect.left));
    var y = Math.max(0, Math.min(rect.height, evt.clientY - rect.top));
    var px = Math.round((x / rect.width) * 1000) / 10;
    var py = Math.round((y / rect.height) * 1000) / 10;
    var val = px + '% ' + py + '%';
    input.value = val;
    previewImg.style.objectPosition = val;
    updatePreviewFocusMarker(wrap, val);
    return val;
  }
  function bindPreviewFocusEditor(opts) {
    var wrap = $(opts.wrapId);
    var input = $(opts.inputId);
    var previewImg = $(opts.imgId);
    if (!wrap || !input || !previewImg || wrap.dataset.focusBinder === '1') return;
    wrap.dataset.focusBinder = '1';
    wrap.classList.add('focus-edit');
    updatePreviewFocusMarker(wrap, input.value);
    var dragging = false;
    function applyEvt(evt) {
      var val = applyPreviewFocusFromPointer(wrap, input, previewImg, evt);
      if (typeof opts.onChange === 'function' && val) opts.onChange(val);
    }
    wrap.addEventListener('pointerdown', function (evt) {
      dragging = true;
      try { wrap.setPointerCapture(evt.pointerId); } catch (e) {}
      applyEvt(evt);
    });
    wrap.addEventListener('pointermove', function (evt) {
      if (!dragging) return;
      applyEvt(evt);
    });
    function endDrag(evt) {
      if (!dragging) return;
      dragging = false;
      try { wrap.releasePointerCapture(evt.pointerId); } catch (e) {}
    }
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);
  }
  function setMediaPhotoPreviewMeta(photo, naturalW, naturalH, detected) {
    var meta = $('media-photo-preview-meta');
    if (!meta) return;
    var parts = [];
    if (naturalW > 0 && naturalH > 0) parts.push('Detected: ' + naturalW + '×' + naturalH);
    if (detected) parts.push(detected);
    if (safeString(photo && photo.orientation).trim()) parts.push('Saved orientation: ' + safeString(photo.orientation).trim());
    if (safeString(photo && photo.focus).trim()) parts.push('Focus: ' + safeString(photo.focus).trim());
    meta.textContent = parts.length ? parts.join(' · ') : 'Load an image to detect orientation.';
  }
  function preferredOrientationForPhotoType(type) {
    if (type === 's') return 'portrait';
    if (type === 't' || type === 'b') return 'landscape';
    return '';
  }
  function updateMediaPhotoOrientationWarning(photo) {
    var el = $('media-photo-orientation-warn');
    if (!el) return;
    var saved = safeString(photo && photo.orientation).trim().toLowerCase();
    var pref = preferredOrientationForPhotoType(state.photoType);
    if (!saved || !pref || saved === pref) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }
    var sectionLabel = state.photoType === 's' ? 'Studio' : (state.photoType === 't' ? 'Stage' : 'Backstage');
    el.style.display = '';
    el.textContent = sectionLabel + ' usually works better with ' + pref + ' images. This one may crop more heavily.';
  }
  function updateMediaPhotoSectionSummary() {
    var el = $('media-photo-section-summary');
    if (!el) return;
    var arr = state.photosData[state.photoType] || [];
    var counts = { portrait: 0, landscape: 0, focus: 0 };
    arr.forEach(function (entry, i) {
      var photo = getPhotoEntry(state.photoType, i);
      if (photo.orientation === 'portrait') counts.portrait += 1;
      if (photo.orientation === 'landscape') counts.landscape += 1;
      if (safeString(photo.focus).trim()) counts.focus += 1;
    });
    el.textContent = arr.length + ' photos · ' + counts.portrait + ' portrait · ' + counts.landscape + ' landscape';
  }
  function movePhotoCaptions(type, from, to, totalLen) {
    var caps = [];
    for (var i = 0; i < totalLen; i++) caps.push(clone(getPhotoCaption(type, i)));
    var moved = caps.splice(from, 1)[0];
    caps.splice(to, 0, moved);
    var next = {};
    Object.keys(state.photoCaptions).forEach(function (k) {
      if (k.indexOf(type + '_') !== 0) next[k] = state.photoCaptions[k];
    });
    caps.forEach(function (cap, idx) {
      if (!cap) return;
      if (!safeString(cap.caption).trim() && !safeString(cap.alt).trim() && !safeString(cap.photographer).trim()) return;
      next[type + '_' + idx] = cap;
    });
    state.photoCaptions = next;
  }
  function movePhotoEntry(type, from, to) {
    var arr = state.photosData[type] || [];
    if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return;
    var moved = arr.splice(from, 1)[0];
    arr.splice(to, 0, moved);
    state.photosData[type] = arr;
    movePhotoCaptions(type, from, to, arr.length);
    state.photoIndex = to;
    renderMediaPhotosList();
    renderMediaPhotoEditor();
    markDirty(true, 'Photo order updated');
  }
  function clearPhotoDropClasses(box) {
    if (!box) return;
    box.querySelectorAll('.item.drop-before,.item.drop-after,.item.dragging').forEach(function (el) {
      el.classList.remove('drop-before', 'drop-after', 'dragging');
    });
  }
  function openBulkUrlDialog(onSubmit) {
    var dialog = $('bulkUrlDialog');
    var ta = $('bulkUrlTextarea');
    if (!dialog || !ta) return;
    bulkUrlSubmitHandler = typeof onSubmit === 'function' ? onSubmit : null;
    ta.value = '';
    dialog.hidden = false;
    setTimeout(function () { ta.focus(); }, 0);
  }
  function closeBulkUrlDialog() {
    var dialog = $('bulkUrlDialog');
    var ta = $('bulkUrlTextarea');
    if (dialog) dialog.hidden = true;
    if (ta) ta.value = '';
    bulkUrlSubmitHandler = null;
  }
  function mediaSummaryVideo(v) {
    var t = safeString(v.title) || '(untitled)';
    var g = safeString(v.group || 'opera_operetta')
      .replace('opera_operetta', 'Opera · Operetta')
      .replace('recital_lied', 'Recital · Lied')
      .replace('tango', 'Tango')
      .replace('opera_lied', 'Opera · Operetta')
      .replace('gala_crossover', 'Recital · Lied');
    var flags = [];
    if (v.featured) flags.push('featured');
    if (v.hidden) flags.push('hidden');
    return t + ' · ' + g + (flags.length ? ' · ' + flags.join(', ') : '');
  }
  function mediaSummaryPhoto(entry, i) {
    var photo = isObject(entry) ? entry : { url: entry };
    var shortSrc = safeString(photo.url);
    if (shortSrc.length > 36) shortSrc = shortSrc.slice(0, 33) + '...';
    var cap = getPhotoCaption(state.photoType, i).caption;
    var flags = [];
    if (safeString(photo.orientation).trim()) flags.push(safeString(photo.orientation).trim());
    if (safeString(photo.focus).trim()) flags.push('custom focus');
    return (cap ? cap + ' · ' : '') + shortSrc + (flags.length ? ' · ' + flags.join(', ') : '');
  }
  function mediaSummaryAudio(a) {
    var t = safeString(a.title) || '(untitled)';
    var g = safeString(a.group || 'opera_operetta')
      .replace('opera_operetta', 'Opera · Operetta')
      .replace('recital_lied', 'Recital · Lied')
      .replace('sacred_oratorio', 'Sacred / Oratorio')
      .replace('tango', 'Tango');
    var provider = safeString(a.provider || 'soundcloud');
    var flags = [provider];
    if (a.featured) flags.push('featured');
    if (a.hidden) flags.push('hidden');
    return t + ' · ' + g + ' · ' + flags.join(', ');
  }
  function audioHasEmbed(a) {
    return isValidHttpUrl(safeString(a && a.embedUrl).trim());
  }
  function audioHasExternalLink(a) {
    return isValidHttpUrl(safeString(a && a.externalUrl).trim());
  }
  function audioReadyCheck(a) {
    var issues = [];
    if (!a || !isObject(a)) {
      issues.push('Audio missing');
      return { ok: false, issues: issues };
    }
    if (a.hidden) issues.push('Hidden');
    if (isBlank(a.title)) issues.push('Title missing');
    if (!audioHasEmbed(a) && !audioHasExternalLink(a)) issues.push('Embed or external link missing');
    if (!isBlank(a.embedUrl) && !audioHasEmbed(a)) issues.push('Embed URL looks invalid');
    if (!isBlank(a.externalUrl) && !audioHasExternalLink(a)) issues.push('External URL looks invalid');
    return { ok: issues.length === 0, issues: issues };
  }
  function resolveEffectiveAudioHeadingFields(audioData) {
    var uiEn = loadDoc('rg_ui_en', null);
    var enTable = null;
    try {
      if (state.api && typeof state.api.uiTable === 'function') {
        enTable = state.api.uiTable('en') || null;
      }
    } catch (e) {
      enTable = null;
    }
    var safeAudio = safeMediaAudio(audioData || {});
    return {
      h2:
        safeString(safeAudio.h2).trim() ||
        safeString(uiEn && uiEn['mp.audio.h2']).trim() ||
        safeString(enTable && enTable['mp.audio.h2']).trim(),
      sub:
        safeString(safeAudio.sub).trim() ||
        safeString(uiEn && uiEn['mp.audio.sub']).trim() ||
        safeString(enTable && enTable['mp.audio.sub']).trim()
    };
  }
  function loadMedia() {
    state.vidData = mergeRgVidRead(loadDoc('rg_vid', { h2: '', videos: [] }), loadDoc('rg_vid_en', null));
    state.vidIndex = -1;
    state.audioData = safeMediaAudio(loadDoc('rg_audio', { h2: '', sub: '', items: [] }));
    var effectiveAudio = resolveEffectiveAudioHeadingFields(state.audioData);
    state.audIndex = -1;
    state.photosData = safePhotos(loadDoc('rg_photos', { s: [], t: [], b: [] }));
    state.photoCaptions = loadDoc('rg_photo_captions', {});
    if (!isObject(state.photoCaptions)) state.photoCaptions = {};
    state.photoIndex = -1;
    if ($('media-photo-quick-filter')) $('media-photo-quick-filter').value = state.mediaPhotoQuickFilter || 'all';
    if ($('media-vid-filter')) $('media-vid-filter').value = state.mediaVidFilter || 'all';
    if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').value = state.mediaVidWorkflowFilter || 'all';
    if ($('media-aud-filter')) $('media-aud-filter').value = state.mediaAudFilter || 'all';
    if ($('media-aud-workflow-filter')) $('media-aud-workflow-filter').value = state.mediaAudWorkflowFilter || 'all';
    $('media-vid-h2').value = state.vidData.h2;
    if ($('media-aud-h2')) $('media-aud-h2').value = effectiveAudio.h2;
    if ($('media-aud-sub')) $('media-aud-sub').value = effectiveAudio.sub;
    renderMediaVideosProvenance();
    renderMediaVideosList();
    renderMediaAudioList();
    renderMediaAudioEditor();
    renderMediaPhotosList();
    toggleMediaTab(state.mediaTab || 'videos');
  }
  function toggleMediaTab(tab) {
    state.mediaTab = tab;
    $('mediaTabVideos').classList.toggle('active', tab === 'videos');
    $('mediaTabPhotos').classList.toggle('active', tab === 'photos');
    $('mediaTabAudio').classList.toggle('active', tab === 'audio');
    $('mediaVideosPanel').style.display = tab === 'videos' ? '' : 'none';
    $('mediaPhotosPanel').style.display = tab === 'photos' ? '' : 'none';
    $('mediaAudioPanel').style.display = tab === 'audio' ? '' : 'none';
  }
  function renderMediaVideosList() {
    var box = $('media-vid-list');
    var arr = state.vidData.videos;
    var q = safeString(state.mediaVidSearch).toLowerCase().trim();
    var filter = state.mediaVidFilter || 'all';
    var rows = arr.map(function (v, i) { return { v: v, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.v.title, row.v.composer, row.v.tag, row.v.id].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    }).filter(function (row) {
      if (filter === 'all') return true;
      if (filter === 'visible') return !row.v.hidden;
      if (filter === 'hidden') return !!row.v.hidden;
      if (filter === 'featured') return !!row.v.featured;
      return true;
    }).filter(function (row) {
      var wf = state.mediaVidWorkflowFilter || 'all';
      if (wf === 'all') return true;
      var b = workflowBucketVideo(row.v);
      if (wf === 'ready') return videoReadyCheck(row.v).ok && b !== 'hidden';
      return passesWorkflowFilter(b, wf);
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay videos. Crea uno con "+ Nuevo video".</div>';
      state.vidIndex = -1;
      setSelectionCount('media-vid-selection-count', state.mediaVidSelected);
      renderMediaVideoEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.vidIndex ? 'item active' : 'item';
      var badges = [];
      if (isBlank(row.v.title)) badges.push({ kind: 'warn', label: 'missing title' });
      if (isBlank(row.v.id)) badges.push({ kind: 'warn', label: 'missing video id' });
      if (row.v.hidden) badges.push({ kind: 'err', label: 'hidden' });
      badges.push({ kind: 'warn', label: workflowBucketVideo(row.v) });
      var checked = state.mediaVidSelected[row.i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + row.i + '"><div class="item-row"><input class="row-select" data-idx="' + row.i + '" type="checkbox"' + checked + '><div class="item-main">' + mediaSummaryVideo(row.v) + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('media-vid-selection-count', state.mediaVidSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.mediaVidSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('media-vid-selection-count', state.mediaVidSelected);
      });
    });
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.vidIndex = Number(el.getAttribute('data-idx'));
        renderMediaVideosList();
        renderMediaVideoEditor();
      });
    });
    if (state.vidIndex < 0) {
      state.vidIndex = 0;
      renderMediaVideosList();
      renderMediaVideoEditor();
    }
  }
  function renderMediaVideoEditor() {
    var v = state.vidData.videos[state.vidIndex] || {};
    $('media-vid-id').value = safeString(v.id);
    $('media-vid-title').value = safeString(v.title);
    $('media-vid-sub').value = safeString(v.sub);
    $('media-vid-tag').value = safeString(v.tag);
    $('media-vid-composer').value = safeString(v.composer);
    $('media-vid-group').value = safeString(v.group || 'opera_operetta')
      .replace('opera_lied', 'opera_operetta')
      .replace('gala_crossover', 'recital_lied');
    $('media-vid-repertoireCat').value = safeString(v.repertoireCat);
    $('media-vid-customThumb').value = safeString(v.customThumb);
    $('media-vid-featured').value = v.featured ? 'true' : 'false';
    $('media-vid-hidden').value = v.hidden ? 'true' : 'false';
    setSelectWithCustomValue('media-vid-editorialStatus', safeString(v.editorialStatus || (v.hidden ? 'hidden' : 'draft')), 'draft');
  }
  function persistMediaVideoEditor() {
    if (state.vidIndex < 0) return;
    var v = state.vidData.videos[state.vidIndex] || {};
    v.id = safeString($('media-vid-id').value);
    v.title = safeString($('media-vid-title').value);
    v.sub = safeString($('media-vid-sub').value);
    v.tag = safeString($('media-vid-tag').value);
    v.composer = safeString($('media-vid-composer').value);
    v.group = safeString($('media-vid-group').value || 'opera_operetta');
    v.repertoireCat = safeString($('media-vid-repertoireCat').value);
    v.customThumb = safeString($('media-vid-customThumb').value);
    v.featured = $('media-vid-featured').value === 'true';
    v.hidden = $('media-vid-hidden').value === 'true';
    v.editorialStatus = safeString($('media-vid-editorialStatus').value || (v.hidden ? 'hidden' : 'draft'));
    state.vidData.videos[state.vidIndex] = v;
    renderMediaVideosList();
    markDirty(true, 'Video editado');
  }
  function saveMediaVideos() {
    state.vidData.h2 = safeString($('media-vid-h2').value);
    state.vidData = safeMediaVideos(state.vidData);
    saveDoc('rg_vid', state.vidData);
  }

  function setPhotoType(type) {
    state.photoType = type;
    state.photoIndex = -1;
    ['s', 't', 'b'].forEach(function (x) { $('media-photo-filter-' + x).classList.toggle('active', x === type); });
    renderMediaPhotosList();
  }
  function renderMediaPhotosList() {
    var box = $('media-photo-list');
    var arr = state.photosData[state.photoType] || [];
    var q = safeString(state.mediaPhotoSearch).toLowerCase().trim();
    var quick = state.mediaPhotoQuickFilter || 'all';
    var rows = arr.map(function (entry, i) { return { entry: getPhotoEntry(state.photoType, i), i: i }; }).filter(function (row) {
      if (!q) return true;
      var c = getPhotoCaption(state.photoType, row.i);
      var hay = [row.entry.url, row.entry.orientation, row.entry.focus, c.caption, c.alt, c.photographer].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    }).filter(function (row) {
      if (quick === 'all') return true;
      if (quick === 'portrait') return row.entry.orientation === 'portrait';
      if (quick === 'landscape') return row.entry.orientation === 'landscape';
      if (quick === 'focus') return !!safeString(row.entry.focus).trim();
      return true;
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay fotos en este grupo. Usa "+ Add by URL".</div>';
      state.photoIndex = -1;
      updateMediaPhotoSectionSummary();
      renderMediaPhotoEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.photoIndex ? 'item active' : 'item';
      var badges = [];
      if (isBlank(row.entry.url)) badges.push({ kind: 'warn', label: 'missing image' });
      var thumbStyle = row.entry.focus ? ' style="object-position:' + row.entry.focus.replace(/"/g, '&quot;') + '"' : '';
      return (
        '<div class="' + cls + '" data-idx="' + row.i + '" draggable="true">' +
        '<div class="item-row">' +
        '<span class="item-handle" title="Drag to reorder">⋮⋮</span>' +
        '<div class="item-thumb">' +
        '<img src="' + safeString(row.entry.url).replace(/"/g, '&quot;') + '"' + thumbStyle + ' alt="">' +
        '</div>' +
        '<div class="item-main">' + mediaSummaryPhoto(row.entry, row.i) + badgesHtml(badges) + '</div>' +
        '</div>' +
        '</div>'
      );
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.photoIndex = Number(el.getAttribute('data-idx'));
        renderMediaPhotosList();
        renderMediaPhotoEditor();
      });
      el.addEventListener('dragstart', function (evt) {
        mediaPhotoDragIndex = Number(el.getAttribute('data-idx'));
        el.classList.add('dragging');
        if (evt.dataTransfer) evt.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragover', function (evt) {
        evt.preventDefault();
        if (mediaPhotoDragIndex < 0) return;
        clearPhotoDropClasses(box);
        var rect = el.getBoundingClientRect();
        var before = evt.clientY < rect.top + rect.height / 2;
        el.classList.add(before ? 'drop-before' : 'drop-after');
      });
      el.addEventListener('dragleave', function () {
        el.classList.remove('drop-before', 'drop-after');
      });
      el.addEventListener('drop', function (evt) {
        evt.preventDefault();
        var target = Number(el.getAttribute('data-idx'));
        if (mediaPhotoDragIndex < 0 || target < 0) return;
        var rect = el.getBoundingClientRect();
        var before = evt.clientY < rect.top + rect.height / 2;
        var dest = before ? target : target + 1;
        if (mediaPhotoDragIndex < dest) dest -= 1;
        clearPhotoDropClasses(box);
        movePhotoEntry(state.photoType, mediaPhotoDragIndex, Math.max(0, Math.min((state.photosData[state.photoType] || []).length - 1, dest)));
        mediaPhotoDragIndex = -1;
      });
      el.addEventListener('dragend', function () {
        mediaPhotoDragIndex = -1;
        clearPhotoDropClasses(box);
      });
    });
    if (state.photoIndex < 0) {
      state.photoIndex = 0;
      renderMediaPhotosList();
      renderMediaPhotoEditor();
    }
    updateMediaPhotoSectionSummary();
  }
  function renderMediaPhotoEditor() {
    var photo = getPhotoEntry(state.photoType, state.photoIndex);
    var c = getPhotoCaption(state.photoType, state.photoIndex);
    $('media-photo-url').value = safeString(photo.url);
    $('media-photo-orientation').value = safeString(photo.orientation);
    $('media-photo-focus').value = safeString(photo.focus);
    $('media-photo-caption').value = safeString(c.caption);
    $('media-photo-alt').value = safeString(c.alt);
    $('media-photo-photographer').value = safeString(c.photographer);
    $('media-photo-preview').src = safeString(photo.url);
    $('media-photo-preview').style.objectFit = 'cover';
    $('media-photo-preview').style.objectPosition = safeString(photo.focus) || 'center center';
    updatePreviewFocusMarker($('media-photo-preview-wrap'), safeString(photo.focus));
    setMediaPhotoPreviewMeta(photo, $('media-photo-preview').naturalWidth || 0, $('media-photo-preview').naturalHeight || 0, '');
    updateMediaPhotoOrientationWarning(photo);
  }
  function persistMediaPhotoEditor() {
    if (state.photoIndex < 0) return;
    setPhotoEntry(state.photoType, state.photoIndex, {
      url: $('media-photo-url').value,
      orientation: $('media-photo-orientation').value,
      focus: $('media-photo-focus').value
    });
    setPhotoCaption(state.photoType, state.photoIndex, $('media-photo-caption').value, $('media-photo-alt').value, $('media-photo-photographer').value);
    renderMediaPhotosList();
    renderMediaPhotoEditor();
    markDirty(true, 'Foto editada');
  }
  function saveMediaPhotos() {
    state.photosData = safePhotos(state.photosData);
    saveDoc('rg_photos', state.photosData);
    saveDoc('rg_photo_captions', state.photoCaptions);
  }
  function renderMediaAudioList() {
    var box = $('media-aud-list');
    if (!box) return;
    var arr = state.audioData.items || [];
    var q = safeString(state.mediaAudSearch).toLowerCase().trim();
    var filter = state.mediaAudFilter || 'all';
    var rows = arr.map(function (a, i) { return { a: a, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.a.title, row.a.composer, row.a.tag, row.a.provider, row.a.embedUrl].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    }).filter(function (row) {
      if (filter === 'all') return true;
      if (filter === 'visible') return !row.a.hidden;
      if (filter === 'hidden') return !!row.a.hidden;
      if (filter === 'featured') return !!row.a.featured;
      return true;
    }).filter(function (row) {
      var wf = state.mediaAudWorkflowFilter || 'all';
      if (wf === 'all') return true;
      var bucket = safeString(row.a.editorialStatus || (row.a.hidden ? 'hidden' : 'draft'));
      if (wf === 'ready') return audioReadyCheck(row.a).ok && bucket !== 'hidden';
      return bucket === wf;
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay audios. Crea uno con "+ New audio".</div>';
      state.audIndex = -1;
      renderMediaAudioEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.audIndex ? 'item active' : 'item';
      var badges = [];
      var readiness = audioReadyCheck(row.a);
      if (isBlank(row.a.title)) badges.push({ kind: 'warn', label: 'missing title' });
      if (!audioHasEmbed(row.a) && !audioHasExternalLink(row.a)) badges.push({ kind: 'warn', label: 'missing source' });
      else if (!audioHasEmbed(row.a) && audioHasExternalLink(row.a)) badges.push({ kind: 'warn', label: 'external only' });
      if (!isBlank(row.a.embedUrl) && !audioHasEmbed(row.a)) badges.push({ kind: 'warn', label: 'invalid embed' });
      if (!isBlank(row.a.externalUrl) && !audioHasExternalLink(row.a)) badges.push({ kind: 'warn', label: 'invalid link' });
      if (row.a.hidden) badges.push({ kind: 'err', label: 'hidden' });
      badges.push({ kind: 'warn', label: safeString(row.a.editorialStatus || (row.a.hidden ? 'hidden' : 'draft')) });
      if ((state.mediaAudWorkflowFilter || 'all') === 'ready' && !readiness.ok) badges.push({ kind: 'warn', label: 'not ready' });
      return '<div class="' + cls + '" data-idx="' + row.i + '">' + mediaSummaryAudio(row.a) + badgesHtml(badges) + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.audIndex = Number(el.getAttribute('data-idx'));
        renderMediaAudioList();
        renderMediaAudioEditor();
      });
    });
    if (state.audIndex < 0) {
      state.audIndex = 0;
      renderMediaAudioList();
      renderMediaAudioEditor();
    }
  }
  function renderMediaAudioEditor() {
    if (!$('media-aud-provider')) return;
    var a = state.audioData.items[state.audIndex] || {};
    $('media-aud-provider').value = safeString(a.provider || 'soundcloud');
    $('media-aud-embedUrl').value = safeString(a.embedUrl);
    $('media-aud-externalUrl').value = safeString(a.externalUrl);
    $('media-aud-coverImage').value = safeString(a.coverImage);
    $('media-aud-title').value = safeString(a.title);
    $('media-aud-subline').value = safeString(a.subline);
    $('media-aud-tag').value = safeString(a.tag);
    $('media-aud-composer').value = safeString(a.composer);
    $('media-aud-group').value = safeString(a.group || 'opera_operetta');
    $('media-aud-repertoireCat').value = safeString(a.repertoireCat);
    $('media-aud-featured').value = a.featured ? 'true' : 'false';
    $('media-aud-hidden').value = a.hidden ? 'true' : 'false';
    setSelectWithCustomValue('media-aud-editorialStatus', safeString(a.editorialStatus || (a.hidden ? 'hidden' : 'draft')), 'draft');
  }
  function persistMediaAudioEditor() {
    if (state.audIndex < 0 || !$('media-aud-provider')) return;
    var a = state.audioData.items[state.audIndex] || {};
    a.provider = safeString($('media-aud-provider').value || 'soundcloud');
    a.embedUrl = safeString($('media-aud-embedUrl').value);
    a.externalUrl = safeString($('media-aud-externalUrl').value);
    a.coverImage = safeString($('media-aud-coverImage').value);
    a.title = safeString($('media-aud-title').value);
    a.subline = safeString($('media-aud-subline').value);
    a.tag = safeString($('media-aud-tag').value);
    a.composer = safeString($('media-aud-composer').value);
    a.group = safeString($('media-aud-group').value || 'opera_operetta');
    a.repertoireCat = safeString($('media-aud-repertoireCat').value);
    a.featured = $('media-aud-featured').value === 'true';
    a.hidden = $('media-aud-hidden').value === 'true';
    a.editorialStatus = safeString($('media-aud-editorialStatus').value || (a.hidden ? 'hidden' : 'draft'));
    state.audioData.items[state.audIndex] = a;
    renderMediaAudioList();
    markDirty(true, 'Audio editado');
  }
  function saveMediaAudio() {
    state.audioData.h2 = safeString($('media-aud-h2').value);
    state.audioData.sub = safeString($('media-aud-sub').value);
    state.audioData = safeMediaAudio(state.audioData);
    saveDoc('rg_audio', state.audioData);
    var uiEn = loadDoc('rg_ui_en', null);
    if (!isObject(uiEn)) uiEn = {};
    uiEn['mp.audio.h2'] = state.audioData.h2;
    uiEn['mp.audio.sub'] = state.audioData.sub;
    saveDoc('rg_ui_en', uiEn);
  }
  function mediaReportFiltersLabel() {
    var parts = [];
    var tab = safeString(state.mediaTab || 'videos').trim().toLowerCase();
    parts.push('tab=' + tab);
    if (tab === 'videos') {
      parts.push('visibility=' + safeString(state.mediaVidFilter || 'all'));
      parts.push('workflow=' + safeString(state.mediaVidWorkflowFilter || 'all'));
      if (safeString(state.mediaVidSearch).trim()) parts.push('search="' + safeString(state.mediaVidSearch).trim() + '"');
    } else if (tab === 'audio') {
      parts.push('visibility=' + safeString(state.mediaAudFilter || 'all'));
      parts.push('workflow=' + safeString(state.mediaAudWorkflowFilter || 'all'));
      if (safeString(state.mediaAudSearch).trim()) parts.push('search="' + safeString(state.mediaAudSearch).trim() + '"');
    } else if (tab === 'photos') {
      parts.push('quick=' + safeString(state.mediaPhotoQuickFilter || 'all'));
      if (safeString(state.mediaPhotoSearch).trim()) parts.push('search="' + safeString(state.mediaPhotoSearch).trim() + '"');
    }
    return parts.join(' · ');
  }
  function buildMediaAssetsReportContext() {
    var videosData = safeMediaVideos(state.vidData || loadDoc('rg_vid', { h2: '', videos: [] }));
    var audioData = safeMediaAudio(state.audioData || loadDoc('rg_audio', { h2: '', sub: '', items: [] }));
    var photosData = safePhotos(state.photosData || loadDoc('rg_photos', { s: [], t: [], b: [] }));
    var captions = isObject(state.photoCaptions) ? state.photoCaptions : loadDoc('rg_photo_captions', {});
    if (!isObject(captions)) captions = {};
    var videos = Array.isArray(videosData.videos) ? videosData.videos.slice() : [];
    var audio = Array.isArray(audioData.items) ? audioData.items.slice() : [];
    var photos = [];
    ['s', 't', 'b'].forEach(function (type) {
      var label = type === 's' ? 'Studio' : (type === 't' ? 'Stage' : 'Backstage');
      var arr = Array.isArray(photosData[type]) ? photosData[type] : [];
      arr.forEach(function (raw, idx) {
        var entry = isObject(raw)
          ? { url: safeString(raw.url).trim(), orientation: safeString(raw.orientation).trim(), focus: safeString(raw.focus != null ? raw.focus : raw.objectPosition).trim() }
          : { url: safeString(raw).trim(), orientation: '', focus: '' };
        var capRaw = captions[type + '_' + idx];
        var cap = typeof capRaw === 'string' ? { caption: safeString(capRaw), alt: '', photographer: '' } : (isObject(capRaw) ? {
          caption: safeString(capRaw.caption),
          alt: safeString(capRaw.alt),
          photographer: safeString(capRaw.photographer)
        } : { caption: '', alt: '', photographer: '' });
        photos.push({
          section: label,
          url: entry.url,
          orientation: entry.orientation,
          focus: entry.focus,
          caption: cap.caption,
          alt: cap.alt,
          photographer: cap.photographer
        });
      });
    });
    var videoPublished = 0;
    var videoHidden = 0;
    var videoFeatured = 0;
    videos.forEach(function (v) {
      if (v.hidden) videoHidden += 1;
      if (v.featured) videoFeatured += 1;
      if (normEditorial(v.editorialStatus) === 'published') videoPublished += 1;
    });
    var audioPublished = 0;
    var audioHidden = 0;
    var audioFeatured = 0;
    audio.forEach(function (a) {
      if (a.hidden) audioHidden += 1;
      if (a.featured) audioFeatured += 1;
      if (normEditorial(a.editorialStatus) === 'published') audioPublished += 1;
    });
    return {
      generatedAt: new Date(),
      filtersLabel: mediaReportFiltersLabel(),
      videos: videos,
      audio: audio,
      photos: photos,
      summary: {
        totalVideos: videos.length,
        totalAudio: audio.length,
        totalPhotos: photos.length,
        videoPublished: videoPublished,
        videoHidden: videoHidden,
        videoFeatured: videoFeatured,
        audioPublished: audioPublished,
        audioHidden: audioHidden,
        audioFeatured: audioFeatured
      }
    };
  }
  function mediaAssetsReportHtml(ctx) {
    function shortUrl(url) {
      var v = safeString(url).trim();
      if (v.length <= 72) return v || '—';
      return v.slice(0, 69) + '...';
    }
    var videosHtml = '';
    if (!ctx.videos.length) {
      videosHtml = '<div class="empty">No video assets in the current media inventory.</div>';
    } else {
      videosHtml = '<table><thead><tr><th>Title</th><th>Group</th><th>Composer / Tag</th><th>Featured</th><th>Hidden</th><th>Workflow</th><th>Source</th><th>Notes</th></tr></thead><tbody>' + ctx.videos.map(function (v) {
        var workflow = safeString(v.editorialStatus || (v.hidden ? 'hidden' : 'draft')).trim() || 'draft';
        var source = safeString(v.id).trim() ? ('YouTube: ' + safeString(v.id).trim()) : 'Not set';
        var note = safeString(v.sub).trim();
        if (note.length > 120) note = note.slice(0, 117).trim() + '...';
        return '<tr>' +
          '<td>' + escapeHtml(safeString(v.title).trim() || '(untitled)') + '</td>' +
          '<td>' + escapeHtml(safeString(v.group).trim() || 'opera_operetta') + '</td>' +
          '<td>' + escapeHtml([safeString(v.composer).trim(), safeString(v.tag).trim()].filter(Boolean).join(' · ') || '—') + '</td>' +
          '<td>' + escapeHtml(v.featured ? 'yes' : 'no') + '</td>' +
          '<td>' + escapeHtml(v.hidden ? 'yes' : 'no') + '</td>' +
          '<td>' + escapeHtml(workflow) + '</td>' +
          '<td>' + escapeHtml(source) + '</td>' +
          '<td>' + escapeHtml(note || '—') + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }
    var audioHtml = '';
    if (!ctx.audio.length) {
      audioHtml = '<div class="empty">No audio assets in the current media inventory.</div>';
    } else {
      audioHtml = '<table><thead><tr><th>Title</th><th>Provider</th><th>Group</th><th>Featured</th><th>Hidden</th><th>Workflow</th><th>Source</th><th>Notes</th></tr></thead><tbody>' + ctx.audio.map(function (a) {
        var workflow = safeString(a.editorialStatus || (a.hidden ? 'hidden' : 'draft')).trim() || 'draft';
        var source = audioHasEmbed(a) ? shortUrl(a.embedUrl) : (audioHasExternalLink(a) ? shortUrl(a.externalUrl) : 'Not set');
        var note = [safeString(a.subline).trim(), safeString(a.tag).trim(), safeString(a.composer).trim()].filter(Boolean).join(' · ');
        if (note.length > 120) note = note.slice(0, 117).trim() + '...';
        return '<tr>' +
          '<td>' + escapeHtml(safeString(a.title).trim() || '(untitled)') + '</td>' +
          '<td>' + escapeHtml(safeString(a.provider).trim() || '—') + '</td>' +
          '<td>' + escapeHtml(safeString(a.group).trim() || 'opera_operetta') + '</td>' +
          '<td>' + escapeHtml(a.featured ? 'yes' : 'no') + '</td>' +
          '<td>' + escapeHtml(a.hidden ? 'yes' : 'no') + '</td>' +
          '<td>' + escapeHtml(workflow) + '</td>' +
          '<td>' + escapeHtml(source) + '</td>' +
          '<td>' + escapeHtml(note || '—') + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }
    var photosHtml = '';
    if (!ctx.photos.length) {
      photosHtml = '<div class="empty">No photo assets in the current media inventory.</div>';
    } else {
      photosHtml = '<table><thead><tr><th>Section</th><th>Caption</th><th>Orientation</th><th>Focus</th><th>Photographer</th><th>Alt</th></tr></thead><tbody>' + ctx.photos.map(function (p) {
        return '<tr>' +
          '<td>' + escapeHtml(p.section || '—') + '</td>' +
          '<td>' + escapeHtml(safeString(p.caption).trim() || '—') + '</td>' +
          '<td>' + escapeHtml(safeString(p.orientation).trim() || '—') + '</td>' +
          '<td>' + escapeHtml(safeString(p.focus).trim() || '—') + '</td>' +
          '<td>' + escapeHtml(safeString(p.photographer).trim() || '—') + '</td>' +
          '<td>' + escapeHtml(safeString(p.alt).trim() || '—') + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }
    return '<!doctype html><html><head><meta charset="utf-8"><title>Media / Assets Report</title>' +
      '<style>' +
      'body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;padding:24px;color:#1c2430;background:#fff}' +
      '.wrap{max-width:1180px;margin:0 auto}' +
      'h1{font-size:22px;margin:0 0 8px}' +
      'h2{font-size:16px;margin:18px 0 8px}' +
      '.meta{font-size:13px;color:#586273;margin:2px 0}' +
      '.summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0 16px}' +
      '.card{border:1px solid #d7dde8;border-radius:10px;padding:10px 12px}' +
      '.card span{display:block;color:#5c677a;font-size:12px}' +
      '.card strong{display:block;margin-top:4px;font-size:15px;color:#1c2430}' +
      'table{width:100%;border-collapse:collapse;font-size:12px}' +
      'th,td{border:1px solid #d7dde8;padding:7px 8px;vertical-align:top;text-align:left}' +
      'th{background:#f4f7fb;font-weight:600}' +
      '.empty{border:1px dashed #c7cfdd;border-radius:10px;padding:14px;color:#5c677a;background:#f8fafe}' +
      '@media print{body{padding:12px}.summary{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
      '</style></head><body><div class="wrap">' +
      '<h1>Media / Assets Report</h1>' +
      '<p class="meta"><strong>Generated:</strong> ' + escapeHtml(ctx.generatedAt.toLocaleString()) + '</p>' +
      '<p class="meta"><strong>Context:</strong> ' + escapeHtml(ctx.filtersLabel || 'tab=videos') + '</p>' +
      '<div class="summary">' +
        '<div class="card"><span>Total videos</span><strong>' + escapeHtml(String(ctx.summary.totalVideos)) + '</strong></div>' +
        '<div class="card"><span>Total audio items</span><strong>' + escapeHtml(String(ctx.summary.totalAudio)) + '</strong></div>' +
        '<div class="card"><span>Total photos</span><strong>' + escapeHtml(String(ctx.summary.totalPhotos)) + '</strong></div>' +
        '<div class="card"><span>Video/Audios published</span><strong>' + escapeHtml(String(ctx.summary.videoPublished)) + ' / ' + escapeHtml(String(ctx.summary.audioPublished)) + '</strong></div>' +
      '</div>' +
      '<div class="summary">' +
        '<div class="card"><span>Videos featured/hidden</span><strong>' + escapeHtml(String(ctx.summary.videoFeatured)) + ' / ' + escapeHtml(String(ctx.summary.videoHidden)) + '</strong></div>' +
        '<div class="card"><span>Audio featured/hidden</span><strong>' + escapeHtml(String(ctx.summary.audioFeatured)) + ' / ' + escapeHtml(String(ctx.summary.audioHidden)) + '</strong></div>' +
      '</div>' +
      '<h2>Videos</h2>' + videosHtml +
      '<h2>Audio</h2>' + audioHtml +
      '<h2>Photos</h2>' + photosHtml +
      '</div></body></html>';
  }
  function exportMediaAssetsReportPdf() {
    var ctx = buildMediaAssetsReportContext();
    var popup = window.open('', '_blank', 'width=1340,height=920');
    if (!popup) {
      setStatus('Could not open Media report window. Check popup blocker and try again.', 'err');
      return;
    }
    popup.document.open();
    popup.document.write(mediaAssetsReportHtml(ctx));
    popup.document.close();
    var printNow = function () {
      try {
        popup.focus();
        popup.print();
        setStatus('Media report ready. Use Save as PDF in the print dialog.', 'warn');
      } catch (err) {
        setStatus('Media report opened. Use Cmd+P to save it as PDF.', 'warn');
      }
    };
    if (popup.document.readyState === 'complete') {
      setTimeout(printNow, 120);
    } else {
      popup.addEventListener('load', function () { setTimeout(printNow, 120); }, { once: true });
    }
  }

  function safePublicPdfs(raw) {
    var out = { dossier: {}, artistSheet: {} };
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    var src = isObject(raw) ? raw : {};
    ['dossier', 'artistSheet'].forEach(function (kind) {
      var block = isObject(src[kind]) ? src[kind] : {};
      out[kind] = {};
      langs.forEach(function (L) {
        var v = block[L];
        if (typeof v === 'string') out[kind][L] = { url: safeString(v).trim(), data: '' };
        else if (isObject(v)) out[kind][L] = { url: safeString(v.url).trim(), data: safeString(v.data).trim() };
        else out[kind][L] = { url: '', data: '' };
      });
    });
    return out;
  }
  function safeEpkBios(raw) {
    var src = isObject(raw) ? raw : {};
    var out = {};
    LANGS.forEach(function (lang) {
      var b = isObject(src[lang]) ? src[lang] : {};
      out[lang] = {
        b50: safeString(b.b50),
        b150: safeString(b.b150),
        b300p1: safeString(b.b300p1),
        b300p2: safeString(b.b300p2),
        b300p3: safeString(b.b300p3),
        b300p4: safeString(b.b300p4)
      };
    });
    return out;
  }
  function safeEpkPhotos(raw) {
    var src = raw;
    if (!Array.isArray(src) && isObject(src) && Array.isArray(src.value)) src = src.value;
    var arr = Array.isArray(src) ? src : [];
    return arr.filter(function (p) { return isObject(p) || typeof p === 'string'; }).map(function (p) {
      if (typeof p === 'string') return { url: safeString(p), caption: '', alt: '', photographer: '', label: '', credit: '' };
      var caption = safeString(p.caption || p.label);
      var photographer = safeString(p.photographer || p.credit);
      var alt = safeString(p.alt);
      return { url: safeString(p.url).trim(), caption: caption, alt: alt, photographer: photographer, label: caption, credit: photographer };
    });
  }
  function togglePressTab(tab) {
    state.pressTab = tab;
    ['Quotes', 'Pdfs', 'Bios', 'Photos', 'Cvs'].forEach(function (name) {
      var id = 'pressTab' + name;
      var panel = 'press' + name + 'Panel';
      var active = name.toLowerCase() === tab;
      if ($(id)) $(id).classList.toggle('active', active);
      if ($(panel)) $(panel).style.display = active ? '' : 'none';
    });
    applyTranslationMissingOnlyMask();
  }
  function loadPressPdfsIntoUi() {
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    langs.forEach(function (L) {
      $('pdf-dossier-' + L).value = safeString(state.publicPdfs.dossier[L] && state.publicPdfs.dossier[L].url);
      $('pdf-artist-' + L).value = safeString(state.publicPdfs.artistSheet[L] && state.publicPdfs.artistSheet[L].url);
    });
  }
  function persistPressPdfsFromUi() {
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    langs.forEach(function (L) {
      if (!state.publicPdfs.dossier[L]) state.publicPdfs.dossier[L] = { url: '', data: '' };
      if (!state.publicPdfs.artistSheet[L]) state.publicPdfs.artistSheet[L] = { url: '', data: '' };
      state.publicPdfs.dossier[L].url = safeString($('pdf-dossier-' + L).value).trim();
      state.publicPdfs.artistSheet[L].url = safeString($('pdf-artist-' + L).value).trim();
    });
  }
  function loadEpkBiosIntoUi() {
    var b = state.epkBios[state.lang] || { b50: '', b150: '', b300p1: '', b300p2: '', b300p3: '', b300p4: '' };
    $('epk-bio-b50').value = b.b50;
    $('epk-bio-b150').value = b.b150;
    $('epk-bio-b300p1').value = b.b300p1;
    $('epk-bio-b300p2').value = b.b300p2;
    $('epk-bio-b300p3').value = b.b300p3;
    $('epk-bio-b300p4').value = b.b300p4;
  }
  function persistEpkBiosFromUi() {
    if (!state.epkBios[state.lang]) state.epkBios[state.lang] = {};
    state.epkBios[state.lang].b50 = safeString($('epk-bio-b50').value);
    state.epkBios[state.lang].b150 = safeString($('epk-bio-b150').value);
    state.epkBios[state.lang].b300p1 = safeString($('epk-bio-b300p1').value);
    state.epkBios[state.lang].b300p2 = safeString($('epk-bio-b300p2').value);
    state.epkBios[state.lang].b300p3 = safeString($('epk-bio-b300p3').value);
    state.epkBios[state.lang].b300p4 = safeString($('epk-bio-b300p4').value);
  }
  function renderEpkPhotoList() {
    var box = $('epk-photo-list');
    var q = safeString(state.epkPhotoSearch).toLowerCase().trim();
    var rows = state.epkPhotos.map(function (p, i) { return { p: p, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.p.caption, row.p.alt, row.p.photographer, row.p.label, row.p.credit, row.p.url].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay EPK photos. Agrega una por URL o subida.</div>';
      state.epkPhotoIndex = -1;
      renderEpkPhotoEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var cls = row.i === state.epkPhotoIndex ? 'item active' : 'item';
      var label = safeString(row.p.caption || row.p.label) || ('Photo ' + (row.i + 1));
      var credit = safeString(row.p.photographer || row.p.credit);
      var badges = [];
      if (isBlank(row.p.url)) badges.push({ kind: 'warn', label: 'missing image' });
      return '<div class="' + cls + '" data-idx="' + row.i + '">' + label + (credit ? ' · ' + credit : '') + badgesHtml(badges) + '</div>';
    }).join('');
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.epkPhotoIndex = Number(el.getAttribute('data-idx'));
        renderEpkPhotoList();
        renderEpkPhotoEditor();
      });
    });
    if (state.epkPhotoIndex < 0) {
      state.epkPhotoIndex = 0;
      renderEpkPhotoList();
      renderEpkPhotoEditor();
    }
  }
  function renderEpkPhotoEditor() {
    var p = state.epkPhotos[state.epkPhotoIndex] || { url: '', caption: '', alt: '', photographer: '', label: '', credit: '' };
    $('epk-photo-url').value = safeString(p.url);
    $('epk-photo-caption').value = safeString(p.caption || p.label);
    $('epk-photo-alt').value = safeString(p.alt);
    $('epk-photo-photographer').value = safeString(p.photographer || p.credit);
    $('epk-photo-preview').src = safeString(p.url);
  }
  function persistEpkPhotoEditor() {
    if (state.epkPhotoIndex < 0) return;
    var p = state.epkPhotos[state.epkPhotoIndex] || {};
    p.url = safeString($('epk-photo-url').value).trim();
    p.caption = safeString($('epk-photo-caption').value);
    p.alt = safeString($('epk-photo-alt').value);
    p.photographer = safeString($('epk-photo-photographer').value);
    // Keep legacy keys mirrored for compatibility.
    p.label = p.caption;
    p.credit = p.photographer;
    state.epkPhotos[state.epkPhotoIndex] = p;
    renderEpkPhotoList();
    renderEpkPhotoEditor();
    markDirty(true, 'EPK photo editada');
  }
  function safeEpkCvs(raw) {
    var src = isObject(raw) ? raw : {};
    var out = {};
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      if (typeof src[L] === 'string' && src[L].trim()) out[L] = src[L].trim();
    });
    return out;
  }
  function renderEpkCvsUi() {
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      var status = 'using default CV';
      if (state.epkCvsTemp[L]) status = 'new file ready to save';
      else if (state.epkCvs[L]) status = 'custom CV saved';
      $('epk-cv-status-' + L).value = status;
    });
  }
  function saveEpkCvs() {
    var next = clone(state.epkCvs);
    Object.keys(state.epkCvsTemp).forEach(function (L) {
      if (state.epkCvsTemp[L]) next[L] = state.epkCvsTemp[L];
    });
    state.epkCvs = safeEpkCvs(next);
    state.epkCvsTemp = {};
    saveDoc('rg_epk_cvs', state.epkCvs);
    renderEpkCvsUi();
  }

  function renderPressList() {
    var box = $('press-list');
    var q = safeString(state.pressSearch).toLowerCase().trim();
    var filter = state.pressVisibleFilter || 'all';
    var rows = state.press.map(function (p, i) { return { p: p, i: i }; }).filter(function (row) {
      if (!q) return true;
      var hay = [row.p.source, row.p.quote, row.p.production, row.p.url].map(function (x) { return safeString(x).toLowerCase(); }).join(' ');
      return hay.indexOf(q) >= 0;
    }).filter(function (row) {
      if (filter === 'all') return true;
      if (filter === 'visible') return row.p.visible !== false;
      if (filter === 'hidden') return row.p.visible === false;
      return true;
    }).filter(function (row) {
      var wf = state.pressWorkflowFilter || 'all';
      if (wf === 'all') return true;
      var b = workflowBucketPress(row.p);
      if (wf === 'ready') return pressQuoteReadyCheck(row.p).ok && b !== 'hidden';
      return passesWorkflowFilter(b, wf);
    });
    if (!rows.length) {
      box.innerHTML = '<div class="empty-state">No hay quotes. Crea una con "+ Nueva quote".</div>';
      state.pressIndex = -1;
      setSelectionCount('press-selection-count', state.pressSelected);
      renderPressEditor();
      return;
    }
    box.innerHTML = rows.map(function (row) {
      var t = (row.p.source || '(no source)') + ' · ' + (row.p.production || '');
      var cls = row.i === state.pressIndex ? 'item active' : 'item';
      var quoteValue = isObject(row.p.quotes_i18n) ? row.p.quotes_i18n[state.lang] : row.p.quote;
      var badges = [];
      if (isBlank(row.p.source)) badges.push({ kind: 'warn', label: 'missing source' });
      if (isBlank(quoteValue)) badges.push({ kind: 'warn', label: 'missing translation' });
      if (row.p.visible === false) badges.push({ kind: 'err', label: 'hidden' });
      if (safeString(row.p.editorialStatus)) badges.push({ kind: 'warn', label: safeString(row.p.editorialStatus) });
      var checked = state.pressSelected[row.i] ? ' checked' : '';
      return '<div class="' + cls + '" data-idx="' + row.i + '"><div class="item-row"><input class="row-select" data-idx="' + row.i + '" type="checkbox"' + checked + '><div class="item-main">' + t + badgesHtml(badges) + '</div></div></div>';
    }).join('');
    setSelectionCount('press-selection-count', state.pressSelected);
    box.querySelectorAll('.row-select').forEach(function (el) {
      el.addEventListener('click', function (evt) { evt.stopPropagation(); });
      el.addEventListener('change', function () {
        toggleSelected(state.pressSelected, Number(el.getAttribute('data-idx')), !!el.checked);
        setSelectionCount('press-selection-count', state.pressSelected);
      });
    });
    box.querySelectorAll('.item').forEach(function (el) {
      el.addEventListener('click', function () {
        state.pressIndex = Number(el.getAttribute('data-idx'));
        renderPressList();
        renderPressEditor();
      });
    });
    if (state.pressIndex < 0 && state.press.length) {
      state.pressIndex = 0;
      renderPressList();
      renderPressEditor();
    }
  }
  function renderPressEditor() {
    var p = state.press[state.pressIndex] || {};
    $('press-source').value = safeString(p.source);
    var qi = isObject(p.quotes_i18n) ? p.quotes_i18n : {};
    var pi = isObject(p.production_i18n) ? p.production_i18n : {};
    $('press-quote').value = safeString(qi[state.lang] != null ? qi[state.lang] : p.quote);
    $('press-production').value = safeString(pi[state.lang] != null ? pi[state.lang] : p.production);
    $('press-url').value = safeString(p.url);
    $('press-visible').value = p.visible === false ? 'false' : 'true';
    setSelectWithCustomValue('press-editorialStatus', safeString(p.editorialStatus || (p.visible === false ? 'hidden' : 'draft')), 'draft');
    updatePressMiniPreview();
  }
  function persistPressEditor() {
    if (state.pressIndex < 0) return;
    var p = state.press[state.pressIndex] || {};
    p.source = $('press-source').value;
    if (!isObject(p.quotes_i18n)) p.quotes_i18n = {};
    if (!isObject(p.production_i18n)) p.production_i18n = {};
    p.quotes_i18n[state.lang] = safeString($('press-quote').value);
    p.production_i18n[state.lang] = safeString($('press-production').value);
    if (state.lang === 'en') {
      p.quote = p.quotes_i18n.en;
      p.production = p.production_i18n.en;
    } else {
      p.quote = safeString(p.quote || p.quotes_i18n.en || p.quotes_i18n[state.lang]);
      p.production = safeString(p.production || p.production_i18n.en || p.production_i18n[state.lang]);
    }
    p.url = $('press-url').value;
    p.visible = asBoolean($('press-visible').value, true);
    p.editorialStatus = safeString($('press-editorialStatus').value || (p.visible === false ? 'hidden' : 'draft'));
    if (!p.id) p.id = Date.now();
    state.press[state.pressIndex] = p;
    renderPressList();
    markDirty(true);
  }
  function loadPress() {
    var pressBase = loadDoc('rg_press', null);
    if (!Array.isArray(pressBase)) {
      try {
        if (typeof state.api.getPress === 'function') pressBase = state.api.getPress();
      } catch (e) {}
    }
    if (!Array.isArray(pressBase)) pressBase = [];
    state.press = pressBase.map(function (p) {
      var item = isObject(p) ? clone(p) : {};
      if (!isObject(item.quotes_i18n)) item.quotes_i18n = {};
      if (!isObject(item.production_i18n)) item.production_i18n = {};
      return item;
    });
    state.pressIndex = -1;
    if ($('press-visible-filter')) $('press-visible-filter').value = state.pressVisibleFilter || 'all';
    if ($('press-workflow-filter')) $('press-workflow-filter').value = state.pressWorkflowFilter || 'all';
    renderPressList();
    var meta = loadDoc('rg_press_meta', null);
    if (!isObject(meta)) {
      try {
        if (typeof state.api.getPressMeta === 'function') meta = state.api.getPressMeta();
      } catch (e) {}
    }
    if (!isObject(meta)) meta = {};
    $('press-translatedNote').value = safeString(meta[state.lang] && meta[state.lang].translatedNote);
    $('press-showReviewsSection').value = meta.showReviewsSection === false ? 'false' : 'true';
    var uiStored = loadDoc('rg_ui_' + state.lang, null);
    var uiFallback = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var t = state.api.uiTable(state.lang);
        if (isObject(t)) uiFallback = t;
      }
    } catch (e) {}
    $('press-reviewsIntro').value = pickStoredOrFallback(uiStored, uiFallback, 'reviewsIntro');
    state.publicPdfs = safePublicPdfs(loadDoc('rg_public_pdfs', {}));
    loadPressPdfsIntoUi();
    state.epkBios = safeEpkBios(loadDoc('rg_epk_bios', {}));
    loadEpkBiosIntoUi();
    state.epkPhotos = safeEpkPhotos(loadDoc('rg_epk_photos', []));
    state.epkPhotoIndex = -1;
    renderEpkPhotoList();
    state.epkCvs = safeEpkCvs(loadDoc('rg_epk_cvs', {}));
    state.epkCvsTemp = {};
    renderEpkCvsUi();
    togglePressTab(state.pressTab || 'quotes');
    updatePdfValidation();
    updateCompletenessIndicators();
  }
  function savePressMeta() {
    var meta = loadDoc('rg_press_meta', {});
    if (!meta[state.lang]) meta[state.lang] = {};
    meta[state.lang].translatedNote = safeString($('press-translatedNote').value);
    meta.showReviewsSection = $('press-showReviewsSection').value !== 'false';
    saveDoc('rg_press_meta', meta);
    try {
      localStorage.setItem('rg_press_meta', JSON.stringify(meta));
      localStorage.setItem('rg_local_rg_press_meta', JSON.stringify({ ts: Date.now(), value: meta }));
    } catch (e) {}
    var ui = loadDoc('rg_ui_' + state.lang, {});
    ui.reviewsIntro = safeString($('press-reviewsIntro').value);
    saveDoc('rg_ui_' + state.lang, ui);
  }
  function savePressQuotes() {
    state.press = state.press.filter(function (p) { return isObject(p); });
    saveDoc('rg_press', state.press);
    try {
      localStorage.setItem('rg_press', JSON.stringify(state.press));
      localStorage.setItem('rg_local_rg_press', JSON.stringify({ ts: Date.now(), value: state.press }));
    } catch (e) {}
  }
  function savePressPdfs() {
    persistPressPdfsFromUi();
    saveDoc('rg_public_pdfs', state.publicPdfs);
    // Compatibility mirror for public pages that read plain localStorage key directly.
    try {
      localStorage.setItem('rg_public_pdfs', JSON.stringify(state.publicPdfs));
    } catch (e) {}
  }
  function saveEpkBios() {
    persistEpkBiosFromUi();
    saveDoc('rg_epk_bios', state.epkBios);
  }
  function saveEpkPhotos() {
    state.epkPhotos = safeEpkPhotos(state.epkPhotos);
    saveDoc('rg_epk_photos', state.epkPhotos);
    try {
      localStorage.setItem('rg_epk_photos', JSON.stringify(state.epkPhotos));
      localStorage.setItem('rg_local_rg_epk_photos', JSON.stringify({ ts: Date.now(), value: state.epkPhotos }));
    } catch (e) {}
  }

  function loadContact() {
    var stored = loadDoc('contact_' + state.lang, null);
    var fallback = getLegacySection('contact');
    var webBtnRaw = pickStoredOrFallback(stored, fallback, 'webBtn');
    var webUrlRaw = pickStoredOrFallback(stored, fallback, 'webUrl');
    var inferredWebUrl = safeString(webUrlRaw).trim();
    if (!inferredWebUrl && isValidHttpUrl(webBtnRaw)) inferredWebUrl = safeString(webBtnRaw).trim();
    var inferredWebBtn = safeString(webBtnRaw).trim();
    if (isValidHttpUrl(inferredWebBtn)) inferredWebBtn = '';
    setFieldFromSources('contact-title', stored, fallback, 'title', 'Bundled default');
    setFieldFromSources('contact-sub', stored, fallback, 'sub', 'Bundled default');
    setFieldFromSources('contact-email', stored, fallback, 'email', 'Bundled default');
    setFieldFromSources('contact-phone', stored, fallback, 'phone', 'Bundled default');
    setFieldFromSources('contact-emailBtn', stored, fallback, 'emailBtn', 'Bundled default');
    setFieldEffectiveValue($('contact-webBtn'), { value: inferredWebBtn, source: safeString(inferredWebBtn).trim() ? ((isObject(stored) && safeString(stored.webBtn).trim()) ? 'Saved here' : 'Bundled default') : 'Bundled default' });
    if ($('contact-webUrl')) $('contact-webUrl').value = inferredWebUrl;
    updateContactValidation();
    updateContactMiniPreview();
    updateCompletenessIndicators();
  }
  function saveContact() {
    saveDoc('contact_' + state.lang, {
      title: safeString($('contact-title').value),
      sub: safeString($('contact-sub').value),
      email: safeString($('contact-email').value),
      phone: safeString($('contact-phone').value),
      emailBtn: safeString($('contact-emailBtn').value),
      webBtn: safeString($('contact-webBtn').value),
      webUrl: safeString($('contact-webUrl') && $('contact-webUrl').value).trim()
    });
  }

  function loadUiJson() {
    ensureUiPublicCopyEditorBuilt();
    var d = loadDoc('rg_ui_' + state.lang, null);
    if (!isObject(d)) {
      try {
        if (typeof state.api.uiTable === 'function') {
          var t = state.api.uiTable(state.lang);
          if (isObject(t)) d = t;
        }
      } catch (e) {}
    }
    if (!isObject(d)) d = {};
    d = normalizeUiLocaleDoc(d, state.lang);
    $('ui-json').value = JSON.stringify(d, null, 2);
    loadUiNavFieldsFromDoc(d);
    renderNavOrderControls();
    updateCompletenessIndicators();
  }
  function loadUiNavFieldsFromDoc(d) {
    var doc = isObject(d) ? d : {};
    syncUiNavAndPublicCopyFromDoc(doc);
    var uiGlobal = loadDoc('rg_ui_en', {});
    if (!isObject(uiGlobal)) uiGlobal = {};
    if ($('ui-logoHaloEnabled')) $('ui-logoHaloEnabled').checked = asBoolean(uiGlobal['chrome.logoHalo.enabled'], true);
    if ($('ui-logoHaloIntensity')) $('ui-logoHaloIntensity').value = safeString(uiGlobal['chrome.logoHalo.intensity'] || 'normal') || 'normal';
    if ($('ui-featherHaloEnabled')) $('ui-featherHaloEnabled').checked = asBoolean(uiGlobal['chrome.featherHalo.enabled'], true);
    if ($('ui-featherHaloIntensity')) $('ui-featherHaloIntensity').value = safeString(uiGlobal['chrome.featherHalo.intensity'] || 'normal') || 'normal';
    var uiFbHome = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var tHome = state.api.uiTable(state.lang);
        if (isObject(tHome)) uiFbHome = tHome;
      }
    } catch (e) {}
    HOME_RG_UI_COPY_FIELDS.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      setFieldEffectiveValue(el, pickEffectiveWithSource(doc, uiFbHome, row.key, 'Inherited'));
    });
  }
  function saveUiNav() {
    var d = loadDoc('rg_ui_' + state.lang, null);
    if (!isObject(d)) d = {};
    d['nav.home'] = safeString($('ui-nav-home').value);
    d['nav.bio'] = safeString($('ui-nav-bio').value);
    d['nav.rep'] = safeString($('ui-nav-rep').value);
    d['nav.media'] = safeString($('ui-nav-media').value);
    d['nav.cal'] = safeString($('ui-nav-cal').value);
    d['nav.epk'] = safeString($('ui-nav-epk').value);
    d['nav.book'] = safeString($('ui-nav-book').value);
    if ($('ui-nav-contact')) d['nav.contact'] = safeString($('ui-nav-contact').value);
    d = persistHomeRgUiCopyFields(d);
    d = persistPublicRgUiCopyFields(d);
    d = normalizeUiLocaleDoc(d, state.lang);
    saveDoc('rg_ui_' + state.lang, d);
    var globalUi = loadDoc('rg_ui_en', {});
    if (!isObject(globalUi)) globalUi = {};
    globalUi['chrome.logoHalo.enabled'] = !!($('ui-logoHaloEnabled') && $('ui-logoHaloEnabled').checked);
    globalUi['chrome.logoHalo.intensity'] = safeString($('ui-logoHaloIntensity') && $('ui-logoHaloIntensity').value || 'normal') || 'normal';
    globalUi['chrome.featherHalo.enabled'] = !!($('ui-featherHaloEnabled') && $('ui-featherHaloEnabled').checked);
    globalUi['chrome.featherHalo.intensity'] = safeString($('ui-featherHaloIntensity') && $('ui-featherHaloIntensity').value || 'normal') || 'normal';
    saveDoc('rg_ui_en', globalUi);
    $('ui-json').value = JSON.stringify(d, null, 2);
  }
  function mergeMissingStrings(target, source, keys) {
    keys.forEach(function (k) {
      if (isBlank(target[k]) && !isBlank(source[k])) target[k] = safeString(source[k]);
    });
    return target;
  }
  function copyHomeFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    if (!window.confirm('Copy Home/Hero text fields from EN for this language? Image fields are not overwritten.')) return;
    var en = loadDoc('hero_en', {});
    if (!isObject(en)) en = {};
    ['eyebrow','subtitle','cta1','cta2','quickBioLabel','quickCalLabel','introCtaBio','introCtaMedia'].forEach(function (k) {
      $('hero-' + (k === 'quickBioLabel' ? 'quickBioLabel' : k === 'quickCalLabel' ? 'quickCalLabel' : k)).value = safeString(en[k]);
    });
    $('hero-eyebrow').value = safeString(en.eyebrow);
    $('hero-subtitle').value = safeString(en.subtitle);
    $('hero-cta1').value = safeString(en.cta1);
    $('hero-cta2').value = safeString(en.cta2);
    $('hero-quickBioLabel').value = safeString(en.quickBioLabel);
    $('hero-quickCalLabel').value = safeString(en.quickCalLabel);
    $('hero-introCtaBio').value = safeString(en.introCtaBio);
    $('hero-introCtaMedia').value = safeString(en.introCtaMedia);
    updateCompletenessIndicators();
    markDirty(true, 'Home copied from EN (text only)');
  }
  function copyBioFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    if (!window.confirm('Copy Biography text fields from EN for this language? Portrait image is not overwritten.')) return;
    var en = getBiographySourceDoc('en');
    $('bio-introLine').value = safeString(en.introLine);
    $('bio-h2').value = safeString(en.h2);
    fillBioParagraphInputsFromStored(en, {});
    $('bio-continue-tag').value = safeString(en.continueSectionTag);
    $('bio-continue-sub').value = safeString(en.continueSub);
    $('bio-cta-rep').value = safeString(en.ctaRepertoire);
    $('bio-cta-media').value = safeString(en.ctaMedia);
    $('bio-cta-contact').value = safeString(en.ctaContact);
    $('bio-cta-home').value = safeString(en.ctaHomeIntro);
    $('bio-portraitAlt').value = safeString(en.portraitAlt);
    $('bio-quote').value = safeString(en.quote);
    $('bio-cite').value = safeString(en.cite);
    updateCompletenessIndicators();
    markDirty(true, 'Biography copied from EN (text only)');
  }
  function copyProgramsFromEn(onlyMissing) {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var label = onlyMissing ? 'Copy missing program fields from EN?' : 'Overwrite this language Programs content from EN?';
    if (!window.confirm(label)) return;
    var enDoc = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    if (onlyMissing) {
      mergeMissingStrings(state.programsDoc, enDoc, ['title', 'subtitle', 'intro', 'closingNote']);
      var max = Math.max(state.programsDoc.programs.length, enDoc.programs.length);
      var merged = [];
      for (var i = 0; i < max; i += 1) {
        var cur = safeProgramsDoc({ programs: [state.programsDoc.programs[i] || {}] }).programs[0] || {};
        var en = safeProgramsDoc({ programs: [enDoc.programs[i] || {}] }).programs[0] || {};
        merged.push(mergeMissingStrings(cur, en, ['title', 'description', 'duration']));
      }
      state.programsDoc.programs = merged.filter(function (p) { return isObject(p); });
    } else {
      state.programsDoc = enDoc;
    }
    normalizeProgramOrders();
    renderProgramsList();
    renderProgramsEditor();
    updateCompletenessIndicators();
    markDirty(true, onlyMissing ? 'Programs missing fields copied from EN' : 'Programs copied from EN');
  }
  function copyContactFromEn(onlyMissing) {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var label = onlyMissing ? 'Copy only missing Contact fields from EN?' : 'Overwrite Contact fields from EN for this language?';
    if (!window.confirm(label)) return;
    var en = loadDoc('contact_en', {});
    if (!isObject(en)) en = {};
    var keys = [
      { id: 'contact-title', key: 'title' },
      { id: 'contact-sub', key: 'sub' },
      { id: 'contact-email', key: 'email' },
      { id: 'contact-phone', key: 'phone' },
      { id: 'contact-emailBtn', key: 'emailBtn' },
      { id: 'contact-webBtn', key: 'webBtn' },
      { id: 'contact-webUrl', key: 'webUrl' }
    ];
    keys.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      if (!onlyMissing || isBlank(el.value)) el.value = safeString(en[row.key]);
    });
    updateContactValidation();
    updateCompletenessIndicators();
    markDirty(true, onlyMissing ? 'Contact missing fields copied from EN' : 'Contact copied from EN');
  }
  function copyUiNavFromEn(onlyMissing) {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var label = onlyMissing
      ? 'Copy only missing navigation labels and structured public copy from EN?'
      : 'Overwrite navigation labels and structured public copy from EN?';
    if (!window.confirm(label)) return;
    ensureUiPublicCopyEditorBuilt();
    var en = loadDoc('rg_ui_en', {});
    if (!isObject(en)) en = {};
    var enFb = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var tEn = state.api.uiTable('en');
        if (isObject(tEn)) enFb = tEn;
      }
    } catch (e) {}
    var rows = [
      { id: 'ui-nav-home', key: 'nav.home' },
      { id: 'ui-nav-bio', key: 'nav.bio' },
      { id: 'ui-nav-rep', key: 'nav.rep' },
      { id: 'ui-nav-media', key: 'nav.media' },
      { id: 'ui-nav-cal', key: 'nav.cal' },
      { id: 'ui-nav-epk', key: 'nav.epk' },
      { id: 'ui-nav-book', key: 'nav.book' },
      { id: 'ui-nav-contact', key: 'nav.contact' }
    ];
    rows.forEach(function (row) {
      var el = $(row.id);
      if (!el) return;
      if (!onlyMissing || isBlank(el.value)) {
        var v = hasOwn(en, row.key) ? en[row.key] : enFb[row.key];
        el.value = safeString(v);
      }
    });
    flatPublicRgUiCopyFields().forEach(function (f) {
      var el = $(fieldDomIdForUiKey(f.key));
      if (!el) return;
      if (!onlyMissing || isBlank(el.value)) {
        var v2 = hasOwn(en, f.key) ? en[f.key] : enFb[f.key];
        el.value = safeString(v2);
      }
    });
    updateCompletenessIndicators();
    markDirty(true, onlyMissing ? 'Missing UI strings copied from EN' : 'UI strings copied from EN');
  }
  function copyPressBiosMissingFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    if (!window.confirm('Copy only missing EPK bio fields from EN? Existing translated text will be kept.')) return;
    if (!state.epkBios[state.lang]) state.epkBios[state.lang] = {};
    var en = state.epkBios.en || {};
    var local = state.epkBios[state.lang];
    ['b50','b150','b300p1','b300p2','b300p3','b300p4'].forEach(function (k) {
      if (isBlank(local[k]) && !isBlank(en[k])) local[k] = safeString(en[k]);
    });
    loadEpkBiosIntoUi();
    updateCompletenessIndicators();
    markDirty(true, 'EPK bios missing fields copied from EN');
  }
  function copyHomeMissingFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var en = loadDoc('hero_en', {});
    if (!isObject(en)) en = {};
    var map = [
      { id: 'hero-eyebrow', key: 'eyebrow' },
      { id: 'hero-subtitle', key: 'subtitle' },
      { id: 'hero-cta1', key: 'cta1' },
      { id: 'hero-cta2', key: 'cta2' },
      { id: 'hero-quickBioLabel', key: 'quickBioLabel' },
      { id: 'hero-quickCalLabel', key: 'quickCalLabel' },
      { id: 'hero-introCtaBio', key: 'introCtaBio' },
      { id: 'hero-introCtaMedia', key: 'introCtaMedia' }
    ];
    map.forEach(function (m) { if (isBlank($(m.id).value)) $(m.id).value = safeString(en[m.key]); });
    var enUi = loadDoc('rg_ui_en', null);
    if (!isObject(enUi)) enUi = {};
    var enUiFb = {};
    try {
      if (typeof state.api.uiTable === 'function') {
        var tEn = state.api.uiTable('en');
        if (isObject(tEn)) enUiFb = tEn;
      }
    } catch (e) {}
    HOME_RG_UI_COPY_FIELDS.forEach(function (row) {
      if (!isBlank($(row.id).value)) return;
      var v = hasOwn(enUi, row.key) ? enUi[row.key] : enUiFb[row.key];
      $(row.id).value = safeString(v);
    });
    updateHomeMiniPreviews();
    updateCompletenessIndicators();
    markDirty(true, 'Home missing fields copied from EN');
  }
  function copyBioMissingFromEn() {
    if (state.lang === 'en') return setStatus('Already EN.', 'warn');
    var en = getBiographySourceDoc('en');
    var map = [
      { id: 'bio-introLine', key: 'introLine' },
      { id: 'bio-h2', key: 'h2' },
      { id: 'bio-continue-tag', key: 'continueSectionTag' },
      { id: 'bio-continue-sub', key: 'continueSub' },
      { id: 'bio-cta-rep', key: 'ctaRepertoire' },
      { id: 'bio-cta-media', key: 'ctaMedia' },
      { id: 'bio-cta-contact', key: 'ctaContact' },
      { id: 'bio-cta-home', key: 'ctaHomeIntro' },
      { id: 'bio-portraitAlt', key: 'portraitAlt' },
      { id: 'bio-quote', key: 'quote' },
      { id: 'bio-cite', key: 'cite' }
    ];
    map.forEach(function (m) {
      if (isBlank($(m.id).value)) $(m.id).value = safeString(en[m.key]);
    });
    var enParas = normalizeParagraphsFromBioStored(en);
    if (!paragraphsArrayFromBioInputs().length && enParas.length) {
      fillBioParagraphInputsFromStored(en, {});
    } else {
      bioParagraphFieldIds().forEach(function (id, idx) {
        if (isBlank($(id).value) && enParas[idx] != null) $(id).value = safeString(enParas[idx]);
      });
    }
    updateBioMiniPreview();
    updateCompletenessIndicators();
    markDirty(true, 'Biography missing fields copied from EN');
  }
  function getEditorialMeta(lang) {
    var d = getStoredDocRaw('rg_editorial_' + lang, {});
    return isObject(d) ? d : {};
  }
  function setSectionEditorialReview(sectionKey, value) {
    var d = getEditorialMeta(state.lang);
    d['reviewState_' + sectionKey] = safeString(value);
    saveDoc('rg_editorial_' + state.lang, d);
    pushActivitySummary('Editorial status', [sectionKey + ' · ' + state.lang.toUpperCase() + ' → ' + value]);
    if (state.section === 'translation') refreshTranslationWorkspace();
  }
  function classifyTxRow(enV, curV) {
    var en = safeString(enV).trim();
    var cur = safeString(curV).trim();
    if (!en && !cur) return 'same';
    if (!cur && en) return 'missing';
    if (cur && en && cur === en) return state.lang === 'en' ? 'same' : 'verify';
    if (cur && en && cur !== en) return 'different';
    if (cur && !en) return 'local_only';
    return 'same';
  }
  function clipTx(s, n) {
    s = safeString(s);
    if (s.length <= n) return s;
    return s.slice(0, n - 1) + '…';
  }
  function showLangComparePanel(title, rows) {
    var panel = $('lang-compare-panel');
    if (!panel) return;
    var label = {
      missing: 'Missing',
      different: 'Different',
      same: 'Same',
      verify: 'Same as EN · review',
      local_only: 'Local only'
    };
    var rowCls = {
      missing: 'tx-cmp-missing',
      different: 'tx-cmp-different',
      same: 'tx-cmp-same',
      verify: 'tx-cmp-verify',
      local_only: 'tx-cmp-local_only'
    };
    if (!rows || !rows.length) {
      panel.innerHTML = '';
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    panel.innerHTML =
      '<h4 class="tx-cmp-title">' + escapeHtml(title) + ' · ' + state.lang.toUpperCase() + ' vs EN</h4>' +
      '<table class="tx-cmp-table"><thead><tr><th>Field</th><th>Status</th><th>EN</th><th>Current</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var k = safeString(r && r.kind);
        if (!rowCls[k]) k = 'same';
        return (
          '<tr class="' + rowCls[k] + '"><td class="tx-cmp-k">' + escapeHtml(safeString(r.key)) + '</td><td><span class="tx-cmp-tag">' +
          escapeHtml(label[k] || k) + '</span></td><td class="tx-cmp-en">' + escapeHtml(clipTx(r.en, 120)) +
          '</td><td class="tx-cmp-cur">' + escapeHtml(clipTx(r.cur, 120)) + '</td></tr>'
        );
      }).join('') +
      '</tbody></table>';
  }
  function compareFieldsWithEn(sectionTitle, fieldsCurrent, fieldsEn) {
    var keySet = {};
    [fieldsCurrent, fieldsEn].forEach(function (obj) {
      if (!obj || typeof obj !== 'object') return;
      Object.keys(obj).forEach(function (k) { keySet[k] = true; });
    });
    var keys = Object.keys(keySet).sort();
    var missing = [];
    var different = [];
    var verify = [];
    var rows = keys.map(function (k) {
      var cur = fieldsCurrent && hasOwn(fieldsCurrent, k) ? fieldsCurrent[k] : '';
      var en = fieldsEn && hasOwn(fieldsEn, k) ? fieldsEn[k] : '';
      var kind = classifyTxRow(en, cur);
      if (kind === 'missing') missing.push(k);
      else if (kind === 'different') different.push(k);
      else if (kind === 'verify') verify.push(k);
      return { key: k, cur: cur, en: en, kind: kind };
    });
    var lines = [
      sectionTitle + ' · ' + state.lang.toUpperCase() + ' vs EN',
      'Missing: ' + (missing.length ? missing.join(', ') : 'none'),
      'Different: ' + (different.length ? different.join(', ') : 'none'),
      'Same as EN (verify): ' + (verify.length ? verify.join(', ') : 'none')
    ];
    if ($('langCompareSummary')) $('langCompareSummary').textContent = lines.join(' · ');
    pushActivitySummary('EN comparison', lines);
    showLangComparePanel(sectionTitle, rows);
  }
  function compareHomeWithEn() {
    var cur = loadDoc('hero_' + state.lang, {}) || {};
    var en = loadDoc('hero_en', {}) || {};
    var curUi = loadDoc('rg_ui_' + state.lang, {}) || {};
    var enUi = loadDoc('rg_ui_en', {}) || {};
    var curH = {
      eyebrow: cur.eyebrow,
      subtitle: cur.subtitle,
      cta1: cur.cta1,
      cta2: cur.cta2,
      quickBioLabel: cur.quickBioLabel,
      quickCalLabel: cur.quickCalLabel,
      introCtaBio: cur.introCtaBio,
      introCtaMedia: cur.introCtaMedia
    };
    var enH = {
      eyebrow: en.eyebrow,
      subtitle: en.subtitle,
      cta1: en.cta1,
      cta2: en.cta2,
      quickBioLabel: en.quickBioLabel,
      quickCalLabel: en.quickCalLabel,
      introCtaBio: en.introCtaBio,
      introCtaMedia: en.introCtaMedia
    };
    HOME_RG_UI_COPY_FIELDS.forEach(function (row) {
      curH['UI · ' + row.key] = curUi[row.key];
      enH['UI · ' + row.key] = enUi[row.key];
    });
    compareFieldsWithEn('Home / Hero + intro UI', curH, enH);
  }
  function compareBioWithEn() {
    var cur = getBiographySourceDoc(state.lang) || {};
    var en = getBiographySourceDoc('en') || {};
    function flatBio(d) {
      var o = isObject(d) ? d : {};
      var base = {
        introLine: o.introLine,
        h2: o.h2,
        continueSectionTag: o.continueSectionTag,
        continueSub: o.continueSub,
        ctaRepertoire: o.ctaRepertoire,
        ctaMedia: o.ctaMedia,
        ctaContact: o.ctaContact,
        ctaHomeIntro: o.ctaHomeIntro,
        portraitAlt: o.portraitAlt,
        quote: o.quote,
        cite: o.cite,
        paragraphsJoined: normalizeParagraphsFromBioStored(o).join('\n\n')
      };
      return base;
    }
    compareFieldsWithEn('Biography', flatBio(cur), flatBio(en));
  }
  function compareProgramsWithEn() {
    var cur = safeProgramsDoc(loadProgramsCanonicalForLang(state.lang));
    var en = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    compareFieldsWithEn('Programs header', { title: cur.title, subtitle: cur.subtitle, intro: cur.intro, closingNote: cur.closingNote }, { title: en.title, subtitle: en.subtitle, intro: en.intro, closingNote: en.closingNote });
  }
  function compareContactWithEn() {
    var cur = loadDoc('contact_' + state.lang, {}) || {};
    var en = loadDoc('contact_en', {}) || {};
    compareFieldsWithEn('Contact', {
      title: cur.title,
      sub: cur.sub,
      email: cur.email,
      emailBtn: cur.emailBtn,
      webBtn: cur.webBtn,
      webUrl: cur.webUrl
    }, {
      title: en.title,
      sub: en.sub,
      email: en.email,
      emailBtn: en.emailBtn,
      webBtn: en.webBtn,
      webUrl: en.webUrl
    });
  }
  function compareUiWithEn() {
    var cur = loadDoc('rg_ui_' + state.lang, {}) || {};
    var en = loadDoc('rg_ui_en', {}) || {};
    var curH = {
      'Nav · home': cur['nav.home'],
      'Nav · bio': cur['nav.bio'],
      'Nav · rep': cur['nav.rep'],
      'Nav · media': cur['nav.media'],
      'Nav · cal': cur['nav.cal'],
      'Nav · epk': cur['nav.epk'],
      'Nav · book': cur['nav.book'],
      'Nav · contact': cur['nav.contact']
    };
    var enH = {
      'Nav · home': en['nav.home'],
      'Nav · bio': en['nav.bio'],
      'Nav · rep': en['nav.rep'],
      'Nav · media': en['nav.media'],
      'Nav · cal': en['nav.cal'],
      'Nav · epk': en['nav.epk'],
      'Nav · book': en['nav.book'],
      'Nav · contact': en['nav.contact']
    };
    flatPublicRgUiCopyFields().forEach(function (f) {
      var k = 'Copy · ' + f.key;
      curH[k] = cur[f.key];
      enH[k] = en[f.key];
    });
    compareFieldsWithEn('UI / translations', curH, enH);
  }
  function comparePressBiosWithEn() {
    var bios = safeEpkBios(loadDoc('rg_epk_bios', {}));
    var cur = bios[state.lang] || {};
    var en = bios.en || {};
    compareFieldsWithEn('EPK bios', cur, en);
  }

  function translationReviewBadgeClass(st) {
    var s = safeString(st);
    if (s === 'needs_translation') return 'tx-badge-needs-translation';
    if (s === 'translated') return 'tx-badge-translated';
    if (s === 'reviewed') return 'tx-badge-reviewed';
    return 'tx-badge-muted';
  }
  function txCell(val) {
    var s = clipTx(safeString(val), 180);
    return s || '—';
  }
  function refreshTranslationWorkspace() {
    var box = $('translation-workspace');
    var hint = $('translation-mode-hint');
    if (!box) return;
    var L = state.lang;
    if (hint) {
      hint.textContent = state.translationMissingOnly
        ? 'Editors: only rows that still need translation work are shown (saved content vs EN).'
        : 'Editors: full fields shown. Toggle “Missing / incomplete only” to focus.';
    }
    if (L === 'en') {
      box.innerHTML =
        '<p class="muted">Select a non-EN language above. English stays the reference; this workspace compares that language to EN.</p>';
      if ($('translation-qa')) $('translation-qa').innerHTML = '<p class="muted">Switch language to run checks.</p>';
      return;
    }
    var ed = getEditorialMeta(L);
    var he = loadDoc('hero_en', {}) || {};
    var hc = loadDoc('hero_' + L, {}) || {};
    var be = getBiographySourceDoc('en') || {};
    var bc = getBiographySourceDoc(L) || {};
    var ce = loadDoc('contact_en', {}) || {};
    var cc = loadDoc('contact_' + L, {}) || {};
    var ue = loadDoc('rg_ui_en', {}) || {};
    var uc = loadDoc('rg_ui_' + L, {}) || {};
    var pe = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    var pc = safeProgramsDoc(loadProgramsCanonicalForLang(L));
    var ek = safeEpkBios(loadDoc('rg_epk_bios', {}));
    var ee = ek.en || {};
    var el = ek[L] || {};

    function card(title, sectionKey, rows, actions) {
      var st = safeString(ed['reviewState_' + sectionKey]);
      var badge =
        '<span class="tx-badge ' + translationReviewBadgeClass(st) + '">' + escapeHtml(st || 'no status') + '</span>';
      var grid =
        '<div class="tx-grid"><span class="tx-grid-h">Field</span><span class="tx-grid-h">EN</span><span class="tx-grid-h">' +
        L.toUpperCase() +
        '</span>';
      rows.forEach(function (r) {
        grid +=
          '<span class="muted">' +
          escapeHtml(r.label) +
          '</span><span class="tx-cell-en">' +
          escapeHtml(txCell(r.en)) +
          '</span><span class="tx-cell-cur">' +
          escapeHtml(txCell(r.cur)) +
          '</span>';
      });
      grid += '</div>';
      var act = actions || '';
      return (
        '<div class="tx-card" data-tx-card="' +
        escapeHtml(sectionKey) +
        '"><h3>' +
        escapeHtml(title) +
        '</h3><div class="tx-card-meta">' +
        badge +
        '</div>' +
        grid +
        '<div class="tx-actions">' +
        act +
        '</div></div>'
      );
    }

    var homeRows = [
      { label: 'Eyebrow', en: he.eyebrow, cur: hc.eyebrow },
      { label: 'Subtitle', en: he.subtitle, cur: hc.subtitle },
      { label: 'CTA 1 / 2', en: (he.cta1 || '') + ' / ' + (he.cta2 || ''), cur: (hc.cta1 || '') + ' / ' + (hc.cta2 || '') },
      { label: 'Intro CTAs', en: (he.introCtaBio || '') + ' · ' + (he.introCtaMedia || ''), cur: (hc.introCtaBio || '') + ' · ' + (hc.introCtaMedia || '') }
    ];
    var homeAct =
      '<button type="button" data-tx-action="open" data-tx-target="home">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="home">Copy missing from EN</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="home">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="home">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="home">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="home">Reviewed</button>';

    var bioRows = [
      { label: 'Intro line', en: be.introLine, cur: bc.introLine },
      { label: 'Title', en: be.h2, cur: bc.h2 },
      { label: 'Paragraphs', en: normalizeParagraphsFromBioStored(be).join(' / '), cur: normalizeParagraphsFromBioStored(bc).join(' / ') },
      { label: 'Continue', en: (be.continueSectionTag || '') + ' · ' + (be.continueSub || ''), cur: (bc.continueSectionTag || '') + ' · ' + (bc.continueSub || '') },
      { label: 'CTAs', en: [be.ctaRepertoire, be.ctaMedia, be.ctaContact, be.ctaHomeIntro].filter(Boolean).join(' · '), cur: [bc.ctaRepertoire, bc.ctaMedia, bc.ctaContact, bc.ctaHomeIntro].filter(Boolean).join(' · ') },
      { label: 'Portrait alt', en: be.portraitAlt, cur: bc.portraitAlt },
      { label: 'Quote', en: be.quote, cur: bc.quote }
    ];
    var bioAct =
      '<button type="button" data-tx-action="open" data-tx-target="bio">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="bio">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="bio">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="bio">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="bio">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="bio">Reviewed</button>';

    var contactRows = [
      { label: 'Title', en: ce.title, cur: cc.title },
      { label: 'Subtitle', en: ce.sub, cur: cc.sub },
      { label: 'Email', en: ce.email, cur: cc.email },
      { label: 'Web URL', en: ce.webUrl, cur: cc.webUrl }
    ];
    var contactAct =
      '<button type="button" data-tx-action="open" data-tx-target="contact">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="contact">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="contact">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="contact">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="contact">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="contact">Reviewed</button>';

    var pf = flatPublicRgUiCopyFields();
    var copyFilledEn = 0;
    var copyFilledCur = 0;
    var copyTotal = pf.length;
    pf.forEach(function (f) {
      if (!isBlank(ue[f.key])) copyFilledEn += 1;
      if (!isBlank(uc[f.key])) copyFilledCur += 1;
    });
    var uiRows = [
      { label: 'Nav home', en: ue['nav.home'], cur: uc['nav.home'] },
      { label: 'Nav bio', en: ue['nav.bio'], cur: uc['nav.bio'] },
      { label: 'Nav rep', en: ue['nav.rep'], cur: uc['nav.rep'] },
      { label: 'Nav media', en: ue['nav.media'], cur: uc['nav.media'] },
      { label: 'Nav cal', en: ue['nav.cal'], cur: uc['nav.cal'] },
      { label: 'Nav EPK', en: ue['nav.epk'], cur: uc['nav.epk'] },
      { label: 'Nav book', en: ue['nav.book'], cur: uc['nav.book'] },
      { label: 'Nav contact (section tag)', en: ue['nav.contact'], cur: uc['nav.contact'] },
      {
        label: 'Structured public copy (keys with saved text)',
        en: String(copyFilledEn) + ' / ' + String(copyTotal),
        cur: String(copyFilledCur) + ' / ' + String(copyTotal)
      }
    ];
    var uiAct =
      '<button type="button" data-tx-action="open" data-tx-target="ui">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="ui">Copy missing UI strings</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="ui">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="ui">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="ui">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="ui">Reviewed</button>';

    var progRows = [
      { label: 'Title / sub', en: (pe.title || '') + ' · ' + (pe.subtitle || ''), cur: (pc.title || '') + ' · ' + (pc.subtitle || '') },
      { label: 'Intro', en: pe.intro, cur: pc.intro },
      { label: 'Programs #', en: String((pe.programs || []).length), cur: String((pc.programs || []).length) }
    ];
    var progAct =
      '<button type="button" data-tx-action="open" data-tx-target="programs">Open</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="programs">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="programs">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="programs">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="programs">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="programs">Reviewed</button>';

    var epkRows = [
      { label: 'Bio 50', en: ee.b50, cur: el.b50 },
      { label: 'Bio 150', en: ee.b150, cur: el.b150 },
      { label: 'Long §1', en: ee.b300p1, cur: el.b300p1 }
    ];
    var epkAct =
      '<button type="button" data-tx-action="open-press-bios">Open EPK bios</button> ' +
      '<button type="button" data-tx-action="copy-missing" data-tx-target="press_bios">Copy missing</button> ' +
      '<button type="button" data-tx-action="compare" data-tx-target="press_bios">Compare</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="needs_translation" data-tx-target="press_bios">Needs translation</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="translated" data-tx-target="press_bios">Translated</button> ' +
      '<button type="button" data-tx-action="mark" data-tx-mark="reviewed" data-tx-target="press_bios">Reviewed</button>';

    box.innerHTML =
      card('Home / Hero', 'home', homeRows, homeAct) +
      card('Biography', 'bio', bioRows, bioAct) +
      card('Contact', 'contact', contactRows, contactAct) +
      card('UI labels', 'ui', uiRows, uiAct) +
      card('Programs (copy)', 'programs', progRows, progAct) +
      card('Press · EPK bios', 'press_bios', epkRows, epkAct);

    runTranslationConsistencyQa(true);
    applyTranslationMissingOnlyMask();
  }

  function runTranslationConsistencyQa(silent) {
    var elQ = $('translation-qa');
    if (!elQ) return;
    var L = state.lang;
    if (L === 'en') return;
    var issues = [];
    var he = loadDoc('hero_en', {}) || {};
    var hc = loadDoc('hero_' + L, {}) || {};
    [['cta1', 'Home CTA 1'], ['cta2', 'Home CTA 2'], ['introCtaBio', 'Home intro CTA bio'], ['introCtaMedia', 'Home intro CTA media']].forEach(function (pair) {
      if (!isBlank(he[pair[0]]) && isBlank(hc[pair[0]])) issues.push(pair[1] + ' empty while EN has text.');
    });
    var be = getBiographyLocalizedDoc('de') || {};
    var bc = getBiographySourceDoc(L) || {};
    ['h2', 'p1', 'p2'].forEach(function (k) {
      if (!isBlank(be[k]) && isBlank(bc[k])) issues.push('Biography field "' + k + '" empty while DE has text.');
      var et = safeString(be[k]).trim();
      var ct = safeString(bc[k]).trim();
      if (et.length > 40 && ct === et) issues.push('Biography "' + k + '" still identical to DE (may be untranslated).');
    });
    var ue = loadDoc('rg_ui_en', {}) || {};
    var uc = loadDoc('rg_ui_' + L, {}) || {};
    ['nav.home', 'nav.bio', 'nav.cal', 'nav.book', 'nav.contact'].forEach(function (k) {
      if (!isBlank(ue[k]) && isBlank(uc[k])) issues.push('UI label ' + k + ' missing while EN has text.');
    });
    var pd = safePublicPdfs(loadDoc('rg_public_pdfs', {}));
    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (code) {
      var enD = safeString(pd.dossier.EN && pd.dossier.EN.url).trim();
      var enA = safeString(pd.artistSheet.EN && pd.artistSheet.EN.url).trim();
      var d = safeString(pd.dossier[code] && pd.dossier[code].url).trim();
      var a = safeString(pd.artistSheet[code] && pd.artistSheet[code].url).trim();
      if (code === 'EN') return;
      if ((enD || enA) && !d && enD) issues.push('Public PDF: Dossier ' + code + ' missing while EN dossier is set.');
      if ((enD || enA) && !a && enA) issues.push('Public PDF: Artist sheet ' + code + ' missing while EN sheet is set.');
    });
    var pe = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
    var pc = safeProgramsDoc(loadProgramsCanonicalForLang(L));
    if ((pe.programs || []).length > 0 && (pc.programs || []).length === 0) issues.push('Programs list empty for ' + L.toUpperCase() + ' while EN has programs.');
    if (!isBlank(pe.title) && isBlank(pc.title)) issues.push('Programs section title missing for ' + L.toUpperCase() + ' while EN has one.');

    if (!issues.length) elQ.innerHTML = '<p class="muted ok">No obvious consistency gaps for ' + L.toUpperCase() + ' vs EN.</p>';
    else elQ.innerHTML = '<ul>' + issues.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul>';
    if (!silent && issues.length) setStatus('Consistency: ' + issues.length + ' note(s)', 'warn');
  }

  function batchCopyMissingFromEnForCurrentLang() {
    if (state.lang === 'en') return setStatus('Switch to a non-EN language first.', 'warn');
    var msg =
      'Copy missing fields from EN into the current language for:\n' +
      'Home, Biography, Contact, UI nav + structured public copy, Programs (saved docs), and EPK bios.\n\n' +
      'This updates the editor only until you save each section. Continue?';
    if (!window.confirm(msg)) return;
    copyHomeMissingFromEn();
    copyBioMissingFromEn();
    copyContactFromEn(true);
    copyUiNavFromEn(true);
    state.epkBios = safeEpkBios(loadDoc('rg_epk_bios', {}));
    copyPressBiosMissingFromEn();
    state.programsDoc = safeProgramsDoc(loadProgramsCanonicalForLang(state.lang));
    copyProgramsFromEn(true);
    refreshTranslationWorkspace();
    markDirty(true, 'Batch: missing fields from EN applied in editor');
    pushActivitySummary('Batch copy from EN', ['Home, Bio, Contact, UI (nav + structured copy), Programs, EPK bios — review and save per section.']);
    setStatus('Batch copy applied in editor — save each section as needed.', 'ok');
  }

  function txLabelWrapForInput(inputId) {
    var el = $(inputId);
    if (!el || !el.parentElement) return null;
    var p = el.parentElement;
    return p.tagName === 'LABEL' ? p : null;
  }
  function txFieldNeedsAttention(enVal, curVal) {
    var en = safeString(enVal).trim();
    var cur = safeString(curVal).trim();
    if (!en && !cur) return false;
    if (!cur && en) return true;
    if (en && cur && cur !== en) return true;
    if (state.lang !== 'en' && en && cur && cur === en && en.length > 12) return true;
    return false;
  }
  function applyTranslationMissingOnlyMask() {
    var app = $('adm2App');
    if (!app) return;
    var on = !!(state.translationMissingOnly && state.lang !== 'en');
    app.classList.toggle('adm2-tx-missing-only', on);
    document.querySelectorAll('.tx-missing-only-hide').forEach(function (node) { node.classList.remove('tx-missing-only-hide'); });
    if (!on) return;
    var sec = state.section;
    var L = state.lang;
    function hideIf(id, enV, curV) {
      var lab = txLabelWrapForInput(id);
      if (!lab) return;
      if (!txFieldNeedsAttention(enV, curV)) lab.classList.add('tx-missing-only-hide');
    }
    if (sec === 'home') {
      var he = loadDoc('hero_en', {}) || {};
      hideIf('hero-eyebrow', he.eyebrow, $('hero-eyebrow').value);
      hideIf('hero-subtitle', he.subtitle, $('hero-subtitle').value);
      hideIf('hero-cta1', he.cta1, $('hero-cta1').value);
      hideIf('hero-cta2', he.cta2, $('hero-cta2').value);
      hideIf('hero-quickBioLabel', he.quickBioLabel, $('hero-quickBioLabel').value);
      hideIf('hero-quickCalLabel', he.quickCalLabel, $('hero-quickCalLabel').value);
      hideIf('hero-introCtaBio', he.introCtaBio, $('hero-introCtaBio').value);
      hideIf('hero-introCtaMedia', he.introCtaMedia, $('hero-introCtaMedia').value);
    } else if (sec === 'bio') {
      var be = getBiographyCanonicalDoc() || {};
      hideIf('bio-introLine', be.introLine, $('bio-introLine').value);
      hideIf('bio-h2', be.h2, $('bio-h2').value);
      bioParagraphFieldIds().forEach(function (id, idx) {
        var enP = normalizeParagraphsFromBioStored(be)[idx];
        hideIf(id, enP, $(id).value);
      });
      hideIf('bio-continue-tag', be.continueSectionTag, $('bio-continue-tag').value);
      hideIf('bio-continue-sub', be.continueSub, $('bio-continue-sub').value);
      hideIf('bio-cta-rep', be.ctaRepertoire, $('bio-cta-rep').value);
      hideIf('bio-cta-media', be.ctaMedia, $('bio-cta-media').value);
      hideIf('bio-cta-contact', be.ctaContact, $('bio-cta-contact').value);
      hideIf('bio-cta-home', be.ctaHomeIntro, $('bio-cta-home').value);
      hideIf('bio-portraitAlt', be.portraitAlt, $('bio-portraitAlt').value);
      hideIf('bio-quote', be.quote, $('bio-quote').value);
      hideIf('bio-cite', be.cite, $('bio-cite').value);
    } else if (sec === 'contact') {
      var ce = loadDoc('contact_en', {}) || {};
      hideIf('contact-title', ce.title, $('contact-title').value);
      hideIf('contact-sub', ce.sub, $('contact-sub').value);
      hideIf('contact-email', ce.email, $('contact-email').value);
      hideIf('contact-emailBtn', ce.emailBtn, $('contact-emailBtn').value);
      hideIf('contact-webBtn', ce.webBtn, $('contact-webBtn').value);
      hideIf('contact-webUrl', ce.webUrl, $('contact-webUrl').value);
    } else if (sec === 'ui') {
      var ue = loadDoc('rg_ui_en', {}) || {};
      hideIf('ui-nav-home', ue['nav.home'], $('ui-nav-home').value);
      hideIf('ui-nav-bio', ue['nav.bio'], $('ui-nav-bio').value);
      hideIf('ui-nav-rep', ue['nav.rep'], $('ui-nav-rep').value);
      hideIf('ui-nav-media', ue['nav.media'], $('ui-nav-media').value);
      hideIf('ui-nav-cal', ue['nav.cal'], $('ui-nav-cal').value);
      hideIf('ui-nav-epk', ue['nav.epk'], $('ui-nav-epk').value);
      hideIf('ui-nav-book', ue['nav.book'], $('ui-nav-book').value);
      hideIf('ui-nav-contact', ue['nav.contact'], $('ui-nav-contact') && $('ui-nav-contact').value);
      flatPublicRgUiCopyFields().forEach(function (f) {
        var id = fieldDomIdForUiKey(f.key);
        hideIf(id, ue[f.key], $(id) && $(id).value);
      });
    } else if (sec === 'programs') {
      var enP = safeProgramsDoc(loadProgramsCanonicalForLang('en'));
      var curP = state.programsDoc;
      hideIf('programs-title', enP.title, $('programs-title').value);
      hideIf('programs-subtitle', enP.subtitle, $('programs-subtitle').value);
      hideIf('programs-intro', enP.intro, $('programs-intro').value);
      hideIf('programs-closingNote', enP.closingNote, $('programs-closingNote').value);
      var ei = enP.programs[state.programsIndex] || {};
      var ci = curP.programs[state.programsIndex] || {};
      hideIf('programs-item-title', ei.title, $('programs-item-title').value);
      hideIf('programs-item-description', ei.description, $('programs-item-description').value);
      hideIf('programs-item-duration', ei.duration, $('programs-item-duration').value);
    } else if (sec === 'press' && state.pressTab === 'bios') {
      var eb = (safeEpkBios(loadDoc('rg_epk_bios', {})).en) || {};
      var lb = (safeEpkBios(loadDoc('rg_epk_bios', {}))[L]) || {};
      hideIf('epk-bio-b50', eb.b50, $('epk-bio-b50').value);
      hideIf('epk-bio-b150', eb.b150, $('epk-bio-b150').value);
      hideIf('epk-bio-b300p1', eb.b300p1, $('epk-bio-b300p1').value);
      hideIf('epk-bio-b300p2', eb.b300p2, $('epk-bio-b300p2').value);
      hideIf('epk-bio-b300p3', eb.b300p3, $('epk-bio-b300p3').value);
      hideIf('epk-bio-b300p4', eb.b300p4, $('epk-bio-b300p4').value);
    }
  }

  function wireTranslationWorkspaceActions() {
    var box = $('translation-workspace');
    if (!box || box.dataset.txWired === '1') return;
    box.dataset.txWired = '1';
    box.addEventListener('click', function (evt) {
      var btn = evt.target && evt.target.closest ? evt.target.closest('[data-tx-action]') : null;
      if (!btn) return;
      var action = safeString(btn.getAttribute('data-tx-action'));
      var target = safeString(btn.getAttribute('data-tx-target'));
      var mark = safeString(btn.getAttribute('data-tx-mark'));
      if (action === 'open' && target) openSection(target);
      else if (action === 'open-press-bios') {
        openSection('press');
        togglePressTab('bios');
      } else if (action === 'copy-missing') {
        if (target === 'home') copyHomeMissingFromEn();
        else if (target === 'bio') copyBioMissingFromEn();
        else if (target === 'contact') copyContactFromEn(true);
        else if (target === 'ui') copyUiNavFromEn(true);
        else if (target === 'programs') {
          state.programsDoc = safeProgramsDoc(loadProgramsCanonicalForLang(state.lang));
          copyProgramsFromEn(true);
        } else if (target === 'press_bios') {
          state.epkBios = safeEpkBios(loadDoc('rg_epk_bios', {}));
          copyPressBiosMissingFromEn();
        }
        refreshTranslationWorkspace();
      } else if (action === 'compare') {
        if (target === 'home') compareHomeWithEn();
        else if (target === 'bio') compareBioWithEn();
        else if (target === 'contact') compareContactWithEn();
        else if (target === 'ui') compareUiWithEn();
        else if (target === 'programs') compareProgramsWithEn();
        else if (target === 'press_bios') comparePressBiosWithEn();
      } else if (action === 'mark' && target && mark) setSectionEditorialReview(target, mark);
    });
  }

  function normEditorial(s) {
    return safeString(s).trim().toLowerCase();
  }
  function workflowBucketProgram(p) {
    if (!p || !isObject(p)) return 'draft';
    var es = normEditorial(p.editorialStatus);
    if (p.published === false || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketPress(p) {
    if (!p || !isObject(p)) return 'draft';
    var es = normEditorial(p.editorialStatus);
    if (p.visible === false || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketVideo(v) {
    if (!v || !isObject(v)) return 'draft';
    var es = normEditorial(v.editorialStatus);
    if (v.hidden || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketPerf(e) {
    if (!e || !isObject(e)) return 'draft';
    var st = safeString(e.status || 'upcoming');
    var es = normEditorial(e.editorialStatus);
    if (st === 'hidden' || es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function workflowBucketRep(c) {
    if (!c || !isObject(c)) return 'draft';
    var es = normEditorial(c.editorialStatus);
    if (es === 'hidden') return 'hidden';
    if (es === 'needs_translation' || es === 'needs translation') return 'needs_translation';
    if (es === 'translated') return 'translated';
    if (es === 'reviewed') return 'reviewed';
    if (es === 'published') return 'published';
    return 'draft';
  }
  function programReadyCheck(p) {
    var issues = [];
    if (isBlank(p.title)) issues.push('Title missing');
    if (isBlank(p.description)) issues.push('Description missing');
    if (p.published === false) issues.push('Unpublished (hidden from listings)');
    var es = normEditorial(p.editorialStatus);
    if (es === 'hidden' || es === 'draft' || es === 'needs_translation' || es === 'needs translation') {
      issues.push('Editorial state: ' + (es || 'draft'));
    }
    return { ok: issues.length === 0, issues: issues };
  }
  function pressQuoteReadyCheck(p) {
    var issues = [];
    if (p.visible === false) issues.push('Hidden');
    if (isBlank(p.source)) issues.push('Source missing');
    var qv = isObject(p.quotes_i18n) ? p.quotes_i18n[state.lang] : p.quote;
    if (isBlank(qv)) issues.push('Quote text missing for ' + state.lang.toUpperCase());
    var url = safeString(p.url).trim();
    if (url && !isValidHttpUrl(url)) issues.push('Press URL looks invalid');
    var es = normEditorial(p.editorialStatus);
    if (es === 'draft' || es === 'needs_translation') issues.push('Editorial: ' + (es || 'draft'));
    return { ok: issues.length === 0, issues: issues };
  }
  function videoReadyCheck(v) {
    var issues = [];
    if (v.hidden) issues.push('Hidden');
    if (isBlank(v.id)) issues.push('Video ID missing');
    if (isBlank(v.title)) issues.push('Title missing');
    var th = safeString(v.customThumb).trim();
    if (th && !isValidHttpUrl(th)) issues.push('Thumbnail URL looks invalid');
    return { ok: issues.length === 0, issues: issues };
  }
  function perfReadyCheck(e) {
    var issues = [];
    if (safeString(e.status) === 'hidden') issues.push('Status hidden');
    if (isBlank(e.sortDate)) issues.push('Sort date missing');
    if (isBlank(e.time)) issues.push('Time missing');
    if (isBlank(e.venue)) issues.push('Venue missing');
    return { ok: issues.length === 0, issues: issues };
  }
  function repCardReadyCheck(c) {
    var issues = [];
    if (isBlank(c.composer)) issues.push('Composer missing');
    if (isBlank(c.opera)) issues.push('Work missing');
    if (isBlank(c.role)) issues.push('Role missing');
    return { ok: issues.length === 0, issues: issues };
  }
  function passesWorkflowFilter(bucket, filter) {
    var f = filter || 'all';
    if (f === 'all') return true;
    if (f === 'ready') return false;
    return bucket === f;
  }
  function programsListedIndices() {
    var arr = state.programsDoc.programs;
    var f = state.programsWorkflowFilter || 'all';
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      var b = workflowBucketProgram(p);
      if (f === 'ready') {
        if (programReadyCheck(p).ok && b !== 'hidden') out.push(i);
      } else if (passesWorkflowFilter(b, f)) out.push(i);
    }
    return out;
  }
  function publishingCountsForBucket(counts, bucket) {
    var o = counts[bucket];
    return typeof o === 'number' ? o : 0;
  }
  function refreshPublishingDashboard() {
    var summary = $('publishing-summary');
    var readyBox = $('publishing-ready');
    if (!summary) return;
    var lang = state.lang;
    var prog = safeProgramsDoc(loadProgramsCanonicalForLang(lang));
    var press = loadDoc('rg_press', []);
    if (!Array.isArray(press)) press = [];
    var perfs = loadDoc('rg_perfs', []);
    if (!Array.isArray(perfs)) perfs = [];
    var vidData = mergeRgVidRead(loadDoc('rg_vid', {}), loadDoc('rg_vid_en', null));
    var rep = loadDoc('rg_rep_cards', []);
    if (!Array.isArray(rep)) rep = [];

    var buckets = ['draft', 'needs_translation', 'translated', 'reviewed', 'published', 'hidden', 'ready'];
    function z() {
      var o = {};
      buckets.forEach(function (b) { o[b] = 0; });
      return o;
    }
    var C = {
      programs: z(),
      press: z(),
      media: z(),
      calendar: z(),
      rep: z()
    };

    prog.programs.forEach(function (p) {
      var b = workflowBucketProgram(p);
      C.programs[b] += 1;
      if (programReadyCheck(p).ok && b !== 'hidden') C.programs.ready += 1;
    });
    press.forEach(function (p) {
      var b = workflowBucketPress(p);
      C.press[b] += 1;
      if (pressQuoteReadyCheck(p).ok && b !== 'hidden') C.press.ready += 1;
    });
    vidData.videos.forEach(function (v) {
      var b = workflowBucketVideo(v);
      C.media[b] += 1;
      if (videoReadyCheck(v).ok && b !== 'hidden') C.media.ready += 1;
    });
    perfs.forEach(function (e) {
      var b = workflowBucketPerf(e);
      C.calendar[b] += 1;
      if (perfReadyCheck(e).ok && safeString(e.status) !== 'hidden') C.calendar.ready += 1;
    });
    rep.forEach(function (c) {
      var b = workflowBucketRep(c);
      C.rep[b] += 1;
      if (repCardReadyCheck(c).ok && b !== 'hidden') C.rep.ready += 1;
    });

    function rowLabel(key) {
      if (key === 'needs_translation') return 'Needs translation';
      if (key === 'ready') return 'Ready to publish';
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
    function tableFor(title, counts) {
      var head = buckets.map(function (b) { return '<th>' + escapeHtml(rowLabel(b)) + '</th>'; }).join('');
      var cells = buckets.map(function (b) { return '<td>' + publishingCountsForBucket(counts, b) + '</td>'; }).join('');
      return '<h3 class="tools-subheading">' + escapeHtml(title) + '</h3><table class="pub-sum-table"><thead><tr><th>Area</th>' + head + '</tr></thead><tbody><tr><th>' + escapeHtml(title) + '</th>' + cells + '</tr></tbody></table>';
    }

    summary.innerHTML =
      '<p class="muted">Language for Programs is <strong>' + lang.toUpperCase() + '</strong>; Press, Media, Calendar, and Repertoire are shared lists.</p>' +
      tableFor('Programs (' + lang.toUpperCase() + ')', C.programs) +
      tableFor('Press quotes', C.press) +
      tableFor('Media videos', C.media) +
      tableFor('Calendar events', C.calendar) +
      tableFor('Repertoire cards', C.rep) +
      '<div class="toolbar pub-jump-tools">' +
      '<button type="button" data-pub-jump="programs:draft">Programs · drafts</button>' +
      '<button type="button" data-pub-jump="programs:ready">Programs · ready</button>' +
      '<button type="button" data-pub-jump="press:needs_translation">Press · needs translation</button>' +
      '<button type="button" data-pub-jump="media:draft">Media · drafts</button>' +
      '<button type="button" data-pub-jump="calendar:published">Calendar · published</button>' +
      '<button type="button" data-pub-jump="rep:reviewed">Repertoire · reviewed</button>' +
      '</div>';

    if (readyBox) {
      var lines = [];
      prog.programs.forEach(function (p, i) {
        var pr = programReadyCheck(p);
        if (!pr.ok && workflowBucketProgram(p) !== 'hidden') {
          lines.push('Program #' + (i + 1) + ' · ' + safeString(p.title).slice(0, 40) + ' — ' + pr.issues.join('; '));
        }
      });
      press.forEach(function (p, i) {
        var pr = pressQuoteReadyCheck(p);
        if (!pr.ok && workflowBucketPress(p) !== 'hidden') {
          lines.push('Press #' + (i + 1) + ' — ' + pr.issues.join('; '));
        }
      });
      vidData.videos.forEach(function (v, i) {
        var pr = videoReadyCheck(v);
        if (!pr.ok && workflowBucketVideo(v) !== 'hidden') lines.push('Video #' + (i + 1) + ' — ' + pr.issues.join('; '));
      });
      perfs.forEach(function (e, i) {
        var pr = perfReadyCheck(e);
        if (!pr.ok && safeString(e.status) !== 'hidden') lines.push('Event #' + (i + 1) + ' — ' + pr.issues.join('; '));
      });
      if (!lines.length) readyBox.innerHTML = '<p class="muted ok">No blocked items found for usual publish checks (in non-hidden entries).</p>';
      else {
        readyBox.innerHTML =
          '<p class="muted">Items that may still need work before publishing (first pass):</p><ul>' +
          lines.slice(0, 35).map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') +
          (lines.length > 35 ? '<li>… ' + (lines.length - 35) + ' more</li>' : '') +
          '</ul>';
      }
    }
  }
  function publishingJumpTo(section, filter) {
    if (!filter) filter = 'all';
    if (section === 'programs') {
      state.programsWorkflowFilter = filter;
      if ($('programs-workflow-filter')) $('programs-workflow-filter').value = filter;
      openSection('programs');
    } else if (section === 'press') {
      state.pressWorkflowFilter = filter;
      if ($('press-workflow-filter')) $('press-workflow-filter').value = filter;
      openSection('press');
    } else if (section === 'media') {
      state.mediaVidWorkflowFilter = filter;
      if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').value = filter;
      openSection('media');
    } else if (section === 'calendar') {
      state.perfWorkflowFilter = filter;
      if ($('perf-workflow-filter')) $('perf-workflow-filter').value = filter;
      openSection('calendar');
    } else if (section === 'rep') {
      state.repWorkflowFilter = filter;
      if ($('rep-workflow-filter')) $('rep-workflow-filter').value = filter;
      openSection('rep');
    }
  }
  function programReviewAndPublishCurrent() {
    if (state.programsIndex < 0) return alert('Select a program in the list.');
    var p = state.programsDoc.programs[state.programsIndex];
    if (!p) return;
    p.editorialStatus = 'published';
    p.published = true;
    renderProgramsList();
    renderProgramsEditor();
    markDirty(true, 'Program marked reviewed + published');
    setStatus('Published workflow: editorial set to published and card is visible.', 'ok');
  }
  function pressHideCurrentQuote() {
    if (state.pressIndex < 0) return;
    var p = state.press[state.pressIndex];
    if (!p) return;
    p.visible = false;
    p.editorialStatus = 'hidden';
    renderPressList();
    renderPressEditor();
    markDirty(true, 'Quote hidden');
  }
  function perfArchiveCurrentEvent() {
    if (state.perfIndex < 0) return;
    var e = state.perfs[state.perfIndex];
    if (!e) return;
    e.status = 'past';
    renderPerfList();
    renderPerfEditor();
    markDirty(true, 'Event marked past');
  }
  function applyProgramsBulkEditorial() {
    var ids = selectedIndices(state.programsSelected);
    var action = safeString($('programs-bulk-editorial') && $('programs-bulk-editorial').value).trim();
    if (!ids.length) return alert('No programs selected.');
    if (!action) return alert('Choose a bulk editorial action.');
    if (!window.confirm('Apply editorial action to ' + ids.length + ' program card(s)?')) return;
    ids.forEach(function (i) {
      var p = state.programsDoc.programs[i];
      if (!p) return;
      if (action === 'publish') {
        p.editorialStatus = 'published';
        p.published = true;
      } else if (action === 'reviewed_only') {
        p.editorialStatus = 'reviewed';
      } else if (action === 'draft') {
        p.editorialStatus = 'draft';
        p.published = false;
      } else if (action === 'unpublish') {
        p.editorialStatus = 'draft';
        p.published = true;
      } else if (action === 'hide') {
        p.editorialStatus = 'hidden';
        p.published = false;
      } else if (action === 'unhide') {
        p.published = true;
        if (normEditorial(p.editorialStatus) === 'hidden') p.editorialStatus = 'draft';
      } else if (action === 'needs_translation') {
        p.editorialStatus = 'needs_translation';
      } else if (action === 'translated') {
        p.editorialStatus = 'translated';
      }
    });
    clearSelected(state.programsSelected);
    renderProgramsList();
    renderProgramsEditor();
    setSelectionCount('programs-selection-count', state.programsSelected);
    markDirty(true, 'Programs bulk editorial applied');
  }

  function addProgramFromTemplate() {
    var arr = state.programsDoc.programs;
    var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
    arr.push({ id: maxId + 1, order: arr.length, published: false, editorialStatus: 'draft', title: 'New program title', description: 'Program description', formations: [], duration: '', idealFor: [] });
    state.programsIndex = arr.length - 1;
    renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program template created');
  }
  function duplicateCurrentProgramToLanguage() {
    if (state.programsIndex < 0) return alert('Select a program first.');
    var target = safeString(window.prompt('Target language (en, de, es, it, fr):', state.lang)).trim().toLowerCase();
    if (!target || LANGS.indexOf(target) < 0) return;
    if (target === state.lang) return alert('Target language is current language.');
    var item = clone(state.programsDoc.programs[state.programsIndex] || {});
    if (!isObject(item)) return;
    var targetDoc = safeProgramsDoc(loadProgramsCanonicalForLang(target));
    targetDoc.programs.push(item);
    targetDoc = safeProgramsDoc(targetDoc);
    targetDoc.programs.forEach(function (p, i) { p.order = i; if (!p.id) p.id = i + 1; });
    saveDoc('rg_programs_' + target, targetDoc);
    pushActivitySummary('Program duplicated to language', ['From ' + state.lang.toUpperCase() + ' to ' + target.toUpperCase()]);
    setStatus('Program duplicated to ' + target.toUpperCase() + '.', 'ok');
  }
  function addQuoteFromTemplate() {
    state.press.push({ id: Date.now(), source: 'Publication', quote: 'Quote text', production: '', url: '', visible: true, editorialStatus: 'draft', order: state.press.length, quotes_i18n: {}, production_i18n: {} });
    state.pressIndex = state.press.length - 1;
    renderPressList(); renderPressEditor(); markDirty(true, 'Quote template created');
  }
  function addEventFromTemplate() {
    state.perfs.push({ title: 'Event title', detail: '', day: '', month: '', time: '20:00', venue: '', city: '', status: 'upcoming', type: 'concert', editorialStatus: 'draft', sortDate: '', revenueAmount: '', revenueCurrency: 'EUR', revenueStatus: 'unknown', revenueNotes: '' });
    state.perfIndex = state.perfs.length - 1;
    renderPerfList(); renderPerfEditor(); markDirty(true, 'Event template created');
  }
  function visibleIndicesFromList(listId) {
    var box = $(listId);
    if (!box) return [];
    return Array.prototype.map.call(box.querySelectorAll('.item[data-idx]'), function (el) {
      return Number(el.getAttribute('data-idx'));
    }).filter(function (n) { return Number.isFinite(n) && n >= 0; });
  }
  function selectVisibleInto(map, listId) {
    clearSelected(map);
    visibleIndicesFromList(listId).forEach(function (idx) { map[idx] = true; });
  }
  function selectedIndices(map) {
    return Object.keys(map || {}).filter(function (k) { return !!map[k]; }).map(function (k) { return Number(k); }).filter(function (n) { return Number.isFinite(n); });
  }
  function applyRepBulk() {
    var ids = selectedIndices(state.repSelected);
    if (!ids.length) return alert('No Repertoire items selected.');
    var nextStatus = safeString($('rep-bulk-status').value).trim();
    var nextCat = safeString($('rep-bulk-cat').value).trim();
    if (!nextStatus && !nextCat) return alert('Choose at least one bulk value (status or category).');
    if (!window.confirm('Apply Repertoire bulk update to ' + ids.length + ' selected item(s)?')) return;
    ids.forEach(function (i) {
      var c = state.repCards[i];
      if (!c) return;
      if (nextStatus) c.status = nextStatus;
      if (nextCat) c.cat = nextCat;
    });
    renderRepList();
    renderRepEditor();
    markDirty(true, 'Repertoire bulk update applied to ' + ids.length + ' item(s)');
  }
  function applyPerfBulk() {
    var ids = selectedIndices(state.perfSelected);
    var status = safeString($('perf-bulk-status').value).trim();
    if (!ids.length) return alert('No Calendar events selected.');
    if (!status) return alert('Choose a bulk status.');
    if (!window.confirm('Set status "' + status + '" for ' + ids.length + ' selected event(s)?')) return;
    ids.forEach(function (i) {
      var e = state.perfs[i];
      if (!e) return;
      e.status = status;
    });
    renderPerfList();
    renderPerfEditor();
    markDirty(true, 'Calendar bulk status updated for ' + ids.length + ' event(s)');
  }
  function applyMediaVidBulk() {
    var ids = selectedIndices(state.mediaVidSelected);
    var action = safeString($('media-vid-bulk-action').value).trim();
    if (!ids.length) return alert('No videos selected.');
    if (!action) return alert('Choose a bulk action.');
    if (!window.confirm('Apply "' + action + '" to ' + ids.length + ' selected video(s)?')) return;
    ids.forEach(function (i) {
      var v = state.vidData.videos[i];
      if (!v) return;
      if (action === 'visible') v.hidden = false;
      else if (action === 'hidden') v.hidden = true;
      else if (action === 'featured') v.featured = true;
      else if (action === 'not_featured') v.featured = false;
      else if (action === 'publish_video') {
        v.hidden = false;
        v.editorialStatus = 'published';
      } else if (action === 'draft_video') {
        v.editorialStatus = 'draft';
        v.hidden = false;
      } else if (action === 'hide_editorial') {
        v.hidden = true;
        v.editorialStatus = 'hidden';
      } else if (action === 'review_video') {
        v.editorialStatus = 'reviewed';
      }
    });
    renderMediaVideosList();
    renderMediaVideoEditor();
    markDirty(true, 'Media videos bulk action applied to ' + ids.length + ' item(s)');
  }
  function applyPressEditorialBulk() {
    var ids = selectedIndices(state.pressSelected);
    var action = safeString($('press-bulk-editorial') && $('press-bulk-editorial').value).trim();
    if (!ids.length) return alert('No quotes selected.');
    if (!action) return alert('Choose an editorial action.');
    if (!window.confirm('Apply editorial change to ' + ids.length + ' quote(s)?')) return;
    ids.forEach(function (i) {
      var p = state.press[i];
      if (!p) return;
      if (action === 'publish_quote') {
        p.visible = true;
        p.editorialStatus = 'published';
      } else if (action === 'draft_quote') {
        p.visible = true;
        p.editorialStatus = 'draft';
      } else if (action === 'hide_quote') {
        p.visible = false;
        p.editorialStatus = 'hidden';
      } else if (action === 'needs_translation') {
        p.editorialStatus = 'needs_translation';
        p.visible = true;
      } else if (action === 'reviewed_quote') {
        p.editorialStatus = 'reviewed';
        p.visible = true;
      }
    });
    clearSelected(state.pressSelected);
    renderPressList();
    renderPressEditor();
    markDirty(true, 'Press quotes editorial bulk applied');
  }
  function applyPerfEditorialBulk() {
    var ids = selectedIndices(state.perfSelected);
    var action = safeString($('perf-bulk-editorial') && $('perf-bulk-editorial').value).trim();
    if (!ids.length) return alert('No events selected.');
    if (!action) return alert('Choose an editorial action.');
    if (!window.confirm('Apply editorial change to ' + ids.length + ' event(s)?')) return;
    ids.forEach(function (i) {
      var e = state.perfs[i];
      if (!e) return;
      if (action === 'publish_event') e.editorialStatus = 'published';
      else if (action === 'draft_event') e.editorialStatus = 'draft';
      else if (action === 'reviewed_event') e.editorialStatus = 'reviewed';
      else if (action === 'hide_event') {
        e.editorialStatus = 'hidden';
        e.status = 'hidden';
      } else if (action === 'unhide_event') {
        if (safeString(e.status) === 'hidden') e.status = 'upcoming';
        if (normEditorial(e.editorialStatus) === 'hidden') e.editorialStatus = 'draft';
      }
    });
    clearSelected(state.perfSelected);
    renderPerfList();
    renderPerfEditor();
    markDirty(true, 'Calendar editorial bulk applied');
  }
  function applyRepEditorialBulk() {
    var ids = selectedIndices(state.repSelected);
    var action = safeString($('rep-bulk-editorial') && $('rep-bulk-editorial').value).trim();
    if (!ids.length) return alert('No repertoire items selected.');
    if (!action) return alert('Choose an editorial action.');
    if (!window.confirm('Apply editorial change to ' + ids.length + ' card(s)?')) return;
    ids.forEach(function (i) {
      var c = state.repCards[i];
      if (!c) return;
      if (action === 'publish_rep') c.editorialStatus = 'published';
      else if (action === 'draft_rep') c.editorialStatus = 'draft';
      else if (action === 'reviewed_rep') c.editorialStatus = 'reviewed';
      else if (action === 'hide_rep') c.editorialStatus = 'hidden';
    });
    clearSelected(state.repSelected);
    renderRepList();
    renderRepEditor();
    markDirty(true, 'Repertoire editorial bulk applied');
  }
  function applyPressBulk() {
    var ids = selectedIndices(state.pressSelected);
    var action = safeString($('press-bulk-visible').value).trim();
    if (!ids.length) return alert('No quotes selected.');
    if (!action) return alert('Choose a bulk visibility action.');
    if (!window.confirm('Apply visibility update to ' + ids.length + ' selected quote(s)?')) return;
    ids.forEach(function (i) {
      var p = state.press[i];
      if (!p) return;
      p.visible = action === 'visible';
    });
    renderPressList();
    renderPressEditor();
    markDirty(true, 'Press bulk visibility updated for ' + ids.length + ' quote(s)');
  }
  function moveArrayIndex(arr, fromIdx, toIdx) {
    if (!Array.isArray(arr)) return false;
    var from = Number(fromIdx);
    var to = Number(toIdx);
    if (!Number.isFinite(from) || !Number.isFinite(to)) return false;
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length || from === to) return false;
    var item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    return true;
  }
  function applyMoveToPosition(section, inputId) {
    var pos = Number($(inputId) && $(inputId).value) - 1;
    if (!Number.isFinite(pos) || pos < 0) return alert('Enter a valid target position.');
    if (section === 'rep') {
      if (state.repIndex < 0) return;
      if (!moveArrayIndex(state.repCards, state.repIndex, Math.min(pos, state.repCards.length - 1))) return;
      state.repIndex = Math.min(pos, state.repCards.length - 1);
      clearSelected(state.repSelected); renderRepList(); renderRepEditor(); markDirty(true, 'Repertoire item moved');
    } else if (section === 'programs') {
      if (state.programsIndex < 0) return;
      if (!moveArrayIndex(state.programsDoc.programs, state.programsIndex, Math.min(pos, state.programsDoc.programs.length - 1))) return;
      state.programsIndex = Math.min(pos, state.programsDoc.programs.length - 1);
      normalizeProgramOrders(); renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program moved');
    } else if (section === 'media-vid') {
      if (state.vidIndex < 0) return;
      if (!moveArrayIndex(state.vidData.videos, state.vidIndex, Math.min(pos, state.vidData.videos.length - 1))) return;
      state.vidIndex = Math.min(pos, state.vidData.videos.length - 1);
      clearSelected(state.mediaVidSelected); renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video moved');
    } else if (section === 'press') {
      if (state.pressIndex < 0) return;
      if (!moveArrayIndex(state.press, state.pressIndex, Math.min(pos, state.press.length - 1))) return;
      state.pressIndex = Math.min(pos, state.press.length - 1);
      clearSelected(state.pressSelected); renderPressList(); renderPressEditor(); markDirty(true, 'Press quote moved');
    } else if (section === 'epk-photo') {
      if (state.epkPhotoIndex < 0) return;
      if (!moveArrayIndex(state.epkPhotos, state.epkPhotoIndex, Math.min(pos, state.epkPhotos.length - 1))) return;
      state.epkPhotoIndex = Math.min(pos, state.epkPhotos.length - 1);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo moved');
    } else if (section === 'perf') {
      if (state.perfIndex < 0) return;
      if (!moveArrayIndex(state.perfs, state.perfIndex, Math.min(pos, state.perfs.length - 1))) return;
      state.perfIndex = Math.min(pos, state.perfs.length - 1);
      clearSelected(state.perfSelected); renderPerfList(); renderPerfEditor(); markDirty(true, 'Calendar event moved');
    }
  }
  function goPrevNext(section, dir) {
    if (section === 'rep') { if (state.repIndex < 0) return; state.repIndex = Math.max(0, Math.min(state.repCards.length - 1, state.repIndex + dir)); renderRepList(); renderRepEditor(); return; }
    if (section === 'programs') { if (state.programsIndex < 0) return; state.programsIndex = Math.max(0, Math.min(state.programsDoc.programs.length - 1, state.programsIndex + dir)); renderProgramsList(); renderProgramsEditor(); return; }
    if (section === 'media-vid') { if (state.vidIndex < 0) return; state.vidIndex = Math.max(0, Math.min(state.vidData.videos.length - 1, state.vidIndex + dir)); renderMediaVideosList(); renderMediaVideoEditor(); return; }
    if (section === 'press') { if (state.pressIndex < 0) return; state.pressIndex = Math.max(0, Math.min(state.press.length - 1, state.pressIndex + dir)); renderPressList(); renderPressEditor(); return; }
    if (section === 'epk-photo') { if (state.epkPhotoIndex < 0) return; state.epkPhotoIndex = Math.max(0, Math.min(state.epkPhotos.length - 1, state.epkPhotoIndex + dir)); renderEpkPhotoList(); renderEpkPhotoEditor(); return; }
    if (section === 'perf') { if (state.perfIndex < 0) return; state.perfIndex = Math.max(0, Math.min(state.perfs.length - 1, state.perfIndex + dir)); renderPerfList(); renderPerfEditor(); return; }
  }
  function revertCurrentItemToSaved(section) {
    if (section === 'rep' && state.repIndex >= 0) {
      var repSaved = getStoredDocRaw('rg_rep_cards', []);
      if (Array.isArray(repSaved) && repSaved[state.repIndex]) state.repCards[state.repIndex] = clone(repSaved[state.repIndex]);
      renderRepList(); renderRepEditor(); markDirty(true, 'Reverted current repertoire item');
    } else if (section === 'programs' && state.programsIndex >= 0) {
      var progSaved = safeProgramsDoc(getStoredDocRaw('rg_programs_' + state.lang, {}));
      if (Array.isArray(progSaved.programs) && progSaved.programs[state.programsIndex]) state.programsDoc.programs[state.programsIndex] = clone(progSaved.programs[state.programsIndex]);
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Reverted current program item');
    } else if (section === 'media-vid' && state.vidIndex >= 0) {
      var vidSaved = mergeRgVidRead(getStoredDocRaw('rg_vid', {}), getStoredDocRaw('rg_vid_en', null));
      if (Array.isArray(vidSaved.videos) && vidSaved.videos[state.vidIndex]) state.vidData.videos[state.vidIndex] = clone(vidSaved.videos[state.vidIndex]);
      renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Reverted current video');
    } else if (section === 'press' && state.pressIndex >= 0) {
      var pressSaved = getStoredDocRaw('rg_press', []);
      if (Array.isArray(pressSaved) && pressSaved[state.pressIndex]) state.press[state.pressIndex] = clone(pressSaved[state.pressIndex]);
      renderPressList(); renderPressEditor(); markDirty(true, 'Reverted current quote');
    } else if (section === 'epk-photo' && state.epkPhotoIndex >= 0) {
      var photoSaved = safeEpkPhotos(getStoredDocRaw('rg_epk_photos', []));
      if (Array.isArray(photoSaved) && photoSaved[state.epkPhotoIndex]) state.epkPhotos[state.epkPhotoIndex] = clone(photoSaved[state.epkPhotoIndex]);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'Reverted current EPK photo');
    } else if (section === 'perf' && state.perfIndex >= 0) {
      var perfSaved = getStoredDocRaw('rg_perfs', []);
      if (Array.isArray(perfSaved) && perfSaved[state.perfIndex]) state.perfs[state.perfIndex] = clone(perfSaved[state.perfIndex]);
      renderPerfList(); renderPerfEditor(); markDirty(true, 'Reverted current event');
    }
  }
  function publicUrlForCurrentSection() {
    var base = window.location.origin + '/';
    var map = {
      home: 'index.html',
      bio: 'biography.html',
      rep: 'repertoire.html',
      programs: 'programs.html',
      calendar: 'calendar.html',
      media: 'media.html',
      press: 'presskit.html',
      contact: 'contact.html'
    };
    return base + (map[state.section] || 'index.html');
  }
  function copyCurrentPublicUrl() {
    var url = publicUrlForCurrentSection();
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(url).then(function () {
        setStatus('Public URL copied', 'ok');
        pushActivitySummary('Shortcut', ['Copied public URL for ' + state.section]);
      }).catch(function () { window.prompt('Copy public URL:', url); });
    } else {
      window.prompt('Copy public URL:', url);
    }
  }
  function toggleFocusMode() {
    state.focusMode = !state.focusMode;
    document.body.classList.toggle('focus-mode', state.focusMode);
    if ($('focusModeBtn')) $('focusModeBtn').textContent = state.focusMode ? 'Exit focus mode' : 'Focus mode';
  }
  function saveUiJson() {
    try {
      var parsed = JSON.parse($('ui-json').value || '{}');
      if (!isObject(parsed)) throw new Error('JSON must be an object');
      parsed = normalizeUiLocaleDoc(parsed, state.lang);
      saveDoc('rg_ui_' + state.lang, parsed);
      ensureUiPublicCopyEditorBuilt();
      loadUiNavFieldsFromDoc(parsed);
      updateCompletenessIndicators();
      setStatus('rg_ui saved', 'ok');
    } catch (e) {
      setStatus('Invalid JSON: ' + e.message, 'err');
      alert('Invalid JSON: ' + e.message);
    }
  }

  function updateContactValidation() {
    var email = safeString($('contact-email') && $('contact-email').value).trim();
    var web = safeString($('contact-webUrl') && $('contact-webUrl').value).trim();
    setValidationText('contact-email-validation', isValidEmail(email), email ? (isValidEmail(email) ? 'Email looks valid.' : 'Enter a valid email address.') : 'Email is empty.');
    if (!web) setValidationText('contact-web-validation', true, 'Website URL is optional. It is reused in Programme Sheets and offer emails, but not shown on the live contact page.');
    else setValidationText('contact-web-validation', isValidHttpUrl(web), isValidHttpUrl(web) ? 'Website URL looks valid. It will be reused in Programme Sheets and offer emails.' : 'Website URL should start with http:// or https://');
  }
  function updatePdfValidation() {
    var langs = ['EN', 'DE', 'ES', 'IT', 'FR'];
    var invalid = [];
    langs.forEach(function (L) {
      var d = safeString($('pdf-dossier-' + L) && $('pdf-dossier-' + L).value).trim();
      var a = safeString($('pdf-artist-' + L) && $('pdf-artist-' + L).value).trim();
      if (d && !isValidHttpUrl(d)) invalid.push('Dossier ' + L);
      if (a && !isValidHttpUrl(a)) invalid.push('Artist Sheet ' + L);
    });
    var el = $('pdf-validation');
    if (!el) return;
    if (!invalid.length) {
      el.textContent = 'All entered PDF URLs look valid.';
      el.classList.remove('err');
      el.classList.add('ok');
    } else {
      el.textContent = 'Invalid URL format: ' + invalid.join(', ');
      el.classList.remove('ok');
      el.classList.add('err');
    }
  }
  function updateCompletenessIndicators() {
    var homeMissing = 0;
    ['hero-eyebrow', 'hero-subtitle', 'hero-cta1', 'hero-cta2', 'hero-introCtaBio', 'hero-introCtaMedia'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) homeMissing += 1;
    });
    HOME_RG_UI_COPY_FIELDS.forEach(function (row) {
      if (row.key === 'home.presenter.style') return;
      if (isBlank($(row.id) && $(row.id).value)) homeMissing += 1;
    });
    setPillStatus('home-completeness', homeMissing ? 'warn' : 'ok', homeMissing ? ('Missing fields: ' + homeMissing) : 'Complete');

    var bioMissing = 0;
    ['bio-introLine', 'bio-h2', 'bio-continue-tag', 'bio-continue-sub'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) bioMissing += 1;
    });
    if (!paragraphsArrayFromBioInputs().length) bioMissing += 1;
    setPillStatus('bio-completeness', bioMissing ? 'warn' : 'ok', bioMissing ? ('Missing fields: ' + bioMissing) : 'Complete');

    var programMissing = 0;
    if (isBlank($('programs-title').value)) programMissing += 1;
    var hasPrograms = Array.isArray(state.programsDoc && state.programsDoc.programs) && state.programsDoc.programs.length > 0;
    if (!hasPrograms) programMissing += 1;
    setPillStatus('programs-completeness', programMissing ? 'warn' : 'ok', programMissing ? (hasPrograms ? 'Missing header text' : 'No program cards') : 'Complete');

    var contactMissing = 0;
    ['contact-title', 'contact-sub', 'contact-email'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) contactMissing += 1;
    });
    setPillStatus('contact-completeness', contactMissing ? 'warn' : 'ok', contactMissing ? ('Missing fields: ' + contactMissing) : 'Complete');

    var pressMissing = 0;
    var b = state.epkBios[state.lang] || {};
    ['b50', 'b150', 'b300p1'].forEach(function (k) {
      if (isBlank(b[k])) pressMissing += 1;
    });
    var hasAnyPdf = ['EN', 'DE', 'ES', 'IT', 'FR'].some(function (L) {
      return !isBlank($('pdf-dossier-' + L).value) || !isBlank($('pdf-artist-' + L).value);
    });
    if (!hasAnyPdf) pressMissing += 1;
    setPillStatus('press-completeness', pressMissing ? 'warn' : 'ok', pressMissing ? 'Missing bios/PDF fields' : 'Complete');

    var calendarMissing = 0;
    ['perf-h2', 'perf-intro'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) calendarMissing += 1;
    });
    setPillStatus('calendar-completeness', calendarMissing ? 'warn' : 'ok', calendarMissing ? 'Section text incomplete' : 'Section text complete');

    var uiMissing = 0;
    ['ui-nav-home', 'ui-nav-bio', 'ui-nav-rep', 'ui-nav-media', 'ui-nav-cal', 'ui-nav-epk', 'ui-nav-book', 'ui-nav-contact'].forEach(function (id) {
      if (isBlank($(id) && $(id).value)) uiMissing += 1;
    });
    var uiPubTotal = 0;
    var uiPubFilled = 0;
    flatPublicRgUiCopyFields().forEach(function (f) {
      var el = $(fieldDomIdForUiKey(f.key));
      if (!el) return;
      uiPubTotal += 1;
      if (!isBlank(el.value)) uiPubFilled += 1;
    });
    var uiPillMsg = uiMissing
      ? 'Missing nav labels: ' + uiMissing
      : uiPubTotal
        ? 'Nav OK · structured fields with text: ' + uiPubFilled + '/' + uiPubTotal
        : 'Nav OK';
    setPillStatus('ui-completeness', uiMissing ? 'warn' : 'ok', uiPillMsg);
  }
  function clipText(v, max) {
    var s = safeString(v).trim();
    if (!s) return '';
    return s.length > max ? (s.slice(0, max - 1) + '…') : s;
  }
  function updateHomeMiniPreviews() {
    if (!$('home-preview-eyebrow')) return;
    $('home-preview-eyebrow').textContent = clipText($('hero-eyebrow').value, 48) || 'Eyebrow';
    $('home-preview-subtitle').textContent = clipText($('hero-subtitle').value, 120) || 'Subtitle';
    $('home-preview-cta1').textContent = clipText($('hero-cta1').value, 28) || 'CTA 1';
    $('home-preview-cta2').textContent = clipText($('hero-cta2').value, 28) || 'CTA 2';
    $('home-preview-quickBio').textContent = clipText($('hero-quickBioLabel').value, 22) || 'Biography';
    $('home-preview-quickCal').textContent = clipText($('hero-quickCalLabel').value, 22) || 'Calendar';
    $('home-preview-introBio').textContent = clipText($('hero-introCtaBio').value, 34) || 'Read biography';
    $('home-preview-introMedia').textContent = clipText($('hero-introCtaMedia').value, 34) || 'Watch & listen';
  }
  function updateBioMiniPreview() {
    if (!$('bio-preview-title')) return;
    if ($('bio-preview-intro')) $('bio-preview-intro').textContent = clipText($('bio-introLine').value, 160) || 'Intro line';
    $('bio-preview-title').textContent = clipText($('bio-h2').value, 80) || 'Biography';
    $('bio-preview-p1').textContent = clipText($('bio-p1').value, 180) || 'Paragraph 1';
    $('bio-preview-p2').textContent = clipText($('bio-p2').value, 180) || 'Paragraph 2';
    $('bio-preview-quote').textContent = clipText($('bio-quote').value, 130) || 'Quote';
  }
  function updateProgramsMiniPreview() {
    if (!$('programs-preview-title')) return;
    $('programs-preview-title').textContent = clipText($('programs-item-title').value, 70) || 'Program title';
    $('programs-preview-description').textContent = clipText($('programs-item-description').value, 180) || 'Program description';
    $('programs-preview-duration').textContent = clipText($('programs-item-duration').value, 36) || 'Duration';
  }
  function updatePressMiniPreview() {
    if (!$('press-preview-quote')) return;
    $('press-preview-quote').textContent = clipText($('press-quote').value, 180) || 'Quote text';
    $('press-preview-source').textContent = clipText($('press-source').value, 80) || 'Source';
  }
  function updateContactMiniPreview() {
    if (!$('contact-preview-title')) return;
    var titleHtml = safeString($('contact-title').value).trim();
    $('contact-preview-title').innerHTML = titleHtml || 'Contact title';
    $('contact-preview-sub').textContent = clipText($('contact-sub').value, 180) || 'Contact subtitle';
    $('contact-preview-emailBtn').textContent = clipText($('contact-emailBtn').value, 30) || 'Email button';
    if ($('contact-preview-webBtn')) {
      $('contact-preview-webBtn').textContent = clipText($('contact-webBtn').value, 30) || 'Website button';
      $('contact-preview-webBtn').style.display = 'none';
    }
    if ($('contact-preview-note')) {
      var webUrl = safeString($('contact-webUrl') && $('contact-webUrl').value).trim();
      var phone = safeString($('contact-phone') && $('contact-phone').value).trim();
      $('contact-preview-note').textContent = webUrl || phone
        ? 'This preview mirrors the live contact-page CTA area. Mobile phone and website details are saved, but they are currently reused only in Programme Sheets and offer emails.'
        : 'This preview mirrors the live contact-page CTA area. Website and phone are not shown there right now.';
    }
  }
  function badgesHtml(items) {
    if (!items || !items.length) return '';
    return '<span class="item-badges">' + items.map(function (b) {
      return '<span class="item-badge ' + safeString(b.kind || 'warn') + '">' + safeString(b.label) + '</span>';
    }).join('') + '</span>';
  }
  function setSelectionCount(id, selectedMap) {
    var el = $(id);
    if (!el) return;
    var count = Object.keys(selectedMap || {}).filter(function (k) { return !!selectedMap[k]; }).length;
    el.textContent = 'Selected: ' + count;
  }
  function toggleSelected(map, idx, checked) {
    if (!map) return;
    if (checked) map[idx] = true;
    else delete map[idx];
  }
  function clearSelected(map) {
    Object.keys(map || {}).forEach(function (k) { delete map[k]; });
  }
  function currentDraftKey() {
    return 'adm2_draft_' + safeString(state.section) + '_' + safeString(state.lang);
  }
  function readDraftRestoreNoticeState() {
    try {
      var raw = sessionStorage.getItem(DRAFT_RESTORE_NOTICE_STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  }
  function writeDraftRestoreNoticeState(obj) {
    try {
      sessionStorage.setItem(DRAFT_RESTORE_NOTICE_STORAGE_KEY, JSON.stringify(obj || {}));
    } catch (e) {}
  }
  function getDraftRestoreNoticeRecord(key) {
    var stateMap = readDraftRestoreNoticeState();
    return isObject(stateMap[key]) ? stateMap[key] : null;
  }
  function setDraftRestoreNoticeRecord(key, patch) {
    var stateMap = readDraftRestoreNoticeState();
    var next = isObject(stateMap[key]) ? clone(stateMap[key]) : {};
    Object.assign(next, patch || {});
    stateMap[key] = next;
    writeDraftRestoreNoticeState(stateMap);
    return next;
  }
  function clearDraftRestoreNoticeRecord(key) {
    var stateMap = readDraftRestoreNoticeState();
    if (stateMap[key]) {
      delete stateMap[key];
      writeDraftRestoreNoticeState(stateMap);
    }
  }
  function readCurrentLocalDraftSnapshot() {
    var key = currentDraftKey();
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.data) return null;
      if (!safeString(parsed.draftId).trim()) {
        parsed.draftId = makeLocalDraftId();
        if (!Number(parsed.createdAt)) parsed.createdAt = Number(parsed.ts) || Date.now();
        try { localStorage.setItem(key, JSON.stringify(parsed)); } catch (e1) {}
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }
  function makeLocalDraftId() {
    return 'draft_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }
  function localDraftRestoreText(ts) {
    var text = formatProgrammeOfferTimestamp(ts);
    return text && text !== 'Not saved yet' ? text : '';
  }
  function hideDraftRestoreBanner() {
    var banner = $('draftRestoreBanner');
    if (!banner) return;
    banner.hidden = true;
    banner.innerHTML = '';
    state.draftRestoreBannerKey = '';
    state.draftRestoreBannerTs = 0;
  }
  function showDraftRestoreBanner(snapshot, force) {
    var banner = $('draftRestoreBanner');
    if (!banner) return false;
    var key = currentDraftKey();
    var ts = Number(snapshot && snapshot.ts) || 0;
    var draftId = safeString(snapshot && snapshot.draftId).trim();
    if (!snapshot || !snapshot.data) {
      hideDraftRestoreBanner();
      return false;
    }
    var notice = getDraftRestoreNoticeRecord(key) || {};
    var sameDraft = draftId && safeString(notice.draftId).trim() === draftId;
    if (!force && sameDraft && (notice.seen || notice.dismissed || notice.restored)) {
      hideDraftRestoreBanner();
      return false;
    }
    state.draftRestoreBannerKey = key;
    state.draftRestoreBannerTs = ts;
    var lastSaved = localDraftRestoreText(ts);
    banner.innerHTML =
      '<div class="draft-restore-banner__copy">' +
        '<p class="draft-restore-banner__title">A local draft exists for this section/language.</p>' +
        (lastSaved ? '<p class="draft-restore-banner__meta">Last saved: ' + escapeHtml(lastSaved) + '</p>' : '') +
      '</div>' +
      '<div class="draft-restore-banner__actions">' +
        '<button type="button" data-draft-restore-action="restore">Restore draft</button>' +
        '<button type="button" data-draft-restore-action="dismiss">Dismiss</button>' +
        '<button type="button" class="muted-link" data-draft-restore-action="clear">Clear draft</button>' +
      '</div>';
    banner.hidden = false;
    setDraftRestoreNoticeRecord(key, { draftId: draftId, ts: ts, seen: true, seenAt: Date.now(), dismissed: false, restored: false });
    bioDebug('draft:banner', { lang: state.lang, draftId: draftId, ts: ts, force: !!force });
    return true;
  }
  function refreshDraftRestoreBanner(force) {
    if (state.section === 'sitehealth') {
      hideDraftRestoreBanner();
      return false;
    }
    var snapshot = readCurrentLocalDraftSnapshot();
    if (!snapshot || !snapshot.data) {
      hideDraftRestoreBanner();
      return false;
    }
    return showDraftRestoreBanner(snapshot, !!force);
  }
  function dismissDraftRestoreBanner(clearDraft) {
    var key = currentDraftKey();
    var snapshot = readCurrentLocalDraftSnapshot();
    var ts = Number(snapshot && snapshot.ts) || Date.now();
    var draftId = safeString(snapshot && snapshot.draftId).trim();
    if (clearDraft) clearLocalDraftForCurrentSection();
    setDraftRestoreNoticeRecord(key, {
      draftId: draftId,
      ts: ts,
      seen: true,
      seenAt: Date.now(),
      dismissed: true,
      restored: false,
      cleared: !!clearDraft
    });
    hideDraftRestoreBanner();
    bioDebug('draft:dismiss', { lang: state.lang, clearDraft: !!clearDraft, draftId: draftId, ts: ts });
  }
  function restoreDraftFromBanner() {
    var snapshot = readCurrentLocalDraftSnapshot();
    if (!snapshot || !snapshot.data) {
      hideDraftRestoreBanner();
      return;
    }
    applySectionDraftObject(state.section, snapshot.data);
    markDirty(true, 'Local draft restored');
    pushActivitySummary('Draft restored', [state.section + ' · ' + state.lang.toUpperCase()]);
    setDraftRestoreNoticeRecord(currentDraftKey(), {
      draftId: safeString(snapshot.draftId).trim(),
      ts: Number(snapshot.ts) || Date.now(),
      seen: true,
      seenAt: Date.now(),
      dismissed: false,
      restored: true
    });
    hideDraftRestoreBanner();
    bioDebug('draft:restore', { lang: state.lang, draftId: safeString(snapshot.draftId).trim(), ts: Number(snapshot.ts) || Date.now() });
  }
  function serializeCurrentSectionDraft() {
    var s = state.section;
    if (s === 'home') return {
      eyebrow: $('hero-eyebrow').value, subtitle: $('hero-subtitle').value, cta1: $('hero-cta1').value, cta2: $('hero-cta2').value,
      quickBioLabel: $('hero-quickBioLabel').value, quickCalLabel: $('hero-quickCalLabel').value, introCtaBio: $('hero-introCtaBio').value,
      introCtaMedia: $('hero-introCtaMedia').value, bgImage: $('hero-bgImage').value, introImage: $('hero-introImage').value
    };
    if (s === 'bio') {
      return {
        introLine: $('bio-introLine').value,
        h2: $('bio-h2').value,
        p1: $('bio-p1').value,
        p2: $('bio-p2').value,
        p3: $('bio-p3').value,
        p4: $('bio-p4').value,
        p5: $('bio-p5').value,
        p6: $('bio-p6').value,
        continueSectionTag: $('bio-continue-tag').value,
        continueSub: $('bio-continue-sub').value,
        ctaRepertoire: $('bio-cta-rep').value,
        ctaMedia: $('bio-cta-media').value,
        ctaContact: $('bio-cta-contact').value,
        ctaHomeIntro: $('bio-cta-home').value,
        portraitAlt: $('bio-portraitAlt').value,
        quote: $('bio-quote').value,
        cite: $('bio-cite').value,
        portraitImage: $('bio-portraitImage').value
      };
    }
    if (s === 'rep') return { h2: $('rep-h2').value, intro: $('rep-intro').value, repCards: clone(state.repCards), repIndex: state.repIndex };
    if (s === 'programs') return { programsDoc: clone(state.programsDoc), programsIndex: state.programsIndex };
    if (s === 'programbuilder') return {
      plannerDoc: clone(state.plannerDoc),
      plannerIndex: state.plannerIndex,
      plannerSearch: state.plannerSearch,
      plannerTypeFilter: state.plannerTypeFilter,
      plannerLangFilter: state.plannerLangFilter,
      plannerReadinessFilter: state.plannerReadinessFilter,
      plannerTagFilter: state.plannerTagFilter,
      plannerSort: state.plannerSort,
      plannerOfferStatusFilter: state.plannerOfferStatusFilter,
      plannerOfferTypeFilter: state.plannerOfferTypeFilter,
      plannerOfferCategoryFilter: state.plannerOfferCategoryFilter,
      plannerOfferTagFilter: state.plannerOfferTagFilter,
      plannerOfferLangFilter: state.plannerOfferLangFilter,
      plannerOfferMatchingOnly: state.plannerOfferMatchingOnly !== false,
      plannerOfferFormationOnly: !!state.plannerOfferFormationOnly,
      plannerOfferShowWithoutTenor: !!state.plannerOfferShowWithoutTenor,
      blueprintDoc: clone(state.blueprintDoc),
      blueprintFamily: state.blueprintFamily,
      blueprintDuration: state.blueprintDuration,
      blueprintPieceIndex: state.blueprintPieceIndex,
      blueprintOutputLang: state.blueprintOutputLang,
      savedOfferId: state.savedOfferId,
      savedOfferSearch: state.savedOfferSearch,
      savedOfferTypeFilter: state.savedOfferTypeFilter,
      savedOfferFamilyFilter: state.savedOfferFamilyFilter,
      savedOfferDurationFilter: state.savedOfferDurationFilter,
      savedOfferLangFilter: state.savedOfferLangFilter,
      savedOfferFormationFilter: state.savedOfferFormationFilter,
      savedOfferStatusFilter: state.savedOfferStatusFilter,
      concertHistoryDoc: clone(state.concertHistoryDoc),
      concertHistoryIndex: state.concertHistoryIndex,
      concertHistorySearch: state.concertHistorySearch
    };
    if (s === 'discovery') return {
      discoveryDoc: clone(state.discoveryDoc),
      discoverySelectedId: state.discoverySelectedId,
      discoverySearch: state.discoverySearch,
      discoveryProfileFilter: state.discoveryProfileFilter,
      discoveryFamilyFilter: state.discoveryFamilyFilter,
      discoveryLanguageFilter: state.discoveryLanguageFilter,
      discoveryComposerFilter: state.discoveryComposerFilter,
      discoveryWorkFilter: state.discoveryWorkFilter,
      discoveryTypeFilter: state.discoveryTypeFilter,
      discoveryCombinationFilter: state.discoveryCombinationFilter,
      discoveryRoleFilter: state.discoveryRoleFilter,
      discoveryDurationMinFilter: state.discoveryDurationMinFilter,
      discoveryDurationMaxFilter: state.discoveryDurationMaxFilter,
      discoveryReadinessFilter: state.discoveryReadinessFilter,
      discoveryStateFilter: state.discoveryStateFilter
    };
    if (s === 'outreach') return {
      outreachDoc: clone(state.outreachDoc),
      outreachSelectedId: state.outreachSelectedId,
      outreachSearch: state.outreachSearch,
      outreachViewMode: state.outreachViewMode,
      outreachStatusFilter: state.outreachStatusFilter,
      outreachFollowupFilter: state.outreachFollowupFilter,
      outreachQuickFilter: state.outreachQuickFilter
    };
    if (s === 'calendar') return { h2: $('perf-h2').value, intro: $('perf-intro').value, perfs: clone(state.perfs), perfIndex: state.perfIndex };
    if (s === 'media') return { vidData: clone(state.vidData), vidIndex: state.vidIndex, audioData: clone(state.audioData), audIndex: state.audIndex, photosData: clone(state.photosData), photoCaptions: clone(state.photoCaptions), photoType: state.photoType, photoIndex: state.photoIndex };
    if (s === 'press') return { press: clone(state.press), pressIndex: state.pressIndex, publicPdfs: clone(state.publicPdfs), epkBios: clone(state.epkBios), epkPhotos: clone(state.epkPhotos), epkPhotoIndex: state.epkPhotoIndex };
    if (s === 'contact') return { title: $('contact-title').value, sub: $('contact-sub').value, email: $('contact-email').value, phone: $('contact-phone') ? $('contact-phone').value : '', emailBtn: $('contact-emailBtn').value, webBtn: $('contact-webBtn').value, webUrl: $('contact-webUrl') ? $('contact-webUrl').value : '' };
    if (s === 'ui') return { uiPartial: collectUiSectionInputsToDoc(), json: $('ui-json').value };
    return null;
  }
  function applySectionDraftObject(s, d) {
    if (!d) return;
    if (s === 'home') {
      $('hero-eyebrow').value = safeString(d.eyebrow); $('hero-subtitle').value = safeString(d.subtitle); $('hero-cta1').value = safeString(d.cta1); $('hero-cta2').value = safeString(d.cta2);
      $('hero-quickBioLabel').value = safeString(d.quickBioLabel); $('hero-quickCalLabel').value = safeString(d.quickCalLabel); $('hero-introCtaBio').value = safeString(d.introCtaBio);
      $('hero-introCtaMedia').value = safeString(d.introCtaMedia); $('hero-bgImage').value = safeString(d.bgImage); $('hero-introImage').value = safeString(d.introImage);
      updateHomeIntroPreview(); updateHomeMiniPreviews();
    } else if (s === 'bio') {
      $('bio-introLine').value = safeString(d.introLine);
      $('bio-h2').value = safeString(d.h2);
      $('bio-p1').value = safeString(d.p1);
      $('bio-p2').value = safeString(d.p2);
      $('bio-p3').value = safeString(d.p3);
      $('bio-p4').value = safeString(d.p4);
      $('bio-p5').value = safeString(d.p5);
      $('bio-p6').value = safeString(d.p6);
      $('bio-continue-tag').value = safeString(d.continueSectionTag);
      $('bio-continue-sub').value = safeString(d.continueSub);
      $('bio-cta-rep').value = safeString(d.ctaRepertoire);
      $('bio-cta-media').value = safeString(d.ctaMedia);
      $('bio-cta-contact').value = safeString(d.ctaContact);
      $('bio-cta-home').value = safeString(d.ctaHomeIntro);
      $('bio-portraitAlt').value = safeString(d.portraitAlt);
      $('bio-quote').value = safeString(d.quote);
      $('bio-cite').value = safeString(d.cite);
      $('bio-portraitImage').value = safeString(d.portraitImage);
      if ($('bio-portraitFit')) $('bio-portraitFit').value = safeString(d.portraitFit);
      if ($('bio-portraitFocus')) $('bio-portraitFocus').value = safeString(d.portraitFocus);
      updateBioPortraitPreview(); updateBioMiniPreview();
    } else if (s === 'rep') {
      state.repCards = Array.isArray(d.repCards) ? clone(d.repCards) : [];
      state.repIndex = Number.isFinite(Number(d.repIndex)) ? Number(d.repIndex) : -1;
      $('rep-h2').value = safeString(d.h2); $('rep-intro').value = safeString(d.intro);
      renderRepList(); renderRepEditor();
    } else if (s === 'programs') {
      state.programsDoc = safeProgramsDoc(d.programsDoc || {});
      state.programsIndex = Number.isFinite(Number(d.programsIndex)) ? Number(d.programsIndex) : -1;
      renderProgramsList(); renderProgramsEditor();
    } else if (s === 'programbuilder') {
      state.plannerDoc = safePlannerDoc(d.plannerDoc || {});
      state.plannerIndex = Number.isFinite(Number(d.plannerIndex)) ? Number(d.plannerIndex) : -1;
      state.plannerSearch = safeString(d.plannerSearch);
      state.plannerTypeFilter = safeString(d.plannerTypeFilter || 'all') || 'all';
      state.plannerLangFilter = safeString(d.plannerLangFilter);
      state.plannerReadinessFilter = safeString(d.plannerReadinessFilter || 'all') || 'all';
      state.plannerTagFilter = safeString(d.plannerTagFilter);
      state.plannerSort = safeString(d.plannerSort || 'sortOrder') || 'sortOrder';
      state.plannerOfferStatusFilter = safeString(d.plannerOfferStatusFilter || 'all') || 'all';
      state.plannerOfferTypeFilter = safeString(d.plannerOfferTypeFilter || 'all') || 'all';
      state.plannerOfferCategoryFilter = safeString(d.plannerOfferCategoryFilter || 'all') || 'all';
      state.plannerOfferTagFilter = safeString(d.plannerOfferTagFilter);
      state.plannerOfferLangFilter = safeString(d.plannerOfferLangFilter);
      state.plannerOfferMatchingOnly = d.plannerOfferMatchingOnly !== false;
      state.plannerOfferFormationOnly = d.plannerOfferFormationOnly === true;
      state.plannerOfferShowWithoutTenor = d.plannerOfferShowWithoutTenor === true;
      state.blueprintDoc = safeBlueprintsDoc(d.blueprintDoc || {});
      state.blueprintFamily = safeString(d.blueprintFamily || 'gala') || 'gala';
      state.blueprintDuration = safeString(d.blueprintDuration || '30') || '30';
      state.blueprintPieceIndex = Number.isFinite(Number(d.blueprintPieceIndex)) ? Number(d.blueprintPieceIndex) : -1;
      state.blueprintOutputLang = safeString(d.blueprintOutputLang || state.lang || 'en') || 'en';
      state.savedOfferId = safeString(d.savedOfferId);
      state.savedOfferSearch = safeString(d.savedOfferSearch);
      state.savedOfferTypeFilter = safeString(d.savedOfferTypeFilter || 'all') || 'all';
      state.savedOfferFamilyFilter = safeString(d.savedOfferFamilyFilter || 'all') || 'all';
      state.savedOfferDurationFilter = safeString(d.savedOfferDurationFilter || 'all') || 'all';
      state.savedOfferLangFilter = safeString(d.savedOfferLangFilter || 'all') || 'all';
      state.savedOfferFormationFilter = safeString(d.savedOfferFormationFilter);
      state.savedOfferStatusFilter = safeString(d.savedOfferStatusFilter || 'all') || 'all';
      state.concertHistoryDoc = safeConcertHistoryDoc(d.concertHistoryDoc || {});
      state.concertHistoryIndex = Number.isFinite(Number(d.concertHistoryIndex)) ? Number(d.concertHistoryIndex) : -1;
      state.concertHistorySearch = safeString(d.concertHistorySearch);
      renderPlannerRepList();
      renderBlueprintBuilder();
      renderConcertHistoryList();
    } else if (s === 'discovery') {
      state.discoveryDoc = safeDiscoveryDoc(d.discoveryDoc || {});
      state.discoverySelectedId = safeString(d.discoverySelectedId);
      state.discoverySearch = safeString(d.discoverySearch);
      state.discoveryProfileFilter = safeString(d.discoveryProfileFilter || 'all') || 'all';
      state.discoveryFamilyFilter = safeString(d.discoveryFamilyFilter || 'all') || 'all';
      state.discoveryLanguageFilter = safeString(d.discoveryLanguageFilter);
      state.discoveryComposerFilter = safeString(d.discoveryComposerFilter);
      state.discoveryWorkFilter = safeString(d.discoveryWorkFilter);
      state.discoveryTypeFilter = safeString(d.discoveryTypeFilter || 'all') || 'all';
      state.discoveryCombinationFilter = safeString(d.discoveryCombinationFilter || 'all') || 'all';
      state.discoveryRoleFilter = safeString(d.discoveryRoleFilter || 'all') || 'all';
      state.discoveryDurationMinFilter = safeString(d.discoveryDurationMinFilter);
      state.discoveryDurationMaxFilter = safeString(d.discoveryDurationMaxFilter);
      state.discoveryReadinessFilter = safeString(d.discoveryReadinessFilter || 'all') || 'all';
      state.discoveryStateFilter = safeString(d.discoveryStateFilter || 'all') || 'all';
      resetDiscoveryResultLimit();
      if ($('discovery-search')) $('discovery-search').value = state.discoverySearch;
      if ($('discovery-filter-profile')) $('discovery-filter-profile').value = state.discoveryProfileFilter;
      if ($('discovery-filter-family')) $('discovery-filter-family').value = state.discoveryFamilyFilter;
      if ($('discovery-filter-language')) $('discovery-filter-language').value = state.discoveryLanguageFilter;
      if ($('discovery-filter-composer')) $('discovery-filter-composer').value = state.discoveryComposerFilter;
      if ($('discovery-filter-work')) $('discovery-filter-work').value = state.discoveryWorkFilter;
      if ($('discovery-filter-type')) $('discovery-filter-type').value = state.discoveryTypeFilter;
      if ($('discovery-filter-combination')) $('discovery-filter-combination').value = state.discoveryCombinationFilter;
      if ($('discovery-filter-role')) $('discovery-filter-role').value = state.discoveryRoleFilter;
      if ($('discovery-filter-duration-min')) $('discovery-filter-duration-min').value = state.discoveryDurationMinFilter;
      if ($('discovery-filter-duration-max')) $('discovery-filter-duration-max').value = state.discoveryDurationMaxFilter;
      if ($('discovery-filter-readiness')) $('discovery-filter-readiness').value = state.discoveryReadinessFilter;
      if ($('discovery-filter-state')) $('discovery-filter-state').value = state.discoveryStateFilter;
      renderDiscoveryWorkspace();
    } else if (s === 'outreach') {
      state.outreachDoc = safeOutreachDoc(d.outreachDoc || {});
      state.outreachSelectedId = safeString(d.outreachSelectedId);
      state.outreachSearch = safeString(d.outreachSearch);
      state.outreachViewMode = safeString(d.outreachViewMode || 'cards') === 'report' ? 'report' : 'cards';
      state.outreachStatusFilter = safeString(d.outreachStatusFilter || 'all') || 'all';
      state.outreachFollowupFilter = safeString(d.outreachFollowupFilter || 'all') || 'all';
      state.outreachQuickFilter = safeString(d.outreachQuickFilter || 'all') || 'all';
      if ($('outreach-search')) $('outreach-search').value = state.outreachSearch;
      if ($('outreach-view-mode')) $('outreach-view-mode').value = state.outreachViewMode;
      if ($('outreach-filter-status')) $('outreach-filter-status').value = state.outreachStatusFilter;
      if ($('outreach-filter-followup')) $('outreach-filter-followup').value = state.outreachFollowupFilter;
      renderOutreachWorkspace();
    } else if (s === 'calendar') {
      state.perfs = Array.isArray(d.perfs) ? clone(d.perfs) : [];
      state.perfIndex = Number.isFinite(Number(d.perfIndex)) ? Number(d.perfIndex) : -1;
      $('perf-h2').value = safeString(d.h2); $('perf-intro').value = safeString(d.intro);
      renderPerfList(); renderPerfEditor();
    } else if (s === 'media') {
      state.vidData = safeMediaVideos(d.vidData || {});
      state.vidIndex = Number.isFinite(Number(d.vidIndex)) ? Number(d.vidIndex) : -1;
      state.audioData = safeMediaAudio(d.audioData || {});
      var effectiveAudio = resolveEffectiveAudioHeadingFields(state.audioData);
      state.audIndex = Number.isFinite(Number(d.audIndex)) ? Number(d.audIndex) : -1;
      state.photosData = safePhotos(d.photosData || {});
      state.photoCaptions = isObject(d.photoCaptions) ? clone(d.photoCaptions) : {};
      state.photoType = safeString(d.photoType || 's');
      state.photoIndex = Number.isFinite(Number(d.photoIndex)) ? Number(d.photoIndex) : -1;
      $('media-vid-h2').value = safeString(state.vidData.h2);
      if ($('media-aud-h2')) $('media-aud-h2').value = effectiveAudio.h2;
      if ($('media-aud-sub')) $('media-aud-sub').value = effectiveAudio.sub;
      renderMediaVideosList(); renderMediaVideoEditor(); renderMediaAudioList(); renderMediaAudioEditor(); renderMediaPhotosList(); renderMediaPhotoEditor();
    } else if (s === 'press') {
      state.press = Array.isArray(d.press) ? clone(d.press) : [];
      state.pressIndex = Number.isFinite(Number(d.pressIndex)) ? Number(d.pressIndex) : -1;
      state.publicPdfs = safePublicPdfs(d.publicPdfs || {});
      state.epkBios = safeEpkBios(d.epkBios || {});
      state.epkPhotos = safeEpkPhotos(d.epkPhotos || []);
      state.epkPhotoIndex = Number.isFinite(Number(d.epkPhotoIndex)) ? Number(d.epkPhotoIndex) : -1;
      loadPressPdfsIntoUi(); loadEpkBiosIntoUi(); renderPressList(); renderPressEditor(); renderEpkPhotoList(); renderEpkPhotoEditor();
    } else if (s === 'contact') {
      $('contact-title').value = safeString(d.title); $('contact-sub').value = safeString(d.sub); $('contact-email').value = safeString(d.email); if ($('contact-phone')) $('contact-phone').value = safeString(d.phone); $('contact-emailBtn').value = safeString(d.emailBtn); $('contact-webBtn').value = safeString(d.webBtn); if ($('contact-webUrl')) $('contact-webUrl').value = safeString(d.webUrl);
      updateContactValidation(); updateContactMiniPreview();
    } else if (s === 'ui') {
      $('ui-json').value = safeString(d.json);
      ensureUiPublicCopyEditorBuilt();
      var base = loadDoc('rg_ui_' + state.lang, {});
      if (!isObject(base)) base = {};
      var partial = isObject(d.uiPartial) ? d.uiPartial : {};
      if (!Object.keys(partial).length && isObject(d.nav)) {
        partial = {
          'nav.home': d.nav.home,
          'nav.bio': d.nav.bio,
          'nav.rep': d.nav.rep,
          'nav.media': d.nav.media,
          'nav.cal': d.nav.cal,
          'nav.epk': d.nav.epk,
          'nav.book': d.nav.book
        };
      }
      var merged = Object.assign({}, base, partial);
      loadUiNavFieldsFromDoc(merged);
    }
    updateCompletenessIndicators();
  }
  function saveLocalDraftForCurrentSection() {
    if (!state.ready || !state.section) return;
    var draft = serializeCurrentSectionDraft();
    if (!draft) return;
    var key = currentDraftKey();
    try {
      var prevRaw = localStorage.getItem(key);
      var prev = null;
      try { prev = prevRaw ? JSON.parse(prevRaw) : null; } catch (e1) { prev = null; }
      var draftId = prev && safeString(prev.draftId).trim() ? safeString(prev.draftId).trim() : makeLocalDraftId();
      var createdAt = prev && Number(prev.createdAt) ? Number(prev.createdAt) : Date.now();
      var nextRaw = JSON.stringify({
        draftId: draftId,
        createdAt: createdAt,
        ts: Date.now(),
        section: state.section,
        lang: state.lang,
        data: draft
      });
      if (prevRaw && prevRaw !== nextRaw) state.sectionUndo[key] = prevRaw;
      localStorage.setItem(key, nextRaw);
    } catch (e) {}
  }
  function clearLocalDraftForCurrentSection() {
    try { localStorage.removeItem(currentDraftKey()); } catch (e) {}
  }
  function maybeRestoreDraftForCurrentSection(force) {
    refreshDraftRestoreBanner(!!force);
  }
  function discardCurrentSectionChanges() {
    if (!window.confirm('Discard all local unsaved changes in this section and reload saved content?')) return;
    clearLocalDraftForCurrentSection();
    hideDraftRestoreBanner();
    refreshCurrentSection();
    markDirty(false, 'Section changes discarded');
    pushActivitySummary('Section discarded', [state.section + ' reloaded from saved content']);
  }
  function undoLastSectionEdit() {
    var key = currentDraftKey();
    var prevRaw = state.sectionUndo[key];
    if (!prevRaw) {
      alert('No local undo step available for this section.');
      return;
    }
    try {
      localStorage.setItem(key, prevRaw);
      var parsed = JSON.parse(prevRaw);
      applySectionDraftObject(state.section, parsed && parsed.data);
      markDirty(true, 'Undo applied');
      pushActivitySummary('Undo', [state.section + ' local draft step reverted']);
    } catch (e) {}
  }

  function bindInputsDirty(ids, handler) {
    ids.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('input', function () {
        if (handler) handler();
        else markDirty(true);
      });
    });
  }

  function buildExportPayload() {
    var keys = [
      'rg_rep_cards','rg_vid','rg_audio','rg_perfs','rg_past_perfs','rg_press','rg_press_meta','rg_epk_bios','rg_epk_photos','rg_epk_cvs','rg_public_pdfs','rg_photos','rg_photo_captions','rg_repertoire_planner','rg_program_blueprints','rg_concert_history','rg_repertoire_discovery','rg_outreach_tracker',
      'rg_programs','rg_programs_en','rg_programs_de','rg_programs_es','rg_programs_it','rg_programs_fr',
      'rg_editorial_en','rg_editorial_de','rg_editorial_es','rg_editorial_it','rg_editorial_fr',
      'hero_en','hero_de','hero_es','hero_it','hero_fr',
      'bio_en','bio_de','bio_es','bio_it','bio_fr',
      'rep_en','rep_de','rep_es','rep_it','rep_fr',
      'perf_en','perf_de','perf_es','perf_it','perf_fr',
      'contact_en','contact_de','contact_es','contact_it','contact_fr',
      'rg_ui_en','rg_ui_de','rg_ui_es','rg_ui_it','rg_ui_fr'
    ];
    var data = {};
    keys.forEach(function (k) {
      var v = state.api.load(k);
      if (v != null) data[k] = v;
    });
    return { exportedAt: new Date().toISOString(), origin: 'admin-v2', keys: Object.keys(data), data: data };
  }

  function downloadJson(filename, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  function setupEvents() {
    if (document.body) {
      if (document.body.dataset.adm2EventsWired === '1') return;
      document.body.dataset.adm2EventsWired = '1';
    }
    $('import-preview').value = [
      'Import preview',
      '',
      '1. Optionally narrow "Import scope" in the top bar.',
      '2. Choose a JSON file with top bar "Import JSON".',
      '3. This panel fills with what will change; you confirm before anything is saved.',
      '',
      'Tip: run System / Tools → Create backup now first.'
    ].join('\n');

    $('menuBtn').addEventListener('click', function () { $('sidebar').classList.toggle('open'); });
    state.mobileNavPrimarySections = readMobileNavPrimarySections();
    syncMobileNavMoreSections(true);
    if ($('nav-mobile-config-items')) {
      $('nav-mobile-config-items').addEventListener('change', function (ev) {
        var input = ev && ev.target;
        if (!input || input.type !== 'checkbox') return;
        var sectionId = safeString(input.getAttribute('data-mobile-nav-section')).trim();
        if (!sectionId) return;
        var selected = {};
        (state.mobileNavPrimarySections || []).forEach(function (id) { selected[id] = true; });
        if (input.checked) selected[sectionId] = true;
        else delete selected[sectionId];
        var next = MOBILE_NAV_SECTION_ORDER.filter(function (id) { return !!selected[id]; });
        if (!next.length) {
          input.checked = true;
          return;
        }
        state.mobileNavPrimarySections = next;
        writeMobileNavPrimarySections(next);
        syncMobileNavMoreSections(false);
      });
    }
    syncTopbarToolsDisclosure();
    window.addEventListener('resize', syncTopbarToolsDisclosure);
    window.addEventListener('resize', function () { syncMobileNavMoreSections(false); });
    window.addEventListener('resize', function () {
      if (state.section === 'programbuilder') syncProgramBuilderResponsiveUi(false);
    });
    bindProgramBuilderUiChrome();
    if ($('paperPreviewToggle')) $('paperPreviewToggle').addEventListener('change', function () {
      applyPaperPreviewMode(!!$('paperPreviewToggle').checked, true);
    });
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () { openSection(btn.getAttribute('data-section')); });
    });
      $('langSelect').addEventListener('change', function () {
      if (!hasUnsavedChangesPrompt('Switch language?')) {
        $('langSelect').value = state.lang;
        return;
      }
      state.lang = $('langSelect').value;
      if (typeof state.api.setLang === 'function') state.api.setLang(state.lang, { persist: false });
      updateLangBadge();
      refreshCurrentSection();
      primeUiPublicCopyFromStorage();
      markDirty(false, 'Language: ' + state.lang.toUpperCase());
    });

    $('saveHeroBtn').addEventListener('click', saveHome);
    if ($('copyHomeFromEnBtn')) $('copyHomeFromEnBtn').addEventListener('click', copyHomeFromEn);
    if ($('copyHomeMissingFromEnBtn')) $('copyHomeMissingFromEnBtn').addEventListener('click', copyHomeMissingFromEn);
    if ($('compareHomeWithEnBtn')) $('compareHomeWithEnBtn').addEventListener('click', compareHomeWithEn);
    if ($('markHomeNeedsTranslationBtn')) $('markHomeNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('home', 'needs_translation'); });
    if ($('markHomeReviewedBtn')) $('markHomeReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('home', 'reviewed'); });
    $('saveBioBtn').addEventListener('click', saveBio);
    if ($('copyBioFromEnBtn')) $('copyBioFromEnBtn').addEventListener('click', copyBioFromEn);
    if ($('copyBioMissingFromEnBtn')) $('copyBioMissingFromEnBtn').addEventListener('click', copyBioMissingFromEn);
    if ($('compareBioWithEnBtn')) $('compareBioWithEnBtn').addEventListener('click', compareBioWithEn);
    if ($('markBioNeedsTranslationBtn')) $('markBioNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('bio', 'needs_translation'); });
    if ($('markBioReviewedBtn')) $('markBioReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('bio', 'reviewed'); });
    $('saveRepHeaderBtn').addEventListener('click', saveRepHeader);
    $('saveRepCardsBtn').addEventListener('click', saveRepCards);
    $('programs-save').addEventListener('click', savePrograms);
    if ($('pb-save-repertoire')) $('pb-save-repertoire').addEventListener('click', function () {
      state.plannerDoc = safePlannerDoc(state.plannerDoc);
      state.concertHistoryDoc = safeConcertHistoryDoc(state.concertHistoryDoc);
      saveDoc('rg_repertoire_planner', state.plannerDoc);
      saveDoc('rg_concert_history', state.concertHistoryDoc);
      renderBlueprintBuilder();
      renderConcertHistoryList();
      renderProgramBuilderStatus();
    });
    if ($('pb-save-blueprints')) $('pb-save-blueprints').addEventListener('click', function () {
      runProgramOfferSaveAction(saveCurrentProgramOffer);
    });
    if ($('pb-open-saved-browser')) $('pb-open-saved-browser').addEventListener('click', openSavedOfferBrowser);
    if ($('pb-save-master-primary')) $('pb-save-master-primary').addEventListener('click', function () { runProgramOfferSaveAction(function () { saveProgramOfferSnapshot('master_programme'); }); });
    if ($('pb-save-venue-primary')) $('pb-save-venue-primary').addEventListener('click', function () { runProgramOfferSaveAction(function () { saveProgramOfferSnapshot('venue_offer'); }); });
    if ($('pb-duplicate-current')) $('pb-duplicate-current').addEventListener('click', duplicateActiveProgramOffer);
    if ($('pb-archive-current')) $('pb-archive-current').addEventListener('click', archiveActiveProgramOffer);
    if ($('pb-save-master')) $('pb-save-master').addEventListener('click', function () { runProgramOfferSaveAction(function () { saveProgramOfferSnapshot('master_programme'); }); });
    if ($('pb-save-venue')) $('pb-save-venue').addEventListener('click', function () { runProgramOfferSaveAction(function () { saveProgramOfferSnapshot('venue_offer'); }); });
    if ($('pb-load-saved')) $('pb-load-saved').addEventListener('click', loadSavedOfferIntoEditor);
    if ($('pb-create-venue-from-master')) $('pb-create-venue-from-master').addEventListener('click', createVenueOfferFromMaster);
    if ($('pb-duplicate-saved')) $('pb-duplicate-saved').addEventListener('click', duplicateSavedOffer);
    if ($('pb-archive-saved')) $('pb-archive-saved').addEventListener('click', archiveSavedOffer);
    if ($('pb-saved-search')) $('pb-saved-search').addEventListener('input', function () { state.savedOfferSearch = $('pb-saved-search').value; renderSavedOfferBrowser(); });
    if ($('pb-saved-filter-type')) $('pb-saved-filter-type').addEventListener('change', function () { state.savedOfferTypeFilter = $('pb-saved-filter-type').value; renderSavedOfferBrowser(); });
    if ($('pb-saved-filter-family')) $('pb-saved-filter-family').addEventListener('change', function () { state.savedOfferFamilyFilter = $('pb-saved-filter-family').value; renderSavedOfferBrowser(); });
    if ($('pb-saved-filter-duration')) $('pb-saved-filter-duration').addEventListener('change', function () { state.savedOfferDurationFilter = $('pb-saved-filter-duration').value; renderSavedOfferBrowser(); });
    if ($('pb-saved-filter-lang')) $('pb-saved-filter-lang').addEventListener('change', function () { state.savedOfferLangFilter = $('pb-saved-filter-lang').value; renderSavedOfferBrowser(); });
    if ($('pb-saved-filter-formation')) $('pb-saved-filter-formation').addEventListener('input', function () { state.savedOfferFormationFilter = $('pb-saved-filter-formation').value; renderSavedOfferBrowser(); });
    if ($('pb-saved-filter-status')) $('pb-saved-filter-status').addEventListener('change', function () { state.savedOfferStatusFilter = $('pb-saved-filter-status').value; renderSavedOfferBrowser(); });
    if ($('pb-rep-search')) $('pb-rep-search').addEventListener('input', function () { state.plannerSearch = $('pb-rep-search').value; renderPlannerRepList(); });
    if ($('pb-rep-filter-type')) $('pb-rep-filter-type').addEventListener('change', function () { state.plannerTypeFilter = $('pb-rep-filter-type').value; renderPlannerRepList(); });
    if ($('pb-rep-filter-lang')) $('pb-rep-filter-lang').addEventListener('input', function () { state.plannerLangFilter = $('pb-rep-filter-lang').value; renderPlannerRepList(); });
    if ($('pb-rep-filter-readiness')) $('pb-rep-filter-readiness').addEventListener('change', function () { state.plannerReadinessFilter = $('pb-rep-filter-readiness').value; renderPlannerRepList(); });
    if ($('pb-rep-filter-tag')) $('pb-rep-filter-tag').addEventListener('input', function () { state.plannerTagFilter = $('pb-rep-filter-tag').value; renderPlannerRepList(); });
    if ($('pb-rep-sort')) $('pb-rep-sort').addEventListener('change', function () { state.plannerSort = $('pb-rep-sort').value; renderPlannerRepList(); });
    if ($('pb-rep-add')) $('pb-rep-add').addEventListener('click', function () {
      state.plannerDoc.items.push(normalizePlannerItemRecord({ id: 'piece_' + (state.plannerDoc.items.length + 1), title: '', composer: '', work: '', type: 'other', language: '', approximateDurationMin: 0, durationMin: 0, formations: [], readiness: 'idea', availabilityStatus: 'idea', tags: [], fitTags: [], dramaticRole: '', energyLevel: '', moodTags: [], tempoProfile: '', impactLevel: '', audienceAppeal: '', vocalLoad: '', galaRole: '', texture: '', styleBucket: '', recoveryValue: '', bestDurationFit: 'all', encoreCandidate: false, practicalTags: [], interlude: false, vocalRestSupport: false, goodBetweenBlocks: false, goodBeforeClimax: false, notes: '', publicNotes: '', sortOrder: (state.plannerDoc.items.length + 1) * 10, performanceStatus: '', performedIn: [], reviewStatus: 'clean', offerOnly: false, excludeFromOffers: false, sourceGroup: '', suggestionGroup: '' }, state.plannerDoc.items.length));
      state.plannerIndex = state.plannerDoc.items.length - 1;
      renderPlannerRepList();
      renderBlueprintBuilder();
      markDirty(true, 'Repertoire item added');
    });
    if ($('pb-rep-del')) $('pb-rep-del').addEventListener('click', function () {
      if (state.plannerIndex < 0) return;
      var deleted = state.plannerDoc.items.splice(state.plannerIndex, 1)[0];
      var linkedOffers = 0;
      Object.keys(state.blueprintDoc.blueprints || {}).forEach(function (key) {
        linkedOffers += (state.blueprintDoc.blueprints[key].items || []).filter(function (it) { return safeString(it.pieceId) === safeString(deleted && deleted.id); }).length;
      });
      if (!window.confirm('Delete this repertoire item from the library?\n\n' + safeString(deleted && deleted.title || 'Untitled item') + (linkedOffers ? ('\nThis will also remove it from ' + linkedOffers + ' saved offer slot(s).') : ''))) {
        state.plannerDoc.items.splice(state.plannerIndex, 0, deleted);
        return;
      }
      Object.keys(state.blueprintDoc.blueprints || {}).forEach(function (key) {
        state.blueprintDoc.blueprints[key].items = (state.blueprintDoc.blueprints[key].items || []).filter(function (it) { return safeString(it.pieceId) !== safeString(deleted && deleted.id); });
      });
      state.plannerIndex = Math.max(0, state.plannerIndex - 1);
      renderPlannerRepList();
      renderBlueprintBuilder();
      markDirty(true, 'Repertoire item deleted');
    });
    if ($('pb-rep-up')) $('pb-rep-up').addEventListener('click', function () {
      var i = state.plannerIndex; if (i <= 0) return;
      var t = state.plannerDoc.items[i - 1]; state.plannerDoc.items[i - 1] = state.plannerDoc.items[i]; state.plannerDoc.items[i] = t;
      state.plannerIndex = i - 1;
      renderPlannerRepList();
      markDirty(true, 'Repertoire order updated');
    });
    if ($('pb-rep-down')) $('pb-rep-down').addEventListener('click', function () {
      var i = state.plannerIndex; if (i < 0 || i >= state.plannerDoc.items.length - 1) return;
      var t = state.plannerDoc.items[i + 1]; state.plannerDoc.items[i + 1] = state.plannerDoc.items[i]; state.plannerDoc.items[i] = t;
      state.plannerIndex = i + 1;
      renderPlannerRepList();
      markDirty(true, 'Repertoire order updated');
    });
    if ($('pb-family')) $('pb-family').addEventListener('change', function () {
      var nextFamily = $('pb-family').value;
      var nextDuration = $('pb-duration') ? $('pb-duration').value : state.blueprintDuration;
      if (!canSwitchProgrammeOfferWorkingSlot(nextFamily, nextDuration)) {
        revertProgrammeOfferContextControls();
        return;
      }
      state.blueprintFamily = nextFamily;
      persistBlueprintHeader('context');
    });
    if ($('pb-duration')) $('pb-duration').addEventListener('change', function () {
      var nextFamily = $('pb-family') ? $('pb-family').value : state.blueprintFamily;
      var nextDuration = $('pb-duration').value;
      if (!canSwitchProgrammeOfferWorkingSlot(nextFamily, nextDuration)) {
        revertProgrammeOfferContextControls();
        return;
      }
      state.blueprintDuration = nextDuration;
      persistBlueprintHeader('context');
    });
    if ($('pb-output-lang')) $('pb-output-lang').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-build-mode')) $('pb-build-mode').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-repertoire-mode')) $('pb-repertoire-mode').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-gala-preferPacing')) $('pb-gala-preferPacing').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-gala-allowPianoInterludes')) $('pb-gala-allowPianoInterludes').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-gala-includeContrast')) $('pb-gala-includeContrast').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-gala-buildArc')) $('pb-gala-buildArc').addEventListener('change', function () { persistBlueprintHeader('context'); });
    if ($('pb-blueprint-title-reset')) $('pb-blueprint-title-reset').addEventListener('click', function () { resetProgramOfferFieldToDefault('title'); });
    if ($('pb-offer-description-reset')) $('pb-offer-description-reset').addEventListener('click', function () { resetProgramOfferFieldToDefault('description'); });
    if ($('pb-flexible-note-reset')) $('pb-flexible-note-reset').addEventListener('click', function () { resetProgramOfferFieldToDefault('flexibleNote'); });
    if ($('pb-fee-apply-preset')) $('pb-fee-apply-preset').addEventListener('click', function () {
      applyBlueprintFeePreset($('pb-fee-preset') && $('pb-fee-preset').value);
    });
    if ($('pb-add-piece-search')) $('pb-add-piece-search').addEventListener('input', renderBlueprintBuilder);
    if ($('pb-offer-filter-status')) $('pb-offer-filter-status').addEventListener('change', function () { state.plannerOfferStatusFilter = $('pb-offer-filter-status').value; renderBlueprintBuilder(); });
    if ($('pb-offer-filter-category')) $('pb-offer-filter-category').addEventListener('change', function () { state.plannerOfferCategoryFilter = $('pb-offer-filter-category').value; renderBlueprintBuilder(); });
    if ($('pb-offer-filter-tag')) $('pb-offer-filter-tag').addEventListener('input', function () { state.plannerOfferTagFilter = $('pb-offer-filter-tag').value; renderBlueprintBuilder(); });
    if ($('pb-offer-filter-lang')) $('pb-offer-filter-lang').addEventListener('input', function () { state.plannerOfferLangFilter = $('pb-offer-filter-lang').value; renderBlueprintBuilder(); });
    if ($('pb-offer-filter-matchingOnly')) $('pb-offer-filter-matchingOnly').addEventListener('change', function () {
      state.plannerOfferMatchingOnly = !!$('pb-offer-filter-matchingOnly').checked;
      if ($('pb-offer-filter-showAll')) $('pb-offer-filter-showAll').checked = !state.plannerOfferMatchingOnly;
      renderBlueprintBuilder();
    });
    if ($('pb-offer-filter-showAll')) $('pb-offer-filter-showAll').addEventListener('change', function () {
      state.plannerOfferMatchingOnly = !$('pb-offer-filter-showAll').checked;
      if ($('pb-offer-filter-matchingOnly')) $('pb-offer-filter-matchingOnly').checked = state.plannerOfferMatchingOnly;
      renderBlueprintBuilder();
    });
    if ($('pb-offer-filter-formation')) $('pb-offer-filter-formation').addEventListener('change', function () { state.plannerOfferFormationOnly = !!$('pb-offer-filter-formation').checked; renderBlueprintBuilder(); });
    if ($('pb-offer-filter-showWithoutTenor')) $('pb-offer-filter-showWithoutTenor').addEventListener('change', function () { state.plannerOfferShowWithoutTenor = !!$('pb-offer-filter-showWithoutTenor').checked; renderBlueprintBuilder(); });
    if ($('pb-generate-draft')) $('pb-generate-draft').addEventListener('click', generateSuggestedProgrammeDraft);
    if ($('pb-add-piece')) $('pb-add-piece').addEventListener('click', function () {
      plannerAddPieceToCurrentOffer($('pb-add-piece-select').value);
    });
    if ($('pb-open-quick-add')) $('pb-open-quick-add').addEventListener('click', function () { openQuickAddManual('main'); });
    if ($('pb-quick-add-submit')) $('pb-quick-add-submit').addEventListener('click', quickAddManualPiece);
    if ($('pb-quick-add-close')) $('pb-quick-add-close').addEventListener('click', closeQuickAddManual);
    document.querySelectorAll('[data-pb-quick-close]').forEach(function (el) {
      el.addEventListener('click', closeQuickAddManual);
    });
    if ($('pb-encore-add')) $('pb-encore-add').addEventListener('click', addEncoreOption);
    if ($('pb-encore-open-quick-add')) $('pb-encore-open-quick-add').addEventListener('click', function () { openQuickAddManual('encore', { encoreIndex: -1 }); });
    if ($('pb-encore-export')) $('pb-encore-export').addEventListener('change', function () {
      persistBlueprintHeader('manual');
    });
    if ($('pb-piece-remove')) $('pb-piece-remove').addEventListener('click', function () {
      var bp = currentBlueprint();
      if (state.blueprintPieceIndex < 0 || state.blueprintPieceIndex >= bp.items.length) return;
      var piece = getPlannerItemById(bp.items[state.blueprintPieceIndex] && bp.items[state.blueprintPieceIndex].pieceId);
      if (!window.confirm('Remove this piece from the current offer?\n\n' + safeString((bp.items[state.blueprintPieceIndex] && bp.items[state.blueprintPieceIndex].customTitle) || (piece && piece.title) || 'Selected piece'))) return;
      bp.items.splice(state.blueprintPieceIndex, 1);
      state.blueprintPieceIndex = Math.max(0, state.blueprintPieceIndex - 1);
      renderBlueprintBuilder();
      markDirty(true, 'Programme repertoire removed');
    });
    if ($('pb-piece-replace')) $('pb-piece-replace').addEventListener('click', function () {
      var alternatives = plannerSimilarAlternatives(currentBlueprint(), state.blueprintPieceIndex);
      if (!alternatives.length) {
        setStatus('No close replacement is available for this line with the current programme frame.', 'warn');
        return;
      }
      replaceCurrentBlueprintPiece(alternatives[0].id);
    });
    if ($('pb-piece-up')) $('pb-piece-up').addEventListener('click', function () {
      var bp = currentBlueprint(); var i = state.blueprintPieceIndex; if (i <= 0) return;
      if (safeString(bp.buildMode) === 'dramatic_arc' && safeString((bp.items[i] || {}).slotId).trim()) {
        setStatus('Slot-managed lines follow the dramatic arc order. Change the slot instead.', 'warn');
        return;
      }
      var t = bp.items[i - 1]; bp.items[i - 1] = bp.items[i]; bp.items[i] = t; state.blueprintPieceIndex = i - 1;
      renderBlueprintBuilder(); markDirty(true, 'Programme order updated');
    });
    if ($('pb-piece-down')) $('pb-piece-down').addEventListener('click', function () {
      var bp = currentBlueprint(); var i = state.blueprintPieceIndex; if (i < 0 || i >= bp.items.length - 1) return;
      if (safeString(bp.buildMode) === 'dramatic_arc' && safeString((bp.items[i] || {}).slotId).trim()) {
        setStatus('Slot-managed lines follow the dramatic arc order. Change the slot instead.', 'warn');
        return;
      }
      var t = bp.items[i + 1]; bp.items[i + 1] = bp.items[i]; bp.items[i] = t; state.blueprintPieceIndex = i + 1;
      renderBlueprintBuilder(); markDirty(true, 'Programme order updated');
    });
    if ($('pb-export-pdf')) $('pb-export-pdf').addEventListener('click', exportProgramOfferPdf);
    if ($('pb-export-fee-report-pdf')) $('pb-export-fee-report-pdf').addEventListener('click', exportProgramOfferFeeReportPdf);
    if ($('pb-print-now')) $('pb-print-now').addEventListener('click', function () {
      setProgramOfferExportHint('Programme Sheet ready. Use File > Print or press Cmd+P if Safari does not open the dialog.', 'warn');
      triggerProgramOfferPrintDialog();
    });
    if ($('pb-close-print-view')) $('pb-close-print-view').addEventListener('click', closeProgramOfferPrintView);
    if ($('pb-copy-email-primary')) $('pb-copy-email-primary').addEventListener('click', function () { copyTextValue('pb-output-email', 'Email draft'); });
    if ($('pb-copy-fee-summary')) $('pb-copy-fee-summary').addEventListener('click', function () { copyTextValue('pb-fee-summary-output', 'Budget summary'); });
    if ($('pb-copy-fee-email')) $('pb-copy-fee-email').addEventListener('click', function () { copyTextValue('pb-fee-email-output', 'Quote email'); });
    if ($('pb-copy-internal')) $('pb-copy-internal').addEventListener('click', function () { copyTextValue('pb-output-internal', 'Private draft'); });
    if ($('pb-copy-email')) $('pb-copy-email').addEventListener('click', function () { copyTextValue('pb-output-email', 'Email draft'); });
    if ($('pb-copy-public')) $('pb-copy-public').addEventListener('click', function () { copyTextValue('pb-output-public', 'Short blurb'); });
    if ($('pb-history-search')) $('pb-history-search').addEventListener('input', function () { state.concertHistorySearch = $('pb-history-search').value; renderConcertHistoryList(); });
    if ($('copyProgramsFromEnBtn')) $('copyProgramsFromEnBtn').addEventListener('click', function () { copyProgramsFromEn(false); });
    if ($('copyProgramsMissingFromEnBtn')) $('copyProgramsMissingFromEnBtn').addEventListener('click', function () { copyProgramsFromEn(true); });
    if ($('compareProgramsWithEnBtn')) $('compareProgramsWithEnBtn').addEventListener('click', compareProgramsWithEn);
    if ($('markProgramsNeedsTranslationBtn')) $('markProgramsNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('programs', 'needs_translation'); });
    if ($('markProgramsReviewedBtn')) $('markProgramsReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('programs', 'reviewed'); });
    if ($('programs-workflow-filter')) $('programs-workflow-filter').addEventListener('change', function () {
      state.programsWorkflowFilter = $('programs-workflow-filter').value;
      renderProgramsList();
    });
    if ($('programs-select-listed')) $('programs-select-listed').addEventListener('click', function () {
      clearSelected(state.programsSelected);
      programsListedIndices().forEach(function (i) { state.programsSelected[i] = true; });
      renderProgramsList();
    });
    if ($('programs-clear-selection')) $('programs-clear-selection').addEventListener('click', function () {
      clearSelected(state.programsSelected);
      renderProgramsList();
      setSelectionCount('programs-selection-count', state.programsSelected);
    });
    if ($('programs-apply-editorial-bulk')) $('programs-apply-editorial-bulk').addEventListener('click', applyProgramsBulkEditorial);
    if ($('programs-review-publish-btn')) $('programs-review-publish-btn').addEventListener('click', programReviewAndPublishCurrent);
    if ($('programs-add-template')) $('programs-add-template').addEventListener('click', addProgramFromTemplate);
    if ($('programs-duplicate-to-lang')) $('programs-duplicate-to-lang').addEventListener('click', duplicateCurrentProgramToLanguage);
    if ($('programs-hideSection')) $('programs-hideSection').addEventListener('change', function () {
      saveProgramsVisibilityOnly()
        .then(function () {
          setStatus('Programs visibility saved. Reload Home/Biography/Repertoire to verify.', 'ok');
        })
        .catch(function () {
          setStatus('Could not save Programs visibility toggle.', 'err');
        });
    });
    $('savePerfHeaderBtn').addEventListener('click', savePerfHeader);
    $('savePerfEventsBtn').addEventListener('click', savePerfEvents);
    if ($('income-refresh')) $('income-refresh').addEventListener('click', loadIncome);
    if ($('income-export-pdf')) $('income-export-pdf').addEventListener('click', exportIncomeReportPdf);
    if ($('income-event-scope')) $('income-event-scope').addEventListener('change', function () {
      state.incomeEventScope = safeString($('income-event-scope').value || 'upcoming').trim().toLowerCase() || 'upcoming';
      renderIncomeSection();
    });
    if ($('income-status-filter')) $('income-status-filter').addEventListener('change', function () {
      state.incomeStatusFilter = safeString($('income-status-filter').value || 'all').trim().toLowerCase() || 'all';
      renderIncomeSection();
    });
    if ($('income-completeness-filter')) $('income-completeness-filter').addEventListener('change', function () {
      state.incomeCompletenessFilter = safeString($('income-completeness-filter').value || 'all').trim().toLowerCase() || 'all';
      renderIncomeSection();
    });
    if ($('perf-tx-copy-all-btn')) $('perf-tx-copy-all-btn').addEventListener('click', function () {
      var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
      var targets = LANGS.filter(function (L) { return L !== sourceLang; });
      runPerfCopyCurrentToTargets(targets);
    });
    if ($('perf-tx-copy-selected-btn')) $('perf-tx-copy-selected-btn').addEventListener('click', function () {
      var sourceLang = safeString(state.lang || 'en').trim().toLowerCase() || 'en';
      runPerfCopyCurrentToTargets(getPerfTxSelectedTargets(sourceLang));
    });
    if ($('perf-tx-copy-base-to-current-btn')) $('perf-tx-copy-base-to-current-btn').addEventListener('click', copyPerfBaseToCurrentLang);
    if ($('perf-tx-autotranslate-btn')) $('perf-tx-autotranslate-btn').addEventListener('click', autoTranslatePerfFromCurrentLang);
    if ($('pastperfs-import-btn')) $('pastperfs-import-btn').addEventListener('click', importPastPerfsJson);
    if ($('pastperfs-clear-btn')) $('pastperfs-clear-btn').addEventListener('click', clearPastPerfsDataset);
    if ($('pastperfs-save-all-btn')) $('pastperfs-save-all-btn').addEventListener('click', function () {
      var list = state.pastPerfs.map(function (_, idx) { return collectPastPerfItemFromUi(idx); });
      state.pastPerfs = normalizePastPerfImportArray(list);
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'All past events saved.';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-select-all-btn')) $('pastperfs-select-all-btn').addEventListener('click', function () {
      clearSelected(state.pastPerfsSelected);
      state.pastPerfs.forEach(function (_, idx) { state.pastPerfsSelected[idx] = true; });
      renderPastPerfsEditorList();
    });
    if ($('pastperfs-clear-selection-btn')) $('pastperfs-clear-selection-btn').addEventListener('click', function () {
      clearSelected(state.pastPerfsSelected);
      renderPastPerfsEditorList();
    });
    if ($('pastperfs-clear-times-btn')) $('pastperfs-clear-times-btn').addEventListener('click', function () {
      var ids = selectedPastPerfIndices();
      if (!ids.length) return alert('Select at least one item.');
      ids.forEach(function (i) { if (state.pastPerfs[i]) state.pastPerfs[i].time = ''; });
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Cleared times for ' + ids.length + ' item(s).';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-mark-private-btn')) $('pastperfs-mark-private-btn').addEventListener('click', function () {
      var ids = selectedPastPerfIndices();
      if (!ids.length) return alert('Select at least one item.');
      ids.forEach(function (i) { if (state.pastPerfs[i]) state.pastPerfs[i].private = true; });
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Marked private: ' + ids.length + ' item(s).';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-delete-selected-btn')) $('pastperfs-delete-selected-btn').addEventListener('click', function () {
      var ids = selectedPastPerfIndices();
      if (!ids.length) return alert('Select at least one item.');
      if (!window.confirm('Delete ' + ids.length + ' selected item(s)?')) return;
      state.pastPerfs = state.pastPerfs.filter(function (_, idx) { return ids.indexOf(idx) < 0; });
      clearSelected(state.pastPerfsSelected);
      if (savePastPerfsToStorage()) {
        if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Deleted ' + ids.length + ' selected item(s).';
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-editor-list')) $('pastperfs-editor-list').addEventListener('click', function (evt) {
      var btn = evt.target && evt.target.closest ? evt.target.closest('[data-past-action]') : null;
      if (!btn) return;
      var idx = Number(btn.getAttribute('data-past-idx'));
      if (!Number.isFinite(idx) || idx < 0 || idx >= state.pastPerfs.length) return;
      var action = safeString(btn.getAttribute('data-past-action'));
      if (action === 'save') {
        savePastPerfItemAt(idx);
      } else if (action === 'delete') {
        if (!window.confirm('Delete this item?')) return;
        state.pastPerfs.splice(idx, 1);
        clearSelected(state.pastPerfsSelected);
        if (savePastPerfsToStorage()) {
          if ($('pastperfs-import-status')) $('pastperfs-import-status').textContent = 'Item deleted.';
          renderPastPerfsEditorList();
        }
      } else if (action === 'up') {
        if (idx <= 0) return;
        var t = state.pastPerfs[idx - 1];
        state.pastPerfs[idx - 1] = state.pastPerfs[idx];
        state.pastPerfs[idx] = t;
        clearSelected(state.pastPerfsSelected);
        renderPastPerfsEditorList();
      } else if (action === 'down') {
        if (idx >= state.pastPerfs.length - 1) return;
        var t2 = state.pastPerfs[idx + 1];
        state.pastPerfs[idx + 1] = state.pastPerfs[idx];
        state.pastPerfs[idx] = t2;
        clearSelected(state.pastPerfsSelected);
        renderPastPerfsEditorList();
      }
    });
    if ($('pastperfs-editor-list')) $('pastperfs-editor-list').addEventListener('change', function (evt) {
      var cb = evt.target && evt.target.closest ? evt.target.closest('[data-past-select]') : null;
      if (!cb) return;
      var idx = Number(cb.getAttribute('data-past-select'));
      if (!Number.isFinite(idx)) return;
      toggleSelected(state.pastPerfsSelected, idx, !!cb.checked);
    });
    if ($('discovery-search')) $('discovery-search').addEventListener('input', function () { state.discoverySearch = $('discovery-search').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-profile')) $('discovery-filter-profile').addEventListener('change', function () { state.discoveryProfileFilter = $('discovery-filter-profile').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-family')) $('discovery-filter-family').addEventListener('change', function () { state.discoveryFamilyFilter = $('discovery-filter-family').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-language')) $('discovery-filter-language').addEventListener('input', function () { state.discoveryLanguageFilter = $('discovery-filter-language').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-composer')) $('discovery-filter-composer').addEventListener('input', function () { state.discoveryComposerFilter = $('discovery-filter-composer').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-work')) $('discovery-filter-work').addEventListener('input', function () { state.discoveryWorkFilter = $('discovery-filter-work').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-type')) $('discovery-filter-type').addEventListener('change', function () { state.discoveryTypeFilter = $('discovery-filter-type').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-combination')) $('discovery-filter-combination').addEventListener('change', function () { state.discoveryCombinationFilter = $('discovery-filter-combination').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-role')) $('discovery-filter-role').addEventListener('change', function () { state.discoveryRoleFilter = $('discovery-filter-role').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-duration-min')) $('discovery-filter-duration-min').addEventListener('input', function () { state.discoveryDurationMinFilter = $('discovery-filter-duration-min').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-duration-max')) $('discovery-filter-duration-max').addEventListener('input', function () { state.discoveryDurationMaxFilter = $('discovery-filter-duration-max').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-readiness')) $('discovery-filter-readiness').addEventListener('change', function () { state.discoveryReadinessFilter = $('discovery-filter-readiness').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-filter-state')) $('discovery-filter-state').addEventListener('change', function () { state.discoveryStateFilter = $('discovery-filter-state').value; resetDiscoveryResultLimit(); renderDiscoveryWorkspace(); });
    if ($('discovery-clear-filters')) $('discovery-clear-filters').addEventListener('click', function () {
      state.discoverySearch = '';
      state.discoveryProfileFilter = 'all';
      state.discoveryFamilyFilter = 'all';
      state.discoveryLanguageFilter = '';
      state.discoveryComposerFilter = '';
      state.discoveryWorkFilter = '';
      state.discoveryTypeFilter = 'all';
      state.discoveryCombinationFilter = 'all';
      state.discoveryRoleFilter = 'all';
      state.discoveryDurationMinFilter = '';
      state.discoveryDurationMaxFilter = '';
      state.discoveryReadinessFilter = 'all';
      state.discoveryStateFilter = 'all';
      resetDiscoveryResultLimit();
      loadDiscovery();
    });
    if ($('outreach-search')) $('outreach-search').addEventListener('input', function () { state.outreachSearch = $('outreach-search').value; renderOutreachWorkspace(); });
    if ($('outreach-view-mode')) $('outreach-view-mode').addEventListener('change', function () { state.outreachViewMode = $('outreach-view-mode').value === 'report' ? 'report' : 'cards'; renderOutreachWorkspace(); });
    if ($('outreach-filter-status')) $('outreach-filter-status').addEventListener('change', function () { state.outreachStatusFilter = $('outreach-filter-status').value; renderOutreachWorkspace(); });
    if ($('outreach-filter-followup')) $('outreach-filter-followup').addEventListener('change', function () { state.outreachFollowupFilter = $('outreach-filter-followup').value; renderOutreachWorkspace(); });
    if ($('outreach-quick-filters')) $('outreach-quick-filters').querySelectorAll('[data-outreach-quick-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = safeString(btn.getAttribute('data-outreach-quick-filter') || 'all').trim().toLowerCase() || 'all';
        var current = safeString(state.outreachQuickFilter || 'all').trim().toLowerCase() || 'all';
        state.outreachQuickFilter = current === key ? 'all' : key;
        renderOutreachWorkspace();
      });
    });
    if ($('outreach-export-report')) $('outreach-export-report').addEventListener('click', exportOutreachReportPdf);
    if ($('outreach-clear-filters')) $('outreach-clear-filters').addEventListener('click', function () {
      state.outreachSearch = '';
      state.outreachViewMode = 'cards';
      state.outreachStatusFilter = 'all';
      state.outreachFollowupFilter = 'all';
      state.outreachQuickFilter = 'all';
      loadOutreach();
    });
    if ($('outreach-new-record')) $('outreach-new-record').addEventListener('click', function () { createOutreachRecord(); });
    $('mediaTabVideos').addEventListener('click', function () { toggleMediaTab('videos'); });
    $('mediaTabPhotos').addEventListener('click', function () { toggleMediaTab('photos'); });
    $('mediaTabAudio').addEventListener('click', function () { toggleMediaTab('audio'); });
    if ($('media-export-pdf')) $('media-export-pdf').addEventListener('click', exportMediaAssetsReportPdf);
    $('media-vid-save').addEventListener('click', saveMediaVideos);
    $('media-photo-save').addEventListener('click', saveMediaPhotos);
    $('media-aud-save').addEventListener('click', saveMediaAudio);
    $('pressTabQuotes').addEventListener('click', function () { togglePressTab('quotes'); });
    $('pressTabPdfs').addEventListener('click', function () { togglePressTab('pdfs'); });
    $('pressTabBios').addEventListener('click', function () { togglePressTab('bios'); });
    $('pressTabPhotos').addEventListener('click', function () { togglePressTab('photos'); });
    $('pressTabCvs').addEventListener('click', function () { togglePressTab('cvs'); });
    $('savePressMetaBtn').addEventListener('click', savePressMeta);
    $('savePressQuotesBtn').addEventListener('click', savePressQuotes);
    $('savePressPdfsBtn').addEventListener('click', savePressPdfs);
    $('savePressBiosBtn').addEventListener('click', saveEpkBios);
    $('savePressPhotosBtn').addEventListener('click', saveEpkPhotos);
    $('savePressCvsBtn').addEventListener('click', saveEpkCvs);
    $('saveContactBtn').addEventListener('click', saveContact);
    if ($('copyContactFromEnBtn')) $('copyContactFromEnBtn').addEventListener('click', function () { copyContactFromEn(false); });
    if ($('copyContactMissingFromEnBtn')) $('copyContactMissingFromEnBtn').addEventListener('click', function () { copyContactFromEn(true); });
    if ($('compareContactWithEnBtn')) $('compareContactWithEnBtn').addEventListener('click', compareContactWithEn);
    if ($('markContactNeedsTranslationBtn')) $('markContactNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('contact', 'needs_translation'); });
    if ($('markContactReviewedBtn')) $('markContactReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('contact', 'reviewed'); });
    $('reloadUiBtn').addEventListener('click', loadUiJson);
    $('saveUiBtn').addEventListener('click', saveUiJson);
    $('saveUiNavBtn').addEventListener('click', saveUiNav);
    if ($('copyUiNavFromEnBtn')) $('copyUiNavFromEnBtn').addEventListener('click', function () { copyUiNavFromEn(false); });
    if ($('copyUiNavMissingFromEnBtn')) $('copyUiNavMissingFromEnBtn').addEventListener('click', function () { copyUiNavFromEn(true); });
    if ($('compareUiWithEnBtn')) $('compareUiWithEnBtn').addEventListener('click', compareUiWithEn);
    if ($('resetNavOrderBtn')) $('resetNavOrderBtn').addEventListener('click', resetNavOrder);
    document.addEventListener('click', function (e) {
      var upBtn = e.target.closest('[data-nav-up]');
      var downBtn = e.target.closest('[data-nav-down]');
      if (upBtn) {
        var sectionId = upBtn.getAttribute('data-nav-up');
        if (sectionId) moveNavItemUp(sectionId);
      }
      if (downBtn) {
        var sectionId = downBtn.getAttribute('data-nav-down');
        if (sectionId) moveNavItemDown(sectionId);
      }
    });
    if ($('markUiNeedsTranslationBtn')) $('markUiNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('ui', 'needs_translation'); });
    if ($('markUiReviewedBtn')) $('markUiReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('ui', 'reviewed'); });
    if ($('markHomeTranslatedBtn')) $('markHomeTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('home', 'translated'); });
    if ($('markBioTranslatedBtn')) $('markBioTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('bio', 'translated'); });
    if ($('markProgramsTranslatedBtn')) $('markProgramsTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('programs', 'translated'); });
    if ($('markContactTranslatedBtn')) $('markContactTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('contact', 'translated'); });
    if ($('markUiTranslatedBtn')) $('markUiTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('ui', 'translated'); });
    if ($('markPressBiosTranslatedBtn')) $('markPressBiosTranslatedBtn').addEventListener('click', function () { setSectionEditorialReview('press_bios', 'translated'); });
    if ($('translationRefreshBtn')) $('translationRefreshBtn').addEventListener('click', refreshTranslationWorkspace);
    if ($('translationRunQaBtn')) $('translationRunQaBtn').addEventListener('click', function () { runTranslationConsistencyQa(false); });
    if ($('translationBatchMissingBtn')) $('translationBatchMissingBtn').addEventListener('click', batchCopyMissingFromEnForCurrentLang);
    if ($('translationMissingOnlyToggle')) {
      $('translationMissingOnlyToggle').addEventListener('click', function () {
        state.translationMissingOnly = !state.translationMissingOnly;
        $('translationMissingOnlyToggle').classList.toggle('active', state.translationMissingOnly);
        if (state.section === 'translation') refreshTranslationWorkspace();
        else applyTranslationMissingOnlyMask();
      });
    }
    wireTranslationWorkspaceActions();
    if ($('section-publishing')) {
      $('section-publishing').addEventListener('click', function (evt) {
        var j = evt.target && evt.target.closest ? evt.target.closest('[data-pub-jump]') : null;
        if (!j || !$('section-publishing').contains(j)) return;
        evt.preventDefault();
        var raw = safeString(j.getAttribute('data-pub-jump'));
        var parts = raw.split(':');
        publishingJumpTo(parts[0], parts[1] || 'all');
      });
    }
    if ($('publishing-refresh')) {
      $('publishing-refresh').addEventListener('click', function () {
        refreshPublishingDashboard();
        touchCloseoutStep('publishing');
      });
    }

    $('rep-cat-filter').addEventListener('change', renderRepList);
    if ($('rep-status-filter')) $('rep-status-filter').addEventListener('change', function () { state.repStatusFilter = $('rep-status-filter').value; renderRepList(); });
    if ($('rep-search')) $('rep-search').addEventListener('input', function () { state.repSearch = $('rep-search').value; renderRepList(); });
    if ($('rep-reset-filters')) $('rep-reset-filters').addEventListener('click', function () {
      $('rep-cat-filter').value = 'all';
      if ($('rep-status-filter')) $('rep-status-filter').value = 'all';
      if ($('rep-search')) $('rep-search').value = '';
      if ($('rep-workflow-filter')) $('rep-workflow-filter').value = 'all';
      state.repStatusFilter = 'all';
      state.repSearch = '';
      state.repWorkflowFilter = 'all';
      renderRepList();
    });
    if ($('rep-select-visible')) $('rep-select-visible').addEventListener('click', function () { selectVisibleInto(state.repSelected, 'rep-list'); renderRepList(); });
    if ($('rep-clear-selection')) $('rep-clear-selection').addEventListener('click', function () { clearSelected(state.repSelected); renderRepList(); });
    if ($('rep-apply-bulk')) $('rep-apply-bulk').addEventListener('click', applyRepBulk);
    if ($('rep-workflow-filter')) $('rep-workflow-filter').addEventListener('change', function () {
      state.repWorkflowFilter = $('rep-workflow-filter').value;
      renderRepList();
    });
    if ($('rep-apply-editorial-bulk')) $('rep-apply-editorial-bulk').addEventListener('click', applyRepEditorialBulk);
    if ($('media-vid-search')) $('media-vid-search').addEventListener('input', function () { state.mediaVidSearch = $('media-vid-search').value; renderMediaVideosList(); });
    if ($('media-vid-filter')) $('media-vid-filter').addEventListener('change', function () { state.mediaVidFilter = $('media-vid-filter').value; renderMediaVideosList(); });
    if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').addEventListener('change', function () {
      state.mediaVidWorkflowFilter = $('media-vid-workflow-filter').value;
      renderMediaVideosList();
    });
    if ($('media-vid-reset-filters')) $('media-vid-reset-filters').addEventListener('click', function () {
      if ($('media-vid-search')) $('media-vid-search').value = '';
      if ($('media-vid-filter')) $('media-vid-filter').value = 'all';
      if ($('media-vid-workflow-filter')) $('media-vid-workflow-filter').value = 'all';
      state.mediaVidSearch = '';
      state.mediaVidFilter = 'all';
      state.mediaVidWorkflowFilter = 'all';
      renderMediaVideosList();
    });
    if ($('media-vid-select-visible')) $('media-vid-select-visible').addEventListener('click', function () { selectVisibleInto(state.mediaVidSelected, 'media-vid-list'); renderMediaVideosList(); });
    if ($('media-vid-clear-selection')) $('media-vid-clear-selection').addEventListener('click', function () { clearSelected(state.mediaVidSelected); renderMediaVideosList(); });
    if ($('media-vid-apply-bulk')) $('media-vid-apply-bulk').addEventListener('click', applyMediaVidBulk);
    if ($('media-aud-search')) $('media-aud-search').addEventListener('input', function () { state.mediaAudSearch = $('media-aud-search').value; renderMediaAudioList(); });
    if ($('media-aud-filter')) $('media-aud-filter').addEventListener('change', function () { state.mediaAudFilter = $('media-aud-filter').value; renderMediaAudioList(); });
    if ($('media-aud-workflow-filter')) $('media-aud-workflow-filter').addEventListener('change', function () {
      state.mediaAudWorkflowFilter = $('media-aud-workflow-filter').value;
      renderMediaAudioList();
    });
    if ($('media-aud-reset-filters')) $('media-aud-reset-filters').addEventListener('click', function () {
      if ($('media-aud-search')) $('media-aud-search').value = '';
      if ($('media-aud-filter')) $('media-aud-filter').value = 'all';
      if ($('media-aud-workflow-filter')) $('media-aud-workflow-filter').value = 'all';
      state.mediaAudSearch = '';
      state.mediaAudFilter = 'all';
      state.mediaAudWorkflowFilter = 'all';
      renderMediaAudioList();
    });
    if ($('media-photo-search')) $('media-photo-search').addEventListener('input', function () { state.mediaPhotoSearch = $('media-photo-search').value; renderMediaPhotosList(); });
    if ($('press-search')) $('press-search').addEventListener('input', function () { state.pressSearch = $('press-search').value; renderPressList(); });
    if ($('press-visible-filter')) $('press-visible-filter').addEventListener('change', function () { state.pressVisibleFilter = $('press-visible-filter').value; renderPressList(); });
    if ($('press-reset-filters')) $('press-reset-filters').addEventListener('click', function () {
      if ($('press-search')) $('press-search').value = '';
      if ($('press-visible-filter')) $('press-visible-filter').value = 'all';
      if ($('press-workflow-filter')) $('press-workflow-filter').value = 'all';
      state.pressSearch = '';
      state.pressVisibleFilter = 'all';
      state.pressWorkflowFilter = 'all';
      renderPressList();
    });
    if ($('press-select-visible')) $('press-select-visible').addEventListener('click', function () { selectVisibleInto(state.pressSelected, 'press-list'); renderPressList(); });
    if ($('press-clear-selection')) $('press-clear-selection').addEventListener('click', function () { clearSelected(state.pressSelected); renderPressList(); });
    if ($('press-apply-bulk')) $('press-apply-bulk').addEventListener('click', applyPressBulk);
    if ($('press-workflow-filter')) $('press-workflow-filter').addEventListener('change', function () {
      state.pressWorkflowFilter = $('press-workflow-filter').value;
      renderPressList();
    });
    if ($('press-apply-editorial-bulk')) $('press-apply-editorial-bulk').addEventListener('click', applyPressEditorialBulk);
    if ($('press-hide-outdated-btn')) $('press-hide-outdated-btn').addEventListener('click', pressHideCurrentQuote);
    if ($('perf-status-filter')) $('perf-status-filter').addEventListener('change', function () { state.perfStatusFilter = $('perf-status-filter').value; renderPerfList(); });
    if ($('perf-workflow-filter')) $('perf-workflow-filter').addEventListener('change', function () {
      state.perfWorkflowFilter = $('perf-workflow-filter').value;
      renderPerfList();
    });
    if ($('perf-revenue-filter')) $('perf-revenue-filter').addEventListener('change', function () {
      state.perfRevenueFilter = safeString($('perf-revenue-filter').value || 'all').trim().toLowerCase() || 'all';
      renderPerfList();
    });
    if ($('perf-reset-filters')) $('perf-reset-filters').addEventListener('click', function () {
      if ($('perf-status-filter')) $('perf-status-filter').value = 'all';
      if ($('perf-workflow-filter')) $('perf-workflow-filter').value = 'all';
      if ($('perf-revenue-filter')) $('perf-revenue-filter').value = 'all';
      state.perfStatusFilter = 'all';
      state.perfWorkflowFilter = 'all';
      state.perfRevenueFilter = 'all';
      renderPerfList();
    });
    if ($('perf-select-visible')) $('perf-select-visible').addEventListener('click', function () { selectVisibleInto(state.perfSelected, 'perf-list'); renderPerfList(); });
    if ($('perf-clear-selection')) $('perf-clear-selection').addEventListener('click', function () { clearSelected(state.perfSelected); renderPerfList(); });
    if ($('perf-apply-bulk')) $('perf-apply-bulk').addEventListener('click', applyPerfBulk);
    if ($('perf-apply-editorial-bulk')) $('perf-apply-editorial-bulk').addEventListener('click', applyPerfEditorialBulk);
    if ($('perf-archive-current-btn')) $('perf-archive-current-btn').addEventListener('click', perfArchiveCurrentEvent);
    if ($('perf-open-internal-calendar')) $('perf-open-internal-calendar').addEventListener('click', function () {
      window.open('internal-calendar.html', '_blank', 'noopener');
    });
    document.querySelectorAll('[data-revenue-quick-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var status = safeString(btn.getAttribute('data-revenue-quick-status') || 'unknown').trim().toLowerCase() || 'unknown';
        var statusEl = $('perf-revenue-status');
        if (!statusEl) return;
        statusEl.value = status;
        statusEl.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
    if ($('copyPressBiosMissingFromEnBtn')) $('copyPressBiosMissingFromEnBtn').addEventListener('click', copyPressBiosMissingFromEn);
    if ($('comparePressBiosWithEnBtn')) $('comparePressBiosWithEnBtn').addEventListener('click', comparePressBiosWithEn);
    if ($('markPressBiosNeedsTranslationBtn')) $('markPressBiosNeedsTranslationBtn').addEventListener('click', function () { setSectionEditorialReview('press_bios', 'needs_translation'); });
    if ($('markPressBiosReviewedBtn')) $('markPressBiosReviewedBtn').addEventListener('click', function () { setSectionEditorialReview('press_bios', 'reviewed'); });
    if ($('perf-add-template')) $('perf-add-template').addEventListener('click', addEventFromTemplate);
    if ($('press-add-template')) $('press-add-template').addEventListener('click', addQuoteFromTemplate);
    if ($('epk-photo-search')) $('epk-photo-search').addEventListener('input', function () { state.epkPhotoSearch = $('epk-photo-search').value; renderEpkPhotoList(); });
    $('rep-add').addEventListener('click', function () {
      clearSelected(state.repSelected);
      state.repCards.push({ composer: '', opera: '', role: '', cat: 'opera', lang: 'IT', editorialStatus: 'draft' });
      state.repIndex = state.repCards.length - 1;
      renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-dup').addEventListener('click', function () {
      if (state.repIndex < 0) return;
      clearSelected(state.repSelected);
      state.repCards.splice(state.repIndex + 1, 0, clone(state.repCards[state.repIndex]));
      state.repIndex += 1; renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-del').addEventListener('click', function () {
      if (state.repIndex < 0) return;
      if (!window.confirm('Delete the selected repertoire item?')) return;
      clearSelected(state.repSelected);
      state.repCards.splice(state.repIndex, 1);
      state.repIndex = Math.max(0, state.repIndex - 1); renderRepList(); renderRepEditor(); markDirty(true);
    });
    $('rep-up').addEventListener('click', function () {
      var i = state.repIndex; if (i <= 0) return;
      clearSelected(state.repSelected);
      var t = state.repCards[i - 1]; state.repCards[i - 1] = state.repCards[i]; state.repCards[i] = t;
      state.repIndex = i - 1; renderRepList(); markDirty(true);
    });
    $('rep-down').addEventListener('click', function () {
      var i = state.repIndex; if (i < 0 || i >= state.repCards.length - 1) return;
      clearSelected(state.repSelected);
      var t = state.repCards[i + 1]; state.repCards[i + 1] = state.repCards[i]; state.repCards[i] = t;
      state.repIndex = i + 1; renderRepList(); markDirty(true);
    });
    if ($('rep-prev-item')) $('rep-prev-item').addEventListener('click', function () { goPrevNext('rep', -1); });
    if ($('rep-next-item')) $('rep-next-item').addEventListener('click', function () { goPrevNext('rep', 1); });
    if ($('rep-move-apply')) $('rep-move-apply').addEventListener('click', function () { applyMoveToPosition('rep', 'rep-move-pos'); });
    if ($('rep-revert-item')) $('rep-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('rep'); });

    $('programs-add').addEventListener('click', function () {
      var arr = state.programsDoc.programs;
      var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
      arr.push({ id: maxId + 1, order: arr.length, published: true, editorialStatus: 'draft', title: '', description: '', formations: [], duration: '', idealFor: [] });
      state.programsIndex = arr.length - 1;
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program added');
    });
    $('programs-dup').addEventListener('click', function () {
      if (state.programsIndex < 0) return;
      var arr = state.programsDoc.programs;
      var src = clone(arr[state.programsIndex]);
      var maxId = arr.length ? Math.max.apply(null, arr.map(function (p) { return Number(p.id) || 0; })) : 0;
      src.id = maxId + 1;
      arr.splice(state.programsIndex + 1, 0, src);
      state.programsIndex += 1;
      normalizeProgramOrders();
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program duplicated');
    });
    $('programs-del').addEventListener('click', function () {
      if (state.programsIndex < 0) return;
      if (!window.confirm('Delete the selected program?')) return;
      state.programsDoc.programs.splice(state.programsIndex, 1);
      state.programsIndex = Math.max(0, state.programsIndex - 1);
      normalizeProgramOrders();
      renderProgramsList(); renderProgramsEditor(); markDirty(true, 'Program deleted');
    });
    $('programs-up').addEventListener('click', function () {
      var i = state.programsIndex; if (i <= 0) return;
      var arr = state.programsDoc.programs;
      var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
      state.programsIndex = i - 1;
      normalizeProgramOrders();
      renderProgramsList(); markDirty(true, 'Program order updated');
    });
    $('programs-down').addEventListener('click', function () {
      var i = state.programsIndex;
      var arr = state.programsDoc.programs;
      if (i < 0 || i >= arr.length - 1) return;
      var t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
      state.programsIndex = i + 1;
      normalizeProgramOrders();
      renderProgramsList(); markDirty(true, 'Program order updated');
    });
    if ($('programs-prev-item')) $('programs-prev-item').addEventListener('click', function () { goPrevNext('programs', -1); });
    if ($('programs-next-item')) $('programs-next-item').addEventListener('click', function () { goPrevNext('programs', 1); });
    if ($('programs-move-apply')) $('programs-move-apply').addEventListener('click', function () { applyMoveToPosition('programs', 'programs-move-pos'); });
    if ($('programs-revert-item')) $('programs-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('programs'); });

    $('perf-add').addEventListener('click', function () {
      clearSelected(state.perfSelected);
      state.perfs.push({ title: '', detail: '', day: '', month: '', time: '', venue: '', city: '', status: 'upcoming', type: 'concert', editorialStatus: 'draft', sortDate: '' });
      state.perfIndex = state.perfs.length - 1; renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-dup').addEventListener('click', function () {
      if (state.perfIndex < 0) return;
      clearSelected(state.perfSelected);
      state.perfs.splice(state.perfIndex + 1, 0, clone(state.perfs[state.perfIndex]));
      state.perfIndex += 1; renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-del').addEventListener('click', function () {
      if (state.perfIndex < 0) return;
      if (!window.confirm('Delete the selected calendar event?')) return;
      clearSelected(state.perfSelected);
      state.perfs.splice(state.perfIndex, 1);
      state.perfIndex = Math.max(0, state.perfIndex - 1); renderPerfList(); renderPerfEditor(); markDirty(true);
    });
    $('perf-up').addEventListener('click', function () {
      var i = state.perfIndex; if (i <= 0) return;
      clearSelected(state.perfSelected);
      var t = state.perfs[i - 1]; state.perfs[i - 1] = state.perfs[i]; state.perfs[i] = t;
      state.perfIndex = i - 1; renderPerfList(); markDirty(true);
    });
    $('perf-down').addEventListener('click', function () {
      var i = state.perfIndex; if (i < 0 || i >= state.perfs.length - 1) return;
      clearSelected(state.perfSelected);
      var t = state.perfs[i + 1]; state.perfs[i + 1] = state.perfs[i]; state.perfs[i] = t;
      state.perfIndex = i + 1; renderPerfList(); markDirty(true);
    });
    if ($('perf-prev-item')) $('perf-prev-item').addEventListener('click', function () { goPrevNext('perf', -1); });
    if ($('perf-next-item')) $('perf-next-item').addEventListener('click', function () { goPrevNext('perf', 1); });
    if ($('perf-move-apply')) $('perf-move-apply').addEventListener('click', function () { applyMoveToPosition('perf', 'perf-move-pos'); });
    if ($('perf-revert-item')) $('perf-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('perf'); });

    $('press-add').addEventListener('click', function () {
      clearSelected(state.pressSelected);
      state.press.push({ id: Date.now(), source: '', quote: '', production: '', url: '', visible: true, editorialStatus: 'draft', order: state.press.length });
      state.pressIndex = state.press.length - 1; renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-dup').addEventListener('click', function () {
      if (state.pressIndex < 0) return;
      clearSelected(state.pressSelected);
      var n = clone(state.press[state.pressIndex]); n.id = Date.now();
      state.press.splice(state.pressIndex + 1, 0, n); state.pressIndex += 1; renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-del').addEventListener('click', function () {
      if (state.pressIndex < 0) return;
      if (!window.confirm('Delete the selected press quote?')) return;
      clearSelected(state.pressSelected);
      state.press.splice(state.pressIndex, 1); state.pressIndex = Math.max(0, state.pressIndex - 1); renderPressList(); renderPressEditor(); markDirty(true);
    });
    $('press-up').addEventListener('click', function () {
      var i = state.pressIndex; if (i <= 0) return;
      clearSelected(state.pressSelected);
      var t = state.press[i - 1]; state.press[i - 1] = state.press[i]; state.press[i] = t;
      state.pressIndex = i - 1; renderPressList(); markDirty(true);
    });
    $('press-down').addEventListener('click', function () {
      var i = state.pressIndex; if (i < 0 || i >= state.press.length - 1) return;
      clearSelected(state.pressSelected);
      var t = state.press[i + 1]; state.press[i + 1] = state.press[i]; state.press[i] = t;
      state.pressIndex = i + 1; renderPressList(); markDirty(true);
    });
    if ($('press-prev-item')) $('press-prev-item').addEventListener('click', function () { goPrevNext('press', -1); });
    if ($('press-next-item')) $('press-next-item').addEventListener('click', function () { goPrevNext('press', 1); });
    if ($('press-move-apply')) $('press-move-apply').addEventListener('click', function () { applyMoveToPosition('press', 'press-move-pos'); });
    if ($('press-revert-item')) $('press-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('press'); });
    $('epk-photo-add-url').addEventListener('click', function () {
      var url = window.prompt('URL de foto EPK');
      if (!url) return;
      var clean = safeString(url).trim();
      if (!clean) return;
      state.epkPhotos.push({ url: clean, caption: '', alt: '', photographer: '', label: '', credit: '' });
      state.epkPhotoIndex = state.epkPhotos.length - 1;
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo agregada');
    });
    $('epk-photo-add-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.epkPhotos.push({ url: safeString(ev.target.result), caption: '', alt: '', photographer: '', label: '', credit: '' });
        state.epkPhotoIndex = state.epkPhotos.length - 1;
        renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo subida');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('epk-photo-replace-file').addEventListener('change', function (e) {
      if (state.epkPhotoIndex < 0) return;
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.epkPhotos[state.epkPhotoIndex].url = safeString(ev.target.result);
        renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo reemplazada');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
    $('epk-photo-dup').addEventListener('click', function () {
      if (state.epkPhotoIndex < 0) return;
      state.epkPhotos.splice(state.epkPhotoIndex + 1, 0, clone(state.epkPhotos[state.epkPhotoIndex]));
      state.epkPhotoIndex += 1;
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo duplicada');
    });
    $('epk-photo-del').addEventListener('click', function () {
      if (state.epkPhotoIndex < 0) return;
      if (!window.confirm('Delete the selected EPK photo?')) return;
      state.epkPhotos.splice(state.epkPhotoIndex, 1);
      state.epkPhotoIndex = Math.max(0, state.epkPhotoIndex - 1);
      renderEpkPhotoList(); renderEpkPhotoEditor(); markDirty(true, 'EPK photo borrada');
    });
    $('epk-photo-up').addEventListener('click', function () {
      var i = state.epkPhotoIndex; if (i <= 0) return;
      var t = state.epkPhotos[i - 1]; state.epkPhotos[i - 1] = state.epkPhotos[i]; state.epkPhotos[i] = t;
      state.epkPhotoIndex = i - 1;
      renderEpkPhotoList(); markDirty(true, 'EPK photo order updated');
    });
    $('epk-photo-down').addEventListener('click', function () {
      var i = state.epkPhotoIndex; if (i < 0 || i >= state.epkPhotos.length - 1) return;
      var t = state.epkPhotos[i + 1]; state.epkPhotos[i + 1] = state.epkPhotos[i]; state.epkPhotos[i] = t;
      state.epkPhotoIndex = i + 1;
      renderEpkPhotoList(); markDirty(true, 'EPK photo order updated');
    });
    if ($('epk-photo-prev-item')) $('epk-photo-prev-item').addEventListener('click', function () { goPrevNext('epk-photo', -1); });
    if ($('epk-photo-next-item')) $('epk-photo-next-item').addEventListener('click', function () { goPrevNext('epk-photo', 1); });
    if ($('epk-photo-move-apply')) $('epk-photo-move-apply').addEventListener('click', function () { applyMoveToPosition('epk-photo', 'epk-photo-move-pos'); });
    if ($('epk-photo-revert-item')) $('epk-photo-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('epk-photo'); });

    ['EN', 'DE', 'ES', 'IT', 'FR'].forEach(function (L) {
      $('epk-cv-file-' + L).addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!/\.pdf$/i.test(file.name || '') && file.type !== 'application/pdf') {
          alert('Only PDF files are allowed.');
          e.target.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('File is too large (max 5MB).');
          e.target.value = '';
          return;
        }
        var reader = new FileReader();
        reader.onload = function (ev) {
          var raw = safeString(ev.target.result);
          var b64 = raw.split(',')[1] || '';
          if (!b64) {
            alert('Invalid PDF payload.');
            return;
          }
          state.epkCvsTemp[L] = b64;
          renderEpkCvsUi();
          markDirty(true, 'CV ' + L + ' cargado');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
      $('epk-cv-clear-' + L).addEventListener('click', function () {
        if (!window.confirm('Remove custom CV for ' + L + '?')) return;
        delete state.epkCvsTemp[L];
        delete state.epkCvs[L];
        renderEpkCvsUi();
        markDirty(true, 'CV ' + L + ' marcado para eliminar');
      });
    });

    $('media-vid-add').addEventListener('click', function () {
      clearSelected(state.mediaVidSelected);
      state.vidData.videos.push({ id: '', tag: '', title: '', sub: '', composer: '', repertoireCat: '', hidden: false, group: 'opera_operetta', featured: false, editorialStatus: 'draft', customThumb: '' });
      state.vidIndex = state.vidData.videos.length - 1;
      renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video creado');
    });
    $('media-vid-dup').addEventListener('click', function () {
      if (state.vidIndex < 0) return;
      clearSelected(state.mediaVidSelected);
      state.vidData.videos.splice(state.vidIndex + 1, 0, clone(state.vidData.videos[state.vidIndex]));
      state.vidIndex += 1; renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video duplicado');
    });
    $('media-vid-del').addEventListener('click', function () {
      if (state.vidIndex < 0) return;
      if (!window.confirm('Delete the selected video?')) return;
      clearSelected(state.mediaVidSelected);
      state.vidData.videos.splice(state.vidIndex, 1);
      state.vidIndex = Math.max(0, state.vidIndex - 1); renderMediaVideosList(); renderMediaVideoEditor(); markDirty(true, 'Video borrado');
    });
    $('media-vid-up').addEventListener('click', function () {
      var i = state.vidIndex; if (i <= 0) return;
      clearSelected(state.mediaVidSelected);
      var t = state.vidData.videos[i - 1]; state.vidData.videos[i - 1] = state.vidData.videos[i]; state.vidData.videos[i] = t;
      state.vidIndex = i - 1; renderMediaVideosList(); markDirty(true, 'Video order updated');
    });
    $('media-vid-down').addEventListener('click', function () {
      var i = state.vidIndex; if (i < 0 || i >= state.vidData.videos.length - 1) return;
      clearSelected(state.mediaVidSelected);
      var t = state.vidData.videos[i + 1]; state.vidData.videos[i + 1] = state.vidData.videos[i]; state.vidData.videos[i] = t;
      state.vidIndex = i + 1; renderMediaVideosList(); markDirty(true, 'Video order updated');
    });
    if ($('media-vid-prev-item')) $('media-vid-prev-item').addEventListener('click', function () { goPrevNext('media-vid', -1); });
    if ($('media-vid-next-item')) $('media-vid-next-item').addEventListener('click', function () { goPrevNext('media-vid', 1); });
    if ($('media-vid-move-apply')) $('media-vid-move-apply').addEventListener('click', function () { applyMoveToPosition('media-vid', 'media-vid-move-pos'); });
    if ($('media-vid-revert-item')) $('media-vid-revert-item').addEventListener('click', function () { revertCurrentItemToSaved('media-vid'); });
    $('media-aud-add').addEventListener('click', function () {
      state.audioData.items.push({ provider: 'soundcloud', embedUrl: '', externalUrl: '', coverImage: '', title: '', subline: '', tag: '', composer: '', repertoireCat: '', hidden: false, group: 'opera_operetta', featured: false, editorialStatus: 'draft' });
      state.audIndex = state.audioData.items.length - 1;
      renderMediaAudioList(); renderMediaAudioEditor(); markDirty(true, 'Audio creado');
    });
    $('media-aud-dup').addEventListener('click', function () {
      if (state.audIndex < 0) return;
      state.audioData.items.splice(state.audIndex + 1, 0, clone(state.audioData.items[state.audIndex]));
      state.audIndex += 1;
      renderMediaAudioList(); renderMediaAudioEditor(); markDirty(true, 'Audio duplicado');
    });
    $('media-aud-del').addEventListener('click', function () {
      if (state.audIndex < 0) return;
      if (!window.confirm('Delete the selected audio item?')) return;
      state.audioData.items.splice(state.audIndex, 1);
      state.audIndex = Math.max(0, state.audIndex - 1);
      renderMediaAudioList(); renderMediaAudioEditor(); markDirty(true, 'Audio borrado');
    });
    $('media-aud-up').addEventListener('click', function () {
      var i = state.audIndex; if (i <= 0) return;
      var t = state.audioData.items[i - 1]; state.audioData.items[i - 1] = state.audioData.items[i]; state.audioData.items[i] = t;
      state.audIndex = i - 1;
      renderMediaAudioList(); markDirty(true, 'Audio order updated');
    });
    $('media-aud-down').addEventListener('click', function () {
      var i = state.audIndex; if (i < 0 || i >= state.audioData.items.length - 1) return;
      var t = state.audioData.items[i + 1]; state.audioData.items[i + 1] = state.audioData.items[i]; state.audioData.items[i] = t;
      state.audIndex = i + 1;
      renderMediaAudioList(); markDirty(true, 'Audio order updated');
    });

    ['s', 't', 'b'].forEach(function (type) {
      $('media-photo-filter-' + type).addEventListener('click', function () { setPhotoType(type); });
    });
    $('media-photo-add-url').addEventListener('click', function () {
      var url = window.prompt('URL de imagen');
      if (!url) return;
      var clean = safeString(url).trim();
      if (!clean) return;
      state.photosData[state.photoType].push({ url: clean, orientation: '', focus: '' });
      state.photoIndex = state.photosData[state.photoType].length - 1;
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto agregada');
    });
    $('media-photo-add-batch').addEventListener('click', function () {
      openBulkUrlDialog(function (raw) {
        var urls = safeString(raw).split(/\r?\n/).map(function (x) { return safeString(x).trim(); }).filter(Boolean);
        if (!urls.length) return;
        urls.forEach(function (url) {
          state.photosData[state.photoType].push({ url: url, orientation: '', focus: '' });
        });
        state.photoIndex = state.photosData[state.photoType].length - 1;
        renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, urls.length + ' photos added');
      });
    });
    $('media-photo-dup').addEventListener('click', function () {
      if (state.photoIndex < 0) return;
      var type = state.photoType;
      var arr = state.photosData[type];
      var insertAt = state.photoIndex + 1;
      shiftPhotoCaptionsAfterInsert(type, insertAt);
      arr.splice(insertAt, 0, arr[state.photoIndex]);
      var original = getPhotoEntry(type, state.photoIndex);
      arr[insertAt] = { url: original.url, orientation: original.orientation, focus: original.focus };
      var cap = clone(getPhotoCaption(type, state.photoIndex));
      state.photoIndex = insertAt;
      setPhotoCaption(type, state.photoIndex, cap.caption, cap.alt, cap.photographer);
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto duplicada');
    });
    $('media-photo-del').addEventListener('click', function () {
      if (state.photoIndex < 0) return;
      if (!window.confirm('Delete the selected photo?')) return;
      state.photosData[state.photoType].splice(state.photoIndex, 1);
      shiftPhotoCaptionsAfterDelete(state.photoType, state.photoIndex);
      state.photoIndex = Math.max(0, state.photoIndex - 1);
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Foto borrada');
    });
    $('media-photo-up').addEventListener('click', function () {
      var i = state.photoIndex; if (i <= 0) return;
      var arr = state.photosData[state.photoType];
      var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
      var cA = clone(getPhotoCaption(state.photoType, i - 1));
      var cB = clone(getPhotoCaption(state.photoType, i));
      setPhotoCaption(state.photoType, i - 1, cB.caption, cB.alt, cB.photographer);
      setPhotoCaption(state.photoType, i, cA.caption, cA.alt, cA.photographer);
      state.photoIndex = i - 1;
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Photo order updated');
    });
    $('media-photo-down').addEventListener('click', function () {
      var i = state.photoIndex; var arr = state.photosData[state.photoType];
      if (i < 0 || i >= arr.length - 1) return;
      var t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
      var cA = clone(getPhotoCaption(state.photoType, i));
      var cB = clone(getPhotoCaption(state.photoType, i + 1));
      setPhotoCaption(state.photoType, i, cB.caption, cB.alt, cB.photographer);
      setPhotoCaption(state.photoType, i + 1, cA.caption, cA.alt, cA.photographer);
      state.photoIndex = i + 1;
      renderMediaPhotosList(); renderMediaPhotoEditor(); markDirty(true, 'Photo order updated');
    });

    bindInputsDirty(['rep-composer','rep-opera','rep-role','rep-cat','rep-status','rep-lang','rep-category','rep-editorialStatus'], persistRepEditor);
    bindInputsDirty(['programs-item-title','programs-item-description','programs-item-formations','programs-item-duration','programs-item-idealFor','programs-item-published','programs-item-editorialStatus'], persistProgramsEditor);
    bindInputsDirty(['pb-rep-id','pb-rep-title','pb-rep-composer','pb-rep-work','pb-rep-type','pb-rep-language','pb-rep-durationMin','pb-rep-approximateDurationMin','pb-rep-readiness','pb-rep-availabilityStatus','pb-rep-category','pb-rep-voiceCategory','pb-rep-primaryVoice','pb-rep-pairedVoices','pb-rep-includesTenor','pb-rep-formations','pb-rep-performanceStatus','pb-rep-reviewStatus','pb-rep-tags','pb-rep-fitTags','pb-rep-performedIn','pb-rep-offerOnly','pb-rep-excludeFromOffers','pb-rep-sourceGroup','pb-rep-suggestionGroup','pb-rep-dramaticRole','pb-rep-energyLevel','pb-rep-tempoProfile','pb-rep-impactLevel','pb-rep-audienceAppeal','pb-rep-galaRole','pb-rep-vocalLoad','pb-rep-texture','pb-rep-styleBucket','pb-rep-recoveryValue','pb-rep-bestDurationFit','pb-rep-moodTags','pb-rep-practicalTags','pb-rep-encoreCandidate','pb-rep-interlude','pb-rep-vocalRestSupport','pb-rep-goodBetweenBlocks','pb-rep-goodBeforeClimax','pb-rep-notes','pb-rep-publicNotes','pb-rep-sortOrder'], persistPlannerRepEditor);
    bindInputsDirty(['pb-blueprint-formation','pb-style-focus','pb-include-discovery-ideas','pb-blueprint-notes','pb-version-label','pb-build-mode','pb-repertoire-mode','pb-header-image-mode','pb-header-image-url','pb-contact-phone','pb-offer-useCase','pb-offer-status','pb-gala-preferPacing','pb-gala-allowPianoInterludes','pb-gala-includeContrast','pb-gala-buildArc'], persistBlueprintHeader);
    bindInputsDirty(['pb-fee-eventType','pb-fee-durationMin','pb-fee-formation','pb-fee-numberOfArtists','pb-fee-includesPianist','pb-fee-rehearsalCount','pb-fee-rehearsalFeePerArtist','pb-fee-leadArtistFee','pb-fee-collaboratorFee','pb-fee-pianistFee','pb-fee-travelCost','pb-fee-hotelCost','pb-fee-localTransportCost','pb-fee-adminBuffer','pb-fee-lowBudgetOverride','pb-fee-recommendedOverride','pb-fee-benchmarkOverride','pb-fee-premiumOverride','pb-fee-benchmarkSourceVersion','pb-fee-benchmarkLastReviewed','pb-fee-notes'], persistBlueprintFeeEstimate);
    bindInputsDirty(['pb-blueprint-title','pb-offer-description','pb-flexible-note'], function () { persistBlueprintHeader('manual'); });
    bindInputsDirty(['pb-piece-customTitle','pb-piece-customDuration','pb-piece-notes'], persistBlueprintPieceEditor);
    bindInputsDirty(['pb-history-year','pb-history-title','pb-history-format','pb-history-sourceType','pb-history-collaborators','pb-history-programmeItems','pb-history-notes'], persistConcertHistoryEditor);
    bindInputsDirty(['perf-title','perf-detail','perf-day','perf-month','perf-dateDisplay','perf-time','perf-venue','perf-city','perf-revenue-amount','perf-revenue-currency','perf-revenue-status','perf-revenue-notes','perf-venuePhoto','perf-venueOpacity','perf-status','perf-type','perf-sortDate','perf-editorialStatus','perf-privateBadge','perf-privateBadgeText','perf-privateDetailLine','perf-privateDetailText','perf-modal-title','perf-modal-type','perf-modal-venue','perf-modal-city','perf-modal-longdesc','perf-modal-link','perf-modal-link-label','perf-modal-ticketPrice','perf-modal-image','perf-modal-image-hide','perf-modal-enabled','perf-modal-flyerImg'], persistPerfEditor);
    bindInputsDirty(['press-source','press-quote','press-production','press-url','press-visible','press-editorialStatus'], persistPressEditor);
    bindInputsDirty(['pdf-dossier-EN','pdf-artist-EN','pdf-dossier-DE','pdf-artist-DE','pdf-dossier-ES','pdf-artist-ES','pdf-dossier-IT','pdf-artist-IT','pdf-dossier-FR','pdf-artist-FR'], function () {
      persistPressPdfsFromUi();
      updatePdfValidation();
      updateCompletenessIndicators();
      markDirty(true, 'Public PDFs editados');
    });
    bindInputsDirty(['epk-bio-b50','epk-bio-b150','epk-bio-b300p1','epk-bio-b300p2','epk-bio-b300p3','epk-bio-b300p4'], function () { persistEpkBiosFromUi(); markDirty(true, 'EPK bios editadas'); });
    bindInputsDirty(['epk-photo-url','epk-photo-caption','epk-photo-alt','epk-photo-photographer'], persistEpkPhotoEditor);
    bindInputsDirty(['media-vid-id','media-vid-title','media-vid-sub','media-vid-tag','media-vid-composer','media-vid-group','media-vid-repertoireCat','media-vid-customThumb','media-vid-featured','media-vid-hidden','media-vid-editorialStatus'], persistMediaVideoEditor);
    bindInputsDirty(['media-vid-h2']);
    bindInputsDirty(['media-aud-provider','media-aud-embedUrl','media-aud-externalUrl','media-aud-coverImage','media-aud-title','media-aud-subline','media-aud-tag','media-aud-composer','media-aud-group','media-aud-repertoireCat','media-aud-featured','media-aud-hidden','media-aud-editorialStatus'], persistMediaAudioEditor);
    bindInputsDirty(['media-aud-h2','media-aud-sub']);
    bindInputsDirty(['media-photo-url','media-photo-orientation','media-photo-focus','media-photo-caption','media-photo-alt','media-photo-photographer'], persistMediaPhotoEditor);

    bindInputsDirty(
      [
        'hero-eyebrow',
        'hero-subtitle',
        'hero-cta1',
        'hero-cta2',
        'hero-quickBioLabel',
        'hero-quickCalLabel',
        'hero-introCtaBio',
        'hero-introCtaMedia',
        'hero-homeIntroH2',
        'hero-homeIntroP1',
        'hero-homeIntroP2',
        'hero-homeIntroProof',
        'hero-presenterTag',
        'hero-presenterStyle',
        'hero-presenterP1',
        'hero-presenterP2',
        'hero-presenterP3',
        'hero-bgImage',
        'hero-introImage'
      ],
      function () {
        updateHomeIntroPreview();
        updateHomeMiniPreviews();
        updateCompletenessIndicators();
        markDirty(true);
      }
    );
    bindInputsDirty(
      [
        'bio-introLine',
        'bio-h2',
        'bio-p1',
        'bio-p2',
        'bio-p3',
        'bio-p4',
        'bio-p5',
        'bio-p6',
        'bio-continue-tag',
        'bio-continue-sub',
        'bio-cta-rep',
        'bio-cta-media',
        'bio-cta-contact',
        'bio-cta-home',
        'bio-portraitAlt',
        'bio-quote',
        'bio-cite',
        'bio-portraitImage',
        'bio-portraitFit',
        'bio-portraitFocus'
      ],
      function () {
        updateBioPortraitPreview();
        updateBioMiniPreview();
        updateCompletenessIndicators();
        markDirty(true);
      }
    );
    if ($('media-photo-preview')) {
      $('media-photo-preview').addEventListener('load', function () {
        var photo = getPhotoEntry(state.photoType, state.photoIndex);
        var detected = inferPhotoOrientation(this.naturalWidth, this.naturalHeight);
        if (!$('media-photo-orientation').value && detected) {
          $('media-photo-orientation').value = detected;
          persistMediaPhotoEditor();
          photo = getPhotoEntry(state.photoType, state.photoIndex);
        }
        setMediaPhotoPreviewMeta(photo, this.naturalWidth || 0, this.naturalHeight || 0, detected ? 'Auto-detected: ' + detected : '');
        updateMediaPhotoOrientationWarning(photo);
      });
      bindPreviewFocusEditor({
        wrapId: 'media-photo-preview-wrap',
        inputId: 'media-photo-focus',
        imgId: 'media-photo-preview',
        onChange: function () { persistMediaPhotoEditor(); }
      });
    }
    if ($('media-photo-quick-filter')) $('media-photo-quick-filter').addEventListener('change', function () {
      state.mediaPhotoQuickFilter = $('media-photo-quick-filter').value;
      renderMediaPhotosList();
    });
    if ($('bio-portraitPreview')) {
      $('bio-portraitPreview').addEventListener('load', function () {
        var meta = $('bio-portraitPreview-meta');
        if (meta) {
          var detected = inferPhotoOrientation(this.naturalWidth, this.naturalHeight);
          meta.textContent = (this.naturalWidth || 0) && (this.naturalHeight || 0)
            ? 'Detected: ' + this.naturalWidth + '×' + this.naturalHeight + (detected ? ' · ' + detected : '')
            : 'Portrait preview.';
        }
      });
      bindPreviewFocusEditor({
        wrapId: 'bio-portraitPreview-wrap',
        inputId: 'bio-portraitFocus',
        imgId: 'bio-portraitPreview',
        onChange: function () {
          updateBioPortraitPreview();
          updateBioMiniPreview();
          updateCompletenessIndicators();
          markDirty(true);
        }
      });
    }
    if ($('bulkUrlCancelBtn')) $('bulkUrlCancelBtn').addEventListener('click', function () {
      closeBulkUrlDialog();
    });
    if ($('bulkUrlSubmitBtn')) $('bulkUrlSubmitBtn').addEventListener('click', function () {
      var ta = $('bulkUrlTextarea');
      var handler = bulkUrlSubmitHandler;
      var raw = ta ? ta.value : '';
      closeBulkUrlDialog();
      if (handler) handler(raw);
    });
    if ($('bulkUrlDialog')) $('bulkUrlDialog').addEventListener('click', function (evt) {
      if (evt.target === $('bulkUrlDialog')) closeBulkUrlDialog();
    });
    if ($('bulkUrlTextarea')) $('bulkUrlTextarea').addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeBulkUrlDialog();
      }
      if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {
        evt.preventDefault();
        if ($('bulkUrlSubmitBtn')) $('bulkUrlSubmitBtn').click();
      }
    });
    bindInputsDirty(['programs-item-title','programs-item-description','programs-item-duration'], updateProgramsMiniPreview);
    bindInputsDirty(['press-source','press-quote'], updatePressMiniPreview);
    bindInputsDirty(['contact-title','contact-sub','contact-phone','contact-emailBtn','contact-webBtn','contact-webUrl'], updateContactMiniPreview);
    bindInputsDirty(['rep-h2','rep-intro','programs-title','programs-subtitle','programs-intro','programs-closingNote','programs-repLink','programs-epkLink','programs-hideSection','perf-h2','perf-intro','press-translatedNote','press-reviewsIntro','press-showReviewsSection','contact-title','contact-sub','contact-email','contact-phone','contact-emailBtn','contact-webBtn','contact-webUrl','ui-json','ui-nav-home','ui-nav-bio','ui-nav-rep','ui-nav-media','ui-nav-cal','ui-nav-epk','ui-nav-book','ui-nav-contact','ui-logoHaloEnabled','ui-logoHaloIntensity','ui-featherHaloEnabled','ui-featherHaloIntensity','hero-homeIntroH2','hero-homeIntroP1','hero-homeIntroP2','hero-homeIntroProof','hero-presenterTag','hero-presenterStyle','hero-presenterP1','hero-presenterP2','hero-presenterP3'], function () {
      updateContactValidation();
      updateContactMiniPreview();
      updateCompletenessIndicators();
      markDirty(true);
    });

    $('exportBtn').addEventListener('click', function () {
      var payload = buildExportPayload();
      downloadJson('rg_admin_export_v2.json', payload);
      setStatus('Export finished', 'ok');
      pushActivitySummary('Exported JSON', [payload.keys.length + ' areas · same kind of bundle as a backup.', 'Check your downloads folder.']);
    });
    if ($('createBackupBtn')) $('createBackupBtn').addEventListener('click', function () {
      createBackupNow();
      touchCloseoutStep('backup');
    });
    if ($('runHealthChecksBtn')) $('runHealthChecksBtn').addEventListener('click', function () {
      renderSiteHealth();
      touchCloseoutStep('health');
      pushActivitySummary('Site health check', ['Dashboard checks refreshed.']);
    });
    $('openPublicBtn').addEventListener('click', function () {
      touchCloseoutStep('spotcheck');
      window.open('index.html', '_blank', 'noopener');
    });
    if ($('copyPublicUrlBtn')) $('copyPublicUrlBtn').addEventListener('click', copyCurrentPublicUrl);
    if ($('undoSectionBtn')) $('undoSectionBtn').addEventListener('click', undoLastSectionEdit);
    if ($('discardSectionBtn')) $('discardSectionBtn').addEventListener('click', discardCurrentSectionChanges);
    if ($('checkLocalDraftBtn')) $('checkLocalDraftBtn').addEventListener('click', function () {
      maybeRestoreDraftForCurrentSection(true);
    });
    if ($('focusModeBtn')) $('focusModeBtn').addEventListener('click', toggleFocusMode);
    $('openLegacyBtn').addEventListener('click', function () { window.open('admin.html', '_blank', 'noopener'); });
    $('openPressPdfsToolBtn').addEventListener('click', function () {
      touchCloseoutStep('pdfs');
      openSection('press');
      togglePressTab('pdfs');
    });
    $('openPressBiosToolBtn').addEventListener('click', function () {
      openSection('press');
      togglePressTab('bios');
    });
    $('restoreCurrentBtn').addEventListener('click', function () {
      if (typeof state.api.restoreDefaults !== 'function') return alert('Restore is not available in this session.');
      var map = { home: 'hero', bio: 'bio', rep: 'repertoire', programs: 'programs', calendar: 'calendar', media: 'videos', press: 'press', contact: 'contact', ui: 'site-ui' };
      var labels = { home: 'Home / Hero', bio: 'Biography', rep: 'Repertoire', programs: 'Programs', programbuilder: 'Programme Offers', calendar: 'Calendar', media: 'Media', press: 'Press / EPK', contact: 'Contact', ui: 'UI / Translations' };
      var s = map[state.section];
      if (!s) return;
      if (!confirm('Reset this section to built-in defaults?\nThis can overwrite saved content for the section.')) return;
      state.api.restoreDefaults(s);
      refreshCurrentSection();
      markDirty(false, 'Defaults restored');
      pushActivitySummary('Defaults restored', [labels[state.section] || state.section, 'Built-in defaults were reapplied for this section.']);
    });

    $('importInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var payload = JSON.parse(String(r.result || '{}'));
          var data = payload.data || {};
          if (!isObject(data)) throw new Error('The file needs a "data" object with content keys.');
          var scope = getImportScopeValue();
          var keysAll = Object.keys(data).filter(function (k) { return SAFE_IMPORT_KEY_RE.test(k); });
          var keys = filterImportKeys(keysAll, scope);
          var previewLines = [
            'File: ' + safeString(f.name),
            'Import scope: ' + getImportScopeLabel(),
            'Compatible in file: ' + keysAll.length,
            'Will import now: ' + keys.length,
            '',
            'Areas to update:',
            keys.slice(0, 40).map(function (k) { return '• ' + humanStorageKeyLine(k); }).join('\n') + (keys.length > 40 ? '\n• … and ' + (keys.length - 40) + ' more' : '')
          ];
          $('import-preview').value = previewLines.join('\n');
          if (!keysAll.length) throw new Error('No compatible content found in this file.');
          if (!keys.length) {
            throw new Error('Nothing matches the current import scope. Widen scope to "All compatible content" or pick a different file.');
          }
          var warn = [
            'Import will overwrite matching content in the admin.',
            '',
            'Strongly recommended: create a backup first (System / Tools → Create backup now).',
            '',
            'Scope: ' + getImportScopeLabel(),
            'Number of areas to write: ' + keys.length,
            '',
            'Proceed with import?'
          ].join('\n');
          if (!window.confirm(warn)) {
            setStatus('Import cancelled', 'warn');
            pushActivitySummary('Import cancelled', ['No changes were saved.']);
            return;
          }
          keys.forEach(function (k) {
            validateKeyValue(k, data[k]);
            state.api.save(k, clone(data[k]));
          });
          refreshCurrentSection();
          markDirty(false, 'Import saved');
          setStatus('Import complete', 'ok');
          pushActivitySummary('Import finished', [
            keys.length + ' area(s) updated.',
            'Scope was: ' + getImportScopeLabel() + '.',
            'Reload sections if something looks stale.'
          ]);
        } catch (err) {
          setStatus('Import failed: ' + err.message, 'err');
          alert('Import failed: ' + err.message);
          pushActivitySummary('Import failed', [safeString(err.message)]);
        } finally {
          e.target.value = '';
        }
      };
      r.readAsText(f);
    });
    if ($('sitehealth-issues')) {
      $('sitehealth-issues').addEventListener('click', function (evt) {
        var btn = evt.target && evt.target.closest ? evt.target.closest('[data-health-action="1"]') : null;
        if (!btn) return;
        applyHealthActionFromButton(btn);
      });
    }

    wireCloseoutChecklist();

    window.addEventListener('beforeunload', function (evt) {
      if (!state.dirty) return;
      evt.preventDefault();
      evt.returnValue = '';
    });
  }

  async function init() {
    try {
      window.adm2SignInGoogle = signInGoogle;
      window.adm2SignOut = signOut;
      var safari = isSafariBrowser();
      setAuthDebug({
        browserClass: safari ? 'safari' : 'non-safari',
        authMode: 'legacy-gateway',
        redirectProcessed: getRedirectPending() ? 'pending' : 'n/a',
        persistenceSet: 'no',
        persistenceType: 'pending',
        redirectPending: getRedirectPending() ? 'yes' : 'no',
        authState: 'pending',
        currentUserPresent: 'no',
        failure: ''
      });
      setAuthGate(false, null, 'Checking authentication status…');
      await initAuth();
      await handleRedirectResult();
      if ($('adm2SignInBtn')) $('adm2SignInBtn').addEventListener('click', signInGoogle);
      if ($('adm2SignOutBtn')) $('adm2SignOutBtn').addEventListener('click', signOut);
      if ($('adm2TopSignOutBtn')) $('adm2TopSignOutBtn').addEventListener('click', signOut);
      await awaitAuthorizedUser();
      setStatus('Connecting to data bridge…', 'warn');
      state.api = await waitForLegacyApi();
      installLegacySaveHooks(state.api);
      var lang = (state.api.currentLang && LANGS.indexOf(state.api.currentLang) >= 0) ? state.api.currentLang : 'en';
      state.lang = lang;
      state.paperPreview = readPaperPreviewPreference();
      $('langSelect').value = lang;
      updateLangBadge();
      state.ready = true;
      state.bridgeReadyAt = Date.now();
      setStatus('Ready · ' + lang.toUpperCase(), 'ok');
      setupEvents();
      applyPaperPreviewMode(state.paperPreview, false);
      var deep = readAdminDeepLink();
      if (deep.section) openSection(deep.section);
      else refreshCurrentSection();
      if ((deep.section || state.section) === 'calendar' && deep.perfId) {
        try { openCalendarEventById(deep.perfId); } catch (ePick) {}
      }
      primeUiPublicCopyFromStorage();
    } catch (e) {
      setStatus('Could not start admin', 'err');
      setAuthError('Admin could not finish starting: ' + e.message, e);
    }
  }

  init();
})();
