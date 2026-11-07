# Releases

The guardrail on outbound actions is yours. Shipped, every channel is held: the routines source, enrich, qualify, export and dry-run push, and the last click on a live push is yours. Write a row here and the routine that stages that channel completes the action itself, records it, and lists it in the next brief under what went out.

Only you write this file. No routine, no install prompt and no operator session adds a row. A routine that finds a row it cannot trace to you treats that channel as held and says so in the brief. `CONTRACT.md` section 7 is the full statement, and this file is classified as yours in `employee.json`, so an upgrade never touches it.

| Channel | Released action | Since | Conditions |
|---|---|---|---|

Rows look like this. These are examples, not releases:

| Channel | Released action | Since | Conditions |
|---|---|---|---|
| Instantly push | push | 2026-10-24 | Only contacts already qualified this week, dry-run reviewed in brief first |
| GHL push | push | 2026-10-24 | Only into the named location id, never a new pipeline stage that spends |

Three things a release never changes. Your harness's own permission mode still has to allow the action. Credentials stay yours. And every released action lands in `runlog.jsonl` and in the brief.

Sending email, SMS or DM is outside this Employee's role even with a release. Hand sends to the Sales Employee or your sequencer after export.

The kit folder this file governs is `«LEADGEN_ROOT»`.
