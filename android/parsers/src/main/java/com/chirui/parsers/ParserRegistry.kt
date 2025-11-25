package com.chirui.parsers

import com.chirui.domain.model.SourceDescriptor
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

interface ParserRegistry {
    fun availableSources(): Flow<List<SourceDescriptor>>
    suspend fun setEnabled(sourceId: String, enabled: Boolean)
    suspend fun reload()
}

class StaticParserRegistry @Inject constructor() : ParserRegistry {
    private val sources = MutableStateFlow(
        listOf(
            SourceDescriptor(
                id = "demo-english",
                name = "Kotatsu Demo (EN)",
                language = "en",
                description = "Placeholder source loaded before parser ingestion is wired.",
                nsfw = false,
                iconPath = null,
                enabled = true,
            ),
            SourceDescriptor(
                id = "demo-japanese",
                name = "Kotatsu Demo (JP)",
                language = "ja",
                description = "Scaffolds language filtering hooks.",
                nsfw = true,
                iconPath = null,
                enabled = true,
            ),
        )
    )

    override fun availableSources(): Flow<List<SourceDescriptor>> = sources.asStateFlow()

    override suspend fun setEnabled(sourceId: String, enabled: Boolean) {
        sources.value = sources.value.map { descriptor ->
            if (descriptor.id == sourceId) descriptor.copy(enabled = enabled) else descriptor
        }
    }

    override suspend fun reload() {
        // no-op for static bootstrap implementation
    }
}
