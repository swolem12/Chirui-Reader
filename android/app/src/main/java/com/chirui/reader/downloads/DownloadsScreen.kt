package com.chirui.reader.downloads

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.chirui.domain.model.DownloadItem
import com.chirui.domain.model.DownloadStatus

@Composable
fun DownloadsScreen(viewModel: DownloadsViewModel = hiltViewModel()) {
    val state by viewModel.state.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        DownloadSummaryRow(
            active = state.activeCount,
            completed = state.completedCount,
            queued = state.queue.count { it.status == DownloadStatus.QUEUED }
        )

        if (state.queue.isEmpty()) {
            EmptyDownloads()
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(state.queue) { item ->
                    DownloadCard(
                        item = item,
                        onPause = { viewModel.pause(item.id) },
                        onResume = { viewModel.resume(item.id) },
                        onCancel = { viewModel.cancel(item.id) },
                        onRetry = { viewModel.retry(item.id) },
                    )
                }
            }
        }
    }
}

@Composable
private fun DownloadSummaryRow(active: Int, completed: Int, queued: Int) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        SummaryChip(text = "$active active")
        SummaryChip(text = "$queued queued")
        SummaryChip(text = "$completed done")
    }
}

@Composable
private fun SummaryChip(text: String) {
    AssistChip(onClick = {}, label = { Text(text) })
}

@Composable
private fun DownloadCard(
    item: DownloadItem,
    onPause: () -> Unit,
    onResume: () -> Unit,
    onCancel: () -> Unit,
    onRetry: () -> Unit,
) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.elevatedCardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(
                    imageVector = when (item.status) {
                        DownloadStatus.DOWNLOADING -> Icons.Default.Download
                        DownloadStatus.COMPLETED -> Icons.Default.CheckCircle
                        DownloadStatus.PAUSED -> Icons.Default.Pause
                        DownloadStatus.FAILED -> Icons.Default.Refresh
                        DownloadStatus.CANCELED -> Icons.Default.Cancel
                        DownloadStatus.QUEUED -> Icons.Default.Download
                    },
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.titleMedium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = item.source,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            LinearProgressIndicator(
                progress = { item.progress.coerceIn(0f, 1f) },
                modifier = Modifier.fillMaxWidth()
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = item.statusLabel(),
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary
                    )
                    if (item.etaMinutes != null || item.sizeLabel != null) {
                        Text(
                            text = listOfNotNull(
                                item.sizeLabel,
                                item.etaMinutes?.let { "ETA ${it}m" }
                            ).joinToString(" · "),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    when (item.status) {
                        DownloadStatus.DOWNLOADING -> {
                            IconButton(onClick = onPause) { Icon(Icons.Default.Pause, contentDescription = "Pause") }
                            IconButton(onClick = onCancel) { Icon(Icons.Default.Cancel, contentDescription = "Cancel") }
                        }
                        DownloadStatus.PAUSED, DownloadStatus.QUEUED -> {
                            IconButton(onClick = onResume) { Icon(Icons.Default.PlayArrow, contentDescription = "Resume") }
                            IconButton(onClick = onCancel) { Icon(Icons.Default.Cancel, contentDescription = "Cancel") }
                        }
                        DownloadStatus.FAILED, DownloadStatus.CANCELED -> {
                            IconButton(onClick = onRetry) { Icon(Icons.Default.Refresh, contentDescription = "Retry") }
                        }
                        DownloadStatus.COMPLETED -> {
                            IconButton(onClick = onCancel) { Icon(Icons.Default.Cancel, contentDescription = "Remove") }
                        }
                    }
                }
            }

            if (item.chapters.isNotEmpty()) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        item.chapters.forEach { chapter ->
                            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                Text(
                                    text = chapter.name,
                                    style = MaterialTheme.typography.bodyMedium,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                LinearProgressIndicator(
                                    progress = { chapter.progress.coerceIn(0f, 1f) },
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun EmptyDownloads() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text("No downloads yet", style = MaterialTheme.typography.titleMedium)
            Text(
                "New downloads from catalog detail and reader actions will appear here.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(modifier = Modifier.height(4.dp))
        }
    }
}

private fun DownloadItem.statusLabel(): String = when (status) {
    DownloadStatus.DOWNLOADING -> "Downloading ${(progress * 100).toInt()}%"
    DownloadStatus.QUEUED -> "Queued"
    DownloadStatus.PAUSED -> "Paused"
    DownloadStatus.COMPLETED -> "Completed"
    DownloadStatus.FAILED -> "Failed"
    DownloadStatus.CANCELED -> "Canceled"
}
