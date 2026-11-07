# Components and reference media

This folder contains the editing workflow and a curated visual-reference pack supplied for it. The reference clips are for studying layout and motion, not for inserting someone else's face or voice into member exports. Their source links are recorded in references/corpus/manifest.jsonl and the reference gallery. Inclusion does not transfer ownership of third-party footage, logos or product interfaces.

- Remotion is installed by npm from the pinned lockfile. Its [license](https://www.remotion.dev/license) and dependency notices apply; this ZIP does not grant a separate Remotion license or include a Resolve Studio license.
- Poppins and Instrument Serif font files are included with their SIL Open Font License texts in public/fonts. Times New Roman is read from the operating system and is not redistributed.
- The foreground model is downloaded from [Robust Video Matting](https://github.com/PeterL1n/RobustVideoMatting), whose upstream code/license governs that component. The model is not represented as employee-authored.
- Python dependencies and their licenses are installed into .venv by pip; JavaScript dependency notices remain in node_modules after npm ci.
- Example product assets are genuine third-party assets; their sources and processing are listed in public/assets/example-editor/sources.json. The same provenance pattern applies to new edits.

No source-license/provenance note in this package is intended to appear as a video overlay.
