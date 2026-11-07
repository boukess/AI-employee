---
name: huashu-motion
description: Make a commercial launch film as editable HTML, with a local score and a browser studio where the member points at a frame to change it.
---

# huashu-motion

Read `INTEGRATIONS.md`, then read and follow the upstream skill in place. Do not copy it into this kit.

Upstream skill: `integrations/huashu-motion/skills/huashu-motion/SKILL.md`

From this file: `../../../../../integrations/huashu-motion/skills/huashu-motion/SKILL.md`.

## When

The member wants a product launch film or explainer drawn as code, with music made locally, and a way to point at a frame and change that spot. Prefer explainroo when the job is a narrated diagram and the machine is Windows, until `om doctor` passes here. Prefer the desktop pack for a talking-head clip.

## Run

The CLI is `bin/om` inside the upstream skill folder. `om doctor` reports what is missing. Needs Node 22 or newer, Chrome, Chromium, or Edge, and ffmpeg. `om samples build` is an optional instrument pack of about 55 MB. Without it the score uses synths. Kokoro narration is an optional model download. Upstream has been tested on macOS only.

Do not add a paid key. The score does not need one.

## Hold

Hand the member the studio URL and the rendered file. Do not post the film.
