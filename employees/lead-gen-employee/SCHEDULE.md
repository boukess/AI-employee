# Lead Gen Employee: the schedule

This file is the only place cadences, fire times, windows, budgets, period keys, and browser lanes live. Every routine reads its own row here at the top of every run, as Step 0.1, and takes `days`, `window_start`, `window_end`, `key`, `budget`, and `browser` from it. **A SKILL.md never carries a clock time.** A registered job may drift from this table without breaking anything, because the window guard catches it and the monthly drift check reports it.

If a routine cannot find its row here, or cannot parse it, it records `status: "failed"` with the blocker `no SCHEDULE.md row for <routine-id>` and exits. **It never guesses a window.**

`CONTRACT.md` section 1 carries the same eight routines with their cadence in words. **Where the two disagree, this file wins**, because this is the file the member edits and the file the guard reads.

All times are 24 hour local machine time (America/New_York for this fleet unless the machine says otherwise). No time in this file is UTC and none is relative to any other zone.

---

## 1. The rows

This table is authoritative. Edit it, and the routines follow on their next fire.

| routine | days | fire | window_start | window_end | key | budget | browser |
|---|---|---|---|---|---|---|---|
| `leadgen-source-run` | `mon-fri` | 06:45 | 06:30 | 09:45 | `YYYY-MM-DD` | 25 min | never |
| `leadgen-desk-standup` | `mon-fri` | 07:30 | 07:15 | 11:30 | `YYYY-MM-DD` | 12 min | never |
| `leadgen-enrich-run` | `mon-fri` | 08:30 | 08:15 | 12:00 | `YYYY-MM-DD` | 35 min | never |
| `leadgen-qualify-run` | `mon-fri` | 10:00 | 09:45 | 13:30 | `YYYY-MM-DD` | 25 min | never |
| `leadgen-export-run` | `mon-fri` | 14:00 | 13:45 | 17:30 | `YYYY-MM-DD` | 20 min | never |
| `leadgen-push-run` | `fri` | 16:00 | 15:45 | 19:00 | `YYYY-Www` | 25 min | never |
| `leadgen-desk-setup` | `first-weekday` | 11:00 | 10:45 | 15:00 | `YYYY-MM` | 45 min | light |
| `leadgen-icp-refresh` | `last-weekday` | 15:00 | 14:45 | 18:30 | `YYYY-MM` | 35 min | light |

Eight rows, eight routines, and every id carries the `leadgen-` prefix so they namespace cleanly beside other AI Employees.

### 1.1 The column meanings

| Column | Meaning |
|---|---|
| `routine` | The routine id. It equals the folder name under `routines/` and the YAML `name` key in that folder's SKILL.md |
| `days` | Which days the routine is allowed to run |
| `fire` | The time to register in whatever schedules this machine |
| `window_start`, `window_end` | The only thing the window guard checks |
| `key` | The period key format used by the once per period guard |
| `budget` | Hard wall clock budget. At budget the routine writes what it has and records `partial` |
| `browser` | How much browser control the routine needs |

### 1.2 The browser column

| Value | Means |
|---|---|
| `never` | Reads and writes files and runs CLI only. Never takes the mutex |
| `light` | Most of the run is local. One capped step may open a page for research |
| `conditional` | Uses the browser on some paths only |
| `heavy` | Navigates and reads for most of its budget |

Pipeline stages (source, enrich, qualify, export, push) are `never` because they call `python3 scripts/leadgen.py` through `shell.run`. Setup and ICP refresh are `light` for public-site research only.

---

## 2. The roster

| routine | display name | cadence | job, one line |
|---|---|---|---|
| `leadgen-desk-setup` | Desk setup | First weekday of the month | Init ICP, doctor, research business home URL, write strategy notes, register jobs, first free sample run |
| `leadgen-icp-refresh` | ICP refresh | Last weekday of the month | Re-test ICP fields against export and score evidence; rewrite config where evidence disagrees |
| `leadgen-source-run` | Source run | Weekdays | Source companies via OSM/csv/apollo/places within caps |
| `leadgen-enrich-run` | Enrich run | Weekdays | Crawl sites and find contacts (hunter/apollo/pattern within caps) |
| `leadgen-qualify-run` | Qualify run | Weekdays | Verify emails and score against ICP |
| `leadgen-desk-standup` | Desk standup | Weekdays | Reconcile status into the morning brief; deliver brief |
| `leadgen-export-run` | Export run | Weekdays | Export CSV and write HTML report |
| `leadgen-push-run` | Push run | Fridays | Dry-run Instantly/GHL push; live only if RELEASES.md |

**`leadgen-desk-standup` is the one that cannot be turned off.** It writes `brief-latest.md`.

**The first run of `leadgen-desk-setup` is exempt from the window guard, and only from the window guard.** Detected by absence of `state/leadgen-desk-setup.json`.

---

## 3. The `days` vocabulary

Closed. Same six values as the Standard.

| Value | Means |
|---|---|
| `mon-fri` | Monday to Friday |
| `mon`, `tue`, `wed`, `thu`, `fri`, `sat` | That single weekday |
| `first-weekday` | Any Monday to Friday date in the first seven days of the calendar month |
| `last-weekday` | Any Monday to Friday date in the last seven days of the calendar month |
| `off` | Registered but disabled. Records `skipped-out-of-window` and exits |

`sun` and `daily` are absent on purpose.

---

## 4. Staggering

Most routines are `never` browser, so lane collisions are rare. Fire times still do not share a minute. Morning order is load bearing: source, then standup, then enrich, then qualify, then afternoon export, Friday push.

```
Every weekday
  06:45  leadgen-source-run      25 min  never
  07:30  leadgen-desk-standup    12 min  never
  08:30  leadgen-enrich-run      35 min  never
  10:00  leadgen-qualify-run     25 min  never
  14:00  leadgen-export-run      20 min  never

Friday adds
  16:00  leadgen-push-run        25 min  never

First weekday adds
  11:00  leadgen-desk-setup      45 min  light

Last weekday adds
  15:00  leadgen-icp-refresh     35 min  light
```

On last-weekday, `leadgen-icp-refresh` fires at 15:00 so it does not share a minute with `leadgen-export-run` at 14:00. Setup owns further fire-time collision repairs.

### 4.3 The mutex

Every routine whose `browser` value is not `never` reads `state/browser-lock.json` before it touches a page. Lock carries a `sites` list (Standard 1.5). Delete on every exit path. Full rule: `CONTRACT.md` section 6.

---

## 5. Registering this table

One job per routine. Point every job at `«LEADGEN_ROOT»/routines/`. Prove `leadgen-desk-standup` by hand before registering eight. The Employee registers these during setup via `CAPABILITIES.md` section 9 routes, or writes `schedule-commands.txt`.

---

## 6. Changing a time

Edit the row here first. Only `leadgen-desk-setup` moves a fire time to clear a collision. Nothing removes a row or sets `days` to `off` except the member.

---

## 7. Turning a routine off

Set its `days` to `off`. Do not delete the row. To stop everything, create empty `PAUSED` at the kit root.

---

## Work-cycle limits

```text
stalled_after_eligible_periods: 2
active_experiments: 2
```

## Corrections

Format: one line per correction, newest at the top, `YYYY-MM-DD: what was wrong, what to do instead.`

---
