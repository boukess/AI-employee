---
name: earshot
description: Listen to, measure, and make sound with earshot before saying how audio sounds. Covers mix review, sound effects in code, and sync.
---

# earshot

Read `INTEGRATIONS.md`, then read and follow the upstream skill in place. Do not copy it into this kit.

Upstream skill: `integrations/earshot/skills/earshot/SKILL.md`

From this file: `../../../../../integrations/earshot/skills/earshot/SKILL.md`.

## When

You are about to say how a mix, a hit, or a piece of music sounds, or the film needs sound effects made in code. Quote earshot's numbers. Do not invent a listening impression. For a soundtrack built only from real licensed recordings, also read the `real-sound` skill in this kit.

## Run

```bash
python3 -m venv integrations/earshot/.venv
integrations/earshot/.venv/bin/python -m pip install -e "integrations/earshot[mcp]"
integrations/earshot/.venv/bin/python -m earshot doctor
```

On Windows the interpreter is `.venv\Scripts\python.exe`. Needs Python 3.10 or newer and ffmpeg. CPU only. `doctor --fetch` downloads about 1.1 GB of models. `measure`, `sfx`, and `kit` load none. Fetch models only when a listening command needs them.

The `llm` command calls Gemini only with the member's own key and an explicit yes. Never write that key into this kit.

## Hold

Save reports next to the job. Do not publish audio.
