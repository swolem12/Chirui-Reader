// Chirui Reader - ComicK Source
// Implementation of ComicK.io API source
// ComicK is a modern manga/comic aggregator with a clean API

import { MangaSource } from './manga-source.js';

export class ComicKSource extends MangaSource {
  constructor() {
    super();
    this.id = 'comick';
    this.name = 'ComicK';
    this.lang = 'en';
    this.baseUrl = 'https://api.comick.fun';
    this.cdnUrl = 'https://meo.comick.pictures'; // ComicK CDN for images
    this.supportsLatest = true;
    this.isNsfw = false;
    this.useCorsProxy = false; // ComicK has an API, no proxy needed
  }

  /**
   * Search manga by query
   */
  async searchManga(query, page = 1) {
    try {
      const url = `${this.baseUrl}/v1.0/search?q=${encodeURIComponent(query)}&page=${page}&limit=20`;
      const response = await this.fetch(url);
      const data = await response.json();
      
      return this.parseMangaList(data);
    } catch (error) {
      console.error(`[${this.name}] Search error:`, error);
      return [];
    }
  }

  /**
   * Get popular manga
   */
  async getPopularManga(page = 1) {
    try {
      // ComicK popular/trending endpoint
      const url = `${this.baseUrl}/v1.0/search?type=comic&page=${page}&limit=20&order=view`;
      const response = await this.fetch(url);
      const data = await response.json();
      
      return this.parseMangaList(data);
    } catch (error) {
      console.error(`[${this.name}] Popular manga error:`, error);
      return [];
    }
  }

  /**
   * Get latest updates
   */
  async getLatestUpdates(page = 1) {
    try {
      const url = `${this.baseUrl}/v1.0/search?type=comic&page=${page}&limit=20&order=uploaded`;
      const response = await this.fetch(url);
      const data = await response.json();
      
      return this.parseMangaList(data);
    } catch (error) {
      console.error(`[${this.name}] Latest updates error:`, error);
      return [];
    }
  }

  /**
   * Get manga details
   */
  async getMangaDetails(mangaId) {
    try {
      const url = `${this.baseUrl}/comic/${mangaId}`;
      const response = await this.fetch(url);
      const data = await response.json();
      
      if (!data || !data.comic) {
        throw new Error('Invalid manga data');
      }

      const comic = data.comic;
      
      return {
        id: mangaId,
        title: comic.title || 'Unknown',
        author: comic.authors?.map(a => a.name).join(', ') || 'Unknown',
        artist: comic.artists?.map(a => a.name).join(', ') || 'Unknown',
        description: comic.desc || '',
        genres: comic.genres?.map(g => g.name) || [],
        status: this.mapStatus(comic.status),
        cover: comic.md_covers?.[0]?.b2key ? `${this.cdnUrl}/${comic.md_covers[0].b2key}` : '',
        rating: comic.bayesian_rating || 0,
        chapters: comic.chapter_count || 0,
        lastUpdated: comic.last_chapter ? new Date(comic.last_chapter * 1000).toISOString() : new Date().toISOString(),
        source: this.name,
        sourceId: this.id,
        url: `https://comick.io/comic/${mangaId}`
      };
    } catch (error) {
      console.error(`[${this.name}] Error getting manga details for ${mangaId}:`, error);
      throw error;
    }
  }

  /**
   * Get chapter list for a manga
   */
  async getChapterList(mangaId) {
    try {
      const url = `${this.baseUrl}/comic/${mangaId}/chapters?lang=en&page=0&limit=300`;
      const response = await this.fetch(url);
      const data = await response.json();

      if (!data || !data.chapters) {
        return [];
      }

      const chapters = data.chapters.map((ch, index) => ({
        id: ch.hid,
        mangaId: mangaId,
        number: parseFloat(ch.chap) || index + 1,
        title: ch.title || `Chapter ${ch.chap}`,
        volume: ch.vol ? parseInt(ch.vol) : null,
        releaseDate: ch.created_at || new Date().toISOString(),
        pages: 0, // Unknown until we load the chapter
        scanlationGroup: ch.group_name?.[0] || 'ComicK',
        url: `https://comick.io/comic/${mangaId}/${ch.hid}`
      }));

      return chapters.reverse(); // Return in ascending order
    } catch (error) {
      console.error(`[${this.name}] Error getting chapter list for ${mangaId}:`, error);
      return [];
    }
  }

  /**
   * Get page list for a chapter
   */
  async getPageList(chapterId) {
    try {
      const url = `${this.baseUrl}/chapter/${chapterId}`;
      const response = await this.fetch(url);
      const data = await response.json();

      if (!data || !data.chapter || !data.chapter.md_images) {
        return [];
      }

      const pages = data.chapter.md_images.map((img, index) => {
        const extension = img.b2key?.split('.').pop() || 'jpg';
        return {
          index: index,
          url: `${this.cdnUrl}/${img.b2key}`,
          filename: `page-${index}.${extension}`
        };
      });

      return pages;
    } catch (error) {
      console.error(`[${this.name}] Error loading chapter ${chapterId}:`, error);
      return [];
    }
  }

  /**
   * Parse manga list from API response
   */
  parseMangaList(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(item => {
      const comic = item.md_comics || item;
      
      return {
        id: comic.slug,
        title: comic.title || 'Unknown',
        author: comic.authors?.map(a => a.name).join(', ') || 'Unknown',
        cover: comic.md_covers?.[0]?.b2key ? `${this.cdnUrl}/${comic.md_covers[0].b2key}` : '',
        status: this.mapStatus(comic.status),
        genres: comic.genres?.map(g => g.name) || [],
        description: (comic.desc || '').substring(0, 200),
        rating: comic.bayesian_rating || 0,
        chapters: comic.chapter_count || 0,
        lastUpdated: comic.last_chapter ? new Date(comic.last_chapter * 1000).toISOString() : new Date().toISOString(),
        source: this.name,
        sourceId: this.id,
        url: `https://comick.io/comic/${comic.slug}`
      };
    });
  }

  /**
   * Map ComicK status to standard status
   */
  mapStatus(status) {
    const statusMap = {
      1: 'Ongoing',
      2: 'Completed',
      3: 'Cancelled',
      4: 'Hiatus'
    };
    return statusMap[status] || 'Unknown';
  }

  /**
   * Custom fetch without CORS proxy (API-based)
   */
  async fetch(url, options = {}) {
    const defaultHeaders = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
      console.error(`[${this.name}] Fetch error for ${url}:`, error);
      throw error;
    }
  }
}
