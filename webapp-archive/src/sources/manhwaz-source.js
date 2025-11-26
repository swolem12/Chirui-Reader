// Chirui Reader - Manhwaz Source
// Implementation of Manhwaz.com scraper source

import { MangaSource } from './manga-source.js';

export class ManhwazSource extends MangaSource {
  constructor() {
    super();
    this.id = 'manhwaz';
    this.name = 'Manhwaz';
    this.lang = 'en';
    this.baseUrl = 'https://manhwaz.com';
    this.supportsLatest = true;
    this.isNsfw = false;
    this.useCorsProxy = true; // Enable CORS proxy for this scraper source
  }

  /**
   * Search manga by query
   */
  async searchManga(query, page = 1) {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    return this.parseMangaList(doc);
  }

  /**
   * Get popular manga
   */
  async getPopularManga(page = 1) {
    const url = `${this.baseUrl}/popular?page=${page}`;
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    return this.parseMangaList(doc);
  }

  /**
   * Get latest updates
   */
  async getLatestUpdates(page = 1) {
    const url = `${this.baseUrl}/latest?page=${page}`;
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    return this.parseMangaList(doc);
  }

  /**
   * Get manga details
   */
  async getMangaDetails(mangaId) {
    const url = `${this.baseUrl}/manga/${mangaId}`;
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    // Extract manga information
    const title = doc.querySelector('.manga-title, h1.title, .series-title')?.textContent?.trim() || 'Unknown';
    const cover = doc.querySelector('.manga-cover img, .series-cover img')?.src || '';
    const author = doc.querySelector('.manga-author, .author-name')?.textContent?.trim() || 'Unknown';
    const artist = doc.querySelector('.manga-artist, .artist-name')?.textContent?.trim() || author;
    const description = doc.querySelector('.manga-description, .synopsis, .summary')?.textContent?.trim() || '';
    const status = doc.querySelector('.manga-status, .status')?.textContent?.trim() || 'Unknown';
    
    // Extract genres
    const genreElements = doc.querySelectorAll('.manga-genres .genre-tag, .genre, .genres a');
    const genres = Array.from(genreElements).map(el => el.textContent.trim());

    // Extract rating
    const ratingText = doc.querySelector('.manga-rating, .rating')?.textContent?.trim() || '0';
    const rating = parseFloat(ratingText) || 0;

    return {
      id: mangaId,
      title: title,
      author: author,
      artist: artist,
      description: description,
      genres: genres,
      status: status,
      cover: cover,
      rating: rating,
      chapters: 0, // Will be filled when getting chapter list
      lastUpdated: new Date().toISOString(),
      source: this.name,
      sourceId: this.id,
      url: url
    };
  }

  /**
   * Get chapter list for a manga
   */
  async getChapterList(mangaId) {
    const url = `${this.baseUrl}/manga/${mangaId}`;
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    const chapters = [];
    const chapterElements = doc.querySelectorAll('.chapter-list .chapter-row, .chapter-item, .chapters li');

    chapterElements.forEach((el, index) => {
      const link = el.querySelector('a[href*="chapter"]');
      if (!link) return;

      const href = link.getAttribute('href');
      const chapterIdMatch = href.match(/chapter[/-](\d+(?:\.\d+)?)/i);
      const chapterId = chapterIdMatch ? chapterIdMatch[1] : index.toString();

      const title = link.textContent.trim();
      const numberMatch = title.match(/chapter[:\s]*(\d+(?:\.\d+)?)/i);
      const number = numberMatch ? parseFloat(numberMatch[1]) : index + 1;

      const dateEl = el.querySelector('.chapter-date, .release-date, time');
      const releaseDate = dateEl?.textContent?.trim() || new Date().toISOString();

      chapters.push({
        id: chapterId,
        mangaId: mangaId,
        number: number,
        title: title,
        volume: null,
        releaseDate: releaseDate,
        pages: 0, // Unknown until we load the chapter
        scanlationGroup: 'Manhwaz',
        url: link.href.startsWith('http') ? link.href : `${this.baseUrl}${href}`
      });
    });

    return chapters.reverse(); // Return in ascending order
  }

