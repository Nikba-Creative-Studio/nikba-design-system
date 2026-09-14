# Spinner

## Purpose

Spinner communicates indeterminate progress when the duration or amount of work cannot be measured. It is a visual indicator, not the accessible status by itself.

Use determinate progress when a meaningful percentage exists. Use Skeleton when placeholder shapes can preserve the expected content layout.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-spinner` | Default 20px indeterminate visual indicator |
| `.nds-spinner--small` | Uses a 16px indicator |
| `.nds-spinner--large` | Uses a 32px indicator |
| `.nds-spinner--xlarge` | Uses a 48px indicator |
| `.nds-spinner--muted` | Reduces visual emphasis |
| `.nds-spinner--accent` | Uses the current theme Accent color |
| `.nds-spinner--inverse` | Supports an Accent or inverse surface |
| `.nds-spinner-label` | Aligns Spinner with visible Status text |
| `.nds-spinner-label--stacked` | Centers Status text below Spinner |

## Accessibility

Spinner is decorative and should use `aria-hidden="true"`. Place it beside a textual Status with `role="status"`, or update an existing live region when loading begins.

Set `aria-busy="true"` on the region whose content is loading. Remove the attribute or set it to `false` when the region finishes updating.

For a pending action, use the Button loading contract: set `aria-busy="true"`, use native `disabled`, and keep a stable label such as “Saving changes.” Do not replace an understandable Button label with Spinner alone.

Avoid announcing repeated status changes for background work that does not affect the current task. Do not move focus when loading begins or ends unless the resulting workflow requires it.

## Sizes and tones

Small fits compact controls. Medium is the default for inline status. Large supports a local loading region. Extra Large belongs in a larger content area and should remain uncommon.

Default inherits primary text emphasis. Muted supports secondary loading. Accent follows the theme. Inverse belongs on a surface that uses inverse text. Choose a tone with sufficient contrast against its immediate background.

## Motion

Spinner uses one continuous linear rotation while work is active. The shared reduced-motion foundation reduces the animation to a near-instant single iteration; the incomplete ring remains a visible static loading indicator.

Remove Spinner from the DOM when work completes. Do not leave hidden continuous animation running.

## Examples

Inline Status:

```html
<div class="nds-spinner-label" role="status">
  <span class="nds-spinner" aria-hidden="true"></span>
  <span>Loading projects…</span>
</div>
```

Busy region:

```html
<section aria-busy="true" aria-labelledby="report-title">
  <h2 id="report-title">Weekly performance</h2>
  <div class="nds-spinner-label nds-spinner-label--stacked" role="status">
    <span class="nds-spinner nds-spinner--large" aria-hidden="true"></span>
    <span>Loading report…</span>
  </div>
</section>
```

## Acceptance criteria

- Spinner remains decorative and does not create an unnamed progress control.
- Visible Status text names the current work.
- The affected region exposes and clears `aria-busy` with its actual lifecycle.
- Small, Medium, Large, and Extra Large retain a clear incomplete ring.
- Default, Muted, Accent, and Inverse remain visible on their intended surfaces.
- Pending controls prevent repeated activation.
- Focus does not move only because loading begins or ends.
- Reduced-motion users receive a static loading indicator.
- Spinner remains visible in forced-colors mode.
