package com.chirui.reader.downloads

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.*
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.UUID

/**
 * Lightweight wrapper that schedules/cancels WorkManager workers and exposes an in-memory queue StateFlow.
 * This implementation delegates actual queue state to InMemoryQueueManager.
 */
class WorkManagerDownloadRepository(
    private val context: Context,
    private val workManager: WorkManager,
    private val queueManager: InMemoryQueueManager,
) : DownloadRepository {

    private val _queue: MutableStateFlow<List<DownloadItem>> = queueManager.queue
    override fun observeQueue(): StateFlow<List<DownloadItem>> = _queue.asStateFlow()

    override suspend fun pause(id: String) {
        queueManager.pause(id)
        // Optionally cancel the running worker
        workManager.cancelUniqueWork(workerNameFor(id))
    }

    override suspend fun resume(id: String) {
        queueManager.resume(id)
        scheduleWorkerFor(id)
    }

    override suspend fun cancel(id: String) {
        queueManager.cancel(id)
        workManager.cancelUniqueWork(workerNameFor(id))
    }

    override suspend fun retry(id: String) {
        queueManager.retry(id)
        scheduleWorkerFor(id)
    }

    fun enqueue(item: DownloadItem) {
        queueManager.enqueue(item)
        scheduleWorkerFor(item.id)
    }

    private fun scheduleWorkerFor(id: String) {
        val item = queueManager.queue.value.find { it.id == id } ?: return
        if (item.status == DownloadStatus.COMPLETED || item.status == DownloadStatus.CANCELED) return

        val input = Data.Builder()
            .putString("download_id", id)
            .build()

        val work = OneTimeWorkRequestBuilder<DownloadWorker>()
            .setInputData(input)
            .addTag(workerNameFor(id))
            .build()

        workManager.enqueueUniqueWork(workerNameFor(id), ExistingWorkPolicy.KEEP, work)
    }

    private fun workerNameFor(id: String) = "download_worker_$id"
}