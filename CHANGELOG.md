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

### Changed

- Overview now uses a structured system-status panel and a denser editorial card grid.
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
