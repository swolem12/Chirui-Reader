// Chirui Reader - Settings View
// User settings and configuration

import { corsProxy } from './utils/cors-proxy.js';
import { SourceManager } from './sources/source-manager.js';

export class SettingsView {
  constructor() {
    this.sourceManager = new SourceManager();
  }

  render() {
    const config = corsProxy.getConfig();
    
    return `
      <div class="settings-container">
        <h1>Settings</h1>
        
        <section class="settings-section">
          <h2>🌐 CORS Proxy Configuration</h2>
          <p class="settings-description">
            CORS proxy is required for scraper-based manga sources to work on GitHub Pages.
            API-based sources like MangaDex work without a proxy.
          </p>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" id="cors-proxy-enabled" ${config.enabled ? 'checked' : ''}>
              <span>Enable CORS Proxy</span>
            </label>
            <p class="setting-help">
              Enables proxy for scraper sources. Disable if you have CORS issues.
            </p>
          </div>

          <div class="setting-item">
            <label class="setting-label">Current Proxy:</label>
            <select id="cors-proxy-selector" class="setting-select">
              ${config.availableProxies.map((proxy, index) => `
                <option value="${index}" ${index === config.currentIndex ? 'selected' : ''}>
                  ${proxy}
                </option>
              `).join('')}
            </select>
            <p class="setting-help">
              Select which CORS proxy to use. Try different proxies if one fails.
            </p>
          </div>

          <div class="setting-item">
            <label class="setting-label">Custom Proxy URL:</label>
            <div class="input-group">
              <input type="text" id="custom-proxy-url" class="setting-input" 
                     placeholder="https://your-proxy.com/?">
              <button id="add-proxy-btn" class="btn">Add Proxy</button>
            </div>
            <p class="setting-help">
              Add your own CORS proxy server. Must end with ? or =url=
            </p>
          </div>

          <div class="setting-actions">
            <button id="test-proxy-btn" class="btn btn-primary">Test Current Proxy</button>
            <button id="test-all-proxies-btn" class="btn">Test All Proxies</button>
          </div>

          <div id="proxy-test-results" class="test-results"></div>
        </section>

        <section class="settings-section">
          <h2>📚 Source Management</h2>
          <p class="settings-description">
            Manage manga sources, enable/disable them, and view their status.
          </p>
          
          <div id="source-list" class="source-list">
            <!-- Source items will be dynamically loaded -->
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" id="use-real-sources" ${localStorage.getItem('chirui-use-real-sources') === 'true' ? 'checked' : ''}>
              <span>Use Real Manga Sources</span>
            </label>
            <p class="setting-help">
              Switch between real manga sources and mock data. Real sources require CORS proxy.
            </p>
          </div>
        </section>

        <section class="settings-section">
          <h2>💾 Data Management</h2>
          <p class="settings-description">
            Manage your local data and preferences.
          </p>
          
          <div class="setting-actions">
            <button id="clear-cache-btn" class="btn">Clear Cache</button>
            <button id="export-data-btn" class="btn">Export Data</button>
            <button id="import-data-btn" class="btn">Import Data</button>
            <button id="reset-settings-btn" class="btn btn-danger">Reset All Settings</button>
          </div>
        </section>

        <section class="settings-section">
          <h2>ℹ️ About</h2>
          <div class="about-info">
            <p><strong>Chirui Reader</strong> v1.0.0</p>
            <p>A modern web-based manga reader with multi-source support</p>
            <p>
              <a href="https://github.com/swolem12/Chirui-Reader" target="_blank">GitHub Repository</a>
            </p>
          </div>
        </section>
      </div>
    `;
  }

  async afterRender() {
    await this.renderSourceList();
    this.setupEventListeners();
  }

