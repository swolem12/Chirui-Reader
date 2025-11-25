# Chirui (チルい) Reader Project - Roadmap

## Project Overview
Recreate the Chirui (チルい) Reader manga reader application, starting with a web-based version deployable to GitHub Pages, then evolving to a native Android application with full Kotatsu feature parity.

**Vision**: Create the ultimate manga reading experience matching and exceeding Kotatsu's 1000+ sources and comprehensive feature set, starting with a web platform and evolving to Android native.

---

## 🔴 IMMEDIATE PRIORITY: Manhwaz Source Fix

### Issue
The Manhwaz source (manhwaz.com) is currently not working due to:
- Potential Cloudflare protection blocking automated access
- CORS proxy issues
- Site structure changes
- Possible site downtime or blocking

### Resolution Options
1. **Fix existing Manhwaz scraper**
   - Update selectors to match current site structure
   - Implement better CORS proxy with retry logic
   - Add Cloudflare bypass if possible
   
2. **Replace with alternative manhwa source** (Recommended)
   - ManhwaTop (manhwatop.com) - Reliable, large catalog
   - MangaBuddy (mangabuddy.com) - Fast updates, high quality
   - ManhwaHub (manhwahub.net) - Similar to Manhwaz
   - ComicK (comick.io) - Modern, fast, API available

3. **Add multiple sources for redundancy**
   - Implement 2-3 additional manhwa sources
   - Provide users with backup options
   - Increase overall reliability

**Target**: Complete this fix within Week 1-2 of current sprint.

---

## Phase 1: Web-Based Manga Reader (GitHub Pages)

### Milestone 1.1: Project Foundation & Basic UI (Week 1-2)
- [x] Create project structure
- [x] Set up HTML/CSS/JavaScript framework
- [x] Implement responsive Material Design UI
- [x] Create navigation structure (header, sidebar, main content area)
- [x] Set up routing for single-page application (SPA)
- [x] Implement dark/light theme toggle

### Milestone 1.2: Manga Catalog & Search (Week 2-3)
- [x] Create manga listing/grid view
- [x] Implement search functionality
- [x] Add filtering by genre, status, rating
- [x] Create manga detail page
- [x] Display manga metadata (title, author, description, cover, tags)
- [ ] Implement pagination for manga lists

### Milestone 1.3: Manga Reader Core (Week 3-4)
- [x] Build manga reader interface
- [x] Implement page navigation (next/previous)
- [x] Add keyboard shortcuts (arrow keys, space)
- [ ] Create reading modes (single page, double page, webtoon/vertical scroll)
- [ ] Implement zoom and pan controls
- [ ] Add fullscreen mode
- [x] Create progress indicator

### Milestone 1.4: Data Source Integration (Week 4-5)
- [x] Design API abstraction layer
- [x] Implement 1st manga source (MangaDex API)
- [x] Implement 2nd manga source (Manhwaz - needs fixing)
- [ ] Fix Manhwaz source or replace with more reliable alternative
- [ ] Add source selection in UI
- [x] Implement chapter list fetching
- [x] Implement page image loading with caching
- [x] Add loading states and error handling

### Milestone 1.5: User Features - Favorites & History (Week 5-6)
- [x] Implement localStorage for data persistence
- [x] Create favorites/bookmarks system
- [x] Add "Add to Favorites" functionality
- [x] Create favorites page/section
- [x] Implement reading history tracking
- [x] Create history page
- [x] Add "Continue Reading" feature
- [x] Implement bookmark positions within chapters

### Milestone 1.6: User Features - Library Management (Week 6-7)
- [ ] Create user library/collection system
- [ ] Implement custom categories/folders
- [ ] Add manga to multiple categories
- [ ] Create category management UI
- [ ] Implement sorting options (title, last read, date added)
- [ ] Add bulk actions (move, delete, mark as read)

### Milestone 1.7: Reader Enhancements (Week 7-8)
- [ ] Implement reading settings panel
- [ ] Add brightness control
- [ ] Add page transition animations
- [ ] Implement gesture controls (swipe for mobile)
- [ ] Add chapter selection dropdown in reader
- [ ] Create reader toolbar (auto-hide)
- [ ] Implement "mark as read" functionality
- [ ] Add reading statistics

