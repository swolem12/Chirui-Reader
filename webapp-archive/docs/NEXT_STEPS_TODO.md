# Native Kotatsu Build — Next Approval TODO
_Last updated: 2025-11-25 18:24 UTC._

A concise checklist of the next implementation steps for the Android app so you can approve milestones quickly. These tasks build on the current Compose shell and theme, and they reference all supplied Kotatsu forks:

- `github.com/swolem12/Kotatsu`
- `github.com/swolem12/kotatsu-parsers`
- `github.com/swolem12/kotatsu-syncserver`
- `github.com/swolem12/kotatsuwebsite`
- `github.com/swolem12/kotatsu-dl`
- `github.com/swolem12/kotatsu-dl-gui`

## Immediate (Sprint 1)
- [ ] **Asset import pass**: ingest icons/illustrations/strings from every fork into `android/app/src/main/res` and `assets/`, updating `docs/KOTATSU_ASSET_MANIFEST.md` with paths and checksums.
- [x] **Dependency wiring**: add Hilt DI, coroutine dispatchers, Retrofit/OkHttp core, and Room/Datastore baseline modules; split into `app`, `domain`, `data`, and `parsers` modules for clean boundaries.
- [x] **Source registry scaffold**: load parser/source metadata from `kotatsu-parsers` JSON/fixtures into `assets/` and surface a basic source list screen with enable/disable toggles and language filters.
- [x] **Navigation polish**: hook bottom navigation destinations to dedicated `NavHost` routes and stub top app bars per section (Home, Catalog, Library, Downloads, Settings).

## Near-term (Sprint 2)
- [x] **Catalog grid**: query sources for paginated listings, render cards with cover, title, language, NSFW flag, and lazy paging; add filters (genre, status, sort) and search that fans out to enabled sources.
- [x] **Manga detail**: fetch metadata/chapters from sources; implement actions (favorite, download, open reader, share) and chapter list with badges for downloaded/partially read.
- [x] **Reader foundation**: ship a bundled fixture-backed reader route with swipe/slider navigation for Kotatsu chapters; upgrade later with caching/prefetch modes.
- [x] **Downloads skeleton**: create a download queue UI, background worker setup, and notifications using assets from `kotatsu-dl`/`kotatsu-dl-gui` (icons, status glyphs).

## Mid-term (Sprint 3)
- [ ] **Library & history**: add shelves/categories, sort options, and favorites; persist history with resume; support bulk actions and pinned items.
- [ ] **Offline & import**: implement save-on-open and explicit chapter downloads; add CBZ/CBR/ZIP/EPUB import with cover extraction and media scanning.
- [ ] **Tracking services**: integrate AniList/MyAnimeList/Kitsu/Shikimori with two-way sync, background update workers, and error surfaces.

## Finalization (Sprint 4)
- [ ] **Backup & sync**: optional account sign-in tied to `kotatsu-syncserver` for cloud backup; local encrypted export/import; migration tool for legacy web/PWA data.
- [ ] **Polish & release**: Material You/dynamic color, accessibility passes, crash/empty states using imported illustrations; Play/F-Droid release pipeline, store listings, and automated screenshots.

## How to use this list
- Use it as the approval gate for each sprint: check off items once merged.
- Keep `docs/KOTATSU_ASSET_MANIFEST.md` updated whenever assets from any fork are imported or changed.
- Align commits/PRs to the smallest bullet that still delivers a user-visible milestone.
