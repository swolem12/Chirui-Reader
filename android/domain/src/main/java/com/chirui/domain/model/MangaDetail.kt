package com.chirui.domain.model

/**
 * Expanded metadata for a manga entry sourced from Kotatsu fixtures or parsers.
 */
data class MangaDetail(
    val summary: MangaSummary,
    val author: String? = null,
    val artist: String? = null,
    val status: MangaStatus = MangaStatus.UNKNOWN,
    val sourceUrl: String? = null,
    val favorite: Boolean = false,
    val tags: List<String> = emptyList(),
    val description: String? = null,
    val chapters: List<ChapterSummary> = emptyList(),
)
