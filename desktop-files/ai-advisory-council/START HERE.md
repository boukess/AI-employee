# AI Advisory Council

Your business. Five advisors. One clear call.

Fill in your business profile once. Then bring any decision to a council of AI advisors built from the public work of Alex Hormozi, Gary Vee, Sam Altman, Brian Chesky and MrBeast. Each one answers from their own frameworks, in their own voice, and they keep their real disagreements. A neutral Chair weighs them against your numbers and makes the call: what to do, your next 3 actions, and what would change the decision.

## Start once

1. **Unzip this folder** somewhere you will keep it, such as Documents. Open `START HERE.html` for the visual guide.
2. **Choose web or local.**
   - **Grok Bot (this fleet):** open the **AI Advisory Council** teammate or this folder; follow `docs/SETUP-GROK.md` and paste `prompts/01-SETUP.txt`.
   - **Web project (most members):** make a Claude Project or ChatGPT Project. Paste `council/Council-Instructions.txt` as its instructions. Upload 7 files: `council/Council-Roster.md`, `council/Council-Protocol.md` and the five `*-Brain.md` files in `advisors/`. Click-by-click steps: `docs/SETUP-CLAUDE.md` or `docs/SETUP-CHATGPT.md`.
   - **Local folder:** open this exact folder in Claude's **Code** tab with **Local** selected, in Cowork, or as the primary folder of a Codex project in the ChatGPT desktop app. Meetings are saved as files.
3. **Paste `prompts/01-SETUP.txt`.** Answer 12 short questions in one reply. Local: your profile is saved to `my-business/`. Web: save the profile it gives you as `Business-Profile.md` and upload it as your 8th file.
4. **Ask your first question:** "Ask the council: [a real decision, with a number in it]".

## Every question after that

Just say it:

- **"Ask the council: ..."** 3 to 5 advisors answer, then the Chair makes the call. Say "Full council: ..." for all five.
- **"Ask Hormozi: ..."** One advisor. Gary, Sam, Chesky and MrBeast work too.
- **"Debate Hormozi vs Chesky: ..."** Two advisors, three rounds, a verdict for your business.
- **"Hot seat: ..."** The advisors question you first, then the meeting runs.
- **"Board review"** Once a month: your numbers in, 3 priorities out.
- **"Quick poll: ..."** One line from each advisor.
- **"Update my profile: ..."** When something changes in your business.

Copy-paste versions, with starter questions for each advisor, are in `prompts/`.

To add your own advisor (an operator in your industry, a mentor who says yes, or yourself), say **"Clone [name]'s brain"** in local mode, or use `prompts/07-CLONE-A-NEW-ADVISOR.txt` with the Clone-A-Brain Kit on the web.

## What you need to know

- **These are AI advisors built from public work:** books, interviews, podcasts, talks and posts. They are not the real people. This package is not affiliated with or endorsed by Alex Hormozi, Gary Vaynerchuk, Sam Altman, Brian Chesky, Jimmy Donaldson (MrBeast) or their companies.
- **Research date: September 2026.** Each advisor was built from 78 to 132 sources, listed in their `*-Sources.md` file. Anything after that date is not in their brain.
- **Advice, not guarantees.** Check anything important before you act. For legal, tax, medical or investment questions, see a qualified professional.
- **Plans.** Grok Bot works as a teammate with this folder. Claude Projects work on every plan, but Free has no RAG, so check the capacity indicator. ChatGPT Free allows 5 files per project, so the full council needs Go or Plus. Local mode needs Claude Code (Pro, Max, Team or Enterprise) or Codex in the ChatGPT desktop app. Gemini works too: make a New Gem, paste the council instructions, and add the 8 files under Knowledge.
- **Your data.** Your profile and meetings live in this folder (local) or in your project (web). Leave out passwords, account numbers and customers' personal details.
- **How to update.**
  - **Your profile:** say "Update my profile", or run a monthly "Board review".
  - **An advisor, local:** say "Update Gary Vee's brain". It researches what is new since September 2026.
  - **An advisor, web:** follow "Keeping it current" in `clone-a-brain/Clone-A-Brain-Method.md`, then replace the Brain file in your project. Delete the old file first, so the AI never reads two versions.
- **If a platform rejects a .md file,** rename it to .txt and upload it again.

The ZIP includes five complete advisors (brain, instructions, sources and single-advisor setup for each), the council files, a business profile template, the Clone-A-Brain Kit, copy-paste prompts and setup guides. The council itself needs no API key and no software. Only cloning new advisors in local mode needs Python and yt-dlp, and the AI helps you install them.
