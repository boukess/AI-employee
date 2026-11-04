# Free DaVinci Resolve mode: source copy

The AI Video Editor pack itself lives on IBP_Desktop at `C:\Users\blood\AI Video Editor` and is not stored in this repo. This folder keeps the free-mode change set so it can be re-applied to a fresh copy of the pack:

- `free_resolve.py` goes in the pack's `scripts/`. It writes the FCPXML timeline and does the FFmpeg render.
- `pack-changes.patch` is a unified diff against the original v1.0.0 pack. It covers `scripts/editor.py`, `scripts/runtime.py`, `scripts/setup.py`, `config/editor.json`, the docs, and `docs/FREE-RESOLVE.md`. Apply it from the pack root with `git apply pack-changes.patch` or `patch -p1`. On IBP_Desktop, AGENTS.md and GROK.md carry add-on edits, so those two hunks were applied there by hand.

On IBP_Desktop every changed file has a `*.studio-backup` copy next to it. To go back to Studio behaviour, set `"resolve_edition": "studio"` in `config/editor.json`, or restore the backups.

See `../FREE-DAVINCI-RESOLVE.md` for how to use it.
