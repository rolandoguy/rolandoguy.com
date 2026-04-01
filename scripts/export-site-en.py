#!/usr/bin/env python3
"""
Generate v2/data/site-en.json from committed literals in index.html.
Falls back when Node is unavailable; logic matches scripts/export-site-en.mjs.

  python3 scripts/export-site-en.py

Requires: pip install hjson  (or: python3 -m pip install --user hjson)
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, datetime
from pathlib import Path

try:
    import hjson
except ImportError:
    print("Install hjson: python3 -m pip install --user hjson", file=sys.stderr)
    raise SystemExit(1)

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
OUT = ROOT / "v2" / "data" / "site-en.json"

FEATURED_YOUTUBE_ID = "uSyL6iWLtmA"
PAST_VENUE_BY_ID = {2: "Berlin · 20:00", 4: "Tango Loft Berlin · 20:00", 5: "Zwölf-Apostel-Kirche · Berlin · 16:00"}
ITALIC_PAST_TITLES = {"Der Vetter aus Dingsda"}
PINNED_MEDIA = {
    "iframeTitle": "Rolando Guy — Il lamento di Federico (Cilea, L’Arlesiana)",
    "composerDisplay": "Francesco Cilea",
    "context": (
        "Concert aria — excerpt from the Eva Marton International "
        "Singing Competition archive on YouTube."
    ),
    "moreVideoSubRest": {
        "wWmlrZ6BLK0": "G. Donizetti · tenor with orchestra",
        "zDgSZm9WvYc": "Verdi · gala excerpt",
    },
    "channelUrl": "https://www.youtube.com/@rolandoguytenor",
    "photos": [
        {
            "src": "../img/studio-1.jpg",
            "alt": "Rolando Guy, lyric tenor, studio portrait",
            "width": 900,
            "height": 1125,
            "caption": "Studio portrait",
        },
        {
            "src": "../img/studio-2.jpg",
            "alt": "Rolando Guy, tenor, press photo",
            "width": 900,
            "height": 1125,
            "caption": "Press portrait",
        },
        {
            "src": "../img/stage-1.jpg",
            "alt": "Rolando Guy singing on stage",
            "width": 1200,
            "height": 800,
            "caption": "On stage",
        },
        {
            "src": "../img/stage-2.jpg",
            "alt": "Rolando Guy performing in concert",
            "width": 1200,
            "height": 800,
            "caption": "Concert",
        },
    ],
}


def find_matching_end(src: str, open_pos: int, open_ch: str, close_ch: str) -> int:
    depth = 0
    i = open_pos
    state = "code"
    while i < len(src):
        c = src[i]
        n2 = src[i : i + 2]
        if state == "code":
            if n2 == "//":
                i += 2
                while i < len(src) and src[i] != "\n":
                    i += 1
                continue
            if n2 == "/*":
                state = "block"
                i += 2
                continue
            if c == "'":
                state = "squote"
                i += 1
                continue
            if c == '"':
                state = "dquote"
                i += 1
                continue
            if c == open_ch:
                depth += 1
            elif c == close_ch:
                depth -= 1
                if depth == 0:
                    return i
            i += 1
            continue
        if state == "squote":
            if c == "\\":
                i += 2
                continue
            if c == "'":
                state = "code"
            i += 1
            continue
        if state == "dquote":
            if c == "\\":
                i += 2
                continue
            if c == '"':
                state = "code"
            i += 1
            continue
        if state == "block":
            if src[i : i + 2] == "*/":
                state = "code"
                i += 2
                continue
            i += 1
            continue
    raise ValueError("unbalanced")


def extract_const_object(source: str, name: str):
    needle = f"const {name} = "
    pos = source.find(needle)
    if pos == -1:
        raise SystemExit(f"const {name} not found")
    i = pos + len(needle)
    while i < len(source) and source[i].isspace():
        i += 1
    open_ch = source[i]
    if open_ch not in "{[":
        raise SystemExit(f"Expected {{ or [ after {name}")
    close_ch = "}" if open_ch == "{" else "]"
    end = find_matching_end(source, i, open_ch, close_ch)
    literal = source[i : end + 1]
    return hjson.loads(literal)


def normalize_rep_cards(cards):
    return [
        {
            "role": c.get("role"),
            "opera": c.get("opera"),
            "composer": c.get("composer"),
            "lang": c.get("lang"),
            "status": c.get("status"),
            "cat": c.get("cat"),
        }
        for c in (cards or [])
    ]


def perf_sort_date(p):
    if p.get("sortDate"):
        return datetime.fromisoformat(str(p["sortDate"])).date()
    d_raw = p.get("day")
    mon = p.get("month") or "Jan 2099"
    if d_raw and d_raw != "TBA":
        s = f"{d_raw} {mon}"
    else:
        s = f"1 {mon}"
    for fmt in ("%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return date(2099,1,1)


def format_past_date_label(day, month):
    d = str(day or "").lstrip("0") or "0"
    m = str(month or "").strip()
    return f"{d} {m}".strip()


def upcoming_venue_line(p):
    v = (p.get("venue") or "").strip()
    c = (p.get("city") or "").strip()
    if v and c:
        return f"{v} · {c}"
    return v or c or ""


def past_venue_line(p):
    pid = p.get("id")
    if pid in PAST_VENUE_BY_ID:
        return PAST_VENUE_BY_ID[pid]
    v = (p.get("venue") or "").strip()
    c = (p.get("city") or "").strip()
    if v and c:
        return f"{v} · {c}"
    return v or c or ""


def normalize_upcoming_detail(s):
    return (
        s.replace(
            "Classical & Contemporary Opera · Tour",
            "Classical & contemporary opera · tour",
        )
        .replace("Classical & Contemporary Opera", "Classical & contemporary opera")
    )


def normalize_past_subtitle(s):
    return re.sub(r"Grief & Loss", "grief & loss", s)


def build_calendar(perfs):
    today = date.today()
    upcoming, past = [], []
    for p in perfs:
        d = perf_sort_date(p)
        (upcoming if d >= today else past).append(p)
    upcoming.sort(key=perf_sort_date)
    past.sort(key=lambda x: perf_sort_date(x), reverse=True)

    out_up = []
    for p in upcoming:
        day = p.get("day") or "TBA"
        out_up.append(
            {
                "dateDay": day,
                "dateAriaLabel": "Date to be announced"
                if (not day or day == "TBA")
                else "",
                "title": p.get("title") or "",
                "detail": normalize_upcoming_detail(p.get("detail") or ""),
                "venue": upcoming_venue_line(p),
            }
        )

    out_past = []
    for p in past:
        sd = p.get("sortDate") or ""
        row = {
            "datetime": str(sd)[:10] if sd else "",
            "dateLabel": format_past_date_label(p.get("day"), p.get("month")),
            "title": p.get("title") or "",
            "titleItalic": (p.get("title") or "").strip() in ITALIC_PAST_TITLES,
            "venue": past_venue_line(p),
        }
        detail = (p.get("detail") or "").strip()
        if detail and " · " in detail and not re.match(r"^\d{1,2}:\d{2}\s*·", detail):
            row["subtitle"] = normalize_past_subtitle(detail)
        out_past.append(row)

    return {"upcoming": out_up, "past": out_past}


def split_sub_italic_rest(sub, vid, extras):
    extra = extras.get(vid, "")
    s = sub or ""
    idx = s.find(" · ")
    if idx == -1:
        return {"subItalic": s.strip(), "subRest": extra}
    return {"subItalic": s[:idx].strip(), "subRest": extra or s[idx + 3 :].strip()}


def build_media(vid_section):
    videos = [v for v in (vid_section.get("videos") or []) if not v.get("hidden")]
    featured = next((v for v in videos if v.get("id") == FEATURED_YOUTUBE_ID), None) or (
        videos[0] if videos else None
    )
    if not featured:
        raise SystemExit("No videos in DEFAULTS.vid")
    sub = featured.get("sub") or ""
    work_title = sub.split(" · ")[0].strip()
    more = []
    for v in videos:
        if v.get("id") == FEATURED_YOUTUBE_ID:
            continue
        pr = split_sub_italic_rest(
            v.get("sub"), v.get("id"), PINNED_MEDIA["moreVideoSubRest"]
        )
        vid = v.get("id")
        more.append(
            {
                "title": v.get("title") or "",
                "subItalic": pr["subItalic"],
                "subRest": pr["subRest"],
                "watchUrl": f"https://www.youtube.com/watch?v={vid}",
            }
        )

    return {
        "featured": {
            "youtubeId": featured.get("id"),
            "iframeTitle": PINNED_MEDIA["iframeTitle"],
            "title": featured.get("title") or "",
            "workTitle": work_title,
            "composer": PINNED_MEDIA["composerDisplay"],
            "context": PINNED_MEDIA["context"],
        },
        "moreVideos": more,
        "channelUrl": PINNED_MEDIA["channelUrl"],
        "photos": PINNED_MEDIA["photos"],
    }


def split_production(production):
    p = (production or "").strip()
    parts = p.split(" · ")
    if len(parts) < 2:
        return {"productionWork": p, "productionSuffix": ""}
    return {"productionWork": parts[0], "productionSuffix": " · " + " · ".join(parts[1:])}


def pick_en_quote(p):
    qi = p.get("quotes_i18n") or {}
    en = (qi.get("en") or "").strip()
    if en:
        return en
    return (p.get("quote") or "").strip()


def build_quotes(default_press):
    rows = []
    for p in default_press:
        pi = p.get("production_i18n") or {}
        prod = (pi.get("en") or p.get("production") or "").strip()
        sp = split_production(prod)
        rows.append(
            {
                "text": pick_en_quote(p),
                "source": (p.get("source") or "").strip(),
                "productionWork": sp["productionWork"],
                "productionSuffix": sp["productionSuffix"],
                "sourceUrl": (p.get("url") or "").strip(),
            }
        )
    return rows


def en_bio150_to_chunks(b150):
    w1, w2 = "Der Vetter aus Dingsda", "Die Zauberflöte"
    i, j = b150.find(w1), b150.find(w2)
    if i == -1 or j == -1 or j < i:
        return b150
    return [b150[:i], {"em": w1}, b150[i + len(w1) : j], {"em": w2}, b150[j + len(w2) :]]


def build_press(default_press, press_meta, epk_bios, epk_cvs):
    en = (epk_bios.get("en") or {}) if isinstance(epk_bios.get("en"), dict) else {}
    en_meta = (press_meta.get("en") or {}) if isinstance(press_meta.get("en"), dict) else {}
    en_cv = (epk_cvs.get("EN") or {}) if isinstance(epk_cvs.get("EN"), dict) else {}
    b64 = (en_cv.get("b64") or "docs/RolandoGuy_CV_EN.pdf").lstrip("/")
    cv_href = f"../{b64}"

    return {
        "quotesNote": (en_meta.get("translatedNote") or "").strip(),
        "quotes": build_quotes(default_press),
        "materialsLede": (
            "Approved copy for listings and house programmes. For confirmed "
            "engagements, print-ready PDFs and additional languages can be sent directly."
        ),
        "bios": [
            {"label": "50-word bio", "body": (en.get("b50") or "").strip()},
            {"label": "150-word bio", "body": en_bio150_to_chunks((en.get("b150") or "").strip())},
        ],
        "assets": [
            {
                "name": "Curriculum vitae",
                "detail": "PDF · English",
                "download": {
                    "href": cv_href,
                    "filename": en_cv.get("filename") or "RolandoGuy_CV_EN.pdf",
                },
            },
            {
                "name": "Press dossier",
                "detail": "Print-oriented pack — updated for presenters",
                "onRequest": True,
            },
            {
                "name": "One-page artist sheet",
                "detail": "House sheet / quick reference",
                "onRequest": True,
            },
            {
                "name": "Photography",
                "detail": (
                    "Official portraits and stage images — credit photographers as captioned"
                ),
                "link": {"href": "media.html", "label": "Media"},
            },
        ],
    }


def main():
    html = INDEX.read_text(encoding="utf-8")
    defaults = extract_const_object(html, "DEFAULTS")
    default_press = extract_const_object(html, "DEFAULT_PRESS")
    press_meta = extract_const_object(html, "DEFAULT_PRESS_META")
    epk_bios = extract_const_object(html, "EPK_BIOS")
    epk_cvs = extract_const_object(html, "EPK_CVS")

    site_en = {
        "repertoire": {"cards": normalize_rep_cards((defaults.get("rep") or {}).get("cards"))},
        "calendar": build_calendar(defaults.get("perfs") or []),
        "media": build_media(defaults.get("vid") or {}),
        "press": build_press(default_press, press_meta, epk_bios, epk_cvs),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(site_en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote", OUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
