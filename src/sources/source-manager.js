// Chirui Reader - Source Manager
// Manages all manga sources and provides a unified interface

import { MangaDexSource } from './mangadex-source.js';
import { ManhwazSource } from './manhwaz-source.js';
import { MangaBuddySource } from './mangabuddy-source.js';

export class SourceManager {
  constructor() {
    this.sources = new Map();
    this.enabledSources = new Set();
    this.initializeSources();
  }

  /**
   * Initialize all available sources
   */
  initializeSources() {
    // Register MangaDex (Priority 1 - Confirmed Working)
    const mangadex = new MangaDexSource();
    this.registerSource(mangadex);
    this.enableSource('mangadex');

    // Register MangaBuddy (Priority 1 - New Reliable Source)
    const mangabuddy = new MangaBuddySource();
    this.registerSource(mangabuddy);
    this.enableSource('mangabuddy');

    // Register Manhwaz (Priority 2 - Known Issues, disabled by default)
    const manhwaz = new ManhwazSource();
    this.registerSource(manhwaz);
    // Don't enable by default until fixed
    // this.enableSource('manhwaz');

    // Load enabled sources from localStorage (will override defaults)
    this.loadEnabledSources();
  }

  /**
   * Register a new source
   * @param {MangaSource} source - Source instance
   */
  registerSource(source) {
    this.sources.set(source.id, source);
  }

  /**
   * Get a source by ID
   * @param {string} sourceId - Source ID
   * @returns {MangaSource|null} Source instance or null
   */
  getSource(sourceId) {
    return this.sources.get(sourceId) || null;
  }

  /**
   * Get all registered sources
   * @returns {Array} Array of sources
   */
  getAllSources() {
    return Array.from(this.sources.values());
  }

  /**
   * Get all enabled sources
   * @returns {Array} Array of enabled sources
   */
  getEnabledSources() {
    return this.getAllSources().filter(source => this.enabledSources.has(source.id));
  }

  /**
   * Enable a source
   * @param {string} sourceId - Source ID
   */
  enableSource(sourceId) {
    if (this.sources.has(sourceId)) {
      this.enabledSources.add(sourceId);
      this.saveEnabledSources();
    }
  }

  /**
   * Disable a source
   * @param {string} sourceId - Source ID
   */
  disableSource(sourceId) {
    this.enabledSources.delete(sourceId);
    this.saveEnabledSources();
  }

  /**
   * Check if a source is enabled
   * @param {string} sourceId - Source ID
   * @returns {boolean} True if enabled
   */
  isSourceEnabled(sourceId) {
    return this.enabledSources.has(sourceId);
  }

  /**
   * Search manga across all enabled sources
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {string} sourceId - Optional: specific source ID
   * @returns {Promise<Object>} Search results grouped by source
   */
  async searchManga(query, page = 1, sourceId = null) {
    const results = {
      query: query,
      page: page,
      sources: []
    };

    const sourcesToSearch = sourceId 
      ? [this.getSource(sourceId)].filter(Boolean)
      : this.getEnabledSources();

    const searchPromises = sourcesToSearch.map(async (source) => {
      try {
        const manga = await source.searchManga(query, page);
        return {
          sourceId: source.id,
          sourceName: source.name,
          manga: manga,
          error: null
        };
      } catch (error) {
        console.error(`[${source.name}] Search error:`, error);
        return {
          sourceId: source.id,
          sourceName: source.name,
          manga: [],
          error: error.message
        };
      }
    });

    results.sources = await Promise.all(searchPromises);
    return results;
  }

  /**
   * Get popular manga from all enabled sources
   * @param {number} page - Page number
   * @param {string} sourceId - Optional: specific source ID
   * @returns {Promise<Object>} Popular manga grouped by source
   */
  async getPopularManga(page = 1, sourceId = null) {
    const results = {
      page: page,
      sources: []
    };

    const sourcesToQuery = sourceId 
      ? [this.getSource(sourceId)].filter(Boolean)
      : this.getEnabledSources();

    const queryPromises = sourcesToQuery.map(async (source) => {
      try {
        const manga = await source.getPopularManga(page);
        return {
          sourceId: source.id,
          sourceName: source.name,
          manga: manga,
          error: null
        };
      } catch (error) {
        console.error(`[${source.name}] Popular manga error:`, error);
        return {
          sourceId: source.id,
          sourceName: source.name,
          manga: [],
          error: error.message
        };
      }
    });

    results.sources = await Promise.all(queryPromises);
    return results;
  }

  /**
   * Get latest updates from all enabled sources
   * @param {number} page - Page number
   * @param {string} sourceId - Optional: specific source ID
   * @returns {Promise<Object>} Latest manga grouped by source
   */
  async getLatestUpdates(page = 1, sourceId = null) {
    const results = {
      page: page,
      sources: []
    };

    const sourcesToQuery = sourceId 
      ? [this.getSource(sourceId)].filter(Boolean)
      : this.getEnabledSources().filter(s => s.supportsLatest);

    const queryPromises = sourcesToQuery.map(async (source) => {
      try {
        const manga = await source.getLatestUpdates(page);
        return {
          sourceId: source.id,
          sourceName: source.name,
          manga: manga,
          error: null
        };
      } catch (error) {
        console.error(`[${source.name}] Latest updates error:`, error);
        return {
          sourceId: source.id,
          sourceName: source.name,
          manga: [],
          error: error.message
        };
      }
    });

    results.sources = await Promise.all(queryPromises);
    return results;
  }

  /**
   * Save enabled sources to localStorage
   */
  saveEnabledSources() {
    const enabled = Array.from(this.enabledSources);
    localStorage.setItem('enabledSources', JSON.stringify(enabled));
  }

  /**
   * Load enabled sources from localStorage
   */
  loadEnabledSources() {
    try {
      const enabled = JSON.parse(localStorage.getItem('enabledSources') || '[]');
      enabled.forEach(sourceId => {
        if (this.sources.has(sourceId)) {
          this.enabledSources.add(sourceId);
        }
      });
    } catch (error) {
      console.error('Failed to load enabled sources:', error);
    }
  }
}
