# Popover and Dropdown Menu

## Status

Complete for the current alpha scope.

## Purpose

Popover presents short supporting content in the browser top layer. Dropdown Menu is its action-oriented composition with roving focus, directional keyboard navigation, disabled items, selection roles, and typeahead.

## Public API

- `.nds-popover`: anchored top-layer surface.
- `.nds-popover__title`: optional title.
- `.nds-popover__description`: supporting text.
- `.nds-menu`: compact Popover spacing for menus.
- `.nds-menu__label`: non-interactive group label.
- `.nds-menu__item`: menu item control or link.
- `.nds-menu__item--danger`: destructive action tone.
- `.nds-menu__indicator`: selected-state slot.
- `.nds-menu__shortcut`: trailing shortcut hint.
- `.nds-menu__separator`: visual and semantic group divider.
- `data-nds-popover`: marks a Popover for initialization.
- `data-nds-popover-trigger="id"`: connects a trigger to a Popover ID.
- `data-align="end"`: aligns the Popover's inline end with the trigger.
- `data-close-on-select="true"`: closes a checkbox or radio menu after selection.

Use `popover="auto"` for light dismissal and top-layer rendering. Menu triggers require `aria-haspopup="menu"` and `aria-controls`. The initializer manages `aria-expanded`.

## Behavior

- Click toggles the connected Popover.
- Arrow Down opens a Menu and focuses its first enabled item.
- Arrow Up opens a Menu and focuses its last enabled item.
- Arrow keys wrap through enabled items.
- Home and End focus the first and last enabled item.
- Typing moves focus to the first enabled item whose label starts with the typed string.
- Escape closes and returns focus to the trigger.
- Tab closes and continues normal focus movement.
- Activating a standard menu item closes and restores focus.
- Checkbox and radio menu items update `aria-checked` and remain open by default.
- Native automatic Popovers dismiss after an outside interaction.
- Selection emits `nds:menu-select` with `{ item }`.

## Structure

```html
<button
  type="button"
  aria-haspopup="menu"
  aria-controls="project-menu"
  data-nds-popover-trigger="project-menu"
>
  Project actions
</button>

<div
  class="nds-popover nds-menu"
  id="project-menu"
  role="menu"
  popover="auto"
  data-nds-popover
  data-align="end"
>
  <button class="nds-menu__item" type="button" role="menuitem">Rename</button>
  <button class="nds-menu__item" type="button" role="menuitem">Duplicate</button>
  <hr class="nds-menu__separator" role="separator" />
  <button class="nds-menu__item nds-menu__item--danger" type="button" role="menuitem">Delete</button>
</div>
```

Call `initPopovers()` after markup exists. It accepts a Document or Element, skips initialized Popovers, and returns cleanup.

## Placement

The initializer positions the surface below its active trigger, flips it above when there is insufficient space, and clamps it to an eight-pixel viewport margin. Placement follows viewport resize and ancestor scrolling while the Popover remains open.

## Content guidance

- Use Popover for short, nonessential context or compact controls.
- Use Dropdown Menu for a list of actions related to one trigger.
- Start item labels with clear verbs.
- Group related actions and separate destructive actions.
- Keep disabled actions discoverable only when their unavailable state provides useful context.
- Use Dialog for tasks that require sustained focus or confirmation.

## Accessibility

- Give generic Popovers an accessible name when the trigger does not describe them fully.
- Use native buttons for commands and links for navigation.
- A Menu contains menu item roles, not arbitrary interactive controls.
- Do not place forms inside a Dropdown Menu; use a generic Popover or Dialog.
- Visible shortcut hints do not implement keyboard shortcuts.

## Acceptance criteria

- Popovers render in the top layer and light-dismiss through the native API.
- Placement remains inside the viewport and supports start and end alignment.
- Menu focus skips disabled items and wraps in both directions.
- Escape, Tab, Home, End, typeahead, and trigger arrow keys behave deterministically.
- Checkbox and radio roles expose updated checked states.
- Trigger expanded state reflects native opening and closing.
- Initialization and cleanup are idempotent and covered by behavior tests.
