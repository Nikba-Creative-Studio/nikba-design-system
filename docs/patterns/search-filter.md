# Search and Filter

## Status

Complete for the current alpha scope.

## Purpose

Search and Filter helps people narrow a known collection with a text query and explicit criteria. The pattern uses a native GET form so criteria remain submit-ready, shareable, and recoverable without JavaScript.

## Public API

- `.nds-search-filter`: pattern wrapper.
- `.nds-search-filter__form`: query, filters, and actions surface.
- `.nds-search-filter__query`: query Field wrapper.
- `.nds-search-filter__input-shell`: Input and search-icon positioning wrapper.
- `.nds-search-filter__icon`: decorative query icon.
- `.nds-search-filter__actions`: Apply and Reset actions.
- `.nds-search-filter__summary`: result count and active-state context.
- `.nds-search-filter__active`: active-filter Chip list.
- `.nds-search-filter__results`: result stack.
- `.nds-search-filter__result`: structured result row.
- `.nds-search-filter__identity`: avatar and primary result copy.
- `.nds-search-filter__avatar`: compact owner initials.
- `.nds-search-filter__copy`: title and owner wrapper.
- `.nds-search-filter__title`: primary result label.
- `.nds-search-filter__owner`: owner metadata.
- `.nds-search-filter__type`: result category.

The pattern composes Field, Input, Native Select, Button, Chip, Badge, and Product State APIs.

## Behavior contract

- Use `<form method="get">` and stable query-parameter names.
- Submit applies the complete query and filter set.
- Reset clears all criteria and returns the collection to its default state.
- Preserve criteria in Pagination and sort URLs.
- Display the result count after criteria are applied.
- Represent active filters outside the closed controls when they would otherwise be difficult to scan.
- Removing an active-filter Chip updates the corresponding control and results.
- An empty result keeps the submitted query visible and offers Reset filters.

## Structure

```html
<section class="nds-search-filter">
  <form class="nds-search-filter__form" method="get">
    <label class="nds-field nds-search-filter__query">
      <span class="nds-field__label">Search projects</span>
      <span class="nds-search-filter__input-shell">
        <span class="nds-search-filter__icon" aria-hidden="true">…</span>
        <input class="nds-input nds-input--medium" type="search" name="query" />
      </span>
    </label>
    <label class="nds-field">
      <span class="nds-field__label">Status</span>
      <select class="nds-select" name="status">…</select>
    </label>
    <div class="nds-search-filter__actions">
      <button class="nds-button" type="submit">Apply</button>
      <button class="nds-button nds-button--ghost" type="reset">Reset</button>
    </div>
  </form>
  <div class="nds-search-filter__summary" aria-live="polite">…</div>
  <div class="nds-search-filter__results">
    <article class="nds-search-filter__result">…</article>
  </div>
</section>
```

## Content guidance

- Name the collection in the query label: “Search projects.”
- Use filter labels that describe one stable attribute.
- Start with the least restrictive useful default.
- Show an explicit Apply action when several controls should change results together.
- Use immediate filtering only when updates are fast, predictable, and announced without disrupting input.
- Display dates, values, and selected options in the same language used by result content.

## Accessibility

- Use `type="search"` for the query and visible labels for every control.
- Group related criteria in a `fieldset` when their relationship needs explanation.
- Announce result-count changes through one polite live region.
- Keep keyboard focus on the submitted control; do not move it to refreshed results automatically.
- When results update asynchronously, apply `aria-busy="true"` to the result region until rendering completes.
- Provide a visible no-results heading and a keyboard-reachable reset action.

## Acceptance criteria

- The native form submits useful URL parameters without JavaScript.
- Query, filters, count, active criteria, reset, and no-results behavior remain synchronized.
- Pagination and sorting can preserve the current criteria.
- Compact layout stacks controls without horizontal overflow.
- Result rows separate identity, category, and status into scannable regions.
- Result updates do not steal focus.
- Empty-result recovery is immediate and explicit.
