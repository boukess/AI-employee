---
name: explainroo
description: Make a narrated explainer or drawn product demo MP4 with a local voice. Use for how-to, diagram, and tutorial films.
---

# explainroo

Read `INTEGRATIONS.md`, then read and follow the upstream skill in place. Also read `integrations/explainroo/AGENTS.md` before making a video. Do not copy those files into this kit.

Upstream skill: `integrations/explainroo/skills/explainroo/SKILL.md`

From this file: `../../../../../integrations/explainroo/skills/explainroo/SKILL.md`.

## When

The member wants a narrated explainer, how-to, diagram, tutorial, or a product demo drawn to match a site. This is the code-film tool with the clearest Linux, macOS, and Windows evidence. Talking-head footage still goes through the desktop pack.

## Run

```bash
git submodule update --init --recursive integrations/explainroo
node integrations/explainroo/bin/explainroo.js doctor
node integrations/explainroo/bin/explainroo.js --help
```

Needs Node.js 20.11 or newer, ffmpeg, and Chrome or Chromium. `doctor --fetch` downloads the English voice and timing models, about 400 MB. Wait for a narrated render before fetching. espeak-ng is only for Spanish, French, Italian, Portuguese, and Hindi. Japanese and Chinese need Python with misaki. ElevenLabs and OpenRouter images are optional and paid. Do not put keys in this kit.

## Hold

Tell the member where the MP4 is and what `verify` said. Do not publish it.
