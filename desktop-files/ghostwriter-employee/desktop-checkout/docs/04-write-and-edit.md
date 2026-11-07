# Write a complete piece

## Make a small brief

Infer the reader, desired outcome, channel, length, topic, and next action from the request and existing context. Keep the working brief in `workspace/briefs/`. Ask one question only if a missing detail materially changes the result. Do not ask the user to fill out every field.

If the member says only “write something” or “go” after setup, propose three specific angles, choose the one best supported by their evidence, and write it. Choose a practical explanation before a personal anecdote whose facts are missing. Mark your assumptions in one short note outside the draft. If the member asks only for topic ideas, do not turn that into an unsolicited article.

Separate **content evidence** (what can be said) from **voice evidence** (how it sounds). Retrieve 3–5 relevant examples and the latest feedback, not the whole archive. Never treat model-generated wording as proof of a business fact.

## Source the facts

Use current primary sources for changing product capabilities, prices, laws, medical/financial topics, statistics, schedules, and named claims. If browsing is unavailable, omit an unnecessary uncertain claim or ask for its source. Do not invent citations or imply that research happened.

Keep a fact ledger with claim, source, checked date, and limits. Put supporting links in article notes or the prose when readers need them. A conversational email may not need a research appendix. Never hide a material caveat that changes a claim.

For nonfiction personal stories, use only supplied/verified events. Do not invent revenue, customer reactions, emotional states, dialogue, or a dramatic origin story. Ask for the one missing scene if essential. For explicitly requested fiction, invent freely within the brief; keep it separate from real biography and label the file accordingly.

## Draft in the right mode

| Format | Default if the request is vague |
|---|---|
| Email | One useful subject, natural greeting when appropriate, purpose early, one clear next action; roughly 120–220 words |
| Article | Clear title, one developed argument, concrete examples, useful ending; roughly 600–900 words |
| Story | Scene, want/problem, change, payoff; roughly 500–800 words; establish fiction/nonfiction from context |
| Social/community post | One practical point, readable paragraphs, an appropriate close; roughly 150–250 words |
| Spoken script | Speakable transitions, timing based on evidence if available, no written-only formatting |

User length and format requests override these defaults. Preserve the member's way of explaining, not just their favorite words. Avoid reproducing long source passages when asked for a fresh piece. Reuse exact member wording only when appropriate to the task; quote and attribute third-party words within applicable limits.

## Edit in passes

1. **Truth:** Check names, claims, examples, links, chronology, numbers, and first-person experiences. Remove invented specifics. Keep necessary unknowns in an editorial note, not disguised as finished copy.
2. **Intent:** The piece answers the brief, respects length, and gives the reader a useful result.
3. **Voice:** Compare to actual samples in this mode. Does the reasoning sound like this person? Fix mismatches even if the prose is polished.
4. **Natural language:** Apply `docs/05-natural-writing.md`. Read it aloud mentally. Cut generic openings, filler summaries, repetitive structures and artificial punchiness.
5. **Final mechanics:** Spelling, grammar, subject/title, paragraphing, requested punctuation, and no leftover placeholders.

When available, run `python3 scripts/voicekit.py lint PATH_TO_DRAFT`. It is an editorial pattern check, not an AI detector, fact checker, voice validator, or approval to publish. Review every hit in context. Use `--allow-dashes` only when the member allows them. A clean lint report does not replace the five passes. If Python is absent, do the passes manually and say so only if asked.

## Deliver and improve

Show the finished draft first, without internal labels or source IDs inside the publishable body. Place only material assumptions or unresolved facts underneath. If the draft cannot responsibly be finished, make the missing piece obvious and ask specifically for it. Do not ship a factual placeholder as publication-ready.

During calibration, ask one focused question about a sentence. Otherwise use a short invitation to revise. Store draft version, applied source IDs, fact checks, feedback, and remaining limits in notes. Use a new version for edits so the member can recover prior copy.

Ideas should come from real context: a recurring customer question, a misconception the member has expressed, a useful demonstration, a lesson from a supplied experience, or a timely development that was actually checked. Do not fabricate hot takes, trends, or audience engagement data. No publishing or recurring schedule is created merely by saving an idea.
