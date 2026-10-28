# Optional helpers

The assistant runs these when Python 3.9+ is already available. They use only the standard library and make no network calls. Members can complete the entire writing workflow without them.

From the folder root:

```
python3 scripts/voicekit.py add --help
python3 scripts/voicekit.py --workspace workspace report
python3 scripts/voicekit.py lint workspace/drafts/example.md
python3 scripts/voicekit.py --workspace workspace forget --id SOURCE_ID
```

`add` takes one reviewed UTF-8 TXT, MD, SRT or VTT source and explicit provenance. It stores retained text in `corpus/sources.jsonl`, preserves its input unchanged, removes subtitle timing syntax in an analysis copy, detects exact duplicate wording and warns about strong overlap. It rejects unknown/AI/third-party authorship for style or holdout. The assistant still verifies authorship, rights, speaker separation, sensitive data and overlap. Do not call performed speech a human-written script without evidence.

`report` counts only eligible style records toward style words, keeps held-out samples separate, and counts shared origins once. It does not prove corpus completeness or voice accuracy. Repeated passages within different records require manual removal even when their origins are grouped. Whitespace/tokenization counts are approximate across languages.

`lint` exits 0 for no pattern hits, 1 for review findings, and 2 for an input error. It flags punctuation, canned contrasts, filler and unfinished placeholders. It does not rewrite files. `--allow-dashes` disables dash hints when appropriate; all other hits remain contextual editorial suggestions.

`forget` deletes the selected source record and invalidates a saved metric report. The assistant must also remove raw copies and dependent profile/memory content. This tool is intentionally not a broad filesystem deleter.

`build_release.py` is the maintainer's packager. It compiles the chat edition from the operating files, writes checksums, and uses an explicit file allowlist to exclude personal work. Run without arguments to build, or `--check` to verify that generated output and zip contents match source. No installation or package manager needed.
