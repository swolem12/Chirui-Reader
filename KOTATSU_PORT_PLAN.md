# Kotatsu to Chirui Reader Web Port - Implementation Plan

## Overview

This document outlines the plan to port Kotatsu's Android app functionality to a JavaScript web application for Chirui Reader.

## Porting Strategy

### Phase 1: Core Architecture (Current)
- ✅ Material Design UI framework
- ✅ Theme system (dark/light mode)
- ✅ PWA support
- ✅ Basic navigation structure

### Phase 2: Data Layer & Parsers
Port Kotatsu's manga source parsers from Kotlin to JavaScript:
- **kotatsu-parsers** integration
- Rewrite parser logic for web (no Kotlin/JVM dependencies)
- Implement HTTP client for manga sources
- Add caching strategy (IndexedDB + Service Worker)

### Phase 3: Library & Catalog
- Manga grid view
- Search functionality
- Filtering (genre, status, rating)
- Sorting options
- Pagination
- Favorites management

### Phase 4: Reader Interface
- Page-by-page reader
- Webtoon/vertical scroll mode
- Double-page mode
- Zoom & pan controls
- Keyboard navigation
- Progress tracking
- Chapter navigation

### Phase 5: Advanced Features
- Reading history
- Bookmarks
- Offline reading (PWA)
- Sync support (optional backend)
- Settings/preferences

## Technical Considerations

### From Kotlin/Android to JavaScript/Web

| Android/Kotlin | Web/JavaScript Equivalent |
|----------------|---------------------------|
| Room Database | IndexedDB API |
| Retrofit HTTP | Fetch API |
| Coroutines | Promises/Async-Await |
| LiveData/Flow | RxJS or custom observers |
| Jetpack Compose | React/Vue or vanilla JS |
| SharedPreferences | localStorage |
| WorkManager | Service Workers |

### Architecture Pattern

We'll use a similar architecture to Kotatsu:
- **Repository Pattern** for data access
- **MVVM-like** pattern (Model-View-ViewModel concepts)
- **Clean Architecture** principles
- **Modular structure** for maintainability

## File Structure

```
Chirui-Reader/
├── src/
│   ├── core/
│   │   ├── network/       # HTTP client, API calls
│   │   ├── database/      # IndexedDB wrapper
│   │   ├── parsers/       # Manga source parsers (ported)
│   │   └── storage/       # localStorage utils
│   ├── features/
│   │   ├── library/       # Manga library/catalog
│   │   ├── reader/        # Manga reader
│   │   ├── search/        # Search functionality
│   │   ├── favorites/     # Favorites management
│   │   └── history/       # Reading history
│   ├── ui/
│   │   ├── components/    # Reusable UI components
│   │   ├── themes/        # Theme management
│   │   └── layouts/       # Page layouts
│   └── utils/
│       ├── helpers.js
│       └── constants.js
├── assets/                # Images, fonts, icons
├── styles/
│   └── main.css
└── index.html
```

## Kotatsu Features to Port

### Must-Have (Priority 1)
1. ✅ Material Design UI
2. ✅ Theme toggle
3. [ ] Manga catalog with grid view
4. [ ] Search functionality
5. [ ] Basic manga reader
6. [ ] Chapter navigation
7. [ ] Reading modes (single/double page, webtoon)
8. [ ] Favorites
9. [ ] Reading history

### Should-Have (Priority 2)
10. [ ] Multiple manga sources
11. [ ] Advanced search/filtering
12. [ ] Bookmarks
13. [ ] Reading progress sync
14. [ ] Offline reading
15. [ ] Settings page
16. [ ] Keyboard shortcuts

### Nice-to-Have (Priority 3)
17. [ ] Tracking integration (MAL, AniList)
18. [ ] Statistics
19. [ ] Backup/restore
20. [ ] Custom themes
21. [ ] Reader customization

## Manga Source Parsers

Kotatsu supports 1000+ manga sources through `kotatsu-parsers`. For the web app:

### Approach 1: Direct Port (Recommended)
- Study kotatsu-parsers library structure
- Rewrite core parsers in JavaScript
- Focus on popular sources first:
  - MangaDex (official API)
  - MangaSee
  - MangaKakalot
  - Mangahere
  - Add more incrementally

### Approach 2: Proxy Pattern
- Keep using Kotlin parsers via backend
- Would require deploying a server
- Not suitable for pure web app goal

### Approach 3: Hybrid
- Use MangaDex official API (REST)
- Port select parsers for other sources
- Best balance of functionality vs effort

## UI/UX Decisions

We'll match Kotatsu's design patterns:
- Material Design 3 components
- Bottom navigation (on mobile)
- Floating action buttons
- Cards for manga items
- Gesture support
- Smooth animations

## Next Steps

1. **Study Kotatsu source code structure**
   - Analyze main components
   - Understand data flow
   - Document UI patterns

2. **Start with high-value features**
   - Implement manga catalog
   - Add search
   - Build basic reader

3. **Incremental development**
   - One feature at a time
   - Test thoroughly
   - Iterate based on feedback

4. **Maintain compatibility**
   - Keep web app design aligned with Android
   - Use same terminology
   - Similar user flows

## Timeline Estimate

- **Phase 2** (Parsers): 2-3 weeks
- **Phase 3** (Library): 1-2 weeks
- **Phase 4** (Reader): 2-3 weeks
- **Phase 5** (Advanced): 2-3 weeks

**Total**: 7-11 weeks for feature parity with core Kotatsu functionality

## Notes

- This is a **complete rewrite**, not code reuse
- Kotlin → JavaScript translation required for all logic
- UI assets (colors, icons, layouts) can be referenced from Kotatsu
- Testing platform goal means we can iterate faster than Android
- Web limitations: No access to system APIs, file system restrictions

## References

- Kotatsu: https://github.com/swolem12/Kotatsu
- Kotatsu Parsers: https://github.com/swolem12/kotatsu-parsers
- Material Design 3: https://m3.material.io/
- PWA Best Practices: https://web.dev/progressive-web-apps/
