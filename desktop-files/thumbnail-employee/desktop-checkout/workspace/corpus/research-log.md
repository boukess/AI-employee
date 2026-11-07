# Research log — Thumbnail Employee (BOUKE)

## Session 2026-10-28 (America/New_York) — starter niche pass

### Goal
Honest starter reference pass for niches: AI employees / AI agents for business / freelance tips / content creation business. No member channel URLs yet.

### Queries / discovery sources
- WebSearch: site:youtube.com "I hired" AI employees OR "AI employee" business
- WebSearch: site:youtube.com "AI agents" business automation tutorial 2025
- WebSearch: site:youtube.com how I make money freelancing OR content creation business tips
- WebSearch: site:youtube.com Claude Code AI agents for business creators
- WebSearch: site:youtube.com "replace your team with AI" OR "AI employees" OR "digital employees" business
- WebSearch: site:youtube.com "content creation business" OR freelance client tips
- WebSearch: replacement freelance copywriting client videos after 2 download failures

### Method
1. Collected public YouTube watch URLs from search.
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (all successful files 1280x720).
4. Computed SHA-256; visually inspected each local JPG with the Read tool.
5. Wrote qualifying rows only after inspection.

### Batch checkpoint
- Qualifying viewed references: **30**
- Distinct creators: **30**
- Primary topic clusters: **7** (AI employees for business, AI agents / automation for business, AI marketing / content team, Claude / AI tooling for business owners, AI for content creation workflows, Freelance tips / client acquisition, Content creation as a business)
- Local images: **30**
- Rejected candidates: 2 (`xsGiaRoMQeM`, `yHdjGnrO3-4` — oEmbed/download failed; replaced)
- Metadata-only / unviewed counted toward target: **0**
- Invented CTR/views/dates: **none**

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not attempted (login walls expected); not claimed.
- Two initial video IDs failed oEmbed + thumbnail fetch; replaced with alternate public videos.
- Some YT results yielded Shorts-style talking-head covers rather than designed long-form thumbs.

### Next research step
1. Search specifically for calm / practical “AI assistant for small business” and “operations automation” thumbnails (anti-hype lane).
2. Add 20–30 more designed landscape refs across under-covered clusters (AI marketing team, content hub / behind-the-build).
3. When member provides channel URLs, seed competitors.jsonl with those and expand related creators.
4. Continue toward default 300; keep `research_status` partial until criteria met.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000001.jpg … ref-000030.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 2 (calm / under-covered clusters)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing: calm anti-hype AI-for-business; content creation as a business; Claude/AI tooling for business owners; AI marketing/content team; AI content-creation workflows. Prefer designed 16:9; deprioritize Shorts-style talking heads. No member URLs yet.

### Queries / discovery sources
- WebSearch: AI assistant for small business practical tutorial
- WebSearch: Claude AI for business owners / Claude Skills marketing team
- WebSearch: AI content creation workflow YouTube/newsletter/blog automation
- WebSearch: content creation business / behind-the-scenes content hub
- WebSearch: AI marketing team / AI social media manager tutorial
- WebSearch: AI for operations / small business automations
- WebSearch: ChatGPT/Claude SOP / Notion AI workspace
- WebSearch: content system / Creator OS Notion
- WebSearch: Claude Code for business owners; AI content calendar / repurposing

### Method
1. Collected public YouTube watch URLs from search.
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / creator-duplicate / weak-fit candidates with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000031…ref-000060).

