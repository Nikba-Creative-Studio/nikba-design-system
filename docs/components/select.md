# Native Select

## Purpose

Native Select lets a user choose one value from a known set. It preserves the browser and operating system menu, keyboard behavior, zoom support, and assistive-technology semantics of the HTML `<select>` element.

Use Radio when two to five options benefit from immediate comparison. Use an autocomplete or combobox pattern when the dataset is large, dynamic, or must be searched.

## Anatomy

1. Field and visible Label
2. Select Shell
3. Native `<select>` element
4. Native `<option>` or `<optgroup>` elements
5. Decorative disclosure indicator
6. Optional Helper Text or Error Message

## Public API

| API | Purpose |
| --- | --- |
| `.nds-select-shell` | Positions the Select and decorative disclosure indicator |
| `.nds-select` | Required native Select class and default Large size |
| `.nds-select--small` | 36px dense Select |
| `.nds-select--medium` | 44px standard compact Select |
| `.nds-select--large` | 52px prominent Select and default size |
| `aria-invalid="true"` | Exposes and displays a failed validation state |
| `disabled` | Native unavailable state |

## Sizes

| Size | Height | Guidance |
| --- | --- | --- |
| Small | 36px | Dense desktop filters and tables |
| Medium | 44px | Compact forms and touch interfaces |
| Large | 52px | Default forms and prominent selection |

## Placeholder option

When a selection must be made, use a blank, disabled first option with native `required` on Select. The placeholder describes the choice, such as “Select a role,” and does not become valid submitted data.

Do not use a placeholder when a safe default value exists and choosing it on the user’s behalf is appropriate.

## Option groups

Use native `<optgroup label="…">` to organize a moderately long list into meaningful categories. Keep the categories mutually understandable and the option labels distinct. A Select remains a poor fit for hundreds of options or values that require searching.

## States

| State | Visual | Behavior |
| --- | --- | --- |
| Default | Solid surface and disclosure indicator | Opens the native menu |
| Hover | Stronger border | Applied on hover-capable devices |
| Focus | Shared focus halo | Native keyboard focus remains on Select |
| Invalid | Danger border and halo | Requires connected feedback and `aria-invalid="true"` |
| Disabled | Reduced opacity | Native `disabled` prevents focus and selection |

HTML Select has no readonly state. If a value must remain visible but cannot change, render it as text or use disabled only when removing it from interaction is correct.

## Keyboard behavior

Native behavior varies slightly by platform and browser. Users can focus Select with normal sequential navigation, open or navigate its menu with platform-standard keys, choose an option, and dismiss the menu without custom JavaScript.

Do not intercept arrow keys, Space, Enter, Escape, or type-ahead behavior.

## Accessibility

- Associate a visible Label with Select through `for` and `id`.
- Use native `<option>` and `<optgroup>` children.
- Use `required` when a value must be selected.
- Set `aria-invalid="true"` only after validation fails.
- Connect Helper Text and Error Message through `aria-describedby`.
- Keep the complete value in the option text even when the closed control truncates visually.
- Use native `disabled`; do not simulate it with only opacity or `aria-disabled`.
- Keep the native menu and interaction model. A custom popup requires a separate, complete combobox contract.
- In forced-colors mode, restore the platform disclosure indicator and native system colors.

## Content guidance

Label the value being chosen: “Project status,” “Office location,” or “Billing plan.” Placeholder text starts with an action such as “Select a status.” Options use parallel, concise wording and begin with the most distinguishing terms.

## Example

```html
<div class="nds-field">
  <label class="nds-field__label" for="project-status">Project status</label>
  <div class="nds-select-shell">
    <select
      class="nds-select"
      id="project-status"
      name="status"
      required
      aria-describedby="project-status-help"
    >
      <option value="" selected disabled>Select a status</option>
      <option value="draft">Draft</option>
      <option value="review">In review</option>
      <option value="approved">Approved</option>
    </select>
  </div>
  <p class="nds-field__helper" id="project-status-help">
    Status controls where the project appears in team views.
  </p>
</div>
```

## Acceptance criteria

- Select opens the native platform menu without custom JavaScript.
- Label, selected value, required state, and invalid description are exposed programmatically.
- Small, Medium, and Large align with equivalent Input sizes.
- Placeholder cannot become a valid submitted value when selection is required.
- Long selected values remain contained within the control.
- Disabled Select cannot receive focus or change value.
- Keyboard and type-ahead behavior remain native.
- Focus, invalid state, and disclosure remain visible in every theme and forced-colors mode.
