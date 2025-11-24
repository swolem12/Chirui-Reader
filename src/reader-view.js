// Chirui Reader - Reader View Component

import { ReaderSettings } from './reader-settings.js';

export class ReaderView {
  constructor(container, mangaService, historyService, router) {
    this.container = container;
    this.mangaService = mangaService;
    this.historyService = historyService;
    this.router = router;
    this.currentPage = 1;
    this.totalPages = 20; // Sample pages
    this.currentMangaId = null;
    this.currentChapterNumber = null;
    this.readerSettings = new ReaderSettings();
    
    // Zoom and pan state
    this.zoomLevel = 100;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.lastTouchX = 0;
    this.lastTouchY = 0;
    
    // Fullscreen state
    this.isFullscreen = false;
    
    // Control visibility
    this.controlsVisible = true;
    this.controlsTimeout = null;
  }

  /**
   * Render the reader view
   * @param {string} mangaId - Manga ID
   * @param {Object} params - Parameters including chapter number
   */
  render(mangaId, params = {}) {
    const manga = this.mangaService.getMangaById(mangaId);
    
    if (!manga) {
      this.renderNotFound();
      return;
    }

    const chapterNumber = parseInt(params.chapter) || 1;
    const chapters = this.mangaService.getChapters(mangaId);
    const currentChapter = chapters.find(ch => ch.number === chapterNumber);

    if (!currentChapter) {
      this.renderChapterNotFound(mangaId);
      return;
    }

    this.totalPages = currentChapter.pages;
    this.currentPage = 1;
    this.currentMangaId = mangaId;
    this.currentChapterNumber = chapterNumber;

    // Track reading history
    this.historyService.addHistoryEntry(mangaId, chapterNumber, this.currentPage);

    const readingMode = this.readerSettings.get('readingMode');
    
    const readerHTML = `
      <div class="reader-view ${readingMode === 'webtoon' ? 'webtoon-mode' : 'paged-mode'}" id="reader-view">
        <div class="reader-header ${this.controlsVisible ? '' : 'hidden'}" id="reader-header">
          <button id="back-to-manga" class="back-btn">← Back</button>
          <div class="reader-title">
            <h2>${this.escapeHtml(manga.title)}</h2>
            <span class="reader-chapter">Chapter ${chapterNumber}</span>
          </div>
          <div class="reader-header-actions">
            <button id="reading-mode-toggle" class="icon-btn" title="Toggle Reading Mode">
              ${readingMode === 'webtoon' ? '📄' : '📜'}
            </button>
            <button id="fullscreen-toggle" class="icon-btn" title="Fullscreen">
              ${this.isFullscreen ? '🗗' : '⛶'}
            </button>
            <button id="reader-settings-btn" class="icon-btn" title="Settings">⚙️</button>
          </div>
        </div>

        ${readingMode === 'webtoon' ? this.renderWebtoonContent(mangaId, chapterNumber) : this.renderPagedContent(mangaId, chapterNumber)}

        <div class="reader-controls ${this.controlsVisible ? '' : 'hidden'}" id="reader-controls">
          ${readingMode === 'paged' ? this.renderPagedControls() : ''}
          
          <div class="reader-page-info">
            <span id="page-counter">${this.currentPage} / ${this.totalPages}</span>
            ${readingMode === 'paged' ? `
              <input 
                type="range" 
                id="page-slider" 
                min="1" 
                max="${this.totalPages}" 
                value="${this.currentPage}"
                class="page-slider"
              />
            ` : ''}
          </div>
          
          ${readingMode === 'paged' ? `<button id="next-page" class="reader-nav-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''}>Next →</button>` : ''}
        </div>

        <div class="reader-chapter-nav ${this.controlsVisible ? '' : 'hidden'}" id="reader-chapter-nav">
          <button id="prev-chapter" class="chapter-nav-btn" ${chapterNumber === 1 ? 'disabled' : ''}>
            ← Previous Chapter
          </button>
          <select id="chapter-select" class="chapter-select">
            ${chapters.map(ch => 
              `<option value="${ch.number}" ${ch.number === chapterNumber ? 'selected' : ''}>
                Chapter ${ch.number}${ch.title ? ': ' + this.escapeHtml(ch.title) : ''}
              </option>`
            ).join('')}
          </select>
          <button id="next-chapter" class="chapter-nav-btn" ${chapterNumber === chapters.length ? 'disabled' : ''}>
            Next Chapter →
          </button>
        </div>

        <!-- Reader Settings Panel -->
        <div class="reader-settings-panel" id="reader-settings-panel" style="display: none;">
          <div class="settings-panel-header">
            <h3>Reader Settings</h3>
            <button id="close-settings" class="icon-btn">×</button>
          </div>
          <div class="settings-panel-content">
            <div class="setting-group">
              <label>Reading Mode</label>
              <select id="setting-reading-mode" class="setting-select">
                <option value="paged" ${readingMode === 'paged' ? 'selected' : ''}>Paged</option>
                <option value="webtoon" ${readingMode === 'webtoon' ? 'selected' : ''}>Webtoon/Vertical Scroll</option>
              </select>
            </div>
            <div class="setting-group">
              <label>Page Fit</label>
              <select id="setting-pagefit" class="setting-select">
                <option value="fit-width" ${this.readerSettings.get('pagefit') === 'fit-width' ? 'selected' : ''}>Fit Width</option>
                <option value="fit-height" ${this.readerSettings.get('pagefit') === 'fit-height' ? 'selected' : ''}>Fit Height</option>
                <option value="original" ${this.readerSettings.get('pagefit') === 'original' ? 'selected' : ''}>Original Size</option>
              </select>
            </div>
            <div class="setting-group">
              <label>Background Color</label>
              <input type="color" id="setting-bg-color" value="${this.readerSettings.get('backgroundColor')}" class="setting-input">
            </div>
            <div class="setting-group">
              <label>Brightness: <span id="brightness-value">${this.readerSettings.get('brightness')}%</span></label>
              <input type="range" id="setting-brightness" min="50" max="150" value="${this.readerSettings.get('brightness')}" class="setting-slider">
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="setting-auto-hide" ${this.readerSettings.get('autoHideControls') ? 'checked' : ''}>
                Auto-hide controls
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = readerHTML;
    this.applyReaderSettings();
    this.attachEventListeners(mangaId, chapterNumber, chapters);
    this.setupKeyboardShortcuts(mangaId, chapterNumber, chapters);
    this.setupAutoHideControls();
    
    // Setup zoom and pan for paged mode
    if (readingMode === 'paged') {
      this.setupZoomAndPan();
    }
  }

