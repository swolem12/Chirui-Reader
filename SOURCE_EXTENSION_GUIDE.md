# Chirui Reader - Source Extension System

This document explains the dual-approach source extension system for adding manga/manhwa sources to Chirui Reader.

## Overview

Chirui Reader implements **two complementary approaches** for adding manga sources:

1. **Option 1: Manual Source Implementation** - Hand-crafted sources using the base framework
2. **Option 2: Automated Source Generator** - Tool that analyzes websites and generates source templates

---

## Option 1: Manual Source Framework

### Architecture

The source framework follows a plugin/extension pattern similar to Kotatsu-parsers:

```
src/sources/
├── manga-source.js          # Base class/interface
├── mangadex-source.js       # Example: MangaDex implementation
├── source-manager.js        # Manages all sources
└── [your-source].js         # Your custom source
```

### Base Class: `MangaSource`

All sources extend the `MangaSource` base class and must implement:

#### Required Methods

```javascript
async searchManga(query, page)      // Search manga by query
async getPopularManga(page)         // Get popular/trending manga
async getMangaDetails(mangaId)      // Get detailed manga info
async getChapterList(mangaId)       // Get all chapters
async getPageList(chapterId)        // Get page images for chapter
```

#### Optional Methods

```javascript
async getLatestUpdates(page)        // Get recently updated manga
async getImageUrl(page)             // Transform page URL if needed
```

### Creating a New Source

#### Step 1: Create Source File

```javascript
// src/sources/mysite-source.js
import { MangaSource } from './manga-source.js';

export class MySiteSource extends MangaSource {
  constructor() {
    super();
    this.id = 'mysite';
    this.name = 'My Manga Site';
    this.baseUrl = 'https://example.com';
    this.supportsLatest = true;
  }

  async searchManga(query, page = 1) {
    // Implement search logic
  }

  // ... implement other required methods
}
```

#### Step 2: Register Source

```javascript
// src/sources/source-manager.js
import { MySiteSource } from './mysite-source.js';

initializeSources() {
  // ... existing sources
  const mysite = new MySiteSource();
  this.registerSource(mysite);
  this.enableSource('mysite');
}
```

#### Step 3: Test

Test each method individually to ensure proper data extraction.

### Best Practices

1. **Error Handling**: Wrap all network calls in try-catch
2. **Rate Limiting**: Respect site's rate limits
3. **Caching**: Use localStorage or IndexedDB for metadata
4. **User-Agent**: Use appropriate user agent strings
5. **CORS**: Be aware of CORS limitations (may need proxy)

### Example: MangaDex Source

See `src/sources/mangadex-source.js` for a complete, working example using the MangaDex API v5.

---

## Option 2: Automated Source Generator

### Purpose

The Source Generator Tool automatically analyzes manga websites and generates source template code, reducing the time needed to create new sources from scratch.

### How It Works

1. **Website Analysis**: Fetches and analyzes the HTML structure
2. **Pattern Detection**: Identifies common patterns (manga cards, search, pagination)
3. **Selector Extraction**: Finds CSS selectors for data extraction
4. **Template Generation**: Creates ready-to-use source file
5. **Manual Refinement**: Developer tests and refines the generated code

### Usage

#### 1. Analyze a Website

```javascript
import { SourceGenerator } from './tools/source-generator.js';

const generator = new SourceGenerator();
const analysis = await generator.analyzeWebsite('https://manga-site.com');

console.log('Analysis Results:', analysis);
```

#### 2. Review Analysis

```javascript
{
  url: "https://manga-site.com",
  baseUrl: "https://manga-site.com",
  patterns: {
    mangaList: {
      itemSelector: ".manga-card",
      titleSelector: ".title",
      coverSelector: "img.cover",
      confidence: 0.8
    },
    search: {
      found: true,
      searchUrl: "/search",
      searchParam: "q"
    },
    pagination: {
      found: true,
      type: "query",
      param: "page"
    }
  },
  recommendations: [...],
  warnings: [...]
}
```

#### 3. Generate Template

```javascript
const template = generator.generateSourceTemplate(analysis, 'MySite');

// Save to file
// Implement TODO sections
// Test and refine
```

### Generated Template Structure

The generator creates a complete source file with:

- ✅ Base class extension
- ✅ Constructor with metadata
- ✅ Search method (if detectable)
- ✅ Popular manga method
- ✅ Skeleton methods for details, chapters, pages
- ✅ Helper methods for parsing
- ✅ Implementation checklist
- ⚠️ TODO comments for manual implementation

### Limitations

