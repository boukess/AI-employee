// Copies store/products.json to dist/products.json so the static shop
// shows the same catalog the server prices. Run after every catalog edit:
//   node employees/website-designer-employee/member-projects/bouke/store/sync-public.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const src = join(dir, "products.json");
const dest = join(dir, "../dist/products.json");
writeFileSync(dest, readFileSync(src));
process.stdout.write("synced " + dest + "\n");
