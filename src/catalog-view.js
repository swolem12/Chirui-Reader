// Chirui Reader - Catalog View Component

export class CatalogView {
  constructor(container, mangaService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.router = router;
    this.currentFilters = {
      status: 'all',
      genre: 'all',
      sortBy: 'title',
      minRating: 0,
      sourceId: null // null means all sources
    };
    this.searchQuery = '';
    this.isLoading = false;
    this.currentPage = 1;
    this.pageSize = 12;
  }

  /**
   * Render the catalog view
   */
  async render() {
    const catalogHTML = `
      <div class="catalog-view">
        <div class="catalog-header">
          <h2>Manga Catalog</h2>
          <p class="catalog-subtitle">Browse and discover manga</p>
        </div>

        <div class="search-filter-container">
          <div class="search-container">
            <input
              type="text"
              id="search-input"
              class="search-input"
              placeholder="Search manga by title, author, or description..."
              value="${this.escapeHtml(this.searchQuery)}"
            />
          </div>

          <div class="filter-container">
            <div class="filter-group">
              <label for="source-filter">Source:</label>
              <select id="source-filter" class="filter-select">
                <option value="">All Sources</option>
                ${await this.renderSourceOptions()}
              </select>
            </div>

            <div class="filter-group">
              <label for="status-filter">Status:</label>
              <select id="status-filter" class="filter-select">
                <option value="all">All</option>
                <option value="Ongoing" ${this.currentFilters.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                <option value="Completed" ${this.currentFilters.status === 'Completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="genre-filter">Genre:</label>
              <select id="genre-filter" class="filter-select">
                <option value="all">All Genres</option>
                ${this.renderGenreOptions()}
              </select>
            </div>

            <div class="filter-group">
              <label for="sort-filter">Sort By:</label>
              <select id="sort-filter" class="filter-select">
                <option value="title" ${this.currentFilters.sortBy === 'title' ? 'selected' : ''}>Title</option>
                <option value="rating" ${this.currentFilters.sortBy === 'rating' ? 'selected' : ''}>Rating</option>
                <option value="updated" ${this.currentFilters.sortBy === 'updated' ? 'selected' : ''}>Last Updated</option>
                <option value="chapters" ${this.currentFilters.sortBy === 'chapters' ? 'selected' : ''}>Chapters</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="rating-filter">Min Rating:</label>
              <select id="rating-filter" class="filter-select">
                <option value="0">All</option>
                <option value="4.0" ${this.currentFilters.minRating === '4.0' ? 'selected' : ''}>4.0+</option>
                <option value="4.5" ${this.currentFilters.minRating === '4.5' ? 'selected' : ''}>4.5+</option>
                <option value="4.8" ${this.currentFilters.minRating === '4.8' ? 'selected' : ''}>4.8+</option>
              </select>
            </div>

            <button id="reset-filters" class="filter-reset-btn">Reset Filters</button>
          </div>
        </div>

        <div id="manga-grid" class="manga-grid">
          <div class="loading-indicator">Loading manga...</div>
        </div>

        <div id="pagination-controls" class="catalog-pagination" aria-label="Manga pagination"></div>
      </div>
    `;

    this.container.innerHTML = catalogHTML;
    this.attachEventListeners();
    await this.updateMangaGrid(); // Load initial data
  }

  /**
   * Render source options
   */
  async renderSourceOptions() {
    const sources = await this.mangaService.getEnabledSources();
    return sources.map(source =>
      `<option value="${this.escapeHtml(source.id)}" ${this.currentFilters.sourceId === source.id ? 'selected' : ''}>${this.escapeHtml(source.name)}</option>`
    ).join('');
  }

  /**
   * Render genre options
   */
  renderGenreOptions() {
    const genres = this.mangaService.getAllGenres();
    return genres.map(genre =>
      `<option value="${this.escapeHtml(genre)}" ${this.currentFilters.genre === genre ? 'selected' : ''}>${this.escapeHtml(genre)}</option>`
    ).join('');
  }

