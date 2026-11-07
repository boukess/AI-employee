# Algorithm Learner integrations

Two tools sit beside this kit, pinned as Git submodules under `integrations/` in the AI-employee repository. This kit does not vendor their source.

```bash
git submodule update --init integrations/social-media-performance-analysis integrations/social-analyzer
node scripts/integration-check.mjs
```

`empty` or `missing` means not checked out. GitHub ZIP downloads do not include submodule contents.

| Need | Use | Status |
|---|---|---|
| Explore BOUKE's own post engagement | social-media-performance-analysis | Needs install. GitHub reports no license: use in place, do not copy its code. |
| Audit `frbouke` across platforms, look up public brand/competitor accounts the member names | social-analyzer | Needs install. AGPL-3.0: run as its own program, never copy its code into this MIT kit. |

## social-media-performance-analysis

Skill: `.agents/skills/performance-dashboard/SKILL.md`.

```bash
python3 -m venv integrations/social-media-performance-analysis/.venv
integrations/social-media-performance-analysis/.venv/bin/pip install -r integrations/social-media-performance-analysis/app/requirements.txt pandas
integrations/social-media-performance-analysis/.venv/bin/streamlit run integrations/social-media-performance-analysis/app/Home.py
```

Windows: `.venv\Scripts\pip.exe` / `.venv\Scripts\streamlit.exe`. The AI insight/chat flow calls DataStax LangFlow and needs the member's own `LANGFLOW_ID`, `FLOW_ID`, `APP_TOKEN` in a local `.env` that is never committed. Without them, use `scripts/patterns.py` for the numbers. The bundled `dataset/social_media_engagement.csv` is the upstream author's sample, not BOUKE data — never quote it as BOUKE results.

## social-analyzer

Skill: `.agents/skills/social-analyzer-audit/SKILL.md`.

```bash
# Python
pip install social-analyzer
python3 -m social-analyzer --username "frbouke" --metadata --top 100
# or Node (>= 20.18.1), from integrations/social-analyzer
npm ci && npm start   # web app on localhost:9005
```

**Guardrail.** Use ONLY for the `frbouke` handle audit (consistency, squatting) and public brand/competitor accounts the member names. Never look up, find, or track private individuals. Save results to `workspace/outputs/handle-audit-YYYY-MM-DD.md`.
