package com.chirui.domain.model

data class MangaSummary(
    val id: String,
    val title: String,
    val sourceId: String,
    val sourceName: String,
    val language: String,
    val coverUrl: String?,
    val nsfw: Boolean,
    val status: MangaStatus = MangaStatus.UNKNOWN,
    val tags: List<String> = emptyList(),
    val description: String? = null,
)
