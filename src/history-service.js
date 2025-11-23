// Chirui Reader - Reading History Service

export class HistoryService {
  constructor() {
    this.storageKey = 'reading-history';
  }

  /**
   * Add or update reading history entry
   * @param {Object} entry - History entry
   */
  addHistoryEntry(mangaId, chapterNumber, pageNumber = 1) {
    const history = this.getHistory();
    const timestamp = new Date().toISOString();
    
    // Remove existing entry for this manga if any
    const filtered = history.filter(h => h.mangaId !== mangaId);
    
    // Add new entry at the beginning
    filtered.unshift({
      mangaId,
      chapterNumber,
      pageNumber,
      timestamp
    });
    
    // Keep only the last 50 entries
    const trimmed = filtered.slice(0, 50);
    
    localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
  }

  /**
   * Get all reading history
   * @returns {Array} History entries
   */
  getHistory() {
    const historyJson = localStorage.getItem(this.storageKey) || '[]';
    return JSON.parse(historyJson);
  }

  /**
   * Get history for a specific manga
   * @param {string} mangaId - Manga ID
   * @returns {Object|null} History entry or null
   */
  getMangaHistory(mangaId) {
    const history = this.getHistory();
    return history.find(h => h.mangaId === mangaId) || null;
  }

  /**
   * Clear all history
   */
  clearHistory() {
    localStorage.setItem(this.storageKey, '[]');
  }

  /**
   * Remove specific manga from history
   * @param {string} mangaId - Manga ID
   */
  removeMangaHistory(mangaId) {
    const history = this.getHistory();
    const filtered = history.filter(h => h.mangaId !== mangaId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}
