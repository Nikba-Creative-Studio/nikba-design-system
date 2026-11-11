# Native foundations and components — pilot

Nikba shares design values across web, SwiftUI and Jetpack Compose. Five native components are available as a pilot: iOS supports a version-pinned Swift package with bundled Onest, and Android supports source distribution. Native APIs are experimental and are not covered by the stable web API guarantee. The first consumer is localhost.md.

## Preferred iOS installation

Add `https://github.com/Nikba-Creative-Studio/nikba-design-system.git` in Xcode with Exact Version **1.1.0** and link the **NikbaDesignSystem** product. For local development, add the root `Package.swift` directory as a local dependency. Import `NikbaDesignSystem` alongside SwiftUI. `NDSTypography.font` registers the bundled Onest font automatically; `NDSFonts.register()` is also available. The included OFL license and provenance accompany the font asset.

The `v1.1.0` release tag contains the published native pilot. Native APIs remain experimental; the older web-only `v1.0.0` tag does not contain this package. See [Build an iOS app](./IOS.md) for the full startup path. MCP's `get_installation({platform: "ios"})` returns the remote package URL, exact version, local package path and pilot status.

## Source and generated artifacts

Edit `src/tokens/foundations.json`, then run:

```sh
npm run tokens:generate
npm run tokens:check
npm run test:tokens
```

The generator writes the three existing CSS token files and two portable source files:

- `native/ios/NikbaTokens.swift` — SwiftUI/UIKit, iOS 17+, Swift 6. Add to the application target.
- `native/android/NikbaTokens.kt` — package `com.nikba.designsystem`; add to an Android source set with Compose UI.

The native files ship in the npm archive. They introduce no package dependencies beyond the consuming apps' existing UI frameworks. Generated files should be committed and never edited manually. `npm test` checks for drift.

For source-copy integration, add `NikbaComponents.swift` or `NikbaComponents.kt` alongside the matching token file. Components are handwritten source, separate from generated foundations. Compose consumers need Material 3, Foundation and tooling-preview. Source-copy consumers own font resources; automatic font registration is provided by the Swift package. Components follow system Frost/Graphite appearance. Mist is available through raw palette tokens rather than a component theme override.

Copy or update the artifacts in an existing consumer directory:

```sh
npm run native:sync -- --ios-output /absolute/path/to/ios/sources --android-output /absolute/path/to/android/sources
```

Add `--check` to verify that all four consumer files match, without writing. Sync checks generated token freshness and validates all destinations before writing. Consumer updates are explicit; generating the library alone does not update another repository. The original `tokens:generate --ios-output ...` command still updates tokens only.

## Component contracts

| Component | SwiftUI | Compose | States and ownership |
| --- | --- | --- | --- |
| Button | `NDSButton(variant:isLoading:loadingLabel:action:label:)` | `NDSButton(onClick, modifier, variant, enabled, loading, loadingLabel, content)` | Primary, secondary, ghost, destructive. Loading retains its label, exposes a localized state description and disables activation. Swift uses `.disabled(...)` for external state. Minimum height 44 pt / 48 dp; grows with text. |
| Field | `NDSField(_:helper:error:showsLabel:isFocused:content:)` | `NDSField(value, onValueChange, label, modifier, helper, error, ...)` | Visible or accessible label, helper/error precedence, focus indication and disabled state. Swift wraps a native TextField/SecureField and receives focus state; Compose wraps OutlinedTextField with keyboard options/actions and optional icons. Consumer owns validation, keyboard policy, values and focus. |
| Card | `NDSCard(content:)` | `NDSCard(modifier, content)` | Non-interactive bordered surface, shared radius and padding. Consumer owns navigation, click semantics and nested actions. |
| Badge | `NDSBadge(_:tone:)` | `NDSBadge(text, modifier, tone)` | Neutral, success, warning, danger, info. Wraps with text size. Semantic tones use the main surface to maintain 4.5:1 text contrast; the label must convey meaning independently of color. |
| Product state | `NDSState(_:title:message:actions:)` | `NDSState(kind, title, modifier, message, actions)` | Loading, empty, error, success with optional recovery content. Visible status titles and native progress. Compose uses a polite live region; app-level VoiceOver announcements remain consumer-owned. |