### Milestone 1.8: Advanced Features (Week 8-9)
- [ ] Implement updates notification system
- [ ] Create "New Chapters" feed
- [ ] Add manga recommendations
- [ ] Implement filters for recommendations
- [ ] Create "Popular" and "Trending" sections
- [ ] Add manga rating/review display
- [ ] Implement advanced search filters

### Milestone 1.9: Offline Support & PWA (Week 9-10)
- [x] Convert to Progressive Web App (PWA)
- [x] Implement service worker for caching
- [x] Add offline reading capability
- [ ] Create download manager UI
- [ ] Implement chapter download functionality
- [ ] Add storage management tools
- [ ] Create install prompts

### Milestone 1.10: Polish & Optimization (Week 10-11)
- [ ] Optimize image loading and caching
- [ ] Implement lazy loading
- [ ] Add loading skeletons/placeholders
- [ ] Improve error handling and user feedback
- [ ] Add accessibility features (ARIA labels, keyboard nav)
- [ ] Implement analytics (privacy-respecting)
- [ ] Performance optimization
- [ ] Cross-browser testing and fixes

### Milestone 1.11: Additional Sources (Week 11-12)
- [ ] Implement 3rd manga source (ManhwaTop, MangaBuddy, or similar)
- [ ] Implement 4th manga source
- [ ] Implement 5th manga source
- [ ] Create source management UI
- [ ] Add source enable/disable functionality
- [ ] Implement source priority settings
- [ ] Expand to 20+ sources for comprehensive coverage

### Milestone 1.12: Kotatsu Feature Parity - UI/UX (Week 12-13)
- [ ] Material You design system implementation
- [ ] Implement Kotatsu-style navigation patterns
- [ ] Create incognito mode for privacy
- [ ] Add NSFW content filtering/warnings
- [ ] Implement manga cover and title editing
- [ ] Create tablet-optimized layouts
- [ ] Add color theme customization beyond dark/light
- [ ] Implement adaptive UI elements

### Milestone 1.13: Kotatsu Feature Parity - Reader Features (Week 13-14)
- [ ] Webtoon/vertical scroll mode with auto-scroll
- [ ] Double-page (side-by-side) reading mode
- [ ] Right-to-left (RTL) reading direction
- [ ] Configurable tap zones (left/right/center)
- [ ] Reader toolbar auto-hide functionality
- [ ] Brightness and contrast overlay controls
- [ ] Color filter overlays (sepia, grayscale, custom)
- [ ] Reading direction presets per manga
- [ ] Volume key page navigation support
- [ ] Page fit options (fit width, fit height, original size)
- [ ] Margin and padding customization
- [ ] Animation preferences (page transitions)

### Milestone 1.14: Kotatsu Feature Parity - Library Features (Week 14-15)
- [ ] User-defined categories/folders system
- [ ] Add manga to multiple categories
- [ ] Category management UI with CRUD operations
- [ ] Bulk selection and operations
- [ ] Bulk move between categories
- [ ] Bulk delete from library
- [ ] Bulk mark as read/unread
- [ ] Custom sorting per category
- [ ] Grid/list view toggle
- [ ] Library statistics dashboard
- [ ] Reading progress bars on manga cards
- [ ] Unread badges and indicators
- [ ] Last read timestamp display

### Milestone 1.15: Kotatsu Feature Parity - Discovery & Search (Week 15-16)
- [ ] Advanced search with multiple filters
- [ ] Search by publication year range
- [ ] Content rating filters (safe, suggestive, erotica)
- [ ] Translation status filters
- [ ] Original language filters
- [ ] Demographic filters (shounen, seinen, shoujo, josei)
- [ ] Theme and tag search
- [ ] Exclude filters (blacklist genres/tags)
- [ ] Search history with quick access
- [ ] Saved search queries
- [ ] Search suggestions and autocomplete
- [ ] Similar manga recommendations
- [ ] ML-based recommendation engine
- [ ] Random manga discovery button

### Milestone 1.16: Kotatsu Feature Parity - Tracking Integration (Week 16-17)
- [ ] MyAnimeList OAuth integration
- [ ] AniList GraphQL API integration
- [ ] Kitsu API integration
- [ ] Shikimori integration
- [ ] MangaUpdates integration
- [ ] Automatic reading progress sync
- [ ] Two-way sync (read status, chapters, scores)
- [ ] Import manga lists from tracking services
- [ ] Update manga status (reading, completed, dropped, etc.)
- [ ] Score/rating sync
- [ ] Start/finish date tracking
- [ ] Notes sync with tracking services
- [ ] Tracking service account management UI

