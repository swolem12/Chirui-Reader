# Kotatsu Asset Manifest for Chirui Reader

Use this manifest to ensure **every asset from your Kotatsu forks** is imported into the native Android project. Keep it updated
as you sync from upstream Kotatsu and your forks. _Last updated: 2025-11-25 18:24 UTC._

## Forks to source from
- `github.com/swolem12/Kotatsu` (primary fork with app assets)
- `github.com/swolem12/kotatsu-parsers` (parser/source icons, metadata)
- `github.com/swolem12/kotatsu-syncserver` (sync service assets/config references)
- `github.com/swolem12/kotatsuwebsite` (marketing/branding collateral, copy)
- `github.com/swolem12/kotatsu-dl` (downloader UI assets, CLI references)
- `github.com/swolem12/kotatsu-dl-gui` (desktop GUI assets that may inform download flows)

## Asset categories and destinations

| Category | Examples to import | Android destination |
| --- | --- | --- |
| Branding & launcher | Adaptive icons (`ic_launcher.xml`), legacy PNGs, monochrome versions, feature graphic, splash/launch screens | `app/src/main/res/mipmap*`, `res/drawable*` |
| Palette & typography | Color tokens, gradients, elevation overlays, font files | `res/values/colors.xml`, `res/font`, Compose theme | 
| Reader UI | Mode toggles (single/double/webtoon), gestures, zoom/pan controls, page slider thumbs, scrollbar indicators | `res/drawable`, `res/drawable-anydpi` (VectorDrawable preferred) |
| Catalog & library | Placeholder covers, empty-state illustrations, badges, chips, rating icons | `res/drawable`, `res/raw` (Lottie/JSON) |
| Source extensions | Source logos/icons, language badges, NSFW markers, extension banners | `res/drawable`, `app/src/main/assets/sources/` (metadata) |
| Strings & i18n | Menu labels, actions, error strings, descriptions from all locales | `res/values/strings.xml`, locale-specific `values-xx/` |
| Fixtures & demos | Sample catalog entries, parser metadata, fake chapters/pages for offline demos | `app/src/main/assets/fixtures/` |
| Marketing | Screenshots, feature graphics, changelog templates, privacy text | `docs/marketing/` (for store collateral) |

## Sync checklist
- [ ] Pull the latest assets from each fork and drop them into the destinations above.
- [ ] Convert SVGs to VectorDrawable where possible; keep raster fallbacks for complex art.
- [ ] Deduplicate filenames and ensure densities (`mdpi`-`xxxhdpi`) are covered for PNGs.
- [ ] Verify all strings have keys and translations across locales you ship.
- [ ] Update Compose theme to reference imported color/typography tokens.
- [ ] Record hashes (e.g., SHA256) for critical assets in this manifest when added.

## Pending assets to list explicitly
Add rows here as you ingest assets so the manifest stays authoritative:

| Asset | Source fork/path | Destination | Notes | Hash |
| --- | --- | --- | --- | --- |
| _example_: `ic_launcher_adaptive.xml` | `swolem12/Kotatsu:app/src/main/res/mipmap-anydpi-v26/` | `android/app/src/main/res/mipmap-anydpi-v26/` | Adaptive icon | _(add)_ |
| _example_: `source_mangadex.svg` | `swolem12/kotatsu-parsers:assets/icons/` | `android/app/src/main/res/drawable-anydpi/` | Parser icon | _(add)_ |
| `sources.json` | `swolem12/kotatsu-parsers:assets/sources.json` (and other forks when updated) | `android/app/src/main/assets/sources/` | Bundled registry powering the source list screen; replace placeholder entries with full fork sync. | _(add)_ |
| `featured.json` | `swolem12/Kotatsu` and `swolem12/kotatsu-parsers` fixtures | `android/app/src/main/assets/catalog/` | Offline catalog feed for the Discover tab; swap in real covers/titles from forks. | _(add)_ |
| `details.json` | `swolem12/Kotatsu` fixtures and parser outputs | `android/app/src/main/assets/catalog/` | Bundled manga detail + chapter metadata for offline detail screen demos. | _(add)_ |
| `reader/chapters.json` | `swolem12/Kotatsu` chapter samples (or parser outputs) | `android/app/src/main/assets/reader/` | Fixture-backed reader pages for swipe/slider demo until the image pipeline is wired. | _(add)_ |
| `downloads/queue.json` | `swolem12/kotatsu-dl` + `swolem12/kotatsu-dl-gui` fixtures | `android/app/src/main/assets/downloads/` | Fixture download queue for the skeleton downloads screen (status icons/strings to follow). | _(add)_ |
