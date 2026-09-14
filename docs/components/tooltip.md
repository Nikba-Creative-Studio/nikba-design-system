# Tooltip

## Status

Complete for the current alpha scope.

## Purpose

Tooltip supplies a concise label or short explanation for one control. It appears from pointer hover or keyboard focus, never receives focus itself, and does not contain interactive content.

## Public API

- `.nds-tooltip`: fixed, non-interactive Tooltip surface.
- `data-nds-tooltip`: marks the Tooltip for initialization.
- `data-nds-tooltip-trigger="id"`: connects a trigger to a Tooltip ID.
- `data-tooltip-delay="milliseconds"`: changes the default 300 millisecond show delay for a trigger.
- `data-placement="bottom"`: prefers placement below the trigger. Top is the default.
- `data-resolved-placement`: read-only placement state set by the initializer.

## Structure

```html
<button
  type="button"
  aria-label="Copy link"
  data-nds-tooltip-trigger="copy-tooltip"
>
  …
</button>
<span class="nds-tooltip" id="copy-tooltip" role="tooltip" data-nds-tooltip hidden>
  Copy link
</span>
```

Call `initTooltips()` after markup exists. The initializer accepts a Document or Element, skips initialized Tooltips, and returns cleanup.

## Behavior

- Pointer enter and focus start the show delay.
- Pointer leave and focus out hide the Tooltip when neither input remains active.
- Escape dismisses a visible Tooltip without moving focus.
- The Tooltip follows viewport resize and ancestor scrolling while visible.
- Placement flips when the preferred side lacks space and remains inside an eight-pixel viewport margin.
- The initializer appends the Tooltip ID to the trigger's existing `aria-describedby` value and restores the original value during cleanup.
- Showing emits `nds:tooltip-show`; hiding emits `nds:tooltip-hide`. Both include `{ trigger }`.

## Content guidance

- Keep text to a short phrase or one compact sentence.
- Use a Tooltip to clarify an unfamiliar icon or add secondary context.
- Keep essential instructions, errors, and state visible in the page.
- Do not repeat visible button text without adding useful information.
- Do not place links, buttons, forms, or rich content inside a Tooltip.

## Accessibility

- Use `role="tooltip"` on the surface.
- Keep the Tooltip connected with `aria-describedby`; an icon-only trigger still needs its own `aria-label`.
- The same information must be available to pointer and keyboard users.
- A Tooltip does not open on touch activation. Touch interfaces need a visible label or another persistent pattern.
- The Tooltip never enters the tab order and has `pointer-events: none`.

## Acceptance criteria

- Pointer hover and keyboard focus expose the same description.
- Escape, pointer leave, and focus out dismiss predictably.
- Rapid enter and leave cancels the pending show.
- Placement remains inside narrow and short viewports.
- Existing accessible descriptions survive initialization and cleanup.
- Reduced-motion mode removes entrance animation.
- Initialization and cleanup are deterministic and covered by behavior tests.
