/**
 * Offline pdfmake generation — mirrors admin.html PDF helpers + definitions only
 * (payloads are fixtures approximating EN export). Run from repo root:
 *   node scripts/generate-export-pdfs.mjs
 */
import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const require = createRequire(path.join(root, 'package.json'));
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function exportPdfNormalizeText(str) {
  let s = String(str || '');
  try {
    s = s.normalize('NFC');
  } catch (e) {}
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u2060-\u2064\uFEFF\uFFFE\uFFFF]/g, '');
  s = s.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
  s = s.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '\u2013');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const RG_PDF_EN_ARTIST_SHEET_BIO =
  'Argentine-Italian lyric tenor Rolando Guy was born in Buenos Aires, where he studied at the National Conservatory and continued his training privately with distinguished teachers connected to Teatro Col\u00f3n. Based in Berlin since 2019, he has continued to refine his technique and expand his repertoire in Germany. His recent engagements include the role of Zweiter Fremder in Der Vetter aus Dingsda at Kammeroper Frankfurt in 2025 and Tamino in a children\u2019s production of Die Zauberfl\u00f6te with Opernwerkstatt am Rhein in 2023. He has also appeared as tenor soloist at the Apollosaal of the Staatsoper Unter den Linden in Berlin, performed with the ensemble Die Goldv\u00f6gel in Berlin and Copenhagen, and appeared as soloist with the Diplomatic Choir of Berlin at the Berliner Dom, the German Federal Foreign Office and Notre-Dame in Strasbourg.';

const RG_PDF_EN_DOSSIER_BIO =
  'Argentine-Italian lyric tenor Rolando Guy was born in Buenos Aires, where he studied at the National Conservatory and continued his musical development through private studies in voice, vocal technique and music theory with distinguished teachers in Argentina, including Luis Bragato, Dar\u00edo Schmunck and Garbis Adiamanian. He further developed his operatic repertoire with Dante Ranieri, Susana Cardonnet, Rozita Zozoulia and Marcelo Ayub. Earlier in his artistic development, he also received coaching from Jack Li Vigni in New York and from tenor Francesco Anile in Rome. In 2017, he participated in the Javier Camarena masterclass in Buenos Aires. Based in Berlin since 2019, he began his vocal work in Germany with Maestro Reiner Goldberg and later continued his development with Uwe Griem. He currently studies with Maestro Stephan von Cron Catalano, who is his principal artistic guide. His recent engagements include the role of Zweiter Fremder in Der Vetter aus Dingsda at Kammeroper Frankfurt in July 2025 under the musical direction of Stanislav Rosenberg, and Tamino in a children\u2019s production of Die Zauberfl\u00f6te with Opernwerkstatt am Rhein in 2023. In Buenos Aires, he has appeared in roles including Rodolfo, Nemorino, Ferrando, Tamino, Basilio, Gastone and Borsa. Alongside his stage work, Rolando Guy has developed an active concert profile in Berlin, Copenhagen and Strasbourg. He has performed with the ensemble Die Goldv\u00f6gel, appeared as soloist with the Diplomatic Choir of Berlin at the Berliner Dom, the German Federal Foreign Office and Notre-Dame in Strasbourg, and given Lied recitals featuring Schubert, Strauss, Rachmaninov and Liszt, often in collaboration with pianist Marcelo Ayub.';

const RG_PDF_INNER_W = 499;

function rgPdfKicker(text, marginTop, marginBottom) {
  const mt = typeof marginTop === 'number' ? marginTop : 14;
  const mb = typeof marginBottom === 'number' ? marginBottom : 7;
  return { text: exportPdfNormalizeText(String(text || '')).toUpperCase(), style: 'kicker', margin: [0, mt, 0, mb] };
}

function rgPdfBulletList(items, bottomMargin, opts) {
  opts = opts || {};
  const arr = (Array.isArray(items) ? items : []).map((x) => exportPdfNormalizeText(String(x || '').trim())).filter(Boolean);
  if (!arr.length) return { text: '' };
  const bm = typeof bottomMargin === 'number' ? bottomMargin : 11;
  return {
    ul: arr,
    margin: [typeof opts.marginLeft === 'number' ? opts.marginLeft : 4, 0, 0, bm],
    fontSize: typeof opts.fontSize === 'number' ? opts.fontSize : 9.2,
    lineHeight: typeof opts.lineHeight === 'number' ? opts.lineHeight : 1.38,
    color: '#242220',
    markerColor: '#52483d'
  };
}

