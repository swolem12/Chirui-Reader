package com.chirui.domain.downloads

import com.chirui.domain.model.DownloadItem
import kotlinx.coroutines.flow.Flow

interface DownloadRepository {
    fun observeQueue(): Flow<List<DownloadItem>>

    suspend fun pause(id: String)

    suspend fun resume(id: String)

    suspend fun cancel(id: String)

    suspend fun retry(id: String)
}
