# Filament Integration Boundaries

Status: Evaluated against Filament 5.x public extension points  
Support level: Theme alignment and scoped Nikba compositions

## Decision

Use Filament's components for Filament-owned forms, tables, actions, notifications, and modals. Configure their brand layer through Filament's public Panel and theme APIs. Use Nikba components inside custom Blade views, schema components, widgets, and render hooks when the whole composition is application-owned.

This boundary preserves Filament's Livewire and Alpine state contracts while allowing Nikba typography, palette direction, identity, and custom content patterns. Full markup replacement or pixel-equivalent reskinning of Filament internals is outside the supported integration.

## Supported customization

1. Generate a custom panel theme with `php artisan make:filament-theme admin`, keep the generated imports and `@source` directives, and register it with `->viteTheme()`.
2. Configure Onest with Filament's `font()` API and a local font provider.
3. Register primary, success, warning, danger, info, and gray palettes through Filament's color API. Filament needs complete shade palettes and selects shades by context; a Nikba semantic color value is not a direct replacement for that scale.
4. Set the official logo through `brandLogo()` and its documented size and dark-mode options.
5. Render scoped Nikba surfaces through custom Blade views or documented render hooks. Add `.nds-scope` only around Nikba-owned markup.
6. Use `observeComponents()` when custom Nikba interactive roots participate in Livewire morphs.

Filament documents custom themes and `viteTheme()` in its [styling overview](https://filamentphp.com/docs/5.x/styling/overview), contextual palette registration in [Colors](https://filamentphp.com/docs/5.x/styling/colors), and stable insertion points in [Render hooks](https://filamentphp.com/docs/5.x/advanced/render-hooks).

## Unsupported customization

- Replacing Filament form, table, action, notification, or modal markup with Nikba markup while retaining Filament behavior.
- Publishing and editing Filament vendor views solely to change appearance.
- Broad selectors against undocumented internal structure or generated utility classes.
- Applying `.nds-scope` to the entire Filament panel; its foundation rules and Filament's base layer would share ownership of the same controls.
- Mapping Frost, Mist, and Graphite directly onto Filament's light/dark switch. Embedded Nikba regions must choose their own explicit theme until a tested synchronization adapter exists.

## Upgrade contract

Pin the Filament major version. On each upgrade, rebuild the custom theme and verify auth, navigation, forms, tables, actions, modals, notifications, dark mode, responsive layout, and every custom render hook. Rules targeting Filament hook classes are integration code and remain outside Nikba's semantic-version contract.
