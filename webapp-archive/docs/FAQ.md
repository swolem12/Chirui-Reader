# Frequently Asked Questions

## "How does the converter work to turn what we build here into an SDK?"

### Short Answer
**There is no converter** - this project does not create or involve an SDK.

### What This Project Actually Does

Chirui Reader is a **web application** that gets deployed to GitHub Pages:

1. You write HTML, CSS, and JavaScript files
2. You commit them to this repository
3. GitHub Pages serves these files directly to users
4. Users access the site and their browsers run the code

**No conversion happens** - the files are served as-is.

### Why No SDK?

This project creates an **end-user application** (a manga reader), not a **developer tool** (an SDK).

| What it IS | What it is NOT |
|------------|----------------|
| ✅ Web app for reading manga | ❌ SDK for developers |
| ✅ Deployed to GitHub Pages | ❌ Library/framework |
| ✅ End-user facing | ❌ Developer-facing |
| ✅ Application | ❌ Build tool |

### More Information

- See [ARCHITECTURE.md](../ARCHITECTURE.md) for detailed architecture explanation
- See [CHIRUI_ROADMAP.md](../CHIRUI_ROADMAP.md) for project development plan
- See [README.md](../README.md) for quick project overview

### Still Confused?

If you expected this to be an SDK project, you may be thinking of a different repository or have a misunderstanding about the project's goals. This is specifically a manga reader application for end users, not a development kit.
