# Dialog

## Status

Complete for the current alpha scope.

## Purpose

Dialog places a short, focused task above the current page. It uses the native `dialog` element so the browser provides modal focus containment, Escape handling, and background inertness.

## Public API

- `.nds-dialog`: base modal surface.
- `.nds-dialog--small`: compact confirmation width.
- `.nds-dialog--large`: wider content width.
- `.nds-dialog__header`: title, description, and close-control region.
- `.nds-dialog__title`: visible dialog heading.
- `.nds-dialog__description`: supporting context.
- `.nds-dialog__close`: icon-only close control.
- `.nds-dialog__body`: scrollable content region.
- `.nds-dialog__footer`: action region.
- `data-nds-dialog`: marks a native `dialog` for initialization.
- `data-nds-dialog-open="id"`: opens the Dialog with the matching ID.
- `data-nds-dialog-close="value"`: closes its containing Dialog and sets `returnValue`.
- `data-nds-dialog-initial-focus`: preferred initial focus target.
- `data-dismiss-backdrop="true"`: opts into dismissal when the backdrop is clicked.

## Required structure

Use a native `dialog`, give it a stable ID, and connect its visible title with `aria-labelledby`. Add `aria-describedby` when a concise description is present.

```html
<button type="button" data-nds-dialog-open="invite-dialog">Invite member</button>

<dialog
  class="nds-dialog"
  id="invite-dialog"
  data-nds-dialog
  aria-labelledby="invite-title"
  aria-describedby="invite-description"
>
  <header class="nds-dialog__header">
    <div>
      <h2 class="nds-dialog__title" id="invite-title">Invite member</h2>
      <p class="nds-dialog__description" id="invite-description">Add someone to this workspace.</p>
    </div>
  </header>
  <div class="nds-dialog__body">…</div>
  <footer class="nds-dialog__footer">
    <button type="button" data-nds-dialog-close="cancel">Cancel</button>
    <button type="button" data-nds-dialog-close="invite">Send invite</button>
  </footer>
</dialog>
```

Call `initDialogs()` after the markup exists. The initializer is idempotent for each Dialog and returns cleanup for listeners it adds.

## Behavior

- A connected trigger calls `showModal()` and becomes the focus-restoration target.
- Initial focus moves to `[autofocus]`, then `[data-nds-dialog-initial-focus]`, then the first focusable control. The Dialog itself is the fallback.
- Native modal behavior contains focus and makes content outside the Dialog inert.
- Escape closes the Dialog through the browser's native cancel behavior.
- Close controls pass their `data-nds-dialog-close` value to `dialog.close()`.
- Focus returns to the connected opener after the Dialog closes.
- Backdrop dismissal is opt-in because an accidental outside click can discard work.
- Opening emits `nds:dialog-open` with `{ opener }`.
- Closing emits `nds:dialog-close` with `{ returnValue }`.

## Content guidance

- Use a title that names the task or decision.
- Keep descriptions concise and place detailed content in the body.
- Put the safest secondary action first and the primary action last.
- Use a danger Button only when the action is destructive.
- Avoid stacking modal Dialogs. Close the current Dialog before opening another.

## Accessibility

- Do not add `role="dialog"`; the native element already provides it.
- Every Dialog needs an accessible name through `aria-labelledby` or `aria-label`.
- Icon-only close controls need an `aria-label`.
- Do not intercept Escape for a required decision. If an action cannot be dismissed, use an inline page flow instead.
- Keep initial focus on a safe control or the first field. Avoid focusing a destructive primary action automatically.

## Acceptance criteria

- Opening uses native modal behavior.
- Focus enters the Dialog and returns to its opener after close.
- Escape and explicit close controls work.
- Backdrop dismissal occurs only when enabled.
- Body content scrolls without moving the title and actions off the surface.
- Small and large variants fit narrow viewports without horizontal page overflow.
- Motion is removed when reduced motion is requested.
- Initialization and cleanup are deterministic and covered by behavior tests.
