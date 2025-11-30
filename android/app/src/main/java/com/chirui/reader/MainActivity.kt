package com.chirui.reader

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SearchBar
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
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
                ChiruiReaderAppContent()
            }
        }
    }
}

/**
 * Kotatsu-style navigation item with selected/unselected icons
 */
private data class NavDestination(
    val route: String,
    val label: String,
    val description: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
)

/**
 * Main navigation destinations matching Kotatsu's bottom navigation:
 * Explore, Feed, Favorites, History
 */
private val destinations = listOf(
    NavDestination(
        route = "explore",
        label = "Explore",
        description = "Discover manga sources and browse catalog",
        selectedIcon = Icons.Filled.Explore,
        unselectedIcon = Icons.Outlined.Explore,
    ),
    NavDestination(
        route = "feed",
        label = "Feed",
        description = "Updates and new chapters",
        selectedIcon = Icons.Filled.Notifications,
        unselectedIcon = Icons.Outlined.Notifications,
    ),
    NavDestination(
        route = "favorites",
        label = "Favorites",
        description = "Your saved manga library",
        selectedIcon = Icons.Filled.Favorite,
        unselectedIcon = Icons.Outlined.FavoriteBorder,
    ),
    NavDestination(
        route = "history",
        label = "History",
        description = "Recently read manga",
        selectedIcon = Icons.Filled.History,
        unselectedIcon = Icons.Outlined.History,
    ),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChiruiReaderAppContent() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    val activeDestination = destinations.firstOrNull { currentDestination.isOnDestination(it.route) }
    val isMangaDetail = currentDestination?.route?.startsWith("explore/detail/") == true
    val isReader = currentDestination?.route?.startsWith("reader/") == true
    
    // Search state
    var searchQuery by rememberSaveable { mutableStateOf("") }
    var isSearchActive by rememberSaveable { mutableStateOf(false) }
    
    // Show FAB only on History tab (Kotatsu pattern)
    val showFab = activeDestination?.route == "history"

    Scaffold(
        topBar = {
            when {
                isReader -> {
                    // No top bar in reader mode (handled by reader itself)
                }
                isMangaDetail -> {
                    CenterAlignedTopAppBar(
                        title = { Text("Details") },
                        navigationIcon = {
                            IconButton(onClick = { navController.popBackStack() }) {
                                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back")
                            }
                        }
                    )
                }
                else -> {
                    // Kotatsu-style search bar at the top
                    KotatsuSearchBar(
                        query = searchQuery,
                        onQueryChange = { searchQuery = it },
                        isActive = isSearchActive,
                        onActiveChange = { isSearchActive = it },
                        onSearch = { /* Handle search */ },
                    )
                }
            }
        },
        bottomBar = {
            // Hide bottom bar when in reader or search is active
            AnimatedVisibility(
                visible = !isReader && !isSearchActive,
                enter = slideInVertically(initialOffsetY = { it }),
                exit = slideOutVertically(targetOffsetY = { it })
            ) {
                KotatsuBottomNavBar(
                    currentDestination = currentDestination,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        },
        floatingActionButton = {
            // Continue Reading FAB (shown on History tab like Kotatsu)
            AnimatedVisibility(
                visible = showFab && !isSearchActive,
                enter = slideInVertically(initialOffsetY = { it * 2 }),
                exit = slideOutVertically(targetOffsetY = { it * 2 })
            ) {
                ExtendedFloatingActionButton(
                    onClick = { /* Continue reading last manga */ },
                    icon = { 
                        Icon(
                            Icons.Default.PlayArrow, 
                            contentDescription = null,
                            modifier = Modifier.size(24.dp)
                        ) 
                    },
                    text = { Text("Continue") },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                    elevation = FloatingActionButtonDefaults.elevation(
                        defaultElevation = 6.dp,
                        pressedElevation = 12.dp
                    )
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = destinations.first().route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("explore") {
                CatalogScreen(onOpenManga = { mangaId ->
                    navController.navigate("explore/detail/$mangaId")
                })
            }
            composable("feed") { FeedScreen() }
            composable("favorites") { FavoritesScreen() }
            composable("history") { HistoryScreen() }
            composable(
                route = "explore/detail/{mangaId}",
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

/**
 * Kotatsu-style search bar with Material 3 SearchBar component
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun KotatsuSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    isActive: Boolean,
    onActiveChange: (Boolean) -> Unit,
    onSearch: (String) -> Unit,
) {
    SearchBar(
        query = query,
        onQueryChange = onQueryChange,
        onSearch = { 
            onSearch(it)
            onActiveChange(false)
        },
        active = isActive,
        onActiveChange = onActiveChange,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = if (isActive) 0.dp else 16.dp),
        placeholder = { 
            Text(
                "Search manga",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            ) 
        },
        leadingIcon = { 
            if (isActive) {
                IconButton(onClick = { onActiveChange(false) }) {
                    Icon(
                        Icons.Default.ArrowBack, 
                        contentDescription = "Close search",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            } else {
                Icon(
                    Icons.Default.Search, 
                    contentDescription = "Search",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        },
        tonalElevation = 0.dp,
    ) {
        // Search suggestions/results would go here
        if (query.isNotEmpty()) {
            SearchSuggestions(query = query, onSuggestionClick = { suggestion ->
                onQueryChange(suggestion)
                onSearch(suggestion)
                onActiveChange(false)
            })
        } else {
            // Show recent searches
            RecentSearches(onRecentClick = { recent ->
                onQueryChange(recent)
                onSearch(recent)
                onActiveChange(false)
            })
        }
    }
}

@Composable
private fun SearchSuggestions(query: String, onSuggestionClick: (String) -> Unit) {
    // Placeholder search suggestions
    val suggestions = listOf(
        "One Piece",
        "Naruto", 
        "Attack on Titan",
        "Demon Slayer",
        "My Hero Academia"
    ).filter { it.contains(query, ignoreCase = true) }
    
    LazyColumn {
        items(suggestions) { suggestion ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSuggestionClick(suggestion) }
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.Search,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(end = 16.dp)
                )
                Text(
                    text = suggestion,
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        }
    }
}

@Composable
private fun RecentSearches(onRecentClick: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Recent searches",
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        // Placeholder recent searches
        Text(
            text = "No recent searches",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
        )
    }
}

/**
 * Kotatsu-style bottom navigation bar with 4 tabs
 */
@Composable
private fun KotatsuBottomNavBar(
    currentDestination: androidx.navigation.NavDestination?,
    onNavigate: (String) -> Unit
) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 0.dp
    ) {
        destinations.forEach { destination ->
            val selected = currentDestination.isOnDestination(destination.route)
            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(destination.route) },
                icon = {
                    Icon(
                        imageVector = if (selected) destination.selectedIcon else destination.unselectedIcon,
                        contentDescription = destination.description
                    )
                },
                label = { Text(destination.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )
        }
    }
}

private fun androidx.navigation.NavDestination?.isOnDestination(route: String): Boolean {
    val destinationRoute = this?.route ?: return false
    return destinationRoute == route || destinationRoute.startsWith("$route/")
}

/**
 * Feed Screen - Shows updates and new chapters (Kotatsu-style)
 */
@Composable
private fun FeedScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Outlined.Notifications,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "No updates yet",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Add manga to your favorites to track new chapters",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

/**
 * Favorites Screen - Shows saved manga library (Kotatsu-style)
 */
@Composable
private fun FavoritesScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Outlined.FavoriteBorder,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "No favorites yet",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Add manga to your favorites from the Explore tab",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

/**
 * History Screen - Shows recently read manga (Kotatsu-style)
 */
@Composable
private fun HistoryScreen() {
    // Sample history items for UI demonstration
    val historyItems = remember {
        listOf(
            HistoryItem("1", "One Piece", "Chapter 1089", "2 hours ago"),
            HistoryItem("2", "Naruto", "Chapter 700", "Yesterday"),
            HistoryItem("3", "Attack on Titan", "Chapter 139", "3 days ago"),
        )
    }
    
    if (historyItems.isEmpty()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Outlined.History,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No reading history",
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Start reading manga to see your history here",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(historyItems) { item ->
                HistoryCard(item = item, onClick = { /* Navigate to manga */ })
            }
        }
    }
}

private data class HistoryItem(
    val id: String,
    val title: String,
    val chapter: String,
    val timeAgo: String
)

@Composable
private fun HistoryCard(item: HistoryItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Cover placeholder
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = item.title.take(2).uppercase(),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
            }
            
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(start = 12.dp)
            ) {
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = item.chapter,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = item.timeAgo,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                )
            }
            
            // Play button
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primary)
                    .clickable(onClick = onClick),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.PlayArrow,
                    contentDescription = "Continue",
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }
}
