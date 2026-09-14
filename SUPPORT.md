# Support Policy

## Runtime environments

The package targets modern, standards-based browsers and Node.js 20 or newer for development and builds.

The browser baseline is the latest two stable releases of Chrome, Edge, Firefox, and Safari. A specific older browser becomes supported only when it is listed here and covered by a representative verification scenario.

## Public delivery formats

- `@nikba/design-system` provides an ES module.
- `@nikba/design-system/css` provides the compiled CSS bundle.
- Public CSS classes and custom properties use the `nds-` prefix.
- No CommonJS or UMD JavaScript contract is supported during Alpha.

## Progressive enhancement

Core content and native controls must remain usable without JavaScript. Components that require interaction behavior document their no-JavaScript state.

Backdrop filtering is optional. Glass surfaces fall back to solid theme surfaces when the feature is unavailable or when the Glass level is Off.

## Frameworks

Plain HTML and JavaScript are the core integration target. Blade, Livewire, and Filament support will be claimed only after representative consumers are added and verified.

## Accessibility

WCAG 2.1 AA is the minimum release target. Support claims require keyboard, browser, zoom, contrast, reduced-motion, and assistive-technology checks appropriate to the component.
