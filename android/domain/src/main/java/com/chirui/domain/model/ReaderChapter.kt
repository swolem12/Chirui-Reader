package com.chirui.domain.model

/**
 * Chapter payload for the reader, including ordered pages and metadata.
 */
data class ReaderChapter(
    val chapterId: String,
    val mangaId: String,
    val mangaTitle: String,
    val chapterTitle: String,
    val pages: List<ReaderPage>,
)
