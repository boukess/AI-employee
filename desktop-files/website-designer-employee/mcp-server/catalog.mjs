import { open, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

export const DEFAULT_LIBRARY_DIR = fileURLToPath(new URL('../library/', import.meta.url));
const MAX_CATALOG_BYTES = 1024 * 1024;
const MAX_SOURCE_BYTES = 256 * 1024;
const text = (max) => z.string().trim().min(1).max(max);
const relativeFile = text(240).refine((value) =>
  !path.isAbsolute(value) && !/[\\:\x00-\x1f]/u.test(value) &&
  value.split('/').every((part) => part !== '' && part !== '.' && part !== '..') &&
  value.endsWith('.html'), 'Must be a relative HTML path inside the library');

const Layer = z.object({
  id: text(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  name: text(120),
  category: text(80),
  technique: text(200),
  tags: z.array(text(64)).max(24),
  description: text(2000),
  prompt: text(12000),
  file: relativeFile,
  license: text(4000),
  preview: text(500).optional(),
});
const Catalog = z.object({ version: z.literal('1.0'), layers: z.array(Layer).max(500) });

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function safePath(root, relative) {
  const resolved = await realpath(path.resolve(root, relative));
  if (!isInside(root, resolved)) throw new Error('Library file is outside the allowed directory.');
  return resolved;
}

async function readBounded(filename, limit) {
  const handle = await open(filename, 'r');
  try {
    const info = await handle.stat();
    if (!info.isFile() || info.size > limit) throw new Error('Library file exceeds the supported size or is not a regular file.');
    // Read at most limit + 1 bytes even if the file changes after stat().
    const buffer = Buffer.alloc(limit + 1);
    let length = 0;
    while (length <= limit) {
      const { bytesRead } = await handle.read(buffer, length, buffer.length - length, length);
      if (bytesRead === 0) break;
      length += bytesRead;
    }
    if (length > limit) throw new Error('Library file exceeds the supported size.');
    return buffer.toString('utf8', 0, length);
  } finally {
    await handle.close();
  }
}

export async function loadLibrary(libraryDir = DEFAULT_LIBRARY_DIR) {
  const root = await realpath(libraryDir);
  const catalogPath = await safePath(root, 'catalog.json');
  const parsed = Catalog.safeParse(JSON.parse(await readBounded(catalogPath, MAX_CATALOG_BYTES)));
  if (!parsed.success) throw new Error('Invalid library/catalog.json: check the documented catalog schema.');
  const { version, layers } = parsed.data;
  const ids = new Set();
  for (const layer of layers) {
    if (ids.has(layer.id)) throw new Error(`Duplicate layer id: ${layer.id}`);
    ids.add(layer.id);
  }
  return {
    version,
    layers,
    async sourceFor(layer) {
      if (!ids.has(layer.id) || !layers.includes(layer)) throw new Error('Unknown layer.');
      return readBounded(await safePath(root, layer.file), MAX_SOURCE_BYTES);
    },
  };
}

export function searchLibrary(library, { query = '', category, tags = [], limit = 8 } = {}) {
  const terms = query.toLocaleLowerCase('en-US').split(/\s+/u).filter(Boolean);
  const matches = library.layers.map((layer) => {
    const title = `${layer.id} ${layer.name}`.toLocaleLowerCase('en-US');
    const facets = `${layer.category} ${layer.technique} ${layer.tags.join(' ')}`.toLocaleLowerCase('en-US');
    const haystack = `${title} ${facets} ${layer.description}`.toLocaleLowerCase('en-US');
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 4 : facets.includes(term) ? 2 : haystack.includes(term) ? 1 : 0), 0);
    return { layer, haystack, score };
  }).filter(({ layer, haystack }) =>
    (!category || layer.category.toLowerCase() === category.toLowerCase()) &&
    tags.every((tag) => layer.tags.some((value) => value.toLowerCase() === tag.toLowerCase())) &&
    terms.every((term) => haystack.includes(term)))
    .sort((a, b) => b.score - a.score || a.layer.name.localeCompare(b.layer.name));
  return {
    total: matches.length,
    returned: Math.min(matches.length, limit),
    hasMore: matches.length > limit,
    layers: matches.slice(0, limit).map(({ layer }) => ({
      id: layer.id, name: layer.name, category: layer.category,
      technique: layer.technique, tags: layer.tags,
      description: layer.description.slice(0, 500),
      ...(layer.preview ? { preview: layer.preview } : {}),
    })),
  };
}
