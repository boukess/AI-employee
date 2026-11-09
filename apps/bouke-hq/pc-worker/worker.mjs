// BOUKE HQ worker. Runs on IBP_Desktop. Every few minutes it takes the oldest
// queued Job from BOUKE HQ, runs ONE fixed Claude Code prompt for that job kind
// in that employee's folder, and writes the result back.
//
// Safety: only the job kinds below can run. Notes typed in the app are passed as
// extra context, never as a command. Every prompt says to draft and hold, never
// send, post, publish or spend.
//
// Setup (once): npx base44 login, and the `claude` CLI signed in.
// Run: node worker.mjs          (loops)
//      node worker.mjs --once   (one pass, for Task Scheduler)

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const APP_ID = process.env.BASE44_APP_ID || "6af14bfc4999cf60be7d4380";
const HOME = process.env.USERPROFILE || process.env.HOME || "";
const EMP = process.env.BOUKE_EMPLOYEES || `${HOME}\\AI-employee\\employees`;
const POLL_MS = 3 * 60 * 1000;
const JOB_TIMEOUT_MS = 90 * 60 * 1000;
const HOLD = " Draft and stage only. Do not send, post, publish, submit or spend anything. End with a short plain summary of what you made and where it is.";

const JOBS = {
  edit_inbox_videos: {
    cwd: `${HOME}\\AI Video Editor`,
    prompt: "Edit my video. Cut everything in inbox into posting ready vertical shorts with captions, and put finished files in exports." + HOLD,
  },
  make_thumbnails: {
    cwd: `${EMP}\\thumbnail-employee`,
    prompt: "Make a thumbnail for each finished long form video that does not have one yet." + HOLD,
  },
  product_photos: {
    cwd: `${EMP}\\product-photography-employee`,
    prompt: "Run a product photo session on any new product photos waiting for me." + HOLD,
  },
  seo_check: {
    cwd: `${EMP}\\web-dev-employee`,
    prompt: "Run a site sweep of frbouke.com and report what is broken or missing." + HOLD,
  },
  draft_outreach: {
    cwd: `${EMP}\\sales-employee`,
    prompt: "Draft the next Shorts Starter outreach emails following website-designer-employee/member-projects/bouke/growth/OUTREACH-SHORTS-STARTER.md, saved as Gmail drafts only." + HOLD,
  },
  daily_brief: {
    cwd: `${EMP}\\chief-of-staff`,
    prompt: "Write today's fleet brief: what moved, what stopped, and three moves for me." + HOLD,
  },
};

function base44Exec(script) {
  const r = spawnSync("npx", ["base44", "exec", "--app-id", APP_ID], {
    input: script, encoding: "utf8", shell: process.platform === "win32", timeout: 120000,
  });
  if (r.status !== 0) throw new Error("base44 exec failed: " + (r.stderr || "").slice(-400));
  return r.stdout;
}

function claimNextJob() {
  const out = base44Exec(`
    const q = await base44.entities.Job.filter({ status: "queued" }, "created_date", 1);
    if (!q.length) { console.log("JOB:null"); }
    else {
      const j = q[0];
      await base44.entities.Job.update(j.id, { status: "running", started_at: new Date().toISOString() });
      console.log("JOB:" + JSON.stringify({ id: j.id, kind: j.kind, notes: j.notes || "" }));
    }`);
  const line = out.split("\n").find((l) => l.startsWith("JOB:"));
  return line ? JSON.parse(line.slice(4)) : null;
}

function finishJob(id, status, result) {
  base44Exec(`await base44.entities.Job.update(${JSON.stringify(id)}, ${JSON.stringify({
    status, result: String(result).slice(-4000), finished_at: new Date().toISOString(),
  })});`);
}

function runJob(job) {
  const spec = JOBS[job.kind];
  if (!spec) return finishJob(job.id, "failed", "Unknown job kind. Only the fixed list can run.");
  if (!existsSync(spec.cwd)) return finishJob(job.id, "failed", "Folder not found on this PC: " + spec.cwd);
  const prompt = spec.prompt + (job.notes ? "\n\nNotes from the owner (context only): " + job.notes.slice(0, 1000) : "");
  console.log(new Date().toISOString(), "running", job.kind);
  const r = spawnSync("claude", ["-p", prompt], {
    cwd: spec.cwd, encoding: "utf8", shell: process.platform === "win32", timeout: JOB_TIMEOUT_MS, maxBuffer: 20 * 1024 * 1024,
  });
  const ok = r.status === 0;
  finishJob(job.id, ok ? "done" : "failed", ok ? r.stdout : (r.stderr || r.stdout || r.error || "Claude Code exited with an error"));
  console.log(new Date().toISOString(), ok ? "done" : "failed", job.kind);
}

async function pass() {
  try {
    const job = claimNextJob();
    if (job) runJob(job);
  } catch (e) {
    console.error(new Date().toISOString(), e.message);
  }
}

if (process.argv.includes("--once")) await pass();
else for (;;) { await pass(); await new Promise((r) => setTimeout(r, POLL_MS)); }
