# Switch

## Purpose

Switch changes an immediate binary setting and communicates whether that setting is currently on or off. The change takes effect when the user toggles the control.

Use Checkbox when a choice belongs to a form that the user reviews or submits later. Do not use Switch for choosing between more than two values, triggering a one-time action, or confirming an irreversible action.

## Anatomy

1. Label
2. Optional description
3. Native Checkbox input with Switch semantics
4. Track
5. Thumb

The native input remains focusable and interactive. Track and Thumb are decorative representations of its state.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-switch-group` | Stacks related Switch rows |
| `.nds-switch` | Required clickable Label and layout container |
| `.nds-switch--small` | Uses a compact 36px row and track |
| `.nds-switch--large` | Uses a prominent 52px row and track |
| `.nds-switch--card` | Adds a bordered settings surface |
| `.nds-switch__input` | Native Checkbox input with `role="switch"` |
| `.nds-switch__content` | Groups Label and description |
| `.nds-switch__label` | Visible setting name |
| `.nds-switch__description` | Optional consequence or scope |
| `.nds-switch__track` | Decorative state track |
| `.nds-switch__thumb` | Decorative moving indicator |

Medium is the default size and uses a 44px minimum row height.

## Behavior

The Switch toggles with pointer activation or Space when focused. The complete Label is an interactive target. Native Checkbox behavior manages focus, form values, and change events.

Add `role="switch"` to expose on and off semantics instead of checked and unchecked semantics. Use the native `checked` property as the source of truth. A Switch has no indeterminate state.

Changes should take effect immediately. When persistence is asynchronous, keep the previous state until the update succeeds, expose the wrapper as `aria-busy="true"`, and temporarily disable the input. Restore interaction after success or failure and provide a separate error message when saving fails.

## States

| State | Visual | Behavior |
| --- | --- | --- |
| Off | Neutral track, Thumb at the inline start | Setting is inactive |
| On | Accent track, Thumb at the inline end | Setting is active |
| Hover | Stronger Track border | Pointer target is available |
| Focus-visible | Shared focus ring around Track | Native input owns focus |
| Disabled | Reduced row opacity | Setting cannot change |
| Busy | Spinner replaces Thumb | Current value is being persisted |

## Accessibility

- Keep the native Checkbox input in the accessibility tree and sequential focus order.
- Add `role="switch"` to the native input.
- Wrap the input and visible text in a native `<label>`, or associate them with matching `for` and `id` values.
- Use a stable noun phrase for the Label. The accessible state already communicates on or off.
- Use native `checked` and `disabled` properties.
- Do not use `aria-checked` as a second state source on a native Checkbox.
- Do not support indeterminate state.
- Connect any external guidance or error with `aria-describedby`.
- Keep Track and Thumb hidden from assistive technology with `aria-hidden="true"`.
- Keep on, off, focus, disabled, and busy states visible in forced-colors mode.

## Content guidance

Name the setting that becomes active, such as “Project notifications” or “Public profile.” Use the description to explain scope, timing, or consequence. Avoid labels such as “On/off notifications” because the control already communicates the current state.

## Example

```html
<label class="nds-switch">
  <span class="nds-switch__content">
    <span class="nds-switch__label">Project notifications</span>
    <span class="nds-switch__description">
      Receive updates when project status changes.
    </span>
  </span>
  <input
    class="nds-switch__input"
    type="checkbox"
    role="switch"
    name="project-notifications"
    checked
  />
  <span class="nds-switch__track" aria-hidden="true">
    <span class="nds-switch__thumb"></span>
  </span>
</label>
```

## Acceptance criteria

- The native input exposes Switch role, name, on or off state, and disabled state.
- Pointer activation anywhere on the Label toggles the setting exactly once.
- Space toggles the focused control.
- Focus remains visible in every theme and forced-colors mode.
- On and off remain distinguishable without animation.
- Label and description wrap without colliding with the Track.
- Small, Medium, and Large variants preserve the same semantics.
- Busy state prevents repeated changes while persistence is pending.
- Reduced-motion preferences remove nonessential Thumb animation through the shared foundation.
