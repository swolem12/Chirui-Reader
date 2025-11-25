package com.chirui.data.downloads

import android.content.Context
import com.chirui.domain.DispatcherProvider
import com.chirui.domain.downloads.DownloadRepository
import com.chirui.domain.model.DownloadChapter
import com.chirui.domain.model.DownloadItem
import com.chirui.domain.model.DownloadStatus
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Singleton
class AssetDownloadRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dispatchers: DispatcherProvider,
) : DownloadRepository {

    private val json = Json { ignoreUnknownKeys = true }
    private val queue = MutableStateFlow(loadFixtures())

    override fun observeQueue(): Flow<List<DownloadItem>> = queue

    override suspend fun pause(id: String) {
        updateStatus(id) { current ->
            when (current.status) {
                DownloadStatus.DOWNLOADING -> current.copy(status = DownloadStatus.PAUSED)
                else -> current
            }
        }
    }

    override suspend fun resume(id: String) {
        updateStatus(id) { current ->
            when (current.status) {
                DownloadStatus.PAUSED, DownloadStatus.FAILED, DownloadStatus.CANCELED ->
                    current.copy(status = DownloadStatus.DOWNLOADING)
                else -> current
            }
        }
    }

    override suspend fun cancel(id: String) {
        updateStatus(id) { current ->
            when (current.status) {
                DownloadStatus.COMPLETED -> current
                else -> current.copy(status = DownloadStatus.CANCELED, progress = 0f)
            }
        }
    }

    override suspend fun retry(id: String) {
        updateStatus(id) { current ->
            when (current.status) {
                DownloadStatus.FAILED, DownloadStatus.CANCELED -> current.copy(status = DownloadStatus.QUEUED)
                else -> current
            }
        }
    }

    private suspend fun updateStatus(id: String, transform: (DownloadItem) -> DownloadItem) {
        withContext(dispatchers.io) {
            queue.update { downloads ->
                downloads.map { item -> if (item.id == id) transform(item) else item }
            }
        }
    }

    private fun loadFixtures(): List<DownloadItem> {
        val raw = runCatching {
            context.assets.open("downloads/queue.json").use { it.bufferedReader().readText() }
        }.getOrNull() ?: return emptyList()

        val payload = runCatching { json.decodeFromString(DownloadPayload.serializer(), raw) }.getOrNull()
            ?: return emptyList()

        return payload.downloads.map { download ->
            DownloadItem(
                id = download.id,
                title = download.title,
                source = download.source,
                coverUrl = download.coverUrl,
                status = download.status.toStatus(),
                progress = download.progress,
                etaMinutes = download.etaMinutes,
                sizeLabel = download.sizeLabel,
                chapters = download.chapters.map { chapter ->
                    DownloadChapter(
                        id = chapter.id,
                        name = chapter.name,
                        progress = chapter.progress,
                    )
                }
            )
        }
    }

    @Serializable
    private data class DownloadPayload(
        val downloads: List<DownloadFixture> = emptyList(),
    )

    @Serializable
    private data class DownloadFixture(
        val id: String,
        val title: String,
        val source: String,
        val coverUrl: String? = null,
        val status: String = "QUEUED",
        val progress: Float = 0f,
        val etaMinutes: Int? = null,
        val sizeLabel: String? = null,
        val chapters: List<DownloadChapterFixture> = emptyList(),
    )

    @Serializable
    private data class DownloadChapterFixture(
        val id: String,
        val name: String,
        val progress: Float = 0f,
    )

    private fun String.toStatus(): DownloadStatus = runCatching {
        DownloadStatus.valueOf(uppercase())
    }.getOrDefault(DownloadStatus.QUEUED)
}
