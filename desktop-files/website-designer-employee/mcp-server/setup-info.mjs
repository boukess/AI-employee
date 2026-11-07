import { fileURLToPath } from 'node:url';

const serverPath = fileURLToPath(new URL('./server.mjs', import.meta.url));
const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
const command = `${quote(process.execPath)} ${quote(serverPath)}`;
console.log('Copy the command for your app. These commands register a local server; this helper only prints them.');
console.log(`\nClaude Code (user scope):\nclaude mcp add --transport stdio --scope user scene-library -- ${command}`);
console.log(`\nCodex:\ncodex mcp add scene-library -- ${command}`);
console.log('\nGeneric MCP JSON configuration:\n' + JSON.stringify({ mcpServers: { 'scene-library': { command: process.execPath, args: [serverPath] } } }, null, 2));
