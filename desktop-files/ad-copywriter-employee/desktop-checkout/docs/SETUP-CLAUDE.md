# Setup: Claude Code

You need a paid Claude plan (Pro or Max) and Claude Code. The desktop app is the easiest way in.

## 1. Get the folder ready

1. Unzip the download.
2. Move the **AI Ad Copywriter** folder somewhere easy to find, like your Desktop.

## 2. Open it in Claude Code

Pick one:

- **Claude desktop app:** open the **Code** tab, choose "Open folder", and pick **AI Ad Copywriter**.
- **Terminal:** run these two lines:
  ```
  cd ~/Desktop/"AI Ad Copywriter"
  claude
  ```
- **VS Code:** open the folder (File > Open Folder), then open the Claude Code panel.

## 3. Start

Type **go** and press Enter.

It will interview you, research the ads in your niche, and then ask for your creative.

## Good to know

- When it asks to run a script (`python3 scripts/...`), choose **Yes, and don't ask again**. The scripts only read and write files inside this folder.
- To give it a creative, drag the image or video file into the Claude Code window, or put the file in `workspace/creatives/`.
- **Optional, saves you some copying:** if you use the Claude in Chrome extension, Claude can open the Ad Library itself. Without it, Claude gives you links and you paste the pages in. That takes about a minute per link.
- If it says Python is missing, run `xcode-select --install` in Terminal on a Mac and click Install. On Windows, install Python from python.org and tick "Add to PATH".
