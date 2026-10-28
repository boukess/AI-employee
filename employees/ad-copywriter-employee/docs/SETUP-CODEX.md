# Setup: Codex

You need a ChatGPT plan that includes Codex, and the Codex app or the Codex CLI.

## 1. Get the folder ready

1. Unzip the download.
2. Move the **AI Ad Copywriter** folder somewhere easy to find, like your Desktop.

## 2. Open it in Codex

Pick one:

- **Codex app:** add a new project and pick the **AI Ad Copywriter** folder.
- **Terminal:** run these two lines:
  ```
  cd ~/Desktop/"AI Ad Copywriter"
  codex
  ```

Codex reads the instructions in `AGENTS.md` by itself.

## 3. Start

Type **go** and press Enter.

## Good to know

- Approve the script commands when asked (`python3 scripts/...`). They only read and write files inside this folder and don't need internet.
- To give it a creative, attach the image or video, or put the file in `workspace/creatives/`.
- For the research step, Codex gives you Ad Library links. You open each one, select all, copy, and paste the page back in. About a minute per link.
