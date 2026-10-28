#!/usr/bin/env python3
"""Validate, inspect, search, and browse a local thumbnail reference corpus.

Python 3.9+; standard library only. Never downloads or executes source content.
All command output is JSON, except --help. See --help for usage.
"""

import argparse
from datetime import date, datetime
import hashlib
import html
import json
import os
from pathlib import Path, PurePosixPath
import re
import sys
from urllib.parse import quote, urlsplit


DEFAULT_TARGET = {"verified_thumbnails": 300, "creators": 20, "topic_clusters": 5}
VISUAL_FIELDS = ("hook", "composition", "text", "focal_point")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
STOPWORDS = {"a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it", "of", "on", "or", "the", "to", "with"}


def strict_json(value):
    def reject_constant(constant):
        raise ValueError("non-JSON numeric value: " + constant)
    return json.loads(value, parse_constant=reject_constant)


def nonblank(value):
    return isinstance(value, str) and bool(value.strip())


def safe_url(value):
    if not nonblank(value) or any(ord(c) < 33 for c in value):
        return False
    try:
        parsed = urlsplit(value)
        return parsed.scheme.lower() in {"http", "https"} and bool(parsed.hostname) and not parsed.username and not parsed.password
    except ValueError:
        return False


def iso_date(value):
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        return False
    try:
        date.fromisoformat(value)
        return True
    except ValueError:
        return False


def iso_timestamp(value):
    if iso_date(value):
        return True
    if not isinstance(value, str) or "T" not in value:
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def local_image(workspace, value):
    """Resolve only regular raster image files contained within the workspace."""
    if not nonblank(value) or "\\" in value or any(ord(c) < 32 for c in value):
        raise ValueError("image.local_path must be a relative POSIX path")
    relative = PurePosixPath(value)
    if relative.is_absolute() or ".." in relative.parts or ":" in value:
        raise ValueError("image.local_path must stay inside the workspace")
    path = (workspace / value).resolve()
    try:
        path.relative_to(workspace)
    except ValueError:
        raise ValueError("image.local_path resolves outside the workspace") from None
    if path.suffix.lower() not in IMAGE_EXTENSIONS:
        raise ValueError("image.local_path must use a supported raster image extension")
    if not path.is_file():
        raise ValueError("image.local_path does not name an existing file")
    return path


