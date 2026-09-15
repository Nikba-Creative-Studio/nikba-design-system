# Browser, Performance, and Support Policy

Status: Alpha contract

## Browser coverage

Nikba Design System supports the latest two stable major releases of Chrome, Edge, Firefox, and Safari, plus the corresponding current Chrome for Android and Safari for iOS releases. JavaScript is shipped as an ES module and requires `WeakMap`, `CustomEvent`, `MutationObserver`, and standard DOM APIs.

The system uses native Dialog and Popover APIs, `color-mix()`, `:has()`, `backdrop-filter`, and `:focus-visible`. Unsupported visual enhancements may fall back to solid surfaces or simpler state styling. Components whose behavior depends on a missing platform API must not be initialized in that browser; applications targeting older browsers own an explicit polyfill and its testing.

CI exercises representative navigation, Tabs, Dialog, and Select behavior in Chromium, Firefox, and WebKit. Chrome also runs approved visual snapshots at desktop and compact viewports. Edge and mobile platform releases remain covered through their corresponding browser engines and responsive layouts; manual assistive-technology verification is still required before `1.0.0`.

## Bundle budgets

Budgets apply to the minified library artifacts produced by `npm run build:library`:

| Artifact | Gzip budget | Current purpose |
| --- | ---: | --- |
| CSS | 20 KiB | Foundations, components, patterns, themes |
| JavaScript | 12 KiB | Optional initializers and lifecycle utilities |
| Combined raw output | 140 KiB | Review guard for uncompressed growth |

The JavaScript bundle has no framework dependency. Applications import only the initializers they use so their bundler can remove unused exports. The CSS package intentionally ships as one stable entry while the component contract remains in alpha.

## Runtime performance

- Fonts are consumer-owned and the CSS bundle performs no network request.
- Glass blur is progressive, theme-controlled, and absent at Glass Off.
- Motion respects `prefers-reduced-motion`.
- Dynamic DOM observation is opt-in through `observeComponents()` and observes only child-list changes.
- Compact controls retain desktop density and expand to a 44px minimum interactive target when the primary pointer is coarse.
- Toast queues are bounded; overlay and navigation listeners are installed only for initialized instances and removed by cleanup.
- Catalog effects and examples are not part of the published runtime bundle.
- Product-owned Three.js scenes stay outside the core package, load after primary content, pause outside the viewport, cap rendering work for compact devices, and retain a static fallback.

Run `npm run test:budgets` after a library build. A budget increase requires a changelog entry that names the user-facing capability responsible for the growth.

Representative Overview, Form, and Destructive Confirmation pages have approved desktop and compact visual baselines. CI compares a sampled pixel grid with a mean channel-difference limit of 10 and permits at most six sampled channels to differ by more than 24 points. Raw screenshots remain available as artifacts for human review.
