package com.chirui.domain.catalog

import com.chirui.domain.model.MangaDetail
import com.chirui.domain.model.MangaSummary
import kotlinx.coroutines.flow.Flow

interface CatalogRepository {
    fun catalogEntries(): Flow<List<MangaSummary>>
    suspend fun reload()
    suspend fun mangaDetail(id: String): MangaDetail?
    suspend fun setFavorite(id: String, favorite: Boolean)
}
