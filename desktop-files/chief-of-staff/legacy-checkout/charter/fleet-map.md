# Fleet map

Search roots for this install: `/workspace/AI-employee/employees` (one level of children only).
Generated on 2026-10-23 by cos-charter-and-fleet-audit first run.
Eight AI Employees found. None has a completed first run yet except this kit's install in progress.

## chief-of-staff
- root: `/workspace/AI-employee/employees/chief-of-staff`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: brief-latest.md
- weekly_output: metrics/metrics-YYYY-Www.md
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (empty runlog)
- routines:
  - `cos-fleet-reconcile` | days: mon-fri | window: 07:00 to 11:30 | key: YYYY-MM-DD | lane: never
  - `cos-fault-dossier` | days: mon-fri | window: 14:15 to 18:00 | key: YYYY-MM-DD | lane: never
  - `cos-market-sweep` | days: wed | window: 09:45 to 14:00 | key: YYYY-Www | lane: heavy
  - `cos-metrics-review` | days: thu | window: 10:15 to 15:00 | key: YYYY-Www | lane: conditional
  - `cos-decision-brief` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: never
  - `cos-charter-and-fleet-audit` | days: first-weekday | window: 11:45 to 17:00 | key: YYYY-MM | lane: light
  - `cos-decision-review` | days: last-weekday | window: 12:45 to 17:30 | key: YYYY-MM | lane: never

## ad-manager-employee
- root: `/workspace/AI-employee/employees/ad-manager-employee`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: ads-latest.md
- weekly_output: none
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `ads-account-read` | days: mon-fri | window: 06:30 to 09:45 | key: YYYY-MM-DD | lane: heavy
  - `ads-desk-standup` | days: mon-fri | window: 07:15 to 11:30 | key: YYYY-MM-DD | lane: never
  - `ads-creative-studio` | days: mon-fri | window: 08:00 to 12:00 | key: YYYY-MM-DD | lane: conditional
  - `ads-build-desk` | days: mon-fri | window: 09:00 to 13:00 | key: YYYY-MM-DD | lane: conditional
  - `ads-change-list` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: light
  - `ads-account-intake` | days: first-weekday | window: 12:45 to 17:00 | key: YYYY-MM | lane: conditional
  - `ads-creative-retro` | days: last-weekday | window: 13:45 to 17:30 | key: YYYY-MM | lane: light

## customer-satisfaction-employee
- root: `/workspace/AI-employee/employees/customer-satisfaction-employee`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: csat-latest.md
- weekly_output: report/satisfaction-YYYY-Www.md
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `csat-inbox-sweep` | days: mon-fri | window: 06:30 to 09:45 | key: YYYY-MM-DD | lane: heavy
  - `csat-desk-standup` | days: mon-fri | window: 07:15 to 11:30 | key: YYYY-MM-DD | lane: never
  - `csat-reply-desk` | days: mon-fri | window: 08:00 to 12:00 | key: YYYY-MM-DD | lane: conditional
  - `csat-churn-watch` | days: mon-fri | window: 09:05 to 13:00 | key: YYYY-MM-DD | lane: conditional
  - `csat-deflection-desk` | days: wed | window: 10:45 to 15:00 | key: YYYY-Www | lane: light
  - `csat-satisfaction-report` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: conditional
  - `csat-desk-intake` | days: first-weekday | window: 12:45 to 17:00 | key: YYYY-MM | lane: light
  - `csat-taxonomy-refresh` | days: last-weekday | window: 13:45 to 17:30 | key: YYYY-MM | lane: light

## gtm-engineer
- root: `/workspace/AI-employee/employees/gtm-engineer`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: gtm-latest.md
- weekly_output: scoreboard/scoreboard-YYYY-Www.md
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `gtm-signal-sweep` | days: mon-fri | window: 06:30 to 09:45 | key: YYYY-MM-DD | lane: heavy
  - `gtm-board-standup` | days: mon-fri | window: 07:15 to 11:30 | key: YYYY-MM-DD | lane: never
  - `gtm-outreach-queue` | days: mon-fri | window: 08:00 to 12:00 | key: YYYY-MM-DD | lane: conditional
  - `gtm-launch-step-runner` | days: mon-fri | window: 09:00 to 13:00 | key: YYYY-MM-DD | lane: conditional
  - `gtm-paid-and-tracking-guard` | days: mon | window: 10:45 to 15:00 | key: YYYY-Www | lane: read only
  - `gtm-scoreboard` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: read only
  - `gtm-intake-and-dashboard` | days: first-weekday | window: 12:45 to 17:00 | key: YYYY-MM | lane: light
  - `gtm-icp-refresh` | days: last-weekday | window: 13:45 to 17:30 | key: YYYY-MM | lane: light