Swift variants use `.primary`, `.secondary`, `.ghost`, `.destructive`; Compose uses `NDSButtonVariant.Primary`, `.Secondary`, `.Ghost`, `.Destructive`. Tone and state enums follow the same platform casing. Loading descriptions and all visible text are caller-supplied strings; pass localized values.

```swift
NDSState(.error, title: "Unable to load", message: "Check your connection.") {
    NDSButton(variant: .secondary, action: retry) { Text("Try again") }
}
```

```kotlin
NDSState(NDSStateKind.Error, "Unable to load", message = "Check your connection.") {
    NDSButton(onClick = retry, variant = NDSButtonVariant.Secondary) { Text("Try again") }
}
```

Swift fields preserve native modifiers and focus bindings:

```swift
NDSField("Name", error: nameError, isFocused: nameFocused) {
    TextField("Your name", text: $name).focused($nameFocused)
}
```

The source includes light and dark/large-text previews. The localhost.md Debug build also supports the `--nds-component-preview` launch argument for isolated iOS UI tests. It does not expose this route in Release builds.

## Platform mapping

| Foundation | Swift | Kotlin | Policy |
| --- | --- | --- | --- |
| Opaque colors | `NDSPalette.frost.canvas` (hex), `NDSColors.canvas` (adaptive Color) | `NDSColors.frost.canvas` (Color) | All three palettes are available; adaptive iOS colors select Frost/Graphite from system appearance. Android selects the palette in its theme. |
| Spacing | `NDSSpace.s4` | `NDSSpace.s4` | 1 rem maps to 16 pt / dp; no device pixel conversion. |
| Radius | `NDSRadius.md` | `NDSRadius.md` | Includes the fixed pixel pill radius; platform components may use native capsule shapes. |
| Fixed font sizes | `NDSFontSize.md` | `NDSFontSize.md` | pt / sp; fluid CSS headings require a platform-specific type scale. |
| Font weights | `NDSFontWeight.semibold` | `NDSFontWeight.semibold` | Numeric weights; native consumers map to their UI framework. |
| Control height | `NDSControlHeight.md` | `NDSControlHeight.md` | Visual dimensions, not minimum accessibility hit areas. |
| Motion | `NDSDuration.fast` | `NDSDuration.fast` | Milliseconds; native code handles reduced motion and duration API conversion. |
| Opacity | `NDSOpacity.disabled` | `NDSOpacity.disabled` | Unitless. |

`NDSTypography.font` uses SwiftUI text scaling via `relativeTo`. The Swift package bundles and registers Onest; source-copy iOS consumers register their own font. Android owns the font resource and Material typography mapping and uses generated fixed sizes where they match existing roles.

Glass, CSS shadows, fluid layout, breakpoints and z-index remain web values. Native blur/materials, safe areas, navigation, keyboard handling, touch targets, screen reader semantics and motion require platform implementations and validation.

## First consumer and next milestone

localhost.md maps `RegistryStyle` and `RegistryTheme` to generated values. Registry panels and badges delegate to the shared Card and Badge. Discover uses Field, Button and product states; Saved uses the shared empty state. The application header, category symbols and product-specific layout remain in the app.

Automated consumer checks cover activation, disabled/loading semantics, field error recovery and large-text recovery actions, alongside native builds and existing unit tests. These checks do not replace manual VoiceOver/TalkBack or physical-device review. Components introduce no custom motion; native progress indicators retain platform behavior.

MCP exposes platform-scoped contracts, generated source, actual API declarations, complete first-screen examples and installation steps. `npm run test:native:ios -- --packed` compiles the MCP example using a separately installed Swift package and tests bundled fonts; `npm run test:native:android` compiles the exact Kotlin source and example in an isolated Compose module. Both checks run in CI.

Next: manual assistive-technology review, broader device coverage, a stable native API. Android library publication remains future work; iOS SwiftPM integration and native MCP retrieval are available now.
