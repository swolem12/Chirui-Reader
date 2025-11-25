package com.chirui.reader.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.compositeOver

// Kotatsu-inspired palette tuned for dark first with warm orange accents
val Flame = Color(0xFFFF7849)
val FlameStrong = Color(0xFFFF6A30)
val Ink = Color(0xFF0F172A)
val InkMuted = Color(0xFF1E293B)
val Paper = Color(0xFFF8FAFC)
val PaperMuted = Color(0xFFE2E8F0)
val Jade = Color(0xFF35C8A5)
val Sky = Color(0xFF60A5FA)
val Warning = Color(0xFFFFB74D)
val Danger = Color(0xFFEF5350)

val LightColorScheme = androidx.compose.material3.lightColorScheme(
    primary = FlameStrong,
    onPrimary = Color.White,
    primaryContainer = Flame.copy(alpha = 0.14f).compositeOver(Paper),
    onPrimaryContainer = FlameStrong,
    secondary = Jade,
    onSecondary = Color(0xFF052016),
    secondaryContainer = Jade.copy(alpha = 0.16f).compositeOver(Paper),
    onSecondaryContainer = Jade,
    tertiary = Sky,
    onTertiary = Color(0xFF0B2544),
    background = Paper,
    onBackground = Ink,
    surface = Color.White,
    onSurface = Ink,
    surfaceVariant = PaperMuted,
    onSurfaceVariant = InkMuted,
    outline = InkMuted.copy(alpha = 0.4f),
    outlineVariant = InkMuted.copy(alpha = 0.25f),
    error = Danger,
    onError = Color.White
)

val DarkColorScheme = androidx.compose.material3.darkColorScheme(
    primary = Flame,
    onPrimary = Color.White,
    primaryContainer = Flame.copy(alpha = 0.2f).compositeOver(Ink),
    onPrimaryContainer = Color.White,
    secondary = Jade,
    onSecondary = Color(0xFF08241A),
    secondaryContainer = Jade.copy(alpha = 0.2f).compositeOver(Ink),
    onSecondaryContainer = Color.White,
    tertiary = Sky,
    onTertiary = Color(0xFF0A1C2F),
    background = Ink,
    onBackground = Paper,
    surface = InkMuted,
    onSurface = Paper,
    surfaceVariant = InkMuted.copy(alpha = 0.8f),
    onSurfaceVariant = PaperMuted,
    outline = PaperMuted.copy(alpha = 0.3f),
    outlineVariant = PaperMuted.copy(alpha = 0.2f),
    error = Danger,
    onError = Color.White
)
