import CoreText
import UIKit

#if SWIFT_PACKAGE
/// The Swift package registers its bundled, OFL-licensed Onest font once per process.
public enum NDSFonts {
    @discardableResult
    public static func register() -> Bool { registered }

    private static let registered: Bool = {
        if UIFont(name: "Onest-Regular", size: 12) != nil { return true }
        guard let url = Bundle.module.url(forResource: "Onest", withExtension: "ttf") else { return false }
        CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
        return UIFont(name: "Onest-Regular", size: 12) != nil
    }()
}
#endif