### Milestone 1.17: Kotatsu Feature Parity - Updates & Notifications (Week 17-18)
- [ ] New chapter detection system
- [ ] Updates feed page with filtering
- [ ] Push notifications for new chapters (PWA)
- [ ] Email notifications (optional)
- [ ] Update badges on manga cards
- [ ] Mark all as read functionality
- [ ] Filter by update date
- [ ] Configurable update check frequency
- [ ] Update notification preferences
- [ ] Grouped notifications by manga
- [ ] Silent hours for notifications

### Milestone 1.18: Kotatsu Feature Parity - Offline & Downloads (Week 18-19)
- [ ] Advanced download manager UI
- [ ] Chapter download queue system
- [ ] Download priority and ordering
- [ ] Image quality selection for downloads
- [ ] Max concurrent downloads setting
- [ ] WiFi-only download option
- [ ] Storage location management
- [ ] Downloaded chapters indicator
- [ ] Auto-download new chapters
- [ ] Delete downloaded chapters
- [ ] Storage usage dashboard
- [ ] Download progress notifications
- [ ] Pause/resume downloads
- [ ] Download scheduler (time-based)

### Milestone 1.19: Kotatsu Feature Parity - Additional Features (Week 19-20)
- [ ] CBZ/CBR file support (local manga)
- [ ] Backup and restore system
- [ ] Backup scheduling
- [ ] Export data (JSON/CSV formats)
- [ ] Import data from other readers
- [ ] Advanced settings page
- [ ] Password/fingerprint app lock
- [ ] Parental controls
- [ ] Language selection
- [ ] Clear cache functionality
- [ ] Reset app data option
- [ ] Data usage monitoring
- [ ] Privacy settings
- [ ] Reading statistics page
  - [ ] Total manga/chapters/pages read
  - [ ] Reading time tracking
  - [ ] Reading speed analytics
  - [ ] Graphs and charts
  - [ ] Reading streaks
  - [ ] Genre distribution stats
- [ ] Experimental ad blocker for embedded browsers
- [ ] Manga relations (sequels, prequels, spin-offs)
- [ ] Author/artist pages and filtering
- [ ] Reading lists (thematic collections)
- [ ] Chapter bookmarks with notes

---

## Phase 2: Enhanced Web Features & Kotatsu Extended Features (Months 4-6)

### Milestone 2.1: User Accounts & Sync (Optional Cloud Features)
- [ ] Design authentication system (Firebase/Supabase)
- [ ] Implement user registration/login
- [ ] Add cloud sync for favorites and history
- [ ] Implement cross-device synchronization
- [ ] Create account management UI
- [ ] Add data export/import functionality

### Milestone 2.2: Social Features
- [ ] Implement user profiles
- [ ] Add manga lists sharing
- [ ] Create reading lists/collections
- [ ] Implement comments/discussions (optional)
- [ ] Add recommendation sharing

### Milestone 2.3: Advanced Reader Features
- [ ] Implement page pre-loading
- [ ] Add reading speed statistics
- [ ] Create custom reading modes
- [ ] Implement color filter overlays
- [ ] Add page bookmarking with notes
- [ ] Implement text-to-speech for text-heavy manga (experimental)

### Milestone 2.4: Integration Features
- [ ] Implement Shikimori integration
- [ ] Implement AniList integration
- [ ] Implement MyAnimeList integration
- [ ] Implement Kitsu integration
- [ ] Add sync status tracking
- [ ] Create integration settings UI

---

## Phase 3: Android Native Application with 100+ Sources (Months 6-14)

### Milestone 3.1: Android Project Setup
- [ ] Set up Android Studio project
- [ ] Configure Kotlin and Gradle
- [ ] Implement Material You design system
- [ ] Set up dependency injection (Hilt)
- [ ] Configure Room database
- [ ] Set up multi-module architecture
- [ ] Port kotatsu-parsers library or create JS-to-Kotlin bridge

