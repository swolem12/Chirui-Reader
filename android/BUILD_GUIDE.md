# Android Build Guide

This guide covers building the Chirui Reader Android application from source.

## Prerequisites

- **JDK 17**: The project requires Java 17 (OpenJDK or Oracle JDK)
- **Android SDK**: API level 34 (Android 14)
- **Gradle**: Included via wrapper (Gradle 8.5)
- **Internet Connection**: Required for downloading dependencies

## Building with Android Studio

### First Time Setup

1. Install Android Studio Hedgehog (2023.1.1) or later
2. Open Android Studio and select "Open an Existing Project"
3. Navigate to and select the `android/` directory
4. Android Studio will automatically:
   - Download required SDK components
   - Download Gradle dependencies
   - Index the project

### Building the App

1. **Debug Build**: 
   - Select "Build > Make Project" or press `Ctrl+F9` (Windows/Linux) or `⌘F9` (Mac)
   - Or use "Build > Build Bundle(s) / APK(s) > Build APK(s)"

2. **Release Build**:
   - Select "Build > Generate Signed Bundle / APK"
   - Follow the wizard to create or select a signing key

3. **Run on Device/Emulator**:
   - Click the "Run" button (green triangle) or press `Shift+F10`
   - Select your target device or emulator

## Building from Command Line

### Using the Gradle Wrapper (Recommended)

Navigate to the `android/` directory and use the included Gradle wrapper:

```bash
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing configuration)
./gradlew assembleRelease

# Build all variants
./gradlew build

# Clean build outputs
./gradlew clean

# Run unit tests
./gradlew test

# Run instrumented tests (requires connected device/emulator)
./gradlew connectedAndroidTest

# List all available tasks
./gradlew tasks
```

### Build Output Locations

- **Debug APK**: `app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `app/build/outputs/apk/release/app-release.apk`
- **Test Reports**: `app/build/reports/tests/`

## Project Modules

The Android app is organized into multiple Gradle modules:

- **app**: Main application module with UI and Compose screens
- **domain**: Business logic and domain models (platform-agnostic)
- **data**: Data layer with repositories, Room database, and network clients
- **parsers**: Parser registry and source extensions interface

## Common Build Issues

### Issue: "Plugin was not found"

**Symptom**: Error about Android Gradle Plugin not found

**Solution**: This typically happens when Google's Maven repository is inaccessible. The `build.gradle.kts` uses the `buildscript` block to resolve plugins from Google's Maven repository. Ensure you have:
- Internet connectivity
- Access to `https://dl.google.com/dl/android/maven2/`
- Proper proxy settings if behind a corporate firewall

### Issue: "SDK not found"

**Symptom**: Error about Android SDK location not set

**Solution**: 
1. Create or edit `local.properties` in the `android/` directory
2. Add the line: `sdk.dir=/path/to/your/android/sdk`
3. Or set the `ANDROID_HOME` environment variable

### Issue: Build fails with "Unsupported Java version"

**Symptom**: Error about Java version compatibility

**Solution**: This project requires JDK 17. Check your Java version:
```bash
java -version
```

If using a different version, either:
- Install JDK 17 and set `JAVA_HOME`
- Or in Android Studio: File > Project Structure > SDK Location > JDK Location

### Issue: Out of memory during build

**Symptom**: Build fails with OutOfMemoryError

**Solution**: Increase Gradle memory in `gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
```

### Issue: Dependencies fail to download

**Symptom**: Could not resolve dependencies

**Solution**:
1. Check internet connection
2. Clear Gradle cache: `./gradlew clean --refresh-dependencies`
3. Delete `.gradle` folder in project root and rebuild
4. Check if behind a proxy and configure in `gradle.properties`:
```properties
systemProp.http.proxyHost=proxy.company.com
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=proxy.company.com
systemProp.https.proxyPort=8080
```

## Dependencies

The project uses the following major dependencies:

- **Jetpack Compose**: Modern UI toolkit
- **Hilt**: Dependency injection
- **Room**: Local database
- **Retrofit + OkHttp**: Network client
- **Coroutines**: Asynchronous programming
- **Coil**: Image loading

See individual `build.gradle.kts` files for complete dependency lists.

## Build Configuration

### Version Information

- **compileSdk**: 34
- **minSdk**: 24 (Android 7.0 Nougat)
- **targetSdk**: 34 (Android 14)
- **Kotlin**: 1.9.24
- **Compose Compiler**: 1.5.11
- **AGP (Android Gradle Plugin)**: 8.5.0

### Build Variants

- **debug**: Includes debugging symbols, not optimized
  - Application ID: `com.chirui.reader.debug`
  - Version suffix: `-debug`
  - Minification: Disabled

- **release**: Optimized, ready for distribution
  - Application ID: `com.chirui.reader`
  - Minification: Disabled (configure ProGuard as needed)

## Continuous Integration

The project includes a GitHub Actions workflow (`.github/workflows/android-build.yml`) that automatically:
- Builds the app on push to main/develop branches
- Runs unit tests
- Uploads build artifacts

## Next Steps

After building successfully:
- Review the [Android README](README.md) for project structure
- See [NEXT_STEPS_TODO.md](../docs/NEXT_STEPS_TODO.md) for development roadmap
- Check [ARCHITECTURE.md](../ARCHITECTURE.md) for overall architecture

## Getting Help

If you encounter build issues not covered here:
1. Check the [repository issues](https://github.com/swolem12/Chirui-Reader/issues)
2. Review Gradle output with `--stacktrace` for detailed error information
3. Ensure all prerequisites are correctly installed
4. Try cleaning and rebuilding: `./gradlew clean build`
