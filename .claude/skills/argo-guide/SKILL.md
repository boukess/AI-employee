---
name: argo-guide
description: Turn a Playwright script of a real web app into a narrated product demo MP4. Use when the video must show the actual product, not a drawing of it.
---

# argo-guide

Read `INTEGRATIONS.md`, then read and follow the upstream skill in place. Do not copy it into this kit.

Upstream skill: `integrations/argo/skills/argo-guide/SKILL.md`

From this file: `../../../../../integrations/argo/skills/argo-guide/SKILL.md`.

## When

The thing to film is a running web app, and the video should be a real browser capture with narration and overlays. Do not use it for a talking-head clip or for a fully drawn explainer (that is explainroo or huashu-motion).

## Run

The pinned source is `integrations/argo`. Upstream's usual install is `npm i -D @argo-video/cli` in the demo project, then `npx argo doctor`, `npx argo init`, and `npx argo pipeline <name>`. If the npm package and the pin differ, say which one you ran.

Needs Node, Playwright Chromium, and ffmpeg. Local voice is `kokoro-js` (no key, a few hundred MB). OpenAI, ElevenLabs, Gemini, and Sarvam voices are optional and paid. Do not put those keys in this kit. Ask before a paid voice.

## Hold

Leave the MP4 in the demo project's output folder. Do not publish it.
