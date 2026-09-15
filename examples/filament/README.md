# Filament integration example

This example demonstrates the supported boundary for Filament 5.x:

- `AdminPanelProvider.php` uses public Panel APIs for the theme entry, locally hosted Onest, contextual colors, and brand logo.
- `nikba.css` is imported by the custom theme generated through Filament's tooling.
- `project-context.blade.php` scopes a Nikba-owned composition inside a Filament page or render hook.

Keep Filament's native components for schema, form, table, action, modal, and notification behavior. The detailed support matrix and upgrade checks are in [`docs/integrations/filament.md`](../../docs/integrations/filament.md).
