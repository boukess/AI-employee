---
name: video-director
description: Direct and measure a code-rendered video (HTML, Canvas, GSAP, or Remotion). Use to plan and QA a film. It does not edit live-action footage.
---

# video-director

Read `INTEGRATIONS.md`, then read and follow the upstream skill in place. Do not copy it into this kit.

Upstream skill: `integrations/video-director/video-director/SKILL.md`

From this file: `../../../../../integrations/video-director/video-director/SKILL.md`.

## When

A code-rendered film needs a timed plan and a measured check: launch films, explainers, Remotion graphics, loops, and reels. Use it on top of Remotion, huashu-motion, explainroo, or take-one. Do not use it as the editor for live-action talking-head footage. Its story and timing notes can still inform that edit.

## Run

```bash
python3 integrations/video-director/video-director/scripts/check_timeline.py timeline.json
python3 integrations/video-director/video-director/scripts/qa_video.py film.mp4 --out qa/
```

Needs ffmpeg, ffprobe, Python 3, numpy, and Pillow. Rendering stays with the film's own tool. faster-whisper is optional, for checking narration.

## Hold

Report the measurements you actually ran. Do not claim a check that did not run. Do not publish the film.
