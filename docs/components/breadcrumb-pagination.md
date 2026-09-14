# Breadcrumb and Pagination

## Status

Complete for the current alpha scope.

## Purpose

Breadcrumb communicates a page's position in a hierarchy. Pagination moves between stable pages in an ordered result set. Both are navigation landmarks built from links and require no JavaScript behavior.

## Breadcrumb API

- `.nds-breadcrumb`: labelled navigation landmark.
- `.nds-breadcrumb__list`: ordered hierarchy.
- `.nds-breadcrumb__item`: one hierarchy level.
- `.nds-breadcrumb__item--optional`: intermediate level hidden at the compact breakpoint.
- `.nds-breadcrumb__link`: linked ancestor.
- `.nds-breadcrumb__current`: current page text.
- `.nds-breadcrumb__ellipsis`: visible collapsed-level marker.

```html
<nav class="nds-breadcrumb" aria-label="Breadcrumb">
  <ol class="nds-breadcrumb__list">
    <li class="nds-breadcrumb__item"><a class="nds-breadcrumb__link" href="/">Home</a></li>
    <li class="nds-breadcrumb__item"><span class="nds-breadcrumb__current" aria-current="page">Projects</span></li>
  </ol>
</nav>
```

Use an ordered list because the sequence communicates hierarchy. The current page is plain text with `aria-current="page"` and does not link to itself.

## Pagination API

- `.nds-pagination`: labelled navigation landmark layout.
- `.nds-pagination--compact`: previous, summary, and next composition.
- `.nds-pagination__list`: pagination item list.
- `.nds-pagination__link`: page, previous, or next link.
- `.nds-pagination__page--optional`: page link hidden at the compact breakpoint.
- `.nds-pagination__ellipsis`: omitted page range.
- `.nds-pagination__summary`: current result or page range.

```html
<nav class="nds-pagination" aria-label="Pagination">
  <p class="nds-pagination__summary">Page 2 of 12</p>
  <ol class="nds-pagination__list">
    <li><a class="nds-pagination__link" href="?page=1">Previous</a></li>
    <li><a class="nds-pagination__link" href="?page=2" aria-current="page">2</a></li>
    <li><a class="nds-pagination__link" href="?page=3">Next</a></li>
  </ol>
</nav>
```

## Behavior

- Links preserve browser navigation, history, open-in-new-tab, and copy-link behavior.
- Current-page state uses `aria-current="page"`.
- An unavailable previous or next control uses `aria-disabled="true"`, removes `href`, and has `tabindex="-1"`.
- Optional intermediate Breadcrumb items and optional page numbers can hide at narrow widths while the first, current, previous, and next context remains.
- Ellipses are text, never controls.

## Content guidance

- Start Breadcrumb at the highest useful product level rather than repeating every site level.
- Use the destination's actual page title for each item.
- Keep page labels numeric and provide descriptive accessible labels such as “Page 4”.
- Use Pagination for known, addressable pages. Use a load-more action for incremental content without stable page URLs.
- Preserve active filters and sorting parameters in every Pagination URL.

## Accessibility

- Give each landmark a specific `aria-label` when multiple navigation regions exist.
- Add visually hidden context to icon-only Previous and Next controls.
- Do not make ellipses focusable.
- Do not communicate current page through color alone.
- Keep at least Previous, current-page summary, and Next available in compact layouts.

## Acceptance criteria

- Both patterns work without JavaScript.
- Hierarchy and page sequence use ordered lists.
- Current and disabled states expose correct semantics.
- Long labels truncate without causing page overflow.
- Compact layouts preserve essential location and movement.
- Focus appearance and control targets meet the shared foundation contract.
