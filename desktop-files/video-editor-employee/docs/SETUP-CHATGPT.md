# Set up with ChatGPT

1. Unzip **AI Video Editor** and keep the extracted folder on your computer.
2. Open the desktop app's **local project / Codex** experience. Add or select the extracted folder as the project's primary folder. Choose local execution on the same computer as Resolve. If your ChatGPT interface only supports uploaded project files, use the local Codex app or CLI instead.
3. Start a task in that folder and paste `prompts/01-SETUP.txt`.
4. Follow any required app-installation or Resolve-settings steps, then let the AI finish setup.
5. Put a raw recording in `inbox` and say “Edit my video.” Your finished file appears in `exports`.

The local AI must be able to read/write this folder, run shell commands, view extracted images and research product media. The package does not require GitHub or an API key. Available app modes and account access depend on your installation/account; the setup checks capabilities instead of assuming them.

If you use Codex CLI, open a terminal in this folder and run `codex`, then paste the same setup prompt. Keeping the extracted folder as the working directory lets the AI find AGENTS.md and all relative paths.

Ordinary web project uploads can store your instructions, but they do not automatically connect the project to your computer's Resolve installation.

Official setup reference: [Projects and local folders](https://learn.chatgpt.com/docs/projects), checked 25 September 2026.