function rgPdfRuleStrong() {
  return { canvas: [{ type: 'line', x1: 0, y1: 0, x2: RG_PDF_INNER_W, y2: 0, lineWidth: 0.48, lineColor: '#9a9288' }], margin: [0, 0, 0, 0] };
}

function rgPdfRuleSoft(margin) {
  const m = margin || [0, 0, 0, 0];
  return { canvas: [{ type: 'line', x1: 0, y1: 0, x2: RG_PDF_INNER_W, y2: 0, lineWidth: 0.22, lineColor: '#e0dbd5' }], margin: m };
}

function rgPdfHeaderColumns(payload, imageCol, bottomMarginAfter) {
  const nameStack = [
    { text: payload.name, style: 'hName', margin: [0, 0, 0, 7] },
    { text: payload.fach, style: 'fach', margin: payload.loc ? [0, 0, 0, 1] : [0, 0, 0, 0] }
  ];
  if (payload.loc) {
    nameStack.push({ text: payload.loc, style: 'loc', margin: [0, 4, 0, 0] });
  }
  const accentH = payload.loc ? 78 : 72;
  const accentCol = {
    width: 3,
    margin: [0, 4, 14, 0],
    canvas: [{ type: 'line', x1: 1.1, y1: 0, x2: 1.1, y2: accentH, lineWidth: 0.9, lineColor: '#5a5048' }]
  };
  const textCol = { width: '*', stack: nameStack };
  const cols = [accentCol, textCol];
  if (imageCol) cols.push(imageCol);
  const mb = typeof bottomMarginAfter === 'number' ? bottomMarginAfter : 12;
  return { columns: cols, columnGap: imageCol ? 14 : 0, margin: [0, 0, 0, mb] };
}

function rgPdfContactPanel(payload, compact) {
  compact = !!compact;
  const emailLbl = payload.contact.lblEmail;
  const webLbl = payload.contact.lblWebsite;
  const lblGap = compact ? 2 : 3;
  const emailGap = compact ? 3 : 10;
  const rows = [
    {
      stack: [
        { text: emailLbl.toUpperCase(), style: 'contactLbl', margin: [0, 0, 0, lblGap] },
        { text: payload.contact.email, style: 'contactVal', margin: [0, 0, 0, emailGap] }
      ]
    },
    {
      stack: [
        { text: webLbl.toUpperCase(), style: 'contactLbl', margin: [0, 0, 0, lblGap] },
        { text: String(payload.contact.website || ''), style: 'contactVal', margin: [0, 0, 0, 0] }
      ]
    }
  ];
  if (payload.contact.bookingLine) {
    const bl = { text: payload.contact.bookingLine, style: 'contactNote', margin: [0, compact ? 5 : 11, 0, 0] };
    if (compact) {
      bl.fontSize = 8.3;
      bl.lineHeight = 1.34;
    }
    rows.push(bl);
  }
  const inner = { stack: rows, margin: [0, 0, 0, 0] };
  return {
    table: {
      widths: ['*'],
      body: [[inner]]
    },
    layout: {
      hLineWidth: function () { return 0; },
      vLineWidth: function () { return 0; },
      paddingLeft: function () { return compact ? 12 : 16; },
      paddingRight: function () { return compact ? 12 : 16; },
      paddingTop: function () { return compact ? 5 : 11; },
      paddingBottom: function () { return compact ? 5 : 11; },
      fillColor: function () { return '#f6f2ec'; }
    },
    margin: [0, compact ? 0 : 2, 0, 0]
  };
}

