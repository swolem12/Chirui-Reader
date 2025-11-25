# Chirui Reader

[![Deploy to GitHub Pages](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml/badge.svg)](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml)

Chirui Reader is transitioning from a web-based prototype to a native Kotlin Android application inspired by the Kotatsu reader. _Status last updated: 2025-11-25 18:24 UTC._

## 🌐 Live Demo

**[Try Chirui Reader Now →](https://swolem12.github.io/Chirui-Reader/)**

## What is This?

Chirui Reader started as a **Progressive Web App (PWA)** for reading manga and manhwa. We are now prioritizing the **Android-native** implementation to mirror Kotatsu more closely. It's an **end-user application**, not an SDK or library.

- ✅ Web application for reading manga
- ✅ Deployed via GitHub Pages
- ✅ Works on desktop and mobile browsers
- ✅ Installable as PWA for offline reading
- ❌ NOT an SDK or library for developers
- ❌ NOT a converter or build tool

## Tracks

### Native Android (primary focus)
- Jetpack Compose scaffold in `android/` with Material 3 theme.
- Kotlin/Gradle setup ready for Kotatsu feature parity work.
- Catalog experience with a Discover grid (search, filters, pagination) backed by bundled Kotatsu fixtures and a Sources tab with enable/disable toggles.
- Manga detail view with favorites/actions wired into a basic reader that supports swiping through bundled Kotatsu-inspired pages.
- Downloads queue skeleton with fixture-backed statuses and controls for pause/resume/cancel/retry.

### Web prototype (maintenance only)
- HTML/JS/CSS PWA remains for reference and quick demos.

## Quick Start

### Android app (primary)
1. Clone this repository
   ```bash
   git clone https://github.com/swolem12/Chirui-Reader.git
   cd Chirui-Reader/android
   ```
2. Open the `android/` folder in Android Studio Hedgehog or later.
3. Let the IDE download the Android Gradle Plugin and Android 34 SDK.
4. Run the `app` configuration on a connected device/emulator.

### Web PWA (legacy prototype)
1. Clone this repository and install dependencies
   ```bash
   git clone https://github.com/swolem12/Chirui-Reader.git
   cd Chirui-Reader
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```
3. Open the served URL from the CLI output.

## Documentation

- 📖 **[ARCHITECTURE.md](ARCHITECTURE.md)** - Comprehensive project architecture and technology overview
- 📦 **[docs/DISTRIBUTION.md](docs/DISTRIBUTION.md)** - How to distribute web apps (PWA) vs native Android apps
- 🚀 **[docs/PWA_QUICK_START.md](docs/PWA_QUICK_START.md)** - Quick guide to implement PWA features
- 🔍 **[docs/KOTATSU_CLARIFICATION.md](docs/KOTATSU_CLARIFICATION.md)** - Clarifies Kotatsu's architecture (no PWA conversion)
- 🖼️ **[docs/KOTATSU_ASSET_MANIFEST.md](docs/KOTATSU_ASSET_MANIFEST.md)** - Inventory of Kotatsu fork assets to ingest into the Android app
- ✅ **[docs/NEXT_STEPS_TODO.md](docs/NEXT_STEPS_TODO.md)** - Approval-focused TODO list for the Android-native Kotatsu build
- 📋 **[docs/FAQ.md](docs/FAQ.md)** - Frequently asked questions
- 🗺️ **[CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md)** - Project roadmap and milestones
- 💻 **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide and deployment instructions
- 📱 **[android/README.md](android/README.md)** - Native Android project overview and next steps

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI**: Material Design 3
- **Storage**: localStorage for favorites and history
- **PWA**: Service Workers for offline support
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions (automatic)
- **Future**: Android native app (Phase 3)

## Project Status

**Current Phase**: Transitioning into Phase 3 - Android Native Application (scaffolding started)

### Recent progress
- ✅ Android Jetpack Compose skeleton added under `android/`.
- ✅ Kotlin/Gradle configuration prepared for Kotatsu parity work.
- ✅ Catalog Discover tab with paginated grid, filters, and offline fixtures plus a Sources tab with language filters and toggles backed by an asset parser registry.
- ✅ Manga detail screen with bundled Kotatsu-inspired chapter fixtures and in-app favorite toggles.
- ✅ Download queue screen seeded with Kotatsu-inspired fixture states and controls for pause/resume/cancel/retry (network/worker plumbing pending).
- ⚠️ Web PWA remains available but is in maintenance-only mode.

See [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) for complete roadmap.

## Contributing

See [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) for planned features and milestones. Contributions are welcome!

## License

Check repository license file for details.
