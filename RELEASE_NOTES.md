# Chirui Reader v0.1.0 - Installation Ready! 🎉

## What's New

Chirui Reader is now ready to be installed on your Android phone! This early access release provides the foundation for a Kotatsu-inspired manga reader.

## ✨ Features

### Working Now
- **📚 Browse Manga Sources**: View and enable/disable different manga sources
- **🔍 Catalog Search**: Search and filter manga with pagination
- **📖 Manga Details**: View manga information, tags, and chapter lists
- **📱 Chapter Reader**: Read chapters with swipe navigation
- **🎨 Material 3 Design**: Modern UI with adaptive theming
- **⚙️ Source Management**: Enable/disable sources and language filters

### In Development
- 🔨 Download Manager for offline reading
- 🔨 Library management and favorites
- 🔨 Reading history and progress tracking
- 🔨 More manga sources

## 📥 Installation

### Quick Install
1. **Download**: Get the APK from the releases page (coming soon) or build it yourself
2. **Enable**: Allow installation from unknown sources on your Android phone
3. **Install**: Open the APK file and tap "Install"
4. **Enjoy**: Start reading manga!

### Build It Yourself
```bash
git clone https://github.com/swolem12/Chirui-Reader.git
cd Chirui-Reader/android
./gradlew assembleDebug
# Install the APK from app/build/outputs/apk/debug/app-debug.apk
```

📖 **Detailed Instructions**: See [android/INSTALL.md](android/INSTALL.md)

## 📱 Requirements

- **Android Version**: 7.0 (API 24) or higher
- **Storage**: ~50 MB
- **Permissions**: Internet access, network state, storage

## 🔧 Technical Details

### Build Infrastructure
- Gradle 8.5 with wrapper for consistent builds
- Android Gradle Plugin 8.5.0
- Kotlin 1.9.24
- Jetpack Compose with Material 3
- Hilt for dependency injection
- CI/CD with GitHub Actions

### Architecture
- **MVVM** architecture with Clean Architecture principles
- **Multi-module** structure: app, domain, data, parsers
- **Room** database for local storage
- **Retrofit + OkHttp** for networking
- **Kotlin Coroutines** for async operations

## 🛠️ For Developers

### Getting Started
```bash
cd android
./dev.sh build    # Build APK
./dev.sh test     # Run tests
./dev.sh lint     # Check code style
./dev.sh format   # Auto-format code
```

### Documentation
- [BUILD_GUIDE.md](android/BUILD_GUIDE.md) - Complete build instructions
- [CONTRIBUTING.md](android/CONTRIBUTING.md) - Development guidelines
- [BUILD_INFRASTRUCTURE.md](android/BUILD_INFRASTRUCTURE.md) - Infrastructure docs

### Code Quality
- **ktlint** for Kotlin code formatting
- **EditorConfig** for cross-editor consistency
- **GitHub Actions** for automated builds and tests

## 🚨 Important Notes

### Early Access
This is an early access release. Some features are still in development:
- Downloads are UI-only (functionality coming soon)
- Library management is planned
- More manga sources will be added

### Security
The current release uses a debug keystore for easy testing. The keystore is publicly available in the repository. For production use, this should be replaced with a secure, private keystore.

### Data
This version uses fixture data for demonstration. Real manga sources will be integrated in future updates.

## 📝 Changelog

### v0.1.0 (2025-11-26)

**Added:**
- Initial Android app release
- Gradle wrapper and build infrastructure
- App icon with Material 3 adaptive design
- Internet and storage permissions
- Home screen with welcome message
- Catalog browsing with sources
- Manga detail views
- Chapter reader with swipe navigation
- Source management UI
- CI/CD with GitHub Actions
- Comprehensive documentation

**Infrastructure:**
- Gradle 8.5 build system
- ktlint for code quality
- Debug signing configuration
- EditorConfig for formatting
- Development helper scripts

## 🐛 Known Issues

- Downloads are UI-only (worker implementation pending)
- Library/favorites not yet implemented
- Limited manga sources (fixture data)
- No reading history persistence yet

## 🔮 Coming Soon

- Download manager functionality
- Library and favorites management
- Reading history and progress
- More manga sources
- Source extension system
- Settings and preferences
- Release builds with proper signing

## 📞 Support

- **Issues**: https://github.com/swolem12/Chirui-Reader/issues
- **Documentation**: See the [README](README.md) and [android/README.md](android/README.md)

## 📄 License

See repository license file for details.

---

**Enjoy reading manga with Chirui Reader!** 📚✨

_Note: The web version has been archived to `webapp-archive/` and is in maintenance-only mode. All development focuses on the Android app._
