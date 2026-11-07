---
name: photocraft
description: Edit a product photo in PhotoCraft when layers, masks, type, color, or a PSD must stay exact. Windows and Linux.
---

# PhotoCraft

PhotoCraft does not ship an agent skill file. Read `INTEGRATIONS.md`, then the "Built for agents" section of `integrations/photocraft/README.md`. Do not copy the PhotoCraft source into this kit.

From this file: `../../../../../integrations/photocraft/README.md`.

## When

The shoot must keep exact pixels, masks, type, color, or a layered PSD. Use it instead of a generative restage when the label has to match the source. The host image tool stays the default for a quick studio look when exact pixels are not required.

## Run

Windows, Linux, macOS, FreeBSD, and a web build are upstream targets. Install a release build, or from the submodule:

```bash
cargo run --release -p photocraft-cli -- --help
```

The upstream README also shows `photocraft-cli run`, `photocraft-cli batch`, and `photocraft-cli mcp`. License is MIT OR Apache-2.0, at the user's option.

## Hold

Write outputs under `studio-work/`. Never overwrite the source photograph. Do not publish.
