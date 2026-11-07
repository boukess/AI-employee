# Using free DaVinci Resolve

This pack was built for DaVinci Resolve **Studio**. Since Resolve **21.1**, Blackmagic moved Python scripting, external scripting and the bundled ResolvePython interpreter to Studio only ("We have moved the ability to script in Python to the Studio version" — Resolve 21.1 release notes). The free edition can no longer be driven by the pack's `resolve_bridge.py`.

**Free mode** keeps the whole pipeline and replaces only the three Resolve-driven steps. It is switched on in `config/editor.json`:

```json
"resolve_edition": "free",
"free_render": {"crf": 17, "preset": "medium"}
```

(or set the environment variable `AI_VIDEO_EDITOR_RESOLVE_EDITION=free`). Set `"studio"` to go back to the original Studio bridge; nothing else changes.

## What changes in free mode

| Step | Studio mode | Free mode |
| --- | --- | --- |
| `doctor` | needs a live Resolve scripting connection | checks Python/Node/Remotion/FFmpeg/models; reports the installed Resolve edition (Windows registry); no connection needed |
| `new`, `analyze`, `presenter`, `prepare`, `motion` | unchanged | unchanged (faster-whisper transcription, RVM matting, FFmpeg audio mastering, Remotion graphics + captions never used Resolve) |
| `assemble` | creates a Resolve project + .drp backup | writes `jobs/<job>/resolve-free/<name>.fcpxml` (V1 edited footage, V2 Remotion alpha graphics + captions, A1 mastered dialogue) and `IMPORT-INTO-RESOLVE.txt` |
| `render` | Resolve Deliver, H.264 MP4 | FFmpeg composite of the same layers: 8-bit H.264 (yuv420p) MP4 |
| `status`, `finish` | poll Resolve render job | report the FFmpeg render; `finish` runs the same frame/duration/loudness checks and writes `exports/` |

Free mode refuses sizes above the free edition's limits (Ultra HD 3840x2160, 60 fps). The default 1080x1920 at 30 fps is well inside them.

## Opening the edit in free Resolve (optional)

The finished MP4 comes from `render`/`finish`. To polish by hand in free Resolve:

1. Open DaVinci Resolve (free) and a project.
2. **File > Import > Timeline...** and pick the `.fcpxml` in `jobs/<job>/resolve-free/`. Keep "automatically import source clips" ticked.
3. If the V2 graphics show black instead of see-through, set Clip Attributes > Video > Alpha mode to **Straight** on `motion.mov`.
4. Export on the Deliver page as MP4 / H.264, 1080x1920, 30 fps.

No script has to be installed into Resolve, and no Resolve preference has to change.

## Not available in free Resolve (and not used by this pack)

Neural Engine tools (Magic Mask, Voice Isolation, Speed Warp, Super Scale, Smart Reframe, AI transcription), temporal/spatial noise reduction, exports above UHD/60 fps, 10-bit H.264/H.265 encoding, hardware H.264/H.265 encode acceleration, Python/external scripting and the Resolve MCP. The pack covers what it needs with local tools: faster-whisper for transcripts and captions, RVM for the presenter matte, FFmpeg for audio cleanup/loudness and the final render, Remotion for graphics.

## Honest limits of free mode

- Cut `transform`s are applied by the FFmpeg render (ZoomX/ZoomY/Pan/Tilt only), but not written into the FCPXML; re-apply them in the Inspector if you finish in Resolve.
- No `.drp` project backup is created (that needs Studio scripting). The FCPXML is the editable timeline.
- Tested 4 Nov 2026 on IBP_Desktop (free Resolve 21.1.2): doctor ready, and new → analyze → prepare → motion → assemble → render → finish passed on a synthetic clip (exact frame count, audio at target). The FCPXML follows the FCPXML 1.9 spec but its import into Resolve has not been tried yet; check it on the first real job.
