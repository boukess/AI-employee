# Set up with Claude

1. Unzip **AI Video Editor** and keep the extracted folder on your computer.
2. Open Claude Desktop's **Code** tab. Choose **Local**, then select the extracted folder.
3. Paste `prompts/01-SETUP.txt`. Claude reads CLAUDE.md, which points to the shared editor instructions.
4. Follow any required app-installation or Resolve-settings steps, then let Claude finish setup.
5. Put a raw recording in `inbox` and say “Edit my video.” Your finished file appears in `exports`.

Use a local Code session with shell and file access. The regular Chat tab and a cloud/VM session do not directly run this computer's Resolve. Claude Code account access is required; choose a plan that includes it. The editor itself does not ask for an API key.

If using Claude Code CLI, open a terminal in this folder, run `claude`, and paste the same setup prompt. On Windows, use the native Local environment for this package's Resolve bridge.

Official instructions: [Claude Code Desktop setup](https://code.claude.com/docs/en/desktop-quickstart) and [local environments](https://code.claude.com/docs/en/desktop#environment-configuration), checked 25 September 2026.
