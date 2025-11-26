# Chirui Reader - Download Page

This directory contains the download page for the Chirui Reader Android app, deployed at **https://swolem12.github.io/Chirui-Reader/**

## What's Here

This directory now contains **only** the download page files:

- **index.html** - One-click download page for the Android app
- **404.html** - Error page for invalid URLs
- **icons/** - App logo and branding assets
- **robots.txt** - Search engine directives
- **README.md** - This file

## What Was Removed

The old webapp files have been removed to keep the GitHub Pages site focused on just the download page:

- ❌ Old webapp source code (`src/` directory)
- ❌ PWA service worker (`service-worker.js`)
- ❌ PWA manifest (`manifest.json`)
- ❌ Legacy documentation (`docs/` directory)
- ❌ Duplicate download page (`download.html`)

## Live Site

Visit **https://swolem12.github.io/Chirui-Reader/** to download the Android app.

The page provides:
- One-click APK download
- Automatic latest version detection
- Installation instructions
- App features and requirements

## For Developers

The download page automatically fetches the latest release from GitHub API and updates the download link accordingly.

When you create a new release (via git tag), the download page will automatically show the latest version.
