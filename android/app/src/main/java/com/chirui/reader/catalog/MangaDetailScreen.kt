package com.chirui.reader.catalog

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
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
import com.chirui.reader.ui.theme.CoverShapeLarge
import com.chirui.reader.ui.theme.KotatsuDimensions
import kotlin.math.absoluteValue

/**
 * Kotatsu-style manga detail screen
 * Layout matches activity_details.xml:
 * - Cover: 30% width, aspect ratio 13:18, corner radius 12dp
 * - Title and subtitle on right side
 * - Favorite chip with dropdown style
 * - Chapter list with bookmark/download icons
 */
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

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun MangaDetailContent(
    detail: MangaDetail,
    onToggleFavorite: () -> Unit,
    onShare: (MangaDetail) -> Unit,
    onOpenChapter: (ChapterSummary) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        // Header section with cover and basic info (Kotatsu layout)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(KotatsuDimensions.MarginNormal),
            horizontalArrangement = Arrangement.spacedBy(KotatsuDimensions.MarginNormal)
        ) {
            // Cover image (Kotatsu style - 30% width, 13:18 aspect ratio)
            CoverPreview(
                id = detail.summary.id, 
                modifier = Modifier
                    .fillMaxWidth(0.3f) // 30% width like Kotatsu
                    .height(166.dp) // Calculated: width * 18/13
            )
            
            // Title and info column (like activity_details.xml)
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Title (headlineSmall like Kotatsu)
                Text(
                    text = detail.summary.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    maxLines = 3, // details_title_lines
                    overflow = TextOverflow.Ellipsis,
                    color = MaterialTheme.colorScheme.onSurface
                )
                
                // Subtitle/Author (bodyMedium)
                detail.author?.let { author ->
                    Text(
                        text = author,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                Spacer(modifier = Modifier.height(KotatsuDimensions.MarginSmall))
                
                // Favorite chip (Kotatsu dropdown style with arrow)
                FilterChip(
                    selected = detail.favorite,
                    onClick = onToggleFavorite,
                    label = { 
                        Text(
                            text = if (detail.favorite) "In Favorites" else "Add to Favorites",
                            style = MaterialTheme.typography.labelLarge
                        ) 
                    },
                    leadingIcon = {
                        Icon(
                            imageVector = if (detail.favorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    trailingIcon = {
                        Icon(
                            Icons.Default.KeyboardArrowDown,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLeadingIconColor = MaterialTheme.colorScheme.primary,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
            }
        }
        
        // NSFW badges (like activity_details.xml)
        if (detail.summary.nsfw) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = KotatsuDimensions.MarginNormal),
                horizontalArrangement = Arrangement.End
            ) {
                Surface(
                    color = Color(0xFFFF8A65), // nsfw_18 color from Kotatsu
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = "18+",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            Spacer(modifier = Modifier.height(KotatsuDimensions.MarginSmall))
        }
        
        // Info table (status, source, chapters count)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = KotatsuDimensions.MarginNormal),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
            ),
            shape = RoundedCornerShape(12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(KotatsuDimensions.MarginNormal),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                InfoColumn(label = "Status", value = detail.status.name.lowercase().replaceFirstChar { it.uppercase() })
                InfoColumn(label = "Source", value = detail.summary.sourceName)
                InfoColumn(label = "Chapters", value = "${detail.chapters.size}")
            }
        }
        
        Spacer(modifier = Modifier.height(KotatsuDimensions.MarginNormal))
        
        // Description section (with More button like Kotatsu)
        val description = detail.description
        if (!description.isNullOrBlank()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = KotatsuDimensions.MarginSmall),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Description",
                    style = MaterialTheme.typography.titleSmall,
                    modifier = Modifier.padding(KotatsuDimensions.GridSpacing),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "More",
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .clickable { /* expand description */ }
                        .padding(KotatsuDimensions.GridSpacing)
                )
            }
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 4, // details_description_lines
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(horizontal = KotatsuDimensions.MarginNormal),
                lineHeight = MaterialTheme.typography.bodyMedium.lineHeight * 1.2f // lineSpacingMultiplier
            )
            Spacer(modifier = Modifier.height(KotatsuDimensions.MarginNormal))
        }
        
        // Tags/Genres section (Kotatsu style ChipsView)
        if (detail.tags.isNotEmpty()) {
            FlowRow(
                modifier = Modifier.padding(horizontal = KotatsuDimensions.ScreenPadding),
                horizontalArrangement = Arrangement.spacedBy(6.dp), // chipSpacingHorizontal
                verticalArrangement = Arrangement.spacedBy(6.dp) // chipSpacingVertical
            ) {
                detail.tags.forEach { tag ->
                    AssistChip(
                        onClick = { /* filter by tag */ },
                        label = { 
                            Text(
                                text = tag,
                                style = MaterialTheme.typography.labelMedium
                            ) 
                        },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    )
                }
            }
            Spacer(modifier = Modifier.height(KotatsuDimensions.MarginNormal))
        }
        
        // Divider before chapters
        HorizontalDivider(
            modifier = Modifier.padding(horizontal = KotatsuDimensions.MarginNormal),
            color = MaterialTheme.colorScheme.outlineVariant
        )
        
        // Chapters section header (Kotatsu bottom sheet peek header style)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(KotatsuDimensions.MarginNormal),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "${detail.chapters.size} Chapters",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )
            
            // Read button (min width 92dp like Kotatsu)
            if (detail.chapters.isNotEmpty()) {
                Button(
                    onClick = { onOpenChapter(detail.chapters.first()) },
                    modifier = Modifier.width(KotatsuDimensions.ReadButtonMinWidth),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Icon(
                        Icons.Default.PlayArrow,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Read")
                }
            }
        }
        
        // Chapter list (matching item_chapter.xml layout)
        if (detail.chapters.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No chapters available",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            detail.chapters.forEachIndexed { index, chapter ->
                ChapterRow(
                    chapter = chapter, 
                    onOpenChapter = onOpenChapter,
                    showDivider = index < detail.chapters.size - 1
                )
            }
        }
        
        Spacer(modifier = Modifier.height(KotatsuDimensions.MarginNormal))
    }
}