  /**
   * Render the list of available sources
   */
  async renderSourceList() {
    const sourceListEl = document.getElementById('source-list');
    if (!sourceListEl) return;

    const allSources = this.sourceManager.getAllSources();
    
    let html = '<div class="source-items">';
    
    for (const source of allSources) {
      const isEnabled = this.sourceManager.isSourceEnabled(source.id);
      const sourceInfo = source.getSourceInfo();
      
      html += `
        <div class="source-item ${isEnabled ? 'enabled' : 'disabled'}">
          <div class="source-info">
            <div class="source-header">
              <span class="source-name">${sourceInfo.name}</span>
              <span class="source-status ${isEnabled ? 'status-enabled' : 'status-disabled'}">
                ${isEnabled ? '✓ Enabled' : '○ Disabled'}
              </span>
            </div>
            <div class="source-details">
              <span class="source-badge">${sourceInfo.lang.toUpperCase()}</span>
              <span class="source-badge source-type-${sourceInfo.baseUrl.includes('api') ? 'api' : 'scraper'}">
                ${sourceInfo.baseUrl.includes('api') ? 'API' : 'Scraper'}
              </span>
              ${sourceInfo.supportsLatest ? '<span class="source-badge">Latest Updates</span>' : ''}
              ${sourceInfo.isNsfw ? '<span class="source-badge badge-nsfw">NSFW</span>' : ''}
            </div>
            <div class="source-url">${sourceInfo.baseUrl}</div>
          </div>
          <div class="source-actions">
            <label class="toggle-switch">
              <input type="checkbox" class="source-toggle" data-source-id="${source.id}" ${isEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      `;
    }
    
    html += '</div>';
    
    // Add source count summary
    const enabledCount = this.sourceManager.getEnabledSources().length;
    const totalCount = allSources.length;
    html += `
      <div class="source-summary">
        <strong>${enabledCount}</strong> of <strong>${totalCount}</strong> sources enabled
      </div>
    `;
    
    sourceListEl.innerHTML = html;
    
    // Setup source toggle listeners
    document.querySelectorAll('.source-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const sourceId = e.target.dataset.sourceId;
        if (e.target.checked) {
          this.sourceManager.enableSource(sourceId);
          this.showMessage(`${sourceId} enabled`, 'success');
        } else {
          this.sourceManager.disableSource(sourceId);
          this.showMessage(`${sourceId} disabled`, 'info');
        }
        // Refresh the source list to update UI
        this.renderSourceList();
      });
    });
  }

  setupEventListeners() {
    // CORS Proxy Enable/Disable
    document.getElementById('cors-proxy-enabled')?.addEventListener('change', (e) => {
      corsProxy.setEnabled(e.target.checked);
      this.showMessage('CORS proxy ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
    });

    // CORS Proxy Selector
    document.getElementById('cors-proxy-selector')?.addEventListener('change', (e) => {
      corsProxy.currentProxyIndex = parseInt(e.target.value, 10);
      localStorage.setItem('chirui-cors-proxy', e.target.value);
      this.showMessage('Proxy changed to: ' + corsProxy.getCurrentProxy(), 'success');
    });

    // Add Custom Proxy
    document.getElementById('add-proxy-btn')?.addEventListener('click', () => {
      const input = document.getElementById('custom-proxy-url');
      const url = input.value.trim();
      
      if (!url) {
        this.showMessage('Please enter a proxy URL', 'error');
        return;
      }

      if (!url.match(/^https?:\/\//)) {
        this.showMessage('Proxy URL must start with http:// or https://', 'error');
        return;
      }

      corsProxy.addCustomProxy(url);
      input.value = '';
      this.showMessage('Custom proxy added!', 'success');
      
      // Refresh the selector
      setTimeout(() => window.location.hash = '#/settings', 100);
    });

    // Test Current Proxy
    document.getElementById('test-proxy-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('test-proxy-btn');
      btn.disabled = true;
      btn.textContent = 'Testing...';
      
      const results = document.getElementById('proxy-test-results');
      results.innerHTML = '<p>Testing current proxy...</p>';

      try {
        const works = await corsProxy.testProxy(corsProxy.getCurrentProxy());
        results.innerHTML = `
          <div class="test-result ${works ? 'success' : 'error'}">
            ${works ? '✅ Proxy is working!' : '❌ Proxy test failed'}
          </div>
        `;
      } catch (error) {
        results.innerHTML = `<div class="test-result error">❌ Error: ${error.message}</div>`;
      }

      btn.disabled = false;
      btn.textContent = 'Test Current Proxy';
    });

    // Test All Proxies
    document.getElementById('test-all-proxies-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('test-all-proxies-btn');
      btn.disabled = true;
      btn.textContent = 'Testing...';
      
      const results = document.getElementById('proxy-test-results');
      results.innerHTML = '<p>Testing all proxies... This may take a minute.</p>';

      try {
        const testResults = await corsProxy.findWorkingProxies();
        results.innerHTML = `
          <div class="test-results-list">
            ${testResults.map(r => `
              <div class="test-result ${r.works ? 'success' : 'error'}">
                ${r.works ? '✅' : '❌'} ${r.proxy}
              </div>
            `).join('')}
          </div>
        `;
      } catch (error) {
        results.innerHTML = `<div class="test-result error">❌ Error: ${error.message}</div>`;
      }

      btn.disabled = false;
      btn.textContent = 'Test All Proxies';
    });

    // Use Real Sources Toggle
    document.getElementById('use-real-sources')?.addEventListener('change', (e) => {
      localStorage.setItem('chirui-use-real-sources', e.target.checked.toString());
      this.showMessage('Real sources ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
      this.showMessage('Reload the page for changes to take effect', 'info');
    });

    // Clear Cache
    document.getElementById('clear-cache-btn')?.addEventListener('click', () => {
      if (confirm('Clear all cached data?')) {
        // Clear only cache, not settings
        const keysToKeep = ['chirui-cors-proxy', 'chirui-cors-enabled', 'chirui-theme', 'chirui-favorites', 'chirui-history'];
        Object.keys(localStorage).forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        this.showMessage('Cache cleared!', 'success');
      }
    });

    // Reset All Settings
    document.getElementById('reset-settings-btn')?.addEventListener('click', () => {
      if (confirm('Reset ALL settings and data? This cannot be undone.')) {
        localStorage.clear();
        this.showMessage('All settings reset! Reloading...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  }

  showMessage(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

export const settingsView = new SettingsView();
