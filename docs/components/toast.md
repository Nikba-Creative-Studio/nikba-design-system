# Toast

## Status

Complete for the current alpha scope.

## Purpose

Toast announces a brief result without interrupting the current task. A Toast manager creates safe DOM content, limits visible messages, queues overflow, pauses timed dismissal during interaction, and exposes explicit lifecycle events.

## Public API

- `.nds-toast-region`: fixed notification stack.
- `.nds-toast`: base notification surface.
- `.nds-toast--neutral`, `--info`, `--success`, `--warning`, `--danger`: semantic tones.
- `.nds-toast__content`, `__title`, `__message`: message structure.
- `.nds-toast__action`: optional action.
- `.nds-toast__close`: dismissal control.
- `createToastManager(region, options)`: creates or returns the existing manager for a region.

Manager options:

- `maxVisible`: visible stack limit; default `3`.
- `duration`: default timeout in milliseconds; default `5000`. Use `0` for persistent messages.

`manager.show(options)` accepts `id`, `title`, `message`, `tone`, `duration`, and `action: { label, onSelect }`. It returns `{ id, dismiss }`. The manager also exposes `dismiss(id)`, `dismissAll()`, and `destroy()`.

## Example

```js
import { createToastManager } from '@nikba/design-system';

const manager = createToastManager(document.querySelector('.nds-toast-region'));

manager.show({
  title: 'Changes saved',
  message: 'The latest version is available to your team.',
  tone: 'success',
  action: { label: 'View', onSelect: () => openVersion() },
});
```

```html
<div class="nds-toast-region" aria-label="Notifications"></div>
```

Text is assigned with `textContent`; message options are never interpreted as HTML.

## Queue and timing

- The manager displays up to `maxVisible` Toasts and queues the rest in insertion order.
- Dismissing a visible Toast promotes the oldest queued message.
- IDs prevent duplicate visible or queued messages.
- Timers pause during pointer hover and while focus remains inside the Toast.
- Warning and danger use assertive `alert` semantics. Other tones use polite `status` semantics.
- Persistent messages require explicit dismissal.

## Events

- `nds:toast-show`: `{ id, toast, options }`.
- `nds:toast-dismiss`: `{ id, reason, toast, options }`.
- `nds:toast-action`: `{ id, toast, options }`.

Dismiss reasons include `dismiss`, `timeout`, `action`, and `dismiss-all`.

## Content guidance

- State what happened in the title.
- Add a message only when it changes the next decision.
- Use one short action such as Undo or View.
- Do not use Toast as the only presentation of form errors, destructive confirmation, or information that must be retained.
- Avoid sending several messages for one completed operation.

## Accessibility

- Keep the region near the end of the document and give it an accessible label.
- Do not move focus into a Toast automatically.
- Ensure an action is reachable through the normal tab order.
- Provide persistent duration for messages that require reading or action.
- Keep the close control's accessible name specific to the notification.

## Acceptance criteria

- Safe text rendering prevents message options from becoming markup.
- Queue order and visible limits remain deterministic.
- Timers pause for hover and focus.
- Semantic tones use the documented announcement priority.
- Action, manual, timeout, and bulk dismissal emit lifecycle events.
- Mobile width respects viewport gutters.
- Reduced motion removes entrance animation.
- Manager idempotence, queuing, dismissal, destruction, and validation are covered by tests.
