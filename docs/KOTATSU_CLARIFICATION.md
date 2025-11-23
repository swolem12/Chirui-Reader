# Kotatsu Clarification: No PWA Conversion Tool

## The Misconception

**You said:** "Kotatsu clearly has a tool that turns it into a PWA every time they create an update."

**Reality:** This is incorrect. Kotatsu does NOT have a tool that converts their Android app to PWA.

## What Kotatsu Actually Has

Kotatsu maintains **TWO COMPLETELY SEPARATE PROJECTS**:

### 1. Kotatsu Android App
- **Repository:** [github.com/KotatsuApp/Kotatsu](https://github.com/KotatsuApp/Kotatsu)
- **Type:** Native Android application
- **Language:** Kotlin
- **Distribution:** APK files via GitHub Releases
- **NOT a PWA**

### 2. Kotatsu Website (Documentation)
- **Repository:** [github.com/KotatsuApp/website](https://github.com/KotatsuApp/website)  
- **Type:** Static documentation/marketing website
- **Technology:** VitePress (Vue-based static site generator)
- **Distribution:** Deployed to GitHub Pages
- **NOT the app** - just documentation with download links

## The Workflow You Saw

The `trigger-site-deploy.yml` workflow does this:

```
Android App Release Published
         ↓
Triggers website repository
         ↓
Website rebuilds with new version info
         ↓
Documentation updated on GitHub Pages
```

**It does NOT:**
- ❌ Convert Android app to PWA
- ❌ Transform Kotlin code to JavaScript
- ❌ Make the app run in browsers

**It DOES:**
- ✅ Update the documentation website
- ✅ Show new version number on the website
- ✅ Update download links to point to new APK

## Visual Representation

```
┌────────────────────────────────────────────────┐
│  Kotatsu Android App Repository                │
│  (KotatsuApp/Kotatsu)                          │
│                                                │
│  Kotlin → APK → GitHub Releases                │
│                                                │
│  When release is published:                    │
│    ↓                                           │
│  Trigger signal sent to website repo           │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│  Kotatsu Website Repository                    │
│  (KotatsuApp/website)                          │
│                                                │
│  VitePress/Vue → HTML/CSS/JS → GitHub Pages    │
│                                                │
│  Receives trigger:                             │
│    ↓                                           │
│  Rebuilds documentation                        │
│    ↓                                           │
│  Updates version number                        │
│    ↓                                           │
│  Redeploys to kotatsu.app                      │
└────────────────────────────────────────────────┘
```

## No Conversion Happens

The Android app remains an Android app (APK).
The website remains a website (HTML/CSS/JS).
They never merge or convert between each other.

## What This Means for Chirui Reader

For Chirui Reader, you have two options:

### Option 1: Web App Only (Current Phase 1 Plan)
- Build as HTML/CSS/JavaScript
- Add PWA features (manifest.json, service worker)
- Deploy to GitHub Pages
- Users visit URL and can "install" as PWA
- No Android APK involved

### Option 2: Both Web and Android (Phase 1 + Phase 3)
- **Phase 1:** Web app with PWA (GitHub Pages)
- **Phase 3:** Separate Android app in Kotlin (GitHub Releases)
- These would be TWO different projects (like Kotatsu)
- NO conversion between them

## Summary

**There is no tool that converts Kotatsu's Android app to PWA.**

Kotatsu has:
- Android app = APK files on GitHub Releases
- Documentation website = Static site on GitHub Pages

These are maintained separately and never convert between each other.

For Chirui Reader, just implement PWA features directly in your web app. No conversion tool needed.

## See Also

- [DISTRIBUTION.md](DISTRIBUTION.md) - Full guide on distribution methods
- [PWA_QUICK_START.md](PWA_QUICK_START.md) - How to implement PWA
