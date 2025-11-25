package com.chirui.domain.model

/**
 * Lightweight chapter metadata used by the catalog/detail UI before the reader pipeline is wired.
 */
data class ChapterSummary(
    val id: String,
    val title: String,
    val number: Double? = null,
    val downloaded: Boolean = false,
    val readProgress: Float = 0f,
)
