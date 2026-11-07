#!/usr/bin/env python3
"""Pull clean text transcripts from YouTube with yt-dlp.

Search:      python3 yt_transcript.py search "Alex Hormozi podcast interview" --n 10
Transcript:  python3 yt_transcript.py get <url-or-id> [<url-or-id> ...] --out transcripts/

Each transcript is saved as <out>/<video-id>.txt with a header (title, channel,
upload date, duration, url) followed by the spoken text with rolling-caption
duplicates removed and a [mm:ss] marker every ~60 seconds.
Requires yt-dlp (pip install yt-dlp or brew install yt-dlp).
"""
import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

TS = re.compile(r"(\d+):(\d{2}):(\d{2})\.\d{3} -->")
TAG = re.compile(r"<[^>]+>")


def need_ytdlp():
    exe = shutil.which("yt-dlp")
    if not exe:
        sys.exit("yt-dlp not found. Install it with: pip3 install yt-dlp  (or: brew install yt-dlp)")
    return exe


def run(args):
    return subprocess.run(args, capture_output=True, text=True)


def search(query, n):
    exe = need_ytdlp()
    r = run([exe, f"ytsearch{n}:{query}", "--flat-playlist", "--print",
             "%(id)s\t%(duration_string)s\t%(channel)s\t%(title)s"])
    if r.returncode != 0:
        sys.exit(r.stderr.strip()[-800:])
    print("id\tduration\tchannel\ttitle")
    print(r.stdout.strip())


def vtt_to_text(path):
    lines_out, last, next_mark = [], None, 0
    with open(path, encoding="utf-8", errors="ignore") as f:
        block_start = 0
        for raw in f:
            line = raw.strip()
            m = TS.match(line)
            if m:
                h, mi, s = (int(x) for x in m.groups())
                block_start = h * 3600 + mi * 60 + s
                continue
            if not line or line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")) or "-->" in line:
                continue
            text = TAG.sub("", line).replace("&nbsp;", " ").replace("&amp;", "&").strip()
            if not text or text == last:
                continue
            if block_start >= next_mark:
                lines_out.append(f"\n[{block_start // 60:02d}:{block_start % 60:02d}]")
                next_mark = block_start + 60
            lines_out.append(text)
            last = text
    body = " ".join(lines_out)
    body = re.sub(r"\s+\n", "\n", body)
    return re.sub(r"[ \t]+", " ", body).strip()


def get(ids, out):
    exe = need_ytdlp()
    os.makedirs(out, exist_ok=True)
    for n, vid in enumerate(ids):
        if n:
            time.sleep(2)
        url = vid if vid.startswith("http") else f"https://www.youtube.com/watch?v={vid}"
        meta_r = run([exe, "--skip-download", "--dump-json", url])
        if meta_r.returncode != 0:
            print(f"FAIL {url}: {meta_r.stderr.strip()[-300:]}")
            continue
        meta = json.loads(meta_r.stdout.splitlines()[0])
        with tempfile.TemporaryDirectory() as tmp:
            run([exe, "--skip-download", "--write-subs", "--write-auto-subs", "--sub-langs", "en.*,en",
                 "--sub-format", "vtt", "-o", os.path.join(tmp, "%(id)s.%(ext)s"), url])
            vtts = sorted(glob.glob(os.path.join(tmp, "*.vtt")), key=lambda p: ("orig" in p, len(p)))
            if not vtts:
                print(f"NO CAPTIONS {meta.get('id')} {meta.get('title')}")
                continue
            text = vtt_to_text(vtts[0])
        header = (f"TITLE: {meta.get('title')}\nCHANNEL: {meta.get('channel')}\n"
                  f"UPLOADED: {meta.get('upload_date')}\nDURATION: {meta.get('duration_string')}\n"
                  f"URL: https://www.youtube.com/watch?v={meta.get('id')}\n\n")
        dest = os.path.join(out, f"{meta.get('id')}.txt")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(header + text + "\n")
        print(f"OK {dest} ({len(text.split())} words) {meta.get('title')}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("search")
    s.add_argument("query")
    s.add_argument("--n", type=int, default=10)
    g = sub.add_parser("get")
    g.add_argument("ids", nargs="+")
    g.add_argument("--out", default="transcripts")
    a = p.parse_args()
    if a.cmd == "search":
        search(a.query, a.n)
    else:
        get(a.ids, a.out)


if __name__ == "__main__":
    main()
