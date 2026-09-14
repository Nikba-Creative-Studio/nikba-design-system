# Avatar

## Purpose

Avatar represents a person, team, or organization through an Image, initials, or a stable fallback. It supports recognition and should usually appear beside a visible name.

## Anatomy

1. Visual container
2. Image, initials, or generic icon
3. Optional Presence indicator

Interactive Avatar adds a separate native Button wrapper and keeps the visual Avatar decorative inside it.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-avatar` | Base 40px Avatar container |
| `.nds-avatar--small` | Uses a 32px Avatar |
| `.nds-avatar--large` | Uses a 48px Avatar |
| `.nds-avatar--xlarge` | Uses a 64px Avatar |
| `.nds-avatar--square` | Uses rounded-square geometry for teams or organizations |
| `.nds-avatar__visual` | Clips and styles visual content |
| `.nds-avatar__image` | Crops an Image without stretching |
| `.nds-avatar__icon` | Styles the generic fallback icon |
| `.nds-avatar__status` | Places a Presence indicator |
| `.nds-avatar__status--online` | Uses Success color |
| `.nds-avatar__status--away` | Uses Warning color |
| `.nds-avatar__status--busy` | Uses Danger color |
| `.nds-avatar__status--offline` | Uses tertiary neutral color |
| `.nds-avatar-group` | Overlaps a short set of Avatars |
| `.nds-avatar--overflow` | Displays the remaining member count |
| `.nds-avatar-button` | Provides a 44px native Button target and focus treatment |

## Images and fallbacks

Use a clear, current Image when available. Crop with `object-fit: cover`; do not stretch the asset.

When no Image exists, derive one or two initials from the stable display name. Avoid changing initials based on locale-specific word order without a product rule. Use the generic icon only when no usable identity information exists.

Square Avatar may represent a team or organization. Keep people circular within the same interface.

## Accessible names

When a visible name sits beside the Avatar, mark the Avatar `aria-hidden="true"` and use an empty Image alternative. This prevents duplicate announcements.

When Avatar is the only identity content, give the root `role="img"` and an `aria-label` containing the display name. Keep the nested Image alternative empty so the identity is announced once.

When Avatar triggers an action, wrap it in `.nds-avatar-button`. Name the Button for the action, such as “Open Maya Chen account menu,” and hide the nested visual Avatar from assistive technology.

## Presence

Presence is secondary status information. Pair its color with visible status text such as “Online” or “Do not disturb.” Keep the visual dot `aria-hidden="true"`; the nearby text communicates the status.

## Avatar Group

Avatar Group overlaps a short set of recognizable members. Show no more than four visible Avatars when space is constrained, then use Overflow Avatar for the remaining count.

Give the group an accessible label containing visible member names and the remaining count, or connect it to a complete visible member list. Individual decorative Avatars inside a named group can be hidden from assistive technology.

## Examples

Avatar beside a visible name:

```html
<span class="nds-avatar" aria-hidden="true">
  <span class="nds-avatar__visual">
    <img class="nds-avatar__image" src="maya.jpg" alt="" />
  </span>
</span>
<span>Maya Chen</span>
```

Initials-only Avatar:

```html
<span class="nds-avatar" role="img" aria-label="Maya Chen">
  <span class="nds-avatar__visual">MC</span>
</span>
```

Interactive Avatar:

```html
<button
  class="nds-avatar-button"
  type="button"
  aria-label="Open Maya Chen account menu"
>
  <span class="nds-avatar" aria-hidden="true">
    <span class="nds-avatar__visual">MC</span>
  </span>
</button>
```

## Acceptance criteria

- Small, Medium, Large, and Extra Large preserve content proportions.
- Images crop without stretching or layout shift.
- Initials and generic fallback remain centered in every size.
- Avatar next to a visible name does not create duplicate announcements.
- Standalone Avatar exposes one accessible identity name.
- Presence always has a visible text equivalent.
- Avatar Group communicates visible members and the remaining count.
- Avatar Button has a descriptive action name, visible focus, and a minimum 44px target.
- Shapes, status boundaries, and focus remain visible in forced-colors mode.