### Batch checkpoint
- New qualifying viewed references this batch: **30** (ref-000031…ref-000060)
- Cumulative qualifying viewed: **60**
- Distinct creators cumulative: **60** (batch-2 also 30 unique)
- Primary topic clusters: **7** (same set; under-covered clusters deepened)
- Local images: **60**
- Rejected / held candidates this batch: 13 (7 Shorts-style, 4 creator-dups, 1 money-mismatch hold-out, 1 inspected-hold for batch size)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 2)
- AI agents / automation for business: 12
- AI employees for business: 11
- Content creation as a business: 11 (was 3)
- Claude / AI tooling for business owners: 8 (was 2)
- AI for content creation workflows: 8 (was 1)
- Freelance tips / client acquisition: 6 (unchanged this batch)
- AI marketing / content team: 4 (was 1)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- DuckDuckGo HTML scrape for extra IDs returned empty; relied on WebSearch + oEmbed.
- Several search hits were Shorts-style covers—rejected after visual Read, not counted.

### Next research step
1. Keep prioritizing designed landscape calm AI-for-business + behind-the-build.
2. Deepen thinnest remaining cluster: **AI marketing / content team**.
3. Add member channel lanes when URLs arrive.
4. Continue toward 300; keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000031.jpg … ref-000060.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 3 (AI marketing deepen)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing **AI marketing / content team** (thinnest), plus calm anti-hype / behind-the-build balance across content-creation-as-business, Claude tooling (secondary tags), and AI content workflows. Prefer designed 16:9; reject Shorts-style; niche-only (no member URLs); skip TikTok/IG.

### Queries / discovery sources
- WebSearch: AI marketing team / AI content team / AI social media manager
- WebSearch: AI marketing agency / AI marketing department / Claude Code marketing
- WebSearch: AI content agent n8n/Claude; AI content factory; post to socials automation
- WebSearch: Notion social media hub / creator OS / content systems
- WebSearch: AI SEO agent Make.com; LinkedIn+n8n automatic posting; ChatGPT marketing strategy
- DuckDuckGo HTML scrape for extra IDs returned empty (0 ids); relied on WebSearch + oEmbed

### Method
1. Collected public YouTube watch URLs from search.
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / weak-fit / campus-brand candidates with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000061…ref-000087).
7. Careful deepen (≤2 refs) for Grace Leung, AI Foundations, Sabrina Ramonov only where new artwork meaningfully filled marketing/workflow gaps.

### Batch checkpoint
- New qualifying viewed references this batch: **27** (ref-000061…ref-000087)
- Cumulative qualifying viewed: **87**
- Distinct creators cumulative: **84**
- Primary topic clusters: **7** (same set; AI marketing / content team now deepest)
- Local images: **87**
- Rejected candidates this batch: 5 (3 Shorts-style, 1 INSEAD brand photo, 1 weak Power Automate fit)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 3)
- AI marketing / content team: 19 (was 4)
- AI for content creation workflows: 16 (was 8)
- Content creation as a business: 15 (was 11)
- AI agents / automation for business: 12 (unchanged)
- AI employees for business: 11 (unchanged)
- Claude / AI tooling for business owners: 8 primary (unchanged; several marketing/workflow rows also carry Claude secondary tags)
- Freelance tips / client acquisition: 6 (unchanged; now thinnest)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- DuckDuckGo HTML scrape returned empty IDs.
- Shorts-style covers continue to appear in “AI marketing team” search hits—rejected after visual Read.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Optionally rebalance **Freelance tips / client acquisition** (now thinnest) or deepen Claude primary tags.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000061.jpg … ref-000087.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 4 (freelance rebalance + Claude deepen)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing **Freelance tips / client acquisition** (was thinnest at 6), optionally deepen **Claude / AI tooling for business owners** primary tags, keep calm anti-hype / behind-the-build 16:9. Niche-only; skip TikTok/IG; no sample thumbnail regeneration.

### Queries / discovery sources
- WebSearch: freelance clients without Upwork / LinkedIn outreach / proposals / pricing
- WebSearch: first freelance client / raise rates / high-ticket services / web design clients
- WebSearch: Claude Code for business owners / non-technical / Projects / Skills / Cowork
- WebSearch: Claude + Notion MCP / CLAUDE.md skills / small-business Claude ops
- WebSearch: discovery call / client onboarding freelancing

