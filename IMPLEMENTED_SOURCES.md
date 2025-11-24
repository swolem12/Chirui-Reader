# Chirui Reader - Implemented Sources

This document lists all manga/manhwa sources currently implemented in Chirui Reader.

## Available Sources

### 1. MangaDex
- **ID**: `mangadex`
- **Name**: MangaDex
- **Type**: API-based
- **URL**: https://mangadex.org
- **Status**: ✅ Fully Functional
- **Features**:
  - ✅ Search manga
  - ✅ Popular manga
  - ✅ Latest updates
  - ✅ Manga details with full metadata
  - ✅ Chapter listings
  - ✅ Page images (high quality)
  - ✅ Multiple languages support (English primary)
  - ✅ Author/Artist information
  - ✅ Genre tags
  - ✅ Cover images
- **Implementation**: Uses official MangaDex API v5
- **Notes**: 
  - Rate limiting handled automatically (retry after 5s on 429)
  - High-quality images via at-home server network
  - Content rating filters (safe + suggestive only)

### 2. Manhwaz
- **ID**: `manhwaz`
- **Name**: Manhwaz
- **Type**: Web scraper
- **URL**: https://manhwaz.com
- **Status**: ✅ Implemented (Scraper-based)
- **Features**:
  - ✅ Search manga/manhwa
  - ✅ Popular manga
  - ✅ Latest updates
  - ✅ Manga details
  - ✅ Chapter listings
  - ✅ Page images
  - ⚠️ Requires site access (may be blocked by CORS/Cloudflare)
- **Implementation**: HTML scraping with common selector patterns
- **Notes**:
  - Uses multiple fallback selectors for robustness
  - Designed to work with typical manhwa site structures
  - May need adjustments based on site changes
  - CORS proxy may be required for browser-based usage

## How to Enable/Disable Sources

Sources can be managed through the `SourceManager`:

```javascript
// Get the source manager instance
const sourceManager = await import('./src/sources/source-manager.js')
  .then(m => new m.SourceManager());

// Enable a source
sourceManager.enableSource('manhwaz');

// Disable a source
sourceManager.disableSource('manhwaz');

// Check if source is enabled
const isEnabled = sourceManager.isSourceEnabled('mangadex');

// Get all available sources
const allSources = sourceManager.getAllSources();

// Get only enabled sources
const enabledSources = sourceManager.getEnabledSources();
```

## Source Comparison

| Feature | MangaDex | Manhwaz |
|---------|----------|---------|
| **Type** | API | Scraper |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Speed** | Fast | Medium |
| **Content** | Manga | Manhwa/Webtoon |
| **Image Quality** | High | Medium-High |
| **Rate Limiting** | Auto-handled | None |
| **CORS Issues** | None | Possible |
| **Maintenance** | Low | Medium |

## Usage Examples

### Search Across All Sources

```javascript
// Search all enabled sources
const results = await sourceManager.searchManga('solo leveling', 1);

// Results structure:
// {
//   query: 'solo leveling',
//   page: 1,
//   sources: [
//     {
//       sourceId: 'mangadex',
//       sourceName: 'MangaDex',
//       manga: [...],
//       error: null
//     },
//     {
//       sourceId: 'manhwaz',
//       sourceName: 'Manhwaz',
//       manga: [...],
//       error: null
//     }
//   ]
// }
```

### Get From Specific Source

```javascript
// Get popular manga from MangaDex only
const results = await sourceManager.getPopularManga(1, 'mangadex');

// Search in Manhwaz only
const results = await sourceManager.searchManga('tower of god', 1, 'manhwaz');
```

### Load Chapter Pages

```javascript
// Get specific source
const mangadex = sourceManager.getSource('mangadex');

// Get chapter pages
const pages = await mangadex.getPageList('chapter-id-here');

// Pages structure:
// [
//   { index: 0, url: 'https://...', filename: 'page-0.jpg' },
//   { index: 1, url: 'https://...', filename: 'page-1.jpg' },
//   ...
// ]
```

## Adding More Sources

To add a new source to Chirui Reader:

### Method 1: Manual Implementation

1. Create a new file in `src/sources/` (e.g., `my-source.js`)
2. Extend the `MangaSource` base class
3. Implement required methods
4. Register in `source-manager.js`

See [SOURCE_EXTENSION_GUIDE.md](SOURCE_EXTENSION_GUIDE.md) for detailed instructions.

### Method 2: Use Generator Tool

1. Use the source generator tool:
   ```javascript
   import { SourceGenerator } from './src/tools/source-generator.js';
   const generator = new SourceGenerator();
   const template = await generator.generateFromUrl('https://example-manga-site.com');
   ```
2. Refine the generated template
3. Register in `source-manager.js`

See [src/tools/README.md](src/tools/README.md) for tool documentation.

## Troubleshooting

### MangaDex Issues

**Problem**: Rate limited
- **Solution**: Wait 5 seconds, automatic retry is implemented

**Problem**: No results
- **Solution**: Check if manga title is in English, try alternative titles

### Manhwaz Issues

**Problem**: CORS errors
- **Solution**: 
  - Use a CORS proxy
  - Deploy with proper backend
  - Or disable browser CORS (development only)

**Problem**: Selectors not working
- **Solution**: 
  - Site may have changed structure
  - Update selectors in `manhwaz-source.js`
  - Check browser console for errors

**Problem**: Images not loading
- **Solution**:
  - Check Referer header is set correctly
  - Verify image URLs in network tab
  - May need CORS proxy for images

## Performance Tips

1. **Enable only needed sources** - Fewer sources = faster searches
2. **Use specific source ID** when possible - Avoid searching all sources
3. **Cache results** - MangaService already implements caching
4. **Lazy load source framework** - Only load when needed (already implemented)

## Future Sources

Potential sources to add:

- [ ] Asura Scans
- [ ] Flame Comics  
- [ ] Reaper Scans
- [ ] MangaSee123
- [ ] MangaLife
- [ ] ComicK
- [ ] MangaPark
- [ ] MangaKakalot
- [ ] MangaBuddy

Each can be added using the manual method or generator tool!

## Source Quality Guidelines

When implementing new sources, follow these guidelines:

### Required
- ✅ Implement all required methods
- ✅ Handle errors gracefully
- ✅ Return standardized manga objects
- ✅ Set proper User-Agent and Referer headers
- ✅ Test with real data

### Recommended
- ✅ Implement caching if API calls are expensive
- ✅ Handle rate limiting
- ✅ Support pagination
- ✅ Extract as much metadata as possible (author, genres, rating)
- ✅ Provide high-quality cover images
- ✅ Document any special requirements or limitations

### Best Practices
- ✅ Use try-catch for all network calls
- ✅ Log errors with source name prefix
- ✅ Validate data before returning
- ✅ Use descriptive variable names
- ✅ Add JSDoc comments
- ✅ Follow existing code style

## License & Legal

**Important**: 
- Only use sources that permit scraping or provide official APIs
- Respect robots.txt and rate limits
- Do not redistribute copyrighted content
- Sources are for personal use only
- Check each source's terms of service

MangaDex provides an official API and allows non-commercial use.
For scraped sources, verify legal compliance in your jurisdiction.

---

**Last Updated**: 2025-11-24  
**Total Sources**: 2 (MangaDex, Manhwaz)  
**Planned**: 10+ additional sources
