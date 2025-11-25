package com.chirui.domain.model

data class SourceDescriptor(
    val id: String,
    val name: String,
    val language: String,
    val description: String? = null,
    val nsfw: Boolean = false,
    val iconPath: String? = null,
    val enabled: Boolean = true,
)
