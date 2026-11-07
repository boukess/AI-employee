# Release validation

Version: 1.0.0. Date: October 13, 2026.

The package is a portable instruction workflow. Script checks cannot establish how every model will follow its instructions.

## Scope

Local source intake, provenance constraints, source counts, duplicate handling, editorial lint, the generated chat edition, release privacy boundaries, deterministic packaging, and a founder proof run.

## Executed checks

- **22 automated tests passed** with Python 3.9.6 using `python3 -m unittest discover -s tests -v`.
- Corpus tests exercised actual intake, exact duplicates across punctuation, near-duplicate warnings, source-origin grouping, holdout separation, invalid-record preservation, authored-source requirements, subtitle cleanup, CLI reporting, and record removal with stale-report invalidation.
- Editorial checks exercised canned contrast phrases, dash preferences, filler and unfinished placeholders. They explicitly do not determine AI authorship or writing quality.
- Packaging tests verified the runtime manual is fully embedded in the single TXT edition; private paths, populated workspace paths, traversal and symlink entries are rejected; zip bytes are deterministic and manifest hashes round-trip.
- Local founder proof: six sources, 1,147 retained words, including 350 words of a direct planning message and 797 words from five performed-video transcripts. Speaker attribution is based on local project context; original script authorship remains unknown. The corpus is provisional and has no independent holdout.
- Three founder drafts were produced and reviewed: email (191 words), article (635 words), nonfiction process story (519 words). All three had no linter pattern hits. The drafts are assistant-generated, not evidence of a confirmed voice match.
- The setup HTML passed static checks for its local text-file link, unique IDs, copy/status bindings, and JavaScript syntax. No visual or click-test pass is claimed: the available browser blocked local file URLs, and the block was not bypassed.

## Instruction review, not live model tests

Reviewed the intended response paths for unknown identity, ambiguous names, absent browsing, no writing samples, stale memory, login walls, AI-assisted samples, someone else's corpus, multiple writing modes, resuming a portable save, source removal, and drafts with unsupported facts. The manual provides a concrete fallback for each. These were an editorial review of the workflow, not a consumer-model benchmark.

The founder discovery run actually encountered and excluded another creator's reference corpus, and logged unavailable old transcript paths. It used direct reads and existing files; browser automation, Playwright and new transcription were unnecessary for that pass.

## Platform limits

Clean-chat execution in the consumer Claude and ChatGPT products is not claimed by the offline test suite. A zip's acceptance depends on the host. The TXT fallback is included and has all required runtime instructions. Real users must calibrate the writing with their own edits.

The member archive contains no founder corpus, private demo drafts, personal save, or populated workspace. Build with `python3 scripts/build_release.py`; verify current source, archive bytes and CRC with `python3 scripts/build_release.py --check`. The public manifest records each distributed file's byte count and SHA-256.