**What the generator CAN do:**
- Detect basic page structure
- Identify common CSS selectors
- Generate method skeletons
- Provide implementation hints

**What the generator CANNOT do:**
- Handle JavaScript-heavy sites (SPA frameworks)
- Bypass anti-scraping measures
- Generate perfect code without manual refinement
- Test the generated source
- Handle all edge cases

### CORS Considerations

Many manga sites block cross-origin requests. Solutions:

1. **Use sites with APIs** (like MangaDex)
2. **CORS proxy** for development
3. **Browser extension** for full access
4. **Server-side scraping** (requires backend)

---

## Combining Both Approaches

### Recommended Workflow

1. **Start with Generator** (Option 2)
   - Run analyzer on target site
   - Review detected patterns
   - Generate template code

2. **Manual Implementation** (Option 1)
   - Save template to `src/sources/`
   - Implement TODO sections
   - Test each method
   - Add error handling
   - Refine selectors

3. **Register & Deploy**
   - Register in source manager
   - Test thoroughly
   - Deploy to production

### When to Use Each

**Use Manual Approach (Option 1) when:**
- Site has an official API
- You know the site structure well
- Site uses complex JavaScript
- You need full control

**Use Generator Tool (Option 2) when:**
- Quickly prototyping new sources
- Site has simple HTML structure
- You're new to the site
- You want a starting point

---

## Adding Sources: Quick Reference

### For API-Based Sites (Easy)

```javascript
// 1. Create source file
export class APISource extends MangaSource {
  async searchManga(query, page) {
    const response = await this.fetch(`${this.apiUrl}/search?q=${query}&page=${page}`);
    return await response.json();
  }
}

// 2. Register in source-manager.js
// 3. Done!
```

### For Scraping-Based Sites (Medium)

```javascript
// 1. Run generator
const analysis = await generator.analyzeWebsite('https://site.com');
const template = generator.generateSourceTemplate(analysis, 'SiteName');

// 2. Save template and implement TODOs
// 3. Test thoroughly
// 4. Register in source-manager.js
```

### For Complex Sites (Hard)

```javascript
// 1. Manual implementation required
// 2. Study site structure carefully
// 3. Implement custom logic
// 4. Handle all edge cases
// 5. Add comprehensive error handling
// 6. Test extensively
```

---

## Source Manager API

### Get All Sources

```javascript
const manager = new SourceManager();
const allSources = manager.getAllSources();
```

### Search Across Sources

```javascript
const results = await manager.searchManga('One Piece', 1);
// Returns results grouped by source
```

### Get Popular from Specific Source

```javascript
const popular = await manager.getPopularManga(1, 'mangadex');
```

### Enable/Disable Sources

```javascript
manager.enableSource('mangadex');
manager.disableSource('mangadex');
```

---

## Testing Your Source

### Manual Testing Checklist

- [ ] Search returns valid results
- [ ] Popular manga loads correctly
- [ ] Manga details page shows all fields
- [ ] Chapter list loads completely
- [ ] Page images load and display
- [ ] Pagination works
- [ ] Error handling is robust
- [ ] No console errors
- [ ] Images are accessible
- [ ] Performance is acceptable

### Testing Code

```javascript
// Test search
const results = await source.searchManga('test', 1);
console.log('Search results:', results);

// Test details
const details = await source.getMangaDetails(results[0].id);
console.log('Details:', details);

// Test chapters
const chapters = await source.getChapterList(results[0].id);
console.log('Chapters:', chapters);

// Test pages
const pages = await source.getPageList(chapters[0].id);
console.log('Pages:', pages);
```

---

## Troubleshooting

### Common Issues

**CORS Errors:**
- Use CORS proxy for development
- Consider browser extension
- Use official APIs when available

**Rate Limiting:**
- Add delays between requests
- Implement exponential backoff
- Cache aggressively

**Selector Changes:**
- Sites may update their HTML
- Monitor for changes
- Have fallback selectors

**Missing Data:**
- Add null checks everywhere
- Provide default values
- Log warnings for debugging

---

## Future Enhancements

- **Auto-updater**: Automatically detect when sources break
- **Source repository**: Community-contributed sources
- **Visual editor**: GUI for creating sources
- **Testing framework**: Automated testing for sources
- **Performance monitoring**: Track source reliability

---

## Contributing

To contribute a new source:

1. Create source file in `src/sources/`
2. Extend `MangaSource` base class
3. Implement all required methods
4. Test thoroughly
5. Submit pull request with:
   - Source code
   - Documentation
   - Test results
   - Example manga IDs

---

## License

Same as main project.