const RG_PDFMAKE_STYLES = {
  hName: { fontSize: 24, bold: true, color: '#0c0b0a', letterSpacing: 0.42 },
  fach: { fontSize: 10.35, italics: true, color: '#38342f', bold: false, lineHeight: 1.36 },
  loc: { fontSize: 8.75, italics: true, color: '#5e5954', letterSpacing: 0.38, lineHeight: 1.28 },
  kicker: { fontSize: 7.2, bold: true, color: '#4a4643', characterSpacing: 2.28 },
  body: { fontSize: 9.35, color: '#1a1917', lineHeight: 1.48 },
  repLbl: { fontSize: 9.15, bold: true, color: '#2e2c29', margin: [0, 0, 0, 4], italics: false },
  progTitle: { fontSize: 10.15, bold: true, color: '#0f0e0d', margin: [0, 3, 0, 4], letterSpacing: 0.12 },
  progDesc: { fontSize: 9.1, color: '#3a3835', lineHeight: 1.46 },
  smallItal: { fontSize: 9, italics: true, color: '#56524e', lineHeight: 1.45 },
  contactNote: { fontSize: 8.85, italics: true, color: '#5c5854', lineHeight: 1.42 },
  calH2: { fontSize: 11.25, bold: true, color: '#121210', margin: [0, 10, 0, 14], characterSpacing: 0.6 },
  calDate: { fontSize: 9.05, bold: true, color: '#1e1e1c' },
  calMeta: { fontSize: 8.55, color: '#6a6560', lineHeight: 1.42 },
  foot: { fontSize: 8.55, italics: true, color: '#6e6a65', margin: [0, 14, 0, 0], lineHeight: 1.42 },
  contactLbl: { fontSize: 6.75, bold: true, color: '#6a6560', characterSpacing: 1.9 },
  contactVal: { fontSize: 9.15, color: '#1c1a18', lineHeight: 1.38 }
};

function buildArtistSheetPdfDefinition(payload) {
  const enSheet = payload.lang === 'en';
  const imgCol = payload.imageDataUrl && /^data:image\//i.test(String(payload.imageDataUrl))
    ? { width: 88, stack: [{ image: payload.imageDataUrl, width: 86, margin: [2, 4, 0, 0] }] }
    : null;
  const content = [
    rgPdfHeaderColumns(payload, imgCol, enSheet ? 8 : 11),
    Object.assign({}, rgPdfRuleStrong(), { margin: [0, 0, 0, enSheet ? 6 : 7] }),
    rgPdfKicker(payload.labels.bio, 0, enSheet ? 5 : 5),
    { text: payload.bioText, style: 'body', alignment: 'justify', margin: [0, 0, 0, enSheet ? 6 : 7] }
  ];
  if (payload.profileLines.length) {
    if (enSheet) {
      content.push(rgPdfRuleSoft([0, 0, 0, 1]));
      content.push(rgPdfKicker(payload.labels.profile, 3, 2));
      content.push(rgPdfBulletList(payload.profileLines, 3, { fontSize: 9, lineHeight: 1.3, marginLeft: 3 }));
    } else {
      content.push(rgPdfRuleSoft([0, 1, 0, 2]));
      content.push(rgPdfKicker(payload.labels.profile, 7, 4));
      content.push(rgPdfBulletList(payload.profileLines, 7));
    }
  }
  if (payload.operaLines.length || payload.ariaLines.length) {
    content.push(rgPdfKicker(payload.labels.rep, enSheet ? 6 : 8, enSheet ? 2 : 3));
    if (payload.operaLines.length && payload.ariaLines.length) {
      content.push({ text: payload.labels.repOpera, style: 'repLbl', margin: [0, 0, 0, enSheet ? 1 : 2] });
      content.push(rgPdfBulletList(payload.operaLines, enSheet ? 4 : 5));
      content.push({ text: payload.labels.repAria, style: 'repLbl', margin: [0, enSheet ? 2 : 4, 0, enSheet ? 1 : 2] });
      content.push(rgPdfBulletList(payload.ariaLines, enSheet ? 4 : 7));
    } else {
      content.push(rgPdfBulletList(payload.operaLines.length ? payload.operaLines : payload.ariaLines, enSheet ? 5 : 7));
    }
  }
  if (payload.programs.length) {
    content.push(rgPdfKicker(payload.labels.programs, enSheet ? 5 : 7, enSheet ? 2 : 3));
    const plines = payload.programs.map((p) => (p.blurb ? (p.title + ' \u2014 ' + p.blurb) : p.title));
    content.push(rgPdfBulletList(plines, enSheet ? 3 : 5));
  }
  content.push(Object.assign({}, rgPdfRuleSoft(), { margin: enSheet ? [0, 1, 0, 1] : [0, 4, 0, 4] }));
  content.push(rgPdfKicker(payload.labels.contact, 0, enSheet ? 1 : 3));
  content.push(rgPdfContactPanel(payload, enSheet));
  return {
    pageSize: 'A4',
    pageMargins: [48, 48, 52, 48],
    defaultStyle: { font: 'Roboto', fontSize: 9.35, color: '#1a1917', lineHeight: 1.38 },
    content,
    styles: RG_PDFMAKE_STYLES
  };
}

