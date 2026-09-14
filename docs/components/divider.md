# Divider

## Purpose

Divider separates content by topic, hierarchy, or control group while keeping the visual boundary quiet.

Use whitespace first. Add Divider when spacing alone cannot communicate the relationship between adjacent regions.

## Semantics

Use a native `<hr>` when the Divider represents a thematic break in content. It exposes Horizontal Separator semantics automatically.

Use a neutral element with `aria-hidden="true"` when the line is only decorative. For a meaningful Vertical Divider, use `role="separator"` with `aria-orientation="vertical"`.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-divider` | Default Horizontal Divider |
| `.nds-divider--strong` | Increases line weight and contrast |
| `.nds-divider--compact` | Uses 12px block margins |
| `.nds-divider--spacious` | Uses 64px block margins |
| `.nds-divider--inset` | Adds 24px inline margins |
| `.nds-divider--vertical` | Stretches between items in an inline layout |
| `.nds-divider-label` | Places a short label between two lines |
| `.nds-divider-label--strong` | Strengthens both lines around a label |

Default Divider uses 32px block margins. Spacing modifiers change external space and do not change the line itself.

## Variants

Default uses the standard Border color and one-pixel width. Strong uses the stronger Border color and two-pixel width. Use Strong for a significant hierarchy boundary, not as a decorative accent.

Inset separates items inside a larger container without touching its inline edges. Vertical Divider belongs between compact items that already share one horizontal context.

Divider with Label explains equivalent paths such as alternative sign-in methods. Keep the label short and neutral. Apply Separator semantics to the wrapper when the split is meaningful.

## Accessibility

- Use native `<hr>` for a meaningful Horizontal thematic break.
- Hide decorative Dividers with `aria-hidden="true"`.
- Add `role="separator"` and `aria-orientation="vertical"` to a meaningful Vertical Divider.
- Native Separator orientation is Horizontal by default.
- Give a labeled Separator an accessible name that explains the boundary.
- Do not use Divider as a replacement for a heading or group label.
- Keep line contrast visible in every theme and forced-colors mode.

## Examples

Semantic Horizontal Divider:

```html
<hr class="nds-divider" />
```

Decorative Divider:

```html
<div class="nds-divider nds-divider--compact" aria-hidden="true"></div>
```

Vertical Divider:

```html
<div
  class="nds-divider nds-divider--vertical"
  role="separator"
  aria-orientation="vertical"
></div>
```

Divider with Label:

```html
<div
  class="nds-divider-label"
  role="separator"
  aria-label="Alternative sign-in method"
>
  <span>or continue with</span>
</div>
```

## Acceptance criteria

- Native Horizontal Rule exposes Separator semantics without additional ARIA.
- Decorative Divider is absent from the accessibility tree.
- Meaningful Vertical Divider exposes Vertical Separator orientation.
- Default and Strong remain distinct in every theme.
- Compact, Default, Spacious, and Inset spacing do not cause overflow.
- Labeled Divider keeps readable line length and wraps safely at 320px.
- Vertical Divider stretches to its parent without setting a fixed height.
- Divider remains visible in forced-colors mode.
