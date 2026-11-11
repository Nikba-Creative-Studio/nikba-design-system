// Generated from src/tokens/foundations.json. Do not edit.
package com.nikba.designsystem

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class NDSPalette(
    val canvas: Color,
    val surface: Color,
    val surfaceAlt: Color,
    val surfaceHover: Color,
    val border: Color,
    val borderHover: Color,
    val text: Color,
    val textSecondary: Color,
    val textTertiary: Color,
    val textInverse: Color,
    val accent: Color,
    val accentHover: Color,
    val focus: Color,
    val success: Color,
    val warning: Color,
    val danger: Color,
    val dangerHover: Color,
    val info: Color,
)

object NDSColors {
    val frost = NDSPalette(
        canvas = Color(0xfff5f5f3),
        surface = Color(0xffffffff),
        surfaceAlt = Color(0xffececea),
        surfaceHover = Color(0xfff9f9f8),
        border = Color(0xffd9d9d5),
        borderHover = Color(0xffb8b8b2),
        text = Color(0xff171716),
        textSecondary = Color(0xff5f5f5a),
        textTertiary = Color(0xff74746e),
        textInverse = Color(0xffffffff),
        accent = Color(0xff20211f),
        accentHover = Color(0xff3a3b38),
        focus = Color(0xff667085),
        success = Color(0xff237a57),
        warning = Color(0xff956b20),
        danger = Color(0xffb43b3b),
        dangerHover = Color(0xff963131),
        info = Color(0xff496a86),
    )
    val mist = NDSPalette(
        canvas = Color(0xffe9e9e5),
        surface = Color(0xfff4f4f1),
        surfaceAlt = Color(0xffdeded9),
        surfaceHover = Color(0xfffafaf7),
        border = Color(0xffcbcbc5),
        borderHover = Color(0xffaaa9a2),
        text = Color(0xff1c1d1b),
        textSecondary = Color(0xff5c5d58),
        textTertiary = Color(0xff6f706a),
        textInverse = Color(0xffffffff),
        accent = Color(0xff292b28),
        accentHover = Color(0xff444640),
        focus = Color(0xff69716b),
        success = Color(0xff237a57),
        warning = Color(0xff8b6728),
        danger = Color(0xffa83e3e),
        dangerHover = Color(0xff8e3434),
        info = Color(0xff4b6b7c),
    )
    val graphite = NDSPalette(
        canvas = Color(0xff111210),
        surface = Color(0xff1a1b19),
        surfaceAlt = Color(0xff222320),
        surfaceHover = Color(0xff292a27),
        border = Color(0xff343632),
        borderHover = Color(0xff555851),
        text = Color(0xfff2f2ee),
        textSecondary = Color(0xffb4b5ae),
        textTertiary = Color(0xff85877f),
        textInverse = Color(0xff161714),
        accent = Color(0xffeeeee9),
        accentHover = Color(0xffd4d5ce),
        focus = Color(0xffa6ada7),
        success = Color(0xff65b68e),
        warning = Color(0xffd3ac63),
        danger = Color(0xffe27a7a),
        dangerHover = Color(0xfff08d8d),
        info = Color(0xff8db6d2),
    )
}

object NDSSpace {
    val s0 = 0.dp
    val s1 = 4.dp
    val s2 = 8.dp
    val s3 = 12.dp
    val s4 = 16.dp
    val s5 = 24.dp
    val s6 = 32.dp
    val s7 = 48.dp
    val s8 = 64.dp
    val s9 = 96.dp
    val s10 = 144.dp
}

object NDSRadius {
    val none = 0.dp
    val sm = 12.dp
    val md = 16.dp
    val lg = 28.dp
    val xl = 36.dp
    val pill = 999.dp
}

object NDSControlHeight {
    val sm = 36.dp
    val md = 44.dp
    val lg = 48.dp
    val xl = 52.dp
}

object NDSFontSize {
    val xs = 12.sp
    val sm = 14.sp
    val md = 15.sp
    val base = 16.sp
    val lg = 18.sp
    val xl = 20.sp
}

object NDSFontWeight {
    const val regular = 400
    const val medium = 500
    const val semibold = 600
    const val bold = 700
}

object NDSDuration {
    const val instant = 0
    const val fast = 180
    const val normal = 260
    const val slow = 650
}

object NDSOpacity {
    const val disabled = 0.42f
    const val muted = 0.68f
}