function buildDossierPdfDefinition(payload) {
  const imgCol = payload.imageDataUrl && /^data:image\//i.test(String(payload.imageDataUrl))
    ? { width: 94, stack: [{ image: payload.imageDataUrl, width: 92, margin: [2, 4, 0, 0] }] }
    : null;
  const p1 = [
    rgPdfHeaderColumns(payload, imgCol, 11),
    Object.assign({}, rgPdfRuleStrong(), { margin: [0, 0, 0, 9] }),
    rgPdfKicker(payload.labels.bio, 0, 7),
    { text: payload.bioText, style: 'body', alignment: 'justify', margin: [0, 0, 0, 10] }
  ];
  if (payload.profileLines.length) {
    p1.push(rgPdfRuleSoft([0, 2, 0, 3]));
    p1.push(rgPdfKicker(payload.labels.profile, 8, 5));
    p1.push(rgPdfBulletList(payload.profileLines, 8));
  }
  if (payload.repGroups.length) {
    p1.push(rgPdfKicker(payload.labels.rep, 10, 6));
    payload.repGroups.forEach((g, gi) => {
      p1.push({ text: g.label, style: 'repLbl', margin: [0, gi ? 5 : 2, 0, 3] });
      const isLast = gi === payload.repGroups.length - 1;
      p1.push(rgPdfBulletList(g.items, isLast ? 7 : 6));
    });
  }
  const p2 = [];
  if (payload.programs.length) {
    p2.push(rgPdfKicker(payload.labels.programs, 9, 7));
    payload.programs.forEach((pr, i) => {
      p2.push({ text: pr.title, style: 'progTitle', margin: [0, i ? 4 : 2, 0, 3] });
      if (pr.desc) p2.push({ text: pr.desc, style: 'progDesc', margin: [0, 0, 0, 7] });
    });
    p2.push(rgPdfRuleSoft([0, 3, 0, 3]));
  }
  if (payload.includeCalendarSection) {
    p2.push({ text: payload.labels.calTitle, style: 'calH2' });
    if (!payload.calendarRows.length) {
      p2.push({ text: payload.labels.calEmpty, style: 'progDesc', margin: [0, 0, 0, 10] });
    } else {
      payload.calendarRows.forEach((ev) => {
        const rightStack = [{ text: ev.titleCal, bold: true, fontSize: 10.05, color: '#171614', margin: [0, 0, 0, 4] }];
        if (ev.venue) rightStack.push({ text: ev.venue, style: 'calMeta', margin: [0, 0, 0, 4] });
        if (ev.detail) rightStack.push({ text: ev.detail, fontSize: 9.05, color: '#2c2c28', lineHeight: 1.44 });
        p2.push({
          columns: [
            { width: 76, stack: [{ text: ev.dayMonth, style: 'calDate' }, ev.timeTxt ? { text: ev.timeTxt, fontSize: 7.6, color: '#7a756f', margin: [0, 3, 0, 0] } : { text: '' }] },
            { width: '*', stack: rightStack }
          ],
          columnGap: 12,
          margin: [0, 0, 0, 12]
        });
      });
    }
  }
  p2.push(Object.assign({}, rgPdfRuleSoft(), { margin: [0, 7, 0, 8] }));
  p2.push(rgPdfKicker(payload.labels.contact, 0, 4));
  p2.push(rgPdfContactPanel(payload));
  if (payload.footnote) p2.push({ text: payload.footnote, style: 'foot' });
  const content = p1.concat([{ text: '', pageBreak: 'before' }]).concat(p2);
  return {
    pageSize: 'A4',
    pageMargins: [48, 48, 52, 48],
    defaultStyle: { font: 'Roboto', fontSize: 9.35, color: '#1a1917', lineHeight: 1.45 },
    content,
    styles: RG_PDFMAKE_STYLES
  };
}

