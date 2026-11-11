import SwiftUI
import NikbaDesignSystem

/// This complete screen is compiled by the isolated SwiftPM consumer test.
struct NikbaFirstScreen: View {
    @State private var name = ""
    @State private var saved = false
    @FocusState private var nameFocused: Bool

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: NDSSpace.s4) {
                    // example:card:start
                    NDSCard {
                        Text("Your first Nikba screen")
                            .font(NDSTypography.font(NDSFontSize.lg, weight: .semibold, relativeTo: .headline))
                        // example:badge:start
                        NDSBadge("Native pilot", tone: .info)
                        // example:badge:end
                    }
                    // example:card:end

                    // example:field:start
                    NDSField("Name", helper: "Your display name", error: nil,
                             showsLabel: true, isFocused: nameFocused) {
                        TextField("Your name", text: $name)
                            .focused($nameFocused)
                            .submitLabel(.done)
                            .onSubmit { nameFocused = false }
                    }
                    // example:field:end

                    // example:button:start
                    NDSButton(variant: .primary, isLoading: false, loadingLabel: "Saving", action: {
                        nameFocused = false
                        saved = true
                    }) { Text("Save name") }
                    .disabled(name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    // example:button:end

                    // example:product-states:start
                    if saved {
                        NDSState(.success, title: "Saved", message: "Your name is saved for this session.")
                    } else {
                        NDSState(.empty, title: "Make it yours", message: "Enter a name to try the native components.") {
                            NDSButton(variant: .secondary, action: { nameFocused = true }) { Text("Enter a name") }
                        }
                    }
                    // example:product-states:end
                }
                .padding(NDSSpace.s4)
            }
            .background(NDSColors.canvas)
            .foregroundStyle(NDSColors.text)
            .font(NDSTypography.font())
            .navigationTitle("Nikba")
        }
    }
}
