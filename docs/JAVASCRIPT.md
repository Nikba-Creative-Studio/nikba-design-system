# JavaScript API Reference

Status: Alpha public contract  
Module: `@nikba/design-system`

The package is an ES module. Import the stylesheet separately, then import only the behavior used by the application.

```js
import '@nikba/design-system/css';
import { initDialogs, setTheme } from '@nikba/design-system';
```

## Appearance

### `themes`

Frozen ordered array: `['frost', 'mist', 'graphite']`.

### `glassLevels`

Frozen ordered array: `['off', 'soft', 'clear']`.

### `setTheme(theme, target?)`

Sets `target.dataset.theme`. Target defaults to `document.documentElement`. An unknown value throws `TypeError`.

### `setGlassLevel(level, target?)`

Sets `target.dataset.glass`. Target defaults to `document.documentElement`. An unknown value throws `TypeError`.

## Component initializers

Every initializer accepts an optional `Document` or `Element` root, discovers matching roots within it, and is idempotent per component root. The return value is a cleanup function for instances initialized by that call.

| Export | Root marker | Event |
| --- | --- | --- |
| `initAccordions(root?)` | `[data-nds-accordion="single"]` | `nds:accordion-change` |
| `initTabs(root?)` | `[data-nds-tabs]` | `nds:tabs-change` |
| `initDialogs(root?)` | `dialog[data-nds-dialog]` | `nds:dialog-open`, `nds:dialog-close` |
| `initPopovers(root?)` | `[data-nds-popover]` | `nds:menu-select` for Menu choices |
| `initSelects(root?)` | `[data-nds-select]` | `nds:select-change` with the selected value and option |
| `initTooltips(root?)` | `[data-nds-tooltip]` | `nds:tooltip-show`, `nds:tooltip-hide` |
| `initNavigations(root?)` | `[data-nds-navigation]` | `nds:navigation-change` |
| `initTables(root?)` | `[data-nds-table]` | `nds:table-sort`, `nds:table-selection-change` |
| `initForms(root?)` | `[data-nds-form]` | `nds:form-valid`, `nds:form-invalid` |

Events bubble from their component root. Event detail is documented in the relevant component or pattern contract. Call cleanup before permanently discarding an initialized root when the application does not use the dynamic lifecycle observer.

## Dynamic DOM

### `observeComponents(root?)`

Initializes existing components, observes child-list changes, initializes added component roots, and cleans removed roots. It requires `MutationObserver` and returns a frozen controller:

```js
const lifecycle = observeComponents();
lifecycle.refresh(optionalRoot);
lifecycle.disconnect();
```

`refresh()` safely scans again after application navigation. `disconnect()` stops observation and cleans every mounted instance. Toast managers remain application-owned and are not created automatically.

## Toast manager

### `createToastManager(region, options?)`

Creates one manager per region. A missing region throws `TypeError`; a repeated call for the same region returns the existing manager. Options are `maxVisible` (default `3`) and `duration` in milliseconds (default `5000`, `0` for persistent).

The frozen manager exposes:

- `show({ id?, title?, message?, tone?, duration?, action? })` and returns `{ id, dismiss }`. Tone is `neutral`, `info`, `success`, `warning`, or `danger`. A Toast without title and message throws `TypeError`.
- `dismiss(id, reason?)` returns whether a queued or visible Toast was found.
- `dismissAll()` clears queued and visible Toasts.
- `destroy()` clears the region and releases the manager. Calling `show()` afterward throws `Error`.

The region emits `nds:toast-show`, `nds:toast-dismiss`, and `nds:toast-action`. User interaction pauses timed dismissal. The manager inserts title and message through `textContent`.

## Lifecycle ownership

Use direct initializers for static pages or application-controlled mounts. Use `observeComponents()` for Livewire and other DOM-replacement systems. Never combine an observer with repeated global direct initialization as an application lifecycle strategy; idempotence prevents duplicates, but ownership and teardown become unclear.
