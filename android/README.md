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
1. Open the `android/` directory in Android Studio Hedgehog or later.
2. Let Android Studio download the Android Gradle Plugin and SDK platform 34.
3. Connect a device or start an emulator, then run the `app` configuration.

### Next steps
- Replace the placeholder parser registry JSON with the full set of Kotatsu source assets/icons and wire icons into the UI.
- Swap the bundled catalog fixture (`assets/catalog/featured.json`) with real covers/titles from the Kotatsu forks.
- Port Kotatsu domain models, repositories, and data sources into Kotlin packages across `domain/` and `data/`.
- Wire real download workers, notifications, and storage plumbing behind the new downloads queue skeleton, replacing fixture data with assets from your Kotatsu forks.
- Use **docs/NEXT_STEPS_TODO.md** as the approval checklist for sprint-by-sprint deliverables.
