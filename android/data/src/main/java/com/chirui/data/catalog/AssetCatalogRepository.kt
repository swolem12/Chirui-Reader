package com.chirui.data.catalog

import android.content.Context
import android.util.Log
import com.chirui.domain.DispatcherProvider
import com.chirui.domain.catalog.CatalogRepository
import com.chirui.domain.model.ChapterSummary
import com.chirui.domain.model.MangaDetail
import com.chirui.domain.model.MangaStatus
import com.chirui.domain.model.MangaSummary
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Singleton
class AssetCatalogRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dispatchers: DispatcherProvider,
) : CatalogRepository {

    private val json = Json { ignoreUnknownKeys = true }
    private val scope = CoroutineScope(dispatchers.io + SupervisorJob())
    private val catalog = MutableStateFlow<List<MangaSummary>>(emptyList())
    private val favorites = MutableStateFlow<Set<String>>(emptySet())
    private val details = MutableStateFlow<Map<String, MangaDetail>>(emptyMap())

    init {
        scope.launch { reload() }
    }

    override fun catalogEntries(): Flow<List<MangaSummary>> = catalog.asStateFlow()

    override suspend fun reload() {
        val entries = runCatching { readCatalog() }.getOrElse { throwable ->
            Log.e("AssetCatalogRepository", "Failed to load catalog fixtures", throwable)
            emptyList()
        }
        val detailMap = runCatching { readDetails() }.getOrElse { throwable ->
            Log.e("AssetCatalogRepository", "Failed to load catalog details", throwable)
            emptyMap()
        }
        catalog.value = entries
        details.value = detailMap
    }

    override suspend fun mangaDetail(id: String): MangaDetail? = withContext(dispatchers.io) {
        val favoriteSet = favorites.value
        val stored = details.value[id]
        stored?.copy(favorite = favoriteSet.contains(id)) ?: run {
            // fallback to summary-only mapping
            val summary = catalog.value.firstOrNull { it.id == id }
            summary?.let {
                MangaDetail(
                    summary = it,
                    status = it.status,
                    tags = it.tags,
                    description = it.description,
                    favorite = favoriteSet.contains(id)
                )
            }
        }
    }

    override suspend fun setFavorite(id: String, favorite: Boolean) {
        favorites.value = if (favorite) favorites.value + id else favorites.value - id
    }

    private suspend fun readCatalog(): List<MangaSummary> = withContext(dispatchers.io) {
        val assetManager = context.assets
        val fileContent = assetManager
            .open("catalog/featured.json")
            .bufferedReader()
            .use { it.readText() }

        val records = json.decodeFromString<List<CatalogRecord>>(fileContent)
        records.map { record ->
            MangaSummary(
                id = record.id,
                title = record.title,
                sourceId = record.sourceId,
                sourceName = record.sourceName,
                language = record.language,
                coverUrl = record.coverUrl,
                nsfw = record.nsfw ?: false,
                status = record.status?.toStatusEnum() ?: MangaStatus.UNKNOWN,
                tags = record.tags ?: emptyList(),
                description = record.description,
            )
        }
    }

    private suspend fun readDetails(): Map<String, MangaDetail> = withContext(dispatchers.io) {
        val assetManager = context.assets
        val fileContent = runCatching {
            assetManager
                .open("catalog/details.json")
                .bufferedReader()
                .use { it.readText() }
        }.getOrElse { throwable ->
            Log.w("AssetCatalogRepository", "No detail fixtures found", throwable)
            return@withContext emptyMap()
        }

        val records = json.decodeFromString<List<CatalogDetailRecord>>(fileContent)
        records.associateBy(
            keySelector = { it.id },
            valueTransform = { record ->
                val summary = MangaSummary(
                    id = record.id,
                    title = record.title,
                    sourceId = record.sourceId,
                    sourceName = record.sourceName,
                    language = record.language,
                    coverUrl = record.coverUrl,
                    nsfw = record.nsfw ?: false,
                    status = record.status?.toStatusEnum() ?: MangaStatus.UNKNOWN,
                    tags = record.tags ?: emptyList(),
                    description = record.description,
                )
                MangaDetail(
                    summary = summary,
                    author = record.author,
                    artist = record.artist,
                    status = summary.status,
                    sourceUrl = record.sourceUrl,
                    favorite = record.favorite ?: false,
                    tags = record.tags ?: emptyList(),
                    description = record.description,
                    chapters = record.chapters?.map { chapter ->
                        ChapterSummary(
                            id = chapter.id,
                            title = chapter.title,
                            number = chapter.number,
                            downloaded = chapter.downloaded ?: false,
                            readProgress = chapter.readProgress?.toFloat() ?: 0f,
                        )
                    } ?: emptyList(),
                )
            }
        )
    }
}

@Serializable
private data class CatalogRecord(
    val id: String,
    val title: String,
    val sourceId: String,
    val sourceName: String,
    val language: String,
    val coverUrl: String? = null,
    val nsfw: Boolean? = null,
    val status: String? = null,
    val tags: List<String>? = null,
    val description: String? = null,
)

@Serializable
private data class CatalogDetailRecord(
    val id: String,
    val title: String,
    val sourceId: String,
    val sourceName: String,
    val language: String,
    val coverUrl: String? = null,
    val nsfw: Boolean? = null,
    val status: String? = null,
    val tags: List<String>? = null,
    val description: String? = null,
    val author: String? = null,
    val artist: String? = null,
    val sourceUrl: String? = null,
    val favorite: Boolean? = null,
    val chapters: List<ChapterRecord>? = null,
)

@Serializable
private data class ChapterRecord(
    val id: String,
    val title: String,
    val number: Double? = null,
    val downloaded: Boolean? = null,
    val readProgress: Double? = null,
)

private fun String.toStatusEnum(): MangaStatus = when (lowercase()) {
    "ongoing" -> MangaStatus.ONGOING
    "completed" -> MangaStatus.COMPLETED
    "hiatus" -> MangaStatus.HIATUS
    "cancelled", "canceled" -> MangaStatus.CANCELLED
    else -> MangaStatus.UNKNOWN
}
