# Tabs

## Purpose

Tabs organizes related sections into one view when users need to switch between them without leaving the current context. Each Tab controls one Tabpanel, and only the selected panel is visible.

Use separate pages when content needs distinct URLs, independent history, or deep navigation. Use Disclosure when users benefit from seeing multiple sections simultaneously.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-tabs` | Root layout and behavior scope |
| `.nds-tabs--contained` | Places horizontal Tabs on a compact surface |
| `.nds-tabs--vertical` | Places the Tablist beside its Tabpanel on wider screens |
| `.nds-tabs__list` | Styles the element with `role="tablist"` |
| `.nds-tabs__tab` | Styles a control with `role="tab"` |
| `.nds-tabs__panel` | Styles an element with `role="tabpanel"` |
| `data-nds-tabs` | Marks a group for initialization |
| `data-activation="automatic|manual"` | Selects the keyboard activation model |
| `initTabs(root?)` | Initializes Tabs within a Document or Element and returns cleanup |
| `nds:tabs-change` | Event dispatched after selection changes |

## Markup contract

Every Tab has a unique `id`, `aria-controls` pointing to its Tabpanel, `aria-selected`, and a managed `tabindex`. Every Tabpanel has a unique `id` and `aria-labelledby` pointing back to its Tab.

Use `<button type="button">` for Tabs. The selected Tab uses `aria-selected="true"` and `tabindex="0"`; every other Tab uses `aria-selected="false"` and `tabindex="-1"`. Inactive panels use the native `hidden` attribute.

## Activation models

Automatic activation selects a Tab as keyboard focus moves to it. Use it when panel content is already available and selection has no expensive side effect.

Manual activation moves focus with arrow keys but waits for Enter or Space before changing the selected panel. Use it when loading or rendering a panel may introduce noticeable delay.

## Keyboard behavior

| Key | Horizontal | Vertical |
| --- | --- | --- |
| Arrow Right | Focus next Tab | No component action |
| Arrow Left | Focus previous Tab | No component action |
| Arrow Down | No component action | Focus next Tab |
| Arrow Up | No component action | Focus previous Tab |
| Home | Focus first enabled Tab | Focus first enabled Tab |
| End | Focus last enabled Tab | Focus last enabled Tab |
| Enter or Space | Activate focused Tab in manual mode | Activate focused Tab in manual mode |

Navigation wraps from the last enabled Tab to the first and skips disabled Tabs. Tab moves from the active Tab into the selected Tabpanel or its first focusable descendant.

## JavaScript lifecycle

`initTabs(root)` initializes groups under the supplied Document or Element and skips groups that are already active. It returns a cleanup function for the listeners added by that call.

Call cleanup before replacing an initialized group. After adding or removing Tabs inside an existing group, clean up and initialize it again so the relationship map remains current.

`nds:tabs-change` bubbles from the group and exposes the selected Tab and Tabpanel as `event.detail.tab` and `event.detail.panel`.

## Accessibility

Give every Tablist an accessible label. Keep Tab labels concise and distinct. Do not place unrelated controls inside a Tablist.

Use `tabindex="0"` on a Tabpanel when its content begins with text or otherwise has no natural focus target. Omit it when the first meaningful content is already focusable.

Vertical appearance uses `aria-orientation="vertical"` while it is visually vertical. When responsive CSS changes the list to horizontal, application code should also update the attribute or keep the horizontal keyboard model at every breakpoint.

## Acceptance criteria

- Only one Tab is selected and only its Tabpanel is visible.
- Tab enters the component on the selected Tab.
- Arrow, Home, and End keys move focus and wrap correctly.
- Disabled Tabs are skipped by keyboard navigation and cannot activate.
- Automatic activation changes selection with focus.
- Manual activation waits for Enter, Space, or click.
- Focus remains visible in every theme and forced-colors mode.
- Tab and Tabpanel relationships remain valid and unique.
- Long Tab lists scroll horizontally without page overflow.
- Initialization is idempotent and cleanup removes its listeners.
- Selection emits `nds:tabs-change` with the correct Tab and Tabpanel.
