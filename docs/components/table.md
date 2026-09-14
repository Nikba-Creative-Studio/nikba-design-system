# Table

## Status

Complete for the current alpha scope.

## Purpose

Table presents comparable, structured data. The public pattern keeps native table semantics, contains horizontal overflow, supports optional sorting and row selection, and documents compact, comfortable, sticky, numeric, and empty states.

## Public API

- `.nds-table-scroll`: bordered horizontal-overflow container.
- `.nds-table`: base semantic Table.
- `.nds-table--compact`, `--comfortable`: density variants.
- `.nds-table--sticky`: sticky header inside a height-constrained overflow region.
- `.nds-table__numeric`: end-aligned tabular number cell.
- `.nds-table__selection`: narrow selection column.
- `.nds-table__cell-title`, `__cell-description`: primary and secondary cell content.
- `.nds-table__sort`: sortable column control.
- `.nds-table__empty`: full-width empty row.
- `data-nds-table`: marks an interactive Table.
- `data-nds-sort="column"`: sort control and cell-key connection.
- `data-sort-type="number"`: numeric comparison.
- `data-column="column"`, `data-sort-value`: cell sort data.
- `data-nds-select-all`, `data-nds-select-row`: selection controls.

## Sorting

Place a Button inside its column header, initialize the header with `aria-sort="none"`, and give matching cells a `data-column` value. The initializer alternates ascending and descending order, resets other headers to `none`, and reorders native rows.

Sorting emits `nds:table-sort` with `{ key, direction }`.

## Selection

Use native Checkbox controls with accessible labels. The header Checkbox selects enabled rows and reflects checked or indeterminate aggregate state. Selected rows receive `data-selected="true"`.

Selection emits `nds:table-selection-change` with `{ selected, allSelected }`, where `selected` contains the checked row controls.

## Structure

```html
<div class="nds-table-scroll">
  <table class="nds-table" data-nds-table>
    <caption>Project access</caption>
    <thead>
      <tr>
        <th aria-sort="none">
          <button class="nds-table__sort" type="button" data-nds-sort="name">Name</button>
        </th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-column="name">Atlas</td>
        <td>Active</td>
      </tr>
    </tbody>
  </table>
</div>
```

Call `initTables()` after the rows exist. For a replaced or expanded `tbody`, call cleanup and initialize the updated Table again.

## Responsive guidance

- Preserve columns that people need to compare; contain overflow instead of converting every table into unrelated cards.
- Place row identity in the first data column so it remains understandable while scrolling.
- Hide low-priority columns only when their information remains available elsewhere.
- Add a visible cue when an application needs to teach horizontal scrolling.
- Keep actions in a final column and label icon-only actions for each row.

## Content guidance

- Use short, descriptive column headers.
- Align numbers at the end and use tabular numerals.
- Put units in the header when every row shares them.
- Use an empty row that spans every column and explains the next useful action.
- Do not use a Table for unrelated label-value pairs; use a description list.

## Accessibility

- Use native `table`, `caption`, `thead`, `tbody`, `th`, and `td` elements.
- Add `scope="col"` to column headers and `scope="row"` to row headers.
- Keep sort state on the `th`, not the Button.
- Label each row-selection Checkbox with its row identity.
- Do not make an entire row clickable when it contains independent controls.

## Acceptance criteria

- Native relationships remain available to assistive technology.
- Sorting alternates direction and updates `aria-sort`.
- Selection synchronizes header, row, and indeterminate states.
- Disabled selection controls remain unchanged by Select all.
- Horizontal overflow stays inside the Table container.
- Density, sticky-header, numeric, descriptive-cell, selected, hover, and empty states use public tokens.
- Behavior initialization and cleanup are deterministic and tested.