### Method
1. Collected public YouTube watch URLs from search.
2. Verified title/creator via YouTube oEmbed JSON (several 401/403/404 failures logged as rejected).
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (PIL dimension check; prefer 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / money-hype / weak-fit / oEmbed-fail candidates with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000088…ref-000110).
7. Careful deepen for AI Foundations, Nate Herk, Simon Scrapes only where new artwork filled Claude gaps.

### Batch checkpoint
- New qualifying viewed references this batch: **23** (ref-000088…ref-000110)
- Cumulative qualifying viewed: **110**
- Distinct creators cumulative: **103**
- Primary topic clusters: **7** (Freelance rebalanced; Claude primary tags now tied with marketing)
- Local images: **110**
- Rejected candidates this batch: 20 (Shorts-style, money-hype, oEmbed fails, 640x480, shock/God Mode, held deepen)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 4)
- AI marketing / content team: 19 (unchanged)
- Claude / AI tooling for business owners: 19 (was 8)
- Freelance tips / client acquisition: 18 (was 6)
- AI for content creation workflows: 16 (unchanged)
- Content creation as a business: 15 (unchanged)
- AI agents / automation for business: 12 (unchanged)
- AI employees for business: 11 (unchanged; now among thinner clusters)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- Several freelance search hits were Shorts-style vertical covers—rejected after visual Read.
- oEmbed failures: Es5H99Tf7Xc (401), EVwHySmTsjg (404), YRbgxchmCEE (403), vp9BjGRqlt8 (404).

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Optionally deepen thinner remaining clusters: **AI employees for business** or **AI agents / automation for business**.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000088.jpg … ref-000110.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 5 (AI employees + AI agents deepen)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing thinner clusters **AI employees for business** (was 11) and **AI agents / automation for business** (was 12). Prefer calm anti-hype / behind-the-build 16:9. Niche-only; skip TikTok/IG; no sample thumbnail regeneration; avoid source_url duplicates; keep creator concentration under ~10%.

### Queries / discovery sources
- WebSearch: AI employees / digital employees / AI workforce / hire AI employee
- WebSearch: I hired AI employees; build AI employee team; AI receptionist / AI SDR
- WebSearch: n8n AI agents for business; Make.com AI Agents; multi-agent system runs my business
- WebSearch: OpenAI Agent Builder / Operator; Lindy AI workforce; Greg Isenberg AI workforce
- DuckDuckGo HTML scrape for extra IDs returned empty (0 ids); relied on WebSearch + oEmbed

### Method
1. Collected public YouTube watch URLs from search.
2. Verified title/creator via YouTube oEmbed JSON (403/timeout logged as rejected).
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / money-hype / logo-only / raw-screenshot / weak-fit candidates with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000111…ref-000137).
7. Careful deepen for LYFE Accounting, Analytics Vidhya, Nate Herk only where new artwork filled employees/agents gaps.

### Batch checkpoint
- New qualifying viewed references this batch: **27** (ref-000111…ref-000137)
- Cumulative qualifying viewed: **137**
- Distinct creators cumulative: **126**
- Primary topic clusters: **7** (employees + agents now among deepest)
- Local images: **137**
- Rejected candidates this batch: 14 (Shorts-style, money-hype, logo-only, interview stills, oEmbed fails)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 5)
- AI agents / automation for business: 26 (was 12)
- AI employees for business: 24 (was 11)
- AI marketing / content team: 19 (unchanged)
- Claude / AI tooling for business owners: 19 (unchanged)
- Freelance tips / client acquisition: 18 (unchanged)
- AI for content creation workflows: 16 (unchanged)
- Content creation as a business: 15 (unchanged; now among thinner)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- DuckDuckGo HTML scrape returned empty IDs.
- oEmbed failures: IPW_3W_vp9o (403), O3HP4uC7XlA (SSL timeout).
- Shorts-style and money-hype packs continue to appear in AI-employee search hits—rejected after visual Read.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Optionally rebalance thinner remaining clusters: **Content creation as a business** or **AI for content creation workflows**.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000111.jpg … ref-000137.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 6 (content business + AI content workflows rebalance)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing thinner clusters **Content creation as a business** (was 15) and **AI for content creation workflows** (was 16). Prefer calm anti-hype / behind-the-build 16:9. Niche-only; skip TikTok/IG; no sample thumbnail regeneration; avoid source_url duplicates; keep creator concentration under ~10%.

