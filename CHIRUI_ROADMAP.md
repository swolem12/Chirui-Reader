# Chirui (チルい) Reader Project - Roadmap

## Project Overview
Recreate the Chirui (チルい) Reader manga reader application, starting with a web-based version deployable to GitHub Pages, then evolving to a native Android application.

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
- [ ] Design API abstraction layer
- [ ] Implement 1st manga source (MangaDex API)
- [ ] Implement 2nd manga source (alternative free API)
- [ ] Add source selection in UI
- [ ] Implement chapter list fetching
- [ ] Implement page image loading with caching
- [ ] Add loading states and error handling

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
- [ ] Implement 3rd manga source
- [ ] Implement 4th manga source
- [ ] Implement 5th manga source
- [ ] Create source management UI
- [ ] Add source enable/disable functionality
- [ ] Implement source priority settings

---

## Phase 2: Enhanced Web Features (Months 4-5)

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

## Phase 3: Android Native Application (Months 6-12)

### Milestone 3.1: Android Project Setup
- [ ] Set up Android Studio project
- [ ] Configure Kotlin and Gradle
- [ ] Implement Material You design
- [ ] Set up dependency injection (Hilt)
- [ ] Configure Room database
- [ ] Set up multi-module architecture

### Milestone 3.2: Core Android Features
- [ ] Port web UI to Android native
- [ ] Implement navigation component
- [ ] Create fragments for main screens
- [ ] Implement Android reader with gestures
- [ ] Add notification support
- [ ] Implement background updates

### Milestone 3.3: Android-Specific Features
- [ ] Implement file system downloads
- [ ] Add CBZ/CBR file support
- [ ] Create Android widgets
- [ ] Implement app shortcuts
- [ ] Add biometric authentication
- [ ] Implement system dark mode integration

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

### Priority 1 (Phase 1)
1. MangaDex (Free API, large catalog)
2. MangaSee/MangaLife (Free, no API key needed)

### Priority 2 (Phase 1 later)
3. Comick.io
4. Batoto
5. MangaKakalot

### Priority 3 (Phase 2)
6-20. Additional sources as needed (targeting 20+ sources for web version)

### Phase 3
Continue expanding to 100+ sources for Android version

---

## Success Metrics

### Phase 1
- Functional web reader with 2+ manga sources
- Responsive design (mobile, tablet, desktop)
- Favorites and history working
- Offline reading via PWA
- Deployable to GitHub Pages

### Phase 2
- 5+ manga sources
- User accounts and sync
- Tracking service integrations
- Enhanced reader features

### Phase 3
- Native Android app published
- 100+ manga sources
- Feature parity with original Chirui Reader
- Active user base

---

## Current Status

**Phase**: 1 (Web-Based Manga Reader)  
**Milestone**: 1.1 (Project Foundation & Basic UI)  
**Progress**: Starting - creating project structure

**Next Steps**:
1. Set up basic HTML/CSS/JS structure
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
