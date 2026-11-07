# Set up the Sam Altman advisor

This folder turns Claude or ChatGPT into an advisor that reasons like Sam Altman about strategy, big bets, focus, growth, hiring and building with AI. It is an AI built from his public work. It is not Sam Altman and is not affiliated with him.

## What's in this folder

- **Sam-Altman-Instructions.txt**: the instructions you paste in. Under 7,500 characters, so it fits every instruction box.
- **Sam-Altman-Brain.md**: the full brain. You upload this as a knowledge file.
- **Sam-Altman-Sources.md**: every source used, with links. You do not need to upload this.
- **SETUP.md**: this file.

Pick one route below. Setup takes about five minutes.

**If a platform rejects the .md file,** rename it from `Sam-Altman-Brain.md` to `Sam-Altman-Brain.txt` and upload it again. Nothing inside changes.

---

## Route A: Claude Project (web or desktop app, any plan)

1. Go to claude.ai/projects, or open **Projects** in the left sidebar.
2. Click **+ New project**. Name it "Sam Altman Advisor", add a short description, and create it.
3. Click **Set project instructions**. Paste everything in `Sam-Altman-Instructions.txt`. Click **Save instructions**.
4. In project knowledge, click **+** and upload `Sam-Altman-Brain.md`.
5. Start a chat inside the project.

**Plan notes:**
- Projects work on every plan, including Free. Free allows up to **5 projects**.
- Knowledge files can be up to 30 MB each. The brain is far smaller than that.
- Project instructions apply to every chat in that project.
- Sharing a project with teammates needs a Team or Enterprise plan. On Pro and Max you can still share a single chat by link.

## Route B: ChatGPT Project (web or desktop app)

This is the default route for Free, Go, Plus and Pro accounts.

1. In the sidebar, click **New project**. Name it "Sam Altman Advisor" and pick an icon and color.
2. Open the project, then click **•••** > **Project settings**. Paste everything in `Sam-Altman-Instructions.txt`.
3. Optional: set Memory to **Project-only memory** so this advisor does not mix in your other chats. Save.
4. In the project's **Sources** area, add `Sam-Altman-Brain.md`.
5. Start a new chat from inside the project.

**Plan notes:**
- Projects are on every plan. Files per project: **Free 5, Go and Plus 25, Pro, Business, Enterprise and Edu 40.** This advisor needs only 1.
- Free accounts can upload only 3 files a day.
- Project instructions apply only inside that project and override your global custom instructions.
- The instruction box has no official limit, but users report about 8,000 characters. Our file is under 7,500, so it fits.

### Custom GPT (Business, Enterprise or Edu workspaces only)

Personal accounts (Free, Go, Plus, Pro) can no longer create new GPTs. **Custom GPTs are scheduled to retire on 11 December 2026.** Use a Project unless your workspace needs a GPT.

1. Go to chatgpt.com/gpts > **Create** > **Configure**.
2. Fill in the name and description. Paste `Sam-Altman-Instructions.txt` into **Instructions**. Add `Sam-Altman-Brain.md` under **Knowledge**.
3. Test it in Preview, then click **Create**. Share it according to your workspace settings.

## Route C: As part of the full council

The council puts all five advisors in one place, reads your business profile, and has a neutral Chair turn their answers into one decision. Module 7 (Setup AI Council) walks through it. The short version:

### Local folder (best if you use Claude Code or Codex)

Unzip the full `AI Advisory Council` package into a permanent folder. This advisor already sits in `advisors/sam-altman/`.

- **Claude desktop app, Code tab:** click **Code** (top center), choose **Local**, click **Select folder**, and pick the `AI Advisory Council` folder. Paste the start prompt. Needs Pro, Max, Team or Enterprise.
- **Claude Cowork:** go to **Projects** > **+** > **Use an existing folder**, choose the folder, name it, then click **Create**. Desktop app only, paid plans only.
- **Claude Code in a terminal:** `cd` into the folder and run `claude`.
- **ChatGPT desktop app (Codex):** create or open a project, then **Edit project** > **Add folder** > **Make primary** for the `AI Advisory Council` folder. Start a **New chat** in it. Codex reads AGENTS.md from the primary folder.
- **Codex in a terminal:** `cd` into the folder and run `codex`.

To hear from Sam alone, name the Sam Altman advisor in your message and ask for only his answer.

### Web project (Claude or ChatGPT)

Upload 8 files: `Council-Roster.md`, `Council-Protocol.md`, `Business-Profile.md`, and the five `<Name>-Brain.md` files (including `Sam-Altman-Brain.md`). Paste `Council-Instructions.txt` as the project instructions.

- **Claude Project:** **Projects** > **+ New project** > name it "AI Advisory Council" > **Set project instructions** > paste > **Save instructions** > click **+** in project knowledge and upload all 8 files. On paid plans, Claude switches to RAG automatically if the files get large. **Free has no RAG and a limit of 5 projects,** so the full council may not fit. Check the capacity indicator.
- **ChatGPT Project:** **New project** > name it "AI Advisory Council" > **•••** > **Project settings** > paste > save > upload the 8 files under **Sources** (up to 10 at once). **Free allows only 5 files per project,** so the full council needs **Go or Plus** or higher.

---

## Check it works

Ask: "Are you really Sam Altman?" It should say it is an AI advisor built from his public work.
Then ask one of the questions below. A good answer names one metric or one framework (love before growth, flashlight app vs Uber, code red, hire for slope), gives numbers and a time frame, names something to cut, and ends with "Do this week:".

## The 5 best first questions to ask this advisor

1. "Here is my business in one sentence: [your sentence]. Run the 'really bummed' test with me. Do my customers love it enough to grow, and what should I fix first?"
2. "My revenue for the last six months was [numbers]. Why am I not growing faster? Pick my one metric and name the three things blocking it."
3. "Here is how my team and I use AI today: [list]. Which few-hour tasks should we hand to AI first, and which one workflow should I redesign AI-first?"
4. "I want to build [AI product or service]. Is it a flashlight app or an Uber? What happens to it when a much better model ships?"
5. "I'm running these projects: [list]. Which pretty-good idea should I kill so I can go all in on the great one?"
