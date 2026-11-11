package com.nikba.examples

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.nikba.designsystem.*

/** Place inside your app's Nikba/Onest MaterialTheme. State remains app-owned. */
@Composable
fun NikbaFirstScreen() {
    var name by remember { mutableStateOf("") }
    var saved by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(NDSSpace.s4),
        verticalArrangement = Arrangement.spacedBy(NDSSpace.s4)) {
        // example:card:start
        NDSCard {
            Text("Your first Nikba screen", style = MaterialTheme.typography.titleMedium)
            // example:badge:start
            NDSBadge("Native pilot", tone = NDSBadgeTone.Info)
            // example:badge:end
        }
        // example:card:end
        // example:field:start
        NDSField(value = name, onValueChange = { name = it }, label = "Name",
            helper = "Your display name", error = null, enabled = true,
            singleLine = true, placeholder = "Your name")
        // example:field:end
        // example:button:start
        NDSButton(onClick = { saved = true }, variant = NDSButtonVariant.Primary,
            enabled = name.isNotBlank(), loading = false, loadingLabel = "Saving") { Text("Save name") }
        // example:button:end
        // example:product-states:start
        if (saved) {
            NDSState(NDSStateKind.Success, "Saved", message = "Your name is saved for this session.")
        } else {
            NDSState(NDSStateKind.Empty, "Make it yours", message = "Enter a name to try the native components.")
        }
        // example:product-states:end
    }
}
