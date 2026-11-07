#!/usr/bin/env python3
"""Get an ad creative ready for the copywriter to look at.

Images: prints size, aspect ratio and which placements it fits.
Videos: pulls frames (the first 3 seconds closely, then evenly through the video),
        builds one contact sheet image, extracts the audio and, if a speech-to-text
        package is installed, writes a transcript.

Standard library only. Uses ffmpeg for video when it can find it (on PATH, or from the
imageio-ffmpeg / static-ffmpeg Python packages). Falls back to OpenCV + Pillow if those
are installed (ChatGPT's file sandbox has them).

Usage
  python3 scripts/creative.py inspect PATH [--frames 12] [--transcribe auto|yes|no]
"""

import argparse
import glob
import json
import os
import re
import shutil
import struct
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_OUT = os.path.join(ROOT, "workspace", "creatives", "_frames")
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv"}

RATIOS = [
    ("9:16", 9 / 16, "Reels and Stories first. Feed shows it cropped to 4:5, so keep key text in the middle."),
    ("4:5", 4 / 5, "Feed first (the most screen space in feed). Reels and Stories add bars or fill the rest."),
    ("1:1", 1.0, "Works everywhere but uses less of the screen than 4:5 in feed."),
    ("1.91:1", 1.91, "Landscape. Small in mobile feed. Fine for right column and links."),
    ("16:9", 16 / 9, "Landscape video. Small in mobile feed. Consider a 4:5 or 9:16 cut."),
]


def ensure_utf8_output():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


def slugify(text, limit=50):
    text = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").lower()).strip("-")
    return text[:limit].strip("-") or "creative"


def show(path):
    rel = os.path.relpath(path, ROOT)
    return path if rel.startswith("..") else rel


def ratio_label(w, h):
    if not w or not h:
        return None, ""
    r = w / float(h)
    name, _, note = min(RATIOS, key=lambda x: abs(x[1] - r))
    return name, note


# ---------------------------------------------------------------- images

