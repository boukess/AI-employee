# SEO/AEO Employee install notes (Phase 0)

Recorded: EDT 2026-10-23 22:41:30 (America/New_York). Box clock matches user timezone.
SEO_ROOT=/workspace/AI-employee/employees/seo-employee
Harness: Grok Bot (cloud computer; sync-folder rule does not apply; briefs via brief.deliver).

## Selftests

- node v20.19.2 (ok, >=18)
- scripts/copy-check.mjs --selftest: PASS (38 checks)
- scripts/runlog.mjs --selftest: PASS (30 checks)
- scripts/guard.mjs --selftest: PASS
- scripts/work-cycle.mjs --selftest: PASS
- scripts/run-state.mjs --selftest: PASS
- claude auth status: N/A on Grok Bot. CAPABILITIES.md schedules via Grok Bot recurring tasks that run the agent itself (section 9 / 9.2a grok-bot row), not a Claude CLI login.

## Capability probe (Grok Bot)

- web.search: yes (built-in WebSearch), then own browser
- web.fetch: yes (shell fetch / WebFetch), then own browser
- image.generate: yes via GenerateImage (first-party, no user credential). CAPABILITIES also lists hosted club generator then grok.com/connectors image connector as expected routes.
- browser: Grok Bot's own box browser. NOT signed into the user's Search Console, GA4, CMS, or other accounts unless the user signs in on this computer or syncs sessions. Kit never signs in.
- brief.deliver (CONTRACT 3.2a): post brief text into this Employee's own thread (expected). Absence is not a failure.
- schedule.register: Grok Bot recurring tasks, one per routine, Shape B prompt (CAPABILITIES 9.2a).

## CAPABILITIES section 4b connections (all absent today)

| Capability | What it would turn on | Status |
|---|---|---|
| search.performance.read | Search Console clicks/impressions/position without browser | absent (browser lane / n/a until session or connector) |
| analytics.read | GA4 sessions/conversions per landing page | absent |
| serp.read | Live SERP / rank via OpenSEO, Apify, Ahrefs, Semrush | absent (web.search covers basic result sets) |
| keyword.research | Volume/difficulty/ideas for refill | absent |
| index.request | IndexNow / Search Console sitemap submit API | absent (console browser path still needs signed-in session) |
| cms.publish | WordPress/Webflow/Wix/Shopify/Ghost surface publish | absent (repository publish needs no CMS connector) |

## Routine YAML names

All eight folders under routines/ have SKILL.md YAML name equal to folder name: seo-standup, seo-draft-run, seo-publish-run, seo-index-sweep, seo-calendar-refill, seo-answer-visibility, seo-rank-review, seo-intake-and-map.

## Folders and Phase 4 files created (property-independent)

Created: strategy/, calendar/, content/, index/, drafts/, board/, briefs/, scoreboard/, tracking/, recipes/, improvements/, state/, archive/, run/

Created empty: content/drafts.jsonl, content/published.jsonl, index/requests.jsonl, board/inbox.jsonl
Created header only: strategy/CHANGELOG.md, improvements/CHANGELOG.md
Created one line: tracking/rank-latest.md ("Rank review has not run yet.")

NOT created (per install rules / property dependency):
- calendar/CALENDAR.md (header needs property pillars and per-property conventions; seo-intake-and-map owns it in Phase 1+)
- board/board.json, board/WORK-BOARD.md, brief-latest.md, seo-latest.md (seo-standup owns these)
- PAUSED (member only)

## Schedule rows (America/New_York, from SCHEDULE.md)

| routine | days | fire | window | budget | browser |
|---|---|---|---|---|---|
| seo-standup | mon-fri | 07:15 | 07:00-11:30 | 12 min | never |
| seo-draft-run | mon-fri | 08:00 | 07:45-12:00 | 40 min | conditional |
| seo-publish-run | mon-fri | 09:15 | 09:00-13:00 | 30 min | conditional |
| seo-index-sweep | tue | 11:00 | 10:45-16:00 | 40 min | heavy |
| seo-calendar-refill | wed | 13:00 | 12:45-17:00 | 40 min | conditional |
| seo-answer-visibility | thu | 11:00 | 10:45-14:00 | 40 min | conditional |
| seo-rank-review | fri | 16:00 | 15:45-19:00 | 40 min | heavy |
| seo-intake-and-map | first-weekday | 14:30 | 14:15-18:00 | 45 min | conditional |

## Grok Bot routine prompt pattern (CAPABILITIES 9.2a Shape B)

One recurring task per routine, fire time from SCHEDULE.md in America/New_York. Exact run prompt text (substitute the routine id and keep SEO_ROOT absolute):

Read /workspace/AI-employee/employees/seo-employee/routines/<routine-id>/SKILL.md and follow it.

Examples:
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-standup/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-draft-run/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-publish-run/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-index-sweep/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-calendar-refill/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-answer-visibility/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-rank-review/SKILL.md and follow it.
- Read /workspace/AI-employee/employees/seo-employee/routines/seo-intake-and-map/SKILL.md and follow it.

Working directory for each task: /workspace/AI-employee/employees/seo-employee
Do not chain routines in one job. Prove seo-standup by hand before registering the other seven (Phase 5, not this phase).

## What Phase 1 still needs from the user (beyond a home page URL)

1. Which site URLs belong to BOUKE LLC (one line per property; guessing is forbidden).
2. For each property whose source lives on a machine this harness can read: absolute repository path, and branch name if known (intake still reads the tracked branch; never assumes it).
3. Optional hard constraints a public read cannot invent: claims that must never be made, topics that are off limits, sources that must never be cited.
4. If more than one property shares an audience: which property that audience belongs to for topic mapping.
5. Optional later (Phase 2 / measurement, not Phase 1 discovery): signed-in Search Console and GA4 sessions on this box browser, or 4b connectors, so index-sweep and rank-review can read owned screens.

## Blockers for Phase 0

None. Selftests pass. Folders and property-independent ledgers exist. Phase 1+ blocked only on missing property URLs (parent is asking the user). Scheduled registration and first standup are Phase 5 and were not done.
