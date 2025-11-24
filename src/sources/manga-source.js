// Chirui Reader - Base Source Interface
// This defines the contract that all manga sources must implement

export class MangaSource {
  constructor() {
    this.id = '';
    this.name = '';
    this.lang = 'en';
    this.baseUrl = '';
    this.supportsLatest = false;
    this.isNsfw = false;
  }

  /**
   * Get source information
   * @returns {Object} Source metadata
   */
  getSourceInfo() {
    return {
      id: this.id,
      name: this.name,
      lang: this.lang,
      baseUrl: this.baseUrl,
      supportsLatest: this.supportsLatest,
      isNsfw: this.isNsfw
    };
  }

  /**
   * Search manga by query
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {Promise<Array>} Array of manga objects
   */
  async searchManga(query, page = 1) {
    throw new Error('searchManga() must be implemented by source');
  }

  /**
   * Get popular manga
   * @param {number} page - Page number
   * @returns {Promise<Array>} Array of manga objects
   */
  async getPopularManga(page = 1) {
    throw new Error('getPopularManga() must be implemented by source');
  }

  /**
   * Get latest updates
   * @param {number} page - Page number
   * @returns {Promise<Array>} Array of manga objects
   */
  async getLatestUpdates(page = 1) {
    if (!this.supportsLatest) {
      throw new Error('This source does not support latest updates');
    }
    throw new Error('getLatestUpdates() must be implemented by source');
  }

  /**
   * Get manga details
   * @param {string} mangaId - Manga ID
   * @returns {Promise<Object>} Manga details
   */
  async getMangaDetails(mangaId) {
    throw new Error('getMangaDetails() must be implemented by source');
  }

  /**
   * Get chapter list for a manga
   * @param {string} mangaId - Manga ID
   * @returns {Promise<Array>} Array of chapters
   */
  async getChapterList(mangaId) {
    throw new Error('getChapterList() must be implemented by source');
  }

  /**
   * Get page list for a chapter
   * @param {string} chapterId - Chapter ID
   * @returns {Promise<Array>} Array of page URLs
   */
  async getPageList(chapterId) {
    throw new Error('getPageList() must be implemented by source');
  }

  /**
   * Get image URL (optional, for sources that need special processing)
   * @param {string} page - Page URL or identifier
   * @returns {Promise<string>} Image URL
   */
  async getImageUrl(page) {
    return page; // Default: return the page URL as-is
  }

  /**
   * Fetch with proper headers for this source
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async fetch(url, options = {}) {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': this.baseUrl
    };

    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, mergedOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error(`[${this.name}] Fetch error:`, error);
      throw error;
    }
  }

  /**
   * Parse HTML string to Document
   * @param {string} html - HTML string
   * @returns {Document} Parsed document
   */
  parseHtml(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
}
