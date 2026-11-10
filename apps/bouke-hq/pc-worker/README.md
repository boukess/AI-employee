# BOUKE HQ PC worker

Lets the "Run on my PC" buttons in BOUKE HQ start work on IBP_Desktop.

## Set up once

1. Copy this folder to the PC, for example `C:\Users\blood\bouke-hq-worker`.
2. In that folder, in PowerShell: `npm init -y` then `npm install --save-dev base44`
3. Install Deno (`irm https://deno.land/install.ps1 | iex` in PowerShell); the worker needs it.
4. `npx base44 login` (same Base44 account as the app)
5. Make sure `claude` works in a terminal and is signed in.
6. If your employee kits are not in `C:\Users\blood\AI-employee\employees`, set `BOUKE_EMPLOYEES` to the right folder.

## Run

- Keep it running: `node worker.mjs`
- Or register `node worker.mjs --once` in Windows Task Scheduler every 5 minutes.

## What it can do

Only the six job kinds in `worker.mjs`. Notes from the app are passed as context, never as a command. Every job drafts and holds: nothing is sent, posted or paid for.
