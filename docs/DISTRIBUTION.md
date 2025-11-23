# Distribution Methods: Web Apps vs Native Apps

## Understanding Kotatsu's Distribution Method

**Kotatsu is a native Android app**, not a web application. They distributed it differently from how this web-based Chirui Reader project works.

## How Kotatsu Distributed Their Android App

### Method: GitHub Releases + APK Downloads

Kotatsu made their Android app downloadable through URLs by:

1. **Building the Android app** → Creates an `.apk` file (Android Package)
2. **Creating GitHub Releases** → Upload the `.apk` to GitHub Releases
3. **Users download the APK** → Direct download link from GitHub
4. **Manual installation** → Users install the APK on their Android devices ("sideloading")

```
┌─────────────────────────────────────────────┐
│         Kotatsu (Android App)               │
│                                             │
│  Kotlin Code → Gradle Build → APK File     │
│                                             │
│  APK uploaded to GitHub Releases            │
│                      ↓                      │
│  User clicks download URL                   │
│                      ↓                      │
│  APK downloads to Android device            │
│                      ↓                      │
│  User installs APK manually                 │
└─────────────────────────────────────────────┘
```

**This is NOT PWA** - it's traditional Android app distribution.

## How Chirui Reader (This Project) Will Distribute

This project is a **web application**, not an Android app, so distribution is completely different:

### Method: Progressive Web App (PWA) on GitHub Pages

```
┌─────────────────────────────────────────────┐
│      Chirui Reader (Web App/PWA)            │
│                                             │
│  HTML/CSS/JS → GitHub Pages → Live URL     │
│                                             │
│  User visits URL in browser                 │
│                      ↓                      │
│  Browser loads web app                      │
│                      ↓                      │
│  Optional: "Install" button (PWA)           │
│                      ↓                      │
│  App icon added to home screen              │
└─────────────────────────────────────────────┘
```

**This IS PWA** - Progressive Web App technology.

## Key Differences

| Aspect | Kotatsu (Android App) | Chirui Reader (Web/PWA) |
|--------|----------------------|-------------------------|
| **Technology** | Kotlin, Android SDK | HTML, CSS, JavaScript |
| **Build Output** | `.apk` file | Static web files |
| **Distribution** | GitHub Releases, F-Droid | GitHub Pages URL |
| **Installation** | Manual APK install | Visit URL or "install" PWA |
| **Download Size** | ~20-50 MB APK | No download (runs in browser) |
| **Updates** | Manual APK update | Automatic (reload page) |
| **Offline** | Native offline support | PWA Service Workers |
| **Platform** | Android only | Any platform with browser |

## PWA vs Native App Distribution

### What is PWA (Progressive Web App)?

A PWA is a **web application** that can:
- Work offline (using Service Workers)
- Be "installed" to home screen
- Send notifications
- Act like a native app

**BUT**: It's still a web app running in a browser, not a true native app.

### PWA Installation Process (for Chirui Reader)

1. User visits your GitHub Pages URL (e.g., `https://yourusername.github.io/Chirui-Reader/`)
2. Browser detects it's a PWA (via `manifest.json` + Service Worker)
3. Browser shows "Install App" prompt
4. User clicks "Install"
5. App icon appears on home screen
6. Opens in browser window (without URL bar)

**No APK download needed!**

### Native App Distribution (like Kotatsu)

1. Developer builds Android app → `.apk` file
2. Upload APK to:
   - GitHub Releases (free)
   - F-Droid (open-source store)
   - Google Play Store (requires fee + review)
3. User downloads APK from URL
4. User manually installs APK
5. True native Android app

## What Should Chirui Reader Use?

Based on your roadmap, you'll use **BOTH** methods:

### Phase 1: Web App with PWA (Current)
- Deploy to GitHub Pages
- Add PWA features (manifest.json, service worker)
- Users visit URL and optionally "install" as PWA
- **No APK needed**

### Phase 3: Native Android App (Future)
- Build actual Android app in Kotlin
- Distribute via GitHub Releases (like Kotatsu did)
- Users download and install APK
- **True native app**

## PWA Files You'll Need (Phase 1)

To make Chirui Reader a downloadable PWA like you're asking:

1. **manifest.json** - Defines app metadata, icons, colors
2. **service-worker.js** - Enables offline functionality
3. **App icons** - Various sizes for different devices
4. **index.html** - Must reference manifest

### Example manifest.json

```json
{
  "name": "Chirui Reader",
  "short_name": "Chirui",
  "description": "Manga reader for web",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Basics

```javascript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('chirui-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/app.js',
        '/src/styles.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Summary: Answering Your Question

> "So what did the kotatsu team do to turn their github app into a downloadable all through url? Was it the pwm or pwa stuff?"

**Answer:**

1. **Kotatsu used GitHub Releases for APK distribution** - NOT PWA
   - They built a native Android app
   - Uploaded `.apk` files to GitHub Releases
   - Users downloaded APK via direct URL
   - Users manually installed the APK

2. **PWA is different** - for web apps, not Android apps
   - PWA = Progressive Web App (web technology)
   - No APK files involved
   - Users visit a URL and can "install" from browser
   - Works on any device with a modern browser

3. **For Chirui Reader (this project):**
   - **Phase 1**: Use PWA for web app (GitHub Pages + manifest + service worker)
   - **Phase 3**: Use GitHub Releases for Android APK (like Kotatsu)

**You probably meant PWA, not "pwm"** - PWA stands for Progressive Web App.

## Next Steps for This Project

To make Chirui Reader downloadable as a PWA:

1. Create `manifest.json` file
2. Create `service-worker.js` file
3. Add app icons (192x192, 512x512)
4. Reference manifest in `index.html`
5. Deploy to GitHub Pages
6. Users can "install" from browser

**No converter needed** - just standard PWA files!
