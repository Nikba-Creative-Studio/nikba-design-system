# Empty, Loading, Error, and Success States

## Status

Complete for the current alpha scope.

## Purpose

Product States explain what a content region is doing, why its expected content is absent, and what someone can do next. The pattern composes existing Button, Link, Spinner, Skeleton, and Alert primitives inside a consistent state surface.

## Public API

- `.nds-state`: centered state surface.
- `.nds-state--compact`: reduced height and spacing.
- `.nds-state--inline`: left-aligned composition within an existing region.
- `.nds-state--loading`, `--error`, `--success`: semantic context.
- `.nds-state__content`: constrained content group.
- `.nds-state__icon`: semantic or illustrative icon slot.
- `.nds-state__body`: title and description group.
- `.nds-state__title`, `__description`: primary message.
- `.nds-state__actions`: primary and secondary actions.
- `.nds-state__meta`: optional supporting metadata.

## State model

### Empty

Explain why there is no content and offer the most useful creation, import, or filter-reset action. Distinguish a first-use empty state from an empty search result.

### Loading

Use Skeleton when the final layout is predictable. Use Spinner and a status label when the wait represents an operation or the layout is unknown. Keep the previous content visible when doing so prevents disorientation.

### Error

State what failed, preserve entered data, and provide a retry or recovery path. Put field errors beside fields; use a page or region Error State when the complete region cannot load.

### Success

Confirm completion when the resulting page does not make success obvious. Prefer the resulting content itself when it already communicates completion.

Inline Success places its semantic icon, result message, and next action on one aligned row when space permits. At narrow widths, the action spans the surface below the message so the content remains readable and the target remains easy to use.

## Structure

```html
<section class="nds-state nds-state--error" aria-labelledby="error-title">
  <div class="nds-state__content">
    <span class="nds-state__icon" aria-hidden="true">…</span>
    <div class="nds-state__body">
      <h2 class="nds-state__title" id="error-title">Projects could not load</h2>
      <p class="nds-state__description">Check your connection and try again.</p>
    </div>
    <div class="nds-state__actions">
      <button class="nds-button" type="button">Try again</button>
    </div>
  </div>
</section>
```

## Content guidance

- Use direct titles: “No projects yet,” “Loading projects,” or “Projects could not load.”
- Explain the cause only when it is known and useful.
- Provide one primary recovery action and at most one secondary action.
- Do not blame the user or present internal error codes as the main message.
- Keep technical details available through logs, support context, or an optional disclosure.

## Accessibility

- Connect the state title to its region with `aria-labelledby`.
- Use `aria-busy="true"` on the content region while updating and remove it after completion.
- Announce newly inserted loading status with `role="status"` and urgent failures with `role="alert"` only when they result from an active user action.
- Do not move focus automatically for background state changes.
- Move focus to a page-level error heading only after navigation or submitted action replaces the expected page.

## Acceptance criteria

- Every state names the affected object or region.
- Loading distinguishes predictable-layout and unknown-layout waits.
- Error preserves context and offers recovery.
- Empty search results can reset the active query or filters.
- Success appears only when the result is otherwise unclear.
- Compact and inline compositions preserve hierarchy at narrow widths.
- Semantic tone, focus behavior, announcement priority, and action hierarchy use existing component contracts.
