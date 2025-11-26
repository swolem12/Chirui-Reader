package com.chirui.reader.reader

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.clickable
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import kotlinx.coroutines.launch

@OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
@Composable
fun ReaderScreen(
    onBack: () -> Unit,
    onShare: () -> Unit,
    onDownload: () -> Unit,
    viewModel: ReaderViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    when {
        state.loading -> ReaderLoading()
        state.error != null -> ReaderError(message = state.error ?: "", onRetry = viewModel::refresh)
        state.chapter != null -> ReaderContent(
            state = state,
            onBack = onBack,
            onShare = onShare,
            onDownload = onDownload,
            onPageChanged = viewModel::onPageChanged,
        )
    }
}

@OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
@Composable
private fun ReaderContent(
    state: ReaderUiState,
    onBack: () -> Unit,
    onShare: () -> Unit,
    onDownload: () -> Unit,
    onPageChanged: (Int) -> Unit,
) {
    val chapter = state.chapter ?: return
    val pagerState = rememberPagerState(initialPage = state.currentPage, pageCount = { chapter.pages.size })
    val scope = rememberCoroutineScope()

    LaunchedEffect(pagerState.currentPage) {
        onPageChanged(pagerState.currentPage)
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = chapter.chapterTitle,
                            style = MaterialTheme.typography.titleMedium,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Text(
                            text = chapter.mangaTitle,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onShare) {
                        Icon(Icons.Default.Share, contentDescription = "Share")
                    }
                    IconButton(onClick = onDownload) {
                        Icon(Icons.Default.CloudDownload, contentDescription = "Download")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            verticalArrangement = Arrangement.SpaceBetween,
        ) {
            HorizontalPager(state = pagerState, modifier = Modifier.weight(1f)) { page ->
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    AsyncImage(
                        model = chapter.pages[page].imageUrl,
                        contentDescription = "Page ${page + 1}",
                        modifier = Modifier.fillMaxSize(),
                    )
                }
            }

            ReaderFooter(
                current = pagerState.currentPage,
                total = chapter.pages.size,
                onSeek = { page ->
                    scope.launch {
                        pagerState.animateScrollToPage(page)
                        onPageChanged(page)
                    }
                }
            )
        }
    }
}

@Composable
private fun ReaderFooter(current: Int, total: Int, onSeek: (Int) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = "Page ${current + 1} of $total", style = MaterialTheme.typography.bodyMedium)
            Text(text = "Swipe or use slider", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Slider(
            value = current.toFloat(),
            onValueChange = { value -> onSeek(value.toInt().coerceIn(0, total - 1)) },
            valueRange = 0f..(total - 1).toFloat(),
            steps = (total - 2).coerceAtLeast(0),
            colors = SliderDefaults.colors(
                thumbColor = MaterialTheme.colorScheme.primary,
                activeTrackColor = MaterialTheme.colorScheme.primary,
            )
        )
    }
}

@Composable
private fun ReaderLoading() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ReaderError(message: String, onRetry: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(Icons.Default.Refresh, contentDescription = null)
        Text(text = message, style = MaterialTheme.typography.bodyLarge)
        Text(
            text = "Tap to retry", style = MaterialTheme.typography.labelLarge,
            modifier = Modifier
                .clickable { onRetry() }
                .background(MaterialTheme.colorScheme.primaryContainer)
                .padding(horizontal = 12.dp, vertical = 6.dp)
        )
    }
}
