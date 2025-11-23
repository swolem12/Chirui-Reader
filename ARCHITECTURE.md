# Chirui Reader - Architecture Documentation

## Project Overview

**Chirui Reader is NOT an SDK** - it is a **manga/manhwa reader web application** designed to be deployed to GitHub Pages as a Progressive Web App (PWA).

## What This Project Actually Is

This repository contains:
- A **web-based manga reader application** (end-user application)
- HTML/CSS/JavaScript frontend for reading manga
- Future plans for an Android native app (separate project phase)

## What This Project Is NOT

This project does **NOT** include:
- An SDK (Software Development Kit)
- A converter to turn builds into an SDK
- A library or framework for other developers to use
- Tools for generating SDKs from the codebase

## Architecture Overview

### Current Phase: Web Application (GitHub Pages)

```
┌─────────────────────────────────────────────┐
│         Chirui Reader Web App               │
│                                             │
│  ┌──────────────┐      ┌─────────────┐    │
│  │   Frontend   │      │   Service   │    │
│  │  (HTML/CSS)  │◄────►│   Worker    │    │
│  │      +       │      │   (PWA)     │    │
│  │  JavaScript  │      └─────────────┘    │
│  └──────────────┘                          │
│         │                                  │
│         ▼                                  │
│  ┌──────────────┐                          │
│  │  Manga APIs  │                          │
│  │  (MangaDex,  │                          │
│  │   etc.)      │                          │
│  └──────────────┘                          │
└─────────────────────────────────────────────┘
                │
                ▼
        GitHub Pages Hosting
```

### Build and Deployment Process

1. **Development**: Write HTML, CSS, and JavaScript code
2. **Testing**: Test locally by opening `index.html` in a browser
3. **Commit**: Push changes to the repository
4. **Deploy**: GitHub Pages automatically serves the static files
5. **Access**: Users visit the GitHub Pages URL to use the app

**There is NO conversion to SDK** - the files are served directly as-is to users' browsers.

## Technology Stack

### Phase 1: Web Application
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Vanilla JS or lightweight framework (Alpine.js/Petite Vue)
- **UI**: Material Design Components
- **Storage**: localStorage, IndexedDB
- **PWA**: Service Workers (Workbox)
- **Hosting**: GitHub Pages (static file hosting)

### Phase 3: Android Application (Future)
When the Android phase begins, it will be a **separate native application**, not an SDK:
- **Language**: Kotlin
- **Architecture**: MVVM, Clean Architecture
- **UI**: Jetpack Compose / Material You

The Android app will be a **standalone application**, not a library or SDK.

## Common Misconceptions Addressed

### "How does the converter work to turn what we build here into an SDK?"

**Answer**: There is no converter, and nothing is turned into an SDK. This is a misunderstanding of the project:

1. **What we build**: A manga reader web application
2. **What it becomes**: A deployed web application on GitHub Pages
3. **What it does NOT become**: An SDK

### "Isn't this for other developers to use?"

**No**. This is an **end-user application** for reading manga, not a development library for other programmers to integrate.

### "What about the Android version?"

The Android version (Phase 3) will also be an **end-user application**, not an SDK. It will be a native Android app that users install to read manga.

## How GitHub Pages Deployment Works

GitHub Pages is a **static site hosting service**:

1. You commit HTML/CSS/JS files to the repository
2. GitHub Pages serves these files directly to users
3. Users' browsers download and run the JavaScript
4. No build process, compilation, or conversion needed for basic deployment

For more advanced setups, you might use:
- **Build tools** (Vite, Parcel) to bundle/optimize JavaScript
- **Service Workers** to enable offline functionality
- **Manifest files** to make it a Progressive Web App

But even with these tools, the output is still a **web application**, not an SDK.

## Project Structure

```
Chirui-Reader/
├── index.html              # Main entry point
├── src/                    # Source files (when created)
│   ├── app.js             # Main application logic
│   ├── styles.css         # Stylesheets
│   └── components/        # UI components
├── manifest.json          # PWA manifest (when created)
├── service-worker.js      # Service worker for offline support (when created)
├── README.md              # Project description
├── CHIRUI_ROADMAP.md      # Development roadmap
└── ARCHITECTURE.md        # This file

No SDK conversion tools or library packaging is involved.
```

## Frequently Asked Questions

### Q: Why did I think this was an SDK?
A: You may have confused this project with:
- An SDK project from another repository
- A framework or library project
- Android SDK development (Phase 3 uses Android SDK, but doesn't create one)

### Q: Will this ever become an SDK?
A: No, the project goal is to create end-user applications (web and Android) for reading manga, not to provide an SDK for other developers.

### Q: How do I contribute?
A: Follow the CHIRUI_ROADMAP.md to see what features need implementation. Contributions are for building the manga reader application itself.

### Q: What if I want to use this code in my own project?
A: The code is open source (check the license), so you can fork and modify it. But there's no formal SDK or library distribution - you'd need to copy and adapt the code yourself.

## Summary

**Chirui Reader** = Manga reader web app for end users, not an SDK for developers.

**Deployment** = Push to GitHub → GitHub Pages hosts it → Users access via browser.

**No converter exists** because none is needed - it's a straightforward web application.
