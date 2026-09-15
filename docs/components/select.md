# Select

## Purpose

Select lets a user choose one value from a known set. The designed listbox provides a consistent Nikba popup across themes. The native variant preserves the browser and operating system menu for zero-JavaScript forms and platform-specific contexts.

Use Radio when two to five options benefit from immediate comparison. Use an autocomplete pattern when the dataset is large, dynamic, or searchable.

## Variants

### Designed listbox

Use the designed listbox when the popup surface and option states must match the product interface. It requires `initSelects()` and follows the select-only combobox keyboard model. A native `<select>` can remain the source of truth so form submission, reset, constraints, and no-JavaScript fallback stay intact.

### Native fallback

Use `.nds-select` when native validation, no JavaScript, or the platform picker is more valuable than visual consistency. Browsers and operating systems draw the open native menu, so its popup cannot be styled consistently.

## Designed listbox anatomy

1. Field and visible Label
2. `.nds-selectbox` root with `data-nds-select`
3. Native Select source or hidden form value
4. Combobox trigger with `data-nds-select-trigger`
5. Selected label with `data-nds-select-label`
6. Popover listbox with `data-nds-select-listbox`
7. Options with `role="option"`, stable IDs, and `data-value`
8. Optional Helper Text

## Public API

| API | Purpose |
| --- | --- |
| `.nds-selectbox` / `[data-nds-select]` | Designed Select root and behavior marker |
| `.nds-selectbox--small` | 36px designed Select |
| `.nds-selectbox--medium` | 44px designed Select |
| `.nds-selectbox--large` | 52px designed Select and default size |
| `.nds-selectbox__native` | Native source hidden only after enhancement succeeds |
| `.nds-selectbox__trigger` | Focused combobox control |
| `.nds-selectbox__listbox` | Top-layer option popup |
| `.nds-selectbox__group` | Non-interactive option-group label |
| `.nds-selectbox__option` | Selectable option |
| `[data-nds-select-value]` | Form value updated after selection |
| `initSelects(root?)` | Initializes keyboard, pointer, value, and popup behavior |
| `nds:select-change` | Bubbling event with `{ value, option }` detail |
| `data-nds-select-required` | Clears the connected Select error after a non-empty choice |
| `.nds-select-shell` / `.nds-select` | Native Select fallback |
| `.nds-select--small` | 36px native Select |
| `.nds-select--medium` | 44px native Select |
| `.nds-select--large` | 52px native Select and default size |

## Keyboard behavior

| Key | Behavior |
| --- | --- |
| Arrow Down / Arrow Up | Opens the popup and moves through options |
| Home / End | Moves to the first or last option while open |
| Enter / Space | Selects the active option |
| Printable characters | Opens the popup and moves to the first matching option |
| Escape | Closes without changing the value |
| Tab | Closes and continues normal focus order |

Focus remains on the combobox trigger. `aria-activedescendant` identifies the active option while the listbox is open.

## Accessibility

- Give every option a unique, stable `id`.
- Connect the visible Label and selected value to the trigger with `aria-labelledby`.
- Keep `aria-controls`, `aria-haspopup="listbox"`, and `aria-expanded` on the trigger.
- Put `role="listbox"` on the popup and `role="option"` with `aria-selected` on every option.
- Use a hidden input when the value must be included in a native form submission.
- Connect an error marked with `data-nds-select-error` when using `data-nds-select-required`.
- Use `aria-disabled="true"` only for unavailable designed options. Native Select uses the `disabled` attribute.
- Keep the complete option label in the DOM even if the closed trigger truncates it.
- Use searchable autocomplete for hundreds of values.

## Designed example

Prefer the native-source form when the Select participates in submission or validation. The initializer generates the trigger, listbox, option groups, and option states while preserving the original Select as the form value and no-JavaScript fallback.

```html
<div class="nds-field">
  <label class="nds-field__label" for="status">Project status</label>
  <div class="nds-selectbox" data-nds-select>
    <select class="nds-select" id="status" name="status" required>
      <option value="">Choose a status</option>
      <option value="draft">Draft</option>
      <option value="review">In review</option>
    </select>
  </div>
</div>
```

For interface state that does not need native constraints, authored listbox markup remains supported:

```html
<div class="nds-field">
  <span class="nds-field__label" id="status-label">Project status</span>
  <div class="nds-selectbox" data-nds-select>
    <input type="hidden" name="status" value="draft" data-nds-select-value />
    <button
      class="nds-selectbox__trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-controls="status-options"
      aria-labelledby="status-label status-value"
      data-nds-select-trigger
    >
      <span id="status-value" data-nds-select-label>Draft</span>
    </button>
    <div
      class="nds-selectbox__listbox"
      id="status-options"
      role="listbox"
      aria-labelledby="status-label"
      popover="auto"
      data-nds-select-listbox
    >
      <div class="nds-selectbox__option" id="status-draft" role="option" aria-selected="true" data-value="draft">Draft</div>
      <div class="nds-selectbox__option" id="status-review" role="option" aria-selected="false" data-value="review">In review</div>
    </div>
  </div>
</div>
```

```js
import { initSelects } from '@nikba/design-system';

const cleanup = initSelects();
```

## Acceptance criteria

- The designed popup uses system surfaces, borders, spacing, selected state, and focus treatment in every theme.
- Pointer and keyboard selection update the visible label, hidden form value, `aria-selected`, and change event.
- Native-source enhancement preserves form submission, reset, required validation, and an operable no-JavaScript fallback.
- Opening, flipping, and viewport clamping keep the popup visible at narrow and desktop sizes.
- Escape closes without changing the selected value.
- Disabled options cannot be selected.
- Cleanup removes listeners and allows the root to initialize again.
- Native Select remains available as a no-JavaScript fallback.
- Forced-colors mode exposes clear trigger, listbox, active, and selected states.
