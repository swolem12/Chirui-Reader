package com.chirui.reader.reader

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chirui.domain.reader.ReaderRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

@HiltViewModel
class ReaderViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val readerRepository: ReaderRepository,
) : ViewModel() {

    private val chapterId: String = savedStateHandle.get<String>("chapterId").orEmpty()

    private val _uiState = MutableStateFlow(ReaderUiState(loading = true))
    val uiState: StateFlow<ReaderUiState> = _uiState

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true, error = null) }
            runCatching { readerRepository.loadChapter(chapterId) }
                .onSuccess { chapter ->
                    _uiState.value = ReaderUiState(
                        loading = false,
                        chapterId = chapterId,
                        chapter = chapter,
                        error = if (chapter == null) "Chapter not found" else null,
                        currentPage = 0,
                    )
                }
                .onFailure { throwable ->
                    _uiState.value = ReaderUiState(
                        loading = false,
                        chapterId = chapterId,
                        chapter = null,
                        error = throwable.message ?: "Failed to load chapter",
                    )
                }
        }
    }

    fun onPageChanged(page: Int) {
        _uiState.update { state -> state.copy(currentPage = page.coerceAtLeast(0)) }
    }
}

data class ReaderUiState(
    val loading: Boolean = false,
    val chapterId: String? = null,
    val chapter: com.chirui.domain.model.ReaderChapter? = null,
    val error: String? = null,
    val currentPage: Int = 0,
)