function fixtureArtistSheetPayload() {
  return {
    lang: 'en',
    name: 'Rolando Guy',
    fach: exportPdfNormalizeText('Argentine-Italian Lyric Tenor based in Berlin'),
    loc: '',
    labels: {
      bio: 'Biography',
      profile: 'Artistic profile',
      rep: 'Selected repertoire',
      programs: 'Programs',
      contact: 'Contact',
      repOpera: 'Opera roles',
      repAria: 'Concert & gala arias'
    },
    bioText: exportPdfNormalizeText(RG_PDF_EN_ARTIST_SHEET_BIO),
    profileLines: [
      'Berlin-based lyric tenor with stage experience in opera, concert and Lieder.',
      'Recent work in operetta and Mozart, with a focus on clear Italianate line.'
    ],
    operaLines: [
      'Tamino — Die Zauberflöte',
      'Zweiter Fremder — Der Vetter aus Dingsda',
      'Tenor soloist — staged and concert repertoire'
    ],
    ariaLines: [
      'Mozart, Schubert and verismo concert selections',
      'Sacred and diplomatic-choir tenor solos'
    ],
    programs: [
      { title: 'Liederabend', blurb: 'Schubert, Strauss, Rachmaninov with piano.' },
      { title: 'Sacred & gala', blurb: 'Oratorio and gala programmes for choir and ensemble.' }
    ],
    contact: {
      email: 'rolandoguy@gmail.com',
      website: 'https://rolandoguy.com',
      bookingLine: 'For engagements and materials, please use the contacts above.',
      lblEmail: 'Email',
      lblWebsite: 'Website'
    },
    imageDataUrl: ''
  };
}

function fixtureDossierPayload() {
  return {
    lang: 'en',
    name: 'Rolando Guy',
    fach: exportPdfNormalizeText('Argentine-Italian Lyric Tenor based in Berlin'),
    loc: '',
    includeCalendarSection: false,
    labels: {
      bio: 'Biography',
      profile: 'Artistic profile',
      rep: 'Selected repertoire',
      programs: 'Programs',
      contact: 'Contact',
      calTitle: 'Upcoming engagements',
      calEmpty: '\u2014'
    },
    bioText: exportPdfNormalizeText(RG_PDF_EN_DOSSIER_BIO),
    profileLines: [
      'Lyric tenor with operatic, concert and recital experience.',
      'Training shaped by the conservatory tradition of Buenos Aires',
      'Continued development and concert work centered in Berlin.'
    ],
    repGroups: [
      {
        label: 'Opera & stage',
        items: ['Tamino — Die Zauberflöte', 'Zweiter Fremder — Der Vetter aus Dingsda', 'Tenor soloist — choir and staged works']
      },
      {
        label: 'Concert & sacred',
        items: ['Oratorio and mass tenor solos', 'Diplomatic choir and cathedral appearances', 'Gala and ensemble programmes']
      }
    ],
    programs: [
      { title: 'Mozart & bel canto portrait', desc: 'An evening centred on clarity of text, line and phrasing — a Mozart block with Italian concert selections.' },
      { title: 'Sacred tenor', desc: 'Masses, oratorio excerpts and motets for choir, cathedral or chamber formation.' },
      { title: 'Recital: Schubert to Strauss', desc: 'Lieder repertoire with piano; programme may be tailored to hall and season.' }
    ],
    calendarRows: [],
    contact: {
      email: 'rolandoguy@gmail.com',
      website: 'https://rolandoguy.com',
      bookingLine: 'Press kit, scores and trial recordings available on request.',
      lblEmail: 'Email',
      lblWebsite: 'Website'
    },
    footnote: 'Full repertoire list, reviews and media upon request.',
    imageDataUrl: ''
  };
}

function writePdf(filename, docDefinition) {
  return new Promise((resolve, reject) => {
    try {
      pdfMake.createPdf(docDefinition).getBuffer((buf) => {
        const out = path.join(root, filename);
        writeFileSync(out, buf);
        resolve(out);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function pageCountPy(file) {
  const script = 'import sys\nfrom pypdf import PdfReader\nprint(len(PdfReader(sys.argv[1]).pages))';
  const n = execFileSync('/usr/bin/python3', ['-c', script, file], { encoding: 'utf8' }).trim();
  return parseInt(n, 10);
}

await writePdf('RolandoGuy_ArtistSheet_EN.pdf', buildArtistSheetPdfDefinition(fixtureArtistSheetPayload()));
await writePdf('RolandoGuy_Dossier_EN.pdf', buildDossierPdfDefinition(fixtureDossierPayload()));

const sheetPages = pageCountPy(path.join(root, 'RolandoGuy_ArtistSheet_EN.pdf'));
const dossierPages = pageCountPy(path.join(root, 'RolandoGuy_Dossier_EN.pdf'));
console.log(JSON.stringify({ RolandoGuy_ArtistSheet_EN_pdf: sheetPages, RolandoGuy_Dossier_EN_pdf: dossierPages }));
