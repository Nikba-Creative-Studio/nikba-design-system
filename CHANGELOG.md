# Changelog

All notable changes to Nikba Design System will be documented here.

The project follows [Semantic Versioning](https://semver.org/). Before `1.0.0`, minor releases may change public APIs and will include migration notes.

## Unreleased

### Added

- A single-source component catalog that consumes the public library.
- Separate library and catalog build commands.
- Baseline API and package verification.
- Semantic feedback color tokens.
- An English implementation plan and repository audit.
- Primitive token scales for typography, spacing, controls, geometry, motion, opacity, breakpoints, and layering.
- Public typography and layout foundations.
- Automated CSS contract and theme contrast checks.
- Foundation documentation with Onest provider and self-hosting examples.
- Button and Icon Button variants, sizes, icon layout, loading, toggle, block, and destructive states.
- A complete Button component contract and catalog matrix.
- Link variants for inline, subtle, standalone, inverse, current, and disabled navigation.
- A complete Link component contract and catalog matrix.
- A multi-page catalog with dedicated Overview, Foundations, component index, Button, and Link pages.
- Badge semantic tones, size options, and optional status indicator.
- Selectable Chip sizes, quiet appearance, counts, selected state, and disabled state.
- A complete Badge and Chip contract with a dedicated catalog page.
- Field, Label, Helper Text, and Error Message primitives with stacked and responsive inline layouts.
- Required, optional, invalid, disabled, and readonly Field examples and documentation.
- Input sizes, native states, prefixes, suffixes, and aligned icon adornments.
- Textarea sizes, vertical resize behavior, and a live character-count example.
- A complete Input and Textarea contract with a dedicated catalog page.
- Native Select sizes, placeholder, option groups, invalid state, and disabled behavior.
- A complete Native Select contract with a dedicated catalog page.
- Checkbox and Radio groups, descriptions, Choice Cards, disabled and invalid states.
- Functional parent Checkbox synchronization with checked and indeterminate states.
- A complete Checkbox and Radio contract with a dedicated catalog page.
- Switch sizes, settings cards, disabled behavior, and asynchronous busy state.
- A complete Switch contract with a dedicated catalog page.
- Card density, depth, composition, Media, horizontal, and interactive variants.
- A complete Card contract with a dedicated catalog page.
- Divider emphasis, spacing, inset, labeled, and vertical variants.
- A complete Divider contract with a dedicated catalog page.
- Avatar images, initials, fallback, sizes, presence, groups, and interactive wrapper.
- A complete Avatar contract with a dedicated catalog page.
- Spinner sizes, tones, accessible Status labels, and busy-region patterns.
- A complete Spinner contract with a dedicated catalog page.
- Skeleton text, heading, avatar, square, media, button, static, and composition variants.
- A complete Skeleton contract with a dedicated catalog page.
- Alert neutral, informational, success, warning, danger, compact, action, and dismissible variants.
- A complete Alert contract with a dedicated catalog page and functional dismissal example.
- Native Disclosure and Accordion styles with contained, compact, separated, multiple-open, and nested compositions.
- An idempotent single-open Accordion initializer with cleanup and a bubbling change event.
- A complete Disclosure and Accordion contract with a dedicated catalog page and behavior test.
- Tabs styles for standard, contained, vertical, disabled, and overflow compositions.
- An idempotent Tabs initializer with automatic and manual activation, roving focus, cleanup, and a bubbling change event.
- A complete Tabs contract with a dedicated catalog page and behavior test.
- Native Dialog styles for default, small, large, destructive confirmation, and scrolling compositions.
- An idempotent Dialog initializer with initial focus, explicit and optional backdrop dismissal, focus restoration, lifecycle events, and cleanup.
- A complete Dialog contract with a dedicated catalog page and behavior test.
- Popover and Dropdown Menu styles for contextual, action, selection, aligned, disabled, and destructive compositions.
- An idempotent Popover initializer with viewport-aware placement, native light dismissal, roving menu focus, typeahead, selection state, events, and cleanup.
- A complete Popover and Dropdown Menu contract with a dedicated catalog page and behavior test.
- Tooltip styles with adaptive viewport placement, reduced motion, and forced-color support.
- An idempotent Tooltip initializer with delayed pointer and focus activation, Escape dismissal, accessible-description preservation, events, and cleanup.
- A complete Tooltip contract with a dedicated catalog page and behavior test.
- Toast styles for neutral, informational, success, warning, danger, action, and responsive stack compositions.
- An idempotent Toast manager with safe text rendering, bounded visible queues, timed and persistent messages, interaction pause, lifecycle events, and cleanup.
- A complete Toast contract with a dedicated catalog page and behavior test.
- Header and responsive Navigation styles with solid, sticky, glass, current-link, action, and compact compositions.
- An idempotent Navigation initializer with expanded state, Escape and outside dismissal, breakpoint reset, events, cleanup, and a visible no-JavaScript fallback.
- A complete Header and Responsive Navigation contract with a dedicated catalog page and behavior test.
- Breadcrumb and Pagination styles for hierarchy, long paths, numeric and compact navigation, current state, disabled boundaries, and responsive reduction.
- A complete Breadcrumb and Pagination contract with a dedicated catalog page and no-JavaScript navigation examples.
- Table styles for standard, compact, comfortable, sticky, numeric, descriptive, selected, overflow, and empty states.
- An idempotent Table initializer with text and numeric sorting, semantic sort state, Select all synchronization, selection events, and cleanup.
- A complete Table contract with a dedicated catalog page and behavior test.
- Product State styles for centered, compact, inline, loading, error, success, action, and metadata compositions.
- Empty, no-result, predictable and indeterminate loading, recoverable error, and success patterns with a dedicated catalog page and implementation guidance.
- Search and Filter styles for query, criteria, actions, result summary, active filters, results, and responsive form layouts.
- A complete Search and Filter pattern with native GET behavior, functional catalog filtering, removable active criteria, live result count, reset, and no-results recovery.
- Form layout and error-summary styles for grouped fields, responsive grids, actions, and accessible validation feedback.
- An idempotent Form initializer with native constraint evaluation, summary focus, inline error synchronization, lifecycle events, reset behavior, and cleanup.
- A complete Form Validation and Submission pattern with a functional pending and success demonstration, documentation, and behavior test.
- Settings and Account layout styles for category navigation, profile identity, preference sections, sessions, account actions, and compact screens.
- A complete Settings and Account pattern composed from public Avatar, Form, Switch, Badge, Button, and Dialog contracts.
- Destructive Confirmation styles for target identity, consequence lists, typed verification, and compact layouts.
- A complete Destructive Confirmation pattern with risk levels, safe initial focus, protected pending state, success announcement, documentation, and a functional catalog demonstration.
- A framework-free HTML and JavaScript consumer that imports only published CSS and JavaScript package exports.
- A clean-room consumer test that packs the library, installs the archive into a temporary application, and verifies its production build.
- Laravel Blade examples for package entry points, finite Button props, accessible Dialog relationships, named slots, and attribute forwarding.
- A static Blade integration contract test and PHP syntax checks for the example templates.
- A public `observeComponents()` lifecycle manager for idempotent initialization and cleanup across dynamically added, removed, and replaced DOM roots.
- Livewire 3 integration guidance covering morphs, navigation, state ownership, stable keys, Dialog completion, and native fallback.
- A simulated DOM-morph lifecycle test that protects initialization, replacement cleanup, refresh idempotence, and observer teardown.
- Filament 5.x integration guidance defining supported Panel theming, scoped Nikba regions, Livewire lifecycle use, unsupported markup replacement, and upgrade checks.
- A Filament reference provider, theme addition, scoped custom view, and automated boundary contract.
- GitHub Actions verification on Node.js 20 and 22 for locked installation, library and catalog builds, API and behavior contracts, package contents, and packed-consumer builds.
- An alpha browser-support policy, progressive feature boundaries, and explicit runtime performance expectations.
- Enforced gzip budgets of 20 KiB for CSS and 12 KiB for JavaScript, plus a 140 KiB combined raw-output guard.
- Catalog accessibility structure checks for language, landmarks, heading hierarchy, duplicate IDs, image alternatives, and Dialog names.
- A dependency-free headless Chrome snapshot smoke test across representative pages at desktop and compact viewports, with CI artifact upload.
- Release, deprecation, compatibility, support, and migration policies with an explicit release procedure and entry template.
- Pull-request and bug-report templates covering public contracts, validation, environment, and accessibility impact.
- Approved desktop and compact visual baselines for Overview, Form, and Destructive Confirmation with dependency-free PNG decoding and sampled pixel-difference thresholds.
- A dated accessibility and public API audit covering WCAG structure, keyboard and focus behavior, touch targets, MCP discovery, JavaScript documentation, browser coverage, and assistive-technology verification gaps.
- Coarse-pointer target overrides that expand compact controls, links, choices, navigation items, and close actions to at least 44px without changing desktop density.
- MCP resources and retrieval tools for product patterns, integration guides, foundations, support, releases, and migrations, with search across the full documentation catalog.
- MCP server metadata derived from the packaged version instead of a duplicated literal.
- A central JavaScript API reference for all 14 exports, including selectors, events, lifecycle ownership, return values, and errors, protected by API and MCP tests.
- A read-only MCP server that exposes design-system documentation and tokens to compatible AI hosts.
- MCP resources, component and token query tools, an implementation prompt, host setup documentation, and an end-to-end protocol test.
- A dedicated MCP catalog page and primary navigation entry for the AI integration.

### Changed

- Overview Footer now credits Nikba Creative Studio and links to nikba.com.
- Avatar examples now use the supplied neutral profile illustration.
- Overview now uses a structured system-status panel and a denser editorial card grid.
- Component catalog cards now share the Overview's editorial surfaces, directional controls, and compact responsive sizing.
- Overview metrics now use aligned number and label columns on mobile.
- Header and appearance controls now share the responsive Container gutter at narrow viewport widths.
- Accordion hover surfaces now clip cleanly inside rounded item corners.
- The catalog navigation now uses the official Nikba SVG logo from the source package.
- English is now the project language for documentation, source comments, public APIs, tests, and release notes.
- Glass levels now control the rendered surface and filter behavior.
- Foundation scoping now provides predictable box sizing and form font inheritance.
- Components now consume shared foundation and semantic tokens.
- Theme mappings are separated from primitive and semantic token definitions.
- Frost and Mist tertiary text colors now meet the 4.5:1 text contrast contract on their solid surfaces.
- The CSS package no longer downloads Onest automatically; consumers control font delivery.
- Catalog appearance preferences now persist while navigating between pages.
- `.nds-field` now represents the compositional Field wrapper; the input control style has moved to `.nds-input`.

### Fixed

- Catalog Header now uses the shared 1280px Container and responsive page gutters.
- Icon slots now center SVG artwork consistently with adjacent text in Link, Button, Chip, and Field messages.
- Checkbox selection now uses a centered rounded-square indicator; indeterminate remains a distinct short bar.
- Invalid and readonly Field states.
- Native disabled styling for Tag controls.
- Explicit light color schemes for Frost and Mist.
