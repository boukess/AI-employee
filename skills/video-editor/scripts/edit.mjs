#!/usr/bin/env node
// Local agentic video editor. The agent makes editing decisions as an edit decision list (EDL) in JSON,
// and this script does the mechanical work with ffmpeg. No dependencies beyond Node 18 and ffmpeg on PATH.
//
// Commands:
//   probe <video>                         Print duration, size and fps as JSON.
//   silences <video> [noiseDb] [minSec]   Print speech segments (silence removed) as JSON clips.
//   transcribe <video> [model]            Run the whisper CLI if installed. Writes <video>.srt and <video>.json.
//   retime <edl.json> <source.srt>        Map a source SRT onto the edited timeline. Prints the new SRT.
//   plan <edl.json>                       Print the ffmpeg command the EDL would run, without running it.
//   render <edl.json>                     Render the EDL to its "out" file.
//   --selftest                            Check the pure logic. Needs no ffmpeg.
//
// EDL shape:
// {
//   "sources": { "a": "raw/take1.mp4", "b": "raw/broll.mp4" },
//   "clips":   [ { "src": "a", "in": 3.2, "out": 9.8 }, { "src": "b", "in": 0, "out": 2.5 } ],
//   "aspect":  "9:16",                      // or "16:9", "1:1", "4:5". Center crop and scale.
//   "height":  1920,                        // output height, default 1920 for 9:16 else 1080
//   "titles":  [ { "text": "3 tips", "start": 0, "end": 2, "size": 90, "y": "h*0.15", "color": "white" } ],
//   "captions": "edit.srt",                 // SRT on the EDITED timeline (use retime), burned in
//   "music":   { "file": "bed.mp3", "volume": 0.15 },
//   "out":     "out/final.mp4"
// }

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ASPECTS = { "9:16": [9, 16], "16:9": [16, 9], "1:1": [1, 1], "4:5": [4, 5] };

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.error) throw new Error(cmd + " not found or failed to start. Install it and put it on PATH.");
  return r;
}

