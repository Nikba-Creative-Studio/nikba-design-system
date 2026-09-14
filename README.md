# Nikba Design System

Neutral interface foundations, Onest typography, and selective glassmorphism for Nikba websites and digital products.

> Status: `0.1.0-alpha.1` — active development. Public APIs may change before `1.0.0`.

## Principles

- Content remains more important than visual effects.
- Onest is the primary typeface.
- Glass surfaces are reserved for navigation, controls, and focused feedback.
- Components use native semantics and progressive enhancement.
- The core package remains framework-agnostic.

See [DESIGN.md](./DESIGN.md) for visual rules, [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for delivery milestones, and [AUDIT.md](./AUDIT.md) for the baseline assessment.

Runtime and integration targets are defined in [SUPPORT.md](./SUPPORT.md).

## Development

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

The catalog runs at `http://localhost:5173` by default and reloads when source files change.

## Build and verification

```bash
npm run build
npm run preview
npm run verify
```

`build` creates the library in `dist` and the catalog in `dist-playground`. `verify` also checks the public JavaScript API and the package contents.

## Usage

```js
import '@nikba/design-system/css';
import { setGlassLevel, setTheme } from '@nikba/design-system';

setTheme('frost');
setGlassLevel('soft');
```

Wrap the controlled interface in `.nds-scope` so foundations such as typography, box sizing, and reduced motion apply consistently.

```html
<main class="nds-scope">
  <button class="nds-button" type="button">Start a project</button>
  <button class="nds-button nds-button--secondary" type="button">
    View projects
  </button>
</main>
```

The CSS bundle declares the Onest-based font stack but does not download a font. Load Onest in the consuming application from a provider or a self-hosted asset. See [Foundation Reference](./docs/FOUNDATIONS.md) for both approaches and the complete public token catalog.

Use native `disabled` whenever the HTML element supports it. A link styled as a button requires `aria-disabled="true"`, `tabindex="-1"`, and application logic that prevents programmatic activation.

## Current public surface

- Themes: Frost, Mist, Graphite
- Glass levels: Off, Soft, Clear
- CSS: tokens, typography, layout, Button, Link, Badge, Chip, Field, Input, Textarea, Native Select, Checkbox, Radio, Switch, Card, Tag, Glass surface, and scoped foundations
- JavaScript: theme and glass constants and setters

Component contracts are published under [`docs/components`](./docs/components/), including [Button and Icon Button](./docs/components/button.md), [Link](./docs/components/link.md), [Badge and Chip](./docs/components/badge-chip.md), [Field](./docs/components/field.md), [Input and Textarea](./docs/components/input-textarea.md), [Native Select](./docs/components/select.md), [Checkbox and Radio](./docs/components/checkbox-radio.md), [Switch](./docs/components/switch.md), and [Card](./docs/components/card.md).

## License

[MIT](./LICENSE)