def image_size(path):
    with open(path, "rb") as f:
        head = f.read(32)
        if head[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", head[16:24])
            return w, h
        if head[:6] in (b"GIF87a", b"GIF89a"):
            w, h = struct.unpack("<HH", head[6:10])
            return w, h
        if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
            chunk = head[12:16]
            f.seek(0)
            data = f.read(40)
            if chunk == b"VP8 ":
                w, h = struct.unpack("<HH", data[26:30])
                return w & 0x3FFF, h & 0x3FFF
            if chunk == b"VP8L":
                b = data[21:25]
                w = 1 + (((b[1] & 0x3F) << 8) | b[0])
                h = 1 + (((b[3] & 0xF) << 10) | (b[2] << 2) | ((b[1] & 0xC0) >> 6))
                return w, h
            if chunk == b"VP8X":
                w = 1 + int.from_bytes(data[24:27], "little")
                h = 1 + int.from_bytes(data[27:30], "little")
                return w, h
        if head[:2] == b"\xff\xd8":
            f.seek(2)
            while True:
                marker = f.read(2)
                if len(marker) < 2 or marker[0] != 0xFF:
                    return None, None
                code = marker[1]
                if code in (0xD8, 0x01) or 0xD0 <= code <= 0xD7:
                    continue
                length = struct.unpack(">H", f.read(2))[0]
                if code in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    f.read(1)
                    h, w = struct.unpack(">HH", f.read(4))
                    return w, h
                f.seek(length - 2, 1)
    return None, None


def inspect_image(path):
    w, h = image_size(path)
    name, note = ratio_label(w, h)
    print("TYPE: image")
    print("FILE: %s" % show(path))
    if w:
        print("SIZE: %dx%d (%s)" % (w, h, name))
        print("PLACEMENT FIT: %s" % note)
        if min(w, h) < 1080:
            print("NOTE: under 1080 px on the short side. Meta recommends at least 1080 px.")
    else:
        print("SIZE: unknown (could not read the header)")
    print("NEXT: open the image and look at it closely before writing.")
    return 0


# ---------------------------------------------------------------- video tools

def find_ffmpeg():
    env = os.environ.get("FFMPEG")
    if env and os.path.exists(env):
        return env
    for name in ("ffmpeg", "ffmpeg.exe"):
        p = shutil.which(name)
        if p:
            return p
    try:
        import imageio_ffmpeg  # type: ignore
        p = imageio_ffmpeg.get_ffmpeg_exe()
        if p and os.path.exists(p):
            return p
    except Exception:
        pass
    try:
        import static_ffmpeg  # type: ignore
        base = os.path.join(os.path.dirname(static_ffmpeg.__file__), "bin")
        for p in glob.glob(os.path.join(base, "*", "ffmpeg*")):
            if os.access(p, os.X_OK) and not p.endswith(".crumb"):
                return p
    except Exception:
        pass
    for p in ("/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/usr/bin/ffmpeg"):
        if os.path.exists(p):
            return p
    return None


def probe(ffmpeg, path):
    r = subprocess.run([ffmpeg, "-hide_banner", "-i", path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    err = r.stderr.decode("utf-8", "replace")
    info = {"duration": None, "width": None, "height": None, "has_audio": " Audio:" in err, "rotation": 0}
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", err)
    if m:
        info["duration"] = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    m = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", err)
    if m:
        info["width"], info["height"] = int(m.group(1)), int(m.group(2))
    m = re.search(r"rotate\s*:\s*(-?\d+)", err) or re.search(r"rotation of (-?\d+(?:\.\d+)?)", err)
    if m:
        info["rotation"] = int(float(m.group(1)))
    if abs(info["rotation"]) in (90, 270) and info["width"]:
        info["width"], info["height"] = info["height"], info["width"]
    return info


def frame_times(duration, count):
    if not duration or duration <= 0:
        return [0.0]
    hook = [t for t in (0.0, 1.0, 2.0, 3.0) if t < duration - 0.1]
    rest_n = max(0, count - len(hook))
    start, end = 4.0, max(4.0, duration - 0.3)
    rest = []
    if rest_n and end > start:
        step = (end - start) / max(1, rest_n - 1) if rest_n > 1 else 0
        rest = [round(start + i * step, 2) for i in range(rest_n)]
    times = sorted(set(round(t, 2) for t in hook + rest))
    return times[:count]


def video_with_ffmpeg(ffmpeg, path, out_dir, count):
    info = probe(ffmpeg, path)
    times = frame_times(info["duration"], count)
    for old in glob.glob(os.path.join(out_dir, "f*.jpg")):
        os.remove(old)
    made = []
    for i, t in enumerate(times, 1):
        target = os.path.join(out_dir, "f%02d.jpg" % i)
        cmd = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-ss", "%.2f" % t, "-i", path,
               "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "3", target]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if os.path.exists(target):
            made.append((target, t))
    sheet = None
    if made:
        cols = 4 if len(made) > 6 else len(made)
        rows = (len(made) + cols - 1) // cols
        sheet = os.path.join(out_dir, "sheet.jpg")
        cmd = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-start_number", "1",
               "-i", os.path.join(out_dir, "f%02d.jpg"),
               "-vf", "scale=320:-2,tile=%dx%d:padding=6:color=white" % (cols, rows),
               "-frames:v", "1", "-q:v", "3", sheet]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if not os.path.exists(sheet):
            sheet = None
    audio = None
    if info["has_audio"]:
        audio = os.path.join(out_dir, "audio.wav")
        cmd = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", path, "-vn", "-ac", "1", "-ar", "16000", audio]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if not os.path.exists(audio):
            audio = None
    return info, made, sheet, audio


def video_with_opencv(path, out_dir, count):
    import cv2  # type: ignore
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0
    duration = total / fps if total else None
    info = {"duration": duration, "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or None,
            "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or None, "has_audio": None, "rotation": 0}
    made = []
    for i, t in enumerate(frame_times(duration, count), 1):
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        h, w = frame.shape[:2]
        scale = 720.0 / w
        frame = cv2.resize(frame, (720, int(h * scale)))
        target = os.path.join(out_dir, "f%02d.jpg" % i)
        cv2.imwrite(target, frame)
        made.append((target, t))
    cap.release()
    sheet = None
    try:
        from PIL import Image  # type: ignore
        thumbs = [Image.open(p) for p, _ in made]
        if thumbs:
            tw = 320
            th = int(thumbs[0].height * tw / thumbs[0].width)
            cols = 4 if len(thumbs) > 6 else len(thumbs)
            rows = (len(thumbs) + cols - 1) // cols
            canvas = Image.new("RGB", (cols * (tw + 6) + 6, rows * (th + 6) + 6), "white")
            for k, im in enumerate(thumbs):
                im = im.resize((tw, th))
                canvas.paste(im, (6 + (k % cols) * (tw + 6), 6 + (k // cols) * (th + 6)))
            sheet = os.path.join(out_dir, "sheet.jpg")
            canvas.save(sheet, quality=85)
    except Exception:
        sheet = None
    return info, made, sheet, None


def transcribe(audio, mode, model_name):
    if mode == "no" or not audio:
        return None, "skipped"
    try:
        from faster_whisper import WhisperModel  # type: ignore
        model = WhisperModel(model_name, device="cpu", compute_type="int8")
        segments, _ = model.transcribe(audio, vad_filter=True)
        lines = ["[%5.1fs] %s" % (s.start, s.text.strip()) for s in segments]
        return "\n".join(lines), "faster-whisper (%s)" % model_name
    except ImportError:
        pass
    except Exception as e:
        return None, "faster-whisper failed: %s" % e
    try:
        import whisper  # type: ignore
        model = whisper.load_model(model_name)
        result = model.transcribe(audio)
        lines = ["[%5.1fs] %s" % (s["start"], s["text"].strip()) for s in result.get("segments", [])]
        return "\n".join(lines), "openai-whisper (%s)" % model_name
    except ImportError:
        pass
    except Exception as e:
        return None, "whisper failed: %s" % e
    return None, "no speech-to-text package installed"


def inspect_video(path, args):
    out_dir = os.path.join(args.out, slugify(os.path.splitext(os.path.basename(path))[0]))
    os.makedirs(out_dir, exist_ok=True)
    ffmpeg = find_ffmpeg()
    engine = None
    if ffmpeg:
        info, made, sheet, audio = video_with_ffmpeg(ffmpeg, path, out_dir, args.frames)
        engine = "ffmpeg"
    else:
        try:
            info, made, sheet, audio = video_with_opencv(path, out_dir, args.frames)
            engine = "opencv"
        except ImportError:
            print("TYPE: video")
            print("FILE: %s" % show(path))
            print("STATUS: NO_VIDEO_TOOLS")
            print("No ffmpeg or OpenCV found, so frames cannot be pulled automatically.")
            print("Option 1 (ask the member first): python3 -m pip install --user imageio-ffmpeg, then run this again.")
            print("Option 2: ask the member for 4 to 6 screenshots (first frame, 1 s, 3 s, middle, last frame)")
            print("          and for the voiceover script or on-screen text.")
            return 3
    print("TYPE: video (frames by %s)" % engine)
    print("FILE: %s" % show(path))
    if info.get("width"):
        name, note = ratio_label(info["width"], info["height"])
        print("SIZE: %dx%d (%s)" % (info["width"], info["height"], name))
        print("PLACEMENT FIT: %s" % note)
    if info.get("duration"):
        print("LENGTH: %.1f s" % info["duration"])
        if info["duration"] > 60:
            print("NOTE: over 60 s. Reels favors shorter cuts. The hook still has to land in 3 s.")
    print("FRAMES: %d saved in %s" % (len(made), show(out_dir)))
    for p, t in made:
        print("  %s at %.1f s%s" % (os.path.basename(p), t, "  (hook)" if t <= 3.0 else ""))
    if sheet:
        print("CONTACT SHEET: %s  (open this first, then the hook frames)" % show(sheet))
    text, how = transcribe(audio, args.transcribe, args.model) if audio else (None, "no audio track" if info.get("has_audio") is False else "no audio extracted")
    if text:
        tpath = os.path.join(out_dir, "transcript.txt")
        with open(tpath, "w", encoding="utf-8") as f:
            f.write(text + "\n")
        print("TRANSCRIPT: %s (%s)" % (show(tpath), how))
        print(text)
    else:
        print("TRANSCRIPT: none (%s)." % how)
        if info.get("has_audio"):
            print("ASK: the member for the voiceover script, or whether the audio is music only.")
    meta = {"file": show(path), "engine": engine, "info": info, "frames": [{"file": os.path.basename(p), "t": t} for p, t in made]}
    with open(os.path.join(out_dir, "frames.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    return 0


def main(argv=None):
    ensure_utf8_output()
    p = argparse.ArgumentParser(description="Prepare an ad creative for review.")
    sub = p.add_subparsers(dest="cmd")
    s = sub.add_parser("inspect", help="inspect an image or video creative")
    s.add_argument("path")
    s.add_argument("--frames", type=int, default=12, help="frames to pull from a video (default 12)")
    s.add_argument("--transcribe", default="auto", choices=["auto", "yes", "no"])
    s.add_argument("--model", default="base", help="speech-to-text model size (default base)")
    s.add_argument("--out", default=DEFAULT_OUT, help="where to save frames")
    args = p.parse_args(argv)
    if args.cmd != "inspect":
        p.print_help()
        return 1
    path = os.path.abspath(os.path.expanduser(args.path))
    if not os.path.exists(path):
        print("File not found: %s" % args.path)
        return 1
    ext = os.path.splitext(path)[1].lower()
    if ext in IMAGE_EXT:
        return inspect_image(path)
    if ext in VIDEO_EXT:
        return inspect_video(path, args)
    print("Unsupported file type: %s. Use an image (png, jpg, webp, gif) or a video (mp4, mov, webm)." % ext)
    return 1


if __name__ == "__main__":
    sys.exit(main())
