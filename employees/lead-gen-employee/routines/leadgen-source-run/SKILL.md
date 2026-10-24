---
name: leadgen-source-run
description: Weekday morning, never browser. Sources companies via OSM, CSV, Apollo or Places within default caps into leadgen.db.
metadata:
  internal: true
---

## Shared work cycle

After the guard returns `run`, read `WORK-CYCLE.md` and your entry in `work-profile.json`. Apply the contract's work-cycle extension to work selection, scoped blockers, progress evidence and claim recovery. Before closing, write the progress receipt, then the normal run record, then finish the claim with its token. Preserve the remaining budget on a resume. All pause, release and browser guards still apply.


# Source run

**Run the guard before you read anything else past this line.** Through `shell.run`: `node "«LEADGEN_ROOT»/scripts/guard.mjs" leadgen-source-run`. On skip verdicts the guard has already recorded: exit. On `run`, carry on.

## Step 0. The five opening lines

Do these five first, in this order.

### 0.0 Pause switch

`file.read` `«LEADGEN_ROOT»/PAUSED`. If the file exists and is empty or names `leadgen-source-run` on any line, append `skipped-paused` and exit. Never create, write, or delete PAUSED.

### 0.1 Window guard

Read local clock via `clock.local`. Read the `leadgen-source-run` row in `SCHEDULE.md`. Outside the window or wrong day: `skipped-out-of-window` and exit. No first-run window exemption.

### 0.2 Once per period

Honor the period key. If already completed this period and no resume claim: `skipped-already-ran`.

### 0.3 Budget and browser

Honor `budget`. If `browser` is not `never`, take the platform mutex before any page. This routine's shipped lane is `never`.

### 0.4 Corrections and releases

Read Corrections on CONTRACT, ROLE, CAPABILITIES, SCHEDULE, and this file. Read `RELEASES.md` before any push.

Prefer: `node "«LEADGEN_ROOT»/scripts/guard.mjs" leadgen-source-run` before a deep read when the fire may skip.

Reading order after a `run` verdict: CONTRACT, ROLE, CAPABILITIES, this file's body, `recipes/LEAD-DATA-RULES.md`.



## What you own, and the two guardrails

`CONTRACT.md` section 7 is the source. Outbound Instantly/GHL push is held unless `RELEASES.md` says otherwise. Credentials never enter files. This Employee never sends email, SMS or DM.

No clock times live in this file. Times live in `SCHEDULE.md` only.

## Work

1. `python3 scripts/leadgen.py config check` and `status`. If ICP not ready, record blocker and exit partial/failed per contract.
2. Compute gap vs target. Plan ~2.5x raw companies for local niches.
3. Free first: `source osm` per place/category in ICP. Idempotent merge by domain.
4. If Places key present and budget remains: `source places` with `--dry-run` first; keep `--max-requests` at default unless member raised it.
5. If Apollo key present for B2B ICP: `source apollo` with default pages.
6. CSV paths named in strategy or queue inbox: `source csv`.
7. Re-`status`. Never invent counts. Never scrape Maps/LinkedIn HTML.


## Deliverable

Named in the steps above. Write a progress receipt under `progress/leadgen-source-run/`, append the run record, finish the claim token, delete the browser lock if you took it.

## Corrections

Format: one line per correction, newest at the top, `YYYY-MM-DD: what was wrong, what to do instead.`

---
