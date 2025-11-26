# 🚀 Create Your First Release - Quick Start Guide

## Problem
Users are seeing "There aren't any releases here" because no release has been created yet.

## Solution
Create your first release using one of these simple methods:

---

## ⚡ Method 1: GitHub UI (Easiest - 2 Minutes)

### Step-by-Step:

1. **Go to the Releases Page**
   - Visit: https://github.com/swolem12/Chirui-Reader/releases
   - Click the green **"Draft a new release"** button

2. **Create the Tag**
   - Click "Choose a tag"
   - Type: `v0.1.0`
   - Click **"Create new tag: v0.1.0 on publish"**

3. **Fill in Release Details**
   - **Release title**: `Chirui Reader v0.1.0`
   - **Description**: Copy the content from `RELEASE_NOTES.md` or use this template:

```markdown
## Chirui Reader v0.1.0 - First Release! 🎉

### 📥 Download & Install

**For Android 7.0+**

1. Download the APK file below
2. Open the file on your Android device
3. Allow installation from unknown sources if prompted
4. Tap "Install"

### ✨ Features

- Browse manga sources
- Search and filter catalog
- Read chapters with swipe navigation
- Material 3 UI
- Offline reading support

See [RELEASE_NOTES.md](https://github.com/swolem12/Chirui-Reader/blob/main/RELEASE_NOTES.md) for complete details.
```

4. **Optional Settings**
   - ✅ Check "Set as the latest release"
   - ⚠️ Optionally check "Set as a pre-release" if you want to mark it as early access

5. **Publish!**
   - Click the green **"Publish release"** button
   - ✨ GitHub Actions will automatically:
     - Build the Android APK files
     - Upload them to the release
     - Make them available for download

6. **Wait for Build** (5-10 minutes)
   - Go to the "Actions" tab to watch the build progress
   - Once complete, the APK files will appear on your release page

7. **Done!** ✅
   - Your download page at https://swolem12.github.io/Chirui-Reader/ will automatically show the latest release
   - Users can now download the app!

---

## ⚡ Method 2: Trigger Workflow Manually

If you prefer to trigger the automated workflow directly:

1. **Go to Actions Tab**
   - Visit: https://github.com/swolem12/Chirui-Reader/actions
   - Click on **"Release APK"** workflow in the left sidebar

2. **Run Workflow**
   - Click the **"Run workflow"** dropdown button
   - Keep the default branch (main)
   - Version will default to `v0.1.0`
   - Click green **"Run workflow"** button

3. **Wait for Completion**
   - The workflow will build APKs and create the release automatically
   - Check the Releases page after 5-10 minutes

---

## ⚡ Method 3: Command Line (For Developers)

If you're comfortable with Git and have the repository cloned locally:

```bash
# Make sure you're on the main branch and up to date
git checkout main
git pull origin main

# Create and push the tag
git tag -a v0.1.0 -m "First release - Chirui Reader v0.1.0"
git push origin v0.1.0

# GitHub Actions will automatically build and create the release
```

Then wait 5-10 minutes for the GitHub Actions workflow to complete.

---

## 📋 What Happens After Creating the Release?

1. ✅ GitHub Actions builds the APK files
2. ✅ Creates a release on the Releases page
3. ✅ Uploads APK files to the release
4. ✅ Your download page (https://swolem12.github.io/Chirui-Reader/) automatically shows the latest release
5. ✅ Users can download and install the app!

---

## 🎯 Quick Verification

After creating the release:

1. Visit: https://github.com/swolem12/Chirui-Reader/releases
   - You should see "Chirui Reader v0.1.0"
   - APK files should be attached

2. Visit: https://swolem12.github.io/Chirui-Reader/
   - The download button should work
   - Should show version v0.1.0

3. Test the download:
   - Click the download button
   - APK should download successfully

---

## 🔮 Future Releases

For subsequent releases, just follow the same process but use the next version number:
- `v0.1.1` - For bug fixes
- `v0.2.0` - For new features
- `v1.0.0` - For the first stable release

See [RELEASE_GUIDE.md](https://github.com/swolem12/Chirui-Reader/blob/main/RELEASE_GUIDE.md) for detailed release management guidelines.

---

## ❓ Troubleshooting

**Q: The workflow failed!**
- Check the Actions tab for error details
- Most common issue: Gradle build problems
- Solution: The workflow uses the same build process as your CI

**Q: APKs not appearing on release?**
- Wait a few minutes - the build takes 5-10 minutes
- Check that the workflow completed successfully
- Ensure the workflow has write permissions in Settings → Actions

**Q: Download page not updating?**
- Clear your browser cache
- Wait a few minutes for GitHub's CDN to update
- The page fetches releases from GitHub's API automatically

---

## 📞 Need Help?

If you encounter issues:
1. Check the GitHub Actions logs in the "Actions" tab
2. Review [RELEASE_GUIDE.md](https://github.com/swolem12/Chirui-Reader/blob/main/RELEASE_GUIDE.md) for detailed documentation
3. Open an issue at https://github.com/swolem12/Chirui-Reader/issues

---

**Remember**: You only need to do this once to create the first release! After that, users will be able to download your app. 🎉
