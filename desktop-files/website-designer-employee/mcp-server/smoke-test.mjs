import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({ name: 'scene-smoke-test', version: '1.0.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('./server.mjs', import.meta.url))], stderr: 'pipe' });
const read = (result) => {
  assert.equal(result.isError, undefined, JSON.stringify(result.content));
  return JSON.parse(result.content.find((block) => block.type === 'text').text);
};
try {
  await client.connect(transport);
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ['get_layer', 'list_categories', 'search_layers']);
  assert.ok(tools.every((tool) => tool.annotations.readOnlyHint === true));
  const categories = read(await client.callTool({ name: 'list_categories', arguments: {} }));
  const search = read(await client.callTool({ name: 'search_layers', arguments: { limit: 20 } }));
  assert.ok(search.total > 0, 'The bundled catalog must contain at least one layer.');
  assert.equal(categories.totalLayers, search.total);
  assert.ok(search.layers.every((layer) => !('source' in layer)));
  for (const entry of search.layers) {
    const layer = read(await client.callTool({ name: 'get_layer', arguments: { id: entry.id } }));
    assert.equal(layer.id, entry.id);
    assert.match(layer.source.code, /<html[\s>]/iu);
    assert.ok(layer.prompt && layer.metadata.license);
  }
  const missing = await client.callTool({ name: 'get_layer', arguments: { id: 'no-such-layer-for-test' } });
  assert.equal(missing.isError, true);
  const invalid = await client.callTool({ name: 'search_layers', arguments: { limit: 10000 } });
  assert.equal(invalid.isError, true);
  console.log(`PASS: MCP initialization, tools/list, all 3 tools, ${search.layers.length} layer sources, missing-id and input bounds.`);
} finally {
  await client.close();
}
