package com.chirui.reader.catalog

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * Kotatsu-style tabs for Explore screen:
 * - Discover: Browse and search manga from sources
 * - Sources: Manage enabled/disabled sources
 */
private enum class ExploreTab(val label: String) {
    Discover("Discover"),
    Sources("Sources"),
}

/**
 * Explore screen matching Kotatsu's design pattern.
 * Contains two tabs: Discover (browse manga) and Sources (manage sources)
 */
@Composable
fun CatalogScreen(onOpenManga: (String) -> Unit) {
    var selectedTab by rememberSaveable { mutableStateOf(ExploreTab.Discover) }

    Column(modifier = Modifier.fillMaxSize()) {
        // Kotatsu-style tab row with indicator
        TabRow(
            selectedTabIndex = selectedTab.ordinal,
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.primary,
            indicator = { tabPositions ->
                if (selectedTab.ordinal < tabPositions.size) {
                    TabRowDefaults.SecondaryIndicator(
                        modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab.ordinal]),
                        height = 3.dp,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        ) {
            ExploreTab.values().forEach { tab ->
                Tab(
                    selected = tab == selectedTab,
                    onClick = { selectedTab = tab },
                    text = { 
                        Text(
                            text = tab.label,
                            style = MaterialTheme.typography.titleSmall,
                            color = if (tab == selectedTab) {
                                MaterialTheme.colorScheme.primary
                            } else {
                                MaterialTheme.colorScheme.onSurfaceVariant
                            }
                        ) 
                    },
                )
            }
        }

        // Tab content
        when (selectedTab) {
            ExploreTab.Discover -> CatalogDiscoverTab(onOpenManga = onOpenManga)
            ExploreTab.Sources -> SourceListTab()
        }
    }
}
