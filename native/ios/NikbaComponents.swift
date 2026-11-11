import SwiftUI

public enum NDSButtonVariant: Sendable {
    case primary, secondary, ghost, destructive
}

public struct NDSButton<Label: View>: View {
    private let variant: NDSButtonVariant
    private let isLoading: Bool
    private let loadingLabel: String
    private let action: () -> Void
    private let label: Label

    public init(variant: NDSButtonVariant = .primary, isLoading: Bool = false,
                loadingLabel: String = "Loading", action: @escaping () -> Void,
                @ViewBuilder label: () -> Label) {
        self.variant = variant
        self.isLoading = isLoading
        self.loadingLabel = loadingLabel
        self.action = action
        self.label = label()
    }

    public var body: some View {
        Button(role: variant == .destructive ? .destructive : nil, action: action) {
            HStack(spacing: NDSSpace.s2) {
                if isLoading { ProgressView().tint(foreground).accessibilityHidden(true) }
                label
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(NDSActionStyle(variant: variant))
        .disabled(isLoading)
        .accessibilityValue(isLoading ? loadingLabel : "")
    }

    private var foreground: Color { variant == .primary || variant == .destructive ? NDSColors.textInverse : NDSColors.text }
}

private struct NDSActionStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled
    let variant: NDSButtonVariant

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(NDSTypography.font(NDSFontSize.sm, weight: .semibold))
            .padding(.horizontal, NDSSpace.s4)
            .padding(.vertical, NDSSpace.s3)
            .frame(minHeight: 44)
            .foregroundStyle(variant == .primary || variant == .destructive ? NDSColors.textInverse : NDSColors.text)
            .background(background, in: RoundedRectangle(cornerRadius: NDSRadius.sm))
            .overlay {
                RoundedRectangle(cornerRadius: NDSRadius.sm)
                    .strokeBorder(variant == .secondary ? NDSColors.border : .clear)
            }
            .contentShape(RoundedRectangle(cornerRadius: NDSRadius.sm))
            .opacity(!isEnabled ? NDSOpacity.disabled : configuration.isPressed ? 0.76 : 1)
    }

    private var background: Color {
        switch variant {
        case .primary: NDSColors.accent
        case .secondary: NDSColors.surfaceAlt
        case .ghost: .clear
        case .destructive: NDSColors.danger
        }
    }
}

public struct NDSCard<Content: View>: View {
    private let content: Content
    public init(@ViewBuilder content: () -> Content) { self.content = content() }

    public var body: some View {
        VStack(alignment: .leading, spacing: NDSSpace.s4) { content }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(NDSSpace.s5)
            .foregroundStyle(NDSColors.text)
            .background(NDSColors.surface, in: RoundedRectangle(cornerRadius: NDSRadius.md))
            .overlay { RoundedRectangle(cornerRadius: NDSRadius.md).strokeBorder(NDSColors.border) }
    }
}

public enum NDSBadgeTone: Sendable {
    case neutral, success, warning, danger, info

    fileprivate var color: Color {
        switch self {
        case .neutral: NDSColors.textSecondary
        case .success: NDSColors.success
        case .warning: NDSColors.warning
        case .danger: NDSColors.danger
        case .info: NDSColors.info
        }
    }
}

public struct NDSBadge: View {
    private let title: String
    private let tone: NDSBadgeTone
    public init(_ title: String, tone: NDSBadgeTone = .neutral) {
        self.title = title
        self.tone = tone
    }

    public var body: some View {
        Text(title)
            .font(NDSTypography.font(NDSFontSize.xs, relativeTo: .caption))
            .foregroundStyle(tone.color)
            .padding(.horizontal, NDSSpace.s2).padding(.vertical, NDSSpace.s1)
            .background(tone == .neutral ? NDSColors.surfaceAlt : NDSColors.surface, in: RoundedRectangle(cornerRadius: NDSRadius.sm))
            .overlay {
                RoundedRectangle(cornerRadius: NDSRadius.sm)
                    .strokeBorder(tone == .neutral ? Color.clear : tone.color.opacity(0.35))
            }
    }
}

/// Wrap a native TextField or SecureField; the consumer owns its value and keyboard policy.
public struct NDSField<Content: View>: View {
    @Environment(\.isEnabled) private var isEnabled
    private let isFocused: Bool
    private let title: String
    private let helper: String?
    private let error: String?
    private let showsLabel: Bool
    private let content: Content

