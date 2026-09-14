# Field, Label, Helper Text, and Error Message

## Purpose

Field connects a visible label, form control, supporting guidance, and validation feedback into one understandable input experience. It manages layout and relationships while the nested control retains its native semantics and behavior.

Use Field around one form control. Use `fieldset` and `legend` for a group of related Checkbox or Radio controls.

## Anatomy

1. Field container
2. Label row
3. Visible Label
4. Optional required indicator or “Optional” text
5. Native form control
6. Optional Helper Text
7. Optional Error Message

## Public API

| API | Purpose |
| --- | --- |
| `.nds-field` | Required layout container for one labeled control |
| `.nds-field--inline` | Places Label beside the control when space supports it |
| `.nds-field--disabled` | Visually coordinates supporting text with a disabled control |
| `.nds-field__label-row` | Aligns Label with required or optional metadata |
| `.nds-field__label` | Styles the native `<label>` |
| `.nds-field__required` | Visual required indicator; hidden from assistive technology |
| `.nds-field__optional` | Visible text identifying an optional value |
| `.nds-field__helper` | Persistent guidance connected through `aria-describedby` |
| `.nds-field__error` | Specific validation feedback connected through `aria-describedby` |
| `.nds-field__error-icon` | Decorative error indicator |

Field accepts a native input, textarea, select, or another control with equivalent semantics. Use the published [Input and Textarea](./input-textarea.md) contract for free-text entry.

## Layout

The default layout places Label, control, and supporting text in one vertical flow. Inline places the Label in a leading column and keeps Helper Text or Error Message aligned with the control. Inline collapses to the vertical layout on smaller screens without changing DOM order.

Do not use columns when labels vary greatly in length or when the form is likely to be translated into languages with longer text.

## Required and optional values

Use the native `required` attribute when a value is required. The visual asterisk supports sighted users and uses `aria-hidden="true"` because the control already exposes its required state.

When most values in a form are required, identify exceptions with visible “Optional” text. When most values are optional, identify the required values instead. Apply one convention consistently within a form.

## Helper Text

Helper Text appears before validation and explains format, constraints, consequence, or where to find a value. It remains visible when useful after entry. Connect it to the control with `aria-describedby`.

Do not repeat the Label or use Helper Text for instructions that belong at form level.

## Error Message

Error Message explains the problem and how to correct it. Preserve the entered value, move focus only when the broader form pattern requires it, and connect the message with `aria-describedby`. Set `aria-invalid="true"` on the control after validation fails.

If an error is inserted after an interaction and must be announced immediately, use a suitable live-region strategy when the message appears. Do not put static, initially rendered errors in an alert region.

## Disabled and readonly

Disabled controls are unavailable and leave the normal focus order. Apply `.nds-field--disabled` to coordinate the visual treatment of Label and Helper Text, and use native `disabled` on the control.

Readonly controls remain focusable and allow selection or copying. Explain why a value cannot be edited when that information helps the user.

## Accessibility

- Every control has a visible native `<label>` associated through `for` and `id`, or through label containment.
- Placeholder text never replaces Label.
- Every `id` is unique within the document.
- Helper Text and Error Message IDs appear in the control’s `aria-describedby` value.
- Required state uses the native `required` attribute.
- Invalid state uses `aria-invalid="true"` only after validation has occurred.
- Error copy identifies both the problem and the expected correction.
- Field order stays Label, control, then supporting text in the DOM, including Inline layout.
- Disabled and readonly states match the native control behavior.

## Content guidance

Use concise nouns or noun phrases for Labels: “Project name,” “Work email,” or “Time zone.” Avoid punctuation. Helper Text uses a complete, short instruction when needed. Error Message uses direct recovery language such as “Enter a complete email address.”

## Example

```html
<div class="nds-field">
  <div class="nds-field__label-row">
    <label class="nds-field__label" for="project-name">
      Project name
      <span class="nds-field__required" aria-hidden="true">*</span>
    </label>
  </div>
  <input
    class="nds-input"
    id="project-name"
    name="project-name"
    type="text"
    required
    aria-describedby="project-name-help"
  />
  <p class="nds-field__helper" id="project-name-help">
    Use the name your team will recognize.
  </p>
</div>
```

Invalid state:

```html
<div class="nds-field">
  <div class="nds-field__label-row">
    <label class="nds-field__label" for="email">Work email</label>
  </div>
  <input
    class="nds-input"
    id="email"
    name="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p class="nds-field__error" id="email-error">
    Enter a complete email address, such as name@company.com.
  </p>
</div>
```

## Acceptance criteria

- Every demonstrated control has a visible, programmatically associated Label.
- Required, optional, invalid, disabled, and readonly states remain understandable without color.
- Helper Text and Error Message are included in the accessible description.
- Error feedback explains a correction and remains readable in every theme.
- Inline layout collapses without changing semantic order or relationships.
- Labels, long guidance, and translated content wrap without overlapping the control.
- Disabled controls cannot receive focus; readonly controls remain focusable.
- Error and focus treatment remains visible in forced-colors mode.
