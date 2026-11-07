# Optional local library tools

These tools help the employee manage a large saved corpus. Members do not need
to run commands. Use them when Python 3.9+ and the package files are available;
otherwise perform the same recordkeeping with the environment's native tools.
They use the Python standard library, require no installation or API keys, and
make no network requests.

Run from the downloaded project root. `--workspace workspace` identifies the
**member data folder**, which contains `state.json` and `corpus/`; it is not the
outer project directory. An image path inside a reference row is relative to
that folder, for example `corpus/images/ref-000001.jpg`.

Create `workspace/corpus/references.jsonl` as an empty UTF-8 file before the first
batch if it does not exist. Do not erase a populated corpus. Initialize profile
and state from templates only when absent.

```bash
python3 scripts/library.py validate --workspace workspace
python3 scripts/library.py status --workspace workspace
python3 scripts/library.py shortlist --workspace workspace --query "balcony vegetable garden" --limit 12
python3 scripts/library.py gallery --workspace workspace --output workspace/corpus/gallery.html
```

## What the commands mean

- **validate:** Check required record fields, dates, duplicate identifiers/source
  URLs/image URLs/paths/hashes, available local image paths, and stated hashes.
  Invalid rows and all rows in a duplicate group are excluded from verified counts;
  resolve duplicates by merging their evidence into one canonical record.
- **status:** Report validated, viewed, unviewed, local-image, and viewed URL-only
  counts. Compare coverage against all three values in `state.research_target`.
  Creators use canonical creator URLs; primary topic clusters use `topic_tags[0]`.
  Normalize creator URLs and synonymous clusters during research so counts are meaningful.
- **shortlist:** Rank only valid viewed rows by transparent lexical matches in
  titles, tags, visual hooks, and relevance notes, with passes across distinct
  creators. This is a starting list for editorial judgment, not semantic search
  or a performance prediction. It returns no references if no terms match.
- **gallery:** Write a static HTML contact sheet with local images and source
  links. It labels viewed URL-only references without automatically fetching them.
  Open the page to browse the library; the images must travel with it.

Results are JSON. Exit code 0 means no structural errors were found; it does not
mean the research target has been met. Check `research_complete` and every coverage
criterion. Exit code 1 reports missing/invalid data; keep the report and correct the
records instead of treating a partial subset as complete. The tool reads state
but does not update it; the employee saves the verified counts and next action.

The validator cannot prove that a model viewed an image, verify source truth,
decode every image format, detect visually identical re-encodings, or judge
comparability. Research still requires actual source and image inspection. The
gallery never marks an image as inspected merely because its HTML was generated.

If using only `CHATGPT-STARTER.txt`, these scripts may not be attached. The guide
contains the schemas and workflow needed to maintain and retrieve the library
without them. Do not ask the member to install Python just to proceed.
