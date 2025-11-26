# Chirui Reader - Web App Archive

This directory contains the archived Progressive Web App (PWA) version of Chirui Reader, which has been superseded by the native Android application.

## Status: Archived (Maintenance Only)

The web application is no longer actively developed. All new features and improvements are being made to the native Android application located in the `/android` directory.

## What's Archived

This archive contains:
- **Web Application**: HTML/JS/CSS PWA files
  - `index.html` - Main application entry point
  - `manifest.json` - PWA manifest
  - `service-worker.js` - Service worker for offline support
  - `404.html` - Error page
  - `src/` - Application source code (views, services, utilities)
  
- **Static Assets**:
  - `icons/` - Application icons and logos
  - `robots.txt` - Search engine directives

- **Documentation** (PWA-specific):
  - `docs/` - Original documentation for the web version

## Live Demo

The web app is still available at: **[https://swolem12.github.io/Chirui-Reader/](https://swolem12.github.io/Chirui-Reader/)**

It is deployed via GitHub Pages for demonstration purposes but receives no new feature development.

## Technology Stack (Archived Version)

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI**: Material Design 3
- **Storage**: localStorage for favorites and history
- **PWA**: Service Workers for offline support
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions (automatic)

## Why Archived?

The project has transitioned to a **native Kotlin Android application** to:
- Provide better performance and user experience
- Access native Android features
- Achieve feature parity with Kotatsu (the reference manga reader)
- Support offline reading and downloads more effectively
- Enable integration with Android system features (notifications, background sync, etc.)

## Migration Path

Users of the web version can export their data and migrate to the Android app:
1. Export favorites and reading history from the web app settings
2. Install the Android app from the `/android` directory
3. Import data into the Android app (migration tool coming soon)

## For Developers

### Running the Archived Web App Locally

If you need to run or test the archived web version:

```bash
cd webapp-archive
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` in your browser.

### Maintenance

The web app will receive:
- ✅ Security fixes (if critical vulnerabilities are found)
- ✅ Bug fixes (if they affect deployment or basic functionality)
- ❌ No new features
- ❌ No UI/UX improvements
- ❌ No new source integrations

## Future Plans

Once the Android app reaches feature parity with the web version:
- The web app may be fully deprecated
- GitHub Pages deployment may be redirected to documentation only
- This archive will remain for historical reference

## See Also

- [/android](../android/) - Active native Android application
- [README.md](../README.md) - Main project README
- [CHIRUI_ROADMAP.md](../CHIRUI_ROADMAP.md) - Project roadmap
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall architecture

---

**Archived Date**: 2025-11-26  
**Last Active Version**: Pre-Android transition  
**Maintenance Mode**: Security and critical fixes only
