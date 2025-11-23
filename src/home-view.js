// Chirui Reader - Home View Component

export class HomeView {
  constructor(container, mangaService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.router = router;
  }

  /**
   * Render the home view
   */
  render() {
    const allManga = this.mangaService.getAllManga();
    const popularManga = this.mangaService.filterManga({ sortBy: 'rating' }).slice(0, 6);
    const recentManga = this.mangaService.filterManga({ sortBy: 'updated' }).slice(0, 6);

    const homeHTML = `
      <div class="home-view">
        <div class="hero-section">
          <h1 class="hero-title">Welcome to Chirui Reader</h1>
          <p class="hero-subtitle">Your modern web-based manga reader</p>
          <div class="hero-actions">
            <button id="browse-catalog-btn" class="hero-btn primary">
              Browse Catalog
            </button>
            <button id="view-favorites-btn" class="hero-btn secondary">
              My Favorites
            </button>
          </div>
        </div>

        <div class="home-section">
          <div class="section-header">
            <h2>Popular Manga</h2>
            <button id="view-all-popular" class="view-all-btn">View All →</button>
          </div>
          <div class="manga-carousel">
            ${this.renderMangaCarousel(popularManga)}
          </div>
        </div>

        <div class="home-section">
          <div class="section-header">
            <h2>Recently Updated</h2>
            <button id="view-all-recent" class="view-all-btn">View All →</button>
          </div>
          <div class="manga-carousel">
            ${this.renderMangaCarousel(recentManga)}
          </div>
        </div>

        <div class="home-stats">
          <div class="stat-card">
            <div class="stat-number">${allManga.length}</div>
            <div class="stat-label">Manga Available</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${this.getTotalChapters()}</div>
            <div class="stat-label">Total Chapters</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${this.getFavoritesCount()}</div>
            <div class="stat-label">Your Favorites</div>
          </div>
        </div>

        <div class="home-features">
          <h2>Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Extensive Catalog</h3>
              <p>Browse through a growing collection of manga from multiple sources</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>Find manga by title, author, genre, or status with powerful filters</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📖</div>
              <h3>Smooth Reading</h3>
              <p>Enjoy manga with our optimized reader and keyboard shortcuts</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💾</div>
              <h3>Offline Support</h3>
              <p>Read your favorites offline with PWA technology</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🌙</div>
              <h3>Dark Mode</h3>
              <p>Easy on the eyes with automatic dark mode support</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Responsive design works great on phones and tablets</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = homeHTML;
    this.attachEventListeners();
  }

  /**
   * Render manga carousel
   */
  renderMangaCarousel(mangaList) {
    return mangaList.map(manga => `
      <div class="carousel-card" data-manga-id="${this.escapeHtml(manga.id)}">
        <img 
          src="${this.escapeHtml(manga.cover)}" 
          alt="${this.escapeHtml(manga.title)}"
          class="carousel-cover"
          loading="lazy"
        />
        <div class="carousel-info">
          <h4 class="carousel-title" title="${this.escapeHtml(manga.title)}">${this.escapeHtml(manga.title)}</h4>
          <div class="carousel-meta">
            <span class="manga-rating">⭐ ${manga.rating.toFixed(1)}</span>
            <span class="manga-status-badge ${manga.status.toLowerCase()}">${this.escapeHtml(manga.status)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Get total chapters across all manga
   */
  getTotalChapters() {
    return this.mangaService.getAllManga().reduce((sum, manga) => sum + manga.chapters, 0);
  }

  /**
   * Get favorites count
   */
  getFavoritesCount() {
    const favoritesJson = localStorage.getItem('favorites') || '[]';
    const favorites = JSON.parse(favoritesJson);
    return favorites.length;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Hero buttons
    const browseCatalogBtn = document.getElementById('browse-catalog-btn');
    if (browseCatalogBtn) {
      browseCatalogBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    const viewFavoritesBtn = document.getElementById('view-favorites-btn');
    if (viewFavoritesBtn) {
      viewFavoritesBtn.addEventListener('click', () => this.router.navigate('favorites'));
    }

    // View all buttons
    const viewAllPopularBtn = document.getElementById('view-all-popular');
    if (viewAllPopularBtn) {
      viewAllPopularBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    const viewAllRecentBtn = document.getElementById('view-all-recent');
    if (viewAllRecentBtn) {
      viewAllRecentBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    // Carousel cards
    const carouselCards = document.querySelectorAll('.carousel-card');
    carouselCards.forEach(card => {
      card.addEventListener('click', () => {
        const mangaId = card.dataset.mangaId;
        this.router.navigate(`manga/${mangaId}`);
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
