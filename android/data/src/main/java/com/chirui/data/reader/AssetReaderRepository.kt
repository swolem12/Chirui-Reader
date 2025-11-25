package com.chirui.data.reader

import android.content.Context
import com.chirui.domain.DispatcherProvider
import com.chirui.domain.model.ReaderChapter
import com.chirui.domain.model.ReaderPage
import com.chirui.domain.reader.ReaderRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Singleton
class AssetReaderRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dispatchers: DispatcherProvider,
) : ReaderRepository {

    private val json = Json { ignoreUnknownKeys = true }

    override suspend fun loadChapter(chapterId: String): ReaderChapter? = withContext(dispatchers.io) {
        val raw = runCatching {
            context.assets.open("reader/chapters.json").use { stream ->
                stream.bufferedReader().readText()
            }
        }.getOrElse { return@withContext null }

        val payload = runCatching { json.decodeFromString(ReaderPayload.serializer(), raw) }.getOrNull()
            ?: return@withContext null

        val chapter = payload.chapters.firstOrNull { it.chapterId == chapterId } ?: return@withContext null

        ReaderChapter(
            chapterId = chapter.chapterId,
            mangaId = chapter.mangaId,
            mangaTitle = chapter.mangaTitle,
            chapterTitle = chapter.chapterTitle,
            pages = chapter.pages.map { page ->
                ReaderPage(
                    index = page.index,
                    imageUrl = page.imageUrl,
                    width = page.width,
                    height = page.height,
                )
            }
        )
    }

    @Serializable
    private data class ReaderPayload(val chapters: List<ReaderChapterPayload> = emptyList())

    @Serializable
    private data class ReaderChapterPayload(
        val chapterId: String,
        val mangaId: String,
        val mangaTitle: String,
        val chapterTitle: String,
        val pages: List<ReaderPagePayload> = emptyList(),
    )

    @Serializable
    private data class ReaderPagePayload(
        val index: Int,
        val imageUrl: String,
        val width: Int? = null,
        val height: Int? = null,
    )
}
