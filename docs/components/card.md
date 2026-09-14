# Card

## Purpose

Card groups related content and actions into a clear surface. It provides layout and visual treatment without imposing document semantics.

Use Card when the content forms one understandable unit. Avoid wrapping unrelated controls or entire page regions in Cards only for decoration.

## Semantics

Choose the root element from the content:

- Use `article` for self-contained content that can stand on its own.
- Use `section` when the Card is a named region within a larger document.
- Use `aside` for complementary content.
- Use `a` when the entire Card opens one destination.
- Use `div` when no stronger semantic element applies.

Do not add a generic ARIA role to a noninteractive Card.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-card` | Base surface and vertical composition |
| `.nds-card--compact` | Uses 24px padding for denser layouts |
| `.nds-card--large` | Uses responsive 32–64px padding |
| `.nds-card--flat` | Removes the default surface shadow |
| `.nds-card--elevated` | Applies raised elevation |
| `.nds-card--interactive` | Adds Link or Button hover and focus treatment |
| `.nds-card--horizontal` | Places Media beside Content on larger screens |
| `.nds-card__header` | Groups Eyebrow and Title |
| `.nds-card__body` | Groups primary content |
| `.nds-card__content` | Wraps all textual slots in Horizontal Card |
| `.nds-card__eyebrow` | Optional category or context |
| `.nds-card__title` | Card heading |
| `.nds-card__description` | Supporting summary |
| `.nds-card__media` | Crops an Image or Video to its region |
| `.nds-card__footer` | Aligns metadata and actions |
| `.nds-card__meta` | Styles supporting metadata |

## Variants

Flat Card creates a quiet grouping inside an existing region. Default Card is the standard independent surface. Elevated Card signals temporary or contextual prominence and should remain uncommon.

Interactive Card is a native Link or Button whose complete surface is one target. It moves up by 3px on hover and receives the shared focus ring. Do not apply the interactive modifier to a static container.

Horizontal Card expects Media followed by Content. It becomes a single-column layout below the mobile breakpoint without changing DOM or reading order.

## Accessibility

- Choose a semantic root element based on the Card content.
- Give each Article or Section a heading when it needs an accessible name.
- Preserve logical heading levels within the surrounding page.
- Add `.nds-card--interactive` only to a native `a` or `button` element.
- A linked Card must have one destination and no nested links, buttons, or form controls.
- Write Link text or Card content that describes the destination without relying on the arrow icon.
- Give informative Images useful alternative text. Use empty alternative text for decorative Images.
- Keep focus and boundaries visible in every theme and forced-colors mode.

## Content guidance

Use one concise Title, an optional Eyebrow for category, and a Description that explains the content rather than repeating the Title. Keep metadata secondary. Limit Footer actions so the main purpose remains obvious.

## Example

```html
<article class="nds-card">
  <header class="nds-card__header">
    <p class="nds-card__eyebrow">Project update</p>
    <h3 class="nds-card__title">Brand platform is ready for review</h3>
  </header>
  <div class="nds-card__body">
    <p class="nds-card__description">
      The core direction and component inventory are ready for the team.
    </p>
  </div>
  <footer class="nds-card__footer">
    <span class="nds-card__meta">Updated 12 minutes ago</span>
  </footer>
</article>
```

Interactive Card:

```html
<a class="nds-card nds-card--interactive" href="/case-studies/foundation">
  <header class="nds-card__header">
    <p class="nds-card__eyebrow">Case study</p>
    <h3 class="nds-card__title">Product foundation</h3>
  </header>
  <p class="nds-card__description">
    Read how a shared system shortened delivery cycles.
  </p>
</a>
```

## Acceptance criteria

- Card supports semantic Article, Section, Aside, Link, Button, and generic containers.
- Compact, Default, and Large density variants retain consistent internal rhythm.
- Flat, Surface, and Elevated treatments remain distinct in every theme.
- Interactive Card has visible hover, focus-visible, and active behavior.
- A linked Card contains no nested interactive elements.
- Media preserves cropping without stretching its asset.
- Horizontal Card stacks in the same reading order below the mobile breakpoint.
- Content wraps without overflow at 320px viewport width.
- Motion follows the shared reduced-motion foundation.
- Boundaries and focus remain visible in forced-colors mode.
