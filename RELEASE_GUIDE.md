# How to Create a Release

This guide explains how to create and publish a new release of Chirui Reader.

## Automated Release Process

The project uses GitHub Actions to automatically build and publish APK files when you create a new release.

### Method 1: Create a Release via GitHub UI (Recommended)

1. **Go to Releases Page**
   - Navigate to https://github.com/swolem12/Chirui-Reader/releases
   - Click "Draft a new release"

2. **Create a Tag**
   - Click "Choose a tag"
   - Type a new tag name (e.g., `v0.1.0`, `v0.1.1`, `v0.2.0`)
   - Click "Create new tag: vX.X.X on publish"

3. **Fill Release Details**
   - **Release title**: `Chirui Reader vX.X.X`
   - **Description**: The workflow will auto-generate, but you can customize
   - Mark as "pre-release" if it's not stable

4. **Publish Release**
   - Click "Publish release"
   - GitHub Actions will automatically:
     - Build the APKs (release and debug)
     - Upload them to the release
     - Make them available for download

5. **Done!**
   - The download page at https://swolem12.github.io/Chirui-Reader/ will automatically show the latest release

### Method 2: Trigger Manual Build

1. **Go to Actions**
   - Navigate to https://github.com/swolem12/Chirui-Reader/actions
   - Click "Release APK" workflow

2. **Run Workflow**
   - Click "Run workflow"
   - Enter the version (e.g., `v0.1.0`)
   - Click "Run workflow"

3. **Wait for Build**
   - The workflow will build and create a release
   - Check the Releases page after completion

### Method 3: Push a Git Tag

```bash
# Make sure you're on the main branch
git checkout main
git pull

# Create and push a tag
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# GitHub Actions will automatically build and release
```

## Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):
- **Major** (v1.0.0): Breaking changes, major features
- **Minor** (v0.1.0): New features, backward compatible
- **Patch** (v0.1.1): Bug fixes, minor improvements

### Examples
- `v0.1.0` - First early access release
- `v0.2.0` - Added download manager
- `v0.2.1` - Fixed reader crash bug
- `v1.0.0` - First stable release

## What Happens When You Create a Release

1. **GitHub Actions Triggers** - The `release-apk.yml` workflow starts
2. **Build Process**
   - Sets up Java 17
   - Builds release APK
   - Builds debug APK
3. **Create Release**
   - Creates GitHub release with your tag
   - Generates release notes
4. **Upload APKs**
   - Uploads `chirui-reader-vX.X.X-release.apk`
   - Uploads `chirui-reader-vX.X.X-debug.apk`
5. **Download Page Updates**
   - The index.html page automatically fetches the latest release
   - Users can immediately download the new version

## Pre-Release Checklist

Before creating a release:

- [ ] All tests pass
- [ ] App builds successfully
- [ ] Version number updated in `android/app/build.gradle.kts`
- [ ] RELEASE_NOTES.md updated with changes
- [ ] No critical bugs in main branch
- [ ] Tested on at least one physical device

## Post-Release

After creating a release:

1. **Test the Download**
   - Visit https://swolem12.github.io/Chirui-Reader/
   - Verify the download link works
   - Test installation on a device

2. **Announce**
   - Update README.md if needed
   - Post in discussions/social media
   - Notify users of new features

3. **Monitor**
   - Check for bug reports
   - Monitor GitHub issues
   - Prepare hotfix if needed

## Troubleshooting

### Release Failed to Build
- Check the Actions tab for error messages
- Ensure all dependencies are available
- Verify the Gradle build works locally

### APKs Not Uploaded
- Check workflow permissions in Settings → Actions
- Ensure `contents: write` permission is set
- Check if the build artifacts exist

### Download Page Not Updating
- Clear browser cache
- Wait a few minutes for CDN to update
- Check if the release is marked as "latest"

## Example Release Notes Template

```markdown
## Chirui Reader v0.X.X

### 📥 Download & Install

Download the APK and install on your Android device (7.0+)

### ✨ What's New

- New feature 1
- New feature 2
- Improvement to X

### 🐛 Bug Fixes

- Fixed issue with Y
- Resolved crash when Z

### 📝 Full Changelog

See [RELEASE_NOTES.md](link) for complete details
```

---

**Need help?** Open an issue at https://github.com/swolem12/Chirui-Reader/issues
