# Product Photography integrations

The default shoot is still the host image tool: one uploaded product photo, restaged, then checked against the source. These tools are for the jobs that tool cannot do exactly. They are pinned as Git submodules under `integrations/` in the AI-employee repository. This kit does not vendor their source.

Check one out from the AI-employee repository:

```bash
git submodule update --init --recursive integrations/GIMP-ML
```

`node scripts/integration-check.mjs` prints whether each folder is present. `empty` or `missing` means it is not checked out yet. GitHub ZIP downloads do not include submodule contents.

This employee's machines are a Windows desktop (IBP_Desktop) and Linux sessions. A tool that only runs on macOS or on a phone is listed so the employee does not pretend it ran.

genoffice is in the same `integrations/` folder. It is an office suite. It is not a photography tool. Do not wire it into a shoot.

## Which tool

| The member wants | Use | Status on Windows and Linux |
|---|---|---|
| A quick studio restage of an uploaded photo | Host image tool, as in `product-photo-creator` | Ready when the session has an image tool. No install in this kit. |
| Exact pixels, masks, type, color, or a PSD | photocraft | Needs install. Upstream supports Windows, Linux, macOS, FreeBSD, and the web. |
| A 3D product mockup, a parametric part, or a STEP / STL / glTF render | solidcraft | Needs install. Upstream supports Windows, Linux, macOS, and a browser build. |
| A generative edit inside GIMP, with a key the member already has | GIMP-ML | Needs install, and pending a key. Not a local model. Optional. |
| The Mac app Compositor | Do not run it here | Not usable on platform. macOS 26 or later, Apple silicon only. |
| The iOS app PixPic | Do not run it here | Not usable on platform. No desktop build and no agent CLI. |

## How to run

Each skill under `.agents/skills/` points at the upstream README or, where one exists, would point at a skill. These five tools do not ship an agent `SKILL.md`. Follow the README in place. Do not paste the upstream tree into this kit.

### photocraft

License: MIT OR Apache-2.0, at the user's option. README section "Built for agents".

```bash
cargo run --release -p photocraft-cli -- --help
```

Upstream also shows `photocraft-cli run`, `photocraft-cli batch`, and `photocraft-cli mcp`. Release installers cover Windows and Linux, including an AppImage whose `--cli --help` starts the command-line tool. Write outputs under `studio-work/`. Never overwrite the source photograph.

### solidcraft

License: MIT OR Apache-2.0. README plus `docs/mcp.md` and `docs/scripts.md`.

```bash
cargo run --release -p solidcraft-cli -- commands
cargo run --release -p solidcraft-cli -- run examples/bracket.json --out bracket.step
```

`solidcraft-cli mcp` is the agent server. On Windows, if the command is not on PATH, the upstream README names `C:\Program Files\SolidCraft\solidcraft-cli.exe` after the MSI install. Use SolidCraft for a model. Do not use it to restage a photograph.

### GIMP-ML

License: MIT (`LICENSE.md` in the submodule). It is a GIMP 3 plugin that calls Gemini through OpenRouter or Google. There is no local model in the current tree.

```bash
python3 integrations/GIMP-ML/scripts/install.py --help
```

Needs GIMP 3.0 or newer and Python 3.10 or newer. On Windows and Linux the member sets `OPENROUTER_API_KEY`, or `GEMINI_API_KEY` / `GOOGLE_API_KEY`, in the environment GIMP inherits. The Settings dialog that stores a key in Keychain is macOS only. Never write a key into this kit, into `gimpml/config.json`, or onto a command line that gets logged.

Prompts go to the provider. Editing uploads the image only with consent. API use can cost money. Say so before the first call. If there is no key, the generative edit is pending. Use the host image tool or PhotoCraft instead. Do not ask for a key during ordinary onboarding.

### Compositor

License: MIT. Requirements in the upstream README: macOS 26 or later on Apple silicon, and Xcode 26 or later to build. Homebrew is `brew install --cask robbietilton-compositor`.

That is not this employee's platform. Unofficial Windows and Linux ports are named upstream and are not this submodule. Do not treat them as installed. Do not tell the member a Compositor project was opened.

### PixPic

License: MIT. It is a 2017 iOS app (pixel stickers) from an intern project. The README points at an old App Store listing. There is no Windows or Linux target and no agent interface. Do not compile it on the desktop and do not upload product photos to its backend.

## Holds

Draft and save under `studio-work/`. Never overwrite source photographs. Do not publish, send, or buy unless the member names that action. Do not invent a product, a SKU, or a finished file from a tool that did not run.

## Still to install on IBP_Desktop

The host image tool needs nothing from this list.

1. `git submodule update --init --recursive` for PhotoCraft, SolidCraft, or GIMP-ML when a job needs that tool.
2. PhotoCraft: the Windows installer from its GitHub releases, or a Rust build of `photocraft-cli`. Confirm with `--help` before the first real file.
3. SolidCraft: the Windows MSI, or `solidcraft-cli commands` from a local build.
4. GIMP-ML only if the member wants it: install GIMP 3 and Python 3.10 or newer, then `python3 scripts/install.py` with `--gimp` or `--plug-in-dir`. The key stays in the member's environment.
5. Do not install Compositor or PixPic on this PC.
6. No API keys in the repository.

## Smoke test, 7 Nov 2026, Linux

GIMP-ML at the pinned commit `67425686`:

- `python3 scripts/install.py --help` exited 0.
- `python -m unittest discover -s tests -v` ran 53 tests. 42 passed and 11 were skipped because they are macOS Keychain, process, or session checks. No failures. The tests mock HTTP. No provider was called and no key was set.
- `gimp` is not on PATH here, so the plugin was not installed into GIMP. A real edit still needs GIMP 3 and a member key.

PhotoCraft, SolidCraft, Compositor, and PixPic were not executed. Compositor and PixPic would not be usable on this Linux machine even if checked out.
