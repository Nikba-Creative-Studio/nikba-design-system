# Contributing

Nikba Design System is in Alpha. Open an issue before proposing a new component or a breaking public API change.

## Language

Use English for documentation, source comments, TODO notes, public API names, catalog content, tests, commits, pull requests, release notes, and migration guides.

## Public API rules

- Prefix public classes and custom properties with `nds-`.
- Keep reusable visual decisions in tokens.
- Prefer native HTML semantics before adding ARIA or JavaScript.
- Define applicable hover, active, focus-visible, disabled, loading, invalid, and readonly states.
- Preserve `prefers-reduced-motion`, forced-colors, keyboard, and touch behavior.
- Keep the core framework-agnostic and dependency-free unless an approved contract requires otherwise.
- Do not implement glass effects with SVG displacement, canvas, or WebGL.

## Component changes

A component proposal must describe its purpose, anatomy, API, variants, states, responsive behavior, accessibility behavior, tokens, examples, and acceptance criteria. Use the template in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

The playground must demonstrate the public implementation from `src`. Do not duplicate public component styles in playground files.

## Before submitting a change

```bash
npm run verify
```

Update documentation and `CHANGELOG.md` whenever a public behavior changes. Breaking changes require migration guidance.
