// Chirui Reader - Source Generator Tool
// Analyzes websites and generates source extension templates

export class SourceGenerator {
  constructor() {
    this.commonPatterns = {
      // Common CSS selectors for manga sites
      mangaCard: [
        '.manga-card',
        '.manga-item',
        '.book-item',
        '.series-item',
        'article.manga',
        '.grid-item'
      ],
      mangaTitle: [
        '.title',
        '.manga-title',
        'h3',
        'h2.title',
        '.book-title',
        '.series-name'
      ],
      mangaCover: [
        'img.cover',
        '.cover img',
        '.thumbnail img',
        'img.lazy',
        '.manga-cover img'
      ],
      chapterLink: [
        '.chapter-link',
        'a.chapter',
        '.chapter-item a',
        'li.chapter a'
      ],
      pageImage: [
        '#image',
        '.page-image',
        '#manga-page',
        'img.page',
        '.reader-image'
      ]
    };
  }

  /**
   * Analyze a manga website
   * @param {string} url - Website URL
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeWebsite(url) {
    console.log(`Analyzing website: ${url}`);
    
    const analysis = {
      url: url,
      baseUrl: new URL(url).origin,
      timestamp: new Date().toISOString(),
      patterns: {},
      recommendations: [],
      warnings: []
    };

    try {
      // Fetch the homepage
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      // Detect patterns
      analysis.patterns = {
        mangaList: this.detectMangaListPattern(doc),
        search: this.detectSearchPattern(doc),
        pagination: this.detectPaginationPattern(doc),
        navigation: this.detectNavigationPattern(doc)
      };

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      // Check for potential issues
      analysis.warnings = this.detectWarnings(doc);

    } catch (error) {
      analysis.error = error.message;
      analysis.warnings.push({
        type: 'FETCH_ERROR',
        message: 'Could not fetch website. May require CORS proxy or different approach.',
        severity: 'HIGH'
      });
    }

    return analysis;
  }

  /**
   * Detect manga list pattern on page
   */
  detectMangaListPattern(doc) {
    const patterns = {
      container: null,
      itemSelector: null,
      titleSelector: null,
      coverSelector: null,
      linkSelector: null,
      confidence: 0
    };

    // Try to find manga cards
    for (const selector of this.commonPatterns.mangaCard) {
      const items = doc.querySelectorAll(selector);
      if (items.length >= 3) {
        patterns.itemSelector = selector;
        patterns.container = items[0].parentElement;
        
        // Try to find title within card
        for (const titleSel of this.commonPatterns.mangaTitle) {
          if (items[0].querySelector(titleSel)) {
            patterns.titleSelector = titleSel;
            break;
          }
        }

        // Try to find cover within card
        for (const coverSel of this.commonPatterns.mangaCover) {
          if (items[0].querySelector(coverSel)) {
            patterns.coverSelector = coverSel;
            break;
          }
        }

        patterns.confidence = (patterns.titleSelector && patterns.coverSelector) ? 0.8 : 0.5;
        break;
      }
    }

    return patterns;
  }

  /**
   * Detect search pattern
   */
  detectSearchPattern(doc) {
    const patterns = {
      found: false,
      searchUrl: null,
      searchParam: null
    };

    // Look for search forms
    const searchForm = doc.querySelector('form[action*="search"]') || 
                       doc.querySelector('form input[name*="search"]')?.closest('form');
    
    if (searchForm) {
      patterns.found = true;
      patterns.searchUrl = searchForm.getAttribute('action');
      const searchInput = searchForm.querySelector('input[type="search"], input[name*="search"], input[name="q"]');
      patterns.searchParam = searchInput?.getAttribute('name') || 'q';
    }

    return patterns;
  }

  /**
   * Detect pagination pattern
   */
  detectPaginationPattern(doc) {
    const patterns = {
      found: false,
      type: null, // 'query', 'path', 'ajax'
      param: null
    };

    // Look for pagination links
    const paginationLinks = doc.querySelectorAll('a[href*="page"]');
    if (paginationLinks.length > 0) {
      patterns.found = true;
      const firstLink = paginationLinks[0].getAttribute('href');
      
      if (firstLink.includes('?')) {
        patterns.type = 'query';
        // Try to extract param name
        const match = firstLink.match(/[?&](page|p)=(\d+)/);
        patterns.param = match ? match[1] : 'page';
      } else {
        patterns.type = 'path';
      }
    }

    return patterns;
  }

