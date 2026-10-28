# Build and calibrate a voice profile

This package uses a reference corpus and persistent instructions. It does not train model weights. “Learning your voice” means using evidence and corrections in future drafting.

## Store source records

Use `templates/source-record.json` or the same fields in a readable table. Required distinctions:

- `human_original`: confirmed original writing or spontaneous speech by the member.
- `performed_speech`: the member is speaking, but the script's authorship is unknown or assisted. Useful for delivery and vocabulary, cautiously.
- `ai_assisted`: prior copy known to involve AI; use only as preference evidence, particularly the member's edits.
- `unknown`: authorship unresolved. Keep for context or facts, not core voice evidence.
- `third_party`: somebody else's words, including customer reviews. Exclude from personal voice.
- `generated_draft`: your output. Never treat it as independent source evidence.

Each record has a purpose: `style`, `facts`, `holdout`, `feedback`, or `excluded`. A holdout is kept aside from profile construction and examined only during the later check. Do not split the same article or recording between learning and holdout. Capture canonical origin/group, author verification, source date (null if unknown), retrieval date, privacy, permission basis, raw-text hash, retained text, transformations, confidence, and limitations. Never invent a publication date.

Keep the original separately when permitted. Remove markup, navigation, timestamps, repeated subtitle cues, quotes by other people, and signatures from the analysis copy. Do not erase stylistic punctuation from human writing. Preserve recognition errors in raw transcripts and annotate corrections. Detect duplicates using canonical URLs, shared recording origin, and normalized text. Near duplicates require review, not automatic proof of independent evidence.

Optional helper: `python3 scripts/voicekit.py add --help`. Use it only if Python is available. It counts and stores; it cannot verify authorship or permissions for you. Manual tables work equally well.

## Coverage, not a false completion score

Practical collection targets, not scientific thresholds:

| Stage | What it means | Action |
|---|---|---|
| Starter | Only a message/interview or a few short pieces | Draft cautiously; label unknown habits |
| Working | Roughly 5–10 independent pieces and 1,500–4,000 usable words, with topic variation | Build evidenced rules; calibrate with member |
| Broad | Roughly 15–30 pieces and 5,000–15,000 usable words spanning relevant situations | Check channel coverage, holdouts, recency and contradictions |

A large monologue can still leave email tone unknown. A small set of user-corrected emails can be more useful for email writing than hours of video. Count distinct origins, usable words, formats, authorship quality, and unresolved gaps. State confidence separately for each writing mode. Never call a total-word threshold “voice accuracy.”

## Extract a useful profile

Read representative material, not just statistics. Write `workspace/voice-profile.md` using the template. Include:

- **Reader relationship:** peer, teacher, teammate, storyteller; how they address someone.
- **Reasoning:** how a thought unfolds, concrete examples, objections, uncertainty, and how they get to a point.
- **Rhythm:** sentence/paragraph variation, contractions, fragments, transitions, rhetorical questions; timing only when supported.
- **Language:** preferred vocabulary, recurring natural phrases, jargon with translations, terms they avoid. Record frequency and context, not a list to stuff into every draft.
- **Emotional range:** warmth, excitement, skepticism, humor, vulnerability; distinguish observed from unknown.
- **Openings/endings:** actual habits and channel differences, including whether a CTA is appropriate.
- **Formatting:** paragraph length, lists, emoji use, capitalization, punctuation.
- **Personal boundaries:** claims, stories, opinions, private details that are not authorized for reuse.

Every inferred rule needs source IDs and a brief supporting example. Ideally a recurring rule has two independent examples. A single occurrence is a tentative observation. Explicit user preferences need no repeated evidence. Record contradictions rather than smoothing them away.

Create modes for email, article, story, and spoken script. Only populate a mode with evidence. If evidence is speech-heavy, translate its reasoning and vocabulary into readable prose but label written-mode confidence low. Do not make an article sound like a caption or force an email to include a Reel's keyword CTA.

## Calibration

Draft 100–180 words about a topic supported by the member's context. Ask which sentence sounds least like them. Do not ask whether an abstract list of adjectives feels right. If they edit it, save the before/after, their explanation, and a narrow resulting rule. “Make this email less formal” is initially an email rule, not permission to flatten every future story.

Review a held-out source from a distinct origin if available: compare relationship, reasoning sequence, vocabulary, rhythm, and ending. Record matches and mismatches in words, not a made-up numerical accuracy score. Do not claim a blind validation if you used the source to build the profile. External user review is the strongest calibration; until received, say “awaiting your edits.”

Useful evidence has limits. Do not create deliberate typos, filler, random slang, fake memories, or forced roughness to make prose seem human.