def validate_record(row, workspace):
    errors = []
    if not isinstance(row, dict):
        return ["record must be an object"]
    for key in ("id", "platform", "creator", "title", "content_format", "rationale", "evidence_notes"):
        if not nonblank(row.get(key)):
            errors.append(key + " must be nonblank text")
    if nonblank(row.get("id")) and not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", row["id"]):
        errors.append("id must be filename-safe: letters, numbers, periods, underscores, and hyphens; start with a letter or number")
    for key in ("creator_url", "source_url"):
        if not safe_url(row.get(key)):
            errors.append(key + " must be an http(s) URL without credentials")
    tags = row.get("topic_tags")
    if not isinstance(tags, list) or not tags or any(not nonblank(t) for t in tags):
        errors.append("topic_tags must be a nonempty list of nonblank strings")
    if not iso_date(row.get("observed_at")):
        errors.append("observed_at must be an ISO date (YYYY-MM-DD)")
    if "published_at" not in row or (row["published_at"] is not None and not iso_timestamp(row["published_at"])):
        errors.append("published_at must be null or an ISO date/datetime")
    if not isinstance(row.get("metrics"), dict):
        errors.append("metrics must be an object; use {} for unknown metrics")
    image = row.get("image")
    if not isinstance(image, dict):
        return errors + ["image must be an object"]
    if image.get("inspection_status") not in ("viewed", "unviewed"):
        errors.append("image.inspection_status must be viewed or unviewed")
    for key in ("source_url", "local_path", "inspection_method", "inspected_at", "sha256"):
        if key not in image:
            errors.append("image." + key + " is required (null is allowed when unknown)")
    image_url = image.get("source_url")
    if image_url is not None and not safe_url(image_url):
        errors.append("image.source_url must be null or an http(s) URL without credentials")
    local = image.get("local_path")
    path = None
    if local is not None:
        try:
            path = local_image(workspace, local)
        except (ValueError, OSError, RuntimeError) as exc:
            errors.append(str(exc))
    if image_url is None and local is None:
        errors.append("image needs a source_url or local_path")
    digest = image.get("sha256")
    if digest is not None:
        if not isinstance(digest, str) or not re.fullmatch(r"[a-fA-F0-9]{64}", digest):
            errors.append("image.sha256 must be null or 64 hexadecimal characters")
        elif path is not None:
            try:
                if hashlib.sha256(path.read_bytes()).hexdigest() != digest.lower():
                    errors.append("image.sha256 does not match the local image")
            except OSError as exc:
                errors.append("could not read local image: " + str(exc))
    method, inspected = image.get("inspection_method"), image.get("inspected_at")
    if method is not None and not nonblank(method):
        errors.append("image.inspection_method must be null or nonblank text")
    if inspected is not None and not iso_timestamp(inspected):
        errors.append("image.inspected_at must be null or an ISO date/datetime")
    visual = row.get("visual")
    if not isinstance(visual, dict):
        errors.append("visual must be an object")
    if image.get("inspection_status") == "viewed":
        if not nonblank(method) or not iso_timestamp(inspected):
            errors.append("viewed images require inspection_method and inspected_at")
        if isinstance(visual, dict):
            for key in VISUAL_FIELDS:
                if not nonblank(visual.get(key)):
                    errors.append("viewed image visual." + key + " must be nonblank (write 'none' if absent)")
            if visual.get("face_presence") not in ("none", "one", "multiple", "unclear"):
                errors.append("viewed image visual.face_presence must be none, one, multiple, or unclear")
            palette = visual.get("palette")
            if not isinstance(palette, list) or not palette or any(not nonblank(c) for c in palette):
                errors.append("viewed image visual.palette must be a nonempty list of nonblank strings")
    return errors


def read_corpus(workspace):
    workspace = Path(workspace).resolve()
    entries, errors = [], []
    path = workspace / "corpus" / "references.jsonl"
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except (OSError, UnicodeError) as exc:
        return [], [{"file": "corpus/references.jsonl", "error": str(exc)}], 0
    for line_number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = strict_json(line)
            issues = validate_record(row, workspace)
        except (ValueError, TypeError) as exc:
            row, issues = None, ["invalid JSON: " + str(exc)]
        entries.append({"line": line_number, "record": row, "issues": issues})
    for name in ("id", "source_url", "image.source_url", "image.local_path", "image.sha256"):
        buckets = {}
        for entry in entries:
            row = entry["record"]
            if not isinstance(row, dict):
                continue
            image = row.get("image")
            value = image.get(name.split(".")[1]) if name.startswith("image.") and isinstance(image, dict) else row.get(name)
            if not nonblank(value):
                continue
            key = value.strip().lower() if name == "image.sha256" else value.strip()
            buckets.setdefault(key, []).append(entry)
        for group in buckets.values():
            if len(group) > 1:
                lines = ", ".join(str(entry["line"]) for entry in group)
                for entry in group:
                    entry["issues"].append("duplicate " + name + " on lines " + lines)
    valid = []
    for entry in entries:
        if entry["issues"]:
            errors.extend({"line": entry["line"], "error": issue} for issue in entry["issues"])
        else:
            valid.append(entry["record"])
    return valid, errors, len(entries)


def verified_records(records):
    return [row for row in records if row["image"]["inspection_status"] == "viewed"]