export function probe(file) {
  const r = run("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file]);
  if (r.status !== 0) throw new Error(r.stderr);
  const j = JSON.parse(r.stdout);
  const v = j.streams.find((s) => s.codec_type === "video") || {};
  const [n, d] = String(v.r_frame_rate || "30/1").split("/").map(Number);
  return { duration: Number(j.format.duration), width: v.width, height: v.height, fps: d ? n / d : 30, audio: j.streams.some((s) => s.codec_type === "audio") };
}

// Turn ffmpeg silencedetect output into the speech segments between silences.
export function parseSilences(stderr, duration, pad = 0.12) {
  const starts = [...stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const keep = [];
  let cursor = 0;
  starts.forEach((s, i) => {
    if (s > cursor) keep.push({ in: Math.max(0, cursor - pad), out: Math.min(duration, s + pad) });
    cursor = ends[i] ?? duration;
  });
  if (cursor < duration) keep.push({ in: Math.max(0, cursor - pad), out: duration });
  return keep.filter((k) => k.out - k.in > 0.15).map((k) => ({ in: round(k.in), out: round(k.out) }));
}

function round(n) { return Math.round(n * 1000) / 1000; }

export function parseSrt(text) {
  const t = (s) => { const [h, m, rest] = s.split(":"); return +h * 3600 + +m * 60 + Number(rest.replace(",", ".")); };
  return text.replace(/\r/g, "").trim().split(/\n\n+/).map((block) => {
    const lines = block.split("\n");
    const i = lines.findIndex((l) => l.includes("-->"));
    if (i < 0) return null;
    const [a, b] = lines[i].split("-->").map((s) => t(s.trim()));
    return { start: a, end: b, text: lines.slice(i + 1).join("\n") };
  }).filter(Boolean);
}

export function toSrt(cues) {
  const f = (s) => {
    const ms = Math.round(s * 1000);
    const p = (n, w = 2) => String(n).padStart(w, "0");
    return p(Math.floor(ms / 3600000)) + ":" + p(Math.floor(ms / 60000) % 60) + ":" + p(Math.floor(ms / 1000) % 60) + "," + p(ms % 1000, 3);
  };
  return cues.map((c, i) => (i + 1) + "\n" + f(c.start) + " --> " + f(c.end) + "\n" + c.text + "\n").join("\n");
}

// Captions follow the cut: each source cue that overlaps a kept clip lands at that clip's place in the output.
export function retime(edl, cues, srcKey) {
  const key = srcKey || Object.keys(edl.sources)[0];
  const out = [];
  let offset = 0;
  for (const c of edl.clips) {
    if (c.src === key) {
      for (const q of cues) {
        const s = Math.max(q.start, c.in), e = Math.min(q.end, c.out);
        if (e - s > 0.05) out.push({ start: round(offset + s - c.in), end: round(offset + e - c.in), text: q.text });
      }
    }
    offset += c.out - c.in;
  }
  return out;
}

function esc(text) { return String(text).replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "\u2019"); }
// Some ffmpeg builds (Windows especially) ship without fontconfig, so drawtext needs a real font file.
function defaultFont() {
  const list = ["C:/Windows/Fonts/arialbd.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"];
  return list.find((f) => fs.existsSync(f)) || "";
}
function filterPath(p) { return path.resolve(p).replace(/\\/g, "/").replace(/:/g, "\\:"); }

export function buildCommand(edl, baseDir = ".") {
  const res = (p) => path.resolve(baseDir, p);
  const keys = Object.keys(edl.sources);
  const [aw, ah] = ASPECTS[edl.aspect || "9:16"] || ASPECTS["9:16"];
  const H = edl.height || (ah > aw ? 1920 : 1080);
  const W = Math.round((H * aw) / ah / 2) * 2;
  const args = ["-y"];
  keys.forEach((k) => args.push("-i", res(edl.sources[k])));
  if (edl.music) args.push("-i", res(edl.music.file));
  const f = [];
  edl.clips.forEach((c, i) => {
    const n = keys.indexOf(c.src);
    if (n < 0) throw new Error("clip " + i + " uses unknown source " + c.src);
    if (!(c.out > c.in)) throw new Error("clip " + i + " has out <= in");
    f.push("[" + n + ":v]trim=" + c.in + ":" + c.out + ",setpts=PTS-STARTPTS,scale=" + W + ":" + H + ":force_original_aspect_ratio=increase,crop=" + W + ":" + H + ",setsar=1,fps=30[v" + i + "]");
    f.push("[" + n + ":a]atrim=" + c.in + ":" + c.out + ",asetpts=PTS-STARTPTS,aresample=48000[a" + i + "]");
  });
  f.push(edl.clips.map((_, i) => "[v" + i + "][a" + i + "]").join("") + "concat=n=" + edl.clips.length + ":v=1:a=1[vc][ac]");
  let v = "vc";
  (edl.titles || []).forEach((t, i) => {
    const font = t.font || edl.font || defaultFont();
    f.push("[" + v + "]drawtext=" + (font ? "fontfile='" + filterPath(font) + "':" : "") + "expansion=none:text='" + esc(t.text) + "':fontsize=" + (t.size || 84) + ":fontcolor=" + (t.color || "white") + ":borderw=6:bordercolor=black:x=(w-text_w)/2:y=" + (t.y || "h*0.15") + ":enable='between(t," + t.start + "," + t.end + ")'[t" + i + "]");
    v = "t" + i;
  });
  if (edl.captions) {
    const fontsDir = edl.fontsDir || (process.platform === "win32" ? "C:/Windows/Fonts" : "");
    f.push("[" + v + "]subtitles='" + filterPath(res(edl.captions)) + "'" + (fontsDir ? ":fontsdir='" + filterPath(fontsDir) + "'" : "") + ":force_style='Fontsize=" + (edl.captionSize || 16) + ",Bold=1,Outline=3,Alignment=2,MarginV=" + (ah > aw ? 120 : 40) + "'[vs]");
    v = "vs";
  }
  let a = "ac";
  if (edl.music) {
    f.push("[" + keys.length + ":a]volume=" + (edl.music.volume ?? 0.15) + "[mb];[ac][mb]amix=inputs=2:duration=first:dropout_transition=0[am]");
    a = "am";
  }
  args.push("-filter_complex", f.join(";"), "-map", "[" + v + "]", "-map", "[" + a + "]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", res(edl.out || "out.mp4"));
  return args;
}

function loadEdl(file) { return { edl: JSON.parse(fs.readFileSync(file, "utf8")), dir: path.dirname(path.resolve(file)) }; }

function selftest() {
  let n = 0;
  const ok = (cond, msg) => { n++; if (!cond) { console.log("video-editor: selftest FAIL: " + msg); process.exit(1); } };
  const det = "[silencedetect] silence_start: 2.0\n[silencedetect] silence_end: 3.5 | d\n[silencedetect] silence_start: 8\n[silencedetect] silence_end: 10 |";
  const keep = parseSilences(det, 12, 0);
  ok(keep.length === 3 && keep[1].in === 3.5 && keep[1].out === 8 && keep[2].in === 10, "parseSilences");
  const cues = parseSrt("1\n00:00:01,000 --> 00:00:02,500\nhello\n\n2\n00:00:05,000 --> 00:00:06,000\nworld\n");
  ok(cues.length === 2 && cues[0].end === 2.5, "parseSrt");
  ok(parseSrt(toSrt(cues))[1].text === "world", "toSrt round trip");
  const edl = { sources: { a: "x.mp4" }, clips: [{ src: "a", in: 4.5, out: 7 }, { src: "a", in: 0.5, out: 3 }], aspect: "9:16", titles: [{ text: "It's 50%: go", start: 0, end: 1 }], captions: "c.srt", out: "o.mp4" };
  const rt = retime(edl, cues);
  ok(rt.length === 2 && rt[0].text === "world" && rt[0].start === 0.5 && rt[1].start === 3 && rt[1].end === 4.5, "retime");
  const args = buildCommand(edl, "/tmp");
  const fc = args[args.indexOf("-filter_complex") + 1];
  ok(fc.includes("crop=1080:1920") && fc.includes("concat=n=2") && fc.includes("expansion=none") && fc.includes("50%\\: go") && fc.includes("subtitles="), "buildCommand");
  let threw = false;
  try { buildCommand({ sources: { a: "x" }, clips: [{ src: "b", in: 0, out: 1 }] }); } catch { threw = true; }
  ok(threw, "unknown source rejected");
  console.log("video-editor: selftest PASS (" + n + " checks)");
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === "--selftest") selftest();
  else if (cmd === "probe") console.log(JSON.stringify(probe(rest[0]), null, 2));
  else if (cmd === "silences") {
    const d = probe(rest[0]).duration;
    const r = run("ffmpeg", ["-hide_banner", "-i", rest[0], "-af", "silencedetect=noise=" + (rest[1] || "-30dB") + ":d=" + (rest[2] || "0.5"), "-f", "null", "-"]);
    console.log(JSON.stringify(parseSilences(r.stderr, d).map((k) => ({ src: "a", ...k })), null, 2));
  } else if (cmd === "transcribe") {
    const dir = path.dirname(path.resolve(rest[0]));
    const r = run("whisper", [rest[0], "--model", rest[1] || "base", "--output_format", "all", "--word_timestamps", "True", "--output_dir", dir]);
    if (r.status !== 0) throw new Error(r.stderr);
    console.log("transcribed into " + dir);
  } else if (cmd === "retime") {
    const { edl } = loadEdl(rest[0]);
    process.stdout.write(toSrt(retime(edl, parseSrt(fs.readFileSync(rest[1], "utf8")), rest[2])));
  } else if (cmd === "plan" || cmd === "render") {
    const { edl, dir } = loadEdl(rest[0]);
    const args = buildCommand(edl, dir);
    if (cmd === "plan") { console.log("ffmpeg " + args.map((a) => JSON.stringify(a)).join(" ")); }
    else {
      fs.mkdirSync(path.dirname(path.resolve(dir, edl.out || "out.mp4")), { recursive: true });
      const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
      if (r.error || r.status !== 0) throw new Error("ffmpeg render failed");
      console.log("rendered " + path.resolve(dir, edl.out || "out.mp4"));
    }
  } else {
    console.log("usage: edit.mjs probe|silences|transcribe|retime|plan|render ... (see header)");
    process.exit(cmd ? 1 : 0);
  }
} catch (e) {
  console.error("video-editor: " + e.message);
  process.exit(1);
}
