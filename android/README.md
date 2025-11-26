# Chirui Reader Android (Kotatsu-native)

This directory contains the initial Android application scaffold for the native Kotlin rewrite of Chirui Reader, targeting feature parity with the Kotatsu fork. _Last updated: 2025-11-25 18:24 UTC._

## Project structure
- `app/`: UI shell with Jetpack Compose, Material 3 theme, and Hilt entry points. Includes a Catalog experience with a Discover grid (search, filters, pagination), a Sources tab for enable/disable toggles and language filters, a Manga detail screen powered by bundled fixtures, a fixture-backed reader route, and a downloads queue skeleton with pause/resume/cancel/retry controls.
- `domain/`: platform-agnostic models and coroutine dispatcher qualifiers.
- `data/`: DI modules for Room, Retrofit/OkHttp, Datastore, dispatcher provider, and parser bindings plus an asset-backed parser registry.
- `parsers/`: interface for the parser registry and a static fallback implementation.
- `MainActivity`: Compose entry point with a top app bar and bottom navigation across Home, Catalog, Library, Downloads, and Settings.
- `ui/theme`: lightweight theme wrapper that will be expanded as screens are built.

## Getting started

### Building with Android Studio (Recommended)
1. Open the `android/` directory in Android Studio Hedgehog or later.
2. Let Android Studio download the Android Gradle Plugin and SDK platform 34.
3. Connect a device or start an emulator, then run the `app` configuration.

### Building from Command Line
The project includes a Gradle wrapper and helpful development script:

```bash
cd android

# Using the development helper script (easy shortcuts)
./dev.sh build      # Build debug APK
./dev.sh install    # Build and install on device
./dev.sh test       # Run unit tests
./dev.sh lint       # Check code style
./dev.sh format     # Auto-format code
./dev.sh help       # Show all commands

# Or use gradlew directly
./gradlew assembleDebug    # Build debug APK
./gradlew build            # Build all variants
./gradlew tasks            # List available tasks
```

**Note**: Building requires network access to download dependencies from Google's Maven repository and Maven Central.

### Documentation
- **[BUILD_GUIDE.md](BUILD_GUIDE.md)**: Comprehensive build instructions and troubleshooting
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Guide for contributing to the Android app
- **[../docs/NEXT_STEPS_TODO.md](../docs/NEXT_STEPS_TODO.md)**: Development roadmap and priorities

### Next steps
- Replace the placeholder parser registry JSON with the full set of Kotatsu source assets/icons and wire icons into the UI.
- Swap the bundled catalog fixture (`assets/catalog/featured.json`) with real covers/titles from the Kotatsu forks.
- Port Kotatsu domain models, repositories, and data sources into Kotlin packages across `domain/` and `data/`.
- Wire real download workers, notifications, and storage plumbing behind the new downloads queue skeleton, replacing fixture data with assets from your Kotatsu forks.
- Use **docs/NEXT_STEPS_TODO.md** as the approval checklist for sprint-by-sprint deliverables.