  /**
   * Render manga grid (async)
   */
  async renderMangaGrid() {
    try {
      // First search, then filter the search results
      let manga = await this.mangaService.searchManga(
        this.searchQuery,
        1,
        this.currentFilters.sourceId || null
      );
      manga = await this.mangaService.filterManga({
        ...this.currentFilters,
        results: manga
      });

      const totalItems = manga.length;

      if (totalItems === 0) {
        return {
          gridHtml: `
            <div class="no-results">
              <p>No manga found matching your criteria.</p>
              <button id="clear-search-btn" class="secondary-btn">Clear Search</button>
            </div>
          `,
          totalPages: 0,
          totalItems: 0
        };
      }

      const totalPages = Math.max(1, Math.ceil(totalItems / this.pageSize));
      this.currentPage = Math.min(this.currentPage, totalPages);
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const pagedResults = manga.slice(startIndex, startIndex + this.pageSize);

      return {
        gridHtml: pagedResults.map(m => this.renderMangaCard(m)).join(''),
        totalPages,
        totalItems
      };
    } catch (error) {
      console.error('Failed to load manga:', error);
      return {
        gridHtml: `
          <div class="error-message">
            <p>Failed to load manga. Please try again.</p>
            <button id="retry-btn" class="secondary-btn">Retry</button>
          </div>
        `,
        totalPages: 0,
        totalItems: 0
      };
    }
  }

