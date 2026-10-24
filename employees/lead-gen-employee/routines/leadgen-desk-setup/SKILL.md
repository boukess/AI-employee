---
name: leadgen-desk-setup
description: Runs once by hand on the first day and once a month on the first weekday, light browser lane. Inits ICP, runs doctor, researches the business home URL, registers routines, and starts a free sample path. Holds every push. Never enters a credential.
metadata:
  internal: true
---

## Shared work cycle

After the guard returns `run`, read `WORK-CYCLE.md` and your entry in `work-profile.json`. Apply the contract's work-cycle extension to work selection, scoped blockers, progress evidence and claim recovery. Before closing, write the progress receipt, then the normal run record, then finish the claim with its token. Preserve the remaining budget on a resume. All pause, release and browser guards still apply.


# Desk setup

**Run the guard before you read anything else past this line.** Through `shell.run`: `node "«LEADGEN_ROOT»/scripts/guard.mjs" leadgen-desk-setup`. On skip verdicts the guard has already recorded: exit. On `run`, carry on.

## Step 0. The five opening lines

Do these five first, in this order.

### 0.0 Pause switch

`file.read` `«LEADGEN_ROOT»/PAUSED`. If the file exists and is empty or names `leadgen-desk-setup` on any line, append `skipped-paused` and exit. Never create, write, or delete PAUSED.

### 0.1 Window guard

Read local clock via `clock.local`. Read the `leadgen-desk-setup` row in `SCHEDULE.md`. Outside the window or wrong day: `skipped-out-of-window` and exit. First run exemption: if `state/leadgen-desk-setup.json` is missing, skip the window check only and note it.

### 0.2 Once per period

Honor the period key. If already completed this period and no resume claim: `skipped-already-ran`.

### 0.3 Budget and browser

Honor `budget`. If `browser` is not `never`, take the platform mutex before any page. This routine's shipped lane is `light`.

### 0.4 Corrections and releases

Read Corrections on CONTRACT, ROLE, CAPABILITIES, SCHEDULE, and this file. Read `RELEASES.md` before any push.

Prefer: `node "«LEADGEN_ROOT»/scripts/guard.mjs" leadgen-desk-setup` before a deep read when the fire may skip.

Reading order after a `run` verdict: CONTRACT, ROLE, CAPABILITIES, this file's body, `recipes/LEAD-DATA-RULES.md`.



## What you own, and the two guardrails

`CONTRACT.md` section 7 is the source. Outbound Instantly/GHL push is held unless `RELEASES.md` says otherwise. Credentials never enter files. This Employee never sends email, SMS or DM.

No clock times live in this file. Times live in `SCHEDULE.md` only.

## Work

1. `python3 scripts/leadgen.py init` then `doctor --network` from `«LEADGEN_ROOT»`.
2. If `config/icp.json` missing or not configured: research `«HOME URL»` via `web.fetch` / light browser; copy nearest `config/examples/*.json`; fill ICP; `config check`.
3. Write `strategy/` notes (offer, buyer, geo, assumptions). No secrets.
4. Reconcile `SCHEDULE.md` shape; register eight jobs or write `schedule-commands.txt`.
5. First free sample: OSM per ICP, or `source csv data/samples/companies_sample.csv`, then crawl, local verify, score, export, report.
6. Never live push. Name export paths in the report.
7. Write `state/leadgen-desk-setup.json`.

On monthly runs: re-read evidence, refresh strategy notes, carry member ICP edits verbatim where intentional, re-run doctor, drift-check schedule registration.


## Deliverable

Named in the steps above. Write a progress receipt under `progress/leadgen-desk-setup/`, append the run record, finish the claim token, delete the browser lock if you took it.

## Corrections

Format: one line per correction, newest at the top, `YYYY-MM-DD: what was wrong, what to do instead.`

---
