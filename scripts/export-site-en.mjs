/**
 * Export v2/data/site-en.json from the committed v1 source in index.html:
 * DEFAULTS (repertoire, calendar perfs, videos), DEFAULT_PRESS, DEFAULT_PRESS_META,
 * EPK_BIOS (EN bios), EPK_CVS (CV path).
 *
 * Does not hit Firestore. Run from the repository root:
 *   node scripts/export-site-en.mjs
 *
 * See scripts/README-export.md for pinned vs extracted fields.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const OUT = path.join(ROOT, "v2", "data", "site-en.json");

// ---- extract const NAME = { ... } or [ ... ] from index.html (strings + // + /* */ aware)

function findMatchingEnd(src, openPos, openCh, closeCh) {
  let depth = 0;
  let i = openPos;
  let state = "code";

  while (i < src.length) {
    const c = src[i];
    const next2 = src.slice(i, i + 2);

    if (state === "code") {
      if (next2 === "//") {
        i += 2;
        while (i < src.length && src[i] !== "\n") i++;
        continue;
      }
      if (next2 === "/*") {
        state = "block";
        i += 2;
        continue;
      }
      if (c === "'") {
        state = "squote";
        i++;
        continue;
      }
      if (c === '"') {
        state = "dquote";
        i++;
        continue;
      }
      if (c === openCh) depth++;
      else if (c === closeCh) {
        depth--;
        if (depth === 0) return i;
      }
      i++;
      continue;
    }

    if (state === "squote") {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === "'") state = "code";
      i++;
      continue;
    }

    if (state === "dquote") {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === '"') state = "code";
      i++;
      continue;
    }

    if (state === "block") {
      if (next2 === "*/") {
        state = "code";
        i += 2;
        continue;
      }
      i++;
      continue;
    }
  }

  throw new Error("Unbalanced bracket while extracting");
}

function extractConst(source, name) {
  const needle = `const ${name} = `;
  const pos = source.indexOf(needle);
  if (pos === -1) throw new Error(`const ${name} = not found in index.html`);

  let i = pos + needle.length;
  while (/\s/.test(source[i])) i++;

  const open = source[i];
  if (open !== "{" && open !== "[") {
    throw new Error(`Expected { or [ after const ${name}`);
  }
  const close = open === "{" ? "}" : "]";
  const end = findMatchingEnd(source, i, open, close);
  const literal = source.slice(i, end + 1);

  try {
    return new Function(`"use strict"; return (${literal})`)();
  } catch (e) {
    throw new Error(`Failed to parse ${name}: ${e.message}`);
  }
}

// ---- calendar (same date logic as v1 getPerfs / render)

function perfSortDate(p) {
  if (p.sortDate) return new Date(p.sortDate);
  const str =
    (p.day && p.day !== "TBA" ? p.day + " " : "1 ") + (p.month || "Jan 2099");
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date("2099-01-01") : d;
}

function formatPastDateLabel(day, month) {
  const d = String(day || "").replace(/^0+/, "") || "0";
  const m = String(month || "").trim();
  if (!m) return "";
  return `${d} ${m}`.trim();
}

/** Matches current v2 copy for known rows (v1 detail/venue shapes vary). */
const PAST_VENUE_BY_ID = {
  2: "Berlin · 20:00",
  4: "Tango Loft Berlin · 20:00",
  5: "Zwölf-Apostel-Kirche · Berlin · 16:00",
};

function upcomingVenueLine(p) {
  const venue = (p.venue || "").trim();
  const city = (p.city || "").trim();
  if (venue && city) return `${venue} · ${city}`;
  return venue || city || "";
}

function pastVenueLine(p) {
  if (PAST_VENUE_BY_ID[p.id] != null) return PAST_VENUE_BY_ID[p.id];
  const venue = (p.venue || "").trim();
  const city = (p.city || "").trim();
  if (venue && city) return `${venue} · ${city}`;
  return venue || city || "";
}

const ITALIC_PAST_TITLES = new Set(["Der Vetter aus Dingsda"]);

