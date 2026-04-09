window.PROGRAM_BUILDER_HISTORICAL_IMPORT = {
  sourceCompilationNote: 'Imported from historical repertoire compilation prepared from shared concert programmes.',
  repertoireSections: {
    opera: `
“Una furtiva lagrima” — L’elisir d’amore — Donizetti
“È la solita storia del pastore / Lamento di Federico” — L’Arlesiana — Cilea
“All’idea di quel metallo” — Il barbiere di Siviglia — Rossini
“Venti scudi” — L’elisir d’amore — Donizetti
“O Mimì, tu più non torni” — La bohème — Puccini
“Dio, che nell’alma infondere” — Don Carlo — Verdi
“Ashton, tra queste mura” — Lucia di Lammermoor — Donizetti
“Solenne in quest’ora” — La forza del destino — Verdi
“Au fond du temple saint” — Les pêcheurs de perles — Bizet
“Ah! lève-toi, soleil!” — Roméo et Juliette — Gounod
“E lucevan le stelle” — Tosca — Puccini
“O soave fanciulla” — La bohème — Puccini
“Che gelida manina” — La bohème — Puccini
“De’ miei bollenti spiriti” — La traviata — Verdi
“Parigi, o cara” — La traviata — Verdi
“Ardir! Ha forse il cielo...” — L’elisir d’amore — Donizetti
“Parle-moi de ma mère” — Carmen — Bizet
“Nous vivrons à Paris!” — Manon — Massenet
“Grazie agli inganni tuoi” — Mozart
“Konstanze, Konstanze” — Die Entführung aus dem Serail — Mozart
“Caro elisir! sei mio!” — L’elisir d’amore — Donizetti
“In un coupé?” — La bohème — Puccini
“Un’aura amorosa” — Così fan tutte — Mozart
“Fra gli amplessi” — Così fan tutte — Mozart
“Donna non vidi mai” — Manon Lescaut — Puccini
“Je suis seul!” — Manon — Massenet
“Toi? Vous!” — Manon — Massenet
“Signor, né principe” — Rigoletto — Verdi
“Ella mi fu rapita… Parmi veder le lagrime” — Rigoletto — Verdi
“Vogliatemi bene” — Madama Butterfly — Puccini
“Quanto è bella, quanto è cara” — L’elisir d’amore — Donizetti
“Questa o quella” — Rigoletto — Verdi
“Il mio tesoro” — Don Giovanni — Mozart
“Celeste Aida” — Aida — Verdi
“Lunge da lei… De’ miei bollenti spiriti” — La traviata — Verdi
“Come in quest’ora bruna” — Simon Boccanegra — Verdi
“Las hijas del Zebedeo” — zarzuela
`.trim().split('\n'),
    recital: `
“Ideale” — Tosti
“Musica proibita” — Gastaldon
“L’alba separa dalla luce l’ombra” — Tosti
“Sole e amore” — Puccini
“La danza” — Rossini
“O del mio amato ben” — Donaudy
“Mattinata” — Leoncavallo
“Ombra mai fu” — Händel
Schumann — Dichterliebe, op. 48 (complete cycle)
“Der verdienstvolle Sylvius” — Haydn
“Als einst mit Weibes Schönheit” — Haydn
“O tuneful voice” — Haydn
“Fidelity” — Haydn
“Die ihr des unermesslichen Weltalls Schöpfer ehrt” — Mozart
“Das Lied der Trennung” — Mozart
“Abendempfindung” — Mozart
“Lied zur Gesellenreise” — Mozart
“An Chloë” — Mozart
“Adelaide” — Beethoven
“An die Hoffnung” — Beethoven
“Hoffnung” — Beethoven
“Lied eines Schiffers an Dioskuren” — Schubert
“An Sylvia” — Schubert
“Im Abendrot” — Schubert
“Heidenröslein” — Schubert
“Du bist die Ruh” — Schubert
“Ständchen” — Schubert
“Erlkönig” — Schubert
“Ty pomnish li vecher” — Rachmaninov
“V molchan’i nochi taynoy / In the silence of the night” — Rachmaninov
“Zdes’ khorosho” — Rachmaninov
“Kak svetla, kak naryadna vesna” — Rachmaninov
“Ne poy, krasavitsa, pri mne” — Rachmaninov
“Vesennie vody” — Rachmaninov
“Allerseelen” — Richard Strauss
“Ich trage meine Minne” — Richard Strauss
“Du meines Herzens Krönelein” — Richard Strauss
“Morgen” — Richard Strauss
“Zueignung” — Richard Strauss
Liszt — Tre sonetti di Petrarca
“La canción del carretero” — Carlos López Buchardo
“Mi viña de Chapanay” — Guastavino
“En los surcos del amor” — Guastavino
“Se equivocó la paloma” — Guastavino
“Desde que te conocí” — Guastavino
“Piececitos” — Guastavino
“La rosa y el sauce” — Guastavino
“La canción al árbol del olvido” — Ginastera
Ginastera — Cinco canciones populares argentinas
“La tempranera” — Guastavino
“Bailecito” — Guastavino
“Coplas del curro dulce” — Obradors
“Coplas” — Luzzatti
`.trim().split('\n'),
    tango: `
“Por una cabeza” — Carlos Gardel
“Gricel” — Mariano Mores
“Volver” — Carlos Gardel
“Oblivion” — Astor Piazzolla
“Cristal” — Mariano Mores
“El día que me quieras” — Carlos Gardel
`.trim().split('\n'),
    popular: `
“La Paloma” — Sebastián Iradier
“You’ll Never Walk Alone”
“Tonight” — Bernstein
“O sole mio” — Di Capua
“Summertime” — Gershwin
“Maria” — Bernstein
“O Holy Night”
“Stille Nacht”
`.trim().split('\n')
  },
  extraPieces: [
    {
      title: "La fleur que tu m'avais jetée",
      composer: 'Georges Bizet',
      work: 'Carmen',
      type: 'aria',
      language: 'FR',
      formations: ['Tenor + Piano'],
      tags: ['gala', 'borders'],
      readiness: 'ready'
    },
    {
      title: "Core 'ngrato",
      composer: 'Salvatore Cardillo',
      work: 'Canzone napoletana',
      type: 'canzone',
      language: 'IT',
      formations: ['Tenor + Piano'],
      tags: ['italian', 'encore'],
      readiness: 'ready'
    },
    {
      title: 'Granada',
      composer: 'Agustín Lara',
      work: 'Canción',
      type: 'song',
      language: 'ES',
      formations: ['Tenor + Piano'],
      tags: ['borders', 'encore'],
      readiness: 'ready'
    },
    {
      title: 'Caruso',
      composer: 'Lucio Dalla',
      work: 'Canzone',
      type: 'song',
      language: 'IT',
      formations: ['Voice + Piano'],
      tags: ['italian', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Quand on n’a que l’amour',
      composer: 'Jacques Brel',
      work: 'Chanson',
      type: 'song',
      language: 'FR',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Plaisir d’amour',
      composer: 'Jean-Paul-Égide Martini',
      work: 'Romance',
      type: 'song',
      language: 'FR',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'La vie en rose',
      composer: 'Louiguy',
      work: 'Chanson',
      type: 'song',
      language: 'FR',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Ne me quitte pas',
      composer: 'Jacques Brel',
      work: 'Chanson',
      type: 'song',
      language: 'FR',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Amapola',
      composer: 'Joseph Lacalle',
      work: 'Canción',
      type: 'song',
      language: 'ES',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Cielito lindo',
      composer: 'Quirino Mendoza y Cortés',
      work: 'Canción popular',
      type: 'song',
      language: 'ES',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Cu-cu-rru-cu-cu paloma',
      composer: 'Tomás Méndez',
      work: 'Canción',
      type: 'song',
      language: 'ES',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Dein ist mein ganzes Herz',
      composer: 'Franz Lehár',
      work: 'Das Land des Lächelns',
      type: 'operetta',
      language: 'DE',
      formations: ['Voice + Piano'],
      tags: ['operetta', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Freunde, das Leben ist lebenswert',
      composer: 'Franz Lehár',
      work: 'Giuditta',
      type: 'operetta',
      language: 'DE',
      formations: ['Voice + Piano'],
      tags: ['operetta', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Lippen schweigen',
      composer: 'Franz Lehár',
      work: 'Die lustige Witwe',
      type: 'duet',
      language: 'DE',
      formations: ['Voice(s) + Piano'],
      tags: ['operetta', 'duet', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm the duo casting before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Libiamo, ne’ lieti calici',
      composer: 'Giuseppe Verdi',
      work: 'La traviata',
      type: 'ensemble',
      language: 'IT',
      formations: ['Ensemble + Piano'],
      tags: ['gala', 'ensemble', 'italian'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm the available cast before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Mamma',
      composer: 'Cesare Andrea Bixio',
      work: 'Canzone',
      type: 'canzone',
      language: 'IT',
      formations: ['Voice + Piano'],
      tags: ['italian'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Es ist ein Ros’ entsprungen',
      composer: 'Michael Praetorius',
      work: 'Christmas song',
      type: 'sacred',
      language: 'DE',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Navidad',
      composer: 'Antoni Parera Fons',
      work: 'Christmas song',
      type: 'sacred',
      language: 'ES',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'La anunciación',
      composer: 'Ariel Ramírez',
      work: 'Navidad nuestra',
      type: 'sacred',
      language: 'ES',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'El Nacimiento',
      composer: 'Ariel Ramírez',
      work: 'Navidad nuestra',
      type: 'sacred',
      language: 'ES',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Away in a Manger',
      composer: 'Traditional',
      work: 'Christmas song',
      type: 'sacred',
      language: 'EN',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Gesù Bambino',
      composer: 'Pietro A. Yon',
      work: 'Christmas song',
      type: 'sacred',
      language: 'IT',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'italian'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'The Holy City',
      composer: 'Stephen Adams',
      work: 'Sacred song',
      type: 'sacred',
      language: 'EN',
      formations: ['Voice(s) + Piano'],
      tags: ['sacred', 'borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'The Little Drummer Boy',
      composer: 'Traditional',
      work: 'Christmas song',
      type: 'song',
      language: 'EN',
      formations: ['Voice(s) + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Imported from a multi-artist historical programme; confirm singer assignment before using publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Barcarolle',
      composer: 'Jacques Offenbach',
      work: 'Les contes d’Hoffmann',
      type: 'duet',
      language: 'FR',
      formations: ['Tenor + Soprano + Piano'],
      tags: ['borders', 'duet'],
      readiness: 'working',
      reviewNote: 'Historical house-concert listing should be reviewed before using this duet in a public programme offer.'
    },
    {
      title: 'Le spectre de la rose',
      composer: 'Hector Berlioz',
      work: 'Les nuits d’été',
      type: 'song',
      language: 'FR',
      formations: ['Tenor + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Historical house-concert listing does not explicitly confirm singer assignment; review before reusing.',
      excludeFromOffers: true
    },
    {
      title: 'In the silence of the secret night',
      composer: 'Sergei Rachmaninoff',
      work: 'Song / romance',
      type: 'lied',
      language: 'RU',
      formations: ['Tenor + Piano'],
      tags: ['lied', 'borders'],
      readiness: 'working',
      reviewNote: 'Historical house-concert listing should be reviewed before offering this item publicly.',
      excludeFromOffers: true
    },
    {
      title: 'Nacht und Träume',
      composer: 'Franz Schubert',
      work: 'Lied',
      type: 'lied',
      language: 'DE',
      formations: ['Tenor + Piano'],
      tags: ['lied', 'borders'],
      readiness: 'working',
      reviewNote: 'Historical house-concert listing does not explicitly confirm singer assignment; review before reusing.',
      excludeFromOffers: true
    },
    {
      title: 'In der Nacht',
      composer: 'Robert Schumann',
      work: 'Lied',
      type: 'lied',
      language: 'DE',
      formations: ['Tenor + Piano'],
      tags: ['lied', 'borders'],
      readiness: 'working',
      reviewNote: 'Historical house-concert listing does not explicitly confirm singer assignment; review before reusing.',
      excludeFromOffers: true
    },
    {
      title: 'Song to the moon',
      composer: 'Antonín Dvořák',
      work: 'Rusalka',
      type: 'aria',
      language: 'CS',
      formations: ['Voice + Piano'],
      tags: ['borders'],
      readiness: 'working',
      reviewNote: 'Historical house-concert listing suggests soprano repertoire; keep for archive value and review before reuse.',
      excludeFromOffers: true
    },
    {
      title: 'Tonight, tonight',
      composer: 'Leonard Bernstein',
      work: 'West Side Story',
      type: 'duet',
      language: 'EN',
      formations: ['Tenor + Soprano + Piano'],
      tags: ['borders', 'duet'],
      readiness: 'ready'
    },
    {
      title: 'Je suis Escamillo',
      composer: 'Georges Bizet',
      work: 'Carmen',
      type: 'ensemble',
      language: 'FR',
      formations: ['Baritone + Piano'],
      tags: ['gala', 'ensemble'],
      readiness: 'ready',
      reviewNote: 'Collaborator feature imported for concert-history context; hidden from programme offers by default.',
      excludeFromOffers: true
    },
    {
      title: 'Intermezzo',
      composer: 'Pietro Mascagni',
      work: 'Cavalleria Rusticana',
      type: 'piano-solo',
      language: '',
      formations: ['Piano solo'],
      tags: ['interlude'],
      readiness: 'ready',
      excludeFromOffers: true
    },
    {
      title: 'Entr’acte Act II',
      composer: 'Georges Bizet',
      work: 'Carmen',
      type: 'piano-solo',
      language: '',
      formations: ['Piano solo'],
      tags: ['interlude'],
      readiness: 'ready',
      excludeFromOffers: true
    },
    {
      title: 'Prelude Act III',
      composer: 'Giuseppe Verdi',
      work: 'La traviata',
      type: 'piano-solo',
      language: '',
      formations: ['Piano solo'],
      tags: ['interlude'],
      readiness: 'ready',
      excludeFromOffers: true
    }
  ],
  concerts: [
    {
      id: '2026_pasiones_del_sur_mannheim',
      year: 2026,
      title: 'Pasiones del Sur',
      format: 'Mixed concert programme / opera and songs from the South',
      collaborators: ['Hong Yu Chen – baritone', 'Anna Anstett – piano'],
      programmeItems: [
        'Una furtiva lagrima',
        'O Mimì, tu più non torni',
        "La fleur que tu m'avais jetée",
        "Dio, che nell'alma infondere",
        "Core 'ngrato",
        'Granada',
        'Gricel',
        'El día que me quieras',
        'Por una cabeza'
      ],
      notes: 'Imported from “Pasiones del Sur mit Zwischenreden”. Full concert also included baritone solo repertoire and non-Latin song material preserved conceptually in the source file.',
      sourceType: 'historical_manual_import'
    },
    {
      id: '2025_frenemies',
      year: 2025,
      title: 'Frenemies',
      format: 'Opera duets and male friendship/rivalry concert',
      collaborators: ['Stephen (surname not captured in source) – baritone/host', 'Matt Long – piano'],
      programmeItems: [
        'All’idea di quel metallo',
        'Venti scudi',
        'Intermezzo',
        'O Mimì, tu più non torni',
        'Dio, che nell’alma infondere',
        'Entr’acte Act II',
        'Je suis Escamillo',
        'Ashton, tra queste mura',
        'Prelude Act III',
        'Solenne in quest’ora',
        'Au fond du temple saint'
      ],
      notes: 'Imported from “FRENEMIES - Revised Introductions.txt”. Collaborator surname for Stephen was not present in the source and should be completed manually if needed.',
      sourceType: 'historical_manual_import'
    },
    {
      id: '2023_in_the_silence_of_the_secret_night',
      year: 2023,
      title: 'In the silence of the secret night',
      format: 'House concert / recital',
      collaborators: ['Chantale Nurse – soprano', 'Matt Long – piano'],
      programmeItems: [
        'Barcarolle',
        "L'alba separa dalla luce l'ombra",
        'Le spectre de la rose',
        'In the silence of the secret night',
        'Nacht und Träume',
        'In der Nacht',
        'Der Erlkönig',
        'Song to the moon',
        'Ah! lève-toi, soleil!',
        "Come in quest'ora bruna",
        'E lucevan le stelle',
        'O soave fanciulla',
        'Tonight, tonight'
      ],
      notes: 'Imported from “Programm Hauskonzert In the silence of the secret night”. Some assignments between soprano and tenor should be reviewed before reusing individual items in offers.',
      sourceType: 'historical_manual_import'
    },
    {
      id: '2021_liebe_und_hoffnung',
      year: 2021,
      title: 'Liebe und Hoffnung',
      format: 'Cross-genre concert programme',
      collaborators: [],
      programmeItems: [
        'Habanera',
        'Una furtiva lagrima',
        'O mio babbino caro',
        'Dein ist mein ganzes Herz',
        'Lippen schweigen',
        'You’ll Never Walk Alone',
        'Freunde, das Leben ist lebenswert',
        'Meine Lippen',
        'Tonight',
        'O sole mio',
        'Libiamo, ne’ lieti calici',
        'Summertime',
        'Maria',
        'O soave fanciulla'
      ],
      notes: 'Imported from “Programm Liebe und Hoffnung.docx”. Year inferred from file metadata (2021). The source does not list collaborators or voice assignments, so solo ownership should be reviewed before reusing individual items in offers.',
      sourceType: 'historical_manual_import'
    },
    {
      id: '2020_abendempfindung',
      year: 2020,
      title: 'Abendempfindung',
      format: 'Concert for consolation in mourning / multilingual song evening',
      collaborators: ['Mads Elung-Jensen – tenor', 'Daniel Wendler – baritone & guitar', 'Matt Long – piano'],
      programmeItems: [
        'Quand on n’a que l’amour',
        'Ideale',
        'Zorongo',
        'Plaisir d’amour',
        'Caruso',
        'Piensa en mí',
        'La vie en rose',
        'Serenata',
        'Cu-cu-rru-cu-cu paloma',
        'Core \'ngrato',
        'Ne me quitte pas',
        'Amapola',
        'Princesita',
        'L’Hymne à l’amour',
        'Die Capri-Fischer'
      ],
      notes: 'Imported from “Abendempfindung Programm 13. September”. The programme was shared across multiple singers, so individual assignments should be reviewed before reusing specific items in offers.',
      sourceType: 'historical_manual_import'
    },
    {
      id: '2020_sikken_fest_literaturhaus',
      year: 2020,
      title: 'Sikken fest! Julekabaret med Die Goldvögel',
      format: 'Christmas cabaret / mixed programme',
      collaborators: ['Mads Elung-Jensen – tenor', 'Daniel Wendler – baritone & guitar', 'Matt Long – piano'],
      programmeItems: [
        'Es ist ein Ros’ entsprungen',
        'Navidad',
        'La anunciación',
        'El Nacimiento',
        'El día que me quieras',
        'Por una cabeza',
        'Away in a Manger',
        'Gesù Bambino',
        'The Holy City',
        'Mattinata',
        'Mamma',
        'The Little Drummer Boy',
        'Cielito lindo',
        'O Holy Night'
      ],
      notes: 'Imported from “Sikken Fest LiteraturHaus dec 2020 program”. Ensemble and solo assignments should be reviewed before reusing individual items in offers.',
      sourceType: 'historical_manual_import'
    }
  ]
};

window.PROGRAM_BUILDER_OUTSIDE_REPERTOIRE = {
  sourceCompilationNote: 'Curated starter suggestions gathered from online aria, song, tango, and score reference sources.',
  items: [
    { title: 'Salut! demeure chaste et pure', composer: 'Charles Gounod', work: 'Faust', type: 'aria', category: 'aria', voiceCategory: 'tenor_aria', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'FR', approximateDurationMin: 5, durationMin: 5, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','borders'], fitTags: ['gala','borders','lyric_tenor'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Lyric tenor arias' },
    { title: 'Ah! mes amis, quel jour de fête!', composer: 'Gaetano Donizetti', work: 'La fille du régiment', type: 'aria', category: 'aria', voiceCategory: 'tenor_aria', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'FR', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','borders'], fitTags: ['gala','borders','lyric_tenor','bravura'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Lyric tenor arias' },
    { title: 'Je crois entendre encore', composer: 'Georges Bizet', work: 'Les pêcheurs de perles', type: 'aria', category: 'aria', voiceCategory: 'tenor_aria', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'FR', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','borders'], fitTags: ['gala','borders','lyric_tenor'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Lyric tenor arias' },
    { title: 'Spirto gentil', composer: 'Gaetano Donizetti', work: 'La favorita', type: 'aria', category: 'aria', voiceCategory: 'tenor_aria', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','italian'], fitTags: ['gala','italian','lyric_tenor'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Lyric tenor arias' },
    { title: 'Ah! si ben mio', composer: 'Giuseppe Verdi', work: 'Il trovatore', type: 'aria', category: 'aria', voiceCategory: 'tenor_aria', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','italian'], fitTags: ['gala','italian','verdi'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Lyric tenor arias' },

    { title: "Ton coeur n'a pas compris le mien", composer: 'Georges Bizet', work: 'Les pêcheurs de perles', type: 'duet', category: 'duet', voiceCategory: 'tenor_soprano_duet', primaryVoice: 'tenor', pairedVoices: ['soprano'], includesTenor: true, language: 'FR', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Soprano + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','duet','borders'], fitTags: ['gala','duet','borders'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Soprano duets' },
    { title: "Ô nuit d'amour", composer: 'Charles Gounod', work: 'Faust', type: 'duet', category: 'duet', voiceCategory: 'tenor_soprano_duet', primaryVoice: 'tenor', pairedVoices: ['soprano'], includesTenor: true, language: 'FR', approximateDurationMin: 5, durationMin: 5, formations: ['Tenor + Soprano + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','duet','borders'], fitTags: ['gala','duet','borders'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Soprano duets' },
    { title: "Depuis l'instant où dans mes bras", composer: 'Gaetano Donizetti', work: 'La fille du régiment', type: 'duet', category: 'duet', voiceCategory: 'tenor_soprano_duet', primaryVoice: 'tenor', pairedVoices: ['soprano'], includesTenor: true, language: 'FR', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Soprano + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','duet','borders'], fitTags: ['gala','duet','borders'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Soprano duets' },
    { title: 'Un dì felice, eterea', composer: 'Giuseppe Verdi', work: 'La traviata', type: 'duet', category: 'duet', voiceCategory: 'tenor_soprano_duet', primaryVoice: 'tenor', pairedVoices: ['soprano'], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Soprano + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','duet','italian'], fitTags: ['gala','duet','italian'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Soprano duets' },

    { title: "Meco all'altar di Venere", composer: 'Vincenzo Bellini', work: 'Norma', type: 'duet', category: 'duet', voiceCategory: 'tenor_mezzo_duet', primaryVoice: 'tenor', pairedVoices: ['mezzo'], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Mezzo + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','duet','italian'], fitTags: ['gala','duet','italian'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Mezzo duets' },
    { title: "Mal reggendo all'aspro assalto", composer: 'Giuseppe Verdi', work: 'Il trovatore', type: 'duet', category: 'duet', voiceCategory: 'tenor_mezzo_duet', primaryVoice: 'tenor', pairedVoices: ['mezzo'], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Mezzo + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['gala','duet','italian'], fitTags: ['gala','duet','italian','verdi'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Mezzo duets' },
    { title: 'Ai nostri monti ritorneremo', composer: 'Giuseppe Verdi', work: 'Il trovatore', type: 'duet', category: 'duet', voiceCategory: 'tenor_mezzo_duet', primaryVoice: 'tenor', pairedVoices: ['mezzo'], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Mezzo + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['duet','italian'], fitTags: ['gala','duet','italian','verdi'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Mezzo duets' },

    { title: 'Marcello. Finalmente!', composer: 'Giacomo Puccini', work: 'La Bohème', type: 'duet', category: 'duet', voiceCategory: 'tenor_baritone_duet', primaryVoice: 'tenor', pairedVoices: ['baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['duet','italian'], fitTags: ['gala','duet','italian'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Baritone duets' },
    { title: 'Le minaccie, i fieri accenti', composer: 'Gaetano Donizetti', work: 'Lucia di Lammermoor', type: 'duet', category: 'duet', voiceCategory: 'tenor_baritone_duet', primaryVoice: 'tenor', pairedVoices: ['baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['duet','italian'], fitTags: ['gala','duet','italian'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Tenor–Baritone duets' },

    { title: 'Mimì è tanto malata!', composer: 'Giacomo Puccini', work: 'La Bohème', type: 'ensemble', category: 'trio', voiceCategory: 'tenor_soprano_baritone_trio', primaryVoice: 'tenor', pairedVoices: ['soprano','baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Soprano + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['trio','italian'], fitTags: ['gala','trio','italian'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Trios with tenor' },
    { title: 'O mia vita!', composer: 'Giacomo Puccini', work: 'La Bohème', type: 'ensemble', category: 'trio', voiceCategory: 'tenor_soprano_baritone_trio', primaryVoice: 'tenor', pairedVoices: ['soprano','baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Soprano + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['trio','italian'], fitTags: ['gala','trio','italian'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Trios with tenor' },
    { title: "Anima mia, più dell'usato", composer: 'Giuseppe Verdi', work: 'Il trovatore', type: 'ensemble', category: 'trio', voiceCategory: 'tenor_soprano_baritone_trio', primaryVoice: 'tenor', pairedVoices: ['soprano','baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Soprano + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['trio','italian'], fitTags: ['gala','trio','italian','verdi'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Trios with tenor' },

    { title: "Bella figlia dell'amore", composer: 'Giuseppe Verdi', work: 'Rigoletto', type: 'ensemble', category: 'quartet', voiceCategory: 'quartet', primaryVoice: 'tenor', pairedVoices: ['soprano','mezzo','baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 5, durationMin: 5, formations: ['Tenor + Soprano + Mezzo + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['quartet','italian'], fitTags: ['gala','quartet','italian','verdi'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Quartets / ensembles' },
    { title: "Prima che d'altri vivere", composer: 'Giuseppe Verdi', work: 'Il trovatore', type: 'ensemble', category: 'quartet', voiceCategory: 'quartet', primaryVoice: 'tenor', pairedVoices: ['soprano','mezzo','baritone'], includesTenor: true, language: 'IT', approximateDurationMin: 5, durationMin: 5, formations: ['Tenor + Soprano + Mezzo + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['quartet','italian'], fitTags: ['gala','quartet','italian','verdi'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Quartets / ensembles' },
    { title: 'Mir ist so wunderbar', composer: 'Ludwig van Beethoven', work: 'Fidelio', type: 'ensemble', category: 'quartet', voiceCategory: 'quartet', primaryVoice: 'tenor', pairedVoices: ['soprano','baritone'], includesTenor: true, language: 'DE', approximateDurationMin: 5, durationMin: 5, formations: ['Tenor + Soprano + Soprano + Baritone + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['quartet','borders'], fitTags: ['quartet','borders'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Quartets / ensembles' },
    { title: "Arrêtez! c'est moi d'ordonner", composer: 'Georges Bizet', work: 'Les pêcheurs de perles', type: 'ensemble', category: 'quartet', voiceCategory: 'quartet', primaryVoice: 'tenor', pairedVoices: ['soprano','baritone'], includesTenor: true, language: 'FR', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Soprano + Baritone + Bass + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['quartet','borders'], fitTags: ['quartet','borders'], notes: 'Approx. duration; verify preferred cut and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Opera-Arias', suggestionGroup: 'Quartets / ensembles' },

    { title: 'Clair de lune', composer: 'Claude Debussy', work: 'Suite bergamasque', type: 'piano-solo', category: 'piano_solo', voiceCategory: 'piano_solo', primaryVoice: '', pairedVoices: [], includesTenor: false, language: 'FR', approximateDurationMin: 5, durationMin: 5, formations: ['Piano solo'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['interlude'], fitTags: ['piano_solo','interlude'], notes: 'Approx. duration; verify chosen piano edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'IMSLP', suggestionGroup: 'Piano solo' },
    { title: 'Liebestraum No. 3', composer: 'Franz Liszt', work: 'Liebesträume', type: 'piano-solo', category: 'piano_solo', voiceCategory: 'piano_solo', primaryVoice: '', pairedVoices: [], includesTenor: false, language: 'DE', approximateDurationMin: 5, durationMin: 5, formations: ['Piano solo'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['interlude'], fitTags: ['piano_solo','interlude'], notes: 'Approx. duration; verify chosen piano edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'IMSLP', suggestionGroup: 'Piano solo' },
    { title: 'Ständchen (Liszt transcription)', composer: 'Franz Schubert / Franz Liszt', work: 'Schwanengesang transcription', type: 'piano-solo', category: 'piano_solo', voiceCategory: 'piano_solo', primaryVoice: '', pairedVoices: [], includesTenor: false, language: 'DE', approximateDurationMin: 6, durationMin: 6, formations: ['Piano solo'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['interlude'], fitTags: ['piano_solo','interlude'], notes: 'Approx. duration; verify chosen piano edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'IMSLP', suggestionGroup: 'Piano solo' },

    { title: 'Widmung', composer: 'Robert Schumann', work: 'Myrthen, op. 25', type: 'lied', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'DE', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['lied','borders'], fitTags: ['art_song','german','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · German' },
    { title: 'Cäcilie', composer: 'Richard Strauss', work: 'Op. 27, no. 2', type: 'lied', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'DE', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['lied','borders'], fitTags: ['art_song','german','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · German' },
    { title: 'Verborgenheit', composer: 'Hugo Wolf', work: 'Mörike-Lieder', type: 'lied', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'DE', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['lied','borders'], fitTags: ['art_song','german','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · German' },

    { title: "L'ultima canzone", composer: 'Francesco Paolo Tosti', work: 'Romanza da salotto', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'IT', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','italian'], fitTags: ['art_song','italian'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · Italian' },
    { title: "Non t'amo più", composer: 'Francesco Paolo Tosti', work: 'Romanza da salotto', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'IT', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','italian'], fitTags: ['art_song','italian'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · Italian' },
    { title: 'Malìa', composer: 'Francesco Paolo Tosti', work: 'Romanza da salotto', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'IT', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','italian'], fitTags: ['art_song','italian'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · Italian' },

    { title: "Après un rêve", composer: 'Gabriel Fauré', work: 'Mélodies', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'FR', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','french','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · French' },
    { title: 'Mandoline', composer: 'Gabriel Fauré', work: 'Op. 58, no. 1', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'FR', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','french','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · French' },
    { title: 'Phidylé', composer: 'Henri Duparc', work: 'Mélodie', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'FR', approximateDurationMin: 5, durationMin: 5, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','french','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · French' },

    { title: "Love's Philosophy", composer: 'Roger Quilter', work: 'Op. 3, no. 1', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'EN', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','english','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · English' },
    { title: 'Silent Noon', composer: 'Ralph Vaughan Williams', work: 'The House of Life', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'EN', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','english','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · English' },
    { title: 'Come Ready and See Me', composer: 'Richard Hundley', work: 'Song', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'EN', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','english','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · English' },

    { title: 'Del cabello más sutil', composer: 'Fernando Obradors', work: 'Canciones clásicas españolas', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','spanish','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · Spanish' },
    { title: 'Al amor', composer: 'Fernando Obradors', work: 'Canciones clásicas españolas', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','spanish','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · Spanish' },
    { title: 'El majo discreto', composer: 'Fernando Obradors', work: 'Canciones clásicas españolas', type: 'song', category: 'art_song', voiceCategory: 'chamber_song', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 2, durationMin: 2, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['song','borders'], fitTags: ['art_song','spanish','borders'], notes: 'Approx. duration; verify preferred key and edition.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'LiederNet', suggestionGroup: 'Chamber songs with piano · Spanish' },

    { title: 'Mi Buenos Aires querido', composer: 'Carlos Gardel', work: 'Tango canción', type: 'tango', category: 'tango', voiceCategory: 'tango', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['tango'], fitTags: ['tango','argentine','borders'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Todo Tango', suggestionGroup: 'Argentine tango' },
    { title: 'Sus ojos se cerraron', composer: 'Carlos Gardel', work: 'Tango canción', type: 'tango', category: 'tango', voiceCategory: 'tango', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['tango'], fitTags: ['tango','argentine','borders'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Todo Tango', suggestionGroup: 'Argentine tango' },
    { title: 'Cuesta abajo', composer: 'Carlos Gardel', work: 'Tango canción', type: 'tango', category: 'tango', voiceCategory: 'tango', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['tango'], fitTags: ['tango','argentine','borders'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Todo Tango', suggestionGroup: 'Argentine tango' },
    { title: 'Lejana tierra mía', composer: 'Carlos Gardel', work: 'Tango canción', type: 'tango', category: 'tango', voiceCategory: 'tango', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['tango'], fitTags: ['tango','argentine','borders'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Todo Tango', suggestionGroup: 'Argentine tango' },
    { title: 'Naranjo en flor', composer: 'Virgilio Expósito', work: 'Tango canción', type: 'tango', category: 'tango', voiceCategory: 'tango', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 4, durationMin: 4, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['tango'], fitTags: ['tango','argentine','borders'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Todo Tango', suggestionGroup: 'Argentine tango' },
    { title: 'Malena', composer: 'Lucio Demare', work: 'Tango canción', type: 'tango', category: 'tango', voiceCategory: 'tango', primaryVoice: 'tenor', pairedVoices: [], includesTenor: true, language: 'ES', approximateDurationMin: 3, durationMin: 3, formations: ['Tenor + Piano'], readiness: 'idea', availabilityStatus: 'outside_repertoire', tags: ['tango'], fitTags: ['tango','argentine','borders'], notes: 'Approx. duration; verify preferred cut and key.', publicNotes: '', sortOrder: 0, performanceStatus: '', performedIn: [], reviewStatus: 'clean', excludeFromOffers: false, sourceGroup: 'Todo Tango', suggestionGroup: 'Argentine tango' }
  ]
};
