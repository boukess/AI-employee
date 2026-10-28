# Step 4: Read the creative

Goal: understand exactly what the person in the feed sees and hears, so the copy picks up where the creative leaves off.

## Get the file

- **Claude Code:** the member drags the file into the terminal (the path shows up in their message), or puts it in `workspace/creatives/`.
- **Codex:** the member attaches it, or puts it in `workspace/creatives/`.
- **ChatGPT:** the member uploads it to the chat. It lands in `/mnt/data/`.

If you got it from somewhere else, copy it into `workspace/creatives/` first, so the copy file can point to it.

If the brand has more than one offer and the creative doesn't make clear which one it's for, ask. That's the only question to ask here.

## Images

Run `python3 scripts/creative.py inspect PATH` for the size and placement fit. Then look at the image itself, closely: read every word on it.

## Videos

```
python3 scripts/creative.py inspect PATH
```

This saves frames to `workspace/creatives/_frames/<name>/`:

- `sheet.jpg`: a contact sheet of every frame. Look at this first.
- `f01.jpg` to `f04.jpg`: 0, 1, 2 and 3 seconds in. This is the hook, the part that decides whether anyone keeps watching. Look at each one.
- `transcript.txt`: the spoken words, if a speech-to-text package is installed.

Speech-to-text often mishears brand and product names (for example, "Cloud Code" for "Claude Code", or "school" for "Skool"). Use `brand.md` to fix obvious mishearings in your read.

If there's no transcript and the video has a voice, ask the member for the script, or ask them to type the first few lines. If there are no video tools, follow what the script prints (ask before installing anything).

## Write the creative read

Put this at the top of the copy file (see `docs/5-write.md`). Keep it to about 8 lines:

```markdown
## Creative read
- **File:** creatives/<name> (video, 9:16, 47 s)
- **Placement fit:** Reels and Stories first. Key text sits in the middle, so the 4:5 feed crop is fine.
- **Hook (0 to 3 s):** what is seen and heard
- **What it shows:** the demo, the person, the product, the setting
- **What it says:** spoken lines or on-screen text, summarized, with key phrases quoted
- **Offer in the creative:** price, CTA or end card, if any
- **Angle it already carries:** for example "build demo, founder-led, low price"
- **What the copy must add:** the job the words do that the creative doesn't (proof, the who-it's-for, objection handling, the offer details, a reason to click now)
```

## Matching copy to the creative

- Primary text sits **above** the creative in feed. The first line should feel like the same message as the hook frame, not a separate ad.
- Don't repeat the on-screen text word for word. Extend it, answer it, or set it up.
- If the creative makes a promise, the copy backs it with proof or specifics.
- If the creative is a demo, the copy names who it's for and what they get.
- If the creative is mostly emotional or visual, the copy carries the logic: what it is, the price, the next step.
- The headline sits **below** the creative. It's the last thing they read before the button, so it should close on the offer or the outcome.
- For 9:16 video seen in Reels, only about the first line of primary text shows over the video. Put the hook in the first 70 or so characters.
