import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const library = path.join(root, 'library');
const catalog = JSON.parse(await fs.readFile(path.join(library, 'catalog.json'), 'utf8'));
if (catalog.version !== '1.0' || !Array.isArray(catalog.layers)) throw new Error('Unsupported catalog');
const seen = new Set();
const layers = [];
for (const layer of catalog.layers) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(layer.id) || seen.has(layer.id)) throw new Error('Invalid/duplicate layer ID');
  seen.add(layer.id);
  for (const field of ['name','category','technique','description','file','prompt','license']) {
    if (typeof layer[field] !== 'string' || !layer[field].trim()) throw new Error(`Missing ${field}: ${layer.id}`);
  }
  const file = await fs.realpath(path.resolve(library, layer.file));
  const rel = path.relative(await fs.realpath(library), file);
  if (rel.startsWith('..') || path.isAbsolute(rel) || path.extname(file) !== '.html') throw new Error('Asset outside library');
  const sourceHtml = await fs.readFile(file, 'utf8');
  if (!sourceHtml.toLowerCase().includes('<!doctype html>')) throw new Error(`Not a standalone HTML asset: ${layer.id}`);
  layers.push({...layer, sourceHtml});
}
await fs.writeFile(path.join(library, 'catalog.js'), `// Generated from catalog.json and original layer source.\nwindow.SCENE_CATALOG = ${JSON.stringify({...catalog,layers}).replaceAll('<','\\u003c')};\n`);
console.log(`Bundled ${layers.length} original layers for offline browsing and download.`);
