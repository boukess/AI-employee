---
name: reanimate
description: Rebuild a reference animation from a site, recording, gif, or Lottie, then prove the copy matches frame by frame.
---

# reanimate

Read `INTEGRATIONS.md`, then read and follow the upstream skill in place. Do not copy it into this kit.

Upstream skill: `integrations/reanimate/skills/reanimate/SKILL.md`

From this file: `../../../../../integrations/reanimate/skills/reanimate/SKILL.md`.

## When

The member points at a live page, a screen recording, an mp4, a gif, or a Lottie file and wants that motion rebuilt in their own code, with a measured comparison. Use it to match a reference, then hand the result to Remotion, huashu-motion, or explainroo if a finished film is still required.

## Run

`bash integrations/reanimate/skills/reanimate/scripts/setup.sh`, then the upstream `bun` scripts with `--help`. Needs Bun 1.1 or newer. The first run downloads a static ffmpeg and Playwright's Chromium, about 250 MB. No API key. Upstream supports macOS and Linux. Windows is untested. Do not start it on Windows until setup.sh prints ready.

Clone only what the member may reuse. Fonts, images, and code from another site stay under their owners' terms.

## Hold

Deliver the code and the comparison. Do not publish it.
