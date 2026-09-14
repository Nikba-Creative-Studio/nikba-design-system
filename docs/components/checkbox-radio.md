# Checkbox and Radio

## Purpose

Checkbox lets a user select any number of independent options. Radio lets a user choose exactly one option from a mutually exclusive group. Both preserve native form semantics, keyboard behavior, and submission values.

Use Switch for an immediate binary setting that takes effect when toggled. Use Checkbox when a choice is part of a form or requires a later submit action.

## Anatomy

1. Native visually hidden Checkbox or Radio input
2. Visible control
3. Label
4. Optional description
5. Optional group Legend, Helper Text, or Error Message

The native input remains focusable and interactive. The custom control and icon are decorative representations of its state.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-choice-group` | Groups related choices in a native `fieldset` |
| `.nds-choice-group--inline` | Arranges short choices horizontally when space supports it |
| `.nds-choice-group__legend` | Styles the native group Legend |
| `.nds-choice` | Required clickable Label and layout container |
| `.nds-choice--large` | Provides a larger 24px visual control |
| `.nds-choice--card` | Adds a bordered descriptive selection surface |
| `.nds-checkbox` | Native Checkbox input |
| `.nds-radio` | Native Radio input |
| `.nds-choice__control` | Decorative visual control |
| `.nds-choice__check` | Checked-state icon |
| `.nds-choice__mixed` | Indeterminate-state icon |
| `.nds-choice__content` | Groups Label and description |
| `.nds-choice__label` | Visible option label |
| `.nds-choice__description` | Optional supporting description |

## Checkbox behavior

Checkboxes are independent by default. Native `checked`, `required`, and `disabled` attributes define their initial and constraint states.

Indeterminate is a visual and programmatic property set through JavaScript, not an HTML attribute. A parent Checkbox becomes indeterminate when some, but not all, child choices are selected. Its accessible state is exposed automatically by the native input.

Selecting an indeterminate parent selects all children. Selecting a checked parent clears all children. Update the parent whenever a child changes.

## Radio behavior

Radio inputs become mutually exclusive when they share the same `name`. Exactly one value may be checked in that group. Use a native `fieldset` and `legend` to name the question.

Browser keyboard behavior manages focus and selection with Tab and arrow keys. Do not recreate roving focus or arrow-key handling for native Radio inputs.

## Choice cards

Choice Card adds description and a larger pointer target without changing semantics. The entire card remains a native Label. Keep all content relevant to the selection and avoid nested links or buttons inside the Label.

## States

| State | Visual | Behavior |
| --- | --- | --- |
| Unchecked | Empty control | Available but not selected |
| Checked | Accent surface and check or dot | Native selected state |
| Indeterminate | Accent surface and horizontal mark | Partial Checkbox group selection |
| Focus-visible | Shared focus ring around control | Native input owns focus |
| Disabled | Reduced control and content opacity | Native input cannot focus or change |
| Invalid | Connected Error Message | Input or group exposes failed validation |

## Accessibility

- Keep the native Checkbox or Radio input in the accessibility tree and sequential focus order.
- Wrap each input and its visible content in a native `<label>`, or associate them with matching `for` and `id` values.
- Use `fieldset` and `legend` for related groups.
- Give every Radio in one exclusive group the same `name`.
- Use native `checked`, `required`, and `disabled` attributes.
- Set Checkbox `indeterminate` through its DOM property and keep it synchronized with child states.
- Connect group guidance and validation errors with `aria-describedby`.
- Use `aria-invalid="true"` after validation fails and provide a specific recovery message.
- Do not place interactive descendants inside a Choice Label or Choice Card.
- Keep checked and indeterminate states visible in forced-colors mode.

## Content guidance

Write option labels that complete the group question and remain distinct when read alone. Descriptions explain consequence or scope rather than repeating the Label. Use sentence case and avoid punctuation for short labels.

## Examples

Checkbox:

```html
<label class="nds-choice">
  <input class="nds-checkbox" type="checkbox" name="updates" />
  <span class="nds-choice__control" aria-hidden="true">
    <svg class="nds-choice__check" viewBox="0 0 16 16">
      <path d="m3.5 8 3 3 6-6" />
    </svg>
    <svg class="nds-choice__mixed" viewBox="0 0 16 16">
      <path d="M4 8h8" />
    </svg>
  </span>
  <span class="nds-choice__content">
    <span class="nds-choice__label">Project updates</span>
  </span>
</label>
```

Radio group:

```html
<fieldset class="nds-choice-group">
  <legend class="nds-choice-group__legend">Team size</legend>
  <label class="nds-choice">
    <input class="nds-radio" type="radio" name="team-size" value="small" checked />
    <span class="nds-choice__control" aria-hidden="true"></span>
    <span class="nds-choice__content">
      <span class="nds-choice__label">1–10</span>
    </span>
  </label>
  <label class="nds-choice">
    <input class="nds-radio" type="radio" name="team-size" value="medium" />
    <span class="nds-choice__control" aria-hidden="true"></span>
    <span class="nds-choice__content">
      <span class="nds-choice__label">11–50</span>
    </span>
  </label>
</fieldset>
```

Indeterminate state:

```js
const parent = document.querySelector('#select-all');
const children = [...document.querySelectorAll('[name="permission"]')];
const selectedCount = children.filter((input) => input.checked).length;

parent.checked = selectedCount === children.length;
parent.indeterminate = selectedCount > 0 && selectedCount < children.length;
```

## Acceptance criteria

- Native inputs expose checked, unchecked, mixed, required, invalid, and disabled states.
- Checkbox and Radio respond to pointer, Space, and platform-native keyboard behavior.
- Radios sharing a name remain mutually exclusive and support arrow-key selection.
- Parent Checkbox remains synchronized with all child states.
- Labels and descriptions wrap without separating from their controls.
- Disabled controls cannot receive focus or change value.
- Choice Cards contain no nested interactive elements.
- Focus, checked, and mixed states remain visible in every theme and forced-colors mode.
