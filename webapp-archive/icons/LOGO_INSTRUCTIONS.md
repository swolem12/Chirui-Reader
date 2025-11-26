# Logo Setup Instructions

## Your Logo File

You mentioned the logo file: `file_00000000dcdc7206ae9991f3ecf2c5db (1).png`

## Where to Place It

1. Rename the file to: **`chirui-reader-logo.png`**
2. Place it in the `icons/` directory

```
Chirui-Reader/
├── icons/
│   └── chirui-reader-logo.png  ← Place your logo here
├── src/
├── index.html
└── ...
```

## What the Logo is Used For

- **App header** - Displayed next to "Chirui Reader" title
- **Browser tab favicon** - Icon shown in browser tabs
- **PWA icon** - When users "install" the app to their home screen
- **Manifest** - Defined in `manifest.json` for Progressive Web App

## Recommended Logo Specifications

- **Format**: PNG with transparency
- **Sizes**: Ideally 512x512px (will be scaled down as needed)
- **Style**: Should look good at small sizes (32px-64px)

## After Adding the Logo

The logo will automatically appear in:
1. The header of the web app
2. Browser tab icon
3. PWA install prompt
4. Home screen icon (when installed as PWA)

If the logo file isn't found, the app will still work - it just won't show the logo image.