  /**
   * Render a single manga card
   */
  renderMangaCard(manga) {
    const sourceTag = manga.source ? `<span class="source-tag">${this.escapeHtml(manga.source)}</span>` : '';
    return `
      <div class="manga-card" data-manga-id="${this.escapeHtml(manga.id)}" data-source-id="${this.escapeHtml(manga.sourceId || '')}">
        <img
          src="${this.escapeHtml(manga.cover)}"
          alt="${this.escapeHtml(manga.title)}"
          class="manga-card-cover"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/200x280/1976d2/ffffff?text=No+Image'"
        />
        <div class="manga-card-info">
          <h3 class="manga-card-title" title="${this.escapeHtml(manga.title)}">${this.escapeHtml(manga.title)}</h3>
          <div class="manga-card-meta">
            <div class="manga-card-author">${this.escapeHtml(manga.author)}</div>
            <div class="manga-card-stats">
              <span class="manga-rating">⭐ ${(manga.rating || 0).toFixed(1)}</span>
              <span class="manga-chapters">${manga.chapters || 0} ch.</span>
            </div>
            <div class="manga-status-badge ${(manga.status || 'unknown').toLowerCase()}">${this.escapeHtml(manga.status || 'Unknown')}</div>
            ${sourceTag}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      // Debounced search
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.currentPage = 1;
          this.updateMangaGrid();
        }, 300);
      });
    }

    // Source filter
    const sourceFilter = document.getElementById('source-filter');
    if (sourceFilter) {
      sourceFilter.addEventListener('change', (e) => {
        this.currentFilters.sourceId = e.target.value || null;
        this.currentPage = 1;
        this.updateMangaGrid();
      });
    }

    // Filter selects
    const statusFilter = document.getElementById('status-filter');
    const genreFilter = document.getElementById('genre-filter');
    const sortFilter = document.getElementById('sort-filter');
    const ratingFilter = document.getElementById('rating-filter');

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.currentFilters.status = e.target.value;
        this.currentPage = 1;
        this.updateMangaGrid();
      });
    }

    if (genreFilter) {
      genreFilter.addEventListener('change', (e) => {
        this.currentFilters.genre = e.target.value;
        this.currentPage = 1;
        this.updateMangaGrid();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.currentPage = 1;
        this.updateMangaGrid();
      });
    }

    if (ratingFilter) {
      ratingFilter.addEventListener('change', (e) => {
        this.currentFilters.minRating = e.target.value;
        this.currentPage = 1;
        this.updateMangaGrid();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Clear search button
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        this.searchQuery = '';
        this.currentPage = 1;
        this.resetFilters();
      });
    }

    // Retry button
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.updateMangaGrid();
      });
    }

    // Pagination controls
    this.attachPaginationListeners();

    // Manga card clicks
    this.attachMangaCardListeners();
  }

  /**
   * Attach listeners to manga cards
   */
  attachMangaCardListeners() {
    const mangaCards = document.querySelectorAll('.manga-card');
    mangaCards.forEach(card => {
      card.addEventListener('click', () => {
        const mangaId = card.dataset.mangaId;
        const sourceId = card.dataset.sourceId;
        // Navigate with source info
        this.router.navigate(`manga/${mangaId}${sourceId ? `?source=${sourceId}` : ''}`);
      });
    });
  }

  /**
   * Update manga grid without full re-render (async)
   */
  async updateMangaGrid() {
    const gridContainer = document.getElementById('manga-grid');
    if (!gridContainer) return;

    this.isLoading = true;
    gridContainer.innerHTML = '<div class="loading-indicator">Loading manga...</div>';

    try {
      const { gridHtml, totalPages, totalItems } = await this.renderMangaGrid();
      this.isLoading = false;
      gridContainer.innerHTML = gridHtml;

      // Re-attach manga card click listeners
      this.attachMangaCardListeners();

      // Re-attach clear search button if it exists
      const clearSearchBtn = document.getElementById('clear-search-btn');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          this.searchQuery = '';
          this.currentPage = 1;
          this.resetFilters();
        });
      }

      // Re-attach retry button if it exists
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          this.updateMangaGrid();
        });
      }

      // Render and attach pagination controls
      const paginationContainer = document.getElementById('pagination-controls');
      if (paginationContainer) {
        paginationContainer.innerHTML = this.renderPaginationControls(totalPages, totalItems);
        this.attachPaginationListeners(totalPages);
      }
    } catch (error) {
      console.error('Failed to update manga grid:', error);
      this.isLoading = false;
      gridContainer.innerHTML = `
        <div class="error-message">
          <p>Failed to load manga. Please try again.</p>
          <button id="retry-btn" class="secondary-btn">Retry</button>
        </div>
      `;
    }
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.currentFilters = {
      status: 'all',
      genre: 'all',
      sortBy: 'title',
      minRating: 0
    };
    this.searchQuery = '';
    this.currentPage = 1;
    this.render();
  }

  /**
   * Render pagination controls
   */
  renderPaginationControls(totalPages = 0, totalItems = 0) {
    if (!totalPages || totalItems === 0) {
      return '';
    }

    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(totalItems, this.currentPage * this.pageSize);

    return `
      <div class="pagination-content">
        <div class="pagination-info">
          Showing <strong>${start}-${end}</strong> of <strong>${totalItems}</strong>
        </div>
        <div class="pagination-buttons" role="list" aria-label="Pagination">
          <button class="pagination-btn" data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">◀</button>
          ${this.renderPageButtons(totalPages)}
          <button class="pagination-btn" data-page="next" ${this.currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">▶</button>
        </div>
      </div>
    `;
  }

  /**
   * Render page number buttons with limited range
   */
  renderPageButtons(totalPages) {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(`<button class="pagination-btn" data-page="1">1</button>`);
      if (startPage > 2) {
        buttons.push('<span class="pagination-ellipsis" aria-hidden="true">…</span>');
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      const isActive = page === this.currentPage;
      buttons.push(`
        <button
          class="pagination-btn ${isActive ? 'active' : ''}"
          data-page="${page}"
          aria-current="${isActive ? 'page' : 'false'}"
        >${page}</button>
      `);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push('<span class="pagination-ellipsis" aria-hidden="true">…</span>');
      }
      buttons.push(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
    }

    return buttons.join('');
  }

  /**
   * Attach pagination event listeners
   */
  attachPaginationListeners(totalPages = 0) {
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;

    const buttons = paginationContainer.querySelectorAll('button[data-page]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        let targetPage = this.currentPage;

        if (page === 'prev') {
          targetPage = this.currentPage - 1;
        } else if (page === 'next') {
          targetPage = this.currentPage + 1;
        } else {
          targetPage = parseInt(page, 10);
        }

        const maxPage = totalPages || targetPage;
        this.currentPage = Math.max(1, Math.min(maxPage, targetPage));

        this.updateMangaGrid();
      });
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
