# Build an iOS app with Nikba

## Purpose

Start a SwiftUI app from a fresh MCP conversation using the version-pinned Nikba Swift package, real component APIs and a compiled first-screen example. The package requires iOS 17+ and Swift 6. Release 1.1.0 includes native pilot APIs alongside the stable web library.

## 1. Discover before generating

Call `get_capabilities({platform: "ios"})`, then `get_installation({platform: "ios"})`. The response includes the remote Swift package URL and exact version, plus an optional local `packagePath`. Server filesystem paths only apply on the server’s machine.

All native responses carry `nativeVersion`, `status`, `releaseStatus` and a `sourceFingerprint` for matching snapshots. The fingerprint describes package content; it is not a Git revision or a published release tag.

## 2. Add the Swift package

In Xcode, select **File > Add Package Dependencies**, enter `https://github.com/Nikba-Creative-Studio/nikba-design-system.git`, and choose **Exact Version 1.1.0**. Add the **NikbaDesignSystem** product to your iOS target. The `v1.1.0` tag contains the package; the older web-only `v1.0.0` tag does not.

For a consuming SwiftPM manifest:

```swift
.package(url: "https://github.com/Nikba-Creative-Studio/nikba-design-system.git", exact: "1.1.0")
// In the consuming target's dependencies:
.product(name: "NikbaDesignSystem", package: "nikba-design-system")
```

For local development, choose **Add Local** and select the `packagePath` returned by MCP. Checkouts and installed npm archives include Package.swift, native sources, examples and the bundled font. The package has no remote dependencies.

The distribution version is 1.1.0 for npm, SwiftPM and MCP. Native APIs remain explicitly marked as a pilot and are not covered by the stable web API guarantee. Pin the exact release version when using this pilot. The content fingerprint is not a Git revision.

## 3. Import and use the complete example

```swift
import SwiftUI
import NikbaDesignSystem
```

Read `nikba://native/ios/source/example` or call `get_native_source({platform: "ios", kind: "example"})`. This returns a complete `NikbaFirstScreen` with its state, focus bindings and imports. Add that file to your application and display `NikbaFirstScreen()` from your app's `WindowGroup`.

The example is the same file compiled by `npm run test:native:ios` in a separate app target importing the Swift package. Component examples are excerpts from this file, not independent views; retrieve the full context when bindings or actions are unclear.

## 4. Typography and appearance

`NDSTypography.font(...)` automatically registers the package's bundled Onest font before returning a Dynamic Type-aware SwiftUI font. No app font copy, `UIAppFonts` entry, network request or entitlement is required for this package resource. `NDSFonts.register()` is also available and returns whether Onest is usable. Registration is idempotent. The font is distributed under its included SIL Open Font License, with pinned upstream provenance.

Adaptive `NDSColors` follow the system: Frost for light appearance and Graphite for dark. Raw `NDSPalette` hex values also include Mist. Components do not yet accept a custom theme override. Keep system text scaling and avoid fixed-height containers around growing text.

The alternative two-file source-copy integration remains supported: copy NikbaTokens.swift and NikbaComponents.swift and bundle/register Onest in the app. Automatic package font registration applies only when compiled by SwiftPM.

## 5. Ask for platform-specific contracts

Call `get_component({slug: "button", platform: "ios"})`. Its API declarations come from the shipped Swift source, and its example comes from the consumer test screen. Available components are Button, Field, Card, Badge and Product States. `badge-chip` aliases Badge on native platforms; it does not make Chip available.

For unsupported components, the response has `available: false` and a suggested native fallback. Use SwiftUI's NavigationStack, TabView, Picker, Toggle, sheet, alert or List as appropriate and apply Nikba typography/colors. Preserve platform behavior; do not translate DOM classes or invent an NDS component that was not returned.

## 6. Verify the app

Build for an iOS simulator. Check light/dark appearance, large text, focus and keyboard dismissal, disabled/loading actions, validation recovery and minimum hit areas. The package example and bundled font are checked by an isolated consumer test:

```sh
npm run test:mcp
npm run test:native:ios
```

The native consumer test requires macOS, Xcode with an available iPhone simulator runtime, Node dependencies and XcodeGen. It obtains the example from the running MCP server, links a local SwiftPM product, executes font-registration tests and removes its own simulator afterwards. CI runs this check on macOS. Manual VoiceOver and physical-device review remain required before declaring native APIs stable.