  /**
   * Detect navigation structure
   */
  detectNavigationPattern(doc) {
    return {
      hasHeader: !!doc.querySelector('header'),
      hasNav: !!doc.querySelector('nav'),
      hasFooter: !!doc.querySelector('footer'),
      mainNav: this.extractNavLinks(doc)
    };
  }

  /**
   * Extract navigation links
   */
  extractNavLinks(doc) {
    const nav = doc.querySelector('nav') || doc.querySelector('header nav');
    if (!nav) return [];

    const links = Array.from(nav.querySelectorAll('a')).map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href')
    }));

    return links.filter(link => link.text && link.href);
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.patterns.mangaList.confidence < 0.5) {
      recommendations.push({
        type: 'LOW_CONFIDENCE',
        message: 'Could not reliably detect manga list pattern. Manual selector definition required.',
        priority: 'HIGH'
      });
    }

    if (!analysis.patterns.search.found) {
      recommendations.push({
        type: 'NO_SEARCH',
        message: 'Search form not detected. Implement custom search or use browse-only approach.',
        priority: 'MEDIUM'
      });
    }

    if (!analysis.patterns.pagination.found) {
      recommendations.push({
        type: 'NO_PAGINATION',
        message: 'Pagination not detected. Site may use infinite scroll or single-page listing.',
        priority: 'MEDIUM'
      });
    }

    return recommendations;
  }

  /**
   * Detect potential warnings/issues
   */
  detectWarnings(doc) {
    const warnings = [];

    // Check for anti-scraping measures
    if (doc.querySelector('script[src*="cloudflare"]')) {
      warnings.push({
        type: 'CLOUDFLARE',
        message: 'Cloudflare detected. May require additional handling.',
        severity: 'HIGH'
      });
    }

    // Check for heavy JavaScript usage
    const scriptTags = doc.querySelectorAll('script');
    if (scriptTags.length > 20) {
      warnings.push({
        type: 'HEAVY_JS',
        message: 'Site uses many scripts. May require browser rendering.',
        severity: 'MEDIUM'
      });
    }

    return warnings;
  }

  /**
   * Generate source template from analysis
   * @param {Object} analysis - Analysis results
   * @param {string} sourceName - Name for the source
   * @returns {string} Generated JavaScript source code
   */
  generateSourceTemplate(analysis, sourceName = 'CustomSource') {
    const sourceId = sourceName.toLowerCase().replace(/\s+/g, '-');
    const className = sourceName.replace(/\s+/g, '') + 'Source';

    return `// Chirui Reader - ${sourceName} Source
// Auto-generated template - REQUIRES MANUAL IMPLEMENTATION

import { MangaSource } from './manga-source.js';

export class ${className} extends MangaSource {
  constructor() {
    super();
    this.id = '${sourceId}';
    this.name = '${sourceName}';
    this.lang = 'en';
    this.baseUrl = '${analysis.baseUrl}';
    this.supportsLatest = false; // Set to true if latest updates are supported
    this.isNsfw = false;
    this.useCorsProxy = true; // Enable CORS proxy for scraper sources
  }

  /**
   * Search manga by query
   * TODO: Implement based on site's search functionality
   */
  async searchManga(query, page = 1) {
    ${this.generateSearchMethod(analysis)}
  }

  /**
   * Get popular manga
   * TODO: Implement based on site's popular/trending page
   */
  async getPopularManga(page = 1) {
    ${this.generatePopularMethod(analysis)}
  }

  /**
   * Get manga details
   * TODO: Implement manga detail parsing
   */
  async getMangaDetails(mangaId) {
    const url = \`\${this.baseUrl}/manga/\${mangaId}\`; // Adjust URL pattern
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    // TODO: Extract manga details from page
    return {
      id: mangaId,
      title: '', // TODO: Extract title
      author: '', // TODO: Extract author
      artist: '', // TODO: Extract artist
      description: '', // TODO: Extract description
      genres: [], // TODO: Extract genres
      status: 'Unknown',
      cover: '', // TODO: Extract cover URL
      rating: 0,
      chapters: 0,
      lastUpdated: new Date().toISOString(),
      source: this.name,
      sourceId: this.id,
      url: url
    };
  }

  /**
   * Get chapter list for a manga
   * TODO: Implement chapter list parsing
   */
  async getChapterList(mangaId) {
    const url = \`\${this.baseUrl}/manga/\${mangaId}\`; // Adjust URL pattern
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    // TODO: Parse chapter list
    const chapters = [];
    // Example:
    // doc.querySelectorAll('.chapter-link').forEach((el, index) => {
    //   chapters.push({
    //     id: el.getAttribute('data-id') || index.toString(),
    //     mangaId: mangaId,
    //     number: parseFloat(el.textContent.match(/\\d+(\\.\\d+)?/)?.[0]) || index + 1,
    //     title: el.textContent.trim(),
    //     url: el.getAttribute('href')
    //   });
    // });

    return chapters;
  }

  /**
   * Get page list for a chapter
   * TODO: Implement page image extraction
   */
  async getPageList(chapterId) {
    const url = \`\${this.baseUrl}/chapter/\${chapterId}\`; // Adjust URL pattern
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    // TODO: Extract page image URLs
    const pages = [];
    // Example:
    // doc.querySelectorAll('.page-image').forEach((img, index) => {
    //   pages.push({
    //     index: index,
    //     url: img.getAttribute('src') || img.getAttribute('data-src'),
    //     filename: \`page-\${index + 1}.jpg\`
    //   });
    // });

    return pages;
  }

  /**
   * Parse manga list from HTML
   * Helper method for search and popular
   */
  parseMangaList(doc) {
    const mangaList = [];
    ${this.generateMangaListParser(analysis)}
    return mangaList;
  }
}

// IMPLEMENTATION CHECKLIST:
// [ ] Test searchManga() with actual queries
// [ ] Test getPopularManga() with actual page
// [ ] Implement getMangaDetails() selector parsing
// [ ] Implement getChapterList() selector parsing
// [ ] Implement getPageList() selector parsing
// [ ] Handle pagination correctly
// [ ] Add error handling for missing elements
// [ ] Test with various manga on the site
// [ ] Verify image URLs are accessible
// [ ] Register source in source-manager.js
`;
  }

  /**
   * Generate search method implementation
   */
  generateSearchMethod(analysis) {
    if (!analysis.patterns.search.found) {
      return `// TODO: No search form detected. Implement custom search or use browse-only
    throw new Error('Search not implemented');`;
    }

    return `const searchUrl = \`\${this.baseUrl}${analysis.patterns.search.searchUrl}\`;
    const params = new URLSearchParams({
      ${analysis.patterns.search.searchParam}: query,
      page: page
    });

    const response = await this.fetch(\`\${searchUrl}?\${params}\`);
    const html = await response.text();
    const doc = this.parseHtml(html);

    return this.parseMangaList(doc);`;
  }

  /**
   * Generate popular method implementation
   */
  generatePopularMethod(analysis) {
    return `// TODO: Adjust URL to site's popular/trending page
    const url = \`\${this.baseUrl}/popular?page=\${page}\`; 
    const response = await this.fetch(url);
    const html = await response.text();
    const doc = this.parseHtml(html);

    return this.parseMangaList(doc);`;
  }

  /**
   * Generate manga list parser
   */
  generateMangaListParser(analysis) {
    if (!analysis.patterns.mangaList.itemSelector) {
      return `// TODO: Define selectors for manga cards
    // const items = doc.querySelectorAll('.manga-item');
    // items.forEach(item => {
    //   mangaList.push({
    //     id: item.querySelector('a').getAttribute('href').split('/').pop(),
    //     title: item.querySelector('.title').textContent.trim(),
    //     cover: item.querySelector('img').getAttribute('src'),
    //     // ... other fields
    //   });
    // });`;
    }

    return `const items = doc.querySelectorAll('${analysis.patterns.mangaList.itemSelector}');
    items.forEach(item => {
      const titleEl = item.querySelector('${analysis.patterns.mangaList.titleSelector || '.title'}');
      const coverEl = item.querySelector('${analysis.patterns.mangaList.coverSelector || 'img'}');
      const linkEl = item.querySelector('a') || item;

      if (titleEl && linkEl) {
        mangaList.push({
          id: linkEl.getAttribute('href').split('/').pop(), // TODO: Adjust ID extraction
          title: titleEl.textContent.trim(),
          cover: coverEl?.getAttribute('src') || '',
          // TODO: Add other fields (author, status, description, etc.)
        });
      }
    });`;
  }
}
