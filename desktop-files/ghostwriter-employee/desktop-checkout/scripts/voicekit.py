#!/usr/bin/env python3
"""Offline source bookkeeping and editorial lint. No network, API, or model calls."""

import argparse
import hashlib
import html
import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

AUTHORSHIP = ("human_original", "performed_speech", "ai_assisted", "unknown", "third_party", "generated_draft")
PURPOSES = ("style", "facts", "holdout", "feedback", "excluded")
STYLE_TYPES = {"human_original", "performed_speech"}
MAX_BYTES = 5_000_000


def words(text):
    return re.findall(r"[^\W_]+(?:['’][^\W_]+)*", text, re.UNICODE)


def digest(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def normalize(text):
    return " ".join(w.casefold().replace("’", "'") for w in words(text))


def clean(text, suffix):
    """Strip timing syntax, not punctuation or disfluencies. Speaker review stays manual."""
    transformations = []
    if suffix.lower() in {".srt", ".vtt"}:
        blocks = re.split(r"\n\s*\n", text.replace("\r\n", "\n").strip())
        cues = []
        for block in blocks:
            lines = block.splitlines()
            if not any("-->" in line for line in lines):
                continue
            timing_index = next(i for i, line in enumerate(lines) if "-->" in line)
            cue = " ".join(lines[timing_index + 1:])
            cue = html.unescape(re.sub(r"<[^>]*>", "", cue)).strip()
            if cue:
                # Exact repeated cues are commonly rolling captions. No fuzzy rewriting.
                if not cues or cue != cues[-1]:
                    cues.append(cue)
        text = " ".join(cues)
        transformations.append("Subtitle cue metadata/tags removed; consecutive identical cues collapsed; speaker and rolling-caption overlap require manual review")
    else:
        stripped = re.sub(r"(?m)^\s*\[\s*\d+(?:\.\d+)?s\]\s*", "", text)
        if stripped != text:
            transformations.append("Leading bracketed second timestamps removed")
        text = stripped
    return text.strip(), transformations


def load_records(workspace):
    path = Path(workspace) / "corpus/sources.jsonl"
    if not path.exists():
        return []
    records = []
    seen = set()
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
            validate(record)
        except (ValueError, TypeError, KeyError) as exc:
            raise ValueError("Invalid source record on line %s: %s" % (line_no, exc)) from exc
        if record["id"] in seen:
            raise ValueError("Duplicate source ID on line %s" % line_no)
        seen.add(record["id"])
        records.append(record)
    return records


def validate(record):
    if not isinstance(record, dict):
        raise ValueError("record must be an object")
    for field in ("id", "author", "author_evidence", "origin", "group", "title", "medium", "permission_basis", "text"):
        if not isinstance(record.get(field), str) or not record[field].strip():
            raise ValueError("missing or empty %s" % field)
    if record.get("authorship") not in AUTHORSHIP or record.get("purpose") not in PURPOSES:
        raise ValueError("unknown authorship or purpose")
    if record["purpose"] in {"style", "holdout"} and record["authorship"] not in STYLE_TYPES:
        raise ValueError("Only human originals or labeled performed speech may enter style/holdout")
    if record.get("confidence") not in {"low", "medium", "high"}:
        raise ValueError("confidence must be low, medium or high")
    if record.get("privacy") not in {"private", "public"}:
        raise ValueError("privacy must be private or public")
    for field in ("published_at", "retrieved_at"):
        value = record.get(field)
        if value is None and field == "published_at":
            continue
        if not isinstance(value, str):
            raise ValueError("%s must be an ISO date" % field)
        date.fromisoformat(value)
    if not isinstance(record.get("limitations"), list) or not isinstance(record.get("transformations"), list):
        raise ValueError("limitations and transformations must be lists")


def save_records(workspace, records):
    path = Path(workspace) / "corpus/sources.jsonl"
    path.parent.mkdir(parents=True, exist_ok=True)
    data = "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records)
    temp = path.with_suffix(".tmp")
    temp.write_text(data, encoding="utf-8")
    temp.replace(path)
    # Derived metrics are rebuilt on request; never leave a stale report behind.
    report_path = path.parent / "report.json"
    if report_path.exists():
        report_path.unlink()


def shingles(text, n=5):
    tokens = normalize(text).split()
    return {tuple(tokens[i:i + n]) for i in range(max(0, len(tokens) - n + 1))}


def add_record(workspace, record):
    validate(record)
    records = load_records(workspace)
    norm = normalize(record["text"])
    if not norm:
        raise ValueError("No usable words in source")
    for old in records:
        if old["id"] == record["id"]:
            raise ValueError("Source ID already exists; choose a new ID or explicitly forget it first")
        if normalize(old["text"]) == norm:
            raise ValueError("Duplicate text of %s; retain one origin instead of inflating counts" % old["id"])
        if old["group"] == record["group"] and {old["purpose"], record["purpose"]} == {"style", "holdout"}:
            raise ValueError("The same origin cannot appear in both style and holdout")
    warnings = []
    candidate = shingles(record["text"])
    for old in records:
        existing = shingles(old["text"])
        if candidate and existing:
            overlap = len(candidate & existing) / min(len(candidate), len(existing))
            if overlap >= 0.70:
                warnings.append("Possible duplicate/overlap with %s; review and group or remove duplicated passages" % old["id"])
    record = dict(record)
    record["schema_version"] = 1
    record["text_sha256"] = digest(norm)
    record["word_count"] = len(words(record["text"]))
    records.append(record)
    save_records(workspace, records)
    return {"added": record["id"], "words": record["word_count"], "warnings": warnings}


def summarize(records):
    # Defend against external/manual records containing duplicated text or split origins.
    selected, duplicates, seen = [], [], set()
    for record in records:
        key = normalize(record["text"])
        if key in seen:
            duplicates.append(record["id"])
        else:
            selected.append(record)
            seen.add(key)
    style_groups = {r["group"] for r in selected if r["purpose"] == "style"}
    holdout_groups = {r["group"] for r in selected if r["purpose"] == "holdout"}
    conflict = sorted(style_groups & holdout_groups)
    style = [r for r in selected if r["purpose"] == "style" and r["authorship"] in STYLE_TYPES and r["group"] not in conflict]
    holdout = [r for r in selected if r["purpose"] == "holdout" and r["group"] not in conflict]
    counts = Counter()
    for r in style:
        counts[r["medium"]] += len(words(r["text"]))
    human = [r for r in style if r["authorship"] == "human_original"]
    performed = [r for r in style if r["authorship"] == "performed_speech"]
    return {
        "total_records": len(records),
        "style_records": len(style),
        "style_distinct_origins": len({r["group"] for r in style}),
        "style_words": sum(len(words(r["text"])) for r in style),
        "human_original_style_words": sum(len(words(r["text"])) for r in human),
        "performed_speech_style_words": sum(len(words(r["text"])) for r in performed),
        "style_words_by_medium": dict(sorted(counts.items())),
        "holdout_records": len(holdout),
        "holdout_words": sum(len(words(r["text"])) for r in holdout),
        "records_by_authorship": dict(Counter(r["authorship"] for r in records)),
        "records_by_purpose": dict(Counter(r["purpose"] for r in records)),
        "duplicate_record_ids_excluded": duplicates,
        "conflicted_origins_excluded_from_style_and_holdout": conflict,
        "limits": "Counts are descriptive. Authorship, permission, overlap, speaker identity and voice quality require review. No model training or voice accuracy measurement is performed."
    }


PATTERNS = [
    ("canned_contrast", r"\b(?:it['’]s|this is|it is)\s+not\b[^.!?\n]{0,140}[.!?;,]\s*(?:it['’]s|this is|it is|but)\b"),
    ("canned_contrast", r"\b(?:this|it)\s+isn['’]t\b[^.!?\n]{0,140}[.!?;,]\s*(?:this|it)\s+is\b"),
    ("canned_contrast", r"\bnot\s+[^.!?\n]{1,80},?\s+but\s+"),
    ("hype_or_filler", r"\b(?:game[- ]changer|unlock your potential|leverage|seamless(?:ly)?|revolutionary|delve|robust solution|empower|elevate|ever[- ]evolving landscape|take it to the next level|more than just)\b"),
    ("generic_transition", r"\b(?:in today['’]s fast[- ]paced world|it['’]s worth noting|at the end of the day|in conclusion|let['’]s dive in|the bottom line)\b"),
    ("unfinished_placeholder", r"\[(?:NEED|TODO|INSERT|VERIFY|FACT|NAME)\b[^\]\n]*\]|\b(?:TODO|TBD)\b"),
]


def lint_text(text, allow_dashes=False):
    hits = []
    patterns = PATTERNS + ([] if allow_dashes else [("dash_review", r"[—–]")])
    for rule, pattern in patterns:
        for match in re.finditer(pattern, text, re.I):
            hits.append({"rule": rule, "line": text.count("\n", 0, match.start()) + 1, "text": match.group(0), "severity": "error" if rule == "unfinished_placeholder" else "review"})
    hits.sort(key=lambda h: (h["line"], h["rule"]))
    return {
        "word_count": len(words(text)),
        "findings": hits,
        "status": "REVIEW" if hits else "NO_PATTERN_HITS",
        "limits": "Editorial hints only. Not an AI detector, fact check, voice score, or publishing approval. Review quotes, numerical ranges and user-approved vocabulary in context."
    }


def make_parser():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", default="workspace", help="Private workspace directory")
    commands = parser.add_subparsers(dest="command", required=True)
    add = commands.add_parser("add", help="Add a reviewed source; read-only input, no remote access")
    for flag in ("file", "id", "author", "author-evidence", "origin", "group", "title", "medium", "permission-basis"):
        add.add_argument("--" + flag, required=True)
    add.add_argument("--authorship", choices=AUTHORSHIP, required=True)
    add.add_argument("--purpose", choices=PURPOSES, required=True)
    add.add_argument("--confidence", choices=("low", "medium", "high"), default="low")
    add.add_argument("--privacy", choices=("private", "public"), default="private")
    add.add_argument("--published-at", default=None)
    add.add_argument("--limitation", action="append", default=[])
    commands.add_parser("report", help="Count distinct origins and words, excluding holdout from style")
    forget = commands.add_parser("forget", help="Remove one source record; derived files still need assistant review")
    forget.add_argument("--id", required=True)
    lint = commands.add_parser("lint", help="Flag editorial patterns; never detect AI authorship")
    lint.add_argument("file")
    lint.add_argument("--allow-dashes", action="store_true")
    return parser


def main(argv=None):
    args = make_parser().parse_args(argv)
    try:
        if args.command == "add":
            path = Path(args.file)
            if path.suffix.lower() not in {".txt", ".md", ".srt", ".vtt"}:
                raise ValueError("Use a reviewed UTF-8 TXT, MD, SRT or VTT file; other formats need host extraction first")
            if path.stat().st_size > MAX_BYTES:
                raise ValueError("Source too large; select a relevant excerpt under 5 MB")
            raw = path.read_text(encoding="utf-8-sig")
            cleaned, transforms = clean(raw, path.suffix)
            record = {k: getattr(args, k) for k in ("id", "author", "author_evidence", "origin", "group", "title", "medium", "permission_basis", "authorship", "purpose", "confidence", "privacy", "published_at")}
            record.update(text=cleaned, raw_sha256=digest(raw), retrieved_at=date.today().isoformat(), transformations=transforms, limitations=args.limitation)
            result = add_record(args.workspace, record)
        elif args.command == "report":
            result = summarize(load_records(args.workspace))
            path = Path(args.workspace) / "corpus/report.json"
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        elif args.command == "forget":
            records = load_records(args.workspace)
            remaining = [r for r in records if r["id"] != args.id]
            if len(remaining) == len(records):
                raise ValueError("Source ID not found")
            save_records(args.workspace, remaining)
            result = {"removed": args.id, "required_followup": "Review raw copies, profile rules, facts, drafts and memory exports; this command removes only the source record. Earlier downloaded copies and platform history are unchanged."}
        else:
            result = lint_text(Path(args.file).read_text(encoding="utf-8"), args.allow_dashes)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        if args.command == "lint" and result["findings"]:
            return 1
        return 0
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print("ERROR: %s" % exc, file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
