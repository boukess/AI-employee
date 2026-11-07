# AI Video Editor (Grok)

Local short-form editor pack for the business, adapted for Grok Bot.

**Installed on IBP_Desktop:** `C:\Users\blood\AI Video Editor`

**Teammate:** Video Editor Employee

## What it does

Cleans takes and pauses, adds captions, creates custom animations, brings in real logos and product visuals, builds the head-over-frame presenter effect, and boosts dialogue for phone playback. You give feedback on the finished MP4.

## Prerequisites (separate from the pack)

- DaVinci Resolve: **free edition 21.1.2 is installed on IBP_Desktop** (at `E:\New folder (2)`). The pack runs in **free mode** (`"resolve_edition": "free"` in `config/editor.json`): it exports an FCPXML timeline and renders the MP4 with FFmpeg. See [FREE-DAVINCI-RESOLVE.md](FREE-DAVINCI-RESOLVE.md). Studio 21.1+ (External scripting → Local) is only needed for `"resolve_edition": "studio"`.
- Node.js 22+ (installed at `C:\Users\blood\Tools\node-v24.22.1-win-x64`)
- Python 3.12

## First run

1. Open Grok Bot with desktop tools on IBP_Desktop.
2. Paste `C:\Users\blood\AI Video Editor\prompts\01-SETUP.txt` (or ask [@Video Editor Employee](grokbot://app/v1/agent?id=ac14c2cd-339a-4db4-993d-5b705e147a02) to run setup).
3. Drop one vertical MP4/MOV into `inbox`.
4. Say **Edit my video.**
5. Watch `exports` for the finished file.

See `docs/SETUP-GROK.md` and `HOW-TO-ASK-GROK-FOR-EFFECTS.md` in this folder for briefing style.

## Creative integrations

Code films, product demos, matched animation, and sound tools are wired in the in-repo kit at `employees/video-editor-employee`. Read `INTEGRATIONS.md` there before choosing one. The talking-head path in this file does not change. Concat stays a separate AGPL program and is not copied into the pack. genoffice is not a video tool.
