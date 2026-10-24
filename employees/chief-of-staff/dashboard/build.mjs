// build.mjs  concatenates src into one self contained index.html
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "src");
const read = (p) => readFileSync(p, "utf8").replace(/^\uFEFF/, "");

const css = read(join(src, "app.css"));
const js = read(join(src, "app.js"));
const pages = readdirSync(join(src, "pages"))
  .filter((f) => f.endsWith(".html"))
  .sort()
  .map((f) => read(join(src, "pages", f)))
  .join("\n");

// split/join, not replace: a replacement string containing $& or $1 would be
// interpreted by String.replace and silently mangle the page.
let out = read(join(src, "index.html"));
out = out.split("<!--CSS-->").join(`<style>\n${css}\n</style>`);
out = out.split("<!--PAGES-->").join(pages);
out = out.split("<!--JS-->").join(`<script>\n${js}\n</script>`);

writeFileSync(join(here, "index.html"), out, "utf8");
console.log("built index.html", out.length, "bytes");
