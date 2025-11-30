package com.chirui.reader.catalog

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.FilterAlt
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
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
import com.chirui.domain.model.MangaStatus
import kotlin.math.absoluteValue

/**
 * Kotatsu-style Discover tab with manga grid
 * Clean layout without visible filters (matches Kotatsu Explore screen)
 */
@Composable
fun CatalogDiscoverTab(
    onOpenManga: (String) -> Unit,
    viewModel: CatalogGridViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 8.dp, vertical = 8.dp)
    ) {
        when {
            uiState.loading -> CatalogLoadingCard()
            uiState.items.isEmpty() -> CatalogEmptyState()
            else -> CatalogGrid(
                items = uiState.items,
                page = uiState.page,
                totalPages = uiState.totalPages,
                onPrevious = viewModel::onPreviousPage,
                onNext = viewModel::onNextPage,
                onOpenManga = onOpenManga,
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CatalogSearchBar(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    onClear: () -> Unit,
    onRefresh: () -> Unit,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        placeholder = { Text(placeholder) },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        },
        trailingIcon = {
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                TextButton(onClick = onClear) { Text("Reset") }
                FilledIconButton(onClick = onRefresh) {
                    Icon(imageVector = Icons.Default.Refresh, contentDescription = "Refresh catalog")
                }
            }
        },
        singleLine = true,
        colors = TextFieldDefaults.outlinedTextFieldColors(
            focusedBorderColor = MaterialTheme.colorScheme.primary,
            unfocusedBorderColor = MaterialTheme.colorScheme.outline
        )
    )
}

@Composable
private fun FilterSection(
    uiState: CatalogUiState,
    onToggleLanguage: (String) -> Unit,
    onToggleSource: (String) -> Unit,
    onToggleEnabled: (Boolean) -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(
                    imageVector = Icons.Default.FilterAlt,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Filters",
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            if (uiState.languages.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "Languages",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        uiState.languages.forEach { language ->
                            val isSelected = uiState.selectedLanguages.contains(language)
                            AssistChip(
                                onClick = { onToggleLanguage(language) },
                                label = { Text(language.uppercase()) },
                                colors = AssistChipDefaults.assistChipColors(
                                    containerColor = if (isSelected) {
                                        MaterialTheme.colorScheme.primaryContainer
                                    } else {
                                        MaterialTheme.colorScheme.surface
                                    }
                                )
                            )
                        }
                    }
                }
            }

            if (uiState.sources.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "Sources",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    SourceFilterRow(
                        sources = uiState.sources,
                        selected = uiState.selectedSources,
                        enabledOnly = uiState.onlyEnabledSources,
                        onToggleSource = onToggleSource,
                        onToggleEnabled = onToggleEnabled,
                    )
                }
            }
        }
    }
}

@Composable
private fun SourceFilterRow(
    sources: List<SourceFilterUiModel>,
    selected: Set<String>,
    enabledOnly: Boolean,
    onToggleSource: (String) -> Unit,
    onToggleEnabled: (Boolean) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Enabled only",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Switch(
                checked = enabledOnly,
                onCheckedChange = onToggleEnabled,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = MaterialTheme.colorScheme.onPrimary,
                    checkedTrackColor = MaterialTheme.colorScheme.primary,
                )
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            sources.forEach { source ->
                val isSelected = selected.contains(source.id)
                AssistChip(
                    onClick = { onToggleSource(source.id) },
                    label = { Text(source.name) },
                    leadingIcon = {
                        SourceLeadingIcon(language = source.language, enabled = source.enabled)
                    },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = when {
                            !source.enabled -> MaterialTheme.colorScheme.surfaceVariant
                            isSelected -> MaterialTheme.colorScheme.primaryContainer
                            else -> MaterialTheme.colorScheme.surface
                        }
                    )
                )
            }
        }
    }
}

@Composable
private fun SourceLeadingIcon(language: String, enabled: Boolean) {
    val background = if (enabled) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
    val contentColor = if (enabled) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
    Surface(
        modifier = Modifier.size(20.dp),
        color = background,
        shape = RoundedCornerShape(6.dp),
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = language.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = contentColor
            )
        }
    }
}

/**
 * Kotatsu-style grid with compact manga cards
 */
@Composable
private fun CatalogGrid(
    items: List<CatalogItemUiModel>,
    page: Int,
    totalPages: Int,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onOpenManga: (String) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 110.dp), // Tighter grid like Kotatsu
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxHeight(0.9f)
        ) {
            items(items, key = { it.id }) { item ->
                CatalogCard(item = item, onOpenManga = onOpenManga)
            }
        }

        PaginationBar(
            page = page,
            totalPages = totalPages,
            onPrevious = onPrevious,
            onNext = onNext
        )
    }
}

/**
 * Kotatsu-style manga card with cover image and title below
 * Matches the item_manga_grid.xml layout pattern
 */
@Composable
private fun CatalogCard(
    item: CatalogItemUiModel,
    onOpenManga: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .clickable { onOpenManga(item.id) }
            .padding(6.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        // Cover image with badges overlay (Kotatsu style)
        Box(modifier = Modifier.fillMaxWidth()) {
            CoverPlaceholder(id = item.id)
            
            // NSFW badge (top-left like Kotatsu)
            if (item.nsfw) {
                Surface(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(4.dp),
                    color = MaterialTheme.colorScheme.error,
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = "18+",
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onError,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
        
        // Title (2 lines max, like Kotatsu)
        Text(
            text = item.title,
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(vertical = 4.dp)
        )
    }
}

/**
 * Kotatsu-style cover placeholder with aspect ratio 13:18
 */
@Composable
private fun CoverPlaceholder(id: String) {
    val colors = rememberCoverColors(id)
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(
                Brush.verticalGradient(
                    colors = colors
                )
            )
            .fillMaxWidth()
            .height(180.dp), // Aspect ratio similar to Kotatsu (13:18)
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = id.take(2).uppercase(),
            style = MaterialTheme.typography.headlineSmall,
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
    }
}

/**
 * Kotatsu-style cover color palette using theme colors
 */
@Composable
private fun rememberCoverColors(seed: String): List<Color> {
    val hash = seed.hashCode().absoluteValue
    val primary = MaterialTheme.colorScheme.primary.copy(alpha = 0.85f)
    val tertiary = MaterialTheme.colorScheme.tertiary.copy(alpha = 0.85f)
    val secondary = MaterialTheme.colorScheme.secondary.copy(alpha = 0.85f)
    val palette = listOf(primary, tertiary, secondary)
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

@Composable
private fun PaginationBar(
    page: Int,
    totalPages: Int,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            FilledIconButton(onClick = onPrevious, enabled = page > 0) {
                Icon(imageVector = Icons.Default.ChevronLeft, contentDescription = "Previous page")
            }
            FilledIconButton(onClick = onNext, enabled = page < totalPages - 1) {
                Icon(imageVector = Icons.Default.ChevronRight, contentDescription = "Next page")
            }
            Text(
                text = "Page ${page + 1} of $totalPages",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
private fun CatalogLoadingCard() {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            CircularProgressIndicator(modifier = Modifier.size(28.dp))
            Column {
                Text(text = "Loading catalog…", style = MaterialTheme.typography.titleSmall)
                Text(
                    text = "Parsing Kotatsu fixtures from bundled assets.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun CatalogEmptyState() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "No catalog results",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Adjust filters or import more Kotatsu fixtures from your forks.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
