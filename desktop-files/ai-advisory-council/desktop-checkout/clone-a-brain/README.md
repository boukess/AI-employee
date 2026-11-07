# Clone-A-Brain Kit

Turn anyone's public content, or your own, into an AI advisor that reasons like them.

You pick a person. The kit researches them through four lenses, reads real transcripts of them talking, and writes an advisor you can load into ChatGPT or Claude. The five advisors in the AI Advisory Council course (Alex Hormozi, Gary Vee, Sam Altman, Brian Chesky and MrBeast) were built with this exact method.

Who you can clone:

- **A business owner you admire.** Anyone with a lot of long-form public material: books, podcasts, talks.
- **A mentor, with their permission.**
- **Yourself.** From your videos, voice notes, SOPs and posts, so your team or your AI can answer like you.

## What you get

Every clone ends up as the same set of files:

| File | What it is | Where it goes |
|---|---|---|
| `<Name>-Brain.md` | The full brain: beliefs, frameworks, decision rules, diagnostic questions, playbooks, stories, blind spots and voice. 5,000 to 12,000 words. | Upload as knowledge |
| `<Name>-Instructions.txt` | How the advisor thinks, talks and answers. Under 7,500 characters. | Paste into the project instructions |
| `<Name>-Sources.md` | Every source used, with links. | Keep for yourself |
| `SETUP.md` | Click-by-click setup for this advisor (local path only). | Read it once |

## What is inside this kit

```
clone-a-brain/
  README.md                     this file
  Clone-A-Brain-Method.md       the guide: read this first (about 10 minutes)
  CLONE-PROCEDURE.md            the step-by-step procedure a local AI follows
  AGENTS.md, CLAUDE.md          so Claude Code and Codex know what to do in this folder
  prompts/                      copy-paste prompts for ChatGPT and Claude in the browser
    01-Deep-Research-Prompt.txt
    02-Build-The-Brain.txt
    03-Write-The-Instructions.txt
    04-Test-Your-Clone.txt
    05-Clone-From-Your-Own-Files.txt
  templates/
    BRAIN-TEMPLATE.md           the 13-section brain every advisor follows
    INSTRUCTIONS-TEMPLATE.txt   the instructions every advisor follows
    SOURCES-TEMPLATE.md         the sources list
  tools/
    yt_transcript.py            pulls clean YouTube transcripts (local path)
  sources/                      drop your own files here to clone yourself
  my-advisors/                  finished clones land here (local path)
```

## Two ways to use it

### 1. Web chat (ChatGPT or Claude, nothing to install)

Best if you use ChatGPT or Claude in the browser or desktop app.

1. Read `Clone-A-Brain-Method.md`.
2. Run `prompts/01-Deep-Research-Prompt.txt` in ChatGPT Deep Research or Claude Research mode.
3. Run `02-Build-The-Brain.txt` with the research and the templates attached.
4. Run `03-Write-The-Instructions.txt` to get the instructions.
5. Put both files in a Claude or ChatGPT Project.
6. Run the five tests in `04-Test-Your-Clone.txt`.

To clone yourself or a mentor on the web, use `05-Clone-From-Your-Own-Files.txt` instead of 01 to 03.

Time: about 1 hour for a quick clone, 2 to 3 hours for a full one. Most of that is waiting on research.

### 2. Local AI folder (Claude Code or Codex)

Best if you already run Claude Code (Claude desktop app, Code tab) or Codex (ChatGPT desktop app). The AI does the research, pulls the transcripts and writes every file for you.

1. Unzip this kit into a permanent folder.
2. Open the folder as your AI's local project.
   - **Claude desktop:** click **Code** > **Local** > **Select folder**. Needs Pro, Max, Team or Enterprise.
   - **ChatGPT desktop (Codex):** open a project > **Edit project** > **Add folder** > **Make primary**. Start a **New chat**.
   - **Terminal:** `cd` into the folder and run `claude` or `codex`.
3. Say one of these:
   - **"Clone Alex Hormozi's brain."** (any name)
   - **"Clone my brain."** (put your files in `sources/` first)
   - **"Test my clone."**
4. Answer its short questions. It works on its own from there and tells you when the files are ready.

It needs Python 3 and a free tool called yt-dlp for transcripts. The AI checks for both and helps you install them.

Time: about 10 minutes of yours. The AI works for 1 to 3 hours on a standard clone.

## Where your clone ends up

- **Kit on its own:** `my-advisors/<name>/`
- **Kit inside the full AI Advisory Council package:** `advisors/<name>/` next to the five course advisors, and the new advisor is added to `council/Council-Roster.md` so it can sit in your council meetings.

## The rules

- Public figures: build only from public material. Call it an AI advisor built from their public work.
- Never sell it, present it as the real person, or imply they endorse you or it.
- Private people, like a mentor or a colleague: only with their permission.

The full ethics section is in `Clone-A-Brain-Method.md`.

## Start here

Read `Clone-A-Brain-Method.md`. Then pick your path above.