function buildCalendar(perfs) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = [];
  const past = [];

  perfs.forEach((p) => {
    const d = perfSortDate(p);
    if (d >= today) upcoming.push(p);
    else past.push(p);
  });

  upcoming.sort((a, b) => perfSortDate(a) - perfSortDate(b));
  past.sort((a, b) => perfSortDate(b) - perfSortDate(a));

  return {
    upcoming: upcoming.map((p) => ({
      dateDay: p.day || "TBA",
      dateAriaLabel:
        !p.day || p.day === "TBA" ? "Date to be announced" : "",
      title: p.title || "",
      detail: normalizeUpcomingDetail(p.detail || ""),
      venue: upcomingVenueLine(p),
    })),
    past: past.map((p) => {
      const row = {
        datetime: p.sortDate ? String(p.sortDate).slice(0, 10) : "",
        dateLabel: formatPastDateLabel(p.day, p.month),
        title: p.title || "",
        titleItalic: ITALIC_PAST_TITLES.has((p.title || "").trim()),
        venue: pastVenueLine(p),
      };
      const detail = (p.detail || "").trim();
      if (
        detail &&
        detail.indexOf(" · ") !== -1 &&
        !/^(\d{1,2}:\d{2})\s*·/.test(detail)
      ) {
        row.subtitle = normalizePastSubtitle(detail);
      }
      return row;
    }),
  };
}

function normalizeUpcomingDetail(s) {
  return s
    .replace(
      "Classical & Contemporary Opera · Tour",
      "Classical & contemporary opera · tour"
    )
    .replace(
      "Classical & Contemporary Opera",
      "Classical & contemporary opera"
    );
}

function normalizePastSubtitle(s) {
  return s.replace(/Grief & Loss/g, "grief & loss");
}

// ---- media (DEFAULTS.vid + pinned presentation)

const FEATURED_YOUTUBE_ID = "uSyL6iWLtmA";
const PINNED_MEDIA = {
  featured: {
    iframeTitle:
      "Rolando Guy — Il lamento di Federico (Cilea, L’Arlesiana)",
    composerDisplay: "Francesco Cilea",
    context:
      "Concert aria — excerpt from the Eva Marton International Singing Competition archive on YouTube.",
  },
  moreVideoSubRest: {
    wWmlrZ6BLK0: "G. Donizetti · tenor with orchestra",
    zDgSZm9WvYc: "Verdi · gala excerpt",
  },
  channelUrl: "https://www.youtube.com/@rolandoguytenor",
  photos: [
    {
      src: "../img/studio-1.jpg",
      alt: "Rolando Guy, lyric tenor, studio portrait",
      width: 900,
      height: 1125,
      caption: "Studio portrait",
    },
    {
      src: "../img/studio-2.jpg",
      alt: "Rolando Guy, tenor, press photo",
      width: 900,
      height: 1125,
      caption: "Press portrait",
    },
    {
      src: "../img/stage-1.jpg",
      alt: "Rolando Guy singing on stage",
      width: 1200,
      height: 800,
      caption: "On stage",
    },
    {
      src: "../img/stage-2.jpg",
      alt: "Rolando Guy performing in concert",
      width: 1200,
      height: 800,
      caption: "Concert",
    },
  ],
};

function splitSubItalicRest(sub, id, moreVideoSubRest) {
  const extra = moreVideoSubRest[id] || "";
  const s = sub || "";
  const idx = s.indexOf(" · ");
  if (idx === -1) {
    return { subItalic: s.trim(), subRest: extra };
  }
  return {
    subItalic: s.slice(0, idx).trim(),
    subRest: extra || s.slice(idx + 3).trim(),
  };
}

