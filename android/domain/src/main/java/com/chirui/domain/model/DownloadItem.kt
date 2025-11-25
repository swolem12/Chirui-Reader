package com.chirui.domain.model

data class DownloadItem(
    val id: String,
    val title: String,
    val source: String,
    val coverUrl: String? = null,
    val status: DownloadStatus = DownloadStatus.QUEUED,
    val progress: Float = 0f,
    val etaMinutes: Int? = null,
    val sizeLabel: String? = null,
    val chapters: List<DownloadChapter> = emptyList(),
)