### Queries / discovery sources
- WebSearch: content creation business system / behind the scenes / Creator OS
- WebSearch: AI content creation workflow ChatGPT Claude newsletter automation
- WebSearch: content system Notion Creator OS content hub
- WebSearch: content batching / content calendar / creator business SOP
- WebSearch: AI repurposing Claude / YouTube→LinkedIn / one video many pieces
- WebSearch: Descript CapCut AI editing workflow; Airtable content pipeline; Notion SOPs
- WebSearch: n8n autoblogging / AI newsletter / YouTube notes to Notion

### Method
1. Collected public YouTube watch URLs from search.
2. Verified title/creator via YouTube oEmbed JSON (401/404 logged as rejected).
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / shock / While-You-Sleep hype / weak-fit candidates with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000138…ref-000161).
7. Careful deepen for Nate Herk and Amber Figlow only where new artwork filled AI-content-workflow gaps.

### Batch checkpoint
- New qualifying viewed references this batch: **24** (ref-000138…ref-000161)
- Cumulative qualifying viewed: **161**
- Distinct creators cumulative: **143**
- Primary topic clusters: **7** (content-business + AI-content workflows now among deepest)
- Local images: **161**
- Rejected candidates this batch: **17** (Shorts-style, shock/sunburst, While-You-Sleep hype, oEmbed fails)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 6)
- AI for content creation workflows: 28 (was 16)
- Content creation as a business: 27 (was 15)
- AI agents / automation for business: 26 (unchanged)
- AI employees for business: 24 (unchanged)
- AI marketing / content team: 19 (unchanged)
- Claude / AI tooling for business owners: 19 (unchanged)
- Freelance tips / client acquisition: 18 (unchanged)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- oEmbed failures: 0sgq_B52lWU (401), dJ0jhYv80yo (404).
- Shorts-style and shock/hype packs continue to appear in content/AI-content search hits—rejected after visual Read.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Optional deepen mid clusters (marketing team / Claude tooling / freelance) or keep mixed calm discovery now that content-business + AI-content workflows are rebalanced.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000138.jpg … ref-000161.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 7 (mid-cluster deepen)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing mid clusters: AI marketing / content team; Claude / AI tooling for business owners; Freelance tips / client acquisition. Prefer calm anti-hype / behind-the-build 16:9. No member URLs; skip TikTok/IG.

### Queries / discovery sources
- WebSearch: Claude AI for business owners marketing workflow / Cowork / Skills / Projects
- WebSearch: AI marketing team content manager social automation / Zapier / n8n LinkedIn
- WebSearch: freelance client acquisition / Upwork proposal / discovery call / retainer
- WebSearch: freelance onboarding HoneyBook / Dubsado / portal / SmartFile / rate-card held
- WebSearch: AEO / AI search content marketing HubSpot Field Notes

### Method
1. Collected public YouTube watch URLs from search; filtered against existing 161 source_urls / video IDs.
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / money-hype / shock / low-res / high-concentration holds with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000162…ref-000189).

