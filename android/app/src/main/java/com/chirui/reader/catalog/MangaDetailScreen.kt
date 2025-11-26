package com.chirui.reader.catalog

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.chirui.domain.model.ChapterSummary
import com.chirui.domain.model.MangaDetail
import com.chirui.domain.model.MangaStatus
import kotlin.math.absoluteValue

@Composable
fun MangaDetailScreen(
    onShare: (MangaDetail) -> Unit,
    onOpenChapter: (ChapterSummary) -> Unit,
    viewModel: MangaDetailViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val detail = state.detail

    when {
        state.loading -> LoadingState()
        state.error != null -> ErrorState(message = state.error ?: "", onRetry = viewModel::refresh)
        detail != null -> MangaDetailContent(
            detail = detail,
            onToggleFavorite = viewModel::onToggleFavorite,
            onShare = onShare,
            onOpenChapter = onOpenChapter,
        )
    }
}

@Composable
private fun MangaDetailContent(
    detail: MangaDetail,
    onToggleFavorite: () -> Unit,
    onShare: (MangaDetail) -> Unit,
    onOpenChapter: (ChapterSummary) -> Unit,
) {
    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            CoverPreview(id = detail.summary.id, modifier = Modifier.weight(1f))
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = detail.summary.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = "${detail.summary.sourceName} · ${detail.summary.language.uppercase()}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatusBadge(status = detail.status, nsfw = detail.summary.nsfw)
                    AssistChip(
                        onClick = onToggleFavorite,
                        leadingIcon = {
                            Icon(
                                imageVector = if (detail.favorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                contentDescription = null,
                                tint = if (detail.favorite) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        },
                        label = { Text(if (detail.favorite) "Favorited" else "Add to library") },
                    )
                }
                if (detail.tags.isNotEmpty()) {
                    FlowingTags(tags = detail.tags)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = { onShare(detail) }) {
                        Icon(Icons.Default.Share, contentDescription = null)
                        Text(text = "Share", modifier = Modifier.padding(start = 6.dp))
                    }
                    Button(
                        onClick = { /* download pipeline placeholder */ },
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                    ) {
                        Icon(Icons.Default.CloudDownload, contentDescription = null)
                        Text(text = "Download", modifier = Modifier.padding(start = 6.dp))
                    }
                }
            }
        }

        val description = detail.description
        if (!description.isNullOrBlank()) {
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
                Text(
                    text = description,
                    modifier = Modifier.padding(12.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }

        MetadataSection(detail = detail)

        ChapterSection(chapters = detail.chapters, onOpenChapter = onOpenChapter)
    }
}

@Composable
private fun MetadataSection(detail: MangaDetail) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = "Metadata", style = MaterialTheme.typography.titleMedium)
            detail.author?.let {
                Text(
                    text = "Author: $it",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            detail.artist?.let {
                Text(
                    text = "Artist: $it",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            detail.sourceUrl?.let {
                Text(
                    text = "Source link: $it",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
private fun ChapterSection(chapters: List<ChapterSummary>, onOpenChapter: (ChapterSummary) -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = "Chapters", style = MaterialTheme.typography.titleMedium)
            if (chapters.isEmpty()) {
                Text(
                    text = "No chapters yet — add parser outputs or sync assets.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                chapters.forEach { chapter ->
                    ChapterRow(chapter = chapter, onOpenChapter = onOpenChapter)
                }
            }
        }
    }
}

@Composable
private fun ChapterRow(chapter: ChapterSummary, onOpenChapter: (ChapterSummary) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = chapter.title,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface
            )
            val chapterLabel = chapter.number?.let { number ->
                "Chapter ${number.toInt()}"
            } ?: "Chapter"
            Text(
                text = chapterLabel,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            AssistChip(onClick = { onOpenChapter(chapter) }, label = { Text(text = "Read") })
            AssistChip(
                onClick = { /* download hook */ },
                leadingIcon = { Icon(Icons.Default.CloudDownload, contentDescription = null) },
                label = { Text(text = "Download") },
            )
            if (chapter.readProgress >= 1f) {
                Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}

@Composable
private fun FlowingTags(tags: List<String>) {
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        tags.take(4).forEach { tag ->
            AssistChip(onClick = {}, label = { Text(tag) })
        }
    }
}

@Composable
private fun CoverPreview(id: String, modifier: Modifier = Modifier) {
    val colors = rememberCoverColors(id)
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Brush.verticalGradient(colors))
            .height(200.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = id.take(3).uppercase(),
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onPrimary
        )
    }
}

@Composable
private fun LoadingState() {
    Box(modifier = Modifier.fillMaxWidth().padding(24.dp), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ErrorState(message: String, onRetry: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = message, style = MaterialTheme.typography.bodyLarge)
        Button(onClick = onRetry) {
            Icon(Icons.Default.Refresh, contentDescription = null)
            Text(text = "Retry", modifier = Modifier.padding(start = 6.dp))
        }
    }
}

@Composable
private fun rememberCoverColors(seed: String): List<Color> {
    val hash = seed.hashCode().absoluteValue
    val primary = Color(0xFF5E81F4).copy(alpha = 0.9f)
    val alt = Color(0xFF4DD0E1).copy(alpha = 0.9f)
    val accent = Color(0xFFFFB74D).copy(alpha = 0.9f)
    val palette = listOf(primary, alt, accent)
    val first = palette[hash % palette.size]
    val second = palette[(hash / 3) % palette.size]
    return listOf(first, second)
}

@Composable
private fun StatusBadge(status: MangaStatus, nsfw: Boolean) {
    val (label, color) = when {
        nsfw -> "NSFW" to MaterialTheme.colorScheme.error
        status == MangaStatus.COMPLETED -> "Completed" to MaterialTheme.colorScheme.primary
        status == MangaStatus.ONGOING -> "Ongoing" to MaterialTheme.colorScheme.tertiary
        status == MangaStatus.HIATUS -> "Hiatus" to MaterialTheme.colorScheme.secondary
        status == MangaStatus.CANCELLED -> "Cancelled" to MaterialTheme.colorScheme.outline
        else -> "Unknown" to MaterialTheme.colorScheme.outline
    }
    Surface(
        color = color.copy(alpha = 0.16f),
        contentColor = color,
        shape = RoundedCornerShape(8.dp)
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.Bold
        )
    }
}
