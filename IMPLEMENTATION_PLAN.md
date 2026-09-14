# Nikba Design System Implementation Plan

Status: Active planning document  
Starting version: `0.1.0-alpha.1`  
Target: a stable, framework-agnostic `1.0.0` design system

## 1. Product goal

Nikba Design System will provide the visual foundations, accessible components, interaction patterns, documentation, and integration guidance required to build consistent Nikba websites and product interfaces.

The core remains framework-agnostic. CSS is the primary delivery layer. Small dependency-free JavaScript modules support components that require behavior. Framework adapters may be added later without changing the core contract.

AI integrations consume the published system through a read-only MCP server. The server exposes the same versioned component contracts and tokens that ship with the package, so generated interfaces can follow the public API without maintaining a separate knowledge source.

## 2. Working principles

1. **One source of truth.** Tokens and component styles live in `src`. The catalog imports and demonstrates that exact implementation.
2. **Accessibility is part of the contract.** Semantics, keyboard behavior, focus, reduced motion, contrast, and assistive-technology notes are defined before completion.
3. **Tokens express decisions.** Repeated values become named tokens. Components consume semantic tokens rather than theme-specific values.
4. **Components stay composable.** The system supplies focused primitives and patterns without imposing application structure.
5. **Documentation ships with the component.** An undocumented component is incomplete.
6. **Breaking changes include migration guidance.** CSS classes, custom properties, JavaScript exports, and documented markup are versioned APIs.
7. **Performance is a feature.** Effects remain selective, progressive, and functional without blur or JavaScript.

## 3. Language standard

English is the only language used for:

- Documentation and examples
- Source comments and TODO notes
- Commit and pull-request descriptions
- Public API names, CSS classes, custom properties, states, and variants
- Test descriptions, release notes, migration guides, and accessibility notes
- Catalog navigation and component descriptions

Localized product copy may appear only in clearly labeled internationalization examples. Existing Romanian documentation and catalog copy will be migrated during Phase 0.

## 4. Architecture

The system follows five layers:

```text
Design decisions
  -> primitive and semantic tokens
  -> foundations and layout
  -> components
  -> interaction patterns
  -> framework and product integrations
```

Target source structure:

```text
src/
  tokens/
    primitive.css
    semantic.css
    themes.css
  foundations/
    reset.css
    typography.css
    layout.css
    motion.css
  components/
  patterns/
  behaviors/
  index.css
  index.js

playground/
  component catalog consuming src directly

docs/
  principles, component contracts, accessibility, integrations, releases
```

The structure is a target. Refactors will happen as small, reviewable changes.

## 5. Definition of done

A component is complete only when all applicable items are satisfied:

- Purpose, use cases, and exclusions are documented.
- Public markup, classes, custom properties, and JavaScript behavior are explicit.
- Variants, sizes, states, content rules, and responsive behavior are covered.
- Relevant default, hover, active, focus-visible, disabled, loading, invalid, and readonly states are implemented.
- Native HTML semantics are preferred; ARIA is used only when required.
- Keyboard behavior and focus management follow the relevant accessibility pattern.
- Touch targets, contrast, zoom, forced colors, reduced motion, and no-JavaScript behavior are checked where relevant.
- Every theme and supported glass level is demonstrated in the catalog.
- Catalog examples use the public implementation and can be copied into consumer projects.
- Automated checks cover behavior likely to regress.
- The package build and a representative consumer build pass.
- Public changes are reflected in release notes and migration guidance.

## 6. Delivery plan

### Phase 0 — establish the source of truth

Goal: remove contradictions and create a dependable development loop.

- [x] Convert README, DESIGN.md, CONTRIBUTING.md, playground documentation, catalog copy, and metadata descriptions to English.
- [x] Define documentation ownership: DESIGN.md for visual principles, component docs for contracts, and this file for delivery status.
- [x] Make the playground import `src/index.js` and public `nds-` classes.
- [x] Remove duplicated public components and tokens from playground styles.
- [x] Add separate library and catalog build/preview commands.
- [x] Define supported browsers, CSS features, module formats, and package exports.
- [x] Add baseline verification for build, API validation, and package contents.
- [x] Add a changelog and initial versioning policy.

Exit gate: changing a public token or component in `src` changes the catalog immediately; all documentation is English; build, preview, and package checks are reproducible.

### Phase 1 — foundations and tokens

Goal: establish the stable visual and technical vocabulary used by every component.

- [x] Separate primitive tokens from semantic tokens and theme mappings.
- [x] Complete color roles: canvas, surface, text, border, action, focus, success, warning, danger, and info.
- [x] Add spacing, typography, control-size, radius, border, elevation, opacity, motion, breakpoint, and z-index scales.
- [x] Define font loading and an Onest self-hosting path.
- [x] Define reset and scoping behavior, including `box-sizing` and form inheritance.
- [x] Correct Glass Off / Soft / Clear behavior and fallback rules.
- [x] Define Container, Stack, Cluster, Grid, and Visually Hidden utilities.
- [x] Validate contrast across Frost, Mist, and Graphite.
- [x] Document theme nesting, color scheme, reduced motion, forced colors, and progressive enhancement.

