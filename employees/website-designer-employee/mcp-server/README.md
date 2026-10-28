# Optional SCENE library MCP

Give Claude Code, Codex, or another local MCP host access to your bundled original website layers. The server searches `../library/catalog.json` and returns the selected layer's specification, customization prompt, license and HTML. It does not need an API key or call any external service.

Keep the **whole Website-Designer-AI-Employee folder** together after unzipping. The server resolves the library relative to its own location, so it works regardless of the host's working directory. Do not move only this `mcp-server` folder.

The main employee reads files directly and does not need this connection. This bridge serves the five standalone library scenes only. Read `starters/cinematic-workbench/` directly for the multi-file Three.js starter.

## Install and check

Install Node.js 22 or newer; Node 24 LTS is a suitable choice. Open a terminal in this folder and run:

```sh
npm ci --ignore-scripts
npm test
node setup-info.mjs
```

Dependency installation needs internet once. After installation, serving the bundled library works offline. `npm test` launches a real MCP client, initializes the server, lists and calls its tools, and checks the available layer files. It does not change your AI app's settings.

The final command prints registration commands containing **the actual absolute Node and server paths on your machine**. Copy the command for your app. It only prints setup information; it does not register anything itself.

## Connect Claude Code

Use the command printed by `node setup-info.mjs`. It has this form; replace both placeholders with your actual absolute paths if entering it manually:

```sh
claude mcp add --transport stdio --scope user scene-library -- '/absolute/path/to/node' '/absolute/path/Website-Designer-AI-Employee/mcp-server/server.mjs'
claude mcp get scene-library
```

User scope makes the library available across your Claude Code projects. Open a new session if it was already running; use `/mcp` to inspect the connection. The command registers a local process, not a web service. See the [official Claude Code MCP instructions](https://code.claude.com/docs/en/mcp).

## Connect Codex

Use the Codex command printed by `node setup-info.mjs`, or substitute your absolute paths:

```sh
codex mcp add scene-library -- '/absolute/path/to/node' '/absolute/path/Website-Designer-AI-Employee/mcp-server/server.mjs'
codex mcp list
```

Start a new chat/session after registering. A listed configuration is not the same as a successful tool call: ask Codex to call `list_categories` from `scene-library`. The CLI registration syntax is documented in the [official OpenAI MCP guide](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

For another host, use the generic `mcpServers` JSON that the setup helper prints. Some hosts use a different wrapper; follow that host's MCP setup. A normal browser chat without local MCP support cannot launch this server.

## Ask your employee to use it

> Use the SCENE library MCP. First list categories and search for a layer that fits my brand. Explain the choice briefly, retrieve that layer, and adapt its original HTML into my site. Personalize the composition, content, colors and motion. Preserve accessibility and reduced-motion behavior. Build and preview the result using the tools available in this environment.

The library supplies source material. The AI coding host performs the website build. No template automatically knows your brand, and this server does not publish sites.

## Tools

| Tool | Inputs | Result |
| --- | --- | --- |
| `list_categories` | None | Categories, counts and tags |
| `search_layers` | Optional `query`, `category`, `tags`, `limit` | Metadata summaries only, default 8 and maximum 20 |
| `get_layer` | Exact `id` from search | Design spec, prompt, metadata and one complete HTML source |

Search is deterministic text matching: all query words must occur in the name, id, category, technique, tags or description. Category and tags use case-insensitive exact matching; all requested tags must match. Search does not call an embedding service. An empty search browses the catalog. `hasMore` indicates that you should narrow the search.

Example tool arguments:

```json
{"query":"kinetic","limit":3}
```

```json
{"id":"kinetic-type"}
```

Use actual ids returned by search; the sample id is illustrative.

## Extend your library

Add a standalone HTML file inside `../library/layers/`, then add its metadata to `../library/catalog.json`:

```json
{
  "version": "1.0",
  "layers": [
    {
      "id": "your-new-layer",
      "name": "Your New Layer",
      "category": "Typography",
      "technique": "CSS 3D",
      "tags": ["type", "editorial"],
      "description": "What this layer looks like and when to choose it.",
      "prompt": "How the employee should adapt this layer to the member's brand.",
      "file": "layers/your-new-layer.html",
      "license": "The applicable permission and attribution terms."
    }
  ]
}
```

Add to the existing `layers` array; do not replace the supplied catalog. `preview` is an optional string for a local preview reference or public URL. The server returns preview metadata without fetching it. Restart/reconnect the MCP server after catalog edits because it loads metadata at startup. Each source file must be HTML and no larger than 256 KiB. The catalog is limited to 1 MiB and 500 entries. Ids must be unique lowercase words joined with hyphens. Only include assets you have permission to distribute.

## Behavior and maintenance

- All three tools are read-only, use no network calls and do not read credentials or home-directory configuration. They never execute layer HTML.
- Clients supply an id, never a filesystem path. The server validates relative paths and resolves symlinks before reading; files that resolve outside the library are rejected.
- Invalid input and missing layers return tool errors. A missing or malformed catalog prevents startup with a message on stderr. Stdout is reserved for MCP JSON-RPC.
- If manually running `node server.mjs` appears to do nothing, it is waiting for an MCP client on stdin. Use `npm test` for a direct check.
- If your host cannot find Node, rerun `node setup-info.mjs` from the terminal where Node works and use its absolute executable path. Rerun setup after moving the package or replacing that Node installation.
- The dependency lock pins `@modelcontextprotocol/sdk` 1.32.1 and Zod 4.6.5. This is the official SDK's v1 maintenance line. The current v2 line uses different package names; review and test a migration rather than mixing v2 documentation with these imports.

Official SDK references: [v1 overview](https://ts.sdk.modelcontextprotocol.io/), [server and tools](https://ts.sdk.modelcontextprotocol.io/server). Installation documentation checked October 9, 2026. The package includes a lockfile; dependencies are installed with `npm ci` and are not bundled in the distributable.