function buildMedia(vid) {
  const videos = (vid.videos || []).filter((v) => !v.hidden);
  const featured = videos.find((v) => v.id === FEATURED_YOUTUBE_ID) || videos[0];
  if (!featured) {
    throw new Error("No videos in DEFAULTS.vid");
  }
  const workTitle = (featured.sub || "").split(" · ")[0].trim();
  const moreIds = new Set([FEATURED_YOUTUBE_ID]);
  const moreVideos = videos
    .filter((v) => !moreIds.has(v.id))
    .map((v) => {
      const { subItalic, subRest } = splitSubItalicRest(
        v.sub,
        v.id,
        PINNED_MEDIA.moreVideoSubRest
      );
      return {
        title: v.title || "",
        subItalic,
        subRest,
        watchUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}`,
      };
    });

  return {
    featured: {
      youtubeId: featured.id,
      iframeTitle: PINNED_MEDIA.featured.iframeTitle,
      title: featured.title || "",
      workTitle: workTitle || "",
      composer: PINNED_MEDIA.featured.composerDisplay,
      context: PINNED_MEDIA.featured.context,
    },
    moreVideos,
    channelUrl: PINNED_MEDIA.channelUrl,
    photos: PINNED_MEDIA.photos,
  };
}

// ---- press

function splitProduction(production) {
  const p = (production || "").trim();
  const parts = p.split(" · ");
  if (parts.length < 2) {
    return { productionWork: p, productionSuffix: "" };
  }
  return {
    productionWork: parts[0],
    productionSuffix: " · " + parts.slice(1).join(" · "),
  };
}

function pickEnQuote(p) {
  const qi = p.quotes_i18n || {};
  return (typeof qi.en === "string" && qi.en.trim()
    ? qi.en
    : p.quote || ""
  ).trim();
}

function buildQuotes(defaultPress) {
  return defaultPress.map((p) => {
    const prod =
      (p.production_i18n && p.production_i18n.en) || p.production || "";
    const { productionWork, productionSuffix } = splitProduction(prod);
    return {
      text: pickEnQuote(p),
      source: (p.source || "").trim(),
      productionWork,
      productionSuffix,
      sourceUrl: (p.url || "").trim(),
    };
  });
}

function enBio150ToChunks(b150) {
  const w1 = "Der Vetter aus Dingsda";
  const w2 = "Die Zauberflöte";
  const i = b150.indexOf(w1);
  const j = b150.indexOf(w2);
  if (i === -1 || j === -1 || j < i) {
    return b150;
  }
  return [
    b150.slice(0, i),
    { em: w1 },
    b150.slice(i + w1.length, j),
    { em: w2 },
    b150.slice(j + w2.length),
  ];
}

function buildPress(defaultPress, pressMeta, epkBios, epkCvs) {
  const enMeta = (pressMeta && pressMeta.en) || {};
  const enBios = (epkBios && epkBios.en) || {};
  const cv = (epkCvs && epkCvs.EN) || {};
  const cvPath = (cv.b64 || "docs/RolandoGuy_CV_EN.pdf").replace(/^\/?/, "");
  const cvHref = `../${cvPath}`;

  return {
    quotesNote: (enMeta.translatedNote || "").trim(),
    quotes: buildQuotes(defaultPress),
    materialsLede:
      "Approved copy for listings and house programmes. For confirmed engagements, print-ready PDFs and additional languages can be sent directly.",
    bios: [
      {
        label: "50-word bio",
        body: (enBios.b50 || "").trim(),
      },
      {
        label: "150-word bio",
        body: enBio150ToChunks((enBios.b150 || "").trim()),
      },
    ],
    assets: [
      {
        name: "Curriculum vitae",
        detail: "PDF · English",
        download: {
          href: cvHref,
          filename: cv.filename || "RolandoGuy_CV_EN.pdf",
        },
      },
      {
        name: "Press dossier",
        detail: "Print-oriented pack — updated for presenters",
        onRequest: true,
      },
      {
        name: "One-page artist sheet",
        detail: "House sheet / quick reference",
        onRequest: true,
      },
      {
        name: "Photography",
        detail:
          "Official portraits and stage images — credit photographers as captioned",
        link: { href: "media.html", label: "Media" },
      },
    ],
  };
}

// ---- main

const source = fs.readFileSync(INDEX, "utf8");

const DEFAULTS = extractConst(source, "DEFAULTS");
const DEFAULT_PRESS = extractConst(source, "DEFAULT_PRESS");
const DEFAULT_PRESS_META = extractConst(source, "DEFAULT_PRESS_META");
const EPK_BIOS = extractConst(source, "EPK_BIOS");
const EPK_CVS = extractConst(source, "EPK_CVS");

function normalizeRepCards(cards) {
  return (cards || []).map((c) => ({
    role: c.role,
    opera: c.opera,
    composer: c.composer,
    lang: c.lang,
    status: c.status,
    cat: c.cat,
  }));
}

const siteEn = {
  repertoire: {
    cards: normalizeRepCards(DEFAULTS.rep && DEFAULTS.rep.cards),
  },
  calendar: buildCalendar(DEFAULTS.perfs || []),
  media: buildMedia(DEFAULTS.vid || { videos: [] }),
  press: buildPress(
    DEFAULT_PRESS,
    DEFAULT_PRESS_META,
    EPK_BIOS,
    EPK_CVS
  ),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(siteEn, null, 2) + "\n", "utf8");

console.log("Wrote", path.relative(ROOT, OUT));
