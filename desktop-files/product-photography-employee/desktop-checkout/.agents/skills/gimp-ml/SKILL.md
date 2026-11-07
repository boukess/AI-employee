---
name: gimp-ml
description: Optional generative edit inside GIMP 3 through a member-supplied Gemini or OpenRouter key. Do not store the key.
---

# GIMP-ML

GIMP-ML does not ship an agent skill file. Read `INTEGRATIONS.md`, then `integrations/GIMP-ML/README.md`. Do not copy the plugin into this kit.

From this file: `../../../../../integrations/GIMP-ML/README.md`.

## When

The member already has GIMP 3 and a funded Gemini or OpenRouter account, and they ask for a generative edit inside GIMP. This is not a local model and not the default shoot. Do not ask for a key during ordinary setup. If no key is available, say the edit is pending and use the host image tool or PhotoCraft instead.

## Run

```bash
python3 integrations/GIMP-ML/scripts/install.py --help
```

Install needs GIMP 3.0 or newer and Python 3.10 or newer. On Windows and Linux the key is an environment variable the member sets themselves: `OPENROUTER_API_KEY`, or `GEMINI_API_KEY` / `GOOGLE_API_KEY`. The Settings dialog that stores a key in Keychain is macOS only. Never write a key into this kit, into `gimpml/config.json`, or into a command line that gets logged.

The current plugin sends prompts to the provider. Editing uploads the image only with consent. API use can cost money. Say so before the first call.

## Hold

A new layer is the safe output. Do not replace source pixels unless the member asks. Do not publish.
