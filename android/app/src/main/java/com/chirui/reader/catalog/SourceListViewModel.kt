package com.chirui.reader.catalog

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chirui.domain.model.SourceDescriptor
import com.chirui.parsers.ParserRegistry
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class SourceListViewModel @Inject constructor(
    private val parserRegistry: ParserRegistry,
) : ViewModel() {

    private val query = MutableStateFlow("")
    private val selectedLanguages = MutableStateFlow(emptySet<String>())

    val uiState: StateFlow<SourceListUiState> = combine(
        parserRegistry.availableSources(),
        query,
        selectedLanguages,
    ) { sources, queryValue, languageSelection ->
        val filtered = sources.filter { descriptor ->
            val matchesQuery = queryValue.isBlank() ||
                descriptor.name.contains(queryValue, ignoreCase = true) ||
                (descriptor.description?.contains(queryValue, ignoreCase = true) ?: false)
            val matchesLanguage = languageSelection.isEmpty() || languageSelection.contains(descriptor.language)
            matchesQuery && matchesLanguage
        }
        val availableLanguages = sources.map { it.language }.distinct().sorted()

        SourceListUiState(
            sources = filtered.map { descriptor -> descriptor.toUiModel() },
            languages = availableLanguages,
            query = queryValue,
            selectedLanguages = languageSelection,
            loading = false,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = SourceListUiState(loading = true),
    )

    init {
        viewModelScope.launch { parserRegistry.reload() }
    }

    fun onQueryChange(value: String) {
        query.value = value
    }

    fun onToggleLanguage(language: String) {
        val current = selectedLanguages.value
        selectedLanguages.value = if (current.contains(language)) {
            current - language
        } else {
            current + language
        }
    }

    fun onToggleEnabled(sourceId: String, enabled: Boolean) {
        viewModelScope.launch { parserRegistry.setEnabled(sourceId, enabled) }
    }

    fun onRetry() {
        viewModelScope.launch { parserRegistry.reload() }
    }
}

private fun SourceDescriptor.toUiModel(): SourceUiModel = SourceUiModel(
    id = id,
    name = name,
    language = language,
    description = description,
    nsfw = nsfw,
    enabled = enabled,
)

data class SourceListUiState(
    val sources: List<SourceUiModel> = emptyList(),
    val languages: List<String> = emptyList(),
    val query: String = "",
    val selectedLanguages: Set<String> = emptySet(),
    val loading: Boolean = false,
    val error: String? = null,
)

data class SourceUiModel(
    val id: String,
    val name: String,
    val language: String,
    val description: String?,
    val nsfw: Boolean,
    val enabled: Boolean,
)
