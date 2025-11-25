package com.chirui.domain.model

/**
 * Represents a single page inside a chapter for the reader pipeline.
 */
data class ReaderPage(
    val index: Int,
    val imageUrl: String,
    val width: Int? = null,
    val height: Int? = null,
)
