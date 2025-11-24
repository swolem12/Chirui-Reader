// Chirui Reader - Manga Data Service
// Integrates with Source Manager for real manga data

import { SourceManager } from './sources/source-manager.js';

export class MangaService {
  constructor() {
    this.sourceManager = new SourceManager();
    this.useRealSources = true; // Toggle to switch between mock and real data
    this.cache = new Map(); // Cache for manga data
    
    // Sample manga data (fallback)
    this.mangaData = [
      {
        id: '1',
        title: 'One Piece',
        author: 'Eiichiro Oda',
        status: 'Ongoing',
        description: 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the One Piece.',
        cover: 'https://via.placeholder.com/200x280/1976d2/ffffff?text=One+Piece',
        genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
        rating: 4.8,
        chapters: 1095,
        lastUpdated: '2025-11-20'
      },
      {
        id: '2',
        title: 'Attack on Titan',
        author: 'Hajime Isayama',
        status: 'Completed',
        description: 'Humanity lives inside cities surrounded by enormous walls that protect them from gigantic man-eating humanoids referred to as Titans.',
        cover: 'https://via.placeholder.com/200x280/d32f2f/ffffff?text=Attack+on+Titan',
        genres: ['Action', 'Dark Fantasy', 'Post-apocalyptic'],
        rating: 4.9,
        chapters: 139,
        lastUpdated: '2021-04-09'
      },
      {
        id: '3',
        title: 'My Hero Academia',
        author: 'Kohei Horikoshi',
        status: 'Ongoing',
        description: 'A superhero-admiring boy without any powers enrolls in a prestigious hero academy and learns what it really means to be a hero.',
        cover: 'https://via.placeholder.com/200x280/26a69a/ffffff?text=My+Hero+Academia',
        genres: ['Action', 'Adventure', 'Superhero'],
        rating: 4.7,
        chapters: 405,
        lastUpdated: '2025-11-18'
      },
      {
        id: '4',
        title: 'Demon Slayer',
        author: 'Koyoharu Gotouge',
        status: 'Completed',
        description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.',
        cover: 'https://via.placeholder.com/200x280/9c27b0/ffffff?text=Demon+Slayer',
        genres: ['Action', 'Adventure', 'Dark Fantasy'],
        rating: 4.8,
        chapters: 205,
        lastUpdated: '2020-05-18'
      },
      {
        id: '5',
        title: 'Naruto',
        author: 'Masashi Kishimoto',
        status: 'Completed',
        description: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.',
        cover: 'https://via.placeholder.com/200x280/ff9800/ffffff?text=Naruto',
        genres: ['Action', 'Adventure', 'Martial Arts'],
        rating: 4.6,
        chapters: 700,
        lastUpdated: '2014-11-10'
      },
      {
        id: '6',
        title: 'Solo Leveling',
        author: 'Chugong',
        status: 'Completed',
        description: 'In a world where hunters battle monsters, E-rank hunter Jinwoo Sung is the weakest of them all. After a near-death experience, he gains a unique power.',
        cover: 'https://via.placeholder.com/200x280/4caf50/ffffff?text=Solo+Leveling',
        genres: ['Action', 'Adventure', 'Fantasy'],
        rating: 4.9,
        chapters: 179,
        lastUpdated: '2021-12-29'
      },
      {
        id: '7',
        title: 'Jujutsu Kaisen',
        author: 'Gege Akutami',
        status: 'Ongoing',
        description: 'A boy swallows a cursed talisman and becomes possessed. He must learn to control this power to help save others from curses.',
        cover: 'https://via.placeholder.com/200x280/3f51b5/ffffff?text=Jujutsu+Kaisen',
        genres: ['Action', 'Dark Fantasy', 'Supernatural'],
        rating: 4.8,
        chapters: 245,
        lastUpdated: '2025-11-15'
      },
      {
        id: '8',
        title: 'Tokyo Ghoul',
        author: 'Sui Ishida',
        status: 'Completed',
        description: 'A college student is turned into a half-ghoul and must navigate the complex social dynamics between humans and ghouls.',
        cover: 'https://via.placeholder.com/200x280/607d8b/ffffff?text=Tokyo+Ghoul',
        genres: ['Action', 'Dark Fantasy', 'Horror'],
        rating: 4.5,
        chapters: 143,
        lastUpdated: '2014-09-18'
      }
    ];
  }

