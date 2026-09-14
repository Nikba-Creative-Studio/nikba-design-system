# Input and Textarea

## Purpose

Input collects a short, single-line value. Textarea collects longer, multiline content. Both retain native HTML behavior and compose with Field for Label, Helper Text, and Error Message.

Use a purpose-specific control when the value is a choice rather than free text. Select, Checkbox, Radio, and Switch reduce entry effort and prevent invalid values.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-input` | Required single-line Input class and default Large size |
| `.nds-input--small` | 36px Input for dense pointer-first layouts |
| `.nds-input--medium` | 44px standard compact Input |
| `.nds-input--large` | 52px prominent Input and default size |
| `.nds-input-shell` | Groups Input with a leading or trailing adornment |
| `.nds-input-shell--disabled` | Coordinates a disabled Input shell |
| `.nds-input-shell__icon` | Decorative icon slot with normalized alignment |
| `.nds-input-shell__text` | Non-editable prefix or suffix |
| `.nds-textarea` | Required multiline control class |
| `.nds-textarea--small` | 120px minimum height |
| `.nds-textarea--large` | 224px minimum height |
| `.nds-textarea-meta` | Aligns Helper Text and Character Count |
| `.nds-character-count` | Displays current and maximum character counts |

## Native attributes

Choose the `type` that matches the value, such as `email`, `url`, `tel`, `search`, or `password`. Add `autocomplete` tokens when stored user information applies. Use `inputmode` only to refine the virtual keyboard when the native type does not already provide the correct keyboard.

Use `name` for submitted values, `required` for required input, and native constraints such as `minlength`, `maxlength`, `min`, `max`, or `pattern` when appropriate. Native constraints do not replace understandable validation feedback.

## Sizes

| Size | Height | Guidance |
| --- | --- | --- |
| Small | 36px | Dense desktop tables and toolbars |
| Medium | 44px | Compact forms and standard touch use |
| Large | 52px | Default forms and prominent entry |

Textarea height follows the expected amount of content. Keep vertical resize enabled so users can create more working space. Do not allow horizontal resize to break the page layout.

## Adornments

Input Shell places a decorative icon, prefix, or suffix beside the editable value. A visible Label still names the control. Prefix and suffix text are outside the submitted value, so the application must combine them only when its data contract requires it.

Decorative icons use `aria-hidden="true"`. When an icon conveys information absent from the Label, provide equivalent accessible text.

## States

| State | Visual | Behavior |
| --- | --- | --- |
| Default | Solid surface and border | Ready for entry |
| Hover | Stronger border | Applied on hover-capable devices |
| Focus | Shared focus halo | Native editing focus remains on the control |
| Invalid | Danger border and halo | Requires `aria-invalid="true"` and connected feedback |
| Disabled | Reduced opacity | Native `disabled` removes focus and editing |
| Readonly | Alternate surface | Remains focusable, selectable, and copyable |

Preserve the entered value when validation fails. Do not validate ordinary text on every keystroke unless immediate feedback is necessary and helpful.

## Character Count

Use Character Count only when the limit matters to the user. Pair it with native `maxlength`. Display current and maximum values, increase emphasis near the limit, and avoid announcing every keystroke to assistive technology. The catalog behavior changes the live-region mode only near the limit.

## Accessibility

- Compose every Input and Textarea with a visible, associated Label.
- Placeholder text provides a short example and never replaces Label or Helper Text.
- Use the native input type, autocomplete token, and input mode that match the data.
- Connect guidance and errors through `aria-describedby`.
- Set `aria-invalid="true"` only after the value has failed validation.
- Keep disabled and readonly semantics aligned with the native attributes.
- Do not prevent paste, password-manager entry, selection, or copying.
- Ensure errors identify the problem and explain how to correct it.
- Keep focus visible across all themes and in forced-colors mode.

## Examples

Email Input:

```html
<div class="nds-field">
  <label class="nds-field__label" for="email">Work email</label>
  <input
    class="nds-input"
    id="email"
    name="email"
    type="email"
    autocomplete="email"
    inputmode="email"
  />
</div>
```

Input with a decorative search icon:

```html
<div class="nds-input-shell">
  <span class="nds-input-shell__icon" aria-hidden="true">
    <!-- Search SVG -->
  </span>
  <input class="nds-input" id="project-search" type="search" />
</div>
```

Textarea with a limit:

```html
<div class="nds-field">
  <label class="nds-field__label" for="summary">Short summary</label>
  <textarea class="nds-textarea" id="summary" name="summary" maxlength="160"></textarea>
  <div class="nds-textarea-meta">
    <p class="nds-field__helper">Used in project cards and search results.</p>
    <span class="nds-character-count">0 / 160</span>
  </div>
</div>
```

## Acceptance criteria

- Input types, autocomplete, and input modes match the documented value.
- Small, Medium, and Large Input sizes remain aligned with adjacent controls.
- Input Shell adornments remain centered with the editable text.
- Default, hover, focus, invalid, disabled, and readonly states remain distinct in every theme.
- Textarea resizes vertically without exceeding its container width.
- Character Count matches the current value and native maximum.
- Labels, guidance, errors, and counts remain readable at increased text size.
- Focus and invalid states remain visible in forced-colors mode.
