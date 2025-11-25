package com.chirui.reader.catalog

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chirui.domain.catalog.CatalogRepository
import com.chirui.domain.model.MangaDetail
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

@HiltViewModel
class MangaDetailViewModel @Inject constructor(
    private val catalogRepository: CatalogRepository,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val mangaId: String = savedStateHandle.get<String>("mangaId").orEmpty()

    private val _uiState = MutableStateFlow(MangaDetailUiState(loading = true))
    val uiState: StateFlow<MangaDetailUiState> = _uiState

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true, error = null) }
            runCatching { catalogRepository.mangaDetail(mangaId) }
                .onSuccess { detail ->
                    _uiState.value = MangaDetailUiState(
                        loading = false,
                        detail = detail,
                        error = if (detail == null) "Manga not found" else null,
                    )
                }
                .onFailure { throwable ->
                    _uiState.value = MangaDetailUiState(
                        loading = false,
                        detail = null,
                        error = throwable.message ?: "Failed to load detail",
                    )
                }
        }
    }

    fun onToggleFavorite() {
        val currentDetail = _uiState.value.detail ?: return
        val nextFavorite = !currentDetail.favorite
        _uiState.update { state ->
            state.copy(detail = currentDetail.copy(favorite = nextFavorite))
        }
        viewModelScope.launch { catalogRepository.setFavorite(currentDetail.summary.id, nextFavorite) }
    }
}

data class MangaDetailUiState(
    val loading: Boolean = false,
    val detail: MangaDetail? = null,
    val error: String? = null,
)