def research_target(workspace):
    path = Path(workspace) / "state.json"
    if not path.exists():
        return dict(DEFAULT_TARGET), "defaults", []
    try:
        state = strict_json(path.read_text(encoding="utf-8"))
        target = state.get("research_target") if isinstance(state, dict) else None
        if not isinstance(target, dict) or any(type(target.get(key)) is not int or target[key] <= 0 for key in DEFAULT_TARGET):
            raise ValueError("research_target must contain positive integers for verified_thumbnails, creators, topic_clusters")
        return {key: target[key] for key in DEFAULT_TARGET}, "state.json", []
    except (OSError, UnicodeError, ValueError) as exc:
        return dict(DEFAULT_TARGET), "invalid; defaults shown for reference", [{"file": "state.json", "error": str(exc)}]


def status(workspace):
    records, errors, total = read_corpus(workspace)
    verified = verified_records(records)
    target, target_source, target_errors = research_target(workspace)
    errors += target_errors
    creators = {row["creator_url"].rstrip("/").casefold() for row in verified}
    tags = {row["topic_tags"][0].strip().casefold() for row in verified}
    actual = {"verified_thumbnails": len(verified), "creators": len(creators), "topic_clusters": len(tags)}
    criteria = {key: {"actual": actual[key], "target": target[key], "met": actual[key] >= target[key]} for key in target}
    local = sum(row["image"]["local_path"] is not None for row in verified)
    return {"valid": not errors, "total_records": total, "valid_records": len(records),
            "invalid_records": total - len(records), "verified_thumbnails": len(verified),
            "unviewed_records": len(records) - len(verified),
            "verified_with_local_image": local, "verified_viewed_url_only": len(verified) - local,
            "local_images_all_valid_records": sum(row["image"]["local_path"] is not None for row in records),
            "target_source": target_source, "criteria": criteria,
            "research_complete": not errors and all(item["met"] for item in criteria.values()),
            "counting_notes": "Verified means structurally valid, unique, and recorded as viewed with visual notes; this tool cannot prove human/model viewing or detect all visually identical crops/encodings. Creators use creator_url; topic clusters use normalized topic_tags[0] and need editorial review.",
            "errors": errors}


def tokens(value):
    return set(re.findall(r"\w+", value.casefold(), flags=re.UNICODE)) - STOPWORDS


def shortlist(workspace, query, limit):
    records, errors, _ = read_corpus(workspace)
    terms = tokens(query)
    candidates = []
    for row in verified_records(records):
        fields = ((row["title"], 4), (" ".join(row["topic_tags"]), 3), (row["visual"]["hook"], 2), (row["rationale"], 1))
        matches = set()
        score = 0
        for value, weight in fields:
            overlap = terms & tokens(value)
            matches.update(overlap)
            score += weight * len(overlap)
        if score:
            candidates.append({"id": row["id"], "score": score, "matched_terms": sorted(matches), "record": row})
    candidates.sort(key=lambda item: (-item["score"], item["id"]))
    selected = []
    # Round-robin passes take the best remaining result for each creator.
    while candidates and len(selected) < limit:
        seen, remainder = set(), []
        for item in candidates:
            creator = item["record"]["creator_url"].rstrip("/").casefold()
            if creator in seen or len(selected) >= limit:
                remainder.append(item)
            else:
                selected.append(item)
                seen.add(creator)
        candidates = remainder
    return {"query": query, "query_terms": sorted(terms), "method": "Lexical overlap: title 4, tags 3, visual hook 2, rationale 1 per distinct matching term per field; creator-diverse passes, score then id order. No embeddings or performance predictions.",
            "results": selected, "message": "Matches found." if selected else "No verified lexical matches. Research this topic or broaden the query; no unrelated references substituted.", "errors": errors}


