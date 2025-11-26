# Quick Reference: PWA Implementation for Chirui Reader

## What You Asked About

**Question 1:** "How does the converter work to turn what we build here into an SDK?"
- **Answer:** There is NO converter. This is a web app, not an SDK.

**Question 2:** "What did Kotatsu do to make their app downloadable through URL? Was it PWA?"
- **Answer:** Kotatsu distributed APK files via GitHub Releases (NOT PWA). For this web project, use PWA instead.

---

## PWA Implementation Checklist

To make Chirui Reader "installable" like you're asking, implement these PWA features:

### ✅ Step 1: Create manifest.json

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
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### ✅ Step 2: Link manifest in index.html

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1976d2">
```

### ✅ Step 3: Create service-worker.js

```javascript
const CACHE_NAME = 'chirui-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/app.js',
  '/src/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### ✅ Step 4: Register service worker in index.html

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    });
  }
</script>
```

### ✅ Step 5: Create app icons

Create PNG icons in these sizes:
- 192x192 pixels
- 512x512 pixels

Save them in `/icons/` directory.

### ✅ Step 6: Deploy to GitHub Pages

1. Push all files to GitHub
2. Enable GitHub Pages in repository settings
3. Select source: main branch, root directory
4. Visit your GitHub Pages URL

---

## Result

Once implemented, users can:

1. Visit your GitHub Pages URL
2. See "Install App" button in browser
3. Click install
4. App appears on home screen
5. Works offline (via service worker)

**No APK download needed!** This is how PWA works.

---

## Common Mistakes to Avoid

❌ **Don't create APK files for web apps** - that's for Android native apps only
❌ **Don't look for "converter" tools** - PWA uses standard web files
❌ **Don't confuse PWA with native apps** - they're different technologies

✅ **Do use PWA for web apps** - it enables "install" functionality
✅ **Do deploy to GitHub Pages** - free hosting for static sites
✅ **Do implement service workers** - enables offline functionality

---

## See Also

- [DISTRIBUTION.md](DISTRIBUTION.md) - Full comparison of PWA vs native apps
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Complete project architecture
- [FAQ.md](FAQ.md) - Frequently asked questions
