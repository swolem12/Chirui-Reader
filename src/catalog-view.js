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
      minRating: 0
    };
    this.searchQuery = '';
  }

  /**
   * Render the catalog view
   */
  render() {
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
          ${this.renderMangaGrid()}
        </div>
      </div>
    `;

    this.container.innerHTML = catalogHTML;
    this.attachEventListeners();
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
   * Render manga grid
   */
  renderMangaGrid() {
    // First search, then filter the search results
    let manga = this.mangaService.searchManga(this.searchQuery);
    manga = this.mangaService.filterManga({
      ...this.currentFilters,
      results: manga
    });

    if (manga.length === 0) {
      return `
        <div class="no-results">
          <p>No manga found matching your criteria.</p>
          <button id="clear-search-btn" class="secondary-btn">Clear Search</button>
        </div>
      `;
    }

    return manga.map(m => this.renderMangaCard(m)).join('');
  }

  /**
   * Render a single manga card
   */
  renderMangaCard(manga) {
    return `
      <div class="manga-card" data-manga-id="${this.escapeHtml(manga.id)}">
        <img 
          src="${this.escapeHtml(manga.cover)}" 
          alt="${this.escapeHtml(manga.title)}" 
          class="manga-card-cover"
          loading="lazy"
        />
        <div class="manga-card-info">
          <h3 class="manga-card-title" title="${this.escapeHtml(manga.title)}">${this.escapeHtml(manga.title)}</h3>
          <div class="manga-card-meta">
            <div class="manga-card-author">${this.escapeHtml(manga.author)}</div>
            <div class="manga-card-stats">
              <span class="manga-rating">⭐ ${manga.rating.toFixed(1)}</span>
              <span class="manga-chapters">${manga.chapters} ch.</span>
            </div>
            <div class="manga-status-badge ${manga.status.toLowerCase()}">${this.escapeHtml(manga.status)}</div>
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
          this.updateMangaGrid();
        }, 300);
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
        this.updateMangaGrid();
      });
    }

    if (genreFilter) {
      genreFilter.addEventListener('change', (e) => {
        this.currentFilters.genre = e.target.value;
        this.updateMangaGrid();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.updateMangaGrid();
      });
    }

    if (ratingFilter) {
      ratingFilter.addEventListener('change', (e) => {
        this.currentFilters.minRating = e.target.value;
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
        this.resetFilters();
      });
    }

    // Manga card clicks
    const mangaCards = document.querySelectorAll('.manga-card');
    mangaCards.forEach(card => {
      card.addEventListener('click', () => {
        const mangaId = card.dataset.mangaId;
        this.router.navigate(`manga/${mangaId}`);
      });
    });
  }

  /**
   * Update manga grid without full re-render
   */
  updateMangaGrid() {
    const gridContainer = document.getElementById('manga-grid');
    if (gridContainer) {
      gridContainer.innerHTML = this.renderMangaGrid();
      
      // Re-attach manga card click listeners
      const mangaCards = document.querySelectorAll('.manga-card');
      mangaCards.forEach(card => {
        card.addEventListener('click', () => {
          const mangaId = card.dataset.mangaId;
          this.router.navigate(`manga/${mangaId}`);
        });
      });

      // Re-attach clear search button if it exists
      const clearSearchBtn = document.getElementById('clear-search-btn');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          this.searchQuery = '';
          this.resetFilters();
        });
      }
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
    this.render();
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
