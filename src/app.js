// Chirui Reader - Main Application
import { Router } from './router.js';
import { MangaService } from './manga-service.js';
import { HomeView } from './home-view.js';
import { CatalogView } from './catalog-view.js';
import { MangaDetailView } from './manga-detail-view.js';
import { ReaderView } from './reader-view.js';
import { FavoritesView } from './favorites-view.js';

console.log('Chirui Reader initializing...');

// Theme Management
class ThemeManager {
  constructor() {
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();
  }

  applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggle() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode);
    this.applyTheme();
  }
}

// Application Class
class ChiruiReaderApp {
  constructor() {
    this.router = new Router();
    this.mangaService = new MangaService();
    this.themeManager = new ThemeManager();
    this.currentView = null;
    
    this.contentContainer = document.querySelector('.content');
    this.sidebarContainer = document.querySelector('.sidebar');
    
    this.initializeRoutes();
    this.initializeUI();
  }

  /**
   * Initialize routes
   */
  initializeRoutes() {
    // Home route
    this.router.register('home', () => {
      this.renderView(() => {
        const view = new HomeView(this.contentContainer, this.mangaService, this.router);
        view.render();
        return view;
      });
      this.showSidebar(false);
    });

    // Catalog route
    this.router.register('catalog', () => {
      this.renderView(() => {
        const view = new CatalogView(this.contentContainer, this.mangaService, this.router);
        view.render();
        return view;
      });
      this.showSidebar(false);
    });

    // Manga detail route
    this.router.register('manga/:id', (params) => {
      this.renderView(() => {
        const view = new MangaDetailView(this.contentContainer, this.mangaService, this.router);
        view.render(params.id);
        return view;
      });
      this.showSidebar(false);
    });

    // Reader route
    this.router.register('reader/:id', (params) => {
      this.renderView(() => {
        const view = new ReaderView(this.contentContainer, this.mangaService, this.router);
        view.render(params.id, params);
        return view;
      });
      this.showSidebar(false);
    });

    // Favorites route
    this.router.register('favorites', () => {
      this.renderView(() => {
        const view = new FavoritesView(this.contentContainer, this.mangaService, this.router);
        view.render();
        return view;
      });
      this.showSidebar(false);
    });
  }

  /**
   * Render a view
   */
  renderView(viewFactory) {
    // Cleanup previous view if it has a destroy method
    if (this.currentView && typeof this.currentView.destroy === 'function') {
      this.currentView.destroy();
    }
    
    // Create and render new view
    this.currentView = viewFactory();
  }

  /**
   * Show or hide sidebar
   */
  showSidebar(show) {
    if (this.sidebarContainer) {
      this.sidebarContainer.style.display = show ? 'block' : 'none';
    }
    
    // Adjust main layout
    const appContainer = document.getElementById('app');
    if (appContainer) {
      if (show) {
        appContainer.style.gridTemplateColumns = '280px 1fr';
      } else {
        appContainer.style.gridTemplateColumns = '1fr';
      }
    }
  }

  /**
   * Initialize UI elements
   */
  initializeUI() {
    // Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.themeManager.toggle());
    }

    // Handle logo error
    const appLogo = document.getElementById('app-logo');
    if (appLogo) {
      appLogo.addEventListener('error', () => {
        appLogo.style.display = 'none';
      });
      
      // Make logo clickable to go home
      appLogo.style.cursor = 'pointer';
      appLogo.addEventListener('click', () => this.router.navigate('home'));
    }

    // Make header title clickable to go home
    const headerTitle = document.querySelector('.app-header h1');
    if (headerTitle) {
      headerTitle.style.cursor = 'pointer';
      headerTitle.addEventListener('click', () => this.router.navigate('home'));
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Chirui Reader...');
  const app = new ChiruiReaderApp();
  console.log('Chirui Reader loaded successfully!');
});
