package com.nikba.designsystem

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.error as accessibilityError
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

enum class NDSButtonVariant { Primary, Secondary, Ghost, Destructive }
enum class NDSBadgeTone { Neutral, Success, Warning, Danger, Info }
enum class NDSStateKind { Loading, Empty, Error, Success }

@Composable
private fun palette(): NDSPalette = if (isSystemInDarkTheme()) NDSColors.graphite else NDSColors.frost

/** Loading retains the visible label, reports its state, and prevents duplicate actions. */
@Composable
fun NDSButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: NDSButtonVariant = NDSButtonVariant.Primary,
    enabled: Boolean = true,
    loading: Boolean = false,
    loadingLabel: String = "Loading",
    content: @Composable RowScope.() -> Unit,
) {
    val colors = palette()
    val background = when (variant) {
        NDSButtonVariant.Primary -> colors.accent
        NDSButtonVariant.Secondary -> colors.surfaceAlt
        NDSButtonVariant.Destructive -> colors.danger
        NDSButtonVariant.Ghost -> Color.Transparent
    }
    val foreground = if (variant == NDSButtonVariant.Primary || variant == NDSButtonVariant.Destructive) colors.textInverse else colors.text
    Button(
        onClick = onClick,
        modifier = modifier.heightIn(min = 48.dp).semantics {
            if (loading) stateDescription = loadingLabel
        },
        enabled = enabled && !loading,
        shape = RoundedCornerShape(NDSRadius.sm),
        colors = ButtonDefaults.buttonColors(
            containerColor = background, contentColor = foreground,
            disabledContainerColor = background.copy(alpha = background.alpha * NDSOpacity.disabled),
            disabledContentColor = foreground.copy(alpha = NDSOpacity.disabled),
        ),
        border = if (variant == NDSButtonVariant.Secondary) BorderStroke(1.dp, colors.border) else null,
        contentPadding = PaddingValues(horizontal = NDSSpace.s4, vertical = NDSSpace.s3),
    ) {
        if (loading) {
            CircularProgressIndicator(Modifier.size(18.dp), color = LocalContentColor.current, strokeWidth = 2.dp)
            Spacer(Modifier.width(NDSSpace.s2))
        }
        content()
    }
}

/** A non-interactive surface. Consumers retain ownership of navigation and nested actions. */
@Composable
fun NDSCard(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    val colors = palette()
    Surface(
        modifier = modifier.fillMaxWidth(), color = colors.surface, contentColor = colors.text,
        shape = RoundedCornerShape(NDSRadius.md), border = BorderStroke(1.dp, colors.border),
    ) {
        Column(Modifier.padding(NDSSpace.s5), verticalArrangement = Arrangement.spacedBy(NDSSpace.s4), content = content)
    }
}

@Composable
fun NDSBadge(text: String, modifier: Modifier = Modifier, tone: NDSBadgeTone = NDSBadgeTone.Neutral) {
    val colors = palette()
    val foreground = when (tone) {
        NDSBadgeTone.Neutral -> colors.textSecondary
        NDSBadgeTone.Success -> colors.success
        NDSBadgeTone.Warning -> colors.warning
        NDSBadgeTone.Danger -> colors.danger
        NDSBadgeTone.Info -> colors.info
    }
    Surface(modifier, color = if (tone == NDSBadgeTone.Neutral) colors.surfaceAlt else colors.surface,
        contentColor = foreground, shape = RoundedCornerShape(NDSRadius.sm),
        border = if (tone == NDSBadgeTone.Neutral) null else BorderStroke(1.dp, foreground.copy(alpha = 0.35f))) {
        Text(text, Modifier.padding(horizontal = NDSSpace.s2, vertical = NDSSpace.s1), style = MaterialTheme.typography.labelMedium)
    }
}

/** Value, keyboard policy, validation and submission remain application-owned. */
@Composable
fun NDSField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    helper: String? = null,
    error: String? = null,
    enabled: Boolean = true,
    singleLine: Boolean = true,
    placeholder: String? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
) {
    val colors = palette()
    OutlinedTextField(
        value = value, onValueChange = onValueChange, modifier = modifier.semantics {
            error?.let { accessibilityError(it) }
        },
        label = { Text(label) },
        placeholder = placeholder?.let { text -> { Text(text) } },
        supportingText = (error ?: helper)?.let { text -> { Text(text) } },
        isError = error != null, enabled = enabled, singleLine = singleLine,
        keyboardOptions = keyboardOptions, keyboardActions = keyboardActions,
        leadingIcon = leadingIcon, trailingIcon = trailingIcon,
        shape = RoundedCornerShape(NDSRadius.sm),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = colors.surface, unfocusedContainerColor = colors.surface,
            focusedTextColor = colors.text, unfocusedTextColor = colors.text,
            cursorColor = colors.text, focusedBorderColor = colors.focus,
            unfocusedBorderColor = colors.border,
            focusedLabelColor = colors.textSecondary, unfocusedLabelColor = colors.textSecondary,
            errorBorderColor = colors.danger, errorLabelColor = colors.danger,
            errorSupportingTextColor = colors.danger,
            errorContainerColor = colors.surface, errorTextColor = colors.text,
        ),
    )
}

@Composable
fun NDSState(
    kind: NDSStateKind,
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    actions: @Composable ColumnScope.() -> Unit = {},
) {
    NDSCard(modifier.semantics { liveRegion = LiveRegionMode.Polite }) {
        if (kind == NDSStateKind.Loading) CircularProgressIndicator(Modifier.size(24.dp), color = palette().textSecondary)
        Text(title, modifier = Modifier.semantics { heading() }, style = MaterialTheme.typography.titleMedium,
            color = if (kind == NDSStateKind.Error) palette().danger else palette().text)
        if (message != null) Text(message, color = palette().textSecondary)
        actions()
    }
}

@Preview(name = "Native · Light", showBackground = true)
@Preview(name = "Native · Dark · Large text", uiMode = android.content.res.Configuration.UI_MODE_NIGHT_YES, fontScale = 2f, showBackground = true)
@Composable
private fun NativeComponentPreview() {
    MaterialTheme {
        Column(Modifier.padding(NDSSpace.s4), verticalArrangement = Arrangement.spacedBy(NDSSpace.s4)) {
            NDSButton(onClick = {}) { Text("Continue") }
            NDSButton(onClick = {}, loading = true) { Text("Saving") }
            NDSField("", {}, "Name", error = "Enter a name")
            NDSCard { NDSBadge("Ready", tone = NDSBadgeTone.Success) }
            NDSState(NDSStateKind.Empty, "No items yet")
        }
    }
}