  /**
   * Render paged content
   */
  renderPagedContent(mangaId, chapterNumber) {
    return `
      <div class="reader-content" id="reader-content">
        <div class="reader-page-container" id="reader-page-container">
          <img 
            id="reader-page-image" 
            src="${this.getPageUrl(mangaId, chapterNumber, this.currentPage)}" 
            alt="Page ${this.currentPage}"
            class="reader-page-image"
            draggable="false"
          />
          <div class="zoom-controls">
            <button id="zoom-out" class="zoom-btn" title="Zoom Out">−</button>
            <span id="zoom-level">${this.zoomLevel}%</span>
            <button id="zoom-in" class="zoom-btn" title="Zoom In">+</button>
            <button id="zoom-reset" class="zoom-btn" title="Reset Zoom">⟲</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render webtoon content
   */
  renderWebtoonContent(mangaId, chapterNumber) {
    const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return `
      <div class="reader-content webtoon-content" id="reader-content">
        <div class="webtoon-container" id="webtoon-container">
          ${pages.map(pageNum => `
            <img 
              src="${this.getPageUrl(mangaId, chapterNumber, pageNum)}" 
              alt="Page ${pageNum}"
              class="webtoon-page"
              data-page="${pageNum}"
              loading="lazy"
            />
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render paged controls
   */
  renderPagedControls() {
    return `
      <button id="prev-page" class="reader-nav-btn" ${this.currentPage === 1 ? 'disabled' : ''}>
        ← Previous
      </button>
    `;
  }

  /**
   * Get page URL (placeholder for now)
   */
  getPageUrl(mangaId, chapterNumber, pageNumber) {
    // This would normally fetch from an API
    // For now, return placeholder images
    const colors = ['3f51b5', '1976d2', '26a69a', '4caf50', 'ff9800', 'd32f2f'];
    const color = colors[pageNumber % colors.length];
    return `https://via.placeholder.com/800x1200/${color}/ffffff?text=Page+${pageNumber}`;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(mangaId, chapterNumber, chapters) {
    // Back button
    const backBtn = document.getElementById('back-to-manga');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.router.navigate(`manga/${mangaId}`));
    }

    // Page navigation (paged mode)
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousPage());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextPage(mangaId, chapterNumber, chapters));
    }

    // Page slider
    const slider = document.getElementById('page-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.goToPage(parseInt(e.target.value));
      });
    }

    // Chapter navigation
    const prevChapterBtn = document.getElementById('prev-chapter');
    const nextChapterBtn = document.getElementById('next-chapter');
    
    if (prevChapterBtn) {
      prevChapterBtn.addEventListener('click', () => {
        if (chapterNumber > 1) {
          this.router.navigate(`reader/${mangaId}`, { chapter: chapterNumber - 1 });
        }
      });
    }
    
    if (nextChapterBtn) {
      nextChapterBtn.addEventListener('click', () => {
        if (chapterNumber < chapters.length) {
          this.router.navigate(`reader/${mangaId}`, { chapter: chapterNumber + 1 });
        }
      });
    }

    // Chapter select
    const chapterSelect = document.getElementById('chapter-select');
    if (chapterSelect) {
      chapterSelect.addEventListener('change', (e) => {
        this.router.navigate(`reader/${mangaId}`, { chapter: e.target.value });
      });
    }

    // Settings button
    const settingsBtn = document.getElementById('reader-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.toggleSettingsPanel());
    }

    // Close settings button
    const closeSettingsBtn = document.getElementById('close-settings');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => this.toggleSettingsPanel());
    }

    // Reading mode toggle
    const readingModeBtn = document.getElementById('reading-mode-toggle');
    if (readingModeBtn) {
      readingModeBtn.addEventListener('click', () => this.toggleReadingMode(mangaId, chapterNumber));
    }

    // Fullscreen toggle
    const fullscreenBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // Settings panel controls
    this.attachSettingsListeners(mangaId, chapterNumber);

    // Zoom controls (paged mode)
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoomIn());
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.zoomOut());
    }
    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => this.resetZoom());
    }

    // Webtoon mode scroll tracking
    if (this.readerSettings.get('readingMode') === 'webtoon') {
      this.setupWebtoonScrollTracking();
    }
  }

  /**
   * Attach settings panel listeners
   */
  attachSettingsListeners(mangaId, chapterNumber) {
    const settingReadingMode = document.getElementById('setting-reading-mode');
    const settingPagefit = document.getElementById('setting-pagefit');
    const settingBgColor = document.getElementById('setting-bg-color');
    const settingBrightness = document.getElementById('setting-brightness');
    const settingAutoHide = document.getElementById('setting-auto-hide');

    if (settingReadingMode) {
      settingReadingMode.addEventListener('change', (e) => {
        this.readerSettings.set('readingMode', e.target.value);
        this.router.navigate(`reader/${mangaId}`, { chapter: chapterNumber });
      });
    }

    if (settingPagefit) {
      settingPagefit.addEventListener('change', (e) => {
        this.readerSettings.set('pagefit', e.target.value);
        this.applyPageFit();
      });
    }

    if (settingBgColor) {
      settingBgColor.addEventListener('change', (e) => {
        this.readerSettings.set('backgroundColor', e.target.value);
        this.applyBackgroundColor();
      });
    }

    if (settingBrightness) {
      settingBrightness.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('brightness-value').textContent = value + '%';
        this.readerSettings.set('brightness', parseInt(value));
        this.applyBrightness();
      });
    }

    if (settingAutoHide) {
      settingAutoHide.addEventListener('change', (e) => {
        this.readerSettings.set('autoHideControls', e.target.checked);
      });
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts(mangaId, chapterNumber, chapters) {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts if typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }

      switch(e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          if (this.readerSettings.get('readingMode') === 'paged') {
            this.previousPage();
          }
          break;
        case 'arrowright':
        case 'd':
        case ' ':
          e.preventDefault();
          if (this.readerSettings.get('readingMode') === 'paged') {
            this.nextPage(mangaId, chapterNumber, chapters);
          }
          break;
        case 'f':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case '+':
        case '=':
          e.preventDefault();
          if (this.readerSettings.get('readingMode') === 'paged') {
            this.zoomIn();
          }
          break;
        case '-':
        case '_':
          e.preventDefault();
          if (this.readerSettings.get('readingMode') === 'paged') {
            this.zoomOut();
          }
          break;
        case '0':
          e.preventDefault();
          if (this.readerSettings.get('readingMode') === 'paged') {
            this.resetZoom();
          }
          break;
        case 's':
          e.preventDefault();
          this.toggleSettingsPanel();
          break;
        case 'm':
          e.preventDefault();
          this.toggleReadingMode(mangaId, chapterNumber);
          break;
      }
    };

    // Remove any existing listener
    if (this.keyPressHandler) {
      document.removeEventListener('keydown', this.keyPressHandler);
    }
    
    this.keyPressHandler = handleKeyPress;
    document.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Cleanup function
   */
  cleanup() {
    // Remove keyboard listener
    if (this.keyPressHandler) {
      document.removeEventListener('keydown', this.keyPressHandler);
      this.keyPressHandler = null;
    }

    // Clear timeouts
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }

    // Exit fullscreen if active
    if (this.isFullscreen && document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  /**
   * Go to next page
   */
  nextPage(mangaId, chapterNumber, chapters) {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    } else {
      // Ask to go to next chapter
      if (chapterNumber < chapters.length) {
        if (confirm('You\'ve reached the end of this chapter. Go to the next chapter?')) {
          this.router.navigate(`reader/${mangaId}`, { chapter: chapterNumber + 1 });
        }
      }
    }
  }

  /**
   * Go to specific page
   */
  goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePage();
    }
  }

  /**
   * Update page display
   */
  updatePage() {
    const pageImage = document.getElementById('reader-page-image');
    const pageCounter = document.getElementById('page-counter');
    const pageSlider = document.getElementById('page-slider');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (pageImage) {
      const mangaId = this.router.getCurrentRoute().split('/')[1];
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
      const chapterNumber = parseInt(urlParams.get('chapter')) || 1;
      pageImage.src = this.getPageUrl(mangaId, chapterNumber, this.currentPage);
      pageImage.alt = `Page ${this.currentPage}`;
    }

    if (pageCounter) {
      pageCounter.textContent = `${this.currentPage} / ${this.totalPages}`;
    }

    if (pageSlider) {
      pageSlider.value = this.currentPage;
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage === this.totalPages;
    }

    // Update reading history
    if (this.currentMangaId && this.currentChapterNumber) {
      this.historyService.addHistoryEntry(this.currentMangaId, this.currentChapterNumber, this.currentPage);
    }
  }

  /**
   * Render not found message
   */
  renderNotFound() {
    this.container.innerHTML = `
      <div class="not-found">
        <h2>Manga Not Found</h2>
        <p>The manga you're trying to read doesn't exist.</p>
        <button id="back-to-catalog" class="primary-btn">← Back to Catalog</button>
      </div>
    `;
    
    const backBtn = document.getElementById('back-to-catalog');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }
  }

  /**
   * Render chapter not found message
   */
  renderChapterNotFound(mangaId) {
    this.container.innerHTML = `
      <div class="not-found">
        <h2>Chapter Not Found</h2>
        <p>The chapter you're trying to read doesn't exist.</p>
        <button id="back-to-manga" class="primary-btn">← Back to Manga</button>
      </div>
    `;
    
    const backBtn = document.getElementById('back-to-manga');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.router.navigate(`manga/${mangaId}`));
    }
  }

  /**
   * Toggle settings panel
   */
  toggleSettingsPanel() {
    const panel = document.getElementById('reader-settings-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  /**
   * Toggle reading mode
   */
  toggleReadingMode(mangaId, chapterNumber) {
    const currentMode = this.readerSettings.get('readingMode');
    const newMode = currentMode === 'paged' ? 'webtoon' : 'paged';
    this.readerSettings.set('readingMode', newMode);
    this.router.navigate(`reader/${mangaId}`, { chapter: chapterNumber });
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen() {
    const readerView = document.getElementById('reader-view');
    if (!document.fullscreenElement) {
      if (readerView.requestFullscreen) {
        readerView.requestFullscreen();
      } else if (readerView.webkitRequestFullscreen) {
        readerView.webkitRequestFullscreen();
      } else if (readerView.msRequestFullscreen) {
        readerView.msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  /**
   * Setup zoom and pan for paged mode
   */
  setupZoomAndPan() {
    const pageImage = document.getElementById('reader-page-image');
    const container = document.getElementById('reader-page-container');
    
    if (!pageImage || !container) return;

    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          this.zoomIn();
        } else {
          this.zoomOut();
        }
      }
    }, { passive: false });

    // Pan functionality
    let startX = 0, startY = 0;
    let isDragging = false;

    pageImage.addEventListener('mousedown', (e) => {
      if (this.zoomLevel > 100) {
        isDragging = true;
        startX = e.clientX - this.panX;
        startY = e.clientY - this.panY;
        pageImage.style.cursor = 'grabbing';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        this.panX = e.clientX - startX;
        this.panY = e.clientY - startY;
        this.applyZoomAndPan();
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        pageImage.style.cursor = this.zoomLevel > 100 ? 'grab' : 'default';
      }
    });

    // Touch support for mobile
    let touchStartX = 0, touchStartY = 0;
    
    pageImage.addEventListener('touchstart', (e) => {
      if (this.zoomLevel > 100 && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX - this.panX;
        touchStartY = e.touches[0].clientY - this.panY;
      }
    });

    pageImage.addEventListener('touchmove', (e) => {
      if (this.zoomLevel > 100 && e.touches.length === 1) {
        e.preventDefault();
        this.panX = e.touches[0].clientX - touchStartX;
        this.panY = e.touches[0].clientY - touchStartY;
        this.applyZoomAndPan();
      }
    }, { passive: false });
  }

  /**
   * Zoom in
   */
  zoomIn() {
    const maxZoom = this.readerSettings.get('maxZoom') || 300;
    if (this.zoomLevel < maxZoom) {
      this.zoomLevel = Math.min(this.zoomLevel + 25, maxZoom);
      this.applyZoomAndPan();
    }
  }

  /**
   * Zoom out
   */
  zoomOut() {
    if (this.zoomLevel > 100) {
      this.zoomLevel = Math.max(this.zoomLevel - 25, 100);
      if (this.zoomLevel === 100) {
        this.panX = 0;
        this.panY = 0;
      }
      this.applyZoomAndPan();
    }
  }

  /**
   * Reset zoom
   */
  resetZoom() {
    this.zoomLevel = 100;
    this.panX = 0;
    this.panY = 0;
    this.applyZoomAndPan();
  }

  /**
   * Apply zoom and pan transforms
   */
  applyZoomAndPan() {
    const pageImage = document.getElementById('reader-page-image');
    const zoomLevelDisplay = document.getElementById('zoom-level');
    
    if (pageImage) {
      pageImage.style.transform = `scale(${this.zoomLevel / 100}) translate(${this.panX / (this.zoomLevel / 100)}px, ${this.panY / (this.zoomLevel / 100)}px)`;
      pageImage.style.cursor = this.zoomLevel > 100 ? 'grab' : 'default';
    }
    
    if (zoomLevelDisplay) {
      zoomLevelDisplay.textContent = `${this.zoomLevel}%`;
    }
  }

  /**
   * Apply reader settings
   */
  applyReaderSettings() {
    this.applyPageFit();
    this.applyBackgroundColor();
    this.applyBrightness();
  }

  /**
   * Apply page fit setting
   */
  applyPageFit() {
    const pageImage = document.getElementById('reader-page-image');
    const pageFit = this.readerSettings.get('pagefit');
    
    if (pageImage) {
      pageImage.classList.remove('fit-width', 'fit-height', 'original');
      pageImage.classList.add(pageFit);
    }
  }

  /**
   * Apply background color
   */
  applyBackgroundColor() {
    const content = document.getElementById('reader-content');
    const bgColor = this.readerSettings.get('backgroundColor');
    
    if (content) {
      content.style.backgroundColor = bgColor;
    }
  }

  /**
   * Apply brightness filter
   */
  applyBrightness() {
    const pageImage = document.getElementById('reader-page-image');
    const webtoonImages = document.querySelectorAll('.webtoon-page');
    const brightness = this.readerSettings.get('brightness');
    const filterValue = `brightness(${brightness}%)`;
    
    if (pageImage) {
      pageImage.style.filter = filterValue;
    }
    
    webtoonImages.forEach(img => {
      img.style.filter = filterValue;
    });
  }

  /**
   * Setup auto-hide controls
   */
  setupAutoHideControls() {
    if (!this.readerSettings.get('autoHideControls')) return;

    const readerView = document.getElementById('reader-view');
    if (!readerView) return;

    const showControls = () => {
      this.controlsVisible = true;
      const header = document.getElementById('reader-header');
      const controls = document.getElementById('reader-controls');
      const chapterNav = document.getElementById('reader-chapter-nav');
      
      if (header) header.classList.remove('hidden');
      if (controls) controls.classList.remove('hidden');
      if (chapterNav) chapterNav.classList.remove('hidden');

      // Reset timeout
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = setTimeout(() => {
        this.hideControls();
      }, this.readerSettings.get('autoHideDelay') || 3000);
    };

    const hideControls = () => {
      this.controlsVisible = false;
      const header = document.getElementById('reader-header');
      const controls = document.getElementById('reader-controls');
      const chapterNav = document.getElementById('reader-chapter-nav');
      
      if (header) header.classList.add('hidden');
      if (controls) controls.classList.add('hidden');
      if (chapterNav) chapterNav.classList.add('hidden');
    };

    this.hideControls = hideControls;

    // Show controls on mouse move or touch
    readerView.addEventListener('mousemove', showControls);
    readerView.addEventListener('touchstart', showControls);
    readerView.addEventListener('click', showControls);
  }

  /**
   * Setup webtoon scroll tracking
   */
  setupWebtoonScrollTracking() {
    const webtoonContainer = document.getElementById('webtoon-container');
    if (!webtoonContainer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.dataset.page);
          this.currentPage = pageNum;
          this.updatePageCounter();
          
          // Update history
          if (this.currentMangaId && this.currentChapterNumber) {
            this.historyService.addHistoryEntry(
              this.currentMangaId,
              this.currentChapterNumber,
              this.currentPage
            );
          }
        }
      });
    }, {
      threshold: 0.5
    });

    const pages = webtoonContainer.querySelectorAll('.webtoon-page');
    pages.forEach(page => observer.observe(page));
  }

  /**
   * Update page counter only
   */
  updatePageCounter() {
    const pageCounter = document.getElementById('page-counter');
    if (pageCounter) {
      pageCounter.textContent = `${this.currentPage} / ${this.totalPages}`;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Cleanup when view is destroyed
   */
  destroy() {
    if (this.keyPressHandler) {
      document.removeEventListener('keydown', this.keyPressHandler);
    }
  }
}
