// Chirui Reader - CORS Proxy Helper
// Handles CORS issues for scraper-based sources

export class CorsProxy {
  constructor() {
    // List of public CORS proxies (fallback mechanism)
    this.proxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
    ];
    
    this.currentProxyIndex = 0;
    this.enabled = true; // Enable by default for scraper sources
    
    // Load proxy preference from localStorage
    const savedProxy = localStorage.getItem('chirui-cors-proxy');
    if (savedProxy) {
      this.currentProxyIndex = parseInt(savedProxy, 10);
    }
  }

  /**
   * Enable/disable CORS proxy
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('chirui-cors-enabled', enabled.toString());
  }

  /**
   * Check if proxy is enabled
   */
  isEnabled() {
    const saved = localStorage.getItem('chirui-cors-enabled');
    return saved === null ? this.enabled : saved === 'true';
  }

  /**
   * Get current proxy URL
   */
  getCurrentProxy() {
    return this.proxies[this.currentProxyIndex];
  }

  /**
   * Switch to next proxy (for fallback)
   */
  switchToNextProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
    localStorage.setItem('chirui-cors-proxy', this.currentProxyIndex.toString());
    console.log(`[CorsProxy] Switched to proxy: ${this.getCurrentProxy()}`);
  }

  /**
   * Add custom proxy
   */
  addCustomProxy(proxyUrl) {
    if (!this.proxies.includes(proxyUrl)) {
      this.proxies.push(proxyUrl);
      console.log(`[CorsProxy] Added custom proxy: ${proxyUrl}`);
    }
  }

  /**
   * Proxify a URL
   */
  proxify(url) {
    if (!this.isEnabled()) {
      return url;
    }

    const proxy = this.getCurrentProxy();
    return `${proxy}${encodeURIComponent(url)}`;
  }

  /**
   * Fetch with automatic proxy fallback
   */
  async fetch(url, options = {}) {
    if (!this.isEnabled()) {
      return fetch(url, options);
    }

    let lastError;
    const maxRetries = this.proxies.length;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const proxiedUrl = this.proxify(url);
        console.log(`[CorsProxy] Fetching via proxy (attempt ${i + 1}/${maxRetries}): ${proxiedUrl}`);
        
        const response = await fetch(proxiedUrl, {
          ...options,
          headers: {
            ...options.headers,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        if (response.ok) {
          console.log(`[CorsProxy] Success with proxy: ${this.getCurrentProxy()}`);
          return response;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        console.warn(`[CorsProxy] Failed with proxy ${this.getCurrentProxy()}:`, error.message);
        lastError = error;
        
        // Try next proxy
        if (i < maxRetries - 1) {
          this.switchToNextProxy();
        }
      }
    }

    // All proxies failed
    throw new Error(`All CORS proxies failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Test if a proxy is working
   */
  async testProxy(proxyUrl, testUrl = 'https://httpbin.org/get') {
    try {
      const proxiedUrl = `${proxyUrl}${encodeURIComponent(testUrl)}`;
      const response = await fetch(proxiedUrl, { 
        method: 'GET',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      return response.ok;
    } catch (error) {
      console.warn(`[CorsProxy] Proxy test failed for ${proxyUrl}:`, error.message);
      return false;
    }
  }

  /**
   * Test all proxies and find working ones
   */
  async findWorkingProxies(testUrl = 'https://httpbin.org/get') {
    console.log('[CorsProxy] Testing all proxies...');
    const results = [];

    for (let i = 0; i < this.proxies.length; i++) {
      const proxy = this.proxies[i];
      const works = await this.testProxy(proxy, testUrl);
      results.push({ proxy, works });
      console.log(`[CorsProxy] Proxy ${proxy}: ${works ? '✅ Working' : '❌ Failed'}`);
    }

    // Switch to first working proxy
    const workingProxy = results.find(r => r.works);
    if (workingProxy) {
      this.currentProxyIndex = this.proxies.indexOf(workingProxy.proxy);
      localStorage.setItem('chirui-cors-proxy', this.currentProxyIndex.toString());
      console.log(`[CorsProxy] Using working proxy: ${workingProxy.proxy}`);
    }

    return results;
  }

  /**
   * Get proxy configuration info
   */
  getConfig() {
    return {
      enabled: this.isEnabled(),
      currentProxy: this.getCurrentProxy(),
      availableProxies: this.proxies,
      currentIndex: this.currentProxyIndex,
    };
  }
}

// Export singleton instance
export const corsProxy = new CorsProxy();
