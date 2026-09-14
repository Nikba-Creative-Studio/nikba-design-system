# Skeleton

## Purpose

Skeleton preserves the expected layout while content is loading. It reduces layout shift and helps users understand the shape of content that will appear.

Use Spinner when the work cannot be represented by meaningful placeholder shapes. Use determinate progress when completion can be measured. Do not show Skeleton for an action that completes immediately.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-skeleton` | Required base class and default rectangular placeholder |
| `.nds-skeleton--text` | Text-line placeholder with a compact height |
| `.nds-skeleton--heading` | Heading placeholder with greater height |
| `.nds-skeleton--avatar` | Fixed 48px circular identity placeholder |
| `.nds-skeleton--square` | Fixed 48px rounded-square placeholder |
| `.nds-skeleton--media` | Responsive 16:9 media placeholder |
| `.nds-skeleton--button` | Medium-height pill-shaped control placeholder |
| `.nds-skeleton--static` | Disables shimmer for a deliberately static state |
| `.nds-skeleton-stack` | Vertically spaces related Skeleton elements |
| `--nds-skeleton-width` | Overrides the inline size of one placeholder |
| `--nds-skeleton-height` | Overrides the block size of one placeholder |

## Composition

Match the eventual layout instead of drawing a generic loading card. Use the same container, spacing, and approximate dimensions as the resolved content.

Vary text-line widths so the group resembles natural copy. Keep the final line shorter than the others. Avoid rendering every possible detail; represent enough structure to prevent a surprising layout change.

## Accessibility

Skeleton shapes are decorative and use `aria-hidden="true"`. Set `aria-busy="true"` on the region whose content is loading and provide a concise Status message through visually hidden text.

Do not expose every shape as a progress control. Repeated announcements create noise and do not communicate additional progress. Remove Skeleton, clear the busy state, and update the region when content arrives.

Do not move focus when Skeleton appears or resolves. Preserve the focused control when a background region updates.

## Motion

The default shimmer communicates ongoing activity. The shared reduced-motion foundation limits it to a single near-instant iteration, leaving a visible static placeholder.

Use `.nds-skeleton--static` when movement would distract from an active task or when the placeholder represents a paused state.

## Examples

Text block:

```html
<div aria-busy="true">
  <span class="nds-visually-hidden" role="status">Loading article…</span>
  <div class="nds-skeleton-stack" aria-hidden="true">
    <span class="nds-skeleton nds-skeleton--heading" style="--nds-skeleton-width: 62%"></span>
    <span class="nds-skeleton nds-skeleton--text"></span>
    <span class="nds-skeleton nds-skeleton--text" style="--nds-skeleton-width: 78%"></span>
  </div>
</div>
```

Profile row:

```html
<div aria-busy="true">
  <span class="nds-visually-hidden" role="status">Loading profile…</span>
  <div aria-hidden="true">
    <span class="nds-skeleton nds-skeleton--avatar"></span>
    <div class="nds-skeleton-stack">
      <span class="nds-skeleton nds-skeleton--text" style="--nds-skeleton-width: 9rem"></span>
      <span class="nds-skeleton nds-skeleton--text" style="--nds-skeleton-width: 6rem"></span>
    </div>
  </div>
</div>
```

## Acceptance criteria

- Placeholder geometry closely matches the resolved content layout.
- Skeleton shapes remain hidden from the accessibility tree.
- The affected region exposes and clears `aria-busy` with its actual lifecycle.
- One concise Status message communicates what is loading.
- Text, heading, avatar, square, media, and button variants remain visible in every theme.
- Custom width and height properties cannot exceed their container unexpectedly.
- Shimmer does not cause layout, paint, or horizontal overflow.
- Reduced-motion users receive a static placeholder.
- Forced-colors mode preserves the placeholder boundary.
- Focus remains stable when loaded content replaces Skeleton.
