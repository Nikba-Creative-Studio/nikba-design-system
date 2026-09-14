# Disclosure and Accordion

## Purpose

Disclosure lets a user reveal or hide supporting content. Accordion groups related disclosures when scanning concise headings is more useful than showing every section at once.

Use ordinary headings and visible content when the information is essential or short. Do not hide critical errors, primary actions, or information users need to compare simultaneously.

## Public API

| API | Purpose |
| --- | --- |
| `.nds-disclosure` | Styles a native `<details>` disclosure |
| `.nds-disclosure--contained` | Adds a self-contained surface and boundary |
| `.nds-disclosure--compact` | Reduces the summary and content spacing |
| `.nds-disclosure__summary` | Styles the native `<summary>` trigger |
| `.nds-disclosure__heading` | Groups the label and optional description |
| `.nds-disclosure__description` | Adds concise supporting text to the trigger |
| `.nds-disclosure__content` | Contains the revealed content |
| `.nds-accordion` | Groups adjacent disclosures |
| `.nds-accordion--separated` | Adds space and individual boundaries between items |
| `data-nds-accordion="single"` | Enables the optional single-open behavior |
| `initAccordions(root?)` | Initializes single-open groups and returns a cleanup function |
| `nds:accordion-change` | Event dispatched by a single-open group after an item opens |

## Native behavior

The component uses `<details>` and `<summary>`. The browser provides expanded-state semantics, Enter and Space activation, focus behavior, and usable no-JavaScript disclosure.

Multiple-open Accordion needs no JavaScript. Add `data-nds-accordion="single"` and call `initAccordions()` when opening one item should close its siblings.

## JavaScript lifecycle

`initAccordions(root)` searches the supplied Document or Element for single-open groups, attaches one Toggle listener to each direct Disclosure child, and skips groups that are already initialized. It returns a cleanup function that removes only the listeners added by that call.

Call the initializer after inserting a new group through a client-side render. Call its cleanup function before permanently removing or replacing the initialized region.

The `nds:accordion-change` event bubbles from the Accordion and exposes the newly opened `<details>` element as `event.detail.openItem`.

## Accessibility and keyboard behavior

Use a native `<summary>` as the first child of every `<details>`. Do not add a nested Button or Link inside Summary. The entire Summary is the interactive trigger.

The browser supports Tab to focus Summary and Enter or Space to toggle it. Focus remains on the same Summary when content opens or closes. Arrow-key navigation is not added because native Disclosure does not define it and each Summary remains in the ordinary tab order.

Heading text should describe the hidden content. Descriptions remain concise so the trigger does not become difficult to scan. Do not duplicate expanded state with custom ARIA; `<details>` already exposes it.

## Examples

Standalone Disclosure:

```html
<details class="nds-disclosure nds-disclosure--contained">
  <summary class="nds-disclosure__summary">
    <span class="nds-disclosure__heading">What is included?</span>
  </summary>
  <div class="nds-disclosure__content">
    Tokens, components, documentation, and integration guidance.
  </div>
</details>
```

Single-open Accordion:

```html
<div class="nds-accordion" data-nds-accordion="single">
  <details class="nds-disclosure" open>
    <summary class="nds-disclosure__summary">
      <span class="nds-disclosure__heading">Foundations</span>
    </summary>
    <div class="nds-disclosure__content">Tokens, type, color, and layout.</div>
  </details>
  <details class="nds-disclosure">
    <summary class="nds-disclosure__summary">
      <span class="nds-disclosure__heading">Components</span>
    </summary>
    <div class="nds-disclosure__content">Reusable interface controls and content primitives.</div>
  </details>
</div>

<script type="module">
  import { initAccordions } from '@nikba/design-system';
  const cleanup = initAccordions();
</script>
```

## Acceptance criteria

- Content remains operable without JavaScript.
- Summary exposes native expanded and collapsed semantics.
- Tab reaches every Summary in document order.
- Enter and Space toggle the focused Summary.
- Focus remains stable when an item opens or closes.
- Multiple-open groups allow independent expanded states.
- Single-open groups close only their direct Disclosure siblings.
- Nested disclosures do not close items in a parent or child group.
- Repeated initialization does not duplicate listeners.
- Cleanup removes the behavior attached by its initializer call.
- Long labels and descriptions wrap without colliding with the indicator.
- Focus and boundaries remain visible in every theme and forced-colors mode.
