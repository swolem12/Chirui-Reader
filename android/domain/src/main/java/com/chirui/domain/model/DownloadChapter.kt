package com.chirui.domain.model

data class DownloadChapter(
    val id: String,
    val name: String,
    val progress: Float = 0f,
)
