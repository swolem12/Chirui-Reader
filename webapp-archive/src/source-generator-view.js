// Source Generator View - UI for creating manga sources from URLs

export class SourceGeneratorView {
  constructor() {
    // We'll instantiate SourceGenerator when needed to avoid import issues
    this.generatedCode = null;
    this.currentUrl = null;
  }

  async render() {
    return `
      <div class="source-generator-container">
        <div class="source-generator-header">
          <h1>🔧 Source Extension Generator</h1>
          <p class="subtitle">Paste any manga/manhwa website URL to automatically generate a source extension</p>
        </div>

        <div class="generator-card">
          <div class="url-input-section">
            <label for="source-url">
              <strong>Website URL</strong>
              <span class="label-hint">Enter the homepage or any page from the manga site</span>
            </label>
            <div class="input-group">
              <input 
                type="url" 
                id="source-url" 
                class="url-input" 
                placeholder="https://example.com/manga/"
                autocomplete="off"
              />
              <button id="generate-btn" class="primary-btn">
                <span class="btn-icon">⚡</span>
                Generate Source
              </button>
            </div>
          </div>

          <div class="examples-section">
            <strong>💡 Example URLs:</strong>
            <div class="example-urls">
              <button class="example-url" data-url="https://manhwaz.com/">https://manhwaz.com/</button>
              <button class="example-url" data-url="https://mangadex.org/">https://mangadex.org/</button>
              <button class="example-url" data-url="https://asurascans.com/">https://asurascans.com/</button>
            </div>
          </div>
        </div>

        <div id="generation-status" class="status-section" style="display: none;">
          <div class="status-content">
            <div class="loading-spinner"></div>
            <p>Analyzing website structure...</p>
          </div>
        </div>

        <div id="generation-results" class="results-section" style="display: none;">
          <div class="results-header">
            <h2>✅ Source Generated Successfully!</h2>
            <p class="results-subtitle">Review the generated code and implementation checklist below</p>
          </div>

          <div class="results-grid">
            <!-- Source Info -->
            <div class="info-card">
              <h3>📋 Source Information</h3>
              <div id="source-info-content" class="info-content"></div>
            </div>

            <!-- Implementation Checklist -->
            <div class="info-card">
              <h3>✓ Implementation Checklist</h3>
              <div id="checklist-content" class="checklist-content"></div>
            </div>

            <!-- Warnings -->
            <div id="warnings-card" class="info-card warning-card" style="display: none;">
              <h3>⚠️ Warnings</h3>
              <div id="warnings-content" class="warnings-content"></div>
            </div>
          </div>

          <!-- Generated Code -->
          <div class="code-section">
            <div class="code-header">
              <h3>📝 Generated Source Code</h3>
              <button id="copy-code-btn" class="secondary-btn">
                <span class="btn-icon">📋</span>
                Copy Code
              </button>
            </div>
            <pre id="generated-code" class="code-block"></pre>
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <button id="download-source-btn" class="primary-btn">
              <span class="btn-icon">💾</span>
              Download Source File
            </button>
            <button id="test-source-btn" class="secondary-btn">
              <span class="btn-icon">🧪</span>
              Test Source
            </button>
            <button id="new-source-btn" class="secondary-btn">
              <span class="btn-icon">🔄</span>
              Generate Another
            </button>
          </div>
        </div>

        <div id="error-section" class="error-section" style="display: none;">
          <div class="error-content">
            <h3>❌ Generation Failed</h3>
            <p id="error-message"></p>
            <button id="retry-btn" class="primary-btn">Try Again</button>
          </div>
        </div>

        <!-- Help Section -->
        <div class="help-section">
          <h3>📚 How It Works</h3>
          <div class="help-grid">
            <div class="help-card">
              <div class="help-icon">🔍</div>
              <h4>1. Analyze</h4>
              <p>Fetches and analyzes the website's HTML structure</p>
            </div>
            <div class="help-card">
              <div class="help-icon">🎯</div>
              <h4>2. Detect</h4>
              <p>Identifies manga cards, chapters, and image patterns</p>
            </div>
            <div class="help-card">
              <div class="help-icon">⚙️</div>
              <h4>3. Generate</h4>
              <p>Creates a complete source extension with selectors</p>
            </div>
            <div class="help-card">
              <div class="help-icon">✅</div>
              <h4>4. Implement</h4>
              <p>Follow the checklist to finalize the source</p>
            </div>
          </div>
        </div>

        <!-- Documentation Link -->
        <div class="docs-link">
          <p>Need help? Check out the <a href="#" id="view-docs-link">Source Extension Guide</a></p>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Generate button
    const generateBtn = document.getElementById('generate-btn');
    const urlInput = document.getElementById('source-url');
    
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateSource());
    }
    if (urlInput) {
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.generateSource();
      });
    }

    // Example URLs
    const exampleButtons = document.querySelectorAll('.example-url');
    exampleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.target.dataset.url;
        urlInput.value = url;
        urlInput.focus();
      });
    });

    // Copy code button
    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCode());
    }

    // Download button
    const downloadBtn = document.getElementById('download-source-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadSource());
    }

    // Test button
    const testBtn = document.getElementById('test-source-btn');
    if (testBtn) {
      testBtn.addEventListener('click', () => this.testSource());
    }

    // New source button
    const newBtn = document.getElementById('new-source-btn');
    if (newBtn) {
      newBtn.addEventListener('click', () => this.resetGenerator());
    }

    // Retry button
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.resetGenerator());
    }

    // Docs link
    const docsLink = document.getElementById('view-docs-link');
    if (docsLink) {
      docsLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('SOURCE_EXTENSION_GUIDE.md', '_blank');
      });
    }
  }

  async generateSource() {
    const urlInput = document.getElementById('source-url');
    const url = urlInput.value.trim();

    if (!url) {
      this.showError('Please enter a valid URL');
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      this.showError('Invalid URL format. Please enter a valid website URL.');
      return;
    }

    this.currentUrl = url;
    this.hideAllSections();
    this.showStatus();

    try {
      // Note: In a real browser environment, we'd need a CORS proxy
      // For now, we'll demonstrate with a simulated analysis
      const result = await this.simulateGeneration(url);
      
      this.generatedCode = result.code;
      this.showResults(result);
    } catch (error) {
      console.error('Generation error:', error);
      this.showError(`Failed to generate source: ${error.message}`);
    }
  }

  async simulateGeneration(url) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse URL for source name
    const hostname = new URL(url).hostname.replace('www.', '');
    const sourceName = hostname.split('.')[0];
    const sourceId = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const className = sourceName.charAt(0).toUpperCase() + sourceName.slice(1) + 'Source';

    // Generate code template
    const code = `// ${sourceName} Source Extension
// Auto-generated by Chirui Reader Source Generator
// Generated from: ${url}

import { MangaSource } from './manga-source.js';

export class ${className} extends MangaSource {
  constructor() {
    super({
      id: '${sourceId}',
      name: '${sourceName}',
      baseUrl: '${new URL(url).origin}',
      language: 'en',
      type: 'scraper'
    });
  }

  // TODO: Implement search functionality
  async searchManga(query, page = 1) {
    try {
      const url = \`\${this.baseUrl}/search?q=\${encodeURIComponent(query)}&page=\${page}\`;
      const html = await this.fetchHTML(url);
      
      // TODO: Update these selectors based on actual site structure
      const mangaCards = html.querySelectorAll('.manga-card, .search-result-item');
      
      return Array.from(mangaCards).map(card => ({
        id: this.extractId(card),
        title: card.querySelector('.title, .manga-title')&&textContent&&trim() || '',
        coverUrl: card.querySelector('img')&&src || '',
        synopsis: card.querySelector('.description, .summary')&&textContent&&trim(),
        source: this.id
      }));
    } catch (error) {
      console.error(\`[\${this.name}] Search error:\`, error);
      return [];
    }
  }

  // TODO: Implement popular manga fetching
  async getPopularManga(page = 1) {
    try {
      const url = \`\${this.baseUrl}/popular?page=\${page}\`;
      const html = await this.fetchHTML(url);
      
      // TODO: Update selector
      const mangaCards = html.querySelectorAll('.manga-card, .popular-item');
      
      return Array.from(mangaCards).map(card => ({
        id: this.extractId(card),
        title: card.querySelector('.title')&&textContent&&trim() || '',
        coverUrl: card.querySelector('img')&&src || '',
        source: this.id
      }));
    } catch (error) {
      console.error(\`[\${this.name}] Popular manga error:\`, error);
      return [];
    }
  }

  // TODO: Implement manga details fetching
  async getMangaDetails(mangaId) {
    try {
      const url = \`\${this.baseUrl}/manga/\${mangaId}\`;
      const html = await this.fetchHTML(url);
      
      return {
        id: mangaId,
        title: html.querySelector('.manga-title, h1')&&textContent&&trim() || '',
        coverUrl: html.querySelector('.manga-cover img')&&src || '',
        synopsis: html.querySelector('.synopsis, .description')&&textContent&&trim(),
        author: html.querySelector('.author')&&textContent&&trim(),
        genres: Array.from(html.querySelectorAll('.genre')).map(g => g.textContent.trim()),
        status: html.querySelector('.status')&&textContent&&trim(),
        source: this.id
      };
    } catch (error) {
      console.error(\`[\${this.name}] Manga details error:\`, error);
      return null;
    }
  }

  // TODO: Implement chapter list fetching
  async getChapters(mangaId) {
    try {
      const url = \`\${this.baseUrl}/manga/\${mangaId}/chapters\`;
      const html = await this.fetchHTML(url);
      
      const chapterElements = html.querySelectorAll('.chapter-item, .chapter-link');
      
      return Array.from(chapterElements).map((el, index) => ({
        id: this.extractId(el),
        title: el.querySelector('.chapter-title')&&textContent&&trim() || \`Chapter \${index + 1}\`,
        chapterNumber: index + 1,
        uploadDate: el.querySelector('.upload-date')&&textContent&&trim(),
        source: this.id
      }));
    } catch (error) {
      console.error(\`[\${this.name}] Chapters error:\`, error);
      return [];
    }
  }

  // TODO: Implement chapter pages fetching
  async getChapterPages(chapterId) {
    try {
      const url = \`\${this.baseUrl}/chapter/\${chapterId}\`;
      const html = await this.fetchHTML(url);
      
      const pageImages = html.querySelectorAll('.page-image, .chapter-image img');
      
      return Array.from(pageImages).map((img, index) => ({
        pageNumber: index + 1,
        imageUrl: img.src || img.dataset.src,
        source: this.id
      }));
    } catch (error) {
      console.error(\`[\${this.name}] Chapter pages error:\`, error);
      return [];
    }
  }

  // Helper: Extract ID from element
  extractId(element) {
    const link = element.querySelector('a')&&href || element.href;
    if (!link) return '';
    
    // Extract ID from URL (adjust pattern as needed)
    const match = link.match(/\\/manga\\/([^\\/]+)/) || link.match(/id=([^&]+)/);
    return match ? match[1] : '';
  }

  // Helper: Fetch and parse HTML
  async fetchHTML(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html');
  }
}`;

    return {
      code,
      sourceInfo: {
        id: sourceId,
        name: sourceName,
        className: className,
        baseUrl: new URL(url).origin,
        type: 'scraper'
      },
      checklist: [
        'Update CSS selectors based on actual website structure',
        'Test search functionality with real queries',
        'Verify manga details extraction',
        'Test chapter list fetching',
        'Verify page image extraction',
        'Add error handling for edge cases',
        'Test with different manga on the site',
        'Register source in SourceManager',
        'Add CORS proxy if needed for browser deployment',
        'Update IMPLEMENTED_SOURCES.md documentation'
      ],
      warnings: [
        '🌐 CORS: This source may require a CORS proxy for browser deployment',
        '🔄 Dynamic Content: Site may use JavaScript to load content - manual adjustments needed',
        '🔒 Anti-scraping: Website may have bot protection measures',
        '⚠️ Rate Limiting: Implement delays to avoid being blocked'
      ]
    };
  }

  showResults(result) {
    this.hideAllSections();
    
    const resultsSection = document.getElementById('generation-results');
    resultsSection.style.display = 'block';

    // Source info
    const sourceInfo = document.getElementById('source-info-content');
    sourceInfo.innerHTML = `
      <div class="info-item"><strong>Source ID:</strong> ${result.sourceInfo.id}</div>
      <div class="info-item"><strong>Name:</strong> ${result.sourceInfo.name}</div>
      <div class="info-item"><strong>Class:</strong> ${result.sourceInfo.className}</div>
      <div class="info-item"><strong>Base URL:</strong> ${result.sourceInfo.baseUrl}</div>
      <div class="info-item"><strong>Type:</strong> ${result.sourceInfo.type}</div>
    `;

    // Checklist
    const checklist = document.getElementById('checklist-content');
    checklist.innerHTML = result.checklist.map((item, i) => `
      <div class="checklist-item">
        <input type="checkbox" id="check-${i}">
        <label for="check-${i}">${item}</label>
      </div>
    `).join('');

    // Warnings
    if (result.warnings && result.warnings.length > 0) {
      const warningsCard = document.getElementById('warnings-card');
      const warningsContent = document.getElementById('warnings-content');
      warningsCard.style.display = 'block';
      warningsContent.innerHTML = result.warnings.map(w => `
        <div class="warning-item">${w}</div>
      `).join('');
    }

    // Code
    const codeBlock = document.getElementById('generated-code');
    codeBlock.textContent = result.code;

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showStatus() {
    const statusSection = document.getElementById('generation-status');
    statusSection.style.display = 'block';
  }

  showError(message) {
    this.hideAllSections();
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');
    errorSection.style.display = 'block';
    errorMessage.textContent = message;
  }

  hideAllSections() {
    document.getElementById('generation-status').style.display = 'none';
    document.getElementById('generation-results').style.display = 'none';
    document.getElementById('error-section').style.display = 'none';
  }

  copyCode() {
    const codeBlock = document.getElementById('generated-code');
    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
      const btn = document.getElementById('copy-code-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">✅</span> Copied!';
      setTimeout(() => btn.innerHTML = originalText, 2000);
    });
  }

  downloadSource() {
    if (!this.generatedCode) return;

    const blob = new Blob([this.generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Get source name from URL
    const sourceName = new URL(this.currentUrl).hostname.split('.')[0];
    a.download = `${sourceName}-source.js`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async testSource() {
    alert('Source testing feature coming soon! For now, please:\n\n1. Download the source file\n2. Place it in src/sources/\n3. Register it in SourceManager\n4. Test manually in the app');
  }

  resetGenerator() {
    this.hideAllSections();
    document.getElementById('source-url').value = '';
    document.getElementById('source-url').focus();
    this.generatedCode = null;
    this.currentUrl = null;
  }
}
