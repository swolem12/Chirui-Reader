# Chirui Reader

[![Deploy to GitHub Pages](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml/badge.svg)](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml)

A web-based manga/manhwa reader application deployable to GitHub Pages.

## 🌐 Live Demo

**[Try Chirui Reader Now →](https://swolem12.github.io/Chirui-Reader/)**

## What is This?

Chirui Reader is a **Progressive Web App (PWA)** for reading manga and manhwa. It's an **end-user application**, not an SDK or library.

- ✅ Web application for reading manga
- ✅ Deployed via GitHub Pages
- ✅ Works on desktop and mobile browsers
- ✅ Installable as PWA for offline reading
- ❌ NOT an SDK or library for developers
- ❌ NOT a converter or build tool

## Features

### Core Features
- 📚 **Manga Catalog** - Browse and search through manga collection
- 🔍 **Advanced Filtering** - Filter by genre, status, rating
- 📖 **Manga Reader** - Smooth reading experience with keyboard shortcuts
- ⌨️ **Keyboard Navigation** - Arrow keys, space bar for page navigation
- ♥️ **Favorites System** - Save your favorite manga for quick access
- 📚 **Reading History** - Automatic tracking of reading progress
- 🔄 **Continue Reading** - Pick up where you left off

### PWA Features
- 💾 **Offline Support** - Read manga even without internet
- 📱 **Installable** - Add to home screen on mobile/desktop
- 🌙 **Dark Mode** - Easy on the eyes theme toggle
- 📱 **Responsive Design** - Works on phones, tablets, and desktops

## Quick Start

### For Users

1. Visit **[https://swolem12.github.io/Chirui-Reader/](https://swolem12.github.io/Chirui-Reader/)**
2. Browse the catalog or search for manga
3. Click on a manga to view details
4. Start reading!
5. (Optional) Install as PWA for offline access

### For Developers

1. Clone this repository
   ```bash
   git clone https://github.com/swolem12/Chirui-Reader.git
   cd Chirui-Reader
   ```

2. Open `index.html` in your browser, or start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000`

## Documentation

- 📖 **[ARCHITECTURE.md](ARCHITECTURE.md)** - Comprehensive project architecture and technology overview
- 📦 **[docs/DISTRIBUTION.md](docs/DISTRIBUTION.md)** - How to distribute web apps (PWA) vs native Android apps
- 🚀 **[docs/PWA_QUICK_START.md](docs/PWA_QUICK_START.md)** - Quick guide to implement PWA features
- 🔍 **[docs/KOTATSU_CLARIFICATION.md](docs/KOTATSU_CLARIFICATION.md)** - Clarifies Kotatsu's architecture (no PWA conversion)
- 📋 **[docs/FAQ.md](docs/FAQ.md)** - Frequently asked questions
- 🗺️ **[CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md)** - Project roadmap and milestones
- 💻 **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide and deployment instructions

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI**: Material Design 3
- **Storage**: localStorage for favorites and history
- **PWA**: Service Workers for offline support
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions (automatic)
- **Future**: Android native app (Phase 3)

## Project Status

**Current Phase**: Phase 1 - Web-Based Manga Reader

### Completed Milestones
- ✅ Milestone 1.1: Project Foundation & Basic UI (100%)
- ✅ Milestone 1.2: Manga Catalog & Search (83%)
- ✅ Milestone 1.3: Manga Reader Core (57%)
- ✅ Milestone 1.5: User Features - Favorites & History (100%)
- ✅ Milestone 1.9: Offline Support & PWA (43%)

See [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) for complete roadmap.

## Contributing

See [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) for planned features and milestones. Contributions are welcome!

## License

Check repository license file for details.