  /**
   * Get page list for a chapter
   */
  async getPageList(chapterId) {
    // Construct chapter URL - try multiple patterns
    let url = `${this.baseUrl}/chapter/${chapterId}`;
    
    try {
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      const pages = [];
      
      // Try multiple possible selectors for chapter images
      const imageElements = doc.querySelectorAll(
        '.page-img img, .manga-page-img img, .chapter-img img, .reader-img img, img[data-src*="chapter"]'
      );

      imageElements.forEach((img, index) => {
        const imageUrl = img.getAttribute('data-src') || img.getAttribute('src');
        if (imageUrl) {
          pages.push({
            index: index,
            url: imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`,
            filename: `page-${index}.jpg`
          });
        }
      });

      // If no images found in typical containers, try to find in script tags (common pattern)
      if (pages.length === 0) {
        const scripts = doc.querySelectorAll('script');
        for (const script of scripts) {
          const content = script.textContent;
          
          // Look for image arrays in JavaScript
          const imageArrayMatch = content.match(/(?:images|pages|chapter_images)\s*=\s*(\[[^\]]+\])/);
          if (imageArrayMatch) {
            try {
              const imageArray = JSON.parse(imageArrayMatch[1]);
              imageArray.forEach((url, index) => {
                pages.push({
                  index: index,
                  url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
                  filename: `page-${index}.jpg`
                });
              });
              break;
            } catch (e) {
              console.warn('Failed to parse image array from script:', e);
            }
          }
        }
      }

      return pages;
    } catch (error) {
      console.error(`[${this.name}] Error loading chapter ${chapterId}:`, error);
      return [];
    }
  }

  /**
   * Parse manga list from HTML document
   */
  parseMangaList(doc) {
    const mangaList = [];
    
    // Try multiple possible selectors for manga cards
    const cardElements = doc.querySelectorAll(
      '.manga-card, .manga-item, .series-card, .manhwa-item, .item'
    );

    cardElements.forEach(card => {
      const link = card.querySelector('a[href*="manga"], a[href*="series"]');
      if (!link) return;

      const href = link.getAttribute('href');
      const idMatch = href.match(/(?:manga|series)[/-]([^/]+)/);
      const id = idMatch ? idMatch[1] : '';

      if (!id) return;

      const title = card.querySelector('.manga-title, .title, h3, h4')?.textContent?.trim() || 'Unknown';
      const cover = card.querySelector('img')?.src || '';
      const description = card.querySelector('.manga-description, .description')?.textContent?.trim() || '';
      const latestChapter = card.querySelector('.latest-chapter, .chapter')?.textContent?.trim() || '';
      
      // Extract genres
      const genreElements = card.querySelectorAll('.genre-tag, .genre');
      const genres = Array.from(genreElements).map(el => el.textContent.trim()).slice(0, 3);

      // Extract rating
      const ratingText = card.querySelector('.rating, .score')?.textContent?.trim() || '0';
      const rating = parseFloat(ratingText) || 0;

      // Extract status
      const status = card.querySelector('.status')?.textContent?.trim() || 'Ongoing';

      // Extract chapter count
      const chapterMatch = latestChapter ? latestChapter.match(/\d+/) : null;
      const chapterCount = chapterMatch ? parseInt(chapterMatch[0]) : 0;

      mangaList.push({
        id: id,
        title: title,
        author: 'Unknown',
        cover: cover,
        status: status,
        genres: genres,
        description: description.substring(0, 200),
        rating: rating,
        chapters: chapterCount,
        lastUpdated: new Date().toISOString(),
        source: this.name,
        sourceId: this.id,
        url: link.href.startsWith('http') ? link.href : `${this.baseUrl}${href}`
      });
    });

    return mangaList;
  }

  /**
   * Custom fetch with referrer for image loading
   */
  async fetch(url, options = {}) {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': this.baseUrl,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
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
