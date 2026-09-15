# Header and Responsive Navigation

## Status

Complete for the current alpha scope.

## Purpose

Header establishes a stable product landmark for brand identity, primary navigation, and a small set of global actions. Responsive Navigation collapses links behind an explicit Menu control on narrow viewports while retaining a readable no-JavaScript fallback.

## Public API

- `.nds-header`: header surface.
- `.nds-header--sticky`: sticks the landmark to the viewport start.
- `.nds-header--glass`: uses the active glass tokens.
- `.nds-header__inner`: Container-aligned three-zone layout with centered Navigation.
- `.nds-header__brand`, `__brand-mark`: brand link and optional mark.
- `.nds-header__nav`, `__list`, `__link`: navigation structure.
- `.nds-header__actions`: global action group.
- `.nds-header__menu-trigger`: compact-navigation control.
- `data-nds-navigation`: marks the collapsible `nav`.
- `data-nds-navigation-trigger`: marks its control.

## Structure

```html
<header class="nds-header">
  <div class="nds-header__inner nds-container">
    <a class="nds-header__brand" href="/">Nikba</a>
    <button
      class="nds-header__menu-trigger"
      type="button"
      aria-label="Open navigation"
      aria-controls="primary-navigation"
      data-nds-navigation-trigger
    >…</button>
    <nav class="nds-header__nav" id="primary-navigation" aria-label="Primary" data-nds-navigation>
      <ul class="nds-header__list">
        <li><a class="nds-header__link" href="/projects" aria-current="page">Projects</a></li>
        <li><a class="nds-header__link" href="/team">Team</a></li>
      </ul>
    </nav>
  </div>
</header>
```

Call `initNavigations()` after markup exists. The initializer is idempotent and returns cleanup.

## Behavior

- The Menu control toggles compact Navigation and maintains `aria-expanded`.
- Escape closes compact Navigation and restores focus to its trigger.
- Selecting a navigation link closes the compact panel.
- A pointer action outside the Header closes an open panel.
- Crossing into the desktop breakpoint closes stale compact state.
- The outside-action listener exists only while the compact panel is open.
- Changes emit `nds:navigation-change` with `{ open }`.
- Without JavaScript, Navigation remains visible and wraps below the brand on narrow screens.

The desktop inner layout uses equal flexible side columns around Navigation. Brand stays aligned to the start, Navigation remains centered, and global actions align to the end even when their widths differ. Compact layout keeps brand, global actions, and Menu control on one balanced row while space permits, then moves actions below at the smallest supported width.

## Content guidance

- Keep the primary link set short and stable.
- Use nouns for destinations and reserve buttons for actions.
- Show one current destination with `aria-current="page"`.
- Place account-specific and secondary actions after the main Navigation.
- Keep the brand link pointed at the product's top-level destination.

## Accessibility

- Use a semantic `header` and a labelled `nav` landmark.
- Give the compact trigger an accessible name that describes the Navigation control.
- Do not duplicate the word “navigation” in every link label.
- Preserve visible focus and a minimum control height at every breakpoint.
- If multiple navigation landmarks exist, give each a distinct `aria-label`.

## Acceptance criteria

- Header content aligns to the shared Container.
- Desktop links and actions remain visible without a disclosure step.
- Compact Navigation opens, closes, and reports expanded state deterministically.
- Escape and outside action dismiss correctly.
- No-JavaScript content remains reachable.
- Sticky and glass variants use public tokens.
- Initialization, cleanup, and focus restoration are covered by behavior tests.
