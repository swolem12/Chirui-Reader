package com.chirui.reader.catalog

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier

private enum class CatalogTab(val label: String) {
    Discover("Discover"),
    Sources("Sources"),
}

@Composable
fun CatalogScreen(onOpenManga: (String) -> Unit) {
    var selectedTab by rememberSaveable { mutableStateOf(CatalogTab.Discover) }

    Column(modifier = Modifier.fillMaxSize()) {
        TabRow(selectedTabIndex = selectedTab.ordinal) {
            CatalogTab.values().forEach { tab ->
                Tab(
                    selected = tab == selectedTab,
                    onClick = { selectedTab = tab },
                    text = { Text(tab.label) },
                )
            }
        }

        when (selectedTab) {
            CatalogTab.Discover -> CatalogDiscoverTab(onOpenManga = onOpenManga)
            CatalogTab.Sources -> SourceListTab()
        }
    }
}
