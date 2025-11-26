package com.chirui.reader.catalog

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chirui.domain.catalog.CatalogRepository
import com.chirui.domain.model.MangaStatus
import com.chirui.domain.model.MangaSummary
import com.chirui.domain.model.SourceDescriptor
import com.chirui.parsers.ParserRegistry
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlin.math.ceil
import kotlin.math.max
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

private const val PAGE_SIZE = 6

@HiltViewModel
class CatalogGridViewModel @Inject constructor(
    private val catalogRepository: CatalogRepository,
    private val parserRegistry: ParserRegistry,
) : ViewModel() {

    private val query = MutableStateFlow("")
    private val selectedLanguages = MutableStateFlow(emptySet<String>())
    private val selectedSources = MutableStateFlow(emptySet<String>())
    private val onlyEnabledSources = MutableStateFlow(true)
    private val page = MutableStateFlow(0)

    val uiState: StateFlow<CatalogUiState> = combine(
        combine(
            catalogRepository.catalogEntries(),
            parserRegistry.availableSources(),
            query,
            selectedLanguages,
        ) { catalogEntries, sourceDescriptors, queryValue, languageSelection ->
            CatalogInputs(catalogEntries, sourceDescriptors, queryValue, languageSelection)
        },
        combine(
            selectedSources,
            page,
            onlyEnabledSources,
        ) { sourceSelection, pageIndex, enforceEnabledSources ->
            CatalogFilters(sourceSelection, pageIndex, enforceEnabledSources)
        }
    ) { inputs, filters ->
        val (catalogEntries, sourceDescriptors, queryValue, languageSelection) = inputs
        val (sourceSelection, pageIndex, enforceEnabledSources) = filters

        val enabledSourceIds = sourceDescriptors.filter { it.enabled }.map { it.id }.toSet()
        val availableSourceIds = sourceDescriptors.map { it.id }.toSet()
        val sourceFilter = if (sourceSelection.isEmpty()) {
            if (enforceEnabledSources) enabledSourceIds else availableSourceIds
        } else {
            sourceSelection
        }

        val filtered = catalogEntries.filter { entry ->
            val matchesQuery = queryValue.isBlank() ||
                entry.title.contains(queryValue, ignoreCase = true) ||
                entry.tags.any { tag -> tag.contains(queryValue, ignoreCase = true) }
            val matchesLanguage = languageSelection.isEmpty() || languageSelection.contains(entry.language)
            val matchesSource = sourceFilter.isEmpty() || sourceFilter.contains(entry.sourceId)
            val respectsEnabled = !enforceEnabledSources ||
                enabledSourceIds.isEmpty() ||
                enabledSourceIds.contains(entry.sourceId)
            matchesQuery && matchesLanguage && matchesSource && respectsEnabled
        }

        val availableLanguages = catalogEntries.map { it.language }.distinct().sorted()
        val totalPages = max(1, ceil(filtered.size / PAGE_SIZE.toDouble()).toInt())
        val currentPage = pageIndex.coerceIn(0, totalPages - 1)
        val pageItems = filtered
            .drop(currentPage * PAGE_SIZE)
            .take(PAGE_SIZE)
            .map { entry ->
                val sourceName = sourceDescriptors.firstOrNull { descriptor -> descriptor.id == entry.sourceId }?.name
                    ?: entry.sourceName
                entry.toUiModel(sourceName)
            }

        CatalogUiState(
            items = pageItems,
            query = queryValue,
            languages = availableLanguages,
            selectedLanguages = languageSelection,
            sources = sourceDescriptors.map { descriptor ->
                SourceFilterUiModel(
                    id = descriptor.id,
                    name = descriptor.name,
                    enabled = descriptor.enabled,
                    language = descriptor.language,
                )
            },
            selectedSources = sourceFilter,
            page = currentPage,
            totalPages = totalPages,
            loading = false,
            onlyEnabledSources = enforceEnabledSources,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = CatalogUiState(loading = true),
    )

    init {
        viewModelScope.launch {
            catalogRepository.reload()
            parserRegistry.reload()
        }
    }

    fun onQueryChange(value: String) {
        query.value = value
        page.value = 0
    }

    fun onToggleLanguage(language: String) {
        selectedLanguages.update { current ->
            if (current.contains(language)) current - language else current + language
        }
        page.value = 0
    }

    fun onToggleSource(sourceId: String) {
        selectedSources.update { current ->
            if (current.contains(sourceId)) current - sourceId else current + sourceId
        }
        page.value = 0
    }

    fun onToggleEnabledFilter(enabledOnly: Boolean) {
        onlyEnabledSources.value = enabledOnly
        if (enabledOnly) {
            selectedSources.value = emptySet()
        }
        page.value = 0
    }

    fun onNextPage() {
        val currentState = uiState.value
        if (currentState.page < currentState.totalPages - 1) {
            page.value = currentState.page + 1
        }
    }

    fun onPreviousPage() {
        val currentState = uiState.value
        if (currentState.page > 0) {
            page.value = currentState.page - 1
        }
    }

    fun onRefresh() {
        viewModelScope.launch { catalogRepository.reload() }
    }

    fun onClearFilters() {
        selectedLanguages.value = emptySet()
        selectedSources.value = emptySet()
        query.value = ""
        page.value = 0
    }
}

private fun MangaSummary.toUiModel(sourceName: String?): CatalogItemUiModel = CatalogItemUiModel(
    id = id,
    title = title,
    sourceName = sourceName ?: this.sourceName,
    language = language,
    coverUrl = coverUrl,
    nsfw = nsfw,
    status = status,
    tags = tags,
)

data class CatalogUiState(
    val items: List<CatalogItemUiModel> = emptyList(),
    val query: String = "",
    val languages: List<String> = emptyList(),
    val selectedLanguages: Set<String> = emptySet(),
    val sources: List<SourceFilterUiModel> = emptyList(),
    val selectedSources: Set<String> = emptySet(),
    val page: Int = 0,
    val totalPages: Int = 1,
    val loading: Boolean = false,
    val onlyEnabledSources: Boolean = true,
    val error: String? = null,
)

data class CatalogItemUiModel(
    val id: String,
    val title: String,
    val sourceName: String,
    val language: String,
    val coverUrl: String?,
    val nsfw: Boolean,
    val status: MangaStatus,
    val tags: List<String>,
)

data class SourceFilterUiModel(
    val id: String,
    val name: String,
    val enabled: Boolean,
    val language: String,
)

private data class CatalogInputs(
    val catalogEntries: List<MangaSummary>,
    val sourceDescriptors: List<SourceDescriptor>,
    val queryValue: String,
    val languageSelection: Set<String>,
)

private data class CatalogFilters(
    val sourceSelection: Set<String>,
    val pageIndex: Int,
    val enforceEnabledSources: Boolean,
)
