# Installing Chirui Reader on Your Phone

This guide explains how to build and install the Chirui Reader Android app on your phone.

## Quick Install (For Users)

### Option 1: Download Pre-built APK (Coming Soon)
Once available, APK releases will be published at:
- GitHub Releases: https://github.com/swolem12/Chirui-Reader/releases
- Latest build artifacts from CI/CD

### Option 2: Build and Install Yourself

**Prerequisites:**
- Android phone with USB debugging enabled
- USB cable to connect phone to computer
- Computer with:
  - JDK 17 installed
  - Git installed
  - (Optional) Android SDK/ADB tools for command-line installation
  - (Optional) Android Studio for easier development

**Steps:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/swolem12/Chirui-Reader.git
   cd Chirui-Reader/android
   ```

2. **Build the APK**
   ```bash
   # Make sure you're in the android/ directory
   # Build debug APK (recommended for testing)
   ./gradlew assembleDebug
   
   # Or build release APK
   ./gradlew assembleRelease
   ```

3. **Find the APK**
   - Debug APK: `app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `app/build/outputs/apk/release/app-release.apk`

4. **Install on your phone**
   
   **Method A: Using ADB (Recommended - requires Android SDK/ADB tools)**
   ```bash
   # Make sure phone is connected and USB debugging is enabled
   # Make sure you're in the android/ directory
   ./gradlew installDebug
   
   # Or manually with adb (if gradlew doesn't work)
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```
   
   **Method B: Manual Installation (No ADB needed)**
   1. Copy the APK file from `app/build/outputs/apk/debug/app-debug.apk` to your phone
   2. On your phone, open the file manager
   3. Navigate to the APK file and tap on it
   4. Allow installation from unknown sources if prompted
   5. Tap "Install"

## Enabling USB Debugging on Your Phone

1. Go to **Settings > About Phone**
2. Tap **Build Number** 7 times to enable Developer Options
3. Go back to **Settings > Developer Options**
4. Enable **USB Debugging**
5. Connect your phone to computer via USB
6. Accept the debugging prompt on your phone

## Installing from Unknown Sources

Since this isn't from the Google Play Store, you'll need to allow installation:

**Android 8.0+:**
1. When prompted, tap "Settings"
2. Enable "Allow from this source"
3. Go back and tap "Install"

**Android 7 and earlier:**
1. Go to **Settings > Security**
2. Enable **Unknown Sources**
3. Install the APK

## Build Variants

### Debug Build (`app-debug.apk`)
- **Use for**: Testing and development
- **App ID**: `com.chirui.reader.debug`
- **Signing**: Debug keystore (included in repo)
- **Features**: 
  - Logging enabled
  - Can be installed alongside release version
  - Easier to debug

### Release Build (`app-release.apk`)
- **Use for**: Daily use
- **App ID**: `com.chirui.reader`
- **Signing**: Debug keystore (for now)
- **Features**:
  - Production-ready
  - Better performance

## Uninstalling

To uninstall the app:
1. Go to **Settings > Apps**
2. Find **Chirui Reader**
3. Tap **Uninstall**

Or via ADB:
```bash
adb uninstall com.chirui.reader        # Release version
adb uninstall com.chirui.reader.debug  # Debug version
```

## Troubleshooting

### "App not installed" error
- Make sure you have enough storage space
- Try uninstalling any previous version first
- Check that installation from unknown sources is enabled

### "Parse error" or "There was a problem parsing the package"
- Your phone's Android version might be too old (requires Android 7.0+)
- The APK file might be corrupted - try downloading/building again

### ADB doesn't recognize device
- Make sure USB debugging is enabled
- Try a different USB cable
- Install phone manufacturer's USB drivers on your computer
- Check connection with: `adb devices`

### Build fails with network errors
- Requires internet connection to download dependencies
- Check firewall/proxy settings
- See [BUILD_GUIDE.md](BUILD_GUIDE.md) for more troubleshooting

## Updating the App

To update to a newer version:
1. Build the new APK
2. Install it directly over the old version
3. Your data will be preserved

## For Developers

See also:
- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Comprehensive build instructions
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [README.md](README.md) - Project overview

## Security Note

**Debug Keystore**: The current release builds are signed with a debug keystore (included in the repository) for easy testing. For production releases, this should be replaced with a proper release keystore that is kept secure and private.

---

**Need help?** Open an issue at https://github.com/swolem12/Chirui-Reader/issues
