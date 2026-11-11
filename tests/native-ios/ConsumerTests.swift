import XCTest
import UIKit
import SwiftUI
import NikbaDesignSystem

final class ConsumerTests: XCTestCase {
    func testSwiftPackageRegistersItsBundledOnestFontWithoutAppAssets() throws {
        _ = NDSTypography.font()
        XCTAssertTrue(NDSFonts.register())
        XCTAssertTrue(NDSFonts.register(), "Repeated registration must remain safe")
        let font = try XCTUnwrap(UIFont(name: NDSTypography.fontName, size: 17))
        XCTAssertEqual(font.familyName, "Onest")
    }

    func testPublicTokensAreUsableFromAnotherModule() {
        XCTAssertEqual(NDSSpace.s4, 16)
        XCTAssertEqual(NDSPalette.frost.canvas, 0xf5f5f3)
        XCTAssertEqual(NDSPalette.graphite.canvas, 0x111210)
    }
}
