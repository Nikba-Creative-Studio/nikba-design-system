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

The [plain HTML and JavaScript consumer](./examples/plain/) imports the packed public API through a framework-free Vite entry. `npm run test:consumer` packs the current library, installs the archive into a temporary consumer, and proves its production build.

The [Blade integration example](./examples/blade/) provides thin Button and Dialog wrappers, public CSS and JavaScript entries, and an account view that preserves native semantics and Laravel attribute forwarding.

For server-rendered DOM updates, `observeComponents()` initializes added component roots and cleans removed ones. See the [Livewire integration guide](./docs/integrations/livewire.md) for lifecycle ownership, navigation refresh, stable keys, and validation scenarios.

The [Filament integration boundary](./docs/integrations/filament.md) supports public Panel theming and scoped Nikba compositions while retaining Filament ownership of forms, tables, actions, notifications, and modals. A reference provider, theme addition, and custom Blade region live in the [Filament example](./examples/filament/).

Pull requests and pushes to `main` run the complete build, behavior contracts, package validation, and clean packed-consumer build on Node.js 20 and 22.

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

## AI and MCP

The package includes a read-only Model Context Protocol server that exposes component contracts and design tokens to compatible AI hosts.

```bash
npm run mcp
```

The server publishes discoverable resources, four query tools, and a `build_with_nikba` prompt. See [AI Integration with MCP](./docs/MCP.md) for host configuration and the complete interface, or explore the MCP section in the local catalog.

## Current public surface

- Themes: Frost, Mist, Graphite
- Glass levels: Off, Soft, Clear
- CSS: tokens, typography, layout, Button, Link, Badge, Chip, Field, Input, Textarea, Native Select, Checkbox, Radio, Switch, Card, Divider, Avatar, Spinner, Skeleton, Alert, Disclosure, Accordion, Tabs, Dialog, Popover, Dropdown Menu, Tooltip, Toast, Header, Navigation, Breadcrumb, Pagination, Table, Product States, Search and Filter, Form Validation, Settings and Account, Destructive Confirmation, Tag, Glass surface, and scoped foundations
- JavaScript: theme and glass constants and setters, interactive-component initializers with cleanup, dynamic DOM lifecycle observation, Form validation, and the Toast manager

Component contracts are published under [`docs/components`](./docs/components/), including [Button and Icon Button](./docs/components/button.md), [Link](./docs/components/link.md), [Badge and Chip](./docs/components/badge-chip.md), [Field](./docs/components/field.md), [Input and Textarea](./docs/components/input-textarea.md), [Native Select](./docs/components/select.md), [Checkbox and Radio](./docs/components/checkbox-radio.md), [Switch](./docs/components/switch.md), [Card](./docs/components/card.md), [Divider](./docs/components/divider.md), [Avatar](./docs/components/avatar.md), [Spinner](./docs/components/spinner.md), [Skeleton](./docs/components/skeleton.md), [Alert](./docs/components/alert.md), [Disclosure and Accordion](./docs/components/disclosure-accordion.md), [Tabs](./docs/components/tabs.md), [Dialog](./docs/components/dialog.md), [Popover and Dropdown Menu](./docs/components/popover-menu.md), [Tooltip](./docs/components/tooltip.md), [Toast](./docs/components/toast.md), [Header and Responsive Navigation](./docs/components/header-navigation.md), [Breadcrumb and Pagination](./docs/components/breadcrumb-pagination.md), and [Table](./docs/components/table.md).

Composition guidance is published under [`docs/patterns`](./docs/patterns/), including [Empty, Loading, Error, and Success States](./docs/patterns/product-states.md), [Search and Filter](./docs/patterns/search-filter.md), [Form Validation and Submission](./docs/patterns/form-validation-submission.md), [Settings and Account](./docs/patterns/settings-account.md), and [Destructive Confirmation](./docs/patterns/destructive-confirmation.md).

## License

[MIT](./LICENSE)
