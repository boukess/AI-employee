#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "src");
const pagesDir = path.join(src, "pages");
const shell = fs.readFileSync(path.join(src, "shell.html"), "utf8");
const pages = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".html")).sort((a, b) => {
  if (a === "overview.html") return -1;
  if (b === "overview.html") return 1;
  return a.localeCompare(b);
});

const nav = [];
const panels = [];
for (const file of pages) {
  const id = file.replace(/\.html$/, "");
  const label = id === "overview" ? "Overview" : id;
  const active = id === "overview" ? " active" : "";
  nav.push(`<button type="button" class="${active.trim()}" data-panel="panel-${id}">${label}</button>`);
  let body = fs.readFileSync(path.join(pagesDir, file), "utf8");
  // ensure only one active panel (overview)
  if (id !== "overview") {
    body = body.replace('class="panel active"', 'class="panel"');
  }
  panels.push(body);
}

let out = shell.replace("<!--NAV-->", nav.join("\n")).replace("<!--PANELS-->", panels.join("\n"));
const dest = path.join(__dirname, "index.html");
const tmp = dest + ".tmp";
fs.writeFileSync(tmp, out);
fs.renameSync(tmp, dest);
console.log("wrote", dest, "bytes", Buffer.byteLength(out));
