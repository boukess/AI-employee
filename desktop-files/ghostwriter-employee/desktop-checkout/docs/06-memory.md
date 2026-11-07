# Keep progress portable

## Working files

When file writing is available, create these only as they become useful:

```
workspace/
  state.json                  phase, identity, capabilities, next action
  identity.md                 who this is, evidence, audience, preferences
  voice-profile.md            evidenced rules and modes
  facts.md                    verified content facts with dates
  source-log.md               found, excluded, unavailable, next sources
  corpus/sources.jsonl        structured retained sources
  corpus/raw/                 optional permitted originals
  corpus/report.json          helper counts, never a voice accuracy score
  feedback.md                 before/after corrections and narrow rules
  briefs/                    writing requests and assumptions
  drafts/                    versioned finished pieces and separate notes
  MY-GHOSTWRITER-MEMORY.txt   compact portable save
```

Do not ask the member to manage this layout. The assistant does the filing. Do not copy private member data into the template distribution, documentation, or somebody else's example.

## Export at meaningful checkpoints

After the initial profile/calibration, substantial corrections, and completed writing sessions, create or update `MY-GHOSTWRITER-MEMORY.txt` following `templates/memory.txt`. Keep it compact: typically 1,000–2,000 words plus a small selection of permitted examples. Include identity evidence, explicit preferences, evidenced voice rules, mode-specific confidence, verified facts and dates, source IDs/locations, feedback, current task, missing access, and next action.

Choose representative original excerpts within permission limits; source IDs alone are not sufficient to recreate voice in a fresh chat. Do not export every private email into a default lightweight save. Include feedback edits only when appropriate. Explain that the memory contains personal writing and is for the member to keep. A sources index can say what was read but cannot recreate missing raw text.

When files can be created, provide a working download link to the save. If useful, also export the complete private `workspace/` as a separate archive after checking for unnecessary sensitive data. Verify files exist and archive contents are correct before claiming a save. Do not bundle the private save into the member-facing starter package.

When no writer exists, provide the memory as one copyable text block with the instruction: “Keep this text. Paste it with GHOSTWRITER.txt in a new chat to continue.” Never claim it was saved to their device or persistent memory.

## Resume

Read the uploaded save before onboarding. Confirm identity only if it conflicts with the current user. Restore explicit preferences, usable examples, and pending tasks; do not reread an inaccessible source and claim success. Preserve the difference between saved source excerpts and links that still need fetching. Recheck time-sensitive facts if needed for the current draft. Continue the next useful action without repeating the entire interview.

Project instructions and saved platform memory can help, but access varies. Treat the portable save as the recoverable handoff. Do not promise that an ordinary new chat will remember everything. “Go” in a fresh chat needs the employee instructions and, for returning users, their memory file.

## Corrections, forgetting, and versioning

Record each user edit with date, draft, before, after, explanation, scope, and derived rule. Keep preferences distinct from facts. Repeated evidence can broaden a rule; one edit does not automatically redefine the whole voice.

If asked to forget a source, remove retained text and examples, remove or revise profile rules and factual claims that relied only on it, rebuild counts, and create a new save. With the helper, `forget --id SOURCE_ID` removes that record only; the assistant must also inspect raw copies, drafts, summaries and saved exports. Explain that previously downloaded copies and platform chat history are outside this folder's deletion control. Do not claim universal erasure.

For “start over,” archive current state rather than silently delete it. An explicit deletion request should be honored within actual tool access. Do not restore excluded or forgotten material from an old save without discussing the conflict.

Stop at the end of the active task. Proactive work happens during an active session unless a real background task is explicitly available and requested. Never imply the zip runs continuously by itself.
