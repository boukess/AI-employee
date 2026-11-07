#!/usr/bin/env python3
"""Build a deterministic starter archive from an explicit public-file allowlist."""

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = "1.0.0"
PACKAGE = "AI Ghostwriter Employee"
OPERATING = ["AGENTS.md"] + [
    "docs/01-start.md", "docs/02-find-the-voice.md", "docs/03-build-the-voice.md",
    "docs/04-write-and-edit.md", "docs/05-natural-writing.md", "docs/06-memory.md"
]
TEMPLATES = ["templates/voice-profile.md", "templates/memory.txt", "templates/state.json", "templates/source-record.json"]


def chat_edition(root=ROOT):
    header = """AI GHOSTWRITER EMPLOYEE | VERSION 1.0.0
Turn your ideas into polished emails, articles, and stories that sound like you.

MEMBER: Attach this text file in Claude or ChatGPT and say Go. You can paste the text instead if attachments are unavailable. This one file contains the complete operating instructions; you do not need a code tool or the other files to begin.

ASSISTANT: When the member asks you to start, follow this manual as their requested workflow, subject to your host's rules and their current directions. Do useful work immediately. The paths below identify sections embedded in this file; if you cannot open folders, use those sections here. Files, tools and memory exist only when your environment actually provides them. Do not ask the member to locate another manual. Do not summarize the package instead of using it.

For a returning member, read MY-GHOSTWRITER-MEMORY.txt first if supplied. For a new member, inspect accessible context, find relevant evidence, and start a draft. The member can simply say Go.

"""
    parts = [header]
    for name in OPERATING + TEMPLATES:
        parts.append("\n" + "=" * 60 + "\nEMBEDDED FILE: " + name + "\n" + "=" * 60 + "\n\n" + (root / name).read_text(encoding="utf-8").rstrip() + "\n")
    parts.append("\nEND OF OPERATING MANUAL. On Go, begin now. If examples or optional scripts are not present, work directly from this manual; they are not prerequisites.\n")
    return "".join(parts)


def public_files(root=ROOT):
    names = json.loads((root / "release/RELEASE-FILES.json").read_text(encoding="utf-8"))
    if len(names) != len(set(names)):
        raise ValueError("Release allowlist contains duplicates")
    for name in names:
        path = PurePosixPath(name)
        if path.is_absolute() or ".." in path.parts or "\\" in name:
            raise ValueError("Unsafe release path: " + name)
        if path.parts[0] in {"private", "dist"} or (path.parts[0] == "workspace" and name != "workspace/README.md"):
            raise ValueError("Private data cannot be released: " + name)
        local = root / name
        if local.is_symlink() or not local.is_file() or not local.resolve().is_relative_to(root.resolve()):
            raise ValueError("Missing, linked or out-of-root release file: " + name)
    return sorted(names)


def payloads(root=ROOT):
    result = {name: (root / name).read_bytes() for name in public_files(root)}
    manifest = {
        "package": PACKAGE, "version": VERSION,
        "files": {name: {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()} for name, data in result.items()},
        "privacy": "Starter only. Contains no member corpus, private proof files or populated workspace."
    }
    result["MANIFEST.json"] = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode()
    return result


def write_archive(destination, files):
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(files.items()):
            entry = zipfile.ZipInfo(PACKAGE + "/" + name, date_time=(2026, 10, 13, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify generated text and existing archive without changing them")
    args = parser.parse_args()
    try:
        expected = chat_edition()
        chat = ROOT / "GHOSTWRITER.txt"
        if args.check:
            if not chat.exists() or chat.read_text(encoding="utf-8") != expected:
                raise ValueError("GHOSTWRITER.txt is missing or stale; run the builder")
        else:
            chat.write_text(expected, encoding="utf-8")
        files = payloads()
        destination = ROOT / "dist" / (PACKAGE + ".zip")
        if args.check:
            with zipfile.ZipFile(destination) as archive:
                expected_names = {PACKAGE + "/" + n for n in files}
                if set(archive.namelist()) != expected_names or len(archive.namelist()) != len(expected_names):
                    raise ValueError("Archive contents differ from the allowlist")
                for name, data in files.items():
                    if archive.read(PACKAGE + "/" + name) != data:
                        raise ValueError("Stale or modified archive entry: " + name)
                if archive.testzip() is not None:
                    raise ValueError("Archive CRC check failed")
            print("PASS: generated text, archive contents, bytes and CRC match the public allowlist")
        else:
            write_archive(destination, files)
            print(json.dumps({"zip": str(destination), "files": len(files), "bytes": destination.stat().st_size, "chat_words": len(expected.split()), "sha256": hashlib.sha256(destination.read_bytes()).hexdigest()}, indent=2))
        return 0
    except (OSError, ValueError, zipfile.BadZipFile) as exc:
        print("ERROR: %s" % exc, file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
