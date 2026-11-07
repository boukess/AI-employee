# Set up with ChatGPT

Two ways to run your council in ChatGPT:

- **Route 1: ChatGPT Project** (web or desktop app). Most members use this.
- **Route 2: Local folder** (Codex in the ChatGPT desktop app, or the Codex CLI). Your profile and every meeting are saved as files.

Click paths and limits checked September 2026.

---

## Route 1: ChatGPT Project (web or desktop app)

About 10 minutes. The full council is 8 files, so it needs **Go, Plus or higher**. Free allows only 5 files per project; see "On the Free plan" below.

1. Unzip **AI Advisory Council** into a folder you will keep, such as Documents.
2. In the sidebar, click **New project**. Name it "AI Advisory Council" and pick an icon and color.
3. Open the project, then click **•••** > **Project settings**. Paste everything in `council/Council-Instructions.txt`. Optional: set Memory to **Project-only memory** so your other chats do not mix in. Save.
4. In the project's **Sources** area, add these 7 files (up to 10 go in one batch):
   - `council/Council-Roster.md`
   - `council/Council-Protocol.md`
   - `advisors/alex-hormozi/Alex-Hormozi-Brain.md`
   - `advisors/gary-vee/Gary-Vee-Brain.md`
   - `advisors/sam-altman/Sam-Altman-Brain.md`
   - `advisors/brian-chesky/Brian-Chesky-Brain.md`
   - `advisors/mrbeast/MrBeast-Brain.md`
5. Start a new chat inside the project. Paste `prompts/01-SETUP.txt` and answer the 12 questions in one reply.
6. ChatGPT gives you your finished profile in one block. Save it as `Business-Profile.md`: ask ChatGPT for it as a downloadable file, or copy it into a plain text file (Mac: TextEdit, then **Format** > **Make Plain Text**; Windows: Notepad). Add it to **Sources**. That is file 8.
7. Start a new chat in the project and ask your first question: `Ask the council: [your decision]`.

Already filled in `my-business/Business-Profile.md` by hand? Add it with the others in step 4 and skip steps 5 and 6.

Do not add the advisors' `*-Instructions.txt`, `*-Sources.md` or `SETUP.md` files to the council project. `Council-Instructions.txt` replaces the advisors' instructions here.

### Plan notes

- **Projects are on every plan, with unlimited projects.** Files per project: **Free 5, Go and Plus 25, Pro, Business, Enterprise and Edu 40.**
- You can upload **10 files at a time**, and up to 80 files every 3 hours. **Free accounts can upload only 3 files a day.**
- Each file can be up to 512 MB. The brains are far smaller than that.
- Project instructions apply only inside that project and override your global custom instructions.
- The instruction box has no official limit, but users report about 8,000 characters. `Council-Instructions.txt` is under 7,500, so it fits.
- **Sharing works on every plan:** click **Share**, then choose "Only those invited" or "Anyone with a link", with chat or edit access. Up to 5 collaborators on Free, 10 on Go and Plus, 100 on Pro. Shared projects always use project-only memory. Your profile is in the project, so share only with people who may see your numbers.
- **If a .md file is rejected,** rename it to .txt (for example `Alex-Hormozi-Brain.txt`) and upload it again. Nothing inside changes.

### On the Free plan

Free allows 5 files per project and 3 uploads a day. Two options:

1. **Upgrade to Go or Plus** (25 files per project) for the full council.
2. **Run a smaller council of 3 advisors** (5 files, over two days):
   - **Day 1:** paste the instructions as in step 3. Add `Council-Protocol.md` and the brains of 2 of the 3 advisors you will use most. Run `prompts/01-SETUP.txt` in the project and save your profile.
   - **Day 2:** add the third brain and your `Business-Profile.md`.

   The Chair seats only advisors whose Brain file is in the project, and the instructions carry the routing, so the roster can stay out.

### Custom GPT (Business, Enterprise or Edu workspaces only)

Personal accounts (Free, Go, Plus, Pro) can no longer create new GPTs, and **custom GPTs are scheduled to retire on 11 December 2026.** Use a Project unless your workspace needs a GPT.

1. Go to chatgpt.com/gpts > **Create** > **Configure**.
2. Fill in the name and description. Paste `Council-Instructions.txt` into **Instructions**. Add the 8 files under **Knowledge** (up to 20 files).
3. Test it in Preview, then click **Create**. Share it according to your workspace settings.

GPTs do not use saved memory.

### Keeping it current

- **Your profile changed?** Say "Update my profile: [what changed]". ChatGPT gives you the full updated profile. Delete the old `Business-Profile.md` from Sources first, then add the new one, so ChatGPT never reads two versions.
- **Monthly:** paste `prompts/06-BOARD-REVIEW.txt`.
- **Adding your own advisor:** see "Add an advisor on the web" in `council/Council-Roster.md`.

---

## Route 2: Local folder (Codex)

Codex lives inside the ChatGPT desktop app. Free and Go get Codex in the desktop app, subject to rollout. Plus adds the Codex CLI. Pro, Business and Enterprise include it too.

1. Unzip **AI Advisory Council** into a permanent folder, such as Documents. Keep the folder name as it is.
2. Open the ChatGPT desktop app and choose **Codex**.
3. Create or open a project, then open its menu > **Edit project** > **Add folder** and add the `AI Advisory Council` folder. Point to it and click **Make primary**.
4. Start a **New chat** in that project. Paste `prompts/01-SETUP.txt`, or say "Set up my council". Answer the 12 questions in one reply. Codex saves `my-business/Business-Profile.md`.
5. Ask your first question: "Ask the council: [your decision]". The meeting shows in the chat and is saved to `sessions/`.

**Make the `AI Advisory Council` folder itself primary,** not a folder above or inside it. Codex reads AGENTS.md, the council's operating instructions, only from the primary folder.

**Codex CLI:** open a terminal, `cd` into the folder and run `codex`. Or run `codex --cd "<path to AI Advisory Council>"`.

A web ChatGPT Project cannot open a folder on your computer. The desktop app's **Projects** view shows both ChatGPT projects and local projects connected to folders.

The council needs no API key, Python or other software. Cloning a new advisor does: Python 3 and a free tool called yt-dlp. Codex checks for both and asks before installing anything.

---

## Official references (checked September 2026)

- [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)
- [File uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq)
- [Creating and editing GPTs](https://help.openai.com/en/articles/8554397-creating-and-editing-gpts)
- [Custom GPT retirement and migration FAQ](https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq)
- [Projects and local folders](https://learn.chatgpt.com/docs/projects)
- [The Codex app](https://learn.chatgpt.com/docs/app)
- [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)
