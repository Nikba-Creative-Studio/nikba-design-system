# Data Table

## Purpose

Call `initDataTables()` on a composition marked `data-nds-data-table`. A native table, labeled `data-search` input, `data-previous` and `data-next` buttons and live status are required. `data-page-size` defaults to five. Filtering resets pagination; sorting applies before pagination. Native table headers and captions remain intact. Use server pagination for large datasets. Cleanup restores every row.

## Selection and bulk actions

Optional `data-page-select` controls current-page checkboxes marked `data-row-select`. Selection persists across filtering and pagination. `data-bulk-action="archive"` emits `nds:data-table-action` with `detail.action` and `detail.values`; the application owns persistence and confirmation. A `data-empty` region appears when no rows match.
