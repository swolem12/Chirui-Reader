# Contributing to Chirui Reader Android

Thank you for your interest in contributing to Chirui Reader! This guide will help you get started with contributing to the Android application.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Chirui-Reader.git
   cd Chirui-Reader
   ```
3. **Set up the development environment** (see [BUILD_GUIDE.md](BUILD_GUIDE.md))
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

This project follows Kotlin coding conventions:
- Use 4 spaces for indentation
- Follow Kotlin naming conventions (camelCase for functions/properties, PascalCase for classes)
- Use meaningful variable and function names
- Add KDoc comments for public APIs
- Keep functions small and focused

### Architecture

The project follows Clean Architecture principles with multiple modules:

- **app**: Presentation layer (Jetpack Compose UI, ViewModels)
- **domain**: Business logic (use cases, domain models)
- **data**: Data layer (repositories, data sources, Room, Retrofit)
- **parsers**: Parser/source extensions

When adding features:
- Keep business logic in the `domain` layer
- Keep UI code in the `app` layer
- Use repositories in `data` to abstract data sources
- Follow MVVM pattern with ViewModels

### Testing

Write tests for your code:

```bash
# Run unit tests
cd android
./gradlew test

# Run instrumented tests (requires emulator/device)
./gradlew connectedAndroidTest
```

### Before Committing

1. **Build successfully**: `./gradlew build`
2. **Run tests**: `./gradlew test`
3. **Format code**: Follow Kotlin style guidelines
4. **Commit with clear messages**:
   ```bash
   git commit -m "Add feature: Description of your feature"
   ```

## Making Changes

### Adding a New Screen

1. Create the screen composable in `app/src/main/java/com/chirui/reader/[feature]/`
2. Create a ViewModel if needed
3. Add navigation route in `MainActivity.kt`
4. Update bottom navigation if it's a main destination

### Adding a Repository

1. Define the interface in `domain/src/main/java/com/chirui/domain/[feature]/`
2. Implement in `data/src/main/java/com/chirui/data/[feature]/`
3. Create a Hilt module in `data/src/main/java/com/chirui/data/di/`
4. Inject into ViewModels as needed

### Adding Dependencies

1. Update the appropriate `build.gradle.kts` file
2. Use version catalogs or consistent versioning
3. Document why the dependency is needed
4. Keep dependencies up to date with security patches

## Pull Request Process

1. **Update documentation** if needed
2. **Ensure all tests pass**
3. **Update the CHANGELOG** if applicable
4. **Create a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues
   - Screenshots for UI changes

### PR Checklist

- [ ] Code builds successfully
- [ ] Tests pass
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Follows code style guidelines
- [ ] Commit messages are clear

## Feature Requests and Bug Reports

### Reporting Bugs

When reporting bugs, include:
- Android version
- Device/emulator details
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs or screenshots

### Requesting Features

For feature requests:
- Describe the use case
- Explain why it's valuable
- Suggest implementation if possible
- Reference similar features in other apps

## Development Priorities

See [CHIRUI_ROADMAP.md](../CHIRUI_ROADMAP.md) and [docs/NEXT_STEPS_TODO.md](../docs/NEXT_STEPS_TODO.md) for current priorities.

Current focus areas:
- Asset import from Kotatsu forks
- Source extension management
- Reader improvements
- Download manager
- Library and tracking features

## Code Review

All submissions require review. We aim to:
- Review PRs within 48 hours
- Provide constructive feedback
- Help you improve your contribution

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Celebrate contributions

## Questions?

- Check existing [Issues](https://github.com/swolem12/Chirui-Reader/issues)
- Review documentation in `docs/`
- Ask in pull request discussions

Thank you for contributing to Chirui Reader! 🎉
