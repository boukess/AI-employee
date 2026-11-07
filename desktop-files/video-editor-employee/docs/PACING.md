# Natural speech continuity

The cut list must sound like a continuous delivery. Removing the obvious long pauses is only the first pass. ASR word timestamps can begin hundreds of milliseconds before the speaker actually starts; do not use them as exact edit boundaries.

- Inspect the real waveform around each join. Preserve consonant attacks, word endings, small breaths and the speaker's cadence. Keep a short lead/tail; do not hard-cut to the first loud sample.
- Count outgoing tail and incoming lead together. Two individually short handles can produce an awkward combined pause. Sentence changes often work with around 120–250ms total breathing room, but this is a starting point, not an automatic rule.
- Keep an uninterrupted take when it reads well. Remove a retry as a complete phrase. Avoid cutting within a word or introducing new emphasis by splicing incompatible deliveries.
- Identify dead air inside retained sections too. Shorten distracting hesitation without erasing intentional pauses or making every word touch.
- Cover visible take changes with purposeful real product footage, screenshots or full-page explanatory animations. Let the cutaway begin slightly before the source cut and continue across it. Do not align every graphic change to every speech edit.
- Keep voice continuous under source media. Tiny boundary fades prevent clicks; they do not fix poor pacing. Never add a crossfade that doubles syllables. Do not speed up the entire speaker merely to hide pauses.
- Check the assembled audio in context before the final export. No separate review or critique agent is involved.

`prepare` now writes `cadence-report.json`: it detects quiet source intervals at -40dB, maps them through the cuts, merges adjacent quiet handles across joins and flags retained gaps over 300ms. This is an advisory diagnostic. Noise level, quiet phonemes and breathing can fool amplitude thresholds; the editor still decides from the recording.