  /**
   * Get all manga from enabled sources or fallback to mock data
   * @param {number} page - Page number
   * @param {string} sourceId - Optional specific source ID
   * @returns {Promise<Array>} All manga
   */
  async getAllManga(page = 1, sourceId = null) {
    if (!this.useRealSources) {
      return [...this.mangaData];
    }

    try {
      const results = await this.sourceManager.getPopularManga(page, sourceId);
      const allManga = [];
      
      // Combine results from all sources
      for (const sourceResult of results.sources) {
        if (!sourceResult.error && sourceResult.manga) {
          // Add source info to each manga
          sourceResult.manga.forEach(manga => {
            manga.sourceId = sourceResult.sourceId;
            manga.source = sourceResult.sourceName;
          });
          allManga.push(...sourceResult.manga);
        }
      }
      
      return allManga.length > 0 ? allManga : this.mangaData;
    } catch (error) {
      console.error('Failed to fetch manga from sources:', error);
      return [...this.mangaData];
    }
  }

  /**
   * Get manga by ID from source or cache
   * @param {string} id - Manga ID
   * @param {string} sourceId - Source ID
   * @returns {Promise<Object|null>} Manga object or null if not found
   */
  async getMangaById(id, sourceId = null) {
    // Check cache first
    const cacheKey = `${sourceId || 'mock'}-${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.useRealSources || !sourceId) {
      return this.mangaData.find(manga => manga.id === id) || null;
    }

    try {
      const source = this.sourceManager.getSource(sourceId);
      if (!source) {
        return this.mangaData.find(manga => manga.id === id) || null;
      }

      const manga = await source.getMangaDetails(id);
      // Cache the result
      this.cache.set(cacheKey, manga);
      return manga;
    } catch (error) {
      console.error('Failed to fetch manga details:', error);
      return this.mangaData.find(manga => manga.id === id) || null;
    }
  }

  /**
   * Search manga across sources or in mock data
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {string} sourceId - Optional specific source ID
   * @returns {Promise<Array>} Filtered manga array
   */
  async searchManga(query, page = 1, sourceId = null) {
    if (!query || query.trim() === '') {
      return await this.getAllManga(page, sourceId);
    }
    
    if (!this.useRealSources) {
      const lowerQuery = query.toLowerCase();
      return this.mangaData.filter(manga =>
        manga.title.toLowerCase().includes(lowerQuery) ||
        manga.author.toLowerCase().includes(lowerQuery) ||
        manga.description.toLowerCase().includes(lowerQuery)
      );
    }

    try {
      const results = await this.sourceManager.searchManga(query, page, sourceId);
      const allManga = [];
      
      // Combine results from all sources
      for (const sourceResult of results.sources) {
        if (!sourceResult.error && sourceResult.manga) {
          // Add source info to each manga
          sourceResult.manga.forEach(manga => {
            manga.sourceId = sourceResult.sourceId;
            manga.source = sourceResult.sourceName;
          });
          allManga.push(...sourceResult.manga);
        }
      }
      
      return allManga.length > 0 ? allManga : this.searchMangaMock(query);
    } catch (error) {
      console.error('Failed to search manga:', error);
      return this.searchMangaMock(query);
    }
  }

  /**
   * Search in mock data (fallback)
   */
  searchMangaMock(query) {
    const lowerQuery = query.toLowerCase();
    return this.mangaData.filter(manga =>
      manga.title.toLowerCase().includes(lowerQuery) ||
      manga.author.toLowerCase().includes(lowerQuery) ||
      manga.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter manga by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Filtered manga array
   */
  async filterManga(filters = {}) {
    // Use provided results or get all manga
    let results = filters.results || await this.getAllManga(filters.page || 1, filters.sourceId);

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      results = results.filter(manga => 
        manga.status && manga.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filter by genre
    if (filters.genre && filters.genre !== 'all') {
      results = results.filter(manga => 
        manga.genres && manga.genres.some(g => 
          g.toLowerCase() === filters.genre.toLowerCase()
        )
      );
    }

    // Filter by minimum rating
    if (filters.minRating) {
      results = results.filter(manga => manga.rating >= parseFloat(filters.minRating));
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'title':
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'updated':
          results.sort((a, b) => {
            const dateA = new Date(a.lastUpdated || 0);
            const dateB = new Date(b.lastUpdated || 0);
            return dateB - dateA;
          });
          break;
        case 'chapters':
          results.sort((a, b) => (b.chapters || 0) - (a.chapters || 0));
          break;
      }
    }

    return results;
  }

  /**
   * Get unique genres from all manga
   * @returns {Array} Array of unique genres
   */
  getAllGenres() {
    const genresSet = new Set();
    this.mangaData.forEach(manga => {
      manga.genres.forEach(genre => genresSet.add(genre));
    });
    return Array.from(genresSet).sort();
  }

  /**
   * Get manga chapters from source or mock data
   * @param {string} mangaId - Manga ID
   * @param {string} sourceId - Source ID
   * @returns {Promise<Array>} Array of chapters
   */
  async getChapters(mangaId, sourceId = null) {
    if (!this.useRealSources || !sourceId) {
      return this.getChaptersMock(mangaId);
    }

    try {
      const source = this.sourceManager.getSource(sourceId);
      if (!source) {
        return this.getChaptersMock(mangaId);
      }

      const chapters = await source.getChapterList(mangaId);
      return chapters;
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      return this.getChaptersMock(mangaId);
    }
  }

  /**
   * Get chapters from mock data
   */
  getChaptersMock(mangaId) {
    const manga = this.mangaData.find(m => m.id === mangaId);
    if (!manga) return [];
    
    // Generate sample chapters
    const chapters = [];
    for (let i = 1; i <= Math.min(10, manga.chapters); i++) {
      chapters.push({
        id: `${mangaId}-${i}`,
        number: i,
        title: `Chapter ${i}`,
        releaseDate: '2025-11-01',
        pages: 20
      });
    }
    return chapters;
  }

  /**
   * Get chapter pages from source
   * @param {string} chapterId - Chapter ID
   * @param {string} sourceId - Source ID
   * @returns {Promise<Array>} Array of page URLs
   */
  async getChapterPages(chapterId, sourceId) {
    if (!this.useRealSources || !sourceId) {
      return this.getChapterPagesMock(chapterId);
    }

    try {
      const source = this.sourceManager.getSource(sourceId);
      if (!source) {
        return this.getChapterPagesMock(chapterId);
      }

      const pages = await source.getPageList(chapterId);
      return pages;
    } catch (error) {
      console.error('Failed to fetch chapter pages:', error);
      return this.getChapterPagesMock(chapterId);
    }
  }

  /**
   * Get pages from mock data
   */
  getChapterPagesMock(chapterId) {
    const pages = [];
    for (let i = 1; i <= 20; i++) {
      pages.push({
        index: i - 1,
        url: `https://via.placeholder.com/800x1200/1976d2/ffffff?text=Page+${i}`,
        filename: `page-${i}.jpg`
      });
    }
    return pages;
  }

  /**
   * Get all available sources
   * @returns {Array} Array of sources
   */
  getAllSources() {
    return this.sourceManager.getAllSources().map(source => source.getSourceInfo());
  }

  /**
   * Get enabled sources
   * @returns {Array} Array of enabled sources
   */
  getEnabledSources() {
    return this.sourceManager.getEnabledSources().map(source => source.getSourceInfo());
  }

  /**
   * Toggle source enabled state
   * @param {string} sourceId - Source ID
   * @param {boolean} enabled - Enable or disable
   */
  toggleSource(sourceId, enabled) {
    if (enabled) {
      this.sourceManager.enableSource(sourceId);
    } else {
      this.sourceManager.disableSource(sourceId);
    }
  }

  /**
   * Toggle between real sources and mock data
   * @param {boolean} useReal - Use real sources or mock data
   */
  toggleRealSources(useReal) {
    this.useRealSources = useReal;
    // Clear cache when switching
    this.cache.clear();
  }
}
