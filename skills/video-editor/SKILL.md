---
name: video-editor
description: Edit videos locally like an agentic human editor. Cuts dead air and bad takes, reorders clips, reframes to 9:16, 1:1 or 16:9, adds titles, burned in captions that follow the cuts, and a music bed, then renders with ffmpeg on the user's own machine. Use when the user or a hired employee (most often the Social Media employee) wants a video cut, trimmed, tightened, captioned, titled, reframed or turned into a short. No account, no upload, nothing posted.
---

# Video Editor

You are the editor. You make the creative decisions, the way a human editor would, and the script `scripts/edit.mjs` (next to this file) does the mechanical work with ffmpeg. You never generate footage. You choose what to keep, in what order, and what to put on screen.

The whole edit lives in one file, an edit decision list (EDL) in JSON. Changing the edit means changing the EDL and rendering again. Nothing is destructive: source files are never touched.

## 0. Requirements

1. `ffmpeg` and `ffprobe` on PATH. Check with `ffmpeg -version`. If missing, tell the user how to install it (Windows: `winget install Gyan.FFmpeg`, macOS: `brew install ffmpeg`) and stop.
2. Optional, for transcripts: the `whisper` CLI (`pip install openai-whisper`). Without it, you can still cut by silence and the user can supply their own SRT.

Run `node scripts/edit.mjs --selftest` once to prove the script works.

## 1. Look at the footage

Only use files the user pointed you at. For each source:

```bash
node scripts/edit.mjs probe raw/take1.mp4
node scripts/edit.mjs transcribe raw/take1.mp4
```

`transcribe` writes `take1.srt` and `take1.json` (with word timings) next to the video. Read the transcript. It is how you "watch" the video: it tells you where each sentence starts and ends, which takes were repeated, and where the speaker stumbled.

## 2. Make the editing decisions

Write a short brief first, then turn it into clips:

1. **Goal and platform.** Default for social: 9:16, under 60 seconds.
2. **Hook.** The strongest sentence goes first, within the first 2 seconds, even if it was said in the middle.
3. **Cut.** Remove dead air, filler, false starts and repeated takes. Keep the last clean take of a line. `node scripts/edit.mjs silences raw/take1.mp4` gives speech segments as a starting point. Then trim by sentence boundaries from the transcript.
4. **Order.** Hook, then the beats in a logical order, then a clear ending or call to action.
5. **On screen text.** A title over the hook, short key phrases at the moments they are said.
6. **Captions.** On by default for social.

Write the EDL as `edit.json` in the user's project folder. The schema is in the header of `scripts/edit.mjs`. Times are seconds in the source file. Example:

```json
{
  "sources": { "a": "raw/take1.mp4" },
  "clips": [
    { "src": "a", "in": 41.2, "out": 44.9 },
    { "src": "a", "in": 3.1, "out": 12.6 },
    { "src": "a", "in": 15.0, "out": 28.4 }
  ],
  "aspect": "9:16",
  "titles": [ { "text": "Stop doing this", "start": 0, "end": 2.5 } ],
  "captions": "edit.srt",
  "out": "out/v1.mp4"
}
```

## 3. Captions follow the cut

Captions must match the edited timeline, not the source. Generate them from the source transcript:

```bash
node scripts/edit.mjs retime edit.json raw/take1.srt > edit.srt
```

Fix any spelling of names or brand words in `edit.srt` before rendering.

## 4. Preview, render, review

```bash
node scripts/edit.mjs plan edit.json
node scripts/edit.mjs render edit.json
```

`plan` shows the ffmpeg command without running it. `render` writes the file in `out`. Render each new version to a new name (`v1`, `v2`, and so on) so the user can compare.

Then give the user the file path and a three line summary: what was cut, the final length, and what was added. Offer the obvious adjustments in plain words: tighter pacing, a different hook, bigger captions, other aspect ratio.

## 5. Iterate

Apply each correction to the EDL exactly as given, then render again. "Cut the part where I say um" means find that moment in the transcript and split or trim the clip. "Move the tip about lighting first" means reorder clips. If a hired employee runs this skill, log each correction the way the kit logs any other correction so the employee learns the user's taste.

For motion graphics effects (checklists, charts, orbits), use the wording in `docs/video-effects/HOW-TO-ASK-GROK-FOR-EFFECTS.md` and tell the user which ones this editor can do (text and timing) and which need another tool.

## Rules

1. Never overwrite or delete source footage.
2. Never post, schedule or upload the video. Publishing is the user's last click.
3. Never invent what was said. Captions come from the transcript or the user.
