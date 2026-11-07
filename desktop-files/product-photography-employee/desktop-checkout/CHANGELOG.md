# Product Photography Employee: release history

## 1.1.0, 2026-11-07

- The kit now knows PhotoCraft, GIMP-ML, Compositor, SolidCraft, and PixPic. `INTEGRATIONS.md` is the source for when to use each one, how to run it, and whether Windows and Linux can run it.
- Skills under `.agents/skills/` point at the pinned submodules. They do not copy upstream source.
- Compositor is recorded as Mac only. PixPic is recorded as an iOS app. Neither is usable on the Windows desktop or on Linux.
- GIMP-ML stays optional. It needs the member's own provider key and does not store one.
- genoffice is named and left unwired.
- The host image tool remains the default for a quick studio restage.
- `scripts/integration-check.mjs` reports checkout state and does not install packages.

## 1.0.0, 2026-10-13

- Initial conversational kit. Host image tools restage an uploaded product photo. No scheduled routines.

The version this kit ships as lives in `VERSION`. This file is written by the people who publish the kit and **no routine ever writes it**.
