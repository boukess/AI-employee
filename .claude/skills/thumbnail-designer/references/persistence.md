# Persistence and handoff

The member's working library belongs to `workspace/`. The original community
package remains a clean template; never overwrite it with a member's portraits,
transcripts, or corpus. In an environment without a real filesystem, retain the
same structure in downloadable artifacts or a clearly labeled text checkpoint.

## Durable files

Copy templates only for absent files. Update existing state without discarding
fields. Use relative paths within `workspace/` and stable IDs; avoid machine-specific
absolute paths in saved JSON. Mark genuinely unknown values as null or unknown,
not invented values. Read existing files before writing, and preserve completed work.

| File | Purpose |
| --- | --- |
| `profile.json` | Creator context, preferences, evidence, unresolved questions |
| `state.json` | Current phase, agreed research target, actual counts, next action |
| `assets/registry.json` | Portraits, logos, screenshots, and object reference provenance |
| `corpus/competitors.jsonl` | Creator scope and match rationale |
| `corpus/candidates.jsonl` | Unverified discoveries to revisit |
| `corpus/references.jsonl` | Structured observations of real thumbnail sources |
| `corpus/images/` | Local reference images when retrievable |
| `corpus/patterns.md` | Design findings tied to actual reference IDs |
| `corpus/research-log.md` | Queries, batches, inaccessible sources, coverage gaps |
| `jobs/<job-id>/` | Brief, reference shortlist, prompts, final images, QA, revisions |
| `SESSION-CHECKPOINT.md` | Human-readable resumption instructions |

Use the reference row format in research.md. Do not mix generated thumbnails,
mock fixtures, or candidates into the verified research count. Recompute counts
from actual records; state counters are cached summaries, not evidence.

`state.phase` can be `onboarding`, `research`, `ready`, `design`, or `handoff`.
`research_status` can be `not_started`, `in_progress`, `partial`, or `complete`.
A `ready` phase for a requested design does not imply a completed corpus. Track
both separately. Save updated timestamps, completed batches, coverage gaps, and
an explicit next action. Do not quietly replace targets with current counts.

## Asset registry

Start `workspace/assets/registry.json` as `[]` from `templates/assets.json`. Each
entry records the asset's real origin and how it can be used:

```json
{
  "id": "asset-001",
  "role": "identity",
  "label": "Member portrait",
  "local_path": "assets/portraits/asset-001.jpg",
  "source_kind": "member_upload",
  "source_page_url": null,
  "source_image_url": null,
  "acquired_at": "YYYY-MM-DD",
  "inspected": true,
  "usage_notes": "Use as likeness reference for this member's thumbnails.",
  "preserve": ["recognizable facial features"],
  "limitations": []
}
```

This is a format example, not an existing asset. For public references use
`source_kind: "public_web"`, actual source URLs, and observed rights/attribution
information if supplied by the source. Being visible online is not proof of a
license. Record unknown rights as unknown; do not invent permission. Identity
selection must refer to the member's provided or explicitly selected portrait.

## Batch checkpoint

After each research batch or finished thumbnail, save a short checkpoint containing:

1. The creator, audience, topic groups, and key saved preferences.
2. The actual verified count, creator count, topic coverage, and local image count.
3. The agreed targets and outstanding gaps or unavailable sources.
4. The last completed action, active job, and concrete next action.
5. Missing or temporary assets that must be reattached.
6. Files required to resume, with relative paths.

In a long research run, continue useful batches within the current session until
targets are met, tools/limits prevent progress, or the member changes the task.
Save before context exhaustion. Do not promise to finish “in the background” after
the turn ends. Report what is done and what the next session should continue.

## ChatGPT and upload-only handoff

When downloadable file creation is available, provide an updated
`AI-Thumbnail-Workspace-<date>.zip` containing the member's workspace: profile,
state, corpus index and images, assets, job outputs, and checkpoint. Keep the
package under `workspace/` inside the archive so it can be recognized on resume.
Exclude unrelated files, credentials, caches, and original transcripts unless
they are needed for a saved job or the member asks to retain them. Do not package
the export inside itself.

If the workspace is too large for practical transfer, split images into labeled
archives and provide the index/state/checkpoint separately. Name every part in the
checkpoint. Do not call an index-only export the full visual library. URL-only
references may expire and may need to be viewed again in a new session.

If file creation is unavailable, show a copyable checkpoint with the profile,
counts, source references, current prompt, and next action, and explain that the
full image corpus has not been exported. Never create a fake download link.

In a future chat, the member should reattach the guide plus the saved workspace
or add both as accessible project files. Access in an earlier chat is not proof
the current session has the files. Read the actual attachments and reopen the
small set of images needed for the next job.

## Reset and refresh

When the member wants a different niche, keep the old workspace and create a new
one or a named separate collection. When they want a research refresh, retain
historical observations and append date-specific notes, rather than presenting
old metrics as current. Do not delete useful research, original portraits, or
completed thumbnails simply to simplify the folder.
