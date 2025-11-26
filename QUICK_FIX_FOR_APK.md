# 🚀 Quick Fix: Get APK Files Immediately

## The Fastest Way to Make APK Files Available

Since the "Beta" release has no APK files, here's the **quickest way** to fix this and make the APK available for download:

---

## ⚡ Option 1: Manually Trigger the Workflow (5-10 minutes)

This is the **fastest** method to get APK files:

### Steps:

1. **Go to the Actions tab**
   - Visit: https://github.com/swolem12/Chirui-Reader/actions

2. **Select the "Release APK" workflow**
   - Click on "Release APK" in the left sidebar

3. **Run the workflow**
   - Click the "Run workflow" button (gray dropdown on the right)
   - Branch: `main` (default - leave as is)
   - Version tag: Enter `v0.1.0` (or any version starting with `v`)
   - Click the green "Run workflow" button

4. **Wait for completion** (5-10 minutes)
   - The workflow will:
     - ✅ Build debug APK
     - ✅ Build release APK
     - ✅ Create a new release with tag `v0.1.0`
     - ✅ Upload both APK files to the release
   
5. **Done!** 
   - Visit: https://github.com/swolem12/Chirui-Reader/releases
   - Your new `v0.1.0` release will have APK files attached
   - The download page at https://swolem12.github.io/Chirui-Reader/ will automatically update

---

## ⚡ Option 2: Create a New Release via GitHub UI (Easier)

If you prefer using the GitHub interface:

### Steps:

1. **Go to Releases**
   - Visit: https://github.com/swolem12/Chirui-Reader/releases
   - Click "Draft a new release"

2. **Create a tag**
   - Click "Choose a tag"
   - Type: `v0.1.0`
   - Click "Create new tag: v0.1.0 on publish"

3. **Fill in details**
   - Release title: `Chirui Reader v0.1.0`
   - Description: Copy from the template below

4. **Publish**
   - Click "Publish release"
   - GitHub Actions will automatically build and upload the APK files

5. **Wait 5-10 minutes** for the build to complete

### Recommended Release Description:

```markdown
## Chirui Reader v0.1.0 - First Official Release! 🎉

### 📥 Download & Install

**For Android 7.0+**

1. Download the APK file below
2. Open the file on your Android device
3. Allow installation from unknown sources if prompted
4. Tap "Install"

### ✨ Features

- Browse manga from multiple sources
- Search and filter catalog
- Read chapters with swipe navigation
- Material 3 UI with dark mode
- Offline reading support
- Chapter downloads

### 📝 What's New

This is the first official release of Chirui Reader!

See [RELEASE_NOTES.md](https://github.com/swolem12/Chirui-Reader/blob/main/RELEASE_NOTES.md) for complete details.
```

---

## 📋 What About the "Beta" Release?

The "Beta" release can be:
- **Left as-is**: It won't cause problems, users will download from the new `v0.1.0` release instead
- **Deleted** (optional): If you want to clean it up to avoid confusion

To delete the Beta release:
1. Go to https://github.com/swolem12/Chirui-Reader/releases
2. Click on "Beta" release
3. Click "Delete" button at the bottom
4. Confirm deletion

---

## ✅ Verification Steps

After the workflow completes:

1. **Check the release page**
   - Visit: https://github.com/swolem12/Chirui-Reader/releases
   - You should see "Chirui Reader v0.1.0"
   - Two APK files should be attached:
     - `chirui-reader-v0.1.0-release.apk` (~10-50 MB)
     - `chirui-reader-v0.1.0-debug.apk` (~10-50 MB)

2. **Check the download page**
   - Visit: https://swolem12.github.io/Chirui-Reader/
   - Click the download button
   - It should download the APK file directly

3. **Test the APK**
   - Download the APK
   - Install it on an Android device
   - Verify the app launches

---

## 🔮 For Future Releases

To avoid this issue in the future:

1. **Always use `v*` tags** (e.g., `v0.1.0`, `v0.2.0`, `v1.0.0`)
2. **Follow Semantic Versioning**: 
   - `v0.x.y` - Pre-1.0 releases
   - `v1.0.0` - First stable release
   - `v1.1.0` - New features
   - `v1.0.1` - Bug fixes

3. The workflow will automatically run and attach APK files

---

## ❓ Troubleshooting

**Q: The workflow is failing!**
- Check the logs in the Actions tab
- Most common issue: Build dependencies or permissions
- The workflow has been tested and should work

**Q: APK files not appearing?**
- Wait the full 5-10 minutes for the build to complete
- Check that the workflow completed successfully (green checkmark)
- Refresh the releases page

**Q: Can't trigger the workflow?**
- You need write access to the repository
- The workflow may be disabled in Settings → Actions
- Try using Option 2 (Create Release via UI) instead

---

## 📞 Need Help?

If you run into issues:
1. Check the Actions tab for error logs
2. Review the workflow file: `.github/workflows/release-apk.yml`
3. Open an issue: https://github.com/swolem12/Chirui-Reader/issues

---

**Result**: After following these steps, users will be able to download the APK from the releases page or the download page! 🎉
