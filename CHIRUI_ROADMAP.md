# Chirui (チルい) Reader - Native Kotatsu Roadmap

Chirui Reader is now focused exclusively on a **native Kotlin/Jetpack Compose application** that recreates the full Kotatsu
experience using the assets from your Kotatsu forks. The legacy web/PWA remains in maintenance mode only for reference.

_Last updated: 2025-11-25 18:24 UTC._

## Kotatsu asset inclusion (from all forks)
Use assets from **every Kotatsu fork** you maintain:

- `github.com/swolem12/Kotatsu`
- `github.com/swolem12/kotatsu-parsers`
- `github.com/swolem12/kotatsu-syncserver`
- `github.com/swolem12/kotatsuwebsite`
- `github.com/swolem12/kotatsu-dl`
- `github.com/swolem12/kotatsu-dl-gui`

Place them in the Android project as follows:

- **Branding & launcher**: App icons, adaptive icons, feature graphics, splash/launch screens → `android/app/src/main/res/mipmap*`
  and `res/drawable*`. Preserve Kotatsu palette, gradients, and accent colors.
- **Reader UI assets**: Page-turn arrows, gesture hints, page slider thumbs, scrollbar indicators, reading mode icons →
  `res/drawable` or `res/drawable-anydpi` as VectorDrawables (convert SVGs if needed).
- **Catalog & library assets**: Placeholder covers, empty-state illustrations, badges, source/service logos (from parser forks),
  and tag chips → `res/drawable` and `res/values/strings.xml` for labels.
- **Typography & colors**: Import Kotatsu’s font files (if licensed) or map to equivalent Google Fonts; define the palette in
  `res/values/colors.xml` and expose them through the Compose theme.
- **Internationalization**: Reuse Kotatsu string resources from each fork (menu labels, actions, errors) and place them in
  `res/values/strings.xml` (and locale-specific `values-xx/`).
- **Data fixtures**: Sample sources/parsers metadata (icons, names) for offline demo state → place JSON/Proto fixtures under
  `app/src/main/assets/` for bootstrapping before networking is wired.

Track imported assets via `docs/KOTATSU_ASSET_MANIFEST.md` and keep checksums so updates from forks can be re-synced.

## Full operational TODO (Android-first)
A consolidated, end-to-end checklist to take the native app from scaffold to operational parity with Kotatsu.

### Phase 0 — Asset ingestion & build plumbing
- [ ] Mirror assets from all Kotatsu forks into the Android `res/` and `assets/` directories (see asset manifest).
- [ ] Set up Gradle tasks to validate missing drawables/strings against the manifest.
- [ ] Add baseline tests (unit + screenshot) to catch asset regressions.

### Phase 1 — Platform foundation
- [x] Initialize Android Studio project with Compose + Material3 scaffold.
- [x] Apply Kotatsu color system, typography, and shape tokens to the Compose theme.
- [x] Introduce DI (Hilt) and module structure (app, domain, data, parsers/extensions).
- [x] Configure Room/Datastore, Retrofit/OkHttp, and coroutine dispatchers.
- [x] Wire navigation (Navigation Compose) with root destinations (Home, Catalog, Reader, Library, Settings, Downloads).

### Phase 2 — Catalog & sources
- [ ] Import source metadata (name, icon, language, NSFW flags) from all parser forks into `assets/`.
- [x] Implement source list UI with enable/disable, language filters, and pinned sources.
- [x] Add catalog browsing with pagination, filters, and search tied to sources.
- [x] Build manga detail screen (metadata, tags, chapters, actions) with source-aware fetching (fixtures for now).
- [ ] Implement source extension management (install/update/remove) mirroring Kotatsu behavior.

### Phase 3 — Reader core
- [x] Seed reader route with Compose pager + slider using bundled Kotatsu-inspired chapter fixtures.
- [ ] Implement image pipeline (network fetch, disk cache, prefetch) with retry/backoff.
- [ ] Reading modes: single page, double page, webtoon/vertical scroll, with per-manga defaults.
- [ ] Controls: brightness, orientation lock, zoom/pan, page slider, gestures (tap, swipe, volume keys).
- [ ] Chapter navigation: previous/next, jump to page, auto next-chapter, and progress persistence.
- [ ] Offline pages: save-on-open and explicit download for chapters/pages.

### Phase 4 — Library, history, and tracking
- [ ] Library shelves/categories with sort (title, last read, date added) and bulk actions.
- [ ] Favorites/bookmarks with pinned state and quick filters.
- [ ] Reading history with resume, clear, and per-source scoping.
- [ ] External trackers: integrate AniList/MyAnimeList/Kitsu/Shikimori with two-way status sync.

### Phase 5 — Downloads & filesystem
- [ ] End-to-end download manager (queue, pause/resume, retries) with notifications and constraints. _(Skeleton UI + fixture queue wired; worker + notification plumbing pending.)_
- [ ] CBZ/CBR/ZIP/EPUB importer with media scanning and cover extraction.
- [ ] Storage/quota UI with delete, move, and “optimize storage” actions.

### Phase 6 — Account, backup, and sync
- [ ] Optional account sign-in for cloud backup/sync of library, history, and settings.
- [ ] Local backup/restore (Room export + assets + preferences) with encryption option.
- [ ] Migration path from web/PWA data (IndexedDB/localStorage export → Room import tool).

### Phase 7 — UX polish and release readiness
- [ ] Material You dynamic color, edge-to-edge, motion/easing parity with Kotatsu.
- [ ] Accessibility: TalkBack labels, large text, contrast, and gesture alternatives.
- [ ] Crash/error surfaces, empty/zero states using imported illustrations.
- [ ] QA on phones/tablets, wide screens, and low-memory devices; fix ANRs and jank.
- [ ] App bundles/APK signing pipeline, GitHub Releases, and F-Droid build.
- [ ] Store listings: feature graphics, screenshots (built from imported assets), and changelog cadence.

## Maintenance of the legacy web/PWA (reference only)
The web PWA remains available for demos but receives no new feature work. Keep it functional (bug/security fixes only) until the
Android app reaches parity and replaces it for end users.