### Milestone 3.2: Core Android Features
- [ ] Port web UI to Android native with Material You
- [ ] Implement navigation component
- [ ] Create fragments for main screens
- [ ] Implement Android reader with gestures
- [ ] Add notification support
- [ ] Implement background updates
- [ ] System dark mode integration
- [ ] Adaptive icons and Material You theming

### Milestone 3.3: Android-Specific Features
- [ ] Implement file system downloads
- [ ] Add CBZ/CBR file support
- [ ] Create Android widgets (reading progress, updates)
- [ ] Implement app shortcuts
- [ ] Add biometric authentication
- [ ] Volume key navigation
- [ ] Picture-in-picture mode (experimental)
- [ ] Split-screen optimization

### Milestone 3.4: Source Expansion (Target: 100+ Sources)
- [ ] Port all web sources to Android
- [ ] Implement kotatsu-parsers integration
- [ ] Add 50+ additional popular sources
- [ ] Expand to 100+ total sources
- [ ] Multi-source sync and deduplication
- [ ] Source reliability monitoring
- [ ] Automatic source failover

### Milestone 3.4: Data Migration & Sync
- [ ] Create web-to-Android data migration tool
- [ ] Implement cloud sync between web and Android
- [ ] Add backup/restore functionality
- [ ] Create settings sync

### Milestone 3.5: Performance & Optimization
- [ ] Optimize for Android 6.0+ support
- [ ] Implement battery optimization
- [ ] Add memory management
- [ ] Optimize for tablets
- [ ] Test on various devices

### Milestone 3.6: Publishing
- [ ] Prepare app for release
- [ ] Create F-Droid build
- [ ] Create GitHub releases
- [ ] Write documentation
- [ ] Create user guides

---

## Technical Stack

### Phase 1 (Web)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Vanilla JS or lightweight framework (Alpine.js/Petite Vue)
- **UI**: Material Design Components (MDC Web)
- **Build**: Vite or Parcel
- **Storage**: localStorage, IndexedDB
- **PWA**: Workbox for service workers
- **Hosting**: GitHub Pages

### Phase 2 (Enhanced Web)
- **Backend** (Optional): Firebase/Supabase for auth & sync
- **APIs**: REST APIs from manga sources
- **Integration**: OAuth for tracking services

### Phase 3 (Android)
- **Language**: Kotlin
- **Architecture**: MVVM, Clean Architecture
- **DI**: Hilt
- **Database**: Room
- **Network**: Retrofit, OkHttp
- **Image Loading**: Coil
- **Async**: Coroutines, Flow
- **UI**: Jetpack Compose / Material You
- **Build**: Gradle with Kotlin DSL

---

## Manga Sources to Implement

### Priority 1 (Phase 1 - Current)
1. ✅ MangaDex (Free API, large catalog) - Implemented
2. ⚠️ Manhwaz - Needs fixing or replacement
3. ManhwaTop or MangaBuddy (manhwa-focused)
4. MangaSee123/MangaLife (Free, no API key needed)
5. ComicK (modern, fast)

### Priority 2 (Phase 1 Expansion)
6. Batoto (community favorite)
7. MangaKakalot (large catalog)
8. MangaPark (active community)
9. Mgeko (ad-free)
10. MangaHub (reliable)

### Priority 3 (Phase 2 - Web)
11-30. Additional sources targeting 30+ sources for web version:
- Asura Scans
- Flame Comics
- Reaper Scans
- Webtoons (official)
- ManhwaClan
- CoffeeManga
- Toonily
- MangaFire
- MangaNato
- MangaBuddy
- ReadMangaBat
- And more popular sources

### Phase 3 (Android)
Continue expanding to 100+ sources following Kotatsu's model:
- Port kotatsu-parsers library (1000+ sources available)
- Or implement custom parsers for top 100+ sources
- Include regional sources (JP, KR, CN, etc.)
- Official sources where available
- Scanlation group sources

---

## Success Metrics

### Phase 1 (Current - Web MVP)
- ✅ Functional web reader with 2+ manga sources (1 working, 1 needs fix)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Favorites and history working
- ✅ Offline reading via PWA (basic)
- ✅ Deployable to GitHub Pages
- **Target additions:**
  - Fix Manhwaz or add replacement source
  - Add 3-5 more reliable sources
  - Implement webtoon reading mode
  - Basic tracking integration (at least 1 service)

