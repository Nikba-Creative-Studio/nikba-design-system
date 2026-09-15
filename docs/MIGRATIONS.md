# Migration Guide

No published migration is required for `0.1.0-alpha.2`. This document becomes the chronological source for breaking changes and deprecations.

## Entry format

Each migration entry must include:

1. The first version containing the change.
2. The affected CSS, JavaScript, markup, event, package, or MCP contract.
3. The reason and user-visible effect.
4. A minimal before-and-after example.
5. Automated or manual verification steps.
6. The deprecation window and removal version when applicable.

````md
## 1.2.0 — Replace an old API

Reason and impact.

Before:
```html
<button class="old-class">Save</button>
```

After:
```html
<button class="nds-button">Save</button>
```

Verify focus, disabled state, and the submitted action. The old class remains deprecated through 1.x and is removed in 2.0.0.
````
