#!/usr/bin/env python3
"""Ad Library research helper for the AI Ad Copywriter.

Turns ads copied from the public Meta Ad Library website into a clean,
ranked swipe file (the "corpus") that the copywriter studies before it writes.

Standard library only. Works with Python 3.8 or newer on Mac, Windows and Linux.

Commands
  links "query" ["query" ...]   print Ad Library search links to open in a browser
  parse FILE [--query "..."]    structure text copied from an Ad Library page
  add FILE                      add ads the AI wrote down by hand (JSON lines)
  advertisers                   list the advertisers found so far, ranked
  build                         merge everything into corpus/ads.jsonl + CORPUS.md
  stats                         print copy statistics for the corpus

Run any command with -h for its options.
"""

import argparse
import datetime as dt
import json
import math
import os
import re
import statistics
import sys
import urllib.parse
from collections import Counter, OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_WORKSPACE = os.path.join(ROOT, "workspace")
AD_LIBRARY = "https://www.facebook.com/ads/library/"
PROVEN_DAYS = 30

CTA_LABELS = [
    "Apply now", "Book now", "Buy now", "Buy tickets", "Call now", "Contact us",
    "Donate now", "Download", "Get access", "Get directions", "Get offer",
    "Get promotions", "Get quote", "Get showtimes", "Get started", "Get updates",
    "Inquire now", "Install now", "Install app", "Join group", "Learn more",
    "Like page", "Listen now", "Open link", "Order now", "Play game",
    "Register now", "Request time", "See details", "See menu", "See more",
    "Send message", "Send WhatsApp message", "Shop now", "Sign up", "Start order",
    "Subscribe", "Try in camera", "Use app", "View Instagram profile",
    "Watch more", "Watch video", "Join now", "Message", "Follow",
]
CTA_SET = {c.lower() for c in CTA_LABELS}

NOISE_PATTERNS = [
    r"^active$", r"^inactive$", r"^platforms?$", r"^open drop-?down$",
    r"^see ad details$", r"^see summary details$", r"^ad details$",
    r"^this ad has multiple versions$", r"^sponsored$", r"^eu transparency$",
    r"^low impression count$", r"^total active time.*$", r"^\d+:\d+\s*/\s*\d+:\d+$",
    r"^\d+ ads? use(s)? this creative and text\.?$", r"^about this ad$",
    r"^see more$", r"^\.\.\.$", r"^…$",
]
NOISE_RE = [re.compile(p, re.I) for p in NOISE_PATTERNS]
DOMAIN_RE = re.compile(r"^(?:https?://)?(?:www\.)?[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:/\S*)?$", re.I)
LIBRARY_ID_RE = re.compile(r"^library id:?\s*(\d{6,})", re.I)
STARTED_RE = re.compile(r"^started running on\s+(.+)$", re.I)
RANGE_RE = re.compile(r"^(.+?\d{4})\s*[-–]\s*(.+?\d{4})$")
VARIANTS_RE = re.compile(r"^(\d+)\s+ads?\s+use(?:s)?\s+this creative", re.I)
TEMPLATE_RE = re.compile(r"\{\{[^}]+\}\}")
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF☀-➿⭐✅❌]")

STOPWORDS = set("""a an the and or but if then so to of in on at for with from by as is are was were be been being
it its this that these those you your yours we our us i me my he she they them their his her not no yes do does did
have has had will would can could should just than too very more most all any some get got up out about into over
what which who how when where why there here also only own same such both each few other""".split())


# ---------------------------------------------------------------- helpers

def ensure_utf8_output():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


def ws_paths(workspace):
    corpus = os.path.join(workspace, "corpus")
    return {
        "workspace": workspace,
        "corpus": corpus,
        "raw": os.path.join(corpus, "raw"),
        "pasted": os.path.join(corpus, "pasted"),
        "ads": os.path.join(corpus, "ads.jsonl"),
        "corpus_md": os.path.join(corpus, "CORPUS.md"),
        "exclude": os.path.join(corpus, "exclude.txt"),
    }


def show(path):
    rel = os.path.relpath(path, ROOT)
    return path if rel.startswith("..") else rel


def slugify(text, limit=40):
    text = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").lower()).strip("-")
    return (text[:limit].strip("-")) or "ads"


def today():
    return dt.date.today()