Exit gate: components contain no unexplained repeated visual values; foundation examples pass visual and accessibility checks across all themes.

### Phase 2 — core controls and content primitives

Goal: cover reusable elements required by ordinary pages and forms.

Delivery order:

1. [x] Button and Icon Button
2. [x] Link
3. [x] Badge and selectable Chip
4. [x] Field wrapper, Label, Helper Text, and Error Message
5. [x] Input and Textarea
6. [x] Native Select
7. [x] Checkbox and Radio
8. [x] Switch
9. [x] Content primitives
   - [x] Card
   - [x] Divider
   - [x] Avatar
   - [x] Spinner
   - [x] Skeleton
   - [x] Alert

For each component:

- [ ] Approve its contract before implementation.
- [ ] Implement sizes, variants, states, and theme coverage.
- [ ] Add accessible examples and copyable markup to the catalog.
- [ ] Verify disabled behavior, focus visibility, validation, and high-contrast behavior as applicable.
- [ ] Add targeted behavior or regression tests where the contract could break silently.

Exit gate: a complete accessible form and a representative content page can be built only from published foundations and components.

### Phase 3 — interactive components

Goal: provide reliable keyboard and focus behavior for application interfaces.

Delivery order:

1. [x] Disclosure and Accordion
2. [x] Tabs
3. [x] Dialog
4. [x] Popover and Dropdown Menu
5. [x] Tooltip
6. [x] Toast

Shared work:

- [x] Define initialization, teardown, events, and DOM-update compatibility.
- [x] Define focus placement, restoration, dismissal, Escape behavior, and nested-overlay rules.
- [x] Avoid global listeners unless documented behavior requires them.
- [x] Verify no-JavaScript fallback or progressive enhancement.

Exit gate: every interactive component has deterministic keyboard behavior, focus management, a documented lifecycle, and automated behavior checks.

### Phase 4 — navigation, data, and product patterns

Goal: compose primitives into reusable solutions for real products.

- [x] Header and responsive navigation
- [x] Breadcrumbs and Pagination
- [x] Table with sorting, selection, overflow, and responsive guidance
- [x] Empty, loading, error, and success states
- [x] Search and filter pattern
- [ ] Form validation and submission pattern
- [ ] Settings and account pattern
- [ ] Modal and destructive-action confirmation pattern

Exit gate: the catalog contains representative editorial and application screens built entirely from the system, including loading, empty, error, and success paths.

### Phase 5 — integrations and release readiness

Goal: prove that the package works in intended environments and prepare a stable public contract.

- [ ] Add built-package examples for plain HTML and JavaScript.
- [ ] Add Blade integration examples.
- [ ] Validate Livewire DOM updates and interaction lifecycle.
- [ ] Evaluate Filament integration and document supported customization boundaries.
- [ ] Add CI for builds, package validation, behavior, accessibility, and selected visual regression checks.
- [ ] Establish browser coverage, bundle-size budgets, and performance checks.
- [ ] Complete contribution, release, deprecation, migration, and support policies.
- [ ] Run a full accessibility and API audit before `1.0.0`.

Exit gate: a representative consumer for every supported integration builds from the packed artifact; the public API is documented and protected by checks; known limitations are published.

## 7. Component contract template

Every component proposal will contain:

1. Purpose and user need
2. When to use and when not to use
3. Anatomy
4. Public HTML/CSS/JavaScript API
5. Variants and sizes
6. States and transitions
7. Content and localization guidance
8. Responsive behavior
9. Accessibility semantics and keyboard behavior
10. Tokens consumed
11. Examples and anti-patterns
12. Test and acceptance criteria
13. Open decisions

## 8. Version milestones

| Milestone | Scope | Release condition |
| --- | --- | --- |
| `0.2.0-alpha` | Phase 0 | Single source of truth and English documentation |
| `0.3.0-alpha` | Phase 1 | Stable token and foundation architecture |
| `0.5.0-beta` | Phase 2 | Core controls and content primitives complete |
| `0.7.0-beta` | Phase 3 | Interactive components complete |
| `0.9.0-rc` | Phase 4 and integrations | Representative product patterns and consumer validation |
| `1.0.0` | Release readiness | Stable API, verified accessibility, migration and support policies |

Milestone versions are planning targets. Semantic versioning governs actual releases, and scope may be split into smaller versions when reviewability requires it.

## 9. Decision process

Work proceeds one vertical slice at a time:

1. Record the problem and component contract.
2. Resolve naming, semantics, variants, and token use.
3. Implement the public component.
4. Add it to the catalog using the public API.
5. Verify behavior, accessibility, themes, and package consumption.
6. Update documentation and release notes.

Open decisions belong in the relevant component document. Once a decision ships as public API, changes follow the versioning and migration policy.

## 10. Immediate next work package

Begin Phase 4 in this order:

1. Form validation and submission pattern.
2. Settings and account pattern.

Each interactive component ships with an explicit initializer, cleanup contract, native fallback where available, and targeted behavior tests.
