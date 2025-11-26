# Chirui Reader

[![Deploy to GitHub Pages](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml/badge.svg)](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml)
[![Android CI](https://github.com/swolem12/Chirui-Reader/actions/workflows/android-build.yml/badge.svg)](https://github.com/swolem12/Chirui-Reader/actions/workflows/android-build.yml)

**Native Kotlin/Android manga reader** inspired by Kotatsu, with a focus on extensible sources, offline reading, and Material 3 design. _Status last updated: 2025-11-26 04:30 UTC._

## 🚀 What is This?

Chirui Reader is a **native Android application** for reading manga and manhwa. It's built with Kotlin, Jetpack Compose, and Material 3, targeting feature parity with the Kotatsu reader.

- ✅ Native Android app with Jetpack Compose UI
- ✅ Material Design 3 theming
- ✅ Offline reading support
- ✅ Extensible source system
- ✅ Build infrastructure with Gradle wrapper and CI/CD
- ❌ NOT an SDK or library for developers
- ❌ NOT a converter or build tool

## 🌐 Legacy Web App

The original **Progressive Web App (PWA)** has been archived to `webapp-archive/`. It remains deployed at **[swolem12.github.io/Chirui-Reader](https://swolem12.github.io/Chirui-Reader/)** for demonstration but receives no new features.

See [webapp-archive/README.md](webapp-archive/README.md) for details on the archived web version.

## 📱 Android App (Primary Focus)

The native Android app is the active development track with complete build infrastructure:

### ⬇️ Install on Your Phone

**Quick Install (Recommended):**
1. Download the latest APK from [Releases](https://github.com/swolem12/Chirui-Reader/releases) (coming soon)
2. Or build it yourself:
   ```bash
   cd android
   ./dev.sh build        # Build APK
   ./gradlew installDebug # Install on connected phone
   ```
3. See [android/INSTALL.md](android/INSTALL.md) for detailed installation instructions

**Requirements:**
- Android 7.0 (API 24) or higher
- ~50 MB storage space

### Features Implemented
- ✅ Jetpack Compose scaffold with Material 3 theme
- ✅ Kotlin/Gradle build system with wrapper and CI/CD
- ✅ Catalog with Discover grid (search, filters, pagination)
- ✅ Sources tab with enable/disable toggles
- ✅ Manga detail view with chapter listings
- ✅ Reader with page swiping
- ✅ Downloads queue skeleton
- ✅ Build infrastructure (Gradle wrapper, ktlint, CI/CD)

### Build Infrastructure
- **Gradle wrapper (8.5)** for consistent builds
- **GitHub Actions** for automated builds and tests
- **ktlint** for code quality
- **Helper scripts** for common tasks
- Complete documentation in [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md)

## 🏃 Quick Start

### Android App (Recommended)

```bash
git clone https://github.com/swolem12/Chirui-Reader.git
cd Chirui-Reader/android

# Using the helper script
./dev.sh build    # Build debug APK
./dev.sh test     # Run tests
./dev.sh help     # See all commands

# Or use Gradle directly
./gradlew assembleDebug
```

**Using Android Studio:**
1. Open the `android/` folder in Android Studio Hedgehog or later
2. Let the IDE download dependencies and sync
3. Run the `app` configuration on a device/emulator

See [android/README.md](android/README.md) and [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md) for detailed instructions.

### Legacy Web App (Archived)

The web app is archived but still accessible:
```bash
cd webapp-archive
python -m http.server 8000
# Open http://localhost:8000
```

See [webapp-archive/README.md](webapp-archive/README.md) for details.

## 📚 Documentation

### Android App (Active Development)
- 📱 **[android/README.md](android/README.md)** - Android project overview
- 🔨 **[android/BUILD_GUIDE.md](android/BUILD_GUIDE.md)** - Complete build instructions and troubleshooting
- 🤝 **[android/CONTRIBUTING.md](android/CONTRIBUTING.md)** - Contributing guidelines
- 🏗️ **[android/BUILD_INFRASTRUCTURE.md](android/BUILD_INFRASTRUCTURE.md)** - Build system documentation

### Project Documentation
- 📖 **[ARCHITECTURE.md](ARCHITECTURE.md)** - Project architecture overview
- 🗺️ **[CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md)** - Project roadmap and milestones
- 💻 **[DEVELOPMENT.md](DEVELOPMENT.md)** - General development guide
- 📋 **[FEATURE_GAP_ANALYSIS.md](FEATURE_GAP_ANALYSIS.md)** - Feature comparison
- 🔍 **[KOTATSU_PORT_PLAN.md](KOTATSU_PORT_PLAN.md)** - Kotatsu porting plan
- 📦 **[IMPLEMENTED_SOURCES.md](IMPLEMENTED_SOURCES.md)** - Source implementations

### Archived Web App
- 🌐 **[webapp-archive/README.md](webapp-archive/README.md)** - Archived PWA documentation
- 📦 **[webapp-archive/docs/](webapp-archive/docs/)** - Legacy web app docs

## 🛠️ Technology Stack

### Android (Active)
- **Language**: Kotlin 1.9.24
- **UI**: Jetpack Compose with Material 3
- **Architecture**: MVVM with Clean Architecture
- **DI**: Hilt
- **Database**: Room
- **Networking**: Retrofit + OkHttp
- **Async**: Kotlin Coroutines
- **Build**: Gradle 8.5, AGP 8.5.0

### Web (Archived)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI**: Material Design 3
- **Storage**: localStorage
- **PWA**: Service Workers
- **Hosting**: GitHub Pages

## 📊 Project Status

**Current Phase**: Phase 3 - Native Android Application (Build Infrastructure Complete)

### Recent Progress (2025-11-26)
- ✅ **Build Infrastructure**: Gradle wrapper, CI/CD, ktlint, helper scripts
- ✅ **Documentation**: Comprehensive BUILD_GUIDE.md, CONTRIBUTING.md
- ✅ **Web App**: Archived to `webapp-archive/` (maintenance mode only)
- ✅ Android Jetpack Compose skeleton
- ✅ Kotlin/Gradle configuration
- ✅ Catalog with Discover grid and Sources tab
- ✅ Manga detail screen with chapter fixtures
- ✅ Basic reader with page swiping
- ✅ Downloads queue skeleton

### Active Development
All new features and improvements are focused on the **Android app** in the `android/` directory.

### Next Steps
See [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) and [webapp-archive/docs/NEXT_STEPS_TODO.md](webapp-archive/docs/NEXT_STEPS_TODO.md) for detailed roadmap.

## 🤝 Contributing

Contributions are welcome! Please see:
- [android/CONTRIBUTING.md](android/CONTRIBUTING.md) for Android app contributions
- [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) for planned features and priorities

Focus areas:
- Android app feature development
- Kotatsu asset integration
- Source extension implementations
- Documentation improvements

## 📄 License

Check repository license file for details.

---

**Primary Focus**: Native Android Application  
**Status**: Active Development  
**Last Updated**: 2025-11-26