def parse_date(text):
    text = (text or "").strip().rstrip(".")
    if not text:
        return None
    for fmt in ("%b %d, %Y", "%B %d, %Y", "%d %b %Y", "%d %B %Y", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
        try:
            return dt.datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    return None


def clean_text(text):
    if not text:
        return ""
    text = str(text).replace("\r\n", "\n").replace("\r", "\n")
    text = TEMPLATE_RE.sub("", text) if TEMPLATE_RE.fullmatch(text.strip()) else text
    lines = [ln.rstrip() for ln in text.split("\n")]
    out = "\n".join(lines).strip()
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out


def norm_key(text):
    return re.sub(r"[^a-z0-9]+", " ", (text or "").lower()).strip()


def write_jsonl(path, rows):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")


def read_jsonl(path):
    rows = []
    with open(path, encoding="utf-8") as f:
        for n, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError as e:
                print("  skipped line %d in %s: %s" % (n, os.path.basename(path), e))
    return rows


def load_raw(paths):
    rows = []
    if not os.path.isdir(paths["raw"]):
        return rows
    for name in sorted(os.listdir(paths["raw"])):
        if name.endswith(".jsonl"):
            rows.extend(read_jsonl(os.path.join(paths["raw"], name)))
    return rows


def load_excludes(paths):
    items = set()
    if os.path.exists(paths["exclude"]):
        with open(paths["exclude"], encoding="utf-8") as f:
            for line in f:
                line = line.split("#", 1)[0].strip()
                if line:
                    items.add(line.lower())
    return items


# ---------------------------------------------------------------- record model

def finalize(rec, source):
    """Fill derived fields so every record has the same shape."""
    out = OrderedDict()
    ad_id = str(rec.get("id") or rec.get("library_id") or "").strip()
    out["id"] = ad_id
    out["url"] = rec.get("url") or (AD_LIBRARY + "?id=" + ad_id if ad_id else "")
    out["page_name"] = clean_text(rec.get("page_name") or rec.get("advertiser") or "")
    out["primary_text"] = clean_text(rec.get("primary_text") or rec.get("body") or "")
    out["headline"] = clean_text(rec.get("headline") or rec.get("title") or "")
    out["description"] = clean_text(rec.get("description") or rec.get("link_description") or "")
    out["cta"] = clean_text(rec.get("cta") or "")
    out["domain"] = (rec.get("domain") or "").strip().lower()
    out["format"] = (rec.get("format") or "unknown").strip().lower()
    start = rec.get("start_date")
    end = rec.get("end_date")
    start_d = parse_date(start) if isinstance(start, str) else None
    end_d = parse_date(end) if isinstance(end, str) else None
    out["start_date"] = start_d.isoformat() if start_d else None
    out["end_date"] = end_d.isoformat() if end_d else None
    status = (rec.get("status") or ("inactive" if end_d else "active")).lower()
    out["status"] = status
    if start_d:
        stop = end_d or today()
        out["days_running"] = max(0, (stop - start_d).days)
    else:
        out["days_running"] = rec.get("days_running") if isinstance(rec.get("days_running"), int) else None
    try:
        out["variants"] = max(1, int(rec.get("variants") or 1))
    except (TypeError, ValueError):
        out["variants"] = 1
    out["cards"] = rec.get("cards") or []
    out["confidence"] = rec.get("confidence") or "ok"
    src = dict(source)
    if isinstance(rec.get("source"), dict):
        src.update({k: v for k, v in rec["source"].items() if v})
    out["source"] = src
    out["added_at"] = rec.get("added_at") or dt.datetime.now().isoformat(timespec="seconds")
    return out


def score(rec):
    days = rec.get("days_running") or 0
    variants = rec.get("variants") or 1
    copies = rec.get("copies") or 1
    return round(math.log(1 + min(days, 365)) * 2 + math.log2(variants) + math.log2(copies), 2)


# ---------------------------------------------------------------- links

def build_link(query, country, status, media, exact):
    params = [
        ("active_status", status),
        ("ad_type", "all"),
        ("country", country),
        ("is_targeted_country", "false"),
        ("media_type", media),
        ("q", query),
        ("search_type", "keyword_exact_phrase" if exact else "keyword_unordered"),
    ]
    return AD_LIBRARY + "?" + urllib.parse.urlencode(params, quote_via=urllib.parse.quote)


def cmd_links(args):
    for q in args.queries:
        print("%s\n  %s" % (q, build_link(q, args.country, args.status, args.media, args.exact)))


# ---------------------------------------------------------------- parse pasted page text

def is_noise(line):
    return any(r.match(line) for r in NOISE_RE)


def is_cta(line):
    return line.strip().lower() in CTA_SET


def looks_like_domain(line):
    s = line.strip()
    return bool(DOMAIN_RE.match(s)) and " " not in s and len(s) <= 80


def trim_blank(seg):
    seg = list(seg)
    while seg and not seg[0]:
        seg.pop(0)
    while seg and not seg[-1]:
        seg.pop()
    return seg


def join_lines(seg):
    return re.sub(r"\n{3,}", "\n\n", "\n".join(trim_blank(seg)))


def parse_chunk(lines):
    """Parse one ad card. `lines` starts at the Library ID line."""
    lines = trim_blank(lines)
    rec = {"confidence": "ok"}
    notes = []
    m = LIBRARY_ID_RE.match(lines[0])
    rec["id"] = m.group(1)
    body_start = None
    sponsored_idx = None
    for i, line in enumerate(lines):
        sm = STARTED_RE.match(line)
        if sm:
            value = sm.group(1).strip()
            rm = RANGE_RE.match(value)
            if rm:
                rec["start_date"], rec["end_date"] = rm.group(1).strip(), rm.group(2).strip()
                rec["status"] = "inactive"
            else:
                rec["start_date"] = value
        vm = VARIANTS_RE.match(line)
        if vm:
            rec["variants"] = int(vm.group(1))
        if re.match(r"^\d+:\d+\s*/\s*\d+:\d+$", line):
            rec["format"] = "video"
        if line.lower() == "sponsored" and sponsored_idx is None:
            sponsored_idx = i
    if sponsored_idx is None:
        rec["confidence"] = "low"
        notes.append("no 'Sponsored' line")
        body_start = 1
        while body_start < len(lines) and (not lines[body_start] or is_noise(lines[body_start]) or STARTED_RE.match(lines[body_start]) or VARIANTS_RE.match(lines[body_start])):
            body_start += 1
        rec["page_name"] = ""
    else:
        j = sponsored_idx - 1
        while j > 0 and (not lines[j] or is_noise(lines[j])):
            j -= 1
        rec["page_name"] = lines[j] if j > 0 and not STARTED_RE.match(lines[j]) else ""
        body_start = sponsored_idx + 1

    rest = trim_blank([ln for ln in lines[body_start:] if not (ln and is_noise(ln))])
    # A trailing status word belongs to the next card.
    while rest and rest[-1].lower() in ("active", "inactive", ""):
        rest.pop()

    domain_idx = [i for i, ln in enumerate(rest) if ln and looks_like_domain(ln)]
    cta_idx = [i for i, ln in enumerate(rest) if ln and is_cta(ln)]
    cards = []
    if domain_idx:
        first = domain_idx[0]
        rec["primary_text"] = join_lines(rest[:first])
        bounds = domain_idx + [len(rest)]
        for k in range(len(domain_idx)):
            seg = rest[bounds[k]:bounds[k + 1]]
            card = {"domain": seg[0].lower()}
            tail = [t for t in seg[1:] if t]
            cta = next((t for t in tail if is_cta(t)), "")
            tail = [t for t in tail if not is_cta(t)]
            card["headline"] = tail[0] if tail else ""
            card["description"] = "\n".join(tail[1:]) if len(tail) > 1 else ""
            card["cta"] = cta
            cards.append(card)
    elif cta_idx:
        last = cta_idx[-1]
        block = trim_blank(rest[:last])
        rec["cta"] = rest[last]
        if len(block) >= 3 and block[-2] and block[-1]:
            rec["primary_text"] = join_lines(block[:-2])
            rec["headline"], rec["description"] = block[-2], block[-1]
        elif len(block) >= 2 and block[-1]:
            rec["primary_text"], rec["headline"] = join_lines(block[:-1]), block[-1]
        else:
            rec["primary_text"] = join_lines(block)
        rec["confidence"] = "low"
        notes.append("no link line; headline guessed")
    else:
        rec["primary_text"] = join_lines(rest)
        rec["confidence"] = "low"
        notes.append("no link or button found")

    if cards:
        main = cards[0]
        rec["domain"] = main["domain"]
        rec["headline"] = main["headline"]
        rec["description"] = main["description"]
        rec["cta"] = main["cta"]
        if len(cards) > 1:
            rec["format"] = "carousel"
            rec["cards"] = cards
    if not rec.get("primary_text") and not rec.get("headline"):
        rec["confidence"] = "low"
        notes.append("no text found")
    if notes:
        rec["notes"] = "; ".join(notes)
    return rec


def parse_pasted_text(text):
    lines = [ln.strip() for ln in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    starts = [i for i, ln in enumerate(lines) if LIBRARY_ID_RE.match(ln)]
    records = []
    for n, s in enumerate(starts):
        e = starts[n + 1] if n + 1 < len(starts) else len(lines)
        records.append(parse_chunk(lines[s:e]))
    return records


def cmd_parse(args):
    paths = ws_paths(args.workspace)
    with open(args.file, encoding="utf-8", errors="replace") as f:
        text = f.read()
    parsed = parse_pasted_text(text)
    if not parsed:
        print("No ads found. The text must contain 'Library ID:' lines.")
        print("Ask the member to copy the whole Ad Library results page (select all, then copy).")
        return 2
    label = args.query or os.path.splitext(os.path.basename(args.file))[0]
    source = {"kind": "pasted", "query": label, "file": os.path.basename(args.file)}
    rows = [finalize(r, source) for r in parsed]
    out = os.path.join(paths["raw"], "%s-pasted-%s.jsonl" % (today().isoformat(), slugify(label)))
    write_jsonl(out, rows)
    low = [r for r in rows if r["confidence"] == "low"]
    print("Parsed %d ads from %s -> %s" % (len(rows), os.path.basename(args.file), show(out)))
    pages = Counter(r["page_name"] or "(unknown)" for r in rows)
    print("Advertisers: " + ", ".join("%s (%d)" % (p, c) for p, c in pages.most_common(8)))
    if low:
        print("%d ads need a look (confidence low). Check these IDs and fix them in the file:" % len(low))
        for r in low[:15]:
            print("  %s  %s" % (r["id"], r.get("page_name") or ""))
    return 0


# ---------------------------------------------------------------- add (hand-written records)

def cmd_add(args):
    paths = ws_paths(args.workspace)
    if args.file.endswith(".json"):
        with open(args.file, encoding="utf-8") as f:
            data = json.load(f)
        rows_in = data if isinstance(data, list) else data.get("ads", [])
    else:
        rows_in = read_jsonl(args.file)
    label = args.query or os.path.splitext(os.path.basename(args.file))[0]
    source = {"kind": args.kind, "query": label, "file": os.path.basename(args.file)}
    rows, problems = [], 0
    for r in rows_in:
        rec = finalize(r, source)
        if not rec["primary_text"] and not rec["headline"]:
            problems += 1
            continue
        rows.append(rec)
    out = os.path.join(paths["raw"], "%s-%s-%s.jsonl" % (today().isoformat(), args.kind, slugify(label)))
    write_jsonl(out, rows)
    print("Added %d ads -> %s" % (len(rows), show(out)))
    if problems:
        print("Skipped %d rows with no primary text and no headline." % problems)
    missing_dates = sum(1 for r in rows if not r["start_date"])
    if missing_dates:
        print("%d ads have no start date, so they cannot count as proven." % missing_dates)
    return 0


# ---------------------------------------------------------------- merge + rank

def merged_corpus(paths, include_excluded=False):
    excludes = load_excludes(paths)
    groups = OrderedDict()
    for rec in load_raw(paths):
        if not include_excluded and (rec.get("page_name", "").lower() in excludes or rec.get("id", "") in excludes):
            continue
        if not rec.get("primary_text") and not rec.get("headline"):
            continue
        key = norm_key(rec.get("primary_text", ""))[:400] + "|" + norm_key(rec.get("headline", ""))
        cur = groups.get(key)
        if cur is None:
            rec = dict(rec)
            rec["copies"] = 1
            rec["ids"] = [rec.get("id")] if rec.get("id") else []
            rec["found_by"] = [rec.get("source", {}).get("query", "")]
            groups[key] = rec
            continue
        if rec.get("id") and rec["id"] not in cur["ids"]:
            cur["ids"].append(rec["id"])
            cur["copies"] = len(cur["ids"])
        q = rec.get("source", {}).get("query", "")
        if q and q not in cur["found_by"]:
            cur["found_by"].append(q)
        if (rec.get("days_running") or 0) > (cur.get("days_running") or 0):
            for k in ("start_date", "end_date", "days_running", "status", "id", "url"):
                cur[k] = rec.get(k)
        cur["variants"] = max(cur.get("variants") or 1, rec.get("variants") or 1)
        for k in ("description", "cta", "domain", "page_name"):
            if not cur.get(k) and rec.get(k):
                cur[k] = rec[k]
    rows = list(groups.values())
    for r in rows:
        r["score"] = score(r)
        r["proven"] = (r.get("days_running") or 0) >= PROVEN_DAYS
    rows.sort(key=lambda r: r["score"], reverse=True)
    return rows


def cmd_advertisers(args):
    paths = ws_paths(args.workspace)
    rows = merged_corpus(paths, include_excluded=True)
    if not rows:
        print("No ads yet. Run parse or add first.")
        return 1
    excludes = load_excludes(paths)
    by_page = OrderedDict()
    for r in rows:
        name = r.get("page_name") or "(unknown)"
        p = by_page.setdefault(name, {"ads": 0, "proven": 0, "max_days": 0, "domains": Counter(), "queries": set(), "sample": ""})
        p["ads"] += 1
        p["proven"] += 1 if r["proven"] else 0
        p["max_days"] = max(p["max_days"], r.get("days_running") or 0)
        if r.get("domain"):
            p["domains"][r["domain"]] += 1
        for q in r.get("found_by", []):
            p["queries"].add(q)
        if not p["sample"]:
            p["sample"] = (r.get("headline") or r.get("primary_text", "")).replace("\n", " ")[:70]
    ranked = sorted(by_page.items(), key=lambda kv: (kv[1]["proven"], kv[1]["ads"], kv[1]["max_days"]), reverse=True)
    print("| Advertiser | Ads | Proven 30d+ | Longest (days) | Domain | Sample | Status |")
    print("|---|---|---|---|---|---|---|")
    for name, p in ranked[: args.top]:
        dom = p["domains"].most_common(1)[0][0] if p["domains"] else ""
        flag = "excluded" if name.lower() in excludes else ""
        print("| %s | %d | %d | %d | %s | %s | %s |" % (name, p["ads"], p["proven"], p["max_days"], dom, p["sample"].replace("|", "/"), flag))
    print("\n%d advertisers, %d unique ads." % (len(by_page), len(rows)))
    return 0


def fmt_ad_md(n, r):
    bits = [r.get("page_name") or "(unknown advertiser)"]
    if r.get("days_running") is not None:
        bits.append("%d days" % r["days_running"])
    if (r.get("variants") or 1) > 1:
        bits.append("%d versions" % r["variants"])
    if (r.get("copies") or 1) > 1:
        bits.append("%d ads share this copy" % r["copies"])
    if r.get("format") and r["format"] != "unknown":
        bits.append(r["format"])
    if r.get("proven"):
        bits.append("PROVEN")
    lines = ["### %d. %s" % (n, " | ".join(bits))]
    if r.get("id"):
        lines.append("Library ID %s, %s" % (r["id"], r.get("url", "")))
    lines.append("")
    lines.append("**Primary text:**")
    body = r.get("primary_text") or "(none)"
    lines.extend("> " + ln if ln else ">" for ln in body.split("\n"))
    lines.append("")
    lines.append("**Headline:** %s  " % (r.get("headline") or "(none)"))
    lines.append("**Description:** %s  " % (r.get("description") or "(none)"))
    lines.append("**Button:** %s%s" % (r.get("cta") or "(unknown)", (" | " + r["domain"]) if r.get("domain") else ""))
    if r.get("cards"):
        lines.append("")
        lines.append("Carousel cards: " + " / ".join((c.get("headline") or "?") for c in r["cards"][:6]))
    lines.append("")
    return "\n".join(lines)


def cmd_build(args):
    paths = ws_paths(args.workspace)
    rows = merged_corpus(paths)
    if not rows:
        print("No ads yet. Run parse or add first.")
        return 1
    write_jsonl(paths["ads"], rows)
    per_page = Counter()
    chosen = []
    for r in rows:
        name = r.get("page_name") or "(unknown)"
        if per_page[name] >= args.per_advertiser:
            continue
        per_page[name] += 1
        chosen.append(r)
        if len(chosen) >= args.top:
            break
    proven = sum(1 for r in rows if r["proven"])
    advertisers = len({r.get("page_name") for r in rows})
    head = [
        "# Ad corpus",
        "",
        "Built %s from %d unique ads by %d advertisers. %d are proven (still running after %d+ days)."
        % (today().isoformat(), len(rows), advertisers, proven, PROVEN_DAYS),
        "Ranked by how long each ad has run and how many copies or versions the advertiser runs.",
        "Showing the top %d, at most %d per advertiser. Full data: corpus/ads.jsonl." % (len(chosen), args.per_advertiser),
        "",
        "These ads are reference material. Borrow structures and angles. Never copy sentences.",
        "",
    ]
    body = [fmt_ad_md(i + 1, r) for i, r in enumerate(chosen)]
    with open(paths["corpus_md"], "w", encoding="utf-8") as f:
        f.write("\n".join(head) + "\n" + "\n".join(body))
    print("Built corpus: %d unique ads, %d advertisers, %d proven." % (len(rows), advertisers, proven))
    print("Wrote %s and %s" % (show(paths["ads"]), show(paths["corpus_md"])))
    if len(rows) < 40 or proven < 10:
        print("Thin corpus. Aim for 60+ unique ads and 15+ proven. Add more searches or advertisers.")
    return 0


# ---------------------------------------------------------------- stats

def pct(part, whole):
    return "%d%%" % round(100.0 * part / whole) if whole else "n/a"


def quartiles(values):
    values = sorted(values)
    if not values:
        return "n/a"
    if len(values) < 4:
        return "median %d" % statistics.median(values)
    q = statistics.quantiles(values, n=4)
    return "median %d (middle half %d to %d)" % (statistics.median(values), q[0], q[2])


def first_line(text):
    for ln in (text or "").split("\n"):
        if ln.strip():
            return ln.strip()
    return ""


def ngrams(words, n):
    return [" ".join(words[i:i + n]) for i in range(len(words) - n + 1)]


def describe(rows, label):
    n = len(rows)
    out = ["## %s (%d ads)" % (label, n), ""]
    if not n:
        return out
    pt = [r.get("primary_text", "") for r in rows if r.get("primary_text")]
    hl = [r.get("headline", "") for r in rows if r.get("headline")]
    ds = [r.get("description", "") for r in rows if r.get("description")]
    out.append("**Primary text**")
    out.append("- Length in characters: %s" % quartiles([len(t) for t in pt]))
    out.append("- Short (125 chars or less, no 'See more'): %s" % pct(sum(1 for t in pt if len(t) <= 125), len(pt)))
    out.append("- Long (over 500 chars): %s" % pct(sum(1 for t in pt if len(t) > 500), len(pt)))
    out.append("- Uses line breaks: %s" % pct(sum(1 for t in pt if "\n" in t), len(pt)))
    out.append("- Uses emojis: %s" % pct(sum(1 for t in pt if EMOJI_RE.search(t)), len(pt)))
    out.append("- Uses a list (checks, bullets, numbers): %s" % pct(sum(1 for t in pt if re.search(r"(^|\n)\s*([✅✔•▪\-\*]|\d+[.)])\s", t)), len(pt)))
    out.append("- Opens with a question: %s" % pct(sum(1 for t in pt if "?" in first_line(t)), len(pt)))
    out.append("- Mentions a price ($): %s" % pct(sum(1 for t in pt if "$" in t), len(pt)))
    out.append("- First line length: %s" % quartiles([len(first_line(t)) for t in pt]))
    out.append("")
    out.append("**Headline**")
    out.append("- Filled in: %s" % pct(len(hl), n))
    out.append("- Length in characters: %s" % quartiles([len(t) for t in hl]))
    out.append("- Contains a number: %s" % pct(sum(1 for t in hl if re.search(r"\d", t)), len(hl)))
    out.append("- Is a question: %s" % pct(sum(1 for t in hl if t.strip().endswith("?")), len(hl)))
    out.append("")
    out.append("**Description**")
    out.append("- Filled in: %s" % pct(len(ds), n))
    out.append("- Length in characters: %s" % quartiles([len(t) for t in ds]))
    out.append("")
    ctas = Counter(r.get("cta") for r in rows if r.get("cta"))
    if ctas:
        out.append("**Buttons:** " + ", ".join("%s %s" % (c, pct(k, n)) for c, k in ctas.most_common(6)))
        out.append("")
    fmts = Counter(r.get("format") for r in rows if r.get("format") and r.get("format") != "unknown")
    if fmts:
        out.append("**Formats:** " + ", ".join("%s %s" % (c, pct(k, n)) for c, k in fmts.most_common()))
        out.append("")
    return out


def cmd_stats(args):
    paths = ws_paths(args.workspace)
    rows = read_jsonl(paths["ads"]) if os.path.exists(paths["ads"]) else []
    if not rows:
        print("No corpus yet. Run build first.")
        return 1
    proven = [r for r in rows if r.get("proven")]
    out = ["# Corpus statistics", ""]
    out += describe(rows, "All ads")
    out += describe(proven, "Proven ads (%d+ days)" % PROVEN_DAYS)
    words_by_ad = []
    for r in proven or rows:
        words = [w for w in re.findall(r"[a-z0-9$']+", (r.get("primary_text", "") + " " + r.get("headline", "")).lower())]
        words_by_ad.append(words)
    phrase_counts = Counter()
    for words in words_by_ad:
        seen = set()
        for n in (2, 3):
            for g in ngrams(words, n):
                parts = g.split()
                if parts[0] in STOPWORDS or parts[-1] in STOPWORDS:
                    continue
                seen.add(g)
        phrase_counts.update(seen)
    common = [(g, c) for g, c in phrase_counts.most_common(40) if c >= 2][:25]
    if common:
        out.append("## Phrases used by several ads")
        out.append("")
        out.append(", ".join("%s (%d)" % (g, c) for g, c in common))
        out.append("")
    openers = Counter()
    for r in proven or rows:
        words = first_line(r.get("primary_text", "")).split()
        if len(words) >= 2:
            openers[" ".join(words[:2]).lower()] += 1
    common_openers = [(o, c) for o, c in openers.most_common(10) if c >= 2]
    if common_openers:
        out.append("## Common first two words")
        out.append("")
        out.append(", ".join("'%s' (%d)" % (o, c) for o, c in common_openers))
        out.append("")
    print("\n".join(out))
    return 0


# ---------------------------------------------------------------- main

def main(argv=None):
    ensure_utf8_output()
    p = argparse.ArgumentParser(description="Ad Library research helper for the AI Ad Copywriter.")
    p.add_argument("--workspace", default=DEFAULT_WORKSPACE, help="workspace folder (default: ./workspace)")
    sub = p.add_subparsers(dest="cmd")

    s = sub.add_parser("links", help="print Ad Library search links")
    s.add_argument("queries", nargs="+")
    s.add_argument("--country", default="US", help="two-letter country code, or ALL")
    s.add_argument("--status", default="active", choices=["active", "inactive", "all"])
    s.add_argument("--media", default="all", choices=["all", "image", "video"])
    s.add_argument("--exact", action="store_true", help="match the exact phrase")
    s.set_defaults(func=cmd_links)

    s = sub.add_parser("parse", help="structure text copied from an Ad Library page")
    s.add_argument("file")
    s.add_argument("--query", help="what was searched, for the record")
    s.set_defaults(func=cmd_parse)

    s = sub.add_parser("add", help="add hand-written ad records (JSON lines or a JSON list)")
    s.add_argument("file")
    s.add_argument("--query", help="what was searched, for the record")
    s.add_argument("--kind", default="browser", help="where the ads came from (browser, pasted, manual)")
    s.set_defaults(func=cmd_add)

    s = sub.add_parser("advertisers", help="list advertisers found so far")
    s.add_argument("--top", type=int, default=40)
    s.set_defaults(func=cmd_advertisers)

    s = sub.add_parser("build", help="merge into corpus/ads.jsonl and CORPUS.md")
    s.add_argument("--top", type=int, default=100, help="ads to show in CORPUS.md")
    s.add_argument("--per-advertiser", type=int, default=8, help="cap per advertiser in CORPUS.md")
    s.set_defaults(func=cmd_build)

    s = sub.add_parser("stats", help="copy statistics for the corpus")
    s.set_defaults(func=cmd_stats)

    args = p.parse_args(argv)
    if not getattr(args, "func", None):
        p.print_help()
        return 1
    args.workspace = os.path.abspath(args.workspace)
    return args.func(args) or 0


if __name__ == "__main__":
    sys.exit(main())
