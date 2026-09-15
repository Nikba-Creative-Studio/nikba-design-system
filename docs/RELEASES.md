# Release, Deprecation, and Support Policy

## Versioning

Nikba Design System follows Semantic Versioning for published CSS classes, custom properties, JavaScript exports and events, documented markup requirements, package exports, and MCP interfaces.

Before `1.0.0`, a minor release may contain a breaking change. Every such change must be named in the changelog and include a migration entry. After `1.0.0`:

- Patch releases fix defects without changing documented behavior.
- Minor releases add compatible capabilities and may deprecate public API.
- Major releases may remove deprecated API or change documented contracts.

Catalog-only styling and copy are not public API. Accessibility regressions, lost keyboard behavior, and changed event semantics are treated as public defects even when a selector name does not change.

## Deprecation

Deprecate an API only when a supported replacement exists. Mark it in its component document and changelog, add a migration example, and preserve it for at least one minor release after `1.0.0`. CSS deprecations keep a compatibility alias when practical. JavaScript deprecations may warn once in development-facing documentation; the runtime must not repeatedly log during ordinary use.

Removal requires a major release after `1.0.0`. Security, privacy, or severe accessibility defects may require faster removal and must explain the exception and safe replacement.

## Release procedure

1. Start from a clean `main` branch and install with `npm ci`.
2. Run `npm run verify` and `npm run test:browser`.
3. Complete keyboard, theme, responsive, and assistive-technology checks required by the changed contracts.
4. Move relevant Unreleased entries under a version and ISO date in `CHANGELOG.md`.
5. Update `docs/MIGRATIONS.md` for every breaking change and deprecation.
6. Update the package version without publishing, rebuild, and inspect `npm pack --dry-run`.
7. Review the packed consumer and MCP contract from the final artifact.
8. Create the signed release tag from the verified commit.
9. Publish the public package with provenance from protected CI.
10. Verify package installation, catalog deployment, release notes, and MCP startup from the published version.

## Support

Supported versions and browsers are listed in `docs/SUPPORT.md`. Report reproducible defects through the repository issue form. Include the package version, browser and operating system, minimal markup, expected and actual behavior, and accessibility impact where applicable.

The current alpha supports the latest published alpha only. After `1.0.0`, the current major receives fixes; the previous major receives critical security and severe accessibility fixes for six months after the next major release. Security-sensitive reports should use the repository's private vulnerability-reporting channel when enabled rather than a public issue.