### Phase 2 (Web Feature Complete)
- 20-30 manga sources
- User accounts and sync (optional cloud)
- All major tracking service integrations (MAL, AniList, Kitsu, Shikimori)
- Enhanced reader features (all modes, filters, controls)
- Download manager with offline reading
- Library categories and organization
- **Kotatsu feature parity at 80-90%**

### Phase 3 (Android Native)
- Native Android app published to F-Droid and GitHub Releases
- 100+ manga sources (matching Kotatsu's breadth)
- Material You design system
- All web features ported
- Android-specific features (widgets, biometrics, etc.)
- **Full Kotatsu feature parity at 95-100%**
- Active user base and community
- Feature parity with original Chirui Reader
- Active user base

---

## Current Status (Updated: November 2024)

**Phase**: 1 (Web-Based Manga Reader)  
**Current Milestone**: 1.4 (Data Source Integration) - In Progress  
**Overall Progress**: ~25% of Phase 1 complete

### ✅ Completed Milestones
- ✅ Milestone 1.1: Project Foundation & Basic UI (100%)
- ✅ Milestone 1.2: Manga Catalog & Search (90%)
- ✅ Milestone 1.3: Manga Reader Core (70%)
- ✅ Milestone 1.5: User Features - Favorites & History (100%)
- ✅ Milestone 1.9: Offline Support & PWA (50%)

### 🔄 In Progress
- 🔄 Milestone 1.4: Data Source Integration (75%)
  - ✅ MangaDex fully functional
  - ⚠️ Manhwaz needs fixing
  - ⏳ Need 3-5 additional sources

### 🎯 Immediate Priorities (Next 2-4 Weeks)
1. **Fix Manhwaz or Add Replacement Sources**
   - Critical: App needs more than 1 working source
   - Target: Add 3-5 reliable sources (ManhwaTop, MangaBuddy, ComicK, etc.)
   
2. **Implement Webtoon Reading Mode**
   - High demand feature
   - Essential for manhwa/manhua content
   - Vertical scrolling with auto-scroll support

3. **Add Source Selection UI**
   - Let users choose which sources to enable
   - Show source status (working/failed)
   - Source-specific settings

4. **Begin Kotatsu Feature Integration**
   - Start with Milestone 1.12 (UI/UX improvements)
   - Implement Material You design elements
   - Add advanced reader controls

### 📊 Progress Tracking

**Feature Parity with Kotatsu**: ~15%
- Core reading: 70%
- Library management: 30%
- Source support: 5% (2 sources vs 1000+)
- Tracking integration: 0%
- Advanced features: 10%

**Milestones Remaining in Phase 1**: 14 total
- 5 completed
- 1 in progress
- 8 not started
- Target completion: 6-8 months for full Phase 1

### 🔮 Long-term Vision
1. **Phase 1 Target** (Months 1-8): Web reader with 20-30 sources, 80% Kotatsu feature parity
2. **Phase 2 Target** (Months 8-12): Enhanced web features, 90% Kotatsu parity
3. **Phase 3 Target** (Months 12-24): Android native app with 100+ sources, 95-100% Kotatsu parity

---

## Next Immediate Steps

### Week 1-2: Manhwaz Fix & Source Expansion
1. Investigate Manhwaz.com status and feasibility of fix
2. If unfixable, implement 2-3 alternative manhwa sources
3. Test all sources thoroughly
4. Update documentation

### Week 3-4: Reader Enhancements
1. Implement webtoon/vertical scroll mode
2. Add basic zoom and pan controls
3. Improve reader UI/UX
4. Add source selection interface

### Week 5-6: Begin Kotatsu Feature Integration
1. Material You design system research
2. Start implementing advanced reader features
3. Begin library categories system
4. Plan tracking service integration

---

## Notes
2. Implement Material Design UI framework
3. Create responsive navigation
4. Build manga catalog view
5. Integrate first manga source (MangaDex)

---

## Notes

- This roadmap is flexible and will be adjusted based on progress and feedback
- Each milestone can be broken down into smaller tasks
- Features will be implemented incrementally and tested thoroughly
- Focus on core functionality first, polish later
- Maintain clean, documented code throughout
- Regular commits and version tracking
