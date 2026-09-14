# Foundation Reference

## Import order

The bundled stylesheet uses this order:

1. Primitive tokens
2. Theme mappings
3. Semantic aliases
4. Reset and scope
5. Typography
6. Layout
7. Motion
8. Components

Consumers should import `@nikba/design-system/css` once and place `.nds-scope` on the controlled interface root.

## Typography and fonts

The library defines `--nds-font-sans` but does not make a network request. Applications own font delivery.

Provider example:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Self-hosted example:

```css
@font-face {
  font-family: 'Onest';
  src: url('/fonts/onest-variable.woff2') format('woff2');
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}
```

Public typography classes:

- `.nds-display`
- `.nds-heading-1`, `.nds-heading-2`, `.nds-heading-3`
- `.nds-body`, `.nds-body-large`
- `.nds-label`
- `.nds-prose`

## Token groups

### Typography

`--nds-font-sans`, font weights, font sizes, line heights, and letter-spacing tokens define the type system. Components should use these tokens rather than setting equivalent repeated values.

### Spacing

`--nds-space-0` through `--nds-space-10` represent `0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 144px` at the default root size.

Responsive semantic spacing is available through `--nds-page-gutter`, `--nds-section-space`, `--nds-component-gap`, and `--nds-card-padding`.

### Geometry and controls

- Control heights: `--nds-control-height-sm`, `md`, `lg`, and `xl`
- Radii: `--nds-radius-none`, `sm`, `md`, `lg`, `xl`, and `pill`
- Borders: `--nds-border-width` and `--nds-border-width-strong`
- Content widths: `--nds-container-max` and `--nds-prose-max`

### Motion and elevation

Duration tokens range from instant through slow. `--nds-ease-standard` is used for direct state changes; `--nds-ease-out` is used for entrances and larger spatial changes.

Theme elevation roles are `--nds-elevation-subtle` and `--nds-elevation-raised`. Their legacy aliases remain available as `--nds-shadow-subtle` and `--nds-shadow-elevated` during Alpha.

### Layering and breakpoints

Z-index tokens cover base, dropdown, sticky, overlay, modal, and toast layers. Breakpoint custom properties document the mobile and tablet thresholds; CSS media queries use the corresponding literal values because custom properties cannot control media-query conditions.

## Theme contract

Apply `data-theme="frost"`, `mist`, or `graphite` to the root or a nested `.nds-scope`. Theme custom properties inherit normally, which allows a scoped theme to be nested inside another theme.

Frost and Mist set `color-scheme: light`; Graphite sets `color-scheme: dark`. Native controls therefore follow the active theme.

Semantic color roles include canvas, surfaces, glass, borders, text tiers, accent, focus, success, warning, danger, and info. Existing short aliases such as `--nds-bg`, `--nds-text`, and `--nds-danger` remain public for compatibility.

## Glass contract

Apply `data-glass="off"`, `soft`, or `clear` at the same level as the theme, then use `.nds-glass` on an eligible surface.

- Off uses a solid surface and no backdrop filter.
- Soft uses the standard glass color and 8px blur.
- Clear reduces glass opacity and uses 14px blur.

Browsers without backdrop-filter support receive a solid surface fallback.

## Layout primitives

`.nds-container` provides the responsive page gutter and maximum width.

`.nds-stack` lays out vertical content. Override `--nds-stack-gap` locally when the default spacing is not appropriate.

`.nds-cluster` wraps related inline items. Override `--nds-cluster-gap` locally when required.

`.nds-grid` uses 12 columns on desktop, 8 on tablet, and 4 on mobile. Override `--nds-grid-columns` and `--nds-grid-gap` for a local composition.

`.nds-visually-hidden` keeps accessible text available to assistive technology while removing it visually.

## Accessibility behavior

The scope applies predictable box sizing and form font inheritance. Focusable utilities consume shared focus-ring tokens. Reduced-motion preferences reduce animation and transition duration without hiding content. Forced-colors mode replaces material effects with system colors where required.

Theme contrast checks cover text tiers, accent/inverse text, focus/canvas, and feedback/surface pairs. Component-level checks remain required because translucency and surrounding colors can change the effective result.

