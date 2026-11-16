# Video Editor Employee: release history

## 1.1.0, 2026-11-16

- New skill `motus-clarity` under `.agents/skills/`: the Motus method for clear, concise talking-head edits. Understand the take first, cut every pause of 0.30 s or more and every retake, plan scene by scene with 2 to 4 distinct options, keep on screen only what was said or captured, and review stills before handover.
- The Motus engine stays out of this kit. It is MIT and macOS only, so on IBP_Desktop the desktop pack still renders and applies the method to its plan.

## 1.0.0, 2026-11-07

- First in-repo kit for the IBP_Desktop editor. The desktop pack stays at `C:\Users\blood\AI Video Editor` and is not copied here.
- Free DaVinci Resolve 21.1.2 is the talking-head path: FFmpeg render, FCPXML export, Remotion graphics. No external Resolve scripting.
- `INTEGRATIONS.md` wires take-one, rossark-motion-skill, huashu-motion, reanimate, argo, explainroo, video-director, earshot, real-sound, and Concat.
- Skills under `.agents/skills/` point at the pinned submodules. They do not copy upstream source.
- Concat stays a separate AGPL-3.0-or-later program.
- genoffice is named and left unwired.
- `scripts/integration-check.mjs` reports checkout state and does not install packages.

The version this kit ships as lives in `VERSION`. This file is written by the people who publish the kit and **no routine ever writes it**.
