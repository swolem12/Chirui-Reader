package com.chirui.reader.downloads

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chirui.domain.downloads.DownloadRepository
import com.chirui.domain.model.DownloadItem
import com.chirui.domain.model.DownloadStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class DownloadsViewModel @Inject constructor(
    private val downloads: DownloadRepository,
) : ViewModel() {

    val state: StateFlow<DownloadUiState> = downloads.observeQueue()
        .map { queue ->
            DownloadUiState(
                queue = queue,
                activeCount = queue.count { it.status == DownloadStatus.DOWNLOADING },
                completedCount = queue.count { it.status == DownloadStatus.COMPLETED },
            )
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = DownloadUiState(),
        )

    fun pause(id: String) {
        viewModelScope.launch { downloads.pause(id) }
    }

    fun resume(id: String) {
        viewModelScope.launch { downloads.resume(id) }
    }

    fun cancel(id: String) {
        viewModelScope.launch { downloads.cancel(id) }
    }

    fun retry(id: String) {
        viewModelScope.launch { downloads.retry(id) }
    }
}

data class DownloadUiState(
    val queue: List<DownloadItem> = emptyList(),
    val activeCount: Int = 0,
    val completedCount: Int = 0,
)