### Batch checkpoint
- New qualifying viewed references this batch: **28** (ref-000162…ref-000189)
- Cumulative qualifying viewed: **189**
- Distinct creators cumulative: **164**
- Primary topic clusters: **7** (marketing + freelance now deepest at 30 each; Claude tooling to 24)
- Local images: **189**
- Rejected / held candidates this batch: **16** (Shorts-style, money-hype, shock-face, low-res, Nate Herk concentration hold, 6-FIGURE hold-out)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 7)
- AI marketing / content team: 30 (was 19)
- Freelance tips / client acquisition: 30 (was 18)
- AI for content creation workflows: 28 (unchanged)
- Content creation as a business: 27 (unchanged)
- AI agents / automation for business: 26 (unchanged)
- AI employees for business: 24 (unchanged)
- Claude / AI tooling for business owners: 24 (was 19)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- Shorts-style and money/shock packs continue to appear in freelance/marketing search hits—rejected after visual Read.
- Nate Herk held at 4 (ldETapkr8Hg skipped) to keep concentration low.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Optional deepen thinner clusters (AI employees / AI agents) or keep mixed calm discovery now that marketing/freelance/Claude mid clusters are rebalanced.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000162.jpg … ref-000189.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 8 (thin-cluster deepen + calm mix)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing thinner clusters: AI employees for business; AI agents / automation for business; mixed calm discovery. Prefer calm anti-hype / behind-the-build 16:9. No member URLs; skip TikTok/IG.

### Queries / discovery sources
- WebSearch: AI employees for business / hire first AI employee / Lindy / Relevance / Motion / Digital FTE
- WebSearch: AI agents automation n8n Make Zapier Bardeen customer support / inbox / receptionist
- WebSearch: LangGraph CrewAI AutoGen framework compare / multi-agent SDK
- WebSearch: behind-the-scenes AI workflows / business dashboard / Nexus OS

### Method
1. Collected public YouTube watch URLs from search; filtered against existing 189 source_urls / 268 known video IDs (refs+candidates).
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / money-hype / shock / metrics-on-thumb / concentration holds with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000190…ref-000216).

### Batch checkpoint
- New qualifying viewed references this batch: **27** (ref-000190…ref-000216)
- Cumulative qualifying viewed: **216**
- Distinct creators cumulative: **186**
- Primary topic clusters: **7** (AI agents deepest at 45; AI employees to 32)
- Local images: **216**
- Rejected / held candidates this batch: **14** (Shorts-style, money-hype, shock-face, metrics KPI pack, Grace Leung concentration hold, maxres 404s)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 8)
- AI agents / automation for business: 45 (was 26)
- AI employees for business: 32 (was 24)
- AI marketing / content team: 30 (unchanged)
- Freelance tips / client acquisition: 30 (unchanged)
- AI for content creation workflows: 28 (unchanged)
- Content creation as a business: 27 (unchanged)
- Claude / AI tooling for business owners: 24 (unchanged)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- Shorts-style and money/shock packs continue to appear in AI-employee/agent search hits—rejected after visual Read.
- Grace Leung held at 5 (ok8FA0ROnMg skipped) to keep concentration low.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Optional deepen Claude tooling (24) or keep mixed calm discovery now that AI employees/agents thin clusters are rebalanced.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000190.jpg … ref-000216.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 9 (Claude tooling deepen + calm mix)

### Goal
Add ~20–30 qualifying viewed designed landscape refs prioritizing Claude / AI tooling for business owners (was 24), mixed with calm discovery across niche. Prefer calm anti-hype / behind-the-build 16:9. No member URLs; skip TikTok/IG.

### Queries / discovery sources
- WebSearch: Claude Projects / Skills / Cowork / Connectors / MCP / Artifacts / Claude Code for business owners
- WebSearch: Claude Power Hour / Claude for small businesses / Claude vs ChatGPT business
- WebSearch: Gemini Gems / Perplexity Spaces / ChatGPT Projects / Notion AI workspace (adjacent calm twins)
- YouTube oEmbed verification + i.ytimg.com maxresdefault download

### Method
1. Collected public YouTube watch URLs from search; filtered against existing 216 source_urls / 309 known video IDs (refs+candidates).
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / money-hype / shock / metrics-on-thumb / concentration holds / no-maxres with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000217…ref-000243).