    public init(_ title: String, helper: String? = nil, error: String? = nil,
                showsLabel: Bool = true, isFocused: Bool = false, @ViewBuilder content: () -> Content) {
        self.title = title
        self.helper = helper
        self.error = error
        self.showsLabel = showsLabel
        self.isFocused = isFocused
        self.content = content()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: NDSSpace.s2) {
            if showsLabel {
                Text(title).font(NDSTypography.font(NDSFontSize.sm, weight: .medium))
                    .accessibilityHidden(true)
            }
            content
                .font(NDSTypography.font())
                .accessibilityLabel(title)
                .accessibilityHint(error.map { "Error: \($0)" } ?? helper ?? "")
                .padding(NDSSpace.s3)
                .frame(minHeight: 44)
                .background(NDSColors.surface, in: RoundedRectangle(cornerRadius: NDSRadius.sm))
                .overlay {
                    RoundedRectangle(cornerRadius: NDSRadius.sm)
                        .strokeBorder(error != nil ? NDSColors.danger : isFocused ? NDSColors.focus : NDSColors.border,
                                      lineWidth: isFocused || error != nil ? 2 : 1)
                }
            if let message = error ?? helper {
                Text(message)
                    .font(NDSTypography.font(NDSFontSize.xs, relativeTo: .caption))
                    .foregroundStyle(error != nil ? NDSColors.danger : NDSColors.textSecondary)
                    .accessibilityLabel(error != nil ? "Error: \(message)" : message)
            }
        }
        .foregroundStyle(NDSColors.text)
        .opacity(isEnabled ? 1 : NDSOpacity.disabled)
    }
}

public enum NDSStateKind: Sendable {
    case loading, empty, error, success
}

public struct NDSState<Actions: View>: View {
    private let kind: NDSStateKind
    private let title: String
    private let message: String?
    private let actions: Actions

    public init(_ kind: NDSStateKind, title: String, message: String? = nil,
                @ViewBuilder actions: () -> Actions) {
        self.kind = kind
        self.title = title
        self.message = message
        self.actions = actions()
    }

    public var body: some View {
        NDSCard {
            if kind == .loading {
                ProgressView().accessibilityHidden(true)
            } else {
                Image(systemName: kind == .error ? "exclamationmark.triangle" : kind == .success ? "checkmark.circle" : "tray")
                    .font(.title2).foregroundStyle(kind == .error ? NDSColors.danger : NDSColors.textSecondary)
                    .accessibilityHidden(true)
            }
            Text(title).font(NDSTypography.font(NDSFontSize.lg, weight: .semibold, relativeTo: .headline))
                .accessibilityAddTraits(.isHeader)
            if let message {
                Text(message).font(NDSTypography.font()).foregroundStyle(NDSColors.textSecondary)
            }
            actions
        }
        .accessibilityElement(children: .contain)
    }
}

extension NDSState where Actions == EmptyView {
    public init(_ kind: NDSStateKind, title: String, message: String? = nil) {
        self.init(kind, title: title, message: message) { EmptyView() }
    }
}

#if DEBUG
struct NDSComponentPreview: View {
    @State private var name = ""
    @State private var count = 0
    @FocusState private var nameFocused: Bool
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: NDSSpace.s4) {
                Text("Native components").font(.title).accessibilityAddTraits(.isHeader)
                NDSButton(action: { count += 1 }) { Text("Count \(count)") }.accessibilityIdentifier("nds.action")
                NDSButton(isLoading: true, action: { count += 1 }) { Text("Saving") }.accessibilityIdentifier("nds.loading")
                NDSButton(variant: .secondary, action: { count += 1 }) { Text("Unavailable") }
                    .disabled(true).accessibilityIdentifier("nds.disabled")
                NDSButton(variant: .ghost, action: {}) { Text("Ghost action") }
                NDSButton(variant: .destructive, action: {}) { Text("Delete draft") }
                NDSField("Name", helper: "Use your display name", error: name.isEmpty ? "Enter a name" : nil, isFocused: nameFocused) {
                    TextField("Your name", text: $name).focused($nameFocused).accessibilityIdentifier("nds.field")
                }
                NDSCard {
                    Text("Shared surface")
                    NDSBadge("Ready", tone: .success)
                    NDSBadge("Needs review", tone: .warning)
                    NDSBadge("Failed", tone: .danger)
                    NDSBadge("Information", tone: .info)
                }
                NDSState(.loading, title: "Loading preview")
                NDSState(.empty, title: "No items yet")
                NDSState(.error, title: "Unable to load", message: "Check your connection.") {
                    NDSButton(variant: .secondary, action: {}) { Text("Try again") }
                }
                NDSState(.success, title: "Changes saved")
            }.padding(NDSSpace.s4)
        }.font(NDSTypography.font()).background(NDSColors.canvas)
    }
}

#Preview("Native · Light") { NDSComponentPreview().preferredColorScheme(.light) }
#Preview("Native · Dark · Large text") {
    NDSComponentPreview().preferredColorScheme(.dark).dynamicTypeSize(.accessibility3)
}
#endif