def gallery(workspace, output):
    workspace, output = Path(workspace).resolve(), Path(output).resolve()
    records, errors, _ = read_corpus(workspace)
    verified = verified_records(records)
    escape = lambda value: html.escape(str(value), quote=True)
    cards = []
    for row in verified:
        image = row["image"]
        if image["local_path"] is not None:
            path = local_image(workspace, image["local_path"])
            relative = quote(Path(os.path.relpath(path, output.parent)).as_posix(), safe="/")
            visual = '<img loading="lazy" src="' + escape(relative) + '" alt="' + escape(row["title"]) + '">'
        else:
            visual = '<p class="missing">Viewed remotely; no local image available.</p>'
        image_link = '<a rel="noreferrer noopener" href="' + escape(image["source_url"]) + '">Image source</a>' if image["source_url"] else ""
        notes = "".join('<dt>' + escape(key.replace("_", " ").title()) + '</dt><dd>' + escape(", ".join(str(item) for item in value) if isinstance(value, list) else value) + '</dd>' for key, value in row["visual"].items())
        cards.append('<article>' + visual + '<h2>' + escape(row["title"]) + '</h2><p>' + escape(row["creator"]) + ' · ' + escape(row["platform"]) + '</p><p><a rel="noreferrer noopener" href="' + escape(row["source_url"]) + '">Original post</a> ' + image_link + '</p><p>' + escape(", ".join(row["topic_tags"])) + '</p><dl>' + notes + '</dl><p><strong>Rationale:</strong> ' + escape(row["rationale"]) + '</p><p><strong>Evidence:</strong> ' + escape(row["evidence_notes"]) + '</p><p class="meta">' + escape(row["id"]) + ' · observed ' + escape(row["observed_at"]) + '</p></article>')
    document = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' file:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>Thumbnail reference gallery</title><style>
body{font:16px/1.5 system-ui,sans-serif;margin:2rem;background:#f3f4f6;color:#172033}h1{margin-bottom:.3rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:1.4rem}article{background:white;padding:1rem;border:1px solid #d8dce3;border-radius:12px}img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#e9edf2}h2{font-size:1.15rem}dt{font-weight:650}dd{margin:0 0 .5rem}a{color:#164b91}.meta,.missing{color:#526074}p,dd{overflow-wrap:anywhere}
</style></head><body><h1>Thumbnail reference gallery</h1><p>''' + str(len(verified)) + ''' verified records. Only local raster files are embedded; source links open externally. Viewing labels are recorded evidence, not an automated visual audit.</p>'''
    if errors:
        document += '<p>' + str(len(errors)) + ' validation issue(s); invalid records are excluded. Run validate for details.</p>'
    document += '<main class="grid">' + ("".join(cards) or '<p>No verified references yet. Collect and inspect source thumbnails first.</p>') + '</main></body></html>\n'
    if output == workspace / "corpus" / "references.jsonl" or output.suffix.lower() not in {".html", ".htm"}:
        raise ValueError("gallery output must be an .html or .htm file")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(document, encoding="utf-8")
    return {"output": str(output), "displayed_records": len(verified), "errors": errors}


def positive_integer(value):
    try:
        integer = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError("must be a positive integer") from None
    if integer <= 0:
        raise argparse.ArgumentTypeError("must be a positive integer")
    return integer


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    for name, help_text in (("validate", "Check record integrity, paths, duplicates, and available image hashes."), ("status", "Report verified coverage against every research target."), ("shortlist", "Rank verified references with transparent lexical matching."), ("gallery", "Write a static HTML gallery with escaped notes and local images.")):
        sub = commands.add_parser(name, help=help_text)
        sub.add_argument("--workspace", type=Path, default=Path("workspace"), help="Member data root containing corpus/ and state.json (default: ./workspace).")
        if name == "shortlist":
            sub.add_argument("--query", required=True)
            sub.add_argument("--limit", type=positive_integer, default=12)
        if name == "gallery":
            sub.add_argument("--output", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        if args.command in {"validate", "status"}:
            result = status(args.workspace)
        elif args.command == "shortlist":
            result = shortlist(args.workspace, args.query, args.limit)
        else:
            result = gallery(args.workspace, args.output)
    except (OSError, ValueError, RuntimeError) as exc:
        result = {"errors": [{"error": str(exc)}]}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if result.get("errors") else 0


if __name__ == "__main__":
    sys.exit(main())
