// Generated from src/tokens/foundations.json. Do not edit.
import SwiftUI
import UIKit

public enum NDSPalette: String, CaseIterable, Sendable {
    case frost, mist, graphite

    public var canvas: UInt32 {
        switch self {
        case .frost: 0xf5f5f3
        case .mist: 0xe9e9e5
        case .graphite: 0x111210
        }
    }

    public var surface: UInt32 {
        switch self {
        case .frost: 0xffffff
        case .mist: 0xf4f4f1
        case .graphite: 0x1a1b19
        }
    }

    public var surfaceAlt: UInt32 {
        switch self {
        case .frost: 0xececea
        case .mist: 0xdeded9
        case .graphite: 0x222320
        }
    }

    public var surfaceHover: UInt32 {
        switch self {
        case .frost: 0xf9f9f8
        case .mist: 0xfafaf7
        case .graphite: 0x292a27
        }
    }

    public var border: UInt32 {
        switch self {
        case .frost: 0xd9d9d5
        case .mist: 0xcbcbc5
        case .graphite: 0x343632
        }
    }

    public var borderHover: UInt32 {
        switch self {
        case .frost: 0xb8b8b2
        case .mist: 0xaaa9a2
        case .graphite: 0x555851
        }
    }

    public var text: UInt32 {
        switch self {
        case .frost: 0x171716
        case .mist: 0x1c1d1b
        case .graphite: 0xf2f2ee
        }
    }

    public var textSecondary: UInt32 {
        switch self {
        case .frost: 0x5f5f5a
        case .mist: 0x5c5d58
        case .graphite: 0xb4b5ae
        }
    }

    public var textTertiary: UInt32 {
        switch self {
        case .frost: 0x74746e
        case .mist: 0x6f706a
        case .graphite: 0x85877f
        }
    }

    public var textInverse: UInt32 {
        switch self {
        case .frost: 0xffffff
        case .mist: 0xffffff
        case .graphite: 0x161714
        }
    }

    public var accent: UInt32 {
        switch self {
        case .frost: 0x20211f
        case .mist: 0x292b28
        case .graphite: 0xeeeee9
        }
    }

    public var accentHover: UInt32 {
        switch self {
        case .frost: 0x3a3b38
        case .mist: 0x444640
        case .graphite: 0xd4d5ce
        }
    }

    public var focus: UInt32 {
        switch self {
        case .frost: 0x667085
        case .mist: 0x69716b
        case .graphite: 0xa6ada7
        }
    }

    public var success: UInt32 {
        switch self {
        case .frost: 0x237a57
        case .mist: 0x237a57
        case .graphite: 0x65b68e
        }
    }

    public var warning: UInt32 {
        switch self {
        case .frost: 0x956b20
        case .mist: 0x8b6728
        case .graphite: 0xd3ac63
        }
    }

    public var danger: UInt32 {
        switch self {
        case .frost: 0xb43b3b
        case .mist: 0xa83e3e
        case .graphite: 0xe27a7a
        }
    }

    public var dangerHover: UInt32 {
        switch self {
        case .frost: 0x963131
        case .mist: 0x8e3434
        case .graphite: 0xf08d8d
        }
    }

    public var info: UInt32 {
        switch self {
        case .frost: 0x496a86
        case .mist: 0x4b6b7c
        case .graphite: 0x8db6d2
        }
    }
}

// Follows the system appearance: Frost in light mode, Graphite in dark mode.
public enum NDSColors {
    public static let canvas = adaptive { $0.canvas }
    public static let surface = adaptive { $0.surface }
    public static let surfaceAlt = adaptive { $0.surfaceAlt }
    public static let surfaceHover = adaptive { $0.surfaceHover }
    public static let border = adaptive { $0.border }
    public static let borderHover = adaptive { $0.borderHover }
    public static let text = adaptive { $0.text }
    public static let textSecondary = adaptive { $0.textSecondary }
    public static let textTertiary = adaptive { $0.textTertiary }
    public static let textInverse = adaptive { $0.textInverse }
    public static let accent = adaptive { $0.accent }
    public static let accentHover = adaptive { $0.accentHover }
    public static let focus = adaptive { $0.focus }
    public static let success = adaptive { $0.success }
    public static let warning = adaptive { $0.warning }
    public static let danger = adaptive { $0.danger }
    public static let dangerHover = adaptive { $0.dangerHover }
    public static let info = adaptive { $0.info }

    private static func adaptive(_ value: @escaping @Sendable (NDSPalette) -> UInt32) -> Color {
        Color(uiColor: UIColor { traits in
            let hex = value(traits.userInterfaceStyle == .dark ? .graphite : .frost)
            return UIColor(red: CGFloat((hex >> 16) & 0xff) / 255,
                           green: CGFloat((hex >> 8) & 0xff) / 255,
                           blue: CGFloat(hex & 0xff) / 255, alpha: 1)
        })
    }
}

public enum NDSTypography {
    public static let fontName = "Onest-Regular"
    public static func font(_ size: CGFloat = NDSFontSize.md, weight: Font.Weight = .regular, relativeTo style: Font.TextStyle = .body) -> Font {
        #if SWIFT_PACKAGE
        NDSFonts.register()
        #endif
        return .custom(fontName, size: size, relativeTo: style).weight(weight)
    }
}

public enum NDSSpace {
    public static let s0: CGFloat = 0
    public static let s1: CGFloat = 4
    public static let s2: CGFloat = 8
    public static let s3: CGFloat = 12
    public static let s4: CGFloat = 16
    public static let s5: CGFloat = 24
    public static let s6: CGFloat = 32
    public static let s7: CGFloat = 48
    public static let s8: CGFloat = 64
    public static let s9: CGFloat = 96
    public static let s10: CGFloat = 144
}

public enum NDSRadius {
    public static let none: CGFloat = 0
    public static let sm: CGFloat = 12
    public static let md: CGFloat = 16
    public static let lg: CGFloat = 28
    public static let xl: CGFloat = 36
    public static let pill: CGFloat = 999
}

public enum NDSControlHeight {
    public static let sm: CGFloat = 36
    public static let md: CGFloat = 44
    public static let lg: CGFloat = 48
    public static let xl: CGFloat = 52
}

public enum NDSFontSize {
    public static let xs: CGFloat = 12
    public static let sm: CGFloat = 14
    public static let md: CGFloat = 15
    public static let base: CGFloat = 16
    public static let lg: CGFloat = 18
    public static let xl: CGFloat = 20
}

public enum NDSFontWeight {
    public static let regular: Int = 400
    public static let medium: Int = 500
    public static let semibold: Int = 600
    public static let bold: Int = 700
}

public enum NDSDuration {
    public static let instant: Int = 0
    public static let fast: Int = 180
    public static let normal: Int = 260
    public static let slow: Int = 650
}

public enum NDSOpacity {
    public static let disabled: CGFloat = 0.42
    public static let muted: CGFloat = 0.68
}
