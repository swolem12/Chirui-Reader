// Chirui Reader - Manga Detail View Component

export class MangaDetailView {
  constructor(container, mangaService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.router = router;
  }

  /**
   * Render the manga detail view
   * @param {string} mangaId - Manga ID
   */
  render(mangaId) {
    const manga = this.mangaService.getMangaById(mangaId);
    
    if (!manga) {
      this.renderNotFound();
      return;
    }

    const chapters = this.mangaService.getChapters(mangaId);

    const detailHTML = `
      <div class="manga-detail-view">
        <button id="back-to-catalog" class="back-btn">← Back to Catalog</button>
        
        <div class="manga-detail-header">
          <div class="manga-detail-cover-container">
            <img 
              src="${this.escapeHtml(manga.cover)}" 
              alt="${this.escapeHtml(manga.title)}" 
              class="manga-detail-cover"
            />
          </div>
          
          <div class="manga-detail-info">
            <h1 class="manga-detail-title">${this.escapeHtml(manga.title)}</h1>
            <p class="manga-detail-author">By ${this.escapeHtml(manga.author)}</p>
            
            <div class="manga-detail-meta">
              <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span class="manga-status-badge ${manga.status.toLowerCase()}">${this.escapeHtml(manga.status)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Rating:</span>
                <span class="manga-rating-large">⭐ ${manga.rating.toFixed(1)}/5.0</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Chapters:</span>
                <span>${manga.chapters}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Last Updated:</span>
                <span>${this.formatDate(manga.lastUpdated)}</span>
              </div>
            </div>

            <div class="manga-detail-genres">
              ${manga.genres.map(genre => 
                `<span class="genre-tag">${this.escapeHtml(genre)}</span>`
              ).join('')}
            </div>

            <div class="manga-detail-actions">
              <button id="add-to-favorites" class="primary-btn">
                <span>♥</span> Add to Favorites
              </button>
              <button id="start-reading" class="primary-btn primary-btn-filled">
                <span>📖</span> Start Reading
              </button>
            </div>
          </div>
        </div>

        <div class="manga-detail-description">
          <h2>Description</h2>
          <p>${this.escapeHtml(manga.description)}</p>
        </div>

        <div class="manga-chapters-section">
          <h2>Chapters</h2>
          <div class="chapters-list">
            ${this.renderChaptersList(chapters, mangaId)}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = detailHTML;
    this.attachEventListeners(mangaId, chapters);
  }

  /**
   * Render chapters list
   */
  renderChaptersList(chapters, mangaId) {
    if (chapters.length === 0) {
      return '<p class="no-chapters">No chapters available yet.</p>';
    }

    return chapters.map(chapter => `
      <div class="chapter-item" data-chapter-id="${this.escapeHtml(chapter.id)}">
        <div class="chapter-info">
          <span class="chapter-number">Chapter ${chapter.number}</span>
          ${chapter.title ? `<span class="chapter-title">: ${this.escapeHtml(chapter.title)}</span>` : ''}
        </div>
        <div class="chapter-meta">
          <span class="chapter-date">${this.formatDate(chapter.releaseDate)}</span>
          <span class="chapter-pages">${chapter.pages} pages</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * Render not found message
   */
  renderNotFound() {
    this.container.innerHTML = `
      <div class="not-found">
        <h2>Manga Not Found</h2>
        <p>The manga you're looking for doesn't exist.</p>
        <button id="back-to-catalog" class="primary-btn">← Back to Catalog</button>
      </div>
    `;
    
    const backBtn = document.getElementById('back-to-catalog');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(mangaId, chapters) {
    // Back button
    const backBtn = document.getElementById('back-to-catalog');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    // Add to favorites button
    const favBtn = document.getElementById('add-to-favorites');
    if (favBtn) {
      favBtn.addEventListener('click', () => this.addToFavorites(mangaId));
    }

    // Start reading button
    const readBtn = document.getElementById('start-reading');
    if (readBtn) {
      readBtn.addEventListener('click', () => {
        if (chapters.length > 0) {
          this.router.navigate(`reader/${mangaId}`, { chapter: 1 });
        } else {
          alert('No chapters available to read.');
        }
      });
    }

    // Chapter items
    const chapterItems = document.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
      item.addEventListener('click', () => {
        const chapterId = item.dataset.chapterId;
        const chapterNumber = chapterId.split('-')[1];
        this.router.navigate(`reader/${mangaId}`, { chapter: chapterNumber });
      });
    });
  }

  /**
   * Add manga to favorites
   */
  addToFavorites(mangaId) {
    // Get current favorites from localStorage
    const favoritesJson = localStorage.getItem('favorites') || '[]';
    const favorites = JSON.parse(favoritesJson);
    
    if (!favorites.includes(mangaId)) {
      favorites.push(mangaId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // Update button
      const favBtn = document.getElementById('add-to-favorites');
      if (favBtn) {
        favBtn.textContent = '✓ Added to Favorites';
        favBtn.disabled = true;
        favBtn.classList.add('btn-success');
      }
    }
  }

  /**
   * Format date string
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
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
