# AI Integration with MCP

Nikba Design System includes a read-only [Model Context Protocol](https://modelcontextprotocol.io/) server. It gives compatible AI hosts direct access to the same component contracts, patterns, integration guides, policies, and CSS tokens published with the package.

## Start the server

From this repository:

```bash
npm run mcp
```

When the package is installed, the `nikba-design-system-mcp` executable is available in `node_modules/.bin`.

## Configure an MCP host

Use the package executable when it is installed in the host project:

```json
{
  "mcpServers": {
    "nikba-design-system": {
      "command": "nikba-design-system-mcp"
    }
  }
}
```

For local repository development, point the host to the server file with an absolute path:

```json
{
  "mcpServers": {
    "nikba-design-system": {
      "command": "node",
      "args": ["/path/to/nikba-design-system/mcp/server.js"]
    }
  }
}
```

Restart or reconnect the MCP host after changing its configuration.

## Resources

| URI | Content |
| --- | --- |
| `nikba://system/overview` | Package principles, setup, usage, and public surface |
| `nikba://foundations/tokens` | Primitive, semantic, and theme token CSS |
| `nikba://components/{slug}` | Complete contract for one documented component |
| `nikba://patterns/{slug}` | Product composition and interaction guidance |
| `nikba://integrations/{slug}` | Framework lifecycle and ownership boundaries |
| `nikba://guides/{slug}` | Foundations, MCP, support, release, and migration guidance |

## Tools

| Tool | Purpose |
| --- | --- |
| `list_components` | List component names, descriptions, slugs, and resource URIs |
| `get_component` | Read one component contract by slug |
| `list_documents` | List all documents or filter by category |
| `get_document` | Read one component, pattern, integration, or guide document |
| `get_tokens` | Read all tokens or one token layer |
| `search_design_system` | Search every published documentation category by phrase |

All tools are read-only, deterministic for a given package version, and limited to files shipped with Nikba Design System. The server does not modify projects, call external services, or collect prompts.

## Prompt

`build_with_nikba` prepares an implementation request that directs the AI host to inspect the overview, relevant component contracts, and published tokens before generating an interface.

## Verification

```bash
npm run test:mcp
```

The test launches the packaged stdio server, completes a real MCP client handshake, discovers every resource category and tool, retrieves component and pattern contracts, searches integration guidance, and reads token resources. Server metadata reads the version from the packaged `package.json`.
