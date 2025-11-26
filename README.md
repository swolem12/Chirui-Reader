# Chirui Reader

[![Deploy to GitHub Pages](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml/badge.svg)](https://github.com/swolem12/Chirui-Reader/actions/workflows/deploy.yml)
[![Android CI](https://github.com/swolem12/Chirui-Reader/actions/workflows/android-build.yml/badge.svg)](https://github.com/swolem12/Chirui-Reader/actions/workflows/android-build.yml)

**Native Kotlin/Android manga reader** inspired by Kotatsu, with a focus on extensible sources, offline reading, and Material 3 design. _Status last updated: 2025-11-26 04:30 UTC._

> ⚠️ **Looking for the APK file?** The "Beta" release currently has no APK files attached.  
> 🚀 **[QUICK FIX GUIDE](QUICK_FIX_FOR_APK.md)** - Get APK files in 5-10 minutes!  
> 📥 **[Download Instructions](DOWNLOAD_INSTRUCTIONS.md)** - All options to get the app
>
> 🎯 **For Maintainers:** To enable downloads for users, create a proper release!  
> 👉 **[Follow This 2-Minute Guide](CREATE_FIRST_RELEASE.md)** to publish a release with APK files.

## 🚀 What is This?

Chirui Reader is a **native Android application** for reading manga and manhwa. It's built with Kotlin, Jetpack Compose, and Material 3, targeting feature parity with the Kotatsu reader.

- ✅ Native Android app with Jetpack Compose UI
- ✅ Material Design 3 theming
- ✅ Offline reading support
- ✅ Extensible source system
- ✅ Build infrastructure with Gradle wrapper and CI/CD
- ❌ NOT an SDK or library for developers
- ❌ NOT a converter or build tool

## 🌐 Download Page

**Live Download Page**: **[swolem12.github.io/Chirui-Reader](https://swolem12.github.io/Chirui-Reader/)** - One-click APK download

The GitHub Pages site now serves as the download page for the Android app (similar to kotatsu.app/download).

## 📱 Android App (Primary Focus)

The native Android app is the active development track with complete build infrastructure:

### ⬇️ Install on Your Phone

> ⚠️ **Important**: The current "Beta" release doesn't have APK files yet. See [DOWNLOAD_INSTRUCTIONS.md](DOWNLOAD_INSTRUCTIONS.md) for all available options!

**When APK is available:**

**🚀 One-Click Install:**

**[📥 Download APK](https://swolem12.github.io/Chirui-Reader/)** ← Just like kotatsu.app!

Or get it from [GitHub Releases](https://github.com/swolem12/Chirui-Reader/releases)

**Alternative: Build it yourself** (see instructions below)

### 📦 Android Releases / Downloads

> ⚠️ **Note**: The "Beta" release exists but has no APK files. To get the app right now, you have two options:
> 1. **Wait** for a maintainer to create a proper release (recommended for users)
> 2. **Build it yourself** from source (see instructions in this README or [DOWNLOAD_INSTRUCTIONS.md](DOWNLOAD_INSTRUCTIONS.md))

**When APK releases are available:**
- **[📥 Download from Releases Page](https://github.com/swolem12/Chirui-Reader/releases)** - Get the latest APK or AAB
- **Direct link to APK**: Once a stable release is published, you can use the direct download link

**For maintainers:** To enable automated release builds with proper signing, configure the following GitHub repository secrets:
- `KEYSTORE_BASE64` - Base64-encoded release keystore file
- `KEYSTORE_PASSWORD` - Keystore password
- `KEY_ALIAS` - Key alias name
- `KEY_PASSWORD` - Key password

When a GitHub Release is created, the workflow will automatically build a signed AAB and APK and upload them to the release.

**Build it yourself:**
```bash
cd android
./dev.sh build        # Build APK
./gradlew installDebug # Install on connected phone
```

See [android/INSTALL.md](android/INSTALL.md) for detailed instructions.

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

### Download Page (GitHub Pages)
- 🌐 **[webapp-archive/README.md](webapp-archive/README.md)** - Download page and deployment documentation

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

### Download Page (GitHub Pages)
- **Purpose**: APK download page for Android app
- **Content**: HTML download page with automatic release detection
- **Hosting**: GitHub Pages

## 📊 Project Status

**Current Phase**: Phase 3 - Native Android Application (Build Infrastructure Complete)

### Recent Progress (2025-11-26)
- ✅ **Build Infrastructure**: Gradle wrapper, CI/CD, ktlint, helper scripts
- ✅ **Documentation**: Comprehensive BUILD_GUIDE.md, CONTRIBUTING.md
- ✅ **Download Page**: GitHub Pages redesigned to serve only the APK download page
- ✅ Android Jetpack Compose skeleton
- ✅ Kotlin/Gradle configuration
- ✅ Catalog with Discover grid and Sources tab
- ✅ Manga detail screen with chapter fixtures
- ✅ Basic reader with page swiping
- ✅ Downloads queue skeleton

### Active Development
All new features and improvements are focused on the **Android app** in the `android/` directory.

### Next Steps
See [CHIRUI_ROADMAP.md](CHIRUI_ROADMAP.md) for detailed roadmap.

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
