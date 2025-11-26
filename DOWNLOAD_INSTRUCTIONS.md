# 📥 How to Download and Install Chirui Reader

## ⚠️ Current Status

**The existing "Beta" release does not have APK files attached yet.** 

This document explains your options for getting the Chirui Reader APK.

---

## 🎯 Option 1: Wait for the Next Proper Release (Recommended for Users)

The easiest option is to wait for the maintainer to create a proper release with APK files. When a release is created with a tag starting with `v` (like `v0.1.0`), the build system automatically:
1. Builds the APK files
2. Attaches them to the release
3. Makes them available for download

**To track when this is available:**
- Watch the [Releases page](https://github.com/swolem12/Chirui-Reader/releases)
- The download page at [swolem12.github.io/Chirui-Reader](https://swolem12.github.io/Chirui-Reader/) will automatically update

---

## 🛠️ Option 2: Build It Yourself (For Developers)

If you don't want to wait, you can build the APK yourself from source code.

### Prerequisites
- Computer with Java 17 installed
- Git installed
- ~2 GB free disk space
- Internet connection (for downloading dependencies)

### Quick Build Steps

```bash
# 1. Clone the repository
git clone https://github.com/swolem12/Chirui-Reader.git
cd Chirui-Reader/android

# 2. Build the APK (takes 5-10 minutes on first run)
./gradlew assembleDebug

# 3. Find your APK
# It will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Installing the APK on Your Phone

**Option A: Using ADB (if you have Android SDK installed)**
```bash
# Connect your phone via USB with USB debugging enabled
./gradlew installDebug
```

**Option B: Manual Installation**
1. Copy `app/build/outputs/apk/debug/app-debug.apk` to your phone
2. On your phone, tap the APK file
3. Allow installation from unknown sources if prompted
4. Tap "Install"

### Detailed Build Instructions
See [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md) for comprehensive build instructions, troubleshooting, and requirements.

---

## 🤖 Option 3: Trigger an Automated Build (For Maintainers Only)

If you're a maintainer with write access to the repository, you can trigger the release workflow manually:

### Method A: Create a New Release with Proper Tagging

1. Go to [Releases page](https://github.com/swolem12/Chirui-Reader/releases)
2. Click "Draft a new release"
3. Create a tag starting with `v` (e.g., `v0.1.0`)
4. Fill in release details
5. Click "Publish release"
6. Wait 5-10 minutes for the workflow to build and attach APKs

### Method B: Manually Trigger the Workflow

1. Go to [Actions tab](https://github.com/swolem12/Chirui-Reader/actions)
2. Click "Release APK" in the left sidebar
3. Click "Run workflow"
4. Enter a version tag (e.g., `v0.1.0`)
5. Click "Run workflow"
6. Wait for the workflow to complete and create the release

See [CREATE_FIRST_RELEASE.md](CREATE_FIRST_RELEASE.md) for detailed step-by-step instructions.

---

## ❓ Why Are There No APK Files on the "Beta" Release?

The "Beta" release was created manually without APK files. The automated build system only runs when:
- A release tag starting with `v` is created (e.g., `v0.1.0`)
- OR the workflow is manually triggered

The "Beta" tag doesn't match the `v*` pattern, so the automated build didn't run.

### What Should Happen for Future Releases?

For all future releases, follow these guidelines:
1. Use version tags starting with `v` (e.g., `v0.1.0`, `v0.2.0`, `v1.0.0`)
2. Follow [Semantic Versioning](https://semver.org/)
3. The workflow will automatically build and attach APK files
4. Users will be able to download APKs immediately

See [RELEASE_GUIDE.md](RELEASE_GUIDE.md) for complete release management guidelines.

---

## 📱 System Requirements

- **Android Version**: 7.0 (Nougat) or higher
- **Storage**: ~50 MB
- **Internet**: Required for browsing and downloading manga

---

## 🔒 Security Note

Since Chirui Reader is not on the Google Play Store, you'll need to enable "Install from unknown sources" on your Android device. The APK is built from open source code and is safe to install.

**To enable installation:**
- **Android 8.0+**: Tap "Settings" when prompted → Enable "Allow from this source"
- **Android 7 and earlier**: Settings → Security → Enable "Unknown Sources"

---

## 🆘 Need Help?

- **Build Issues**: See [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md)
- **Installation Issues**: See [android/INSTALL.md](android/INSTALL.md)
- **Other Questions**: Open an issue at [GitHub Issues](https://github.com/swolem12/Chirui-Reader/issues)

---

## 📚 Related Documentation

- [CREATE_FIRST_RELEASE.md](CREATE_FIRST_RELEASE.md) - Quick guide for maintainers to create first release
- [RELEASE_GUIDE.md](RELEASE_GUIDE.md) - Comprehensive release management guide
- [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md) - Detailed build instructions
- [android/INSTALL.md](android/INSTALL.md) - Installation guide
- [README.md](README.md) - Project overview