@Composable
private fun InfoColumn(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

/**
 * Chapter row matching Kotatsu's item_chapter.xml:
 * - Min height 48dp (chapter_list_item_height)
 * - Title with bodyLarge
 * - Description with bodySmall
 * - Bookmark and download icons on right
 */
@Composable
private fun ChapterRow(
    chapter: ChapterSummary, 
    onOpenChapter: (ChapterSummary) -> Unit,
    showDivider: Boolean = true
) {
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(KotatsuDimensions.ChapterListItemHeight)
                .clickable { onOpenChapter(chapter) }
                .padding(horizontal = KotatsuDimensions.MarginNormal),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Title and description column
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.Center
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = chapter.title,
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (chapter.readProgress >= 1f) {
                            MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                        } else {
                            MaterialTheme.colorScheme.onSurface
                        },
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    // Read check icon
                    if (chapter.readProgress >= 1f) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle, 
                            contentDescription = "Read",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
                chapter.number?.let { number ->
                    Text(
                        text = "Chapter ${number.toInt()}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            // Icons row (bookmark and download like item_chapter.xml)
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Bookmark icon
                Icon(
                    Icons.Default.Bookmark,
                    contentDescription = "Bookmarks",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.size(20.dp)
                )
                // Downloaded icon
                Icon(
                    Icons.Default.Storage,
                    contentDescription = "Downloaded",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
        
        if (showDivider) {
            HorizontalDivider(
                modifier = Modifier.padding(start = KotatsuDimensions.MarginNormal),
                color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
            )
        }
    }
}

@Composable
private fun StatusChip(status: MangaStatus, nsfw: Boolean) {
    val (label, containerColor, contentColor) = when {
        nsfw -> Triple("NSFW", MaterialTheme.colorScheme.errorContainer, MaterialTheme.colorScheme.error)
        status == MangaStatus.COMPLETED -> Triple("Completed", MaterialTheme.colorScheme.primaryContainer, MaterialTheme.colorScheme.primary)
        status == MangaStatus.ONGOING -> Triple("Ongoing", MaterialTheme.colorScheme.tertiaryContainer, MaterialTheme.colorScheme.tertiary)
        status == MangaStatus.HIATUS -> Triple("Hiatus", MaterialTheme.colorScheme.secondaryContainer, MaterialTheme.colorScheme.secondary)
        status == MangaStatus.CANCELLED -> Triple("Cancelled", MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.colorScheme.outline)
        else -> Triple("Unknown", MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.colorScheme.outline)
    }
    Surface(
        color = containerColor,
        contentColor = contentColor,
        shape = RoundedCornerShape(4.dp)
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Medium
        )
    }
}

/**
 * Cover preview with Kotatsu styling:
 * - 12dp corner radius (ShapeAppearanceOverlay.Kotatsu.Cover)
 * - Gradient placeholder with theme colors
 */
@Composable
private fun CoverPreview(id: String, modifier: Modifier = Modifier) {
    val colors = remember(id) {
        val hash = id.hashCode().absoluteValue
        val primary = Color(0xFF0059C8).copy(alpha = 0.9f) // Kotatsu blue
        val alt = Color(0xFF4DD0E1).copy(alpha = 0.9f)
        val accent = Color(0xFF725573).copy(alpha = 0.9f)
        val palette = listOf(primary, alt, accent)
        val first = palette[hash % palette.size]
        val second = palette[(hash / 3) % palette.size]
        listOf(first, second)
    }
    
    Box(
        modifier = modifier
            .clip(CoverShapeLarge) // 12dp corner radius
            .background(Brush.verticalGradient(colors)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = id.take(2).uppercase(),
            style = MaterialTheme.typography.headlineMedium,
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun LoadingState() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp), 
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(
            color = MaterialTheme.colorScheme.primary
        )
    }
}

@Composable
private fun ErrorState(message: String, onRetry: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = message, 
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) {
            Icon(Icons.Default.Refresh, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Retry")
        }
    }
}
