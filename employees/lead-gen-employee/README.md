# Lead Gen Employee

Scheduled AI Employee that builds clean B2B or local lead lists for one offer. Tell it who you sell to and where. It sources companies, crawls their sites politely, finds and verifies contacts, scores against your ICP, and hands you CSV plus an HTML report. Optional dry-run push into Instantly or GoHighLevel.

**Finds and qualifies only. Never sends email, SMS or DM.** Complements the [Sales Employee](../sales-employee/): Sales drafts outreach; Lead Gen builds lists.

Standard: **AI Employee Standard 1.5**. Version in `VERSION`. Fleet host: [ai-employee-bouke1.vercel.app](https://ai-employee-bouke1.vercel.app).

## Quick start

1. Extract or clone this folder to a path that is not inside a sync client (or use a hosted harness computer).
2. Open your agent in this folder and say: **install the Lead Gen Employee from this folder**.
3. Or paste `INSTALL-PROMPT.md` between the BEGIN/END markers, filling `«LEADGEN_ROOT»` and `«HOME URL»`.

CLI without the agent:

```
python3 scripts/leadgen.py init
python3 scripts/leadgen.py doctor --network
python3 scripts/leadgen.py config examples
# copy an example into config/icp.json and edit
python3 scripts/leadgen.py run
python3 scripts/leadgen.py report
```

Free path (no API keys): OpenStreetMap sourcing, website crawl, local MX checks, scoring, CSV export.

## Routines

| Id | Cadence | Job |
|---|---|---|
| `leadgen-desk-setup` | First weekday monthly | Init, doctor, ICP, register jobs |
| `leadgen-icp-refresh` | Last weekday monthly | Re-test ICP on evidence |
| `leadgen-source-run` | Weekday morning | Source companies |
| `leadgen-enrich-run` | Weekday mid-morning | Crawl + contacts |
| `leadgen-qualify-run` | Weekday late morning | Verify + score |
| `leadgen-desk-standup` | Weekday morning | Brief |
| `leadgen-export-run` | Weekday afternoon | CSV + HTML report |
| `leadgen-push-run` | Friday afternoon | Dry-run push (held) |

## Keys (all optional)

See `.env.example`: `GOOGLE_PLACES_API_KEY`, `APOLLO_API_KEY`, `HUNTER_API_KEY`, `INSTANTLY_API_KEY`, `GHL_API_KEY`, `GHL_LOCATION_ID`. Never commit `.env`.

## Docs in this kit

- `docs/PIPELINE.md`, `docs/SOURCES.md`, `docs/CONNECTORS.md`
- `recipes/LEAD-DATA-RULES.md`
- `CONTRACT.md`, `ROLE.md`, `CAPABILITIES.md`, `SCHEDULE.md`

## Tests

```
python3 -m unittest discover -s scripts/tests -q
node scripts/guard.mjs --selftest
node scripts/runlog.mjs --selftest
node scripts/copy-check.mjs --selftest
```

## License

MIT, same as the fleet repository.
