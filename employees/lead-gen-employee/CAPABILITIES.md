# Lead Gen Employee: capabilities

This file maps each named capability to a concrete route per harness. Routines name capabilities. They never name vendor MCP selectors inside SKILL bodies except as documented CLI invocations of `scripts/leadgen.py` through `shell.run`.

`confirmed` appears only where actually confirmed on a machine. `expected` and `unknown` are honest. Member writes live detections into `## Corrections`.

---

## 1. How to check what your harness supports

At the top of every run, detect live. Cache nothing across days. Answer for yourself: does browser control attach to a signed-in browser or a clean one? Which connected sources from section 4b are present and read only?

---

## 2. The eleven harnesses, honestly

Same roster as sibling kits: Claude Code, OpenClaw, Hermes, OpenCode, Grok Bot, Codex, Antigravity, Pi, Cline, Qwen Code, DeepSeek. Grok Bot: kit lives on the shared cloud computer; paste `AGENTS.md` into Instructions; one recurring task per routine; brief delivers through the bot thread.

---

## 3. Environment and files

| Capability | Route |
|---|---|
| `file.read` / `file.write` | Harness file tools scoped to `«LEADGEN_ROOT»` |
| `clock.local` | `date` / PowerShell time zone commands via `shell.run` |
| `shell.run` | Required for `python3 scripts/leadgen.py` and Node helpers |

**Python 3.9+** required. Standard library only for the leadgen package. **Node 18+** for guard/runlog/copy-check/work-cycle.

Never write credentials into files. `.env` is member owned. `doctor` prints which keys are set without values.

---

## 4. Browser

Most routines are `browser: never`. Setup and ICP refresh may use light `web.fetch` preferred, then `browser.navigate` + `page.text` for public pages only.

**Barred surfaces for scraping:** Google Maps, LinkedIn, Yelp, Facebook business pages. Places API via CLI is the Maps route. Professional networks stay read only on the Sales Employee if needed.

Mutex: `state/browser-lock.json` with `sites` list. See `CONTRACT.md` section 6.

---

## 4b. Connected sources

Prefer connected readonly routes over browser. Never install a connector from a routine.

| Capability | What it reads / does | Routes | Read only | Confidence |
|---|---|---|---|---|
| `people.search` | Named contacts, company search | Apollo / Hunter keys in `.env` via CLI; harness Apollo connector if present | yes for search | `expected` |
| `places.search` | Local businesses | `GOOGLE_PLACES_API_KEY` via `source places` | yes | `expected` |
| `email.verify` | Deliverability | Hunter / Instantly verify via CLI | yes | `expected` |
| `crm.push` | Push contacts | Instantly / GHL via CLI | no; held by RELEASES.md | `expected` |
| `web.fetch` | Public pages | harness fetch / shell curl | yes | `expected` |

Absent: free path still works (OSM + crawl + local MX verify + score + CSV).

---

## 5. Research and notification

### `web.search` / `web.fetch`

Used in desk setup and ICP refresh to learn the business from `«HOME URL»`. Absent: mark findings `n/a` and continue.

### `notify.push`

Optional. Absence is normal (`push: not available`). Only the four cases in `CONTRACT.md` section 9.

### `brief.deliver`

Standup brings `brief-latest.md` to the member: dashboard on a machine they use, Employee thread on hosted harness, or mail-to-self. File only is acceptable.

---

## 6. Kit capabilities

### `runlog.append`

`shell.run`: `node "«LEADGEN_ROOT»/scripts/runlog.mjs" ...` then validated direct append.

### `copy.check`

`node "«LEADGEN_ROOT»/scripts/copy-check.mjs" --file <path> --dest plain` (or strategy/dashboard). Fails on em dash, en dash, unresolved guillemets (except allowed sentinels), and proof inventing.

### `guard`

`node "«LEADGEN_ROOT»/scripts/guard.mjs" <routine-id>`

### `leadgen.cli`

`shell.run`: `python3 "«LEADGEN_ROOT»/scripts/leadgen.py" <command> ...`

Working directory should be `«LEADGEN_ROOT»` so relative `config/`, `data/`, `.env` resolve. Commands used by routines:

| Stage | Command |
|---|---|
| Init | `init`, `doctor --network`, `config check`, `config examples` |
| Source | `source osm`, `source places`, `source apollo`, `source csv`, `add` |
| Enrich | `crawl`, `contacts hunter`, `contacts apollo`, `contacts pattern` |
| Qualify | `verify --provider local`, `verify --provider hunter`, `score` |
| Deliver | `export`, `report`, `status` |
| Push | `push instantly --dry-run`, `push ghl --dry-run` (live needs RELEASES + `--yes`) |

Never pass API key values on the command line; the CLI reads `.env`.

### `schedule.register`

Harness scheduler first, OS scheduler second, else write `schedule-commands.txt`.

---

## 7. What you lose with no browser at all

Almost nothing for daily pipeline. Setup loses live site crawl convenience; it can still use `web.fetch` / shell fetch. Research-leads style discovery degrades to member-provided CSV.

---

## 8. Optional named helpers

None required globally. Do not install skills into the member's global skills directory.

---

## 9. The scheduling layer

One job per routine id. Invocation runs the routine SKILL with `«LEADGEN_ROOT»` known. See sibling kits' harness notes; write what you learn into Corrections.

Prove `leadgen-desk-standup` once by hand before registering eight.

### 9.2a Invocation shape

Prefer non-interactive harness run pointing at `routines/<id>/SKILL.md`. On Grok Bot: one recurring task per routine whose prompt is "run routine <id> from «LEADGEN_ROOT»".

---

## 10. Scheduled runs get no permission prompt

Run scheduled work in auto-approve mode scoped to `«LEADGEN_ROOT»`. Guardrails live in CONTRACT and RELEASES, not in the prompt gate.

---

## Corrections

Format: one line per correction, newest at the top, `YYYY-MM-DD: what was wrong, what to do instead.`

---
