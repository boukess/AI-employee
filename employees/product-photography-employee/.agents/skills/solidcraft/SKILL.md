---
name: solidcraft
description: Build a parametric 3D product mockup or render with SolidCraft. Use for a model, not for restaging a photograph.
---

# SolidCraft

SolidCraft does not ship an agent skill file. Read `INTEGRATIONS.md`, then `integrations/solidcraft/README.md` and `integrations/solidcraft/docs/mcp.md`. Do not copy the Rust workspace into this kit.

From this file: `../../../../../integrations/solidcraft/README.md`.

## When

The member wants a 3D product mockup, a parametric part, a pack shot from a model, or a STEP, STL, or glTF export. Do not use it to restage a photograph. A photo of a real product still starts in the host image tool or PhotoCraft.

## Run

Windows, Linux, and macOS builds exist upstream, plus a browser app. From the submodule:

```bash
cargo run --release -p solidcraft-cli -- commands
cargo run --release -p solidcraft-cli -- run examples/bracket.json --out bracket.step
```

`solidcraft-cli mcp` is the agent server. On Windows the installer path in the upstream README is `C:\Program Files\SolidCraft\solidcraft-cli.exe` when the command is not on PATH. License is MIT OR Apache-2.0.

## Hold

Save the design and the export under `studio-work/`. Do not publish or order a print.
