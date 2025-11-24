// Chirui Reader - History View Component

export class HistoryView {
  constructor(container, mangaService, historyService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.historyService = historyService;
    this.router = router;
  }

  /**
   * Render the history view
   */
  render() {
    const history = this.historyService.getHistory();
    const historyWithManga = history
      .map(entry => ({
        ...entry,
        manga: this.mangaService.getMangaById(entry.mangaId)
      }))
      .filter(entry => entry.manga !== null);

    const historyHTML = `
      <div class="history-view">
        <div class="history-header">
          <h2>Reading History</h2>
          <p class="history-subtitle">
            ${historyWithManga.length} ${historyWithManga.length === 1 ? 'item' : 'items'} in your history
          </p>
          ${historyWithManga.length > 0 ? '<button id="clear-history-btn" class="danger-btn">Clear All History</button>' : ''}
        </div>

        ${historyWithManga.length === 0 ? this.renderEmptyState() : this.renderHistoryList(historyWithManga)}
      </div>
    `;

    this.container.innerHTML = historyHTML;
    this.attachEventListeners(historyWithManga);
  }

  /**
   * Render empty state
   */
  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No Reading History</h3>
        <p>Your reading history will appear here as you read manga!</p>
        <button id="browse-catalog-btn" class="primary-btn">Browse Catalog</button>
      </div>
    `;
  }

  /**
   * Render history list
   */
  renderHistoryList(historyWithManga) {
    return `
      <div class="history-list">
        ${historyWithManga.map(entry => this.renderHistoryItem(entry)).join('')}
      </div>
    `;
  }

  /**
   * Render a single history item
   */
  renderHistoryItem(entry) {
    return `
      <div class="history-item" data-manga-id="${this.escapeHtml(entry.mangaId)}">
        <img 
          src="${this.escapeHtml(entry.manga.cover)}" 
          alt="${this.escapeHtml(entry.manga.title)}" 
          class="history-item-cover"
          loading="lazy"
        />
        <div class="history-item-info">
          <h3 class="history-item-title">${this.escapeHtml(entry.manga.title)}</h3>
          <div class="history-item-meta">
            <span class="history-progress">Chapter ${entry.chapterNumber}, Page ${entry.pageNumber}</span>
            <span class="history-time">${this.formatTime(entry.timestamp)}</span>
          </div>
          <div class="history-item-actions">
            <button class="continue-reading-btn" data-manga-id="${this.escapeHtml(entry.mangaId)}" data-chapter="${entry.chapterNumber}">
              Continue Reading
            </button>
            <button class="remove-history-btn" data-manga-id="${this.escapeHtml(entry.mangaId)}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Format timestamp to relative time
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(historyWithManga) {
    // Browse catalog button (if empty state)
    const browseCatalogBtn = document.getElementById('browse-catalog-btn');
    if (browseCatalogBtn) {
      browseCatalogBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all reading history?')) {
          this.historyService.clearHistory();
          this.render();
        }
      });
    }

    // History item clicks
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't navigate if clicking action buttons
        if (!e.target.classList.contains('continue-reading-btn') && 
            !e.target.classList.contains('remove-history-btn')) {
          const mangaId = item.dataset.mangaId;
          this.router.navigate(`manga/${mangaId}`);
        }
      });
    });

    // Continue reading buttons
    const continueButtons = document.querySelectorAll('.continue-reading-btn');
    continueButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mangaId = btn.dataset.mangaId;
        const chapter = btn.dataset.chapter;
        this.router.navigate(`reader/${mangaId}`, { chapter });
      });
    });

    // Remove history buttons
    const removeButtons = document.querySelectorAll('.remove-history-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mangaId = btn.dataset.mangaId;
        this.historyService.removeMangaHistory(mangaId);
        this.render();
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
