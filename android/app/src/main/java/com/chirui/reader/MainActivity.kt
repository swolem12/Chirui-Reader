package com.chirui.reader

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Bookmarks
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LibraryBooks
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.chirui.reader.catalog.CatalogScreen
import com.chirui.reader.catalog.MangaDetailScreen
import com.chirui.reader.downloads.DownloadsScreen
import com.chirui.reader.reader.ReaderScreen
import com.chirui.reader.ui.theme.ChiruiReaderTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ChiruiReaderTheme {
                ChiruiReaderApp()
            }
        }
    }
}

private data class TopLevelDestination(
    val route: String,
    val label: String,
    val description: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val title: String,
)

private val destinations = listOf(
    TopLevelDestination(
        route = "home",
        label = "Home",
        description = "Welcome and status",
        icon = Icons.Filled.Home,
        title = "Home",
    ),
    TopLevelDestination(
        route = "catalog",
        label = "Catalog",
        description = "Discover sources and manga",
        icon = Icons.Filled.LibraryBooks,
        title = "Catalog",
    ),
    TopLevelDestination(
        route = "library",
        label = "Library",
        description = "Saved and favorites",
        icon = Icons.Filled.Bookmarks,
        title = "Library",
    ),
    TopLevelDestination(
        route = "downloads",
        label = "Downloads",
        description = "Offline chapters and queue",
        icon = Icons.Filled.Sync,
        title = "Downloads",
    ),
    TopLevelDestination(
        route = "settings",
        label = "Settings",
        description = "App preferences",
        icon = Icons.Filled.Settings,
        title = "Settings",
    )
)

@Composable
fun ChiruiReaderApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    val activeDestination = destinations.firstOrNull { currentDestination.isOnDestination(it.route) }
    val isCatalogDetail = currentDestination?.route?.startsWith("catalog/detail/") == true

    Scaffold(
        topBar = {
            when {
                isCatalogDetail -> {
                    CenterAlignedTopAppBar(
                        title = { Text("Manga") },
                        navigationIcon = {
                            IconButton(onClick = { navController.popBackStack() }) {
                                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back")
                            }
                        }
                    )
                }
                activeDestination != null -> {
                    CenterAlignedTopAppBar(title = { Text(activeDestination.title) })
                }
            }
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                destinations.forEach { destination ->
                    val selected = currentDestination.isOnDestination(destination.route)
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(destination.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            androidx.compose.material3.Icon(
                                imageVector = destination.icon,
                                contentDescription = destination.description
                            )
                        },
                        label = { Text(destination.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.onPrimary,
                            selectedTextColor = MaterialTheme.colorScheme.onPrimary,
                            indicatorColor = MaterialTheme.colorScheme.primary,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = destinations.first().route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { StatusScreen() }
            composable("catalog") {
                CatalogScreen(onOpenManga = { mangaId ->
                    navController.navigate("catalog/detail/$mangaId")
                })
            }
            composable("library") { LibraryScreen() }
            composable("downloads") { DownloadsScreen() }
            composable("settings") { SettingsScreen() }
            composable(
                route = "catalog/detail/{mangaId}",
                arguments = listOf(navArgument("mangaId") { type = NavType.StringType })
            ) {
                MangaDetailScreen(
                    onShare = { /* share sheet placeholder */ },
                    onOpenChapter = { chapter ->
                        navController.navigate("reader/${chapter.id}")
                    }
                )
            }
            composable(
                route = "reader/{chapterId}",
                arguments = listOf(navArgument("chapterId") { type = NavType.StringType })
            ) {
                ReaderScreen(
                    onBack = { navController.popBackStack() },
                    onShare = { /* share hook placeholder */ },
                    onDownload = { /* download hook placeholder */ },
                )
            }
        }
    }
}

private fun NavDestination?.isOnDestination(route: String): Boolean {
    val destinationRoute = this?.route ?: return false
    return destinationRoute == route || destinationRoute.startsWith("$route/")
}

@Composable
private fun StatusScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.Start
    ) {
        // Welcome Section
        Text(
            text = "Welcome to Chirui Reader",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Your Kotatsu-inspired manga reader for Android",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        // Quick Start
        InfoCard(
            title = "🚀 Quick Start",
            body = "1. Visit the Catalog tab to browse manga sources\n" +
                   "2. Enable sources you want to use\n" +
                   "3. Search and discover manga\n" +
                   "4. Add favorites to your Library",
            accent = MaterialTheme.colorScheme.primary
        )
        
        // Features
        InfoCard(
            title = "✨ Features",
            body = "• Browse multiple manga sources\n" +
                   "• Offline reading support\n" +
                   "• Download chapters for later\n" +
                   "• Customizable reader experience",
            accent = MaterialTheme.colorScheme.secondary
        )
        
        // Development Status
        InfoCard(
            title = "⚙️ Development Status",
            body = "This app is actively being developed. Current features:\n" +
                   "✅ Source management\n" +
                   "✅ Catalog browsing\n" +
                   "✅ Manga details\n" +
                   "✅ Basic reader\n" +
                   "🔨 Downloads (in progress)\n" +
                   "🔨 Library (in progress)",
            accent = MaterialTheme.colorScheme.tertiary
        )
        
        // Version Info
        Text(
            text = "Version 0.1.0 (Early Access)",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

@Composable
private fun LibraryScreen() {
    PlaceholderScreen(
        title = "Library",
        message = "Favorites, categories, and reading history will live here.",
        chip = "Shelves"
    )
}

@Composable
private fun SettingsScreen() {
    PlaceholderScreen(
        title = "Settings",
        message = "Appearance, reader defaults, and network/extension options will be configurable here.",
        chip = "Preferences"
    )
}

@Composable
private fun PlaceholderScreen(title: String, message: String, chip: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = message,
            modifier = Modifier.padding(top = 12.dp),
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurface,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(18.dp))
        Chip(text = chip)
    }
}

@Composable
private fun Chip(text: String) {
    androidx.compose.material3.Surface(
        color = MaterialTheme.colorScheme.primaryContainer,
        contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            style = MaterialTheme.typography.labelLarge
        )
    }
}

@Composable
private fun InfoCard(title: String, body: String, accent: androidx.compose.ui.graphics.Color) {
    androidx.compose.material3.Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surfaceVariant,
        tonalElevation = 1.dp,
        shadowElevation = 2.dp
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = accent
            )
            Text(
                text = body,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
