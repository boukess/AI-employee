# Set up with Claude

Two ways to run your council in Claude:

- **Route 1: Claude Project** (web or desktop app). Most members use this. Works on every plan.
- **Route 2: Local folder** (Claude Code or Cowork). Best if you already use Claude Code. Your profile and every meeting are saved as files.

Click paths and limits checked September 2026.

---

## Route 1: Claude Project (web or desktop app)

About 10 minutes.

1. Unzip **AI Advisory Council** into a folder you will keep, such as Documents.
2. Go to claude.ai/projects, or open **Projects** in the left sidebar.
3. Click **+ New project**. Name it "AI Advisory Council", add a short description, and create it.
4. Click **Set project instructions**. Open `council/Council-Instructions.txt`, copy everything in it, paste it in, and click **Save instructions**.
5. In project knowledge, click **+** and upload these 7 files:
   - `council/Council-Roster.md`
   - `council/Council-Protocol.md`
   - `advisors/alex-hormozi/Alex-Hormozi-Brain.md`
   - `advisors/gary-vee/Gary-Vee-Brain.md`
   - `advisors/sam-altman/Sam-Altman-Brain.md`
   - `advisors/brian-chesky/Brian-Chesky-Brain.md`
   - `advisors/mrbeast/MrBeast-Brain.md`
6. Start a chat inside the project. Paste `prompts/01-SETUP.txt` and answer the 12 questions in one reply.
7. Claude gives you your finished profile in one block. Save it as `Business-Profile.md`: ask Claude for it as a downloadable file, or copy it into a plain text file (Mac: TextEdit, then **Format** > **Make Plain Text**; Windows: Notepad). Upload it to project knowledge. That is file 8.
8. Start a new chat in the project and ask your first question: `Ask the council: [your decision]`.

Already filled in `my-business/Business-Profile.md` by hand? Upload it with the others in step 5 and skip steps 6 and 7.

Do not upload the advisors' `*-Instructions.txt`, `*-Sources.md` or `SETUP.md` files to the council project. `Council-Instructions.txt` replaces the advisors' instructions here.

### Plan notes

- **Projects work on every plan, including Free.** Free allows up to **5 projects**.
- **Knowledge:** up to 30 MB per file. There is no file-count limit, but everything has to fit in Claude's context window.
- **Paid plans (Pro, Max, Team, Enterprise):** when knowledge gets close to the limit, Claude switches to RAG automatically, which holds up to 10x more. A visual indicator shows when it is on.
- **Free has no RAG.** The five brains are about 59,000 words together, so the full council may not fit on Free. Check the capacity indicator in project knowledge. If it is over, upload only the 3 brains you will use most. The Chair only seats advisors whose Brain file is in the project.
- Project instructions apply to every chat in that project.
- **Sharing a project needs Team or Enterprise.** On Pro and Max you can still share a single chat by link. Your profile is in the project, so share only with people who may see your numbers.
- **If a .md file is rejected,** rename it to .txt (for example `Alex-Hormozi-Brain.txt`) and upload it again. Nothing inside changes.

### Keeping it current

- **Your profile changed?** Say "Update my profile: [what changed]". Claude gives you the full updated profile. Delete the old `Business-Profile.md` from project knowledge first, then upload the new one, so Claude never reads two versions.
- **Monthly:** paste `prompts/06-BOARD-REVIEW.txt`.
- **Adding your own advisor:** see "Add an advisor on the web" in `council/Council-Roster.md`.

---

## Route 2: Local folder (Claude Code or Cowork)

Needs a **Pro, Max, Team or Enterprise** plan. Claude Code is built into the Claude desktop app, so there is nothing else to install.

1. Unzip **AI Advisory Council** into a permanent folder, such as Documents. Keep the folder name as it is.
2. Open the folder in one of these:
   - **Desktop app, Code tab:** click **Code** (top center), choose **Local**, click **Select folder**, and pick the `AI Advisory Council` folder.
   - **Cowork:** go to **Projects** > **+** > **Use an existing folder**, choose the `AI Advisory Council` folder, and name it. In the instructions box, paste: `Read and follow AGENTS.md in this folder.` Click **Create**. Desktop app only; the project stays on that computer.
   - **Terminal:** `cd` into the folder and run `claude`.
3. Paste `prompts/01-SETUP.txt`, or just say "Set up my council". Answer the 12 questions in one reply. Claude saves `my-business/Business-Profile.md`.
4. Ask your first question: "Ask the council: [your decision]". The meeting shows in the chat and is saved to `sessions/`.

Claude Code reads `CLAUDE.md`, which imports `AGENTS.md`, the council's operating instructions. Every prompt in `prompts/` also tells it to follow AGENTS.md, so Cowork picks it up too.

Depending on the rollout, your desktop app shows **Chat**, **Cowork** and **Code** tabs, or the new merged home. The Code tab stays where it was.

The council needs no API key, Python or other software. Cloning a new advisor does: Python 3 and a free tool called yt-dlp. Claude checks for both and asks before installing anything.

---

## Official references (checked September 2026)

- [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)
- [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
- [Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [RAG for projects](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects)
- [Project visibility and sharing](https://support.claude.com/en/articles/9519189-manage-project-visibility-and-sharing)
- [Claude Code desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)
- [How Claude remembers your project (CLAUDE.md and AGENTS.md)](https://code.claude.com/docs/en/memory)
- [Projects in Claude Cowork](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork)
- [Claude Cowork and Chat are one Claude](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)