## sales-employee
- root: `/workspace/AI-employee/employees/sales-employee`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: sales-latest.md
- weekly_output: none
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `sales-prospect-sweep` | days: mon-fri | window: 06:30 to 09:45 | key: YYYY-MM-DD | lane: heavy
  - `sales-desk-standup` | days: mon-fri | window: 07:15 to 11:30 | key: YYYY-MM-DD | lane: never
  - `sales-first-touch-drafts` | days: mon-fri | window: 08:00 to 12:00 | key: YYYY-MM-DD | lane: heavy
  - `sales-followup-sweep` | days: mon-fri | window: 13:15 to 17:00 | key: YYYY-MM-DD | lane: heavy
  - `sales-pipeline-review` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: conditional
  - `sales-desk-setup` | days: first-weekday | window: 10:45 to 15:00 | key: YYYY-MM | lane: light
  - `sales-qualification-refresh` | days: last-weekday | window: 11:15 to 15:30 | key: YYYY-MM | lane: light

## seo-employee
- root: `/workspace/AI-employee/employees/seo-employee`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: seo-latest.md
- weekly_output: scoreboard/scoreboard-YYYY-Www.md
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `seo-standup` | days: mon-fri | window: 07:00 to 11:30 | key: YYYY-MM-DD | lane: never
  - `seo-draft-run` | days: mon-fri | window: 07:45 to 12:00 | key: YYYY-MM-DD | lane: conditional
  - `seo-publish-run` | days: mon-fri | window: 09:00 to 13:00 | key: YYYY-MM-DD | lane: conditional
  - `seo-index-sweep` | days: tue | window: 10:45 to 16:00 | key: YYYY-Www | lane: heavy
  - `seo-calendar-refill` | days: wed | window: 12:45 to 17:00 | key: YYYY-Www | lane: conditional
  - `seo-answer-visibility` | days: thu | window: 10:45 to 14:00 | key: YYYY-Www | lane: conditional
  - `seo-rank-review` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: heavy
  - `seo-intake-and-map` | days: first-weekday | window: 14:15 to 18:00 | key: YYYY-MM | lane: conditional

## social-media-employee
- root: `/workspace/AI-employee/employees/social-media-employee`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/<routine-id>.json
- digest: soc-latest.md
- weekly_output: none
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `soc-engagement-sweep` | days: mon-fri | window: 05:30 to 08:00 | key: YYYY-MM-DD | lane: heavy
  - `soc-calendar-standup` | days: mon-fri | window: 06:40 to 07:20 | key: YYYY-MM-DD | lane: never
  - `soc-publish-run` | days: mon-fri | window: 07:22 to 11:00 | key: YYYY-MM-DD | lane: light
  - `soc-material-sweep` | days: mon-fri | window: 08:00 to 12:30 | key: YYYY-MM-DD | lane: heavy
  - `soc-draft-queue` | days: mon-fri | window: 09:05 to 15:00 | key: YYYY-MM-DD | lane: conditional
  - `soc-performance-review` | days: fri | window: 15:45 to 19:00 | key: YYYY-Www | lane: heavy
  - `soc-intake-and-voice` | days: first-weekday | window: 12:45 to 17:00 | key: YYYY-MM | lane: light

## web-dev-employee
- root: `/workspace/AI-employee/employees/web-dev-employee`
- contract: CONTRACT.md
- schedule: SCHEDULE.md
- runlog: runlog.jsonl
- paused_file: PAUSED
- browser_lock: state/browser-lock.json
- state_files: state/web-inventory-refresh.json; pattern also state/<routine-id>.json
- digest: web-latest.md
- weekly_output: reports/report-YYYY-Www.md
- present: true
- first_seen: 2026-10-23
- last_confirmed: 2026-10-23
- first_run: none (no runlog file yet)
- routines:
  - `web-site-sweep` | days: mon-fri | window: 06:30 to 09:45 | key: YYYY-MM-DD | lane: heavy
  - `web-standup` | days: mon-fri | window: 07:15 to 11:30 | key: YYYY-MM-DD | lane: never
  - `web-fix-runner` | days: mon-fri | window: 08:00 to 13:00 | key: YYYY-MM-DD | lane: conditional
  - `web-platform-guard` | days: mon | window: 10:15 to 15:00 | key: YYYY-Www | lane: heavy
  - `web-inventory-refresh` | days: first-weekday | window: 11:30 to 16:00 | key: YYYY-MM | lane: light
  - `web-dependency-run` | days: wed | window: 13:15 to 17:00 | key: YYYY-Www | lane: conditional
  - `web-weekly-report` | days: fri | window: 15:15 to 18:00 | key: YYYY-Www | lane: light
  - `web-guardrail-review` | days: last-weekday | window: 16:30 to 19:30 | key: YYYY-MM | lane: never
