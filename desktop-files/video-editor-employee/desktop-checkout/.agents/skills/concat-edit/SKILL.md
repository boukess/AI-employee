---
name: concat-edit
description: Run Concat as a separate AGPL video editor when free Resolve cannot script the cut. Do not copy Concat source into this kit.
---

# Concat

Concat is AGPL-3.0-or-later. This kit is MIT. Run Concat as its own program. Do not copy, translate, or vendor its source into this kit, and do not merge it into the desktop pack.

Do not follow `integrations/Concat/.claude/skills/run-concat/SKILL.md` for a member edit. That file is for people changing Concat's own code.

Read these in place:

- `integrations/Concat/README.md`
- `integrations/Concat/docs/MCP.md`

## When

Free DaVinci Resolve on this fleet has no external scripting, so the talking-head pipeline renders with FFmpeg and exports FCPXML. Keep that path for "Edit my video". Use Concat when the member asks for it, or when the edit needs a scriptable editor (multi-track cuts, local captions, background removal) that the free Resolve pack cannot drive.

## Run

On Windows, install the x86_64 release build from Concat's GitHub releases. Do not build the submodule into this kit. A source build, if someone chooses it, needs Rust 1.93 or newer, FFmpeg 7 development libraries, cmake, and a C++ compiler, then `cargo run -p concat` from `integrations/Concat/src` (the Cargo workspace is `src/`, not the repository root).

Once the binary is on PATH, `concat --mcp` is the agent entry named in the upstream docs. Optional caption, voice, and cutout models download inside the app. No key goes in this kit.

## Hold

Concat is beta. Leave the project file and the export for the member. Do not publish.
