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
  - Primary manga source, highly reliable

### 2. MangaBuddy
- **ID**: `mangabuddy`
- **Name**: MangaBuddy
- **Type**: Web scraper
- **URL**: https://mangabuddy.com
- **Status**: ✅ Fully Functional
- **Features**:
  - ✅ Search manga/manhwa
  - ✅ Popular manga
  - ✅ Latest updates
  - ✅ Manga details
  - ✅ Chapter listings
  - ✅ Page images
  - ✅ High-quality images
  - ⚠️ Requires CORS proxy
- **Implementation**: HTML scraping with robust selector patterns
- **Notes**:
  - Added as reliable alternative to Manhwaz
  - Known for fast updates and quality
  - Uses multiple fallback selectors for robustness
  - CORS proxy enabled by default
  - Designed to work with typical manga/manhwa site structures

### 3. ComicK
- **ID**: `comick`
- **Name**: ComicK
- **Type**: API-based
- **URL**: https://comick.io / https://api.comick.fun
- **Status**: ✅ Newly Added (Modern API)
- **Features**:
  - ✅ Search manga/comics
  - ✅ Popular manga (by views)
  - ✅ Latest updates (by upload date)
  - ✅ Manga details with metadata
  - ✅ Chapter listings
  - ✅ High-quality page images
  - ✅ Multiple scanlation groups
  - ✅ Author/Artist information
  - ✅ Rating system
- **Implementation**: Uses ComicK API v1.0
- **Notes**:
  - Modern, fast API with no authentication required
  - No CORS proxy needed (API-based)
  - Supports both manga and comics
  - Clean CDN for images (meo.comick.pictures)
  - Good metadata quality

### 4. Manhwaz
- **ID**: `manhwaz`
- **Name**: Manhwaz
- **Type**: Web scraper
- **URL**: https://manhwaz.com
- **Status**: ⚠️ Disabled by Default (Known Issues)
- **Issues**:
  - ⚠️ CORS proxy failures
  - ⚠️ Possible Cloudflare blocking
  - ⚠️ Site may be blocking automated access
  - ⚠️ Not enabled by default
- **Features**:
  - ⏸️ Search manga/manhwa (when working)
  - ⏸️ Popular manga
  - ⏸️ Latest updates
  - ⏸️ Manga details
  - ⏸️ Chapter listings
  - ⏸️ Page images
- **Implementation**: HTML scraping with common selector patterns
- **Notes**:
  - Disabled by default due to reliability issues
  - Users can manually enable if site becomes accessible
  - May be fixed in future updates
  - Consider using MangaBuddy or ComicK instead

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

| Feature | MangaDex | MangaBuddy | ComicK | Manhwaz |
|---------|----------|------------|--------|---------|
| **Type** | API | Scraper | API | Scraper |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Speed** | Fast | Fast | Very Fast | Medium |
| **Content** | Manga | Manga/Manhwa | Manga/Comics | Manhwa/Webtoon |
| **Image Quality** | High | High | High | Medium-High |
| **Rate Limiting** | Auto-handled | None | None | None |
| **CORS Issues** | None | Possible | None | Yes |
| **Maintenance** | Low | Medium | Low | High |
| **Default Status** | ✅ Enabled | ✅ Enabled | ✅ Enabled | ⚠️ Disabled |

## Usage Examples

### Search Across All Sources

```javascript
// Search all enabled sources (MangaDex + MangaBuddy by default)
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
//       sourceId: 'mangabuddy',
//       sourceName: 'MangaBuddy',
//       manga: [...],
//       error: null
//     }
//     // Manhwaz not included (disabled by default)
//   ]
// }
```

### Get From Specific Source

```javascript
// Get popular manga from MangaDex only
const results = await sourceManager.getPopularManga(1, 'mangadex');

// Search in MangaBuddy only
const results = await sourceManager.searchManga('tower of god', 1, 'mangabuddy');

// Enable and use Manhwaz (if needed)
sourceManager.enableSource('manhwaz');
const results = await sourceManager.searchManga('solo leveling', 1, 'manhwaz');
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

### MangaBuddy Issues

**Problem**: CORS errors
- **Solution**: 
  - CORS proxy is enabled by default
  - If still failing, try different proxy in settings
  - Check browser console for specific errors

**Problem**: Selectors not working
- **Solution**: 
  - Site may have changed structure
  - Update selectors in `mangabuddy-source.js`
  - Check browser console for errors

**Problem**: Images not loading
- **Solution**:
  - Verify CORS proxy is working
  - Check Referer header is set correctly
  - Verify image URLs in network tab

### Manhwaz Issues (DEPRECATED - Use MangaBuddy Instead)

**Problem**: Source not appearing in searches
- **Solution**: 
  - Manhwaz is disabled by default
  - Enable manually if needed: `sourceManager.enableSource('manhwaz')`
  - Note: May still fail due to blocking

**Problem**: CORS errors
- **Solution**: 
  - Try using MangaBuddy instead (more reliable)
  - Or enable manually and test with different proxies
  - Deploy with proper backend
  - Or disable browser CORS (development only)

**Problem**: Selectors not working
- **Solution**: 
  - Site may have changed structure or be blocking access
  - Consider using MangaBuddy as replacement
  - Update selectors in `manhwaz-source.js` if needed

**Problem**: Images not loading
- **Solution**:
  - Use MangaBuddy instead for manhwa content
  - Check Referer header is set correctly
  - May need CORS proxy for images

## Performance Tips

1. **Enable only needed sources** - Fewer sources = faster searches
2. **Use specific source ID** when possible - Avoid searching all sources
3. **Cache results** - MangaService already implements caching
4. **Lazy load source framework** - Only load when needed (already implemented)
5. **MangaBuddy + MangaDex combo** - Best reliability for manga and manhwa content

## Future Sources

Potential sources to add (Priority Order):

### High Priority (Next 2-4 weeks)
- [ ] ComicK (modern, fast API)
- [ ] MangaSee123 (manga-focused, reliable)
- [ ] MangaLife (alternative to MangaSee)
- [ ] ManhwaTop (manhwa-focused alternative)

### Medium Priority (Next 1-2 months)
- [ ] Asura Scans (popular scanlation group)
- [ ] Flame Comics (manhwa)
- [ ] Reaper Scans (high-quality scans)
- [ ] Webtoons (official platform)
- [ ] MangaPark (community favorite)
- [ ] MangaKakalot (large catalog)

### Lower Priority (Future)
- [ ] Batoto (requires account)
- [ ] Toonily (manhwa/webtoon)
- [ ] MangaFire
- [ ] MangaNato
- [ ] ReadMangaBat

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
MangaBuddy and other scraped sources - verify legal compliance in your jurisdiction.

---

**Last Updated**: 2025-11-24  
**Total Sources**: 4 (MangaDex ✅, MangaBuddy ✅, ComicK ✅, Manhwaz ⚠️)  
**Working Sources**: 3 (MangaDex, MangaBuddy, ComicK)  
**Planned**: 10-15 additional sources for Phase 1, 100+ for Android  

**Status Summary**:
- ✅ MangaDex: Primary API source, fully functional
- ✅ MangaBuddy: Reliable scraper for manga/manhwa
- ✅ ComicK: Modern API source, fast and clean
- ⚠️ Manhwaz: Disabled by default due to reliability issues

**Recommendation**: Use MangaDex + MangaBuddy + ComicK for best coverage and reliability.
