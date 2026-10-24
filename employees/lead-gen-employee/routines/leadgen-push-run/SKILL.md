---
name: leadgen-push-run
description: Friday afternoon, never browser. Dry-run Instantly and/or GHL push by default. Live push only when RELEASES.md names the channel and member confirmed.
metadata:
  internal: true
---

## Shared work cycle

After the guard returns `run`, read `WORK-CYCLE.md` and your entry in `work-profile.json`. Apply the contract's work-cycle extension to work selection, scoped blockers, progress evidence and claim recovery. Before closing, write the progress receipt, then the normal run record, then finish the claim with its token. Preserve the remaining budget on a resume. All pause, release and browser guards still apply.


# Push run

**Run the guard before you read anything else past this line.** Through `shell.run`: `node "«LEADGEN_ROOT»/scripts/guard.mjs" leadgen-push-run`. On skip verdicts the guard has already recorded: exit. On `run`, carry on.

## Step 0. The five opening lines

Do these five first, in this order.

### 0.0 Pause switch

`file.read` `«LEADGEN_ROOT»/PAUSED`. If the file exists and is empty or names `leadgen-push-run` on any line, append `skipped-paused` and exit. Never create, write, or delete PAUSED.

### 0.1 Window guard

Read local clock via `clock.local`. Read the `leadgen-push-run` row in `SCHEDULE.md`. Outside the window or wrong day: `skipped-out-of-window` and exit. No first-run window exemption.

### 0.2 Once per period

Honor the period key. If already completed this period and no resume claim: `skipped-already-ran`.

### 0.3 Budget and browser

Honor `budget`. If `browser` is not `never`, take the platform mutex before any page. This routine's shipped lane is `never`.

### 0.4 Corrections and releases

Read Corrections on CONTRACT, ROLE, CAPABILITIES, SCHEDULE, and this file. Read `RELEASES.md` before any push.

Prefer: `node "«LEADGEN_ROOT»/scripts/guard.mjs" leadgen-push-run` before a deep read when the fire may skip.

Reading order after a `run` verdict: CONTRACT, ROLE, CAPABILITIES, this file's body, `recipes/LEAD-DATA-RULES.md`.



## What you own, and the two guardrails

`CONTRACT.md` section 7 is the source. Outbound Instantly/GHL push is held unless `RELEASES.md` says otherwise. Credentials never enter files. This Employee never sends email, SMS or DM.

No clock times live in this file. Times live in `SCHEDULE.md` only.

## Work

1. Read `RELEASES.md`. Default: held.
2. `python3 scripts/leadgen.py push instantly --dry-run` and/or `push ghl --dry-run` when keys exist; skip cleanly when absent.
3. Save dry-run summary paths into `queue/` and name them for standup.
4. Live push only if all are true: channel row in RELEASES.md, member conditions satisfied, and you pass `--yes`. Record what went out in runlog.
5. Never send email/SMS/DM from this kit.


## Deliverable

Named in the steps above. Write a progress receipt under `progress/leadgen-push-run/`, append the run record, finish the claim token, delete the browser lock if you took it.

## Corrections

Format: one line per correction, newest at the top, `YYYY-MM-DD: what was wrong, what to do instead.`

---
