// Chirui Reader - MangaDex Source
// Implementation of MangaDex API v5 source

import { MangaSource } from './manga-source.js';

export class MangaDexSource extends MangaSource {
  constructor() {
    super();
    this.id = 'mangadex';
    this.name = 'MangaDex';
    this.lang = 'en';
    this.baseUrl = 'https://mangadex.org';
    this.apiUrl = 'https://api.mangadex.org';
    this.supportsLatest = true;
    this.isNsfw = false;
    this.coverQuality = 'medium'; // 'low', 'medium', 'high'
  }

  /**
   * Search manga by query
   */
  async searchManga(query, page = 1) {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const params = new URLSearchParams({
      title: query,
      limit: limit.toString(),
      offset: offset.toString(),
      'includes[]': ['cover_art', 'author', 'artist'],
      'contentRating[]': ['safe', 'suggestive'],
      'order[relevance]': 'desc'
    });

    const url = `${this.apiUrl}/manga?${params}`;
    const response = await this.fetch(url);
    const data = await response.json();

    return this.parseMangaList(data);
  }

  /**
   * Get popular manga
   */
  async getPopularManga(page = 1) {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      'includes[]': ['cover_art', 'author', 'artist'],
      'contentRating[]': ['safe', 'suggestive'],
      'order[followedCount]': 'desc'
    });

    const url = `${this.apiUrl}/manga?${params}`;
    const response = await this.fetch(url);
    const data = await response.json();

    return this.parseMangaList(data);
  }

  /**
   * Get latest updates
   */
  async getLatestUpdates(page = 1) {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      'includes[]': ['cover_art', 'author', 'artist'],
      'contentRating[]': ['safe', 'suggestive'],
      'order[latestUploadedChapter]': 'desc'
    });

    const url = `${this.apiUrl}/manga?${params}`;
    const response = await this.fetch(url);
    const data = await response.json();

    return this.parseMangaList(data);
  }

  /**
   * Get manga details
   */
  async getMangaDetails(mangaId) {
    const params = new URLSearchParams({
      'includes[]': ['cover_art', 'author', 'artist']
    });

    const url = `${this.apiUrl}/manga/${mangaId}?${params}`;
    const response = await this.fetch(url);
    const data = await response.json();

    const manga = data.data;
    const attributes = manga.attributes;
    
    // Get cover art
    const coverRelation = manga.relationships.find(rel => rel.type === 'cover_art');
    const coverFilename = coverRelation?.attributes?.fileName;
    const coverUrl = coverFilename 
      ? `https://uploads.mangadex.org/covers/${mangaId}/${coverFilename}.512.jpg`
      : '';

    // Get author/artist
    const authorRelation = manga.relationships.find(rel => rel.type === 'author');
    const author = authorRelation?.attributes?.name || 'Unknown';

    // Get genres
    const genres = attributes.tags
      .filter(tag => tag.attributes.group === 'genre')
      .map(tag => tag.attributes.name.en);

    return {
      id: manga.id,
      title: attributes.title.en || Object.values(attributes.title)[0] || 'Unknown',
      author: author,
      artist: author,
      description: attributes.description.en || Object.values(attributes.description)[0] || '',
      genres: genres,
      status: attributes.status.charAt(0).toUpperCase() + attributes.status.slice(1),
      cover: coverUrl,
      rating: 0, // MangaDex doesn't provide ratings in API
      chapters: 0, // Will be filled when getting chapter list
      lastUpdated: attributes.updatedAt,
      source: this.name,
      sourceId: this.id,
      url: `${this.baseUrl}/title/${mangaId}`
    };
  }

  /**
   * Get chapter list for a manga
   */
  async getChapterList(mangaId) {
    const chapters = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams({
        manga: mangaId,
        limit: limit.toString(),
        offset: offset.toString(),
        'translatedLanguage[]': 'en',
        'order[chapter]': 'desc',
        'contentRating[]': ['safe', 'suggestive']
      });

      const url = `${this.apiUrl}/chapter?${params}`;
      const response = await this.fetch(url);
      const data = await response.json();

      for (const chapter of data.data) {
        const attributes = chapter.attributes;
        chapters.push({
          id: chapter.id,
          mangaId: mangaId,
          number: parseFloat(attributes.chapter) || 0,
          title: attributes.title || `Chapter ${attributes.chapter}`,
          volume: attributes.volume || null,
          releaseDate: attributes.publishAt,
          pages: attributes.pages,
          scanlationGroup: chapter.relationships.find(r => r.type === 'scanlation_group')?.attributes?.name || 'Unknown',
          url: `${this.baseUrl}/chapter/${chapter.id}`
        });
      }

      hasMore = data.data.length === limit;
      offset += limit;

      // Safety limit to prevent infinite loops
      if (offset > 1000) break;
    }

    return chapters;
  }

  /**
   * Get page list for a chapter
   */
  async getPageList(chapterId) {
    const url = `${this.apiUrl}/at-home/server/${chapterId}`;
    const response = await this.fetch(url);
    const data = await response.json();

    const baseUrl = data.baseUrl;
    const chapterHash = data.chapter.hash;
    const quality = 'data'; // 'data' for high quality, 'dataSaver' for compressed

    const pages = data.chapter[quality].map((filename, index) => ({
      index: index,
      url: `${baseUrl}/${quality}/${chapterHash}/${filename}`,
      filename: filename
    }));

    return pages;
  }

  /**
   * Parse manga list from API response
   */
  parseMangaList(data) {
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map(manga => {
      const attributes = manga.attributes;
      
      // Get cover art
      const coverRelation = manga.relationships.find(rel => rel.type === 'cover_art');
      const coverFilename = coverRelation?.attributes?.fileName;
      const coverUrl = coverFilename 
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFilename}.256.jpg`
        : '';

      // Get author
      const authorRelation = manga.relationships.find(rel => rel.type === 'author');
      const author = authorRelation?.attributes?.name || 'Unknown';

      // Get genres
      const genres = attributes.tags
        .filter(tag => tag.attributes.group === 'genre')
        .map(tag => tag.attributes.name.en)
        .slice(0, 3); // Limit to 3 genres for list view

      return {
        id: manga.id,
        title: attributes.title.en || Object.values(attributes.title)[0] || 'Unknown',
        author: author,
        cover: coverUrl,
        status: attributes.status.charAt(0).toUpperCase() + attributes.status.slice(1),
        genres: genres,
        description: (attributes.description.en || Object.values(attributes.description)[0] || '').substring(0, 200),
        rating: 0,
        chapters: 0,
        lastUpdated: attributes.updatedAt,
        source: this.name,
        sourceId: this.id,
        url: `${this.baseUrl}/title/${manga.id}`
      };
    });
  }

  /**
   * Fetch override with error handling specific to MangaDex
   */
  async fetch(url, options = {}) {
    try {
      return await super.fetch(url, options);
    } catch (error) {
      // Handle rate limiting
      if (error.message.includes('429')) {
        console.warn('[MangaDex] Rate limited, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return await super.fetch(url, options);
      }
      throw error;
    }
  }
}
