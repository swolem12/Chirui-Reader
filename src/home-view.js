// Chirui Reader - Home View Component (Kotatsu Style)

export class HomeView {
  constructor(container, mangaService, historyService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.historyService = historyService;
    this.router = router;
  }

  /**
   * Render the home view - Kotatsu style with clean sections
   */
  async render() {
    // Show loading state first
    this.container.innerHTML = `
      <div class="home-view kotatsu-style">
        <div class="loading-placeholder">
          <div class="loading-spinner"></div>
          <p>Loading manga...</p>
        </div>
      </div>
    `;

    try {
      // Fetch data - handle async methods
      let allManga = [];
      let popularManga = [];
      let recentManga = [];
      
      // Get all manga first
      try {
        allManga = await this.mangaService.getAllManga();
        if (!Array.isArray(allManga)) allManga = [];
      } catch (e) {
        console.warn('Could not fetch all manga:', e);
        allManga = [];
      }
      
      // Get popular manga (sorted by rating)
      try {
        popularManga = await this.mangaService.filterManga({ sortBy: 'rating' });
        if (!Array.isArray(popularManga)) popularManga = [];
        popularManga = popularManga.slice(0, 8);
      } catch (e) {
        console.warn('Could not fetch popular manga:', e);
        popularManga = allManga.slice(0, 8);
      }
      
      // Get recent manga (sorted by update date)
      try {
        recentManga = await this.mangaService.filterManga({ sortBy: 'updated' });
        if (!Array.isArray(recentManga)) recentManga = [];
        recentManga = recentManga.slice(0, 8);
      } catch (e) {
        console.warn('Could not fetch recent manga:', e);
        recentManga = allManga.slice(0, 8);
      }
      
      const continueReading = this.getContinueReadingList();

      const homeHTML = `
        <div class="home-view kotatsu-style">
          ${continueReading.length > 0 ? this.renderContinueReadingSection(continueReading) : ''}

          <section class="manga-section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon">🔥</span>
                Popular
              </h2>
              <button id="view-all-popular" class="view-more-btn">
              <span>More</span>
              <span class="arrow">→</span>
            </button>
          </div>
          <div class="manga-grid compact">
            ${this.renderMangaGrid(popularManga)}
          </div>
        </section>

        <section class="manga-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">📅</span>
              Recently Updated
            </h2>
            <button id="view-all-recent" class="view-more-btn">
              <span>More</span>
              <span class="arrow">→</span>
            </button>
          </div>
          <div class="manga-grid compact">
            ${this.renderMangaGrid(recentManga)}
          </div>
        </section>

        <section class="quick-stats">
          <div class="stat-chip">
            <span class="stat-icon">📚</span>
            <span class="stat-value">${allManga.length}</span>
            <span class="stat-label">Manga</span>
          </div>
          <div class="stat-chip">
            <span class="stat-icon">❤️</span>
            <span class="stat-value">${this.getFavoritesCount()}</span>
            <span class="stat-label">Favorites</span>
          </div>
          <div class="stat-chip">
            <span class="stat-icon">📖</span>
            <span class="stat-value">${this.historyService.getHistory().length}</span>
            <span class="stat-label">History</span>
          </div>
        </section>
      </div>
    `;

      this.container.innerHTML = homeHTML;
      this.attachEventListeners();
    } catch (error) {
      console.error('Error rendering home view:', error);
      this.container.innerHTML = `
        <div class="home-view kotatsu-style">
          <div class="error-message">
            <p>Error loading content. Please try again.</p>
            <button onclick="location.reload()" class="retry-btn">Retry</button>
          </div>
        </div>
      `;
    }
  }

  /**
   * Render manga grid - Kotatsu style cards
   */
  renderMangaGrid(mangaList) {
    if (!mangaList || mangaList.length === 0) {
      return '<p class="empty-message">No manga found</p>';
    }

    return mangaList.map(manga => `
      <div class="manga-card kotatsu-card" data-manga-id="${manga.id}">
        <div class="card-cover">
          <img 
            src="${manga.cover || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 2 3%22><rect fill=%22%23E8DEF8%22 width=%222%22 height=%223%22/></svg>'}" 
            alt="${manga.title}"
            loading="lazy"
          />
          <div class="card-overlay">
            <span class="card-chapters">${manga.chapters || '?'} Ch</span>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${manga.title}</h3>
          <p class="card-author">${manga.author || 'Unknown'}</p>
        </div>
      </div>
    `).join('');
  }

  /**
   * Get continue reading list
   */
  getContinueReadingList() {
    const history = this.historyService.getHistory();
    return history
      .slice(0, 6)
      .map(entry => ({
        ...entry,
        manga: this.mangaService.getMangaById(entry.mangaId)
      }))
      .filter(entry => entry.manga !== null);
  }

  /**
   * Render continue reading section - Kotatsu style
   */
  renderContinueReadingSection(continueReading) {
    return `
      <section class="manga-section continue-reading-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">📖</span>
            Continue Reading
          </h2>
          <button id="view-all-history" class="view-more-btn">
            <span>More</span>
            <span class="arrow">→</span>
          </button>
        </div>
        <div class="continue-reading-grid">
          ${continueReading.map(entry => `
            <div class="continue-reading-card" data-manga-id="${this.escapeHtml(entry.mangaId)}" data-chapter="${entry.chapterNumber}">
              <div class="cr-cover">
                <img 
                  src="${this.escapeHtml(entry.manga.cover)}" 
                  alt="${this.escapeHtml(entry.manga.title)}"
                  loading="lazy"
                />
              </div>
              <div class="cr-info">
                <h4 class="cr-title" title="${this.escapeHtml(entry.manga.title)}">${this.escapeHtml(entry.manga.title)}</h4>
                <p class="cr-progress">Chapter ${entry.chapterNumber} • Page ${entry.pageNumber}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
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
    // View all buttons
    const viewAllPopular = document.getElementById('view-all-popular');
    if (viewAllPopular) {
      viewAllPopular.addEventListener('click', () => this.router.navigate('catalog'));
    }
    
    const viewAllRecent = document.getElementById('view-all-recent');
    if (viewAllRecent) {
      viewAllRecent.addEventListener('click', () => this.router.navigate('catalog'));
    }
    
    const viewAllHistory = document.getElementById('view-all-history');
    if (viewAllHistory) {
      viewAllHistory.addEventListener('click', () => this.router.navigate('history'));
    }

    // Manga cards click handler
    const mangaCards = document.querySelectorAll('.manga-card.kotatsu-card');
    mangaCards.forEach(card => {
      card.addEventListener('click', () => {
        const mangaId = card.dataset.mangaId;
        if (mangaId) {
          this.router.navigate(`manga/${mangaId}`);
        }
      });
    });

    // Continue reading cards
    const continueCards = document.querySelectorAll('.continue-reading-card');
    continueCards.forEach(card => {
      card.addEventListener('click', () => {
        const mangaId = card.dataset.mangaId;
        const chapter = card.dataset.chapter;
        if (mangaId && chapter) {
          this.router.navigate(`reader/${mangaId}`, { chapter });
        }
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
