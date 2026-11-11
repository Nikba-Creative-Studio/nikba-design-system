// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "NikbaDesignSystem",
    platforms: [.iOS(.v17)],
    products: [.library(name: "NikbaDesignSystem", targets: ["NikbaDesignSystem"])],
    targets: [
        .target(
            name: "NikbaDesignSystem",
            path: "native/ios",
            resources: [.process("Resources")]
        )
    ]
)
