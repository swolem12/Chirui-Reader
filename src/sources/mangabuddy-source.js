// Chirui Reader - MangaBuddy Source
// Implementation of MangaBuddy.com scraper source
// A reliable alternative to Manhwaz for manga/manhwa content

import { MangaSource } from './manga-source.js';

export class MangaBuddySource extends MangaSource {
  constructor() {
    super();
    this.id = 'mangabuddy';
    this.name = 'MangaBuddy';
    this.lang = 'en';
    this.baseUrl = 'https://mangabuddy.com';
    this.supportsLatest = true;
    this.isNsfw = false;
    this.useCorsProxy = true; // Enable CORS proxy for this scraper source
  }

  /**
   * Search manga by query
   */
  async searchManga(query, page = 1) {
    try {
      const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      return this.parseMangaList(doc);
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
      const url = `${this.baseUrl}/popular?page=${page}`;
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      return this.parseMangaList(doc);
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
      const url = `${this.baseUrl}/latest?page=${page}`;
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      return this.parseMangaList(doc);
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
      const url = `${this.baseUrl}/manga/${mangaId}`;
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      // MangaBuddy specific selectors
      const title = doc.querySelector('h1.title, .manga-title, .series-title')?.textContent?.trim() || 'Unknown';
      const cover = doc.querySelector('.manga-cover img, .cover img, img.cover')?.src || '';
      const author = doc.querySelector('.author a, .manga-author')?.textContent?.trim() || 'Unknown';
      const artist = doc.querySelector('.artist a, .manga-artist')?.textContent?.trim() || author;
      const description = doc.querySelector('.summary, .description, .manga-description')?.textContent?.trim() || '';
      const status = doc.querySelector('.status, .manga-status')?.textContent?.trim() || 'Unknown';
      
      // Extract genres
      const genreElements = doc.querySelectorAll('.genres a, .genre-tag, .tag');
      const genres = Array.from(genreElements).map(el => el.textContent.trim());

      // Extract rating
      const ratingText = doc.querySelector('.rating, .score')?.textContent?.trim() || '0';
      const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '0');

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
      const url = `${this.baseUrl}/manga/${mangaId}`;
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      const chapters = [];
      const chapterElements = doc.querySelectorAll('.chapter-list li, .chapter-item, .chapters-list li, ul.chapter-list a');

      chapterElements.forEach((el, index) => {
        const link = el.tagName === 'A' ? el : el.querySelector('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const chapterIdMatch = href.match(/chapter[/-](\d+(?:\.\d+)?)/i) || href.match(/\/(\d+(?:\.\d+)?)$/);
        const chapterId = chapterIdMatch ? chapterIdMatch[1] : index.toString();

        const title = link.textContent.trim();
        const numberMatch = title.match(/chapter[:\s]*(\d+(?:\.\d+)?)/i);
        const number = numberMatch ? parseFloat(numberMatch[1]) : index + 1;

        const dateEl = el.querySelector('.date, .chapter-date, time');
        const releaseDate = dateEl?.textContent?.trim() || new Date().toISOString();

        chapters.push({
          id: chapterId,
          mangaId: mangaId,
          number: number,
          title: title,
          volume: null,
          releaseDate: releaseDate,
          pages: 0, // Unknown until we load the chapter
          scanlationGroup: 'MangaBuddy',
          url: link.href.startsWith('http') ? link.href : `${this.baseUrl}${href}`
        });
      });

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
      // MangaBuddy chapter URL pattern
      const url = `${this.baseUrl}/chapter/${chapterId}`;
      
      const response = await this.fetch(url);
      const html = await response.text();
      const doc = this.parseHtml(html);

      const pages = [];
      
      // Try multiple selectors for chapter images
      const imageElements = doc.querySelectorAll(
        '.page-img img, .chapter-img img, .reader-img img, #chapter-reader img, .reading-content img'
      );

      imageElements.forEach((img, index) => {
        const imageUrl = img.getAttribute('data-src') || 
                        img.getAttribute('data-lazy-src') ||
                        img.getAttribute('src');
        if (imageUrl && !imageUrl.includes('placeholder')) {
          pages.push({
            index: index,
            url: imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`,
            filename: `page-${index}.jpg`
          });
        }
      });

      // If no images found, try to find in script tags (common pattern)
      if (pages.length === 0) {
        const scripts = doc.querySelectorAll('script');
        for (const script of scripts) {
          const content = script.textContent;
          
          // Look for image arrays in JavaScript
          const patterns = [
            /(?:images|pages|chapter_images|chapterImages)\s*[=:]\s*(\[[^\]]+\])/,
            /(?:images|pages)\s*[=:]\s*"([^"]+)"/
          ];

          for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
              try {
                const imageArray = JSON.parse(match[1]);
                imageArray.forEach((url, index) => {
                  if (url && typeof url === 'string') {
                    pages.push({
                      index: index,
                      url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
                      filename: `page-${index}.jpg`
                    });
                  }
                });
                if (pages.length > 0) break;
              } catch (e) {
                console.warn(`[${this.name}] Failed to parse image array from script:`, e);
              }
            }
          }
          if (pages.length > 0) break;
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
    
    // Try multiple selectors for manga cards
    const cardElements = doc.querySelectorAll(
      '.manga-card, .manga-item, .series-card, .book-item, .item, .grid-item'
    );

    cardElements.forEach(card => {
      const link = card.querySelector('a[href*="manga"], a[href*="series"], a.title');
      if (!link) return;

      const href = link.getAttribute('href');
      const idMatch = href.match(/(?:manga|series)[/-]([^/]+)/);
      const id = idMatch ? idMatch[1] : '';

      if (!id) return;

      const title = card.querySelector('.title, .manga-title, h3, h4, .name')?.textContent?.trim() || 
                   link.getAttribute('title') || 'Unknown';
      const cover = card.querySelector('img')?.src || 
                   card.querySelector('img')?.getAttribute('data-src') || '';
      const description = card.querySelector('.description, .summary')?.textContent?.trim() || '';
      const latestChapter = card.querySelector('.latest-chapter, .chapter, .last-chapter')?.textContent?.trim() || '';
      
      // Extract genres
      const genreElements = card.querySelectorAll('.genre-tag, .genre, .tag');
      const genres = Array.from(genreElements).map(el => el.textContent.trim()).slice(0, 3);

      // Extract rating
      const ratingText = card.querySelector('.rating, .score')?.textContent?.trim() || '0';
      const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '0');

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
}
