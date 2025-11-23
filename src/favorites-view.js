// Chirui Reader - Favorites View Component

export class FavoritesView {
  constructor(container, mangaService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.router = router;
  }

  /**
   * Render the favorites view
   */
  render() {
    const favoritesJson = localStorage.getItem('favorites') || '[]';
    const favoriteIds = JSON.parse(favoritesJson);
    const favoriteManga = favoriteIds
      .map(id => this.mangaService.getMangaById(id))
      .filter(manga => manga !== null);

    const favoritesHTML = `
      <div class="favorites-view">
        <div class="favorites-header">
          <h2>My Favorites</h2>
          <p class="favorites-subtitle">
            ${favoriteManga.length} manga in your favorites
          </p>
        </div>

        ${favoriteManga.length === 0 ? this.renderEmptyState() : this.renderFavoritesList(favoriteManga)}
      </div>
    `;

    this.container.innerHTML = favoritesHTML;
    this.attachEventListeners(favoriteManga);
  }

  /**
   * Render empty state
   */
  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">♥</div>
        <h3>No Favorites Yet</h3>
        <p>Start adding manga to your favorites to see them here!</p>
        <button id="browse-catalog-btn" class="primary-btn">Browse Catalog</button>
      </div>
    `;
  }

  /**
   * Render favorites list
   */
  renderFavoritesList(favoriteManga) {
    return `
      <div class="manga-grid">
        ${favoriteManga.map(manga => this.renderMangaCard(manga)).join('')}
      </div>
    `;
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
          <button class="remove-favorite-btn" data-manga-id="${this.escapeHtml(manga.id)}">
            Remove
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(favoriteManga) {
    // Browse catalog button (if empty state)
    const browseCatalogBtn = document.getElementById('browse-catalog-btn');
    if (browseCatalogBtn) {
      browseCatalogBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    // Manga card clicks
    const mangaCards = document.querySelectorAll('.manga-card');
    mangaCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking the remove button
        if (!e.target.classList.contains('remove-favorite-btn')) {
          const mangaId = card.dataset.mangaId;
          this.router.navigate(`manga/${mangaId}`);
        }
      });
    });

    // Remove favorite buttons
    const removeButtons = document.querySelectorAll('.remove-favorite-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mangaId = btn.dataset.mangaId;
        this.removeFavorite(mangaId);
      });
    });
  }

  /**
   * Remove manga from favorites
   */
  removeFavorite(mangaId) {
    const favoritesJson = localStorage.getItem('favorites') || '[]';
    const favorites = JSON.parse(favoritesJson);
    const updatedFavorites = favorites.filter(id => id !== mangaId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    // Re-render the view
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
