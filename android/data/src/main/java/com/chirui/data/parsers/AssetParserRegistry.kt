package com.chirui.data.parsers

import android.content.Context
import android.util.Log
import com.chirui.domain.DispatcherProvider
import com.chirui.domain.model.SourceDescriptor
import com.chirui.parsers.ParserRegistry
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
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Singleton
class AssetParserRegistry @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dispatchers: DispatcherProvider,
) : ParserRegistry {

    private val json = Json { ignoreUnknownKeys = true }
    private val scope = CoroutineScope(dispatchers.io + SupervisorJob())
    private val sources = MutableStateFlow<List<SourceDescriptor>>(emptyList())
    private val enabledState = mutableMapOf<String, Boolean>()

    init {
        scope.launch { reload() }
    }

    override fun availableSources(): Flow<List<SourceDescriptor>> = sources.asStateFlow()

    override suspend fun setEnabled(sourceId: String, enabled: Boolean) {
        enabledState[sourceId] = enabled
        sources.value = sources.value.map { descriptor ->
            if (descriptor.id == sourceId) descriptor.copy(enabled = enabled) else descriptor
        }
    }

    override suspend fun reload() {
        val data = runCatching { readSourceJson() }.getOrElse { throwable ->
            Log.e("AssetParserRegistry", "Failed to load source metadata", throwable)
            emptyList()
        }
        sources.value = data.map { descriptor ->
            val cachedEnabled = enabledState[descriptor.id]
            if (cachedEnabled == null) descriptor else descriptor.copy(enabled = cachedEnabled)
        }
    }

    private suspend fun readSourceJson(): List<SourceDescriptor> = withContext(dispatchers.io) {
        val assetManager = context.assets
        val fileContent = assetManager
            .open("sources/sources.json")
            .bufferedReader()
            .use { it.readText() }

        val records = json.decodeFromString<List<SourceRecord>>(fileContent)
        records.map { record ->
            SourceDescriptor(
                id = record.id,
                name = record.name,
                language = record.language,
                description = record.description,
                nsfw = record.nsfw,
                iconPath = record.iconPath,
                enabled = record.enabled ?: true,
            )
        }
    }
}

@Serializable
private data class SourceRecord(
    val id: String,
    val name: String,
    val language: String,
    val description: String? = null,
    val nsfw: Boolean = false,
    @SerialName("iconPath") val iconPath: String? = null,
    val enabled: Boolean? = null,
)
