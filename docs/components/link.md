# Link

## Purpose

Link navigates to another location, document, or resource. Its label describes the destination so a user can predict the result before activation.

Use Button for an immediate interface action such as saving, opening a control, or changing application state. A prominent navigation link may use Button styling while retaining native anchor semantics.

## Anatomy

1. Native `<a>` element with an `href`
2. Destination label
3. Optional leading or trailing icon
4. Optional visually hidden context for behavior such as opening a new tab

## Public API

| API | Purpose |
| --- | --- |
| `.nds-link` | Required base class with the default inline appearance |
| `.nds-link--subtle` | Reduces emphasis for supporting navigation |
| `.nds-link--standalone` | Creates a self-contained link with no resting underline |
| `.nds-link--inverse` | Provides readable link color on the accent surface |
| `.nds-link__icon` | Aligns and animates a decorative or informative icon |
| `aria-current` | Identifies the current item in a navigation set |
| `aria-disabled="true"` | Communicates an unavailable destination when removal is not appropriate |

## Variants

| Variant | Use when |
| --- | --- |
| Default | The link appears inside body copy or a dense content region |
| Subtle | Supporting navigation needs less visual emphasis than surrounding content |
| Standalone | The link sits outside a sentence and needs a clear independent hit area |
| Inverse | The link appears on the accent surface |

Do not remove the underline from links inside continuous text. Color alone is insufficient to distinguish a link from surrounding copy.

## States

| State | Visual | Behavior |
| --- | --- | --- |
| Default | Underline or standalone label | Ready for navigation |
| Hover | Stronger underline or icon movement | Applied only on hover-capable devices |
| Active | Reduced opacity | Confirms activation |
| Focus-visible | Shared 3px focus ring | Visible for keyboard navigation |
| Current | Stronger weight and underline | Requires a valid `aria-current` value |
| Disabled | Reduced opacity and unavailable cursor | Removed from sequential focus and blocked by application logic |

## Accessibility

- Use a native `<a href>` for navigation. An anchor without `href` is not a replacement for Button.
- Write a label that identifies the destination. Avoid vague copy such as “Click here” or “Learn more” without context.
- Use `aria-current="page"` for the current page or the value that matches the navigation relationship.
- Keep focus visible in every theme and in forced-colors mode.
- When `target="_blank"` is necessary, tell the user that the destination opens in a new tab. Add `rel="noreferrer"` when the referrer is unnecessary.
- Prefer removing an unavailable link. If it must remain visible, use `aria-disabled="true"`, `tabindex="-1"`, and application logic that prevents pointer and programmatic activation.
- Decorative icons use `aria-hidden="true"`. An icon must not be the only source of the accessible name.

## Content guidance

Name the destination with concise, specific language: “Foundation reference,” “Account settings,” or “Download annual report.” Keep the most meaningful words near the beginning. Links may wrap naturally inside paragraphs; standalone links should remain concise.

Use a directional arrow for navigation within the same experience and an external-link icon for a different site or browsing context. Do not add an icon when it does not clarify behavior.

## Examples

Inline link:

```html
<p>
  Read the
  <a class="nds-link" href="/foundations">foundation reference</a>
  before creating a component.
</p>
```

Standalone link with a decorative icon:

```html
<a class="nds-link nds-link--standalone" href="/components">
  Browse components
  <span class="nds-link__icon" aria-hidden="true">
    <svg viewBox="0 0 16 16">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  </span>
</a>
```

Current page:

```html
<a class="nds-link" href="/components/link" aria-current="page">Link</a>
```

External destination:

```html
<a
  class="nds-link nds-link--standalone"
  href="https://example.com"
  target="_blank"
  rel="noreferrer"
>
  External resource
  <span class="nds-link__icon" aria-hidden="true">
    <svg viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  </span>
  <span class="nds-visually-hidden"> (opens in a new tab)</span>
</a>
```

## Acceptance criteria

- Every variant remains identifiable in Frost, Mist, and Graphite.
- Inline links remain distinguishable without relying on color alone.
- Link text and icons stay aligned when content wraps or text size increases.
- Current navigation exposes `aria-current` programmatically.
- Disabled links leave the sequential focus order and cannot activate.
- Focus remains visible in standard and forced-colors modes.
- Hover-only motion does not affect touch interaction.
- External browsing-context changes are announced in accessible text.
