#!/usr/bin/env node
// Reports whether each pinned integration folder is checked out.
// Does not install packages, download models, or copy tool source.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, "..");

const CATALOG = [
  { id: "photocraft", fit: "needs install", license: "MIT OR Apache-2.0" },
  { id: "GIMP-ML", fit: "needs install", license: "MIT" },
  { id: "Compositor", fit: "not usable on platform", license: "MIT" },
  { id: "solidcraft", fit: "needs install", license: "MIT OR Apache-2.0" },
  { id: "PixPic", fit: "not usable on platform", license: "MIT" }
];

function findIntegrations(start) {
  if (process.env.INTEGRATIONS_ROOT) return process.env.INTEGRATIONS_ROOT;
  let dir = start;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "integrations");
    if (fs.existsSync(path.join(candidate, "README.md"))) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function toolState(root, id) {
  if (!root) return "missing";
  const dir = path.join(root, id);
  if (!fs.existsSync(dir)) return "missing";
  let names = [];
  try { names = fs.readdirSync(dir); } catch { return "missing"; }
  if (names.length === 0) return "empty";
  if (!names.includes("README.md")) return "empty";
  return "present";
}

function report(root) {
  return CATALOG.map((tool) => [tool.id, toolState(root, tool.id), tool.fit, tool.license].join("\t"));
}

function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "integration-check-"));
  const root = path.join(tmp, "integrations");
  fs.mkdirSync(path.join(root, CATALOG[0].id), { recursive: true });
  fs.writeFileSync(path.join(root, "README.md"), "# integrations\n");
  fs.writeFileSync(path.join(root, CATALOG[0].id, "README.md"), "# tool\n");
  fs.mkdirSync(path.join(root, CATALOG[1].id), { recursive: true });
  const rows = report(root);
  if (rows[0].split("\t")[1] !== "present") throw new Error("expected present, got " + rows[0]);
  if (rows[1].split("\t")[1] !== "empty") throw new Error("expected empty, got " + rows[1]);
  if (report(null)[0].split("\t")[1] !== "missing") throw new Error("expected missing");
  process.stdout.write("integration-check: PASS\n");
}

function help() {
  process.stdout.write([
    "node scripts/integration-check.mjs",
    "  Print checkout state for this kit's integrations.",
    "node scripts/integration-check.mjs --selftest",
    "  Check the reporter against a temporary tree.",
    "",
    "INTEGRATIONS_ROOT overrides discovery. A missing folder is a report, not a failure.",
    "Fit and license come from INTEGRATIONS.md. This script does not install anything.",
  ].join("\n") + "\n");
}

const args = process.argv.slice(2);
if (args.includes("--selftest")) {
  selftest();
} else if (args.includes("--help") || args.includes("-h")) {
  help();
} else {
  const root = findIntegrations(KIT);
  process.stdout.write("integrations\t" + (root || "not found") + "\n");
  process.stdout.write("id\tcheckout\tfit\tlicense\n");
  for (const line of report(root)) process.stdout.write(line + "\n");
  process.stdout.write("See INTEGRATIONS.md for how to run each tool.\n");
}
