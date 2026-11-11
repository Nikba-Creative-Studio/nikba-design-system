# AI Integration with MCP

Nikba Design System includes a read-only [Model Context Protocol](https://modelcontextprotocol.io/) server. It gives compatible AI hosts access to web contracts, native SwiftUI/Compose APIs, installation steps, source files, complete examples, guides and tokens shipped with the package.

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
| `nikba://guides/native` | Shared native integration and component contracts |
| `nikba://guides/ios` | SwiftPM installation, bundled fonts, first-screen and validation workflow |
| `nikba://native/{platform}/components/{slug}` | Native Markdown contract for ios/android |
| `nikba://native/{platform}/source/{kind}` | Exact native tokens, components, example or manifest; iOS also exposes fonts and package sources |

Legacy resource URIs continue to describe web contracts. Native resources are separate and always include a platform in the URI.

## Tools

| Tool | Purpose |
| --- | --- |
| `get_capabilities` | Discover actual platform availability, component lists, minimum targets and native pilot status; platform defaults to all |
| `get_installation` | Get platform installation steps, first-screen URI, validation guidance and remote/local SwiftPM package metadata |
| `get_native_source` | Read exact native source by platform and allowlisted kind, with snapshot metadata |
| `list_components` | List components for the selected platform |
| `get_component` | Read a web Markdown contract or a native structured contract with real API declarations and a compiled example excerpt |
| `list_documents` | List documentation by category and platform |
| `get_document` | Read a document; native component requests return the same structured contract as get_component |
| `get_tokens` | Read CSS layers for web, or the unified generated Swift/Kotlin source for native |
| `search_design_system` | Search documentation scoped to the selected platform |

The original six tools accept an optional `platform` (`web`, `ios`, `android`) that defaults to `web`; existing calls retain their behavior. `get_installation` also defaults to web. `get_native_source` requires ios/android and a `kind`: tokens, components, example, manifest, fonts or package. Fonts/package are iOS-only; unsupported combinations return `available: false`.

Native `get_tokens` calls use `category: "all"` (the default). CSS layer categories are web-only and return an explicit error for native requests. Native component responses include `available`, `nativeVersion`, `status`, `releaseStatus`, `sourceFingerprint`, API declarations, example context URI and source URI. Unknown or unsupported native components return `available: false` and a native-control fallback. `badge-chip` aliases the native Badge; it does not expose a native Chip.

The native distribution version is `1.1.0`, published with pilot APIs. The content fingerprint matches sources and font assets across calls; it is not a Git revision. The `v1.1.0` tag supports SwiftPM; the older web-only `v1.0.0` tag does not. `get_installation` returns the repository URL and exact version plus an optional local package path. Local server paths only apply on the server’s machine.

All tools are read-only, deterministic for a given package version, and limited to files shipped with Nikba Design System. The server does not modify projects, call external services, or collect prompts.

## Prompt

`build_with_nikba` accepts `task` and optional `platform` (default web). Native prompts direct the host to discover capabilities, install the matching snapshot, read the complete first-screen example, inspect platform-specific contracts and use native fallbacks for missing components. The web prompt retains its previous behavior.

## First iOS application

Use this sequence through the MCP client:

```json
{"name":"get_capabilities","arguments":{"platform":"ios"}}
{"name":"get_installation","arguments":{"platform":"ios"}}
{"name":"get_component","arguments":{"slug":"button","platform":"ios"}}
{"name":"get_tokens","arguments":{"platform":"ios"}}
{"name":"get_native_source","arguments":{"platform":"ios","kind":"example"}}
```

Add the returned repository URL in Xcode with Exact Version 1.1.0 (or use its local packagePath), link NikbaDesignSystem, and add the returned complete first-screen source to your app. The package registers bundled Onest automatically through NDSTypography.font. Read [Build an iOS app](./IOS.md) for the complete workflow and version boundaries.

## Verification

```bash
npm run test:mcp
npm run test:native:ios -- --packed
npm run test:native:android
```

The MCP test performs real stdio handshakes, preserves legacy web calls, checks both native platforms, validates unsupported fallbacks and source restrictions, reads resources and verifies snapshot consistency. The packed consumer runs these tests against the installed archive as well. Server metadata reads the web version from package.json and native version from native/manifest.json.

The macOS consumer test compiles the complete example obtained from the running MCP server in a separate app linked to the local Swift package, then tests bundled Onest registration without app font assets. `--packed` runs against a freshly installed npm archive. The Android consumer compiles the exact Kotlin sources and example returned by MCP in a standalone Compose module (Gradle 8.11.1, JDK 17+, Android SDK 36). Use `--gradle-command /absolute/path/to/gradlew` if Gradle is available via an existing compatible wrapper. CI checks both native consumers.
