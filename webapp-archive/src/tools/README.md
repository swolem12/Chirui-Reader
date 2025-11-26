# Chirui Reader - Source Generator Tool

This tool helps analyze manga websites and generate source extension templates.

## Usage

### 1. Analyze a Website

```javascript
import { SourceGenerator } from './source-generator.js';

const generator = new SourceGenerator();
const analysis = await generator.analyzeWebsite('https://example-manga-site.com');
console.log(analysis);
```

### 2. Generate Source Template

```javascript
const template = generator.generateSourceTemplate(analysis);
console.log(template);
```

### 3. Test Generated Source

```javascript
// Save the template to a file
// Implement the missing methods
// Test with the framework
```

## Features

- **Pattern Detection**: Automatically detects common patterns in manga websites
- **Selector Extraction**: Identifies CSS selectors for manga lists, details, chapters, and pages
- **Template Generation**: Creates a ready-to-use source template
- **Best Practices**: Includes error handling, rate limiting, and proper structure

## Limitations

- Cannot handle JavaScript-heavy sites that require browser rendering
- May not detect all edge cases
- Generated code requires manual review and testing
- Some sites may require custom logic

## Manual Steps After Generation

1. Review the generated template
2. Test each method with real data
3. Add any custom logic needed
4. Handle edge cases
5. Add error handling for site-specific issues
6. Test thoroughly before deployment

## Example Workflow

1. Run analyzer on target website
2. Review detected patterns
3. Generate template
4. Create new file in `src/sources/`
5. Import and register in `source-manager.js`
6. Test all methods
7. Deploy!
