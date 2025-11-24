// Chirui Reader - Reader Settings Manager

export class ReaderSettings {
  constructor() {
    this.settings = this.loadSettings();
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    const saved = localStorage.getItem('chirui-reader-settings');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default settings
    return {
      readingMode: 'paged', // 'paged' or 'webtoon'
      pagefit: 'fit-width', // 'fit-width', 'fit-height', 'original'
      backgroundColor: '#2c2c2c',
      brightness: 100,
      autoHideControls: true,
      autoHideDelay: 3000,
      enableZoom: true,
      maxZoom: 300,
      tapToNavigate: true
    };
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    localStorage.setItem('chirui-reader-settings', JSON.stringify(this.settings));
  }

  /**
   * Get a specific setting
   */
  get(key) {
    return this.settings[key];
  }

  /**
   * Set a specific setting
   */
  set(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  /**
   * Get all settings
   */
  getAll() {
    return { ...this.settings };
  }

  /**
   * Reset to defaults
   */
  reset() {
    this.settings = this.loadSettings();
    localStorage.removeItem('chirui-reader-settings');
  }
}
