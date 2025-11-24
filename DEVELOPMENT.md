# Chirui Reader Development Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/swolem12/Chirui-Reader.git
   cd Chirui-Reader
   ```

2. **Add your logo**
   - Rename your logo file to `chirui-reader-logo.png`
   - Place it in the `icons/` directory

3. **Open the app**
   - Simply open `index.html` in your browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```
   - Visit `http://localhost:8000`

## Project Structure

```
Chirui-Reader/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── src/
│   ├── app.js             # Main JavaScript application
│   └── styles.css         # Material Design styles
├── icons/
│   └── chirui-reader-logo.png  # Your logo (to be added)
├── docs/                   # Documentation
└── README.md
```

## Features Implemented (Milestone 1.1)

- ✅ Material Design 3 UI
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Dark/light theme toggle
- ✅ Header with navigation
- ✅ Sidebar library view
- ✅ PWA support (installable)
- ✅ Service worker (offline capable)
- ✅ Basic routing structure

## Next Steps

See `CHIRUI_ROADMAP.md` for the complete development plan.

**Upcoming Milestones:**
- Milestone 1.2: Manga catalog & search
- Milestone 1.3: Manga reader core
- Milestone 1.4: MangaDex API integration
- Milestone 1.5: Favorites & history

## Development

No build step required for basic development. Just edit the files and refresh your browser.

### Theme Toggle
The theme toggle button in the header switches between light and dark modes. Preference is saved in localStorage.

### PWA Installation
When served over HTTPS (or localhost), browsers will show an "Install App" prompt. The app can then be installed to your device's home screen.

## Deployment to GitHub Pages

### Automatic Deployment

This repository includes a GitHub Actions workflow that automatically deploys the app to GitHub Pages on every push to the `main` branch.

**Setup Steps:**

1. **Enable GitHub Pages** in repository settings:
   - Go to Settings > Pages
   - Under "Build and deployment", select "Source: GitHub Actions"

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Access your app**:
   - Visit: `https://swolem12.github.io/Chirui-Reader/`
   - The app will be live and installable as a PWA!

### Manual Deployment

If you prefer manual deployment:

1. **Enable GitHub Pages** in repository settings
2. **Select source**: `main` branch, `/` (root) directory  
3. **Visit**: `https://swolem12.github.io/Chirui-Reader/`

The app will be live and installable as a PWA!

## Contributing

See `CHIRUI_ROADMAP.md` for planned features and milestones.
