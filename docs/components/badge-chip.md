# Badge and Chip

## Purpose

Badge communicates compact, read-only status or metadata. Selectable Chip is an interactive control that adds or removes an independent choice, commonly in a filter set.

Keep these roles distinct. A Badge does not receive focus or trigger an action. A Chip uses native button semantics and exposes its selected state with `aria-pressed`.

## Anatomy

### Badge

1. Non-interactive container
2. Optional status dot
3. Short text label

### Selectable Chip

1. Native `<button>` container
2. Optional leading icon or selected check
3. Visible label
4. Optional count

## Public API

| API | Purpose |
| --- | --- |
| `.nds-badge` | Required Badge base class and neutral appearance |
| `.nds-badge--accent` | High-emphasis Badge with the accent surface |
| `.nds-badge--success` | Positive or completed status |
| `.nds-badge--warning` | Status requiring attention |
| `.nds-badge--danger` | Failed, blocked, or critical status |
| `.nds-badge--info` | Informational or scheduled status |
| `.nds-badge--large` | Larger Badge for low-density layouts |
| `.nds-badge__dot` | Optional decorative status indicator |
| `.nds-chip` | Required selectable Chip base class |
| `.nds-chip--medium` | 44px Chip for touch-first interfaces |
| `.nds-chip--quiet` | Low-emphasis resting surface |
| `.nds-chip__icon` | Leading icon wrapper |
| `.nds-chip__check` | Check that appears when selected |
| `.nds-chip__count` | Optional numeric count |
| `aria-pressed="true|false"` | Selected state for a Chip |

## Badge variants

Use Neutral for categories and ordinary metadata. Use semantic tones only when the label carries the same meaning: Success for completion, Warning for attention, Danger for failure, and Info for neutral system information. Accent highlights a new or important item without implying status.

The status dot supports the text label and remains decorative. Do not publish a Badge that communicates meaning through its dot or color alone.

## Chip variants and states

| State | Visual | Behavior |
| --- | --- | --- |
| Default | Solid surface and border | Available, not selected |
| Hover | Stronger surface and text | Applied only on hover-capable devices |
| Active | 0.98 scale | Confirms activation |
| Focus-visible | Shared 3px focus ring | Visible for keyboard navigation |
| Selected | Accent surface and visible check | Requires `aria-pressed="true"` |
| Disabled | Reduced opacity | Native `disabled` prevents focus and activation |

Use the 36px default in dense pointer-first filtering. Use Medium when Chips are primary touch targets. A selectable Chip represents an independent toggle; use Radio when only one item in a set may be selected.

## Accessibility

- Render Badge with a non-interactive element such as `<span>`. Do not add `tabindex`, button roles, or click handlers.
- Include explicit status text. Color and the optional dot are supporting cues.
- Render selectable Chip with `<button type="button">` and an explicit `aria-pressed` value.
- Update `aria-pressed` immediately when selection changes.
- Group related Chips in a container with `role="group"` and an accessible name when the surrounding context does not already label the set.
- Use native `disabled` for an unavailable Chip. Disabled controls do not need `aria-disabled` in addition.
- Keep visible labels concise and provide the full accessible meaning when an icon or count could be ambiguous.
- Use Checkbox instead when a conventional form control makes the selection easier to understand.

## Content guidance

Badge labels describe the current state or category: “Draft,” “Approved,” or “Needs review.” Chip labels name the option being included: “Branding,” “Archived,” or “This month.” Use sentence case and avoid punctuation.

Counts supplement the label and do not replace it. Keep Badge labels to a short phrase. Use another component when the message needs explanation or an action.

## Examples

Semantic Badge:

```html
<span class="nds-badge nds-badge--success">
  <span class="nds-badge__dot" aria-hidden="true"></span>
  Approved
</span>
```

Selectable Chip:

```html
<button class="nds-chip" type="button" aria-pressed="false">
  <span class="nds-chip__check" aria-hidden="true">
    <svg viewBox="0 0 16 16"><path d="m3.5 8 3 3 6-6" /></svg>
  </span>
  Branding
  <span class="nds-chip__count">8</span>
</button>
```

Chip group:

```html
<div role="group" aria-label="Filter projects">
  <button class="nds-chip" type="button" aria-pressed="true">All projects</button>
  <button class="nds-chip" type="button" aria-pressed="false">Branding</button>
  <button class="nds-chip" type="button" aria-pressed="false">Digital</button>
</div>
```

## Acceptance criteria

- Badges remain readable in every semantic tone across Frost, Mist, and Graphite.
- Badge meaning remains understandable without color or the decorative dot.
- Badges never appear in the sequential focus order.
- Chips expose an explicit selected state through `aria-pressed`.
- Selected, unselected, focus-visible, and disabled Chip states remain distinct in every theme.
- Medium Chips meet the minimum touch-target height.
- Chip labels and counts remain aligned at increased text size.
- Focus and selection remain visible in forced-colors mode.
