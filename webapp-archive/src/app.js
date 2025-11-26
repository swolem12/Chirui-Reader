// Chirui Reader - Main Application
import { Router } from './router.js';
import { MangaService } from './manga-service.js';
import { HistoryService } from './history-service.js';
import { HomeView } from './home-view.js';
import { CatalogView } from './catalog-view.js';
import { MangaDetailView } from './manga-detail-view.js';
import { ReaderView } from './reader-view.js';
import { FavoritesView } from './favorites-view.js';
import { HistoryView } from './history-view.js';
import { SourceGeneratorView } from './source-generator-view.js';
import { SettingsView } from './settings-view.js';

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
    this.historyService = new HistoryService();
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
        const view = new HomeView(this.contentContainer, this.mangaService, this.historyService, this.router);
        view.render();
        return view;
      });
      this.showSidebar(false);
    });

    // Catalog route (async)
    this.router.register('catalog', async () => {
      await this.renderViewAsync(async () => {
        const view = new CatalogView(this.contentContainer, this.mangaService, this.router);
        await view.render();
        return view;
      });
      this.showSidebar(false);
    });

    // Manga detail route
    this.router.register('manga/:id', (params) => {
      this.renderView(() => {
        const view = new MangaDetailView(this.contentContainer, this.mangaService, this.router);
        view.render(params.id, params);
        return view;
      });
      this.showSidebar(false);
    });

    // Reader route
    this.router.register('reader/:id', (params) => {
      this.renderView(() => {
        const view = new ReaderView(this.contentContainer, this.mangaService, this.historyService, this.router);
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

    // History route
    this.router.register('history', () => {
      this.renderView(() => {
        const view = new HistoryView(this.contentContainer, this.mangaService, this.historyService, this.router);
        view.render();
        return view;
      });
      this.showSidebar(false);
    });

    // Source Generator route
    this.router.register('source-generator', async () => {
      await this.renderViewAsync(async () => {
        const view = new SourceGeneratorView();
        const html = await view.render();
        this.contentContainer.innerHTML = html;
        await view.afterRender();
        return view;
      });
      this.showSidebar(false);
    });

    // Settings route
    this.router.register('settings', async () => {
      await this.renderViewAsync(async () => {
        const view = new SettingsView();
        const html = view.render();
        this.contentContainer.innerHTML = html;
        await view.afterRender();
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
   * Render a new view (async version)
   */
  async renderViewAsync(viewFactory) {
    // Cleanup previous view
    if (this.currentView && typeof this.currentView.cleanup === 'function') {
      this.currentView.cleanup();
    }
    
    // Create and render new view
    this.currentView = await viewFactory();
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

    // Navigation buttons
    const navHomeBtn = document.getElementById('nav-home');
    if (navHomeBtn) {
      navHomeBtn.addEventListener('click', () => this.router.navigate('home'));
    }

    const navCatalogBtn = document.getElementById('nav-catalog');
    if (navCatalogBtn) {
      navCatalogBtn.addEventListener('click', () => this.router.navigate('catalog'));
    }

    const navFavoritesBtn = document.getElementById('nav-favorites');
    if (navFavoritesBtn) {
      navFavoritesBtn.addEventListener('click', () => this.router.navigate('favorites'));
    }

    const navHistoryBtn = document.getElementById('nav-history');
    if (navHistoryBtn) {
      navHistoryBtn.addEventListener('click', () => this.router.navigate('history'));
    }

    const navSourceGeneratorBtn = document.getElementById('nav-source-generator');
    if (navSourceGeneratorBtn) {
      navSourceGeneratorBtn.addEventListener('click', () => this.router.navigate('source-generator'));
    }

    const navSettingsBtn = document.getElementById('nav-settings');
    if (navSettingsBtn) {
      navSettingsBtn.addEventListener('click', () => this.router.navigate('settings'));
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
  
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 500);
    }
  }, 500);
});
