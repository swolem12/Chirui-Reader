package com.chirui.reader.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

/**
 * Kotatsu-style shape definitions
 * Based on Kotatsu's ShapeAppearanceOverlay styles
 */

// Cover corner sizes from Kotatsu
val CoverCornerSmall = 4.dp   // ShapeAppearanceOverlay.Kotatsu.Cover.Small
val CoverCornerMedium = 8.dp  // ShapeAppearanceOverlay.Kotatsu.Cover.Medium  
val CoverCornerLarge = 12.dp  // ShapeAppearanceOverlay.Kotatsu.Cover

// Card corner size from M3 spec
val CardCorner = 12.dp        // m3_card_corner

// List selector corner size
val ListSelectorCorner = 12.dp // list_selector_corner

val AppShapes = Shapes(
    extraSmall = RoundedCornerShape(CoverCornerSmall),
    small = RoundedCornerShape(CoverCornerMedium),
    medium = RoundedCornerShape(CoverCornerLarge),
    large = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(28.dp)
)

// Additional Kotatsu-specific shapes
val CoverShapeSmall = RoundedCornerShape(CoverCornerSmall)
val CoverShapeMedium = RoundedCornerShape(CoverCornerMedium)
val CoverShapeLarge = RoundedCornerShape(CoverCornerLarge)
val CardShape = RoundedCornerShape(CardCorner)
val ListItemShape = RoundedCornerShape(ListSelectorCorner)