### Batch checkpoint
- New qualifying viewed references this batch: **27** (ref-000217…ref-000243)
- Cumulative qualifying viewed: **243**
- Distinct creators cumulative: **206**
- Primary topic clusters: **7** (Claude tooling deepest at 50)
- Local images: **243**
- Rejected / held candidates this batch: **11** (shock SUPERPOWERS, 96% fail metrics, cash-bill VA hype, Shorts vertical, Day-7-only card, no-maxres, Kevin/AI Foundations concentration holds)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 9)
- Claude / AI tooling for business owners: 50 (was 24)
- AI agents / automation for business: 45 (unchanged)
- AI employees for business: 32 (unchanged)
- AI marketing / content team: 30 (unchanged)
- Freelance tips / client acquisition: 30 (unchanged)
- AI for content creation workflows: 29 (was 28; +Notion AI workspace)
- Content creation as a business: 27 (unchanged)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- Shorts-style and money/shock packs continue to appear in Claude/ChatGPT search hits—rejected after visual Read.
- Kevin Stratvert held at 5 (Artifacts 1PRcdCu8n6M skipped); AI Foundations held at 4.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs.
2. Claude tooling now deepest; optional rebalance thinner mid clusters (content-as-business / content workflows) or keep mixed calm discovery.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial`.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000217.jpg … ref-000243.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 10 (content-as-business + AI content workflows rebalance)

### Goal
Add ~25–30 qualifying viewed designed landscape refs rebalancing thinner mid clusters: Content creation as a business (was 27) and AI for content creation workflows (was 29), plus mixed calm discovery toward 300. Prefer calm anti-hype / behind-the-build 16:9. No member URLs; skip TikTok/IG. Do not regenerate sample thumbnail.

### Queries / discovery sources
- WebSearch: content creator business systems / Notion Content OS / SOP / content calendar
- WebSearch: AI content workflow CapCut Descript Canva Claude scripting / Riverside / DaVinci
- WebSearch: batch content planning / YouTube packaging tags / VidIQ review (calm)
- YouTube oEmbed verification + i.ytimg.com maxresdefault download

### Method
1. Collected public YouTube watch URLs from search; filtered against existing 243 source_urls / 347 known video IDs (refs+candidates).
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / volume-hype / shock / metrics-on-thumb / off-niche / no-maxres with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000244…ref-000271).

### Batch checkpoint
- New qualifying viewed references this batch: **28** (ref-000244…ref-000271)
- Cumulative qualifying viewed: **271**
- Distinct creators cumulative: **229**
- Primary topic clusters: **7**
- Local images: **271**
- Rejected / held candidates this batch: **15** (shock TRANSFORM, MILLION VIEWS, Shorts-batch, Shorts-style vertical Descript, 100-posts volume hype, Shorts-convert CapCut, surprised CapCut, shocked Resolve-vs-Premiere, travel CapCut off-niche, oEmbed 401, no-maxres, weak-fit live-chat/logo-reveal, OpusClip Shorts collage hold)
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 10)
- Claude / AI tooling for business owners: 50 (unchanged)
- AI agents / automation for business: 45 (unchanged)
- AI for content creation workflows: 43 (was 29)
- Content creation as a business: 41 (was 27)
- AI employees for business: 32 (unchanged)
- AI marketing / content team: 30 (unchanged)
- Freelance tips / client acquisition: 30 (unchanged)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery.
- TikTok/Instagram not researched (login walls expected); not claimed.
- Shorts-style, shock TRANSFORM, and MILLION VIEWS / volume-hype packs continue to appear in CapCut/Descript/content search hits—rejected after visual Read.
- Amber Figlow held at 4 (YeJ-1YfLi1o Shorts-style skipped); Metics Media at 2.

### Next research step
1. Continue toward 300 with designed landscape calm/behind-the-build refs (~29 remaining).
2. Mid clusters rebalanced; keep mixed calm discovery or optional deepen as needed.
3. Add member channel lanes when URLs arrive.
4. Keep `research_status: partial` until 300 viewed + ≥20 creators + ≥5 clusters actually met.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000244.jpg … ref-000271.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json


## Session 2026-10-28 (America/New_York) — batch 11 FINAL (AI employees + marketing + freelance rebalance → 300)

### Goal
Add ~29 qualifying viewed designed landscape refs to hit **exactly 300**, rebalancing thinner edge clusters: AI employees for business (was 32), AI marketing / content team (was 30), Freelance tips / client acquisition (was 30). Prefer calm anti-hype / behind-the-build 16:9. No member URLs; skip TikTok/IG. Do not regenerate sample thumbnail.

### Queries / discovery sources
- WebSearch / YouTube results HTML: AI employees / AI receptionist / Sintra / GoHighLevel AI employee / Hermes agent / Lindy agent
- WebSearch: Surfer SEO tutorial / Jasper Brand Voice / automate marketing Zapier / Codex marketing team / HubSpot Claude skills
- WebSearch: freelance retainer clients / monthly retainers / project vs daily rates (calm)
- YouTube oEmbed verification + i.ytimg.com maxresdefault download

### Method
1. Collected public YouTube watch URLs from search; filtered against existing 271 source_urls / known video IDs (refs+candidates).
2. Verified title/creator via YouTube oEmbed JSON.
3. Downloaded `i.ytimg.com/vi/<id>/maxresdefault.jpg` (qualifying files 1280x720).
4. Computed SHA-256; visually inspected each promoted JPG with the Read tool.
5. Rejected Shorts-style / money-hype / shock / weak-fit / held-alternates with reasons in candidates.jsonl.
6. Wrote qualifying rows only after inspection (ref-000272…ref-000300).

### Batch checkpoint
- New qualifying viewed references this batch: **29** (ref-000272…ref-000300)
- Cumulative qualifying viewed: **300**
- Distinct creators cumulative: **249**
- Primary topic clusters: **7**
- Local images: **300**
- Rejected / held candidates this batch: **77** (Shorts-style vertical, money-hype retainer, held designed alternates, weaker niche fit)
- Promoted candidates logged: **29**
- Metadata-only counted toward target: **0**
- Invented CTR/views/dates: **none**

### Cluster delta (primary tag counts after batch 11)
- Claude / AI tooling for business owners: 50 (unchanged)
- AI agents / automation for business: 45 (unchanged)
- AI for content creation workflows: 43 (unchanged)
- AI employees for business: 42 (was 32)
- Content creation as a business: 41 (unchanged)
- AI marketing / content team: 40 (was 30)
- Freelance tips / client acquisition: 39 (was 30)

### Blockers
- No member YouTube/TikTok/Instagram URLs yet → niche-only discovery (optional future lane).
- TikTok/Instagram not researched (login walls expected); not claimed.
- Shorts-style and money/salary-replacement packs heavily polluted freelance search—rejected after visual Read.
- Several designed AI-employee alternates held out of final 29 for cluster balance / fit.

### Completion
Target **300** qualifying viewed met with **249** distinct creators and **7** primary clusters (≥20 creators and ≥5 clusters already true). Set `research_status: complete`. Sample thumbnail was **not** regenerated.

### Next research step
1. Optional: when member channel URLs arrive, seed same-channel + direct-competitor lanes (does not reopen incomplete status).
2. Generation briefs should retrieve from the completed corpus (prefer AI-employee fleet, Surfer/Jasper literacy, retainer explainers, prior Notion/edit-tool pipelines).
3. No further corpus batches required for kit completion criteria.

### Files touched
- workspace/corpus/competitors.jsonl
- workspace/corpus/candidates.jsonl
- workspace/corpus/references.jsonl
- workspace/corpus/images/ref-000272.jpg … ref-000300.jpg
- workspace/corpus/patterns.md
- workspace/corpus/research-log.md
- workspace/library/REFERENCES.md
- workspace/state.json
