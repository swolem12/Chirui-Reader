// Chirui Reader - Reader View Component

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

    const readerHTML = `
      <div class="reader-view">
        <div class="reader-header">
          <button id="back-to-manga" class="back-btn">← Back</button>
          <div class="reader-title">
            <h2>${this.escapeHtml(manga.title)}</h2>
            <span class="reader-chapter">Chapter ${chapterNumber}</span>
          </div>
          <button id="reader-settings" class="icon-btn">⚙️</button>
        </div>

        <div class="reader-content">
          <div class="reader-page-container">
            <img 
              id="reader-page-image" 
              src="${this.getPageUrl(mangaId, chapterNumber, this.currentPage)}" 
              alt="Page ${this.currentPage}"
              class="reader-page-image"
            />
          </div>
        </div>

        <div class="reader-controls">
          <button id="prev-page" class="reader-nav-btn" ${this.currentPage === 1 ? 'disabled' : ''}>
            ← Previous
          </button>
          
          <div class="reader-page-info">
            <span id="page-counter">${this.currentPage} / ${this.totalPages}</span>
            <input 
              type="range" 
              id="page-slider" 
              min="1" 
              max="${this.totalPages}" 
              value="${this.currentPage}"
              class="page-slider"
            />
          </div>
          
          <button id="next-page" class="reader-nav-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            Next →
          </button>
        </div>

        <div class="reader-chapter-nav">
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
      </div>
    `;

    this.container.innerHTML = readerHTML;
    this.attachEventListeners(mangaId, chapterNumber, chapters);
    this.setupKeyboardShortcuts(mangaId, chapterNumber, chapters);
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

    // Page navigation
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
    const settingsBtn = document.getElementById('reader-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        alert('Reader settings will be implemented in a future milestone.');
      });
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts(mangaId, chapterNumber, chapters) {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          this.previousPage();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case ' ':
          e.preventDefault();
          this.nextPage(mangaId, chapterNumber, chapters);
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
